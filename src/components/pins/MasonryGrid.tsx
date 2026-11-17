import React from 'react';
import { PinItem } from '../../types';
import { PinCard } from './PinCard';

interface MasonryGridProps {
  pins: PinItem[];
  emptyTitle?: string;
  emptySubtitle?: string;
  onResetFilters?: () => void;
  onRemoveFromBoard?: (pinId: string) => void;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  pins,
  emptyTitle = 'No matching pins found',
  emptySubtitle = 'Try clearing your search or exploring another visual category.',
  onResetFilters,
  onRemoveFromBoard,
}) => {
  if (pins.length === 0) {
    return (
      <div className="py-20 px-6 text-center max-w-md mx-auto">
        <h3 className="text-lg font-bold text-zinc-900">{emptyTitle}</h3>
        <p className="text-sm text-zinc-500 mt-1.5">{emptySubtitle}</p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="mt-5 px-5 py-2.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            Reset filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-5">
      {pins.map((pin) => (
        <PinCard
          key={pin.id}
          pin={pin}
          onRemoveFromBoard={onRemoveFromBoard}
        />
      ))}
    </div>
  );
};
