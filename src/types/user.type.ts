export type FriendshipStatus = 'none' | 'friend' | 'pending' | 'accepted' | 'rejected' | 'received_pending';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  friend_status?: FriendshipStatus;
  location?: string;
  website?: string;
  joinDate?: string;
}
