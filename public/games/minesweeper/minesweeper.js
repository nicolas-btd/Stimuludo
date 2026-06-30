
const msTranslations = {
    fr: {
        header_title: "DÉMINEUR",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            difficulty: "Difficulté :",
            rows: "Lignes :",
            cols: "Colonnes :",
            mines: "Mines :",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            time: "TEMPS",
            mines: "MINES",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer"
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            time: "Temps",
            best: "Meilleur",
            you: "Vous",
            win: "Gagné !",
            loss: "Perdu...",
            grid_size: "Grille",
            mines: "Mines",
            top: "TOP",
            retry: "REJOUER"
        }
    },
    en: {
        header_title: "MINESWEEPER",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            difficulty: "Difficulty:",
            rows: "Rows:",
            cols: "Cols:",
            mines: "Mines:",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            time: "TIME",
            mines: "MINES",
            ready: "Ready?",
            or: "or",
            to_start: "to start"
        },
        results: {
            new_record: "NEW RECORD!",
            time: "Time",
            best: "Best",
            you: "You",
            win: "You Win!",
            loss: "Game Over",
            grid_size: "Grid",
            mines: "Mines",
            top: "TOP",
            retry: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.ms = msTranslations.fr;
    translations.en.ms = msTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, msTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, msTranslations['en']);
}


const FLAG_SVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>`;
const BOMB_SVG = `<svg viewBox="0 0 14 14" fill="currentColor" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="m 11.324219,3.07539 -1.21875,1.21875 0.621093,0.6211 c 0.220313,0.22031 0.220313,0.57656 0,0.79453 L 10.31875,6.11758 C 10.595313,6.7293 10.75,7.40899 10.75,8.12383 c 0,2.69297 -2.1820313,4.875 -4.875,4.875 C 3.1820313,12.99883 1,10.81914 1,8.12617 c 0,-2.69296 2.1820312,-4.875 4.875,-4.875 0.7148437,0 1.3945312,0.15469 2.00625,0.43125 L 8.2890625,3.27461 C 8.509375,3.0543 8.865625,3.0543 9.0835937,3.27461 L 9.7046875,3.8957 10.923438,2.67695 11.324219,3.07539 Z m 1.394531,-0.66797 -0.5625,0 c -0.154688,0 -0.28125,0.12657 -0.28125,0.28125 0,0.15469 0.126562,0.28125 0.28125,0.28125 l 0.5625,0 C 12.873438,2.96992 13,2.84336 13,2.68867 13,2.53399 12.873438,2.40742 12.71875,2.40742 Z M 11.3125,1.00117 c -0.154688,0 -0.28125,0.12657 -0.28125,0.28125 l 0,0.5625 c 0,0.15469 0.126562,0.28125 0.28125,0.28125 0.154688,0 0.28125,-0.12656 0.28125,-0.28125 l 0,-0.5625 c 0,-0.15468 -0.126562,-0.28125 -0.28125,-0.28125 z m 0.794531,1.28907 0.398438,-0.39844 c 0.110156,-0.11016 0.110156,-0.28828 0,-0.39844 -0.110157,-0.11016 -0.288281,-0.11016 -0.398438,0 L 11.708594,1.8918 c -0.110157,0.11015 -0.110157,0.28828 0,0.39844 0.1125,0.11015 0.290625,0.11015 0.398437,0 z m -1.589062,0 c 0.110156,0.11015 0.288281,0.11015 0.398437,0 0.110156,-0.11016 0.110156,-0.28829 0,-0.39844 L 10.517969,1.49336 c -0.110156,-0.11016 -0.288281,-0.11016 -0.398438,0 -0.110156,0.11016 -0.110156,0.28828 0,0.39844 l 0.398438,0.39844 z m 1.589062,0.79687 c -0.110156,-0.11016 -0.288281,-0.11016 -0.398437,0 -0.110157,0.11016 -0.110157,0.28828 0,0.39844 l 0.398437,0.39844 c 0.110157,0.11015 0.288281,0.11015 0.398438,0 0.110156,-0.11016 0.110156,-0.28829 0,-0.39844 L 12.107031,3.08711 Z M 3.625,7.37617 c 0,-0.82734 0.6726562,-1.5 1.5,-1.5 0.20625,0 0.375,-0.16875 0.375,-0.375 0,-0.20625 -0.16875,-0.375 -0.375,-0.375 -1.2398438,0 -2.25,1.01016 -2.25,2.25 0,0.20625 0.16875,0.375 0.375,0.375 0.20625,0 0.375,-0.16875 0.375,-0.375 z"/></svg>`;

document.addEventListener('DOMContentLoaded', () => {


        let audioCtx;
    const SoundEngine = {
        lastRevealTime: 0, 

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
        playReveal() { 
            const now = performance.now();
            if (now - this.lastRevealTime < 50) return; 
            this.lastRevealTime = now;

                        this.init(); 
            this.playToneAtTime(400, 'sine', audioCtx.currentTime, 0.05, 0.05); 
        },
        playFlag() { 
            this.init(); 
            this.playToneAtTime(600, 'sine', audioCtx.currentTime, 0.08, 0.08); 
        },
        playUnflag() { 
            this.init(); 
            this.playToneAtTime(300, 'sine', audioCtx.currentTime, 0.08, 0.08); 
        },
        playExplosion() {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;

            this.init();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine'; 

                        osc.frequency.setValueAtTime(250, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);

                        gain.gain.setValueAtTime(0.2 * volMod, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

                        osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
        },
        playSuccess() {
            this.init();
            const t = audioCtx.currentTime;
            this.playToneAtTime(400, 'sine', t, 0.1, 0.1); 
            this.playToneAtTime(504, 'sine', t + 0.1, 0.1, 0.1); 
            this.playToneAtTime(600, 'sine', t + 0.2, 0.2, 0.15); 
        }
    };

    const Game = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START',

                        rows: 9,
            cols: 9,
            totalMines: 10,

                        board: [],
            minesLeft: 0,
            revealedCount: 0,

                        isWaitingForFirstClick: true,
            isPaused: false,
            pauseRequested: false,
            mobileFlagMode: false,

                        timerId: null,
            timeElapsed: 0,
            pauseStartTime: 0,
            totalPauseTime: 0,
            startTime: 0,

            savedRankedDiff: 'easy', 
            savedSandboxRows: 10,
            savedSandboxCols: 10,
            savedSandboxMines: 10,

                        distributionDataByConfig: {}
        },

        els: {
            gameArea: document.getElementById('game-area'),
            statusOverlay: document.getElementById('status-overlay'),
            workspace: document.getElementById('ms-workspace'),
            grid: document.getElementById('ms-grid'),
            timer: document.getElementById('game-timer'),
            minesCount: document.getElementById('mines-count'),
            board: document.querySelector('.game-board'),

                        pauseBtn: document.getElementById('pause-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'),
            flagToggleBtn: document.getElementById('flag-toggle-btn'),
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
            resultStatusRanked: document.getElementById('ms-result-status-ranked'),
            resultStatusSandbox: document.getElementById('ms-result-status-sandbox'),

                        statGrid: document.getElementById('stat-grid'),
            statMines: document.getElementById('stat-mines'),
            rankedChartContainer: document.getElementById('ranked-chart-container'),

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
                rankedDiff: document.getElementById('ranked-diff-val'),
                rows: document.getElementById('rows-val'),
                cols: document.getElementById('cols-val'),
                mines: document.getElementById('mines-val')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('difficulty')) {
                const d = params.get('difficulty');
                this.state.savedDifficulty = d;
                localStorage.setItem('ms_ranked_diff', d);
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


                                    this.els.statusOverlay.classList.add('hidden');
            this.els.workspace.classList.remove('blurred');
            this.startGame();

            this.preloadDistributionData();
        },

        loadUserPreferences() {
            const c = this.els.config;
            const savedDiff = localStorage.getItem('ms_ranked_diff');
            if (savedDiff !== null) {
                this.state.savedRankedDiff = savedDiff;
                if (c.rankedDiff) c.rankedDiff.value = savedDiff;
            }

            const sRows = localStorage.getItem('ms_sandbox_rows');
            if (sRows !== null && c.rows) { c.rows.value = sRows; this.state.savedSandboxRows = parseInt(sRows); }

            const sCols = localStorage.getItem('ms_sandbox_cols');
            if (sCols !== null && c.cols) { c.cols.value = sCols; this.state.savedSandboxCols = parseInt(sCols); }

                        const sMines = localStorage.getItem('ms_sandbox_mines');
            if (sMines !== null && c.mines) { c.mines.value = sMines; this.state.savedSandboxMines = parseInt(sMines); }
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

        applyConfigVariables() {
            if (this.state.gameMode === 'ranked') {
                if (this.state.savedRankedDiff === 'easy') { this.state.rows = 9; this.state.cols = 9; this.state.totalMines = 10; }
                else if (this.state.savedRankedDiff === 'medium') { this.state.rows = 16; this.state.cols = 16; this.state.totalMines = 40; }
            } else {
                this.state.rows = this.state.savedSandboxRows;
                this.state.cols = this.state.savedSandboxCols;
                this.state.totalMines = Math.min(this.state.savedSandboxMines, (this.state.rows * this.state.cols) - 1);
            }
        },

        resizeGrid() {
            if (this.state.currentState === 'PRE_START' && this.state.rows === 0) return;
            const ws = this.els.workspace;
            if (!ws) return;

            const wsRect = ws.getBoundingClientRect();

                        const isMobile = window.innerWidth <= 700 || ('ontouchstart' in window && window.innerWidth <= 900);


                                    const paddingW = isMobile ? 6 : 40; 
            const paddingH = isMobile ? 160 : 40; 

            const safeWidth = wsRect.width - paddingW;
            const safeHeight = wsRect.height - paddingH;

                        const gap = isMobile ? 1 : 2;
            const totalGapW = (this.state.cols - 1) * gap;
            const totalGapH = (this.state.rows - 1) * gap;

            const maxW = (safeWidth - totalGapW) / this.state.cols;
            const maxH = (safeHeight - totalGapH) / this.state.rows;

            let cellSize = Math.min(maxW, maxH);

                        const isFullscreen = document.fullscreenElement || this.els.board.classList.contains('ios-fullscreen');
            const maxLimit = isFullscreen ? 100 : (isMobile ? 80 : 60); 

                        cellSize = Math.max(15, Math.min(cellSize, maxLimit));

            document.documentElement.style.setProperty('--ms-cell-size', `${cellSize}px`);
        },

        startGame() {
            SoundEngine.init();

            this.state.currentState = 'PLAYING';
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.pauseRequested = false;

                        this.els.statusOverlay.classList.add('hidden');
            this.els.workspace.classList.remove('blurred');
            this.els.workspace.classList.remove('hidden');

                        this.applyConfigVariables();

            if (this.state.gameMode === 'ranked') {
                this.els.pauseBtn.style.display = 'none';
            } else {
                this.els.pauseBtn.style.display = '';
                this.els.pauseBtn.style.visibility = 'visible';
            }

            this.els.pauseBtn.classList.remove('btn-paused-pending', 'btn-paused-active');
            this.updatePauseIcon();

            this.els.ingameRestartBtn.style.display = '';
            this.els.ingameRestartBtn.style.visibility = 'visible';

            this.initGrid();
        },

        initGrid() {
            clearInterval(this.state.timerId);
            this.state.isWaitingForFirstClick = true;
            this.state.timeElapsed = 0;
            this.state.totalPauseTime = 0;
            this.state.revealedCount = 0;
            this.state.minesLeft = this.state.totalMines;

                        this.resizeGrid();

                        this.els.timer.textContent = "0.00";
            this.els.minesCount.textContent = this.state.minesLeft.toString().padStart(2, '0');

                        this.els.grid.innerHTML = '';
            this.els.grid.style.gridTemplateColumns = `repeat(${this.state.cols}, 1fr)`;

            this.state.board = [];
            for (let r = 0; r < this.state.rows; r++) {
                let row = [];
                for (let c = 0; c < this.state.cols; c++) {
                    const cellEl = document.createElement('div');
                    cellEl.className = 'ms-cell hidden';
                    cellEl.dataset.r = r;
                    cellEl.dataset.c = c;

                                        cellEl.addEventListener('mousedown', (e) => this.handlePointerDown(e, r, c));
                    cellEl.addEventListener('contextmenu', (e) => { e.preventDefault(); this.toggleFlag(r, c); });

                    let touchTimer;
                    cellEl.addEventListener('touchstart', (e) => {
                        if (e.touches.length > 1) return;
                        touchTimer = setTimeout(() => {
                            this.toggleFlag(r, c);
                            touchTimer = null;
                        }, 400); 
                    }, {passive: true});

                    cellEl.addEventListener('touchend', (e) => {
                        if (touchTimer) {
                            clearTimeout(touchTimer);
                            if(e.cancelable) e.preventDefault(); 
                            this.handleInteraction(r, c);
                        }
                    }, {passive: false});

                                        cellEl.addEventListener('touchmove', () => {
                        if (touchTimer) clearTimeout(touchTimer);
                    }, {passive: true});

                    this.els.grid.appendChild(cellEl);

                                        row.push({
                        r: r, c: c,
                        el: cellEl,
                        isMine: false,
                        isRevealed: false,
                        isFlagged: false,
                        neighborMines: 0
                    });
                }
                this.state.board.push(row);
            }
        },

        handlePointerDown(e, r, c) {
            if (e.button === 2) return;
            this.handleInteraction(r, c);
        },

        handleInteraction(r, c) {
            if (!this.state.isActive || this.state.isPaused) return;

                        const cell = this.state.board[r][c];

            if (this.state.mobileFlagMode) {
                this.toggleFlag(r, c);
                return;
            }

            if (cell.isFlagged) return;

            if (this.state.isWaitingForFirstClick) {
                this.state.isWaitingForFirstClick = false;
                this.placeMines(r, c);
                this.state.startTime = performance.now();
                this.startTimer();
            }

            if (cell.isRevealed) {
                this.chord(r, c);
            } else {
                this.reveal(r, c);
            }
        },

        placeMines(firstR, firstC) {
            let minesPlaced = 0;
            while (minesPlaced < this.state.totalMines) {
                let r = Math.floor(Math.random() * this.state.rows);
                let c = Math.floor(Math.random() * this.state.cols);

                                if (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1) continue;

                if (!this.state.board[r][c].isMine) {
                    this.state.board[r][c].isMine = true;
                    minesPlaced++;
                }
            }

            for (let r = 0; r < this.state.rows; r++) {
                for (let c = 0; c < this.state.cols; c++) {
                    if (!this.state.board[r][c].isMine) {
                        this.state.board[r][c].neighborMines = this.countNeighborMines(r, c);
                    }
                }
            }
        },

        countNeighborMines(r, c) {
            let count = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    let nr = r + i, nc = c + j;
                    if (nr >= 0 && nr < this.state.rows && nc >= 0 && nc < this.state.cols) {
                        if (this.state.board[nr][nc].isMine) count++;
                    }
                }
            }
            return count;
        },

        toggleFlag(r, c) {
            if (!this.state.isActive || this.state.isPaused || this.state.isWaitingForFirstClick) return;
            const cell = this.state.board[r][c];
            if (cell.isRevealed) return;

            if (cell.isFlagged) {
                cell.isFlagged = false;
                cell.el.classList.remove('flagged');
                cell.el.innerHTML = '';
                this.state.minesLeft++;
                SoundEngine.playUnflag();
            } else {
                cell.isFlagged = true;
                cell.el.classList.add('flagged');
                cell.el.innerHTML = FLAG_SVG;
                this.state.minesLeft--;
                SoundEngine.playFlag();
            }
            this.els.minesCount.textContent = this.state.minesLeft.toString().padStart(2, '0');
        },

        reveal(r, c) {
            const cell = this.state.board[r][c];
            if (cell.isRevealed || cell.isFlagged) return;

            cell.isRevealed = true;
            cell.el.classList.remove('hidden');
            cell.el.classList.add('revealed');
            this.state.revealedCount++;

            if (cell.isMine) {
                cell.el.classList.add('mine-exploded');
                cell.el.innerHTML = BOMB_SVG;
                SoundEngine.playExplosion();
                this.gameOver(false);
                return;
            }

            SoundEngine.playReveal();

            if (cell.neighborMines > 0) {
                cell.el.dataset.count = cell.neighborMines;
                cell.el.textContent = cell.neighborMines;
            } else {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        let nr = r + i, nc = c + j;
                        if (nr >= 0 && nr < this.state.rows && nc >= 0 && nc < this.state.cols) {
                            this.reveal(nr, nc);
                        }
                    }
                }
            }

            this.checkWin();
        },

        chord(r, c) {
            const cell = this.state.board[r][c];
            if (!cell.isRevealed || cell.neighborMines === 0) return;

            let flagCount = 0;
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    if (i === 0 && j === 0) continue;
                    let nr = r + i, nc = c + j;
                    if (nr >= 0 && nr < this.state.rows && nc >= 0 && nc < this.state.cols) {
                        if (this.state.board[nr][nc].isFlagged) flagCount++;
                    }
                }
            }

            if (flagCount === cell.neighborMines) {
                for (let i = -1; i <= 1; i++) {
                    for (let j = -1; j <= 1; j++) {
                        if (i === 0 && j === 0) continue;
                        let nr = r + i, nc = c + j;
                        if (nr >= 0 && nr < this.state.rows && nc >= 0 && nc < this.state.cols) {
                            this.reveal(nr, nc);
                        }
                    }
                }
            }
        },

        checkWin() {
            if (this.state.revealedCount === (this.state.rows * this.state.cols) - this.state.totalMines) {
                SoundEngine.playSuccess();
                this.gameOver(true);
            }
        },

        startTimer() {
            this.state.timerId = setInterval(() => {
                if(!this.state.isPaused) {
                    this.state.timeElapsed = (performance.now() - this.state.startTime - this.state.totalPauseTime) / 1000;
                    this.els.timer.textContent = this.state.timeElapsed.toFixed(2);
                }
            }, 50);
        },

        async gameOver(isWin) {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';
            clearInterval(this.state.timerId);

                        if(isWin) {
                this.state.timeElapsed = (performance.now() - this.state.startTime - this.state.totalPauseTime) / 1000;
                this.els.timer.textContent = this.state.timeElapsed.toFixed(2);
            }

            if (!isWin) {
                for (let r = 0; r < this.state.rows; r++) {
                    for (let c = 0; c < this.state.cols; c++) {
                        const cell = this.state.board[r][c];
                        if (cell.isMine && !cell.isFlagged && !cell.el.classList.contains('mine-exploded')) {
                            cell.el.classList.remove('hidden');
                            cell.el.classList.add('mine', 'revealed');
                            cell.el.innerHTML = BOMB_SVG;
                        } else if (!cell.isMine && cell.isFlagged) {
                            cell.el.innerHTML = 'X';
                            cell.el.style.color = 'var(--accent-color-secondary)';
                        }
                    }
                }
            } else {
                for (let r = 0; r < this.state.rows; r++) {
                    for (let c = 0; c < this.state.cols; c++) {
                        const cell = this.state.board[r][c];
                        if (cell.isMine && !cell.isFlagged) {
                            cell.el.classList.add('flagged');
                            cell.el.innerHTML = FLAG_SVG;
                        }
                    }
                }
                this.els.minesCount.textContent = "00";
            }

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');

                                this.els.rankedScore.textContent = this.state.timeElapsed.toFixed(2);

                                const statusEl = this.els.resultStatusRanked;
                statusEl.textContent = getGameText('results.time');
                statusEl.className = 'res-label';

                if(isWin) {
                    this.saveScoreToDatabase(this.state.timeElapsed, this.state.savedRankedDiff);

                                        const recordKey = `ms_best_ranked_${this.state.savedRankedDiff}`;
                    let savedBest = localStorage.getItem(recordKey);
                    let best = savedBest !== null ? parseFloat(savedBest) : null;
                    let isRecord = false;

                                        if (best === null || this.state.timeElapsed < best) {
                        best = this.state.timeElapsed;
                        localStorage.setItem(recordKey, best.toFixed(2));
                        isRecord = true;
                        this.saveBestScoreToDatabase(best, this.state.savedRankedDiff);
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

                                        this.els.rankedChartContainer.style.display = 'block';
                    const configKey = this.state.savedRankedDiff;
                    this.drawDistributionChart(this.state.timeElapsed, best, configKey);
                    this.preloadDistributionData(configKey);

                } else {
                    if(this.els.newRecordMsg) {
                        this.els.newRecordMsg.style.visibility = 'hidden';
                        this.els.newRecordMsg.style.opacity = '0';
                    }
                    this.els.rankedChartContainer.style.display = 'none';
                }

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                if(this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                                this.els.sandboxScore.textContent = this.state.timeElapsed.toFixed(2);

                                const statusEl = this.els.resultStatusSandbox;
                statusEl.textContent = getGameText('results.time');
                statusEl.className = 'res-label';

                if(this.els.statGrid) this.els.statGrid.textContent = `${this.state.rows}x${this.state.cols}`;
                if(this.els.statMines) this.els.statMines.textContent = this.state.totalMines;
            }

            setTimeout(() => {
                this.toggleOverlay(this.els.overlayOver, true);
                this.els.pauseBtn.style.visibility = 'hidden';
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
            }, 1000);
        },

        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },

        async saveScoreToDatabase(time, difficulty) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: time }, '*');
                return;
            }
            try {
                fetch('/api/scores', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'minesweeper', score: time, details: { difficulty: difficulty }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(time, difficulty) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `ms_ranked_${difficulty}`, score: time, details: { difficulty: difficulty }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async preloadDistributionData(configKey) {
            const key = configKey || this.state.savedRankedDiff || "easy";
            try {
                const res = await fetch(`/api/scores/distribution/minesweeper?difficulty=${key}`, {
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
            const key = configKey || this.state.savedRankedDiff || "easy";
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
            if (stdDev < 1) stdDev = 1; 

            let bandwidth = 1.06 * stdDev * Math.pow(n, -0.2);
            if (bandwidth < 0.5) bandwidth = 0.5; 

            const minData = Math.min(...scores);
            const maxData = Math.max(...scores);

                        let minX = Math.floor(minData - 3 * bandwidth);
            let maxX = Math.ceil(maxData + 3 * bandwidth);
            if (minX < 0) minX = 0; 

                        if (maxX - minX < 5) {
                const center = (maxX + minX) / 2;
                minX = Math.max(0, Math.floor(center - 5));
                maxX = Math.ceil(center + 5);
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
            for (let val = minX; val <= maxX; val += (range/20)) {
                let d = getDensity(val), px = ((val - minX) / range) * 100, py = 100 - ((d / maxDensity) * 95);
                dotsHTML += `<div class="dist-html-dot" style="position: absolute; left: ${px}%; top: ${py}%; width: 4px; height: 4px; background: var(--accent-color); border-radius: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 1;"></div>`;
            }
            distContainer.insertAdjacentHTML('beforeend', dotsHTML);

            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            const currentPercent = clamp(((currentScore - minX) / range) * 100, 0, 100);
            let bestPercent = null;
            if (bestScore !== null) bestPercent = clamp(((bestScore - minX) / range) * 100, 0, 100);
            let currentOffset = 5; if (bestPercent !== null && Math.abs(currentPercent - bestPercent) < 8) currentOffset = 30;

            if (bestScore !== null && currentScore.toFixed(2) === bestScore.toFixed(2)) {
                this.els.markerCurrent.style.display = 'none';
            } else if (currentScore !== null) {
                this.els.markerCurrent.style.display = 'block';
                this.els.markerCurrent.style.left = `${currentPercent}%`;
                this.els.markerCurrent.innerHTML = `<div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div><div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">${currentScore.toFixed(2)}</div>`;
            } else {
                this.els.markerCurrent.style.display = 'none';
            }

            if (bestScore !== null) {
                this.els.markerBest.classList.remove('hidden');
                this.els.markerBest.style.left = `${bestPercent}%`;
                this.els.markerBest.innerHTML = `<div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);"><svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/></svg></div><div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div><div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">${bestScore.toFixed(2)}</div>`;
            } else {
                this.els.markerBest.classList.add('hidden');
            }

            const tooltip = this.els.viewRanked.querySelector('.chart-tooltip');
            const hoverLine = this.els.viewRanked.querySelector('.hover-line');
            distContainer.onmousemove = (e) => {
                const rect = distContainer.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const percentX = clamp(mouseX / rect.width, 0, 1);
                const val = (minX + percentX * range).toFixed(2);

                                let areaToRight = 0;
                for (let i = 0; i <= steps; i++) {
                    let pointVal = minX + (i / steps) * range;
                    if (pointVal >= val) areaToRight += densities[i].y;
                }
                let percentile = (areaToRight / totalArea) * 100;
                percentile = clamp(percentile, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                                tooltip.style.left = `${percentX * 100}%`;
                tooltip.innerHTML = `<strong>${val}s</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
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
                this.state.pauseRequested = true;
                this.els.pauseBtn.classList.add('btn-paused-active');
                this.state.pauseStartTime = performance.now();
                this.els.workspace.classList.add('blurred');
            } else {
                this.state.pauseRequested = false;
                this.els.pauseBtn.classList.remove('btn-paused-pending', 'btn-paused-active');
                this.state.totalPauseTime += performance.now() - this.state.pauseStartTime;
                this.els.workspace.classList.remove('blurred');
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
            if(c.rankedDiff) c.rankedDiff.value = this.state.savedRankedDiff;
            if(c.rows) c.rows.value = this.state.savedSandboxRows;
            if(c.cols) c.cols.value = this.state.savedSandboxCols;
            if(c.mines) c.mines.value = this.state.savedSandboxMines;

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
                if(this.state.gameMode === 'sandbox' && this.state.isActive && this.state.isPaused) {
                    this.togglePause();
                }
            } else {
                this.restoreSettingsUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');
                if(this.state.gameMode === 'sandbox' && this.state.isActive && !this.state.isPaused) {
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
                    setTimeout(() => this.resizeGrid(), 50);
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
                setTimeout(() => this.resizeGrid(), 50);
            }
        },

        enableFallbackFullscreen() {
            this.els.board.classList.add('ios-fullscreen');
            this.updateFullscreenIcon();
            setTimeout(() => this.resizeGrid(), 50);
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
                this.startGame();
            });

                        if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleOverlay(this.els.overlayOver, false);
                    this.startGame();
                });
            }

            if (els.fullscreenBtn) {
                els.fullscreenBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFullscreen();
                });
            }

                        if (els.pauseBtn) {
                els.pauseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePause();
                });
            }

            if (els.flagToggleBtn) {
                els.flagToggleBtn.addEventListener('pointerdown', (e) => {
                    e.stopPropagation();
                    e.preventDefault(); 
                    this.state.mobileFlagMode = !this.state.mobileFlagMode;
                    if(this.state.mobileFlagMode) {
                        els.flagToggleBtn.classList.add('active');
                    } else {
                        els.flagToggleBtn.classList.remove('active');
                        els.flagToggleBtn.blur(); 
                    }
                });
            }


                                    document.addEventListener('pointerdown', (e) => {
                if (this.state.mobileFlagMode) {
                    if (!e.target.closest('#flag-toggle-btn') && !e.target.closest('.ms-cell')) {
                        this.state.mobileFlagMode = false;
                        els.flagToggleBtn.classList.remove('active');
                    }
                }
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
                setTimeout(() => this.resizeGrid(), 50);
            });

                        window.addEventListener('resize', () => {
                this.resizeGrid();
            });

            els.gameArea.addEventListener('pointerdown', (e) => {
                if (!e.target.closest('button') && !e.target.closest('#settings-panel') && !e.target.closest('.ms-cell')) {
                    if (this.state.currentState === 'PRE_START') {
                        this.startGame();
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
                        this.startGame();
                    }
                    else if (this.state.currentState === 'PRE_START') {
                        e.preventDefault();
                        this.startGame();
                    }
                }

                                if (e.code === 'Enter' && (isMenuOpen || isOverVisible || this.state.currentState === 'PRE_START')) {
                     if (isMenuOpen) {
                        e.preventDefault();
                        els.saveSettings.click();
                    } 
                    else if (isOverVisible) {
                        e.preventDefault();
                        this.toggleOverlay(this.els.overlayOver, false);
                        this.startGame();
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

                                if (c.rankedDiff) {
                    localStorage.setItem('ms_ranked_diff', c.rankedDiff.value);
                    this.state.savedRankedDiff = c.rankedDiff.value;
                }

                                if (c.rows) { localStorage.setItem('ms_sandbox_rows', c.rows.value); this.state.savedSandboxRows = parseInt(c.rows.value); }
                if (c.cols) { localStorage.setItem('ms_sandbox_cols', c.cols.value); this.state.savedSandboxCols = parseInt(c.cols.value); }
                if (c.mines) { localStorage.setItem('ms_sandbox_mines', c.mines.value); this.state.savedSandboxMines = parseInt(c.mines.value); }

                                this.preloadDistributionData(this.state.savedRankedDiff);
                this.toggleSettings(true);

                                this.startGame();
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


                                    els.workspace.addEventListener('touchmove', (e) => {



                                                            }, {passive: true});
        }
    };

    Game.init();
});