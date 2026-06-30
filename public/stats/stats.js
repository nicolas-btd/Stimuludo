
const statsTranslations = {
    en: {
        header_title: "STATISTICS",
        page_title: "Your Performances (Ranked)",
        page_desc: "Track your evolution and compare yourself to other players.",
        play_now: "Play to see stats",
        distribution_title: "Distribution (All attempts)",
        records_distribution_title: "Distribution (Best scores)",
        progression_title: "Progression History",
        best: "Best",
        you: "You",
        top: "Top",
        empty_history: "Beat your record at least once!",
        login_history: "Log in to see history.",
        error_loading: "Error during loading.",
        no_mode_found: "No mode found.",
        logout_confirm: "Hello {username}! Do you want to log out?",

                games: {
            math: {
                groupName: "Mental Math",
                desc: "Arithmetic operations under time constraints.",
                modes: {
                    "math_30_1-9": "30s, Diff: 1-9",
                    "math_30_1-99": "30s, Diff: 1-99",
                    "math_60_1-9": "60s, Diff: 1-9",
                    "math_60_1-99": "60s, Diff: 1-99"
                }
            },
            typing: {
                groupName: "Typing Speed",
                desc: "Text entry evaluated on speed and accuracy.",
                modes: {
                    "typing_10_random": "10s, Random",
                    "typing_10_quote": "10s, Quote",
                    "typing_30_random": "30s, Random",
                    "typing_30_quote": "30s, Quote",
                    "typing_60_random": "60s, Random",
                    "typing_60_quote": "60s, Quote"
                }
            },
            vismem: {
                groupName: "Visual Memory",
                desc: "Memorization and reproduction of ephemeral spatial patterns.",
                modes: {
                    "vismem_1_100": "1 life, 100ms",
                    "vismem_3_100": "3 lives, 100ms",
                    "vismem_1_1000": "1 life, 1s",
                    "vismem_3_1000": "3 lives, 1s"
                }
            },
            chess_pos: {
                groupName: "Chess Position",
                desc: "Memorization and reproduction of chess positions.",
                modes: {
                    "cp_1_2000": "1 life, 2s",
                    "cp_3_2000": "3 lives, 2s",
                    "cp_1_4000": "1 life, 4s",
                    "cp_3_4000": "3 lives, 4s"
                }
            },
            music: {
                groupName: "Musical Intervals",
                desc: "Auditory identification of the tonal distance.",
                modes: {
                    "music_piano": "Piano",
                    "music_synth": "Synth",
                    "music_guitar": "Guitar"
                }
            },
            matrix: {
                groupName: "Matrix Product",
                desc: "Calculation of the product of two matrices.",
                modes: {
                    "matrix_2_0_5_60": "2x2, [0,5], 60s",
                    "matrix_2_0_5_180": "2x2, [0,5], 180s",
                    "matrix_2_-10_10_60": "2x2, [-10,10], 60s",
                    "matrix_2_-10_10_180": "2x2, [-10,10], 180s",
                    "matrix_3_0_5_60": "3x3, [0,5], 60s",
                    "matrix_3_0_5_180": "3x3, [0,5], 180s",
                    "matrix_3_-10_10_60": "3x3, [-10,10], 60s",
                    "matrix_3_-10_10_180": "3x3, [-10,10], 180s"
                }
            },
            sudoku: {
                groupName: "Sudoku",
                desc: "Filling a classic Sudoku grid.",
                modes: {
                    "sudoku_9_easy": "9x9, Easy",
                    "sudoku_9_hard": "9x9, Hard",
                    "sudoku_16_easy": "16x16, Easy",
                    "sudoku_16_hard": "16x16, Hard",
                    "sudoku_25_easy": "25x25, Easy",
                    "sudoku_25_hard": "25x25, Hard"
                }
            },
            aim: {
                groupName: "Target Aiming",
                desc: "Successive aiming at targets in two dimensions.",
                modes: {
                    "aim_30_10": "30s, Target: 10px",
                    "aim_30_30": "30s, Target: 30px",
                    "aim_30_50": "30s, Target: 50px",
                    "aim_30_70": "30s, Target: 70px"
                }
            },
            cardsmem: {
                groupName: "Cards Memory",
                desc: "Memorization of a sequence of cards.",
                modes: {
                    "cardsmem_500": "Speed: 500ms",
                    "cardsmem_1500": "Speed: 1500ms"
                }
            },
            card_counting: {
                groupName: "Card Counting",
                desc: "Blackjack card counting systems.",
                modes: {
                    "cc_Hi-Lo_500": "Hi-Lo, 500ms",
                    "cc_Hi-Lo_1500": "Hi-Lo, 1500ms",
                    "cc_Hi-Opt I_500": "Hi-Opt I, 500ms",
                    "cc_Hi-Opt I_1500": "Hi-Opt I, 1500ms",
                    "cc_Hi-Opt II_500": "Hi-Opt II, 500ms",
                    "cc_Hi-Opt II_1500": "Hi-Opt II, 1500ms",
                    "cc_KO_500": "KO, 500ms",
                    "cc_KO_1500": "KO, 1500ms",
                    "cc_Omega II_500": "Omega II, 500ms",
                    "cc_Omega II_1500": "Omega II, 1500ms",
                    "cc_Red 7_500": "Red 7, 500ms",
                    "cc_Red 7_1500": "Red 7, 1500ms",
                    "cc_Halves_500": "Halves, 500ms",
                    "cc_Halves_1500": "Halves, 1500ms",
                    "cc_Zen Count_500": "Zen Count, 500ms",
                    "cc_Zen Count_1500": "Zen Count, 1500ms",
                    "cc_10 Count_500": "10 Count, 500ms",
                    "cc_10 Count_1500": "10 Count, 1500ms"
                }
            },
            vrt: {
                groupName: "Visual Reaction Time",
                desc: "Measure motor response time to a visual stimulus.",
                modes: {
                    "vrt_5": "Visual (5 tries)",
                    "vrt_20": "Visual (20 tries)"
                }
            },
            art: {
                groupName: "Auditory Reaction Time",
                desc: "Measure motor response time to an auditory stimulus.",
                modes: {
                    "art_5": "Auditory (5 tries)",
                    "art_20": "Auditory (20 tries)"
                }
            },
            chess: {
                groupName: "Chess Coordinates",
                desc: "Training at the chess coordinates.",
                modes: {
                    "chess_white": "White at bottom",
                    "chess_black": "Black at bottom"
                }
            },
            sm: {
                groupName: "Sequence Memory",
                desc: "Memorization and reproduction of an evolving sequence.",
                modes: {
                    "sm_1_1000": "1 life, 1000ms",
                    "sm_1_100": "1 life, 100ms"
                }
            },
            nm: {
                groupName: "Number Memory",
                desc: "Memorization of increasingly long numbers.",
                modes: {
                    "nm_1_1000": "1 life, 1000ms/digit",
                    "nm_1_500": "1 life, 500ms/digit"
                }
            },
            ts: {
                groupName: "Time Sense",
                desc: "Estimation of durations without a visible timer.",
                modes: {
                    "ts_2000": "Margin: 2000ms",
                    "ts_1000": "Margin: 1000ms",
                    "ts_3000": "Margin: 3000ms"
                }
            },
            bpm: {
                groupName: "BPM Sense",
                desc: "Assessment of beat perception accuracy.",
                modes: {
                    "bpm_ranked": "Ranked"
                }
            },
            kw: {
                groupName: "Knight Walk",
                desc: "Navigating the knight to the target as quickly as possible.",
                modes: {
                    "kw_30": "30s",
                    "kw_60": "60s",
                    "kw_30_constraint": "30s (Contrainte)",
                    "kw_60_constraint": "60s (Contrainte)",
                    "kw_30_constraint": "30s (Constraint)",
                    "kw_60_constraint": "60s (Constraint)"
                }
            },
            nr: {
                groupName: "Numbers Round",
                desc: "Calculation of the target number using the four operations.",
                modes: {
                    "nr_60": "60s",
                    "nr_90": "90s",
                    "nr_120": "120s"
                }
            },
            fusion: {
                groupName: "Fusion 2048",
                desc: "Merging tiles to reach the target tile as fast as possible.",
                modes: {
                    "fusion_512": "Speedrun 512",
                    "fusion_2048": "Speedrun 2048",
                    "fusion_4096": "Speedrun 4096"
                }
            },
            chromatic: {
                groupName: "Chromatic Memory",
                desc: "Memorization of a color then matching with the RGB picker.",
                modes: {
                    "chromatic_200": "Normal (200hp)",
                    "chromatic_50": "Hardcore (50hp)"
                }
            },
            abspitch: {
                groupName: "Absolute Pitch",
                desc: "Identification of the exact frequency of the sound played.",
                modes: {
                    "abspitch": "Ranked"
                }
            },
            pc: {
                groupName: "Point Cloud",
                desc: "Instant estimation of the number of points displayed.",
                modes: {
                    "pc_10_20_windowed": "10 rounds, 20 pts",
                    "pc_10_50_windowed": "10 rounds, 50 pts",
                    "pc_10_100_windowed": "10 rounds, 100 pts",
                    "pc_10_20_fullscreen": "10 rounds, 20 pts (Fullscreen)",
                    "pc_10_50_fullscreen": "10 rounds, 50 pts (Fullscreen)",
                    "pc_10_100_fullscreen": "10 rounds, 100 pts (Fullscreen)"
                }
            },
            pianopitch: {
                groupName: "Piano Perfect Pitch",
                desc: "Identification of notes played on a virtual keyboard.",
                modes: {
                    "pianopitch": "Ranked"
                }
            },

            coding_speed: {
                groupName: "Speed Coding",
                desc: "Typing code snippets as fast as possible.",
                modes: {
                    "cs_random_10": "10s, Random",
                    "cs_random_30": "30s, Random",
                    "cs_random_60": "60s, Random",
                    "cs_python_10": "10s, Python",
                    "cs_python_30": "30s, Python",
                    "cs_python_60": "60s, Python",
                    "cs_javascript_10": "10s, Javascript",
                    "cs_javascript_30": "30s, Javascript",
                    "cs_javascript_60": "60s, Javascript",
                    "cs_html_10": "10s, Html",
                    "cs_html_30": "30s, Html",
                    "cs_html_60": "60s, Html",
                    "cs_c_10": "10s, C",
                    "cs_c_30": "30s, C",
                    "cs_c_60": "60s, C",
                }
            },
            binary_counting: {
                groupName: "Binary Counting",
                desc: "Conversion of binary and hexadecimal numbers to base 10.",
                modes: {
                    "bc_30_binary_4": "30s, Bin, 4 bits",
                    "bc_30_binary_8": "30s, Bin, 8 bits",
                    "bc_30_binary_16": "30s, Bin, 16 bits",
                    "bc_30_hex_4": "30s, Hex, 4 bits",
                    "bc_30_hex_8": "30s, Hex, 8 bits",
                    "bc_30_hex_16": "30s, Hex, 16 bits",
                    "bc_60_binary_4": "60s, Bin, 4 bits",
                    "bc_60_binary_8": "60s, Bin, 8 bits",
                    "bc_60_binary_16": "60s, Bin, 16 bits",
                    "bc_60_hex_4": "60s, Hex, 4 bits",
                    "bc_60_hex_8": "60s, Hex, 8 bits",
                    "bc_60_hex_16": "60s, Hex, 16 bits",
                }
            },
            items_counting: {
                groupName: "Items Counting",
                desc: "Counting the displayed items as fast as possible.",
                modes: {
                    "ic_30_15": "30s, 15 pts",
                    "ic_30_30": "30s, 30 pts",
                    "ic_30_50": "30s, 50 pts",
                    "ic_60_15": "60s, 15 pts",
                    "ic_60_30": "60s, 30 pts",
                    "ic_60_50": "60s, 50 pts",
                }
            },
            path_trace: {
                groupName: "Path Trace",
                desc: "Following the path as fast as possible.",
                modes: {
                    "pt_20": "20 tiles",
                    "pt_40": "40 tiles",
                    "pt_60": "60 tiles",
                    "pt_100": "100 tiles",
                }
            },
            schulte_grid: {
                groupName: "Schulte Grid",
                desc: "Finding and clicking numbers in ascending order as fast as possible.",
                modes: {
                    "sg_3_normal": "3x3, Normal",
                    "sg_3_360": "3x3, 360",
                    "sg_5_normal": "5x5, Normal",
                    "sg_5_360": "5x5, 360",
                }
            },
            circles_recall: {
                groupName: "Circles Recall",
                desc: "Memorize and click numbered circles in ascending order.",
                modes: {
                    "cr_3_1500": "3 lives, 1500ms",
                    "cr_3_800": "3 lives, 800ms",
                    "cr_1_1500": "1 life, 1500ms",
                    "cr_1_800": "1 life, 800ms"
                }
            },
            minesweeper: {
                groupName: "Minesweeper",
                desc: "Uncover safe squares. Logic and deduction.",
                modes: {
                    "ms_easy": "9x9, 10 mines",
                    "ms_medium": "16x16, 40 mines",
                }
            },
            plate_memory: {
                groupName: "Plate Memory",
                desc: "Memorization of license plates.",
                modes: {
                    "pm_ranked": "Ranked"
                }
            }
        }
    },
    fr: {
        header_title: "STATISTIQUES",
        page_title: "Vos Performances (Classé)",
        page_desc: "Suivez votre évolution et comparez-vous aux autres joueurs.",
        play_now: "Jouer pour voir",
        distribution_title: "Répartition (Toutes les tentatives)",
        records_distribution_title: "Répartition (Meilleurs scores)",
        progression_title: "Historique de progression",
        best: "Meilleur",
        you: "Vous",
        top: "Top",
        empty_history: "Battez votre record au moins une fois !",
        login_history: "Connectez-vous pour voir l'historique.",
        error_loading: "Erreur lors du chargement.",
        no_mode_found: "Aucun mode trouvé.",
        logout_confirm: "Bonjour {username} ! Voulez-vous vous déconnecter ?",

                games: {
            math: {
                groupName: "Calcul Mental",
                desc: "Opérations arithmétiques sous contrainte temporelle.",
                modes: {
                    "math_30_1-9": "30s, Diff: 1-9",
                    "math_30_1-99": "30s, Diff: 1-99",
                    "math_60_1-9": "60s, Diff: 1-9",
                    "math_60_1-99": "60s, Diff: 1-99"
                }
            },
            typing: {
                groupName: "Dactylographie",
                desc: "Saisie textuelle évaluée sur la rapidité et la précision.",
                modes: {
                    "typing_10_random": "10s, Aléatoire",
                    "typing_10_quote": "10s, Extrait",
                    "typing_30_random": "30s, Aléatoire",
                    "typing_30_quote": "30s, Extrait",
                    "typing_60_random": "60s, Aléatoire",
                    "typing_60_quote": "60s, Extrait"
                }
            },
            vismem: {
                groupName: "Mémoire Visuelle",
                desc: "Mémorisation et reproduction de motifs spatiaux éphémères.",
                modes: {
                    "vismem_1_100": "1 vie, 100ms",
                    "vismem_3_100": "3 vies, 100ms",
                    "vismem_1_1000": "1 vie, 1s",
                    "vismem_3_1000": "3 vies, 1s"
                }
            },
            chess_pos: {
                groupName: "Chess Position",
                desc: "Mémorisation et reproduction de positions d'échecs.",
                modes: {
                    "cp_1_2000": "1 vie, 2s",
                    "cp_3_2000": "3 vies, 2s",
                    "cp_1_4000": "1 vie, 4s",
                    "cp_3_4000": "3 vies, 4s"
                }
            },
            music: {
                groupName: "Intervalles Musicaux",
                desc: "Identification auditive de la distance tonale.",
                modes: {
                    "music_piano": "Piano",
                    "music_synth": "Synthé",
                    "music_guitar": "Guitare"
                }
            },
            matrix: {
                groupName: "Produit Matriciel",
                desc: "Calcul du produit de deux matrices.",
                modes: {
                    "matrix_2_0_5_60": "2x2, [0,5], 60s",
                    "matrix_2_0_5_180": "2x2, [0,5], 180s",
                    "matrix_2_-10_10_60": "2x2, [-10,10], 60s",
                    "matrix_2_-10_10_180": "2x2, [-10,10], 180s",
                    "matrix_3_0_5_60": "3x3, [0,5], 60s",
                    "matrix_3_0_5_180": "3x3, [0,5], 180s",
                    "matrix_3_-10_10_60": "3x3, [-10,10], 60s",
                    "matrix_3_-10_10_180": "3x3, [-10,10], 180s"
                }
            },
            sudoku: {
                groupName: "Sudoku",
                desc: "Remplissage de grille de Sudoku classique.",
                modes: {
                    "sudoku_9_easy": "9x9, Facile",
                    "sudoku_9_hard": "9x9, Difficile",
                    "sudoku_16_easy": "16x16, Facile",
                    "sudoku_16_hard": "16x16, Difficile",
                    "sudoku_25_easy": "25x25, Facile",
                    "sudoku_25_hard": "25x25, Difficile"
                }
            },
            aim: {
                groupName: "Visée de Cibles",
                desc: "Visées successives de cibles en deux dimensions.",
                modes: {
                    "aim_30_10": "30s, Cible: 10px",
                    "aim_30_30": "30s, Cible: 30px",
                    "aim_30_50": "30s, Cible: 50px",
                    "aim_30_70": "30s, Cible: 70px"
                }
            },
            cardsmem: {
                groupName: "Mémoire de Cartes",
                desc: "Mémorisation d'une suite de cartes.",
                modes: {
                    "cardsmem_500": "Vitesse: 500ms",
                    "cardsmem_1500": "Vitesse: 1500ms"
                }
            },
            card_counting: {
                groupName: "Comptage de Cartes",
                desc: "Méthodes de comptage de cartes pour le Blackjack.",
                modes: {
                    "cc_Hi-Lo_500": "Hi-Lo, 500ms",
                    "cc_Hi-Lo_1500": "Hi-Lo, 1500ms",
                    "cc_Hi-Opt I_500": "Hi-Opt I, 500ms",
                    "cc_Hi-Opt I_1500": "Hi-Opt I, 1500ms",
                    "cc_Hi-Opt II_500": "Hi-Opt II, 500ms",
                    "cc_Hi-Opt II_1500": "Hi-Opt II, 1500ms",
                    "cc_KO_500": "KO, 500ms",
                    "cc_KO_1500": "KO, 1500ms",
                    "cc_Omega II_500": "Omega II, 500ms",
                    "cc_Omega II_1500": "Omega II, 1500ms",
                    "cc_Red 7_500": "Red 7, 500ms",
                    "cc_Red 7_1500": "Red 7, 1500ms",
                    "cc_Halves_500": "Halves, 500ms",
                    "cc_Halves_1500": "Halves, 1500ms",
                    "cc_Zen Count_500": "Zen Count, 500ms",
                    "cc_Zen Count_1500": "Zen Count, 1500ms",
                    "cc_10 Count_500": "10 Count, 500ms",
                    "cc_10 Count_1500": "10 Count, 1500ms"
                }
            },
            vrt: {
                groupName: "Temps de Réaction Visuel",
                desc: "Mesure du temps de réponse moteur à un stimulus visuel.",
                modes: {
                    "vrt_5": "Visuel (5 essais)",
                    "vrt_20": "Visuel (20 essais)"
                }
            },
            art: {
                groupName: "Temps de Réaction Auditif",
                desc: "Mesure du temps de réponse moteur à un stimulus auditif.",
                modes: {
                    "art_5": "Auditif (5 essais)",
                    "art_20": "Auditif (20 essais)"
                }
            },
            chess: {
                groupName: "Coordonnées Échiquéennes",
                desc: "Repérage rapide des cases sur un échiquier.",
                modes: {
                    "chess_white": "Blancs en bas",
                    "chess_black": "Noirs en bas"
                }
            },
            sm: {
                groupName: "Mémoire Séquentielle",
                desc: "Mémorisation et reproduction d'une séquence évolutive.",
                modes: {
                    "sm_1_1000": "1 vie, 1000ms",
                    "sm_1_100": "1 vie, 100ms"
                }
            },
            nm: {
                groupName: "Mémoire des Nombres",
                desc: "Mémorisation de nombres de plus en plus longs.",
                modes: {
                    "nm_1_1000": "1 vie, 1000ms/chiffre",
                    "nm_1_500": "1 vie, 500ms/chiffre"
                }
            },
            ts: {
                groupName: "Time Sense",
                desc: "Estimation de durées sans chronomètre visible.",
                modes: {
                    "ts_2000": "Marge: 2000ms",
                    "ts_1000": "Marge: 1000ms",
                    "ts_3000": "Marge: 3000ms"
                }
            },
            bpm: {
                groupName: "Sens du BPM",
                desc: "Évaluation du tempo d'un métronome.",
                modes: {
                    "bpm_ranked": "Classé"
                }
            },
            kw: {
                groupName: "Marche du Cavalier",
                desc: "Déplacement du cavalier vers la cible le plus rapidement possible.",
                modes: {
                    "kw_30": "30s",
                    "kw_60": "60s",
                    "kw_30_constraint": "30s (Contrainte)",
                    "kw_60_constraint": "60s (Contrainte)",
                    "kw_30_constraint": "30s (Constraint)",
                    "kw_60_constraint": "60s (Constraint)"
                }
            },
            nr: {
                groupName: "Le Compte est Bon",
                desc: "Calcul du nombre cible à l'aide des quatre opérations arithmétiques.",
                modes: {
                    "nr_60": "60s",
                    "nr_90": "90s",
                    "nr_120": "120s"
                }
            },
            fusion: {
                groupName: "Fusion 2048",
                desc: "Fusion de tuiles pour atteindre la cible le plus rapidement possible.",
                modes: {
                    "fusion_512": "Speedrun 512",
                    "fusion_2048": "Speedrun 2048",
                    "fusion_4096": "Speedrun 4096"
                }
            },
            chromatic: {
                groupName: "Mémoire Chromatique",
                desc: "Mémorisation d'une teinte puis reproduction au sélecteur RGB.",
                modes: {
                    "chromatic_200": "200pv",
                    "chromatic_50": "50pv"
                }
            },
            abspitch: {
                groupName: "Oreille Absolue",
                desc: "Identification de la fréquence exacte du son diffusé.",
                modes: {
                    "abspitch": "Classé"
                }
            },
            pc: {
                groupName: "Nuage de Points",
                desc: "Estimation instantanée du nombre de points affichés.",
                modes: {
                    "pc_10_20_windowed": "10 essais, 20 pts",
                    "pc_10_50_windowed": "10 essais, 50 pts",
                    "pc_10_100_windowed": "10 essais, 100 pts",
                    "pc_10_20_fullscreen": "10 essais, 20 pts (Plein écran)",
                    "pc_10_50_fullscreen": "10 essais, 50 pts (Plein écran)",
                    "pc_10_100_fullscreen": "10 essais, 100 pts (Plein écran)"
                }
            },
            pianopitch: {
                groupName: "Oreille Absolue Piano",
                desc: "Identification des notes jouées sur un clavier virtuel.",
                modes: {
                    "pianopitch": "Classé"
                }
            },

            coding_speed: {
                groupName: "Dactylo Code",
                desc: "Saisie d'extraits de code le plus rapidement possible.",
                modes: {
                    "cs_random_10": "10s, Aléatoire",
                    "cs_random_30": "30s, Aléatoire",
                    "cs_random_60": "60s, Aléatoire",
                    "cs_python_10": "10s, Python",
                    "cs_python_30": "30s, Python",
                    "cs_python_60": "60s, Python",
                    "cs_javascript_10": "10s, Javascript",
                    "cs_javascript_30": "30s, Javascript",
                    "cs_javascript_60": "60s, Javascript",
                    "cs_html_10": "10s, Html",
                    "cs_html_30": "30s, Html",
                    "cs_html_60": "60s, Html",
                    "cs_c_10": "10s, C",
                    "cs_c_30": "30s, C",
                    "cs_c_60": "60s, C",
                }
            },
            binary_counting: {
                groupName: "Comptage Binaire",
                desc: "Conversion de nombres binaires et hexadécimaux en base 10.",
                modes: {
                    "bc_30_binary_4": "30s, Bin, 4 bits",
                    "bc_30_binary_8": "30s, Bin, 8 bits",
                    "bc_30_binary_16": "30s, Bin, 16 bits",
                    "bc_30_hex_4": "30s, Hex, 4 bits",
                    "bc_30_hex_8": "30s, Hex, 8 bits",
                    "bc_30_hex_16": "30s, Hex, 16 bits",
                    "bc_60_binary_4": "60s, Bin, 4 bits",
                    "bc_60_binary_8": "60s, Bin, 8 bits",
                    "bc_60_binary_16": "60s, Bin, 16 bits",
                    "bc_60_hex_4": "60s, Hex, 4 bits",
                    "bc_60_hex_8": "60s, Hex, 8 bits",
                    "bc_60_hex_16": "60s, Hex, 16 bits",
                }
            },
            items_counting: {
                groupName: "Comptage d'Items",
                desc: "Dénombrement des items affichés le plus rapidement possible.",
                modes: {
                    "ic_30_15": "30s, 15 pts",
                    "ic_30_30": "30s, 30 pts",
                    "ic_30_50": "30s, 50 pts",
                    "ic_60_15": "60s, 15 pts",
                    "ic_60_30": "60s, 30 pts",
                    "ic_60_50": "60s, 50 pts",
                }
            },
            path_trace: {
                groupName: "Parcours de Chemin",
                desc: "Suivi du tracé le plus rapidement possible.",
                modes: {
                    "pt_20": "20 cases",
                    "pt_40": "40 cases",
                    "pt_60": "60 cases",
                    "pt_100": "100 cases",
                }
            },
            schulte_grid: {
                groupName: "Grille de Schulte",
                desc: "Recherche et clic sur les nombres dans l'ordre croissant le plus vite possible.",
                modes: {
                    "sg_3_normal": "3x3, Normal",
                    "sg_3_360": "3x3, 360",
                    "sg_5_normal": "5x5, Normal",
                    "sg_5_360": "5x5, 360",
                }
            },
            circles_recall: {
                groupName: "Rappel de Cercles",
                desc: "Mémorisez et cliquez sur les cercles numérotés dans l'ordre croissant.",
                modes: {
                    "cr_3_1500": "3 vies, 1500ms",
                    "cr_3_800": "3 vies, 800ms",
                    "cr_1_1500": "1 vie, 1500ms",
                    "cr_1_800": "1 vie, 800ms"
                }
            },
            minesweeper: {
                groupName: "Démineur",
                desc: "Découvrez les cases sûres. Logique et déduction.",
                modes: {
                    "ms_easy": "9x9, 10 mines",
                    "ms_medium": "16x16, 40 mines",
                }
            },
            plate_memory: {
                groupName: "Mémoire des Plaques",
                desc: "Mémorisation de plaques d'immatriculation.",
                modes: {
                    "pm_ranked": "Classé"
                }
            }
        }
    }
};


if (typeof translations !== 'undefined') {
    translations.en.stats = statsTranslations.en;
    translations.fr.stats = statsTranslations.fr;
}

function t(key) {
    const savedLang = localStorage.getItem('siteLanguage');
    const userLang = navigator.language || navigator.userLanguage;
    let lang = 'en'; 

    if (savedLang) {
        lang = savedLang;
    } else if (userLang && userLang.startsWith('fr')) {
        lang = 'fr';
    }

    const text = key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, statsTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, statsTranslations['en']);

        return text || key;
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');

    const loginLink = document.getElementById('nav-login');
    const iconLogin = document.getElementById('icon-login');
    const iconLogout = document.getElementById('icon-logout');

    if (token && userJson && loginLink) {
        const user = JSON.parse(userJson);
        if(iconLogin) iconLogin.style.display = 'none';
        if(iconLogout) iconLogout.style.display = 'block';
        loginLink.href = "#"; 
        loginLink.title = t('header_title');

                const newLoginLink = loginLink.cloneNode(true);
        loginLink.parentNode.replaceChild(newLoginLink, loginLink);
        newLoginLink.addEventListener('click', (e) => {
            e.preventDefault();

                        const msg = t('logout_confirm').replace('{username}', user.username);
            if(confirm(msg)) {
                logout();
            }
        });
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

function formatTime(seconds) {
    const totalMs = Math.floor(Math.max(0, seconds) * 1000);
    const m = Math.floor(totalMs / 60000).toString().padStart(2, '0');
    const s = Math.floor((totalMs % 60000) / 1000).toString().padStart(2, '0');
    const ms = Math.floor((totalMs % 1000) / 10).toString().padStart(2, '0');

        if (m === "00") {
        return `${s}.${ms}s`;
    }
    return `${m}:${s}.${ms}`;
}

document.addEventListener('DOMContentLoaded', () => {

        const savedLang = localStorage.getItem('siteLanguage');
    const userLang = navigator.language || navigator.userLanguage;
    document.documentElement.lang = (savedLang) ? savedLang : (userLang.startsWith('fr') ? 'fr' : 'en');

    checkAuthStatus();




                const GAMES_REGISTRY = [
        {
            groupName: t('games.math.groupName'),
            desc: t('games.math.desc'),
            icon: `<div class="card-icon">
                        <svg width="64" height="40" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-math"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'math_30_1-9', name: t('games.math.modes.math_30_1-9'), localKey: 'math_best_ranked_30_1-9', dbKey: 'math_ranked_30_1-9', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/mental_math?time=30&difficulty=1-9' },
                { id: 'math_30_1-99', name: t('games.math.modes.math_30_1-99'), localKey: 'math_best_ranked_30_1-99', dbKey: 'math_ranked_30_1-99', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/mental_math?time=30&difficulty=1-99' },
                { id: 'math_60_1-9', name: t('games.math.modes.math_60_1-9'), localKey: 'math_best_ranked_60_1-9', dbKey: 'math_ranked_60_1-9', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/mental_math?time=60&difficulty=1-9' },
                { id: 'math_60_1-99', name: t('games.math.modes.math_60_1-99'), localKey: 'math_best_ranked_60_1-99', dbKey: 'math_ranked_60_1-99', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/mental_math?time=60&difficulty=1-99' }
            ]
        },
        {
            groupName: t('games.typing.groupName'),
            desc: t('games.typing.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="1"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-typing"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'typing_10_random', name: t('games.typing.modes.typing_10_random'), localKey: 'typing_best_ranked_10_random', dbKey: 'typing_ranked_10_random', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/typing_game?time=10&mode=random' },
                { id: 'typing_10_quote', name: t('games.typing.modes.typing_10_quote'), localKey: 'typing_best_ranked_10_quote', dbKey: 'typing_ranked_10_quote', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/typing_game?time=10&mode=quote' },
                { id: 'typing_30_random', name: t('games.typing.modes.typing_30_random'), localKey: 'typing_best_ranked_30_random', dbKey: 'typing_ranked_30_random', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/typing_game?time=30&mode=random' },
                { id: 'typing_30_quote', name: t('games.typing.modes.typing_30_quote'), localKey: 'typing_best_ranked_30_quote', dbKey: 'typing_ranked_30_quote', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/typing_game?time=30&mode=quote' },
                { id: 'typing_60_random', name: t('games.typing.modes.typing_60_random'), localKey: 'typing_best_ranked_60_random', dbKey: 'typing_ranked_60_random', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/typing_game?time=60&mode=random' },
                { id: 'typing_60_quote', name: t('games.typing.modes.typing_60_quote'), localKey: 'typing_best_ranked_60_quote', dbKey: 'typing_ranked_60_quote', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/typing_game?time=60&mode=quote' }
            ]
        },
        {
            groupName: t('games.vismem.groupName'),
            desc: t('games.vismem.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" stroke="currentColor" stroke-width="1" fill="none"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-memory"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'vismem_1_100', name: t('games.vismem.modes.vismem_1_100'), localKey: 'vm_best_ranked_1_100', dbKey: 'vm_ranked_1_100', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/visual_memory?lives=1&time=100' },
                { id: 'vismem_3_100', name: t('games.vismem.modes.vismem_3_100'), localKey: 'vm_best_ranked_3_100', dbKey: 'vm_ranked_3_100', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/visual_memory?lives=3&time=100' },
                { id: 'vismem_1_1000', name: t('games.vismem.modes.vismem_1_1000'), localKey: 'vm_best_ranked_1_1000', dbKey: 'vm_ranked_1_1000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/visual_memory?lives=1&time=1000' },
                { id: 'vismem_3_1000', name: t('games.vismem.modes.vismem_3_1000'), localKey: 'vm_best_ranked_3_1000', dbKey: 'vm_ranked_3_1000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/visual_memory?lives=3&time=1000' }
            ]
        },
        {
            groupName: t('games.chess_pos.groupName'),
            desc: t('games.chess_pos.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" aria-hidden="true">
                            <use href="#icon-game-chess-position"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'cp_1_2000', name: t('games.chess_pos.modes.cp_1_2000'), localKey: 'cp_best_ranked_1_2000', dbKey: 'cp_ranked_1_2000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/chess_position?lives=1&time=2000' },
                { id: 'cp_3_2000', name: t('games.chess_pos.modes.cp_3_2000'), localKey: 'cp_best_ranked_3_2000', dbKey: 'cp_ranked_3_2000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/chess_position?lives=3&time=2000' },
                { id: 'cp_1_4000', name: t('games.chess_pos.modes.cp_1_4000'), localKey: 'cp_best_ranked_1_4000', dbKey: 'cp_ranked_1_4000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/chess_position?lives=1&time=4000' },
                { id: 'cp_3_4000', name: t('games.chess_pos.modes.cp_3_4000'), localKey: 'cp_best_ranked_3_4000', dbKey: 'cp_ranked_3_4000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/chess_position?lives=3&time=4000' }
            ]
        },
        {
            groupName: t('games.music.groupName'),
            desc: t('games.music.desc'),
            icon: `<div class="card-icon card-icon-lg">
                        <svg width="44" height="24" stroke="currentColor" style="transform: scale(0.9)"
                            stroke-width="0.75" fill="none" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <use href="#icon-game-music"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'music_piano', name: t('games.music.modes.music_piano'), localKey: 'intervals_best_ranked_piano', dbKey: 'intervals_ranked_piano', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/musical_intervals?instrument=piano' },
                { id: 'music_synth', name: t('games.music.modes.music_synth'), localKey: 'intervals_best_ranked_oscillator', dbKey: 'intervals_ranked_oscillator', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/musical_intervals?instrument=oscillator' },
                { id: 'music_guitar', name: t('games.music.modes.music_guitar'), localKey: 'intervals_best_ranked_guitar', dbKey: 'intervals_ranked_guitar', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/musical_intervals?instrument=guitar' }
            ]
        },
        {
            groupName: t('games.matrix.groupName'),
            desc: t('games.matrix.desc'),
            icon: `<div class="card-icon">
                        <svg width="64" height="32" fill="none" stroke="currentColor" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-matrix"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'matrix_2_0_5_60', name: t('games.matrix.modes.matrix_2_0_5_60'), localKey: 'mp_best_ranked_2_0_5_60', dbKey: 'mp_ranked_2_0_5_60', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/matrix_product?config=2_0_5_60' },
                { id: 'matrix_2_0_5_180', name: t('games.matrix.modes.matrix_2_0_5_180'), localKey: 'mp_best_ranked_2_0_5_180', dbKey: 'mp_ranked_2_0_5_180', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/matrix_product?config=2_0_5_180' },
                { id: 'matrix_2_-10_10_60', name: t('games.matrix.modes.matrix_2_-10_10_60'), localKey: 'mp_best_ranked_2_-10_10_60', dbKey: 'mp_ranked_2_-10_10_60', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/matrix_product?config=2_-10_10_60' },
                { id: 'matrix_2_-10_10_180', name: t('games.matrix.modes.matrix_2_-10_10_180'), localKey: 'mp_best_ranked_2_-10_10_180', dbKey: 'mp_ranked_2_-10_10_180', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/matrix_product?config=2_-10_10_180' },
                { id: 'matrix_3_0_5_60', name: t('games.matrix.modes.matrix_3_0_5_60'), localKey: 'mp_best_ranked_3_0_5_60', dbKey: 'mp_ranked_3_0_5_60', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/matrix_product?config=3_0_5_60' },
                { id: 'matrix_3_0_5_180', name: t('games.matrix.modes.matrix_3_0_5_180'), localKey: 'mp_best_ranked_3_0_5_180', dbKey: 'mp_ranked_3_0_5_180', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/matrix_product?config=3_0_5_180' },
                { id: 'matrix_3_-10_10_60', name: t('games.matrix.modes.matrix_3_-10_10_60'), localKey: 'mp_best_ranked_3_-10_10_60', dbKey: 'mp_ranked_3_-10_10_60', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/matrix_product?config=3_-10_10_60' },
                { id: 'matrix_3_-10_10_180', name: t('games.matrix.modes.matrix_3_-10_10_180'), localKey: 'mp_best_ranked_3_-10_10_180', dbKey: 'mp_ranked_3_-10_10_180', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/matrix_product?config=3_-10_10_180' }
            ]
        },
        {
            groupName: t('games.sudoku.groupName'),
            desc: t('games.sudoku.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" stroke="currentColor" stroke-width="1" fill="none"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-sudoku"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'sudoku_9_easy', name: t('games.sudoku.modes.sudoku_9_easy'), localKey: 'sudoku_best_ranked_9_easy', dbKey: 'sudoku_ranked_9_easy', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/sudoku_classic?config=9_easy' },
                { id: 'sudoku_9_hard', name: t('games.sudoku.modes.sudoku_9_hard'), localKey: 'sudoku_best_ranked_9_hard', dbKey: 'sudoku_ranked_9_hard', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/sudoku_classic?config=9_hard' },
                { id: 'sudoku_16_easy', name: t('games.sudoku.modes.sudoku_16_easy'), localKey: 'sudoku_best_ranked_16_easy', dbKey: 'sudoku_ranked_16_easy', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/sudoku_classic?config=16_easy' },
                { id: 'sudoku_16_hard', name: t('games.sudoku.modes.sudoku_16_hard'), localKey: 'sudoku_best_ranked_16_hard', dbKey: 'sudoku_ranked_16_hard', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/sudoku_classic?config=16_hard' },
                { id: 'sudoku_25_easy', name: t('games.sudoku.modes.sudoku_25_easy'), localKey: 'sudoku_best_ranked_25_easy', dbKey: 'sudoku_ranked_25_easy', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/sudoku_classic?config=25_easy' },
                { id: 'sudoku_25_hard', name: t('games.sudoku.modes.sudoku_25_hard'), localKey: 'sudoku_best_ranked_25_hard', dbKey: 'sudoku_ranked_25_hard', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/sudoku_classic?config=25_hard' }
            ]
        },
        {
            groupName: t('games.aim.groupName'),
            desc: t('games.aim.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.1)" fill="none" stroke="currentColor"
                            stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-aim"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'aim_30_10_windowed', name: t('games.aim.modes.aim_30_10') + ' (Windowed)', localKey: 'aim_best_ranked_30_10_windowed', dbKey: 'aim_ranked_30_10_windowed', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/target_aiming?time=30&size=10&display_mode=windowed' },
                { id: 'aim_30_30_windowed', name: t('games.aim.modes.aim_30_30') + ' (Windowed)', localKey: 'aim_best_ranked_30_30_windowed', dbKey: 'aim_ranked_30_30_windowed', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/target_aiming?time=30&size=30&display_mode=windowed' },
                { id: 'aim_30_50_windowed', name: t('games.aim.modes.aim_30_50') + ' (Windowed)', localKey: 'aim_best_ranked_30_50_windowed', dbKey: 'aim_ranked_30_50_windowed', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/target_aiming?time=30&size=50&display_mode=windowed' },
                { id: 'aim_30_70_windowed', name: t('games.aim.modes.aim_30_70') + ' (Windowed)', localKey: 'aim_best_ranked_30_70_windowed', dbKey: 'aim_ranked_30_70_windowed', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/target_aiming?time=30&size=70&display_mode=windowed' },
                { id: 'aim_30_10_fullscreen', name: t('games.aim.modes.aim_30_10') + ' (Fullscreen)', localKey: 'aim_best_ranked_30_10_fullscreen', dbKey: 'aim_ranked_30_10_fullscreen', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/target_aiming?time=30&size=10&display_mode=fullscreen' },
                { id: 'aim_30_30_fullscreen', name: t('games.aim.modes.aim_30_30') + ' (Fullscreen)', localKey: 'aim_best_ranked_30_30_fullscreen', dbKey: 'aim_ranked_30_30_fullscreen', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/target_aiming?time=30&size=30&display_mode=fullscreen' },
                { id: 'aim_30_50_fullscreen', name: t('games.aim.modes.aim_30_50') + ' (Fullscreen)', localKey: 'aim_best_ranked_30_50_fullscreen', dbKey: 'aim_ranked_30_50_fullscreen', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/target_aiming?time=30&size=50&display_mode=fullscreen' },
                { id: 'aim_30_70_fullscreen', name: t('games.aim.modes.aim_30_70') + ' (Fullscreen)', localKey: 'aim_best_ranked_30_70_fullscreen', dbKey: 'aim_ranked_30_70_fullscreen', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/target_aiming?time=30&size=70&display_mode=fullscreen' }
            ]
        },
        {
            groupName: t('games.cardsmem.groupName'),
            desc: t('games.cardsmem.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.1); overflow: visible;"
                            fill="currentColor" stroke="none" aria-hidden="true">
                            <use href="#icon-game-cards"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'cardsmem_500', name: t('games.cardsmem.modes.cardsmem_500'), localKey: 'cards_memory_best_ranked_500', dbKey: 'cards_memory_ranked_500', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/cards_memory?time=500' },
                { id: 'cardsmem_1500', name: t('games.cardsmem.modes.cardsmem_1500'), localKey: 'cards_memory_best_ranked_1500', dbKey: 'cards_memory_ranked_1500', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/cards_memory?time=1500' }
            ]
        },
        {
            groupName: t('games.card_counting.groupName'),
            desc: t('games.card_counting.desc'),
            icon: `<div class="card-icon">
                        <svg width="140" height="60" fill="currentColor" stroke="none" aria-hidden="true">
                            <use href="#icon-game-card-counting"></use>
                        </svg>
                    </div>`,
            modes: [
                'Hi-Lo', 'Hi-Opt I', 'Hi-Opt II', 'KO', 'Omega II', 'Red 7', 'Halves', 'Zen Count', '10 Count'
            ].flatMap(system => [
                { id: `cc_${system}_500`, name: t(`games.card_counting.modes.cc_${system}_500`), localKey: `card_counting_best_ranked_${system}_500`, dbKey: `card_counting_ranked_${system}_500`, unit: 'série', lowerIsBetter: false, route: `/api/scores/distribution/card_counting?displayTime=500&system=${encodeURIComponent(system)}` },
                { id: `cc_${system}_1500`, name: t(`games.card_counting.modes.cc_${system}_1500`), localKey: `card_counting_best_ranked_${system}_1500`, dbKey: `card_counting_ranked_${system}_1500`, unit: 'série', lowerIsBetter: false, route: `/api/scores/distribution/card_counting?displayTime=1500&system=${encodeURIComponent(system)}` }
            ])
        },
        {
            groupName: t('games.vrt.groupName'),
            desc: t('games.vrt.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="1.2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-visual-reaction"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'vrt_5', name: t('games.vrt.modes.vrt_5'), localKey: 'vrt_best_ranked_5', dbKey: 'vrt_ranked_5', unit: 'ms', lowerIsBetter: true, route: '/api/scores/distribution/visual_reaction_time?attempts=5' },
                { id: 'vrt_20', name: t('games.vrt.modes.vrt_20'), localKey: 'vrt_best_ranked_20', dbKey: 'vrt_ranked_20', unit: 'ms', lowerIsBetter: true, route: '/api/scores/distribution/visual_reaction_time?attempts=20' }
            ]
        },
        {
            groupName: t('games.art.groupName'),
            desc: t('games.art.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" fill="none" stroke="currentColor" stroke-width="1.2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-auditory"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'art_5', name: t('games.art.modes.art_5'), localKey: 'art_best_ranked_5', dbKey: 'art_ranked_5', unit: 'ms', lowerIsBetter: true, route: '/api/scores/distribution/auditory_reaction_time?attempts=5' },
                { id: 'art_20', name: t('games.art.modes.art_20'), localKey: 'art_best_ranked_20', dbKey: 'art_ranked_20', unit: 'ms', lowerIsBetter: true, route: '/api/scores/distribution/auditory_reaction_time?attempts=20' }
            ]
        },
        {
            groupName: t('games.chess.groupName'),
            desc: t('games.chess.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.1); overflow: visible;" fill="none"
                            stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <use href="#icon-game-chess"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'chess_white', name: t('games.chess.modes.chess_white'), localKey: 'cc_best_ranked_white', dbKey: 'cc_ranked_white', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/chess_coordinates?orientation=white' },
                { id: 'chess_black', name: t('games.chess.modes.chess_black'), localKey: 'cc_best_ranked_black', dbKey: 'cc_ranked_black', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/chess_coordinates?orientation=black' }
            ]
        },
        {
            groupName: t('games.sm.groupName'),
            desc: t('games.sm.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" stroke="currentColor" stroke-width="1" fill="none"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-sequence"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'sm_1_1000', name: t('games.sm.modes.sm_1_1000'), localKey: 'sm_best_ranked_1_1000', dbKey: 'sm_ranked_1_1000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/sequence_memory?lives=1&time=1000' },
                { id: 'sm_1_100', name: t('games.sm.modes.sm_1_100'), localKey: 'sm_best_ranked_1_100', dbKey: 'sm_ranked_1_100', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/sequence_memory?lives=1&time=100' }
            ]
        },
        {
            groupName: t('games.nm.groupName'),
            desc: t('games.nm.desc'),
            icon: `<div class="card-icon">
                        <svg width="120" height="60" aria-hidden="true">
                            <use href="#icon-game-number"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'nm_1_1000', name: t('games.nm.modes.nm_1_1000'), localKey: 'nm_best_ranked_1_1000', dbKey: 'nm_ranked_1_1000', unit: 'ch.', lowerIsBetter: false, route: '/api/scores/distribution/number_memory?lives=1&time=1000' },
                { id: 'nm_1_500', name: t('games.nm.modes.nm_1_500'), localKey: 'nm_best_ranked_1_500', dbKey: 'nm_ranked_1_500', unit: 'ch.', lowerIsBetter: false, route: '/api/scores/distribution/number_memory?lives=1&time=500' }
            ]
        },
        {
            groupName: t('games.ts.groupName'),
            desc: t('games.ts.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.1)" fill="none" stroke="currentColor"
                            stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-time"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'ts_2000', name: t('games.ts.modes.ts_2000'), localKey: 'ts_best_ranked_2000', dbKey: 'ts_ranked_2000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/time_sense?gauge=2000' },
                { id: 'ts_1000', name: t('games.ts.modes.ts_1000'), localKey: 'ts_best_ranked_1000', dbKey: 'ts_ranked_1000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/time_sense?gauge=1000' },
                { id: 'ts_3000', name: t('games.ts.modes.ts_3000'), localKey: 'ts_best_ranked_3000', dbKey: 'ts_ranked_3000', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/time_sense?gauge=3000' }
            ]
        },
        {
            groupName: t('games.bpm.groupName'),
            desc: t('games.bpm.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" fill="currentColor" stroke="none" aria-hidden="true">
                            <use href="#icon-game-bpm"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'bpm_ranked', name: t('games.bpm.modes.bpm_ranked'), localKey: 'bpm_best_ranked', dbKey: 'bpm_ranked', unit: 'rnds', lowerIsBetter: false, route: '/api/scores/distribution/bpm_sense' }
            ]
        },
        {
            groupName: t('games.kw.groupName'),
            desc: t('games.kw.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.1); overflow: visible;" fill="none"
                            stroke="currentColor" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <use href="#icon-game-knight-walk"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'kw_30', name: t('games.kw.modes.kw_30'), localKey: 'kw_best_ranked_30', dbKey: 'kw_ranked_30', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/knight_walk?time=30&constraint=false' },
                { id: 'kw_60', name: t('games.kw.modes.kw_60'), localKey: 'kw_best_ranked_60', dbKey: 'kw_ranked_60', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/knight_walk?time=60&constraint=false' },
                { id: 'kw_30_constraint', name: t('games.kw.modes.kw_30_constraint'), localKey: 'kw_best_ranked_30_constraint', dbKey: 'kw_ranked_30_constraint', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/knight_walk?time=30&constraint=true' },
                { id: 'kw_60_constraint', name: t('games.kw.modes.kw_60_constraint'), localKey: 'kw_best_ranked_60_constraint', dbKey: 'kw_ranked_60_constraint', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/knight_walk?time=60&constraint=true' }
            ]
        },
        {
            groupName: t('games.nr.groupName'),
            desc: t('games.nr.desc'),
            icon: `<div class="card-icon">
                        <svg width="140" height="60" style="transform: scale(1.1)" fill="currentColor" stroke="none"
                            aria-hidden="true">
                            <use href="#icon-numbers_round"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'nr_60', name: t('games.nr.modes.nr_60'), localKey: 'nr_best_ranked_60', dbKey: 'nr_ranked_60', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/numbers_round?time=60' },
                { id: 'nr_90', name: t('games.nr.modes.nr_90'), localKey: 'nr_best_ranked_90', dbKey: 'nr_ranked_90', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/numbers_round?time=90' },
                { id: 'nr_120', name: t('games.nr.modes.nr_120'), localKey: 'nr_best_ranked_120', dbKey: 'nr_ranked_120', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/numbers_round?time=120' }
            ]
        },
        {
            groupName: t('games.fusion.groupName'),
            desc: t('games.fusion.desc'),
            icon: `<div class="card-icon">
                        <svg width="140" height="60" style="transform: scale(1.2)" fill="currentColor" stroke="none"
                            aria-hidden="true">
                            <use href="#icon-fusion_2048"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'fusion_512', name: t('games.fusion.modes.fusion_512'), localKey: 'fusion_best_ranked_512', dbKey: 'fusion_ranked_512', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/fusion_2048?target=512' },
                { id: 'fusion_2048', name: t('games.fusion.modes.fusion_2048'), localKey: 'fusion_best_ranked_2048', dbKey: 'fusion_ranked_2048', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/fusion_2048?target=2048' },
                { id: 'fusion_4096', name: t('games.fusion.modes.fusion_4096'), localKey: 'fusion_best_ranked_4096', dbKey: 'fusion_ranked_4096', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/fusion_2048?target=4096' }
            ]
        },
        {
            groupName: t('games.chromatic.groupName'),
            desc: t('games.chromatic.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" class="card-icon-chromatic" style="transform: scale(1.1)"
                            fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                            stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-chromatic"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'chromatic_200', name: t('games.chromatic.modes.chromatic_200'), localKey: 'chromatic_memory_best_200', dbKey: 'chromatic_memory_ranked_200', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/chromatic_memory?life_pool=200' },
                { id: 'chromatic_50', name: t('games.chromatic.modes.chromatic_50'), localKey: 'chromatic_memory_best_50', dbKey: 'chromatic_memory_ranked_50', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/chromatic_memory?life_pool=50' }
            ]
        },
        {
            groupName: t('games.abspitch.groupName'),
            desc: t('games.abspitch.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" class="card-icon-absolute-pitch" style="transform: scale(1.2)"
                            fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                            stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-absolute_pitch"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'abspitch_0', name: 'Précision: 1Hz', localKey: 'abspitch_best_ranked', dbKey: 'abspitch_ranked', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/absolute_pitch' },
                { id: 'abspitch_1', name: 'Précision: 0.1Hz', localKey: 'abspitch_best_ranked_1', dbKey: 'abspitch_ranked_p1', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/absolute_pitch_p1' },
                { id: 'abspitch_2', name: 'Précision: 0.01Hz', localKey: 'abspitch_best_ranked_2', dbKey: 'abspitch_ranked_p2', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/absolute_pitch_p2' }
            ]
        },
        {
            groupName: t('games.pc.groupName'),
            desc: t('games.pc.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.4)" fill="currentColor" stroke="none"
                            aria-hidden="true">
                            <use href="#icon-point_cloud"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'pc_10_20_windowed', name: t('games.pc.modes.pc_10_20_windowed'), localKey: 'pc_best_ranked_r10_p20_windowed', dbKey: 'pc_ranked_r10_p20_windowed', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/point_cloud?rounds=10&size=20&display_mode=windowed' },
                { id: 'pc_10_50_windowed', name: t('games.pc.modes.pc_10_50_windowed'), localKey: 'pc_best_ranked_r10_p50_windowed', dbKey: 'pc_ranked_r10_p50_windowed', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/point_cloud?rounds=10&size=50&display_mode=windowed' },
                { id: 'pc_10_100_windowed', name: t('games.pc.modes.pc_10_100_windowed'), localKey: 'pc_best_ranked_r10_p100_windowed', dbKey: 'pc_ranked_r10_p100_windowed', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/point_cloud?rounds=10&size=100&display_mode=windowed' },
                { id: 'pc_10_20_fullscreen', name: t('games.pc.modes.pc_10_20_fullscreen'), localKey: 'pc_best_ranked_r10_p20_fullscreen', dbKey: 'pc_ranked_r10_p20_fullscreen', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/point_cloud?rounds=10&size=20&display_mode=fullscreen' },
                { id: 'pc_10_50_fullscreen', name: t('games.pc.modes.pc_10_50_fullscreen'), localKey: 'pc_best_ranked_r10_p50_fullscreen', dbKey: 'pc_ranked_r10_p50_fullscreen', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/point_cloud?rounds=10&size=50&display_mode=fullscreen' },
                { id: 'pc_10_100_fullscreen', name: t('games.pc.modes.pc_10_100_fullscreen'), localKey: 'pc_best_ranked_r10_p100_fullscreen', dbKey: 'pc_ranked_r10_p100_fullscreen', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/point_cloud?rounds=10&size=100&display_mode=fullscreen' }
            ]
        },
        {
            groupName: t('games.pianopitch.groupName'),
            desc: t('games.pianopitch.desc'),
            icon: `<div class="card-icon card-icon-lg">
                        <svg width="44" height="24" stroke="currentColor"
                            style="transform: scale(0.9); overflow: visible;" stroke-width="0.75" fill="none"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-piano"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'pianopitch', name: t('games.pianopitch.modes.pianopitch'), localKey: 'pianopitch_best_ranked', dbKey: 'pianopitch_ranked', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/piano_pitch' }
            ]
        },
        {
            groupName: t('games.coding_speed.groupName'),
            desc: t('games.coding_speed.desc'),
            icon: `<div class="card-icon card-icon-lg">
                        <svg width="44" height="24" stroke="currentColor"
                            style="transform: scale(0.9); overflow: visible;" stroke-width="1.2" fill="none"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-code"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'cs_random_10', name: t('games.coding_speed.modes.cs_random_10'), localKey: 'coding_best_ranked_10_random', dbKey: 'coding_speed_ranked_random_10', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=10&lang=random' },
                { id: 'cs_random_30', name: t('games.coding_speed.modes.cs_random_30'), localKey: 'coding_best_ranked_30_random', dbKey: 'coding_speed_ranked_random_30', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=30&lang=random' },
                { id: 'cs_random_60', name: t('games.coding_speed.modes.cs_random_60'), localKey: 'coding_best_ranked_60_random', dbKey: 'coding_speed_ranked_random_60', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=60&lang=random' },
                { id: 'cs_python_10', name: t('games.coding_speed.modes.cs_python_10'), localKey: 'coding_best_ranked_10_python', dbKey: 'coding_speed_ranked_python_10', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=10&lang=python' },
                { id: 'cs_python_30', name: t('games.coding_speed.modes.cs_python_30'), localKey: 'coding_best_ranked_30_python', dbKey: 'coding_speed_ranked_python_30', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=30&lang=python' },
                { id: 'cs_python_60', name: t('games.coding_speed.modes.cs_python_60'), localKey: 'coding_best_ranked_60_python', dbKey: 'coding_speed_ranked_python_60', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=60&lang=python' },
                { id: 'cs_javascript_10', name: t('games.coding_speed.modes.cs_javascript_10'), localKey: 'coding_best_ranked_10_javascript', dbKey: 'coding_speed_ranked_javascript_10', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=10&lang=javascript' },
                { id: 'cs_javascript_30', name: t('games.coding_speed.modes.cs_javascript_30'), localKey: 'coding_best_ranked_30_javascript', dbKey: 'coding_speed_ranked_javascript_30', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=30&lang=javascript' },
                { id: 'cs_javascript_60', name: t('games.coding_speed.modes.cs_javascript_60'), localKey: 'coding_best_ranked_60_javascript', dbKey: 'coding_speed_ranked_javascript_60', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=60&lang=javascript' },
                { id: 'cs_html_10', name: t('games.coding_speed.modes.cs_html_10'), localKey: 'coding_best_ranked_10_html', dbKey: 'coding_speed_ranked_html_10', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=10&lang=html' },
                { id: 'cs_html_30', name: t('games.coding_speed.modes.cs_html_30'), localKey: 'coding_best_ranked_30_html', dbKey: 'coding_speed_ranked_html_30', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=30&lang=html' },
                { id: 'cs_html_60', name: t('games.coding_speed.modes.cs_html_60'), localKey: 'coding_best_ranked_60_html', dbKey: 'coding_speed_ranked_html_60', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=60&lang=html' },
                { id: 'cs_c_10', name: t('games.coding_speed.modes.cs_c_10'), localKey: 'coding_best_ranked_10_c', dbKey: 'coding_speed_ranked_c_10', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=10&lang=c' },
                { id: 'cs_c_30', name: t('games.coding_speed.modes.cs_c_30'), localKey: 'coding_best_ranked_30_c', dbKey: 'coding_speed_ranked_c_30', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=30&lang=c' },
                { id: 'cs_c_60', name: t('games.coding_speed.modes.cs_c_60'), localKey: 'coding_best_ranked_60_c', dbKey: 'coding_speed_ranked_c_60', unit: 'wpm', lowerIsBetter: false, route: '/api/scores/distribution/coding_speed?time=60&lang=c' },
            ]
        },
        {
            groupName: t('games.binary_counting.groupName'),
            desc: t('games.binary_counting.desc'),
            icon: `<div class="card-icon">
                        <svg width="80" height="40" fill="none" stroke="currentColor" stroke-width="1.5"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-binary-counting"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'bc_30_binary_4', name: t('games.binary_counting.modes.bc_30_binary_4'), localKey: 'bc_best_ranked_30_binary_4', dbKey: 'bc_ranked_30_binary_4', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=30&difficulty=binary_4' },
                { id: 'bc_30_binary_8', name: t('games.binary_counting.modes.bc_30_binary_8'), localKey: 'bc_best_ranked_30_binary_8', dbKey: 'bc_ranked_30_binary_8', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=30&difficulty=binary_8' },
                { id: 'bc_30_binary_16', name: t('games.binary_counting.modes.bc_30_binary_16'), localKey: 'bc_best_ranked_30_binary_16', dbKey: 'bc_ranked_30_binary_16', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=30&difficulty=binary_16' },
                { id: 'bc_30_hex_4', name: t('games.binary_counting.modes.bc_30_hex_4'), localKey: 'bc_best_ranked_30_hex_4', dbKey: 'bc_ranked_30_hex_4', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=30&difficulty=hex_4' },
                { id: 'bc_30_hex_8', name: t('games.binary_counting.modes.bc_30_hex_8'), localKey: 'bc_best_ranked_30_hex_8', dbKey: 'bc_ranked_30_hex_8', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=30&difficulty=hex_8' },
                { id: 'bc_30_hex_16', name: t('games.binary_counting.modes.bc_30_hex_16'), localKey: 'bc_best_ranked_30_hex_16', dbKey: 'bc_ranked_30_hex_16', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=30&difficulty=hex_16' },
                { id: 'bc_60_binary_4', name: t('games.binary_counting.modes.bc_60_binary_4'), localKey: 'bc_best_ranked_60_binary_4', dbKey: 'bc_ranked_60_binary_4', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=60&difficulty=binary_4' },
                { id: 'bc_60_binary_8', name: t('games.binary_counting.modes.bc_60_binary_8'), localKey: 'bc_best_ranked_60_binary_8', dbKey: 'bc_ranked_60_binary_8', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=60&difficulty=binary_8' },
                { id: 'bc_60_binary_16', name: t('games.binary_counting.modes.bc_60_binary_16'), localKey: 'bc_best_ranked_60_binary_16', dbKey: 'bc_ranked_60_binary_16', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=60&difficulty=binary_16' },
                { id: 'bc_60_hex_4', name: t('games.binary_counting.modes.bc_60_hex_4'), localKey: 'bc_best_ranked_60_hex_4', dbKey: 'bc_ranked_60_hex_4', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=60&difficulty=hex_4' },
                { id: 'bc_60_hex_8', name: t('games.binary_counting.modes.bc_60_hex_8'), localKey: 'bc_best_ranked_60_hex_8', dbKey: 'bc_ranked_60_hex_8', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=60&difficulty=hex_8' },
                { id: 'bc_60_hex_16', name: t('games.binary_counting.modes.bc_60_hex_16'), localKey: 'bc_best_ranked_60_hex_16', dbKey: 'bc_ranked_60_hex_16', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/binary_counting?time=60&difficulty=hex_16' },
            ]
        },
        {
            groupName: t('games.items_counting.groupName'),
            desc: t('games.items_counting.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.2)" fill="currentColor" stroke="none"
                            aria-hidden="true">
                            <use href="#icon-items_counting"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'ic_30_15', name: t('games.items_counting.modes.ic_30_15'), localKey: 'ic_best_ranked_30_15', dbKey: 'ic_ranked_30_15', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/items_counting?time=30&points=15' },
                { id: 'ic_30_30', name: t('games.items_counting.modes.ic_30_30'), localKey: 'ic_best_ranked_30_30', dbKey: 'ic_ranked_30_30', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/items_counting?time=30&points=30' },
                { id: 'ic_30_50', name: t('games.items_counting.modes.ic_30_50'), localKey: 'ic_best_ranked_30_50', dbKey: 'ic_ranked_30_50', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/items_counting?time=30&points=50' },
                { id: 'ic_60_15', name: t('games.items_counting.modes.ic_60_15'), localKey: 'ic_best_ranked_60_15', dbKey: 'ic_ranked_60_15', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/items_counting?time=60&points=15' },
                { id: 'ic_60_30', name: t('games.items_counting.modes.ic_60_30'), localKey: 'ic_best_ranked_60_30', dbKey: 'ic_ranked_60_30', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/items_counting?time=60&points=30' },
                { id: 'ic_60_50', name: t('games.items_counting.modes.ic_60_50'), localKey: 'ic_best_ranked_60_50', dbKey: 'ic_ranked_60_50', unit: 'pts', lowerIsBetter: false, route: '/api/scores/distribution/items_counting?time=60&points=50' },
            ]
        },
        {
            groupName: t('games.path_trace.groupName'),
            desc: t('games.path_trace.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" transform="scale(1.2)" fill="none" stroke="currentColor"
                            stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <use href="#icon-game-path-trace"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'pt_20', name: t('games.path_trace.modes.pt_20'), localKey: 'pt_best_ranked_20', dbKey: 'pt_ranked_20', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/path_trace?config=20' },
                { id: 'pt_40', name: t('games.path_trace.modes.pt_40'), localKey: 'pt_best_ranked_40', dbKey: 'pt_ranked_40', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/path_trace?config=40' },
                { id: 'pt_60', name: t('games.path_trace.modes.pt_60'), localKey: 'pt_best_ranked_60', dbKey: 'pt_ranked_60', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/path_trace?config=60' },
                { id: 'pt_100', name: t('games.path_trace.modes.pt_100'), localKey: 'pt_best_ranked_100', dbKey: 'pt_ranked_100', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/path_trace?config=100' },
            ]
        },
        {
            groupName: t('games.schulte_grid.groupName'),
            desc: t('games.schulte_grid.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.4)" fill="currentColor" stroke="none"
                            aria-hidden="true">
                            <use href="#icon-game-schulte-grid"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'sg_3_normal', name: t('games.schulte_grid.modes.sg_3_normal'), localKey: 'sg_best_ranked_3x3_normal', dbKey: 'sg_ranked_3x3_normal', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/schulte_grid?grid=3x3&mode=normal' },
                { id: 'sg_3_360', name: t('games.schulte_grid.modes.sg_3_360'), localKey: 'sg_best_ranked_3x3_360', dbKey: 'sg_ranked_3x3_360', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/schulte_grid?grid=3x3&mode=360' },
                { id: 'sg_5_normal', name: t('games.schulte_grid.modes.sg_5_normal'), localKey: 'sg_best_ranked_5x5_normal', dbKey: 'sg_ranked_5x5_normal', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/schulte_grid?grid=5x5&mode=normal' },
                { id: 'sg_5_360', name: t('games.schulte_grid.modes.sg_5_360'), localKey: 'sg_best_ranked_5x5_360', dbKey: 'sg_ranked_5x5_360', unit: 'time', lowerIsBetter: true, route: '/api/scores/distribution/schulte_grid?grid=5x5&mode=360' },
            ]
        },
        {
            groupName: t('games.circles_recall.groupName'),
            desc: t('games.circles_recall.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.4)" fill="currentColor" stroke="none"
                            aria-hidden="true">
                            <use href="#icon-game-circles-recall"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'cr_3_1500', name: t('games.circles_recall.modes.cr_3_1500'), localKey: 'cr_best_ranked_3_1500', dbKey: 'cr_ranked_3_1500', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/circles_recall?lives=3&time=1500' },
                { id: 'cr_3_800', name: t('games.circles_recall.modes.cr_3_800'), localKey: 'cr_best_ranked_3_800', dbKey: 'cr_ranked_3_800', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/circles_recall?lives=3&time=800' },
                { id: 'cr_1_1500', name: t('games.circles_recall.modes.cr_1_1500'), localKey: 'cr_best_ranked_1_1500', dbKey: 'cr_ranked_1_1500', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/circles_recall?lives=1&time=1500' },
                { id: 'cr_1_800', name: t('games.circles_recall.modes.cr_1_800'), localKey: 'cr_best_ranked_1_800', dbKey: 'cr_ranked_1_800', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/circles_recall?lives=1&time=800' }
            ]
        },
        {
            groupName: t('games.minesweeper.groupName'),
            desc: t('games.minesweeper.desc'),
            icon: `<div class="card-icon">
                        <svg width="60" height="60" style="transform: scale(1.4)" fill="currentColor" stroke="none"
                            aria-hidden="true">
                            <use href="#icon-game-minesweeper"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'ms_easy', name: t('games.minesweeper.modes.ms_easy'), localKey: 'ms_best_ranked_easy', dbKey: 'minesweeper_easy', unit: 's', lowerIsBetter: true, route: '/api/scores/distribution/minesweeper?difficulty=easy' },
                { id: 'ms_medium', name: t('games.minesweeper.modes.ms_medium'), localKey: 'ms_best_ranked_medium', dbKey: 'minesweeper_medium', unit: 's', lowerIsBetter: true, route: '/api/scores/distribution/minesweeper?difficulty=medium' },
            ]
        },
        {
            groupName: t('games.plate_memory.groupName'),
            desc: t('games.plate_memory.desc'),
            icon: `<div class="card-icon">
                        <svg width="80" height="40" style="transform: scale(1.1)" aria-hidden="true">
                            <use href="#icon-game-plate-memory"></use>
                        </svg>
                    </div>`,
            modes: [
                { id: 'pm_ranked', name: t('games.plate_memory.modes.pm_ranked'), localKey: 'pm_best_ranked', dbKey: 'plate_memory_ranked', unit: 'niv.', lowerIsBetter: false, route: '/api/scores/distribution/plate_memory' }
            ]
        }
    ];

    const StatsManager = {
        els: {
            container: document.getElementById('stats-container')
        },

        async init() {
            this.buildLayout();
            await this.loadAndSortGames();
            this.renderCategories();
            this.initSearch();
            this.bindGlobalEvents();
        },

        async loadAndSortGames() {
            try {
                const res = await fetch('/api/scores/counts');
                if (!res.ok) return;
                const counts = await res.json();

                                const countMap = {};
                counts.forEach(c => {
                    countMap[c.gameId] = c.count || c.playCount || 0;
                });

                GAMES_REGISTRY.sort((a, b) => {
                    const aId = a.modes[0].route.split('?')[0].split('/').pop();
                    const bId = b.modes[0].route.split('?')[0].split('/').pop();

                                        const countA = countMap[aId] || 0;
                    const countB = countMap[bId] || 0;

                                        return countB - countA;
                });
            } catch (err) {
                console.error("Erreur lors du tri des jeux:", err);
            }
        },

        buildLayout() {
            this.els.container.innerHTML = `
                <div id="search-results-section" class="hidden" style="margin-bottom: 4rem;">
                    <div id="search-grid" class="stats-compact-grid"></div>
                </div>

                <div id="games-list-section">
                    <div id="games-grid" class="games-grid-stats"></div>
                </div>
            `;

                        this.els.searchResultsSection = document.getElementById('search-results-section');
            this.els.searchGrid = document.getElementById('search-grid');
            this.els.gamesListSection = document.getElementById('games-list-section');
            this.els.gamesGrid = document.getElementById('games-grid');
            this.els.searchInput = document.getElementById('stats-search');
        },

        countPlayedModes(modes) {
            return modes.filter(m => localStorage.getItem(m.localKey) !== null).length;
        },

        initSearch() {
            if (!this.els.searchInput) return;

            this.els.searchInput.addEventListener('focus', () => {
                this.handleSearch(this.els.searchInput.value, true);
            });

            this.els.searchInput.addEventListener('input', () => {
                this.handleSearch(this.els.searchInput.value, true);
            });
        },

        bindGlobalEvents() {
            const searchWrapper = this.els.searchInput ? this.els.searchInput.closest('.search-wrapper') : null;

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const searchOpen = this.els.searchResultsSection && !this.els.searchResultsSection.classList.contains('hidden');
                    if (searchOpen) {
                        this.closeSearch();
                    } else {
                        this.closeInlineModes();
                    }
                }
            });

            document.addEventListener('mousedown', (e) => {
                if (this.els.searchResultsSection && !this.els.searchResultsSection.classList.contains('hidden')) {
                    const isClickInsideSearch = searchWrapper && searchWrapper.contains(e.target);
                    const isClickInsideResults = this.els.searchResultsSection.contains(e.target);
                    if (!isClickInsideSearch && !isClickInsideResults) {
                        this.closeSearch();
                    }
                }

                const inlineContainer = document.querySelector('.inline-modes-container');
                if (inlineContainer) {
                    const clickedInsideInline = inlineContainer.contains(e.target);
                    const clickedOnCategory = e.target.closest('.stat-category-card');
                    if (!clickedInsideInline && !clickedOnCategory) {
                        this.closeInlineModes();
                    }
                }
            });
        },

        handleSearch(term, isFocused = false) {
            const normalizedTerm = (term || "").toLowerCase().trim();

                        if (!this.els.searchResultsSection || !this.els.gamesListSection || !this.els.searchGrid) return;

            this.closeInlineModes();

            if (!normalizedTerm && !isFocused) {
                this.closeSearch();
                return;
            }

            this.els.searchResultsSection.classList.remove('hidden');

            let results = [];
            GAMES_REGISTRY.forEach(group => {
                const groupMatch = group.groupName.toLowerCase().includes(normalizedTerm);
                group.modes.forEach(mode => {
                    if (!normalizedTerm || groupMatch || mode.name.toLowerCase().includes(normalizedTerm)) {
                        results.push({ ...mode, searchTitle: `${group.groupName} - ${mode.name}` });
                    }
                });
            });

            this.renderModesGrid(results, this.els.searchGrid, true);
        },

        closeSearch() {
            if (this.els.searchResultsSection) this.els.searchResultsSection.classList.add('hidden');
            if (this.els.gamesListSection) this.els.gamesListSection.classList.remove('hidden');

                        if (this.els.searchInput) {
                this.els.searchInput.value = '';
                this.els.searchInput.blur();
            }

            if (this.els.searchGrid) this.els.searchGrid.innerHTML = '';
        },

        closeInlineModes() {
            const inlineContainer = document.querySelector('.inline-modes-container');
            if (inlineContainer) inlineContainer.remove();

                        if (this.els.gamesGrid) {
                this.els.gamesGrid.querySelectorAll('.stat-category-card').forEach(c => {
                    c.style.borderColor = '';
                });
            }
        },

        renderCategories() {
            this.els.gamesGrid.innerHTML = '';

            GAMES_REGISTRY.forEach(group => {
                const playedCount = this.countPlayedModes(group.modes);
                const totalCount = group.modes.length;

                                const card = document.createElement('div');
                card.className = 'stat-category-card';

                                card.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; flex: 1; width: 100%;">
                        <h2 class="stat-category-title" style="margin-bottom: 1rem;">${group.groupName}</h2>
                        ${group.icon}
                    </div>
                    <div style="width: 100%; text-align: center; padding-top: 0.8rem; margin-top: auto;">
                        <span style="font-family: var(--font-heading); font-weight: 600; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">
                            ${playedCount} / ${totalCount} modes
                        </span>
                    </div>
                `;

                card.addEventListener('click', () => {
                    this.insertInlineModes(group, card);
                });

                this.els.gamesGrid.appendChild(card);
            });
        },

        insertInlineModes(group, clickedCard) {
            const existingInline = document.querySelector('.inline-modes-container');
            if (existingInline) existingInline.remove();

            this.els.gamesGrid.querySelectorAll('.stat-category-card').forEach(c => {
                c.style.borderColor = '';
            });
            clickedCard.style.borderColor = 'var(--accent-color)';

            const inlineContainer = document.createElement('div');
            inlineContainer.className = 'inline-modes-container';
            inlineContainer.innerHTML = `
                <div class="inline-modes-header">
                    <h2 class="inline-modes-title">${group.groupName}</h2>
                    <button class="btn-close-inline" aria-label="Fermer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="stats-compact-grid inline-modes-grid"></div>
            `;

            const grid = this.els.gamesGrid;
            const cards = Array.from(grid.querySelectorAll('.stat-category-card'));
            const clickedIndex = cards.indexOf(clickedCard);
            const clickedTop = clickedCard.offsetTop;

                        let insertBeforeNode = null;
            for (let i = clickedIndex + 1; i < cards.length; i++) {
                if (cards[i].offsetTop > clickedTop) {
                    insertBeforeNode = cards[i];
                    break;
                }
            }

            if (insertBeforeNode) {
                grid.insertBefore(inlineContainer, insertBeforeNode);
            } else {
                grid.appendChild(inlineContainer);
            }

            const gridTarget = inlineContainer.querySelector('.inline-modes-grid');
            this.renderModesGrid(group.modes, gridTarget, false);

            inlineContainer.querySelector('.btn-close-inline').addEventListener('click', (e) => {
                e.stopPropagation(); 
                this.closeInlineModes();
            });

            setTimeout(() => {
                inlineContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 50);
        },

        renderModesGrid(modes, targetContainer, isSearch) {
            targetContainer.innerHTML = '';

                        if(modes.length === 0) {
                targetContainer.innerHTML = `<div style="text-align: center; color: var(--text-secondary); width: 100%; padding: 2rem; grid-column: 1/-1;">${t('no_mode_found')}</div>`;
                return;
            }

            modes.forEach(game => {
                const bestScoreStr = localStorage.getItem(game.localKey);
                let bestScore = bestScoreStr ? parseFloat(bestScoreStr) : null;

                const card = document.createElement('div');
                card.className = 'stat-card view-fade-in';

                                let displayValue = '';
                if (bestScore !== null) {
                    if (game.unit === 'time') displayValue = formatTime(bestScore);
                    else displayValue = bestScore;
                }

                const scoreDisplay = bestScore !== null ? `<span class="stat-best-score">${displayValue}</span><span class="stat-unit">${game.unit !== 'time' ? game.unit : ''}</span>` : `<span style="color: var(--text-secondary); font-size: 0.8rem; font-style: italic;">${t('play_now')}</span>`;
                const cardTitle = isSearch ? game.searchTitle : game.name;

                card.innerHTML = `
                    <div class="stat-header">
                        <div class="stat-title-group">
                            <span class="stat-title">${cardTitle}</span>
                        </div>
                        <div class="stat-score-group">
                            <div>${scoreDisplay}</div>
                            ${bestScore !== null ? `<svg class="chevron" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>` : ''}
                        </div>
                    </div>
                    ${bestScore !== null ? `
                    <div class="stat-body">
                        <div class="stat-body-content">
                            <div class="chart-section">
                                <div class="chart-title">${t('distribution_title')}</div>
                                <div class="distribution-chart-container dist-all">
                                    <div class="chart-tooltip hidden"></div>
                                    <div class="hover-line hidden"></div>
                                    <svg class="curve-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <path class="curve-fill" d="" fill="var(--accent-color)" opacity="0.2" stroke="none"></path>
                                        <path class="curve-path" d="" fill="none" stroke="var(--accent-color)" stroke-width="2" vector-effect="non-scaling-stroke"></path>
                                    </svg>
                                    <div class="score-marker marker-best"></div>
                                </div>
                            </div>
                            <div class="chart-section">
                                <div class="chart-title">${t('records_distribution_title')}</div>
                                <div class="distribution-chart-container dist-best">
                                    <div class="chart-tooltip hidden"></div>
                                    <div class="hover-line hidden"></div>
                                    <svg class="curve-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                                        <path class="curve-fill" d="" fill="var(--record-color, #FFA914)" opacity="0.2" stroke="none"></path>
                                        <path class="curve-path" d="" fill="none" stroke="var(--record-color, #FFA914)" stroke-width="2" vector-effect="non-scaling-stroke"></path>
                                    </svg>
                                    <div class="score-marker marker-best"></div>
                                </div>
                            </div>
                            <div class="chart-section">
                                <div class="chart-title">${t('progression_title')}</div>
                                <div class="progression-chart-container" id="prog-${game.id}">
                                </div>
                            </div>
                        </div>
                    </div>` : ''}
                `;

                targetContainer.appendChild(card);

                if (bestScore !== null) {
                    const header = card.querySelector('.stat-header');
                    let isLoaded = false;

                    header.addEventListener('click', () => {
                        const isExpanded = card.classList.contains('expanded');
                        targetContainer.querySelectorAll('.stat-card').forEach(c => c.classList.remove('expanded'));

                                                if (!isExpanded) {
                            card.classList.add('expanded');
                            if (!isLoaded) {
                                this.renderDistribution(game, bestScore, card.querySelector('.dist-all'), game.route);
                                const bestRoute = game.route.replace('/api/scores/distribution', '/api/best/distribution');
                                this.renderDistribution(game, bestScore, card.querySelector('.dist-best'), bestRoute);
                                this.renderProgression(game, card);
                                isLoaded = true;
                            }
                            setTimeout(() => { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 50);
                        }
                    });
                }
            });
        },

        async renderDistribution(game, userScore, container, apiRoute) {
            let scores = [];
            const token = localStorage.getItem('token');
            const isBestScores = apiRoute.includes('/best/');
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            try {
                const res = await fetch(apiRoute, { headers, credentials: 'same-origin' });
                if (res.ok) scores = await res.json();
            } catch(e) { console.error(e); }

            if (scores.length < 5) {

                                if (game.id.startsWith('vrt') || game.id.startsWith('art')) {
                    scores = isBestScores ? [180, 185, 190, 200, 210, 215, 220, userScore] : [180, 190, 200, 210, 215, 220, 230, 240, 250, 270, 300, 350, userScore];
                } else if (game.id.startsWith('typing')) {
                    scores = isBestScores ? [40, 50, 60, 65, 70, 80, 90, 100, 110, userScore] : [20, 30, 35, 40, 45, 48, 50, 52, 55, 60, 65, 70, 75, 80, 90, 100, userScore];
                } else if (game.id.startsWith('vismem') || game.id.startsWith('cardsmem') || game.id.startsWith('ts_') || game.id.startsWith('sm_') || game.id.startsWith('cp_')) {
                    scores = isBestScores ? [3, 4, 5, 6, 7, 8, 9, 10, 12, userScore] : [1, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 8, 9, 11, userScore];
                } else if (game.id.startsWith('nm_')) {
                    scores = isBestScores ? [4, 5, 6, 7, 8, 9, 10, 12, userScore] : [3, 4, 5, 5, 6, 6, 7, 7, 8, 9, 10, 11, 12, 14, userScore];
                } else if (game.id.startsWith('music')) {
                    scores = isBestScores ? [5, 6, 7, 8, 9, 10, 12, 14, 15, userScore] : [2, 3, 4, 5, 5, 6, 7, 8, 9, 10, 12, 14, userScore];
                } else if (game.id.startsWith('sudoku')) {
                    let b = userScore > 300 ? userScore : 300;
                    scores = isBestScores ? [b*0.4, b*0.5, b*0.6, b*0.7, b*0.8, b*0.9, b, userScore] : [b*0.5, b*0.6, b*0.7, b*0.8, b*0.9, b, b*1.1, b*1.2, b*1.3, b*1.5, userScore];
                } else if (game.id.startsWith('cc_')) {
                    scores = isBestScores ? [2, 3, 4, 5, 6, 8, 10, 12, userScore] : [1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 10, userScore];
                } else if (game.id.startsWith('aim') || game.id.startsWith('chess_')) {
                    scores = isBestScores ? [40, 45, 50, 55, 60, 65, 70, 80, 85, userScore] : [20, 25, 28, 30, 32, 35, 38, 40, 42, 45, 48, 50, 52, 55, 58, 60, 65, 70, 75, userScore];
                } else if (game.id.startsWith('bpm_')) {
                    scores = isBestScores ? [4, 5, 6, 8, 10, 12, 15, 20, userScore] : [2, 3, 3, 4, 5, 5, 6, 8, 10, 12, 15, userScore];
                } else {
                    scores = isBestScores ? [15, 18, 20, 25, 30, 35, 45, userScore] : [5, 10, 12, 15, 18, 20, 22, 25, 30, 35, 40, userScore];
                }
            } else {
                scores.push(userScore); 
            }

            const n = scores.length;
            const mean = scores.reduce((a, b) => a + b, 0) / n;
            const stdDev = Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n) || 1;

            let bandwidth = 1.06 * stdDev * Math.pow(n, -0.2);
            if (game.id.startsWith('vrt') || game.id.startsWith('art')) bandwidth = Math.max(bandwidth, 15);
            else if (game.id.startsWith('typing') || game.id.startsWith('sudoku') || game.id.startsWith('aim') || game.id.startsWith('chess_')) bandwidth = Math.max(bandwidth * 0.5, 5); 
            else if (game.id.startsWith('vismem') || game.id.startsWith('music') || game.id.startsWith('cardsmem') || game.id.startsWith('cc_') || game.id.startsWith('ts_') || game.id.startsWith('sm_') || game.id.startsWith('nm_') || game.id.startsWith('bpm_') || game.id.startsWith('cp_')) bandwidth = Math.max(bandwidth * 0.5, 1);
            else bandwidth = Math.min(Math.max(bandwidth * 0.5, 1.5), 4);

            const minData = Math.min(...scores);
            const maxData = Math.max(...scores);
            let minX = Math.floor(minData - 3 * bandwidth);
            let maxX = Math.ceil(maxData + 3 * bandwidth);
            if (minX < 0 && !game.id.includes('math')) minX = 0; 
            if (minX < 1 && (game.id.startsWith('vismem') || game.id.startsWith('music') || game.id.startsWith('cardsmem') || game.id.startsWith('cc_') || game.id.startsWith('ts_') || game.id.startsWith('sm_') || game.id.startsWith('nm_') || game.id.startsWith('cp_'))) minX = 1;

            const range = maxX - minX;


                        const kernel = (x) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
            const getDensity = (x) => {
                let sum = 0;
                for (let i = 0; i < n; i++) sum += kernel((x - scores[i]) / bandwidth);
                return sum / (n * bandwidth);
            };

            const steps = 100;
            let densities = [];
            let maxDensity = 0; let totalArea = 0; 

            for (let i = 0; i <= steps; i++) {
                let x = minX + (i / steps) * range;
                let d = getDensity(x);
                densities.push({ x: x, y: d });
                totalArea += d;
                if (d > maxDensity) maxDensity = d;
            }
            if (maxDensity === 0) maxDensity = 1;

            let pathD = `M 0 100`; 
            for (let i = 0; i <= steps; i++) {
                pathD += ` L ${i} ${100 - ((densities[i].y / maxDensity) * 95)}`;
            }

                        container.querySelector('.curve-path').setAttribute('d', pathD);
            container.querySelector('.curve-fill').setAttribute('d', pathD + ` L 100 100 Z`);
            container.querySelectorAll('.dist-html-dot').forEach(el => el.remove()); 

                        const dotColor = isBestScores ? 'var(--record-color, #FFA914)' : 'var(--accent-color)';
            if (['pts', 'niv.', 'série', 'ch.', 'rnds'].includes(game.unit)) {
                let dotsHTML = '';
                for (let val = minX; val <= maxX; val++) {
                    let d = getDensity(val);
                    let px = ((val - minX) / range) * 100;
                    let py = 100 - ((d / maxDensity) * 95);
                    dotsHTML += `<div class="dist-html-dot" style="position: absolute; left: ${px}%; top: ${py}%; width: 4px; height: 4px; background: ${dotColor}; border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 1;"></div>`;
                }
                container.insertAdjacentHTML('beforeend', dotsHTML);
            }

            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            let bestPercent = clamp(((userScore - minX) / range) * 100, 0, 100);
            const markerBest = container.querySelector('.marker-best');
            markerBest.classList.remove('hidden');
            markerBest.style.left = `${bestPercent}%`;

                        let displayValue = game.unit === 'time' ? formatTime(userScore) : `${userScore}<span style="font-size: 0.65em; margin-left: 1px;">${game.unit}</span>`;
            const markerColor = isBestScores ? 'var(--record-color, #FFA914)' : 'var(--accent-color)';

            markerBest.innerHTML = `
                <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: ${markerColor};">
                    <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                        <path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/>
                    </svg>
                </div>
                <div style="width: 2px; height: 100%; border-left: 2px dashed ${markerColor}; margin: 0 auto; opacity: 1;"></div>
                <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: ${markerColor}; z-index: 4; display: flex; align-items: baseline; line-height: 1;">
                    ${displayValue}
                </div>
            `;

            const tooltip = container.querySelector('.chart-tooltip');
            const hoverLine = container.querySelector('.hover-line');

            container.onmousemove = (e) => {
                const rect = container.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const percentX = clamp(mouseX / rect.width, 0, 1);
                const val = Math.round(minX + percentX * range);
                const snappedPercentX = (val - minX) / range;
                let targetArea = 0;
                if (game.lowerIsBetter) {
                    for (let i = 0; i <= steps; i++) if (densities[i].x <= val) targetArea += densities[i].y;
                } else {
                    for (let i = 0; i <= steps; i++) if (densities[i].x >= val) targetArea += densities[i].y;
                }
                let percentile = (targetArea / totalArea) * 100;
                percentile = clamp(percentile, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);
                let tooltipDisplayVal = game.unit === 'time' ? formatTime(val) : `${val} ${game.unit}`;
                tooltip.style.left = `${snappedPercentX * 100}%`;
                tooltip.innerHTML = `<strong>${tooltipDisplayVal}</strong><br>${t('top')} ${percentile}%`;
                tooltip.classList.remove('hidden');
                hoverLine.style.left = `${snappedPercentX * 100}%`;
                hoverLine.classList.remove('hidden');
            };

            container.onmouseleave = () => {
                tooltip.classList.add('hidden'); hoverLine.classList.add('hidden');
            };
        },

        async renderProgression(game, card) {
            const container = card.querySelector('.progression-chart-container');
            try {
                const headers = {};
                const token = localStorage.getItem('token');
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const response = await fetch(`/api/best/history/${game.dbKey}`, { headers, credentials: 'same-origin' });
                if (response.status === 401 || response.status === 403) {
                    container.innerHTML = `<div class="empty-data-msg">${t('login_history')}</div>`;
                    return;
                }
                if (!response.ok) throw new Error("Fetch error");

                const rawHistory = await response.json();
                if(!Array.isArray(rawHistory) || rawHistory.length < 1) {
                    container.innerHTML = `<div class="empty-data-msg">${t('empty_history')}</div>`;
                    return;
                }

                let historyToDraw = rawHistory.map(entry => ({ score: entry.score, date: new Date(entry.createdAt || Date.now()) }));
                historyToDraw.sort((a, b) => a.date - b.date);
                if (historyToDraw.length > 15) historyToDraw = historyToDraw.slice(-15);

                const scoresOnly = historyToDraw.map(h => h.score);
                const minVal = Math.min(...scoresOnly);
                const maxVal = Math.max(...scoresOnly);
                const finalRange = (maxVal - minVal || 1) * 1.4;
                const chartMin = minVal - (finalRange * 0.2);

                let pathD = ""; let dotsHTML = ""; let datesHTML = "";

                                if (historyToDraw.length === 1) {
                    const item = historyToDraw[0];
                    const px = 50; 
                    const py = 50;
                    dotsHTML += `<svg style="position: absolute; left: ${px}%; top: ${py}%; transform: translate(-50%, -50%); width: 8px; height: 8px; pointer-events: none; color: var(--accent-color); z-index: 2;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                    const d = item.date;
                    datesHTML += `<div style="position: absolute; left: ${px}%; top: 100%; margin-top: 8px; transform: translateX(-50%) rotate(-45deg); font-size: 0.65rem; color: var(--text-secondary); white-space: nowrap;">${('0'+d.getDate()).slice(-2)}/${('0'+(d.getMonth()+1)).slice(-2)}</div>`;
                } else {
                    const stepPercent = 100 / (historyToDraw.length - 1); 
                    historyToDraw.forEach((item, index) => {
                        const px = index * stepPercent;
                        const py = game.lowerIsBetter ? (((item.score - chartMin) / finalRange) * 100) : 100 - (((item.score - chartMin) / finalRange) * 100);
                        if (index === 0) pathD += `M ${px} ${py}`; else pathD += ` L ${px} ${py}`;
                        dotsHTML += `<svg style="position: absolute; left: ${px}%; top: ${py}%; transform: translate(-50%, -50%); width: 8px; height: 8px; pointer-events: none; color: var(--accent-color); z-index: 2;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
                        if (index === 0 || index === historyToDraw.length - 1 || index % 2 === 0) {
                            const d = item.date;
                            datesHTML += `<div style="position: absolute; left: ${px}%; top: 100%; margin-top: 8px; transform: translateX(-50%) rotate(-45deg); font-size: 0.65rem; color: var(--text-secondary); white-space: nowrap;">${('0'+d.getDate()).slice(-2)}/${('0'+(d.getMonth()+1)).slice(-2)}</div>`;
                        }
                    });
                }

                container.style.position = 'relative';
                container.style.marginBottom = '3rem'; 
                container.innerHTML = `
                    <div class="chart-tooltip hidden" style="top: -35px; z-index: 10;"></div>
                    <div class="hover-line hidden" style="height: 100%; z-index: 0;"></div>
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: visible;">
                        <path d="${pathD}" vector-effect="non-scaling-stroke" style="stroke: var(--accent-color); stroke-width: 1.5px; fill: none; opacity: 0.6;"></path>
                    </svg>
                    ${datesHTML} ${dotsHTML}
                `;

                const tooltip = container.querySelector('.chart-tooltip');
                let timeoutId = null;

                container.onmousemove = (e) => {
                    const rect = container.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    let percentX = mouseX / rect.width;
                    if(percentX < 0) percentX = 0; if(percentX > 1) percentX = 1;

                                        let closestIdx = 0;
                    if (historyToDraw.length > 1) {
                        let minDiff = Infinity;
                        for(let i=0; i<historyToDraw.length; i++){
                            const targetP = i / (historyToDraw.length - 1);
                            const diff = Math.abs(percentX - targetP);
                            if(diff < minDiff){ minDiff = diff; closestIdx = i; }
                        }
                    }

                                        const item = historyToDraw[closestIdx];
                    const px = historyToDraw.length > 1 ? closestIdx * (100 / (historyToDraw.length - 1)) : 50;

                                        tooltip.style.left = `${px}%`;
                    let displayScore = game.unit === 'time' ? formatTime(item.score) : `${item.score} ${game.unit}`;

                                        const d = item.date;
                    const dateStr = `${('0'+d.getDate()).slice(-2)}/${('0'+(d.getMonth()+1)).slice(-2)}/${d.getFullYear()} ${('0'+d.getHours()).slice(-2)}:${('0'+d.getMinutes()).slice(-2)}`;

                                        tooltip.innerHTML = `<strong>${displayScore}</strong><br><span style="font-size:0.75rem; color:var(--text-secondary);">${dateStr}</span>`;
                    tooltip.classList.remove('hidden');

                                        clearTimeout(timeoutId);
                };

                container.onmouseleave = () => {
                    timeoutId = setTimeout(() => { tooltip.classList.add('hidden'); }, 100);
                };

            } catch (error) {
                container.innerHTML = `<div class="empty-data-msg">${t('error_loading')}</div>`;
            }
        }
    };

    StatsManager.init();
});