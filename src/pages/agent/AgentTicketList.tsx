import { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import { categoriesApi, ticketListApi } from "../../api/tickets";
import { useNavigate } from "react-router-dom";
import type { Ticket } from "../../types";
import toast from "react-hot-toast";
import '../admin/AdminTicketList.css';
import type { Category } from "../../types";


function AgentTicketList(){
    const [ tickets, setTickets ] = useState<Ticket[]>([]);
    const [ loading, setLoading ] = useState(true);
    const navigate = useNavigate();
    // Stati per la ricerca
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [search, setSearch] = useState('');          // valore applicato (triggera il fetch)
    const [searchInput, setSearchInput] = useState(''); // valore digitato nel campo
    const [categories, setCategories] = useState<Category[]>([]);   // lista categorie dal backend
    // Stati per paginazione
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try{
                const res = await ticketListApi('agent', {
                    status: status || undefined,
                    priority: priority || undefined,
                    category_id: categoryId ? Number(categoryId) : undefined,
                    search: search || undefined,
                    page: currentPage,
                });
                setTickets(res.data);
                setCurrentPage(res.current_page);
                setLastPage(res.last_page);
                setTotal(res.total);
            }catch{
                toast.error('Impossibile caricare i ticket', { id: 'ticket-load-error' });
            }finally{
                setLoading(false);
            }
        }
        fetchTickets();
    }, [status, priority, categoryId, search, currentPage]) //Quando queste cambiano useEffect riparte
    
    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const res = await categoriesApi('agent');
                setCategories(res);
            }catch{
                
            }
        }
        fetchCategories();
    }, []);


    // if (loading) return <Spinner />;

    return (
        <div className="ticket-list-page">
            <h1>I miei ticket</h1>

            <div className="ticket-list-filters">
                <select value={status} onChange={e => { setStatus(e.target.value); setCurrentPage(1); }}>
                    <option value="">Tutti gli stati</option>
                    <option value="open">Aperto</option>
                    <option value="working">In lavorazione</option>
                    <option value="escalated">Escalato</option>
                    <option value="closed">Chiuso</option>
                </select>

                <select value={priority} onChange={e => { setPriority(e.target.value); setCurrentPage(1); }}>
                    <option value="">Tutte le priorità</option>
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Bassa</option>
                </select>

                <select value={categoryId} onChange={e => { setCategoryId(e.target.value); setCurrentPage(1); }}>
                    <option value="">Tutte le categorie</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Cerca per titolo..."
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => {
                        if(e.key === 'Enter'){
                            setSearch(searchInput);
                            setCurrentPage(1);
                        }  
                    }}
                />
                <button onClick={() => { setSearch(searchInput); setCurrentPage(1); }}>Cerca</button>
            </div>

            {!loading && <p className="ticket-list-count">{total} ticket trovati</p>}

            {loading ? (
                <Spinner />
            ) :tickets.length === 0 ? (
                <p className="ticket-list-empty">Nessun ticket trovato.</p>
            ) : (
                <>
                <table className="ticket-list-table">
                    <thead>
                        <tr>
                            <th>Titolo</th>
                            <th>Stato</th>
                            <th>Priorità</th>
                            <th>Categoria</th>
                            <th>Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tickets.map(ticket => (
                                <tr key={ticket.id} onClick={() => navigate(`/agent/ticket/${ticket.id}`)}>
                                    <td data-label="Titolo">{ticket.title}</td>
                                    <td data-label="Stato">
                                        <span className={`status-badge status-${ticket.status}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td data-label="Priorità">
                                        {ticket.priority 
                                            ? <span className={`priority-badge priority-${ticket.priority}`}>{ticket.priority}</span>
                                            : <span className="priority-none">Nessuna</span>
                                        }
                                    </td>
                                    <td data-label="Categoria">{ticket.category?.name}</td>
                                    <td data-label="Data">{new Date(ticket.created_at).toLocaleString('it-IT')}</td>
                                </tr>
                            ))
                        }
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

export default AgentTicketList;