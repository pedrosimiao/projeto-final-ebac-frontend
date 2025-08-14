// src/types.d.ts

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  bio?: string | null;
  profile_picture?: string | null;
  cover_image?: string | null;
  occupation?: string | null;
  location?: string | null;
  birth_date?: string | null;
  joined_at?: string;
}


export interface IFollower {
  id: string;
  following: IUser;
  follower: IUser;
  created_at: string;
}

export interface IPost {
  id: string;
  user: IUser;
  content: string;
  image?: string | null;
  video?: string | null;
  created_at: string;
  retweet?: IPost | null;
  total_comments_count?: number;
}

export interface ILike {
  id: string;
  user: IUser;
  post: IPost;
  created_at: string;
}

export interface IComment {
  id: string;
  user: IUser;
  post_id: string;
  parent_comment: IComment | null;
  content: string;
  image?: string | null;
  video?: string | null;
  created_at: string;
  comments: IComment[];
  reply_count: number;
}

export type NotificationType = "like" | "comment" | "follow" | "retweet" | "mention";

export interface INotification {
  id: string;
  type: NotificationType;
  fromUser: IUser;
  targetPostId: string | null;
  timestamp: string;
  isRead: boolean;
}

export interface IPaginatedResponse<T> {
  count?: number;
  next: string | null;
  previous: string | null;
  results: T;
}
