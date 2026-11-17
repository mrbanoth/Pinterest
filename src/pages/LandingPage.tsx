import React, { useState, useEffect } from 'react';
import { ArrowRight, Search, Sparkles, Bookmark, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SafeImage } from '../components/common/SafeImage';

const HERO_THEMES = [
  {
    label: 'warm Japandi living room',
    accent: '#9A6B42',
    pinIds: ['pin-101', 'pin-106', 'pin-109', 'pin-112', 'pin-114'],
  },
  {
    label: 'monsoon courtyard residence',
    accent: '#2D6A4F',
    pinIds: ['pin-102', 'pin-108', 'pin-113', 'pin-104', 'pin-105'],
  },
  {
    label: 'kulhad masala chai ritual',
    accent: '#C2592A',
    pinIds: ['pin-103', 'pin-111', 'pin-107', 'pin-109', 'pin-101'],
  },
  {
    label: 'handloom indigo & linen look',
    accent: '#1F4B82',
    pinIds: ['pin-110', 'pin-104', 'pin-105', 'pin-108', 'pin-106'],
  },
];

export const LandingPage: React.FC = () => {
  const { pins, boards, navigate, setSearchQuery, setActiveCategory } = useApp();
  const [themeIndex, setThemeIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setThemeIndex((i) => (i + 1) % HERO_THEMES.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const currentTheme = HERO_THEMES[themeIndex];
  const showcasePins = currentTheme.pinIds
    .map((id) => pins.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  const sampleSearches = [
    'Japandi living',
    'Masala chai',
    'Jaipur sandstone',
    'Indigo block print',
  ];

  const handleSearchJump = (query: string) => {
    setActiveCategory('all');
    setSearchQuery(query);
    navigate({ name: 'home' });
  };

  return (
    <div className="bg-white text-zinc-900">
      {/* Hero Section with Signature Idea Rotator + 5-Column Staggered Masonry */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-bold tracking-tight leading-[1.08] text-zinc-950">
            Get your next
            <span
              className="block mt-1 font-serif-editorial italic font-medium transition-colors duration-300"
              style={{ color: currentTheme.accent }}
            >
              {currentTheme.label}
            </span>
          </h1>

          {/* Theme Switcher Dots */}
          <div className="mt-5 flex items-center justify-center gap-2">
            {HERO_THEMES.map((t, idx) => (
              <button
                key={t.label}
                onClick={() => setThemeIndex(idx)}
                aria-label={`Show ${t.label}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  idx === themeIndex ? 'w-7 bg-zinc-900' : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                }`}
              />
            ))}
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate({ name: 'home' })}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Explore Home Feed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate({ name: 'explore' })}
              className="px-6 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              Browse Curated Collections
            </button>
          </div>
        </div>

        {/* 5-Column Staggered Waterfall Showcase */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 items-start">
          {showcasePins.map((pin, idx) => {
            const verticalOffset =
              idx === 0 || idx === 4
                ? 'mt-0'
                : idx === 1 || idx === 3
                  ? 'lg:mt-8'
                  : 'lg:mt-16';
            return (
              <button
                key={pin.id}
                onClick={() => navigate({ name: 'pin', pinId: pin.id })}
                className={`group relative w-full aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 text-left cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 ${verticalOffset} ${
                  idx === 4 ? 'hidden lg:block' : ''
                }`}
              >
                <SafeImage
                  src={pin.imageUrl}
                  alt={pin.title}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 p-3.5 bg-gradient-to-t from-black/75 via-black/30 to-transparent">
                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                    {pin.title}
                  </p>
                  <p className="text-[11px] text-white/80 mt-0.5 truncate">
                    {pin.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Search for an idea */}
      <section className="bg-[#FFF9E6] border-y border-amber-200/50">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-7">
                <button
                  onClick={() => navigate({ name: 'pin', pinId: 'pin-103' })}
                  className="w-full aspect-[3/4] rounded-3xl overflow-hidden shadow-lg cursor-pointer group block"
                >
                  <SafeImage
                    src="/src/assets/images/pin_masala_chai_1794897604690.jpg"
                    alt="Kulhad masala chai"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </button>
              </div>
              <div className="col-span-5 space-y-4">
                <button
                  onClick={() => navigate({ name: 'pin', pinId: 'pin-111' })}
                  className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md cursor-pointer group block"
                >
                  <SafeImage
                    src="/src/assets/images/pin_filter_coffee_1794897607225.jpg"
                    alt="South Indian filter coffee"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </button>
                <button
                  onClick={() => navigate({ name: 'pin', pinId: 'pin-107' })}
                  className="w-full aspect-square rounded-2xl overflow-hidden shadow-md cursor-pointer group block"
                >
                  <SafeImage
                    src="/src/assets/images/pin_matcha_pastry_1794897605168.jpg"
                    alt="Pistachio croissant and matcha"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pl-8">
            <p className="text-xs font-semibold text-amber-900/80 mb-2">
              Visual Search &amp; Discovery
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight text-zinc-950 leading-[1.1]">
              Search for an idea
            </h2>
            <p className="mt-4 text-base text-zinc-700 max-w-lg leading-relaxed">
              What do you want to try next? Think of something you are into—like
              kulhad masala chai, Kerala monsoon courtyards, or handloom linen—and
              explore curated visual references in seconds.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {sampleSearches.map((query) => (
                <button
                  key={query}
                  onClick={() => handleSearchJump(query)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-zinc-900 hover:text-white text-zinc-900 text-xs font-semibold border border-amber-900/15 shadow-xs transition-colors cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{query}</span>
                </button>
              ))}
            </div>

            <div className="mt-7">
              <button
                onClick={() => {
                  setSearchQuery('');
                  navigate({ name: 'explore' });
                }}
                className="px-6 py-3 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Explore all ideas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Save ideas you like */}
      <section className="bg-[#EAF4F2] border-b border-teal-200/40">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold text-teal-900/80 mb-2">
              Curated Idea Boards
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold tracking-tight text-zinc-950 leading-[1.1]">
              Save ideas you like
            </h2>
            <p className="mt-4 text-base text-zinc-700 max-w-md leading-relaxed">
              Collect your favorites into structured visual boards so you can revisit
              material palettes, architectural details, and seasonal recipes whenever
              you need them.
            </p>
            <div className="mt-7">
              <button
                onClick={() => navigate({ name: 'profile' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
                <span>View your boards</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {boards.slice(0, 4).map((board) => {
              const coverPin = pins.find((p) => p.id === board.pinIds[0]);
              const thumbPin = pins.find((p) => p.id === board.pinIds[1]);
              return (
                <button
                  key={board.id}
                  onClick={() => navigate({ name: 'board', boardId: board.id })}
                  className="group bg-white rounded-3xl p-4 text-left border border-teal-900/10 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className="grid grid-cols-3 gap-1 aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100">
                    <div className="col-span-2 overflow-hidden">
                      {coverPin && (
                        <SafeImage
                          src={coverPin.imageUrl}
                          alt={board.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      )}
                    </div>
                    <div className="col-span-1 overflow-hidden">
                      {thumbPin && (
                        <SafeImage
                          src={thumbPin.imageUrl}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      )}
                    </div>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-zinc-900 truncate">
                    {board.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5 tabular-nums">
                    {board.pinIds.length} Pins · {board.category}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: See it, make it, try it, do it */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch rounded-3xl overflow-hidden bg-[#FDF2F0] border border-rose-200/60">
          <div className="lg:col-span-6 min-h-[340px] lg:min-h-[480px] relative overflow-hidden">
            <SafeImage
              src="/src/assets/images/pin_editorial_fashion_1794897604735.jpg"
              alt="Editorial fashion in sandstone courtyard"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 p-8 md:p-14 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#E60023] mb-3">
              <Sparkles className="w-4 h-4" />
              <span>Creator Publishing Studio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold tracking-tight text-zinc-950 leading-[1.12]">
              See it, make it, try it, do it
            </h2>
            <p className="mt-4 text-base text-zinc-700 leading-relaxed max-w-md">
              The best part of Pinterest is sharing what inspires your own work. Upload
              new visual references, tag materials and color notes, and organize them
              straight into your studio boards.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => navigate({ name: 'create' })}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create a Pin</span>
              </button>
              <button
                onClick={() => navigate({ name: 'home' })}
                className="px-6 py-3 rounded-full bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-900 text-sm font-semibold transition-colors cursor-pointer"
              >
                Enter Home Feed
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-zinc-200 py-8 px-5 md:px-10 max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2 font-semibold text-zinc-800">
          <span className="w-5 h-5 rounded-full bg-[#E60023] text-white text-[11px] font-bold flex items-center justify-center">
            P
          </span>
          <span>Pinterest India Visual Discovery</span>
        </div>
        <div className="flex flex-wrap items-center gap-5">
          <button onClick={() => navigate({ name: 'home' })} className="hover:text-zinc-900 cursor-pointer">
            Home Feed
          </button>
          <button onClick={() => navigate({ name: 'explore' })} className="hover:text-zinc-900 cursor-pointer">
            Explore
          </button>
          <button onClick={() => navigate({ name: 'create' })} className="hover:text-zinc-900 cursor-pointer">
            Create
          </button>
          <button onClick={() => navigate({ name: 'profile' })} className="hover:text-zinc-900 cursor-pointer">
            Profile &amp; Boards
          </button>
        </div>
      </footer>
    </div>
  );
};
