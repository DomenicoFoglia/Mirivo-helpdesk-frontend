import type { NavItem } from "../types"
import { LayoutDashboard, Ticket, MessageSquare, FolderTree, Users, Mail, UserCircle, ArrowUpCircle } from "lucide-react"

export const adminNavItems: NavItem[] = [
    { type: 'label', text: 'Workspace' },
    { type: 'item', icon: LayoutDashboard, text: 'Panoramica', path: '/admin/dashboard' },
    { type: 'item', icon: Ticket, text: 'Ticket', path: '/admin/tickets', badge: 3 },
    { type: 'item', icon: ArrowUpCircle, text: 'Ticket scalati', path: '/admin/tickets/escalated' },
    { type: 'divider' },
    { type: 'label', text: 'Team' },
    { type: 'item', icon: Users, text: 'Utenti', path: '/admin/users', children: [
        { text: 'Tecnici', path: '/admin/users/agents' },
        { text: 'Utenti', path: '/admin/users/end-users' },
    ]},
    { type: 'item', icon: Mail, text: 'Inviti', path: '/admin/invitations', badge: 2 },
    { type: 'divider' },
    { type: 'label', text: 'Configurazione' },
    { type: 'item', icon: FolderTree, text: 'Categorie', path: '/admin/categories' },
    { type: 'item', icon: MessageSquare, text: 'FAQ', path: '/admin/faqs' },
    { type: 'divider' },
    { type: 'item', icon: UserCircle, text: 'Impostazioni', path: '/admin/profile' },
]