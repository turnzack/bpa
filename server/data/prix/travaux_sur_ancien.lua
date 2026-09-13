local M = {}

M.metier = "Travaux sur ancien"
M.ICON = "images/icons/travaux_sur_ancien.png"

M.STRUCTURE = {
    id = "travaux_sur_ancien",
    nom = "Travaux sur ancien",
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
                                                                            id = "carottage_de_beton",
                                                                            nom = "Carottage de béton",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "diametre_50_mm_u",
                                                                                                                    nom = "diamètre 50 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 45.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_100_mm_u",
                                                                                                                    nom = "diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 70.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_150_mm_u",
                                                                                                                    nom = "diamètre 150 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 99.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_200_mm_u",
                                                                                                                    nom = "diamètre 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 123.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_250_mm_u",
                                                                                                                    nom = "diamètre 250 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 156.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_300_mm_u",
                                                                                                                    nom = "diamètre 300 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 185.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "chainage_beton_arme_de_consolidation_m",
                                                                                                                    nom = "Chaînage béton armé de consolidation\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 54.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "chargement_des_ruines_sur_camion_par_engin_mecanique_m",
                                                                                                                    nom = "Chargement des ruines sur camion par engin mécanique\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 312.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "chargement_des_ruines_sur_camion_par_jet_de_pelle_m",
                                                                                                                    nom = "Chargement des ruines sur camion par jet de pelle\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 399.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "consolidation_de_mur_en_pierre_compris_renformis_m",
                                                                                                                    nom = "Consolidation de mur en pierre compris renformis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 295.73,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "consolidation_de_toiture_par_ipn",
                                                                            nom = "Consolidation de toiture par IPN",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "220_mm_m",
                                                                                                                    nom = "220 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 177.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "260_mm_m",
                                                                                                                    nom = "260 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "300_mm_m",
                                                                                                                    nom = "300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 295.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "340_mm_m",
                                                                                                                    nom = "340 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 331.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "360_mm_m",
                                                                                                                    nom = "360 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 407.5,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "demolition_de_bardage",
                                                                            nom = "Démolition de bardage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "metallique_double_peau_m",
                                                                                                                    nom = "métallique, double peau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 220.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "metallique_simple_peau_m",
                                                                                                                    nom = "métallique, simple peau\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_panneaux_m",
                                                                                                                    nom = "en panneaux\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_bois_m",
                                                                                                                    nom = "en bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "demolition_de_boisseaux_terre_cuite_ou_de_pouzzolane",
                                                                            nom = "Démolition de boisseaux terre cuite ou de pouzzolane",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "200x200_mm_m",
                                                                                                                    nom = "200x200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "300x300_mm_m",
                                                                                                                    nom = "300x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 35.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "400x400_mm_m",
                                                                                                                    nom = "400x400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 51.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "demolition_de_conduit_briques",
                                                                            nom = "Démolition de conduit briques",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "100x100_mm_m",
                                                                                                                    nom = "100x100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "200x200_mm_m",
                                                                                                                    nom = "200x200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "300x300_mm_m",
                                                                                                                    nom = "300x300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "300x300_mm_x_100_150_mm_m",
                                                                                                                    nom = "300x300 mm x 100/150 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 36.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "300x300_mm_x_200_300_mm_m",
                                                                                                                    nom = "300x300 mm x 200/300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 310.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "350x350_mm_m",
                                                                                                                    nom = "350x350 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 32.37,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "demolition_de_dalles",
                                                                            nom = "Démolition de dalles",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_dalle_pleine_m",
                                                                                                                    nom = "en dalle pleine\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 315.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_dalle_vide_m",
                                                                                                                    nom = "en dalle vide\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 295.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_dalle_precontrainte_m",
                                                                                                                    nom = "en dalle précontrainte\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 314.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "demolition_de_menuiserie",
                                                                            nom = "Démolition de menuiserie",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_pvc_simple_vitrage_m",
                                                                                                                    nom = "en PVC, simple vitrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 312.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_double_vitrage_m",
                                                                                                                    nom = "en PVC, double vitrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 315.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_bois_simple_vitrage_m",
                                                                                                                    nom = "en bois, simple vitrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 312.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_bois_double_vitrage_m",
                                                                                                                    nom = "en bois, double vitrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 318.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_aluminium_simple_vitrage_m",
                                                                                                                    nom = "en aluminium, simple vitrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 325.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_aluminium_double_vitrage_m",
                                                                                                                    nom = "en aluminium, double vitrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 332.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porte_comprise_serrure_m",
                                                                                                                    nom = "de porte comprise serrure\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 331.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_porte_blindee_m",
                                                                                                                    nom = "de porte blindée\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 373.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_volet_simple_vitrage_m",
                                                                                                                    nom = "de volet simple vitrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 311.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_volet_double_vitrage_m",
                                                                                                                    nom = "de volet double vitrage\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 314.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_volet_roulant_m",
                                                                                                                    nom = "de volet roulant\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 317.64,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "demolition_de_murs",
                                                                            nom = "Démolition de murs",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_maconnerie_m",
                                                                                                                    nom = "en maçonnerie\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_beton_m",
                                                                                                                    nom = "en béton\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_agglo_m",
                                                                                                                    nom = "en agglo\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_brique_creuses_m",
                                                                                                                    nom = "en brique creuses\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_brique_pleine_m",
                                                                                                                    nom = "en brique pleine\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 211.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pierre_m",
                                                                                                                    nom = "en pierre\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pierre_sec_m",
                                                                                                                    nom = "en pierre sèche\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 244.16,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "doublage_interieur_de_mur",
                                                                            nom = "Doublage intérieur de mur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "y_compris_finition_1_face_m",
                                                                                                                    nom = "y compris finition, 1 face\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "y_compris_finition_2_faces_m",
                                                                                                                    nom = "y compris finition, 2 faces\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 220.76,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_dans_roche",
                                                                            nom = "Excavation dans roche",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_la_masse_a_percussion_m",
                                                                                                                    nom = "à la masse à percussion\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 345.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_la_masse_a_percussion_martelage_continu_m",
                                                                                                                    nom = "à la masse à percussion, martelage continu\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 352.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "au_compresseur_m",
                                                                                                                    nom = "au compresseur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 358.44,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_depuis_le_haut_d_une_fosse",
                                                                            nom = "Excavation depuis le haut d'une fosse",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_terre_argileuse_m",
                                                                                                                    nom = "en terre argileuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 313.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_vegetale_m",
                                                                                                                    nom = "en terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 313.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_dur_m",
                                                                                                                    nom = "en terre dur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 323.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sableuse_m",
                                                                                                                    nom = "en terre sableuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 312.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sols_organiques_m",
                                                                                                                    nom = "en terre, sols organiques\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 315.96,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_en_sous_oeuvre",
                                                                            nom = "Excavation en sous-oeuvre",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_terre_argileuse_m",
                                                                                                                    nom = "en terre argileuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 325.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_vegetale_m",
                                                                                                                    nom = "en terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 324.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_dur_m",
                                                                                                                    nom = "en terre dur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 333.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sableuse_m",
                                                                                                                    nom = "en terre sableuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 323.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sols_organiques_m",
                                                                                                                    nom = "en terre, sols organiques\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 326.28,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_en_terre_dur_avec_compresseur",
                                                                            nom = "Excavation en terre dur, avec compresseur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "m",
                                                                                                                    nom = "\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 355.56,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_sous_eau",
                                                                            nom = "Excavation sous eau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "m",
                                                                                                                    nom = "\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 323.4,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_sous_mur_ou_dalle",
                                                                            nom = "Excavation sous mur ou dalle",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "par_terre_argileuse_m",
                                                                                                                    nom = "par terre argileuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 332.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_terre_vegetale_m",
                                                                                                                    nom = "par terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 331.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_terre_dur_m",
                                                                                                                    nom = "par terre dur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 340.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_terre_sableuse_m",
                                                                                                                    nom = "par terre sableuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 330.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "par_terre_sols_organiques_m",
                                                                                                                    nom = "par terre, sols organiques\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 333.48,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_sur_terrain_echu",
                                                                            nom = "Excavation sur terrain échu",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_terre_argileuse_m",
                                                                                                                    nom = "en terre argileuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 316.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_vegetale_m",
                                                                                                                    nom = "en terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 315.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_dur_m",
                                                                                                                    nom = "en terre dur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 325.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sableuse_m",
                                                                                                                    nom = "en terre sableuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 315.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sols_organiques_m",
                                                                                                                    nom = "en terre, sols organiques\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 318.12,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_sur_terrain_echu_avec_compresseur",
                                                                            nom = "Excavation sur terrain échu, avec compresseur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "m",
                                                                                                                    nom = "\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 347.4,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_sur_terrain_non_echu",
                                                                            nom = "Excavation sur terrain non échu",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_terre_argileuse_m",
                                                                                                                    nom = "en terre argileuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 331.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_vegetale_m",
                                                                                                                    nom = "en terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 330.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_dur_m",
                                                                                                                    nom = "en terre dur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 340.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sableuse_m",
                                                                                                                    nom = "en terre sableuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 329.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sols_organiques_m",
                                                                                                                    nom = "en terre, sols organiques\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 332.28,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_sur_terrain_non_echu_avec_compresseur",
                                                                            nom = "Excavation sur terrain non échu, avec compresseur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "m",
                                                                                                                    nom = "\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 354.12,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_transversale",
                                                                            nom = "Excavation transversale",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_terre_argileuse_m",
                                                                                                                    nom = "en terre argileuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 324.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_vegetale_m",
                                                                                                                    nom = "en terre végétale\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 323.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_dur_m",
                                                                                                                    nom = "en terre dur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 333,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sableuse_m",
                                                                                                                    nom = "en terre sableuse\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 322.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_terre_sols_organiques_m",
                                                                                                                    nom = "en terre, sols organiques\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 325.8,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "excavation_transversale_avec_compresseur",
                                                                            nom = "Excavation transversale, avec compresseur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "m",
                                                                                                                    nom = "\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 353.4,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "finition_de_demolition",
                                                                            nom = "Finition de démolition",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "ramassage_des_dechets_m",
                                                                                                                    nom = "Ramassage des déchets\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 315.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "nettoyage_des_murs_m",
                                                                                                                    nom = "Nettoyage des murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 326.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "retrait_des_element_en_acier_m",
                                                                                                                    nom = "Retrait des élément en acier\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 323.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "retrait_des_elements_en_bois_m",
                                                                                                                    nom = "Retrait des éléments en bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 314.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "retrait_des_elements_en_platre_m",
                                                                                                                    nom = "Retrait des éléments en plâtre\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 312.36,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "injection_sous_mur",
                                                                            nom = "Injection sous mur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "m",
                                                                                                                    nom = "\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3250.44,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "ouvertures_dans_murs_porteurs_isoles_par_beton_cellulaire",
                                                                            nom = "Ouvertures dans murs porteurs isolés par béton cellulaire",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "120_mm_1_m_m",
                                                                                                                    nom = "120 mm, 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 415.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "120_mm_le_metre_supplementaire_m",
                                                                                                                    nom = "120 mm, le mètre supplémentaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 429.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "140_mm_1_m_m",
                                                                                                                    nom = "140 mm, 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 487.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "140_mm_le_metre_supplementaire_m",
                                                                                                                    nom = "140 mm, le mètre supplémentaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 528.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "160_mm_1_m_m",
                                                                                                                    nom = "160 mm, 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 598.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "160_mm_le_metre_supplementaire_m",
                                                                                                                    nom = "160 mm, le mètre supplémentaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 555.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "180_mm_1_m_m",
                                                                                                                    nom = "180 mm, 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 637.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "180_mm_le_metre_supplementaire_m",
                                                                                                                    nom = "180 mm, le mètre supplémentaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 568.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "200_mm_1_m_m",
                                                                                                                    nom = "200 mm, 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 663.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "200_mm_le_metre_supplementaire_m",
                                                                                                                    nom = "200 mm, le mètre supplémentaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 593.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "220_mm_1_m_m",
                                                                                                                    nom = "220 mm, 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 702.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "220_mm_le_metre_supplementaire_m",
                                                                                                                    nom = "220 mm, le mètre supplémentaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 617.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "240_mm_1_m_m",
                                                                                                                    nom = "240 mm, 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 740.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "240_mm_le_metre_supplementaire_m",
                                                                                                                    nom = "240 mm, le mètre supplémentaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 642.7,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "refection_d_embrasures_et_appuis_de_baies",
                                                                            nom = "Réfection d'embrasures et appuis de baies",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "d_embrasures_largeur_200_350_mm_m",
                                                                                                                    nom = "d'embrasures largeur 200/350 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 81.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "d_appui_de_fenetre_m",
                                                                                                                    nom = "d'appui de fenêtre\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 121.29,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "remaniement_de_tuiles",
                                                                            nom = "Remaniement de tuiles",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "tuile_canal_ou_romane_m",
                                                                                                                    nom = "tuile canal ou romane\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tuile_mecanique_m",
                                                                                                                    nom = "tuile mécanique\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 236.63,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "sciage_beton",
                                                                            nom = "Sciage béton",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_beton_100_mm_m",
                                                                                                                    nom = "épaisseur béton 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_beton_150_mm_m",
                                                                                                                    nom = "épaisseur béton 150 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_beton_200_mm_m",
                                                                                                                    nom = "épaisseur béton 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "forfait_d_usure_disque_diamante_au_millimetre_u",
                                                                                                                    nom = "forfait d'usure disque diamanté au millimètre\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 105.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "stockage_des_ruines_en_container",
                                                                            nom = "Stockage des ruines en container",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "5_m3_u",
                                                                                                                    nom = "5 m3\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 340.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "10_m3_u",
                                                                                                                    nom = "10 m3\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 405.67,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "terrassement_en_sous_oeuvre_pour_consolidation",
                                                                            nom = "Terrassement en sous-oeuvre pour consolidation",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_tranchee_sous_mur_m",
                                                                                                                    nom = "en tranchée sous mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3141.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_puits_sous_mur_m",
                                                                                                                    nom = "en puits sous mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3160.75,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "traitement_des_remontees_d_humidite_dans_les_murs",
                                                                            nom = "Traitement des remontées d'humidité dans les murs",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_mur_100_mm_m",
                                                                                                                    nom = "épaisseur mur 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_mur_200_mm_m",
                                                                                                                    nom = "épaisseur mur 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_mur_300_mm_m",
                                                                                                                    nom = "épaisseur mur 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_mur_400_mm_m",
                                                                                                                    nom = "épaisseur mur 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 44.56,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "traitement_des_infiltrations",
                                                                            nom = "Traitement des infiltrations",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "obturation_d_infiltrations_murales_par_mortier_a_prise_ultra_rapide_225_cm3_u",
                                                                                                                    nom = "Obturation d'infiltrations murales par mortier à prise ultra-rapide (225 cm3)\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "obturation_d_infiltrations_murales_par_mortier_a_prise_ultra_rapide_100_cm3_u",
                                                                                                                    nom = "Obturation d'infiltrations murales par mortier à prise ultra-rapide (100 cm3)\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "impermeabilisation_des_murs_enterres_m",
                                                                                                                    nom = "Imperméabilisation des murs enterrés\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.83,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "transport_des_ruines_par_camion_a_la_decharge_publique",
                                                                            nom = "Transport des ruines par camion à la décharge publique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "aux_decharges_publiques_a_2_km_m",
                                                                                                                    nom = "aux décharges publiques à 2 km\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 316.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "aux_decharges_publiques_a_5_km_m",
                                                                                                                    nom = "aux décharges publiques, à 5 km\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 329.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "aux_decharges_publiques_a_10_km_m",
                                                                                                                    nom = "aux décharges publiques à 10 km\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 335.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "aux_decharges_publiques_le_km_supplementaire_m",
                                                                                                                    nom = "aux décharges publiques, le km supplémentaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 32.95,
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