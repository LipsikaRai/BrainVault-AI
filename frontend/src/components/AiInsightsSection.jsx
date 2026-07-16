import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { EmptyAiSummaryIllustration } from './Illustrations';

const AiInsightsSection = ({ itemId, itemType, initialSummary, initialTags, onUpdate }) => {
  const [summary, setSummary] = useState(initialSummary || '');
  const [tags, setTags] = useState(initialTags || []);

  useEffect(() => {
    setSummary(initialSummary || '');
    setTags(initialTags || []);
  }, [initialSummary, initialTags]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [errorSummary, setErrorSummary] = useState('');
  const [errorTags, setErrorTags] = useState('');

  const handleGenerateSummary = async () => {
    try {
      setLoadingSummary(true);
      setErrorSummary('');
      const { data } = await axiosInstance.post('/ai/summary', {
        itemId,
        itemType
      });
      if (data.success) {
        setSummary(data.summary);
        if (onUpdate) {
          onUpdate(data.data); // Update parent state
        }
      }
    } catch (err) {
      console.error('Error generating summary:', err);
      setErrorSummary(err.response?.data?.message || 'Failed to generate AI summary. Ensure GEMINI_API_KEY is configured.');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleGenerateTags = async () => {
    try {
      setLoadingTags(true);
      setErrorTags('');
      const { data } = await axiosInstance.post('/ai/tags', {
        itemId,
        itemType
      });
      if (data.success) {
        setTags(data.tags);
        if (onUpdate) {
          onUpdate(data.data); // Update parent state
        }
      }
    } catch (err) {
      console.error('Error generating tags:', err);
      setErrorTags(err.response?.data?.message || 'Failed to generate AI tags.');
    } finally {
      setLoadingTags(false);
    }
  };

  const handleGenerateAll = async () => {
    await Promise.all([handleGenerateSummary(), handleGenerateTags()]);
  };

  const hasSummary = !!summary;
  const hasTags = tags && tags.length > 0;
  const isAnyLoading = loadingSummary || loadingTags;

  return (
    <div className="mt-6 pt-5 border-t border-slate-900/60 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase flex items-center gap-1.5 select-none">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Smart Insights
        </h4>
        
        {(hasSummary || hasTags) && !isAnyLoading && (
          <button
            type="button"
            onClick={handleGenerateAll}
            className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
            </svg>
            Regenerate AI Insights
          </button>
        )}
      </div>

      {/* Error Banners */}
      {errorSummary && (
        <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-medium">
          ⚠️ {errorSummary}
        </div>
      )}
      {errorTags && !errorSummary && (
        <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-medium">
          ⚠️ {errorTags}
        </div>
      )}

      {/* Loading Spinner */}
      {isAnyLoading && (
        <div className="p-8 text-center rounded-2xl bg-slate-950/20 border border-slate-900/40 flex flex-col items-center justify-center gap-3">
          <svg className="animate-spin h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs text-slate-400 font-semibold animate-pulse">
            Gemini is analyzing & generating details...
          </span>
        </div>
      )}

      {/* Initial Generation Button (when nothing generated yet) */}
      {!hasSummary && !hasTags && !isAnyLoading && (
        <div className="p-6 text-center rounded-2xl bg-[#0b0c12]/80 border border-indigo-950/30 border-dashed">
          <EmptyAiSummaryIllustration />
          <p className="text-xs text-slate-400 mt-3 mb-3.5 leading-relaxed">
            Generate an AI-powered summary and smart categorization tags based on this item's content.
          </p>
          <button
            type="button"
            onClick={handleGenerateAll}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/10 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer mx-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate AI Summary & Tags
          </button>
        </div>
      )}

      {/* AI Content Display */}
      {((hasSummary || hasTags) && !isAnyLoading) && (
        <div className="space-y-3.5 animate-fade-in">
          
          {/* AI Summary Card */}
          {hasSummary && (
            <div className="bg-[#0b0c12]/80 border border-indigo-950/20 rounded-2xl p-4 shadow-inner relative overflow-hidden group">
              {/* Glassmorphic overlay effect */}
              <div className="absolute inset-0 bg-indigo-500/[0.01] pointer-events-none"></div>
              
              <div className="flex items-center gap-1.5 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                <span>🤖 AI Summary</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans select-text">
                {summary}
              </p>
            </div>
          )}

          {/* AI Tags Section */}
          {hasTags && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Smart Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 transition-all hover:bg-indigo-500/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default AiInsightsSection;
