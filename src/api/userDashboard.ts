import api from "./axios"

export const userTicketsApi = async () =>{
    return api.get('tickets');
}