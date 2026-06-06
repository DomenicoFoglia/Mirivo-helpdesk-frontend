import api from './axios';
import type { User, Paginated } from '../types';

export interface UsersParams {
    role: 'agent' | 'user';
    page?: number;
    search?: string;
    level?: number;
}

// Lista utenti
export const getUsersApi = async (params: UsersParams) => {
    const res = await api.get<Paginated<User>>('/admin/users', { params });
    return res.data;
};

// Untente singolo
export const getUserApi = async (id: number) => {
    const res = await api.get<User>(`/admin/users/${id}`);
    return res.data;
};

// Aggiorna dati parzialmente ( Se usassimo User direttamente dovremmo passare al backend tutto l'oggetto User)
export const updateUserApi = async (id: number, data: Partial<User>) => {
    const res = await api.put<User>(`/admin/users/${id}`, data);
    return res.data;
};

// Cancella utente
export const deleteUserApi = async (id: number) => {
    await api.delete(`/admin/users/${id}`);
};

// Chiama il resetPassowrd del backend
export const resetUserPasswordApi = async (id: number) => {
    const res = await api.post(`/admin/users/${id}/reset-password`);
    return res.data;
};