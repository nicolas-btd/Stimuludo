document.addEventListener('DOMContentLoaded', () => {


        let API_BASE_URL = '';

        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        API_BASE_URL = 'http://localhost:3000'; 
    } else {
        API_BASE_URL = 'https://stimuludo.com'; 
    }

        let currentUser = null;


        const translations = {
        en: {
            pageTitle: "Stimuludo | My Profile",
            headerTitle: "MY PROFILE",
            usernameHeading: "Username",
            usernameDesc: "Your public username on the site.",
            usernamePlaceholder: "New username",
            saveBtn: "Save",
            emailHeading: "Email Address",
            emailDesc: "Change your login address (your password is required).",
            newEmailLabel: "New Email",
            emailPlaceholder: "example@email.com",
            currentPasswordLabel: "Current password",
            passwordPlaceholder: "••••••••",
            updateEmailBtn: "Update email",
            passwordHeading: "Password",
            passwordDesc: "Receive a secure link by email to reset your password.",
            sendLinkBtn: "Send me the link",
            sessionHeading: "Session",
            sessionDesc: "Log out of your account on this device.",
            logoutBtn: "Log out",
            deleteHeading: "Delete account",
            deleteDesc: "Irreversible action. All your stats will be lost.",
            currentPasswordPlaceholder: "Current password",
            deleteBtn: "DELETE MY ACCOUNT",


                                    waitMsg: "Please wait...",
            verifyMsg: "Verifying...",
            sendMsg: "Sending...",
            logoutMsg: "Logging out...",
            deleteMsg: "DELETING...",
            pseudoSuccess: "Username successfully updated!",
            emailSuccess: "Email address successfully updated!",
            linkSuccess: "Reset link sent by email.",
            deleteConfirm: "Irreversible action. All your data will be lost. Continue?",
            deleteSuccess: "Account successfully deleted.",
            errorUpdate: "Error during update",
            errorPwd: "Incorrect password",
            errorServer: "Server error",
            errorHtmlResponse: "The server returned HTML instead of JSON. Check the backend.",
            missingEmailError: "Please log out and log back in to enable automatic sending."
        },
        fr: {
            pageTitle: "Stimuludo | Mon Profil",
            headerTitle: "MON PROFIL",
            usernameHeading: "Pseudo",
            usernameDesc: "Votre nom d'utilisateur public sur le site.",
            usernamePlaceholder: "Nouveau pseudo",
            saveBtn: "Sauvegarder",
            emailHeading: "Adresse Email",
            emailDesc: "Modifiez votre adresse de connexion (votre mot de passe est requis).",
            newEmailLabel: "Nouvel Email",
            emailPlaceholder: "exemple@email.com",
            currentPasswordLabel: "Mot de passe actuel",
            passwordPlaceholder: "••••••••",
            updateEmailBtn: "Mettre à jour l'email",
            passwordHeading: "Mot de passe",
            passwordDesc: "Recevez un lien sécurisé par email pour réinitialiser votre mot de passe.",
            sendLinkBtn: "M'envoyer le lien",
            sessionHeading: "Session",
            sessionDesc: "Vous déconnecter de votre compte sur cet appareil.",
            logoutBtn: "Se déconnecter",
            deleteHeading: "Supprimer le compte",
            deleteDesc: "Action irréversible. Toutes vos statistiques seront perdues.",
            currentPasswordPlaceholder: "Mot de passe actuel",
            deleteBtn: "SUPPRIMER MON COMPTE",


                                    waitMsg: "Patientez...",
            verifyMsg: "Vérification...",
            sendMsg: "Envoi...",
            logoutMsg: "Déconnexion...",
            deleteMsg: "SUPPRESSION...",
            pseudoSuccess: "Pseudo mis à jour avec succès !",
            emailSuccess: "Adresse email modifiée avec succès !",
            linkSuccess: "Lien de réinitialisation envoyé par email.",
            deleteConfirm: "Action irréversible. Toutes vos données seront perdues. Continuer ?",
            deleteSuccess: "Compte supprimé avec succès.",
            errorUpdate: "Erreur lors de la mise à jour",
            errorPwd: "Mot de passe incorrect",
            errorServer: "Erreur serveur",
            errorHtmlResponse: "Le serveur a renvoyé du HTML au lieu de JSON. Vérifiez le backend.",
            missingEmailError: "Veuillez vous déconnecter puis vous reconnecter pour que l'envoi soit automatique."
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


        const initProfile = () => {
        const userDataStr = localStorage.getItem('user');
        if (!userDataStr) {
            window.location.href = '../../index.html';
            return;
        }

                currentUser = JSON.parse(userDataStr);

                const usernameInput = document.getElementById('input-username');
        if (usernameInput) usernameInput.value = currentUser.username;
    };

    initProfile();


        const toastBanner = document.getElementById('notification-toast');
    const toastText = document.getElementById('notification-text');
    let toastTimeout;

    const showNotification = (message, isError = false) => {
        clearTimeout(toastTimeout);
        toastBanner.classList.remove('show', 'error');

                toastText.textContent = message;
        if (isError) toastBanner.classList.add('error');

                requestAnimationFrame(() => {
            toastBanner.classList.add('show');
        });

                toastTimeout = setTimeout(() => {
            toastBanner.classList.remove('show');
        }, 4000);
    };

    const safeJsonResponse = async (res) => {
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const textContent = await res.text();
            console.error("Unexpected server response:", textContent);
            throw new Error(t.errorHtmlResponse);
        }
        return await res.json();
    };


        document.getElementById('form-username').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const newUsername = document.getElementById('input-username').value.trim();

        if (newUsername === currentUser.username) return;

        btn.disabled = true;
        btn.textContent = t.waitMsg;

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/update-username`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLang 
                },
                body: JSON.stringify({ newUsername })
            });

                        const data = await safeJsonResponse(res);
            if (!res.ok) throw new Error(data.message || t.errorUpdate);

            currentUser.username = newUsername;
            localStorage.setItem('user', JSON.stringify(currentUser));
            showNotification(data.message || t.pseudoSuccess);

                    } catch (err) {
            showNotification(err.message, true);
        } finally {
            btn.disabled = false;
            btn.textContent = t.saveBtn;
        }
    });


        document.getElementById('form-email').addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const newEmail = document.getElementById('input-email').value.trim();
        const password = document.getElementById('input-email-pwd').value;

        btn.disabled = true;
        btn.textContent = t.verifyMsg;

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/update-email`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLang
                },
                body: JSON.stringify({ newEmail, password })
            });

                        const data = await safeJsonResponse(res);
            if (!res.ok) throw new Error(data.message || t.errorPwd);

            currentUser.email = newEmail;
            localStorage.setItem('user', JSON.stringify(currentUser));

            showNotification(data.message || t.emailSuccess);
            document.getElementById('input-email').value = '';
            document.getElementById('input-email-pwd').value = '';
        } catch (err) {
            showNotification(err.message, true);
        } finally {
            btn.disabled = false;
            btn.textContent = t.updateEmailBtn;
        }
    });

    document.getElementById('btn-reset-pwd').addEventListener('click', async (e) => {
        const userEmail = currentUser.email;

        if (!userEmail) {
            showNotification(t.missingEmailError, true);
            return; 
        }

        const btn = e.currentTarget;
        btn.disabled = true;
        btn.textContent = t.sendMsg;

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/request-password-reset`, { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLang
                },
                body: JSON.stringify({ email: userEmail }) 
            });

                        const data = await safeJsonResponse(res);
            if (!res.ok) throw new Error(data.message || t.errorServer);
            showNotification(data.message || t.linkSuccess);
        } catch (err) {
            showNotification(err.message, true);
        } finally {
            btn.disabled = false;
            btn.textContent = t.sendLinkBtn;
        }
    });


        document.getElementById('logout-btn').addEventListener('click', async (e) => {
        const btn = e.currentTarget;
        const textSpan = btn.querySelector('.btn-text') || btn;
        textSpan.textContent = t.logoutMsg;
        btn.disabled = true;

        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, { 
                method: 'POST',
                headers: { 'Accept-Language': currentLang }
            });
        } catch (error) { 
            console.error(error); 
        } finally {
            localStorage.removeItem('user');
            window.location.href = '../../index.html';
        }
    });


        document.getElementById('form-delete').addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!confirm(t.deleteConfirm)) return;

        const btn = e.target.querySelector('button');
        const textSpan = btn.querySelector('.btn-text') || btn;
        const password = document.getElementById('input-delete-pwd').value;

        btn.disabled = true;
        textSpan.textContent = t.deleteMsg;

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': currentLang
                },
                body: JSON.stringify({ password })
            });

                        const data = await safeJsonResponse(res);
            if (!res.ok) throw new Error(data.message || t.errorPwd);

            localStorage.removeItem('user');
            alert(data.message || t.deleteSuccess);
            window.location.href = '../../index.html';

        } catch (err) {
            showNotification(err.message, true);
            btn.disabled = false;
            textSpan.textContent = t.deleteBtn;
        }
    });


        const goBack = () => {
        if (window.history.length > 1) window.history.back();
        else window.location.href = '../../index.html';
    };

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Escape') { e.preventDefault(); goBack(); }
    });

    const backBtn = document.querySelector('.back-btn');
    if (backBtn) backBtn.addEventListener('click', (e) => { e.preventDefault(); goBack(); });
});