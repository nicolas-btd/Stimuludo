

const pathTraceTranslations = {
    fr: {
        header_title: "PARCOURS DE CHEMIN",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            sq_20: "20 cases",
            sq_40: "40 cases",
            sq_60: "60 cases",
            sq_100: "100 cases",
            title: "Configuration",
            length: "Longueur :",
            allow_pause: "Autoriser la pause",
            grid_title: "Dimensions",
            options_title: "Options",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            score: "Temps",
            record: "Record :",
            best: "Meilleur",
            you: "Vous",
            top: "TOP",
            avg_time: "Temps Moyen",
            fastest: "Plus rapide",
            slowest: "Plus lent",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "PATH TRACE",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            sq_20: "20 squares",
            sq_40: "40 squares",
            sq_60: "60 squares",
            sq_100: "100 squares",
            title: "Settings",
            length: "Length:",
            allow_pause: "Allow pause",
            grid_title: "Dimensions",
            options_title: "Options",
            cancel: "CANCEL",
            save: "APPLY"
        },
        results: {
            new_record: "NEW RECORD!",
            score: "Time",
            record: "Best:",
            best: "Best",
            you: "You",
            top: "TOP",
            avg_time: "Avg Time",
            fastest: "Fastest",
            slowest: "Slowest",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.path_trace = pathTraceTranslations.fr;
    translations.en.path_trace = pathTraceTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, pathTraceTranslations[lang])
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, pathTraceTranslations['en']);
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


        const PathTraceGame = {
        state: {
            gameMode: 'ranked',
            currentState: 'PLAYING',
            score: 0,
            timeLeft: 0,
            isActive: false,
            isPaused: false,
            hasStartedMoving: false,
            timerId: null,

            path: [],
            playerIndex: 0,
            configPathLength: 40,
            configGridSize: 15,

            currentPathStartTime: 0,
            sessionSolveTimes: [],

            savedRankedLength: "40",
            savedSandboxConfig: {},
            distributionDataByConfig: {}
        },

        els: {
            workspace: document.getElementById('path-workspace'),
            grid: document.getElementById('grid'),
            player: document.getElementById('player'),
            timer: document.getElementById('timer'),
            score: document.getElementById('score'),
            board: document.querySelector('.game-board'),
            dpadBtns: document.querySelectorAll('.dpad-btn'),

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
                rankedLength: document.getElementById('ranked-length-val'),
                dimLength: document.getElementById('dim-length')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('size')) {
                this.state.savedSizeRanked = parseInt(params.get('size'), 10);
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

            window.addEventListener('resize', () => {
                if (this.state.isActive && this.state.currentState === 'PLAYING') {
                    this.calculateOptimalLayout();
                    this.updatePlayerPosition();
                }
            });

            this.els.workspace.classList.remove('blurred');
            this.startGame();


                        this.preloadDistributionData(`${this.state.savedRankedLength}`);
        },

        loadUserPreferences() {
            const c = this.els.config;
            const savedLength = localStorage.getItem('pt_ranked_length');
            if (savedLength !== null) {
                if(c.rankedLength) c.rankedLength.value = savedLength;
                this.state.savedRankedLength = savedLength;
            } else { this.state.savedRankedLength = "40"; }

            const sDims = localStorage.getItem('pt_dims');
            if (sDims && c.dimLength) {
                try {
                    const parsed = JSON.parse(sDims);
                    c.dimLength.value = parsed.length;
                } catch (e) { }
            }
            this.saveSandboxConfigSnapshot();
        },

        saveSandboxConfigSnapshot() {
            const c = this.els.config;
            this.state.savedSandboxConfig = {
                dims: {
                    length: c.dimLength ? c.dimLength.value : 40
                }
            };
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

        startGame() {
            this.state.currentState = 'PLAYING';
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.hasStartedMoving = false;
            this.state.score = 0;
            this.els.score.textContent = "1";

            this.els.workspace.classList.remove('blurred');

            if (this.state.gameMode === 'ranked') {
                this.state.configPathLength = parseInt(this.state.savedRankedLength);
                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                const s = this.state.savedSandboxConfig;
                this.state.configPathLength = parseInt(s.dims.length);
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = 'visible';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'none';
                }
            }

            this.updatePauseIcon();
            this.resetTimer();
            this.state.timeLeft = 0;
            this.updateTimerUI();
            this.generateLevel();
        },

        generatePath(targetLength) {
            let size = Math.max(6, Math.ceil(Math.sqrt(targetLength * 3)));

            let fullPath = [];
            let visited = new Set();
            let recursions = 0;

            function getNeighbors(p, currentSize) {
                return [
                    { x: p.x + 1, y: p.y, dir: 'R' }, { x: p.x - 1, y: p.y, dir: 'L' },
                    { x: p.x, y: p.y + 1, dir: 'D' }, { x: p.x, y: p.y - 1, dir: 'U' }
                ].filter(n => n.x >= 0 && n.x < currentSize && n.y >= 0 && n.y < currentSize);
            }

            function isStrict(p, currentPath) {
                let neighborsInPath = 0;
                for (const node of currentPath) {
                    if (Math.abs(node.x - p.x) + Math.abs(node.y - p.y) === 1) {
                        neighborsInPath++;
                    }
                }
                return neighborsInPath === 1;
            }

            function solve(current, dir1, dir2, targetLen, currentSize) {
                if (fullPath.length === targetLen) return true;
                recursions++;
                if (recursions > 3000) return false;

                const neighbors = getNeighbors(current, currentSize).sort(() => Math.random() - 0.5);
                for (const n of neighbors) {
                    if (n.dir === dir1 && n.dir === dir2) continue;

                    if (!visited.has(`${n.x},${n.y}`) && isStrict(n, fullPath)) {
                        visited.add(`${n.x},${n.y}`);
                        fullPath.push(n);

                        if (solve(n, n.dir, dir1, targetLen, currentSize)) return true;

                        fullPath.pop();
                        visited.delete(`${n.x},${n.y}`);
                    }
                }
                return false;
            }

            let attempts = 0;

            while (true) {
                recursions = 0;
                let start = { x: Math.floor(size / 2), y: Math.floor(size / 2) };
                fullPath = [start];
                visited = new Set([`${start.x},${start.y}`]);

                if (solve(start, null, null, targetLength, size)) {
                    this.state.configGridSize = size;
                    return fullPath;
                }
                attempts++;
                if (attempts > 25) {
                    size++;
                    attempts = 0;
                }
            }
        },

        generateLevel() {
            if (!this.state.isActive) return;

            this.state.path = this.generatePath(this.state.configPathLength);
            this.state.playerIndex = 0;

            this.calculateOptimalLayout();
            this.renderGrid();
            this.updatePlayerPosition();
        },

        calculateOptimalLayout() {
            if (!this.els.workspace) return;
            const containerRect = this.els.workspace.getBoundingClientRect();

            let availW = containerRect.width - 20;
            let availH = containerRect.height - 20;

            const size = this.state.configGridSize;

            let maxGridW = availW;
            let maxGridH = availH;

            let cellSizeW = (maxGridW - (size - 1)) / size;
            let cellSizeH = (maxGridH - (size - 1)) / size;

            let cellSize = Math.floor(Math.min(cellSizeW, cellSizeH));

            cellSize = Math.max(6, cellSize);

            this.els.workspace.style.setProperty('--cell-size', `${cellSize}px`);
            this.els.workspace.style.setProperty('--grid-size', size);
        },

        renderGrid() {
            const grid = this.els.grid;
            grid.innerHTML = '';
            const size = this.state.configGridSize;

            for (let y = 0; y < size; y++) {
                for (let x = 0; x < size; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell';
                    cell.dataset.x = x;
                    cell.dataset.y = y;
                    if (this.state.path.length > 0) {
                        if (x === this.state.path[0].x && y === this.state.path[0].y) cell.classList.add('start');
                        if (x === this.state.path[this.state.path.length - 1].x && y === this.state.path[this.state.path.length - 1].y) cell.classList.add('end');
                    }
                    grid.appendChild(cell);
                }
            }

            this.state.path.forEach(p => {
                const cellIndex = p.y * size + p.x;
                if (grid.children[cellIndex]) grid.children[cellIndex].classList.add('path');
            });
        },

        updatePlayerPosition() {
            if (this.state.path.length === 0) return;
            const current = this.state.path[this.state.playerIndex];
            const size = this.state.configGridSize;
            const targetCell = this.els.grid.children[current.y * size + current.x];
            if (!targetCell) return;

            const gridRect = this.els.grid.getBoundingClientRect();
            const cellRect = targetCell.getBoundingClientRect();

            const offsetX = cellRect.left - gridRect.left;
            const offsetY = cellRect.top - gridRect.top;

            const playerSize = this.els.player.offsetWidth;
            const cellSize = targetCell.offsetWidth;

            this.els.player.style.left = `${4 + offsetX + (cellSize - playerSize) / 2}px`;
            this.els.player.style.top = `${4 + offsetY + (cellSize - playerSize) / 2}px`;

            this.els.score.textContent = this.state.playerIndex + 1;
        },

        handleMove(direction) {
            if (!this.state.isActive || this.state.isPaused) return;

            if (!this.state.hasStartedMoving) {
                this.state.hasStartedMoving = true;
                this.state.currentPathStartTime = performance.now();
                this.startTimer();
            }

            const next = this.state.path[this.state.playerIndex + 1];
            const current = this.state.path[this.state.playerIndex];
            let movedCorrectly = false;

            if (direction === 'ArrowUp' && next.y === current.y - 1 && next.x === current.x) movedCorrectly = true;
            if (direction === 'ArrowDown' && next.y === current.y + 1 && next.x === current.x) movedCorrectly = true;
            if (direction === 'ArrowLeft' && next.x === current.x - 1 && next.y === current.y) movedCorrectly = true;
            if (direction === 'ArrowRight' && next.x === current.x + 1 && next.y === current.y) movedCorrectly = true;

            if (movedCorrectly) {
                this.state.playerIndex++;
                this.updatePlayerPosition();
                if (this.state.playerIndex === this.state.path.length - 1) this.pathCompleted();
            } else {
                this.failMove();
            }
        },

        failMove() {
            this.els.player.classList.add('error');
            SoundEngine.playError();

            this.resetTimer();

            setTimeout(() => {
                this.els.player.classList.remove('error');

                this.state.hasStartedMoving = false;
                this.state.timeLeft = 0;
                this.updateTimerUI();
                this.els.score.textContent = "1";

                this.generateLevel();
            }, 200);
        },

        pathCompleted() {
            SoundEngine.playHit();
            const timeTaken = (performance.now() - this.state.currentPathStartTime) / 1000;
            this.state.score = parseFloat(timeTaken.toFixed(3));

            this.els.board.classList.remove('flash-success');
            void this.els.board.offsetWidth;
            this.els.board.classList.add('flash-success');

            this.endGame();
        },

        async endGame() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';
            clearInterval(this.state.timerId);
            SoundEngine.playEnd();

            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';

            const configString = `${this.state.savedRankedLength}`;

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = this.state.score.toFixed(2);

                this.saveScoreToDatabase(this.state.score, configString);

                const recordKey = `pt_best_ranked_${configString}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseFloat(savedBest) : null;
                let isRecord = false;

                if (best === null || this.state.score < best) {
                    best = this.state.score;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, configString);
                }

                if (isRecord && savedBest !== null) {
                    this.els.newRecordMsg.style.visibility = 'visible';
                    this.els.newRecordMsg.style.opacity = '1';
                } else {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }
                await this.drawDistributionChart(this.state.score, best, configString);
                this.preloadDistributionData(configString);

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                this.els.newRecordMsg.style.visibility = 'hidden';
                this.els.newRecordMsg.style.opacity = '0';
                this.els.sandboxScore.textContent = this.state.score.toFixed(2);

                this.state.sessionSolveTimes.push(this.state.score);

                if (this.state.sessionSolveTimes.length > 0) {
                    const sum = this.state.sessionSolveTimes.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.state.sessionSolveTimes.length).toFixed(2);
                    const fastest = Math.min(...this.state.sessionSolveTimes).toFixed(2);
                    const slowest = Math.max(...this.state.sessionSolveTimes).toFixed(2);
                    if (this.els.statAvgTime) this.els.statAvgTime.textContent = `${avg}s`;
                    if (this.els.statFastest) this.els.statFastest.textContent = `${fastest}s`;
                    if (this.els.statSlowest) this.els.statSlowest.textContent = `${slowest}s`;
                    this.renderHistoryChart();
                }
            }
            this.toggleOverlay(this.els.overlayOver, true);
        },

        renderHistoryChart() {
            if (!this.els.historyChart) return;
            this.els.historyChart.innerHTML = '';
            const minTime = Math.min(...this.state.sessionSolveTimes);
            const maxTime = Math.max(...this.state.sessionSolveTimes);
            const buffer = (maxTime - minTime) * 0.2;
            let chartMin = minTime - buffer;
            if (chartMin < 0) chartMin = 0;
            let chartMax = maxTime + buffer;
            if (chartMin === chartMax) { chartMin -= 1; chartMax += 1; }
            const chartRange = chartMax - chartMin;

            this.state.sessionSolveTimes.forEach((time, index) => {
                let heightPercent = ((time - chartMin) / chartRange) * 100;
                if (heightPercent < 5) heightPercent = 5;
                const barContainer = document.createElement('div');
                barContainer.className = 'history-bar-wrapper';
                const bar = document.createElement('div');
                bar.className = 'history-bar'; bar.style.height = `${heightPercent}%`;
                const label = document.createElement('span');
                label.textContent = time.toFixed(2) + 's'; label.className = 'bar-label';
                const indexLabel = document.createElement('span');
                indexLabel.textContent = index + 1; indexLabel.className = 'bar-index';
                barContainer.appendChild(label); barContainer.appendChild(bar); barContainer.appendChild(indexLabel);
                this.els.historyChart.appendChild(barContainer);
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

        async saveScoreToDatabase(score, configString) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: score }, '*');
                return;
            }
            try {
                fetch('/api/scores', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'path_trace', score: score, details: { config: configString }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, configString) {
            try {
                fetch('/api/best', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `pt_ranked_${configString}`, score: score, details: { config: configString }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error(error); }
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
                        ${currentScore.toFixed(2)}
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
                        ${bestScore.toFixed(2)}
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
                const val = parseFloat((minX + percentX * range).toFixed(2));
                const snappedPercentX = (val - minX) / range;

                let areaToLeft = 0;
                for (let i = 0; i <= steps; i++) {
                    let pointVal = minX + (i / steps) * range;
                    if (pointVal <= val) areaToLeft += densities[i].y;
                }

                                let percentile = clamp((areaToLeft / totalArea) * 100, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                tooltip.style.left = `${snappedPercentX * 100}%`;
                tooltip.innerHTML = `<strong>${val.toFixed(2)}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                tooltip.classList.remove('hidden'); 
                hoverLine.style.left = `${snappedPercentX * 100}%`; 
                hoverLine.classList.remove('hidden');
            };
            distContainer.onmouseleave = () => { tooltip.classList.add('hidden'); hoverLine.classList.add('hidden'); };
        },

        async preloadDistributionData(configString) {
            if (!configString) configString = `${this.state.savedRankedLength}`;
            if (!this.state.distributionDataByConfig) this.state.distributionDataByConfig = {};

                        try {
                const res = await fetch(`/api/scores/distribution/path_trace?config=${configString}`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (res.ok) {
                    this.state.distributionDataByConfig[configString] = await res.json();
                } else {
                    this.state.distributionDataByConfig[configString] = [];
                }
            } catch (e) {
                console.error(e);
                this.state.distributionDataByConfig[configString] = [];
            }
        },

        startTimer() {
            this.updateTimerUI();
            this.state.timerId = setInterval(() => {
                this.state.timeLeft += 0.01;
                this.updateTimerUI();
            }, 10);
        },

        resetTimer() { clearInterval(this.state.timerId); },

        updateTimerUI() {
            this.els.timer.textContent = this.state.timeLeft.toFixed(2);
        },

        togglePause() {
            if (!this.state.isActive || this.state.gameMode === 'ranked') return;
            this.state.isPaused = !this.state.isPaused;
            if (this.state.isPaused) clearInterval(this.state.timerId);
            else {
                if (this.state.hasStartedMoving) this.startTimer();
            }
            this.updatePauseIcon();
        },

        updatePauseIcon() {
            if (this.state.isPaused) { this.els.iconPause.classList.add('hidden'); this.els.iconPlay.classList.remove('hidden'); }
            else { this.els.iconPlay.classList.add('hidden'); this.els.iconPause.classList.remove('hidden'); }
        },

        toggleOverlay(el, show) {
            if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
            else { el.classList.remove('visible'); el.classList.add('hidden'); }
        },

        updateSettingsView(mode) {
            if (mode === 'ranked') { this.els.settingsGroupRanked.style.display = 'block'; this.els.settingsGroupSandbox.style.display = 'none'; }
            else { this.els.settingsGroupRanked.style.display = 'none'; this.els.settingsGroupSandbox.style.display = 'block'; }
        },

        restoreConfigUI() {
            const c = this.els.config;
            if(c.rankedLength) c.rankedLength.value = this.state.savedRankedLength;
            const s = this.state.savedSandboxConfig;
            if (s && s.dims) {
                if(c.dimLength) c.dimLength.value = s.dims.length;
            }
            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if (activeRadio) activeRadio.checked = true;
            this.updateSettingsView(this.state.gameMode);
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
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || elem.classList.contains('ios-fullscreen');

            if (!isFullscreen) {
                const isMobile = window.innerWidth <= 700 || 'ontouchstart' in window;
                if (isMobile) {
                    this.enableFallbackFullscreen();
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
                    document.exitFullscreen();
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
            els.modeToggleRadios.forEach(radio => radio.addEventListener('change', (e) => this.updateSettingsView(e.target.value)));
            els.restartBtn.addEventListener('click', () => {
                this.toggleOverlay(this.els.overlayOver, false);
                this.startGame();
            });
            if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleOverlay(this.els.overlayOver, false);
                    this.startGame();
                });
            }
            els.pauseBtn.addEventListener('click', () => this.togglePause());
            if (els.fullscreenBtn) {
                els.fullscreenBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.toggleFullscreen();
                });

                const exitFsBtn = document.querySelector('.exit-fs-btn');
                if (exitFsBtn) {
                    exitFsBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        this.toggleFullscreen();
                    });
                }

                document.addEventListener('fullscreenchange', () => {
                    this.updateFullscreenIcon();
                    if (this.state.isActive) setTimeout(() => { this.calculateOptimalLayout(); this.updatePlayerPosition(); }, 100);
                });
            }

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = this.els.settingsPanel.classList.contains('panel-visible');
                const isGameOver = this.els.overlayOver.classList.contains('visible');

                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();
                if (e.code === 'Escape') { e.preventDefault(); this.toggleSettings(); }
                if (e.code === 'Space' && this.state.isActive && !isMenuOpen && this.state.gameMode === 'sandbox') { e.preventDefault(); this.togglePause(); }

                if (e.code === 'Enter') {
                    if (isMenuOpen) { e.preventDefault(); els.saveSettings.click(); }
                    else if (isGameOver) { e.preventDefault(); this.toggleOverlay(this.els.overlayOver, false); this.startGame(); }
                }

                if (this.state.currentState === 'PLAYING') {
                    const key = e.key;
                    const keyLower = key.toLowerCase();
                    let moveDir = null;

                    if (key === 'ArrowUp' || keyLower === 'w' || keyLower === 'z') moveDir = 'ArrowUp';
                    else if (key === 'ArrowDown' || keyLower === 's') moveDir = 'ArrowDown';
                    else if (key === 'ArrowLeft' || keyLower === 'a' || keyLower === 'q') moveDir = 'ArrowLeft';
                    else if (key === 'ArrowRight' || keyLower === 'd') moveDir = 'ArrowRight';

                    if (moveDir) {
                        e.preventDefault();
                        this.handleMove(moveDir);
                    }
                }
            });

            els.dpadBtns.forEach(btn => {
                const handleDpadPress = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (this.state.currentState === 'PLAYING') {
                        this.handleMove(btn.dataset.dir);
                    }
                };
                btn.addEventListener('touchstart', handleDpadPress, { passive: false });
                btn.addEventListener('mousedown', handleDpadPress);
            });

            els.workspace.addEventListener('click', (e) => {
                if (this.state.currentState !== 'PLAYING') return;
                const cell = e.target.closest('.cell');
                if (!cell) return;
                const x = parseInt(cell.dataset.x);
                const y = parseInt(cell.dataset.y);
                const current = this.state.path[this.state.playerIndex];

                if ((Math.abs(x - current.x) === 1 && y === current.y) || (Math.abs(y - current.y) === 1 && x === current.x)) {
                    if (x > current.x) this.handleMove('ArrowRight');
                    else if (x < current.x) this.handleMove('ArrowLeft');
                    else if (y > current.y) this.handleMove('ArrowDown');
                    else if (y < current.y) this.handleMove('ArrowUp');
                }
            });

            els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) { document.exitFullscreen(); if (this.els.settingsPanel.classList.contains('panel-hidden')) this.toggleSettings(); }
                else this.toggleSettings();
            });
            if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));
            if (els.saveSettings) els.saveSettings.addEventListener('click', () => {
                const c = this.els.config;
                const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;
                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);

                if(c.rankedLength) {
                    localStorage.setItem('pt_ranked_length', c.rankedLength.value);
                    this.state.savedRankedLength = c.rankedLength.value;
                }

                const safeVal = (val, min, max) => Math.max(min, Math.min(max, parseInt(val) || min));

                                if (c.dimLength) {
                    const dimsData = { length: safeVal(c.dimLength.value, 5, 200) };
                    localStorage.setItem('pt_dims', JSON.stringify(dimsData));
                }

                this.saveSandboxConfigSnapshot();

                                this.preloadDistributionData(`${this.state.savedRankedLength}`);

                this.els.settingsPanel.classList.remove('panel-visible'); this.els.settingsPanel.classList.add('panel-hidden');

                this.startGame();
            });
            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel.contains(e.target) || els.settingsToggle.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });
            window.addEventListener('storage', (e) => { if (e.key === 'globalOpaque') this.loadBackgroundPreference(); });
        }
    };

    PathTraceGame.init();
});