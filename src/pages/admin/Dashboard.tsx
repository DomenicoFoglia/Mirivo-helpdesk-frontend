import { useState, useEffect } from "react"
import { statsApi, detailsApi } from "../../api/adminDashboard"
import type { AdminDashboardDetails } from "../../types"
import useAuthStore from "../../store/authStore"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"

function Dashboard() {
    const [stats, setStats] = useState({
        openTickets: 0,
        workingTickets: 0,
        closedTicketsToday: 0,
        withoutAnswerTickets: 0
    });

    const [details, setDetails] = useState<AdminDashboardDetails>({
        attentionTickets: [],
        agents: [],
        pendingInvitations: [],
        recentFaqs: []
    });

    const user = useAuthStore(state => state.user)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, detailsRes] = await Promise.all([
                    statsApi(),
                    detailsApi()
                ]);
                setStats(statsRes.data);
                setDetails(detailsRes.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchStats();
    }, []);

    return (
        <div className="p-6 flex flex-col gap-4">
            <button onClick={() => toast.error("Funziona!")}>Clicca</button>

            {/* Titolo */}
            <div>
                <h1 className="text-xl font-medium text-gray-800">Benvenuto, {user?.name}</h1>
                <p className="text-sm text-gray-500">{user?.company?.name}</p>
            </div>

            {/* Metriche: riga scrollabile su mobile, colonna a destra su desktop */}
            {/* Su mobile: order-first, flex-row con overflow-x-auto */}
            {/* Su desktop: sparisce da qui, appare nella colonna destra tramite il flex esterno */}

            {/* Layout principale */}
            <div className="flex flex-col lg:flex-row gap-3 items-start">

                {/* Colonna metriche: in cima su mobile, a destra su desktop */}
                <div className="w-full lg:w-56 lg:flex-shrink-0 lg:order-2 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-1 lg:pb-0">

                    {/* Card critica */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 min-w-40 lg:min-w-0">
                        <span className="text-xs font-medium text-gray-500 tracking-wide">Senza risposta +24h</span>
                        <span className="text-4xl font-medium" style={{ color: "#A32D2D" }}>{stats.withoutAnswerTickets}</span>
                        {stats.withoutAnswerTickets > 0 && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xl" style={{ color: "#E24B4A" }}>⚠</span>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: "#FCEBEB", color: "#791F1F" }}>richiede attenzione</span>
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2 min-w-36 lg:min-w-0">
                        <span className="text-xs font-medium text-gray-500 tracking-wide">Ticket aperti</span>
                        <span className="text-3xl font-medium" style={{ color: "#BA7517" }}>{stats.openTickets}</span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2 min-w-36 lg:min-w-0">
                        <span className="text-xs font-medium text-gray-500 tracking-wide">In lavorazione</span>
                        <span className="text-3xl font-medium" style={{ color: "#534AB7" }}>{stats.workingTickets}</span>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2 min-w-36 lg:min-w-0">
                        <span className="text-xs font-medium text-gray-500 tracking-wide">Risolti oggi</span>
                        <span className="text-3xl font-medium" style={{ color: "#3B6D11" }}>{stats.closedTicketsToday}</span>
                    </div>

                </div>

                {/* Card dettaglio: grid 1 colonna su mobile, 2 colonne su desktop */}
                <div className="flex-1 lg:order-1 grid grid-cols-1 md:grid-cols-2 gap-3">

                    {/* Richiede attenzione */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Richiede attenzione</h3>
                        <div className="flex flex-col gap-2">
                            {details.attentionTickets.map(ticket => (
                                <Link to={`/admin/ticket/${ticket.id}`} key={ticket.id} className="flex items-center gap-2 hover:bg-gray-50 transition-colors rounded px-1 -mx-1">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                        ticket.priority === "high" ? "bg-red-500" :
                                        ticket.priority === "medium" ? "bg-yellow-400" :
                                        "bg-gray-300"
                                    }`} />
                                    <span className="text-sm text-gray-600 truncate">{ticket.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Agenti con carico */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Agenti con carico</h3>
                        <div className="flex flex-col gap-2">
                            {details.agents.map(agent => (
                                <div key={agent.id} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{agent.name}</span>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#EEEDFE", color: "#3C3489" }}>
                                        {agent.assignee_tickets_count} ticket
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inviti pendenti */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Inviti pendenti</h3>
                        <div className="flex flex-col gap-2">
                            {details.pendingInvitations.map(inv => (
                                <div key={inv.email} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">{inv.email}</span>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#FAEEDA", color: "#633806" }}>
                                        {inv.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ recenti */}
                    <div className="bg-white border border-gray-200 rounded-xl p-5">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">FAQ recenti</h3>
                        <div className="flex flex-col gap-2">
                            {details.recentFaqs.map(faq => (
                                <div key={faq.id} className="flex items-center gap-2">
                                    <span className="text-gray-300 text-xs">—</span>
                                    <span className="text-sm text-gray-600">{faq.question}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>

        </div>
    )
}

export default Dashboard