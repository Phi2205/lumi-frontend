import { getConversationsApi, Conversation as ApiConversation, getMessageApi } from "../apis/conversation.api";
import { ConversationUI } from "../components/messages/ConversationList";
import { formatTime } from "../utils/format";

export const mapConversationToUI = (conv: ApiConversation, currentUserId: string): ConversationUI => {
    let name = conv.name || "";
    let avatar = conv.avatar_url || "";

    if (conv.type === 'private') {
        const otherParticipant = conv.participants.find(p => p.id !== currentUserId);
        if (otherParticipant) {
            name = name || otherParticipant.name;
            avatar = avatar || otherParticipant.avatar_url || "";
        }
    }

    return {
        id: conv.id,
        name: name || "Người dùng Lumi",
        avatar: avatar,
        lastMessage: conv.last_message || "Chưa có tin nhắn",
        timestamp: conv.last_message_at ? formatTime(conv.last_message_at) : "",
        unread: (conv.unread_count || 0) > 0,
        unreadCount: conv.unread_count || 0,
        isOnline: false, // Mặc định false, có thể cập nhật qua socket sau
        participants: conv.participants.map(p => ({
            id: p.id,
            name: p.name,
            avatar_url: p.avatar_url || "",
        })),
    };
};

export const getConversationsService = async (page: number, limit: number, signal?: AbortSignal) => {
    try {
        const response = await getConversationsApi(page, limit, signal);
        return response.data;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw error;
    }
};

export const getMessagesService = async (conversationId: string, cursor?: string) => {
    try {
        const response = await getMessageApi(conversationId, cursor);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};