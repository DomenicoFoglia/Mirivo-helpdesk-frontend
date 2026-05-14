
const amberBars = [40, 55, 45, 70, 60, 80, 100]

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

const fakeClosedToday = 3

const fakeMyTickets = [
    { id: 1, title: "Errore pagina checkout", status: "working" },
    { id: 2, title: "Reset password non funziona", status: "escalated" },
]

const fakeAvailableTickets = [
    { id: 3, title: "Email di conferma mancante" },
    { id: 4, title: "Impossibile accedere all'account" },
]

function Dashboard() {

    return (
        <div className="p-6">
            <div className="grid grid-cols-4 gap-3">

                <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-2">
                    <span className="text-xs font-medium text-gray-500 tracking-wide">Ticket chiusi oggi</span>
                    <span className="text-3xl font-medium" style={{ color: "#BA7517" }}>{fakeClosedToday}</span>
                    <Sparkline bars={amberBars} color="#EF9F27" />
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit" style={{ background: "#FAEEDA", color: "#633806" }}>+3 oggi</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
                {/* I miei ticket */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">I miei Ticket</h3>
                    <div className="flex flex-col gap-2">
                        {fakeMyTickets.map(ticket => (
                            <div key={ticket.id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{ticket.title}</span>
                                <span 
                                    className="text-xs font-medium px-2 py-0.5 rounded-full" 
                                    style={ ticket.status === 'working'
                                        ? {background: "#EEEDFE", color: "#3C3489"}
                                        : {background: "#FAEEDA", color: "#633806"}
                                    }
                                >
                                    {ticket.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ticekt disponibili */}
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Ticket disponibili</h3>
                    <div className="flex flex-col gap-2">
                        {fakeAvailableTickets.map(ticket => (
                            <div key={ticket.id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{ticket.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard