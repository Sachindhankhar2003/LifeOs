import { Compass, Search, Calendar, ChevronRight, FileText } from "lucide-react";

export default function SavedPlansPage() {
  const plans = [
    {
      id: 1,
      title: "Should I move to Austin or stay in SF?",
      type: "Decision",
      status: "Decided",
      date: "Oct 12, 2026",
      summary: "Selected Option B (Austin). Preparing moving budget.",
    },
    {
      id: 2,
      title: "Q3 Career Progression Plan",
      type: "Plan",
      status: "Active",
      date: "Sep 28, 2026",
      summary: "Includes milestones for promotion to Senior PM.",
    },
    {
      id: 3,
      title: "Buy vs Lease new car",
      type: "Decision",
      status: "Pending",
      date: "Sep 15, 2026",
      summary: "Waiting for test drives before making final choice.",
    },
    {
      id: 4,
      title: "Europe Trip Summer 2027",
      type: "Plan",
      status: "Draft",
      date: "Aug 02, 2026",
      summary: "Rough itinerary and budget constraints.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">Saved Plans</h1>
          <p className="text-[var(--muted)] mt-1">Review your past decisions and active life plans.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[var(--muted)]" />
          </div>
          <input
            type="text"
            className="w-full py-2.5 pl-9 pr-4 text-sm bg-[var(--card)] border border-[var(--border)] rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-[var(--muted)] text-[var(--foreground)] shadow-sm"
            placeholder="Search plans and decisions..."
          />
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-slate-100">
          {plans.map((plan) => (
            <button key={plan.id} className="w-full text-left p-4 sm:p-6 hover:bg-[var(--surface-secondary)] transition-colors group flex items-start sm:items-center gap-4 sm:gap-6 flex-col sm:flex-row">
              <div className="flex items-center gap-4 flex-1 w-full">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-[var(--border)] group-hover:bg-[var(--card)] transition-colors">
                  {plan.type === "Decision" ? (
                     <Compass className="w-5 h-5 text-[var(--muted)] group-hover:text-blue-600" />
                  ) : (
                     <FileText className="w-5 h-5 text-[var(--muted)] group-hover:text-blue-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-[var(--foreground)] truncate">{plan.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                      plan.status === 'Decided' ? 'bg-slate-800 text-white' :
                      plan.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      plan.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                      plan.status === 'Draft' ? 'bg-slate-100 text-[var(--muted)] border border-[var(--border)]' : ''
                    }`}>
                      {plan.status}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted)] line-clamp-1">{plan.summary}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pl-14 sm:pl-0">
                 <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <Calendar className="w-3.5 h-3.5" />
                    {plan.date}
                 </div>
                 <div className="text-[var(--border)] group-hover:text-blue-600 transition-colors hidden sm:block">
                    <ChevronRight className="w-5 h-5" />
                 </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
