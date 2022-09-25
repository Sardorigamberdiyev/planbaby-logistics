import React from 'react';
import SourceList from '../../source-list';
import './sources.css';

const Sources = (props) => {
    const { sources, categorySources, getSourceByCategory, sourceCategoryHandler, inputControl, categoryName } = props;
    return (
        <div className="sources">
            <div className="sources-wrapper">
                <h1>Манба кущиш</h1>
                <div className="sources-category-wrapper">
                    <div className="input-wrapper">
                        <label htmlFor="categoryName">Булим</label>
                        <input 
                        type="text"
                        id="categoryName"
                        name="categoryName"
                        placeholder="Булим"
                        value={categoryName}
                        onChange={inputControl} />
                    </div>
                    <button 
                    type="button"
                    onClick={sourceCategoryHandler}>Кущиш</button>
                </div>
                <div className="sources-list-wrapper">
                    <SourceList 
                    sources={sources}
                    categorySources={categorySources}
                    getSourceByCategory={getSourceByCategory} />
                </div>
            </div>
        </div>
    )
}

export default Sources;