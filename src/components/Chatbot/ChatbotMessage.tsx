import { Bot, Ticket as TicketIcon } from "lucide-react"
import type { ChatbotMessage as ChatbotMessageType, TicketSuggestion } from "../../types"

interface Props {
    message: ChatbotMessageType
    suggestion?: TicketSuggestion
    onOpenTicket?: (suggestion: TicketSuggestion) => void
}

const ChatbotMessage = ({ message, suggestion, onOpenTicket }: Props) => {
    const isUser = message.role === 'user'
    const side = isUser ? 'user' : 'bot'

    return (
        <div className={`chatbot-message-row ${side}`}>
            {!isUser && (
                <div className="chatbot-avatar-bot">
                    <Bot size={16} />
                </div>
            )}

            <div className={`chatbot-bubble-wrapper ${side}`}>
                <div className={`chatbot-bubble ${side}`}>
                    {message.content}
                </div>

                {suggestion && onOpenTicket && (
                    <button
                        onClick={() => onOpenTicket(suggestion)}
                        className="chatbot-ticket-button"
                    >
                        <TicketIcon size={12} />
                        Apri ticket
                    </button>
                )}
            </div>
        </div>
    )
}

export default ChatbotMessage