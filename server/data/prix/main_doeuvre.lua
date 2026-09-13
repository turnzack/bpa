local M = {}

M.metier = "Main d'oeuvre"
M.ICON = "images/icons/main_doeuvre.png"

M.STRUCTURE = {
    id = "main_doeuvre",
    nom = "Main d'oeuvre",
    type = "LOT",
    children = {
        {
            id = "chapitre_par_defaut",
            nom = "Chapitre par défaut",
            type = "CHAPITRE",
            children = {
                {
                    id = "chapitre_par_defaut_famille",
                    nom = "Famille",
                    type = "FAMILLE",
                    children = {
                        {
                            id = "ouvriers_specialises",
                            nom = "Ouvriers spécialisés",
                            type = "OUVRAGE",
                            children = {
                                {
                                    id = "ouvrier_batiment_ouvrier",
                                    nom = "Ouvrier bâtiment (ouvrier)\tm",
                                    type = "ARTICLE",
                                    prix = 45.00,
                                    unite = "H",
                                },
                                {
                                    id = "maitre_ouvrier",
                                    nom = "Maître ouvrier\tm",
                                    type = "ARTICLE",
                                    prix = 55.00,
                                    unite = "H",
                                },
                                {
                                    id = "chef_equipe",
                                    nom = "Chef d'équipe\tm",
                                    type = "ARTICLE",
                                    prix = 60.00,
                                    unite = "H",
                                }
                            }
                        },
                        {
                            id = "main_oeuvre_generale",
                            nom = "Main d'oeuvre générale",
                            type = "OUVRAGE",
                            children = {
                                {
                                    id = "ouvrier_qualifie",
                                    nom = "Ouvrier qualifié\tm",
                                    type = "ARTICLE",
                                    prix = 40.00,
                                    unite = "H",
                                },
                                {
                                    id = "ouvrier_non_qualifie",
                                    nom = "Ouvrier non qualifié\tm",
                                    type = "ARTICLE",
                                    prix = 30.00,
                                    unite = "H",
                                },
                                {
                                    id = "technicien",
                                    nom = "Technicien\tm",
                                    type = "ARTICLE",
                                    prix = 50.00,
                                    unite = "H",
                                }
                            }
                        },
                        {
                            id = "prestations_complementaires",
                            nom = "Prestations complémentaires",
                            type = "OUVRAGE",
                            children = {
                                {
                                    id = "deplacement_km",
                                    nom = "Déplacement (par km)\tm",
                                    type = "ARTICLE",
                                    prix = 0.50,
                                    unite = "U",
                                },
                                {
                                    id = "frais_deplacement_heure_sup",
                                    nom = "Frais de déplacement (heures sup)\tm",
                                    type = "ARTICLE",
                                    prix = 1.20,
                                    unite = "H",
                                },
                                {
                                    id = "heures_supplementaires",
                                    nom = "Heures supplémentaires (majoration)\tm",
                                    type = "ARTICLE",
                                    prix = 1.25,
                                    unite = "H",
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

return M