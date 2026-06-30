
const GameColorPicker = {
    h: 180, 
    l: 50,  
    isInteracted: false,
    els: null,
    onInteract: null,

    init(els) {
        this.els = els;
        this.onInteract = els.onInteract;
        this.bindEvents();
    },

    hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; 
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;

            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
    },

    rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; 
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    },

    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('').toUpperCase();
    },

    reset() {
        this.isInteracted = false;
        this.els.cursor.classList.add('hidden');
        if (this.els.preview) {
            this.els.preview.style.backgroundColor = 'transparent';
            this.els.preview.style.border = '2px dashed var(--border-color)';
        }
    },

    syncUIFromInternal() {
        const { h, l } = this;

                this.els.cursor.style.left = `${(h / 360) * 100}%`;
        this.els.cursor.style.top = `${100 - l}%`;

                if (this.isInteracted) {
            const rgb = this.hslToRgb(h, 100, l);
            const hex = this.rgbToHex(rgb.r, rgb.g, rgb.b);
            if (this.els.preview) {
                this.els.preview.style.backgroundColor = hex;
                this.els.preview.style.border = '2px solid var(--border-color)';
            }
        }
    },

    applyInteractionHsl(h, l) {
        if (h !== null && h !== undefined) this.h = h;
        if (l !== null && l !== undefined) this.l = l;

                if (!this.isInteracted) {
            this.isInteracted = true;
            this.els.cursor.classList.remove('hidden');
            if (this.onInteract) this.onInteract();
        }

        this.syncUIFromInternal();
    },

    handleSlInteraction(e) {
        const rect = this.els.box.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const y = Math.max(0, Math.min(clientY - rect.top, rect.height));

                const newH = (x / rect.width) * 360;
        const newL = 100 - ((y / rect.height) * 100);
        this.applyInteractionHsl(newH, newL);
    },

    bindEvents() {
        const startDrag = (e) => {
            this.isDragging = true;
            this.handleSlInteraction(e);
        };
        this.els.box.addEventListener('mousedown', startDrag);
        this.els.box.addEventListener('touchstart', startDrag, { passive: false });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.handleSlInteraction(e);
            }
        });
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                e.preventDefault();
                this.handleSlInteraction(e);
            }
        }, { passive: false });

        document.addEventListener('mouseup', () => { this.isDragging = false; });
        document.addEventListener('touchend', () => { this.isDragging = false; });
    },

    getRgb() {
        return this.hslToRgb(this.h, 100, this.l);
    }
};

const DEFAULT_MEMORIZE_MS = 2000;

const chromaticMemoryTranslations = {
    fr: {
        header_title: 'MÉMOIRE CHROMATIQUE',
        intro: {
            ranked: 'CLASSÉ',
            sandbox: 'LIBRE'
        },
        settings: {
            title: 'Configuration',
            life_pool: 'Réserve de vie (points) :',
            life_hint: 'Chaque erreur retire une valeur égale à la distance RGB (0–441).',
            memorize_ms: 'Durée d’affichage (ms) :',
            memorize_ms_hint: 'Temps pendant lequel la couleur cible reste visible avant la phase de reproduction.',
            cancel: 'ANNULER',
            save: 'APPLIQUER'
        },
        game: {
            score_label: 'SCORE',
            life: 'VIE',
            memorize: 'Mémorisez',
            reproduce: 'Reproduisez',
            validate: 'Valider',
            continue_hint: 'Touchez pour continuer',
            ready: 'Prêt ?',
            or: 'ou',
            to_start: 'pour commencer'
        },
        results: {
            new_record: 'NOUVEAU RECORD !',
            rounds: 'Manches réussies',
            unit: 'pts',
            unit_distance: 'ΔRGB',
            error_avg: 'Erreur moyenne',
            memorize_duration: 'Affichage',
            best_error: 'Meilleure erreur',
            best: 'Record',
            retry: 'Rejouer'
        }
    },
    en: {
        header_title: 'CHROMATIC MEMORY',
        intro: {
            ranked: 'RANKED',
            sandbox: 'PRACTICE'
        },
        settings: {
            title: 'Settings',
            life_pool: 'Life pool (points):',
            life_hint: 'Each mistake subtracts the RGB Euclidean distance (0–441).',
            memorize_ms: 'Display duration (ms):',
            memorize_ms_hint: 'How long the target color stays visible before the reproduction phase.',
            cancel: 'CANCEL',
            save: 'APPLY'
        },
        game: {
            score_label: 'SCORE',
            life: 'LIFE',
            memorize: 'Memorize',
            reproduce: 'Reproduce',
            validate: 'Submit',
            continue_hint: 'Tap to continue',
            ready: 'Ready?',
            or: 'or',
            to_start: 'to start'
        },
        results: {
            new_record: 'NEW RECORD!',
            rounds: 'Rounds cleared',
            unit: 'pts',
            unit_distance: 'ΔRGB',
            error_avg: 'Average error',
            memorize_duration: 'Display',
            best_error: 'Best error',
            best: 'Best',
            retry: 'Play again'
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.chromatic_memory = chromaticMemoryTranslations.fr;
    translations.en.chromatic_memory = chromaticMemoryTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, chromaticMemoryTranslations[lang])
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, chromaticMemoryTranslations.fr);
}

function rgbDistance(a, b) {
    const dr = a.r - b.r;
    const dg = a.g - b.g;
    const db = a.b - b.b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
}

function clampMemorizeMs(raw) {
    const n = parseInt(String(raw), 10);
    if (Number.isNaN(n)) return DEFAULT_MEMORIZE_MS;
    const stepped = Math.round(n / 100) * 100;
    return Math.min(5000, Math.max(500, stepped));
}

document.addEventListener('DOMContentLoaded', () => {
    const CouleurGame = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START',
            score: 0,
            gauge: 200,
            maxGauge: 200,
            targetRgb: { r: 0, g: 0, b: 0 },
            lastDistance: 0,
            memorizeTimer: null,
            actionTimeout: null,
            savedLifePool: '200',
            savedSandboxMemorizeMs: DEFAULT_MEMORIZE_MS,
            memorizeMs: DEFAULT_MEMORIZE_MS,
            errorsArray: [],
            distributionDataByConfig: {}
        },

        els: {
            gameArea: document.getElementById('game-area'),
            statusOverlay: document.getElementById('status-overlay'),
            gameWrapper: document.getElementById('couleur-game-wrapper'),
            phaseMemorize: document.getElementById('phase-memorize'),
            phasePick: document.getElementById('phase-pick'),
            phaseFeedback: document.getElementById('phase-feedback'),
            targetBlock: document.getElementById('target-color-block'),
            feedbackTitle: document.getElementById('feedback-title'),
            feedbackDistance: document.getElementById('feedback-distance'),
            currentScore: document.getElementById('current-score'),
            gaugeFill: document.getElementById('gauge-bar-fill'),
            gaugeText: document.getElementById('gauge-value-text'),
            gaugeContainer: document.getElementById('gauge-container'),
            board: document.querySelector('.game-board'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'),
            restartBtn: document.getElementById('restart-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            iconExpand: document.getElementById('icon-expand'),
            iconCompress: document.getElementById('icon-compress'),
            overlayOver: document.getElementById('game-over-overlay'),
            viewRanked: document.getElementById('results-ranked'),
            viewSandbox: document.getElementById('results-sandbox'),
            rankedScore: document.getElementById('ranked-score'),
            sandboxScore: document.getElementById('sandbox-score'),
            statSandboxMemorize: document.getElementById('stat-sandbox-memorize'),
            statBestError: document.getElementById('stat-best-error'),
            historyChart: document.getElementById('history-chart'),
            newRecordMsg: document.getElementById('new-record-msg'),
            validateBtn: document.getElementById('validate-color-btn'),
            pickerRoot: document.getElementById('couleur-picker-root'),
            settingsPanel: document.getElementById('settings-panel'),
            settingsToggle: document.getElementById('settings-toggle'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),
            lifePoolSelect: document.getElementById('couleur-life-pool'),
            sandboxMemorizeMs: document.getElementById('sandbox-memorize-ms'),
            settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
            modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),
            markerCurrent: document.getElementById('marker-current'),
            markerBest: document.getElementById('marker-best'),
            targetCursor: document.getElementById('game-target-cursor'),
            distanceSvg: document.getElementById('distance-line-svg'),
            distanceLine: document.getElementById('distance-line'),
            colorResultGroup: document.getElementById('color-result-group')
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                const m = params.get('mode');
                if (m === 'sandbox' || m === 'ranked') this.state.gameMode = m;
            }

            this.loadUserPreferences();
            this.loadBackgroundPreference();

                        GameColorPicker.init({
                box: document.getElementById('game-sl-box'),
                cursor: document.getElementById('game-sl-cursor'),
                preview: document.getElementById('game-color-preview'),
                onInteract: () => {
                    if (this.els.validateBtn) this.els.validateBtn.classList.remove('hidden');
                }
            });

                        this.bindEvents();

            if (this.els.newRecordMsg && this.els.viewRanked) {
                this.els.viewRanked.insertBefore(this.els.newRecordMsg, this.els.viewRanked.firstChild);
                this.els.newRecordMsg.style.minHeight = '24px';
                this.els.newRecordMsg.style.marginTop = '0px';
                this.els.newRecordMsg.style.marginBottom = '15px';
                this.els.newRecordMsg.style.width = '100%';
                this.els.newRecordMsg.style.textAlign = 'center';
                this.els.newRecordMsg.classList.remove('hidden');
                this.els.newRecordMsg.style.visibility = 'hidden';
                this.els.newRecordMsg.style.opacity = '0';
                this.els.newRecordMsg.style.transition = 'opacity 0.3s ease';
            }

            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if (activeRadio) activeRadio.checked = true;
            this.updateSettingsView(this.state.gameMode);

            if (this.state.gameMode === 'sandbox') {
                this.els.statusOverlay.classList.add('hidden');
                this.els.gameWrapper.classList.remove('blurred');
                this.startGame();
            } else {
                this.setPreStartState();
            }
            const configKey = `chromatic_memory_ranked_${this.state.maxGauge}`;
            this.preloadDistributionData(configKey);
        },

        loadUserPreferences() {
            const savedLife = localStorage.getItem('chromatic_memory_life_pool')
                ?? localStorage.getItem('couleur_life_pool');

                        const validLifePools = ['50', '200'];
            if (savedLife !== null && validLifePools.includes(savedLife)) {
                if (this.els.lifePoolSelect) this.els.lifePoolSelect.value = savedLife;
            } else {
                if (this.els.lifePoolSelect) this.els.lifePoolSelect.value = '200';
            }

                        if (this.els.lifePoolSelect) {
                this.state.savedLifePool = this.els.lifePoolSelect.value;
                this.state.maxGauge = parseInt(this.els.lifePoolSelect.value, 10) || 200;
            }

            const savedMem = localStorage.getItem('chromatic_memory_memorize_ms');
            if (this.els.sandboxMemorizeMs) {
                if (savedMem !== null) {
                    const ms = clampMemorizeMs(savedMem);
                    this.els.sandboxMemorizeMs.value = String(ms);
                    this.state.savedSandboxMemorizeMs = ms;
                } else {
                    this.els.sandboxMemorizeMs.value = String(DEFAULT_MEMORIZE_MS);
                    this.state.savedSandboxMemorizeMs = DEFAULT_MEMORIZE_MS;
                }
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
                this.els.board.classList.add('opaque-mode');
                this.els.settingsPanel.classList.add('opaque-mode');
            } else {
                this.els.board.classList.remove('opaque-mode');
                this.els.settingsPanel.classList.remove('opaque-mode');
            }
        },

        clearTimers() {
            if (this.state.memorizeTimer) {
                clearTimeout(this.state.memorizeTimer);
                this.state.memorizeTimer = null;
            }
            if (this.state.actionTimeout) {
                clearTimeout(this.state.actionTimeout);
                this.state.actionTimeout = null;
            }
        },

        setPreStartState() {
            this.clearTimers();
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

            this.els.gameWrapper.classList.remove('hidden');
            this.els.gameWrapper.classList.add('blurred');
            this.els.phaseMemorize.classList.add('hidden');
            this.els.phasePick.classList.add('hidden');
            this.els.phaseFeedback.classList.add('hidden');
            this.els.validateBtn.classList.add('hidden'); 

            const mainText = getGameText('game.ready');
            const orText = getGameText('game.or');
            const startText = getGameText('game.to_start');
            this.els.statusOverlay.innerHTML = `
                <div class="status-main-text">${mainText}</div>
                <div class="status-sub-text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.3572 3.23397C3.66645 2.97447 4.1014 2.92638 4.45988 3.11204L20.7851 11.567C21.1426 11.7522 21.3542 12.1337 21.322 12.5351C21.2898 12.9364 21.02 13.2793 20.6375 13.405L13.7827 15.6586L10.373 22.0179C10.1828 22.3728 9.79826 22.5789 9.39743 22.541C8.9966 22.503 8.65762 22.2284 8.53735 21.8441L3.04564 4.29872C2.92505 3.91345 3.04794 3.49346 3.3572 3.23397ZM5.67123 5.99173L9.73507 18.9752L12.2091 14.361C12.3304 14.1347 12.5341 13.9637 12.7781 13.8835L17.7518 12.2484L5.67123 5.99173Z"/>
                    </svg>
                    <span>${orText}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21,9a1,1,0,0,0-1,1v3H4V10a1,1,0,0,0-2,0v4a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V10A1,1,0,0,0,21,9Z"/>
                    </svg>
                    <span>${startText}</span>
                </div>
            `;
            this.els.statusOverlay.classList.remove('hidden');

            this.state.maxGauge = parseInt(this.els.lifePoolSelect.value, 10) || 200;
            this.state.gauge = this.state.maxGauge;
            this.state.score = 0;
            this.els.currentScore.textContent = '0';

            if (this.state.gameMode === 'ranked') {
                this.els.gaugeContainer.style.visibility = 'visible';
                this.updateGaugeUI();
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.els.gaugeContainer.style.visibility = 'hidden';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.visibility = 'hidden';
                }
            }
        },

        startGame() {
            this.clearTimers();
            this.state.errorsArray = [];
            this.state.memorizeMs = this.state.savedSandboxMemorizeMs;
            this.state.currentState = 'PLAYING';
            this.els.statusOverlay.classList.add('hidden');
            this.els.gameWrapper.classList.remove('blurred');

            if (this.state.gameMode === 'ranked') {
                this.state.maxGauge = parseInt(this.els.lifePoolSelect.value, 10) || 200;
                this.state.gauge = this.state.maxGauge;
                this.els.gaugeContainer.style.visibility = 'visible';
                this.updateGaugeUI();
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.state.maxGauge = parseInt(this.els.lifePoolSelect.value, 10) || 200;
                this.state.gauge = this.state.maxGauge;
                this.els.gaugeContainer.style.visibility = 'hidden';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.visibility = 'hidden';
                }
            }

            this.state.score = 0;
            this.els.currentScore.textContent = '0';

            this.startRound();
        },

        randomRgb() {
            const h = Math.floor(Math.random() * 361);
            const l = Math.floor(Math.random() * 71) + 15; 
            return GameColorPicker.hslToRgb(h, 100, l);
        },

        startRound() {
            this.clearTimers();
            this.state.currentState = 'MEMORIZE';
            this.els.phasePick.classList.add('hidden');
            this.els.phaseFeedback.classList.add('hidden');
            this.els.validateBtn.classList.add('hidden'); 
            this.els.phaseMemorize.classList.remove('hidden');

            this.els.pickerRoot.style.pointerEvents = 'auto'; 
            if(this.els.targetCursor) this.els.targetCursor.classList.add('hidden');
            if(this.els.distanceSvg) this.els.distanceSvg.classList.add('hidden');

                        if(this.els.colorResultGroup) this.els.colorResultGroup.classList.remove('hidden');

            const pickInstruction = this.els.phasePick.querySelector('.time-instruction');
            if (pickInstruction) pickInstruction.style.display = '';

            this.state.targetRgb = this.randomRgb();
            const { r, g, b } = this.state.targetRgb;
            this.els.targetBlock.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

            this.state.memorizeTimer = setTimeout(() => this.enterPickPhase(), this.state.memorizeMs);
        },

        enterPickPhase() {
            this.state.memorizeTimer = null;
            if (this.state.currentState !== 'MEMORIZE') return;

            this.state.currentState = 'PICK';
            this.els.phaseMemorize.classList.add('hidden');
            this.els.phasePick.classList.remove('hidden');
            this.els.validateBtn.classList.add('hidden'); 
            GameColorPicker.reset();
        },

        calculateGaugeColor(percentage) {
            const styles = getComputedStyle(document.documentElement);
            const colorStart = styles.getPropertyValue('--accent-color').trim();
            const colorEnd = styles.getPropertyValue('--accent-color-secondary').trim();

            const hexToRgb = (hex) => {
                if (hex.length === 4) {
                    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
                }
                return {
                    r: parseInt(hex.substring(1, 3), 16),
                    g: parseInt(hex.substring(3, 5), 16),
                    b: parseInt(hex.substring(5, 7), 16)
                };
            };

            const rgbStart = hexToRgb(colorStart);
            const rgbEnd = hexToRgb(colorEnd);
            const ratio = 1 - percentage;
            const r = Math.round(rgbStart.r + (rgbEnd.r - rgbStart.r) * ratio);
            const g = Math.round(rgbStart.g + (rgbEnd.g - rgbStart.g) * ratio);
            const b = Math.round(rgbStart.b + (rgbEnd.b - rgbStart.b) * ratio);
            return `rgb(${r}, ${g}, ${b})`;
        },

        updateGaugeUI() {
            const clampGauge = Math.max(0, this.state.gauge);
            this.els.gaugeText.textContent = `${Math.round(clampGauge)}`;
            const percent = this.state.maxGauge > 0 ? clampGauge / this.state.maxGauge : 0;
            this.els.gaugeFill.style.width = `${percent * 100}%`;
            const dynamicColor = this.calculateGaugeColor(percent);
            this.els.gaugeFill.style.backgroundColor = dynamicColor;
        },

        validateChoice() {
            if (this.state.currentState !== 'PICK') return;

            const chosen = GameColorPicker.getRgb();
            const dist = rgbDistance(this.state.targetRgb, chosen);
            this.state.lastDistance = dist;
            this.state.errorsArray.push(dist);

            if (this.state.gameMode === 'ranked') {
                this.state.gauge -= dist;
                this.updateGaugeUI();
            }

            this.els.validateBtn.classList.add('hidden');
            this.els.phaseFeedback.classList.remove('hidden');
            this.state.currentState = 'FEEDBACK';

            const targetHsl = GameColorPicker.rgbToHsl(this.state.targetRgb.r, this.state.targetRgb.g, this.state.targetRgb.b);

                        if(this.els.targetCursor) {
                this.els.targetCursor.style.left = `${(targetHsl.h / 360) * 100}%`;
                this.els.targetCursor.style.top = `${100 - targetHsl.l}%`;
                this.els.targetCursor.classList.remove('hidden');
            }

            if(this.els.distanceLine && this.els.distanceSvg) {
                this.els.distanceLine.setAttribute('x1', `${(GameColorPicker.h / 360) * 100}%`);
                this.els.distanceLine.setAttribute('y1', `${100 - GameColorPicker.l}%`);
                this.els.distanceLine.setAttribute('x2', `${(targetHsl.h / 360) * 100}%`);
                this.els.distanceLine.setAttribute('y2', `${100 - targetHsl.l}%`);
                this.els.distanceSvg.classList.remove('hidden');
            }

            if(this.els.colorResultGroup) {
                this.els.colorResultGroup.classList.add('hidden');
            }

            this.els.pickerRoot.style.pointerEvents = 'none';
            const pickInstruction = this.els.phasePick.querySelector('.time-instruction');
            if (pickInstruction) pickInstruction.style.display = 'none';

            const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
            this.els.feedbackTitle.textContent = lang === 'en' ? 'Error (RGB distance)' : 'Erreur (distance RGB)';
            this.els.feedbackDistance.textContent = `${dist.toFixed(1)}`;

            const maxExpectedDist = 100; 
            const mixRatio = Math.min(dist / maxExpectedDist, 1) * 100;
            const distanceColor = dist === 0 
                ? 'var(--accent-color)' 
                : `color-mix(in srgb, var(--accent-color-secondary) ${mixRatio}%, var(--accent-color))`;

                        this.els.feedbackDistance.style.color = distanceColor;

            if (this.state.gameMode === 'ranked' && this.state.gauge <= 0) {
                this.state.actionTimeout = setTimeout(() => this.gameOver(), 1400);
            }
        },

        advanceFromFeedback() {
            if (this.state.currentState !== 'FEEDBACK') return;
            if (this.state.actionTimeout) return;

            this.els.phaseFeedback.classList.add('hidden');

            if (this.state.gameMode === 'ranked' && this.state.gauge <= 0) return;

            this.state.score += 1;
            this.els.currentScore.textContent = String(this.state.score);
            this.startRound();
        },

        drawSandboxHistoryChart() {
            if (!this.els.historyChart || this.state.errorsArray.length === 0) return;
            this.els.historyChart.innerHTML = '';
            const arr = this.state.errorsArray;
            const minErr = Math.min(...arr);
            const maxErr = Math.max(...arr);
            let buffer = (maxErr - minErr) * 0.2;
            if (!Number.isFinite(buffer)) buffer = 0;
            let chartMin = minErr - buffer;
            if (chartMin < 0) chartMin = 0;
            let chartMax = maxErr + buffer;
            if (chartMin === chartMax) {
                chartMin -= 10;
                chartMax += 10;
            }
            const chartRange = chartMax - chartMin;

            arr.forEach((err, index) => {
                let heightPercent = ((err - chartMin) / chartRange) * 100;
                if (heightPercent < 5) heightPercent = 5;
                if (heightPercent > 100) heightPercent = 100;

                const barContainer = document.createElement('div');
                barContainer.className = 'history-bar-wrapper';

                const bar = document.createElement('div');
                bar.className = 'history-bar';
                bar.style.height = `${heightPercent}%`;

                const label = document.createElement('span');
                label.textContent = err.toFixed(1);
                label.className = 'bar-label';

                const indexLabel = document.createElement('span');
                indexLabel.textContent = String(index + 1);
                indexLabel.className = 'bar-index';

                barContainer.appendChild(label);
                barContainer.appendChild(bar);
                barContainer.appendChild(indexLabel);
                this.els.historyChart.appendChild(barContainer);
            });
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
            if (!this.state.distributionDataByConfig[configKey]) {
                this.state.distributionDataByConfig[configKey] = [];
            }

                        this.state.distributionDataByConfig[configKey].push(currentScore);

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
            let densities = [];
            let maxDensity = 0;
            let totalArea = 0; 

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
                const px = i; 
                const py = 100 - ((densities[i].y / maxDensity) * 95); 
                pathD += ` L ${px} ${py}`;
            }

                        const curvePath = this.els.viewRanked.querySelector('.curve-path');
            const curveFill = this.els.viewRanked.querySelector('.curve-fill');
            if (curvePath) curvePath.setAttribute('d', pathD);
            if (curveFill) curveFill.setAttribute('d', pathD + ` L 100 100 Z`);

            const distributionContainer = this.els.viewRanked.querySelector('.distribution-chart-container');
            if (!distributionContainer) return;
            distributionContainer.querySelectorAll('.dist-html-dot').forEach(el => el.remove()); 

                        let dotsHTML = '';
            for (let val = minX; val <= maxX; val++) {
                let d = getDensity(val);
                let px = ((val - minX) / range) * 100;
                let py = 100 - ((d / maxDensity) * 95);
                dotsHTML += `<div class="dist-html-dot" style="position: absolute; left: ${px}%; top: ${py}%; width: 4px; height: 4px; background: var(--accent-color); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 1;"></div>`;
            }
            distributionContainer.insertAdjacentHTML('beforeend', dotsHTML);

            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            const currentPercent = clamp(((currentScore - minX) / range) * 100, 0, 100);
            let bestPercent = null;
            if (bestScore !== null) {
                bestPercent = clamp(((bestScore - minX) / range) * 100, 0, 100);
            }

            let currentOffset = 5; 
            if (bestPercent !== null && Math.abs(currentPercent - bestPercent) < 8) {
                currentOffset = 30;
            }

            if (bestScore !== null && currentScore === bestScore) {
                this.els.markerCurrent.style.display = 'none';
            } else {
                this.els.markerCurrent.style.display = 'block';
                this.els.markerCurrent.style.left = `${currentPercent}%`;
                this.els.markerCurrent.innerHTML = `
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">
                        ${currentScore}
                    </div>
                `;
            }

            if (bestScore !== null) {
                this.els.markerBest.classList.remove('hidden');
                this.els.markerBest.style.left = `${bestPercent}%`;
                this.els.markerBest.innerHTML = `
                    <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);">
                        <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                            <path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/>
                        </svg>
                    </div>
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">
                        ${bestScore}
                    </div>
                `;
            } else {
                this.els.markerBest.classList.add('hidden');
            }

            const tooltip = this.els.viewRanked.querySelector('.chart-tooltip');
            const hoverLine = this.els.viewRanked.querySelector('.hover-line');

            distributionContainer.onmousemove = (e) => {
                const rect = distributionContainer.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const percentX = clamp(mouseX / rect.width, 0, 1);
                const val = Math.round(minX + percentX * range);
                const snappedPercentX = (val - minX) / range;

                let areaToRight = 0;
                for (let i = 0; i <= steps; i++) {
                    let pointVal = minX + (i / steps) * range;
                    if (pointVal >= val) {
                        areaToRight += densities[i].y;
                    }
                }

                                let percentile = (areaToRight / totalArea) * 100;

                                if (percentile < 0.1) percentile = 0.1;
                if (percentile > 99.9) percentile = 99.9;

                                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                tooltip.style.left = `${snappedPercentX * 100}%`;
                tooltip.innerHTML = `<strong>${val}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                tooltip.classList.remove('hidden');

                                hoverLine.style.left = `${snappedPercentX * 100}%`;
                tooltip.classList.remove('hidden');
                hoverLine.classList.remove('hidden');
            };

            distributionContainer.onmouseleave = () => {
                tooltip.classList.add('hidden');
                hoverLine.classList.add('hidden');
            };
        },

        async preloadDistributionData(configKey) {
            const distKey = configKey || `chromatic_memory_ranked_${this.state.maxGauge}`;
            try {
                const res = await fetch(`/api/scores/distribution/chromatic_memory?life_pool=${this.state.maxGauge}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                if (res.ok) {
                    this.state.distributionDataByConfig[distKey] = await res.json();
                } else {
                    this.state.distributionDataByConfig[distKey] = [];
                }
            } catch (e) {
                console.error(e);
                this.state.distributionDataByConfig[distKey] = [];
            }
        },

        async gameOver() {
            this.state.actionTimeout = null;
            this.state.currentState = 'FINISHED';
            this.clearTimers();

            if (this.state.gameMode === 'ranked') {
                if (this.els.viewRanked) this.els.viewRanked.classList.remove('hidden');
                if (this.els.viewSandbox) this.els.viewSandbox.classList.add('hidden');

                const finalScore = this.state.score;
                if (this.els.rankedScore) this.els.rankedScore.textContent = String(finalScore);

                const recordKeyNew = `chromatic_memory_best_${this.state.maxGauge}`;
                const recordKeyLegacy = `couleur_best_${this.state.maxGauge}`;
                let savedBest = localStorage.getItem(recordKeyNew) ?? localStorage.getItem(recordKeyLegacy);
                let best = savedBest !== null ? parseInt(savedBest, 10) : null;
                let isRecord = false;

                this.saveScoreToDatabase(finalScore);

                if (best === null || finalScore > best) {
                    best = finalScore;
                    localStorage.setItem(recordKeyNew, String(best));
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.maxGauge);
                }

                if (isRecord && savedBest !== null && this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'visible';
                    this.els.newRecordMsg.style.opacity = '1';
                } else if (this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                const configKey = `chromatic_memory_ranked_${this.state.maxGauge}`;
                this.drawDistributionChart(finalScore, best, configKey);

            } else {
                if (this.els.viewRanked) this.els.viewRanked.classList.add('hidden');
                if (this.els.viewSandbox) this.els.viewSandbox.classList.remove('hidden');
                if (this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                if (this.state.errorsArray.length > 0) {
                    const sum = this.state.errorsArray.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.state.errorsArray.length).toFixed(1);
                    const bestErr = Math.min(...this.state.errorsArray).toFixed(1);
                    if (this.els.sandboxScore) this.els.sandboxScore.textContent = avg;
                    if (this.els.statSandboxMemorize) {
                        this.els.statSandboxMemorize.textContent = `${this.state.savedSandboxMemorizeMs} ms`;
                    }
                    if (this.els.statBestError) this.els.statBestError.textContent = bestErr;
                    this.drawSandboxHistoryChart();
                } else {
                    if (this.els.sandboxScore) this.els.sandboxScore.textContent = '—';
                    if (this.els.statSandboxMemorize) this.els.statSandboxMemorize.textContent = '—';
                    if (this.els.statBestError) this.els.statBestError.textContent = '—';
                    if (this.els.historyChart) this.els.historyChart.innerHTML = '';
                }
            }

            this.toggleOverlay(this.els.overlayOver, true);
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


        async saveScoreToDatabase(score) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: score }, '*');
                return;
            }
            try {
                fetch('/api/scores', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        game_id: 'chromatic_memory',
                        score,
                        details: { life_pool: this.state.maxGauge, mode: this.state.gameMode },
                        guest_id: this.getGuestId()
                    })
                });
            } catch (error) {
                console.error('Échec sauvegarde DB:', error);
            }
        },

        async saveBestScoreToDatabase(score, lifePool) {
            try {
                fetch('/api/best', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        game_mode_key: `chromatic_memory_ranked_${lifePool}`,
                        score,
                        details: { life_pool: lifePool },
                        guest_id: this.getGuestId()
                    })
                });
            } catch (error) {
                console.error('Échec de la connexion au serveur :', error);
            }
        },

        toggleOverlay(el, show) {
            if (show) {
                el.classList.remove('hidden');
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
                el.classList.add('hidden');
            }
        },

        toggleFullscreen() {
            const elem = this.els.board;
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement
                || elem.classList.contains('ios-fullscreen');

            if (!isFullscreen) {
                const isMobile = window.innerWidth <= 700 || 'ontouchstart' in window;
                if (isMobile) {
                    elem.classList.add('ios-fullscreen');
                    this.updateFullscreenIcon();
                } else if (elem.requestFullscreen) {
                    elem.requestFullscreen().catch(() => this.enableFallbackFullscreen());
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else {
                    this.enableFallbackFullscreen();
                }
            } else {
                if (document.exitFullscreen && document.fullscreenElement) {
                    document.exitFullscreen().catch((err) => console.error(err));
                } else if (document.webkitExitFullscreen && document.webkitExitFullscreenElement) {
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
                if (this.els.iconExpand) this.els.iconExpand.classList.add('hidden');
                if (this.els.iconCompress) this.els.iconCompress.classList.remove('hidden');
            } else {
                if (this.els.iconCompress) this.els.iconCompress.classList.add('hidden');
                if (this.els.iconExpand) this.els.iconExpand.classList.remove('hidden');
            }
        },

        updateSettingsView(mode) {
            if (!this.els.settingsGroupRanked || !this.els.settingsGroupSandbox) return;
            if (mode === 'ranked') {
                this.els.settingsGroupRanked.style.display = 'block';
                this.els.settingsGroupSandbox.style.display = 'none';
            } else {
                this.els.settingsGroupRanked.style.display = 'none';
                this.els.settingsGroupSandbox.style.display = 'block';
            }
        },

        restoreSettingsUI() {
            if (this.els.lifePoolSelect) this.els.lifePoolSelect.value = this.state.savedLifePool;
            if (this.els.sandboxMemorizeMs) {
                this.els.sandboxMemorizeMs.value = String(this.state.savedSandboxMemorizeMs);
            }
            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if (activeRadio) activeRadio.checked = true;
            this.updateSettingsView(this.state.gameMode);
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
            if (!panel) return;
            const isHidden = panel.classList.contains('panel-hidden');
            if (forceClose || !isHidden) {
                this.restoreSettingsUI();
                panel.classList.remove('panel-visible');
                panel.classList.add('panel-hidden');
            } else {
                this.restoreSettingsUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');
            }
        },

        bindEvents() {
            const { els } = this;

            if (els.restartBtn) els.restartBtn.addEventListener('click', () => {
                this.toggleOverlay(els.overlayOver, false);
                if (this.state.gameMode === 'sandbox') {
                    this.startGame();
                } else {
                    this.setPreStartState();
                }
            });

            if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleOverlay(els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') {
                        this.startGame();
                    } else {
                        this.setPreStartState();
                    }
                });
            }

            if (els.modeToggleRadios) els.modeToggleRadios.forEach((radio) => {
                radio.addEventListener('change', (e) => {
                    this.updateSettingsView(e.target.value);
                });
            });

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

            if (els.validateBtn) {
                els.validateBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.validateChoice();
                });
                els.validateBtn.addEventListener('pointerdown', (e) => e.stopPropagation());
            }

            if (els.pickerRoot) {
                els.pickerRoot.addEventListener('pointerdown', (e) => e.stopPropagation());
            }

            if (els.gameArea) els.gameArea.addEventListener('pointerdown', (e) => {
                if (e.target.closest('button') || e.target.closest('#settings-panel')) return;

                if (this.state.currentState === 'PRE_START') {
                    this.startGame();
                } else if (this.state.currentState === 'FEEDBACK' && !this.state.actionTimeout) {
                    this.advanceFromFeedback();
                }
            });

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel?.classList.contains('panel-hidden');
                const isOverVisible = els.overlayOver?.classList.contains('visible');

                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();

                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }

                if (e.code === 'Space') {
                    if (isMenuOpen) {
                        e.preventDefault();
                        if (els.saveSettings) els.saveSettings.click();
                    } else if (isOverVisible) {
                        e.preventDefault();
                        this.toggleOverlay(els.overlayOver, false);
                        if (this.state.gameMode === 'sandbox') {
                            this.startGame();
                        } else {
                            this.setPreStartState();
                        }
                    } else if (this.state.currentState === 'PRE_START') {
                        e.preventDefault();
                        this.startGame();
                    } else if (this.state.currentState === 'PICK') {
                        e.preventDefault();
                        this.validateChoice();
                    } else if (this.state.currentState === 'FEEDBACK' && !this.state.actionTimeout) {
                        e.preventDefault();
                        this.advanceFromFeedback();
                    }
                }

                if (e.code === 'Enter') {
                    if (isMenuOpen) {
                        e.preventDefault();
                        if (els.saveSettings) els.saveSettings.click();
                    } else if (isOverVisible) {
                        e.preventDefault();
                        this.toggleOverlay(els.overlayOver, false);
                        if (this.state.gameMode === 'sandbox') {
                            this.startGame();
                        } else {
                            this.setPreStartState();
                        }
                    } else if (this.state.currentState === 'PRE_START') {
                        e.preventDefault();
                        this.startGame();
                    } else if (this.state.currentState === 'PICK') {
                        e.preventDefault();
                        this.validateChoice();
                    } else if (this.state.currentState === 'FEEDBACK' && !this.state.actionTimeout) {
                        e.preventDefault();
                        this.advanceFromFeedback();
                    }
                }
            });

            if (els.settingsToggle) els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch((err) => console.error(err));
                    if (els.settingsPanel && els.settingsPanel.classList.contains('panel-hidden')) {
                        this.toggleSettings();
                    }
                } else {
                    this.toggleSettings();
                }
            });

            if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

            if (els.saveSettings) {
                els.saveSettings.addEventListener('click', () => {
                    const checked = document.querySelector('input[name="mode-toggle"]:checked');
                    const selectedMode = checked ? checked.value : 'ranked';
                    this.state.gameMode = selectedMode;
                    window.history.replaceState(null, '', `?mode=${selectedMode}`);

                    if (els.lifePoolSelect) {
                        localStorage.setItem('chromatic_memory_life_pool', els.lifePoolSelect.value);
                        this.state.savedLifePool = els.lifePoolSelect.value;
                    }

                    if (els.sandboxMemorizeMs) {
                        const memRaw = els.sandboxMemorizeMs.value;
                        const memMs = clampMemorizeMs(memRaw);
                        els.sandboxMemorizeMs.value = String(memMs);
                        this.state.savedSandboxMemorizeMs = memMs;
                        localStorage.setItem('chromatic_memory_memorize_ms', String(memMs));
                    }

                                        const configKey = `chromatic_memory_ranked_${this.state.maxGauge}`;
                    this.preloadDistributionData(configKey);
                    this.toggleSettings(true);

                    if (this.state.gameMode === 'sandbox') {
                        this.startGame();
                    } else {
                        this.setPreStartState();
                    }
                });
            }

            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel?.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel?.contains(e.target) || els.settingsToggle?.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });

            window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
            });
        }
    };

    CouleurGame.init();

    if (typeof window.updateTranslations === 'function') {
        window.updateTranslations();
    }
});