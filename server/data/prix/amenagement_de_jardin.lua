local M = {}

M.metier = "Aménagement de jardin"
M.ICON = "images/icons/amenagement_de_jardin.png"

M.STRUCTURE = {
    id = "amenagement_de_jardin",
    nom = "Aménagement de jardin",
    type = "LOT",
    children = {
        {
                    id = "terrassement",
                    nom = "Terrassement",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "terrassement_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "fouille_pleine_masse",
                                                                            nom = "Fouille pleine masse",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_terre_vegetale_m",
                                                                                                                    nom = "en terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 320.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_argileuse_et_tuf_m",
                                                                                                                    nom = "en terre argileuse et tuf\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 334.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_glaise_m",
                                                                                                                    nom = "en glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 341.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terrain_dur_avec_compresseur_m",
                                                                                                                    nom = "en terrain dur, avec compresseur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 395.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_roche_avec_compresseur_m",
                                                                                                                    nom = "en roche, avec compresseur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3181.84,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "fouille_en_tranchee",
                                                                            nom = "Fouille en tranchée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_terre_vegetale_m",
                                                                                                                    nom = "en terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 328.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_argileuse_ou_tuf_m",
                                                                                                                    nom = "en terre argileuse ou tuf\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 341.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_glaise_m",
                                                                                                                    nom = "en terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 256.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terrain_dur_avec_compresseur_m",
                                                                                                                    nom = "en terrain dur, avec compresseur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3131.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_de_la_roche_avec_compresseur_m",
                                                                                                                    nom = "en de la roche, avec compresseur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3236.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "jet_de_pelle_horizontal",
                                                                            nom = "Jet de pelle horizontal",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_m",
                                                                                                                    nom = "de terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_m",
                                                                                                                    nom = "de terre argileuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 310.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 315.12,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "jet_sur_berge",
                                                                            nom = "Jet sur berge",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_m",
                                                                                                                    nom = "de terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 314.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_m",
                                                                                                                    nom = "de terre argileuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 319.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 326.1,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "jet_sur_banquette",
                                                                            nom = "Jet sur banquette",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_m",
                                                                                                                    nom = "de terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 317.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_m",
                                                                                                                    nom = "de terre argileuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 321.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 330.22,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "chargement_en_brouette",
                                                                            nom = "Chargement en brouette",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_sable_ou_terreau_m",
                                                                                                                    nom = "de terre végétale, sable ou terreau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 317.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_ou_cailloux_m",
                                                                                                                    nom = "de terre argileuse ou cailloux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 321.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 331.6,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "chargement_en_seau",
                                                                            nom = "Chargement en seau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_sable_ou_terreau_m",
                                                                                                                    nom = "de terre végétale, sable ou terreau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 324.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_ou_cailloux_m",
                                                                                                                    nom = "de terre argileuse ou cailloux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 327.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 338.47,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "chargement_en_sac",
                                                                            nom = "Chargement en sac",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_sable_ou_terreau_m",
                                                                                                                    nom = "de terre végétale, sable ou terreau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 337.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_ou_cailloux_m",
                                                                                                                    nom = "de terre argileuse ou cailloux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 341.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 357.7,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "transport_en_brouette",
                                                                            nom = "Transport en brouette",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_sable_ou_terreau_m",
                                                                                                                    nom = "de terre végétale, sable ou terreau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 315.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_ou_cailloux_m",
                                                                                                                    nom = "de terre argileuse ou cailloux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 316.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 325.42,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "transport_au_seau_en_sac_ou_a_la_hotte",
                                                                            nom = "Transport au seau, en sac ou à la hotte",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_sable_ou_terreau_m",
                                                                                                                    nom = "de terre végétale, sable ou terreau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 317.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_ou_cailloux_m",
                                                                                                                    nom = "de terre argileuse ou cailloux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 325.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 327.48,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "transport_par_camion",
                                                                            nom = "Transport par camion",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_5_km_m",
                                                                                                                    nom = "à 5 km\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 320.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_5_a_10_km_m",
                                                                                                                    nom = "de 5 à 10 km\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 329.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_value_par_km_supplementaire_u",
                                                                                                                    nom = "plus value par km supplémentaire\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.95,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "montage_de_terre",
                                                                            nom = "Montage de terre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_sable_ou_terreau_m",
                                                                                                                    nom = "de terre végétale, sable ou terreau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 346.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_ou_cailloux_m",
                                                                                                                    nom = "de terre argileuse ou cailloux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 350.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 354.96,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "descente_de_terre",
                                                                            nom = "Descente de terre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_sable_ou_terreau_m",
                                                                                                                    nom = "de terre végétale, sable ou terreau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 334.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_argileuse_ou_cailloux_m",
                                                                                                                    nom = "de terre argileuse ou cailloux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 341.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 338.47,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "remblai",
                                                                            nom = "Remblai",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_argileuse_ou_cailloux_m",
                                                                                                                    nom = "de terre argileuse ou cailloux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 317.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_glaise_m",
                                                                                                                    nom = "de terre glaise\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 319.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_vegetale_sable_ou_terreau_m",
                                                                                                                    nom = "de terre végétale, sable ou terreau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 313.18,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "nouveau_modifiez_moi_u",
                    nom = "!! Nouveau - modifiez moi !!\tU",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "nouveau_modifiez_moi_u_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "pilonnage",
                                                                            nom = "Pilonnage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_tranchee_ou_en_trou_m",
                                                                                                                    nom = "en tranchée ou en trou\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 34.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_tranchee_ou_en_trou_avec_immersion_m",
                                                                                                                    nom = "en tranchée ou en trou avec immersion\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 34.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_talus_m",
                                                                                                                    nom = "en talus\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 317.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "reglage_m",
                                                                                                                    nom = "Réglage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 312.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "curage_et_mise_en_tas_m",
                                                                                                                    nom = "Curage et mise en tas\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3120.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "triage_a_l_anneau_m",
                                                                                                                    nom = "Triage à l'anneau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 365.95,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "passage_a_la_claie",
                                                                            nom = "Passage à la claie",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_cailloux_0_02_sable_gravier_ou_detritus_m",
                                                                                                                    nom = "de cailloux 0,02, sable, gravier ou détritus\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 327.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_sable_argileux_m",
                                                                                                                    nom = "de sable argileux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 343.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_argile_pure_m",
                                                                                                                    nom = "d'argile pure\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 374.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_vegetale_ou_terreau_m",
                                                                                                                    nom = "de terre végétale ou terreau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 332.97,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "emmetrage",
                                                                            nom = "Emmétrage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terre_vegetale_terreau_sable_ou_cailloux_m",
                                                                                                                    nom = "de terre végétale, terreau, sable ou cailloux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 310.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_de_bruyere_ou_fumier_m",
                                                                                                                    nom = "de terre de bruyère ou fumier\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 319.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_pierre_non_cassee_m",
                                                                                                                    nom = "de pierre non cassée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 321.99,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "cassage_a_l_anneau",
                                                                            nom = "Cassage à l'anneau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_pierre_demi_dure_anneau_de_120_a_150_mm_m",
                                                                                                                    nom = "de pierre demi-dure, anneau de 120 à 150 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 352.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_pierre_dure_anneau_de_120_a_150_mm_m",
                                                                                                                    nom = "de pierre dure, anneau de 120 à 150 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 376.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_pierre_dure_anneau_de_80_mm_m",
                                                                                                                    nom = "de pierre dure, anneau de 80 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3115.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_pierre_demi_dure_anneau_de_80_mm_m",
                                                                                                                    nom = "de pierre demi-dure, anneau de 80 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 390.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_pierre_demi_dure_anneau_de_50_mm_m",
                                                                                                                    nom = "de pierre demi-dure, anneau de 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3101.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_pierre_dure_anneau_de_50_mm_m",
                                                                                                                    nom = "de pierre dure, anneau de 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3140.14,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "corrois",
                                                                            nom = "Corrois",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "par_couches_100_mm_compris_roulage_m",
                                                                                                                    nom = "par couches 100 mm, compris roulage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3247.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_couches_200_mm_compris_roulage_m",
                                                                                                                    nom = "par couches 200 mm, compris roulage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3219.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_couches_100_mm_compris_roulage_soigne_m",
                                                                                                                    nom = "par couches 100 mm, compris roulage soigné\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3274.8,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "fouille_en_macadam",
                                                                            nom = "Fouille en macadam",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_une_epaisseur_de_10_cm_m",
                                                                                                                    nom = "pour une épaisseur de 10 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_centimetre_supplementaire_jusqu_a_25_cm_m",
                                                                                                                    nom = "par centimètre supplémentaire, jusqu'à 25 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fouille_en_bitume_et_rangement_deblai_m",
                                                                                                                    nom = "Fouille en bitume et rangement déblai\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.25,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "fouille_forme_beton",
                                                                            nom = "Fouille forme béton",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_une_epaisseur_de_10_cm_m",
                                                                                                                    nom = "pour une épaisseur de 10 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_centimetre_supplementaire_m",
                                                                                                                    nom = "par centimètre supplémentaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.39,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "fouille_en_tranchee_au_metre",
                                                                            nom = "Fouille en tranchée au mètre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "section_600x500_mm_m",
                                                                                                                    nom = "section 600x500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_tranche_de_10_cm_supplementaires_m",
                                                                                                                    nom = "par tranche de 10 cm supplémentaires\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.42,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "enrochement",
                                                                            nom = "Enrochement",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_roches_massives_au_m3_m",
                                                                                                                    nom = "en roches massives, au m3\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3110.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_roches_massives_a_la_tonne_u",
                                                                                                                    nom = "en roches massives, à la tonne\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 109.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "galet_de_riviere_diametre_80_150_mm_la_tonne_u",
                                                                                                                    nom = "galet de rivière, diamètre 80/150 mm, la tonne\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 156.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "granit_diametre_500_900_mm_la_tonne_u",
                                                                                                                    nom = "granit, diamètre 500/900 mm, la tonne\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "gres_quartzite_diametre_500_900_mm_la_tonne_u",
                                                                                                                    nom = "grès quartzite, diamètre 500/900 mm, la tonne\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 156.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pierre_calcaire_diametre_500_900_mm_la_tonne_u",
                                                                                                                    nom = "pierre calcaire, diamètre 500/900 mm, la tonne\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 126.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "porphyre_diametre_500_900_mm_la_tonne_u",
                                                                                                                    nom = "porphyre, diamètre 500/900 mm, la tonne\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 141.33,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gabion",
                                                                            nom = "Gabion",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "d_ardoise_dimensions_500x500x500_mm_u",
                                                                                                                    nom = "d'ardoise, dimensions 500x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 67.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_ardoise_dimensions_1000x300x750_mm_u",
                                                                                                                    nom = "d'ardoise, dimensions 1000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 95.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_ardoise_dimensions_1000x500x500_mm_u",
                                                                                                                    nom = "d'ardoise, dimensions 1000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 100.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_ardoise_dimensions_1000x500x1000_mm_u",
                                                                                                                    nom = "d'ardoise, dimensions 1000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 138.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_ardoise_dimensions_2000x300x750_mm_u",
                                                                                                                    nom = "d'ardoise, dimensions 2000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 145.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_ardoise_dimensions_2000x500x500_mm_u",
                                                                                                                    nom = "d'ardoise, dimensions 2000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 153.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_ardoise_dimensions_2000x500x1000_mm_u",
                                                                                                                    nom = "d'ardoise, dimensions 2000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_ardoise_dimensions_2000x750x750_mm_u",
                                                                                                                    nom = "d'ardoise, dimensions 2000x750x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 333.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_ardoise_dimensions_2000x1000x1000_mm_u",
                                                                                                                    nom = "d'ardoise, dimensions 2000x1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 539.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_galet_dimensions_500x500x500_mm_u",
                                                                                                                    nom = "de galet, dimensions 500x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_galet_dimensions_1000x300x750_mm_u",
                                                                                                                    nom = "de galet, dimensions 1000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 86.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_galet_dimensions_1000x500x500_mm_u",
                                                                                                                    nom = "de galet, dimensions 1000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 89.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_galet_dimensions_1000x500x1000_mm_u",
                                                                                                                    nom = "de galet, dimensions 1000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 117.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_galet_dimensions_2000x300x750_mm_u",
                                                                                                                    nom = "de galet, dimensions 2000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 127.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_galet_dimensions_2000x500x500_mm_u",
                                                                                                                    nom = "de galet, dimensions 2000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 133.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_galet_dimensions_2000x500x1000_mm_u",
                                                                                                                    nom = "de galet, dimensions 2000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 197.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_galet_dimensions_2000x750x750_mm_u",
                                                                                                                    nom = "de galet, dimensions 2000x750x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_galet_dimensions_2000x1000x1000_mm_u",
                                                                                                                    nom = "de galet, dimensions 2000x1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 325.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_gres_quartzite_dimensions_500x500x500_mm_u",
                                                                                                                    nom = "de grès quartzite, dimensions 500x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 67.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_gres_quartzite_dimensions_1000x300x750_mm_u",
                                                                                                                    nom = "de grès quartzite, dimensions 1000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 75.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_gres_quartzite_dimensions_1000x500x500_mm_u",
                                                                                                                    nom = "de grès quartzite, dimensions 1000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 92.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_gres_quartzite_dimensions_1000x500x1000_mm_u",
                                                                                                                    nom = "de grès quartzite, dimensions 1000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 126.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_gres_quartzite_dimensions_2000x300x750_mm_u",
                                                                                                                    nom = "de grès quartzite, dimensions 2000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 131.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_gres_quartzite_dimensions_2000x500x500_mm_u",
                                                                                                                    nom = "de grès quartzite, dimensions 2000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 137.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_gres_quartzite_dimensions_2000x500x1000_mm_u",
                                                                                                                    nom = "de grès quartzite, dimensions 2000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 206.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_gres_quartzite_dimensions_2000x750x750_mm_u",
                                                                                                                    nom = "de grès quartzite, dimensions 2000x750x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_gres_quartzite_dimensions_2000x1000x1000_mm_u",
                                                                                                                    nom = "de grès quartzite, dimensions 2000x1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 343.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porphyre_dimensions_500x500x500_mm_u",
                                                                                                                    nom = "de porphyre, dimensions 500x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 67.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porphyre_dimensions_1000x300x750_mm_u",
                                                                                                                    nom = "de porphyre, dimensions 1000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 95.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porphyre_dimensions_1000x500x500_mm_u",
                                                                                                                    nom = "de porphyre, dimensions 1000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 100.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porphyre_dimensions_1000x500x1000_mm_u",
                                                                                                                    nom = "de porphyre, dimensions 1000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 142.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porphyre_dimensions_2000x300x750_mm_u",
                                                                                                                    nom = "de porphyre, dimensions 2000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 145.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porphyre_dimensions_2000x500x500_mm_u",
                                                                                                                    nom = "de porphyre, dimensions 2000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 153.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porphyre_dimensions_2000x500x1000_mm_u",
                                                                                                                    nom = "de porphyre, dimensions 2000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porphyre_dimensions_2000x750x750_mm_u",
                                                                                                                    nom = "de porphyre, dimensions 2000x750x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porphyre_dimensions_2000x1000x1000_mm_u",
                                                                                                                    nom = "de porphyre, dimensions 2000x1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 375.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_roches_calcaires_dimensions_500x500x500_mm_u",
                                                                                                                    nom = "de roches calcaires, dimensions 500x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 67.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_roches_calcaires_dimensions_1000x300x750_mm_u",
                                                                                                                    nom = "de roches calcaires, dimensions 1000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 95.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_roches_calcaires_dimensions_1000x500x500_mm_u",
                                                                                                                    nom = "de roches calcaires, dimensions 1000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 100.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_roches_calcaires_dimensions_1000x500x1000_mm_u",
                                                                                                                    nom = "de roches calcaires, dimensions 1000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 142.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_roches_calcaires_dimensions_2000x300x750_mm_u",
                                                                                                                    nom = "de roches calcaires, dimensions 2000x300x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 145.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_roches_calcaires_dimensions_2000x500x500_mm_u",
                                                                                                                    nom = "de roches calcaires, dimensions 2000x500x500 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 153.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_roches_calcaires_dimensions_2000x500x1000_mm_u",
                                                                                                                    nom = "de roches calcaires, dimensions 2000x500x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 238.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_roches_calcaires_dimensions_2000x750x750_mm_u",
                                                                                                                    nom = "de roches calcaires, dimensions 2000x750x750 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 259.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_roches_calcaires_dimensions_2000x1000x1000_mm_u",
                                                                                                                    nom = "de roches calcaires, dimensions 2000x1000x1000 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 406.9,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "emmarchement",
                    nom = "Emmarchement",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "emmarchement_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                        }
                    }
                },
        {
                    id = "marche_bloc_en_calcaire_bleu",
                    nom = "Marche bloc en calcaire bleu",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "marche_bloc_en_calcaire_bleu_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "marche_bloc_en_gres_rouges",
                                                                            nom = "Marche bloc en grès rouges",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_1000x380x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimensions 1000x380x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 160.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1000x380x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimensions 1000x380x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 156.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1200x380x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimensions 1200x380x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 186.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1200x380x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimensions 1200x380x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 181.99,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "marche_bloc_en_granit_gris_clair_sciee_flammee",
                                                                            nom = "Marche bloc en granit gris clair sciée flammée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_600x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimensions 600x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 94.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_600x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimensions 600x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 88.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_800x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimensions 800x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 116.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_800x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimensions 800x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 112.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1000x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimensions 1000x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 138.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1000x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimensions 1000x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 134.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1200x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimensions 1200x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 159.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1200x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimensions 1200x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 155.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1500x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimensions 1500x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 193.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1500x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimensions 1500x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 189.15,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "marche_bloc_en_granit_gris_fonce_sciee_flammee",
                                                                            nom = "Marche bloc en granit gris foncé sciée flammée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_1200x350x150_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimensions 1200x350x150 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 159.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1200x350x150_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimensions 1200x350x150 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 154.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_800x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 800x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 127.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_800x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 800x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 123.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1000x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1000x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 153.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1000x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 1000x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 148.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1200x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1200x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 177.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1200x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 1200x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 173.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1500x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1500x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1500x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 1500x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.63,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "marche_bloc_en_granit_noir_sciee_flammee",
                                                                            nom = "Marche bloc en granit noir sciée flammée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimension_800x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 800x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 186.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_800x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 800x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 191.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1000x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 1000x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1000x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1000x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1200x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 1200x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 268.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1200x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1200x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 272.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1500x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 1500x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 329.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1500x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1500x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 333.9,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "marche_bloc_en_granit_rose_sciee_flammee",
                                                                            nom = "Marche bloc en granit rose sciée flammée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimension_800x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 800x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 131.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_800x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 800x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 136.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1000x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 1000x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 148.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1000x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1000x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 153.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1200x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 1200x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 171.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1200x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1200x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 175.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1500x400x140_mm_la_marche_suivante_u",
                                                                                                                    nom = "dimension 1500x400x140 mm, la marche suivante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1500x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1500x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.57,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "marche_bloc_en_granit_jaune_sciee_flammee",
                                                                            nom = "Marche bloc en granit jaune sciée flammée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimension_800x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 800x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 127.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_800x400x140_mm_marches_suivantes_u",
                                                                                                                    nom = "dimension 800x400x140 mm, marches suivantes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 123.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1000x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1000x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 153.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1000x400x140_mm_marches_suivantes_u",
                                                                                                                    nom = "dimension 1000x400x140 mm, marches suivantes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 148.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1200x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1200x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 177.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1200x400x140_mm_marches_suivantes_u",
                                                                                                                    nom = "dimension 1200x400x140 mm, marches suivantes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 173.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1500x400x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimension 1500x400x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimension_1500x400x140_mm_marches_suivantes_u",
                                                                                                                    nom = "dimension 1500x400x140 mm, marches suivantes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "marche_bloc_lavee",
                                                                            nom = "Marche bloc lavée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_1000x380x140_mm_la_1_ere_marche_u",
                                                                                                                    nom = "dimensions 1000x380x140 mm, la 1 ere marche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 159.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_1000x380x140_mm_marches_suivantes_u",
                                                                                                                    nom = "dimensions 1000x380x140 mm, marches suivantes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 153.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "cloture",
                    nom = "Clôture",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "cloture_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "cloture_grillagee",
                                                                            nom = "Clôture grillagée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_fer_rond_galvanise_fil_n_14_maille_50_compris_piquets_hauteur_1_m_m",
                                                                                                                    nom = "en fer rond galvanisé, fil N° 14, maille 50, compris piquets, hauteur 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fer_rond_plastifie_fil_n_14_maille_50_compris_piquets_hauteur_1_m_m",
                                                                                                                    nom = "en fer rond plastifié, fil N°14, maille 50, compris piquets, hauteur 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "cloture_panneaux_soudes",
                                                                            nom = "Clôture panneaux soudés",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "hauteur_0_70_m_m",
                                                                                                                    nom = "hauteur 0,70 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_1_00_m_m",
                                                                                                                    nom = "hauteur 1,00 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_1_30_m_m",
                                                                                                                    nom = "hauteur 1,30 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_1_80_m_m",
                                                                                                                    nom = "hauteur 1,80 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 266.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_1_50_m_m",
                                                                                                                    nom = "hauteur 1,50 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_2_00_m_m",
                                                                                                                    nom = "hauteur 2,00 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 274.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "cloture_beton_prefabriquee",
                                                                            nom = "Clôture béton préfabriquée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "hauteur_1_50_m_standard_m",
                                                                                                                    nom = "hauteur 1,50 m, standard\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 79.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_1_75_m_standard_m",
                                                                                                                    nom = "hauteur 1,75 m, standard\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 93.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_2_m_standard_m",
                                                                                                                    nom = "hauteur 2 m, standard\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 102.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_2_25_m_standard_m",
                                                                                                                    nom = "hauteur 2,25 m, standard\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 121.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_2_5_m_standard_m",
                                                                                                                    nom = "hauteur 2,5 m, standard\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 132.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_3_m_standard_m",
                                                                                                                    nom = "hauteur 3 m, standard\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 156.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_1_50_m_avec_chaperon_m",
                                                                                                                    nom = "hauteur 1,50 m, avec chaperon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 83.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_1_75_m_avec_chaperon_m",
                                                                                                                    nom = "hauteur 1,75 m, avec chaperon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 97.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_2_m_avec_chaperon_m",
                                                                                                                    nom = "hauteur 2 m, avec chaperon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 106.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_2_25_m_avec_chaperon_m",
                                                                                                                    nom = "hauteur 2,25 m, avec chaperon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 125.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_2_5_m_avec_chaperon_m",
                                                                                                                    nom = "hauteur 2,5 m, avec chaperon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 136.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_3_m_avec_chaperon_m",
                                                                                                                    nom = "hauteur 3 m, avec chaperon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 160.83,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "preparations_des_sols",
                                                                            nom = "Préparations des sols",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "defoncage_m",
                                                                                                                    nom = "Défonçage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.49,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "labour",
                                                                            nom = "Labour",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_la_beche_de_terre_plein_m",
                                                                                                                    nom = "à la bêche, de terre-plein\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_la_beche_de_plate_bande_m",
                                                                                                                    nom = "à la bêche, de plate-bande\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_la_beche_de_gazon_m",
                                                                                                                    nom = "à la bêche, de gazon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_la_charrue_traction_animale_m",
                                                                                                                    nom = "à la charrue, traction animale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_la_charrue_traction_mecanique_m",
                                                                                                                    nom = "à la charrue, traction mécanique\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.92,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "dressement",
                                                                            nom = "Dressement",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sans_piochage_m",
                                                                                                                    nom = "sans piochage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_piochage_compris_cylindrage_m",
                                                                                                                    nom = "sans piochage, compris cylindrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.25,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "regalage",
                                                                            nom = "Régalage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_sable_ou_cailloux_epaisseur_50_a_200_mm_m",
                                                                                                                    nom = "de sable ou cailloux, épaisseur 50 à 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_terre_dure_m",
                                                                                                                    nom = "de terre dure\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.12,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "regalement",
                                                                            nom = "Régalement",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_terrain_par_legers_mouvement_de_terre_de_100_a_150_mm_d_epaisseur_m",
                                                                                                                    nom = "de terrain par légers mouvement de terre de 100 à 150 mm d'épaisseur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "definitif_des_allees_massifs_et_pelouses_m",
                                                                                                                    nom = "définitif des allées, massifs et pelouses\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_bordures_m",
                                                                                                                    nom = "de bordures\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.13,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "hersage",
                                                                            nom = "Hersage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "par_traction_animale_de_terre_legere_m",
                                                                                                                    nom = "par traction animale, de terre légère\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_traction_animale_de_terre_lourde_m",
                                                                                                                    nom = "par traction animale, de terre lourde\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_traction_mecanique_de_terre_legere_m",
                                                                                                                    nom = "par traction mécanique, de terre légère\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_traction_mecanique_de_terre_lourde_m",
                                                                                                                    nom = "par traction mécanique, de terre lourde\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epandage_de_fumier_ou_paille_m",
                                                                                                                    nom = "Epandage de fumier ou paille\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ratissage_m",
                                                                                                                    nom = "Ratissage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plantations",
                    nom = "Plantations",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plantations_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                        }
                    }
                },
        {
                    id = "semis_gazon_et_entretien",
                    nom = "Semis, gazon et entretien",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "semis_gazon_et_entretien_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "ensemencement_de_gazon",
                                                                            nom = "Ensemencement de gazon",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "avec_enfouissement_et_roulage_m",
                                                                                                                    nom = "avec enfouissement et roulage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_bordures_inferieures_a_1_00_m_de_largeur_m",
                                                                                                                    nom = "pour bordures inférieures à 1,00 m de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "terreautage_des_semis_m",
                                                                                                                    nom = "Terreautage des semis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "roulage_de_pelouses",
                                                                            nom = "Roulage de pelouses",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_bras_d_homme_inferieures_a_1000_m2_m",
                                                                                                                    nom = "à bras d'homme, inférieures à 1000 m2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_bras_d_homme_superieures_a_1000_m2_m",
                                                                                                                    nom = "à bras d'homme, supérieures à 1000 m2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "mecaniquement_m",
                                                                                                                    nom = "mécaniquement\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "placage_gazon",
                                                                            nom = "Placage gazon",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_terrain_en_pente_inferieure_a_30_m",
                                                                                                                    nom = "sur terrain en pente inférieure à 30%\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_terrain_en_pente_superieure_a_30_m",
                                                                                                                    nom = "sur terrain en pente supérieure à 30%\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_bordures_inferieures_a_50_cm_m",
                                                                                                                    nom = "pour bordures inférieures à 50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_bordures_largeur_de_50_a_100_cm_m",
                                                                                                                    nom = "pour bordures largeur de 50 à 100 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.6,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "fauchage_de_gazon_manuel",
                                                                            nom = "Fauchage de gazon manuel",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "inferieur_a_100_m2_m",
                                                                                                                    nom = "inférieur à 100 m2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_100_a_250_m2_m",
                                                                                                                    nom = "de 100 à 250 m2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_251_a_500_m2_m",
                                                                                                                    nom = "de 251 à 500 m2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "superieur_a_500_m2_m",
                                                                                                                    nom = "supérieur à 500 m2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "bordures_inferieures_a_1_00_m_m",
                                                                                                                    nom = "bordures inférieures à 1,00 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "fauchage_de_gazon_machine",
                                                                            nom = "Fauchage de gazon machine",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "inferieur_a_250_m2_m",
                                                                                                                    nom = "inférieur à 250 m2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_251_a_500_m2_m",
                                                                                                                    nom = "de 251 à 500 m2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "superieur_a_500_m2_m",
                                                                                                                    nom = "supérieur à 500 m2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.55,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "decoupage_de_bordures_gazon",
                                                                            nom = "Découpage de bordures gazon",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dans_le_neuf_m",
                                                                                                                    nom = "<dans le neuf>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dans_l_ancien_m",
                                                                                                                    nom = "<dans l'ancien>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.13,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "decoupage_de_filet_ou_contre_filet",
                                                                            nom = "Découpage de filet ou contre-filet",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_partie_droite_m",
                                                                                                                    nom = "en partie droite\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_partie_courbe_m",
                                                                                                                    nom = "en partie courbe\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.52,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "execution_d_allees",
                                                                            nom = "Exécution d'allées",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "blocage_en_pierre_cassee_m",
                                                                                                                    nom = "Blocage en pierre cassée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 220.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epandage_de_macadam_avec_arrosage_et_cylindrage_m",
                                                                                                                    nom = "Epandage de macadam, avec arrosage et cylindrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "cylindrage_de_chaussee_non_empierree_m",
                                                                                                                    nom = "Cylindrage de chaussée non-empierrée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "cylindrage_de_pistes_avec_mise_a_niveau_m",
                                                                                                                    nom = "Cylindrage de pistes avec mise à niveau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.21,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plantations_d_arbres",
                    nom = "Plantations d'arbres",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plantations_d_arbres_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "arbres_tiges_a_racines_nues_et_fruitiers_a_haute_tige",
                                                                            nom = "Arbres-tiges à racines nues et fruitiers à haute tige",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "circonference_70_a_100_mm_u",
                                                                                                                    nom = "circonférence 70 à 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "circonference_110_a_180_mm_u",
                                                                                                                    nom = "circonférence 110 à 180 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "circonference_190_a_250_mm_u",
                                                                                                                    nom = "circonférence 190 à 250 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "circonference_260_a_300_mm_u",
                                                                                                                    nom = "circonférence 260 à 300 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 66.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "circonference_310_a_350_mm_u",
                                                                                                                    nom = "circonférence 310 à 350 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 113.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "circonference_360_a_400_mm_u",
                                                                                                                    nom = "circonférence 360 à 400 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 159.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "circonference_410_a_450_mm_u",
                                                                                                                    nom = "circonférence 410 à 450 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.06,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arbustes_a_racines_nues_a_feuillage_caduc",
                                                                            nom = "Arbustes à racines nues à feuillage caduc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "jusqu_a_1_50_m_de_hauteur_u",
                                                                                                                    nom = "jusqu'à 1,50 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_1_51_a_2_50_m_de_hauteur_u",
                                                                                                                    nom = "de 1,51 à 2,50 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_plus_de_2_50_m_de_hauteur_u",
                                                                                                                    nom = "de plus de 2,50 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.98,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arbustes_a_feuillage_persistant_ou_caduc_en_mottes_ou_paniers",
                                                                            nom = "Arbustes à feuillage persistant ou caduc en mottes ou paniers",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "jusqu_a_1_50_m_de_hauteur_u",
                                                                                                                    nom = "jusqu'à 1,50 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_1_51_a_2_50_m_de_hauteur_u",
                                                                                                                    nom = "de 1,51 à 2,50 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_2_01_a_2_50_m_de_hauteur_u",
                                                                                                                    nom = "de 2,01 à 2,50 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_2_51_a_3_00_m_de_hauteur_u",
                                                                                                                    nom = "de 2,51 à 3,00 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_plus_de_3_00_m_de_hauteur_u",
                                                                                                                    nom = "de plus de 3,00 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 39.94,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arbuste_grimpant",
                                                                            nom = "Arbuste grimpant",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "jusqu_a_1_50_m_de_hauteur_u",
                                                                                                                    nom = "jusqu'à 1,50 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_plus_de_1_50_m_de_hauteur_u",
                                                                                                                    nom = "de plus de 1,50 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arbre_fruitier",
                                                                            nom = "Arbre fruitier",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "touffes_u",
                                                                                                                    nom = "touffes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "scions_d_un_an_u",
                                                                                                                    nom = "scions d'un an\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "forme_1ere_serie_u",
                                                                                                                    nom = "forme 1ère série\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "forme_2eme_serie_u",
                                                                                                                    nom = "forme 2ème série\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.31,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bordure_de_lierre",
                                                                            nom = "Bordure de lierre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "largeur_0_30_cm_m",
                                                                                                                    nom = "largeur 0,30 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_0_40_cm_m",
                                                                                                                    nom = "largeur 0,40 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_0_50_cm_m",
                                                                                                                    nom = "largeur 0,50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_0_60_cm_m",
                                                                                                                    nom = "largeur 0,60 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_de_plus_de_0_60_cm_m",
                                                                                                                    nom = "largeur de plus de 0,60 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.29,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "conifere_en_mottes_ou_panier",
                                                                            nom = "Conifère en mottes ou panier",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "de_0_60_a_1_00_m_de_hauteur_u",
                                                                                                                    nom = "de 0,60 à 1,00 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_1_01_a_1_50_m_de_hauteur_u",
                                                                                                                    nom = "de 1,01 à 1,50 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_1_51_a_2_25_m_de_hauteur_u",
                                                                                                                    nom = "de 1,51 à 2,25 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_2_26_a_3_00_m_de_hauteur_u",
                                                                                                                    nom = "de 2,26 à 3,00 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 49.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_plus_de_3_00_m_de_hauteur_u",
                                                                                                                    nom = "de plus de 3,00 m de hauteur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 73.24,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "palissage_arbres_grimpants",
                                                                            nom = "Palissage arbres grimpants",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "jusqu_a_1_50_m_de_largeur_u",
                                                                                                                    nom = "jusqu'à 1,50 m de largeur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_value_par_tranches_de_0_50_m_supplementaires_u",
                                                                                                                    nom = "plus value par tranches de 0,50 m supplémentaires\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plantation_de_rosiers",
                                                                            nom = "Plantation de rosiers",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "rosiers_a_tige_ou_demi_tige_u",
                                                                                                                    nom = "rosiers à tige ou demi-tige\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rosiers_nains_u",
                                                                                                                    nom = "rosiers nains\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.33,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plantes_vivaces",
                                                                            nom = "Plantes vivaces",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "fortes_touffe_u",
                                                                                                                    nom = "fortes touffe\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "force_courante_u",
                                                                                                                    nom = "force courante\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plantes_annuelles_u",
                                                                                                                    nom = "plantes annuelles\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1.33,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plantation_de_buis_fusains_filets_simples",
                                                                            nom = "Plantation de buis, fusains, filets simples",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_partie_droite_m",
                                                                                                                    nom = "en partie droite\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_partie_courbe_m",
                                                                                                                    nom = "en partie courbe\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_remplissage_m",
                                                                                                                    nom = "en remplissage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2113.19,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "revetements_de_sol_exterieur",
                    nom = "Revêtements de sol extérieur",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "revetements_de_sol_exterieur_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "margelle_scellee_au_mortier_de_pose_dimensions_500x300_mm",
                                                                            nom = "Margelle scellée au mortier de pose, dimensions 500x300 mm",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_scellee_au_mortier_de_pose_m",
                                                                                                                    nom = "pose seule scellée au mortier de pose\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_10_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 10 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 40.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_15_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 15 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_20_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 20 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 55.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_25_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 25 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 63.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_30_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 30 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 70.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_35_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 35 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 78.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_40_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 40 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 85.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_45_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 45 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 93.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_50_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 50 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 100.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_55_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 55 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 108.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_60_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 60 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 123.13,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "margelle_posee_par_double_encollage_dimensions_500x300_mm",
                                                                            nom = "Margelle posée par double encollage, dimensions 500x300 mm",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_par_double_encollage_m",
                                                                                                                    nom = "pose seule par double encollage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_10_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 10 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 34.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_15_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 15 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 42.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_20_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 20 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 49.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_25_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 25 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 57.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_30_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 30 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 64.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_35_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 35 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 72.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_40_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 40 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 79.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_45_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 45 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 87.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_50_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 50 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 94.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_55_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 55 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 102.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_par_double_encollage_prix_d_achat_60_ht_m_m",
                                                                                                                    nom = "fourniture et pose par double encollage <prix d'achat 60 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 117.12,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "margelle_scellee_au_mortier_de_pose_dimensions_600x370_mm",
                                                                            nom = "Margelle scellée au mortier de pose, dimensions 600x370 mm",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_scellee_au_mortier_de_pose_m",
                                                                                                                    nom = "pose seule scellée au mortier de pose\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_10_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 10 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_15_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 15 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_20_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 20 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 56.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_25_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 25 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 63.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_30_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 30 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 71.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_35_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 35 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 78.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_40_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 40 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 86.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_45_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 45 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 93.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_50_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 50 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 101.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_55_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 55 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 108.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_scellee_au_mortier_de_pose_prix_d_achat_60_ht_m_m",
                                                                                                                    nom = "fourniture et pose scellée au mortier de pose <prix d'achat 60 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 121.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "margelle_posee_par_double_encollage_dimensions_600x370_mm",
                                                                            nom = "Margelle posée par double encollage, dimensions 600x370 mm",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_m",
                                                                                                                    nom = "pose seule\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_10_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 10 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 34.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_15_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 15 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 42.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_20_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 20 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 49.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_25_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 25 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 57.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_30_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 30 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 64.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_35_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 35 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 72.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_40_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 40 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 79.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_45_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 45 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 87.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_50_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 50 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 94.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_55_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 55 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 102.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_60_ht_m_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 60 ¤ HT/m>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 117.33,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_en_lames_de_bois_vissees",
                                                                            nom = "Terrasse en lames de bois vissées",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "bois_composite_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "bois composite, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2143.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2182.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2188.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_180_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 180 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2194.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afrormosia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afrormosia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2199.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_amelhia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence amélhia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2100.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cocotier_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence cocotier, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2154.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cumaru_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence cumaru, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2156.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_garapa_lame_de_145_mm_de_largeur_m",
                                                                                                                    nom = "essence garapa, lame de 145 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2138.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_ipe_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence ipé, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2193.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2123.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2124.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2127.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_teck_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence teck, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2264.25,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_en_lames_de_bois_fixation_type_happax",
                                                                            nom = "Terrasse en lames de bois, fixation type Happax",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "bois_composite_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "bois composite, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2150.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2187.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2196.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_180_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 180 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2200.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afrormosia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afrormosia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2207.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cocotier_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence cocotier, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2167.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cumaru_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence cumaru, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2164.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_ipe_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence ipé, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2200.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2139.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2134.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2135.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_teck_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence teck, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2271.8,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_en_lames_de_bois_fixation_type_b_fix",
                                                                            nom = "Terrasse en lames de bois, fixation type B-fix",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "bois_composite_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "bois composite, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2147.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2186.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2193.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_180_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 180 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2197.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afrormosia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afrormosia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2204.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cocotier_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence cocotier, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2164.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cumaru_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence cumaru, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2160.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_ipe_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence ipé, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2197.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2136.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2133.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2132.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_teck_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence teck, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2268.69,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_en_caillebotis",
                                                                            nom = "Terrasse en caillebotis",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "lames_en_ipe_de_68_mm_dimensions_cailleboti_43x43_cm_m",
                                                                                                                    nom = "lames en ipé de 68 mm, dimensions cailleboti 43x43 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2117.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_ipe_de_68_mm_dimensions_cailleboti_50x50_cm_m",
                                                                                                                    nom = "lames en ipé de 68 mm, dimensions cailleboti 50x50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2136.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_ipe_de_68_mm_dimensions_cailleboti_50x100_cm_m",
                                                                                                                    nom = "lames en ipé de 68 mm, dimensions cailleboti 50x100 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2214.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_ipe_de_68_mm_dimensions_cailleboti_50x150_cm_m",
                                                                                                                    nom = "lames en ipé de 68 mm, dimensions cailleboti 50x150 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2221.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_ipe_de_120_mm_dimensions_cailleboti_50x200_cm_m",
                                                                                                                    nom = "lames en ipé de 120 mm, dimensions cailleboti 50x200 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2220.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_ipe_de_120_mm_dimensions_cailleboti_50x250_cm_m",
                                                                                                                    nom = "lames en ipé de 120 mm, dimensions cailleboti 50x250 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2222.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_ipe_de_120_mm_dimensions_cailleboti_50x300_cm_m",
                                                                                                                    nom = "lames en ipé de 120 mm, dimensions cailleboti 50x300 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2219.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_padouk_de_68_mm_dimensions_cailleboti_43x43_cm_m",
                                                                                                                    nom = "lames en padouk de 68 mm, dimensions cailleboti 43x43 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2115.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_padouk_de_68_mm_dimensions_cailleboti_50x50_cm_m",
                                                                                                                    nom = "lames en padouk de 68 mm, dimensions cailleboti 50x50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2140.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_padouk_de_68_mm_dimensions_cailleboti_50x100_cm_m",
                                                                                                                    nom = "lames en padouk de 68 mm, dimensions cailleboti 50x100 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2208.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_padouk_de_68_mm_dimensions_cailleboti_50x150_cm_m",
                                                                                                                    nom = "lames en padouk de 68 mm, dimensions cailleboti 50x150 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2208.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_padouk_de_120_mm_dimensions_cailleboti_50x200_cm_m",
                                                                                                                    nom = "lames en padouk de 120 mm, dimensions cailleboti 50x200 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2207.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_padouk_de_120_mm_dimensions_cailleboti_50x250_cm_m",
                                                                                                                    nom = "lames en padouk de 120 mm, dimensions cailleboti 50x250 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2206.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_padouk_de_120_mm_dimensions_cailleboti_50x300_cm_m",
                                                                                                                    nom = "lames en padouk de 120 mm, dimensions cailleboti 50x300 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2206.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_pin_maritime_de_140_mm_dimensions_cailleboti_50x50_cm_m",
                                                                                                                    nom = "lames en pin maritime de 140 mm, dimensions cailleboti 50x50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 282.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_pin_maritime_de_140_mm_dimensions_cailleboti_80x80_cm_m",
                                                                                                                    nom = "lames en pin maritime de 140 mm, dimensions cailleboti 80x80 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_pin_maritime_de_140_mm_dimensions_cailleboti_100x100_cm_m",
                                                                                                                    nom = "lames en pin maritime de 140 mm, dimensions cailleboti 100x100 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_tali_de_68_mm_dimensions_cailleboti_43x43_cm_m",
                                                                                                                    nom = "lames en tali de 68 mm, dimensions cailleboti 43x43 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2114.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_tali_de_68_mm_dimensions_cailleboti_50x50_cm_m",
                                                                                                                    nom = "lames en tali de 68 mm, dimensions cailleboti 50x50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2129.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_tali_de_68_mm_dimensions_cailleboti_50x100_cm_m",
                                                                                                                    nom = "lames en tali de 68 mm, dimensions cailleboti 50x100 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2197.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_tali_de_68_mm_dimensions_cailleboti_50x150_cm_m",
                                                                                                                    nom = "lames en tali de 68 mm, dimensions cailleboti 50x150 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2198.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_tali_de_120_mm_dimensions_cailleboti_50x200_cm_m",
                                                                                                                    nom = "lames en tali de 120 mm, dimensions cailleboti 50x200 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2201.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_tali_de_120_mm_dimensions_cailleboti_50x250_cm_m",
                                                                                                                    nom = "lames en tali de 120 mm, dimensions cailleboti 50x250 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2195.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "lames_en_tali_de_120_mm_dimensions_cailleboti_50x300_cm_m",
                                                                                                                    nom = "lames en tali de 120 mm, dimensions cailleboti 50x300 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2195.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_en_lames_de_bois_vissees_sur_plots",
                                                                            nom = "Terrasse en lames de bois vissées, sur plots",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "bois_composite_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "bois composite, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2162.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2202.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2208.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_180_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 180 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2214.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afrormosia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afrormosia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2219.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cocotier_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence cocotier, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2174.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cumaru_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence cumaru, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2176.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_garapa_lame_de_145_mm_de_largeur_m",
                                                                                                                    nom = "essence garapa, lame de 145 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2158.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_ipe_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence ipé, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2213.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2143.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2144.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2147.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_teck_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence teck, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2284.29,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_en_lames_de_bois_fixation_type_happax_sur_plots",
                                                                            nom = "Terrasse en lames de bois, fixation type Happax, sur plots",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "bois_composite_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "bois composite, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2170.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2208.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2216.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_180_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 180 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2220.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afrormosia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afrormosia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2227.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cocotier_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence cocotier, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2187.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cumaru_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence cumaru, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2184.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_ipe_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence ipé, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2220.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2159.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2154.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2155.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_teck_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence teck, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2291.84,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_en_lames_de_bois_fixation_type_b_fix_sur_plots",
                                                                            nom = "Terrasse en lames de bois, fixation type B-fix, sur plots",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "bois_composite_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "bois composite, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2167.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2206.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2213.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afzelia_lame_de_180_mm_de_largeur_m",
                                                                                                                    nom = "essence afzelia, lame de 180 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2217.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_afrormosia_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence afrormosia, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2224.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cocotier_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence cocotier, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2184.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_cumaru_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence cumaru, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2181.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_ipe_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence ipé, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2217.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_90_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 90 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2156.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_120_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 120 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2153.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_pin_traite_autoclave_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence pin, traité autoclave, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2152.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "essence_teck_lame_de_140_mm_de_largeur_m",
                                                                                                                    nom = "essence teck, lame de 140 mm de largeur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2288.73,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrasse_en_dalle_de_gravillons_laves_sur_plots",
                                                                            nom = "Terrasse en dalle de gravillons lavés sur plots",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dimensions_400x400_mm_epaisseur_40_mm_m",
                                                                                                                    nom = "dimensions 400x400 mm, épaisseur 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 272.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_500x500_mm_epaisseur_50_mm_m",
                                                                                                                    nom = "dimensions 500x500 mm, épaisseur 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_400x400_mm_epaisseur_40_mm_petit_grain_m",
                                                                                                                    nom = "dimensions 400x400 mm, épaisseur 40 mm, petit grain\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 274.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dimensions_500x500_mm_epaisseur_50_mm_petit_grain_m",
                                                                                                                    nom = "dimensions 500x500 mm, épaisseur 50 mm, petit grain\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.36,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "cuves_stockage_eau_de_pluie",
                    nom = "Cuves stockage eau de pluie",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "cuves_stockage_eau_de_pluie_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "cuve_a_enterrer_recuperation_et_stockage_eau_de_pluie",
                                                                            nom = "Cuve à enterrer, récupération et stockage eau de pluie",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "capacite_2200_litres_en_polyethylene_haute_densite_u",
                                                                                                                    nom = "capacité 2200 litres, en polyéthylène haute densité\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4215.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "capacite_3350_litres_en_polyethylene_haute_densite_u",
                                                                                                                    nom = "capacité 3350 litres, en polyéthylène haute densité\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5260.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "capacite_4800_litres_en_polyethylene_haute_densite_u",
                                                                                                                    nom = "capacité 4800 litres, en polyéthylène haute densité\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6728.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "capacite_6500_litres_en_polyethylene_haute_densite_u",
                                                                                                                    nom = "capacité 6500 litres, en polyéthylène haute densité\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7835.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "capacite_7800_litres_en_polyethylene_haute_densite_u",
                                                                                                                    nom = "capacité 7800 litres, en polyéthylène haute densité\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10353.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "capacite_9200_litres_en_polyethylene_haute_densite_u",
                                                                                                                    nom = "capacité 9200 litres, en polyéthylène haute densité\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12899.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rehausse_telescopique_avec_couvercle_u",
                                                                                                                    nom = "Rehausse télescopique avec couvercle\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1170.27,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "kit_pour_installation_jardin_comprenant",
                                                                            nom = "Kit pour installation jardin comprenant :",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_filtre_1_siphon_1_stop_rats_1_tuyau_anti_remous_manchette_u",
                                                                                                                    nom = "1 filtre, 1 siphon, 1 stop rats, 1 tuyau anti-remous, manchette\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1150.07,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "kit_pour_installation_habitat_comprenant",
                                                                            nom = "Kit pour installation habitat comprenant :",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_filtre_auto_nettoyant_1_siphon_1_stop_rats_1_tuyau_anti_remous_manchette_u",
                                                                                                                    nom = "1 filtre auto nettoyant, 1 siphon, 1 stop rats, 1 tuyau anti-remous, manchette\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1452.92,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "set_de_tirage_pour_jardin_comprenant",
                                                                            nom = "Set de tirage pour jardin comprenant :",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_crepine_1_clapet_anti_retour_1_tuyau_1_embout_cannele_dn_33_42_mm_u",
                                                                                                                    nom = "1 crépine, 1 clapet anti-retour, 1 tuyau, 1 embout cannelé dn 33/42 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 334.66,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "set_de_tirage_pour_habitat_comprenant",
                                                                            nom = "Set de tirage pour habitat comprenant :",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_micro_crepine_avec_flotteur_1_clapet_anti_retour_u",
                                                                                                                    nom = "1 micro crépine avec flotteur, 1 clapet anti-retour\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 493.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tuyau_de_tirage_special_dn_1_m",
                                                                                                                    nom = "tuyau de tirage spécial, dn 1''\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 57.72,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "adduction_surpression",
                    nom = "Adduction- Surpression",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "adduction_surpression_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "pompes_de_surface_a_usage_domestique",
                                                                            nom = "Pompes de surface à usage domestique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sans_automatisme_debit_2m3_h_hm_25mce_u",
                                                                                                                    nom = "sans automatisme, débit= 2m3/h, HM=25mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 377.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_automatisme_debit_3m3_h_hm_25mce_u",
                                                                                                                    nom = "sans automatisme, débit= 3m3/h, HM=25mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 473.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_automatisme_debit_4m3_h_hm_25mce_u",
                                                                                                                    nom = "sans automatisme, débit= 4m3/h, HM=25mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 561.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_automatisme_debit_5m3_h_hm_25mce_u",
                                                                                                                    nom = "sans automatisme, débit= 5m3/h, HM=25mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 683.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_automatisme_debit_6m3_h_hm_30mce_u",
                                                                                                                    nom = "sans automatisme, débit= 6m3/h, HM=30mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 781.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_automatisme_debit_2m3_h_hm_25mce_u",
                                                                                                                    nom = "avec automatisme, débit= 2m3/h, HM=25mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 521.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_automatisme_debit_3m3_h_hm_25mce_u",
                                                                                                                    nom = "avec automatisme, débit= 3m3/h, HM=25mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 665.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_automatisme_debit_4m3_h_hm_25mce_u",
                                                                                                                    nom = "avec automatisme, débit= 4m3/h, HM=25mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 755.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_automatisme_debit_5m3_h_hm_25mce_u",
                                                                                                                    nom = "avec automatisme, débit= 5m3/h, HM=25mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 877.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_automatisme_debit_6m3_h_hm_30mce_u",
                                                                                                                    nom = "avec automatisme, débit= 6m3/h, HM=30mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 986.05,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "kit_d_aspiration_pour_pompe_de_surface",
                                                                            nom = "Kit d'aspiration pour pompe de surface",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "kit_d_aspiration_diametre_26_34_mm_u",
                                                                                                                    nom = "kit d'aspiration, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 53.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "kit_d_aspiration_diametre_33_42_mm_u",
                                                                                                                    nom = "kit d'aspiration, diamètre 33/42 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 115.44,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "contacteur_disjoncteur",
                                                                            nom = "Contacteur disjoncteur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_protection_thermique_de_la_pompe_de_surface_u",
                                                                                                                    nom = "pour protection thermique de la pompe de surface\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.34,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "surpresseurs_domestiques_automatiques",
                                                                            nom = "Surpresseurs domestiques automatiques",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "reservoir_20_litres_debit_2_m3_h_hm_30mce_u",
                                                                                                                    nom = "réservoir 20 litres, débit=2 m3/h, HM=30mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 860.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "reservoir_50_litres_debit_2_m3_h_hm_30mce_u",
                                                                                                                    nom = "réservoir 50 litres, débit=2 m3/h, HM=30mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 941.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "reservoir_50_litres_debit_3_m3_h_hm_30mce_u",
                                                                                                                    nom = "réservoir 50 litres, débit=3 m3/h, HM=30mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 961.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "reservoir_100_litres_debit_2_m3_h_hm_30mce_u",
                                                                                                                    nom = "réservoir 100 litres, débit=2 m3/h, HM=30mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1087.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "reservoir_100_litres_debit_3_m3_h_hm_30mce_u",
                                                                                                                    nom = "réservoir 100 litres, débit=3 m3/h, HM=30mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1107.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "reservoir_100_litres_debit_6_m3_h_hm_30mce_u",
                                                                                                                    nom = "réservoir 100 litres, débit=6 m3/h, HM=30mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1163.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "kit_de_protection_manque_d_eau",
                                                                            nom = "kit de protection manque d'eau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_reseau_de_ville_pour_surpresseur_u",
                                                                                                                    nom = "sur réseau de ville, pour surpresseur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 519.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_bache_de_stockage_pour_surpresseur_u",
                                                                                                                    nom = "sur bâche de stockage, pour surpresseur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.69,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "reservoirs_de_surpression_a_vessie",
                                                                            nom = "Réservoirs de surpression à vessie",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "modele_horizontal_capacite_24_litres_u",
                                                                                                                    nom = "modèle horizontal, capacité 24 litres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 91.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "modele_horizontal_capacite_50_litres_u",
                                                                                                                    nom = "modèle horizontal, capacité 50 litres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "modele_horizontal_capacite_100_litres_u",
                                                                                                                    nom = "modèle horizontal, capacité 100 litres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 415.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "modele_vertical_capacite_100_litres_u",
                                                                                                                    nom = "modèle vertical, capacité 100 litres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 336.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "modele_vertical_capacite_200_litres_u",
                                                                                                                    nom = "modèle vertical, capacité 200 litres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 569.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "modele_vertical_capacite_300_litres_u",
                                                                                                                    nom = "modèle vertical, capacité 300 litres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 649.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "modele_anti_belier_capacite_0_16_litres_u",
                                                                                                                    nom = "modèle anti-bélier, capacité 0,16 litres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 55.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "modele_anti_belier_capacite_8_litres_u",
                                                                                                                    nom = "modèle anti-bélier, capacité 8 litres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 170.05,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pompes_immergees_pour_forage_4",
                                                                            nom = "Pompes immergées pour forage 4'",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "debit_2_m3_h_hm_75_mce_u",
                                                                                                                    nom = "débit= 2 m3/h, HM= 75 mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1172.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "debit_4_m3_h_hm_80_mce_u",
                                                                                                                    nom = "débit= 4 m3/h, HM= 80 mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1758.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "debit_6_m3_h_hm_80_mce_u",
                                                                                                                    nom = "débit= 6 m3/h, HM= 80 mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1911.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "debit_8_m3_h_hm_60_mce_u",
                                                                                                                    nom = "débit= 8 m3/h, HM= 60 mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2383.88,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "filin_de_soutien_en_inox",
                                                                            nom = "Filin de soutien en inox",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_pompe_immergee_m",
                                                                                                                    nom = "pour pompe immergée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.78,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "kit_cable_plat_d_alimentation_electrique",
                                                                            nom = "Kit câble plat d'alimentation électrique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "section_4_x1_5_mm2_longueur_15_metres_u",
                                                                                                                    nom = "section 4 x1,5 mm2, longueur 15 mètres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "section_4_x1_5_mm2_longueur_25_metres_u",
                                                                                                                    nom = "section 4 x1,5 mm2, longueur 25 mètres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 344.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "section_4_x1_5_mm2_longueur_35_metres_u",
                                                                                                                    nom = "section 4 x1,5 mm2, longueur 35 mètres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 437.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "section_4_x1_5_mm2_longueur_45_metres_u",
                                                                                                                    nom = "section 4 x1,5 mm2, longueur 45 mètres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 538.6,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "coffret_de_commande_et_de_protection_manque_d_eau",
                                                                            nom = "Coffret de commande et de protection manque d'eau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "monophase_intensite_jusqu_a_12a_u",
                                                                                                                    nom = "monophasé, intensité jusqu'à 12A\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 438.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "monophase_intensite_jusqu_a_23a_u",
                                                                                                                    nom = "monophasé, intensité jusqu'à 23A\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 716.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "electrode_de_niveau_pour_pompe_immergee_forage_u",
                                                                                                                    nom = "electrode de niveau pour pompe immergée-forage\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.68,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "cable_electrique_pour_electrode_de_niveau",
                                                                            nom = "Câble électrique pour électrode de niveau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "section_1x1_5_mm2_m",
                                                                                                                    nom = "section 1x1,5 mm2\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.36,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pompes_immergees_pour_puits",
                                                                            nom = "Pompes immergées pour puits",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "debit_2_m3_h_hm_35_mce_u",
                                                                                                                    nom = "débit= 2 m3/h, HM= 35 mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 860.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "debit_3m3_h_hm_35_mce_u",
                                                                                                                    nom = "débit= 3m3/h, HM= 35 mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1000.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "debit_6m3_h_hm_35_mce_u",
                                                                                                                    nom = "débit= 6m3/h, HM= 35 mCE\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1052.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dispositif_de_commande_automatique_et_de_protection_contre_le_manque_d_eau_u",
                                                                                                                    nom = "dispositif de commande automatique et de protection contre le manque d'eau\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vanne_d_isolement_a_boisseau_dn_33_42_mm_u",
                                                                                                                    nom = "vanne d'isolement à boisseau, dn 33/42 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "capet_anti_retour_a_membrane_dn_33_42_mm_u",
                                                                                                                    nom = "capet anti-retour à membrane, dn 33/42 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 199.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "interrupteur_a_flotteur_manque_d_eau_u",
                                                                                                                    nom = "interrupteur à flotteur manque d'eau\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 108.9,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "arrosage_automatique",
                    nom = "Arrosage automatique",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "arrosage_automatique_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "tuyeres_escamotables_dn_15_21",
                                                                            nom = "Tuyères escamotables dn 15/21",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "hauteur_de_soulevement_5_cm_portee_0_90m_a_5m_u",
                                                                                                                    nom = "hauteur de soulèvement 5 cm, portée 0,90m à 5m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_de_soulevement_10_cm_portee_0_90m_a_5m_u",
                                                                                                                    nom = "hauteur de soulèvement 10 cm, portée 0,90m à 5m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_de_soulevement_15_cm_portee_0_90m_a_5m_u",
                                                                                                                    nom = "hauteur de soulèvement 15 cm, portée 0,90m à 5m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 32.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_de_soulevement_30_cm_portee_0_90m_a_5m_u",
                                                                                                                    nom = "hauteur de soulèvement 30 cm, portée 0,90m à 5m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 44.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_value_pour_buse_rotative_u",
                                                                                                                    nom = "plus value pour buse rotative\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_de_soulevement_5_cm_portee_2_10m_a_5_50m_u",
                                                                                                                    nom = "hauteur de soulèvement 5 cm, portée 2,10m à 5,50m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_de_soulevement_10_cm_portee_2_10m_a_5_50m_u",
                                                                                                                    nom = "hauteur de soulèvement 10 cm, portée 2,10m à 5,50m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "kit_clapet_anti_vidange_pour_tuyere_u",
                                                                                                                    nom = "kit clapet anti vidange pour tuyère\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.58,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arroseurs_escamotables_dn_15_21_a_turbine_lubrifiees_a_l_eau",
                                                                            nom = "Arroseurs escamotables dn 15/21, à turbine lubrifiées à l'eau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "serie_standard_portee_4_6m_a_10_70m_u",
                                                                                                                    nom = "série standard, portée 4,6m à 10,70m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_clapet_anti_vidange_portee_4_6m_a_10_70m_u",
                                                                                                                    nom = "avec clapet anti vidange, portée 4,6m à 10,70m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.46,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arroseurs_escamotables_dn_20_27_a_turbine_lubrifiees_a_l_eau",
                                                                            nom = "Arroseurs escamotables dn 20/27, à turbine lubrifiées à l'eau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "hauteur_de_soulevement_10_cm_portee_7_6m_a_15_20m_u",
                                                                                                                    nom = "hauteur de soulèvement 10 cm, portée 7,6m à 15,20m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_de_soulevement_15_cm_portee_7_6m_a_15_20m_u",
                                                                                                                    nom = "hauteur de soulèvement 15 cm, portée 7,6m à 15,20m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 75.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "hauteur_de_soulevement_30_cm_portee_7_6m_a_15_20m_u",
                                                                                                                    nom = "hauteur de soulèvement 30 cm, portée 7,6m à 15,20m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 92.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "kit_clapet_anti_vidange_pour_arroseur_u",
                                                                                                                    nom = "kit clapet anti vidange pour arroseur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arroseurs_escamotables_a_batteur",
                                                                            nom = "Arroseurs escamotables à batteur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dn_20_27_mm_portee_6_7m_a_13_70m_u",
                                                                                                                    nom = "dn 20/27 mm, portée 6,7m à 13,70m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.94,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arroseurs_escamotables_dn_26_34_a_turbine_lubrifiee_a_l_eau",
                                                                            nom = "Arroseurs escamotables dn 26/34, à turbine lubrifiée à l'eau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "serie_standard_portee_11_90m_a_19_80m_u",
                                                                                                                    nom = "série standard, portée 11,90m à 19,80m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 138.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_tige_en_inox_portee_11_90m_a_19_80m_u",
                                                                                                                    nom = "avec tige en inox, portée 11,90m à 19,80m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 166.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_standard_portee_11_90m_a_21_70m_u",
                                                                                                                    nom = "série standard, portée 11,90m à 21,70m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 148.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_tige_en_inox_portee_11_90m_a_21_70m_u",
                                                                                                                    nom = "avec tige en inox, portée 11,90m à 21,70m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 176.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_standard_portee_17_40m_a_24_70m_u",
                                                                                                                    nom = "série standard, portée 17,40m à 24,70m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 175.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_tige_en_inox_portee_17_40m_a_24_70m_u",
                                                                                                                    nom = "avec tige en inox, portée 17,40m à 24,70m\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 209.49,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arroseurs_a_impact_non_escamotables",
                                                                            nom = "Arroseurs à impact non escamotables",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dn_15_21_mm_en_plastique_u",
                                                                                                                    nom = "dn 15/21 mm, en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 40.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dn_15_21_mm_en_bronze_u",
                                                                                                                    nom = "dn 15/21 mm, en bronze\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 93.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dn_20_27_mm_en_bronze_u",
                                                                                                                    nom = "dn 20/27 mm, en bronze\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dn_26_34_mm_en_bronze_u",
                                                                                                                    nom = "dn 26/34 mm, en bronze\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 498.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dn_33_42_mm_en_bronze_u",
                                                                                                                    nom = "dn 33/42 mm, en bronze\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 537.86,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "accessoires_pour_tuyeres_et_arroseurs",
                                                                            nom = "Accessoires pour tuyères et arroseurs",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "allonge_reglable_15x21_15x21_mm_u",
                                                                                                                    nom = "allonge réglable 15x21/15x21 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "allonge_reglable_15x21_20x27_mm_u",
                                                                                                                    nom = "allonge réglable 15x21/20X27 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "allonge_reglable_20x27_20x27_mm_u",
                                                                                                                    nom = "allonge réglable 20X27/20X27 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "raccord_droit_ou_coude_cannele_filete_dn_15_21_mm_u",
                                                                                                                    nom = "raccord droit ou coudé, cannelé, fileté dn 15/21 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "raccord_droit_ou_coude_cannele_filete_dn_20_27_mm_u",
                                                                                                                    nom = "raccord droit ou coudé, cannelé, fileté dn 20/27 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "raccord_droit_2_sorties_cannelees_u",
                                                                                                                    nom = "raccord droit 2 sorties cannelées,\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "te_3_sorties_cannelees_u",
                                                                                                                    nom = "té 3 sorties cannelées,\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tuyau_flexible_en_polyethylene_dn_interieur_12_5_mm_m",
                                                                                                                    nom = "tuyau flexible en polyéthylène, dn intérieur 12,5 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.94,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "vannes_electriques_pour_installations_residentielles",
                                                                            nom = "Vannes électriques pour installations résidentielles",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "standard_diametre_26_34_mm_u",
                                                                                                                    nom = "standard, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 81.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "solenoide_a_impulsion_9_v_diametre_26_34_mm_u",
                                                                                                                    nom = "solénoïde, à impulsion 9 V, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 115.15,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "vannes_electriques_pour_espaces_verts_terrains_de_sport",
                                                                            nom = "Vannes électriques pour espaces verts, terrains de sport",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "standard_diametre_20_27_ou_26_34_mm_u",
                                                                                                                    nom = "standard, diamètre 20/27 ou 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 84.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "solenoide_a_impulsion_9_v_diametre_20_27_ou_26_34_mm_u",
                                                                                                                    nom = "solénoïde, à impulsion 9 V, diamètre 20/27 ou 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 119.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_reglage_de_debit_diametre_26_34_mm_u",
                                                                                                                    nom = "avec réglage de débit, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 154.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_reglage_de_debit_diametre_40_49_mm_u",
                                                                                                                    nom = "avec réglage de débit, diamètre 40/49 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 189.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "avec_reglage_de_debit_diametre_50_60_mm_u",
                                                                                                                    nom = "avec réglage de débit, diamètre 50/60 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "solenoide_a_impulsion_9_v_diametre_26_34_mm_avec_reglage_de_debit_u",
                                                                                                                    nom = "solénoïde, à impulsion 9 V, diamètre 26/34 mm, avec réglage de débit\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 182.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "solenoide_a_impulsion_9_v_diametre_40_49_mm_avec_reglage_de_debit_u",
                                                                                                                    nom = "solénoïde, à impulsion 9 V, diamètre 40/49 mm, avec réglage de débit\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "solenoide_a_impulsion_9_v_diametre_50_60_mm_avec_reglage_de_debit_u",
                                                                                                                    nom = "solénoïde, à impulsion 9 V, diamètre 50/60 mm, avec réglage de débit\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 292.81,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "cable_electrique_irrigation_pour_vanne",
                                                                            nom = "Câble électrique Irrigation pour vanne",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "section_0_8_mm2_3_conducteurs_m",
                                                                                                                    nom = "section 0,8 mm2, 3 conducteurs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "section_0_8_mm2_5_conducteurs_m",
                                                                                                                    nom = "section 0,8 mm2, 5 conducteurs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "section_0_8_mm2_7_conducteurs_m",
                                                                                                                    nom = "section 0,8 mm2, 7 conducteurs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "section_0_8_mm2_9_conducteurs_m",
                                                                                                                    nom = "section 0,8 mm2, 9 conducteurs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "section_0_8_mm2_13_conducteurs_m",
                                                                                                                    nom = "section 0,8 mm2, 13 conducteurs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.14,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "regards_de_vannes_en_polyethylene_pehb",
                                                                            nom = "Regards de vannes en polyéthylène PEHB",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "regard_circulaire_noir_diametre_150_avec_couvercle_ht_233_mm_u",
                                                                                                                    nom = "regard circulaire noir, diamètre 150, avec couvercle, ht 233 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "regard_circulaire_vert_diametre_250_avec_couvercle_ht_265_mm_u",
                                                                                                                    nom = "regard circulaire vert, diamètre 250, avec couvercle, ht 265 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "regard_rectangulaire_vert_section_500x360x310_de_ht_avec_couvercle_et_boulon_u",
                                                                                                                    nom = "regard rectangulaire vert, section 500x360x310 de ht, avec couvercle et boulon\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 91.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "regard_rectangulaire_vert_section_610x430x315_de_ht_avec_couvercle_et_boulon_u",
                                                                                                                    nom = "regard rectangulaire vert, section 610x430x315 de ht, avec couvercle et boulon\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 120.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "regard_rectangulaire_vert_section_830x590x390_de_ht_avec_couvercle_et_boulon_u",
                                                                                                                    nom = "regard rectangulaire vert, section 830x590x390 de ht, avec couvercle et boulon\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 423.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "regard_rectangulaire_vert_section_1030x690x460_de_ht_avec_couvercle_et_boulon_u",
                                                                                                                    nom = "regard rectangulaire vert, section 1030x690x460 de ht, avec couvercle et boulon\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 733.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rehausse_pour_regard_rectangulaire_vert_section_500x360_hauteur_170_mm_u",
                                                                                                                    nom = "rehausse pour regard rectangulaire vert, section 500x360, hauteur 170 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 57.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rehausse_pour_regard_rectangulaire_vert_section_610x430_hauteur_180_mm_u",
                                                                                                                    nom = "rehausse pour regard rectangulaire vert, section 610x430, hauteur 180 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 84.81,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "raccords_union_demontables_pour_vannes",
                                                                            nom = "Raccords union démontables pour vannes",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "coude_union_mf_diametre_26_34_mm_u",
                                                                                                                    nom = "coude union MF, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "coude_union_ff_diametre_26_34_mm_u",
                                                                                                                    nom = "coude union FF, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "bouchon_ff_diametre_26_34_mm_u",
                                                                                                                    nom = "bouchon FF, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "manchon_ff_diametre_26_34_mm_u",
                                                                                                                    nom = "manchon FF, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "te_union_mf_diametre_26_34_mm_u",
                                                                                                                    nom = "té union MF, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "croix_mf_diametre_26_34_mm_u",
                                                                                                                    nom = "croix MF, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "mamelon_double_m_diametre_26_34_mm_u",
                                                                                                                    nom = "mamelon double M, diamètre 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "collecteur_mf_dn_26_34_mm_2_sorties_f_dn_26_34_mm_u",
                                                                                                                    nom = "collecteur MF, dn 26/34 mm, 2 sorties F dn 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "collecteur_mf_dn_26_34_mm_3_sorties_f_dn_26_34_mm_u",
                                                                                                                    nom = "collecteur MF, dn 26/34 mm, 3 sorties F dn 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "collecteur_mf_dn_26_34_mm_4_sorties_f_dn_26_34_mm_u",
                                                                                                                    nom = "collecteur MF, dn 26/34 mm, 4 sorties F dn 26/34 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 49.32,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "programmateurs_electroniques",
                                                                            nom = "Programmateurs électroniques",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "serie_itc_2_programmes_modele_avec_2_stations_u",
                                                                                                                    nom = "série ITC ,2 programmes, modèle avec 2 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 192.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_itc_2_programmes_modele_avec_4_stations_u",
                                                                                                                    nom = "série ITC ,2 programmes, modèle avec 4 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 198.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_itc_2_programmes_modele_avec_6_stations_u",
                                                                                                                    nom = "série ITC ,2 programmes, modèle avec 6 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 204.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_image_2_programmes_modele_avec_2_stations_u",
                                                                                                                    nom = "série Image ,2 programmes, modèle avec 2 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 241.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_image_2_programmes_modele_avec_4_stations_u",
                                                                                                                    nom = "série Image ,2 programmes, modèle avec 4 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_image_2_programmes_modele_avec_6_stations_u",
                                                                                                                    nom = "série Image ,2 programmes, modèle avec 6 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 284.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_ec_hybride_3_programmes_modele_4_stations_u",
                                                                                                                    nom = "série EC Hybride ,3 programmes, modèle 4 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 273.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_ec_hybride_3_programmes_modele_6_stations_u",
                                                                                                                    nom = "série EC Hybride ,3 programmes, modèle 6 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 300.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_ec_hybride_3_programmes_modele_9_stations_u",
                                                                                                                    nom = "série EC Hybride ,3 programmes, modèle 9 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 321.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_eps_modular_modele_de_base_4_stations_3_programmes_u",
                                                                                                                    nom = "série EPS Modular , modèle de base 4 stations, 3 programmes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 496.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_eps_modular_modele_d_extension_3_stations_3_programmes_u",
                                                                                                                    nom = "série EPS Modular , modèle d'extension 3 stations, 3 programmes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 78.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_hp_hybride_2_programmes_modele_6_stations_u",
                                                                                                                    nom = "série HP Hybride , 2 programmes, modèle 6 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 572.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_hp_hybride_2_programmes_modele_8_stations_u",
                                                                                                                    nom = "série HP Hybride , 2 programmes, modèle 8 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 611.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "serie_hp_hybride_2_programmes_modele_12_stations_u",
                                                                                                                    nom = "série HP Hybride , 2 programmes, modèle 12 stations\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 693.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "programmateurs_autonomes",
                                                                            nom = "Programmateurs autonomes",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_pile_1_station_u",
                                                                                                                    nom = "à pile,1 station\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 190.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_pile_1_station_2_programmes_u",
                                                                                                                    nom = "à pile,1 station, 2 programmes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_pile_2_stations_3_programmes_u",
                                                                                                                    nom = "à pile, 2 stations, 3 programmes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 295.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_pile_4_stations_3_programmes_u",
                                                                                                                    nom = "à pile, 4 stations, 3 programmes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 314.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_pile_6_stations_3_programmes_u",
                                                                                                                    nom = "à pile, 6 stations, 3 programmes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 344.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_pile_8_stations_3_programmes_u",
                                                                                                                    nom = "à pile, 8 stations, 3 programmes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 385.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_pile_1_voie_avec_module_programmable_u",
                                                                                                                    nom = "à pile,1 voie avec module programmable\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_nez_de_robinet_dn_20_27_mm_1_programme_u",
                                                                                                                    nom = "à nez de robinet, dn 20/27 mm, 1 programme\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 116.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_nez_de_robinet_dn_20_27_mm_8_programmes_u",
                                                                                                                    nom = "à nez de robinet, dn 20/27 mm, 8 programmes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 133.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "detecteur_de_pluie_a_connecter_sur_programmateur_autonome_u",
                                                                                                                    nom = "détecteur de pluie à connecter sur programmateur autonome\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 82.77,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrosage_goutte_a_goutte_pur_tube_micro_irrigation",
                                                                            nom = "Arrosage goutte à goutte pur tube micro-irrigation",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dn_ext_16_mm_espacement_entre_goutteurs_33_cm_m",
                                                                                                                    nom = "dn ext 16 mm, espacement entre goutteurs 33 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dn_ext_16_mm_espacement_entre_goutteurs_40_cm_m",
                                                                                                                    nom = "dn ext 16 mm, espacement entre goutteurs 40 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dn_ext_16_mm_espacement_entre_goutteurs_50_cm_m",
                                                                                                                    nom = "dn ext 16 mm, espacement entre goutteurs 50 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "goutteur_autoregulant_u",
                                                                                                                    nom = "goutteur autorégulant\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "kit_de_depart_dn_20_27_mm_pour_irrigation_goutte_a_goutte_u",
                                                                                                                    nom = "kit de départ dn 20/27 mm pour irrigation goutte à goutte\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 139.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "kit_de_depart_dn_26_34_mm_pour_irrigation_goutte_a_goutte_u",
                                                                                                                    nom = "kit de départ dn 26/34 mm pour irrigation goutte à goutte\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 163.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vanne_d_arret_manuelle_dn_20_27_mm_u",
                                                                                                                    nom = "vanne d'arrêt manuelle, dn 20/27 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.38,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "raccords_a_compression_pour_arrosage_goutte_a_goutte",
                                                                            nom = "Raccords à compression pour arrosage goutte à goutte",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "raccord_droit_u",
                                                                                                                    nom = "raccord droit\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "coude_u",
                                                                                                                    nom = "coude\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "te_droit_u",
                                                                                                                    nom = "té droit\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "adaptateur_male_filete_15x21_ou_20x27_mm_u",
                                                                                                                    nom = "adaptateur mâle fileté 15x21 ou 20x27 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "adaptateur_femelle_filete_15x21_ou_20x27_mm_u",
                                                                                                                    nom = "adaptateur femelle fileté 15x21 ou 20x27 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "bouchon_de_fin_de_ligne_u",
                                                                                                                    nom = "bouchon de fin de ligne\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vannette_dn_13_16_mm_femelle_x_cannelee_u",
                                                                                                                    nom = "vannette dn 13/16 mm, femelle x cannelée\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vannette_dn_13_16_mm_male_x_cannelee_u",
                                                                                                                    nom = "vannette dn 13/16 mm, mâle x cannelée\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vannette_dn_13_16_mm_cannelee_x_cannelee_u",
                                                                                                                    nom = "vannette dn 13/16 mm, cannelée x cannelée\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.53,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "dalle_de_sol_alveolaire_en_pe_hd",
                    nom = "Dalle de sol alvéolaire en PE-HD",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "dalle_de_sol_alveolaire_en_pe_hd_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "dalle_gazon_en_pehd",
                                                                            nom = "Dalle gazon en PEHD",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dalle_gazon_pour_traffic_leger_m",
                                                                                                                    nom = "Dalle gazon pour traffic léger\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalle_gazon_pour_traffic_lourd_hauteur_300_mm_m",
                                                                                                                    nom = "Dalle gazon pour traffic lourd, hauteur 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalle_gazon_pour_traffic_lourd_hauteur_400_mm_m",
                                                                                                                    nom = "Dalle gazon pour traffic lourd, hauteur 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalle_gazon_pour_traffic_lourd_hauteur_500_mm_m",
                                                                                                                    nom = "Dalle gazon pour traffic lourd, hauteur 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 254.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalle_gazon_pre_engazonnee_pour_traffic_leger_m",
                                                                                                                    nom = "Dalle gazon pré engazonnée pour traffic léger\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 259.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalle_gazon_pre_engazonnee_pour_traffic_lourd_m",
                                                                                                                    nom = "Dalle gazon pré engazonnée pour traffic lourd\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 263.48,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "dalle_gravier_en_pehd",
                                                                            nom = "Dalle gravier en PEHD",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "dalle_stabilisatrice_gravier_pour_traffic_leger_pieton_m",
                                                                                                                    nom = "Dalle stabilisatrice gravier pour traffic léger, piéton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dalle_stabilisatrice_gravier_pour_traffic_lourd_m",
                                                                                                                    nom = "Dalle stabilisatrice gravier pour traffic lourd\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 253.2,
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
