
const sgTranslations = {
    fr: {
        header_title: "SCHULTE GRID",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            time: "Temps :",
            time_sandbox: "Temps (sec) :",
            time_hint: "Mettez 0 pour jouer sans limite.",
            grid_size: "Taille de grille :",
            ranked_hint: "Le but est de finir le plus vite possible.",
            max_points: "Items maximum :",
            show_ms: "Afficher les centièmes",
            allow_pause: "Autoriser la pause",
            flash_effect: "Flash visuel",
            mode: "Mode :",
            mode_normal: "Normal",
            mode_360: "360°",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            score: "Score :",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            pause_hint: ""
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            score: "Score Final",
            record: "Record :",
            best: "Meilleur",
            you: "Vous",
            speed: "Vitesse",
            avg_time: "Moyenne",
            fastest: "Plus rapide",
            slowest: "Plus lent",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "SCHULTE GRID",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            time: "Time:",
            time_sandbox: "Time (sec):",
            time_hint: "Set to 0 to play without limits.",
            grid_size: "Grid size:",
            ranked_hint: "The goal is to finish as fast as possible.",
            max_points: "Max Items:",
            show_ms: "Show milliseconds",
            allow_pause: "Allow pause",
            flash_effect: "Visual flash",
            mode: "Mode:",
            mode_normal: "Normal",
            mode_360: "360°",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            score: "Score:",
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            pause_hint: ""
        },
        results: {
            new_record: "NEW RECORD!",
            score: "Final Score",
            record: "Best:",
            best: "Best",
            you: "You",
            speed: "Speed",
            avg_time: "Average",
            fastest: "Fastest",
            slowest: "Slowest",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.sg = sgTranslations.fr;
    translations.en.sg = sgTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    const fallbackLang = lang === 'fr' ? 'fr' : 'en';
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, sgTranslations[fallbackLang])
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, sgTranslations.en);
}

document.addEventListener('DOMContentLoaded', () => {

    const SchulteGrid = {
        state: {
            gameMode: 'ranked',
            score: 0,
            timeLeft: 0,
            isActive: false,
            isPaused: false,
            timerId: null,
            currentState: 'PRE_START',

            currentExpectedNumber: 1,
            gridSize: 5,

                        operationTimes: [],
            startTime: 0,
            pauseStartTime: 0,
            distributionDataByConfig: {},

            savedGridSizeSandbox: 5,
            savedShowMsSandbox: true,
            savedGridSizeRanked: 5,
            savedModeRanked: 'normal',
            savedModeSandbox: 'normal',
        },

        els: {
            gameArea: document.getElementById('game-area'),
            workspace: document.getElementById('sg-workspace'),
            statusOverlay: document.getElementById('status-overlay'),
            score: document.getElementById('score'),
            timer: document.getElementById('timer'),
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

            statOpm: document.getElementById('stat-opm'),
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
                gridSizeSandbox: document.getElementById('grid-size-val'),
                gridSizeRanked: document.getElementById('grid-size-ranked'),
                modeSandbox: document.getElementById('mode-sandbox'),
                modeRanked: document.getElementById('mode-ranked'),
                showMs: document.getElementById('show-ms')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }

            this.loadUserPreferences();

                        if (params.has('size')) {
                this.state.savedGridSizeRanked = parseInt(params.get('size'), 10);
            }
            if (params.has('type')) {
                this.state.savedModeRanked = params.get('type');
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

            this.setPreStartState();


                                    const initKey = `${this.state.savedGridSizeRanked}x${this.state.savedGridSizeRanked}_${this.state.savedModeRanked}`;
            this.preloadDistributionData(initKey);
        },

        loadUserPreferences() {
            const c = this.els.config;
            const savedGridSizeS = localStorage.getItem('sg_grid_sandbox');
            if (savedGridSizeS !== null) {
                if(c.gridSizeSandbox) c.gridSizeSandbox.value = savedGridSizeS;
                this.state.savedGridSizeSandbox = parseInt(savedGridSizeS);
            }
            const savedGridSizeR = localStorage.getItem('sg_grid_ranked');
            if (savedGridSizeR !== null) {
                if(c.gridSizeRanked) c.gridSizeRanked.value = savedGridSizeR;
                this.state.savedGridSizeRanked = parseInt(savedGridSizeR);
            }
            const savedMs = localStorage.getItem('sg_show_ms_sandbox');
            if (savedMs !== null) {
                if(c.showMs) c.showMs.checked = (savedMs === 'true');
                this.state.savedShowMsSandbox = (savedMs === 'true');
            }
            const savedModeR = localStorage.getItem('sg_mode_ranked');
            if (savedModeR !== null) {
                if(c.modeRanked) c.modeRanked.value = savedModeR;
                this.state.savedModeRanked = savedModeR;
            }
            const savedModeS = localStorage.getItem('sg_mode_sandbox');
            if (savedModeS !== null) {
                if(c.modeSandbox) c.modeSandbox.value = savedModeS;
                this.state.savedModeSandbox = savedModeS;
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
            this.resetTimer();
            this.state.isActive = false;
            this.state.currentState = 'PRE_START';

            this.toggleOverlay(this.els.overlayOver, false);
            this.els.statusOverlay.classList.remove('hidden');

            this.els.workspace.classList.add('blurred');

            this.state.currentExpectedNumber = 1;
            if (this.els.score) this.els.score.textContent = "1";
            this.els.workspace.innerHTML = '';

            this.state.timeLeft = 0;
            this.updateTimerUI();

            if (this.state.gameMode === 'ranked') {
                this.els.pauseBtn.style.display = 'none';
                this.els.ingameRestartBtn.style.display = '';
                this.els.ingameRestartBtn.style.visibility = 'visible';

                this.els.pauseHint.textContent = "";

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
            } else {
                this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = 'visible';
                this.els.statusOverlay.classList.add('hidden');
                this.els.workspace.classList.remove('blurred');
                this.state.gridSize = this.state.savedGridSizeSandbox;
                this.buildGrid();
            }
        },

        startGame() {
            this.state.currentState = 'PLAYING';
            this.state.score = 0;
            this.state.operationTimes = [];
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.currentExpectedNumber = 1;
            this.state.lastClickElapse = 0;

            this.els.statusOverlay.classList.add('hidden');

            this.els.workspace.classList.remove('blurred');

            this.updatePauseIcon();
            this.resetTimer();

            this.state.timeLeft = 0;
            this.startTimer();

            this.state.gridSize = this.state.gameMode === 'ranked' ? this.state.savedGridSizeRanked : this.state.savedGridSizeSandbox;
            this.buildGrid();
        },

        buildGrid() {
            this.els.workspace.innerHTML = '';

                        const n = this.state.gridSize;
            const totalCells = n * n;
            let numbers = [];
            for (let i = 1; i <= totalCells; i++) {
                numbers.push(i);
            }

            for (let i = numbers.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
            }

            const gridContainer = document.createElement('div');
            gridContainer.className = 'schulte-grid';
            gridContainer.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
            gridContainer.style.gridTemplateRows = `repeat(${n}, 1fr)`;

            numbers.forEach(num => {
                const cell = document.createElement('div');
                cell.className = 'schulte-cell';

                                const numSpan = document.createElement('span');
                numSpan.className = 'schulte-number';
                numSpan.textContent = num;

                const currentMode = this.state.gameMode === 'ranked' ? this.state.savedModeRanked : this.state.savedModeSandbox;
                if (currentMode === '360') {
                    const rotation = Math.floor(Math.random() * 360);
                    numSpan.style.setProperty('--rotation', `${rotation}deg`);
                    numSpan.classList.add('rotate-360');


                                        if (num.toString().includes('6') || num.toString().includes('9')) {
                        numSpan.classList.add('underline-indicator');
                    }
                }

                cell.appendChild(numSpan);
                cell.addEventListener('mousedown', () => this.handleCellClick(cell, num));
                cell.addEventListener('touchstart', (e) => { e.preventDefault(); this.handleCellClick(cell, num); });
                gridContainer.appendChild(cell);
            });

            this.els.workspace.appendChild(gridContainer);
            this.state.startTime = performance.now();
        },

        handleCellClick(cell, num) {
            if (this.state.gameMode === 'sandbox' && this.state.currentState === 'PRE_START') {
                if (num === 1) {
                    this.state.currentState = 'PLAYING';
                    this.state.isActive = true;
                    this.startTimer();
                } else {
                    return;
                }
            }

            if (this.state.currentState !== 'PLAYING' || this.state.isPaused) return;

            if (num === this.state.currentExpectedNumber) {
                const currentElapse = this.state.timeLeft;
                if (this.state.gameMode === 'ranked' || num > 1) {
                    const dt = currentElapse - (this.state.lastClickElapse || 0);
                    this.state.operationTimes.push(dt);
                }
                this.state.lastClickElapse = currentElapse;

                cell.classList.add('clicked', 'success-flash');
                setTimeout(() => cell.classList.remove('success-flash'), 150);

                                this.state.currentExpectedNumber++;
                if (this.els.score) this.els.score.textContent = this.state.currentExpectedNumber;

                                if (this.state.currentExpectedNumber > this.state.gridSize * this.state.gridSize) {
                    if (this.els.score) this.els.score.textContent = this.state.currentExpectedNumber - 1;
                    this.endGame();
                }
            } else {
                cell.classList.add('error');
                if (typeof navigator.vibrate === 'function') navigator.vibrate(50);
                setTimeout(() => cell.classList.remove('error'), 300);
            }
        },

        startTimer() {
            this.updateTimerUI();
            this.state.timerId = setInterval(() => {
                this.state.timeLeft += 0.01;
                this.updateTimerUI();
            }, 10);
        },

        resetTimer() {
            clearInterval(this.state.timerId);
        },

        updateTimerUI() {
            let displayTime;
            const showMs = this.state.gameMode === 'sandbox' ? this.state.savedShowMsSandbox : true;

            if (showMs) {
                displayTime = this.state.timeLeft.toFixed(2);
            } else {
                displayTime = Math.floor(this.state.timeLeft);
            }
            this.els.timer.textContent = displayTime;
        },

        togglePause() {
            if (!this.state.isActive || this.state.gameMode === 'ranked') return;
            this.state.isPaused = !this.state.isPaused;

            if (this.state.isPaused) {
                clearInterval(this.state.timerId);
                this.state.pauseStartTime = performance.now();
                this.els.workspace.classList.add('blurred');
                if (this.els.inputWrapper) this.els.inputWrapper.classList.add('blurred');
                if (this.els.keyboardContainer) this.els.keyboardContainer.classList.add('blurred');
            } else {
                this.startTimer();
                const pauseDuration = performance.now() - this.state.pauseStartTime;
                this.state.startTime += pauseDuration;
                this.els.workspace.classList.remove('blurred');
                if (this.els.inputWrapper) this.els.inputWrapper.classList.remove('blurred');
                if (this.els.keyboardContainer) this.els.keyboardContainer.classList.remove('blurred');
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

        async endGame() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';
            clearInterval(this.state.timerId);

            const finalScore = this.state.timeLeft;

            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: finalScore }, '*');
                return;
            }

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');

                this.els.rankedScore.textContent = finalScore.toFixed(2);

                                const gridStr = `${this.state.gridSize}x${this.state.gridSize}`;

                this.saveScoreToDatabase(finalScore, gridStr);

                const recordKey = `sg_best_ranked_${gridStr}_${this.state.savedModeRanked}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseFloat(savedBest) : null;
                let isRecord = false;


                                if (best === null || finalScore < best) {
                    best = finalScore;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, gridStr);
                }

                if (isRecord && savedBest !== null) {
                    if (this.els.newRecordMsg) {
                        this.els.newRecordMsg.style.visibility = 'visible';
                        this.els.newRecordMsg.style.opacity = '1';
                    }
                } else {
                    if (this.els.newRecordMsg) {
                        this.els.newRecordMsg.style.visibility = 'hidden';
                        this.els.newRecordMsg.style.opacity = '0';
                    }
                }

                const chartKey = `${gridStr}_${this.state.savedModeRanked}`;
                this.drawDistributionChart(finalScore, best, chartKey);

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');

                if (this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                this.els.sandboxScore.textContent = finalScore.toFixed(2);

                                let avg = 0, fastest = 0, slowest = 0, opm = 0;
                if (this.state.operationTimes.length > 0) {
                    const times = this.state.operationTimes;
                    avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2);
                    fastest = Math.min(...times).toFixed(2);
                    slowest = Math.max(...times).toFixed(2);
                    opm = Math.round((times.length / finalScore) * 60) || 0;
                }

                if (this.els.statOpm) this.els.statOpm.textContent = `${opm} /min`;
                if (this.els.statAvgTime) this.els.statAvgTime.textContent = `${avg}s`;
                if (this.els.statFastest) this.els.statFastest.textContent = `${fastest}s`;
                if (this.els.statSlowest) this.els.statSlowest.textContent = `${slowest}s`;

                if (this.els.historyChart && this.state.operationTimes.length > 0) {
                    this.els.historyChart.innerHTML = '';
                    const maxTime = Math.max(...this.state.operationTimes, 0.1);
                    this.state.operationTimes.forEach((time, index) => {
                        const heightPercent = Math.max((time / maxTime) * 100, 5);

                                                const barContainer = document.createElement('div');
                        barContainer.className = 'history-bar-wrapper';

                                                const bar = document.createElement('div');
                        bar.className = 'history-bar'; bar.style.height = `${heightPercent}%`;

                                                const label = document.createElement('div');
                        label.textContent = time.toFixed(2) + 's'; label.className = 'bar-label';

                                                const indexLabel = document.createElement('div');
                        indexLabel.textContent = index + 1; indexLabel.className = 'bar-index';

                                                barContainer.appendChild(label);
                        barContainer.appendChild(bar);
                        barContainer.appendChild(indexLabel);
                        this.els.historyChart.appendChild(barContainer);
                    });
                }
            }

            this.toggleOverlay(this.els.overlayOver, true);
            this.els.pauseBtn.style.visibility = 'hidden';
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
        },

        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },

        async saveScoreToDatabase(score, grid) {

                        if (window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: score }, '*');
            }

            const mode = this.state.gameMode === 'ranked' ? this.state.savedModeRanked : this.state.savedModeSandbox;
            try {
                fetch('/api/scores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'schulte_grid', score: score, details: { grid: grid, mode: mode }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, grid) {
            const mode = this.state.savedModeRanked;
            try {
                fetch('/api/best', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        game_mode_key: `sg_ranked_${grid}_${mode}`,
                        score: score,
                        details: { grid: grid, mode: mode }
                    })
                });
            } catch (error) { console.error(error); }
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
            if (!this.state.distributionDataByConfig) this.state.distributionDataByConfig = {};
            if (!this.state.distributionDataByConfig[configKey]) this.state.distributionDataByConfig[configKey] = [];


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
            let stdDev = Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n) || 1;


                        if (stdDev < 2) stdDev = 2; 

            let bandwidth = 1.06 * stdDev * Math.pow(n, -0.2);
            if (bandwidth < 1.5) bandwidth = 1.5;

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

                        const range = maxX - minX;

            const kernel = (x) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
            const getDensity = (x) => {
                let sum = 0;
                for (let i = 0; i < n; i++) {
                    sum += kernel((x - scores[i]) / bandwidth);
                }
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


                                    distributionContainer.querySelectorAll('.dist-html-dot').forEach(el => el.remove());

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
                        ${currentScore.toFixed(2)}<span style="font-size: 0.65em; margin-left: 1px;">s</span>
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
                        ${bestScore.toFixed(2)}<span style="font-size: 0.65em; margin-left: 1px;">s</span>
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

                const val = minX + percentX * range;
                const valRounded = Math.round(val * 10) / 10;


                                let areaToLeft = 0;
                for (let i = 0; i <= steps; i++) {
                    let pointVal = minX + (i / steps) * range;
                    if (pointVal <= val) {
                        areaToLeft += densities[i].y;
                    }
                }

                let percentile = clamp((areaToLeft / totalArea) * 100, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                tooltip.style.left = `${percentX * 100}%`;
                tooltip.innerHTML = `<strong>${valRounded}s</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                tooltip.classList.remove('hidden');

                hoverLine.style.left = `${percentX * 100}%`;
                hoverLine.classList.remove('hidden');
            };

            distributionContainer.onmouseleave = () => {
                tooltip.classList.add('hidden');
                hoverLine.classList.add('hidden');
            };
        },

        async preloadDistributionData(configKey) {
            if (!configKey) {
                configKey = `${this.state.savedGridSizeRanked}x${this.state.savedGridSizeRanked}_${this.state.savedModeRanked}`;
            }
            const parts = configKey.split('_');
            const gridStr = parts[0];
            const mode = parts[1] || this.state.savedModeRanked;
            try {
                const res = await fetch(`/api/scores/distribution/schulte_grid?grid=${gridStr}&mode=${mode}`, {
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

            if(c.gridSizeSandbox) c.gridSizeSandbox.value = this.state.savedGridSizeSandbox;
            if(c.showMs) c.showMs.checked = this.state.savedShowMsSandbox;

            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if (activeRadio) activeRadio.checked = true;

            this.updateSettingsView(this.state.gameMode);
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
            const isHidden = panel.classList.contains('panel-hidden');

            if (forceClose || !isHidden) {
                this.restoreSettingsUI();
                panel.classList.remove('panel-visible');
                panel.classList.add('panel-hidden');

                if (this.state.gameMode === 'sandbox' && this.state.isActive && this.state.isPaused) {
                    this.togglePause();
                }
            } else {
                this.restoreSettingsUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');

                if (this.state.isActive && !this.state.isPaused && this.state.gameMode === 'sandbox') {
                    this.togglePause();
                }
            }
        },

        toggleFullscreen() {
            const elem = this.els.board;
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || elem.classList.contains('ios-fullscreen');

            if (!isFullscreen) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen().catch(err => {
                        this.enableFallbackFullscreen();
                    });
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                } else {
                    this.enableFallbackFullscreen();
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
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

            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel.contains(e.target) || els.settingsToggle.contains(e.target);

                if (isMenuOpen && !clickedInside) {
                    this.toggleSettings(true);
                }
            });

            els.gameArea.addEventListener('click', (e) => {
                if (this.state.currentState === 'PRE_START' && !e.target.closest('button')) {
                    this.startGame();
                }
            });

            els.modeToggleRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.updateSettingsView(e.target.value);
                });
            });

            els.restartBtn.addEventListener('click', () => {
                this.toggleOverlay(this.els.overlayOver, false);
                this.setPreStartState();
            });

            if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', () => {
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

            if (els.config.pointsSandbox) {
                els.config.pointsSandbox.addEventListener('input', (e) => {
                    if (els.config.pointsSandboxInput) els.config.pointsSandboxInput.value = e.target.value;
                });
            }

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const isOverVisible = this.els.overlayOver.classList.contains('visible');

                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();

                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }

                if (!this.state.isPaused && !isMenuOpen && !isOverVisible) {
                    let inputNum = null;
                    const azertyMap = {
                        '&': '1', 'é': '2', '"': '3', "'": '4', '(': '5',
                        '-': '6', '§': '6',
                        'è': '7',
                        '_': '8', '!': '8',
                        'ç': '9',
                        'à': '0', '@': '0', '°': '0'
                    };

                    if (e.code && e.code.startsWith('Digit')) inputNum = e.code.replace('Digit', '');
                    else if (e.code && e.code.startsWith('Numpad')) inputNum = e.code.replace('Numpad', '');
                    else if (/^[0-9]$/.test(e.key)) inputNum = e.key;
                    else if (azertyMap[e.key]) inputNum = azertyMap[e.key];

                    if (inputNum !== null && inputNum.length === 1 && inputNum >= '0' && inputNum <= '9') {

                                                if (this.state.currentInputString && this.state.currentInputString.length < 3) {
                            this.state.currentInputString += inputNum;
                            if(this.els.inputVal) this.els.inputVal.textContent = this.state.currentInputString;
                            if(typeof this.checkInput === 'function') this.checkInput(this.state.currentInputString);
                        }
                    }
                    else if (e.key === 'Backspace') {
                        if (this.state.currentState !== 'PRE_START' && this.state.currentInputString) {
                            this.state.currentInputString = this.state.currentInputString.slice(0, -1);
                            if(this.els.inputVal) this.els.inputVal.textContent = this.state.currentInputString;
                        }
                    }
                }

                if (e.code === 'Space' && this.state.isActive && !isMenuOpen && !isOverVisible) {
                    if (this.state.gameMode === 'sandbox') {
                        e.preventDefault();
                        this.togglePause();
                        return;
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
                        this.setPreStartState();
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
                }
                this.toggleSettings();
            });

            if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

            if (els.saveSettings) {
                els.saveSettings.addEventListener('click', () => {
                    const c = this.els.config;
                    const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;

                    this.state.gameMode = selectedMode;
                    window.history.replaceState(null, '', '?mode=' + selectedMode);

                    if (this.state.gameMode === 'sandbox') {
                        this.state.savedGridSizeSandbox = parseInt(c.gridSizeSandbox.value) || 5;
                        this.state.savedShowMsSandbox = c.showMs.checked;
                        this.state.savedModeSandbox = c.modeSandbox.value;

                        localStorage.setItem('sg_grid_sandbox', this.state.savedGridSizeSandbox);
                        localStorage.setItem('sg_show_ms_sandbox', this.state.savedShowMsSandbox);
                        localStorage.setItem('sg_mode_sandbox', this.state.savedModeSandbox);
                    } else if (this.state.gameMode === 'ranked') {
                        this.state.savedGridSizeRanked = parseInt(c.gridSizeRanked.value) || 5;
                        this.state.savedModeRanked = c.modeRanked.value;
                        localStorage.setItem('sg_grid_ranked', this.state.savedGridSizeRanked);
                        localStorage.setItem('sg_mode_ranked', this.state.savedModeRanked);


                                                                        const chartKey = `${this.state.savedGridSizeRanked}x${this.state.savedGridSizeRanked}_${this.state.savedModeRanked}`;
                        this.preloadDistributionData(chartKey);
                    }

                    this.updateSettingsView(this.state.gameMode);
                    this.toggleSettings(true);
                    this.setPreStartState();
                });
            }

            window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
            });
        }
    };

    SchulteGrid.init();
});