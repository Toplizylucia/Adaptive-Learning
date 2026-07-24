import React, { useState } from 'react';
import { 
  COMPLIANCE_SUMMARY, 
  COMPLIANCE_ASSUMPTIONS_OPEN_QUESTIONS, 
  LLM_MINIMIZATION_EVIDENCE, 
  COMPLIANCE_CHECKLIST, 
  COMPLIANCE_FINDINGS, 
  COMPLIANCE_TRACEABILITY_MATRIX, 
  COMPLIANCE_RISKS, 
  COMPLIANCE_HUMAN_CHECKLIST 
} from '../data/complianceReviewData';
import { ComplianceFindingItem } from '../types';
import { 
  ShieldAlert, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Lock, 
  FileCheck2, 
  Terminal, 
  Search, 
  Eye, 
  Key, 
  FileText, 
  Cpu, 
  HelpCircle, 
  Check, 
  X, 
  UserCheck, 
  ArrowRight, 
  Scale, 
  Database, 
  Zap, 
  AlertOctagon, 
  RefreshCw 
} from 'lucide-react';

export const SecurityComplianceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'llm_evidence' | 'gap_findings' | 'traceability' | 'risks' | 'signoff'>('checklist');

  // Filter state for checklist
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Live PII Sanitizer Simulator state
  const [sampleName, setSampleName] = useState<string>('Samantha Miller');
  const [sampleDob, setSampleDob] = useState<string>('2013-04-12');
  const [sampleZip, setSampleZip] = useState<string>('90210');
  const [sampleQuery, setSampleQuery] = useState<string>('I think you multiply three-fourths by 3 batches');
  const [isSanitizing, setIsSanitizing] = useState<boolean>(false);
  const [sanitizedResult, setSanitizedResult] = useState<{
    sanitizedPrompt: string;
    strippedPii: string[];
  } | null>(null);

  const filteredChecklist = COMPLIANCE_CHECKLIST.filter(item => {
    const matchesSearch = item.requirementId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requirementTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.regulatoryClause.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.currentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleRunSanitizerDemo = () => {
    setIsSanitizing(true);
    setTimeout(() => {
      setSanitizedResult({
        sanitizedPrompt: `[System]: You are a Grade 7 Math Tutor. Suppress direct answers.\n[Context]: Grade 7 | Unit Rate Practice | Lexile 500L\n[Learner Verbal Input]: "${sampleQuery}"`,
        strippedPii: [
          `studentName: "${sampleName}" → STRIPPED`,
          `dateOfBirth: "${sampleDob}" → STRIPPED`,
          `districtZip: "${sampleZip}" → STRIPPED`,
          `schoolId: "SCH-LINCOLN-7" → STRIPPED`
        ]
      });
      setIsSanitizing(false);
    }, 500);
  };

  const blockingCount = COMPLIANCE_FINDINGS.filter(f => f.severity === 'BLOCKING').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Veto Authority & Regulatory Reviewer Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold rounded-full flex items-center space-x-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>Regulatory Veto Authority Enforced</span>
              </span>
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold rounded-full flex items-center space-x-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                <span>{blockingCount} Blocking Compliance Gaps</span>
              </span>
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold rounded-full flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>FERPA / COPPA / GDPR Regimes</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block">Auditor Role:</span>
              <span className="text-xs font-bold text-white font-mono">{COMPLIANCE_SUMMARY.auditorRole}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>Security &amp; Privacy Compliance Audit</span>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 text-xs font-mono rounded-lg border border-amber-500/30">
                PRE-PILOT REVIEW
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-4xl leading-relaxed">
              {COMPLIANCE_SUMMARY.executiveSummary}
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Compliance Checklist (6)</span>
            </button>

            <button
              onClick={() => setActiveTab('llm_evidence')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'llm_evidence'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>LLM Data Minimization Evidence</span>
            </button>

            <button
              onClick={() => setActiveTab('gap_findings')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'gap_findings'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Gap Findings ({COMPLIANCE_FINDINGS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('traceability')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'traceability'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Traceability Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('risks')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'risks'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Risks &amp; Mitigations</span>
            </button>

            <button
              onClick={() => setActiveTab('signoff')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'signoff'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Human Sign-Off Matrix</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: COMPLIANCE CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search requirement, clause, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Filter Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="MET">MET</option>
                <option value="PARTIAL">PARTIAL</option>
                <option value="GAP">GAP</option>
              </select>
            </div>
          </div>

          {/* Checklist Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-amber-400" />
              <span>Regulatory Compliance Audit Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                    <th className="p-3">Req ID</th>
                    <th className="p-3">Requirement Title</th>
                    <th className="p-3">Regulatory Clause</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Blocking?</th>
                    <th className="p-3">Evidence Reviewed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredChecklist.map((row) => (
                    <tr key={row.requirementId} className="hover:bg-slate-950/50">
                      <td className="p-3 font-mono font-bold text-amber-300">{row.requirementId}</td>
                      <td className="p-3 font-bold text-white">{row.requirementTitle}</td>
                      <td className="p-3 font-mono text-cyan-300">{row.regulatoryClause}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          row.currentStatus === 'MET' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          row.currentStatus === 'PARTIAL' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {row.currentStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        {row.isBlocking ? (
                          <span className="px-2 py-0.5 bg-rose-600 text-white font-mono font-bold text-[10px] rounded">
                            YES (BLOCKER)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-mono text-[10px] rounded">
                            NO
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-slate-400 max-w-xs truncate" title={row.evidenceReviewed}>
                        {row.evidenceReviewed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: LLM DATA MINIMIZATION EVIDENCE */}
      {activeTab === 'llm_evidence' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <span>LLM Payload PII Minimization &amp; Evidence Review</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verifies that LLM API requests sent to Google GenAI strictly omit student PII (Name, DOB, ZIP, School ID) under FERPA § 99.31 and GDPR Art. 5(1)(c).
              </p>
            </div>

            {/* Static Evidence Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left: Raw Learner Context */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-rose-500/30 space-y-3">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase flex items-center space-x-2">
                  <Database className="w-4 h-4" />
                  <span>Raw Application Learner State (Contains PII)</span>
                </span>
                <pre className="p-3 bg-slate-900 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
{JSON.stringify(LLM_MINIMIZATION_EVIDENCE.rawLearnerContext, null, 2)}
                </pre>
                <div className="p-2 bg-rose-950/40 rounded border border-rose-500/30 text-[10px] text-rose-300">
                  ⚠️ Direct transmission of raw state would violate FERPA PII rules!
                </div>
              </div>

              {/* Right: Sanitized Request Dispatched to LLM */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>Sanitized Prompt Dispatched to Gemini API</span>
                </span>
                <pre className="p-3 bg-slate-900 rounded-xl text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-slate-800">
{JSON.stringify(LLM_MINIMIZATION_EVIDENCE.sanitizedLlmRequestPayload, null, 2)}
                </pre>
                <div className="p-2 bg-emerald-950/40 rounded border border-emerald-500/30 text-[10px] text-emerald-300 font-mono">
                  ✓ VERIFIED: All PII fields stripped. Evidence: {LLM_MINIMIZATION_EVIDENCE.sanitizedLlmRequestPayload.evidenceRef}
                </div>
              </div>

            </div>

            {/* Live Interactive PII Stripper Simulator */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-xs text-white uppercase font-mono flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>Live Client-Side Sanitizer Testing Console</span>
                </span>

                <button
                  onClick={handleRunSanitizerDemo}
                  disabled={isSanitizing}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSanitizing ? 'animate-spin' : ''}`} />
                  <span>Execute Sanitizer Pipeline</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Student Name (PII):</label>
                  <input 
                    type="text" 
                    value={sampleName} 
                    onChange={e => setSampleName(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">Date of Birth (PII):</label>
                  <input 
                    type="text" 
                    value={sampleDob} 
                    onChange={e => setSampleDob(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-slate-400 block mb-1">District ZIP (PII):</label>
                  <input 
                    type="text" 
                    value={sampleZip} 
                    onChange={e => setSampleZip(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 block mb-1">Student Verbal Input:</label>
                <input 
                  type="text" 
                  value={sampleQuery} 
                  onChange={e => setSampleQuery(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>

              {sanitizedResult && (
                <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <span className="text-[10px] text-emerald-400 font-bold block uppercase">Sanitized Output Payload Result:</span>
                  <div className="text-slate-200 bg-slate-950 p-3 rounded border border-slate-800 whitespace-pre-line">
                    {sanitizedResult.sanitizedPrompt}
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] text-rose-400 font-bold block uppercase">Stripped PII Attributes Log:</span>
                    {sanitizedResult.strippedPii.map((item, idx) => (
                      <span key={idx} className="block text-[10px] text-rose-300 font-mono">{item}</span>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* TAB 3: GAP FINDINGS */}
      {activeTab === 'gap_findings' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Detailed Compliance Gap Findings &amp; Root Cause Analysis</span>
            </h3>
            <p className="text-xs text-slate-400">
              Every identified compliance gap includes regulatory clause, root cause analysis, affected component, and engineering remediation specification.
            </p>

            <div className="space-y-4 pt-2">
              {COMPLIANCE_FINDINGS.map(finding => (
                <div key={finding.findingId} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold rounded">
                        {finding.findingId}
                      </span>
                      <span className="font-bold text-white text-sm">{finding.title}</span>
                    </div>

                    <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                      finding.severity === 'BLOCKING' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {finding.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold block">Affected Component:</span>
                      <p className="text-slate-300">{finding.affectedComponent}</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono text-amber-300 uppercase font-bold block">Regulatory Clause:</span>
                      <p className="text-slate-300">{finding.regulatoryClause}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block">Root Cause Analysis:</span>
                    <p className="text-slate-300 leading-relaxed">{finding.rootCause}</p>
                  </div>

                  <div className="bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-500/30 text-xs space-y-1">
                    <span className="text-[10px] font-mono text-emerald-300 uppercase font-bold block">Recommended Engineering Fix:</span>
                    <p className="text-white leading-relaxed">{finding.recommendedFix}</p>
                  </div>

                  <div className="text-[10px] font-mono text-slate-500 text-right">
                    Assigned Owner Role: {finding.assignedOwnerRole}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TRACEABILITY MATRIX */}
      {activeTab === 'traceability' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Traceability Table (Finding → PRD Safeguard / NFR → Regulatory Clause)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Maps compliance findings directly back to PRD Section 8 NFRs, Section 9 Safeguards, and statutory clauses.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <th className="p-3">Finding ID</th>
                  <th className="p-3">Compliance Finding Title</th>
                  <th className="p-3">PRD Safeguard / NFR</th>
                  <th className="p-3">Regulatory Framework</th>
                  <th className="p-3">Verification Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {COMPLIANCE_TRACEABILITY_MATRIX.map((row) => (
                  <tr key={row.findingId} className="hover:bg-slate-950/50">
                    <td className="p-3 font-mono font-bold text-amber-300">{row.findingId}</td>
                    <td className="p-3 font-bold text-white">{row.title}</td>
                    <td className="p-3 font-mono text-indigo-300">{row.prdSafeguardOrNfr}</td>
                    <td className="p-3 font-mono text-cyan-300">{row.regulatoryFramework}</td>
                    <td className="p-3 font-mono text-slate-400">{row.verificationMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: RISKS & MITIGATIONS */}
      {activeTab === 'risks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>Compliance Risks &amp; Mitigation Strategies</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Covers COPPA monetary liability, LLM model retraining leaks, and local storage audit log tampering.
            </p>
          </div>

          <div className="space-y-4">
            {COMPLIANCE_RISKS.map(rsk => (
              <div key={rsk.riskId} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold rounded">
                      {rsk.riskId}
                    </span>
                    <span className="font-bold text-white text-sm">{rsk.riskTitle}</span>
                  </div>

                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold rounded">
                    Impact: {rsk.impactLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rsk.threatDescription}
                </p>

                <div className="bg-indigo-950/60 p-3.5 rounded-xl border border-indigo-500/40 text-xs space-y-1">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold block">Mitigation Strategy:</span>
                  <p className="text-white leading-relaxed">{rsk.mitigationStrategy}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                  <span>Residual Risk: <strong className="text-emerald-400">{rsk.residualRisk}</strong></span>
                  <span>Owner: {rsk.ownerRole}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: HUMAN SIGNOFF CHECKLIST */}
      {activeTab === 'signoff' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>Sign-Off Checklist for Human Review (Required Before Pilot Launch)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mandatory sign-off matrix requiring Legal, Security, FERPA, and Operations approval prior to district key distribution.
              </p>
            </div>

            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold rounded-lg">
              2 / 4 Approved | Pilot Launch Blocked
            </span>
          </div>

          <div className="space-y-4">
            {COMPLIANCE_HUMAN_CHECKLIST.map(item => (
              <div key={item.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold rounded">
                      {item.id}
                    </span>
                    <span className="font-bold text-white text-sm">{item.roleTitle}</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center space-x-1 ${
                    item.signoffStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    item.signoffStatus === 'PENDING_REMEDIATION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {item.signoffStatus === 'APPROVED' && <Check className="w-3 h-3 text-emerald-400" />}
                    {item.signoffStatus === 'PENDING_REMEDIATION' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                    <span>{item.signoffStatus}</span>
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Verification Requirement:</span>
                    <p className="text-slate-300 leading-relaxed">{item.verificationRequirement}</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">Evidence Verified:</span>
                    <p className="text-slate-200 font-mono text-[11px] mt-1">{item.evidenceVerified}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
