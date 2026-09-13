(function() {
  'use strict';

  const PRDS = {
    tmpl_gta_vi_store_hero: {
      name: 'Hero Section',
      description: 'Section héroïque avec vidéo de fond, titre animé et CTA.',
      context: `[CONTEXTE CACHÉ]
        Le module Hero doit captiver l'utilisateur dès la première seconde. Utiliser une vidéo de fond (bande-annonce) avec un overlay dégradé sombre pour la lisibilité. Le titre principal doit être en gros caractères avec une animation de fondu. Les boutons doivent être proéminents : "Précommander" et "Voir la bande-annonce".
      [FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_gta_vi_store_editions: {
      name: 'Éditions',
      description: 'Présentation des éditions du jeu avec prix et avantages.',
      context: `[CONTEXTE CACHÉ]
        Afficher trois éditions : Standard, Deluxe, Ultimate. Chaque carte doit avoir un badge (populaire, meilleure valeur), le prix, et la liste des avantages. Au survol, la carte doit s'illuminer avec une bordure néon. Un bouton "Sélectionner" doit être présent.
      [FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_gta_vi_store_screenshots: {
      name: 'Captures d\'écran',
      description: 'Galerie de captures d\'écran immersive.',
      context: `[CONTEXTE CACHÉ]
        Créer un carrousel horizontal avec des captures d'écran du jeu. Chaque image doit être cliquable pour ouvrir un lightbox en plein écran. Les miniatures en dessous permettent une navigation rapide. Les transitions doivent être fluides avec un effet de glissement.
      [FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_gta_vi_store_trailer: {
      name: 'Bande-annonce',
      description: 'Lecteur vidéo intégré pour la bande-annonce.',
      context: `[CONTEXTE CACHÉ]
        Intégrer un lecteur vidéo personnalisé avec les contrôles de lecture, de volume, et de plein écran. La vidéo doit être la bande-annonce officielle de GTA VI. Ajouter un bouton pour ouvrir la vidéo dans une modale si nécessaire.
      [FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_gta_vi_store_features: {
      name: 'Fonctionnalités',
      description: 'Mise en avant des caractéristiques clés du jeu.',
      context: `[CONTEXTE CACHÉ]
        Présenter les fonctionnalités sous forme de grille avec des icônes. Chaque fonctionnalité doit avoir un titre et une description. Utiliser des animations au scroll pour révéler les éléments. Les icônes doivent être personnalisées et cohérentes avec le thème.
      [FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_gta_vi_store_preorder: {
      name: 'Précommande',
      description: 'Processus de précommande en plusieurs étapes.',
      context: `[CONTEXTE CACHÉ]
        Le formulaire de précommande doit guider l'utilisateur à travers plusieurs étapes : sélection de l'édition, choix de la plateforme, informations de paiement, et confirmation. Une barre de progression doit indiquer l'étape actuelle. Le récapitulatif doit être affiché avant la confirmation finale.
      [FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_gta_vi_store_community: {
      name: 'Communauté',
      description: 'Espace communautaire avec actualités et événements.',
      context: `[CONTEXTE CACHÉ]
        Afficher un fil d'actualités avec les dernières nouvelles du jeu. Inclure des cartes d'événements à venir (lancement, tournois). Permettre aux utilisateurs de commenter et de réagir. Le design doit être dynamique et engageant.
      [FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_gta_vi_store_social: {
      name: 'Réseaux sociaux',
      description: 'Intégration des réseaux sociaux et partage.',
      context: `[CONTEXTE CACHÉ]
        Ajouter des boutons de partage pour les réseaux sociaux (Twitter, Facebook, Instagram). Intégrer un flux social affichant les posts récents liés au jeu. Afficher des compteurs de likes et de partages.
      [FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_gta_vi_store_faq: {
      name: 'FAQ',
      description: 'Section de questions fréquentes.',
      context: `[CONTEXTE CACHÉ]
        Créer une FAQ en accordéon avec les questions courantes sur la précommande, les éditions, et la livraison. Ajouter une barre de recherche pour filtrer les questions. Fournir un lien de contact pour les questions non résolues.
      [FIN DU CONTEXTE CACHÉ]`
    },
    tmpl_gta_vi_store_footer: {
      name: 'Pied de page',
      description: 'Footer avec liens et newsletter.',
      context: `[CONTEXTE CACHÉ]
        Le footer doit contenir plusieurs colonnes : navigation, support, légal, et réseaux sociaux. Inclure un formulaire d'inscription à la newsletter. Le design doit être cohérent avec le thème sombre.
      [FIN DU CONTEXTE CACHÉ]`
    }
  };

  function injectText(templateId, text) {
    const element = document.getElementById(templateId);
    if (element) {
      element.innerHTML = text;
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.right = '10px';
    menu.style.zIndex = '9999';
    menu.style.backgroundColor = '#333';
    menu.style.padding = '10px';
    menu.style.borderRadius = '5px';
    menu.style.fontFamily = 'Arial';

    const title = document.createElement('strong');
    title.textContent = 'GTA VI STORE';
    title.style.color = '#fff';
    menu.appendChild(title);

    Object.keys(PRDS).forEach(function(key) {
      const btn = document.createElement('button');
      btn.textContent = PRDS[key].name;
      btn.style.display = 'block';
      btn.style.margin = '5px 0';
      btn.style.padding = '5px';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', function() {
        injectText(key, PRDS[key].context);
      });
      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();