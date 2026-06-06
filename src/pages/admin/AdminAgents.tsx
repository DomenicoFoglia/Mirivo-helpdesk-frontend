import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsersApi } from '../../api/users';
import type { User } from '../../types';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import './AdminTicketList.css';


function AdminAgents() {
    // Array di tecnici ricevuti dal backend, popolato dopo il fectch
    const [agents, setAgents] = useState<User[]>([]);
    // Controlla lo spinner
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Filtri
    // valore digitato nel campo input (cambia ad ogni tasto)
    const [searchInput, setSearchInput] = useState('');
    // Valore 'confermato' dalla ricerca (cambia solo al click su 'Cerca' o Invio)
    const [search, setSearch] = useState('');
    // Valore del filtro Level, fa scattare il fetch
    const [level, setLevel] = useState('');

    // Paginazione
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchAgents = async () => {
            setLoading(true);
            try {
                const res = await getUsersApi({
                    role: 'agent',
                    page: currentPage,
                    search: search || undefined,
                    level: level ? Number(level) : undefined,
                });
                setAgents(res.data);
                setCurrentPage(res.current_page);
                setLastPage(res.last_page);
                setTotal(res.total);
            } catch {
                toast.error('Impossibile caricare i tecnici', { id: 'agents-load-error' });
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, [currentPage, search, level]);

    return (
        <div className="ticket-list-page">
            <h1>Tecnici</h1>

            <div className="ticket-list-filters">
                <select value={level} onChange={e => { setLevel(e.target.value); setCurrentPage(1); }}>
                    <option value="">Tutti i livelli</option>
                    <option value="1">L1</option>
                    <option value="2">L2</option>
                </select>

                <input
                    type="text"
                    placeholder="Cerca per nome o email..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            setSearch(searchInput);
                            setCurrentPage(1);
                        }
                    }}
                />
                <button onClick={() => { setSearch(searchInput); setCurrentPage(1); }}>Cerca</button>
            </div>

            {!loading && <p className="ticket-list-count">{total} tecnico/i trovato/i</p>}

            {loading ? (
                <Spinner />
            ) : agents.length === 0 ? (
                <p className="ticket-list-empty">Nessun tecnico trovato.</p>
            ) : (
                <>
                    <table className="ticket-list-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Cognome</th>
                                <th>Email</th>
                                <th>Livello</th>
                                <th>Data Iscrizione</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.map(agent => (
                                <tr
                                    key={agent.id}
                                    onClick={() => navigate(`/admin/users/${agent.id}`)}
                                >
                                    <td data-label="Nome">{agent.name}</td>
                                    <td data-label="Cognome">{agent.surname}</td>
                                    <td data-label="Email">{agent.email}</td>
                                    <td data-label="Livello">
                                        <span className={`priority-badge priority-${agent.level === 1 ? 'medium' : 'high'}`}>
                                            L{agent.level}
                                        </span>
                                    </td>
                                    <td data-label="Data Iscrizione">
                                        {agent.created_at
                                            ? new Date(agent.created_at).toLocaleDateString('it-IT')
                                            : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {lastPage > 1 && (
                        <div className="ticket-list-pagination">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                Precedente
                            </button>
                            <span>Pagina {currentPage} di {lastPage}</span>
                            <button
                                disabled={currentPage === lastPage}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Successivo
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default AdminAgents;