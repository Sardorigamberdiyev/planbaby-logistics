import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import axiosInterceptors from "../../utils/axiosInterceptors";

import "./kuryer.css";

export default function Kuryer(props) {
  const { t } = useTranslation();
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);
  const {
    order: {
      _id: orderId,
      regionId,
      districtId,
      userId,
      address,
      plot,
      totalPrice,
      code,
    },
    setIsKuryer,
    courierHandler,
  } = props;

  const courierOptions = couriers => {
    const optionsValue = [];
    couriers.forEach(item => {
      optionsValue.push({
        value: item._id,
        label: `${item.firstName} ${item.lastName}`,
      });
    });
    return optionsValue;
  };

  useEffect(() => {
    axiosInterceptors
      .get(`/api/user/courier/${regionId._id}`)
      .then(response => {
        const { users } = response.data;
        setOptions(courierOptions(users));
      });
  }, [regionId._id]);

  const selectCustumStyles = {
    container: (provided, state) => ({
      ...provided,
      width: "auto",
      opacity: state.isDisabled ? ".3" : "1",
    }),
    option: (provided, state) => {
      return {
        ...provided,
        color: state.isSelected ? "#6691E0" : "#1D1D1D",
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
      height: "46px",
      backgroundColor: "#F6F8FE",
      borderRadius: ".5rem",
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      paddingLeft: "1.5rem",
      paddingRight: "1.5rem",
    }),
    menu: (provided, state) => ({
      position: "absolute",
      right: "0",
      margin: ".5rem 0",
      zIndex: "99999",
    }),
    menuList: (provided, state) => ({
      ...provided,
      backgroundColor: "#F6F8FE",
      boxShadow: "2px 4px 16px 0 #d99ee241",
      borderColor: "#F6F8FE",
      borderRadius: ".5rem",
    }),
  };

  const selectControl = e => {
    setValue(e);
  };

  const onSubmit = e => {
    e.preventDefault();
    const { value: userId } = value;
    courierHandler(orderId, userId);
    setIsKuryer(false);
  };

  return (
    <div className="modal-active-order">
      <div className="modal-content">
        <div className="modal-content-wrapper">
          <div className="modal-kuryer-header">
            <h4>{t("order")}</h4>
            <span onClick={() => setIsKuryer(false)}>x</span>
          </div>
          <form onSubmit={onSubmit}>
            <Row className="modal-kuryer-row">
              <Col md={12} lg={6}>
                <div className="input-custom w-100">
                  <label htmlFor="role" className={"input-focused"}>
                    {t("courier")}
                  </label>
                  <div className="select-custom">
                    <Select
                      value={value}
                      onChange={selectControl}
                      styles={selectCustumStyles}
                      options={options}
                    />
                  </div>
                </div>
              </Col>
              <Col sm={12} md={6} lg={3}>
                <div className="modalkuryer-item">
                  <p>ID</p>
                  <div>{code}</div>
                </div>
              </Col>
              <Col sm={12} md={6} lg={3}>
                <div className="modalkuryer-item">
                  <p>{t("price")}</p>
                  <div>{totalPrice}</div>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="modalkuryer-item">
                  <p>{t("region")}</p>
                  <div>{regionId.nameUz}</div>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="modalkuryer-item">
                  <p>{t("district")}</p>
                  <div>{districtId.nameUz}</div>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="modalkuryer-item">
                  <p>{t("plot")}</p>
                  <div>{plot}</div>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="modalkuryer-item">
                  <p>{t("address")}</p>
                  <div>{address}</div>
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="modalkuryer-name">
                  <p>{t("operator")}:</p>
                  <h4>
                    {userId.firstName} {userId.lastName}
                  </h4>
                </div>
              </Col>
              <Col md={6} lg={6}>
                <div className="modalkuryer-button">
                  <button type="submit">{t("btn_send")}</button>
                </div>
              </Col>
            </Row>
          </form>
        </div>
      </div>
    </div>
  );
}
