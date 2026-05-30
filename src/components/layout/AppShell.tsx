import { Outlet } from "react-router-dom"
import './AppShell.css'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import type { NavItem } from "../../types"
import { useEffect, useState } from "react"
import useAuthStore from "../../store/authStore"
import { ticketListApi } from "../../api/tickets"


function AppShell({ navItems }: { navItems: NavItem[] }) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const user = useAuthStore(state => state.user);
    // Stato per il conteggio dei ticket in stato: open
    const [openCount, setOpenCount] = useState(0);


    useEffect(() => {
        if(user?.role !== 'admin') return;

        const fetchOpenTickets = async () =>{
            try{
                const res = await ticketListApi('admin', { status: 'open'});
                setOpenCount(res.total);
            }catch{
                
            }
        } 
        fetchOpenTickets();   
    },[user?.role])

    const filteredNavItems =navItems.filter( item => item.type !== 'item' || !item.requiredLevel || user?.level === item.requiredLevel);

    const navWithBadge = filteredNavItems.map(item => {
        if (item.type === 'item' && item.path === '/admin/tickets') {
            return { ...item, badge: openCount };
        }
        return item;
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
            </div>
        </div>
    )
}

export default AppShell

