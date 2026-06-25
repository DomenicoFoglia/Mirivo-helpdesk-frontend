import { useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Plus, X } from 'lucide-react'
import { userCreateTicketApi, categoriesApi } from '../../api/tickets'
import type { Category } from '../../types'
import './TicketCompose.css'
import AttachmentPicker from '../../components/AttachmentPicker'

function TicketCompose(){
    const navigate = useNavigate();
    const titleRef = useRef<HTMLInputElement>(null);

    const [ expanded, setExpanded ] = useState(false);
    const [ title, setTitle ] = useState('');
    const [ message, setMessage ] = useState('');
    const [ categoryId, setCategoryId ] = useState<number | ''>('');
    const [ categories, setCategories ] = useState<Category[]>([]);
    const [ attachments, setAttachments ] = useState<File[]>([]);
    const [ submitting, setSubmitting ] = useState(false);
    const [ errors, setErrors ] = useState<Record<string, string>>({});


    // Carico le categorie
    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const res = await categoriesApi('user');
                setCategories(res);
            }catch(err){
                console.error('Errore caricamento categorie: ' , err);
                
            }
        }
        fetchCategories();
    }, []);

    // Focus automatico sul titotlo quando il form si apree
    useEffect(() => {
        if(expanded) { 
            titleRef.current?.focus();
        }
    }, [expanded]);

    const resetForm = () =>{
        setTitle('');
        setMessage('');
        setCategoryId('');
        setAttachments([]);
        setErrors({});
    }

    const handleCollapse = () => {
        setExpanded(false);
        resetForm();
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(submitting)
            return;

        setSubmitting(true);
        setErrors({});

        try{
            const res = await userCreateTicketApi(
                {
                    title,
                    category_id: Number(categoryId),
                    message
                },
                attachments
            );
            toast.success('Ticket creato');
            navigate(`/user/ticket/${res.ticket.id}`);
        }catch(err){
            if (axios.isAxiosError(err) && err.response?.status === 422) {
                const validationErrors = err.response.data.errors;
                const flat: Record<string, string> = {};
                for (const [key, msgs] of Object.entries(validationErrors)) {
                    flat[key] = (msgs as string[])[0];
                }
                setErrors(flat);
                 // Se c'è un errore sugli attachments, mostralo anche come toast
                const attachmentError = Object.keys(flat).find(k => k.startsWith('attachments'));
                if (attachmentError) {
                    toast.error(flat[attachmentError]);
                }
            }else{
                console.error('Errore creazione ticket:', err)
                toast.error('Errore nella creazione del ticket')
            }
        }finally{
            setSubmitting(false)
        }
    }

    if (!expanded) {
        return (
            <button
                type="button"
                className="compose compose-collapsed"
                onClick={() => setExpanded(true)}
            >
                <Plus size={18} />
                <span>Apri un nuovo ticket...</span>
            </button>
        )
    }

    return (
        <form className="compose compose-expanded" onSubmit={handleSubmit}>
            <div className="compose-header">
                <h3>Nuovo ticket</h3>
                <button
                    type="button"
                    className="compose-close"
                    onClick={handleCollapse}
                    aria-label="Chiudi"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="compose-field">
                <label htmlFor="compose-title">Titolo</label>
                <input
                    ref={titleRef}
                    id="compose-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                    placeholder="Es. La stampante non risponde"
                    />
                {errors.title && <span className="field-error">{errors.title}</span>}
            </div>

            <div className="compose-field">
                <label htmlFor="compose-category">Categoria</label>
                <select
                    id="compose-category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
                    >
                    <option value="">Seleziona una categoria</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                {errors.category_id && <span className="field-error">{errors.category_id}</span>}
            </div>

            <div className="compose-field">
                <label htmlFor="compose-message">Descrizione</label>
                <textarea
                    id="compose-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    placeholder="Descrivi il problema nel dettaglio..."
                    />
                {errors.message && <span className="field-error">{errors.message}</span>}
            </div>

            <div className="compose-field">
                <label>Allegati (opzionali)</label>
                <AttachmentPicker files={attachments} onChange={setAttachments} />
            </div>

            <div className="compose-actions">
                <button
                    type="button"
                    className="compose-btn-secondary"
                    onClick={handleCollapse}
                    disabled={submitting}
                >
                    Annulla
                </button>
                <button
                    type="submit"
                    className="compose-btn-primary"
                    disabled={submitting}
                >
                    {submitting ? 'Creazione...' : 'Apri ticket'}
                </button>
            </div>
        </form>
    )


}

export default TicketCompose;