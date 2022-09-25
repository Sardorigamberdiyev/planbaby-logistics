import React from 'react'
import { Operator } from '../components/pages'
import { connect } from 'react-redux';
import { changeMenuPage } from '../actions';
import axiosInterceptors from '../utils/axiosInterceptors';
import { OPERATOR } from '../constvalue';

class Operators extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            users: [],
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
        changeMenuPage('operators');
        history.push('/operatorlar/');
        this.getAssortedUsers();

    }

    getAssortedUsers = () => {
        this.setState({ loading: true, error: null })
        axiosInterceptors.get(`/api/user/all/?byRole=${OPERATOR}`)
            .then((res) => {
                const { users } = res.data
                if (this.textRef) this.setState({ users, loading: false })
            })
            .catch((err) => {
                this.setState({ loading: false, error: true });
            })
    }

    downloadUserXlsx = () => {
        axiosInterceptors.get('/api/xlsx/export/user?byRole=operator', {
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
            <Operator {...this.state} 
            userId={this.props.match.params.id} 
            downloadUserXlsx={this.downloadUserXlsx} />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeMenuPage: (menuPage) => dispatch(changeMenuPage(menuPage))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Operators);

