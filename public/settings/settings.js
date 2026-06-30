const translations = {
    en: {
        global: { back: "BACK" },
        settings: {
            title: "SETTINGS",
            brightness: { title: "Brightness", desc: "Adjust the site ambiance across 5 intensity levels." },
            sound: { title: "Sound Volume", desc: "Adjust the global site volume level." },
            color: { title: "Colors", desc: "Customize the site colors." },
            colors: { 
                primary: "Primary", 
                primarySub: "Correct answer",
                secondary: "Secondary",
                secondarySub: "Wrong answer",
                record: "Record",
                recordSub: "Best score",
                background: "Background",
                backgroundSub: "Backdrop",
                container: "Container",
                containerSub: "Opaque blocks",
            },
            opaque: { title: "Opaque Background", desc: "Applies a solid background to improve readability." },
            pattern: { 
                title: "Background Patterns", 
                desc: "Choose the decorative page background style.",
                dots: "Dots",
                grid: "Grid",
                none: "None",
                millimeter : "Millimeter",
                cross : "Cross",
                opacity: "Pattern Opacity"
            },
            language: { title: "Language", desc: "Choose the interface language." },
            reset: "RESET ALL SETTINGS"
        },
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
        global: { back: "RETOUR" },
        settings: {
            title: "PARAMÈTRES",
            brightness: { title: "Luminosité", desc: "Ajustez l'ambiance du site sur 5 niveaux d'intensité." },
            sound: { title: "Volume Sonore", desc: "Réglez le niveau du volume global du site." },
            color: { title: "Couleurs", desc: "Personnalisez les couleurs du site." },
            colors: { 
                primary: "Principale", 
                primarySub: "Réponse juste",
                secondary: "Secondaire",
                secondarySub: "Réponse fausse",
                record: "Record",
                recordSub: "Meilleur score",
                background: "Fond",
                backgroundSub: "Arrière-plan",
                container: "Conteneur",
                containerSub: "Blocs opaques",
            },
            opaque: { title: "Fond Opaque", desc: "Applique un fond uni pour améliorer la lisibilité." },
            pattern: { 
                title: "Motifs d'arrière-plan", 
                desc: "Choisissez le style décoratif du fond de page.",
                dots: "Points",
                grid: "Quadrillage",
                none: "Vide",
                millimeter : "Millimétré",
                cross : "Croix",
                opacity: "Opacité du motif"
            },
            language: { title: "Langue", desc: "Choisissez la langue de l'interface." },
            reset: "RÉINITIALISER TOUT"
        },
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

const LanguageManager = {
    currentLang: 'en', 

    init() {
        const savedLang = localStorage.getItem('siteLanguage');
        const userLang = navigator.language || navigator.userLanguage;

                if (savedLang) {
            this.currentLang = savedLang;
        } else if (userLang && userLang.startsWith('fr')) {
            this.currentLang = 'fr'; 
        } else {
            this.currentLang = 'en'; 
        }

        this.applyTranslations();

        const select = document.getElementById('language-select');
        if (select) {
            select.value = this.currentLang;
            select.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    },

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('siteLanguage', lang);
        document.documentElement.setAttribute('lang', lang);
        this.applyTranslations();
    },

    getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => { return prev ? prev[curr] : null; }, obj);
    },

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            let text = this.getNestedTranslation(translations[this.currentLang], key);


                                    if (!text) {
                text = this.getNestedTranslation(translations['en'], key);
            }

            if (text) {
                if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) el.placeholder = text;
                else if (el.tagName === 'OPTION') el.innerText = text;
                else el.innerText = text;
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();


        const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        const observer = new MutationObserver(() => {
            LanguageManager.applyTranslations();
            observer.disconnect(); 
        });
        observer.observe(footerPlaceholder, { childList: true, subtree: true });
    }

        const GlobalSettings = {
        init() {

                        const savedOpaque = localStorage.getItem('globalOpaque') !== 'false';
            this.toggleGlobalOpaque(savedOpaque);
            const opaqueToggle = document.getElementById('global-opaque-toggle');
            if (opaqueToggle) {
                opaqueToggle.checked = savedOpaque;
                opaqueToggle.addEventListener('change', (e) => this.toggleGlobalOpaque(e.target.checked));
            }


                        const savedPattern = localStorage.getItem('patternMode');
            const oldHide = localStorage.getItem('hideDotPattern');
            let currentMode = 'dots';

            if (savedPattern) {
                currentMode = savedPattern;
            } else if (oldHide === 'true') {
                currentMode = 'none';
            }

            this.setPattern(currentMode);
            const patternSelect = document.getElementById('pattern-select');
            if (patternSelect) {
                patternSelect.value = currentMode;
                patternSelect.addEventListener('change', (e) => this.setPattern(e.target.value));
            }


                        const opacitySlider = document.getElementById('pattern-opacity-slider');
            if (opacitySlider) {
                const savedOpacity = localStorage.getItem('patternOpacity') || '50';

                                opacitySlider.value = savedOpacity;
                this.updateOpacity(savedOpacity);
                this.updateSliderVisual(opacitySlider, savedOpacity);

                opacitySlider.addEventListener('input', (e) => {
                    const val = e.target.value;
                    this.updateSliderVisual(opacitySlider, val);
                    this.updateOpacity(val);
                });
            }


                        const savedCardBg = localStorage.getItem('customCardBgColor');
            if (savedCardBg) document.documentElement.style.setProperty('--card-bg', savedCardBg);
        },

        toggleGlobalOpaque(isOpaque) {
            if (isOpaque) {
                document.documentElement.classList.add('global-opaque');
                localStorage.setItem('globalOpaque', 'true');
            } else {
                document.documentElement.classList.remove('global-opaque');
                localStorage.setItem('globalOpaque', 'false');
            }
        },

        setPattern(mode) {
            document.documentElement.setAttribute('data-pattern', mode);
            localStorage.setItem('patternMode', mode);
            localStorage.removeItem('hideDotPattern');
        },

        updateOpacity(val) {
            const decimalValue = val / 100;
            document.documentElement.style.setProperty('--pattern-opacity', decimalValue);
            localStorage.setItem('patternOpacity', val);
        },

        updateSliderVisual(slider, val) {
            const min = parseInt(slider.min) || 0;
            const max = parseInt(slider.max) || 100;
            const percentage = ((val - min) / (max - min)) * 100;
            slider.style.setProperty('--val-percent', percentage + '%');
        }
    };

        const ThemeManager = {
        init() {
            const slider = document.getElementById('page-theme-slider');
            if (!slider) return;

            let savedStep = parseInt(localStorage.getItem('themeStep'));
            if (isNaN(savedStep) || savedStep < 1 || savedStep > 5) savedStep = 4;

                        this.applyThemeStep(savedStep);

                        slider.value = savedStep;
            this.updateSliderFill(slider); 

                        let currentVal = savedStep;


                        slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                this.updateSliderFill(slider); 

                                if (val !== currentVal) {
                    currentVal = val;
                    this.applyThemeStep(val);

                                        if (document.documentElement.style.getPropertyValue('--bg-main')) {
                        this.resetCustomBackground();
                    }
                }
            });


                        slider.addEventListener('change', () => {
                ColorPicker.syncBgFromTheme();
            });


                        const sunIcon = document.querySelector('.icon-sun');
            const moonIcon = document.querySelector('.icon-moon');

                        if (sunIcon) {
                sunIcon.addEventListener('click', () => {
                    let val = parseInt(slider.value);
                    if (val > 1) {
                        slider.value = val - 1;
                        slider.dispatchEvent(new Event('input'));
                        slider.dispatchEvent(new Event('change'));
                    }
                });
            }
            if (moonIcon) {
                moonIcon.addEventListener('click', () => {
                    let val = parseInt(slider.value);
                    if (val < 5) {
                        slider.value = val + 1;
                        slider.dispatchEvent(new Event('input'));
                        slider.dispatchEvent(new Event('change'));
                    }
                });
            }
        },

        updateSliderFill(slider) {
            const min = parseInt(slider.min) || 1;
            const max = parseInt(slider.max) || 5;
            const percentage = ((parseInt(slider.value) - min) / (max - min)) * 100;
            slider.style.setProperty('--val-percent', percentage + '%');
        },

        applyThemeStep(step) {
            const root = document.documentElement;
            root.classList.remove('theme-lvl-1', 'theme-lvl-2', 'theme-lvl-3', 'theme-lvl-4', 'theme-lvl-5');
            root.classList.add(`theme-lvl-${step}`);
            if (step >= 3) root.classList.add('dark-dominant');
            else root.classList.remove('dark-dominant');
            localStorage.setItem('themeStep', step);
        },

        resetCustomBackground() {
            document.documentElement.style.removeProperty('--bg-main');
            document.documentElement.style.removeProperty('--card-bg');
            localStorage.removeItem('customBgColor');
            localStorage.removeItem('customCardBgColor');
        }
    };

        const SoundManager = {
        init() {
            const slider = document.getElementById('volume-slider');
            const display = document.getElementById('volume-display');
            if (!slider) return;

            const savedVolume = localStorage.getItem('siteGlobalVolume');
            const volume = savedVolume !== null ? parseInt(savedVolume) : 50;

                        slider.value = volume;
            this.updateState(slider, display, volume);

            slider.addEventListener('input', (e) => {
                const val = parseInt(e.target.value);
                this.updateState(slider, display, val);
            });

            slider.addEventListener('change', (e) => {
                this.setVolume(parseInt(e.target.value));
            });
        },
        updateState(slider, display, val) {
            slider.style.setProperty('--val-percent', val + '%');
            if (display) display.innerText = val;
        },
        setVolume(val) {
            localStorage.setItem('siteGlobalVolume', val);
        }
    };

        const ColorPicker = {
        currentMode: 'primary',
        syncTimeout: null,

                colors: {
            primary: { h: 220, s: 100, v: 100, cssVar: '--accent-color', storage: 'accentColor' },
            secondary: { h: 340, s: 80, v: 100, cssVar: '--accent-color-secondary', storage: 'accentColorSecondary' },
            record: { h: 38, s: 95, v: 96, cssVar: '--record-color', storage: 'recordColor' },
            background: { h: 0, s: 0, v: 95, cssVar: '--bg-main', storage: 'customBgColor' },
            cardBg: { h: 0, s: 0, v: 20, cssVar: '--card-bg', storage: 'customCardBgColor' }
        },

        isDragging: false,

                els: {
            box: document.getElementById('unified-sl-box'),
            cursor: document.getElementById('unified-sl-cursor'),
            hue: document.getElementById('unified-hue-slider'),

                        btnPrimary: document.getElementById('swatch-primary'),
            btnSecondary: document.getElementById('swatch-secondary'),
            btnRecord: document.getElementById('swatch-record'),
            btnBackground: document.getElementById('swatch-background'),
            btnCardBg: document.getElementById('swatch-card-bg'),

                        previewPrimary: document.querySelector('#swatch-primary .swatch-square'),
            previewSecondary: document.querySelector('#swatch-secondary .swatch-square'),
            previewRecord: document.querySelector('#swatch-record .swatch-square'),
            previewBackground: document.querySelector('#swatch-background .swatch-square'),
            previewCardBg: document.querySelector('#swatch-card-bg .swatch-square'),

            inputPrimary: document.getElementById('hex-input-primary'),
            inputSecondary: document.getElementById('hex-input-secondary'),
            inputRecord: document.getElementById('hex-input-record'),
            inputBackground: document.getElementById('hex-input-background'),
            inputCardBg: document.getElementById('hex-input-card-bg')
        },

        init() {
            if(!this.els.box) return; 

            this.loadSavedColors();
            this.bindEvents();

                        this.switchMode('primary');
            this.updateSwatchPreviews();
        },

        syncBgFromTheme() {
            if (this.syncTimeout) clearTimeout(this.syncTimeout);

                        this.syncTimeout = setTimeout(() => {
                const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-main').trim();
                const rgb = this.hexToRgb(computedColor);
                if (rgb) {
                    this.colors.background = { 
                        ...this.colors.background, 
                        ...this.rgbToHsv(rgb.r, rgb.g, rgb.b) 
                    };
                }

                const computedCard = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim();
                const rgbCard = this.hexToRgb(computedCard);
                if (rgbCard) {
                    this.colors.cardBg = { 
                        ...this.colors.cardBg, 
                        ...this.rgbToHsv(rgbCard.r, rgbCard.g, rgbCard.b) 
                    };
                }

                this.updateSwatchPreviews();

                                if (this.currentMode === 'background' || this.currentMode === 'cardBg') {
                    this.updatePickerFromState(false);
                }
            }, 50); 
        },

        switchMode(mode) {
            this.currentMode = mode;

                        if(this.els.btnPrimary) this.els.btnPrimary.classList.toggle('active', mode === 'primary');
            if(this.els.btnSecondary) this.els.btnSecondary.classList.toggle('active', mode === 'secondary');
            if(this.els.btnRecord) this.els.btnRecord.classList.toggle('active', mode === 'record');
            if(this.els.btnBackground) this.els.btnBackground.classList.toggle('active', mode === 'background');
            if(this.els.btnCardBg) this.els.btnCardBg.classList.toggle('active', mode === 'cardBg');

            this.updatePickerFromState(false); 
        },

        updatePickerFromState(save = true) {
            const data = this.colors[this.currentMode];

                        this.els.box.style.backgroundColor = `hsl(${data.h}, 100%, 50%)`;
            this.els.cursor.style.left = `${data.s}%`;
            this.els.cursor.style.top = `${100 - data.v}%`;
            this.els.hue.value = data.h;

                        const rgb = this.hsvToRgb(data.h, data.s, data.v);
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);

                        if(this.currentMode === 'primary' && this.els.inputPrimary) this.els.inputPrimary.value = hex.replace('#', '');
            else if (this.currentMode === 'secondary' && this.els.inputSecondary) this.els.inputSecondary.value = hex.replace('#', '');
            else if (this.currentMode === 'record' && this.els.inputRecord) this.els.inputRecord.value = hex.replace('#', '');
            else if (this.currentMode === 'background' && this.els.inputBackground) this.els.inputBackground.value = hex.replace('#', '');
            else if (this.currentMode === 'cardBg' && this.els.inputCardBg) this.els.inputCardBg.value = hex.replace('#', '');

            if (save) {
                document.documentElement.style.setProperty(data.cssVar, hex);
                localStorage.setItem(data.storage, hex);
                this.updateSwatchPreviews();
            }
        },

        updateStateFromInteraction(h, s, v) {
            const data = this.colors[this.currentMode];
            if (h !== null) data.h = h;
            if (s !== null) data.s = s;
            if (v !== null) data.v = v;

                        this.updatePickerFromState(true);
        },

        updateSwatchPreviews() {
            const updateOne = (colorData, elPreview, elInput) => {
                if (!colorData || !elPreview) return;
                const rgb = this.hsvToRgb(colorData.h, colorData.s, colorData.v);
                const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
                elPreview.style.backgroundColor = hex;
                if (elInput && document.activeElement !== elInput) {
                    elInput.value = hex.replace('#', '');
                }
            };

            updateOne(this.colors.primary, this.els.previewPrimary, this.els.inputPrimary);
            updateOne(this.colors.secondary, this.els.previewSecondary, this.els.inputSecondary);
            updateOne(this.colors.record, this.els.previewRecord, this.els.inputRecord);
            updateOne(this.colors.background, this.els.previewBackground, this.els.inputBackground);
            updateOne(this.colors.cardBg, this.els.previewCardBg, this.els.inputCardBg);
        },

        loadSavedColors() {
            const load = (key, defaultHex) => {
                const saved = localStorage.getItem(key);
                if (!saved && defaultHex) return this.hexToRgb(defaultHex);
                if (saved) return this.hexToRgb(saved);
                return null;
            };

            const pRgb = load('accentColor', '#72DE5F');
            if (pRgb) this.colors.primary = { ...this.colors.primary, ...this.rgbToHsv(pRgb.r, pRgb.g, pRgb.b) };

            const sRgb = load('accentColorSecondary', '#FF4545');
            if (sRgb) this.colors.secondary = { ...this.colors.secondary, ...this.rgbToHsv(sRgb.r, sRgb.g, sRgb.b) };
            else document.documentElement.style.setProperty('--accent-color-secondary', '#FF4545');

            const recRgb = load('recordColor', '#FFA914');
            if (recRgb) this.colors.record = { ...this.colors.record, ...this.rgbToHsv(recRgb.r, recRgb.g, recRgb.b) };
            else document.documentElement.style.setProperty('--record-color', '#FFA914');

            const bSaved = localStorage.getItem('customBgColor');
            if (bSaved) {
                const bRgb = this.hexToRgb(bSaved);
                if (bRgb) this.colors.background = { ...this.colors.background, ...this.rgbToHsv(bRgb.r, bRgb.g, bRgb.b) };
            } else {
                const computedBg = getComputedStyle(document.documentElement).getPropertyValue('--bg-main').trim();
                const bRgb = this.hexToRgb(computedBg);
                if (bRgb) this.colors.background = { ...this.colors.background, ...this.rgbToHsv(bRgb.r, bRgb.g, bRgb.b) };
            }

            const cSaved = localStorage.getItem('customCardBgColor');
            if (cSaved) {
                const cRgb = this.hexToRgb(cSaved);
                if (cRgb) this.colors.cardBg = { ...this.colors.cardBg, ...this.rgbToHsv(cRgb.r, cRgb.g, cRgb.b) };
            } else {
                const computedCard = getComputedStyle(document.documentElement).getPropertyValue('--card-bg').trim();
                const cRgb = this.hexToRgb(computedCard);
                if (cRgb) this.colors.cardBg = { ...this.colors.cardBg, ...this.rgbToHsv(cRgb.r, cRgb.g, cRgb.b) };
            }
        },

        hsvToRgb(h, s, v) { s/=100; v/=100; const f = (n, k=(n+h/60)%6) => v - v*s*Math.max(Math.min(k, 4-k, 1), 0); return { r: Math.round(f(5)*255), g: Math.round(f(3)*255), b: Math.round(f(1)*255) }; },
        rgbToHsv(r, g, b) { r/=255; g/=255; b/=255; let v=Math.max(r,g,b), c=v-Math.min(r,g,b); let h= c && ((v==r) ? (g-b)/c : ((v==g) ? 2+(b-r)/c : 4+(r-g)/c)); return { h: Math.round(60*(h<0?h+6:h)), s: Math.round((v?c/v:0)*100), v: Math.round(v*100) }; },
        rgbToHex: (r,g,b) => "#" + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join('').toUpperCase(),

                hexToRgb(hex) {
            if (!hex) return null;
            hex = hex.trim();
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
        },

        handleSlInteraction(e) {
            const rect = this.els.box.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
            const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

                        this.updateStateFromInteraction(null, (x / rect.width) * 100, 100 - ((y / rect.height) * 100));
        },

        handleHexInput(e, mode) {
            if(this.currentMode !== mode) this.switchMode(mode);
            const hex = e.target.value;
            if (/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
                let fullHex = hex.startsWith('#') ? hex : '#' + hex;
                const rgb = this.hexToRgb(fullHex);
                if (rgb) {
                    const hsv = this.rgbToHsv(rgb.r, rgb.g, rgb.b);
                    this.updateStateFromInteraction(hsv.h, hsv.s, hsv.v);
                }
            }
        },

        bindEvents() {
            if(this.els.btnPrimary) this.els.btnPrimary.addEventListener('click', (e) => {
                if(this.els.inputPrimary.contains(e.target) || e.target === this.els.inputPrimary) return;
                this.switchMode('primary');
            });
            if(this.els.btnSecondary) this.els.btnSecondary.addEventListener('click', (e) => {
                if(this.els.inputSecondary.contains(e.target) || e.target === this.els.inputSecondary) return;
                this.switchMode('secondary');
            });
            if(this.els.btnRecord) this.els.btnRecord.addEventListener('click', (e) => {
                if(this.els.inputRecord.contains(e.target) || e.target === this.els.inputRecord) return;
                this.switchMode('record');
            });
            if(this.els.btnBackground) this.els.btnBackground.addEventListener('click', (e) => {
                if(this.els.inputBackground.contains(e.target) || e.target === this.els.inputBackground) return;
                this.switchMode('background');
            });
            if(this.els.btnCardBg) this.els.btnCardBg.addEventListener('click', (e) => {
                if(this.els.inputCardBg.contains(e.target) || e.target === this.els.inputCardBg) return;
                this.switchMode('cardBg');
            });


                        const inputs = ['Primary', 'Secondary', 'Record', 'Background', 'CardBg'];
            inputs.forEach(key => {
                const inputEl = this.els[`input${key}`];
                if(inputEl) {
                    inputEl.addEventListener('input', (e) => this.handleHexInput(e, key.charAt(0).toLowerCase() + key.slice(1)));
                    inputEl.addEventListener('focus', () => this.switchMode(key.charAt(0).toLowerCase() + key.slice(1)));
                }
            });


                        const startDrag = (e) => { this.isDragging = true; this.handleSlInteraction(e); };
            this.els.box.addEventListener('mousedown', startDrag);
            this.els.box.addEventListener('touchstart', startDrag, {passive: false});

            document.addEventListener('mousemove', (e) => { if (this.isDragging) { e.preventDefault(); this.handleSlInteraction(e); } });
            document.addEventListener('touchmove', (e) => { if (this.isDragging) { e.preventDefault(); this.handleSlInteraction(e); } }, {passive: false});

            document.addEventListener('mouseup', () => this.isDragging = false);
            document.addEventListener('touchend', () => this.isDragging = false);

            this.els.hue.addEventListener('input', (e) => {
                this.updateStateFromInteraction(parseInt(e.target.value), null, null);
            });
        }
    };

        const Navigation = {
        init() {

                        const currentPath = window.location.pathname;
            const referrer = document.referrer;

                        if (referrer && referrer.includes(window.location.hostname)) {
                try {
                    const referrerUrl = new URL(referrer);

                                        if (referrerUrl.pathname !== currentPath) {
                        sessionStorage.setItem('settingsEntryPoint', referrer);
                    }
                } catch (e) {
                    console.error("Erreur d'analyse de l'URL du referrer :", e);
                }
            }


                        document.addEventListener('keyup', (e) => {
                if (e.code === 'Escape') { e.preventDefault(); this.goBack(); }
            });

                        const backBtn = document.querySelector('.back-btn');
            if (backBtn) {
                backBtn.addEventListener('click', (e) => { 
                    e.preventDefault(); 
                    this.goBack(); 
                });
            }
        },
        goBack() {

                        const entryPoint = sessionStorage.getItem('settingsEntryPoint');

                        if (entryPoint) {
                window.location.replace(entryPoint);
            } else {

                                window.location.replace('../../index.html');
            }
        }
    };

    const FactoryReset = {
        init() {
            const btn = document.getElementById('factory-reset-btn');
            if (btn) {
                btn.addEventListener('click', () => this.performReset());
            }
        },

        performReset() {
            const confirmMessage = LanguageManager.currentLang === 'en' 
                ? "Warning: This will reset all your preferences (colors, themes, sounds). Continue?" 
                : "Attention : Cela va réinitialiser toutes vos préférences (couleurs, thèmes, sons). Continuer ?";

            if (confirm(confirmMessage)) {
                const keysToRemove = [
                    'themeStep',
                    'siteGlobalVolume',
                    'accentColor',
                    'accentColorSecondary',
                    'recordColor',
                    'customBgColor',
                    'customCardBgColor',
                    'globalOpaque',
                    'patternMode',
                    'patternOpacity'
                ];
                keysToRemove.forEach(key => localStorage.removeItem(key));

                                window.location.reload();
            }
        }
    };

    GlobalSettings.init();
    ThemeManager.init();
    SoundManager.init();
    ColorPicker.init();
    Navigation.init();
    FactoryReset.init();
});