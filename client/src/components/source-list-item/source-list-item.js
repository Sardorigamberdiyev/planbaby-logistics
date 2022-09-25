import React, { useState } from 'react';
import axiosInterceptors from '../../utils/axiosInterceptors';
import './source-list-item.css';

const SourceListItem = (props) => {
    const [isFocus, setIsFocus] = useState(false);
    const [sourceName, setSourceName] = useState('');
    const { category: { _id, name }, sources, getSourceByCategory } = props;

    const sourceHandler = (e) => {
        e.preventDefault();

        axiosInterceptors.post(`/api/source/${_id}`, {name: sourceName})
            .then((response) => {
                getSourceByCategory();
                setSourceName('');
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err.response.data);
            })
    }

    const sortedSources = sources.find((source) => source._id._id === _id);

    return (
        <div className="source-list-item">
            <div className="item-header">{name}</div>
            <form onSubmit={sourceHandler}>
                <div className="add-input-wrapper">
                    <span className={isFocus ? 'plus-hidden' : ''}>&#10010;</span>
                    <input 
                    type="text"
                    placeholder={isFocus ? '' : 'Манба'}
                    name="sourceName"
                    value={sourceName}
                    onChange={(e) => setSourceName(e.target.value)}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)} />
                </div>
            </form>
            <div className="sub-source-list">
                {
                    sortedSources && sortedSources.sources.map((source, index) => {

                        return (
                            <div
                            key={source._id} 
                            className="sub-source-list-item">
                                <span>{index + 1}</span>
                                <p>{source.name}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SourceListItem;