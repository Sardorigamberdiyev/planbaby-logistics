import React, { Component } from 'react';
import { Product } from '../components/pages';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import { changeMenuPage } from '../actions';
import axiosInterceptors from '../utils/axiosInterceptors';

class ProductContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            nameUz: '',
            price: '',
            products: [],
            errorMsgInput: {},
            loading: true,
            error: null
        }
        this.textRef = React.createRef(true)
        this.textRef = true
    }
    componentWillUnmount() {
        this.textRef = false
    }


    componentDidMount() {
        const { match: { params: { id } }, changeMenuPage } = this.props;

        if (id) this.getOneProduct(id);

        changeMenuPage('product');
        this.getProducts();
    }

    componentDidUpdate(prevProps, prevState) {
        const { match: { params: { id } } } = this.props;
        const { match: { params: { id: prevId } } } = prevProps;

        if (id !== prevId && id) {
            this.getOneProduct(id);
        }
    }

    inputControl = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    changePriorityHandler = (productId, priority) => {
        axiosInterceptors.put(`/api/product/priority/${productId}`, { priority })
            .then((response) => {
                const { successMessage } = response.data;
                toast.success(successMessage);
                this.getProducts();
            })
            .catch((err) => {
                const { errorMessage } = err.response.data;
                toast.error(errorMessage);
            })
    }

    getProducts = () => {
        this.setState({ loading: true, error: null });
        axiosInterceptors.get('/api/product')
            .then((response) => {
                const { products } = response.data;
                if (this.textRef) this.setState({ products, loading: false });
            })
            .catch((err) => {
                this.setState({ loading: false, error: true });
            })
    }

    getOneProduct = (productId) => {
        axiosInterceptors.get(`/api/product/${productId}`)
            .then((response) => {
                const { product } = response.data;
                if (this.textRef) this.setState({
                    nameUz: product.nameUz,
                    price: product.price
                })
            })
            .catch((err) => {
                const { errorMessage } = err.response.data;
                toast.error(errorMessage);
            })
    }

    validatorError = (errors) => {
        if (!errors) return {};

        const errorsMsg = {};
        errors.forEach((item) => {
            errorsMsg[item.param] = item.msg;
        });

        return errorsMsg;
    }

    productHandler = (e) => {
        e.preventDefault();

        const { match: { params }, history } = this.props;

        const newProduct = {
            nameUz: this.state.nameUz,
            price: this.state.price
        }

        const method = params.id ? 'put' : 'post';
        const apiUrl = params.id ? `/api/product/${params.id}` : '/api/product';

        axiosInterceptors[method](apiUrl, newProduct)
            .then((response) => {
                const { successMessage } = response.data;
                history.push('/product/');
                toast.success(successMessage);
                this.setState({ nameUz: '', price: '' });
                this.getProducts();
            })
            .catch((err) => {
                const { errorMessage, errors } = err.response.data;
                const errorMsgInput = this.validatorError(errors);
                toast.error(errorMessage);
                this.setState({ errorMsgInput });
            })
    }

    render() {
        const { match: { params: { id } } } = this.props;
        return <Product
            {...this.state}
            productId={id}
            inputControl={this.inputControl}
            productHandler={this.productHandler}
            changePriorityHandler={this.changePriorityHandler} />
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeMenuPage: (menuPage) => dispatch(changeMenuPage(menuPage))
    }
};

export default withRouter(connect(undefined, mapDispatchToProps)(ProductContainer));