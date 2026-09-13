/**
 * ============================================================
 * YOUTUBE-EXTRACTOR.JS — Module d'Extraction de Transcription
 * ============================================================
 * Extraction SANS dépendance externe (http/https natif Node.js)
 * Technique : parsing du HTML YouTube pour extraire le transcript XML
 * ============================================================
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

/**
 * Télécharge une URL et retourne le corps de la réponse sous forme de string.
 * Gère les redirections HTTP 3xx automatiquement.
 */
function fetchUrl(urlStr, options = {}, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Trop de redirections HTTP'));

    let parsedUrl;
    try {
      parsedUrl = new URL(urlStr);
    } catch (e) {
      return reject(new Error(`URL invalide : ${urlStr}`));
    }

    const proto = parsedUrl.protocol === 'https:' ? https : http;
    const reqOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      },
      timeout: 20000
    };

    const req = proto.request(reqOptions, (res) => {
      // Gérer les redirections
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const newUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : `${parsedUrl.protocol}//${parsedUrl.hostname}${res.headers.location}`;
        return resolve(fetchUrl(newUrl, options, redirects + 1));
      }

      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve(body));
      res.on('error', reject);
    });

    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout HTTP')); });
    req.on('error', reject);
    req.end();
  });
}

/**
 * Extrait l'ID YouTube depuis une URL (supporte youtu.be, youtube.com/watch, youtube.com/shorts)
 */
function extractVideoId(url) {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');

    if (hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0] || null;
    }
    if (hostname === 'youtube.com') {
      if (parsed.pathname.startsWith('/watch')) return parsed.searchParams.get('v');
      if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/shorts/')[1]?.split('?')[0] || null;
      if (parsed.pathname.startsWith('/embed/')) return parsed.pathname.split('/embed/')[1]?.split('?')[0] || null;
      if (parsed.pathname.startsWith('/v/')) return parsed.pathname.split('/v/')[1]?.split('?')[0] || null;
    }
  } catch (_) {}
  return null;
}

/**
 * Transforme un XML de transcript YouTube en texte brut lisible.
 * Supprime les balises <text start="..." dur="..."> et les entités HTML.
 */
function parseTranscriptXml(xml) {
  // Extraire le contenu de chaque balise <text>
  const matches = xml.match(/<text[^>]*>([\s\S]*?)<\/text>/g) || [];
  return matches
    .map(tag => {
      // Supprimer la balise ouvrante/fermante
      let txt = tag.replace(/<[^>]+>/g, '');
      // Décoder les entités HTML communes
      txt = txt
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x27;/g, "'")
        .replace(/\n/g, ' ')
        .trim();
      return txt;
    })
    .filter(t => t.length > 0)
    .join(' ');
}

/**
 * Extrait les métadonnées et la transcription d'une vidéo YouTube.
 * Retourne un objet avec { title, description, transcript, fullContext }
 */
async function extractYouTubeData(youtubeUrl) {
  console.log(`[YOUTUBE-EXTRACTOR] 🎬 Extraction pour : ${youtubeUrl}`);

  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) {
    throw new Error(`Impossible d'extraire l'ID vidéo depuis : ${youtubeUrl}`);
  }
  console.log(`[YOUTUBE-EXTRACTOR] 📹 Video ID : ${videoId}`);

  // 1. Télécharger la page HTML de la vidéo
  const pageHtml = await fetchUrl(`https://www.youtube.com/watch?v=${videoId}`);
  console.log(`[YOUTUBE-EXTRACTOR] ✅ Page HTML téléchargée (${Math.round(pageHtml.length / 1024)}Ko)`);

  // 2. Extraire le titre de la vidéo
  let title = 'Titre inconnu';
  const titleMatch = pageHtml.match(/"title":\{"runs":\[\{"text":"([^"]+)"\}\]/);
  if (titleMatch) title = titleMatch[1];
  else {
    const ogTitleMatch = pageHtml.match(/<meta\s+(?:name|property)="(?:og:title|title)"\s+content="([^"]+)"/i);
    if (ogTitleMatch) title = ogTitleMatch[1];
  }
  console.log(`[YOUTUBE-EXTRACTOR] 📝 Titre : ${title}`);

  // 3. Extraire la description
  let description = '';
  const descMatch = pageHtml.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
  if (descMatch) {
    description = descMatch[1]
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .slice(0, 2000);
  }

  // 4. Localiser l'URL du transcript depuis ytInitialPlayerResponse
  let transcriptUrl = null;
  let transcriptText = '';

  // Chercher la liste des captions tracks dans le JSON YT
  const captionsMatch = pageHtml.match(/"captionTracks":\[(.*?)\]/s);
  if (captionsMatch) {
    const captionsBlock = captionsMatch[1];

    // Priorité : transcription FR si disponible, puis 'en', puis la première
    const trackMatches = captionsBlock.match(/"baseUrl":"([^"]+)"[^}]*?"languageCode":"([^"]+)"/g) || [];
    let selectedTrack = null;

    for (const track of trackMatches) {
      const urlMatch = track.match(/"baseUrl":"([^"]+)"/);
      const langMatch = track.match(/"languageCode":"([^"]+)"/);
      if (!urlMatch) continue;

      const rawUrl = urlMatch[1].replace(/\\u0026/g, '&');
      const lang = langMatch ? langMatch[1] : 'xx';

      if (!selectedTrack) selectedTrack = { url: rawUrl, lang };
      if (lang === 'fr') { selectedTrack = { url: rawUrl, lang }; break; }
      if (lang === 'en' && selectedTrack.lang !== 'fr') selectedTrack = { url: rawUrl, lang };
    }

    if (selectedTrack) {
      transcriptUrl = selectedTrack.url;
      console.log(`[YOUTUBE-EXTRACTOR] 📜 Transcript trouvé (langue: ${selectedTrack.lang}) → ${transcriptUrl.slice(0, 80)}...`);
    }
  }

  // 5. Télécharger et parser le transcript XML
  if (transcriptUrl) {
    try {
      const xmlContent = await fetchUrl(transcriptUrl);
      transcriptText = parseTranscriptXml(xmlContent);
      const wordCount = transcriptText.split(/\s+/).length;
      console.log(`[YOUTUBE-EXTRACTOR] ✅ Transcript extrait : ~${wordCount} mots`);
      // Limiter à ~8000 mots pour ne pas dépasser le contexte LLM
      const words = transcriptText.split(/\s+/);
      if (words.length > 8000) {
        transcriptText = words.slice(0, 8000).join(' ') + '... [Transcript tronqué à 8000 mots]';
      }
    } catch (e) {
      console.warn(`[YOUTUBE-EXTRACTOR] ⚠️ Erreur récupération transcript XML : ${e.message}`);
    }
  } else {
    console.warn('[YOUTUBE-EXTRACTOR] ⚠️ Aucune piste de sous-titres trouvée pour cette vidéo.');
  }

  // 6. Construire le contexte complet à injecter dans le prompt IA
  const fullContext = `
=== DONNÉES EXTRAITES DE LA VIDÉO YOUTUBE ===
URL : ${youtubeUrl}
TITRE : ${title}

DESCRIPTION :
${description || '(pas de description disponible)'}

TRANSCRIPTION COMPLÈTE (paroles exactes de la vidéo) :
${transcriptText || '(sous-titres non disponibles pour cette vidéo — utiliser le titre et la description)'}
=============================================`.trim();

  return { title, description, transcript: transcriptText, fullContext, videoId };
}

/**
 * Vérifie si une URL est une vidéo YouTube.
 */
function isYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.replace(/^www\./, '');
    return hostname === 'youtube.com' || hostname === 'youtu.be';
  } catch (_) {
    return false;
  }
}

module.exports = { extractYouTubeData, isYouTubeUrl, extractVideoId };
