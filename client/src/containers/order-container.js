import React, { Component } from "react";
import { connect } from "react-redux";
import { Order } from "../components/pages";
import { changeMenuPage } from "../actions";
import { toast } from "react-toastify";
import {
  STATUS_IN_COURIER,
  STATUS_DELIVERED_SUCCESS,
  STATUS_COURIER_FAILURE,
  STATUS_OFFICE_SUCCESS,
  STATUS_ACTIVE,
} from "../constvalue";
import axiosInterceptors from "../utils/axiosInterceptors";

class OrderContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active_orders: [],
      in_courier_orders: [],
      courier_failure_orders: [],
      delivered_success_orders: [],
      office_success_orders: [],
      active_length: 0,
      courier_failure_length: 0,
      delivered_success_length: 0,
      office_success_length: 0,
      in_courier_length: 0,
      order: null,
      active_loading: true,
      active_error: null,
      in_courier_loading: true,
      in_courier_error: null,
      courier_failure_loading: true,
      courier_failure_error: null,
      delivered_success_loading: true,
      delivered_success_error: null,
      office_success_loading: true,
      office_success_error: null,
      idLoading: false,
      idError: null,
      isModal: false,
      date: new Date(),
    };
    this.textRef = React.createRef(true);
    this.textRef = true;
  }
  componentWillUnmount() {
    this.textRef = false;
  }

  componentDidMount() {
    const { history, changeMenuPage } = this.props;
    changeMenuPage("zakazlar");
    history.push("/order/");
    this.getOrders(0, 4, STATUS_ACTIVE);
    this.getOrders(0, 4, STATUS_IN_COURIER);
    this.getOrders(0, 4, STATUS_DELIVERED_SUCCESS);
    this.getOrders(0, 4, STATUS_COURIER_FAILURE);
    this.getOrders(0, 4, STATUS_OFFICE_SUCCESS);
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      match: { params },
    } = this.props;
    const {
      match: { params: prevParams },
    } = prevProps;
    if (params.id !== prevParams.id && params.id) {
      this.getEmployee(params.id);
    }
  }

  calendarControl = value => {
    this.setState({ date: value });
  };

  getEmployee = orderId => {
    this.setState({ idLoading: true, idError: null });
    axiosInterceptors
      .get(`/api/order/${orderId}`)
      .then(response => {
        const { order } = response.data;
        if (this.textRef) this.setState({ order, idLoading: false });
      })
      .catch(err => {
        this.setState({ idError: true, idLoading: false });
      });
  };

  getOrders = (skip = 0, limit = 0, status) => {
    this.setState({ [status + "_loading"]: true });
    axiosInterceptors
      .get(`/api/order/`, {
        params: {
          skip,
          limit,
          status,
        },
      })
      .then(response => {
        const { verified, verifiedLength } = response.data;
        if (this.textRef)
          this.setState({
            [status + "_orders"]: verified,
            [status + "_length"]: verifiedLength,
            [status + "_loading"]: false,
          });
      })
      .catch(err => {
        this.setState({
          [status + "_error"]: true,
          [status + "_loading"]: false,
        });
      });
  };

  gprinterHandler = orderId => {
    axiosInterceptors
      .put(`/api/order/gprinter/${orderId}`)
      .then(response => {
        this.getOrders(0, 4, STATUS_ACTIVE);
        toast.success("Копия килинди");
      })
      .catch(err => {
        toast.error("Копия килинмади, бошкаттан уринибкоринг");
      });
  };

  telegramHandler = orderId => {
    axiosInterceptors
      .post("/api/order/recovery/tg", { orderId })
      .then(response => {
        console.log(response);
        const { successMessage } = response.data;
        toast.success(successMessage);
        this.getOrders(0, 4, STATUS_ACTIVE);
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  failureHandler = (orderId, comment) => {
    axiosInterceptors
      .put(`/api/order/failure/${orderId}`, { comment })
      .then(response => {
        this.getOrders(0, 4, STATUS_ACTIVE);
        this.getOrders(0, 4, STATUS_COURIER_FAILURE);
        const { successMessage } = response.data;
        toast.success(successMessage);
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  courierHandler = (orderId, userId) => {
    axiosInterceptors
      .post("/api/delivery", { userId, orderId })
      .then(response => {
        const { successMessage } = response.data;
        this.getOrders(0, 4, STATUS_ACTIVE);
        this.getOrders(0, 4, STATUS_IN_COURIER);
        toast.success(successMessage);
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  finishOrderCourier = orderId => {
    axiosInterceptors
      .put(`/api/order/success/${orderId}`)
      .then(response => {
        const { successMessage } = response.data;
        this.getOrders(0, 4, STATUS_ACTIVE);
        this.getOrders(0, 4, STATUS_DELIVERED_SUCCESS);
        toast.success(successMessage);
      })
      .catch(err => {
        console.log(err);
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  finishOrderHandler = orderId => {
    axiosInterceptors
      .put(`/api/order/office/success/${orderId}`)
      .then(response => {
        const { successMessage } = response.data;
        this.getOrders(0, 4, STATUS_ACTIVE);
        this.getOrders(0, 4, STATUS_OFFICE_SUCCESS);
        toast.success(successMessage);
      })
      .catch(err => {
        console.log(err);
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  handleDeleteOrder = orderId => {
    axiosInterceptors
      .delete(`/api/order/${orderId}`)
      .then(response => {
        const { successMessage } = response.data;
        this.getOrders(0, 4, STATUS_ACTIVE);
        toast.success(successMessage);
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };
  handleBack = (orderId, status) => {
    console.log("handleBack");
    axiosInterceptors.put(`/api/order/backStatus/${orderId}`).then(res => {
      const { successMessage } = res.data;
      toast.success(successMessage);
      this.getOrders(0, 4, STATUS_ACTIVE);
      this.getOrders(0, 4, status);
    });
  };
  render() {
    const { match, isMenuShow } = this.props;
    return (
      <Order
        {...this.state}
        handleBack={this.handleBack}
        calendarControl={this.calendarControl}
        gprinterHandler={this.gprinterHandler}
        telegramHandler={this.telegramHandler}
        failureHandler={this.failureHandler}
        courierHandler={this.courierHandler}
        finishOrderHandler={this.finishOrderHandler}
        onDeleteOrder={this.handleDeleteOrder}
        finishOrderCourier={this.finishOrderCourier}
        isMenuShow={isMenuShow}
        match={match}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    isMenuShow: state.menu,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeMenuPage: menuPage => dispatch(changeMenuPage(menuPage)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderContainer);
