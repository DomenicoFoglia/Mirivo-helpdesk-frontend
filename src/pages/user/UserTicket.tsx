import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import type { Ticket, Message } from "../../types";
import { userTicketApi } from "../../api/tickets";
import { userTicketGetMessagesApi, userTicketPostMessageApi } from "../../api/messages";
import "./UserTicket.css";
import toast from "react-hot-toast"


function UserTicket(){
    const [ ticket, setTicket] = useState<Ticket>();
    const [ messages, setMessages] = useState<Message[]>([]);
    const [ newMessage, setNewMessage ] = useState("");
    const [ sending, setSending ] = useState(false);
    // Toggle sui dettagli mobile
    const [ showDetails, setShowDetails] = useState(false);

    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if(!id)
                return;
            try{
                const [ ticketRes, messagesRes] = await Promise.all([
                    userTicketApi(id),
                    userTicketGetMessagesApi(id)
                ]);
                setTicket(ticketRes.data);
                setMessages(messagesRes.data.data);
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
            const response = await userTicketPostMessageApi(id, newMessage);
            setMessages(prev => [...prev, response.data]);
            setNewMessage("");
            toast.success('Messaggio inviato');
        }catch {
            toast.error('Errore nell\'invio del messaggio');
        }finally{
            setSending(false);
        }
    };

    // Auto scroll
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (!ticket) return null;

    return (
        <div className="user-ticket-page">
            {/* COLONNA PRINCIPALE */}
            <div className="ticket-main">
                <div className="ticket-header">
                    <h1 className="ticket-title">{ticket.title}</h1>
                    <span className={`status-badge status-${ticket.status}`}>{ticket.status}</span>
                </div>

                <div className="ticket-messages">
                    {messages.length ? (
                        messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`message-bubble ${msg.user_id === ticket.user_id ? "message-own" : "message-agent"}`}
                            >
                                <div className="message-meta">
                                    <span className="message-author">
                                        {msg.user_id === ticket.user_id ? "Tu" : "Supporto"}
                                    </span>
                                    <span className="message-time">
                                        {new Date(msg.created_at).toLocaleString('it-IT')}
                                    </span>
                                </div>
                                <p className="message-body">{msg.body}</p>
                            </div>
                        ))
                    ) : (
                        <p>Nessun messaggio</p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {(ticket.status !== 'closed') && 
                    <div className="ticket-reply">
                        <textarea
                            className="reply-textarea"
                            placeholder="Scrivi un messaggio..."
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            onKeyDown={e => {
                                if( e.key === 'Enter' && !e.shiftKey){
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
                }
                
            </div>

            {/* SIDEBAR INFO */}
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
                                ? <span className={`status-badge priority-${ticket.priority}`}>{ticket.priority}</span>
                                : 'Non assegnata'
                            }
                        </span>
                    </div>

                    <div className="sidebar-field">
                        <span className="field-label">Tecnico</span>
                        <span className="field-value">
                            {ticket.assignee?.name || 'In attesa di assegnazione'}
                        </span>
                    </div>

                    <div className="sidebar-field">
                        <span className="field-label">Categoria</span>
                        <span className="field-value">
                            {ticket.category?.name}
                        </span>
                    </div>

                    <div className="sidebar-field">
                        <span className="field-label">Creato il</span>
                        <span className="field-value">
                            {new Date(ticket.created_at).toLocaleDateString('it-IT')}
                        </span>
                    </div>

                    <div className="sidebar-field">
                        <span className="field-label">Ultimo aggiornamento</span>
                        <span className="field-value">
                            {new Date(ticket.updated_at).toLocaleDateString('it-IT')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserTicket;