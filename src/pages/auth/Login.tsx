import { useState } from "react"
import { loginApi } from "../../api/auth";
import useAuthStore from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import '../../styles/login.css';
import { Mail, Lock } from 'lucide-react';
import LanguageSwitcher from '../../components/LanguageSwitcher';

function Login() {
    const { t } = useTranslation();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        try {
            const response = await loginApi(email, password);
            const { token, user } = response.data;
            login(user, token);
            navigate(`/${user.role}/dashboard`);
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <div className="login-page">
            <LanguageSwitcher />
            <div className="login-blob-1" />
            <div className="login-blob-2" />
            <div className="login-card">
                <div className="login-logo">M</div>
                <h2>{t('auth.login_title')}</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-input-wrapper">
                        <span><Mail size={16} /></span>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            placeholder={t('auth.email_placeholder')}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="login-input-wrapper">
                        <span><Lock size={16} /></span>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder={t('auth.password_placeholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">{t('auth.login_btn')}</button>
                    <a href="#" className="login-forgot">{t('auth.forgot_password')}</a>
                </form>
                <footer className="login-footer">
                    {t('auth.no_account')} <Link to="/register">{t('auth.sign_up')}</Link>
                </footer>
            </div>
        </div>
    )
}

export default Login