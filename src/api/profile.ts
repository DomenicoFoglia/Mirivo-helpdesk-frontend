import api from './axios'

export const updateThemeApi = (theme: string) => {
    return api.put('/user/theme', { theme })
}