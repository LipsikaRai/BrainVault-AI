import React, { useState, useEffect } from 'react';

const COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#a855f7', // Purple
  '#ec4899', // Pink
];

const ReminderModal = ({ isOpen, onClose, onSave, reminder, apiLoading }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [color, setColor] = useState('#ef4444');
  const [error, setError] = useState('');

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title || '');
      setDescription(reminder.description || '');
      
      // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
      if (reminder.dueDate) {
        const d = new Date(reminder.dueDate);
        // Correct timezone offset for local display
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISODate = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        setDueDate(localISODate);
      } else {
        setDueDate('');
      }
      setColor(reminder.color || '#ef4444');
    } else {
      setTitle('');
      setDescription('');
      // Set default due date to tomorrow at 9:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      const tzOffset = tomorrow.getTimezoneOffset() * 60000;
      const defaultDateTime = new Date(tomorrow.getTime() - tzOffset).toISOString().slice(0, 16);
      setDueDate(defaultDateTime);
      setColor('#ef4444');
    }
    setError('');
  }, [reminder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!dueDate) {
      setError('Due date & time are required');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
      color,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300">
      <div 
        className="w-full max-w-md bg-[#0a0b10] border border-slate-900 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 scale-100 flex flex-col max-h-[90vh]"
        style={{ borderTop: `4px solid ${color}` }}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-900/60 flex justify-between items-center shrink-0">
          <h3 className="font-display font-bold text-lg text-white">
            {reminder ? 'Edit Reminder ⏰' : 'New Reminder ⏰'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-slate-900"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold">
              ⚠️ {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Reminder Title
            </label>
            <input
              type="text"
              placeholder="e.g. Call client, Study algorithms..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={apiLoading}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-900 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Description (Optional)
            </label>
            <textarea
              placeholder="Add details, links, or notes for this reminder..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={apiLoading}
              rows="3"
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-900 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Due Date & Time */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={apiLoading}
              className="w-full px-4 py-2.5 bg-slate-950/60 border border-slate-900 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors scheme-dark"
              required
            />
          </div>

          {/* Theme Color Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Theme Color
            </label>
            <div className="flex flex-wrap gap-2.5">
              {COLORS.map((col) => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setColor(col)}
                  className={`w-7 h-7 rounded-full transition-transform active:scale-90 border-2 cursor-pointer ${
                    color === col ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: col }}
                  title={col}
                />
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-900/40">
            <button
              type="button"
              onClick={onClose}
              disabled={apiLoading}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold hover:bg-slate-900 transition-all cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={apiLoading}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/10 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {apiLoading ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : reminder ? (
                'Save Changes'
              ) : (
                'Create Reminder'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReminderModal;
