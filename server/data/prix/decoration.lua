local M = {}

M.metier = "Décoration"
M.ICON = "images/icons/decoration.png"

M.STRUCTURE = {
    id = "decoration",
    nom = "Décoration",
    type = "LOT",
    children = {
        {
                    id = "facons_et_imitations",
                    nom = "Façons et imitations",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "facons_et_imitations_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "facon_coupe_de_pierre_appareillee",
                                                                            nom = "Façon coupe de pierre appareillée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "assise_inferieure_a_300_mm_m",
                                                                                                                    nom = "assise inférieure à 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "assise_superieure_a_300_mm_m",
                                                                                                                    nom = "assise supérieure à 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moellons_irreguliers_m",
                                                                                                                    nom = "moellons irréguliers\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.57,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "facon_joint",
                                                                            nom = "Façon joint",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "joints_briques_70x200_mm_m",
                                                                                                                    nom = "joints briques 70x200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "joints_adoucis_m",
                                                                                                                    nom = "joints adoucis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.39,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "filet",
                    nom = "Filet",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "filet_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "glacis",
                                                                            nom = "Glacis",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_ravivage_apres_nettoyage_m",
                                                                                                                    nom = "pour ravivage après nettoyage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "spalte_m",
                                                                                                                    nom = "spalté\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.51,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "imitation_bois",
                                                                            nom = "Imitation bois",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "facon_sapin_ou_chene_m",
                                                                                                                    nom = "façon sapin ou chêne\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 235.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "facon_noyer_ou_ebene_m",
                                                                                                                    nom = "façon noyer ou ébène\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "facon_sipo_ou_bois_exotique_m",
                                                                                                                    nom = "façon sipo ou bois exotique\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 235.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "facon_bois_de_rose_citronnier_m",
                                                                                                                    nom = "façon bois de rose-citronnier\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "facon_marquetterie_avec_panneaux_aux_fibres_contraries_en_carre_ou_losange_m",
                                                                                                                    nom = "façon marquetterie avec panneaux aux fibres contrariés en carré ou losange\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 282.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "imitation_granit",
                                                                            nom = "Imitation granit",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "granit_courant_m",
                                                                                                                    nom = "granit courant\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 235.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "granit_du_labrador_m",
                                                                                                                    nom = "granit du Labrador\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "granit_chiquete_par_ton_m",
                                                                                                                    nom = "granit chiqueté par ton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.62,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "imitation_marbre",
                                                                            nom = "Imitation marbre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "marbre_courant_veine_type_carrare_pyrenees_m",
                                                                                                                    nom = "marbre courant veiné type Carrare, pyrénées\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "marbre_rose_aurore_du_portugal_m",
                                                                                                                    nom = "marbre rose Aurore du Portugal\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "marbre_vert_des_alpes_m",
                                                                                                                    nom = "marbre vert des Alpes\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.29,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "imitation_metaux",
                                                                            nom = "Imitation métaux",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "bronze_m",
                                                                                                                    nom = "bronze\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.59,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "patine_de_corniches_moulurees",
                                                                            nom = "Patine de corniches moulurées",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_moulures_jusqu_a_30_cm_de_largeur_m",
                                                                                                                    nom = "pour moulures jusqu'à 30 cm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_moulures_de_30_a_60_cm_de_largeur_m",
                                                                                                                    nom = "pour moulures de 30 à 60 cm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.95,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "patinage_de_surfaces_moulurees",
                                                                            nom = "Patinage de surfaces moulurées",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "avec_glacis_et_frottis_m",
                                                                                                                    nom = "avec glacis et frottis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_vieillissement_par_grains_poches_m",
                                                                                                                    nom = "avec vieillissement par grains pochés\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.46,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "rechampissage_de_tons",
                                                                            nom = "Rechampissage de tons",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "standard_m",
                                                                                                                    nom = "standard\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.08,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "decorations_de_portes_isoplanes",
                    nom = "Décorations de portes isoplanes",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "decorations_de_portes_isoplanes_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "ensemble_type_contemporain",
                                                                            nom = "Ensemble type Contemporain",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_panneau_fourniture_seule_u",
                                                                                                                    nom = "1 panneau, fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_panneau_fourniture_et_pose_u",
                                                                                                                    nom = "1 panneau, fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 61.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "ensemble_type_louis_xii",
                                                                            nom = "Ensemble type Louis XII",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_seule_u",
                                                                                                                    nom = "1 panneau avec fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_panneaux_avec_fourniture_seule_u",
                                                                                                                    nom = "2 panneaux avec fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_et_pose_u",
                                                                                                                    nom = "1 panneau avec fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 57.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_panneaux_avec_fourniture_et_pose_u",
                                                                                                                    nom = "2 panneaux avec fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 89.28,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "ensemble_type_louis_xiv",
                                                                            nom = "Ensemble type Louis XIV",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_seule_u",
                                                                                                                    nom = "1 panneau avec fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_et_pose_u",
                                                                                                                    nom = "1 panneau avec fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.26,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "ensemble_type_louis_xv",
                                                                            nom = "Ensemble type Louis XV",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_seule_u",
                                                                                                                    nom = "1 panneau avec fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_panneaux_avec_fourniture_seule_u",
                                                                                                                    nom = "2 panneaux avec fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "3_panneaux_avec_fourniture_seule_u",
                                                                                                                    nom = "3 panneaux avec fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_et_pose_u",
                                                                                                                    nom = "1 panneau avec fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_panneaux_avec_fourniture_et_pose_u",
                                                                                                                    nom = "2 panneaux avec fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 96.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "3_panneaux_avec_fourniture_et_pose_u",
                                                                                                                    nom = "3 panneaux avec fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 106.42,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "ensemble_type_louis_xvi",
                                                                            nom = "Ensemble type Louis XVI",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_seule_u",
                                                                                                                    nom = "1 panneau avec fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_panneaux_avec_fourniture_seule_u",
                                                                                                                    nom = "2 panneaux avec fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_et_pose_u",
                                                                                                                    nom = "1 panneau avec fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 64.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_panneaux_avec_fourniture_et_pose_u",
                                                                                                                    nom = "2 panneaux avec fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 95.07,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "ensemble_type_regence",
                                                                            nom = "Ensemble type Régence",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_seule_u",
                                                                                                                    nom = "1 panneau avec fourniture seule\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_panneau_avec_fourniture_et_pose_u",
                                                                                                                    nom = "1 panneau avec fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 63.58,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "decoration_interieure",
                    nom = "Décoration intérieure",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "decoration_interieure_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "revetement_mural_compose_de_paillettes_irisees_de_granulometrie_moyenne_en_phase_aqueuse",
                                                                            nom = "Revêtement mural composé de paillettes irisées de granulométrie moyenne en phase aqueuse",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "projete_sur_surface_plane_paillettes_multicolores_m",
                                                                                                                    nom = "projeté sur surface plane, paillettes multicolores\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "projete_en_sous_face_paillettes_multicolores_m",
                                                                                                                    nom = "projeté en sous-face, paillettes multicolores\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 239.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "projete_sur_surface_mouluree_paillettes_multicolores_m",
                                                                                                                    nom = "projeté sur surface moulurée, paillettes multicolores\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.66,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_mural_compose_de_fines_particules_multicolores_en_phase_aqueuse",
                                                                            nom = "Revêtement mural composé de fines particules multicolores en phase aqueuse",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "projete_sur_surface_mouluree_paillettes_multicolores_m",
                                                                                                                    nom = "projeté sur surface moulurée, paillettes multicolores\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "projete_sur_surface_plane_paillettes_multicolores_m",
                                                                                                                    nom = "projeté sur surface plane, paillettes multicolores\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "projete_en_sous_face_paillettes_multicolores_m",
                                                                                                                    nom = "projeté en sous-face, paillettes multicolores\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.59,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_mural_granite_synthetiques_en_phase_aqueuse",
                                                                            nom = "Revêtement mural granité synthétiques en phase aqueuse",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "projete_sur_surface_plane_teintes_standards_m",
                                                                                                                    nom = "projeté sur surface plane, teintes standards\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "projete_en_sous_face_teintes_standards_m",
                                                                                                                    nom = "projeté en sous-face, teintes standards\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 242.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "projete_sur_surface_mouluree_teintes_standards_m",
                                                                                                                    nom = "projeté sur surface moulurée, teintes standards\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.23,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_mural_en_liege",
                                                                            nom = "Revêtement mural en liège",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_de_liege_en_carreaux_m",
                                                                                                                    nom = "pose seule de liège en carreaux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_dalle_dimensions_600x300x3_mm_m",
                                                                                                                    nom = "en dalle, dimensions 600x300x3 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_dalle_dimensions_300x300x4_mm_m",
                                                                                                                    nom = "en dalle, dimensions 300x300x4 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "projete_type_subestres_ou_similaire_m",
                                                                                                                    nom = "projeté type Subestres ou similaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.68,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_plastique_satine_garnissant_synthetique_en_phase_aqueuse",
                                                                            nom = "Revêtement plastique satiné garnissant synthétique en phase aqueuse",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_surface_plane_teinte_blanc_m",
                                                                                                                    nom = "sur surface plane, teinte blanc\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_sous_face_teinte_blanc_m",
                                                                                                                    nom = "en sous-face, teinte blanc\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 226.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_surface_mouluree_teinte_blanc_m",
                                                                                                                    nom = "sur surface moulurée, teinte blanc\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.77,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "tissus_de_fibre_de_verre_a_peindre",
                                                                            nom = "Tissus de fibre de verre à peindre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "tissus_type_filigrane_m",
                                                                                                                    nom = "tissus type Filigrane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_canevas_m",
                                                                                                                    nom = "tissus type Canevas\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_lin_m",
                                                                                                                    nom = "tissus type Lin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_structure_m",
                                                                                                                    nom = "tissus type Structure\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_jute_m",
                                                                                                                    nom = "tissus type Jute\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_losange_m",
                                                                                                                    nom = "tissus type Losange\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_toile_m",
                                                                                                                    nom = "tissus type Toile\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_chevron_m",
                                                                                                                    nom = "tissus type Chevron\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_diagonale_m",
                                                                                                                    nom = "tissus type Diagonale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_ligne_m",
                                                                                                                    nom = "tissus type Ligne\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_domino_m",
                                                                                                                    nom = "tissus type Domino\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_laine_m",
                                                                                                                    nom = "tissus type Laine\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_perle_m",
                                                                                                                    nom = "tissus type Perlé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_special_plafond_m",
                                                                                                                    nom = "tissus spécial plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_tisse_m",
                                                                                                                    nom = "tissus type Tissé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_relief_m",
                                                                                                                    nom = "tissus type Relief\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.23,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "tissus_de_fibre_de_verre_colle_et_peint_en_une_seule_operation",
                                                                            nom = "Tissus de fibre de verre collé et peint en une seule opération",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_filigrane_finition_mat_m",
                                                                                                                    nom = "type Filigrane, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_canevas_finition_mat_m",
                                                                                                                    nom = "type Canevas, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_lin_finition_mat_m",
                                                                                                                    nom = "type Lin, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_structure_finition_mat_m",
                                                                                                                    nom = "type Structure, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_jute_finition_mat_m",
                                                                                                                    nom = "type Jute, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_losange_finition_mat_m",
                                                                                                                    nom = "type Losange, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_toile_finition_mat_m",
                                                                                                                    nom = "type Toile, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_chevron_finition_mat_m",
                                                                                                                    nom = "type Chevron, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_diagonale_finition_mat_m",
                                                                                                                    nom = "type Diagonale, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ligne_finition_mat_m",
                                                                                                                    nom = "type Ligne, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_domino_finition_mat_m",
                                                                                                                    nom = "type Domino, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_laine_finition_mat_m",
                                                                                                                    nom = "type Laine, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_perle_finition_mat_m",
                                                                                                                    nom = "type Perlé, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_special_plafond_finition_mat_m",
                                                                                                                    nom = "type spécial plafond, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_tisse_finition_mat_m",
                                                                                                                    nom = "type Tissé, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_relief_finition_mat_m",
                                                                                                                    nom = "type Relief, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_voile_de_verre_finition_mat_m",
                                                                                                                    nom = "type Voile de verre, finition mat\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_filigrane_finition_satin_m",
                                                                                                                    nom = "type Filigrane, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_canevas_finition_satin_m",
                                                                                                                    nom = "type Canevas, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_lin_finition_satin_m",
                                                                                                                    nom = "type Lin, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_structure_finition_satin_m",
                                                                                                                    nom = "type Structure, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_jute_finition_satin_m",
                                                                                                                    nom = "type Jute, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_losange_finition_satin_m",
                                                                                                                    nom = "type Losange, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_toile_finition_satin_m",
                                                                                                                    nom = "type Toile, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_chevron_finition_satin_m",
                                                                                                                    nom = "type Chevron, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_diagonale_finition_satin_m",
                                                                                                                    nom = "type Diagonale, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ligne_finition_satin_m",
                                                                                                                    nom = "type Ligne, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_domino_finition_satin_m",
                                                                                                                    nom = "type Domino, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_laine_finition_satin_m",
                                                                                                                    nom = "type Laine, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_perle_finition_satin_m",
                                                                                                                    nom = "type Perlé, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_special_plafond_finition_satin_m",
                                                                                                                    nom = "type spécial plafond, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_tisse_finition_satin_m",
                                                                                                                    nom = "type Tissé, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_relief_finition_satin_m",
                                                                                                                    nom = "type Relief, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_voile_de_verre_finition_satin_m",
                                                                                                                    nom = "type Voile de verre, finition satin\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.28,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_decoratif_sur_mur",
                                                                            nom = "Enduit décoratif sur mur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "enduit_de_creme_de_chaux_de_pigment_naturel_m",
                                                                                                                    nom = "enduit de crème de chaux de pigment naturel\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "enduit_mineral_a_cirer_m",
                                                                                                                    nom = "enduit minéral à cirer\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "enduit_cire_en_pate_1_kg_au_m2_terre_a_l_ancienne_m",
                                                                                                                    nom = "enduit ciré en pâte 1 kg au m2, terre à l'ancienne\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "enduit_cire_en_pate_2_kg_au_m2_terre_a_l_ancienne_m",
                                                                                                                    nom = "enduit ciré en pâte 2 kg au m2, terre à l'ancienne\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "enduit_tadelakt_couche_primaire_environ_5_mm_m",
                                                                                                                    nom = "enduit Tadelakt, couche primaire <environ 5 mm>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "enduit_tadelakt_couche_de_finition_environ_5_mm_m",
                                                                                                                    nom = "enduit Tadelakt, couche de finition <environ 5 mm>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "enduit_stuc_a_effet_marbre_m",
                                                                                                                    nom = "enduit Stuc, à effet marbré\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "torchi_a_l_ancienne_m",
                                                                                                                    nom = "torchi à l'ancienne\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pate_a_papier_a_projeter_a_la_machine_m",
                                                                                                                    nom = "pâte à papier à projeter à la machine\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pate_a_papier_a_rouler_m",
                                                                                                                    nom = "pâte à papier à rouler\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.55,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "panneau_decoratif_en_mosaique_de_verre",
                                                                            nom = "Panneau décoratif en mosaïque de verre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_2500x1200_mm_art_rosy_u",
                                                                                                                    nom = "Dimensions 2500x1200 mm, Art Rosy\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2152.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_2500x1200_mm_art_lotus_u",
                                                                                                                    nom = "Dimensions 2500x1200 mm, Art Lotus\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2152.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_2500x1200_mm_art_hippie_u",
                                                                                                                    nom = "Dimensions 2500x1200 mm, Art Hippie\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2152.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_2500x1200_mm_art_floral_u",
                                                                                                                    nom = "Dimensions 2500x1200 mm, Art Floral\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2152.88,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "voile_de_verre",
                                                                            nom = "Voile de verre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "tissus_type_voile_de_verre_sur_murs_m",
                                                                                                                    nom = "tissus type Voile de verre sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tissus_type_voile_de_verre_sur_plafonds_m",
                                                                                                                    nom = "tissus type Voile de verre sur plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.58,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "lettres",
                    nom = "Lettres",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "lettres_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "calicot",
                                                                            nom = "Calicot",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_2_lignes_hauteur_0_40_m_3_m_minimum_m",
                                                                                                                    nom = "1-2 lignes, hauteur 0,40 m, 3 m minimum\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_2_lignes_hauteur_0_50_m_3_m_minimum_m",
                                                                                                                    nom = "1-2 lignes, hauteur 0,50 m, 3 m minimum\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_2_lignes_hauteur_0_60_m_3_m_minimum_m",
                                                                                                                    nom = "1-2 lignes, hauteur 0,60 m, 3 m minimum\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 52.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_3_lignes_hauteur_0_80_m_3_m_minimum_m",
                                                                                                                    nom = "2-3 lignes, hauteur 0,80 m, 3 m minimum\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 60.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_3_lignes_hauteur_1_00_m_3_m_minimum_m",
                                                                                                                    nom = "2-3 lignes, hauteur 1,00 m, 3 m minimum\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 68.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_3_lignes_hauteur_1_20_m_3_m_minimum_m",
                                                                                                                    nom = "2-3 lignes, hauteur 1,20 m, 3 m minimum\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 72.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "montage_sur_chassis_bois_non_compris_hauteur_800_mm_m",
                                                                                                                    nom = "montage sur châssis bois non compris, hauteur 800 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "montage_sur_chassis_bois_non_compris_hauteur_1000_mm_m",
                                                                                                                    nom = "montage sur châssis bois non compris, hauteur 1000 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "montage_sur_chassis_bois_non_compris_hauteur_1200_mm_m",
                                                                                                                    nom = "montage sur châssis bois non compris, hauteur 1200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.37,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lettre_fluorescente",
                                                                            nom = "Lettre fluorescente",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_fond_clair_u",
                                                                                                                    nom = "sur fond clair\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_fond_fonce_u",
                                                                                                                    nom = "sur fond foncé\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 37.9,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lettre_peinte",
                                                                            nom = "Lettre peinte",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "avec_ombre_portee_ou_epaisseur_1_couche_hauteur_0_a_50_cm_m",
                                                                                                                    nom = "avec ombre portée ou épaisseur, 1 couche, hauteur 0 à 50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 50.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_ombre_portee_ou_epaisseur_1_couche_hauteur_0_51_a_1_m_m",
                                                                                                                    nom = "avec ombre portée ou épaisseur, 1 couche, hauteur 0,51 à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 66.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "baton_ou_universelle_1_couche_hauteur_0_a_50_cm_m",
                                                                                                                    nom = "bâton ou universelle, 1 couche, hauteur 0 à 50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "baton_ou_universelle_2_couches_hauteur_0_a_50_cm_m",
                                                                                                                    nom = "bâton ou universelle, 2 couches, hauteur 0 à 50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "detournee_sertie_1_couche_hauteur_0_a_50_cm_m",
                                                                                                                    nom = "détournée-sertie, 1 couche, hauteur 0 à 50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_ombre_portee_ou_epaisseur_2_couches_hauteur_0_a_50_cm_m",
                                                                                                                    nom = "avec ombre portée ou épaisseur, 2 couches, hauteur 0 à 50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 66.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_ombre_portee_ou_epaisseur_2_couches_hauteur_0_51_a_1_m_m",
                                                                                                                    nom = "avec ombre portée ou épaisseur, 2 couches, hauteur 0,51 à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 86.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "baton_ou_universelle_1_couche_hauteur_0_51_a_1_m_m",
                                                                                                                    nom = "bâton ou universelle, 1 couche, hauteur 0,51 à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "baton_ou_universelle_2_couches_hauteur_0_51_a_1_m_m",
                                                                                                                    nom = "bâton ou universelle, 2 couches, hauteur 0,51 à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 58.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_ombre_portee_ou_epaisseur_1_couche_hauteur_superieure_a_1_m_m",
                                                                                                                    nom = "avec ombre portée ou épaisseur, 1 couche, hauteur supérieure à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 82.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "detournee_sertie_1_couche_hauteur_0_51_a_1_m_m",
                                                                                                                    nom = "détournée-sertie, 1 couche, hauteur 0,51 à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 82.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_ombre_portee_ou_epaisseur_2_couches_hauteur_superieure_a_1_m_m",
                                                                                                                    nom = "avec ombre portée ou épaisseur, 2 couches, hauteur supérieure à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 101.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "baton_ou_universelle_1_couche_hauteur_superieure_a_1_m_m",
                                                                                                                    nom = "bâton ou universelle, 1 couche, hauteur supérieure à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 49.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "baton_ou_universelle_2_couches_hauteur_superieure_a_1_m_m",
                                                                                                                    nom = "bâton ou universelle, 2 couches, hauteur supérieure à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 74.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "detournee_sertie_1_couche_hauteur_superieure_a_1_m_m",
                                                                                                                    nom = "détournée-sertie, 1 couche, hauteur supérieure à 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 98.04,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lettre_sur_vitre_ou_glace",
                                                                            nom = "Lettre sur vitre ou glace",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_peinture_vinyle_a_1_couche_u",
                                                                                                                    nom = "en peinture vinyle à 1 couche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_peinture_vinyle_a_2_couches_u",
                                                                                                                    nom = "en peinture vinyle à 2 couches\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_peinture_vinyle_a_3_couches_u",
                                                                                                                    nom = "en peinture vinyle à 3 couches\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.37,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "numero_vehicule",
                                                                            nom = "Numéro véhicule",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_plaque_avec_numeros_u",
                                                                                                                    nom = "1 plaque avec numéros\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_plaques_avec_numeros_u",
                                                                                                                    nom = "2 plaques avec numéros\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fond_d_une_plaque_u",
                                                                                                                    nom = "fond d'une plaque\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.97,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pancarte_support_carton",
                                                                            nom = "Pancarte support carton",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "texte_de_2_a_3_lignes_dimensions_250x160_mm_u",
                                                                                                                    nom = "texte de 2 à 3 lignes, dimensions 250x160 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "texte_de_2_a_3_lignes_dimensions_250x320_mm_u",
                                                                                                                    nom = "texte de 2 à 3 lignes, dimensions 250x320 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 39.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "texte_de_2_a_3_lignes_dimensions_500x225_mm_u",
                                                                                                                    nom = "texte de 2 à 3 lignes, dimensions 500x225 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "texte_de_2_a_3_lignes_dimensions_500x650_mm_u",
                                                                                                                    nom = "texte de 2 à 3 lignes, dimensions 500x650 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 58.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "texte_de_2_a_3_lignes_dimensions_1000x650_mm_u",
                                                                                                                    nom = "texte de 2 à 3 lignes, dimensions 1000x650 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 78.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "texte_de_4_a_6_lignes_dimensions_250x160_mm_u",
                                                                                                                    nom = "texte de 4 à 6 lignes, dimensions 250x160 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 37.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "texte_de_4_a_6_lignes_dimensions_250x320_mm_u",
                                                                                                                    nom = "texte de 4 à 6 lignes, dimensions 250x320 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "texte_de_4_a_6_lignes_dimensions_500x225_mm_u",
                                                                                                                    nom = "texte de 4 à 6 lignes, dimensions 500x225 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 58.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "texte_de_4_a_6_lignes_dimensions_500x650_mm_u",
                                                                                                                    nom = "texte de 4 à 6 lignes, dimensions 500x650 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 78.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "texte_de_4_a_6_lignes_dimensions_1000x650_mm_u",
                                                                                                                    nom = "texte de 4 à 6 lignes, dimensions 1000x650 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 113.67,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "signaletique_pour_locaux_recevant_du_public_erp",
                    nom = "Signalétique pour locaux recevant du public ERP",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "signaletique_pour_locaux_recevant_du_public_erp_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "bandes_podotactiles",
                                                                            nom = "Bandes podotactiles",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "plaques_d_alerte_en_polypropylene_selon_norme_nf_p98_351_type_podoalerte_m",
                                                                                                                    nom = "plaques d'alerte en polypropylène selon norme NF P98-351 type Podoalerte\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 46.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plaques_de_guidage_en_polypropylene_selon_norme_nf_p98_351_type_cedo_m",
                                                                                                                    nom = "plaques de guidage en polypropylène selon norme NF P98-351 type Cedo\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 71.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "barre_280x35x5_mm_inox_brosse_pour_interieur_type_podoinox_u",
                                                                                                                    nom = "barre 280x35x5 mm inox brossé pour intérieur type Podoinox\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "barre_280x35x5_mm_inox_brosse_pour_exterieur_type_podoinox_u",
                                                                                                                    nom = "barre 280x35x5 mm inox brossé pour extérieur type Podoinox\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "bouton_35x35x5_mm_inox_brosse_pour_interieur_type_podoinox_u",
                                                                                                                    nom = "bouton 35x35x5 mm inox brossé pour intérieur type Podoinox\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "bouton_35x35x5_mm_inox_brosse_pour_exterieur_type_podoinox_u",
                                                                                                                    nom = "bouton 35x35x5 mm inox brossé pour extérieur type Podoinox\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "gabarit_de_pose_pour_boutons_et_barres_pododactiles_u",
                                                                                                                    nom = "gabarit de pose pour boutons et barres pododactiles\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 46.98,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "borne_signaletique",
                                                                            nom = "Borne signalétique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_180x1260_mm_sur_tige_u",
                                                                                                                    nom = "dimensions 180x1260 mm, sur tige\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_180x1365_mm_monolithique_u",
                                                                                                                    nom = "dimensions 180x1365 mm, monolithique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 414.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_180x1448_mm_monolithique_u",
                                                                                                                    nom = "dimensions 180x1448 mm, monolithique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 583.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pictogramme_pour_contremarche_d_escalier_m",
                                                                                                                    nom = "Pictogramme pour contremarche d'escalier\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.38,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pictogramme_pour_main_courante",
                                                                            nom = "Pictogramme pour main courante",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_145x80_mm_diametre_35_55_mm_type_pasamano_u",
                                                                                                                    nom = "dimensions 145x80 mm, diamètre 35-55 mm, type Pasamano\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 79.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_230x80_mm_diametre_35_55_mm_type_pasamano_u",
                                                                                                                    nom = "dimensions 230x80 mm, diamètre 35-55 mm, type Pasamano\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 70.66,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plaque_signaletique_murale",
                                                                            nom = "plaque signalétique murale",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_90x135_mm_u",
                                                                                                                    nom = "dimensions 90x135 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 57.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_155x60_mm_type_pasamano_u",
                                                                                                                    nom = "dimensions 155x60 mm, type Pasamano\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 59.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_150x150_mm_u",
                                                                                                                    nom = "dimensions 150x150 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 37.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_240x60_mm_type_pasamano_u",
                                                                                                                    nom = "dimensions 240x60 mm, type Pasamano\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 71.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_180x270_mm_u",
                                                                                                                    nom = "dimensions 180x270 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 90.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_270x405_mm_u",
                                                                                                                    nom = "dimensions 270x405 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.76,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "systeme_d_orientation_auditif_visuel_et_kinesthesique",
                                                                            nom = "Système d'orientation auditif, visuel et kinesthésique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "coffret_mural_d_orientation_dimensions_250x450x100_mm_type_marcal_u",
                                                                                                                    nom = "coffret mural d'orientation dimensions 250x450x100 mm type Marcal\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1929.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "borne_d_orientation_dimensions_250x1400x420_mm_type_marcal_u",
                                                                                                                    nom = "borne d'orientation dimensions 250x1400x420 mm type Marcal\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2791.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "table_d_orientation_dimensions_980x900x400_mm_type_marcal_u",
                                                                                                                    nom = "table d'orientation dimensions 980x900x400 mm type Marcal\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5488.55,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "staff",
                                                                            nom = "Staff",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "angle_corniche_staff_developpe_250_a_400_mm_m",
                                                                                                                    nom = "Angle corniche staff développé 250 à 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.08,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "corniche_en_staff",
                                                                            nom = "Corniche en staff",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "lisse_developpe_200_mm_m",
                                                                                                                    nom = "lisse, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 59.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lisse_developpe_300_mm_m",
                                                                                                                    nom = "lisse, développé 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 97.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lisse_developpe_400_mm_m",
                                                                                                                    nom = "lisse, développé 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 116.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lisse_developpe_de_400_a_500_mm_m",
                                                                                                                    nom = "lisse, développé de 400 à 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 112.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_ornement_sculpte_developpe_200_mm_m",
                                                                                                                    nom = "1 ornement sculpté, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 78.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_ornements_sculptes_developpes_300_mm_m",
                                                                                                                    nom = "2 ornements sculptés, développés 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 98.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_ornements_sculptes_developpes_de_400_a_450_mm_m",
                                                                                                                    nom = "2 ornements sculptés, développés de 400 à 450 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 109.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "3_ornements_sculptes_developpes_300_mm_m",
                                                                                                                    nom = "3 ornements sculptés, développés 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 125.1,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "corniere_en_staff",
                                                                            nom = "Cornière en staff",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "2_faces_section_20x20_cm_fourniture_et_pose_m",
                                                                                                                    nom = "2 faces, section 20x20 cm, fourniture et pose\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 76.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_faces_section_30x30_cm_fourniture_et_pose_m",
                                                                                                                    nom = "2 faces, section 30x30 cm, fourniture et pose\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 97.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_faces_section_40x40_cm_fourniture_et_pose_m",
                                                                                                                    nom = "2 faces, section 40x40 cm, fourniture et pose\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 117,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "3_faces_section_20x20_cm_fourniture_et_pose_m",
                                                                                                                    nom = "3 faces, section 20x20 cm, fourniture et pose\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 95.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "3_faces_section_30x30_cm_fourniture_et_pose_m",
                                                                                                                    nom = "3 faces, section 30x30 cm, fourniture et pose\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 123.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "3_faces_section_40x40_cm_fourniture_et_pose_m",
                                                                                                                    nom = "3 faces, section 40x40 cm, fourniture et pose\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 151,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_section_importante_fourniture_et_pose_m",
                                                                                                                    nom = "pour section importante, fourniture et pose\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2138.18,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gaine_en_staff_pour_ventilation_ou_chauffage",
                                                                            nom = "Gaine en staff pour ventilation ou chauffage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_30x30_cm_fourniture_seule_m",
                                                                                                                    nom = "dimensions 30x30 cm, fourniture seule\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 81.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_40x30_cm_fourniture_seule_m",
                                                                                                                    nom = "dimensions 40x30 cm, fourniture seule\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 94.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_40x40_cm_fourniture_seule_m",
                                                                                                                    nom = "dimensions 40x40 cm, fourniture seule\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 108.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_50x20_cm_fourniture_seule_m",
                                                                                                                    nom = "dimensions 50x20 cm, fourniture seule\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 94.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_50x30_cm_fourniture_seule_m",
                                                                                                                    nom = "dimensions 50x30 cm, fourniture seule\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 108.19,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gorge_filet_plafond_et_mur_en_staff",
                                                                            nom = "Gorge filet plafond et mur en staff",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "developpe_150_a_200_mm_m",
                                                                                                                    nom = "développé 150 à 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 128.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpe_200_a_300_mm_m",
                                                                                                                    nom = "développé 200 à 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 142.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plafond_en_staff_lisse_pare_feu_avec_vermiculite_m",
                                                                                                                    nom = "Plafond en staff lisse, pare-feu avec vermiculite\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2103.15,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "rosace",
                                                                            nom = "Rosace",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_25_cm_fourniture_u",
                                                                                                                    nom = "moulage gélatine, diamètre 25 cm, fourniture\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 64.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_40_cm_fourniture_u",
                                                                                                                    nom = "moulage gélatine, diamètre 40 cm, fourniture\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 80.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_60_cm_fourniture_u",
                                                                                                                    nom = "moulage gélatine, diamètre 60 cm, fourniture\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 113.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_80_a_90_cm_fourniture_u",
                                                                                                                    nom = "moulage gélatine, diamètre 80 à 90 cm, fourniture\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 146.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_90_a_120_cm_fourniture_u",
                                                                                                                    nom = "moulage gélatine, diamètre 90 à 120 cm, fourniture\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 169.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_25_cm_fourniture_et_pose_u",
                                                                                                                    nom = "moulage gélatine, diamètre 25 cm, fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 107.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_40_cm_fourniture_et_pose_u",
                                                                                                                    nom = "moulage gélatine, diamètre 40 cm, fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 127.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_60_cm_fourniture_et_pose_u",
                                                                                                                    nom = "moulage gélatine, diamètre 60 cm, fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 164.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_80_a_90_cm_fourniture_et_pose_u",
                                                                                                                    nom = "moulage gélatine, diamètre 80 à 90 cm, fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 209.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_gelatine_diametre_90_a_120_cm_fourniture_et_pose_u",
                                                                                                                    nom = "moulage gélatine, diamètre 90 à 120 cm, fourniture et pose\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_platre_diametre_25_cm_fourniture_u",
                                                                                                                    nom = "moulage plâtre, diamètre 25 cm, fourniture\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 39.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_platre_diametre_40_cm_fourniture_u",
                                                                                                                    nom = "moulage plâtre, diamètre 40 cm, fourniture\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 51.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_platre_diametre_70_cm_fourniture_u",
                                                                                                                    nom = "moulage plâtre, diamètre 70 cm, fourniture\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 68.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moulage_platre_diametre_80_a_90_cm_fourniture_u",
                                                                                                                    nom = "moulage plâtre, diamètre 80 à 90 cm, fourniture\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 93.84,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "staff_lisse_en_plaque",
                                                                            nom = "Staff lisse en plaque",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "2_couches_ancrage_normal_compris_toutes_sujetions_m",
                                                                                                                    nom = "2 couches, ancrage normal, compris toutes sujétions\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2107.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_couches_a_laquer_m",
                                                                                                                    nom = "2 couches à laquer\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2109.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_ossature_primaire_et_secondaire_epaisseur_15_mm_m",
                                                                                                                    nom = "avec ossature primaire et secondaire, épaisseur 15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 295.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_ossature_primaire_et_secondaire_epaisseur_20_mm_m",
                                                                                                                    nom = "avec ossature primaire et secondaire, épaisseur 20 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2120.7,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "divers",
                    nom = "Divers",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "divers_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "balustrade_en_pierre_reconstituee",
                                                                            nom = "Balustrade en pierre reconstituée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_traditionnelles_de_main_courante_et_de_balustre_m",
                                                                                                                    nom = "dimensions traditionnelles de main courante et de balustre\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 340.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_traditionnelles_de_main_courante_et_de_balustre_en_rampant_m",
                                                                                                                    nom = "dimensions traditionnelles de main courante et de balustre en rampant\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 408.27,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "mosaique_granito",
                                                                            nom = "Mosaïque granito",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "grain_n_1_et_2_blanc_m",
                                                                                                                    nom = "grain N° 1 et 2 blanc\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2121.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grain_n_1_et_2_jaune_m",
                                                                                                                    nom = "grain N° 1 et 2 jaune\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2119.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grain_n_1_et_2_noir_m",
                                                                                                                    nom = "grain N° 1 et 2 noir\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2118.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grain_n_1_et_2_vert_m",
                                                                                                                    nom = "grain N° 1 et 2 vert\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2124.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grain_n_3_et_4_blanc_m",
                                                                                                                    nom = "grain N° 3 et 4 blanc\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2127.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grain_n_3_et_4_jaune_m",
                                                                                                                    nom = "grain N° 3 et 4 jaune\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2127.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grain_n_3_et_4_noir_m",
                                                                                                                    nom = "grain N° 3 et 4 noir\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2125.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grain_n_3_et_4_vert_m",
                                                                                                                    nom = "grain N° 3 et 4 vert\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2132.73,
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
