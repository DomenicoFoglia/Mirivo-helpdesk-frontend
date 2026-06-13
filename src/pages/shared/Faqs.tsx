import { useEffect, useState } from 'react'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'
import { getFaqsApi } from '../../api/faqs'
import { categoriesApi } from '../../api/tickets'
import type { Faq, Category } from '../../types'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import Spinner from '../../components/Spinner'
import './Faqs.css'


function Faqs(){
    const [faqs, setFaqs] = useState<Faq[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [searchInput, setSearchInput] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<number | ''>('')
    const [expandedId, setExpandedId] = useState<number | null>(null)

    const user = useAuthStore(state => state.user)

    useEffect(() => {
        const fetchFaq = async () => {
            if (!user) return
            try{
                const [faqsData, categoriesData] = await Promise.all([
                    getFaqsApi(),
                    categoriesApi(user.role)
                ]);
                setFaqs(faqsData);
                setCategories(categoriesData);
            }catch{
                toast.error("Errore nel recupero dei dati");
            }finally{
                setLoading(false);
            }
        }
        fetchFaq();
    },[user]);

    const filteredFaqs = faqs.filter(faq => {
        const matchSearch = searchInput === '' || 
            faq.question.toLowerCase().includes(searchInput.toLowerCase())
        const matchCategory = categoryFilter === '' || 
            faq.category_id === categoryFilter
        return matchSearch && matchCategory
    });

    const handleToggle = (id: number) => {
        setExpandedId(expandedId === id ? null : id)
    }

    if (loading) {
        return (
            <div className="faqs-container">
                <Spinner />
            </div>
        )
    }

    return (
        <div className="faqs-container">
            <header className="faqs-header">
                <h1>FAQ</h1>
            </header>

            <div className="faqs-filters">
                <div className="faqs-search">
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

            {filteredFaqs.length === 0 ? (
                <p className="faqs-empty">Nessuna FAQ trovata.</p>
            ) : (
                <ul className="faqs-list">
                    {filteredFaqs.map(faq => {
                        const isOpen = expandedId === faq.id
                        return (
                            <li key={faq.id} className={`faqs-item ${isOpen ? 'is-open' : ''}`}>
                                <button 
                                    className="faqs-question-row" 
                                    onClick={() => handleToggle(faq.id)}
                                    aria-expanded={isOpen}
                                >
                                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                    <span className="faqs-question">{faq.question}</span>
                                    {faq.category && (
                                        <span className={`faqs-category faqs-category-c${(faq.category_id * 7) % 10}`}>
                                            {faq.category.name}
                                        </span>
                                    )}
                                </button>
                                {isOpen && (
                                    <div className="faqs-answer">
                                        {faq.answer}
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )

}

export default Faqs;