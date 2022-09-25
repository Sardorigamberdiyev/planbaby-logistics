import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { COURIER } from './../../../constvalue'
import ModalKuryer from '../../modal-data/modal-data'
import ModalTugatish from './../../modal-tugatish'
import ModalRadetish from './../../modal-failure'
import withDate from '../../../utils/withDate'
import './kuryer.css'

export default function KuryerItem(props) {
    const { t } = useTranslation();
    const { data: { orderId: data, date, condition, _id: deliveryId },
        role, onSumbitModalTastrilash,
        inputControl, setTotalPrice, failureHandler,
        debt } = props

    const { firstName: userFirstName, comment, lastName: userLastName, code: productCode, totalPrice: price, _id: orderId } = data
    const radData = { userFirstName, userLastName, productCode, price, orderId }

    const [isModal, setShowModal] = useState(false)
    const [isTugatish, setIsTugatish] = useState(false)
    const [bol, setBol] = useState(false)
    const [isRad, setIsRad] = useState(false)
    const [comments, setComment] = useState(comment)

    const failureBrone = (ordId) => {
        failureHandler(deliveryId, ordId, comments)
        setIsRad(false)
    }

    let mainHeaderText = '';
    if (condition === 'not_delivered') mainHeaderText = t('active_order'); 
    else if (condition === 'delivered') mainHeaderText = t('delivered_order');
    else if (condition === 'failure_delivered') mainHeaderText = t('failure_order');

    return (<>
        {isTugatish && <ModalTugatish {...data}
            setIsTugatish={setIsTugatish}
            setTotalPrice={setTotalPrice}
            onSumbitModalTastrilash={onSumbitModalTastrilash}
            debt={debt}
            deliveryId={deliveryId}
            inputControl={inputControl} />}
        {isModal && <ModalKuryer {...data} setIsShowModal={setShowModal} mainHeaderText={mainHeaderText} />}
        {isRad && <ModalRadetish {...radData} setIsShowModalFailure={setIsRad}
            comment={comments}
            failureBrone={failureBrone} setComment={setComment} />}
        <div className={`operator-list-item ${condition}`}>
            {(condition === 'not_delivered' && role === COURIER) && <div className='modalcheck' onClick={() => setBol(!bol)} />}
            {(bol && condition === 'not_delivered' && role === COURIER) && <div className='confirm-list-modal'>
                <p onClick={() => setIsRad(true)}><span>{t('order_cancel')}</span></p>
                <p onClick={() => setIsTugatish(true)}><span>{t('success')}</span></p>
            </div>}
            <div onClick={() => setShowModal(true)}>
                <h5>{data.firstName + " " + data.lastName} </h5>
                <p>{t('region')}: <span className="uc">{data.regionId.nameUz}</span></p>
                <p>ID: <span>{data.code}</span></p>
                <p>{t('date')}: <span>{withDate(date)}</span></p>
                <p>{t('price')}: <span>{data.totalPrice} {t('price_currency')}</span></p>
            </div>
        </div>
    </>
    )
}
