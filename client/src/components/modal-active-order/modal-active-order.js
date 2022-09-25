import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { LOWADMIN } from "../../constvalue";
import totalPriceFormat from "../../utils/totalPriceFormat";
import withDate from "../../utils/withDate";

import "./modal-active-order.css";

const ModalActiveOrder = props => {
  const { t } = useTranslation();
  const {
    order: {
      _id: id,
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
    },
    mainHeaderText,
    pushChecked,
    setIsShowModal,
    deleteCheckerId,
    modalType,
    optionMenuDisabled,
    authRole,
  } = props;

  const postChecked = id => {
    pushChecked(id);
    setIsShowModal(false);
  };

  const deleteChecker = id => {
    deleteCheckerId(id);
    setIsShowModal(false);
  };

  const editBtn = (
    <p>
      <Link to={`/clearance/${id}`}>
        <i className="icon icon-pencil"></i>
        <span>{t("btn_edit")}</span>
      </Link>
    </p>
  );

  const checkerHandler = (
    <>
      <p onClick={() => postChecked(id)}>
        <i className="icon icon-check"></i>
        <span>{t("checked")}</span>
      </p>
      <p>
        <Link to={`/clearance/${id}`}>
          <i className="icon icon-pencil"></i>
          <span>{t("btn_edit")}</span>
        </Link>
      </p>
      <p onClick={() => deleteChecker(id)}>
        <i className="icon icon-delete"></i>
        <span>{t("btn_delete")}</span>
      </p>
    </>
  );

  return (
    <div className="modal-active-order">
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
            <div className="input-footer-wrapper">
              {modalType === "checker" && !optionMenuDisabled
                ? checkerHandler
                : null}
              {modalType !== "checker" &&
              !optionMenuDisabled &&
              authRole !== LOWADMIN
                ? editBtn
                : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalActiveOrder;
