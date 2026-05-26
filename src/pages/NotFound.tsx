import { useNavigate } from "react-router-dom"
import useAuthStore from "../store/authStore"
import { ArrowLeft, Home } from "lucide-react"
import "./NotFound.css"

function NotFound() {
    const navigate = useNavigate()
    const { user } = useAuthStore()

    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title">Pagina non trovata</h2>
                <p className="notfound-message">
                    La risorsa che stai cercando non esiste o non hai i permessi per accedervi.
                </p>
                <div className="notfound-actions">
                    <button className="notfound-btn notfound-btn-secondary" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        Torna indietro
                    </button>
                    {user && (
                        <button className="notfound-btn notfound-btn-primary" onClick={() => navigate(`/${user.role}/dashboard`)}>
                            <Home size={18} />
                            Vai alla dashboard
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default NotFound