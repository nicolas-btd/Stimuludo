

const aimTranslations = {
    fr: {
        header_title: "Visée de cibles",
        intro: {
            title: "Visée de cibles",
            desc: "Visez les cibles aussi vite que possible. Cliquez avec précision.",
            best_score: "MEILLEUR SCORE",
            start: "COMMENCER",
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            time: "Temps :",
            difficulty: "Taille des Cibles :",
            diameter: "Diamètre Cible :",

                        cosmetics_title: "Apparence (Globale)",
            skin: "Apparence Cible :",
            skin_empty: "Contour uniquement", 
            skin_smalldot: "Contour + Point fin",
            skin_reticle: "Viseur (Croix fine)", 
            skin_reticle_circle: "Viseur + Cercle concentrique",

                        cursor: "Viseur (Souris) :",
            cursor_crosshair: "Croix (Défaut)",
            cursor_dot: "Point Simple",
            cursor_size: "Taille Viseur :", 

            options_title: "Options Libres",
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
            score: "Cibles Touchées",
            precision: "Dispersion des Tirs",
            accuracy: "Précision Globale",
            speed: "Vitesse",
            avg_react: "Réactivité Moy.",
            best: "Meilleur",
            you: "Vous",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "TARGET AIMING",
        intro: {
            title: "Target Aiming",
            desc: "Aim at targets as fast as possible.",
            best_score: "BEST SCORE",
            start: "START",
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            time: "Time:",
            difficulty: "Target Size:",
            diameter: "Target Size:",

                        cosmetics_title: "Cosmetics (Global)",
            skin: "Target Skin:",
            skin_empty: "Outline only",
            skin_smalldot: "Outline + Fine dot",
            skin_reticle: "Reticle (Thin cross)",
            skin_reticle_circle: "Reticle + Concentric circle",

                        cursor: "Cursor Style:",
            cursor_crosshair: "Crosshair (Default)",
            cursor_dot: "Simple Dot",
            cursor_size: "Cursor Size:", 

            options_title: "Sandbox Options",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            ready: "Ready?",
            or: "or",
            to_start: "to start"
        },
        results: {
            new_record: "NEW RECORD!",
            score: "Targets Hit",
            precision: "Shot Dispersion",
            accuracy: "Overall Accuracy",
            speed: "Speed",
            avg_react: "Avg Reactivity",
            best: "Best",
            you: "You",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.aim = aimTranslations.fr;
    translations.en.aim = aimTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, aimTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, aimTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {


        let audioCtx;
    const SoundEngine = {
        init() {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
        },
        getVolumeMultiplier() {
            const saved = localStorage.getItem('siteGlobalVolume');
            const vol = saved !== null ? parseInt(saved, 10) : 50;
            return vol / 100;
        },
        playHit() {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;
            this.init();
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t); 
            gain.gain.setValueAtTime(0.05 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.03);
        },
        playMiss() {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;
            this.init();
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, t);
            gain.gain.setValueAtTime(0.08 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.02);
        },
        playEnd() {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;
            this.init();
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, t);
            gain.gain.setValueAtTime(0.04 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.3);
        }
    };

    const AimGame = {
        state: {
            gameMode: 'ranked',
            score: 0,
            totalClicks: 0,
            timeLeft: 0,
            currentState: 'PRE_START',
            isActive: false,
            isPaused: false,
            isWaitingForFirstClick: true,
            timerId: null,
            targetSize: 50,

                        clickHistory: [], 
            hitTimes: [],
            currentTargetSpawnTime: 0,
            pauseStartTime: 0,

                        savedTimeRanked: 30,
            savedSizeRanked: 50,

                        savedTimeSandbox: 30,
            savedSizeSandbox: 60,

                        savedSkinGlobal: 'empty',
            savedCursorGlobal: 'crosshair',
            savedCursorSizeGlobal: 4,

                        distributionDataByConfig: {}
        },

        els: {
            workspace: document.getElementById('aim-workspace'),
            score: document.getElementById('score'),
            timer: document.getElementById('timer'),
            board: document.querySelector('.game-board'),
            statusOverlay: document.getElementById('status-overlay'),

                        pauseBtn: document.getElementById('pause-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'), 
            iconPause: document.getElementById('icon-pause'),
            iconPlay: document.getElementById('icon-play'),
            restartBtn: document.getElementById('restart-btn'),

                        fullscreenBtn: document.getElementById('fullscreen-btn'),
            iconExpand: document.getElementById('icon-expand'),
            iconCompress: document.getElementById('icon-compress'),

            overlayOver: document.getElementById('game-over-overlay'),

                        viewRanked: document.getElementById('results-ranked'),
            viewSandbox: document.getElementById('results-sandbox'),

                        rankedScore: document.getElementById('ranked-score'),
            sandboxScore: document.getElementById('sandbox-score'),

                        statAccuracy: document.getElementById('stat-accuracy'),
            statTpm: document.getElementById('stat-tpm'),
            statAvgReact: document.getElementById('stat-avg-react'),

            markerCurrent: document.getElementById('marker-current'),
            markerBest: document.getElementById('marker-best'),
            recordMsg: document.getElementById('new-record-msg'),
            analysisTarget: document.getElementById('analysis-target'),

                        settingsPanel: document.getElementById('settings-panel'),
            settingsToggle: document.getElementById('settings-toggle'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),

                        settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
            modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),

                        customCursor: document.getElementById('custom-cursor'),

            config: {
                sizeRanked: document.getElementById('size-ranked-val'),

                                timeSandbox: document.getElementById('time-val'),
                sizeSandbox: document.getElementById('target-size'),
                sizeSandboxVal: document.getElementById('target-size-val'),

                                skinGlobal: document.getElementById('skin-val'),
                cursorGlobal: document.getElementById('cursor-val'),
                cursorSizeGlobal: document.getElementById('cursor-size'), 
                cursorSizeGlobalVal: document.getElementById('cursor-size-val'),
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('time')) {
                this.state.savedTimeRanked = parseInt(params.get('time'), 10);
            }
            if (params.has('size')) {
                this.state.savedSizeRanked = parseInt(params.get('size'), 10);
            }
            if (params.has('display_mode')) {
                this.state.savedDisplayModeRanked = params.get('display_mode');
            }

            this.loadUserPreferences();
            this.loadBackgroundPreference();
            this.applyCursorTheme(); 
            this.bindEvents();

                        this.initSlidersVisual();

            if (this.els.recordMsg && this.els.viewRanked) {
                this.els.viewRanked.insertBefore(this.els.recordMsg, this.els.viewRanked.firstChild);
                this.els.recordMsg.style.minHeight = '24px';
                this.els.recordMsg.style.marginTop = '0px';
                this.els.recordMsg.style.marginBottom = '15px';
                this.els.recordMsg.style.width = '100%';
                this.els.recordMsg.style.textAlign = 'center';
                this.els.recordMsg.classList.remove('hidden');
                this.els.recordMsg.style.visibility = 'hidden';
                this.els.recordMsg.style.opacity = '0';
                this.els.recordMsg.style.transition = 'opacity 0.3s ease';
            }

            this.setPreStartState();
            this.preloadDistributionData();

                        window.addEventListener('resize', () => {
                if(this.state.isActive) {
                    const target = this.els.workspace.querySelector('.aim-target');
                    if(target) this.ensureTargetInBounds(target);
                }
            });
        },

        getDisplayMode() {
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || this.els.board.classList.contains('ios-fullscreen');
            return isFullscreen ? 'fullscreen' : 'windowed';
        },

        initSlidersVisual() {
            const sliders = document.querySelectorAll('.slider');
            sliders.forEach(s => this.updateSliderVisual(s));
        },

        updateSliderVisual(slider) {
            const min = parseInt(slider.min) || 0;
            const max = parseInt(slider.max) || 100;
            const val = parseInt(slider.value);
            const percentage = ((val - min) / (max - min)) * 100;
            slider.style.setProperty('--val-percent', percentage + '%');
        },

        loadUserPreferences() {
            const c = this.els.config;
            const sSizeR = localStorage.getItem('aim_size_ranked');
            if (sSizeR !== null) { if(c.sizeRanked) c.sizeRanked.value = sSizeR; this.state.savedSizeRanked = parseInt(sSizeR); }
            const sTimeS = localStorage.getItem('aim_time_sandbox');
            if (sTimeS !== null) { if(c.timeSandbox) c.timeSandbox.value = sTimeS; this.state.savedTimeSandbox = parseInt(sTimeS); }
            const sSizeS = localStorage.getItem('aim_size_sandbox');
            if (sSizeS !== null) {
                if(c.sizeSandbox) c.sizeSandbox.value = sSizeS;
                if(c.sizeSandboxVal) c.sizeSandboxVal.value = sSizeS; 
                this.state.savedSizeSandbox = parseInt(sSizeS);
            }
            const sSkin = localStorage.getItem('aim_skin_global');
            if (sSkin !== null) { if(c.skinGlobal) c.skinGlobal.value = sSkin; this.state.savedSkinGlobal = sSkin; }
            const sCursor = localStorage.getItem('aim_cursor_global');
            if (sCursor !== null) { if(c.cursorGlobal) c.cursorGlobal.value = sCursor; this.state.savedCursorGlobal = sCursor; }
            const sCursorSize = localStorage.getItem('aim_cursor_size_global');
            if (sCursorSize !== null) {
                if(c.cursorSizeGlobal) c.cursorSizeGlobal.value = sCursorSize;
                if(c.cursorSizeGlobalVal) c.cursorSizeGlobalVal.value = sCursorSize;
                this.state.savedCursorSizeGlobal = parseFloat(sCursorSize);
            }
        },

        restoreConfigUI() {
            const c = this.els.config;
            if(c.sizeRanked) c.sizeRanked.value = this.state.savedSizeRanked;
            if(c.timeSandbox) c.timeSandbox.value = this.state.savedTimeSandbox;
            if(c.sizeSandbox) c.sizeSandbox.value = this.state.savedSizeSandbox;
            if(c.sizeSandboxVal) c.sizeSandboxVal.value = this.state.savedSizeSandbox;
            if(c.skinGlobal) c.skinGlobal.value = this.state.savedSkinGlobal;
            if(c.cursorGlobal) c.cursorGlobal.value = this.state.savedCursorGlobal;
            if(c.cursorSizeGlobal) c.cursorSizeGlobal.value = this.state.savedCursorSizeGlobal;
            if(c.cursorSizeGlobalVal) c.cursorSizeGlobalVal.value = this.state.savedCursorSizeGlobal;

                        const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if(activeRadio) activeRadio.checked = true;
            this.updateSettingsView(this.state.gameMode);

            this.initSlidersVisual();
        },

        updateSettingsView(mode) {
            if (mode === 'ranked') {
                this.els.settingsGroupRanked.style.display = 'block';
                this.els.settingsGroupSandbox.style.display = 'none';
            } else {
                this.els.settingsGroupRanked.style.display = 'none';
                this.els.settingsGroupSandbox.style.display = 'block';
            }
        },

        applyCursorTheme() {
            const type = this.state.savedCursorGlobal;
            const size = this.state.savedCursorSizeGlobal;
            const cursorEl = this.els.customCursor;
            document.documentElement.style.setProperty('--cursor-size', size + 'px');
            cursorEl.classList.remove('cursor-crosshair', 'cursor-dot');
            cursorEl.classList.add(`cursor-${type}`);
        },

        loadBackgroundPreference() {
            const savedOpaque = localStorage.getItem('globalOpaque');
            const isOpaque = savedOpaque === 'true' || savedOpaque === null; 
            if(isOpaque) document.documentElement.classList.add('global-opaque');
            else document.documentElement.classList.remove('global-opaque');
            this.toggleBackground(isOpaque);
        },

        toggleBackground(isOpaque) {
            if(isOpaque) {
                this.els.board.classList.add('opaque-mode');
                this.els.settingsPanel.classList.add('opaque-mode');
            } else {
                this.els.board.classList.remove('opaque-mode');
                this.els.settingsPanel.classList.remove('opaque-mode');
            }
        },

        setPreStartState() {
            this.resetTimer(); 
            this.state.isActive = false;
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

            this.els.statusOverlay.classList.add('hidden');
            this.els.workspace.innerHTML = '';

                        this.els.score.textContent = "0";
            const timeSetting = this.state.gameMode === 'ranked' ? 30 : this.state.savedTimeSandbox;
            this.els.timer.textContent = timeSetting > 0 ? timeSetting : "∞";

            if (this.state.gameMode === 'ranked') {
                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = 'visible';
            }

            this.state.targetSize = this.state.gameMode === 'ranked' ? this.state.savedSizeRanked : this.state.savedSizeSandbox;
            this.spawnTarget(true); 
        },

        startGame() {
            this.state.currentState = 'PLAYING';
            this.els.statusOverlay.classList.add('hidden');

            this.state.score = 1; 
            this.state.totalClicks = 1; 
            this.state.clickHistory = [];
            this.state.hitTimes = [];
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.isWaitingForFirstClick = false; 

                        this.els.score.textContent = "1";

                        this.updatePauseIcon();
            this.resetTimer();

            const timeSetting = this.state.gameMode === 'ranked' ? 30 : this.state.savedTimeSandbox;
            this.state.timeLeft = timeSetting > 0 ? timeSetting : 0;

                        this.startTimer(timeSetting === 0);
            this.updateTimerUI();

            this.spawnTarget(false);
        },

        spawnTarget(forceCenter = false) {
            if (!forceCenter && !this.state.isActive) return;

            const ws = this.els.workspace;
            const wsRect = ws.getBoundingClientRect();
            const size = this.state.targetSize;

                        let x, y;

            if (forceCenter) {
                x = (wsRect.width / 2) - (size / 2);
                y = (wsRect.height / 2) - (size / 2);
            } else {
                const maxX = wsRect.width - size;
                const maxY = wsRect.height - size;
                x = Math.floor(Math.random() * maxX);
                y = Math.floor(Math.random() * maxY);
            }

            const target = document.createElement('div');
            const currentSkin = this.state.savedSkinGlobal;
            target.className = `aim-target skin-${currentSkin}`;
            target.style.setProperty('--target-diameter', size + 'px');
            target.style.width = size + 'px';
            target.style.height = size + 'px';
            target.style.left = x + 'px';
            target.style.top = y + 'px';

                        target.addEventListener('mousedown', (e) => {
                if (this.state.currentState === 'PRE_START') {
                    SoundEngine.init();
                    SoundEngine.playHit();
                    this.startGame();
                } else {
                    this.handleHit(e, target);
                }
            });

            target.addEventListener('touchstart', (e) => {
                e.preventDefault(); 
                if (this.state.currentState === 'PRE_START') {
                    SoundEngine.init();
                    SoundEngine.playHit();
                    this.startGame();
                } else {
                    this.handleHit(e.touches[0], target);
                }
            }, {passive: false});

            ws.innerHTML = '';
            ws.appendChild(target);
            this.state.currentTargetSpawnTime = performance.now();
        },

        handleHit(e, target) {
            if(this.state.isPaused) return;

                        SoundEngine.playHit();

            const hitTime = (performance.now() - this.state.currentTargetSpawnTime) / 1000;
            if (!this.state.isWaitingForFirstClick) {
                this.state.hitTimes.push(hitTime);
            }
            const rect = target.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const diffX = e.clientX - centerX;
            const diffY = e.clientY - centerY;
            const radius = rect.width / 2;
            const normX = diffX / radius;
            const normY = diffY / radius;
            this.state.clickHistory.push({ x: normX, y: normY });
            this.state.score++;
            this.els.score.textContent = this.state.score;
            target.classList.add('hit');
            setTimeout(() => {
                if(this.state.isActive) this.spawnTarget(false);
            }, 50); 
        },

        ensureTargetInBounds(target) {
            const wsRect = this.els.workspace.getBoundingClientRect();
            const size = this.state.targetSize;
            let left = parseInt(target.style.left);
            let top = parseInt(target.style.top);
            if (left + size > wsRect.width) target.style.left = (wsRect.width - size) + 'px';
            if (top + size > wsRect.height) target.style.top = (wsRect.height - size) + 'px';
        },

        async endGame() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';
            clearInterval(this.state.timerId);

                        SoundEngine.playEnd();

            const displayMode = this.getDisplayMode();

            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = this.state.score;

                                this.saveScoreToDatabase(this.state.score, this.state.savedTimeRanked, this.state.savedSizeRanked, displayMode);

                                const recordKey = `aim_best_ranked_${this.state.savedTimeRanked}_${this.state.savedSizeRanked}_${displayMode}`;

                                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                                if (best === null || this.state.score > best) {
                    best = this.state.score;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.savedTimeRanked, this.state.savedSizeRanked, displayMode);
                }

                                if (isRecord && savedBest !== null) {
                    if(this.els.recordMsg) {
                        this.els.recordMsg.style.visibility = 'visible';
                        this.els.recordMsg.style.opacity = '1';
                    }
                } else {
                    if(this.els.recordMsg) {
                        this.els.recordMsg.style.visibility = 'hidden';
                        this.els.recordMsg.style.opacity = '0';
                    }
                }
                const configKey = `${this.state.savedTimeRanked}_${this.state.savedSizeRanked}_${displayMode}`;
                await this.drawDistributionChart(this.state.score, best, configKey);
                this.preloadDistributionData(configKey);
            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                if(this.els.recordMsg) {
                    this.els.recordMsg.style.visibility = 'hidden';
                    this.els.recordMsg.style.opacity = '0';
                }
                this.els.sandboxScore.textContent = this.state.score;
                const totalClicks = this.state.totalClicks > 0 ? this.state.totalClicks : this.state.score;
                const accuracy = totalClicks > 0 ? ((this.state.score / totalClicks) * 100).toFixed(1) : 0;
                let timePlayed = this.state.savedTimeSandbox > 0 ? this.state.savedTimeSandbox : this.state.timeLeft;
                const tpm = timePlayed > 0 ? Math.round((this.state.score / timePlayed) * 60) : 0;
                let avgReact = 0;
                if (this.state.hitTimes.length > 0) {
                    const sum = this.state.hitTimes.reduce((a,b) => a+b, 0);
                    avgReact = (sum / this.state.hitTimes.length).toFixed(3);
                }
                if(this.els.statAccuracy) this.els.statAccuracy.textContent = `${accuracy}%`;
                if(this.els.statTpm) this.els.statTpm.textContent = `${tpm} /min`;
                if(this.els.statAvgReact) this.els.statAvgReact.textContent = `${avgReact}s`;
                this.renderAnalysis();
            }
            this.toggleOverlay(this.els.overlayOver, true);
        },

        renderAnalysis() {
            const container = this.els.analysisTarget;
            container.innerHTML = '<div class="analysis-center"></div>';
            const history = this.state.clickHistory;
            history.forEach(pt => {
                const dot = document.createElement('div');
                dot.className = 'impact-point';
                const leftP = 50 + (pt.x * 50);
                const topP = 50 + (pt.y * 50);
                dot.style.left = `${leftP}%`;
                dot.style.top = `${topP}%`;
                container.appendChild(dot);
            });
        },
        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },


        async saveScoreToDatabase(score, time, size, displayMode) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: score }, '*');
                return;
            }
            try {
                await fetch('/api/scores', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'target_aiming', score: score, details: { time: time, size: size, display_mode: displayMode }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, time, size, displayMode) {
            try {
                await fetch('/api/best', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `aim_ranked_${time}_${size}_${displayMode}`, score: score, details: { time: time, size: size, display_mode: displayMode }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error(error); }
        },

        async preloadDistributionData(configKey) {
            if (!configKey) {
                const displayMode = this.getDisplayMode();
                configKey = `${this.state.savedTimeRanked}_${this.state.savedSizeRanked}_${displayMode}`;
            }
            const parts = configKey.split('_');
            const time = parts[0];
            const size = parts[1];
            const displayMode = parts[2];

            try {
                const res = await fetch(`/api/scores/distribution/target_aiming?time=${time}&size=${size}&display_mode=${displayMode}`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (res.ok) {
                    this.state.distributionDataByConfig[configKey] = await res.json();
                } else {
                    this.state.distributionDataByConfig[configKey] = [];
                }
            } catch(e) {
                console.error(e);
                this.state.distributionDataByConfig[configKey] = [];
            }
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
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
            if (bestScore !== null && currentScore === bestScore) {
                this.els.markerCurrent.style.display = 'none';
            } else if (currentScore !== null) {
                this.els.markerCurrent.style.display = 'block';
                this.els.markerCurrent.style.left = `${currentPercent}%`;
                this.els.markerCurrent.innerHTML = `<div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div><div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">${currentScore}</div>`;
            } else {
                this.els.markerCurrent.style.display = 'none';
            }

            if (bestScore !== null) {
                this.els.markerBest.classList.remove('hidden');
                this.els.markerBest.style.left = `${bestPercent}%`;
                this.els.markerBest.innerHTML = `<div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);"><svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/></svg></div><div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div><div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">${bestScore}</div>`;
            } else {
                this.els.markerBest.classList.add('hidden');
            }
            const tooltip = this.els.viewRanked.querySelector('.chart-tooltip');
            const hoverLine = this.els.viewRanked.querySelector('.hover-line');
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
        },

        startTimer(countUp = false) {
            this.updateTimerUI();
            this.state.timerId = setInterval(() => {
                if(countUp) this.state.timeLeft++;
                else this.state.timeLeft--;
                this.updateTimerUI();
                if (!countUp && this.state.timeLeft <= 0) {
                    this.state.timeLeft = 0;
                    this.updateTimerUI();
                    this.endGame();
                }
            }, 1000);
        },

                resetTimer() {
            clearInterval(this.state.timerId);
        },

                updateTimerUI() {
            const timeSetting = this.state.gameMode === 'ranked' ? 30 : this.state.savedTimeSandbox;
            if (timeSetting > 0 || this.state.isActive) this.els.timer.textContent = this.state.timeLeft;
            else this.els.timer.textContent = "∞";
        },

        togglePause() {
            if (!this.state.isActive || this.state.isWaitingForFirstClick || this.state.gameMode === 'ranked') return;

                        this.state.isPaused = !this.state.isPaused;

            if (this.state.isPaused) {
                clearInterval(this.state.timerId);
                this.state.pauseStartTime = performance.now();
                this.els.pauseBtn.classList.add('btn-paused-active');
            } else {
                const timeSetting = this.state.gameMode === 'ranked' ? 30 : this.state.savedTimeSandbox;
                this.startTimer(timeSetting === 0);

                                const pauseDuration = performance.now() - this.state.pauseStartTime;
                this.state.currentTargetSpawnTime += pauseDuration;

                this.els.pauseBtn.classList.remove('btn-paused-active');
            }
            this.updatePauseIcon();
        },

        updatePauseIcon() {
            if (this.state.isPaused) {
                this.els.iconPause.classList.add('hidden');
                this.els.iconPlay.classList.remove('hidden');
            } else {
                this.els.iconPlay.classList.add('hidden');
                this.els.iconPause.classList.remove('hidden');
            }
        },

        toggleOverlay(el, show) {
            if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
            else { el.classList.remove('visible'); el.classList.add('hidden'); }
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
            const isHidden = panel.classList.contains('panel-hidden');

                        if (forceClose || !isHidden) {
                this.restoreConfigUI();
                panel.classList.remove('panel-visible');
                panel.classList.add('panel-hidden');

                if (this.state.gameMode === 'sandbox' && this.state.isActive && this.state.isPaused) {
                    this.togglePause();
                }
            } else {
                this.restoreConfigUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');

                if (this.state.gameMode === 'sandbox' && this.state.isActive && !this.state.isPaused && !this.state.isWaitingForFirstClick) {
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
                this.els.iconExpand.classList.add('hidden');
                this.els.iconCompress.classList.remove('hidden');
            } else {
                this.els.iconCompress.classList.add('hidden');
                this.els.iconExpand.classList.remove('hidden');
            }
        },

        bindEvents() {
            const { els } = this;
            const customCursor = document.getElementById('custom-cursor');

            document.addEventListener('wheel', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                }
            }, { passive: false });

            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=')) {
                    e.preventDefault();
                }
            });

            els.modeToggleRadios.forEach(radio => {
                radio.addEventListener('change', (e) => this.updateSettingsView(e.target.value));
            });

            els.workspace.addEventListener('mousemove', (e) => {
                customCursor.style.display = 'block';
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';
            });
            els.workspace.addEventListener('mouseleave', () => customCursor.style.display = 'none');

            els.workspace.addEventListener('mousedown', (e) => {
                if (this.state.currentState === 'PRE_START') return;

                                if(this.state.isActive && !this.state.isPaused) {
                    this.state.totalClicks++;
                    if (!e.target.classList.contains('aim-target')) {
                        SoundEngine.playMiss();
                    }
                }
            });

            const syncSliders = (sliderEl, inputEl) => {
                if (!sliderEl || !inputEl) return;

                sliderEl.addEventListener('input', (e) => {
                    const val = e.target.value;
                    this.updateSliderVisual(e.target);
                    inputEl.value = val;
                    if (sliderEl.id === 'cursor-size') document.documentElement.style.setProperty('--cursor-size', val + 'px');
                });

                inputEl.addEventListener('input', (e) => {
                    let val = parseFloat(e.target.value);
                    const max = parseFloat(sliderEl.max);

                    if (!isNaN(val)) {
                        if (val > max) val = max; 
                        sliderEl.value = val;
                        this.updateSliderVisual(sliderEl);
                        if (sliderEl.id === 'cursor-size') document.documentElement.style.setProperty('--cursor-size', val + 'px');
                    }
                });

                inputEl.addEventListener('change', (e) => {
                    let val = parseFloat(e.target.value);
                    const min = parseFloat(sliderEl.min);
                    const max = parseFloat(sliderEl.max);

                    if (isNaN(val) || val < min) val = min;
                    if (val > max) val = max;

                                        inputEl.value = val;
                    sliderEl.value = val;
                    this.updateSliderVisual(sliderEl);
                    if (sliderEl.id === 'cursor-size') document.documentElement.style.setProperty('--cursor-size', val + 'px');
                });
            };

            syncSliders(els.config.cursorSizeGlobal, els.config.cursorSizeGlobalVal);
            if(els.config.sizeSandbox) syncSliders(els.config.sizeSandbox, els.config.sizeSandboxVal);

                        els.restartBtn.addEventListener('click', () => {
                this.setPreStartState();
            });

                        if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.setPreStartState();
                });
            }

                        els.pauseBtn.addEventListener('click', () => this.togglePause());

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

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = this.els.settingsPanel.classList.contains('panel-visible');
                const isGameOver = this.els.overlayOver.classList.contains('visible'); 

                                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();
                if (e.code === 'Escape') { e.preventDefault(); this.toggleSettings(); }
                if (e.code === 'Space' && this.state.isActive && !isMenuOpen) {
                    if(this.state.gameMode === 'sandbox') { 
                        e.preventDefault(); 
                        this.togglePause(); 
                        return; 
                    }
                }
                if (e.code === 'Enter' || e.code === 'Space') {
                    if (isMenuOpen && e.code === 'Enter') { 
                        e.preventDefault(); 
                        els.saveSettings.click(); 
                    } 
                    else if (isGameOver && e.code === 'Enter') { 
                        e.preventDefault(); 
                        this.setPreStartState();
                    }
                }
            });

            els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                    if (this.els.settingsPanel.classList.contains('panel-hidden')) this.toggleSettings();
                } else this.toggleSettings();
            });

                        if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

                        if (els.saveSettings) els.saveSettings.addEventListener('click', () => {
                const c = this.els.config;
                const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;
                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);

                                if(c.sizeRanked) {
                    localStorage.setItem('aim_size_ranked', c.sizeRanked.value);
                    this.state.savedSizeRanked = parseInt(c.sizeRanked.value);
                }

                                if(c.timeSandbox) {
                    localStorage.setItem('aim_time_sandbox', c.timeSandbox.value);
                    this.state.savedTimeSandbox = parseInt(c.timeSandbox.value) || 0;
                }
                if(c.sizeSandbox) {
                    localStorage.setItem('aim_size_sandbox', c.sizeSandbox.value);
                    this.state.savedSizeSandbox = parseInt(c.sizeSandbox.value);
                }

                                if(c.skinGlobal) {
                    localStorage.setItem('aim_skin_global', c.skinGlobal.value);
                    this.state.savedSkinGlobal = c.skinGlobal.value;
                }
                if(c.cursorGlobal) {
                    localStorage.setItem('aim_cursor_global', c.cursorGlobal.value);
                    this.state.savedCursorGlobal = c.cursorGlobal.value;
                }
                if(c.cursorSizeGlobal) {
                    localStorage.setItem('aim_cursor_size_global', c.cursorSizeGlobal.value); 
                    this.state.savedCursorSizeGlobal = parseFloat(c.cursorSizeGlobal.value);
                }

                                this.preloadDistributionData();

                this.applyCursorTheme(); 
                this.toggleSettings(true);

                                this.setPreStartState();
            });

            document.addEventListener('click', (e) => {
                const menuVisible = els.settingsPanel.classList.contains('panel-visible');
                const clickedInside = els.settingsPanel.contains(e.target) || els.settingsToggle.contains(e.target);
                if (menuVisible && !clickedInside) this.toggleSettings(true);
            });

                        window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') this.loadBackgroundPreference();
            });
        }
    };

    AimGame.init();
});