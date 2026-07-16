import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../utils/axiosInstance';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatsSection from '../components/StatsSection';
import RecentActivity from '../components/RecentActivity';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';

// Day 3 Imports
import VideosPage from './VideosPage';
import WebsitesPage from './WebsitesPage';

// Day 4 Imports
import PDFsPage from './PDFsPage';

// Day 6 Imports
import RemindersPage from './RemindersPage';
import ReminderModal from '../components/ReminderModal';
import ResourceCard from '../components/ResourceCard';
import PdfCard from '../components/PdfCard';
import { useToast } from '../context/ToastContext';
import { WelcomeIllustration, EmptyNotesIllustration } from '../components/Illustrations';


const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { success: toastSuccess, error: toastError } = useToast();
  
  // Dashboard & Notes State
  const [notes, setNotes] = useState([]);
  const [resources, setResources] = useState([]); // Day 3 state
  const [pdfs, setPdfs] = useState([]); // Day 4 state
  const [loading, setLoading] = useState(true);
  const [apiLoading, setApiLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Navigation & Filtering State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'notes' | 'videos' | 'websites' | 'pdfs' | 'reminders'
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal State for Notes
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Day 6 Search & Reminder State
  const [reminders, setReminders] = useState([]);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ notes: [], videos: [], websites: [], pdfs: [] });
  const [searchLoading, setSearchLoading] = useState(false);
  const [notifiedReminderIds, setNotifiedReminderIds] = useState([]);

  // Fetch all notes, resources, PDFs, and reminders belonging to the user
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [notesRes, resourcesRes, pdfsRes, remindersRes] = await Promise.all([
        axiosInstance.get('/notes'),
        axiosInstance.get('/resources'),
        axiosInstance.get('/pdfs'),
        axiosInstance.get('/reminders')
      ]);

      if (notesRes.data.success) {
        setNotes(notesRes.data.data);
      }
      if (resourcesRes.data.success) {
        setResources(resourcesRes.data.data);
      }
      if (pdfsRes.data.success) {
        setPdfs(pdfsRes.data.data);
      }
      if (remindersRes.data.success) {
        setReminders(remindersRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Could not fetch your data. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Compute dynamic stats from current state
  const notesCount = notes.length;
  const videos = resources.filter((r) => r.type === 'video');
  const websites = resources.filter((r) => r.type === 'website');
  const pdfsCount = pdfs.length;
  
  const allCategories = [
    ...notes.map((n) => n.category || 'General'),
    ...resources.map((r) => r.category || 'General'),
    ...pdfs.map((p) => p.category || 'General')
  ];
  const uniqueCategories = [...new Set(allCategories)];
  const categoriesCount = uniqueCategories.length;

  const uniqueNoteCategories = [...new Set(notes.map((n) => n.category || 'General'))];

  // ==================== NOTES CRUD ====================
  
  const handleSaveNote = async (noteData) => {
    try {
      setApiLoading(true);
      setError(null);
      
      if (editingNote) {
        // Edit flow
        const { data } = await axiosInstance.put(`/notes/${editingNote._id}`, noteData);
        if (data.success) {
          setNotes((prevNotes) =>
            prevNotes.map((n) => (n._id === editingNote._id ? data.data : n))
          );
          setIsModalOpen(false);
          setEditingNote(null);
          toastSuccess('Note updated successfully!');
        }
      } else {
        // Create flow
        const { data } = await axiosInstance.post('/notes', noteData);
        if (data.success) {
          setNotes((prevNotes) => [data.data, ...prevNotes]);
          setIsModalOpen(false);
          toastSuccess('Note created successfully!');
        }
      }
    } catch (err) {
      console.error('Error saving note:', err);
      const errMsg = err.response?.data?.message || 'Failed to save note. Please try again.';
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      setApiLoading(true);
      setError(null);
      const { data } = await axiosInstance.delete(`/notes/${id}`);
      if (data.success) {
        setNotes((prevNotes) => prevNotes.filter((n) => n._id !== id));
        toastSuccess('Note deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting note:', err);
      const errMsg = err.response?.data?.message || 'Failed to delete note.';
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setApiLoading(false);
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const { data } = await axiosInstance.put(`/notes/${note._id}`, {
        isPinned: !note.isPinned,
      });
      if (data.success) {
        setNotes((prevNotes) =>
          prevNotes.map((n) => (n._id === note._id ? data.data : n))
        );
        toastSuccess(note.isPinned ? 'Note unpinned' : 'Note pinned successfully!');
      }
    } catch (err) {
      console.error('Error toggling pin:', err);
      toastError('Failed to pin/unpin note.');
    }
  };

  const handleToggleFavorite = async (note) => {
    try {
      const { data } = await axiosInstance.put(`/notes/${note._id}`, {
        isFavorite: !note.isFavorite,
      });
      if (data.success) {
        setNotes((prevNotes) =>
          prevNotes.map((n) => (n._id === note._id ? data.data : n))
        );
        toastSuccess(note.isFavorite ? 'Removed from favorites' : 'Added note to favorites!');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toastError('Failed to update favorite status.');
    }
  };

  const handleNoteAiUpdate = (updatedNote) => {
    setNotes((prevNotes) =>
      prevNotes.map((n) => (n._id === updatedNote._id ? updatedNote : n))
    );
    if (editingNote && editingNote._id === updatedNote._id) {
      setEditingNote(updatedNote);
    }
  };

  const handleResourceAiUpdate = (updatedResource) => {
    setResources((prevResources) =>
      prevResources.map((r) => (r._id === updatedResource._id ? updatedResource : r))
    );
  };

  const handlePdfAiUpdate = (updatedPdf) => {
    setPdfs((prevPdfs) =>
      prevPdfs.map((p) => (p._id === updatedPdf._id ? updatedPdf : p))
    );
  };

  const openCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  // ==================== REMINDERS CRUD (Day 6) ====================
  const handleSaveReminder = async (reminderData) => {
    try {
      setApiLoading(true);
      setError(null);

      if (editingReminder) {
        // Edit flow
        const { data } = await axiosInstance.put(`/reminders/${editingReminder._id}`, reminderData);
        if (data.success) {
          setReminders((prev) =>
            prev.map((r) => (r._id === editingReminder._id ? data.data : r))
          );
          setIsReminderModalOpen(false);
          setEditingReminder(null);
          toastSuccess('Reminder updated successfully!');
        }
      } else {
        // Create flow
        const { data } = await axiosInstance.post('/reminders', reminderData);
        if (data.success) {
          setReminders((prev) => [...prev, data.data].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
          setIsReminderModalOpen(false);
          toastSuccess('Reminder created successfully!');
        }
      }
    } catch (err) {
      console.error('Error saving reminder:', err);
      const errMsg = err.response?.data?.message || 'Failed to save reminder.';
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteReminder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;

    try {
      setApiLoading(true);
      setError(null);
      const { data } = await axiosInstance.delete(`/reminders/${id}`);
      if (data.success) {
        setReminders((prev) => prev.filter((r) => r._id !== id));
        toastSuccess('Reminder deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting reminder:', err);
      const errMsg = err.response?.data?.message || 'Failed to delete reminder.';
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setApiLoading(false);
    }
  };

  const handleToggleReminderComplete = async (reminder) => {
    try {
      const { data } = await axiosInstance.put(`/reminders/${reminder._id}`, {
        isCompleted: !reminder.isCompleted,
      });
      if (data.success) {
        setReminders((prev) =>
          prev.map((r) => (r._id === reminder._id ? data.data : r))
        );
        toastSuccess(reminder.isCompleted ? 'Reminder marked incomplete' : 'Reminder completed!');
      }
    } catch (err) {
      console.error('Error toggling reminder status:', err);
      toastError('Failed to update reminder status.');
    }
  };

  const openCreateReminderModal = () => {
    setEditingReminder(null);
    setIsReminderModalOpen(true);
  };

  const openEditReminderModal = (reminder) => {
    setEditingReminder(reminder);
    setIsReminderModalOpen(true);
  };

  // ==================== GLOBAL SEARCH DEBOUNCE (Day 6) ====================
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ notes: [], videos: [], websites: [], pdfs: [] });
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const { data } = await axiosInstance.get(`/search?q=${encodeURIComponent(searchQuery)}`);
        if (data.success) {
          setSearchResults(data.data);
        }
      } catch (err) {
        console.error('Error searching vault:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // ==================== BROWSER NOTIFICATIONS (Day 6) ====================
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach((reminder) => {
        if (
          !reminder.isCompleted &&
          new Date(reminder.dueDate) <= now &&
          !notifiedReminderIds.includes(reminder._id)
        ) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`BrainVault.AI: ${reminder.title}`, {
              body: reminder.description || `This reminder is due now (${new Date(reminder.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
              tag: reminder._id,
              icon: '/favicon.ico',
            });
          }
          setNotifiedReminderIds((prev) => [...prev, reminder._id]);
        }
      });
    }, 10000); // Check every 10 seconds for high responsiveness

    return () => clearInterval(interval);
  }, [reminders, notifiedReminderIds]);

  // ==================== RESOURCES CRUD (Day 3) ====================

  const handleSaveResource = async (resourceData, editingResource, type) => {
    try {
      setApiLoading(true);
      setError(null);
      
      const label = type === 'video' ? 'Video' : 'Website';
      
      if (editingResource) {
        // Edit flow
        const { data } = await axiosInstance.put(`/resources/${editingResource._id}`, resourceData);
        if (data.success) {
          setResources((prev) =>
            prev.map((r) => (r._id === editingResource._id ? data.data : r))
          );
          toastSuccess(`${label} resource updated successfully!`);
        }
      } else {
        // Create flow
        const { data } = await axiosInstance.post('/resources', { ...resourceData, type });
        if (data.success) {
          setResources((prev) => [data.data, ...prev]);
          toastSuccess(`${label} resource added successfully!`);
        }
      }
    } catch (err) {
      console.error('Error saving resource:', err);
      const errMsg = err.response?.data?.message || 'Failed to save resource. Please try again.';
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      setApiLoading(true);
      setError(null);
      const { data } = await axiosInstance.delete(`/resources/${id}`);
      if (data.success) {
        setResources((prev) => prev.filter((r) => r._id !== id));
        toastSuccess('Resource deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting resource:', err);
      const errMsg = err.response?.data?.message || 'Failed to delete resource.';
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setApiLoading(false);
    }
  };

  const handleToggleResourcePin = async (resource) => {
    try {
      const { data } = await axiosInstance.put(`/resources/${resource._id}`, {
        isPinned: !resource.isPinned,
      });
      if (data.success) {
        setResources((prev) =>
          prev.map((r) => (r._id === resource._id ? data.data : r))
        );
        toastSuccess(resource.isPinned ? 'Resource unpinned' : 'Resource pinned successfully!');
      }
    } catch (err) {
      console.error('Error toggling pin:', err);
      toastError('Failed to update resource pin status.');
    }
  };

  const handleToggleResourceFavorite = async (resource) => {
    try {
      const { data } = await axiosInstance.put(`/resources/${resource._id}`, {
        isFavorite: !resource.isFavorite,
      });
      if (data.success) {
        setResources((prev) =>
          prev.map((r) => (r._id === resource._id ? data.data : r))
        );
        toastSuccess(resource.isFavorite ? 'Removed from favorites' : 'Added resource to favorites!');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toastError('Failed to update resource favorite status.');
    }
  };

  // ==================== PDF CRUD (Day 4) ====================

  const handleSavePdf = async (formData, editingPdf) => {
    try {
      setApiLoading(true);
      setError(null);
      
      if (editingPdf) {
        // Edit flow
        const { data } = await axiosInstance.put(`/pdfs/${editingPdf._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (data.success) {
          setPdfs((prev) =>
            prev.map((p) => (p._id === editingPdf._id ? data.data : p))
          );
          toastSuccess('PDF details updated successfully!');
        }
      } else {
        // Create flow
        const { data } = await axiosInstance.post('/pdfs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (data.success) {
          setPdfs((prev) => [data.data, ...prev]);
          toastSuccess('PDF document uploaded successfully!');
        }
      }
    } catch (err) {
      console.error('Error saving PDF:', err);
      const errMsg = err.response?.data?.message || 'Failed to save PDF. Please try again.';
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setApiLoading(false);
    }
  };

  const handleDeletePdf = async (id) => {
    if (!window.confirm('Are you sure you want to delete this PDF?')) return;
    
    try {
      setApiLoading(true);
      setError(null);
      const { data } = await axiosInstance.delete(`/pdfs/${id}`);
      if (data.success) {
        setPdfs((prev) => prev.filter((p) => p._id !== id));
        toastSuccess('PDF document deleted successfully!');
      }
    } catch (err) {
      console.error('Error deleting PDF:', err);
      const errMsg = err.response?.data?.message || 'Failed to delete PDF.';
      setError(errMsg);
      toastError(errMsg);
    } finally {
      setApiLoading(false);
    }
  };

  const handleTogglePdfPin = async (pdf) => {
    try {
      const { data } = await axiosInstance.put(`/pdfs/${pdf._id}`, {
        isPinned: !pdf.isPinned,
      });
      if (data.success) {
        setPdfs((prev) =>
          prev.map((p) => (p._id === pdf._id ? data.data : p))
        );
        toastSuccess(pdf.isPinned ? 'PDF unpinned' : 'PDF pinned successfully!');
      }
    } catch (err) {
      console.error('Error toggling pin:', err);
      toastError('Failed to update PDF pin status.');
    }
  };

  const handleTogglePdfFavorite = async (pdf) => {
    try {
      const { data } = await axiosInstance.put(`/pdfs/${pdf._id}`, {
        isFavorite: !pdf.isFavorite,
      });
      if (data.success) {
        setPdfs((prev) =>
          prev.map((p) => (p._id === pdf._id ? data.data : p))
        );
        toastSuccess(pdf.isFavorite ? 'Removed from favorites' : 'Added PDF to favorites!');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      toastError('Failed to update PDF favorite status.');
    }
  };

  // ==================== RENDERING UTILS ====================

  const filteredNotes = notes.filter((note) => {
    if (selectedCategory === 'All') return true;
    return note.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const pinnedNotes = filteredNotes.filter((n) => n.isPinned);
  const unpinnedNotes = filteredNotes.filter((n) => !n.isPinned);

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-5 rounded-2xl bg-slate-900/30 border border-slate-900/60 space-y-4 animate-skeleton">
          <div className="flex justify-between items-start">
            <div className="h-5 w-24 bg-slate-850 rounded-md"></div>
            <div className="h-4 w-4 bg-slate-850 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-slate-850/60 rounded-md"></div>
            <div className="h-3 w-5/6 bg-slate-850/60 rounded-md"></div>
            <div className="h-3 w-4/6 bg-slate-850/60 rounded-md"></div>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 w-16 bg-slate-850 rounded-md"></div>
            <div className="h-4 w-12 bg-slate-850 rounded-md"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 flex font-sans">
      
      {/* Sidebar (Desktop only) */}
      <Sidebar
        user={user}
        logout={logout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        categories={uniqueCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Sticky Header Navbar */}
        <Navbar 
          user={user} 
          logout={logout} 
          activeTab={activeTab} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Content Body */}
        <main className="p-6 md:p-8 max-w-5xl w-full mx-auto space-y-8">
          
          {/* Global Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-semibold flex items-center justify-between">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)} className="text-slate-400 hover:text-white font-bold px-2">✕</button>
            </div>
          )}

          {/* Global Search Bar (Mobile only) */}
          <div className="relative w-full sm:hidden">
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
              className="block w-full pl-10 pr-9 py-2.5 bg-slate-950/60 border border-slate-900 focus:border-indigo-500/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Tab Selector on Mobile View */}
          <div className="flex md:hidden bg-slate-950/60 p-1.5 rounded-2xl border border-slate-900 overflow-x-auto gap-1">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setSelectedCategory('All');
              }}
              className={`py-2 px-3.5 rounded-xl text-center text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setActiveTab('notes');
                setSelectedCategory('All');
              }}
              className={`py-2 px-3.5 rounded-xl text-center text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'notes' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => {
                setActiveTab('videos');
                setSelectedCategory('All');
              }}
              className={`py-2 px-3.5 rounded-xl text-center text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'videos' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => {
                setActiveTab('websites');
                setSelectedCategory('All');
              }}
              className={`py-2 px-3.5 rounded-xl text-center text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'websites' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Websites
            </button>
            <button
              onClick={() => {
                setActiveTab('pdfs');
                setSelectedCategory('All');
              }}
              className={`py-2 px-3.5 rounded-xl text-center text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'pdfs' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              PDFs
            </button>
            <button
              onClick={() => {
                setActiveTab('reminders');
                setSelectedCategory('All');
              }}
              className={`py-2 px-3.5 rounded-xl text-center text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                activeTab === 'reminders' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Reminders
            </button>
          </div>

          {/* ==================== DASHBOARD VIEW ==================== */}
          {searchQuery.trim() === '' && activeTab === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-slate-900/80 to-indigo-950/20 border border-slate-800/80 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="z-10 relative flex-1">
                  <span className="text-indigo-400 text-xs font-semibold tracking-wider uppercase bg-indigo-500/10 px-3 py-1 rounded-full">
                    Knowledge Library Active
                  </span>
                  <h1 className="font-display font-bold text-2xl md:text-4xl text-white mt-4 mb-2">
                    {getGreeting()}, {user?.username || 'Scholar'}!
                  </h1>
                  <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
                    Welcome to BrainVault.AI. Your secure knowledge catalog is active. Manage your notes, bookmark websites, document YouTube research, and organize PDF documents seamlessly.
                  </p>
                </div>
                <div className="z-10 hidden md:block shrink-0">
                  <WelcomeIllustration />
                </div>
              </div>

              {/* Statistics Cards */}
              <StatsSection
                notesCount={notesCount}
                videosCount={videos.length}
                websitesCount={websites.length}
                pdfsCount={pdfsCount}
                categoriesCount={categoriesCount}
              />

              {/* Quick Actions & Today's Reminders Widget Rows */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Quick Actions Card */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-sm flex flex-col space-y-4 md:col-span-1">
                  <h3 className="font-display font-bold text-sm text-slate-200 pb-2 border-b border-slate-900/80">
                    Quick Actions
                  </h3>
                  <button
                    onClick={openCreateModal}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Note
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-800 hover:bg-slate-900/40 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Add Video Resource
                  </button>
                  <button
                    onClick={() => setActiveTab('websites')}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-800 hover:bg-slate-900/40 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    Bookmark Website
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('pdfs');
                      setSelectedCategory('All');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border border-slate-800 hover:bg-slate-900/40 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Upload PDF Library
                  </button>
                </div>

                {/* Today's Reminder Widget */}
                <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-sm flex flex-col space-y-4 md:col-span-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-900/80">
                    <h3 className="font-display font-bold text-sm text-slate-200 flex items-center gap-1.5 select-none">
                      Today's Reminders ⏰
                    </h3>
                    <button
                      onClick={() => setActiveTab('reminders')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-semibold flex items-center gap-0.5 cursor-pointer"
                    >
                      View All
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[220px] pr-1.5 scrollbar-thin scrollbar-thumb-slate-850 scrollbar-track-transparent">
                    {(() => {
                      const todayStr = new Date().toDateString();
                      const todayReminders = reminders.filter(r => new Date(r.dueDate).toDateString() === todayStr);
                      
                      if (todayReminders.length === 0) {
                        return (
                          <div className="py-10 text-center flex flex-col items-center justify-center">
                            <p className="text-slate-500 text-xs font-medium">No reminders scheduled for today! 🌟</p>
                            <button
                              onClick={openCreateReminderModal}
                              className="mt-3.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer bg-indigo-500/5 hover:bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/10"
                            >
                              Add Reminder
                            </button>
                          </div>
                        );
                      }

                      return todayReminders.map((reminder) => {
                        const overdue = !reminder.isCompleted && new Date(reminder.dueDate) < new Date();
                        const formattedTime = new Date(reminder.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        
                        return (
                          <div
                            key={reminder._id}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-950/45 border border-slate-900/60 hover:border-slate-800 transition-colors gap-3"
                            style={{ borderLeft: `3px solid ${reminder.color || '#ef4444'}` }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <button
                                onClick={() => handleToggleReminderComplete(reminder)}
                                className={`p-1 rounded-lg border border-slate-800 bg-slate-900/40 text-slate-500 hover:text-emerald-400 hover:border-slate-700 transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                                  reminder.isCompleted ? 'text-emerald-500 border-emerald-500/30' : ''
                                }`}
                              >
                                {reminder.isCompleted ? (
                                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded border border-slate-600" />
                                )}
                              </button>
                              
                              <div className="min-w-0">
                                <p className={`text-xs font-semibold text-white truncate leading-normal ${
                                  reminder.isCompleted ? 'line-through text-slate-500 decoration-slate-600' : ''
                                }`}>
                                  {reminder.title}
                                </p>
                                {reminder.description && (
                                  <p className="text-[10px] text-slate-550 truncate leading-normal mt-0.5">
                                    {reminder.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="text-[10px] font-bold text-slate-500">
                                {formattedTime}
                              </span>
                              {overdue && (
                                <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest bg-rose-500/10 px-1.5 py-0.5 rounded">
                                  Overdue
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Recent Activity Card (takes full width) */}
              <div className="w-full">
                <RecentActivity notes={notes} resources={resources} pdfs={pdfs} />
              </div>
            </>
          )}

          {/* ==================== GLOBAL SEARCH RESULTS VIEW (Day 6) ==================== */}
          {searchQuery.trim() !== '' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-900 pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-white">Search Results</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Found matches across your vault resources for <span className="text-indigo-400 font-bold">"{searchQuery}"</span>
                  </p>
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer active:scale-95 transition-all"
                >
                  Clear Search
                </button>
              </div>

              {searchLoading ? (
                <div className="py-20 text-center">
                  <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="text-xs text-slate-500 mt-4 font-semibold uppercase tracking-wider">Searching Vault...</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* Notes Results */}
                  {searchResults.notes && searchResults.notes.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 select-none">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Notes ({searchResults.notes.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {searchResults.notes.map((note) => (
                          <NoteCard
                            key={note._id}
                            note={note}
                            onEdit={openEditModal}
                            onDelete={handleDeleteNote}
                            onTogglePin={handleTogglePin}
                            onToggleFavorite={handleToggleFavorite}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos Results */}
                  {searchResults.videos && searchResults.videos.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 select-none">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Videos ({searchResults.videos.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {searchResults.videos.map((resource) => (
                          <ResourceCard
                            key={resource._id}
                            resource={resource}
                            onEdit={(res) => {
                              setActiveTab('videos');
                              setSearchQuery('');
                            }}
                            onDelete={handleDeleteResource}
                            onTogglePin={handleToggleResourcePin}
                            onToggleFavorite={handleToggleResourceFavorite}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Websites Results */}
                  {searchResults.websites && searchResults.websites.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 select-none">
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Websites ({searchResults.websites.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {searchResults.websites.map((resource) => (
                          <ResourceCard
                            key={resource._id}
                            resource={resource}
                            onEdit={(res) => {
                              setActiveTab('websites');
                              setSearchQuery('');
                            }}
                            onDelete={handleDeleteResource}
                            onTogglePin={handleToggleResourcePin}
                            onToggleFavorite={handleToggleResourceFavorite}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* PDFs Results */}
                  {searchResults.pdfs && searchResults.pdfs.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 select-none">
                        <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9h1.5m1.5 0H13m-4 4h4m-4 4h4" />
                        </svg>
                        PDF Documents ({searchResults.pdfs.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {searchResults.pdfs.map((pdf) => (
                          <PdfCard
                            key={pdf._id}
                            pdf={pdf}
                            onEdit={(p) => {
                              setActiveTab('pdfs');
                              setSearchQuery('');
                            }}
                            onDelete={handleDeletePdf}
                            onTogglePin={handleTogglePdfPin}
                            onToggleFavorite={handleTogglePdfFavorite}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {(!searchResults.notes || searchResults.notes.length === 0) &&
                   (!searchResults.videos || searchResults.videos.length === 0) &&
                   (!searchResults.websites || searchResults.websites.length === 0) &&
                   (!searchResults.pdfs || searchResults.pdfs.length === 0) && (
                     <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-900 bg-slate-950/20">
                       <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 text-indigo-400/80 flex items-center justify-center mx-auto mb-6">
                         <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                         </svg>
                       </div>
                       <h3 className="font-display font-bold text-lg text-slate-200 select-none">No Matches Found</h3>
                       <p className="text-sm text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed select-none">
                         We couldn't find any resource matching "{searchQuery}". Try different keywords.
                       </p>
                     </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ==================== NOTES LIST VIEW ==================== */}
          {searchQuery.trim() === '' && activeTab === 'notes' && (
            <div className="space-y-6">
              
              {/* Filter details & Mobile Categories row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-white">My Notes Vault</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Viewing <span className="text-indigo-400 font-bold">{selectedCategory}</span> notes
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={openCreateModal}
                    className="py-2 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    New Note
                  </button>
                </div>
              </div>

              {/* Mobile horizontal scrolling category selector */}
              <div className="flex md:hidden gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                      : 'bg-slate-900 text-slate-400 border border-transparent'
                  }`}
                >
                  All Notes
                </button>
                {uniqueNoteCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all ${
                      selectedCategory === cat
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                        : 'bg-slate-900 text-slate-400 border border-transparent'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Loading & Empty States */}
              {loading ? (
                <LoadingSkeleton />
              ) : notes.length === 0 ? (
                <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-900 bg-slate-950/20">
                  <EmptyNotesIllustration />
                  <h3 className="font-display font-bold text-lg text-slate-200">Vault is Empty</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                    You haven't saved any notes yet. Click "New Note" to write down your first concept or reminder.
                  </p>
                  <button
                    onClick={openCreateModal}
                    className="mt-6 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    Create a Note
                  </button>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-950/10 border border-slate-900/60">
                  <p className="text-sm text-slate-400">No notes found matching category: <span className="font-bold text-indigo-400">{selectedCategory}</span></p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* PINNED SECTION */}
                  {pinnedNotes.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
                        </svg>
                        Pinned Notes ({pinnedNotes.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {pinnedNotes.map((note) => (
                          <NoteCard
                            key={note._id}
                            note={note}
                            onEdit={openEditModal}
                            onDelete={handleDeleteNote}
                            onTogglePin={handleTogglePin}
                            onToggleFavorite={handleToggleFavorite}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* UNPINNED SECTION */}
                  <div className="space-y-3">
                    {pinnedNotes.length > 0 && (
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest select-none">
                        All Other Notes
                      </h4>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {unpinnedNotes.map((note) => (
                        <NoteCard
                          key={note._id}
                          note={note}
                          onEdit={openEditModal}
                          onDelete={handleDeleteNote}
                          onTogglePin={handleTogglePin}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== VIDEOS LIST VIEW (Day 3) ==================== */}
          {searchQuery.trim() === '' && activeTab === 'videos' && (
            <VideosPage
              videos={videos}
              loading={loading}
              apiLoading={apiLoading}
              onSave={handleSaveResource}
              onDelete={handleDeleteResource}
              onTogglePin={handleToggleResourcePin}
              onToggleFavorite={handleToggleResourceFavorite}
              onAiUpdate={handleResourceAiUpdate}
            />
          )}

          {/* ==================== WEBSITES LIST VIEW (Day 3) ==================== */}
          {searchQuery.trim() === '' && activeTab === 'websites' && (
            <WebsitesPage
              websites={websites}
              loading={loading}
              apiLoading={apiLoading}
              onSave={handleSaveResource}
              onDelete={handleDeleteResource}
              onTogglePin={handleToggleResourcePin}
              onToggleFavorite={handleToggleResourceFavorite}
              onAiUpdate={handleResourceAiUpdate}
            />
          )}

          {/* ==================== PDFS LIST VIEW (Day 4) ==================== */}
          {searchQuery.trim() === '' && activeTab === 'pdfs' && (
            <PDFsPage
              pdfs={pdfs}
              loading={loading}
              apiLoading={apiLoading}
              onSave={handleSavePdf}
              onDelete={handleDeletePdf}
              onTogglePin={handleTogglePdfPin}
              onToggleFavorite={handleTogglePdfFavorite}
              onAiUpdate={handlePdfAiUpdate}
            />
          )}

          {/* ==================== REMINDERS LIST VIEW (Day 6) ==================== */}
          {searchQuery.trim() === '' && activeTab === 'reminders' && (
            <RemindersPage
              reminders={reminders}
              loading={loading}
              apiLoading={apiLoading}
              onSave={handleSaveReminder}
              onDelete={handleDeleteReminder}
              onToggleComplete={handleToggleReminderComplete}
              openCreateModal={openCreateReminderModal}
              openEditModal={openEditReminderModal}
            />
          )}

        </main>
      </div>

      {/* Reusable modal for note CRUD details */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        note={editingNote}
        apiLoading={apiLoading}
        onAiUpdate={handleNoteAiUpdate}
      />

      {/* Reusable modal for reminder CRUD details */}
      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => {
          setIsReminderModalOpen(false);
          setEditingReminder(null);
        }}
        onSave={handleSaveReminder}
        reminder={editingReminder}
        apiLoading={apiLoading}
      />

    </div>
  );
};

export default Dashboard;
