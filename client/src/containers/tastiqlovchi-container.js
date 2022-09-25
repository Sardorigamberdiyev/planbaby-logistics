import React, { Component } from "react";
import { Tasriqlovchi } from "../components/pages";
import { connect } from "react-redux";
import { changeMenuPage } from "../actions";
import { toast } from "react-toastify";
import monthSwitch from "../utils/monthSwitch";
import axiosInterceptors from "../utils/axiosInterceptors";

class Tastiqlovchi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      datachecker: [],
      datachecked: [],
      checkerNumber: 0,
      checkedNumber: 0,
      checkedNumberStatictik: 0,
      checkedMonth: "",
      notCheckedTerm: "",
      name: "",
      phone: "",
      login: "",
      loadingUpdate: false,
      loadingCheck: true,
      loadingVerified: true,
      error: "",
      skip: 0,
      limit: 6,
      districtsId: [],
      term: null,
      startYear: null,
      startMonth: null,
      startDay: null,
      endYear: null,
      endMonth: null,
      endDay: null,
    };
    this.textRef = React.createRef(true);
    this.textRef = true;
  }
  componentWillUnmount() {
    this.textRef = false;
  }

  componentDidMount() {
    const { changeMenuPage } = this.props;
    changeMenuPage("chackers");

    this.getOrderAllChecker();
    this.getOrderAllChecked(0);
    this.getVerifiedStatistics();
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      skip: prevSkip,
      term: prevTerm,
      districtsId: prevDistrictId,
      startDay: prevStartDay,
      startYear: prevStartYear,
      startMonth: prevStartMonth,
      endDay: prevEndDay,
      endYear: prevEndYear,
      endMonth: prevEndMonth,
      notCheckedTerm: prevNotCheckedTerm,
    } = prevState;
    const {
      skip,
      term,
      notCheckedTerm,
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      districtsId,
    } = this.state;

    if (prevNotCheckedTerm !== notCheckedTerm) this.getOrderAllChecker();

    if (
      prevTerm !== term ||
      prevStartDay !== startDay ||
      startYear !== prevStartYear ||
      startMonth !== prevStartMonth ||
      endDay !== prevEndDay ||
      endYear !== prevEndYear ||
      endMonth !== prevEndMonth ||
      districtsId.length !== prevDistrictId.length
    )
      this.getOrderAllChecked(0, "change");

    if (prevSkip !== skip && skip !== 0) this.getOrderAllChecked(skip);
  }

  inputControl = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  getOrderAllChecker = () => {
    this.setState({ loadingCheck: true });
    const { notCheckedTerm } = this.state;
    axiosInterceptors
      .get(`/api/order/check`, { params: { term: notCheckedTerm } })
      .then(res => {
        const { check, checkLength } = res.data;
        if (this.textRef)
          this.setState({
            checkerNumber: checkLength,
            datachecker: check,
            loadingCheck: false,
          });
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        this.setState({ loadingCheck: false });
        toast.error(errorMessage);
      });
  };

  getOrderAllChecked = (skip = 0, filterChange = null) => {
    if (filterChange) this.setState({ loadingVerified: true });
    const {
      match: {
        params: { id },
      },
    } = this.props;

    const {
      term,
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      districtsId,
      limit,
      datachecked: currentVerifieds,
    } = this.state;
    const filterData = {
      skip,
      limit,
      term,
      startDay,
      startMonth,
      startYear,
      endMonth,
      endDay,
      endYear,
      districtsId,
    };

    if (filterChange === "change") this.setState({ skip });

    const apiStatistics =
      id === "my-order" ? `/api/verified` : `/api/verified/${id}`;

    axiosInterceptors
      .get(apiStatistics, { params: { skip, limit, ...filterData } })
      .then(res => {
        const { verifieds, verifiedsCount } = res.data;
        const orders =
          filterChange === "change"
            ? verifieds
            : [...currentVerifieds, ...verifieds];
        if (this.textRef)
          this.setState({
            datachecked: orders,
            checkedNumber: verifiedsCount,
            loadingUpdate: false,
            loadingVerified: false,
          });
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        this.setState({ loadingVerified: false, loadingUpdate: false });
        toast.error(errorMessage);
      });
  };

  getVerifiedStatistics = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const apiStatistics =
      id === "my-order"
        ? `/api/verified/statistics`
        : `/api/verified/statistics/${id}`;
    axiosInterceptors
      .get(apiStatistics)
      .then(res => {
        const { verifieds, todayMonth } = res.data;
        const checkedMonth = monthSwitch(todayMonth);
        if (this.textRef)
          this.setState({
            checkedNumberStatictik: verifieds ? verifieds.count : 0,
            checkedMonth,
          });
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  stillBtn = () => {
    this.setState(state => {
      return {
        loadingUpdate: true,
        skip: state.skip + state.limit,
      };
    });
  };

  pushChecked = id => {
    axiosInterceptors
      .put(`/api/order/verified/${id}`)
      .then(res => {
        const { successMessage } = res.data;
        toast.success(successMessage);
        this.getOrderAllChecker();
        this.getOrderAllChecked(0, "change");
        this.getVerifiedStatistics();
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  deleteCheckerId = id => {
    axiosInterceptors
      .delete("/api/order/" + id)
      .then(res => {
        const { successMessage } = res.data;
        toast.success(successMessage);
        this.getOrderAllChecker();
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
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

  render() {
    const { role, match } = this.props;
    return (
      <Tasriqlovchi
        {...this.state}
        inputControl={this.inputControl}
        getOrderUser={this.getOrderUser}
        deleteCheckerId={this.deleteCheckerId}
        stillBtn={this.stillBtn}
        handleDate={this.handleSelectDate}
        match={match}
        role={role}
        pushChecked={this.pushChecked}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.role
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeMenuPage: menuPage => dispatch(changeMenuPage(menuPage)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tastiqlovchi);
