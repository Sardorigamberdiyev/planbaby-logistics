import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Registration } from "../components/pages";
import { toast } from "react-toastify";
import { changeMenuPage } from "../actions";
import axiosInterceptors from "../utils/axiosInterceptors";
import {
  ADMIN,
  CHACKER,
  COURIER,
  MANAGER,
  OPERATOR,
  SUPERADMIN,
  MAINMANAGER,
  DIRECTOR,
  LOWADMIN,
} from "../constvalue";

class RegistrationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kuryer: false,
      firstName: "",
      lastName: "",
      phone: "",
      login: "",
      password: "",
      confirm: "",
      isShowPassword: false,
      passwordFocused: false,
      confirmFocused: false,
      role: null,
      roleOptions: [],
      users: [],
      errorMsgInput: {},
      loading: true,
      error: null,
      region: "",
      regionOptions: [],
      regionId: null,
      districtUz: "",
      districtOz: "",
      districtRu: "",
    };
    this.textRef = React.createRef(true);
    this.textRef = true;
  }
  componentWillUnmount() {
    this.textRef = false;
  }

  componentDidMount() {
    const {
      role,
      match: {
        params: { id },
      },
      changeMenuPage,
    } = this.props;

    if (id) this.getOneUser();

    changeMenuPage("registration");
    this.geniratorRoleOptions(role);
    this.getAssortedUsers();
    this.getRegions();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    const {
      match: {
        params: { id: prevId },
      },
    } = prevProps;

    if (id !== prevId && id) {
      this.getOneUser();
    }
  }
  getRegions = () => {
    axiosInterceptors
      .get("/api/region")
      .then(response => {
        const { regions } = response.data;

        const regionOptions = this.geniratorRegionOptions(regions);
        if (this.textRef) this.setState({ regionOptions });
      })
      .catch(err => {
        toast.error("Вы не получили список регионов, обнавите страницу");
      });
  };
  geniratorRegionOptions = regions => {
    const regionOptions = [];

    regions.forEach(item => {
      regionOptions.push({ label: item.nameUz, value: item._id });
    });

    return regionOptions;
  };
  selectControl1 = value => {
    this.setState({
      region: value,
      regionId: value.value,
    });
  };
  inputControl = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  selectControl = value => {
    this.setState(() => ({
      role: value,
      kuryer: value.value === COURIER ? true : false,
    }));
  };

  showPassword = show => {
    this.setState({ isShowPassword: show });
  };

  focused = (whichFocus, isFocus) => {
    this.setState({ [whichFocus]: isFocus });
  };

  geniratorRoleOptions = authRole => {
    const superAdminRole = authRole === SUPERADMIN;
    const adminRole = authRole === SUPERADMIN || authRole === ADMIN;

    const roleOptions = [{ label: "Оператор", value: OPERATOR }];
    if (adminRole) {
      roleOptions.push({ label: "Курер", value: COURIER });
      roleOptions.push({ label: "Тастикловчи", value: CHACKER });
      roleOptions.push({ label: "Бошкарувчи", value: MANAGER });
      roleOptions.push({ label: "Асосий бошкарувчи", value: MAINMANAGER });
      roleOptions.push({ label: "Кичик админ", value: LOWADMIN });
    }
    if (superAdminRole) {
      roleOptions.push({ label: "Админ", value: ADMIN });
      roleOptions.push({ label: "Супер админ", value: SUPERADMIN });
      roleOptions.push({ label: "Директор", value: DIRECTOR });
    }

    this.setState({ roleOptions: [...roleOptions] });
  };

  getAssortedUsers = () => {
    this.setState({ loading: true, error: null });
    axiosInterceptors
      .get("/api/user/all")
      .then(response => {
        const { users } = response.data;
        if (this.textRef) this.setState({ users, loading: false });
      })
      .catch(err => {
        this.setState({ loading: false, error: true });
      });
  };

  getOneUser = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    axiosInterceptors
      .get(`/api/user/${id}`)
      .then(response => {
        const { firstName, lastName, login, phone, role } = response.data.user;

        if (this.textRef)
          this.setState({
            kuryer: role === COURIER ? true : false,
            firstName,
            lastName,
            login,
            phone,
            role: { label: role === OPERATOR ? "Hodim" : role, value: role },
            password: "",
            confirm: "",
          });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  downloadUserXlsx = () => {
    axiosInterceptors
      .get("/api/xlsx/export/user", {
        responseType: "blob",
      })
      .then(response => {
        const fileName = response.headers["content-disposition"]
          .split(" ")[1]
          .split("=")[1];
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");

        link.href = url;
        link.setAttribute("download", JSON.parse(fileName));
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  validatorError = errors => {
    if (!errors) return {};

    const errorsMsg = {};
    errors.forEach(item => {
      errorsMsg[item.param] = item.msg;
    });

    return errorsMsg;
  };

  handlerRegister = () => {
    const {
      match: {
        params: { id },
      },
      history,
    } = this.props;

    const method = id ? "put" : "post";
    const apiUrl = id ? `/api/user/${id}` : "/api/auth/register";

    let user = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      phone: this.state.phone,
      login: this.state.login,
      password: this.state.password,
      confirm: this.state.confirm,
      role: this.state.role ? this.state.role.value : null,
    };

    if (this.state.kuryer) {
      user = { ...user, regionId: this.state.regionId };
    }

    axiosInterceptors[method](apiUrl, user)
      .then(response => {
        const { successMessage } = response.data;
        history.push("/registration/");
        toast.success(successMessage);
        this.getAssortedUsers();
        this.setState({
          firstName: "",
          lastName: "",
          phone: "",
          login: "",
          password: "",
          confirm: "",
          role: null,
          regionId: null,
          kuryer: false,
        });
      })
      .catch(err => {
        const { errorMessage, errors } = err.response.data;
        const errorMsgInput = this.validatorError(errors);
        this.setState({ errorMsgInput });
        toast.error(errorMessage);
      });
  };

  render() {
    const { role } = this.props;

    return (
      <Registration
        {...this.state}
        roleAuth={role}
        inputControl={this.inputControl}
        selectControl={this.selectControl}
        selectControl1={this.selectControl1}
        showPassword={this.showPassword}
        focused={this.focused}
        downloadUserXlsx={this.downloadUserXlsx}
        handlerRegister={this.handlerRegister}
        userId={this.props.match.params.id}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    role: state.role,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    changeMenuPage: menuPage => dispatch(changeMenuPage(menuPage)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegistrationContainer),
);
