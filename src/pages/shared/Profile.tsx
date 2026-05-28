import useAuthStore from "../../store/authStore"
import "./Profile.css"
import ProfileDataSection from "./ProfileDataSection"
import PasswordSection from "./PasswordSection"
import ThemeSection from "./ThemeSection"

function Profile() {
    const user = useAuthStore(state => state.user)

    return (
        <div className="p-6 flex flex-col gap-4 max-w-2xl mx-auto w-full">

            {/* Titolo */}
            <div>
                <h1 className="text-xl font-medium profile-title">Profilo</h1>
                <p className="text-sm profile-subtitle">{user?.email}</p>
            </div>

            {/* Sezione: Dati personali */}
            <ProfileDataSection />

            {/* Sezione: Password */}
            <PasswordSection />

            {/* Sezione: Aspetto */}
            <ThemeSection />

        </div>
    )
}

export default Profile