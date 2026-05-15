import api from "./axios";

export const closedTicketsApi = async () => {
    return api.get('agent/dashboard/stats');
}

export const agentTicketsApi = async () =>{
    return api.get('agent/tickets');
}

export const availableTicketsApi = async () => {
    return api.get('agent/tickets/available');
}