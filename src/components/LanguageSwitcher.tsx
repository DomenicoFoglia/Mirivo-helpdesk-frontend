import { useTranslation } from 'react-i18next'

type Variant = 'dark' | 'light'

function LanguageSwitcher({ variant = 'dark' }: { variant?: Variant }) {
    const { i18n } = useTranslation()

    const toggleLanguage = () => {
        const newLang = i18n.language === 'it' ? 'en' : 'it'
        i18n.changeLanguage(newLang)
    }

    return (
        <button
            className={`lang-switcher lang-switcher-${variant}`}
            onClick={toggleLanguage}
        >
            {i18n.language === 'it' ? '🇮🇹 IT' : '🇬🇧 EN'}
        </button>
    )
}

export default LanguageSwitcher