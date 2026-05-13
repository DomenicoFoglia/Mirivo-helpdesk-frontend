import { useState, useEffect } from "react"
import { statsApi } from "../../api/adminDashboard";


function Dashboard() {
    const [stats, setStats] = useState({
        openTickets: 0,
        workingTickets: 0,
        closedTicketsToday: 0,
        withoutAnswerTickets: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try{
                const response = await statsApi();
                setStats(response.data);
                // const {openTickets, workingTickets, closedTicketsToday, withoutAnswerTickets} = response.data;
            }catch(error){
                console.error(error);
            }
        }
        fetchStats();
    }, [])


    return (
        <div className="dashboard">
            <div className="metrics">
                <div className="metric-card">
                    <span className="metric-label">Ticket aperti</span>
                    <span className="metric-value">{stats.openTickets}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">In lavorazione</span>
                    <span className="metric-value">{stats.workingTickets}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Risolti oggi</span>
                    <span className="metric-value">{stats.closedTicketsToday}</span>
                </div>
                <div className="metric-card">
                    <span className="metric-label">Senza risposta +24h</span>
                    <span className="metric-value">{stats.withoutAnswerTickets}</span>
                </div>
            </div>
        </div>
    )
}

export default Dashboard