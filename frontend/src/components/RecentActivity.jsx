import React from 'react';

const RecentActivity = ({ notes = [], resources = [], pdfs = [] }) => {
  // Combine all items, add type, sort by createdAt descending, and take the top 5
  const items = [
    ...notes.map((n) => ({ ...n, itemType: 'Note' })),
    ...resources.map((r) => ({ ...r, itemType: r.type === 'video' ? 'Video' : 'Website' })),
    ...pdfs.map((p) => ({ ...p, itemType: 'PDF' })),
  ];

  const recentItems = items
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const formatActivityTime = (dateString) => {
    try {
      const now = new Date();
      const date = new Date(dateString);
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHrs < 24) return `${diffHrs}h ago`;
      
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Recently';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-sm flex flex-col space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-900/80">
        <h3 className="font-display font-bold text-sm text-slate-200">Recent Activity</h3>
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Latest 5 Items</span>
      </div>

      {recentItems.length === 0 ? (
        <p className="text-xs text-slate-500 py-4 text-center">No recent activity. Your saved items will show here.</p>
      ) : (
        <div className="space-y-3.5">
          {recentItems.map((item) => (
            <div key={item._id} className="flex items-start justify-between gap-3 text-xs">
              <div className="flex gap-2.5 overflow-hidden">
                {/* Visual marker using item color */}
                <div 
                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" 
                  style={{ backgroundColor: item.color || '#4f46e5' }}
                ></div>
                <div className="overflow-hidden">
                  <p className="text-slate-300 font-medium truncate">{item.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                    Saved <span className="text-indigo-400 font-semibold">{item.itemType}</span> in <span className="text-slate-400/80">{item.category || 'General'}</span>
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-medium shrink-0 whitespace-nowrap">
                {formatActivityTime(item.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
