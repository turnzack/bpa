/* Jarvis Skills — AI Skills Catalog (80+ skills)
   Exported as self.JarvisSkills for Chrome extension service worker */

(function () {
  'use strict';

  var CATALOG = [
    /* ═══════════════════ Core AI ═══════════════════ */
    { id: 'llm',                 name: 'LLM Chat',            icon: '🧠', description: 'Large language model chat completions with multi-turn context',       category: 'Core AI',     type: 'core',    tags: ['nlp', 'chat', 'conversation', 'text-generation'] },
    { id: 'vlm',                 name: 'Vision Language Model', icon: '👁️', description: 'Image understanding and visual reasoning with multimodal AI',        category: 'Core AI',     type: 'core',    tags: ['vision', 'image-understanding', 'multimodal', 'ocr'] },
    { id: 'tts',                 name: 'Text-to-Speech',       icon: '🔊', description: 'Convert text to natural-sounding speech with multiple voices',       category: 'Core AI',     type: 'core',    tags: ['audio', 'speech', 'voice', 'synthesis'] },
    { id: 'asr',                 name: 'Speech-to-Text',       icon: '🎙️', description: 'Transcribe audio recordings to text using automatic speech recognition', category: 'Core AI', type: 'core', tags: ['audio', 'transcription', 'speech-recognition', 'stt'] },
    { id: 'image-generation',    name: 'Image Generation',     icon: '🎨', description: 'Generate images from text descriptions using AI models',           category: 'Core AI',     type: 'core',    tags: ['image', 'generation', 'creative', 'diffusion'] },
    { id: 'image-edit',          name: 'Image Editing',        icon: '✏️', description: 'Edit and modify existing images using AI-powered transformations',    category: 'Core AI',     type: 'core',    tags: ['image', 'editing', 'inpainting', 'outpainting'] },
    { id: 'image-search',        name: 'Image Search',         icon: '🖼️', description: 'Search and retrieve real images from the web by text query',       category: 'Core AI',     type: 'optional', tags: ['image', 'search', 'web', 'photos'] },
    { id: 'code-llm',            name: 'Code Intelligence',    icon: '💻', description: 'AI-powered code analysis, generation, and refactoring',           category: 'Core AI',     type: 'optional', tags: ['code', 'programming', 'analysis', 'refactor'] },
    { id: 'embedding',           name: 'Embeddings',           icon: '📐', description: 'Generate vector embeddings for text similarity and search',        category: 'Core AI',     type: 'optional', tags: ['vectors', 'similarity', 'search', 'nlp'] },
    { id: 'translation',         name: 'Translation',          icon: '🌐', description: 'Translate text between languages with context awareness',          category: 'Core AI',     type: 'optional', tags: ['language', 'i18n', 'localization', 'translate'] },

    /* ═══════════════════ Web ═══════════════════ */
    { id: 'web-search',          name: 'Web Search',           icon: '🔍', description: 'Search the web for real-time information and latest data',          category: 'Web',         type: 'core',    tags: ['search', 'web', 'real-time', 'information'] },
    { id: 'web-reader',          name: 'Web Reader',           icon: '📄', description: 'Extract and parse content from web pages and articles',            category: 'Web',         type: 'core',    tags: ['scraping', 'parsing', 'content-extraction', 'web'] },
    { id: 'agent-browser',       name: 'Agent Browser',        icon: '🤖', description: 'Headless browser automation for navigation, clicking, and scraping', category: 'Web', type: 'core', tags: ['browser', 'automation', 'puppeteer', 'playwright'] },
    { id: 'rss-feed',            name: 'RSS Feed Reader',      icon: '📡', description: 'Parse and aggregate RSS/Atom feeds for content monitoring',         category: 'Web',         type: 'optional', tags: ['rss', 'feed', 'monitoring', 'news'] },
    { id: 'sitemap-parser',      name: 'Sitemap Parser',       icon: '🗺️', description: 'Parse XML sitemaps to discover and index website URLs',            category: 'Web',         type: 'optional', tags: ['sitemap', 'seo', 'crawling', 'xml'] },
    { id: 'api-client',          name: 'API Client',           icon: '🔌', description: 'Generic REST/GraphQL API request handler and tester',              category: 'Web',         type: 'optional', tags: ['api', 'rest', 'graphql', 'http'] },
    { id: 'webhook-listener',    name: 'Webhook Listener',     icon: '🔔', description: 'Receive and process incoming webhook events',                        category: 'Web',         type: 'optional', tags: ['webhook', 'events', 'integration', 'notification'] },

    /* ═══════════════════ Documents ═══════════════════ */
    { id: 'pdf',                 name: 'PDF Engine',           icon: '📕', description: 'Create, read, merge, split, and fill PDF documents',               category: 'Documents',   type: 'core',    tags: ['pdf', 'document', 'forms', 'report'] },
    { id: 'docx',                name: 'DOCX Engine',          icon: '📘', description: 'Create and edit Word documents with formatting and styles',       category: 'Documents',   type: 'core',    tags: ['word', 'document', 'editing', 'office'] },
    { id: 'xlsx',                name: 'XLSX Engine',          icon: '📗', description: 'Create, read, and manipulate Excel spreadsheets and data',          category: 'Documents',   type: 'core',    tags: ['excel', 'spreadsheet', 'data', 'charts'] },
    { id: 'pptx',                name: 'PPTX Engine',          icon: '📙', description: 'Create and edit PowerPoint presentations with layouts',           category: 'Documents',   type: 'core',    tags: ['powerpoint', 'presentation', 'slides', 'office'] },
    { id: 'markdown',            name: 'Markdown Engine',      icon: '📝', description: 'Parse, render, and convert Markdown to HTML and other formats',     category: 'Documents',   type: 'optional', tags: ['markdown', 'html', 'rendering', 'conversion'] },
    { id: 'latex',               name: 'LaTeX Compiler',       icon: '📐', description: 'Compile LaTeX documents for academic and scientific papers',        category: 'Documents',   type: 'optional', tags: ['latex', 'academic', 'scientific', 'paper'] },
    { id: 'ocr-engine',          name: 'OCR Engine',           icon: '🔎', description: 'Extract text from images and scanned documents via OCR',            category: 'Documents',   type: 'optional', tags: ['ocr', 'scanning', 'extraction', 'text'] },

    /* ═══════════════════ Media ═══════════════════ */
    { id: 'video-understand',     name: 'Video Understanding',  icon: '🎬', description: 'Analyze video content, extract frames, and understand temporal sequences', category: 'Media', type: 'core', tags: ['video', 'analysis', 'frames', 'temporal'] },
    { id: 'audio-processor',      name: 'Audio Processor',     icon: '🎵', description: 'Process, trim, merge, and convert audio files',                   category: 'Media',       type: 'optional', tags: ['audio', 'processing', 'conversion', 'editing'] },
    { id: 'video-editor',         name: 'Video Editor',        icon: '🎞️', description: 'Cut, trim, merge, and apply effects to video files',              category: 'Media',       type: 'optional', tags: ['video', 'editing', 'effects', 'rendering'] },
    { id: 'media-converter',      name: 'Media Converter',     icon: '🔄', description: 'Convert between media formats (audio, video, image)',              category: 'Media',       type: 'optional', tags: ['conversion', 'format', 'transcoding', 'media'] },
    { id: 'thumbnail-generator',  name: 'Thumbnail Generator', icon: '🖼️', description: 'Generate thumbnails and preview images from media files',          category: 'Media',       type: 'optional', tags: ['thumbnail', 'preview', 'image', 'media'] },

    /* ═══════════════════ Code ═══════════════════ */
    { id: 'fullstack-dev',       name: 'Fullstack Dev',        icon: '🏗️', description: 'Full-stack web development with Next.js, TypeScript, Tailwind, Prisma', category: 'Code', type: 'core', tags: ['fullstack', 'nextjs', 'typescript', 'react'] },
    { id: 'skill-creator',       name: 'Skill Creator',        icon: '⚡', description: 'Create, edit, and optimize reusable AI skills',                    category: 'Code',        type: 'core',    tags: ['skill', 'creation', 'optimization', 'meta'] },
    { id: 'task-review',         name: 'Task Review',          icon: '📋', description: 'Save completed tasks as reusable skill templates',                  category: 'Code',        type: 'core',    tags: ['task', 'review', 'template', 'reusable'] },
    { id: 'code-testing',        name: 'Code Testing',         icon: '🧪', description: 'Generate and run unit, integration, and e2e tests',                category: 'Code',        type: 'optional', tags: ['testing', 'unit-test', 'e2e', 'jest'] },
    { id: 'code-deploy',         name: 'Deploy Manager',       icon: '🚀', description: 'Deploy applications to Vercel, Netlify, AWS, and other platforms',  category: 'Code',        type: 'optional', tags: ['deploy', 'vercel', 'netlify', 'cloud'] },
    { id: 'code-lint',           name: 'Code Linter',          icon: '🧹', description: 'Lint and format code with ESLint, Prettier, and custom rules',      category: 'Code',        type: 'optional', tags: ['linting', 'formatting', 'eslint', 'prettier'] },
    { id: 'code-review',         name: 'Code Review',          icon: '👀', description: 'AI-powered code review with suggestions and best practices',      category: 'Code',        type: 'optional', tags: ['review', 'best-practices', 'quality', 'analysis'] },
    { id: 'code-refactor',       name: 'Code Refactor',        icon: '🔧', description: 'Automated code refactoring and modernization',                      category: 'Code',        type: 'optional', tags: ['refactoring', 'modernization', 'cleanup', 'patterns'] },
    { id: 'database-design',     name: 'Database Design',      icon: '🗃️', description: 'Design schemas, migrations, and optimize database queries',          category: 'Code',        type: 'optional', tags: ['database', 'sql', 'schema', 'migration'] },
    { id: 'api-design',          name: 'API Design',           icon: '🔀', description: 'Design RESTful and GraphQL APIs with documentation',                category: 'Code',        type: 'optional', tags: ['api', 'rest', 'graphql', 'design'] },

    /* ═══════════════════ Data ═══════════════════ */
    { id: 'charts',              name: 'Charts & Diagrams',    icon: '📊', description: 'Create professional charts, graphs, and structural diagrams',     category: 'Data',        type: 'core',    tags: ['charts', 'visualization', 'graphs', 'diagrams'] },
    { id: 'data-analytics',      name: 'Data Analytics',       icon: '📈', description: 'Analyze datasets, compute statistics, and generate insights',       category: 'Data',        type: 'optional', tags: ['analytics', 'statistics', 'insights', 'data'] },
    { id: 'data-cleaning',       name: 'Data Cleaning',        icon: '🧽', description: 'Clean, normalize, and transform raw datasets',                      category: 'Data',        type: 'optional', tags: ['cleaning', 'normalization', 'transformation', 'etl'] },
    { id: 'data-merge',          name: 'Data Merge',           icon: '🔗', description: 'Merge, join, and consolidate multiple data sources',                category: 'Data',        type: 'optional', tags: ['merge', 'join', 'consolidation', 'datasets'] },
    { id: 'data-export',         name: 'Data Export',          icon: '📤', description: 'Export data to CSV, JSON, SQL, and other formats',                  category: 'Data',        type: 'optional', tags: ['export', 'csv', 'json', 'sql'] },
    { id: 'dashboard-builder',   name: 'Dashboard Builder',    icon: '📱', description: 'Build interactive dashboards with KPI panels and charts',         category: 'Data',        type: 'optional', tags: ['dashboard', 'kpi', 'panels', 'interactive'] },

    /* ═══════════════════ Communication ═══════════════════ */
    { id: 'chat-engine',         name: 'Chat Engine',          icon: '💬', description: 'Build conversational AI chatbots with context management',         category: 'Communication', type: 'optional', tags: ['chatbot', 'conversation', 'context', 'ai'] },
    { id: 'email-composer',      name: 'Email Composer',       icon: '📧', description: 'Draft, format, and manage professional emails',                    category: 'Communication', type: 'optional', tags: ['email', 'compose', 'professional', 'template'] },
    { id: 'notification-manager',name: 'Notification Manager',  icon: '🔔', description: 'Manage push notifications, alerts, and reminders',                 category: 'Communication', type: 'optional', tags: ['notification', 'alert', 'push', 'reminder'] },
    { id: 'template-engine',     name: 'Template Engine',      icon: '📄', description: 'Build and render text/email/code templates with variables',          category: 'Communication', type: 'optional', tags: ['template', 'rendering', 'variables', 'text'] },

    /* ═══════════════════ DevOps ═══════════════════ */
    { id: 'docker',              name: 'Docker Manager',       icon: '🐳', description: 'Manage Docker containers, images, and compose configurations',    category: 'DevOps',       type: 'optional', tags: ['docker', 'containers', 'compose', 'images'] },
    { id: 'cicd',                name: 'CI/CD Pipeline',       icon: '🔄', description: 'Configure and manage continuous integration and delivery',          category: 'DevOps',       type: 'optional', tags: ['ci-cd', 'pipeline', 'automation', 'github-actions'] },
    { id: 'github-integration',  name: 'GitHub Integration',   icon: '🐙', description: 'Push code, manage PRs, and interact with GitHub API',              category: 'DevOps',       type: 'core',    tags: ['github', 'git', 'pull-request', 'api'] },
    { id: 'log-analyzer',        name: 'Log Analyzer',         icon: '📋', description: 'Parse and analyze application logs for errors and patterns',      category: 'DevOps',       type: 'optional', tags: ['logs', 'errors', 'monitoring', 'analysis'] },
    { id: 'env-manager',         name: 'Environment Manager',  icon: '⚙️', description: 'Manage environment variables and configuration across deployments', category: 'DevOps', type: 'optional', tags: ['environment', 'config', 'env', 'secrets'] },
    { id: 'health-check',        name: 'Health Check',         icon: '💚', description: 'Monitor service health, uptime, and response times',               category: 'DevOps',       type: 'optional', tags: ['monitoring', 'uptime', 'health', 'status'] },

    /* ═══════════════════ Creative ═══════════════════ */
    { id: 'copywriting',         name: 'Copywriting',          icon: '✍️', description: 'Generate marketing copy, headlines, and ad content',               category: 'Creative',     type: 'optional', tags: ['marketing', 'copy', 'headlines', 'ads'] },
    { id: 'storytelling',        name: 'Storytelling',         icon: '📖', description: 'Create narratives, stories, and creative fiction',                   category: 'Creative',     type: 'optional', tags: ['story', 'narrative', 'creative-writing', 'fiction'] },
    { id: 'prompt-engineering',  name: 'Prompt Engineering',   icon: '🎯', description: 'Craft and optimize AI prompts for better results',                   category: 'Creative',     type: 'optional', tags: ['prompt', 'optimization', 'ai', 'engineering'] },
    { id: 'brand-design',        name: 'Brand Design',         icon: '🎨', description: 'Generate brand identities, color schemes, and style guides',        category: 'Creative',     type: 'optional', tags: ['brand', 'design', 'identity', 'colors'] },
    { id: 'social-media',        name: 'Social Media',         icon: '📱', description: 'Create social media posts, captions, and content calendars',      category: 'Creative',     type: 'optional', tags: ['social', 'media', 'posts', 'content'] },

    /* ═══════════════════ Security ═══════════════════ */
    { id: 'security-scan',       name: 'Security Scanner',     icon: '🛡️', description: 'Scan code for vulnerabilities and security issues',                category: 'Security',     type: 'optional', tags: ['security', 'vulnerability', 'scan', 'audit'] },
    { id: 'secret-detect',       name: 'Secret Detector',      icon: '🔐', description: 'Detect hardcoded secrets, API keys, and credentials in code',     category: 'Security',     type: 'optional', tags: ['secrets', 'credentials', 'detection', 'safety'] },
    { id: 'access-control',      name: 'Access Control',       icon: '🔑', description: 'Design and implement authentication and authorization flows',    category: 'Security',     type: 'optional', tags: ['auth', 'rbac', 'jwt', 'permissions'] },

    /* ═══════════════════ Productivity ═══════════════════ */
    { id: 'summarizer',          name: 'Summarizer',           icon: '📝', description: 'Summarize long texts, documents, and meeting transcripts',           category: 'Productivity', type: 'optional', tags: ['summary', 'text', 'extraction', 'key-points'] },
    { id: 'task-planner',        name: 'Task Planner',         icon: '📌', description: 'Break down goals into actionable tasks and subtasks',               category: 'Productivity', type: 'optional', tags: ['planning', 'tasks', 'goals', 'productivity'] },
    { id: 'meeting-notes',       name: 'Meeting Notes',        icon: '🗂️', description: 'Generate structured meeting notes and action items',               category: 'Productivity', type: 'optional', tags: ['meeting', 'notes', 'actions', 'minutes'] },
    { id: 'knowledge-base',      name: 'Knowledge Base',       icon: '📚', description: 'Build and query a local knowledge base from documents',              category: 'Productivity', type: 'optional', tags: ['knowledge', 'search', 'documents', 'rag'] },
    { id: 'calendar-manager',    name: 'Calendar Manager',     icon: '📅', description: 'Schedule events, manage deadlines, and set reminders',              category: 'Productivity', type: 'optional', tags: ['calendar', 'scheduling', 'deadlines', 'events'] },

    /* ═══════════════════ Specialized ═══════════════════ */
    { id: 'v0-ui-gen',           name: 'V0 UI Generator',      icon: '🎭', description: 'Generate complete HTML/CSS/JS UI components from prompts',         category: 'Specialized',  type: 'core',    tags: ['ui', 'generation', 'html', 'css', 'components'] },
    { id: 'code-validator',      name: 'Code Validator',       icon: '✅', description: 'Validate generated code against constitution rules and standards', category: 'Specialized', type: 'core', tags: ['validation', 'rules', 'quality', 'constitution'] },
    { id: 'project-scaffolder',  name: 'Project Scaffolder',   icon: '🏗️', description: 'Scaffold new projects with boilerplate, configs, and structure',    category: 'Specialized',  type: 'optional', tags: ['scaffold', 'boilerplate', 'setup', 'template'] },
    { id: 'dependency-manager',  name: 'Dependency Manager',   icon: '📦', description: 'Analyze, install, and update project dependencies',               category: 'Specialized',  type: 'optional', tags: ['dependencies', 'npm', 'packages', 'updates'] },
    { id: 'a11y-auditor',        name: 'Accessibility Auditor',icon: '♿', description: 'Audit UI components for accessibility compliance (WCAG)',        category: 'Specialized',  type: 'optional', tags: ['accessibility', 'wcag', 'a11y', 'audit'] },
    { id: 'seo-optimizer',       name: 'SEO Optimizer',        icon: '🔎', description: 'Analyze and optimize web pages for search engine ranking',          category: 'Specialized',  type: 'optional', tags: ['seo', 'optimization', 'ranking', 'meta'] },
    { id: 'perf-analyzer',       name: 'Performance Analyzer', icon: '⚡', description: 'Analyze and optimize application performance and bundle size',      category: 'Specialized',  type: 'optional', tags: ['performance', 'optimization', 'bundle', 'speed'] },
    { id: 'i18n-manager',        name: 'i18n Manager',         icon: '🌍', description: 'Manage internationalization and localization resources',           category: 'Specialized',  type: 'optional', tags: ['i18n', 'l10n', 'translations', 'locales'] },
    { id: 'diff-viewer',          name: 'Diff Viewer',          icon: '🔀', description: 'Visualize file diffs with side-by-side or unified view',            category: 'Specialized',  type: 'optional', tags: ['diff', 'comparison', 'changes', 'git'] },
    { id: 'regex-builder',        name: 'Regex Builder',        icon: '🔤', description: 'Build, test, and debug regular expressions with live matching',    category: 'Specialized',  type: 'optional', tags: ['regex', 'pattern', 'testing', 'matching'] },
    { id: 'json-formatter',       name: 'JSON Formatter',       icon: '📋', description: 'Format, validate, minify, and transform JSON data',                  category: 'Specialized',  type: 'optional', tags: ['json', 'format', 'validate', 'transform'] },
    { id: 'color-palette',        name: 'Color Palette',        icon: '🎨', description: 'Generate harmonious color palettes and convert between color formats', category: 'Creative', type: 'optional', tags: ['color', 'palette', 'design', 'harmony'] },
  ];

  var STORAGE_KEY = 'jarvis_equipped_skills';

  var JarvisSkills = {
    /**
     * Returns the full skills catalog array (80+ skills).
     * @returns {Array} Full catalog of skill objects.
     */
    getAll: function () {
      return CATALOG.slice();
    },

    /**
     * Filter skills by category.
     * @param {string} cat - Category name (e.g. 'Core AI', 'Web', 'Documents')
     * @returns {Array} Filtered skills.
     */
    getByCategory: function (cat) {
      if (!cat) return CATALOG.slice();
      var lower = cat.toLowerCase();
      return CATALOG.filter(function (s) {
        return s.category.toLowerCase() === lower;
      });
    },

    /**
     * Search skills by query string (matches name, description, tags).
     * @param {string} query - Search query.
     * @returns {Array} Matching skills sorted by relevance.
     */
    search: function (query) {
      if (!query || !query.trim()) return CATALOG.slice();
      var q = query.toLowerCase().trim().split(/\s+/);
      return CATALOG.filter(function (s) {
        var haystack = (s.name + ' ' + s.description + ' ' + s.tags.join(' ') + ' ' + s.category).toLowerCase();
        return q.every(function (term) {
          return haystack.indexOf(term) !== -1;
        });
      });
    },

    /**
     * Get the set of equipped skill IDs from chrome.storage.local.
     * @returns {Promise<string[]>} Array of equipped skill IDs.
     */
    getEquipped: function () {
      return new Promise(function (resolve) {
        chrome.storage.local.get([STORAGE_KEY], function (result) {
          var equipped = result[STORAGE_KEY];
          if (Array.isArray(equipped)) {
            resolve(equipped);
          } else {
            // Default: equip all core skills
            var coreIds = CATALOG.filter(function (s) { return s.type === 'core'; }).map(function (s) { return s.id; });
            chrome.storage.local.set({ jarvis_equipped_skills: coreIds });
            resolve(coreIds);
          }
        });
      });
    },

    /**
     * Add a skill to the equipped set and persist to storage.
     * @param {string} skillId - The skill ID to equip.
     * @returns {Promise<string[]>} Updated equipped skill IDs.
     */
    equip: function (skillId) {
      return JarvisSkills.getEquipped().then(function (equipped) {
        if (equipped.indexOf(skillId) === -1) {
          equipped.push(skillId);
        }
        return new Promise(function (resolve, reject) {
          chrome.storage.local.set({ jarvis_equipped_skills: equipped }, function () {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve(equipped);
          });
        });
      });
    },

    /**
     * Remove a skill from the equipped set and persist to storage.
     * @param {string} skillId - The skill ID to unequip.
     * @returns {Promise<string[]>} Updated equipped skill IDs.
     */
    unequip: function (skillId) {
      return JarvisSkills.getEquipped().then(function (equipped) {
        var filtered = equipped.filter(function (id) { return id !== skillId; });
        return new Promise(function (resolve, reject) {
          chrome.storage.local.set({ jarvis_equipped_skills: filtered }, function () {
            if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
            else resolve(filtered);
          });
        });
      });
    },

    /**
     * Get statistics about the skills catalog.
     * @returns {Promise<Object>} Stats: { total, equipped, categories }
     */
    getStats: function () {
      return JarvisSkills.getEquipped().then(function (equipped) {
        var cats = {};
        CATALOG.forEach(function (s) {
          if (!cats[s.category]) cats[s.category] = { total: 0, equipped: 0 };
          cats[s.category].total++;
          if (equipped.indexOf(s.id) !== -1) cats[s.category].equipped++;
        });
        return {
          total: CATALOG.length,
          equipped: equipped.length,
          categories: cats,
          categoryNames: Object.keys(cats),
        };
      });
    },

    /**
     * Get a single skill by its ID.
     * @param {string} skillId - Skill ID to find.
     * @returns {Object|null} The skill object or null.
     */
    getById: function (skillId) {
      for (var i = 0; i < CATALOG.length; i++) {
        if (CATALOG[i].id === skillId) return CATALOG[i];
      }
      return null;
    },

    /**
     * Get all unique category names.
     * @returns {string[]} Array of category names.
     */
    getCategories: function () {
      var seen = {};
      var result = [];
      CATALOG.forEach(function (s) {
        if (!seen[s.category]) {
          seen[s.category] = true;
          result.push(s.category);
        }
      });
      return result;
    },
  };

  self.JarvisSkills = JarvisSkills;
})();
