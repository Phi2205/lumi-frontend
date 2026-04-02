import { Location } from "./location.type";

export type FriendshipStatus = 'none' | 'friend' | 'pending' | 'accepted' | 'rejected' | 'received_pending';

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar_url?: string;
  cover_image?: string;
  bio?: string;
  friend_status?: FriendshipStatus;
  location?: string;
  website?: string;
  created_at?: string;
  birthday?: string;
  user_location?: Location;
  post_count?: number;
  has_story?: boolean;
  mutual_friends_count?: number;
  friend_count?: number;
  has_unseen?: boolean;
}

export interface UserHoverCard {
  id: string;
  username: string;
  name: string;
  avatar_url?: string;
  address?: string;
  friend_count?: number;
}

