import { useState } from "react"
import useAuthStore from "../../store/authStore"
import { updateProfileApi } from "../../api/profile"
import toast from "react-hot-toast"
import axios from "axios"

function ProfileDataSection() {
    const user = useAuthStore(state => state.user)
    const setUser = useAuthStore(state => state.setUser)

    const [name, setName] = useState(user?.name ?? '')
    const [surname, setSurname] = useState(user?.surname ?? '')
    const [email, setEmail] = useState(user?.email ?? '')
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSave = async () => {
        setSaving(true)
        setErrors({})
        try {
            const updatedUser = await updateProfileApi(name, surname, email)
            setUser(updatedUser)
            toast.success('Dati aggiornati')
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 422) {
                const backendErrors = err.response.data.errors
                const flattened: Record<string, string> = {}
                for (const field in backendErrors) {
                    flattened[field] = backendErrors[field][0]
                }
                setErrors(flattened)
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="profile-card rounded-xl p-5">
            <h2 className="text-sm font-medium profile-card-title mb-3">Dati personali</h2>
            <div className="flex flex-col gap-3">

                {/* Nome */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs profile-label">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="profile-input rounded-lg px-3 py-2 text-sm"
                    />
                    {errors.name && <span className="text-xs profile-error">{errors.name}</span>}
                </div>

                {/* Cognome */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs profile-label">Cognome</label>
                    <input
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className="profile-input rounded-lg px-3 py-2 text-sm"
                    />
                    {errors.surname && <span className="text-xs profile-error">{errors.surname}</span>}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs profile-label">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="profile-input rounded-lg px-3 py-2 text-sm"
                    />
                    {errors.email && <span className="text-xs profile-error">{errors.email}</span>}
                </div>

                {/* Bottone */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="profile-button rounded-lg px-4 py-2 text-sm font-medium mt-1 self-start"
                >
                    {saving ? 'Salvataggio...' : 'Salva'}
                </button>

            </div>
        </div>
    )
}

export default ProfileDataSection