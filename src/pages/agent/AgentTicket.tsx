import { useState, useEffect, useRef } from "react";
import useAuthStore from "../../store/authStore";
import { useParams } from "react-router-dom";
import type { Ticket, Message } from "../../types";
import { agentTicketApi, changeStatus, escalateTicket, changePriority } from "../../api/tickets";
import { ticketGetMessagesApi, ticketPostMessageApi } from "../../api/messages";
import "./AgentTicket.css";
import toast from "react-hot-toast"


function AgentTicket(){
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
    // Utente da store Zustand
    const user = useAuthStore(state => state.user)
    
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if(!id)
                return;
            try{
                const [ ticketRes, messagesRes] = await Promise.all([
                    agentTicketApi(id),
                    ticketGetMessagesApi(id, 'agent')
                ]);
                setTicket(ticketRes.data);
                setMessages(messagesRes.data.data);
                setStatus(ticketRes.data.status);
                setPriority(ticketRes.data.priority);
            }catch {
                toast.error('Impossibile caricare il ticket', { id: 'ticket-load-error' });
            }
        }
        fetchData()
    }, [id]);


    const handleSendMessage = async () =>{
        // trim() elimina spazi vuoti a inizio e fine messaggio e altri spazi vuoti come le tabulazioni
        if (!id || !newMessage.trim()) return;
        setSending(true);
        try{
            const response = await ticketPostMessageApi(id, newMessage, activeTab, 'agent');
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
            const response = await changeStatus(id, status, 'agent');
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
            const response = await escalateTicket(id, 'agent');
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
            const response = await changePriority(id, priority, 'agent');
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
                        messages.filter(m => m.type === activeTab).map(msg => (
                            <div
                                key={msg.id}
                                className={`message-bubble ${msg.user_id === ticket.assignee_id ? "message-own" : "message-user"}`}
                            >
                                <div className="message-meta">
                                    <span className="message-author">
                                        {msg.user_id === ticket.assignee_id ? "Tu" : "Utente"}
                                    </span>
                                    <span className="message-time">
                                        {new Date(msg.created_at).toLocaleString('it-IT')}
                                    </span>
                                </div>
                                <p className="message-body">{msg.body}</p>
                            </div>
                        ))
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
                            disabled={changingStatus || ticket.assignee_id !== user?.id}
                        >
                            <option value="open">Open</option>
                            <option value="working">Working</option>
                        </select>
                        <button
                            className="action-btn"
                            onClick={handleChangeStatus}
                            disabled={changingStatus || ticket.assignee_id !== user?.id}
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
                            disabled={changingPriority || ticket.assignee_id !== user?.id}
                        >
                            <option value="">Non assegnata</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                        <button
                            className="action-btn"
                            onClick={handlePriority}
                            disabled={changingPriority || ticket.assignee_id !== user?.id}
                        >
                            {changingPriority ? 'Salvataggio...' : 'Salva'}
                        </button>
                    </div>

                    {/* ESCALATE - solo L1 */}
                    {user?.level === 1  && (
                        <div className="sidebar-field">
                            <button
                                className="action-btn escalate-btn"
                                onClick={handleEscalate}
                                disabled={escalating || ticket.assignee_id !== user?.id}
                            >
                                {escalating ? 'Escalation...' : 'Scala al L2'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AgentTicket;