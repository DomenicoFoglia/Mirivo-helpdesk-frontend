import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import type { Ticket, Message } from "../../types";
import { adminTicketApi, changeStatus, escalateTicket, changePriority } from "../../api/tickets";
import { ticketGetMessagesApi, ticketPostMessageApi } from "../../api/messages";
import "../agent/AgentTicket.css";
import toast from "react-hot-toast";
import Spinner from "../../components/Spinner";
import NotFound from "../NotFound";
import { WifiOff } from "lucide-react";
import axios from "axios";


function AdminTicket(){
    const [ ticket, setTicket] = useState<Ticket>();
    const [ messages, setMessages] = useState<Message[]>([]);
    const [ newMessage, setNewMessage ] = useState("");
    const [ sending, setSending ] = useState(false);
    // Toggle sui dettagli mobile
    const [ showDetails, setShowDetails] = useState(false);
    // Stato per la scelta del tab da visualizzare
    const [ activeTab, setActiveTab] = useState<'public'|'private'>('public');
    // Stati per cambio 'status' e loading durante la chiamaata API
    const [ status, setStatus] = useState('');
    const [ changingStatus, setChangingStatus] = useState(false);
    // Stati per cambio priorita'
    const [ priority, setPriority] = useState('');
    const [ changingPriority, setChangingPriority] = useState(false);
    // Stato per escalation e loading duante la chiamata API
    const [ escalating, setEscalating] = useState(false);
    // Stati spinner e notfound
    const [ loading, setLoading ] = useState(true);
    const [ notFound, setNotFound ] = useState(false);
    // Stato per gestire errori(inline)
    const [ error, setError ] = useState(false);
    // Utente da store Zustand
    const user = useAuthStore(state => state.user);
    
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if(!id)
                return;
            try{
                const [ ticketRes, messagesRes] = await Promise.all([
                    adminTicketApi(id),
                    ticketGetMessagesApi(id, 'admin')
                ]);
                setTicket(ticketRes.data);
                setMessages(messagesRes.data.data);
                setStatus(ticketRes.data.status);
                setPriority(ticketRes.data.priority);
            }catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setNotFound(true);
                } else {
                    setError(true);
                    toast.error('Impossibile caricare il ticket', { id: 'ticket-load-error' });
                }
            } finally {
                setLoading(false);
            }
        }
        fetchData()
    }, [id]);


    const handleSendMessage = async () =>{
        // trim() elimina spazi vuoti a inizio e fine messaggio e altri spazi vuoti come le tabulazioni
        if (!id || !newMessage.trim()) return;
        setSending(true);
        try{
            const response = await ticketPostMessageApi(id, newMessage, activeTab, 'admin');
            setMessages(prev => [...prev, response.data]);
            setNewMessage("");
            toast.success('Messaggio inviato');
        }catch {
            toast.error('Errore nell\'invio del messaggio');
        }finally{
            setSending(false);
        }
    };

    const handleChangeStatus = async () => {
        if (!id) return;
        setChangingStatus(true);
        try{
            const response = await changeStatus(id, status, 'admin');
            setStatus(response.data.status);
            toast.success('Stato aggiornato');
        }catch {
            toast.error('Errore nel cambio stato');
        }finally{
            setChangingStatus(false);
        }
    }

    const handleEscalate = async () => {
        if(!id || !ticket) return;
        setEscalating(true);
        try{
            const response = await escalateTicket(id, 'admin');
            setTicket({...ticket, status: response.data.status, assignee: response.data.assignee});
            toast.success('Ticket scalato al L2');
        }catch {
            toast.error('Errore nell\'escalation');
        }finally{
            setEscalating(false);
        }
    }

    // Cambio priorita'
    const handlePriority = async () => {
        if(!id || !ticket) return;
        setChangingPriority(true);
        try{
            const response = await changePriority(id, priority, 'admin');
            setPriority(response.data.priority);
            toast.success('Priorità aggiornata');
        }catch {
            toast.error('Errore nel cambio priorità');
        }finally{
            setChangingPriority(false);
        }
    }

    // Auto scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (loading) return <Spinner />;
    if (notFound) return <NotFound />;
    if (error) return (
    <div className="ticket-error">
        <WifiOff size={48} className="ticket-error-icon" />
        <h2 className="ticket-error-title">Impossibile caricare il ticket</h2>
        <p className="ticket-error-message">Verifica la connessione e riprova.</p>
    </div>
    );
    if (!ticket) return null;

    return (
        <div className="agent-ticket-page">
            {/* COLONNA PRINCIPALE */}
            <div className="ticket-main">
                <div className="ticket-header">
                    <h1 className="ticket-title">{ticket.title}</h1>
                    <span className={`status-badge status-${ticket.status}`}>{ticket.status}</span>
                </div>

                {/* TAB SWITCHER */}
                <div className="ticket-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'public' ? 'active' : ''}`}
                        onClick={() => setActiveTab('public')}
                    >
                        Pubblico
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'private' ? 'active' : ''}`}
                        onClick={() => setActiveTab('private')}
                    >
                        Privato
                    </button>
                </div>

                {/* MESSAGGI */}
                <div className="ticket-messages">
                    {messages.filter(m => m.type === activeTab).length ? (
                        messages.filter(m => m.type === activeTab).map(msg => {
                            const isMine = msg.user_id === user?.id;
                            const roleLabel = msg.user?.role === 'admin' ? 'Admin'
                                : msg.user?.role === 'agent' ? 'Agente'
                                : 'Utente';

                            return (
                                <div
                                    key={msg.id}
                                    className={`message-bubble ${isMine ? "message-own" : "message-user"}`}
                                >
                                    <div className="message-meta">
                                        {!isMine && msg.user && (
                                            <span className="message-author">
                                                {msg.user.name} {msg.user.surname} · {roleLabel}
                                            </span>
                                        )}
                                        {msg.type === 'private' && (
                                            <span className="message-badge-private">Nota interna</span>
                                        )}
                                        <span className="message-time">
                                            {new Date(msg.created_at).toLocaleString('it-IT')}
                                        </span>
                                    </div>
                                    <p className="message-body">{msg.body}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p className="ticket-empty">Nessun messaggio</p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* AREA RISPOSTA */}
                {ticket.status !== 'closed' && (
                    <div className="ticket-reply">
                        <textarea
                            className="reply-textarea"
                            placeholder={activeTab === 'private' ? 'Scrivi una nota privata...' : 'Scrivi un messaggio...'}
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            rows={3}
                        />
                        <button
                            className="reply-btn"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim() || sending}
                        >
                            {sending ? "Invio..." : "Invia"}
                        </button>
                    </div>
                )}
            </div>

            {/* SIDEBAR */}
            <div className="ticket-sidebar">
                <button className="details-toggle" onClick={() => setShowDetails(prev => !prev)}>
                    Dettagli {showDetails ? '▲' : '▼'}
                </button>
                <h2 className="sidebar-title">Dettagli</h2>

                <div className={`sidebar-content ${!showDetails ? 'collapsed' : ''}`}>
                    <div className="sidebar-field">
                        <span className="field-label">Stato</span>
                        <span className="field-value">
                            <span className={`status-badge status-${ticket.status}`}>{ticket.status}</span>
                        </span>
                    </div>

                    <div className="sidebar-field">
                        <span className="field-label">Priorità</span>
                        <span className="field-value">
                            {ticket.priority
                                ? <span className={`status-badge priority-badge priority-${ticket.priority}`}>{ticket.priority}</span>
                                : 'Non assegnata'
                            }
                        </span>
                    </div>

                    <div className="sidebar-field">
                        <span className="field-label">Tecnico</span>
                        <span className="field-value">{ticket.assignee?.name || 'In attesa di assegnazione'}</span>
                    </div>

                    <div className="sidebar-field">
                        <span className="field-label">Categoria</span>
                        <span className="field-value">{ticket.category?.name}</span>
                    </div>

                    <div className="sidebar-field">
                        <span className="field-label">Creato il</span>
                        <span className="field-value">{new Date(ticket.created_at).toLocaleDateString('it-IT')}</span>
                    </div>

                    <div className="sidebar-field">
                        <span className="field-label">Ultimo aggiornamento</span>
                        <span className="field-value">{new Date(ticket.updated_at).toLocaleDateString('it-IT')}</span>
                    </div>

                    {/* CAMBIO STATUS */}
                    <div className="sidebar-field">
                        <span className="field-label">Cambia stato</span>
                        <select
                            className="status-select"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                            // disabled={changingStatus || ticket.assignee_id !== user?.id}
                        >
                            <option value="open">Open</option>
                            <option value="working">Working</option>
                        </select>
                        <button
                            className="action-btn"
                            onClick={handleChangeStatus}
                            // disabled={changingStatus || ticket.assignee_id !== user?.id}
                        >
                            {changingStatus ? 'Salvataggio...' : 'Salva'}
                        </button>
                    </div>

                    {/* CAMBIO PRIORITÀ */}
                    <div className="sidebar-field">
                        <span className="field-label">Cambia priorità</span>
                        <select
                            className="status-select"
                            value={priority ?? ''}
                            onChange={e => setPriority(e.target.value)}
                            // disabled={changingPriority || ticket.assignee_id !== user?.id}
                        >
                            <option value="">Non assegnata</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button
                            className="action-btn"
                            onClick={handlePriority}
                            // disabled={changingPriority || ticket.assignee_id !== user?.id}
                        >
                            {changingPriority ? 'Salvataggio...' : 'Salva'}
                        </button>
                    </div>

                    {/* ESCALATE*/}
                    <div className="sidebar-field">
                        <button
                            className="action-btn escalate-btn"
                            onClick={handleEscalate}
                            // disabled={escalating || ticket.assignee_id !== user?.id}
                        >
                            {escalating ? 'Escalation...' : 'Scala al L2'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default AdminTicket;