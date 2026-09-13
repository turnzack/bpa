local M = {}

M.metier = "Plâtrerie"
M.ICON = "images/icons/platrerie.png"

M.STRUCTURE = {
    id = "platrerie",
    nom = "Plâtrerie",
    type = "LOT",
    children = {
        {
                    id = "enduit_platre_sur_parois_verticales",
                    nom = "Enduit plâtre sur parois verticales",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "enduit_platre_sur_parois_verticales_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "enduit_au_platre",
                                                                            nom = "Enduit au plâtre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_murs_en_agglomeres_de_ciment_brut_dans_le_neuf_m",
                                                                                                                    nom = "sur murs en agglomérés de ciment brut <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 220.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_murs_en_brique_dans_le_neuf_m",
                                                                                                                    nom = "sur murs en brique <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 220.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_parois_dressees_au_mortier_dans_le_neuf_m",
                                                                                                                    nom = "sur parois dressées au mortier <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_cloison_en_briques_1_face_dans_le_neuf_m",
                                                                                                                    nom = "sur cloison en briques, 1 face <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_cloison_en_briques_2_faces_dans_le_neuf_m",
                                                                                                                    nom = "sur cloison en briques, 2 faces <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_murs_en_agglomeres_de_ciment_brut_dans_l_ancien_m",
                                                                                                                    nom = "sur murs en agglomérés de ciment brut <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_murs_en_brique_dans_l_ancien_m",
                                                                                                                    nom = "sur murs en brique <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_parois_dressees_au_mortier_dans_l_ancien_m",
                                                                                                                    nom = "sur parois dressées au mortier <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_cloison_en_briques_1_face_dans_l_ancien_m",
                                                                                                                    nom = "sur cloison en briques, 1 face <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_cloison_en_briques_2_faces_dans_l_ancien_m",
                                                                                                                    nom = "sur cloison en briques, 2 faces <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "platre_type_ours_blanc",
                                                                            nom = "Plâtre type Ours blanc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_ours_blanc_sur_cloison_brique_dans_le_neuf_m",
                                                                                                                    nom = "type Ours blanc sur cloison brique <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ours_blanc_sur_enduit_mortier_dans_le_neuf_m",
                                                                                                                    nom = "type Ours blanc sur enduit mortier <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ours_blanc_dresse_sur_reperes_dans_le_neuf_m",
                                                                                                                    nom = "type Ours blanc, dressé sur repères <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ours_blanc_paroi_brute_dans_le_neuf_m",
                                                                                                                    nom = "type Ours blanc, paroi brute <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ours_blanc_sur_cloison_brique_dans_l_ancien_m",
                                                                                                                    nom = "type Ours blanc sur cloison brique <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ours_blanc_sur_enduit_mortier_dans_l_ancien_m",
                                                                                                                    nom = "type Ours blanc sur enduit mortier <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ours_blanc_dresse_sur_reperes_dans_l_ancien_m",
                                                                                                                    nom = "type Ours blanc, dressé sur repères <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ours_blanc_paroi_brute_dans_l_ancien_m",
                                                                                                                    nom = "type Ours blanc, paroi brute <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.35,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "platre_type_plafer",
                                                                            nom = "Plâtre type Plafer",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_plafer_sur_cloison_brique_dans_le_neuf_m",
                                                                                                                    nom = "type Plafer sur cloison brique <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_plafer_sur_enduit_mortier_dans_le_neuf_m",
                                                                                                                    nom = "type Plafer sur enduit mortier <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_plafer_sur_paroi_brute_dans_le_neuf_m",
                                                                                                                    nom = "type Plafer sur paroi brute <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 220.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_plafer_sur_cloison_brique_dans_l_ancien_m",
                                                                                                                    nom = "type Plafer sur cloison brique <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_plafer_sur_enduit_mortier_dans_l_ancien_m",
                                                                                                                    nom = "type Plafer sur enduit mortier <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_plafer_sur_paroi_brute_dans_l_ancien_m",
                                                                                                                    nom = "type Plafer sur paroi brute <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.09,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plus_value_pour_platre_ordinaire_dresse_sur_reperes",
                                                                            nom = "Plus value pour plâtre ordinaire dressé sur repères",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.79,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plus_value_platre_pour_petites_surfaces",
                                                                            nom = "Plus value plâtre pour petites surfaces",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.87,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "hachement_d_enduit_existant_et_platre_pour_reparation",
                                                                            nom = "Hachement d'enduit existant et plâtre pour réparation",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_dans_l_ancien_m",
                                                                                                                    nom = "sur mur <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_mur_petite_surface_dans_l_ancien_m",
                                                                                                                    nom = "sur mur, petite surface <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plafond_petite_surface_dans_l_ancien_m",
                                                                                                                    nom = "sur plafond, petite surface <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.14,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_au_platre_decoratif",
                                                                            nom = "Enduit au plâtre décoratif",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_phr_mouchete_dans_le_neuf_m",
                                                                                                                    nom = "type PHR moucheté <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_phr_provencal_dans_le_neuf_m",
                                                                                                                    nom = "type PHR provençal <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_phr_mouchete_dans_l_ancien_m",
                                                                                                                    nom = "type PHR moucheté <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_phr_provencal_dans_l_ancien_m",
                                                                                                                    nom = "type PHR provençal <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.52,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_sur_parois_de_cage_d_escalier",
                                                                            nom = "Enduit sur parois de cage d'escalier",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "escalier_droit_dans_le_neuf_m",
                                                                                                                    nom = "escalier droit <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "escalier_balance_dans_le_neuf_m",
                                                                                                                    nom = "escalier balancé <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "escalier_droit_dans_l_ancien_m",
                                                                                                                    nom = "escalier droit <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "escalier_balance_dans_l_ancien_m",
                                                                                                                    nom = "escalier balancé <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.15,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrete_a_angle_vif",
                                                                            nom = "Arrête à angle vif",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_paroi_verticale_dans_le_neuf_m",
                                                                                                                    nom = "sur paroi verticale <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_paroi_verticale_dans_l_ancien_m",
                                                                                                                    nom = "sur paroi verticale <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.95,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrete_a_angle_vif_compris_baguette_d_angle_metallique",
                                                                            nom = "Arrête à angle vif compris baguette d'angle métallique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_u",
                                                                                                                    nom = "<dans le neuf>\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_u",
                                                                                                                    nom = "<dans l'ancien>\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.95,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_a_joint",
                                                                            nom = "Bande à joint",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_en_plaques_de_platre_m",
                                                                                                                    nom = "sur mur en plaques de plâtre\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plafond_en_plaques_de_platre_m",
                                                                                                                    nom = "sur plafond en plaques de plâtre\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_arete_d_angle_m",
                                                                                                                    nom = "pour arête d'angle\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fibre_polyamide_m",
                                                                                                                    nom = "en fibre polyamide\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.47,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "enduit_platre_sur_plafonds",
                    nom = "Enduit plâtre sur plafonds",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "enduit_platre_sur_plafonds_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "enduit_platre_sur_support_metallique_type_nergalto_non_compris",
                                                                            nom = "Enduit plâtre sur support métallique type Nergalto non compris",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "plafond_sans_nergalto_dans_le_neuf_m",
                                                                                                                    nom = "plafond sans Nergalto <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plafond_sans_nergalto_dans_l_ancien_m",
                                                                                                                    nom = "plafond sans Nergalto <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 229.67,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_platre_sur_support_metallique_type_nergalto_compris_fourniture",
                                                                            nom = "Enduit plâtre sur support métallique type Nergalto compris fourniture",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_platre_sur_support_metallique_type_nergalto_compris_fourniture_et_chevrons",
                                                                            nom = "Enduit plâtre sur support métallique type Nergalto compris fourniture et chevrons",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 265.47,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_platre_sous_plancher_brut",
                                                                            nom = "Enduit plâtre sous plancher brut",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_plancher_a_entrevous_beton_dans_le_neuf_m",
                                                                                                                    nom = "sur plancher à entrevous béton <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plancher_a_entrevous_beton_ceramique_dans_le_neuf_m",
                                                                                                                    nom = "sur plancher à entrevous béton céramique <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plancher_a_entrevous_beton_dans_l_ancien_m",
                                                                                                                    nom = "sur plancher à entrevous béton <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 226.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plancher_a_entrevous_beton_ceramique_dans_l_ancien_m",
                                                                                                                    nom = "sur plancher à entrevous béton céramique <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 226.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hachement_d_enduit_et_enduit_platre_sur_lattis_conserve_m",
                                                                                                                    nom = "Hachement d'enduit et enduit plâtre sur lattis conservé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 283.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "demolition_lattis_et_pose_d_un_nergalto_avec_platre_ancien_m",
                                                                                                                    nom = "Démolition lattis et pose d'un Nergalto avec plâtre, ancien\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.55,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_perfoplaque",
                                                                            nom = "Plafond perfoplaque",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "avec_enduit_platre_dans_le_neuf_m",
                                                                                                                    nom = "avec enduit plâtre <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_enduit_platre_dans_l_ancien_m",
                                                                                                                    nom = "avec enduit plâtre <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 273.47,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_platre_sur_plafond_fibralith",
                                                                            nom = "Enduit plâtre sur plafond fibralith",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.52,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_realise_en_plafonnettes",
                                                                            nom = "Plafond réalisé en plafonnettes",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_salusse_avec_enduit_platre_en_partie_horizontale_dans_le_neuf_m",
                                                                                                                    nom = "type Salusse avec enduit plâtre en partie horizontale <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_salusse_avec_enduit_platre_en_partie_horizontale_et_rampante_dans_le_neuf_m",
                                                                                                                    nom = "type Salusse avec enduit plâtre en partie horizontale et rampante <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 281.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_salusse_avec_enduit_platre_en_partie_horizontale_dans_l_ancien_m",
                                                                                                                    nom = "type Salusse avec enduit plâtre en partie horizontale <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 281.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_salusse_avec_enduit_platre_en_partie_horizontale_et_rampante_dans_l_ancien_m",
                                                                                                                    nom = "type Salusse avec enduit plâtre en partie horizontale et rampante <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 295.13,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "habillage_type_fibralith_avec_enduit_platre_sur_petites_surfaces",
                                                                            nom = "Habillage type fibralith avec enduit plâtre sur petites surfaces",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.92,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plus_value_pour_execution_sur_hauteur_superieure_a_3_00_m",
                                                                            nom = "Plus value pour exécution sur hauteur supérieure à 3,00 m",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.03,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_platre_sur_plafond_de_cage_d_escalier",
                                                                            nom = "Enduit plâtre sur plafond de cage d'escalier",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "plafond_cage_escalier_dans_le_neuf_m",
                                                                                                                    nom = "plafond cage escalier <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 229.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plafond_cage_escalier_dans_l_ancien_m",
                                                                                                                    nom = "plafond cage escalier <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.58,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_sur_plafond_type_voutins",
                                                                            nom = "Enduit sur plafond type Voutins",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 235.62,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_sur_voutes",
                                                                            nom = "Enduit sur voûtes",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.79,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "facon_de_gorge_ronde",
                                                                            nom = "Façon de gorge ronde",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "diametre_80_mm_dans_le_neuf_m",
                                                                                                                    nom = "diamètre 80 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_talon_diametre_150_mm_dans_le_neuf_m",
                                                                                                                    nom = "avec talon, diamètre 150 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_80_mm_dans_l_ancien_m",
                                                                                                                    nom = "diamètre 80 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_talon_diametre_150_mm_dans_l_ancien_m",
                                                                                                                    nom = "avec talon, diamètre 150 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.84,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "raccord_de_platre_sur_huisserie",
                                                                            nom = "Raccord de plâtre sur huisserie",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "platre_projete",
                    nom = "Plâtre projeté",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "platre_projete_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "platre_projete_pour_interieur",
                                                                            nom = "Plâtre projeté pour intérieur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pf200_sur_mur_brique_ou_agglo_m",
                                                                                                                    nom = "PF200 sur mur brique ou agglo\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 235.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pf600_sur_beton_lisse_m",
                                                                                                                    nom = "PF600 sur béton lisse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pf200_sur_plafond_hourdis_m",
                                                                                                                    nom = "PF200 sur plafond hourdis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pf200_sur_plafond_nergalto_m",
                                                                                                                    nom = "PF200 sur plafond Nergalto\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pf600_sur_mur_brique_ou_agglo_m",
                                                                                                                    nom = "PF600 sur mur brique ou agglo\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pf600_sous_dalle_beton_m",
                                                                                                                    nom = "PF600 sous dalle béton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pf600_sur_plafond_hourdis_m",
                                                                                                                    nom = "PF600 sur plafond hourdis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pf600_sur_plafond_nergalto_m",
                                                                                                                    nom = "PF600 sur plafond Nergalto\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ppm_1_sur_mur_brique_ou_agglo_m",
                                                                                                                    nom = "PPM 1 sur mur brique ou agglo\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ppm1_sur_beton_lisse_m",
                                                                                                                    nom = "PPM1 sur béton lisse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ppm1_sous_dalle_beton_m",
                                                                                                                    nom = "PPM1 sous dalle béton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ppm1_sur_plafond_hourdis_m",
                                                                                                                    nom = "PPM1 sur plafond hourdis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ppm1_sur_plafond_nergalto_m",
                                                                                                                    nom = "PPM1 sur plafond Nergalto\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ppm3_sur_mur_brique_ou_agglo_m",
                                                                                                                    nom = "PPM3 sur mur brique ou agglo\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ppm3_sur_plafond_hourdis_m",
                                                                                                                    nom = "PPM3 sur plafond hourdis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ppm3_sur_plafond_nergalto_m",
                                                                                                                    nom = "PPM3 sur plafond Nergalto\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 226.19,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "platre_projete_pour_exterieur",
                                                                            nom = "Plâtre projeté pour extérieur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_pf_exterieur_horizontal_m",
                                                                                                                    nom = "type PF extérieur horizontal\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_pf_exterieur_vertical_m",
                                                                                                                    nom = "type PF extérieur vertical\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.31,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "faux_plafonds",
                    nom = "Faux plafonds",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "faux_plafonds_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                        }
                    }
                },
        {
                    id = "plafond_ossature_bois",
                    nom = "Plafond ossature bois",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plafond_ossature_bois_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "plafond_en_plaques_de_gypse_et_cellulose_type_fermacell",
                                                                            nom = "Plafond en plaques de gypse et cellulose type Fermacell",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "hydrofuge_h2o_12_5_mm_avec_ossature_bois_dans_l_ancien_m",
                                                                                                                    nom = "hydrofuge H2O, 12,5 mm, avec ossature bois <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hydrofuge_h2o_12_5_mm_avec_ossature_bois_dans_le_neuf_m",
                                                                                                                    nom = "hydrofuge H2O, 12,5 mm, avec ossature bois <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 259.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hydrofuge_h2o_12_5_mm_dans_l_ancien_m",
                                                                                                                    nom = "hydrofuge H2O, 12,5 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 242.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hydrofuge_h2o_12_5_mm_dans_le_neuf_m",
                                                                                                                    nom = "hydrofuge H2O, 12,5 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "haute_densite_hd_15_mm_avec_ossature_bois_dans_l_ancien_m",
                                                                                                                    nom = "haute densité HD, 15 mm, avec ossature bois <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 256.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "haute_densite_hd_15_mm_avec_ossature_bois_dans_le_neuf_m",
                                                                                                                    nom = "haute densité HD, 15 mm, avec ossature bois <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "haute_densite_hd_15_mm_dans_l_ancien_m",
                                                                                                                    nom = "haute densité HD, 15 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 235.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "haute_densite_hd_15_mm_dans_le_neuf_m",
                                                                                                                    nom = "haute densité HD, 15 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "standard_12_5_mm_avec_ossature_bois_dans_l_ancien_m",
                                                                                                                    nom = "standard, 12,5 mm, avec ossature bois <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "standard_12_5_mm_avec_ossature_bois_dans_le_neuf_m",
                                                                                                                    nom = "standard, 12,5 mm, avec ossature bois <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "standard_12_5_mm_dans_l_ancien_m",
                                                                                                                    nom = "standard, 12,5 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 229.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "standard_12_5_mm_dans_le_neuf_m",
                                                                                                                    nom = "standard, 12,5 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_en_plaques_de_platre_type_placoplatre",
                                                                            nom = "Plafond en plaques de plâtre type placoplâtre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "ba_13_dans_le_neuf_m",
                                                                                                                    nom = "BA 13 <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_dans_l_ancien_m",
                                                                                                                    nom = "BA 13 <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_avec_ossature_bois_dans_le_neuf_m",
                                                                                                                    nom = "BA 13, avec ossature bois <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_avec_ossature_bois_dans_l_ancien_m",
                                                                                                                    nom = "BA 13, avec ossature bois <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_joints_app_avec_ossature_bois_dans_le_neuf_m",
                                                                                                                    nom = "BA 13, joints app avec ossature bois <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_joints_app_avec_ossature_bois_dans_l_ancien_m",
                                                                                                                    nom = "BA 13, joints app avec ossature bois <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_dans_le_neuf_m",
                                                                                                                    nom = "BA 15 <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_dans_l_ancien_m",
                                                                                                                    nom = "BA 15 <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_avec_ossature_bois_dans_le_neuf_m",
                                                                                                                    nom = "BA 15, avec ossature bois <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_avec_ossature_bois_dans_l_ancien_m",
                                                                                                                    nom = "BA 15, avec ossature bois <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_joints_app_avec_ossature_bois_dans_le_neuf_m",
                                                                                                                    nom = "BA 15, joints app avec ossature bois <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_joints_app_avec_ossature_bois_dans_l_ancien_m",
                                                                                                                    nom = "BA 15, joints app avec ossature bois <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 242.76,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_sous_rampant_en_plaques_de_platre_type_placoplatre",
                                                                            nom = "Plafond sous rampant en plaques de plâtre type placoplâtre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "ba_10_dans_le_neuf_m",
                                                                                                                    nom = "BA 10 <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_dans_le_neuf_m",
                                                                                                                    nom = "BA 13 <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_dans_le_neuf_m",
                                                                                                                    nom = "BA 15 <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_10_dans_l_ancien_m",
                                                                                                                    nom = "BA 10 <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_dans_l_ancien_m",
                                                                                                                    nom = "BA 13 <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_dans_l_ancien_m",
                                                                                                                    nom = "BA 15 <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 226.97,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plafond_ossature_metallique_type_placostil",
                    nom = "Plafond ossature métallique type Placostil",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plafond_ossature_metallique_type_placostil_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "plafond_sous_rampant_en_plaques_de_gypse_et_cellulose_ossature_metallique",
                                                                            nom = "Plafond sous rampant en plaques de gypse et cellulose ossature métallique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "fermacell_standard_profile_type_f530_m",
                                                                                                                    nom = "Fermacell standard, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fermacell_hd_haute_densite_profile_type_f530_m",
                                                                                                                    nom = "Fermacell HD haute densité, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fermacell_h2o_hydrofuge_profile_type_f530_m",
                                                                                                                    nom = "Fermacell H2O hydrofuge, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 268.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_fermacell_standard_profile_type_f530_m",
                                                                                                                    nom = "double peau, Fermacell standard, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 273.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_fermacell_hd_haute_densite_profile_type_f530_m",
                                                                                                                    nom = "double peau, Fermacell HD haute densité, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 286.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_fermacell_h2o_hydrofuge_profile_type_f530_m",
                                                                                                                    nom = "double peau, Fermacell H2O hydrofuge, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 299.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_en_plaques_de_platre_type_placostil",
                                                                            nom = "Plafond en plaques de plâtre type Placostil",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "ba_13_profile_f530_m",
                                                                                                                    nom = "BA 13, profilé F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_profile_f530_m",
                                                                                                                    nom = "BA 15, profilé F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_profile_f530_m",
                                                                                                                    nom = "BA 18, profilé F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_profile_f530_avec_plaque_type_horizon_m",
                                                                                                                    nom = "BA 13, profilé F530, avec plaque type Horizon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profile_f530_m",
                                                                                                                    nom = "double peau BA 13, profilé F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profile_f530_avec_plaque_type_horizon_m",
                                                                                                                    nom = "double peau BA 13, profilé F530, avec plaque type Horizon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_profile_48_mm_simple_m",
                                                                                                                    nom = "BA 13, profilé 48 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 245.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_profile_48_mm_double_m",
                                                                                                                    nom = "BA 13, profilé 48 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 256.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_profile_70_mm_simple_m",
                                                                                                                    nom = "BA 13, profilé 70 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 251.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_profile_70_mm_double_m",
                                                                                                                    nom = "BA 13, profilé 70 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_profile_90_mm_simple_m",
                                                                                                                    nom = "BA 13, profilé 90 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_profile_90_mm_double_m",
                                                                                                                    nom = "BA 13, profilé 90 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 268.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_profile_48_mm_simple_m",
                                                                                                                    nom = "BA 15, profilé 48 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 247.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_profile_48_mm_double_m",
                                                                                                                    nom = "BA 15, profilé 48 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_profile_70_mm_simple_m",
                                                                                                                    nom = "BA 15, profilé 70 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_profile_70_mm_double_m",
                                                                                                                    nom = "BA 15, profilé 70 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 268.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_profile_90_mm_simple_m",
                                                                                                                    nom = "BA 15, profilé 90 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_profile_90_mm_double_m",
                                                                                                                    nom = "BA 15, profilé 90 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 276.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_profile_48_mm_simple_m",
                                                                                                                    nom = "BA 18, profilé 48 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 257.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_profile_48_mm_double_m",
                                                                                                                    nom = "BA 18, profilé 48 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 265.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_profile_70_mm_simple_m",
                                                                                                                    nom = "BA 18, profilé 70 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_profile_70_mm_double_m",
                                                                                                                    nom = "BA 18, profilé 70 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 274.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_profile_90_mm_simple_m",
                                                                                                                    nom = "BA 18, profilé 90 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_profile_90_mm_double_m",
                                                                                                                    nom = "BA 18, profilé 90 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 280.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profile_48_mm_simple_m",
                                                                                                                    nom = "double peau BA 13, profilé 48 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 270.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profile_48_mm_double_m",
                                                                                                                    nom = "double peau BA 13, profilé 48 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 279.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profile_70_mm_simple_m",
                                                                                                                    nom = "double peau BA 13, profilé 70 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 277.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profile_70_mm_double_m",
                                                                                                                    nom = "double peau BA 13, profilé 70 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 288.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profile_90_mm_simple_m",
                                                                                                                    nom = "double peau BA 13, profilé 90 mm simple\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 283.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profile_90_mm_double_m",
                                                                                                                    nom = "double peau BA 13, profilé 90 mm double\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2100.66,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_sous_rampant_en_plaques_de_platre_type_placostil",
                                                                            nom = "Plafond sous rampant en plaques de plâtre type Placostil",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profile_type_f530_m",
                                                                                                                    nom = "double peau BA 13, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_profile_type_f530_m",
                                                                                                                    nom = "BA 18, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_profile_type_f530_m",
                                                                                                                    nom = "BA 15, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 251.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_profile_type_f530_m",
                                                                                                                    nom = "BA 13, profilé type F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.44,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_en_plaques_de_platre_type_placostil_special_feu",
                                                                            nom = "Plafond en plaques de plâtre type Placostil spécial feu",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "ba_13_m1_profile_prf_530_m",
                                                                                                                    nom = "BA 13 M1, profilé PRF 530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 271.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_m0_profile_prf_530_m",
                                                                                                                    nom = "BA 13 M0, profilé PRF 530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 273.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_m0_profile_prf_530_m",
                                                                                                                    nom = "BA 15 M0, profilé PRF 530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 279.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_m0_profile_prf_530_m",
                                                                                                                    nom = "BA 18 M0, profilé PRF 530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 286.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_m0_profile_prf_530_m",
                                                                                                                    nom = "double peau BA 13 M0, profilé PRF 530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 295.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_m0_profiles_stil_prim_100_et_stil_prf_530_m",
                                                                                                                    nom = "BA 18 M0, profilés Stil PRIM 100 et Stil PRF 530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2115.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_m0_profiles_stil_prim_100_et_stil_prf_530_m",
                                                                                                                    nom = "BA 15 M0, profilés Stil PRIM 100 et Stil PRF 530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2108.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_m0_profiles_stil_prim_100_et_stil_prf_530_m",
                                                                                                                    nom = "BA 13 M0, profilés Stil PRIM 100 et Stil PRF 530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2102.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_m1_profiles_stil_prim_100_et_stil_prf_530_m",
                                                                                                                    nom = "BA 13 M1, profilés Stil PRIM 100 et Stil PRF 530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2100.53,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_en_plaques_de_ciment_armees_d_un_treillis_de_fibres_de_verre",
                                                                            nom = "Plafond en plaques de ciment armées d'un treillis de fibres de verre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_ossature_metallique_type_aquapanel_indoor_m",
                                                                                                                    nom = "sur ossature métallique type Aquapanel Indoor\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 287.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_ossature_metallique_type_aquapanel_outdoor_m",
                                                                                                                    nom = "sur ossature métallique type Aquapanel Outdoor\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 290,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_en_plaques_de_platre_type_placostil_prim",
                                                                            nom = "Plafond en plaques de plâtre type Placostil PRIM",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "rail_prim_100_en_peripherie_m",
                                                                                                                    nom = "rail PRIM 100 en périphérie\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_13_profiles_stil_prim_et_stil_f530_m",
                                                                                                                    nom = "BA 13, profilés Stil PRIM et Stil F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 286.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_15_profiles_stil_prim_et_stil_f530_m",
                                                                                                                    nom = "BA 15, profilés Stil PRIM et Stil F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 287.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ba_18_profiles_stil_prim_et_stil_f530_m",
                                                                                                                    nom = "BA 18, profilés Stil PRIM et Stil F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 291.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_profiles_stil_prim_et_stil_f530_m",
                                                                                                                    nom = "double peau BA 13, profilés Stil PRIM et Stil F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2100.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "triple_peau_ba_13_profiles_stil_prim_et_stil_f530_m",
                                                                                                                    nom = "triple peau BA 13, profilés Stil PRIM et Stil F530\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2113.41,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_en_plaques_de_platre_longue_portee_type_megastil",
                                                                            nom = "Plafond en plaques de plâtre longue portée type Mégastil",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "simple_peau_ba_13_ossatures_primaire_et_secondaire_type_megastil_m",
                                                                                                                    nom = "simple peau BA 13, ossatures primaire et secondaire type Mégastil\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 260.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "simple_peau_ba_13_hydrofuge_ossatures_primaire_et_secondaire_m",
                                                                                                                    nom = "simple peau BA 13 hydrofuge, ossatures primaire et secondaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "simple_peau_ba_13_m1_phonique_ossatures_primaire_et_secondaire_m",
                                                                                                                    nom = "simple peau BA 13 M1 phonique, ossatures primaire et secondaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 268.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "simple_peau_ba_13_m0_ossatures_primaire_et_secondaire_m",
                                                                                                                    nom = "simple peau BA 13 M0, ossatures primaire et secondaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 271.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_ossatures_primaire_et_secondaire_m",
                                                                                                                    nom = "double peau BA 13, ossatures primaire et secondaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 272.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_hydrofuge_ossatures_primaire_et_secondaire_m",
                                                                                                                    nom = "double peau BA 13 hydrofuge, ossatures primaire et secondaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 285.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_m1_phonique_ossatures_primaire_et_secondaire_m",
                                                                                                                    nom = "double peau BA 13 M1 phonique, ossatures primaire et secondaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 288.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_m0_ossatures_primaire_et_secondaire_m",
                                                                                                                    nom = "double peau BA 13 M0, ossatures primaire et secondaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 292.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_m0_poutre_treillis_m",
                                                                                                                    nom = "double peau BA 13 M0, poutre treillis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2131.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_m1_phonique_poutre_treillis_m",
                                                                                                                    nom = "double peau BA 13 M1 phonique, poutre treillis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2126.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_hydrofuge_poutre_treillis_m",
                                                                                                                    nom = "double peau BA 13 hydrofuge, poutre treillis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2123.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_peau_ba_13_poutre_treillis_m",
                                                                                                                    nom = "double peau BA 13, poutre treillis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2110.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "simple_peau_ba_13_m0_poutre_treillis_m",
                                                                                                                    nom = "simple peau BA 13 M0, poutre treillis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2109.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "simple_peau_ba_13_m1_phonique_poutre_treillis_m",
                                                                                                                    nom = "simple peau BA 13 M1 phonique, poutre treillis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2107.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "simple_peau_ba_13_hydrofuge_poutre_treillis_m",
                                                                                                                    nom = "simple peau BA 13 hydrofuge, poutre treillis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2105.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "simple_peau_ba_13_poutre_treillis_m",
                                                                                                                    nom = "simple peau BA 13, poutre treillis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 298.98,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plafond_demontable_dalles_a_bords_droits",
                    nom = "Plafond démontable, dalles à bords droits",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plafond_demontable_dalles_a_bords_droits_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "plafond_suspendu_en_panneaux_dalles_a_bords_droits_hygiene",
                                                                            nom = "Plafond suspendu en panneaux, dalles à bords droits, hygiène",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_bioguard_plain_board_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Bioguard Plain Board, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 268.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_bioguard_plain_board_dimensions_1200x600x15_mm_m",
                                                                                                                    nom = "type Bioguard Plain Board, dimensions 1200x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_hygiene_board_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Hygiène Board, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 274.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_hygiene_board_dimensions_1200x600x15_mm_m",
                                                                                                                    nom = "type Hygiène Board, dimensions 1200x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 273.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_hydroclean_dimensions_600x600x20_mm_m",
                                                                                                                    nom = "type Hydroclean, dimensions 600x600x20 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 280.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_hydroclean_dimensions_1200x600x20_mm_m",
                                                                                                                    nom = "type Hydroclean, dimensions 1200x600x20 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 276.87,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_suspendu_en_panneaux_dalles_a_bords_droits_resistant",
                                                                            nom = "Plafond suspendu en panneaux, dalles à bords droits, résistant",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_armatuff_dimensions_600x600_mm_m",
                                                                                                                    nom = "type Armatuff, dimensions 600x600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 276.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_armatuff_dimensions_1200x600_mm_m",
                                                                                                                    nom = "type Armatuff, dimensions 1200x600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 273.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_boxer_dimensions_600x600x15_mm_resistant_aux_chocs_m",
                                                                                                                    nom = "type Boxer, dimensions 600x600x15 mm, résistant aux chocs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_boxer_dimensions_1200x600x15_mm_resistant_aux_chocs_m",
                                                                                                                    nom = "type Boxer, dimensions 1200x600x15 mm, résistant aux chocs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 257.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ceramaguard_dimensions_600x600x15_mm_resistant_a_l_humidite_m",
                                                                                                                    nom = "type Ceramaguard, dimensions 600x600x15 mm, résistant à l'humidité\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 290,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ceramaguard_dimensions_1200x600x15_mm_resistant_a_l_humidite_m",
                                                                                                                    nom = "type Ceramaguard, dimensions 1200x600x15 mm, résistant à l'humidité\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 286.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minaboard_dune_90_rh_dimensions_1200x600x15_mm_resistant_a_l_humidite_m",
                                                                                                                    nom = "type Minaboard Dune 90 RH, dimensions 1200x600x15 mm, résistant à l'humidité\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 265.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minaboard_fine_fissured_90_rm_dimensions_1200x600x15_mm_resistant_a_l_humidite_m",
                                                                                                                    nom = "type Minaboard Fine Fissured 90 RM, dimensions 1200x600x15 mm, résistant à l'humidité\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_masterfill_dimensions_1200x600x6_mm_resistant_a_l_humidite_m",
                                                                                                                    nom = "type Masterfill, dimensions 1200x600x6 mm, résistant à l'humidité\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 271.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_newtone_dimensions_1200x600x6_mm_resistant_a_l_humidite_m",
                                                                                                                    nom = "type Newtone, dimensions 1200x600x6 mm, résistant à l'humidité\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_suspendu_en_panneaux_dalles_a_bords_droits_acoustique",
                                                                            nom = "Plafond suspendu en panneaux, dalles à bords droits, acoustique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_ultima_db_board_600x600_mm_dalles_a_bords_droits_dans_le_neuf_m",
                                                                                                                    nom = "type Ultima dB Board 600x600 mm, dalles à bords droits <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ultima_db_board_600x600_mm_dalles_a_bords_droits_dans_l_ancien_m",
                                                                                                                    nom = "type Ultima dB Board 600x600 mm, dalles à bords droits <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 265.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_krios_db_40_board_600x600_mm_dalles_a_bords_droits_m",
                                                                                                                    nom = "type Krios dB 40 Board 600x600 mm, dalles à bords droits\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_krios_db_40_board_1200x600_mm_dalles_a_bords_droits_m",
                                                                                                                    nom = "type Krios dB 40 Board 1200x600 mm, dalles à bords droits\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_sonar_db_44_board_600x600_mm_dalles_a_bords_droits_m",
                                                                                                                    nom = "type Sonar dB 44 Board 600x600 mm, dalles à bords droits\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 278.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_sonar_db_44_board_1200x600_mm_dalles_a_bords_droits_m",
                                                                                                                    nom = "type Sonar dB 44 Board 1200x600 mm, dalles à bords droits\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 275.27,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_suspendu_en_panneaux_dalles_a_bords_droits",
                                                                            nom = "Plafond suspendu en panneaux, dalles à bords droits",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "panneau_600x600_mm_dalles_a_bords_droits_dans_le_neuf_m",
                                                                                                                    nom = "panneau 600x600 mm, dalles à bords droits, <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "panneau_600x600_mm_dalles_a_bords_droits_dans_l_ancien_m",
                                                                                                                    nom = "panneau 600x600 mm, dalles à bords droits, <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "panneau_1200x600_mm_dalles_a_bords_droits_dans_le_neuf_m",
                                                                                                                    nom = "panneau 1200x600 mm, dalles à bords droits, <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "panneau_1200x600_mm_dalles_a_bords_droits_dans_l_ancien_m",
                                                                                                                    nom = "panneau 1200x600 mm, dalles à bords droits, <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 251.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_industriel_dimensions_600x600_mm_m",
                                                                                                                    nom = "type industriel, dimensions 600x600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_industriel_dimensions_1200x600_mm_m",
                                                                                                                    nom = "type industriel, dimensions 1200x600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_krios_a_dimensions_600x600x20_mm_m",
                                                                                                                    nom = "type Krios A, dimensions 600x600x20 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_krios_a_dimensions_1200x600x20_mm_m",
                                                                                                                    nom = "type Krios A, dimensions 1200x600x20 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minaboard_tatra_cortega_dimensions_1200x600x15_mm_m",
                                                                                                                    nom = "type Minaboard Tatra-Cortega, dimensions 1200x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minaboard_adria_classic_dimensions_1200x600x15_mm_m",
                                                                                                                    nom = "type Minaboard Adria-Classic, dimensions 1200x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_perla_board_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Perla Board, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_perla_board_dimensions_1200x600x15_mm_m",
                                                                                                                    nom = "type Perla Board, dimensions 1200x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 257.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minaboard_dune_dimensions_1200x600x15_mm_m",
                                                                                                                    nom = "type Minaboard Dune, dimensions 1200x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ml_board_plain_dimensions_1200x600x15_mm_m",
                                                                                                                    nom = "type ML Board Plain, dimensions 1200x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ml_board_classic_dimensions_1200x600x15_mm_m",
                                                                                                                    nom = "type ML Board classic, dimensions 1200x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.03,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plafond_demontable_dalles_a_bords_feuillures",
                    nom = "Plafond démontable, dalles à bords feuillurés",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plafond_demontable_dalles_a_bords_feuillures_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "plafond_suspendu_en_panneaux_dalles_a_bords_feuillures_hygiene",
                                                                            nom = "Plafond suspendu en panneaux, dalles à bords feuillurés, hygiène",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_bioguard_plain_microlook_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Bioguard Plain Microlook, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 266.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_bioguard_plain_tegular_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Bioguard Plain Tégular, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_newtone_dimensions_600x600x6_mm_resistant_a_l_humidite_m",
                                                                                                                    nom = "type Newtone, dimensions 600x600x6 mm, résistant à l'humidité\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 279.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_masterfill_de_dimensions_600x600x6_mm_resistant_a_l_humidite_m",
                                                                                                                    nom = "type Masterfill, de dimensions 600x600x6 mm, résistant à l'humidité\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 278.6,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_suspendu_en_panneaux_dalles_a_bords_feuillures_acoustique",
                                                                            nom = "Plafond suspendu en panneaux, dalles à bords feuillurés, acoustique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_bioguard_acoustic_microlook_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Bioguard acoustic Microlook, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 271.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_bioguard_acoustic_tegular_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Bioguard acoustic Tegular, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 270.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_travertone_tegular_mosaic_dimensions_300x300_mm_m",
                                                                                                                    nom = "type Travertone Tegular Mosaic, dimensions 300x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 295.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_travertone_tegular_highspire_dimensions_300x300_mm_m",
                                                                                                                    nom = "type Travertone Tegular Highspire, dimensions 300x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 299.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_sonar_db_44_dimensions_1200x600_mm_m",
                                                                                                                    nom = "type Sonar dB 44, dimensions 1200x600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 288.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_sonar_db_44_dimensions_1200x300_mm_m",
                                                                                                                    nom = "type Sonar dB 44, dimensions 1200x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 288.83,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_suspendu_en_panneaux_dalles_a_bords_feuillures",
                                                                            nom = "Plafond suspendu en panneaux, dalles à bords feuillurés",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "panneau_600x600_mm_a_bords_feuillures_dans_le_neuf_m",
                                                                                                                    nom = "panneau 600x600 mm, à bords feuillurés, <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 265.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "panneau_600x600_mm_a_bords_feuillures_dans_l_ancien_m",
                                                                                                                    nom = "panneau 600x600 mm, à bords feuillurés,<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 272.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "panneau_1200x600_mm_a_bords_feuillures_dans_le_neuf_m",
                                                                                                                    nom = "panneau 1200x600 mm, à bords feuillurés, <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 273.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "panneau_1200x600_mm_a_bords_feuillures_dans_l_ancien_m",
                                                                                                                    nom = "panneau 1200x600 mm, à bords feuillurés, <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 279.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalle_300x300_mm_ossature_microlook_be_dans_le_neuf_m",
                                                                                                                    nom = "dalle 300x300 mm, ossature Microlook BE <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalle_300x300_mm_ossature_microlook_be_dans_l_ancien_m",
                                                                                                                    nom = "dalle 300x300 mm, ossature Microlook BE <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 273.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minatone_tegular_tatra_cortega_dimensions_1200x600x15_mm_m",
                                                                                                                    nom = "type Minatone Tegular Tatra-Cortega, dimensions 1200x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_secondlook_cortega_i_dimensions_1200x600x17_mm_m",
                                                                                                                    nom = "type Secondlook Cortega I, dimensions 1200x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_secondlook_cortega_iii_blanc_dimensions_1200x600x17_mm_m",
                                                                                                                    nom = "type Secondlook Cortega III, blanc, dimensions 1200x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_secondlook_cortega_iii_couleur_dimensions_1200x600x17_mm_m",
                                                                                                                    nom = "type Secondlook Cortega III, couleur, dimensions 1200x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 257.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_secondlook_cortega_iv_dimensions_1200x600x17_mm_m",
                                                                                                                    nom = "type Secondlook Cortega IV, dimensions 1200x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_secondlook_sanserra_i_dimensions_1200x600x17_mm_m",
                                                                                                                    nom = "type Secondlook Sanserra I, dimensions 1200x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 276.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_secondlook_sanserra_iii_dimensions_1200x600x17_mm_m",
                                                                                                                    nom = "type Secondlook Sanserra III, dimensions 1200x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 279.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_secondlook_sanserra_iv_dimensions_1200x600x17_mm_m",
                                                                                                                    nom = "type Secondlook Sanserra IV, dimensions 1200x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 280.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minatone_tegular_adria_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Minatone Tegular Adria, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 260.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minatone_tegular_diane_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Minatone Tegular Diane, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minatone_tegular_cirrus_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Minatone Tegular Cirrus, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_travertone_tegular_finesse_dimensions_600x600x17_mm_m",
                                                                                                                    nom = "type Travertone Tegular Finesse, dimensions 600x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 275.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_travertone_tegular_fissure_dimensions_600x600x17_mm_m",
                                                                                                                    nom = "type Travertone Tegular Fissuré, dimensions 600x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 273.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_travertone_tegular_galaxie_dimensions_600x600x17_mm_m",
                                                                                                                    nom = "type Travertone Tegular Galaxie, dimensions 600x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 280.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_travertone_tegular_highspire_sanserra_dimensions_600x600x17_mm_m",
                                                                                                                    nom = "type Travertone Tegular Highspire-Sanserra, dimensions 600x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 289.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_softlook_classic_dimensions_600x600x19_mm_dalles_retenues_de_tissus_m",
                                                                                                                    nom = "type Softlook Classic, dimensions 600x600x19 mm, dalles retenues de tissus\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2155.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_softlook_encore_dimensions_600x600x19_mm_dalles_retenues_de_tissus_m",
                                                                                                                    nom = "type Softlook Encore, dimensions 600x600x19 mm, dalles retenues de tissus\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2180.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_microlook_cortega_blanc_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Microlook Cortega blanc, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_microlook_dune_blanc_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Microlook Dune blanc, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_microlook_dune_couleur_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Microlook Dune couleur, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 265.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_microlook_sektor_segment_labyrinth_blanc_dimensions_600x600x15_mm_m",
                                                                                                                    nom = "type Microlook Sektor-Segment-Labyrinth blanc, dimensions 600x600x15 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_microlook_sanserra_blanc_dimensions_600x600x17_mm_m",
                                                                                                                    nom = "type Microlook Sanserra blanc, dimensions 600x600x17 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 294,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plafond_demontable_dalles_ossature_invisible",
                    nom = "Plafond démontable, dalles ossature invisible",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plafond_demontable_dalles_ossature_invisible_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "plafond_suspendu_en_panneaux",
                                                                            nom = "Plafond suspendu en panneaux",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dalle_600x600_mm_ossature_cache_dans_le_neuf_m",
                                                                                                                    nom = "dalle 600x600 mm, ossature caché, <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 262.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalle_600x600_mm_ossature_cache_dans_l_ancien_m",
                                                                                                                    nom = "dalle 600x600 mm, ossature caché, <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_kryos_d_dimensions_600x600_mm_ossature_cache_m",
                                                                                                                    nom = "type Kryos D dimensions 600x600 mm, ossature caché\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_kryos_d_dimensions_900x900_mm_ossature_cache_m",
                                                                                                                    nom = "type Kryos D dimensions 900x900 mm, ossature caché\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minatone_k4c4_fissured_dimensions_300x300_mm_m",
                                                                                                                    nom = "type Minatone K4C4 Fissured, dimensions 300x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 266.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_minatone_k4c4_adria_dimensions_300x300_mm_m",
                                                                                                                    nom = "type Minatone K4C4 Adria, dimensions 300x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_travertone_k4c4_galaxie_dimensions_300x300_mm_m",
                                                                                                                    nom = "type Travertone K4C4 Galaxie, dimensions 300x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 297.03,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plafond_suspendu_en_panneaux_acoustique",
                                                                            nom = "Plafond suspendu en panneaux acoustique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_krios_db_40_board_1200x600_mm_ossature_cache_m",
                                                                                                                    nom = "type Krios dB 40 Board 1200x600 mm, ossature caché\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 270.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_krios_db_40_board_600x600_mm_ossature_cache_m",
                                                                                                                    nom = "type Krios dB 40 Board 600x600 mm, ossature caché\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 271.02,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plafond_suspendu_metallique",
                    nom = "Plafond suspendu métallique",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plafond_suspendu_metallique_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "plafond_suspendu_metallique",
                                                                            nom = "Plafond suspendu métallique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_luxalon_84r_84b_en_acier_dimension_1000x1000_mm_m",
                                                                                                                    nom = "type Luxalon 84R-84B, en acier, dimension 1000x1000 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2126.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_luxalon_80b_miroir_en_aluminium_dimension_1000x1000_mm_m",
                                                                                                                    nom = "type Luxalon 80B miroir, en aluminium, dimension 1000x1000 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2182.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_luxalon_80b_exterieur_en_aluminium_dimension_1000x1000_mm_m",
                                                                                                                    nom = "type Luxalon 80B extérieur, en aluminium, dimension 1000x1000 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2122.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_luxalon_vertical_v_100_en_aluminium_dimension_1000x1000_mm_m",
                                                                                                                    nom = "type Luxalon vertical V-100, en aluminium, dimension 1000x1000 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2114.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_luxalon_vertical_v_200_en_aluminium_dimension_1000x1000_mm_m",
                                                                                                                    nom = "type Luxalon vertical V-200, en aluminium, dimension 1000x1000 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2158.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_luxalon_grille_a_chants_en_aluminium_dimensions_1000x1000_mm_m",
                                                                                                                    nom = "type Luxalon grille à chants, en aluminium, dimensions 1000x1000 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2134.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "matelas_de_feutre_noir_largeur_500_mm_m",
                                                                                                                    nom = "matelas de feutre noir, largeur 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.62,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plafond_suspendu_en_staff",
                    nom = "Plafond suspendu en staff",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plafond_suspendu_en_staff_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "plafond_suspendu_en_staff",
                                                                            nom = "Plafond suspendu en staff",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "2_couches_sans_charpentage_dans_le_neuf_m",
                                                                                                                    nom = "2 couches sans charpentage <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 283.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_vermiculite_sans_charpentage_dans_le_neuf_m",
                                                                                                                    nom = "avec vermiculite sans charpentage <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 285.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "2_couches_sans_charpentage_dans_l_ancien_m",
                                                                                                                    nom = "2 couches sans charpentage <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 288.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_vermiculite_sans_charpentage_dans_l_ancien_m",
                                                                                                                    nom = "avec vermiculite sans charpentage <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 291.27,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gorge_en_staff_developpe",
                                                                            nom = "Gorge en staff développé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "150_a_200_mm_dans_le_neuf_m",
                                                                                                                    nom = "150 à 200 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 42.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "200_a_300_mm_dans_le_neuf_m",
                                                                                                                    nom = "200 à 300 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 46.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "150_a_200_mm_dans_l_ancien_m",
                                                                                                                    nom = "150 à 200 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 46.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "200_a_300_mm_dans_l_ancien_m",
                                                                                                                    nom = "200 à 300 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 50.88,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gorge_en_plastique_polyester",
                                                                            nom = "Gorge en plastique polyester",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gaine_d_aeration_en_staff",
                                                                            nom = "Gaine d'aération en staff",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "300x300_mm_dans_le_neuf_m",
                                                                                                                    nom = "300x300 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 111.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "300x400_mm_dans_le_neuf_m",
                                                                                                                    nom = "300x400 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 121.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "400x400_mm_dans_le_neuf_m",
                                                                                                                    nom = "400x400 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 146.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "500x200_mm_dans_le_neuf_m",
                                                                                                                    nom = "500x200 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 117.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "500x300_mm_dans_le_neuf_m",
                                                                                                                    nom = "500x300 mm <dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 145.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "300x300_mm_dans_l_ancien_m",
                                                                                                                    nom = "300x300 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 115.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "300x400_mm_dans_l_ancien_m",
                                                                                                                    nom = "300x400 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 125.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "400x400_mm_dans_l_ancien_m",
                                                                                                                    nom = "400x400 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 150,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "500x200_mm_dans_l_ancien_m",
                                                                                                                    nom = "500x200 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 121.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "500x300_mm_dans_l_ancien_m",
                                                                                                                    nom = "500x300 mm <dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 149.71,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plafond_suspendu_lames_bois",
                    nom = "Plafond suspendu lames bois",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plafond_suspendu_lames_bois_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "faux_plafond_lames_bois",
                                                                            nom = "Faux-plafond lames bois",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "frises_en_pin_1er_choix_sans_noeuds_a_vernir_m",
                                                                                                                    nom = "frises en pin 1er choix, sans noeuds, à vernir\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2161.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "frises_en_pin_2e_choix_sans_noeuds_a_vernir_m",
                                                                                                                    nom = "frises en pin 2e choix, sans noeuds, à vernir\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2160.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "frises_en_pin_3e_choix_sans_noeuds_a_vernir_m",
                                                                                                                    nom = "frises en pin 3e choix, sans noeuds, à vernir\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2159.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "frises_en_pin_4e_choix_declasse_a_peindre_m",
                                                                                                                    nom = "frises en pin 4e choix, déclassé, à peindre\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2152.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_bois_rouge_essence_niangon_ou_kotibe_m",
                                                                                                                    nom = "en bois rouge (essence niangon ou kotibe)\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2158.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_chataignier_m",
                                                                                                                    nom = "en châtaignier\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2152.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_chene_m",
                                                                                                                    nom = "en chêne\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2217.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_contreplaque_okoume_epaisseur_8_mm_m",
                                                                                                                    nom = "en contreplaqué okoumé, épaisseur 8 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2102.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_novolam_hydrofuge_blanc_epaisseur_19_mm_m",
                                                                                                                    nom = "type Novolam hydrofuge blanc, épaisseur 19 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2105.28,
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
