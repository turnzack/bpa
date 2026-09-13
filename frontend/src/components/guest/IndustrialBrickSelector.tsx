import React, { useState } from 'react';
import {
  Layers, Shield, Database, Cpu, Package, BarChart3,
  Palette, Bot, CheckCircle2, Circle, Rocket, ChevronDown, ChevronUp
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface IndustrialBrick {
  id: string;
  label: string;
  description: string;
  tag: 'design' | 'auth' | 'database' | 'backend' | 'business' | 'security' | 'ai' | 'analytics';
  priority: 'required' | 'recommended' | 'optional';
  stitchDirective?: string;   // instruction pour le Mega-Prompt Stitch
  hermesModule?: string;       // nom du module Hermes à générer
}

export interface IndustrialPack {
  projectId: string;
  selectedBricks: IndustrialBrick[];
  hermesPack: { modules: string[]; contracts: string[]; megaPromptSuffix: string };
  stitchPack: { directives: string[]; designTokens: string[] };
  generatedAt: string;
}

// ─── Catalogue de Briques ─────────────────────────────────────────────────────

const BRICK_CATALOGUE: IndustrialBrick[] = [
  // DESIGN
  { id: 'tw-responsive', label: 'Tailwind Responsive', description: 'Layout responsive mobile-first avec breakpoints sm/md/lg/xl', tag: 'design', priority: 'required', stitchDirective: 'Design 100% responsive Tailwind, mobile-first, breakpoints sm/md/lg/xl', hermesModule: 'ResponsiveLayoutModule' },
  { id: 'dark-mode', label: 'Dark Mode Complet', description: 'Switch dark/light avec persistance localStorage', tag: 'design', priority: 'recommended', stitchDirective: 'Système dark/light mode via CSS variables et classe .dark, toggle avec useTheme', hermesModule: 'ThemeSystemModule' },
  { id: 'glass-ui', label: 'Glass UI / Glassmorphism', description: 'Panels vitreux avec backdrop-blur et transparences', tag: 'design', priority: 'optional', stitchDirective: 'Utiliser backdrop-blur, bg-white/10, border border-white/20 pour les panels principaux', hermesModule: null as any },
  { id: 'animations', label: 'Micro-Animations', description: 'Transitions Framer Motion ou CSS animate sur les composants clés', tag: 'design', priority: 'recommended', stitchDirective: 'Ajouter transition-all duration-200 ease-in-out sur tous les éléments interactifs, animate-in fade-in sur les modales', hermesModule: 'AnimationSystemModule' },
  { id: 'mobile-first', label: 'Mobile-First UX', description: 'Navigation bottom bar, touch targets 44px+, swipe gestures', tag: 'design', priority: 'optional', stitchDirective: 'Navigation bottom bar sur mobile, touch targets min 44px, safe-area-inset pour iOS', hermesModule: null as any },

  // AUTH
  { id: 'jwt-local', label: 'JWT Local (Personnalisé)', description: 'Auth JWT souveraine avec refresh token et blacklist', tag: 'auth', priority: 'optional', stitchDirective: 'Page Login/Register avec validation Zod, gestion token JWT en HttpOnly cookie', hermesModule: 'JwtAuthModule' },
  { id: 'supabase-auth', label: 'Supabase Auth', description: 'Auth OAuth complète via Supabase (Google, GitHub, Magic Link)', tag: 'auth', priority: 'optional', stitchDirective: 'Intégrer @supabase/auth-ui-react pour les formulaires auth, useSession hook', hermesModule: 'SupabaseAuthModule' },
  { id: 'clerk-auth', label: 'Clerk Auth', description: 'Auth clé en main avec UI pré-construite (Clerk.dev)', tag: 'auth', priority: 'optional', stitchDirective: 'Wrapper ClerkProvider, <SignIn /> <UserButton /> composants Clerk, middleware auth', hermesModule: 'ClerkAuthModule' },

  // DATABASE
  { id: 'postgresql', label: 'PostgreSQL / Prisma', description: 'Base relationnelle avec ORM Prisma et migrations auto', tag: 'database', priority: 'optional', stitchDirective: null as any, hermesModule: 'PrismaPostgresModule' },
  { id: 'supabase-db', label: 'Supabase Database', description: 'PostgreSQL hébergé + Realtime + Row Level Security', tag: 'database', priority: 'optional', stitchDirective: 'Hooks useQuery Supabase avec réactivité temps réel, types générés depuis schéma', hermesModule: 'SupabaseDatabaseModule' },
  { id: 'localstorage-db', label: 'LocalStorage / IndexedDB', description: 'Persistance côté client (offline-first, sans backend)', tag: 'database', priority: 'optional', stitchDirective: 'Hook useLocalStorage, synchronisation état Zustand → localStorage', hermesModule: 'ClientStorageModule' },

  // BACKEND
  { id: 'express-api', label: 'Node.js / Express API', description: 'API REST souveraine avec routes versionnées /api/v1', tag: 'backend', priority: 'optional', stitchDirective: null as any, hermesModule: 'ExpressApiModule' },
  { id: 'supabase-edge', label: 'Supabase Edge Functions', description: 'Serverless functions Deno pour logique métier', tag: 'backend', priority: 'optional', stitchDirective: null as any, hermesModule: 'EdgeFunctionsModule' },
  { id: 'no-backend', label: 'Sans Backend (Frontend Only)', description: 'Application 100% frontend, données locales', tag: 'backend', priority: 'optional', stitchDirective: 'Application 100% frontend sans appels API, toutes les données en localStorage/state', hermesModule: null as any },

  // BUSINESS MODULES
  { id: 'crud-full', label: 'CRUD Complet', description: 'Create/Read/Update/Delete avec modales de confirmation', tag: 'business', priority: 'recommended', stitchDirective: 'Tables de données avec tri, filtres, pagination, boutons CRUD dans chaque ligne, modales de confirmation delete', hermesModule: 'CrudDataModule' },
  { id: 'stripe-payment', label: 'Paiement Stripe', description: 'Checkout Stripe, abonnements, webhooks et portail client', tag: 'business', priority: 'optional', stitchDirective: 'Page Billing avec plans tarifaires, bouton Stripe Checkout, badge abonnement actif', hermesModule: 'StripePaymentModule' },
  { id: 'pdf-export', label: 'Export PDF / Rapport', description: 'Génération de PDF avec html2canvas + jsPDF', tag: 'business', priority: 'optional', stitchDirective: 'Bouton "Exporter PDF" sur les vues analytiques et tableaux, loading state pendant génération', hermesModule: 'PdfExportModule' },
  { id: 'notifications', label: 'Notifications Toast', description: 'Système de toasts et notifications temps réel (sonner)', tag: 'business', priority: 'recommended', stitchDirective: 'Intégrer Sonner ou react-hot-toast, toasts success/error/info/warning sur toutes les actions CRUD', hermesModule: 'NotificationModule' },
  { id: 'file-upload', label: 'Upload de Fichiers', description: 'Drag & drop, prévisualisation, validation type/taille', tag: 'business', priority: 'optional', stitchDirective: 'Zone drag & drop avec react-dropzone, prévisualisation image, barre de progression upload', hermesModule: 'FileUploadModule' },
  { id: 'search-filter', label: 'Recherche & Filtres Avancés', description: 'Recherche temps réel avec debounce et filtres multi-critères', tag: 'business', priority: 'recommended', stitchDirective: 'Barre de recherche avec debounce 300ms, chips de filtres actifs, reset filtres', hermesModule: 'SearchFilterModule' },

  // SECURITY
  { id: 'rate-limit', label: 'Rate Limiting', description: 'Protection API contre les abus (express-rate-limit)', tag: 'security', priority: 'recommended', stitchDirective: null as any, hermesModule: 'RateLimitModule' },
  { id: 'input-validation', label: 'Validation (Zod)', description: 'Validation schémas côté client + serveur avec Zod', tag: 'security', priority: 'required', stitchDirective: 'Tous les formulaires validés avec Zod + react-hook-form, messages d\'erreur en temps réel', hermesModule: 'ZodValidationModule' },
  { id: 'audit-logs', label: 'Audit Logs', description: 'Journal des actions utilisateur pour conformité et debug', tag: 'security', priority: 'optional', stitchDirective: null as any, hermesModule: 'AuditLogModule' },

  // AI
  { id: 'deepseek-api', label: 'DeepSeek API', description: 'Intégration LLM DeepSeek pour génération de contenu IA', tag: 'ai', priority: 'optional', stitchDirective: 'Interface de chat IA avec streaming, historique de messages, indicateur de frappe', hermesModule: 'DeepSeekAiModule' },
  { id: 'openai-api', label: 'OpenAI GPT-4', description: 'Intégration OpenAI pour IA générative premium', tag: 'ai', priority: 'optional', stitchDirective: 'Zone de saisie prompt avec streaming, compteur tokens, sélecteur de modèle', hermesModule: 'OpenAiModule' },

  // ANALYTICS
  { id: 'charts-recharts', label: 'Charts Recharts', description: 'Graphiques interactifs (Bar, Line, Area, Pie) avec Recharts', tag: 'analytics', priority: 'recommended', stitchDirective: 'Dashboard avec grille de KPIs (4 cartes métriques en haut), graphique Line Chart historique 30j, Bar Chart comparatif, Pie Chart répartition', hermesModule: 'DashboardChartsModule' },
  { id: 'kpi-widgets', label: 'Widgets KPI', description: 'Cartes de métriques avec tendances et indicateurs visuels', tag: 'analytics', priority: 'recommended', stitchDirective: 'Cartes KPI avec icône colorée, valeur principale, delta % par rapport à la période précédente, couleur verte/rouge selon tendance', hermesModule: 'KpiWidgetsModule' },
];

// ─── Config Catégories ────────────────────────────────────────────────────────

const CATEGORIES = [
  { tag: 'design', label: '🎨 Design & UI', icon: Palette, color: '#8b5cf6' },
  { tag: 'auth', label: '🔐 Authentification', icon: Shield, color: '#ef4444' },
  { tag: 'database', label: '🗄️ Base de Données', icon: Database, color: '#3b82f6' },
  { tag: 'backend', label: '⚡ Backend / API', icon: Cpu, color: '#f59e0b' },
  { tag: 'business', label: '📦 Modules Métier', icon: Package, color: '#10b981' },
  { tag: 'security', label: '🛡️ Sécurité', icon: Shield, color: '#f97316' },
  { tag: 'ai', label: '🤖 IA / LLM', icon: Bot, color: '#06b6d4' },
  { tag: 'analytics', label: '📊 Analytics & Charts', icon: BarChart3, color: '#a855f7' },
] as const;

// ─── Helper ───────────────────────────────────────────────────────────────────

function generatePacks(projectId: string, selected: IndustrialBrick[]): IndustrialPack {
  const stitchDirectives = selected.filter(b => b.stitchDirective).map(b => b.stitchDirective!);
  const hermesModules = selected.filter(b => b.hermesModule).map(b => b.hermesModule!);
  const contracts = hermesModules.map(m => `${m}Contract`);

  const megaPromptSuffix = [
    '\n\n## BRIQUES INDUSTRIELLES SÉLECTIONNÉES PAR L\'UTILISATEUR',
    '### Directives Design (Stitch)',
    stitchDirectives.map(d => `- ${d}`).join('\n'),
    '### Modules Métier (Hermes)',
    hermesModules.map(m => `- Implémenter : ${m}`).join('\n'),
    '### Contrats à respecter',
    contracts.map(c => `- ${c}`).join('\n'),
    '\nCes briques sont OBLIGATOIRES dans la livraison finale. Ne pas les omettre.'
  ].join('\n');

  return {
    projectId,
    selectedBricks: selected,
    hermesPack: { modules: hermesModules, contracts, megaPromptSuffix },
    stitchPack: { directives: stitchDirectives, designTokens: selected.filter(b => b.tag === 'design').map(b => b.id) },
    generatedAt: new Date().toISOString()
  };
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface IndustrialBrickSelectorProps {
  projectId: string;
  projectType: string;
  onConfirm: (pack: IndustrialPack) => void;
  onReset: () => void;
  isSubmitting: boolean;
}

export const IndustrialBrickSelector: React.FC<IndustrialBrickSelectorProps> = ({
  projectId, projectType, onConfirm, onReset, isSubmitting
}) => {
  const [selected, setSelected] = useState<Set<string>>(() => {
    const defaults = new Set<string>();
    BRICK_CATALOGUE.filter(b => b.priority === 'required').forEach(b => defaults.add(b.id));
    return defaults;
  });
  const [openCats, setOpenCats] = useState<Set<string>>(new Set(['design', 'business', 'analytics']));

  const toggle = (id: string, priority: string) => {
    if (priority === 'required') return;
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCat = (tag: string) => {
    setOpenCats(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const selectedBricks = BRICK_CATALOGUE.filter(b => selected.has(b.id));
  const pack = generatePacks(projectId, selectedBricks);

  const handleConfirm = () => onConfirm(pack);

  const s: React.CSSProperties = {
    fontFamily: "'Inter', system-ui, sans-serif",
  };

  return (
    <div style={{ ...s, color: '#f9fafb' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)', border: '1px solid #4c1d95', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Layers size={22} style={{ color: '#a78bfa' }} />
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#e9d5ff' }}>
            Phase 5 — Sélecteur de Briques Industrielles
          </h2>
          <span style={{ fontSize: '10px', background: '#4c1d95', color: '#c4b5fd', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>
            {selectedBricks.length} briques sélectionnées
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>
          Sélectionnez les briques métier et design pour votre projet <strong style={{ color: '#a78bfa' }}>{projectId}</strong>. 
          Le Pack Hermes et le Pack Stitch seront générés automatiquement.
        </p>
      </div>

      {/* Grille par catégories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {CATEGORIES.map(cat => {
          const bricks = BRICK_CATALOGUE.filter(b => b.tag === cat.tag);
          const selectedInCat = bricks.filter(b => selected.has(b.id)).length;
          const isOpen = openCats.has(cat.tag);

          return (
            <div key={cat.tag} style={{ background: '#111827', border: `1px solid #1f2937`, borderRadius: '12px', overflow: 'hidden' }}>
              {/* Header catégorie */}
              <button
                onClick={() => toggleCat(cat.tag)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', color: '#f9fafb' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{cat.label}</span>
                  <span style={{ fontSize: '10px', background: selectedInCat > 0 ? '#064e3b' : '#1f2937', color: selectedInCat > 0 ? '#34d399' : '#6b7280', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
                    {selectedInCat}/{bricks.length}
                  </span>
                </div>
                {isOpen ? <ChevronUp size={14} style={{ color: '#6b7280' }} /> : <ChevronDown size={14} style={{ color: '#6b7280' }} />}
              </button>

              {/* Briques */}
              {isOpen && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '8px', padding: '0 16px 16px' }}>
                  {bricks.map(brick => {
                    const isSelected = selected.has(brick.id);
                    const isRequired = brick.priority === 'required';
                    return (
                      <button
                        key={brick.id}
                        onClick={() => toggle(brick.id, brick.priority)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: '10px',
                          padding: '10px 12px', borderRadius: '8px', border: `1px solid ${isSelected ? cat.color + '50' : '#374151'}`,
                          background: isSelected ? cat.color + '10' : '#1f2937',
                          cursor: isRequired ? 'not-allowed' : 'pointer', textAlign: 'left',
                          opacity: isRequired ? 0.8 : 1, transition: 'all 0.15s'
                        }}
                      >
                        {isSelected
                          ? <CheckCircle2 size={15} style={{ color: cat.color, flexShrink: 0, marginTop: '1px' }} />
                          : <Circle size={15} style={{ color: '#6b7280', flexShrink: 0, marginTop: '1px' }} />
                        }
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#f9fafb' : '#9ca3af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {brick.label}
                            {isRequired && <span style={{ fontSize: '9px', background: '#7c3aed', color: '#ddd6fe', padding: '1px 5px', borderRadius: '4px' }}>REQUIS</span>}
                            {brick.priority === 'recommended' && !isRequired && <span style={{ fontSize: '9px', background: '#1e3a5f', color: '#93c5fd', padding: '1px 5px', borderRadius: '4px' }}>REC.</span>}
                          </div>
                          <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>{brick.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Récapitulatif */}
      <div style={{ background: '#0f0a2e', border: '1px solid #4c1d95', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 10px', fontSize: '11px', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          📦 Récapitulatif — Pack Généré
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>🎨 Pack Stitch (Design)</div>
            <div style={{ fontSize: '11px', color: '#c4b5fd' }}>{pack.stitchPack.directives.length} directives UI</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px' }}>🤖 Pack Hermes (Métier)</div>
            <div style={{ fontSize: '11px', color: '#34d399' }}>{pack.hermesPack.modules.length} modules à générer</div>
          </div>
        </div>
        <div style={{ marginTop: '8px', fontSize: '10px', color: '#6b7280' }}>
          Modules : {pack.hermesPack.modules.join(', ') || '—'}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onReset}
          disabled={isSubmitting}
          style={{ padding: '10px 20px', background: '#1f2937', color: '#9ca3af', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
        >
          ← Retour
        </button>
        <button
          onClick={handleConfirm}
          disabled={isSubmitting || selectedBricks.length === 0}
          style={{
            padding: '12px 28px', background: isSubmitting ? '#374151' : 'linear-gradient(135deg, #7c3aed, #2563eb)',
            color: '#ffffff', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 800,
            cursor: isSubmitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Rocket size={16} />
          {isSubmitting ? 'Génération Pack...' : `🚀 Confirmer & Générer les Packs (${selectedBricks.length} briques)`}
        </button>
      </div>
    </div>
  );
};
