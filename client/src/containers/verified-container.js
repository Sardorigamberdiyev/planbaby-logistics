import React, { Component } from 'react';
import { Verified } from '../components/pages';
import { connect } from 'react-redux';
import { changeMenuPage } from '../actions';
import axiosInterceptors from '../utils/axiosInterceptors';

class VerifiedContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadingCheck: true,
            loadingUpdateCheck: false,
            loadingVerifieds: true,
            loadingUpdateVerifieds: false,
            errorCheck: null,
            errorVerifieds: null,
            verifieds: [],
            verifiedsLength: 0,
            checkedTerm: '',
            skipVerified: 0,
            check: [],
            checkLength: 0,
            skipCheck: 0,
            checkerTerm: '',
            limit: 6,
        }
        this.textRef = React.createRef(true)
        this.textRef = true
    }
    componentWillUnmount() {
        this.textRef = false
    }

    componentDidMount() {
        const { history, changeMenuPage } = this.props;
        changeMenuPage('checker');
        history.push('/verified/');
        this.getChecker(undefined, undefined, true);
        this.getVerified(undefined, true);
    }
    componentDidUpdate(prevProps, prevState) {
        const { checkerTerm: prevCheckerTerm, checkedTerm: prevCheckedTerm, skipVerified: prevSkipVerified, skipCheck: prevSkipCheck } = prevState;
        const { checkerTerm, checkedTerm, skipVerified, skipCheck } = this.state;

        if (prevCheckedTerm !== checkedTerm && checkedTerm) {
            console.log('getVerifiedByCode()');
            this.getVerifiedByCode();
        }

        if ((prevSkipVerified !== skipVerified || prevCheckedTerm !== checkedTerm) && !checkedTerm) {
            console.log('getVerified()');
            const afterEmptyTerm = prevCheckedTerm !== checkedTerm && !checkedTerm;
            this.getVerified(afterEmptyTerm);
        }

        if (prevCheckerTerm !== checkerTerm && checkerTerm) {
            console.log('getChecker(byTerm)');
            this.getChecker('byTerm');
        }

        if ((prevSkipCheck !== skipCheck || prevCheckerTerm !== checkerTerm) && !checkerTerm) {
            console.log('getChecker()');
            const afterEmptyTerm = prevCheckerTerm !== checkerTerm && !checkerTerm;
            this.getChecker(undefined, afterEmptyTerm);
        }
    }

    getVerified = (afterEmptyTerm = false, isDidMount = false) => {
        this.setState({ [isDidMount || afterEmptyTerm ? 'loadingVerifieds' : 'loadingUpdateVerifieds']: true });
        const { limit, skipVerified: skip, verifieds: currentVerifieds } = this.state;

        axiosInterceptors.get(`/api/verified/all/?condition=active&statistics=not_statistics`, {
            params: { skip, limit }
        })
        .then((res) => {
            const { orders: verifieds, ordersLength: verifiedsLength } = res.data;
            if (this.textRef) this.setState({
                verifiedsLength,
                verifieds: afterEmptyTerm ? [...verifieds] : [...currentVerifieds, ...verifieds],
                loadingVerifieds: false,
                loadingUpdateVerifieds: false
            })
        })
        .catch((err) => {
            this.setState({ loadingUpdateVerifieds: false, loadingVerifieds: false, errorVerifieds: true });
        })
    }

    getVerifiedByCode = () => {
        this.setState({ loadingVerifieds: true, errorVerifieds: null });
        const { checkedTerm } = this.state;

        axiosInterceptors.get(`/api/verified/all/by/code?term=${checkedTerm}`)
            .then((response) => {
                const { orders } = response.data;
                this.setState({ verifieds: orders, skipVerified: 0, loadingVerifieds: false });
            })
            .catch((err) => {
                console.log(err);
                this.setState({ loadingVerifieds: false, errorVerifieds: true })
            })
    }

    getChecker = (typeReq = 'byChecker', afterEmptyTerm = false, isDidMount = false) => {
        const isByTerm = typeReq === 'byTerm';
        const loadingStateKey = isByTerm || isDidMount ? 'loadingCheck' : 'loadingUpdateCheck';
        this.setState({ [loadingStateKey]: true, errorCheck: null });
        const { checkerTerm, limit, skipCheck, check: currentCheck  } = this.state;

        const term = isByTerm ? { term: checkerTerm } : {};
        const refreshSkip = isByTerm ? { skipCheck: 0 } : {};
        const skip = isByTerm ? 0 : skipCheck;

        axiosInterceptors.get(`/api/order/check`, {
            params: { ...term, skip, limit }
        })
        .then((res) => {
            const { check, checkLength } = res.data;
            if (this.textRef) this.setState({
                ...refreshSkip,
                checkLength,
                check: isByTerm || afterEmptyTerm ? [...check] : [...currentCheck, ...check],
                loadingCheck: false,
                loadingUpdateCheck: false
            })
        })
        .catch((err) => {
            this.setState({ loadingCheck: false, loadingUpdateCheck: false, errorCheck: true });
        })
    }

    inputControl = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value })
    }
    stillBtnVerified = () => {
        const { skipVerified, limit } = this.state
        this.setState({ skipVerified: skipVerified + limit })
    }
    stillBtnCheck = () => {
        const { skipCheck, limit } = this.state
        this.setState({ skipCheck: skipCheck + limit })
    }

    render() {
        return (<Verified {...this.state}
            inputControl={this.inputControl}
            stillBtnVerified={this.stillBtnVerified}
            stillBtnCheck={this.stillBtnCheck} />)
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifiedContainer);