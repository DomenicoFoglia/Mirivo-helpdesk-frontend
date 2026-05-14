import type { NavItem } from "../types"

export const userNavItems: NavItem[] = [
    { type: 'label', text: 'Workspace' },
    { type: 'item', icon: '', text: 'Panoramica', path: '/user/dashboard' },
    { type: 'item', icon: '', text: 'I miei ticket aperti', path: '/user/tickets/opened', badge: 3 },
    { type: 'item', icon: '', text: 'I miei ticket chiusi', path: '/user/tickets/closed'},
    { type: 'divider' },
    { type: 'label', text: 'Configurazione' },
    { type: 'item', icon: '', text: 'FAQ', path: '/user/faqs' },
    { type: 'divider' },
    { type: 'item', icon: '', text: 'Profilo', path: '/user/profile' },
]