import React from 'react';
import Select from 'react-select';
import NumberFormat from 'react-number-format';
import ErrorIndicator from '../../error-indicator';
import Spinner from '../../spinner';
import UserList from '../../user-list';
import { useTranslation } from 'react-i18next';

import './registration.css';

const Registration = (props) => {
    const { t } = useTranslation();
    const {
        role,
        firstName,
        focused,
        lastName,
        kuryer,
        phone,
        login,
        password,
        passwordFocused,
        confirm,
        confirmFocused,
        isShowPassword,
        inputControl,
        errorMsgInput,
        selectControl,
        selectControl1,
        showPassword,
        roleOptions,
        users,
        userId,
        loading,
        error,
        handlerRegister,
        region,
        regionOptions,
        downloadUrl,
        aTagDownload,
        downloadUserXlsx
    } = props;


    const selectCustumStyles = {
        container: (provided, state) => ({
            ...provided,
            width: 'auto',
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
            height: '46px',
            backgroundColor: '#F6F8FE',
            borderRadius: '.5rem',
            borderColor: errorMsgInput.role && !role ? '#D72525' : 'transparent'
        }),
        valueContainer: (provided, state) => ({
            ...provided,
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem'
        }),
        menu: (provided, state) => ({
            position: 'absolute',
            right: '0',
            margin: '.5rem 0',
            zIndex: '99999'
        }),
        menuList: (provided, state) => ({
            ...provided,
            backgroundColor: '#F6F8FE',
            boxShadow: '2px 4px 16px 0 #d99ee241',
            borderColor: '#F6F8FE',
            borderRadius: '.5rem'
        })
    };

    const handlerBtnText = userId ? t('u_text') : t('c_text');

    const spinner = loading ? <Spinner /> : null;
    const errorContent = error ? <ErrorIndicator /> : null;
    const dataContent = !(loading || error) ? (
        users.map((item, index) => {
            return (
                <UserList 
                key={item._id}
                users={item.users}
                downloadUrl={downloadUrl}
                aTagDownload={aTagDownload}
                downloadUserXlsx={downloadUserXlsx}
                usersListName={item._id}
                isXlsx={index === 0}
                isEdit={true} />
            )
        })
    ) : null;

    return (
        <div className="registration">
            <div className="registration-wrapper">
                <h1>{t('header_text_employee', { cu_text: handlerBtnText })}</h1>
                <div className="form-wrapper">
                    <div className="placing-left">
                        <div className="input-custom w-100">
                            <label
                                htmlFor="role"
                                className={role ? 'input-focused' : ''}>{t('role')}</label>
                            <div className="select-custom">
                                <Select
                                    value={role}
                                    onChange={selectControl}
                                    styles={selectCustumStyles}
                                    options={roleOptions} />
                            </div>
                            <span className="error-msg">{!role ? errorMsgInput.role : null}</span>
                        </div>
                        <div className="input-custom-group">
                            <div className="input-custom">
                                <label
                                    htmlFor="firstName"
                                    className={firstName ? 'input-focused' : ''}>{t('first_name')}</label>
                                <input
                                    type="text"
                                    className={errorMsgInput.firstName && !firstName ? 'error-input' : ''}
                                    id="firstName"
                                    name="firstName"
                                    placeholder={t('first_name')}
                                    value={firstName}
                                    onChange={inputControl} />
                                <span className="error-msg">{!firstName ? errorMsgInput.firstName : null}</span>
                            </div>
                            <div className="input-custom">
                                <label
                                    htmlFor="lastName"
                                    className={lastName ? 'input-focused' : ''}>{t('last_name')}</label>
                                <input
                                    type="text"
                                    className={errorMsgInput.lastName && !lastName ? 'error-input' : ''}
                                    id="lastName"
                                    name="lastName"
                                    placeholder={t('last_name')}
                                    value={lastName}
                                    onChange={inputControl} />
                                <span className="error-msg">{!lastName ? errorMsgInput.lastName : null}</span>
                            </div>
                        </div>
                        {kuryer && <div className="input-custom w-100">
                            <label className={region ? 'input-focused' : ''}>{t('region')}</label>
                            <div className="select-custom">
                                <Select
                                    value={region}
                                    onChange={selectControl1}
                                    styles={selectCustumStyles}
                                    options={regionOptions}
                                />
                            </div>
                            <span className="error-msg">{!region ? errorMsgInput.regionId : null}</span>
                        </div>}
                        <div className="input-custom-group">
                            <div className="input-custom">
                                <label
                                    htmlFor="phone"
                                    className={phone ? 'input-focused' : ''}>{t('phone')}</label>
                                <NumberFormat
                                    format="+998(##)###-##-##"
                                    mask="_"
                                    className={errorMsgInput.phone && !phone ? 'error-input' : ''}
                                    id="phone"
                                    name="phone"
                                    placeholder="+998(__)___-__-__"
                                    displayType={'input'}
                                    value={phone}
                                    onChange={inputControl} />
                                <span className="error-msg">{!phone ? errorMsgInput.phone : null}</span>
                            </div>
                            <div className="input-custom">
                                <label
                                    htmlFor="login"
                                    className={login ? 'input-focused' : ''}>{t('login')}</label>
                                <input
                                    type="text"
                                    className={errorMsgInput.login && !login ? 'error-input' : ''}
                                    id="login"
                                    name="login"
                                    placeholder={t('login')}
                                    autoComplete="new-password"
                                    value={login}
                                    onChange={inputControl} />
                                <span className="error-msg">{!login ? errorMsgInput.login : null}</span>
                            </div>
                        </div>
                        <div className="input-custom-group">
                            <div className="input-custom">
                                <label
                                    htmlFor="password"
                                    className={password ? 'input-focused' : ''}>{t('password')}</label>
                                <div
                                    className="password-wrapper"
                                    style={passwordFocused ? { borderColor: '#6691E0' } : {}}>
                                    <input
                                        type={isShowPassword ? 'text' : 'password'}
                                        className={errorMsgInput.password && !password ? 'error-input' : ''}
                                        id="password"
                                        name="password"
                                        placeholder={t('password')}
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={inputControl}
                                        onFocus={() => focused('passwordFocused', true)}
                                        onBlur={() => focused('passwordFocused', false)} />
                                    <div className="icon-wrapper">
                                        <i
                                            className={isShowPassword ? 'icon icon-invisible' : 'icon icon-view'}
                                            onMouseUp={() => showPassword(false)}
                                            onMouseDown={() => showPassword(true)}
                                            onMouseLeave={() => showPassword(false)} />
                                    </div>
                                </div>
                                <span className="error-msg">{!password ? errorMsgInput.password : null}</span>
                            </div>
                            <div className="input-custom">
                                <label
                                    htmlFor="confirm"
                                    className={confirm ? 'input-focused' : ''}>{t('confirm')}</label>
                                <div
                                    className="password-wrapper"
                                    style={confirmFocused ? { borderColor: '#6691E0' } : {}}>
                                    <input
                                        type={isShowPassword ? 'text' : 'password'}
                                        className={errorMsgInput.confirm && !confirm ? 'error-input' : ''}
                                        id="confirm"
                                        name="confirm"
                                        placeholder={t('confirm')}
                                        autoComplete="new-password"
                                        value={confirm}
                                        onChange={inputControl}
                                        onFocus={() => focused('confirmFocused', true)}
                                        onBlur={() => focused('confirmFocused', false)} />
                                    <div className="icon-wrapper">
                                        <i
                                            className={isShowPassword ? 'icon icon-invisible' : 'icon icon-view'}
                                            onMouseUp={() => showPassword(false)}
                                            onMouseDown={() => showPassword(true)}
                                            onMouseLeave={() => showPassword(false)} />
                                    </div>
                                </div>
                                <span className="error-msg">{!confirm ? errorMsgInput.confirm : null}</span>
                            </div>
                        </div>
                    </div>
                    <div className="placing-right">
                        <button
                            type="button"
                            className="btn-handler"
                            onClick={handlerRegister}>{handlerBtnText}</button>
                    </div>
                </div>
                <div className="user-list-wrapper">
                    {spinner}
                    {errorContent}
                    {dataContent}
                </div>
            </div>
        </div>
    )
}

export default Registration;