import React from "react";
import { useSelector } from "react-redux";
import { ActiveItem } from "../condition-items";
import OrderAllItem from "../order-all-item";
import "./order-list-item.css";
import {
  STATUS_ACTIVE,
  STATUS_COURIER_FAILURE,
  STATUS_DELIVERED_SUCCESS,
  STATUS_IN_COURIER,
  STATUS_OFFICE_SUCCESS,
} from "../../constvalue";

const OrderListItem = props => {
  const { order, mainHeaderText, typeList, handleBack } = props;

  const authRole = useSelector(state => state.role);
  if (typeList === "verified" || typeList === STATUS_ACTIVE)
    return (
      <ActiveItem
        authRole={authRole}
        {...props}
        mainHeaderText={mainHeaderText}
      />
    );
  if (
    typeList === STATUS_IN_COURIER ||
    typeList === STATUS_DELIVERED_SUCCESS ||
    typeList === STATUS_COURIER_FAILURE ||
    typeList === STATUS_OFFICE_SUCCESS
  )
    return (
      <OrderAllItem authRole={authRole} {...order} handleBack={handleBack} />
    );
  return <div>Выберите тип</div>;
};

export default OrderListItem;
