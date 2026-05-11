export interface Company {
    id: number
    name: string
    slug: string
}

export interface User {
    id: number
    name: string
    surname: string
    email: string
    role: 'admin' | 'agent' | 'user'
    level: 1 | 2 | null
    company_id: number
    theme: string
    company: Company
}

export interface Category {
    id: number
    name: string
    company_id: number
}

export interface Tag {
    id: number
    name: string
    company_id: number
}

export interface Ticket {
    id: number
    title: string
    status: 'open' | 'working' | 'escalated' | 'closed'
    user_id: number
    assignee_id: number | null
    company_id: number
    category_id: number
    created_at: string
    closed_at: string | null
}

export interface Message {
    id: number
    body: string
    type: 'public' | 'private'
    ticket_id: number
    user_id: number
    created_at: string
}

export interface Faq {
    id: number
    question: string
    answer: string
    category_id: number
    company_id: number
}

export interface Invitation {
    id: number
    email: string
    role: 'agent' | 'user'
    token: string
    accepted_at: string | null
    expires_at: string
    company_id: number
}

export type NavItem =
    | { type: 'label'; text: string }
    | { type: 'divider' }
    | { type: 'item'; text: string; icon: string; path: string; badge?: number; children?: { text: string; path: string }[] }