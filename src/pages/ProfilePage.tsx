import React, { useState } from 'react';
import { Plus, Share2, Pencil, X, Globe, MapPin, BadgeCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SafeImage } from '../components/common/SafeImage';
import { BoardCard } from '../components/boards/BoardCard';
import { MasonryGrid } from '../components/pins/MasonryGrid';
import { CreateBoardModal } from '../components/boards/CreateBoardModal';

interface ProfilePageProps {
  username?: string;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ username }) => {
  const {
    users,
    currentUser,
    pins,
    boards,
    navigate,
    followedUserIds,
    toggleFollowUser,
    updateCurrentUser,
    showToast,
  } = useApp();

  const profileUser =
    (username && users.find((u) => u.username === username)) || currentUser;
  const isOwnProfile = profileUser.id === currentUser.id;
  const isFollowing = followedUserIds.includes(profileUser.id);

  const [activeTab, setActiveTab] = useState<'boards' | 'created' | 'saved'>('boards');
  const [createBoardOpen, setCreateBoardOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);

  const [editName, setEditName] = useState(profileUser.displayName);
  const [editBio, setEditBio] = useState(profileUser.bio);
  const [editLocation, setEditLocation] = useState(profileUser.location);
  const [editWebsite, setEditWebsite] = useState(profileUser.website);

  const userBoards = boards.filter(
    (b) => b.ownerId === profileUser.id && (isOwnProfile || !b.isPrivate)
  );
  const createdPins = pins.filter((p) => p.creatorId === profileUser.id);
  const savedPinIds = Array.from(
    new Set(userBoards.flatMap((b) => b.pinIds))
  );
  const savedPins = pins.filter((p) => savedPinIds.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      displayName: editName.trim() || profileUser.displayName,
      bio: editBio.trim(),
      location: editLocation.trim(),
      website: editWebsite.trim(),
    });
    setEditProfileOpen(false);
  };

  return (
    <main className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 pb-20 md:pb-16">
      {/* Centered Editorial Profile Header */}
      <section className="max-w-2xl mx-auto text-center pb-10">
        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border border-zinc-200 shadow-xs bg-zinc-100">
          <SafeImage
            src={profileUser.avatarUrl}
            alt={profileUser.displayName}
            loading="eager"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
            {profileUser.displayName}
          </h1>
          {profileUser.verified && (
            <BadgeCheck className="w-5 h-5 text-[#E60023]" aria-label="Verified creator" />
          )}
        </div>

        <p className="text-xs text-zinc-500 mt-1">@{profileUser.username}</p>

        {profileUser.bio && (
          <p className="mt-3 text-sm text-zinc-700 leading-relaxed max-w-lg mx-auto">
            {profileUser.bio}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-zinc-500">
          {profileUser.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {profileUser.location}
            </span>
          )}
          {profileUser.website && (
            <span className="inline-flex items-center gap-1 text-zinc-700 font-medium">
              <Globe className="w-3.5 h-3.5 text-zinc-400" />
              {profileUser.website}
            </span>
          )}
        </div>

        <p className="mt-3 text-sm font-semibold text-zinc-900 tabular-nums">
          {profileUser.followersCount.toLocaleString()} followers ·{' '}
          {profileUser.followingCount.toLocaleString()} following
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href).catch(() => {});
              }
              showToast('Profile link copied');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          {isOwnProfile ? (
            <>
              <button
                onClick={() => {
                  setEditName(profileUser.displayName);
                  setEditBio(profileUser.bio);
                  setEditLocation(profileUser.location);
                  setEditWebsite(profileUser.website);
                  setEditProfileOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Edit profile</span>
              </button>
              <button
                onClick={() => navigate({ name: 'create' })}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Pin</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => toggleFollowUser(profileUser.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                isFollowing
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800'
                  : 'bg-[#E60023] text-white hover:bg-[#AD081B]'
              }`}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </section>

      {/* Profile Tabs + Create Board Action */}
      <div className="flex items-center justify-between gap-4 border-b border-zinc-200 pb-3 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('boards')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'boards'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            Boards ({userBoards.length})
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'created'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            Created ({createdPins.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'bg-zinc-900 text-white'
                : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
            }`}
          >
            Saved Pins ({savedPins.length})
          </button>
        </div>

        {isOwnProfile && (
          <button
            onClick={() => setCreateBoardOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Board</span>
          </button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'boards' && (
        userBoards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userBoards.map((board) => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-base font-semibold text-zinc-900">No boards created yet</p>
            <p className="text-sm text-zinc-500 mt-1">
              Organize your saved visual references into boards.
            </p>
            {isOwnProfile && (
              <button
                onClick={() => setCreateBoardOpen(true)}
                className="mt-4 px-5 py-2.5 rounded-full bg-[#E60023] text-white text-sm font-semibold cursor-pointer"
              >
                Create your first board
              </button>
            )}
          </div>
        )
      )}

      {activeTab === 'created' && (
        <MasonryGrid
          pins={createdPins}
          emptyTitle="No created pins yet"
          emptySubtitle="Publish your first visual reference from the Creator Studio."
        />
      )}

      {activeTab === 'saved' && (
        <MasonryGrid
          pins={savedPins}
          emptyTitle="No saved pins yet"
          emptySubtitle="Explore the feed and save ideas straight into your boards."
        />
      )}

      <CreateBoardModal
        open={createBoardOpen}
        onClose={() => setCreateBoardOpen(false)}
      />

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-xs p-4"
          onClick={() => setEditProfileOpen(false)}
        >
          <div
            className="w-full max-w-[460px] bg-white rounded-3xl p-6 shadow-2xl border border-zinc-200"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-zinc-900">Edit profile</h2>
              <button
                onClick={() => setEditProfileOpen(false)}
                aria-label="Close"
                className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  Display name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                  About
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                    Website
                  </label>
                  <input
                    type="text"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-zinc-700 hover:bg-zinc-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-[#E60023] hover:bg-[#AD081B] text-white text-sm font-semibold cursor-pointer"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
