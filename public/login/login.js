document.addEventListener('DOMContentLoaded', () => {


            let API_BASE_URL = '';

        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_BASE_URL = 'http://localhost:3000'; 
    } else {
        API_BASE_URL = 'https://stimuludo.com'; 
    }


        const translations = {
        en: {
            pageTitle: "Stimuludo | Login",
            navHome: "HOME",
            labelUsername: "Username",
            placeholderUsername: "Username",
            labelEmail: "Email Address",
            placeholderEmail: "example@mail.com",
            labelPassword: "Password",
            placeholderPassword: "••••••••",
            btnForgot: "Forgot password?",
            btnBackLogin: "Back to login",


                                    modeRegisterTitle: "Create an account",
            modeRegisterSubtitle: "Join the adventure and track your progress.",
            modeRegisterSubmit: "Sign up",
            modeRegisterToggleText: "Already have an account?",
            modeRegisterToggleBtn: "Log in",


                                    modeLoginTitle: "Login",
            modeLoginSubtitle: "Welcome back!",
            modeLoginSubmit: "Log in",
            modeLoginToggleText: "Don't have an account yet?",
            modeLoginToggleBtn: "Create an account",


                                    modeForgotTitle: "Forgot password",
            modeForgotSubtitle: "Enter your email to receive a reset link.",
            modeForgotSubmit: "Send link",


                                    msgLoading: "Loading...",
            msgReqChar: "At least 3 characters required.",
            msgVerifying: "Verifying...",
            msgAvailable: "Username available",
            msgTaken: "This username is already taken",
            msgInvalidUser: "Please choose a valid and available username.",
            msgServerError: "The backend server is unreachable.",
            msgGenericError: "An error occurred.",
            msgSuccessRegister: "Account created!",
            msgSuccessLogin: "Logged in!",
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
            pageTitle: "Stimuludo | Connexion",
            navHome: "ACCUEIL",
            labelUsername: "Nom d'utilisateur",
            placeholderUsername: "Pseudo",
            labelEmail: "Adresse Email",
            placeholderEmail: "exemple@mail.com",
            labelPassword: "Mot de passe",
            placeholderPassword: "••••••••",
            btnForgot: "Mot de passe oublié ?",
            btnBackLogin: "Retour à la connexion",


                                    modeRegisterTitle: "Créer un compte",
            modeRegisterSubtitle: "Rejoignez l'aventure et suivez vos progrès.",
            modeRegisterSubmit: "S'inscrire",
            modeRegisterToggleText: "Déjà un compte ?",
            modeRegisterToggleBtn: "Se connecter",


                                    modeLoginTitle: "Connexion",
            modeLoginSubtitle: "Heureux de vous revoir !",
            modeLoginSubmit: "Se connecter",
            modeLoginToggleText: "Pas encore de compte ?",
            modeLoginToggleBtn: "Créer un compte",


                                    modeForgotTitle: "Mot de passe oublié",
            modeForgotSubtitle: "Entrez votre email pour recevoir un lien de réinitialisation.",
            modeForgotSubmit: "Envoyer le lien",


                                    msgLoading: "Chargement...",
            msgReqChar: "Au moins 3 caractères requis.",
            msgVerifying: "Vérification...",
            msgAvailable: "Pseudo disponible",
            msgTaken: "Ce pseudo est déjà pris",
            msgInvalidUser: "Veuillez choisir un pseudo valide et disponible.",
            msgServerError: "Le serveur backend est injoignable.",
            msgGenericError: "Une erreur est survenue.",
            msgSuccessRegister: "Compte créé !",
            msgSuccessLogin: "Connecté !",
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
    document.documentElement.lang = currentLang;


        function getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => { return prev ? prev[curr] : null; }, obj);
    }


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


            const form = document.getElementById('auth-form');
    const title = document.getElementById('form-title');
    const subtitle = document.getElementById('form-subtitle');
    const submitBtn = document.getElementById('submit-btn');

        const toggleBtn = document.getElementById('toggle-btn');
    const toggleText = document.getElementById('toggle-text');
    const footerToggle = document.getElementById('footer-toggle');
    const footerBackLogin = document.getElementById('footer-back-login');
    const backLoginBtn = document.getElementById('back-login-btn');
    const forgotBtn = document.getElementById('forgot-btn');
    const forgotWrapper = document.getElementById('forgot-wrapper');

        const groupUsername = document.getElementById('group-username');
    const groupPassword = document.getElementById('group-password');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

        const errorBox = document.getElementById('error-message');
    const successBox = document.getElementById('success-message');

        const usernameFeedback = document.getElementById('username-feedback');

    let currentMode = 'login';
    let usernameTimeout;
    let isUsernameValid = false;



            toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentMode = (currentMode === 'login') ? 'register' : 'login';
        updateUI();
    });

    forgotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentMode = 'forgot';
        updateUI();
    });

    backLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        currentMode = 'login';
        updateUI();
    });

    updateUI();


        function updateUI() {
        errorBox.classList.add('hidden');
        successBox.style.display = 'none'; 
        usernameFeedback.textContent = ''; 

                if (currentMode === 'register') {
            title.textContent = t.modeRegisterTitle;
            subtitle.textContent = t.modeRegisterSubtitle;
            submitBtn.textContent = t.modeRegisterSubmit;

                        toggleText.textContent = t.modeRegisterToggleText;
            toggleBtn.textContent = t.modeRegisterToggleBtn;

                        groupUsername.classList.remove('hidden');
            groupPassword.classList.remove('hidden');
            forgotWrapper.classList.add('hidden');

                        footerToggle.style.display = 'flex';
            footerBackLogin.style.display = 'none';

                        usernameInput.setAttribute('required', 'true');
            passwordInput.setAttribute('required', 'true');

                        setTimeout(() => usernameInput.focus(), 100);

        } else if (currentMode === 'login') {
            title.textContent = t.modeLoginTitle;
            subtitle.textContent = t.modeLoginSubtitle;
            submitBtn.textContent = t.modeLoginSubmit;

                        toggleText.textContent = t.modeLoginToggleText;
            toggleBtn.textContent = t.modeLoginToggleBtn;

                        groupUsername.classList.add('hidden');
            groupPassword.classList.remove('hidden');
            forgotWrapper.classList.remove('hidden');

                        footerToggle.style.display = 'flex';
            footerBackLogin.style.display = 'none';

                        usernameInput.removeAttribute('required');
            passwordInput.setAttribute('required', 'true');

                        isUsernameValid = true; 

                    } else if (currentMode === 'forgot') {
            title.textContent = t.modeForgotTitle;
            subtitle.textContent = t.modeForgotSubtitle;
            submitBtn.textContent = t.modeForgotSubmit;

                        groupUsername.classList.add('hidden');
            groupPassword.classList.add('hidden');
            forgotWrapper.classList.add('hidden');

                        footerToggle.style.display = 'none';
            footerBackLogin.style.display = 'flex';

                        usernameInput.removeAttribute('required');
            passwordInput.removeAttribute('required');

                        isUsernameValid = true;

                        setTimeout(() => emailInput.focus(), 100);
        }
    }


        usernameInput.addEventListener('input', () => {
        if (currentMode !== 'register') return;

        const username = usernameInput.value.trim();
        usernameFeedback.textContent = '';

        if (username.length === 0) {
            isUsernameValid = false;
            return;
        }

        if (username.length < 3) {
            usernameFeedback.textContent = t.msgReqChar;
            usernameFeedback.style.color = "var(--accent-color-secondary)"; 
            isUsernameValid = false;
            return;
        }

        usernameFeedback.textContent = t.msgVerifying;
        usernameFeedback.style.color = "var(--text-secondary, #aaa)";

        clearTimeout(usernameTimeout);

                usernameTimeout = setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/auth/check-username/${encodeURIComponent(username)}`);

                                if (!res.ok) {
                    usernameFeedback.textContent = ""; 
                    isUsernameValid = true; 
                    return;
                }

                const contentType = res.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    usernameFeedback.textContent = "";
                    isUsernameValid = true;
                    return;
                }

                const data = await res.json();

                if (data.available) {
                    usernameFeedback.textContent = t.msgAvailable;
                    usernameFeedback.style.color = "var(--accent-color)"; 
                    isUsernameValid = true;
                } else {
                    usernameFeedback.textContent = t.msgTaken;
                    usernameFeedback.style.color = "var(--accent-color-secondary)"; 
                    isUsernameValid = false;
                }
            } catch (err) {
                usernameFeedback.textContent = "";
                isUsernameValid = true; 
            }
        }, 500); 
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

                if (currentMode === 'register' && !isUsernameValid) {
            showError(t.msgInvalidUser);
            usernameFeedback.style.transform = "translateX(5px)";
            setTimeout(() => usernameFeedback.style.transform = "translateX(0)", 100);
            return;
        }

        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = t.msgLoading;
        submitBtn.disabled = true;
        errorBox.classList.add('hidden');
        successBox.style.display = 'none';

        let endpoint = '';
        let payload = { email: emailInput.value };

        if (currentMode === 'register') {
            endpoint = '/api/auth/register';
            payload.username = usernameInput.value;
            payload.password = passwordInput.value;
        } else if (currentMode === 'login') {
            endpoint = '/api/auth/login';
            payload.password = passwordInput.value;
        } else if (currentMode === 'forgot') {
            endpoint = '/api/auth/request-password-reset';
        }

        const fullUrl = API_BASE_URL + endpoint;

        try {
            const response = await fetch(fullUrl, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLang
                },
                body: JSON.stringify(payload)
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error(t.msgServerError);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t.msgGenericError);
            }

            if (currentMode === 'forgot') {
                successBox.querySelector('span').textContent = data.message;
                successBox.style.display = 'flex'; 

                                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                emailInput.value = ''; 
            } else {
                if(data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }

                submitBtn.style.backgroundColor = "var(--accent-color)";
                submitBtn.textContent = currentMode === 'register' ? t.msgSuccessRegister : t.msgSuccessLogin;

                                setTimeout(() => {
                    window.location.href = '../../index.html'; 
                }, 800);
            }

        } catch (err) {
            showError(err.message);
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    function showError(msg) {
        errorBox.classList.remove('hidden');
        errorBox.querySelector('span').textContent = msg;
    }
});