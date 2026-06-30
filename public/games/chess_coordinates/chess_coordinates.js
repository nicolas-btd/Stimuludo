
const chess_coordinatesTranslations = {
    fr: {
        header_title: "COORDONNÉES ÉCHI...",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            global_options: "Options Globales",
            upcoming: "Cibles suivantes :",
            upcoming_0: "Aucune",
            upcoming_1: "1 cible",
            upcoming_2: "2 cibles",
            show_labels: "Afficher repères :",
            no: "Non",
            yes: "Oui",
            orientation: "Orientation :",
            white_bottom: "Blancs en bas",
            black_bottom: "Noirs en bas",
            options_title: "Options",
            time: "Temps (sec) :",
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
            paused: "PAUSE"
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            score: "Score Atteint",
            record: "Record :",
            best: "Meilleur",
            you: "Vous",
            top: "TOP",
            avg_time: "Temps Moyen / Clic",
            fastest: "Plus rapide",
            slowest: "Plus lent",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "CHESS COORDINATES",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            global_options: "Global Options",
            upcoming: "Upcoming targets:",
            upcoming_0: "None",
            upcoming_1: "1 target",
            upcoming_2: "2 targets",
            show_labels: "Show Labels:",
            no: "No",
            yes: "Yes",
            orientation: "Orientation:",
            white_bottom: "White at bottom",
            black_bottom: "Black at bottom",
            options_title: "Options",
            time: "Time (sec):",
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
            paused: "PAUSED"
        },
        results: {
            new_record: "NEW RECORD!",
            score: "Score Reached",
            record: "Best:",
            best: "Best",
            you: "You",
            top: "TOP",
            avg_time: "Avg Time / Click",
            fastest: "Fastest",
            slowest: "Slowest",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.chess_coordinates = chess_coordinatesTranslations.fr;
    translations.en.chess_coordinates = chess_coordinatesTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, chess_coordinatesTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, chess_coordinatesTranslations['en']);
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

                        gain.gain.setValueAtTime(0.05 * volMod, t);
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

                        gain.gain.setValueAtTime(0.08 * volMod, t);
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

                        gain.gain.setValueAtTime(0.04 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

                        osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.3);
        }
    };


        const ChessCoordinates = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START',
            score: 0,

                        timeLeft: 30,
            elapsedTime: 0,
            isChrono: false,
            timerId: null,
            isActive: false,
            isPaused: false,

                        targets: [],
            files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            ranks: ['1', '2', '3', '4', '5', '6', '7', '8'],

                        solveTimes: [],
            lastClickTime: 0,

                        savedRankedConfig: "white", 
            savedSandboxConfig: {},
            distributionDataByConfig: {}
        },

        els: {
            gridWrapper: document.getElementById('grid-wrapper'),
            boardArea: document.getElementById('board-area'),
            chessBoard: document.getElementById('chess-board'),
            rankAxis: document.getElementById('rank-axis'),
            fileAxis: document.getElementById('file-axis'),

                        statusOverlay: document.getElementById('status-overlay'),
            score: document.getElementById('score'),
            timer: document.getElementById('timer'),
            board: document.querySelector('.game-board'),

                        targetOverlay: document.getElementById('board-target-overlay'),
            mainTarget: document.getElementById('main-target'),
            upcomingTargets: document.getElementById('upcoming-targets'),

                        restartBtn: document.getElementById('restart-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'), 
            pauseBtn: document.getElementById('pause-btn'),
            iconPause: document.getElementById('icon-pause'),
            iconPlay: document.getElementById('icon-play'),
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
                rankedShowMs: document.getElementById('ranked-show-ms'),

                                time: document.getElementById('sandbox-time-val'),
                showMs: document.getElementById('show-ms'),

                                showLabels: document.getElementById('show-labels-val'),
                upcomingCount: document.getElementById('upcoming-val')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('orientation')) {
                this.state.savedOrientationRanked = params.get('orientation');
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
                this.els.gridWrapper.classList.remove('blurred');
                this.startGame();
            } else {
                this.setPreStartState();
            }
            const configKey = `cc_ranked_${this.state.savedRankedConfig}`;
            this.preloadDistributionData(configKey);
        },

        loadUserPreferences() {
            const c = this.els.config;
            const savedRanked = localStorage.getItem('cc_ranked_config');
            if (savedRanked !== null && c.rankedConfig) {
                c.rankedConfig.value = savedRanked;
                this.state.savedRankedConfig = savedRanked;
            }
            const sRankedShowMs = localStorage.getItem('cc_ranked_showMs');
            if (sRankedShowMs !== null && c.rankedShowMs) c.rankedShowMs.checked = (sRankedShowMs === 'true');

                        const sTime = localStorage.getItem('cc_sandbox_time');
            if (sTime !== null && c.time) c.time.value = sTime;
            const sShowMs = localStorage.getItem('cc_sandbox_showMs');
            if (sShowMs !== null && c.showMs) c.showMs.checked = (sShowMs === 'true');

                        const savedLabels = localStorage.getItem('cc_global_labels');
            if (savedLabels !== null && c.showLabels) c.showLabels.value = savedLabels;
            const savedUpcoming = localStorage.getItem('cc_global_upcoming');
            if (savedUpcoming !== null && c.upcomingCount) c.upcomingCount.value = savedUpcoming;

            this.saveSandboxConfigSnapshot();
        },

        saveSandboxConfigSnapshot() {
            const c = this.els.config;
            this.state.savedSandboxConfig = {
                time: c.time ? c.time.value : "0",
                showMs: c.showMs ? c.showMs.checked : false
            };
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
            if (this.state.timerId) clearInterval(this.state.timerId);
            this.state.isActive = false;
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

                        this.renderBoard();
            this.els.targetOverlay.classList.add('hidden');
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

                        let timeSetting = 30;
            if (this.state.gameMode === 'sandbox') {
                timeSetting = parseInt(this.state.savedSandboxConfig.time) || 0;
            }
            this.els.timer.parentElement.innerHTML = timeSetting === 0 ? `<span id="timer">&infin;</span>s` : `<span id="timer">${timeSetting}</span>s`;
            this.els.timer = document.getElementById('timer');
            this.els.timer.parentElement.classList.remove('timer-danger');
        },

        renderBoard() {
            const targetOverlay = this.els.targetOverlay;
            this.els.chessBoard.innerHTML = '';
            this.els.chessBoard.appendChild(targetOverlay);
            this.els.rankAxis.innerHTML = '';
            this.els.fileAxis.innerHTML = '';

                        let orientation = 'white';
            let showLabels = false;

                        if (this.els.config.showLabels) showLabels = (this.els.config.showLabels.value === 'yes');

            if (this.state.gameMode === 'ranked') orientation = this.state.savedRankedConfig;

                        if (!showLabels) this.els.boardArea.classList.add('hide-labels');
            else this.els.boardArea.classList.remove('hide-labels');

            const files = this.state.files;
            const ranks = this.state.ranks;

            if (showLabels) {
                for (let i = 0; i < 8; i++) {
                    const rLabel = document.createElement('div');
                    rLabel.textContent = orientation === 'black' ? ranks[i] : ranks[7 - i];
                    this.els.rankAxis.appendChild(rLabel);
                    const fLabel = document.createElement('div');
                    fLabel.textContent = orientation === 'black' ? files[7 - i] : files[i];
                    this.els.fileAxis.appendChild(fLabel);
                }
            }

            for (let r = 0; r < 8; r++) {
                for (let f = 0; f < 8; f++) {
                    const square = document.createElement('div');
                    let file = files[f], rank = ranks[7 - r];
                    if (orientation === 'black') { file = files[7 - f]; rank = ranks[r]; }
                    const coord = file + rank;
                    square.classList.add('chess-square');
                    square.dataset.coord = coord;
                    const isLight = (f + r) % 2 === 0;
                    square.classList.add(isLight ? 'light-square' : 'dark-square');
                    square.addEventListener('mousedown', (e) => this.handleSquareClick(e, square, coord));
                    this.els.chessBoard.appendChild(square);
                }
            }
        },

        startGame() {
            this.state.currentState = 'PLAYING';
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.score = 0;
            this.state.solveTimes = [];
            this.state.targets = [];

                        if (this.state.timerId) clearInterval(this.state.timerId);

                        this.els.statusOverlay.classList.add('hidden');
            this.els.gridWrapper.classList.remove('blurred');
            this.els.gridWrapper.classList.remove('hidden');
            this.els.targetOverlay.classList.remove('hidden');
            this.els.score.textContent = "0";

                        this.updatePauseIcon();

                        let timeSetting = 0;
            if (this.state.gameMode === 'ranked') {
                timeSetting = 30; this.state.isChrono = false;
                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                const s = this.state.savedSandboxConfig;
                timeSetting = parseInt(s.time) || 0;
                this.state.isChrono = (timeSetting === 0);
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = 'visible';
            }

            this.resetTimer();
            if (!this.state.isChrono) this.state.timeLeft = timeSetting;
            else this.state.timeLeft = 0; 
            this.startTimer(); 

            this.renderBoard();
            this.fillTargets();
            this.updateTargetUI();
            this.state.lastClickTime = performance.now();
        },

        togglePause() {
            if (this.state.gameMode === 'ranked' || !this.state.isActive) return; 

                        this.state.isPaused = !this.state.isPaused;

                        if (this.state.isPaused) {
                clearInterval(this.state.timerId); 
            } else {
                this.startTimer(); 
                this.state.lastClickTime = performance.now(); 
            }
            this.updatePauseIcon();
        },

        updatePauseIcon() {
            if (this.state.isPaused) {
                this.els.iconPause.classList.add('hidden');
                this.els.iconPlay.classList.remove('hidden');
                this.els.pauseBtn.classList.add('btn-paused-active');
            } else {
                this.els.iconPlay.classList.add('hidden');
                this.els.iconPause.classList.remove('hidden');
                this.els.pauseBtn.classList.remove('btn-paused-active', 'btn-paused-pending');
            }
        },

        fillTargets() {
            let required = 2; 
            if (this.els.config.upcomingCount) {
                required = parseInt(this.els.config.upcomingCount.value) + 1;
            }

                        while (this.state.targets.length < required) {
                const f = this.state.files[Math.floor(Math.random() * 8)];
                const r = this.state.ranks[Math.floor(Math.random() * 8)];
                this.state.targets.push(f + r);
            }
        },

        updateTargetUI() {
            if(this.state.targets.length > 0) this.els.mainTarget.textContent = this.state.targets[0];
            this.els.upcomingTargets.innerHTML = '';
            for (let i = 1; i < this.state.targets.length; i++) {
                const span = document.createElement('span');
                span.className = 'upcoming-target-item';
                span.textContent = this.state.targets[i];
                this.els.upcomingTargets.appendChild(span);
            }
        },

        handleSquareClick(e, squareElement, coord) {
            if (!this.state.isActive || this.state.targets.length === 0 || this.state.isPaused) return;

                        if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            if (coord === this.state.targets[0]) {
                this.handleSuccess(squareElement);
            } else {
                this.handleError(squareElement);
            }
        },

        handleSuccess(squareElement) {
            SoundEngine.playHit();
            const timeTaken = (performance.now() - this.state.lastClickTime) / 1000;
            this.state.solveTimes.push(timeTaken);
            this.state.score++;
            this.els.score.textContent = this.state.score;
            squareElement.classList.add('square-success');
            setTimeout(() => squareElement.classList.remove('square-success'), 150);
            this.state.targets.shift();
            this.fillTargets();
            this.updateTargetUI();
            this.state.lastClickTime = performance.now();
        },

        handleError(squareElement) {
            SoundEngine.playError();
            squareElement.classList.add('square-error');
            setTimeout(() => squareElement.classList.remove('square-error'), 300);
        },

        startTimer() {
            this.updateTimerUI();
            this.state.timerId = setInterval(() => {
                if (this.state.isChrono) {
                    this.state.timeLeft += 0.01;
                    this.state.timeLeft = Math.round(this.state.timeLeft * 100) / 100;
                    this.updateTimerUI();
                } else {
                    this.state.timeLeft -= 0.01;
                    this.state.timeLeft = Math.round(this.state.timeLeft * 100) / 100;
                    this.updateTimerUI();
                    if (this.state.timeLeft <= 0) {
                        this.state.timeLeft = 0;
                        this.updateTimerUI();
                        this.endGame();
                    }
                }
            }, 10);
        },

                resetTimer() {
            clearInterval(this.state.timerId);
            if (this.els.timer && this.els.timer.parentElement) {
                this.els.timer.parentElement.classList.remove('timer-danger');
            }
        },

                updateTimerUI() {
            if (!this.els.timer || !this.els.timer.parentElement) return;

                        const textContainer = this.els.timer.parentElement; 
            let showMs = false;

                        if (this.state.gameMode === 'sandbox') {
                if (this.els.config.showMs) showMs = this.els.config.showMs.checked;
            } else {
                if (this.els.config.rankedShowMs) showMs = this.els.config.rankedShowMs.checked;
            }

            if (this.state.timeLeft > 0 || this.state.isChrono) {
                let displayTime = showMs ? this.state.timeLeft.toFixed(2) : Math.ceil(this.state.timeLeft);
                if (!textContainer.innerHTML.includes('s') && textContainer.innerHTML.includes('timer')) {
                    textContainer.innerHTML = `<span id="timer">${displayTime}</span>s`;
                    this.els.timer = document.getElementById('timer'); 
                } else this.els.timer.textContent = displayTime;
            } else {
                if (this.els.timer.innerHTML !== "&infin;") {
                    textContainer.innerHTML = `<span id="timer">&infin;</span>s`;
                    this.els.timer = document.getElementById('timer'); 
                }
            }
        },

        async endGame() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';
            clearInterval(this.state.timerId);
            SoundEngine.playEnd();
            this.els.targetOverlay.classList.add('hidden');
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
            if (this.els.pauseBtn) this.els.pauseBtn.style.visibility = 'hidden';

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = this.state.score;
                this.saveScoreToDatabase(this.state.score, this.state.savedRankedConfig);

                                const recordKey = `cc_best_ranked_${this.state.savedRankedConfig}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                                if (best === null || this.state.score > best) {
                    best = this.state.score;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.savedRankedConfig);
                }

                                if (isRecord && savedBest !== null) {
                    this.els.newRecordMsg.style.visibility = 'visible';
                    this.els.newRecordMsg.style.opacity = '1';
                } else {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }
                const configKey = `cc_ranked_${this.state.savedRankedConfig}`;
                this.drawDistributionChart(this.state.score, best, configKey);
            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                if (this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }
                this.els.sandboxScore.textContent = this.state.score;

                                if (this.state.solveTimes.length > 0) {
                    const sum = this.state.solveTimes.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.state.solveTimes.length).toFixed(2);
                    const fastest = Math.min(...this.state.solveTimes).toFixed(2);
                    this.els.statAvgTime.textContent = `${avg}s`;
                    this.els.statFastest.textContent = `${fastest}s`;
                } else {
                    this.els.statAvgTime.textContent = `--s`;
                    this.els.statFastest.textContent = `--s`;
                }
            }
            this.toggleOverlay(this.els.overlayOver, true);
            const configKey = `cc_ranked_${this.state.savedRankedConfig}`;
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

        async saveScoreToDatabase(score, orientation) {
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
                    body: JSON.stringify({ game_id: 'chess_coordinates', score: score, details: { orientation: orientation }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, orientation) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `cc_ranked_${orientation}`, score: score, details: { orientation: orientation }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
            if (!this.state.distributionDataByConfig[configKey]) {
                this.state.distributionDataByConfig[configKey] = [];
            }


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

                        const range = maxX - minX;

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
                        ${currentScore}
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
                const snappedPercentX = (val - minX) / range;


                                                let areaToRight = 0;
                for (let i = 0; i <= steps; i++) {
                    let pointVal = minX + (i / steps) * range;
                    if (pointVal >= val) {
                        areaToRight += densities[i].y;
                    }
                }

                                let percentile = clamp((areaToRight / totalArea) * 100, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                                tooltip.style.left = `${snappedPercentX * 100}%`;
                tooltip.innerHTML = `<strong>${val}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                tooltip.classList.remove('hidden');

                                hoverLine.style.left = `${snappedPercentX * 100}%`;
                hoverLine.classList.remove('hidden');
            };

                        distContainer.onmouseleave = () => {
                tooltip.classList.add('hidden');
                hoverLine.classList.add('hidden');
            };
        },

        async preloadDistributionData(configKey) {
            const distKey = configKey || `cc_ranked_${this.state.savedRankedConfig}`;
            try {
                const res = await fetch(`/api/scores/distribution/chess_coordinates?orientation=${this.state.savedRankedConfig}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
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
            if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
            else { el.classList.remove('visible'); el.classList.add('hidden'); }
        },

        updateSettingsView(mode) {
            if (mode === 'ranked') { 
                if(this.els.settingsGroupRanked) this.els.settingsGroupRanked.style.display = 'block'; 
                if(this.els.settingsGroupSandbox) this.els.settingsGroupSandbox.style.display = 'none'; 
            } else { 
                if(this.els.settingsGroupRanked) this.els.settingsGroupRanked.style.display = 'none'; 
                if(this.els.settingsGroupSandbox) this.els.settingsGroupSandbox.style.display = 'block'; 
            }
        },

        restoreConfigUI() {
            const c = this.els.config;
            if (c.rankedConfig) c.rankedConfig.value = this.state.savedRankedConfig;

                        const sRankedShowMs = localStorage.getItem('cc_ranked_showMs');
            if (c.rankedShowMs) c.rankedShowMs.checked = (sRankedShowMs === 'true');

                        const s = this.state.savedSandboxConfig;
            if (s.time !== undefined) { 
                if (c.time) c.time.value = s.time; 
                if (c.showMs) c.showMs.checked = s.showMs; 
            }
            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if(activeRadio) activeRadio.checked = true;
            this.updateSettingsView(this.state.gameMode);
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
            if (!panel) return;
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
                if(this.els.iconExpand) this.els.iconExpand.classList.add('hidden');
                if(this.els.iconCompress) this.els.iconCompress.classList.remove('hidden');
            } else {
                if(this.els.iconCompress) this.els.iconCompress.classList.add('hidden');
                if(this.els.iconExpand) this.els.iconExpand.classList.remove('hidden');
            }
        },

        bindEvents() {
            const { els } = this;

                        if (els.modeToggleRadios) {
                els.modeToggleRadios.forEach(radio => radio.addEventListener('change', (e) => this.updateSettingsView(e.target.value)));
            }

                        if (els.restartBtn) {
                els.restartBtn.addEventListener('click', () => {
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') this.startGame(); else this.setPreStartState();
                });
            }

                        if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') this.startGame(); else this.setPreStartState();
                });
            }

            if (els.pauseBtn) {
                els.pauseBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePause();
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

                        if (els.board) {
                els.board.addEventListener('click', (e) => { 
                    if (this.state.currentState === 'PRE_START' && !e.target.closest('button')) this.startGame(); 
                });
            }

                        document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel?.classList.contains('panel-hidden');
                const isOverVisible = this.els.overlayOver?.classList.contains('visible'); 

                                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();
                if (e.code === 'Escape') { e.preventDefault(); this.toggleSettings(); }

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
                        if (els.saveSettings) els.saveSettings.click(); 
                    } 
                    else if (isOverVisible) { 
                        e.preventDefault(); 
                        this.toggleOverlay(this.els.overlayOver, false); 
                        if (this.state.gameMode === 'sandbox') this.startGame(); else this.setPreStartState(); 
                    }
                    else if (this.state.currentState === 'PRE_START') { 
                        e.preventDefault(); 
                        this.startGame(); 
                    }
                }
            });

            if (els.settingsToggle) {
                els.settingsToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (document.fullscreenElement) { 
                        document.exitFullscreen().catch(err => console.error(err)); 
                        if (this.els.settingsPanel?.classList.contains('panel-hidden')) this.toggleSettings(); 
                    }
                    else this.toggleSettings();
                });
            }

                        if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

                        if (els.saveSettings) {
                els.saveSettings.addEventListener('click', () => {
                    const c = this.els.config;
                    const checkedMode = document.querySelector('input[name="mode-toggle"]:checked');
                    const selectedMode = checkedMode ? checkedMode.value : 'ranked';

                                        this.state.gameMode = selectedMode;
                    window.history.replaceState(null, '', '?mode=' + selectedMode);

                                        if (c.rankedConfig) {
                        localStorage.setItem('cc_ranked_config', c.rankedConfig.value);
                        this.state.savedRankedConfig = c.rankedConfig.value;
                    }
                    if (c.rankedShowMs) {
                        localStorage.setItem('cc_ranked_showMs', c.rankedShowMs.checked);
                    }
                    if (c.time) localStorage.setItem('cc_sandbox_time', c.time.value);
                    if (c.showMs) localStorage.setItem('cc_sandbox_showMs', c.showMs.checked);
                    if (c.showLabels) localStorage.setItem('cc_global_labels', c.showLabels.value);
                    if (c.upcomingCount) localStorage.setItem('cc_global_upcoming', c.upcomingCount.value);

                                        this.saveSandboxConfigSnapshot();

                                        const configKey = `cc_ranked_${this.state.savedRankedConfig}`;
                    this.preloadDistributionData(configKey);
                    this.toggleSettings(true);

                                        if (this.state.gameMode === 'sandbox') this.startGame(); else this.setPreStartState();
                });
            }

                        document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel?.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel?.contains(e.target) || els.settingsToggle?.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });

                        window.addEventListener('storage', (e) => { 
                if (e.key === 'globalOpaque') this.loadBackgroundPreference(); 
            });
        }
    };

    ChessCoordinates.init();
});