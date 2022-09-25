import React from 'react'
import { Managers } from '../components/pages'
import { connect } from 'react-redux';
import { changeMenuPage } from '../actions';
import axiosInterceptors from '../utils/axiosInterceptors';

class ManagersComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            managers: [],
            loading: true,
            error: null
        }
        this.textRef = React.createRef(true)
        this.textRef = true
    }
    componentWillUnmount() {
        this.textRef = false
    }
    componentDidMount() {
        const { history, changeMenuPage } = this.props;
        changeMenuPage('managers');
        history.push('/managers/');
        this.getAssortedUsers();

    }

    getAssortedUsers = () => {
        this.setState({ loading: true, error: null });

        axiosInterceptors.get(`/api/user/role/managers`)
            .then((res) => {
                const { managers } = res.data
                if (this.textRef) this.setState({ managers, loading: false })
            })
            .catch((err) => {
                this.setState({ loading: false, error: true });
            })
    }

    downloadUserXlsx = () => {
        axiosInterceptors.get('/api/xlsx/export/user?byRole=manager', {
            responseType: 'blob'
        })
        .then((response) => {
            const fileName = response.headers['content-disposition'].split(' ')[1].split('=')[1];
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            
            link.href = url;
            link.setAttribute('download', JSON.parse(fileName));
            document.body.appendChild(link);
            link.click();
            link.remove();
        })
        .catch((err) => {
            console.log(err.response.data);
        })
    }

    render() {
        return (
            <Managers {...this.state} userId={this.props.match.params.id} downloadUserXlsx={this.downloadUserXlsx} />);
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeMenuPage: (menuPage) => dispatch(changeMenuPage(menuPage))
    }
}

export default connect(undefined, mapDispatchToProps)(ManagersComponent);

