

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { PdfTemplates } from './pdfTemplates';

export const PdfGenerator = {

    async generateAndShare(html, filename) {
        try {
            if (!html) {
                console.error("❌ [PdfGenerator] Tentative d'impression de contenu vide !");
                return;
            }

            if (Platform.OS === 'web') {
                // SOLUTION ROBUSTE WEB : Iframe masquée
                // On évite expo-print sur web qui peut parfois imprimer la window principale si l'argument est mal passé
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none'; // Masquer l'iframe
                // Mais pour que le print fonctionne sur certains navigateurs, il faut parfois qu'elle soit "visible" mais hors écran
                iframe.style.position = 'fixed';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '1px';
                iframe.style.height = '1px';
                iframe.style.opacity = '0';

                document.body.appendChild(iframe);

                const iframeDoc = iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(html);
                iframeDoc.close();

                // Attendre que le contenu soit chargé (images, styles)
                setTimeout(() => {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();

                    // Nettoyage après impression (délai suffisant pour que le dialog s'ouvre)
                    setTimeout(() => {
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                        }
                    }, 2000);
                }, 500);

            } else {
                const { uri } = await Print.printToFileAsync({
                    html: html,
                    base64: false
                });
                await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw error;
        }
    },

    // --- Dynamic Helper ---
    async renderDynamically(htmlContent, data) {
        // INJECTION CSS IMPRESSION PROPRE (Supprime en-têtes/pieds de page navigateur)
        const printCss = `<style>@media print { @page { size: auto; margin: 0mm; } body { margin: 0; } }</style>`;
        if (!htmlContent.includes('@page { margin: 0; }')) {
            if (htmlContent.includes('</head>')) {
                htmlContent = htmlContent.replace('</head>', `${printCss}</head>`);
            } else {
                htmlContent = printCss + htmlContent;
            }
        }

        console.log('🔍 [RENDER MOUCHARD] Début rendu dynamique (Handlebars)');
        console.log('🔍 [RENDER MOUCHARD] Taille HTML entrée:', htmlContent?.length);
        console.log('🔍 [RENDER MOUCHARD] Clés data:', Object.keys(data || {}));

        try {
            const Handlebars = require('handlebars');

            // Enregistrer des helpers utiles si nécessaire
            Handlebars.registerHelper('eq', function (a, b) {
                return a === b;
            });

            // ⚠️ FIX DATA: Calcul dynamique du taux TVA pour affichage
            // On prend toujours la priorité sur items[0].tva si disponible pour refléter les changements en temps réel
            if (data) {
                if (data.items && data.items.length > 0) {
                    // Force l'update avec le taux du premier item (converti en nombre si nécessaire)
                    data.taux_tva = Number(data.items[0].tva || 0);
                } else if (data.taux_tva === undefined || data.taux_tva === null) {
                    // Fallback par défaut si pas d'items et pas de taux défini
                    data.taux_tva = 20;
                }
                console.log('🔧 [RENDER FIX] Taux TVA utilisé:', data.taux_tva);
            }

            // ⚠️ FIX DESIGN: Groupage visuel des articles (éviter de répéter le titre Métier/Catégorie à chaque ligne)
            if (data && data.items) {
                for (let i = 0; i < data.items.length; i++) {
                    const current = data.items[i];
                    const prev = i > 0 ? data.items[i - 1] : null;

                    // On affiche le header SI c'est le 1er item, OU si le métier/catégorie change par rapport au précédent
                    if (!prev || current.metier !== prev.metier || current.categorie !== prev.categorie) {
                        current.show_metier_header = true;
                    } else {
                        current.show_metier_header = false;
                    }
                }
            }

            // ⚠️ FIX : Correction à la volée des erreurs de syntaxe connues dans les templates
            // Le template stocké en base a une erreur : index: {{@index}} au lieu de index: '{{@index}}'
            let sanitizedHtml = htmlContent;

            // ⚠️ FIX GLOBAL: Beaucoup de templates utilisent {{devis.total_ht}} alors que la donnée est à la racine.
            // On supprime le préfixe 'devis.' partout pour rendre les variables accessibles directement.
            if (sanitizedHtml.includes('{{devis.')) {
                console.log('🔧 [RENDER FIX] Suppression des préfixes "devis." détectés');
                sanitizedHtml = sanitizedHtml.replace(/\{\{devis\./g, '{{');
            }

            // 🚨 DEBUG FORCE: Bâtiment & Moderne ne répondent pas. On force le code ici pour tester.
            // Si data.template_code n'est pas dispo, on tente de le deviner via le contenu ou on passe.
            // (Note: renderDynamically ne reçoit que htmlContent et data, on ne connait pas le nom du template facilement sauf si on le cherche)

            // DÉTECTION DU TEMPLATE VIA SON TITRE OU STYLE UNIQUE
            if (htmlContent.includes('Template Bâtiment') || htmlContent.includes('#e67e22')) {

                sanitizedHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=0.6, user-scalable=yes">
    <title>Devis - Template Bâtiment</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #2c3e50; background: #ffffff; }
        .container { max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; min-height: 297mm; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #e67e22, #d35400); color: white; border-radius: 8px; }
        .logo { width: 70px; height: 70px; background: white; color: #e67e22; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-bottom: 15px; }
        .company-info { flex: 2; text-align: right; }
        .company-name { font-size: 26px; font-weight: bold; margin-bottom: 8px; }
        .document-title { text-align: center; margin: 30px 0; padding: 20px; background: #f39c12; color: white; border-radius: 8px; font-size: 28px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        .items-table th { background: #e67e22; color: white; padding: 12px; text-align: left; }
        .items-table td { padding: 12px; border-bottom: 1px solid #ddd; }
        /* DEBUG BORDER RED */
        .items-table tbody tr { cursor: pointer; } 
        .totals-section { margin-top: 30px; display: flex; justify-content: flex-end; }
        .totals-box { width: 300px; padding: 20px; background: #fdf2e9; border: 1px solid #e67e22; border-radius: 8px; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .total-final { font-weight: bold; color: #d35400; font-size: 18px; border-top: 2px solid #d35400; padding-top: 10px; }
        .terms-section { margin-top: 50px; background: #f8f9fa; padding: 20px; border-radius: 8px; }
        .terms-title { color: #d35400; font-weight: bold; margin-bottom: 10px; text-transform: uppercase; }
        .terms-content { font-size: 12px; columns: 2; column-gap: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))">
                <div class="logo">{{#if entreprise.logo_url}}<img src="{{entreprise.logo_url}}" style="max-width:100%; max-height:100%;">{{else}}{{entreprise.initiales}}{{/if}}</div>
                <div class="document-info"><strong>Réf:</strong> {{numero}}<br><strong>Date:</strong> {{date_creation}}</div>
            </div>
            <div class="company-info" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))">
                <div class="company-name">{{entreprise.nom_societe}}</div>
                <div class="company-details">{{entreprise.adresse}}<br>{{entreprise.code_postal}} {{entreprise.ville}}</div>
            </div>
        </div>
        <div class="document-title">{{titre_document}}</div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 40px;">
            <div style="flex: 1; padding: 20px; background: #ecf0f1; border-radius: 8px;" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))">
                <div style="color: #e67e22; font-weight: bold; margin-bottom: 10px;">CLIENT</div>
                <strong>{{client.nom}}</strong><br>{{client.adresse}}<br>{{client.code_postal}} {{client.ville}}
            </div>
             <div style="flex: 1; margin-left: 20px; padding: 20px; background: #ecf0f1; border-radius: 8px;" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'project'}))">
                <div style="color: #e67e22; font-weight: bold; margin-bottom: 10px;">CHANTIER</div>
                <strong>{{titre}}</strong><br>{{description}}
            </div>
        </div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Désignation</th><th style="text-align: center;">U</th><th style="text-align: center;">Qté</th><th style="text-align: right;">PU HT</th><th style="text-align: right;">Total HT</th>
                </tr>
            </thead>
            <tbody>
                {{#each items}}
                <tr onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'edit', index: {{@index}} }))">
                    <td>
                        {{#if this.show_metier_header}}<div style="font-size: 9px; color: #7f8c8d; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; margin-top: 5px;">{{this.metier}}{{#if this.categorie}} <span style="font-weight:normal; color:#bdc3c7;">&gt;</span> {{this.categorie}}{{/if}}</div>{{/if}}
                        <strong>{{this.designation}}</strong><br><small>{{this.description}}</small>
                    </td>
                    <td style="text-align: center;">{{this.unite}}</td>
                    <td style="text-align: center;">{{this.quantite}}</td>
                    <td style="text-align: right;">{{this.prix_unitaire}}</td>
                    <td style="text-align: right;">{{this.total_ht}}</td>
                </tr>
                {{/each}}
            </tbody>
        </table>
        <div class="totals-section">
            <div class="totals-box">
                <div class="total-row"><span>Total HT</span><span>{{total_ht}} €</span></div>
                <div class="total-row" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'tva'}))"><span>TVA ({{taux_tva}}%)</span><span>{{total_tva}} €</span></div>
                <div class="total-row total-final"><span>NET À PAYER</span><span>{{total_ttc}} €</span></div>
                {{#if tva_mention}}<div style="font-size: 9px; color: #d35400; font-style: italic; margin-top: 5px; text-align: right;">{{tva_mention}}</div>{{/if}}
            </div>
        </div>
        <div class="terms-section">
            <div class="terms-title">Conditions Générales de Vente</div>
            <div class="terms-content">
                {{#if conditions}}{{{conditions}}}{{else}}<strong>Validité :</strong> 30 jours.<br><strong>Acompte :</strong> 30% à la commande.{{/if}}
            </div>
        </div>
    </div>
</body>
</html>`;
            }

            if (htmlContent.includes('Template Moderne') || htmlContent.includes('#3498db')) {

                sanitizedHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=0.6, user-scalable=yes">
    <title>Devis - Template Moderne</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #2c3e50; background: #ffffff; }
        .container { max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; min-height: 297mm; }
        .header { display: flex; justify-content: space-between; border-bottom: 3px solid #3498db; padding-bottom: 30px; margin-bottom: 40px; }
        .logo { width: 80px; height: 80px; background: linear-gradient(135deg, #3498db, #2980b9); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; }
        .company-name { font-size: 28px; font-weight: 700; color: #2c3e50; }
        .title { font-size: 36px; font-weight: 300; color: #3498db; text-align: center; margin: 30px 0; letter-spacing: 2px; }
        .info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 40px; }
        .info-card { background: #f8f9fa; border-radius: 12px; padding: 25px; border-left: 4px solid #3498db; }
        .card-title { font-weight: 600; color: #2c3e50; margin-bottom: 10px; text-transform: uppercase; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; } 
        .items-table th { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 15px; text-align: left; }
        .items-table td { padding: 15px; border-bottom: 1px solid #ecf0f1; }
        /* FIX INTERACTIVITY */
        .items-table tbody tr { cursor: pointer; transition: background 0.2s; }
        .totals-section { display: flex; justify-content: flex-end; }
        .totals-card { background: #f8f9fa; padding: 20px; border-radius: 12px; width: 350px; }
        .total-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
        .total-final { font-size: 20px; font-weight: bold; color: #3498db; border-top: 2px solid #3498db; margin-top: 10px; padding-top: 15px; border-bottom: none; }
        .terms-section { margin-top: 50px; font-size: 12px; color: #7f8c8d; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))">
                <div class="logo">{{#if entreprise.logo_url}}<img src="{{entreprise.logo_url}}" style="width:100%; height:100%; object-fit:contain;">{{else}}{{entreprise.initiales}}{{/if}}</div>
            </div>
            <div class="company-info" style="text-align: right;" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))">
                <div class="company-name">{{entreprise.nom_societe}}</div>
                <div>{{entreprise.adresse}}<br>{{entreprise.code_postal}} {{entreprise.ville}}<br>SIRET: {{entreprise.siret}}</div>
            </div>
        </div>
        <div class="title" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'project'}))">{{titre_document}}</div>
        <div class="info-cards">
            <div class="info-card" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))">
                <div class="card-title">CLIENT</div>
                <strong>{{client.nom}}</strong><br>{{client.adresse}}<br>{{client.code_postal}} {{client.ville}}<br>{{client.email}}
            </div>
            <div class="info-card" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'project'}))">
                <div class="card-title">DÉTAILS</div>
                <strong>N° :</strong> {{numero}}<br><strong>Date :</strong> {{date_creation}}<br><strong>Projet :</strong> {{titre}}
            </div>
        </div>
        <table class="items-table">
            <thead>
                <tr><th>Description</th><th style="text-align: center;">Qté</th><th style="text-align: right;">P.U.</th><th style="text-align: right;">Total</th></tr>
            </thead>
            <tbody>
                {{#each items}}
                <tr onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'edit', index: {{@index}} }))">
                    <td>
                        {{#if this.show_metier_header}}<div style="font-size: 9px; color: #7f8c8d; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; margin-top: 5px;">{{this.metier}}{{#if this.categorie}} <span style="font-weight:normal; color:#bdc3c7;">&gt;</span> {{this.categorie}}{{/if}}</div>{{/if}}
                        <strong>{{this.designation}}</strong><br><small>{{this.description}}</small>
                    </td>
                    <td style="text-align: center;">{{this.quantite}} {{this.unite}}</td>
                    <td style="text-align: right;">{{this.prix_unitaire}} €</td>
                    <td style="text-align: right;">{{this.total_ht}} €</td>
                </tr>
                {{/each}}
            </tbody>
        </table>
        <div class="totals-section">
            <div class="totals-card">
                <div class="total-row"><span>Total HT</span><span>{{total_ht}} €</span></div>
                <div class="total-row" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'tva'}))"><span>TVA ({{taux_tva}}%)</span><span>{{total_tva}} €</span></div>
                <div class="total-row total-final"><span>NET À PAYER</span><span>{{total_ttc}} €</span></div>
                {{#if tva_mention}}<div style="font-size: 9px; color: #7f8c8d; font-style: italic; margin-top: 5px; text-align: right;">{{tva_mention}}</div>{{/if}}
            </div>
        </div>
        <div class="terms-section">
             <h3>Conditions</h3>
             {{#if conditions}}{{{conditions}}}{{else}}Règlement à réception de facture. Acompte de 30% à la commande.{{/if}}
        </div>
    </div>
</body>
</html>`;
            }


            // ⚠️ FIX DATA: Injecter Metier/Categorie pour TOUS les templates (Classique, Minimaliste, etc) s'ils ne l'ont pas
            // On cible le pattern standard: <td>...{{description}}...
            // Note: Batiment & Moderne sont déjà traités par le bloc hardcoded plus haut
            if (!sanitizedHtml.includes('{{this.metier}}') && !sanitizedHtml.includes('{{metier}}')) {
                // Regex améliorée pour capturer designation OU description, avec ou sans 'this.'
                const descriptionRegex = /(<td>\s*)(.*?)\{\{(this\.)?(designation|description)\}\}/g;

                if (descriptionRegex.test(sanitizedHtml)) {
                    sanitizedHtml = sanitizedHtml.replace(
                        descriptionRegex,
                        (match, tdTag, beforeContent, prefix, field) => {
                            // On reconstruit le TD avec l'injection au début
                            // On gère le cas où prefix (this.) est undefined
                            const p = prefix || '';
                            return `${tdTag}
                        {{#if ${p}show_metier_header}}<div style="font-size: 9px; color: #7f8c8d; font-weight: bold; text-transform: uppercase; margin-bottom: 2px; margin-top: 5px;">{{${p}metier}}{{#if ${p}categorie}} <span style="font-weight:normal; color:#bdc3c7;">&gt;</span> {{${p}categorie}}{{/if}}</div>{{/if}}
                        ${beforeContent}{{${p}${field}}}`;
                        }
                    );
                    console.log('✅ [RENDER MOUCHARD] Injection Metier/Categorie appliquée sur le template (regex étendue)');
                }
            }

            // ⚠️ FIX DESIGN : Ajouter le Viewport pour que le mobile affiche bien la page (pas tout petit)
            if (!sanitizedHtml.includes('<meta name="viewport"')) {
                sanitizedHtml = sanitizedHtml.replace('<head>', '<head><meta name="viewport" content="width=device-width, initial-scale=0.6, user-scalable=yes">');
            }

            // ⚠️ FIX FONT : Remplacer Helvetica Neue (Apple) par System (Android compatible)
            sanitizedHtml = sanitizedHtml.replace(/'Helvetica Neue'/g, "System, Roboto, 'Segoe UI', sans-serif");

            const template = Handlebars.compile(sanitizedHtml);
            const rendered = template(data);

            console.log('✅ [RENDER MOUCHARD] Rendu Handlebars terminé, taille:', rendered.length);
            return rendered;
        } catch (error) {
            console.error('❌ [RENDER MOUCHARD] ERREUR Handlebars:', error);
            console.error('❌ [RENDER MOUCHARD] Stack:', error.stack);

            // Fallback: retourner le contenu brut pour debug
            return htmlContent;
        }
    },

    async generateDevisHTML(devis, templateName = 'classique') {
        console.log('🔍 [PDF MOUCHARD] === DÉBUT GÉNÉRATION DEVIS ===');
        console.log('🔍 [PDF MOUCHARD] Template demandé:', templateName);
        console.log('🔍 [PDF MOUCHARD] Devis ID:', devis?.id);
        console.log('🔍 [PDF MOUCHARD] Nombre items:', devis?.items?.length);

        // TOUS les templates viennent du Marketplace (y compris classique & minimaliste)
        try {
            console.log('🔍 [PDF MOUCHARD] Vérification templates Marketplace...');
            const MarketplaceService = require('./marketplace').default;
            const localTemplates = await MarketplaceService.getLocalTemplates();
            console.log('🔍 [PDF MOUCHARD] Templates disponibles:', Object.keys(localTemplates));

            if (localTemplates[templateName]) {
                console.log('✅ [PDF MOUCHARD] Template trouvé:', templateName);
                console.log('🔍 [PDF MOUCHARD] Taille HTML:', localTemplates[templateName].length, 'caractères');

                try {
                    const rendered = await this.renderDynamically(localTemplates[templateName], devis);
                    console.log('✅ [PDF MOUCHARD] Rendu dynamique réussi, taille:', rendered.length);
                    console.log('🔍 [PDF MOUCHARD] === FIN GÉNÉRATION DEVIS ===');
                    return rendered;
                } catch (renderError) {
                    console.error('❌ [PDF MOUCHARD] ERREUR RENDU DYNAMIQUE:', renderError);
                    console.error('❌ [PDF MOUCHARD] Stack:', renderError.stack);
                    throw renderError;
                }
            } else {
                // Template non trouvé → FALLBACK vers classique
                console.warn(`⚠️ [PDF MOUCHARD] Template "${templateName}" non disponible`);
                console.warn('⚠️ [PDF MOUCHARD] Ce template nécessite peut-être des droits Premium');
                console.warn('⚠️ [PDF MOUCHARD] Fallback automatique vers "classique"');

                // Essayer classique
                if (localTemplates['classique']) {
                    console.log('✅ [PDF MOUCHARD] Utilisation du template classique (fallback)');
                    try {
                        const rendered = await this.renderDynamically(localTemplates['classique'], devis);
                        console.log('✅ [PDF MOUCHARD] Rendu dynamique réussi (fallback), taille:', rendered.length);
                        console.log('🔍 [PDF MOUCHARD] === FIN GÉNÉRATION DEVIS ===');

                        // Avertir l'utilisateur via console visible
                        console.warn(`\n⚠️ ═══════════════════════════════════════════════════════`);
                        console.warn(`⚠️  TEMPLATE "${templateName.toUpperCase()}" NON DISPONIBLE`);
                        console.warn(`⚠️  Le document s'affiche avec le template "Classique"`);
                        console.warn(`⚠️  Pour utiliser ce template, téléchargez-le depuis le Marketplace`);
                        console.warn(`⚠️ ═══════════════════════════════════════════════════════\n`);

                        return rendered;
                    } catch (fallbackError) {
                        console.error('❌ [PDF MOUCHARD] ERREUR FALLBACK CLASSIQUE:', fallbackError);
                        throw fallbackError;
                    }
                } else {
                    throw new Error('Aucun template disponible. Veuillez télécharger au moins le template "classique" depuis le Marketplace.');
                }
            }
        } catch (e) {
            console.error('❌ [PDF MOUCHARD] ERREUR MARKETPLACE:', e);
            console.error('❌ [PDF MOUCHARD] Stack:', e.stack);
            throw e;
        }
    },

    async generateFactureHTML(facture, templateName = 'classique') {
        console.log('🔍 [PDF MOUCHARD] === DÉBUT GÉNÉRATION FACTURE ===');
        console.log('🔍 [PDF MOUCHARD] Template demandé:', templateName);
        console.log('🔍 [PDF MOUCHARD] Facture ID:', facture?.id);
        console.log('🔍 [PDF MOUCHARD] Nombre items:', facture?.items?.length);

        // TOUS les templates viennent du Marketplace (y compris classique & minimaliste)
        try {
            console.log('🔍 [PDF MOUCHARD] Vérification templates Marketplace...');
            const MarketplaceService = require('./marketplace').default;
            const localTemplates = await MarketplaceService.getLocalTemplates();
            console.log('🔍 [PDF MOUCHARD] Templates disponibles:', Object.keys(localTemplates));

            if (localTemplates[templateName]) {
                console.log('✅ [PDF MOUCHARD] Template trouvé:', templateName);
                console.log('🔍 [PDF MOUCHARD] Taille HTML:', localTemplates[templateName].length, 'caractères');

                try {
                    const rendered = await this.renderDynamically(localTemplates[templateName], facture);
                    console.log('✅ [PDF MOUCHARD] Rendu dynamique réussi, taille:', rendered.length);
                    console.log('🔍 [PDF MOUCHARD] === FIN GÉNÉRATION FACTURE ===');
                    return rendered;
                } catch (renderError) {
                    console.error('❌ [PDF MOUCHARD] ERREUR RENDU DYNAMIQUE:', renderError);
                    console.error('❌ [PDF MOUCHARD] Stack:', renderError.stack);
                    throw renderError;
                }
            } else {
                // Template non trouvé → FALLBACK vers classique
                console.warn(`⚠️ [PDF MOUCHARD] Template "${templateName}" non disponible`);
                console.warn('⚠️ [PDF MOUCHARD] Ce template nécessite peut-être des droits Premium');
                console.warn('⚠️ [PDF MOUCHARD] Fallback automatique vers "classique"');

                // Essayer classique
                if (localTemplates['classique']) {
                    console.log('✅ [PDF MOUCHARD] Utilisation du template classique (fallback)');
                    try {
                        const rendered = await this.renderDynamically(localTemplates['classique'], facture);
                        console.log('✅ [PDF MOUCHARD] Rendu dynamique réussi (fallback), taille:', rendered.length);
                        console.log('🔍 [PDF MOUCHARD] === FIN GÉNÉRATION FACTURE ===');

                        // Avertir l'utilisateur via console visible
                        console.warn(`\n⚠️ ═══════════════════════════════════════════════════════`);
                        console.warn(`⚠️  TEMPLATE "${templateName.toUpperCase()}" NON DISPONIBLE`);
                        console.warn(`⚠️  Le document s'affiche avec le template "Classique"`);
                        console.warn(`⚠️  Pour utiliser ce template, téléchargez-le depuis le TCE Market`);
                        console.warn(`⚠️ ═══════════════════════════════════════════════════════\n`);

                        return rendered;
                    } catch (fallbackError) {
                        console.error('❌ [PDF MOUCHARD] ERREUR FALLBACK CLASSIQUE:', fallbackError);
                        throw fallbackError;
                    }
                } else {
                    throw new Error('Aucun template disponible. Veuillez télécharger au moins le template "classique" depuis le TCE Market.');
                }
            }
        } catch (e) {
            console.error('❌ [PDF MOUCHARD] ERREUR MARKETPLACE:', e);
            console.error('❌ [PDF MOUCHARD] Stack:', e.stack);
            throw e;
        }
    },


    generateJournalVentesPDF(factures, stats) {
        const totalHT = factures.reduce((sum, f) => sum + (Number(f.total_ht) || 0), 0);
        const totalTVA = factures.reduce((sum, f) => sum + (Number(f.total_tva) || 0), 0);
        const totalTTC = factures.reduce((sum, f) => sum + (Number(f.total_ttc) || 0), 0);

        return `
            <html>
            <head>
                <style>
                    body { font-family: 'Helvetica', sans-serif; padding: 20px; }
                    h1 { text-align: center; color: #2c3e50; }
                    .meta { margin-bottom: 20px; text-align: center; color: #666; font-size: 12px; }
                    table { width: 100%; border-collapse: collapse; font-size: 10px; }
                    th { background: #f4f4f4; padding: 8px; border: 1px solid #ddd; text-align: left; }
                    td { padding: 6px; border: 1px solid #ddd; }
                    .num { text-align: right; }
                    .total-row { font-weight: bold; background: #e8e8e8; }
                </style>
            </head>
            <body>
                <h1>Journal des Ventes</h1>
                <div class="meta">
                    Généré le ${new Date().toLocaleDateString()} à ${new Date().toLocaleTimeString()}<br>
                    Période: Tout l'historique
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th><th>Numéro</th><th>Client</th>
                            <th class="num">HT</th><th class="num">TVA</th><th class="num">TTC</th><th>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${factures.map(f => `
                            <tr>
                                <td>${new Date(f.created_at).toLocaleDateString()}</td>
                                <td>${f.numero}</td>
                                <td>${f.client?.societe || f.client?.nom || '-'}</td>
                                <td class="num">${Number(f.total_ht).toFixed(2)} €</td>
                                <td class="num">${Number(f.total_tva).toFixed(2)} €</td>
                                <td class="num">${Number(f.total_ttc).toFixed(2)} €</td>
                                <td>${f.statut}</td>
                            </tr>
                        `).join('')}
                        <tr class="total-row">
                            <td colspan="3" style="text-align: right;">TOTAUX GÉNÉRAUX</td>
                            <td class="num">${totalHT.toFixed(2)} €</td>
                            <td class="num">${totalTVA.toFixed(2)} €</td>
                            <td class="num">${totalTTC.toFixed(2)} €</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </body>
            </html>
        `;
    }
};
