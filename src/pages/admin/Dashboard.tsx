import { useState, useEffect } from "react"
import { statsApi } from "../../api/adminDashboard"

const amberBars = [40, 55, 45, 70, 60, 80, 100]
const purpleBars = [60, 80, 55, 75, 90, 70, 100]
const greenBars  = [30, 50, 65, 45, 80, 90, 100]

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

const fakeDetails = {
    attentionTickets: [
        { id: 1, title: "Errore pagina checkout", priority: "high" },
        { id: 2, title: "Reset password non funziona", priority: "medium" },
        { id: 3, title: "Email di conferma mancante", priority: "low" },
    ],
    agents: [
        { id: 1, name: "Luigi Verdi", workingTickets: 5 },
        { id: 2, name: "Sara Neri", workingTickets: 3 },
        { id: 3, name: "Marco Bianchi", workingTickets: 1 },
    ],
    pendingInvitations: [
        { id: 1, email: "paolo@acme.com", role: "agent" },
        { id: 2, email: "giulia@acme.com", role: "user" },
    ],
    recentFaqs: [
        { id: 1, title: "Come reset la password?" },
        { id: 2, title: "Come aprire un ticket?" },
        { id: 3, title: "Dove trovo le fatture?" },
    ]
}

function Dashboard() {
    const [stats, setStats] = useState({
        openTickets: 0,
        workingTickets: 0,
        closedTicketsToday: 0,
        withoutAnswerTickets: 0
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statsApi()
                setStats(response.data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchStats()
    }, [])

    return (
        <div className="p-6">
            <div className="grid grid-cols-4 gap-3">

                <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2">
                    <span className="text-xs font-medium text-gray-500 tracking-wide">Ticket aperti</span>
                    <span className="text-3xl font-medium" style={{ color: "#BA7517" }}>{stats.openTickets}</span>
                    <Sparkline bars={amberBars} color="#EF9F27" />
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: "#FAEEDA", color: "#633806" }}>+3 oggi</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2">
                    <span className="text-xs font-medium text-gray-500 tracking-wide">In lavorazione</span>
                    <span className="text-3xl font-medium" style={{ color: "#534AB7" }}>{stats.workingTickets}</span>
                    <Sparkline bars={purpleBars} color="#7F77DD" />
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: "#EEEDFE", color: "#3C3489" }}>stabile</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2">
                    <span className="text-xs font-medium text-gray-500 tracking-wide">Risolti oggi</span>
                    <span className="text-3xl font-medium" style={{ color: "#3B6D11" }}>{stats.closedTicketsToday}</span>
                    <Sparkline bars={greenBars} color="#639922" />
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: "#EAF3DE", color: "#27500A" }}>ottimo</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2">
                    <span className="text-xs font-medium text-gray-500 tracking-wide">Senza risposta +24h</span>
                    <span className="text-3xl font-medium" style={{ color: "#A32D2D" }}>{stats.withoutAnswerTickets}</span>
                    <div className="h-7 flex items-center">
                        <span className="text-xl" style={{ color: "#E24B4A" }}>⚠</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: "#FCEBEB", color: "#791F1F" }}>richiede attenzione</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">

                {/* Richiede attenzione */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Richiede attenzione</h3>
                    <div className="flex flex-col gap-2">
                        {fakeDetails.attentionTickets.map(ticket => (
                            <div key={ticket.id} className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                    ticket.priority === "high" ? "bg-red-500" :
                                    ticket.priority === "medium" ? "bg-yellow-400" :
                                    "bg-gray-300"
                                }`} />
                                <span className="text-sm text-gray-600 truncate">{ticket.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agenti con carico */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Agenti con carico</h3>
                    <div className="flex flex-col gap-2">
                        {fakeDetails.agents.map(agent => (
                            <div key={agent.id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{agent.name}</span>
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "#EEEDFE", color: "#3C3489" }}>
                                    {agent.workingTickets} ticket
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inviti pendenti */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Inviti pendenti</h3>
                    <div className="flex flex-col gap-2">
                        {fakeDetails.pendingInvitations.map(inv => (
                            <div key={inv.id} className="flex items-center justify-between">
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
                        {fakeDetails.recentFaqs.map(faq => (
                            <div key={faq.id} className="flex items-center gap-2">
                                <span className="text-gray-300 text-xs">—</span>
                                <span className="text-sm text-gray-600">{faq.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Dashboard