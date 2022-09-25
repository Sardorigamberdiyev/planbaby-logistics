import React, { useState } from "react";
import NumberFormat from "react-number-format";
import ValueList from "../../value-list";
import withDate from "../../../utils/withDate";
import Select from "react-select";
import { countryMobileCode } from "../../../utils/localStaticData";
import { useTranslation } from "react-i18next";
import { OPERATOR } from "../../../constvalue";

import "./clearance-goods.css";

const ClearanceGoods = props => {
  const { t } = useTranslation();
  const {
    tasks,
    inputControl,
    selectControl,
    isOpenSelect,
    openSelect,
    firstName,
    lastName,
    region,
    district,
    product,
    source,
    regionOptions,
    districtOptions,
    productOptions,
    sCategoryOptions,
    sourceOptions,
    errorMsgInput,
    address,
    plot,
    phone,
    code,
    productCount,
    categorySource,
    comment,
    payment,
    totalPrice,
    phoneList,
    pushPhone,
    pushProduct,
    numberCodeValue,
    removePhone,
    removeProduct,
    radioSpotTrigger,
    radioCardTrigger,
    role,
    clearanceGoodsHandler,
    title,
    textBtn,
    productListItems,
  } = props;

  const spotChecked = payment === "spot";
  const cardChecked = payment === "card";
  const [btn, setBtn] = useState(false);
  const dateDay = e => withDate(e).split(",")[0];

  const selectCustumStyles = {
    container: (provided, state) => ({
      ...provided,
      width: "348px",
      opacity: state.isDisabled ? ".3" : "1",
    }),
    option: (provided, state) => {
      return {
        ...provided,
        color: state.isSelected ? "#6691E0" : "#1d1d1d96",
        backgroundColor: "transparent",
      };
    },
    placeholder: (provided, state) => ({
      ...provided,
      color: "#9F4FDE",
      fontSize: "14px",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: "#1D1D1D",
      fontSize: "14px",
    }),
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      height: "50px",
      borderColor: state.isSelected ? "#D72525" : "#F6F8FE",
      borderRadius: ".5rem",
      backgroundColor: "#F6F8FE",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
    }),
    menuList: (provided, state) => ({
      ...provided,
      backgroundColor: "white",
      boxShadow: "2px 4px 16px 0 #d99ee23d",
      textTransform: "uppercase",
    }),
  };

  const selectCustumStylesDistrict = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      height: "50px",
      backgroundColor: "#F6F8FE",
      borderRadius: ".5rem",
      borderColor: errorMsgInput.district && !district ? "#D72525" : "#F6F8FE",
    }),
  };

  const selectCustumStylesProduct = {
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      height: "50px",
      backgroundColor: "#F6F8FE",
      borderRadius: ".5rem",
      borderColor: errorMsgInput.products ? "#D72525" : "#F6F8FE",
    }),
  };
  const useRole = role === OPERATOR
  return (
    <div className="clearance-goods">
      <div className="clearance-wrapper">
        {title ? <h1 className="title-component">{title}</h1> : null}
        { useRole ?  <>
          <div
            className={`btn-menu ${btn ? "active" : null}`}
            onClick={() => setBtn(!btn)}
          >
            Вазифа
          </div>
          <div className={`tasks ${btn ? "btn-display" : null}`}>
            {tasks.map(task => (
              <div key={task._id} className="task">
                <div className="task_header">
                  <h3>Вазифа</h3>
                  <h4>
                    {task.managerId.firstName} {task.managerId.lastName}
                  </h4>
                </div>
                <div className="task_name">
                  <span>{task.count}</span> {task.name}
                </div>
                <div className="desciption">{task.description}</div>
                <div className="date">
                  <div>{dateDay(task.start)}</div>
                  <div>{dateDay(task.end)}</div>
                </div>
              </div>
            ))}
          </div>
        </> : null}
        <form onSubmit={clearanceGoodsHandler}>
          <div className="input-custom-group">
            <div className="input-custom">
              <label
                htmlFor="firstName"
                className={firstName ? "input-focused" : ""}
              >
                {t("first_name")}
              </label>
              <input
                type="text"
                className={
                  errorMsgInput.firstName && !firstName ? "error-input" : ""
                }
                id="firstName"
                name="firstName"
                placeholder={t("first_name")}
                value={firstName}
                onChange={inputControl}
              />
              <span className="error-msg">
                {!firstName ? errorMsgInput.firstName : null}
              </span>
            </div>
            <div className="input-custom">
              <label
                htmlFor="lastName"
                className={lastName ? "input-focused" : ""}
              >
                {t("last_name")}
              </label>
              <input
                type="text"
                className={
                  errorMsgInput.lastName && !lastName ? "error-input" : ""
                }
                id="lastName"
                name="lastName"
                placeholder={t("last_name")}
                value={lastName}
                onChange={inputControl}
              />
              <span className="error-msg">
                {!lastName ? errorMsgInput.lastName : null}
              </span>
            </div>
          </div>
          <div className="input-custom-group">
            <div className="input-custom">
              <label htmlFor="region" className={region ? "input-focused" : ""}>
                {t("region")}
              </label>
              <div className="select-custom">
                <Select
                  value={region}
                  onChange={selectControl}
                  styles={selectCustumStyles}
                  options={regionOptions}
                />
              </div>
              <span className="error-msg">
                {!region ? errorMsgInput.region : null}
              </span>
            </div>
            <div className="input-custom">
              <label
                htmlFor="district"
                className={district ? "input-focused" : ""}
              >
                {t("district")}
              </label>
              <div className="select-custom">
                <Select
                  value={district}
                  onChange={selectControl}
                  styles={{
                    ...selectCustumStyles,
                    ...selectCustumStylesDistrict,
                  }}
                  options={districtOptions}
                  isDisabled={region === null}
                />
              </div>
              <span className="error-msg">
                {!district ? errorMsgInput.district : null}
              </span>
            </div>
          </div>
          <div className="input-custom-group">
            <div className="input-custom">
              <label
                htmlFor="address"
                className={address ? "input-focused" : ""}
              >
                {t("address")}
              </label>
              <input
                type="text"
                className={
                  errorMsgInput.address && !address ? "error-input" : ""
                }
                id="address"
                name="address"
                placeholder={t("address")}
                value={address}
                onChange={inputControl}
              />
              <span className="error-msg">
                {!address ? errorMsgInput.address : null}
              </span>
            </div>
            <div className="input-custom">
              <label htmlFor="plot" className={plot ? "input-focused" : ""}>
                {t("plot")}
              </label>
              <input
                type="text"
                className={errorMsgInput.plot && !plot ? "error-input" : ""}
                id="plot"
                name="plot"
                placeholder={t("plot")}
                value={plot}
                onChange={inputControl}
              />
              <span className="error-msg">
                {!plot ? errorMsgInput.plot : null}
              </span>
            </div>
          </div>
          <div className="input-custom-group">
            <div className="input-custom">
              <label htmlFor="phone" className={phone ? "input-focused" : ""}>
                {t("phone")}
              </label>
              <div className="number-format-wrapper">
                <NumberFormat
                  format={numberCodeValue.format}
                  mask="_"
                  className={
                    errorMsgInput.telephones && !phoneList.length
                      ? "error-input"
                      : ""
                  }
                  name="phone"
                  placeholder={numberCodeValue.placeholder}
                  displayType={"input"}
                  value={phone}
                  onChange={inputControl}
                />
                <div
                  className={
                    isOpenSelect
                      ? "select-number-code isActiveSelect"
                      : "select-number-code"
                  }
                >
                  <div
                    className="select-code-value"
                    onClick={() => openSelect(!isOpenSelect)}
                  >
                    <i className={numberCodeValue.iconClassName} />
                    <i className="icon icon-arrow" />
                  </div>
                  <ul>
                    {countryMobileCode.map((item, index) => {
                      return (
                        <li
                          key={index}
                          className={
                            item.value === numberCodeValue.value
                              ? "isActiveLi"
                              : ""
                          }
                          onClick={() => {
                            selectControl(item);
                            openSelect(false);
                          }}
                        >
                          <i className={item.iconClassName} />
                          {item.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <button type="button" onClick={pushPhone}>
                {t("btn_add")}
              </button>
            </div>
            <ValueList
              textValue="phone"
              values={phoneList}
              removeItem={removePhone}
            />
          </div>
          <div className="input-custom-group unset-align">
            <div className="input-custom">
              <label htmlFor="code" className={code ? "input-focused" : ""}>
                ID
              </label>
              <input
                type="number"
                className={
                  errorMsgInput.code && !code
                    ? "error-input number-btn-none"
                    : "number-btn-none"
                }
                id="code"
                name="code"
                placeholder={t("product_code")}
                value={code}
                onChange={inputControl}
              />
            </div>
            <div className="input-custom">
              <label
                htmlFor="productName"
                className={product ? "input-focused" : ""}
              >
                {t("preparation")}
              </label>
              <div className="inputs-wrapper">
                <div className="select-custom">
                  <Select
                    value={product}
                    onChange={selectControl}
                    styles={{
                      ...selectCustumStyles,
                      ...selectCustumStylesProduct,
                    }}
                    options={productOptions}
                  />
                </div>
                <input
                  type="number"
                  className="number-btn-none"
                  name="productCount"
                  placeholder={t("quantity")}
                  value={productCount}
                  onChange={inputControl}
                />
              </div>
              <button type="button" onClick={pushProduct}>
                {t("btn_add")}
              </button>
            </div>
            <ValueList
              textValue="product"
              values={productListItems}
              removeItem={removeProduct}
            />
          </div>
          <div className="input-custom-group">
            <div className="input-custom">
              <label
                htmlFor="categorySource"
                className={categorySource ? "input-focused" : ""}
              >
                Манбани тури
              </label>
              <div className="select-custom">
                <Select
                  value={categorySource}
                  onChange={selectControl}
                  styles={selectCustumStyles}
                  options={sCategoryOptions}
                />
              </div>
              <span className="error-msg">
                {!source ? errorMsgInput.source : null}
              </span>
            </div>
            <div className="input-custom">
              <label
                htmlFor="district"
                className={source ? "input-focused" : ""}
              >
                Манбалар
              </label>
              <div className="select-custom">
                <Select
                  value={source}
                  onChange={selectControl}
                  styles={{
                    ...selectCustumStyles,
                    ...selectCustumStylesDistrict,
                  }}
                  options={sourceOptions}
                  isDisabled={categorySource === null}
                />
              </div>
              <span className="error-msg">
                {!district ? errorMsgInput.district : null}
              </span>
            </div>
          </div>
          <div className="radio-custom-group">
            <div className="radio-custom">
              <label
                htmlFor="spot"
                className={spotChecked ? "input-focused" : ""}
              >
                {t("cash")}
              </label>
              <input
                type="radio"
                id="spot"
                name="payment"
                value="spot"
                checked={spotChecked}
                onChange={inputControl}
              />
              <div
                className={
                  spotChecked ? "icon-wrapper checked-payment" : "icon-wrapper"
                }
                onClick={radioSpotTrigger}
              >
                <i className="icon icon-cash" />
              </div>
            </div>
            <div className="radio-custom">
              <label
                htmlFor="cash"
                className={cardChecked ? "input-focused" : ""}
              >
                {t("card")}
              </label>
              <input
                type="radio"
                id="card"
                name="payment"
                value="card"
                checked={cardChecked}
                onChange={inputControl}
              />
              <div
                className={
                  cardChecked ? "icon-wrapper checked-payment" : "icon-wrapper"
                }
                onClick={radioCardTrigger}
              >
                <i className="icon icon-card" />
              </div>
            </div>
            <span className="error-msg">
              {!payment ? errorMsgInput.payment : null}
            </span>
          </div>
          <div className="input-custom-group">
            <div className="input-custom">
              <label
                htmlFor="price"
                className={totalPrice ? "input-focused" : ""}
              >
                {t("price")}
              </label>
              <div className="bottom-input-wrapper">
                <NumberFormat
                  thousandSeparator={true}
                  displayType={"text"}
                  value={totalPrice}
                  style={totalPrice ? { color: "#1D1D1D" } : {}}
                  className="total-price"
                />
                <span style={totalPrice ? { color: "#1D1D1D" } : {}}>
                  {t("price_currency")}
                </span>
              </div>
            </div>
          </div>

          <div className="input-custom">
            <label htmlFor="comment" className={comment ? "input-focused" : ""}>
              {t("comment")}
            </label>
            <textarea
              type="text"
              id="comment"
              name="comment"
              placeholder={t("comment")}
              value={comment}
              onChange={inputControl}
            />
          </div>
          <button type="submit" className="btn-handler">
            {textBtn}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClearanceGoods;
