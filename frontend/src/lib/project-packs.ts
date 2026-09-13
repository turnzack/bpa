/**
 * Catalogue des Packs PRD de Forge Studio (« Lancer un projet depuis un pack »).
 *
 * Source : bibliothèque de packs PRD fournie par l'utilisateur (prd_packs.zip) —
 * chaque pack original contient des modules PRD (MISSION / STYLE & DESIGN /
 * MAPPING VFS) destinés à cadrer la construction d'un produit. Ce catalogue
 * transcode fidèlement ces modules dans Forge Studio : choisir un pack au
 * moment de la création d'un projet génère :
 * - les pages / tables / workflows du starter (scaffolding en base) ;
 * - une feuille de route « spiralaire » (cf. src/lib/pack-roadmap.ts) dont
 *   chaque sprint de la spirale 2 correspond à un groupe de modules du pack.
 *
 * Ce fichier ne contient QUE des données pures + types (aucun import serveur) :
 * il est importé à la fois par l'API (scaffolding) et par le wizard frontend.
 */

import type {
  ProjectType,
  TemplatePage,
  TemplateTable,
  TemplateWorkflow,
} from '@/lib/project-templates'

// ─── Formes ─────────────────────────────────────────────────────────────────

/** Un module PRD du pack (transcodé du zip utilisateur). */
export interface PackModule {
  /** Clé stable (id du PRD dans le pack d'origine). */
  key: string
  /** Titre lisible affiché dans le wizard et la roadmap. */
  title: string
  /** Mission du module (champ « MISSION » du PRD). */
  mission: string
  /** Direction artistique / style (champ « STYLE & DESIGN »). */
  style: string
  /** Fichiers cibles du mapping VFS (champ « MAPPING VFS »), vide si non précisé. */
  mapping: string[]
  /** Catégorie de tâche reprise dans la feuille de route. */
  category: string
}

/** Un pack PRD complet : modules + ressources de démarrage. */
export interface ProjectPack {
  id: string
  label: string
  /** Dossier d'origine dans le zip utilisateur (traçabilité). */
  source: string
  tagline: string
  /** Description pré-remplie du projet créé (modifiable ensuite). */
  description: string
  /** Clé d'icône lucide résolue côté frontend. */
  icon: string
  /** Clé de couleur Tailwind (sans bleu/indigo). */
  color: string
  /** Type de projet Forge utilisé comme socle (limite de plan, meta d'affichage). */
  baseType: ProjectType
  /** Suggestion de nom dans le wizard. */
  nameSuggestion: string
  /** 3 puces « ce que le pack apporte ». */
  highlights: string[]
  modules: PackModule[]
  pages: TemplatePage[]
  tables: TemplateTable[]
  workflows: TemplateWorkflow[]
}

// ─── Catalogue (transcodage fidèle de prd_packs.zip) ────────────────────────

export const PROJECT_PACKS: ProjectPack[] = [
  {
    id: 'app-web',
    label: 'App Web Pack',
    source: 'prd_packs/app_web_pack',
    tagline: '10 écrans d’application web prêts à l’emploi : dashboard, auth, kanban, inbox…',
    description:
      'Projet lancé depuis le pack « App Web Pack » : 10 modules PRD (dashboard, authentification split, paramètres, notifications, profil, inbox, kanban, to-do, notes, agenda) pour construire une application web complète.',
    icon: 'layout-panel-top',
    color: 'emerald',
    baseType: 'saas',
    nameSuggestion: 'Mon app web',
    highlights: [
      '10 modules PRD transcodés en feuille de route spiralaire',
      'Tables Utilisateurs & Tâches + données d’exemple',
      'Workflow d’invitation utilisateur automatisé',
    ],
    modules: [
      {
        key: 'tmpl_app_dashboard_starter',
        title: 'Dashboard starter',
        mission: 'Dashboard app générique.',
        style: 'Layout pro, 3–4 cards.',
        mapping: ['DashboardShell.tsx', 'StatsRow.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_app_auth_split',
        title: 'Auth split',
        mission: 'Template page login/inscription split.',
        style: 'Hero visuel + form.',
        mapping: ['AuthSplitLayout.tsx', 'AuthSidePanel.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_app_settings_center',
        title: 'Centre de paramètres',
        mission: 'Page paramètres utilisateur.',
        style: 'Tabs settings, cards sections.',
        mapping: ['SettingsTabs.tsx', 'SettingsCard.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_app_notifications_center',
        title: 'Centre de notifications',
        mission: 'Centre de notifications/boîte de réception.',
        style: 'Three-pane layout.',
        mapping: ['NotificationList.tsx', 'NotificationDetail.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_app_profile_public',
        title: 'Profil public',
        mission: 'Page profil publique (réseaux, stats).',
        style: 'Header profil, cards.',
        mapping: ['ProfileHeader.tsx', 'ProfileStats.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_app_inbox_layout',
        title: 'Layout inbox',
        mission: 'Layout style email/inbox.',
        style: 'Sidebar + thread list + detail.',
        mapping: ['InboxShell.tsx', 'ThreadList.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_app_kanban_board',
        title: 'Board Kanban',
        mission: 'Template board Kanban productivité.',
        style: 'Colonne drag-and-drop.',
        mapping: ['KanbanColumn.tsx', 'TaskCard.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_app_todo_minimal',
        title: 'To-do minimaliste',
        mission: 'App to-do minimaliste.',
        style: 'Mono-colonne, focus UX.',
        mapping: ['TodoList.tsx', 'TodoItem.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_app_notes_editor',
        title: 'Éditeur de notes',
        mission: 'App de notes type Notion light.',
        style: 'Blocks, sidebar.',
        mapping: ['NoteBlock.tsx', 'NoteSidebar.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_app_calendar_view',
        title: 'Vue agenda',
        mission: 'Vue agenda/calendrier app.',
        style: 'Month/week switch.',
        mapping: ['CalendarShell.tsx', 'EventPopover.tsx'],
        category: 'Frontend',
      },
    ],
    pages: [
      {
        name: 'Tableau de bord',
        components: [
          { type: 'heading', props: { text: 'Tableau de bord', level: 'h1', size: 'xl', color: 'emerald' } },
          { type: 'text', props: { text: 'Vue d’ensemble de l’activité : reliez vos tables pour alimenter les indicateurs en temps réel.', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
          { type: 'card', props: { text: 'Module du pack : Dashboard starter (DashboardShell.tsx, StatsRow.tsx)', color: 'emerald' } },
        ],
      },
      {
        name: 'Authentification',
        components: [
          { type: 'heading', props: { text: 'Connexion', level: 'h2', size: 'md', color: 'default' } },
          { type: 'input', props: { placeholder: 'Adresse e-mail' } },
          { type: 'input', props: { placeholder: 'Mot de passe' } },
          { type: 'button', props: { text: 'Se connecter', variant: 'default' } },
          { type: 'card', props: { text: 'Module du pack : Auth split — hero visuel + formulaire.', color: 'default' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Utilisateurs',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'email', type: 'string', required: true, unique: true },
          { name: 'role', type: 'string', defaultValue: 'member' },
          { name: 'actif', type: 'boolean' },
        ],
        rows: [
          { nom: 'Alice Martin', email: 'alice@exemple.com', role: 'admin', actif: true },
          { nom: 'Bob Durand', email: 'bob@exemple.com', role: 'member', actif: true },
        ],
      },
      {
        name: 'Tâches',
        fields: [
          { name: 'titre', type: 'string', required: true },
          { name: 'colonne', type: 'string', defaultValue: 'à faire' },
          { name: 'assigne', type: 'string' },
          { name: 'terminee', type: 'boolean' },
        ],
        rows: [
          { titre: 'Assembler le dashboard', colonne: 'en cours', assigne: 'Alice Martin', terminee: false },
          { titre: 'Écran de connexion split', colonne: 'à faire', assigne: 'Bob Durand', terminee: false },
          { titre: 'Board Kanban drag-and-drop', colonne: 'terminé', assigne: 'Alice Martin', terminee: true },
        ],
      },
    ],
    workflows: [
      {
        name: 'Invitation utilisateur',
        nodes: [
          { type: 'webhook', name: 'Invitation créée', config: { path: '/webhooks/invitations', method: 'POST' } },
          { type: 'condition', name: 'E-mail valide ?', config: { expression: 'email fourni' } },
          {
            type: 'email',
            name: 'E-mail d’invitation',
            config: {
              to: '{{invite.email}}',
              subject: 'Vous êtes invité(e) !',
              body: 'Bonjour, un compte vient d’être créé pour vous. Cliquez pour définir votre mot de passe et rejoindre l’espace.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'audio',
    label: 'Audio Pack',
    source: 'prd_packs/audio_pack',
    tagline: 'Librairie audio, lecteur podcast, waveform, transcription IA… 10 modules sonores.',
    description:
      'Projet lancé depuis le pack « Audio Pack » : 10 modules PRD (librairie de pistes, lecteur podcast, éditeur waveform, recorder, transcription, soundboard, métadonnées, playlists, snippets commentables) pour une plateforme audio.',
    icon: 'audio-lines',
    color: 'amber',
    baseType: 'saas',
    nameSuggestion: 'Ma plateforme audio',
    highlights: [
      '10 modules PRD audio (lecture, édition, transcription IA)',
      'Tables Pistes & Transcriptions + données d’exemple',
      'Workflow de transcription automatisé',
    ],
    modules: [
      {
        key: 'prd_audio_file_library',
        title: 'Librairie audio',
        mission: 'Librairie audio (pistes, podcasts).',
        style: 'List + waveform mini.',
        mapping: ['AudioLibrary.tsx', 'TrackRow.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_audio_player_podcast',
        title: 'Lecteur podcast',
        mission: 'Lecteur audio type podcast.',
        style: 'Speed, skip, chapters.',
        mapping: ['PodcastPlayer.tsx', 'ChapterMarkers.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_audio_waveform_editor',
        title: 'Éditeur waveform',
        mission: 'Éditeur waveform pour couper ou annoter.',
        style: 'Waveform interactif.',
        mapping: ['WaveformEditor.tsx', 'WaveMarker.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_audio_recording_widget',
        title: 'Recorder micro',
        mission: 'Recorder audio (micro) depuis le navigateur.',
        style: 'Big record button.',
        mapping: ['AudioRecorder.tsx', 'RecordingStatus.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_audio_transcript_viewer',
        title: 'Visionneuse de transcription',
        mission: 'Afficher/éditer transcription texte.',
        style: 'Transcript + time links.',
        mapping: ['TranscriptView.tsx', 'WordHighlight.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_audio_ai_transcribe',
        title: 'Transcription IA',
        mission: 'Transcrire audio → texte via IA.',
        style: 'Job status, segments.',
        mapping: ['TranscriptionJobList.tsx', 'SegmentEditor.tsx'],
        category: 'IA',
      },
      {
        key: 'prd_audio_soundboard_pack',
        title: 'Soundboard',
        mission: 'Pack de sons (soundboard).',
        style: 'Buttons grid.',
        mapping: ['SoundboardGrid.tsx', 'SoundButton.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_audio_metadata_editor',
        title: 'Éditeur de métadonnées',
        mission: 'Éditer tags ID3 (titre, artiste, cover).',
        style: 'Form + cover preview.',
        mapping: ['AudioMetaForm.tsx', 'CoverPreview.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_audio_mix_playlist',
        title: 'Playlists',
        mission: 'Créer playlists multi-fichiers.',
        style: 'List reorder drag.',
        mapping: ['AudioPlaylistEditor.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_audio_commentable_snippets',
        title: 'Snippets commentables',
        mission: 'Snippets audio commentables.',
        style: 'Wave snippet preview.',
        mapping: ['AudioSnippet.tsx', 'SnippetCommentList.tsx'],
        category: 'Frontend',
      },
    ],
    pages: [
      {
        name: 'Bibliothèque audio',
        components: [
          { type: 'heading', props: { text: 'Bibliothèque audio', level: 'h1', size: 'xl', color: 'amber' } },
          { type: 'text', props: { text: 'Vos pistes et podcasts, avec mini-waveform : importez, écoutez, organisez.', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
          { type: 'button', props: { text: 'Importer des pistes', variant: 'default' } },
        ],
      },
      {
        name: 'Lecteur',
        components: [
          { type: 'heading', props: { text: 'Lecteur podcast', level: 'h2', size: 'md', color: 'default' } },
          { type: 'card', props: { text: 'Épisode en cours — vitesse, skip et chapitres (PodcastPlayer.tsx).', color: 'amber' } },
          { type: 'text', props: { text: 'Module du pack : lecteur avec marqueurs de chapitres et lien vers la transcription.', size: 'sm', color: 'muted' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Pistes',
        fields: [
          { name: 'titre', type: 'string', required: true },
          { name: 'artiste', type: 'string' },
          { name: 'duree', type: 'number' },
          { name: 'publiee', type: 'boolean' },
        ],
        rows: [
          { titre: 'Épisode 1 — Bienvenue', artiste: 'Studio Forge', duree: 1845, publiee: true },
          { titre: 'Épisode 2 — Design system', artiste: 'Studio Forge', duree: 2210, publiee: true },
          { titre: 'Jingle intro', artiste: 'Studio Forge', duree: 12, publiee: false },
        ],
      },
      {
        name: 'Transcriptions',
        fields: [
          { name: 'piste', type: 'string', required: true },
          { name: 'langue', type: 'string', defaultValue: 'fr' },
          { name: 'statut', type: 'string', defaultValue: 'en attente' },
          { name: 'segments', type: 'json' },
        ],
        rows: [
          { piste: 'Épisode 1 — Bienvenue', langue: 'fr', statut: 'terminée', segments: '[{"t":0,"text":"Bienvenue dans le podcast"}]' },
          { piste: 'Épisode 2 — Design system', langue: 'fr', statut: 'en cours', segments: '[]' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Transcription IA',
        nodes: [
          { type: 'webhook', name: 'Piste importée', config: { path: '/webhooks/audio/import', method: 'POST' } },
          { type: 'code', name: 'Préparation du job', config: { code: 'return { ok: true, job: "transcribe", queuedAt: new Date().toISOString() }' } },
          {
            type: 'email',
            name: 'Transcription prête',
            config: {
              to: 'equipe@exemple.com',
              subject: 'Transcription terminée',
              body: 'La transcription d’une piste vient d’être finalisée et est disponible dans la bibliothèque.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'blog',
    label: 'Blog & Contenu Pack',
    source: 'prd_packs/blog_contenu_pack',
    tagline: 'Magazine, long-form, newsroom, docs, ressources… 10 modules éditoriaux.',
    description:
      'Projet lancé depuis le pack « Blog & Contenu Pack » : 10 modules PRD (magazine moderne, article long-form, hub de série, newsroom, portail docs, bibliothèque de ressources, changelog, page auteur, digest curation, recaps d’événements).',
    icon: 'newspaper',
    color: 'orange',
    baseType: 'blog',
    nameSuggestion: 'Mon média',
    highlights: [
      '10 modules PRD éditoriaux (magazine, docs, newsroom…)',
      'Table Articles catégorisée + données d’exemple',
      'Workflow de notification aux abonnés',
    ],
    modules: [
      {
        key: 'tmpl_blog_magazine_modern',
        title: 'Magazine moderne',
        mission: 'Blog style magazine moderne.',
        style: 'Cards visuelles, catégories.',
        mapping: ['MagazineGrid.tsx', 'CategoryNav.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_blog_single_post_longform',
        title: 'Article long-form',
        mission: 'Template article long-form.',
        style: 'Large typo, TOC sticky.',
        mapping: ['ArticleLayout.tsx', 'InlineToc.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_blog_series_hub',
        title: 'Hub de série',
        mission: 'Hub de série d’articles.',
        style: 'Cards numérotées, navigation série.',
        mapping: ['SeriesList.tsx', 'SeriesProgress.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_blog_newsroom',
        title: 'Newsroom / Presse',
        mission: 'Page « Newsroom / Press ».',
        style: 'Communiqués, mentions presse.',
        mapping: ['PressList.tsx', 'PressLogoRow.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_blog_docs_landing',
        title: 'Portail documentation',
        mission: 'Landing portail documentation.',
        style: 'Search dominantes, sections docs.',
        mapping: ['DocsLandingHero.tsx', 'DocsCategoryGrid.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_blog_resource_library',
        title: 'Bibliothèque de ressources',
        mission: 'Bibliothèque de ressources (pdf, vidéos, guides).',
        style: 'Grid filtrable.',
        mapping: ['ResourceGrid.tsx', 'ResourceFilter.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_blog_changelog_mini',
        title: 'Mini changelog',
        mission: 'Mini changelog intégré dans site.',
        style: 'Timeline compacte.',
        mapping: ['MiniChangelog.tsx', 'ChangeBadge.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_blog_author_profile',
        title: 'Page auteur',
        mission: 'Page auteur pour blog.',
        style: 'Bio, social links, articles.',
        mapping: ['AuthorHeader.tsx', 'AuthorPosts.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_blog_curated_digest',
        title: 'Digest curation',
        mission: 'Revue de presse, curation d’articles et digest éditorial.',
        style: 'Grille de synthèse, temps de lecture, citations clés.',
        mapping: ['CuratedDigest.tsx', 'DigestCard.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_blog_event_recaps',
        title: 'Recaps d’événements',
        mission: 'Template pour recaps d’événements répétés.',
        style: 'Cards par édition.',
        mapping: ['EventRecapCard.tsx', 'RecapGrid.tsx'],
        category: 'Frontend',
      },
    ],
    pages: [
      {
        name: 'Articles',
        components: [
          { type: 'heading', props: { text: 'Le magazine', level: 'h1', size: 'xl', color: 'orange' } },
          { type: 'text', props: { text: 'Articles classés par catégorie, façon magazine moderne : grille visuelle et navigation par catégorie.', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
          { type: 'button', props: { text: 'S’abonner à la newsletter', variant: 'outline' } },
        ],
      },
      {
        name: 'Lecture',
        components: [
          { type: 'heading', props: { text: 'Titre de l’article', level: 'h2', size: 'md', color: 'default' } },
          { type: 'text', props: { text: 'Template long-form : typo généreuse, table des matières collante et citations clés (ArticleLayout.tsx, InlineToc.tsx).', size: 'md', color: 'default' } },
          { type: 'card', props: { text: 'Temps de lecture estimé · Catégorie · Auteur', color: 'default' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Articles',
        fields: [
          { name: 'titre', type: 'string', required: true },
          { name: 'categorie', type: 'string' },
          { name: 'statut', type: 'string', defaultValue: 'brouillon' },
          { name: 'publie', type: 'boolean' },
        ],
        rows: [
          { titre: 'Guide : lancer son média en 30 jours', categorie: 'Guides', statut: 'publié', publie: true },
          { titre: 'Revue de presse de la semaine', categorie: 'Curation', statut: 'brouillon', publie: false },
          { titre: 'Annonce : refonte du magazine', categorie: 'Annonces', statut: 'planifié', publie: false },
        ],
      },
    ],
    workflows: [
      {
        name: 'Notifier les abonnés',
        nodes: [
          { type: 'webhook', name: 'Article publié', config: { path: '/webhooks/articles', method: 'POST' } },
          { type: 'condition', name: 'Statut publié ?', config: { expression: 'statut === publié' } },
          {
            type: 'email',
            name: 'Newsletter abonnés',
            config: {
              to: 'abonnes@exemple.com',
              subject: 'Nouvel article en ligne',
              body: 'Un nouvel article vient d’être publié. Venez le découvrir sur le magazine !',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'chat',
    label: 'Chat & Comms Pack',
    source: 'prd_packs/chat_comms_pack',
    tagline: 'Chat 1:1, groupes, threads, vocaux, présence, support bot… 10 modules de messagerie.',
    description:
      'Projet lancé depuis le pack « Chat & Comms Pack » : 10 modules PRD (chat 1:1, groupe, threads, réactions, pièces jointes, vocaux, présence, inbox, support bot, channel d’annonces) pour une messagerie complète.',
    icon: 'messages-square',
    color: 'rose',
    baseType: 'saas',
    nameSuggestion: 'Ma messagerie',
    highlights: [
      '10 modules PRD messagerie (temps réel, vocaux, support)',
      'Tables Conversations & Messages + données d’exemple',
      'Workflow de notification de nouveaux messages',
    ],
    modules: [
      {
        key: 'prd_mobile_chat_basic',
        title: 'Chat 1:1',
        mission: 'Chat 1:1 classique.',
        style: 'Bubbles align left/right.',
        mapping: ['ChatScreen.tsx', 'MessageBubble.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_chat_group',
        title: 'Chat de groupe',
        mission: 'Chat de groupe avec avatars, mentions.',
        style: 'Header group, member count.',
        mapping: ['GroupChatHeader.tsx', 'GroupMemberList.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_chat_threaded',
        title: 'Conversations threadées',
        mission: 'Conversations threadées (réponses à un message).',
        style: 'Thread preview.',
        mapping: ['ThreadPreview.tsx', 'ThreadedMessage.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_chat_reactions',
        title: 'Réactions',
        mission: 'Réactions aux messages (emoji long-press).',
        style: 'Popover emoji, counters.',
        mapping: ['MessageReactionBar.tsx', 'ReactionPicker.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_chat_attachments',
        title: 'Pièces jointes',
        mission: 'Envoi fichiers, images, audio.',
        style: 'Input row + preview bar.',
        mapping: ['AttachmentBar.tsx', 'AttachmentPreview.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_chat_voice_notes',
        title: 'Notes vocales',
        mission: 'Enregistrement et lecture de vocaux.',
        style: 'Hold-to-record UI.',
        mapping: ['VoiceRecordButton.tsx', 'VoiceMessageBubble.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_chat_presence',
        title: 'Présence & typing',
        mission: 'Indicateurs online / typing.',
        style: 'Subtle status dots.',
        mapping: ['TypingIndicator.tsx', 'PresenceDot.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_chat_inbox_list',
        title: 'Inbox des conversations',
        mission: 'Liste conversations type inbox.',
        style: 'Last message preview.',
        mapping: ['ChatList.tsx', 'ChatListItem.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_chat_support_bot',
        title: 'Support bot',
        mission: 'Chat support avec bot + fallback humain.',
        style: 'Bot tags, quick replies.',
        mapping: ['SupportChat.tsx', 'QuickReplyButtons.tsx'],
        category: 'IA',
      },
      {
        key: 'prd_mobile_chat_announcement',
        title: 'Channel d’annonces',
        mission: 'Channel read-only pour annonces.',
        style: 'Highlight messages.',
        mapping: ['AnnouncementChannel.tsx', 'PinnedBanner.tsx'],
        category: 'Frontend',
      },
    ],
    pages: [
      {
        name: 'Messagerie',
        components: [
          { type: 'heading', props: { text: 'Messagerie', level: 'h1', size: 'xl', color: 'rose' } },
          { type: 'text', props: { text: 'Conversations 1:1 et groupes : bulles alignées, threads, réactions et indicateurs de présence.', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 3 } },
          { type: 'input', props: { placeholder: 'Votre message…' } },
          { type: 'button', props: { text: 'Envoyer', variant: 'default' } },
        ],
      },
      {
        name: 'Annonces',
        components: [
          { type: 'heading', props: { text: 'Annonces', level: 'h2', size: 'md', color: 'default' } },
          { type: 'card', props: { text: 'Channel en lecture seule — messages épinglés et surlignés (AnnouncementChannel.tsx).', color: 'default' } },
          { type: 'text', props: { text: 'Module du pack : communication descendante, sans réponse possible.', size: 'sm', color: 'muted' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Conversations',
        fields: [
          { name: 'titre', type: 'string', required: true },
          { name: 'type', type: 'string', defaultValue: '1:1' },
          { name: 'participants', type: 'number' },
          { name: 'dernier_message', type: 'string' },
        ],
        rows: [
          { titre: 'Équipe produit', type: 'groupe', participants: 6, dernier_message: 'Alice : la build est verte ✅' },
          { titre: 'Alice ↔ Bob', type: '1:1', participants: 2, dernier_message: 'Bob : vu, je m’en occupe' },
          { titre: 'Support', type: 'bot', participants: 2, dernier_message: 'Bot : votre demande est transférée' },
        ],
      },
      {
        name: 'Messages',
        fields: [
          { name: 'conversation', type: 'string', required: true },
          { name: 'auteur', type: 'string' },
          { name: 'contenu', type: 'string' },
          { name: 'lu', type: 'boolean' },
        ],
        rows: [
          { conversation: 'Équipe produit', auteur: 'Alice Martin', contenu: 'La build est verte ✅', lu: true },
          { conversation: 'Équipe produit', auteur: 'Bob Durand', contenu: 'Top, je déploie en staging', lu: true },
          { conversation: 'Support', auteur: 'Bot', contenu: 'Votre demande est transférée à un humain', lu: false },
        ],
      },
    ],
    workflows: [
      {
        name: 'Notification nouveau message',
        nodes: [
          { type: 'webhook', name: 'Message envoyé', config: { path: '/webhooks/messages', method: 'POST' } },
          { type: 'condition', name: 'Destinataire absent ?', config: { expression: 'presence === offline' } },
          {
            type: 'email',
            name: 'E-mail de notification',
            config: {
              to: '{{destinataire.email}}',
              subject: 'Nouveau message',
              body: 'Vous avez reçu un nouveau message pendant votre absence. Ouvrez la messagerie pour le lire.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'commerce-paiement',
    label: 'Commerce & Paiement Pack',
    source: 'prd_packs/commerce_paiement_pack',
    tagline: 'Checkout one-page, panier, variantes, suivi, coupons, fidélité… 10 modules mobile-first.',
    description:
      'Projet lancé depuis le pack « Commerce & Paiement Pack » : 10 modules PRD mobile-first (checkout un écran, panier bottom-sheet, galerie produit, variantes, suivi de commande, moyens de paiement, abonnements, dons, coupons, wallet fidélité).',
    icon: 'credit-card',
    color: 'red',
    baseType: 'ecommerce',
    nameSuggestion: 'Ma boutique mobile',
    highlights: [
      '10 modules PRD commerce mobile-first (checkout, panier, fidélité)',
      'Tables Paiements & Abonnements + données d’exemple',
      'Workflow de confirmation de paiement',
    ],
    modules: [
      {
        key: 'prd_mobile_checkout_onepage',
        title: 'Checkout un écran',
        mission: 'Checkout mobile en un écran.',
        style: 'Sections collapsibles.',
        mapping: ['MobileCheckout.tsx', 'OrderSummary.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_cart_drawer',
        title: 'Panier bottom-sheet',
        mission: 'Panier en bottom sheet.',
        style: 'Swipe-up, swipe-down.',
        mapping: ['CartSheet.tsx', 'CartItemRow.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_product_gallery',
        title: 'Galerie produit',
        mission: 'Galerie produit (swipe images).',
        style: 'Zoom & swipe gestures.',
        mapping: ['ProductGalleryMobile.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_product_variants',
        title: 'Sélecteur de variantes',
        mission: 'Sélecteur de variantes (taille, couleur).',
        style: 'Pills, preview.',
        mapping: ['VariantSelectorMobile.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_order_tracking',
        title: 'Suivi de commande',
        mission: 'Suivi de commande en timeline.',
        style: 'Steps with icons.',
        mapping: ['OrderTrackingScreen.tsx', 'StatusStep.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_payment_methods',
        title: 'Moyens de paiement',
        mission: 'Gestion des moyens de paiement.',
        style: 'Cards, default badge.',
        mapping: ['PaymentMethodList.tsx', 'AddCardButton.tsx'],
        category: 'Backend',
      },
      {
        key: 'prd_mobile_subscription_manager',
        title: 'Gestion d’abonnements',
        mission: 'Gestion abonnements (plan, renouvellement).',
        style: 'Plan card, next billing.',
        mapping: ['SubscriptionScreen.tsx', 'PlanCard.tsx'],
        category: 'Backend',
      },
      {
        key: 'prd_mobile_tip_donation',
        title: 'Dons & pourboires',
        mission: 'Écran pour tips/dons rapides.',
        style: 'Slider montant.',
        mapping: ['TipAmountSlider.tsx', 'TipScreen.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_coupon_apply',
        title: 'Coupons',
        mission: 'Ajout coupons dans le flux.',
        style: 'Input + applied state.',
        mapping: ['CouponInput.tsx', 'CouponApplied.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_mobile_loyalty_wallet',
        title: 'Wallet fidélité',
        mission: 'Wallet points/fidélité.',
        style: 'Card, progress level.',
        mapping: ['LoyaltyWallet.tsx', 'PointsHistory.tsx'],
        category: 'Frontend',
      },
    ],
    pages: [
      {
        name: 'Paiement',
        components: [
          { type: 'heading', props: { text: 'Paiement en un écran', level: 'h1', size: 'xl', color: 'red' } },
          { type: 'text', props: { text: 'Tunnel one-page : sections collapsibles, résumé de commande et badges de confiance.', size: 'md', color: 'default' } },
          { type: 'input', props: { placeholder: 'Numéro de carte' } },
          { type: 'input', props: { placeholder: 'Code de sécurité' } },
          { type: 'button', props: { text: 'Payer maintenant', variant: 'default' } },
        ],
      },
      {
        name: 'Abonnements',
        components: [
          { type: 'heading', props: { text: 'Abonnements', level: 'h2', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
          { type: 'card', props: { text: 'Prochain prélèvement affiché sur la carte du plan (PlanCard.tsx).', color: 'default' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Paiements',
        fields: [
          { name: 'reference', type: 'string', required: true },
          { name: 'montant', type: 'number', required: true },
          { name: 'methode', type: 'string' },
          { name: 'statut', type: 'string', defaultValue: 'en attente' },
        ],
        rows: [
          { reference: 'PAY-1001', montant: 49, methode: 'carte', statut: 'validé' },
          { reference: 'PAY-1002', montant: 12.5, methode: 'wallet', statut: 'validé' },
          { reference: 'PAY-1003', montant: 89.9, methode: 'carte', statut: 'échoué' },
        ],
      },
      {
        name: 'Abonnements',
        fields: [
          { name: 'plan', type: 'string', required: true },
          { name: 'prix', type: 'number', required: true },
          { name: 'renouvellement', type: 'datetime' },
          { name: 'statut', type: 'string', defaultValue: 'actif' },
        ],
        rows: [
          { plan: 'Mensuel Plus', prix: 9.99, renouvellement: '2026-10-01T00:00:00.000Z', statut: 'actif' },
          { plan: 'Annuel Premium', prix: 89.99, renouvellement: '2027-09-01T00:00:00.000Z', statut: 'actif' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Paiement confirmé',
        nodes: [
          { type: 'webhook', name: 'Paiement reçu', config: { path: '/webhooks/payments', method: 'POST' } },
          { type: 'condition', name: 'Paiement validé ?', config: { expression: 'statut === validé' } },
          {
            type: 'email',
            name: 'Reçu de paiement',
            config: {
              to: '{{client.email}}',
              subject: 'Paiement confirmé',
              body: 'Votre paiement a bien été reçu. Votre reçu est disponible dans votre espace.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'composant',
    label: 'Composant Pack',
    source: 'prd_packs/composant_pack',
    tagline: 'Boutons (glow, ripple), modales (backdrop-blur), toasts — une lib d’UI premium.',
    description:
      'Projet lancé depuis le pack « Composant Pack » : modules PRD d’interface (tous les styles de boutons interactifs, fenêtres pop-up animées, notifications toast non-bloquantes) pour démarrer une librairie de composants premium.',
    icon: 'component',
    color: 'teal',
    baseType: 'website',
    nameSuggestion: 'Ma lib de composants',
    highlights: [
      'Modules PRD d’interface : boutons, modales, toasts',
      'Table Composants (revue d’accessibilité incluse)',
      'Workflow de revue de composant',
    ],
    modules: [
      {
        key: 'prd_ui_buttons',
        title: 'Boutons interactifs',
        mission: 'Tous les styles de boutons interactifs.',
        style: 'Neon glow, 3D press, Ripple effect, Loading spinner.',
        mapping: [],
        category: 'Design',
      },
      {
        key: 'prd_ui_modals',
        title: 'Modales & pop-up',
        mission: 'Fenêtres pop-up (Alertes, Confirmations, Formulaires).',
        style: 'Overlay flou (backdrop-blur), Animation de slide-up.',
        mapping: [],
        category: 'Design',
      },
      {
        key: 'prd_ui_toast',
        title: 'Notifications toast',
        mission: 'Notifications non-bloquantes (Succès, Erreur).',
        style: 'Toast flottant en bas à droite, Barre de progression.',
        mapping: [],
        category: 'Design',
      },
    ],
    pages: [
      {
        name: 'Galerie de composants',
        components: [
          { type: 'heading', props: { text: 'Galerie de composants', level: 'h1', size: 'xl', color: 'teal' } },
          { type: 'text', props: { text: 'Vitrine des composants du pack : boutons (glow, ripple, loading), modales animées et toasts.', size: 'md', color: 'default' } },
          { type: 'button', props: { text: 'Bouton principal', variant: 'default' } },
          { type: 'button', props: { text: 'Bouton secondaire', variant: 'secondary' } },
          { type: 'button', props: { text: 'Bouton outline', variant: 'outline' } },
          { type: 'card', props: { text: 'Modale de démonstration — overlay flou + slide-up (prd_ui_modals).', color: 'default' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Composants',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'categorie', type: 'string' },
          { name: 'statut', type: 'string', defaultValue: 'brouillon' },
          { name: 'accessible', type: 'boolean' },
        ],
        rows: [
          { nom: 'Button (glow / ripple / loading)', categorie: 'Actions', statut: 'publié', accessible: true },
          { nom: 'Modal (backdrop-blur, slide-up)', categorie: 'Feedback', statut: 'revue', accessible: true },
          { nom: 'Toast (barre de progression)', categorie: 'Feedback', statut: 'brouillon', accessible: false },
        ],
      },
    ],
    workflows: [
      {
        name: 'Revue de composant',
        nodes: [
          { type: 'webhook', name: 'Composant soumis', config: { path: '/webhooks/composants', method: 'POST' } },
          { type: 'condition', name: 'Accessible ?', config: { expression: 'accessibilité validée' } },
          {
            type: 'email',
            name: 'Demande de retours',
            config: {
              to: 'design@exemple.com',
              subject: 'Revue de composant à faire',
              body: 'Un composant attend votre revue (contraste, clavier, lecteur d’écran) avant publication.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'createur',
    label: 'Créateur Pack',
    source: 'prd_packs/createur_pack',
    tagline: 'Portfolio, link hub, podcast, formation, membership, CV… 10 modules pour créateurs.',
    description:
      'Projet lancé depuis le pack « Créateur Pack » : 10 modules PRD (portfolio minimaliste, link hub dark premium, blog personnel, page podcast, landing formation, site d’adhésion, galerie photo, CV interactif, promo livre, kit de sponsoring) pour un site de créateur.',
    icon: 'sparkles',
    color: 'stone',
    baseType: 'website',
    nameSuggestion: 'Mon site créateur',
    highlights: [
      '10 modules PRD créateurs (portfolio, podcast, membership…)',
      'Table Projets (portfolio) + données d’exemple',
      'Workflow de contact automatisé',
    ],
    modules: [
      {
        key: 'tmpl_creator_portfolio_minimal',
        title: 'Portfolio minimaliste',
        mission: 'Portfolio minimaliste (projets, stack, about).',
        style: 'Typo forte, beaucoup de blanc.',
        mapping: ['ProjectGrid.tsx', 'AboutBlock.tsx'],
        category: 'Design',
      },
      {
        key: 'tmpl_creator_linkhub_dark',
        title: 'Link hub dark',
        mission: 'Linktree-like version dark premium.',
        style: 'Cartes verre, glow.',
        mapping: ['LinkHubList.tsx', 'SocialIconRow.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_creator_personal_blog',
        title: 'Blog personnel',
        mission: 'Blog personnel avec page auteur.',
        style: 'Layout éditorial, images hero.',
        mapping: ['BlogHero.tsx', 'PostList.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_creator_podcast_page',
        title: 'Page podcast',
        mission: 'Page émission/podcast.',
        style: 'Player intégré, épisodes en liste.',
        mapping: ['PodcastHero.tsx', 'EpisodeList.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_creator_course_landing',
        title: 'Landing formation',
        mission: 'Landing pour une formation solo.',
        style: 'Hero instructeur, curriculum.',
        mapping: ['InstructorHero.tsx', 'CourseOutline.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_creator_membership_site',
        title: 'Site d’adhésion',
        mission: 'Landing pour membership communautaire.',
        style: 'Badges “tiers”, perks.',
        mapping: ['MembershipTiers.tsx', 'PerksGrid.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_creator_photo_gallery',
        title: 'Galerie photo',
        mission: 'Galerie photo responsive.',
        style: 'Masonry grid, lightbox.',
        mapping: ['PhotoGrid.tsx', 'Lightbox.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_creator_cv_online',
        title: 'CV interactif',
        mission: 'CV/Resume interactif.',
        style: 'Timeline pro, skills bar.',
        mapping: ['ResumeTimeline.tsx', 'SkillBars.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_creator_landing_book',
        title: 'Promo livre',
        mission: 'Page pour promo d’un livre/auteur.',
        style: 'Hero cover, reviews.',
        mapping: ['BookCoverHero.tsx', 'ReviewStrip.tsx'],
        category: 'Frontend',
      },
      {
        key: 'tmpl_creator_sponsorship_kit',
        title: 'Kit de sponsoring',
        mission: 'Page “Sponsor me” pour créateur.',
        style: 'Media kit, stats audience.',
        mapping: ['MediaKit.tsx', 'StatsPanel.tsx'],
        category: 'Frontend',
      },
    ],
    pages: [
      {
        name: 'Accueil',
        components: [
          { type: 'heading', props: { text: 'Bonjour, je suis <votre nom>', level: 'h1', size: 'xl', color: 'default' } },
          { type: 'text', props: { text: 'Créateur·rice : portfolio, podcast, formations et communauté — tout est réuni ici.', size: 'lg', color: 'default' } },
          { type: 'button', props: { text: 'Découvrir mon travail', variant: 'default' } },
          { type: 'card', props: { text: 'Module du pack : hero éditorial avec images (BlogHero.tsx).', color: 'default' } },
        ],
      },
      {
        name: 'Portfolio',
        components: [
          { type: 'heading', props: { text: 'Portfolio', level: 'h2', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 3 } },
          { type: 'text', props: { text: 'Grille de projets avec forte typographie et beaucoup de blanc (ProjectGrid.tsx).', size: 'sm', color: 'muted' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Projets',
        fields: [
          { name: 'titre', type: 'string', required: true },
          { name: 'type', type: 'string' },
          { name: 'lien', type: 'string' },
          { name: 'visible', type: 'boolean' },
        ],
        rows: [
          { titre: 'Refonte Studio Nord', type: 'Design', lien: 'https://exemple.com/nord', visible: true },
          { titre: 'Podcast « Forge »', type: 'Audio', lien: 'https://exemple.com/podcast', visible: true },
          { titre: 'Formation UX débutant', type: 'Cours', lien: 'https://exemple.com/formation', visible: false },
        ],
      },
    ],
    workflows: [
      {
        name: 'Nouveau message de contact',
        nodes: [
          { type: 'webhook', name: 'Contact reçu', config: { path: '/webhooks/contact', method: 'POST' } },
          {
            type: 'email',
            name: 'Accusé de réception',
            config: {
              to: '{{contact.email}}',
              subject: 'Merci pour votre message !',
              body: 'Bonjour et merci ! Je reviens vers vous très vite. À très bientôt.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'design',
    label: 'Design Figma/XD Pack',
    source: 'prd_packs/design_figma_xd_pack',
    tagline: 'Importer Figma/XD, synchroniser les tokens, redlines, hand-off… 10 modules design→dev.',
    description:
      'Projet lancé depuis le pack « Design Figma/XD Pack » : 10 modules PRD (import de frames Figma, sync de tokens, export d’assets, écrans Adobe XD, viewer de specs, flow diagram, matching de composants, redlines, hand-off pack, changelog design).',
    icon: 'pen-tool',
    color: 'zinc',
    baseType: 'dashboard',
    nameSuggestion: 'Mon pipeline design',
    highlights: [
      '10 modules PRD design→dev (tokens, specs, hand-off)',
      'Tables Tokens & Assets + données d’exemple',
      'Workflow de synchronisation planifiée',
    ],
    modules: [
      {
        key: 'prd_design_figma_importer',
        title: 'Import Figma',
        mission: 'Connecter un fichier Figma et lister frames.',
        style: 'Frames list, thumbnails.',
        mapping: ['FigmaFrameList.tsx', 'FramePreview.tsx'],
        category: 'Backend',
      },
      {
        key: 'prd_design_figma_token_sync',
        title: 'Sync des tokens',
        mission: 'Synchroniser design tokens Figma ↔ DS.',
        style: 'Map tokens UI.',
        mapping: ['TokenMappingTable.tsx', 'TokenSyncButton.tsx'],
        category: 'Backend',
      },
      {
        key: 'prd_design_figma_asset_export',
        title: 'Export d’assets',
        mission: 'Exporter assets (icons, images) depuis Figma.',
        style: 'Export queue.',
        mapping: ['AssetExportList.tsx', 'ExportSettings.tsx'],
        category: 'Backend',
      },
      {
        key: 'prd_design_xd_screen_importer',
        title: 'Import Adobe XD',
        mission: 'Importer écrans Adobe XD.',
        style: 'Screen gallery.',
        mapping: ['XdScreenGrid.tsx', 'XdScreenCard.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_design_spec_viewer',
        title: 'Viewer de specs',
        mission: 'Viewer specs design → dev (spacing, sizes).',
        style: 'Inspect overlay.',
        mapping: ['SpecOverlay.tsx', 'SpacingInspector.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_design_flow_diagram',
        title: 'Flow diagram',
        mission: 'Représenter le flow (frames reliées).',
        style: 'Graph view.',
        mapping: ['FlowGraph.tsx', 'FlowNode.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_design_component_matcher',
        title: 'Matching de composants',
        mission: 'Matcher composants DS ↔ composants design.',
        style: 'Matching table.',
        mapping: ['ComponentMatchTable.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_design_redline_annotator',
        title: 'Redlines',
        mission: 'Annoter maquettes (redlines).',
        style: 'Lines + labels.',
        mapping: ['RedlineLayer.tsx', 'AnnotationPanel.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_design_hand_off_pack',
        title: 'Pack hand-off',
        mission: 'Pack “hand-off” dev (zips, docs, liens).',
        style: 'Summary panel.',
        mapping: ['HandOffSummary.tsx', 'DownloadBundle.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_design_change_log',
        title: 'Changelog design',
        mission: 'Historique changements design.',
        style: 'Timeline delta.',
        mapping: ['DesignChangeList.tsx', 'ChangeDetail.tsx'],
        category: 'Frontend',
      },
    ],
    pages: [
      {
        name: 'Design tokens',
        components: [
          { type: 'heading', props: { text: 'Design tokens', level: 'h1', size: 'xl', color: 'zinc' } },
          { type: 'text', props: { text: 'Synchronisation des tokens Figma ↔ design system : couleurs, espacements, rayons.', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
          { type: 'button', props: { text: 'Synchroniser maintenant', variant: 'default' } },
        ],
      },
      {
        name: 'Hand-off',
        components: [
          { type: 'heading', props: { text: 'Hand-off dev', level: 'h2', size: 'md', color: 'default' } },
          { type: 'text', props: { text: 'Bundle prêt pour les développeurs : zips d’assets, docs et liens de specs (HandOffSummary.tsx).', size: 'md', color: 'default' } },
          { type: 'button', props: { text: 'Exporter le bundle', variant: 'outline' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Tokens',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'valeur', type: 'string', required: true },
          { name: 'categorie', type: 'string' },
          { name: 'source', type: 'string', defaultValue: 'figma' },
        ],
        rows: [
          { nom: 'color/surface', valeur: '#fafaf9', categorie: 'couleur', source: 'figma' },
          { nom: 'space/md', valeur: '16px', categorie: 'espacement', source: 'figma' },
          { nom: 'radius/lg', valeur: '12px', categorie: 'rayon', source: 'figma' },
        ],
      },
      {
        name: 'Assets',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'format', type: 'string' },
          { name: 'statut', type: 'string', defaultValue: 'en file' },
        ],
        rows: [
          { nom: 'logo-forge', format: 'svg', statut: 'exporté' },
          { nom: 'illustration-hero', format: 'png@2x', statut: 'en file' },
          { nom: 'icone-settings', format: 'svg', statut: 'exporté' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Sync Figma planifiée',
        nodes: [
          { type: 'timer', name: 'Toutes les 6h', config: { cron: '0 */6 * * *' } },
          { type: 'http', name: 'Récupération des tokens', config: { url: 'https://api.exemple.com/figma/tokens', method: 'GET' } },
          { type: 'code', name: 'Diff & préparation', config: { code: 'return { ok: true, changed: true, checkedAt: new Date().toISOString() }' } },
        ],
      },
    ],
  },
  {
    id: 'e-commerce',
    label: 'E-Commerce Pack',
    source: 'prd_packs/e_commerce_pack',
    tagline: 'Catalogue masonry à filtres + checkout one-page avec badges de confiance.',
    description:
      'Projet lancé depuis le pack « E-Commerce Pack » : modules PRD (affichage de produits avec filtres avancés — prix, taille, couleur ; tunnel de paiement ultra-optimisé one-page avec badges de confiance).',
    icon: 'shopping-bag',
    color: 'lime',
    baseType: 'ecommerce',
    nameSuggestion: 'Ma boutique',
    highlights: [
      'Modules PRD : catalogue filtrable + checkout one-page',
      'Tables Produits & Commandes + stock',
      'Workflow de confirmation de commande',
    ],
    modules: [
      {
        key: 'prd_ecom_catalog',
        title: 'Catalogue produits',
        mission: 'Affichage de produits avec filtres avancés (Prix, Taille, Couleur).',
        style: 'Grid Masonry, Hover effects, Infinite Scroll.',
        mapping: ['ProductGrid.tsx', 'FilterSidebar.tsx'],
        category: 'Frontend',
      },
      {
        key: 'prd_ecom_checkout',
        title: 'Checkout one-page',
        mission: 'Tunnel de paiement ultra-optimisé (One-page checkout).',
        style: 'Minimaliste, Trust badges (sécurité), Progress bar.',
        mapping: ['CheckoutForm.tsx', 'OrderSummary.tsx'],
        category: 'Frontend',
      },
    ],
    pages: [
      {
        name: 'Catalogue',
        components: [
          { type: 'heading', props: { text: 'Notre catalogue', level: 'h1', size: 'xl', color: 'default' } },
          { type: 'text', props: { text: 'Grille masonry avec effets de survol et scroll infini, filtres prix/taille/couleur en sidebar (ProductGrid.tsx).', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
          { type: 'button', props: { text: 'Voir le panier', variant: 'outline' } },
        ],
      },
      {
        name: 'Checkout',
        components: [
          { type: 'heading', props: { text: 'Finaliser la commande', level: 'h2', size: 'md', color: 'default' } },
          { type: 'input', props: { placeholder: 'Nom complet' } },
          { type: 'input', props: { placeholder: 'Adresse de livraison' } },
          { type: 'card', props: { text: '🔒 Paiement sécurisé — badges de confiance et barre de progression (CheckoutForm.tsx).', color: 'default' } },
          { type: 'button', props: { text: 'Payer maintenant', variant: 'default' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Produits',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'prix', type: 'number', required: true },
          { name: 'stock', type: 'number' },
          { name: 'actif', type: 'boolean' },
        ],
        rows: [
          { nom: 'T-shirt masonry', prix: 24.9, stock: 120, actif: true },
          { nom: 'Casquette filtres', prix: 19, stock: 60, actif: true },
          { nom: 'Tote bag checkout', prix: 14.5, stock: 0, actif: false },
        ],
      },
      {
        name: 'Commandes',
        fields: [
          { name: 'reference', type: 'string', required: true },
          { name: 'client', type: 'string' },
          { name: 'total', type: 'number' },
          { name: 'statut', type: 'string', defaultValue: 'en préparation' },
        ],
        rows: [
          { reference: 'CMD-3001', client: 'Marie Lefèvre', total: 43.9, statut: 'payée' },
          { reference: 'CMD-3002', client: 'Karim Benali', total: 19, statut: 'expédiée' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Confirmation de commande',
        nodes: [
          { type: 'webhook', name: 'Commande créée', config: { path: '/webhooks/orders', method: 'POST' } },
          { type: 'condition', name: 'Paiement validé ?', config: { expression: 'paiement === validé' } },
          {
            type: 'email',
            name: 'E-mail de confirmation',
            config: {
              to: '{{client.email}}',
              subject: 'Merci pour votre commande !',
              body: 'Votre commande est confirmée et en préparation. Vous recevrez un e-mail d’expédition très bientôt.',
            },
          },
        ],
      },
    ],
  },
  {
    id: 'diamond-bridge',
    label: 'Diamond Bridge Pack',
    source: 'prd_packs/diamond_bridge_v14_37',
    tagline: 'Extension navigateur Manifest V3 : service worker, content script, popup, message passing.',
    description:
      'Projet lancé depuis le pack « Diamond Bridge » : architecture d’extension navigateur (Manifest V3) — background service worker, content script injector, popup UI ultra-dense, message passing sécurisé et état persistant (chrome.storage.local).',
    icon: 'gem',
    color: 'yellow',
    baseType: 'api',
    nameSuggestion: 'Mon extension navigateur',
    highlights: [
      'Architecture extension Manifest V3 (CSP, storage local)',
      'Tables Permissions & Messages + données d’exemple',
      'Workflow de traitement des messages entrants',
    ],
    modules: [
      {
        key: 'extension_background_worker',
        title: 'Background service worker',
        mission: 'Le « cerveau » persistant de l’extension tournant en tâche de fond (Manifest V3).',
        style: 'Ultra-dense, sans marges excessives.',
        mapping: ['extension/background.js'],
        category: 'Backend',
      },
      {
        key: 'extension_content_injector',
        title: 'Content script injector',
        mission: 'Script injecté directement dans le DOM de la page cible pour interagir avec le HTML/CSS.',
        style: 'Injection isolée, sélecteurs résilients.',
        mapping: ['extension/content.js'],
        category: 'Backend',
      },
      {
        key: 'extension_popup_ui',
        title: 'Popup UI',
        mission: 'L’interface utilisateur apparaissant lorsqu’on clique sur l’icône de l’extension.',
        style: 'Popup ultra-dense (350 × 500), pas de marges excessives.',
        mapping: ['extension/popup.html', 'extension/popup.js'],
        category: 'Frontend',
      },
      {
        key: 'extension_message_passing',
        title: 'Message passing (ports)',
        mission: 'Système de communication sécurisé entre la Popup, le Content Script et le Service Worker.',
        style: 'Ports typés, validation des payloads.',
        mapping: ['extension/messaging.js'],
        category: 'Backend',
      },
      {
        key: 'extension_storage_state',
        title: 'Storage & CSP',
        mission: 'Sauvegarder l’état avec chrome.storage.local en respectant la Content Security Policy.',
        style: 'State minimal, permissions explicites.',
        mapping: ['extension/manifest.json', 'extension/storage.js'],
        category: 'Backend',
      },
    ],
    pages: [
      {
        name: 'Console d’extension',
        components: [
          { type: 'heading', props: { text: 'Console Diamond Bridge', level: 'h1', size: 'xl', color: 'default' } },
          { type: 'text', props: { text: 'Suivi des messages entre popup, content script et service worker (ports typés).', size: 'md', color: 'default' } },
          { type: 'table', props: { columns: 4 } },
          { type: 'card', props: { text: 'Popup 350 × 500 — interface ultra-dense, marges réduites.', color: 'default' } },
        ],
      },
    ],
    tables: [
      {
        name: 'Permissions',
        fields: [
          { name: 'nom', type: 'string', required: true },
          { name: 'portee', type: 'string' },
          { name: 'accordee', type: 'boolean' },
        ],
        rows: [
          { nom: 'activeTab', portee: 'onglet actif', accordee: true },
          { nom: 'storage', portee: 'état local', accordee: true },
          { nom: 'scripting', portee: 'injection content script', accordee: false },
        ],
      },
      {
        name: 'Messages',
        fields: [
          { name: 'canal', type: 'string', required: true },
          { name: 'direction', type: 'string' },
          { name: 'payload', type: 'json' },
          { name: 'statut', type: 'string', defaultValue: 'reçu' },
        ],
        rows: [
          { canal: 'popup→background', direction: 'sortant', payload: '{"type":"INJECT","tab":12}', statut: 'traité' },
          { canal: 'content→background', direction: 'entrant', payload: '{"type":"DOM_READY"}', statut: 'reçu' },
        ],
      },
    ],
    workflows: [
      {
        name: 'Message entrant',
        nodes: [
          { type: 'webhook', name: 'Message du content script', config: { path: '/webhooks/extension/messages', method: 'POST' } },
          { type: 'code', name: 'Validation du payload', config: { code: 'return { ok: true, validated: true, receivedAt: new Date().toISOString() }' } },
          {
            type: 'email',
            name: 'Alerte anomalie',
            config: {
              to: 'dev@exemple.com',
              subject: 'Anomalie extension',
              body: 'Un message d’extension invalide a été reçu et mis en quarantaine.',
            },
          },
        ],
      },
    ],
  },
]

/** Le pack par défaut proposé dans le wizard (aucune sélection → modèle classique). */
export const DEFAULT_PACK_ID = 'app-web'

/** Retrouve un pack par son id. */
export function getPack(id: string): ProjectPack | undefined {
  return PROJECT_PACKS.find((p) => p.id === id)
}

/** Garde de type : la valeur est-elle l'id d'un pack connu ? */
export function isPackId(id: string): boolean {
  return PROJECT_PACKS.some((p) => p.id === id)
}

// ─── Référence pack persistée sur le projet (Project.packJson) ──────────────

/** Ce qui est stocké dans Project.packJson pour les projets lancés depuis un pack. */
export interface ProjectPackRef {
  packId: string
  /** Clés des modules retenus à la création (ordre du catalogue conservé). */
  modules: string[]
}

/**
 * Parse sûr de Project.packJson. Retourne null si absent/corrompu/incohérent
 * (le projet retombe alors sur la roadmap de son type de base).
 */
export function parsePackRef(json: string | null | undefined): ProjectPackRef | null {
  if (!json) return null
  try {
    const raw: unknown = JSON.parse(json)
    if (typeof raw !== 'object' || raw === null) return null
    const { packId, modules } = raw as Record<string, unknown>
    if (typeof packId !== 'string' || !packId) return null
    if (!Array.isArray(modules) || modules.some((m) => typeof m !== 'string')) return null
    return { packId, modules: modules as string[] }
  } catch {
    return null
  }
}

/** Sérialise la référence pack (modules dédupliqués, clés valides uniquement). */
export function serializePackRef(pack: ProjectPack, moduleKeys?: string[]): string {
  const valid = new Set(pack.modules.map((m) => m.key))
  const selected = moduleKeys
    ? Array.from(new Set(moduleKeys.filter((k) => valid.has(k))))
    : pack.modules.map((m) => m.key)
  return JSON.stringify({ packId: pack.id, modules: selected } satisfies ProjectPackRef)
}
