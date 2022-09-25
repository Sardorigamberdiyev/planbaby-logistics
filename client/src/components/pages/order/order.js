import React from "react";
import OrderList from "../../order-list";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "react-calendar/dist/Calendar.css";
import "./order.css";
import {
  STATUS_ACTIVE,
  STATUS_COURIER_FAILURE,
  STATUS_DELIVERED_SUCCESS,
  STATUS_IN_COURIER,
  STATUS_OFFICE_SUCCESS,
} from "../../../constvalue";

const Order = props => {
  const { t } = useTranslation();
  const {
    active_orders,
    active_length,
    active_loading,
    active_error,
    courier_failure_orders,
    courier_failure_length,
    courier_failure_loading,
    courier_failure_error,
    failureHandler,
    in_courier_orders,
    in_courier_length,
    in_courier_loading,
    in_courier_error,
    delivered_success_orders,
    delivered_success_length,
    delivered_success_loading,
    delivered_success_error,
    office_success_orders,
    office_success_length,
    office_success_loading,
    office_success_error,
    gprinterHandler,
    telegramHandler,
    courierHandler,
    finishOrderHandler,
    isMenuShow,
    finishOrderCourier,
    onDeleteOrder,

    handleBack,
  } = props;

  const itemStyle = {
    marginBottom: "1rem",
  };

  const classNamesForCol = `order-col ${isMenuShow ? "showed-menu" : ""}`;

  return (
    <div className="order">
      <div className="order-wrapper">
        <div className="order-cols-wrapper">
          <div className="order-col">
            <Link
              to={`/order/filter/${STATUS_ACTIVE}`}
              className="order-col-header active-order"
            >
              <span>{t("verified_orders")}</span>
              <span>{active_length}</span>
            </Link>
            <OrderList
              handleBack={handleBack}
              typeList="verified"
              mainHeaderText={t("verified_order")}
              orders={active_orders}
              loading={active_loading}
              error={active_error}
              itemStyle={itemStyle}
              gprinterHandler={gprinterHandler}
              failureHandler={failureHandler}
              telegramHandler={telegramHandler}
              courierHandler={courierHandler}
              finishOrderHandler={finishOrderHandler}
              onDeleteOrder={onDeleteOrder}
              finishOrderCourier={finishOrderCourier}
            />
          </div>
          <div className="order-col">
            <Link
              to={`/order/filter/${STATUS_IN_COURIER}`}
              className="order-col-header not-delivery-order"
            >
              <span>{t("at_couriers")}</span>
              <span>{in_courier_length}</span>
            </Link>
            <OrderList
              handleBack={handleBack}
              typeList="in_courier"
              mainHeaderText={t("at_courier")}
              orders={in_courier_orders}
              loading={in_courier_loading}
              error={in_courier_error}
              itemStyle={itemStyle}
            />
          </div>
          <div className="order-col">
            <Link
              to={`/order/filter/${STATUS_DELIVERED_SUCCESS}`}
              className="order-col-header successful-order"
            >
              <span>{t("delivered_orders")}</span>
              <span>{delivered_success_length}</span>
            </Link>
            <OrderList
              handleBack={handleBack}
              typeList="delivered_success"
              mainHeaderText={t("delivered_order")}
              orders={delivered_success_orders}
              loading={delivered_success_loading}
              error={delivered_success_error}
              itemStyle={itemStyle}
            />
          </div>
          <div className={classNamesForCol}>
            <Link
              to={`/order/filter/${STATUS_OFFICE_SUCCESS}`}
              className="order-col-header from-warehouse"
            >
              <span>{t("from_office_orders")}</span>
              <span>{office_success_length}</span>
            </Link>
            <OrderList
              handleBack={handleBack}
              typeList="office_success"
              mainHeaderText={t("from_office_order")}
              optionMenuDisabled={true}
              orders={office_success_orders}
              loading={office_success_loading}
              error={office_success_error}
              itemStyle={itemStyle}
            />
          </div>
          <div className="order-col">
            <Link
              to={`/order/filter/${STATUS_COURIER_FAILURE}`}
              className="order-col-header problem-order"
            >
              <span>{t("refusal")}</span>
              <span>{courier_failure_length}</span>
            </Link>
            <OrderList
              handleBack={handleBack}
              typeList="courier_failure"
              mainHeaderText={t("failure_order")}
              orders={courier_failure_orders}
              loading={courier_failure_loading}
              error={courier_failure_error}
              itemStyle={itemStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
