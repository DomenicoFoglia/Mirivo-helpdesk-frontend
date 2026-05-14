import type { NavItem } from "../types"

export const agentNavItems: NavItem[] = [
    { type: 'label', text: 'Workspace' },
    { type: 'item', icon: '', text: 'Panoramica', path: '/agent/dashboard' },
    { type: 'item', icon: '', text: 'I miei ticket', path: '/agent/tickets', badge: 3 },
    { type: 'item', icon: '', text: 'Ticket disponibili', path: '/agent/tickets/available', badge: 1 },
    { type: 'item', icon: '', text: 'Ticket scalati', path: '/agent/tickets/escalated', badge: 2 },
    { type: 'divider' },
    { type: 'label', text: 'Configurazione' },
    { type: 'item', icon: '', text: 'FAQ', path: '/agent/faqs' },
    { type: 'divider' },
    { type: 'item', icon: '', text: 'Profilo', path: '/agent/profile' },
]