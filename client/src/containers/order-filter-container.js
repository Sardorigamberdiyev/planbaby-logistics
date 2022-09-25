import React, { Component } from "react";
import { connect } from "react-redux";
import { OrderFilter } from "../components/pages";
import { toast } from "react-toastify";
import axiosInterceptors from "../utils/axiosInterceptors";

const today = new Date();

const todayDay =
  today.getDate().toString().length !== 1
    ? today.getDate()
    : `0${today.getDate()}`;
const todayMonth =
  today.getMonth().toString().length !== 1
    ? today.getMonth() + 1
    : `0${today.getMonth() + 1}`;
const todayYear = today.getFullYear();

class OrderFilterContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      idLoading: false,
      idError: null,
      isShowLimitList: false,
      orders: [],
      ordersLength: "",
      order: null,
      region: {
        label: "Default",
        value: null,
        name: "region",
      },
      districtsId: [],
      page: 0,
      pageRange: 0,
      priceQuantity: 0,
      skip: 0,
      limit: { label: "50", value: 50, name: "limit" },
      term: "",
      onlyTerm: "",
      startYear: todayYear,
      startMonth: todayMonth,
      startDay: todayDay,
      endYear: todayYear,
      endMonth: todayMonth,
      endDay: todayDay,
    };
    this.textRef = React.createRef(true);
    this.textRef = true;
  }
  componentWillUnmount() {
    this.textRef = false;
  }

  componentDidMount() {
    const {
      skip,
      limit: { value },
    } = this.state;

    this.getOrders(skip, value);
    this.getOrdersStatistics();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      skip: prevSkip,
      limit: { value: prevLimit },
      onlyTerm: prevOnlyTerm,
    } = prevState;
    const {
      skip,
      limit: { value: limit },
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      districtsId,
      onlyTerm,
    } = this.state;
    const {
      districtsId: prevDistrictId,
      startDay: prevStartDay,
      startYear: prevStartYear,
      startMonth: prevStartMonth,
      endDay: prevEndDay,
      endYear: prevEndYear,
      endMonth: prevEndMonth,
    } = prevState;

    if (
      skip !== prevSkip ||
      limit !== prevLimit ||
      startDay !== prevStartDay ||
      startYear !== prevStartYear ||
      startMonth !== prevStartMonth ||
      endDay !== prevEndDay ||
      endYear !== prevEndYear ||
      endMonth !== prevEndMonth ||
      districtsId.length !== prevDistrictId.length ||
      prevOnlyTerm !== onlyTerm
    ) {
      const customSkip = prevOnlyTerm !== onlyTerm ? 0 : skip;
      this.getOrders(customSkip, limit);
      this.getOrdersStatistics();
    }
  }

  showLimitList = isShowLimitList => {
    this.setState({ isShowLimitList });
  };

  limitSelectControl = option => {
    this.setState({ limit: option, page: 0 });
  };

  onPageChange = page => {
    this.setState(state => {
      return {
        skip: page.selected * state.limit.value,
        page: page.selected,
      };
    });
  };

  exportToXlsx = () => {
    const {
      match: {
        params: { typeOrder },
      },
    } = this.props;
    const {
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      districtsId,
    } = this.state;
    const filterData = {
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
    };

    axiosInterceptors
      .get(`/api/xlsx/export/?districtsId=${districtsId}`, {
        params: {
          status: typeOrder,
          ...filterData,
        },
        responseType: "blob",
      })
      .then(response => {
        const fileName = response.headers["content-disposition"]
          .split(" ")[1]
          .split("=")[1];
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", JSON.parse(fileName));
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  exportToXlsxProducts = () => {
    const {
      match: {
        params: { typeOrder },
      },
    } = this.props;
    const {
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      districtsId,
    } = this.state;
    const filterData = {
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      districtsId,
    };

    axiosInterceptors
      .get(`/api/xlsx/export/order/products`, {
        params: { status: typeOrder, ...filterData },
        responseType: "blob",
      })
      .then(response => {
        const fileName = response.headers["content-disposition"]
          .split(" ")[1]
          .split("=")[1];
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", JSON.parse(fileName));
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  selectControl = selectedOption => {
    const { name } = selectedOption;
    this.setState({ [name]: selectedOption });
  };

  inputControl = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  selectGeniratorOption = (arr, selectName) => {
    const options = [{ value: null, label: "Default", name: selectName }];

    arr.forEach(item => {
      options.push({
        value: item._id,
        label: item.label.uz,
        name: selectName,
      });
    });

    return options;
  };

  getOrdersStatistics = () => {
    const {
      match: {
        params: { typeOrder },
      },
    } = this.props;
    const { startDay, startMonth, startYear, endMonth, endDay, endYear, districtsId } =
      this.state;
    const filterData = {
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      districtsId,
      status: typeOrder,
    };
    axiosInterceptors
      .get("/api/order/statistics/all", { params: { ...filterData } })
      .then(response => {
        const { statistics } = response.data;
        const priceQuantity = statistics ? statistics.cms : 0;
        const ordersLength = statistics ? statistics.count : 0;
        if (this.textRef)
          this.setState({
            priceQuantity,
            ordersLength,
          });
      });
  };

  getOrders = (skip = 0, limit = 0) => {
    this.setState({ loading: true, error: null });
    const {
      match: {
        params: { typeOrder },
      },
    } = this.props;
    const {
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      onlyTerm,
      districtsId,
    } = this.state;
    const filterData = {
      skip,
      limit,
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      districtsId,
      term: onlyTerm,
      status: typeOrder,
    };

    axiosInterceptors
      .get(`/api/order`, {
        params: { ...filterData },
      })
      .then(response => {
        const { verified, verifiedLength } = response.data;

        const pageRange = limit !== 0 ? Math.ceil(verifiedLength / limit) : 0;
        if (this.textRef)
          this.setState({
            pageRange,
            orders: verified,
            loading: false,
          });
      })
      .catch(err => {
        this.setState({ error: true, loading: false });
      });
  };
  gprinterHandler = orderId => {
    const {
      skip,
      limit: { value },
    } = this.state;
    axiosInterceptors
      .put(`/api/order/gprinter/${orderId}`)
      .then(response => {
        this.getOrders(skip, value);
        toast.success("Копия килинди");
      })
      .catch(err => {
        toast.error("Копия килинмади, бошкаттан уринибкоринг");
      });
  };

  failureHandler = (orderId, comment) => {
    const {
      skip,
      limit: { value },
    } = this.state;
    axiosInterceptors
      .put(`/api/order/failure/${orderId}`, { comment })
      .then(response => {
        this.getOrders(skip, value);
        const { successMessage } = response.data;
        toast.success(successMessage);
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  courierHandler = (orderId, userId) => {
    const {
      skip,
      limit: { value },
    } = this.state;
    axiosInterceptors
      .post("/api/delivery", { userId, orderId })
      .then(response => {
        const { successMessage } = response.data;
        this.getOrders(skip, value);
        toast.success(successMessage);
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  telegramHandler = orderId => {
    const {
      skip,
      limit: { value },
    } = this.state;
    axiosInterceptors
      .post("/api/order/recovery/tg", { orderId })
      .then(response => {
        const { successMessage } = response.data;
        toast.success(successMessage);
        this.getOrders(skip, value);
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  inputControl = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSelectDate = (date, districtsId) => {
    const { from, to } = date;
    if (from && to) {
      const { year: startYear, month: startMonth, day: startDay } = from;
      const { year: endYear, month: endMonth, day: endDay } = to;

      this.setState({
        endYear,
        endMonth,
        endDay,
        startYear,
        startMonth,
        startDay,
      });
    }
    if (districtsId.length >= 0) {
      this.setState({ districtsId: districtsId.map(item => item.id) });
    }
  };
  handleBack = (orderId) => {
    const { skip, limit } = this.state;
    axiosInterceptors.put(`/api/order/backStatus/${orderId}`).then(res => {
      const { successMessage } = res.data;
      toast.success(successMessage);
      this.getOrders(skip, limit);
    });
  };
  finishOrderCourier = orderId => {
    const {
      skip,
      limit: { value },
    } = this.state;
    axiosInterceptors
      .put(`/api/order/success/${orderId}`)
      .then(response => {
        const { successMessage } = response.data;
        this.getOrders(skip, value);
        toast.success(successMessage);
      })
      .catch(err => {
        console.log(err);
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };
  finishOrderHandler = orderId => {
    const {
      skip,
      limit: { value },
    } = this.state;
    axiosInterceptors
      .put(`/api/order/office/success/${orderId}`)
      .then(response => {
        const { successMessage } = response.data;
        this.getOrders(skip, value);
        toast.success(successMessage);
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };
  handleDeleteOrder = orderId => {
    const {
      skip,
      limit: { value },
    } = this.state;
    axiosInterceptors
      .delete(`/api/order/${orderId}`)
      .then(response => {
        const { successMessage } = response.data;
        this.getOrders(skip, value);
        toast.success(successMessage);
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  render() {
    const {
      match: {
        params: { typeOrder },
      },
    } = this.props;

    return (
      <OrderFilter
        {...this.state}
        typeList={typeOrder}
        typeOrder={typeOrder}
        inputControl={this.inputControl}
        handleDate={this.handleSelectDate}
        handleBack={this.handleBack}
        courierHandler={this.courierHandler}
        failureHandler={this.failureHandler}
        gprinterHandler={this.gprinterHandler}
        deleteHandler={this.deleteHandler}
        telegramHandler={this.telegramHandler}
        exportToXlsx={this.exportToXlsx}
        exportToXlsxProducts={this.exportToXlsxProducts}
        onPageChange={this.onPageChange}
        showLimitList={this.showLimitList}
        finishOrderHandler={this.finishOrderHandler}
        limitSelectControl={this.limitSelectControl}
        onDeleteOrder={this.handleDeleteOrder}
        finishOrderCourier={this.finishOrderCourier}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    token: state.token,
  };
};

export default connect(mapStateToProps)(OrderFilterContainer);
