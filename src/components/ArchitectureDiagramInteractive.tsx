import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  WifiOff, 
  Zap, 
  LayoutDashboard, 
  Server, 
  Search, 
  AlertTriangle,
  ArrowRight,
  Layers,
  Lock,
  Clock
} from 'lucide-react';

interface ComponentInfo {
  id: string;
  name: string;
  category: string;
  frMapping: string;
  sla: string;
  responsibilities: string[];
  failureModes: string;
  securityControls: string;
  icon: React.ReactNode;
}

const COMPONENTS_DATA: Record<string, ComponentInfo> = {
  'node_client': {
    id: 'node_client',
    name: 'Learner Edge Client & PWA',
    category: 'Edge & Client Runtime',
    frMapping: 'FR-7, FR-12',
    sla: '<16ms Render Frame Rate',
    responsibilities: [
      'Render practice items and interactive visual models.',
      'Capture learner actions (choice selections, hint clicks, time-on-task).',
      'Maintain Service Worker offline queue in IndexedDB during network drops.',
      'Apply client-side accessibility transforms (font scaling, text-to-speech).'
    ],
    failureModes: 'Network drop triggers offline queue mode without interrupting practice flow.',
    securityControls: 'AES-256 client-side cache storage with signed payload digests.',
    icon: <WifiOff className="w-5 h-5 text-amber-400" />
  },
  'node_gateway': {
    id: 'node_gateway',
    name: 'API Gateway & PII Sanitizer',
    category: 'Ingress & Security Boundary',
    frMapping: 'FR-8, FR-10, FR-16',
    sla: '<15ms Overhead Latency',
    responsibilities: [
      'Enforce TLS 1.3 encryption and JWT session authentication.',
      'Execute Regex & NER PII scrubber to scrub names, emails, and school IDs.',
      'Apply Token-Bucket rate limiting ($0.005/student/day budget cap enforcement).'
    ],
    failureModes: 'Over-budget school requests throttled to Tier 1 micro-rules and cached responses.',
    securityControls: 'Zero-PII guarantee before third-party LLM invocation; strict OAuth2 scope checking.',
    icon: <ShieldCheck className="w-5 h-5 text-indigo-400" />
  },
  'node_diagnostic': {
    id: 'node_diagnostic',
    name: 'Diagnostic Engine (BKT)',
    category: 'Core Diagnostic Intelligence',
    frMapping: 'FR-1, FR-2, FR-5',
    sla: '<30ms Computation Latency',
    responsibilities: [
      'Execute Bayesian Knowledge Tracing (BKT) equations to update mastery probability p(L_k).',
      'Match student response against curriculum misconception rubrics.',
      'Determine recommended next node and target difficulty index.'
    ],
    failureModes: 'Atomic Redis state locks prevent state corruption during concurrent updates.',
    securityControls: 'Pseudonymized learner state lookups using cryptographic hash IDs.',
    icon: <Zap className="w-5 h-5 text-cyan-400" />
  },
  'node_router': {
    id: 'node_router',
    name: 'Personalization Engine & Model Router',
    category: 'AI Orchestration & Cost Control',
    frMapping: 'FR-3, FR-4, FR-13, FR-14',
    sla: '<1,200ms Generation SLA',
    responsibilities: [
      'Query Redis Response Cache (85%+ hit rate target).',
      'Perform cost-aware model routing (Tier 1 Micro-Rules vs Tier 2 Gemini 3.6 Flash).',
      'Construct grounded prompts containing curriculum learning objectives.',
      'Enforce strict 1,200ms circuit breaker timeout.'
    ],
    failureModes: 'LLM timeout triggers immediate fallback to pre-rendered static scaffold template.',
    securityControls: 'Prompt injection filtering and system instruction safety guards.',
    icon: <Cpu className="w-5 h-5 text-emerald-400" />
  },
  'node_llm': {
    id: 'node_llm',
    name: 'Gemini 3.6 Flash AI Engine',
    category: 'External LLM Service',
    frMapping: 'FR-4, FR-20',
    sla: '<500ms TTFT (Time To First Token)',
    responsibilities: [
      'Generate personalized, 2-sentence scaffolded explanations.',
      'Adapt vocabulary and hint chunking to learner accessibility preferences.',
      'Provide contextual guidance without revealing final answer.'
    ],
    failureModes: 'API error rates >5% trigger automated circuit breaker switching to rule templates.',
    securityControls: 'Server-side API proxy execution; process.env.GEMINI_API_KEY hidden from browser.',
    icon: <Server className="w-5 h-5 text-purple-400" />
  },
  'node_stores': {
    id: 'node_stores',
    name: 'Persistence & Curriculum Stores',
    category: 'Data Storage Layer',
    frMapping: 'FR-6, FR-11, FR-15, FR-17',
    sla: '<10ms Query Latency',
    responsibilities: [
      'Learner Profile Store: Persistent BKT mastery vectors & misconception history.',
      'Curriculum Store: Relational taxonomy & prerequisite graph traversals.',
      'Immutable Audit Log: Cryptographic SHA-256 hash-chained session ledger.'
    ],
    failureModes: 'Missing curriculum nodes trigger graph fallback to prerequisite parent node.',
    securityControls: 'AES-256 encryption at rest, append-only log ledger, FERPA/COPPA retention rules.',
    icon: <Database className="w-5 h-5 text-amber-400" />
  },
  'node_dashboard': {
    id: 'node_dashboard',
    name: 'Teacher Dashboard & District Analytics',
    category: 'Monitoring & Alerting',
    frMapping: 'FR-9, FR-18, FR-19',
    sla: '<100ms Event Broadcast',
    responsibilities: [
      'Real-time WebSocket event streaming across 40 schools and 5,000 learners.',
      'Trigger automated teacher alerts when students hit >3 consecutive misconceptions.',
      'Render live LLM budget consumption meters and school-wide mastery heatmaps.'
    ],
    failureModes: 'WebSocket reconnect with automatic message replay buffers.',
    securityControls: 'K-anonymity aggregation (n >= 10) for district-level reporting.',
    icon: <LayoutDashboard className="w-5 h-5 text-rose-400" />
  }
};

export const ArchitectureDiagramInteractive: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node_router');
  const selectedNode = COMPONENTS_DATA[selectedNodeId] || COMPONENTS_DATA['node_router'];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-800 mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Interactive Technical Architecture Diagram</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Click any component node in the pipeline below to inspect its SLAs, PRD mappings, failure modes, and security controls.
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Scale: 5,000 Concurrent Learners / 40 Schools</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Diagram Canvas Column */}
        <div className="lg:col-span-7 bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Core Request Lifecycle Flow</span>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Click Node to Inspect</span>
          </div>

          {/* Row 1: Edge Client */}
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedNodeId('node_client')}
              className={`w-full max-w-md p-3.5 rounded-xl border text-left transition-all ${
                selectedNodeId === 'node_client'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-2 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <WifiOff className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Learner Edge Client & PWA</h4>
                    <p className="text-[11px] text-slate-400">IndexedDB Queue • Offline Mode • Accessibility</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-amber-300">FR-7, FR-12</span>
              </div>
            </button>
          </div>

          <div className="flex justify-center my-1">
            <ArrowRight className="w-4 h-4 text-indigo-500 rotate-90" />
          </div>

          {/* Row 2: Gateway */}
          <div className="flex justify-center">
            <button
              onClick={() => setSelectedNodeId('node_gateway')}
              className={`w-full max-w-md p-3.5 rounded-xl border text-left transition-all ${
                selectedNodeId === 'node_gateway'
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 ring-2 ring-indigo-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">API Gateway & PII Sanitizer</h4>
                    <p className="text-[11px] text-slate-400">Zero PII Scrubbing • Rate Limiter • TLS 1.3</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-indigo-300">FR-8, FR-10</span>
              </div>
            </button>
          </div>

          <div className="flex justify-center my-1">
            <ArrowRight className="w-4 h-4 text-indigo-500 rotate-90" />
          </div>

          {/* Row 3: Diagnostic + Personalization Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedNodeId('node_diagnostic')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedNodeId === 'node_diagnostic'
                  ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 ring-2 ring-cyan-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5 mb-1">
                <Zap className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold text-white">Diagnostic Engine</h4>
              </div>
              <p className="text-[10px] text-slate-400">Bayesian Knowledge Tracing (BKT) • Misconception Tagging</p>
              <span className="inline-block mt-2 text-[9px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">FR-1, FR-2</span>
            </button>

            <button
              onClick={() => setSelectedNodeId('node_router')}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                selectedNodeId === 'node_router'
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5 mb-1">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold text-white">Personalization Router</h4>
              </div>
              <p className="text-[10px] text-slate-400">Cost-Aware Routing • Redis Explanation Cache</p>
              <span className="inline-block mt-2 text-[9px] font-mono bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300">FR-3, FR-13</span>
            </button>
          </div>

          <div className="flex justify-center my-1">
            <ArrowRight className="w-4 h-4 text-indigo-500 rotate-90" />
          </div>

          {/* Row 4: External LLM + Data Stores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedNodeId('node_llm')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedNodeId === 'node_llm'
                  ? 'bg-purple-500/20 border-purple-500 text-purple-200 ring-2 ring-purple-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Server className="w-4 h-4 text-purple-400 mb-1" />
              <h4 className="text-xs font-bold text-white">Gemini 3.6 Flash</h4>
              <p className="text-[10px] text-slate-400">Scaffold Generation</p>
              <span className="inline-block mt-1 text-[9px] font-mono bg-slate-800 px-1 py-0.5 rounded text-purple-300">FR-4, FR-20</span>
            </button>

            <button
              onClick={() => setSelectedNodeId('node_stores')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedNodeId === 'node_stores'
                  ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-2 ring-amber-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <Database className="w-4 h-4 text-amber-400 mb-1" />
              <h4 className="text-xs font-bold text-white">Profile Stores</h4>
              <p className="text-[10px] text-slate-400">PostgreSQL / Redis</p>
              <span className="inline-block mt-1 text-[9px] font-mono bg-slate-800 px-1 py-0.5 rounded text-amber-300">FR-6, FR-11</span>
            </button>

            <button
              onClick={() => setSelectedNodeId('node_dashboard')}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedNodeId === 'node_dashboard'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-200 ring-2 ring-rose-500/30'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-rose-400 mb-1" />
              <h4 className="text-xs font-bold text-white">Teacher Dashboard</h4>
              <p className="text-[10px] text-slate-400">WebSocket Alerts</p>
              <span className="inline-block mt-1 text-[9px] font-mono bg-slate-800 px-1 py-0.5 rounded text-rose-300">FR-9, FR-18</span>
            </button>
          </div>
        </div>

        {/* Selected Component Inspection Inspector */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                  {selectedNode.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedNode.name}</h3>
                  <span className="text-xs text-indigo-400 font-medium">{selectedNode.category}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">SLA Target</span>
                <span className="text-xs font-bold text-emerald-400">{selectedNode.sla}</span>
              </div>
            </div>

            {/* Mapped PRD Requirements */}
            <div className="mb-4">
              <span className="text-xs font-semibold text-slate-400 block mb-1.5">Mapped PRD Requirements</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.frMapping.split(',').map((fr) => (
                  <span key={fr} className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 rounded font-mono text-xs font-semibold">
                    {fr.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* Component Responsibilities */}
            <div className="mb-4">
              <span className="text-xs font-semibold text-slate-400 block mb-1.5">Core Responsibilities</span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedNode.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-cyan-400 mt-0.5">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Failure Mode Handling */}
            <div className="mb-4 bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-300 font-semibold text-xs mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Failure Mode & Contingency</span>
              </div>
              <p className="text-xs text-amber-200/90">{selectedNode.failureModes}</p>
            </div>

            {/* Security & Safeguards */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2 text-emerald-300 font-semibold text-xs mb-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Security & Privacy Controls</span>
              </div>
              <p className="text-xs text-emerald-200/90">{selectedNode.securityControls}</p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between items-center">
            <span>Component ID: {selectedNode.id}</span>
            <span className="text-indigo-400 font-medium">Traceability Verified ✓</span>
          </div>
        </div>

      </div>
    </div>
  );
};
