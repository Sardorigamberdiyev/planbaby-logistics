import React from 'react';
import { useTranslation } from 'react-i18next';
import './login.css';

const Login = (props) => {
    const { t } = useTranslation();
    const { login, password, inputControl, authHandler } = props;
    return (
        <div className="login">
            <div className="login-content">
                <h1>Logo system</h1>
                <form onSubmit={authHandler}>
                    <div className="input-custom">
                        <label htmlFor="productCode">{t('login')}</label>
                        <input
                            type="text"
                            name="login"
                            placeholder={t('login')}
                            value={login}
                            onChange={inputControl} />
                    </div>
                    <div className="input-custom">
                        <label htmlFor="productCode">{t('password')}</label>
                        <input
                            type="password"
                            name="password"
                            placeholder={t('password')}
                            value={password}
                            onChange={inputControl} />
                    </div>
                    <button
                        type="submit">{t('enter')}</button>
                </form>
            </div>
        </div>
    )
}

export default Login;