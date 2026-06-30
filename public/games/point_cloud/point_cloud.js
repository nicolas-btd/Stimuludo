

const pcTranslations = {
    fr: {
        header_title: "Nuage de Points",
        intro: {
            title: "Nuage de Points",
            desc: "Estimez rapidement le nombre de points affichés.",
            best_score: "MEILLEUR SCORE",
            start: "COMMENCER",
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            pts_20: "20 points",
            pts_50: "50 points",
            pts_100: "100 points",
            title: "Configuration",
            rounds: "Nombre d'essais :",
            rounds_sandbox: "Essais :",
            flash_time: "Durée du flash :",
            max_points: "Points maximum :",
            options_title: "Options Libres",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            prompt: "Quel était le nombre ?",
            submit: "Valider"
        },
        feedback: {
            target: "Cible :",
            estimate: "Estimation :",
            gap: "Écart :",
            continue: "Appuyez sur Entrée pour passer",
            skipping: "Passage au tour suivant..."
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            score_sec: "Score Élo-Cognitif (SEC)",
            subitizing: "Seuil Subitizing",
            weber: "Fraction Weber",
            latency: "Latence Cogn.",
            bias: "Biais Direct.",
            heatmap: "Précision vs Quantité",
            best: "Meilleur",
            you: "Vous",
            top: "TOP",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "POINT CLOUD",
        intro: {
            title: "Point Cloud",
            desc: "Estimate the number of points displayed as fast as possible.",
            best_score: "BEST SCORE",
            start: "START",
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            pts_20: "20 points",
            pts_50: "50 points",
            pts_100: "100 points",
            title: "Settings",
            rounds: "Rounds:",
            rounds_sandbox: "Rounds:",
            flash_time: "Flash Duration:",
            max_points: "Max Points:",
            options_title: "Sandbox Options",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            prompt: "What was the number?",
            submit: "Submit"
        },
        feedback: {
            target: "Target:",
            estimate: "Estimation:",
            gap: "Gap:",
            continue: "Press Enter to skip",
            skipping: "Next round starting..."
        },
        results: {
            new_record: "NEW RECORD!",
            score_sec: "Cognitive Elo Score (SEC)",
            subitizing: "Subitizing Threshold",
            weber: "Weber Fraction",
            latency: "Cognitive Latency",
            bias: "Directional Bias",
            heatmap: "Accuracy vs Quantity",
            best: "Best",
            you: "You",
            top: "TOP",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.pc = pcTranslations.fr;
    translations.en.pc = pcTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, pcTranslations[lang])
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, pcTranslations.en);
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

        playFlash() {
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

        playInput() {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;

            this.init();

            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, t);

            gain.gain.setValueAtTime(0.02 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(t);
            osc.stop(t + 0.05);
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

    const PointCloudGame = {
        state: {
            gameMode: 'ranked',
            score: 0,
            currentRound: 0,
            maxRounds: 10,
            currentState: 'PRE_START',
            isActive: false,
            isPaused: false,
            actionTimeout: null,

            savedRoundsRanked: 10,
            savedFlashRanked: 200,
            savedMaxPointsRanked: 20,

            savedRoundsSandbox: 10,
            savedFlashSandbox: 300,
            savedMaxPointsSandbox: 20,

            currentPoints: 0,
            inputStartTime: 0,
            firstDigitTime: 0,
            currentInputValue: '',

            trials: [],
            distributionDataByConfig: {}
        },

        els: {
            workspace: document.getElementById('pc-workspace'),
            score: document.getElementById('score'),
            roundCounter: document.getElementById('round-counter'),
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

            statSubitizing: document.getElementById('stat-subitizing'),
            statWeber: document.getElementById('stat-weber'),
            statLatency: document.getElementById('stat-latency'),
            statBias: document.getElementById('stat-bias'),

            markerCurrent: document.getElementById('marker-current'),
            markerBest: document.getElementById('marker-best'),
            recordMsg: document.getElementById('new-record-msg'),
            heatmapContainer: document.getElementById('heatmap-container'),

            settingsPanel: document.getElementById('settings-panel'),
            settingsToggle: document.getElementById('settings-toggle'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),

            settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
            modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),

            config: {
                pointsRanked: document.getElementById('points-ranked-val'),
                roundsSandbox: document.getElementById('rounds-sandbox-val'),
                flashSandbox: document.getElementById('flash-time-val'),
                flashSandboxInput: document.getElementById('flash-time-input'),
                pointsSandbox: document.getElementById('max-points-val'),
                pointsSandboxInput: document.getElementById('max-points-input')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('attempts')) {
                this.state.savedRoundsRanked = parseInt(params.get('attempts'), 10);
            }
            if (params.has('points')) {
                this.state.savedMaxPointsRanked = parseInt(params.get('points'), 10);
                localStorage.setItem('pc_points_ranked', params.get('points'));
            }

            this.loadUserPreferences();
            this.loadBackgroundPreference();
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


                                    const displayMode = this.getDisplayMode();
            this.preloadDistributionData(displayMode);
        },

        getDisplayMode() {
            const isFullscreen =
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement ||
                this.els.board.classList.contains('ios-fullscreen');

            return isFullscreen ? 'fullscreen' : 'windowed';
        },

        initSlidersVisual() {
            document.querySelectorAll('.slider').forEach(s => this.updateSliderVisual(s));
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

            const validRankedPoints = ['20', '50', '100'];
            const sPointsR = localStorage.getItem('pc_points_ranked');

                        if (sPointsR !== null && validRankedPoints.includes(sPointsR)) {
                c.pointsRanked.value = sPointsR;
                this.state.savedMaxPointsRanked = parseInt(sPointsR);
            } else {
                c.pointsRanked.value = '20';
                this.state.savedMaxPointsRanked = 20;
            }

            const sRoundsS = localStorage.getItem('pc_rounds_sandbox');
            if (sRoundsS !== null) {
                c.roundsSandbox.value = sRoundsS;
                this.state.savedRoundsSandbox = parseInt(sRoundsS);
            }

            const sFlashS = localStorage.getItem('pc_flash_sandbox');
            if (sFlashS !== null) {
                c.flashSandbox.value = sFlashS;
                if (c.flashSandboxInput) c.flashSandboxInput.value = sFlashS;
                this.state.savedFlashSandbox = parseInt(sFlashS);
            }

            const sPointsS = localStorage.getItem('pc_points_sandbox');
            if (sPointsS !== null) {
                c.pointsSandbox.value = sPointsS;
                if (c.pointsSandboxInput) c.pointsSandboxInput.value = sPointsS;
                this.state.savedMaxPointsSandbox = parseInt(sPointsS);
            }
        },

        restoreConfigUI() {
            const c = this.els.config;

            c.pointsRanked.value = String(this.state.savedMaxPointsRanked);
            c.roundsSandbox.value = this.state.savedRoundsSandbox;
            c.flashSandbox.value = this.state.savedFlashSandbox;
            if (c.flashSandboxInput) c.flashSandboxInput.value = this.state.savedFlashSandbox;
            c.pointsSandbox.value = this.state.savedMaxPointsSandbox;
            if (c.pointsSandboxInput) c.pointsSandboxInput.value = this.state.savedMaxPointsSandbox;

            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if (activeRadio) activeRadio.checked = true;

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

        setPreStartState() {
            clearTimeout(this.state.actionTimeout);

            this.state.isActive = false;
            this.state.isPaused = false;
            this.state.currentState = 'PRE_START';

            this.toggleOverlay(this.els.overlayOver, false);

            const mainText = getGameText('game.ready');
            const orText = getGameText('game.or') || 'ou';
            const startText = getGameText('game.to_start') || 'pour commencer';

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
            this.els.workspace.innerHTML = '';
            this.els.score.textContent = '0';

            this.state.maxRounds = this.state.gameMode === 'ranked'
                ? this.state.savedRoundsRanked
                : this.state.savedRoundsSandbox;

            this.state.currentRound = 0;
            this.updateRoundsUI();

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
        },

        startGame() {
            this.els.statusOverlay.classList.add('hidden');

            this.state.score = 0;
            this.state.trials = [];
            this.state.isActive = true;
            this.state.isPaused = false;

            this.els.score.textContent = '0';

            this.updatePauseIcon();

            this.state.maxRounds = this.state.gameMode === 'ranked'
                ? this.state.savedRoundsRanked
                : this.state.savedRoundsSandbox;

            this.state.currentRound = 0;
            this.updateRoundsUI();

            this.runNextTrial();
        },

        updateRoundsUI() {
            if (this.state.maxRounds > 0) {
                this.els.roundCounter.textContent = `${this.state.currentRound} / ${this.state.maxRounds}`;
            } else {
                this.els.roundCounter.textContent = this.state.currentRound;
            }
        },

        runNextTrial() {
            if (!this.state.isActive || this.state.isPaused) return;

            if (this.state.maxRounds > 0 && this.state.currentRound >= this.state.maxRounds) {
                this.endGame();
                return;
            }

            this.state.currentRound++;
            this.updateRoundsUI();

            this.state.currentState = 'FIXATION';
            this.els.workspace.innerHTML = '<div class="pc-cross"></div>';

            this.state.actionTimeout = setTimeout(() => {
                if (this.state.isActive && !this.state.isPaused) {
                    this.showFlash();
                }
            }, 500);
        },

        showFlash() {
            this.state.currentState = 'FLASH';
            this.els.workspace.innerHTML = '';

            const maxP = this.state.gameMode === 'ranked'
                ? this.state.savedMaxPointsRanked
                : this.state.savedMaxPointsSandbox;

            this.state.currentPoints = Math.floor(Math.random() * (maxP - 2)) + 3;

            const wsRect = this.els.workspace.getBoundingClientRect();
            const padding = 20;

            for (let i = 0; i < this.state.currentPoints; i++) {
                const dot = document.createElement('div');
                dot.className = 'pc-dot';

                const x = padding + Math.random() * (wsRect.width - padding * 2);
                const y = padding + Math.random() * (wsRect.height - padding * 2);

                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;

                this.els.workspace.appendChild(dot);
            }

            SoundEngine.playFlash();

            const flashDuration = this.state.gameMode === 'ranked'
                ? this.state.savedFlashRanked
                : this.state.savedFlashSandbox;

            this.state.actionTimeout = setTimeout(() => {
                if (this.state.isActive && !this.state.isPaused) {
                    this.requestInput();
                }
            }, flashDuration);
        },

        requestInput() {
            this.state.currentState = 'INPUT';
            this.state.currentInputValue = '';

            const promptText = getGameText('game.prompt') || 'Quel était le nombre ?';
            const submitText = getGameText('game.submit') || 'Valider';

            this.els.workspace.innerHTML = `
                <div id="input-section">
                    <div class="input-prompt">${promptText}</div>
                    <input type="text" id="number-input" class="number-input" inputmode="numeric" pattern="[0-9]*" maxlength="3" autocomplete="off" autofocus onpaste="return false;" ondrop="return false;" oncontextmenu="return false;">
                    <button id="submit-answer-btn" class="primary-btn submit-btn">${submitText}</button>
                </div>
            `;

            this.state.inputStartTime = performance.now();
            this.state.firstDigitTime = 0;

            const numberInput = document.getElementById('number-input');
            const submitBtn = document.getElementById('submit-answer-btn');

            if (numberInput) {
                setTimeout(() => numberInput.focus(), 50);

                numberInput.addEventListener('keydown', (e) => {
                    if (this.state.firstDigitTime === 0 && e.key !== 'Enter') {
                        this.state.firstDigitTime = performance.now();
                    }

                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.state.currentInputValue = numberInput.value.trim();

                        if (this.state.currentInputValue.length > 0) {
                            this.evaluateTrial();
                        }
                    }
                });

                numberInput.addEventListener('input', (e) => {
                    const originalValue = e.target.value;
                    const sanitizedValue = originalValue.replace(/[^0-9]/g, '');

                    if (originalValue !== sanitizedValue) {
                        e.target.value = sanitizedValue;
                    }

                    if (sanitizedValue.length > this.state.currentInputValue.length) {
                        SoundEngine.playInput();
                    }

                    this.state.currentInputValue = sanitizedValue;
                });
            }

            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    if (numberInput) this.state.currentInputValue = numberInput.value.trim();

                    if (this.state.currentInputValue.length > 0) {
                        this.evaluateTrial();
                    }
                });
            }
        },

        evaluateTrial() {
            if (this.state.currentState !== 'INPUT') return;

            const estimated = parseInt(this.state.currentInputValue, 10);
            const actual = this.state.currentPoints;

            if (Number.isNaN(estimated)) return;

            const latency = this.state.firstDigitTime > 0
                ? (this.state.firstDigitTime - this.state.inputStartTime)
                : (performance.now() - this.state.inputStartTime);

            const relativeError = Math.abs(estimated - actual) / actual;
            const distance = Math.abs(estimated - actual);

            const maxScorePerRound = 100 / this.state.maxRounds;
            let trialScore = 0;

            if (distance === 0) {
                trialScore = maxScorePerRound;
            } else if (relativeError <= 0.5) {
                trialScore = maxScorePerRound * (1 - (relativeError / 0.5)); 
            } else {
                trialScore = 0; 
            }

            this.state.score += trialScore; 
            this.els.score.textContent = Math.round(this.state.score);

            this.state.trials.push({
                actual,
                estimated,
                latency,
                relativeError,
                directionalBias: (estimated - actual) / actual
            });

            this.showRoundFeedback(actual, estimated);
        },

        showRoundFeedback(actual, estimated) {
            this.state.currentState = 'ROUND_FEEDBACK';

            const gap = estimated - actual;
            const sign = gap > 0 ? '+' : '';
            const distanceText = `${sign}${gap}`;

            const relativeError = actual > 0 ? Math.abs(gap / actual) : 1;
            const mixRatio = Math.min(relativeError, 1) * 100;

            const distanceColor = gap === 0
                ? 'var(--accent-color)'
                : `color-mix(in srgb, var(--accent-color-secondary) ${mixRatio}%, var(--accent-color))`;

            this.els.workspace.innerHTML = `
                <div class="pc-instant-feedback" style="color: ${distanceColor};">
                    ${distanceText}
                </div>
            `;

            this.state.actionTimeout = setTimeout(() => {
                if (
                    this.state.isActive &&
                    !this.state.isPaused &&
                    this.state.currentState === 'ROUND_FEEDBACK'
                ) {
                    this.runNextTrial();
                }
            }, 1500);
        },

        async endGame() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';

            clearTimeout(this.state.actionTimeout);

            this.els.workspace.innerHTML = '';

            SoundEngine.playEnd();

            const displayMode = this.getDisplayMode();
            const finalScore = Math.round(this.state.score);

            if (this.els.ingameRestartBtn) {
                this.els.ingameRestartBtn.style.visibility = 'hidden';
            }

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = finalScore;

                this.saveScoreToDatabase(
                    finalScore,
                    this.state.savedRoundsRanked,
                    this.state.savedMaxPointsRanked,
                    displayMode
                );

                const recordKey = `pc_best_ranked_r${this.state.savedRoundsRanked}_p${this.state.savedMaxPointsRanked}_${displayMode}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                if (best === null || finalScore > best) {
                    best = finalScore;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;

                    this.saveBestScoreToDatabase(
                        best,
                        this.state.savedRoundsRanked,
                        this.state.savedMaxPointsRanked,
                        displayMode
                    );
                }

                if (isRecord && savedBest !== null) {
                    if (this.els.recordMsg) {
                        this.els.recordMsg.style.visibility = 'visible';
                        this.els.recordMsg.style.opacity = '1';
                    }
                } else {
                    if (this.els.recordMsg) {
                        this.els.recordMsg.style.visibility = 'hidden';
                        this.els.recordMsg.style.opacity = '0';
                    }
                }

                await this.drawDistributionChart(finalScore, best, displayMode);
                this.preloadDistributionData(displayMode);

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');

                if (this.els.recordMsg) {
                    this.els.recordMsg.style.visibility = 'hidden';
                    this.els.recordMsg.style.opacity = '0';
                }

                this.els.sandboxScore.textContent = finalScore;
                this.calculateSandboxStats();
            }

            this.toggleOverlay(this.els.overlayOver, true);
        },

        calculateSandboxStats() {
            if (this.state.trials.length === 0) return;

            let subitizing = 0;
            const limit = 8;

            for (let n = 3; n <= limit; n++) {
                const trialsForN = this.state.trials.filter(t => t.actual === n);

                if (trialsForN.length > 0 && trialsForN.every(t => t.estimated === t.actual)) {
                    subitizing = n;
                } else if (trialsForN.length > 0) {
                    break;
                }
            }

            const weber = this.state.trials.reduce((acc, t) => acc + t.relativeError, 0) / this.state.trials.length;
            const latency = this.state.trials.reduce((acc, t) => acc + t.latency, 0) / this.state.trials.length;
            const bias = this.state.trials.reduce((acc, t) => acc + t.directionalBias, 0) / this.state.trials.length;

            if (this.els.statSubitizing) this.els.statSubitizing.textContent = subitizing > 0 ? subitizing : '<3';
            if (this.els.statWeber) this.els.statWeber.textContent = weber.toFixed(2);
            if (this.els.statLatency) this.els.statLatency.textContent = (latency / 1000).toFixed(2) + 's';
            if (this.els.statBias) this.els.statBias.textContent = (bias > 0 ? '+' : '') + (bias * 100).toFixed(1) + '%';

            this.renderHeatmap();
        },

        renderHeatmap() {
            const container = this.els.heatmapContainer;
            container.innerHTML = '';

            const bins = {};

            this.state.trials.forEach(t => {
                const binKey = Math.floor(t.actual / 10) * 10;
                if (!bins[binKey]) bins[binKey] = [];
                bins[binKey].push(t);
            });

            const maxV = this.state.savedMaxPointsSandbox;

            let html = '';

            for (let i = 0; i < maxV; i += 10) {
                if (!bins[i]) continue;

                const avgAcc = 1 - (bins[i].reduce((acc, t) => acc + t.relativeError, 0) / bins[i].length);
                const safeAcc = Math.max(0, avgAcc) * 100;

                html += `
                    <div style="flex:1; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; margin: 0 2px;">
                        <div style="width:100%; height:${safeAcc}%; background:var(--accent-color); opacity: ${0.2 + (safeAcc / 100) * 0.8}; border-radius:4px 4px 0 0;"></div>
                        <span style="font-size:0.6rem; margin-top:4px; color:var(--text-secondary);">${i}-${i + 9}</span>
                    </div>
                `;
            }

            container.style.display = 'flex';
            container.style.alignItems = 'flex-end';
            container.innerHTML = html;
        },
        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },


        async saveScoreToDatabase(score, rounds, size, displayMode) {
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
                    body: JSON.stringify({
                        game_id: 'point_cloud',
                        score,
                        details: { rounds, size, display_mode: displayMode },
                        guest_id: this.getGuestId()
                    })
                });
            } catch (error) {
                console.error("Échec sauvegarde DB:", error);
            }
        },

        async saveBestScoreToDatabase(score, rounds, size, displayMode) {
            try {
                await fetch('/api/best', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        game_mode_key: `pc_ranked_r${rounds}_p${size}_${displayMode}`,
                        score,
                        details: { rounds, size, display_mode: displayMode },
                        guest_id: this.getGuestId()
                    })
                });
            } catch (error) {
                console.error(error);
            }
        },

        async preloadDistributionData(displayMode) {
            if (!displayMode) displayMode = this.getDisplayMode();
            const configKey = `pc_ranked_r${this.state.savedRoundsRanked}_p${this.state.savedMaxPointsRanked}_${displayMode}`;
            if (!this.state.distributionDataByConfig) this.state.distributionDataByConfig = {};

            try {
                const res = await fetch(`/api/scores/distribution/point_cloud?rounds=${this.state.savedRoundsRanked}&size=${this.state.savedMaxPointsRanked}&display_mode=${displayMode}`, {
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

        async drawDistributionChart(currentScore, bestScore, displayMode) {
            const configKey = `pc_ranked_r${this.state.savedRoundsRanked}_p${this.state.savedMaxPointsRanked}_${displayMode}`;
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
            if (maxX > 100 && maxData <= 100) maxX = 100;

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
                let d = getDensity(val);
                let px = ((val - minX) / range) * 100;
                let py = 100 - ((d / maxDensity) * 95);
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
                this.els.markerCurrent.innerHTML = `
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">
                        ${currentScore}
                    </div>
                `;
            } else {
                this.els.markerCurrent.style.display = 'none';
            }

            if (bestScore !== null) {
                this.els.markerBest.classList.remove('hidden');
                this.els.markerBest.style.left = `${bestPercent}%`;
                this.els.markerBest.innerHTML = `
                    <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);">
                        <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/></svg>
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

                                let percentile = clamp((areaToRight / totalArea) * 100, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                tooltip.style.left = `${percentX * 100}%`;
                tooltip.innerHTML = `<strong>${val}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                tooltip.classList.remove('hidden'); 
                hoverLine.style.left = `${percentX * 100}%`; 
                hoverLine.classList.remove('hidden');
            };
            distContainer.onmouseleave = () => { tooltip.classList.add('hidden'); hoverLine.classList.add('hidden'); };
        },

        togglePause() {
            if (!this.state.isActive || this.state.gameMode === 'ranked') return;

            this.state.isPaused = !this.state.isPaused;

            if (this.state.isPaused) {
                clearTimeout(this.state.actionTimeout);
                this.els.pauseBtn.classList.add('btn-paused-active');
            } else {
                this.els.pauseBtn.classList.remove('btn-paused-active');

                if (this.state.currentState === 'FIXATION') {
                    this.runNextTrial();
                } else if (this.state.currentState === 'FLASH') {
                    this.requestInput();
                } else if (this.state.currentState === 'ROUND_FEEDBACK') {
                    this.state.actionTimeout = setTimeout(() => {
                        if (
                            this.state.isActive &&
                            !this.state.isPaused &&
                            this.state.currentState === 'ROUND_FEEDBACK'
                        ) {
                            this.runNextTrial();
                        }
                    }, 1500);
                }
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
            if (!el) return;

            if (show) {
                el.classList.remove('hidden');
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
                el.classList.add('hidden');
            }
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

                if (this.state.gameMode === 'sandbox' && this.state.isActive && !this.state.isPaused) {
                    this.togglePause();
                }
            }
        },

        toggleFullscreen() {
            const elem = this.els.board;

            const isFullscreen =
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement ||
                elem.classList.contains('ios-fullscreen');

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

            document.addEventListener('wheel', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                }
            }, { passive: false });

            els.modeToggleRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.updateSettingsView(e.target.value);
                });
            });

            els.workspace.addEventListener('mousedown', () => {
                if (this.state.currentState === 'PRE_START') {
                    this.startGame();
                }
            });

            els.statusOverlay.addEventListener('mousedown', () => {
                if (this.state.currentState === 'PRE_START') {
                    this.startGame();
                }
            });

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = this.els.settingsPanel.classList.contains('panel-visible');
                const isGameOver = this.els.overlayOver.classList.contains('visible');
                const isInputActive = this.state.currentState === 'INPUT';

                if (e.key.toLowerCase() === 'f' && !isInputActive) {
                    this.toggleFullscreen();
                }

                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }

                if (this.state.currentState === 'PRE_START' && (e.code === 'Enter' || e.code === 'Space')) {
                    if (!isMenuOpen) {
                        e.preventDefault();
                        this.startGame();
                    }
                }

                if (this.state.currentState === 'ROUND_FEEDBACK' && (e.code === 'Enter' || e.code === 'Space')) {
                    if (!isMenuOpen) {
                        e.preventDefault();
                    }
                }

                if (e.code === 'Enter' || e.code === 'Space') {
                    if (isMenuOpen && e.code === 'Enter') {
                        e.preventDefault();
                        els.saveSettings.click();
                    } else if (isGameOver && e.code === 'Enter') {
                        e.preventDefault();
                        this.setPreStartState();
                    }
                }
            });

            const syncSliders = (sliderEl, inputEl) => {
                if (!sliderEl || !inputEl) return;

                sliderEl.addEventListener('input', (e) => {
                    const val = e.target.value;
                    this.updateSliderVisual(e.target);
                    inputEl.value = val;
                });

                inputEl.addEventListener('input', (e) => {
                    let val = parseFloat(e.target.value);
                    const max = parseFloat(sliderEl.max);

                    if (!isNaN(val)) {
                        if (val > max) val = max;
                        sliderEl.value = val;
                        this.updateSliderVisual(sliderEl);
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
                });
            };

            syncSliders(els.config.flashSandbox, els.config.flashSandboxInput);
            syncSliders(els.config.pointsSandbox, els.config.pointsSandboxInput);

            els.restartBtn.addEventListener('click', () => {
                this.setPreStartState();
            });

            if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.setPreStartState();
                });
            }

            els.pauseBtn.addEventListener('click', () => {
                this.togglePause();
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

            els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();

                if (document.fullscreenElement) {
                    document.exitFullscreen();

                    if (this.els.settingsPanel.classList.contains('panel-hidden')) {
                        this.toggleSettings();
                    }
                } else {
                    this.toggleSettings();
                }
            });

            if (els.closeSettings) {
                els.closeSettings.addEventListener('click', () => this.toggleSettings(true));
            }

            if (els.saveSettings) {
                els.saveSettings.addEventListener('click', () => {
                    const c = this.els.config;
                    const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;

                    this.state.gameMode = selectedMode;
                    window.history.replaceState(null, '', '?mode=' + selectedMode);

                    localStorage.setItem('pc_points_ranked', c.pointsRanked.value);
                    this.state.savedMaxPointsRanked = parseInt(c.pointsRanked.value);

                    localStorage.setItem('pc_rounds_sandbox', c.roundsSandbox.value);
                    localStorage.setItem('pc_flash_sandbox', c.flashSandbox.value);
                    localStorage.setItem('pc_points_sandbox', c.pointsSandbox.value);

                    this.state.savedRoundsSandbox = parseInt(c.roundsSandbox.value) || 0;
                    this.state.savedFlashSandbox = parseInt(c.flashSandbox.value);
                    this.state.savedMaxPointsSandbox = parseInt(c.pointsSandbox.value);

                                        const displayMode = this.getDisplayMode();
                    this.preloadDistributionData(displayMode);

                    this.toggleSettings(true);
                    this.setPreStartState();
                });
            }

            document.addEventListener('click', (e) => {
                const menuVisible = els.settingsPanel.classList.contains('panel-visible');
                const clickedInside = els.settingsPanel.contains(e.target) || els.settingsToggle.contains(e.target);

                if (menuVisible && !clickedInside) {
                    this.toggleSettings(true);
                }
            });

            window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
            });
        }
    };

    PointCloudGame.init();
});

