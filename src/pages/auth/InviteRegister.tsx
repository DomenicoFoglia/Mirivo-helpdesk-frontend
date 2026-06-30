import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation, Trans } from 'react-i18next'
import useAuthStore from '../../store/authStore'
import type { InvitationInfo } from '../../types'
import '../../styles/login.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getInvitationByTokenApi, registerByInviteApi } from '../../api/auth'
import { User, Lock, LockKeyhole } from 'lucide-react'
import { handleRateLimit } from '../../utility/handleRateLimit'

type PageState =
    | { kind: 'loading' }
    | { kind: 'notFound' }
    | { kind: 'ready'; info: InvitationInfo }

function InviteRegister() {
    const { t } = useTranslation()
    const { token } = useParams<{ token: string }>()
    const navigate = useNavigate()
    const { user, logout, login } = useAuthStore()

    const [page, setPage] = useState<PageState>({ kind: 'loading' })
    const [confirmedLogout, setConfirmedLogout] = useState(false)

    // Form state (useremo allo Step D)
    const [name, setName] = useState('')
    const [surname, setSurname] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (!token) {
            setPage({ kind: 'notFound' })
            return
        }
        getInvitationByTokenApi(token)
            .then((info) => setPage({ kind: 'ready', info }))
            .catch(() => setPage({ kind: 'notFound' }))
    }, [token])

    // --- Stato: loading ---
    if (page.kind === 'loading') {
        return (
            <div className="login-page">
                <div className="login-blob-1" />
                <div className="login-blob-2" />
                <div className="login-card">
                    <div className="login-logo">M</div>
                    <p>{t('auth.invite_loading')}</p>
                </div>
            </div>
        )
    }

    // --- Stato: notFound ---
    if (page.kind === 'notFound') {
        return (
            <div className="login-page">
                <div className="login-blob-1" />
                <div className="login-blob-2" />
                <div className="login-card">
                    <div className="login-logo">M</div>
                    <h2>{t('auth.invite_not_found_title')}</h2>
                    <p>{t('auth.invite_not_found_desc')}</p>
                    <Link to="/login" className="invite-back-link">
                        {t('auth.invite_back_to_login')}
                    </Link>
                </div>
            </div>
        )
    }

    // Da qui in poi page.kind === 'ready'
    const { info } = page
    const showWarning = user !== null && !confirmedLogout

    // --- Stato: utente gia' loggato, mostra warning ---
    if (showWarning) {
        return (
            <div className="login-page">
                <div className="login-blob-1" />
                <div className="login-blob-2" />
                <div className="login-card">
                    <div className="login-logo">M</div>
                    <h2>{t('auth.invite_already_logged_title')}</h2>
                    <p>
                        <Trans
                            i18nKey="auth.invite_already_logged_desc"
                            values={{ name: `${user!.name} ${user!.surname}` }}
                        />
                    </p>
                    <div className="invite-warning-actions">
                        <button
                            type="button"
                            className="invite-btn-secondary"
                            onClick={() => navigate(`/${user!.role}/dashboard`)}
                        >
                            {t('auth.invite_cancel_btn')}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                logout()
                                setConfirmedLogout(true)
                            }}
                        >
                            {t('auth.invite_continue_btn')}
                        </button>
                    </div>
                </div>
            </div>
        )
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) return
        setErrors({})
        setIsSubmitting(true)
        try {
            const response = await registerByInviteApi(token, {
                name,
                surname,
                password,
                password_confirmation: passwordConfirmation,
            })
            login(response.user)
            navigate(`/${response.user.role}/dashboard`, { replace: true })
        } catch (error) {
            if (handleRateLimit(error)) return;
            
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                setPage({ kind: 'notFound' });
                return;
            }
            
            if (axios.isAxiosError(error) && error.response?.status === 422) {
                const raw: Record<string, string[]> = error.response.data.errors;
                const formatted = Object.fromEntries(
                Object.entries(raw).map(([key, messages]) => [key, messages[0]])
                );
                setErrors(formatted);
                return;
            }
            
            toast.error('Registrazione fallita');
        } finally {
            setIsSubmitting(false)
        }
    }

    // --- Stato: ready, mostra header + form ---
    return (
        <div className="login-page">
            <div className="login-blob-1" />
            <div className="login-blob-2" />
            <div className="login-card register-card">
                <div className="login-logo">M</div>
                <h2>{t('auth.invite_welcome_title')}</h2>
                <p className="invite-intro">
                    <Trans
                        i18nKey="auth.invite_intro"
                        values={{
                            role: t(`auth.role_${info.role}`),
                            company: info.company.name,
                            email: info.email,
                        }}
                    />
                </p>
                <p className="invite-subtitle">{t('auth.invite_complete_subtitle')}</p>

                {/* TODO Step D: form */}
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
                                required
                            />
                        </div>
                        {errors.name && <span className="field-error">{errors.name}</span>}
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
                                required
                            />
                        </div>
                        {errors.surname && <span className="field-error">{errors.surname}</span>}
                    </div>

                    <div className="full-width">
                        <div className="login-input-wrapper">
                            <span><Lock size={16} /></span>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder={t('auth.password_placeholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    <div className="full-width">
                        <div className="login-input-wrapper">
                            <span><LockKeyhole size={16} /></span>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                placeholder={t('auth.confirm_password_placeholder')}
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                required
                            />
                        </div>
                        {errors.password_confirmation && (
                            <span className="field-error">{errors.password_confirmation}</span>
                        )}
                    </div>

                    <button type="submit" className="full-width" disabled={isSubmitting}>
                        {t('auth.invite_submit_btn')}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default InviteRegister