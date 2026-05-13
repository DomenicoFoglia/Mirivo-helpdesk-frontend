import { create } from 'zustand'
import type { User } from '../types/index'

interface AuthStore {
    user: User | null
    token: string | null
    login: (user: User, token: string) => void
    setUser: (user: User) => void
    logout: () => void
}

const applyTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme || 'amber')
}

applyTheme(localStorage.getItem('theme') || 'amber')

const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,

    login: (user, token) => {
        localStorage.setItem('token', token)
        if (user?.theme) {
            applyTheme(user.theme)
            localStorage.setItem('theme', user.theme)
        }
        set({ user, token })
    },

    setUser: (user) => {
        if (user?.theme) {
            applyTheme(user.theme)
            localStorage.setItem('theme', user.theme)
        }
        set({ user })
    },

    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('theme')
        set({ user: null, token: null })
    },
}))

export default useAuthStore