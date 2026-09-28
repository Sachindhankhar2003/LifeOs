"use client";

import { useEffect, useState } from "react";
import { Users, Search, ShieldAlert, Check, X, Shield, ChevronLeft, ChevronRight, Activity } from "lucide-react";
import { Role } from "@/lib/rbac";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users?page=${page}&q=${encodeURIComponent(search)}`);
      if (!res.ok) {
        throw new Error("Failed to authenticate or load users");
      }
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, page]);

  const handleRoleUpdate = async (userId: string, newRole: Role) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.message || "Failed to update role. You may lack ADMIN permissions.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Review accounts, monitor adoption, and manage roles.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="text-sm font-medium text-slate-500 pr-2">
            {total} Total Accounts
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto relative">
          {error ? (
             <div className="p-12 text-center text-red-600">
               <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-50" />
               <p className="font-semibold">{error}</p>
             </div>
          ) : loading && users.length === 0 ? (
             <div className="flex h-64 items-center justify-center">
               <Activity className="w-8 h-8 text-slate-300 animate-spin" />
             </div>
          ) : users.length === 0 ? (
             <div className="p-24 text-center">
               <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
               <h3 className="text-slate-900 font-semibold mb-1">No users found</h3>
               <p className="text-sm text-slate-500">Modify your search criteria and try again.</p>
             </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4 text-center">Tracked Goals</th>
                  <th className="px-6 py-4 text-center">Simulations</th>
                  <th className="px-6 py-4 text-right">System Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{u.name || "Anonymous"}</div>
                      <div className="text-sm text-slate-500">{u.email}</div>
                      <div className="text-[10px] text-slate-300 font-mono mt-1">{u.id}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-slate-700">
                      {u._count.goals}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-medium text-slate-700">
                      {u._count.decisions}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {updatingId === u.id ? (
                        <div className="flex items-center justify-end gap-2 text-sm text-blue-600">
                          <Activity className="w-4 h-4 animate-spin" /> Updating...
                        </div>
                      ) : (
                         <select 
                           value={u.role}
                           onChange={(e) => handleRoleUpdate(u.id, e.target.value as Role)}
                           className={`text-sm font-medium px-3 py-1.5 rounded-lg border focus:outline-none ${u.role === 'ADMIN' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : u.role === 'SUPPORT' ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                         >
                           <option value="USER">USER</option>
                           <option value="SUPPORT">SUPPORT</option>
                           <option value="ADMIN">ADMIN</option>
                         </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <div className="text-slate-500 flex items-center gap-4">
            <span className="font-semibold text-slate-900">Page {page} of {Math.max(1, totalPages)}</span>
          </div>
          <div className="flex gap-2">
            <button 
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700" />
            </button>
            <button 
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
