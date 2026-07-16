import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0b10] text-slate-100 flex flex-col relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none"></div>

      {/* Header Navigation */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center z-10 border-b border-slate-800/40">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-indigo-500/20 tracking-wider">
            B
          </div>
          <span className="font-display font-bold text-2xl bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
            BrainVault<span className="text-indigo-500">.AI</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-5 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/20 active:scale-95 transition-all duration-200"
          >
            Get Started Free
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 flex-1 flex flex-col items-center justify-center text-center z-10 py-20">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse">
          ⚡ Re-imagining Learning with AI
        </div>

        <h1 className="font-display font-black text-5xl md:text-7xl leading-tight tracking-tight mb-8">
          The Ultimate Vault for <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Digital Brain
          </span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-base md:text-lg leading-relaxed mb-12">
          Save notes, web articles, PDFs, and YouTube videos. BrainVault AI generates concise summaries, tags, and interactive study aids using Google Gemini to accelerate your comprehension.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/10 active:scale-98 transition-all duration-200 text-center cursor-pointer"
          >
            Create Your Vault
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-4 text-base font-semibold rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all duration-200 text-center cursor-pointer"
          >
            See How it Works
          </a>
        </div>

        {/* Feature Grid */}
        <section id="features" className="w-full mt-32 py-12 scroll-mt-20">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-100 mb-4">
              Everything you need to master your inputs
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Our dynamic system accepts any source of knowledge, processes it, and structures it seamlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group p-8 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-indigo-500/40 hover:bg-slate-900/60 hover-lift active-pop transition-all duration-300 flex flex-col items-start text-left shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-slate-100">Smart Summaries</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Powered by Google Gemini AI. Condense hours of YouTube videos, long web articles, and documents into neat, bulleted summaries in seconds.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-8 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-purple-500/40 hover:bg-slate-900/60 hover-lift active-pop transition-all duration-300 flex flex-col items-start text-left shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-slate-100">AI-Generated Tags</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Eliminate manual tagging. Our system analyzes your content's theme and attaches semantic, logical tags automatically for effortless indexing.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-8 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-pink-500/40 hover:bg-slate-900/60 hover-lift active-pop transition-all duration-300 flex flex-col items-start text-left shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h2m10-10h2a2 2 0 012 2v8a2 2 0 01-2 2h-2m-10 0V17"></path>
                </svg>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-slate-100">All-in-One Locker</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Store notes, web links, YouTube videos, and PDFs under a unified catalog. Stop scattering resources across files and bookmark managers.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-8 mt-20 border-t border-slate-800/40 z-10 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} BrainVault AI. Built with React & Node.js. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-slate-500">
          <a href="#" className="hover:text-slate-300">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300">Terms of Service</a>
          <a href="#" className="hover:text-slate-300 font-medium text-slate-400">Day 1 Build</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
