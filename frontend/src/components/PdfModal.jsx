import React, { useState, useEffect, useRef } from 'react';
import AiInsightsSection from './AiInsightsSection';

const PdfModal = ({ isOpen, onClose, onSave, pdf, apiLoading, onAiUpdate }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState('General');
  const [color, setColor] = useState('#8b5cf6'); // Default violet for PDFs

  const [validationError, setValidationError] = useState('');
  const fileInputRef = useRef(null);

  // Default color presets
  const colors = [
    { value: '#8b5cf6', label: 'Violet' },
    { value: '#4f46e5', label: 'Indigo' },
    { value: '#10b981', label: 'Emerald' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#f43f5e', label: 'Rose' },
    { value: '#0ea5e9', label: 'Sky' },
  ];

  // Preset categories
  const presetCategories = ['General', 'Study', 'Reference', 'Book', 'Paper', 'Manual'];

  useEffect(() => {
    if (pdf) {
      // Edit mode
      setTitle(pdf.title || '');
      setNotes(pdf.notes || '');
      setCategory(pdf.category || 'General');
      setColor(pdf.color || '#8b5cf6');
    } else {
      // Create mode
      setTitle('');
      setNotes('');
      setCategory('General');
      setColor('#8b5cf6');
    }
    setFile(null);
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [pdf, isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setValidationError('');

    if (selectedFile) {
      // Validate PDF mimetype / extension
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (selectedFile.type !== 'application/pdf' && ext !== 'pdf') {
        setValidationError('Only PDF files are supported.');
        setFile(null);
        e.target.value = '';
        return;
      }

      // Check file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setValidationError('File size must be less than 10MB.');
        setFile(null);
        e.target.value = '';
        return;
      }

      setFile(selectedFile);

      // Auto-prefill Title from filename if title is currently empty
      if (!title) {
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, ''); // strip extension
        setTitle(cleanName);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    // If creating, file is required
    if (!pdf && !file) {
      setValidationError('Please select a PDF file to upload.');
      return;
    }

    // Build multipart/form-data payload
    const formData = new FormData();
    if (file) {
      formData.append('pdf', file);
    }
    formData.append('title', title.trim() || (file ? file.name : 'Untitled PDF'));
    formData.append('category', category.trim() || 'General');
    formData.append('notes', notes.trim());
    formData.append('color', color);

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Dialog */}
      <div className="bg-[#0a0b10] border border-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-float-short">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-900/60 flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">
            {pdf ? 'Edit PDF Details' : 'Upload PDF Document'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Validation/Fetch Error Alert */}
          {validationError && (
            <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold">
              ⚠️ {validationError}
            </div>
          )}

          {/* PDF File Picker */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">
              {pdf ? 'Replace PDF File (Optional)' : 'Select PDF File'}
            </label>
            
            <div className="flex flex-col gap-2">
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-300 text-xs focus:outline-none focus:border-indigo-500 transition-colors file:mr-4 file:py-1.5 file:px-3.5 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-slate-900 file:text-slate-300 file:hover:bg-slate-800 file:cursor-pointer"
                disabled={apiLoading}
              />
              
              {pdf && !file && (
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <svg className="w-3.5 h-3.5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Current: {pdf.fileName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Title</label>
            <input
              type="text"
              placeholder={file ? file.name.replace(/\.[^/.]+$/, '') : "Document Title"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              disabled={apiLoading}
            />
            {!pdf && (
              <span className="text-[9px] text-slate-600 block">Leave blank to use the file name by default.</span>
            )}
          </div>

          {/* Category Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Category</label>
            <input
              type="text"
              placeholder="e.g. Reference, Study..."
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

          {/* Accent Color Selection */}
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

          {/* Notes Textarea */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 tracking-wider uppercase">Personal Notes</label>
            <textarea
              rows="4"
              placeholder="Record summaries, topics discussed, page references, or other notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0d0e15] border border-slate-900 rounded-xl px-4 py-2.5 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              disabled={apiLoading}
            />
          </div>

          {/* AI Insights Section for existing PDF */}
          {pdf && pdf._id && (
            <AiInsightsSection
              itemId={pdf._id}
              itemType="pdf"
              initialSummary={pdf.aiSummary}
              initialTags={pdf.tags}
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
                  Uploading...
                </>
              ) : (
                pdf ? 'Save Changes' : 'Upload PDF'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PdfModal;
