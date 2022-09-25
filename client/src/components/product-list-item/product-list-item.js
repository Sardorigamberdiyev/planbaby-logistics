import React, { useState } from 'react';
import { priorityOptions } from '../../utils/localStaticData';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './product-list-item.css';

const ProductListItem = ({ productId, item, changePriorityHandler }) => {
    const { t } = useTranslation();
    const [isShow, setIsShow] = useState(false);

    return (
        <li className={`product-list-item${productId === item._id || isShow ? ' active-item-product' : ''}`}>
            <div className="product-info">
                <div className="span-wrapper">
                    {item.priority !== 0 ? <span>{item.priority}</span> : null}
                    <span>{item.nameUz}</span>
                </div>
                <span>{item.price} {t('price_currency')}</span>
            </div>
            <div className="item-actions">
                <Link to={`${item._id}`}>
                    <i className="icon icon-pencil" />
                </Link>
                <div className="item-priority">
                    <i 
                    className="icon icon-arrow"
                    onClick={() => setIsShow(!isShow)} />
                    <div className={`item-priority-list${isShow ? ' show-list' : ''}`}>
                        {
                            priorityOptions.map((option) => {
                                return (
                                    <div 
                                    key={option.value}
                                    className={`priority-list-item${item.priority === option.value ? ' is-show-product-list' : ''}`} 
                                    onClick={() => changePriorityHandler(item._id, option.value)}>{option.label}</div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </li>
    )
}

export default ProductListItem;