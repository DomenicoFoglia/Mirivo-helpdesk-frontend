import axios from 'axios';
import toast from 'react-hot-toast';

/**
 * Controlla se l'errore axios e' un 429 Too Many Requests.
 * Se sì, mostra il toast con il countdown dell'header Retry-After e ritorna true.
 * Il chiamante deve fare `if (handleRateLimit(error)) return;` come early return.
 */
export function handleRateLimit(error: unknown): boolean {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] ?? '60';
        toast.error(`Troppi tentativi. Riprova fra ${retryAfter} secondi.`);
        return true;
    }
    return false;
}