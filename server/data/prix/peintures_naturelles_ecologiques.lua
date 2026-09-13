local M = {}

M.metier = "Peintures naturelles et écologiques"
M.ICON = "images/icons/peintures_naturelles_ecologiques.png"

M.STRUCTURE = {
    id = "peintures_naturelles_et_ecologiques",
    nom = "Peintures naturelles et écologiques",
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
                                                                            id = "impression_et_fixateurs",
                                                                            nom = "Impression et fixateurs",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "impregnation_dure_pour_sol_en_bois_interieur_a_base_de_produits_naturels_m",
                                                                                                                    nom = "Imprégnation dure pour sol en bois intérieur à base de produits naturels\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "impregnation_preventive_speciale_m",
                                                                                                                    nom = "Imprégnation préventive spéciale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "impregnation_preventive_speciale_anti_uv_m",
                                                                                                                    nom = "Imprégnation préventive spéciale anti UV\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "impregnation_universelle_aux_plantes_m",
                                                                                                                    nom = "Imprégnation universelle aux plantes\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "primaire_d_accrochage_pour_enduit_type_tierraprim_m",
                                                                                                                    nom = "Primaire d'accrochage pour enduit type Tierraprim\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "primaire_laque_universelle_m",
                                                                                                                    nom = "Primaire laque universelle\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "primaire_en_phase_acqueuse_au_silicate_m",
                                                                                                                    nom = "Primaire en phase acqueuse au silicate\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fixateur_pour_enduits_naturels_type_tierrafix_m",
                                                                                                                    nom = "Fixateur pour enduits naturels type Tierrafix\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "primaire_special_sol_m",
                                                                                                                    nom = "Primaire spécial sol\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.42,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "peintures_mates",
                    nom = "Peintures mates",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "peintures_mates_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "peinture_a_la_caseine",
                                                                            nom = "Peinture à la caséine",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.75,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_a_la_caseine_en_projection",
                                                                            nom = "Peinture à la caséine en projection",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_murs_m",
                                                                                                                    nom = "sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plafonds_m",
                                                                                                                    nom = "en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.49,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_a_l_argile",
                                                                            nom = "Peinture à l'argile",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.97,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_a_l_argile_en_projection",
                                                                            nom = "Peinture à l'argile en projection",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_murs_m",
                                                                                                                    nom = "sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plafonds_m",
                                                                                                                    nom = "en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.71,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_type_dispersion_bio_blanche",
                                                                            nom = "Peinture type Dispersion Bio blanche",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.69,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_type_dispersion_bio_blanche_en_projection",
                                                                            nom = "Peinture type Dispersion Bio blanche en projection",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_murs_m",
                                                                                                                    nom = "sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plafonds_m",
                                                                                                                    nom = "en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.43,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_type_dispersion_bio_teintee",
                                                                            nom = "Peinture type Dispersion Bio teintée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.78,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_type_dispersion_bio_sablee",
                                                                            nom = "Peinture type Dispersion Bio sablée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.32,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_type_dispersion_bio_teintee_en_projection",
                                                                            nom = "Peinture type Dispersion Bio teintée en projection",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_murs_m",
                                                                                                                    nom = "sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plafonds_m",
                                                                                                                    nom = "en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.52,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_pour_facade_semi_minerale",
                                                                            nom = "Peinture pour façade semi-minérale",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_m",
                                                                                                                    nom = "couche intermédiaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_m",
                                                                                                                    nom = "couche de finition\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.84,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "peintures_satinees",
                    nom = "Peintures satinées",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "peintures_satinees_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "peinture_laque_blanche_effet_tendu",
                                                                            nom = "Peinture laque blanche, effet tendu",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.55,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_laque_blanche_en_projection",
                                                                            nom = "Peinture laque blanche en projection",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_murs_m",
                                                                                                                    nom = "sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plafonds_m",
                                                                                                                    nom = "en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.48,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "peintures_brillantes",
                    nom = "Peintures brillantes",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "peintures_brillantes_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "peinture_laque_blanche_brillante_effet_tendu",
                                                                            nom = "Peinture laque blanche brillante, effet tendu",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.55,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_laque_blanche_brillante_en_projection",
                                                                            nom = "Peinture laque blanche brillante en projection",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_murs_m",
                                                                                                                    nom = "sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plafonds_m",
                                                                                                                    nom = "en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.24,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "peintures_bois",
                    nom = "Peintures bois",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "peintures_bois_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "peinture_bois_a_l_huile_de_lin_blanche",
                                                                            nom = "Peinture bois à l'huile de lin blanche",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "surface_plane_m",
                                                                                                                    nom = "surface plane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_sous_face_m",
                                                                                                                    nom = "en sous-face\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.85,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_bois_a_l_huile_de_lin_teintee",
                                                                            nom = "Peinture bois à l'huile de lin teintée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "surface_plane_m",
                                                                                                                    nom = "surface plane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_sous_face_m",
                                                                                                                    nom = "en sous-face\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.12,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "peinture_antique_mate_blanche",
                                                                            nom = "Peinture antique mate blanche",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "surface_plane_m",
                                                                                                                    nom = "surface plane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_sous_face_m",
                                                                                                                    nom = "en sous-face\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.35,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "enduits",
                    nom = "Enduits",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "enduits_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "enduit_interieur_a_la_chaux",
                                                                            nom = "Enduit intérieur à la chaux",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "grain_fin_1_mm_m",
                                                                                                                    nom = "grain fin 1 mm,\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grain_moyen_1_5_mm_m",
                                                                                                                    nom = "grain moyen 1,5 mm,\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.36,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enduit_de_finition",
                                                                            nom = "Enduit de finition",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "enduit_decoratif_blanc_a_l_ancienne_m",
                                                                                                                    nom = "enduit décoratif blanc à l'ancienne\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "enduit_de_lissage_et_de_rebouchage_m",
                                                                                                                    nom = "Enduit de lissage et de rebouchage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.25,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "huiles_et_cires",
                    nom = "Huiles et cires",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "huiles_et_cires_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "liant_pour_glacis",
                                                                            nom = "Liant pour glacis",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_enduit_m",
                                                                                                                    nom = "sur enduit\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_peinture_m",
                                                                                                                    nom = "sur peinture\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "cire_creme_durcissante",
                                                                            nom = "Cire crème durcissante",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_boiserie_m",
                                                                                                                    nom = "sur boiserie\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_terres_cuites_non_vernissees_m",
                                                                                                                    nom = "sur terres cuites non vernissées\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.95,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "huile_cire_incolore",
                                                                            nom = "Huile cire incolore",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_boiserie_m",
                                                                                                                    nom = "sur boiserie\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_terres_cuites_non_vernissees_m",
                                                                                                                    nom = "sur terres cuites non vernissées\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.49,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "huile_cire_blanche",
                                                                            nom = "Huile cire blanche",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_boiserie_m",
                                                                                                                    nom = "sur boiserie\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_terres_cuites_non_vernissees_m",
                                                                                                                    nom = "sur terres cuites non vernissées\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "cire_patine_liquide_a_la_cire_d_abeille_m",
                                                                                                                    nom = "Cire patine liquide à la cire d'abeille\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.51,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "huile_de_lin",
                                                                            nom = "Huile de lin",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_boiserie_m",
                                                                                                                    nom = "sur boiserie\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_terres_cuites_non_vernissees_m",
                                                                                                                    nom = "sur terres cuites non vernissées\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.12,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "huile_dure",
                                                                            nom = "Huile dure",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_boiserie_m",
                                                                                                                    nom = "sur boiserie\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_terres_cuites_non_vernissees_m",
                                                                                                                    nom = "sur terres cuites non vernissées\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "huile_protectrice_pour_bois_exterieur_interieur_m",
                                                                                                                    nom = "Huile protectrice pour bois extérieur-intérieur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lait_cire_pour_sol_m",
                                                                                                                    nom = "Lait cire pour sol\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.83,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "lasures_pour_bois",
                    nom = "Lasures pour bois",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "lasures_pour_bois_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "lasure_d_impregnation_teintee",
                                                                            nom = "Lasure d'imprégnation teintée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_porte_isoplane_m",
                                                                                                                    nom = "couche intermédiaire, sur porte isoplane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_chassis_m",
                                                                                                                    nom = "couche intermédiaire, sur châssis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_croisee_m",
                                                                                                                    nom = "couche intermédiaire, sur croisée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_porte_mouluree_m",
                                                                                                                    nom = "couche intermédiaire, sur porte moulurée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_persienne_m",
                                                                                                                    nom = "couche intermédiaire, sur persienne\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_volet_m",
                                                                                                                    nom = "couche intermédiaire, sur volet\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_chassis_m",
                                                                                                                    nom = "couche de finition, sur châssis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_croisee_m",
                                                                                                                    nom = "couche de finition, sur croisée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_porte_isoplane_m",
                                                                                                                    nom = "couche de finition, sur porte isoplane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_porte_mouluree_m",
                                                                                                                    nom = "couche de finition, sur porte moulurée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_persienne_m",
                                                                                                                    nom = "couche de finition, sur persienne\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_volet_m",
                                                                                                                    nom = "couche de finition, sur volet\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.52,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lasure_incolore_interieure_a_l_huile",
                                                                            nom = "Lasure incolore intérieure à l'huile",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_porte_isoplane_m",
                                                                                                                    nom = "couche intermédiaire, sur porte isoplane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_porte_mouluree_m",
                                                                                                                    nom = "couche intermédiaire, sur porte moulurée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_porte_isoplane_m",
                                                                                                                    nom = "couche de finition, sur porte isoplane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_porte_mouluree_m",
                                                                                                                    nom = "couche de finition, sur porte moulurée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lasure_incolore_interieure_a_l_eau",
                                                                            nom = "Lasure incolore intérieure à l'eau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_murs_m",
                                                                                                                    nom = "couche intermédiaire, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_en_plafonds_m",
                                                                                                                    nom = "couche intermédiaire, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_porte_isoplane_m",
                                                                                                                    nom = "couche intermédiaire, sur porte isoplane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_intermediaire_sur_porte_mouluree_m",
                                                                                                                    nom = "couche intermédiaire, sur porte moulurée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_murs_m",
                                                                                                                    nom = "couche de finition, sur murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_en_plafonds_m",
                                                                                                                    nom = "couche de finition, en plafonds\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_porte_isoplane_m",
                                                                                                                    nom = "couche de finition, sur porte isoplane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couche_de_finition_sur_porte_mouluree_m",
                                                                                                                    nom = "couche de finition, sur porte moulurée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.53,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lasure_incolore_exterieure_anti_uv",
                                                                            nom = "Lasure incolore extérieure anti UV",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "surface_plane_m",
                                                                                                                    nom = "surface plane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_sous_face_m",
                                                                                                                    nom = "en sous-face\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "vernis",
                    nom = "Vernis",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "vernis_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "vernis_vitrificateur_brillant_pour_plancher",
                                                                            nom = "Vernis vitrificateur brillant pour plancher",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "vernis_vitrificateur_brillant_pour_plancher_impression_m",
                                                                                                                    nom = "vernis vitrificateur brillant pour plancher, impression\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vernis_vitrificateur_brillant_pour_plancher_la_couche_m",
                                                                                                                    nom = "vernis vitrificateur brillant pour plancher, la couche\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vitrificateur_pour_brillant_plancher_finition_m",
                                                                                                                    nom = "vitrificateur pour brillant plancher, finition\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.89,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "vernis_vitrificateur_satine_pour_plancher",
                                                                            nom = "Vernis vitrificateur satiné pour plancher",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "vernis_vitrificateur_satine_pour_plancher_impression_m",
                                                                                                                    nom = "vernis vitrificateur satiné pour plancher, impression\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vernis_vitrificateur_satine_pour_plancher_la_couche_m",
                                                                                                                    nom = "vernis vitrificateur satiné pour plancher, la couche\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vitrificateur_pour_satine_plancher_finition_m",
                                                                                                                    nom = "vitrificateur pour satiné plancher, finition\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 218.04,
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
