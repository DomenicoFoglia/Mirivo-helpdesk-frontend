import { Outlet, useLocation} from "react-router-dom"
import './AppShell.css'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import type { NavItem } from "../../types"
import { useEffect, useState } from "react"
import useAuthStore from "../../store/authStore"
import { ticketListApi, availableTicketListApi, escalatedAvailableApi } from "../../api/tickets"
import Chatbot from "../Chatbot/Chatbot"


function AppShell({ navItems }: { navItems: NavItem[] }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const user = useAuthStore(state => state.user);
    // Stato per il conteggio dei ticket in stato: open
    const [openCount, setOpenCount] = useState(0);
    // Stati per il conteggio dei ticket disponibili per Tecnici e ticket escalati per tecnici Lvl 2
    const [ availableCount, setAvailableCount ] = useState(0);
    const [ escalatedCount, setEscalatedCount ] = useState(0);
    // Ci serve per aggiornare i badge
    const location = useLocation();


    useEffect(() => {
        if(user?.role === 'admin') {
            const fetchOpenTickets = async () =>{
                try{
                    const res = await ticketListApi('admin', { status: 'open'});
                    setOpenCount(res.total);
                }catch{
                    
                }
            } 
            fetchOpenTickets(); 
        } else if(user?.role === 'agent'){
            const fetchAvailableTickets = async () =>{
                try{
                    const res = await availableTicketListApi();
                    setAvailableCount(res.total);
                }catch{

                }
            }
            fetchAvailableTickets();
            if(user?.level === 2){
                const fetchEscalatedTickets = async () =>{
                    try{
                        const res = await escalatedAvailableApi('agent');
                        setEscalatedCount(res.total);
                    }catch{

                    }
                }
                fetchEscalatedTickets();
            }
        } 

    },[user?.role, user?.level, location.pathname]);

    const filteredNavItems =navItems.filter( item => item.type !== 'item' || !item.requiredLevel || user?.level === item.requiredLevel);

    const navWithBadge = filteredNavItems.map(item => {
        // if (item.type === 'item' && item.path === '/admin/tickets') {
        //     return { ...item, badge: openCount };
        // }

        if (item.type !== 'item') return item;

        switch (item.path) {
            case '/admin/tickets':
                return { ...item, badge: openCount };
            case '/agent/tickets/available':
                return { ...item, badge: availableCount };
            case '/agent/tickets/escalated':
                return { ...item, badge: escalatedCount };
            default:
                return item;
        }
    });

    return (
        <div className="shell">
            {/* La differenza: con !drawerOpen stai catturando il valore al momento del render. 
            Con prev => !prev React ti garantisce il valore più aggiornato, anche se ci sono aggiornamenti di stato in batch. */}
            <Topbar onHamburgerClick={() => setDrawerOpen(prev => !prev)} />
            {drawerOpen && <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />}
            <div className="body">
                <Sidebar navItems={navWithBadge} drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)}/>
                <main><Outlet /></main>
                {user?.role === 'user' && <Chatbot />}
            </div>
        </div>
    )
}

export default AppShell

