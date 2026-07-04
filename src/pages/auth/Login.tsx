import { useState } from "react"
import { loginApi } from "../../api/auth";
import useAuthStore from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import '../../styles/login.css';
import { Mail, Lock, Shield, UserCog, Wrench, User } from 'lucide-react';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import toast from "react-hot-toast";
import { handleRateLimit } from "../../utility/handleRateLimit";

const DEMO_ACCOUNTS = [
    { roleKey: 'auth.demo_admin', name: 'Mario Rossi', email: 'mario.rossi@acme.it', icon: Shield },
    { roleKey: 'auth.demo_agent_l2', name: 'Sara Neri', email: 'sara.neri@acme.it', icon: UserCog },
    { roleKey: 'auth.demo_agent_l1', name: 'Giovanni Bianchi', email: 'giovanni.bianchi@acme.it', icon: Wrench },
    { roleKey: 'auth.demo_user', name: 'Luigi Verdi', email: 'luigi.verdi@acme.it', icon: User },
];

const DEMO_PASSWORD = 'Test@1234567';

function Login() {
    const { t } = useTranslation();
    const [ email, setEmail ] = useState('');
    const [ password, setPassword] = useState('');
    const { login } = useAuthStore();
    const navigate = useNavigate();

    const performLogin = async (loginEmail: string, loginPassword: string) => {
        try {
            const response = await loginApi(loginEmail, loginPassword);
            const { user } = response.data;
            login(user);
            navigate(`/${user.role}/dashboard`);
        } catch (error) {
            if (handleRateLimit(error)) return;
            toast.error('Credenziali sbagliate');
        }
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        await performLogin(email, password);
    }

    const handleDemoLogin = async (demoEmail: string) => {
        setEmail(demoEmail);
        setPassword(DEMO_PASSWORD);
        await performLogin(demoEmail, DEMO_PASSWORD);
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
                    <div className="login-forgot">
                        <Link to="/forgot-password">
                            {t('auth.forgot_password')}
                        </Link>
                    </div>
                </form>

                <div className="demo-accounts">
                    <p className="demo-accounts-title">{t('auth.demo_title')}</p>
                    <div className="demo-accounts-grid">
                        {DEMO_ACCOUNTS.map((account) => {
                            const Icon = account.icon;
                            return (
                                <button
                                    key={account.email}
                                    type="button"
                                    className="demo-account-card"
                                    onClick={() => handleDemoLogin(account.email)}
                                >
                                    <Icon size={18} />
                                    <span className="demo-account-role">{t(account.roleKey)}</span>
                                    <span className="demo-account-name">{account.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <footer className="login-footer">
                    {t('auth.no_account')} <Link to="/register">{t('auth.sign_up')}</Link>
                </footer>
            </div>
        </div>
    )
}

export default Login