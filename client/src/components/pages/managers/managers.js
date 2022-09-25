import React from 'react'
import ErrorIndicator from '../../error-indicator';
import Spinner from '../../spinner';
import UserList from '../../user-list';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SUPERADMIN, ADMIN } from '../../../constvalue';
import './managers.css'


function Managers(props) {
    const { t } = useTranslation();
    const { loading, error, managers, downloadUserXlsx, authRole } = props;
    const isXlsxAS = authRole === SUPERADMIN || authRole === ADMIN;
    const dataContent = !(loading || error) ? (
        <UserList 
        users={managers} 
        downloadUserXlsx={downloadUserXlsx}
        isManager={true}
        isXlsx={isXlsxAS}
        isLink={true}
        usersListName="тошкент" />
    ) : null

    const spinner = loading ? <Spinner /> : null;
    const errorContent = error ? <ErrorIndicator /> : null;
    return (
        <div className="registration">
            <div className="registration-wrapper">
                <h1>{t('managers')}</h1>
                <div className="user-list-wrapper">
                    {spinner}
                    {errorContent}
                    {dataContent}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        authRole: state.role
    }
}

export default connect(mapStateToProps)(Managers);
