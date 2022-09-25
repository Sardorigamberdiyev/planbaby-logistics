import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalCompletedOrder from '../../modal-completed-order';
import withDate from '../../../utils/withDate';
import totalPriceFormat from '../../../utils/totalPriceFormat';
import './completed-item.css';

const CompletedItem = (props) => {
    const { t } = useTranslation();
    const [modalShow, setModalShow] = useState(false);
    const { userId, orderId, date, shippingDate, condition } = props;

    const { 
        firstName: courierFirstName,
        lastName: courierLastName
    } = userId;

    const {
        userId: { firstName: operatorFirstName, lastName: operatorLastName },
        code,
        totalPrice
    } = orderId;

    const isNotDelivered = condition === 'not_delivered';
    const conditionStyle = isNotDelivered ? 'completed-item-wrapper not-delivered' : 'completed-item-wrapper delivered';
    const sendFinishDate = isNotDelivered ? date : shippingDate;

    const sendDate = withDate(sendFinishDate);

    const modalCompleted = modalShow ? (
        <ModalCompletedOrder 
        {...props} 
        sendDate={sendDate} 
        setModalShow={setModalShow} />
    ) : null;

    return (
        <li 
        className="completed-item">
            {modalCompleted}
            <div className={conditionStyle}>
                <div 
                className="item-body"
                onClick={() => setModalShow(true)}>
                    <ul>
                        <li>
                            <div className="item-key-text">{t('operator')}:</div>
                            <div className="item-value-text">{operatorFirstName} {operatorLastName}</div>
                        </li>
                        <li>
                            <div className="item-key-text">ID:</div>
                            <div className="item-value-text">{code}</div>
                        </li>
                        <li>
                            <div className="item-key-text">{t('courier')}:</div>
                            <div className="item-value-text">{courierFirstName} {courierLastName}</div>
                        </li>
                        <li>
                            <div className="item-key-text">{t('date')}:</div>
                            <div className="item-value-text">{sendDate}</div>
                        </li>
                        <li>
                            <div className="item-key-text">{t('price')}:</div>
                            <div className="item-value-text">{totalPriceFormat(totalPrice)}</div>
                        </li>
                    </ul>
                </div>
            </div>
        </li>
    )
}

export default CompletedItem;