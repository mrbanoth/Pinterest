import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SafeImage } from '../components/common/SafeImage';
import { MasonryGrid } from '../components/pins/MasonryGrid';

interface ExplorePageProps {
  initialCollectionId?: string;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({ initialCollectionId }) => {
  const { collections, categories, pins, navigate, setActiveCategory, setSearchQuery } = useApp();
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    initialCollectionId || collections[0]?.id || ''
  );

  useEffect(() => {
    if (initialCollectionId) {
      setSelectedCollectionId(initialCollectionId);
    }
  }, [initialCollectionId]);

  const activeCollection =
    collections.find((c) => c.id === selectedCollectionId) || collections[0];

  const collectionPins = activeCollection
    ? activeCollection.pinIds
        .map((id) => pins.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
    : [];

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 pb-20 md:pb-16">
      {/* Editorial Header */}
      <div className="max-w-2xl mb-8">
        <p className="text-xs font-semibold text-zinc-500">
          November 2026 · Curated Visual Stories
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 mt-1">
          Explore the best of Pinterest
        </h1>
      </div>

      {/* Curated Collections Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {collections.map((col) => {
          const isSelected = col.id === activeCollection?.id;
          return (
            <button
              key={col.id}
              onClick={() => setSelectedCollectionId(col.id)}
              className={`group relative aspect-[3/4] rounded-3xl overflow-hidden text-left cursor-pointer transition-all ${
                isSelected ? 'ring-3 ring-zinc-950 ring-offset-2' : ''
              }`}
            >
              <SafeImage
                src={col.coverImage}
                alt={col.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 flex flex-col justify-end">
                <p className="text-[11px] font-medium text-white/80">
                  {col.category} · Curated by {col.curator}
                </p>
                <h2 className="text-lg font-bold text-white leading-snug mt-1">
                  {col.title}
                </h2>
                <p className="text-xs text-white/80 line-clamp-2 mt-1.5">
                  {col.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </section>

      {/* Active Collection Spotlight Stream */}
      {activeCollection && (
        <section className="mb-14 pt-8 border-t border-zinc-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold text-[#E60023]">
                Featured Collection · {activeCollection.pinIds.length} Pins
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 mt-0.5">
                {activeCollection.title}
              </h2>
              <p className="text-sm text-zinc-600 mt-1 max-w-2xl">
                {activeCollection.subtitle}
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(activeCollection.category);
                navigate({ name: 'home' });
              }}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900 hover:text-[#E60023] whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>More in {activeCollection.category}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <MasonryGrid pins={collectionPins} />
        </section>
      )}

      {/* Browse by Category Portals */}
      <section className="pt-8 border-t border-zinc-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-950">Browse by interest</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            Jump directly into focused visual archives across design, food, and architecture.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories
            .filter((c) => c.slug !== 'all')
            .map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory(cat.slug);
                  navigate({ name: 'home' });
                }}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden text-left cursor-pointer bg-zinc-100"
              >
                <SafeImage
                  src={cat.coverImage}
                  alt={cat.label}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-base font-bold text-white">{cat.label}</h3>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">
                    {cat.tagline}
                  </p>
                </div>
              </button>
            ))}
        </div>
      </section>
    </main>
  );
};
