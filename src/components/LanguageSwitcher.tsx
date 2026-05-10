import { useTranslation } from 'react-i18next'

function LanguageSwitcher() {
    const { i18n } = useTranslation()

    const toggleLanguage = () => {
        const newLang = i18n.language === 'it' ? 'en' : 'it'
        i18n.changeLanguage(newLang)
    }

    return (
        <button className="lang-switcher" onClick={toggleLanguage}>
            {i18n.language === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'}
        </button>
    )
}

export default LanguageSwitcher