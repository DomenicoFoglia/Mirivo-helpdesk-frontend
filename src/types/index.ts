import type { LucideIcon } from "lucide-react"
// Risposta di login e registrazione (usabile anche da loginApi/registerApi)
export interface AuthResponse{
    message?: string
    user: User
    token: string
}

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
    created_at?: string
}

export type AgentSummary = Pick<User, 'id' | 'name' | 'level' > & {
    assignee_tickets_count: number
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
    priority: 'low' | 'medium' | 'high' | null
    user_id: number
    assignee_id: number | null
    company_id: number
    category_id: number
    created_at: string
    updated_at: string
    closed_at: string | null
    assignee?: {
        id: number
        name: string
        surname: string
    }
    category?: {
        id: number
        name: string
    }
    user?: {
        id: number
        name: string
        surname: string
    }
}

export interface TicketListParams{
    status?: string;
    priority?: string;
    category_id?: number;
    search?: string;
    page?: number;
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export type AttentionTicket = Pick<Ticket, 'id'| 'title' | 'priority' | 'updated_at' >

export interface Message {
    id: number
    body: string
    type: 'public' | 'private'
    ticket_id: number
    user_id: number
    created_at: string
    user?: {
        id: number
        name: string
        surname: string
        role: 'admin' | 'agent' | 'user'
    }
}

export interface Faq {
    id: number
    question: string
    answer: string
    category_id: number
    company_id: number
    created_at: string
    updated_at : string
}

export type RecentFaq = Pick<Faq, 'id' | 'question' | 'created_at' >

export interface Invitation {
    id: number
    email: string
    role: 'agent' | 'user'
    accepted_at: string | null
    expires_at: string
    created_at: string
}

// Dati pubblici di un invito (GET /auth/invite/{token})
export interface InvitationInfo {
    email: string
    role: Invitation['role']
    company: Pick<Company, 'id' | 'name'>
}

// Dati richiesti per finalizzare la registrazione tramite invito
export interface RegisterByInviteData{
    name: string
    surname: string
    password: string
    password_confirmation: string
}

export type PendingInvitation = Pick<Invitation, 'email' | 'role' | 'created_at' >

export type NavItem =
    | { type: 'label'; text: string }
    | { type: 'divider' }
    | { type: 'item'; text: string; icon: LucideIcon; path: string; badge?: number; children?: { text: string; path: string }[]; requiredLevel?: 2 }

// L'interfaccia con i 4 tipi creati sopra, serve per gestire gli array che arrivano dal backend
// dal metodo details() 
export interface AdminDashboardDetails{
    attentionTickets: AttentionTicket[]
    agents: AgentSummary[]
    pendingInvitations: PendingInvitation[]
    recentFaqs: RecentFaq[]
}