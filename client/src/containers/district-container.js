import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeMenuPage } from '../actions';
import { District } from '../components/pages';
import { toast } from 'react-toastify';
import axiosInterceptors from 'axios';

class DistrictContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            error: null,
            region: null,
            regionOptions: [],
            districts: [],
            districtUz: '',
            errorMsgInput: {},
        }
        this.textRef = React.createRef(true)
        this.textRef = true
    }
    componentWillUnmount() {
        this.textRef = false
    }



    componentDidMount() {
        const { changeMenuPage, match: { params: { id } } } = this.props;

        changeMenuPage('district');

        this.getRegions();
        this.getAssortedDistricts();
        if (id) this.getOneDistrict(id);

    }

    componentDidUpdate(prevProps, prevState) {
        const { match: { params: { id } } } = this.props;
        const { match: { params: { id: prevId } } } = prevProps;
        if (id !== prevId && id) {
            this.getOneDistrict(id);
        }
    }

    inputControl = (e) => {
        const { value, name } = e.target;
        this.setState({ [name]: value });
    }

    selectControl = (value) => {
        this.setState({ region: value });
    }

    validatorError = (errors) => {
        if (!errors) return {};

        const errorsMsg = {};
        errors.forEach((item) => {
            errorsMsg[item.param] = item.msg;
        });

        return errorsMsg;
    }

    geniratorRegionOptions = (regions) => {
        const regionOptions = [];

        regions.forEach((item) => {
            regionOptions.push({ label: item.nameUz, value: item._id });
        });

        return regionOptions;
    }

    getRegions = () => {
        axiosInterceptors.get('/api/region')
            .then((response) => {
                const { regions } = response.data;

                const regionOptions = this.geniratorRegionOptions(regions);
                if (this.textRef) this.setState({ regionOptions });
            })
            .catch((err) => {
                toast.error('Вы не получили список регионов, обнавите страницу');
            })
    }

    getRegionsId = (id) => {
        axiosInterceptors.get(`/api/region/${id}`).then(res => {
            console.log(res.data.region.nameUz)
        }).catch(err => {
            console.log(err)
        })
    }

    getAssortedDistricts = () => {
        this.setState({ loading: true, error: null });
        axiosInterceptors.get('/api/district/all')
            .then((response) => {
                const { districts } = response.data;
                if (this.textRef) this.setState({ districts, loading: false })
            })
            .catch((err) => {
                this.setState({ loading: false, error: true })
            })
    }

    getOneDistrict = (districtId) => {
        axiosInterceptors.get(`/api/district/${districtId}`)
            .then((response) => {
                console.log(response.data);
                const { district: { nameUz, nameRu, nameOz, regionId: { _id, nameUz: regionNameUz } } } = response.data

                if (this.textRef) this.setState({
                    districtUz: nameUz,
                    districtOz: nameOz,
                    districtRu: nameRu,
                    region: {
                        name: 'region',
                        label: regionNameUz,
                        value: _id
                    }
                })
            })
            .catch((err) => {
                const { errorMessage } = err.response.data;
                toast.error(errorMessage);
            })
    }

    handlerDistrict = () => {
        const { match: { params: { id } }, history } = this.props;
        const { districtUz, region } = this.state;

        const method = id ? 'put' : 'post';
        const apiUrl = id ? `/api/district/${id}` : '/api/district';
        const newDistrict = { nameUz: districtUz, regionId: region ? region.value : '' };

        const editDistrict = { nameUz: districtUz };

        const sentData = id ? editDistrict : newDistrict;

        axiosInterceptors[method](apiUrl, sentData)
            .then((response) => {
                const { succesMessage } = response.data;
                toast.success(succesMessage);
                if (id) history.push('/district/');
                this.getAssortedDistricts();
                this.setState({ districtUz: '', region: null, errorMsgInput: {} })

            })
            .catch((err) => {
                const { errors, errorMessage } = err.response.data;
                const errorMsgInput = this.validatorError(errors);
                toast.error(errorMessage);
                this.setState({ errorMsgInput });
            })
    }

    render() {
        return <District
            {...this.state}
            inputControl={this.inputControl}
            selectControl={this.selectControl}
            handlerDistrict={this.handlerDistrict}
            districtId={this.props.match.params.id} />
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeMenuPage: (menuPage) => dispatch(changeMenuPage(menuPage))
    }
};

export default connect(undefined, mapDispatchToProps)(DistrictContainer);