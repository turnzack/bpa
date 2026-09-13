export type CreationStep =
  | "project_name"      // Phase 0
  | "boilerplate"       // Phase 1 auto
  | "prd_pack"          // Phase 1 — IdeaInput + Pack PRD
  | "auto_selection"    // Phase 2 — IndustrialBrickSelector
  | "stitch_injection"  // Phase 3 — Mega Prompt → Stitch
  | "stitch_zip"        // Phase 4 — Charger ZIP
  | "pipeline"          // Phase 5-7 — Multi-batch + Câblage + Indus
  | "finalize"          // Phase 8 — Preview + Grade

export type StepStatus = "locked" | "ready" | "running" | "passed" | "blocked" | "failed"
export type IngestionMode = "text" | "folder" | "web" | "designrip" | "phase5"
export type ProjectGrade = "NOT_CERTIFIED" | "GOLD" | "DIAMOND"
export type PipelinePhase = "phase1" | "phase2_multi" | "phase3_4_cablage" | "phase5_indus"

export interface PipelineWorkflowState {
  currentStep: CreationStep
  steps: Record<CreationStep, StepStatus>
  projectId: string
  projectType: "saas" | "showcase" | "game" | "mobile" | "ai"
  guestPack: string | null       // nom dossier prd_packs/guest_xxx
  stitchZip: string | null       // nom du fichier .zip chargé
  pipelineJobId: string | null
  activePipelinePhase: PipelinePhase | null
  grade: ProjectGrade
  status: "draft" | "preview_ready" | "production_candidate" | "promoted"
  error: string | null
  // Liaison Prisma (côté PRD)
  prismaProjectId: string | null // ID projet créé dans Prisma
}
