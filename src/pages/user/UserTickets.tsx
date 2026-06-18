import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'
import { userTicketListApi } from '../../api/tickets'
import type { Ticket } from '../../types'
import Spinner from '../../components/Spinner'
import './UserTickets.css'

type TabValue = 'all' | 'open' | 'closed'

function UserTickets(){
    const navigate = useNavigate();

    const [ tickets, setTickets ] = useState<Ticket[]>([]);
    const [ loading, setLoading ] = useState(false);
    const [ activeTab, setActiveTab ] = useState<TabValue>('all');
    const [ searchInput, setSearchInput ] = useState('');
    const [ debouncedSearch, setDebouncedSearch ] = useState('');
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ lastPage, setLastPage ] = useState(1);
    const [ total, setTotal ] = useState(0);

    //debounce input ricerca
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    // fetch sul cambio filtro
    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);

            try {
                const res = await userTicketListApi({
                    page: currentPage,
                    state: activeTab !== 'all' ? activeTab : undefined,
                    search: debouncedSearch || undefined,
                });
                setTickets(res.data);
                setLastPage(res.last_page);
                setTotal(res.total);
            } catch (err) {
                console.error('Errore caricamento ticket:', err);
                toast.error('Errore caricamento ticket');
            } finally {
                setLoading(false);
            }
        }
        fetchTickets()
    }, [ currentPage, activeTab, debouncedSearch ]);

    const handleTabChange = (tab: TabValue) => {
        setActiveTab(tab)
        setCurrentPage(1)
    }

    const statusBadge = (status: string) => {
        const map: Record<string, { label: string, bg: string, color: string }> = {
            open: { label: 'Aperto', bg: 'rgba(245, 158, 11, 0.15)', color: '#d97706' },
            working: { label: 'In lavorazione', bg: 'rgba(139, 92, 246, 0.15)', color: '#7c3aed' },
            escalated: { label: 'Escalation', bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626' },
            closed: { label: 'Chiuso', bg: 'rgba(107, 114, 128, 0.18)', color: '#6b7280' },
        }
        const s = map[status] ?? map.open
        return <span className="user-tickets-badge" style={{ background: s.bg, color: s.color }}>{s.label}</span>
    }


    return (
        <div className="user-tickets-page">
            <div className="user-tickets-header">
                <h1>I miei ticket</h1>
                <p className="user-tickets-count">{total} {total === 1 ? 'ticket' : 'ticket'} totali</p>
            </div>

            <div className="user-tickets-toolbar">
                <div className="user-tickets-tabs">
                <button
                    className={`user-tickets-tab ${activeTab === 'all' ? 'is-active' : ''}`}
                    onClick={() => handleTabChange('all')}
                >
                    Tutti
                </button>
                <button
                    className={`user-tickets-tab ${activeTab === 'open' ? 'is-active' : ''}`}
                    onClick={() => handleTabChange('open')}
                >
                    Aperti
                </button>
                <button
                    className={`user-tickets-tab ${activeTab === 'closed' ? 'is-active' : ''}`}
                    onClick={() => handleTabChange('closed')}
                >
                    Chiusi
                </button>
                </div>

                <div className="user-tickets-search">
                <Search size={16} />
                <input
                    type="text"
                    placeholder="Cerca per titolo..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                </div>
            </div>

            {loading ? (
                <Spinner />
            ) : tickets.length === 0 ? (
                <div className="user-tickets-empty">
                {debouncedSearch || activeTab !== 'all'
                    ? 'Nessun ticket trovato con questi filtri'
                    : 'Non hai ancora aperto ticket'}
                </div>
            ) : (
                <>
                <ul className="user-tickets-list">
                    {tickets.map((t) => (
                    <li
                        key={t.id}
                        className="user-tickets-item"
                        onClick={() => navigate(`/user/ticket/${t.id}`)}
                    >
                        <div className="user-tickets-item-main">
                        <span className="user-tickets-item-title">{t.title}</span>
                        {t.category && (
                            <span className="user-tickets-item-category">{t.category.name}</span>
                        )}
                        </div>
                        <div className="user-tickets-item-meta">
                        {statusBadge(t.status)}
                        <span className="user-tickets-item-date">
                            {new Date(t.created_at).toLocaleDateString('it-IT')}
                        </span>
                        </div>
                    </li>
                    ))}
                </ul>

                {lastPage > 1 && (
                    <div className="user-tickets-pagination">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                    >
                        Precedente
                    </button>
                    <span>Pagina {currentPage} di {lastPage}</span>
                    <button
                        disabled={currentPage === lastPage}
                        onClick={() => setCurrentPage((p) => p + 1)}
                    >
                        Successiva
                    </button>
                    </div>
                )}
                </>
            )}
        </div>
    )

}

export default UserTickets;