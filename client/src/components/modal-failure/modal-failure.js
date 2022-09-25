import React from 'react';
import { useTranslation } from 'react-i18next';
import './modal-failure.css';

const ModalFailure = (props) => {
    const { t } = useTranslation();
    const {
        setIsShowModalFailure,
        setComment,
        failureBrone,
        orderId,
        userFirstName,
        userLastName,
        productCode,
        price,
        comment } = props;

    return (
        <div className="modal-failure">
            <div className="modal-content">
                <div
                    className="close-failure-modal"
                    onClick={() => setIsShowModalFailure(false)}>x</div>
                <h1>{t('order_cancel')}</h1>
                <div className="failure-text-wrapper">
                    <div className="text text-operator">
                        <span>{t('operator')}:</span>
                        <div>{userFirstName} {userLastName}</div>
                    </div>
                    <div className="text text-id">
                        <span>ID</span>
                        <div>{productCode}</div>
                    </div>
                    <div className="text text-price">
                        <span>{t('price')}</span>
                        <div>{price}</div>
                    </div>
                </div>
                <div className="input-costum">
                    <label htmlFor="failureComment">{t('comment')}</label>
                    <textarea
                        type="text"
                        id="failureComment"
                        placeholder={t('comment')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)} />
                </div>
                <button
                    type="button"
                    className="btn-failure"
                    onClick={() => failureBrone(orderId)}>{t('refusal')}</button>
            </div>
        </div>
    )
}

export default ModalFailure;