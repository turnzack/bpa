"use client";

import { useEffect, useState, useRef } from "react";
import { MonitorPlay, Smartphone, Tablet, Monitor, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "./use-studio";
import { ErrorState, SectionHeader } from "./shared";
import ProjectWizard from "./project-wizard";

export default function ApercuView({ projectId }: { projectId?: string | null }) {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [url, setUrl] = useState("http://127.0.0.1:5175");
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop">("desktop");
  const [online, setOnline] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let mounted = true;
    const checkStatus = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/api/bridge/preview");
        if (mounted) {
          if (res.url) setUrl(res.url);
          setOnline(res.online);
        }
      } catch (e) {
        if (mounted) setOnline(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    checkStatus();
    return () => { mounted = false; };
  }, []);

  const handleRefresh = () => {
    if (iframeRef.current) {
      // Force iframe refresh by re-assigning src
      const currentSrc = iframeRef.current.src;
      iframeRef.current.src = "";
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = currentSrc;
      }, 50);
    }
  };

  const getWidth = () => {
    if (device === "mobile") return "max-w-[375px]";
    if (device === "tablet") return "max-w-[768px]";
    return "w-full";
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-950">
      <SectionHeader
        title="Aperçu Live"
        description="Prévisualisation en temps réel de votre projet compilé par le moteur."
        icon={MonitorPlay}
      >
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border bg-background p-1">
            <Button
              variant="ghost"
              size="icon"
              className={`size-7 rounded-sm ${device === "mobile" ? "bg-muted shadow-sm" : ""}`}
              onClick={() => setDevice("mobile")}
            >
              <Smartphone className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`size-7 rounded-sm ${device === "tablet" ? "bg-muted shadow-sm" : ""}`}
              onClick={() => setDevice("tablet")}
            >
              <Tablet className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`size-7 rounded-sm ${device === "desktop" ? "bg-muted shadow-sm" : ""}`}
              onClick={() => setDevice("desktop")}
            >
              <Monitor className="size-4" />
            </Button>
          </div>
          
          <div className="flex items-center w-64">
            <Input 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              className="h-9 rounded-r-none focus-visible:ring-0 border-r-0 font-mono text-xs" 
            />
            <Button onClick={handleRefresh} variant="outline" size="icon" className="h-9 w-9 rounded-none rounded-r-md border-l-0 border-input bg-muted/50 hover:bg-muted">
              <RefreshCw className="size-4" />
            </Button>
          </div>

          <Button variant="outline" size="sm" asChild>
            <a href={url} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4 mr-2" />
              Ouvrir
            </a>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="min-h-11 border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 lg:min-h-9"
            onClick={() => setWizardOpen(true)}
            disabled={!projectId}
            title="Lancer le pipeline Zero-Touch (Stitch / Phases 1-5)"
          >
            🚀 Lancer Pipeline Zero-Touch
          </Button>
        </div>
      </SectionHeader>

      <div className="flex-1 overflow-auto p-4 flex justify-center bg-zinc-200/50 dark:bg-zinc-900/50">
        {loading ? (
          <div className="flex items-center justify-center h-full w-full">
            <RefreshCw className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : online === false ? (
          <div className="flex items-center justify-center h-full w-full max-w-md">
            <ErrorState
              title="Serveur de preview injoignable"
              message={`Impossible de se connecter à ${url}. Vérifiez que le moteur Electron (v0-moteur-electron) est lancé et que l'étape 8 du pipeline est terminée.`}
              onRetry={() => {
                setOnline(null);
                setLoading(true);
                apiFetch("/api/bridge/preview").then(res => {
                  setUrl(res.url);
                  setOnline(res.online);
                  setLoading(false);
                }).catch(() => {
                  setOnline(false);
                  setLoading(false);
                });
              }}
            />
          </div>
        ) : (
          <div className={`h-full transition-all duration-300 ease-in-out ${getWidth()} bg-white shadow-xl ring-1 ring-zinc-900/10 rounded-sm overflow-hidden flex flex-col`}>
            <div className="h-6 bg-zinc-100 flex items-center px-3 border-b border-zinc-200">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-red-400"></div>
                <div className="size-2.5 rounded-full bg-amber-400"></div>
                <div className="size-2.5 rounded-full bg-green-400"></div>
              </div>
            </div>
            <iframe 
              ref={iframeRef}
              src={url} 
              className="flex-1 w-full border-0 bg-white"
              title="Preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            />
          </div>
        )}
      </div>

      {wizardOpen && projectId && (
        <ProjectWizard
          open={wizardOpen}
          onClose={() => setWizardOpen(false)}
          onFinished={() => setWizardOpen(false)}
          existingProjectId={projectId}
        />
      )}
    </div>
  );
}
