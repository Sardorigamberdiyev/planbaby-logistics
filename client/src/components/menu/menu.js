import React, { useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../../actions";
import { useTranslation } from "react-i18next";
import axiosInterceptors from "../../utils/axiosInterceptors";
import {
  SUPERADMIN,
  OPERATOR,
  COURIER,
  ADMIN,
  CHACKER,
  MANAGER,
  MAINMANAGER,
  DIRECTOR,
  LOWADMIN,
} from "./../../constvalue";
import "./menu.css";

const Menu = props => {
  const { t } = useTranslation();
  const { logout, rToken, role, menuPageActive, menu } = props;
  const [adminBlock, setAdminBlock] = useState(true);

  const handleAdminBlock = () => {
    setAdminBlock(!adminBlock);
  };

  const logoutSystem = () => {
    axiosInterceptors
      .delete(`/api/auth/logout?token=${rToken}`)
      .then(response => {
        console.log(response);
        logout();
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  const superAdmin = (role === SUPERADMIN || role === ADMIN) && (
    <div className="menu-super-admin">
      <ul>
        <li
          className={
            adminBlock
              ? "menu-home-style-li-active"
              : "menu-home-style-li-active"
          }
        >
          <div className="menu-home-style" onClick={handleAdminBlock}>
            <div>
              <i className="icon icon-administration" />
              <p>Администратор</p>
            </div>
            <span className="icon icon-arrow-right"></span>
          </div>
          <ul className="menu-home-ul-style">
            <li
              className={menuPageActive === "allzakazlar" ? "active-link" : ""}
            >
              <Link to="/orders/">{t("allorders")}</Link>
            </li>
            <li className={menuPageActive === "zakazlar" ? "active-link" : ""}>
              <Link to="/order/">{t("orders")}</Link>
            </li>
            <li className={menuPageActive === "checker" ? "active-link" : ""}>
              <Link to="/verified">{t("checker_orders")}</Link>
            </li>
            <li className={menuPageActive === "sources" ? "active-link" : ""}>
              <Link to="/sources">Манба</Link>
            </li>
            <li className={menuPageActive === "product" ? "active-link" : ""}>
              <Link to="/product/">{t("preparations")}</Link>
            </li>
            <li
              className={menuPageActive === "registration" ? "active-link" : ""}
            >
              <Link to="/registration/">{t("employees")}</Link>
            </li>
            <li className={menuPageActive === "district" ? "active-link" : ""}>
              <Link to="/district/">{t("districts")}</Link>
            </li>
            <li className={menuPageActive === "operators" ? "active-link" : ""}>
              <Link to="/operatorlar/">{t("operators")}</Link>
            </li>
            <li className={menuPageActive === "kuryer" ? "active-link" : ""}>
              <Link to="/kuryerlar/">{t("couriers")}</Link>
            </li>
            <li className={menuPageActive === "chackers" ? "active-link" : ""}>
              <Link to="/chackers/">{t("checkers")}</Link>
            </li>
            <li className={menuPageActive === "managers" ? "active-link" : ""}>
              <Link to="/managers/">{t("managers")}</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const directorLi = role === DIRECTOR && (
    <li
      className={
        adminBlock ? "menu-home-style-li" : "menu-home-style-li-active"
      }
    >
      <div className="menu-home-style" onClick={handleAdminBlock}>
        <div>
          <i className="icon icon-order" />
          <p>Директор</p>
        </div>
        <span className="icon icon-arrow-right"></span>
      </div>
      <ul className="menu-home-ul-style">
        <li className={menuPageActive === "dashboard" ? "active-link" : ""}>
          <Link to="/dashboard">Дашбоард</Link>
        </li>
      </ul>
    </li>
  );

  const userLi = role === OPERATOR && (
    <li
      className={
        adminBlock ? "menu-home-style-li" : "menu-home-style-li-active"
      }
    >
      <div className="menu-home-style" onClick={handleAdminBlock}>
        <div>
          <i className="icon icon-order" />
          <p>{t("operator")}</p>
        </div>
        <span className="icon icon-arrow-right"></span>
      </div>
      <ul className="menu-home-ul-style">
        <li className={menuPageActive === "zakazolish" ? "active-link" : ""}>
          <Link to="/clearance">{t("accept")}</Link>
        </li>
        <li className={menuPageActive === "operators" ? "active-link" : ""}>
          <Link to="/operator/my-order">{t("my_orders")}</Link>
        </li>
      </ul>
    </li>
  );

  const mainManagerLi = role === MAINMANAGER && (
    <li
      className={
        adminBlock ? "menu-home-style-li" : "menu-home-style-li-active"
      }
    >
      <div className="menu-home-style" onClick={handleAdminBlock}>
        <div>
          <i className="icon icon-order" />
          <p>{t("main_manager")}</p>
        </div>
        <span className="icon icon-arrow-right"></span>
      </div>
      <ul className="menu-home-ul-style">
        <li className={menuPageActive === "managers" ? "active-link" : ""}>
          <Link to="/managers/">{t("home")}</Link>
        </li>
      </ul>
    </li>
  );

  const checkerLi = role === CHACKER && (
    <li
      className={
        adminBlock ? "menu-home-style-li" : "menu-home-style-li-active"
      }
    >
      <div className="menu-home-style" onClick={handleAdminBlock}>
        <div>
          <i className="icon icon-kuryer" />
          <p>{t("checker")}</p>
        </div>
        <span className="icon icon-arrow-right"></span>
      </div>
      <ul className="menu-home-ul-style">
        <li className={menuPageActive === "chackers" ? "active-link" : ""}>
          <Link to="/checker/my-order">{t("home")}</Link>
        </li>
      </ul>
    </li>
  );

  const courierLi = role === COURIER && (
    <li
      className={
        adminBlock ? "menu-home-style-li" : "menu-home-style-li-active"
      }
    >
      <div className="menu-home-style" onClick={handleAdminBlock}>
        <div>
          <i className="icon icon-kuryer" />
          <p>{t("courier")}</p>
        </div>
        <span className="icon icon-arrow-right"></span>
      </div>
      <ul className="menu-home-ul-style">
        <li className={menuPageActive === "courier" ? "active-link" : ""}>
          <Link to="/courier/my-order">{t("home")}</Link>
        </li>
      </ul>
    </li>
  );

  const manager = role === MANAGER && (
    <li
      className={
        adminBlock ? "menu-home-style-li" : "menu-home-style-li-active"
      }
    >
      <div className="menu-home-style" onClick={handleAdminBlock}>
        <div>
          <i className="icon icon-administration" />
          <p>{t("manager")}</p>
        </div>
        <span className="icon icon-arrow-right"></span>
      </div>
      <ul className="menu-home-ul-style">
        <li className={menuPageActive === "manager" ? "active-link" : ""}>
          <Link to="/manager/my-order">{t("home")}</Link>
        </li>
      </ul>
    </li>
  );
  const low_admin = role === LOWADMIN && (
    <div className="menu-super-admin">
      <ul>
        <li
          className={
            adminBlock
              ? "menu-home-style-li-active"
              : "menu-home-style-li-active"
          }
        >
          <div className="menu-home-style" onClick={handleAdminBlock}>
            <div>
              <i className="icon icon-administration" />
              <p>Администратор</p>
            </div>
            <span className="icon icon-arrow-right"></span>
          </div>
          <ul className="menu-home-ul-style">
            <li
              className={menuPageActive === "allzakazlar" ? "active-link" : ""}
            >
              <Link to="/orders/">{t("allorders")}</Link>
            </li>
            <li className={menuPageActive === "zakazlar" ? "active-link" : ""}>
              <Link to="/order/">{t("orders")}</Link>
            </li>
            <li className={menuPageActive === "checker" ? "active-link" : ""}>
              <Link to="/verified">{t("checker_orders")}</Link>
            </li>
            <li className={menuPageActive === "operators" ? "active-link" : ""}>
              <Link to="/operatorlar/">{t("operators")}</Link>
            </li>
            <li className={menuPageActive === "kuryer" ? "active-link" : ""}>
              <Link to="/kuryerlar/">{t("couriers")}</Link>
            </li>
            <li className={menuPageActive === "chackers" ? "active-link" : ""}>
              <Link to="/chackers/">{t("checkers")}</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
  return (
    <div className="menu">
      <div className={menu ? "menu-wrapper menu-show" : "menu-wrapper"}>
        {superAdmin}
        {role !== SUPERADMIN && role !== ADMIN && (
          <div className="menu-super-admin">
            <ul>
              {userLi}
              {courierLi}
              {checkerLi}
              {manager}
              {mainManagerLi}
              {directorLi}
              {low_admin}
            </ul>
          </div>
        )}
        <div className="menu-footer">
          <div className="btn-wrapper">
            <div className="footer-btn">
              <i className="icon icon-setting" />
              <span>{t("setting")}</span>
            </div>
            <div className="footer-btn" onClick={logoutSystem}>
              <i className="icon icon-logout" />
              <span>{t("exit_system")}</span>
            </div>
          </div>
          <div className="support">
            <div className="support-item">
              <div className="support-header">Техническая поддержка</div>
              <div className="support-body">
                <div className="support-body-text-tg">
                  Телеграм:{" "}
                  <a
                    href="https://t.me/logosystem"
                    target="_blank"
                    rel="noreferrer"
                  >
                    @logosystem
                  </a>
                </div>
                <div className="support-body-text-phone">
                  Телефон: <a href="tel:+998950545444">+998 (95) 0545444</a>
                </div>
              </div>
            </div>
            {/* <div className="support-item">
                            <div className="support-header">Отдел продаж</div>
                            <div className="support-body">
                                <div className="support-body-text-tg">
                                    Телеграм: <a href="https://t.me/logosystem" target="_blank" rel="noreferrer">@logosystem</a>
                                </div>
                                <div className="support-body-text-phone">
                                    Телефон: <a href="tel:+998900460831">+998 (90) 0460831</a>
                                </div>
                            </div>
                        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    token: state.token,
    rToken: state.rToken,
    role: state.role,
    menuPageActive: state.menuPageActive,
    menu: state.menu,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
