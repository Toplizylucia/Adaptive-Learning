import React, { useState } from 'react';
import { INITIAL_LEARNER_PROFILES } from '../data/learnerProfilesData';
import { CURRICULUM_NODES } from '../data/curriculumData';
import { LearnerProfile, PracticeQuestion, DiagnosticResult, AuditLogItem } from '../types';
import { 
  Sparkles, 
  Send, 
  HelpCircle, 
  WifiOff, 
  Wifi, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  Layers,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

interface CopilotSimulatorViewProps {
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (val: boolean) => void;
  offlineQueue: DiagnosticResult[];
  setOfflineQueue: React.Dispatch<React.SetStateAction<DiagnosticResult[]>>;
  addAuditLog: (item: AuditLogItem) => void;
}

export const CopilotSimulatorView: React.FC<CopilotSimulatorViewProps> = ({
  isOfflineSimulated,
  setIsOfflineSimulated,
  offlineQueue,
  setOfflineQueue,
  addAuditLog
}) => {
  const [selectedLearner, setSelectedLearner] = useState<LearnerProfile>(INITIAL_LEARNER_PROFILES[0]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('MATH_7_RATIOS_101');
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastDiagnosis, setLastDiagnosis] = useState<DiagnosticResult | null>(null);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [syncingOffline, setSyncingOffline] = useState<boolean>(false);

  const currentNode = CURRICULUM_NODES[selectedNodeId] || CURRICULUM_NODES['MATH_7_RATIOS_101'];
  const currentQuestion: PracticeQuestion = currentNode.questions[questionIndex] || currentNode.questions[0];

  const currentMastery = selectedLearner.masteryVector[selectedNodeId]?.masteryProbability || 0.42;

  // Submit Answer to Copilot Engine
  const handleSubmitAction = async (actionType: 'SUBMIT_ANSWER' | 'REQUEST_HINT' | 'CONFUSION_SIGNAL') => {
    if (actionType === 'SUBMIT_ANSWER' && !selectedChoiceId) return;

    setIsLoading(true);
    setActivePipelineStep(1); // Stage 1: Action captured & PII Sanitized

    const selectedChoice = currentQuestion.choices.find(c => c.id === selectedChoiceId);

    const payload = {
      learnerId: selectedLearner.learnerId,
      displayName: selectedLearner.displayName,
      nodeId: selectedNodeId,
      questionId: currentQuestion.id,
      selectedChoiceId,
      actionType,
      currentMastery,
      questionText: currentQuestion.questionText,
      selectedChoiceText: selectedChoice?.text || '',
      correctChoiceId: currentQuestion.correctChoiceId,
      misconceptionTag: selectedChoice?.misconceptionTag,
      misconceptionDescription: selectedChoice?.misconceptionDescription,
      learningObjective: currentNode.learningObjective,
      accessibilityPrefs: selectedLearner.accessibilityPrefs
    };

    if (isOfflineSimulated) {
      // Simulate Offline Queueing in IndexedDB
      setTimeout(() => {
        const fakeOfflineResult: DiagnosticResult = {
          eventId: `evt_offline_${Date.now()}`,
          timestamp: new Date().toISOString(),
          learnerId: selectedLearner.learnerId,
          piiScrubbedId: selectedLearner.piiScrubbedId,
          nodeId: selectedNodeId,
          actionType,
          isCorrect: selectedChoiceId === currentQuestion.correctChoiceId,
          bktUpdates: { [selectedNodeId]: { oldP: currentMastery, newP: currentMastery } },
          generatedExplanation: 'Offline Mode Active: Your answer submission has been encrypted and stored in local IndexedDB cache. It will auto-sync when classroom Wi-Fi reconnects.',
          nextRecommendedNodeId: selectedNodeId,
          modelRouting: {
            tier: 'TIER_1_MICRO_RULE',
            modelName: 'client-offline-cache',
            latencyMs: 12,
            inputTokens: 0,
            outputTokens: 0,
            costUSD: 0,
            cacheHit: true,
            routingReason: 'Queued locally in IndexedDB Service Worker'
          },
          piiCleanStatus: true,
          auditHash: 'OFFLINE_SHA256_HASH'
        };

        setOfflineQueue(prev => [fakeOfflineResult, ...prev]);
        setLastDiagnosis(fakeOfflineResult);
        setIsLoading(false);
        setActivePipelineStep(0);

        addAuditLog({
          id: fakeOfflineResult.eventId,
          timestamp: fakeOfflineResult.timestamp,
          schoolId: selectedLearner.schoolId,
          anonymizedLearnerHash: selectedLearner.piiScrubbedId,
          actionType,
          nodeId: selectedNodeId,
          modelTier: 'OFFLINE_CACHE',
          costUSD: 0,
          latencyMs: 12,
          piiScrubbed: true,
          status: 'OFFLINE_QUEUED'
        });
      }, 300);
      return;
    }

    // Online Mode: Send request to Express backend /api/copilot/diagnose
    try {
      setActivePipelineStep(2); // Stage 2: Diagnostic Engine BKT
      const response = await fetch('/api/copilot/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setActivePipelineStep(3); // Stage 3: Personalization & Gemini Flash
      const data: DiagnosticResult = await response.json();

      setActivePipelineStep(4); // Stage 4: Profile Delta & Audit Log
      setLastDiagnosis(data);

      // Update local learner mastery probability state
      if (data.bktUpdates[selectedNodeId]) {
        const newProb = data.bktUpdates[selectedNodeId].newP;
        setSelectedLearner(prev => ({
          ...prev,
          masteryVector: {
            ...prev.masteryVector,
            [selectedNodeId]: {
              ...(prev.masteryVector[selectedNodeId] || {
                skillId: selectedNodeId,
                skillName: currentNode.title,
                attemptsCount: 0,
                lastAssessedAt: new Date().toISOString()
              }),
              masteryProbability: newProb,
              attemptsCount: (prev.masteryVector[selectedNodeId]?.attemptsCount || 0) + 1
            }
          }
        }));
      }

      addAuditLog({
        id: data.eventId,
        timestamp: data.timestamp,
        schoolId: selectedLearner.schoolId,
        anonymizedLearnerHash: data.piiScrubbedId,
        actionType,
        nodeId: selectedNodeId,
        modelTier: data.modelRouting.tier,
        costUSD: data.modelRouting.costUSD,
        latencyMs: data.modelRouting.latencyMs,
        piiScrubbed: data.piiCleanStatus,
        status: 'SUCCESS'
      });

    } catch (err) {
      console.error('Diagnostic call failed:', err);
    } finally {
      setIsLoading(false);
      setActivePipelineStep(0);
    }
  };

  // Flush and Sync Offline Queue
  const handleFlushOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;
    setSyncingOffline(true);

    try {
      const response = await fetch('/api/copilot/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queueItems: offlineQueue })
      });
      const resData = await response.json();

      setOfflineQueue([]);
      setIsOfflineSimulated(false);
      
      if (lastDiagnosis && lastDiagnosis.eventId.includes('offline')) {
        setLastDiagnosis({
          ...lastDiagnosis,
          generatedExplanation: `Synced with Cloud Store (${resData.processedCount} item(s) synchronized). Your mastery vectors are up to date!`,
          modelRouting: {
            ...lastDiagnosis.modelRouting,
            routingReason: 'Batch synced from IndexedDB offline queue'
          }
        });
      }
    } catch (err) {
      console.error('Offline sync failed:', err);
    } finally {
      setSyncingOffline(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Simulation Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">Interactive Copilot Sandbox</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Simulate classroom practice items, test misconception diagnosis, observe Gemini 3.6 Flash explanations, and trigger offline sync workflows.
            </p>
          </div>

          {/* Persona Picker */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold uppercase text-slate-400 mb-1">Select Learner Persona</label>
              <select
                value={selectedLearner.learnerId}
                onChange={(e) => {
                  const p = INITIAL_LEARNER_PROFILES.find(lp => lp.learnerId === e.target.value);
                  if (p) setSelectedLearner(p);
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {INITIAL_LEARNER_PROFILES.map(lp => (
                  <option key={lp.learnerId} value={lp.learnerId}>
                    {lp.displayName} ({lp.schoolName})
                  </option>
                ))}
              </select>
            </div>

            {/* Curriculum Topic Picker */}
            <div className="flex flex-col">
              <label className="text-[10px] font-semibold uppercase text-slate-400 mb-1">Select Curriculum Module</label>
              <select
                value={selectedNodeId}
                onChange={(e) => {
                  setSelectedNodeId(e.target.value);
                  setQuestionIndex(0);
                  setSelectedChoiceId('');
                }}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {Object.values(CURRICULUM_NODES).map(node => (
                  <option key={node.id} value={node.id}>
                    {node.title} (Grade {node.gradeLevel})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Offline Queue Sync Strip */}
        <div className="flex flex-wrap items-center justify-between mt-4 pt-2 text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-semibold">Classroom Wi-Fi:</span>
              <button
                onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  isOfflineSimulated
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isOfflineSimulated ? 'Offline (Simulated Network Disconnect)' : 'Online (Direct Gateway Connection)'}
              </button>
            </div>

            {offlineQueue.length > 0 && (
              <div className="flex items-center space-x-2 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30 text-amber-300">
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>{offlineQueue.length} Diagnostic Item(s) Queued in IndexedDB</span>
              </div>
            )}
          </div>

          {offlineQueue.length > 0 && (
            <button
              onClick={handleFlushOfflineQueue}
              disabled={syncingOffline}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingOffline ? 'animate-spin' : ''}`} />
              <span>Flush & Sync Queue to Cloud</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Practice Item Solver */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider block">
                {currentNode.subject} • Grade {currentNode.gradeLevel}
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{currentNode.title}</h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">BKT Mastery $p(L_k)$</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full transition-all duration-500"
                    style={{ width: `${Math.round(currentMastery * 100)}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-cyan-400">{(currentMastery * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Question {questionIndex + 1} of {currentNode.questions.length}</span>
              <span className="text-slate-500">Difficulty Index: {currentQuestion.difficultyIndex}</span>
            </div>
            <p className="text-sm font-semibold text-white leading-relaxed">
              {currentQuestion.questionText}
            </p>
          </div>

          {/* Answer Choices */}
          <div className="space-y-2.5">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Select Answer Choice</span>
            {currentQuestion.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => setSelectedChoiceId(choice.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedChoiceId === choice.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold ${
                    selectedChoiceId === choice.id ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-700 text-slate-400'
                  }`}>
                    {choice.id.split('_')[1].toUpperCase()}
                  </div>
                  <span className="text-xs sm:text-sm font-medium">{choice.text}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSubmitAction('REQUEST_HINT')}
                disabled={isLoading}
                className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium border border-slate-700 transition-all"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Request Hint</span>
              </button>
            </div>

            <button
              onClick={() => handleSubmitAction('SUBMIT_ANSWER')}
              disabled={isLoading || !selectedChoiceId}
              className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Diagnosing via Gemini...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Answer to Copilot</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Live Diagnostic Feedback & Data Lifecycle */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Diagnostic Result Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Diagnostic Copilot Response</h3>
              </div>

              {lastDiagnosis && (
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                  lastDiagnosis.isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}>
                  {lastDiagnosis.isCorrect ? 'CORRECT ANSWER' : 'MISCONCEPTION DETECTED'}
                </span>
              )}
            </div>

            {lastDiagnosis ? (
              <div className="space-y-4">
                
                {/* Explanation text */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-indigo-400">Grounded Adaptive Explanation</span>
                    <span className="font-mono">{lastDiagnosis.modelRouting.latencyMs}ms</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    {lastDiagnosis.generatedExplanation}
                  </p>
                </div>

                {/* Model Routing Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Model Tier Used</span>
                    <span className="font-bold text-cyan-300">{lastDiagnosis.modelRouting.tier}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Estimated Cost</span>
                    <span className="font-bold text-emerald-400">${lastDiagnosis.modelRouting.costUSD.toFixed(6)}</span>
                  </div>
                </div>

                {/* Privacy & Hash Audit */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex items-center space-x-1 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>PII Scrubbed: {lastDiagnosis.piiScrubbedId}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">Hash: {lastDiagnosis.auditHash}</span>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">Select an answer choice and click "Submit Answer" to see real-time Gemini diagnosis.</p>
              </div>
            )}
          </div>

          {/* Real-Time Request Lifecycle Pipeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Live Data Pipeline Stages</span>
              <span className="text-[10px] text-indigo-400 font-mono">FR-1 .. FR-20</span>
            </h4>

            <div className="space-y-2 text-xs">
              <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                activePipelineStep >= 1 ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  <span>1. Action Captured & PII Sanitized ({selectedLearner.piiScrubbedId})</span>
                </div>
                {activePipelineStep >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                activePipelineStep >= 2 ? 'bg-cyan-600/20 border-cyan-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>2. BKT Diagnostic Mastery Update ($p(L_k)$)</span>
                </div>
                {activePipelineStep >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                activePipelineStep >= 3 ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>3. Tiered Router ➔ Gemini 3.6 Flash Generation</span>
                </div>
                {activePipelineStep >= 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>

              <div className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                activePipelineStep >= 4 ? 'bg-emerald-600/20 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>4. Persistent Profile Delta & Audit Log Appended</span>
                </div>
                {activePipelineStep >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
