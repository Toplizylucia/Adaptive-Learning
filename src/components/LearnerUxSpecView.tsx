import React, { useState } from 'react';
import { 
  LEARNER_UX_SUMMARY, 
  LEARNER_UX_ASSUMPTIONS, 
  LEARNER_UX_SCREENS, 
  LEARNER_UX_USER_FLOW, 
  LEARNER_UX_RISKS, 
  LEARNER_UX_HUMAN_CHECKLIST 
} from '../data/learnerUxSpecData';
import { UxScreenSpec } from '../types';
import { 
  Eye, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Users, 
  Volume2, 
  Maximize2, 
  BookOpen, 
  Smartphone, 
  WifiOff, 
  RefreshCw, 
  ArrowRight,
  Sliders,
  Award,
  Flag
} from 'lucide-react';

export const LearnerUxSpecView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'screens' | 'flow' | 'reading' | 'assumptions' | 'checklist'>('screens');
  const [selectedScreenId, setSelectedScreenId] = useState<string>('ux_screen_diagnose');
  const [readingLevel, setReadingLevel] = useState<'foundational' | 'standard' | 'advanced'>('foundational');
  const [simulatedState, setSimulatedState] = useState<'success' | 'loading' | 'emptyColdStart' | 'offlineError'>('success');

  const selectedScreen: UxScreenSpec = LEARNER_UX_SCREENS.find(s => s.id === selectedScreenId) || LEARNER_UX_SCREENS[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: UX Service Identity & Compliance Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1">
                <Users className="w-3 h-3 text-indigo-400" />
                <span>Learner UX Specification</span>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded-full">
                {LEARNER_UX_SUMMARY.gradeBand}
              </span>
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>WCAG 2.1 AA/AAA Compliant</span>
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mt-2">
              {LEARNER_UX_SUMMARY.title}
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-1">
              {LEARNER_UX_SUMMARY.targetAudience}
            </p>
          </div>

          {/* Quick Compliance Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">AI Disclosure</span>
              <span className="text-xs font-bold text-cyan-300">Visible Banner</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Persistent Scaffold</span>
              <span className="text-xs font-bold text-emerald-400">"Explain Simply"</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Dark Patterns</span>
              <span className="text-xs font-bold text-amber-300">Zero Allowed</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('screens')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'screens'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Screen-by-Screen UX Breakdown (5)
          </button>

          <button
            onClick={() => setActiveSubTab('flow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'flow'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Learner Tutoring Loop Flow
          </button>

          <button
            onClick={() => setActiveSubTab('reading')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'reading'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Reading Level & Assistive Adaptations
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
            onClick={() => setActiveSubTab('checklist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'checklist'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Human Review & Compliance Sign-Off
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeSubTab === 'screens' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Screen Picker */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Core Tutoring Loop Screens
            </h3>

            <div className="space-y-2">
              {LEARNER_UX_SCREENS.map((scr) => {
                const isSelected = scr.id === selectedScreenId;
                return (
                  <button
                    key={scr.id}
                    onClick={() => setSelectedScreenId(scr.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold rounded">
                        {scr.stepName}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        WCAG 2.1 AA
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white mb-1">{scr.screenTitle}</h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {scr.purpose}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Screen Spec Inspector + Interactive Render Preview */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Screen Spec Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-mono text-xs font-bold rounded">
                      {selectedScreen.stepName}
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedScreen.screenTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedScreen.purpose}
                  </p>
                </div>

                {/* Interactive State & Reading Level Controls */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <select
                      value={readingLevel}
                      onChange={(e) => setReadingLevel(e.target.value as any)}
                      className="bg-slate-900 text-indigo-300 font-bold px-2 py-1 rounded border border-slate-800 text-xs focus:outline-none"
                    >
                      <option value="foundational">Foundational (Lexile ~500L)</option>
                      <option value="standard">Standard (Lexile ~750L)</option>
                      <option value="advanced">Advanced (Lexile ~950L)</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-1 border-l border-slate-800 pl-2">
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    <select
                      value={simulatedState}
                      onChange={(e) => setSimulatedState(e.target.value as any)}
                      className="bg-slate-900 text-emerald-300 font-bold px-2 py-1 rounded border border-slate-800 text-xs focus:outline-none"
                    >
                      <option value="success">State: 200 Success</option>
                      <option value="loading">State: Loading</option>
                      <option value="emptyColdStart">State: Cold Start</option>
                      <option value="offlineError">State: Offline Fallback</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* LIVE INTERACTIVE PREVIEW CANVAS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span className="flex items-center space-x-1.5 text-indigo-400 font-bold">
                    <Smartphone className="w-4 h-4" />
                    <span>Interactive Accessibility & Render Preview Canvas</span>
                  </span>
                  <span className="text-emerald-400">ARIA Live Region Active</span>
                </div>

                <div className="bg-slate-950 p-6 rounded-xl border border-indigo-500/40 space-y-4 shadow-2xl relative overflow-hidden">
                  
                  {/* Mandatory Visible AI Disclosure Banner */}
                  <div className="bg-indigo-950/80 border border-indigo-500/40 p-3 rounded-lg flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="font-bold text-white">AI Learning Assistant Enabled</span>
                      <span className="text-indigo-300 text-[11px]">• Source: Grade 7 Illustrative Math (Unit 2, Lesson 4)</span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] rounded border border-emerald-500/30">
                      Grounded Citation ✓
                    </span>
                  </div>

                  {/* Render simulated state */}
                  {simulatedState === 'loading' && (
                    <div className="p-8 text-center space-y-3 animate-pulse" role="status" aria-live="polite">
                      <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                      <p className="text-xs text-indigo-300 font-mono font-bold">
                        [Screen Reader: "Preparing personalized math scaffold... Please wait." ]
                      </p>
                    </div>
                  )}

                  {simulatedState === 'emptyColdStart' && (
                    <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                      <span className="text-amber-400 font-bold uppercase font-mono block">Cold-Start Initial Placement</span>
                      <p className="text-slate-200">{selectedScreen.states.emptyColdStart}</p>
                    </div>
                  )}

                  {simulatedState === 'offlineError' && (
                    <div className="p-4 bg-rose-950/60 border border-rose-500/40 rounded-xl space-y-2 text-xs">
                      <div className="flex items-center space-x-2 text-rose-300 font-bold">
                        <WifiOff className="w-4 h-4" />
                        <span>Offline Circuit Breaker Active</span>
                      </div>
                      <p className="text-slate-300">{selectedScreen.states.offlineError}</p>
                    </div>
                  )}

                  {simulatedState === 'success' && (
                    <div className="space-y-4" role="region" aria-label={selectedScreen.screenTitle}>
                      
                      {/* Dynamic Reading Level Adapted Content */}
                      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                          <span>Reading Level Applied: <strong className="text-indigo-400 uppercase">{readingLevel}</strong></span>
                          <span>Lexile Target: {readingLevel === 'foundational' ? '500L' : readingLevel === 'standard' ? '750L' : '950L'}</span>
                        </div>
                        <p className="text-sm font-medium text-white leading-relaxed pt-1">
                          {selectedScreen.readingLevelAdaptations[readingLevel]}
                        </p>
                      </div>

                      {/* Key Screen Elements List */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <span className="text-xs font-bold text-slate-400 uppercase font-mono block">
                          Key UI Components on Screen
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {selectedScreen.keyElements.map((elem, idx) => (
                            <div key={idx} className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300 flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                              <span className="leading-tight">{elem}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Persistent "Explain Differently" Control Dock */}
                      <div className="bg-indigo-950/90 border border-indigo-500/50 p-3 rounded-xl flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4 text-cyan-400" />
                          <span className="text-xs font-bold text-white">Need a different explanation?</span>
                        </div>
                        <button
                          onClick={() => setReadingLevel('foundational')}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg transition-all border border-indigo-400/30"
                        >
                          Explain More Simply
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </div>

              {/* WCAG 2.1 Accessibility Annotations Table */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>WCAG 2.1 AA / AAA Accessibility Annotations</span>
                </h4>

                <div className="space-y-3">
                  {selectedScreen.accessibilityAnnotations.map((anno, idx) => (
                    <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{anno.title}</span>
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold rounded border border-purple-500/30">
                          {anno.wcagCriterion}
                        </span>
                      </div>
                      <p className="text-slate-400 leading-relaxed">{anno.description}</p>
                      <div className="bg-slate-900 p-2 rounded font-mono text-[11px] text-cyan-300">
                        {anno.ariaAttribute}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Learner Tutoring Loop Flow */}
      {activeSubTab === 'flow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              <span>Learner Core Tutoring Loop User Flow (Diagnose → Explain → Practice → Adapt → Reflect)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Complete step-by-step state machine describing triggers, system actions, and offline circuit breaker fallbacks.
            </p>
          </div>

          <div className="space-y-4">
            {LEARNER_UX_USER_FLOW.map((flow) => (
              <div key={flow.stepNumber} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                      {flow.stepNumber}
                    </span>
                    <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold rounded border border-indigo-500/30">
                      {flow.phase}
                    </span>
                    <h4 className="text-sm font-bold text-white">{flow.title}</h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pl-10">
                  {flow.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-10 text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500 uppercase text-[10px] block">Trigger Event:</span>
                    <span className="text-indigo-300 font-medium">{flow.triggerEvent}</span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500 uppercase text-[10px] block">System Action:</span>
                    <span className="text-emerald-300 font-medium">{flow.systemAction}</span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-500 uppercase text-[10px] block">Fallback / Offline Action:</span>
                    <span className="text-amber-300 font-medium">{flow.fallbackAction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Reading Level & Assistive Adaptations */}
      {activeSubTab === 'reading' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <span>Multi-Tier Reading Level & Assistive Adaptations Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Every instructional text string dynamically adapts between Lexile readability tiers while honoring assistive technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded">
                Foundational (Lexile ~500L)
              </span>
              <h4 className="text-sm font-bold text-white">Simplified Structure</h4>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                <td>Max 12 words per sentence.</td>
                <td>Concrete real-world analogies (baking, sports).</td>
                <td>Inline visual diagrams for math concepts.</td>
                <td>Auto-highlighted key math operators.</td>
              </ul>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold rounded">
                Standard (Lexile ~750L)
              </span>
              <h4 className="text-sm font-bold text-white">Grade-Level Target</h4>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                <td>Standard Common Core mathematical terminology.</td>
                <td>Step-by-step problem-solving breakdowns.</td>
                <td>Clear distinction of multiplicative relationships.</td>
                <td>Expandable math formula reference card.</td>
              </ul>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <span className="px-2.5 py-0.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold rounded">
                Advanced (Lexile ~950L)
              </span>
              <h4 className="text-sm font-bold text-white">Enrichment & Stretch</h4>
              <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
                <td>Multi-step algebraic proofs and variable notation.</td>
                <td>Coordinate plane graphing of ratio tables.</td>
                <td>Open-ended reflection prompts.</td>
                <td>Optional stretch challenge questions.</td>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Assumptions & Open Questions */}
      {activeSubTab === 'assumptions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>UX Architectural Assumptions & Open Questions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Reviewed by Privacy/Security Reviewer and Product Manager for scope fit and minor safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEARNER_UX_ASSUMPTIONS.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-indigo-400 block">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white">{item.assumption}</h4>
                <p className="text-xs text-slate-300 leading-relaxed pt-1 border-t border-slate-800">
                  <strong className="text-emerald-400">Design Rationale: </strong>
                  {item.justification}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Checklist for Human Review */}
      {activeSubTab === 'checklist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Checklist for Human Review & Minor Safety Sign-Off</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mandatory quality bar items verified before production deployment.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold rounded-lg">
              5 / 5 Verified ✓
            </span>
          </div>

          <div className="space-y-3">
            {LEARNER_UX_HUMAN_CHECKLIST.map((item) => (
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
      )}

    </div>
  );
};
