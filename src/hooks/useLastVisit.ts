import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';

/**
 * Traccia l'ultima visita dell'utente a una lista, salvando il timestamp
 * in localStorage. Ritorna il timestamp della visita PRECEDENTE, cosi'
 * che i chiamanti possano marcare come "nuovi" gli item creati dopo.
 *
 * Al primo accesso in assoluto ritorna Date.now() (nessun elemento risulta nuovo).
 *
 * Il valore ritornato viene "congelato" al primo render tramite useState
 * initializer: la lettura da localStorage e' single-run e idempotente
 * anche con Strict Mode, mentre la scrittura vive nell'effect.
 */
export function useLastVisit(listKey: string): number | null {
    const user = useAuthStore(state => state.user);

    const [lastVisit] = useState<number | null>(() => {
        if (!user) return null;
        const storageKey = `mirivo:lastVisit:${user.id}:${listKey}`;
        const prev = localStorage.getItem(storageKey);
        return prev ? Number(prev) : Date.now();
    });

    useEffect(() => {
        if (!user) return;
        const storageKey = `mirivo:lastVisit:${user.id}:${listKey}`;
        localStorage.setItem(storageKey, String(Date.now()));
    }, [user, listKey]);

    return lastVisit;
}