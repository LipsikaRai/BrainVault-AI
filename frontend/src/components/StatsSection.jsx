import React from 'react';

const StatsSection = ({ notesCount, videosCount, websitesCount, pdfsCount = 0, categoriesCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {/* Total Notes */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl group-hover:bg-indigo-500/10 transition-colors"></div>
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Notes</span>
        <span className="text-3xl font-display font-black text-white mt-2">{notesCount}</span>
        <span className="text-[10px] text-slate-600 mt-1">Saved snippets & thoughts</span>
      </div>

      {/* Videos Saved */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-rose-500/5 rounded-full blur-xl group-hover:bg-rose-500/10 transition-colors"></div>
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Videos Saved</span>
        <span className="text-3xl font-display font-black text-rose-400 mt-2">{videosCount}</span>
        <span className="text-[10px] text-slate-600 mt-1">YouTube study bookmarks</span>
      </div>

      {/* Websites Saved */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Websites</span>
        <span className="text-3xl font-display font-black text-emerald-400 mt-2">{websitesCount}</span>
        <span className="text-[10px] text-slate-600 mt-1">Resource library links</span>
      </div>

      {/* PDFs Saved */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-violet-500/5 rounded-full blur-xl group-hover:bg-violet-500/10 transition-colors"></div>
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">PDFs Saved</span>
        <span className="text-3xl font-display font-black text-violet-400 mt-2">{pdfsCount}</span>
        <span className="text-[10px] text-slate-600 mt-1">Uploaded PDF references</span>
      </div>

      {/* Categories Count */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-sm flex flex-col relative overflow-hidden group hover:border-slate-800 transition-all duration-300">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-amber-500/5 rounded-full blur-xl group-hover:bg-amber-500/10 transition-colors"></div>
        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Categories</span>
        <span className="text-3xl font-display font-black text-amber-400 mt-2">{categoriesCount}</span>
        <span className="text-[10px] text-slate-600 mt-1">Active content divisions</span>
      </div>
    </div>
  );
};

export default StatsSection;
