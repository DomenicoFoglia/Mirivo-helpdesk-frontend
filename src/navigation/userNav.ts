import type { NavItem } from "../types"
import { LayoutDashboard, TicketCheck, MessageSquare, UserCircle } from "lucide-react"

export const userNavItems: NavItem[] = [
    { type: 'label', text: 'Workspace' },
    { type: 'item', icon: LayoutDashboard, text: 'Panoramica', path: '/user/dashboard' },
    { type: 'item', icon: TicketCheck, text: 'I miei ticket', path: '/user/tickets' },
    { type: 'divider' },
    { type: 'label', text: 'Configurazione' },
    { type: 'item', icon: MessageSquare, text: 'FAQ', path: '/user/faqs' },
    { type: 'divider' },
    { type: 'item', icon: UserCircle, text: 'Impostazioni', path: '/user/profile' },
]