import React, { useState } from 'react';
import ResourceCard from '../components/ResourceCard';
import ResourceModal from '../components/ResourceModal';
import { EmptyWebsitesIllustration } from '../components/Illustrations';

const WebsitesPage = ({ websites, loading, apiLoading, onSave, onDelete, onTogglePin, onToggleFavorite, onAiUpdate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 space-y-4 animate-skeleton">
          <div className="flex justify-between items-start">
            <div className="h-5 w-28 bg-slate-850 rounded"></div>
            <div className="h-4 w-4 bg-slate-850 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-slate-850/60 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-850/60 rounded"></div>
            <div className="h-3 w-3/5 bg-slate-850/60 rounded"></div>
          </div>
          <div className="h-5 w-20 bg-slate-850 rounded pt-1"></div>
        </div>
      ))}
    </div>
  );

  // Compute unique website categories
  const categories = [...new Set(websites.map((w) => w.category || 'General'))];

  // Filter based on search term and category
  const filteredWebsites = websites.filter((site) => {
    const matchesSearch =
      site.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (site.notes && site.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      site.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      site.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const pinnedWebsites = filteredWebsites.filter((w) => w.isPinned);
  const unpinnedWebsites = filteredWebsites.filter((w) => !w.isPinned);

  const openCreateModal = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleSave = async (resourceData) => {
    await onSave(resourceData, editingResource, 'website');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Websites Library</h2>
          <p className="text-xs text-slate-500 mt-1">
            Bookmarked reference sites, developer tools, articles, and research pages
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Website
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
            placeholder="Search websites by title, url, notes, or categories..."
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
            All Websites ({websites.length})
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
              {cat} ({websites.filter((w) => w.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <LoadingSkeleton />
      ) : websites.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-900 bg-slate-950/20">
          <EmptyWebsitesIllustration />
          <h3 className="font-display font-bold text-lg text-slate-200">No Websites Bookmarked</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
            Organize website bookmarks with categories, tags, personal notes, and colors. Your custom library is ready.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-6 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            Add Website
          </button>
        </div>
      ) : filteredWebsites.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-950/10 border border-slate-900/60">
          <p className="text-sm text-slate-400">
            No websites found matching: <span className="font-bold text-indigo-400">"{searchTerm || selectedCategory}"</span>
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* PINNED WEBSITES */}
          {pinnedWebsites.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
                </svg>
                Pinned Websites ({pinnedWebsites.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {pinnedWebsites.map((site) => (
                  <ResourceCard
                    key={site._id}
                    resource={site}
                    onEdit={openEditModal}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* UNPINNED WEBSITES */}
          <div className="space-y-3">
            {pinnedWebsites.length > 0 && (
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest select-none">
                All Other Websites
              </h4>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {unpinnedWebsites.map((site) => (
                <ResourceCard
                  key={site._id}
                  resource={site}
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

      {/* Website Create/Edit Modal */}
      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        resource={editingResource}
        type="website"
        apiLoading={apiLoading}
        onAiUpdate={(updatedResource) => {
          onAiUpdate(updatedResource);
          setEditingResource(updatedResource);
        }}
      />
    </div>
  );
};

export default WebsitesPage;
