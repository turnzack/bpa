import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Folder, Layers, Zap, Lightbulb, ArrowRight, RefreshCw } from 'lucide-react';

export interface AnalysisProposal {
  extractedConcept: string;
  nicheTitle: string;
  summary: string;
  keyFeatures: string[];
  enrichments: string[];
  proposedFolderName: string;
  proposedModules: { name: string; description: string }[];
}

interface ProposalViewerProps {
  proposal: AnalysisProposal;
  onConfirm: (folderName: string, enrichedIdea: string) => void;
  onReset: () => void;
  isGenerating: boolean;
}

export const ProposalViewer: React.FC<ProposalViewerProps> = ({
  proposal,
  onConfirm,
  onReset,
  isGenerating
}) => {
  const [folderName, setFolderName] = useState(proposal.proposedFolderName || 'guest_nouveau_projet');

  const handleConfirm = () => {
    const enrichedIdea = `CONCEPT : ${proposal.extractedConcept} | NICHE ENRICHIE : ${proposal.nicheTitle} | RÉSUMÉ : ${proposal.summary}`;
    onConfirm(folderName, enrichedIdea);
  };

  return (
    <div className="space-y-8 my-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 border border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.1)] group">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-blue-900/20 to-purple-950/40 opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }} />
        
        {/* Glow orb */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Intelligence Hermes
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          </div>

          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 mt-2 tracking-tight">
            {proposal.nicheTitle}
          </h2>
          
          <div className="mt-6 flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-colors duration-300">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30 shrink-0">
              <Lightbulb className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-400/80 uppercase tracking-widest mb-1">Concept Décrypté</h4>
              <p className="text-base text-zinc-100 font-medium leading-relaxed">{proposal.extractedConcept}</p>
            </div>
          </div>

          <p className="text-sm text-cyan-100/70 mt-6 leading-relaxed max-w-4xl font-medium">
            {proposal.summary}
          </p>
        </div>
      </div>

      {/* Grid Features & Enrichments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Extracted Features */}
        <div className="relative overflow-hidden rounded-3xl p-6 border border-emerald-500/20 bg-emerald-950/10 hover:bg-emerald-950/20 transition-all duration-500 group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
          
          <h3 className="relative z-10 text-sm font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            Base Métier Identifiée
          </h3>
          <ul className="relative z-10 space-y-3">
            {(proposal.keyFeatures || []).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-3 group/item">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:bg-emerald-500/20 transition-all">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-sm text-zinc-300 font-medium group-hover/item:text-white transition-colors">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Niche Enrichments */}
        <div className="relative overflow-hidden rounded-3xl p-6 border border-purple-500/20 bg-purple-950/10 hover:bg-purple-950/20 transition-all duration-500 group">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-32 -mb-32 transition-transform duration-700 group-hover:scale-150" />
          
          <h3 className="relative z-10 text-sm font-black uppercase tracking-widest text-purple-400 mb-6 flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            Élévation Architecturale (Staff Engineer)
          </h3>
          <ul className="relative z-10 space-y-3">
            {(proposal.enrichments || []).map((enr, idx) => (
              <li key={idx} className="flex items-start gap-3 group/item">
                <div className="mt-0.5 w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover/item:scale-110 group-hover/item:bg-purple-500/20 transition-all">
                  <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <span className="text-sm text-zinc-300 font-medium group-hover/item:text-white transition-colors">{enr}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 10 Proposed Modules */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-cyan-500/30" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400 flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-950/30 border border-cyan-500/20">
            <Layers className="w-4 h-4" />
            Matrice des {proposal.proposedModules?.length || 10} Modules Cibles
          </h3>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-cyan-500/30" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(proposal.proposedModules || []).map((mod, i) => (
            <div key={i} className="group relative p-5 rounded-2xl bg-zinc-950/50 border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-950/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(34,211,238,0.1)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-mono text-[11px] font-black text-cyan-500 mb-2 break-words group-hover:text-cyan-300 transition-colors">
                {mod.name}
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">{mod.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Final Action & Folder Validation Bar */}
      <div className="relative overflow-hidden rounded-3xl p-2 border border-cyan-500/20 bg-zinc-950/80 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4">
          
          <div className="flex items-center gap-4 w-full md:w-auto bg-black/40 px-5 py-3 rounded-2xl border border-white/5">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              <Folder className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1 md:w-64">
              <label className="block text-[10px] font-bold text-cyan-500/70 mb-1 uppercase tracking-widest">
                Pack Destination
              </label>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value.toLowerCase().replace(/[^a-z0-9_]+/g, '_'))}
                className="w-full bg-transparent text-cyan-100 font-mono text-sm placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                placeholder="nom_du_dossier"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={onReset}
              disabled={isGenerating}
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Ré-analyser
            </button>

            <button
              onClick={handleConfirm}
              disabled={isGenerating}
              className="px-8 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black flex items-center gap-3 transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_rgba(34,211,238,0.5)] hover:scale-105 active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Génération des 3 Fichiers...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  CONFIRMER LE PACK PRD
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
