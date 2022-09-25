import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ModalData from './../../modal-data/modal-data'
import withDate from '../../../utils/withDate';
import totalPriceFormat from '../../../utils/totalPriceFormat';
import { LOWADMIN } from '../../../constvalue';
export default function TastiqlovchiItem(props) {
    const { t } = useTranslation();
    const authRole = useSelector((state) => state.role);
    const { data, checkStatus, condition } = props
    const [bol, setBol] = useState(false)
    const [modalData, setModalData] = useState(false)
    const joinProductsToText = (arr) => {
        let text = '';

        arr.forEach((item, index, array) => {
            text += `${item.productId.nameUz} ${item.count}${index !== (array.length - 1) ? ',' : ''} `
        });

        return `${text}`;
    }

    const mainHeaderText = checkStatus ? t('verified_order') : t('verified_not_order');

    let colorItemLine = '';
    if (condition === 'failure') colorItemLine = 'failure';
    if (condition === 'at_courier') colorItemLine = 'at-courier';

    return (
        <div className={`confirm-list-item ${colorItemLine}`}>
            {modalData && <ModalData {...data} setIsShowModal={setModalData} mainHeaderText={mainHeaderText} />}
            {authRole !== LOWADMIN && <span className='icons' onClick={() => setBol(!bol)} />}
            {bol && <div className='confirm-list-modal'>
                <p><Link to={`/clearance/${data._id}`}><i className='icon icon-pencil'></i><span>{t('btn_edit')}</span></Link></p>
            </div>}
            <div onClick={() => setModalData(true)}>
                <h5>{data.firstName + " " + data.lastName} </h5>
                <p>ID: <span>{data.code}</span></p>
                <p>{t('preparations')}: {joinProductsToText(data.products)}</p>
                <p>{t('region')}: <span>{data.regionId && data.regionId.nameUz}</span></p>
                <p>{t('date')}: <span>{withDate(data.date)}</span></p>
                <p>{t('price')}: <span>{totalPriceFormat(data.totalPrice)} {t('price_currency')}</span></p>
                <p>{t('operator')}: <span>{data.userId.firstName} {data.userId.lastName}</span></p>
                <p>{t('operator_phone')}: <span>{data.userId.phone}</span></p>
            </div>
        </div>
    )
}
