import React, { useState } from 'react';
import { X, Key, Eye, EyeOff, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { getApiKey, setApiKey, clearApiKey, hasApiKey } from '../../lib/guest/api-key-storage';
import { safeFetch } from '../../lib/bridgeClient';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [inputKey, setInputKey] = useState(getApiKey() || '');
  const [showKey, setShowKey] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saved' | 'cleared'>('idle');

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!inputKey.trim()) return;
    
    // Sauvegarde locale
    setApiKey(inputKey.trim());
    
    // Synchronisation avec le pont Electron (backend)
    try {
      await safeFetch('http://localhost:5006/api/bridge/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: inputKey.trim() })
      });
    } catch (e) {
      console.warn('Le bridge Electron est éteint, mais la clé est sauvée localement.', e);
    }

    setStatus('saved');
    setTimeout(() => {
      onSaved();
      onClose();
    }, 800);
  };

  const handleClear = () => {
    clearApiKey();
    setInputKey('');
    setStatus('cleared');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Key className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Configuration de la Clé API</h2>
              <p className="text-[10px] text-zinc-500">Agent Hermes — DeepSeek</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Status */}
        <div className={`mb-4 p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
          hasApiKey()
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          {hasApiKey() ? (
            <><CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" /> Clé API configurée et active</>
          ) : (
            <><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> Aucune clé API configurée — requis pour générer</>
          )}
        </div>

        {/* Key Input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-zinc-400 mb-2">
            Clé API DeepSeek
          </label>
          <div className="relative">
            <input
              id="api-key-input"
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-cyan-500/60 font-mono"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-200 transition-colors"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-zinc-600">
            🔒 Stockée uniquement dans votre navigateur (localStorage). Jamais transmise à nos serveurs.
          </p>
        </div>

        {/* Get Key Link */}
        <a
          href="https://platform.deepseek.com/api_keys"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 mb-5 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Obtenir une clé API DeepSeek gratuitement →
        </a>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!inputKey.trim()}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              status === 'saved'
                ? 'bg-emerald-500 text-white'
                : !inputKey.trim()
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:from-cyan-400 hover:to-blue-500'
            }`}
          >
            {status === 'saved' ? '✅ Clé enregistrée !' : 'Enregistrer la clé'}
          </button>
          {hasApiKey() && (
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-colors"
            >
              {status === 'cleared' ? '✓ Effacée' : 'Effacer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
