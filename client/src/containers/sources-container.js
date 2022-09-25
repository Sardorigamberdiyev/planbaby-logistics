import React, { Component } from 'react';
import { Sources } from '../components/pages';
import { connect } from 'react-redux';
import { changeMenuPage } from '../actions';
import axiosInterceptors from '../utils/axiosInterceptors';

class SourcesContainer extends Component {

    state = {
        sources: [],
        categorySources: [],
        categoryName: ''
    }

    componentDidMount() {
        const { changeMenuPage } = this.props;
        changeMenuPage('sources');
        this.getSourceByCategory();
    }

    inputControl = (e) => {
        const { name, value } = e.target;
        this.setState({[name]: value})
    }

    getSourceByCategory = () => {
        axiosInterceptors.get('/api/source/assorted')
            .then((response) => {
                console.log(response.data);
                const { sources, categorySources } = response.data;
                this.setState({ sources, categorySources });
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }
    
    sourceCategoryHandler = () => {
        const { categoryName } = this.state;
        axiosInterceptors.post('/api/source', {name: categoryName})
            .then((response) => {
                console.log(response.data);
                this.setState({categoryName: ''});
                this.getSourceByCategory();
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }

    render() {
        return <Sources 
        {...this.state}
        inputControl={this.inputControl}
        getSourceByCategory={this.getSourceByCategory}
        sourceCategoryHandler={this.sourceCategoryHandler} />
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeMenuPage: (menu) => dispatch(changeMenuPage(menu))
    }
}

export default connect(undefined, mapDispatchToProps)(SourcesContainer);