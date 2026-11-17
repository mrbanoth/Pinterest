import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Heart,
  Share2,
  Maximize2,
  X,
  FolderPlus,
  Send,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SafeImage } from '../components/common/SafeImage';
import { MasonryGrid } from '../components/pins/MasonryGrid';

interface PinDetailPageProps {
  pinId: string;
}

export const PinDetailPage: React.FC<PinDetailPageProps> = ({ pinId }) => {
  const {
    pins,
    navigate,
    goBack,
    getUserById,
    isPinSaved,
    likedPinIds,
    toggleLikePin,
    followedUserIds,
    toggleFollowUser,
    boards,
    currentUser,
    savePinToBoard,
    openSaveModal,
    addComment,
    setSearchQuery,
    setActiveCategory,
    showToast,
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const pin = pins.find((p) => p.id === pinId);

  if (!pin) {
    return (
      <main className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Pin not found</h1>
        <p className="text-sm text-zinc-500 mt-2">
          This pin may have been removed or the link is outdated.
        </p>
        <button
          onClick={() => navigate({ name: 'home' })}
          className="mt-6 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold cursor-pointer"
        >
          Back to Home Feed
        </button>
      </main>
    );
  }

  const creator = getUserById(pin.creatorId);
  const saved = isPinSaved(pin.id);
  const liked = likedPinIds.includes(pin.id);
  const following = followedUserIds.includes(creator.id);
  const myBoards = boards.filter((b) => b.ownerId === currentUser.id);
  const defaultBoard = myBoards[0];

  const relatedPins = pins
    .filter((p) => p.id !== pin.id)
    .sort((a, b) => {
      const aMatch = a.category === pin.category ? 1 : 0;
      const bMatch = b.category === pin.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 10);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(pin.id, commentText);
    setCommentText('');
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 pb-20 md:pb-16">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full hover:bg-zinc-100 text-sm font-semibold text-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
          <button
            onClick={() => {
              setActiveCategory(pin.category);
              setSearchQuery('');
              navigate({ name: 'home' });
            }}
            className="hover:text-zinc-900 hover:underline cursor-pointer"
          >
            {pin.category}
          </button>
          <span aria-hidden="true">/</span>
          <span className="text-zinc-800 font-medium truncate max-w-[240px]">
            {pin.title}
          </span>
        </div>
      </div>

      {/* Main Split Studio Frame */}
      <section className="max-w-[1120px] mx-auto bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Visual Canvas */}
          <div className="lg:col-span-6 bg-zinc-50 p-4 md:p-6 flex flex-col justify-between">
            <div className="relative rounded-2xl overflow-hidden bg-zinc-100 group">
              <SafeImage
                src={pin.imageUrl}
                alt={pin.title}
                loading="eager"
                className="w-full max-h-[680px] object-cover"
              />
              <button
                onClick={() => setLightboxOpen(true)}
                aria-label="Open fullscreen image viewer"
                className="absolute bottom-3.5 right-3.5 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-zinc-900 shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Color Palette Swatch Strip */}
            <div className="mt-4 flex items-center justify-between gap-3 px-1">
              <span className="text-xs font-semibold text-zinc-500">
                Color Palette
              </span>
              <div className="flex items-center gap-2">
                {pin.palette.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(hex).catch(() => {});
                      }
                      showToast(`Copied color ${hex}`);
                    }}
                    title={`Copy ${hex}`}
                    className="group/swatch flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-zinc-200/60 transition-colors cursor-pointer"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: hex }}
                    />
                    <span className="text-[11px] font-mono-tabular text-zinc-600 hidden sm:inline">
                      {hex}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Editorial Metadata & Actions */}
          <div className="lg:col-span-6 p-6 md:p-8 flex flex-col">
            {/* Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleLikePin(pin.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    liked
                      ? 'bg-rose-50 text-[#E60023]'
                      : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span className="tabular-nums">{pin.likesCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href).catch(() => {});
                    }
                    showToast('Pin link copied');
                  }}
                  aria-label="Share pin"
                  className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>

                <a
                  href={pin.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold transition-colors"
                >
                  <span>Visit</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openSaveModal(pin.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Board</span>
                </button>
                <button
                  onClick={() => {
                    if (defaultBoard && !saved) {
                      savePinToBoard(pin.id, defaultBoard.id);
                    } else {
                      openSaveModal(pin.id);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                    saved
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                      : 'bg-[#E60023] text-white hover:bg-[#AD081B]'
                  }`}
                >
                  {saved && <Check className="w-3.5 h-3.5" />}
                  <span>{saved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>

            {/* Pin Copy & Unboxed Metadata */}
            <div className="py-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 mb-2">
                <span>{pin.category}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{pin.dimensions}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{pin.savesCount.toLocaleString()} saves</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                {pin.title}
              </h1>

              <p className="mt-3 text-[15px] text-zinc-700 leading-relaxed">
                {pin.description}
              </p>

              {/* Clickable Unboxed Keyword Links */}
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                {pin.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery(tag);
                      navigate({ name: 'home' });
                    }}
                    className="hover:text-zinc-950 hover:underline underline-offset-2 cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Creator Attribution Row */}
            <div className="py-4 border-y border-zinc-100 flex items-center justify-between gap-4">
              <button
                onClick={() => navigate({ name: 'profile', username: creator.username })}
                className="flex items-center gap-3 min-w-0 text-left cursor-pointer group"
              >
                <SafeImage
                  src={creator.avatarUrl}
                  alt={creator.displayName}
                  className="w-11 h-11 rounded-full object-cover border border-zinc-200 shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-zinc-900 group-hover:underline truncate">
                    {creator.displayName}
                  </p>
                  <p className="text-xs text-zinc-500 tabular-nums truncate">
                    {creator.followersCount.toLocaleString()} followers · {creator.location}
                  </p>
                </div>
              </button>

              {creator.id !== currentUser.id && (
                <button
                  onClick={() => toggleFollowUser(creator.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    following
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                      : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                  }`}
                >
                  {following ? 'Following' : 'Follow'}
                </button>
              )}
            </div>

            {/* Comments & Notes */}
            <div className="pt-5 flex-1 flex flex-col justify-between">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 mb-3 tabular-nums">
                  Notes ({pin.comments.length})
                </h2>

                {pin.comments.length > 0 ? (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1 mb-4">
                    {pin.comments.map((c) => (
                      <div key={c.id} className="flex items-start gap-2.5">
                        <SafeImage
                          src={c.authorAvatar}
                          alt={c.authorName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="text-xs leading-relaxed">
                          <span className="font-semibold text-zinc-900 mr-1.5">
                            {c.authorName}
                          </span>
                          <span className="text-zinc-700">{c.text}</span>
                          <span className="block text-[11px] text-zinc-400 mt-0.5">
                            {c.createdAt}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 mb-4">
                    No studio notes yet. Add a material note or question below.
                  </p>
                )}
              </div>

              <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-2">
                <SafeImage
                  src={currentUser.avatarUrl}
                  alt={currentUser.displayName}
                  className="w-8 h-8 rounded-full object-cover shrink-0"
                />
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a note or comment..."
                  className="flex-1 px-4 py-2 text-sm rounded-full bg-zinc-100 focus:bg-white border border-transparent focus:border-zinc-900 focus:outline-none"
                />
                <button
                  type="submit"
                  aria-label="Send comment"
                  disabled={!commentText.trim()}
                  className="w-9 h-9 rounded-full bg-[#E60023] disabled:bg-zinc-200 disabled:text-zinc-400 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Related Pins Masonry Stream */}
      <section className="mt-14">
        <h2 className="text-xl font-bold text-zinc-950 mb-5">More like this</h2>
        <MasonryGrid pins={relatedPins} />
      </section>

      {/* Fullscreen Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4 md:p-10"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen view"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="max-w-4xl max-h-[88vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <SafeImage
              src={pin.imageUrl}
              alt={pin.title}
              className="max-h-[80vh] w-auto rounded-2xl object-contain"
            />
            <p className="text-sm font-medium text-white/90 mt-3 text-center">
              {pin.title} · {pin.dimensions}
            </p>
          </div>
        </div>
      )}
    </main>
  );
};
