import React, { Component } from 'react';
import { connect } from 'react-redux';
import { changeMenuPage } from '../actions';
import { MyOrders } from '../components/pages';
import axiosInterceptors from '../utils/axiosInterceptors';

class MyOrdersContainer extends Component {


    constructor(props) {
        super(props)
        this.state = {
            name: '',
            phone: '',
            login: '',
            loading: true,
            loadingUpdate: false,
            idLoading: false,
            idError: null,
            error: null,
            orders: [],
            order: null,
            ordersQuantity: 0,
            skip: 0,
            limit: 15,
            startDate: '',
            endDate: '',
            startDateToSend: '',
            endDateToSend: '',
            dateInterval: false
        }
        this.textRef = React.createRef(true)
        this.textRef = true
    }
    componentWillUnmount() {
        this.textRef = false
    }


    componentDidMount() {
        const { changeMenuPage, match: { params: { id } } } = this.props;
        changeMenuPage('my-orders');
        if (id) this.getOrderIdUser(id);
        this.getOrderUser();
        this.getUser();
    }

    componentDidUpdate(prevProps, prevState) {
        const { skip, dateInterval } = this.state;
        const { skip: prevSkip } = prevState;
        const { match: { params: { id } } } = this.props;
        const { match: { params: { id: prevId } } } = prevProps;

        if (skip !== prevSkip && skip !== 0) {
            this.getOrderUser({ loadingUpdate: true }, false, dateInterval);
        }

        if (id !== prevId && id) {
            this.getOrderIdUser(id);
        }
    }

    inputControl = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    getUser = () => {
        axiosInterceptors.get('/api/user')
            .then((response) => {
                const { firstName, lastName, login, phone } = response.data;
                if (this.textRef) this.setState({
                    name: `${firstName} ${lastName}`,
                    phone,
                    login
                })
            })
            .catch((err) => {
                console.log(err.response);
            })
    }

    getOrderUser = (loading = { loading: true, skip: 0 }, initialData = true, dateInterval = false) => {
        this.setState({ ...loading, error: null });
        const { startDate, endDate, startDateToSend, endDateToSend, skip, limit } = this.state;

        const startDateSplit = initialData ? startDate.split('.') : startDateToSend.split('.');
        const endDateSplit = initialData ? endDate.split('.') : endDateToSend.split('.');

        const startDay = startDateSplit[0];
        const startMonth = startDateSplit[1];
        const startYear = startDateSplit[2];
        const endDay = endDateSplit[0];
        const endMonth = endDateSplit[1];
        const endYear = endDateSplit[2];

        const filterQuery = (startDay &&
            startMonth &&
            startYear &&
            endDay &&
            endMonth &&
            endYear) ? `startDay=${startDay}&startMonth=${startMonth}&startYear=${startYear}&endDay=${endDay}&endMonth=${endMonth}&endYear=${endYear}` : '';

        axiosInterceptors.get(`/api/order/user?skip=${initialData ? 0 : skip}&limit=${limit}&${filterQuery}`)
            .then((response) => {
                const { orders, ordersQuantity } = response.data;
                console.log(orders);
                if (this.textRef) this.setState((state) => {
                    return {
                        orders: initialData ? [...orders] : [...state.orders, ...orders],
                        startDateToSend: initialData ? startDate : state.startDateToSend,
                        endDateToSend: initialData ? endDate : state.endDateToSend,
                        loading: false,
                        loadingUpdate: false,
                        ordersQuantity,
                        dateInterval
                    }
                });
            })
            .catch((err) => {
                this.setState({ error: true, loading: false, loadingUpdate: false });
            })
    }

    getOrderIdUser = (orderId) => {
        this.setState({ idLoading: true, idError: null });
        axiosInterceptors.get(`/api/order/${orderId}`)
            .then((response) => {
                const { order } = response.data;
                if (this.textRef) this.setState({ order: order, idLoading: false });
            })
            .catch((err) => {
                this.setState({ idError: true, idLoading: false });
            })
    }

    stillBtn = () => {
        const { ordersQuantity, orders } = this.state;
        if (orders.length < ordersQuantity) {
            this.setState((state) => {
                return {
                    skip: state.skip + state.limit
                }
            })
        }
    }
    render() {
        const { role, menu, match } = this.props;
        return <MyOrders
            {...this.state}
            inputControl={this.inputControl}
            getOrderUser={this.getOrderUser}
            stillBtn={this.stillBtn}
            match={match}
            role={role}
            menu={menu} />
    }
}

const mapStateToProps = (state) => {
    return {
        role: state.role,
        menu: state.menu
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeMenuPage: (page) => dispatch(changeMenuPage(page))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(MyOrdersContainer);