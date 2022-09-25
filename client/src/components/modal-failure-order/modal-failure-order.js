import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import withDate from '../../utils/withDate';
import totalPriceFormat from '../../utils/totalPriceFormat';
import './modal-failure-order.css';
import { LOWADMIN } from '../../constvalue';

const ModalFailureOrder = (props) => {
    const { t } = useTranslation();
    const [isShowOrderView, setIsShowOrderView] = useState(false);
    const {
        _id: failuredId,
        userId: { firstName: retractorFirstName, lastName: retractorLastName, role },
        orderId: {
            userId: { firstName: operatorFirstName, lastName: operatorLastName },
            firstName: clientFirstName,
            lastName: clientLastName,
            districtId,
            regionId,
            totalPrice,
            phones,
            code,
            products,
            payment,
            source,
            sourceId,
            comment,
            date
        },
        setIsShowModal,
        optionMenuDisabled,
        deleteBrone,
        mainHeaderText,
        authRole
    } = props;

    return (
        <div className="modal-failure-order">
            <div className="modal-content">
                <div 
                className="close-failure-modal"
                onClick={() => setIsShowModal(false)}>✕</div>
                <h1>{mainHeaderText}</h1>
                <div className="failure-text-wrapper">
                    <div className="input-value-group">
                        <div className="input-value-wrapper default">
                            <span>{t('operator')}:</span>
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
                            <div>{totalPriceFormat(totalPrice)}</div>
                        </div>
                        <div className="input-value-wrapper default">
                            <span>{role}</span>
                            <div>{retractorFirstName} {retractorLastName}</div>
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
                                <div>{clientFirstName}</div>
                            </div>
                            <div className="input-value-wrapper default">
                                <span>{t('last_name')}</span>
                                <div>{clientLastName}</div>
                            </div>
                        </div>
                        <div className="input-value-group">
                            <div className="input-value-wrapper default">
                                <span>{t('region')}</span>
                                <div>{regionId ? regionId.nameUz : 'Вилоят о\'чирилган!!!'}</div>
                            </div>
                            <div className="input-value-wrapper default">
                                <span>{t('district')}</span>
                                <div>{districtId ? districtId.nameUz : 'Туман о\'чирилган!!!'}</div>
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
                                        products.map((item) => {
                                            return <li key={item._id}>{item.productId.nameUz} {item.count}</li>
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
                        <div className="textarea-value-wrapper">
                            <span>{t('comment')}</span>
                            <div>
                                <p>{comment}</p>
                            </div>
                        </div>
                    </div>
                    <div className="btn-wrapper">
                        <button 
                        type="button"
                        style={{width: authRole === LOWADMIN ? '100%' : '49%'}}
                        onClick={() => setIsShowOrderView(!isShowOrderView)}>
                            {isShowOrderView ? t('close') : t('view_order')}
                            <i className={isShowOrderView ? "icon icon-arrow rotate" : "icon icon-arrow"} />
                        </button>
                        {!optionMenuDisabled && authRole !== LOWADMIN ? (
                            <button 
                            type="button"
                            onClick={() => deleteBrone(failuredId)}>
                                <i className="icon icon-delete" />
                                {t('btn_delete')}
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalFailureOrder;