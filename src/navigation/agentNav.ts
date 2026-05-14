import type { NavItem } from "../types"
import { LayoutDashboard, Ticket, Inbox, ArrowUpCircle, MessageSquare, UserCircle } from "lucide-react"

export const agentNavItems: NavItem[] = [
    { type: 'label', text: 'Workspace' },
    { type: 'item', icon: LayoutDashboard, text: 'Panoramica', path: '/agent/dashboard' },
    { type: 'item', icon: Ticket, text: 'I miei ticket', path: '/agent/tickets', badge: 3 },
    { type: 'item', icon: Inbox, text: 'Ticket disponibili', path: '/agent/tickets/available', badge: 1 },
    { type: 'item', icon: ArrowUpCircle, text: 'Ticket scalati', path: '/agent/tickets/escalated', badge: 2 },
    { type: 'divider' },
    { type: 'label', text: 'Configurazione' },
    { type: 'item', icon: MessageSquare, text: 'FAQ', path: '/agent/faqs' },
    { type: 'divider' },
    { type: 'item', icon: UserCircle, text: 'Profilo', path: '/agent/profile' },
]