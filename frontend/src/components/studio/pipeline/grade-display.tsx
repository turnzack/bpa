import { Badge } from "@/components/ui/badge";
import { Trophy, ShieldAlert, FileWarning, CheckCircle } from "lucide-react";

export function GradeDisplay({ grade }: { grade: string }) {
  if (grade === "DIAMOND") {
    return (
      <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-center animate-in fade-in zoom-in">
        <Trophy className="size-10 text-cyan-400 mb-2 drop-shadow-md" />
        <div className="text-cyan-100 font-black text-xl tracking-wider">GRADE DIAMOND</div>
        <p className="text-cyan-400/80 text-xs mt-1">Audit Zero-Touch 100% Validé. Production autorisée.</p>
      </div>
    );
  }

  if (grade === "GOLD") {
    return (
      <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-center">
        <CheckCircle className="size-10 text-amber-400 mb-2 drop-shadow-md" />
        <div className="text-amber-100 font-black text-xl tracking-wider">GRADE GOLD</div>
        <p className="text-amber-400/80 text-xs mt-1">Validé avec avertissements mineurs. Vérification conseillée.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-zinc-500/30 bg-zinc-950/20 text-center opacity-50">
      <ShieldAlert className="size-8 text-zinc-500 mb-2" />
      <div className="text-zinc-300 font-bold tracking-wider">NON CERTIFIÉ</div>
      <p className="text-zinc-500 text-xs mt-1">Le projet doit passer le pipeline d'audit.</p>
    </div>
  );
}
