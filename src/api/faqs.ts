import api from "./axios";
import type { Faq } from "../types";

export interface CreateFaqData {
    question: string;
    answer: string;
    category_id: number;
}

export interface FaqDraftResponse {
    question: string;
    answer: string;
    suggested_category_id: number;
    similar_faq_id: number | null;
    similar_faq_reason: string | null;
    ticket_id: number;
}

export const getFaqsApi = async () => {
    // Ritorna una lista di faq quindi serve un array []
    const res = await api.get<Faq[]>('/faqs');
    return res.data;
}

export const getFaqApi = async (id: number) => {
    const res = await api.get<Faq>(`/faqs/${id}`);
    return res.data;
}

export const createFaqApi = async (data: CreateFaqData) => {
    const res = await api.post<Faq>(`/admin/faqs`, data );
    return res.data;
}

export const updateFaqApi = async (id: number, data: Partial<Faq>) => {
    const res = await api.put<Faq>(`/admin/faqs/${id}`, data);
    return res.data;
}

export const deleteFaqApi = async (id: number) => {
    await api.delete(`/admin/faqs/${id}`);
}

/**
 * Chiama il backend per generare una bozza di FAQ da un ticket chiuso.
 * Il backend usa Gemini. Puo' fallire con 503 se il servizio AI e' giu'.
 * L'admin_summary e' opzionale: se presente, guida il modello.
 */
export const draftFaqFromTicketApi = async (
    ticketId: number,
    adminSummary?: string
): Promise<FaqDraftResponse> => {
    const body = adminSummary?.trim() ? { admin_summary: adminSummary.trim() } : {};
    const response = await api.post(`/admin/tickets/${ticketId}/faq-draft`, body);
    return response.data;
};