import { getConversationsApi, Conversation as ApiConversation, getMessageApi, getConversationDetailApi, getMediaApi, createGroupConversationApi, getMessageAround, getMessageOlder, getMessageNewer } from "../apis/conversation.api";
import { ConversationUI } from "../components/messages/ConversationList";
import { formatTime } from "../utils/format";
import { searchMessageApi } from "../apis/conversation.api";

export const mapConversationToUI = (conv: ApiConversation, currentUserId: string): ConversationUI => {
    let name = conv.name || "";
    let avatar = conv.avatar_url || "";
    let isOnline = false;
    let lastOnline = undefined;

    if (conv.type === 'private') {
        const otherParticipant = conv.participants.find(p => p.id !== currentUserId);
        if (otherParticipant) {
            name = name || otherParticipant.name;
            avatar = avatar || otherParticipant.avatar_url || "";
            isOnline = otherParticipant.is_online || false;
            lastOnline = otherParticipant.last_online;
        }
    }

    const myParticipant = conv.participants.find(p => p.id === currentUserId);
    console.log("conv", conv.unread_count);
    return {
        id: conv.id,
        name: name || "Lumi User",
        avatar: avatar,
        lastMessage: conv.last_message || "No messages yet",
        type: conv.type,
        timestamp: conv.last_message_at ? formatTime(conv.last_message_at) : "",
        unread: (conv.unread_count || 0) > 0,
        unreadCount: conv.unread_count || 0,
        isOnline: isOnline,
        lastOnline: lastOnline,
        lastMessageId: conv.last_message_id,
        lastSeenMessageId: myParticipant?.last_seen_message_id || conv.last_seen_message_id,
        lastMessageAt: conv.last_message_at,
        participants: conv.participants.map(p => ({
            id: p.id,
            name: p.name,
            avatar_url: p.avatar_url || "",
            lastSeenMessageId: p.last_seen_message_id,
            joined_at: p.joined_at,
            isOnline: p.is_online || false,
            lastOnline: p.last_online,
            username: p.username,
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

export const getConversationDetailService = async (conversationId: string) => {
    try {
        const response = await getConversationDetailApi(conversationId);
        return response.data;
    } catch (error) {
        console.error('Error fetching conversation detail:', error);
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

export const getMediaService = async (conversationId: string, limit: number, next?: string) => {
    try {
        const response = await getMediaApi(conversationId, limit, next);
        return response.data;
    } catch (error) {
        console.error('Error fetching media:', error);
        throw error;
    }
};

export const createGroupConversationService = async (name: string, userIds: string[]) => {
    try {
        const response = await createGroupConversationApi(name, userIds);
        return response.data;
    } catch (error) {
        console.error('Error creating group conversation:', error);
        throw error;
    }
};

export const searchMessageService = async (conversationId: string, query: string, page: string, limit: string) => {
    try {
        const response = await searchMessageApi(conversationId, query, page, limit);
        return response.data;
    } catch (error) {
        console.error('Error searching messages:', error);
        throw error;
    }
};

export const getMessageAroundService = async (conversationId: string, messageId: string, limit: string) => {
    try {
        const response = await getMessageAround(conversationId, messageId, limit);
        return response.data;
    } catch (error) {
        console.error('Error fetching message around:', error);
        throw error;
    }
};

export const getMessageOlderService = async (conversationId: string, cursor: string, limit: number) => {
    try {
        const response = await getMessageOlder(conversationId, cursor, limit);
        return response.data;
    } catch (error) {
        console.error('Error fetching message older:', error);
        throw error;
    }
};

export const getMessageNewerService = async (conversationId: string, cursor: string, limit: number) => {
    try {
        const response = await getMessageNewer(conversationId, cursor, limit);
        return response.data;
    } catch (error) {
        console.error('Error fetching message newer:', error);
        throw error;
    }
};