import api from "./axios"
import type { ChatbotMessage, ChatbotResponse } from "../types"

export const askChatbotApi = async (
    message: string,
    history: ChatbotMessage[] = []
) => {
    const res = await api.post<ChatbotResponse>('/chatbot/ask', {
        message,
        history,
    })
    return res.data
}