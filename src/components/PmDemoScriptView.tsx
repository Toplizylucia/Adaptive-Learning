import React, { useState, useEffect } from 'react';
import { 
  DEMO_SUMMARY, 
  DEMO_ASSUMPTIONS_OPEN_QUESTIONS, 
  DEMO_SCRIPT_STEPS, 
  PILOT_READINESS_CHECKLIST, 
  DEMO_TRACEABILITY_MATRIX, 
  DEMO_RISKS_MITIGATIONS, 
  DEMO_HUMAN_CHECKLIST 
} from '../data/pmDemoScriptData';
import { DemoScriptStep, PilotReadinessChecklistItem } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
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
  Clock, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Award, 
  RefreshCw 
} from 'lucide-react';

export const PmDemoScriptView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'demo_script' | 'pilot_readiness' | 'traceability' | 'risks_mitigations' | 'human_signoff' | 'assumptions_qna'>('demo_script');

  // Filter state for Pilot Readiness Checklist
  const [checklistFilter, setChecklistFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Interactive Rehearsal / Teleprompter Mode State
  const [isRehearsalRunning, setIsRehearsalRunning] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [stepTimer, setStepTimer] = useState<number>(DEMO_SCRIPT_STEPS[0].durationSeconds);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [simulatedFallbackActive, setSimulatedFallbackActive] = useState<boolean>(false);

  const currentStep = DEMO_SCRIPT_STEPS[currentStepIndex];

  // Timer Effect for Live Rehearsal Mode
  useEffect(() => {
    let interval: any = null;
    if (isRehearsalRunning) {
      interval = setInterval(() => {
        setStepTimer((prev) => {
          if (prev <= 1) {
            // Auto advance or pause at end
            if (currentStepIndex < DEMO_SCRIPT_STEPS.length - 1) {
              const nextIndex = currentStepIndex + 1;
              setCurrentStepIndex(nextIndex);
              return DEMO_SCRIPT_STEPS[nextIndex].durationSeconds;
            } else {
              setIsRehearsalRunning(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRehearsalRunning, currentStepIndex]);

  const handleStepSelect = (index: number) => {
    setCurrentStepIndex(index);
    setStepTimer(DEMO_SCRIPT_STEPS[index].durationSeconds);
    setSimulatedFallbackActive(false);
  };

  const handleResetRehearsal = () => {
    setIsRehearsalRunning(false);
    setCurrentStepIndex(0);
    setStepTimer(DEMO_SCRIPT_STEPS[0].durationSeconds);
    setSimulatedFallbackActive(false);
  };

  const handleSpeechSynthesize = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel(); // Stop current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const filteredChecklist = PILOT_READINESS_CHECKLIST.filter((item) => {
    const matchesSearch = item.itemId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.requirementTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.namedOwner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = checklistFilter === 'ALL' || item.category === checklistFilter;
    return matchesSearch && matchesCategory;
  });

  const totalDurationMinutes = Math.round(
    DEMO_SCRIPT_STEPS.reduce((sum, s) => sum + s.durationSeconds, 0) / 60
  );

  const readyItemsCount = PILOT_READINESS_CHECKLIST.filter(i => i.status === 'READY').length;
  const totalItemsCount = PILOT_READINESS_CHECKLIST.length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Stakeholder Demo Script Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold rounded-full flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Stakeholder Demo Package</span>
              </span>

              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold rounded-full flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{totalDurationMinutes} Min Demo Allocation</span>
              </span>

              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold rounded-full flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Reviewed by Engineer &amp; Security Reviewer</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400 block">Target Audience:</span>
              <span className="text-xs font-bold text-white font-mono">{DEMO_SUMMARY.audience}</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>PM Demo Script &amp; Pilot Readiness Matrix</span>
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs font-mono rounded-lg border border-indigo-500/30">
                STAKEHOLDER REVIEW
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-4xl leading-relaxed">
              {DEMO_SUMMARY.coreValueProposition}
            </p>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('demo_script')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'demo_script'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Play className="w-3.5 h-3.5 text-indigo-300" />
              <span>Demo Script ({DEMO_SCRIPT_STEPS.length} Steps)</span>
            </button>

            <button
              onClick={() => setActiveTab('pilot_readiness')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'pilot_readiness'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pilot Readiness ({readyItemsCount}/{totalItemsCount} Ready)</span>
            </button>

            <button
              onClick={() => setActiveTab('traceability')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'traceability'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>PRD Traceability</span>
            </button>

            <button
              onClick={() => setActiveTab('risks_mitigations')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'risks_mitigations'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Presentation Risks &amp; Fallbacks</span>
            </button>

            <button
              onClick={() => setActiveTab('human_signoff')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'human_signoff'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Pre-Demo Sign-Off</span>
            </button>

            <button
              onClick={() => setActiveTab('assumptions_qna')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'assumptions_qna'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Assumptions &amp; Open Questions</span>
            </button>
          </div>

        </div>
      </div>

      {/* TAB 1: DEMO SCRIPT & INTERACTIVE REHEARSAL TELEPROMPTER */}
      {activeTab === 'demo_script' && (
        <div className="space-y-6">
          
          {/* Interactive Rehearsal Mode Teleprompter Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                  <Play className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                    Live Teleprompter &amp; Safeguard Simulator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Step {currentStep.stepNumber} of {DEMO_SCRIPT_STEPS.length}: <strong className="text-white">{currentStep.title}</strong>
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsRehearsalRunning(!isRehearsalRunning)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shadow-lg ${
                    isRehearsalRunning
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isRehearsalRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isRehearsalRunning ? 'Pause Rehearsal' : 'Start Rehearsal'}</span>
                </button>

                <button
                  onClick={handleResetRehearsal}
                  className="p-2 bg-slate-950 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition-all"
                  title="Reset Rehearsal"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2 rounded-xl border transition-all ${
                    isMuted
                      ? 'bg-slate-950 text-rose-400 border-rose-500/30'
                      : 'bg-slate-950 text-indigo-400 border-indigo-500/30'
                  }`}
                  title={isMuted ? 'Voice Muted' : 'Voice Enabled'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleSpeechSynthesize(currentStep.narrationScript)}
                  className="px-3 py-2 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 text-xs font-bold rounded-xl transition-all flex items-center space-x-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Read Script</span>
                </button>
              </div>
            </div>

            {/* Step Selection Quick Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {DEMO_SCRIPT_STEPS.map((step, idx) => (
                <button
                  key={step.stepId}
                  onClick={() => handleStepSelect(idx)}
                  className={`p-2.5 rounded-xl border text-left transition-all space-y-1 ${
                    currentStepIndex === idx
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                    <span>STEP 0{step.stepNumber}</span>
                    <span className="opacity-80">{step.durationSeconds}s</span>
                  </div>
                  <div className="text-xs font-bold truncate leading-snug">{step.title}</div>
                </button>
              ))}
            </div>

            {/* Teleprompter Active Box */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/40 space-y-4 relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 font-mono text-xs font-bold rounded-md border border-indigo-500/30">
                    Role: {currentStep.presenterRole}
                  </span>
                  <span className={`px-2.5 py-0.5 font-mono text-xs font-bold rounded-md border ${
                    currentStep.claimType === 'VERIFIED_IN_BUILD'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {currentStep.claimType === 'VERIFIED_IN_BUILD' ? '✓ Verified in Build' : '🎯 Projected Pilot Target'}
                  </span>
                </div>

                <div className="flex items-center space-x-3 font-mono text-xs text-slate-400">
                  <span>Step Duration: <strong className="text-white">{stepTimer}s</strong> remaining</span>
                </div>
              </div>

              {/* Narration Teleprompter Script */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider block">
                  Verbatim Narration Script (Speak Aloud):
                </span>
                <p className="text-base sm:text-lg font-medium text-white italic leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  {currentStep.narrationScript}
                </p>
              </div>

              {/* Expected System Behavior & Live Safeguard */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block flex items-center space-x-1">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Expected System Response:</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed">{currentStep.expectedSystemBehavior}</p>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-amber-500/30 space-y-1">
                  <span className="text-[10px] font-mono text-amber-300 uppercase font-bold block flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Live Safeguard Demonstrated:</span>
                  </span>
                  <p className="text-amber-200 font-bold leading-relaxed">{currentStep.safeguardDemonstrated}</p>
                </div>
              </div>

              {/* Fallback Simulation Trigger */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-bold block flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Live Latency / Network Failure Fallback Script:</span>
                  </span>
                  <p className="text-xs text-slate-300 italic">
                    {currentStep.fallbackTalkingPoint}
                  </p>
                </div>

                <button
                  onClick={() => setSimulatedFallbackActive(!simulatedFallbackActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all shrink-0 ${
                    simulatedFallbackActive
                      ? 'bg-rose-600 text-white shadow'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {simulatedFallbackActive ? 'Deactivate Fallback' : 'Simulate Failure Fallback'}
                </button>
              </div>

              {simulatedFallbackActive && (
                <div className="p-3 bg-rose-950/60 rounded-xl border border-rose-500/40 text-xs text-rose-200 space-y-1 font-mono">
                  <span className="font-bold flex items-center space-x-1">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    <span>LIVE FALLBACK SIMULATED FOR STEP 0{currentStep.stepNumber}:</span>
                  </span>
                  <p className="text-slate-300">
                    Presenter delivers graceful recovery script without pausing. Pre-cached static local state handles response seamlessly.
                  </p>
                </div>
              )}

            </div>

          </div>

          {/* Complete Step Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Full Step-by-Step Presentation Reference Matrix</span>
            </h3>

            <div className="space-y-4">
              {DEMO_SCRIPT_STEPS.map((step) => (
                <div key={step.stepId} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-mono font-bold text-xs rounded-md">
                        Step 0{step.stepNumber}
                      </span>
                      <span className="font-bold text-white text-sm">{step.title}</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs font-mono">
                      <span className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded border border-slate-800">
                        {step.durationSeconds}s
                      </span>
                      <span className="px-2 py-0.5 bg-slate-900 text-indigo-300 rounded border border-slate-800">
                        {step.presenterRole}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    “{step.narrationScript}”
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold block">Expected System Behavior:</span>
                      <p className="text-slate-300 mt-1">{step.expectedSystemBehavior}</p>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-xl border border-amber-500/30">
                      <span className="text-[10px] font-mono text-amber-300 uppercase font-bold block">Safeguard Demonstrated:</span>
                      <p className="text-amber-200 font-bold mt-1">{step.safeguardDemonstrated}</p>
                    </div>
                  </div>

                  <div className="bg-rose-950/30 p-3 rounded-xl border border-rose-500/30 text-xs">
                    <span className="text-[10px] font-mono text-rose-300 uppercase font-bold block">Live Failure Fallback Talking Point:</span>
                    <p className="text-slate-300 italic mt-1">{step.fallbackTalkingPoint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PILOT READINESS CHECKLIST */}
      {activeTab === 'pilot_readiness' && (
        <div className="space-y-6">
          
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search readiness item, owner, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Category:</span>
              <select
                value={checklistFilter}
                onChange={(e) => setChecklistFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="TECHNICAL">Technical</option>
                <option value="PEDAGOGICAL">Pedagogical</option>
                <option value="COMPLIANCE">Compliance</option>
                <option value="TEACHER_TRAINING">Teacher Training</option>
              </select>
            </div>
          </div>

          {/* Checklist Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              <span>Pilot Readiness Quality Gate Checklist</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                    <th className="p-3">Item ID</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Requirement Title</th>
                    <th className="p-3">Named Owner</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Verification Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredChecklist.map((row) => (
                    <tr key={row.itemId} className="hover:bg-slate-950/50">
                      <td className="p-3 font-mono font-bold text-indigo-300">{row.itemId}</td>
                      <td className="p-3 font-mono text-cyan-300">{row.category}</td>
                      <td className="p-3 font-bold text-white">{row.requirementTitle}</td>
                      <td className="p-3 font-mono text-slate-400">{row.namedOwner}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          row.status === 'READY' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          row.status === 'IN_REMEDIATION' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-400 max-w-xs truncate" title={row.verificationEvidence}>
                        {row.verificationEvidence}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: TRACEABILITY MATRIX */}
      {activeTab === 'traceability' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Traceability Table (Demo Step → PRD Journey / Safeguard Demonstrated)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verifies that every live demonstration step directly traces back to specific PRD Section 6 User Journeys and Section 9 Safeguards.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <th className="p-3">Step ID</th>
                  <th className="p-3">Demo Step Title</th>
                  <th className="p-3">PRD User Journey</th>
                  <th className="p-3">Safeguard / Metric Demonstrated</th>
                  <th className="p-3">System Capability Verified</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {DEMO_TRACEABILITY_MATRIX.map((row) => (
                  <tr key={row.stepId} className="hover:bg-slate-950/50">
                    <td className="p-3 font-mono font-bold text-indigo-300">{row.stepId}</td>
                    <td className="p-3 font-bold text-white">{row.stepTitle}</td>
                    <td className="p-3 font-mono text-cyan-300">{row.prdUserJourney}</td>
                    <td className="p-3 font-mono text-amber-300">{row.safeguardOrMetricDemonstrated}</td>
                    <td className="p-3 font-mono text-slate-400">{row.systemCapabilityVerified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RISKS & MITIGATIONS */}
      {activeTab === 'risks_mitigations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Live Presentation Risks &amp; Graceful Fallback Recovery</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Outlines potential live failure scenarios during stakeholder presentation and provides exact verbal recovery scripts and technical fallback actions.
            </p>
          </div>

          <div className="space-y-4">
            {DEMO_RISKS_MITIGATIONS.map(rsk => (
              <div key={rsk.riskId} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-bold rounded">
                      {rsk.riskId}
                    </span>
                    <span className="font-bold text-white text-sm">{rsk.riskTitle}</span>
                  </div>

                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-[10px] font-bold rounded">
                    Impact: {rsk.impactOnDemo}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>Failure Scenario:</strong> {rsk.failureScenario}
                </p>

                <div className="bg-indigo-950/60 p-3.5 rounded-xl border border-indigo-500/40 text-xs space-y-1">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold block">Live Presenter Mitigation Script:</span>
                  <p className="text-white italic leading-relaxed">{rsk.liveMitigationScript}</p>
                </div>

                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">Technical Fallback Action:</span>
                  <p className="text-slate-300 font-mono text-[11px]">{rsk.technicalFallbackAction}</p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 text-right pt-1">
                  Owner Role: {rsk.ownerRole}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PRE-DEMO HUMAN SIGNOFF */}
      {activeTab === 'human_signoff' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <UserCheck className="w-5 h-5 text-purple-400" />
                <span>Pre-Presentation Human Review Sign-Off Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mandatory sign-off required from Lead Engineer, Security Reviewer, Product Manager, and Operations Lead before external presentation.
              </p>
            </div>

            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold rounded-lg">
              3 / 4 Approved | Ready for Internal Dry Run
            </span>
          </div>

          <div className="space-y-4">
            {DEMO_HUMAN_CHECKLIST.map(item => (
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
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Review Focus Area:</span>
                    <p className="text-slate-300 leading-relaxed">{item.reviewFocusArea}</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">Verification Evidence:</span>
                    <p className="text-slate-200 font-mono text-[11px] mt-1">{item.verificationEvidence}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: ASSUMPTIONS & OPEN QUESTIONS */}
      {activeTab === 'assumptions_qna' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <span>Demo Assumptions &amp; Open Questions</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Documents underlying constraints, audience context, and technical hypotheses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assumptions */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span>Key Presentation Assumptions</span>
              </h4>

              <div className="space-y-3">
                {DEMO_ASSUMPTIONS_OPEN_QUESTIONS.assumptions.map(asm => (
                  <div key={asm.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="font-bold text-white">{asm.id}: {asm.title}</span>
                    <p className="text-slate-300 leading-relaxed">{asm.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Questions */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Open Questions &amp; Hypotheses</span>
              </h4>

              <div className="space-y-3">
                {DEMO_ASSUMPTIONS_OPEN_QUESTIONS.openQuestions.map(opq => (
                  <div key={opq.id} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
                    <span className="font-bold text-white block">{opq.id}: {opq.question}</span>
                    <p className="text-amber-200 bg-amber-950/40 p-2 rounded border border-amber-500/30 text-[11px]">
                      Current Hypothesis: {opq.currentHypothesis}
                    </p>
                    <span className="text-[10px] font-mono text-slate-500 block text-right">Owner: {opq.owner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
