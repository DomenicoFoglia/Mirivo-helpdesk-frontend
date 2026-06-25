import api from "./axios"
import type { TicketListParams, Paginated, Ticket } from "../types";

export const userTicketApi = async (id: string) =>{
    return api.get(`/tickets/${id}`);
}

export const agentTicketApi = async (id: string) => {
    return api.get(`/agent/tickets/${id}`);
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

export const changeStatus = async (id: string, status: string, role: 'admin' | 'agent') => {
    return api.put(`/${role}/tickets/${id}/updateStatus`, { status });
}

export const changePriority = async (id: string, priority: string, role: 'admin' | 'agent') =>{
    return api.put(`/${role}/tickets/${id}/updatePriority`, {priority});
}

export const adminTicketApi = async (id: string) => {
    return api.get(`/admin/tickets/${id}`);
}

export const escalateTicket = async (id: string, role: 'admin' | 'agent') =>{
    return api.put(`/${role}/tickets/${id}/escalate`);
}

export const escalatedAvailableApi = async (role: 'admin' | 'agent') => {
    const res = await api.get<Paginated<Ticket>>(`/${role}/tickets/escalated/available`);
    return res.data;
}

export const assignEscalatedApi = async (id: string) => {
    return api.post(`/agent/tickets/${id}/assignEscalated`);
}

export const assignTicketApi = async (id: number) => {
    return api.post(`/agent/tickets/${id}/assign`);
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