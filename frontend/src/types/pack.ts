export type PackCategory = 
  | "health"
  | "fitness"
  | "game"
  | "productivity"
  | "ecommerce"
  | "social"
  | "education"
  | "other"
  | "phase5";

export interface PackTask {
  id?: string;
  title: string;
  description: string;
  priority?: "must-have" | "should-have" | "nice-to-have" | "high" | "medium" | "low" | string;
  status?: "planned" | string;
}

export interface GeneratedFile {
  path: string; // README.md, inject_guest_name.js, manifest.json
  language: "markdown" | "javascript" | "json" | "typescript" | "yaml" | "css" | "html" | string;
  purpose: string;
  content: string;
}

export interface GeneratedPack {
  projectName: string;
  folderName: string; // e.g. guest_tetris, guest_health_app
  title: string;
  category: PackCategory;
  ideaSummary: string;
  architectureSummary: string;
  tasks: PackTask[];
  files: GeneratedFile[]; // Flexible array of files (3 files by default, up to 8 files for Gamer Master Packs)
  extensionPoints?: string[];
  warnings?: string[];
}

// ============================================================
// TYPES PHASE 5 — Industrialisation Souveraine
// ============================================================

export interface Phase5Capability {
  id: string;
  required: boolean;
  confidence: number; // 0 to 1
  reason: string;
  evidence: string[];
}

export interface Phase5Mock {
  id: string;
  path: string;
  pattern: string;
  capability: string;
  replacementRequired: boolean;
}

export interface Phase5Decision {
  capability: string;
  provider: string | null;
  implementation: string;
  confidence: number; // 0 to 1
  reason: string;
  requiresConfirmation: boolean;
}

export interface Phase5Risk {
  level: "low" | "medium" | "high" | "critical";
  code: string;
  message: string;
}

export interface Phase5Question {
  id: string;
  question: string;
  capability: string;
  required: boolean;
}

export interface Phase5Audit {
  projectType: string;
  confidence: number; // 0 to 1
  backendRequired?: boolean;
  phase5Action?: string;
  capabilities: Phase5Capability[];
  mocks: Phase5Mock[];
  decisions: Phase5Decision[];
  filesToCreate: string[];
  filesToModify: string[];
  filesToPreserve: string[];
  risks: Phase5Risk[];
  requiresUserDecision: Phase5Question[];
}

export type Phase5Status =
  | "idle"
  | "selecting_project"
  | "auditing"
  | "proposal_ready"
  | "awaiting_decision"
  | "submitting"
  | "blocked"
  | "running"
  | "completed"
  | "failed";
