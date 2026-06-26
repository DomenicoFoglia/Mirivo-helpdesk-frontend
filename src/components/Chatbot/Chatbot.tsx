import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import ChatbotPanel from "./ChatbotPanel"
import { askChatbotApi } from "../../api/chatbot"
import type { ChatbotMessage, TicketSuggestion } from "../../types"

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatbotMessage[]>([])
    const [suggestions, setSuggestions] = useState<Record<number, TicketSuggestion>>({})
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const handleSend = async () => {
        const text = input.trim()
        if (!text || isLoading) return

        const userMessage: ChatbotMessage = { role: 'user', content: text }
        const historyForGemini = messages
        const newMessages = [...messages, userMessage]

        setMessages(newMessages)
        setInput('')
        setIsLoading(true)

        try {
            const response = await askChatbotApi(text, historyForGemini)

            const assistantMessage: ChatbotMessage = {
                role: 'assistant',
                content: response.message,
            }

            const assistantIndex = newMessages.length

            setMessages([...newMessages, assistantMessage])

            if (response.ticket_suggestion) {
                setSuggestions((prev) => ({
                    ...prev,
                    [assistantIndex]: response.ticket_suggestion!,
                }))
            }
        } catch {
            setMessages([
                ...newMessages,
                {
                    role: 'assistant',
                    content: 'Mi dispiace, qualcosa è andato storto. Riprova fra poco.',
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleOpenTicket = (suggestion: TicketSuggestion) => {
        setIsOpen(false)
        navigate('/user/dashboard', {
            state: { ticketSuggestion: suggestion },
        })
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="chatbot-fab"
                aria-label="Apri assistente Mira"
            >
                <MessageCircle size={24} />
            </button>
        )
    }

    return (
        <ChatbotPanel
            messages={messages}
            suggestions={suggestions}
            isLoading={isLoading}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onClose={() => setIsOpen(false)}
            onOpenTicket={handleOpenTicket}
        />
    )
}

export default Chatbot