import axios from 'axios'
import toast from "react-hot-toast"
import useAuthStore from '../store/authStore'

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    response => response,
    error => {
        const status = error.response?.status;

        if (!error.response) {
        // nessuna risposta dal server (network down, server spento)
            toast.error('Errore di rete', {id: 'network-error'});
        } else if (status === 401 && useAuthStore.getState().token) {
        // sessione scaduta
            toast.error('Sessione scaduta', {id: 'session-expired'});
            useAuthStore.getState().logout();
        } else if (status === 403) {
        // permessi insufficienti
            toast.error('Non autorizzato', {id: 'unauthorized'});
        } else if (status === 500) {
        // errore server
            toast.error('Errore nel server', {id: 'server-error'});
        }

        return Promise.reject(error)
    }
)

export default api