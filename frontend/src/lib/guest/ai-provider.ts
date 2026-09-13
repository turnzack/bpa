// === Appel Moteur IA Souverain (Cloudflare Workers AI Qwen via /api/hermes) ===
// Mise a jour : utilise callCloudflareHermes (messages[]) identique a worldmodelv2

import { SYSTEM_PROMPT } from './system-prompt';
import { buildUserPrompt } from './user-prompt';
import { resolveApiKey } from './api-key-storage';
import { callCloudflareHermes } from '../cloudflare-ai-provider';
import type { GeneratedPack, GeneratedFile, PackCategory } from '../../types/pack';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

export async function callHermesAgent(
  idea: string,
  category: PackCategory,
  sourceFolder?: string,
  webUrl?: string
): Promise<GeneratedPack> {
  const apiKey = await resolveApiKey();
  const userPrompt = buildUserPrompt(idea, category, sourceFolder, webUrl);

  let rawContent = '';

  // 1. Si une cle API DeepSeek est disponible, tenter DeepSeek (API directe)
  if (apiKey && apiKey.length > 5) {
    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 8000,
          temperature: 0.3,
          response_format: { type: 'json_object' },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        rawContent = data.choices?.[0]?.message?.content ?? '';
        console.log('[AI Provider] DeepSeek OK — contenu recu:', rawContent.length, 'chars');
      } else {
        console.warn('[AI Provider] DeepSeek erreur:', response.status, '— bascule vers Cloudflare Hermes.');
      }
    } catch {
      console.warn('[AI Provider] DeepSeek indisponible — bascule vers Cloudflare Hermes Worker.');
    }
  }

  // 2. Fallback Souverain Gratuit : Cloudflare Workers AI via /api/hermes (messages[])
  if (!rawContent) {
    try {
      console.log('[AI Provider] Appel Hermes Cloudflare Worker (route /api/hermes)...');
      rawContent = await callCloudflareHermes(
        SYSTEM_PROMPT,
        userPrompt,
        {
          maxTokens: 8000,
          temperature: 0.3,
        }
      );
      console.log('[AI Provider] Hermes Cloudflare OK — contenu recu:', rawContent.length, 'chars');
    } catch (cfErr: any) {
      console.error('[AI Provider] Hermes Cloudflare echoue:', cfErr.message);
      throw new Error(`Moteur IA indisponible. DeepSeek ${apiKey ? '(erreur API)' : '(pas de cle)'} et Cloudflare Worker (${cfErr.message}). Reessayez dans un instant.`);
    }
  }

  if (!rawContent) {
    throw new Error("Reponse vide de l'Agent Hermes. Reessayez.");
  }

  // Parser le JSON retourne par l'agent
  let parsed: any;
  try {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    parsed = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
  } catch {
    throw new Error(`L'Agent Hermes n'a pas retourne un JSON valide. Reponse: ${rawContent.slice(0, 300)}`);
  }

  // Construire le GeneratedPack type
  const folderName: string = parsed.folderName || `guest_${idea.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 20)}`;
  const injectFileName = `inject_${folderName}.js`;

  const baseFiles: GeneratedFile[] = [
    {
      path: 'README.md',
      language: 'markdown',
      purpose: 'PRD complet avec 10 modules architecturaux et directives IA',
      content: parsed.readme_content || '',
    },
    {
      path: injectFileName,
      language: 'javascript',
      purpose: "Script d'injection avec PRDS detailles pour Tiger IA / Hermes",
      content: parsed.inject_content || '',
    },
    {
      path: 'manifest.json',
      language: 'json',
      purpose: 'Metadonnees et registre du pack PRD',
      content: typeof parsed.manifest_content === 'string'
        ? parsed.manifest_content
        : JSON.stringify(parsed.manifest_content ?? {}, null, 2),
    },
  ];

  if (category === 'game' || parsed.game_engine_config || parsed.extra_files) {
    if (parsed.game_engine_config || !parsed.extra_files) {
      baseFiles.push(
        {
          path: 'project_spec.yaml',
          language: 'yaml',
          purpose: 'Contrat de Specification du Projet',
          content: typeof parsed.project_spec === 'string'
            ? parsed.project_spec
            : JSON.stringify(parsed.project_spec || {
                schema_version: "1.0.0",
                project: {
                  id: folderName,
                  name: parsed.projectName || folderName,
                  genre: "platformer_or_arcade"
                }
              }, null, 2),
        },
        {
          path: 'action_plan.yaml',
          language: 'yaml',
          purpose: 'Graphe de Dependances & Micro-Actions Granulaires',
          content: typeof parsed.action_plan === 'string'
            ? parsed.action_plan
            : JSON.stringify(parsed.action_plan || {
                schema_version: "1.0.0",
                actions: []
              }, null, 2),
        }
      );
    }
  }

  const pack: GeneratedPack = {
    projectName: parsed.projectName || folderName.replace('guest_', '').replace(/_/g, ' ').toUpperCase(),
    folderName,
    title: `Pack PRD ${parsed.projectName || folderName}`,
    category: parsed.category || category,
    ideaSummary: parsed.ideaSummary || idea,
    architectureSummary: parsed.architectureSummary || 'Architecture React 18 + TypeScript + Vite + Tailwind CSS.',
    tasks: parsed.tasks || [
      { id: 'task-1', title: 'Structure du Projet', description: 'Initialisation React/Vite/TypeScript', priority: 'must-have', status: 'planned' },
      { id: 'task-2', title: 'Composants Core', description: 'Developpement des vues principales', priority: 'must-have', status: 'planned' },
    ],
    files: baseFiles,
    extensionPoints: parsed.extensionPoints || ['React Context', 'Custom Hooks', 'TypeScript'],
    warnings: parsed.warnings || [],
  };

  return pack;
}
