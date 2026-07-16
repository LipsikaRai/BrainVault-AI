import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';
import AiInsightsSection from './AiInsightsSection';

const ResourceModal = ({ isOpen, onClose, onSave, resource, type, apiLoading, onAiUpdate }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('General');
  const [color, setColor] = useState('#4f46e5');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  const [fetchingYt, setFetchingYt] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');

  // Default color presets
  const colors = [
    { value: '#4f46e5', label: 'Indigo' },
    { value: '#10b981', label: 'Emerald' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#f43f5e', label: 'Rose' },
    { value: '#0ea5e9', label: 'Sky' },
    { value: '#8b5cf6', label: 'Violet' },
  ];

  // Preset categories
  const presetCategories = ['General', 'Study', 'Reference', 'Work', 'Tutorial', 'Entertainment'];

  // Sync state with resource details when opening/editing
  useEffect(() => {
    if (resource) {
      setUrl(resource.url || '');
      setTitle(resource.title || '');
      setNotes(resource.notes || '');
      setCategory(resource.category || 'General');
      setColor(resource.color || '#4f46e5');
      setThumbnailUrl(resource.thumbnailUrl || '');
    } else {
      setUrl('');
      setTitle('');
      setNotes('');
      setCategory('General');
      setColor('#4f46e5');
      setThumbnailUrl('');
    }
    setValidationError('');
    setSuccessInfo('');
    setFetchingYt(false);
  }, [resource, isOpen]);

  if (!isOpen) return null;

  const currentType = resource ? resource.type : type;

  // Function to fetch YouTube info from backend helper
  const handleFetchYoutubeInfo = async (urlToFetch) => {
    if (!urlToFetch) return;
    
    // Check if it looks like a YouTube link
    const isYoutube = urlToFetch.includes('youtube.com') || urlToFetch.includes('youtu.be');
    if (!isYoutube) return;

    try {
      setFetchingYt(true);
      setValidationError('');
      setSuccessInfo('');

      const { data } = await axiosInstance.get(`/resources/youtube-info?url=${encodeURIComponent(urlToFetch)}`);
      
      if (data.success && data.data) {
        setTitle(data.data.title);
        setThumbnailUrl(data.data.thumbnailUrl);
        setSuccessInfo('Successfully fetched YouTube video metadata!');
      }
    } catch (err) {
      console.error('Error fetching YouTube metadata:', err);
      setValidationError(err.response?.data?.message || 'Could not auto-fetch YouTube video info. You can still save or enter details manually.');
    } finally {
      setFetchingYt(false);
    }
  };

  const handleUrlBlur = () => {
    if (currentType === 'video' && url) {
      handleFetchYoutubeInfo(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!url.trim()) {
      setValidationError('Resource URL is required');
      return;
    }

    if (currentType === 'website' && !title.trim()) {
      setValidationError('Website title is required');
      return;
    }

    onSave({
      url: url.trim(),
      title: title.trim() || (currentType === 'video' ? 'YouTube Video' : ''),
      notes: notes.trim(),
      category: category.trim() || 'General',
      color,
      thumbnailUrl: thumbnailUrl.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Dialog */}
      <div className="bg-[#0a0b10] border border-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-float-short">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-900/60 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">
            {resource ? `Edit ${currentType === 'video' ? 'Video' : 'Website'}` : `Add ${currentType === 'video' ? 'Video' : 'Website'}`}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            disabled={apiLoading || fetchingYt}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Validation/Fetch Error Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold">
              ⚠️ {validationError}
            </div>
          )}

          {/* Success Banner */}
          {successInfo && (
            <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold">
              ✨ {successInfo}
            </div>
          )}

          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={currentType === 'video' ? 'https://www.youtube.com/watch?v=...' : 'https://example.com'}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onBlur={handleUrlBlur}
                className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                disabled={apiLoading || fetchingYt}
              />
              {currentType === 'video' && (
                <button
                  type="button"
                  onClick={() => handleFetchYoutubeInfo(url)}
                  disabled={fetchingYt || apiLoading || !url}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 cursor-pointer"
                >
                  {fetchingYt ? 'Fetching...' : 'Fetch'}
                </button>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
              Title {currentType === 'video' && <span className="text-slate-600 font-normal">(Auto-fetched or custom)</span>}
            </label>
            <input
              type="text"
              placeholder={currentType === 'video' ? 'Video Title' : 'e.g. CSS Tricks, GitHub repo...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={apiLoading || fetchingYt}
            />
          </div>

          {/* Video Thumbnail Preview */}
          {currentType === 'video' && thumbnailUrl && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Thumbnail Preview</label>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-900/60 max-w-[200px]">
                <img src={thumbnailUrl} alt="Thumbnail Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Category Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Category</label>
            <input
              type="text"
              placeholder="Type category..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={apiLoading || fetchingYt}
            />
            {/* Quick Category Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {presetCategories.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setCategory(preset)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                    category.toLowerCase() === preset.toLowerCase()
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-transparent'
                  }`}
                  disabled={apiLoading || fetchingYt}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Color selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Card Accent Color</label>
            <div className="flex items-center gap-3">
              {colors.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-all relative flex items-center justify-center cursor-pointer hover:scale-110 ${
                    color === c.value ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                  disabled={apiLoading || fetchingYt}
                >
                  {color === c.value && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notes Textarea */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Personal Notes</label>
            <textarea
              rows="4"
              placeholder="Add your takeaways, concepts, or reminders here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              disabled={apiLoading || fetchingYt}
            />
          </div>

          {/* AI Insights Section for existing resource */}
          {resource && resource._id && (
            <AiInsightsSection
              itemId={resource._id}
              itemType={resource.type}
              initialSummary={resource.aiSummary}
              initialTags={resource.tags}
              onUpdate={onAiUpdate}
            />
          )}

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-900/60 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900/40 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              disabled={apiLoading || fetchingYt}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              disabled={apiLoading || fetchingYt}
            >
              {apiLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResourceModal;
