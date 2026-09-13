import React from 'react';
import { Cpu, Terminal, ShieldCheck } from 'lucide-react';
import { IdeaInput } from './guest/IdeaInput';
import { PackViewer } from './guest/PackViewer';
import { ProposalViewer } from './guest/ProposalViewer';
import { IndustrialBrickSelector } from './guest/IndustrialBrickSelector';
import { WorkflowState, ProjectType } from './ProjectConfigurator';
import { safeFetch } from '../lib/bridgeClient';

interface Props {
  existingProjects: string[];
  workflowState: WorkflowState;
  setWorkflowState: (fn: (prev: WorkflowState) => WorkflowState) => void;
  logs: string[];
  isWorking: boolean;
  proposal: any;
  generatedPack: any;
  pipelineReport: any;
  showBrickSelector: boolean;
  industrialPack: any;
  projectIdInput: string;
  setProjectIdInput: (v: string) => void;
  onStep1Validate: () => void;
  onStep3Analyze: (idea: string, category: string, folder?: string, url?: string) => void;
  onStep6Ingest: () => void;
  onOpenBrickSelector: () => void;
  onConfirmBricks: (pack: any) => void;
  onRunPipeline: () => void;
  onFinalize: () => void;
  onConfirmProposal: () => void;
  setProposal: (v: any) => void;
  setGeneratedPack: (v: any) => void;
  setShowBrickSelector: (v: boolean) => void;
  bridgeQueueData?: any;
}

export function ForgeDualPanel(p: Props) {
  const { workflowState } = p;

  return (
    <div style={{ width: '100%', maxWidth: '900px', margin: '0 auto', minHeight: '100vh', background: '#030712', color: '#f9fafb', fontFamily: "'Inter',system-ui,sans-serif", padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* HEADER PRINCIPAL V0-GUEST */}
      <div style={{ background: 'linear-gradient(135deg,#0c0a1e,#1a0a2e)', border: '1px solid #4c1d95', borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '22px' }}>🎁</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#e9d5ff' }}>V0-GUEST — Hermes PRD Pack Engine</h2>
            <p style={{ margin: 0, fontSize: '10px', color: '#9ca3af' }}>Générateur souverain de Packs PRD & Configuration Projet</p>
          </div>
        </div>
        <span style={{ fontSize: '10px', padding: '4px 10px', borderRadius: '20px', background: '#052e16', border: '1px solid #16a34a', color: '#4ade80', fontWeight: 700 }}>
          🟢 Moteur Connecté (Port 5006)
        </span>
      </div>

      {/* SECTION 1 : Création & Ciblage */}
      <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 800, color: '#60a5fa', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📁 Création & Ciblage
        </h3>
        
        <div style={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          {p.existingProjects && p.existingProjects.length > 0 && (
            <div>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>CIBLER UN PROJET EXISTANT</label>
              <select
                value={p.projectIdInput}
                onChange={e => p.setProjectIdInput(e.target.value)}
                style={{ width: '100%', background: '#030712', border: '1px solid #374151', borderRadius: '8px', padding: '12px', color: '#f9fafb', fontSize: '13px', cursor: 'pointer' }}
              >
                <option value="">-- Sélectionner un projet existant --</option>
                {p.existingProjects.map(proj => (
                  <option key={proj} value={proj}>📁 {proj}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>NOM DU NOUVEAU PROJET</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                value={p.projectIdInput}
                onChange={e => p.setProjectIdInput(e.target.value)}
                placeholder="Ex: MonSuperProjet"
                style={{ flex: 1, background: '#030712', border: '1px solid #374151', borderRadius: '8px', padding: '12px', color: '#f9fafb', fontSize: '13px', fontFamily: 'monospace' }}
              />
              <button onClick={p.onStep1Validate} disabled={p.isWorking} style={{ padding: '0 24px', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
                {workflowState.steps.project_name === 'passed' ? 'Validé ✅' : 'Valider'}
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '10px', fontWeight: 700, color: '#9ca3af', display: 'block', marginBottom: '6px' }}>STACK TECHNIQUE</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
              {(['saas','showcase','game','mobile'] as ProjectType[]).map(t => (
                <button key={t} onClick={() => p.setWorkflowState(prev => ({ ...prev, projectType: t }))}
                  style={{ padding: '10px', fontSize: '11px', fontWeight: 700, borderRadius: '6px', border: `1px solid ${workflowState.projectType === t ? '#3b82f6' : '#374151'}`, background: workflowState.projectType === t ? '#1e3a8a' : '#1f2937', color: workflowState.projectType === t ? '#93c5fd' : '#6b7280', cursor: 'pointer', textTransform: 'uppercase' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 : Instructions & Vision */}
      <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '14px', padding: '20px', opacity: workflowState.steps.project_name !== 'passed' ? 0.3 : 1, pointerEvents: workflowState.steps.project_name !== 'passed' ? 'none' : 'auto' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📄 Instructions & Création du Pack PRD
        </h3>
        
        {!p.proposal && !p.generatedPack && (
          <IdeaInput
            onGenerate={(idea, category, sourceFolder, webUrl) => p.onStep3Analyze(idea, category, sourceFolder, webUrl)}
            isGenerating={p.isWorking}
          />
        )}

        {p.proposal && !p.generatedPack && (
          <ProposalViewer
            proposal={p.proposal}
            onConfirm={p.onConfirmProposal}
            onReset={() => p.setProposal(null)}
            isGenerating={p.isWorking}
          />
        )}

        {p.generatedPack && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#34d399' }}>Pack PRD Certifié ✅</span>
              <button onClick={() => { p.setProposal(null); p.setGeneratedPack(null); }} style={{ fontSize: '10px', color: '#9ca3af', background: '#1f2937', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
                Ré-analyser
              </button>
            </div>
            <PackViewer pack={p.generatedPack} />
          </div>
        )}
      </div>

      {/* SECTION 3 : Automatisation & IA */}
      {workflowState.steps.prd_pack === 'passed' && workflowState.steps.pipeline !== 'passed' && (
        <div style={{ background: '#111827', border: '1px solid #f59e0b', borderRadius: '14px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ⚡ Paramètres & IA
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={p.onStep6Ingest} disabled={p.isWorking || workflowState.steps.stitch_zip === 'passed'}
              style={{ width: '100%', padding: '16px', background: workflowState.steps.stitch_zip === 'passed' ? '#064e3b' : 'linear-gradient(135deg,#059669,#047857)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>
              {workflowState.steps.stitch_zip === 'passed' ? '✅ ZIP Ingéré & Lots Créés' : '📥 1. Joindre ZIP Stitch & Générer les Lots'}
            </button>
            
            {workflowState.steps.stitch_zip === 'passed' && (
              <button onClick={p.onRunPipeline} disabled={p.isWorking || workflowState.steps.pipeline === 'running'}
                style={{ width: '100%', padding: '16px', background: workflowState.steps.pipeline === 'running' ? '#1e3a8a' : 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>
                🚀 2. Lancer l'Automatisation
              </button>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4 : Radar & File d'attente (Uniquement en cours d'exécution) */}
      {p.bridgeQueueData && (p.bridgeQueueData.queue.length > 0 || p.bridgeQueueData.current) && (
        <div style={{ background: '#030712', border: '1px solid #1f2937', borderRadius: '14px', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#38bdf8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="animate-pulse">📡</span> MOTEUR ACTIF : {p.bridgeQueueData.queue.length + (p.bridgeQueueData.current ? 1 : 0)} TÂCHES EN ATTENTE
          </div>
          
          {p.bridgeQueueData.current && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(90deg, #1e3a8a, #1e40af)', padding: '12px 16px', borderRadius: '8px', marginBottom: '12px' }}>
              <div className="animate-pulse" style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>
                ⚡ EN COURS : [{p.bridgeQueueData.current.target_ai?.toUpperCase()}] {p.bridgeQueueData.current.phase_name || 'Génération LLM'}
              </div>
              <button
                onClick={() => {
                  safeFetch("http://localhost:5006/api/debug/advance-batch", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ project_id: workflowState.projectId })
                  }).catch(() => null);
                }}
                style={{ background: '#030712', color: '#9ca3af', border: '1px solid #374151', borderRadius: '6px', fontSize: '11px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Passer (Skip) ⏭️
              </button>
            </div>
          )}
          
          {p.bridgeQueueData.queue.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {p.bridgeQueueData.queue.map((task: any, idx: number) => (
                <div key={idx} style={{ background: '#1e293b', padding: '8px 12px', borderRadius: '6px', fontSize: '11px', color: '#cbd5e1' }}>
                  ⏳ Lot {idx + 1} : {task.target_ai}
                </div>
              ))}
            </div>
          )}

          <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', marginTop: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} /> Journal d'Exécution
          </div>
          <div style={{ background: '#000', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '11px', color: '#10b981', maxHeight: '200px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {p.logs.map((l, i) => <div key={i} style={{ lineHeight: 1.5 }}>{l}</div>)}
          </div>
        </div>
      )}

      {/* SECTION 5 : Phase 5 Industrialisation & Backend (APRÈS LES LOTS UI) */}
      <div style={{ background: '#111827', border: workflowState.steps.pipeline === 'passed' ? '1px solid #8b5cf6' : '1px solid #1f2937', boxShadow: workflowState.steps.pipeline === 'passed' ? '0 0 20px rgba(139,92,246,0.2)' : 'none', borderRadius: '14px', padding: '20px', opacity: workflowState.steps.pipeline === 'passed' ? 1 : 0.3, pointerEvents: workflowState.steps.pipeline === 'passed' ? 'auto' : 'none' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, color: '#a78bfa', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🔌 Phase 5 : Industrialisation & Backend
        </h3>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px', lineHeight: 1.6 }}>
          Tous les lots de génération d'interface (Stitch) sont terminés. Hermes va maintenant auditer votre code fraîchement généré pour le migrer vers une architecture backend robuste.
        </p>

        {!p.industrialPack ? (
          <IndustrialBrickSelector
            projectId={workflowState.projectId}
            projectType={workflowState.projectType}
            onConfirm={p.onConfirmBricks}
            onReset={() => p.setShowBrickSelector(false)}
            isSubmitting={p.isWorking}
          />
        ) : (
          <div style={{ padding: '16px', background: '#0f0a2e', border: '1px solid #4c1d95', borderRadius: '10px' }}>
            <div style={{ fontSize: '14px', color: '#a78bfa', fontWeight: 800, marginBottom: '8px' }}>
              ✅ Audit et Industrialisation Confirmés !
            </div>
            <div style={{ fontSize: '12px', color: '#d8b4fe', marginBottom: '4px' }}>🤖 Modules Hermes : {p.industrialPack.hermesPack.modules.length} modules injectés.</div>
            <div style={{ fontSize: '12px', color: '#d8b4fe', marginBottom: '16px' }}>🎨 Directives Stitch : {p.industrialPack.stitchPack.directives.length} directives.</div>
            
            <button onClick={p.onFinalize} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>
              ⚡ Démarrer Preview Local & Validation Industrielle
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
