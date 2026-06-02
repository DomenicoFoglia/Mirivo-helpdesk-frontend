import { useState, useEffect, useCallback } from "react";
import type { Invitation } from "../../types";
import { createInvitationApi, deleteInvitationApi, invitationListApi } from "../../api/invitations";
import toast from "react-hot-toast";
import { Send, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Spinner from '../../components/Spinner';
import './Invitation.css'

function getInvitationStatus(inv: Invitation): 'accepted' | 'expired' | 'pending' {
    if (inv.accepted_at) return 'accepted';
    if (new Date(inv.expires_at) < new Date()) return 'expired';
    return 'pending';
}

function Invitations(){
    const [ invitations, setInvitations ] = useState<Invitation[]>([]);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ lastPage, setLastPage ] = useState(1);
    const [ total, setTotal ] = useState(0);
    const [ loading, setLoading ] = useState(true);
    const [ email, setEmail ] = useState('');
    const [ role, setRole ] = useState<'agent' | 'user'>('user');
    const [ busy, setBusy ] = useState(false);


    const fetchInvitations = useCallback(async () => {
            // setLoading(true);
            try{
                const res = await invitationListApi(currentPage);
                setInvitations(res.data);
                setLastPage(res.last_page);
                setTotal(res.total);
                // setCurrentPage(res.current_page);
            }
            catch{
                toast.error("Errore nel caricamento degli inviti");
            }finally{
                setLoading(false);
            }
        }, [currentPage]);

    useEffect(() => {
        fetchInvitations();
    },[fetchInvitations]);

    const handleCreate = async () =>{
        if(!email.trim() || busy === true) return;

        setBusy(true);

        try{
            await createInvitationApi(email.trim(), role);
            
            await fetchInvitations();
            setEmail('');
            toast.success('Invito creato con successo');
        }catch{
            toast.error('Errore nella creazione dell invito');
        }finally{
            setBusy(false);
        }
    }

    const handleDelete = async (id: number) => {
        toast((t) => (
            <div>
                <p>Eliminare questo invito?</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                        style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setBusy(true);
                            try {
                                await deleteInvitationApi(id);
                                await fetchInvitations();
                                toast.success('Invito eliminato con successo');
                            } catch {
                                toast.error("Errore nell'eliminazione dell invito");
                            } finally {
                                setBusy(false);
                            }
                        }}
                    >Conferma</button>
                    <button
                        style={{ padding: '4px 12px', background: '#e5e7eb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={() => toast.dismiss(t.id)}
                    >Annulla</button>
                </div>
            </div>
        ), { duration: Infinity });
    }


    return (
        <div className="invitations-container">
            <div className="invitations-header">
                <h1 className="invitations-title">Inviti</h1>
                <span className="invitations-total">{total} {total === 1 ? 'invito' : 'inviti'}</span>
            </div>

            <div className="invitations-create-row">
                <input
                    type="email"
                    className="invitations-input"
                    placeholder="email@esempio.it"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    disabled={busy}
                />
                <select
                    className="invitations-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'agent' | 'user')}
                    disabled={busy}
                >
                    <option value="user">Utente</option>
                    <option value="agent">Agente</option>
                </select>
                <button
                    className="invitations-btn-create"
                    onClick={handleCreate}
                    disabled={busy || !email.trim()}
                >
                    <Send size={18} />
                    Invita
                </button>
            </div>

            {loading ? (
                <Spinner />
            ) : invitations.length === 0 ? (
                <p className="invitations-empty">Nessun invito ancora creato</p>
            ) : (
                <ul className="invitations-list">
                    {invitations.map(inv => {
                        const status = getInvitationStatus(inv);
                        return (
                            <li key={inv.id} className="invitations-item">
                                <div className="invitations-item-main">
                                    <span className="invitations-email">{inv.email}</span>
                                    <div className="invitations-badges">
                                        <span className={`invitations-badge invitations-role-${inv.role}`}>
                                            {inv.role === 'agent' ? 'Agente' : 'Utente'}
                                        </span>
                                        <span className={`invitations-badge invitations-status-${status}`}>
                                            {status === 'pending' ? 'In attesa' : status === 'accepted' ? 'Accettato' : 'Scaduto'}
                                        </span>
                                    </div>
                                </div>
                                <div className="invitations-item-meta">
                                    <span className="invitations-date">
                                        {new Date(inv.created_at).toLocaleDateString('it-IT')}
                                    </span>
                                    {status === 'pending' && (
                                        <button
                                            className="invitations-icon-btn invitations-icon-delete"
                                            onClick={() => handleDelete(inv.id)}
                                            disabled={busy}
                                            aria-label="Elimina invito"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {lastPage > 1 && (
                <div className="invitations-pagination">
                    <button
                        className="invitations-page-btn"
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 1 || busy}
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="invitations-page-info">
                        Pagina {currentPage} di {lastPage}
                    </span>
                    <button
                        className="invitations-page-btn"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage === lastPage || busy}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );

}

export default Invitations;