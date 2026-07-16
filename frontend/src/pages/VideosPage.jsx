import React, { useState } from 'react';
import ResourceCard from '../components/ResourceCard';
import ResourceModal from '../components/ResourceModal';
import { EmptyVideosIllustration } from '../components/Illustrations';

const VideosPage = ({ videos, loading, apiLoading, onSave, onDelete, onTogglePin, onToggleFavorite, onAiUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 space-y-4 animate-skeleton">
          <div className="h-40 bg-slate-850/80 rounded-xl relative overflow-hidden flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-slate-700 border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-5/6 bg-slate-850 rounded"></div>
            <div className="h-3 w-2/3 bg-slate-850 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Compute unique video categories
  const categories = [...new Set(videos.map((v) => v.category || 'General'))];

  // Filter based on search term and category
  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.notes && video.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      video.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      video.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const pinnedVideos = filteredVideos.filter((v) => v.isPinned);
  const unpinnedVideos = filteredVideos.filter((v) => !v.isPinned);

  const openCreateModal = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleSave = async (resourceData) => {
    await onSave(resourceData, editingResource, 'video');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Video Library</h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage, watch, and note down takeaways from YouTube videos
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Video
        </button>
      </div>

      {/* Search & Categories Bar */}
      <div className="space-y-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search videos by title, notes, or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Categories row */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-900 text-slate-400 border border-transparent hover:bg-slate-800/60'
            }`}
          >
            All Videos ({videos.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium shrink-0 transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                  : 'bg-slate-900 text-slate-400 border border-transparent hover:bg-slate-800/60'
              }`}
            >
              {cat} ({videos.filter((v) => v.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <LoadingSkeleton />
      ) : videos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-900 bg-slate-950/20">
          <EmptyVideosIllustration />
          <h3 className="font-display font-bold text-lg text-slate-200">No Videos Saved</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
            Store YouTube tutorial lectures, podcasts, or reference guides. Paste a URL and we'll pull details automatically.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-6 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            Add a Video
          </button>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-950/10 border border-slate-900/60">
          <p className="text-sm text-slate-400">
            No videos found matching: <span className="font-bold text-indigo-400">"{searchTerm || selectedCategory}"</span>
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* PINNED VIDEOS */}
          {pinnedVideos.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
                </svg>
                Pinned Videos ({pinnedVideos.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pinnedVideos.map((video) => (
                  <ResourceCard
                    key={video._id}
                    resource={video}
                    onEdit={openEditModal}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* UNPINNED VIDEOS */}
          <div className="space-y-3">
            {pinnedVideos.length > 0 && (
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest select-none">
                All Other Videos
              </h4>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {unpinnedVideos.map((video) => (
                <ResourceCard
                  key={video._id}
                  resource={video}
                  onEdit={openEditModal}
                  onDelete={onDelete}
                  onTogglePin={onTogglePin}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Create/Edit Modal */}
      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        resource={editingResource}
        type="video"
        apiLoading={apiLoading}
        onAiUpdate={(updatedResource) => {
          onAiUpdate(updatedResource);
          setEditingResource(updatedResource);
        }}
      />
    </div>
  );
};

export default VideosPage;
