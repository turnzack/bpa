local M = {}

M.metier = "Chauffage électrique"
M.ICON = "images/icons/chauffage_electrique.png"

M.STRUCTURE = {
    id = "chauffage_electrique",
    nom = "Chauffage électrique",
    type = "LOT",
    children = {
        {
                    id = "convecteurs_electriques",
                    nom = "Convecteurs électriques",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "convecteurs_electriques_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "convecteur_electrique_nf_6_ordres_avec_thermostat_electronique",
                                                                            nom = "Convecteur électrique NF, 6 ordres, avec thermostat électronique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_f_617_6_ordres_puissance_500_w_u",
                                                                                                                    nom = "type F 617, 6 ordres, puissance 500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 153.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_617_6_ordres_puissance_750_w_u",
                                                                                                                    nom = "type F 617, 6 ordres, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 158.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_617_6_ordres_puissance_1000_w_u",
                                                                                                                    nom = "type F 617, 6 ordres, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 162.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_617_6_ordres_puissance_1250_w_u",
                                                                                                                    nom = "type F 617, 6 ordres, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 176.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_617_6_ordres_puissance_1500_w_u",
                                                                                                                    nom = "type F 617, 6 ordres, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 180.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_617_6_ordres_puissance_1750_w_u",
                                                                                                                    nom = "type F 617, 6 ordres, puissance 1750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 196.57,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_617_6_ordres_puissance_2000_w_u",
                                                                                                                    nom = "type F 617, 6 ordres, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 203.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_medium_6_ordres_puissance_500_w_u",
                                                                                                                    nom = "type F 18-Médium, 6 ordres, puissance 500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 191.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_medium_6_ordres_puissance_750_w_u",
                                                                                                                    nom = "type F 18-Médium, 6 ordres, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 192.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_medium_6_ordres_puissance_1000_w_u",
                                                                                                                    nom = "type F 18-Médium, 6 ordres, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 197.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_medium_6_ordres_puissance_1250_w_u",
                                                                                                                    nom = "type F 18-Médium, 6 ordres, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 219.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_medium_6_ordres_puissance_1500_w_u",
                                                                                                                    nom = "type F 18-Médium, 6 ordres, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 229.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_medium_6_ordres_puissance_2000_w_u",
                                                                                                                    nom = "type F 18-Médium, 6 ordres, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 258.66,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_haut_bas_6_ordres_puissance_500_w_u",
                                                                                                                    nom = "type F 18-Haut/Bas, 6 ordres, puissance 500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 204.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_haut_bas_6_ordres_puissance_750_w_u",
                                                                                                                    nom = "type F 18-Haut/Bas, 6 ordres, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 206.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_haut_bas_6_ordres_puissance_1000_w_u",
                                                                                                                    nom = "type F 18-Haut/Bas, 6 ordres, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_haut_bas_6_ordres_puissance_1500_w_u",
                                                                                                                    nom = "type F 18-Haut/Bas, 6 ordres, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 243.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_haut_bas_6_ordres_puissance_2000_w_u",
                                                                                                                    nom = "type F 18-Haut/Bas, 6 ordres, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 278.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_plinthe_6_ordres_puissance_500_w_u",
                                                                                                                    nom = "type F 18-Plinthe, 6 ordres, puissance 500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 204.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_plinthe_6_ordres_puissance_1000_w_u",
                                                                                                                    nom = "type F 18-Plinthe, 6 ordres, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 216.39,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_18_plinthe_6_ordres_puissance_1250_w_u",
                                                                                                                    nom = "type F 18-Plinthe, 6 ordres, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 232.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_borneo_horizontal_6_ordres_puissance_750_w_u",
                                                                                                                    nom = "type Bornéo horizontal, 6 ordres, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 279.42,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_borneo_horizontal_6_ordres_puissance_1000_w_u",
                                                                                                                    nom = "type Bornéo horizontal, 6 ordres, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 297.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_borneo_horizontal_6_ordres_puissance_1250_w_u",
                                                                                                                    nom = "type Bornéo horizontal, 6 ordres, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 340.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_borneo_horizontal_6_ordres_puissance_1500_w_u",
                                                                                                                    nom = "type Bornéo horizontal, 6 ordres, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 347.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_borneo_horizontal_6_ordres_puissance_2000_w_u",
                                                                                                                    nom = "type Bornéo horizontal, 6 ordres, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 417.66,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "convecteur_electrique_nf_4_ordres_avec_thermostat_electronique",
                                                                            nom = "Convecteur électrique NF, 4 ordres, avec thermostat électronique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_f_117_4_ordres_puissance_500w_u",
                                                                                                                    nom = "type F 117-4 ordres - puissance 500w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 138.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_117_4_ordres_puissance_750w_u",
                                                                                                                    nom = "type F 117-4 ordres - puissance 750w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 140.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_117_4_ordres_puissance_1000w_u",
                                                                                                                    nom = "type F 117-4 ordres - puissance 1000w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 142.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_117_4_ordres_puissance_1250w_u",
                                                                                                                    nom = "type F 117-4 ordres - puissance 1250w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 156.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_117_4_ordres_puissance_1500w_u",
                                                                                                                    nom = "type F 117-4 ordres - puissance 1500w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 160.02,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_117_4_ordres_puissance_1750w_u",
                                                                                                                    nom = "type F 117-4 ordres - puissance 1750w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 176.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_f_117_4_ordres_puissance_2000w_u",
                                                                                                                    nom = "type F 117-4 ordres - puissance 2000w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 186.21,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "convecteur_soufflant_nf_mural",
                                                                            nom = "Convecteur soufflant NF mural",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance1800w_sans_minuterie_u",
                                                                                                                    nom = "puissance1800w, sans minuterie\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 164.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1000_1800w_avec_minuterie_u",
                                                                                                                    nom = "puissance 1000/1800w, avec minuterie\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 179.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1000_1800w_avec_minuterie_et_porte_serviettes_u",
                                                                                                                    nom = "puissance 1000/1800w, avec minuterie et porte serviettes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 257.35,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "convecteur_seche_serviettes_soufflant_nf",
                                                                            nom = "Convecteur sèche serviettes soufflant NF",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_800w_1800w_turbo_programmable_u",
                                                                                                                    nom = "puissance 800w + 1800w (turbo) programmable\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 431.2,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "infrarouge_classe_ii",
                                                                            nom = "Infrarouge classe II",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_600w_a_1_allure_u",
                                                                                                                    nom = "puissance 600w à 1 allure\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 121.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1200w_a_3_allures_300_600_1200_w_u",
                                                                                                                    nom = "puissance 1200w à 3 allures (300/600/1200 w)\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 131.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1800w_a_3_allures_450_900_1800w_u",
                                                                                                                    nom = "puissance 1800w à 3 allures (450/900/1800w)\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 138.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1200w_avec_minuterie_u",
                                                                                                                    nom = "puissance 1200w avec minuterie\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 163.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_600w_avec_minuterie_u",
                                                                                                                    nom = "puissance 600w avec minuterie\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 149.1,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "infrarouge_industiel_classe_i",
                                                                            nom = "Infrarouge industiel classe I",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_1000w_mono_230v_u",
                                                                                                                    nom = "puissance 1000w, mono 230V\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 185.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1500w_mono_230v_u",
                                                                                                                    nom = "puissance 1500w, mono 230V\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 207.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2000w_mono_230v_u",
                                                                                                                    nom = "puissance 2000w, mono 230V\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1500w_mono_400v_u",
                                                                                                                    nom = "puissance 1500w, mono 400V\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 227.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2000w_mono_400v_u",
                                                                                                                    nom = "puissance 2000w, mono 400v\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 252.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "longue_portee_puissance_6000_w_u",
                                                                                                                    nom = "longue portée, Puissance 6000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1899.48,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "longue_portee_puissance_4500_w_u",
                                                                                                                    nom = "longue portée, Puissance 4500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1518.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "longue_portee_puissance_3000_w_u",
                                                                                                                    nom = "longue portée, Puissance 3000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1039.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "longue_portee_puissance_1500_w_u",
                                                                                                                    nom = "longue portée, Puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 703.01,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "programmateur_individuel",
                                                                            nom = "Programmateur individuel",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "pass_program_enfichable_sur_les_convecteurs_atlantic_type_f18_u",
                                                                                                                    nom = "Pass Program, enfichable sur les convecteurs Atlantic, type F18\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 84.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "pass_program_enfichable_sur_les_radiateurs_elecriques_atlantic_u",
                                                                                                                    nom = "Pass Program, enfichable sur les radiateurs élecriques Atlantic\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 84.24,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rythmeur_excel_pour_les_radiateurs_elecriques_campa_u",
                                                                                                                    nom = "rythmeur Excel, pour les radiateurs élecriques Campa\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 121.89,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "programmateur_de_chauffage_electrique",
                                                                            nom = "Programmateur de chauffage électrique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "journalier_et_hebdomadaire_2_zones_u",
                                                                                                                    nom = "journalier et hebdomadaire, 2 zones\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 205.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "journalier_2_zones_avec_derogation_confort_reduit_par_zone_affichage_par_cavaliers_u",
                                                                                                                    nom = "journalier, 2 zones avec dérogation confort/réduit par zone, affichage par cavaliers\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 198.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "journalier_1_zone_avec_derogation_confort_reduit_par_zone_affichage_par_cavaliers_u",
                                                                                                                    nom = "journalier 1 zone avec dérogation confort/réduit par zone, affichage par cavaliers\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 159.93,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "convecteur_petite_enfance",
                                                                            nom = "Convecteur petite enfance",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_2000_w_u",
                                                                                                                    nom = "puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 949.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1500_w_u",
                                                                                                                    nom = "puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 770.06,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1000_w_u",
                                                                                                                    nom = "puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 700.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_750_w_u",
                                                                                                                    nom = "puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 647.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_500_w_u",
                                                                                                                    nom = "puissance 500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 586.96,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "radiateurs_electriques",
                    nom = "Radiateurs électriques",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "radiateurs_electriques_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "radiateur_electrique_campa_nf_6_ordres_avec_thermostat_electronique",
                                                                            nom = "Radiateur électrique Campa NF 6 ordres avec thermostat électronique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_ravil_horizontal_blanc_creme_puissance_750_w_u",
                                                                                                                    nom = "type Ravil-horizontal, blanc crémé, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 601.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ravil_horizontal_blanc_creme_puissance_1000_w_u",
                                                                                                                    nom = "type Ravil-horizontal, blanc crémé, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 664.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ravil_horizontal_blanc_creme_puissance_1250_w_u",
                                                                                                                    nom = "type Ravil-horizontal, blanc crémé, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 733.94,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ravil_horizontal_blanc_creme_puissance_1500_w_u",
                                                                                                                    nom = "type Ravil-horizontal, blanc crémé, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 785.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_ravil_horizontal_blanc_creme_puissance_2000_w_u",
                                                                                                                    nom = "type Ravil-horizontal, blanc crémé, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 926.03,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_prelude_horizontal_blanc_creme_puissance_750_w_u",
                                                                                                                    nom = "type Prélude-horizontal, blanc crémé, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 413.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_prelude_horizontal_blanc_creme_puissance_1000_w_u",
                                                                                                                    nom = "type Prélude-horizontal, blanc crémé, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 473.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_prelude_horizontal_blanc_creme_puissance_1250_w_u",
                                                                                                                    nom = "type Prélude-horizontal, blanc crémé, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 521.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_prelude_horizontal_blanc_creme_puissance_1500_w_u",
                                                                                                                    nom = "type Prélude-horizontal, blanc crémé, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 566.93,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_prelude_horizontal_blanc_creme_puissance_2000_w_u",
                                                                                                                    nom = "type Prélude-horizontal, blanc crémé, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 657.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_cosmos_plus_classic_beige_ou_blanc_puissance_500_w_u",
                                                                                                                    nom = "type Cosmos Plus Classic, beige ou blanc, puissance 500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 449.62,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_cosmos_plus_classic_beige_ou_blanc_puissance_750_w_u",
                                                                                                                    nom = "type Cosmos Plus Classic, beige ou blanc, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 460.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_cosmos_plus_classic_beige_ou_blanc_puissance_1000_w_u",
                                                                                                                    nom = "type Cosmos Plus Classic, beige ou blanc, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 526.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_cosmos_plus_classic_beige_ou_blanc_puissance_1250_w_u",
                                                                                                                    nom = "type Cosmos Plus Classic, beige ou blanc, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 580.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_cosmos_plus_classic_beige_ou_blanc_puissance_1500_w_u",
                                                                                                                    nom = "type Cosmos Plus Classic, beige ou blanc, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 630.4,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_cosmos_plus_classic_beige_ou_blanc_puissance_1750_w_u",
                                                                                                                    nom = "type Cosmos Plus Classic, beige ou blanc, puissance 1750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 721.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_cosmos_plus_classic_beige_ou_blanc_puissance_2000_w_u",
                                                                                                                    nom = "type Cosmos Plus Classic, beige ou blanc, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 732.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_campaver_ultime_2_horizontal_blanc_ou_noir_puissance_750_w_u",
                                                                                                                    nom = "type Campaver Ultime 2, horizontal, blanc ou noir, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1043.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_campaver_ultime_2_horizontal_blanc_ou_noir_puissance_1000_w_u",
                                                                                                                    nom = "type Campaver Ultime 2, horizontal, blanc ou noir, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1097.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_campaver_ultime_2_horizontal_blanc_ou_noir_puissance_1250_w_u",
                                                                                                                    nom = "type Campaver Ultime 2, horizontal, blanc ou noir, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1203.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_campaver_ultime_2_horizontal_blanc_ou_noir_puissance_1500_w_u",
                                                                                                                    nom = "type Campaver Ultime 2, horizontal, blanc ou noir, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1301,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_campaver_ultime_2_horizontal_blanc_ou_noir_puissance_2000_w_u",
                                                                                                                    nom = "type Campaver Ultime 2, horizontal, blanc ou noir, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1462.25,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_naturay_bains_puissance_600_600_w_avec_soufflerie_et_2_barres_porte_serviettes_u",
                                                                                                                    nom = "type Naturay Bains, puissance 600/600 W avec soufflerie et 2 barres porte-serviettes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1227.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_naturay_bains_puissance_1000_600_w_avec_soufflerie_et_2_barres_porte_serviettes_u",
                                                                                                                    nom = "type Naturay Bains, puissance 1000/600 W avec soufflerie et 2 barres porte-serviettes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1477.7,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_svelta_bains_puissance_300_600_w_avec_soufflerie_et_1_barre_porte_serviettes_u",
                                                                                                                    nom = "type Svelta Bains, puissance 300/600 W avec soufflerie et 1 barre porte-serviettes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 887.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_svelta_bains_puissance_900_600_w_avec_soufflerie_et_2_barres_porte_serviettes_u",
                                                                                                                    nom = "type Svelta Bains, puissance 900/600 W avec soufflerie et 2 barres porte-serviettes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1020.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_svelta_bains_puissance_1300_600_w_avec_soufflerie_et_2_barres_porte_serviettes_u",
                                                                                                                    nom = "type Svelta Bains, puissance 1300/600 W avec soufflerie et 2 barres porte-serviettes\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1086.5,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_electrique_atlantic_nf_6_ordres_avec_thermostat_electronique",
                                                                            nom = "Radiateur électrique Atlantic NF 6 ordres avec thermostat électronique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "type_solius_horizontal_puissance_750_w_u",
                                                                                                                    nom = "type Solius, horizontal, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 299.79,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_solius_horizontal_puissance_1000_w_u",
                                                                                                                    nom = "type Solius, horizontal, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 317.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_solius_horizontal_puissance_1250_w_u",
                                                                                                                    nom = "type Solius, horizontal, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 344.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_solius_horizontal_puissance_1500_w_u",
                                                                                                                    nom = "type Solius, horizontal, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 372.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_solius_horizontal_puissance_2000_w_u",
                                                                                                                    nom = "type Solius, horizontal, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 447.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_tatou_puissance_750_w_u",
                                                                                                                    nom = "type Tatou, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 390.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_tatou_puissance_1000_w_u",
                                                                                                                    nom = "type Tatou, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 416.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_tatou_puissance_1250_w_u",
                                                                                                                    nom = "type Tatou, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 449.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_tatou_puissance_1500_w_u",
                                                                                                                    nom = "type Tatou, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 478.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_tatou_puissance_2000_w_u",
                                                                                                                    nom = "type Tatou, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 577.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_tatou_bains_puissance_1000_w_u",
                                                                                                                    nom = "type Tatou Bains, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 483,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_tatou_bains_puissance_1500_w_u",
                                                                                                                    nom = "type Tatou Bains, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 561.38,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_shangai_puissance_750_w_u",
                                                                                                                    nom = "type Shangaï, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 432.33,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_shangai_puissance_1000_w_u",
                                                                                                                    nom = "type Shangaï, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 474.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_shangai_puissance_1250_w_u",
                                                                                                                    nom = "type Shangaï, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 529.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_shangai_puissance_1500_w_u",
                                                                                                                    nom = "type Shangaï, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 600.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_shangai_puissance_2000_w_u",
                                                                                                                    nom = "type Shangaï, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 693.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_nirvana_puissance_750_w_u",
                                                                                                                    nom = "type Nirvana, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 523.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_nirvana_puissance_1000_w_u",
                                                                                                                    nom = "type Nirvana, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 579.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_nirvana_puissance_1250_w_u",
                                                                                                                    nom = "type Nirvana, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 646.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_nirvana_puissance_1500_w_u",
                                                                                                                    nom = "type Nirvana, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 700.9,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_nirvana_puissance_2000_w_u",
                                                                                                                    nom = "type Nirvana, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 805.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_kendo_puissance_750_w_u",
                                                                                                                    nom = "type Kendo, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 607.49,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_kendo_puissance_1000_w_u",
                                                                                                                    nom = "type Kendo, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 658.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_kendo_puissance_1250_w_u",
                                                                                                                    nom = "type Kendo, puissance 1250 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 734.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_kendo_puissance_1500_w_u",
                                                                                                                    nom = "type Kendo, puissance 1500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 812.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "type_kendo_puissance_2000_w_u",
                                                                                                                    nom = "type Kendo, puissance 2000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 999.08,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_a_accumulation_dynamique",
                                                                            nom = "Radiateur à accumulation dynamique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_2000_w_serie_basse_u",
                                                                                                                    nom = "puissance 2000 W, série basse\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1455.53,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_3000_w_serie_basse_u",
                                                                                                                    nom = "puissance 3000 W, série basse\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1677.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_4000_w_serie_basse_u",
                                                                                                                    nom = "puissance 4000 W, série basse\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1940.95,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_5000_w_serie_basse_u",
                                                                                                                    nom = "puissance 5000 W, série basse\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2200.6,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_6000_w_serie_basse_u",
                                                                                                                    nom = "puissance 6000 W, série basse\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2441.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_7500_w_serie_basse_u",
                                                                                                                    nom = "puissance 7500 W, série basse\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2801.76,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_5000_w_serie_haute_u",
                                                                                                                    nom = "puissance 5000 W, série haute\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2220.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_6000_w_serie_haute_u",
                                                                                                                    nom = "puissance 6000 W, série haute\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2524.98,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_7500_w_serie_haute_u",
                                                                                                                    nom = "puissance 7500 W, série haute\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2896.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2000_w_serie_etroite_u",
                                                                                                                    nom = "puissance 2000 W, série étroite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1508.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_3000_w_serie_etroite_u",
                                                                                                                    nom = "puissance 3000 W, série étroite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1750.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_4000_w_serie_etroite_u",
                                                                                                                    nom = "puissance 4000 W, série étroite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2031.46,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1500_w_serie_super_etroite_u",
                                                                                                                    nom = "puissance 1500 W, série super étroite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1495.31,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2000_w_serie_super_etroite_u",
                                                                                                                    nom = "puissance 2000 W, série super étroite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1715.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2500_w_serie_super_etroite_u",
                                                                                                                    nom = "puissance 2500 W, série super étroite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1883.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_3000_w_serie_super_etroite_u",
                                                                                                                    nom = "puissance 3000 W, série super étroite\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2028.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "regulateur_de_charge_avec_sonde_exterieure_u",
                                                                                                                    nom = "régulateur de charge avec sonde extérieure\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.94,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_a_accumulation_statique",
                                                                            nom = "Radiateur à accumulation statique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_1600_w_u",
                                                                                                                    nom = "puissance 1600 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 693.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2400_w_u",
                                                                                                                    nom = "puissance 2400 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 853.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_3200_w_u",
                                                                                                                    nom = "puissance 3200 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1032.29,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_a_accumulation_statique_compensee",
                                                                            nom = "Radiateur à accumulation statique compensée",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_2600_w_1000_w_convecteur_u",
                                                                                                                    nom = "puissance 2600 W +1000 W(convecteur)\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 798.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_3900_w_1500_w_convecteur_u",
                                                                                                                    nom = "puissance 3900 W + 1500 W(convecteur)\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 982.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_5200_w_2000_w_convecteur_u",
                                                                                                                    nom = "puissance 5200 W + 2000 W(convecteur)\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1185.42,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "regulateur_de_charge_pour_radiateurs_a_accumulation",
                                                                            nom = "Régulateur de charge pour radiateurs à accumulation",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "en_fonction_de_la_temperature_exterieure_par_sonde_u",
                                                                                                                    nom = "en fonction de la température extérieure par sonde\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 237.94,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_a_inertie_dynamique",
                                                                            nom = "Radiateur à inertie dynamique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "vertical_puissance_1000_watts_u",
                                                                                                                    nom = "vertical, puissance 1000 Watts\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1009.91,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vertical_puissance_1500_watts_u",
                                                                                                                    nom = "vertical, puissance 1500 Watts\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1273.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "vertical_puissance_2000_watts_u",
                                                                                                                    nom = "vertical, puissance 2000 Watts\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1474.44,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "horizontal_puissance_750_watts_u",
                                                                                                                    nom = "horizontal, puissance 750 Watts\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 904.13,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "horizontal_puissance_1000_watts_u",
                                                                                                                    nom = "horizontal, puissance 1000 Watts\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 963.43,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "horizontal_puissance_1250_watts_u",
                                                                                                                    nom = "horizontal, puissance 1250 Watts\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1065.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "horizontal_puissance_1500_watts_u",
                                                                                                                    nom = "horizontal, puissance 1500 Watts\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1136.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "horizontal_puissance_2000_watts_u",
                                                                                                                    nom = "horizontal, puissance 2000 Watts\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1298.45,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "radiateurs_seche_serviettes_electriques",
                    nom = "Radiateurs sèche-serviettes électriques",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "radiateurs_seche_serviettes_electriques_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "radiateur_seche_serviettes_electrique_novella_bains",
                                                                            nom = "Radiateur sèche-serviettes électrique Novella Bains",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_350_w_blanc_u",
                                                                                                                    nom = "puissance 350 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 652.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_350_w_couleur_u",
                                                                                                                    nom = "puissance 350 W, couleur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 720.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_400_w_blanc_u",
                                                                                                                    nom = "puissance 400 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 682.15,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_400_w_couleur_u",
                                                                                                                    nom = "puissance 400 W, couleur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 750.29,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_500_w_blanc_u",
                                                                                                                    nom = "puissance 500 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 712.52,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_500_w_couleur_u",
                                                                                                                    nom = "puissance 500 W, couleur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 780.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_600_w_blanc_u",
                                                                                                                    nom = "puissance 600 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 780.34,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_600_w_couleur_u",
                                                                                                                    nom = "puissance 600 W, couleur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 848.71,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_750_w_blanc_u",
                                                                                                                    nom = "puissance 750 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 845.32,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_750_w_couleur_u",
                                                                                                                    nom = "puissance 750 W, couleur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 913.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1000_w_blanc_u",
                                                                                                                    nom = "puissance 1000 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 935.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1000_w_couleur_u",
                                                                                                                    nom = "puissance 1000 W, couleur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1003.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1250_w_blanc_u",
                                                                                                                    nom = "puissance 1250 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1034.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1250_w_couleur_u",
                                                                                                                    nom = "puissance 1250 W, couleur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1102.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1500_w_blanc_u",
                                                                                                                    nom = "puissance 1500 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1126.01,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1500_w_couleur_u",
                                                                                                                    nom = "puissance 1500 W, couleur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1194.38,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_seche_serviettes_electrique_tahiti",
                                                                            nom = "Radiateur sèche-serviettes électrique Tahiti",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_300_w_blanc_u",
                                                                                                                    nom = "puissance 300 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 524.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_500_w_blanc_u",
                                                                                                                    nom = "puissance 500 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 560.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_750_w_blanc_u",
                                                                                                                    nom = "puissance 750 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 649.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1000_w_blanc_u",
                                                                                                                    nom = "puissance 1000 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 730.54,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1250_w_blanc_u",
                                                                                                                    nom = "puissance 1250 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 754.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1500_w_blanc_u",
                                                                                                                    nom = "puissance 1500 W, blanc\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 809.96,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_seche_serviettes_electrique_nefertiti",
                                                                            nom = "Radiateur sèche-serviettes électrique Néfertiti",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_500_w_u",
                                                                                                                    nom = "version tout électrique, puissance 500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 710.35,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_750_w_u",
                                                                                                                    nom = "version tout électrique, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 792.64,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_1000_w_u",
                                                                                                                    nom = "version tout électrique, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 922.09,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_500_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version tout électrique, puissance 500/+1000 W, avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 859.04,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_750_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version tout électrique, puissance 750/+1000 W, avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 936.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_1000_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version tout électrique, puissance 1000/+1000 W, avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1088.07,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_mixte_puissance_500_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version mixte, puissance 500/+1000 W avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 875.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_mixte_puissance_750_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version mixte, puissance 750/+1000 W avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 954.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_mixte_puissance_1000_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version mixte, puissance 1000/+1000 W avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1107,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_seche_serviettes_electrique_doris",
                                                                            nom = "Radiateur sèche-serviettes électrique Doris",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_500_w_u",
                                                                                                                    nom = "version tout électrique, puissance 500 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 549.92,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_750_w_u",
                                                                                                                    nom = "version tout électrique, puissance 750 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 627.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_1000_w_u",
                                                                                                                    nom = "version tout électrique, puissance 1000 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 716.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_500_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version tout électrique, puissance 500/+1000 W, avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 759.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_750_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version tout électrique, puissance 750/+1000 W, avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 826.81,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_tout_electrique_puissance_1000_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version tout électrique, puissance 1000/+1000 W, avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 926.36,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_mixte_puissance_500_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version mixte, puissance 500/+1000 W avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 778.51,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_mixte_puissance_750_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version mixte, puissance 750/+1000 W avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 842.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "version_mixte_puissance_1000_1000_w_avec_ventilo_u",
                                                                                                                    nom = "version mixte, puissance 1000/+1000 W avec ventilo\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 944.11,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_seche_serviettes_electrique_campaver_bains",
                                                                            nom = "Radiateur sèche-serviettes électrique Campaver Bains",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "rayonnant_et_soufflant_puissance_400_600_w_u",
                                                                                                                    nom = "rayonnant et soufflant, puissance 400/600 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 936.67,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rayonnant_et_soufflant_puissance_600_600_w_u",
                                                                                                                    nom = "rayonnant et soufflant, puissance 600/600 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1217.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rayonnant_et_soufflant_puissance_1000_600_w_u",
                                                                                                                    nom = "rayonnant et soufflant, puissance 1000/600 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1473.36,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_seche_serviettes_electrique_naturay_bains",
                                                                            nom = "Radiateur sèche-serviettes électrique Naturay Bains",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "rayonnant_et_soufflant_puissance_600_600_w_avec_facade_en_pierre_de_lave_u",
                                                                                                                    nom = "rayonnant et soufflant, puissance 600/600 W, avec façade en pierre de lave\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1219.77,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rayonnant_et_soufflant_puissance_1000_600_w_avec_facade_en_pierre_de_lave_u",
                                                                                                                    nom = "rayonnant et soufflant, puissance 1000/600 W, avec façade en pierre de lave\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1467.92,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "radiateur_seche_serviettes_electrique_svelta_bains",
                                                                            nom = "Radiateur sèche-serviettes électrique Svelta Bains",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "rayonnant_et_soufflant_puissance_300_600_w_u",
                                                                                                                    nom = "rayonnant et soufflant, puissance 300/600 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 887.26,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rayonnant_et_soufflant_puissance_900_600_w_u",
                                                                                                                    nom = "rayonnant et soufflant, puissance 900/600 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1020.8,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "rayonnant_et_soufflant_puissance_1300_600_w_u",
                                                                                                                    nom = "rayonnant et soufflant, puissance 1300/600 W\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1078.68,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "aerothermes_et_chaudieres_electriques",
                    nom = "Aérothermes et chaudières électriques",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "aerothermes_et_chaudieres_electriques_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "aerothermes_electriques_a_2_allures_de_chauffe",
                                                                            nom = "Aérothermes électriques à 2 allures de chauffe",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_3_4_5_kw_u",
                                                                                                                    nom = "puissance 3/ 4,5 kW\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1078.74,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_4_6_kw_u",
                                                                                                                    nom = "puissance 4/ 6 kW\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1113.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_6_9_kw_u",
                                                                                                                    nom = "puissance 6/9 kW\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1152.14,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_8_12_kw_u",
                                                                                                                    nom = "puissance 8/12 kW\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1282.97,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_9_18_kw_u",
                                                                                                                    nom = "puissance 9/ 18 kW\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1751.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_12_24_kw_u",
                                                                                                                    nom = "puissance 12/24 kW\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1850.44,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "chaudiere_electrique_murale",
                                                                            nom = "Chaudière électrique murale",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "bbc_puissance_0_7_6_kw_u",
                                                                                                                    nom = "BBC, puissance 0,7/6 kW\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1893.16,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_4_8_kw_monophase_ou_triphase_u",
                                                                                                                    nom = "puissance 4/8 kW monophasé ou triphasé\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2123.47,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_12_16_kw_triphase_u",
                                                                                                                    nom = "puissance 12/16 kW triphasé\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2310.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "plus_value_pour_vase_d_expansion_monte_sur_la_chaudiere_u",
                                                                                                                    nom = "plus value pour vase d'expansion monté sur la chaudière\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 212.82,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "moins_value_pour_pompe_de_circulation_non_fournie_u",
                                                                                                                    nom = "moins value pour pompe de circulation non fournie\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 75.76,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "chaudiere_electrique_au_sol",
                                                                            nom = "Chaudière électrique au sol",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_12_16_kw_220_380_v_u",
                                                                                                                    nom = "puissance 12/16 kW 220/380 V\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2795.22,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_20_24_kw_220_380_v_u",
                                                                                                                    nom = "puissance 20/24 kW, 220/380 V\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 2852.85,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_28_32_kw_220_380_v_u",
                                                                                                                    nom = "puissance 28/32 kW 220/380 V\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3408.27,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puiissance_40_48_kw_220_380_v_sans_circulateur_u",
                                                                                                                    nom = "puiissance 40/48 kW 220/380 V, sans circulateur\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 3694.33,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "thermostat_d_ambiance_pour_chaudiere",
                                                                            nom = "Thermostat d'ambiance pour chaudière",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "tout_ou_rien_a_tension_de_vapeur_plage_de_reglage_8_a_30_c_u",
                                                                                                                    nom = "tout ou rien, à tension de vapeur, plage de réglage 8 à 30°C\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 46.72,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "tout_ou_rien_a_tension_de_vapeur_programmable_u",
                                                                                                                    nom = "tout ou rien , à tension de vapeur, programmable\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 101.4,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "rideaux_d_air_electriques",
                    nom = "Rideaux d'air électriques",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "rideaux_d_air_electriques_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "modele_apparent",
                                                                            nom = "Modèle apparent",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_2000_4000_w_avec_boitier_de_commande_u",
                                                                                                                    nom = "puissance 2000/4000 w, avec boitier de commande\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 670.55,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_3000_6000_w_avec_boitier_de_commande_u",
                                                                                                                    nom = "puissance 3000/6000 w, avec boitier de commande\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1042.59,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_5000_10000_w_avec_boitier_de_commande_u",
                                                                                                                    nom = "puissance 5000/10000 w, avec boitier de commande\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1613.88,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_3000_6000_w_sans_boitier_de_commande_u",
                                                                                                                    nom = "puissance 3000/6000 w, sans boitier de commande\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 924.73,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_5000_10000_w_sans_boitier_de_commande_u",
                                                                                                                    nom = "puissance 5000/10000 w, sans boitier de commande\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1510.17,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "modele_encastrable",
                                                                            nom = "Modèle encastrable",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_5000_10000_w_avec_boitier_de_commande_u",
                                                                                                                    nom = "puissance 5000/10000 w, avec boitier de commande\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1845.1,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_5000_10000_w_sans_boitier_de_commande_u",
                                                                                                                    nom = "puissance 5000/10000 w, sans boitier de commande\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 1736.5,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "boitier_de_commande_a_distance_u",
                                                                                                                    nom = "Boitier de commande à distance\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 126.49,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "cassettes_rayonnantes",
                    nom = "Cassettes rayonnantes",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "cassettes_rayonnantes_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "cassette_rayonnante_basse_temperature",
                                                                            nom = "Cassette rayonnante basse température",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "modele_apparent_puissance_300_w_u",
                                                                                                                    nom = "modèle apparent, puissance 300 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 269.08,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "modele_apparent_puissance_600_w_u",
                                                                                                                    nom = "modèle apparent, puissance 600 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 378.75,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "modele_encastrable_puissance_200_w_u",
                                                                                                                    nom = "modèle encastrable, puissance 200 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 250.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "thermostat_d_ambiance_mural_electronique_6_ordres_u",
                                                                                                                    nom = "thermostat d'ambiance mural électronique 6 ordres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 104.71,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "cassette_rayonnante_moyenne_temperature",
                                                                            nom = "Cassette rayonnante moyenne température",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_1000_w_u",
                                                                                                                    nom = "puissance 1000 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 485.2,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1250_w_u",
                                                                                                                    nom = "puissance 1250 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 499.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1500_w_u",
                                                                                                                    nom = "puissance 1500 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 552.23,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1750_w_u",
                                                                                                                    nom = "puissance 1750 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 577.84,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2000_w_u",
                                                                                                                    nom = "puissance 2000 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 659.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_3000_w_u",
                                                                                                                    nom = "puissance 3000 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 822.19,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_4000_w_u",
                                                                                                                    nom = "puissance 4000 w\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 931.94,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        }
                                            }
                                        }
                    }
                },
        {
                    id = "plancher_chauffant_electrique_rayonnant",
                    nom = "Plancher chauffant electrique rayonnant",
                    type = "CHAPITRE",
                    children = {
                        {
                                            id = "plancher_chauffant_electrique_rayonnant_famille",
                                            nom = "Famille",
                                            type = "FAMILLE",
                                            children = {
                                                {
                                                                            id = "elements_chauffants_cable_blinde",
                                                                            nom = "Eléments chauffants, câble blindé",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "puissance_150_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 150 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 160.41,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_300_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 300 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 187.17,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_420_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 420 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 226.69,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_580_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 580 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 277.89,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_650_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 650 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 304.86,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_780_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 780 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 331.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_850_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 850 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 345.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_975_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 975 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 376.56,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1170_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 1170 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 417.58,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1300_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 1300 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 443.05,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1450_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 1450 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 477.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1600_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 1600 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 526.63,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_1800_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 1800 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 593.96,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2000_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 2000 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 658.21,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2200_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 2200 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 722.45,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2400_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 2400 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 761.18,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "puissance_2600_w_trame_sur_un_treillis_en_plastique_u",
                                                                                                                    nom = "puissance 2600 w, tramé sur un treillis en plastique\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 801.58,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "isolant_de_bordure",
                                                                            nom = "Isolant de bordure",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "epaisseur_50_mm_en_mousse_de_polystyrene_expanse_m",
                                                                                                                    nom = "épaisseur 50 mm, en mousse de polystyrène expansé\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 4.54,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "regulation_plancher_chauffant_electrique",
                                                                            nom = "Régulation plancher chauffant électrique",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "thermostat_d_ambiance_electronique_6_ordres_u",
                                                                                                                    nom = "thermostat d'ambiance électronique 6 ordres\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 95.68,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "commande_murale_de_zone_u",
                                                                                                                    nom = "commande murale de zone\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 81.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "gestionnaire_d_energie_2_zones_jour_nuit_u",
                                                                                                                    nom = "gestionnaire d'énergie 2 zones (jour-nuit)\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 217.99,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "horloge_de_programmation_2_zones_jour_nuit_u",
                                                                                                                    nom = "horloge de programmation 2 zones (jour-nuit)\tU",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 192.36,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "plancher_chauffant_electrique_au_m2",
                                                                            nom = "Plancher chauffant électrique au m2",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "comprenant_cable_chauffant_et_isolant_de_bordure_m",
                                                                                                                    nom = "comprenant câble chauffant et isolant de bordure\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 240.3,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "chape_pour_plancher_chauffant",
                                                                            nom = "Chape pour plancher chauffant",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "autonivelante_ou_autolissante_epaisseur_50_mm_m",
                                                                                                                    nom = "autonivelante ou autolissante, épaisseur 50 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.45,
                                                                                                                    unite = "U",
                                                                                                                }
                                                                            }
                                                                        },
                                                {
                                                                            id = "isolant_de_sol",
                                                                            nom = "Isolant de sol",
                                                                            type = "OUVRAGE",
                                                                            children = {
                                                                                {
                                                                                                                    id = "polystyrene_epaisseur_20_mm_m",
                                                                                                                    nom = "polystyrène épaisseur 20 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 222.78,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "polyurethane_epaisseur_30_mm_m",
                                                                                                                    nom = "polyuréthane, épaisseur 30 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 231.83,
                                                                                                                    unite = "U",
                                                                                                                },
                                                                                {
                                                                                                                    id = "polyurethane_epaisseur_24_mm_m",
                                                                                                                    nom = "polyuréthane, épaisseur 24 mm\tm",
                                                                                                                    type = "ARTICLE",
                                                                                                                    prix = 228.78,
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
