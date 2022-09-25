import React from "react";
import useRoutes from "../../routes";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";

const App = props => {
  const { isAuth, role } = props;
  const routes = useRoutes(isAuth, role);

  return (
    <div className="app">
      <ToastContainer position="bottom-right" />
      {routes}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuth: state.isAuthenticated,
    role: state.role,
  };
};

export default connect(mapStateToProps)(App);
