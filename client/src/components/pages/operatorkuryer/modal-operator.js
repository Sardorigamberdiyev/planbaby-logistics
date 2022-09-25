import React from 'react';
import { useTranslation } from 'react-i18next';
import withDate from '../../../utils/withDate';
import totalPriceFormat from '../../../utils/totalPriceFormat';


const ModalActiveOrder = (props) => {
    const { t } = useTranslation();
    const {
        firstName,
        lastName,
        regionId,
        districtId,
        phones,
        products,
        source,
        payment,
        totalPrice,
        code,
        comment,
        date,
        setIsShowModal,
    } = props;

    const handleShow = () => {
        setIsShowModal(false)
    }

    return (
        <div className="modal-active-order">
            <div className="modal-content">
                <div className="modal-content-wrapper">
                    <span
                        className="close-modal"
                        onClick={handleShow}>&#10005;</span>
                    <h2>Фаол буюртма</h2>
                    <div className="order-view">
                        <div className="input-value-group">
                            <div className="input-value-wrapper default">
                                <span>{t('order_form.name')}</span>
                                <div>{firstName}</div>
                            </div>
                            <div className="input-value-wrapper default">
                                <span>{t('order_form.surname')}</span>
                                <div>{lastName}</div>
                            </div>
                        </div>
                        <div className="input-value-group">
                            <div className="input-value-wrapper default">
                                <span>{t('order_form.region')}</span>
                                <div>{regionId.nameUz}</div>
                            </div>
                            <div className="input-value-wrapper default">
                                <span>{t('order_form.district')}</span>
                                <div>{districtId.nameUz}</div>
                            </div>
                        </div>
                        <div className="input-multi-value-wrapper">
                            <span>{t('order_modal.number')}</span>
                            <div className="input-multi-value">
                                <ul>
                                    {
                                        phones.map((item, index) => {
                                            return <li key={index}>{item}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="input-multi-value-wrapper">
                            <span>{t('order_form.product')}</span>
                            <div className="input-multi-value">
                                <ul>
                                    {products.map(item => <li key={item._id}>
                                        {item.productId.nameUz ? (item.productId.nameUz + ' ' + item.count) : null}
                                    </li>)}
                                </ul>
                            </div>
                        </div>
                        <div className="input-value-group">
                            <div className="input-value-wrapper source">
                                <span>{t('order_form.source')}</span>
                                <div>{source}</div>
                            </div>
                            <div className="input-value-wrapper">
                                <span>{payment === 'spot' ? t('order_form.cash') : t('order_form.card')}</span>
                                <div className="payment">
                                    <i className={payment === 'spot' ? 'icon icon-cash' : 'icon icon-card'} />
                                </div>
                            </div>
                            <div className="input-value-wrapper default">
                                <span>{t('order_form.price')}</span>
                                <div>{totalPriceFormat(totalPrice)}</div>
                            </div>
                        </div>
                        <div className="input-value-group unset-jc">
                            <div className="input-value-wrapper">
                                <span>id</span>
                                <div>{code}</div>
                            </div>
                            <div className="input-value-wrapper">
                                <span>{t('order_modal.date')}</span>
                                <div>{withDate(date)} </div>
                            </div>
                        </div>
                        <div className="textarea-value-wrapper">
                            <span>Изох</span>
                            <div>
                                <p>{comment}</p>
                            </div>
                        </div>
                        <div className="input-footer-wrapper">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalActiveOrder;