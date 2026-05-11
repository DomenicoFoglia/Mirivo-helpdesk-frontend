import './Topbar.css'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'
import {useNavigate} from 'react-router-dom'
// import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../LanguageSwitcher'


function Topbar(){
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

            <span className="wordmark">mir<em>i</em>vo</span>
            <span className="ws-chip">{user?.company.name}</span>
            <div className="topbar-user-section">
                <LanguageSwitcher />
                <span 
                    onClick={() => navigate('/settings')} 
                    style={{ cursor: 'pointer' }}
                >
                    {user?.name} {user?.surname}
                </span>
                <button onClick={handleLogout} className="logout-link">
                    Logout
                </button>
            </div>
            
        </header>
    );
}

export default Topbar;