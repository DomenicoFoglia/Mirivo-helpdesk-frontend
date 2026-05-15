import { Outlet } from "react-router-dom"
import './AppShell.css'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import type { NavItem } from "../../types"
import { useState } from "react"

function AppShell({ navItems }: { navItems: NavItem[] }) {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <div className="shell">
            {/* La differenza: con !drawerOpen stai catturando il valore al momento del render. 
            Con prev => !prev React ti garantisce il valore più aggiornato, anche se ci sono aggiornamenti di stato in batch. */}
            <Topbar onHamburgerClick={() => setDrawerOpen(prev => !prev)} />
            {drawerOpen && <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />}
            <div className="body">
                <Sidebar navItems={navItems} drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)}/>
                <main><Outlet /></main>
            </div>
        </div>
    )
}

export default AppShell