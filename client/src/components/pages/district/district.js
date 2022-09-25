import React from 'react';
import Select from 'react-select';
import Spinner from '../../spinner';
import ErrorIndicator from '../../error-indicator';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './district.css';

const District = (props) => {
    const { t } = useTranslation();
    const {
        loading,
        error,
        regionOptions,
        region,
        districtUz,
        inputControl,
        selectControl,
        errorMsgInput,
        handlerDistrict,
        districtId,
        districts } = props;
    const selectCustumStyles = {
        container: (provided, state) => ({
            ...provided,
            width: '350px',
            opacity: state.isDisabled ? '.3' : '1'
        }),
        option: (provided, state) => {
            return {
                ...provided,
                color: state.isSelected ? '#6691E0' : '#1D1D1D',
                backgroundColor: 'transparent',
            }
        },
        placeholder: (provided, state) => ({
            ...provided,
            color: '#9F4FDE',
            fontSize: '14px'
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: '#1D1D1D',
            fontSize: '14px'
        }),
        control: (provided, state) => ({
            ...provided,
            width: '100%',
            height: '58px',
            backgroundColor: '#F6F8FE',
            borderRadius: '.5rem',
            borderColor: errorMsgInput.region && !region ? '#D72525' : 'transparent'
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem'
        }),
        menuList: (provided, state) => ({
            ...provided,
            backgroundColor: '#F6F8FE',
            borderRadius: '.5rem',
            textTransform: 'uppercase'
        }),
        menu: (provided, state) => ({
            marginTop: '4px',
            boxShadow: '2px 4px 16px 0 #d99ee241',
            zIndex: '999999',
            position: 'absolute',
            right: '0'
        })
    };

    const cu_text = districtId ? t('u_text') : t('c_text');
    const handlerBtnText = districtId ? t('btn_edit') : t('btn_add');
    const spinner = loading ? <Spinner /> : null;
    const errorContent = error ? <ErrorIndicator /> : null;
    const dataContent = !(loading || error) ? (
        districts.map((regionItem, index) => {
            const { regionId, districts } = regionItem;

            return (
                <div className="district-list-part" key={index}>
                    <div className='district-list-header'>
                        <h4>{regionId.nameUz}</h4>
                    </div>
                    <ul className="district-list">
                        {
                            districts.map((districtItem) => {
                                const isActiveClassName = districtItem._id === districtId ? 'district-list-item active' : 'district-list-item';
                                return (
                                    <li className={isActiveClassName} key={districtItem._id}>
                                        <span>{districtItem.nameUz}</span>
                                        <Link to={`${districtItem._id}`}>
                                            <i className="icon icon-pencil" />
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            )
        })
    ) : null;
    return (
        <div className="district">
            <div className="district-wrapper">
                <h1>{t('header_text_district', {cu_text})}</h1>
                <div className="form-wrapper">
                    <div className="placing-left">
                        <div className="input-custom input-district">
                            <label className={region ? 'input-focused' : ''}>{t('region')}</label>
                            <div className="select-custom">
                                <Select
                                    value={region}
                                    onChange={selectControl}
                                    styles={selectCustumStyles}
                                    options={regionOptions}
                                    isDisabled={districtId ? true : false}
                                />
                            </div>
                            <span className="error-msg">{!region ? errorMsgInput.regionId : null}</span>
                        </div>
                        <div className="input-groups">
                            <div className="input-custom">
                                <label
                                    htmlFor="districtUz"
                                    className={districtUz ? 'input-focused' : ''}>{t('district')}</label>
                                <input
                                    type="text"
                                    className={errorMsgInput.districtUz && !districtUz ? 'error-input' : ''}
                                    id="districtUz"
                                    name="districtUz"
                                    placeholder={t('district')}
                                    disabled={!region ? true : false}
                                    value={districtUz}
                                    onChange={inputControl} />
                                <span className="error-msg">{!districtUz ? errorMsgInput.districtUz : null}</span>
                            </div>
                        </div>
                    </div>
                    <div className="placing-right">
                        <button
                            type="button"
                            className="btn-handler"
                            onClick={handlerDistrict}>{handlerBtnText}</button>
                    </div>
                </div>
                <div className="district-list-wrapper">
                    {spinner}
                    {errorContent}
                    {dataContent}
                </div>
            </div>
        </div>
    )
}

export default District;