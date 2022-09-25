import React from 'react';
import UserListItem from '../user-list-item';
import { useTranslation } from 'react-i18next';
import './user-list.css';

const UserList = (props) => {
    const { t } = useTranslation();
    const { downloadUserXlsx, usersListName, users, isEdit, isXlsx, isManager, isLink, isMyManager, deleteManagerItem } = props;
    return (
        <div className="user-list">
            { isXlsx ? (
                <>
                    <button 
                    className="user-xlsx-download"
                    onClick={downloadUserXlsx}>{t('xlsx_download')}</button>
                </>
            ) : null}
            <div className="user-list-header">{usersListName}</div>
            <ul className="user-list">
                { users.map((user, index) => {
                    return (
                        <UserListItem 
                        key={user._id}
                        idx={index}
                        user={user}
                        isEdit={isEdit}
                        isManager={isManager}
                        isLink={isLink}
                        isMyManager={isMyManager}
                        deleteManagerItem={deleteManagerItem} />
                    )
                }) }
            </ul>
        </div>
    )
}

export default UserList;