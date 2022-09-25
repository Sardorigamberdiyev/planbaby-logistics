import React from 'react'
import { Kuryer } from '../components/pages'
import { connect } from 'react-redux';
import { changeMenuPage } from '../actions';
import { toast } from 'react-toastify';
import axiosInterceptors from '../utils/axiosInterceptors';
import monthSwitch from '../utils/monthSwitch';

class OperatorKuryerContainer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            regions: '',
            distrcits: '',
            products: [],
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
            orderId: '',
            deliveryId: '',
            comment: '',
            cash: 0,
            card: 0,
            debt: 0,
            totalPrice: 0,
            deliveryLength: 0,
            districtsId: [],
            term: null,
            startYear: null,
            startMonth: null,
            startDay: null,
            endYear: null,
            endMonth: null,
            endDay: null
        }
        this.textRef = React.createRef(true)
        this.textRef = true
    }
    componentWillUnmount() {
        this.textRef = false
    }


    componentDidMount() {
        const { changeMenuPage } = this.props;
        changeMenuPage('courier');
        this.getUser()
        this.getOpStatistics();
        this.getOrders(0)
    }
    componentDidUpdate(prevProps, prevState) {
        const { skip: prevSkip, term: prevTerm, districtsId: prevDistrictId, startDay: prevStartDay, startYear: prevStartYear, startMonth: prevStartMonth, endDay: prevEndDay, endYear: prevEndYear, endMonth: prevEndMonth } = prevState;
        const { skip, term, startDay, startMonth, startYear, endMonth, endDay, endYear, districtsId } = this.state;

        if (prevTerm !== term
            || prevStartDay !== startDay
            || startYear !== prevStartYear
            || startMonth !== prevStartMonth
            || endDay !== prevEndDay
            || endYear !== prevEndYear
            || endMonth !== prevEndMonth
            || districtsId.length !== prevDistrictId.length) {
            this.getOrders(0, 'change');
            this.setState({ btnLastDisabled: false, })
        } else if (prevSkip !== skip && skip !== 0) {
            this.getOrders(skip)
            this.setState({
                btnLastDisabled: this.state.orders.length < skip ? true : false,
            })
        }

    }
    inputControl = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });

        const { totalPrice, card, cash } = this.state
        if (name === 'card') {
            this.setState({ debt: totalPrice - (Number(cash) + Number(value)) })
        } else if (name === 'cash') {
            this.setState({ debt: totalPrice - (Number(card) + Number(value)) })
        }
    }

    getOpStatistics = () => {
        const { match: { params: { id } } } = this.props;
        const apiStatistics = id === 'my-order' ? '/api/delivery/statistics' : `/api/delivery/statistics/${id}`;
        axiosInterceptors.get(apiStatistics)
            .then(res => {
                this.getOrders(0, "change");
                const { deliverys: order, todayMonth } = res.data;
                const todayDay = monthSwitch(todayMonth)
                if (this.textRef) this.setState({ order, todayMonth: todayDay })
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
        const apiStatistics = id === 'my-order' ? '/api/delivery/' : `/api/delivery/${id}`;
        axiosInterceptors.get(apiStatistics, { params: { skip, limit, ...filterData } })
            .then(res => {
                const { deliveryLength, deliverys } = res.data
                const orders = filterChange === 'change' ? deliverys : [...this.state.orders, ...deliverys]
                if (this.textRef) this.setState({
                    orders,
                    deliveryLength, loading: false, loadingUpdate: true,
                })
            }).catch(err => {
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

    stillBtn = () => {
        this.setState({
            loading: this.state.orders.length > this.state.skip ? true : false,
            loadingUpdate: false,
            skip: this.state.skip + this.state.limit,
        })
    }

    handleSumbitModalTastrilash = (deliveryId, totalPrice) => {
        const { comment, cash, card } = this.state;
        const debt = (totalPrice - (Number(cash) + Number(card))).toString()
        const data = {
            comment,
            cash,
            card,
            debt
        }

        axiosInterceptors.put(`/api/delivery/${deliveryId}`, data).then(res => {
            const { successMessage } = res.data;
            this.getOpStatistics();
            this.getOrders(0, 'change')
            this.setState({
                orderId: '',
                deliveryId: '',
                comment: '',
                cash: 0,
                card: 0,
                debt: 0
            })
            toast.success(successMessage);
            console.log(res.data)
        }).catch(err => {
            console.log(err.errorMessage)
        })
    }
    setDebt = (e) => {
        this.setState({ totalPrice: e })
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

    failureHandler = (deliveryId, orderId, comment) => {

        axiosInterceptors.put(`/api/delivery/failure/${deliveryId}`, { orderId, comment })
            .then((response) => {
                this.getOrders(0, 'change')
                this.getOpStatistics();
                const { successMessage } = response.data;
                toast.success(successMessage)
            })
            .catch((err) => {
                console.log(err.response);
                const { errorMessage } = err.response.data;
                toast.error(errorMessage);
            })
    }

    render() {
        const { role, match } = this.props;
        return <Kuryer {...this.state}
            inputControl={this.inputControl}
            stillBtn={this.stillBtn}
            match={match}
            role={role}
            handleDate={this.handleSelectDate}
            setTotalPrice={this.setDebt}
            failureHandler={this.failureHandler}
            onSumbitModalTastrilash={this.handleSumbitModalTastrilash}
        />;
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.role

    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeMenuPage: (menuPage) => dispatch(changeMenuPage(menuPage))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperatorKuryerContainer);