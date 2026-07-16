import React from 'react';

const PdfCard = ({ pdf, onEdit, onDelete, onTogglePin, onToggleFavorite }) => {
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

  // Convert bytes to user-friendly readable format
  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Dynamically resolve full upload file URL path
  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return '#';
    const isEnvUrl = import.meta.env.VITE_API_URL;
    const baseUrl = isEnvUrl ? isEnvUrl.replace('/api', '') : 'http://localhost:5000';
    return `${baseUrl}${fileUrl}`;
  };

  return (
    <div
      className="group relative rounded-2xl bg-[#0d0e15] border border-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/2 hover:-translate-y-0.5"
      style={{ borderLeft: `4px solid ${pdf.color || '#8b5cf6'}` }}
    >
      <div>
        {/* Top Header Row: Category Badge + Pin/Favorite Actions */}
        <div className="flex justify-between items-center gap-2 mb-3.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
            style={{
              backgroundColor: `${pdf.color || '#8b5cf6'}15`,
              color: pdf.color || '#8b5cf6',
            }}
          >
            {pdf.category || 'General'}
          </span>

          <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
            {/* Toggle Favorite Button */}
            <button
              onClick={() => onToggleFavorite(pdf)}
              className={`p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer ${
                pdf.isFavorite ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'
              }`}
              title={pdf.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
            >
              <svg
                className="w-4 h-4"
                fill={pdf.isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>

            {/* Toggle Pin Button */}
            <button
              onClick={() => onTogglePin(pdf)}
              className={`p-1.5 rounded-lg hover:bg-slate-900/60 transition-colors cursor-pointer ${
                pdf.isPinned ? 'text-amber-500' : 'text-slate-500 hover:text-amber-400'
              }`}
              title={pdf.isPinned ? 'Unpin Document' : 'Pin Document'}
            >
              <svg
                className="w-4 h-4"
                fill={pdf.isPinned ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </button>
          </div>
        </div>

        {/* Visual PDF File Icon Section */}
        <div className="flex items-center gap-3 mb-3.5 bg-slate-950/40 p-3 rounded-xl border border-slate-900/50">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9h1.5m1.5 0H13m-4 4h4m-4 4h4" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Document File</p>
            <p className="text-[11px] text-slate-400 truncate mt-0.5" title={pdf.fileName}>
              {pdf.fileName}
            </p>
            <span className="text-[9px] text-slate-600 bg-slate-950 px-1.5 py-0.5 rounded-md font-mono mt-1 inline-block">
              {formatFileSize(pdf.fileSize)}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="font-display font-bold text-sm text-white mb-2 leading-snug line-clamp-2">
          {pdf.title}
        </h4>

        {/* Personal Notes Snippet */}
        {pdf.notes ? (
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 whitespace-pre-wrap mb-4">
            {pdf.notes}
          </p>
        ) : (
          <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
            No personal notes added.
          </p>
        )}

        {/* Smart Tags */}
        {pdf.tags && pdf.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {pdf.tags.map((tag) => (
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
          Uploaded: {formatDate(pdf.createdAt)}
        </span>

        <div className="flex items-center gap-1">
          {/* View/Open Button */}
          <a
            href={getFileUrl(pdf.fileUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg hover:bg-slate-900/60 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            title="Open/View PDF in New Tab"
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
            onClick={() => onEdit(pdf)}
            className="p-1.5 rounded-lg hover:bg-slate-900/60 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            title="Edit Details"
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
            onClick={() => onDelete(pdf._id)}
            className="p-1.5 rounded-lg hover:bg-slate-900/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
            title="Delete Document"
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

export default PdfCard;
