
const plate_memoryTranslations = {
    fr: {
        header_title: "MÉMOIRE DES PLAQUES",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            pm_ranked: "-10%/round",
            title: "Configuration",
            difficulty: "Difficulté :",
            lives: "Vies :",
            lives_hint: "0 = Vies infinies.",
            display_time: "Temps additionnel :",
            display_time_sandbox: "Temps d'affichage (ms) :",
            display_time_hint: "Temps alloué par plaque.",
            ranked_hint: "Mode 1 Vie uniquement.",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            lvl: "PLAQUES",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            paused: "PAUSE",
            pause_hint: "", 
            hint_fullscreen: "",
            prompt: "Quelle était la plaque ?",
            submit: "Valider",
            was: "La plaque était :",
            you_typed: "Votre réponse :",
            continue: "Continuer",
            wrong_title: "Erreur !"
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            level_reached: "Plaques mémorisées",
            record: "Record :",
            best: "Meilleur",
            you: "Vous",
            avg_time: "Temps Moyen",
            fastest: "Plus rapide",
            slowest: "Plus lent",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "PLATE MEMORY",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            pm_ranked: "-10%/round",
            title: "Settings",
            difficulty: "Difficulty:",
            lives: "Lives:",
            lives_hint: "0 = Infinite lives.",
            display_time: "Additional time:",
            display_time_sandbox: "Display time (ms):",
            display_time_hint: "Time given to memorize.",
            ranked_hint: "1 Life mode only.",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            lvl: "PLATES",
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            paused: "PAUSED",
            pause_hint: "",
            hint_fullscreen: "",
            prompt: "What was the plate?",
            submit: "Submit",
            was: "Plate was:",
            you_typed: "Your answer:",
            continue: "Continue",
            wrong_title: "Wrong!"
        },
        results: {
            new_record: "NEW RECORD!",
            level_reached: "Plates Memorized",
            record: "Best:",
            best: "Best",
            you: "You",
            avg_time: "Avg Time",
            fastest: "Fastest",
            slowest: "Slowest",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.plate_memory = plate_memoryTranslations.fr;
    translations.en.plate_memory = plate_memoryTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, plate_memoryTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, plate_memoryTranslations['en']);
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

                        gain.gain.setValueAtTime(0.06 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

                        osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.03);
        },
        playError() {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;

            this.init();
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

                        osc.type = 'sine';
            osc.frequency.setValueAtTime(150, t);

                        gain.gain.setValueAtTime(0.10 * volMod, t);
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

                        gain.gain.setValueAtTime(0.08 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

                        osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.3);
        }
    };


        const PlateMemory = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START',
            currentPlate: "",
            level: 1, 
            lives: 1,

                        levelTimes: [],
            currentLevelStartTime: 0,
            actionTimeout: null,
            progressInterval: null,

                        savedRankedConfig: "1_1000",
            savedSandboxLives: 3,
            savedSandboxTime: 1000,

                        configLives: 1,
            timePerDigit: 1000,
            baseTime: 1000, 

                        isPaused: false,
            pauseRequested: false,
            distributionDataByConfig: {}
        },

        els: {
            gameArea: document.getElementById('game-area'),
            statusOverlay: document.getElementById('status-overlay'),
            plateWrapper: document.getElementById('plate-wrapper'),

                        displaySection: document.getElementById('display-section'),
            inputSection: document.getElementById('input-section'),
            feedbackSection: document.getElementById('feedback-section'),

                        plateDisplay: document.getElementById('plate-display'),
            progressBar: document.getElementById('progress-bar'),
            plateInputGroup: document.getElementById('plate-input-group'),
            plateInput1: document.getElementById('plate-input-1'),
            plateInput2: document.getElementById('plate-input-2'),
            plateInput3: document.getElementById('plate-input-3'),
            submitBtn: document.getElementById('submit-answer-btn'),

                        feedbackTitle: document.getElementById('feedback-title'),
            feedbackCorrect: document.getElementById('feedback-correct'),
            feedbackWrong: document.getElementById('feedback-wrong'),
            nextFeedbackBtn: document.getElementById('next-feedback-btn'),

                        plateTextDisplay: document.getElementById('plate-text-display'),

            level: document.getElementById('current-level'),
            livesContainer: document.getElementById('lives-container'),
            board: document.querySelector('.game-board'),

                        pauseBtn: document.getElementById('pause-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'), 
            iconPause: document.getElementById('icon-pause'),
            iconPlay: document.getElementById('icon-play'),
            restartBtn: document.getElementById('restart-btn'),
            pauseHint: document.getElementById('pause-hint'),

                        fullscreenBtn: document.getElementById('fullscreen-btn'),
            iconExpand: document.getElementById('icon-expand'),
            iconCompress: document.getElementById('icon-compress'),

            overlayOver: document.getElementById('game-over-overlay'),

                        viewRanked: document.getElementById('results-ranked'),
            viewSandbox: document.getElementById('results-sandbox'),

                        rankedScore: document.getElementById('ranked-score'),
            sandboxScore: document.getElementById('sandbox-score'),

                        statAvgTime: document.getElementById('stat-avg-time'),
            statFastest: document.getElementById('stat-fastest'),
            statSlowest: document.getElementById('stat-slowest'),
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

            config: {
                rankedConfig: document.getElementById('ranked-config-val'),
                lives: document.getElementById('lives-val'),
                displayTime: document.getElementById('display-time-val')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('lives') && params.has('time')) {
                this.state.savedRankedConfig = params.get('lives') + '_' + params.get('time');
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
                this.els.plateWrapper.classList.remove('blurred');
                this.startGame();
            } else {
                this.setPreStartState();
            }
            const initKey = `pm_ranked_${this.state.savedRankedConfig}`;
            this.preloadDistributionData(initKey);
        },

        loadUserPreferences() {
            const c = this.els.config;

            const savedRanked = localStorage.getItem('pm_ranked_config');
            if (savedRanked === 'pm_ranked') {
                if(c.rankedConfig) c.rankedConfig.value = savedRanked;
                this.state.savedRankedConfig = savedRanked;
            } else {
                if(c.rankedConfig) c.rankedConfig.value = "pm_ranked";
                this.state.savedRankedConfig = "pm_ranked";
                localStorage.setItem('pm_ranked_config', 'pm_ranked');
            }

            const savedLives = localStorage.getItem('pm_sandbox_lives');
            if (savedLives !== null) {
                if(c.lives) c.lives.value = savedLives;
                this.state.savedSandboxLives = parseInt(savedLives);
            }

            const savedTime = localStorage.getItem('pm_sandbox_time');
            if (savedTime !== null) {
                if(c.displayTime) c.displayTime.value = savedTime;
                this.state.savedSandboxTime = parseInt(savedTime);
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
            this.clearTimers();
            this.state.isActive = false;
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

                        this.showSection('none');
            this.els.plateWrapper.classList.remove('hidden');
            this.els.plateWrapper.classList.add('blurred'); 

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
                this.state.configLives = 1;

                                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.state.configLives = this.state.savedSandboxLives;

                                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = '';
                this.els.pauseBtn.style.visibility = 'hidden'; 
            }

            this.state.lives = (this.state.configLives === 0) ? 1 : this.state.configLives;
            this.updateStatsUI();
            this.els.pauseHint.textContent = ""; 
        },

        startGame() {
            this.clearTimers();
            SoundEngine.init();

                        this.state.currentState = 'PLAYING';
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.pauseRequested = false;
            this.state.levelTimes = [];

                        this.els.statusOverlay.classList.add('hidden');
            this.els.plateWrapper.classList.remove('blurred');
            this.els.plateWrapper.classList.remove('hidden');

                        if (this.state.gameMode === 'ranked') {
                this.state.configLives = 1;

                                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.state.configLives = this.state.savedSandboxLives;
                this.state.timePerDigit = this.state.savedSandboxTime;
                this.state.baseTime = this.state.savedSandboxTime;

                                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = '';
                this.els.pauseBtn.style.visibility = 'visible';
            }

            this.els.pauseBtn.classList.remove('btn-paused-pending', 'btn-paused-active');
            this.updatePauseIcon();

            this.state.level = 1;
            this.state.lives = (this.state.configLives === 0) ? 1 : this.state.configLives;

                        this.updateStatsUI();
            this.startLevel();
        },

        generatePlate() {
            const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const numbers = "0123456789";
            const randomString = (chars, length) => {
                let result = '';
                for (let i = 0; i < length; i++) {
                    result += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return result;
            };
            return `${randomString(letters, 2)}-${randomString(numbers, 3)}-${randomString(letters, 2)}`;
        },

        showSection(sectionName) {
            this.els.displaySection.classList.remove('active-section');
            this.els.inputSection.classList.remove('active-section');
            this.els.feedbackSection.classList.remove('active-section');

                        this.els.displaySection.classList.add('hidden-section');
            this.els.inputSection.classList.add('hidden-section');
            this.els.feedbackSection.classList.add('hidden-section');

            if (sectionName === 'display') {
                this.els.displaySection.classList.remove('hidden-section');
                this.els.displaySection.classList.add('active-section');
            } else if (sectionName === 'input') {
                this.els.inputSection.classList.remove('hidden-section');
                this.els.inputSection.classList.add('active-section');
            } else if (sectionName === 'feedback') {
                this.els.feedbackSection.classList.remove('hidden-section');
                this.els.feedbackSection.classList.add('active-section');
            }
        },

        startLevel() {
            this.clearTimers();
            this.els.plateInput1.value = "";
            this.els.plateInput2.value = "";
            this.els.plateInput3.value = "";
            document.getElementById('ph-1').innerHTML = "__";
            document.getElementById('ph-2').innerHTML = "___";
            document.getElementById('ph-3').innerHTML = "__";
            this.els.plateInputGroup.classList.remove('input-success', 'input-error');

                        this.state.currentPlate = this.generatePlate();
            this.els.plateTextDisplay.textContent = this.state.currentPlate;

                        let displayDuration;
            if (this.state.gameMode === 'ranked') {
                displayDuration = Math.max(200, 3000 * Math.pow(0.9, this.state.level - 1));
            } else {
                displayDuration = this.state.savedSandboxTime;
            }

                        this.showSection('display');

                        this.els.progressBar.style.transition = 'none';
            this.els.progressBar.style.transform = 'scaleX(1)';

                        void this.els.progressBar.offsetWidth;

                        this.els.progressBar.style.transition = `transform ${displayDuration}ms linear`;
            this.els.progressBar.style.transform = 'scaleX(0)';

            this.state.actionTimeout = setTimeout(() => {
                this.requestInput();
            }, displayDuration);
        },

        requestInput() {
            this.showSection('input');
            this.state.currentLevelStartTime = performance.now();

                        setTimeout(() => {
                this.els.plateInput1.focus();
            }, 100);
        },

        handleAnswerSubmit() {
            if (!this.state.isActive || this.state.isPaused || this.els.inputSection.classList.contains('hidden-section')) return;

            if (this.els.plateInputGroup.classList.contains('input-success') || this.els.plateInputGroup.classList.contains('input-error')) return;

            let val = this.els.plateInput1.value + this.els.plateInput2.value + this.els.plateInput3.value;
            let answer = val.trim().toUpperCase();
            if (answer === "") return; 

            let expected = this.state.currentPlate.replace(/-/g, '');

            if (answer === expected) {
                this.levelComplete();
            } else {
                this.loseLife(answer);
            }
        },

        loseLife(wrongAnswer) {
            SoundEngine.playError();
            if (this.state.configLives !== 0) {
                this.state.lives--;
                window.LivesManager.update(this.els.livesContainer, this.state.lives, this.state.configLives);
            }

                        this.els.plateInputGroup.classList.add('input-error');

                        setTimeout(() => {
                this.els.feedbackTitle.textContent = getGameText('game.wrong_title');
                this.els.feedbackCorrect.textContent = this.state.currentPlate;
                this.els.feedbackWrong.textContent = wrongAnswer;
                this.showSection('feedback');

                                setTimeout(() => this.els.nextFeedbackBtn.focus(), 100);
            }, 500);
        },

        handleNextFeedback() {
            if (this.state.configLives !== 0 && this.state.lives <= 0) {
                this.gameOver();
            } else {
                if (this.state.pauseRequested) {
                    this.state.isPaused = true;
                    this.showSection('none');
                    this.updatePauseIcon(); 
                    this.els.pauseBtn.classList.remove('btn-paused-pending');
                    this.els.pauseBtn.classList.add('btn-paused-active');
                } else {
                    this.startLevel();
                }
            }
        },

        levelComplete() {
            SoundEngine.playHit();
            const timeTaken = (performance.now() - this.state.currentLevelStartTime) / 1000;
            this.state.levelTimes.push(timeTaken);

            this.els.plateInputGroup.classList.add('input-success');

                        setTimeout(() => {
                if (this.state.pauseRequested) {
                    this.state.isPaused = true;
                    this.showSection('none');
                    this.updatePauseIcon(); 
                    this.els.pauseBtn.classList.remove('btn-paused-pending');
                    this.els.pauseBtn.classList.add('btn-paused-active');
                } else {
                    this.state.level++;
                    this.updateStatsUI();
                    this.startLevel();
                }
            }, 800);
        },

        clearTimers() {
            if (this.state.actionTimeout) clearTimeout(this.state.actionTimeout);
            if (this.state.progressInterval) clearInterval(this.state.progressInterval);
        },

        async gameOver() {
            this.clearTimers();
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';
            SoundEngine.playEnd();

                        if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = this.state.level;

                                this.saveScoreToDatabase(this.state.level, this.state.configLives, 0);

                                const recordKey = `pm_best_ranked`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                                if (best === null || this.state.level > best) {
                    best = this.state.level;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.configLives, 0);
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
                const chartKey = `pm_ranked`;
                this.drawDistributionChart(this.state.level, best, chartKey);

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                if(this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }
                this.els.sandboxScore.textContent = this.state.level;

                if (this.state.levelTimes.length > 0) {
                    const sum = this.state.levelTimes.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.state.levelTimes.length).toFixed(2);
                    const fastest = Math.min(...this.state.levelTimes).toFixed(2);
                    const slowest = Math.max(...this.state.levelTimes).toFixed(2);

                    if (this.els.statAvgTime) this.els.statAvgTime.textContent = `${avg}s`;
                    if (this.els.statFastest) this.els.statFastest.textContent = `${fastest}s`;
                    if (this.els.statSlowest) this.els.statSlowest.textContent = `${slowest}s`;

                    if (this.els.historyChart) {
                        this.els.historyChart.innerHTML = '';
                        const minTime = Math.min(...this.state.levelTimes);
                        const maxTime = Math.max(...this.state.levelTimes);
                        const buffer = (maxTime - minTime) * 0.2; 
                        let chartMin = minTime - buffer;
                        if (chartMin < 0) chartMin = 0; 
                        let chartMax = maxTime + buffer;

                                                if (chartMin === chartMax) {
                            chartMin -= 0.5;
                            chartMax += 0.5;
                        }
                        const chartRange = chartMax - chartMin;

                        this.state.levelTimes.forEach((time, index) => {
                            let heightPercent = ((time - chartMin) / chartRange) * 100;
                            if(heightPercent < 5) heightPercent = 5;
                            if(heightPercent > 100) heightPercent = 100;

                            const barContainer = document.createElement('div');
                            barContainer.className = 'history-bar-wrapper';

                            const bar = document.createElement('div');
                            bar.className = 'history-bar';
                            bar.style.height = `${heightPercent}%`;

                                                        const label = document.createElement('span');
                            label.textContent = time.toFixed(1) + 's';
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
                    if (this.els.statAvgTime) this.els.statAvgTime.textContent = `--s`;
                    if (this.els.statFastest) this.els.statFastest.textContent = `--s`;
                    if (this.els.statSlowest) this.els.statSlowest.textContent = `--s`;
                    if (this.els.historyChart) this.els.historyChart.innerHTML = '';
                }
            }

            this.toggleOverlay(this.els.overlayOver, true);
            this.els.pauseBtn.style.visibility = 'hidden';
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
            const chartKey = `pm_ranked`;
            this.preloadDistributionData(chartKey);
        },
        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },


        async saveScoreToDatabase(score, lives, time) {
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
                    body: JSON.stringify({ game_id: 'plate_memory', score: score, details: { lives: lives, time: time }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, lives, time) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `plate_memory_ranked`, score: score, details: { lives: lives, time: time }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
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

            distributionContainer.onmousemove = (e) => {
                const rect = distributionContainer.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const percentX = clamp(mouseX / rect.width, 0, 1);
                const val = Math.round(minX + percentX * range);
                const snappedPercentX = (val - minX) / range;

                let areaToRight = 0;
                for (let i = 0; i <= steps; i++) {
                    let pointVal = minX + (i / steps) * range;
                    if (pointVal >= val) areaToRight += densities[i].y;
                }

                                let percentile = clamp((areaToRight / totalArea) * 100, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                tooltip.style.left = `${snappedPercentX * 100}%`;
                tooltip.innerHTML = `<strong>${val}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                tooltip.classList.remove('hidden');
                hoverLine.style.left = `${snappedPercentX * 100}%`;
                hoverLine.classList.remove('hidden');
            };

                        distributionContainer.onmouseleave = () => { 
                tooltip.classList.add('hidden'); 
                hoverLine.classList.add('hidden'); 
            };
        },

        async preloadDistributionData(configKey) {
            if (!configKey) configKey = `pm_ranked_${this.state.savedRankedConfig}`;
            const parts = configKey.split('_');
            const lives = parts[2];
            const time = parts[3];
            try {
                const res = await fetch(`/api/scores/distribution/plate_memory?lives=${lives}&time=${time}`, {
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

        updateStatsUI() {
            this.els.level.textContent = this.state.level;
            window.LivesManager.setup(this.els.livesContainer, this.state.configLives, this.state.lives);
        },

        togglePause() {
            if (this.state.gameMode === 'ranked' || this.els.inputSection.classList.contains('active-section') || this.els.feedbackSection.classList.contains('active-section')) return; 

                        this.state.isPaused = !this.state.isPaused;

                        if (this.state.isPaused) {
                this.clearTimers();
                this.els.progressBar.style.transition = 'none';
            } else {
                this.startLevel(); 
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
            if(c.lives) c.lives.value = this.state.savedSandboxLives;
            if(c.displayTime) c.displayTime.value = this.state.savedSandboxTime;
            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if(activeRadio) activeRadio.checked = true;
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

            els.gameArea.addEventListener('click', (e) => {
                if (this.state.currentState === 'PRE_START' && !e.target.closest('button')) {
                    this.startGame();
                }
            });

            els.submitBtn.addEventListener('click', () => {
                this.handleAnswerSubmit();
            });

            els.nextFeedbackBtn.addEventListener('click', () => {
                this.handleNextFeedback();
            });

            const inputs = [els.plateInput1, els.plateInput2, els.plateInput3];
            const phs = [document.getElementById('ph-1'), document.getElementById('ph-2'), document.getElementById('ph-3')];
            inputs.forEach((input, index) => {
                input.addEventListener('input', (e) => {
                    let val;
                    if (index === 1) {
                        val = e.target.value.replace(/[^0-9]/g, '');
                    } else {
                        val = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
                    }
                    e.target.value = val;

                                        let hiddenPart = '<span style="visibility:hidden">' + val + '</span>';
                    let visiblePart = '_'.repeat(Math.max(0, e.target.maxLength - val.length));
                    phs[index].innerHTML = hiddenPart + visiblePart;

                    if (val.length === e.target.maxLength && index < 2) {
                        inputs[index + 1].focus();
                    }
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        this.handleAnswerSubmit();
                        return;
                    }

                    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete', 'Home', 'End'];
                    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
                        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                            inputs[index - 1].focus();
                        }
                        return;
                    }

                    if (index === 1) {
                        const azertyMap = { 
                            '&': '1', 'é': '2', '"': '3', "'": '4', '(': '5', 
                            '-': '6', '§': '6', 
                            'è': '7', 
                            '_': '8', '!': '8', 
                            'ç': '9', 
                            'à': '0', '@': '0', '°': '0' 
                        };

                        if (azertyMap[e.key]) {
                            e.preventDefault();
                            const val = azertyMap[e.key];
                            const start = e.target.selectionStart;
                            const end = e.target.selectionEnd;
                            const text = e.target.value;
                            const newText = text.substring(0, start) + val + text.substring(end);
                            if (newText.length <= e.target.maxLength) {
                                e.target.value = newText;
                                e.target.selectionStart = e.target.selectionEnd = start + val.length;
                                e.target.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                            }
                            return;
                        }

                        if (e.key.length === 1 && !/^[0-9]$/.test(e.key)) {
                            e.preventDefault();
                        }
                    } else {
                        const azertyMapKeys = ['&', 'é', '"', "'", '(', '-', '§', 'è', '_', '!', 'ç', 'à', '@', '°'];
                        if (azertyMapKeys.includes(e.key) || (e.key.length === 1 && !/^[a-zA-Z]$/.test(e.key))) {
                            e.preventDefault();
                        }
                    }
                });
            });

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const isOverVisible = this.els.overlayOver.classList.contains('visible');
                const isInputActive = this.els.inputSection.classList.contains('active-section');

                if (e.key.toLowerCase() === 'f' && !isInputActive) this.toggleFullscreen();

                                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }

                if (e.code === 'Space' && this.state.isActive && !isMenuOpen && !isInputActive) {
                    if (this.state.gameMode === 'sandbox') {
                        e.preventDefault(); 
                        this.togglePause();
                    }
                }

                                if (e.code === 'Enter' || e.code === 'Space') {
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
                    localStorage.setItem('pm_ranked_config', c.rankedConfig.value);
                    this.state.savedRankedConfig = c.rankedConfig.value;
                }

                                if(c.lives) {
                    localStorage.setItem('pm_sandbox_lives', c.lives.value);
                    const parsedLives = parseInt(c.lives.value, 10);
                    this.state.savedSandboxLives = isNaN(parsedLives) ? 3 : parsedLives;
                }

                                if(c.displayTime) {
                    localStorage.setItem('pm_sandbox_time', c.displayTime.value);
                    this.state.savedSandboxTime = parseInt(c.displayTime.value) || 1000;
                }

                                const configKey = `pm_ranked_${this.state.savedRankedConfig}`;
                this.preloadDistributionData(configKey);
                this.toggleSettings(true);

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

    PlateMemory.init();
});

