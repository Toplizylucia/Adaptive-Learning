import React, { useState } from 'react';
import { Code2, Copy, Check, FileCode, Layers, ShieldCheck } from 'lucide-react';

const SCHEMAS = {
  learner_profile: {
    title: 'Learner Profile JSON Schema (FR-6)',
    description: 'Defines BKT mastery vectors, misconception history, accessibility preferences, and anonymized hash IDs.',
    jsonSchema: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LearnerProfile",
  "type": "object",
  "required": [
    "learnerId",
    "piiScrubbedId",
    "schoolId",
    "masteryVector",
    "misconceptionHistory"
  ],
  "properties": {
    "learnerId": {
      "type": "string",
      "pattern": "^lrn_[a-z0-9_]+$"
    },
    "piiScrubbedId": {
      "type": "string",
      "pattern": "^ANON_LRN_[0-9]+$"
    },
    "schoolId": { "type": "string" },
    "gradeLevel": { "type": "integer", "minimum": 1, "maximum": 12 },
    "masteryVector": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "required": ["skillId", "masteryProbability", "attemptsCount"],
        "properties": {
          "skillId": { "type": "string" },
          "masteryProbability": { "type": "number", "minimum": 0.0, "maximum": 1.0 },
          "attemptsCount": { "type": "integer", "minimum": 0 },
          "lastAssessedAt": { "type": "string", "format": "date-time" }
        }
      }
    },
    "misconceptionHistory": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["tag", "frequencyCount", "resolved"],
        "properties": {
          "tag": { "type": "string" },
          "description": { "type": "string" },
          "frequencyCount": { "type": "integer", "minimum": 1 },
          "lastObservedAt": { "type": "string", "format": "date-time" },
          "resolved": { "type": "boolean" }
        }
      }
    }
  }
}`
  },
  curriculum_content: {
    title: 'Curriculum Content Store JSON Schema (FR-4)',
    description: 'Defines curriculum taxonomy nodes, prerequisite relationships, common misconception rubrics, and practice questions.',
    jsonSchema: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "CurriculumNode",
  "type": "object",
  "required": [
    "id",
    "title",
    "subject",
    "gradeLevel",
    "learningObjective",
    "prerequisites",
    "questions"
  ],
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "subject": { "type": "string" },
    "gradeLevel": { "type": "integer" },
    "learningObjective": { "type": "string" },
    "prerequisites": { "type": "array", "items": { "type": "string" } },
    "commonMisconceptions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["tag", "description", "remediationStrategy"],
        "properties": {
          "tag": { "type": "string" },
          "description": { "type": "string" },
          "remediationStrategy": { "type": "string" }
        }
      }
    },
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "questionText", "choices", "correctChoiceId"],
        "properties": {
          "id": { "type": "string" },
          "questionText": { "type": "string" },
          "correctChoiceId": { "type": "string" },
          "choices": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "text"],
              "properties": {
                "id": { "type": "string" },
                "text": { "type": "string" },
                "misconceptionTag": { "type": "string" }
              }
            }
          }
        }
      }
    }
  }
}`
  },
  session_log: {
    title: 'Diagnostic Event & Session Log JSON Schema (FR-11)',
    description: 'Defines immutable session log records, model routing metrics, token billing, and cryptographic SHA-256 audit hashes.',
    jsonSchema: `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DiagnosticSessionLog",
  "type": "object",
  "required": [
    "eventId",
    "timestamp",
    "piiScrubbedId",
    "nodeId",
    "actionType",
    "modelRouting",
    "auditHash"
  ],
  "properties": {
    "eventId": { "type": "string" },
    "timestamp": { "type": "string", "format": "date-time" },
    "piiScrubbedId": { "type": "string" },
    "nodeId": { "type": "string" },
    "actionType": { "type": "string" },
    "isCorrect": { "type": "boolean" },
    "bktUpdates": { "type": "object" },
    "modelRouting": {
      "type": "object",
      "required": ["tier", "modelName", "latencyMs", "costUSD"],
      "properties": {
        "tier": { "type": "string" },
        "modelName": { "type": "string" },
        "latencyMs": { "type": "integer" },
        "costUSD": { "type": "number" },
        "cacheHit": { "type": "boolean" }
      }
    },
    "piiCleanStatus": { "type": "boolean" },
    "auditHash": { "type": "string" }
  }
}`
  }
};

export const SchemaWorkbenchView: React.FC = () => {
  const [activeSchemaKey, setActiveSchemaKey] = useState<keyof typeof SCHEMAS>('learner_profile');
  const [copied, setCopied] = useState<boolean>(false);

  const activeSchema = SCHEMAS[activeSchemaKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSchema.jsonSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-amber-400" />
              <h2 className="text-xl font-bold text-white">JSON Schema Workbench & Inspector</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Strict JSON schema specifications governing Learner Profiles, Curriculum Content, and Diagnostic Session Audit Logs.
            </p>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Schema Copied!' : 'Copy JSON Schema'}</span>
          </button>
        </div>

        {/* Schema Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <button
            onClick={() => setActiveSchemaKey('learner_profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSchemaKey === 'learner_profile'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Learner Profile Schema (FR-6)
          </button>

          <button
            onClick={() => setActiveSchemaKey('curriculum_content')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSchemaKey === 'curriculum_content'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Curriculum Content Schema (FR-4)
          </button>

          <button
            onClick={() => setActiveSchemaKey('session_log')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeSchemaKey === 'session_log'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Session Audit Log Schema (FR-11)
          </button>
        </div>

        {/* Schema Information & Code Editor Window */}
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
            <h3 className="font-bold text-white text-sm mb-1">{activeSchema.title}</h3>
            <p className="text-slate-400">{activeSchema.description}</p>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-inner">
            <pre>{activeSchema.jsonSchema}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
