import React, { useState } from 'react';
import { 
  PERSONALIZATION_API_SUMMARY, 
  API_ASSUMPTIONS_AND_QUESTIONS, 
  PERSONALIZATION_ENDPOINTS, 
  PERSONALIZATION_ERROR_CODES, 
  SECURITY_RISK_ANALYSIS, 
  HUMAN_REVIEW_CHECKLIST 
} from '../data/personalizationApiSpecData';
import { ApiEndpointSpec, ApiErrorCode } from '../types';
import { 
  Server, 
  ShieldCheck, 
  Code2, 
  Copy, 
  Check, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Key, 
  Lock, 
  Layers, 
  FileCode, 
  HelpCircle,
  Users,
  Search,
  BookOpen
} from 'lucide-react';

export const ApiSpecContractView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'endpoints' | 'roles' | 'assumptions' | 'errors' | 'security'>('endpoints');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('ep_diagnose');
  const [selectedRolePreview, setSelectedRolePreview] = useState<'ROLE_LEARNER' | 'ROLE_TEACHER' | 'ROLE_ADMIN'>('ROLE_LEARNER');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const selectedEndpoint: ApiEndpointSpec = PERSONALIZATION_ENDPOINTS.find(e => e.id === selectedEndpointId) || PERSONALIZATION_ENDPOINTS[0];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Service Identity & Security Sign-Off */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1">
                <Server className="w-3 h-3 text-indigo-400" />
                <span>{PERSONALIZATION_API_SUMMARY.serviceName}</span>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded-full">
                v{PERSONALIZATION_API_SUMMARY.version}
              </span>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Security Reviewer Approved</span>
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mt-2">
              {PERSONALIZATION_API_SUMMARY.title}
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-1">
              {PERSONALIZATION_API_SUMMARY.overview}
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Auth Protocol</span>
              <span className="text-xs font-bold text-cyan-300">OAuth2 / OIDC JWT</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Budget Safeguard</span>
              <span className="text-xs font-bold text-emerald-400">$25/day Cap (FR-10)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Grounding Enforcement</span>
              <span className="text-xs font-bold text-purple-300">Mandatory Citation</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('endpoints')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'endpoints'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            API Endpoints Contract (5)
          </button>

          <button
            onClick={() => setActiveSubTab('roles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'roles'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Role-Based PII Scoping
          </button>

          <button
            onClick={() => setActiveSubTab('assumptions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'assumptions'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Assumptions & Open Questions
          </button>

          <button
            onClick={() => setActiveSubTab('errors')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'errors'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Error Code Table (7)
          </button>

          <button
            onClick={() => setActiveSubTab('security')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'security'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Security Review & Checklist
          </button>
        </div>
      </div>

      {/* Main Tab Content Display */}
      {activeSubTab === 'endpoints' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Endpoint Picker Table */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Personalization API Endpoint Registry
            </h3>

            <div className="space-y-2">
              {PERSONALIZATION_ENDPOINTS.map((ep) => {
                const isSelected = ep.id === selectedEndpointId;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpointId(ep.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 font-mono text-[10px] font-bold rounded ${
                          ep.method === 'POST' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {ep.method}
                        </span>
                        <span className="font-mono text-xs font-bold text-white">{ep.path}</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {ep.purpose}
                    </p>

                    <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                      <span className="text-cyan-400">{ep.costTier}</span>
                      <span>•</span>
                      <span>{ep.authLevelRequired}</span>
                      {ep.idempotencySupported && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400">Idempotent</span>
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Endpoint Inspector */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Endpoint Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-mono text-xs font-bold rounded">
                      {selectedEndpoint.method}
                    </span>
                    <h3 className="text-base font-mono font-bold text-white">{selectedEndpoint.path}</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {selectedEndpoint.purpose}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(selectedEndpoint.requestSchemaJson, 'req_schema')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-all"
                >
                  {copiedKey === 'req_schema' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'req_schema' ? 'Copied' : 'Copy Schema'}</span>
                </button>
              </div>

              {/* Endpoint Metadata Attributes Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Auth Level Required</span>
                  <span className="font-bold text-indigo-300">{selectedEndpoint.authLevelRequired}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Cost Tier</span>
                  <span className="font-bold text-emerald-400">{selectedEndpoint.costTier}</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Idempotency</span>
                  <span className={`font-bold ${selectedEndpoint.idempotencySupported ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {selectedEndpoint.idempotencySupported ? 'Supported (Key Header)' : 'N/A'}
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Rate Limit SLA</span>
                  <span className="font-bold text-cyan-300">{selectedEndpoint.rateLimitHeader.split(':')[1]?.trim() || 'Standard'}</span>
                </div>
              </div>

              {/* PRD FR Mappings & Mandatory Constraints */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">PRD Functional Requirements Traceability:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedEndpoint.frMappings.map(fr => (
                      <span key={fr} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-[10px] rounded">
                        {fr}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 text-xs pt-2 border-t border-slate-800/80">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className={`w-4 h-4 ${selectedEndpoint.sourceCitationRequired ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={selectedEndpoint.sourceCitationRequired ? 'text-slate-200' : 'text-slate-500'}>
                      Mandatory Grounded source_citation
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className={`w-4 h-4 ${selectedEndpoint.reasonRequired ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={selectedEndpoint.reasonRequired ? 'text-slate-200' : 'text-slate-500'}>
                      Mandatory Adaptive Decision reason
                    </span>
                  </div>
                </div>
              </div>

              {/* JSON Request Schema */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase font-mono text-indigo-400 block">
                  Request Payload Schema (JSON)
                </span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto leading-relaxed shadow-inner">
                  <pre>{selectedEndpoint.requestSchemaJson}</pre>
                </div>
              </div>

              {/* JSON Response Schema */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase font-mono text-emerald-400 block">
                  Response Payload Schema (200 OK Output)
                </span>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-inner">
                  <pre>{selectedEndpoint.responseSchemaJson}</pre>
                </div>
              </div>

              {/* Documented Edge Cases */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Documented Endpoint Edge Cases & Error Responses</span>
                </h4>

                <div className="space-y-3">
                  {selectedEndpoint.edgeCases.map((ec, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{ec.caseName}</span>
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold rounded">
                          HTTP {ec.expectedStatusCode}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{ec.description}</p>
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-rose-300">
                        <pre>{ec.errorResponseJson}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Role-Based PII Scoping Simulator */}
      {activeSubTab === 'roles' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Role-Based Data Exposure & PII Scoping Controls</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Demonstrates Security Reviewer compliance: Endpoints filter student identity fields depending on whether the caller carries Learner, Teacher, or District Admin JWT roles.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedRolePreview('ROLE_LEARNER')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedRolePreview === 'ROLE_LEARNER' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. ROLE_LEARNER (Self-View)
            </button>
            <button
              onClick={() => setSelectedRolePreview('ROLE_TEACHER')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedRolePreview === 'ROLE_TEACHER' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. ROLE_TEACHER (Class Roster View)
            </button>
            <button
              onClick={() => setSelectedRolePreview('ROLE_ADMIN')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedRolePreview === 'ROLE_ADMIN' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. ROLE_ADMIN / LLM PROXY (Zero-PII Anonymized)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono block">
                Caller Security Scope Metadata
              </span>
              <div className="space-y-2 text-xs text-slate-300 font-mono">
                <div className="flex justify-between p-2 bg-slate-900 rounded">
                  <span className="text-slate-500">Authenticated Role:</span>
                  <span className="text-indigo-400 font-bold">{selectedRolePreview}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900 rounded">
                  <span className="text-slate-500">Allowed Tenant Scope:</span>
                  <span className="text-cyan-300">
                    {selectedRolePreview === 'ROLE_LEARNER' ? 'learner_id == self' : selectedRolePreview === 'ROLE_TEACHER' ? 'school_id == sch_oakridge_402' : 'district_id == dist_70'}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-slate-900 rounded">
                  <span className="text-slate-500">PII Exposure Permitted:</span>
                  <span className={selectedRolePreview === 'ROLE_ADMIN' ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                    {selectedRolePreview === 'ROLE_LEARNER' ? 'Self Profile Only' : selectedRolePreview === 'ROLE_TEACHER' ? 'Student Display Name Allowed' : 'STRICT ZERO PII (Hashes Only)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase font-mono block">
                Filtered Endpoint Output JSON
              </span>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                <pre>{
                  selectedRolePreview === 'ROLE_LEARNER'
                    ? `{\n  "learner_id": "lrn_784910",\n  "display_name": "Alex C.",\n  "pii_scoping": "LEARNER_SELF",\n  "mastery_vector": { "MATH_7_RATIOS_101": 0.35 }\n}`
                    : selectedRolePreview === 'ROLE_TEACHER'
                    ? `{\n  "learner_id": "lrn_784910",\n  "display_name": "Alex Chen",\n  "school_name": "Oakridge Middle School",\n  "pii_scoping": "TEACHER_ROSTER_SCOPED",\n  "status": "NEEDS_INTERVENTION"\n}`
                    : `{\n  "anonymized_learner_hash": "ANON_LRN_701",\n  "school_hash": "SCH_HASH_904",\n  "pii_scoping": "ZERO_PII_ADMIN_AGGREGATE",\n  "mastery_vector": { "MATH_7_RATIOS_101": 0.35 }\n}`
                }</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Assumptions & Open Questions */}
      {activeSubTab === 'assumptions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Architectural Assumptions & Open API Questions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Operational constraints, transport protocol choices, and technical trade-offs evaluated during API design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {API_ASSUMPTIONS_AND_QUESTIONS.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 block">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white">{item.assumption}</h4>
                <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                  <strong className="text-emerald-400">Engineering Rationale: </strong>
                  {item.justification}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Error Code Table */}
      {activeSubTab === 'errors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>System Error Code Registry & Client Retry Guidance</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Standardized error response formats ensuring graceful client fallbacks without disrupting classroom instruction.
            </p>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Error Code</th>
                  <th className="p-3">HTTP Status</th>
                  <th className="p-3">System Meaning</th>
                  <th className="p-3">Client-Facing UI Message</th>
                  <th className="p-3">Retry / Recovery Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {PERSONALIZATION_ERROR_CODES.map((err) => (
                  <tr key={err.code} className="hover:bg-slate-900/50 transition-colors">
                    <td className="p-3 font-mono font-bold text-indigo-400">{err.code}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold rounded border border-rose-500/30">
                        HTTP {err.httpStatus}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 max-w-xs">{err.meaning}</td>
                    <td className="p-3 text-amber-300 max-w-xs font-medium">{err.clientFacingMessage}</td>
                    <td className="p-3 text-slate-400 max-w-xs">{err.retryGuidance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Security Reviewer Analysis & Human Review Checklist */}
      {activeSubTab === 'security' && (
        <div className="space-y-6">
          
          {/* Security Risk Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>Security Reviewer API Risk Analysis</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Data exposure risk assessment for Personalization Engine endpoints conducted by Security Reviewer.
              </p>
            </div>

            <div className="space-y-4">
              {SECURITY_RISK_ANALYSIS.map((risk) => (
                <div key={risk.id} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white">{risk.riskDescription}</h4>
                    <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold rounded border border-rose-500/30">
                      Impact: {risk.impactLevel}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <strong className="text-emerald-400 block mb-1">Architectural Mitigation Control:</strong>
                    {risk.mitigationStrategy}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist for Human Review */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Checklist for Human Review & Sign-Off</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Mandatory quality bar items verified before production release.
                </p>
              </div>

              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold rounded-lg">
                5 / 5 Verified ✓
              </span>
            </div>

            <div className="space-y-3">
              {HUMAN_REVIEW_CHECKLIST.map((item) => (
                <div key={item.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start space-x-3 text-xs">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-white block">{item.checkItem}</span>
                    <p className="text-slate-400">{item.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
