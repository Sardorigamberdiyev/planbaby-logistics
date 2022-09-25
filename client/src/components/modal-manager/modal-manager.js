import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import axiosInterceptors from './../../utils/axiosInterceptors'
import ManagerModalItem from './modal-manager-item';
import Spinner from './../spinner'
import './modal-manager.css'

const ModalManager = ({ setIsShowModal, idItem, getManagerData, getOpStatistics, isUpdateManagerData }) => {
    const { t } = useTranslation();
    const [operators, setOperators] = useState([])
    const [inputName, setInputName] = useState('')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    const pushOperators = () => {
        setLoading(true)
        console.log(idItem)
        axiosInterceptors.post(`/api/manager/${idItem}`, { operators: data }).then(res => {
            const { successMessage } = res.data
            if (isUpdateManagerData) {
                getManagerData();
                getOpStatistics();
            }
            toast.success(successMessage);
            setData([])
        }).catch(err => {
            setData([])
            toast.error(err.response.data.errorMessage)
        })
    }
    const hadleChange = (e) => {
        setInputName(e.target.value.toLowerCase())
        setLoading(true)
    }
    useEffect(() => {
        axiosInterceptors.get('/api/user/operator/control').then(res => {
            const { operators } = res.data
            const data = operators.filter(item => (
                item.lastName.toLowerCase().includes(inputName) ||
                item.firstName.toLowerCase().includes(inputName)))
            setOperators(data)
            setLoading(false)
        }).catch(err => {
            console.log(err.response)
        })
    }, [inputName, loading])

    return (
        <div className="modal-active-order">
            <div className="modal-content">
                <div className="modal-content-wrapper ">
                    <span
                        className="close-modal"
                        onClick={() => setIsShowModal(false)}>&#10005;</span>
                    <h2>{t('operators')}</h2>
                    <div className="order-view modal-manager-wrapper">
                        <div className='users-list-part'>
                            <div className='manager-modal-search'>
                                <input
                                    type='text'
                                    name='search'
                                    placeholder='Search firstname or lastname'
                                    value={inputName}
                                    onChange={(e) => { hadleChange(e) }} />
                            </div>
                            <ul className='manager-list'>
                                {loading ? <div className='d-flex justify-content-center align-items-center w-100'><Spinner /></div> : operators.map((item, idx) => <ManagerModalItem
                                    key={item._id}
                                    idx={idx} item={item}
                                    setData={setData}
                                    data={data} />)}
                            </ul>
                        </div>
                        <div className="manager-input-footer-wrapper">
                            <button onClick={pushOperators}>{t('btn_add')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ModalManager;