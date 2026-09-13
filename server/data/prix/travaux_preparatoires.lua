local M = {}

-- Définir le métier auquel appartient ce lot
M.METIER = "preparation"

-- Structure des données pour les travaux préparatoires
M.STRUCTURE = {
    id = "travaux_preparatoires",
    nom = "Travaux Préparatoires",
    type = "LOT",
    children = {
        {
            id = "protection_chantier",
            nom = "Protection du chantier",
            type = "CHAPITRE",
            children = {
                {
                    id = "bache_protection_sol",
                    nom = "Bâche de protection du sol",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 3.50
                },
                {
                    id = "film_protection_meuble",
                    nom = "Film de protection des meubles",
                    type = "ARTICLE",
                    unite = "forfait",
                    prix = 45.00
                },
                {
                    id = "protection_ouvertures",
                    nom = "Protection des ouvertures",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 25.00
                },
                {
                    id = "protection_escalier",
                    nom = "Protection d'escalier",
                    type = "ARTICLE",
                    unite = "forfait",
                    prix = 85.00
                }
            }
        },
        {
            id = "demolition_legere",
            nom = "Démolition légère",
            type = "CHAPITRE",
            children = {
                {
                    id = "depose_meuble_haut",
                    nom = "Dépose de meubles hauts",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 35.00
                },
                {
                    id = "depose_meuble_bas",
                    nom = "Dépose de meubles bas",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 30.00
                },
                {
                    id = "depose_evier",
                    nom = "Dépose d'évier",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 45.00
                },
                {
                    id = "depose_wc",
                    nom = "Dépose WC",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 60.00
                },
                {
                    id = "depose_baignoire",
                    nom = "Dépose baignoire",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 120.00
                }
            }
        },
        {
            id = "preparation_sols",
            nom = "Préparation des sols",
            type = "CHAPITRE",
            children = {
                {
                    id = "ragreage_p3",
                    nom = "Ragréage autolissant P3",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 12.50
                },
                {
                    id = "nettoyage_sol_intensif",
                    nom = "Nettoyage intensif du sol",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 7.80
                },
                {
                    id = "depose_moquette",
                    nom = "Dépose de moquette",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 8.50
                },
                {
                    id = "depose_lino",
                    nom = "Dépose de lino/PVC",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 6.50
                }
            }
        },
        {
            id = "preparation_murs",
            nom = "Préparation des murs",
            type = "CHAPITRE",
            children = {
                {
                    id = "depose_papier_peint",
                    nom = "Dépose de papier peint",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 6.75
                },
                {
                    id = "depose_toile_verre",
                    nom = "Dépose de toile de verre",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 8.20
                },
                {
                    id = "rebouchage_fissures",
                    nom = "Rebouchage de fissures",
                    type = "ARTICLE",
                    unite = "ml",
                    prix = 9.30
                },
                {
                    id = "enduit_lissage",
                    nom = "Enduit de lissage",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 12.80
                }
            }
        },
        {
            id = "travaux_electricite",
            nom = "Travaux préparatoires électricité",
            type = "CHAPITRE",
            children = {
                {
                    id = "depose_prises",
                    nom = "Dépose de prises électriques",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 15.00
                },
                {
                    id = "depose_interrupteurs",
                    nom = "Dépose d'interrupteurs",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 15.00
                },
                {
                    id = "depose_appliques",
                    nom = "Dépose d'appliques murales",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 20.00
                },
                {
                    id = "depose_radiateur",
                    nom = "Dépose de radiateur",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 45.00
                }
            }
        },
        {
            id = "travaux_plomberie",
            nom = "Travaux préparatoires plomberie",
            type = "CHAPITRE",
            children = {
                {
                    id = "depose_lavabo",
                    nom = "Dépose de lavabo",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 50.00
                },
                {
                    id = "depose_douche",
                    nom = "Dépose de cabine de douche",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 95.00
                },
                {
                    id = "depose_robinetterie",
                    nom = "Dépose de robinetterie",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 25.00
                },
                {
                    id = "depose_siphon",
                    nom = "Dépose de siphon",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 20.00
                }
            }
        },
        {
            id = "preparation_plafonds",
            nom = "Préparation des plafonds",
            type = "CHAPITRE",
            children = {
                {
                    id = "depose_faux_plafond",
                    nom = "Dépose de faux plafond",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 18.50
                },
                {
                    id = "rebouchage_plafond",
                    nom = "Rebouchage trous en plafond",
                    type = "ARTICLE",
                    unite = "forfait",
                    prix = 45.00
                },
                {
                    id = "ponçage_plafond",
                    nom = "Ponçage de plafond",
                    type = "ARTICLE",
                    unite = "m²",
                    prix = 9.80
                },
                {
                    id = "depose_luminaire",
                    nom = "Dépose de luminaire",
                    type = "ARTICLE",
                    unite = "U",
                    prix = 25.00
                }
            }
        }
    }
}

-- Fonction pour récupérer les données
M.getData = function()
    return M.STRUCTURE
end

-- Fonction pour récupérer le métier
M.getMetier = function()
    return M.METIER
end

-- Fonction pour trouver un élément par son ID
M.findItemById = function(id)
    local function searchRecursive(item, searchId)
        if item.id == searchId then
            return item
        end
        if item.children then
            for _, child in ipairs(item.children) do
                local found = searchRecursive(child, searchId)
                if found then
                    return found
                end
            end
        end
        return nil
    end
    return searchRecursive(M.STRUCTURE, id)
end

-- Fonction pour ajouter un élément
M.addItem = function(parentId, newItem)
    local parent = M.findItemById(parentId)
    if parent then
        parent.children = parent.children or {}
        table.insert(parent.children, newItem)
        return true
    end
    return false
end

-- Fonction pour mettre à jour un élément
M.updateItem = function(id, updates)
    local item = M.findItemById(id)
    if item then
        for key, value in pairs(updates) do
            if key ~= "children" then
                item[key] = value
            end
        end
        return true
    end
    return false
end

-- Fonction pour supprimer un élément
M.removeItem = function(id)
    local function removeRecursive(items, targetId)
        for i, item in ipairs(items) do
            if item.id == targetId then
                table.remove(items, i)
                return true
            end
            if item.children and #item.children > 0 then
                local removed = removeRecursive(item.children, targetId)
                if removed then
                    return true
                end
            end
        end
        return false
    end
    if M.STRUCTURE.children then
        return removeRecursive(M.STRUCTURE.children, id)
    end
    return false
end

-- Fonction pour obtenir les éléments par type
M.getItemsByType = function(typeRecherche)
    local resultat = {}
    local function rechercheRecursive(item)
        if item.type == typeRecherche then
            table.insert(resultat, item)
        end
        if item.children then
            for _, enfant in ipairs(item.children) do
                rechercheRecursive(enfant)
            end
        end
    end
    rechercheRecursive(M.STRUCTURE)
    return resultat
end

-- Fonction pour calculer le prix total d'un ouvrage
M.getPrixTotalOuvrage = function(ouvrageId)
    local ouvrage = M.findItemById(ouvrageId)
    if not ouvrage or ouvrage.type ~= "OUVRAGE" or not ouvrage.children then
        return 0
    end
    local total = 0
    for _, article in ipairs(ouvrage.children) do
        if article.type == "ARTICLE" and article.prix then
            total = total + article.prix
        end
    end
    return total
end

return M