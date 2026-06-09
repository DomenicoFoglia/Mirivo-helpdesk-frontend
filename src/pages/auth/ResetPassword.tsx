import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import { resetPasswordApi } from '../../api/auth';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import toast from 'react-hot-toast';
import axios from 'axios';
import '../../styles/login.css';
import { handleRateLimit } from '../../utility/handleRateLimit';

function ResetPassword() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Leggiamo token ed email dalla URL
    const token = searchParams.get('token') ?? '';
    const email = searchParams.get('email') ?? '';

    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Toggle visibilita' password (uno per ogni campo)
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    // Stato per gli errori inline (stesso pattern di Register)
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Se manca token o email, il link non e' valido
    if (!token || !email) {
        return (
            <div className="login-page">
                <LanguageSwitcher />
                <div className="login-blob-1" />
                <div className="login-blob-2" />
                <div className="login-card">
                    <div className="login-logo">M</div>
                    <h2>{t('auth.reset_link_invalid_title')}</h2>
                    <p style={{ color: 'rgb(255 255 255 / 60%)', fontSize: 14, marginBottom: 24 }}>
                        {t('auth.reset_link_invalid_desc')}
                    </p>
                    <footer className="login-footer">
                        <Link to="/login">{t('auth.back_to_login')}</Link>
                    </footer>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setErrors({});

        // Validazione client: le due password devono coincidere
        if (password !== passwordConfirmation) {
            setErrors({ password_confirmation: t('auth.reset_passwords_not_match') });
            return;
        }

        setSubmitting(true);
        try {
            await resetPasswordApi({
                token,
                email,
                password,
                password_confirmation: passwordConfirmation,
            });
            toast.success(t('auth.reset_success'));
            navigate('/login');
        } catch (error) {
            if (handleRateLimit(error)) return;
            // Stesso pattern di Register: errori di validazione finiscono in `errors`,
            // il resto (token scaduto, errore server) come toast
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                const raw: Record<string, string[]> = error.response.data.errors ?? {};
                const formatted = Object.fromEntries(
                    Object.entries(raw).map(([key, messages]) => [key, messages[0]])
                );
                setErrors(formatted);
            } else {
                toast.error(t('auth.reset_invalid_token'));
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page">
            <LanguageSwitcher />
            <div className="login-blob-1" />
            <div className="login-blob-2" />

            <div className="login-card">
                <div className="login-logo">M</div>
                <h2>{t('auth.reset_title')}</h2>

                <p style={{ color: 'rgb(255 255 255 / 60%)', fontSize: 14, marginBottom: 24 }}>
                    {t('auth.reset_subtitle')}<br />
                    <strong style={{ color: '#f9f9f9' }}>{email}</strong>
                </p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div>
                        <div className="login-input-wrapper">
                            <span><Lock size={16} /></span>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder={t('auth.new_password_placeholder')}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                style={{
                                    position: 'absolute',
                                    right: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgb(255 255 255 / 50%)',
                                    cursor: 'pointer',
                                    height: 'auto',
                                    width: 'auto',
                                    padding: 4,
                                }}
                                aria-label="Mostra password"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <div>
                        <div className="login-input-wrapper">
                            <span><LockKeyhole size={16} /></span>
                            <input
                                type={showPasswordConfirmation ? 'text' : 'password'}
                                placeholder={t('auth.confirm_password_placeholder_short')}
                                value={passwordConfirmation}
                                onChange={e => setPasswordConfirmation(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirmation(prev => !prev)}
                                style={{
                                    position: 'absolute',
                                    right: 14,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgb(255 255 255 / 50%)',
                                    cursor: 'pointer',
                                    height: 'auto',
                                    width: 'auto',
                                    padding: 4,
                                }}
                                aria-label="Mostra password"
                            >
                                {showPasswordConfirmation ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password_confirmation && <span className="field-error">{errors.password_confirmation}</span>}
                    </div>

                    <button type="submit" disabled={submitting}>
                        {submitting ? t('auth.reset_saving') : t('auth.reset_btn')}
                    </button>
                </form>

                <footer className="login-footer">
                    <Link to="/login">{t('auth.back_to_login')}</Link>
                </footer>
            </div>
        </div>
    );
}

export default ResetPassword;