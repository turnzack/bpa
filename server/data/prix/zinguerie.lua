local M = {}

M.metier = "Zinguerie"
M.ICON = "images/icons/zinguerie.png"

M.STRUCTURE = {
    id = "zinguerie",
    nom = "Zinguerie",
    type = "LOT",
    children = {
        {
                    id = "acier_galvanise",
                    nom = "Acier galvanisé",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "acier_galvanise_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "coude_en_acier_galvanise",
                                                                            nom = "Coude en acier galvanisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "male_femelle_70_diametre_75_mm_u",
                                                                                                                    nom = "mâle/Femelle 70°, diamètre 75 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_70_diametre_87_mm_u",
                                                                                                                    nom = "mâle/Femelle 70°, diamètre 87 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_70_diametre_100_mm_u",
                                                                                                                    nom = "mâle/Femelle 70°, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_70_diametre_120_mm_u",
                                                                                                                    nom = "mâle/Femelle 70°, diamètre 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.17,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "descente_ep_en_acier_galvanise",
                                                                            nom = "Descente EP en acier galvanisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_acier_galvanise_diametre_87_mm_m",
                                                                                                                    nom = "en acier galvanisé, diamètre 87 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_acier_galvanise_diametre_75_mm_m",
                                                                                                                    nom = "en acier galvanisé, diamètre 75 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 39.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_acier_galvanise_diametre_100_mm_m",
                                                                                                                    nom = "en acier galvanisé, diamètre 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 45.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_acier_galvanise_diametre_120_mm_m",
                                                                                                                    nom = "en acier galvanisé, diamètre 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 52.69,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "manchon_de_raccordement_de_descente_en_acier_galvanise",
                                                                            nom = "Manchon de raccordement de descente en acier galvanisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "male_femelle_diametre_75_mm_u",
                                                                                                                    nom = "mâle/femelle, diamètre 75 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_87_mm_u",
                                                                                                                    nom = "mâle/femelle, diamètre 87 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_100_mm_u",
                                                                                                                    nom = "mâle/femelle, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_120_mm_u",
                                                                                                                    nom = "mâle/femelle, diamètre 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.84,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "dauphin_de_gouttiere_en_acier_galvanise",
                                                                            nom = "Dauphin de gouttière en acier galvanisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "droit_diametre_120_mm_u",
                                                                                                                    nom = "droit, diamètre 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 61.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "droit_diametre_100_mm_u",
                                                                                                                    nom = "droit, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 52.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "droit_diametre_87_mm_u",
                                                                                                                    nom = "droit, diamètre 87 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 39.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "droit_diametre_75_mm_u",
                                                                                                                    nom = "droit, diamètre 75 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 37.24,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "talon_droite_gauche_de_gouttiere_en_acier_galvanise",
                                                                            nom = "Talon droite/gauche de gouttière en acier galvanisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_gouttiere_100_mm_a_joints_u",
                                                                                                                    nom = "pour gouttière 100 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_125_mm_a_joints_u",
                                                                                                                    nom = "pour gouttière 125 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_190_mm_a_joints_u",
                                                                                                                    nom = "pour gouttière 190 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_150_mm_a_joints_u",
                                                                                                                    nom = "pour gouttière 150 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.47,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "angle_de_gouttiere",
                                                                            nom = "Angle de gouttière",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "a_135_exterieur_pour_gouttiere_diametre_150_mm_u",
                                                                                                                    nom = "à 135° extérieur, pour gouttière diamètre 150 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 77.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_exterieur_pour_gouttiere_diametre_125_mm_u",
                                                                                                                    nom = "à 135° extérieur, pour gouttière diamètre 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 66.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_exterieur_pour_gouttiere_diametre_100_mm_u",
                                                                                                                    nom = "à 135° extérieur, pour gouttière diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 64.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_exterieur_pour_gouttiere_diametre_190_mm_u",
                                                                                                                    nom = "à 90° extérieur, pour gouttière diamètre 190 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 81.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_exterieur_pour_gouttiere_diametre_150_mm_u",
                                                                                                                    nom = "à 90° extérieur, pour gouttière diamètre 150 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 54.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_exterieur_pour_gouttiere_diametre_125_mm_u",
                                                                                                                    nom = "à 90° extérieur, pour gouttière diamètre 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_exterieur_pour_gouttiere_diametre_100_mm_u",
                                                                                                                    nom = "à 90° extérieur, pour gouttière diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 44.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_interieur_pour_gouttiere_diametre_150_mm_u",
                                                                                                                    nom = "à 135° intérieur, pour gouttière diamètre 150 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 76.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_interieur_pour_gouttiere_diametre_125_mm_u",
                                                                                                                    nom = "à 135° intérieur, pour gouttière diamètre 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 65.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_interieur_pour_gouttiere_diametre_100_mm_u",
                                                                                                                    nom = "à 135° intérieur, pour gouttière diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_interieur_pour_gouttiere_diametre_190_mm_u",
                                                                                                                    nom = "à 90° intérieur, pour gouttière diamètre 190 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 80.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_interieur_pour_gouttiere_diametre_150_mm_u",
                                                                                                                    nom = "à 90° intérieur, pour gouttière diamètre 150 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 54.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_interieur_pour_gouttiere_diametre_125_mm_u",
                                                                                                                    nom = "à 90° intérieur, pour gouttière diamètre 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_interieur_pour_gouttiere_diametre_100_mm_u",
                                                                                                                    nom = "à 90° intérieur, pour gouttière diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.26,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "jonction_de_dilatation_en_acier_galvanise",
                                                                            nom = "Jonction de dilatation en acier galvanisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_gouttiere_diametre_100_mm_u",
                                                                                                                    nom = "pour gouttière diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_diametre_125_mm_u",
                                                                                                                    nom = "pour gouttière diamètre 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_diametre_150_mm_u",
                                                                                                                    nom = "pour gouttière diamètre 150 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.67,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "recuperateur_d_eau_pluviale_en_acier_galvanise",
                                                                            nom = "Récupérateur d'eau pluviale en acier galvanisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "diametre_75_mm_male_femelle_u",
                                                                                                                    nom = "diamètre 75 mm, mâle/femelle\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 57.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_87_mm_male_femelle_u",
                                                                                                                    nom = "diamètre 87 mm, mâle/femelle\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 60.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_100_mm_male_femelle_u",
                                                                                                                    nom = "diamètre 100 mm, mâle/femelle\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 63.78,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "naissance_en_acier_galvanise",
                                                                            nom = "Naissance en acier galvanisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "diametre_100_mm_u",
                                                                                                                    nom = "diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_125_mm_u",
                                                                                                                    nom = "diamètre 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_150_mm_u",
                                                                                                                    nom = "diamètre 150 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_190_mm_u",
                                                                                                                    nom = "diamètre 190 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 37.86,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gouttiere_1_2_ronde_en_acier_galvanise",
                                                                            nom = "Gouttière 1/2 ronde en acier galvanisé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_acier_galvanise_diametre_100_mm_m",
                                                                                                                    nom = "en acier galvanisé, diamètre 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_acier_galvanise_diametre_125_mm_m",
                                                                                                                    nom = "en acier galvanisé, diamètre 125 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_acier_galvanise_diametre_150_mm_m",
                                                                                                                    nom = "en acier galvanisé, diamètre 150 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 46.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_acier_galvanise_diametre_190_mm_m",
                                                                                                                    nom = "en acier galvanisé, diamètre 190 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 52.06,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "aluminium",
                    nom = "Aluminium",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "aluminium_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "devoiement_en_aluminium",
                                                                            nom = "Dévoiement en aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "rectangulaire_dimensions_60x80_mm_u",
                                                                                                                    nom = "rectangulaire, dimensions 60x80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.75,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "fond_de_gouttiere_corniche_en_aluminium",
                                                                            nom = "Fond de gouttière corniche en aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_gouttiere_300_mm_developpe_u",
                                                                                                                    nom = "pour gouttière 300 mm développé\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.62,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "naissance_de_gouttiere_corniche_en_aluminium",
                                                                            nom = "Naissance de gouttière corniche en aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_gouttiere_300_mm",
                                                                                                                    nom = "pour gouttière 300 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.4,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "coude_pour_gouttiere_corniche_en_aluminium",
                                                                            nom = "Coude pour gouttière corniche en aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "75_male_femelle_u",
                                                                                                                    nom = "75 ° male femelle\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.49,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "angle_pour_gouttiere_corniche_en_aluminium",
                                                                            nom = "Angle pour gouttière corniche en aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "angle_interieur_90_pour_gouttiere_300_mm_u",
                                                                                                                    nom = "angle intérieur 90° pour gouttiere 300 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_exterieur_90_pour_gouttiere_300_mm_u",
                                                                                                                    nom = "angle extérieur 90° pour gouttiere 300 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.21,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "descente_ep_en_aluminium",
                                                                            nom = "Descente EP en aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "rectangulaire_m",
                                                                                                                    nom = "rectangulaire\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.7,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gouttiere_corniche_en_aluminium",
                                                                            nom = "Gouttière corniche en aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "develope_300_mm_m",
                                                                                                                    nom = "dévelopé 300 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 42.19,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "nez_de_balcon_en_aluminium_laque",
                                                                            nom = "Nez de balcon en aluminium laqué",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "reglable_de_112_a_145_mm_m",
                                                                                                                    nom = "réglable de 112 à 145 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 68.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "reglable_de_139_a_181_mm_m",
                                                                                                                    nom = "réglable de 139 à 181 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 71.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "piece_de_jonction_145_mm_m",
                                                                                                                    nom = "pièce de jonction 145 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "piece_de_jonction_180_mm_m",
                                                                                                                    nom = "pièce de jonction 180 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_sortant_m",
                                                                                                                    nom = "angle sortant\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 55.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_sortant_avec_recuperateur_m",
                                                                                                                    nom = "angle sortant avec récupérateur\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 67.26,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "couvertine_en_aluminium",
                                                                            nom = "Couvertine en aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_acrotere_largeur_270_mm_m",
                                                                                                                    nom = "pour acrotère, largeur 270 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "eclisse_pour_couvertine_d_acrotere_m",
                                                                                                                    nom = "éclisse pour couvertine d'acrotère\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "angle_a_90_deg_pour_couvertine_d_acrotere_m",
                                                                                                                    nom = "angle à 90&deg; pour couvertine d'acrotère\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 42.66,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "appuis_de_fenetre_en_aluminium",
                                                                            nom = "Appuis de fenêtre en aluminium",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "finition_laque_type_pr3_ou_similaire_u",
                                                                                                                    nom = "finition laqué, type PR3 ou similaire\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 40.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "about_de_finition_u",
                                                                                                                    nom = "about de finition\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.95,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "pvc",
                    nom = "PVC",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "pvc_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "mamelon_mixte_de_raccordement",
                                                                            nom = "Mamelon mixte de raccordement",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "femelle_rectangulaire_73x100_male_cylindrique_diametre_80_u",
                                                                                                                    nom = "femelle rectangulaire 73x100, mâle cylindrique diamètre 80\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "femelle_rectangulaire_73x100_male_cylindrique_diametre_100_u",
                                                                                                                    nom = "femelle rectangulaire 73x100, mâle cylindrique diamètre 100\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "femelle_rectangulaire_56x90_male_cylindrique_diametre_80_u",
                                                                                                                    nom = "femelle rectangulaire 56x90, mâle cylindrique diamètre 80\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "femelle_rectangulaire_76x105_male_cylindrique_diametre_100_u",
                                                                                                                    nom = "femelle rectangulaire 76x105, mâle cylindrique diamètre 100\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.42,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "pied_de_descente_de_chute_ep_type_ovation",
                                                                            nom = "Pied de descente de chute EP type Ovation",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "section_56x90_mm_sorties_diametres_75_80_90_100_mm_u",
                                                                                                                    nom = "section 56x90 mm, sorties diamètres 75, 80, 90, 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "section_76x105_mm_sorties_diametres_90_100_110_125_mm_u",
                                                                                                                    nom = "section 76x105 mm, sorties diamètres 90, 100, 110, 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.91,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "boite_a_eau_en_pvc",
                                                                            nom = "Boite à eau en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "diametre_80_mm_u",
                                                                                                                    nom = "diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_100_mm_u",
                                                                                                                    nom = "diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.86,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "descente_ep_en_pvc",
                                                                            nom = "Descente EP en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_pvc_diametre_50_mm_m",
                                                                                                                    nom = "en PVC, diamètre 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_diametre_80_mm_m",
                                                                                                                    nom = "en PVC, diamètre 80 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_diametre_100_mm_m",
                                                                                                                    nom = "en PVC, diamètre 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_diametre_125_mm_m",
                                                                                                                    nom = "en PVC, diamètre 125 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_carree_section_73x100_mm_m",
                                                                                                                    nom = "en PVC, carrée, section 73x100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 36.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_type_ovation_section_56x90_mm_m",
                                                                                                                    nom = "en PVC, type Ovation , section 56x90 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_type_ovation_section_76x105_mm_m",
                                                                                                                    nom = "en PVC, type Ovation, section 76x105 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.78,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "coude_en_pvc",
                                                                            nom = "Coude en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "male_femelle_diametre_50_mm",
                                                                                                                    nom = "mâle/Femelle, diamètre 50 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_80_mm",
                                                                                                                    nom = "mâle/Femelle, diamètre 80 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_100_mm",
                                                                                                                    nom = "mâle/Femelle, diamètre 100 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_125_mm",
                                                                                                                    nom = "mâle/Femelle, diamètre 125 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "femelle_femelle_diametre_80_mm",
                                                                                                                    nom = "femelle/Femelle, diamètre 80 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "femelle_femelle_diametre_100_mm",
                                                                                                                    nom = "femelle/Femelle, diamètre 100 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_changement_de_direction_section_73x100_mm",
                                                                                                                    nom = "pour changement de direction, section 73x100 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_changement_de_direction_section_56x90_mm",
                                                                                                                    nom = "pour changement de direction, section 56x90 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_changement_de_direction_section_76x105_mm",
                                                                                                                    nom = "pour changement de direction, section 76x105 mm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.85,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "manchette_en_pvc",
                                                                            nom = "Manchette en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "male_femelle_diametre_80_mm_u",
                                                                                                                    nom = "mâle/Femelle, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_100_mm_u",
                                                                                                                    nom = "mâle/Femelle, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_125_mm_u",
                                                                                                                    nom = "mâle/Femelle, diamètre 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_pour_tuyau_descente_ep_73x100_mm_u",
                                                                                                                    nom = "mâle/Femelle, pour tuyau descente EP 73x100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_pour_tuyau_descente_ep_56x90_mm_u",
                                                                                                                    nom = "mâle/Femelle, pour tuyau descente EP 56x90 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 13.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_pour_tuyau_descente_ep_76x105_mm_u",
                                                                                                                    nom = "mâle/Femelle, pour tuyau descente EP 76x105 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.74,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "jonction_de_dilatation_de_gouttiere_en_pvc",
                                                                            nom = "Jonction de dilatation de gouttière en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pour_gouttiere_ovation_lg_28_u",
                                                                                                                    nom = "pour gouttière Ovation LG 28\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_ovation_lg_38_u",
                                                                                                                    nom = "pour gouttière Ovation LG 38\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.48,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "dauphin_en_pvc",
                                                                            nom = "Dauphin en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_pvc_droit_longueur_1_00_m_section_56x90mm_a_coller_u",
                                                                                                                    nom = "en PVC, droit, longueur 1,00 m, section 56x90mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 63.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_droit_longueur_1_00_m_section_76x105mm_a_coller_u",
                                                                                                                    nom = "en PVC, droit, longueur 1,00 m, section 76x105mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 69.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_coude_longueur_1_00_m_a_joint_diametre_80_u",
                                                                                                                    nom = "en PVC, coudé, longueur 1,00 m, à joint, diamètre 80\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 61.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_coude_longueur_1_00_m_a_joint_diametre_100_u",
                                                                                                                    nom = "en PVC, coudé, longueur 1,00 m, à joint, diamètre 100\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 64.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_coude_longueur_1_00_m_a_coller_diametre_100_u",
                                                                                                                    nom = "en PVC, coudé, longueur 1,00 m, à coller, diamètre 100\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_coude_longueur_1_00_m_a_coller_diametre_80_u",
                                                                                                                    nom = "en PVC, coudé, longueur 1,00 m, à coller, diamètre 80\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 59.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_droit_longueur_1_00_m_a_joint_diametre_100_u",
                                                                                                                    nom = "en PVC, droit, longueur 1,00 m, à joint, diamètre 100\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 58.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_droit_longueur_1_00_m_a_joint_diametre_80_u",
                                                                                                                    nom = "en PVC, droit, longueur 1,00 m, à joint, diamètre 80\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 102.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_droit_longueur_1_00_m_a_coller_diametre_100_u",
                                                                                                                    nom = "en PVC, droit, longueur 1,00 m, à coller, diamètre 100\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 57.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_droit_longueur_1_00_m_a_coller_diametre_80_u",
                                                                                                                    nom = "en PVC, droit, longueur 1,00 m, à coller, diamètre 80\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 55.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_coude_longueur_1_00_m_section_56x90mm_a_coller_u",
                                                                                                                    nom = "en PVC, coudé, longueur 1,00 m, section 56x90mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 71.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_coude_longueur_1_00_m_section_73x100mm_a_coller_u",
                                                                                                                    nom = "en PVC, coudé, longueur 1,00 m, section 73x100mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 77.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_coude_longueur_1_00_m_section_76x105_mm_a_coller_u",
                                                                                                                    nom = "en PVC, coudé, longueur 1,00 m, section 76x105 mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 79.87,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "fond_de_raccord_en_pvc",
                    nom = "Fond de raccord en PVC",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "fond_de_raccord_en_pvc_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                        }
                    }
                },
        {
                    id = "section_60_a_coller_pour_gouttiere_carree",
                    nom = "section 60, à coller, pour gouttière carrée",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "section_60_a_coller_pour_gouttiere_carree_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                        }
                    }
                },
        {
                    id = "section_70_a_coller_pour_gouttiere_carree",
                    nom = "section 70, à coller, pour gouttière carrée",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "section_70_a_coller_pour_gouttiere_carree_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "gouttiere_carree_en_pvc",
                                                                            nom = "Gouttière Carrée en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "section_70_a_coller_m",
                                                                                                                    nom = "section 70, à coller\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.35,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gouttiere_corniche_en_pvc",
                                                                            nom = "Gouttière corniche en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_elite_a_coller_m",
                                                                                                                    nom = "type Elite , à coller\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ovation_lg_28_a_coller_m",
                                                                                                                    nom = "type Ovation LG 28 , à coller\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 37.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ovation_lg_38_a_coller_m",
                                                                                                                    nom = "type Ovation LG 38 , à coller\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 44.74,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "besace_de_dilatation",
                                                                            nom = "Besace de dilatation",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_pvc_pour_gouttiere_elite_u",
                                                                                                                    nom = "en PVC, pour gouttière Elite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 46.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_pour_gouttiere_ovation_u",
                                                                                                                    nom = "en PVC, pour gouttière Ovation\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_pvc_pour_gouttiere_carree_section_70_u",
                                                                                                                    nom = "en PVC, pour gouttière carrée, section 70\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "largueur_260_mm_avec_joint_elastique_en_epdm_u",
                                                                                                                    nom = "largueur 260 mm avec joint élastique en EPDM\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.05,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gouttiere_pendante_demi_ronde_en_pvc",
                                                                            nom = "Gouttière pendante demi ronde en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "developpement_250_mm_a_coller_m",
                                                                                                                    nom = "développement 250 mm, à coller\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 35.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_330_mm_a_coller_m",
                                                                                                                    nom = "développement 330 mm, à coller\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 42.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_160_mm_a_joints_m",
                                                                                                                    nom = "développement 160 mm, à joints\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_250_mm_a_joints_m",
                                                                                                                    nom = "développement 250 mm, à joints\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 35.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_330_mm_a_joints_m",
                                                                                                                    nom = "développement 330 mm, à joints\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.06,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "jambonneau_en_pvc",
                                                                            nom = "Jambonneau en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "diametre_80_mm_u",
                                                                                                                    nom = "diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 30.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_100_mm_u",
                                                                                                                    nom = "diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 32.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_tuyau_de_descente_ep_ovation_56x90_mm_u",
                                                                                                                    nom = "pour tuyau de descente EP Ovation 56x90 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_tuyau_de_descente_ep_ovation_76x105_mm_u",
                                                                                                                    nom = "pour tuyau de descente EP Ovation 76x105 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 36.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "naissance_centrale_de_gouttiere_en_pvc",
                                                                            nom = "Naissance centrale de gouttière en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "developpement_250_mm_a_coller_u",
                                                                                                                    nom = "développement 250 mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 18.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_330_mm_a_coller_sortie_diametre_100_u",
                                                                                                                    nom = "développement 330 mm, à coller, sortie diamètre 100\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_330_mm_a_coller_sortie_diametre_125_u",
                                                                                                                    nom = "développement 330 mm, à coller, sortie diamètre 125\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_160_mm_a_joints_u",
                                                                                                                    nom = "développement 160 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_250_mm_a_joints_u",
                                                                                                                    nom = "développement 250 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_330_mm_a_joints_u",
                                                                                                                    nom = "développement 330 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_330_mm_a_joints_sortie_diametre_125_u",
                                                                                                                    nom = "développement 330 mm, à joints, sortie diamètre 125\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 30.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_dilatation_developpement_250_mm_a_coller_u",
                                                                                                                    nom = "à dilatation, développement 250 mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.65,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_dilatation_developpement_330_mm_a_coller_sortie_diametre_100_u",
                                                                                                                    nom = "à dilatation, développement 330 mm, à coller, sortie diamètre 100\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 32.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_dilatation_developpement_330_mm_a_coller_sortie_diametre_125_u",
                                                                                                                    nom = "à dilatation, développement 330 mm, à coller, sortie diamètre 125\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sortie_diametre_80_a_coller_pour_gouttiere_elite_u",
                                                                                                                    nom = "sortie diamètre 80, à coller, pour gouttière Elite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sortie_diametre_100_a_coller_pour_gouttiere_elite_u",
                                                                                                                    nom = "sortie diamètre 100, à coller, pour gouttière Elite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sortie_73x100_a_coller_pour_gouttiere_elite_u",
                                                                                                                    nom = "sortie 73x100, à coller, pour gouttière Elite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sortie_diametre_80_a_coller_pour_gouttiere_ovation_lg_28_u",
                                                                                                                    nom = "sortie diamètre 80, à coller, pour gouttière Ovation LG 28\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 19.87,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sortie_diametre_100_a_coller_pour_gouttiere_ovation_lg_38_u",
                                                                                                                    nom = "sortie diamètre 100, à coller, pour gouttière Ovation LG 38\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 32.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sortie_90x56_a_coller_pour_gouttiere_ovation_lg_28_u",
                                                                                                                    nom = "sortie 90x56 à coller, pour gouttière Ovation LG 28\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "sortie_105x76_a_coller_pour_gouttiere_ovation_lg_38_u",
                                                                                                                    nom = "sortie 105x76 à coller, pour gouttière Ovation LG 38\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 36.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_coller_pour_gouttiere_carree_70_u",
                                                                                                                    nom = "à coller, pour gouttière carrée 70\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_dilatation_a_coller_pour_gouttiere_carree_70_u",
                                                                                                                    nom = "à dilatation, à coller, pour gouttière carrée 70\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 45.54,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "talon_droite_gauche_de_gouttiere_en_pvc",
                                                                            nom = "Talon droite/gauche de gouttière en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "developpement_250_mm_a_coller_u",
                                                                                                                    nom = "développement 250 mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_330_mm_a_coller_u",
                                                                                                                    nom = "développement 330 mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_160_mm_a_joints_u",
                                                                                                                    nom = "développement 160 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_250_mm_a_joints_u",
                                                                                                                    nom = "développement 250 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 5.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_330_mm_a_joints_u",
                                                                                                                    nom = "développement 330 mm, à joints\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_elite_u",
                                                                                                                    nom = "pour gouttière Elite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_ovation_lg_28_u",
                                                                                                                    nom = "pour gouttière Ovation LG 28\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 7.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_ovation_lg_38_u",
                                                                                                                    nom = "pour gouttière Ovation LG 38\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pour_gouttiere_carree_70_u",
                                                                                                                    nom = "pour gouttière carrée 70\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "recuperateur_d_eau_pluviale",
                                                                            nom = "Récupérateur d'eau pluviale",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "diametre_80_mm_avec_manchon_ff_u",
                                                                                                                    nom = "diamètre 80 mm, avec manchon FF\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 73.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_100_mm_avec_manchon_ff_u",
                                                                                                                    nom = "diamètre 100 mm, avec manchon FF\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 82.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "reduction_concentrique_en_pvc",
                                                                            nom = "Réduction concentrique en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "diametre_90_70_u",
                                                                                                                    nom = "diamètre 90/70\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "diametre_100_80_u",
                                                                                                                    nom = "diamètre 100/80\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "manchon_en_pvc",
                                                                            nom = "Manchon en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "double_femelle_diametre_50_mm_u",
                                                                                                                    nom = "double femelle, diamètre 50 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_femelle_diametre_80_mm_u",
                                                                                                                    nom = "double femelle, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 12.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_femelle_diametre_100_mm_u",
                                                                                                                    nom = "double femelle, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "double_femelle_diametre_125_mm_u",
                                                                                                                    nom = "double femelle, diamètre 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_80_mm_u",
                                                                                                                    nom = "mâle-femelle, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_diametre_100_mm_u",
                                                                                                                    nom = "mâle-femelle, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_pour_tuyau_ep_section_55x55_mm_u",
                                                                                                                    nom = "mâle-femelle pour tuyau EP section 55x55 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_pour_tuyau_ep_section_73x100_mm_u",
                                                                                                                    nom = "mâle-femelle pour tuyau EP section 73x100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 24.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "male_femelle_pour_tuyau_ep_section_56x90_mm_u",
                                                                                                                    nom = "mâle-femelle pour tuyau EP section 56x90 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 45.84,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "angle_de_gouttiere_en_pvc",
                                                                            nom = "Angle de gouttière en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "developpement_160_mm_a_joints_interne_externe_u",
                                                                                                                    nom = "développement 160 mm, à joints, interne-externe\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_250_mm_a_joints_interne_externe_u",
                                                                                                                    nom = "développement 250 mm, à joints, interne-externe\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "developpement_330_mm_a_joints_interne_externe_u",
                                                                                                                    nom = "développement 330 mm, à joints, interne-externe\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 26.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_developement_250_mm_a_coller_u",
                                                                                                                    nom = "à 90°, dévelopement 250 mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_developement_330_mm_a_coller_u",
                                                                                                                    nom = "à 90°, dévelopement 330 mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 20.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_developpement_250_mm_a_coller_u",
                                                                                                                    nom = "à 135°, développement 250 mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_developpement_330_mm_a_coller_u",
                                                                                                                    nom = "à 135°, développement 330 mm, à coller\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_a_coller_pour_gouttiere_elite_u",
                                                                                                                    nom = "à 90°, à coller, pour gouttière Elite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_a_coller_pour_gouttiere_elite_u",
                                                                                                                    nom = "à 135°, à coller, pour gouttière Elite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_a_coller_pour_gouttiere_ovation_lg_28_u",
                                                                                                                    nom = "à 90°, à coller, pour gouttière Ovation LG 28\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_a_coller_pour_gouttiere_ovation_lg_38_u",
                                                                                                                    nom = "à 90°, à coller, pour gouttière Ovation LG 38\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 23.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_a_coller_pour_gouttiere_ovation_lg_28_u",
                                                                                                                    nom = "à 135°, à coller, pour gouttière Ovation LG 28\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_135_a_coller_pour_gouttiere_ovation_lg_38_u",
                                                                                                                    nom = "à 135°, à coller, pour gouttière Ovation LG 38\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 49.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "a_90_a_coller_pour_gouttiere_carree_section_70_u",
                                                                                                                    nom = "à 90°, à coller, pour gouttière carrée, section 70\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "trop_plein_de_balcon_en_pvc",
                                                                            nom = "Trop plein de balcon en PVC",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "allonge_grise_sable_ou_blanche_u",
                                                                                                                    nom = "allonge grise, sable ou blanche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 6.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "grise_sable_ou_blanche_u",
                                                                                                                    nom = "grise, sable ou blanche\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.22,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "zinc",
                    nom = "Zinc",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "zinc_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "habillage_de_souche_de_cheminee",
                                                                            nom = "Habillage de souche de cheminée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2263.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2221.71,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "aretier",
                                                                            nom = "Arêtier",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_140_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 140 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_160_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 32.83,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_d_astragale",
                                                                            nom = "Bande d'astragale",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_160_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_200_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 30.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_250_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 250 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 34.27,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_d_egout",
                                                                            nom = "Bande d'égout",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_180_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm développé 180 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_180_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm développé 180 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.63,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_de_rive_a_biseau",
                                                                            nom = "Bande de rive à biseau",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_160_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_200_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_250_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 250 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 44.56,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_de_rive_a_cheval",
                                                                            nom = "Bande de rive à cheval",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_160_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 39.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_200_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 42.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_250_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 250 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 44.95,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_de_batellement_a_ourlet",
                                                                            nom = "Bande de batellement à ourlet",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_160_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 29.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_200_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_250_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 250 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 36.09,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "chapeau_de_ventilation",
                                                                            nom = "Chapeau de ventilation",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_diametre_80_mm_0_65_mm_u",
                                                                                                                    nom = "en zinc, diamètre 80 mm, 0,65 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 117.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_diametre_100_mm_0_65_mm_u",
                                                                                                                    nom = "en zinc, diamètre 100 mm, 0,65 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 125.43,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "chatiere",
                                                                            nom = "Chatière",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_triangulaire_0_65_mm_u",
                                                                                                                    nom = "en zinc, triangulaire, 0,65 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 76.11,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_1_2_ronde_0_65_mm_u",
                                                                                                                    nom = "en zinc, 1/2 ronde, 0,65 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 78.39,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "cheneau_encaisse",
                                                                            nom = "Chéneau encaissé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_500_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 127.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_650_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 650 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 144.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_500_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 142.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_650_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 650 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 162.03,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "coude_cintre_en_zinc",
                                                                            nom = "Coude cintré en zinc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_0_65_mm_diametre_80_mm_u",
                                                                                                                    nom = "épaisseur 0,65 mm, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 17.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_0_65_mm_diametre_100_mm_u",
                                                                                                                    nom = "épaisseur 0,65 mm, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 21.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "epaisseur_0_65_mm_diametre_120_mm_u",
                                                                                                                    nom = "épaisseur 0,65 mm, diamètre 120 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 35.34,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "couverture_en_zinc_systeme_a_simple_agrafure",
                                                                            nom = "Couverture en zinc, système à simple agrafure",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_travee_500_mm_systeme_a_agrafures_m",
                                                                                                                    nom = "zinc 0,65 mm, travée 500 mm, système à agrafures\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2168.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_travee_650_mm_systeme_a_agrafures_m",
                                                                                                                    nom = "zinc 0,65 mm, travée 650 mm, système à agrafures\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2152.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_80_mm_travee_500_mm_systeme_a_agrafures_m",
                                                                                                                    nom = "zinc 0,80 mm, travée 500 mm, système à agrafures\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2203.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_80_mm_travee_650_mm_systeme_a_agrafures_m",
                                                                                                                    nom = "zinc 0,80 mm, travée 650 mm, système à agrafures\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2186.72,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "couvre_joint",
                                                                            nom = "Couvre-joint",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_100_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_140_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 140 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 25.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_160_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 28.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_100_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 22.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_140_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 140 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 27.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_160_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 31.03,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "cuvette_de_branchement_en_zinc",
                                                                            nom = "Cuvette de branchement en zinc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "meplate_diametre_80_mm_u",
                                                                                                                    nom = "méplate, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 38.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "meplate_diametre_100_mm_u",
                                                                                                                    nom = "méplate, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 41.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_2_ronde_d_angle_diametre_80_mm_u",
                                                                                                                    nom = "1/2 ronde d'angle, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 84.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_2_ronde_d_angle_diametre_100_mm_u",
                                                                                                                    nom = "1/2 ronde d'angle, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 98.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_2_ronde_de_face_diametre_80_mm_u",
                                                                                                                    nom = "1/2 ronde de face, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 70.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "1_2_ronde_de_face_diametre_100_mm_u",
                                                                                                                    nom = "1/2 ronde de face, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 83.13,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "descente_ep_en_zinc",
                                                                            nom = "Descente EP en zinc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_diametre_80_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, diamètre 80 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 45.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_diametre_100_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, diamètre 100 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 51.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_diametre_120_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, diamètre 120 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 62.56,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "embout_a_talon",
                                                                            nom = "Embout à talon",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpement_250_mm_u",
                                                                                                                    nom = "en zinc, 0,65 mm, développement 250 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 9.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpement_330_mm_u",
                                                                                                                    nom = "en zinc, 0,65 mm, développement 330 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 11.32,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "faitage",
                                                                            nom = "Faîtage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpement_330_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développement 330 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpement_330_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développement 330 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 53.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpement_400_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développement 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 54.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpement_400_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développement 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 59.41,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gouttiere_1_2_ronde_en_zinc",
                                                                            nom = "Gouttière 1/2 ronde en zinc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_250_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 250 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 45.61,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_250_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 250 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 48.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_330_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 330 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 53.37,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_330_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 330 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 56.4,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gouttiere_havraise_nantaise_ou_laval",
                                                                            nom = "Gouttière Havraise, Nantaise ou Laval",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_330_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 330 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 76.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_330_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 330 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 82.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_400_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 95.73,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "naissance_universelle",
                                                                            nom = "Naissance universelle",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_diametre_80_mm_u",
                                                                                                                    nom = "en zinc, 0,65, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 33.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_diamere_100_mm_u",
                                                                                                                    nom = "en zinc, 0,65, diamère 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 40.24,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "noue_en_zinc",
                                                                            nom = "Noue en zinc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_330_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 330 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 47.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_400_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 53.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpe_500_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développé 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 61.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_330_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 330 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 58.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_400_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 66.28,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_500_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 76.63,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "recouvrement_en_zinc",
                                                                            nom = "Recouvrement en zinc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpement_400_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développement 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 74.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpement_600_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développement 600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 101.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpement_400_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développement 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 88.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpement_600_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développement 600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 120.25,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "equerre_de_gouttiere_en_zinc",
                                                                            nom = "Equerre de gouttière en zinc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "exterieure_interieure_a_souder_dev_0",
                                                                                                                    nom = "extérieure/ intérieure, à souder, dév : 0,",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2540.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "exterieure_interieure_a_souder_dev_0",
                                                                                                                    nom = "extérieure/ intérieure, à souder, dév : 0,",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3349.11,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "gouttiere_a_l_anglaise_en_zinc",
                                                                            nom = "Gouttière à l'anglaise en zinc",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpe_650_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développé 650 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 165.97,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "couverture_en_zinc_systeme_a_ressauts",
                                                                            nom = "Couverture en zinc, système à ressauts",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_travee_500_mm_systeme_a_ressauts_m",
                                                                                                                    nom = "zinc 0,65 mm, travée 500 mm, système à ressauts\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2179.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_travee_650_mm_systeme_a_ressauts_m",
                                                                                                                    nom = "zinc 0,65 mm, travée 650 mm, système à ressauts\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2163.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_80_mm_travee_500_mm_systeme_a_ressauts_m",
                                                                                                                    nom = "zinc 0,80 mm, travée 500 mm, système à ressauts\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2215.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_80_mm_travee_650_mm_systeme_a_ressauts_m",
                                                                                                                    nom = "zinc 0,80 mm, travée 650 mm, système à ressauts\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2198.18,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "couverture_en_zinc_longues_feuilles_a_tasseaux",
                                                                            nom = "Couverture en zinc, longues feuilles, à tasseaux",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_jusqu_a_3_m_travee_500_mm_m",
                                                                                                                    nom = "zinc 0,65 mm, jusqu'à 3 m, travée 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2151.3,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_70_mm_jusqu_a_3_m_travee_500_mm_m",
                                                                                                                    nom = "zinc 0,70 mm, jusqu'à 3 m, travée 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2159.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_jusqu_a_3_m_travee_650_mm_m",
                                                                                                                    nom = "zinc 0,65 mm, jusqu'à 3 m, travée 650 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2153.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_70_mm_jusqu_a_3_m_travee_650_mm_m",
                                                                                                                    nom = "zinc 0,70 mm, jusqu'à 3 m, travée 650 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2162.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_superieure_a_3_m_travee_500_mm_m",
                                                                                                                    nom = "zinc 0,65 mm, supérieure à 3 m, travée 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2145.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_70_mm_superieure_a_3_m_travee_500_mm_m",
                                                                                                                    nom = "zinc 0,70 mm, supérieure à 3 m, travée 500 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2154.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_superieure_a_3_m_travee_650_mm_m",
                                                                                                                    nom = "zinc 0,65 mm, supérieure à 3 m, travée 650 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2148.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_70_mm_superieure_a_3_m_travee_650_mm_m",
                                                                                                                    nom = "zinc 0,70 mm, supérieure à 3 m, travée 650 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2157.48,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "couverture_en_zinc_a_joints_debouts",
                                                                            nom = "Couverture en zinc, à joints debouts",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_travee_500_mm_longueur_maxi_6_m_m",
                                                                                                                    nom = "zinc 0,65 mm, travée 500 mm, longueur maxi 6 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2108.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_70_mm_travee_500_mm_longueur_maxi10_m_m",
                                                                                                                    nom = "zinc 0,70 mm, travée 500 mm, longueur maxi10 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2116.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_travee_650_mm_longueur_maxi_3_m_m",
                                                                                                                    nom = "zinc 0,65 mm, travée 650 mm, longueur maxi 3 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2101.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_70_mm_travee_650_mm_longueur_maxi_8_m_m",
                                                                                                                    nom = "zinc 0,70 mm, travée 650 mm, longueur maxi 8 m\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2107.82,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "couverture_en_zinc_circulaire_dite_a_l_imperiale",
                                                                            nom = "Couverture en zinc circulaire, dite à l'impériale",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "zinc_0_65_mm_travee_650_mm_m",
                                                                                                                    nom = "zinc 0,65 mm, travée 650 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2178.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "zinc_0_80_mm_travee_650_mm_m",
                                                                                                                    nom = "zinc 0,80 mm, travée 650 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2202.26,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "couvertine_en_zinc_d_acrotere_ou_de_faitage",
                                                                            nom = "Couvertine en zinc d'acrotère ou de faîtage",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpement_400_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développement 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 63.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_65_mm_developpement_600_mm_m",
                                                                                                                    nom = "en zinc, 0,65 mm, développement 600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 89.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpement_400_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développement 400 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 77.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_zinc_0_80_mm_developpement_600_mm_m",
                                                                                                                    nom = "en zinc, 0,80 mm, développement 600 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 107.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_value_pour_retour_d_angle_cheneau_encaisse_en_zinc_u",
                                                                                                                    nom = "Plus value pour retour d'angle, chéneau encaissé en zinc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_value_pour_talon_cheneau_encaisse_en_zinc_u",
                                                                                                                    nom = "Plus value pour talon, chéneau encaissé en zinc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.21,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "bande_de_solin_en_zinc",
                    nom = "Bande de solin en zinc",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "bande_de_solin_en_zinc_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
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
                                                                            id = "habillage_de_souche_de_cheminee",
                                                                            nom = "Habillage de souche de cheminée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_plomb_1_5_mm_m",
                                                                                                                    nom = "en plomb, 1,5 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2264.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plomb_2_mm_m",
                                                                                                                    nom = "en plomb, 2 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2326.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plomb_2_5_mm_m",
                                                                                                                    nom = "en plomb, 2,5 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2386.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_calendrite_blanche_type_40_m",
                                                                                                                    nom = "en calendrite blanche, type 40\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2110.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_calendrite_rouge_type_40_m",
                                                                                                                    nom = "en calendrite rouge, type 40\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2114.52,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "dauphin",
                                                                            nom = "Dauphin",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_fonte_droit_longueur_1_00_m_dn_75_mm_u",
                                                                                                                    nom = "en fonte, droit, longueur 1,00 m, dn 75 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 80.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_droit_longueur_1_00_m_dn_100_mm_u",
                                                                                                                    nom = "en fonte, droit, longueur 1,00 m, dn 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 100.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_droit_longueur_1_00m_dn_125_mm_u",
                                                                                                                    nom = "en fonte, droit, longueur 1,00m, dn 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 121.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_droit_longueur_2_00_m_dn_75_mm_u",
                                                                                                                    nom = "en fonte, droit, longueur 2,00 m, dn 75 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 133.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_droit_longueur_2_00_m_dn_100_mm_u",
                                                                                                                    nom = "en fonte, droit, longueur 2,00 m, dn 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 155.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_droit_longueur_2_00_m_dn_125_mm_u",
                                                                                                                    nom = "en fonte, droit, longueur 2,00 m, dn 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 198.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_droit_longueur_3_00_m_dn_75_mm_u",
                                                                                                                    nom = "en fonte, droit, longueur 3,00 m, dn 75 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 161.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_droit_longueur_3_00_m_dn_100_mm_u",
                                                                                                                    nom = "en fonte, droit, longueur 3,00 m, dn 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 181.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_droit_longueur_3_00_m_dn_125_mm_u",
                                                                                                                    nom = "en fonte, droit, longueur 3,00 m, dn 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 234.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_coude_longueur_1_00_m_dn_75_mm_u",
                                                                                                                    nom = "en fonte, coudé, longueur 1,00 m, dn 75 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 113.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_coude_longueur_1_00_m_dn_100_mm_u",
                                                                                                                    nom = "en fonte, coudé, longueur 1,00 m, dn 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 136.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_coude_longueur_1_00_m_dn_125_mm_u",
                                                                                                                    nom = "en fonte, coudé, longueur 1,00 m, dn 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 188.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_coude_longueur_2_00_m_dn_75_mm_u",
                                                                                                                    nom = "en fonte, coudé, longueur 2, 00 m, dn 75 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 166.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_coude_longueur_2_00_m_dn_100_mm_u",
                                                                                                                    nom = "en fonte, coudé, longueur 2,00 m, dn 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 198.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_coude_longueur_2_00_m_dn_125_mm_u",
                                                                                                                    nom = "en fonte, coudé, longueur 2,00 m, dn 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 266.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_coude_longueur_3_00_m_dn_75_mm_u",
                                                                                                                    nom = "en fonte, coudé, longueur 3, 00 m, dn 75 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 201.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_coude_longueur_3_00_m_dn_100_mm_u",
                                                                                                                    nom = "en fonte, coudé, longueur 3,00 m, dn 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_fonte_coude_longueur_3_00_m_dn_125_mm_u",
                                                                                                                    nom = "en fonte, coudé, longueur 3,00 m, dn 125 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 302.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "dauphin_d_egout_droit_longueur_1_00_m_dn_100_mm_u",
                                                                                                                    nom = "dauphin d'égout, droit, longueur 1,00 m, dn 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 65.44,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "crapaudine",
                                                                            nom = "Crapaudine",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "extensible_n_2_diametre_80_mm_u",
                                                                                                                    nom = "extensible n°2, diamètre 80 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "extensible_n_2_diametre_100_mm_u",
                                                                                                                    nom = "extensible n°2, diamètre 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_polypropylene_noir_diametre_80_et_100_mm_u",
                                                                                                                    nom = "en polypropylène noir, diamètre 80 et 100 mm\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 10.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "solin_au_ciment_hauteur_12_cm_m",
                                                                                                                    nom = "Solin au ciment, hauteur 12 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 8.56,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "bande_de_solin",
                                                                            nom = "Bande de solin",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_plomb_epaisseur_1_5_mm_developpe_160_mm_m",
                                                                                                                    nom = "en plomb, épaisseur 1,5 mm, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 37.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plomb_epaisseur_1_5_mm_developpe_200_mm_m",
                                                                                                                    nom = "en plomb, épaisseur 1,5 mm, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 43.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plomb_epaisseur_2_mm_developpe_160_mm_m",
                                                                                                                    nom = "en plomb, épaisseur 2 mm, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 45.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_plomb_epaisseur_2_mm_developpe_200_mm_m",
                                                                                                                    nom = "en plomb, épaisseur 2 mm, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 53.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_calendrite_aluminee_blanche_developpe_160_mm_m",
                                                                                                                    nom = "en calendrite, aluminée blanche, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_calendrite_aluminee_blanche_developpe_200_mm_m",
                                                                                                                    nom = "en calendrite, aluminée blanche, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_calendrite_aluminee_rouge_developpe_160_mm_m",
                                                                                                                    nom = "en calendrite, aluminée rouge, développé 160 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_calendrite_aluminee_rouge_developpe_200_mm_m",
                                                                                                                    nom = "en calendrite, aluminée rouge, développé 200 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 16.15,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "stop_feuille_en_polypropylene_pour_gouttiere",
                                                                            nom = "Stop-feuille en polypropylène pour gouttière",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_polypropylene_developpe_33_cm_m",
                                                                                                                    nom = "en polypropylène, développé 33 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 15.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "en_polypropylene_developpe_25_cm_m",
                                                                                                                    nom = "en polypropylène, développé 25 cm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 14.25,
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
