import React from 'react';

import './value-list.css';

const ValueList = (props) => {
    const { values, removeItem, textValue } = props;

    return (
        <div className="value-list">
            <ul>
                {
                    values.map((item, index) => {
                        const itemValue = textValue === 'product' ? `${item.name} ${item.count}` : item;
                        return (
                            <li key={index}>
                                <div className="value-wrapper">{itemValue} <span onClick={() => removeItem(index)}>&#10539;</span></div>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default ValueList;