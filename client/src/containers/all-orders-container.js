import React, { Component } from "react";
import { connect } from "react-redux";
import { changeMenuPage } from "../actions";
import { AllOrders } from "./../components/pages";
import axiosInterceptors from "../utils/axiosInterceptors";
import { toast } from "react-toastify";

class AllOrdersContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      skip: 0,
      limit: 20,
      pageNumber: 1,
      status: "",
      allOrders: [],
      verifiedLength: 0,
      statistics: [],
      startDate: "",
      endDate: "",
      term: "",
      disabledExel: true,
    };
    this.textRef = React.createRef(true);
    this.textRef = true;
  }
  componentWillUnmount() {
    this.textRef = false;
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      term: prevTerm,
      endDate: prevEndDate,
      startDate: prevStartDate,
    } = prevState;
    const { term, skip, limit, startDate, endDate } = this.state;
    if (term !== prevTerm) {
      this.getOrders(skip, limit);
    }
    if (
      (prevStartDate !== startDate || prevEndDate !== endDate) &&
      startDate &&
      endDate
    ) {
      this.getOrders(0, limit);
      this.getStatistics();
      this.setState({
        loading: true,
        skip: 0,
      });
    }
    if (prevEndDate && prevStartDate && !endDate && !startDate) {
      this.getOrders(skip, limit);
      this.getStatistics();
      this.setState({
        loading: true,
      });
    }
  }
  componentDidMount() {
    const { changeMenuPage } = this.props;
    changeMenuPage("allzakazlar");
    this.getOrders(0, 24);
    this.getStatistics();
  }
  getStatistics = () => {
    const { startDate: start, endDate: end } = this.state;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const [startYear, startMonth, startDay] = [
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    ];
    const [endYear, endMonth, endDay] = [
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    ];
    const params =
      start && end
        ? {
            startYear,
            startMonth: startMonth + 1,
            startDay,
            endYear,
            endMonth: endMonth + 1,
            endDay,
          }
        : {};
    axiosInterceptors
      .get("/api/order/statistics/all", {
        params,
      })
      .then(res => {
        const { statistics } = res.data;
        this.setState({ statistics });
      });
  };
  getOrders = (skip, limit) => {
    const { term, startDate: start, endDate: end } = this.state;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const [startYear, startMonth, startDay] = [
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    ];
    const [endYear, endMonth, endDay] = [
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    ];

    const params =
      start && end
        ? {
            skip,
            limit,
            term,
            startYear,
            startMonth: startMonth + 1,
            startDay,
            endYear,
            endMonth: endMonth + 1,
            endDay,
          }
        : { skip, limit, term };

    axiosInterceptors
      .get("/api/order", {
        params,
      })
      .then(res => {
        const { verified, verifiedLength } = res.data;

        this.setState({
          allOrders: verified,
          verifiedLength,
          loading: false,
        });
      });
  };

  handlePagination = (pageNumber, limit) => {
    const skip = (pageNumber - 1) * limit;
    this.setState({ skip, limit, pageNumber, loading: true });
    this.getOrders(skip, limit);
  };
  handleDateChange = date => {
    const [startDate, endDate] = date;
    this.setState({
      startDate,
      endDate,
      disabledExel: startDate && endDate ? false : true,
    });
  };
  handleInputChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  };
  downloadOrders = () => {
    const { startDate: start, endDate: end } = this.state;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const [startYear, startMonth, startDay] = [
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    ];
    const [endYear, endMonth, endDay] = [
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    ];

    axiosInterceptors
      .get("/api/xlsx/export/all", {
        params: {
          startYear,
          startMonth: startMonth + 1,
          startDay,
          endYear,
          endMonth: endMonth + 1,
          endDay,
        },
        responseType: "blob",
      })
      .then(res => {
        const fileName = res.headers["content-disposition"]
          .split(" ")[1]
          .split("=")[1];
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", JSON.parse(fileName));
        document.body.appendChild(link);
        link.click();
        link.remove();
      });
  };
  downloadProcuts = () => {
    const { startDate: start, endDate: end } = this.state;

    const startDate = new Date(start);
    const endDate = new Date(end);
    const [startYear, startMonth, startDay] = [
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    ];
    const [endYear, endMonth, endDay] = [
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
    ];
    const filterData = {
      startYear,
      startMonth: startMonth + 1,
      startDay,
      endYear,
      endMonth: endMonth + 1,
      endDay,
    };

    axiosInterceptors
      .get(`/api/xlsx/export/order/products`, {
        params: { ...filterData },
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
  handleBack = orderId => {
    axiosInterceptors.put(`/api/order/backStatus/${orderId}`).then(res => {
      const { successMessage } = res.data;
      toast.success(successMessage);
      const { skip, limit } = this.state;
      this.getOrders(skip, limit);
    });
  };
  render() {
    return (
      <AllOrders
        {...this.state}
        handleBack={this.handleBack}
        downloadOrders={this.downloadOrders}
        downloadProcuts={this.downloadProcuts}
        onInputChange={this.handleInputChange}
        onDateChange={this.handleDateChange}
        onPagination={this.handlePagination}
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

export default connect(mapStateToProps, mapDispatchToProps)(AllOrdersContainer);
