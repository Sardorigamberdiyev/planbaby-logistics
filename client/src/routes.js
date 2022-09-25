import React from "react";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import {
  ClearanceGoodsContainer,
  OrderContainer,
  OrderFilterContainer,
  LoginContainer,
  NavbarContainer,
  ProductContainer,
  RegistrationContainer,
  DistrictContainer,
  MyOperators,
  MyKuryer,
  MyTastiqlovchi,
  MyOperatorKuryer,
  MyAllKuryer,
  VerifiedContainer,
  CheckersContainer,
  Managers,
  MyManagerContainer,
  DashboardContainer,
  SourcesContainer,
  AllOrdersContainer,
} from "./containers";
import { useTranslation } from "react-i18next";
import {
  ADMIN,
  COURIER,
  SUPERADMIN,
  CHACKER,
  OPERATOR,
  MANAGER,
  MAINMANAGER,
  DIRECTOR,
  LOWADMIN,
} from "./constvalue";
import { useSelector } from "react-redux";
import Menu from "./components/menu";

const useRoutes = (isAuthenticated, authRole) => {
  const { t } = useTranslation();
  const menu = useSelector(state => state.menu);
  const { pathname } = useLocation();
  const isPathDashboard = pathname === "/dashboard";

  const onlyOperatorRole = authRole === OPERATOR;
  // const onlySuperAdmin = authRole === SUPERADMIN;
  const onlyAdminRole = authRole === ADMIN || authRole === SUPERADMIN;
  const aslaRoles =
    authRole === ADMIN || authRole === SUPERADMIN || authRole === LOWADMIN;
  const dsRoles = authRole === DIRECTOR || authRole === SUPERADMIN;
  const caslaRoles =
    authRole === COURIER ||
    authRole === ADMIN ||
    authRole === SUPERADMIN ||
    authRole === LOWADMIN;
  const chasRoles =
    authRole === CHACKER ||
    authRole === ADMIN ||
    authRole === SUPERADMIN ||
    authRole === LOWADMIN;
  const mmasRoles =
    authRole === MAINMANAGER || authRole === ADMIN || authRole === SUPERADMIN;
  const mmmasRoles =
    authRole === MANAGER ||
    authRole === MAINMANAGER ||
    authRole === ADMIN ||
    authRole === SUPERADMIN;
  const ommmaslaRoles =
    authRole === OPERATOR ||
    authRole === MANAGER ||
    authRole === MAINMANAGER ||
    authRole === ADMIN ||
    authRole === SUPERADMIN ||
    authRole === LOWADMIN;
  return isAuthenticated ? (
    <div className="app-wrapper">
      <NavbarContainer />
      <div className="main-container">
        <div
          className={`menu-container ${menu ? "show-menu" : ""} ${
            isPathDashboard ? "not-menu" : ""
          }`}
        >
          <Menu />
        </div>
        <div
          className={`route-container ${menu ? "show-menu" : ""} ${
            isPathDashboard ? "not-menu" : ""
          }`}
        >
          <Switch>
            {mmmasRoles ? (
              <Route path="/manager/:id" component={MyManagerContainer} />
            ) : null}
            {mmasRoles ? (
              <Route path="/managers/" component={Managers} />
            ) : null}
            {aslaRoles ? (
              <Route path="/kuryerlar/" component={MyAllKuryer} />
            ) : null}
            {chasRoles ? (
              <Route path="/checker/:id?" component={MyTastiqlovchi} />
            ) : null}
            {aslaRoles ? (
              <Route path="/verified" component={VerifiedContainer} />
            ) : null}
            {onlyAdminRole ? (
              <Route path="/sources" component={SourcesContainer} />
            ) : null}
            {caslaRoles ? (
              <Route path="/courier/:id" component={MyKuryer} />
            ) : null}
            {aslaRoles ? (
              <Route path="/operatorlar/" component={MyOperators} />
            ) : null}
            {ommmaslaRoles ? (
              <Route path="/operator/:id" component={MyOperatorKuryer} />
            ) : null}
            {onlyOperatorRole ? (
              <Route
                path="/clearance"
                exact
                render={props => {
                  return (
                    <ClearanceGoodsContainer
                      {...props}
                      type="add"
                      method={"post"}
                      urlApi={"/api/order"}
                      textBtn={t("btn_add")}
                    />
                  );
                }}
              />
            ) : null}
            {chasRoles ? (
              <Route
                path="/clearance/:id"
                render={props => {
                  return (
                    <ClearanceGoodsContainer
                      {...props}
                      type="update"
                      method={"put"}
                      urlApi={`/api/order/${props.match.params.id}`}
                      title={t("btn_edit")}
                      textBtn={t("btn_edit")}
                    />
                  );
                }}
              />
            ) : null}
            {aslaRoles ? (
              <Route
                path="/order/filter/:typeOrder"
                component={OrderFilterContainer}
              />
            ) : null}
            {aslaRoles ? (
              <Route path="/orders/" component={AllOrdersContainer} />
            ) : null}
            {aslaRoles ? (
              <Route path="/order/:id?" component={OrderContainer} />
            ) : null}
            {onlyAdminRole ? (
              <Route path="/product/:id?" component={ProductContainer} />
            ) : null}
            {onlyAdminRole ? (
              <Route
                path="/registration/:id?"
                component={RegistrationContainer}
              />
            ) : null}
            {onlyAdminRole ? (
              <Route path="/district/:id?" component={DistrictContainer} />
            ) : null}
            {aslaRoles ? (
              <Route path="/chackers/" component={CheckersContainer} />
            ) : null}
            {dsRoles ? (
              <Route path="/dashboard" component={DashboardContainer} />
            ) : null}
            <Redirect to="/order" />
          </Switch>
        </div>
      </div>
    </div>
  ) : (
    <Switch>
      <Route path="/login" exact component={LoginContainer} />
      <Redirect to="/login" />
    </Switch>
  );
};

export default useRoutes;
