import React from 'react';

const Navbar = ({ user, logout, activeTab, searchQuery, setSearchQuery }) => {
  return (
    <header className="h-16 border-b border-slate-900/60 bg-[#0a0b10]/40 backdrop-blur px-6 flex justify-between items-center z-10 sticky top-0">
      {/* Mobile-only logo */}
      <h2 className="font-display font-bold text-lg text-white md:hidden">
        BrainVault<span className="text-indigo-500">.AI</span>
      </h2>

      {/* Breadcrumbs for desktop */}
      <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-500">
        <span>Home</span>
        <span className="text-slate-700">/</span>
        <span className="text-slate-300 capitalize">{activeTab}</span>
      </div>

      {/* Global Search Bar (hidden on small screen, standard on desktop) */}
      <div className="relative max-w-sm w-full mx-4 hidden sm:block">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search Vault (Notes, Videos, PDFs...)"
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-9 py-2 bg-slate-950/60 border border-slate-900 focus:border-indigo-500/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all duration-300 hover:border-slate-800"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 ml-auto sm:ml-0">
        {/* User context badge */}
        <div className="text-right">
          <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Vault Secure</p>
          <p className="text-xs text-indigo-400 font-bold">{user?.username}</p>
        </div>

        {/* Mobile Log Out Button */}
        <button
          onClick={logout}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          title="Sign Out"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
        </button>
      </div>
    </header>
  );
};


export default Navbar;
