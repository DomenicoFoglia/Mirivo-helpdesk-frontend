import useAuthStore from "../../store/authStore"
import { updateThemeApi } from "../../api/profile"

const themes = [
    { id: 'amber', label: 'Amber' },
    { id: 'light', label: 'Light' },
    { id: 'light-warm', label: 'Light warm' },
    { id: 'light-green', label: 'Light green' },
    { id: 'midnight', label: 'Midnight' },
    { id: 'forest', label: 'Forest' },
    { id: 'ember', label: 'Ember' },
    { id: 'steel', label: 'Steel' },
    { id: 'crimson', label: 'Crimson' },
    { id: 'violet', label: 'Violet' },
    { id: 'royale', label: 'Royale' },
]

function ThemeSection() {
    const user = useAuthStore(state => state.user)
    const setUser = useAuthStore(state => state.setUser)

    const handleSelectTheme = async (themeId: string) => {
        if (!user || user.theme === themeId) return
        try {
            await updateThemeApi(themeId)
            setUser({ ...user, theme: themeId })
        } catch {
            // errori di rete: gestiti dall'interceptor axios
        }
    }

    return (
        <div className="profile-card rounded-xl p-5">
            <h2 className="text-sm font-medium profile-card-title mb-3">Aspetto</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {themes.map(theme => (
                    <button
                        key={theme.id}
                        onClick={() => handleSelectTheme(theme.id)}
                        className={`theme-option rounded-lg p-3 flex items-center gap-3 ${user?.theme === theme.id ? 'theme-option-active' : ''}`}
                    >
                        <div className="theme-preview" data-theme={theme.id}>
                            <div className="theme-preview-accent"></div>
                        </div>
                        <span className="text-sm">{theme.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

export default ThemeSection