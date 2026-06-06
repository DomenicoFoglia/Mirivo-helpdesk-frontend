import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsersApi } from '../../api/users';
import type { User } from '../../types';
import Spinner from '../../components/Spinner';
import toast from 'react-hot-toast';
import './AdminTicketList.css';

function AdminEndUsers() {
    // Array di utenti ricevuti dal backend, popolato dopo il fectch
    const [users, setUsers] = useState<User[]>([]);
    // Controlla lo spinner
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Filtri
    // valore digitato nel campo input (cambia ad ogni tasto)
    const [searchInput, setSearchInput] = useState('');
    // Valore 'confermato' dalla ricerca (cambia solo al click su 'Cerca' o Invio)
    const [search, setSearch] = useState('');

    // Paginazione
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const res = await getUsersApi({
                    role: 'user',
                    page: currentPage,
                    search: search || undefined,
                });
                setUsers(res.data);
                setCurrentPage(res.current_page);
                setLastPage(res.last_page);
                setTotal(res.total);
            } catch {
                toast.error('Impossibile caricare gli  utenti', { id: 'users-load-error' });
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentPage, search]);

    return (
        <div className="ticket-list-page">
            <h1>Utenti</h1>

            <div className="ticket-list-filters">
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

            {!loading && <p className="ticket-list-count">{total} utente/i trovato/i</p>}

            {loading ? (
                <Spinner />
            ) : users.length === 0 ? (
                <p className="ticket-list-empty">Nessun utente trovato.</p>
            ) : (
                <>
                    <table className="ticket-list-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Cognome</th>
                                <th>Email</th>
                                <th>Data Iscrizione</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    onClick={() => navigate(`/admin/users/${user.id}`)}
                                >
                                    <td data-label="Nome">{user.name}</td>
                                    <td data-label="Cognome">{user.surname}</td>
                                    <td data-label="Email">{user.email}</td>
                                    <td data-label="Data Iscrizione">
                                        {user.created_at
                                            ? new Date(user.created_at).toLocaleDateString('it-IT')
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

export default AdminEndUsers;