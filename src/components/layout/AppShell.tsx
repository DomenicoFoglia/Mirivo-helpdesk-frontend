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
            <Topbar onHamburgerClick={() => setDrawerOpen(true)} />
            {drawerOpen && <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />}
            <div className="body">
                <Sidebar navItems={navItems} drawerOpen={drawerOpen} onClose={() => setDrawerOpen(false)}/>
                <main><Outlet /></main>
            </div>
        </div>
    )
}

export default AppShell