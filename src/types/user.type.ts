export type FriendshipStatus = 'none' | 'friend' | 'pending' | 'accepted' | 'rejected' | 'received_pending';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  friend_status?: FriendshipStatus;
  friend_request_id?: string; // ID của friend request (nếu có)
  location?: string;
  website?: string;
  joinDate?: string;
}
