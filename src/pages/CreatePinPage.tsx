import React, { useState, useRef } from 'react';
import { Upload, ArrowLeft, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PinItem } from '../types';
import { SafeImage } from '../components/common/SafeImage';

const STARTER_MEDIA = [
  {
    label: 'Japandi Stone',
    url: '/src/assets/images/pin_japandi_living_1794897601887.jpg',
    ratio: '3/4' as const,
  },
  {
    label: 'Terracotta Craft',
    url: '/src/assets/images/pin_terracotta_pottery_1794897603756.jpg',
    ratio: '3/4' as const,
  },
  {
    label: 'Jaipur Sandstone',
    url: '/src/assets/images/pin_jaipur_arch_1794897606549.jpg',
    ratio: '3/4' as const,
  },
  {
    label: 'Walnut Studio',
    url: '/src/assets/images/pin_minimal_desk_1794897606083.jpg',
    ratio: '4/3' as const,
  },
];

export const CreatePinPage: React.FC = () => {
  const { categories, boards, currentUser, createPin, navigate, goBack } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const myBoards = boards.filter((b) => b.ownerId === currentUser.id);

  const [imageUrl, setImageUrl] = useState(STARTER_MEDIA[0].url);
  const [aspectRatio, setAspectRatio] = useState<PinItem['aspectRatio']>('3/4');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState('Home Decor');
  const [tagsInput, setTagsInput] = useState('minimal, warm stone, india');
  const [boardId, setBoardId] = useState(myBoards[0]?.id || '');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) return;

    let domain = 'pinterest.in';
    if (sourceUrl.trim()) {
      try {
        domain = new URL(
          sourceUrl.startsWith('http') ? sourceUrl : `https://${sourceUrl}`
        ).hostname.replace(/^www\./, '');
      } catch {
        domain = sourceUrl.trim();
      }
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const created = createPin({
      title,
      description:
        description ||
        'Curated visual reference published via Pinterest Studio.',
      imageUrl,
      aspectRatio,
      category,
      tags,
      sourceDomain: domain,
      sourceUrl: sourceUrl.trim() || 'https://in.pinterest.com',
      boardId: boardId || undefined,
    });

    navigate({ name: 'pin', pinId: created.id });
  };

  return (
    <main className="max-w-[1100px] mx-auto px-4 md:px-8 pt-6 pb-20 md:pb-16">
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={goBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full hover:bg-zinc-100 text-sm font-semibold text-zinc-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-bold text-zinc-950">Create Pin</h1>
        <div className="w-16" />
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
      >
        {/* Left: Visual Media Preview + Upload */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/80">
            <SafeImage
              src={imageUrl}
              alt={title || 'Pin preview'}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3.5 left-3.5 right-3.5 py-2.5 px-4 rounded-xl bg-white/95 hover:bg-white text-zinc-900 text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload image from device</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div>
            <p className="text-xs font-semibold text-zinc-500 mb-2">
              Or select a studio image preset
            </p>
            <div className="grid grid-cols-4 gap-2">
              {STARTER_MEDIA.map((item) => {
                const selected = imageUrl === item.url;
                return (
                  <button
                    key={item.url}
                    type="button"
                    onClick={() => {
                      setImageUrl(item.url);
                      setAspectRatio(item.ratio);
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selected ? 'border-[#E60023]' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <SafeImage
                      src={item.url}
                      alt={item.label}
                      className="w-full h-full object-cover"
                    />
                    {selected && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#E60023] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Pin Metadata Form */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a clear, descriptive title"
                className="w-full px-4 py-3 text-base font-semibold rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
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
                placeholder="Describe materials, light, recipe notes, or context..."
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                >
                  {categories
                    .filter((c) => c.slug !== 'all')
                    .map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.label}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Save to board
                </label>
                <select
                  value={boardId}
                  onChange={(e) => setBoardId(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900"
                >
                  <option value="">No board (Profile only)</option>
                  {myBoards.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Source link
                </label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://yourstudio.in"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="travertine, courtyard, linen"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={goBack}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              Publish Pin
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};
