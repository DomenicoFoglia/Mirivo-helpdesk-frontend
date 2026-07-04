import { useState, useEffect } from "react"
import { statsApi, detailsApi } from "../../api/adminDashboard"
import type { AdminDashboardDetails } from "../../types"
import useAuthStore from "../../store/authStore"
import { Link } from "react-router-dom"
import "./Dashboard.css"

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
        <div className="admin-dashboard">

            {/* Titolo */}
            <div>
                <h1 className="admin-dashboard-title">Benvenuto, {user?.name}</h1>
                <p className="admin-dashboard-company">{user?.company?.name}</p>
            </div>

            {/* Layout principale: metriche a lato su desktop, in cima su mobile */}
            <div className="admin-dashboard-layout">

                {/* Colonna metriche */}
                <div className="admin-metrics">

                    {/* Card critica */}
                    <div className="admin-metric-card critical">
                        <span className="admin-metric-label">Senza risposta +24h</span>
                        <span className="admin-metric-value large danger">{stats.withoutAnswerTickets}</span>
                        {stats.withoutAnswerTickets > 0 && (
                            <div className="admin-metric-alert">
                                <span className="admin-metric-alert-icon">⚠</span>
                                <span className="admin-metric-alert-badge">richiede attenzione</span>
                            </div>
                        )}
                    </div>

                    <div className="admin-metric-card">
                        <span className="admin-metric-label">Ticket aperti</span>
                        <span className="admin-metric-value warning">{stats.openTickets}</span>
                    </div>

                    <div className="admin-metric-card">
                        <span className="admin-metric-label">In lavorazione</span>
                        <span className="admin-metric-value working">{stats.workingTickets}</span>
                    </div>

                    <div className="admin-metric-card">
                        <span className="admin-metric-label">Risolti oggi</span>
                        <span className="admin-metric-value success">{stats.closedTicketsToday}</span>
                    </div>

                </div>

                {/* Card dettaglio */}
                <div className="admin-details-grid">

                    {/* Richiede attenzione */}
                    <div className="admin-detail-card">
                        <h3 className="admin-detail-title">Richiede attenzione</h3>
                        <div className="admin-detail-body">
                            {details.attentionTickets.length === 0 && (
                                <p className="admin-detail-empty">Nessun ticket critico</p>
                            )}
                            {details.attentionTickets.map(ticket => (
                                <Link to={`/admin/ticket/${ticket.id}`} key={ticket.id} className="admin-detail-row clickable">
                                    <span className="admin-detail-row-left">
                                        <span className={`admin-priority-dot ${ticket.priority}`} />
                                        <span className="admin-detail-text">{ticket.title}</span>
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Agenti con carico */}
                    <div className="admin-detail-card">
                        <h3 className="admin-detail-title">Agenti con carico</h3>
                        <div className="admin-detail-body">
                            {details.agents.length === 0 && (
                                <p className="admin-detail-empty">Nessun agente</p>
                            )}
                            {details.agents.map(agent => (
                                <div key={agent.id} className="admin-detail-row">
                                    <span className="admin-detail-text">{agent.name}</span>
                                    <span className="admin-badge load">
                                        {agent.assignee_tickets_count} ticket
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inviti pendenti */}
                    <div className="admin-detail-card">
                        <h3 className="admin-detail-title">Inviti pendenti</h3>
                        <div className="admin-detail-body">
                            {details.pendingInvitations.length === 0 && (
                                <p className="admin-detail-empty">Nessun invito pendente</p>
                            )}
                            {details.pendingInvitations.map(inv => (
                                <div key={inv.email} className="admin-detail-row">
                                    <span className="admin-detail-text">{inv.email}</span>
                                    <span className="admin-badge role">
                                        {inv.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ recenti */}
                    <div className="admin-detail-card">
                        <h3 className="admin-detail-title">FAQ recenti</h3>
                        <div className="admin-detail-body">
                            {details.recentFaqs.length === 0 && (
                                <p className="admin-detail-empty">Nessuna FAQ</p>
                            )}
                            {details.recentFaqs.map(faq => (
                                <div key={faq.id} className="admin-detail-row">
                                    <span className="admin-detail-row-left">
                                        <span className="admin-faq-dash">–</span>
                                        <span className="admin-detail-text">{faq.question}</span>
                                    </span>
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