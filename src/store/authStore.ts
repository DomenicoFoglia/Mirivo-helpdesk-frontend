import { create } from 'zustand'
import type { User } from '../types/index'

interface AuthStore {
    user: User | null
    login: (user: User) => void
    setUser: (user: User) => void
    logout: () => void
}

const applyTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme || 'amber')
}

applyTheme(localStorage.getItem('theme') || 'amber')

const useAuthStore = create<AuthStore>((set) => ({
    user: null,

    login: (user) => {
        if (user?.theme) {
            applyTheme(user.theme)
            localStorage.setItem('theme', user.theme)
        }
        set({ user })
    },

    setUser: (user) => {
        if (user?.theme) {
            applyTheme(user.theme)
            localStorage.setItem('theme', user.theme)
        }
        set({ user })
    },

    logout: () => {
        localStorage.removeItem('theme')
        set({ user: null })
    },
}))

export default useAuthStore