import React, { useState } from 'react';
import { 
  DIAGNOSTIC_TAXONOMY_SUMMARY, 
  DIAGNOSTIC_ASSUMPTIONS_QUESTIONS, 
  GRADE_7_RATIO_TAXONOMY, 
  QUESTION_SELECTION_NODES, 
  DIAGNOSTIC_CONFIDENCE_RULES, 
  DIAGNOSTIC_EDGE_CASES, 
  DIAGNOSTIC_TRACEABILITY, 
  DIAGNOSTIC_RISKS, 
  DIAGNOSTIC_HUMAN_CHECKLIST 
} from '../data/diagnosticTaxonomyData';
import { MisconceptionTaxonomyItem, QuestionSelectionNode } from '../types';
import { 
  BrainCircuit, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Zap, 
  ArrowRight, 
  Layers, 
  Sliders, 
  RefreshCw, 
  BookOpen, 
  Users, 
  Sparkles, 
  ChevronRight, 
  UserCheck, 
  Lock, 
  Activity, 
  Bot 
} from 'lucide-react';

export const DiagnosticTaxonomyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'taxonomy_table' | 'decision_tree' | 'confidence_fallback' | 'edge_cases' | 'traceability' | 'risks' | 'checklist'>('taxonomy_table');
  
  // Search & Filter state for Misconception Taxonomy Table
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('ALL');

  // Interactive Adaptive Diagnostic Simulator State
  const [currentNodeId, setCurrentNodeId] = useState<string>('NODE_Q1_ANCHOR');
  const [questionHistory, setQuestionHistory] = useState<Array<{
    nodeId: string;
    itemCode: string;
    selectedOptionText: string;
    isCorrect: boolean;
    detectedMisconception: string;
  }>>([]);
  const [estimatedBktMastery, setEstimatedBktMastery] = useState<number>(0.35);
  const [detectedMisconceptionId, setDetectedMisconceptionId] = useState<string | null>(null);
  const [diagnosticStatus, setDiagnosticStatus] = useState<'IN_PROGRESS' | 'DIAGNOSED_HIGH_CONFIDENCE' | 'DIAGNOSED_MODERATE' | 'FALLBACK_TEACHER_ESCALATION'>('IN_PROGRESS');

  // Edge case simulator state
  const [simulatedEllMode, setSimulatedEllMode] = useState<boolean>(false);
  const [simulatedInconsistencyMode, setSimulatedInconsistencyMode] = useState<boolean>(false);

  const filteredTaxonomy = GRADE_7_RATIO_TAXONOMY.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.misconceptionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.typicalErrorSignature.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCluster = selectedClusterFilter === 'ALL' || item.commonCoreCluster.includes(selectedClusterFilter);
    return matchesSearch && matchesCluster;
  });

  const currentNode: QuestionSelectionNode = QUESTION_SELECTION_NODES.find(n => n.nodeId === currentNodeId) || QUESTION_SELECTION_NODES[0];

  const handleSelectOptionInSimulator = (option: QuestionSelectionNode['options'][0]) => {
    if (diagnosticStatus !== 'IN_PROGRESS') return;

    const newHistory = [
      ...questionHistory,
      {
        nodeId: currentNode.nodeId,
        itemCode: currentNode.itemCode,
        selectedOptionText: option.text,
        isCorrect: option.isCorrect,
        detectedMisconception: option.linkedMisconceptionId
      }
    ];
    setQuestionHistory(newHistory);

    // Update BKT estimate
    let nextBkt = estimatedBktMastery;
    if (option.isCorrect) {
      nextBkt = Math.min(0.95, estimatedBktMastery + 0.25);
    } else {
      nextBkt = Math.max(0.10, estimatedBktMastery - 0.15);
    }
    setEstimatedBktMastery(nextBkt);

    // Check termination conditions
    if (option.isCorrect) {
      if (newHistory.length >= 3 && nextBkt >= 0.80) {
        setDiagnosticStatus('DIAGNOSED_HIGH_CONFIDENCE');
        return;
      }
      const nextStep = currentNode.nextStepOnSuccess;
      if (nextStep === 'TERMINATE_DIAGNOSTIC_MASTERY') {
        setDiagnosticStatus('DIAGNOSED_HIGH_CONFIDENCE');
      } else if (QUESTION_SELECTION_NODES.some(n => n.nodeId === nextStep)) {
        setCurrentNodeId(nextStep);
      } else {
        setDiagnosticStatus('DIAGNOSED_MODERATE');
      }
    } else {
      const misconception = option.linkedMisconceptionId;
      if (misconception !== 'NONE') {
        setDetectedMisconceptionId(misconception);
      }

      if (newHistory.length >= 5) {
        setDiagnosticStatus('FALLBACK_TEACHER_ESCALATION');
        return;
      }

      const nextStep = currentNode.nextStepOnMisconception[misconception] || currentNode.nextStepOnSuccess;
      if (nextStep && nextStep.startsWith('TERMINATE')) {
        if (nextBkt < 0.50 && newHistory.length >= 3) {
          setDiagnosticStatus('DIAGNOSED_HIGH_CONFIDENCE');
        } else {
          setDiagnosticStatus('DIAGNOSED_MODERATE');
        }
      } else if (QUESTION_SELECTION_NODES.some(n => n.nodeId === nextStep)) {
        setCurrentNodeId(nextStep);
      } else {
        setDiagnosticStatus('DIAGNOSED_MODERATE');
      }
    }
  };

  const handleResetSimulator = () => {
    setCurrentNodeId('NODE_Q1_ANCHOR');
    setQuestionHistory([]);
    setEstimatedBktMastery(0.35);
    setDetectedMisconceptionId(null);
    setDiagnosticStatus('IN_PROGRESS');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Hybrid Role Identity & Draft Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                <span>Learning Scientist &amp; ML Engineer Spec</span>
              </span>
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>DRAFT / HYPOTHESIS ONLY</span>
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>FR-1 to FR-3 Bounded Diagnostic</span>
              </span>
            </div>

            <div className="text-right text-xs font-mono text-slate-400">
              Target Topic: <strong className="text-indigo-300">Grade 7 Proportional Relationships (CCSS 7.RP.A.2)</strong>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Diagnostic Logic &amp; Misconception Taxonomy Spec
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1.5 max-w-4xl leading-relaxed">
              {DIAGNOSTIC_TAXONOMY_SUMMARY.overviewText}
            </p>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('taxonomy_table')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'taxonomy_table'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>1. Misconception Taxonomy (6)</span>
            </button>

            <button
              onClick={() => setActiveTab('decision_tree')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'decision_tree'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Interactive Adaptive Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('confidence_fallback')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'confidence_fallback'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>3. Confidence &amp; Fallbacks</span>
            </button>

            <button
              onClick={() => setActiveTab('edge_cases')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'edge_cases'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>4. Edge Cases &amp; Bias Checks</span>
            </button>

            <button
              onClick={() => setActiveTab('traceability')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'traceability'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>5. Traceability Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('risks')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'risks'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>6. Risks &amp; Mitigations</span>
            </button>

            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeTab === 'checklist'
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>7. Human Review Checklist</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: MISCONCEPTION TAXONOMY TABLE */}
      {activeTab === 'taxonomy_table' && (
        <div className="space-y-6">
          
          {/* Assumptions & Open Questions Summary Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pedagogical Assumptions */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-indigo-400" />
                <span>Pedagogical &amp; ML Assumptions</span>
              </h3>
              <div className="space-y-2 text-xs">
                {DIAGNOSTIC_ASSUMPTIONS_QUESTIONS.assumptions.map(asm => (
                  <div key={asm.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-0.5">
                    <span className="font-bold text-indigo-300 block">{asm.title} ({asm.id})</span>
                    <p className="text-slate-400 leading-relaxed">{asm.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Questions & Hypotheses */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-white uppercase font-mono flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Open Questions &amp; Current Hypotheses</span>
              </h3>
              <div className="space-y-2 text-xs">
                {DIAGNOSTIC_ASSUMPTIONS_QUESTIONS.openQuestions.map(opq => (
                  <div key={opq.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-amber-300 block">{opq.question}</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      <strong>Hypothesis:</strong> {opq.currentHypothesis}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">Owner: {opq.owner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text"
                placeholder="Search misconception ID or error signature..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedClusterFilter}
                onChange={(e) => setSelectedClusterFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-mono focus:outline-none"
              >
                <option value="ALL">All Common Core Clusters</option>
                <option value="7.RP.A.2">7.RP.A.2 (Proportional Relationships)</option>
                <option value="7.RP.A.1">7.RP.A.1 (Complex Fractions)</option>
                <option value="7.RP.A.3">7.RP.A.3 (Multi-Step Percent)</option>
              </select>
            </div>
          </div>

          {/* Misconception Taxonomy Cards */}
          <div className="grid grid-cols-1 gap-4">
            {filteredTaxonomy.map(tax => (
              <div key={tax.misconceptionId} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold rounded-lg">
                      {tax.misconceptionId}
                    </span>
                    <h3 className="text-base font-bold text-white">{tax.title}</h3>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 font-mono text-[10px] rounded">
                      {tax.commonCoreCluster}
                    </span>
                    <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold rounded">
                      {tax.validationStatus}
                    </span>
                  </div>
                </div>

                {/* Description & Error Signature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">Cognitive Description:</span>
                    <p className="text-slate-200 leading-relaxed">{tax.description}</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-amber-400 block font-bold">Typical Error Signature:</span>
                    <p className="text-slate-200 leading-relaxed">{tax.typicalErrorSignature}</p>
                  </div>
                </div>

                {/* Sample Response & Remediation Approach */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-rose-400 block font-bold">Sample Student Response Quote:</span>
                    <p className="text-slate-300 italic">"{tax.sampleStudentResponse}"</p>
                  </div>

                  <div className="bg-indigo-950/60 p-4 rounded-xl border border-indigo-500/40 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-cyan-300 block font-bold">Pedagogical Remediation Approach:</span>
                    <p className="text-white leading-relaxed">{tax.remediationApproach}</p>
                  </div>
                </div>

                {/* Footer: Pedagogical Source Citation & BKT Parameters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  <span>Source: <strong className="text-slate-300">{tax.pedagogicalSource}</strong></span>

                  <div className="flex items-center space-x-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px]">
                    <span>BKT Priors:</span>
                    <span className="text-emerald-400">p(L0)={tax.bktParameters.priorMastery}</span>
                    <span className="text-cyan-400">p(T)={tax.bktParameters.transitRate}</span>
                    <span className="text-rose-400">p(S)={tax.bktParameters.slipRate}</span>
                    <span className="text-amber-400">p(G)={tax.bktParameters.guessRate}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE ADAPTIVE SIMULATOR */}
      {activeTab === 'decision_tree' && (
        <div className="space-y-6">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span>Interactive 3–5 Question Bounded Adaptive Diagnostic Simulator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Simulate live item branching, Bayesian Knowledge Tracing updates, and termination rules (FR-1 compliance).
                </p>
              </div>

              <button
                onClick={handleResetSimulator}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 transition-all flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Reset Diagnostic Session</span>
              </button>
            </div>

            {/* Diagnostic Status Header Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Question Progress</span>
                <span className="text-sm font-bold text-white font-mono">
                  Item {questionHistory.length + (diagnosticStatus === 'IN_PROGRESS' ? 1 : 0)} of 5 (Max)
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Estimated BKT Mastery p(L)</span>
                <span className={`text-sm font-bold font-mono ${
                  estimatedBktMastery >= 0.80 ? 'text-emerald-400' :
                  estimatedBktMastery >= 0.50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {Math.round(estimatedBktMastery * 100)}%
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Diagnostic Engine Status</span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded inline-block ${
                  diagnosticStatus === 'IN_PROGRESS' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                  diagnosticStatus === 'DIAGNOSED_HIGH_CONFIDENCE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  diagnosticStatus === 'DIAGNOSED_MODERATE' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {diagnosticStatus}
                </span>
              </div>
            </div>

            {/* Active Question Display */}
            {diagnosticStatus === 'IN_PROGRESS' ? (
              <div className="bg-slate-950 p-6 rounded-2xl border border-indigo-500/40 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-slate-800">
                  <span className="px-2 py-0.5 bg-indigo-600 text-white font-bold rounded text-[10px]">
                    {currentNode.nodeId}
                  </span>
                  <span>Topic: <strong className="text-indigo-300">{currentNode.mathTopic}</strong> ({currentNode.commonCoreStandard})</span>
                </div>

                <h4 className="text-sm font-bold text-white leading-relaxed">
                  {currentNode.questionText}
                </h4>

                {/* Option Choices */}
                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono block">Select Student Answer Option:</span>
                  {currentNode.options.map((opt) => (
                    <button
                      key={opt.optionId}
                      onClick={() => handleSelectOptionInSimulator(opt)}
                      className="w-full text-left p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 transition-all text-xs space-y-1 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white group-hover:text-indigo-300">{opt.text}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          opt.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {opt.isCorrect ? 'Correct Answer' : `Distractor (${opt.linkedMisconceptionId})`}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        <strong>Diagnostic Rationale:</strong> {opt.diagnosticRationale}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Diagnostic Termination Result Card */
              <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-500/50 space-y-4 animate-in fade-in">
                <div className="flex items-center space-x-3 text-emerald-400 font-bold text-base">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Diagnostic Session Complete ({questionHistory.length} Questions Answered)</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <span className="font-bold text-white block">Final Diagnostic Classification Outcome:</span>
                  {detectedMisconceptionId ? (
                    <p className="text-amber-300">
                      Identified Cognitive Misconception: <strong className="font-mono text-white text-sm">{detectedMisconceptionId}</strong>
                    </p>
                  ) : (
                    <p className="text-emerald-300">
                      Mastery Demonstrated: Learner passed diagnostic probes with {Math.round(estimatedBktMastery * 100)}% BKT confidence.
                    </p>
                  )}
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    System emitted targeted micro-scaffold instruction and logged cryptographic audit log event.
                  </p>
                </div>
              </div>
            )}

            {/* Answer History Timeline */}
            {questionHistory.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono block">Question History Trail</span>
                <div className="space-y-2">
                  {questionHistory.map((hist, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 font-mono text-[10px] font-bold text-slate-300 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-white">{hist.itemCode}</span>
                          <p className="text-[11px] text-slate-400">Selected: "{hist.selectedOptionText}"</p>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        hist.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {hist.isCorrect ? 'Correct' : hist.detectedMisconception}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* TAB 3: CONFIDENCE & FALLBACK LOGIC */}
      {activeTab === 'confidence_fallback' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              <span>Diagnostic Confidence Thresholds &amp; Fallback Rules</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Specifies how the engine acts under different levels of statistical confidence and when low confidence triggers teacher dashboard escalation (FR-3 compliance).
            </p>
          </div>

          <div className="space-y-4">
            {DIAGNOSTIC_CONFIDENCE_RULES.map(rule => (
              <div key={rule.level} className={`p-5 rounded-xl border space-y-3 transition-all ${
                rule.level === 'HIGH' ? 'bg-emerald-950/20 border-emerald-500/40' :
                rule.level === 'MODERATE' ? 'bg-amber-950/20 border-amber-500/40' :
                'bg-rose-950/20 border-rose-500/40'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold uppercase ${
                      rule.level === 'HIGH' ? 'bg-emerald-500 text-slate-950' :
                      rule.level === 'MODERATE' ? 'bg-amber-500 text-slate-950' :
                      'bg-rose-500 text-white'
                    }`}>
                      {rule.level} CONFIDENCE
                    </span>
                    <span className="text-xs font-mono text-slate-300">{rule.probabilityThreshold}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold block">System Classification Action:</span>
                    <p className="text-slate-200 leading-relaxed">{rule.systemClassificationAction}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Learner-Facing Instruction:</span>
                    <p className="text-slate-200 leading-relaxed">{rule.learnerFacingInstruction}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono pt-2 border-t border-slate-800/60">
                  <span className="text-slate-400">Teacher Alert: <strong className="text-white">{rule.teacherDashboardAlert}</strong></span>
                  <span className="text-purple-300">Audit Type: {rule.auditStreamLogType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: EDGE CASES & BIAS CHECKS */}
      {activeTab === 'edge_cases' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>Edge Cases &amp; Non-Demographic Bias Safeguards</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Guarantees language-learner (ELL) differences, motor impairment, and learner answer inconsistency are handled without misclassifying differences as mathematical misconceptions (FR-2 compliance).
            </p>
          </div>

          <div className="space-y-4">
            {DIAGNOSTIC_EDGE_CASES.map(ec => (
              <div key={ec.caseId} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm text-white">{ec.caseName} ({ec.caseId})</span>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold rounded">
                    Fairness Safeguard Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">Trigger Condition:</span>
                    <p className="text-slate-300 leading-relaxed">{ec.triggerCondition}</p>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Diagnostic Classification Behavior:</span>
                    <p className="text-slate-200 leading-relaxed">{ec.classificationBehavior}</p>
                  </div>
                </div>

                <div className="bg-indigo-950/60 p-3.5 rounded-xl border border-indigo-500/40 text-xs space-y-1">
                  <span className="text-[10px] font-mono text-purple-300 uppercase font-bold block">Fairness &amp; Accessibility Protection:</span>
                  <p className="text-white leading-relaxed">{ec.fairnessSafeguard}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TRACEABILITY MATRIX */}
      {activeTab === 'traceability' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              <span>Traceability Table (Logic Element &rarr; PRD Requirement)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verifies every algorithm component traces directly to PRD Functional Requirements (FR-1 through FR-3) and security safeguards.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <th className="p-3">Logic Element</th>
                  <th className="p-3">PRD Requirement</th>
                  <th className="p-3">Pedagogical / Security Safeguard</th>
                  <th className="p-3">Verification Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {DIAGNOSTIC_TRACEABILITY.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50">
                    <td className="p-3 font-bold text-white">{row.logicElement}</td>
                    <td className="p-3 font-mono text-indigo-300">{row.prdRequirement}</td>
                    <td className="p-3 leading-relaxed">{row.pedagogicalOrSecuritySafeguard}</td>
                    <td className="p-3 font-mono text-emerald-400">{row.verificationMethod}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: RISKS & MITIGATIONS */}
      {activeTab === 'risks' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <span>Risks &amp; Mitigations Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluates potential pedagogical, bias, and data validity risks with concrete engineering mitigations.
            </p>
          </div>

          <div className="space-y-4">
            {DIAGNOSTIC_RISKS.map(rsk => (
              <div key={rsk.riskId} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono text-xs font-bold rounded">
                      {rsk.riskId}
                    </span>
                    <span className="font-bold text-white text-sm">{rsk.category} Risk</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                    rsk.severity === 'HIGH' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {rsk.severity} SEVERITY
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  {rsk.description}
                </p>

                <div className="bg-indigo-950/60 p-3.5 rounded-xl border border-indigo-500/40 text-xs space-y-1">
                  <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold block">Engineering &amp; Pedagogical Mitigation:</span>
                  <p className="text-white leading-relaxed">{rsk.mitigationStrategy}</p>
                </div>

                <div className="text-[10px] font-mono text-slate-500 text-right">
                  Owner Role: {rsk.ownerRole}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: HUMAN REVIEW CHECKLIST */}
      {activeTab === 'checklist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Checklist for Human Review &amp; Sign-Off</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Quality bar requirements verified by Learning Scientist, ML Engineer, PM, and Security Reviewer.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold rounded-lg">
              5 / 5 Verified ✓
            </span>
          </div>

          <div className="space-y-3">
            {DIAGNOSTIC_HUMAN_CHECKLIST.map(chk => (
              <div key={chk.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-start space-x-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-white block">{chk.checkItem} ({chk.category})</span>
                  <p className="text-slate-400">{chk.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
