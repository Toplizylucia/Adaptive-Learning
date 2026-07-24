import React, { useState } from 'react';
import { ARCHITECTURE_SECTIONS } from '../data/architectureSpecData';
import { ArchitectureDiagramInteractive } from './ArchitectureDiagramInteractive';
import { 
  BookOpen, 
  Search, 
  CheckCircle2, 
  FileText, 
  Download, 
  Printer, 
  ChevronRight,
  ShieldAlert,
  ListChecks,
  Sparkles,
  Zap
} from 'lucide-react';

export const ArchitectureDocView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>('sec_summary');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSection, setCopiedSection] = useState<boolean>(false);

  const filteredSections = ARCHITECTURE_SECTIONS.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.frNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.contentMarkdown.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSection = ARCHITECTURE_SECTIONS.find(s => s.id === activeSectionId) || ARCHITECTURE_SECTIONS[0];

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(activeSection.contentMarkdown);
    setCopiedSection(true);
    setTimeout(() => setCopiedSection(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Spec Hero Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold rounded-full">
                PRD v1.0 Alignment
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded-full">
                FR-1 to FR-20 Full Traceability
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={handleCopyMarkdown}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition-all"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>{copiedSection ? 'Copied Markdown!' : 'Copy Section MD'}</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Adaptive Learning Copilot Technical Architecture
          </h1>
          <p className="text-slate-400 text-sm mt-2 max-w-4xl leading-relaxed">
            Personalization Engine, Learner Profile Store, Curriculum Store, Diagnostic Engine, and Teacher Dashboard system design for 5,000 concurrent classroom learners across 40 schools.
          </p>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Target Concurrency</span>
              <span className="text-base font-bold text-white">5,000 Learners</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Daily LLM Budget Cap</span>
              <span className="text-base font-bold text-emerald-400">$0.005 / student / day</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Scoring Latency SLA</span>
              <span className="text-base font-bold text-cyan-400">&lt; 50 ms (BKT)</span>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Privacy Guarantee</span>
              <span className="text-base font-bold text-indigo-400">Zero PII to LLM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Interactive Visual Diagram Component */}
      <ArchitectureDiagramInteractive />

      {/* Document Reader Layout: Section Jump Sidebar + Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Navigation Sidebar Column */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Architecture Sections</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">{filteredSections.length} Sections</span>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter spec by keyword or FR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Section List */}
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredSections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  activeSectionId === sec.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{sec.title}</span>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${activeSectionId === sec.id ? 'rotate-90 text-indigo-400' : ''}`} />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{sec.summary}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-slate-800 text-indigo-300 rounded text-[10px] font-mono border border-slate-700">
                    {sec.frNumber}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Document Content Column */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-slate-200">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <div>
              <span className="text-xs text-indigo-400 font-mono font-bold uppercase tracking-wider block">
                {activeSection.frNumber}
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{activeSection.title}</h2>
            </div>

            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium rounded-lg">
              Verified Design Output
            </span>
          </div>

          {/* Render Markdown Content */}
          <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 mb-6">
              <strong className="text-white block mb-1">Section Summary:</strong>
              {activeSection.summary}
            </div>

            {/* Custom Markdown formatting */}
            <div className="bg-slate-950/80 p-6 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap font-sans text-xs sm:text-sm text-slate-200 leading-relaxed">
              {activeSection.contentMarkdown}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
