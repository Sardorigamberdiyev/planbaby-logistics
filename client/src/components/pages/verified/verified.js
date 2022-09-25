import React from 'react';
import { Row, Col } from "react-bootstrap"
import { useTranslation } from 'react-i18next';
import VerifiedItem from './verified-item'
import ErrorIndicator from '../../error-indicator';
import Spinner from '../../spinner';
import './verified.css';

const Verified = (props) => {
    const { t } = useTranslation();
    const { loadingCheck, loadingVerifieds, check, verifieds, inputControl, loadingUpdateCheck, loadingUpdateVerifieds,
        checkerTerm, stillBtnCheck, checkedTerm, stillBtnVerified, verifiedsLength, checkLength, errorCheck, errorVerifieds } = props

    const dataCheck = !(errorCheck || loadingCheck) ? (
        check.map(item => (
            <Col xxl={4} xl={6} lg={6} md={6} sm={12} key={item._id}>
                <VerifiedItem data={item} condition={item.condition} checkStatus={false} />
            </Col>)
        )
    ) : null;
    const checkErrorIndicator = errorCheck && !loadingCheck ? <ErrorIndicator /> : null;
    const spinnerCheck = loadingCheck ? <Spinner /> : null;
    const spinnerUpdateCheck = loadingUpdateCheck ? <Spinner /> : null;

    const dataVerifieds = !(errorVerifieds || loadingVerifieds) ? (
        verifieds.map(item => (
            <Col xxl={4} xl={6} lg={6} md={6} sm={12} key={item._id}>
                <VerifiedItem data={item.orderId} condition={item.condition} checkStatus={true} />
            </Col>
        )
        )
    ) : null;
    const verifiedsErrorIndicator = errorVerifieds && !loadingVerifieds ? <ErrorIndicator /> : null;
    const spinnerVerifieds = loadingVerifieds ? <Spinner /> : null;
    const spinnerUpdateVerifieds = loadingUpdateVerifieds ? <Spinner /> : null;


    const btnStillVerified = verifiedsLength !== verifieds.length && !loadingUpdateVerifieds ? (
        <div className="btn-still-wrapper">
            <button
                type="button"
                onClick={stillBtnVerified}>{t('still')}</button>
        </div>
    ) : null;

    const btnStillCheck = checkLength !== check.length && !loadingUpdateCheck ? (
        <div className="btn-still-wrapper">
            <button
                type="button"
                onClick={stillBtnCheck}>{t('still')}</button>
        </div>
    ) : null;

    return (
        <div className="registration">
            <div className="registration-wrapper verified-wrapper">
                <h1>{t('checker_orders')}</h1>
                <div className="user-list-wrapper">
                    <div className='verified-check verified-elements'>
                        <div className='verified-list-header'>
                            <h4>{t('not_verified')} {checkLength}</h4>
                        </div>
                        <div className="verified-list-term-code">
                            <input
                                type="text"
                                name="checkerTerm"
                                placeholder={t('search_by_id')}
                                value={checkerTerm}
                                onChange={inputControl} />
                        </div>
                        <Row className='verified-list-items'>
                            {dataCheck}
                            {spinnerCheck}
                        </Row>
                        {spinnerUpdateCheck}
                        {checkErrorIndicator}
                        {btnStillCheck}
                    </div>
                    <div className='verified-verifieds verified-elements'>
                        <div className='verified-list-header'>
                            <h4>{t('verified')} {verifiedsLength}</h4>
                        </div>
                        <div className="verified-list-term-code">
                            <input
                                type="text"
                                name="checkedTerm"
                                placeholder={t('search_by_id')}
                                value={checkedTerm}
                                onChange={inputControl} />
                        </div>
                        <Row className='verified-list-items'>
                            {dataVerifieds}
                            {spinnerVerifieds}
                        </Row>
                        {spinnerUpdateVerifieds}
                        {verifiedsErrorIndicator}
                        {btnStillVerified}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Verified;