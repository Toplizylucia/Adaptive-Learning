import React, { useState } from 'react';
import { 
  TEACHER_UX_SUMMARY, 
  TEACHER_UX_ASSUMPTIONS, 
  TEACHER_UX_SCREENS, 
  TEACHER_OVERRIDE_FLOW, 
  TEACHER_UX_TRACEABILITY,
  TEACHER_UX_RISKS, 
  TEACHER_UX_HUMAN_CHECKLIST 
} from '../data/teacherUxSpecData';
import { TeacherUxScreenSpec } from '../types';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Sliders, 
  Eye, 
  EyeOff, 
  Zap, 
  ArrowRight, 
  FileText, 
  Lock, 
  Key, 
  Search, 
  Filter, 
  RefreshCw,
  Award,
  BookOpen,
  LayoutDashboard,
  Activity,
  Layers,
  ChevronRight,
  UserCheck
} from 'lucide-react';

export const TeacherUxSpecView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'screens' | 'prototype' | 'override_flow' | 'traceability' | 'checklist'>('prototype');
  const [selectedScreenId, setSelectedScreenId] = useState<string>('scr_teacher_overview');
  
  // Interactive Simulator State for Prototype Tab
  const [isFerpaAnonymized, setIsFerpaAnonymized] = useState<boolean>(false);
  const [hasPriorityAlert, setHasPriorityAlert] = useState<boolean>(true);
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);
  const [selectedStudentForOverride, setSelectedStudentForOverride] = useState<{ id: string; name: string; bkt: number; status: string }>({
    id: 'ANON_LRN_104',
    name: 'Alex M.',
    bkt: 0.38,
    status: 'Needs Support'
  });
  const [overrideType, setOverrideType] = useState<'mastery' | 'lexile' | 'advancement'>('mastery');
  const [overrideNote, setOverrideNote] = useState<string>('Verified understanding via physical whiteboard problem in class.');
  
  // Mock Students List in Prototype
  const [students, setStudents] = useState([
    { id: 'ANON_LRN_104', name: 'Alex M.', bkt: 0.38, status: 'Needs Support', misconception: 'MIS_RATIO_ADDITIVE_ERROR', stuckMins: 6 },
    { id: 'ANON_LRN_108', name: 'Jordan T.', bkt: 0.42, status: 'Needs Support', misconception: 'MIS_RATIO_ADDITIVE_ERROR', stuckMins: 5 },
    { id: 'ANON_LRN_202', name: 'Sam K.', bkt: 0.65, status: 'Developing', misconception: 'None', stuckMins: 0 },
    { id: 'ANON_LRN_305', name: 'Taylor R.', bkt: 0.88, status: 'Mastered', misconception: 'None', stuckMins: 0 },
    { id: 'ANON_LRN_412', name: 'Morgan L.', bkt: 0.92, status: 'Mastered', misconception: 'None', stuckMins: 0 }
  ]);

  // Plain Language Audit Trail State
  const [auditLogStream, setAuditLogStream] = useState([
    {
      id: 'aud_101',
      timestamp: '08:42:15 AM',
      studentName: 'Alex M.',
      studentId: 'ANON_LRN_104',
      actionSummary: 'AI Diagnosed Additive Ratio Error',
      plainEnglishReason: 'Student added 2 to both quantities (2:3 → 4:5) instead of multiplying. BKT mastery updated to 0.38.',
      sourceCitation: 'Illustrative Math Grade 7 Unit 2 Lesson 4',
      type: 'AI_DIAGNOSIS',
      hash: 'sha256_8f92a10b...'
    },
    {
      id: 'aud_100',
      timestamp: '08:40:02 AM',
      studentName: 'Jordan T.',
      studentId: 'ANON_LRN_108',
      actionSummary: 'AI Auto-Scaffolded Lexile Level',
      plainEnglishReason: 'Lexile readability lowered to 500L (Foundational) following 2 incorrect ratio choices.',
      sourceCitation: 'Illustrative Math Grade 7 Unit 2 Lesson 2',
      type: 'AI_SCAFFOLD',
      hash: 'sha256_3c71e89f...'
    }
  ]);

  const [auditFilter, setAuditFilter] = useState<string>('ALL');

  const selectedScreenSpec: TeacherUxScreenSpec = TEACHER_UX_SCREENS.find(s => s.id === selectedScreenId) || TEACHER_UX_SCREENS[0];

  const handleApplyOverride = () => {
    // Update student state
    const newBkt = overrideType === 'mastery' ? 0.85 : 0.75;
    const newStatus = newBkt >= 0.80 ? 'Mastered (Overridden)' : 'Developing (Overridden)';
    
    setStudents(prev => prev.map(s => {
      if (s.id === selectedStudentForOverride.id) {
        return { ...s, bkt: newBkt, status: newStatus, misconception: 'None (Teacher Overridden)', stuckMins: 0 };
      }
      return s;
    }));

    // Append new plain-language audit log item
    const newAuditItem = {
      id: `aud_${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      studentName: selectedStudentForOverride.name,
      studentId: selectedStudentForOverride.id,
      actionSummary: `Teacher Overrode BKT Mastery (${selectedStudentForOverride.bkt} → ${newBkt})`,
      plainEnglishReason: `Teacher manually recalibrated mastery level to ${newBkt}. Reason note: "${overrideNote}". AI Tutor will advance learner to Unit 2.2.`,
      sourceCitation: 'Teacher Directive (FR-14 Override)',
      type: 'TEACHER_OVERRIDE',
      hash: `sha256_${Math.random().toString(16).substring(2, 10)}...`
    };

    setAuditLogStream([newAuditItem, ...auditLogStream]);
    setShowOverrideModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Teacher UX Service Identity & PM/Designer Badges */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1">
                <Users className="w-3 h-3 text-indigo-400" />
                <span>UX Designer & PM Spec</span>
              </span>
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1">
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Comprehension Time: &lt; 45 Seconds</span>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold rounded-full flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>FR-14 & FR-16 Compliance</span>
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white mt-2">
              {TEACHER_UX_SUMMARY.title}
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed mt-1">
              {TEACHER_UX_SUMMARY.targetAudience} Designed to give teachers instant scannability, zero-hunting problem flagging, plain-language AI explanation audit trails, and 1-click overrides with downstream effect previews.
            </p>
          </div>

          {/* Time-to-Comprehension Target Indicators */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Class Overview</span>
              <span className="text-xs font-bold text-emerald-400">42s (Goal &lt;60s)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Audit Comprehension</span>
              <span className="text-xs font-bold text-cyan-300">18s (Goal &lt;30s)</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right min-w-[130px]">
              <span className="text-[10px] text-slate-500 uppercase font-mono block">1-Click Override</span>
              <span className="text-xs font-bold text-purple-400">1 Click Away</span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveSubTab('prototype')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'prototype'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive Teacher UX Prototype Canvas</span>
          </button>

          <button
            onClick={() => setActiveSubTab('screens')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'screens'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Screen-by-Screen Breakdown (4)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('override_flow')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'override_flow'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Override Flow & Downstream Effect</span>
          </button>

          <button
            onClick={() => setActiveSubTab('traceability')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'traceability'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Traceability & Time-to-Comprehension</span>
          </button>

          <button
            onClick={() => setActiveSubTab('checklist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeSubTab === 'checklist'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Human Review Checklist</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE PROTOTYPE CANVAS */}
      {activeSubTab === 'prototype' && (
        <div className="space-y-6">
          
          {/* Prototype Control Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>Live Interactive Prototype Canvas:</span>
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Simulate zero-hunting flags, FERPA mask mode, 1-click overrides, and plain-language audit trails.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* FERPA Anonymize Toggle */}
              <button
                onClick={() => setIsFerpaAnonymized(!isFerpaAnonymized)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center space-x-1.5 transition-all ${
                  isFerpaAnonymized
                    ? 'bg-purple-600/30 text-purple-200 border-purple-500'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isFerpaAnonymized ? <EyeOff className="w-3.5 h-3.5 text-purple-300" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                <span>FERPA Anonymize: {isFerpaAnonymized ? 'ON (Masked)' : 'OFF (Visible)'}</span>
              </button>

              {/* Priority Alert Toggle */}
              <button
                onClick={() => setHasPriorityAlert(!hasPriorityAlert)}
                className={`px-3 py-1.5 rounded-lg border font-bold flex items-center space-x-1.5 transition-all ${
                  hasPriorityAlert
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Priority Alert Flag: {hasPriorityAlert ? 'Active' : 'Cleared'}</span>
              </button>
            </div>
          </div>

          {/* Top Priority Alert Banner (Zero Hunting) */}
          {hasPriorityAlert && (
            <div className="bg-amber-950/60 border border-amber-500/50 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-bounce" />
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold rounded uppercase">
                      Zero-Hunting Priority Flag
                    </span>
                    <span className="text-xs font-bold text-white">
                      Misconception Cluster Detected (2 Learners Stuck &gt;5 Mins)
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Alex M. and Jordan T. are stuck on <strong className="text-amber-300 font-mono">MIS_RATIO_ADDITIVE_ERROR</strong> during Step 2 (Explain).
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedStudentForOverride(students[0]);
                  setShowOverrideModal(true);
                }}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-1.5 flex-shrink-0"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>1-Click Group Intervention</span>
              </button>
            </div>
          )}

          {/* Classroom Roster & Quick Action Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>Classroom Roster &amp; BKT Mastery Tracking (Grade 7 - Period 3)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real-time BKT mastery probabilities ($p(L)$), detected misconceptions, and 1-click teacher override triggers.
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  <span>Mastered (&ge;0.80)</span>
                </span>
                <span className="flex items-center space-x-1 ml-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  <span>Developing (0.50-0.79)</span>
                </span>
                <span className="flex items-center space-x-1 ml-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                  <span>Needs Support (&lt;0.50)</span>
                </span>
              </div>
            </div>

            {/* Roster Cards Grid */}
            <div className="grid grid-cols-1 gap-3">
              {students.map((std) => {
                const displayName = isFerpaAnonymized ? std.id : std.name;
                const isNeedsSupport = std.bkt < 0.50;
                
                return (
                  <div 
                    key={std.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isNeedsSupport 
                        ? 'bg-rose-950/20 border-rose-500/40 shadow-md' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs font-mono border ${
                        std.bkt >= 0.80 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                        std.bkt >= 0.50 ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {Math.round(std.bkt * 100)}%
                      </div>

                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-white">{displayName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({std.id})</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            std.bkt >= 0.80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            std.bkt >= 0.50 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {std.status}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-slate-400">
                          <span>Misconception: <strong className="text-slate-300 font-mono">{std.misconception}</strong></span>
                          {std.stuckMins > 0 && (
                            <span className="text-amber-400 font-bold flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>Stuck {std.stuckMins} mins</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* 1-Click Override Action Button */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          setSelectedStudentForOverride(std);
                          setShowOverrideModal(true);
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow-md transition-all flex items-center space-x-1.5 border border-indigo-400/30"
                      >
                        <Sliders className="w-3.5 h-3.5 text-indigo-200" />
                        <span>1-Click Override</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Plain-Language Cryptographic Audit Trail Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Plain-Language Cryptographic Audit Trail (Under 30s Comprehension)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Translates every AI prompt, RAG source, misconception tag, and teacher override into plain English (&lt;30s reading time).
                </p>
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center space-x-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                  className="bg-slate-950 text-slate-300 font-bold px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none"
                >
                  <option value="ALL">All Event Types</option>
                  <option value="TEACHER_OVERRIDE">Teacher Overrides Only</option>
                  <option value="AI_DIAGNOSIS">AI Diagnoses</option>
                  <option value="AI_SCAFFOLD">AI Lexile Scaffolds</option>
                </select>
              </div>
            </div>

            {/* Audit Stream List */}
            <div className="space-y-3">
              {auditLogStream
                .filter(item => auditFilter === 'ALL' || item.type === auditFilter)
                .map((log) => {
                  const studentDisplay = isFerpaAnonymized ? log.studentId : log.studentName;
                  const isTeacherOverride = log.type === 'TEACHER_OVERRIDE';

                  return (
                    <div 
                      key={log.id} 
                      className={`p-4 rounded-xl border text-xs space-y-2 transition-all ${
                        isTeacherOverride 
                          ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg' 
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase border ${
                            isTeacherOverride 
                              ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          }`}>
                            {log.type}
                          </span>
                          <span className="font-bold text-white text-sm">{studentDisplay}</span>
                          <span className="text-slate-500 text-[11px] font-mono">({log.timestamp})</span>
                        </div>

                        <div className="flex items-center space-x-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>{log.hash}</span>
                        </div>
                      </div>

                      {/* Plain-Language Reason Card */}
                      <p className="text-slate-200 text-xs leading-relaxed pl-2 border-l-2 border-indigo-500">
                        {log.plainEnglishReason}
                      </p>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
                        <span>Source: <strong className="text-indigo-300">{log.sourceCitation}</strong></span>
                        <span className="text-slate-500">Comprehension Time: ~18s</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* OVERRIDE CONTROLS & DOWNSTREAM EFFECT MODAL (Interactive) */}
          {showOverrideModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl p-6 max-w-xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
                
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="text-base font-bold text-white">1-Click Teacher Override Control</h3>
                      <p className="text-xs text-slate-400">Target Learner: <strong className="text-indigo-300">{selectedStudentForOverride.name} ({selectedStudentForOverride.id})</strong></p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowOverrideModal(false)}
                    className="text-slate-400 hover:text-white font-bold text-xs p-1"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Current State vs Override Options */}
                <div className="space-y-4 text-xs">
                  
                  {/* Current AI Recommendation */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Current AI Recommendation:</span>
                    <p className="text-slate-200 font-medium">
                      Present Foundational Lexile 500L Scaffolded Ratio Problem (BKT p(L) = {selectedStudentForOverride.bkt}).
                    </p>
                  </div>

                  {/* Override Action Selection */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-300 block uppercase font-mono text-[11px]">Select Teacher Override Action:</span>
                    
                    <label className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer hover:border-indigo-500/50">
                      <input 
                        type="radio" 
                        name="override_type"
                        checked={overrideType === 'mastery'}
                        onChange={() => setOverrideType('mastery')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="font-bold text-white block">Force Concept Mastery (Recalibrate BKT to 0.85)</span>
                        <span className="text-slate-400 text-[11px]">Advancement override: Student demonstrated understanding offline.</span>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800 cursor-pointer hover:border-indigo-500/50">
                      <input 
                        type="radio" 
                        name="override_type"
                        checked={overrideType === 'lexile'}
                        onChange={() => setOverrideType('lexile')}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <span className="font-bold text-white block">Assign Standard Lexile Reading Scaffold (750L)</span>
                        <span className="text-slate-400 text-[11px]">Language scaffold override: Adjust readability without changing math score.</span>
                      </div>
                    </label>
                  </div>

                  {/* Teacher Reason Note */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300 block uppercase font-mono text-[11px]">Teacher Reason Note (Recorded in Audit Log):</label>
                    <input 
                      type="text"
                      value={overrideNote}
                      onChange={(e) => setOverrideNote(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  {/* DOWNSTREAM EFFECT PREVIEW CARD */}
                  <div className="bg-indigo-950/80 border border-indigo-500/50 p-4 rounded-xl space-y-2">
                    <div className="flex items-center space-x-1.5 text-cyan-300 font-bold">
                      <Zap className="w-4 h-4" />
                      <span>Explicit Downstream Effect Preview:</span>
                    </div>
                    <ul className="space-y-1 text-slate-200 list-disc list-inside leading-relaxed text-[11px]">
                      <li>BKT Mastery score increases from <strong>{selectedStudentForOverride.bkt}</strong> &rarr; <strong>{overrideType === 'mastery' ? '0.85 (Mastered)' : '0.75 (Developing)'}</strong>.</li>
                      <li>AI Tutor will skip remedial items and present <strong>Unit 2.2: Unit Rates</strong> on student's next login.</li>
                      <li>Creates immutable cryptographic audit log item <strong className="font-mono text-purple-300">AUDIT_TEACHER_OVERRIDE</strong>.</li>
                    </ul>
                  </div>

                </div>

                {/* Modal Footer Actions */}
                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setShowOverrideModal(false)}
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyOverride}
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg border border-indigo-400/30 flex items-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm &amp; Commit Override</span>
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 2: SCREEN-BY-SCREEN BREAKDOWN */}
      {activeSubTab === 'screens' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Screen Selector */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
              Teacher Dashboard UX Screens
            </h3>

            <div className="space-y-2">
              {TEACHER_UX_SCREENS.map((scr) => {
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
                        {scr.screenName}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        {scr.estimatedComprehensionTime}
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

          {/* Right Column: Screen Inspector */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              
              {/* Screen Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-mono text-xs font-bold rounded">
                      {selectedScreenSpec.screenName}
                    </span>
                    <h3 className="text-base font-bold text-white">{selectedScreenSpec.screenTitle}</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedScreenSpec.purpose}
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-right flex-shrink-0">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Comprehension Target</span>
                  <span className="text-xs font-bold text-emerald-400">{selectedScreenSpec.estimatedComprehensionTime}</span>
                </div>
              </div>

              {/* Key UI Elements */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono block">
                  Key UI Elements &amp; Layout Components
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {selectedScreenSpec.keyElements.map((elem, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                      <span>{elem}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Plain-Language Audit Trail Approach */}
              <div className="bg-indigo-950/60 border border-indigo-500/40 p-4 rounded-xl space-y-1">
                <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block">
                  Plain-Language Audit Rendering Approach:
                </span>
                <p className="text-xs text-white leading-relaxed">
                  {selectedScreenSpec.plainLanguageAuditApproach}
                </p>
              </div>

              {/* States Breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-xs font-bold text-slate-400 uppercase font-mono block">
                  Designed Screen States
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-emerald-400 font-mono font-bold block">Normal Active State</span>
                    <p className="text-slate-300">{selectedScreenSpec.states.normal}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-mono font-bold block">Priority Alert State</span>
                    <p className="text-slate-300">{selectedScreenSpec.states.alertPriority}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-purple-400 font-mono font-bold block">FERPA Anonymized State</span>
                    <p className="text-slate-300">{selectedScreenSpec.states.privacyAnonymized}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-cyan-400 font-mono font-bold block">Post-Override State</span>
                    <p className="text-slate-300">{selectedScreenSpec.states.postOverride}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 3: OVERRIDE FLOW */}
      {activeSubTab === 'override_flow' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <span>1-Click Override Interaction Flow (Before / After States)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Step-by-step state machine describing teacher override triggers, downstream effect previews, BKT recalibration, and audit log commits.
            </p>
          </div>

          <div className="space-y-4">
            {TEACHER_OVERRIDE_FLOW.map((flow) => (
              <div key={flow.stepNumber} className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-mono text-xs font-bold flex items-center justify-center">
                      {flow.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white">{flow.stepTitle}</h4>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">Before State:</span>
                    <p className="text-slate-300 leading-relaxed">{flow.beforeState}</p>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] text-cyan-400 font-mono uppercase font-bold block">Teacher Action:</span>
                    <p className="text-slate-300 leading-relaxed">{flow.teacherAction}</p>
                  </div>
                </div>

                <div className="bg-indigo-950/60 p-3.5 rounded-lg border border-indigo-500/40 space-y-1 text-xs">
                  <span className="text-[10px] text-purple-300 font-mono uppercase font-bold block">Explicit Downstream Effect:</span>
                  <p className="text-white leading-relaxed">{flow.downstreamEffect}</p>
                </div>

                {flow.auditLogGenerated !== 'N/A — Action initiated.' && (
                  <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-500/30">
                    Audit Log Committed: {flow.auditLogGenerated}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TRACEABILITY & TIME TO COMPREHENSION */}
      {activeSubTab === 'traceability' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Traceability Table (Screen / Element &rarr; FR &amp; Time-to-Comprehension)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Verifies every UI element traces directly to PRD Functional Requirements (FR-14 through FR-16) and respects the &lt; 1 minute class comprehension goal.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <th className="p-3">Screen / UI Element</th>
                  <th className="p-3">Functional Requirement (FR)</th>
                  <th className="p-3">Safeguard / Policy</th>
                  <th className="p-3">Time-to-Comprehension</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {TEACHER_UX_TRACEABILITY.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50">
                    <td className="p-3 font-bold text-white">{row.screenOrElement}</td>
                    <td className="p-3 font-mono text-indigo-300">{row.functionalRequirement}</td>
                    <td className="p-3 leading-relaxed">{row.safeguardOrPolicy}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{row.timeToComprehend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CHECKLIST FOR HUMAN REVIEW */}
      {activeSubTab === 'checklist' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Checklist for Human Review &amp; Compliance Sign-Off</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mandatory quality bar items verified before teacher dashboard production deployment.
              </p>
            </div>

            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold rounded-lg">
              5 / 5 Verified ✓
            </span>
          </div>

          <div className="space-y-3">
            {TEACHER_UX_HUMAN_CHECKLIST.map((item) => (
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
