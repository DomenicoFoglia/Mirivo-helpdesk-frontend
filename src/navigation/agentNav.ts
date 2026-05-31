import type { NavItem } from "../types"
import { LayoutDashboard, Ticket, Inbox, ArrowUpCircle, MessageSquare, UserCircle } from "lucide-react"

export const agentNavItems: NavItem[] = [
    { type: 'label', text: 'Workspace' },
    { type: 'item', icon: LayoutDashboard, text: 'Panoramica', path: '/agent/dashboard' },
    { type: 'item', icon: Ticket, text: 'I miei ticket', path: '/agent/tickets' },
    { type: 'item', icon: Inbox, text: 'Ticket disponibili', path: '/agent/tickets/available'},
    { type: 'item', icon: ArrowUpCircle, text: 'Ticket scalati', path: '/agent/tickets/escalated', badge: 2, requiredLevel: 2 },
    { type: 'divider' },
    { type: 'label', text: 'Configurazione' },
    { type: 'item', icon: MessageSquare, text: 'FAQ', path: '/agent/faqs', requiredLevel: 2 },
    { type: 'divider' },
    { type: 'item', icon: UserCircle, text: 'Impostazioni', path: '/agent/profile' },
]