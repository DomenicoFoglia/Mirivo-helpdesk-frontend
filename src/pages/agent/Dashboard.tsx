import { useEffect, useState } from "react"
import { closedTicketsApi, agentTicketsApi, availableTicketsApi } from "../../api/agentDashboard"
import type { Ticket } from "../../types"
import useAuthStore from "../../store/authStore"
import { Link } from "react-router-dom"

function Sparkline({ bars, color }: { bars: number[]; color: string }) {
    return (
        <div className="flex items-end gap-0.5 h-7">
            {bars.map((h, i) => (
                <span
                    key={i}
                    className="w-1.5 rounded-t-sm inline-block"
                    style={{ height: `${h}%`, background: color }}
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
        <div className="p-6 flex flex-col gap-4">

            {/* Titolo */}
            <div>
                <h1 className="text-xl font-medium text-gray-800">Benvenuto, {user?.name}</h1>
                <p className="text-sm text-gray-500">
                    {user?.company?.name}
                    {user?.level && (
                        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#EEEDFE", color: "#3C3489" }}>
                            Livello {user.level}
                        </span>
                    )}
                </p>
            </div>

            {/* Metrica in cima a piena larghezza */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between">
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-gray-500 tracking-wide">Ticket chiusi oggi</span>
                    <span className="text-3xl font-medium" style={{ color: "#BA7517" }}>{closedTickets.closedTicketsToday}</span>
                </div>
                <div className="w-32">
                    <Sparkline bars={closedTickets.closedTicketsWeek} color="#EF9F27" />
                </div>
            </div>

            {/* Card dettaglio */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* I miei ticket */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">I miei ticket</h3>
                    <div className="flex flex-col gap-2">
                        {assignedTickets.map(ticket => (
                            <Link to={`/agent/ticket/${ticket.id}`} key={ticket.id} className="flex items-center justify-between hover:bg-gray-50 transition-colors rounded px-1 -mx-1">
                                <span className="text-sm text-gray-600 truncate">{ticket.title}</span>
                                <span
                                    className="text-xs font-medium px-2 py-0.5 rounded-full ml-2 flex-shrink-0"
                                    style={ticket.status === 'working'
                                        ? { background: "#EEEDFE", color: "#3C3489" }
                                        : { background: "#FAEEDA", color: "#633806" }
                                    }
                                >
                                    {ticket.status}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Ticket disponibili */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Ticket disponibili</h3>
                    <div className="flex flex-col gap-2">
                        {availableTickets.map(ticket => (
                            <Link to={`/agent/ticket/${ticket.id}`} key={ticket.id} className="flex items-center justify-between hover:bg-gray-50 transition-colors rounded px-1 -mx-1">
                                <span className="text-sm text-gray-600 truncate">{ticket.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Dashboard