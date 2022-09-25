import { useTranslation } from "react-i18next";
import {
  STATUS_ACTIVE,
  STATUS_COURIER_FAILURE,
  STATUS_DELIVERED_SUCCESS,
  STATUS_IN_COURIER,
  STATUS_NOT_ACTIVE,
  STATUS_OFFICE_SUCCESS,
} from "../constvalue";

function StatusData() {
  const { t } = useTranslation();
  const statisticsData = [
    {
      id: STATUS_NOT_ACTIVE,
      color: "#FF7A30",
      name: t("not_verified"),
      count: 0,
    },
    {
      id: STATUS_ACTIVE,
      color: "#6691E0",
      name: t("verified_orders"),
      count: 0,
    },

    {
      id: STATUS_OFFICE_SUCCESS,
      color: "#9326FF ",
      name: t("from_office_orders"),
      count: 0,
    },
    {
      id: STATUS_IN_COURIER,
      color: "#FB66B8",
      name: t("in_curier"),
      count: 0,
    },
    {
      id: STATUS_DELIVERED_SUCCESS,
      color: "#56EB80 ",
      name: t("delivered_orders"),
      count: 0,
    },
    {
      id: STATUS_COURIER_FAILURE,
      color: "#FF3C30 ",
      name: t("refusal"),
      count: 0,
    },
  ];
  return statisticsData;
}

export default StatusData;
