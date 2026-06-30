
const matrixTranslations = {
    fr: {
        header_title: "PRODUIT MATRICIEL",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            size: "Taille :",
            intervals: "Intervalles :",
            time: "Temps (sec) :",
            time_hint: "Mettez 0 pour jouer sans limite.",
            show_ms: "Afficher les centièmes",
            allow_pause: "Autoriser la pause",
            dims_title: "Dimensions des Matrices",
            coeffs_title: "Coefficients",
            options_title: "Options",
            to: "à",
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
            score: "Matrices Résolues",
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
        header_title: "MATRIX PRODUCT",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            size: "Size:",
            intervals: "Intervals:",
            time: "Time (sec):",
            time_hint: "Set to 0 for unlimited play.",
            show_ms: "Show milliseconds",
            allow_pause: "Allow pause",
            dims_title: "Matrix Dimensions",
            coeffs_title: "Coefficients",
            options_title: "Options",
            to: "to",
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
            score: "Matrices Solved",
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
    translations.fr.matrix = matrixTranslations.fr;
    translations.en.matrix = matrixTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, matrixTranslations[lang])
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, matrixTranslations['en']);
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


        const MatrixGame = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START',
            score: 0,
            timeLeft: 0,
            isActive: false,
            isPaused: false,
            timerId: null,

            matrixA: [],
            matrixB: [],
            matrixResult: [],
            dims: { rowsA: 2, common: 2, colsB: 2 },

            solveTimes: [],
            currentMatrixStartTime: 0,

            savedRankedSize: "2",
            savedRankedCoeff: "0_5",
            savedRankedTime: "60",
            savedSandboxConfig: {},
            distributionDataByConfig: {}
        },

        els: {
            workspace: document.getElementById('matrix-workspace'),
            statusOverlay: document.getElementById('status-overlay'),
            score: document.getElementById('score'),
            timer: document.getElementById('timer'),
            board: document.querySelector('.game-board'),

            pauseBtn: document.getElementById('pause-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'),
            iconPause: document.getElementById('icon-pause'),
            iconPlay: document.getElementById('icon-play'),
            restartBtn: document.getElementById('restart-btn'),
            validateBtn: document.getElementById('validate-btn'),

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
                rankedSize: document.getElementById('ranked-size-val'),
                rankedCoeff: document.getElementById('ranked-coeff-val'),
                rankedTime: document.getElementById('ranked-time-val'),
                rankedShowMs: document.getElementById('ranked-show-ms'),

                time: document.getElementById('time-val'),
                showMs: document.getElementById('show-ms'),
                allowPause: document.getElementById('allow-pause'),
                dimRowsA: document.getElementById('dim-rows-a'),
                dimCommon: document.getElementById('dim-common'),
                dimColsB: document.getElementById('dim-cols-b'),
                minCoeff: document.getElementById('min-coeff'),
                maxCoeff: document.getElementById('max-coeff')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('config')) {
                this.state.savedConfigRanked = params.get('config');
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
                if (this.state.isActive && this.state.currentState === 'PLAYING') this.calculateOptimalLayout();
            });

            if (this.state.gameMode === 'sandbox') {
                this.els.statusOverlay.classList.add('hidden');
                this.els.workspace.classList.remove('blurred');
                this.els.validateBtn.classList.remove('blurred');
                this.startGame();
            } else {
                this.setPreStartState();
            }
            const initKey = `mp_ranked_${this.state.savedRankedSize}_${this.state.savedRankedCoeff}_${this.state.savedRankedTime}`;
            this.preloadDistributionData(initKey);
        },

        loadUserPreferences() {
            const c = this.els.config;
            const savedSize = localStorage.getItem('mp_ranked_size');
            if (savedSize !== null) {
                c.rankedSize.value = savedSize;
                this.state.savedRankedSize = savedSize;
            } else { this.state.savedRankedSize = "2"; }
            const savedCoeff = localStorage.getItem('mp_ranked_coeff');
            if (savedCoeff !== null) {
                c.rankedCoeff.value = savedCoeff;
                this.state.savedRankedCoeff = savedCoeff;
            } else { this.state.savedRankedCoeff = "0_5"; }
            const savedTimeR = localStorage.getItem('mp_ranked_time');
            if (savedTimeR !== null) {
                c.rankedTime.value = savedTimeR;
                this.state.savedRankedTime = savedTimeR;
            } else { this.state.savedRankedTime = "60"; }
            const sRankedShowMs = localStorage.getItem('mp_ranked_showMs');
            if (sRankedShowMs !== null && c.rankedShowMs) c.rankedShowMs.checked = (sRankedShowMs === 'true');
            const sTime = localStorage.getItem('matrix_time');
            if (sTime !== null) c.time.value = sTime;
            const sShowMs = localStorage.getItem('matrix_showMs');
            if (sShowMs !== null && c.showMs) c.showMs.checked = (sShowMs === 'true');
            const sPause = localStorage.getItem('matrix_allowPause');
            if (sPause !== null && c.allowPause) c.allowPause.checked = (sPause === 'true');
            const sDims = localStorage.getItem('matrix_dims');
            if (sDims) {
                try {
                    const parsed = JSON.parse(sDims);
                    c.dimRowsA.value = parsed.rowsA;
                    c.dimCommon.value = parsed.common;
                    c.dimColsB.value = parsed.colsB;
                    c.minCoeff.value = parsed.min;
                    c.maxCoeff.value = parsed.max;
                } catch (e) { }
            }
            this.saveSandboxConfigSnapshot();
        },

        saveSandboxConfigSnapshot() {
            const c = this.els.config;
            this.state.savedSandboxConfig = {
                time: c.time.value,
                showMs: c.showMs ? c.showMs.checked : false,
                allowPause: c.allowPause ? c.allowPause.checked : true,
                dims: {
                    rowsA: c.dimRowsA.value,
                    common: c.dimCommon.value,
                    colsB: c.dimColsB.value,
                    min: c.minCoeff.value,
                    max: c.maxCoeff.value
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

        setPreStartState() {
            this.resetTimer();
            this.state.isActive = false;
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);
            this.els.workspace.innerHTML = '';

            const size = parseInt(this.state.savedRankedSize);
            this.state.dims.rowsA = size;
            this.state.dims.common = size;
            this.state.dims.colsB = size;

            const coeffs = this.state.savedRankedCoeff.split('_');
            this.state.configMin = parseInt(coeffs[0]);
            this.state.configMax = parseInt(coeffs[1]);

            this.generateOperation(true);

            this.els.workspace.classList.add('blurred');
            this.els.validateBtn.classList.add('blurred');

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
            this.els.score.textContent = "0";

            if (this.state.gameMode === 'ranked') {
                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = 'hidden';
            }

            const timeSetting = this.state.gameMode === 'ranked' ? parseInt(this.state.savedRankedTime) : parseInt(this.state.savedSandboxConfig.time) || 0;
            this.state.timeLeft = timeSetting;
            this.updateTimerUI();
        },

        startGame() {
            this.state.currentState = 'PLAYING';
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.score = 0;
            this.state.solveTimes = [];

            this.els.statusOverlay.classList.add('hidden');
            this.els.workspace.classList.remove('blurred');
            this.els.validateBtn.classList.remove('blurred');
            this.els.score.textContent = "0";

            let timeSetting = 0;

            if (this.state.gameMode === 'ranked') {
                const size = parseInt(this.state.savedRankedSize);
                this.state.dims.rowsA = size;
                this.state.dims.common = size;
                this.state.dims.colsB = size;
                const coeffs = this.state.savedRankedCoeff.split('_');
                this.state.configMin = parseInt(coeffs[0]);
                this.state.configMax = parseInt(coeffs[1]);
                timeSetting = parseInt(this.state.savedRankedTime);
                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                const s = this.state.savedSandboxConfig;
                this.state.dims.rowsA = parseInt(s.dims.rowsA);
                this.state.dims.common = parseInt(s.dims.common);
                this.state.dims.colsB = parseInt(s.dims.colsB);
                this.state.configMin = parseInt(s.dims.min);
                this.state.configMax = parseInt(s.dims.max);
                timeSetting = parseInt(s.time) || 0;
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = s.allowPause ? 'visible' : 'hidden';
            }

            this.updatePauseIcon();
            this.resetTimer();
            this.state.timeLeft = timeSetting > 0 ? timeSetting : 0;
            this.startTimer(timeSetting === 0);
            this.generateOperation();
        },

        generateOperation(isPreStart = false) {
            if (!this.state.isActive && !isPreStart) return;
            const rowsA = this.state.dims.rowsA;
            const common = this.state.dims.common;
            const colsB = this.state.dims.colsB;
            const min = this.state.configMin;
            const max = this.state.configMax;
            const rand = () => Math.floor(Math.random() * (max - min + 1)) + min;
            this.state.matrixA = Array.from({ length: rowsA }, () => Array.from({ length: common }, rand));
            this.state.matrixB = Array.from({ length: common }, () => Array.from({ length: colsB }, rand));
            this.state.matrixResult = Array.from({ length: rowsA }, (_, i) =>
                Array.from({ length: colsB }, (_, j) => {
                    let sum = 0;
                    for (let k = 0; k < common; k++) sum += this.state.matrixA[i][k] * this.state.matrixB[k][j];
                    return sum;
                })
            );
            this.renderMatrices(isPreStart);
            this.calculateOptimalLayout();
            if (!isPreStart && !this.state.isPaused) this.state.currentMatrixStartTime = performance.now();
        },

        calculateOptimalLayout() {
            if (!this.els.workspace) return;
            const containerRect = this.els.workspace.getBoundingClientRect();
            let availW = containerRect.width - 20;
            let availH = containerRect.height - 20;
            const rowsA = this.state.dims.rowsA;
            const common = this.state.dims.common;
            const colsB = this.state.dims.colsB;
            const isMobile = window.innerWidth <= 900;
            const isFullscreen = !!document.fullscreenElement;
            let cellSize;

            if (isMobile) {
                const maxColsInOneMatrix = Math.max(common, colsB);
                const widthConstraint = availW / (maxColsInOneMatrix + 1.5);
                const totalRows = rowsA + common + rowsA + 3;
                const heightConstraint = availH / totalRows;
                cellSize = Math.min(widthConstraint, heightConstraint);
            } else {
                const totalColsUnits = common + colsB + colsB + 4;
                const widthConstraint = availW / totalColsUnits;
                const maxRows = Math.max(rowsA, common);
                const heightConstraint = availH / (maxRows + 1);
                cellSize = Math.min(widthConstraint, heightConstraint);
            }

            const minSize = 18;
            const maxSize = (isFullscreen && isMobile) ? 48 : (isFullscreen ? 85 : 55);

            cellSize = Math.max(minSize, Math.min(cellSize, maxSize));
            this.els.workspace.style.setProperty('--cell-size', `${cellSize}px`);
        },

        renderMatrices(isPreStart = false) {
            const ws = this.els.workspace;
            ws.innerHTML = '';
            const createMatrixDOM = (data, isInput = false) => {
                const wrapper = document.createElement('div');
                wrapper.className = 'matrix-wrapper';
                const grid = document.createElement('div');
                grid.className = 'matrix-grid';
                const rows = data.length;
                const cols = data[0].length;
                grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
                data.forEach((row, rIndex) => {
                    row.forEach((val, cIndex) => {
                        let cell;
                        if (isInput) {
                            cell = document.createElement('input');
                            cell.type = 'text';
                            cell.inputMode = 'numeric';
                            cell.className = 'matrix-cell';
                            cell.dataset.row = rIndex;
                            cell.dataset.col = cIndex;
                            cell.dataset.expected = val;
                            cell.addEventListener('input', (e) => {
                                if (this.state.isPaused) { cell.value = cell.dataset.lastValue || ''; return; }
                                const raw = cell.value;
                                const clean = raw.replace(/[^0-9-]/g, '');
                                if (raw !== clean) cell.value = clean;
                                cell.dataset.lastValue = cell.value;
                            });
                            cell.addEventListener('keydown', (e) => {
                                if (this.state.isPaused) { e.preventDefault(); return; }
                                if (e.code === 'Space') { e.preventDefault(); return; }
                                if (e.code.startsWith('Digit') && !e.ctrlKey && !e.altKey && !e.metaKey) {
                                    e.preventDefault();
                                    const digit = e.code.replace('Digit', '');
                                    const start = cell.selectionStart;
                                    const end = cell.selectionEnd;
                                    const v = cell.value;
                                    cell.value = v.substring(0, start) + digit + v.substring(end);
                                    cell.selectionStart = cell.selectionEnd = start + 1;
                                    cell.dataset.lastValue = cell.value;
                                    return;
                                }
                                this.handleInputKey(e, rIndex, cIndex, rows, cols);
                            });
                        } else {
                            cell = document.createElement('div');
                            cell.className = 'matrix-cell';
                            cell.textContent = val;
                        }
                        grid.appendChild(cell);
                    });
                });
                wrapper.appendChild(grid);
                return wrapper;
            };
            ws.appendChild(createMatrixDOM(this.state.matrixA));
            const op1 = document.createElement('div'); op1.className = 'matrix-operator'; op1.textContent = '×'; ws.appendChild(op1);
            ws.appendChild(createMatrixDOM(this.state.matrixB));
            const op2 = document.createElement('div'); op2.className = 'matrix-operator'; op2.textContent = '='; ws.appendChild(op2);
            ws.appendChild(createMatrixDOM(this.state.matrixResult, true));

            const firstInput = ws.querySelector('input.matrix-cell');
            if (!isPreStart && firstInput && !this.state.isPaused) {
                firstInput.focus();
            }
        },

        handleInputKey(e, r, c, maxR, maxC) {
            if (e.key === 'Enter') { e.preventDefault(); this.validateGrid(); return; }
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                let nextR = r, nextC = c;
                if (e.key === 'ArrowRight') { nextC++; if (nextC >= maxC) { nextC = 0; nextR++; if (nextR >= maxR) nextR = 0; } }
                else if (e.key === 'ArrowLeft') { nextC--; if (nextC < 0) { nextC = maxC - 1; nextR--; if (nextR < 0) nextR = maxR - 1; } }
                else if (e.key === 'ArrowDown') { nextR++; if (nextR >= maxR) { nextR = 0; nextC++; if (nextC >= maxC) nextC = 0; } }
                else if (e.key === 'ArrowUp') { nextR--; if (nextR < 0) { nextR = maxR - 1; nextC--; if (nextC < 0) nextC = maxC - 1; } }
                const nextInput = document.querySelector(`input[data-row="${nextR}"][data-col="${nextC}"]`);
                if (nextInput) { nextInput.focus(); nextInput.select(); }
            }
        },

        validateGrid() {
            if (!this.state.isActive || this.state.isPaused) return;
            const inputs = Array.from(document.querySelectorAll('input.matrix-cell'));
            let allCorrect = true;
            inputs.forEach(input => {
                const val = parseInt(input.value);
                const expected = parseInt(input.dataset.expected);
                if (isNaN(val) || val !== expected) {
                    allCorrect = false;
                    input.classList.add('wrong');
                    setTimeout(() => input.classList.remove('wrong'), 500);
                } else input.classList.add('correct');
            });
            if (allCorrect) {
                SoundEngine.playHit();
                const timeTaken = (performance.now() - this.state.currentMatrixStartTime) / 1000;
                this.state.solveTimes.push(timeTaken);
                this.state.score++;
                this.els.score.textContent = this.state.score;
                this.els.board.classList.remove('flash-success');
                void this.els.board.offsetWidth;
                this.els.board.classList.add('flash-success');
                setTimeout(() => this.generateOperation(), 400);
            } else {
                SoundEngine.playError();
            }
        },

        async endGame() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';
            clearInterval(this.state.timerId);
            SoundEngine.playEnd();

            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = this.state.score;

                                const configString = `${this.state.savedRankedSize}_${this.state.savedRankedCoeff}_${this.state.savedRankedTime}`;
                this.saveScoreToDatabase(this.state.score, configString);

                                const recordKey = `mp_best_ranked_${configString}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                                if (best === null || this.state.score > best) {
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

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                this.els.newRecordMsg.style.visibility = 'hidden';
                this.els.newRecordMsg.style.opacity = '0';
                this.els.sandboxScore.textContent = this.state.score;

                                if (this.state.solveTimes.length > 0) {
                    const sum = this.state.solveTimes.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.state.solveTimes.length).toFixed(2);
                    const fastest = Math.min(...this.state.solveTimes).toFixed(2);
                    const slowest = Math.max(...this.state.solveTimes).toFixed(2);
                    if (this.els.statAvgTime) this.els.statAvgTime.textContent = `${avg}s`;
                    if (this.els.statFastest) this.els.statFastest.textContent = `${fastest}s`;
                    if (this.els.statSlowest) this.els.statSlowest.textContent = `${slowest}s`;
                    this.renderHistoryChart();
                }
            }
            this.toggleOverlay(this.els.overlayOver, true);
            const configString = `mp_ranked_${this.state.savedRankedSize}_${this.state.savedRankedCoeff}_${this.state.savedRankedTime}`;
            this.preloadDistributionData(configString);
        },

        renderHistoryChart() {
            if (!this.els.historyChart) return;
            this.els.historyChart.innerHTML = '';
            const minTime = Math.min(...this.state.solveTimes);
            const maxTime = Math.max(...this.state.solveTimes);
            const buffer = (maxTime - minTime) * 0.2;
            let chartMin = minTime - buffer;
            if (chartMin < 0) chartMin = 0;
            let chartMax = maxTime + buffer;
            if (chartMin === chartMax) { chartMin -= 1; chartMax += 1; }
            const chartRange = chartMax - chartMin;

            this.state.solveTimes.forEach((time, index) => {
                let heightPercent = ((time - chartMin) / chartRange) * 100;
                if (heightPercent < 5) heightPercent = 5;
                const barContainer = document.createElement('div');
                barContainer.className = 'history-bar-wrapper';
                const bar = document.createElement('div');
                bar.className = 'history-bar'; bar.style.height = `${heightPercent}%`;
                const label = document.createElement('span');
                label.textContent = time.toFixed(1) + 's'; label.className = 'bar-label';
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
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'matrix_product', score: score, details: { config: configString }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, configString) {
            try {
                fetch('/api/best', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `mp_ranked_${configString}`, score: score, details: { config: configString }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error(error); }
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
            if (bestScore !== null) bestPercent = clamp(((bestScore - minX) / range) * 100, 0, 100);
            let currentOffset = 5;
            if (bestPercent !== null && Math.abs(currentPercent - bestPercent) < 8) currentOffset = 30;

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
            } else this.els.markerBest.classList.add('hidden');

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
                let percentile = (areaToRight / totalArea) * 100;
                percentile = clamp(percentile, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);
                tooltip.style.left = `${snappedPercentX * 100}%`;
                tooltip.innerHTML = `<strong>${val}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                tooltip.classList.remove('hidden');
                hoverLine.style.left = `${snappedPercentX * 100}%`;
                hoverLine.classList.remove('hidden');
            };
            distributionContainer.onmouseleave = () => { tooltip.classList.add('hidden'); hoverLine.classList.add('hidden'); };
        },

        async preloadDistributionData(configKey) {
            if (!configKey) configKey = `mp_ranked_${this.state.savedRankedSize}_${this.state.savedRankedCoeff}_${this.state.savedRankedTime}`;
            try {
                const res = await fetch(`/api/scores/distribution/matrix_product?config=${configKey}`, {
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

        startTimer(countUp = false) {
            this.updateTimerUI();
            this.state.timerId = setInterval(() => {
                if (countUp) this.state.timeLeft += 0.01;
                else this.state.timeLeft -= 0.01;
                this.state.timeLeft = Math.round(this.state.timeLeft * 100) / 100;
                this.updateTimerUI();
                if (!countUp && this.state.timeLeft <= 0) { this.state.timeLeft = 0; this.updateTimerUI(); this.endGame(); }
            }, 10);
        },

        resetTimer() { clearInterval(this.state.timerId); },

        updateTimerUI() {
            const showMs = (this.state.gameMode === 'sandbox') ? (this.els.config.showMs ? this.els.config.showMs.checked : false) : (this.els.config.rankedShowMs ? this.els.config.rankedShowMs.checked : false);
            const timeSetting = this.state.gameMode === 'ranked' ? parseInt(this.state.savedRankedTime) : parseInt(this.state.savedSandboxConfig.time) || 0;
            const countUp = timeSetting === 0;
            if (timeSetting > 0 || (countUp && this.state.isActive)) {
                let displayTime = showMs ? this.state.timeLeft.toFixed(2) : (countUp ? Math.floor(this.state.timeLeft) : Math.ceil(this.state.timeLeft));
                this.els.timer.textContent = displayTime;
            } else this.els.timer.textContent = "∞";
        },

        togglePause() {
            if (!this.state.isActive || this.state.gameMode === 'ranked') return;
            this.state.isPaused = !this.state.isPaused;
            if (this.state.isPaused) clearInterval(this.state.timerId);
            else {
                const timeSetting = parseInt(this.state.savedSandboxConfig.time) || 0;
                this.startTimer(timeSetting === 0);
                const input = document.querySelector('input.matrix-cell:not(.correct)');
                if (input) input.focus();
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
            if(c.rankedSize) c.rankedSize.value = this.state.savedRankedSize;
            if(c.rankedCoeff) c.rankedCoeff.value = this.state.savedRankedCoeff;
            if(c.rankedTime) c.rankedTime.value = this.state.savedRankedTime;
            const s = this.state.savedSandboxConfig;
            if (s && s.dims) {
                if(c.time) c.time.value = s.time; 
                if(c.showMs) c.showMs.checked = s.showMs; 
                if(c.allowPause) c.allowPause.checked = s.allowPause;
                if(c.dimRowsA) c.dimRowsA.value = s.dims.rowsA; 
                if(c.dimCommon) c.dimCommon.value = s.dims.common; 
                if(c.dimColsB) c.dimColsB.value = s.dims.colsB;
                if(c.minCoeff) c.minCoeff.value = s.dims.min; 
                if(c.maxCoeff) c.maxCoeff.value = s.dims.max;
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

                if (this.state.gameMode === 'sandbox' && this.state.isActive && this.state.isPaused && this.els.config.allowPause && this.els.config.allowPause.checked) {
                    this.togglePause();
                }
            } else {
                this.restoreConfigUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');

                if (this.state.gameMode === 'sandbox' && this.state.isActive && !this.state.isPaused && this.els.config.allowPause && this.els.config.allowPause.checked) {
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
                if (this.state.gameMode === 'sandbox') this.startGame();
                else this.setPreStartState();
            });
            if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') this.startGame();
                    else this.setPreStartState();
                });
            }
            els.pauseBtn.addEventListener('click', () => this.togglePause());
            els.validateBtn.addEventListener('click', () => this.validateGrid());
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
                    if (this.state.isActive) setTimeout(() => this.calculateOptimalLayout(), 100);
                });
            }
            els.board.addEventListener('click', (e) => { if (this.state.currentState === 'PRE_START' && !e.target.closest('button')) this.startGame(); });

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = this.els.settingsPanel.classList.contains('panel-visible');
                const isGameOver = this.els.overlayOver.classList.contains('visible');

                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();
                if (e.code === 'Escape') { e.preventDefault(); this.toggleSettings(); }
                if (e.code === 'Space' && this.state.isActive && !isMenuOpen && this.state.gameMode === 'sandbox' && this.els.config.allowPause && this.els.config.allowPause.checked) { e.preventDefault(); this.togglePause(); }

                if (e.code === 'Enter') {
                    if (isMenuOpen) { e.preventDefault(); els.saveSettings.click(); }
                    else if (isGameOver) { e.preventDefault(); this.toggleOverlay(this.els.overlayOver, false); if (this.state.gameMode === 'sandbox') this.startGame(); else this.setPreStartState(); }
                    else if (this.state.currentState === 'PRE_START') { e.preventDefault(); this.startGame(); }
                    else if (this.state.currentState === 'PLAYING') { e.preventDefault(); this.validateGrid(); }
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

                                if(c.rankedSize) {
                    localStorage.setItem('mp_ranked_size', c.rankedSize.value);
                    this.state.savedRankedSize = c.rankedSize.value;
                }
                if(c.rankedCoeff) {
                    localStorage.setItem('mp_ranked_coeff', c.rankedCoeff.value);
                    this.state.savedRankedCoeff = c.rankedCoeff.value;
                }
                if(c.rankedTime) {
                    localStorage.setItem('mp_ranked_time', c.rankedTime.value);
                    this.state.savedRankedTime = c.rankedTime.value;
                }
                if(c.rankedShowMs) localStorage.setItem('mp_ranked_showMs', c.rankedShowMs.checked);

                                const safeVal = (val, min, max) => Math.max(min, Math.min(max, parseInt(val) || min));

                                if(c.time && c.allowPause && c.dimRowsA) {
                    const dimsData = { rowsA: safeVal(c.dimRowsA.value, 1, 10), common: safeVal(c.dimCommon.value, 1, 10), colsB: safeVal(c.dimColsB.value, 1, 10), min: safeVal(c.minCoeff.value, -99, 99), max: safeVal(c.maxCoeff.value, -99, 99) };
                    localStorage.setItem('matrix_time', c.time.value);
                    localStorage.setItem('matrix_showMs', c.showMs.checked);
                    localStorage.setItem('matrix_allowPause', c.allowPause.checked);
                    localStorage.setItem('matrix_dims', JSON.stringify(dimsData));
                }

                                this.saveSandboxConfigSnapshot();

                                const configKey = `mp_ranked_${this.state.savedRankedSize}_${this.state.savedRankedCoeff}_${this.state.savedRankedTime}`;
                this.preloadDistributionData(configKey);

                this.els.settingsPanel.classList.remove('panel-visible'); 
                this.els.settingsPanel.classList.add('panel-hidden');

                                if (this.state.gameMode === 'sandbox') this.startGame(); 
                else this.setPreStartState();
            });
            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel.contains(e.target) || els.settingsToggle.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });
            window.addEventListener('storage', (e) => { if (e.key === 'globalOpaque') this.loadBackgroundPreference(); });
        }
    };

    MatrixGame.init();
});