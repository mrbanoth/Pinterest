import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MasonryGrid } from '../components/pins/MasonryGrid';

type FeedSort = 'for-you' | 'most-saved' | 'following';

export const HomeFeedPage: React.FC = () => {
  const {
    pins,
    categories,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    followedUserIds,
  } = useApp();

  const [sortMode, setSortMode] = useState<FeedSort>('for-you');

  const filteredPins = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const list = pins.filter((pin) => {
      const matchesCat =
        activeCategory === 'all' ||
        pin.category.toLowerCase() === activeCategory.toLowerCase();

      const matchesQuery =
        !q ||
        pin.title.toLowerCase().includes(q) ||
        pin.description.toLowerCase().includes(q) ||
        pin.category.toLowerCase().includes(q) ||
        pin.tags.some((t) => t.toLowerCase().includes(q)) ||
        pin.palette.some((hex) => hex.toLowerCase() === q);

      const matchesFollowing =
        sortMode !== 'following' || followedUserIds.includes(pin.creatorId);

      return matchesCat && matchesQuery && matchesFollowing;
    });

    if (sortMode === 'most-saved') {
      return [...list].sort((a, b) => b.savesCount - a.savesCount);
    }
    return list;
  }, [activeCategory, followedUserIds, pins, searchQuery, sortMode]);

  return (
    <main className="max-w-[1600px] mx-auto px-4 md:px-6 pt-4 pb-20 md:pb-12">
      {/* Category Filter Bar + Feed Mode Segmented Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 mb-5 border-b border-zinc-100">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const active = activeCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-full self-start md:self-auto shrink-0">
          {(
            [
              { id: 'for-you', label: 'For You' },
              { id: 'most-saved', label: 'Most Saved' },
              { id: 'following', label: 'Following' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSortMode(mode.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                sortMode === mode.id
                  ? 'bg-white text-zinc-950 shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Search Status Indicator */}
      {searchQuery.trim() && (
        <div className="mb-5 flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200/80">
          <p className="text-sm text-zinc-700">
            Showing <span className="font-bold text-zinc-950 tabular-nums">{filteredPins.length}</span>{' '}
            {filteredPins.length === 1 ? 'result' : 'results'} for{' '}
            <span className="font-semibold text-zinc-950">&ldquo;{searchQuery}&rdquo;</span>
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-950 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      )}

      <MasonryGrid
        pins={filteredPins}
        emptyTitle="No pins match your current view"
        emptySubtitle="Reset your active category or search term to explore the full curated feed."
        onResetFilters={() => {
          setSearchQuery('');
          setActiveCategory('all');
          setSortMode('for-you');
        }}
      />
    </main>
  );
};
