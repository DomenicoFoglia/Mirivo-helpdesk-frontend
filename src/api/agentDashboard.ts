import api from "./axios";

export const closedTicketsApi = async () => {
    return api.get('agent/dashboard/stats');
}

export const agentTicketsApi = async () =>{
    return api.get('agent/tickets', { params: { per_page: 5 } });
}

export const availableTicketsApi = async () => {
    return api.get('agent/tickets/available', { params: { per_page: 5 } });
}