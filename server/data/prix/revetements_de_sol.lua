local M = {}

M.metier = "Revêtements de sol"
M.ICON = "images/icons/revetements_de_sol.png"

M.STRUCTURE = {
    id = "revetements_de_sol",
    nom = "Revêtements de sol",
    type = "LOT",
    children = {
        {
                    id = "depose_de_revetements_de_sol",
                    nom = "Dépose de revêtements de sol",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "depose_de_revetements_de_sol_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "depose_de_revetement",
                                                                            nom = "Dépose de revêtement",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_les_colle_par_bandes_adhesives_m",
                                                                                                                    nom = "en lés collé par bandes adhésives\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_les_pose_en_simple_encollage_m",
                                                                                                                    nom = "en lés posé en simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_les_pose_en_double_encollage_m",
                                                                                                                    nom = "en lés posé en double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_carreaux_simple_encollage_m",
                                                                                                                    nom = "en carreaux simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_carreaux_double_encollage_m",
                                                                                                                    nom = "en carreaux double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "resistant_a_chaud_m",
                                                                                                                    nom = "résistant à chaud\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_escalier_pose_en_simple_encollage_m",
                                                                                                                    nom = "d'escalier posé en simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "depose_de_seuils_visses_m",
                                                                                                                    nom = "Dépose de seuils vissés\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.91,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "depose_de_parquet",
                                                                            nom = "Dépose de parquet",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "simple_m",
                                                                                                                    nom = "simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "soignee_m",
                                                                                                                    nom = "soignée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.51,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "travaux_preparatoires",
                                                                            nom = "Travaux préparatoires",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "grattage_d_ancien_ragreage_m",
                                                                                                                    nom = "Grattage d'ancien ragréage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lessivage_et_rincage_courant_de_sols_m",
                                                                                                                    nom = "Lessivage et rincage courant de sols\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lessivage_et_decapage_accentues_m",
                                                                                                                    nom = "Lessivage et décapage accentués\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "decapage_a_l_acide_dilue_m",
                                                                                                                    nom = "Décapage à l'acide dilué\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "decapage_de_parquet_m",
                                                                                                                    nom = "Décapage de parquet\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.64,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduction_primaire",
                                                                            nom = "Enduction / Primaire",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_neoprene_m",
                                                                                                                    nom = "Type néoprène\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_hydrofuge_1_couche_m",
                                                                                                                    nom = "D'hydrofuge, 1 couche\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_hydrofuge_2_couches_m",
                                                                                                                    nom = "D'hydrofuge, 2 couches\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "protection_sous_carrelage_type_weber_sys_protect_ou_similaire_m",
                                                                                                                    nom = "protection sous carrelage type Weber Sys Protect ou similaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "primaire_d_accrochage_type_weber_latex_ou_similaire_m",
                                                                                                                    nom = "Primaire d'accrochage type Weber latex ou similaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.36,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "paillasse_d_accrochage",
                                                                            nom = "Paillasse d'accrochage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_base_de_resine_epoxydique_m",
                                                                                                                    nom = "à base de résine époxydique\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 220.28,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "enduits_de_sols",
                    nom = "Enduits de sols",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "enduits_de_sols_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "chape_ciment",
                                                                            nom = "Chape ciment",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "20_a_30_mm_d_epaisseur_m",
                                                                                                                    nom = "20 à 30 mm d'épaisseur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_value_par_tranche_de_5_mm_en_plus_pour_chape_m",
                                                                                                                    nom = "plus value par tranche de 5 mm en plus pour chape\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.9,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_de_lissage",
                                                                            nom = "Enduit de lissage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_ardit_pour_marches_m",
                                                                                                                    nom = "type Ardit pour marches\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ardit_sur_sol_brut_m",
                                                                                                                    nom = "type Ardit sur sol brut\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_ragreage_type_ardit",
                                                                            nom = "Enduit ragréage type Ardit",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_marches_m",
                                                                                                                    nom = "pour marches\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_sol_brut_m",
                                                                                                                    nom = "sur sol brut\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.63,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "beton_cire_a_base_de_coulis_mineral",
                                                                            nom = "Béton ciré à base de coulis minéral",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "au_sol_m",
                                                                                                                    nom = "au sol\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 256.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plan_de_travail_m",
                                                                                                                    nom = "sur plan de travail\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 257.88,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "mortier_de_ragreage_autolissant_type_soldur",
                                                                            nom = "Mortier de ragréage autolissant type Soldur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_5_mm_m",
                                                                                                                    nom = "épaisseur 5 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_10_mm_m",
                                                                                                                    nom = "épaisseur 10 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.48,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "mortier_de_ragreage_autolissant_type_solflex",
                                                                            nom = "Mortier de ragréage autolissant type Solflex",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_5_mm_m",
                                                                                                                    nom = "épaisseur 5 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_10_mm_m",
                                                                                                                    nom = "épaisseur 10 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_15_mm_m",
                                                                                                                    nom = "épaisseur 15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_20_mm_m",
                                                                                                                    nom = "épaisseur 20 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 283.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "billes_d_argile_pour_egalisation_de_niveau_type_pavaplanum_epaisseur_5_cm_m",
                                                                                                                    nom = "Billes d'argile pour égalisation de niveau type Pavaplanum. Epaisseur 5 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.62,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "planchers_techniques",
                    nom = "Planchers techniques",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "planchers_techniques_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "planchers_techniques_gamme_bureautique_montage_entretoise",
                                                                            nom = "Planchers techniques gamme bureautique, montage entretoisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dalles_en_sulfate_de_calcium_hauteur_de_50_mm_a_120_mm_m",
                                                                                                                    nom = "dalles en sulfate de calcium, hauteur de 50 mm à 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 274.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_sulfate_de_calcium_hauteur_de_120_mm_a_170_mm_m",
                                                                                                                    nom = "dalles en sulfate de calcium, hauteur de 120 mm à 170 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 276.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_sulfate_de_calcium_hauteur_de_170_mm_a_230_mm_m",
                                                                                                                    nom = "dalles en sulfate de calcium, hauteur de 170 mm à 230 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 281.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_sulfate_de_calcium_hauteur_de_230_mm_a_350_mm_m",
                                                                                                                    nom = "dalles en sulfate de calcium, hauteur de 230 mm à 350 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 284.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_sulfate_de_calcium_hauteur_de_350_mm_a_430_mm_m",
                                                                                                                    nom = "dalles en sulfate de calcium, hauteur de 350 mm à 430 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 286.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_sulfate_de_calcium_hauteur_de_430_mm_a_550_mm_m",
                                                                                                                    nom = "dalles en sulfate de calcium, hauteur de 430 mm à 550 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 287.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_agglomere_de_bois_hauteur_de_50_mm_a_120_mm_m",
                                                                                                                    nom = "dalles en aggloméré de bois, hauteur de 50 mm à 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 275.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_agglomere_de_bois_hauteur_de_120_mm_a_170_mm_m",
                                                                                                                    nom = "dalles en aggloméré de bois, hauteur de 120 mm à 170 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 277.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_agglomere_de_bois_hauteur_de_170_mm_a_230_mm_m",
                                                                                                                    nom = "dalles en aggloméré de bois, hauteur de 170 mm à 230 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 282.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_agglomere_de_bois_hauteur_de_230_mm_a_350_mm_m",
                                                                                                                    nom = "dalles en aggloméré de bois, hauteur de 230 mm à 350 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 285.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_agglomere_de_bois_hauteur_de_350_mm_a_430_mm_m",
                                                                                                                    nom = "dalles en aggloméré de bois, hauteur de 350 mm à 430 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 287.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_agglomere_de_bois_hauteur_de_430_mm_a_550_mm_m",
                                                                                                                    nom = "dalles en aggloméré de bois, hauteur de 430 mm à 550 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 288.72,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "planchers_techniques_gamme_bureautique_montage_autoportant",
                                                                            nom = "Planchers techniques gamme bureautique, montage autoportant",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dalles_en_sulfate_de_calcium_hauteur_de_50_mm_a_120_mm_m",
                                                                                                                    nom = "dalles en sulfate de calcium, hauteur de 50 mm à 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_sulfate_de_calcium_hauteur_de_120_mm_a_170_mm_m",
                                                                                                                    nom = "dalles en sulfate de calcium, hauteur de 120 mm à 170 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_sulfate_de_calcium_hauteur_de_170_mm_a_230_mm_m",
                                                                                                                    nom = "dalles en sulfate de calcium, hauteur de 170 mm à 230 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_agglomere_de_bois_hauteur_de_50_mm_a_120_mm_m",
                                                                                                                    nom = "dalles en aggloméré de bois, hauteur de 50 mm à 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_agglomere_de_bois_hauteur_de_120_mm_a_170_mm_m",
                                                                                                                    nom = "dalles en aggloméré de bois, hauteur de 120 mm à 170 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 265.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalles_en_agglomere_de_bois_hauteur_de_170_mm_a_230_mm_m",
                                                                                                                    nom = "dalles en aggloméré de bois, hauteur de 170 mm à 230 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 270.9,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "sous_revetements",
                    nom = "Sous-revêtements",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "sous_revetements_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "carton_feutre",
                                                                            nom = "Carton feutre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_pose_collee_type_lourd_m",
                                                                                                                    nom = "en pose collée type lourd\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pose_collee_type_standard_m",
                                                                                                                    nom = "en pose collée type standard\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pose_collee_en_escalier_m",
                                                                                                                    nom = "en pose collée en escalier\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.98,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "agglomere_bois",
                                                                            nom = "Aggloméré bois",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_5_mm_pose_clouee_m",
                                                                                                                    nom = "épaisseur 5 mm, pose clouée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.06,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "contreplaque",
                                                                            nom = "Contreplaqué",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_5_mm_pose_clouee_m",
                                                                                                                    nom = "épaisseur 5 mm, pose clouée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_10_mm_pose_clouee_m",
                                                                                                                    nom = "épaisseur 10 mm, pose clouée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_15_mm_pose_clouee_m",
                                                                                                                    nom = "épaisseur 15 mm, pose clouée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.47,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "thibaude",
                                                                            nom = "Thibaude",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_par_agrafage_m",
                                                                                                                    nom = "posé par agrafage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_par_collage_m",
                                                                                                                    nom = "posé par collage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.69,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "liege",
                                                                            nom = "Liège",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_de_sous_couche_en_liege_colle_m",
                                                                                                                    nom = "pose seule de sous couche en liège collé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_5_mm_densite_250_kg_m3_m",
                                                                                                                    nom = "épaisseur 5 mm, densité 250 kg/m3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_10_mm_densite_250_kg_m3_m",
                                                                                                                    nom = "épaisseur 10 mm, densité 250 kg/m3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_20_mm_densite_250_kg_m3_m",
                                                                                                                    nom = "épaisseur 20 mm, densité 250 kg/m3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.13,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "fibre_naturelle_pour_sol",
                    nom = "Fibre naturelle pour sol",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "fibre_naturelle_pour_sol_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "revetement_en_fibres_naturelles_type_jonc_de_mer",
                                                                            nom = "Revêtement en fibres naturelles type jonc de mer.",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "jonc_de_mer_classic_pose_collee_u",
                                                                                                                    nom = "jonc de mer classic, pose collée\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "jonc_de_mer_fin_pose_collee_u",
                                                                                                                    nom = "jonc de mer fin, pose collée\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "jonc_de_mer_classic_pose_collee_sur_marche_et_contre_marche_m",
                                                                                                                    nom = "jonc de mer classic, pose collée sur marche et contre marche\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "jonc_de_mer_classic_pose_collee_sur_marche_et_contre_marche_m",
                                                                                                                    nom = "jonc de mer classic, pose collée sur marche et contre marche\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.98,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "linoleum",
                    nom = "Linoleum",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "linoleum_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "pose_seule_en_les_de_linoleum",
                                                                            nom = "Pose seule en lés de linoléum",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_2_a_4_mm_simple_encollage_m",
                                                                                                                    nom = "épaisseur 2 à 4 mm, simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_2_a_4_mm_double_encollage_m",
                                                                                                                    nom = "épaisseur 2 à 4 mm, double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_4_a_6_mm_simple_encollage_m",
                                                                                                                    nom = "épaisseur 4 à 6 mm, simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_4_a_6_mm_double_encollage_m",
                                                                                                                    nom = "épaisseur 4 à 6 mm, double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pose_seule_en_dalle_de_linoleum",
                                                                            nom = "Pose seule en dalle de linoléum",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_240x240_mm_sur_jute_m",
                                                                                                                    nom = "dimensions 240x240 mm sur jute\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_320x320_mm_sur_jute_m",
                                                                                                                    nom = "dimensions 320x320 mm sur jute\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 220.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_480x480_mm_sur_jute_m",
                                                                                                                    nom = "dimensions 480x480 mm sur jute\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.47,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_de_sol_clipsable_en_linoleum",
                                                                            nom = "Revêtement de sol clipsable en linoléum",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_marmoleum_click_dimensions_900x300_mm_m",
                                                                                                                    nom = "type Marmoléum click dimensions 900x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_marmoleum_click_dimensions_300x300_mm_m",
                                                                                                                    nom = "type Marmoléum click dimensions 300x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 266.63,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_de_sol_en_dalle_de_linoleum",
                                                                            nom = "Revêtement de sol en dalle de linoléum",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_marmoleum_dimensions_500x500_mm_u4_p3_m",
                                                                                                                    nom = "type Marmoléum dimensions 500x500 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_marmoleum_dimensions_333x333_mm_u4_p3_m",
                                                                                                                    nom = "type Marmoléum dimensions 333x333 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 251.51,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_de_sol_en_le_de_linoleum",
                                                                            nom = "Revêtement de sol en lé de linoléum",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_artoleum_simple_encollage_u4_p3_m",
                                                                                                                    nom = "type Artoléum, simple encollage, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 242.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_artoleum_double_encollage_u4_p3_m",
                                                                                                                    nom = "type Artoléum, double encollage, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_marmoleum_simple_encollage_u2s_p2_m",
                                                                                                                    nom = "type Marmoléum, simple encollage, U2s P2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_marmoleum_double_encollage_u2s_p2_m",
                                                                                                                    nom = "type Marmoléum, double encollage, U2s P2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_marmoleum_simple_encollage_u4_p3_m",
                                                                                                                    nom = "type Marmoléum, simple encollage, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_marmoleum_double_encollage_u4_p3_m",
                                                                                                                    nom = "type Marmoléum, double encollage, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_marmoleum_decibel_simple_encollage_u4_p3_m",
                                                                                                                    nom = "type Marmoléum Décibel, simple encollage, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_marmoleum_decibel_double_encollage_u4_p3_m",
                                                                                                                    nom = "type Marmoléum Décibel, double encollage, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_walton_simple_encollage_u4_p3_m",
                                                                                                                    nom = "type Walton, simple encollage, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_walton_double_encollage_u4_p3_m",
                                                                                                                    nom = "type Walton, double encollage, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mimoseum_simple_encollage_u4t_p3_m",
                                                                                                                    nom = "type Mimoséum, simple encollage, U4t P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mimoseum_double_encollage_u4t_p3_m",
                                                                                                                    nom = "type Mimoséum, double encollage, U4t P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.86,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "revetement_plastique_et_thermoplastique",
                    nom = "Revêtement plastique et thermoplastique",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "revetement_plastique_et_thermoplastique_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "revetement_de_sol_vinylique_isophonique",
                                                                            nom = "Revêtement de sol vinylique isophonique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_novibat_en_le_u2_p2_m",
                                                                                                                    nom = "? Type Novibat, en lé, U2 P2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_eternal_decibel_en_le_u4_p3_m",
                                                                                                                    nom = "? Type Eternal Décibel, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_novillon_fusion_en_le_m",
                                                                                                                    nom = "type Novillon Fusion, en lé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 242.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_novillon_nova_en_le_m",
                                                                                                                    nom = "type Novillon Nova, en lé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_novillon_prima_en_le_m",
                                                                                                                    nom = "type Novillon Prima, en lé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_novillon_viva_en_le_m",
                                                                                                                    nom = "type Novillon Viva, en lé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_novillon_plus_en_le_m",
                                                                                                                    nom = "type Novillon Plus, en lé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_sarlon_en_le_u3_p3_m",
                                                                                                                    nom = "type Sarlon, en lé, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_sarlon_en_le_u4_p3_m",
                                                                                                                    nom = "? Type Sarlon, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 242.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_impression_en_le_u3_p3_m",
                                                                                                                    nom = "type Taralay impression, en lé, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_impression_en_le_u4_p3_m",
                                                                                                                    nom = "type Taralay impression, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_initial_en_le_u3_p3_m",
                                                                                                                    nom = "type Taralay initial, en lé, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_initial_en_le_u4_p3_m",
                                                                                                                    nom = "type Taralay initial, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_matiere_en_le_u3_p3_m",
                                                                                                                    nom = "type Taralay matière, en lé, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_matiere_en_le_u4_p3_m",
                                                                                                                    nom = "type Taralay matière, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_massif_en_le_u3_p3_m",
                                                                                                                    nom = "type Taralay massif, en lé, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_massif_en_le_u4_p3_m",
                                                                                                                    nom = "type Taralay massif, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_uni_en_le_u3_p3_m",
                                                                                                                    nom = "type Taralay uni, en lé, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_uni_en_le_u4_p3_m",
                                                                                                                    nom = "type Taralay uni, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 242.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_colomousse_dalle_de_500x500_mm_u3_p3_m",
                                                                                                                    nom = "type Colomousse dalle de 500x500 mm, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_colomousse_dalle_de_500x500_mm_u4_p3_m",
                                                                                                                    nom = "type Colomousse, dalle de 500x500 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taradal_33_dalle_de_500x500_mm_u3_p3_m",
                                                                                                                    nom = "type Taradal 33, dalle de 500x500 mm, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taradal_43_dalle_de_500x500_mm_u4_p3_m",
                                                                                                                    nom = "type Taradal 43, dalle de 500x500 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.49,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_de_sol_vinylique_antiderapant",
                                                                            nom = "Revêtement de sol vinylique antidérapant",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_taralay_securite_u4_p3_m",
                                                                                                                    nom = "type Taralay sécurité, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_sure_step_plus_u4_p3_m",
                                                                                                                    nom = "type Sure step plus, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_sure_step_safe_u4_p3_m",
                                                                                                                    nom = "type Sure step safe, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_sure_step_u4_p3_m",
                                                                                                                    nom = "type Sure step, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_securite_compact_u4_p3_m",
                                                                                                                    nom = "type Taralay sécurité compact U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.39,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_de_sol_vinylique_compact",
                                                                            nom = "Revêtement de sol vinylique compact",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_eternal_u4_p3_m",
                                                                                                                    nom = "type Eternal, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_flex_sl_en_dalle_de_500x500_mm_u3s_p3_m",
                                                                                                                    nom = "type Flex SL, en dalle de 500x500 mm, U3s P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_flex_sl_en_lame_de_200x1000_mm_u3s_p3_m",
                                                                                                                    nom = "type Flex SL, en lame de 200x1000 mm, U3s P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 257.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_nera_contract_m",
                                                                                                                    nom = "type Nera contract\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_novillon_compact_m",
                                                                                                                    nom = "type Novillon compact\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_novillon_professionnel_m",
                                                                                                                    nom = "type Novillon professionnel\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_novillon_traffic_m",
                                                                                                                    nom = "type Novillon Traffic\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_impression_compact_m",
                                                                                                                    nom = "type Taralay impression compact\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_massif_compact_u4_p3_m",
                                                                                                                    nom = "type Taralay massif compact, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_massif_compact_u3_p3_m",
                                                                                                                    nom = "type Taralay massif compact, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_matiere_compact_u4_p3_m",
                                                                                                                    nom = "type Taralay matière compact, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_taralay_matiere_compact_u3_p3_m",
                                                                                                                    nom = "type Taralay matière compact, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_trafic_compact_u4_p3_m",
                                                                                                                    nom = "type Trafic compact U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_trafic_compact_u3_p3_m",
                                                                                                                    nom = "type Trafic compact U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 235.16,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_de_sol_vinylique_homogene",
                                                                            nom = "Revêtement de sol vinylique homogène",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_colorex_concept_en_dalle_de_610x610_mm_u4_p3_m",
                                                                                                                    nom = "type Colorex concept en dalle de 610x610 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_colorex_sd_en_dalle_de_610x610_mm_u4_p3_m",
                                                                                                                    nom = "type Colorex SD en dalle de 610x610 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_colorex_ec_en_dalle_de_610x610_mm_u4_p3_m",
                                                                                                                    nom = "type Colorex EC en dalle de 610x610 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolan_accord_en_dalle_de_608x608_mm_u4_p3_m",
                                                                                                                    nom = "type Mipolan accord, en dalle de 608x608 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_architecton_en_dalle_de_300x300_mm_u3_p3_m",
                                                                                                                    nom = "type Mipolam architecton en dalle de 300x300 mm, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_cosmo_en_dalle_de_608x608_mm_u4_p3_m",
                                                                                                                    nom = "type Mipolam cosmo en dalle de 608x608 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_elegance_en_dalle_de_608x608_mm_u4_p3_m",
                                                                                                                    nom = "type Mipolam élégance en dalle de 608x608 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_esprit_en_dalle_de_608x608_mm_u4_p3_m",
                                                                                                                    nom = "type Mipolam esprit, en dalle de 608x608 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_troplan_en_dalle_de_608x608_mm_u4_p3_m",
                                                                                                                    nom = "type Mipolam troplan en dalle de 608x608 mm, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_accord_en_le_u4_p3_m",
                                                                                                                    nom = "type Mipolam accord, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_architecton_en_le_u3_p3_m",
                                                                                                                    nom = "type Mipolam architecton, en lé, U3 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_cosmo_en_le_u4_p3_m",
                                                                                                                    nom = "type Mipolam cosmo, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_elegance_en_le_u4_p3_m",
                                                                                                                    nom = "type Mipolam élégance, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_esprit_en_le_u4_p3_m",
                                                                                                                    nom = "type Mipolam esprit, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_troplan_en_le_u4_p3_m",
                                                                                                                    nom = "type Mipolam troplan, en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_mipolam_symbioz_en_le_u4_p3_m",
                                                                                                                    nom = "type Mipolam symbioz , en lé, U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.31,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_vinylique_pour_marche_et_contremarche",
                                                                            nom = "Revêtement vinylique pour marche et contremarche",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_escalier_droit_marche_et_contremarche_en_dalle_type_u4_p3_m",
                                                                                                                    nom = "pour escalier droit, marche et contremarche, en dalle type U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 36.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_escalier_balance_marche_et_contremarche_en_dalle_type_u4_p3_m",
                                                                                                                    nom = "pour escalier balancé, marche et contremarche, en dalle type U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_escalier_droit_marche_et_contremarche_en_le_type_u4_p3_m",
                                                                                                                    nom = "pour escalier droit, marche et contremarche, en lé type U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 35.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_escalier_balance_marche_et_contremarche_en_le_type_u4_p3_m",
                                                                                                                    nom = "pour escalier balancé, marche et contremarche, en lé type U4 P3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 45.45,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pose_seule_en_les_de_revetement_vinylique",
                                                                            nom = "Pose seule en lés de revêtement vinylique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_joints_vifs_par_simple_encollage_m",
                                                                                                                    nom = "à joints vifs, par simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_joints_vifs_par_double_encollage_m",
                                                                                                                    nom = "à joints vifs, par double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tendue_et_soudure_les_m",
                                                                                                                    nom = "tendue et soudure lés\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_feutre_a_joints_vifs_double_encollage_m",
                                                                                                                    nom = "sur feutre, à joints vifs, double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_feutre_a_joints_vifs_simple_encollage_m",
                                                                                                                    nom = "sur feutre, à joints vifs, simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pose_seule_en_dalles_de_revetement_vinylique",
                                                                            nom = "Pose seule en dalles de revêtement vinylique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_simple_encollage_m",
                                                                                                                    nom = "en simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_double_encollage_m",
                                                                                                                    nom = "en double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_damier_simple_encollage_m",
                                                                                                                    nom = "en damier, simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_damier_double_encollage_m",
                                                                                                                    nom = "en damier, double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 220.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_diagonale_simple_encollage_m",
                                                                                                                    nom = "en diagonale, simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_diagonale_double_encollage_m",
                                                                                                                    nom = "en diagonale, double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.08,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "soudure_des_joints_de_revetement_vinylique",
                                                                            nom = "Soudure des joints de revêtement vinylique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_cordon_a_l_endroit_m",
                                                                                                                    nom = "en cordon à l'endroit\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_cordon_a_l_envers_m",
                                                                                                                    nom = "en cordon à l'envers\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "caoutchouc",
                    nom = "Caoutchouc",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "caoutchouc_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "pose_de_carreaux_en_caoutchouc",
                                                                            nom = "Pose de carreaux en caoutchouc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_3_mm_250x250_mm_m",
                                                                                                                    nom = "épaisseur 3 mm, 250x250 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_3_mm_300x300_mm_m",
                                                                                                                    nom = "épaisseur 3 mm, 300x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_3_mm_400x400_mm_m",
                                                                                                                    nom = "épaisseur 3 mm, 400x400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_3_mm_500x500_mm_m",
                                                                                                                    nom = "épaisseur 3 mm, 500x500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.91,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pose_de_tapis_en_caoutchouc",
                                                                            nom = "Pose de tapis en caoutchouc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_3_mm_en_double_encollage_m",
                                                                                                                    nom = "épaisseur 3 mm, en double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_4_a_5_mm_en_double_encollage_m",
                                                                                                                    nom = "épaisseur 4 à 5 mm, en double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.39,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "moquettes",
                    nom = "Moquettes",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "moquettes_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "fourniture_et_pose_de_moquette",
                                                                            nom = "Fourniture et pose de moquette",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "aiguillettee_collee_m",
                                                                                                                    nom = "aiguillettée collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "mechee_collee_m",
                                                                                                                    nom = "méchée collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "mechee_non_collee_m",
                                                                                                                    nom = "méchée non collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 242.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pvc_non_colle_m",
                                                                                                                    nom = "PVC non collé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_pvc_collee_m",
                                                                                                                    nom = "sur PVC collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_support_pvc_marche_et_contre_marche_m",
                                                                                                                    nom = "sur support PVC, marche et contre marche\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 34.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "aiguilletee_collee_sur_marche_et_contre_marche_m",
                                                                                                                    nom = "aiguilletée collée sur marche et contre marche\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.81,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "poses_seules_de_moquette",
                                                                            nom = "Poses seules de moquette",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "collee_par_simple_encollage_m",
                                                                                                                    nom = "collée par simple encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "collee_par_double_encollage_m",
                                                                                                                    nom = "collée par double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "non_collee_m",
                                                                                                                    nom = "non collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "collee_avec_bande_adhesive_m",
                                                                                                                    nom = "collée avec bande adhésive\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "collee_sur_support_pvc_m",
                                                                                                                    nom = "collée sur support PVC\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_libre_de_moquette_en_dalles_m",
                                                                                                                    nom = "pose libre de moquette, en dalles\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_dalles_collees_m",
                                                                                                                    nom = "en dalles collées\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "collee_sur_marche_balancee_par_double_encollage_m",
                                                                                                                    nom = "collée sur marche balancée, par double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tendue_par_simple_clouage_sur_support_existant_m",
                                                                                                                    nom = "tendue par simple clouage sur support existant\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tendue_sur_bandes_a_griffe_sur_support_bois_m",
                                                                                                                    nom = "tendue sur bandes à griffe sur support bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tendue_sur_bandes_a_griffe_sur_support_beton_m",
                                                                                                                    nom = "tendue sur bandes à griffe sur support béton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "aiguilletee_collee_m",
                                                                                                                    nom = "aiguilletée collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_support_pvc_pose_collee_m",
                                                                                                                    nom = "sur support PVC, pose collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_support_pvc_pose_non_colle_m",
                                                                                                                    nom = "sur support PVC, pose non collé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "mechee_non_collee_m",
                                                                                                                    nom = "méchée non collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "mechee_collee_m",
                                                                                                                    nom = "méchée collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "mechee_pose_collee_m",
                                                                                                                    nom = "méchée pose collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "mechee_pose_non_collee_m",
                                                                                                                    nom = "méchée pose non collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.12,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_a_griffe",
                                                                            nom = "Bande à griffe",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "clouee_sur_parquet_m",
                                                                                                                    nom = "clouée sur parquet\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "clouee_pointes_speciales_m",
                                                                                                                    nom = "clouée, pointes spéciales\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vissee_dans_trous_m",
                                                                                                                    nom = "vissée dans trous\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pose_de_plinthe",
                                                                            nom = "Pose de plinthe",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_moquette_decoupee_collee_m",
                                                                                                                    nom = "en moquette decoupée, collée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pvc_hauteur_7_cm_collees_m",
                                                                                                                    nom = "PVC, hauteur 7 cm, collées\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.72,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "parquets",
                    nom = "Parquets",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "parquets_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "parquet_flottant_en_dalle",
                                                                            nom = "Parquet flottant en dalle",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_chataignier_de_dimensions_240x240x22_mm_m",
                                                                                                                    nom = "de châtaignier de dimensions 240x240x22 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2105.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_chataignier_type_baton_rompu_dimensions_240x120x8_mm_m",
                                                                                                                    nom = "de châtaignier type bâton rompu, dimensions 240x120x8 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2115.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_chene_de_dimensions_240x240x22_mm_m",
                                                                                                                    nom = "de chêne de dimensions 240x240x22 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2117.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_chene_type_baton_rompu_dimensions_240x120x8_mm_m",
                                                                                                                    nom = "de chêne type bâton rompu, dimensions 240x120x8 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2129.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_chene_1er_choix_de_dimensions_390x390x25_mm_m",
                                                                                                                    nom = "de chêne 1er choix de dimensions 390x390x25 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2121.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_chene_1er_choix_de_dimensions_300x300x22_mm_m",
                                                                                                                    nom = "de chêne 1er choix de dimensions 300x300x22 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2104.83,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "parquet_flottant_stratifie_a_clips",
                                                                            nom = "Parquet flottant stratifié à clips",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_90_mm_m",
                                                                                                                    nom = "pose seule, lame de 90 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_7_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 7,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_10_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 10 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 270.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 278.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_140_mm_m",
                                                                                                                    nom = "pose seule, lame de 140 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 277.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_180_mm_m",
                                                                                                                    nom = "pose seule, lame de 180 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 251.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 260.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 268.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 276.53,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "parquet_flottant_stratifie_colle",
                                                                            nom = "Parquet flottant stratifié collé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_90_mm_m",
                                                                                                                    nom = "pose seule, lame de 90 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_7_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 7,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_10_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 10 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 270.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 278.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 286.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_140_mm_m",
                                                                                                                    nom = "pose seule, lame de 140 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 266.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 274.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 283.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_180_mm_m",
                                                                                                                    nom = "pose seule, lame de 180 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 272.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 280.31,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "parquet_flottant_contrecolle_a_clips",
                                                                            nom = "Parquet flottant contrecollé à clips",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_90_mm_m",
                                                                                                                    nom = "pose seule, lame de 90 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_7_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 7,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_10_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 10 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 270.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 278.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_140_mm_m",
                                                                                                                    nom = "pose seule, lame de 140 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 277.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_180_mm_m",
                                                                                                                    nom = "pose seule, lame de 180 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 251.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 260.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 268.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 276.53,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "parquet_flottant_contrecolle_colle",
                                                                            nom = "Parquet flottant contrecollé collé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_90_mm_m",
                                                                                                                    nom = "pose seule, lame de 90 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_5_euro_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 5 &euro;>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_7_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 7,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_10_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 10 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 270.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 278.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_90_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 90 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 286.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_140_mm_m",
                                                                                                                    nom = "pose seule, lame de 140 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 266.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 274.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_140_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 140 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 283.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_seule_lame_de_180_mm_m",
                                                                                                                    nom = "pose seule, lame de 180 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_12_5_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 12,5 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_15_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 15 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_20_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 20 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_25_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 25 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_30_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 30 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 272.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lame_de_180_mm_prix_d_achat_35_m",
                                                                                                                    nom = "lame de 180 mm <prix d'achat 35 ¤>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 280.31,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "travaux_annexes",
                    nom = "Travaux annexes",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "travaux_annexes_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "ajustage_de_porte",
                                                                            nom = "Ajustage de porte",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_vantail_u",
                                                                                                                    nom = "1 vantail\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_vantaux_u",
                                                                                                                    nom = "2 vantaux\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "seuils_visses",
                                                                            nom = "Seuils vissés",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "largeur_30_mm_inox_m",
                                                                                                                    nom = "largeur 30 mm, inox\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_35_mm_inox_m",
                                                                                                                    nom = "largeur 35 mm, inox\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_40_mm_inox_m",
                                                                                                                    nom = "largeur 40 mm, inox\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_50_mm_inox_m",
                                                                                                                    nom = "largeur 50 mm, inox\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_30_mm_laiton_m",
                                                                                                                    nom = "largeur 30 mm, laiton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_35_mm_laiton_m",
                                                                                                                    nom = "largeur 35 mm, laiton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_40_mm_laiton_m",
                                                                                                                    nom = "largeur 40 mm, laiton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_50_mm_laiton_m",
                                                                                                                    nom = "largeur 50 mm, laiton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couvre_joint_de_dilatation_laiton_poli_m",
                                                                                                                    nom = "Couvre-joint de dilatation laiton poli\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 53.37,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "baguette_1_4_rond",
                                                                            nom = "Baguette 1/4 rond",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "non_peinte_m",
                                                                                                                    nom = "non peinte\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "peinte_m",
                                                                                                                    nom = "peinte\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.58,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "nez_de_marche",
                                                                            nom = "Nez de marche",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_plastique_collee_section_42x48_mm_m",
                                                                                                                    nom = "en plastique, collée, section 42x48 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plastique_collee_section_45x28_mm_m",
                                                                                                                    nom = "en plastique, collée, section 45x28 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plastique_collee_section_45x38_mm_m",
                                                                                                                    nom = "en plastique, collée, section 45x38 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plastique_collee_section_56x40_mm_m",
                                                                                                                    nom = "en plastique, collée, section 56x40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "bande_peripherique_sol_m",
                                                                                                                    nom = "Bande périphérique sol\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.34,
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
