import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ADMIN, SUPERADMIN } from "../../constvalue";
import totalPriceFormat from "../../utils/totalPriceFormat";
import withDate from "../../utils/withDate";
import ModalData from "./../modal-data/modal-data";

import "./order-all-item.css";

function OrderAllItem(props) {
  const { t } = useTranslation();
  const {
    status,
    firstName,
    lastName,
    districtId,
    regionId,
    products,
    code,
    totalPrice,
    userId,
    handleBack,
    lastStatusDate,
    _id,
  } = props;

  const [isShowModal, setIsShowModal] = useState(false);
  const [isBack, setIsBack] = useState(false);
  const joinProductsToText = arr => {
    let text = "";

    arr.forEach((item, index, array) => {
      text += `${item.productId.nameUz} ${item.count}${
        index !== array.length - 1 ? "," : ""
      } `;
    });

    return `${text}`;
  };

  const roleASA = ADMIN || SUPERADMIN;
  const optionBack = roleASA ? (
    <div className="option_back" onClick={() => setIsBack(false)}>
      <div className="option_disabled">⤫</div>
      <div className="back" onClick={() => handleBack(_id, status)}>
        <span>{"<-"}</span> {t("back_return")}
      </div>
    </div>
  ) : null;

  return (
    <div className="order-all-item">
      {isShowModal ? (
        <ModalData {...props} setIsShowModal={setIsShowModal} />
      ) : null}

      <div className={`status ${status}`}>
        <h4>
          {firstName} {lastName}
        </h4>
        {isBack ? (
          optionBack
        ) : (
          <div className="icon-move-back" onClick={() => setIsBack(true)}>
            <div />
            <div />
            <div />
          </div>
        )}

        <ul onClick={() => setIsShowModal(true)}>
          <li>
            <div className="item-key-text">{t("region")}:</div>
            <div className="item-value-text uc">
              {regionId.nameUz}, {districtId.nameUz}
            </div>
          </li>
          <li>
            <div className="item-key-text">ID:</div>
            <div className="item-value-text">{code}</div>
          </li>
          <li>
            <div className="item-key-text">{t("preparations")}:</div>
            <div className="item-value-text">
              {joinProductsToText(products)}
            </div>
          </li>
          <li>
            <div className="item-key-text">{t("price")}:</div>
            <div className="item-value-text">
              {totalPriceFormat(totalPrice)} {t("price_currency")}
            </div>
          </li>
          {lastStatusDate ? (
            <li>
              <div className="item-key-text">{t("date")}:</div>
              <div className="item-value-text">{withDate(lastStatusDate)}</div>
            </li>
          ) : null}
          <li>
            <div className="item-key-text">{t("operator")}:</div>
            <div className="item-value-text">
              {userId.firstName + " " + userId.lastName}{" "}
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default OrderAllItem;
