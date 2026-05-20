import api from "./axios"

export const userTicketApi = async (id: string) =>{
    return api.get(`ticket/${id}`);
}