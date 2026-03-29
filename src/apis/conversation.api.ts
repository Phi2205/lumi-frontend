import axiosInstance from "./axiosInstance";
import { User } from "../types/user.type";
import { ApiResponse } from "@/types/response.type";
import { Pagination } from "../types/pagination.type";

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

export interface MediaResponse {
  items: Attachment[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface messageSearch {
  id: string;
  conversation_id: string;
  content: string;
  type: string;
  created_at: string;
  sender: User;
}

export interface messageSearchResponse {
  items: messageSearch[];
  pagination: Pagination;
}

export interface MessageAround {
  items: Message[];
  hasMoreBelow: boolean;
  hasMoreAbove: boolean;
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

export const getMediaApi = (conversationId: string, limit: number, next?: string) =>
  axiosInstance.get<ApiResponse<MediaResponse>>(`/conversations/${conversationId}/media`, { params: { limit, next } });

export const createGroupConversationApi = (name: string, userIds: string[]) =>
  axiosInstance.post(`/conversations/group`, { name, userIds });

export const searchMessageApi = (conversationId: string, query: string, page: string, limit: string) =>
  axiosInstance.get<ApiResponse<messageSearchResponse>>(`/conversations/${conversationId}/messages/search`, { params: { query, page, limit } });

export const getMessageAround = (conversationId: string, messageId: string, limit: string) =>
  axiosInstance.get<ApiResponse<MessageAround>>(`/conversations/${conversationId}/messages/${messageId}/around`, { params: { limit } });

export const getMessageOlder = (conversationId: string, cursor: string, limit: number) =>
  axiosInstance.get<ApiResponse<MessageResponse>>(`/conversations/${conversationId}/messages/older`, { params: { cursor, limit } });

export const getMessageNewer = (conversationId: string, cursor: string, limit: number) =>
  axiosInstance.get<ApiResponse<MessageResponse>>(`/conversations/${conversationId}/messages/newer`, { params: { cursor, limit } });