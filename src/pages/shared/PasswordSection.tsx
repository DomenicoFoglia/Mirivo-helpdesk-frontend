import { useState } from "react"
import { updatePasswordApi } from "../../api/profile"
import toast from "react-hot-toast"
import axios from "axios"

function PasswordSection() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleSave = async () => {
        setSaving(true)
        setErrors({})
        try {
            await updatePasswordApi(currentPassword, newPassword, passwordConfirmation)
            toast.success('Password aggiornata')
            setCurrentPassword('')
            setNewPassword('')
            setPasswordConfirmation('')
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
            <h2 className="text-sm font-medium profile-card-title mb-3">Password</h2>
            <div className="flex flex-col gap-3">

                {/* Password attuale */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs profile-label">Password attuale</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="profile-input rounded-lg px-3 py-2 text-sm"
                    />
                    {errors.current_password && <span className="text-xs profile-error">{errors.current_password}</span>}
                </div>

                {/* Nuova password */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs profile-label">Nuova password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="profile-input rounded-lg px-3 py-2 text-sm"
                    />
                    {errors.password && <span className="text-xs profile-error">{errors.password}</span>}
                </div>

                {/* Conferma nuova password */}
                <div className="flex flex-col gap-1">
                    <label className="text-xs profile-label">Conferma nuova password</label>
                    <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="profile-input rounded-lg px-3 py-2 text-sm"
                    />
                </div>

                {/* Bottone */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="profile-button rounded-lg px-4 py-2 text-sm font-medium mt-1 self-start"
                >
                    {saving ? 'Salvataggio...' : 'Aggiorna password'}
                </button>

            </div>
        </div>
    )
}

export default PasswordSection