document.addEventListener('DOMContentLoaded', () => {


            let API_BASE_URL = '';

        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_BASE_URL = 'http://localhost:3000'; 
    } else {
        API_BASE_URL = 'https://stimuludo.com'; 
    }



            const translations = {
        en: {
            pageTitle: "Stimuludo | Reset Password",
            navHome: "HOME",
            formTitle: "New Password",
            formSubtitle: "Choose a secure password to regain access to your account.",
            labelNewPass: "New password",
            placeholderNewPass: "Min. 6 characters",
            labelConfirmPass: "Confirm password",
            placeholderConfirmPass: "Repeat password",
            btnSubmit: "Confirm change",


                                    msgInvalidLink: "Invalid or expired link. Please request a new one from the login page.",
            msgMismatch: "Passwords do not match.",
            msgLoading: "Updating...",
            msgServerError: "Server communication error.",
            msgGenericError: "Unable to reset password.",
            msgSuccessLocal: "Success! You will be redirected to the login page...",

                        footer: {
                desc: "Cognitive training platform.",
                legal: "LEGAL",
                contact: "CONTACT",
                terms: "Legal notice",
                privacy: "Privacy Policy",
                cookies: "Cookie Management",
                rights: "All rights reserved."
            },
        },
        fr: {
            pageTitle: "Stimuludo | Réinitialisation",
            navHome: "ACCUEIL",
            formTitle: "Nouveau mot de passe",
            formSubtitle: "Choisissez un mot de passe sécurisé pour retrouver l'accès à votre compte.",
            labelNewPass: "Nouveau mot de passe",
            placeholderNewPass: "Min. 6 caractères",
            labelConfirmPass: "Confirmer le mot de passe",
            placeholderConfirmPass: "Répétez le mot de passe",
            btnSubmit: "Valider le changement",


                                    msgInvalidLink: "Lien invalide ou expiré. Veuillez refaire une demande depuis la page de connexion.",
            msgMismatch: "Les mots de passe ne correspondent pas.",
            msgLoading: "Modification...",
            msgServerError: "Erreur de communication avec le serveur.",
            msgGenericError: "Impossible de réinitialiser le mot de passe.",
            msgSuccessLocal: "Succès ! Vous allez être redirigé vers la page de connexion...",
            footer: {
                desc: "Plateforme d'entraînement cognitif.",
                legal: "LÉGAL",
                contact: "CONTACT",
                terms: "Mentions légales",
                privacy: "Politique de confidentialité",
                cookies: "Gestion des cookies",
                rights: "Tous droits réservés."
            },
        }
    };


        const savedLang = localStorage.getItem('siteLanguage');
    const userLang = navigator.language || navigator.userLanguage;
    let currentLang = 'en';

    if (savedLang) {
        currentLang = savedLang;
    } else if (userLang && userLang.startsWith('fr')) {
        currentLang = 'fr';
    } else {
        currentLang = 'en';
    }


        const t = translations[currentLang] || translations['en'];


        function getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => { return prev ? prev[curr] : null; }, obj);
    }


        document.documentElement.lang = currentLang;

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            let text = getNestedTranslation(t, key);

                        if (!text) text = getNestedTranslation(translations['en'], key);
            if (text) el.textContent = text;
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            let text = getNestedTranslation(t, key);
            if (!text) text = getNestedTranslation(translations['en'], key);
            if (text) el.placeholder = text;
        });
    }

    applyTranslations();


        const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const observer = new MutationObserver(() => {
            applyTranslations();
            observer.disconnect(); 
        });
        observer.observe(footerPlaceholder, { childList: true, subtree: true });
    }


        const form = document.getElementById('reset-form');
    const passInput = document.getElementById('new-password');
    const confirmInput = document.getElementById('confirm-password');
    const submitBtn = document.getElementById('submit-btn');
    const errorBox = document.getElementById('error-message');
    const successBox = document.getElementById('success-message');


        const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (!token) {
        showError(t.msgInvalidLink);
        form.classList.add('hidden');
        return;
    }


        form.addEventListener('submit', async (e) => {
        e.preventDefault();

                errorBox.classList.add('hidden');
        successBox.style.display = 'none';

                if (passInput.value !== confirmInput.value) {
            showError(t.msgMismatch);
            return;
        }

        const originalText = submitBtn.textContent;
        submitBtn.textContent = t.msgLoading;
        submitBtn.disabled = true;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLang
                },
                body: JSON.stringify({ newPassword: passInput.value })
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(t.msgServerError);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t.msgGenericError);
            }

            form.classList.add('hidden');
            showSuccess(t.msgSuccessLocal);

            setTimeout(() => {
                window.location.href = '../login/login.html'; 
            }, 2500);

        } catch (err) {
            showError(err.message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    function showError(msg) {
        errorBox.classList.remove('hidden');
        errorBox.querySelector('span').textContent = msg;
    }

    function showSuccess(msg) {
        successBox.classList.remove('hidden');
        successBox.querySelector('span').textContent = msg;
        successBox.style.display = 'flex';
    }
});