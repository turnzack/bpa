import React, { useState } from 'react';
import {
  ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Zap,
  FolderLock, FilePlus, FilePen, Eye, HelpCircle,
  Cpu, ArrowRight, Rocket, Ban, ChevronDown, ChevronUp
} from 'lucide-react';
import { Phase5Audit, Phase5Risk, Phase5Capability } from '../../types/pack';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RISK_COLORS: Record<Phase5Risk['level'], string> = {
  low:      'text-emerald-400 border-emerald-500/30 bg-emerald-950/20',
  medium:   'text-amber-400   border-amber-500/30   bg-amber-950/20',
  high:     'text-orange-400  border-orange-500/30  bg-orange-950/20',
  critical: 'text-red-400     border-red-500/30     bg-red-950/20',
};

const RISK_ICON: Record<Phase5Risk['level'], React.ReactNode> = {
  low:      <CheckCircle2  className="w-3.5 h-3.5" />,
  medium:   <AlertTriangle className="w-3.5 h-3.5" />,
  high:     <AlertTriangle className="w-3.5 h-3.5" />,
  critical: <XCircle       className="w-3.5 h-3.5" />,
};

function ConfidenceBadge({ value }: { value?: number }) {
  const pct = Math.round((value ?? 1) * 100);
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <span className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400">
      <span className={`inline-block w-2 h-2 rounded-full ${color}`} />
      {pct}% confiance
    </span>
  );
}

// ─── Sub-sections ──────────────────────────────────────────────────────────────

function CapabilityRow({ cap }: { cap: Phase5Capability }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-zinc-900/60 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cap.required ? 'bg-violet-500/20 text-violet-300' : 'bg-zinc-800 text-zinc-400'}`}>
            {cap.required ? 'REQUISE' : 'optionnelle'}
          </span>
          <span className="text-sm text-white font-mono">{cap.id}</span>
        </div>
        <div className="flex items-center gap-3">
          <ConfidenceBadge value={cap.confidence} />
          {open ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 bg-zinc-950/40 space-y-2">
          <p className="text-xs text-zinc-300">{cap.reason}</p>
          {cap.evidence.length > 0 && (
            <ul className="space-y-1">
              {cap.evidence.map((e, i) => (
                <li key={i} className="text-[11px] font-mono text-cyan-400/70">→ {e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface Phase5ProposalViewerProps {
  audit: Phase5Audit;
  sourceFolder: string;
  onConfirm: (audit: Phase5Audit) => void;
  onReset: () => void;
  isSubmitting: boolean;
}

export const Phase5ProposalViewer: React.FC<Phase5ProposalViewerProps> = ({
  audit,
  sourceFolder,
  onConfirm,
  onReset,
  isSubmitting
}) => {
  // État local pour stocker les réponses de l'utilisateur aux questions bloquantes
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const requiresUserDecision = audit.requiresUserDecision || [];
  const risks = audit.risks || [];
  const capabilities = audit.capabilities || [];
  const mocks = audit.mocks || [];
  const decisions = audit.decisions || [];
  const filesToCreate = audit.filesToCreate || [];
  const filesToModify = audit.filesToModify || [];
  const filesToPreserve = audit.filesToPreserve || [];

  // Bloqué si au moins une question critique n'a pas de réponse
  const blockedByDecision = requiresUserDecision.some(
    q => q.required && (!answers[q.id] || answers[q.id].trim() === '')
  );
  
  const criticalRisks = risks.filter(r => r.level === 'critical' || r.level === 'high');
  const hasNoCritical = criticalRisks.length === 0;

  const canConfirm = !blockedByDecision && !isSubmitting;

  const confidencePct = Math.round((audit.confidence || 0) * 100);
  const noBackend = audit.backendRequired === false;

  const handleConfirm = () => {
    // Injecter les réponses dans l'audit avant de confirmer
    const auditWithAnswers = {
      ...audit,
      requiresUserDecision: requiresUserDecision.map(q => ({
        ...q,
        answer: answers[q.id] || ''
      }))
    };
    onConfirm(auditWithAnswers as Phase5Audit);
  };

  return (
    <div className="space-y-6 my-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-3xl p-8 border border-violet-500/30 bg-violet-950/10 shadow-[0_0_60px_rgba(139,92,246,0.08)]">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/30 text-xs font-black uppercase tracking-[0.2em]">
              <Cpu className="w-4 h-4" />
              Phase 5 — Audit Souverain
            </span>
            <span className="h-px flex-1 bg-gradient-to-r from-violet-500/40 to-transparent" />
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-violet-200 to-violet-400 tracking-tight">
                {(audit.projectType || 'PROJET STANDARD').toUpperCase()}
              </h2>
              <p className="text-sm text-zinc-400 mt-1 font-mono">
                {sourceFolder.split(/[\\/]/).pop() || sourceFolder}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <ConfidenceBadge value={audit.confidence} />
              {noBackend ? (
                <span className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 font-semibold">
                  🟡 Backend non requis
                </span>
              ) : (
                <span className="text-xs px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-semibold">
                  🔌 Industrialisation complète
                </span>
              )}
            </div>
          </div>

          {noBackend && (
            <div className="mt-4 p-4 bg-zinc-900/60 border border-zinc-700 rounded-2xl text-sm text-zinc-300">
              <strong className="text-amber-400">⚠️ Ce projet n'a pas besoin de backend.</strong>
              {' '}L'action recommandée est{' '}
              <code className="text-violet-300 bg-zinc-800 px-1.5 py-0.5 rounded text-xs">
                {audit.phase5Action || 'skip_backend_integration'}
              </code>.
              Vous pouvez néanmoins confirmer pour générer le contrat.
            </div>
          )}
        </div>
      </div>

      {/* ── Grid Capacités + Mocks ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Capacités */}
        <div className="rounded-2xl border border-violet-500/20 bg-zinc-950/40 p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-violet-400 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" /> Capacités détectées ({capabilities.length})
          </h3>
          <div className="space-y-2">
            {capabilities.length === 0 ? (
              <p className="text-xs text-zinc-500">Aucune capacité détectée.</p>
            ) : (
              capabilities.map(cap => <CapabilityRow key={cap.id} cap={cap} />)
            )}
          </div>
        </div>

        {/* Mocks */}
        <div className="rounded-2xl border border-amber-500/20 bg-zinc-950/40 p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" /> Mocks à remplacer ({mocks.length})
          </h3>
          {mocks.length === 0 ? (
            <p className="text-xs text-zinc-500">Aucun mock détecté.</p>
          ) : (
            <ul className="space-y-2">
              {mocks.map(mock => (
                <li key={mock.id} className="flex items-start gap-3 p-3 rounded-xl bg-amber-950/10 border border-amber-500/20">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-mono text-amber-200">{mock.path}</p>
                    <p className="text-[10px] text-zinc-400">{mock.pattern} → <span className="text-violet-300">{mock.capability}</span></p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Décisions providers ── */}
      {decisions.length > 0 && (
        <div className="rounded-2xl border border-cyan-500/20 bg-zinc-950/40 p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Providers recommandés ({decisions.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {decisions.map((dec, i) => (
              <div key={i} className="p-3 rounded-xl bg-cyan-950/10 border border-cyan-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 font-mono">{dec.capability}</span>
                  <ConfidenceBadge value={dec.confidence} />
                </div>
                <p className="text-xs text-white font-semibold">{dec.provider || 'À déterminer'}</p>
                <p className="text-[10px] text-zinc-400 leading-relaxed">{dec.reason}</p>
                {dec.requiresConfirmation && (
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ⚠️ Confirmation requise
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Fichiers ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* À créer */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/5 p-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-3 flex items-center gap-2">
            <FilePlus className="w-3.5 h-3.5" /> À créer ({filesToCreate.length})
          </h3>
          <ul className="space-y-1">
            {filesToCreate.slice(0, 8).map((f, i) => (
              <li key={i} className="text-[11px] font-mono text-zinc-300">+ {f}</li>
            ))}
            {filesToCreate.length > 8 && (
              <li className="text-[10px] text-zinc-500">+{filesToCreate.length - 8} autres…</li>
            )}
          </ul>
        </div>
        {/* À modifier */}
        <div className="rounded-2xl border border-orange-500/20 bg-orange-950/5 p-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-orange-400 mb-3 flex items-center gap-2">
            <FilePen className="w-3.5 h-3.5" /> À modifier ({filesToModify.length})
          </h3>
          <ul className="space-y-1">
            {filesToModify.slice(0, 8).map((f, i) => (
              <li key={i} className="text-[11px] font-mono text-zinc-300">~ {f}</li>
            ))}
            {filesToModify.length > 8 && (
              <li className="text-[10px] text-zinc-500">+{filesToModify.length - 8} autres…</li>
            )}
          </ul>
        </div>
        {/* À préserver */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-950/5 p-5">
          <h3 className="text-xs font-black uppercase tracking-widest text-blue-400 mb-3 flex items-center gap-2">
            <FolderLock className="w-3.5 h-3.5" /> Préservés ({filesToPreserve.length})
          </h3>
          <ul className="space-y-1">
            {filesToPreserve.slice(0, 8).map((f, i) => (
              <li key={i} className="text-[11px] font-mono text-zinc-300">🔒 {f}</li>
            ))}
            {filesToPreserve.length > 8 && (
              <li className="text-[10px] text-zinc-500">+{filesToPreserve.length - 8} autres…</li>
            )}
          </ul>
        </div>
      </div>

      {/* ── Risques ── */}
      {risks.length > 0 && (
        <div className="rounded-2xl border border-red-500/20 bg-red-950/5 p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Risques identifiés ({risks.length})
          </h3>
          <div className="space-y-2">
            {risks.map((risk, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${RISK_COLORS[risk.level]}`}>
                {RISK_ICON[risk.level]}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider opacity-70">[{risk.level}] {risk.code}</span>
                  <p className="text-xs mt-0.5">{risk.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Questions utilisateur obligatoires ── */}
      {requiresUserDecision.length > 0 && (
        <div className="rounded-2xl border border-rose-500/40 bg-rose-950/10 p-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-rose-400 mb-4 flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Décisions utilisateur obligatoires ({requiresUserDecision.filter(q => q.required).length} BLOQUANTE(S))
          </h3>
          <div className="space-y-3">
            {requiresUserDecision.map((q) => {
              const isAnswered = !!(answers[q.id] && answers[q.id].trim() !== '');
              
              // Normalisation de la capacité
              const capKey = (q.capability || q.id || '').toLowerCase().replace('-', '_');
              
              // Options prédéfinies selon la capacité (simplifie l'expérience)
              const SUGGESTIONS: Record<string, string[]> = {
                'backend': ['Node.js / Express', 'Python / FastAPI', 'Supabase (BaaS)', 'Firebase (BaaS)', 'Aucun (Front-end only)'],
                'auth': ['JWT Local personnalisé', 'Supabase Auth', 'Firebase Auth', 'Auth0', 'Clerk', 'Aucune authentification'],
                'authentication': ['JWT Local personnalisé', 'Supabase Auth', 'Firebase Auth', 'Auth0', 'Clerk', 'Aucune authentification'],
                'data_persistence': ['PostgreSQL', 'MongoDB', 'MySQL / MariaDB', 'SQLite local', 'Local Storage (Frontend)'],
                'database': ['PostgreSQL', 'MongoDB', 'MySQL / MariaDB', 'SQLite local', 'Local Storage (Frontend)'],
                'routing': ['React Router (SPA)', 'Next.js App Router', 'Vite Plugin Pages'],
                'error_handling': ['Gestionnaire global classique', 'Sentry', 'Winston / Morgan (Backend)'],
                'design': ['TailwindCSS natif', 'Material UI', 'Chakra UI', 'CSS Modules', 'Vanilla CSS'],
                'file_upload': ['AWS S3', 'Supabase Storage', 'Stockage local (Backend)', 'Cloudinary'],
                'storage': ['AWS S3', 'Supabase Storage', 'Stockage local (Backend)', 'Cloudinary'],
                'ocr_processing': ['Google Vision API', 'AWS Textract', 'Tesseract.js (Local)', 'API tierce dédiée']
              };
              
              const options: string[] = ((q as any).options && (q as any).options.length > 0) ? (q as any).options : (SUGGESTIONS[capKey] || []);
              const hasOptions = options.length > 0;
              
              // On vérifie si la réponse actuelle fait partie des options prédéfinies
              const isCustomAnswer = hasOptions && isAnswered && !options.includes(answers[q.id]);
              const selectValue = isCustomAnswer ? 'other' : (answers[q.id] || '');

              return (
                <div key={q.id} className={`p-4 rounded-xl border transition-colors ${q.required && !isAnswered ? 'border-rose-500/60 bg-rose-950/30' : 'border-zinc-700 bg-zinc-900/40'}`}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2">
                      {q.required
                        ? (isAnswered ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <Ban className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />)
                        : <Eye className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      }
                      <div>
                        <p className="text-xs font-semibold text-white">{q.question}</p>
                        <p className="text-[10px] text-zinc-400 mt-0.5">Lié à : <span className="font-mono text-violet-300">{q.capability || q.id}</span></p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {hasOptions && (
                        <select
                          value={selectValue}
                          onChange={(e) => {
                            if (e.target.value === 'other') {
                              setAnswers(prev => ({ ...prev, [q.id]: '' })); // reset for custom input
                            } else {
                              setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                            }
                          }}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50"
                        >
                          <option value="" disabled>-- Sélectionner une réponse --</option>
                          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                          <option value="other">Autre (Saisie libre)...</option>
                        </select>
                      )}
                      
                      {(!hasOptions || selectValue === 'other') && (
                        <input
                          type="text"
                          placeholder="Tapez votre réponse précise ici..."
                          value={answers[q.id] || ''}
                          onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          autoFocus={selectValue === 'other'}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50"
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {blockedByDecision && (
            <p className="mt-4 text-xs text-rose-300 font-semibold bg-rose-950/30 border border-rose-500/30 rounded-xl p-3 flex items-center gap-2">
              <Ban className="w-4 h-4" /> La confirmation est bloquée jusqu'à ce que les décisions obligatoires ci-dessus soient résolues.
            </p>
          )}
        </div>
      )}

      {/* ── Barre d'action finale ── */}
      <div className="relative overflow-hidden rounded-3xl p-2 border border-violet-500/30 bg-zinc-950/80 backdrop-blur-xl shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-blue-500/5 to-cyan-500/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 p-4">
          <div className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            <strong className="text-violet-300">La confirmation ne modifie aucun fichier.</strong>
            {' '}Elle envoie uniquement le contrat au moteur Kirov5 qui effectuera les vérifications de sécurité (drift, gates) avant toute mutation.
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              disabled={isSubmitting}
              className="px-5 py-3 rounded-2xl font-bold text-xs bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              ← Ré-auditer
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!canConfirm}
              title={blockedByDecision ? 'Résolvez les décisions obligatoires avant de confirmer' : ''}
              className={`px-8 py-3.5 rounded-2xl font-black text-sm flex items-center gap-3 transition-all relative overflow-hidden group
                ${canConfirm
                  ? 'bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] hover:scale-105 active:scale-95'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                }`}
            >
              {canConfirm && (
                <div className="absolute inset-0 w-full h-full bg-white/10 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              )}
              {isSubmitting ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  Envoi à Kirov5...
                </>
              ) : blockedByDecision ? (
                <>
                  <Ban className="w-4 h-4" />
                  Répondez aux questions...
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  🚀 Confirmer → Kirov5
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

