import React from 'react';
import { Lock } from 'lucide-react';
import { BoardItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { SafeImage } from '../common/SafeImage';

interface BoardCardProps {
  board: BoardItem;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const { pins, navigate } = useApp();

  const boardPins = board.pinIds
    .map((id) => pins.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const mainPin = boardPins[0];
  const secondPin = boardPins[1];
  const thirdPin = boardPins[2];

  return (
    <button
      onClick={() => navigate({ name: 'board', boardId: board.id })}
      className="group text-left w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 rounded-2xl"
    >
      {/* Signature 3-Panel Pinterest Board Collage */}
      <div className="grid grid-cols-3 gap-0.5 aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/70">
        <div className="col-span-2 h-full bg-zinc-100 overflow-hidden">
          {mainPin ? (
            <SafeImage
              src={mainPin.imageUrl}
              alt={board.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="w-full h-full bg-zinc-100" />
          )}
        </div>
        <div className="col-span-1 grid grid-rows-2 gap-0.5 h-full">
          <div className="bg-zinc-100 overflow-hidden">
            {secondPin ? (
              <SafeImage
                src={secondPin.imageUrl}
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full bg-zinc-200/60" />
            )}
          </div>
          <div className="bg-zinc-100 overflow-hidden">
            {thirdPin ? (
              <SafeImage
                src={thirdPin.imageUrl}
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full bg-zinc-200/60" />
            )}
          </div>
        </div>
      </div>

      {/* Unboxed Editorial Board Metadata */}
      <div className="pt-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-bold text-zinc-900 group-hover:underline underline-offset-2 truncate">
            {board.title}
          </h3>
          {board.isPrivate && <Lock className="w-3.5 h-3.5 text-zinc-500 shrink-0" />}
        </div>
        <p className="text-xs text-zinc-500 mt-0.5 tabular-nums">
          {boardPins.length} {boardPins.length === 1 ? 'Pin' : 'Pins'} · Updated {board.updatedAt}
        </p>
      </div>
    </button>
  );
};
