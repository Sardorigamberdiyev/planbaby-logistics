import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-toastify";
import withDate from "../../../utils/withDate";
import totalPriceFormat from "../../../utils/totalPriceFormat";
import ModalActiveOrder from "../../modal-active-order";
import ModalFailure from "../../modal-failure";
import ModalKuryer from "./../../modal-action-kuryer";
import ModalDelete from "./../../modal-delete";
// import withDate from '../../../utils/withDate';

import "./active-item.css";
import { LOWADMIN } from "../../../constvalue";

const ActiveItem = props => {
  const { t } = useTranslation();
  const [comment, setComment] = useState("");
  const [option, setOption] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModalFailure, setIsShowModalFailure] = useState(false);
  const [isKuryer, setIsKuryer] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isFinishOffice, setFinishOffice] = useState(false);
  const [isFinishCourier, setFinishCourier] = useState(false);

  const {
    order,
    itemStyle,
    itemMenuStyle,
    itemKeyTextStyle,
    itemValueTextStyle,
    itemIconCloseStyle,
    mainHeaderText,
    optionMenuDisabled,
    gprinterHandler,
    telegramHandler,
    failureHandler,
    courierHandler,
    finishOrderHandler,
    onDeleteOrder,
    authRole,
    finishOrderCourier,
  } = props;

  const {
    userId: { firstName: operatorFirstName, lastName: operatorLastName },
    _id: orderId,
    firstName,
    lastName,
    totalPrice,
    products,
    regionId,
    districtId,
    gprinter,
    code,
    isSendTelegram,
    date,
    lastStatusDate
  } = order;

  const joinProductsToText = arr => {
    let text = "";

    arr.forEach((item, index, array) => {
      text += `${item.productId.nameUz} ${item.count}${
        index !== array.length - 1 ? "," : ""
      } `;
    });

    return `${text}`;
  };

  const copyProductsJoinText = arr => {
    let text = "";

    arr.forEach(item => {
      const count = item.count !== 1 ? item.count : "";
      const itemValue = `${item.productId.nameUz.toUpperCase()} ${count}\n          `;
      text += `${itemValue} `;
    });

    return text;
  };

  const gprinterCopyFunc = (copyResult, orderId) => {
    if (copyResult) gprinterHandler(orderId);
    else toast.error(t("error_copy"));
  };

  const failureBrone = orderId => {
    failureHandler(orderId, comment);
    setIsShowModalFailure(false);
  };

  const conditionStyle = "active-item-wrapper active";
  const district = districtId ? districtId : {};
  const region = regionId ? regionId : {};
  const textCopy = `\n ИМЯ: ${firstName.toUpperCase()} ${lastName.toUpperCase()}\n\n ПРЕПАРАТ: ${copyProductsJoinText(
    products,
  )}ID ${code}\n\n            ${region.nameUz.toUpperCase()}, ${
    district ? district.nameUz.toUpperCase() : ""
  }\n             +99871 2000805 \n              www.planbaby.uz`;

  const itemOptionEl = option ? (
    <div className="item-option-menu" style={{ ...itemMenuStyle }}>
      <div className="option-menu-wrapper">
        <ul>
          {authRole === LOWADMIN ? null : (
            <li>
              <Link to={`/clearance/${orderId}`}>
                <i className="icon icon-pencil" />
                {t("btn_edit")}
              </Link>
            </li>
          )}
          <li onClick={() => setIsKuryer(true)}>
            <i className="icon icon-kuryer" />
            {t("courier")}
          </li>
          <li>
            <CopyToClipboard
              text={textCopy}
              onCopy={(valueText, result) => gprinterCopyFunc(result, orderId)}
            >
              <button>
                <i className="icon icon-printer" />
                {t("btn_gprinter_copy")}
              </button>
            </CopyToClipboard>
          </li>
          <li onClick={() => telegramHandler(orderId)}>
            <i className="icon icon-telegram" />
            {t("btn_send_tg")}
          </li>
          <li onClick={() => setFinishOffice(true)}>
            <i className="icon icon-done" />
            {t("success")}({t("success_office")})
          </li>

          {authRole === LOWADMIN ? null : (
            <>
              <li onClick={() => setFinishCourier(true)}>
                <i className="icon icon-check" />
                {t("success")}({t("delivery")})
              </li>
              <li onClick={() => setIsShowModalFailure(true)}>
                <i className="icon icon-failure" />
                {t("refusal")}({t("delivery")})
              </li>
              <li onClick={() => setIsDelete(true)}>
                <i className="icon icon-delete" />
                {t("btn_delete")}
              </li>
            </>
          )}
        </ul>
        <div
          className="option-close-btn"
          style={{ ...itemIconCloseStyle }}
          onClick={() => setOption(false)}
        >
          &#10539;
        </div>
      </div>
    </div>
  ) : (
    <div className="item-option-btn" onClick={() => setOption(true)}>
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );

  const modal = isShowModal ? (
    <ModalActiveOrder
      order={order}
      authRole={authRole}
      mainHeaderText={mainHeaderText}
      setIsShowModal={setIsShowModal}
      optionMenuDisabled={optionMenuDisabled}
    />
  ) : null;
  const finishOfficeFc = () => {
    setFinishOffice(false);
    finishOrderHandler(orderId);
  };
  const modaleFinshOffice = isFinishOffice ? (
    <ModalDelete
      id={orderId}
      code={code}
      textHeader={[t("success"), t("success_office")]}
      setIsShowModalDelete={setFinishOffice}
      deleteBrone={finishOfficeFc}
    />
  ) : null;
  const finishCourierFc = () => {
    setFinishCourier(false);
    finishOrderCourier(orderId);
  };
  const modalFinishCourier = isFinishCourier ? (
    <ModalDelete
      id={orderId}
      code={code}
      textHeader={[t("success"), t("courier")]}
      setIsShowModalDelete={setFinishCourier}
      deleteBrone={finishCourierFc}
    />
  ) : null;
  const modalFailure = isShowModalFailure ? (
    <ModalFailure
      orderId={orderId}
      userFirstName={operatorFirstName}
      userLastName={operatorLastName}
      productCode={code}
      price={totalPrice}
      comment={comment}
      failureBrone={failureBrone}
      setComment={setComment}
      setIsShowModalFailure={setIsShowModalFailure}
    />
  ) : null;

  const modalKuryer = isKuryer ? (
    <ModalKuryer
      order={order}
      courierHandler={courierHandler}
      telegramHandler={telegramHandler}
      setIsKuryer={setIsKuryer}
    />
  ) : null;
  const deleteBrone = id => {
    setIsDelete(false);
    onDeleteOrder(id);
  };
  const modalDelete = isDelete ? (
    <ModalDelete
      id={orderId}
      code={code}
      setIsShowModalDelete={setIsDelete}
      deleteBrone={deleteBrone}
    />
  ) : null;

  return (
    <li className="active-item" style={{ ...itemStyle }}>
      {modal}
      {modalFailure}
      {modalKuryer}
      {modaleFinshOffice}
      {modalFinishCourier}
      {modalDelete}
      <div className={conditionStyle}>
        <div className="item-mini-info">
          {gprinter && <i className="icon icon-printer" />}
          {isSendTelegram && <i className="icon icon-telegram" />}
        </div>
        <div className="item-header">
          <span>
            {firstName} {lastName}
          </span>
          {!optionMenuDisabled ? itemOptionEl : null}
        </div>
        <div
          className="item-body"
          onClick={() => {
            setIsShowModal(true);
            setOption(false);
            setIsShowModalFailure(false);
          }}
        >
          <ul>
            <li>
              <div className="item-key-text" style={{ ...itemKeyTextStyle }}>
                {t("region")}:
              </div>
              <div
                className="item-value-text uc"
                style={{ ...itemValueTextStyle }}
              >
                {region.nameUz}, {district.nameUz}
              </div>
            </li>
            <li>
              <div className="item-key-text" style={{ ...itemKeyTextStyle }}>
                ID:
              </div>
              <div
                className="item-value-text"
                style={{ ...itemValueTextStyle }}
              >
                {code}
              </div>
            </li>
            <li>
              <div className="item-key-text" style={{ ...itemKeyTextStyle }}>
                {t("preparations")}:
              </div>
              <div
                className="item-value-text"
                style={{ ...itemValueTextStyle }}
              >
                {joinProductsToText(products)}
              </div>
            </li>
            <li>
              <div className="item-key-text" style={{ ...itemKeyTextStyle }}>
                {t("price")}:
              </div>
              <div
                className="item-value-text"
                style={{ ...itemValueTextStyle }}
              >
                {totalPriceFormat(totalPrice)} {t("price_currency")}
              </div>
            </li>
            <li>
              <div className="item-key-text" style={{ ...itemKeyTextStyle }}>
                {t("date")}:
              </div>
              <div
                className="item-value-text"
                style={{ ...itemValueTextStyle }}
              >
                {withDate(lastStatusDate || date)}
              </div>
            </li>
            <li>
              <div className="item-key-text" style={{ ...itemKeyTextStyle }}>
                {t("operator")}:
              </div>
              <div
                className="item-value-text"
                style={{ ...itemValueTextStyle }}
              >
                {operatorFirstName + " " + operatorLastName}{" "}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default ActiveItem;
