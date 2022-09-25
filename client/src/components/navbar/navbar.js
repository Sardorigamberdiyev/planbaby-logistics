import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ADMIN, SUPERADMIN, MANAGER, LOWADMIN } from "./../../constvalue";
import { useDispatch, useSelector } from "react-redux";
import { menuChecked } from "../../actions";
import logo from "./../../assets/icons/logoyuyuy.png";
import Meregetask from "../modal-mergetask";
import "./navbar.css";
import { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Navbar = props => {
  const { t } = useTranslation();
  const {
    showLangList,
    showUserMenu,
    name,
    changeLangList,
    changeUserMenu,
    logoutSystem,
    authRole,
    menuPageActive,
    currentChangeLanguage,
    currentLang,
  } = props;

  const dispatch = useDispatch();
  const menu = useSelector(state => state.menu);
  const [meregetask, setMeregetask] = useState(false);
  const [hostnames, setHostnames] = useState([]);

  const isShowList = showLangList
    ? "lang-down-list list-active"
    : "lang-down-list";
  const isShowMenu = showUserMenu
    ? "user-down-list menu-active"
    : "user-down-list";

  let currentLengText = currentLang === "uz" ? "Узбекча" : "Русский";

  const isAuthAsRoles = authRole === ADMIN || authRole === SUPERADMIN;
  const isAuthSuperAdmin = authRole === SUPERADMIN;
  const isAuthManager = authRole === MANAGER;

  const hostnameFc = () => {
    let hostnames = [
      { name: "pbaby.uz", host: "" },
      { name: "pertin.pbaby.uz", host: "" },
      { name: "eropen.pbaby.uz", host: "" },
      { name: "vortex.pbaby.uz", host: "" }
    ];
    const hostname =
      window.location.hostname === "localhost"
        ? "pbaby.uz"
        : window.location.hostname;

    const activeIdex = hostnames.find(i => i.name === hostname);
    const data = hostnames.filter(i => i.name !== hostname);
    data.splice(1, 0, activeIdex);
    if(hostname === 'logo.planbaby.kg') return []
    return data.map(item => {
      if (item.name === hostname) return { ...item, host: "active" };
      return item;
    });
  };
  const setting = {
    className: "center",
    infinite: true,
    dots: false,
    slidesToShow: 3,
    speed: 500,
    nextArrow: <SlickArrowLeft />,
    prevArrow: <SlickArrowRight />,
  };
  useEffect(() => {
    setHostnames(hostnameFc());
  }, []);
  return (
    <div className="navbar">
      {meregetask ? <Meregetask setMeregetask={setMeregetask} /> : null}
      <div className="navbar-wrapper">
        <Link to="/" className="navbar-logo">
          <Image src={logo} alt="logo" />
        </Link>
        <div className="navbar-list">
          <div className="search-input">
            {isAuthSuperAdmin ? (
              <Link to="/dashboard">
                <i className="icon icon-dashboard-2" />
                <span>Dashboard</span>
              </Link>
            ) : null}
          </div>
          {authRole === SUPERADMIN ||
          authRole === LOWADMIN ||
          authRole === ADMIN ? (
            <div className={`hostnames ${!menu ? "active_host" : ""}`}>
              <Slider {...setting}>
                {hostnames.map(item => (
                  <div key={item.name} className={`hostname ${item.host}`}>
                    <a href={`http://${item.name}`}>
                      {item.name.split(".")[0]}
                    </a>
                  </div>
                ))}
              </Slider>
            </div>
          ) : null}
          <div className="navbar-wrapper-button">
            <button
              className={menu ? "showed-menu" : ""}
              onClick={() => {
                dispatch(menuChecked(!menu));
              }}
            >
              <div />
              <div />
              <div />
            </button>
          </div>
          <div className="right-content">
            <div className="lang-select">
              <div className="lang-value" onClick={changeLangList}>
                <span>{currentLengText}</span>
                <i className="icon icon-arrow" />
              </div>
              <div className={isShowList}>
                <ul>
                  <li
                    className={currentLang === "uz" ? "active-lang" : ""}
                    onClick={() => currentChangeLanguage("uz")}
                  >
                    Узбекча
                  </li>
                  <li
                    className={currentLang === "ru" ? "active-lang" : ""}
                    onClick={() => currentChangeLanguage("ru")}
                  >
                    Русский
                  </li>
                </ul>
              </div>
            </div>
            <div className="user-menu">
              <div className="user-avatar" onClick={changeUserMenu}>
                <div
                  className={`icon icon-order ${showUserMenu ? "active" : ""}`}
                />
              </div>
              <div className={isShowMenu}>
                <div className="list-header">
                  <div className="user-avatar">
                    <div
                      className={`icon icon-order ${
                        showUserMenu ? "active" : ""
                      }`}
                    />
                  </div>
                  <div className="user-name">{name}</div>
                </div>
                <ul>
                  {isAuthAsRoles ? (
                    <li
                      className={
                        menuPageActive === "product" ? "active-link" : ""
                      }
                    >
                      <Link to="/product/">{t("preparations")}</Link>
                    </li>
                  ) : null}
                  {isAuthAsRoles ? (
                    <li
                      className={
                        menuPageActive === "registration" ? "active-link" : ""
                      }
                    >
                      <Link to="/registration/">{t("employees")}</Link>
                    </li>
                  ) : null}
                  {isAuthAsRoles ? (
                    <li
                      className={
                        menuPageActive === "district" ? "active-link" : ""
                      }
                    >
                      <Link to="/district/">{t("districts")}</Link>
                    </li>
                  ) : null}
                  {isAuthManager ? (
                    <li onClick={() => setMeregetask(true)}>
                      <div>Операторларга вазифа бериш</div>
                    </li>
                  ) : null}
                </ul>
                <div className="list-footer">
                  <button type="button" onClick={logoutSystem}>
                    {t("exit_system")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={
      "slick-prev slick-arrow" + (currentSlide === 0 ? " slick-disabled" : "")
    }
    aria-hidden="true"
    aria-disabled={currentSlide === 0 ? true : false}
    type="button"
  >
    <i className="icon icon-arrow-left" />
  </button>
);
const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <button
    {...props}
    className={
      "slick-next slick-arrow" +
      (currentSlide === slideCount - 1 ? " slick-disabled" : "")
    }
    aria-hidden="true"
    aria-disabled={currentSlide === slideCount - 1 ? true : false}
    type="button"
  >
    <i className="icon icon-arrow-right " />
  </button>
);
export default Navbar;
