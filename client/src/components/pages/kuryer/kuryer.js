import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'
import { Row, Col } from 'react-bootstrap'
import Spinner from '../../spinner';
import KuryerItem from './kuryer-item'
import FilterModal from './../../filter-modal'
export default function Kuryer(props) {
    const { t } = useTranslation();
    const { user, order, orders, role, deliveryLength,
        stillBtn, loading, loadingUpdate,
        todayMonth, btnLastDisabled, inputControl, failureHandler,
        onSumbitModalTastrilash, debt, setTotalPrice, handleDate,
    } = props

    const [filter, setFilter] = useState(false)

    const btnDisabledStyle = btnLastDisabled ? 'btn-still-disable' : '';
    const spinnerForBtn = (loading) ? <Spinner /> : null;

    const condition = (e) => {
        if (e === "not_delivered") return t('active_orders')
        else if (e === "failure_delivered") return t('failure_orders')
        else return t('delivered_orders')
    }

    const btnStill = loadingUpdate || btnLastDisabled ? (
        <div className="btn-still-wrapper">
            <button
                type="button"
                className={btnDisabledStyle}
                onClick={stillBtn}>{t('still')}</button>
        </div>
    ) : null;


    return (
        <div className="my-orders">
            <div className="my-orders-wrapper">
                <div className="user-data">
                    <div className="user-data-wrapper">
                        <div className="user-data-avatar">
                            <div className="user-avatar" />
                            <div className="user-name">{user.firstName} {user.lastName}</div>
                            <div className="user-role">{user.role}</div>
                        </div>
                        <div className="user-data-profile">
                            <ul>
                                <li>
                                    <span>{t('phone')}</span>
                                    <div>{user.phone}</div>
                                </li>
                                <li>
                                    <span>{t('login')}</span>
                                    <div>{user.login}</div>
                                </li>
                                <li>
                                    <span>{t('password')}</span>
                                    <div>******</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className='buyurtmalar'>
                        {order.map(item => {
                            return <div className={item._id} key={item._id}>
                                <h5>{condition(item._id)}</h5>
                                <p>{t('month')}: <span>{todayMonth}</span></p>
                                <p>{t('quantity')}: <span>{item.count}</span></p>
                            </div>

                        })}
                    </div>
                </div>
                <div className="user-orders-filter">
                    <div className="confirm-filter-header">
                        {order.map(item => {
                            return <div className="orders-quantity-info" key={item._id}>
                                <div className="input-text">
                                    <div>{condition(item._id)}</div>
                                    <span className={`${item._id}-orders-quantity`}>{item.count}</span>
                                </div>
                            </div>

                        })}
                    </div>
                    <div className="kuryer-pul-items">
                        {/* <Link to='/'>
                            <p className='kuryer-nuqt'>Naqt puli</p>
                            <p><span>0</span> sum</p>
                        </Link>
                        <Link to='/'>
                            <p className='kuryer-karta'>Karta puli</p>
                            <p><span>0</span> sum</p>
                        </Link>
                        <Link to='/'>
                            <p className='kuryer-qarz'>Qarz</p>
                            <p><span>0</span> sum</p>
                        </Link> */}

                        {filter && <FilterModal inputControl={inputControl} setShow={setFilter} handleDate={handleDate} />}
                        <div className='kuryer-filter-icons' onClick={() => setFilter(!filter)}>
                            <div><i className='icon icon-filter filter-icons'></i></div>
                        </div>
                    </div>
                    <div className="comfirm-filter-list">
                        <div className='confirm-tekshirilmagan'>
                            <div className='confirm-list-header'>
                                <h4>{t('orders')} {deliveryLength}</h4>
                            </div>
                            <Row className='operator-list-items'>
                                {
                                    orders.map(item => {
                                        return item.orderId !== null ? <Col xxl={4} xl={6} lg={12} md={12} sm={6} key={item._id}>
                                            <KuryerItem data={item} key={item._id}
                                                role={role}
                                                debt={debt}
                                                failureHandler={failureHandler}
                                                setTotalPrice={setTotalPrice}
                                                onSumbitModalTastrilash={onSumbitModalTastrilash}
                                                inputControl={inputControl} />
                                        </Col> : null
                                    })
                                }
                            </Row>
                            {spinnerForBtn}
                        </div>
                    </div>
                    {btnStill}
                </div>
            </div>
        </div>
    );
}
