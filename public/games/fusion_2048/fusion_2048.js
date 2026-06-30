
const fusion_2048Translations = {
    fr: {
        header_title: "FUSION 2048",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            target: "Objectif :",
            target_hint: "Atteignez la tuile cible le plus vite possible.",
            sandbox_hint: "Mode Classique. Jouez librement et tentez de battre votre meilleur score !",
            show_ms: "Afficher centièmes :",
            yes: "Oui",
            no: "Non",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            time: "TEMPS",
            score: "SCORE",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            paused: "PAUSE",
            pause_hint: "", 
            hint_fullscreen: "" 
        },
        results: {
            new_record: "NOUVEAU TEMPS RECORD !",
            time_taken: "Temps Réalisé",
            score_reached: "Score Final",
            max_tile: "Tuile Max",
            best: "Meilleur",
            you: "Vous",
            replay: "REJOUER",
            win: "VICTOIRE !",
            lose: "GRILLE BLOQUÉE"
        }
    },
    en: {
        header_title: "FUSION 2048",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            target: "Target:",
            target_hint: "Reach the target tile as fast as possible.",
            sandbox_hint: "Classic Mode. Play freely and try to beat your high score!",
            show_ms: "Show hundredths:",
            yes: "Yes",
            no: "No",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            time: "TIME",
            score: "SCORE",
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            paused: "PAUSED",
            pause_hint: "",
            hint_fullscreen: ""
        },
        results: {
            new_record: "NEW RECORD TIME!",
            time_taken: "Time Taken",
            score_reached: "Final Score",
            max_tile: "Max Tile",
            best: "Best",
            you: "You",
            replay: "PLAY AGAIN",
            win: "VICTORY!",
            lose: "GRID LOCKED"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.fusion_2048 = fusion_2048Translations.fr;
    translations.en.fusion_2048 = fusion_2048Translations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, fusion_2048Translations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, fusion_2048Translations['en']);
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
        playMove() {
            this.init();
            this.playToneAtTime(300, 'sine', audioCtx.currentTime, 0.05, 0.05);
        },
        playMerge() {
            this.init();
            this.playToneAtTime(600, 'sine', audioCtx.currentTime, 0.1, 0.1);
        },
        playSuccess() {
            this.init();
            const t = audioCtx.currentTime;
            this.playToneAtTime(400, 'sine', t, 0.1, 0.1); 
            this.playToneAtTime(500, 'sine', t + 0.1, 0.1, 0.1); 
            this.playToneAtTime(600, 'sine', t + 0.2, 0.2, 0.15); 
        },
        playLevelFailed() {
            this.init();
            const t = audioCtx.currentTime;
            this.playToneAtTime(311.13, 'sine', t, 0.15, 0.15); 
            this.playToneAtTime(261.63, 'sine', t + 0.15, 0.15, 0.15); 
            this.playToneAtTime(220.00, 'sine', t + 0.3, 0.4, 0.15); 
        }
    };

    const Fusion2048 = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START',
            grid: [], 
            score: 0,
            targetTile: 512,
            maxTile: 0,
            startTime: 0,
            elapsedTime: 0,
            timerInterval: null,

                        savedRankedConfig: "512",
            savedShowMs: false,

                        isPaused: false,
            distributionDataByConfig: {}
        },

        els: {
            gameArea: document.getElementById('game-area'),
            statusOverlay: document.getElementById('status-overlay'),
            gridWrapper: document.getElementById('grid-wrapper'),
            gridContainer: document.getElementById('grid-container'),
            headerValLabel: document.getElementById('header-val-label'),
            currentVal: document.getElementById('current-val'),
            board: document.querySelector('.game-board'),

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

                        rankedResultLabel: document.getElementById('ranked-result-label'),
            rankedScore: document.getElementById('ranked-score'),
            sandboxScore: document.getElementById('sandbox-score'),
            statMaxTile: document.getElementById('stat-max-tile'),

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
                rankedTarget: document.getElementById('ranked-target-val'),
                showMs: document.getElementById('show-ms-val')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }

            this.loadUserPreferences();

                        if (params.has('target')) {
                this.state.savedRankedConfig = params.get('target');
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
            const configKey = `fusion_ranked_${this.state.savedRankedConfig}`;
            this.preloadDistributionData(configKey);
        },

        loadUserPreferences() {
            const c = this.els.config;
            const savedRanked = localStorage.getItem('fusion_ranked_config');
            if (savedRanked !== null) {
                this.state.savedRankedConfig = savedRanked;
                if (c.rankedTarget) c.rankedTarget.value = savedRanked;
            }

            const savedMs = localStorage.getItem('fusion_show_ms');
            if (savedMs !== null) {
                this.state.savedShowMs = savedMs === 'true';
                if (c.showMs) c.showMs.value = savedMs;
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
            this.stopTimer();
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

                        this.initGridDOM();

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

                        if (this.state.gameMode === 'ranked') {
                this.state.targetTile = parseInt(this.state.savedRankedConfig);
                this.els.headerValLabel.textContent = getGameText('game.time');
                this.els.currentVal.textContent = this.state.savedShowMs ? "00:00.00" : "00:00";

                                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.els.headerValLabel.textContent = getGameText('game.time');
                this.els.currentVal.textContent = this.state.savedShowMs ? "00:00.00" : "00:00";

                                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = 'none';
            }
        },

        initGridDOM() {
            this.els.gridContainer.innerHTML = '';
            for (let i = 0; i < 16; i++) {
                const tile = document.createElement('div');
                tile.classList.add('grid-tile');
                this.els.gridContainer.appendChild(tile);
            }
        },

        startGame() {
            this.stopTimer(); 

                        SoundEngine.init();
            this.state.currentState = 'PLAYING';
            this.state.isPaused = false;
            this.state.score = 0;
            this.state.maxTile = 0;

                        this.els.statusOverlay.classList.add('hidden');
            this.els.gridWrapper.classList.remove('blurred');
            this.els.gridWrapper.classList.remove('hidden');

                        if (this.state.gameMode === 'ranked') {
                this.state.targetTile = parseInt(this.state.savedRankedConfig);
                this.els.headerValLabel.textContent = getGameText('game.time');
                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
                this.startTimer();
            } else {
                this.els.headerValLabel.textContent = getGameText('game.time');
                this.els.currentVal.textContent = this.state.savedShowMs ? "00:00.00" : "00:00";
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = '';
                this.els.pauseBtn.style.display = 'none';
                this.startTimer();
            }

            this.initGridArray();
            this.initGridDOM(); 

                        this.addRandomTile();
            this.addRandomTile();
            this.updateGridDOM();
        },

        initGridArray() {
            this.state.grid = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        },

        getEmptyCells() {
            let cells = [];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (this.state.grid[r][c] === 0) {
                        cells.push({ r, c });
                    }
                }
            }
            return cells;
        },

        addRandomTile() {
            const emptyCells = this.getEmptyCells();
            if (emptyCells.length > 0) {
                const randIndex = Math.floor(Math.random() * emptyCells.length);
                const cell = emptyCells[randIndex];
                const value = Math.random() < 0.9 ? 2 : 4;
                this.state.grid[cell.r][cell.c] = value;
                return { r: cell.r, c: cell.c, value: value };
            }
            return null;
        },

        updateGridDOM(newTileObj = null, mergedCells = []) {
            const tiles = this.els.gridContainer.children;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    const idx = r * 4 + c;
                    const val = this.state.grid[r][c];
                    const tile = tiles[idx];

                                        tile.className = 'grid-tile';
                    if (val > 0) {
                        tile.classList.add(`tile-${val}`);
                        tile.textContent = val;
                        if (val > this.state.maxTile) this.state.maxTile = val;
                    } else {
                        tile.textContent = '';
                    }

                    if (newTileObj && newTileObj.r === r && newTileObj.c === c) {
                        tile.classList.add('tile-new');
                    }
                    if (mergedCells.some(m => m.r === r && m.c === c)) {
                        tile.classList.add('tile-merged');
                    }
                }
            }


                                },

        slide(row) {
            let arr = row.filter(val => val);
            let merged = [];
            for (let i = 0; i < arr.length - 1; i++) {
                if (arr[i] === arr[i + 1]) {
                    arr[i] *= 2;
                    this.state.score += arr[i];
                    merged.push(arr[i]);
                    arr[i + 1] = 0;
                }
            }
            arr = arr.filter(val => val);
            while (arr.length < 4) {
                arr.push(0);
            }
            return { newRow: arr, merged };
        },

        processMove(direction) {
            if (this.state.currentState !== 'PLAYING') return;

            let moved = false;
            let mergedThisTurn = [];
            let gridCopy = JSON.parse(JSON.stringify(this.state.grid));

            if (direction === 'left' || direction === 'right') {
                for (let r = 0; r < 4; r++) {
                    let row = this.state.grid[r];
                    if (direction === 'right') row.reverse();
                    let { newRow, merged } = this.slide(row);
                    if (direction === 'right') newRow.reverse();
                    this.state.grid[r] = newRow;
                    if (merged.length > 0) moved = true;
                }
            } else if (direction === 'up' || direction === 'down') {
                for (let c = 0; c < 4; c++) {
                    let col = [this.state.grid[0][c], this.state.grid[1][c], this.state.grid[2][c], this.state.grid[3][c]];
                    if (direction === 'down') col.reverse();
                    let { newRow, merged } = this.slide(col);
                    if (direction === 'down') newRow.reverse();
                    for (let r = 0; r < 4; r++) {
                        this.state.grid[r][c] = newRow[r];
                    }
                    if (merged.length > 0) moved = true;
                }
            }

            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (this.state.grid[r][c] !== gridCopy[r][c]) moved = true;
                }
            }

            if (moved) {
                SoundEngine.playMove();
                const newTile = this.addRandomTile();

                                let anyMerge = false;
                for(let r=0; r<4; r++) {
                    for(let c=0; c<4; c++) {
                        if(this.state.grid[r][c] > gridCopy[r][c] && (!newTile || newTile.r !== r || newTile.c !== c)) {
                            anyMerge = true;
                        }
                    }
                }
                if (anyMerge) SoundEngine.playMerge();

                this.updateGridDOM(newTile, []);

                                if (this.state.gameMode === 'ranked' && this.state.maxTile >= this.state.targetTile) {
                    this.gameOver(true);
                } else if (!this.canMove()) {
                    this.gameOver(false);
                }
            }
        },

        canMove() {
            if (this.getEmptyCells().length > 0) return true;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    let val = this.state.grid[r][c];
                    if (c < 3 && val === this.state.grid[r][c + 1]) return true;
                    if (r < 3 && val === this.state.grid[r + 1][c]) return true;
                }
            }
            return false;
        },

        startTimer() {
            this.state.startTime = performance.now();
            this.state.timerInterval = requestAnimationFrame(this.updateTimer.bind(this));
        },

        updateTimer(timestamp) {
            if (this.state.currentState !== 'PLAYING') return;
            this.state.elapsedTime = timestamp - this.state.startTime;
            this.els.currentVal.textContent = this.formatTime(this.state.elapsedTime);
            this.state.timerInterval = requestAnimationFrame(this.updateTimer.bind(this));
        },

        stopTimer() {
            if (this.state.timerInterval) {
                cancelAnimationFrame(this.state.timerInterval);
                this.state.timerInterval = null;
            }
        },

        formatTime(ms) {
            let totalSeconds = ms / 1000;
            let mins = Math.floor(totalSeconds / 60);
            let secs = Math.floor(totalSeconds % 60);
            let baseStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

                        if (this.state.savedShowMs) {
                let centis = Math.floor((ms % 1000) / 10);
                return `${baseStr}.${centis.toString().padStart(2, '0')}`;
            }
            return baseStr;
        },

        async gameOver(isWin) {
            this.state.currentState = 'FINISHED';
            this.stopTimer();

            const finalTimeMs = isWin ? this.state.elapsedTime : 99999999; 

            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: finalTimeMs }, '*');
                return;
            }

            if (isWin) {
                SoundEngine.playSuccess();
                this.els.rankedResultLabel.textContent = getGameText('results.win');
            } else {
                SoundEngine.playLevelFailed();
                this.els.rankedResultLabel.textContent = getGameText('results.lose');
            }

                        if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');

                                const finalTimeMs = isWin ? this.state.elapsedTime : 99999999; 
                this.els.rankedScore.textContent = isWin ? this.formatTime(finalTimeMs) : "--:--";

                                if (isWin) {
                    this.saveScoreToDatabase(finalTimeMs, this.state.targetTile);

                                        const recordKey = `fusion_best_ranked_${this.state.targetTile}`;
                    let savedBest = localStorage.getItem(recordKey);
                    let best = savedBest !== null ? parseFloat(savedBest) : null;
                    let isRecord = false;

                                        if (best === null || finalTimeMs < best) {
                        best = finalTimeMs;
                        localStorage.setItem(recordKey, best);
                        isRecord = true;
                        this.saveBestScoreToDatabase(best, this.state.targetTile);
                    }

                                        if (isRecord && savedBest !== null) {
                        if(this.els.newRecordMsg) {
                            this.els.newRecordMsg.style.visibility = 'visible';
                            this.els.newRecordMsg.style.opacity = '1';
                        }
                    }
                    const configKey = `fusion_ranked_${this.state.targetTile}`;
                    this.drawDistributionChart(finalTimeMs / 1000, best / 1000, configKey);
                } else {
                    if(this.els.newRecordMsg) {
                        this.els.newRecordMsg.style.visibility = 'hidden';
                        this.els.newRecordMsg.style.opacity = '0';
                    }
                    const configKey = `fusion_ranked_${this.state.targetTile}`;
                    let savedBest = localStorage.getItem(recordKey);
                    let best = savedBest !== null ? parseFloat(savedBest) / 1000 : null;
                    this.drawDistributionChart(null, best, configKey);
                }
            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                if(this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }
                this.els.sandboxScore.textContent = this.state.score;
                if (this.els.statMaxTile) this.els.statMaxTile.textContent = this.state.maxTile;
            }

            this.toggleOverlay(this.els.overlayOver, true);
            this.els.pauseBtn.style.visibility = 'hidden';
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
            const configKey = `fusion_ranked_${this.state.targetTile}`;
            this.preloadDistributionData(configKey);
        },
        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },


        async saveScoreToDatabase(timeMs, target) {

                        if (window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: timeMs }, '*');
            }

            try {
                fetch('/api/scores', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'fusion_2048', score: timeMs, details: { target: target }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(timeMs, target) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `fusion_ranked_${target}`, score: timeMs, details: { target: target }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async drawDistributionChart(currentTimeSec, bestTimeSec, configKey) {
            if (!this.state.distributionDataByConfig[configKey]) {
                this.state.distributionDataByConfig[configKey] = [];
            }
            if (currentTimeSec !== null) {
                this.state.distributionDataByConfig[configKey].push(currentTimeSec);
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

            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

                        if (currentTimeSec !== null) {
                const currentPercent = clamp(((currentTimeSec - minX) / range) * 100, 0, 100);
                this.els.markerCurrent.style.display = 'block';
                this.els.markerCurrent.style.left = `${currentPercent}%`;
                this.els.markerCurrent.innerHTML = `
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">
                        ${currentTimeSec.toFixed(1)}
                    </div>
                `;
            } else {
                this.els.markerCurrent.style.display = 'none';
            }

            if (bestTimeSec !== null) {
                const bestPercent = clamp(((bestTimeSec - minX) / range) * 100, 0, 100);
                this.els.markerBest.classList.remove('hidden');
                this.els.markerBest.style.left = `${bestPercent}%`;
                this.els.markerBest.innerHTML = `
                    <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);">
                        <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                            <path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/>
                        </svg>
                    </div>
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 25px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">
                        ${bestTimeSec.toFixed(1)}
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

                                const val = parseFloat((minX + percentX * range).toFixed(2));
                const snappedPercentX = (val - minX) / range;


                                let areaToLeft = 0;
                for (let i = 0; i <= steps; i++) {
                    let pointVal = minX + (i / steps) * range;
                    if (pointVal <= val) {
                        areaToLeft += densities[i].y;
                    }
                }

                                let percentile = (areaToLeft / totalArea) * 100;
                if (percentile < 0.1) percentile = 0.1;
                if (percentile > 99.9) percentile = 99.9;

                                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                tooltip.style.left = `${snappedPercentX * 100}%`;
                tooltip.innerHTML = `<strong>${val.toFixed(2)}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
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
            const distKey = configKey || `fusion_ranked_${this.state.targetTile}`;
            try {
                const res = await fetch(`/api/scores/distribution/fusion_2048?target=${this.state.targetTile}`, {
                    headers: { 'Content-Type': 'application/json' },
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
            if (c.rankedTarget) c.rankedTarget.value = this.state.savedRankedConfig;
            if (c.showMs) c.showMs.value = this.state.savedShowMs.toString();

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

            els.gameArea.addEventListener('click', (e) => {
                if (this.state.currentState === 'PRE_START' && !e.target.closest('button')) {
                    this.startGame();
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

                if (this.state.currentState === 'PLAYING' && !isMenuOpen && !isOverVisible) {
                    const key = e.key.toLowerCase();
                    if (e.key === 'ArrowUp' || key === 'w' || key === 'z') { e.preventDefault(); this.processMove('up'); }
                    else if (e.key === 'ArrowDown' || key === 's') { e.preventDefault(); this.processMove('down'); }
                    else if (e.key === 'ArrowLeft' || key === 'a' || key === 'q') { e.preventDefault(); this.processMove('left'); }
                    else if (e.key === 'ArrowRight' || key === 'd') { e.preventDefault(); this.processMove('right'); }
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


                        let touchStartX = 0;
            let touchStartY = 0;

            els.gameArea.addEventListener('touchstart', (e) => {
                if(e.touches.length > 1) return;
                touchStartX = e.changedTouches[0].screenX;
                touchStartY = e.changedTouches[0].screenY;
            }, {passive: true});

                        els.gameArea.addEventListener('touchmove', (e) => {
                if (this.state.currentState === 'PLAYING') {
                    e.preventDefault(); 
                }
            }, {passive: false});

            els.gameArea.addEventListener('touchend', (e) => {
                if(e.changedTouches.length > 1) return;
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const isOverVisible = this.els.overlayOver.classList.contains('visible');

                                if (this.state.currentState !== 'PLAYING' || isMenuOpen || isOverVisible) return;

                let dx = e.changedTouches[0].screenX - touchStartX;
                let dy = e.changedTouches[0].screenY - touchStartY;

                                if (Math.abs(dx) > Math.abs(dy)) {
                    if (Math.abs(dx) > 30) {
                        if (dx > 0) this.processMove('right');
                        else this.processMove('left');
                    }
                } else {
                    if (Math.abs(dy) > 30) {
                        if (dy > 0) this.processMove('down');
                        else this.processMove('up');
                    }
                }
            }, {passive: true});

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

                if (c.rankedTarget) {
                    localStorage.setItem('fusion_ranked_config', c.rankedTarget.value);
                    this.state.savedRankedConfig = c.rankedTarget.value;
                }

                if (c.showMs) {
                    localStorage.setItem('fusion_show_ms', c.showMs.value);
                    this.state.savedShowMs = c.showMs.value === 'true';
                }

                                const configKey = `fusion_ranked_${this.state.savedRankedConfig}`;
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

    Fusion2048.init();
});
