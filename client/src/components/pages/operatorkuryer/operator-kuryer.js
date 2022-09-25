import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import StatusData from "../../../utils/statusData";
import Spinner from "../../spinner";
import OperatorItem from "./operator-item";
import FilterModal from "../../filter-modal";
import totalPriceFormat from "../../../utils/totalPriceFormat";
import withDate from "../../../utils/withDate";
import "./oprator.css";

export default function OperatorKuryer(props) {
  const { t } = useTranslation();
  const {
    user,
    order,
    orders,
    stillBtn,
    loading,
    loadingUpdate,
    handleDate,
    btnLastDisabled,
    ordersLength,
    inputControl,
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
  } = props;

  const [filter, setFilter] = useState(false);
  const btnDisabledStyle = btnLastDisabled ? "btn-still-disable" : "";
  const spinnerForBtn = loading ? <Spinner /> : null;

  const statisticsData = StatusData();
  const btnStill = loadingUpdate ? (
    <div className="btn-still-wrapper">
      <button type="button" className={btnDisabledStyle} onClick={stillBtn}>
        {t("still")}
      </button>
    </div>
  ) : null;

  return (
    <div className="my-orders">
      <div className="my-orders-wrapper">
        <div className="user-data">
          <div className="user-data-wrapper">
            <div className="user-data-avatar">
              <div className="user-avatar" />
              <div className="user-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="user-role">{user.role}</div>
            </div>
            <div className="user-data-profile">
              <ul>
                <li>
                  <span>{t("phone")}</span>
                  <div>{user.phone}</div>
                </li>
                <li>
                  <span>{t("login")}</span>
                  <div>{user.login}</div>
                </li>
                <li>
                  <span>{t("password")}</span>
                  <div>******</div>
                </li>
              </ul>
            </div>
          </div>
          <div className="buyurtmalar">
            {statisticsData.map((s, i) => {
              const item = order.find(o => o._id === s.id);

              const maxCount = item ? item.maxCount : 0;
              const cms = item ? item.cms : 0;

              const startDate = new Date(
                Date.UTC(startYear, startMonth - 1, startDay, 0, 0, 0, 0),
              );
              const endDate = new Date(
                Date.UTC(endYear, endMonth - 1, endDay, 23, 59, 59, 999),
              );

              return (
                <div className="status_day" key={i}>
                  <div className="top" style={{ backgroundColor: s.color }} />
                  <h5>{s.name}</h5>
                  <p>
                    {startYear && withDate(startDate)} -{" "}
                    {endYear && withDate(endDate)}
                  </p>
                  <p>
                    {t("quantity")}: <span>{maxCount}</span>
                  </p>
                  <p>
                    {t("total_price")}:{" "}
                    <span>
                      {totalPriceFormat(cms)} {t("price_currency")}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="user-orders-filter">
          <div className="confirm-filter-header">
            {statisticsData.map(item => {
              const countObeject = order.find(i => i._id === item.id);
              const count = countObeject ? countObeject.maxCount : 0;

              return (
                <div className="orders-quantity-info" key={item.id}>
                  <div
                    className="top"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="input-text">
                    <div>{item.name}</div>
                    <span style={{ color: item.color }}>{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="operator-filter-container">
            {filter && (
              <FilterModal
                inputControl={inputControl}
                setShow={setFilter}
                handleDate={handleDate}
              />
            )}
            <div className="kuryer-filter-icons">
              <div onClick={() => setFilter(!filter)}>
                <i className="icon icon-filter filter-icons"></i>
              </div>
            </div>
          </div>
          <div className="comfirm-filter-list">
            <div className="confirm-tekshirilmagan">
              <div className="confirm-list-header">
                <h4>
                  {t("orders")} <span>{ordersLength}</span>
                </h4>
              </div>
              <Row className="operator-list-items">
                {orders.map(item => (
                  <Col xxl={4} xl={6} lg={12} md={12} sm={6} key={item._id}>
                    <OperatorItem
                      data={item}
                      key={item._id}
                      statisticsData={statisticsData}
                    />
                  </Col>
                ))}
              </Row>
              {spinnerForBtn}
            </div>
          </div>
          {btnStill}
        </div>
      </div>
    </div>
  );
}
