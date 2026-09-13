import React, { useState, useEffect } from 'react';
import { GeneratedPack, GeneratedFile } from '../../types/pack';
import { Download, Rocket, FileText, FileCode, FileJson, Folder, CheckCircle, Layers } from 'lucide-react';
import { downloadPackZip } from '../../lib/guest/pack-download';
import { safeFetch } from '../../lib/bridgeClient';

interface PackViewerProps {
  pack: GeneratedPack;
}

export const PackViewer: React.FC<PackViewerProps> = ({ pack }) => {
  const files = pack?.files || [];
  const tasks = pack?.tasks || [];

  const [selectedFile, setSelectedFile] = useState<GeneratedFile>(
    files[0] || { path: 'README.md', language: 'markdown', purpose: 'PRD Pack', content: '' }
  );
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchMessage, setLaunchMessage] = useState<string | null>(null);

  useEffect(() => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  }, [pack]);

  const getFileIcon = (fileName?: string) => {
    if (!fileName) return <FileText className="w-4 h-4 text-zinc-400" />;
    if (fileName.endsWith('.md')) return <FileText className="w-4 h-4 text-cyan-400" />;
    if (fileName.endsWith('.js')) return <FileCode className="w-4 h-4 text-amber-400" />;
    if (fileName.endsWith('.json')) return <FileJson className="w-4 h-4 text-purple-400" />;
    return <FileText className="w-4 h-4 text-zinc-400" />;
  };

  const [showLaunchConfirm, setShowLaunchConfirm] = useState(false);

  const handleLaunchProject = async () => {
    setShowLaunchConfirm(false);
    setIsLaunching(true);
    setLaunchMessage("🧠 Construction du Méga-Prompt Stitch depuis le Pack PRD...");

    try {
      // Extraire le contenu du README et du script d'injection pour constituer le prompt UI/UX
      const readmeFile = pack.files.find(f => f.path === 'README.md');
      const injectFile = pack.files.find(f => f.path?.endsWith('.js'));
      
      // Le prompt UI/UX pour Stitch = titre + résumé du pack + contenu du README (directives visuelles)
      const stitchContextPrompt = [
        pack.ideaSummary || pack.title,
        readmeFile?.content || '',
        injectFile?.content || '',
      ].filter(Boolean).join('\n\n').slice(0, 40000); // Limite 40k caractères

      setLaunchMessage("🚀 Transmission du Méga-Prompt Stitch au Moteur Electron...");

      const res = await safeFetch("http://localhost:5006/v1/mission/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pack.projectName || pack.folderName,
          prompt: stitchContextPrompt,
          packs: [pack.folderName], // Le moteur lira les fichiers depuis prd_packs/
          target_ai: "stitch",
          stack: "vite",
          reuse_tab: false,
          auto_submit: true,
        })
      });

      if (res && res.ok) {
        const data = await res.json();
        if (data.success) {
          setLaunchMessage(`✅ Mission "${pack.projectName}" transmise à Google Stitch ! L'onglet Stitch devrait s'ouvrir et recevoir le prompt automatiquement.`);
        } else {
          setLaunchMessage(`⚠️ Réponse inattendue : ${data.message || 'Voir les logs du Moteur Electron.'}`);
        }
      } else {
        setLaunchMessage("🌐 Mode Web Cloud : Le pack PRD est prêt et sauvegardé localement.");
      }
    } catch (e: any) {
      setLaunchMessage("⚠️ Pack conservé. Relancez COMMAND_MENU_TIGER.bat et réessayez si vous préférez le moteur local.");
    } finally {
      setTimeout(() => setIsLaunching(false), 5000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-cyan-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Folder className="w-5 h-5 text-cyan-400" />
              <span className="mono text-xs font-bold px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {pack?.folderName || 'guest_project'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30 font-semibold uppercase">
                {pack?.category || 'autre'}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{pack?.title || 'Pack PRD'}</h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">{pack?.architectureSummary}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => downloadPackZip(pack)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 hover:border-zinc-500 flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Télécharger ZIP ({pack?.folderName || 'pack'}.zip)
            </button>

            <button
              onClick={() => setShowLaunchConfirm(true)}
              disabled={isLaunching}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
            >
              <Rocket className="w-4 h-4 fill-black" />
              {isLaunching ? "Transmission..." : "🚀 Lancer la Création avec ce Pack"}
            </button>
          </div>
        </div>

        {/* Confirmation Modal for Launch */}
        {showLaunchConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel p-6 rounded-2xl max-w-md w-full border border-emerald-500/40 space-y-4 shadow-2xl bg-zinc-950">
              <div className="flex items-center gap-3 text-emerald-400">
                <Rocket className="w-6 h-6 animate-pulse" />
                <h3 className="text-base font-bold text-white">Confirmation de Lancement (Electron)</h3>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Le moteur Electron (<code>v0-moteur-electron</code>) va utiliser ce pack PRD (<code>{pack?.folderName}</code>) pour créer le projet source d'application.
                <br /><br />
                <span className="text-amber-400 font-semibold">⚠️ Attention :</span> Cette opération va générer des fichiers sources et lancer des processus de compilation. Voulez-vous continuer ?
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowLaunchConfirm(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-900 rounded-xl border border-zinc-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleLaunchProject}
                  className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl shadow-lg active:scale-95"
                >
                  ✅ Confirmer et Lancer la Création
                </button>
              </div>
            </div>
          </div>
        )}

        {launchMessage && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {launchMessage}
          </div>
        )}
      </div>

      {/* Main Grid: File Tabs & File Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3 Files Selector & Tasks */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel rounded-2xl p-4 border border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-cyan-400" />
              Fichiers du Pack PRD ({files.length})
            </h3>

            <div className="space-y-2">
              {files.map((file, idx) => {
                const isSelected = selectedFile?.path === file.path;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-3 rounded-xl transition-all border flex items-start justify-between gap-3 ${
                      isSelected
                        ? "bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                        : "bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5">{getFileIcon(file.path)}</div>
                      <div>
                        <div className={`mono text-xs font-bold ${isSelected ? "text-cyan-300" : "text-zinc-200"}`}>
                          {file.path}
                        </div>
                        <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{file.purpose}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tasks Overview */}
          <div className="glass-panel rounded-2xl p-4 border border-zinc-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Spécification des Tâches ({tasks.length})
            </h3>
            <div className="space-y-2.5">
              {tasks.map((task, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800 text-xs">
                  <div className="flex items-center justify-between font-semibold text-zinc-200 mb-1">
                    <span>{task.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 uppercase font-mono">
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">{task.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Code Editor & Preview */}
        <div className="lg:col-span-8">
          <div className="glass-panel rounded-2xl border border-zinc-800 overflow-hidden flex flex-col h-[520px]">
            {/* Editor Header Bar */}
            <div className="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getFileIcon(selectedFile?.path)}
                <span className="mono text-xs font-bold text-cyan-300">{pack?.folderName}/{selectedFile?.path}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                {selectedFile?.language || 'text'}
              </span>
            </div>

            {/* Editor Content Box */}
            <div className="p-4 bg-[#0a0b10] flex-1 overflow-auto">
              <pre className="mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {selectedFile?.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
