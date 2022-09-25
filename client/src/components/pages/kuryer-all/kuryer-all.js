import React from 'react'
import ErrorIndicator from '../../error-indicator';
import Spinner from '../../spinner';
import UserList from '../../user-list';
import { useTranslation } from 'react-i18next';

function KuryerAll(props) {
    const { t } = useTranslation();
    const { loading, error, data, downloadUserXlsx } = props
    const dataContent = !(loading || error) ? (
        data.map((regionCouriers, index) => {
            const { _id, couriers, regionId: { nameUz } } = regionCouriers;
            return (
                <UserList 
                key={_id}
                users={couriers} 
                downloadUserXlsx={downloadUserXlsx}
                usersListName={nameUz}
                isXlsx={index === 0}
                isLink={true} />
            )
        })
    ) : null

    const spinner = loading ? <Spinner /> : null;
    const errorContent = error ? <ErrorIndicator /> : null;
    return (
        <div className="registration">
            <div className="registration-wrapper">
                <h1>{t('couriers')}</h1>
                <div className="user-list-wrapper">
                    {spinner}
                    {errorContent}
                    {dataContent}
                </div>
            </div>
        </div>
    )
}

export default KuryerAll
