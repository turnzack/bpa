import React, { useEffect, useState } from 'react';
import { Cpu, Sparkles } from 'lucide-react';
import { safeFetch } from '../../lib/bridgeClient';

export const Header: React.FC = () => {
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await safeFetch("http://localhost:5006/api/config/apikey");
        if (res && res.ok) {
          setIsBackendOnline(true);
        } else {
          setIsBackendOnline(false);
        }
      } catch (e) {
        setIsBackendOnline(false);
      }
    };
    checkBackend();
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-zinc-800/80 px-6 py-4 mb-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[1px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                V0-GUEST <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Hermes PRD Pack Engine</span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 font-medium">Générateur autonome de Packs PRD (3 fichiers : README.md, inject.js, manifest.json)</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-zinc-300">Agent: <strong className="text-purple-300">Cloud AI (Qwen 3 30B / DeepSeek)</strong></span>
          </div>

          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
            isBackendOnline 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
              : "bg-amber-500/10 border-amber-500/30 text-amber-400"
          }`}>
            <span className={`w-2 h-2 rounded-full ${isBackendOnline ? "bg-emerald-400 animate-ping" : "bg-amber-400"}`} />
            {isBackendOnline ? "Moteur Connecté (Port 5006)" : "Mode Web Cloud SaaS"}
          </div>
        </div>
      </div>
    </header>
  );
};
