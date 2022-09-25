import React from "react";
import OrderListItem from "../order-list-item";
import ErrorIndicator from "../error-indicator";
import Spinner from "../spinner";
import "./order-list.css";

const OrderList = props => {
  const { orders, loading, error, listStyle } = props;

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorIndicator />;
  }

  return (
    <div className="order-list">
      <ul style={{ ...listStyle }}>
        {orders.map(item => {
          return <OrderListItem key={item._id} order={item} {...props} />;
        })}
      </ul>
    </div>
  );
};

export default OrderList;
