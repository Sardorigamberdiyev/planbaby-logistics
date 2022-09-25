import React from 'react';
import NumberFormat from 'react-number-format';
import OrderList from '../../order-list';
import Spinner from '../../spinner';
import { useTranslation } from 'react-i18next';


const MyOrders = (props) => {
    const { t } = useTranslation();
    const {
        role,
        inputControl,
        startDate,
        endDate,
        startDateToSend,
        endDateToSend,
        dateInterval,
        getOrderUser,
        stillBtn,
        loading,
        loadingUpdate,
        error,
        orders,
        ordersQuantity,
        name,
        phone,
        login } = props;

    const listStyle = {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    };

    const itemStyle = {
        width: '32%',
        padding: '0',
        marginBottom: '1rem',
    };

    const btnDisabledStyle = orders.length >= ordersQuantity ? 'btn-still-disable' : '';

    const spinnerForBtn = loadingUpdate ? <Spinner /> : null;
    const btnStill = !(loadingUpdate || loading || orders.length === 0) ? (
        <div className="btn-still-wrapper">
            <button
                type="button"
                className={btnDisabledStyle}
                onClick={stillBtn}>{t('still')}</button>
        </div>
    ) : null;

    let roleText = '';
    if (role === 'user') roleText = t('operator');
    if (role === 'admin') roleText = t('admin');
    if (role === 'super-admin') roleText = t('super_admin');

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
                </div>
                <div className="user-orders-filter">
                    <div className="orders-filter-header">
                        <div className="orders-quantity-info">
                            <div className="input-text">
                                <span>{t('active_orders')}</span>
                                <span className="active-orders-quantity">0</span>
                            </div>
                        </div>
                        <div className="orders-quantity-info">
                            <div className="input-text">
                                <span>{t('success_orders')}</span>
                                <span className="success-orders-quantity">{ordersQuantity}</span>
                            </div>
                        </div>
                        <div className="orders-filter-interval">
                            <form>
                                <div className="orders-from-date">
                                    <span>с</span>
                                    <NumberFormat
                                        format="##.##.####"
                                        placeholder="dd.mm.yyyy"
                                        mask={['d', 'd', 'm', 'm', 'y', 'y', 'y', 'y']}
                                        name="startDate"
                                        onChange={inputControl}
                                        value={startDate} />
                                </div>
                                <div className="orders-to-date">
                                    <span>до</span>
                                    <NumberFormat
                                        format="##.##.####"
                                        placeholder="dd.mm.yyyy"
                                        mask={['d', 'd', 'm', 'm', 'y', 'y', 'y', 'y']}
                                        name="endDate"
                                        onChange={inputControl}
                                        value={endDate} />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => getOrderUser(undefined, undefined, true)}>{t('search')}</button>
                            </form>
                        </div>
                    </div>
                    <div className="orders-filter-list">
                        <div className={dateInterval ? 'date-interval show' : 'date-interval'}>{startDateToSend} - {endDateToSend}</div>
                        <OrderList
                            orders={orders}
                            basePath={'/clearance/my-orders'}
                            loading={loading}
                            error={error}
                            optionMenuDisabled={true}
                            listStyle={{ ...listStyle }}
                            itemStyle={{ ...itemStyle }} />
                    </div>
                    {spinnerForBtn}
                    {btnStill}
                </div>
            </div>
        </div>
    )
}

export default MyOrders;