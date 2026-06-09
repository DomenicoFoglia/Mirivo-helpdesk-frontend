import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { Mail, MailCheck } from 'lucide-react';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { forgotPasswordApi } from '../../api/auth';
import '../../styles/login.css';

function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);
    try {
      await forgotPasswordApi(email);
      setSubmitted(true);
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 429) {
            const retryAfter = error.response.headers['retry-after'] ?? '60';
            toast.error(`Troppi tentativi. Riprova fra ${retryAfter} secondi.`);
            return;
        }
        
        if (axios.isAxiosError(error) && error.response?.status === 422) {
            const raw: Record<string, string[]> = error.response.data.errors ?? {};
            const formatted = Object.fromEntries(
            Object.entries(raw).map(([key, messages]) => [key, messages[0]])
            );
            setErrors(formatted);
            return;
        }
        
        console.error(error);
        toast.error('Si è verificato un errore. Riprova.');
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

        {submitted ? (
          <>
            <div className="forgot-icon-success">
              <MailCheck size={36} />
            </div>
            <h2>{t('auth.forgot_check_email_title')}</h2>
            <p className="login-subtitle">
              {t('auth.forgot_check_email_desc')}
            </p>
            <footer className="login-footer">
              <Link to="/login">{t('auth.back_to_login')}</Link>
            </footer>
          </>
        ) : (
          <>
            <h2>{t('auth.forgot_title')}</h2>
            <p className="login-subtitle">
              {t('auth.forgot_subtitle')}
            </p>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-input-wrapper">
                <span><Mail size={16} /></span>
                <input
                  type="email"
                  placeholder={t('auth.email_placeholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              {errors.email && <span className="field-error">{errors.email}</span>}
              <button type="submit" disabled={submitting}>
                {submitting ? t('auth.forgot_sending') : t('auth.forgot_btn')}
              </button>
            </form>
            <footer className="login-footer">
              <Link to="/login">{t('auth.back_to_login')}</Link>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;