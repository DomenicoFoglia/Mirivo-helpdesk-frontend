import type { NavItem } from "../types"

export const adminNavItems: NavItem[] = [
    { type: 'label', text: 'Workspace' },
    { type: 'item', icon: '', text: 'Panoramica', path: '/admin/dashboard' },
    { type: 'item', icon: '', text: 'Ticket', path: '/admin/tickets', badge: 3 },
    { type: 'divider' },
    { type: 'label', text: 'Team' },
    { type: 'item', icon: '', text: 'Utenti', path: '/admin/users', children: [
        { text: 'Agenti', path: '/admin/users/agents' },
        { text: 'Utenti finali', path: '/admin/users/end-users' },
    ]},
    { type: 'item', icon: '', text: 'Inviti', path: '/admin/invitations', badge: 2 },
    { type: 'divider' },
    { type: 'label', text: 'Configurazione' },
    { type: 'item', icon: '', text: 'Categorie', path: '/admin/categories' },
    { type: 'item', icon: '', text: 'FAQ', path: '/admin/faqs' },
    { type: 'divider' },
    { type: 'item', icon: '', text: 'Impostazioni', path: '/admin/settings' },
]