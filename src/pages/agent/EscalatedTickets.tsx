import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import type { Ticket } from "../../types";
import { escalatedAvailableApi, assignEscalatedApi } from "../../api/tickets";
import toast from "react-hot-toast"
import "./EscalatedTickets.css";


function EscalatedTickets (){

    const [ tickets, setTickets ] = useState<Ticket[]>([]);
    const [ loading, setLoading ] = useState(false);
    // Stato per il loading del bottone 'Prendi in carico'
    const [ assigning, setAssigning ] = useState<Set<number>>(new Set());

    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try{
                const data = await escalatedAvailableApi(user?.role === 'admin' ? 'admin' : 'agent');
                setTickets(data.data);
            }catch{
                toast.error('Errore nel recupero dei ticket dal server');
            }finally{
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleAssign = async (id: number) => {
        if(assigning.has(id))
            return;
        setAssigning(prev => new Set(prev).add(id));
        try{
            await assignEscalatedApi(String(id));
            setTickets(prev => prev.filter(t => t.id !== id));
            toast.success(
                (t) => (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <span style={{ fontWeight: 500 }}>Ticket preso in carico</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: 'var(--accent)', color: 'var(--bg-primary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
                                onClick={() => { navigate(`/${user?.role}/ticket/${id}`); toast.dismiss(t.id) }}
                            >
                                Vai al ticket
                            </button>
                            <button
                                style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.85rem' }}
                                onClick={() => toast.dismiss(t.id)}
                            >
                                Resta qui
                            </button>
                        </div>
                    </div>
                ),
                { duration: Infinity }
            )
        }catch{
            toast.error('Errore nella presa in carico del ticket');
        }finally{
            setAssigning(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    }


    return (
        <div className="escalated-tickets">
            <div className="escalated-tickets-header">
                <h1>Ticket scalati</h1>
                <span>{tickets.length} ticket in attesa</span>
            </div>

            {loading && <p className="escalated-tickets-loading">Caricamento...</p>}

            {!loading && tickets.length === 0 && (
                <p className="escalated-tickets-empty">Nessun ticket scalato disponibile.</p>
            )}

            {!loading && tickets.length > 0 && (
                <table className="escalated-tickets-table">
                    <thead>
                        <tr>
                            <th>Titolo</th>
                            <th>Autore</th>
                            <th>Priorità</th>
                            <th>Categoria</th>
                            <th>Data apertura</th>
                            {/* Colonna azioni visibile solo a L2 */}
                            {user?.level === 2 && <th>Azioni</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td
                                    className="ticket-title-cell"
                                    data-label="Titolo"
                                    onClick={() => navigate(`/${user?.role}/ticket/${ticket.id}`)}
                                >
                                    {ticket.title}
                                </td>
                                <td data-label="Autore">{`${ticket.user?.name} ${ticket.user?.surname}`}</td>
                                <td data-label="Priorità">
                                    <span className={`priority-badge priority-${ticket.priority ?? 'low'}`}>
                                        {ticket.priority ?? 'Non assegnata'}
                                    </span>
                                </td>
                                <td data-label="Categoria">{ticket.category?.name}</td>
                                <td data-label="Data apertura">{new Date(ticket.created_at).toLocaleDateString('it-IT')}</td>
                                {user?.level === 2 && (
                                    <td data-label="Azioni">
                                        <button
                                            className="assign-btn"
                                            onClick={() => {handleAssign(ticket.id)}}
                                            disabled={assigning.has(ticket.id)}
                                        >
                                            Prendi in carico
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    )


}

export default EscalatedTickets;