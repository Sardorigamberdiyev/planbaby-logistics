import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { Row, Col } from 'react-bootstrap'
import Spinner from '../../spinner';
import TastiqlovchiItem from './tastiqlovchi-item';
import FilterModal from '../../filter-modal';
import './tastiqlovchi.css'


const MyOrders = (props) => {
    const { t } = useTranslation();
    const {
        stillBtn, loadingUpdate, role, term,
        name, phone, login, inputControl, handleDate, datachecker, datachecked, 
        checkedNumberStatictik, checkedMonth, checkerNumber, checkedNumber, 
        pushChecked, deleteCheckerId, notCheckedTerm, loadingCheck, loadingVerified } = props;

    const [filter, setFilter] = useState(false)

    const btnStill = !loadingUpdate && checkedNumber !== datachecked.length && !term ? (
        <div className="btn-still-wrapper">
            <button
                type="button"
                onClick={stillBtn}>{t('still')}</button>
        </div>
    ) : null;

    const spinnerIsUpdate = loadingUpdate ? <Spinner /> : null;
    let roleText = t('checker');

    return (
        <div className="my-orders">
            <div className="my-orders-wrapper">
                <div className="user-data">
                    <div className="user-data-wrapper">
                        <div className="user-data-avatar">
                            <div className="user-avatar" />
                            <div className="user-name">{name}</div>
                            <div className="user-role">{roleText}</div>
                        </div>
                        <div className="user-data-profile">
                            <ul>
                                <li>
                                    <span>{t('phone')}</span>
                                    <div>{phone}</div>
                                </li>
                                <li>
                                    <span>{t('login')}</span>
                                    <div>{login}</div>
                                </li>
                                <li>
                                    <span>{t('password')}</span>
                                    <div>******</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='buyurtmalar'>
                        <div className='rbuyurtma'>
                            <h5>{t('verified_not_orders')}</h5>
                            <p>{t('month')}: <span>{checkedMonth}</span></p>
                            <p>{t('quantity')}: <span>{checkerNumber}</span></p>
                        </div>
                        <div className='fbuyurtma'>
                            <h5>{t('verified_orders')}</h5>
                            <p>{t('month')}: <span>{checkedMonth}</span></p>
                            <p>{t('quantity')}: <span>{checkedNumberStatictik}</span></p>
                        </div>
                    </div>
                </div>
                <div className="user-orders-filter">
                    <div className="confirm-filter-header">
                        <div className="orders-quantity-info">
                            <div className="input-text">
                                <span>{t('not_verified')}</span>
                                <span className="failure-orders-quantity">{checkerNumber}</span>
                            </div>
                        </div>
                        <div className="orders-quantity-info">
                            <div className="input-text">
                                <span>{t('verified')}</span>
                                <span className="active-orders-quantity">{checkedNumber}</span>
                            </div>
                        </div>
                    </div>
                    <div className="comfirm-filter-list">
                        <div className='confirm-tekshirilmagan'>
                            <div className='confirm-list-header'>
                                <h4>{t('not_verified')} <span>{checkerNumber}</span></h4>
                            </div>
                            <div className="confirm-list-term-code">
                                <input
                                    type="text"
                                    name="notCheckedTerm"
                                    placeholder={t('search_by_id')}
                                    value={notCheckedTerm}
                                    onChange={inputControl} />
                            </div>
                            <Row className='confirm-list-items'>
                                {loadingCheck ? <Spinner /> : (
                                    datachecker.map(item => <Col xxl={4} xl={6} lg={12} md={12} sm={6} key={item._id}>
                                        <TastiqlovchiItem role={role} data={item} pushChecked={pushChecked} checkStatus={false} deleteCheckerId={deleteCheckerId}
                                        />
                                    </Col>)
                                )}
                            </Row>
                        </div>
                        <div className='confirm-tekshirilgan'>
                            <div className='confirm-list-header'>
                                <h4>{t('verified')} <span>{checkedNumber}</span></h4>
                            </div>
                            {filter && <FilterModal inputControl={inputControl} setShow={setFilter} handleDate={handleDate} />}
                            <div className='kuryer-filter-icons' onClick={() => setFilter(!filter)}>
                                <div><i className='icon icon-filter filter-icons'></i></div>
                            </div>
                            <Row className='confirm-list-items'>
                                {loadingVerified ? <Spinner /> : (
                                    datachecked.map(item => item.orderId && <Col xxl={4} xl={6} lg={12} md={12} sm={6} key={item._id}>
                                        <TastiqlovchiItem data={item.orderId} condition={item.condition} checkStatus={true} />
                                    </Col>)
                                )}
                            </Row>
                        </div>
                    </div>
                    {spinnerIsUpdate}
                    {btnStill}
                </div>
            </div>
        </div>
    )
}

export default MyOrders;
