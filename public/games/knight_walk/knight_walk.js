
const knight_walkTranslations = {
    fr: {
        header_title: "PARCOURS DU CAVALIER",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            time_30s: "30 sec",
            time_1m: "1 min",
            title: "Configuration",
            options_title: "Options",
            time: "Temps :",
            time_hint: "Mettez 0 pour jouer sans limite.",
            show_ms: "Afficher les centièmes",
            constraint_mode: "Mode contrainte (Dame)",
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
            avg_time: "Temps Moyen / Cible",
            fastest: "Plus rapide",
            slowest: "Plus lent",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "KNIGHT WALK",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            time_30s: "30 sec",
            time_1m: "1 min",
            title: "Settings",
            options_title: "Options",
            time: "Time:",
            time_hint: "Set to 0 for unlimited play.",
            show_ms: "Show milliseconds",
            constraint_mode: "Constraint Mode (Queen)",
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
            avg_time: "Avg Time / Target",
            fastest: "Fastest",
            slowest: "Slowest",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.knight_walk = knight_walkTranslations.fr;
    translations.en.knight_walk = knight_walkTranslations.en;
}

function getGameText(key) {
    let lang = localStorage.getItem('siteLanguage');
    if (!lang) {
        const browserLang = navigator.language || navigator.userLanguage;
        lang = browserLang.startsWith('fr') ? 'fr' : 'en';
    }
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, knight_walkTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, knight_walkTranslations['en']);
}



const svgKnight = `<svg width="100%" height="100%" viewBox="0 0 511.999 511.999" fill="currentColor"><g>
<path style="fill:#FFFFFF;" d="M282.79,352.83h102.83c30.575,0,57.028-21.281,63.577-51.147l0,0
    c5.981-27.278-6.106-55.33-30.038-69.721l-202.69-121.868V13.265c0,0-184.373,84.891-151.212,485.471h298.446
    C363.702,498.736,361.049,432.415,282.79,352.83z"/>
<path d="M425.994,220.594l-196.26-118.001V13.265c0-4.522-2.303-8.732-6.11-11.17c-3.808-2.438-8.594-2.771-12.702-0.879
    c-2.036,0.938-50.371,23.813-93.927,97.84c-25.117,42.69-43.661,93.921-55.117,152.275c-14.194,72.301-17.505,155.908-9.841,248.499
    c0.569,6.878,6.318,12.17,13.219,12.17h298.446c3.611,0,7.063-1.471,9.565-4.075s3.833-6.112,3.689-9.72
    c-0.106-2.646-3.132-60.047-64.093-132.112h72.758c17.801,0,35.242-6.145,49.112-17.303c13.869-11.158,23.608-26.879,27.42-44.268
    C469.358,271.659,454.827,237.931,425.994,220.594z M436.24,298.843c-5.174,23.597-26.464,40.723-50.62,40.723H282.79
    c-5.344,0-10.167,3.207-12.234,8.136c-2.067,4.929-0.971,10.617,2.776,14.428c52.709,53.605,69.485,100.909,74.752,123.343H77.53
    c-14.133-194.378,25.168-308.76,61.078-370.817c23.3-40.266,48.144-64.121,64.597-76.911v72.35c0,4.654,2.441,8.969,6.429,11.367
    l202.691,121.868C431.395,254.796,441.006,277.105,436.24,298.843z"/>
<path d="M174.604,131.372c-6.452-3.469-14.495-1.051-17.964,5.401c-28.445,52.906-61.034,149.534-54.755,309.427
    c0.28,7.143,6.16,12.743,13.244,12.743c0.175,0,0.353-0.003,0.529-0.011c7.321-0.288,13.02-6.454,12.734-13.775
    c-6.045-153.916,24.731-245.825,51.613-295.822C183.475,142.884,181.057,134.842,174.604,131.372z"/>
<circle cx="261.57" cy="232.125" r="13.264"/>
</g></svg>`;

const svgQueen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 502.7 958.9" width="100%" height="100%">
    <path d="M15 957c-14-7-15-13-15-58 1-54 8-72 38-92 12-8 13-10 14-29q1-43 32-57c8-4 8-4 12-18a888 888 0 0 0 41-229c1-6 1-6-10-6-67-4-95-89-41-126 5-3 7 4-19-81l-17-57c-17-59-18-61-23-67-23-24-7-61 26-59q18 1 28 19c3 6 11 10 58 30 19 7 16 8 26-7l42-60c8-11 8-11 8-21q0-25 21-35c26-12 56 9 53 38-1 6-1 6 13 26l29 42c18 26 14 25 33 17 49-21 55-24 58-30 17-32 64-21 64 15q1 14-9 24c-6 7-8 10-19 50l-40 133c-6 21-6 19 0 24 53 38 25 121-42 125-11 0-11 0-11 4l2 15c3 69 17 144 39 214 5 16 5 16 13 20q30 14 32 56c1 20 1 21 14 30q28 20 36 50c3 12 2 82-1 88q-5 8-14 12c-6 3-465 3-471 0m437-69c-1-27-1-28-23-45-20-15-28-31-29-59 0-15-1-15-3-17-4-4-288-3-291 0-2 2-2 4-3 18-1 17-1 20-8 34q-9 15-27 29c-14 10-16 15-17 40 0 20 0 20 201 20 200 0 200 0 200-20m-95-175c-18-46-38-158-41-229 0-16 0-16-65-16-64 0-64 0-64 7a962 962 0 0 1-41 237c0 2 5 2 106 2zm30-299c12-10 10-30-5-35-5-2-260-1-263 1-14 8-14 29 0 36 7 4 263 2 268-2m-21-93 31-104c20-67 19-60 4-53l-43 19c-27 12-31 10-57-29l-41-59c-10-14-7-16-24 10-67 97-60 92-95 77l-43-19c-11-5-10-7-2 19l43 143c1 7 225 2 227-4m-207-23-3-9-10-33c-10-34-10-38 1-37 11 0 16 5 22 23 4 14 4 14 13 14 26 2 34 30 13 41-7 4-34 4-36 1m154 1c-27-8-21-41 8-43 9-1 9-1 13-14 6-20 20-30 28-22 5 4 4 6-6 41l-12 38zm-71-67c-10-3-17-14-16-25 3-31 48-32 51 0 1 18-17 32-35 25" style="fill:#000"/>
    <path d="M251 83q-6 3-10 10-25 39-53 77c-6 6-11 15-20 18-9 1-17-5-24-7l-52-23c-4-1-5 4-4 6l22 73 27 88c2 5 8 3 12 4q37 2 76 1 65 1 130-5 7 1 12-2 5-13 8-25l37-126q2-7 2-13c-3-3-8 1-12 2q-27 13-55 24-10 6-20-1-15-15-26-34l-46-65zm1 103c11-1 22 9 23 20s-7 23-19 25c-13 3-27-6-28-20q-1-16 15-24zm104 34q8 1 6 8-7 29-16 59l-4 10-30-1q-14-4-14-18c0-10 10-18 19-19 5-2 12 0 14-5 6-10 7-22 16-30q3-4 9-4zm-212 1q9-1 15 5c7 8 8 19 12 28 4 6 11 3 17 5 9 2 18 11 16 21 0 10-11 17-20 17q-11 2-22 0-3-2-4-8l-17-60q-1-4 1-8zM289 376l-164 1q-7-1-12 5c-9 9-9 27 3 35q10 3 21 3h147l98-3q7 0 10-6 7-10 4-21-5-10-15-13zM217 466q-14 0-28 2-6 5-4 12-7 114-39 224-1 5-1 10 5 2 11 2l201-1c4-1 0-5 0-8q-18-60-28-124-8-51-11-104 0-8-7-10-15-3-29-3zM246 762q-66 0-132 2c-4 1-10 0-11 5-3 15-1 31-8 44q-8 17-23 29c-8 7-19 13-21 25q-3 14-2 27c1 8 9 11 16 12q38 4 76 4l253-1q24 1 49-4 11-2 11-14c-1-11 1-22-5-32q-12-13-27-25a62 62 0 0 1-19-44q0-11-3-23c-3-4-10-2-14-3q-71-3-140-2z" style="fill:#27272a;fill-rule:evenodd;stroke:#27272a;stroke-width:1.29132;stroke-opacity:0;paint-order:markers fill stroke"/>
</svg>`;

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
        playMove() {
            const volMod = this.getVolumeMultiplier();
            if (volMod === 0) return;

            this.init();
            const t = audioCtx.currentTime;
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

                        osc.type = 'sine';
            osc.frequency.setValueAtTime(400, t); 

                        gain.gain.setValueAtTime(0.02 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

                        osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.02);
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


        const KnightWalk = {
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

                        isConstraintMode: false,
            currentTarget: null,
            currentKnight: null,
            currentQueen: null,
            files: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            ranks: ['1', '2', '3', '4', '5', '6', '7', '8'],

                        solveTimes: [],
            lastClickTime: 0,

                        savedRankedTime: "30", 
            savedSandboxConfig: {},
            distributionData: []
        },

        els: {
            gridWrapper: document.getElementById('grid-wrapper'),
            boardArea: document.getElementById('board-area'),
            chessBoard: document.getElementById('chess-board'),

                        statusOverlay: document.getElementById('status-overlay'),
            score: document.getElementById('score'),
            timer: document.getElementById('timer'),
            board: document.querySelector('.game-board'),

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
                rankedTime: document.getElementById('ranked-time-val'),
                rankedShowMs: document.getElementById('ranked-show-ms'),
                rankedConstraint: document.getElementById('ranked-constraint'),

                                time: document.getElementById('sandbox-time-val'),
                showMs: document.getElementById('show-ms'),
                sandboxConstraint: document.getElementById('sandbox-constraint')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('time')) {
                const t = params.get('time');
                this.state.savedRankedTime = t;
                localStorage.setItem('kw_ranked_time', t);
            }
            if (params.has('constraint')) {
                const c = params.get('constraint') === 'true';
                this.state.isConstraintMode = c;
                localStorage.setItem('kw_constraint_mode', c);
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


                                    this.preloadDistributionData();
        },

        loadUserPreferences() {
            const c = this.els.config;
            const savedRankedTime = localStorage.getItem('kw_ranked_time');
            if (savedRankedTime !== null) {
                c.rankedTime.value = savedRankedTime;
                this.state.savedRankedTime = savedRankedTime;
            } else {
                c.rankedTime.value = "30";
                this.state.savedRankedTime = "30";
            }

                        const sRankedShowMs = localStorage.getItem('kw_ranked_showMs');
            if (sRankedShowMs !== null) c.rankedShowMs.checked = (sRankedShowMs === 'true');

                        const sRankedConstraint = localStorage.getItem('kw_ranked_constraint');
            if (sRankedConstraint !== null) {
                c.rankedConstraint.checked = (sRankedConstraint === 'true');
            }

            const sTime = localStorage.getItem('kw_sandbox_time');
            if (sTime !== null) c.time.value = sTime;
            const sShowMs = localStorage.getItem('kw_sandbox_showMs');
            if (sShowMs !== null) c.showMs.checked = (sShowMs === 'true');

                        const sSandboxConstraint = localStorage.getItem('kw_sandbox_constraint');
            if (sSandboxConstraint !== null) c.sandboxConstraint.checked = (sSandboxConstraint === 'true');


                        this.state.isConstraintMode = this.state.gameMode === 'ranked' ? c.rankedConstraint.checked : c.sandboxConstraint.checked;

            this.saveSandboxConfigSnapshot();
        },

        saveSandboxConfigSnapshot() {
            const c = this.els.config;
            this.state.savedSandboxConfig = {
                time: c.time.value,
                showMs: c.showMs.checked,
                constraint: c.sandboxConstraint.checked
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
                this.els.ingameRestartBtn.style.display = 'flex';
                this.els.ingameRestartBtn.style.visibility = 'visible';
            } else {
                this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = 'hidden';
            }

                        let timeSetting = parseInt(this.state.savedRankedTime) || 30;
            if (this.state.gameMode === 'sandbox') {
                timeSetting = parseInt(this.state.savedSandboxConfig.time) || 0;
            }
            this.els.timer.parentElement.innerHTML = timeSetting === 0 ? `<span id="timer">&infin;</span>s` : `<span id="timer">${timeSetting}</span>s`;
            this.els.timer = document.getElementById('timer');
            this.els.timer.parentElement.classList.remove('timer-danger');
        },

        renderBoard() {
            this.els.chessBoard.innerHTML = '';

                        this.els.boardArea.classList.add('hide-labels');

            const files = this.state.files;
            const ranks = this.state.ranks;

            for (let r = 0; r < 8; r++) {
                for (let f = 0; f < 8; f++) {
                    const square = document.createElement('div');
                    let file = files[f], rank = ranks[7 - r];
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

        getRandomSquare() {
            const f = this.state.files[Math.floor(Math.random() * 8)];
            const r = this.state.ranks[Math.floor(Math.random() * 8)];
            return f + r;
        },

        getValidKnightMoves(sq) {
            const fIdx = this.state.files.indexOf(sq[0]);
            const rIdx = this.state.ranks.indexOf(sq[1]);
            const moves = [];
            const offsets = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
            for (let [df, dr] of offsets) {
                const nf = fIdx + df;
                const nr = rIdx + dr;
                if (nf >= 0 && nf < 8 && nr >= 0 && nr < 8) {
                    moves.push(this.state.files[nf] + this.state.ranks[nr]);
                }
            }
            return moves;
        },

        isValidKnightMove(from, to) {
            if (!from || !to) return false;
            const f1 = this.state.files.indexOf(from[0]) + 1;
            const r1 = parseInt(from[1]);
            const f2 = this.state.files.indexOf(to[0]) + 1;
            const r2 = parseInt(to[1]);
            const dx = Math.abs(f1 - f2);
            const dy = Math.abs(r1 - r2);
            return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
        },

        isThreatened(sq, queenSq) {
            if (!sq || !queenSq) return false;
            const f1 = this.state.files.indexOf(sq[0]);
            const r1 = this.state.ranks.indexOf(sq[1]);
            const f2 = this.state.files.indexOf(queenSq[0]);
            const r2 = this.state.ranks.indexOf(queenSq[1]);

            return f1 === f2 || r1 === r2 || Math.abs(f1 - f2) === Math.abs(r1 - r2);
        },

        hasPath(startSq, targetSq, queenSq) {
            let queue = [startSq];
            let visited = new Set([startSq]);
            while(queue.length > 0) {
                let curr = queue.shift();
                if (curr === targetSq) return true;
                let moves = this.getValidKnightMoves(curr);
                for (let next of moves) {
                    if (!this.isThreatened(next, queenSq) && !visited.has(next)) {
                        visited.add(next);
                        queue.push(next);
                    }
                }
            }
            return false;
        },

        moveKnightTo(coord) {
            const oldSq = this.els.chessBoard.querySelector(`[data-coord="${this.state.currentKnight}"]`);
            if(oldSq) {
                const k = oldSq.querySelector('.knight-piece');
                if(k) k.remove();
            }
            this.state.currentKnight = coord;
            const newSq = this.els.chessBoard.querySelector(`[data-coord="${coord}"]`);
            if(newSq) {
                const k = document.createElement('div');
                k.className = 'knight-piece';
                k.innerHTML = svgKnight; 
                newSq.appendChild(k);
            }
        },

        setQueen(coord) {
            const oldSq = this.els.chessBoard.querySelector(`.queen-piece`);
            if(oldSq) oldSq.remove();
            this.state.currentQueen = coord;
            if(!coord) return;
            const newSq = this.els.chessBoard.querySelector(`[data-coord="${coord}"]`);
            if(newSq) {
                const q = document.createElement('div');
                q.className = 'queen-piece';
                q.innerHTML = svgQueen;
                newSq.appendChild(q);
            }
        },

        setTarget(coord) {
            const oldSq = this.els.chessBoard.querySelector(`.target-indicator`);
            if(oldSq) oldSq.remove();
            this.state.currentTarget = coord;
            const newSq = this.els.chessBoard.querySelector(`[data-coord="${coord}"]`);
            if(newSq) {
                const ind = document.createElement('div');
                ind.className = 'target-indicator';
                newSq.appendChild(ind);
            }
        },

        startGame() {
            this.state.currentState = 'PLAYING';
            this.state.isActive = true;
            this.state.isPaused = false;
            this.state.score = 0;
            this.state.solveTimes = [];
            this.state.currentTarget = null;
            this.state.currentKnight = null;
            this.state.currentQueen = null;

                        if (this.state.timerId) clearInterval(this.state.timerId);

                        this.els.statusOverlay.classList.add('hidden');
            this.els.gridWrapper.classList.remove('blurred');
            this.els.gridWrapper.classList.remove('hidden');
            this.els.score.textContent = "0";

                        this.updatePauseIcon();

                        let timeSetting = 0;
            if (this.state.gameMode === 'ranked') {
                timeSetting = parseInt(this.state.savedRankedTime) || 30; 
                this.state.isChrono = false;
                this.state.isConstraintMode = this.els.config.rankedConstraint.checked;
                this.els.pauseBtn.style.display = 'none';
                this.els.ingameRestartBtn.style.display = 'flex';
                this.els.ingameRestartBtn.style.visibility = 'visible';
            } else {
                const s = this.state.savedSandboxConfig;
                timeSetting = parseInt(s.time) || 0;
                this.state.isChrono = (timeSetting === 0);
                this.state.isConstraintMode = s.constraint;
                this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = 'visible';
            }

            this.resetTimer();
            if (!this.state.isChrono) this.state.timeLeft = timeSetting;
            else this.state.timeLeft = 0; 
            this.startTimer(); 

            this.renderBoard();

                        let kSquare, tSquare, qSquare;
            let validSetup = false;
            while (!validSetup) {
                kSquare = this.getRandomSquare();
                tSquare = this.getRandomSquare();
                if (kSquare === tSquare) continue;

                                if (this.isValidKnightMove(kSquare, tSquare)) continue;

                if (this.state.isConstraintMode) {
                    qSquare = this.getRandomSquare();
                    if (qSquare === kSquare || qSquare === tSquare) continue;
                    if (this.isThreatened(kSquare, qSquare) || this.isThreatened(tSquare, qSquare)) continue;
                    if (this.hasPath(kSquare, tSquare, qSquare)) {
                        validSetup = true;
                    }
                } else {
                    qSquare = null;
                    validSetup = true;
                }
            }

            this.moveKnightTo(kSquare);
            this.setTarget(tSquare);
            this.setQueen(qSquare);

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

        handleSquareClick(e, squareElement, coord) {
            if (!this.state.isActive || !this.state.currentTarget || this.state.isPaused) return;

                        if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            if (this.state.isConstraintMode && this.isThreatened(coord, this.state.currentQueen)) {
                this.handleError(squareElement);
                return;
            }

            if (this.isValidKnightMove(this.state.currentKnight, coord)) {
                this.moveKnightTo(coord);

                                if (coord === this.state.currentTarget) {
                    this.handleSuccess(squareElement);
                } else {
                    SoundEngine.playMove();
                }
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

                        let newK, newT, newQ;
            let validSetup = false;

            while (!validSetup) {
                newK = this.getRandomSquare();
                if (newK === this.state.currentTarget) continue;

                newT = this.getRandomSquare();
                if (newT === newK) continue;
                if (this.isValidKnightMove(newK, newT)) continue;

                if (this.state.isConstraintMode) {
                    newQ = this.getRandomSquare();
                    if (newQ === newK || newQ === newT) continue;
                    if (this.isThreatened(newK, newQ) || this.isThreatened(newT, newQ)) continue;
                    if (this.hasPath(newK, newT, newQ)) {
                        validSetup = true;
                    }
                } else {
                    newQ = null;
                    validSetup = true;
                }
            }

            this.moveKnightTo(newK);
            this.setTarget(newT);
            this.setQueen(newQ);

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
            this.els.timer.parentElement.classList.remove('timer-danger');
        },

                updateTimerUI() {
            const textContainer = this.els.timer.parentElement; 
            const showMs = (this.state.gameMode === 'sandbox') ? this.els.config.showMs.checked : this.els.config.rankedShowMs.checked;

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
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
            if (this.els.pauseBtn) this.els.pauseBtn.style.visibility = 'hidden';

            const constraintSuffix = this.state.isConstraintMode ? '_constraint' : '';

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedScore.textContent = this.state.score;
                this.saveScoreToDatabase(this.state.score, this.state.savedRankedTime);

                                const recordKey = `kw_best_ranked_${this.state.savedRankedTime}${constraintSuffix}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;
                if (best === null || this.state.score > best) {
                    best = this.state.score;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.savedRankedTime);
                }
                if (isRecord && savedBest !== null) {
                    this.els.newRecordMsg.style.visibility = 'visible';
                    this.els.newRecordMsg.style.opacity = '1';
                } else {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }
                this.drawDistributionChart(this.state.score, best);
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
                    this.els.statAvgTime.textContent = `${avg}s`;
                    this.els.statFastest.textContent = `${fastest}s`;
                } else {
                    this.els.statAvgTime.textContent = `--s`;
                    this.els.statFastest.textContent = `--s`;
                }
            }
            this.toggleOverlay(this.els.overlayOver, true);
        },

                getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },

        async saveScoreToDatabase(score, time) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: score }, '*');
                return;
            }
            try {

                                const constraintSuffix = this.state.isConstraintMode ? '_constraint' : '';
                const gameModeKey = `kw_ranked_${time}${constraintSuffix}`;

                                fetch('/api/scores', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'knight_walk', score: score, details: { time: time, constraint: this.state.isConstraintMode }, game_mode_key: gameModeKey, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, time) {
            const constraintSuffix = this.state.isConstraintMode ? '_constraint' : '';
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `kw_ranked_${time}${constraintSuffix}`, score: score, details: { time: time, constraint: this.state.isConstraintMode }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async drawDistributionChart(currentScore, bestScore) {


                                    if (!this.state.distributionData) {
                this.state.distributionData = [];
            }
            this.state.distributionData.push(currentScore);

                        let scores = [...this.state.distributionData];

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

            let currentOffset = 5; if (bestPercent !== null && Math.abs(currentPercent - bestPercent) < 8) currentOffset = 30;

            if (bestScore !== null && currentScore === bestScore) this.els.markerCurrent.style.display = 'none';
            else {
                this.els.markerCurrent.style.display = 'block';
                this.els.markerCurrent.style.left = `${currentPercent}%`;
                this.els.markerCurrent.innerHTML = `<div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div><div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">${currentScore}</div>`;
            }

            if (bestScore !== null) {
                this.els.markerBest.classList.remove('hidden');
                this.els.markerBest.style.left = `${bestPercent}%`;
                this.els.markerBest.innerHTML = `<div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);"><svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/></svg></div><div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div><div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">${bestScore}</div>`;
            } else {
                this.els.markerBest.classList.add('hidden');
            }

            const tooltip = this.els.viewRanked.querySelector('.chart-tooltip'), hoverLine = this.els.viewRanked.querySelector('.hover-line');
            distContainer.onmousemove = (e) => {
                const rect = distContainer.getBoundingClientRect(), mouseX = e.clientX - rect.left, percentX = clamp(mouseX / rect.width, 0, 1);
                const val = Math.round(minX + percentX * range), snappedPercentX = (val - minX) / range;
                let areaToRight = 0;
                for (let i = 0; i <= steps; i++) if (minX + (i / steps) * range >= val) areaToRight += densities[i].y;
                let percentile = clamp((areaToRight / totalArea) * 100, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);
                tooltip.style.left = `${snappedPercentX * 100}%`;
                tooltip.innerHTML = `<strong>${val}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                tooltip.classList.remove('hidden'); hoverLine.style.left = `${snappedPercentX * 100}%`; hoverLine.classList.remove('hidden');
            };
            distContainer.onmouseleave = () => { tooltip.classList.add('hidden'); hoverLine.classList.add('hidden'); };
        },

        async preloadDistributionData() {
            try {


                                                const time = this.state.savedRankedTime || "30";
                const isConstraint = this.els.config.rankedConstraint.checked;
                const constraintSuffix = isConstraint ? '_constraint' : '';
                const gameModeKey = `kw_ranked_${time}${constraintSuffix}`;

                const res = await fetch(`/api/scores/distribution/knight_walk?time=${time}&constraint=${isConstraint}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                                if (res.ok) {
                    this.state.distributionData = await res.json();
                } else {
                    this.state.distributionData = [];
                }
            } catch (e) {
                console.error(e);
                this.state.distributionData = [];
            }
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
            c.rankedTime.value = this.state.savedRankedTime;
            const sRankedShowMs = localStorage.getItem('kw_ranked_showMs');
            c.rankedShowMs.checked = (sRankedShowMs === 'true');
            c.rankedConstraint.checked = (localStorage.getItem('kw_ranked_constraint') === 'true');

                        const s = this.state.savedSandboxConfig;
            if (s.time !== undefined) { 
                c.time.value = s.time; 
                c.showMs.checked = s.showMs; 
                c.sandboxConstraint.checked = s.constraint;
            }

                        const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if(activeRadio) activeRadio.checked = true;
            this.updateSettingsView(this.state.gameMode);
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel, isHidden = panel.classList.contains('panel-hidden');
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
                if (this.state.gameMode === 'sandbox') this.startGame(); else this.setPreStartState();
            });

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

            if (els.fullscreenBtn) els.fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleFullscreen(); });

                        const exitFsBtn = document.querySelector('.exit-fs-btn');
            if (exitFsBtn) {
                exitFsBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.toggleFullscreen(); 
                });
            }

            document.addEventListener('fullscreenchange', () => this.updateFullscreenIcon());

                        els.board.addEventListener('click', (e) => { if (this.state.currentState === 'PRE_START' && !e.target.closest('button')) this.startGame(); });

                        document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const isOverVisible = this.els.overlayOver.classList.contains('visible'); 

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
                        els.saveSettings.click(); 
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

            els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) { document.exitFullscreen().catch(err => console.error(err)); if (this.els.settingsPanel.classList.contains('panel-hidden')) this.toggleSettings(); }
                else this.toggleSettings();
            });
            if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));
            if (els.saveSettings) els.saveSettings.addEventListener('click', () => {
                const c = this.els.config, selectedMode = document.querySelector('input[name="mode-toggle"][value="ranked"]:checked, input[name="mode-toggle"][value="sandbox"]:checked').value;
                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);

                                localStorage.setItem('kw_ranked_time', c.rankedTime.value);
                localStorage.setItem('kw_ranked_showMs', c.rankedShowMs.checked);
                localStorage.setItem('kw_ranked_constraint', c.rankedConstraint.checked);
                this.state.savedRankedTime = c.rankedTime.value;

                                localStorage.setItem('kw_sandbox_time', c.time.value);
                localStorage.setItem('kw_sandbox_showMs', c.showMs.checked);
                localStorage.setItem('kw_sandbox_constraint', c.sandboxConstraint.checked);
                this.saveSandboxConfigSnapshot();


                                this.state.isConstraintMode = this.state.gameMode === 'ranked' ? c.rankedConstraint.checked : c.sandboxConstraint.checked;


                                this.preloadDistributionData();

                this.els.settingsPanel.classList.remove('panel-visible'); this.els.settingsPanel.classList.add('panel-hidden');
                if (this.state.gameMode === 'sandbox') this.startGame(); else this.setPreStartState();
            });
            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel.classList.contains('panel-hidden'), clickedInside = els.settingsPanel.contains(e.target) || els.settingsToggle.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });
            window.addEventListener('storage', (e) => { if (e.key === 'globalOpaque') this.loadBackgroundPreference(); });
        }
    };
    KnightWalk.init();
});