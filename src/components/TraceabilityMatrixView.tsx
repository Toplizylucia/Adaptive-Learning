import React, { useState } from 'react';
import { TRACEABILITY_MATRIX_DATA, SYSTEM_RISKS } from '../data/architectureSpecData';
import { CheckSquare, Search, AlertTriangle, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

export const TraceabilityMatrixView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'risks'>('matrix');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredMatrix = TRACEABILITY_MATRIX_DATA.filter(item => 
    item.frId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.ownerComponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-white">PRD Requirements Traceability & Risk Matrix</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Verification mapping of PRD Functional Requirements (FR-1 through FR-20) to owning microservices, security controls, and failure mitigations.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'matrix' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Traceability Table (FR-1..20)
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'risks' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Risks & Mitigations
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search FR ID, component, or risk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {activeTab === 'matrix' ? (
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">FR ID</th>
                  <th className="p-3">Requirement Title</th>
                  <th className="p-3">Owning Component</th>
                  <th className="p-3">Functional Description</th>
                  <th className="p-3">Security & Safeguard Control</th>
                  <th className="p-3">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredMatrix.map((row) => (
                  <tr key={row.frId} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-400">{row.frId}</td>
                    <td className="p-3 font-bold text-white">{row.title}</td>
                    <td className="p-3 font-medium text-cyan-300">{row.ownerComponent}</td>
                    <td className="p-3 text-slate-300 leading-relaxed max-w-xs">{row.description}</td>
                    <td className="p-3 text-slate-400 max-w-xs">{row.safeguard}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        row.testStatus === 'AUTOMATED_PASS'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : row.testStatus === 'VERIFIED'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {row.testStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {SYSTEM_RISKS.map((risk) => (
              <div key={risk.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-4 h-4 ${risk.impactLevel === 'CRITICAL' ? 'text-rose-400' : 'text-amber-400'}`} />
                    <h3 className="text-sm font-bold text-white">{risk.riskDescription}</h3>
                  </div>

                  <div className="flex items-center space-x-2 font-mono text-[10px]">
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded border border-rose-500/30 font-bold">
                      Impact: {risk.impactLevel}
                    </span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 font-bold">
                      {risk.frMapping}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-300">
                  <strong className="text-emerald-400 block mb-1">Architectural Mitigation Strategy:</strong>
                  {risk.mitigationStrategy}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Owner: <strong className="text-slate-300">{risk.componentOwner}</strong></span>
                  <span>Category: <strong className="text-slate-300">{risk.category}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
