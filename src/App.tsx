/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureDocView } from './components/ArchitectureDocView';
import { ApiSpecContractView } from './components/ApiSpecContractView';
import { LearnerUxSpecView } from './components/LearnerUxSpecView';
import { CopilotSimulatorView } from './components/CopilotSimulatorView';
import { TeacherDashboardView } from './components/TeacherDashboardView';
import { SchemaWorkbenchView } from './components/SchemaWorkbenchView';
import { TraceabilityMatrixView } from './components/TraceabilityMatrixView';
import { DiagnosticResult, AuditLogItem } from './types';
import { ShieldCheck, Cpu, Code2, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'spec' | 'api-spec' | 'ux-spec' | 'simulator' | 'teacher' | 'schemas' | 'matrix'>('spec');
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [offlineQueue, setOfflineQueue] = useState<DiagnosticResult[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);

  const addAuditLog = (item: AuditLogItem) => {
    setAuditLogs(prev => [item, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOfflineSimulated={isOfflineSimulated}
        setIsOfflineSimulated={setIsOfflineSimulated}
        offlineQueueLength={offlineQueue.length}
      />

      {/* Main Container Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'spec' && <ArchitectureDocView />}
        {activeTab === 'api-spec' && <ApiSpecContractView />}
        {activeTab === 'ux-spec' && <LearnerUxSpecView />}
        {activeTab === 'simulator' && (
          <CopilotSimulatorView
            isOfflineSimulated={isOfflineSimulated}
            setIsOfflineSimulated={setIsOfflineSimulated}
            offlineQueue={offlineQueue}
            setOfflineQueue={setOfflineQueue}
            addAuditLog={addAuditLog}
          />
        )}
        {activeTab === 'teacher' && <TeacherDashboardView auditLogs={auditLogs} />}
        {activeTab === 'schemas' && <SchemaWorkbenchView />}
        {activeTab === 'matrix' && <TraceabilityMatrixView />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-white">Adaptive Learning Copilot Architecture</span>
            <span className="text-slate-600">•</span>
            <span>EdTech Systems Engineering Spec v1.0</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-500">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300 font-medium">FERPA & COPPA Compliant</span>
            </span>
            <span>•</span>
            <span>Gemini 3.6 Flash Server-Side Proxy</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
