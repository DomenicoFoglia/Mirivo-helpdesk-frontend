import api from "./axios"
import type { TicketListParams, Paginated, Ticket } from "../types";

export const userTicketApi = async (id: string): Promise<Ticket> =>{
    const res = await api.get<Ticket>(`/tickets/${id}`);
    return res.data;
}

export const agentTicketApi = async (id: string): Promise<Ticket> => {
    const res = await api.get<Ticket>(`/agent/tickets/${id}`);
    return res.data;
}

export const adminTicketApi = async (id: string): Promise<Ticket> => {
    const res = await api.get<Ticket>(`/admin/tickets/${id}`);
    return res.data;
}

export const ticketListApi = async (role: 'admin' | 'agent', params: TicketListParams = {} ) => {
    const res = await api.get<Paginated<Ticket>>(`/${role}/tickets`, { params });
    return res.data;
}

export const availableTicketListApi = async (params: TicketListParams = {}) => {
    const res = await api.get<Paginated<Ticket>>('/agent/tickets/available',  {params});
    return res.data;
}

export const categoriesApi = async (role: 'admin' | 'agent' | 'user') => {
    const res = await api.get(`/${role}/categories`);
    return res.data;
}

export const changeStatus = async (id: string, status: string, role: 'admin' | 'agent'): Promise<Ticket> => {
    const res = await api.put<Ticket>(`/${role}/tickets/${id}/updateStatus`, { status });
    return res.data;
}

export const changePriority = async (
    id: string, 
    priority: Ticket['priority'], // equivale a 'low' | 'medium' | 'high' | null
    role: 'admin' | 'agent'): Promise<Ticket> =>{
    const res = await api.put<Ticket>(`/${role}/tickets/${id}/updatePriority`, {priority});
    return res.data;
}

export const escalateTicket = async (id: string, role: 'admin' | 'agent'): Promise<Ticket> =>{
    const res = await api.put<Ticket>(`/${role}/tickets/${id}/escalate`);
    return res.data;
}

export const escalatedAvailableApi = async (role: 'admin' | 'agent') => {
    const res = await api.get<Paginated<Ticket>>(`/${role}/tickets/escalated/available`);
    return res.data;
}

export const assignEscalatedApi = async (id: string): Promise<Ticket> => {
    const res = await api.post<Ticket>(`/agent/tickets/${id}/assignEscalated`);
    return res.data;
}

export const assignTicketApi = async (id: number): Promise<Ticket> => {
    const res = await api.post<Ticket>(`/agent/tickets/${id}/assign`);
    return res.data;
};

interface userTicketListParams {
    state?: 'open' | 'closed'
    search?: string
    page?: number
}

export const userTicketListApi = async (params?: userTicketListParams) => {
    const response = await api.get('/tickets', {params});
    return response.data;
}

export interface CreateTicketData {
    title: string
    category_id: number
    message: string
}

export const userCreateTicketApi = async (data: CreateTicketData, attachments: File[] = []) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category_id', String(data.category_id));
    formData.append('message', data.message);

    attachments.forEach(file => {
        formData.append('attachments[]', file);
    });

    const response = await api.post('/tickets', formData);
    return response.data;
}