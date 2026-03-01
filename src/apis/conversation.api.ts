import axiosInstance from "./axiosInstance";
import { User } from "../types/user.type";
import { ApiResponse } from "@/types/response.type";

export interface Participant extends User {
  joined_at: string;
  last_seen_message_id?: string;
  is_online?: boolean;
  last_online?: string;
}

export interface Attachment {
  url: string;
  type: string;
}

export interface Conversation {
  id: string;
  type: string;
  created_at: string;
  participants: Participant[];
  last_message: string;
  last_message_at?: string;
  unread_count?: number;
  name?: string;
  avatar_url?: string;
  updated_at?: string;
  last_message_id?: string;
  last_seen_message_id?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  user?: User;
  is_read?: boolean;
  attachments?: Attachment[];
}

export interface MessageResponse {
  items: Message[];
  nextCursor?: string;
  hasMore: boolean;
}

export const getConversationsApi = (page: number, limit: number, signal?: AbortSignal) =>
  axiosInstance.get('/conversations', { params: { page, limit }, signal });

export const getConversationDetailApi = (conversationId: string) =>
  axiosInstance.get<ApiResponse<Conversation>>(`/conversations/${conversationId}`);

export const getMessagesApi = (conversationId: string) =>
  axiosInstance.get(`/conversations/${conversationId}/messages`);

// export const sendMessageApi = (conversationId: string, content: string) =>
//   axiosInstance.post(`/conversations/${conversationId}/messages`, { content });

export const getMessageApi = (conversationId: string, cursor?: string) =>
  axiosInstance.get<ApiResponse<MessageResponse>>(`/conversations/${conversationId}/messages`, { params: { cursor } });

export const getOrCreatePrivateConversationApi = (recipientId: string) =>
  axiosInstance.post(`/conversations/private/${recipientId}`);
