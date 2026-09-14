/// <reference types="vite/client" />
import React, { useState, useEffect, useRef } from "react";

// ============================================================
// TYPES
// ============================================================
interface AppProps {
  user: { userId: string; email: string; isSuperAdmin?: boolean };
  onLogout: () => void;
}

interface Project {
  id: number;
  name: string;
  docs: number;
  lastSync: string;
  color: string;
}

interface Client {
  id: number;
  name: string;
  email: string;
  company: string;
  status: "Actif" | "En Attente" | "Inactif";
  total: string;
}

interface Invoice {
  id: string;
  project: string;
  client: string;
  amount: string;
  status: "Analysé" | "En cours" | "Erreur";
  date: string;
  score: number;
}

type TabId = "dashboard" | "scan" | "clients" | "history" | "settings";

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_PROJECTS: Project[] = [
  { id: 1, name: "Rénovation Maison Dupont", docs: 12, lastSync: "Il y a 2h", color: "#4CAF50" },
  { id: 2, name: "Audit Sciences Déco", docs: 5, lastSync: "Hier", color: "#2196F3" },
  { id: 3, name: "BTP Martin - Extension", docs: 8, lastSync: "2 Jan", color: "#FF9800" },
  { id: 4, name: "Design Pro Office", docs: 3, lastSync: "28 Déc", color: "#E91E63" },
];

const MOCK_CLIENTS: Client[] = [
  { id: 1, name: "Jean Dupont", email: "jean.dupont@dupont.fr", company: "Dupont Rénovation", status: "Actif", total: "12 450 €" },
  { id: 2, name: "Marie Curie", email: "marie@curie.fr", company: "Sciences Déco", status: "En Attente", total: "3 200 €" },
  { id: 3, name: "Pierre Martin", email: "martin@btp.com", company: "BTP Martin", status: "Inactif", total: "0 €" },
  { id: 4, name: "Alice Durand", email: "alice@design.io", company: "Design Pro", status: "Actif", total: "1 150 €" },
];

const MOCK_INVOICES: Invoice[] = [
  { id: "DEV-001", project: "Rénovation Maison Dupont", client: "Jean Dupont", amount: "4 850 €", status: "Analysé", date: "14/09/2026", score: 92 },
  { id: "DEV-002", project: "Audit Sciences Déco", client: "Marie Curie", amount: "1 200 €", status: "En cours", date: "13/09/2026", score: 67 },
  { id: "DEV-003", project: "BTP Martin - Extension", client: "Pierre Martin", amount: "9 400 €", status: "Analysé", date: "12/09/2026", score: 45 },
  { id: "DEV-004", project: "Design Pro Office", client: "Alice Durand", amount: "750 €", status: "Erreur", date: "11/09/2026", score: 0 },
];

// ============================================================
// STYLES (CSS-in-JS)
// ============================================================
const colors = {
  bg: "#0d0d14",
  sidebar: "#111118",
  card: "#16161f",
  cardHover: "#1c1c28",
  border: "rgba(255,255,255,0.07)",
  accent: "#6366f1",
  accentGlow: "rgba(99,102,241,0.3)",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  text: "#f1f5f9",
  textMuted: "rgba(241,245,249,0.45)",
  tce: "#3b82f6",
};

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App({ user, onLogout }: AppProps) {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [clientSearch, setClientSearch] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const tabs = [
    { id: "dashboard" as TabId, label: "Tableau de bord", icon: "🏠" },
    { id: "scan" as TabId, label: "Scanner un devis", icon: "📄" },
    { id: "clients" as TabId, label: "Clients", icon: "👥" },
    { id: "history" as TabId, label: "Historique", icon: "📋" },
    { id: "settings" as TabId, label: "Paramètres", icon: "⚙️" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: colors.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif", color: colors.text, overflow: "hidden" }}>
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarCollapsed ? "64px" : "240px",
        background: colors.sidebar,
        borderRight: `1px solid ${colors.border}`,
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", boxShadow: `0 0 20px ${colors.accentGlow}`,
          }}>🏗️</div>
          {!sidebarCollapsed && (
            <div>
              <div style={{ fontWeight: 800, fontSize: "15px", background: "linear-gradient(135deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                BPA
              </div>
              <div style={{ fontSize: "10px", color: colors.textMuted }}>FactureScan TCE</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "10px 10px", borderRadius: "10px", border: "none",
              cursor: "pointer", textAlign: "left",
              background: activeTab === tab.id ? `rgba(99,102,241,0.15)` : "transparent",
              color: activeTab === tab.id ? colors.accent : colors.textMuted,
              borderLeft: activeTab === tab.id ? `3px solid ${colors.accent}` : "3px solid transparent",
              fontSize: "14px", fontWeight: activeTab === tab.id ? 600 : 400,
              transition: "all 0.15s ease",
            }}>
              <span style={{ fontSize: "16px", flexShrink: 0 }}>{tab.icon}</span>
              {!sidebarCollapsed && <span>{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* User */}
        <div style={{ padding: "12px 8px", borderTop: `1px solid ${colors.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", borderRadius: "10px", background: "rgba(255,255,255,0.03)" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px",
            }}>
              {user.email?.[0]?.toUpperCase() || "U"}
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                <button onClick={onLogout} style={{
                  fontSize: "11px", color: colors.danger, background: "none", border: "none",
                  cursor: "pointer", padding: 0, marginTop: "2px",
                }}>Déconnexion</button>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{
          margin: "0 8px 12px", padding: "8px", borderRadius: "8px",
          background: "rgba(255,255,255,0.04)", border: "none",
          cursor: "pointer", color: colors.textMuted, fontSize: "12px",
        }}>
          {sidebarCollapsed ? "→" : "← Réduire"}
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column" }}>
        {activeTab === "dashboard" && <DashboardView projects={MOCK_PROJECTS} invoices={MOCK_INVOICES} onScan={() => setActiveTab("scan")} />}
        {activeTab === "scan" && <ScanView />}
        {activeTab === "clients" && <ClientsView clients={MOCK_CLIENTS} search={clientSearch} setSearch={setClientSearch} />}
        {activeTab === "history" && <HistoryView invoices={MOCK_INVOICES} />}
        {activeTab === "settings" && <SettingsView user={user} onLogout={onLogout} />}
      </main>

      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
        button:hover { opacity: 0.85; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .card { animation: fadeIn 0.3s ease; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
}

// ============================================================
// DASHBOARD VIEW
// ============================================================
function DashboardView({ projects, invoices, onScan }: { projects: Project[]; invoices: Invoice[]; onScan: () => void }) {
  const stats = [
    { label: "Devis analysés", value: "28", icon: "📊", color: "#6366f1", delta: "+3 ce mois" },
    { label: "Économies détectées", value: "14 200 €", icon: "💰", color: "#22c55e", delta: "+12% vs mois dernier" },
    { label: "Clients actifs", value: "4", icon: "👥", color: "#3b82f6", delta: "2 projets en cours" },
    { label: "Score moyen", value: "74%", icon: "🎯", color: "#f59e0b", delta: "Bon niveau" },
  ];

  return (
    <div style={{ padding: "32px", animation: "fadeIn 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800 }}>Tableau de bord</h1>
          <p style={{ margin: "4px 0 0", color: colors.textMuted, fontSize: "14px" }}>Bienvenue — FactureScan BPA TCE</p>
        </div>
        <button onClick={onScan} style={{
          padding: "12px 24px", borderRadius: "12px", border: "none",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "white", fontSize: "14px", fontWeight: 700, cursor: "pointer",
          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
        }}>
          + Nouveau scan
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: colors.card, borderRadius: "16px", padding: "20px",
            border: `1px solid ${colors.border}`,
            borderLeft: `3px solid ${s.color}`,
          }} className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: "12px", color: colors.textMuted, marginBottom: "8px" }}>{s.label}</div>
                <div style={{ fontSize: "24px", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "4px" }}>{s.delta}</div>
              </div>
              <div style={{ fontSize: "28px" }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Projects */}
        <div style={{ background: colors.card, borderRadius: "16px", padding: "24px", border: `1px solid ${colors.border}` }} className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>📁 Projets actifs</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {projects.map(p => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)",
                cursor: "pointer", transition: "background 0.15s",
              }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: "11px", color: colors.textMuted }}>{p.docs} documents · {p.lastSync}</div>
                </div>
                <span style={{ fontSize: "12px", color: colors.textMuted }}>›</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent invoices */}
        <div style={{ background: colors.card, borderRadius: "16px", padding: "24px", border: `1px solid ${colors.border}` }} className="card">
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", fontWeight: 700 }}>📋 Derniers devis analysés</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {invoices.slice(0, 4).map(inv => (
              <div key={inv.id} style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.03)",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>{inv.id} — {inv.client}</div>
                  <div style={{ fontSize: "11px", color: colors.textMuted }}>{inv.project}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <StatusBadge status={inv.status} />
                  <div style={{ fontSize: "11px", color: colors.textMuted, marginTop: "2px" }}>{inv.amount}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCAN VIEW
// ============================================================
function ScanView() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleAnalyse = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("kirov5_jwt_token");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/invoices/analyze", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur serveur");
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "32px", animation: "fadeIn 0.3s ease" }}>
      <h1 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 800 }}>📄 Scanner un devis TCE</h1>
      <p style={{ margin: "0 0 28px", color: colors.textMuted, fontSize: "14px" }}>Importez un devis PDF ou image pour une analyse IA instantanée</p>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? colors.accent : colors.border}`,
          borderRadius: "20px", padding: "60px 40px",
          textAlign: "center", cursor: "pointer",
          background: dragOver ? "rgba(99,102,241,0.05)" : colors.card,
          transition: "all 0.2s ease", marginBottom: "24px",
        }}
      >
        <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>{file ? "✅" : "📂"}</div>
        {file ? (
          <>
            <div style={{ fontSize: "16px", fontWeight: 700, color: colors.accent }}>{file.name}</div>
            <div style={{ fontSize: "13px", color: colors.textMuted, marginTop: "4px" }}>{(file.size / 1024).toFixed(0)} Ko · Prêt à analyser</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: "16px", fontWeight: 700 }}>Glissez votre devis ici</div>
            <div style={{ fontSize: "13px", color: colors.textMuted, marginTop: "4px" }}>PDF, JPG, PNG — 20 Mo max</div>
          </>
        )}
      </div>

      {/* Bouton analyse */}
      {file && !result && (
        <button onClick={handleAnalyse} disabled={loading} style={{
          width: "100%", padding: "16px", borderRadius: "14px", border: "none",
          background: loading ? "rgba(99,102,241,0.4)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "white", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
          marginBottom: "20px",
        }}>
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
              <span style={{ display: "inline-block", width: "16px", height: "16px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              Analyse IA en cours...
            </span>
          ) : "🔍 Lancer l'analyse IA"}
        </button>
      )}

      {error && (
        <div style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "12px", padding: "16px", color: "#fca5a5", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Résultat */}
      {result && <AnalyseResult data={result} />}

      {/* Info premium si pas de résultat */}
      {!file && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "8px" }}>
          {[
            { icon: "🔍", title: "Analyse article par article", desc: "Chaque ligne de votre devis est comparée aux prix du marché TCE" },
            { icon: "⚠️", title: "Détection d'anomalies", desc: "Les surcoûts et anomalies sont automatiquement signalés" },
            { icon: "📊", title: "Score de conformité", desc: "Un score global évalue la conformité prix de votre devis" },
          ].map((f, i) => (
            <div key={i} style={{ background: colors.card, borderRadius: "14px", padding: "20px", border: `1px solid ${colors.border}` }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{f.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "6px" }}>{f.title}</div>
              <div style={{ fontSize: "12px", color: colors.textMuted, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ANALYSE RESULT
// ============================================================
function AnalyseResult({ data }: { data: any }) {
  const a = data?.analyse || data;
  const score = a?.score_conformite ?? a?.score ?? 0;
  const scoreColor = score >= 80 ? colors.success : score >= 50 ? colors.warning : colors.danger;
  const articles = a?.articles || [];
  const anomalies = a?.anomalies || [];

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      {/* Score */}
      <div style={{
        background: colors.card, borderRadius: "16px", padding: "24px",
        border: `1px solid ${colors.border}`, marginBottom: "20px",
        display: "flex", alignItems: "center", gap: "24px",
      }}>
        <div style={{
          width: "80px", height: "80px", borderRadius: "50%",
          background: `conic-gradient(${scoreColor} ${score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: colors.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 800, color: scoreColor }}>
            {score}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 800 }}>Rapport d'analyse</div>
          <div style={{ fontSize: "13px", color: colors.textMuted, marginTop: "4px" }}>
            {score >= 80 ? "✅ Devis conforme aux prix du marché" : score >= 50 ? "⚠️ Quelques points à vérifier" : "🔴 Surcoûts importants détectés"}
          </div>
          {a?.total_ht && <div style={{ fontSize: "13px", color: colors.textMuted, marginTop: "4px" }}>Total HT : <strong style={{ color: colors.text }}>{a.total_ht} €</strong></div>}
        </div>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <div style={{ background: colors.card, borderRadius: "16px", padding: "20px", border: `1px solid ${colors.border}`, marginBottom: "20px", overflowX: "auto" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "15px" }}>📋 Analyse article par article</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                {["Article", "Qté", "Unité", "Prix devis", "Prix réf.", "Écart", "Statut"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: colors.textMuted, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map((art: any, i: number) => {
                const ecart = art.ecart_pourcent;
                const ecartColor = art.statut === "vert" ? colors.success : art.statut === "jaune" ? colors.warning : art.statut === "orange" ? "#f97316" : colors.danger;
                return (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
                    <td style={{ padding: "10px 12px" }}>{art.designation || "—"}</td>
                    <td style={{ padding: "10px 12px", color: colors.textMuted }}>{art.quantite ?? "—"}</td>
                    <td style={{ padding: "10px 12px", color: colors.textMuted }}>{art.unite || "—"}</td>
                    <td style={{ padding: "10px 12px", fontWeight: 600 }}>{art.prix_devis ? `${art.prix_devis} €` : "—"}</td>
                    <td style={{ padding: "10px 12px", color: colors.textMuted }}>{art.prix_ref ? `${art.prix_ref} €` : "—"}</td>
                    <td style={{ padding: "10px 12px", color: ecartColor, fontWeight: 700 }}>
                      {ecart != null ? `${ecart > 0 ? "+" : ""}${ecart.toFixed(1)}%` : "N/A"}
                    </td>
                    <td style={{ padding: "10px 12px" }}>{art.emoji || "⚪"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Anomalies */}
      {anomalies.length > 0 && (
        <div style={{ background: colors.card, borderRadius: "16px", padding: "20px", border: `1px solid ${colors.border}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "15px" }}>⚠️ Anomalies détectées</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {anomalies.map((a: any, i: number) => {
              const bgColor = a.gravite === "CRITIQUE" ? "rgba(239,68,68,0.1)" : a.gravite === "ATTENTION" ? "rgba(245,158,11,0.1)" : "rgba(99,102,241,0.1)";
              const borderColor = a.gravite === "CRITIQUE" ? colors.danger : a.gravite === "ATTENTION" ? colors.warning : colors.accent;
              return (
                <div key={i} style={{ padding: "12px 16px", borderRadius: "10px", background: bgColor, border: `1px solid ${borderColor}22` }}>
                  <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "16px" }}>{a.gravite === "CRITIQUE" ? "🔴" : a.gravite === "ATTENTION" ? "🟡" : "🔵"}</span>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700 }}>{a.article}</div>
                      <div style={{ fontSize: "12px", color: colors.textMuted, marginTop: "2px" }}>{a.probleme}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CLIENTS VIEW
// ============================================================
function ClientsView({ clients, search, setSearch }: { clients: Client[]; search: string; setSearch: (v: string) => void }) {
  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "32px", animation: "fadeIn 0.3s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 800 }}>👥 Vos clients</h1>
          <p style={{ margin: "4px 0 0", color: colors.textMuted, fontSize: "14px" }}>{filtered.length} client(s)</p>
        </div>
        <button style={{
          padding: "10px 20px", borderRadius: "10px", border: "none",
          background: "linear-gradient(135deg, #3b82f6, #6366f1)",
          color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer",
        }}>+ Nouveau client</button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px" }}>🔍</span>
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%", padding: "12px 12px 12px 42px", borderRadius: "12px",
            border: `1px solid ${colors.border}`, background: colors.card,
            color: colors.text, fontSize: "14px", outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: colors.card, borderRadius: "16px", border: `1px solid ${colors.border}`, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${colors.border}`, background: "rgba(255,255,255,0.02)" }}>
              {["Nom", "Société", "Email", "Statut", "Total"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "14px 20px", color: colors.textMuted, fontWeight: 600, fontSize: "13px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: `1px solid rgba(255,255,255,0.04)`, cursor: "pointer", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding: "14px 20px", fontWeight: 600 }}>{c.name}</td>
                <td style={{ padding: "14px 20px", color: colors.textMuted }}>{c.company}</td>
                <td style={{ padding: "14px 20px", color: colors.tce }}>{c.email}</td>
                <td style={{ padding: "14px 20px" }}><StatusBadge status={c.status as any} /></td>
                <td style={{ padding: "14px 20px", fontWeight: 700 }}>{c.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// HISTORY VIEW
// ============================================================
function HistoryView({ invoices }: { invoices: Invoice[] }) {
  return (
    <div style={{ padding: "32px", animation: "fadeIn 0.3s ease" }}>
      <h1 style={{ margin: "0 0 8px", fontSize: "26px", fontWeight: 800 }}>📋 Historique des analyses</h1>
      <p style={{ margin: "0 0 24px", color: colors.textMuted, fontSize: "14px" }}>{invoices.length} devis analysés</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {invoices.map(inv => (
          <div key={inv.id} style={{
            background: colors.card, borderRadius: "14px", padding: "20px",
            border: `1px solid ${colors.border}`, display: "flex", alignItems: "center", gap: "20px",
            cursor: "pointer", transition: "border-color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = colors.accent + "44")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = colors.border)}>
            {/* Score */}
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%", flexShrink: 0,
              background: `conic-gradient(${inv.score >= 80 ? colors.success : inv.score >= 50 ? colors.warning : colors.danger} ${inv.score * 3.6}deg, rgba(255,255,255,0.05) 0deg)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: colors.card, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 800 }}>
                {inv.score > 0 ? `${inv.score}%` : "—"}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "15px", fontWeight: 700 }}>{inv.id} — {inv.client}</div>
              <div style={{ fontSize: "12px", color: colors.textMuted, marginTop: "2px" }}>{inv.project}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <StatusBadge status={inv.status} />
              <div style={{ fontSize: "13px", fontWeight: 700, marginTop: "4px" }}>{inv.amount}</div>
              <div style={{ fontSize: "11px", color: colors.textMuted }}>{inv.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SETTINGS VIEW
// ============================================================
function SettingsView({ user, onLogout }: { user: { email: string }; onLogout: () => void }) {
  return (
    <div style={{ padding: "32px", maxWidth: "600px", animation: "fadeIn 0.3s ease" }}>
      <h1 style={{ margin: "0 0 24px", fontSize: "26px", fontWeight: 800 }}>⚙️ Paramètres</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Account */}
        <div style={{ background: colors.card, borderRadius: "16px", padding: "24px", border: `1px solid ${colors.border}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px" }}>👤 Compte</h3>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", fontWeight: 800,
            }}>
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 700 }}>{user.email}</div>
              <div style={{ fontSize: "12px", color: colors.textMuted }}>Compte BPA FactureScan</div>
            </div>
          </div>
        </div>

        {/* API Backend */}
        <div style={{ background: colors.card, borderRadius: "16px", padding: "24px", border: `1px solid ${colors.border}` }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px" }}>🔌 Backend API</h3>
          <div style={{ fontSize: "13px", color: colors.textMuted, lineHeight: 1.8 }}>
            <div>Serveur : <code style={{ color: colors.tce }}>https://109-205-182-17.nip.io</code></div>
            <div>Base de données : <code style={{ color: colors.success }}>Neon PostgreSQL</code></div>
            <div>Authentification : <code style={{ color: colors.accent }}>JWT (7 jours)</code></div>
          </div>
        </div>

        {/* Logout */}
        <button onClick={onLogout} style={{
          padding: "14px", borderRadius: "12px", border: `1px solid rgba(239,68,68,0.3)`,
          background: "rgba(239,68,68,0.08)", color: "#fca5a5",
          fontSize: "14px", fontWeight: 600, cursor: "pointer",
        }}>
          🚪 Se déconnecter
        </button>
      </div>
    </div>
  );
}

// ============================================================
// SHARED COMPONENTS
// ============================================================
function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string }> = {
    "Analysé": { bg: "rgba(34,197,94,0.12)", color: "#86efac" },
    "En cours": { bg: "rgba(245,158,11,0.12)", color: "#fcd34d" },
    "Erreur": { bg: "rgba(239,68,68,0.12)", color: "#fca5a5" },
    "Actif": { bg: "rgba(34,197,94,0.12)", color: "#86efac" },
    "En Attente": { bg: "rgba(245,158,11,0.12)", color: "#fcd34d" },
    "Inactif": { bg: "rgba(239,68,68,0.12)", color: "#fca5a5" },
  };
  const s = cfg[status] || { bg: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" };
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: "20px",
      background: s.bg, color: s.color, fontSize: "11px", fontWeight: 700,
    }}>
      {status}
    </span>
  );
}
