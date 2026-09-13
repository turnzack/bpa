(function() {
  'use strict';

  const PRDS = {
    tmpl_fireguard_ai_dashboard: {
      title: 'Dashboard FireGuard AI',
      description: 'Vue d\'ensemble en temps réel de la sécurité incendie.',
      context: `[CONTEXTE CACHÉ] Le dashboard doit afficher les données de capteurs IoT en temps réel, les alertes actives, et les scores de risque par site. Il doit être visuellement attrayant avec des graphiques et une carte interactive. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Mode sombre, glassmorphism, cartes avec statistiques, graphiques de tendance, jauge de risque, carte du site.',
      components: ['Dashboard.tsx', 'StatCard.tsx', 'RiskGauge.tsx', 'TrendChart.tsx', 'SiteMap.tsx']
    },
    tmpl_fireguard_ai_sensor_management: {
      title: 'Gestion des Capteurs',
      description: 'Gérer les capteurs IoT.',
      context: `[CONTEXTE CACHÉ] La gestion des capteurs doit permettre d'ajouter, modifier, supprimer et consulter l'historique des lectures. Les capteurs ont un type (température, fumée, gaz), un statut (actif, inactif, maintenance), et un site associé. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Tableau avec filtres, formulaires modaux, détails avec historique.',
      components: ['SensorList.tsx', 'SensorForm.tsx', 'SensorDetail.tsx', 'SensorHistory.tsx']
    },
    tmpl_fireguard_ai_risk_analysis: {
      title: 'Analyse des Risques',
      description: 'Calculer et visualiser les risques.',
      context: `[CONTEXTE CACHÉ] L'analyse des risques doit combiner les données des capteurs, les conditions météo, et les caractéristiques du bâtiment pour produire un score de risque. Le module doit permettre de configurer les pondérations des facteurs. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Jauges, heatmap, liste des facteurs, formulaire de configuration.',
      components: ['RiskAnalysis.tsx', 'RiskHeatmap.tsx', 'RiskFactors.tsx', 'RiskModelConfig.tsx']
    },
    tmpl_fireguard_ai_alert_system: {
      title: 'Système d\'Alertes',
      description: 'Gérer les alertes en temps réel.',
      context: `[CONTEXTE CACHÉ] Le système d'alertes doit déclencher des notifications en cas de dépassement de seuil, permettre la configuration des canaux (email, SMS, push) et des politiques d'escalade. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Centre de notifications, cartes d\'alerte, paramètres de notification, politique d\'escalade.',
      components: ['AlertCenter.tsx', 'AlertCard.tsx', 'NotificationSettings.tsx', 'EscalationPolicy.tsx']
    },
    tmpl_fireguard_ai_evacuation_planner: {
      title: 'Planificateur d\'Évacuation',
      description: 'Créer des plans d\'évacuation.',
      context: `[CONTEXTE CACHÉ] Le planificateur doit permettre de dessiner des plans d'étage, placer des issues de secours, et simuler des évacuations pour optimiser les chemins. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Éditeur de plan, simulation, affichage des chemins.',
      components: ['EvacuationPlanner.tsx', 'FloorPlanEditor.tsx', 'EvacuationSimulation.tsx', 'ExitPath.tsx']
    },
    tmpl_fireguard_ai_incident_response: {
      title: 'Réponse aux Incidents',
      description: 'Coordonner les interventions.',
      context: `[CONTEXTE CACHÉ] En cas d'incident, le module doit permettre d'assigner des équipes, suivre les actions en temps réel, et communiquer. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Timeline, liste des intervenants, suivi des actions.',
      components: ['IncidentResponse.tsx', 'IncidentTimeline.tsx', 'TeamAssignment.tsx', 'ActionTracker.tsx']
    },
    tmpl_fireguard_ai_weather_integration: {
      title: 'Intégration Météo',
      description: 'Intégrer les données météo.',
      context: `[CONTEXTE CACHÉ] L'intégration météo doit fournir des données en temps réel et historiques pour améliorer les prédictions de risque. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Widgets météo, graphiques historiques, corrélations.',
      components: ['WeatherWidget.tsx', 'WeatherHistory.tsx', 'WeatherCorrelation.tsx']
    },
    tmpl_fireguard_ai_maintenance_scheduler: {
      title: 'Planificateur de Maintenance',
      description: 'Planifier la maintenance.',
      context: `[CONTEXTE CACHÉ] Le planificateur doit gérer les tâches de maintenance préventive pour les équipements de sécurité, avec rappels et suivi. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Calendrier, liste de tâches, rappels.',
      components: ['MaintenanceScheduler.tsx', 'MaintenanceCalendar.tsx', 'MaintenanceTask.tsx']
    },
    tmpl_fireguard_ai_reporting: {
      title: 'Génération de Rapports',
      description: 'Générer des rapports.',
      context: `[CONTEXTE CACHÉ] Le module de reporting doit permettre de créer des rapports personnalisés sur les incidents, les risques, et la conformité, avec export PDF/CSV. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Générateur de rapports, modèles, export.',
      components: ['ReportGenerator.tsx', 'ReportTemplate.tsx', 'ReportExport.tsx']
    },
    tmpl_fireguard_ai_settings: {
      title: 'Paramètres',
      description: 'Gérer les paramètres.',
      context: `[CONTEXTE CACHÉ] Les paramètres doivent inclure la gestion des utilisateurs, des rôles, et des préférences système. [FIN DU CONTEXTE CACHÉ]`,
      design: 'Gestion des utilisateurs, rôles, préférences.',
      components: ['Settings.tsx', 'UserManagement.tsx', 'RolePermissions.tsx', 'SystemPreferences.tsx']
    }
  };

  function injectText(templateId) {
    const prd = PRDS[templateId];
    if (!prd) return;
    const text = `# ${prd.title}\n\n${prd.description}\n\n${prd.context}\n\n## Design Requis\n${prd.design}\n\n## Composants à générer\n${prd.components.join(', ')}\n`;
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
      const start = activeElement.selectionStart;
      const end = activeElement.selectionEnd;
      activeElement.value = activeElement.value.substring(0, start) + text + activeElement.value.substring(end);
      activeElement.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
      console.log('PRD à injecter :', text);
    }
  }

  function createMenu() {
    const menu = document.createElement('div');
    menu.style.position = 'fixed';
    menu.style.bottom = '20px';
    menu.style.right = '20px';
    menu.style.zIndex = '9999';
    menu.style.backgroundColor = '#1D3557';
    menu.style.padding = '10px';
    menu.style.borderRadius = '8px';
    menu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    menu.style.fontFamily = 'Arial, sans-serif';

    Object.keys(PRDS).forEach(templateId => {
      const btn = document.createElement('button');
      btn.textContent = PRDS[templateId].title;
      btn.style.display = 'block';
      btn.style.margin = '5px 0';
      btn.style.padding = '8px 12px';
      btn.style.backgroundColor = '#E63946';
      btn.style.color = '#fff';
      btn.style.border = 'none';
      btn.style.borderRadius = '4px';
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', () => injectText(templateId));
      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
  }

  setTimeout(createMenu, 3000);
})();