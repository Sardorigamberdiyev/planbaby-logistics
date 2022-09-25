import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import withDate from '../../utils/withDate';
import './modal-tugatish.css'


const ModalActiveOrder = (props) => {
    const { t } = useTranslation();
    const {
        deliveryId,
        userId,
        totalPrice,
        code,
        date,
        setIsTugatish,
        onSumbitModalTastrilash,
        inputControl,
        debt, setTotalPrice
    } = props;
    const { firstName, lastName, role } = userId;

    useEffect(() => {
        setTotalPrice(totalPrice)
    }, [setTotalPrice, totalPrice])

    return (
        <div className="modal-active-order">
            <div className="modal-content">
                <div className="modal-content-wrapper">
                    <span
                        className="close-modal"
                        onClick={() => setIsTugatish(false)}>&#10005;</span>
                    <h2>{t('order_end')}</h2>
                    <div className="order-view">
                        <div className="input-value-group">
                            <div className="input-value-wrapper default">
                                <span>{role}</span>
                                <div>{firstName} {lastName}</div>
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
                                <span>{t('date')}</span>
                                <div>{withDate(date)} </div>
                            </div>
                        </div>
                        <div className="input-value-group">
                            <div className="input-value-wrapper input-value-item-tugatish">
                                <span>{t('cash')}</span>
                                <input type='number' name="cash" placeholder='10 000 сум'
                                    onChange={(e) => inputControl(e)} />
                            </div>
                            <div className="input-value-wrapper input-value-item-tugatish">
                                <span>{t('card')}</span>
                                <input type='number' name="card" placeholder='10 000 сум'
                                    onChange={(e) => inputControl(e)} />

                            </div>
                        </div>
                        <div className="input-value-group">
                            <div className="input-value-wrapper default">
                                <span>{t('debt')}</span>
                                <div>{debt}</div>
                            </div>
                        </div>
                        <div className="input-value-group input-value-tugatish">
                            <div className="input-value-wrap">
                                <span>{t('comment')}</span>
                                <textarea placeholder={t('comment')} name="comment" onChange={inputControl}>
                                </textarea>
                            </div>
                        </div>
                        <div className="modal-tugatish">
                            <button className='inpout-footer-wraper-button' onClick={() => {
                                onSumbitModalTastrilash(deliveryId, totalPrice)
                                setIsTugatish(false)
                            }}>{t('success')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalActiveOrder;