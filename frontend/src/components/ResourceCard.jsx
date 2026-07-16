import React from 'react';

const ResourceCard = ({ resource, onEdit, onDelete, onTogglePin, onToggleFavorite }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return '';
    }
  };

  // Get favicon URL for websites
  const getFaviconUrl = (url) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
    } catch (e) {
      return null;
    }
  };

  // Get simplified display domain for websites
  const getDisplayDomain = (url) => {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  };

  return (
    <div
      className="group relative rounded-2xl bg-[#0d0e15] border border-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/2 hover:-translate-y-0.5"
      style={{ borderLeft: `4px solid ${resource.color || '#4f46e5'}` }}
    >
      <div>
        {/* Top Header Row: Category Badge + Pin/Favorite Actions */}
        <div className="flex justify-between items-center gap-2 mb-3.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
            style={{
              backgroundColor: `${resource.color || '#4f46e5'}15`,
              color: resource.color || '#4f46e5',
            }}
          >
            {resource.category || 'General'}
          </span>

          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            {/* Toggle Favorite Button */}
            <button
              onClick={() => onToggleFavorite(resource)}
              className={`p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer ${
                resource.isFavorite ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'
              }`}
              title={resource.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
            >
              <svg
                className="w-4 h-4"
                fill={resource.isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            {/* Toggle Pin Button */}
            <button
              onClick={() => onTogglePin(resource)}
              className={`p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer ${
                resource.isPinned ? 'text-amber-500' : 'text-slate-500 hover:text-amber-400'
              }`}
              title={resource.isPinned ? 'Unpin Resource' : 'Pin Resource'}
            >
              <svg
                className="w-4 h-4"
                fill={resource.isPinned ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Thumbnail (if Video type) */}
        {resource.type === 'video' && resource.thumbnailUrl && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-3.5 bg-slate-950 border border-slate-900/60 group/thumb">
            <img
              src={resource.thumbnailUrl}
              alt={resource.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=640'; // Fallback youtube background
              }}
            />
            {/* Play Button Overlay */}
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-300"
            >
              <div className="w-11 h-11 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 scale-90 group-hover/thumb:scale-100 transition-all duration-300">
                <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </a>
          </div>
        )}

        {/* Website Favicon + Header row */}
        {resource.type === 'website' && (
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center p-1.5 shrink-0">
              <img
                src={getFaviconUrl(resource.url) || 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=64'}
                alt="favicon"
                className="w-full h-full object-contain rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%236366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
                }}
              />
            </div>
            <div className="overflow-hidden">
              <span className="text-[10px] font-semibold text-indigo-400 block truncate">
                {getDisplayDomain(resource.url)}
              </span>
            </div>
          </div>
        )}

        {/* Title */}
        <h4 className="font-display font-bold text-sm text-white mb-2 leading-snug line-clamp-2">
          {resource.title}
        </h4>

        {/* Personal Notes Snippet */}
        {resource.notes ? (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 whitespace-pre-wrap mb-4">
            {resource.notes}
          </p>
        ) : (
          <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
            No personal notes added.
          </p>
        )}

        {/* Smart Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Row: Timestamp + Action Buttons */}
      <div className="flex justify-between items-center pt-3 border-t border-slate-900/60 mt-auto">
        <span className="text-[10px] text-slate-500 font-medium">
          {formatDate(resource.updatedAt)}
        </span>

        <div className="flex items-center gap-1">
          {/* External Link Button */}
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-slate-900/60 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            title={resource.type === 'video' ? 'Watch Video' : 'Visit Website'}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(resource)}
            className="p-1.5 rounded-lg hover:bg-slate-900/60 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            title="Edit Resource"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(resource._id)}
            className="p-1.5 rounded-lg hover:bg-slate-900/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete Resource"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
