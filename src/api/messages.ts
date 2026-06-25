import api from "./axios"

export const userTicketGetMessagesApi = async (id: string) =>{
    return api.get(`/tickets/${id}/messages`);
}

export const userTicketPostMessageApi = async (id: string, body: string, attachments: File[] = []) =>{
    const formData = new FormData();
    formData.append('body', body);
    formData.append('type', 'public');
    attachments.forEach(file => {
        formData.append('attachments[]', file);
    });
    return api.post(`/tickets/${id}/messages`, formData);
}

export const ticketPostMessageApi = async (
    id: string,
    body: string,
    type: 'public' | 'private',
    role: 'admin' | 'agent',
    attachments: File[] = []
) => {
    const formData = new FormData();
    formData.append('body', body);
    formData.append('type', type);
    attachments.forEach(file => {
        formData.append('attachments[]', file);
    });
    return api.post(`/${role}/tickets/${id}/messages`, formData);
}

export const ticketGetMessagesApi = async (id: string, role: 'admin' | 'agent') => {
    return api.get(`/${role}/tickets/${id}/messages`);
}