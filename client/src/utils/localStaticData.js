import { STATUS_ACTIVE } from "../constvalue";

const countryMobileCode = [
  {
    label: "Узбекистан",
    value: "uzbekistan",
    name: "numberCodeValue",
    iconClassName: "icon icon-uzbakistan",
    format: "+998(##)###-##-##",
    placeholder: "+998(__)___-__-__",
  },
  {
    label: "Қиргизистон",
    value: "kyrgyzstan",
    name: "numberCodeValue",
    iconClassName: "icon icon-kyrgyzstan",
    format: "+996 ###-###-###",
    placeholder: "+996 ___-___-___",
  },
  {
    label: "Қозоқистон",
    value: "khazakstan",
    name: "numberCodeValue",
    iconClassName: "icon icon-kazakhstan",
    format: "+7(##)###-##-##",
    placeholder: "+7(__)___-__-__",
  },
  {
    label: "Тожикистон",
    value: "tajikistan",
    name: "numberCodeValue",
    iconClassName: "icon icon-tajikistan",
    format: "+992-###-##-####",
    placeholder: "+992-___-__-____",
  },
  {
    label: "Россия",
    value: "russia",
    name: "numberCodeValue",
    iconClassName: "icon icon-russia",
    format: "+7-##########",
    placeholder: "+7-__________",
  },
  {
    label: "Туркманистон",
    value: "turkmenistan",
    name: "numberCodeValue",
    iconClassName: "icon icon-turmenistan",
    format: "+993-########",
    placeholder: "+993-________",
  },
  {
    label: "Америка",
    value: "america",
    name: "numberCodeValue",
    iconClassName: "icon icon-usa",
    format: "+1-###-###-##-##",
    placeholder: "+1-___-___-__-__",
  },
  {
    label: "Бошка",
    value: "other",
    name: "numberCodeValue",
    iconClassName: "",
    format: undefined,
    placeholder: "+__________________",
  },
];

const limitOptions = [
  { label: "50", value: 50, name: "limit" },
  { label: "100", value: 100, name: "limit" },
  { label: "150", value: 150, name: "limit" },
  { label: "500", value: 500, name: "limit" },
];

const priorityOptions = [
  { label: "3", value: 3, name: "priority" },
  { label: "2", value: 2, name: "priority" },
  { label: "1", value: 1, name: "priority" },
  { label: "0", value: 0, name: "priority" },
];

const dayMonthOptions = [
  { label: "Ораликда", value: "range", name: "dayMonth" },
  { label: "Кунли", value: "day", name: "dayMonth" },
  { label: "Хафталик", value: "week", name: "dayMonth" },
  { label: "Ойлик", value: "month", name: "dayMonth" },
];

const apiOrders = typeOrder => {
  switch (typeOrder) {
    case STATUS_ACTIVE:
      return "/api/verified/all?condition=active";
    case "delivered":
      return `/api/delivery/all?condition=delivered`;
    case "not-delivered":
      return `/api/delivery/all?condition=not_delivered`;
    case "success-from-warehouse":
      return "/api/verified/all?condition=from_warehouse";
    case "failured":
      return `/api/failured`;
    default:
      return null;
  }
};

const apiOrdersByCode = (typeOrder, onlyTerm) => {
  switch (typeOrder) {
    case "verified":
      return `/api/verified/all/by/code?term=${onlyTerm}&typeCondition=active`;
    case "delivered":
      return `/api/delivery/all/by/code?term=${onlyTerm}&typeCondition=delivered`;
    case "not-delivered":
      return `/api/delivery/all/by/code?term=${onlyTerm}&typeCondition=not_delivered`;
    case "success-from-warehouse":
      return `/api/verified/all/by/code?term=${onlyTerm}&typeCondition=from_warehouse`;
    case "failured":
      return `/api/failured/by/code?term=${onlyTerm}`;
    default:
      return null;
  }
};

const apiOrdersByDistrict = typeOrder => {
  switch (typeOrder) {
    case "verified":
      return `/api/verified/all/by/district?condition=active`;
    case "delivered":
      return `/api/delivery/all/by/district?typeCondition=delivered`;
    case "not-delivered":
      return `/api/delivery/all/by/district?typeCondition=not_delivered`;
    case "success-from-warehouse":
      return `/api/verified/all/by/district?condition=from_warehouse`;
    case "failured":
      return `/api/failured/by/district`;
    default:
      return null;
  }
};

const apiOrdersStatistics = typeOrder => {
  switch (typeOrder) {
    case "verified":
      return `/api/verified/all/statistics?condition=active`;
    case "delivered":
      return `/api/delivery/all/statistics?condition=delivered`;
    case "not-delivered":
      return `/api/delivery/all/statistics?condition=not_delivered`;
    case "success-from-warehouse":
      return `/api/verified/all/statistics?condition=from_warehouse`;
    case "failured":
      return `/api/failured/statistics`;
    default:
      return null;
  }
};

export {
  countryMobileCode,
  limitOptions,
  priorityOptions,
  dayMonthOptions,
  apiOrders,
  apiOrdersByCode,
  apiOrdersByDistrict,
  apiOrdersStatistics,
};
