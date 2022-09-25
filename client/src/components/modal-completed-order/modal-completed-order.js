import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import withDate from '../../utils/withDate';
import totalPriceFormat from '../../utils/totalPriceFormat';
import './modal-completed-order.css';

const ModalCompletedOrder = (props) => {
    const [isShowOrderView, setIsShowOrderView] = useState(false);
    const { t } = useTranslation();
    const {
        userId: { firstName: courierFirstName, lastName: courierLastName },
        orderId: { 
            userId: { firstName: operatorFirstName, lastName: operatorLastName },
            regionId: { nameUz: rNameUz },
            districtId: { nameUz: dNameUz },
            firstName,
            lastName,
            phones,
            products,
            payment,
            address,
            plot,
            code,
            source,
            sourceId,
            totalPrice,
            comment,
            date
        },
        sendDate,
        card,
        debt,
        cash,
        setModalShow,
        mainHeaderText
    } = props;

    // const today = new Date(date);
    // const day = today.getUTCDate().toString().length > 1 ? today.getUTCDate() : `0${today.getUTCDate()}`;
    // const month = (today.getUTCMonth() + 1).toString().length > 1 ? today.getUTCMonth() + 1 : `0${today.getUTCMonth() + 1}`;
    // const year = today.getUTCFullYear();
    // const hours = today.getUTCHours().toString().length > 1 ? today.getUTCHours() : `0${today.getUTCHours()}`;
    // const minutes = today.getUTCMinutes().toString().length > 1 ? today.getUTCMinutes() : `0${today.getUTCMinutes()}`;

    // const operatorFirstName = userId ? userId.firstName : 'null';
    // const operatorLastName = userId ? userId.lastName : 'null';
    
    return (
        <div className="modal-completed-order">
            <div className="modal-content">
                <div 
                className="close-completed-modal"
                onClick={() => setModalShow(false)}>✕</div>
                <h1>{mainHeaderText}</h1>
                <div className="completed-text-wrapper">
                    <div className="input-value-group">
                        <div className="input-value-wrapper default">
                            <span>{t('operator')}</span>
                            <div>{operatorFirstName} {operatorLastName}</div>
                        </div>
                        <div className="input-value-wrapper default">
                            <span>ID</span>
                            <div>{code}</div>
                        </div>
                    </div>
                    <div className="input-value-group">
                        <div className="input-value-wrapper default">
                            <span>{t('price')}</span>
                            <div>{totalPrice}</div>
                        </div>
                        <div className="input-value-wrapper default">
                            <span>Курьер</span>
                            <div>{courierFirstName} {courierLastName}</div>
                        </div>
                    </div>
                    <div className="input-value-group">
                        <div className="input-value-wrapper default">
                            <span>{t('date')}</span>
                            <div>{sendDate}</div>
                        </div>
                        <div className="input-value-wrapper default">
                            <span>{t('cash')}</span>
                            <div>{cash}</div>
                        </div>
                    </div>
                    <div className="input-value-group">
                        <div className="input-value-wrapper default">
                            <span>{t('card')}</span>
                            <div>{card}</div>
                        </div>
                        <div className="input-value-wrapper default">
                            <span>{t('debt')}</span>
                            <div>{debt}</div>
                        </div>
                    </div>
                    <div className="textarea-value-wrapper">
                        <span>{t('comment')}</span>
                        <div>{comment}</div>
                    </div>
                    <div className={isShowOrderView ? 'order-view open-order-view' : 'order-view'}>
                        <div className="input-value-group">
                            <div className="input-value-wrapper default">
                                <span>{t('first_name')}</span>
                                <div>{firstName}</div>
                            </div>
                            <div className="input-value-wrapper default">
                                <span>{t('last_name')}</span>
                                <div>{lastName}</div>
                            </div>
                        </div>
                        <div className="input-value-group">
                            <div className="input-value-wrapper default">
                                <span>{t('region')}</span>
                                <div>{rNameUz}</div>
                            </div>
                            <div className="input-value-wrapper default">
                                <span>{t('district')}</span>
                                <div>{dNameUz}</div>
                            </div>
                        </div>
                        <div className="input-value-group">
                            <div className="input-value-wrapper default">
                                <span>{t('address')}</span>
                                <div>{address}</div>
                            </div>
                            <div className="input-value-wrapper default">
                                <span>{t('plot')}</span>
                                <div>{plot}</div>
                            </div>
                        </div>
                        <div className="input-multi-value-wrapper">
                            <span>{t('phone')}</span>
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
                            <span>{t('products')}</span>
                            <div className="input-multi-value">
                                <ul>
                                    {
                                        products.map((item, index) => {
                                            return <li key={index}>{item.productId ? item.productId.nameUz : null} {item.count}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="input-value-group">
                            <div className="input-value-wrapper source">
                                <span>{t('source')}</span>
                                <div>{sourceId ? sourceId.name : source}</div>
                            </div>
                            <div className="input-value-wrapper">
                                <span>{payment === 'spot' ? t('cash') : t('card')}</span>
                                <div className="payment">
                                    <i className={payment === 'spot' ? 'icon icon-cash' : 'icon icon-card'} />
                                </div>
                            </div>
                            <div className="input-value-wrapper default">
                                <span>{t('price')}</span>
                                <div>{totalPriceFormat(totalPrice)}</div>
                            </div>
                        </div>
                        <div className="input-value-group unset-jc">
                            <div className="input-value-wrapper">
                                <span>ID</span>
                                <div>{code}</div>
                            </div>
                            <div className="input-value-wrapper">
                                <span>{t('date')}</span>
                                <div>{withDate(date)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="btn-wrapper">
                        <button 
                        type="button"
                        onClick={() => setIsShowOrderView(!isShowOrderView)}>
                            {isShowOrderView ? t('close') : t('view_order')}
                            <i className={isShowOrderView ? "icon icon-arrow rotate" : "icon icon-arrow"} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalCompletedOrder;