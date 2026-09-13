// inject_guest_preorder_management.js
(function() {
  'use strict';

  const PRDS = {
    tmpl_preorder_management_dashboard: {
      name: 'Dashboard',
      description: 'Vue d\'ensemble des précommandes et annonces.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Dashboard

## Objectif
Fournir une vue d'ensemble des précommandes, des annonces et des statistiques clés.

## Fonctionnalités
- Afficher des cartes de statistiques : nombre total de précommandes, revenus générés, éditions spéciales réservées.
- Graphique d'évolution des précommandes sur les 30 derniers jours.
- Fil d'actualité des dernières annonces publiées.

## Composants à générer
- Dashboard.tsx : composant principal qui orchestre les sous-composants.
- StatCard.tsx : carte de statistique avec icône, valeur et tendance.
- RevenueChart.tsx : graphique en courbes des revenus.
- AnnouncementFeed.tsx : liste des annonces récentes.

## Design
- Dark mode avec glassmorphism.
- Utiliser des couleurs néon pour les accents.
- Les cartes doivent avoir un effet de survol avec élévation.

## Données
- Utiliser des données mockées pour la démo.
- Les données doivent être typées avec TypeScript.
[FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_preorder_management_announcements: {
      name: 'Annonces',
      description: 'Création et gestion des annonces officielles.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Annonces

## Objectif
Permettre aux administrateurs de créer et gérer des annonces officielles (comme le Newswire).

## Fonctionnalités
- Éditeur de contenu riche avec mise en forme (gras, italique, listes, images).
- Liste des annonces avec statut (brouillon, publié).
- Aperçu en direct de l'annonce avant publication.

## Composants à générer
- AnnouncementEditor.tsx : éditeur avec champs titre, contenu, image de couverture.
- AnnouncementList.tsx : tableau listant les annonces avec actions (éditer, publier, supprimer).
- RichTextEditor.tsx : éditeur WYSIWYG personnalisé.

## Design
- Interface épurée, avec des formulaires bien espacés.
- Boutons d'action avec icônes.

## Données
- Les annonces doivent avoir un identifiant, titre, contenu, statut, date de création.
[FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_preorder_management_preorders: {
      name: 'Précommandes',
      description: 'Gestion des précommandes des joueurs.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Précommandes

## Objectif
Gérer les précommandes des joueurs : création, modification, annulation.

## Fonctionnalités
- Tableau des précommandes avec filtres par jeu, édition, statut.
- Formulaire de précommande avec sélection du jeu, de l'édition, et informations du joueur.
- Détails de chaque précommande avec historique des modifications.

## Composants à générer
- PreorderTable.tsx : tableau avec pagination et filtres.
- PreorderForm.tsx : formulaire de création/édition.
- PreorderDetails.tsx : vue détaillée avec actions.

## Design
- Tableau responsive avec lignes cliquables.
- Formulaire avec validation en temps réel.

## Données
- Les précommandes doivent avoir un identifiant, jeu, édition, joueur, statut, date.
[FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_preorder_management_inventory: {
      name: 'Inventaire',
      description: 'Suivi des stocks des éditions.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Inventaire

## Objectif
Suivre les niveaux de stock des différentes éditions de jeux.

## Fonctionnalités
- Vue en temps réel des stocks avec jauge de niveau.
- Alertes de rupture de stock.
- Ajustement manuel des stocks.

## Composants à générer
- InventoryOverview.tsx : tableau des stocks avec jauges.
- StockAlert.tsx : composant d'alerte en cas de stock faible.
- InventoryAdjustment.tsx : formulaire pour ajuster les quantités.

## Design
- Utiliser des barres de progression colorées (vert, orange, rouge).
- Alertes avec icônes et animations.

## Données
- Les stocks doivent être liés à un jeu et une édition.
[FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_preorder_management_analytics: {
      name: 'Analytics',
      description: 'Analyse des tendances de précommandes.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Analytics

## Objectif
Analyser les tendances de précommandes, les pics de demande, et les performances des annonces.

## Fonctionnalités
- Graphiques interactifs : courbes, barres, camemberts.
- Filtres temporels (7 jours, 30 jours, 90 jours).
- Export des rapports en CSV.

## Composants à générer
- AnalyticsDashboard.tsx : conteneur principal avec sélecteur de période.
- TrendChart.tsx : graphique en courbes des précommandes.
- ReportExport.tsx : bouton d'export avec génération de fichier.

## Design
- Graphiques avec tooltips et légendes.
- Utiliser des couleurs néon pour les séries.

## Données
- Les données doivent être agrégées par jour.
[FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_preorder_management_notifications: {
      name: 'Notifications',
      description: 'Gestion des notifications aux joueurs.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Notifications

## Objectif
Envoyer des notifications aux joueurs : confirmations, rappels, mises à jour.

## Fonctionnalités
- Centre de notifications avec historique.
- Templates d'emails personnalisables.
- Paramètres de notification (canaux, fréquence).

## Composants à générer
- NotificationCenter.tsx : liste des notifications envoyées.
- EmailTemplate.tsx : éditeur de template avec variables dynamiques.
- NotificationSettings.tsx : formulaire de configuration.

## Design
- Interface avec onglets pour les différents canaux.
- Aperçu des emails avant envoi.

## Données
- Les notifications doivent avoir un type, destinataire, contenu, date.
[FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_preorder_management_users: {
      name: 'Utilisateurs',
      description: 'Gestion des comptes utilisateurs.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Utilisateurs

## Objectif
Gérer les comptes utilisateurs (joueurs, administrateurs, éditeurs).

## Fonctionnalités
- Liste des utilisateurs avec recherche et filtres.
- Profil utilisateur avec informations détaillées.
- Gestion des rôles et permissions.

## Composants à générer
- UserList.tsx : tableau des utilisateurs.
- UserProfile.tsx : vue détaillée du profil.
- RoleManager.tsx : interface pour assigner des rôles.

## Design
- Utiliser des avatars et des badges de rôle.
- Formulaire de modification avec validation.

## Données
- Les utilisateurs doivent avoir un identifiant, nom, email, rôle.
[FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_preorder_management_payments: {
      name: 'Paiements',
      description: 'Traitement des paiements et remboursements.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Paiements

## Objectif
Traiter les paiements des précommandes et gérer les remboursements.

## Fonctionnalités
- Intégration d'une passerelle de paiement (simulée).
- Historique des transactions avec statut.
- Gestion des remboursements avec motif.

## Composants à générer
- PaymentGateway.tsx : formulaire de paiement simulé.
- TransactionHistory.tsx : tableau des transactions.
- RefundManager.tsx : interface pour initier un remboursement.

## Design
- Utiliser des icônes de carte de crédit.
- Les transactions doivent avoir un code couleur selon le statut.

## Données
- Les transactions doivent avoir un identifiant, montant, statut, date.
[FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_preorder_management_special_editions: {
      name: 'Éditions Spéciales',
      description: 'Gestion des éditions spéciales et bonus.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Éditions Spéciales

## Objectif
Gérer les éditions spéciales (collector, steelbook) avec leurs bonus.

## Fonctionnalités
- Catalogue des éditions spéciales avec images et descriptions.
- Gestion des bonus (contenu exclusif, objets physiques).
- Allocation des éditions aux précommandes.

## Composants à générer
- SpecialEditionCatalog.tsx : grille des éditions.
- BonusManager.tsx : formulaire pour ajouter/modifier des bonus.
- EditionAllocation.tsx : interface pour assigner une édition à une précommande.

## Design
- Cartes avec images et badges.
- Drag-and-drop pour l'allocation.

## Données
- Les éditions doivent avoir un identifiant, nom, description, bonus.
[FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_preorder_management_settings: {
      name: 'Paramètres',
      description: 'Configuration globale de la plateforme.',
      context: `[CONTEXTE CACHÉ]
# PRD pour Paramètres

## Objectif
Configurer les paramètres globaux : devises, langues, intégrations.

## Fonctionnalités
- Formulaire de configuration avec validation.
- Gestion des intégrations API (clés, endpoints).
- Préférences système (thème, langue).

## Composants à générer
- SettingsForm.tsx : formulaire de paramètres.
- IntegrationManager.tsx : liste des intégrations avec activation.
- SystemPreferences.tsx : préférences d'affichage.

## Design
- Utiliser des toggles pour les options binaires.
- Section avec onglets.

## Données
- Les paramètres doivent être stockés dans le localStorage.
[FIN DU CONTEXTE CACHÉ]`
    }
  };

  function injectText(templateName) {
    const prd = PRDS[templateName];
    if (!prd) return;
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.value = prd.context;
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.style.cssText = 'position:fixed; bottom:20px; right:20px; background:#1a1a1a; padding:10px; border-radius:8px; z-index:9999; font-family:Arial;';
    const title = document.createElement('div');
    title.textContent = 'Inject PRD';
    title.style.cssText = 'color:#fff; font-weight:bold; margin-bottom:8px;';
    menu.appendChild(title);
    Object.keys(PRDS).forEach(key => {
      const btn = document.createElement('button');
      btn.textContent = PRDS[key].name;
      btn.style.cssText = 'display:block; width:100%; margin:4px 0; padding:8px; background:#333; color:#fff; border:none; border-radius:4px; cursor:pointer;';
      btn.onclick = () => injectText(key);
      menu.appendChild(btn);
    });
    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();