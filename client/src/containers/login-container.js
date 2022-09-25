import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { Login } from "../components/pages";
import { login } from "../actions";
import axiosInterceptors from "../utils/axiosInterceptors";

class LoginContainer extends Component {
  state = {
    login: "",
    password: "",
  };

  inputControl = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  authHandler = e => {
    e.preventDefault();
    const { login } = this.props;
    const { login: loginText, password } = this.state;
    axiosInterceptors
      .post("/api/auth/login", { login: loginText, password })
      .then(response => {
        const { accessToken, refreshToken, role } = response.data;

        login(accessToken, refreshToken, role);
        toast.success("Вы успешно вошли в систему");
      })
      .catch(err => {
        const { errorMessage } = err.response.data;
        toast.error(errorMessage);
      });
  };

  render() {
    return (
      <Login
        {...this.state}
        inputControl={this.inputControl}
        authHandler={this.authHandler}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    login: (token, rToken, role) => dispatch(login(token, rToken, role)),
  };
};

export default connect(undefined, mapDispatchToProps)(LoginContainer);
