import { useState, useEffect } from 'react';
import api from '../api/axios';

export function useAttachmentImage(attachmentId: number, mimeType: string) {
    const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        // Solo per immagini
        if (!mimeType.startsWith('image/')) {
            setLoading(false);
            return;
        }

        let objectUrl: string | null = null;
        let cancelled = false;

        const fetchImage = async () => {
            try {
                const response = await api.get(`/attachments/${attachmentId}/preview`, {
                    responseType: 'blob'
                });
                if (cancelled) return;
                objectUrl = URL.createObjectURL(response.data);
                setUrl(objectUrl);
            } catch {
                if (cancelled) return;
                setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchImage();

        // Cleanup: revoca URL e cancella la fetch in corso
        return () => {
            cancelled = true;
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [attachmentId, mimeType]);

    return { url, loading, error };
}