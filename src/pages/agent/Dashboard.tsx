import { useEffect, useState } from "react"
import { closedTicketsApi, agentTicketsApi, availableTicketsApi } from "../../api/agentDashboard"
import type { Ticket } from "../../types"
import useAuthStore from "../../store/authStore"
import { Link } from "react-router-dom"
import "./Dashboard.css"

function Sparkline({ bars }: { bars: number[] }) {
    return (
        <div className="agent-sparkline">
            {bars.map((h, i) => (
                <span
                    key={i}
                    className="agent-sparkline-bar"
                    style={{ height: `${h}%` }}
                />
            ))}
        </div>
    )
}

function Dashboard() {
    const [closedTickets, setClosedTickets] = useState({
        closedTicketsToday: 0,
        closedTicketsWeek: [] as number[]
    });
    const [assignedTickets, setAssignedTickets] = useState<Ticket[]>([]);
    const [availableTickets, setAvailableTickets] = useState<Ticket[]>([]);

    const user = useAuthStore(state => state.user)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [closedTicketsRes, assignedTicketsRes, availableTicketsRes] = await Promise.all([
                    closedTicketsApi(),
                    agentTicketsApi(),
                    availableTicketsApi()
                ]);
                setClosedTickets(closedTicketsRes.data);
                setAssignedTickets(assignedTicketsRes.data.data);
                setAvailableTickets(availableTicketsRes.data.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="agent-dashboard">

            {/* Titolo */}
            <div>
                <h1 className="agent-dashboard-title">Benvenuto, {user?.name}</h1>
                <p className="agent-dashboard-company">
                    {user?.company?.name}
                    {user?.level && (
                        <span className="agent-dashboard-level">
                            Livello {user.level}
                        </span>
                    )}
                </p>
            </div>

            {/* Metrica in cima a piena larghezza */}
            <div className="agent-metric-card">
                <div className="agent-metric-left">
                    <span className="agent-metric-label">Ticket chiusi oggi</span>
                    <span className="agent-metric-value">{closedTickets.closedTicketsToday}</span>
                </div>
                <div className="agent-metric-spark">
                    <Sparkline bars={closedTickets.closedTicketsWeek} />
                </div>
            </div>

            {/* Card dettaglio */}
            <div className="agent-dashboard-grid">

                {/* I miei ticket */}
                <div className="agent-list-card">
                    <h3 className="agent-list-title">I miei ticket</h3>
                    <div className="agent-list-body">
                        {assignedTickets.length === 0 && (
                            <p className="agent-list-empty">Nessun ticket assegnato</p>
                        )}
                        {assignedTickets.map(ticket => (
                            <Link to={`/agent/ticket/${ticket.id}`} key={ticket.id} className="agent-ticket-row">
                                <span className="agent-ticket-title">{ticket.title}</span>
                                <span className={`agent-status-badge ${ticket.status}`}>
                                    {ticket.status}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Ticket disponibili */}
                <div className="agent-list-card">
                    <h3 className="agent-list-title">Ticket disponibili</h3>
                    <div className="agent-list-body">
                        {availableTickets.length === 0 && (
                            <p className="agent-list-empty">Nessun ticket disponibile</p>
                        )}
                        {availableTickets.map(ticket => (
                            <Link to={`/agent/ticket/${ticket.id}`} key={ticket.id} className="agent-ticket-row">
                                <span className="agent-ticket-title">{ticket.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Dashboard