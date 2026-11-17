import React from 'react';
import { ArrowUpRight, Check, Share2, FolderPlus } from 'lucide-react';
import { PinItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../common/SafeImage';

interface PinCardProps {
  pin: PinItem;
  onRemoveFromBoard?: (pinId: string) => void;
}

export const PinCard: React.FC<PinCardProps> = ({ pin, onRemoveFromBoard }) => {
  const {
    navigate,
    getUserById,
    isPinSaved,
    boards,
    currentUser,
    savePinToBoard,
    openSaveModal,
    showToast,
  } = useApp();

  const creator = getUserById(pin.creatorId);
  const saved = isPinSaved(pin.id);
  const myBoards = boards.filter((b) => b.ownerId === currentUser.id);
  const defaultBoard = myBoards[0];

  const aspectClass =
    pin.aspectRatio === '4/3'
      ? 'aspect-[4/3]'
      : pin.aspectRatio === '1/1'
        ? 'aspect-square'
        : pin.aspectRatio === '2/3'
          ? 'aspect-[2/3]'
          : 'aspect-[3/4]';

  const handleQuickSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (defaultBoard && !saved) {
      savePinToBoard(pin.id, defaultBoard.id);
    } else {
      openSaveModal(pin.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/pin/${pin.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    showToast('Pin link copied to clipboard');
  };

  return (
    <article className="masonry-item mb-6 group">
      <div
        onClick={() => navigate({ name: 'pin', pinId: pin.id })}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate({ name: 'pin', pinId: pin.id });
          }
        }}
        className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden bg-zinc-100 cursor-zoom-in focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900`}
      >
        <SafeImage
          src={pin.imageUrl}
          alt={pin.title}
          fallbackTitle={pin.title}
          className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
        />

        {/* Subtle Hover Scrim Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/35 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3.5">
          {/* Top Action Row */}
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openSaveModal(pin.id);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-xs text-white text-xs font-semibold transition-colors cursor-pointer max-w-[140px]"
            >
              <FolderPlus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{defaultBoard?.title || 'Choose board'}</span>
            </button>

            <button
              type="button"
              onClick={handleQuickSave}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                saved
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                  : 'bg-[#E60023] text-white hover:bg-[#AD081B]'
              }`}
            >
              {saved && <Check className="w-3.5 h-3.5" />}
              <span>{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>

          {/* Bottom Action Row */}
          <div className="flex items-center justify-between gap-2">
            <a
              href={pin.sourceUrl}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-zinc-900 text-xs font-semibold max-w-[165px] transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{pin.sourceDomain}</span>
            </a>

            <div className="flex items-center gap-1.5">
              {onRemoveFromBoard && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFromBoard(pin.id);
                  }}
                  className="px-2.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Remove
                </button>
              )}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share pin"
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Editorial Below-Card Caption & Creator */}
      <div className="pt-2.5 px-1">
        <button
          onClick={() => navigate({ name: 'pin', pinId: pin.id })}
          className="block text-left w-full cursor-pointer group/title"
        >
          <h3 className="text-[13.5px] font-semibold text-zinc-900 leading-snug line-clamp-2 group-hover/title:underline underline-offset-2">
            {pin.title}
          </h3>
        </button>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <button
            onClick={() => navigate({ name: 'profile', username: creator.username })}
            className="flex items-center gap-2 min-w-0 cursor-pointer group/user"
          >
            <SafeImage
              src={creator.avatarUrl}
              alt={creator.displayName}
              className="w-5 h-5 rounded-full object-cover shrink-0 border border-zinc-200"
            />
            <span className="text-xs text-zinc-600 group-hover/user:text-zinc-950 truncate">
              {creator.displayName}
            </span>
          </button>
          <span className="text-[11px] text-zinc-400 tabular-nums shrink-0">
            {pin.savesCount.toLocaleString()} saves
          </span>
        </div>
      </div>
    </article>
  );
};
