import api from "./axios"

export const userTicketGetMessagesApi = async (id: string) =>{
    return api.get(`/tickets/${id}/messages`);
}

export const userTicketPostMessageApi = async (id: string, body: string) =>{
    return api.post(`/tickets/${id}/messages`, { body, type: 'public' });
}

export const ticketPostMessageApi = async (id: string, body: string, type: 'public' | 'private', role: 'admin' | 'agent') => {
    return api.post(`/${role}/tickets/${id}/messages`, { body, type });
}

export const ticketGetMessagesApi = async (id: string, role: 'admin' | 'agent') => {
    return api.get(`/${role}/tickets/${id}/messages`);
}