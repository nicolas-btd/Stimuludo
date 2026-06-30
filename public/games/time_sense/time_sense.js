
const time_senseTranslations = {
    fr: {
        header_title: "ÉSTIMATION DU TEMPS",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            difficulty: "Marge d'erreur :",
            target_time: "Temps cible (ms) :",
            target_time_hint: "Le temps que vous devrez estimer.",
            sandbox_training: "Temps cible fixe",
            custom_gauge: "Marge d'erreur (ms) :",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            lvl: "NIV.",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            click_to_start: "Cliquez pour démarrer",
            click_to_stop: "Cliquez quand c'est bon !",
            margin: "MARGE d'ERREUR"
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            level_reached: "Niveau Atteint",
            error_avg: "Erreur Moyenne",
            record: "Record :",
            best: "Meilleur",
            you: "Vous",
            target: "Cible",
            best_error: "Meilleure Erreur",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "TIME SENSE",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            difficulty: "Error Margin:",
            target_time: "Target time (ms):",
            target_time_hint: "The time you have to estimate.",
            sandbox_training: "Fixed target time",
            custom_gauge: "Error margin (ms):",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            lvl: "LVL",
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            click_to_start: "Click to start",
            click_to_stop: "Click when ready!",
            margin: "ERROR MARGIN"
        },
        results: {
            new_record: "NEW RECORD!",
            level_reached: "Level Reached",
            error_avg: "Avg Error",
            record: "Best:",
            best: "Best",
            you: "You",
            target: "Target",
            best_error: "Best Error",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.time_sense = time_senseTranslations.fr;
    translations.en.time_sense = time_senseTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, time_senseTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, time_senseTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {

    const TimeSense = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START', 
            level: 1,

                        targetTime: 0,
            hideThreshold: 0,
            currentLevelStartTime: 0,
            animationFrameId: null,

                        gauge: 2000,
            maxGauge: 2000,

                        errorsArray: [],

                        savedRankedConfig: "2000",
            savedSandboxTime: 5000,
            savedSandboxIsTraining: false,
            savedCustomGauge: 5000,

                        actionTimeout: null,
            distributionDataByConfig: {}
        },

        els: {
            gameArea: document.getElementById('game-area'),
            statusOverlay: document.getElementById('status-overlay'),
            timeSenseWrapper: document.getElementById('time-sense-wrapper'),

                        targetTimeDisplay: document.getElementById('target-time-display'),
            currentTimeContainer: document.getElementById('current-time-container'),
            currentTimeDisplay: document.getElementById('current-time-display'),
            timeInstruction: document.getElementById('time-instruction'),
            feedbackText: document.getElementById('feedback-text'),

                        level: document.getElementById('current-level'),
            gaugeContainer: document.getElementById('gauge-container'),
            gaugeFill: document.getElementById('gauge-bar-fill'),
            gaugeText: document.getElementById('gauge-value-text'),
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

                        statSandboxTarget: document.getElementById('stat-sandbox-target'),
            statBestError: document.getElementById('stat-best-error'),
            historyChart: document.getElementById('history-chart'),

                        markerCurrent: document.getElementById('marker-current'),
            markerBest: document.getElementById('marker-best'),
            newRecordMsg: document.getElementById('new-record-msg'),

                        settingsPanel: document.getElementById('settings-panel'),
            settingsToggle: document.getElementById('settings-toggle'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),

                        settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
            modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),
            sandboxTrainingCheckbox: document.getElementById('sandbox-mode-training'),
            sandboxTrainingInput: document.getElementById('sandbox-training-input'),
            sandboxTrainingHint: document.getElementById('sandbox-training-hint'),

            config: {
                rankedConfig: document.getElementById('ranked-config-val'),
                sandboxTime: document.getElementById('sandbox-target-time'),
                sandboxCustomGauge: document.getElementById('sandbox-custom-gauge')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('difficulty')) {
                const diff = params.get('difficulty');
                this.state.savedRankedConfig = diff;
                localStorage.setItem('ts_ranked_config', diff);
            }

            this.loadUserPreferences();
            this.loadBackgroundPreference();
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

                        if (this.state.gameMode === 'sandbox') {
                this.els.statusOverlay.classList.add('hidden');
                this.els.timeSenseWrapper.classList.remove('blurred');
                this.startGame();
            } else {
                this.setPreStartState();
            }
            this.preloadDistributionData();
        },

        loadUserPreferences() {
            const c = this.els.config;

            const savedRanked = localStorage.getItem('ts_ranked_config');
            if (savedRanked !== null) {
                if(c.rankedConfig) c.rankedConfig.value = savedRanked;
                this.state.savedRankedConfig = savedRanked;
            }

            const savedTime = localStorage.getItem('ts_sandbox_time');
            if (savedTime !== null) {
                if(c.sandboxTime) c.sandboxTime.value = savedTime;
                this.state.savedSandboxTime = parseInt(savedTime);
            }

            const savedIsTraining = localStorage.getItem('ts_sandbox_is_training');
            if (savedIsTraining !== null) {
                this.state.savedSandboxIsTraining = (savedIsTraining === 'true');
                if (this.els.sandboxTrainingCheckbox) this.els.sandboxTrainingCheckbox.checked = this.state.savedSandboxIsTraining;
            }

            const savedCustomGauge = localStorage.getItem('ts_sandbox_custom_gauge');
            if (savedCustomGauge !== null) {
                if(c.sandboxCustomGauge) c.sandboxCustomGauge.value = savedCustomGauge;
                this.state.savedCustomGauge = parseInt(savedCustomGauge);
            }
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
            if (this.state.actionTimeout) clearTimeout(this.state.actionTimeout);
            if (this.state.animationFrameId) cancelAnimationFrame(this.state.animationFrameId);

                        this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

                        this.els.timeSenseWrapper.classList.remove('hidden');
            this.els.timeSenseWrapper.classList.add('blurred'); 

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

                        this.els.level.textContent = "1";

                        if (this.state.gameMode === 'ranked') {
                this.state.maxGauge = parseInt(this.state.savedRankedConfig) || 2000;
                this.els.gaugeContainer.style.visibility = 'visible';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else if (this.state.gameMode === 'sandbox' && !this.state.savedSandboxIsTraining) {
                this.state.maxGauge = this.state.savedCustomGauge || 5000;
                this.els.gaugeContainer.style.visibility = 'visible';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.els.gaugeContainer.style.visibility = 'hidden';
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
            }

            this.state.gauge = this.state.maxGauge;
            this.updateGaugeUI();
        },

        startGame() {
            if (this.state.actionTimeout) clearTimeout(this.state.actionTimeout);
            if (this.state.animationFrameId) cancelAnimationFrame(this.state.animationFrameId);

                        this.state.errorsArray = [];

                        this.els.statusOverlay.classList.add('hidden');
            this.els.timeSenseWrapper.classList.remove('blurred');
            this.els.timeSenseWrapper.classList.remove('hidden');

                        if (this.state.gameMode === 'ranked') {
                this.state.maxGauge = parseInt(this.state.savedRankedConfig) || 2000;
                this.els.gaugeContainer.style.visibility = 'visible';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else if (this.state.gameMode === 'sandbox' && this.state.savedSandboxSubMode === 'survival') {
                this.state.maxGauge = this.state.savedCustomGauge || 5000;
                this.els.gaugeContainer.style.visibility = 'visible';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.els.gaugeContainer.style.visibility = 'hidden';
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
            }

            this.state.level = 1;
            this.state.gauge = this.state.maxGauge;

                        this.updateGaugeUI();
            this.els.level.textContent = this.state.level;

                        this.startLevel();
        },

        generateTargetTime() {
            if (this.state.gameMode === 'sandbox' && this.state.savedSandboxIsTraining) {
                return this.state.savedSandboxTime;
            }
            const minSec = 3 + (this.state.level - 1) * 0.77;
            const maxSec = 5 + (this.state.level - 1) * 1.11;
            const randomSec = minSec + Math.random() * (maxSec - minSec);
            return Math.floor(randomSec * 1000); 
        },

        startLevel() {
            this.els.feedbackText.textContent = "";
            this.els.feedbackText.style.opacity = "0";

            this.state.targetTime = this.generateTargetTime();
            this.state.hideThreshold = Math.min(3000, this.state.targetTime / 2);

                        this.els.targetTimeDisplay.textContent = (this.state.targetTime / 1000).toFixed(3) + "s";
            this.els.currentTimeDisplay.textContent = "0.000s";
            this.els.timeInstruction.textContent = getGameText('game.click_to_start');

            this.state.currentState = 'WAITING_CLICK';
        },

        prepareNextLevel() {
            if (this.state.gameMode === 'ranked' || (this.state.gameMode === 'sandbox' && !this.state.savedSandboxIsTraining)) {
                this.state.level++;
                this.els.level.textContent = this.state.level;
            }
            this.startLevel();
        },

        handleGameAction() {
            if (this.state.currentState === 'WAITING_CLICK') {
                this.state.currentState = 'RUNNING';
                this.els.timeInstruction.textContent = getGameText('game.click_to_stop');
                this.state.currentLevelStartTime = performance.now();
                this.animationLoop();

                            } else if (this.state.currentState === 'RUNNING') {
                const clickTime = performance.now();
                cancelAnimationFrame(this.state.animationFrameId);
                this.state.currentState = 'SHOW_RESULT';

                                const actualElapsed = clickTime - this.state.currentLevelStartTime;
                const error = Math.abs(actualElapsed - this.state.targetTime);
                this.state.errorsArray.push(error);

                                this.els.currentTimeDisplay.textContent = (actualElapsed / 1000).toFixed(3) + "s";

                                this.processResult(actualElapsed, error);
            }
        },

        animationLoop() {
            if (this.state.currentState !== 'RUNNING') return;

                        const elapsed = performance.now() - this.state.currentLevelStartTime;

                        if (elapsed >= this.state.hideThreshold) {
                this.els.currentTimeDisplay.textContent = "?.???s";
            } else {
                this.els.currentTimeDisplay.textContent = (elapsed / 1000).toFixed(3) + "s";
            }

                        this.state.animationFrameId = requestAnimationFrame(() => this.animationLoop());
        },

        processResult(actualElapsed, error) {
            let feedback = "";

            if (actualElapsed < this.state.targetTime) {
                feedback = `-${error.toFixed(0)} ms`;
            } else {
                feedback = `+${error.toFixed(0)} ms`;
            }

            if (this.state.gameMode === 'ranked' || (this.state.gameMode === 'sandbox' && !this.state.savedSandboxIsTraining)) {
                this.state.gauge -= error;
                this.updateGaugeUI();
            }

            this.els.feedbackText.textContent = feedback;
            this.els.feedbackText.style.opacity = "1";

            if ((this.state.gameMode === 'ranked' || (this.state.gameMode === 'sandbox' && !this.state.savedSandboxIsTraining)) && this.state.gauge <= 0) {
                this.state.actionTimeout = setTimeout(() => this.gameOver(), 1500);
            } else {
                this.state.currentState = 'READY_NEXT';
                this.els.timeInstruction.textContent = getGameText('game.click_to_start');
            }
        },

                calculateGaugeColor(percentage) {
            const styles = getComputedStyle(document.documentElement);
            const colorStart = styles.getPropertyValue('--accent-color').trim(); 
            const colorEnd = styles.getPropertyValue('--accent-color-secondary').trim(); 

            const hexToRgb = (hex) => {
                if (hex.length === 4) {
                    hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
                }
                const r = parseInt(hex.substring(1, 3), 16);
                const g = parseInt(hex.substring(3, 5), 16);
                const b = parseInt(hex.substring(5, 7), 16);
                return { r, g, b };
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
            this.els.gaugeText.textContent = `${clampGauge.toFixed(0)}ms`;

                        const percent = (clampGauge / this.state.maxGauge); 
            this.els.gaugeFill.style.width = `${percent * 100}%`;

                        const dynamicColor = this.calculateGaugeColor(percent);
            this.els.gaugeFill.style.backgroundColor = dynamicColor;
        },

        async gameOver() {
            this.state.currentState = 'FINISHED';

                        if (this.state.gameMode === 'ranked' || (this.state.gameMode === 'sandbox' && !this.state.savedSandboxIsTraining)) {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = this.state.level;

                                const distContainer = this.els.viewRanked.querySelector('.distribution-chart-container');
                if (this.state.gameMode === 'sandbox') {
                    if (distContainer) distContainer.style.display = 'none';
                    if (this.els.newRecordMsg) {
                        this.els.newRecordMsg.style.visibility = 'hidden';
                        this.els.newRecordMsg.style.opacity = '0';
                    }
                    this.els.markerBest.classList.add('hidden');
                } else {
                    if (distContainer) distContainer.style.display = 'block';
                }

                if (this.state.gameMode === 'ranked') {
                    this.saveScoreToDatabase(this.state.level, this.state.maxGauge);

                                        const recordKey = `ts_best_ranked_${this.state.savedRankedConfig}`;
                    let savedBest = localStorage.getItem(recordKey);
                    let best = savedBest !== null ? parseInt(savedBest) : null;
                    let isRecord = false;

                                        if (best === null || this.state.level > best) {
                        best = this.state.level;
                        localStorage.setItem(recordKey, best);
                        isRecord = true;
                        this.saveBestScoreToDatabase(best, this.state.maxGauge);
                    }

                                        if (isRecord && savedBest !== null) {
                        if(this.els.newRecordMsg) {
                            this.els.newRecordMsg.style.visibility = 'visible';
                            this.els.newRecordMsg.style.opacity = '1';
                        }
                    } else {
                        if(this.els.newRecordMsg) {
                            this.els.newRecordMsg.style.visibility = 'hidden';
                            this.els.newRecordMsg.style.opacity = '0';
                        }
                    }

                                        const configKey = this.state.savedRankedConfig;
                    this.drawDistributionChart(this.state.level, best, configKey);
                    this.preloadDistributionData(configKey);
                }

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                if(this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                if (this.state.errorsArray.length > 0) {
                    const sum = this.state.errorsArray.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.state.errorsArray.length).toFixed(0);
                    const bestErr = Math.min(...this.state.errorsArray).toFixed(0);

                    this.els.sandboxScore.textContent = avg;
                    if (this.els.statSandboxTarget) this.els.statSandboxTarget.textContent = (this.state.savedSandboxTime / 1000).toFixed(1) + "s";
                    if (this.els.statBestError) this.els.statBestError.textContent = `${bestErr}ms`;

                    if (this.els.historyChart) {
                        this.els.historyChart.innerHTML = '';
                        const minErr = Math.min(...this.state.errorsArray);
                        const maxErr = Math.max(...this.state.errorsArray);
                        const buffer = (maxErr - minErr) * 0.2; 
                        let chartMin = minErr - buffer;
                        if (chartMin < 0) chartMin = 0; 
                        let chartMax = maxErr + buffer;

                                                if (chartMin === chartMax) {
                            chartMin -= 10;
                            chartMax += 10;
                        }
                        const chartRange = chartMax - chartMin;

                        this.state.errorsArray.forEach((err, index) => {
                            let heightPercent = ((err - chartMin) / chartRange) * 100;
                            if(heightPercent < 5) heightPercent = 5;
                            if(heightPercent > 100) heightPercent = 100;

                            const barContainer = document.createElement('div');
                            barContainer.className = 'history-bar-wrapper';

                            const bar = document.createElement('div');
                            bar.className = 'history-bar';
                            bar.style.height = `${heightPercent}%`;

                                                        const label = document.createElement('span');
                            label.textContent = err.toFixed(0) + 'ms';
                            label.className = 'bar-label';

                                                        const indexLabel = document.createElement('span');
                            indexLabel.textContent = index + 1; 
                            indexLabel.className = 'bar-index';

                                                        barContainer.appendChild(label);
                            barContainer.appendChild(bar);
                            barContainer.appendChild(indexLabel);
                            this.els.historyChart.appendChild(barContainer);
                        });
                    }
                } else {
                    this.els.sandboxScore.textContent = "--";
                    if (this.els.statSandboxTarget) this.els.statSandboxTarget.textContent = "--s";
                    if (this.els.statBestError) this.els.statBestError.textContent = "--ms";
                    if (this.els.historyChart) this.els.historyChart.innerHTML = '';
                }
            }

            this.toggleOverlay(this.els.overlayOver, true);
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
            this.preloadDistributionData(this.state.savedRankedConfig);
        },
        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },

        async saveScoreToDatabase(score, maxGauge) {
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
                    body: JSON.stringify({ game_id: 'time_sense', score: score, details: { gauge: maxGauge }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, maxGauge) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `ts_ranked_${maxGauge}`, score: score, details: { gauge: maxGauge }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async preloadDistributionData(configKey) {
            const gauge = configKey || this.state.savedRankedConfig || "2000";
            const key = gauge.toString();
            try {
                const res = await fetch(`/api/scores/distribution/time_sense?gauge=${gauge}`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (res.ok) {
                    this.state.distributionDataByConfig[key] = await res.json();
                } else {
                    this.state.distributionDataByConfig[key] = [];
                }
            } catch (e) {
                console.error(e);
                this.state.distributionDataByConfig[key] = [];
            }
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
            const key = (configKey || this.state.savedRankedConfig || "2000").toString();
            if (!this.state.distributionDataByConfig) this.state.distributionDataByConfig = {};
            if (!this.state.distributionDataByConfig[key]) {
                this.state.distributionDataByConfig[key] = [];
            }
            if (currentScore !== null) {
                this.state.distributionDataByConfig[key].push(currentScore);
            }
            let scores = [...this.state.distributionDataByConfig[key]];

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
            if (minX < 1) minX = 1; 

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

        toggleOverlay(el, show) {
            if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
            else { el.classList.remove('visible'); el.classList.add('hidden'); }
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

        restoreSettingsUI() {
            const c = this.els.config;
            if(c.rankedConfig) c.rankedConfig.value = this.state.savedRankedConfig;
            if(c.sandboxTime) c.sandboxTime.value = this.state.savedSandboxTime;
            if(c.sandboxCustomGauge) c.sandboxCustomGauge.value = this.state.savedCustomGauge;

            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if(activeRadio) activeRadio.checked = true;

            if(this.els.sandboxTrainingCheckbox) this.els.sandboxTrainingCheckbox.checked = this.state.savedSandboxIsTraining;

            if (!this.state.savedSandboxIsTraining) {
                if (this.els.sandboxTrainingInput) {
                    this.els.sandboxTrainingInput.style.opacity = '0.5';
                    this.els.sandboxTrainingInput.style.pointerEvents = 'none';
                }
                if (this.els.sandboxTrainingHint) {
                    this.els.sandboxTrainingHint.style.opacity = '0.5';
                }
            } else {
                if (this.els.sandboxTrainingInput) {
                    this.els.sandboxTrainingInput.style.opacity = '1';
                    this.els.sandboxTrainingInput.style.pointerEvents = 'auto';
                }
                if (this.els.sandboxTrainingHint) {
                    this.els.sandboxTrainingHint.style.opacity = '1';
                }
            }

            this.updateSettingsView(this.state.gameMode);
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
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

            els.modeToggleRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.updateSettingsView(e.target.value);
                });
            });

            if (els.sandboxTrainingCheckbox) {
                els.sandboxTrainingCheckbox.addEventListener('change', (e) => {
                    const isTraining = e.target.checked;
                    if (!isTraining) {
                        if (els.sandboxTrainingInput) {
                            els.sandboxTrainingInput.style.opacity = '0.5';
                            els.sandboxTrainingInput.style.pointerEvents = 'none';
                        }
                        if (els.sandboxTrainingHint) {
                            els.sandboxTrainingHint.style.opacity = '0.5';
                        }
                    } else {
                        if (els.sandboxTrainingInput) {
                            els.sandboxTrainingInput.style.opacity = '1';
                            els.sandboxTrainingInput.style.pointerEvents = 'auto';
                        }
                        if (els.sandboxTrainingHint) {
                            els.sandboxTrainingHint.style.opacity = '1';
                        }
                    }
                });
            }

            els.restartBtn.addEventListener('click', () => {
                this.toggleOverlay(this.els.overlayOver, false);
                if (this.state.gameMode === 'sandbox') {
                    this.startGame();
                } else {
                    this.setPreStartState();
                }
            });

                        if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') {
                        this.startGame();
                    } else {
                        this.setPreStartState();
                    }
                });
            }

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

            els.gameArea.addEventListener('pointerdown', (e) => {
                if (!e.target.closest('button') && !e.target.closest('#settings-panel')) {
                    if (this.state.currentState === 'PRE_START') {
                        this.startGame();
                    } else if (this.state.currentState === 'WAITING_CLICK' || this.state.currentState === 'RUNNING') {
                        this.handleGameAction();
                    } else if (this.state.currentState === 'READY_NEXT') {
                        this.prepareNextLevel();
                    }
                }
            });

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const isOverVisible = this.els.overlayOver.classList.contains('visible');

                                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();
                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }

                                if (e.code === 'Space') {
                    if (isMenuOpen) {
                        e.preventDefault();
                        els.saveSettings.click();
                    } 
                    else if (isOverVisible) {
                        e.preventDefault();
                        this.toggleOverlay(this.els.overlayOver, false);
                        if (this.state.gameMode === 'sandbox') {
                            this.startGame();
                        } else {
                            this.setPreStartState();
                        }
                    }
                    else if (this.state.currentState === 'PRE_START') {
                        e.preventDefault();
                        this.startGame();
                    }
                    else if (this.state.currentState === 'WAITING_CLICK' || this.state.currentState === 'RUNNING') {
                        e.preventDefault();
                        this.handleGameAction();
                    }
                    else if (this.state.currentState === 'READY_NEXT') {
                        e.preventDefault();
                        this.prepareNextLevel();
                    }
                }

                                if (e.code === 'Enter' && (isMenuOpen || isOverVisible || this.state.currentState === 'PRE_START' || this.state.currentState === 'READY_NEXT')) {
                     if (isMenuOpen) {
                        e.preventDefault();
                        els.saveSettings.click();
                    } 
                    else if (isOverVisible) {
                        e.preventDefault();
                        this.toggleOverlay(this.els.overlayOver, false);
                        if (this.state.gameMode === 'sandbox') {
                            this.startGame();
                        } else {
                            this.setPreStartState();
                        }
                    }
                    else if (this.state.currentState === 'PRE_START') {
                        e.preventDefault();
                        this.startGame();
                    }
                    else if (this.state.currentState === 'READY_NEXT') {
                        e.preventDefault();
                        this.prepareNextLevel();
                    }
                }
            });

            els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(err => console.error(err));
                    if (this.els.settingsPanel.classList.contains('panel-hidden')) {
                        this.toggleSettings();
                    }
                } else {
                    this.toggleSettings();
                }
            });

                        if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

                        if (els.saveSettings) els.saveSettings.addEventListener('click', () => {
                const c = this.els.config;
                const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;
                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);

                                if(c.rankedConfig) {
                    localStorage.setItem('ts_ranked_config', c.rankedConfig.value);
                    this.state.savedRankedConfig = c.rankedConfig.value;
                }
                if(c.sandboxTime) {
                    localStorage.setItem('ts_sandbox_time', c.sandboxTime.value);
                    this.state.savedSandboxTime = parseInt(c.sandboxTime.value);
                }
                if(c.sandboxCustomGauge) {
                    localStorage.setItem('ts_sandbox_custom_gauge', c.sandboxCustomGauge.value);
                    this.state.savedCustomGauge = parseInt(c.sandboxCustomGauge.value);
                }
                if (els.sandboxTrainingCheckbox) {
                    localStorage.setItem('ts_sandbox_is_training', els.sandboxTrainingCheckbox.checked);
                    this.state.savedSandboxIsTraining = els.sandboxTrainingCheckbox.checked;
                }

                                this.preloadDistributionData(this.state.savedRankedConfig);
                this.toggleSettings(true);
                this.setPreStartState();

                                if (this.state.gameMode === 'sandbox') {
                    this.startGame();
                } else {
                    this.setPreStartState();
                }
            });

            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel.contains(e.target) || els.settingsToggle.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });
            window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
            });
        }
    };

    TimeSense.init();
});
