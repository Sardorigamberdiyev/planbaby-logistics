import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import totalPriceFormat from "../../../utils/totalPriceFormat";
import ModalFailureOrder from "../../modal-failure-order";
import ModalDelete from "../../modal-delete";

import "./failure-item.css";
import { ADMIN, COURIER, LOWADMIN } from "../../../constvalue";

const FailureItem = props => {
  const { t } = useTranslation();
  const [option, setOption] = useState(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const {
    order,
    deleteHandler,
    itemStyle,
    itemMenuStyle,
    itemIconCloseStyle,
    itemKeyTextStyle,
    itemValueTextStyle,
    optionMenuDisabled,
    mainHeaderText,
    authRole,
  } = props;

  const {
    _id: id,
    userId: {
      firstName: retractorFirstName,
      lastName: retractorLastName,
      role,
    },
    orderId: {
      userId: { firstName: operatorFirstName, lastName: operatorLastName },
      totalPrice,
      comment,
      code,
    },
  } = order;

  const deleteBrone = id => {
    deleteHandler(id);
    setIsShowModalDelete(false);
    setIsShowModal(false);
  };

  const modalDelete = isShowModalDelete ? (
    <ModalDelete
      id={id}
      code={code}
      deleteBrone={deleteBrone}
      setIsShowModalDelete={setIsShowModalDelete}
    />
  ) : null;

  const itemOptionEl = option ? (
    <div className="item-option-menu" style={{ ...itemMenuStyle }}>
      <div className="option-menu-wrapper">
        <ul>
          <li onClick={() => setIsShowModalDelete(true)}>
            <i className="icon icon-delete" />
            {t("btn_delete")}
          </li>
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
  ) : null;

  const decodedRoleName = role => {
    switch (role) {
      case ADMIN:
        return "Админ";
      case COURIER:
        return "Курьер";
      default:
        return "Админ";
    }
  };

  const modal = isShowModal ? (
    <ModalFailureOrder
      {...order}
      authRole={authRole}
      setIsShowModal={setIsShowModal}
      deleteBrone={deleteBrone}
      optionMenuDisabled={optionMenuDisabled}
      mainHeaderText={mainHeaderText}
    />
  ) : null;

  return (
    <li className="failure-item" style={{ ...itemStyle }}>
      {modal}
      {modalDelete}
      <div className="failure-item-wrapper">
        <div className="item-header">
          <div>
            <div className="item-key-text" style={{ ...itemKeyTextStyle }}>
              {t("operator")}:
            </div>
            <div className="item-value-text" style={{ ...itemValueTextStyle }}>
              {operatorFirstName} {operatorLastName}
            </div>
          </div>
          {authRole === LOWADMIN ? null : (
            <div
              className={
                option ? "item-option-btn btn-hidden" : "item-option-btn"
              }
              onClick={() => setOption(true)}
            >
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
          )}
          {!optionMenuDisabled ? itemOptionEl : null}
        </div>
        <div
          className="item-body"
          onClick={() => {
            setIsShowModal(true);
            setIsShowModalDelete(false);
          }}
        >
          <ul>
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
                {decodedRoleName(role)}:
              </div>
              <div
                className="item-value-text"
                style={{ ...itemValueTextStyle }}
              >
                {retractorFirstName} {retractorLastName}
              </div>
            </li>
            <li>
              <div className="item-key-text" style={{ ...itemKeyTextStyle }}>
                {t("comment")}:
              </div>
              <div
                className="item-value-text"
                style={{ ...itemValueTextStyle }}
              >
                {comment}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </li>
  );
};

export default FailureItem;
