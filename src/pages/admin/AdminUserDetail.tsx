import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { User } from '../../types';
import { getUserApi, updateUserApi, deleteUserApi, resetUserPasswordApi } from '../../api/users';
import Spinner from '../../components/Spinner';
import ConfirmModal from '../../components/ConfirmModal';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, Trash2 } from 'lucide-react';
import './AdminUserDetail.css';

function AdminUserDetail() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        role: 'user' as 'agent' | 'user',
        level: null as 1 | 2 | null,
    });
    const [modal, setModal] = useState<'delete' | 'reset' | null>(null);

    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const res = await getUserApi(Number(userId));
                setUser(res);
                setFormData({
                    name: res.name,
                    surname: res.surname,
                    email: res.email,
                    role: res.role as 'agent' | 'user',
                    level: res.level,
                });
            } catch {
                toast.error('Impossibile caricare il profilo');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleRoleChange = (newRole: 'agent' | 'user') => {
        setFormData(prev => ({
            ...prev,
            role: newRole,
            level: newRole === 'agent' ? 1 : null,
        }));
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const updated = await updateUserApi(user.id, formData);
            setUser(updated);
            toast.success('Modifiche salvate');
        } catch {
            toast.error('Impossibile salvare le modifiche');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!user) return;
        try {
            await deleteUserApi(user.id);
            toast.success('Utente eliminato');
            navigate(-1);
        } catch {
            toast.error('Impossibile eliminare l\'utente');
        } finally {
            setModal(null);
        }
    };

    const handleResetPassword = async () => {
        if (!user) return;
        try {
            await resetUserPasswordApi(user.id);
            toast.success('Email di reset inviata');
        } catch {
            toast.error('Impossibile inviare l\'email di reset');
        } finally {
            setModal(null);
        }
    };

    if (loading) return <Spinner />;
    if (!user) return <p className="ticket-list-empty">Utente non trovato</p>;

    const initials = `${user.name.charAt(0)}${user.surname.charAt(0)}`.toUpperCase();
    const roleLabel = user.role === 'agent' ? 'Tecnico' : user.role === 'admin' ? 'Admin' : 'Utente';

    return (
        <div className="user-detail-page">
            {/* Bottone indietro */}
            <button
                className="user-detail-back"
                onClick={() => navigate(-1)}
                aria-label="Torna indietro"
            >
                <ArrowLeft size={18} />
                <span>Indietro</span>
            </button>

            {/* Header con identita' visiva */}
            <div className="user-detail-header">
                <div className={`user-detail-avatar user-detail-avatar-${user.role}`}>
                    {initials}
                </div>
                <div className="user-detail-identity">
                    <h1>{user.name} {user.surname}</h1>
                    <div className="user-detail-badges">
                        <span className={`user-detail-badge user-detail-badge-${user.role}`}>
                            {roleLabel}{user.level ? ` L${user.level}` : ''}
                        </span>
                        <span className="user-detail-email">{user.email}</span>
                    </div>
                </div>
            </div>

            {/* Card con i campi del form */}
            <div className="user-detail-card">
                <h2>Dati profilo</h2>

                <div className="user-detail-grid">
                    <div className="user-detail-field">
                        <label>Nome</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </div>

                    <div className="user-detail-field">
                        <label>Cognome</label>
                        <input
                            type="text"
                            value={formData.surname}
                            onChange={e => setFormData(prev => ({ ...prev, surname: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="user-detail-field">
                    <label>Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                </div>

                <div className="user-detail-grid">
                    <div className="user-detail-field">
                        <label>Ruolo</label>
                        <select
                            value={formData.role}
                            onChange={e => handleRoleChange(e.target.value as 'agent' | 'user')}
                        >
                            <option value="user">Utente</option>
                            <option value="agent">Tecnico</option>
                        </select>
                    </div>

                    {formData.role === 'agent' && (
                        <div className="user-detail-field">
                            <label>Livello</label>
                            <select
                                value={formData.level ?? 1}
                                onChange={e => setFormData(prev => ({
                                    ...prev,
                                    level: Number(e.target.value) as 1 | 2,
                                }))}
                            >
                                <option value={1}>L1</option>
                                <option value={2}>L2</option>
                            </select>
                        </div>
                    )}
                </div>

                <button
                    className="user-detail-btn user-detail-btn-primary user-detail-btn-block"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? 'Salvataggio...' : 'Salva modifiche'}
                </button>
            </div>

            {/* Card azioni: reset password */}
            <div className="user-detail-card">
                <h2>Reimposta password</h2>

                <div className="user-detail-action-row">
                    <div className="user-detail-action-text">
                        <p className="user-detail-action-title">Invia email di reset</p>
                        <p className="user-detail-action-desc">
                            L'utente ricevera' un'email con il link per impostare una nuova password.
                        </p>
                    </div>
                    <button
                        className="user-detail-btn user-detail-btn-secondary"
                        onClick={() => setModal('reset')}
                    >
                        <Mail size={16} />
                        Invia email
                    </button>
                </div>
            </div>

            {/* Card danger zone: elimina */}
            <div className="user-detail-card user-detail-card-danger">
                <h2>Area pericolosa</h2>

                <div className="user-detail-action-row">
                    <div className="user-detail-action-text">
                        <p className="user-detail-action-title">Elimina utente</p>
                        <p className="user-detail-action-desc">
                            Questa operazione e' irreversibile e cancellera' definitivamente l'utente.
                        </p>
                    </div>
                    <button
                        className="user-detail-btn user-detail-btn-danger"
                        onClick={() => setModal('delete')}
                    >
                        <Trash2 size={16} />
                        Elimina
                    </button>
                </div>
            </div>

            {/* Modali */}
            <ConfirmModal
                isOpen={modal === 'delete'}
                title="Elimina utente"
                message={`Sei sicuro di voler eliminare ${user.name} ${user.surname}? L'operazione non e' reversibile.`}
                variant="danger"
                confirmText="Elimina"
                onConfirm={handleDelete}
                onCancel={() => setModal(null)}
            />

            <ConfirmModal
                isOpen={modal === 'reset'}
                title="Invia reset password"
                message={`Verra' inviata un'email a ${user.email} con il link per impostare una nuova password. Procedere?`}
                variant="primary"
                confirmText="Invia"
                onConfirm={handleResetPassword}
                onCancel={() => setModal(null)}
            />
        </div>
    );
}

export default AdminUserDetail;