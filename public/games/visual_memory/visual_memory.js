
const visual_memoryTranslations = {
    fr: {
        header_title: "MÉMOIRE VISUELLE",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            lives_3: "3 Vies",
            lives_1: "1 Vie",
            title: "Configuration",
            difficulty: "Difficulté :",
            lives: "Vies :",
            lives_hint: "0 = Vies infinies.",
            display_time: "Affichage (ms) :",
            display_time_hint: "Temps de mémorisation.",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            lvl: "NIV.",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            paused: "PAUSE",
            pause_hint: "", 
            hint_fullscreen: "" 
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            level_reached: "Niveau Atteint",
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
        header_title: "VISUAL MEMORY",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            lives_3: "3 Lives",
            lives_1: "1 Life",
            title: "Settings",
            difficulty: "Difficulty:",
            lives: "Lives:",
            lives_hint: "0 = Infinite lives.",
            display_time: "Display time (ms):",
            display_time_hint: "Memorization time.",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            lvl: "LVL",
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            paused: "PAUSED",
            pause_hint: "",
            hint_fullscreen: ""
        },
        results: {
            new_record: "NEW RECORD!",
            level_reached: "Level Reached",
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
    translations.fr.visual_memory = visual_memoryTranslations.fr;
    translations.en.visual_memory = visual_memoryTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, visual_memoryTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, visual_memoryTranslations['en']);
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
        playToneAtTime(freq, type, startTime, duration, vol = 0.1) {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;

            if (!audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);

                        gain.gain.setValueAtTime(vol * volMod, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

                        osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        },
        playClick(foundCount) {
            this.init();
            const baseFreq = 200; 
            const step = 25;      
            const freq = baseFreq + (foundCount * step);
            this.playToneAtTime(freq, 'sine', audioCtx.currentTime, 0.15, 0.15);
        },
        playReveal() {
            this.init();
            this.playToneAtTime(400, 'sine', audioCtx.currentTime, 0.05, 0.05);
            this.playToneAtTime(600, 'sine', audioCtx.currentTime + 0.03, 0.05, 0.05);
        },
        playHide() {
            this.init();
            this.playToneAtTime(400, 'sine', audioCtx.currentTime, 0.05, 0.05);
        },
        playSuccess(targetCount) {
            this.init();
            const t = audioCtx.currentTime;

                        const baseFreq = 200 + ((targetCount - 1) * 25);

                        this.playToneAtTime(baseFreq, 'sine', t, 0.1, 0.1); 
            this.playToneAtTime(baseFreq * 1.2599, 'sine', t + 0.1, 0.1, 0.1); 
            this.playToneAtTime(baseFreq * 1.4983, 'sine', t + 0.2, 0.2, 0.15); 
        },
        playError() {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;

            this.init();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';

                        osc.frequency.setValueAtTime(250, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.2);

                        gain.gain.setValueAtTime(0.15 * volMod, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

                        osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.2);
        },
        playLevelFailed() {
            this.init();
            const t = audioCtx.currentTime;

                        this.playToneAtTime(311.13, 'sine', t, 0.15, 0.15); 
            this.playToneAtTime(261.63, 'sine', t + 0.15, 0.15, 0.15); 
            this.playToneAtTime(220.00, 'sine', t + 0.3, 0.4, 0.15); 
        }
    };

    const VisualMemory = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START',
            gridSize: 3,
            targetCount: 3,
            level: 1,
            lives: 3,
            activeTiles: [],
            foundTiles: [],
            mistakesInLevel: 0,
            isClickable: false,

                        levelTimes: [],
            currentLevelStartTime: 0,
            actionTimeout: null, 

                        savedRankedConfig: "3_1000",
            savedSandboxLives: 3,
            savedSandboxTime: 1000,

                        configLives: 3,
            displayTime: 1000,

                        isPaused: false,
            pauseRequested: false,
            distributionDataByConfig: {}
        },

        els: {
            gameArea: document.getElementById('game-area'),
            statusOverlay: document.getElementById('status-overlay'),
            gridWrapper: document.getElementById('grid-wrapper'),
            gridContainer: document.getElementById('grid-container'),
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
                rankedLives: document.getElementById('ranked-lives-val'),
                rankedTime: document.getElementById('ranked-time-val'),
                lives: document.getElementById('lives-val'),
                displayTime: document.getElementById('display-time-val')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }

            this.loadUserPreferences();

                        if (params.has('lives') || params.has('time')) {
                const l = params.get('lives') || '3';
                const t = params.get('time') || '1000';
                this.state.savedRankedConfig = `${l}_${t}`;
            }

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
                this.els.gridWrapper.classList.remove('blurred');
                this.startGame();
            } else {
                this.setPreStartState();
            }
            this.preloadDistributionData();
        },

        loadUserPreferences() {
            const c = this.els.config;

            const savedRanked = localStorage.getItem('vm_ranked_config');
            if (savedRanked !== null) {
                this.state.savedRankedConfig = savedRanked;
                const parts = savedRanked.split('_');
                if (parts.length === 2 && c.rankedLives && c.rankedTime) {
                    c.rankedLives.value = parts[0];
                    c.rankedTime.value = parts[1];
                }
            }

            const savedLives = localStorage.getItem('vm_sandbox_lives');
            if (savedLives !== null && c.lives) {
                c.lives.value = savedLives;
                this.state.savedSandboxLives = parseInt(savedLives);
            }

            const savedTime = localStorage.getItem('vm_sandbox_time');
            if (savedTime !== null && c.displayTime) {
                c.displayTime.value = savedTime;
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
            if (this.state.actionTimeout) clearTimeout(this.state.actionTimeout);
            this.state.isActive = false;
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

                        this.state.gridSize = 3;
            this.renderGrid();

                        this.els.gridWrapper.classList.remove('hidden');
            this.els.gridWrapper.classList.add('blurred'); 

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
                const parts = this.state.savedRankedConfig.split('_');
                this.state.configLives = parseInt(parts[0]);

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


                                    window.LivesManager.setup(this.els.livesContainer, this.state.configLives, this.state.lives);

                        this.els.pauseHint.textContent = ""; 
        },

        startGame() {
            if (this.state.actionTimeout) clearTimeout(this.state.actionTimeout);
            SoundEngine.init();

            this.state.currentState = 'PLAYING';
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.pauseRequested = false;
            this.state.levelTimes = [];

                        this.els.statusOverlay.classList.add('hidden');
            this.els.gridWrapper.classList.remove('blurred');
            this.els.gridWrapper.classList.remove('hidden');

                        if (this.state.gameMode === 'ranked') {
                const parts = this.state.savedRankedConfig.split('_');
                this.state.configLives = parseInt(parts[0]);
                this.state.displayTime = parseInt(parts[1]);

                                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.state.configLives = this.state.savedSandboxLives;
                this.state.displayTime = this.state.savedSandboxTime;

                                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = '';
                this.els.pauseBtn.style.visibility = 'visible';
            }

            this.els.pauseBtn.classList.remove('btn-paused-pending', 'btn-paused-active');
            this.updatePauseIcon();

            this.state.gridSize = 3;
            this.state.targetCount = 3;
            this.state.level = 1;
            this.state.lives = (this.state.configLives === 0) ? 1 : this.state.configLives;

                        this.els.level.textContent = this.state.level;

                        window.LivesManager.setup(this.els.livesContainer, this.state.configLives, this.state.lives);

                        this.startLevel();
        },

        startLevel() {
            this.state.mistakesInLevel = 0;
            this.els.gridContainer.classList.remove('flash-success-grid', 'flash-failure-grid');

            if (this.state.targetCount > (this.state.gridSize * this.state.gridSize) / 2) {
                this.state.gridSize++;
            }

            this.renderGrid();

            this.state.activeTiles = [];
            this.state.foundTiles = [];
            const totalCells = this.state.gridSize * this.state.gridSize;
            const pool = Array.from({length: totalCells}, (_, i) => i);

                        for (let i = 0; i < this.state.targetCount; i++) {
                const rand = Math.floor(Math.random() * pool.length);
                this.state.activeTiles.push(pool[rand]);
                pool.splice(rand, 1);
            }

            this.state.isClickable = false;
            this.state.actionTimeout = setTimeout(() => this.showPattern(), 1000);
        },

        renderGrid() {
            this.els.gridContainer.innerHTML = '';
            this.els.gridContainer.style.gridTemplateColumns = `repeat(${this.state.gridSize}, 1fr)`;

            const dynamicGap = Math.max(2, Math.floor(30 / this.state.gridSize));
            this.els.gridContainer.style.gap = `${dynamicGap}px`;

            const totalCells = this.state.gridSize * this.state.gridSize;
            for (let i = 0; i < totalCells; i++) {
                const tile = document.createElement('div');
                tile.classList.add('grid-tile');
                tile.dataset.index = i;
                tile.addEventListener('click', (e) => this.handleTileClick(e));
                this.els.gridContainer.appendChild(tile);
            }
        },

        showPattern() {
            SoundEngine.playReveal();
            const tiles = this.els.gridContainer.children;
            this.state.activeTiles.forEach(idx => {
                tiles[idx].classList.add('tile-active');
            });

            this.state.actionTimeout = setTimeout(() => {
                SoundEngine.playHide();
                this.state.activeTiles.forEach(idx => {
                    tiles[idx].classList.remove('tile-active');
                });
                this.state.currentLevelStartTime = performance.now();
                this.state.isClickable = true;
            }, this.state.displayTime);
        },

        handleTileClick(e) {
            if (!this.state.isClickable || this.state.isPaused) return;

            const tile = e.target;
            const index = parseInt(tile.dataset.index);

            if (tile.classList.contains('tile-success') || tile.classList.contains('tile-error')) return;

            if (this.state.activeTiles.includes(index)) {
                tile.classList.add('tile-success');
                this.state.foundTiles.push(index);

                                if (this.state.foundTiles.length === this.state.activeTiles.length) {
                    this.levelComplete();
                } else {
                    SoundEngine.playClick(this.state.foundTiles.length - 1);
                }
            } else {
                tile.classList.add('tile-error');
                this.state.mistakesInLevel++;

                                if (this.state.mistakesInLevel >= 3) {
                    SoundEngine.playLevelFailed();
                    this.loseLife();
                } else {
                    SoundEngine.playError();
                }
            }
        },

        loseLife() {
            if (this.state.configLives !== 0) {
                this.state.lives--;
                window.LivesManager.update(this.els.livesContainer, this.state.lives, this.state.configLives);
            }

                        this.els.gridContainer.classList.add('flash-failure-grid');

                        if (this.state.configLives !== 0 && this.state.lives <= 0) {
                this.gameOver();
            } else {
                if (this.state.pauseRequested) {
                    this.state.isPaused = true;
                    this.state.isClickable = false;
                    this.state.actionTimeout = setTimeout(() => { 
                        this.updatePauseIcon(); 
                        this.els.pauseBtn.classList.remove('btn-paused-pending');
                        this.els.pauseBtn.classList.add('btn-paused-active');
                    }, 800);
                } else {
                    this.state.isClickable = false;
                    this.state.actionTimeout = setTimeout(() => this.startLevel(), 1000);
                }
            }
        },

        levelComplete() {
            this.state.isClickable = false;

                        SoundEngine.playSuccess(this.state.targetCount);

                        const timeTaken = (performance.now() - this.state.currentLevelStartTime) / 1000;
            this.state.levelTimes.push(timeTaken);

            this.els.gridContainer.classList.add('flash-success-grid');

                        if (this.state.pauseRequested) {
                this.state.isPaused = true;
                this.state.actionTimeout = setTimeout(() => { 
                    this.updatePauseIcon(); 
                    this.els.pauseBtn.classList.remove('btn-paused-pending');
                    this.els.pauseBtn.classList.add('btn-paused-active');
                }, 800);
            } else {
                this.state.actionTimeout = setTimeout(() => { this.nextLevel(); }, 1000);
            }
        },

                nextLevel() {
            this.state.level++;
            this.state.targetCount++;
            this.els.level.textContent = this.state.level;

                        window.LivesManager.setup(this.els.livesContainer, this.state.configLives, this.state.lives);

                        this.startLevel();
        },

        async gameOver() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';

                        const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: this.state.level }, '*');
                return;
            }

                        if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = this.state.level;

                                this.saveScoreToDatabase(this.state.level, this.state.configLives, this.state.displayTime);

                                const recordKey = `vm_best_ranked_${this.state.savedRankedConfig}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                                if (best === null || this.state.level > best) {
                    best = this.state.level;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.configLives, this.state.displayTime);
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


        async saveScoreToDatabase(score, lives, time) {
            try {
                fetch('/api/scores', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'visual_memory', score: score, details: { lives: lives, time: time }, guest_id: this.getGuestId()})
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
                    body: JSON.stringify({ game_mode_key: `vm_ranked_${lives}_${time}`, score: score, details: { lives: lives, time: time }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async preloadDistributionData(configKey) {
            const key = configKey || this.state.savedRankedConfig || "3_1000";
            const parts = key.split('_');
            const lives = parts[0];
            const time = parts[1];
            try {
                const res = await fetch(`/api/scores/distribution/visual_memory?lives=${lives}&time=${time}`, {
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
            const key = configKey || this.state.savedRankedConfig || "3_1000";
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

        togglePause() {
            if (this.state.gameMode === 'ranked') return; 

                        this.state.isPaused = !this.state.isPaused;

                        if (this.state.isPaused) {
                if (this.els.gridContainer.querySelector('.tile-active')) {
                    this.state.pauseRequested = true;
                    this.els.pauseBtn.classList.add('btn-paused-pending');
                    return; 
                } else {
                    this.els.pauseBtn.classList.add('btn-paused-active');
                    this.state.isClickable = false;
                    if (this.state.actionTimeout) {
                        clearTimeout(this.state.actionTimeout);
                    }
                }
            } else {
                this.state.pauseRequested = false;
                this.els.pauseBtn.classList.remove('btn-paused-pending', 'btn-paused-active');

                if (this.els.gridContainer.classList.contains('flash-success-grid') || this.els.gridContainer.classList.contains('flash-failure-grid')) {
                    if (this.state.lives > 0 && this.els.gridContainer.classList.contains('flash-failure-grid')) {
                        this.startLevel();
                    } else if (this.els.gridContainer.classList.contains('flash-success-grid')) {
                        this.nextLevel();
                    }
                } else {
                    this.state.isClickable = true;
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
            const parts = this.state.savedRankedConfig.split('_');
            if(parts.length === 2 && c.rankedLives && c.rankedTime) {
                c.rankedLives.value = parts[0];
                c.rankedTime.value = parts[1];
            }

                        c.lives.value = this.state.savedSandboxLives;
            c.displayTime.value = this.state.savedSandboxTime;

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

                                const newRankedConfig = `${c.rankedLives.value}_${c.rankedTime.value}`;
                localStorage.setItem('vm_ranked_config', newRankedConfig);
                this.state.savedRankedConfig = newRankedConfig;

                                localStorage.setItem('vm_sandbox_lives', c.lives.value);
                localStorage.setItem('vm_sandbox_time', c.displayTime.value);

                                this.state.savedSandboxLives = parseInt(c.lives.value);
                this.state.savedSandboxTime = parseInt(c.displayTime.value);

                                this.preloadDistributionData(this.state.savedRankedConfig);
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

    VisualMemory.init();
});