
const legalTranslations = {
    en: {
        global: {
            back: "BACK"
        },
        legal: {
            header_title: "LEGAL INFORMATION",
            privacy: {
                title: "Privacy Policy",
                subtitle1: "Non-logged-in Users",
                text1: "If you use the site without creating an account or logging in, <strong>no data is collected</strong>. Your activity remains strictly local and anonymous.",
                subtitle2: "Logged-in Users",
                text2: "When logged into an account, we only collect your <strong>game scores</strong> associated with your <strong>username</strong>. This collection serves solely to:",
                list1: "Provide you with a detailed history of your performance.",
                list2: "Generate statistics on all players and your personal progress.",
                list3: "Allow you to compete with players worldwide via the leaderboard."
            },
            cookies: {
                title: "Cookie Management",
                intro: "This site uses <strong>no advertising, commercial, or tracking cookies</strong> exploiting your digital life.",
                subtitle1: "Technical Cookies Only",
                text1: "In accordance with privacy recommendations, no consent banner is displayed. We only use a single secure technical cookie, strictly necessary to maintain your session if you log in.",
                subtitle2: "Use of Local Storage",
                text2: "We exclusively use your browser's \"Local Storage\" to keep your customization from one session to another:",
                list1: "Remember your visual preferences.",
                list2: "Keep your game settings.",
                outro: "This technical data remains on your device."
            },
            terms: {
                title: "Legal Notice",
                host_title: "Site Host"
            }
        },
        footer: {
            desc: "Cognitive training platform.",
            legal: "LEGAL",
            terms: "Legal Notice",
            privacy: "Privacy Policy",
            cookies: "Cookie Management",
            contact: "CONTACT",
            rights: "All rights reserved."
        }
    },
    fr: {
        global: {
            back: "RETOUR"
        },
        legal: {
            header_title: "INFORMATIONS LÉGALES",
            privacy: {
                title: "Politique de Confidentialité",
                subtitle1: "Utilisateurs non connectés",
                text1: "Si vous utilisez le site sans créer de compte ou sans vous connecter, <strong>aucune donnée n'est collectée</strong>. Votre activité reste strictement locale et anonyme.",
                subtitle2: "Utilisateurs connectés",
                text2: "Lorsque vous êtes connecté à un compte, nous collectons uniquement vos <strong>scores de jeu</strong> associés à votre <strong>pseudo</strong>. Cette collecte a pour uniques objectifs de :",
                list1: "Vous fournir un historique détaillé de vos performances.",
                list2: "Générer des statistiques sur l'ensemble des joueurs et sur votre évolution personnelle.",
                list3: "Vous permettre d'être en compétition avec les joueurs du monde entier via le classement général."
            },
            cookies: {
                title: "Gestion des Cookies",
                intro: "Ce site n'utilise <strong>aucun cookie publicitaire, commercial ou de traçage</strong> exploitant votre vie numérique.",
                subtitle1: "Cookies techniques uniquement",
                text1: "Conformément aux recommandations de la CNIL, aucun bandeau de consentement n'est affiché. Nous n'utilisons qu'un seul cookie technique sécurisé (invisible), strictement nécessaire pour maintenir votre session si vous vous connectez.",
                subtitle2: "Utilisation du Stockage Local",
                text2: "Nous utilisons exclusivement le \"Local Storage\" de votre navigateur pour conserver votre personnalisation d'une session à l'autre :",
                list1: "Mémoriser vos préférences visuelles.",
                list2: "Conserver vos réglages de jeux.",
                outro: "Ces données techniques restent sur votre appareil."
            },
            terms: {
                title: "Mentions Légales",
                host_title: "Hébergeur du site"
            }
        },
        footer: {
            desc: "Plateforme d'entraînement cognitif.",
            legal: "LÉGAL",
            terms: "Mentions légales",
            privacy: "Politique de confidentialité",
            cookies: "Gestion des cookies",
            contact: "CONTACT",
            rights: "Tous droits réservés."
        }
    }
};


function getNestedTranslation(obj, path) {
    return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null;
    }, obj);
}

function applyTranslations() {

        const savedLang = localStorage.getItem('siteLanguage');
    const userLang = navigator.language || navigator.userLanguage;
    let lang = 'en';

    if (savedLang) {
        lang = savedLang;
    } else if (userLang && userLang.startsWith('fr')) {
        lang = 'fr';
    }


        document.documentElement.lang = lang;

    const dict = legalTranslations[lang] || legalTranslations['en'];
    const elements = document.querySelectorAll('[data-i18n]');

        elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        let text = getNestedTranslation(dict, key);


                        if (!text) text = getNestedTranslation(legalTranslations['en'], key);

        if (text) {

                        if (text.includes('<')) {
                el.innerHTML = text;
            } else {
                el.textContent = text;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {


            applyTranslations();


        const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const observer = new MutationObserver(() => {
            applyTranslations();
            observer.disconnect(); 
        });
        observer.observe(footerPlaceholder, { childList: true, subtree: true });
    }


        function goBack() {
        if (window.history.length > 1) {
            window.history.back(); 
        } else {
            window.location.href = '../index.html';
        }
    }

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Escape') {
            e.preventDefault();
            goBack();
        }
    });

    const backBtn = document.getElementById('header-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            goBack();
        });
    }
});