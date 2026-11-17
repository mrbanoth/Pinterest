import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import pinsData from '../data/pins.json';
import boardsData from '../data/boards.json';
import usersData from '../data/users.json';
import categoriesData from '../data/categories.json';
import collectionsData from '../data/collections.json';
import notificationsData from '../data/notifications.json';
import {
  BoardItem,
  CategoryItem,
  EditorialCollection,
  NotificationItem,
  PageRoute,
  PinItem,
  UserProfile,
} from '../types';

interface AppContextValue {
  route: PageRoute;
  navigate: (route: PageRoute) => void;
  goBack: () => void;
  pins: PinItem[];
  boards: BoardItem[];
  users: UserProfile[];
  categories: CategoryItem[];
  collections: EditorialCollection[];
  notifications: NotificationItem[];
  currentUser: UserProfile;
  isAuthenticated: boolean;
  loginDemo: (name?: string) => void;
  logout: () => void;
  authModalMode: 'login' | 'signup' | null;
  openAuthModal: (mode: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  likedPinIds: string[];
  toggleLikePin: (pinId: string) => void;
  followedUserIds: string[];
  toggleFollowUser: (userId: string) => void;
  isPinSaved: (pinId: string) => boolean;
  getBoardsForPin: (pinId: string) => BoardItem[];
  savePinToBoard: (pinId: string, boardId: string) => void;
  removePinFromBoard: (pinId: string, boardId: string) => void;
  createBoard: (title: string, description: string, category: string, isPrivate: boolean, initialPinId?: string) => BoardItem;
  updateBoard: (boardId: string, updates: Partial<Pick<BoardItem, 'title' | 'description' | 'isPrivate'>>) => void;
  deleteBoard: (boardId: string) => void;
  createPin: (pinInput: {
    title: string;
    description: string;
    imageUrl: string;
    aspectRatio: PinItem['aspectRatio'];
    category: string;
    tags: string[];
    sourceDomain: string;
    sourceUrl: string;
    boardId?: string;
  }) => PinItem;
  addComment: (pinId: string, text: string) => void;
  updateCurrentUser: (updates: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'location' | 'website'>>) => void;
  markAllNotificationsRead: () => void;
  saveModalPinId: string | null;
  openSaveModal: (pinId: string) => void;
  closeSaveModal: () => void;
  toast: { message: string; actionLabel?: string; onAction?: () => void } | null;
  showToast: (message: string, actionLabel?: string, onAction?: () => void) => void;
  getUserById: (id: string) => UserProfile;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  PINS: 'pinterest_clone_pins_v1',
  BOARDS: 'pinterest_clone_boards_v1',
  USERS: 'pinterest_clone_users_v1',
  LIKES: 'pinterest_clone_likes_v1',
  FOLLOWS: 'pinterest_clone_follows_v1',
  AUTH: 'pinterest_clone_auth_v1',
};

function parseHashToRoute(): PageRoute {
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (!hash || hash === 'landing') return { name: 'landing' };
  const parts = hash.split('/');
  if (parts[0] === 'home') return { name: 'home' };
  if (parts[0] === 'explore') return { name: 'explore', collectionId: parts[1] };
  if (parts[0] === 'pin' && parts[1]) return { name: 'pin', pinId: parts[1] };
  if (parts[0] === 'profile') return { name: 'profile', username: parts[1] };
  if (parts[0] === 'board' && parts[1]) return { name: 'board', boardId: parts[1] };
  if (parts[0] === 'create') return { name: 'create' };
  return { name: 'landing' };
}

function routeToHash(route: PageRoute): string {
  switch (route.name) {
    case 'landing':
      return '#/landing';
    case 'home':
      return '#/home';
    case 'explore':
      return route.collectionId ? `#/explore/${route.collectionId}` : '#/explore';
    case 'pin':
      return `#/pin/${route.pinId}`;
    case 'profile':
      return route.username ? `#/profile/${route.username}` : '#/profile';
    case 'board':
      return `#/board/${route.boardId}`;
    case 'create':
      return '#/create';
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [route, setRoute] = useState<PageRoute>(() => parseHashToRoute());

  const [pins, setPins] = useState<PinItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PINS);
      return saved ? JSON.parse(saved) : (pinsData as PinItem[]);
    } catch {
      return pinsData as PinItem[];
    }
  });

  const [boards, setBoards] = useState<BoardItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOARDS);
      return saved ? JSON.parse(saved) : (boardsData as BoardItem[]);
    } catch {
      return boardsData as BoardItem[];
    }
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : (usersData as UserProfile[]);
    } catch {
      return usersData as UserProfile[];
    }
  });

  const [likedPinIds, setLikedPinIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIKES);
      return saved ? JSON.parse(saved) : ['pin-101', 'pin-105'];
    } catch {
      return ['pin-101', 'pin-105'];
    }
  });

  const [followedUserIds, setFollowedUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWS);
      return saved ? JSON.parse(saved) : ['user-arjun'];
    } catch {
      return ['user-arjun'];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(
    notificationsData as NotificationItem[]
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);
  const [saveModalPinId, setSaveModalPinId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins));
  }, [pins]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOARDS, JSON.stringify(boards));
  }, [boards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likedPinIds));
  }, [likedPinIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLLOWS, JSON.stringify(followedUserIds));
  }, [followedUserIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashToRoute());
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((nextRoute: PageRoute) => {
    const nextHash = routeToHash(nextRoute);
    if (window.location.hash !== nextHash) {
      window.location.hash = nextHash;
    } else {
      setRoute(nextRoute);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ name: 'home' });
    }
  }, [navigate]);

  const showToast = useCallback(
    (message: string, actionLabel?: string, onAction?: () => void) => {
      setToast({ message, actionLabel, onAction });
    },
    []
  );

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  const currentUser = users[0];

  const getUserById = useCallback(
    (id: string) => users.find((u) => u.id === id) || users[0],
    [users]
  );

  const loginDemo = useCallback(
    (displayName?: string) => {
      if (displayName && displayName.trim()) {
        setUsers((prev) =>
          prev.map((u, idx) => (idx === 0 ? { ...u, displayName: displayName.trim() } : u))
        );
      }
      setIsAuthenticated(true);
      setAuthModalMode(null);
      if (route.name === 'landing') {
        navigate({ name: 'home' });
      }
      showToast(`Signed in as ${displayName?.trim() || currentUser.displayName}`);
    },
    [currentUser.displayName, navigate, route.name, showToast]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    navigate({ name: 'landing' });
    showToast('Signed out of Pinterest');
  }, [navigate, showToast]);

  const toggleLikePin = useCallback((pinId: string) => {
    setLikedPinIds((prev) => {
      const exists = prev.includes(pinId);
      setPins((allPins) =>
        allPins.map((p) =>
          p.id === pinId ? { ...p, likesCount: p.likesCount + (exists ? -1 : 1) } : p
        )
      );
      return exists ? prev.filter((id) => id !== pinId) : [...prev, pinId];
    });
  }, []);

  const toggleFollowUser = useCallback(
    (userId: string) => {
      setFollowedUserIds((prev) => {
        const exists = prev.includes(userId);
        const target = users.find((u) => u.id === userId);
        showToast(exists ? `Unfollowed ${target?.displayName || 'creator'}` : `Following ${target?.displayName || 'creator'}`);
        return exists ? prev.filter((id) => id !== userId) : [...prev, userId];
      });
    },
    [showToast, users]
  );

  const getBoardsForPin = useCallback(
    (pinId: string) => boards.filter((b) => b.pinIds.includes(pinId)),
    [boards]
  );

  const isPinSaved = useCallback(
    (pinId: string) => boards.some((b) => b.ownerId === currentUser.id && b.pinIds.includes(pinId)),
    [boards, currentUser.id]
  );

  const savePinToBoard = useCallback(
    (pinId: string, boardId: string) => {
      let targetBoardTitle = '';
      let added = false;
      setBoards((prev) =>
        prev.map((b) => {
          if (b.id !== boardId) return b;
          targetBoardTitle = b.title;
          if (b.pinIds.includes(pinId)) return b;
          added = true;
          return { ...b, pinIds: [pinId, ...b.pinIds], updatedAt: 'Just now' };
        })
      );
      if (added) {
        setPins((prev) =>
          prev.map((p) => (p.id === pinId ? { ...p, savesCount: p.savesCount + 1 } : p))
        );
      }
      showToast(`Saved to ${targetBoardTitle || 'Board'}`, 'View board', () =>
        navigate({ name: 'board', boardId })
      );
    },
    [navigate, showToast]
  );

  const removePinFromBoard = useCallback(
    (pinId: string, boardId: string) => {
      setBoards((prev) =>
        prev.map((b) =>
          b.id === boardId ? { ...b, pinIds: b.pinIds.filter((id) => id !== pinId) } : b
        )
      );
      showToast('Removed pin from board');
    },
    [showToast]
  );

  const createBoard = useCallback(
    (
      title: string,
      description: string,
      category: string,
      isPrivate: boolean,
      initialPinId?: string
    ): BoardItem => {
      const newBoard: BoardItem = {
        id: `board-${Date.now()}`,
        title: title.trim(),
        description: description.trim() || 'Curated visual inspiration board.',
        ownerId: currentUser.id,
        pinIds: initialPinId ? [initialPinId] : [],
        isPrivate,
        updatedAt: 'Just now',
        category: category || 'Home Decor',
      };
      setBoards((prev) => [newBoard, ...prev]);
      showToast(`Created board "${newBoard.title}"`);
      return newBoard;
    },
    [currentUser.id, showToast]
  );

  const updateBoard = useCallback(
    (boardId: string, updates: Partial<Pick<BoardItem, 'title' | 'description' | 'isPrivate'>>) => {
      setBoards((prev) => prev.map((b) => (b.id === boardId ? { ...b, ...updates, updatedAt: 'Just now' } : b)));
      showToast('Board updated');
    },
    [showToast]
  );

  const deleteBoard = useCallback(
    (boardId: string) => {
      setBoards((prev) => prev.filter((b) => b.id !== boardId));
      navigate({ name: 'profile' });
      showToast('Board deleted');
    },
    [navigate, showToast]
  );

  const createPin = useCallback(
    (pinInput: {
      title: string;
      description: string;
      imageUrl: string;
      aspectRatio: PinItem['aspectRatio'];
      category: string;
      tags: string[];
      sourceDomain: string;
      sourceUrl: string;
      boardId?: string;
    }): PinItem => {
      const newPin: PinItem = {
        id: `pin-${Date.now()}`,
        title: pinInput.title.trim(),
        description: pinInput.description.trim(),
        imageUrl: pinInput.imageUrl,
        aspectRatio: pinInput.aspectRatio,
        category: pinInput.category,
        tags: pinInput.tags,
        palette: ['#E60023', '#EAE3D8', '#6B7268', '#18181B'],
        sourceDomain: pinInput.sourceDomain || 'pinterest.in',
        sourceUrl: pinInput.sourceUrl || 'https://in.pinterest.com',
        creatorId: currentUser.id,
        savesCount: 1,
        likesCount: 1,
        dimensions: '1200 × 1600 px',
        createdAt: new Date().toISOString().slice(0, 10),
        comments: [],
      };
      setPins((prev) => [newPin, ...prev]);
      if (pinInput.boardId) {
        setBoards((prev) =>
          prev.map((b) =>
            b.id === pinInput.boardId
              ? { ...b, pinIds: [newPin.id, ...b.pinIds], updatedAt: 'Just now' }
              : b
          )
        );
      }
      showToast('Published new Pin');
      return newPin;
    },
    [currentUser.id, showToast]
  );

  const addComment = useCallback(
    (pinId: string, text: string) => {
      if (!text.trim()) return;
      const newComment = {
        id: `c-${Date.now()}`,
        userId: currentUser.id,
        authorName: currentUser.displayName,
        authorAvatar: currentUser.avatarUrl,
        text: text.trim(),
        createdAt: 'Just now',
      };
      setPins((prev) =>
        prev.map((p) => (p.id === pinId ? { ...p, comments: [...p.comments, newComment] } : p))
      );
      showToast('Note added');
    },
    [currentUser.avatarUrl, currentUser.displayName, currentUser.id, showToast]
  );

  const updateCurrentUser = useCallback(
    (updates: Partial<Pick<UserProfile, 'displayName' | 'bio' | 'location' | 'website'>>) => {
      setUsers((prev) =>
        prev.map((u, idx) => (idx === 0 ? { ...u, ...updates } : u))
      );
      showToast('Profile updated');
    },
    [showToast]
  );

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  return (
    <AppContext.Provider
      value={{
        route,
        navigate,
        goBack,
        pins,
        boards,
        users,
        categories: categoriesData as CategoryItem[],
        collections: collectionsData as EditorialCollection[],
        notifications,
        currentUser,
        isAuthenticated,
        loginDemo,
        logout,
        authModalMode,
        openAuthModal: (mode) => setAuthModalMode(mode),
        closeAuthModal: () => setAuthModalMode(null),
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        likedPinIds,
        toggleLikePin,
        followedUserIds,
        toggleFollowUser,
        isPinSaved,
        getBoardsForPin,
        savePinToBoard,
        removePinFromBoard,
        createBoard,
        updateBoard,
        deleteBoard,
        createPin,
        addComment,
        updateCurrentUser,
        markAllNotificationsRead,
        saveModalPinId,
        openSaveModal: (pinId) => setSaveModalPinId(pinId),
        closeSaveModal: () => setSaveModalPinId(null),
        toast,
        showToast,
        getUserById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
