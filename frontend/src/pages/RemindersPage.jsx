import React, { useState } from 'react';

const RemindersPage = ({
  reminders,
  loading,
  apiLoading,
  onSave,
  onDelete,
  onToggleComplete,
  openCreateModal,
  openEditModal,
}) => {
  const [activeSubTab, setActiveSubTab] = useState('pending'); // 'pending' | 'completed'

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch (e) {
      return '';
    }
  };

  const isOverdue = (dateString) => {
    try {
      return new Date(dateString) < new Date();
    } catch (e) {
      return false;
    }
  };

  const pendingReminders = reminders.filter((r) => !r.isCompleted);
  const completedReminders = reminders.filter((r) => r.isCompleted);

  const displayedReminders = activeSubTab === 'pending' ? pendingReminders : completedReminders;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Reminders & Tasks ⏰</h2>
          <p className="text-xs text-slate-500 mt-1">
            Keep track of your study deadlines, meetings, and research goals
          </p>
        </div>

        <button
          onClick={openCreateModal}
          disabled={apiLoading}
          className="py-2.5 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          Add Reminder
        </button>
      </div>

      {/* Sub Tabs / Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-900 pb-4 gap-4">
        <div className="flex bg-slate-950/60 p-1 rounded-xl border border-slate-900/60 self-start">
          <button
            onClick={() => setActiveSubTab('pending')}
            className={`py-1.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'pending'
                ? 'bg-indigo-500/10 text-indigo-400 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Pending
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeSubTab === 'pending' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-slate-600'
            }`}>
              {pendingReminders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('completed')}
            className={`py-1.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'completed'
                ? 'bg-indigo-500/10 text-indigo-400 font-bold'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Completed
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              activeSubTab === 'completed' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-slate-600'
            }`}>
              {completedReminders.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-500">
          Total Reminders: <span className="text-slate-300 font-bold">{reminders.length}</span>
        </div>
      </div>

      {/* List content */}
      {loading ? (
        <div className="py-20 text-center">
          <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-xs text-slate-500 mt-4 font-semibold uppercase tracking-wider">Syncing Reminders...</p>
        </div>
      ) : displayedReminders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-900 bg-slate-950/20">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/5 text-indigo-400/80 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-display font-bold text-lg text-slate-200">
            {activeSubTab === 'pending' ? 'No pending reminders' : 'No completed reminders'}
          </h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
            {activeSubTab === 'pending'
              ? 'You are all caught up! Create a new reminder for your upcoming tasks.'
              : 'Reminders you mark as complete will be saved here for archiving.'}
          </p>
          {activeSubTab === 'pending' && (
            <button
              onClick={openCreateModal}
              className="mt-6 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              Create a Reminder
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedReminders.map((reminder) => {
            const overdue = !reminder.isCompleted && isOverdue(reminder.dueDate);
            return (
              <div
                key={reminder._id}
                className="group relative rounded-2xl bg-[#0d0e15] border border-slate-900/60 p-5 flex flex-col justify-between hover:border-slate-800 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/2 hover:-translate-y-0.5"
                style={{ borderLeft: `4px solid ${reminder.color || '#ef4444'}` }}
              >
                <div>
                  {/* Top Checkbox + Date */}
                  <div className="flex justify-between items-start gap-4 mb-3.5">
                    <button
                      onClick={() => onToggleComplete(reminder)}
                      className={`p-1 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-500 hover:text-white transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                        reminder.isCompleted ? 'text-emerald-500 hover:text-emerald-400' : ''
                      }`}
                      title={reminder.isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                    >
                      {reminder.isCompleted ? (
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-4 h-4 rounded border-2 border-slate-700 group-hover:border-slate-500" />
                      )}
                    </button>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[10px] text-slate-500 font-medium">
                        {formatDate(reminder.dueDate)}
                      </span>
                      {overdue && (
                        <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          Overdue
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className={`font-display font-bold text-base text-white leading-snug mb-2 ${
                    reminder.isCompleted ? 'line-through text-slate-500 decoration-slate-700' : ''
                  }`}>
                    {reminder.title}
                  </h4>

                  {reminder.description && (
                    <p className={`text-xs text-slate-400 leading-relaxed whitespace-pre-wrap mb-4 ${
                      reminder.isCompleted ? 'line-through text-slate-600 decoration-slate-800' : ''
                    }`}>
                      {reminder.description}
                    </p>
                  )}
                </div>

                {/* Bottom Row Actions */}
                <div className="flex items-center justify-end gap-1.5 border-t border-slate-900/60 pt-3.5 mt-2.5 opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEditModal(reminder)}
                    className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Edit Reminder"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(reminder._id)}
                    className="p-1.5 rounded-lg hover:bg-slate-900 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete Reminder"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RemindersPage;
