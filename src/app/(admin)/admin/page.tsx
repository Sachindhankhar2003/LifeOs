"use client";

import { useEffect, useState } from "react";
import { Users, Compass, Target, Brain, Activity } from "lucide-react";

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        if (!res.ok) {
          throw new Error("Failed to authenticate or load metrics");
        }
        const data = await res.json();
        setMetrics(data);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }
    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Activity className="w-8 h-8 text-slate-300 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl text-sm border border-red-100">
        <h3 className="font-semibold mb-1">Access Denied</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Overview</h1>
        <p className="text-slate-500 mt-1">Platform analytics, active usage, and AI request volumes.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Cards */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500">Total Users</h3>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900">{metrics?.totalUsers || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500">Simulations Run</h3>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900">{metrics?.totalSimulations || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500">Goals Tracked</h3>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900">{metrics?.totalGoals || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-500">AI Est. Requests</h3>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold tracking-tight text-slate-900">{metrics?.aiRequestVolume || 0}</p>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide">Based on DB msg count</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Privacy-Conscious Promise</h2>
        <p className="text-sm text-slate-500 leading-relaxed max-w-3xl">
          Administrators cannot view private conversation histories, user prompts, API keys, or raw scenarios. Metrics represent aggregated event counts and high-level health indicators. Access is strictly partitioned using robust Server-Side RBAC evaluation.
        </p>
      </div>
    </div>
  );
}
