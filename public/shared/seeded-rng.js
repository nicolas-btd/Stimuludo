(function () {
    const params = new URLSearchParams(window.location.search);
    const seedHex = params.get('seed');
    const isParty = params.get('party') === '1';

    if (!seedHex || !isParty) return; 



            let s = parseInt(seedHex.substring(0, 8), 16) || 0x12345678;

    const seededRandom = function () {
        s |= 0;
        s = (s + 0x6D2B79F5) | 0;
        let t = Math.imul(s ^ (s >>> 15), 1 | s);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    Math.random = seededRandom;

    console.log(
        '%c[Party Mode] 🎲 Seed RNG activée',
        'color:#1DB954; font-weight:bold',
        '| Seed:', seedHex.substring(0, 8)
    );


        document.addEventListener('DOMContentLoaded', () => {
        const style = document.createElement('style');



                                let realVH = window.innerHeight;
        try {
            if (window.self !== window.top) {
                realVH = window.parent.innerHeight;
            }
        } catch(e) {} 

                const vh1 = realVH / 100;

                style.innerHTML = `
            /* Masquer l'en-tête du jeu (le lobby s'affiche par-dessus l'espace vide) */
            header { display: none !important; }
            
            /* Masquer les boutons perturbateurs dans l'interface de jeu */
            #settings-toggle, .settings-btn,
            #pause-btn,
            #ingame-restart-btn,
            #fullscreen-btn,
            #exit-fullscreen-overlay-btn,
            #restart-btn {
                visibility: hidden !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
            
            /* Corriger la taille des motifs de fond avec les vrais pixels de l'écran parent */
            html[data-pattern="dots"] #bg-pattern, html[data-pattern="dots"] .dot-pattern { background-size: ${3 * vh1}px ${3 * vh1}px !important; }
            html[data-pattern="grid"] #bg-pattern { background-size: ${5 * vh1}px ${5 * vh1}px !important; }
            html[data-pattern="millimeter"] #bg-pattern { background-size: ${2.5 * vh1}px ${2.5 * vh1}px !important; }
            html[data-pattern="cross"] #bg-pattern { background-size: ${5 * vh1}px ${5 * vh1}px !important; }
        `;
        document.head.appendChild(style);

            });
})();
