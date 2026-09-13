
// Helper pour normaliser les données entreprise et client
const getCompanyInfo = (ent) => {
    if (!ent) return {};

    // Logique de nom : On affiche le nom commercial, et si la raison sociale est différente, on l'ajoute
    let displayName = ent.nom || ent.societe || ent.nom_societe || 'Votre Entreprise';
    if (ent.nom && ent.societe && ent.nom !== ent.societe) {
        displayName += ` (${ent.societe})`;
    }

    return {
        nom: displayName,
        gerant: ent.gerant || '',
        tagline: ent.tagline || 'Excellence • Innovation • Confiance',
        adresse: ent.adresse || '',
        cp: ent.code_postal || ent.cp || '',
        ville: ent.ville || '',
        tel: ent.telephone || '',
        tel_fixe: ent.telephone_fixe || '',
        email: ent.email || ent.email_contact || '',
        siret: ent.siret || '',
        ape: ent.ape || '',
        tva: ent.tva_intra || ent.tva || '',
        logo: ent.logo_uri || ent.logo_url || null,
        iban: ent.iban || '',
        bic: ent.bic || ''
    };
};

const getClientInfo = (cli) => {
    if (!cli) return {};
    return {
        nom: cli.nom || '',
        prenom: cli.prenom || '', // Au cas où
        societe: cli.societe || '',
        adresse: cli.adresse || '',
        cp: cli.code_postal || '',
        ville: cli.ville || '',
        tel: cli.telephone || '',
        email: cli.email || ''
    };
};

// Fonction pour grouper les items par métier et catégorie
const groupItemsByMetierAndCategorie = (items) => {
    const grouped = {};

    (items || []).forEach(item => {
        const metier = item.metier || 'Sans métier';
        const categorie = item.categorie || 'Sans catégorie';

        if (!grouped[metier]) {
            grouped[metier] = {};
        }

        if (!grouped[metier][categorie]) {
            grouped[metier][categorie] = [];
        }

        grouped[metier][categorie].push(item);
    });

    return grouped;
};

export const PdfTemplates = {

    // --------------------------------------------------------------------------------
    // 1. Template CLASSIQUE (Fidèle à template_classique.html)
    // --------------------------------------------------------------------------------
    classique: (devis) => {
        const ent = getCompanyInfo(devis.entreprise);
        const cli = getClientInfo(devis.client);

        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Times New Roman', serif; line-height: 1.5; color: #2c3e50; padding: 40px; }
                .header { border: 2px solid #2c3e50; padding: 20px; margin-bottom: 30px; background: #f8f9fa; display: flex; justify-content: space-between; align-items: center; }
                .logo-section { flex: 1; }
                .logo { width: 70px; height: 70px; border: 2px solid #2c3e50; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-bottom: 10px; background: white; object-fit: contain;}
                .company-info { flex: 2; text-align: right; }
                .company-name { font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
                .company-details { font-size: 13px; color: #5d6d7e; line-height: 1.6; }
                
                .doc-title { font-size: 28px; font-weight: bold; color: #2c3e50; text-align: center; margin: 30px 0; text-transform: uppercase; letter-spacing: 2px; border-top: 3px solid #2c3e50; border-bottom: 3px solid #2c3e50; padding: 15px 0; }
                
                .document-info { display: flex; justify-content: space-between; margin: 30px 0; padding: 15px; border: 1px solid #bdc3c7; background: #fafbfc; font-size: 14px; }
                .doc-right { text-align: right; }

                .client-section { margin: 30px 0; border: 1px solid #2c3e50; }
                .section-header { background: #2c3e50; color: white; padding: 12px 20px; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; }
                .client-grid { display: flex; gap: 30px; padding: 20px; background: white; }
                .client-info, .project-info { flex: 1; padding: 15px; border: 1px solid #dee2e6; background: #f8f9fa; }
                .info-title { font-weight: bold; color: #2c3e50; margin-bottom: 10px; text-transform: uppercase; font-size: 14px; border-bottom: 1px solid #dee2e6; padding-bottom: 5px; }
                .info-content { font-size: 14px; color: #5d6d7e; line-height: 1.6; }

                .items-table { width: 100%; border-collapse: collapse; border: 2px solid #2c3e50; background: white; margin: 40px 0; }
                .items-table th { background: #2c3e50; color: white; padding: 15px 10px; text-align: left; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid #34495e; }
                .items-table td { padding: 12px 10px; border: 1px solid #bdc3c7; font-size: 13px; vertical-align: top; }
                .items-table tr:nth-child(even) { background: #f8f9fa; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }

                .totals-section { display: flex; justify-content: flex-end; margin: 30px 0; }
                .totals-table { border: 2px solid #2c3e50; border-collapse: collapse; min-width: 300px; }
                .totals-table td { padding: 12px 20px; border: 1px solid #2c3e50; font-size: 14px; }
                .totals-table .label { background: #f8f9fa; font-weight: bold; text-align: right; }
                .totals-table .value { background: white; text-align: right; font-weight: bold; }
                .totals-table .total-row .label, .totals-table .total-row .value { background: #2c3e50; color: white; font-size: 16px; }

                .signature-section { margin-top: 50px; display: flex; gap: 40px; }
                .signature-box { flex: 1; border: 2px solid #2c3e50; padding: 30px 20px; text-align: center; background: #fafbfc; min-height: 120px; }
                .signature-title { font-weight: bold; color: #2c3e50; margin-bottom: 10px; text-transform: uppercase; font-size: 14px; }
                .signature-line { border-top: 1px solid #2c3e50; margin-top: 50px; padding-top: 8px; font-size: 11px; color: #7f8c8d; }

                .footer { margin-top: 40px; text-align: center; padding: 15px; border-top: 2px solid #2c3e50; color: #7f8c8d; font-size: 11px; background: #f8f9fa; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo-section">
                    ${ent.logo ? `<img class="logo" src="${ent.logo}" />` : '<div class="logo">LOGO</div>'}
                    <div style="font-size: 12px; color: #5d6d7e; margin-top: 5px;">
                        <strong>Date:</strong> ${new Date(devis.created_at).toLocaleDateString()}
                    </div>
                </div>
                <div class="company-info" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#e8f4f8'" onmouseout="this.style.background='transparent'">
                    ${ent.gerant ? `<div style="font-size: 14px; color: #2c3e50; font-weight: bold; margin-bottom: 5px;">${ent.gerant} (Gérant)</div>` : ''}
                    <div class="company-name">${ent.nom}</div>
                    <div class="company-details">
                        ${ent.adresse}<br>
                        ${ent.cp} ${ent.ville}<br>
                        Tél: ${ent.tel} ${ent.tel_fixe ? `| Fixe: ${ent.tel_fixe}` : ''}<br>
                        Email: ${ent.email}<br>
                        SIRET: ${ent.siret} - APE: ${ent.ape} - TVA: ${ent.tva}
                    </div>
                </div>
            </div>

            <div class="doc-title">DEVIS N° ${devis.numero}</div>

            <div class="document-info">
                <div>
                    <strong>Validité:</strong> 30 jours<br>
                    <strong>Date d'émission:</strong> ${new Date(devis.created_at).toLocaleDateString()}
                </div>
            </div>

            <div class="client-section">
                <div class="section-header">Informations Client</div>
                <div class="client-grid">
                    <div class="client-info" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#e8f4f8'" onmouseout="this.style.background='#f8f9fa'">
                        <div class="info-title">Client <span style="font-size: 10px; color: #3498db;">(Cliquer pour modifier)</span></div>
                        <div class="info-content">
                            <strong>${cli.societe || cli.nom + ' ' + (cli.prenom || '') || '⚠️ Aucun client sélectionné - Cliquez ici'}</strong><br>
                            ${cli.adresse}<br>
                            ${cli.cp} ${cli.ville}<br>
                            ${cli.tel ? `Tél: ${cli.tel}` : ''}<br>
                            ${cli.email ? `Email: ${cli.email}` : ''}
                        </div>
                    </div>
                     <div class="project-info">
                        <div class="info-title">Projet</div>
                        <div class="info-content">
                            <strong>${devis.titre || 'Devis sans titre'}</strong><br>
                            <!-- Placeholder pour infos projet si dispos -->
                        </div>
                    </div>
                </div>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 45%;">Désignation</th>
                        <th style="width: 10%;" class="text-center">Qté</th>
                        <th style="width: 15%;" class="text-right">P.U. HT</th>
                        <th style="width: 10%;" class="text-center">TVA</th>
                        <th style="width: 20%;" class="text-right">Total HT</th>
                    </tr>
                </thead>
                <tbody>
                    ${(() => {
                const grouped = groupItemsByMetierAndCategorie(devis.items);
                let html = '';
                let globalIndex = 0;

                Object.keys(grouped).sort().forEach(metier => {
                    // Ligne Métier
                    html += `
                                <tr class="metier-row">
                                    <td colspan="5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: bold; padding: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                        📋 ${metier}
                                    </td>
                                </tr>
                            `;

                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        // Ligne Catégorie
                        html += `
                                    <tr class="categorie-row">
                                        <td colspan="5" style="background: #f0f4f8; font-weight: 600; padding: 8px; padding-left: 30px; color: #2c3e50; font-size: 13px; border-left: 4px solid #667eea;">
                                            📂 ${categorie}
                                        </td>
                                    </tr>
                                `;

                        // Articles de cette catégorie
                        grouped[metier][categorie].forEach(item => {
                            const index = globalIndex++;
                            html += `
                                        <tr onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'edit', index: ${index}}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#e8f4f8'" onmouseout="this.style.background='${index % 2 === 0 ? 'white' : '#f8f9fa'}'">
                                            <td style="padding-left: 50px;">
                                                <div>${item.description}</div>
                                            </td>
                                            <td class="text-center">${item.quantite}</td>
                                            <td class="text-right">${parseFloat(item.prix_unitaire).toFixed(2)} €</td>
                                            <td class="text-center">${item.tva || 20}%</td>
                                            <td class="text-right">${parseFloat(item.total_ht).toFixed(2)} €</td>
                                        </tr>
                                    `;
                        });
                    });
                });

                return html;
            })()}
                </tbody>
            </table>

            <div class="totals-section">
                <table class="totals-table">
                    <tr><td class="label">Total HT:</td><td class="value">${devis.total_ht} €</td></tr>
                    <tr onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'tva'}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#e8f4f8'" onmouseout="this.style.background='#f8f9fa'">
                        <td class="label">TVA (${devis.items.length > 0 && devis.items[0].tva !== undefined ? devis.items[0].tva : 20}%) <span style="font-size: 10px; color: #3498db;">(Cliquer pour modifier)</span>:</td>
                        <td class="value">${devis.total_tva} €</td>
                    </tr>
                    ${devis.tva_mention ? `<tr><td colspan="2" style="font-size: 11px; color: #666; font-style: italic; padding: 8px;">${devis.tva_mention}</td></tr>` : ''}
                    <tr class="total-row"><td class="label">TOTAL TTC:</td><td class="value">${devis.total_ttc} €</td></tr>
                </table>
            </div>

            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-title">Le Client</div>
                    <div class="signature-line">Date et signature</div>
                </div>
                <div class="signature-box">
                    <div class="signature-title">L'Entreprise</div>
                    <div class="signature-line">Date et signature</div>
                </div>
            </div>

            <!-- PAGE CONDITIONS GÉNÉRALES -->
            <div style="page-break-before: always; padding: 40px 0;">
                <h2 style="text-align: center; color: #2c3e50; margin-bottom: 30px; font-size: 24px; text-transform: uppercase; border-bottom: 3px solid #2c3e50; padding-bottom: 15px;">CONDITIONS GÉNÉRALES DE VENTE</h2>
                
                <div style="margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #2c3e50; padding-left: 15px;">1. Objet</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 20px;">Les présentes conditions générales de vente s'appliquent à toutes les prestations de services effectuées par <strong>${ent.nom}</strong>. Toute commande implique l'acceptation sans réserve des présentes conditions.</p>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #2c3e50; padding-left: 15px;">2. Prix et Paiement</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 20px;">Les prix sont indiqués en euros HT et TTC. Ils sont fermes et définitifs. Le paiement s'effectue selon les modalités convenues. En cas de retard de paiement, des pénalités de retard égales à 3 fois le taux d'intérêt légal seront appliquées, ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement.</p>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #2c3e50; padding-left: 15px;">3. Délais d'Exécution</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 20px;">Les délais indiqués sont donnés à titre indicatif et ne constituent pas un engagement ferme, sauf stipulation contraire. Tout retard ne peut donner lieu à pénalités ou annulation de commande.</p>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #2c3e50; padding-left: 15px;">4. Garanties et Assurances</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 20px;">Les travaux sont garantis selon les dispositions légales en vigueur :</p>
                    <ul style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 40px; margin-top: 10px;">
                        <li><strong>Garantie de parfait achèvement</strong> : 1 an à compter de la réception</li>
                        <li><strong>Garantie biennale</strong> : 2 ans pour les équipements dissociables</li>
                        <li><strong>Garantie décennale</strong> : 10 ans pour les dommages compromettant la solidité de l'ouvrage</li>
                        <li><strong>Assurance décennale</strong> : Police n° [à compléter] - Assureur : [à compléter]</li>
                    </ul>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #2c3e50; padding-left: 15px;">5. Réglementation Française</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 20px;">Conformément à la réglementation française :</p>
                    <ul style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 40px; margin-top: 10px;">
                        <li><strong>TVA applicable</strong> : 20% (taux normal) ou 10% (taux intermédiaire pour travaux de rénovation dans un logement de plus de 2 ans) ou 5,5% (taux réduit pour travaux d'amélioration énergétique)</li>
                        <li><strong>Normes</strong> : Respect des normes NF DTU en vigueur</li>
                        <li><strong>Délai de rétractation</strong> : 14 jours pour les particuliers (article L221-18 du Code de la consommation)</li>
                        <li><strong>Médiation</strong> : En cas de litige, le client peut recourir gratuitement à un médiateur de la consommation</li>
                    </ul>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #2c3e50; padding-left: 15px;">6. Réception des Travaux</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 20px;">La réception des travaux intervient à l'achèvement des prestations. Elle peut être assortie de réserves qui devront être levées dans les meilleurs délais. Le point de départ des garanties est la date de réception sans réserves.</p>
                </div>

                <div style="margin-bottom: 25px;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 10px; border-left: 4px solid #2c3e50; padding-left: 15px;">7. Litiges et Juridiction Compétente</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 20px;">En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. À défaut, les tribunaux compétents sont ceux du ressort du siège social de l'entreprise.</p>
                </div>

                <p style="margin-top: 40px; font-size: 11px; color: #7f8c8d; text-align: center; border-top: 1px solid #dee2e6; padding-top: 20px;">
                    Document généré le ${new Date().toLocaleDateString('fr-FR')}<br>
                    ${ent.nom} - SIRET: ${ent.siret} - TVA: ${ent.tva}<br>
                    ${ent.adresse}, ${ent.cp} ${ent.ville}
                </p>
            </div>

            <div class="footer">
                ${ent.nom} - ${ent.adresse} ${ent.cp} ${ent.ville} - SIRET: ${ent.siret} - APE: ${ent.ape} - TVA: ${ent.tva}
            </div>
        </body>
        </html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 2. Template MODERNE (Fidèle à template_moderne.html)
    // --------------------------------------------------------------------------------
    moderne: (devis) => {
        const ent = getCompanyInfo(devis.entreprise);
        const cli = getClientInfo(devis.client);

        return `
        <head>
            <meta charset="UTF-8">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; padding: 40px; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 30px; border-bottom: 3px solid #3498db; }
                .logo-section { flex: 1; }
                .logo { width: 80px; height: 80px; background: linear-gradient(135deg, #3498db, #2980b9); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; margin-bottom: 15px; object-fit: contain; }
                .company-info { flex: 2; text-align: right; }
                .company-name { font-size: 28px; font-weight: 700; color: #2c3e50; margin-bottom: 8px; }
                .company-details { font-size: 14px; color: #7f8c8d; line-height: 1.8; }
                
                .document-title { text-align: center; margin: 40px 0; }
                .title { font-size: 36px; font-weight: 300; color: #3498db; letter-spacing: 2px; margin-bottom: 10px; }
                .subtitle { font-size: 16px; color: #7f8c8d; font-weight: 400; }
                
                .info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0; }
                .info-card { background: #f8f9fa; border-radius: 12px; padding: 25px; border-left: 4px solid #3498db; }
                .card-title { font-size: 18px; font-weight: 600; color: #2c3e50; margin-bottom: 15px; display: flex; align-items: center; }
                .card-title::before { content: ''; width: 8px; height: 8px; background: #3498db; border-radius: 50%; margin-right: 10px; }
                .card-content { font-size: 14px; color: #5d6d7e; line-height: 1.8; }
                
                .items-section { margin: 50px 0; }
                .section-title { font-size: 22px; font-weight: 600; color: #2c3e50; margin-bottom: 25px; padding-bottom: 10px; border-bottom: 2px solid #ecf0f1; }
                .items-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .items-table thead { background: linear-gradient(135deg, #3498db, #2980b9); color: white; }
                .items-table th { padding: 18px 15px; text-align: left; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; }
                .items-table td { padding: 15px; border-bottom: 1px solid #ecf0f1; font-size: 14px; }
                .items-table tbody tr:hover { background: #f8f9fa; }
                .items-table tbody tr:last-child td { border-bottom: none; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                
                .totals-section { margin: 40px 0; display: flex; justify-content: flex-end; }
                .totals-card { background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 12px; padding: 30px; min-width: 350px; border: 1px solid #dee2e6; }
                .total-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #dee2e6; }
                .total-row:last-child { border-bottom: none; font-size: 18px; font-weight: 700; color: #2c3e50; padding-top: 20px; margin-top: 10px; border-top: 2px solid #3498db; }
                .total-label { font-weight: 600; color: #5d6d7e; }
                .total-value { font-weight: 600; color: #2c3e50; }
                
                .terms-section { margin: 50px 0; background: #f8f9fa; border-radius: 12px; padding: 30px; }
                .terms-title { font-size: 20px; font-weight: 600; color: #2c3e50; margin-bottom: 20px; }
                .terms-list { list-style: none; padding: 0; }
                .terms-list li { padding: 8px 0; padding-left: 25px; position: relative; color: #5d6d7e; font-size: 14px; line-height: 1.6; }
                .terms-list li::before { content: '✓'; position: absolute; left: 0; color: #27ae60; font-weight: bold; }
                
                .signature-section { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 50px; }
                .signature-box { text-align: center; padding: 30px; border: 2px dashed #bdc3c7; border-radius: 12px; background: #fafbfc; }
                .signature-title { font-weight: 600; color: #2c3e50; margin-bottom: 10px; }
                .signature-subtitle { font-size: 12px; color: #7f8c8d; margin-bottom: 40px; }
                .signature-line { border-top: 1px solid #bdc3c7; margin-top: 40px; padding-top: 10px; font-size: 12px; color: #7f8c8d; }
                
                .footer { margin-top: 50px; text-align: center; padding: 20px; border-top: 1px solid #ecf0f1; color: #7f8c8d; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header">
                 <div class="logo-section">
                    ${ent.logo ? `<img class="logo" src="${ent.logo}" />` : '<div class="logo">LOGO</div>'}
                    <div style="font-size: 14px; color: #7f8c8d; margin-top: 5px;">
                        <strong>Référence:</strong> ${devis.numero}<br>
                        <strong>Date:</strong> ${new Date(devis.created_at).toLocaleDateString()}
                    </div>
                </div>
                <div class="company-info" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))" style="cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='#e8f4f8'; this.style.transform='translateX(-5px)'" onmouseout="this.style.background='transparent'; this.style.transform='translateX(0)'">
                    <div class="company-name">${ent.nom}</div>
                    <div class="company-details">
                        ${ent.gerant ? `<strong>Responsable:</strong> ${ent.gerant}<br>` : ''}
                        ${ent.adresse}<br>
                        ${ent.cp} ${ent.ville}<br>
                        Tél: ${ent.tel} ${ent.tel_fixe ? `(Fixe: ${ent.tel_fixe})` : ''}<br>
                        Email: ${ent.email}<br>
                        SIRET: ${ent.siret}
                    </div>
                </div>
            </div>

            <div class="document-title">
                <div class="title">DEVIS</div>
                <div class="subtitle">Proposition commerciale détaillée</div>
            </div>

            <div class="info-cards">
                <div class="info-card" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))" style="cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderLeftColor='#2980b9'; this.style.transform='translateX(5px)'" onmouseout="this.style.borderLeftColor='#3498db'; this.style.transform='translateX(0)'">
                    <div class="card-title">Informations Client <span style="font-size: 11px; color: #3498db; font-weight: normal;">(Cliquer pour modifier)</span></div>
                    <div class="card-content">
                        <strong>${cli.societe || cli.nom + ' ' + (cli.prenom || '') || '⚠️ Aucun client - Cliquez pour sélectionner'}</strong><br>
                        ${cli.adresse}<br>
                        ${cli.cp} ${cli.ville}<br>
                        ${cli.tel ? `Tél: ${cli.tel}` : ''}<br>
                        ${cli.email ? `Email: ${cli.email}` : ''}
                    </div>
                </div>
                <div class="info-card">
                    <div class="card-title">Détails du Projet</div>
                    <div class="card-content">
                        <strong>${devis.titre || 'Projet Standard'}</strong><br>
                         <!-- Placeholders -->
                        Délai: 30 jours<br>
                        Validité: 1 mois
                    </div>
                </div>
            </div>

             <div class="items-section">
                <div class="section-title">Détail des Prestations</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 45%;">Prestation / Description</th>
                            <th style="width: 10%;" class="text-center">Qté</th>
                            <th style="width: 15%;" class="text-right">P.U. HT</th>
                            <th style="width: 10%;" class="text-center">TVA</th>
                            <th style="width: 20%;" class="text-right">Total HT</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(() => {
                const grouped = groupItemsByMetierAndCategorie(devis.items);
                let html = '';
                let globalIndex = 0;

                Object.keys(grouped).sort().forEach(metier => {
                    // Ligne Métier (style moderne avec dégradé)
                    html += `
                                    <tr class="metier-row">
                                        <td colspan="5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: bold; padding: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                            📋 ${metier}
                                        </td>
                                    </tr>
                                `;

                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        // Ligne Catégorie (style moderne)
                        html += `
                                        <tr class="categorie-row">
                                            <td colspan="5" style="background: linear-gradient(to right, #f0f4f8 0%, #e8eef3 100%); font-weight: 600; padding: 10px; padding-left: 35px; color: #2c3e50; font-size: 13px; border-left: 5px solid #667eea; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                                                📂 ${categorie}
                                            </td>
                                        </tr>
                                    `;

                        // Articles de cette catégorie
                        grouped[metier][categorie].forEach(item => {
                            const index = globalIndex++;
                            html += `
                                            <tr onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'edit', index: ${index}}))" style="cursor: pointer; transition: all 0.2s; border-bottom: 1px solid #ecf0f1;" onmouseover="this.style.background='#f8f9fa'; this.style.transform='translateX(3px)'" onmouseout="this.style.background='white'; this.style.transform='translateX(0)'">
                                                <td style="padding-left: 55px; padding-top: 10px; padding-bottom: 10px;">
                                                    <div style="color: #34495e; font-weight: 500;">${item.description}</div>
                                                </td>
                                                <td class="text-center" style="color: #7f8c8d;">${item.quantite}</td>
                                                <td class="text-right" style="color: #2c3e50; font-weight: 500;">${parseFloat(item.prix_unitaire).toFixed(2)} €</td>
                                                <td class="text-center" style="color: #7f8c8d;">${item.tva || 20}%</td>
                                                <td class="text-right" style="color: #27ae60; font-weight: bold;">${parseFloat(item.total_ht).toFixed(2)} €</td>
                                            </tr>
                                        `;
                        });
                    });
                });

                return html;
            })()}
                    </tbody>
                </table>
            </div>

            <div class="totals-section">
                <div class="totals-card">
                    <div class="total-row">
                        <span class="total-label">Sous-total HT:</span>
                        <span class="total-value">${devis.total_ht} €</span>
                    </div>
                    <div class="total-row" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'tva'}))" style="cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='#e8f4f8'" onmouseout="this.style.background='transparent'">
                        <span class="total-label">TVA (${devis.items.length > 0 && devis.items[0].tva !== undefined ? devis.items[0].tva : 20}%) <span style="font-size: 11px; color: #3498db; font-weight: normal;">(Cliquer)</span>:</span>
                        <span class="total-value">${devis.total_tva} €</span>
                    </div>
                    ${devis.tva_mention ? `
                        <div style="font-size: 11px; color: #666; font-style: italic; padding: 10px 0; border-top: 1px solid #dee2e6;">
                            ${devis.tva_mention}
                        </div>
                    ` : ''}
                    <div class="total-row">
                        <span class="total-label">TOTAL TTC:</span>
                        <span class="total-value">${devis.total_ttc} €</span>
                    </div>
                </div>
            </div>

            <div class="terms-section">
                <div class="terms-title">Conditions Générales</div>
                <ul class="terms-list">
                    <li>Devis valable 30 jours à compter de la date d'émission</li>
                    <li>Acompte de 30% à la commande, solde à la livraison</li>
                    <li>Garantie décennale sur tous les travaux de gros œuvre</li>
                </ul>
            </div>

            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-title">Signature du Client</div>
                    <div class="signature-subtitle">Précédée de la mention "Bon pour accord"</div>
                    <div class="signature-line">Date et signature</div>
                </div>
                <div class="signature-box">
                    <div class="signature-title">Signature de l'Entreprise</div>
                    <div class="signature-subtitle">Cachet et signature</div>
                    <div class="signature-line">Date et signature</div>
                </div>
            </div>

            <!-- PAGE CONDITIONS GÉNÉRALES -->
            <div style="page-break-before: always; padding: 40px 0;">
                <h2 style="text-align: center; color: #3498db; margin-bottom: 40px; font-size: 28px; font-weight: 300; letter-spacing: 3px;">CONDITIONS GÉNÉRALES</h2>
                
                <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #3498db;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 12px; font-weight: 600;">1. Objet</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e;">Les présentes conditions générales s'appliquent à toutes les prestations de <strong>${ent.nom}</strong>. Toute commande implique l'acceptation sans réserve de ces conditions.</p>
                </div>

                <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #3498db;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 12px; font-weight: 600;">2. Prix et Modalités de Paiement</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e;">Les prix sont exprimés en euros HT et TTC. En cas de retard de paiement, des pénalités égales à 3 fois le taux d'intérêt légal seront appliquées, ainsi qu'une indemnité forfaitaire de 40€ pour frais de recouvrement (articles L441-6 et D441-5 du Code de commerce).</p>
                </div>

                <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #3498db;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 12px; font-weight: 600;">3. Garanties Légales</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-bottom: 10px;">Conformément à la réglementation française :</p>
                    <ul style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 20px;">
                        <li><strong>Garantie de parfait achèvement</strong> : 1 an (art. 1792-6 du Code civil)</li>
                        <li><strong>Garantie biennale</strong> : 2 ans pour les équipements dissociables (art. 1792-3)</li>
                        <li><strong>Garantie décennale</strong> : 10 ans pour les dommages à la solidité (art. 1792)</li>
                    </ul>
                </div>

                <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #3498db;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 12px; font-weight: 600;">4. TVA et Réglementation</h3>
                    <ul style="font-size: 13px; line-height: 1.8; color: #5d6d7e; margin-left: 20px;">
                        <li><strong>TVA 20%</strong> : Taux normal</li>
                        <li><strong>TVA 10%</strong> : Rénovation de logements de plus de 2 ans</li>
                        <li><strong>TVA 5,5%</strong> : Travaux d'amélioration énergétique</li>
                        <li><strong>Normes</strong> : Respect des normes NF DTU</li>
                        <li><strong>Délai de rétractation</strong> : 14 jours (particuliers)</li>
                    </ul>
                </div>

                <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; border-left: 4px solid #3498db;">
                    <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 12px; font-weight: 600;">5. Litiges</h3>
                    <p style="font-size: 13px; line-height: 1.8; color: #5d6d7e;">En cas de différend, une solution amiable sera recherchée. À défaut, compétence est attribuée aux tribunaux du siège social de l'entreprise. Le client peut recourir gratuitement à un médiateur de la consommation.</p>
                </div>

                <p style="margin-top: 40px; font-size: 11px; color: #7f8c8d; text-align: center; padding-top: 20px; border-top: 2px solid #ecf0f1;">
                    Document généré le ${new Date().toLocaleDateString('fr-FR')} • ${ent.nom} • SIRET: ${ent.siret} • TVA: ${ent.tva}
                </p>
            </div>

            <div class="footer">
                ${ent.nom} - SIRET ${ent.siret} - TVA ${ent.tva} <br> ${ent.iban ? `IBAN: ${ent.iban}` : ''}
            </div>
        </body>
        </html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 3. Template BATIMENT (Fidèle à template_batiment.html)
    // --------------------------------------------------------------------------------
    batiment: (devis) => {
        const ent = getCompanyInfo(devis.entreprise);
        const cli = getClientInfo(devis.client);
        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #2c3e50; padding: 40px; }
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #e67e22, #d35400); color: white; border-radius: 8px; }
                .logo-section { flex: 1; }
                .logo { width: 70px; height: 70px; background: white; color: #e67e22; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-bottom: 15px; object-fit: contain; padding: 5px; }
                .company-info { flex: 2; text-align: right; }
                .company-name { font-size: 26px; font-weight: bold; margin-bottom: 8px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
                .company-details { font-size: 12px; line-height: 1.8; opacity: 0.95; }
                
                .document-title { text-align: center; margin: 30px 0; padding: 20px; background: #f39c12; color: white; border-radius: 8px; }
                .title { font-size: 28px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px; }
                
                .client-section { display: flex; gap: 25px; margin: 30px 0; }
                .info-card { flex: 1; background: #ecf0f1; border-radius: 8px; padding: 20px; border-left: 5px solid #e67e22; }
                .card-title { font-size: 16px; font-weight: bold; color: #2c3e50; margin-bottom: 15px; text-transform: uppercase; }
                .card-content { font-size: 13px; color: #34495e; line-height: 1.7; }
                
                .items-section { margin: 40px 0; }
                .section-header { background: #e67e22; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; font-weight: bold; font-size: 16px; text-transform: uppercase; }
                .items-table { width: 100%; border-collapse: collapse; background: white; border: 2px solid #e67e22; border-top: none; }
                .items-table th { background: #f39c12; color: white; padding: 12px 10px; text-align: left; font-weight: bold; font-size: 12px; text-transform: uppercase; }
                .items-table td { padding: 12px 10px; border-bottom: 1px solid #ecf0f1; border-right: 1px solid #ecf0f1; font-size: 12px; }
                .items-table tr:nth-child(even) { background: #fdf6e3; }
                
                .totals-section { margin: 30px 0; display: flex; justify-content: flex-end; }
                .totals-card { background: linear-gradient(135deg, #34495e, #2c3e50); color: white; border-radius: 8px; overflow: hidden; min-width: 400px; }
                .totals-header { background: #e67e22; padding: 15px 20px; font-weight: bold; text-transform: uppercase; }
                .totals-body { padding: 20px; }
                .total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2); }
                .total-row:last-child { border-bottom: none; border-top: 2px solid #e67e22; padding-top: 15px; font-size: 18px; font-weight: bold; }
                
                .footer { margin-top: 40px; background: linear-gradient(135deg, #2c3e50, #34495e); color: white; text-align: center; padding: 20px; border-radius: 8px; font-size: 11px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo-section">
                    ${ent.logo ? `<img class="logo" src="${ent.logo}" />` : '<div class="logo">BTP</div>'}
                    <div style="font-size: 13px; margin-top: 10px;">
                        <strong>Devis N°:</strong> ${devis.numero}<br>
                        <strong>Date:</strong> ${new Date(devis.created_at).toLocaleDateString()}
                    </div>
                </div>
                <div class="company-info">
                    <div class="company-name">${ent.nom}</div>
                    <div class="company-details">
                        ${ent.gerant ? `<strong>Artisan:</strong> ${ent.gerant}<br>` : ''}
                        ${ent.adresse} - ${ent.cp} ${ent.ville}<br>
                        Mobile: ${ent.tel} ${ent.tel_fixe ? `| Fixe: ${ent.tel_fixe}` : ''}<br>
                        Email: ${ent.email}<br>
                        SIRET: ${ent.siret} | APE: ${ent.ape}
                    </div>
                </div>
            </div>

            <div class="document-title">
                <div class="title">DEVIS TRAVAUX</div>
            </div>

            <div class="client-section">
                <div class="info-card">
                    <div class="card-title">Maître d'Ouvrage</div>
                    <div class="card-content">
                        <strong>${cli.societe || cli.nom + ' ' + (cli.prenom || '')}</strong><br>
                        ${cli.adresse}<br>
                        ${cli.cp} ${cli.ville}<br><br>
                        <strong>Contact:</strong><br>
                        Tél: ${cli.tel}<br>
                        Email: ${cli.email}
                    </div>
                </div>
            </div>

            <div class="items-section">
                <div class="section-header">Détail des Prestations</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 40%;">Désignation</th>
                            <th style="width: 10%;" class="text-center">Qté</th>
                            <th style="width: 20%;" class="text-right">P.U. HT</th>
                            <th style="width: 10%;" class="text-center">TVA</th>
                            <th style="width: 20%;" class="text-right">Total TTC</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${devis.items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td class="text-center">${item.quantite}</td>
                                <td class="text-right">${parseFloat(item.prix_unitaire).toFixed(2)} €</td>
                                <td class="text-center">20%</td>
                                <td class="text-right">${parseFloat(item.total_ht).toFixed(2)} €</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="totals-section">
                <div class="totals-card">
                    <div class="totals-header">Récapitulatif</div>
                    <div class="totals-body">
                        <div class="total-row">
                            <span>Sous-total HT:</span>
                            <span>${devis.total_ht} €</span>
                        </div>
                        <div class="total-row">
                            <span>TVA Total:</span>
                            <span>${devis.total_tva} €</span>
                        </div>
                        <div class="total-row">
                            <span>TOTAL TTC:</span>
                            <span>${devis.total_ttc} €</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                ${ent.nom} - ${ent.adresse}, ${ent.cp} ${ent.ville}<br>
                Tél: ${ent.tel} - Email: ${ent.email}<br>
                SIRET: ${ent.siret} - APE: ${ent.ape} - TVA: ${ent.tva}
            </div>
        </body>
        </html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 4. Template MINIMALISTE (Simple mais propre)
    // --------------------------------------------------------------------------------
    minimaliste: (devis) => {
        const ent = getCompanyInfo(devis.entreprise);
        const cli = getClientInfo(devis.client);
        return `
        <html>
        <head>
            <style>
                body { font-family: 'Courier New', Courier, monospace; padding: 40px; color: #333; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
            </style>
        </head>
        <body>
             <div style="text-align: center; margin-bottom: 50px;">
                ${ent.logo ? `<img src="${ent.logo}" style="max-width: 60px; max-height: 75px; margin-bottom: 10px;" />` : ''}
                <div style="font-size: 22px; font-weight: bold; text-transform: uppercase;">${ent.nom}</div>
                <div onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))" style="cursor: pointer; padding: 10px; border: 1px dashed transparent; transition: border 0.3s;" onmouseover="this.style.border='1px dashed #999'" onmouseout="this.style.border='1px dashed transparent'">
                    <div style="font-size: 13px; margin-top: 5px;">${ent.adresse}, ${ent.cp} ${ent.ville}</div>
                    <div style="font-size: 13px;">${ent.email} • ${ent.tel}</div>
                    <div style="font-size: 11px; margin-top: 5px; color: #777;">SIRET: ${ent.siret} • APE: ${ent.ape} • TVA: ${ent.tva}</div>
                </div>
            </div>
            <div style="margin-bottom: 40px; border-top: 2px dashed #999; border-bottom: 2px dashed #999; padding: 30px 0; display: flex; justify-content: space-between;">
                <div onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))" style="cursor: pointer; padding: 10px; border: 1px dashed transparent; transition: border 0.3s;" onmouseover="this.style.border='1px dashed #999'" onmouseout="this.style.border='1px dashed transparent'">
                    <strong>CLIENT:</strong><br>
                    ${cli.societe || cli.nom + ' ' + (cli.prenom || '')}<br>
                    ${cli.adresse}<br>
                    ${cli.cp} ${cli.ville}
                </div>
                <div style="text-align: right;">
                    <strong>DEVIS N° ${devis.numero}</strong><br>
                    DATE: ${new Date(devis.created_at).toLocaleDateString()}
                </div>
            </div>
            <table style="width: 100%; border-bottom: 2px solid #333; margin-bottom: 30px; border-collapse: collapse;">
                <thead>
                    <tr style="text-align: left;">
                        <th style="padding: 10px 0;">DESCRIPTION</th>
                         <th style="padding: 10px 0; text-align: center;">QTÉ</th>
                        <th style="text-align: right;">PRIX</th>
                    </tr>
                </thead>
                <tbody>
                 ${(() => {
                const grouped = groupItemsByMetierAndCategorie(devis.items);
                let html = '';
                let globalIndex = 0;
                Object.keys(grouped).sort().forEach(metier => {
                    html += `<tr><td colspan="3" style="font-weight: bold; padding-top: 20px; text-decoration: underline;">${metier}</td></tr>`;
                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        html += `<tr><td colspan="3" style="font-style: italic; padding-top: 10px; padding-left: 15px; color: #555;">> ${categorie}</td></tr>`;
                        grouped[metier][categorie].forEach(item => {
                            const index = globalIndex++;
                            html += `
                            <tr onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'edit', index: ${index}}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#eee'" onmouseout="this.style.background='transparent'">
                                <td style="padding: 10px 0 10px 30px;">
                                    <strong>${item.description}</strong>
                                </td>
                                 <td style="text-align: center;">${item.quantite}</td>
                                <td style="text-align: right;">${item.total_ht} €</td>
                            </tr>`;
                        });
                    });
                });
                return html;
            })()}
                </tbody>
            </table>
            <div style="text-align: right; font-size: 20px;">
                <div>Total HT: ${devis.total_ht} €</div>
                <div onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'tva'}))" style="cursor: pointer; color: #777; font-size: 14px;">TVA: ${devis.total_tva} €</div>
                <div onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'totals'}))" style="cursor: pointer; font-weight: bold; font-size: 28px; margin-top: 10px;">${devis.total_ttc} €</div>
            </div>
        </body></html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 4b. Template FACTURE MINIMALISTE
    // --------------------------------------------------------------------------------
    facture_minimaliste: (facture) => {
        const ent = getCompanyInfo(facture.entreprise);
        const cli = getClientInfo(facture.client);

        const totalPaid = (facture.acomptes || []).reduce((sum, a) => sum + parseFloat(a.total_ttc || 0), 0) +
            (facture.encaissements || []).reduce((sum, e) => sum + parseFloat(e.montant || 0), 0);
        const remaining = Math.max(0, parseFloat(facture.total_ttc) - totalPaid);
        const isPaid = remaining <= 0.05;

        return `
        <html>
        <head>
            <style>
                body { font-family: 'Courier New', Courier, monospace; padding: 40px; color: #333; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .badge { padding: 4px 8px; border: 1px solid #333; font-size: 11px; text-transform: uppercase; font-weight: bold; }
                .badge-paid { background: #333; color: #fff; }
                .badge-unpaid { background: #fff; color: #333; }
            </style>
        </head>
        <body>
             <div style="text-align: center; margin-bottom: 50px;">
                ${ent.logo ? `<img src="${ent.logo}" style="max-width: 60px; max-height: 75px; margin-bottom: 10px;" />` : ''}
                <div style="font-size: 22px; font-weight: bold; text-transform: uppercase;">${ent.nom}</div>
                <div onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))" style="cursor: pointer; padding: 10px; border: 1px dashed transparent; transition: border 0.3s;" onmouseover="this.style.border='1px dashed #999'" onmouseout="this.style.border='1px dashed transparent'">
                    <div style="font-size: 13px; margin-top: 5px;">${ent.adresse}, ${ent.cp} ${ent.ville}</div>
                    <div style="font-size: 13px;">${ent.email} • ${ent.tel}</div>
                    <div style="font-size: 11px; margin-top: 5px; color: #777;">SIRET: ${ent.siret} • APE: ${ent.ape} • TVA: ${ent.tva}</div>
                </div>
            </div>
            <div style="margin-bottom: 40px; border-top: 2px dashed #999; border-bottom: 2px dashed #999; padding: 30px 0; display: flex; justify-content: space-between;">
                <div onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))" style="cursor: pointer; padding: 10px; border: 1px dashed transparent; transition: border 0.3s;" onmouseover="this.style.border='1px dashed #999'" onmouseout="this.style.border='1px dashed transparent'">
                    <strong>FACTURÉ À:</strong><br>
                    ${cli.societe || cli.nom + ' ' + (cli.prenom || '')}<br>
                    ${cli.adresse}<br>
                    ${cli.cp} ${cli.ville}
                </div>
                <div style="text-align: right;">
                    <strong>FACTURE N° ${facture.numero}</strong><br>
                    DATE: ${new Date(facture.created_at).toLocaleDateString()}<br>
                    ÉCHÉANCE: ${new Date(facture.date_echeance).toLocaleDateString()}<br><br>
                     <span class="badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}">${isPaid ? 'PAYÉE' : 'À PAYER'}</span>
                </div>
            </div>
            <table style="width: 100%; border-bottom: 2px solid #333; margin-bottom: 30px; border-collapse: collapse;">
                <thead>
                    <tr style="text-align: left;">
                        <th style="padding: 10px 0;">DESCRIPTION</th>
                         <th style="padding: 10px 0; text-align: center;">QTÉ</th>
                        <th style="text-align: right;">PRIX</th>
                    </tr>
                </thead>
                <tbody>
                 ${(() => {
                const grouped = groupItemsByMetierAndCategorie(facture.items);
                let html = '';
                Object.keys(grouped).sort().forEach(metier => {
                    html += `<tr><td colspan="3" style="font-weight: bold; padding-top: 20px; text-decoration: underline;">${metier}</td></tr>`;
                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        html += `<tr><td colspan="3" style="font-style: italic; padding-top: 10px; padding-left: 15px; color: #555;">> ${categorie}</td></tr>`;
                        grouped[metier][categorie].forEach(item => {
                            html += `
                            <tr>
                                <td style="padding: 10px 0 10px 30px;">
                                    <strong>${item.description}</strong>
                                </td>
                                 <td style="text-align: center;">${item.quantite}</td>
                                <td style="text-align: right;">${parseFloat(item.total_ht).toFixed(2)} €</td>
                            </tr>`;
                        });
                    });
                });
                return html;
            })()}
                </tbody>
            </table>
            
             ${totalPaid > 0 ? `
            <div style="margin-bottom: 20px; font-size: 12px; color: #555; text-align: right;">
                <div>Déjà réglé (Acomptes): - ${totalPaid.toFixed(2)} €</div>
            </div>
            ` : ''}

            <div style="text-align: right; font-size: 20px;">
                <div>Total HT: ${facture.total_ht} €</div>
                <div style="color: #777; font-size: 14px;">TVA: ${facture.total_tva} €</div>
                <div style="font-weight: bold; font-size: 28px; margin-top: 10px;">${remaining.toFixed(2)} €</div>
            </div>
        </body></html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 5. Template PROFESSIONNEL (Fidèle à template_professionnel.html)
    // --------------------------------------------------------------------------------
    professionnel: (devis) => {
        const ent = getCompanyInfo(devis.entreprise);
        const cli = getClientInfo(devis.client);
        // Utiliser les données entreprise si disponibles pour le slogan, sinon default
        const tagline = ent.tagline || 'Excellence • Innovation • Confiance';

        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Arial', 'Helvetica', sans-serif; line-height: 1.4; color: #333333; padding: 40px; background: white; }
                
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0; }
                .logo-section { flex: 1; }
                .logo { width: 60px; height: 60px; background: #1a365d; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; margin-bottom: 15px; object-fit: contain; }
                
                .document-meta { font-size: 12px; color: #666666; line-height: 1.6; }
                
                .company-info { flex: 2; text-align: right; }
                .company-name { font-size: 22px; font-weight: 300; color: #1a365d; margin-bottom: 8px; letter-spacing: 1px; }
                .company-tagline { font-size: 12px; color: #718096; font-style: italic; margin-bottom: 15px; }
                .company-details { font-size: 12px; color: #4a5568; line-height: 1.8; }
                
                .document-title { text-align: center; margin: 40px 0; position: relative; }
                .title { font-size: 32px; font-weight: 100; color: #1a365d; letter-spacing: 4px; margin-bottom: 8px; text-transform: uppercase; }
                .title-line { width: 100px; height: 2px; background: linear-gradient(90deg, #1a365d, #2d3748); margin: 0 auto; }
                .subtitle { font-size: 14px; color: #718096; margin-top: 15px; font-weight: 300; }
                
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0; }
                .info-panel { background: #f7fafc; border-left: 4px solid #1a365d; padding: 25px; }
                .panel-title { font-size: 14px; font-weight: 600; color: #1a365d; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
                .panel-content { font-size: 13px; color: #4a5568; line-height: 1.8; }
                
                .items-section { margin: 50px 0; }
                .section-title { font-size: 18px; font-weight: 300; color: #1a365d; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 2px; position: relative; padding-bottom: 10px; }
                .section-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 50px; height: 2px; background: #1a365d; }
                
                .items-table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .items-table thead { background: linear-gradient(135deg, #1a365d, #2d3748); color: white; }
                .items-table th { padding: 15px 12px; text-align: left; font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-right: 1px solid rgba(255,255,255,0.1); }
                .items-table td { padding: 15px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; vertical-align: top; }
                .items-table tbody tr:hover { background: #f7fafc; }
                .items-table tbody tr:last-child td { border-bottom: 2px solid #1a365d; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .font-medium { font-weight: 500; }
                
                .summary-section { margin: 40px 0; display: flex; justify-content: space-between; align-items: flex-start; }
                .summary-notes { flex: 1; margin-right: 40px; }
                .notes-title { font-size: 14px; font-weight: 600; color: #1a365d; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 1px; }
                .notes-content { font-size: 12px; color: #4a5568; line-height: 1.6; background: #f7fafc; padding: 15px; border-left: 3px solid #1a365d; }
                
                .totals-panel { background: white; border: 1px solid #e2e8f0; min-width: 350px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .totals-header { background: #1a365d; color: white; padding: 15px 20px; font-weight: 500; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
                .totals-body { padding: 20px; }
                .total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
                .total-row:last-child { border-bottom: none; border-top: 2px solid #1a365d; padding-top: 15px; margin-top: 10px; font-weight: 600; font-size: 16px; color: #1a365d; }
                
                .signature-section { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
                .signature-box { border: 1px solid #e2e8f0; background: white; text-align: center; position: relative; min-height: 120px; }
                .signature-header { background: #1a365d; color: white; padding: 12px; font-weight: 500; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; }
                .signature-content { padding: 25px 15px; }
                .signature-subtitle { font-size: 11px; color: #718096; margin-bottom: 30px; font-style: italic; }
                .signature-line { position: absolute; bottom: 15px; left: 15px; right: 15px; border-top: 1px solid #e2e8f0; padding-top: 8px; font-size: 10px; color: #718096; }
                
                .footer { margin-top: 50px; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0; background: #f7fafc; color: #718096; font-size: 11px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo-section">
                    ${ent.logo ? `<img class="logo" src="${ent.logo}" />` : '<div class="logo">CORP</div>'}
                    <div class="document-meta">
                        <strong>Référence:</strong> ${devis.numero}<br>
                        <strong>Date:</strong> ${new Date(devis.created_at).toLocaleDateString()}<br>
                    </div>
                </div>
                <div class="company-info" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f7fafc'" onmouseout="this.style.background='white'">
                    <div class="company-name">${ent.nom} <span style="font-size: 12px; color: #1a365d;">(Modifier)</span></div>
                    <div class="company-tagline">${tagline}</div>
                    <div class="company-details">
                        ${ent.adresse}<br>
                        ${ent.cp} ${ent.ville}<br>
                        Tél: ${ent.tel}<br>
                        Email: ${ent.email}<br>
                        SIRET: ${ent.siret}<br>
                        TVA: ${ent.tva}
                    </div>
                </div>
            </div>

            <div class="document-title">
                <div class="title">Proposition Commerciale</div>
                <div class="title-line"></div>
                <div class="subtitle">Devis détaillé</div>
            </div>

            <div class="info-grid">
                <div class="info-panel" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#ebf8ff'" onmouseout="this.style.background='#f7fafc'">
                    <div class="panel-title">Client <span style="font-size: 11px; font-weight: normal; text-transform: none;">(Modifier)</span></div>
                    <div class="panel-content">
                        <strong>${cli.societe || cli.nom + ' ' + (cli.prenom || '')}</strong><br>
                        ${cli.adresse}<br>
                        ${cli.cp} ${cli.ville}<br><br>
                        <strong>Contact:</strong><br>
                        Tél: ${cli.tel}<br>
                        Email: ${cli.email}
                    </div>
                </div>
                <div class="info-panel">
                    <div class="panel-title">Projet</div>
                    <div class="panel-content">
                        <strong>${devis.titre || 'Devis sans titre'}</strong><br>
                         <!-- Placeholder pour infos projet -->
                    </div>
                </div>
            </div>

            <div class="items-section">
                <div class="section-title">Détail des Prestations</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 40%;">Prestation</th>
                            <th style="width: 10%;" class="text-center">Qté</th>
                            <th style="width: 15%;" class="text-right">P.U. HT</th>
                            <th style="width: 10%;" class="text-center">TVA</th>
                            <th style="width: 15%;" class="text-right">Total TTC</th>
                        </tr>
                    </thead>
                    <tbody>
                     ${(() => {
                const grouped = groupItemsByMetierAndCategorie(devis.items);
                let html = '';
                let globalIndex = 0;
                Object.keys(grouped).sort().forEach(metier => {
                    html += `<tr><td colspan="5" style="background: #f7fafc; color: #1a365d; font-weight: bold; padding: 10px; font-size: 13px; border-bottom: 2px solid #1a365d;">📋 ${metier}</td></tr>`;
                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        html += `<tr><td colspan="5" style="background: white; color: #2d3748; font-weight: 600; padding: 8px 8px 8px 25px; font-size: 12px; font-style: italic;">📂 ${categorie}</td></tr>`;
                        grouped[metier][categorie].forEach(item => {
                            const index = globalIndex++;
                            const totalTTC = (parseFloat(item.total_ht) * (1 + (parseFloat(item.tva) || 0) / 100)).toFixed(2);
                            html += `
                            <tr onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'edit', index: ${index}}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#e3f2fd'" onmouseout="this.style.background='white'">
                                <td style="padding-left: 25px;">
                                    <div class="font-medium">${item.description}</div>
                                </td>
                                <td class="text-center">${item.quantite}</td>
                                <td class="text-right">${parseFloat(item.prix_unitaire).toFixed(2)} €</td>
                                <td class="text-center">${item.tva || 20}%</td>
                                <td class="text-right font-medium">${totalTTC} €</td>
                            </tr>`;
                        });
                    });
                });
                return html;
            })()}
                    </tbody>
                </table>
            </div>

            <div class="summary-section">
                <div class="summary-notes">
                    <div class="notes-title">Notes Importantes</div>
                    <div class="notes-content">
                        <strong>Prestations incluses:</strong> Fourniture de tous les matériaux, main d'œuvre qualifiée.<br><br>
                        <strong>Garanties:</strong> Garantie décennale sur gros œuvre, garantie biennale.<br><br>
                        <strong>Assurances:</strong> Responsabilité civile professionnelle en cours de validité.
                    </div>
                </div>
                <div class="totals-panel">
                    <div class="totals-header">Récapitulatif Financier</div>
                    <div class="totals-body">
                        <div class="total-row">
                            <span class="total-label">Sous-total HT:</span>
                            <span class="total-value">${devis.total_ht} €</span>
                        </div>
                        <div class="total-row" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'tva'}))" style="cursor: pointer;">
                            <span class="total-label">TVA:</span>
                            <span class="total-value">${devis.total_tva} €</span>
                        </div>
                        <div class="total-row" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'totals'}))" style="cursor: pointer;">
                            <span class="total-label">TOTAL TTC:</span>
                            <span class="total-value">${devis.total_ttc} €</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="signature-section">
                <div class="signature-box">
                    <div class="signature-header">Acceptation Client</div>
                    <div class="signature-content">
                        <div class="signature-subtitle">
                            Précédée de la mention manuscrite<br>
                            "Bon pour accord - Lu et approuvé"
                        </div>
                        <div class="signature-line">Date et signature</div>
                    </div>
                </div>
                <div class="signature-box">
                    <div class="signature-header">${ent.nom}</div>
                    <div class="signature-content">
                        <div class="signature-subtitle">
                            Cachet de l'entreprise<br>
                            et signature du représentant légal
                        </div>
                        <div class="signature-line">Date et signature</div>
                    </div>
                </div>
            </div>

            <div class="footer">
                ${ent.nom} - ${ent.adresse}, ${ent.cp} ${ent.ville}<br>
                Tél: ${ent.tel} - Email: ${ent.email} - SIRET: ${ent.siret} - TVA: ${ent.tva}
            </div>
        </body>
        </html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 5b. Template FACTURE PROFESSIONNEL
    // --------------------------------------------------------------------------------
    facture_professionnel: (facture) => {
        const ent = getCompanyInfo(facture.entreprise);
        const cli = getClientInfo(facture.client);
        const tagline = ent.tagline || 'Excellence • Innovation • Confiance';

        const totalPaid = (facture.acomptes || []).reduce((sum, a) => sum + parseFloat(a.total_ttc || 0), 0) +
            (facture.encaissements || []).reduce((sum, e) => sum + parseFloat(e.montant || 0), 0);
        const remaining = Math.max(0, parseFloat(facture.total_ttc) - totalPaid);
        const isPaid = remaining <= 0.05;

        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Arial', 'Helvetica', sans-serif; line-height: 1.4; color: #333333; padding: 40px; background: white; }
                
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #e0e0e0; }
                .logo-section { flex: 1; }
                .logo { width: 60px; height: 60px; background: #1a365d; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; margin-bottom: 15px; object-fit: contain; }
                
                .document-meta { font-size: 12px; color: #666666; line-height: 1.6; }
                
                .company-info { flex: 2; text-align: right; }
                .company-name { font-size: 22px; font-weight: 300; color: #1a365d; margin-bottom: 8px; letter-spacing: 1px; }
                .company-tagline { font-size: 12px; color: #718096; font-style: italic; margin-bottom: 15px; }
                .company-details { font-size: 12px; color: #4a5568; line-height: 1.8; }
                
                .document-title { text-align: center; margin: 40px 0; position: relative; }
                .title { font-size: 32px; font-weight: 100; color: #1a365d; letter-spacing: 4px; margin-bottom: 8px; text-transform: uppercase; }
                .title-line { width: 100px; height: 2px; background: linear-gradient(90deg, #1a365d, #2d3748); margin: 0 auto; }
                .subtitle { font-size: 14px; color: #718096; margin-top: 15px; font-weight: 300; }
                
                .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 40px 0; }
                .info-panel { background: #f7fafc; border-left: 4px solid #1a365d; padding: 25px; }
                .panel-title { font-size: 14px; font-weight: 600; color: #1a365d; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
                .panel-content { font-size: 13px; color: #4a5568; line-height: 1.8; }
                
                .items-section { margin: 50px 0; }
                .section-title { font-size: 18px; font-weight: 300; color: #1a365d; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 2px; position: relative; padding-bottom: 10px; }
                .section-title::after { content: ''; position: absolute; bottom: 0; left: 0; width: 50px; height: 2px; background: #1a365d; }
                
                .items-table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .items-table thead { background: linear-gradient(135deg, #1a365d, #2d3748); color: white; }
                .items-table th { padding: 15px 12px; text-align: left; font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-right: 1px solid rgba(255,255,255,0.1); }
                .items-table td { padding: 15px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; vertical-align: top; }
                .items-table tbody tr:hover { background: #f7fafc; }
                .items-table tbody tr:last-child td { border-bottom: 2px solid #1a365d; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                .font-medium { font-weight: 500; }
                
                .totals-panel { background: white; border: 1px solid #e2e8f0; min-width: 350px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .totals-header { background: #1a365d; color: white; padding: 15px 20px; font-weight: 500; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
                .totals-body { padding: 20px; }
                .total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
                .total-row:last-child { border-bottom: none; border-top: 2px solid #1a365d; padding-top: 15px; margin-top: 10px; font-weight: 600; font-size: 16px; color: #1a365d; }

                .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
                .paid { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                .unpaid { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }

                .footer { margin-top: 50px; text-align: center; padding: 20px; border-top: 1px solid #e2e8f0; background: #f7fafc; color: #718096; font-size: 11px; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo-section">
                    ${ent.logo ? `<img class="logo" src="${ent.logo}" />` : '<div class="logo">CORP</div>'}
                    <div class="document-meta">
                        <strong>Facture N°:</strong> ${facture.numero}<br>
                        <strong>Date:</strong> ${new Date(facture.created_at).toLocaleDateString()}<br>
                        <strong>Échéance:</strong> ${new Date(facture.date_echeance).toLocaleDateString()}
                    </div>
                </div>
                <div class="company-info" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#f7fafc'" onmouseout="this.style.background='white'">
                    <div class="company-name">${ent.nom} <span style="font-size: 12px; color: #1a365d;">(Modifier)</span></div>
                    <div class="company-tagline">${tagline}</div>
                    <div class="company-details">
                        ${ent.adresse}<br>
                        Tél: ${ent.tel} | Email: ${ent.email}<br>
                        SIRET: ${ent.siret} - TVA: ${ent.tva}
                    </div>
                </div>
            </div>

            <div class="document-title">
                <div class="title">FACTURE</div>
                <div class="title-line"></div>
                <div class="subtitle">
                     <span class="badge ${isPaid ? 'paid' : 'unpaid'}">${isPaid ? 'PAYÉE' : 'À PAYER'}</span>
                </div>
            </div>

            <div class="info-grid">
                <div class="info-panel" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))" style="cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#ebf8ff'" onmouseout="this.style.background='#f7fafc'">
                    <div class="panel-title">Facturé à <span style="font-size: 11px; font-weight: normal; text-transform: none;">(Modifier)</span></div>
                    <div class="panel-content">
                        <strong>${cli.societe || cli.nom + ' ' + (cli.prenom || '')}</strong><br>
                        ${cli.adresse}<br>
                        ${cli.cp} ${cli.ville}<br><br>
                        <strong>Contact:</strong><br>
                        Tél: ${cli.tel}<br>
                        Email: ${cli.email}
                    </div>
                </div>
                <div class="info-panel">
                    <div class="panel-title">Récapitulatif</div>
                    <div class="panel-content">
                        <strong>Objet:</strong> ${facture.titre || 'Facture clients'}<br>
                        <strong>Chantier:</strong> ${facture.chantier || 'N/A'}
                    </div>
                </div>
            </div>

            <div class="items-section">
                <div class="section-title">Détail des Prestations</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 40%;">Prestation</th>
                            <th style="width: 10%;" class="text-center">Qté</th>
                            <th style="width: 15%;" class="text-right">P.U. HT</th>
                            <th style="width: 10%;" class="text-center">TVA</th>
                            <th style="width: 15%;" class="text-right">Total TTC</th>
                        </tr>
                    </thead>
                    <tbody>
                     ${(() => {
                const grouped = groupItemsByMetierAndCategorie(facture.items);
                let html = '';
                Object.keys(grouped).sort().forEach(metier => {
                    html += `<tr><td colspan="5" style="background: #f7fafc; color: #1a365d; font-weight: bold; padding: 10px; font-size: 13px; border-bottom: 2px solid #1a365d;">📋 ${metier}</td></tr>`;
                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        html += `<tr><td colspan="5" style="background: white; color: #2d3748; font-weight: 600; padding: 8px 8px 8px 25px; font-size: 12px; font-style: italic;">📂 ${categorie}</td></tr>`;
                        grouped[metier][categorie].forEach(item => {
                            const totalTTC = (parseFloat(item.total_ht) * (1 + (parseFloat(item.tva) || 0) / 100)).toFixed(2);
                            html += `
                            <tr>
                                <td style="padding-left: 25px;">
                                    <div class="font-medium">${item.description}</div>
                                </td>
                                <td class="text-center">${item.quantite}</td>
                                <td class="text-right">${parseFloat(item.prix_unitaire).toFixed(2)} €</td>
                                <td class="text-center">${item.tva || 20}%</td>
                                <td class="text-right font-medium">${totalTTC} €</td>
                            </tr>`;
                        });
                    });
                });
                return html;
            })()}
                    </tbody>
                </table>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 40px;">
                <div class="totals-panel">
                    <div class="totals-header">Total à payer</div>
                    <div class="totals-body">
                        <div class="total-row">
                            <span class="total-label">Total HT:</span>
                            <span class="total-value">${facture.total_ht} €</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">TVA:</span>
                            <span class="total-value">${facture.total_tva} €</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">Total TTC:</span>
                            <span class="total-value">${facture.total_ttc} €</span>
                        </div>
                        ${totalPaid > 0 ? `
                        <div class="total-row" style="color: #27ae60;">
                            <span class="total-label">Déjà réglé:</span>
                            <span class="total-value">- ${totalPaid.toFixed(2)} €</span>
                        </div>
                         <div class="total-row" style="color: #c0392b; border-top: 2px solid #1a365d; margin-top: 10px; padding-top: 10px;">
                            <span class="total-label">RESTE À PAYER:</span>
                            <span class="total-value">${remaining.toFixed(2)} €</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>

            <div class="footer">
                ${ent.nom} - ${ent.adresse}, ${ent.cp} ${ent.ville}<br>
                Tél: ${ent.tel} - Email: ${ent.email} - SIRET: ${ent.siret} - TVA: ${ent.tva}
            </div>
        </body>
        </html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 3. Template FACTURE CLASSIQUE (Basé sur le template devis classique)
    // --------------------------------------------------------------------------------
    facture_classique: (facture) => {
        const ent = getCompanyInfo(facture.entreprise);
        const cli = getClientInfo(facture.client);
        // Calcul du solde
        const totalPaid = (facture.acomptes || []).reduce((sum, a) => sum + parseFloat(a.total_ttc || 0), 0) +
            (facture.encaissements || []).reduce((sum, e) => sum + parseFloat(e.montant || 0), 0);
        const remaining = Math.max(0, parseFloat(facture.total_ttc) - totalPaid);

        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Facture ${facture.numero}</title>
            <style>
                @media print { @page { margin: 0; size: auto; } body { margin: 0; } }
                body { font-family: 'Helvetica', sans-serif; color: #2c3e50; padding: 40px; margin: 0; background: white; }
                
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #2c3e50; }
                .logo-section { flex: 1; }
                .logo { max-width: 120px; max-height: 80px; }
                .company-info { flex: 1; text-align: right; }
                .company-name { font-size: 20px; font-weight: bold; color: #2c3e50; margin-bottom: 8px; }
                .company-details { font-size: 12px; line-height: 1.6; color: #5d6d7e; }
                
                .doc-title { text-align: center; font-size: 28px; font-weight: bold; color: #2c3e50; margin: 30px 0; text-transform: uppercase; letter-spacing: 2px; }
                .badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; margin: 10px 0; }
                .paid { background: #d4edda; color: #155724; }
                .unpaid { background: #f8d7da; color: #721c24; }
                .acompte { background: #fff3cd; color: #856404; }
                
                .document-info { display: flex; justify-content: space-between; margin: 30px 0; }
                .info-block { flex: 1; padding: 15px; background: #f8f9fa; border-radius: 8px; margin: 0 10px; }
                .info-title { font-weight: bold; color: #2c3e50; margin-bottom: 8px; font-size: 14px; }
                
                .client-section { margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #3498db; }
                .section-header { font-size: 16px; font-weight: bold; color: #2c3e50; margin-bottom: 15px; }
                
                .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
                .items-table thead tr { background: #2c3e50; color: white; }
                .items-table th { padding: 12px; text-align: left; font-weight: bold; font-size: 13px; }
                .items-table td { padding: 10px; border-bottom: 1px solid #ecf0f1; font-size: 13px; }
                .items-table tbody tr:hover { background: #f8f9fa; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                
                .acomptes-section { margin: 30px 0; padding: 20px; background: #e8f4f8; border-left: 4px solid #3498db; border-radius: 8px; }
                .acomptes-title { font-size: 16px; font-weight: bold; color: #2c3e50; margin-bottom: 15px; }
                .acomptes-table { width: 100%; font-size: 13px; }
                .acomptes-table td { padding: 8px; border-bottom: 1px solid #dee2e6; }
                
                .totals-section { display: flex; justify-content: flex-end; margin: 30px 0; }
                .totals-table { border: 2px solid #2c3e50; border-collapse: collapse; min-width: 300px; }
                .totals-table td { padding: 12px 20px; border: 1px solid #2c3e50; font-size: 14px; }
                .totals-table .label { background: #f8f9fa; font-weight: bold; text-align: right; }
                .totals-table .value { background: white; text-align: right; font-weight: bold; }
                .totals-table .total-row .label, .totals-table .total-row .value { background: #2c3e50; color: white; font-size: 16px; }
                
                .footer { margin-top: 40px; text-align: center; padding: 15px; border-top: 2px solid #2c3e50; color: #7f8c8d; font-size: 11px; background: #f8f9fa; }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo-section">
                    ${ent.logo ? `<img class="logo" src="${ent.logo}" />` : '<div class="logo">LOGO</div>'}
                    <div style="font-size: 12px; color: #5d6d7e; margin-top: 5px;">
                        <strong>Date:</strong> ${new Date(facture.created_at).toLocaleDateString()}
                    </div>
                </div>
                <div class="company-info">
                    <div class="company-name">${ent.nom}</div>
                    <div class="company-details">
                        ${ent.adresse}<br>
                        ${ent.cp} ${ent.ville}<br>
                        Tél: ${ent.tel} | Email: ${ent.email}<br>
                        SIRET: ${ent.siret} - APE: ${ent.ape} - TVA: ${ent.tva}
                    </div>
                </div>
            </div>

            <div class="doc-title">FACTURE N° ${facture.numero}</div>
            
            <div style="text-align: center;">
                <span class="badge ${facture.type_facture === 'acompte' ? 'acompte' : remaining <= 0.05 ? 'paid' : 'unpaid'}">
                    ${facture.type_facture === 'acompte' ? "FACTURE D'ACOMPTE" : remaining <= 0.05 ? 'PAYÉE' : 'À PAYER'}
                </span>
            </div>

            <div class="client-section">
                <div class="section-header">Informations Client</div>
                <strong>${cli.societe || cli.nom + ' ' + (cli.prenom || '') || 'Client'}</strong><br>
                ${cli.adresse}<br>
                ${cli.cp} ${cli.ville}<br>
                ${cli.tel ? `Tél: ${cli.tel}` : ''}<br>
                ${cli.email ? `Email: ${cli.email}` : ''}
            </div>

            <div class="document-info">
                <div class="info-block">
                    <div class="info-title">Date d'émission</div>
                    ${new Date(facture.created_at).toLocaleDateString()}
                </div>
                <div class="info-block">
                    <div class="info-title">Date d'échéance</div>
                    ${new Date(facture.date_echeance).toLocaleDateString()}
                </div>
                <div class="info-block">
                    <div class="info-title">Type</div>
                    ${facture.type_facture === 'acompte' ? 'Acompte' : 'Finale'}
                </div>
            </div>

            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 45%;">Désignation</th>
                        <th style="width: 10%;" class="text-center">Qté</th>
                        <th style="width: 15%;" class="text-right">P.U. HT</th>
                        <th style="width: 10%;" class="text-center">TVA</th>
                        <th style="width: 20%;" class="text-right">Total HT</th>
                    </tr>
                </thead>
                <tbody>
                    ${(() => {
                const grouped = groupItemsByMetierAndCategorie(facture.items);
                let html = '';

                Object.keys(grouped).sort().forEach(metier => {
                    html += `
                                <tr class="metier-row">
                                    <td colspan="5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: bold; padding: 10px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                                        📋 ${metier}
                                    </td>
                                </tr>
                            `;

                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        html += `
                                    <tr class="categorie-row">
                                        <td colspan="5" style="background: #f0f4f8; font-weight: 600; padding: 8px; padding-left: 30px; color: #2c3e50; font-size: 13px; border-left: 4px solid #667eea;">
                                            📂 ${categorie}
                                        </td>
                                    </tr>
                                `;

                        grouped[metier][categorie].forEach(item => {
                            html += `
                                        <tr>
                                            <td style="padding-left: 50px;">
                                                <div>${item.description}</div>
                                            </td>
                                            <td class="text-center">${item.quantite}</td>
                                            <td class="text-right">${parseFloat(item.prix_unitaire).toFixed(2)} €</td>
                                            <td class="text-center">${item.tva || 20}%</td>
                                            <td class="text-right">${parseFloat(item.total_ht).toFixed(2)} €</td>
                                        </tr>
                                    `;
                        });
                    });
                });

                return html;
            })()}
                </tbody>
            </table>

            ${facture.acomptes && facture.acomptes.length > 0 ? `
                <div class="acomptes-section">
                    <div class="acomptes-title">📊 Acomptes déjà versés</div>
                    <table class="acomptes-table">
                        ${facture.acomptes.map(a => `
                            <tr>
                                <td><strong>Facture ${a.numero}</strong></td>
                                <td>${new Date(a.created_at).toLocaleDateString()}</td>
                                <td style="text-align: right; font-weight: bold; color: #27ae60;">${parseFloat(a.total_ttc).toFixed(2)} €</td>
                            </tr>
                        `).join('')}
                        <tr style="border-top: 2px solid #3498db;">
                            <td colspan="2"><strong>Total acomptes</strong></td>
                            <td style="text-align: right; font-weight: bold; color: #27ae60;">${totalPaid.toFixed(2)} €</td>
                        </tr>
                    </table>
                </div>
            ` : ''}

            <div class="totals-section">
                <table class="totals-table">
                    <tr><td class="label">Total HT:</td><td class="value">${facture.total_ht} €</td></tr>
                    <tr><td class="label">TVA:</td><td class="value">${facture.total_tva} €</td></tr>
                    <tr><td class="label">Total TTC:</td><td class="value">${facture.total_ttc} €</td></tr>
                    ${totalPaid > 0 ? `
                        <tr><td class="label">Acomptes versés:</td><td class="value">- ${totalPaid.toFixed(2)} €</td></tr>
                        <tr class="total-row"><td class="label">SOLDE À PAYER:</td><td class="value">${remaining.toFixed(2)} €</td></tr>
                    ` : `
                        <tr class="total-row"><td class="label">NET À PAYER:</td><td class="value">${facture.total_ttc} €</td></tr>
                    `}
                </table>
            </div>

            <div class="footer">
                ${ent.nom} - ${ent.adresse}, ${ent.cp} ${ent.ville}<br>
                Tél: ${ent.tel} - Email: ${ent.email} - SIRET: ${ent.siret} - TVA: ${ent.tva}
            </div>
        </body>
        </html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 4. Template FACTURE MODERNE (Basé sur le template devis moderne)
    // --------------------------------------------------------------------------------
    facture_moderne: (facture) => {
        const ent = getCompanyInfo(facture.entreprise);
        const cli = getClientInfo(facture.client);
        // Calcul du solde
        const totalPaid = (facture.acomptes || []).reduce((sum, a) => sum + parseFloat(a.total_ttc || 0), 0) +
            (facture.encaissements || []).reduce((sum, e) => sum + parseFloat(e.montant || 0), 0);
        const remaining = Math.max(0, parseFloat(facture.total_ttc) - totalPaid);
        const dateFacture = new Date(facture.created_at).toLocaleDateString();
        const dateEcheance = new Date(facture.date_echeance).toLocaleDateString();

        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Facture ${facture.numero}</title>
            <style>
                @media print { @page { margin: 0; size: auto; } body { margin: 0; } }
                body { font-family: 'Helvetica', sans-serif; color: #333; padding: 0; margin: 0; background: #fff; }
                
                .header-bg { background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%); height: 15px; width: 100%; }
                
                .container { padding: 40px; max-width: 1000px; margin: 0 auto; }
                
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 50px; }
                .logo-section { flex: 1; }
                .logo { max-width: 150px; max-height: 100px; object-fit: contain; }
                .company-info { flex: 1; text-align: right; }
                .company-name { font-size: 24px; font-weight: bold; color: #2c3e50; margin-bottom: 5px; letter-spacing: 0.5px; }
                .company-details { font-size: 13px; line-height: 1.6; color: #7f8c8d; }
                
                .document-title { text-align: center; margin: 40px 0; position: relative; }
                .title { font-size: 32px; font-weight: 800; color: #2c3e50; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 10px; }
                .subtitle { font-size: 14px; color: #3498db; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
                
                .info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 50px; }
                .info-card { background: white; border-radius: 12px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-left: 4px solid #3498db; position: relative; overflow: hidden; }
                .info-card::before { content: ''; position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: linear-gradient(135deg, transparent 50%, rgba(52, 152, 219, 0.05) 50%); }
                .card-title { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #95a5a6; margin-bottom: 15px; letter-spacing: 1px; }
                .card-content { font-size: 14px; line-height: 1.6; color: #2c3e50; }
                
                .items-section { margin-bottom: 50px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .section-title { padding: 20px 30px; background: #f8f9fa; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #ecf0f1; font-size: 16px; display: flex; justify-content: space-between; align-items: center; }
                
                .items-table { width: 100%; border-collapse: collapse; }
                .items-table thead { background: linear-gradient(135deg, #3498db, #2980b9); color: white; }
                .items-table th { padding: 18px 15px; text-align: left; font-weight: 600; font-size: 14px; letter-spacing: 0.5px; }
                .items-table td { padding: 15px; border-bottom: 1px solid #ecf0f1; font-size: 14px; }
                .items-table tbody tr:hover { background: #f8f9fa; }
                .items-table tbody tr:last-child td { border-bottom: none; }
                .text-right { text-align: right; }
                .text-center { text-align: center; }
                
                .badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
                .paid { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
                .unpaid { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
                .acompte { background: #fff3cd; color: #856404; border: 1px solid #ffeeba; }

                .acomptes-section { margin: 40px 0; background: #fff; border-radius: 12px; padding: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; }
                .acomptes-header { background: linear-gradient(135deg, #f8f9fa, #e9ecef); padding: 15px 30px; font-weight: bold; color: #2c3e50; border-bottom: 1px solid #dee2e6; }
                .acomptes-table { width: 100%; border-collapse: collapse; }
                .acomptes-table td { padding: 15px 30px; border-bottom: 1px solid #ecf0f1; font-size: 14px; }
                
                .totals-section { margin: 40px 0; display: flex; justify-content: flex-end; }
                .totals-card { background: linear-gradient(135deg, #f8f9fa, #e9ecef); border-radius: 12px; padding: 30px; min-width: 350px; border: 1px solid #dee2e6; }
                .total-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #dee2e6; }
                .total-row:last-child { border-bottom: none; font-size: 18px; font-weight: 700; color: #2c3e50; padding-top: 20px; margin-top: 10px; border-top: 2px solid #3498db; }
                .total-label { font-weight: 600; color: #5d6d7e; }
                .total-value { font-weight: 600; color: #2c3e50; }
                
                .footer { margin-top: 50px; text-align: center; padding: 20px; border-top: 1px solid #ecf0f1; color: #7f8c8d; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="header-bg"></div>
            <div class="container">
                <div class="header">
                     <div class="logo-section">
                        ${ent.logo ? `<img class="logo" src="${ent.logo}" />` : '<div class="logo">LOGO</div>'}
                        <div style="font-size: 14px; color: #7f8c8d; margin-top: 15px;">
                            <strong>Date:</strong> ${dateFacture}<br>
                            <strong>Echéance:</strong> ${dateEcheance}
                        </div>
                    </div>
                    <div class="company-info" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))" style="cursor: pointer; transition: all 0.3s;" onmouseover="this.style.background='#e8f4f8'; this.style.transform='translateX(-5px)'" onmouseout="this.style.background='transparent'; this.style.transform='translateX(0)'">
                        <div class="company-name">${ent.nom} <span style="font-size: 12px; color: #3498db; font-weight: normal;">(Cliquer pour modifier)</span></div>
                        <div class="company-details">
                            ${ent.adresse}<br>
                            ${ent.cp} ${ent.ville}<br>
                            Tél: ${ent.tel} | Email: ${ent.email}<br>
                            SIRET: ${ent.siret}
                        </div>
                    </div>
                </div>

                <div class="document-title">
                    <div class="title">FACTURE N° ${facture.numero}</div>
                    <div class="subtitle">
                        <span class="badge ${facture.type_facture === 'acompte' ? 'acompte' : remaining <= 0.05 ? 'paid' : 'unpaid'}">
                            ${facture.type_facture === 'acompte' ? "FACTURE D'ACOMPTE" : remaining <= 0.05 ? 'PAYÉE' : 'À PAYER'}
                        </span>
                    </div>
                </div>

                <div class="info-cards">
                    <div class="info-card" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))" style="cursor: pointer; transition: all 0.3s;" onmouseover="this.style.borderLeftColor='#2980b9'; this.style.transform='translateX(5px)'" onmouseout="this.style.borderLeftColor='#3498db'; this.style.transform='translateX(0)'">
                         <div class="card-title">Client <span style="font-size: 11px; color: #3498db; font-weight: normal; text-transform: none;">(Cliquer pour modifier)</span></div>
                        <div class="card-content">
                            <strong>${cli.societe || cli.nom + ' ' + (cli.prenom || '') || 'Client'}</strong><br>
                            ${cli.adresse}<br>
                            ${cli.cp} ${cli.ville}<br>
                            ${cli.tel ? `Tél: ${cli.tel}` : ''}<br>
                            ${cli.email ? `Email: ${cli.email}` : ''}
                        </div>
                    </div>
                    <div class="info-card">
                        <div class="card-title">Détails</div>
                        <div class="card-content">
                             Type: <strong>${facture.type_facture === 'acompte' ? 'Acompte' : 'Finale'}</strong><br>
                             Source: Devis N° ${facture.source_devis_id ? 'lié' : ' - '}<br>
                             Conditions: Paiement à réception
                        </div>
                    </div>
                </div>

                <div class="items-section">
                    <div class="section-title">
                        <span>Détail des Prestations</span>
                    </div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th style="width: 45%;">Désignation</th>
                                <th style="width: 10%;" class="text-center">Qté</th>
                                <th style="width: 15%;" class="text-right">P.U. HT</th>
                                <th style="width: 10%;" class="text-center">TVA</th>
                                <th style="width: 20%;" class="text-right">Total HT</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${(() => {
                const grouped = groupItemsByMetierAndCategorie(facture.items);
                let html = '';

                Object.keys(grouped).sort().forEach(metier => {
                    // Ligne Métier (style moderne avec dégradé)
                    html += `
                                        <tr class="metier-row">
                                            <td colspan="5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: bold; padding: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                                                📋 ${metier}
                                            </td>
                                        </tr>
                                    `;

                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        // Ligne Catégorie
                        html += `
                                            <tr class="categorie-row">
                                                <td colspan="5" style="background: linear-gradient(to right, #f0f4f8 0%, #e8eef3 100%); font-weight: 600; padding: 10px; padding-left: 35px; color: #2c3e50; font-size: 13px; border-left: 5px solid #667eea; box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);">
                                                    📂 ${categorie}
                                                </td>
                                            </tr>
                                        `;

                        grouped[metier][categorie].forEach(item => {
                            html += `
                                                <tr style="border-bottom: 1px solid #ecf0f1;">
                                                    <td style="padding-left: 55px; padding-top: 10px; padding-bottom: 10px;">
                                                        <div style="color: #34495e; font-weight: 500;">${item.description}</div>
                                                    </td>
                                                    <td class="text-center" style="color: #7f8c8d;">${item.quantite}</td>
                                                    <td class="text-right" style="color: #2c3e50; font-weight: 500;">${parseFloat(item.prix_unitaire).toFixed(2)} €</td>
                                                    <td class="text-center" style="color: #7f8c8d;">${item.tva || 20}%</td>
                                                    <td class="text-right" style="color: #27ae60; font-weight: bold;">${parseFloat(item.total_ht).toFixed(2)} €</td>
                                                </tr>
                                            `;
                        });
                    });
                });

                return html;
            })()}
                        </tbody>
                    </table>
                </div>

                ${facture.acomptes && facture.acomptes.length > 0 ? `
                    <div class="acomptes-section">
                        <div class="acomptes-header">📊 Acomptes déjà versés</div>
                        <table class="acomptes-table">
                            ${facture.acomptes.map(a => `
                                <tr>
                                    <td><strong>Facture ${a.numero}</strong></td>
                                    <td>${new Date(a.created_at).toLocaleDateString()}</td>
                                    <td style="text-align: right; font-weight: bold; color: #27ae60;">${parseFloat(a.total_ttc).toFixed(2)} €</td>
                                </tr>
                            `).join('')}
                            <tr style="border-top: 2px solid #3498db; background: #fff;">
                                <td colspan="2" style="font-weight: bold; text-align: right;">Total acomptes</td>
                                <td style="text-align: right; font-weight: bold; color: #27ae60;">${totalPaid.toFixed(2)} €</td>
                            </tr>
                        </table>
                    </div>
                ` : ''}

                <div class="totals-section">
                    <div class="totals-card">
                        <div class="total-row">
                            <span class="total-label">Total HT</span>
                            <span class="total-value">${facture.total_ht} €</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">TVA</span>
                            <span class="total-value">${facture.total_tva} €</span>
                        </div>
                        <div class="total-row">
                            <span class="total-label">Total TTC</span>
                            <span class="total-value" style="font-size: 16px;">${facture.total_ttc} €</span>
                        </div>
                        
                        ${totalPaid > 0 ? `
                            <div class="total-row" style="margin-top: 15px; border-top: 1px dashed #bdc3c7; padding-top: 15px;">
                                <span class="total-label">Acomptes versés</span>
                                <span class="total-value" style="color: #27ae60;">- ${totalPaid.toFixed(2)} €</span>
                            </div>
                            <div class="total-row">
                                <span class="total-label">SOLDE À PAYER</span>
                                <span class="total-value" style="color: #c0392b;">${remaining.toFixed(2)} €</span>
                            </div>
                        ` : `
                            <div class="total-row">
                                <span class="total-label">NET À PAYER</span>
                                <span class="total-value" style="color: #2980b9;">${facture.total_ttc} €</span>
                            </div>
                        `}
                    </div>
                </div>

                <div class="footer">
                    ${ent.nom} - ${ent.adresse}, ${ent.cp} ${ent.ville}<br>
                    SIRET: ${ent.siret} - TVA: ${ent.tva}
                </div>
            </div>
        </body>
        </html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 5. Template BÂTIMENT (Style chantier / BTP)
    // --------------------------------------------------------------------------------
    batiment: (devis) => {
        const ent = getCompanyInfo(devis.entreprise);
        const cli = getClientInfo(devis.client);
        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Devis ${devis.numero}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #2c3e50; background: #ffffff; }
        .container { max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; min-height: 297mm; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #e67e22, #d35400); color: white; border-radius: 8px; }
        .logo-section { flex: 1; }
        .logo { width: 70px; height: 70px; background: white; color: #e67e22; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .logo img { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }
        .document-info { font-size: 13px; line-height: 1.6; }
        .company-info { flex: 2; text-align: right; }
        .company-name { font-size: 26px; font-weight: bold; margin-bottom: 8px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
        .company-specialty { font-size: 14px; margin-bottom: 15px; font-style: italic; opacity: 0.9; }
        .company-details { font-size: 12px; line-height: 1.8; opacity: 0.95; }
        .document-title { text-align: center; margin: 30px 0; padding: 20px; background: #f39c12; color: white; border-radius: 8px; position: relative; }
        .document-title::before { content: '🏗️'; font-size: 24px; position: absolute; left: 20px; top: 50%; transform: translateY(-50%); }
        .document-title::after { content: '🏗️'; font-size: 24px; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px; }
        .subtitle { font-size: 14px; opacity: 0.9; }
        .project-banner { background: linear-gradient(135deg, #34495e, #2c3e50); color: white; padding: 20px; border-radius: 8px; margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center; }
        .banner-item { padding: 10px; }
        .banner-icon { font-size: 24px; margin-bottom: 8px; }
        .banner-label { font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
        .banner-value { font-size: 16px; font-weight: bold; margin-top: 5px; }
        .client-section { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 30px 0; }
        .info-card { background: #ecf0f1; border-radius: 8px; padding: 20px; border-left: 5px solid #e67e22; position: relative; }
        .card-icon { position: absolute; top: 15px; right: 15px; font-size: 20px; color: #e67e22; }
        .card-title { font-size: 16px; font-weight: bold; color: #2c3e50; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .card-content { font-size: 13px; color: #34495e; line-height: 1.7; }
        .items-section { margin: 40px 0; }
        .section-header { background: #e67e22; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; }
        .section-header::before { content: '📋'; margin-right: 10px; font-size: 18px; }
        .items-table { width: 100%; border-collapse: collapse; background: white; border: 2px solid #e67e22; border-top: none; }
        .items-table thead { background: #f39c12; color: white; }
        .items-table th { padding: 12px 10px; text-align: left; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-right: 1px solid rgba(255,255,255,0.3); }
        .items-table th:last-child { border-right: none; }
        .items-table td { padding: 12px 10px; border-bottom: 1px solid #ecf0f1; border-right: 1px solid #ecf0f1; font-size: 12px; vertical-align: top; }
        .items-table td:last-child { border-right: none; }
        .items-table tbody tr:nth-child(even) { background: #fdf6e3; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .totals-section { margin: 30px 0; display: flex; justify-content: flex-end; }
        .totals-card { background: linear-gradient(135deg, #34495e, #2c3e50); color: white; border-radius: 8px; overflow: hidden; min-width: 400px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .totals-header { background: #e67e22; padding: 15px 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; }
        .totals-header::before { content: '💰'; margin-right: 10px; font-size: 18px; }
        .totals-body { padding: 20px; }
        .total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2); }
        .total-row:last-child { border-bottom: none; border-top: 2px solid #e67e22; padding-top: 15px; margin-top: 10px; font-size: 18px; font-weight: bold; }
        .total-label { font-size: 14px; }
        .total-value { font-weight: bold; font-size: 16px; }
        .certifications { background: #f8f9fa; border: 2px solid #e67e22; border-radius: 8px; padding: 20px; margin: 30px 0; }
        .cert-title { color: #e67e22; font-weight: bold; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; }
        .cert-title::before { content: '🏆'; margin-right: 10px; font-size: 18px; }
        .cert-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; text-align: center; }
        .cert-item { background: white; padding: 15px; border-radius: 6px; border: 1px solid #dee2e6; }
        .cert-icon { font-size: 24px; margin-bottom: 8px; }
        .cert-label { font-size: 11px; color: #6c757d; font-weight: bold; }
        .terms-section { margin: 40px 0; }
        .terms-content { background: #f8f9fa; border: 2px solid #e67e22; border-top: none; padding: 25px; border-radius: 0 0 8px 8px; }
        .terms-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
        .terms-column h4 { color: #e67e22; margin-bottom: 12px; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; }
        .terms-column h4::before { content: '⚠️'; margin-right: 8px; font-size: 16px; }
        .terms-list { list-style: none; padding: 0; }
        .terms-list li { padding: 6px 0; font-size: 12px; color: #495057; line-height: 1.5; position: relative; padding-left: 20px; }
        .terms-list li::before { content: '🔸'; position: absolute; left: 0; font-size: 10px; }
        .signature-section { margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .signature-box { background: linear-gradient(135deg, #ecf0f1, #bdc3c7); border: 2px solid #e67e22; border-radius: 8px; text-align: center; min-height: 140px; position: relative; overflow: hidden; }
        .signature-header { background: #e67e22; color: white; padding: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        .signature-content { padding: 25px 15px; }
        .signature-subtitle { font-size: 11px; color: #6c757d; margin-bottom: 25px; font-style: italic; }
        .signature-line { position: absolute; bottom: 15px; left: 15px; right: 15px; border-top: 2px solid #e67e22; padding-top: 8px; font-size: 10px; color: #6c757d; font-weight: bold; }
        .footer { margin-top: 40px; background: linear-gradient(135deg, #2c3e50, #34495e); color: white; text-align: center; padding: 20px; border-radius: 8px; font-size: 11px; line-height: 1.6; }
        @media print { .container { margin: 0; padding: 15mm; } }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <div class="logo">
                   ${ent.logo ? `<img src="${ent.logo}" />` : 'BTP'}
                </div>
                <div class="document-info">
                    <strong>Devis N°:</strong> ${devis.numero}<br>
                    <strong>Date:</strong> ${new Date(devis.created_at).toLocaleDateString()}<br>
                    <strong>Validité:</strong> 30 jours<br>
                    <strong>Chargé d'affaires:</strong> ${ent.nom}
                </div>
            </div>
            <div class="company-info" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))">
                <div class="company-name">${ent.nom}</div>
                <div class="company-specialty">${ent.activite || 'Bâtiment Général'}</div>
                <div class="company-details">
                    ${ent.adresse}<br>
                    ${ent.cp} ${ent.ville}<br>
                    Tél: ${ent.tel} | Email: ${ent.email}<br>
                    SIRET: ${ent.siret}
                </div>
            </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
            <div class="title">Devis Travaux</div>
            <div class="subtitle">${devis.titre || 'Rénovation'}</div>
        </div>

        <!-- Project Banner -->
        <div class="project-banner">
            <div class="banner-item">
                <div class="banner-icon">🏠</div>
                <div class="banner-label">Type de Projet</div>
                <div class="banner-value">${devis.type_travaux || 'Rénovation'}</div>
            </div>
            <div class="banner-item">
                <div class="banner-icon">📐</div>
                <div class="banner-label">Client</div>
                <div class="banner-value">${cli.nom || 'N/A'}</div>
            </div>
             <div class="banner-item">
                <div class="banner-icon">⏱️</div>
                <div class="banner-label">Date</div>
                <div class="banner-value">${new Date(devis.created_at).toLocaleDateString()}</div>
            </div>
        </div>

        <!-- Client Section -->
        <div class="client-section">
            <div class="info-card" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))">
                <div class="card-icon">👤</div>
                <div class="card-title">Maître d'Ouvrage</div>
                <div class="card-content">
                    <strong>${cli.societe || cli.nom + ' ' + (cli.prenom || '')}</strong><br>
                    ${cli.adresse}<br>
                    ${cli.cp} ${cli.ville}<br><br>
                    <strong>Contact:</strong><br>
                    Tél: ${cli.tel}<br>
                    Email: ${cli.email}
                </div>
            </div>
            <div class="info-card">
                <div class="card-icon">🏗️</div>
                <div class="card-title">Lieu des Travaux</div>
                <div class="card-content">
                    <strong>${devis.chantier_nom || 'Chantier Client'}</strong><br>
                    ${devis.chantier_adresse || cli.adresse}<br>
                    ${devis.chantier_cp || cli.cp} ${devis.chantier_ville || cli.ville}
                </div>
            </div>
        </div>

        <!-- Certifications -->
        <div class="certifications">
            <div class="cert-title">Nos Certifications & Assurances</div>
            <div class="cert-grid">
                <div class="cert-item">
                    <div class="cert-icon">🏆</div>
                    <div class="cert-label">QUALIBAT</div>
                </div>
                <div class="cert-item">
                    <div class="cert-icon">🌱</div>
                    <div class="cert-label">RGE</div>
                </div>
                <div class="cert-item">
                    <div class="cert-icon">🛡️</div>
                    <div class="cert-label">DÉCENNALE</div>
                </div>
            </div>
        </div>

        <!-- Items Section -->
        <div class="items-section">
            <div class="section-header">Détail des Prestations</div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 35%;">Désignation</th>
                        <th style="width: 8%;" class="text-center">U.</th>
                        <th style="width: 8%;" class="text-center">Qté</th>
                        <th style="width: 12%;" class="text-right">P.U. HT</th>
                        <th style="width: 6%;" class="text-center">TVA</th>
                        <th style="width: 12%;" class="text-right">Total TTC</th>
                    </tr>
                </thead>
                <tbody>
                     ${(() => {
                const grouped = groupItemsByMetierAndCategorie(devis.items);
                let html = '';
                let globalIndex = 0;
                Object.keys(grouped).sort().forEach(metier => {
                    html += `<tr style="background:#e67e22; color:white;"><td colspan="6" style="font-weight:bold; padding:10px;">🏗️ ${metier}</td></tr>`;
                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        html += `<tr style="background:#fbe6c2;"><td colspan="6" style="padding:5px 20px; font-weight:bold; color:#d35400;">🔹 ${categorie}</td></tr>`;
                        grouped[metier][categorie].forEach(item => {
                            const index = globalIndex++;
                            const totalTTC = (parseFloat(item.total_ht) * (1 + (parseFloat(item.tva) || 0) / 100)).toFixed(2);
                            html += `
                                    <tr onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'edit', index: ${index}}))" style="cursor: pointer;">
                                        <td>
                                            <div style="font-weight:bold;">${item.description || item.designation || 'Article'}</div>
                                            <div style="font-size:11px; color:#666;">${item.details || ''}</div>
                                        </td>
                                        <td class="text-center">${item.unite || 'u'}</td>
                                        <td class="text-center">${item.quantite}</td>
                                        <td class="text-right">${parseFloat(item.prix_unitaire).toFixed(2)} €</td>
                                        <td class="text-center">${item.tva || 0}%</td>
                                        <td class="text-right font-bold">${totalTTC} €</td>
                                    </tr>`;
                        });
                    });
                });
                return html;
            })()}
                </tbody>
            </table>
        </div>

        <!-- Totals -->
        <div class="totals-section">
            <div class="totals-card" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'totals'}))" style="cursor: pointer;">
                <div class="totals-header">Récapitulatif des Coûts</div>
                <div class="totals-body">
                    <div class="total-row">
                        <span class="total-label">Sous-total HT:</span>
                        <span class="total-value">${devis.total_ht} €</span>
                    </div>
                    <div class="total-row" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'tva'}))" style="cursor: pointer;">
                        <span class="total-label">TVA:</span>
                        <span class="total-value">${devis.total_tva} €</span>
                    </div>
                    <div class="total-row">
                        <span class="total-label">TOTAL TTC:</span>
                        <span class="total-value">${devis.total_ttc} €</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Terms -->
        <div class="terms-section">
            <div class="section-header">Conditions Particulières</div>
            <div class="terms-content">
                <div class="terms-grid">
                    <div class="terms-column">
                        <h4>Modalités</h4>
                        <ul class="terms-list">
                            <li>Devis valable 30 jours</li>
                            <li>Acompte de 30% à la signature</li>
                            <li>Solde à la réception</li>
                        </ul>
                    </div>
                    <div class="terms-column">
                        <h4>Garanties</h4>
                        <ul class="terms-list">
                            <li>Garantie décennale incluse</li>
                            <li>Responsabilité Civile Pro</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Signatures -->
        <div class="signature-section">
            <div class="signature-box">
                <div class="signature-header">Acceptation Client</div>
                <div class="signature-content">
                    <div class="signature-subtitle">"Bon pour accord"</div>
                    <div class="signature-line">Date et signature</div>
                </div>
            </div>
            <div class="signature-box">
                <div class="signature-header">L'Entreprise</div>
                <div class="signature-content">
                    <div class="signature-subtitle">Cachet et signature</div>
                    <div class="signature-line">Date et signature</div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            ${ent.nom} - ${ent.adresse}, ${ent.cp} ${ent.ville}<br>
            SIRET: ${ent.siret} - TVA: ${ent.tva || 'Non renseigné'}
        </div>
    </div>
</body>
</html>
        `;
    },

    // --------------------------------------------------------------------------------
    // 6. Template FACTURE BÂTIMENT
    // --------------------------------------------------------------------------------
    facture_batiment: (facture) => {
        const ent = getCompanyInfo(facture.entreprise);
        const cli = getClientInfo(facture.client);

        const totalPaid = (facture.acomptes || []).reduce((sum, a) => sum + parseFloat(a.total_ttc || 0), 0) +
            (facture.encaissements || []).reduce((sum, e) => sum + parseFloat(e.montant || 0), 0);
        const remaining = Math.max(0, parseFloat(facture.total_ttc) - totalPaid);
        const isPaid = remaining <= 0.05;

        return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Facture ${facture.numero}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; line-height: 1.5; color: #2c3e50; background: #ffffff; }
        .container { max-width: 210mm; margin: 0 auto; padding: 20mm; background: white; min-height: 297mm; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #e67e22, #d35400); color: white; border-radius: 8px; }
        .logo-section { flex: 1; }
        .logo { width: 70px; height: 70px; background: white; color: #e67e22; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-bottom: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .logo img { width: 100%; height: 100%; object-fit: contain; border-radius: 8px; }
        .document-info { font-size: 13px; line-height: 1.6; }
        .company-info { flex: 2; text-align: right; }
        .company-name { font-size: 26px; font-weight: bold; margin-bottom: 8px; text-shadow: 1px 1px 2px rgba(0,0,0,0.3); }
        .company-specialty { font-size: 14px; margin-bottom: 15px; font-style: italic; opacity: 0.9; }
        .company-details { font-size: 12px; line-height: 1.8; opacity: 0.95; }
        .document-title { text-align: center; margin: 30px 0; padding: 20px; background: #d35400; color: white; border-radius: 8px; position: relative; }
        .document-title::before { content: '📄'; font-size: 24px; position: absolute; left: 20px; top: 50%; transform: translateY(-50%); }
        .document-title::after { content: '📄'; font-size: 24px; position: absolute; right: 20px; top: 50%; transform: translateY(-50%); }
        .title { font-size: 28px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 2px; }
        .subtitle { font-size: 14px; opacity: 0.9; }
        .project-banner { background: linear-gradient(135deg, #34495e, #2c3e50); color: white; padding: 20px; border-radius: 8px; margin: 30px 0; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; text-align: center; }
        .banner-item { padding: 10px; }
        .banner-icon { font-size: 24px; margin-bottom: 8px; }
        .banner-label { font-size: 12px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; }
        .banner-value { font-size: 16px; font-weight: bold; margin-top: 5px; }
        .client-section { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; margin: 30px 0; }
        .info-card { background: #ecf0f1; border-radius: 8px; padding: 20px; border-left: 5px solid #e67e22; position: relative; }
        .card-icon { position: absolute; top: 15px; right: 15px; font-size: 20px; color: #e67e22; }
        .card-title { font-size: 16px; font-weight: bold; color: #2c3e50; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
        .card-content { font-size: 13px; color: #34495e; line-height: 1.7; }
        .items-section { margin: 40px 0; }
        .section-header { background: #e67e22; color: white; padding: 15px 20px; border-radius: 8px 8px 0 0; font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; }
        .section-header::before { content: '📋'; margin-right: 10px; font-size: 18px; }
        .items-table { width: 100%; border-collapse: collapse; background: white; border: 2px solid #e67e22; border-top: none; }
        .items-table thead { background: #f39c12; color: white; }
        .items-table th { padding: 12px 10px; text-align: left; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-right: 1px solid rgba(255,255,255,0.3); }
        .items-table th:last-child { border-right: none; }
        .items-table td { padding: 12px 10px; border-bottom: 1px solid #ecf0f1; border-right: 1px solid #ecf0f1; font-size: 12px; vertical-align: top; }
        .items-table td:last-child { border-right: none; }
        .items-table tbody tr:nth-child(even) { background: #fdf6e3; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }
        .totals-section { margin: 30px 0; display: flex; justify-content: flex-end; }
        .totals-card { background: linear-gradient(135deg, #34495e, #2c3e50); color: white; border-radius: 8px; overflow: hidden; min-width: 400px; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        .totals-header { background: #e67e22; padding: 15px 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; }
        .totals-header::before { content: '💰'; margin-right: 10px; font-size: 18px; }
        .totals-body { padding: 20px; }
        .total-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.2); }
        .total-row:last-child { border-bottom: none; border-top: 2px solid #e67e22; padding-top: 15px; margin-top: 10px; font-size: 18px; font-weight: bold; }
        .total-label { font-size: 14px; }
        .total-value { font-weight: bold; font-size: 16px; }
        .badge { display: inline-block; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-left: 10px; }
        .badge-paid { background: #2ecc71; color: white; }
        .badge-unpaid { background: #e74c3c; color: white; }
        
        .footer { margin-top: 40px; background: linear-gradient(135deg, #2c3e50, #34495e); color: white; text-align: center; padding: 20px; border-radius: 8px; font-size: 11px; line-height: 1.6; }
        @media print { .container { margin: 0; padding: 15mm; } }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <div class="logo">
                   ${ent.logo ? `<img src="${ent.logo}" />` : 'BTP'}
                </div>
                <div class="document-info">
                    <strong>Facture N°:</strong> ${facture.numero}<br>
                    <strong>Date:</strong> ${new Date(facture.created_at).toLocaleDateString()}<br>
                    <strong>Échéance:</strong> ${new Date(facture.date_echeance).toLocaleDateString()}<br>
                    <strong>Statut:</strong> <span class="badge ${isPaid ? 'badge-paid' : 'badge-unpaid'}">${isPaid ? 'PAYÉE' : 'À PAYER'}</span>
                </div>
            </div>
            <div class="company-info" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))">
                <div class="company-name">${ent.nom}</div>
                <div class="company-specialty">${ent.activite || 'Bâtiment Général'}</div>
                <div class="company-details">
                    ${ent.adresse}<br>
                    ${ent.cp} ${ent.ville}<br>
                    Tél: ${ent.tel} | Email: ${ent.email}<br>
                    SIRET: ${ent.siret}
                </div>
            </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
            <div class="title">Facture</div>
            <div class="subtitle">${facture.titre || 'Travaux'}</div>
        </div>

        <!-- Project Banner -->
        <div class="project-banner">
            <div class="banner-item">
                <div class="banner-icon">🏠</div>
                <div class="banner-label">Chantier</div>
                <div class="banner-value">${facture.chantier_nom || 'Chantier Client'}</div>
            </div>
            <div class="banner-item">
                <div class="banner-icon">📐</div>
                <div class="banner-label">Client</div>
                <div class="banner-value">${cli.nom || 'N/A'}</div>
            </div>
            <div class="banner-item">
                <div class="banner-icon">💰</div>
                <div class="banner-label">Reste à payer</div>
                <div class="banner-value">${remaining.toFixed(2)} €</div>
            </div>
        </div>

        <!-- Client Section -->
        <div class="client-section">
            <div class="info-card" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))">
                <div class="card-icon">👤</div>
                <div class="card-title">Facturé à</div>
                <div class="card-content">
                    <strong>${cli.societe || cli.nom + ' ' + (cli.prenom || '')}</strong><br>
                    ${cli.adresse}<br>
                    ${cli.cp} ${cli.ville}<br><br>
                    <strong>Contact:</strong><br>
                    Tél: ${cli.tel}<br>
                    Email: ${cli.email}
                </div>
            </div>
        </div>

        <!-- Items Section -->
        <div class="items-section">
            <div class="section-header">Détail des Prestations</div>
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 35%;">Désignation</th>
                        <th style="width: 8%;" class="text-center">U.</th>
                        <th style="width: 8%;" class="text-center">Qté</th>
                        <th style="width: 12%;" class="text-right">P.U. HT</th>
                        <th style="width: 6%;" class="text-center">TVA</th>
                        <th style="width: 12%;" class="text-right">Total TTC</th>
                    </tr>
                </thead>
                <tbody>
                     ${(() => {
                const grouped = groupItemsByMetierAndCategorie(facture.items);
                let html = '';
                let globalIndex = 0;
                Object.keys(grouped).sort().forEach(metier => {
                    html += `<tr style="background:#e67e22; color:white;"><td colspan="6" style="font-weight:bold; padding:10px;">🏗️ ${metier}</td></tr>`;
                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        html += `<tr style="background:#fbe6c2;"><td colspan="6" style="padding:5px 20px; font-weight:bold; color:#d35400;">🔹 ${categorie}</td></tr>`;
                        grouped[metier][categorie].forEach(item => {
                            const index = globalIndex++;
                            const totalTTC = (parseFloat(item.total_ht) * (1 + (parseFloat(item.tva) || 0) / 100)).toFixed(2);
                            html += `
                                    <tr onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'edit', index: ${index}}))" style="cursor: pointer;">
                                        <td>
                                            <div style="font-weight:bold;">${item.description || item.designation || 'Article'}</div>
                                            <div style="font-size:11px; color:#666;">${item.details || ''}</div>
                                        </td>
                                        <td class="text-center">${item.unite || 'u'}</td>
                                        <td class="text-center">${item.quantite}</td>
                                        <td class="text-right">${parseFloat(item.prix_unitaire).toFixed(2)} €</td>
                                        <td class="text-center">${item.tva || 0}%</td>
                                        <td class="text-right font-bold">${totalTTC} €</td>
                                    </tr>`;
                        });
                    });
                });
                return html;
            })()}
                </tbody>
            </table>
        </div>

        <!-- Totals -->
        <div class="totals-section">
            <div class="totals-card">
                <div class="totals-header">Récapitulatif Financier</div>
                <div class="totals-body">
                    <div class="total-row">
                        <span class="total-label">Sous-total HT:</span>
                        <span class="total-value">${facture.total_ht} €</span>
                    </div>
                    <div class="total-row" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'tva'}))" style="cursor: pointer;">
                        <span class="total-label">TVA:</span>
                        <span class="total-value">${facture.total_tva} €</span>
                    </div>
                    <div class="total-row" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'totals'}))" style="cursor: pointer;">
                        <span class="total-label">Total TTC:</span>
                        <span class="total-value">${facture.total_ttc} €</span>
                    </div>
                    ${totalPaid > 0 ? `
                    <div class="total-row" style="color:#27ae60;">
                        <span class="total-label">Déjà réglé (Acomptes):</span>
                        <span class="total-value">- ${totalPaid.toFixed(2)} €</span>
                    </div>
                    <div class="total-row" style="border-top:2px solid #e67e22; margin-top:10px; padding-top:10px;">
                        <span class="total-label">RESTE À PAYER:</span>
                        <span class="total-value">${remaining.toFixed(2)} €</span>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            ${ent.nom} - ${ent.adresse}, ${ent.cp} ${ent.ville}<br>
            SIRET: ${ent.siret} - TVA: ${ent.tva || 'Non renseigné'}<br>
            En cas de retard de paiement, pénalité de 3 fois le taux d'intérêt légal.
        </div>
    </div>
</body>
</html>
        `;
    },
    // Backup de l'ancienne version facture
    old_facture_batiment: (facture) => {

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Facture ${facture.numero}</title>
            <style>
                @media print { @page { margin: 0; size: auto; } body { margin: 0; } }
                body { font-family: 'Verdana', sans-serif; color: #333; padding: 0; margin: 0; background: #fff; }
                
                .header-strip { background: #37474F; height: 20px; border-bottom: 5px solid #FF9800; }
                
                .container { padding: 40px; }
                
                .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
                .logo-section { flex: 1; }
                .logo { max-width: 200px; max-height: 120px; object-fit: contain; border: 2px solid #333; padding: 5px; }
                
                .company-box { 
                    flex: 1; 
                    text-align: right; 
                    background: #f5f5f5; 
                    padding: 20px; 
                    border-left: 5px solid #FF9800;
                }
                .company-name { font-size: 22px; font-weight: bold; color: #37474F; text-transform: uppercase; margin-bottom: 10px; }
                .company-details { font-size: 13px; line-height: 1.5; color: #555; }
                
                .title-block { 
                    background: #d84315; 
                    color: white; 
                    padding: 15px 30px; 
                    display: inline-block; 
                    font-size: 24px; 
                    font-weight: bold; 
                    letter-spacing: 2px;
                    transform: skew(-15deg);
                    margin-left: 20px;
                    box-shadow: 5px 5px 0 #37474F;
                    margin-bottom: 40px;
                }
                .title-text { transform: skew(15deg); display: inline-block; }
                
                .client-section { 
                    border: 3px solid #37474F; 
                    padding: 25px; 
                    margin-bottom: 40px; 
                    position: relative;
                }
                .client-label {
                    position: absolute;
                    top: -15px;
                    left: 20px;
                    background: #fff;
                    padding: 0 10px;
                    font-weight: bold;
                    color: #d84315;
                    font-size: 16px;
                }
                
                .info-row { display: flex; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px dashed #ccc; padding-bottom: 10px; }
                
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 40px; border: 2px solid #333; }
                .items-table th { background: #37474F; color: white; padding: 15px; text-align: left; font-weight: bold; text-transform: uppercase; font-size: 12px; }
                .items-table td { padding: 12px; border-bottom: 1px solid #ddd; font-size: 13px; border-right: 1px solid #eee; }
                .items-table tr:nth-child(even) { background: #fff8e1; }
                
                .metier-row td { background: #FF9800; color: #fff; font-weight: bold; text-transform: uppercase; padding: 10px; }
                .categorie-row td { background: #ffe0b2; color: #bf360c; font-weight: bold; padding-left: 20px; font-size: 13px; border-bottom: 2px solid #FF9800; }

                .badge { padding: 5px 10px; color: white; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
                .paid { background: #2e7d32; }
                .unpaid { background: #c62828; }
                
                .totals-box { 
                    float: right; 
                    width: 350px; 
                    border: 3px solid #FF9800; 
                    padding: 20px; 
                    background: #fff3e0;
                }
                .total-line { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
                .total-final { font-size: 20px; font-weight: bold; color: #d84315; border-top: 2px solid #333; padding-top: 15px; margin-top: 10px; }
                
                .footer { 
                    clear: both; 
                    margin-top: 60px; 
                    border-top: 5px solid #37474F; 
                    background: #eee; 
                    padding: 20px; 
                    text-align: center; 
                    font-size: 11px; 
                    color: #555;
                }
            </style>
        </head>
        <body>
            <div class="header-strip"></div>
            <div class="container">
                <div class="header">
                    <div class="logo-section">
                        ${ent.logo ? `<img class="logo" src="${ent.logo}" />` : '<div style="font-size: 30px; font-weight: bold; color: #FF9800;">BTP PRO</div>'}
                    </div>
                    <div class="company-box" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'entreprise'}))">
                        <div class="company-name">${ent.nom}</div>
                        <div class="company-details">
                            ${ent.adresse}<br>
                            ${ent.cp} ${ent.ville}<br>
                            Tél: ${ent.tel}<br>
                            Email: ${ent.email}<br>
                            SIRET: ${ent.siret}
                        </div>
                    </div>
                </div>

                <div class="title-block">
                    <span class="title-text">FACTURE N° ${facture.numero}</span>
                </div>
                
                <div class="info-row">
                    <span><strong>Date :</strong> ${new Date(facture.created_at).toLocaleDateString()}</span>
                    <span><strong>Échéance :</strong> ${new Date(facture.date_echeance).toLocaleDateString()}</span>
                    <span class="badge ${remaining <= 0.05 ? 'paid' : 'unpaid'}">${remaining <= 0.05 ? 'PAYÉE' : 'À PAYER'}</span>
                </div>

                <div class="client-section" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({action: 'client'}))">
                    <div class="client-label">CLIENT / CHANTIER</div>
                    <div style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 5px;">${cli.societe || cli.nom + ' ' + (cli.prenom || '') || 'Client'}</div>
                    <div style="color: #555;">
                        ${cli.adresse}<br>
                        ${cli.cp} ${cli.ville}<br>
                        ${cli.tel ? 'Tel: ' + cli.tel : ''} ${cli.email ? ' | ' + cli.email : ''}
                    </div>
                </div>

                <table class="items-table">
                    <thead>
                        <tr>
                            <th style="width: 50%">Désignation</th>
                            <th style="width: 10%; text-align: center;">U</th>
                            <th style="width: 10%; text-align: center;">Qté</th>
                            <th style="width: 15%; text-align: right;">P.U. HT</th>
                            <th style="width: 15%; text-align: right;">Total HT</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(() => {
                const grouped = groupItemsByMetierAndCategorie(facture.items);
                let html = '';

                Object.keys(grouped).sort().forEach(metier => {
                    html += `<tr class="metier-row"><td colspan="5">🏗️ ${metier}</td></tr>`;

                    Object.keys(grouped[metier]).sort().forEach(categorie => {
                        html += `<tr class="categorie-row"><td colspan="5">🔹 ${categorie}</td></tr>`;

                        grouped[metier][categorie].forEach(item => {
                            html += `
                                            <tr>
                                                <td>${item.description}</td>
                                                <td style="text-align: center;">${item.unite || 'u'}</td>
                                                <td style="text-align: center; font-weight: bold;">${item.quantite}</td>
                                                <td style="text-align: right;">${parseFloat(item.prix_unitaire).toFixed(2)}</td>
                                                <td style="text-align: right; font-weight: bold;">${parseFloat(item.total_ht).toFixed(2)}</td>
                                            </tr>
                                        `;
                        });
                    });
                });
                return html;
            })()}
                    </tbody>
                </table>

                <div class="totals-box">
                    <div class="total-line">
                        <span>Total HT</span>
                        <span>${facture.total_ht} €</span>
                    </div>
                    <div class="total-line">
                        <span>TVA</span>
                        <span>${facture.total_tva} €</span>
                    </div>
                    <div class="total-line" style="font-weight: bold; border-top: 1px dashed black; padding-top: 5px;">
                        <span>Total TTC</span>
                        <span>${facture.total_ttc} €</span>
                    </div>
                    
                    ${totalPaid > 0 ? `
                        <div class="total-line" style="color: green; margin-top: 10px;">
                            <span>Acomptes versés</span>
                            <span>- ${totalPaid.toFixed(2)} €</span>
                        </div>
                        <div class="total-final">
                            <div style="display: flex; justify-content: space-between;">
                                <span>SOLDE À PAYER</span>
                                <span>${remaining.toFixed(2)} €</span>
                            </div>
                        </div>
                    ` : `
                         <div class="total-final">
                            <div style="display: flex; justify-content: space-between;">
                                <span>NET À PAYER</span>
                                <span>${facture.total_ttc} €</span>
                            </div>
                        </div>
                    `}
                </div>

                <div class="footer">
                    Document généré par l'application Artisan - ${ent.nom} - SIRET: ${ent.siret}
                </div>
            </div>
        </body>
        </html>
        `;
    }

};
