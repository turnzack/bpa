import { useEffect, useRef } from "react";
import { Terminal, Copy, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PipelineLogViewer({ logs }: { logs: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join("\n"));
  };

  return (
    <div className="flex flex-col h-full rounded-md border bg-black text-green-400 font-mono text-xs shadow-inner overflow-hidden relative">
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-zinc-400" />
          <span className="text-zinc-300 font-semibold text-[10px] uppercase tracking-wider">Console Moteur</span>
        </div>
        <Button size="icon" variant="ghost" onClick={copyLogs} className="size-6 text-zinc-500 hover:text-white">
          <Copy className="size-3" />
        </Button>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-1">
        {logs.length === 0 ? (
          <div className="text-zinc-600 italic">En attente de logs...</div>
        ) : (
          logs.map((log, idx) => {
            let colorClass = "text-green-400";
            if (log.includes("❌") || log.includes("Error") || log.includes("⚠️")) colorClass = "text-red-400";
            else if (log.includes("✅") || log.includes("💎")) colorClass = "text-emerald-400";
            else if (log.includes("💡") || log.includes("🚀") || log.includes("⚡")) colorClass = "text-cyan-400";

            return (
              <div key={idx} className={`leading-relaxed break-all ${colorClass}`}>
                {log}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
