import type { NavItem } from "../types"
import { LayoutDashboard, TicketCheck, CheckCircle2, MessageSquare, UserCircle } from "lucide-react"

export const userNavItems: NavItem[] = [
    { type: 'label', text: 'Workspace' },
    { type: 'item', icon: LayoutDashboard, text: 'Panoramica', path: '/user/dashboard' },
    { type: 'item', icon: TicketCheck, text: 'Ticket aperti', path: '/user/tickets/opened', badge: 3 },
    { type: 'item', icon: CheckCircle2, text: 'Ticket chiusi', path: '/user/tickets/closed'},
    { type: 'divider' },
    { type: 'label', text: 'Configurazione' },
    { type: 'item', icon: MessageSquare, text: 'FAQ', path: '/user/faqs' },
    { type: 'divider' },
    { type: 'item', icon: UserCircle, text: 'Impostazioni', path: '/user/profile' },
]