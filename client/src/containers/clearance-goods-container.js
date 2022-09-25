import React, { Component } from "react";
import { connect } from "react-redux";
import { ClearanceGoods } from "../components/pages";
import { toast } from "react-toastify";
import { changeMenuPage } from "../actions";
import axiosInterceptors from "../utils/axiosInterceptors";
import { OPERATOR } from "../constvalue";

class ClearanceGoodsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      firstName: "",
      lastName: "",
      region: null,
      district: null,
      product: null,
      categorySource: null,
      source: null,
      isOpenSelect: false,
      regionOptions: [],
      districtOptions: [],
      productOptions: [],
      sCategoryOptions: [],
      sourceOptions: [],
      address: "",
      plot: "",
      phone: "",
      code: "",
      productCount: "",
      comment: "",
      payment: "",
      totalPrice: 0,
      numberCodeValue: {
        label: "Узбекистан",
        value: "uzbekistan",
        name: "numberCodeValue",
        iconClassName: "icon icon-uzbakistan",
        format: "+998(##)###-##-##",
        placeholder: "+998(__)___-__-__",
      },
      phoneList: [],
      errorMsgInput: {},
      regionId: null,
      productListItems: [],
    };
    this.textRef = React.createRef(true);
    this.textRef = true;
  }
  componentWillUnmount() {
    this.textRef = false;
  }

  componentDidMount() {
    const { type, changeMenuPage, role } = this.props;

    if (type === "update") this.getOrder();
    changeMenuPage("zakazolish");
    this.getRegions();
    this.getProducts();
    this.getCategorySources();
    if (role === OPERATOR)
      this.getTasks();
  }

  componentDidUpdate(prevProps, prevState) {
    const { region, categorySource } = this.state;
    const { region: prevRegion, categorySource: prevCategorySource } =
      prevState;
    const { type } = this.props;
    const { type: prevType } = prevProps;

    if (region !== prevRegion && region) {
      this.getDistricts(region.value);
    }

    if (categorySource !== prevCategorySource && categorySource) {
      this.getSources(categorySource.value);
    }

    if (type !== prevType && type === "add") {
      this.setState({
        firstName: "",
        lastName: "",
        region: null,
        district: null,
        product: null,
        address: "",
        plot: "",
        phone: "",
        code: "",
        productCount: "",
        source: "",
        comment: "",
        payment: "",
        totalPrice: 0,
        phoneList: [],
        productList: [],
        errorMsgInput: {},
      });
    }
  }
  getTasks = () => {
    axiosInterceptors.get("/api/task").then(res => {
      this.setState({
        tasks: res.data,
      });
    });
  };
  selectGeniratorOption = (arr, selectName) => {
    const options = [];

    arr.forEach(item => {
      const additionally =
        selectName === "product" ? { price: item.price } : {};
      options.push({
        value: item._id,
        label: item.nameUz,
        name: selectName,
        ...additionally,
      });
    });
    return options;
  };

  getOrder = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;

    axiosInterceptors
      .get(`/api/order/${id}`)
      .then(response => {
        const {
          order: {
            firstName,
            lastName,
            address,
            plot,
            phones,
            code,
            regionId,
            districtId,
            products,
            sourceId,
            comment,
            payment,
            totalPrice,
          },
        } = response.data;

        const sourceLabel = sourceId ? sourceId.name : "";
        const sourceValue = sourceId ? sourceId._id : "";

        if (this.textRef)
          this.setState({
            firstName,
            lastName,
            address,
            plot,
            code,
            comment,
            payment,
            totalPrice,
            phoneList: [...phones],
            region: {
              label: regionId.nameUz,
              value: regionId._id,
              name: "region",
            },
            district: {
              label: districtId.nameUz,
              value: districtId._id,
              name: "district",
            },
            source: { label: sourceLabel, value: sourceValue, name: "source" },
            productListItems: [
              ...products.map(({ count, productId }) => ({
                name: productId.nameUz,
                price: productId.price,
                count,
                productId: productId._id,
              })),
            ],
          });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  getRegions = () => {
    axiosInterceptors
      .get("/api/region")
      .then(response => {
        const { regions } = response.data;
        const regionOptions = this.selectGeniratorOption(regions, "region");
        if (this.textRef) this.setState({ regionOptions });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getDistricts = regionId => {
    axiosInterceptors
      .get(`/api/district/?regionsId=${[regionId]}`)
      .then(response => {
        const { districts } = response.data;
        const districtOptions = this.selectGeniratorOption(
          districts,
          "district",
        );
        if (this.textRef) this.setState({ districtOptions, district: null });
      })
      .catch(err => {
        console.log(err);
      });
  };

  getCategorySources = () => {
    axiosInterceptors
      .get("/api/source/category")
      .then(response => {
        const sCategory = response.data;
        this.setState({
          sCategoryOptions: sCategory.map(item => ({
            label: item.name,
            value: item._id,
            name: "categorySource",
          })),
        });
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  getSources = sourceId => {
    axiosInterceptors
      .get(`/api/source/${sourceId}`)
      .then(response => {
        console.log(response.data);
        const sources = response.data;
        this.setState({
          sourceOptions: sources.map(item => ({
            label: item.name,
            value: item._id,
            name: "source",
          })),
        });
      })
      .catch(err => {
        console.log(err.response.data);
      });
  };

  getProducts = () => {
    axiosInterceptors
      .get("/api/product")
      .then(response => {
        const { products } = response.data;
        const productOptions = this.selectGeniratorOption(products, "product");
        if (this.textRef) this.setState({ productOptions });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  inputControl = e => {
    const { name, value } = e.target;
    this.setState({
      [name]:
        name === "productCount" ? Math.abs(Number(value)).toString() : value,
    });
  };

  selectControl = selectedOption => {
    const { name, value } = selectedOption;
    const regionId = name === "region" ? value : null;
    this.setState({ [name]: selectedOption, regionId: regionId });
  };

  openSelect = isOpen => {
    this.setState({ isOpenSelect: isOpen });
  };

  validatorError = errors => {
    if (!errors) return {};

    const errorsMsg = {};
    errors.forEach(item => {
      errorsMsg[item.param] = item.msg;
    });

    return errorsMsg;
  };

  pushPhone = () => {
    this.setState(state => {
      return {
        phoneList: [...state.phoneList, state.phone],
        phone: "",
      };
    });
  };

  removePhone = idx => {
    this.setState(state => {
      return {
        phoneList: [
          ...state.phoneList.slice(0, idx),
          ...state.phoneList.slice(idx + 1),
        ],
      };
    });
  };

  pushProduct = () => {
    this.setState(state => {
      if (!(state.productCount && state.product) || state.productCount <= 0) {
        return {
          product: null,
          productCount: "",
        };
      }

      const findIndex = state.productListItems.findIndex(
        item => item.productId === state.product.value,
      );
      if (findIndex > -1) {
        return {
          productListItems: [
            ...state.productListItems.slice(0, findIndex),
            {
              ...state.productListItems[findIndex],
              count:
                Number(state.productListItems[findIndex].count) +
                Number(state.productCount),
            },
            ...state.productListItems.slice(findIndex + 1),
          ],
          totalPrice:
            state.totalPrice + state.product.price * state.productCount,
          product: null,
          productCount: "",
        };
      }
      const data = {
        productListItems: [
          ...state.productListItems,
          {
            count: state.productCount,
            name: state.product.label,
            productId: state.product.value,
            price: state.product.price,
          },
        ],
        totalPrice: state.totalPrice + state.product.price * state.productCount,
        product: null,
        productCount: "",
      };
      return data;
    });
  };

  removeProduct = idx => {
    this.setState(state => {
      return {
        productListItems: [
          ...state.productListItems.slice(0, idx),
          ...state.productListItems.slice(idx + 1),
        ],
        totalPrice:
          state.totalPrice -
          state.productListItems[idx].price * state.productListItems[idx].count,
      };
    });
  };

  radioSpotTrigger = () => {
    const spotRadio = document.getElementById("spot");
    spotRadio.click();
  };

  radioCardTrigger = () => {
    const cardRadio = document.getElementById("card");
    cardRadio.click();
  };

  clearanceGoodsHandler = e => {
    e.preventDefault();

    const { method, urlApi, type } = this.props;

    const regionId = this.state.region ? this.state.region.value : "";
    const districtId = this.state.district ? this.state.district.value : "";
    const sourceId = this.state.source ? this.state.source.value : "";

    const newClearance = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      address: this.state.address,
      plot: this.state.plot,
      phones: [...this.state.phoneList],
      products: [...this.state.productListItems],
      code: this.state.code,
      comment: this.state.comment,
      payment: this.state.payment,
      totalPrice: this.state.totalPrice,
      regionId,
      districtId,
      sourceId,
    };
    axiosInterceptors[method](urlApi, newClearance)
      .then(response => {
        const { successMessage } = response.data;

        if (type === "add") {
          this.setState({
            firstName: "",
            lastName: "",
            region: null,
            district: null,
            categorySource: null,
            source: null,
            address: "",
            plot: "",
            phone: "",
            code: "",
            productName: "",
            productCount: "",
            comment: "",
            payment: "",
            price: "",
            totalPrice: 0,
            phoneList: [],
            productListItems: [],
          });
        }

        toast.success(successMessage);
      })
      .catch(err => {
        const { errorMessage, errors } = err.response.data;
        this.setState({ errorMsgInput: { ...this.validatorError(errors) } });
        toast.error(errorMessage);
      });
  };

  render() {
    const { textBtn, title, role } = this.props;
    return (
      <ClearanceGoods
        {...this.state}
        role={role}
        inputControl={this.inputControl}
        selectControl={this.selectControl}
        pushPhone={this.pushPhone}
        pushProduct={this.pushProduct}
        removePhone={this.removePhone}
        removeProduct={this.removeProduct}
        radioSpotTrigger={this.radioSpotTrigger}
        radioCardTrigger={this.radioCardTrigger}
        clearanceGoodsHandler={this.clearanceGoodsHandler}
        openSelect={this.openSelect}
        title={title}
        textBtn={textBtn}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeMenuPage: menuPage => dispatch(changeMenuPage(menuPage)),
  };
};

const mapStateToProps = (state) => {
  return {
    role: state.role
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ClearanceGoodsContainer);
