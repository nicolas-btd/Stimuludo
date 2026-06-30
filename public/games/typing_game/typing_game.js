
const typing_gameTranslations = {
    fr: {
        header_title: "DACTYLOGRAPHIE",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            time: "Temps :",
            time_hint: "Durée de la session (0 = infini).",
            mode_title: "Mode de jeu :",
            mode_quote: "Extrait (Littérature)",
            mode_random: "Mots aléatoires",
            chars_title: "Filtres",
            char_alpha: "Lettres (a-z)",
            char_upper: "Majuscules",
            char_punct: "Ponctuation (. , ?)",
            char_num: "Chiffres (0-9)",
            char_spec: "Spéciaux (@ # %)",
            font_title: "Police du texte",
            options_title: "Options",
            show_ms: "Afficher les centièmes",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer"
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            wpm: "Vitesse (WPM)",
            accuracy: "Précision :",
            errors: "Erreurs :",
            keystrokes: "Frappes",
            best: "Meilleur",
            you: "Vous",
            retry: "REJOUER"
        },
        books: [
            {
                "id": "random",
                "title": "Aléatoire (Tous les livres)",
                "paragraphs": []
            },
            {
                "id": "hugo",
                "title": "Les Misérables - Victor Hugo",
                "paragraphs": [
                    "Il y a des êtres qui semblent nés pour être battus par la vie. Ils reçoivent coup sur coup, sans relâche. Le destin s'acharne sur eux avec une cruauté méthodique, transformant chaque lueur d'espoir en une nouvelle désillusion. Pourtant, au fond de cette misère insondable, une étincelle d'humanité persiste, refusant de s'éteindre sous les bourrasques de l'injustice. C'est dans ces abysses que se révèle la véritable grandeur de l'âme, capable de pardonner à un monde qui ne lui a offert que des larmes.",
                    "La misère est une maladie qui ronge l'âme aussi sûrement que la faim tord les entrailles. Elle s'insinue dans chaque pensée, empoisonne chaque rêve et réduit l'existence à une lutte perpétuelle pour la survie. Les passants détournent le regard, fuyant cette réalité dérangeante qui leur rappelle la fragilité de leur propre condition. Mais ignorer la souffrance d'autrui, c'est se condamner soi-même à une pauvreté spirituelle bien plus dévastatrice, celle de l'indifférence."
                ]
            },
            {
                "id": "flaubert",
                "title": "Madame Bovary - Gustave Flaubert",
                "paragraphs": [
                    "Elle retrouvait dans l'adultère toutes les platitudes du mariage. Mais comment s'en dégoûter ? L'illusion amoureuse s'était dissipée, laissant place à une amère lucidité. Les promesses murmurées dans l'obscurité se révélaient aussi creuses que les vœux prononcés devant l'autel. La passion, d'abord enivrante, s'était transformée en une routine clandestine, ponctuée de mensonges et de rendez-vous furtifs. Elle cherchait désespérément une échappatoire à cette médiocrité suffocante.",
                    "L'ennui, cette araignée silencieuse, tissait sa toile dans l'ombre de son cœur. Chaque jour se ressemblait, une succession monotone d'heures vides et de conversations futiles. Les paysages autrefois enchanteurs de la campagne normande ne lui inspiraient plus qu'une profonde mélancolie. Elle rêvait de bals grandioses, de cavaliers passionnés et d'aventures extraordinaires, mais sa réalité restait obstinément ancrée dans la banalité provinciale dont elle ne pouvait s'enfuir."
                ]
            },
            {
                "id": "zola",
                "title": "Germinal - Émile Zola",
                "paragraphs": [
                    "La mine respirait d'un souffle rauque, monstre insatiable tapi dans les entrailles de la terre. Les hommes s'y engouffraient chaque aube, silhouettes noircies par la poussière et la fatigue, pour nourrir de leur sueur cette bête de fer et de charbon. Dans l'obscurité suffocante des galeries, l'espoir semblait une notion étrangère, étouffée par le vacarme assourdissant des pioches contre la veine. Le grisou guettait, ombre mortelle planant sur ces vies sacrifiées à l'autel du profit et de l'industrie.",
                    "Pourtant, sous cette misère écrasante, une sourde colère commençait à germer dans les cœurs épuisés. Les regards échangés dans l'ombre ne portaient plus seulement la résignation, mais la lueur vacillante d'une révolte naissante. Ils comprenaient peu à peu que leur force résidait dans leur nombre, dans cette fraternité forgée au fond du gouffre. Un jour, la terre tremblerait sous les pas de cette armée de miséreux réclamant enfin leur part de lumière et de justice sous le soleil."
                ]
            },
            {
                "id": "camus",
                "title": "L'Étranger - Albert Camus",
                "paragraphs": [
                    "Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas. Le soleil de l'Algérie frappait le sable avec une violence indifférente, écrasant les contours de la réalité sous une chaleur blanche et aveuglante. La sueur coulait le long de mes tempes, brouillant ma vue et engourdissant mes pensées. Tout me semblait lointain, détaché, comme si j'assistais à ma propre vie depuis les coulisses d'un théâtre absurde. Les larmes attendues ne venaient pas, remplacées par une fatigue lourde.",
                    "Le ciel s'est ouvert sur toute son étendue pour laisser pleuvoir du feu. C'était le même soleil que le jour de l'enterrement, la même lumière implacable qui pesait sur la plage silencieuse. Le reflet de la lame a frappé mes yeux comme une longue étincelle éblouissante. Je n'ai pas compris pourquoi j'ai pressé la détente, mais le bruit sec a déchiré le silence. À cet instant précis, j'ai su que j'avais détruit l'équilibre parfait du jour."
                ]
            },
            {
                "id": "proust",
                "title": "À la recherche du temps perdu - Marcel Proust",
                "paragraphs": [
                    "Le goût de la petite madeleine trempée dans le thé s'était d'abord présenté comme une sensation fugitive, un plaisir délicieux dont l'origine m'échappait. Puis, soudain, le souvenir m'est apparu. C'était ce même parfum de dimanche matin à Combray, l'odeur sucrée et rassurante de la chambre de ma tante Léonie. D'un seul coup, tout l'édifice du passé s'est reconstruit dans mon esprit, porté par la magie fragile d'une saveur oubliée, défiant ainsi l'érosion inexorable du temps qui passe.",
                    "L'amour n'est souvent qu'une construction de notre propre esprit, une projection de nos désirs sur un être qui nous échappe perpétuellement. Albertine, dans son sommeil paisible, m'apparaissait comme un mystère insaisissable. Je chérissais l'illusion de la posséder, tout en sachant que son âme voguait vers des rivages qui m'étaient interdits. La jalousie, cette compagne cruelle et fidèle, se nourrissait de chaque silence, de chaque regard absent, transformant la passion en une quête douloureuse et sans fin vers l'impossible absolu."
                ]
            },
            {
                "id": "dumas",
                "title": "Le Comte de Monte-Cristo - Alexandre Dumas",
                "paragraphs": [
                    "Les murs de pierre froide du château d'If semblaient absorber jusqu'à l'écho de ses pensées. Enfermé dans cette tombe de l'oubli, Edmond Dantès avait d'abord imploré la clémence des hommes, puis celle de Dieu, avant de sombrer dans le désespoir silencieux des condamnés. Les années glissaient, rongeant sa jeunesse, tandis que la mer, indifférente, frappait inlassablement les remparts de sa prison. C'est dans ces ténèbres que l'innocent mourut, laissant place à une âme forgée dans la rancune.",
                    "La vengeance est un plat qui se déguste dans la patience absolue et la froideur d'un calculateur implacable. Désormais libre et paré d'une fortune incalculable, le Comte avançait sur l'échiquier parisien comme un dieu vengeur. Il souriait à ceux qui l'avaient jadis précipité dans l'abîme, tissant autour d'eux une toile dorée et mortelle. Chaque acte de ruine était mesuré, orchestré avec une précision diabolique, car la justice qu'il réclamait exigeait bien plus que du sang : elle voulait leur âme."
                ]
            },
            {
                "id": "balzac",
                "title": "Le Père Goriot - Honoré de Balzac",
                "paragraphs": [
                    "Paris est un océan dont on ne connaîtra jamais la profondeur. Eugène de Rastignac contemplait la ville depuis les hauteurs du cimetière, cette arène scintillante où se jouaient les ambitions et les tragédies humaines. Il sentait en lui bouillonner le désir ardent de conquérir ce monde impitoyable, de se frayer un chemin parmi l'élite dorée qui l'ignorait. L'air froid portait les échos des bals mondains, promesses d'un pouvoir qui réclamait en échange l'abandon de toute innocence.",
                    "Dans l'ombre de la pension Vauquer, le vieux Goriot se consumait d'un amour paternel aveugle et destructeur. Il avait tout donné à ses filles, sa fortune, sa santé, jusqu'à son ultime dignité, pour ne recevoir en retour que mépris et indifférence. Sa déchéance n'était que le reflet d'une société corrompue par l'argent, où les sentiments les plus nobles étaient évalués à l'aune de l'intérêt financier. Une tragédie silencieuse qui s'achevait dans l'anonymat sordide d'une misère absolue."
                ]
            },
            {
                "id": "stendhal",
                "title": "Le Rouge et le Noir - Stendhal",
                "paragraphs": [
                    "Julien Sorel portait en lui la fierté ombrageuse de ceux qui sont nés avec un esprit vaste dans une condition modeste. Son admiration secrète pour Napoléon nourrissait une ambition dévorante, un besoin fiévreux de s'élever au-dessus de sa naissance. Dans les salons feutrés et les jardins aristocratiques, il jouait le jeu des hypocrisies sociales, dissimulant son feu intérieur sous le masque d'un précepteur docile. Mais derrière son regard sombre, la révolte grondait, prête à éclater au moindre affront.",
                    "L'amour, pour ce cœur fougueux, était moins un abandon qu'une conquête, un champ de bataille où se mesuraient la vanité et la passion. Tenir la main de Madame de Rênal dans l'obscurité était une victoire sur la société bourgeoise qui le méprisait. Pourtant, au milieu de ses calculs froids, une tendresse inattendue venait parfois ébranler ses certitudes. Il se découvrait vulnérable, piégé par les sentiments mêmes qu'il croyait pouvoir feindre avec une parfaite maîtrise dans ce monde de dupes."
                ]
            },
            {
                "id": "saintexupery",
                "title": "Le Petit Prince - Antoine de Saint-Exupéry",
                "paragraphs": [
                    "Les grandes personnes aiment les chiffres. Quand vous leur parlez d'un nouvel ami, elles ne vous questionnent jamais sur l'essentiel. Elles ne vous disent jamais : « Quel est le son de sa voix ? Quels sont les jeux qu'il préfère ? » Elles vous demandent son âge et combien gagne son père. C'est ainsi qu'elles croient le connaître. Si vous leur dites que vous avez vu une belle maison en briques roses avec des colombes, elles ne parviennent pas à se l'imaginer.",
                    "C'est le temps que tu as perdu pour ta rose qui fait ta rose si importante. Sur sa minuscule planète, il avait pris soin d'elle, l'avait abritée sous un globe et protégée des chenilles. Il croyait qu'elle était unique au monde, avant de découvrir un jardin plein de roses semblables sur la Terre. Mais le secret du renard lui avait ouvert les yeux : on ne voit bien qu'avec le cœur, l'essentiel est toujours invisible pour les yeux qui ne cherchent que l'apparence."
                ]
            },
            {
                "id": "maupassant",
                "title": "Bel-Ami - Guy de Maupassant",
                "paragraphs": [
                    "Georges Duroy arpentait les boulevards parisiens avec l'assurance insolente d'un homme affamé de succès. Derrière son élégance empruntée et son sourire charmeur, se cachait une vacuité intellectuelle que son ambition effrénée compensait aisément. Il avait compris très vite que, dans ce monde de journalistes corrompus et de politiciens véreux, la séduction était une arme bien plus redoutable que le talent. Les femmes de la haute bourgeoisie seraient les barreaux dorés de l'échelle sociale qu'il s'apprêtait à gravir.",
                    "Chaque liaison n'était pour lui qu'une transaction, un pas de plus vers la fortune et la renommée. Il naviguait d'un lit à l'autre avec une indifférence glaciale, manipulant les cœurs et les secrets d'alcôve pour s'enrichir. La morale n'avait plus cours dans ces salons mondains où seule la réussite éclatante forçait le respect. Triomphant devant les portes de l'église de la Madeleine, il regardait la foule avec la fierté d'un prédateur ayant enfin soumis la capitale à ses pieds."
                ]
            },
            {
                "id": "sartre",
                "title": "La Nausée - Jean-Paul Sartre",
                "paragraphs": [
                    "La Nausée n'est pas en moi : je la ressens là-bas sur le mur, sur les bretelles, partout autour de moi. Elle fait un avec le café, c'est moi qui suis en elle. Le monde matériel se révèle soudain dans toute son absurdité obscène, une masse gélatineuse et molle qui existe sans aucune raison d'être. Ce galet dans ma main, cette racine de marronnier dans le parc, tout cela m'écrase par sa présence injustifiable et sa contingence absolue.",
                    "L'existence précède l'essence. Nous sommes jetés dans ce monde sans l'avoir demandé, condamnés à être libres et à inventer notre propre chemin dans un univers dépourvu de sens préétabli. L'angoisse naît de cette liberté vertigineuse, de cette responsabilité totale face à nos actes. Je suis seul, entouré d'objets qui me regardent avec une indifférence opaque. La vie n'est qu'une succession d'instants vides qu'il faut remplir par la force de la volonté, pour échapper au néant qui nous guette."
                ]
            },
            {
                "id": "baudelaire",
                "title": "Le Spleen de Paris - Charles Baudelaire",
                "paragraphs": [
                    "Il est des jours où le ciel pèse comme un couvercle de plomb sur l'âme gémissante et captive. La ville, avec ses rues boueuses et ses passants aux visages blafards, se transforme en un vaste cachot où l'Espoir, comme une chauve-souris, bat les murs de son aile timide. L'Ennui, monstre délicat et cruel, tisse sa toile dans les recoins de l'esprit, avalant les heures dans un gouffre silencieux. Je marche dans cette foule solitaire, cherchant vainement une ivresse.",
                    "Il faut être toujours ivre. Tout est là : c'est l'unique question. Pour ne pas sentir l'horrible fardeau du Temps qui brise vos épaules et vous penche vers la terre, il faut vous enivrer sans trêve. Mais de quoi ? De vin, de poésie ou de vertu, à votre guise. L'important est de fuir cette réalité grise, de trouver dans l'art ou la débauche un écho à la beauté perdue, une étincelle d'éternité dans la boue d'un monde irrémédiablement corrompu."
                ]
            }
        ],
        commonWords: [
            "le", "de", "un", "être", "et", "à", "il", "avoir", "ne", "je",
            "son", "que", "se", "qui", "en", "ce", "dans", "sur", "pas", "pour",
            "plus", "par", "elle", "on", "dire", "nous", "aller", "avec", "pouvoir", "tout",
            "faire", "met", "autre", "mais", "si", "leur", "y", "comme", "ou", "sans",
            "voir", "mon", "lui", "votre", "où", "fois", "bon", "aussi", "quelque", "vouloir",
            "venir", "grand", "devoir", "là", "prendre", "même", "temps", "homme", "femme", "jour",
            "monde", "chose", "vie", "enfant", "main", "peuple", "état", "pays", "place", "droit",
            "groupe", "problème", "partie", "système", "affaire", "eau", "ami", "famille", "ville", "besoin",
            "nuit", "mot", "travail", "exemple", "histoire", "fait", "mois", "tête", "voiture", "livre",
            "porte", "année", "raison", "maison", "personne", "jeune", "petit", "nouveau", "vieux", "beau",
            "vrai", "seul", "politique", "public", "social", "français", "général", "important", "toujours", "jamais",
            "souvent", "encore", "bien", "mal", "très", "peu", "beaucoup", "moins", "puis", "donc",
            "quand", "pourquoi", "comment", "ici", "déjà", "depuis", "pendant", "trouver", "donner", "falloir",
            "parler", "mettre", "savoir", "passer", "regarder", "aimer", "croire", "demander", "rester", "répondre",
            "entendre", "penser", "arriver", "connaître", "devenir", "sentir", "sembler", "tenir", "comprendre", "rendre"
        ]
    },
    en: {
        header_title: "TYPING GAME",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            time: "Time:",
            time_hint: "Session duration (0 = infinite).",
            mode_title: "Game Mode :",
            mode_quote: "Literature (Excerpts)",
            mode_random: "Random Words",
            chars_title: "Filters",
            char_alpha: "Letters (a-z)",
            char_upper: "Uppercase",
            char_punct: "Punctuation (. , ?)",
            char_num: "Numbers (0-9)",
            char_spec: "Special Chars (@ # %)",
            font_title: "Font Style",
            options_title: "Options",
            show_ms: "Show milliseconds",
            cancel: "CANCEL",
            save: "APPLY"
        },
        results: {
            new_record: "NEW RECORD!",
            wpm: "Speed (WPM)",
            accuracy: "Accuracy:",
            errors: "Errors:",
            keystrokes: "Keystrokes",
            best: "Best",
            you: "You",
            retry: "PLAY AGAIN"
        },
        books: [
            { id: "random", title: "Random (All books)", paragraphs: [] },
            {
                "id": "shakespeare",
                "title": "Hamlet - William Shakespeare",
                "paragraphs": [
                    "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them. To die—to sleep, no more; and by a sleep to say we end the heart-ache and the thousand natural shocks that flesh is heir to: 'tis a consummation devoutly to be wish'd.",
                    "The time is out of joint. O cursed spite, that ever I was born to set it right! The burden of vengeance weighs heavy on my soul, yet I am paralyzed by doubt and the fear of the unknown. What dreams may come when we have shuffled off this mortal coil must give us pause—there’s the respect that makes calamity of so long life."
                ]
            },
            {
                "id": "dickens",
                "title": "Great Expectations - Charles Dickens",
                "paragraphs": [
                    "I looked at the stars, and considered how awful it would be for a man to turn his face up to them as he froze to death, and see no help or pity in all the glittering multitude. The marshes were just a long black horizontal line then, as I stopped to look after him; and the river was just another horizontal line, not nearly so broad nor yet so black; and the sky was just a row of long angry red lines and dense black lines intermixed.",
                    "I was a child, and she was a child, in this place of tombstones. The sharp awareness of my own coarseness, and commonness, and dullness, fell off me like a shackle. I was not afraid of telling her that I loved her; I was not even afraid of telling her that I had loved her ever since that evening when I first saw her, and came home to find a new world had sprung up in my breast."
                ]
            },
            {
                "id": "woolf",
                "title": "Mrs Dalloway - Virginia Woolf",
                "paragraphs": [
                    "For having lived in Westminster—how many years now? over twenty,—one feels even in the midst of the traffic, or waking at night, Clarissa was positive, a particular hush, or solemnity; an indescribable pause; a suspense before Big Ben strikes. There! Out it boomed. First a warning, musical; then the hour, irrevocable. The leaden circles dissolved in the air.",
                    "She had the perpetual sense, as she watched the taxi cabs, of being out, out, far out to sea and alone; she always had the feeling that it was very, very dangerous to live even one day. Not that she thought herself clever, or much out of the ordinary. How she had got through life on the few twigs of knowledge Fraulein Daniels gave them she could not think. She knew nothing; no language, no history; she scarcely read a book now, except memoirs in bed."
                ]
            },
            {
                "id": "orwell",
                "title": "1984 - George Orwell",
                "paragraphs": [
                    "It was a bright cold day in April, and the clocks were striking thirteen. The hallway smelt of boiled cabbage and old rag mats. At one end of it a coloured poster, too large for indoor display, had been tacked to the wall. It depicted simply an enormous face, more than a metre wide: the face of a man of about forty-five, with a heavy black moustache and ruggedly handsome features.",
                    "Freedom is the freedom to say that two plus two make four. If that is granted, all else follows. The heresy of heresies was common sense. And what was terrifying was not that they would kill you for thinking otherwise, but that they might be right. For, after all, how do we know that two and two make four? Or that the force of gravity works? Or that the past is unchangeable?"
                ]
            },
            {
                "id": "austen",
                "title": "Pride and Prejudice - Jane Austen",
                "paragraphs": [
                    "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife. However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
                    "You must allow me to tell you how ardently I admire and love you. In declaring myself thus, I am not actuated by mere pride; my feelings will not be repressed. You must allow me, by every means in my power, to convince you that I am not so deficient in the tenderness of affection as you have accused me of being."
                ]
            },
            {
                "id": "bronte",
                "title": "Wuthering Heights - Emily Brontë",
                "paragraphs": [
                    "He’s more myself than I am. Whatever our souls are made of, his and mine are the same. If all else perished, and he remained, I should still continue to be; and if all else remained, and he were annihilated, the universe would turn to a mighty stranger. My love for Heathcliff resembles the eternal rocks beneath: a source of little visible delight, but necessary.",
                    "I have not broken your heart—you have broken it; and in breaking it, you have broken mine. So much the worse for me that I am strong. Do I want to live? What kind of living will it be when you—oh, God! would you like to live with your soul in the grave?"
                ]
            },
            {
                "id": "hemingway",
                "title": "The Old Man and the Sea - Ernest Hemingway",
                "paragraphs": [
                    "But the old man thought, I have him now. And he did not care that his hands were bleeding nor that his back was bent with the weight of the line. He only cared that the fish was his at last, and he would bring him in now and kill him properly. The fish was his true brother, and he loved him. But he must kill him to feed himself and many others.",
                    "Now is no time to think of what you do not have. Think of what you can do with what there is. The sea is the same, and the sun rises and sets as before. The boy is not here, but you are still a fisherman, and the greatest honor is to be what you are."
                ]
            },
            {
                "id": "faulkner",
                "title": "The Sound and the Fury - William Faulkner",
                "paragraphs": [
                    "The past is never dead. It's not even past. The air was thick with the scent of honeysuckle, and the sound of the crickets was like a slow, sad music. I could hear the clock ticking in the hall, and the sound of Father’s voice reading the Bible, and Caddy’s dress swishing as she walked back and forth in the room.",
                    "I could smell the rain before it came, and the lightning split the sky like a jagged knife. The world seemed to hold its breath, waiting for something to happen. And then it did, but not the way anyone expected. The past is a ghost that haunts us, and we are all prisoners of time."
                ]
            },
            {
                "id": "melville",
                "title": "Moby-Dick - Herman Melville",
                "paragraphs": [
                    "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world. It is a way I have of driving off the spleen and regulating the circulation.",
                    "The whale is harpooned, but not yet captured. The line is taut, and the boat is dragged through the water at a terrifying speed. Ahab stands at the bow, his face a mask of fury and determination. The sea boils around us, and the wind howls like a thousand lost souls. But the whale is not just a beast; it is a force of nature, a symbol of the unknowable and the untamable."
                ]
            },
            {
                "id": "poe",
                "title": "The Tell-Tale Heart - Edgar Allan Poe",
                "paragraphs": [
                    "True! —nervous—very, very dreadfully nervous I had been and am; but why will you say that I am mad? The disease had sharpened my senses—not destroyed—not dulled them. Above all was the sense of hearing acute. I heard all things in the heaven and in the earth. I heard many things in hell.",
                    "It grew louder—louder—louder! And still the men chatted pleasantly, and smiled. Was it possible they heard not? Almighty God!—no, no! They heard!—they suspected!—they knew!—they were making a mockery of my horror!"
                ]
            }

        ],
        commonWords: [
            "the", "be", "to", "of", "and", "a", "in", "that", "have",
            "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
            "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
            "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
            "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
            "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
            "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
            "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
            "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
            "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
            "thing", "man", "world", "life", "hand", "part", "child", "eye", "woman", "place",
            "week", "case", "point", "company", "number", "group", "problem", "fact", "able", "bad",
            "best", "right", "public", "large", "early", "young", "important", "few", "big", "great",
            "system", "computer", "question", "government", "number", "night", "always", "never", "often", "sometimes",
            "really", "around", "another", "course", "between", "each", "under", "through", "should", "might"
        ]
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.typing_game = typing_gameTranslations.fr;
    translations.en.typing_game = typing_gameTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    const cleanKey = key.replace(/^typing_game\./, '');

    if (!cleanKey) return typing_gameTranslations[lang] || typing_gameTranslations['en'];

    return cleanKey.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, typing_gameTranslations[lang])
        || cleanKey.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, typing_gameTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {

    const TypingGame = {
        state: {
            gameMode: 'ranked',

            timer: null,
            maxTime: 60,
            timeLeft: 60,
            charIndex: 0,
            mistakes: 0,
            correctCount: 0,
            isTyping: false,
            isPaused: false,
            totalTyped: 0,
            isComposing: false,
            ignoreNextInput: false,

            savedTimeRanked: 60,
            savedModeRanked: "random",
            savedShowMsRanked: false,

            savedTimeSandbox: 60,
            savedShowMsSandbox: false,
            savedModeSandbox: "random",
            savedBookIdSandbox: "random",
            savedFiltersSandbox: {
                alpha: true, upper: true, punct: true, num: false, spec: false, customSpec: "@#%*+=-_<>?$!"
            },
            distributionDataByConfig: {}
        },

        els: {
            board: document.querySelector('.game-board'),
            overlayOver: document.getElementById('game-over-overlay'),
            restartBtn: document.getElementById('restart-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'),

            viewRanked: document.getElementById('results-ranked'),
            viewSandbox: document.getElementById('results-sandbox'),

            settingsToggle: document.getElementById('settings-toggle'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),
            settingsPanel: document.getElementById('settings-panel'),

            settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
            modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),

            pauseBtn: document.getElementById('pause-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            iconExpand: document.getElementById('icon-expand'),
            iconCompress: document.getElementById('icon-compress'),
            icons: { pause: document.getElementById('icon-pause'), play: document.getElementById('icon-play') },

            wrapper: document.querySelector('.typing-wrapper'),
            content: document.getElementById('typing-content'),
            quote: document.getElementById('quote-display'),
            cursor: document.getElementById('smooth-cursor'),
            input: document.getElementById('input-field'),
            bookRef: document.getElementById('book-reference'),
            timer: document.getElementById('timer'),
            currentWpm: document.getElementById('current-wpm'),

            config: {
                timeRanked: document.getElementById('time-ranked-val'),
                modeRanked: document.getElementById('mode-ranked-val'),
                showMsRanked: document.getElementById('show-ms-ranked'),

                timeSandbox: document.getElementById('time-sandbox-val'),
                showMsSandbox: document.getElementById('show-ms-sandbox'),
                modeQuote: document.getElementById('mode-quote'),
                modeRandom: document.getElementById('mode-random'),
                bookSelect: document.getElementById('book-select'),
                bookSelectContainer: document.getElementById('book-select-container'),
                filtersContainer: document.getElementById('filters-container'),
                charAlpha: document.getElementById('char-alpha'),
                charUpper: document.getElementById('char-upper'),
                charPunct: document.getElementById('char-punct'),
                charNum: document.getElementById('char-num'),
                charSpec: document.getElementById('char-spec'),
                customSpecContainer: document.getElementById('custom-spec-container'),
                customSpecInput: document.getElementById('custom-spec-input')
            },

            results: {
                rankedWpm: document.getElementById('ranked-wpm'),
                rankedAcc: document.getElementById('ranked-accuracy'),
                rankedErr: document.getElementById('ranked-errors'),

                sandboxWpm: document.getElementById('sandbox-wpm'),
                sandboxAcc: document.getElementById('sandbox-accuracy'),
                sandboxErr: document.getElementById('sandbox-errors'),
                sandboxKeys: document.getElementById('sandbox-keystrokes'),

                newRec: document.getElementById('new-record-msg'),
                markerCurrent: document.getElementById('marker-current'),
                markerBest: document.getElementById('marker-best')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                const modes = params.getAll('mode');
                if (modes.includes('ranked') || modes.includes('sandbox')) {
                    this.state.gameMode = modes.find(m => m === 'ranked' || m === 'sandbox');
                }
            }
            if (params.has('text_mode')) {
                this.state.savedModeRanked = params.get('text_mode');
            }

            this.applyMonospaceStyle();
            this.setupFontSystem();
            this.loadUserPreferences();

                        if (params.has('time')) {
                this.state.savedTimeRanked = parseInt(params.get('time'), 10);
            }

            this.loadBackgroundPreference();
            this.updateTranslations(); 
            this.populateBooksDropdown();
            this.bindEvents();

            if (this.els.results.newRec && this.els.viewRanked) {
                this.els.viewRanked.insertBefore(this.els.results.newRec, this.els.viewRanked.firstChild);
                this.els.results.newRec.style.minHeight = '24px';
                this.els.results.newRec.style.marginTop = '0px';
                this.els.results.newRec.style.marginBottom = '15px';
                this.els.results.newRec.style.width = '100%';
                this.els.results.newRec.style.textAlign = 'center';
                this.els.results.newRec.classList.remove('hidden');
                this.els.results.newRec.style.visibility = 'hidden';
                this.els.results.newRec.style.opacity = '0';
                this.els.results.newRec.style.transition = 'opacity 0.3s ease';
            }

            this.resetGame();
            this.preloadDistributionData();
        },

        updateTranslations() {
            const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
            document.documentElement.setAttribute('lang', lang);

            const translatableElements = document.querySelectorAll('[data-i18n]');
            translatableElements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = getGameText(key);
                if (text) {
                    el.textContent = text;
                }
            });

            this.populateBooksDropdown();

            if (!this.state.isTyping && this.state.charIndex === 0) {
                this.generateText();
            }
        },

        loadUserPreferences() {
            const c = this.els.config;

            const savedTimeR = localStorage.getItem('type_time_ranked');
            if (savedTimeR !== null && c.timeRanked) {
                c.timeRanked.value = savedTimeR;
                this.state.savedTimeRanked = parseInt(savedTimeR);
            }

            const savedModeR = localStorage.getItem('type_mode_ranked');
            if (savedModeR !== null && c.modeRanked) {
                c.modeRanked.value = savedModeR;
                this.state.savedModeRanked = savedModeR;
            }

            const savedMsR = localStorage.getItem('type_show_ms_ranked');
            if (savedMsR !== null && c.showMsRanked) {
                c.showMsRanked.checked = (savedMsR === 'true');
                this.state.savedShowMsRanked = (savedMsR === 'true');
            }

            const savedTimeS = localStorage.getItem('type_time_sandbox');
            if (savedTimeS !== null && c.timeSandbox) {
                c.timeSandbox.value = savedTimeS;
                this.state.savedTimeSandbox = parseInt(savedTimeS);
            }

            const savedMsS = localStorage.getItem('type_show_ms_sandbox');
            if (savedMsS !== null && c.showMsSandbox) {
                c.showMsSandbox.checked = (savedMsS === 'true');
                this.state.savedShowMsSandbox = (savedMsS === 'true');
            }

            const savedModeS = localStorage.getItem('type_mode_sandbox');
            if (savedModeS === 'quote' && c.modeQuote) {
                c.modeQuote.checked = true;
                this.state.savedModeSandbox = 'quote';
            } else if (savedModeS === 'random' && c.modeRandom) {
                c.modeRandom.checked = true;
                this.state.savedModeSandbox = 'random';
            }

            const savedBook = localStorage.getItem('type_book_sandbox');
            if (savedBook && c.bookSelect) {
                c.bookSelect.value = savedBook;
                this.state.savedBookIdSandbox = savedBook;
            }

            const savedFilters = localStorage.getItem('type_filters_sandbox');
            if (savedFilters) {
                try {
                    const f = JSON.parse(savedFilters);
                    this.state.savedFiltersSandbox = f;
                    if (c.charAlpha) c.charAlpha.checked = f.alpha;
                    if (c.charUpper) c.charUpper.checked = f.upper;
                    if (c.charPunct) c.charPunct.checked = f.punct;
                    if (c.charNum) c.charNum.checked = f.num;
                    if (c.charSpec) c.charSpec.checked = f.spec;
                    if (f.customSpec && c.customSpecInput) c.customSpecInput.value = f.customSpec;
                } catch (e) { console.error(e); }
            }

            this.updateSettingsVisuals();
        },

        applyMonospaceStyle() {
            const styleId = 'typing-game-font-fix';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = `
                    #quote-display, #quote-display span {
                        font-family: var(--font-typing) !important;
                        letter-spacing: var(--spacing-typing) !important;
                        font-variant-ligatures: none !important;
                    }
                `;
                document.head.appendChild(style);
            }
        },

        setupFontSystem() {
            const fontConfig = {
                "'Roboto Mono', monospace": { spacing: "-1.5px", offset: "0px" },
                "'Courier Prime', monospace": { spacing: "-1px", offset: "0px" },
                "'Special Elite', cursive": { spacing: "0px", offset: "-3px" }
            };

            const savedFont = localStorage.getItem('typingFont');
            if (savedFont) {
                document.documentElement.style.setProperty('--font-typing', savedFont);
                const conf = fontConfig[savedFont] || { spacing: "0px", offset: "0px" };
                document.documentElement.style.setProperty('--spacing-typing', conf.spacing);
                document.documentElement.style.setProperty('--cursor-offset', conf.offset);

                const selector = `input[name="font-selector"][value="${savedFont.replace(/"/g, '\\"')}"]`;
                const radioBtn = document.querySelector(selector);
                if (radioBtn) radioBtn.checked = true;
            } else {
                document.documentElement.style.setProperty('--spacing-typing', "-1.5px");
                document.documentElement.style.setProperty('--cursor-offset', "0px");
            }

            const fontRadios = document.querySelectorAll('input[name="font-selector"]');
            fontRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    const newFont = e.target.value;
                    const conf = fontConfig[newFont] || { spacing: "0px", offset: "0px" };

                    document.documentElement.style.setProperty('--font-typing', newFont);
                    document.documentElement.style.setProperty('--spacing-typing', conf.spacing);
                    document.documentElement.style.setProperty('--cursor-offset', conf.offset);

                    localStorage.setItem('typingFont', newFont);
                });
            });
        },

        restoreSettingsUI() {
            const c = this.els.config;

            if (c.timeRanked) c.timeRanked.value = this.state.savedTimeRanked;
            if (c.modeRanked) c.modeRanked.value = this.state.savedModeRanked;
            if (c.showMsRanked) c.showMsRanked.checked = this.state.savedShowMsRanked;

            if (c.timeSandbox) c.timeSandbox.value = this.state.savedTimeSandbox;
            if (c.showMsSandbox) c.showMsSandbox.checked = this.state.savedShowMsSandbox;

            if (this.state.savedModeSandbox === 'quote' && c.modeQuote) c.modeQuote.checked = true;
            else if (c.modeRandom) c.modeRandom.checked = true;

            if (c.bookSelect) c.bookSelect.value = this.state.savedBookIdSandbox;

            if (c.charAlpha) c.charAlpha.checked = this.state.savedFiltersSandbox.alpha;
            if (c.charUpper) c.charUpper.checked = this.state.savedFiltersSandbox.upper;
            if (c.charPunct) c.charPunct.checked = this.state.savedFiltersSandbox.punct;
            if (c.charNum) c.charNum.checked = this.state.savedFiltersSandbox.num;
            if (c.charSpec) c.charSpec.checked = this.state.savedFiltersSandbox.spec;
            if (c.customSpecInput) c.customSpecInput.value = this.state.savedFiltersSandbox.customSpec;

            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if (activeRadio) activeRadio.checked = true;

            this.updateSettingsView(this.state.gameMode);
            this.updateSettingsVisuals();
        },

        updateSettingsView(mode) {
            if (mode === 'ranked') {
                if (this.els.settingsGroupRanked) this.els.settingsGroupRanked.style.display = 'block';
                if (this.els.settingsGroupSandbox) this.els.settingsGroupSandbox.style.display = 'none';
            } else {
                if (this.els.settingsGroupRanked) this.els.settingsGroupRanked.style.display = 'none';
                if (this.els.settingsGroupSandbox) this.els.settingsGroupSandbox.style.display = 'block';
            }
        },

        updateSettingsVisuals() {
            const isModeQuote = this.els.config.modeQuote?.checked;
            const isSpec = this.els.config.charSpec?.checked;
            if (this.els.config.bookSelectContainer) this.els.config.bookSelectContainer.style.display = isModeQuote ? 'block' : 'none';
            if (this.els.config.customSpecContainer) this.els.config.customSpecContainer.style.display = (!isModeQuote && isSpec) ? 'block' : 'none';

            const filters = [
                this.els.config.charAlpha, this.els.config.charUpper,
                this.els.config.charPunct, this.els.config.charNum, this.els.config.charSpec
            ];
            filters.forEach(el => { if (el) el.disabled = isModeQuote; });
            if (isModeQuote) {
                this.els.config.filtersContainer?.classList.add('disabled');
            } else {
                this.els.config.filtersContainer?.classList.remove('disabled');
            }
        },

        loadBackgroundPreference() {
            const savedOpaque = localStorage.getItem('globalOpaque');
            const isOpaque = savedOpaque === 'true' || savedOpaque === null;

            if (isOpaque) document.documentElement.classList.add('global-opaque');
            else document.documentElement.classList.remove('global-opaque');

            this.toggleBackground(isOpaque);
        },

        toggleBackground(isOpaque) {
            if (isOpaque) {
                this.els.board?.classList.add('opaque-mode');
                this.els.settingsPanel?.classList.add('opaque-mode');
            } else {
                this.els.board?.classList.remove('opaque-mode');
                this.els.settingsPanel?.classList.remove('opaque-mode');
            }
        },

        populateBooksDropdown() {
            const data = getGameText('') || typing_gameTranslations.fr;
            const select = this.els.config.bookSelect;
            if (!select) return;
            select.innerHTML = '';
            data.books.forEach(book => {
                const option = document.createElement('option');
                option.value = book.id;
                option.textContent = book.title;
                select.appendChild(option);
            });
            select.value = this.state.savedBookIdSandbox;
        },

        resetGame() {
            clearInterval(this.state.timer);
            this.state.isTyping = false;
            this.state.isPaused = false;

            this.toggleOverlay(this.els.overlayOver, false);

            const val = this.state.gameMode === 'ranked' ? this.state.savedTimeRanked : this.state.savedTimeSandbox;
            this.state.maxTime = (val && val > 0) ? val : 0;
            this.state.timeLeft = this.state.maxTime === 0 ? 0 : this.state.maxTime;

            if (this.els.currentWpm) this.els.currentWpm.innerText = "0";
            this.updateTimerUI();

            this.generateText();

            if (this.els.input) {
                this.els.input.disabled = false;
                this.els.input.value = "";
            }
            if (this.els.cursor) this.els.cursor.style.opacity = 1;
            setTimeout(() => this.els.input?.focus(), 50);

            this.updatePosition();

            if (this.els.pauseBtn && this.els.ingameRestartBtn) {
                if (this.state.gameMode === 'ranked') {
                    this.els.pauseBtn.style.display = 'none';
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                } else {
                    this.els.ingameRestartBtn.style.display = 'none';
                    this.els.pauseBtn.style.display = 'flex';
                    this.els.pauseBtn.style.visibility = 'visible';
                }
            }
        },

        generateText() {
            const data = getGameText('') || typing_gameTranslations.fr;
            let currentMode, currentBookId;

            if (this.state.gameMode === 'ranked') {
                currentMode = this.state.savedModeRanked;
                currentBookId = 'random';
            } else {
                currentMode = this.state.savedModeSandbox;
                currentBookId = this.state.savedBookIdSandbox;
            }

            let rawText = "";
            let bookRefText = "";

            if (currentMode === 'quote') {
                let selectedBook = data.books.find(b => b.id === currentBookId);
                if (!selectedBook || currentBookId === 'random') {
                    const realBooks = data.books.filter(b => b.id !== 'random');
                    selectedBook = realBooks[Math.floor(Math.random() * realBooks.length)];
                }
                if (selectedBook && selectedBook.paragraphs.length > 0) {
                    const index = Math.floor(Math.random() * selectedBook.paragraphs.length);
                    rawText = selectedBook.paragraphs[index].trim();
                    bookRefText = selectedBook.title;
                } else {
                    rawText = "Erreur de chargement du livre.";
                }
                if (this.els.quote) {
                    this.els.quote.innerHTML = "";
                    rawText.split("").forEach(char => {
                        this.els.quote.innerHTML += `<span>${char}</span>`;
                    });
                }
            } else {
                if (this.els.quote) this.els.quote.innerHTML = "";
                bookRefText = "";
                this.appendRandomWords(100);
            }

            if (this.els.bookRef) this.els.bookRef.innerText = bookRefText;
            this.state.charIndex = 0;
            this.state.mistakes = 0;
            this.state.correctCount = 0;
            this.state.totalTyped = 0;
            this.state.isComposing = false;
            this.state.ignoreNextInput = false;

            if (this.els.content) this.els.content.style.transform = `translateY(0px)`;
            this.updatePauseIcon();
        },

        appendRandomWords(count) {
            const data = getGameText('') || typing_gameTranslations.fr;
            let config;

            if (this.state.gameMode === 'ranked') {
                config = { alpha: true, upper: false, punct: false, num: false, spec: false, customSpec: "" };
            } else {
                config = this.state.savedFiltersSandbox;
            }
            if (!config.alpha && !config.num && !config.spec) config.alpha = true;

            const words = data.commonWords;
            const specChars = config.customSpec.split('');
            const puncts = [".", ",", ";", "!", "?"];
            const types = [];

            if (config.alpha) types.push('word');
            if (config.num) types.push('num');
            if (config.spec && specChars.length > 0) types.push('spec');

            let generatedHtml = "";
            if (this.els.quote && this.els.quote.childElementCount > 0) generatedHtml += "<span> </span>";

            const newWords = [];
            for (let i = 0; i < count; i++) {
                const currentType = types[Math.floor(Math.random() * types.length)];
                let item = "";
                if (currentType === 'num') {
                    item = Math.floor(Math.random() * 1000).toString();
                } else if (currentType === 'spec') {
                    item = specChars[Math.floor(Math.random() * specChars.length)];
                    if (Math.random() > 0.8) item += specChars[Math.floor(Math.random() * specChars.length)];
                } else {
                    item = words[Math.floor(Math.random() * words.length)];
                    if (config.upper && Math.random() > 0.7) item = item.charAt(0).toUpperCase() + item.slice(1);
                    if (config.punct && Math.random() > 0.8) item += puncts[Math.floor(Math.random() * puncts.length)];
                }
                newWords.push(item);
            }
            const fullString = newWords.join(" ");
            fullString.split("").forEach(char => {
                generatedHtml += `<span>${char}</span>`;
            });
            if (this.els.quote) this.els.quote.insertAdjacentHTML('beforeend', generatedHtml);
        },

        handleInput(e) {
            if (this.state.isComposing || this.state.isPaused) return;
            if (this.state.ignoreNextInput) {
                this.state.ignoreNextInput = false;
                if (this.els.input) this.els.input.value = "";
                return;
            }
            if (e.inputType === 'deleteContentBackward') return;

            let char = e.data;
            if (!char && this.els.input?.value) char = this.els.input.value;
            if (char) this.processContentLogic(char);
            if (this.els.input) this.els.input.value = "";
        },

        handleKeydown(e) {
            if (this.state.isPaused) return;

            if (e.key === 'Backspace') {
                if (!this.els.quote) return;
                const chars = this.els.quote.querySelectorAll("span");
                if (this.state.charIndex > 0) {
                    const prevCharIndex = this.state.charIndex - 1;
                    const prevCharSpan = chars[prevCharIndex];
                    if (prevCharSpan.textContent === ' ') {
                        if (!prevCharSpan.classList.contains('incorrect')) {
                            let runner = prevCharIndex - 1;
                            let canGoBack = false;
                            while (runner >= 0) {
                                const c = chars[runner];
                                if (c.textContent === ' ') break;
                                if (!c.classList.contains('correct')) canGoBack = true;
                                runner--;
                            }
                            if (!canGoBack && runner >= -1) {
                                e.preventDefault();
                                return;
                            }
                        }
                    }
                    this.state.charIndex--;
                    const currentSpan = chars[this.state.charIndex];
                    if (currentSpan.classList.contains("correct")) this.state.correctCount--;
                    if (currentSpan.classList.contains("incorrect")) this.state.mistakes--;
                    currentSpan.classList.remove("correct", "incorrect");
                    this.updatePosition();
                }
            }
        },

        processContentLogic(inputString) {
            if (this.state.isPaused) return;

            for (let i = 0; i < inputString.length; i++) {
                const typed = inputString.charAt(i);
                if (!this.els.quote) return;

                let chars = this.els.quote.querySelectorAll("span");

                const isRandomMode = (this.state.gameMode === 'ranked' && this.state.savedModeRanked === 'random') ||
                    (this.state.gameMode === 'sandbox' && this.state.savedModeSandbox === 'random');

                if (isRandomMode) {
                    if (chars.length - this.state.charIndex < 300) {
                        this.appendRandomWords(50);
                        chars = this.els.quote.querySelectorAll("span");
                    }
                }

                if (!this.state.isTyping) {
                    this.startTimer();
                    this.state.isTyping = true;
                }

                if (this.state.charIndex < chars.length && (this.state.maxTime === 0 || this.state.timeLeft > 0)) {
                    const expectedChar = chars[this.state.charIndex].textContent;

                    if (typed === ' ') {
                        if (expectedChar === ' ') {
                            chars[this.state.charIndex].classList.add("correct");
                            this.state.correctCount++;
                            this.state.totalTyped++;
                            this.state.charIndex++;
                        } else {
                            let startIndex = this.state.charIndex;
                            let hasTypedSomethingForCurrentWord = false;
                            while (startIndex > 0) {
                                if (chars[startIndex - 1].textContent === ' ') break;
                                startIndex--;
                            }
                            if (this.state.charIndex > startIndex) hasTypedSomethingForCurrentWord = true;

                            if (hasTypedSomethingForCurrentWord) {
                                let runner = this.state.charIndex;
                                while (runner < chars.length) {
                                    const c = chars[runner];
                                    if (c.textContent === ' ') {
                                        this.state.charIndex = runner + 1;
                                        this.state.totalTyped++;
                                        break;
                                    } else {
                                        c.classList.add('incorrect');
                                        this.state.mistakes++;
                                        this.state.totalTyped++;
                                        runner++;
                                    }
                                }
                            } else {
                                this.state.mistakes++;
                                chars[this.state.charIndex].classList.add("incorrect");
                                this.state.totalTyped++;
                                this.state.charIndex++;
                            }
                        }
                    } else {
                        this.state.totalTyped++;
                        if (expectedChar === typed) {
                            chars[this.state.charIndex].classList.add("correct");
                            this.state.correctCount++;
                        } else {
                            chars[this.state.charIndex].classList.add("incorrect");
                            this.state.mistakes++;
                        }
                        this.state.charIndex++;
                    }
                    this.updatePosition();
                    this.calculateLiveWpm();
                } else {
                    if (!isRandomMode) this.finishGame();
                }
            }
        },

        updatePosition() {
            if (!this.els.quote || !this.els.cursor || !this.els.content || !this.els.wrapper) return;
            const chars = this.els.quote.querySelectorAll('span');
            const current = chars[this.state.charIndex] || chars[chars.length - 1];
            if (!current) return;

            this.els.cursor.style.left = current.offsetLeft + 'px';
            this.els.cursor.style.top = current.offsetTop + 'px';
            this.els.cursor.style.height = current.offsetHeight + 'px';

            const wrapperHeight = this.els.wrapper.offsetHeight;
            const lineHeight = this.els.cursor.offsetHeight;
            const idealOffset = (wrapperHeight - lineHeight) / 2;
            let targetY = idealOffset - current.offsetTop;
            if (targetY > 0) targetY = 0;
            this.els.content.style.transform = `translateY(${targetY}px)`;
        },

        calculateLiveWpm() {
            const timeElapsed = this.state.maxTime === 0 ? this.state.timeLeft : (this.state.maxTime - this.state.timeLeft);
            if (timeElapsed > 0) {
                const minutes = timeElapsed / 60;
                let wpm = Math.round((this.state.correctCount / 5) / minutes);
                if (wpm < 0 || !isFinite(wpm)) wpm = 0;
                if (this.els.currentWpm) this.els.currentWpm.innerText = wpm;
            }
        },

        startTimer() {
            clearInterval(this.state.timer);
            const countUp = this.state.maxTime === 0;
            this.state.timer = setInterval(() => {
                if (countUp) {
                    this.state.timeLeft += 0.01;
                } else {
                    this.state.timeLeft -= 0.01;
                }

                this.state.timeLeft = Math.round(this.state.timeLeft * 100) / 100;
                this.updateTimerUI();

                if (Math.floor(this.state.timeLeft * 100) % 100 === 0) this.calculateLiveWpm();

                if (!countUp && this.state.timeLeft <= 0) {
                    this.state.timeLeft = 0;
                    this.finishGame();
                }
            }, 10);
        },

        updateTimerUI() {
            const el = this.els.timer;
            if (!el) return;
            const countUp = this.state.maxTime === 0;
            const showMs = this.state.gameMode === 'ranked' ? this.state.savedShowMsRanked : this.state.savedShowMsSandbox;

            if (this.state.maxTime === 0 && !this.state.isTyping) {
                el.innerText = "∞";
            } else {
                if (showMs) {
                    el.innerText = this.state.timeLeft.toFixed(2);
                } else {
                    el.innerText = countUp ? Math.floor(this.state.timeLeft) : Math.ceil(this.state.timeLeft);
                }
            }
        },

        togglePause() {
            if (this.state.gameMode === 'ranked') return;
            if (!this.state.isTyping && this.state.charIndex === 0) return;

            this.state.isPaused = !this.state.isPaused;

            if (this.state.isPaused) {
                clearInterval(this.state.timer);
                if (this.els.input) this.els.input.disabled = true;
                if (this.els.cursor) this.els.cursor.style.opacity = 0;
            } else {
                if (this.els.input) {
                    this.els.input.disabled = false;
                    this.els.input.focus();
                }
                if (this.els.cursor) this.els.cursor.style.opacity = 1;

                if (this.state.isTyping) this.startTimer();
            }
            this.updatePauseIcon();
        },

        updatePauseIcon() {
            if (this.state.isPaused) {
                this.els.icons.pause?.classList.add('hidden');
                this.els.icons.play?.classList.remove('hidden');
            } else {
                this.els.icons.play?.classList.add('hidden');
                this.els.icons.pause?.classList.remove('hidden');
            }
        },

        toggleOverlay(el, show) {
            if (!el) return;
            if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
            else { el.classList.remove('visible'); el.classList.add('hidden'); }
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
            if (!panel) return;
            const isHidden = panel.classList.contains('panel-hidden');

            if (forceClose || !isHidden) {
                this.restoreSettingsUI();
                panel.classList.remove('panel-visible');
                panel.classList.add('panel-hidden');

                if (this.state.gameMode === 'sandbox' && this.state.isTyping && this.state.isPaused) {
                    this.togglePause();
                }

                if (!this.state.isPaused && !this.els.overlayOver?.classList.contains('visible')) {
                    this.els.input?.focus();
                }
            } else {
                this.restoreSettingsUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');

                if (this.state.isTyping && !this.state.isPaused && this.state.gameMode === 'sandbox') {
                    this.togglePause();
                }
            }
        },

        toggleFullscreen() {
            const elem = this.els.board;
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || elem.classList.contains('ios-fullscreen');

            if (!isFullscreen) {
                const isMobile = window.innerWidth <= 700 || 'ontouchstart' in window;
                if (isMobile) {
                    elem.classList.add('ios-fullscreen');
                    this.updateFullscreenIcon();
                } else {
                    if (elem.requestFullscreen) {
                        elem.requestFullscreen().catch(err => {
                            console.warn(`Plein écran bloqué : ${err.message}`);
                            this.enableFallbackFullscreen();
                        });
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    } else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    } else {
                        this.enableFallbackFullscreen();
                    }
                }
            } else {
                if (document.exitFullscreen && document.fullscreenElement) {
                    document.exitFullscreen().catch(err => console.error(err));
                } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
                    document.webkitExitFullscreen();
                }

                elem.classList.remove('ios-fullscreen');
                this.updateFullscreenIcon();
            }
        },

        enableFallbackFullscreen() {
            this.els.board.classList.add('ios-fullscreen');
            this.updateFullscreenIcon();
        },

        updateFullscreenIcon() {
            if (document.fullscreenElement || this.els.board.classList.contains('ios-fullscreen')) {
                this.els.iconExpand?.classList.add('hidden');
                this.els.iconCompress?.classList.remove('hidden');
            } else {
                this.els.iconCompress?.classList.add('hidden');
                this.els.iconExpand?.classList.remove('hidden');
            }
            this.updatePosition();

            if (!this.state.isPaused && !this.els.overlayOver?.classList.contains('visible')) {
                setTimeout(() => this.els.input?.focus(), 100);
            }
        },

        bindEvents() {
            const els = this.els;

            const updateViewport = () => {
                const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                document.documentElement.style.setProperty('--app-height', `${vh}px`);

                if (document.body.classList.contains('keyboard-open')) {
                    window.scrollTo(0, 0);
                }

                this.updatePosition();
            };

            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', updateViewport);
                window.visualViewport.addEventListener('scroll', updateViewport);
            } else {
                window.addEventListener('resize', updateViewport);
            }
            updateViewport(); 

            els.input?.addEventListener('focus', () => {
                document.body.classList.add('keyboard-open');
                setTimeout(updateViewport, 100); 
            });
            els.input?.addEventListener('blur', () => {
                document.body.classList.remove('keyboard-open');
                setTimeout(updateViewport, 100);
            });

            els.modeToggleRadios?.forEach(radio => {
                radio.addEventListener('change', (e) => this.updateSettingsView(e.target.value));
            });

            els.restartBtn?.addEventListener('click', () => this.resetGame());

            els.ingameRestartBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.resetGame();
            });

            els.input?.addEventListener('compositionstart', () => { this.state.isComposing = true; });
            els.input?.addEventListener('compositionend', (e) => {
                this.state.isComposing = false;
                if (e.data) {
                    this.processContentLogic(e.data);
                    this.state.ignoreNextInput = true;
                    setTimeout(() => { this.state.ignoreNextInput = false; }, 50);
                }
                if (els.input) els.input.value = "";
            });
            els.input?.addEventListener('input', (e) => this.handleInput(e));
            els.input?.addEventListener('keydown', (e) => this.handleKeydown(e));

            els.config.modeQuote?.addEventListener('change', () => this.updateSettingsVisuals());
            els.config.modeRandom?.addEventListener('change', () => this.updateSettingsVisuals());
            els.config.charSpec?.addEventListener('change', () => this.updateSettingsVisuals());

            els.board?.addEventListener('click', (e) => {
                const isMenuOpen = els.settingsPanel?.classList.contains('panel-visible');
                const isOver = els.overlayOver?.classList.contains('visible');
                if (!isMenuOpen && !isOver && !this.state.isPaused &&
                    !e.target.closest('button') && !e.target.closest('#settings-panel')) {
                    els.input?.focus();
                }
            });

            window.addEventListener('resize', () => this.updatePosition());
            els.pauseBtn?.addEventListener('click', (e) => { e.stopPropagation(); this.togglePause(); });

            if (els.fullscreenBtn) {
                els.fullscreenBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFullscreen();
                });
            }

            const exitFsBtn = document.querySelector('.exit-fs-btn');
            if (exitFsBtn) {
                exitFsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.toggleFullscreen();
                });
            }

            document.addEventListener('fullscreenchange', () => this.updateFullscreenIcon());

            els.settingsToggle?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(err => console.error(err));
                    if (els.settingsPanel?.classList.contains('panel-hidden')) {
                        this.toggleSettings();
                    }
                } else {
                    this.toggleSettings();
                }
            });

            els.closeSettings?.addEventListener('click', () => this.toggleSettings(true));

            els.saveSettings?.addEventListener('click', () => {
                const c = this.els.config;
                const selectedMode = document.querySelector('input[name="mode-toggle"]:checked')?.value || 'ranked';

                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);

                if (c.timeRanked) localStorage.setItem('type_time_ranked', c.timeRanked.value);
                if (c.modeRanked) localStorage.setItem('type_mode_ranked', c.modeRanked.value);
                if (c.showMsRanked) localStorage.setItem('type_show_ms_ranked', c.showMsRanked.checked);

                if (c.timeRanked) this.state.savedTimeRanked = parseInt(c.timeRanked.value);
                if (c.modeRanked) this.state.savedModeRanked = c.modeRanked.value;
                if (c.showMsRanked) this.state.savedShowMsRanked = c.showMsRanked.checked;

                if (c.timeSandbox) localStorage.setItem('type_time_sandbox', c.timeSandbox.value);
                if (c.showMsSandbox) localStorage.setItem('type_show_ms_sandbox', c.showMsSandbox.checked);

                if (c.timeSandbox) this.state.savedTimeSandbox = parseInt(c.timeSandbox.value) || 0;
                if (c.showMsSandbox) this.state.savedShowMsSandbox = c.showMsSandbox.checked;

                const modeSandbox = c.modeQuote?.checked ? 'quote' : 'random';
                localStorage.setItem('type_mode_sandbox', modeSandbox);
                this.state.savedModeSandbox = modeSandbox;

                if (c.bookSelect) localStorage.setItem('type_book_sandbox', c.bookSelect.value);
                if (c.bookSelect) this.state.savedBookIdSandbox = c.bookSelect.value;

                const filters = {
                    alpha: c.charAlpha?.checked ?? true, upper: c.charUpper?.checked ?? false,
                    punct: c.charPunct?.checked ?? false, num: c.charNum?.checked ?? false,
                    spec: c.charSpec?.checked ?? false, customSpec: c.customSpecInput?.value ?? ""
                };
                localStorage.setItem('type_filters_sandbox', JSON.stringify(filters));
                this.state.savedFiltersSandbox = filters;

                                this.preloadDistributionData();

                this.toggleSettings(true);
                this.resetGame();
            });

            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel?.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel?.contains(e.target) || els.settingsToggle?.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = els.settingsPanel?.classList.contains('panel-visible');
                const isGameOver = els.overlayOver?.classList.contains('visible');

                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }

                if (e.code === 'Enter') {
                    if (isMenuOpen) {
                        e.preventDefault();
                        els.saveSettings?.click();
                    }
                    else if (isGameOver) {
                        e.preventDefault();
                        this.resetGame();
                    }
                }
            });

            window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
                if (e.key === 'siteLanguage') {
                    this.updateTranslations();
                }
            });

            window.addEventListener('languageChanged', () => {
                this.updateTranslations();
            });
        },

        async finishGame() {
            clearInterval(this.state.timer);
            if (this.els.input) {
                this.els.input.disabled = true;
                this.els.input.value = "";
            }
            this.state.isTyping = false;
            this.state.isPaused = false;

            const timeElapsed = this.state.maxTime === 0 ? this.state.timeLeft : (this.state.maxTime - this.state.timeLeft);
            const minutes = (timeElapsed === 0 ? 1 : timeElapsed) / 60;
            let wpm = Math.round((this.state.correctCount / 5) / minutes);
            if (wpm < 0 || !isFinite(wpm)) wpm = 0;

            let acc = 0;
            if (this.state.totalTyped > 0) acc = Math.round(((this.state.totalTyped - this.state.mistakes) / this.state.totalTyped) * 100);
            if (acc < 0) acc = 0;

            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: wpm }, '*');
                return;
            }

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked?.classList.remove('hidden');
                this.els.viewSandbox?.classList.add('hidden');

                if (this.els.results.rankedWpm) this.els.results.rankedWpm.textContent = wpm;
                if (this.els.results.rankedAcc) this.els.results.rankedAcc.textContent = acc + "%";
                if (this.els.results.rankedErr) this.els.results.rankedErr.textContent = this.state.mistakes;

                this.saveScoreToDatabase(wpm, this.state.savedTimeRanked, this.state.savedModeRanked);

                const recordKey = `typing_best_ranked_${this.state.savedTimeRanked}_${this.state.savedModeRanked}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                if (best === null || wpm > best) {
                    best = wpm;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.savedTimeRanked, this.state.savedModeRanked);
                }

                if (isRecord && savedBest !== null) {
                    if (this.els.results.newRec) {
                        this.els.results.newRec.style.visibility = 'visible';
                        this.els.results.newRec.style.opacity = '1';
                    }
                } else {
                    if (this.els.results.newRec) {
                        this.els.results.newRec.style.visibility = 'hidden';
                        this.els.results.newRec.style.opacity = '0';
                    }
                }

                const configKey = `${this.state.savedTimeRanked}_${this.state.savedModeRanked}`;
                this.drawDistributionChart(wpm, best, configKey);
                this.preloadDistributionData(configKey);

            } else {
                this.els.viewRanked?.classList.add('hidden');
                this.els.viewSandbox?.classList.remove('hidden');

                if (this.els.results.newRec) {
                    this.els.results.newRec.style.visibility = 'hidden';
                    this.els.results.newRec.style.opacity = '0';
                }

                if (this.els.results.sandboxWpm) this.els.results.sandboxWpm.textContent = wpm;
                if (this.els.results.sandboxAcc) this.els.results.sandboxAcc.textContent = acc + "%";
                if (this.els.results.sandboxErr) this.els.results.sandboxErr.textContent = this.state.mistakes;
                if (this.els.results.sandboxKeys) this.els.results.sandboxKeys.textContent = this.state.totalTyped;
            }

            this.toggleOverlay(this.els.overlayOver, true);
            if (this.els.pauseBtn) this.els.pauseBtn.style.display = 'none';
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
            this.preloadDistributionData();
        },
        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },


        async saveScoreToDatabase(score, time, mode) {
            try {
                fetch('/api/scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'typing_game', score: score, details: { time: time, mode: mode }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, time, mode) {
            try {
                fetch('/api/best', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `typing_ranked_${time}_${mode}`, score: score, details: { time: time, mode: mode }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec sauvegarde best DB:", error); }
        },

        async preloadDistributionData(configKey) {
            if (!configKey) configKey = `${this.state.savedTimeRanked}_${this.state.savedModeRanked}`;
            const parts = configKey.split('_');
            const time = parts[0];
            const mode = parts[1];

            try {
                const res = await fetch(`/api/scores/distribution/typing_game?time=${time}&mode=${mode}`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (res.ok) {
                    this.state.distributionDataByConfig[configKey] = await res.json();
                } else {
                    this.state.distributionDataByConfig[configKey] = [];
                }
            } catch (e) {
                console.error(e);
                this.state.distributionDataByConfig[configKey] = [];
            }
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
            if (!configKey) configKey = `${this.state.savedTimeRanked}_${this.state.savedModeRanked}`;
            if (!this.state.distributionDataByConfig) this.state.distributionDataByConfig = {};
            if (!this.state.distributionDataByConfig[configKey]) {
                this.state.distributionDataByConfig[configKey] = [];
            }
            if (currentScore !== null) {
                this.state.distributionDataByConfig[configKey].push(currentScore);
            }

                        let scores = [...this.state.distributionDataByConfig[configKey]];

            const MAX_POINTS = 500;
            if (scores.length > MAX_POINTS) {
                const step = scores.length / MAX_POINTS;
                const sampled = [];
                for (let i = 0; i < MAX_POINTS; i++) {
                    sampled.push(scores[Math.floor(i * step)]);
                }
                if (sampled[sampled.length - 1] !== scores[scores.length - 1]) {
                    sampled.push(scores[scores.length - 1]);
                }
                scores = sampled;
            }

            const n = scores.length;
            const mean = scores.reduce((a, b) => a + b, 0) / n;
            let stdDev = Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n);
            if (stdDev < 3) stdDev = 3; 

            let bandwidth = 1.06 * stdDev * Math.pow(n, -0.2);
            if (bandwidth < 2) bandwidth = 2; 

            const minData = Math.min(...scores);
            const maxData = Math.max(...scores);

                        let minX = Math.floor(minData - 3 * bandwidth);
            let maxX = Math.ceil(maxData + 3 * bandwidth);
            if (minX < 0) minX = 0; 

                        if (maxX - minX < 20) {
                const center = (maxX + minX) / 2;
                minX = Math.max(0, Math.floor(center - 10));
                maxX = Math.ceil(center + 10);
            }

                        const range = maxX - minX || 1;
            const kernel = (x) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
            const getDensity = (x) => {
                let sum = 0;
                for (let i = 0; i < n; i++) sum += kernel((x - scores[i]) / bandwidth);
                return sum / (n * bandwidth);
            };

            const steps = 100;
            let densities = [], maxDensity = 0, totalArea = 0; 
            for (let i = 0; i <= steps; i++) {
                let x = minX + (i / steps) * range, d = getDensity(x);
                densities.push({ x: x, y: d }); totalArea += d;
                if (d > maxDensity) maxDensity = d;
            }
            if (maxDensity === 0) maxDensity = 1;

            let pathD = `M 0 100`; 
            for (let i = 0; i <= steps; i++) {
                const px = i, py = 100 - ((densities[i].y / maxDensity) * 95); 
                pathD += ` L ${px} ${py}`;
            }

            if (!this.els.viewRanked) return;
            const curvePath = this.els.viewRanked.querySelector('.curve-path');
            const curveFill = this.els.viewRanked.querySelector('.curve-fill');
            if (curvePath) curvePath.setAttribute('d', pathD);
            if (curveFill) curveFill.setAttribute('d', pathD + ` L 100 100 Z`);

            const distContainer = this.els.viewRanked.querySelector('.distribution-chart-container');
            if (!distContainer) return;
            distContainer.querySelectorAll('.dist-html-dot').forEach(el => el.remove()); 

                        let dotsHTML = '';
            for (let val = minX; val <= maxX; val++) {
                let d = getDensity(val), px = ((val - minX) / range) * 100, py = 100 - ((d / maxDensity) * 95);
                dotsHTML += `<div class="dist-html-dot" style="position: absolute; left: ${px}%; top: ${py}%; width: 4px; height: 4px; background: var(--accent-color); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 1;"></div>`;
            }
            distContainer.insertAdjacentHTML('beforeend', dotsHTML);

                        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            const currentPercent = clamp(((currentScore - minX) / range) * 100, 0, 100);
            let bestPercent = null;
            if (bestScore !== null) bestPercent = clamp(((bestScore - minX) / range) * 100, 0, 100);
            let currentOffset = 5; if (bestPercent !== null && Math.abs(currentPercent - bestPercent) < 8) currentOffset = 30;

            const markerCurrent = this.els.results.markerCurrent;
            const markerBest = this.els.results.markerBest;

            if (markerCurrent) {
                if (bestScore !== null && currentScore === bestScore) {
                    markerCurrent.style.display = 'none';
                } else if (currentScore !== null) {
                    markerCurrent.style.display = 'block';
                    markerCurrent.style.left = `${currentPercent}%`;
                    markerCurrent.innerHTML = `<div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div><div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">${currentScore}</div>`;
                } else {
                    markerCurrent.style.display = 'none';
                }
            }

            if (markerBest) {
                if (bestScore !== null) {
                    markerBest.classList.remove('hidden');
                    markerBest.style.left = `${bestPercent}%`;
                    markerBest.innerHTML = `<div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);"><svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/></svg></div><div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div><div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">${bestScore}</div>`;
                } else {
                    markerBest.classList.add('hidden');
                }
            }

            const tooltip = this.els.viewRanked.querySelector('.chart-tooltip');
            const hoverLine = this.els.viewRanked.querySelector('.hover-line');
            if (tooltip && hoverLine) {
                distContainer.onmousemove = (e) => {
                    const rect = distContainer.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const percentX = clamp(mouseX / rect.width, 0, 1);
                    const val = Math.round(minX + percentX * range);
                    let areaToRight = 0;
                    for (let i = 0; i <= steps; i++) {
                        let pointVal = minX + (i / steps) * range;
                        if (pointVal >= val) areaToRight += densities[i].y;
                    }
                    let percentile = (areaToRight / totalArea) * 100;
                    percentile = clamp(percentile, 0.1, 99.9);
                    percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);
                    tooltip.style.left = `${percentX * 100}%`;
                    tooltip.innerHTML = `<strong>${val}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                    tooltip.classList.remove('hidden');
                    hoverLine.style.left = `${percentX * 100}%`;
                    hoverLine.classList.remove('hidden');
                };
                distContainer.onmouseleave = () => { tooltip.classList.add('hidden'); hoverLine.classList.add('hidden'); };
            }
        },
    };

    TypingGame.init();
});
