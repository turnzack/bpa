import { Check, Loader2, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CreationStep, StepStatus } from "@/lib/pipeline-types";

const STEPS: { id: CreationStep; label: string }[] = [
  { id: "project_name", label: "Projet" },
  { id: "prd_pack", label: "Pack PRD" },
  { id: "auto_selection", label: "Modules" },
  { id: "stitch_injection", label: "Stitch Prompt" },
  { id: "stitch_zip", label: "ZIP Stitch" },
  { id: "pipeline", label: "Pipeline" },
  { id: "finalize", label: "Finalisation" },
];

export function StepperBar({
  currentStep,
  steps,
  onStepClick,
}: {
  currentStep: CreationStep;
  steps: Record<CreationStep, StepStatus>;
  onStepClick: (step: CreationStep) => void;
}) {
  return (
    <div className="flex w-full items-center justify-between">
      {STEPS.map((step, idx) => {
        const status = steps[step.id];
        const isActive = currentStep === step.id;
        const isPassed = status === "passed";
        
        return (
          <div key={step.id} className="flex flex-col items-center gap-2 flex-1">
            <div className="flex w-full items-center">
              <div
                className={cn("h-px flex-1", idx === 0 ? "invisible" : "", isPassed ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-800")}
              />
              <button
                disabled={status === "locked"}
                onClick={() => onStepClick(step.id)}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isPassed
                    ? "border-primary bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                    : status === "running"
                    ? "border-amber-500 bg-amber-500/20 text-amber-500"
                    : status === "failed"
                    ? "border-destructive bg-destructive/20 text-destructive cursor-pointer"
                    : "border-zinc-200 bg-transparent text-zinc-400 dark:border-zinc-800",
                )}
              >
                {status === "passed" ? (
                  <Check className="size-4" />
                ) : status === "running" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : status === "locked" ? (
                  <Lock className="size-3" />
                ) : status === "failed" ? (
                  <X className="size-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </button>
              <div
                className={cn("h-px flex-1", idx === STEPS.length - 1 ? "invisible" : "", isPassed ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-800")}
              />
            </div>
            <span
              className={cn(
                "text-[10px] uppercase font-semibold text-center whitespace-nowrap",
                isActive ? "text-primary" : isPassed ? "text-zinc-600 dark:text-zinc-400" : "text-zinc-400 dark:text-zinc-600"
              )}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
