import { useState, useEffect } from "react"
import { userTicketsApi } from "../../api/userDashboard"
import type { Ticket } from "../../types"
import useAuthStore from "../../store/authStore"

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
                <h1 className="text-xl font-medium text-gray-800">Benvenuto, {user?.name}</h1>
                <p className="text-sm text-gray-500">{user?.company?.name}</p>
            </div>

            {/* Lista ticket */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-2xl mx-auto w-full">
                <h2 className="text-sm font-medium text-gray-700 mb-3">I miei ticket</h2>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-1">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Titolo</span>
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Stato</span>
                </div>
                <div className="divide-y divide-gray-100">
                    {userTickets.length === 0 ? (
                        <p className="text-base text-gray-400 py-4 text-center">Nessun ticket aperto</p>
                    ) : (
                        userTickets.map(ticket => (
                            <div key={ticket.id} className="flex items-center justify-between py-2.5">
                                <span className="text-sm text-gray-600 truncate pr-4">{ticket.title}</span>
                                <span
                                    className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                                    style={
                                        ticket.status === 'working'
                                            ? { background: "#EEEDFE", color: "#3C3489" }
                                            : ticket.status === 'closed'
                                            ? { background: "#F1EFE8", color: "#444441" }
                                            : { background: "#FAEEDA", color: "#633806" }
                                    }
                                >
                                    {ticket.status}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    )
}

export default Dashboard