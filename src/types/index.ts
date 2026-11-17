export type PageRoute =
  | { name: 'landing' }
  | { name: 'home' }
  | { name: 'explore'; collectionId?: string }
  | { name: 'pin'; pinId: string }
  | { name: 'profile'; username?: string }
  | { name: 'board'; boardId: string }
  | { name: 'create' };

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  location: string;
  website: string;
  followersCount: number;
  followingCount: number;
  verified?: boolean;
}

export interface PinComment {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface PinItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  aspectRatio: '3/4' | '4/3' | '1/1' | '2/3';
  category: string;
  tags: string[];
  palette: string[];
  sourceDomain: string;
  sourceUrl: string;
  creatorId: string;
  savesCount: number;
  likesCount: number;
  dimensions: string;
  createdAt: string;
  comments: PinComment[];
}

export interface BoardItem {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  pinIds: string[];
  isPrivate: boolean;
  updatedAt: string;
  category: string;
}

export interface CategoryItem {
  id: string;
  label: string;
  slug: string;
  coverImage: string;
  tagline: string;
}

export interface EditorialCollection {
  id: string;
  title: string;
  subtitle: string;
  curator: string;
  coverImage: string;
  category: string;
  pinIds: string[];
  featured?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'save' | 'collection' | 'follow' | 'board';
  title: string;
  detail: string;
  timeAgo: string;
  thumbnailUrl: string;
  targetPinId?: string;
  targetCollectionId?: string;
  unread: boolean;
}
