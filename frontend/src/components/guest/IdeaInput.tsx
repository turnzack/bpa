import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Send, Gamepad2, HeartPulse, ShoppingBag, Lightbulb, Zap, FolderOpen, Globe, FileCode, Youtube, Mic, Cpu, RefreshCw } from 'lucide-react';
import { PackCategory } from '../../types/pack';
import { safeFetch } from '../../lib/bridgeClient';

interface IdeaInputProps {
  onGenerate: (idea: string, category: PackCategory, sourceFolder?: string, webUrl?: string) => void;
  isGenerating: boolean;
}

export const IdeaInput: React.FC<IdeaInputProps> = ({ onGenerate, isGenerating }) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'folder' | 'web' | 'designrip' | 'phase5'>('prompt');
  const [phase5Folder, setPhase5Folder] = useState('');
  const [phase5Request, setPhase5Request] = useState('');
  const [projectList, setProjectList] = useState<string[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [idea, setIdea] = useState('');
  const [isPackMode, setIsPackMode] = useState(false);
  const [category, setCategory] = useState<PackCategory>('other');
  const [sourceFolder, setSourceFolder] = useState('');
  const [webUrl, setWebUrl] = useState('');
  const [isYouTube, setIsYouTube] = useState(false);

  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      let found: string[] = [];
      const res = await safeFetch('http://localhost:5006/api/projects');
      if (res && res.ok) {
        const data = await res.json();
        const raw = data.projects || (data.data && data.data.projects) || data;
        if (Array.isArray(raw)) {
          found = raw.map((p: any) => typeof p === 'string' ? p : (p.project_id || p.title || p.name)).filter(Boolean);
        }
      }

      if (found.length === 0) {
        const token = localStorage.getItem('kirov5_jwt_token') || '';
        const cloudRes = await fetch('/api/projects', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (cloudRes && cloudRes.ok) {
          const cloudData = await cloudRes.json();
          const cloudRaw = cloudData.projects || cloudData;
          if (Array.isArray(cloudRaw)) {
            found = cloudRaw.map((p: any) => typeof p === 'string' ? p : (p.project_id || p.title || p.name)).filter(Boolean);
          }
        }
      }

      const unique = Array.from(new Set(found)).filter(n => n && !n.startsWith('.') && n !== 'node_modules');
      setProjectList(unique);
      if (unique.length > 0) {
        setPhase5Folder(prev => (prev && unique.includes(prev)) ? prev : unique[0]);
      }
    } catch (e) {
      console.warn('Impossible de charger la liste des projets:', e);
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'phase5') {
      fetchProjects();
    }
  }, [activeTab, fetchProjects]);

  useEffect(() => {
    try {
      if (!webUrl.trim()) { setIsYouTube(false); return; }
      const parsed = new URL(webUrl);
      const hostname = parsed.hostname.replace(/^www\./, '');
      setIsYouTube(hostname === 'youtube.com' || hostname === 'youtu.be');
    } catch { setIsYouTube(false); }
  }, [webUrl]);

  const presetExamples = [
    {
      title: "Jeu Tetris Rétro",
      category: "game" as PackCategory,
      icon: Gamepad2,
      idea: "Un jeu Tetris rétro néon avec système de score, contrôles au clavier, effets de particules, niveaux de difficulté progressifs et sons retro 8-bit."
    },
    {
      title: "Pack Santé Apple Health",
      category: "health" as PackCategory,
      icon: HeartPulse,
      idea: "Application de suivi biométrique façon Apple Health : hydratation, suivi du sommeil, fréquence cardiaque, objectifs quotidiens et widgets graphiques fluides."
    },
    {
      title: "Store Sneaker Futuriste",
      category: "ecommerce" as PackCategory,
      icon: ShoppingBag,
      idea: "E-commerce de sneakers rares en 3D avec panier réactif, filtre par marques, mode sombre futuriste et prévisualisation AR."
    }
  ];



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mode Phase 5 : flux dédié
    if (activeTab === 'phase5') {
      if (!phase5Folder.trim() || isGenerating) return;
      const finalPrompt = phase5Request.trim() || "Faire un audit complet du projet pour l'industrialiser à 100%. Détecter tous les composants mockés (fausses données) et le stockage local temporaire, puis proposer un contrat de migration pour les remplacer par un backend de production sécurisé. Implémenter les bonnes pratiques manquantes (gestion globale des erreurs, routage sécurisé, authentification si pertinente) pour que le projet soit prêt pour un déploiement en production (Production Candidate).";
      onGenerate(finalPrompt, 'phase5', phase5Folder.trim(), undefined);
      return;
    }
    let processedIdea = idea.trim();
    if (!processedIdea) {
      if (activeTab === 'folder') processedIdea = isPackMode ? `Enrichissement du pack PRD : ${sourceFolder}` : `Import du projet local : ${sourceFolder}`;
      else if (activeTab === 'web') processedIdea = `Scraping du site web : ${webUrl}`;
      else if (activeTab === 'designrip') processedIdea = `DesignRip du site : ${webUrl}`;
    }
    if (activeTab === 'designrip') {
      processedIdea = `[DESIGN RIP] ${processedIdea}`;
    }
    if (!processedIdea || isGenerating) return;
    onGenerate(processedIdea, category, sourceFolder || undefined, webUrl || undefined);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-zinc-800 shadow-2xl mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Création de Pack Guest PRD (3 Fichiers)
        </h2>
        <span className="text-xs text-zinc-400 font-medium">
          Dossier cible : <code className="text-cyan-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">guest_nom_du_projet</code>
        </span>
      </div>

      {/* Input Mode Tabs */}
      <div className="flex items-center gap-2 mb-4 p-1 bg-zinc-950/80 rounded-xl border border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'prompt'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          1. Idée & Prompt Textuel
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('folder')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'folder'
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/40 shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          2. Choisir un Ancien Projet Local
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('web')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'web'
              ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border border-red-500/40 shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Youtube className="w-4 h-4" />
          3. Lien YouTube / Web
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('designrip')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'designrip'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          4. DesignRip
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('phase5')}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'phase5'
              ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-300 border border-violet-500/40 shadow-lg'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          ⚙️ 5. 🔌 Phase 5
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* TAB 1: PROMPT TEXT */}
        {activeTab === 'prompt' && (
          <div>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Ex: Je veux créer une application de méditation guidée et suivi d'entraînements avec ambiance sonore apaisante et statistiques quotidiennes..."
              rows={4}
              disabled={isGenerating}
              className="w-full bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 transition-all font-sans text-sm resize-none"
            />
          </div>
        )}

        {/* TAB 2: LOCAL FOLDER SELECTOR */}
        {activeTab === 'folder' && (
          <div className="space-y-3 p-4 bg-zinc-950/60 rounded-xl border border-amber-500/20">
            <div className="flex gap-4 mb-2 border-b border-zinc-800/80 pb-3">
               <label className="flex items-center gap-2 text-xs font-bold text-amber-300 cursor-pointer">
                 <input type="radio" name="folderMode" value="project" checked={!isPackMode} onChange={() => setIsPackMode(false)} className="accent-amber-500" />
                 📁 Projet Local Existant
               </label>
               <label className="flex items-center gap-2 text-xs font-bold text-yellow-400 cursor-pointer">
                 <input type="radio" name="folderMode" value="pack" checked={isPackMode} onChange={() => setIsPackMode(true)} className="accent-yellow-500" />
                 💎 Ancien Pack PRD (Ripping)
               </label>
            </div>
            <label className="block text-xs font-semibold text-amber-300 mb-1">
              {isPackMode ? "💎 Sélectionner le dossier d'un ancien Pack PRD pour l'enrichir :" : "📁 Sélectionner ou indiquer le dossier de votre ancien projet sur le disque dur :"}
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Native Directory Picker Button */}
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await safeFetch('http://localhost:5006/api/bridge/select-folder');
                    if (res && res.ok) {
                      const payload = await res.json();
                      const data = payload.data || payload; // Unwrap response-helper enveloppe
                      
                      if (data.success && data.path) {
                        setSourceFolder(data.path);
                        if (!idea.trim() || idea.startsWith("Analyse")) {
                          if (isPackMode) {
                            setIdea(`Analyse RIPPING de l'ancien pack PRD "${data.name}" pour l'enrichir et générer un nouveau pack ultra complet basé sur ce concept.`);
                          } else {
                            setIdea(`Analyse et reconstruction de l'ancien projet local "${data.name}"`);
                          }
                        }
                      }
                    }
                  } catch (e) {
                    console.error("Erreur de communication avec le bridge Electron", e);
                  }
                }}
                className="cursor-pointer px-4 py-2.5 bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all flex-shrink-0"
              >
                <FolderOpen className="w-4 h-4" />
                Ouvrir la boîte de dialogue dossier
              </button>

              {/* Manual Path Input */}
              <input
                type="text"
                value={sourceFolder}
                onChange={(e) => setSourceFolder(e.target.value)}
                placeholder="ou saisissez le chemin (ex: E:\ancien_projet ou C:\Code\my_app)"
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-amber-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Instructions complémentaires pour la reconstruction (ex: Conserver le design mais moderniser le code en React)..."
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 text-xs focus:outline-none focus:border-amber-500/50"
            />
          </div>
        )}

        {/* TAB 3: WEB URL / YOUTUBE */}
        {activeTab === 'web' && (
          <div className={`space-y-3 p-4 bg-zinc-950/60 rounded-xl border transition-all ${
            isYouTube ? 'border-red-500/40 bg-red-950/10' : 'border-purple-500/20'
          }`}>

            {/* Badge dynamique YouTube / Web */}
            {isYouTube ? (
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded-lg">
                  <Youtube className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs font-bold text-red-300">YouTube détecté</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <Mic className="w-3 h-3 text-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-semibold text-emerald-300">Extraction Transcript Activée</span>
                </div>
              </div>
            ) : (
              <label className="block text-xs font-semibold text-purple-300 mb-1">
                🌐 Coller l'URL du site Internet ou d'une vidéo YouTube :
              </label>
            )}

            <div className="relative">
              <input
                type="url"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... ou https://mon-site.com"
                className={`w-full bg-zinc-900 border rounded-xl pl-10 pr-4 py-2.5 text-xs placeholder-zinc-500 focus:outline-none font-mono transition-all ${
                  isYouTube
                    ? 'border-red-500/50 text-red-200 focus:border-red-400'
                    : 'border-zinc-800 text-purple-200 focus:border-purple-500'
                }`}
              />
              {isYouTube
                ? <Youtube className="w-4 h-4 text-red-400 absolute left-3 top-3" />
                : <Globe className="w-4 h-4 text-purple-400 absolute left-3 top-3" />
              }
            </div>

            {/* Message explicatif selon le mode */}
            {isYouTube && (
              <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-xl text-[11px] text-red-200/80 leading-relaxed">
                <strong className="text-red-300">🎬 Mode Analyse Sémantique Vidéo :</strong> Hermes va extraire la transcription complète (sous-titres) de la vidéo YouTube, analyser les paroles et concepts métiers, puis générer un Pack PRD ultra-pertinent basé sur le contenu réel de la vidéo.
              </div>
            )}

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={isYouTube
                ? 'Instructions complémentaires (optionnel — ex: "Créer une app pour les créateurs de contenu dans la même niche")...'
                : 'Instructions sur l\'analyse web (ex: S\'inspirer de la mise en page et adapter pour une SaaS)...'
              }
              rows={2}
              className={`w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 text-xs focus:outline-none ${
                isYouTube ? 'focus:border-red-500/50' : 'focus:border-purple-500/50'
              }`}
            />
          </div>
        )}

        {/* TAB 5: PHASE 5 — INDUSTRIALISATION */}
        {activeTab === 'phase5' && (
          <div className="space-y-4 p-4 bg-violet-950/15 rounded-xl border border-violet-500/30">
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-5 h-5 text-violet-400" />
              <span className="text-xs font-black text-violet-300 uppercase tracking-widest">⚙️ Phase 5 — Audit & Industrialisation</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Sélectionnez le projet. Hermes l'auditera pour détecter les mocks et proposer une architecture sécurisée.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-violet-300 flex items-center gap-1.5">
                  <span>📁</span> Projet à auditer :
                </label>
                <button
                  type="button"
                  onClick={fetchProjects}
                  disabled={isLoadingProjects}
                  className="text-[11px] text-violet-400 hover:text-violet-200 flex items-center gap-1.5 font-bold transition-colors cursor-pointer bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 px-2.5 py-1 rounded-lg"
                  title="Actualiser la liste des projets créés"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProjects ? 'animate-spin text-violet-300' : ''}`} />
                  <span>{isLoadingProjects ? 'Scan en cours...' : '🔄 Rafraîchir les projets'}</span>
                </button>
              </div>

              {/* Menu dépliant / dropdown des projets créés */}
              <div className="relative">
                <select
                  value={phase5Folder}
                  onChange={(e) => setPhase5Folder(e.target.value)}
                  className="w-full bg-zinc-900 border border-violet-500/40 hover:border-violet-500/60 rounded-xl px-4 py-3 text-xs text-violet-200 font-bold focus:outline-none focus:border-violet-400 cursor-pointer shadow-inner appearance-none transition-colors"
                >
                  <option value="" disabled>-- Sélectionnez un projet créé à auditer --</option>
                  {projectList.map((proj) => (
                    <option key={proj} value={proj} className="bg-zinc-950 text-white font-medium py-1.5">
                      📁 {proj}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-violet-400 text-xs font-bold">
                  ▼
                </div>
              </div>

              {projectList.length > 0 ? (
                <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
                  <span>✅ {projectList.length} projet(s) disponible(s) pour l'audit</span>
                  {phase5Folder && <span className="text-violet-300 font-mono">Sélection : <strong>{phase5Folder}</strong></span>}
                </div>
              ) : !isLoadingProjects ? (
                <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-lg flex items-center justify-between gap-2">
                  <p className="text-[11px] text-amber-300">
                    Aucun projet détecté automatiquement. Entrez le nom manuellement :
                  </p>
                  <input
                    type="text"
                    value={phase5Folder}
                    onChange={(e) => setPhase5Folder(e.target.value)}
                    placeholder="Ex: BLOG ou AUDIO"
                    className="bg-zinc-900 border border-amber-500/40 rounded-lg px-2.5 py-1 text-xs text-amber-200 font-mono w-48"
                  />
                </div>
              ) : null}
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-violet-300">
                🎯 Instructions supplémentaires (optionnel) :
              </label>
              <textarea
                value={phase5Request}
                onChange={(e) => setPhase5Request(e.target.value)}
                placeholder="Ex: S'assurer que les modèles de données incluent une table 'Utilisateur' avec un rôle administrateur..."
                rows={3}
                className="w-full bg-zinc-900 border border-violet-500/20 hover:border-violet-500/40 rounded-xl p-3 text-zinc-200 text-xs focus:outline-none focus:border-violet-400 resize-none placeholder-zinc-600 transition-colors"
              />
            </div>
          </div>
        )}

        {/* TAB 4: DESIGN RIP */}
        {activeTab === 'designrip' && (
          <div className="space-y-3 p-4 bg-emerald-950/10 rounded-xl border border-emerald-500/30">
            <label className="block text-xs font-semibold text-emerald-300 mb-1">
              4. designrip🌐 Coller l'URL du site Internet simple complexe dinamique :
            </label>
            <div className="relative">
              <input
                type="url"
                value={webUrl}
                onChange={(e) => setWebUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... ou https://mon-site.com"
                className="w-full bg-zinc-900 border border-emerald-500/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-emerald-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
              <Globe className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
            </div>

            <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-200/80 leading-relaxed">
              <strong className="text-emerald-300">🎨 Mode DesignRip Activé :</strong> Le moteur va analyser si c'est un site simple, complexe, multi-page ou animé. Les sites dynamiques sont le 1er choix. Le PRD généré imposera la création d'un clone parfait avec des animations fluides et un design extrêmement dynamique.
            </div>

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Instructions sur l'analyse web (ex: S'inspirer de la mise en page et adapter pour une SaaS)..."
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-zinc-200 text-xs focus:outline-none focus:border-emerald-500/50"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {activeTab !== 'phase5' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Catégorie:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PackCategory)}
                disabled={isGenerating}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-500"
              >
                <option value="health">Fitness / Santé</option>
                <option value="game">Jeu Vidéo</option>
                <option value="ecommerce">E-Commerce</option>
                <option value="productivity">Productivité</option>
                <option value="social">Réseau Social</option>
                <option value="education">Éducation</option>
                <option value="other">Autre / Spécifique</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={activeTab === 'phase5'
              ? (!phase5Folder.trim() || isGenerating)
              : ((!idea.trim() && !sourceFolder && !webUrl) || isGenerating)
            }
            className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg ${
              (activeTab === 'phase5' ? !phase5Folder.trim() : (!idea.trim() && !sourceFolder && !webUrl)) || isGenerating
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : activeTab === 'phase5'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-400 hover:to-purple-500 shadow-violet-500/25 active:scale-[0.98]'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white hover:from-cyan-400 hover:to-purple-500 shadow-cyan-500/25 active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-white" />
                {activeTab === 'phase5' ? 'Audit Hermes en cours...' : 'Analyse Hermes en cours...'}
              </>
            ) : activeTab === 'phase5' ? (
              <>
                <Cpu className="w-4 h-4" />
                ⚙️ Auditer le Projet
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Étape 1 : Analyser l'Idée (Proposition)
              </>
            )}
          </button>
        </div>
      </form>

      {/* Preset suggestions */}
      <div className="mt-6 pt-4 border-t border-zinc-800/80">
        <p className="text-xs font-semibold text-zinc-400 mb-3 flex items-center gap-1.5">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          Ou choisissez un modèle d'inspiration prêt à l'emploi :
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {presetExamples.map((ex, idx) => {
            const IconComponent = ex.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveTab('prompt');
                  setIdea(ex.idea);
                  setCategory(ex.category);
                }}
                className="text-left p-3 rounded-xl glass-card transition-all text-xs group border border-zinc-800/80 hover:border-cyan-500/40"
              >
                <div className="flex items-center gap-2 font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                  <IconComponent className="w-4 h-4 text-cyan-400" />
                  {ex.title}
                </div>
                <p className="text-zinc-400 line-clamp-2 text-[11px] leading-relaxed">{ex.idea}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

