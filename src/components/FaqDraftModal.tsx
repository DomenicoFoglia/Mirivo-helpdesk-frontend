import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, ExternalLink, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Category } from '../types';
import { draftFaqFromTicketApi, createFaqApi, type FaqDraftResponse } from '../api/faqs';
import './FaqDraftModal.css';

interface Props {
    isOpen: boolean;
    ticketId: number;
    categories: Category[];
    onClose: () => void;
}

function FaqDraftModal({ isOpen, ticketId, categories, onClose }: Props) {
    const [phase, setPhase] = useState<'input' | 'form'>('input');
    const [adminSummary, setAdminSummary] = useState('');
    const [summaryOpen, setSummaryOpen] = useState(false);
    const [draft, setDraft] = useState<FaqDraftResponse | null>(null);
    const [formData, setFormData] = useState({
        question: '',
        answer: '',
        category_id: 0,
    });
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

    const navigate = useNavigate();

    const handleClose = () => {
        setPhase('input');
        setAdminSummary('');
        setSummaryOpen(false);
        setDraft(null);
        setFormData({ question: '', answer: '', category_id: 0 });
        setErrors({});
        onClose();
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const result = await draftFaqFromTicketApi(ticketId, adminSummary);
            setDraft(result);
            setFormData({
                question: result.question,
                answer: result.answer,
                category_id: result.suggested_category_id,
            });
            setPhase('form');
        } catch (err: any) {
            const msg = err.response?.data?.message ?? 'Errore durante la generazione della bozza';
            toast.error(msg);
        } finally {
            setGenerating(false);
        }
    };

    const handlePublish = async () => {
        setErrors({});
        setSaving(true);
        try {
            await createFaqApi(formData);
            toast.success('FAQ pubblicata');
            handleClose();
            navigate('/admin/faqs');
        } catch (err: any) {
            if (err.response?.status === 422 && err.response.data.errors) {
                const apiErrors = err.response.data.errors;
                const newErrors: Record<string, string> = {};
                Object.keys(apiErrors).forEach(k => {
                    newErrors[k] = apiErrors[k][0];
                });
                setErrors(newErrors);
            } else {
                toast.error('Errore durante il salvataggio');
            }
        } finally {
            setSaving(false);
        }
    };

    const overlayClickHandler = () => {
        if (generating || saving) return;
        handleClose();
    };

    if (!isOpen) return null;

    return (
        <div className="faq-draft-modal-overlay" onClick={overlayClickHandler}>
            <div className="faq-draft-modal" onClick={e => e.stopPropagation()}>
                <div className="faq-draft-modal-header">
                    <h2>
                        <Sparkles size={20} />
                        Trasforma in FAQ
                    </h2>
                    <button
                        className="faq-draft-close-btn"
                        onClick={handleClose}
                        disabled={generating || saving}
                        aria-label="Chiudi"
                    >
                        <X size={20} />
                    </button>
                </div>

                {phase === 'input' && (
                    <div>
                        <p className="faq-draft-intro">
                            L'AI leggera' la conversazione di questo ticket e proporra' una bozza di FAQ da rivedere prima di pubblicare.
                        </p>

                        <div className="faq-draft-accordion">
                            <button
                                type="button"
                                className="faq-draft-accordion-header"
                                onClick={() => setSummaryOpen(o => !o)}
                            >
                                {summaryOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                Guida l'AI (opzionale)
                            </button>
                            {summaryOpen && (
                                <div className="faq-draft-accordion-body">
                                    <p className="faq-draft-hint">
                                        Se il thread e' confuso o contiene rumore, scrivi qui una sintesi della soluzione. L'AI la trattera' come fonte primaria.
                                    </p>
                                    <textarea
                                        className="faq-draft-textarea"
                                        rows={4}
                                        maxLength={2000}
                                        value={adminSummary}
                                        onChange={e => setAdminSummary(e.target.value)}
                                        placeholder="Es. Il problema si risolve svuotando i cookie del dominio dell'applicazione..."
                                    />
                                    <p className="faq-draft-counter">{adminSummary.length} / 2000</p>
                                </div>
                            )}
                        </div>

                        <div className="faq-draft-modal-actions">
                            <button
                                type="button"
                                className="faq-draft-btn faq-draft-btn-secondary"
                                onClick={handleClose}
                                disabled={generating}
                            >
                                Annulla
                            </button>
                            <button
                                type="button"
                                className="faq-draft-btn faq-draft-btn-primary"
                                onClick={handleGenerate}
                                disabled={generating}
                            >
                                <Sparkles size={16} />
                                {generating ? 'Generazione in corso...' : 'Genera bozza'}
                            </button>
                        </div>
                    </div>
                )}

                {phase === 'form' && draft && (
                    <div>
                        {draft.similar_faq_id !== null && (
                            <div className="faq-draft-warning">
                                <AlertTriangle size={18} />
                                <div className="faq-draft-warning-body">
                                    <p className="faq-draft-warning-title">Esiste gia' una FAQ simile</p>
                                    {draft.similar_faq_reason && (
                                        <p className="faq-draft-warning-reason">{draft.similar_faq_reason}</p>
                                    )}
                                    <a
                                        href={`/admin/faqs#faq-${draft.similar_faq_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="faq-draft-warning-link"
                                    >
                                        Vai a vederla <ExternalLink size={12} />
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="faq-draft-form-field">
                            <label htmlFor="draft-question">Domanda</label>
                            <input
                                id="draft-question"
                                type="text"
                                value={formData.question}
                                onChange={e => setFormData({ ...formData, question: e.target.value })}
                                maxLength={255}
                                disabled={saving}
                            />
                            <p className="faq-draft-counter">{formData.question.length} / 255</p>
                            {errors.question && <p className="faq-draft-error">{errors.question}</p>}
                        </div>

                        <div className="faq-draft-form-field">
                            <label htmlFor="draft-answer">Risposta</label>
                            <textarea
                                id="draft-answer"
                                value={formData.answer}
                                onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                maxLength={3000}
                                rows={8}
                                disabled={saving}
                            />
                            <p className="faq-draft-counter">{formData.answer.length} / 3000</p>
                            {errors.answer && <p className="faq-draft-error">{errors.answer}</p>}
                        </div>

                        <div className="faq-draft-form-field">
                            <label htmlFor="draft-category">Categoria</label>
                            <select
                                id="draft-category"
                                value={formData.category_id}
                                onChange={e => setFormData({ ...formData, category_id: Number(e.target.value) })}
                                disabled={saving}
                            >
                                <option value={0}>Seleziona una categoria</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category_id && <p className="faq-draft-error">{errors.category_id}</p>}
                        </div>

                        <p className="faq-draft-ai-note">
                            <Sparkles size={12} /> Bozza generata dall'AI. Rivedila prima di pubblicare.
                        </p>

                        <div className="faq-draft-modal-actions">
                            <button
                                type="button"
                                className="faq-draft-btn faq-draft-btn-secondary"
                                onClick={handleClose}
                                disabled={saving}
                            >
                                Annulla
                            </button>
                            <button
                                type="button"
                                className="faq-draft-btn faq-draft-btn-primary"
                                onClick={handlePublish}
                                disabled={saving}
                            >
                                {saving ? 'Pubblicazione...' : 'Pubblica FAQ'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FaqDraftModal;