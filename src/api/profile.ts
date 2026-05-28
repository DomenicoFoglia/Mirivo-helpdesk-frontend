import api from './axios'
import type { User } from '../types/index'

// export const updateThemeApi = (theme: string) => {
//     return api.put('/user/theme', { theme })
// }
// Adottiamo un nuovo stile in cui e' la funzione ad aspettare il risultato(await)
export const updateThemeApi = async (theme: string): Promise<void> => {
    await api.put('/user/theme', { theme })
}

export const updateProfileApi = async (name: string, surname: string, email: string): Promise<User> => {
    const response = await api.put('/user/profile', { name, surname, email })
    return response.data
}

export const updatePasswordApi = async (current_password: string, password: string, password_confirmation: string): Promise<void> => {
    await api.put('/user/password', { current_password, password, password_confirmation })
}