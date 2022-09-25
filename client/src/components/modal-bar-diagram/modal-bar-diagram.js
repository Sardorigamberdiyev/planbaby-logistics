import React from 'react';
import totalPriceFormat from '../../utils/totalPriceFormat';
import { useTranslation } from 'react-i18next';
import './modal-bar-diagram.css';

const ModalBarDiagram = ({operators, closeModal}) => {
    const { t } = useTranslation();
    let totalCount = 0;
    operators.forEach((operator) => {
        totalCount += operator.quantityOrder;
    })
    return (
        <div 
        className="modal-bar-diagram"
        onClick={closeModal}>
            <div className="modal-content">
                <div className="modal-content-wrapper">
                    <div className="modal-bar-header">
                        <div className="modal-name">{t('operators')} {operators.length}</div>
                        <div className="quantity">{totalPriceFormat(totalCount)}</div>
                    </div>
                    <div className="modal-body">
                        <ul>
                            {
                                operators.map((operator) => {
                                    return (
                                        <li key={operator._id}>
                                            <p>{operator.firstName} {operator.lastName}</p>
                                            <span>{operator.quantityOrder}</span>
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalBarDiagram;