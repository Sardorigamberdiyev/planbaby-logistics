import React from 'react';
import { OperatorKuryer } from '../components/pages';
import { connect } from 'react-redux';
import { changeMenuPage } from '../actions';
import axiosInterceptors from '../utils/axiosInterceptors';

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
            limit: 12,
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
            endDay: null
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
        changeMenuPage('operators');
        history.push(`/operator/${id}`);
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
            this.getOpStatistics();
            this.setState({ btnLastDisabled: false, })
        } else if (prevSkip !== skip && skip !== 0) {
            this.getOrders(skip)
            this.setState({
                btnLastDisabled: this.state.orders.length < skip ? true : false
            })
        }


    }
    inputControl = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    getOpStatistics = () => {
        const {startDay, startMonth, startYear, endMonth, endDay, endYear,} = this.state;
        const filterData = { startDay, startMonth, startYear, endMonth, endDay, endYear };
        const { match: { params: { id } } } = this.props;
        const apiStatistics = id === 'my-order' ? '/api/order/statistics' : `/api/order/statistics/${id}`;
        axiosInterceptors.get(apiStatistics, {params: filterData})
            .then(res => {
                this.getOrders(0, 'change')
                const { order } = res.data;
                if (this.textRef) this.setState({ order })
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
        const apiStatistics = id === 'my-order' ? '/api/order/user' : `/api/order/user/${id}`;
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
    render() {
        const { role, menu, match } = this.props;
        return <OperatorKuryer {...this.state}
            handleDate={this.handleSelectDate}
            inputControl={this.inputControl}
            stillBtn={this.stillBtn}
            match={match}
            role={role}
            menu={menu} />;
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.role,
        token: state.token,
        menu: state.menu
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeMenuPage: (menuPage) => dispatch(changeMenuPage(menuPage))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OperatorKuryerContainer);