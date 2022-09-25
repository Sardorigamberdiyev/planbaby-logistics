import React from 'react';
import { MyManager } from '../components/pages';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { changeMenuPage } from '../actions';
import monthSwitch from '../utils/monthSwitch';
import axiosInterceptors from '../utils/axiosInterceptors';

class OperatorKuryerContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            regions: '',
            distrcits: '',
            products: [],
            operators: [],
            name: '',
            phone: '',
            login: '',
            loading: true,
            loadingUpdate: true,
            btnLastDisabled: false,
            idError: null,
            error: null,
            orders: [],
            order: [],
            skip: 0,
            limit: 6,
            dateInterval: false,
            user: {},
            todayMonth: 0,
            ordersLength: 0,
            districtsId: [],
            term: null,
            startYear: null,
            startMonth: null,
            startDay: null,
            endYear: null,
            endMonth: null,
            endDay: null,
            managerType: true,
            managerId: ''
        }
        this.textRef = React.createRef(true)
        this.textRef = true
    }
    componentWillUnmount() {
        this.textRef = false
    }


    componentDidMount() {
        const { changeMenuPage, match: { params: { id } } } = this.props;
        const { history } = this.props;
        changeMenuPage('manager');
        history.push(`/manager/${id}`);
        this.getUser()
        this.getManagerData()
        this.getOpStatistics();
        this.getOrders(0)
    }
    componentDidUpdate(prevProps, prevState) {
        const { managerType: prevManagerType, skip: prevSkip, term: prevTerm, districtsId: prevDistrictId, startDay: prevStartDay, startYear: prevStartYear, startMonth: prevStartMonth, endDay: prevEndDay, endYear: prevEndYear, endMonth: prevEndMonth } = prevState;
        const { managerType, skip, term, startDay, startMonth, startYear, endMonth, endDay, endYear, districtsId } = this.state;

        if (prevTerm !== term
            || prevManagerType !== managerType
            || prevStartDay !== startDay
            || startYear !== prevStartYear
            || startMonth !== prevStartMonth
            || endDay !== prevEndDay
            || endYear !== prevEndYear
            || endMonth !== prevEndMonth
            || districtsId.length !== prevDistrictId.length) {
            this.getOrders(0, 'change');
            this.setState({ btnLastDisabled: false })
        } else if (prevSkip !== skip && skip !== 0) {
            this.getOrders(skip)
            this.setState({
                btnLastDisabled: this.state.orders.length < skip ? true : false
            })
        }
    }
    setManagerType = (managerType) => {
        this.setState({ managerType })
    }
    inputControl = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    getOpStatistics = () => {
        const { match: { params: { id } } } = this.props;
        const apiStatistics = id === 'my-order' ? '/api/order/manager/statistics/' : `/api/order/manager/statistics/${id}`;
        axiosInterceptors.get(apiStatistics)
            .then(res => {
                this.getOrders(0, 'change')
                const { order, todayMonth } = res.data
                const todayDay = monthSwitch(todayMonth)
                if (this.textRef) this.setState({ order, todayMonth: todayDay })
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }

    getOrders = (skip = 0, filterChange = null) => {
        const { match: { params: { id } } } = this.props;

        const { term, startDay, startMonth, startYear, endMonth, endDay, endYear, districtsId, limit } = this.state
        const filterData = { skip, limit, term, startDay, startMonth, startYear, endMonth, endDay, endYear, districtsId };

        if (filterChange === 'change') {
            skip = 0
            this.setState({ skip })
        }
        const apiStatistics = id === 'my-order' ? '/api/order/manager/' : `/api/order/manager/${id}`;
        axiosInterceptors.get(apiStatistics, { params: { skip, limit, ...filterData } })
            .then(res => {
                const orders = filterChange === 'change' ? res.data.orders : [...this.state.orders, ...res.data.orders]
                if (this.textRef) this.setState({
                    orders,
                    loading: false,
                    loadingUpdate: true,
                    ordersLength: res.data.ordersLength
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    getUser = () => {
        const { match: { params: { id } } } = this.props;
        const apiStatistics = id === 'my-order' ? '/api/user' : `/api/user/${id}`;
        axiosInterceptors.get(apiStatistics).then(res => {
            const { user } = res.data;
            if (this.textRef) this.setState({ user })
        }).catch(err => {
            console.log(err)
        })
    }

    getManagerData = () => {
        const { match: { params: { id } } } = this.props;
        const apiStatistics = id === 'my-order' ? '/api/manager/' : `/api/manager/${id}`;
        axiosInterceptors.get(apiStatistics).then(res => {
            const { operators, managerId } = res.data.controlStatement;
            if (this.textRef) this.setState({ operators, loading: false, managerId })
        }).catch(err => {
            this.setState({ loading: false })
        })
    }


    stillBtn = () => {
        const { skip, limit, orders } = this.state;
        this.setState({
            loading: orders.length > skip ? true : false,
            loadingUpdate: false,
            skip: skip + limit
        })
    }

    handleSelectDate = (date, districtsId) => {
        const { from, to } = date;
        if (from && to) {
            const { year: startYear, month: startMonth, day: startDay } = from;
            const { year: endYear, month: endMonth, day: endDay } = to;

            this.setState({ endYear, endMonth, endDay, startYear, startMonth, startDay });
        }
        if (districtsId.length >= 0) {
            this.setState({ districtsId: districtsId.map((item) => item.id) });
        }
    }
    deleteManagerItem = (operatorId) => {
        const { match: { params: { id } } } = this.props;
        axiosInterceptors.delete(`/api/manager/${id}/${operatorId}`).then(res => {
            const { successMessage } = res.data
            this.setState({ loading: true })
            toast.success(successMessage);
            this.getManagerData();
            this.getOpStatistics();
        }).catch(err => {
            const { errorMessage } = err.response.data;
            toast.error(errorMessage);
        })
    }

    render() {
        const { role, match } = this.props;
        return <MyManager {...this.state}
            handleDate={this.handleSelectDate}
            inputControl={this.inputControl}
            stillBtn={this.stillBtn}
            setManagerType={this.setManagerType}
            deleteManagerItem={this.deleteManagerItem}
            getManagerData={this.getManagerData}
            getOpStatistics={this.getOpStatistics}
            match={match}
            role={role} />;
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.role,
        token: state.token
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeMenuPage: (menuPage) => dispatch(changeMenuPage(menuPage))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperatorKuryerContainer);