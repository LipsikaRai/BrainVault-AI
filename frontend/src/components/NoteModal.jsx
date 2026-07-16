import React, { useState, useEffect } from 'react';
import AiInsightsSection from './AiInsightsSection';

const NoteModal = ({ isOpen, onClose, onSave, note, apiLoading, onAiUpdate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [color, setColor] = useState('#4f46e5');
  const [validationError, setValidationError] = useState('');

  // Default color presets
  const colors = [
    { value: '#4f46e5', label: 'Indigo' },
    { value: '#10b981', label: 'Emerald' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#f43f5e', label: 'Rose' },
    { value: '#0ea5e9', label: 'Sky' },
    { value: '#8b5cf6', label: 'Violet' },
  ];

  // Default category presets
  const presetCategories = ['General', 'Work', 'Personal', 'Study', 'Idea'];

  // Sync state with selected note when opening/editing
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setCategory(note.category || 'General');
      setColor(note.color || '#4f46e5');
    } else {
      setTitle('');
      setContent('');
      setCategory('General');
      setColor('#4f46e5');
    }
    setValidationError('');
  }, [note, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // Frontend validation: Check if title and content are empty
    if (!title.trim()) {
      setValidationError('Title is required');
      return;
    }
    if (!content.trim()) {
      setValidationError('Content body cannot be empty');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      category: category.trim() || 'General',
      color,
    });
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Dialog */}
      <div className="bg-[#0a0b10] border border-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-float-short">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-900/60 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">
            {note ? 'Edit Note' : 'Create Note'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            disabled={apiLoading}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold">
              ⚠️ {validationError}
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Title</label>
            <input
              type="text"
              placeholder="e.g. Weekly Review, React State Tips..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={apiLoading}
            />
          </div>

          {/* Category Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Category</label>
            <input
              type="text"
              placeholder="Type category..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={apiLoading}
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
                  disabled={apiLoading}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Color Circle selection */}
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
                  disabled={apiLoading}
                >
                  {color === c.value && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Content</label>
            <textarea
              rows="6"
              placeholder="Write your note markdown or text details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              disabled={apiLoading}
            />
          </div>

          {/* AI Insights Section for existing note */}
          {note && note._id && (
            <AiInsightsSection
              itemId={note._id}
              itemType="note"
              initialSummary={note.aiSummary}
              initialTags={note.tags}
              onUpdate={onAiUpdate}
            />
          )}

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-900/60 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900/40 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              disabled={apiLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-lg shadow-indigo-500/10 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              disabled={apiLoading}
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
                'Save Note'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NoteModal;
