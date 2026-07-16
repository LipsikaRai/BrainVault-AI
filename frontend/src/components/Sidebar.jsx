import React from 'react';

const Sidebar = ({ user, logout, activeTab, setActiveTab, categories, selectedCategory, setSelectedCategory }) => {
  return (
    <aside className="w-64 border-r border-slate-900 bg-[#0a0b10] flex flex-col justify-between hidden md:flex shrink-0">
      <div className="p-6 flex-1 flex flex-col min-h-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm tracking-wider shadow shadow-indigo-500/10">
            B
          </div>
          <span className="font-display font-bold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            BrainVault<span className="text-indigo-500">.AI</span>
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 mb-6">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSelectedCategory('All');
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'dashboard'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path>
            </svg>
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'notes'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Notes
          </button>
          <button
            onClick={() => setActiveTab('videos')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'videos'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            Videos
          </button>
          <button
            onClick={() => setActiveTab('websites')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'websites'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
            </svg>
            Websites
          </button>
          <button
            onClick={() => {
              setActiveTab('pdfs');
              setSelectedCategory('All');
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'pdfs'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9h1.5m1.5 0H13m-4 4h4m-4 4h4" />
            </svg>
            PDFs
          </button>
          <button
            onClick={() => {
              setActiveTab('reminders');
              setSelectedCategory('All');
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === 'reminders'
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Reminders
          </button>
        </nav>

        {/* Categories Section - Only show or expand when in 'notes' tab or always visible for filter */}
        <div className="flex-1 flex flex-col min-h-0 border-t border-slate-900/60 pt-4">
          <span className="text-[11px] font-bold text-slate-500 tracking-wider uppercase px-4 mb-2 block">
            Categories
          </span>
          <div className="overflow-y-auto pr-1 space-y-1">
            <button
              onClick={() => {
                setSelectedCategory('All');
                setActiveTab('notes');
              }}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                selectedCategory === 'All' && activeTab === 'notes'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
              }`}
            >
              <span>All Notes</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveTab('notes');
                }}
                className={`w-full flex items-center justify-between px-4 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  selectedCategory === cat && activeTab === 'notes'
                    ? 'bg-indigo-500/10 text-indigo-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
              >
                <span className="truncate">{cat}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Card at bottom */}
      <div className="p-6 border-t border-slate-900 bg-[#07080c]/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold uppercase shrink-0">
            {user?.username?.substring(0, 2) || 'US'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{user?.username || 'User'}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full py-2 px-3 flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 text-xs font-semibold active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
