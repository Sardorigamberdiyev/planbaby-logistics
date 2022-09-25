import React, { Component } from "react";
import { connect } from "react-redux";
import { changeMenuPage } from "../actions";
import { Dashboard } from "../components/pages";
import axiosInterceptors from "../utils/axiosInterceptors";

const startEndDateQuery = (startDate = null, endDate = null) => {
  if (!(startDate && endDate)) return {};

  const startYear = startDate.getFullYear();
  const startMonth = startDate.getMonth() + 1;
  const startDay = startDate.getDate();
  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;
  const endDay = endDate.getDate();

  return {
    dateQuery: `startYear=${startYear}&startMonth=${startMonth}&startDay=${startDay}&endYear=${endYear}&endMonth=${endMonth}&endDay=${endDay}`,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
  };
};

const fromToday = (rangeName = null) => {
  const rangeNames = ["month", "week", "day"];
  const todayDate = new Date();
  if (!rangeNames.includes(rangeName))
    return { startDate: todayDate, endDate: todayDate };

  const todayYear = todayDate.getFullYear();
  const todayMonth = todayDate.getMonth();
  const todayDay = todayDate.getDate();

  const startMonth = rangeName === "month" ? todayMonth - 1 : todayMonth;
  let startDay = rangeName === "week" ? todayDay - 7 : todayDay;
  startDay = rangeName === "day" ? todayDay - 1 : startDay;

  return {
    startDate: new Date(todayYear, startMonth, startDay, 0, 0, 0, 0),
    endDate: todayDate,
  };
};

const jsw = obj => {
  return JSON.stringify(obj);
};

class DashboardContainer extends Component {
  state = {
    dayMonth: { label: "Кунли", value: "day", name: "dayMonth" },
    preparation: null,
    preparationForOnly: null,
    preparationsOptions: [],
    preparationsByDateOnly: [],
    preparationsByDate: [],
    preparationByCountOnly: [],
    preparationByCount: [],
    couriersOrdersQuantity: [],
    operatorsOrdersQuantity: [],
    operatorsOptions: [],
    operator: null,
    orders: [],
    regionsUz: [],
    regionsOther: [],
    statusesOrders: [],
    statusesOrdersCount: [],
    sourcesOrders: [],
    sourcesCategory: [],
    sourcesUz: [],
    sourcesOther: [],
    sourceCategoryIdUz: "",
    sourceCategoryIdOther: "",
    activeLength: 0,
    barTotalPriceUz: 0,
    barTotalPriceOther: 0,
    startDate: fromToday().startDate,
    endDate: fromToday().endDate,
  };

  componentDidMount() {
    const { changeMenuPage } = this.props;
    changeMenuPage("dashboard");

    this.getOrders();
    this.getOperators();
    this.getPreparations();
    this.getRegions("uz");
    this.getRegions("other");
    this.getCategorySources();
    this.initialDiagramQueries();
  }

  initialDiagramQueries = () => {
    this.getOrders();
    this.getOrdersStatusesCount();
    this.getCountBySources();
    this.getCountByUsers();
    this.getCountByUsersCourier();
    this.getTotalPriceBySources("uz");
    this.getTotalPriceBySources("other");
    this.getTotalPriceByStatuses();
    this.getPreparationCountByDate();
    this.getPreparationCountByDateOnly();
    this.getPreparationByCount(true);
    this.getPreparationByCount();
    this.getActiveOrdersLength();
  };

  componentDidUpdate(prevProps, prevState) {
    const {
      startDate,
      endDate,
      sourceCategoryIdUz,
      sourceCategoryIdOther,
      preparationForOnly,
      preparation,
      operator,
      dayMonth,
    } = this.state;
    const {
      startDate: prevStartDate,
      endDate: prevEndDate,
      sourceCategoryIdUz: prevSourceCategoryIdUz,
      sourceCategoryIdOther: prevSourceCategoryIdOther,
      preparationForOnly: prevPreparationForOnly,
      preparation: prevPreparation,
      operator: prevOperator,
      dayMonth: prevDayMonth,
    } = prevState;

    // update
    if (sourceCategoryIdUz !== prevSourceCategoryIdUz)
      this.getTotalPriceBySources("uz");
    if (sourceCategoryIdOther !== prevSourceCategoryIdOther)
      this.getTotalPriceBySources("other");
    if (preparationForOnly !== prevPreparationForOnly)
      this.getPreparationCountByDateOnly();
    if (preparation !== prevPreparation || operator !== prevOperator)
      this.getPreparationCountByDate();
    if (operator !== prevOperator) this.getPreparationByCount();
    if (
      (jsw(startDate) !== jsw(prevStartDate) ||
        jsw(endDate) !== jsw(prevEndDate)) &&
      startDate &&
      endDate
    ) {
      this.initialDiagramQueries();
    }
    if (dayMonth.value !== prevDayMonth.value) {
      const { startDate, endDate } = fromToday(dayMonth.value);
      this.setState({ startDate, endDate });
    }
  }

  handleDateChange = date => {
    const [startDate, endDate] = date;
    this.setState({ startDate, endDate });
  };

  selectControl = (option, onlyPreparation = false) => {
    const { name } = option;
    onlyPreparation
      ? this.setState({ preparationForOnly: option })
      : this.setState({ [name]: option });
  };

  getRegions = (city = null) => {
    const cityQuery = city !== "uz" ? `city=other` : "city=uz";
    const regionKey = city !== "uz" ? "regionsOther" : "regionsUz";
    axiosInterceptors
      .get(`/api/region?${cityQuery}`)
      .then(response => {
        const { regions } = response.data;
        this.setState({ [regionKey]: regions });
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  getOrders = () => {
    const { startDate, endDate } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);
    axiosInterceptors
      .get(`/api/dashboard/orders?${dateQuery}`)
      .then(response => {
        this.setState({ orders: response.data });
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  getCategorySources = () => {
    axiosInterceptors
      .get("/api/source/category")
      .then(response => {
        this.setState({
          sourcesCategory: response.data,
          sourcesUz: response.data,
          sourcesOther: response.data,
        });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getSources = (categoryId = "", city = null) => {
    const sourcesKey = city !== "uz" ? "sourcesOther" : "sourcesUz";
    const sourceCategoryKey =
      city !== "uz" ? "sourceCategoryIdOther" : "sourceCategoryIdUz";
    const isThatCategoryId = categoryId === this.state[sourceCategoryKey];
    const categorySourcesParams = !isThatCategoryId ? categoryId : "category";
    const categoryIdValue = !isThatCategoryId ? categoryId : "";

    axiosInterceptors
      .get(`/api/source/${categorySourcesParams}`)
      .then(response => {
        this.setState({
          [sourcesKey]: response.data,
          [sourceCategoryKey]: categoryIdValue,
        });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getActiveOrdersLength = () => {
    const { startDate, endDate } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);
    axiosInterceptors
      .get(`/api/verified/all/statistics?${dateQuery}&condition=active`)
      .then(response => {
        const { statistics } = response.data;
        this.setState({
          activeLength: statistics ? statistics.ordersLength : 0,
        });
      });
  };

  getPreparations = () => {
    axiosInterceptors
      .get("/api/product")
      .then(response => {
        const { products } = response.data;
        const preparationsOptions = products.map(product => ({
          label: product.nameUz,
          value: product._id,
          name: "preparation",
        }));
        this.setState({ preparationsOptions });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getOperators = () => {
    axiosInterceptors
      .get("/api/user/all?byRole=operator")
      .then(response => {
        const { users } = response.data;
        const operatorsOptions = users.map(user => ({
          label: `${user.firstName} ${user.lastName}`,
          value: user._id,
          name: "operator",
        }));
        this.setState({ operatorsOptions });
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  getOrdersStatusesCount = () => {
    const { startDate, endDate } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);
    axiosInterceptors
      .get(`/api/dashboard/orders/statuses/count?${dateQuery}`)
      .then(response => {
        this.setState({ statusesOrdersCount: response.data });
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  getTotalPriceBySources = (city = null) => {
    const { startDate, endDate, sourceCategoryIdUz, sourceCategoryIdOther } =
      this.state;
    const isCityUz = city === "uz";
    const sourceIdQuery = !isCityUz
      ? sourceCategoryIdOther
        ? `sourceId=${sourceCategoryIdOther}&`
        : ""
      : sourceCategoryIdUz
      ? `sourceId=${sourceCategoryIdUz}&`
      : "";
    const barTotalPriceKey = !isCityUz
      ? "barTotalPriceOther"
      : "barTotalPriceUz";
    const { dateQuery } = startEndDateQuery(startDate, endDate);
    const cityValue = !isCityUz ? "other" : "uz";
    axiosInterceptors
      .get(
        `/api/dashboard/orders/price/by/sources/?city=${cityValue}&${sourceIdQuery}${dateQuery}`,
      )
      .then(response => {
        this.setState({ [barTotalPriceKey]: response.data || 0 });
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  getCountByUsers = () => {
    const { startDate, endDate } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);
    axiosInterceptors
      .get(`/api/dashboard/orders/count/by/users?${dateQuery}`)
      .then(response => {
        const { operators } = response.data;
        this.setState({ operatorsOrdersQuantity: operators });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getCountByUsersCourier = () => {
    const { startDate, endDate } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);
    axiosInterceptors
      .get(`/api/dashboard/orders/count/by/users/courier?${dateQuery}`)
      .then(response => {
        const { couriers } = response.data;
        this.setState({ couriersOrdersQuantity: couriers });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getTotalPriceByStatuses = () => {
    const { startDate, endDate } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);
    axiosInterceptors
      .get(`/api/dashboard/orders/price/by/statuses?${dateQuery}`)
      .then(response => {
        const { statuses } = response.data;
        console.log(statuses);
        this.setState({ statusesOrders: statuses });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getCountBySources = () => {
    const { startDate, endDate } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);
    axiosInterceptors
      .get(`/api/dashboard/orders/count/by/sources?${dateQuery}`)
      .then(response => {
        this.setState({ sourcesOrders: response.data });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getPreparationCountByDate = () => {
    const { startDate, endDate, preparation, operator } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);

    const preparationIdQuery = preparation
      ? `preparationId=${preparation.value}&`
      : "";
    const operatorIdQuery = operator ? `userId=${operator.value}&` : "";

    axiosInterceptors
      .get(
        `/api/dashboard/preparations/count/by/date?${operatorIdQuery}${preparationIdQuery}${dateQuery}`,
      )
      .then(response => {
        this.setState({ preparationsByDate: response.data });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getPreparationCountByDateOnly = () => {
    const { startDate, endDate, preparationForOnly } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);
    const preparationIdQuery = preparationForOnly
      ? `preparationId=${preparationForOnly.value}&`
      : "";

    axiosInterceptors
      .get(
        `/api/dashboard/preparations/count/by/date?${preparationIdQuery}${dateQuery}`,
      )
      .then(response => {
        this.setState({ preparationsByDateOnly: response.data });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getPreparationByCount = (forOnly = false) => {
    const { startDate, endDate, operator } = this.state;
    const { dateQuery } = startEndDateQuery(startDate, endDate);

    const operatorIdQuery = forOnly
      ? ""
      : operator
      ? `userId=${operator.value}&`
      : "";
    const preparationsByCountOnlyKey = forOnly
      ? "preparationByCountOnly"
      : "preparationByCount";

    axiosInterceptors
      .get(
        `/api/dashboard/preparations/by/count?${operatorIdQuery}${dateQuery}`,
      )
      .then(response => {
        this.setState({ [preparationsByCountOnlyKey]: response.data });
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  render() {
    return (
      <Dashboard
        {...this.state}
        handleDateChange={this.handleDateChange}
        selectControl={this.selectControl}
        getSources={this.getSources}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeMenuPage: menu => dispatch(changeMenuPage(menu)),
  };
};

export default connect(undefined, mapDispatchToProps)(DashboardContainer);
