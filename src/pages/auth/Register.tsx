import { useState } from "react"
import { registerApi } from "../../api/register.ts";
import useAuthStore from "../../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import '../../styles/login.css';
import { Mail, Lock, User, LockKeyhole, Building2, ImageIcon } from 'lucide-react';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import toast from "react-hot-toast";
import axios from "axios";
import { handleRateLimit } from "../../utility/handleRateLimit.ts";


function Register() {
    const { t } = useTranslation();
    const [ name, setName] = useState('');
    const [ surname, setSurname] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword] = useState('');
    const [ passwordConfirmation, setPasswordConfirmation] = useState('');
    const [ companyName, setCompanyName] = useState('');
    const [ logo, setLogo] = useState<File | null>(null);
    const { login } = useAuthStore();
    const navigate = useNavigate();
    // Stato per gli errori
    const [ errors, setErrors ] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setErrors({});
        try {
            // if(!logo) return;
            const response = await registerApi(name, surname, email, password, passwordConfirmation, companyName, logo);
            const { user, token } = response.data;
            login(user, token);
            navigate(`/${user.role}/dashboard`);
        } catch(error) {
            if (handleRateLimit(error)) return;
            
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                const raw: Record<string, string[]> = error.response.data.errors;
                const formatted = Object.fromEntries(
                Object.entries(raw).map(([key, messages]) => [key, messages[0]])
                );
                setErrors(formatted);
                return;
            }
            
            toast.error('Registrazione fallita');
        }
    }

    return (
        <div className="login-page">
            <LanguageSwitcher />
            <div className="login-blob-1" />
            <div className="login-blob-2" />
            <div className="login-card register-card">
                <div className="login-logo">M</div>
                <h2>{t('auth.register_title')}</h2>
                <form className="login-form login-form-grid" onSubmit={handleSubmit}>
                    <div>
                        <div className="login-input-wrapper">
                            <span><User size={16} /></span>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder={t('auth.name_placeholder')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        {errors['user.name'] && <span className="field-error">{errors['user.name']}</span>}
                    </div>

                    <div>
                        <div className="login-input-wrapper">
                            <span><User size={16} /></span>
                            <input
                                type="text"
                                id="surname"
                                name="surname"
                                placeholder={t('auth.surname_placeholder')}
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </div>
                        {errors['user.surname'] && <span className="field-error">{errors['user.surname']}</span>}
                    </div>

                    <div>
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
                        {errors['user.email'] && <span className="field-error">{errors['user.email']}</span>}
                    </div>

                    <div>
                        <div className="login-input-wrapper">
                            <span><Building2 size={16} /></span>
                            <input
                                type="text"
                                id="companyName"
                                name="companyName"
                                placeholder={t('auth.company_name_placeholder')}
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>
                        {errors['company.name'] && <span className="field-error">{errors['company.name']}</span>}
                    </div>

                    <div>
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
                        {errors['user.password'] && <span className="field-error">{errors['user.password']}</span>}
                    </div>

                    <div>
                        <div className="login-input-wrapper">
                            <span><LockKeyhole size={16} /></span>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                placeholder={t('auth.confirm_password_placeholder')}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                            />
                        </div>
                        {errors['user.password_confirmation'] && <span className="field-error">{errors['user.password_confirmation']}</span>}
                    </div>

                    <div className="full-width">
                        <label htmlFor="logo" className={`login-file-label ${logo ? 'has-file' : ''}`}>
                            <ImageIcon size={16} />
                            {logo ? logo.name : t('auth.upload_logo')}
                        </label>
                        <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            className="login-file-input"
                            onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
                        />
                        {errors['company.logo'] && <span className="field-error">{errors['company.logo']}</span>}
                    </div>

                    <button type="submit" className="full-width">{t('auth.register_btn')}</button>
                </form>
                <footer className="login-footer">
                    {t('auth.have_account')} <Link to="/login">{t('auth.sign_in')}</Link>
                </footer>
            </div>
        </div>
    )
}

export default Register