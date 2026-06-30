
const numbers_roundTranslations = {
    fr: {
        header_title: "LE COMPTE EST BON",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            time_90: "90 secondes",
            time_60: "60 secondes",
            time_120: "120 secondes",
            title: "Configuration",
            game_time: "Temps de jeu :",
            time_hint: "Mettez 0 pour jouer sans limite.",
            show_ms: "Afficher les centièmes",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            score: "SCORE",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            reset: "Annuler",
            pass: "Passer (-5s)"
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            score_final: "Rounds Réussis",
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
        header_title: "NUMBERS ROUND",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            time_90: "90 seconds",
            time_60: "60 seconds",
            time_120: "120 seconds",
            title: "Settings",
            game_time: "Game time:",
            time_hint: "Set to 0 for unlimited play.",
            show_ms: "Show milliseconds",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            score: "SCORE",
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            reset: "Undo",
            pass: "Skip (-5s)"
        },
        results: {
            new_record: "NEW RECORD!",
            score_final: "Successful Rounds",
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
    translations.fr.numbers_round = numbers_roundTranslations.fr;
    translations.en.numbers_round = numbers_roundTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, numbers_roundTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, numbers_roundTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {


        let audioCtx;
    const SoundEngine = {
        init() {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
        },
        getVolumeMultiplier() {
            const saved = localStorage.getItem('siteGlobalVolume');
            return (saved !== null ? parseInt(saved, 10) : 50) / 100;
        },
        playToneAtTime(freq, type, startTime, duration, vol = 0.1) {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0 || !audioCtx) return;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(vol * volMod, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(startTime); osc.stop(startTime + duration);
        },
        playClick(foundCount = 0) {
            this.init();
            const baseFreq = 300 + (foundCount * 50);
            this.playToneAtTime(baseFreq, 'sine', audioCtx.currentTime, 0.1, 0.1);
        },
        playSuccess() {
            this.init();
            const t = audioCtx.currentTime;
            this.playToneAtTime(400, 'sine', t, 0.1, 0.1); 
            this.playToneAtTime(500, 'sine', t + 0.1, 0.1, 0.1); 
            this.playToneAtTime(600, 'sine', t + 0.2, 0.2, 0.15); 
        },
        playError() {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;
            this.init();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(250, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.2);
            gain.gain.setValueAtTime(0.1 * volMod, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(); osc.stop(audioCtx.currentTime + 0.2);
        },
        playLevelFailed() {
            this.init();
            const t = audioCtx.currentTime;
            this.playToneAtTime(311.13, 'sine', t, 0.15, 0.15); 
            this.playToneAtTime(261.63, 'sine', t + 0.15, 0.15, 0.15); 
            this.playToneAtTime(220.00, 'sine', t + 0.3, 0.4, 0.15); 
        }
    };

    const NumbersRound = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START',
            score: 0,

                        timeLeft: 0,
            timerId: null,
            isActive: false,

                        target: 0,
            initialTiles: [],
            currentTiles: [],
            selectedTileId: null,
            selectedOp: null,

                        roundStartTime: 0,
            roundTimes: [], 

            actionTimeout: null,
            savedRankedTime: 90,
            savedSandboxTime: 90,

                        isPaused: false,
            pauseRequested: false,
            distributionDataByConfig: {}
        },

        els: {
            gameArea: document.getElementById('game-area'),
            statusOverlay: document.getElementById('status-overlay'),
            playWrapper: document.getElementById('play-wrapper'),
            board: document.querySelector('.game-board'),

                        scoreDisplay: document.getElementById('current-score'),
            timerDisplay: document.getElementById('time-left'),
            timerContainer: document.getElementById('timer-container'),

                        targetDisplay: document.getElementById('target-number'),
            targetContainer: document.querySelector('.target-container'),
            tilesContainer: document.getElementById('tiles-container'),
            operatorsContainer: document.getElementById('operators-container'),

                        pauseBtn: document.getElementById('pause-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'),
            iconPause: document.getElementById('icon-pause'),
            iconPlay: document.getElementById('icon-play'),
            restartBtn: document.getElementById('restart-btn'),
            resetRoundBtn: document.getElementById('reset-round-btn'),
            passRoundBtn: document.getElementById('pass-round-btn'),

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
                rankedTime: document.getElementById('ranked-time-val'),
                rankedShowMs: document.getElementById('ranked-show-ms'),
                sandboxTime: document.getElementById('sandbox-time-val'),
                showMs: document.getElementById('show-ms')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) this.state.gameMode = params.get('mode');
            if (params.has('time')) {
                const t = params.get('time');
                this.state.savedRankedTime = parseInt(t);
                localStorage.setItem('nr_ranked_time', t);
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
                this.els.playWrapper.classList.remove('blurred');
                this.startGame();
            } else {
                this.setPreStartState();
            }
            const initKey = `nr_ranked_${this.state.savedRankedTime}`;
            this.preloadDistributionData(initKey);
        },

        loadUserPreferences() {
            const c = this.els.config;
            const savedRanked = localStorage.getItem('nr_ranked_time');
            if (savedRanked !== null) {
                this.state.savedRankedTime = parseInt(savedRanked);
                if(c.rankedTime) c.rankedTime.value = savedRanked;
            }
            const sRankedShowMs = localStorage.getItem('nr_ranked_showMs');
            if (sRankedShowMs !== null && c.rankedShowMs) c.rankedShowMs.checked = (sRankedShowMs === 'true');

            const savedSandbox = localStorage.getItem('nr_sandbox_time');
            if (savedSandbox !== null) {
                this.state.savedSandboxTime = parseInt(savedSandbox);
                if(c.sandboxTime) c.sandboxTime.value = savedSandbox;
            }
            const sShowMs = localStorage.getItem('nr_sandbox_showMs');
            if (sShowMs !== null && c.showMs) c.showMs.checked = (sShowMs === 'true');
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

                        this.els.playWrapper.classList.remove('hidden');
            this.els.playWrapper.classList.add('blurred'); 

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

                        this.state.score = 0;
            this.els.scoreDisplay.textContent = "0";

                        const timeSetting = this.state.gameMode === 'ranked' ? this.state.savedRankedTime : this.state.savedSandboxTime;
            this.state.timeLeft = timeSetting;
            this.updateTimerUI();

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
        },

        startGame() {
            this.resetTimer();
            if (this.state.actionTimeout) clearTimeout(this.state.actionTimeout);
            SoundEngine.init();

            this.state.currentState = 'PLAYING';
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.pauseRequested = false;
            this.state.roundTimes = [];

                        this.els.statusOverlay.classList.add('hidden');
            this.els.playWrapper.classList.remove('blurred');
            this.els.playWrapper.classList.remove('hidden');

                        const timeSetting = this.state.gameMode === 'ranked' ? this.state.savedRankedTime : this.state.savedSandboxTime;
            this.state.timeLeft = timeSetting > 0 ? timeSetting : 0;
            this.state.score = 0;
            this.els.scoreDisplay.textContent = "0";

                        if (this.state.gameMode === 'sandbox') {
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = 'visible';
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
            } else {
                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            }

            this.els.pauseBtn.classList.remove('btn-paused-pending', 'btn-paused-active');
            this.updatePauseIcon();

            this.startTimer(timeSetting === 0);
            this.generateRound();
        },

        startTimer(countUp = false) {
            this.updateTimerUI();
            this.state.timerId = setInterval(() => {
                if (countUp) this.state.timeLeft += 0.01;
                else this.state.timeLeft -= 0.01;
                this.state.timeLeft = Math.round(this.state.timeLeft * 100) / 100;
                this.updateTimerUI();
                if (!countUp && this.state.timeLeft <= 0) { this.state.timeLeft = 0; this.updateTimerUI(); this.gameOver(); }
            }, 10);
        },

        resetTimer() { clearInterval(this.state.timerId); },

        updateTimerUI() {
            const showMs = (this.state.gameMode === 'sandbox') ? this.els.config.showMs.checked : (this.els.config.rankedShowMs ? this.els.config.rankedShowMs.checked : false);
            const timeSetting = this.state.gameMode === 'ranked' ? this.state.savedRankedTime : this.state.savedSandboxTime;
            const countUp = timeSetting === 0;
            if (timeSetting > 0 || (countUp && this.state.isActive)) {
                let displayTime = showMs ? this.state.timeLeft.toFixed(2) : (countUp ? Math.floor(this.state.timeLeft) : Math.ceil(this.state.timeLeft));
                this.els.timerDisplay.textContent = displayTime;
            } else this.els.timerDisplay.textContent = "∞";
        },

        generateRound() {
            this.els.targetContainer.classList.remove('success');
            this.state.target = Math.floor(Math.random() * 899) + 101; 
            this.els.targetDisplay.textContent = this.state.target;

            const pool = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,25,50,75,100];
            let drawn = [];
            let poolCopy = [...pool];
            for(let i=0; i<6; i++) {
                const r = Math.floor(Math.random() * poolCopy.length);
                drawn.push(poolCopy[r]);
                poolCopy.splice(r, 1);
            }

            this.state.initialTiles = drawn;
            this.resetRoundState();

                        if (!this.state.isPaused) this.state.roundStartTime = performance.now();
        },

        resetRoundState() {
            this.state.currentTiles = this.state.initialTiles.map((val, idx) => ({
                id: `t_${idx}`, val: val, active: true
            }));
            this.state.selectedTileId = null;
            this.state.selectedOp = null;
            this.renderWorkspace();
        },

        renderWorkspace() {
            this.els.tilesContainer.innerHTML = '';
            this.state.currentTiles.forEach(tileObj => {
                const btn = document.createElement('div');
                btn.className = 'number-tile';
                if(!tileObj.active) btn.classList.add('empty');
                if(this.state.selectedTileId === tileObj.id) btn.classList.add('active');
                btn.textContent = tileObj.val;
                btn.onclick = () => this.handleTileClick(tileObj.id);
                this.els.tilesContainer.appendChild(btn);
            });

            Array.from(this.els.operatorsContainer.children).forEach(btn => {
                btn.classList.remove('active');
                if(this.state.selectedOp === btn.dataset.op) {
                    btn.classList.add('active');
                }
            });
        },

        handleTileClick(id) {
            if(this.state.isPaused || this.state.currentState !== 'PLAYING') return;

            const clickedTile = this.state.currentTiles.find(t => t.id === id);
            if(!clickedTile || !clickedTile.active) return;

            if(this.state.selectedTileId === id) {
                this.state.selectedTileId = null;
                this.state.selectedOp = null;
                SoundEngine.playClick();
                this.renderWorkspace();
                return;
            }

            if(!this.state.selectedTileId) {
                this.state.selectedTileId = id;
                SoundEngine.playClick(1);
                this.renderWorkspace();
                return;
            }

            if(this.state.selectedTileId && !this.state.selectedOp) {
                this.state.selectedTileId = id;
                SoundEngine.playClick(1);
                this.renderWorkspace();
                return;
            }

            if(this.state.selectedTileId && this.state.selectedOp && this.state.selectedTileId !== id) {
                this.executeOperation(this.state.selectedTileId, id, this.state.selectedOp);
            }
        },

        handleOpClick(op) {
            if(this.state.isPaused || this.state.currentState !== 'PLAYING') return;
            if(!this.state.selectedTileId) return; 

                        this.state.selectedOp = op;
            SoundEngine.playClick(2);
            this.renderWorkspace();
        },

        executeOperation(id1, id2, op) {
            const t1 = this.state.currentTiles.find(t => t.id === id1);
            const t2 = this.state.currentTiles.find(t => t.id === id2);

                        let val1 = t1.val;
            let val2 = t2.val;
            let result = 0;
            let isValid = true;

            switch(op) {
                case '+': result = val1 + val2; break;
                case '-': 
                    result = val1 - val2; 
                    if(result <= 0) isValid = false; 
                    break;
                case '*': result = val1 * val2; break;
                case '/':
                    if(val1 % val2 !== 0) isValid = false;
                    else result = val1 / val2;
                    break;
            }

            if(!isValid) {
                SoundEngine.playError();
                const btnNode = this.els.tilesContainer.children[this.state.currentTiles.indexOf(t2)];
                if(btnNode) {
                    btnNode.classList.add('error');
                    setTimeout(() => btnNode.classList.remove('error'), 400);
                }
                this.state.selectedTileId = null;
                this.state.selectedOp = null;
                this.renderWorkspace();
                return;
            }

            SoundEngine.playClick(3);

                        this.state.currentTiles = this.state.currentTiles.map(t => {
                if(t.id === id1) return { id: t.id, val: result, active: true };
                if(t.id === id2) return { id: t.id, val: 0, active: false };
                return t;
            });

            this.state.selectedTileId = null;
            this.state.selectedOp = null;
            this.renderWorkspace();

            this.checkWinCondition(result);
        },

        checkWinCondition(lastResult) {
            if(lastResult === this.state.target) {
                this.roundWon();
            }
        },

        roundWon() {
            this.state.score++;
            this.els.scoreDisplay.textContent = this.state.score;
            SoundEngine.playSuccess();

                        const timeTaken = (performance.now() - this.state.roundStartTime) / 1000;
            this.state.roundTimes.push(timeTaken);

            this.els.targetContainer.classList.add('success');
            this.state.currentState = 'TRANSITION'; 

                        this.state.actionTimeout = setTimeout(() => {
                if(this.state.timeLeft > 0 || this.state.savedSandboxTime === 0) {
                    this.state.currentState = 'PLAYING';
                    this.generateRound();
                }
            }, 1000);
        },

        passRound() {
            if(this.state.currentState !== 'PLAYING') return;

                        const countUp = this.state.gameMode === 'sandbox' && this.state.savedSandboxTime === 0;

                        if (!countUp) {
                this.state.timeLeft = Math.max(0, this.state.timeLeft - 5);
            }
            this.updateTimerUI();
            SoundEngine.playError();

                        this.els.timerContainer.classList.add('timer-penalty');
            setTimeout(() => this.els.timerContainer.classList.remove('timer-penalty'), 300);

            if(this.state.timeLeft > 0 || countUp) {
                this.generateRound();
            } else {
                this.gameOver();
            }
        },

        async gameOver() {
            this.resetTimer();
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';
            SoundEngine.playLevelFailed();

                        if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';

                        if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = this.state.score;

                                this.saveScoreToDatabase(this.state.score);

                                const recordKey = `nr_best_ranked_${this.state.savedRankedTime}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                                if (best === null || this.state.score > best) {
                    best = this.state.score;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best);
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

                                const chartKey = `nr_ranked_${this.state.savedRankedTime}`;
                this.drawDistributionChart(this.state.score, best, chartKey);

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                if(this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }
                this.els.sandboxScore.textContent = this.state.score;

                if (this.state.roundTimes.length > 0) {
                    const sum = this.state.roundTimes.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.state.roundTimes.length).toFixed(2);
                    const fastest = Math.min(...this.state.roundTimes).toFixed(2);
                    const slowest = Math.max(...this.state.roundTimes).toFixed(2);

                    if (this.els.statAvgTime) this.els.statAvgTime.textContent = `${avg}s`;
                    if (this.els.statFastest) this.els.statFastest.textContent = `${fastest}s`;
                    if (this.els.statSlowest) this.els.statSlowest.textContent = `${slowest}s`;

                    if (this.els.historyChart) {
                        this.els.historyChart.innerHTML = '';
                        const minTime = Math.min(...this.state.roundTimes);
                        const maxTime = Math.max(...this.state.roundTimes);
                        const buffer = (maxTime - minTime) * 0.2; 
                        let chartMin = minTime - buffer;
                        if (chartMin < 0) chartMin = 0; 
                        let chartMax = maxTime + buffer;

                                                if (chartMin === chartMax) {
                            chartMin -= 0.5;
                            chartMax += 0.5;
                        }
                        const chartRange = chartMax - chartMin;

                        this.state.roundTimes.forEach((time, index) => {
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
            const chartKey = `nr_ranked_${this.state.savedRankedTime}`;
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

        async saveScoreToDatabase(score) {
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
                    body: JSON.stringify({ game_id: 'numbers_round', score: score, details: { time: this.state.savedRankedTime }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `nr_ranked_${this.state.savedRankedTime}`, score: score, details: { time: this.state.savedRankedTime }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB Best:", error); }
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
            if (!configKey) configKey = `nr_ranked_${this.state.savedRankedTime}`;
            const parts = configKey.split('_');
            const timeSetting = parts[2];
            try {
                const res = await fetch(`/api/scores/distribution/numbers_round?time=${timeSetting}`, {
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

        togglePause() {
            if (!this.state.isActive || this.state.gameMode === 'ranked') return; 

                        this.state.isPaused = !this.state.isPaused;
            if (this.state.isPaused) {
                clearInterval(this.state.timerId);
                this.els.pauseBtn.classList.add('btn-paused-active');
                this.els.playWrapper.classList.add('blurred');
            } else {
                const timeSetting = parseInt(this.state.savedSandboxTime) || 0;
                this.startTimer(timeSetting === 0);
                this.els.pauseBtn.classList.remove('btn-paused-active', 'btn-paused-pending');
                this.els.playWrapper.classList.remove('blurred');
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
            if(c.rankedTime) c.rankedTime.value = this.state.savedRankedTime;
            const sRankedShowMs = localStorage.getItem('nr_ranked_showMs');
            if(c.rankedShowMs) c.rankedShowMs.checked = (sRankedShowMs === 'true');

                        if(c.sandboxTime) c.sandboxTime.value = this.state.savedSandboxTime;
            const sShowMs = localStorage.getItem('nr_sandbox_showMs');
            if(c.showMs) c.showMs.checked = (sShowMs === 'true');

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
                if(this.state.gameMode === 'sandbox' && this.state.isActive && this.state.isPaused) this.togglePause();
            } else {
                this.restoreSettingsUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');
                if(this.state.gameMode === 'sandbox' && this.state.isActive && !this.state.isPaused) this.togglePause();
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
                        elem.requestFullscreen().catch(() => this.enableFallbackFullscreen());
                    } else if (elem.webkitRequestFullscreen) {
                        elem.webkitRequestFullscreen();
                    } else {
                        this.enableFallbackFullscreen();
                    }
                }
            } else {
                if (document.exitFullscreen && document.fullscreenElement) {
                    document.exitFullscreen().catch(e=>e);
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
                radio.addEventListener('change', (e) => this.updateSettingsView(e.target.value));
            });

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

            if(els.resetRoundBtn) els.resetRoundBtn.addEventListener('click', () => {
                if(this.state.currentState === 'PLAYING') this.resetRoundState();
            });
            if(els.passRoundBtn) els.passRoundBtn.addEventListener('click', () => {
                if(this.state.currentState === 'PLAYING') this.passRound();
            });

            if(els.operatorsContainer) {
                Array.from(els.operatorsContainer.children).forEach(btn => {
                    btn.addEventListener('click', (e) => this.handleOpClick(e.target.dataset.op));
                });
            }

                        if(els.pauseBtn) els.pauseBtn.addEventListener('click', () => this.togglePause());

            if (els.fullscreenBtn) {
                els.fullscreenBtn.addEventListener('click', (e) => { 
                    e.stopPropagation(); 
                    e.preventDefault();
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
                if (e.code === 'Escape') { e.preventDefault(); this.toggleSettings(); }

                if (e.code === 'Space' && this.state.isActive && !isMenuOpen && !isOverVisible) {
                    if (this.state.gameMode === 'sandbox') { e.preventDefault(); this.togglePause(); return; }
                }

                if (e.code === 'Enter' || e.code === 'Space') {
                    if (isMenuOpen) { e.preventDefault(); els.saveSettings.click(); } 
                    else if (isOverVisible) { 
                        e.preventDefault(); 
                        els.restartBtn.click(); 
                    }
                    else if (this.state.currentState === 'PRE_START') { e.preventDefault(); this.startGame(); }
                }
            });

            els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(err => console.error(err));
                    if (this.els.settingsPanel.classList.contains('panel-hidden')) this.toggleSettings();
                } else this.toggleSettings();
            });

                        if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

                        if (els.saveSettings) els.saveSettings.addEventListener('click', () => {
                const c = this.els.config;
                const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;
                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);

                if(c.rankedTime) {
                    localStorage.setItem('nr_ranked_time', c.rankedTime.value);
                    this.state.savedRankedTime = parseInt(c.rankedTime.value);
                }
                if(c.rankedShowMs) localStorage.setItem('nr_ranked_showMs', c.rankedShowMs.checked);

                                if(c.sandboxTime) {
                    localStorage.setItem('nr_sandbox_time', c.sandboxTime.value);
                    this.state.savedSandboxTime = parseInt(c.sandboxTime.value);
                }
                if(c.showMs) localStorage.setItem('nr_sandbox_showMs', c.showMs.checked);

                                const configKey = `nr_ranked_${this.state.savedRankedTime}`;
                this.preloadDistributionData(configKey);
                this.toggleSettings(true);
                if (this.state.gameMode === 'sandbox') this.startGame();
                else this.setPreStartState();
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

    NumbersRound.init();
});
