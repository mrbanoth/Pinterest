import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, X, Plus, User as UserIcon, LogOut, LayoutGrid } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../common/SafeImage';

export const Navbar: React.FC = () => {
  const {
    route,
    navigate,
    searchQuery,
    setSearchQuery,
    setActiveCategory,
    pins,
    notifications,
    markAllNotificationsRead,
    currentUser,
    isAuthenticated,
    openAuthModal,
    logout,
  } = useApp();

  const [searchFocused, setSearchFocused] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quickQueries = [
    'Japandi living',
    'Masala chai',
    'Jaipur arches',
    'Indigo textile',
    'Bauhaus poster',
    'Walnut desk',
  ];

  const matchedPins = searchQuery.trim()
    ? pins
        .filter(
          (p) =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  if (route.name === 'landing') {
    return (
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/70">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 h-16 md:h-20 flex items-center justify-between gap-8">
          <button
            onClick={() => navigate({ name: 'landing' })}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 rounded-lg"
          >
            <span className="w-8 h-8 rounded-full bg-[#E60023] text-white font-extrabold text-base flex items-center justify-center">
              P
            </span>
            <span className="text-xl font-bold tracking-tight text-[#E60023]">
              Pinterest
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-zinc-700">
            <button
              onClick={() => navigate({ name: 'home' })}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              For You
            </button>
            <button
              onClick={() => navigate({ name: 'explore' })}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Explore
            </button>
            <button
              onClick={() => navigate({ name: 'create' })}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Create
            </button>
            <button
              onClick={() => navigate({ name: 'profile' })}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Boards
            </button>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {isAuthenticated ? (
              <button
                onClick={() => navigate({ name: 'home' })}
                className="px-5 py-2.5 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Feed
              </button>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="px-5 py-2.5 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-16 md:h-[72px] flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand + Core Navigation */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={() => navigate({ name: 'landing' })}
            aria-label="Pinterest Landing"
            className="flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-zinc-900"
          >
            <span className="w-9 h-9 rounded-full bg-[#E60023] text-white font-extrabold text-lg flex items-center justify-center">
              P
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <button
              onClick={() => navigate({ name: 'home' })}
              className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                route.name === 'home'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigate({ name: 'explore' })}
              className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                route.name === 'explore'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              Explore
            </button>
            <button
              onClick={() => navigate({ name: 'create' })}
              className={`px-4 py-2 rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                route.name === 'create'
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950'
              }`}
            >
              Create
            </button>
          </nav>
        </div>

        {/* Zone 2: Unified Search Input with Instant Autocomplete */}
        <div ref={searchRef} className="relative flex-1 max-w-2xl">
          <div
            className={`flex items-center gap-2.5 w-full px-4 h-11 rounded-full bg-zinc-100 border transition-all ${
              searchFocused
                ? 'bg-white border-zinc-900 ring-2 ring-zinc-900/10'
                : 'border-transparent hover:bg-zinc-200/70'
            }`}
          >
            <Search className="w-4 h-4 text-zinc-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (route.name !== 'home' && route.name !== 'explore') {
                  navigate({ name: 'home' });
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchFocused(false);
                  if (route.name !== 'home') navigate({ name: 'home' });
                }
              }}
              placeholder="Search for monsoon courtyards, kulhad chai, linen..."
              className="w-full bg-transparent text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="w-6 h-6 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchFocused && (
            <div className="absolute left-0 right-0 top-13 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 z-50">
              {searchQuery.trim() ? (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 mb-2.5">
                    Matching Pins
                  </p>
                  {matchedPins.length > 0 ? (
                    <div className="space-y-1.5">
                      {matchedPins.map((pin) => (
                        <button
                          key={pin.id}
                          onClick={() => {
                            setSearchFocused(false);
                            navigate({ name: 'pin', pinId: pin.id });
                          }}
                          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 text-left transition-colors cursor-pointer"
                        >
                          <SafeImage
                            src={pin.imageUrl}
                            alt={pin.title}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-zinc-900 truncate">
                              {pin.title}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">
                              {pin.category} · {pin.sourceDomain}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-500 py-3">
                      No exact matches for &ldquo;{searchQuery}&rdquo;. Try another keyword.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 mb-3">
                    Popular visual searches
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {quickQueries.map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setSearchQuery(q);
                          setActiveCategory('all');
                          setSearchFocused(false);
                          navigate({ name: 'home' });
                        }}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200/70 text-xs font-medium text-zinc-800 text-left transition-colors cursor-pointer truncate"
                      >
                        <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{q}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Zone 3: Notifications + Profile Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div ref={notifRef} className="relative">
            <button
              onClick={() => {
                setNotifOpen((o) => !o);
                markAllNotificationsRead();
              }}
              aria-label="Notifications"
              className="relative w-10 h-10 rounded-full flex items-center justify-center text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E60023]" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-4 z-50">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-100">
                  <h3 className="text-sm font-bold text-zinc-900">Updates</h3>
                  <span className="text-xs text-zinc-500">Curated activity</span>
                </div>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        setNotifOpen(false);
                        if (n.targetPinId) {
                          navigate({ name: 'pin', pinId: n.targetPinId });
                        } else if (n.targetCollectionId) {
                          navigate({ name: 'explore', collectionId: n.targetCollectionId });
                        }
                      }}
                      className="w-full flex items-start gap-3 p-2 rounded-xl hover:bg-zinc-50 text-left transition-colors cursor-pointer"
                    >
                      <SafeImage
                        src={n.thumbnailUrl}
                        alt={n.title}
                        className="w-11 h-11 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-zinc-900 leading-snug">
                          {n.title}
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5 truncate">
                          {n.detail} · {n.timeAgo}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div ref={menuRef} className="relative flex items-center gap-1.5">
            <button
              onClick={() => navigate({ name: 'profile' })}
              aria-label="Open Profile"
              className="flex items-center gap-2 p-1 pr-2.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <SafeImage
                src={currentUser.avatarUrl}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full object-cover border border-zinc-200"
              />
              <span className="hidden lg:inline text-xs font-semibold text-zinc-800 whitespace-nowrap">
                {currentUser.displayName.split(' ')[0]}
              </span>
            </button>

            <button
              onClick={() => setUserMenuOpen((o) => !o)}
              aria-label="Account menu"
              className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-zinc-200 p-2 z-50">
                <div className="px-3 py-2 border-b border-zinc-100 mb-1">
                  <p className="text-sm font-bold text-zinc-900 truncate">
                    {currentUser.displayName}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">@{currentUser.username}</p>
                </div>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate({ name: 'profile' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Your Profile &amp; Boards</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate({ name: 'create' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create new Pin</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    navigate({ name: 'landing' });
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 cursor-pointer"
                >
                  <LayoutGrid className="w-4 h-4" />
                  <span>Landing Showcase</span>
                </button>
                <div className="my-1 h-px bg-zinc-100" />
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-700 hover:bg-zinc-100 hover:text-[#E60023] cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-[#E60023] hover:bg-zinc-50 cursor-pointer"
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Log in / Switch</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
