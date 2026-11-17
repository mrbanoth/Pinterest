import React, { useState } from 'react';
import { X, Plus, Check, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../common/SafeImage';

export const SaveToBoardModal: React.FC = () => {
  const {
    saveModalPinId,
    closeSaveModal,
    pins,
    boards,
    currentUser,
    savePinToBoard,
    removePinFromBoard,
    createBoard,
  } = useApp();

  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [creating, setCreating] = useState(false);

  if (!saveModalPinId) return null;

  const pin = pins.find((p) => p.id === saveModalPinId);
  if (!pin) return null;

  const myBoards = boards.filter((b) => b.ownerId === currentUser.id);

  const handleCreateAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    createBoard(newBoardTitle, '', pin.category, false, pin.id);
    setNewBoardTitle('');
    setCreating(false);
    closeSaveModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
      onClick={closeSaveModal}
    >
      <div
        className="w-full max-w-[440px] bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="save-board-title"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="save-board-title" className="text-lg font-bold text-zinc-900">
            Save to board
          </h2>
          <button
            onClick={closeSaveModal}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200/70 mb-5">
          <SafeImage
            src={pin.imageUrl}
            alt={pin.title}
            className="w-12 h-14 rounded-xl object-cover shrink-0"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900 truncate">{pin.title}</p>
            <p className="text-xs text-zinc-500 truncate">
              {pin.category} · {pin.sourceDomain}
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {myBoards.map((board) => {
            const isSavedHere = board.pinIds.includes(pin.id);
            const coverPin = pins.find((p) => p.id === board.pinIds[0]);

            return (
              <div
                key={board.id}
                className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-zinc-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 overflow-hidden shrink-0">
                    {coverPin ? (
                      <SafeImage
                        src={coverPin.imageUrl}
                        alt={board.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-200" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-semibold text-zinc-900 truncate">
                        {board.title}
                      </p>
                      {board.isPrivate && <Lock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />}
                    </div>
                    <p className="text-xs text-zinc-500 tabular-nums">
                      {board.pinIds.length} {board.pinIds.length === 1 ? 'Pin' : 'Pins'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isSavedHere) {
                      removePinFromBoard(pin.id, board.id);
                    } else {
                      savePinToBoard(pin.id, board.id);
                    }
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSavedHere
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                      : 'bg-[#E60023] text-white hover:bg-[#AD081B]'
                  }`}
                >
                  {isSavedHere && <Check className="w-3.5 h-3.5" />}
                  <span>{isSavedHere ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-100">
          {!creating ? (
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create new board</span>
            </button>
          ) : (
            <form onSubmit={handleCreateAndSave} className="flex items-center gap-2">
              <input
                type="text"
                autoFocus
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                placeholder="Board title (e.g. Jaipur Courtyard)"
                className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold cursor-pointer whitespace-nowrap shrink-0"
              >
                Create
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
