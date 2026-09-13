local M = {}

M.metier = "Etanchéité"
M.ICON = "images/icons/etancheite.png"
M.STRUCTURE = {
    id = "etancheite",
    nom = "Etanchéité",
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
                                                                            id = "etancheite_toiture_terrasse",
                                                                            nom = "Etanchéité - Toiture terrasse",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "bacs_etancheite_parties_courantes_m",
                                                                                                                    nom = "Bacs étanchéité, parties courantes\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 229.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_desolidarisation_terrasse_accessible_m",
                                                                                                                    nom = "Couche de désolidarisation, terrasse accessible\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "crosse_antenne_television_u",
                                                                                                                    nom = "Crosse antenne télévision\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "equerre_support",
                                                                            nom = "Equerre support",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "relief_10_10_developpe_400_mm_m",
                                                                                                                    nom = "relief 10/10, développé 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "relief_12_10_developpe_600_mm_m",
                                                                                                                    nom = "relief 12/10, développé 600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "relief_75_100_developpe_350_mm_m",
                                                                                                                    nom = "relief 75/100, développé 350 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.36,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "etancheite_par_resine_polyurethane_sel",
                                                                            nom = "Etanchéité par résine polyuréthane (SEL)",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_bassins_ou_piscine_partie_courante_m",
                                                                                                                    nom = "pour bassins ou piscine, partie courante\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_bassins_ou_piscine_penetration_angle_m",
                                                                                                                    nom = "pour bassins ou piscine, pénétration, angle\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_balcon_et_terrasse_accessible_m",
                                                                                                                    nom = "pour balcon et terrasse accessible\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 297.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_balcon_et_terrasse_accessible_avec_finition_m",
                                                                                                                    nom = "pour balcon et terrasse accessible, avec finition\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2239.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_balcon_et_terrasse_accessible_en_releve_m",
                                                                                                                    nom = "pour balcon et terrasse accessible, en relevé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2104.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_balcon_et_terrasse_accessible_en_releve_retombee_penetration_avec_finition_m",
                                                                                                                    nom = "pour balcon et terrasse accessible, en relevé, retombée, pénétration, avec finition\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 292.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gradins_de_tribunes_a_l_horizontale_m",
                                                                                                                    nom = "pour gradins de tribunes à l'horizontale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2137.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gradins_de_tribunes_a_la_verticale_m",
                                                                                                                    nom = "pour gradins de tribunes à la verticale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 292.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_local_humide_partie_courante_m",
                                                                                                                    nom = "pour local humide, partie courante\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_local_humide_penetration_angle_m",
                                                                                                                    nom = "pour local humide, pénétration, angle\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_parking_et_rampe_m",
                                                                                                                    nom = "pour parking et rampe\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2142.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_parking_et_rampe_en_releve_retombee_et_penetration_m",
                                                                                                                    nom = "pour parking et rampe, en relevé, retombée et pénétration\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 299.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_toiture_non_accessible_partie_courante_m",
                                                                                                                    nom = "pour toiture non accessible, partie courante\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 286.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_toiture_non_accessible_partie_courante_avec_teinte_m",
                                                                                                                    nom = "pour toiture non accessible, partie courante, avec teinte\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 299.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_plancher_intermediaire_partie_courante_m",
                                                                                                                    nom = "pour plancher intermédiaire, partie courante\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2107.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_plancher_intermediaire_partie_courante_avec_finition_m",
                                                                                                                    nom = "pour plancher intermédiaire, partie courante, avec finition\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2130.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "raccordement_sur_toiture_d_etancheite_courante_m",
                                                                                                                    nom = "raccordement sur toiture d'étanchéité courante\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 297.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "releve_d_etancheite_m",
                                                                                                                    nom = "relevé d'étanchéité\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.26,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "etancheite",
                                                                            nom = "Etanchéité",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "terrasse_inaccessible_pare_vapeur_m",
                                                                                                                    nom = "terrasse inaccessible, pare-vapeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "terrasse_inaccessible_pare_vapeur_2_couches_croisees_m",
                                                                                                                    nom = "terrasse inaccessible, pare-vapeur, 2 couches croisées\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2103.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "relief_developpe_400_mm_m",
                                                                                                                    nom = "relief, développé 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "isolation_thermique_bacs_acier_m",
                                                                                                                    nom = "Isolation thermique, bacs acier\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.55,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "laine_de_verre",
                                                                            nom = "Laine de verre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_25_mm_m",
                                                                                                                    nom = "épaisseur 25 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_30_mm_m",
                                                                                                                    nom = "épaisseur 30 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_40_mm_m",
                                                                                                                    nom = "épaisseur 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_50_mm_m",
                                                                                                                    nom = "épaisseur 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_60_mm_m",
                                                                                                                    nom = "épaisseur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_70_mm_m",
                                                                                                                    nom = "épaisseur 70 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.83,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_et_costiere",
                                                                            nom = "Lanterneau et costière",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_500x500_mm_u",
                                                                                                                    nom = "dimensions 500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 349.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1000x1000_mm_u",
                                                                                                                    nom = "dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 483.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1000x1500_mm_u",
                                                                                                                    nom = "dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 678.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1000x2000_mm_u",
                                                                                                                    nom = "dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 773.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1200x1200_mm_u",
                                                                                                                    nom = "dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 576.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1600x1600_mm_u",
                                                                                                                    nom = "dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 908.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_2000x2000_mm_u",
                                                                                                                    nom = "dimensions 2000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1193.7,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plus_value_pour_double_dome",
                                                                            nom = "Plus value pour double dôme",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "500x500_mm_u",
                                                                                                                    nom = "500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 91.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1000x1000_mm_u",
                                                                                                                    nom = "1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 145.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1000x1500_mm_u",
                                                                                                                    nom = "1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1000x2000_mm_u",
                                                                                                                    nom = "1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 326.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1200x1200_mm_u",
                                                                                                                    nom = "1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 189.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1600x1600_mm_u",
                                                                                                                    nom = "1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 385.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2000x2000_mm_u",
                                                                                                                    nom = "2000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 562.97,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "naissance_ep_pour_toiture_terrasse",
                                                                            nom = "Naissance EP pour toiture terrasse",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_pvc_diametre_80_mm_u",
                                                                                                                    nom = "en PVC, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 73.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_diametre_100_mm_u",
                                                                                                                    nom = "en PVC, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 78.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_diametre_125_mm_u",
                                                                                                                    nom = "en PVC, diamètre 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 81.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_diametre_140_mm_u",
                                                                                                                    nom = "en PVC, diamètre 140 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 84.96,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "panneaux_isolants_en_liege",
                                                                            nom = "Panneaux isolants en liège",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_30_mm_m",
                                                                                                                    nom = "épaisseur 30 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_40_mm_m",
                                                                                                                    nom = "épaisseur 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_50_mm_m",
                                                                                                                    nom = "épaisseur 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_60_mm_m",
                                                                                                                    nom = "épaisseur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.48,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "panneaux_isolants_en_polystyrene",
                                                                            nom = "Panneaux isolants en polystyrène",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_20_mm_m",
                                                                                                                    nom = "épaisseur 20 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_30_mm_m",
                                                                                                                    nom = "épaisseur 30 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_40_mm_m",
                                                                                                                    nom = "épaisseur 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_50_mm_m",
                                                                                                                    nom = "épaisseur 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_60_mm_m",
                                                                                                                    nom = "épaisseur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_120_mm_m",
                                                                                                                    nom = "épaisseur 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_100_mm_m",
                                                                                                                    nom = "épaisseur 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_80_mm_m",
                                                                                                                    nom = "épaisseur 80 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.54,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "panneaux_isolants_en_polyurethane",
                                                                            nom = "Panneaux isolants en polyuréthane",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_30_mm_m",
                                                                                                                    nom = "épaisseur 30 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_40_mm_m",
                                                                                                                    nom = "épaisseur 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_50_mm_m",
                                                                                                                    nom = "épaisseur 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_60_mm_m",
                                                                                                                    nom = "épaisseur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_70_mm_m",
                                                                                                                    nom = "épaisseur 70 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_140_mm_m",
                                                                                                                    nom = "épaisseur 140 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 260.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_120_mm_m",
                                                                                                                    nom = "épaisseur 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_100_mm_m",
                                                                                                                    nom = "épaisseur 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_80_mm_m",
                                                                                                                    nom = "épaisseur 80 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "protection_ciment_pour_terrasse_accessible_m",
                                                                                                                    nom = "Protection ciment pour terrasse accessible\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "protection_de_dallettes_sur_plots_reglables_m",
                                                                                                                    nom = "Protection de dallettes sur plots règlables\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2171.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "protection_mortier_pour_terrasse_accessible_m",
                                                                                                                    nom = "Protection mortier pour terrasse accessible\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.7,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "protection_par_gravillon",
                                                                            nom = "Protection par gravillon",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "15_25_epaisseur_60_mm_m",
                                                                                                                    nom = "15/25, épaisseur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "15_25_epaisseur_40_mm_m",
                                                                                                                    nom = "15/25, épaisseur 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.6,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "protection_relief_solin",
                                                                            nom = "Protection relief solin",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "grillage_avec_polyane_m",
                                                                                                                    nom = "grillage avec polyane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grillage_hauteur_300_mm_m",
                                                                                                                    nom = "grillage, hauteur 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.69,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "releve_d_etancheite",
                                                                            nom = "Relevé d'étanchéité",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_a_5_terrasse_accessible_m",
                                                                                                                    nom = "1 à 5%, terrasse accessible\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpe_0_40_m_terrasse_accessible_m",
                                                                                                                    nom = "développé 0,40 m, terrasse accessible\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpe_0_45_m_terrasse_inaccessible_s1_m",
                                                                                                                    nom = "développé 0,45 m, terrasse inaccessible S1\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpe_0_45_m_terrasse_inaccessible_s3_m",
                                                                                                                    nom = "développé 0,45 m, terrasse inaccessible S3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "remplissage_des_joints_au_mastic_1ere_categorie_m",
                                                                                                                    nom = "Remplissage des joints au mastic, 1ère catégorie\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "support_metallique_type_haciero_34_sr_m",
                                                                                                                    nom = "Support métallique, type Haciero 34 SR\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 229.4,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_accessible",
                                                                            nom = "Terrasse accessible",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pare_vapeur_m",
                                                                                                                    nom = "pare-vapeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "parties_courantes_m",
                                                                                                                    nom = "parties courantes\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pente_1_a_5_pare_vapeur_m",
                                                                                                                    nom = "pente 1 à 5%, pare-vapeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pente_1_a_5_parties_courantes_m",
                                                                                                                    nom = "pente 1 à 5%, parties courantes\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_inaccessible",
                                                                            nom = "Terrasse inaccessible",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "parties_courantes_s1_m",
                                                                                                                    nom = "parties courantes S1\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "parties_courantes_s2_m",
                                                                                                                    nom = "parties courantes S2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 256.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "parties_courantes_s3_m",
                                                                                                                    nom = "parties courantes S3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 257.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "trop_plein_pour_eaux_pluviales_u",
                                                                                                                    nom = "Trop-plein pour eaux pluviales\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 84.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ventilation_isolee_en_zinc_0_65_mm_developpe_100_mm_u",
                                                                                                                    nom = "Ventilation isolée, en zinc, 0,65 mm, développé 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "verre_cellulaire",
                                                                            nom = "Verre cellulaire",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_40_mm_m",
                                                                                                                    nom = "épaisseur 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_50_mm_m",
                                                                                                                    nom = "épaisseur 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_60_mm_m",
                                                                                                                    nom = "épaisseur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_80_mm_m",
                                                                                                                    nom = "épaisseur 80 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.13,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "etancheite_par_membranes_synthetiques",
                    nom = "Etanchéité par membranes synthétiques",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "etancheite_par_membranes_synthetiques_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "ecran_pare_vapeur",
                                                                            nom = "Ecran pare vapeur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "ecran_pare_vapeur_membrane_pvc_epaisseur_0_25mm_m",
                                                                                                                    nom = "écran pare vapeur, membrane PVC, épaisseur 0,25mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ecran_pare_vapeur_membrane_abs_epaisseur_0_35mm_m",
                                                                                                                    nom = "écran pare vapeur, membrane ABS, épaisseur 0,35mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ecran_pare_vapeur_membrane_fpo_epaisseur_0_35mm_m",
                                                                                                                    nom = "écran pare vapeur, membrane FPO, épaisseur 0,35mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.66,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "toiture_inaccessible_etancheite_apparente_sur_support_maconnerie_bac_acier_panneaux_bois",
                                                                            nom = "Toiture inaccessible, étanchéité apparente, sur support maçonnerie, bac acier, panneaux bois",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "avec_membrane_pvc_en_adherence_epaisseur_1_2_mm_m",
                                                                                                                    nom = "avec membrane PVC en adhérence, épaisseur 1,2 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_membrane_pvc_sous_facee_d_un_feutre_en_adherence_ep_1_2_mm_m",
                                                                                                                    nom = "avec membrane PVC sous facée d'un feutre en adhérence , ép 1,2 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_ancienne_etancheite_avec_membrane_pvc_sous_facee_d_un_feutre_en_adherence_ep_1_2_mm_m",
                                                                                                                    nom = "sur ancienne étanchéité, avec membrane PVC sous facée d'un feutre en adhérence , ép 1,2 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 256.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_membrane_fpo_sous_facee_d_un_feutre_en_adherence_ep_1_2_mm_m",
                                                                                                                    nom = "avec membrane FPO sous facée d'un feutre en adhérence , ép 1,2 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_ancienne_etancheite_avec_membrane_fpo_sous_facee_d_un_feutre_en_adherence_ep_1_2_mm_m",
                                                                                                                    nom = "sur ancienne étanchéité, avec membrane FPO sous facée d'un feutre en adhérence , ép 1,2 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.38,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "toiture_inaccessible_etancheite_sous_protection_meuble_sur_support_maconnerie",
                                                                            nom = "Toiture inaccessible, étanchéité sous protection meuble, sur support maçonnerie",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sans_isolant_avec_feutre_aiguillete_membrane_pvc_epaisseur_1_5mm_m",
                                                                                                                    nom = "sans isolant, avec feutre aiguilleté, membrane PVC épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_isolant_avec_feutre_aiguillete_membrane_fpo_epaisseur_1_5mm_m",
                                                                                                                    nom = "sans isolant, avec feutre aiguilleté, membrane FPO épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_membrane_pvc_epaisseur_1_5mm_m",
                                                                                                                    nom = "sur isolant, avec membrane PVC épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_feutre_thermolie_membrane_pvc_epaisseur_1_5mm_m",
                                                                                                                    nom = "sur isolant, avec feutre thermolie, membrane PVC épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_membrane_fpo_epaisseur_1_5mm_m",
                                                                                                                    nom = "sur isolant, avec membrane FPO épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_ancienne_etancheite_avec_feutre_aiguillete_membrane_pvc_epaisseur_1_5mm_m",
                                                                                                                    nom = "sur ancienne étanchéité, avec feutre aiguilleté , membrane PVC épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_ancienne_etancheite_avec_membrane_fpo_epaisseur_1_5mm_m",
                                                                                                                    nom = "sur ancienne étanchéité, avec membrane FPO épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.26,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "toiture_circulable_pietons_protection_dalles_sur_plots_sur_support_maconnerie",
                                                                            nom = "Toiture circulable piétons, protection dalles sur plots, sur support maçonnerie",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sans_isolant_avec_feutre_aiguillete_membrane_pvc_epaisseur_1_5mm_m",
                                                                                                                    nom = "sans isolant, avec feutre aiguilleté, membrane PVC épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_isolant_avec_feutre_aiguillete_membrane_fpo_epaisseur_1_5mm_m",
                                                                                                                    nom = "sans isolant, avec feutre aiguilleté, membrane FPO épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_membrane_pvc_epaisseur_1_5_mm_m",
                                                                                                                    nom = "sur isolant, avec membrane PVC épaisseur 1,5 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_feutre_thermolie_membrane_pvc_epaisseur_1_5mm_m",
                                                                                                                    nom = "sur isolant, avec feutre thermolie, membrane PVC épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_membrane_fpo_epaisseur_1_5mm_m",
                                                                                                                    nom = "sur isolant, avec membrane FPO épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.09,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "toiture_circulable_vehicules_legers_sur_support_maconnerie",
                                                                            nom = "Toiture circulable véhicules légers, sur support maçonnerie",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sans_isolant_avec_feutre_aiguillete_membrane_fpo_epaisseur_1_5mm_m",
                                                                                                                    nom = "sans isolant, avec feutre aiguilleté, membrane FPO épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_feutre_aiguillete_membrane_fpo_epaisseur_1_5mm_m",
                                                                                                                    nom = "sur isolant, avec feutre aiguilleté, membrane FPO épaisseur 1,5mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.78,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "toiture_terrasse_jardins_sur_support_maconnerie",
                                                                            nom = "Toiture terrasse jardins, sur support maçonnerie",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sans_isolant_avec_membrane_pvc_epaisseur_2mm_feutre_aiguille_m",
                                                                                                                    nom = "sans isolant, avec membrane PVC épaisseur 2mm, feutre aiguillé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_isolant_avec_membrane_fpo_epaisseur_1_8mm_feutre_aiguille_m",
                                                                                                                    nom = "sans isolant, avec membrane FPO épaisseur 1,8mm, feutre aiguillé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_membrane_pvc_epaisseur_2mm_feutre_aiguille_m",
                                                                                                                    nom = "sur isolant, avec membrane PVC épaisseur 2mm, feutre aiguillé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_membrane_fpo_epaisseur_1_8mm_feutre_aiguille_m",
                                                                                                                    nom = "sur isolant, avec membrane FPO épaisseur 1,8mm, feutre aiguillé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_isolant_avec_membrane_pvc_epaisseur_2mm_pose_sur_ecran_d_independance_m",
                                                                                                                    nom = "sur isolant, avec membrane PVC épaisseur 2mm posé sur écran d'indépendance\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_ancienne_etancheite_avec_membrane_pvc_epaisseur_2mm_feutre_aiguille_m",
                                                                                                                    nom = "sur ancienne étanchéité, avec membrane PVC épaisseur 2mm, feutre aiguillé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_ancienne_etancheite_avec_membrane_fpo_epaisseur_1_8mm_feutre_aiguille_m",
                                                                                                                    nom = "sur ancienne étanchéité, avec membrane FPO épaisseur 1,8mm, feutre aiguillé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.17,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "releves_d_etancheite_en_terrasse_inaccessible",
                                                                            nom = "Relevés d'étanchéité en terrasse inaccessible",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "par_menbrane_pvc_developpe_0_45_m_m",
                                                                                                                    nom = "par menbrane PVC, développé 0,45 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_menbrane_fpo_developpe_0_45_m_m",
                                                                                                                    nom = "par menbrane FPO, développé 0,45 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 52.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "releves_d_etancheite_en_terrasse_accessible",
                                                                            nom = "Relevés d'étanchéité en terrasse accessible",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "par_membrane_pvc_developpe_0_45_m_m",
                                                                                                                    nom = "par membrane PVC, développé 0,45 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 51.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_membrane_fpo_developpe_0_45_m_m",
                                                                                                                    nom = "par membrane FPO, développé 0,45 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 55.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "film_polyphase_m",
                                                                                                                    nom = "Film polyphasé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2112.03,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_d_arase_etanche_type_delta_protekt",
                                                                            nom = "Bande d'arase étanche type Delta protekt",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "largeur_300_mm_m",
                                                                                                                    nom = "largeur 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_500_mm_m",
                                                                                                                    nom = "largeur 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_750_mm_m",
                                                                                                                    nom = "largeur 750 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1000_mm_m",
                                                                                                                    nom = "largeur 1000 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1500_mm_m",
                                                                                                                    nom = "largeur 1500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.84,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_d_etancheite_en_polypropylene",
                                                                            nom = "Bande d'étanchéité en polypropylène",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "largeur_100_mm_m",
                                                                                                                    nom = "largeur 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_125_mm_m",
                                                                                                                    nom = "largeur 125 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_150_mm_m",
                                                                                                                    nom = "largeur 150 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_175_mm_m",
                                                                                                                    nom = "largeur 175 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_200_mm_m",
                                                                                                                    nom = "largeur 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_250_mm_m",
                                                                                                                    nom = "largeur 250 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_300_mm_m",
                                                                                                                    nom = "largeur 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_350_mm_m",
                                                                                                                    nom = "largeur 350 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1000_mm_m",
                                                                                                                    nom = "largeur 1000 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "protection_d_etancheite",
                    nom = "Protection d'étanchéité",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "protection_d_etancheite_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "protection_par_gravillons_pour_toiture_terrasse_inaccessible",
                                                                            nom = "Protection par gravillons pour toiture terrasse inaccessible",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_de_gravillons_5_25_epaisseur_40_mm_m",
                                                                                                                    nom = "couche de gravillons 5/25, épaisseur 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_value_par_cm_d_epaisseur_de_couche_de_gravillons_5_25_m",
                                                                                                                    nom = "plus value par cm d'épaisseur de couche de gravillons 5/25\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.69,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "protection_lourde_dure_pour_toiture_terrasse_accessible_pietons",
                                                                            nom = "Protection lourde dure pour toiture terrasse accessible piétons",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "chape_coulee_sur_place_epaisseur_40_mm_m",
                                                                                                                    nom = "chape coulée sur place, épaisseur 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dallage_coulee_sur_place_y_compris_chape_incorporee_epaisseur_50_mm_m",
                                                                                                                    nom = "dallage coulée sur place y compris chape incorporée, épaisseur 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 257.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "majoration_pour_armature_treillis_200x300_m",
                                                                                                                    nom = "majoration pour armature treillis 200x300\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "majoration_pour_couche_de_desolidarisation_m",
                                                                                                                    nom = "majoration pour couche de désolidarisation\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "majoration_pour_couche_de_desolidarisation_sous_couche_de_protection_lourde_m",
                                                                                                                    nom = "majoration pour couche de désolidarisation, sous couche de protection lourde\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "paves_autobloquant_en_beton_epaisseur_60_mm_m",
                                                                                                                    nom = "pavés autobloquant en béton, épaisseur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "paves_autobloquant_en_beton_pleine_masse_epaisseur_60_mm_m",
                                                                                                                    nom = "pavés autobloquant en béton, pleine masse, épaisseur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.62,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "protection_par_dalles_prefabriquees_sur_sous_couche_pour_terrasse_accessible_pietons",
                                                                            nom = "Protection par dalles préfabriquées sur sous couche pour terrasse accessible piétons",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_40x40_cm_epaisseur_4cm_parement_lave_gravillon_roule_m",
                                                                                                                    nom = "dimensions 40x40 cm, épaisseur 4cm, parement lavé, gravillon roulé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_50x50_cm_epaisseur_5cm_parement_lave_gravillon_roule_m",
                                                                                                                    nom = "dimensions 50x50 cm, épaisseur 5cm, parement lavé, gravillon roulé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_40x40_cm_epaisseur_4cm_parement_lave_petit_grain_roule_m",
                                                                                                                    nom = "dimensions 40x40 cm, épaisseur 4cm, parement lavé, petit grain roulé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_50x50_cm_epaisseur_5cm_parement_lave_petit_grain_roule_m",
                                                                                                                    nom = "dimensions 50x50 cm, épaisseur 5cm, parement lavé petit grain roulé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "majoration_pour_pose_a_sec_joints_serres_m",
                                                                                                                    nom = "majoration pour pose à sec, joints serrés\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "majoration_pour_pose_a_sec_a_joints_larges_de_20_mm_m",
                                                                                                                    nom = "majoration pour pose à sec, à joints larges de 20 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "majoration_pour_pose_sur_chape_de_mortier_de_ciment_m",
                                                                                                                    nom = "majoration pour pose sur chape de mortier de ciment\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 259.74,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "protection_par_dalles_prefabriquees_sur_plots_reglables_pour_terrasse_accessible_pietons",
                                                                            nom = "Protection par dalles préfabriquées sur plots réglables pour terrasse accessible piétons",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_40x40_cm_epaisseur_4cm_parement_lave_gravillon_roule_m",
                                                                                                                    nom = "dimensions 40x40 cm, épaisseur 4cm, parement lavé, gravillon roulé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_50x50_cm_epaisseur_5cm_parement_lave_gravillon_roule_m",
                                                                                                                    nom = "dimensions 50x50 cm, épaisseur 5cm, parement lavé, gravillon roulé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_40x40_cm_epaisseur_4cm_parement_lave_petit_grain_roule_m",
                                                                                                                    nom = "dimensions 40x40 cm, épaisseur 4cm, parement lavé, petit grain roulé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_50x50_cm_epaisseur_5cm_parement_lave_petit_grain_roule_m",
                                                                                                                    nom = "dimensions 50x50 cm, épaisseur 5cm, parement lavé, petit grain roulé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_50x50_cm_ep_4cm_en_bois_traite_pin_des_landes_a_lames_nervurees_non_jointives_m",
                                                                                                                    nom = "dalles 50x50 cm, ép 4cm, en bois traité, pin des landes à lames nervureés non jointives\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2115.11,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "protection_lourde_dure_pour_terrasse_accessible_vehicules_legers",
                                                                            nom = "Protection lourde dure pour terrasse accessible-véhicules légers",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dallage_coule_sur_place_epaisseur_6_cm_avec_treillis_soude_m",
                                                                                                                    nom = "dallage coulé sur place, épaisseur 6 cm avec treillis soudé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 278.1,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "protection_lourde_dure_pour_terrasse_accessible_vehicules_lourds",
                                                                            nom = "Protection lourde dure pour terrasse accessible-véhicules lourds",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dallage_coule_sur_place_epaisseur_12_cm_avec_treillis_soude_m",
                                                                                                                    nom = "dallage coulé sur place, épaisseur 12 cm avec treillis soudé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2100.02,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "amenagement_de_zone_jardins",
                                                                            nom = "Aménagement de zone jardins",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_drainante_pente_maxi_10_cailloux_20_40_m",
                                                                                                                    nom = "couche drainante, pente maxi 10%, cailloux 20/40\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_filtrante_pente_maxi_10_subtrat_de_roches_volcaniques_m",
                                                                                                                    nom = "couche filtrante, pente maxi 10%, subtrat de roches volcaniques\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_filtrante_pente_maxi_10_subtrat_drainant_et_filtrant_de_roches_volcaniques_m",
                                                                                                                    nom = "couche filtrante, pente maxi 10%, subtrat drainant et filtrant de roches volcaniques\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.87,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "lanterneau_pour_toiture_avec_etancheite",
                    nom = "Lanterneau pour toiture avec étanchéité",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "lanterneau_pour_toiture_avec_etancheite_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "lanterneau_pour_aeration_naturelle_type_airdome_manuel",
                                                                            nom = "Lanterneau pour aération naturelle type Airdôme manuel",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_500x500_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 443.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_850x850_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 533.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 595.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 679.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 767.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 916.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1019.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1800x1800_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1800x1800 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1220.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_2000x2000_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 2000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1296.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_700x1000_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 539.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1000x1400_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1000x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 639.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 676.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 839.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_double_dome_pmma_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "manuel, double dôme PMMA, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1093.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_500x500_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 411.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_700x1000_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 502.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_850x850_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 487.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 559.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1000x1400_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1000x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 646.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 660.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 785.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 633.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 705.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 855.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 737.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 846.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_1800x1800_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 1800x1800 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 922.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manuel_dome_pca_dimensions_2000x2000_mm_u",
                                                                                                                    nom = "manuel, dôme PCA, dimensions 2000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 956.33,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_pour_aeration_naturelle_type_airdome_electrique",
                                                                            nom = "Lanterneau pour aération naturelle type Airdôme électrique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_500x500_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 802.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_700x1000_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 948.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_850x850_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 930.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 995.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1000x1400_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1000x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1092.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1105.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1258.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1322.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1069.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1145.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1209.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1290.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_1800x1800_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 1800x1800 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1388.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_dome_pca_dimensions_2000x2000_mm_u",
                                                                                                                    nom = "électrique, dôme PCA, dimensions 2000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1420.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_500x500_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 832.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_700x1000_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 966.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_850x850_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 976.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1035.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1000x1400_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1000x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1111.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1133.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1292.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1114.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1205.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1530.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1356.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1475.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_1800x1800_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 1800x1800 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1624.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrique_double_dome_pmma_dimensions_2000x2000_mm_u",
                                                                                                                    nom = "électrique, double dôme PMMA, dimensions 2000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1755.75,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_pour_aeration_naturelle_type_roofaeration_manuel",
                                                                            nom = "Lanterneau pour aération naturelle type Roofaération manuel",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_700x1000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1090.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1504.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1415.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1849.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1588.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1200x2000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1200x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2189.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1689.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1200x2500_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1200x2500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2705.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2534.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1919.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2170.06,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_pour_aeration_naturelle_type_roofaeration_electrique",
                                                                            nom = "Lanterneau pour aération naturelle type Roofaération électrique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_700x1000_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1590.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2108.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2216.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2570.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2260.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1200x2000_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1200x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3470.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1200x2500_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1200x2500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3727.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2427.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3324.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2756.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_pmma_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "double dôme PMMA, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3081,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_700x1000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1488.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2080.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1961.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2408.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2123.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1200x2000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1200x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2866.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1200x2500_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1200x2500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3553.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2279.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3324.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2599.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_pca_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "dôme PCA, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2915.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_pour_eclairage_zenithal_type_skyclair",
                                                                            nom = "Lanterneau pour éclairage zénithal type Skyclair",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_500x500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_700x1000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 314.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_850x850_mm_u",
                                                                                                                    nom = "sur costière, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 286.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 349.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1000x1400_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1000x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 434.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 446.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 521,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 428.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1200x2500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1200x2500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 733.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1200x3000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1200x3000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 813.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 571.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 496.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 509.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1500x2500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1500x2500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 762.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1500x3000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1500x3000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 842.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 586.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1600x2500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1600x2500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 762.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1800x1800_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1800x1800 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 644.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1950x2000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1950x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 680.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1950x2500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1950x2500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 878.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1950x3000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1950x3000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 912.67,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_pour_eclairage_zenithal_type_skydome",
                                                                            nom = "Lanterneau pour éclairage zénithal type Skydôme",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_500x500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_700x1000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 312.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_850x850_mm_u",
                                                                                                                    nom = "sur costière, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 329.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 403.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1000x1400_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1000x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 423.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 449.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 537.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 474.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1200x2500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1200x2500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1155.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 507.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 753.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 643.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 692.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_1800x1800_mm_u",
                                                                                                                    nom = "sur costière, dimensions 1800x1800 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 826.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_costiere_dimensions_2000x2000_mm_u",
                                                                                                                    nom = "sur costière, dimensions 2000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 938.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_500x500_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 418.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_700x1000_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 484.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_850x850_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 473.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 593.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 813.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1000x1400_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1000x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 667.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 710.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 631.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1200x2500_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1200x2500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1536.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 708.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1147.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 873.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 958.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_1800x1800_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 1800x1800 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1109.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "renforce_sur_costiere_dimensions_2000x2000_mm_u",
                                                                                                                    nom = "renforcé, sur costière, dimensions 2000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1261.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_500x500_mm_u",
                                                                                                                    nom = "sans costière, dimensions 500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_700x1000_mm_u",
                                                                                                                    nom = "sans costière, dimensions 700x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 270,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_850x850_mm_u",
                                                                                                                    nom = "sans costière, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "sans costière, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 279.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "sans costière, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 398.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "sans costière, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 529.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "sans costière, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 354.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "sans costière, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 445.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "sans costière, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 600.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "sans costière, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 526.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "sans costière, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 596.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_1800x1800_mm_u",
                                                                                                                    nom = "sans costière, dimensions 1800x1800 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 714.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_costiere_dimensions_2000x2000_mm_u",
                                                                                                                    nom = "sans costière, dimensions 2000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 844.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rond_sur_costiere_polyester_diametre_1800_mm_u",
                                                                                                                    nom = "rond, sur costière polyester, diamètre 1800 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1305.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rond_sur_costiere_polyester_diametre_1600_mm_u",
                                                                                                                    nom = "rond, sur costière polyester, diamètre 1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1161.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rond_sur_costiere_polyester_diametre_1400_mm_u",
                                                                                                                    nom = "rond, sur costière polyester, diamètre 1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1040.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rond_sur_costiere_polyester_diametre_1200_mm_u",
                                                                                                                    nom = "rond, sur costière polyester, diamètre 1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1024.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rond_sur_costiere_polyester_diametre_1000_mm_u",
                                                                                                                    nom = "rond, sur costière polyester, diamètre 1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 801.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rond_sur_costiere_polyester_diametre_850_mm_u",
                                                                                                                    nom = "rond, sur costière polyester, diamètre 850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 593.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rond_sur_costiere_polyester_diametre_700_mm_u",
                                                                                                                    nom = "rond, sur costière polyester, diamètre 700 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 505.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rond_sur_costiere_polyester_diametre_500_mm_u",
                                                                                                                    nom = "rond, sur costière polyester, diamètre 500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 483.04,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_pour_desenfumage_incendie_type_pyrodome",
                                                                            nom = "Lanterneau pour désenfumage incendie type Pyrodôme",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 625.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 730.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 854.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 721.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1200x2000_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1200x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1052.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 847.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1400x2000_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1400x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1377.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1055.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 555.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 658.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 752.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 636.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1200x2000_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1200x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 918.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 731.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 820.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1011.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_double_dome_pmma_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "pneumatique, double dôme PMMA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1068.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_double_dome_pmma_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "pneumatique, double dôme PMMA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1180.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_double_dome_pmma_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "pneumatique, double dôme PMMA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1742.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_double_dome_pmma_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "pneumatique, double dôme PMMA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1189.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_double_dome_pmma_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "pneumatique, double dôme PMMA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1352.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_double_dome_pmma_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "pneumatique, double dôme PMMA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1554.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_dome_pca_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "pneumatique, dôme PCA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 971.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_dome_pca_dimensions_1000x2000_mm_u",
                                                                                                                    nom = "pneumatique, dôme PCA, dimensions 1000x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1239.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_dome_pca_dimensions_1000x1500_mm_u",
                                                                                                                    nom = "pneumatique, dôme PCA, dimensions 1000x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1081.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_dome_pca_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "pneumatique, dôme PCA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1075.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_dome_pca_dimensions_1200x2000_mm_u",
                                                                                                                    nom = "pneumatique, dôme PCA, dimensions 1200x2000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1382.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_dome_pca_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "pneumatique, dôme PCA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1204.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_dome_pca_dimensions_1500x1500_mm_u",
                                                                                                                    nom = "pneumatique, dôme PCA, dimensions 1500x1500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1288.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pneumatique_dome_pca_dimensions_1600x1600_mm_u",
                                                                                                                    nom = "pneumatique, dôme PCA, dimensions 1600x1600 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1407.77,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_pour_desenfumage_incendie_type_pyrotop",
                                                                            nom = "Lanterneau pour désenfumage incendie type Pyrotop",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 524.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 542.84,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_pour_desenfumage_incendie_type_pyropass",
                                                                            nom = "Lanterneau pour désenfumage incendie type Pyropass",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 880.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_dome_pca_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "à treuil, dôme PCA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 998.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 943.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_treuil_double_dome_pmma_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "à treuil, double dôme PMMA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1078.55,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lanterneau_pour_acces_toiture_type_passadome",
                                                                            nom = "Lanterneau pour accès toiture type Passadôme",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "double_dome_en_pmma_renforce_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "double dôme en PMMA renforcé, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 773.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_en_pmma_renforce_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "double dôme en PMMA renforcé, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 729.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_en_pmma_renforce_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "double dôme en PMMA renforcé, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 637.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_dome_en_pmma_renforce_dimensions_850x850_mm_u",
                                                                                                                    nom = "double dôme en PMMA renforcé, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 586.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_en_pca_dimensions_1400x1400_mm_u",
                                                                                                                    nom = "dôme en PCA, dimensions 1400x1400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 737.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_en_pca_dimensions_1200x1200_mm_u",
                                                                                                                    nom = "dôme en PCA, dimensions 1200x1200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 557.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_en_pca_dimensions_1000x1000_mm_u",
                                                                                                                    nom = "dôme en PCA, dimensions 1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 488.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dome_en_pca_dimensions_850x850_mm_u",
                                                                                                                    nom = "dôme en PCA, dimensions 850x850 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 422.34,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "etancheite_des_soubassements",
                    nom = "Etanchéité des soubassements",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "etancheite_des_soubassements_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "membrane_bitumee",
                                                                            nom = "Membrane bitumée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "membrane_bitumee_type_fondafor_ou_similaire_u",
                                                                                                                    nom = "membrane bitumée type Fondafor ou similaire\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 46.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "etancheite_a_l_air",
                    nom = "Etanchéité à l'air",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "etancheite_a_l_air_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "revetement_technique_d_etancheite_a_l_air",
                                                                            nom = "Revêtement technique d'étanchéité à l'air",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "enduit_d_etancheite_a_l_air_a_projeter_m",
                                                                                                                    nom = "enduit d'étanchéité à l'air, à projeter\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "membrane_frein_vapeur_a_base_polyethylene_type_intello_rockfol_m",
                                                                                                                    nom = "membrane frein vapeur à base polyéthylène type Intello Rockfol\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_base_de_resine_acrylique_type_delta_liquixx_bande_de_0_2_cm_m",
                                                                                                                    nom = "à base de résine acrylique type Delta Liquixx, bande de 0,2 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_base_de_resine_acrylique_type_delta_liquixx_m",
                                                                                                                    nom = "à base de résine acrylique type Delta Liquixx\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_base_de_gypse_type_aeroblue_m",
                                                                                                                    nom = "à base de gypse type Aéroblue\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "membrane_hpv_a_base_polyamide_type_vario_m",
                                                                                                                    nom = "membrane HPV à base polyamide type Vario\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.51,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "boitier_d_etancheite_a_l_air",
                                                                            nom = "Boîtier d'étanchéité à l'air",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_boitier_d_appareillage_dimensions_320x190x55_mm_u",
                                                                                                                    nom = "pour boitier d'appareillage, dimensions 320x190x55 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "manchette_d_etancheite_a_l_air",
                                                                            nom = "Manchette d'étanchéité à l'air",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_monocable_en_epdm_diametre_cable_de_6_a_12_mm_u",
                                                                                                                    nom = "type monocâble, en EPDM, diamètre câble de 6 à 12 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_duocables_en_epdm_diametre_cable_de_6_a_12_mm_u",
                                                                                                                    nom = "type duocâbles, en EPDM, diamètre câble de 6 à 12 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_multicables_en_epdm_diametre_cable_de_6_a_12_mm_u",
                                                                                                                    nom = "type multicâbles, en EPDM, diamètre câble de 6 à 12 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_conduit_en_epdm_diametre_conduit_de_15_a_30_mm_u",
                                                                                                                    nom = "pour conduit, en EPDM, diamètre conduit de 15 à 30 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_conduit_en_epdm_diametre_conduit_de_170_a_220_mm_u",
                                                                                                                    nom = "pour conduit, en EPDM, diamètre conduit de 170 à 220 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_conduit_en_epdm_diametre_conduit_de_120_a_170_mm_u",
                                                                                                                    nom = "pour conduit, en EPDM, diamètre conduit de 120 à 170 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_conduit_en_epdm_diametre_conduit_de_100_a_120_mm_u",
                                                                                                                    nom = "pour conduit, en EPDM, diamètre conduit de 100 à 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_conduit_en_epdm_diametre_conduit_de_50_a_90_mm_u",
                                                                                                                    nom = "pour conduit, en EPDM, diamètre conduit de 50 à 90 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.45,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "etancheite_sous_carrelage",
                    nom = "Etanchéité sous carrelage",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "etancheite_sous_carrelage_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "etancheite_sous_carrelage_type_spec",
                                                                            nom = "Etanchéité sous carrelage type SPEC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_support_neuf_m",
                                                                                                                    nom = "sur support neuf\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_support_ancien_ou_bois_m",
                                                                                                                    nom = "sur support ancien ou bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "bande_de_renfort_d_etancheite_pour_les_angles_m",
                                                                                                                    nom = "bande de renfort d'étanchéité pour les angles\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.13,
                                                                                                                    unite = "U",
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
