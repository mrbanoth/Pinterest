import React, { useState } from 'react';
import { ArrowLeft, Lock, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SafeImage } from '../components/common/SafeImage';
import { MasonryGrid } from '../components/pins/MasonryGrid';

interface BoardDetailPageProps {
  boardId: string;
}

export const BoardDetailPage: React.FC<BoardDetailPageProps> = ({ boardId }) => {
  const {
    boards,
    pins,
    currentUser,
    getUserById,
    navigate,
    goBack,
    updateBoard,
    deleteBoard,
    removePinFromBoard,
  } = useApp();

  const board = boards.find((b) => b.id === boardId);
  const [editOpen, setEditOpen] = useState(false);
  const [title, setTitle] = useState(board?.title || '');
  const [description, setDescription] = useState(board?.description || '');
  const [isPrivate, setIsPrivate] = useState(board?.isPrivate || false);

  if (!board) {
    return (
      <main className="max-w-xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-zinc-900">Board not found</h1>
        <button
          onClick={() => navigate({ name: 'profile' })}
          className="mt-6 px-5 py-2.5 rounded-full bg-zinc-900 text-white text-sm font-semibold cursor-pointer"
        >
          Go to Profile
        </button>
      </main>
    );
  }

  const owner = getUserById(board.ownerId);
  const isOwner = owner.id === currentUser.id;
  const boardPins = board.pinIds
    .map((id) => pins.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateBoard(board.id, {
      title: title.trim(),
      description: description.trim(),
      isPrivate,
    });
    setEditOpen(false);
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-6 pb-20 md:pb-16">
      <div className="mb-6">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full hover:bg-zinc-100 text-sm font-semibold text-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Board Header */}
      <section className="max-w-2xl mx-auto text-center pb-10 mb-8 border-b border-zinc-200">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950">
            {board.title}
          </h1>
          {board.isPrivate && (
            <Lock className="w-5 h-5 text-zinc-500 shrink-0" aria-label="Secret board" />
          )}
        </div>

        <p className="text-sm text-zinc-600 mt-2.5 max-w-lg mx-auto leading-relaxed">
          {board.description}
        </p>

        <div className="mt-4 flex items-center justify-center gap-3 text-xs text-zinc-500">
          <button
            onClick={() => navigate({ name: 'profile', username: owner.username })}
            className="inline-flex items-center gap-2 hover:text-zinc-950 font-semibold cursor-pointer"
          >
            <SafeImage
              src={owner.avatarUrl}
              alt={owner.displayName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span>{owner.displayName}</span>
          </button>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">
            {boardPins.length} {boardPins.length === 1 ? 'Pin' : 'Pins'}
          </span>
          <span aria-hidden="true">·</span>
          <span>Updated {board.updatedAt}</span>
        </div>

        {isOwner && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => {
                setTitle(board.title);
                setDescription(board.description);
                setIsPrivate(board.isPrivate);
                setEditOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit board</span>
            </button>
            <button
              onClick={() => navigate({ name: 'home' })}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Find more ideas</span>
            </button>
          </div>
        )}
      </section>

      <MasonryGrid
        pins={boardPins}
        emptyTitle="This board has no pins yet"
        emptySubtitle="Save inspiration from the Home Feed or Explore page to populate this board."
        onResetFilters={() => navigate({ name: 'home' })}
        onRemoveFromBoard={isOwner ? (pinId) => removePinFromBoard(pinId, board.id) : undefined}
      />

      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
          onClick={() => setEditOpen(false)}
        >
          <div
            className="w-full max-w-[440px] bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-zinc-900">Edit board</h2>
              <button
                onClick={() => setEditOpen(false)}
                aria-label="Close"
                className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Board name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                />
              </div>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 accent-[#E60023]"
                />
                <span className="text-sm font-semibold text-zinc-900">
                  Keep this board secret
                </span>
              </label>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => deleteBoard(board.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-[#E60023] cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete board</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
