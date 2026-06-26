import { useEffect, useRef } from "react"
import { Bot, Send, X } from "lucide-react"
import ChatbotMessage from "./ChatbotMessage"
import type { ChatbotMessage as ChatbotMessageType, TicketSuggestion } from "../../types"
import './Chatbot.css'

interface Props {
    messages: ChatbotMessageType[]
    suggestions: Record<number, TicketSuggestion>
    isLoading: boolean
    input: string
    onInputChange: (value: string) => void
    onSend: () => void
    onClose: () => void
    onOpenTicket: (suggestion: TicketSuggestion) => void
}

const ChatbotPanel = ({
    messages,
    suggestions,
    isLoading,
    input,
    onInputChange,
    onSend,
    onClose,
    onOpenTicket,
}: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: 'smooth',
        })
    }, [messages, isLoading])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            if (input.trim() && !isLoading) {
                onSend()
            }
        }
    }

    return (
        <div className="chatbot-panel">
            <div className="chatbot-header">
                <div className="chatbot-header-left">
                    <div className="chatbot-header-avatar">
                        <Bot size={16} />
                    </div>
                    <div>
                        <h3 className="chatbot-header-title">Mira</h3>
                        <p className="chatbot-header-subtitle">Assistente Mirivo</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="chatbot-close-button"
                    aria-label="Chiudi chat"
                >
                    <X size={20} />
                </button>
            </div>

            <div ref={scrollRef} className="chatbot-messages">
                {messages.length === 0 && (
                    <div className="chatbot-empty">
                        Ciao! Sono Mira. Chiedimi qualcosa sulle FAQ aziendali o ti aiuto ad aprire un ticket.
                    </div>
                )}

                {messages.map((m, i) => (
                    <ChatbotMessage
                        key={i}
                        message={m}
                        suggestion={suggestions[i]}
                        onOpenTicket={onOpenTicket}
                    />
                ))}

                {isLoading && (
                    <div className="chatbot-message-row bot">
                        <div className="chatbot-avatar-bot">
                            <Bot size={16} />
                        </div>
                        <div className="chatbot-typing-bubble">
                            <span /><span /><span />
                        </div>
                    </div>
                )}
            </div>

            <div className="chatbot-footer">
                <textarea
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Scrivi un messaggio..."
                    rows={1}
                    className="chatbot-textarea"
                />
                <button
                    onClick={onSend}
                    disabled={!input.trim() || isLoading}
                    className="chatbot-send-button"
                    aria-label="Invia messaggio"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    )
}

export default ChatbotPanel