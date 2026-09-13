/* Jarvis V0 — Dynamic UI Generation Module
   Exported as self.JarvisV0 for Chrome extension service worker */

(function () {
  'use strict';

  var HISTORY_KEY = 'v0_history';
  var MAX_HISTORY = 100;

  /* ── System prompt for UI generation ── */

  var V0_SYSTEM_PROMPT =
    'You are an expert frontend engineer specializing in generating beautiful, responsive UI components.\n' +
    'When the user describes a UI component or page, you must respond with a SINGLE complete HTML file.\n' +
    '\n' +
    'RULES:\n' +
    '1. Return a complete standalone HTML file starting with <!DOCTYPE html>.\n' +
    '2. All CSS must be embedded in a <style> tag in the <head>.\n' +
    '3. All JavaScript must be embedded in a <script> tag before </body>.\n' +
    '4. Use modern CSS features: CSS custom properties (variables), flexbox, grid, gap, clamp().\n' +
    '5. Make the design fully responsive — it must look great on mobile, tablet, and desktop.\n' +
    '6. Use a professional, modern color scheme with CSS variables for theming.\n' +
    '7. No external dependencies except CDN links (Tailwind CSS, Google Fonts, Lucide icons, etc.) if explicitly needed.\n' +
    '8. Include interactive JavaScript where appropriate (toggles, tabs, modals, animations, form handling).\n' +
    '9. Use semantic HTML elements (header, main, section, nav, footer, article).\n' +
    '10. Add smooth transitions and hover effects for polish.\n' +
    '11. Use system font stack or import a Google Font via <link>.\n' +
    '12. Output ONLY the HTML file — no explanations, no markdown fences, no conversation.\n' +
    '\n' +
    'DESIGN PRINCIPLES:\n' +
    '- Clean whitespace and consistent spacing (use 4px/8px rhythm).\n' +
    '- Subtle shadows and rounded corners for depth.\n' +
    '- Strong visual hierarchy with typography scale.\n' +
    '- Accessible color contrast ratios.\n' +
    '- Smooth micro-animations on interactions.\n';

  /* ── Built-in component catalog (15+ components) ── */

  var COMPONENT_CATALOG = [
    {
      id: 'card',
      name: 'Card',
      icon: '🃏',
      description: 'A versatile content container with header, body, and optional footer sections.',
      tags: ['container', 'content', 'layout', 'surface'],
      previewPrompt: 'A clean card component with an image, title, description, and action button',
    },
    {
      id: 'button',
      name: 'Button',
      icon: '🔘',
      description: 'Interactive button with multiple variants: primary, secondary, ghost, danger, and loading states.',
      tags: ['interactive', 'action', 'form', 'cta'],
      previewPrompt: 'A button group showing primary, secondary, ghost, and danger button variants with hover effects',
    },
    {
      id: 'badge',
      name: 'Badge',
      icon: '🏷️',
      description: 'Small status indicator or label with color variants for success, warning, error, and info.',
      tags: ['status', 'label', 'indicator', 'tag'],
      previewPrompt: 'A collection of colored badges showing different status types',
    },
    {
      id: 'input',
      name: 'Input',
      icon: '✏️',
      description: 'Text input with label, placeholder, validation states, and helper text.',
      tags: ['form', 'text', 'validation', 'field'],
      previewPrompt: 'A form with text input, email input, password input, and a textarea with validation states',
    },
    {
      id: 'table',
      name: 'Table',
      icon: '📊',
      description: 'Data table with sortable headers, row hover, and striped/zebra styling.',
      tags: ['data', 'grid', 'list', 'display'],
      previewPrompt: 'A responsive data table with 5 columns, sortable headers, and row hover effects',
    },
    {
      id: 'chart',
      name: 'Chart',
      icon: '📈',
      description: 'Visual chart using CSS or Canvas for bar, line, or pie data visualization.',
      tags: ['visualization', 'data', 'graph', 'analytics'],
      previewPrompt: 'A CSS bar chart showing monthly revenue data with labels and animations',
    },
    {
      id: 'modal',
      name: 'Modal',
      icon: '🪟',
      description: 'Overlay dialog with backdrop, close button, and animated entrance/exit.',
      tags: ['overlay', 'dialog', 'popup', 'focus'],
      previewPrompt: 'A modal dialog with a title, body content, action buttons, and backdrop blur',
    },
    {
      id: 'tabs',
      name: 'Tabs',
      icon: '📑',
      description: 'Tab navigation with animated active indicator and smooth content transitions.',
      tags: ['navigation', 'switching', 'content', 'panels'],
      previewPrompt: 'A tab component with 4 tabs, animated underline indicator, and content panels',
    },
    {
      id: 'accordion',
      name: 'Accordion',
      icon: '🪗',
      description: 'Collapsible sections with smooth expand/collapse animations and chevron icons.',
      tags: ['collapsible', 'faq', 'sections', 'expand'],
      previewPrompt: 'An FAQ accordion with 5 items, smooth expand/collapse, and chevron rotation',
    },
    {
      id: 'avatar',
      name: 'Avatar',
      icon: '👤',
      description: 'User avatar with image fallback, size variants, and online/offline status indicator.',
      tags: ['user', 'profile', 'image', 'status'],
      previewPrompt: 'Avatar components in multiple sizes with status indicators and a group avatar stack',
    },
    {
      id: 'progress',
      name: 'Progress',
      icon: '⏳',
      description: 'Progress bar with animated fill, percentage label, and color variants.',
      tags: ['loading', 'percentage', 'bar', 'status'],
      previewPrompt: 'Progress bars in different colors showing 25%, 50%, 75%, and 100% completion',
    },
    {
      id: 'alert',
      name: 'Alert',
      icon: '⚠️',
      description: 'Notification alert with icon, message, and dismiss button for info/success/warning/error.',
      tags: ['notification', 'message', 'feedback', 'status'],
      previewPrompt: 'Four alert variants: info, success, warning, and error with icons and dismiss buttons',
    },
    {
      id: 'skeleton',
      name: 'Skeleton',
      icon: '💀',
      description: 'Loading placeholder with animated shimmer effect mimicking content layout.',
      tags: ['loading', 'placeholder', 'shimmer', 'async'],
      previewPrompt: 'A skeleton loader with shimmer animation showing card, text, and image placeholders',
    },
    {
      id: 'carousel',
      name: 'Carousel',
      icon: '🎠',
      description: 'Image/content carousel with slide navigation, dots indicator, and auto-play.',
      tags: ['slider', 'gallery', 'navigation', 'images'],
      previewPrompt: 'An image carousel with 5 slides, prev/next buttons, dot indicators, and smooth transitions',
    },
    {
      id: 'toast',
      name: 'Toast',
      icon: '🍞',
      description: 'Transient notification popup that slides in, auto-dismisses, and stacks.',
      tags: ['notification', 'popup', 'feedback', 'temporary'],
      previewPrompt: 'A toast notification system with success, error, and info toasts that auto-dismiss',
    },
    {
      id: 'navbar',
      name: 'Navbar',
      icon: '🧭',
      description: 'Responsive navigation bar with logo, links, mobile hamburger menu, and dropdown.',
      tags: ['navigation', 'header', 'responsive', 'menu'],
      previewPrompt: 'A responsive navbar with logo, navigation links, a dropdown, and a mobile hamburger menu',
    },
    {
      id: 'sidebar',
      name: 'Sidebar',
      icon: '📋',
      description: 'Collapsible sidebar navigation with icons, nested menu items, and active state.',
      tags: ['navigation', 'layout', 'menu', 'panel'],
      previewPrompt: 'A collapsible sidebar with icon navigation, nested submenus, and an active item highlight',
    },
  ];

  /* ── API calling helpers (OpenAI-compatible format) ── */

  function buildApiUrl(provider, model) {
    // Default to OpenAI-compatible format
    if (provider && provider.apiUrl) return provider.apiUrl;
    if (provider && provider.id === 'claude') return provider.apiUrl;
    if (provider && provider.id === 'gemini') {
      var cleanModel = (model || 'gemini-2.5-flash').replace(/^models\//, '');
      return provider.apiUrl + '/' + cleanModel + ':generateContent';
    }
    return 'https://api.deepseek.com/v1/chat/completions';
  }

  function buildRequestBody(provider, model, messages) {
    if (provider && provider.format === 'anthropic') {
      return {
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: 16384,
        system: V0_SYSTEM_PROMPT,
        messages: messages.map(function (m) {
          return { role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content };
        }),
      };
    }
    if (provider && provider.format === 'gemini') {
      return {
        contents: messages.map(function (m) {
          return { role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] };
        }),
        systemInstruction: { parts: [{ text: V0_SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.7, maxOutputTokens: 16384 },
      };
    }
    // OpenAI-compatible (default)
    return {
      model: model || 'deepseek-chat',
      messages: [{ role: 'system', content: V0_SYSTEM_PROMPT }].concat(messages),
      temperature: 0.7,
      max_tokens: 16384,
    };
  }

  function buildHeaders(provider, apiKey) {
    var headers = { 'Content-Type': 'application/json' };
    if (provider && provider.format === 'anthropic') {
      if (apiKey) headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      headers['anthropic-dangerous-direct-browser-access'] = 'true';
    } else if (provider && provider.format === 'gemini') {
      if (apiKey) headers['x-goog-api-key'] = apiKey;
    } else {
      if (apiKey) headers['Authorization'] = 'Bearer ' + apiKey;
    }
    return headers;
  }

  function extractHtmlFromResponse(format, data) {
    var text = '';
    if (format === 'openai') text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    else if (format === 'anthropic') text = (data.content && data.content[0] && data.content[0].text) || '';
    else if (format === 'gemini') text = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) || '';
    else text = '';

    if (!text.trim()) return { html: '', raw: text };

    // Strip markdown code fences if the LLM wrapped the HTML
    var cleaned = text.trim();
    var fenceMatch = cleaned.match(/```(?:html)?\s*([\s\S]*?)```/i);
    if (fenceMatch) cleaned = fenceMatch[1].trim();

    // Extract HTML if embedded in other text
    var htmlStart = cleaned.indexOf('<!DOCTYPE');
    if (htmlStart === -1) htmlStart = cleaned.indexOf('<html');
    if (htmlStart === -1) htmlStart = cleaned.indexOf('<HTML');
    if (htmlStart !== -1) {
      var htmlEnd = cleaned.lastIndexOf('</html>');
      if (htmlEnd === -1) htmlEnd = cleaned.lastIndexOf('</HTML>');
      if (htmlEnd !== -1) {
        cleaned = cleaned.substring(htmlStart, htmlEnd + 7);
      } else {
        cleaned = cleaned.substring(htmlStart);
      }
    }

    return { html: cleaned, raw: text };
  }

  /* ── Storage helpers ── */

  function storageGet(keys) {
    return new Promise(function (resolve) {
      chrome.storage.local.get(keys, function (result) {
        if (chrome.runtime.lastError) {
          console.warn('[JarvisV0] storageGet error:', chrome.runtime.lastError.message);
          resolve({});
        } else {
          resolve(result);
        }
      });
    });
  }

  function storageSet(obj) {
    return new Promise(function (resolve, reject) {
      chrome.storage.local.set(obj, function () {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  }

  function storageRemove(keys) {
    return new Promise(function (resolve, reject) {
      chrome.storage.local.remove(keys, function () {
        if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
        else resolve();
      });
    });
  }

  /* ── JarvisV0 public API ── */

  var JarvisV0 = {
    /**
     * Generate a UI component from a text prompt via LLM API.
     * @param {string} prompt - Description of the desired UI component.
     * @param {Object} [provider] - Provider config object (with id, apiUrl, format).
     * @param {string} [apiKey] - API key for the provider.
     * @param {string} [model] - Model name to use.
     * @returns {Promise<{html: string, raw: string}>}
     */
    generate: function (prompt, provider, apiKey, model) {
      // If no provider given, try to use PROVIDERS from constants if loaded
      var p = provider || (typeof PROVIDERS !== 'undefined' ? PROVIDERS[typeof DEFAULT_PROVIDER !== 'undefined' ? DEFAULT_PROVIDER : 'deepseek'] : null);
      var format = (p && p.format) || 'openai';
      var url = buildApiUrl(p, model);
      var body = buildRequestBody(p, model, [{ role: 'user', content: prompt }]);
      var headers = buildHeaders(p, apiKey);

      // Gemini: append API key as query param
      var fetchUrl = url;
      if (format === 'gemini' && apiKey) {
        var sep = fetchUrl.indexOf('?') !== -1 ? '&' : '?';
        fetchUrl += sep + 'key=' + encodeURIComponent(apiKey);
      }

      return fetch(fetchUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      })
        .then(function (response) {
          if (!response.ok) {
            return response.text().then(function (errText) {
              throw new Error('API error (' + response.status + '): ' + errText.slice(0, 500));
            });
          }
          return response.json();
        })
        .then(function (data) {
          var result = extractHtmlFromResponse(format, data);
          // Auto-save to history
          if (result.html) {
            JarvisV0.saveToHistory({
              id: 'v0_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
              prompt: prompt,
              html: result.html,
              model: model || (p && p.model) || 'unknown',
              timestamp: Date.now(),
            });
          }
          return result;
        })
        .catch(function (err) {
          return { html: '', raw: '', error: err.message };
        });
    },

    /**
     * Get the generation history from chrome.storage.local.
     * @returns {Promise<Array>} Array of history entries sorted by timestamp (newest first).
     */
    getHistory: function () {
      return storageGet([HISTORY_KEY]).then(function (result) {
        var history = result[HISTORY_KEY] || [];
        // Ensure newest first
        history.sort(function (a, b) { return (b.timestamp || 0) - (a.timestamp || 0); });
        return history;
      });
    },

    /**
     * Save a generation entry to history.
     * @param {Object} entry - {id, prompt, html, model?, timestamp}
     * @returns {Promise<void>}
     */
    saveToHistory: function (entry) {
      return JarvisV0.getHistory().then(function (history) {
        // Enforce max history size
        history.unshift(entry);
        if (history.length > MAX_HISTORY) {
          history = history.slice(0, MAX_HISTORY);
        }
        var obj = {};
        obj[HISTORY_KEY] = history;
        return storageSet(obj);
      });
    },

    /**
     * Clear the entire generation history.
     * @returns {Promise<void>}
     */
    clearHistory: function () {
      return storageRemove(HISTORY_KEY);
    },

    /**
     * Delete a single history entry by ID.
     * @param {string} entryId - The entry ID to delete.
     * @returns {Promise<void>}
     */
    deleteHistoryEntry: function (entryId) {
      return JarvisV0.getHistory().then(function (history) {
        var filtered = history.filter(function (e) { return e.id !== entryId; });
        var obj = {};
        obj[HISTORY_KEY] = filtered;
        return storageSet(obj);
      });
    },

    /**
     * Get the built-in component catalog (17 components).
     * @returns {Array} Array of component descriptor objects.
     */
    getComponentCatalog: function () {
      return COMPONENT_CATALOG.slice();
    },

    /**
     * Find a catalog component by ID.
     * @param {string} componentId - Component ID (e.g. 'card', 'button').
     * @returns {Object|null} Component descriptor or null.
     */
    getComponentById: function (componentId) {
      for (var i = 0; i < COMPONENT_CATALOG.length; i++) {
        if (COMPONENT_CATALOG[i].id === componentId) return COMPONENT_CATALOG[i];
      }
      return null;
    },

    /**
     * Search the component catalog by query.
     * @param {string} query - Search query matching name, description, or tags.
     * @returns {Array} Matching components.
     */
    searchComponents: function (query) {
      if (!query || !query.trim()) return COMPONENT_CATALOG.slice();
      var terms = query.toLowerCase().trim().split(/\s+/);
      return COMPONENT_CATALOG.filter(function (c) {
        var haystack = (c.name + ' ' + c.description + ' ' + c.tags.join(' ')).toLowerCase();
        return terms.every(function (t) { return haystack.indexOf(t) !== -1; });
      });
    },
  };

  self.JarvisV0 = JarvisV0;
})();
