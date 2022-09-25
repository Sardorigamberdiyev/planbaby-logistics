import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { ADMIN, SUPERADMIN, MAINMANAGER } from '../../constvalue/index';
import { useTranslation } from 'react-i18next';
import ModalManager from '../modal-manager';
import './user-list-item.css';

const UserListItemLink = (props) => {
    const { userRole, userId } = props;
    return (
        <Link 
        to={`/${userRole}/${userId}`} 
        className="user-link">
            {props.children}
        </Link>
    )
}

const UserListItemNoLink = (props) => {
    return props.children
}

const UserListItem = (props) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [bol, setBol] = useState(false);
    const { id: userId } = useParams();
    const {
        user: {
            _id,
            firstName,
            lastName, 
            phone, 
            login,
            role
        },
        idx,
        isLink,
        isEdit,
        isManager,
        isMyManager,
        deleteManagerItem,
        authRole
    } = props;

    const isActiveClassName = _id === userId && isEdit ? 'user-list-item active' : 'user-list-item';
    const WrapUserListItem = isLink ? UserListItemLink : UserListItemNoLink;
    return (
        <li className={isActiveClassName} key={_id}>
            <WrapUserListItem userRole={role} userId={_id}>
                <div className='user-index'>{idx + 1}</div>
                <Row className="user-info">
                    <Col className='span' sm={6} md={2}>{firstName}</Col>
                    <Col className='span' sm={6} md={2}>{lastName}</Col>
                    <Col className='span' sm={6} md={2}>{phone}</Col>
                    <Col className='span' sm={6} md={2}>{login}</Col>
                    <Col className='span' sm={6} md={2}>******</Col>
                </Row>
            </WrapUserListItem>
            { isEdit ? (
                <Link to={`${_id}`}>
                    <i className="icon icon-pencil" />
                </Link>
            ) : null }
            { isManager ? (
                <>
                    <span className='manager-show' onClick={() => setBol(!bol)} />
                    <div className='modal-manager-icon'>
                        {showModal && <ModalManager setIsShowModal={setShowModal} idItem={_id} />}
                        {bol && <div className='confirm-list-modal'>
                            <p onClick={() => setShowModal(true)}><i className='icon icon-check'></i><span>{t('operators')}</span></p>
                        </div>}
                    </div>
                </>
            ) : null }
            {(authRole === MAINMANAGER || 
            authRole === SUPERADMIN || 
            authRole === ADMIN) && isMyManager ? <button className='manager-item-delete' onClick={() => deleteManagerItem(_id)} >&#10005;</button> : null}
        </li>
    )
}

export default UserListItem;