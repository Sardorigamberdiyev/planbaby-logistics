import React from 'react'
import UserList from '../../user-list';
import ErrorIndicator from '../../error-indicator';
import Spinner from '../../spinner';
import { useTranslation } from 'react-i18next';
import './opetarors.css'

function Operator(props) {
    const { t } = useTranslation();
    const { loading, error, users, downloadUserXlsx } = props
    const dataContent = !(loading || error) ? (
        <UserList 
        users={users} 
        downloadUserXlsx={downloadUserXlsx}
        usersListName="тошкент"
        isXlsx={true}
        isLink={true} />
    ) : null

    const spinner = loading ? <Spinner /> : null;
    const errorContent = error ? <ErrorIndicator /> : null;
    return (
        <div className="registration">
            <div className="registration-wrapper">
                <h1>{t('operators')}</h1>
                <div className="user-list-wrapper">
                    {spinner}
                    {errorContent}
                    {dataContent}
                </div>
            </div>
        </div>
    )
}

export default Operator
