import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import BuilderView from './components/studio/builder-view';
import DataView from './components/studio/data-view';
import WorkflowsView from './components/studio/workflows-view';
import GeneratorView from './components/studio/generator-view';

export const getResolvedTargetProject = (): string => {
  if (typeof window === 'undefined') return '';
  const urlParams = new URLSearchParams(window.location.search);
  const p = urlParams.get('project');
  if (p && p !== 'null' && p !== 'undefined' && p !== '[object Object]' && p.trim() !== '') {
    return p.trim();
  }
  const saved = localStorage.getItem('tiger_active_project') || localStorage.getItem('sovereign_current_project');
  if (saved && saved !== 'null' && saved !== 'undefined' && saved !== '[object Object]' && saved.trim() !== '') {
    return saved.trim();
  }
  return '';
};

const AdminDesignApp = () => {
  const [targetProject, setTargetProject] = useState<string>(() => getResolvedTargetProject());
  const isExternalProjectMode = Boolean(targetProject && targetProject !== "../../v0-interface-versel");

  const [activeStudioTab, setActiveStudioTab] = useState<'code' | 'builder' | 'data' | 'workflows' | 'generator'>('builder');

  // Code editor state
  const [activePagePath, setActivePagePath] = useState<string | null>(null);
  const [pageContent, setPageContent] = useState<string>("// Éditeur de code prêt.\n// Sélectionnez un fichier pour l'éditer.");

  useEffect(() => {
    // Listen for project changes if any
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'SET_ACTIVE_PROJECT' && event.data.project) {
         const newP = String(event.data.project).trim();
         if (newP && newP !== targetProject) {
           localStorage.setItem('tiger_active_project', newP);
           localStorage.setItem('sovereign_current_project', newP);
           setTargetProject(newP);
         }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [targetProject]);

  const TABS = [
    { id: 'code', icon: '💻', label: 'Code' },
    { id: 'builder', icon: '🏗️', label: 'Builder' },
    { id: 'data', icon: '🗄️', label: 'Données' },
    { id: 'workflows', icon: '⚙️', label: 'Workflows' },
    { id: 'generator', icon: '⚡', label: 'Générateur' },
  ] as const;

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
      {/* HEADER */}
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🐯</span>
          <h1 className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan to-pink-500 uppercase">
            {isExternalProjectMode ? `STUDIO ADMIN : ${targetProject}` : 'TIGER OMNI-ADMIN STUDIO'}
          </h1>
        </div>
        <div className="flex items-center gap-4">
           {/* Actions in header if needed */}
           <div className="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full text-green-400 border border-green-500/30 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
             100% PARAMÈTRES DÉBLOQUÉS (HMR)
           </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR (REPLACED "ARBORESCENCE DU DESIGN" WITH STUDIO BUTTONS) */}
        <div className="w-72 bg-[#09090b] border-r border-white/10 flex flex-col overflow-y-auto custom-scrollbar">
          <div className="p-5">
            <h2 className="text-[10px] font-black text-gray-500 tracking-widest uppercase mb-6 pl-2 border-b border-white/5 pb-2">
              Modules Studio
            </h2>
            <div className="space-y-3">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveStudioTab(tab.id as any)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-[13px] font-black uppercase transition-all flex items-center gap-3 ${
                    activeStudioTab === tab.id 
                      ? 'bg-gradient-to-r from-cyan/20 to-blue-500/10 text-white border-l-4 border-cyan shadow-[0_0_15px_rgba(8,179,201,0.2)]' 
                      : 'text-gray-400 hover:bg-white/5 border-l-4 border-transparent hover:text-white'
                  }`}
                >
                  <span className={`text-xl drop-shadow-md transition-transform ${activeStudioTab === tab.id ? 'scale-110' : ''}`}>
                    {tab.icon}
                  </span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-auto p-5 border-t border-white/5">
             <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-gray-400 font-medium">
               <p className="mb-2">Le mode Design CSS manuel a été remplacé par le Builder UI dynamique.</p>
               <p className="text-cyan font-bold">Sélectionnez le projet dans l'interface principale.</p>
             </div>
          </div>
        </div>

        {/* RIGHT AREA (STUDIO VIEWS) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
           {activeStudioTab === 'code' ? (
              <div className="flex-1 p-4 flex flex-col gap-4 h-full">
                 <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 shrink-0">
                   <h2 className="text-lg font-bold text-white flex items-center gap-2">
                     💻 Éditeur de Code Intégré
                   </h2>
                   <div className="flex gap-2">
                     <span className="text-xs text-gray-400">Lecture Seule (Fallback Mode)</span>
                   </div>
                 </div>
                 <div className="flex-1 rounded-xl overflow-hidden border border-white/10">
                   <Editor
                      height="100%"
                      language="typescript"
                      theme="vs-dark"
                      value={pageContent}
                      onChange={(val) => setPageContent(val || '')}
                      options={{ minimap: { enabled: false }, fontSize: 14, formatOnPaste: true, tabSize: 2, wordWrap: 'on' }}
                    />
                 </div>
              </div>
           ) : activeStudioTab === 'builder' ? (
              <BuilderView projectId={targetProject || null} onOpenPreview={() => {}} />
           ) : activeStudioTab === 'data' ? (
              <DataView projectId={targetProject || null} />
           ) : activeStudioTab === 'workflows' ? (
              <WorkflowsView projectId={targetProject || null} />
           ) : activeStudioTab === 'generator' ? (
              <GeneratorView projectId={targetProject || undefined} onOpenBuilder={() => setActiveStudioTab('builder')} />
           ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminDesignApp;
