"use client";

import { useState } from "react";
import { X, Clock, Calendar, Save } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  targetId?: string;
  targetType?: string;
  defaultTitle?: string;
  onSuccess?: () => void;
};

export default function ReminderModal({ isOpen, onClose, targetId, targetType, defaultTitle, onSuccess }: Props) {
  const [title, setTitle] = useState(defaultTitle || "");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
      setError("Please fill all fields");
      return;
    }

    // Combine date and time assuming local timezone for now 
    // In production, robust timezone adaptation based on notification preferences should occur here
    const scheduledFor = new Date(`${date}T${time}`).toISOString();

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          targetId,
          targetType,
          scheduledFor
        })
      });

      if (!res.ok) throw new Error("Failed to create reminder");
      
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError("Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--card)] w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--foreground)]">Set Reminder</h2>
          <button onClick={onClose} className="p-1 hover:bg-[var(--surface-secondary)] rounded-full text-[var(--muted)]">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
           
           <div>
             <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Reminder Title</label>
             <input 
               type="text" 
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="e.g. Follow up on this goal"
               className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
             />
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-[var(--foreground)] mb-1 flex items-center gap-1">
                 <Calendar className="w-3 h-3" /> Date
               </label>
               <input 
                 type="date" 
                 value={date}
                 onChange={(e) => setDate(e.target.value)}
                 className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-[var(--foreground)] mb-1 flex items-center gap-1">
                 <Clock className="w-3 h-3" /> Time (Local)
               </label>
               <input 
                 type="time" 
                 value={time}
                 onChange={(e) => setTime(e.target.value)}
                 className="w-full bg-[var(--card)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
               />
             </div>
           </div>
           
           <button 
             type="submit" 
             disabled={loading}
             className="w-full inline-flex items-center justify-center gap-2 mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-sm text-sm disabled:opacity-50"
           >
             {loading ? "Saving..." : <><Save className="w-4 h-4" /> Schedule Reminder</>}
           </button>
        </form>
      </div>
    </div>
  );
}
