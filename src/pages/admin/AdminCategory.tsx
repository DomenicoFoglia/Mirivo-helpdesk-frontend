import { useEffect, useState } from "react";
import { categoryListApi, createCategoryApi, deleteCategoryApi, updateCategoryApi } from "../../api/category";
import type { Category } from "../../types";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import Spinner from '../../components/Spinner';
import "./AdminCategory.css"


function AdminCategory() {
    const [ categories, setCategories] = useState<Category[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');
    const [ busy, setBusy ] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try{
                const res = await categoryListApi();
                setCategories(res);
            }catch{
                toast.error("Errore nello useEffect")
            }finally{
                setLoading(false);
            }
        }
        fetchCategories();
    },[]);

    const handleCreateCategory = async () => {
        if(!newCategoryName.trim()) return;
        setBusy(true);
        try{
            const res = await createCategoryApi(newCategoryName.trim());
            setCategories(prev => [...prev, res]);
            setNewCategoryName('');
            toast.success('Categoria creata con successo');
        }catch{
            toast.error('Errore nella creazione della categoria');
        }finally{
            setBusy(false);
        }
    }

    const handleDeleteCategory = async (id: number) => {
        toast((t) => (
            <div>
                <p>Eliminare questa categoria?</p>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                        style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        onClick={async () => {
                            toast.dismiss(t.id);
                            setBusy(true);
                            try {
                                await deleteCategoryApi(id);
                                setCategories(prev => prev.filter(cat => cat.id !== id));
                                toast.success('Categoria eliminata con successo');
                            } catch {
                                toast.error("Errore nell'eliminazione della categoria");
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

    const handleUpdateCategory = async () => {
        if(editingCategoryId === null || !editingCategoryName.trim() || busy === true) return;
        setBusy(true);
        try{
            const res = await updateCategoryApi(editingCategoryId, editingCategoryName.trim());
            setCategories(prev => prev.map(cat => cat.id === res.id ? {...cat, name: res.name} : cat));
            setEditingCategoryId(null);
            toast.success("Nome categoria aggiornato con successo");
        }catch{
            toast.error("Errore nell' aggiornamento della categoria");
        }finally{
            setBusy(false);
        }
    }


    return (
        <div className="category-container">
            <h1 className="category-title">Categorie</h1>

            <div className="category-create-row">
                <input
                    type="text"
                    className="category-input"
                    placeholder="Nuova categoria..."
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                    disabled={busy}
                />
                <button
                    className="category-btn category-btn-create"
                    onClick={handleCreateCategory}
                    disabled={busy || !newCategoryName.trim()}
                >
                    <Plus size={18} />
                    Aggiungi
                </button>
            </div>

            {loading ? (
                <Spinner />
            ) : categories.length === 0 ? (
                <p className="category-empty">Nessuna categoria creata</p>
            ) : (
                <ul className="category-list">
                    {categories.map(cat => (
                        <li key={cat.id} className="category-item">
                            {editingCategoryId === cat.id ? (
                                <div className="category-item-edit">
                                    <input
                                        type="text"
                                        className="category-input"
                                        value={editingCategoryName}
                                        onChange={(e) => setEditingCategoryName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory()}
                                        disabled={busy}
                                        autoFocus
                                    />
                                    <button
                                        className="category-icon-btn category-icon-confirm"
                                        onClick={handleUpdateCategory}
                                        disabled={busy || !editingCategoryName.trim()}
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        className="category-icon-btn category-icon-cancel"
                                        onClick={() => setEditingCategoryId(null)}
                                        disabled={busy}
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="category-item-read">
                                    <span className="category-name">{cat.name}</span>
                                    <div className="category-actions">
                                        <button
                                            className="category-icon-btn category-icon-edit"
                                            onClick={() => {
                                                setEditingCategoryId(cat.id);
                                                setEditingCategoryName(cat.name);
                                            }}
                                            disabled={busy}
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="category-icon-btn category-icon-delete"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            disabled={busy}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
    
}

export default AdminCategory