import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CHACKER } from '../../../constvalue'; 
import { useTranslation } from 'react-i18next';
import ModalData from './../../modal-data/modal-data'
import ModalActiveOrder from '../../modal-active-order';
import withDate from '../../../utils/withDate';
import totalPriceFormat from '../../../utils/totalPriceFormat';

export default function TastiqlovchiItem(props) {
    const { t } = useTranslation();
    const { data, pushChecked, deleteCheckerId, checkStatus, condition, role } = props
    const [bol, setBol] = useState(false)
    const [modalBol, setModalBol] = useState(false)
    const [modalData, setModalData] = useState(false)
    const setIsShowModal = (e) => {
        setModalBol(e)
    }

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
            {modalBol ? <ModalActiveOrder order={data} setIsShowModal={setModalBol} mainHeaderText={mainHeaderText} modalType={'checker'} pushChecked={pushChecked} deleteCheckerId={deleteCheckerId} /> : null}
            {role === CHACKER ? <span className='icons' onClick={() => setBol(!bol)} />: null}
            {bol && <div className='confirm-list-modal'>
                <p onClick={() => setIsShowModal(true)}><i className='icon icon-check'></i><span>{t('make_verified')}</span></p>
                <p><Link to={`/clearance/${data._id}`}><i className='icon icon-pencil'></i><span>{t('btn_edit')}</span></Link></p>
                <p onClick={() => deleteCheckerId(data._id)}><i className='icon icon-delete'></i><span>{t('btn_delete')}</span></p>
            </div>}
            <div onClick={() => setModalData(true)}>
                <h5>{data.firstName + " " + data.lastName} </h5>
                <p>ID: <span>{data.code}</span></p>
                <p>{t('preparations')}: {joinProductsToText(data.products)}</p>
                <p>{t('region')}: <span className="uc">{data.regionId && data.regionId.nameUz}</span></p>
                <p>{t('date')}: <span>{withDate(data.date)}</span></p>
                <p>{t('price')}: <span>{totalPriceFormat(data.totalPrice)} {t('price_currency')}</span></p>
                <p>{t('operator')}: <span>{data.userId.firstName} {data.userId.lastName}</span></p>
                <p>{t('operator_phone')}: <span>{data.userId.phone}</span></p>
            </div>
        </div>
    )
}
