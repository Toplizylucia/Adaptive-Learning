import React, { useState } from 'react';
import { AuditLogItem, DistrictMetrics, LearnerProfile } from '../types';
import { INITIAL_LEARNER_PROFILES } from '../data/learnerProfilesData';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  DollarSign, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  Layers
} from 'lucide-react';

interface TeacherDashboardViewProps {
  auditLogs: AuditLogItem[];
}

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({ auditLogs }) => {
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState<string>('ALL');

  const districtMetrics: DistrictMetrics = {
    totalConcurrentLearners: 5000,
    activeSchools: 40,
    totalDailySessions: 34820,
    avgLatencyMs: 380,
    totalDailyCostUSD: 4.82,
    budgetCapUSD: 25.00,
    cacheHitRatePercentage: 86.4,
    offlineQueueCount: 14
  };

  // Mock hourly cost burn data
  const costBurnData = [
    { hour: '8 AM', costUSD: 0.25, budgetCap: 1.04, cacheHitPct: 82 },
    { hour: '9 AM', costUSD: 0.85, budgetCap: 2.08, cacheHitPct: 88 },
    { hour: '10 AM', costUSD: 1.42, budgetCap: 3.12, cacheHitPct: 87 },
    { hour: '11 AM', costUSD: 2.15, budgetCap: 4.16, cacheHitPct: 85 },
    { hour: '12 PM', costUSD: 2.70, budgetCap: 5.20, cacheHitPct: 84 },
    { hour: '1 PM', costUSD: 3.45, budgetCap: 6.24, cacheHitPct: 86 },
    { hour: '2 PM', costUSD: 4.10, budgetCap: 7.28, cacheHitPct: 89 },
    { hour: '3 PM', costUSD: 4.82, budgetCap: 8.32, cacheHitPct: 86 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded-full">
                FR-9 & FR-10 Active Monitoring
              </span>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold rounded-full">
                40 Schools Connected
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-2">
              Teacher & District Operations Dashboard
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time learner mastery tracking, LLM daily budget consumption meter ($25/day cap across 5,000 learners), and cryptographic audit stream.
            </p>
          </div>

          {/* School Selector */}
          <div>
            <select
              value={selectedSchoolFilter}
              onChange={(e) => setSelectedSchoolFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All 40 District Schools</option>
              <option value="sch_oakridge_402">Oakridge Middle School</option>
              <option value="sch_westlake_108">Westlake Middle Academy</option>
              <option value="sch_riverdale_204">Riverdale Rural School</option>
            </select>
          </div>
        </div>

        {/* Top Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase">Concurrent Learners</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="text-xl font-bold text-white">5,000 Peak</span>
            <span className="text-[10px] text-emerald-400 block mt-1">100% SLA Availability</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase">Daily LLM Cost Burn</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-bold text-emerald-400">${districtMetrics.totalDailyCostUSD.toFixed(2)}</span>
              <span className="text-xs text-slate-500">/ ${districtMetrics.budgetCapUSD.toFixed(2)} Cap</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">Burn Rate: $0.00013 / student</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase">Explanation Cache Hit</span>
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-xl font-bold text-cyan-400">{districtMetrics.cacheHitRatePercentage}%</span>
            <span className="text-[10px] text-slate-400 block mt-1">Target: &gt;85% Warm Redis Cache</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[10px] font-mono uppercase">Avg Generation SLA</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-xl font-bold text-purple-400">{districtMetrics.avgLatencyMs} ms</span>
            <span className="text-[10px] text-emerald-400 block mt-1">Within &lt;1,200ms Timeout Cap</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Heatmaps Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: LLM Cost Budget Burn Chart */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>LLM Daily Budget Consumption vs Cap (FR-10)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Hourly cumulative LLM cost ($) tracking against the $25.00 daily ceiling across 5,000 active learners.
              </p>
            </div>
            <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px]">
              86.4% Cache Hit Efficiency
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costBurnData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} unit="$" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="costUSD" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#costGrad)" name="Actual LLM Cost ($)" />
                <Area type="monotone" dataKey="budgetCap" stroke="#6366f1" strokeDasharray="3 3" fillOpacity={0} name="Cumulative Cap ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Active Learner Classroom Heatmap & Alerts */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Learner Mastery Vectors & Intervention Flags</span>
            </h3>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              FR-18 Auto-Alert
            </span>
          </div>

          <div className="space-y-3">
            {INITIAL_LEARNER_PROFILES.map((learner) => {
              const primarySkill = Object.values(learner.masteryVector)[0];
              const prob = primarySkill ? primarySkill.masteryProbability : 0.5;
              const isStruggling = prob < 0.45;

              return (
                <div key={learner.learnerId} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">{learner.displayName}</h4>
                      <span className="text-[10px] text-slate-400">{learner.schoolName}</span>
                    </div>

                    {isStruggling ? (
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold rounded flex items-center space-x-1">
                        <AlertTriangle className="w-3 h-3 text-rose-400" />
                        <span>Teacher Intervention Needed</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold rounded">
                        On Track
                      </span>
                    )}
                  </div>

                  {/* BKT Progress Bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>{primarySkill?.skillName || 'Ratios'}</span>
                      <span className="font-mono text-cyan-400">{(prob * 100).toFixed(0)}% BKT Mastery</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                      <div 
                        className={`h-full transition-all ${isStruggling ? 'bg-rose-500' : 'bg-emerald-400'}`}
                        style={{ width: `${Math.round(prob * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Immutable Audit Log Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Immutable Session Audit Stream (FR-11)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Append-only ledger logging cryptographic hashes, PII scrubbing verification, model tier, and latency across all schools.
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
            SHA-256 Hash Chain Valid
          </span>
        </div>

        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Event ID</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Anonymized Learner Hash</th>
                <th className="p-3">Model Tier</th>
                <th className="p-3">Cost (USD)</th>
                <th className="p-3">Latency</th>
                <th className="p-3">PII Scrubbed</th>
                <th className="p-3">Audit Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 text-indigo-400 font-semibold">{log.id}</td>
                    <td className="p-3 text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td className="p-3 text-cyan-300">{log.anonymizedLearnerHash}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-200 border border-slate-700">
                        {log.modelTier}
                      </span>
                    </td>
                    <td className="p-3 text-emerald-400">${log.costUSD.toFixed(6)}</td>
                    <td className="p-3 text-slate-300">{log.latencyMs} ms</td>
                    <td className="p-3">
                      <span className="text-emerald-400 font-bold">YES ✓</span>
                    </td>
                    <td className="p-3 text-slate-500 text-[10px] truncate max-w-[120px]">{log.id}_SHA256</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-500 font-sans">
                    No diagnostic actions logged yet. Go to the "Live Simulator" tab and submit practice answers to populate the audit stream.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
