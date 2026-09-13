import { ShieldCheck, ShoppingCart, CreditCard, Layout, Smartphone, Newspaper, Trophy, Settings, Box, Database, Image as ImageIcon, Video, PenTool, Globe, Server, User, Mic, FileText, Component, MessageSquare, Gamepad2 } from 'lucide-react';

const getIconForPack = (id: string) => {
  if (id.includes('auth') || id.includes('stealth')) return ShieldCheck;
  if (id.includes('ecom') || id.includes('commerce') || id.includes('produit')) return ShoppingCart;
  if (id.includes('billing') || id.includes('paiement')) return CreditCard;
  if (id.includes('layout') || id.includes('interface')) return Layout;
  if (id.includes('mobile')) return Smartphone;
  if (id.includes('blog') || id.includes('texte') || id.includes('markdown')) return Newspaper;
  if (id.includes('game') || id.includes('gamification')) return Trophy;
  if (id.includes('sqlite') || id.includes('scraper')) return Database;
  if (id.includes('image')) return ImageIcon;
  if (id.includes('video') || id.includes('audio')) return Video;
  if (id.includes('design') || id.includes('createur')) return PenTool;
  if (id.includes('web') || id.includes('saas') || id.includes('landing')) return Globe;
  if (id.includes('ia_') || id.includes('prompt')) return BotIcon;
  if (id.includes('chat') || id.includes('social')) return MessageSquare;
  if (id.includes('composant') || id.includes('widget') || id.includes('forms')) return Component;
  if (id.includes('pdf') || id.includes('pieces_jointes')) return FileText;
  if (id.includes('mock') || id.includes('bridge') || id.includes('engine')) return Server;
  return Box;
};

// Icône Bot de secours si introuvable dans lucide
const BotIcon = Server;

const getColorForPack = (id: string) => {
  const colors = [
    'bg-red-500/10 text-red-500', 'bg-blue-500/10 text-blue-500', 
    'bg-emerald-500/10 text-emerald-500', 'bg-purple-500/10 text-purple-500',
    'bg-orange-500/10 text-orange-500', 'bg-pink-500/10 text-pink-500',
    'bg-yellow-500/10 text-yellow-500', 'bg-cyan-500/10 text-cyan-500',
    'bg-indigo-500/10 text-indigo-500', 'bg-teal-500/10 text-teal-500'
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const rawPacks = [
  "app_web_pack", "audio_pack", "blog_contenu_pack", "chat_comms_pack", "commerce_paiement_pack", 
  "composant_pack", "createur_pack", "design_figma_xd_pack", "diamond_bridge_v14_37", "e_commerce_pack", 
  "ecommerce_pack", "evenement_pack", "feed_social_pack", "forge_universelle", "forms_inputs_pack", 
  "formulaire_pack", "gamification_pack", "health_fitness_pack", "ia_pack", "image_pack", 
  "interface_pack", "jeux_video_pack", "landing_pack", "landing_saas_pack", "layout_pack", 
  "local_maps_pack", "markdown_pack", "marketing_pack", "mobile_pack", "mobile_shell_pack", 
  "mobile_web_pack", "mock_master", "pdf_docs_pack", "pieces_jointes_pack", "prd_ai_apps_pack", 
  "prd_ai_voice_agent", "prd_auth_gateway", "prd_blog_magazine", "prd_crm_erp_pack", "prd_ecom_catalog", 
  "prd_ecom_checkout", "prd_ecom_digital_products", "prd_game_leaderboard", "prd_layout_bento", "prd_layout_kanban", 
  "prd_mobile_pack", "prd_mobile_social", "prd_saas_billing_pro", "prd_saas_pack", "prd_specs_pack", 
  "prd_web_landing_pack", "productivity_pack", "produit_pack", "prompt_skills_pack", "saas_pack", 
  "specialise_pack", "sqlite_inspector", "stealth_bridge_v11_2", "texte_pack", "universal_scraper", 
  "video_pack", "web_blog_pack", "widget_pack", "guest_nebula_calc"
];

export const ALL_PRD_PACKS = rawPacks.map(id => ({
  id,
  name: id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
  icon: getIconForPack(id),
  color: getColorForPack(id)
}));
