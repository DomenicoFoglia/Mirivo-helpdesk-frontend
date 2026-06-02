import api from "./axios";
import type { Invitation, Paginated } from "../types";

export const invitationListApi = async (page: number) =>{
    const res = await api.get<Paginated<Invitation>>(`/admin/invitations?page=${page}`);
    return res.data;
}

export const createInvitationApi = async (email: string, role: 'agent' | 'user') => {
    const res = await api.post<Invitation>(`/admin/invitations`, {email,  role});
    return res.data;
}

export const deleteInvitationApi = async (id: number) => {
    return api.delete(`/admin/invitations/${id}`);
}