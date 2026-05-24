import api from "./axios"

export const userTicketApi = async (id: string) =>{
    return api.get(`/tickets/${id}`);
}

export const agentTicketApi = async (id: string) => {
    return api.get(`/agent/tickets/${id}`);
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