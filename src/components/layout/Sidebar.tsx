import type { NavItem } from "../../types"
import { useNavigate } from "react-router-dom"
import './Sidebar.css'

function Sidebar({ navItems }: { navItems: NavItem[] }) {
    const navigate = useNavigate()

    return (
        <div className="sidebar">
            {navItems.map((item, index) => {
                if (item.type === 'divider') return <hr key={index} className="nav-divider" />
                
                if (item.type === 'label') return (
                    <span key={index} className="nav-section-label">{item.text}</span>
                )
                
                if (item.type === 'item') return (
                    <div key={index}>
                        <div className="nav-item" onClick={() => navigate(item.path)}>
                            {item.text}
                            {item.badge && <span className="badge-count">{item.badge}</span>}
                        </div>
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

                return null
            })}
        </div>
    )
}

export default Sidebar