import api from './axios'
import type { InvitationInfo, RegisterByInviteData, AuthResponse } from '../types'

export const loginApi = async (email: string, password: string) => {

    return api.post('/auth/login', {
        email : email,
        password : password
    });

}

export const getInvitationByTokenApi = async (token: string) => { 
    const res = await api.get<InvitationInfo>(`/auth/invite/${token}`);
    return res.data;
}

export const registerByInviteApi = async (token:string, data: RegisterByInviteData) => {
    const res = await api.post<AuthResponse>(`/auth/invite/${token}`, data);
    return res.data;
}

export interface ResetPasswordData{
    token: string
    email: string
    password: string
    password_confirmation: string
}

export const resetPasswordApi = async (data: ResetPasswordData) => {
    const res = await api.post('auth/reset-password', data);
    return res.data;
}