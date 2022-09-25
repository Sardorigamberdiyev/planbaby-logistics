import React from 'react';
import Spinner from '../../spinner';
import ErrorIndicator from '../../error-indicator';
import ProductListItem from '../../product-list-item';
import { useTranslation } from 'react-i18next';

import './product.css';

const Product = (props) => {
    const { t } = useTranslation();
    const {
        nameUz,
        price,
        products,
        loading,
        error,
        productHandler,
        changePriorityHandler,
        errorMsgInput,
        inputControl,
        productId } = props;

    const cu_text = productId ? t('u_text') : t('c_text');
    const handlerBtnText = productId ? t('btn_edit') : t('btn_add');

    const spinner = loading ? <Spinner /> : null;
    const errorContent = error ? <ErrorIndicator /> : null;
    const dataContent = !(loading || error) ? (
        <ul className="product-list">
            {
                products.map((item) => {
                    return (
                        <ProductListItem 
                        key={item._id}
                        productId={productId} 
                        changePriorityHandler={changePriorityHandler}
                        item={item} />
                    )
                })
            }
        </ul>
    ) : null;

    return (
        <div className="product">
            <div className="product-wrapper">
                <h1>{t('header_text_product', { cu_text })}</h1>
                <div className="form-wrapper">
                    <form onSubmit={productHandler}>
                        <div className="input-custom-group">
                            <div className="input-custom">
                                <label
                                    htmlFor="nameUz"
                                    className={nameUz ? 'input-focused' : ''}>{t('preparation_name')}</label>
                                <input
                                    type="text"
                                    className={errorMsgInput.nameUz && !nameUz ? 'error-input' : ''}
                                    id="nameUz"
                                    name="nameUz"
                                    placeholder={t('preparation_name')}
                                    value={nameUz}
                                    onChange={inputControl} />
                                <span className="error-msg">{!nameUz ? errorMsgInput.nameUz : null}</span>
                            </div>
                            <div className="input-custom">
                                <label
                                    htmlFor="price"
                                    className={price ? 'input-focused' : ''}>{t('price')}</label>
                                <input
                                    type="text"
                                    className={errorMsgInput.price && !price ? 'error-input' : ''}
                                    id="price"
                                    name="price"
                                    placeholder={t('price')}
                                    value={price}
                                    onChange={inputControl} />
                                <span className="error-msg">{!price ? errorMsgInput.price : null}</span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn-handler">{handlerBtnText}</button>
                    </form>
                </div>
                <div className="product-list-wrapper">
                    {spinner}
                    {errorContent}
                    {dataContent}
                </div>
            </div>
        </div>
    )
}

export default Product;