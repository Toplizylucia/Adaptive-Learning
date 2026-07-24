import React from 'react';
import { 
  BookOpen, 
  Cpu, 
  LayoutDashboard, 
  Code2, 
  CheckSquare, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Sparkles,
  Layers,
  Server,
  Users,
  BrainCircuit,
  ShieldAlert,
  Scale,
  Presentation
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'spec' | 'api-spec' | 'ux-spec' | 'diagnostic-taxonomy' | 'qa-test-plan' | 'security-compliance' | 'pm-demo' | 'simulator' | 'teacher' | 'schemas' | 'matrix';
  setActiveTab: (tab: 'spec' | 'api-spec' | 'ux-spec' | 'diagnostic-taxonomy' | 'qa-test-plan' | 'security-compliance' | 'pm-demo' | 'simulator' | 'teacher' | 'schemas' | 'matrix') => void;
  isOfflineSimulated: boolean;
  setIsOfflineSimulated: (val: boolean) => void;
  offlineQueueLength: number;
}


export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isOfflineSimulated,
  setIsOfflineSimulated,
  offlineQueueLength
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/20">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  Adaptive Learning Copilot
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Arch v1.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Technical System Architecture & Real-Time Classroom Simulator
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700/50">
            <button
              onClick={() => setActiveTab('spec')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'spec'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>System Spec</span>
            </button>

            <button
              onClick={() => setActiveTab('api-spec')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'api-spec'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Server className="w-4 h-4 text-cyan-400" />
              <span>API Contract</span>
            </button>

            <button
              onClick={() => setActiveTab('ux-spec')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ux-spec'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4 text-purple-400" />
              <span>UX Spec</span>
            </button>

            <button
              onClick={() => setActiveTab('diagnostic-taxonomy')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'diagnostic-taxonomy'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BrainCircuit className="w-4 h-4 text-amber-400" />
              <span>Diagnostic Spec</span>
            </button>

            <button
              onClick={() => setActiveTab('qa-test-plan')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'qa-test-plan'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>QA Plan</span>
            </button>

            <button
              onClick={() => setActiveTab('security-compliance')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'security-compliance'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Security Compliance</span>
            </button>

            <button
              onClick={() => setActiveTab('pm-demo')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'pm-demo'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Presentation className="w-4 h-4 text-indigo-400" />
              <span>PM Stakeholder Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Live Simulator</span>
              {offlineQueueLength > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 font-bold rounded-full text-[10px]">
                  {offlineQueueLength}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('teacher')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'teacher'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Teacher Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('schemas')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'schemas'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>JSON Schemas</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'matrix'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>Traceability Matrix</span>
            </button>
          </nav>

          {/* Quick Status Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Offline Simulation Toggle */}
            <button
              onClick={() => setIsOfflineSimulated(!isOfflineSimulated)}
              className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isOfflineSimulated
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
              title="Simulate Low Connectivity / Offline Classroom"
            >
              {isOfflineSimulated ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Online (TLS 1.3)</span>
                </>
              )}
            </button>

            {/* AI Engine Pill */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 rounded-lg text-xs border border-slate-700 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-semibold text-white">Gemini 3.6 Flash</span>
            </div>

          </div>
        </div>

        {/* Mobile Nav Menu Bar */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('spec')}
            className={`px-2 py-1 rounded ${activeTab === 'spec' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Spec
          </button>
          <button
            onClick={() => setActiveTab('api-spec')}
            className={`px-2 py-1 rounded ${activeTab === 'api-spec' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            API Contract
          </button>
          <button
            onClick={() => setActiveTab('ux-spec')}
            className={`px-2 py-1 rounded ${activeTab === 'ux-spec' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            UX Spec
          </button>
          <button
            onClick={() => setActiveTab('diagnostic-taxonomy')}
            className={`px-2 py-1 rounded ${activeTab === 'diagnostic-taxonomy' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Diagnostic
          </button>
          <button
            onClick={() => setActiveTab('qa-test-plan')}
            className={`px-2 py-1 rounded ${activeTab === 'qa-test-plan' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            QA Plan
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-2 py-1 rounded ${activeTab === 'simulator' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Simulator
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-2 py-1 rounded ${activeTab === 'teacher' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('schemas')}
            className={`px-2 py-1 rounded ${activeTab === 'schemas' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Schemas
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-2 py-1 rounded ${activeTab === 'matrix' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            Traceability
          </button>
        </div>

      </div>
    </header>
  );
};
