import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Pencil, Trash2, Search, ChevronDown } from 'lucide-react'
import { getFaqsApi, createFaqApi, updateFaqApi, deleteFaqApi, type CreateFaqData } from '../../api/faqs'
import { categoriesApi } from '../../api/tickets'
import type { Faq, Category } from '../../types'
import toast from 'react-hot-toast'
import Spinner from '../../components/Spinner'
import ConfirmModal from '../../components/ConfirmModal'
import './AdminFaqs.css'
import useAuthStore from '../../store/authStore'

function AdminFaqs() {
    const [faqs, setFaqs] = useState<Faq[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchInput, setSearchInput] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<number | ''>('')
    const [modal, setModal] = useState<'form' | 'delete' | null>(null)
    const [selectedFaq, setSelectedFaq] = useState<Faq | null>(null)
    const [formData, setFormData] = useState<CreateFaqData>({ question: '', answer: '', category_id: 0 })
    const [errors, setErrors] = useState<Partial<Record<keyof CreateFaqData, string>>>({})

    // Espansione inline: solo una FAQ espansa alla volta.
    const [expandedId, setExpandedId] = useState<number | null>(null)
    // Highlight temporaneo dopo arrivo via hash: si spegne dopo 2 secondi.
    const [highlightedId, setHighlightedId] = useState<number | null>(null)

    const user = useAuthStore(state => state.user)
    const location = useLocation()

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return
            try {
                const [faqsData, categoriesData] = await Promise.all([
                    getFaqsApi(),
                    categoriesApi(user.role)
                ])
                setFaqs(faqsData)
                setCategories(categoriesData)
            } catch {
                toast.error('Impossibile caricare FAQ o Categorie')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [user])

    // Hash reader: se l'URL contiene #faq-N, espandi la FAQ N + scroll + highlight.
    // Dipende da `faqs` per aspettare il fetch (altrimenti getElementById non trova nulla).
    useEffect(() => {
        if (faqs.length === 0) return
        if (!location.hash.startsWith('#faq-')) return

        const id = Number(location.hash.replace('#faq-', ''))
        if (isNaN(id)) return

        setExpandedId(id)
        setHighlightedId(id)

        // Piccolo delay per far renderizzare l'espansione prima dello scroll,
        // altrimenti scrolla alla posizione pre-espansione.
        const scrollTimer = setTimeout(() => {
            const el = document.getElementById(`faq-${id}`)
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 50)

        // Rimuove solo l'highlight dopo 2s, l'espansione resta.
        const highlightTimer = setTimeout(() => {
            setHighlightedId(null)
        }, 2000)

        return () => {
            clearTimeout(scrollTimer)
            clearTimeout(highlightTimer)
        }
    }, [faqs, location.hash])

    const handleToggleExpand = (id: number) => {
        setExpandedId(current => current === id ? null : id)
    }

    const handleNewClick = () => {
        setSelectedFaq(null)
        setFormData({ question: '', answer: '', category_id: 0 })
        setErrors({})
        setModal('form')
    }

    const handleEditClick = (faq: Faq) => {
        setSelectedFaq(faq)
        setFormData({
            question: faq.question,
            answer: faq.answer,
            category_id: faq.category_id
        })
        setErrors({})
        setModal('form')
    }

    const handleDeleteClick = (faq: Faq) => {
        setSelectedFaq(faq)
        setModal('delete')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setSaving(true)

        try {
            if (selectedFaq) {
                const updated = await updateFaqApi(selectedFaq.id, formData)
                setFaqs(faqs.map(f => f.id === updated.id ? updated : f))
                toast.success('FAQ aggiornata')
            } else {
                const created = await createFaqApi(formData)
                setFaqs([...faqs, created])
                toast.success('FAQ creata')
            }
            setModal(null)
            setSelectedFaq(null)
        } catch (err: any) {
            if (err.response?.status === 422 && err.response.data.errors) {
                const apiErrors = err.response.data.errors
                const newErrors: typeof errors = {}
                Object.keys(apiErrors).forEach(key => {
                    newErrors[key as keyof CreateFaqData] = apiErrors[key][0]
                })
                setErrors(newErrors)
            } else {
                toast.error('Errore durante il salvataggio')
            }
        } finally {
            setSaving(false)
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedFaq) return

        setSaving(true)
        try {
            await deleteFaqApi(selectedFaq.id)
            setFaqs(faqs.filter(f => f.id !== selectedFaq.id))
            toast.success('FAQ eliminata')
            setModal(null)
            setSelectedFaq(null)
        } catch {
            toast.error('Errore durante l\'eliminazione')
        } finally {
            setSaving(false)
        }
    }

    const filteredFaqs = faqs.filter(faq => {
        const matchSearch = searchInput === '' ||
            faq.question.toLowerCase().includes(searchInput.toLowerCase())
        const matchCategory = categoryFilter === '' ||
            faq.category_id === categoryFilter
        return matchSearch && matchCategory
    })

    if (loading) {
        return (
            <div className="admin-faqs-container">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="admin-faqs-container">
            {/* Header */}
            <header className="admin-faqs-header">
                <h1>FAQ</h1>
                <button className="admin-faqs-btn-create" onClick={handleNewClick}>
                    <Plus size={16} /> Nuova FAQ
                </button>
            </header>

            {/* Filtri */}
            <div className="admin-faqs-filters">
                <div className="admin-faqs-search">
                    <Search size={16} />
                    <input
                        type="text"
                        placeholder="Cerca nelle domande..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                    />
                </div>
                <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value === '' ? '' : Number(e.target.value))}
                >
                    <option value="">Tutte le categorie</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Lista */}
            {filteredFaqs.length === 0 ? (
                <p className="admin-faqs-empty">Nessuna FAQ trovata.</p>
            ) : (
                <ul className="admin-faqs-list">
                    {filteredFaqs.map(faq => {
                        const isExpanded = expandedId === faq.id
                        const isHighlighted = highlightedId === faq.id
                        return (
                            <li
                                key={faq.id}
                                id={`faq-${faq.id}`}
                                className={`admin-faqs-item ${isExpanded ? 'expanded' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                            >
                                <div className="admin-faqs-item-row">
                                    <button
                                        type="button"
                                        className="admin-faqs-item-main"
                                        onClick={() => handleToggleExpand(faq.id)}
                                        aria-expanded={isExpanded}
                                    >
                                        <ChevronDown
                                            size={16}
                                            className={`admin-faqs-chevron ${isExpanded ? 'rotated' : ''}`}
                                        />
                                        <p className="admin-faqs-question">{faq.question}</p>
                                        {faq.category && (
                                            <span className={`admin-faqs-category admin-faqs-category-c${(faq.category_id * 7) % 10}`}>
                                                {faq.category.name}
                                            </span>
                                        )}
                                    </button>
                                    <div className="admin-faqs-actions">
                                        <button
                                            className="admin-faqs-icon-btn"
                                            onClick={() => handleEditClick(faq)}
                                            aria-label="Modifica"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="admin-faqs-icon-btn danger"
                                            onClick={() => handleDeleteClick(faq)}
                                            aria-label="Elimina"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                {isExpanded && (
                                    <div className="admin-faqs-answer">
                                        {faq.answer}
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}

            {/* Modal create/edit */}
            {modal === 'form' && (
                <div
                    className="admin-faqs-modal-overlay"
                    onClick={() => !saving && setModal(null)}
                >
                    <div className="admin-faqs-modal" onClick={e => e.stopPropagation()}>
                        <h2>{selectedFaq ? 'Modifica FAQ' : 'Nuova FAQ'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="admin-faqs-form-field">
                                <label htmlFor="question">Domanda</label>
                                <input
                                    id="question"
                                    type="text"
                                    value={formData.question}
                                    onChange={e => setFormData({ ...formData, question: e.target.value })}
                                    maxLength={255}
                                    disabled={saving}
                                />
                                {errors.question && (
                                    <p className="admin-faqs-form-error">{errors.question}</p>
                                )}
                            </div>

                            <div className="admin-faqs-form-field">
                                <label htmlFor="answer">Risposta</label>
                                <textarea
                                    id="answer"
                                    value={formData.answer}
                                    onChange={e => setFormData({ ...formData, answer: e.target.value })}
                                    maxLength={3000}
                                    rows={6}
                                    disabled={saving}
                                />
                                {errors.answer && (
                                    <p className="admin-faqs-form-error">{errors.answer}</p>
                                )}
                            </div>

                            <div className="admin-faqs-form-field">
                                <label htmlFor="category">Categoria</label>
                                <select
                                    id="category"
                                    value={formData.category_id}
                                    onChange={e => setFormData({ ...formData, category_id: Number(e.target.value) })}
                                    disabled={saving}
                                >
                                    <option value={0}>Seleziona una categoria</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.category_id && (
                                    <p className="admin-faqs-form-error">{errors.category_id}</p>
                                )}
                            </div>

                            <div className="admin-faqs-modal-actions">
                                <button type="button" onClick={() => setModal(null)} disabled={saving}>
                                    Annulla
                                </button>
                                <button type="submit" disabled={saving}>
                                    {saving ? 'Salvataggio...' : (selectedFaq ? 'Salva' : 'Crea')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal delete */}
            {modal === 'delete' && selectedFaq && (
                <ConfirmModal
                    isOpen={true}
                    title="Elimina FAQ"
                    message={`Sei sicuro di voler eliminare la FAQ "${selectedFaq.question}"?`}
                    confirmText="Elimina"
                    cancelText="Annulla"
                    variant="danger"
                    onConfirm={handleConfirmDelete}
                    onCancel={() => { setModal(null); setSelectedFaq(null) }}
                />
            )}
        </div>
    )
}

export default AdminFaqs