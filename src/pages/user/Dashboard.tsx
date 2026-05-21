import { useState, useEffect } from "react"
import { userTicketsApi } from "../../api/userDashboard"
import type { Ticket } from "../../types"
import useAuthStore from "../../store/authStore"
import { Link } from "react-router-dom"
import "./Dashboard.css"

function Dashboard() {
    const [userTickets, setUserTickets] = useState<Ticket[]>([]);

    const user = useAuthStore(state => state.user)

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const userTicketsRes = await userTicketsApi();
                setUserTickets(userTicketsRes.data.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchTickets();
    }, []);

    return (
        <div className="p-6 flex flex-col gap-4">

            {/* Titolo */}
            <div>
                <h1 className="text-xl font-medium user-dashboard-title">Benvenuto, {user?.name}</h1>
                <p className="text-sm user-dashboard-company">{user?.company?.name}</p>
            </div>

            {/* Lista ticket */}
            <div className="ticket-list-card rounded-xl p-5 max-w-2xl mx-auto w-full">
                <h2 className="text-sm font-medium ticket-list-title mb-3">I miei ticket</h2>
                <div className="ticket-list-header flex items-center justify-between pb-2 mb-1">
                    <span className="text-xs font-medium uppercase tracking-wide">Titolo</span>
                    <span className="text-xs font-medium uppercase tracking-wide">Stato</span>
                </div>
                <div className="ticket-list-divider divide-y">
                    {userTickets.length === 0 ? (
                        <p className="ticket-empty text-base py-4 text-center">Nessun ticket aperto</p>
                    ) : (
                        userTickets.map(ticket => (
                            <Link to={`/user/ticket/${ticket.id}`} key={ticket.id} className="ticket-row">
                                <span className="text-sm truncate pr-4">{ticket.title}</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 status-badge-${ticket.status}`}>
                                    {ticket.status}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

        </div>
    )
}

export default Dashboard