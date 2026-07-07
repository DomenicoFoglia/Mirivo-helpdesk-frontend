import './Topbar.css'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'
import {useNavigate} from 'react-router-dom'
// import { useTranslation } from 'react-i18next'
// import LanguageSwitcher from '../LanguageSwitcher'
import { Menu } from 'lucide-react'
import { storageUrl } from '../../utility/storageUrl'


function Topbar({onHamburgerClick}: {onHamburgerClick: () => void}){
    const logout = useAuthStore((state) => state.logout);
    const user = useAuthStore((state) => state.user);
    const navigate = useNavigate();
    // const { t } = useTranslation();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Errore durante il logout dal server", error);
        }finally{
            logout();
            navigate('/');
        }
    };

    return(
        <header className="topbar">
            <button className='hamburger-btn' onClick={onHamburgerClick}><Menu size={22} /></button>
            <span className="wordmark">
                <img src="/LogoArancioneNoBg.png" alt="Mirivo" className="wordmark-logo" />
                <span className="wordmark-text">irivo</span>
            </span>
            <span className="ws-chip">
                {user?.company.logo && (
                    <img 
                        src={storageUrl(user.company.logo) ?? ''} 
                        alt={user.company.name}
                        className="ws-chip-logo"
                    />
                )}
                {user?.company.name}
            </span>
            <div className="topbar-user-section">
                {/* Switcher lingua commentato: le traduzioni non sono complete.
                    Da riattivare quando la i18n sara' estesa a tutte le pagine. */}
                {/* <LanguageSwitcher variant="light" /> */}

                <span
                    className="user-name-full"
                    onClick={() => navigate(`/${user?.role}/profile`)}
                    style={{ cursor: 'pointer' }}
                >
                    {user?.name} {user?.surname}
                </span>

                <span
                    className="user-initials"
                    onClick={() => navigate(`/${user?.role}/profile`)}
                    title={`${user?.name} ${user?.surname}`}
                >
                    {user?.name?.[0]}{user?.surname?.[0]}
                </span>

                <button type="button" onClick={handleLogout} className="logout-link">
                    Logout
                </button>
            </div>
            
        </header>
    );
}

export default Topbar;