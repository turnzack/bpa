local M = {}

M.metier = "Revêtements muraux"
M.ICON = "images/icons/revetements_muraux.png"

M.STRUCTURE = {
    id = "revetements_muraux",
    nom = "Revêtements muraux",
    type = "LOT",
    children = {
        {
                    id = "travaux_preparatoire",
                    nom = "Travaux préparatoire",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "travaux_preparatoire_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "arrachage_de_liege",
                                                                            nom = "Arrachage de liège",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.56,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrachage_de_moquette",
                                                                            nom = "Arrachage de moquette",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.95,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrachage_de_papier_peint_gaufre_ou_satine",
                                                                            nom = "Arrachage de papier peint, gaufré ou satiné",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_ou_2_epaisseurs_sur_mur_m",
                                                                                                                    nom = "1 ou 2 épaisseurs, Sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_de_2_epaisseurs_sur_mur_m",
                                                                                                                    nom = "plus de 2 épaisseurs, Sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.56,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrachage_de_papier_peint_ordinaire",
                                                                            nom = "Arrachage de papier peint, ordinaire",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "1_ou_2_epaisseurs_sur_mur_m",
                                                                                                                    nom = "1 ou 2 épaisseurs, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_de_2_epaisseurs_sur_mur_m",
                                                                                                                    nom = "plus de 2 épaisseurs, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.61,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrachage_de_revetements_plastiques",
                                                                            nom = "Arrachage de revêtements plastiques",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrachage_de_revetements_plastique_avec_brulage",
                                                                            nom = "Arrachage de revêtements plastique avec brûlage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 223.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrachage_de_tissus",
                                                                            nom = "Arrachage de tissus",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.25,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "arrachage_partiel_de_liege",
                                                                            nom = "Arrachage partiel de liège",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.81,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "calicot",
                                                                            nom = "Calicot",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plafond_m",
                                                                                                                    nom = "sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.1,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "decoupes_d_ouvertures",
                                                                            nom = "Découpes d'ouvertures",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "d_une_ouverture_sur_mur_u",
                                                                                                                    nom = "d'une ouverture sur mur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 30.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_2_ouvertures_sur_meme_mur_u",
                                                                                                                    nom = "de 2 ouvertures sur même mur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 73.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_3_ouvertures_sur_meme_mur_u",
                                                                                                                    nom = "de 3 ouvertures sur même mur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 125.92,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "encollage",
                                                                            nom = "Encollage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "simple_encollage_sur_mur_m",
                                                                                                                    nom = "simple encollage, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_encollage_sur_mur_m",
                                                                                                                    nom = "double encollage, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "simple_encollage_sur_plafond_m",
                                                                                                                    nom = "simple encollage, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_encollage_sur_plafond_m",
                                                                                                                    nom = "double encollage, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.11,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "fixation_des_fonds_par_peinture_appropriee",
                                                                            nom = "Fixation des fonds par peinture appropriée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.5,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "papier_d_appret",
                                                                            nom = "Papier d'apprêt",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plafond_m",
                                                                                                                    nom = "sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pose_de_papier_plomb_m",
                                                                                                                    nom = "Pose de papier plomb\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 235.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "reprise_de_joints_a_l_enduit_m",
                                                                                                                    nom = "Reprise de joints à l'enduit\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.52,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "papiers_peints",
                                                                            nom = "Papiers peints",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "galon_papier_m",
                                                                                                                    nom = "Galon papier\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "galon_plastiques_m",
                                                                                                                    nom = "Galon plastiques\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "galon_type_lincrusta_m",
                                                                                                                    nom = "Galon type Lincrusta\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2.53,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "papier_peint_metallique",
                                                                            nom = "Papier peint métallique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plafond_m",
                                                                                                                    nom = "sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.26,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "papier_peint_standard",
                                                                            nom = "Papier peint standard",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_joints_vifs_sur_mur_m",
                                                                                                                    nom = "à joints vifs, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_raccord_sur_mur_m",
                                                                                                                    nom = "à raccord, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_raccord_sur_mur_m",
                                                                                                                    nom = "sans raccord, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_joints_vifs_sur_plafond_m",
                                                                                                                    nom = "à joints vifs, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 213.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_raccord_sur_plafond_m",
                                                                                                                    nom = "à raccord, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sans_raccord_sur_plafond_m",
                                                                                                                    nom = "sans raccord, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "papier_peint_velours",
                                                                            nom = "Papier peint velours",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 215.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plafond_m",
                                                                                                                    nom = "sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 221.45,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "papier_peint_vitrail",
                                                                            nom = "Papier peint vitrail",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "largeur_250_mm_sur_mur_m",
                                                                                                                    nom = "largeur 250 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 210.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_superieure_a_250_mm_sur_mur_m",
                                                                                                                    nom = "largeur supérieure à 250 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.23,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "tissus",
                                                                            nom = "Tissus",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "couture_de_tissus_imprimes_m",
                                                                                                                    nom = "Couture de tissus imprimés\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "couture_de_tissus_unis_m",
                                                                                                                    nom = "Couture de tissus unis\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "ouate_m",
                                                                                                                    nom = "Ouate\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 214.44,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "tissus_en_pose_a_joints_vifs",
                                                                            nom = "Tissus en pose à joints vifs",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "largeur_600_mm_sur_mur_m",
                                                                                                                    nom = "largeur 600 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_700_mm_sur_mur_m",
                                                                                                                    nom = "largeur 700 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_800_mm_sur_mur_m",
                                                                                                                    nom = "largeur 800 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_900_mm_sur_mur_m",
                                                                                                                    nom = "largeur 900 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1000_mm_sur_mur_m",
                                                                                                                    nom = "largeur 1000 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1100_mm_sur_mur_m",
                                                                                                                    nom = "largeur 1100 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1200_mm_sur_mur_m",
                                                                                                                    nom = "largeur 1200 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1300_mm_sur_mur_m",
                                                                                                                    nom = "largeur 1300 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1400_mm_sur_mur_m",
                                                                                                                    nom = "largeur 1400 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 30.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1500_mm_sur_mur_m",
                                                                                                                    nom = "largeur 1500 mm, sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grande_largeur_2_50_m_colle_en_perimetre_des_murs_m",
                                                                                                                    nom = "grande largeur (2,50 m) collé en périmétre des murs\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_600_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 600 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_700_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 700 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_800_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 800 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_900_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 900 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1000_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 1000 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 30.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1100_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 1100 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 32.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1200_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 1200 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 36.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1300_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 1300 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 40.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1400_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 1400 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largeur_1500_mm_sur_plafond_m",
                                                                                                                    nom = "largeur 1500 mm, sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 45.24,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "tissus_en_pose_tendue",
                                                                            nom = "Tissus en pose tendue",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "sur_mur_m",
                                                                                                                    nom = "sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sur_plafond_m",
                                                                                                                    nom = "sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 248.88,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "moquettes",
                                                                            nom = "Moquettes",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "moquette_aiguilletee_sur_mur_m",
                                                                                                                    nom = "Moquette aiguilletée sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 225.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moquette_avec_support_pvc_sur_mur_m",
                                                                                                                    nom = "Moquette avec support PVC sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 226.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moquette_en_dalles_sur_plafond_m",
                                                                                                                    nom = "Moquette en dalles sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moquette_en_les_sur_plafond_m",
                                                                                                                    nom = "Moquette en lés sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.13,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "revetements_plastiques",
                    nom = "Revêtements plastiques",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "revetements_plastiques_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "linoleum",
                                                                            nom = "Linoléum",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_jusqu_a_4_mm_m",
                                                                                                                    nom = "épaisseur jusqu'à 4 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "de_plus_de_4_mm_d_epaisseur_m",
                                                                                                                    nom = "de plus de 4 mm d'épaisseur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "revetement_plastique_en_dalles_sur_plafond_m",
                                                                                                                    nom = "Revêtement plastique en dalles sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 226.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "revetement_plastique_en_les_sur_plafond_m",
                                                                                                                    nom = "Revêtement plastique en lés sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 229.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "revetement_plastique_support_feutre_m",
                                                                                                                    nom = "Revêtement plastique support feutre\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 326.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "revetement_plastique_support_pvc_m",
                                                                                                                    nom = "Revêtement plastique support PVC\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "revetement_plastique_type_buflon_m",
                                                                                                                    nom = "Revêtement plastique type Buflon\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "soudure_des_joints_m",
                                                                                                                    nom = "Soudure des joints\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.51,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lambris_pvc_sur_plafond",
                                                                            nom = "Lambris PVC sur plafond",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_sur_plafond_m",
                                                                                                                    nom = "pose seule sur plafond\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 242.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_10_ht_m2_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 10 ¤ HT/m2>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_12_ht_m2_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 12 ¤ HT/m2>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 261.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_14_ht_m2_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 14 ¤ HT/m2>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 264.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_16_ht_m2_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 16 ¤ HT/m2>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 267.6,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "lambris_pvc_sur_mur",
                                                                            nom = "Lambris PVC sur mur",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pose_seule_sur_mur_m",
                                                                                                                    nom = "pose seule sur mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_10_ht_m2_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 10 ¤ HT/m2>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 246.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_12_ht_m2_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 12 ¤ HT/m2>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_14_ht_m2_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 14 ¤ HT/m2>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "fourniture_et_pose_prix_d_achat_16_ht_m2_m",
                                                                                                                    nom = "fourniture et pose <prix d'achat 16 ¤ HT/m2>\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 255.87,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "revetement_en_liege",
                    nom = "Revêtement en liège",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "revetement_en_liege_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "revetement_mural_en_plaque_de_liege",
                                                                            nom = "Revêtement mural en plaque de liège",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_plaque_dimensions_1000x500x5_mm_m",
                                                                                                                    nom = "en plaque dimensions 1000x500x5 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 230.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plaque_dimensions_1000x500x6_mm_m",
                                                                                                                    nom = "en plaque dimensions 1000x500x6 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.47,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_mural_en_rouleau_de_liege",
                                                                            nom = "revêtement mural en rouleau de liège",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_rouleau_epaisseur_2_mm_largeur_1_m_m",
                                                                                                                    nom = "en rouleau, épaisseur 2 mm, largeur 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_rouleau_epaisseur_3_mm_largeur_1_m_m",
                                                                                                                    nom = "en rouleau, épaisseur 3 mm, largeur 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_rouleau_epaisseur_4_mm_largeur_1_m_m",
                                                                                                                    nom = "en rouleau, épaisseur 4 mm, largeur 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_rouleau_epaisseur_6_mm_largeur_1_m_m",
                                                                                                                    nom = "en rouleau, épaisseur 6 mm, largeur 1 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 233.15,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "revetement_mural_en_liege_projete",
                                                                            nom = "revêtement mural en liège projeté",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "liege_projete_m",
                                                                                                                    nom = "liège projeté\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 249.68,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "revetement_isolant_en_plaque_de_polystyrene_mince",
                    nom = "Revêtement isolant en plaque de polystyrène mince",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "revetement_isolant_en_plaque_de_polystyrene_mince_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "plaque_de_polystyrene_mince_type_depron_ou_similaire",
                                                                            nom = "Plaque de polystyrène mince type Depron ou similaire",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_3_mm_m",
                                                                                                                    nom = "épaisseur 3 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_6_mm_m",
                                                                                                                    nom = "épaisseur 6 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 224.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_9_mm_m",
                                                                                                                    nom = "épaisseur 9 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 226.28,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "main_courante",
                    nom = "Main courante",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "main_courante_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "main_courante_ronde_40_mm_pare_chocs_type_escort",
                                                                            nom = "Main courante ronde 40 mm pare-chocs type Escort",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "gainee_pvc_classe_m1_ronde_diametre_40_mm_m",
                                                                                                                    nom = "gainée PVC classé M1, ronde, diamètre 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 46.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "anodisee_ronde_diametre_40_mm_m",
                                                                                                                    nom = "anodisée, ronde, diamètre 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "decowood_ronde_diametre_40_mm_m",
                                                                                                                    nom = "Décowood, ronde, diamètre 40 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 51.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_retour_mur_m",
                                                                                                                    nom = "embout retour mur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_retour_mur_decor_bois_m",
                                                                                                                    nom = "embout retour mur Décor bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "piece_de_finition_en_pvc_m",
                                                                                                                    nom = "pièce de finition en PVC\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "piece_de_finition_decor_bois_m",
                                                                                                                    nom = "pièce de finition Décor bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_a_90_pvc_m",
                                                                                                                    nom = "Angle interne à 90° PVC\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_a_90_pvc_m",
                                                                                                                    nom = "Angle externe à 90° PVC\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_a_90_decor_bois_m",
                                                                                                                    nom = "Angle interne à 90° Décor bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_a_90_decor_bois_m",
                                                                                                                    nom = "Angle externe à 90° Décor bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_raccord_de_pente_de_90_a_160_pvc_m",
                                                                                                                    nom = "Angle raccord de pente de 90° à 160° PVC\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_raccord_de_pente_de_90_a_160_decor_bois_m",
                                                                                                                    nom = "Angle raccord de pente de 90° à 160° Décor bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "piece_de_jonction_en_aluminium_m",
                                                                                                                    nom = "Pièce de jonction en aluminium\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "coude_raccord_de_pente_decor_bois_m",
                                                                                                                    nom = "Coude raccord de pente Décor bois\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "coude_raccord_de_pente_pvc_m",
                                                                                                                    nom = "Coude raccord de pente PVC\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "main_courante_90_mm_pare_chocs_type_starline",
                                                                            nom = "Main courante 90 mm pare-chocs type Starline",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "gainee_pvc_classe_m1_hauteur_90_mm_m",
                                                                                                                    nom = "gainée PVC classé M1, hauteur 90 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "anodisee_hauteur_90_mm_m",
                                                                                                                    nom = "anodisée, hauteur 90 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 63.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "decowood_hauteur_90_mm_m",
                                                                                                                    nom = "Décowood, hauteur 90 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 64.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_retour_mur_u",
                                                                                                                    nom = "embout retour mur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_a_90_u",
                                                                                                                    nom = "angle interne à 90°\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_a_90_u",
                                                                                                                    nom = "angle externe à 90°\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "piece_de_finition_en_pvc_u",
                                                                                                                    nom = "Pièce de finition en PVC\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_retour_mur_decowood_u",
                                                                                                                    nom = "Embout retour mur, Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_a_90_decowood_u",
                                                                                                                    nom = "angle interne à 90°, Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_a_90_decowood_u",
                                                                                                                    nom = "angle externe à 90°, Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "piece_de_finition_en_pvc_decowood_u",
                                                                                                                    nom = "Pièce de finition en PVC, Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.23,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "main_courante_140_mm_pare_chocs_type_performer_2",
                                                                            nom = "Main courante 140 mm pare-chocs type Performer 2",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_pvc_classe_m1_hauteur_140_mm_m",
                                                                                                                    nom = "en PVC classé M1, hauteur 140 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 74.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_angle_externe_a_90",
                                                                                                                    nom = "en PVC, angle externe à 90°",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_retour_mur_pvc",
                                                                                                                    nom = "Embout retour mur PVC",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "piece_de_finition_en_pvc",
                                                                                                                    nom = "Pièce de finition en PVC",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "protection_murale",
                    nom = "Protection murale",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "protection_murale_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "protection_murale_horizontale_anti_chocs_sur_rail_aluminium",
                                                                            nom = "Protection murale horizontale anti-chocs sur rail aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_archan_en_pvc_hauteur_75_mm_m",
                                                                                                                    nom = "type Archan, en PVC, hauteur 75 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 56.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_alinea_en_pvc_hauteur_120_mm_m",
                                                                                                                    nom = "type Alinéa, en PVC, hauteur 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_alinea_en_pvc_hauteur_200_mm_m",
                                                                                                                    nom = "type Alinéa, en PVC, hauteur 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 70.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_impact_en_pvc_hauteur_60_mm_m",
                                                                                                                    nom = "type Impact, en PVC, hauteur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 49.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_impact_en_pvc_hauteur_120_mm_m",
                                                                                                                    nom = "type Impact, en PVC, hauteur 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 58.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_impact_en_pvc_hauteur_200_mm_m",
                                                                                                                    nom = "type Impact, en PVC, hauteur 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 67.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_alinea_hauteur_120_mm_u",
                                                                                                                    nom = "Embout en PVC, type Alinéa, hauteur 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_alinea_hauteur_200_mm_u",
                                                                                                                    nom = "Embout en PVC, type Alinéa, hauteur 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_impact_hauteur_60_mm_u",
                                                                                                                    nom = "Embout en PVC, type Impact, hauteur 60 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_impact_hauteur_120_mm_u",
                                                                                                                    nom = "Embout en PVC, type Impact, hauteur 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_impact_hauteur_200_mm_u",
                                                                                                                    nom = "Embout en PVC, type Impact, hauteur 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_alinea_120_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Alinéa 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_alinea_200_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Alinéa 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_impact_60_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Impact 60 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_impact_120_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Impact 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_impact_200_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Impact 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_alinea_120_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Alinéa 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_alinea_200_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Alinéa 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_impact_60_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Impact 60 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_impact_120_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Impact 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_impact_200_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Impact 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.37,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "protection_murale_horizontale_anti_chocs_sur_clip_aluminium",
                                                                            nom = "Protection murale horizontale anti-chocs sur clip aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_alinea_en_pvc_hauteur_120_mm_m",
                                                                                                                    nom = "type Alinéa, en PVC, hauteur 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 44.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_alinea_en_pvc_hauteur_200_mm_m",
                                                                                                                    nom = "type Alinéa, en PVC, hauteur 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 51.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_impact_en_pvc_hauteur_60_mm_m",
                                                                                                                    nom = "type Impact, en PVC, hauteur 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_impact_en_pvc_hauteur_120_mm_m",
                                                                                                                    nom = "type Impact, en PVC, hauteur 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 44.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_impact_en_pvc_hauteur_200_mm_m",
                                                                                                                    nom = "type Impact, en PVC, hauteur 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_alinea_hauteur_120_mm_u",
                                                                                                                    nom = "Embout en PVC, type Alinéa, hauteur 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_alinea_hauteur_200_mm_u",
                                                                                                                    nom = "Embout en PVC, type Alinéa, hauteur 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_impact_hauteur_60_mm_u",
                                                                                                                    nom = "Embout en PVC, type Impact, hauteur 60 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_impact_hauteur_120_mm_u",
                                                                                                                    nom = "Embout en PVC, type Impact, hauteur 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "embout_en_pvc_type_impact_hauteur_200_mm_u",
                                                                                                                    nom = "Embout en PVC, type Impact, hauteur 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_alinea_120_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Alinéa 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_alinea_200_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Alinéa 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_impact_60_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Impact 60 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_impact_120_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Impact 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_externe_90_en_pvc_type_impact_200_mm_u",
                                                                                                                    nom = "angle externe 90° en PVC, type Impact 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_alinea_120_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Alinéa 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_alinea_200_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Alinéa 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_impact_60_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Impact 60 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_impact_120_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Impact 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_interne_90_en_pvc_type_impact_200_mm_u",
                                                                                                                    nom = "angle interne 90° en PVC, type Impact 200 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.37,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "protection_des_angles",
                                                                            nom = "Protection des angles",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "corniere_a_90_type_profila_en_pvc_classe_m1_30_mm_m",
                                                                                                                    nom = "Cornière à 90° type Profila en PVC classé M1, 30 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "corniere_a_90_type_profila_en_pvc_classe_m1_50_mm_m",
                                                                                                                    nom = "Cornière à 90° type Profila en PVC classé M1, 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "corniere_a_angle_variable_de_70_a_135_type_protecta_2_en_pvc_classe_m1_60_mm_m",
                                                                                                                    nom = "Cornière à angle variable, de 70° à 135° type Protecta 2 en PVC classé M1, 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "corniere_a_90_en_inox_30_mm_m",
                                                                                                                    nom = "Cornière à 90° en inox 30 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "corniere_a_90_en_inox_50_mm_m",
                                                                                                                    nom = "Cornière à 90° en inox 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 36.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "corniere_a_90_type_cornea_en_pvc_classe_m1_sur_platine_aluminium_60_mm_m",
                                                                                                                    nom = "Cornière à 90° type Cornéa en PVC classé M1, sur platine aluminium, 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 34.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "corniere_a_135_type_corneaflex_en_pvc_classe_m1_sur_platine_aluminium_60_mm_m",
                                                                                                                    nom = "Cornière à 135° type Cornéaflex en PVC classé M1, sur platine aluminium, 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "corniere_a_angle_variable_de_90_a_135_type_corneaflex_en_pvc_classe_m1_sur_platine_aluminium_60_mm_m",
                                                                                                                    nom = "Cornière à angle variable, de 90° à 135° type Cornéaflex, en PVC classé M1, sur platine aluminium, 60 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "corniere_ronde_a_90_type_capcorn_en_pvc_classe_m1_sur_platine_aluminium_45_mm_m",
                                                                                                                    nom = "Cornière ronde à 90° type Capcorn, en PVC classé M1, sur platine aluminium, 45 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 34.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "bouchon_135_en_pvc_u",
                                                                                                                    nom = "Bouchon 135° en PVC\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "bouchon_90_en_pvc_u",
                                                                                                                    nom = "Bouchon 90° en PVC\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.65,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plaque_de_protection",
                                                                            nom = "Plaque de protection",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "murale_type_contact_en_pvc_hauteur_120_mm_m",
                                                                                                                    nom = "murale, type Contact, en PVC, hauteur 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "murale_type_contact_en_pvc_hauteur_200_mm_m",
                                                                                                                    nom = "murale, type Contact, en PVC, hauteur 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "murale_type_contact_en_pvc_hauteur_350_mm_m",
                                                                                                                    nom = "murale, type Contact, en PVC, hauteur 350 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "murale_type_decochoc_en_pvc_hauteur_1300_mm_m",
                                                                                                                    nom = "murale, type Décochoc, en PVC, hauteur 1300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 71.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "murale_type_decoclean_en_pvc_hauteur_1300_mm_m",
                                                                                                                    nom = "murale, type Décoclean, en PVC, hauteur 1300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 76.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "murale_type_decotrend_en_pvc_hauteur_1300_mm_m",
                                                                                                                    nom = "murale, type Décotrend, en PVC, hauteur 1300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 89.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "murale_type_decowood_en_pvc_hauteur_1300_mm_m",
                                                                                                                    nom = "murale, type Décowood, en PVC, hauteur 1300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 89.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "murale_type_decochoc_panneau_educatif_en_pvc_dimensions_1300x750_mm_m",
                                                                                                                    nom = "murale, type Décochoc panneau éducatif, en PVC, dimensions 1300x750 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 175.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "murale_type_decochoc_fresque_petite_enfance_en_pvc_hauteur_1300_mm_m",
                                                                                                                    nom = "murale, type Décochoc fresque petite enfance, en PVC, hauteur 1300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 179.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "murale_type_decochoc_fresque_contemporaine_en_pvc_hauteur_1300_mm_m",
                                                                                                                    nom = "murale, type Décochoc fresque contemporaine, en PVC, hauteur 1300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 111.12,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_tete_de_lit_type_bedkit_la_paire_u",
                                                                                                                    nom = "pour tête de lit type Bedkit, la paire\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 338.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "profile_de_jonction_en_aluminium_m",
                                                                                                                    nom = "Profilé de jonction en aluminium\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "profile_de_finition_en_aluminium_m",
                                                                                                                    nom = "Profilé de finition en aluminium\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.74,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plaque_de_proprete",
                                                                            nom = "Plaque de propreté",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "delta_hauteur_500_mm_type_decowood_u",
                                                                                                                    nom = "delta, hauteur 500 mm, type Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "delta_hauteur_400_mm_type_decowood_u",
                                                                                                                    nom = "delta, hauteur 400 mm, type Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "delta_hauteur_300_mm_type_decowood_u",
                                                                                                                    nom = "delta, hauteur 300 mm, type Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "delta_hauteur_500_mm_type_decotrend_u",
                                                                                                                    nom = "delta, hauteur 500 mm, type Décotrend\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "delta_hauteur_400_mm_type_decotrend_u",
                                                                                                                    nom = "delta, hauteur 400 mm, type Décotrend\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "delta_hauteur_300_mm_type_decotrend_u",
                                                                                                                    nom = "delta, hauteur 300 mm, type Décotrend\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "delta_hauteur_500_mm_type_decochoc_u",
                                                                                                                    nom = "delta, hauteur 500 mm, type Décochoc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "delta_hauteur_400_mm_type_decochoc_u",
                                                                                                                    nom = "delta, hauteur 400 mm, type Décochoc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "delta_hauteur_300_mm_type_decochoc_u",
                                                                                                                    nom = "delta, hauteur 300 mm, type Décochoc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_demi_lune_hauteur_500_mm_type_decowood_u",
                                                                                                                    nom = "en demi-lune, hauteur 500 mm, type Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_demi_lune_hauteur_400_mm_type_decowood_u",
                                                                                                                    nom = "en demi-lune, hauteur 400 mm, type Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_demi_lune_hauteur_300_mm_type_decowood_u",
                                                                                                                    nom = "en demi-lune, hauteur 300 mm, type Décowood\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_demi_lune_hauteur_500_mm_type_decotrend_u",
                                                                                                                    nom = "en demi-lune, hauteur 500 mm, type Décotrend\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_demi_lune_hauteur_400_mm_type_decotrend_u",
                                                                                                                    nom = "en demi-lune, hauteur 400 mm, type Décotrend\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_demi_lune_hauteur_300_mm_type_decotrend_u",
                                                                                                                    nom = "en demi-lune, hauteur 300 mm, type Décotrend\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_demi_lune_hauteur_500_mm_type_decochoc_u",
                                                                                                                    nom = "en demi-lune, hauteur 500 mm, type Décochoc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_demi_lune_hauteur_400_mm_type_decochoc_u",
                                                                                                                    nom = "en demi-lune, hauteur 400 mm, type Décochoc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_demi_lune_hauteur_300_mm_type_decochoc_u",
                                                                                                                    nom = "en demi-lune, hauteur 300 mm, type Décochoc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.48,
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
