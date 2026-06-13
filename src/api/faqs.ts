import api from "./axios";
import type { Faq } from "../types";

export interface CreateFaqData {
    question: string;
    answer: string;
    category_id: number;
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