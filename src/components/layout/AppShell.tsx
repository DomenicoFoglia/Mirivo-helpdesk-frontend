import { Outlet } from "react-router-dom"
import './AppShell.css'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import type { NavItem } from "../../types"

function AppShell({ navItems }: { navItems: NavItem[] }) {
    return (
        <div className="shell">
            <Topbar />
            <div className="body">
                <Sidebar navItems={navItems} />
                <main><Outlet /></main>
            </div>
        </div>
    )
}

export default AppShell