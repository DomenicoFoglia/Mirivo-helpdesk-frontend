import api from "./axios"

export const userTicketGetMessagesApi = async (id: string) =>{
    return api.get(`ticket/${id}/messages`);
}

export const userTicketPostMessageApi = async (id: string, body: string) =>{
    return api.post(`ticket/${id}/messages`, { body, type: 'public' });
}