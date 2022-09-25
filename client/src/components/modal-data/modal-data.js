import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import totalPriceFormat from "../../utils/totalPriceFormat";
import withDate from "../../utils/withDate";
import axiosInterceptors from "../../utils/axiosInterceptors";
import "./modal-data.css";
import {
  LOWADMIN,
  ADMIN,
  SUPERADMIN,
  STATUS_ACTIVE,
  STATUS_COURIER_FAILURE,
  STATUS_DELIVERED_SUCCESS,
  STATUS_IN_COURIER,
  STATUS_NOT_ACTIVE,
  STATUS_OFFICE_FAILURE,
  STATUS_OFFICE_SUCCESS,
} from "../../constvalue";

const ModalActiveOrder = props => {
  const { t } = useTranslation();
  const {
    firstName,
    lastName,
    regionId,
    districtId,
    phones,
    products,
    source,
    sourceId,
    payment,
    totalPrice,
    code,
    comment,
    date,
    setIsShowModal,
    mainHeaderText,
    _id,
  } = props;

  const [historys, setHistorys] = useState([]);
  const authRole = useSelector(state => state.role);

  useEffect(() => {
    if (authRole === LOWADMIN || authRole === ADMIN || authRole === SUPERADMIN)
      axiosInterceptors.get(`/api/history/only/${_id}`).then(res => {
        const { historys } = res.data;
        setHistorys(historys);
      });
    // eslint-disable-next-line
  }, [_id]);

  return (
    <div className="modal-active-order data-modal">
      <div className="modal-content">
        <div className="modal-content-wrapper">
          <span className="close-modal" onClick={() => setIsShowModal(false)}>
            &#10005;
          </span>
          <h2>{mainHeaderText}</h2>
          <div className="order-view">
            <div className="input-value-group">
              <div className="input-value-wrapper default">
                <span>{t("first_name")}</span>
                <div>{firstName}</div>
              </div>
              <div className="input-value-wrapper default">
                <span>{t("last_name")}</span>
                <div>{lastName}</div>
              </div>
            </div>
            <div className="input-value-group">
              <div className="input-value-wrapper default">
                <span>{t("region")}</span>
                <div>{regionId.nameUz}</div>
              </div>
              <div className="input-value-wrapper default">
                <span>{t("district")}</span>
                <div>{districtId.nameUz}</div>
              </div>
            </div>
            <div className="input-multi-value-wrapper">
              <span>{t("phone")}</span>
              <div className="input-multi-value">
                <ul>
                  {phones.map((item, index) => {
                    return <li key={index}>{item}</li>;
                  })}
                </ul>
              </div>
            </div>
            <div className="input-multi-value-wrapper">
              <span>{t("products")}</span>
              <div className="input-multi-value">
                <ul>
                  {products.map(item => (
                    <li key={item._id}>
                      {item.productId.nameUz
                        ? item.productId.nameUz + " " + item.count
                        : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="input-value-group">
              <div className="input-value-wrapper source">
                <span>{t("source")}</span>
                <div>{sourceId ? sourceId.name : source}</div>
              </div>
              <div className="input-value-wrapper">
                <span>{payment === "spot" ? t("cash") : t("card")}</span>
                <div className="payment">
                  <i
                    className={
                      payment === "spot" ? "icon icon-cash" : "icon icon-card"
                    }
                  />
                </div>
              </div>
              <div className="input-value-wrapper default">
                <span>{t("price")}</span>
                <div>{totalPriceFormat(totalPrice)}</div>
              </div>
            </div>
            <div className="input-value-group unset-jc">
              <div className="input-value-wrapper">
                <span>ID</span>
                <div>{code}</div>
              </div>
              <div className="input-value-wrapper">
                <span>{t("date")}</span>
                <div>{withDate(date)} </div>
              </div>
            </div>
            <div className="textarea-value-wrapper">
              <span>{t("comment")}</span>
              <div>
                <p>{comment}</p>
              </div>
            </div>
            <div className="input-multi-value-wrapper">
              <div className="input-multi-value">
                <ul className="data-history">
                  {historys.map((item, index) => {
                    return <History key={index} item={item} />;
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const History = ({ item }) => {
  const [fullHistory, setFullHistory] = useState(true);
  const { t } = useTranslation();
  const {
    userId: { firstName, lastName },
    action: { actionType },
    oldStatus,
    newStatus,
    date,
  } = item;

  const statisticsData = [
    {
      id: STATUS_ACTIVE,
      name: t("verified_orders"),
    },
    {
      id: STATUS_NOT_ACTIVE,
      name: t("not_verified"),
    },
    {
      id: STATUS_OFFICE_SUCCESS,
      name: t("from_office_orders"),
    },
    {
      id: STATUS_COURIER_FAILURE,
      name: t("failure_orders"),
    },
    {
      id: STATUS_DELIVERED_SUCCESS,
      name: t("delivered_orders"),
    },
    {
      id: STATUS_IN_COURIER,
      name: t("in_curier"),
    },
    {
      id: STATUS_OFFICE_FAILURE,
      name: "office failure",
    },
  ];

  // const moveData = [
  //   "confirm", //zakaz tastiqlandi
  //   "delete", //zakaz O'chirildi
  //   "edit_order", // zakaz o'zgartirildi
  //   "send_courier", //zakaz kuryerga berildi
  //   "office_finish", // zakaz officedan sotildi
  //   "admin_delivery_finish", // admin dastavgaga chiqqan zakazni yakunladi
  //   "delivery_finish", //curyer zakazni yetkazib berdi
  //   "admin_delivery_failure", //admin dastavkaga chiqqan zakazni rad etti
  //   "delivery_failure", // curyer dastavkaga chiqqan zakazni rad eddi
  // ];
  // const moveFc = move => moveData.find(item => item === move);

  const statusFc = status =>
    statisticsData.find(item => item.id === status).name;

  return (
    <li>
      <div className={`fulldata ${!fullHistory ? "active" : ""}`}>
        <div className="fullname">{firstName + " " + lastName}</div>
        <div className="date">{withDate(date)}</div>
        {oldStatus && newStatus ? (
          <>
            <div className="old">{statusFc(oldStatus)}</div>
            <div className="next">{"->"}</div>
            <div className="new">{statusFc(newStatus)}</div>
          </>
        ) : null}
      </div>
      <div className="action">{t(`move_${actionType}`)}</div>
      <div className="date">{withDate(date)}</div>
      <div className="all-data" onClick={() => setFullHistory(!fullHistory)}>
        {fullHistory ? "::" : "X"}
      </div>
    </li>
  );
};

export default ModalActiveOrder;
