import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logout, changeLangData } from '../actions';
import axiosInterceptors from '../utils/axiosInterceptors';
import i18next from 'i18next';
import Navbar from '../components/navbar';


class NavbarContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLangList: false,
            showUserMenu: false,
            name: '',
        }
        this.textRef = React.createRef(true)
        this.textRef = true
    }
    componentWillUnmount() {
        this.textRef = false
    }

    componentDidMount() {
        this.getUserData();
    }


    changeLangList = () => {
        this.setState((state) => {
            return {
                showLangList: !state.showLangList,
                showUserMenu: false
            }
        })
    }

    changeUserMenu = () => {
        this.setState((state) => {
            return {
                showLangList: false,
                showUserMenu: !state.showUserMenu
            }
        })
    }

    currentChangeLanguage = (lang) => {
        const { changeLangData } = this.props;
        i18next.changeLanguage(lang);
        changeLangData(lang);
        this.setState({ showLangList: false });
    }

    getUserData = () => {
        const { token } = this.props;
        axiosInterceptors.get('/api/user', {
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                const { firstName, lastName } = response.data.user;
                if (this.textRef) this.setState({ name: `${firstName} ${lastName}` })
            })
            .catch((err) => {
                console.log(err.response);
            })
    }

    logoutSystem = () => {
        const { token, rToken, logout } = this.props;
        axiosInterceptors.delete(`/api/auth/logout/?token=${rToken}`, {
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                logout();
            })
            .catch((err) => {
                console.log(err.response);
            })
    }

    render() {
        const { role, menuPageActive, currentLang } = this.props;

        return <Navbar
            {...this.state}
            changeLangList={this.changeLangList}
            changeUserMenu={this.changeUserMenu}
            logoutSystem={this.logoutSystem}
            currentChangeLanguage={this.currentChangeLanguage}
            currentLang={currentLang}
            menuPageActive={menuPageActive}
            authRole={role} />
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.token,
        rToken: state.rToken,
        role: state.role,
        menuPageActive: state.menuPageActive,
        currentLang: state.currentLang
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => dispatch(logout()),
        changeLangData: (lang) => dispatch(changeLangData(lang))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavbarContainer);