import React from 'react';
import SourceListItem from '../source-list-item';
import './source-list.css';

const SourceList = (props) => {
    const { categorySources, sources, getSourceByCategory } = props;
    return (
        <div className="source-list">
            <ul>
                {
                    categorySources.map((item) => {
                        return <SourceListItem 
                        key={item._id} 
                        category={item}
                        sources={sources}
                        getSourceByCategory={getSourceByCategory} />
                    })
                }
            </ul>
        </div>
    )
}

export default SourceList;