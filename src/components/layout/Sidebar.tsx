import type { NavItem } from "../../types"
import { useNavigate, NavLink } from "react-router-dom"
import './Sidebar.css'

function Sidebar({ navItems, drawerOpen, onClose }: { navItems: NavItem[]; drawerOpen: boolean; onClose: () => void }) {
    const navigate = useNavigate()

    return (
        <div className={`sidebar ${drawerOpen ? 'drawer-open' : ''}`}>
            {navItems.map((item, index) => {
                if (item.type === 'divider') return <hr key={index} className="nav-divider" />
                
                if (item.type === 'label') return (
                    <span key={index} className="nav-section-label">{item.text}</span>
                )
                
                if (item.type === 'item') {
                    const Icon = item.icon
                    return (
                        <div key={index}>
                            <NavLink to={item.path} end className={({isActive}) => isActive ? "nav-item active" : "nav-item"} data-tooltip={item.text}>
                                <Icon size={18} />
                                {item.text}
                                {item.badge && <span className="badge-count">{item.badge}</span>}
                            </NavLink>
                            {/* <div className="nav-item" onClick={() => navigate(item.path)}>
                                <Icon size={18} />
                                {item.text}
                                {item.badge && <span className="badge-count">{item.badge}</span>}
                            </div> */}
                            {item.children && (
                                <div className="nav-sub">
                                    {item.children.map((child, childIndex) => (
                                        <div key={childIndex} className="nav-item" onClick={() => navigate(child.path)}>
                                            {child.text}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )
                }

                return null
            })}
        </div>

    )
}

export default Sidebar


