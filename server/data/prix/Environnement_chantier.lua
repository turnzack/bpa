local M = {}

M.metier = "Environnement chantier"
M.ICON = "images/icons/environnement_chantier.png"  -- Assuming there's an icon

M.STRUCTURE = {
    id = "environnement_chantier",
    nom = "Environnement chantier",
    type = "LOT",
    children = {
        {
            id = "amenagement_securite",
            nom = "Aménagement et sécurité",
            type = "CHAPITRE",
            children = {
                {
                    id = "barrieres_securite",
                    nom = "Barrières et sécurité",
                    type = "FAMILLE",
                    children = {
                        {
                            id = "barriere_pleine",
                            nom = "Barrière pleine\tm lin",
                            type = "ARTICLE",
                            prix = 15.00,
                            unite = "M",
                        },
                        {
                            id = "plot_cone",
                            nom = "Plot / Cône\t pièce",
                            type = "ARTICLE",
                            prix = 5.00,
                            unite = "U",
                        }
                    }
                }
            }
        },
        {
            id = "gestion_dechets",
            nom = "Gestion des déchets",
            type = "CHAPITRE",
            children = {
                {
                    id = "collecte_dechets",
                    nom = "Collecte et évacuation",
                    type = "FAMILLE",
                    children = {
                        {
                            id = "benne_3m3",
                            nom = "Benne 3m3\tjour",
                            type = "ARTICLE",
                            prix = 25.00,
                            unite = "U",
                        },
                        {
                            id = "benne_6m3",
                            nom = "Benne 6m3\tjour",
                            type = "ARTICLE",
                            prix = 35.00,
                            unite = "U",
                        }
                    }
                }
            }
        },
        {
            id = "protection_environnementale",
            nom = "Protection environnementale",
            type = "CHAPITRE",
            children = {
                {
                    id = "protection_provisoire",
                    nom = "Protection provisoire",
                    type = "FAMILLE",
                    children = {
                        {
                            id = "bache_protection",
                            nom = "Bâche de protection\tm²",
                            type = "ARTICLE",
                            prix = 2.50,
                            unite = "M2",
                        },
                        {
                            id = "filet_protection",
                            nom = "Filet de protection\tm²",
                            type = "ARTICLE",
                            prix = 3.00,
                            unite = "M2",
                        }
                    }
                }
            }
        }
    }
}

return M