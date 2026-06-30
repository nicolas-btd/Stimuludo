
const mental_mathTranslations = {
    fr: {
        header_title: "CALCUL MENTAL",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            int_1_9: "1 à 9",
            int_1_99: "1 à 99",
            title: "Configuration",
            time: "Temps :",
            difficulty: "Difficulté :",
            flash_effect: "Flash visuel",
            ops_title: "Opérations",
            op_add: "Addition ( + )",
            op_sub: "Soustraction ( - )",
            op_mul: "Multiplication ( x )",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            score: "Score :",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            paused: "PAUSE",
            pause_hint: "", 
            hint_fullscreen: "" 
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
        header_title: "MENTAL MATH",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            int_1_9: "1 to 9",
            int_1_99: "1 to 99",
            title: "Settings",
            time: "Time:",
            difficulty: "Difficulty:",
            flash_effect: "Visual flash",
            ops_title: "Operations",
            op_add: "Addition ( + )",
            op_sub: "Subtraction ( - )",
            op_mul: "Multiplication ( x )",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            score: "Score:",
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            paused: "PAUSED",
            pause_hint: "", 
            hint_fullscreen: "" 
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
    translations.fr.mental_math = mental_mathTranslations.fr;
    translations.en.mental_math = mental_mathTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, mental_mathTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, mental_mathTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {

    const MentalMath = {
        state: {
            gameMode: 'ranked',
            score: 0,
            timeLeft: 0,
            isActive: false,
            isPaused: false,
            timerId: null,
            currentResult: null,
            currentOpParts: { a: '', symbol: '', b: '' },
            currentInputString: "", 

                        operationTimes: [],
            currentOpStartTime: 0,
            pauseStartTime: 0,

                        savedTimeRanked: 60,
            savedDifficultyRanked: "1-9",
            savedFlashRanked: true,

                        savedTimeSandbox: 60,
            savedShowMsSandbox: false,
            savedAllowPauseSandbox: true,
            savedFlashSandbox: true,
            savedOpsSandbox: { 
                add: { active: true, min: 1, max: 20 }, 
                sub: { active: true, min: 1, max: 20 }, 
                mul: { active: true, min: 1, max: 10 },
                div: { active: false, min: 1, max: 10 }
            },
            distributionDataByConfig: {}
        },

        els: {
            display: document.getElementById('operation-display'),
            statusOverlay: document.getElementById('status-overlay'),
            inputVal: document.getElementById('input-value'),
            inputWrapper: document.getElementById('input-wrapper'),
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
                timeRanked: document.getElementById('time-ranked-val'),
                diffRanked: document.getElementById('diff-ranked-val'),
                flashRanked: document.getElementById('show-flash-ranked'),

                                timeSandbox: document.getElementById('time-sandbox-val'),
                showMs: document.getElementById('show-ms'),
                allowPause: document.getElementById('allow-pause'),
                flashSandbox: document.getElementById('show-flash-sandbox'),

                                ops: {
                    add: { check: document.getElementById('op-add'), min: document.getElementById('min-add'), max: document.getElementById('max-add') },
                    sub: { check: document.getElementById('op-sub'), min: document.getElementById('min-sub'), max: document.getElementById('max-sub') },
                    mul: { check: document.getElementById('op-mul'), min: document.getElementById('min-mul'), max: document.getElementById('max-mul') },
                    div: { check: document.getElementById('op-div'), min: document.getElementById('min-div'), max: document.getElementById('max-div') }
                }
            }
        },

        init() {
            if (typeof VirtualNumpad !== 'undefined') {
                this.keyboard = new VirtualNumpad('#keyboard-container', {
                    onInput: (char) => {
                        if (this.state.isPaused) return;

                                                if (this.state.currentInputString.length < 5) {
                            this.state.currentInputString += char; 
                            this.els.inputVal.textContent = this.state.currentInputString;

                                                        this.checkInput(this.state.currentInputString);
                        }
                    },
                    onDelete: () => {
                        if (this.state.isPaused || this.state.currentState === 'FINISHED') return;

                                                this.state.currentInputString = this.state.currentInputString.slice(0, -1);

                                                this.els.inputVal.textContent = this.state.currentInputString;
                    },
                    onClear: () => {
                        if (this.state.isPaused || this.state.currentState === 'FINISHED') return;
                        this.state.currentInputString = "";
                        this.els.inputVal.textContent = "";
                    },
                    onSubmit: () => {
                    }
                });
            } else {
                console.warn("VirtualNumpad introuvable ! Vérifiez script.js");
            }

            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }

            if (this.state.gameMode === 'sandbox') {
                this.els.display.removeAttribute('data-i18n');
                this.els.display.innerHTML = '';
            }

            this.loadUserPreferences();

                        if (params.has('time')) {
                this.state.savedTimeRanked = parseInt(params.get('time'), 10);
            }
            if (params.has('duration')) {
                this.state.savedTimeRanked = parseInt(params.get('duration'), 10);
            }
            if (params.has('difficulty')) {
                this.state.savedDifficultyRanked = params.get('difficulty');
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
                this.setPreStartState(true); 
                this.startGame();
            } else {
                this.setPreStartState();
            }
            const initKey = `math_ranked_${this.state.savedTimeRanked}_${this.state.savedDifficultyRanked}`;
            this.preloadDistributionData(initKey);
        },

        loadUserPreferences() {
            const c = this.els.config;

            const savedTime = localStorage.getItem('mm_time_ranked');
            if (savedTime !== null) {
                if (c.timeRanked) c.timeRanked.value = savedTime;
                this.state.savedTimeRanked = parseInt(savedTime);
            }

            const savedDiffR = localStorage.getItem('mm_diff_ranked');
            if (savedDiffR !== null) {
                if (c.diffRanked) c.diffRanked.value = savedDiffR;
                this.state.savedDifficultyRanked = savedDiffR;
            }

                        const savedFlashR = localStorage.getItem('mm_flash_ranked');
            if (savedFlashR !== null) {
                const isTrue = (savedFlashR === 'true');
                if (c.flashRanked) c.flashRanked.checked = isTrue;
                this.state.savedFlashRanked = isTrue;
            }

            const savedTimeS = localStorage.getItem('mm_time_sandbox');
            if (savedTimeS !== null) {
                if (c.timeSandbox) c.timeSandbox.value = savedTimeS;
                this.state.savedTimeSandbox = parseInt(savedTimeS);
            }

            const savedMs = localStorage.getItem('mm_show_ms');
            if (savedMs !== null) {
                if (c.showMs) c.showMs.checked = (savedMs === 'true');
                this.state.savedShowMsSandbox = (savedMs === 'true');
            }

            const savedPause = localStorage.getItem('mm_allow_pause');
            if (savedPause !== null) {
                if (c.allowPause) c.allowPause.checked = (savedPause === 'true');
                this.state.savedAllowPauseSandbox = (savedPause === 'true');
            }

            const savedFlashS = localStorage.getItem('mm_flash_sandbox');
            if (savedFlashS !== null) {
                const isTrue = (savedFlashS === 'true');
                if (c.flashSandbox) c.flashSandbox.checked = isTrue;
                this.state.savedFlashSandbox = isTrue;
            }

            const savedOps = localStorage.getItem('mm_ops_sandbox');
            if (savedOps) {
                try {
                    const parsedOps = JSON.parse(savedOps);
                    this.state.savedOpsSandbox = parsedOps;
                    ['add', 'sub', 'mul', 'div'].forEach(op => {
                        if(parsedOps[op] && c.ops[op] && c.ops[op].check) {
                            c.ops[op].check.checked = parsedOps[op].active;
                            c.ops[op].min.value = parsedOps[op].min;
                            c.ops[op].max.value = parsedOps[op].max;
                        }
                    });
                } catch (e) { console.error(e); }
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

        setPreStartState(isAutoStart = false) {
            clearInterval(this.state.timerId);
            this.state.isActive = false;
            this.state.currentState = 'PRE_START';

                        this.toggleOverlay(this.els.overlayOver, false);
            this.els.statusOverlay.classList.add('hidden');

            this.els.display.classList.remove('blurred');
            this.els.inputWrapper.classList.remove('blurred');
            if (this.els.keyboardContainer) {
                this.els.keyboardContainer.classList.remove('blurred');
            }

            this.els.score.textContent = "0";
            this.state.currentInputString = '';
            this.els.inputVal.textContent = '';

            const timeSetting = this.state.gameMode === 'ranked' ? this.state.savedTimeRanked : this.state.savedTimeSandbox;
            this.els.timer.textContent = timeSetting > 0 ? timeSetting : "∞";

            this.generateOperation();
            this.renderOperation();

            if (this.state.gameMode === 'ranked') {
                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = '';
                if (!this.state.savedAllowPauseSandbox) {
                    this.els.pauseBtn.style.visibility = 'hidden'; 
                } else {
                    this.els.pauseBtn.style.visibility = 'visible';
                }
            }

                        this.els.pauseHint.textContent = ""; 
        },

        startGame() {
            this.state.currentState = 'PLAYING';
            this.state.score = 0;
            this.state.operationTimes = [];
            this.state.isActive = true;
            this.state.isPaused = false;

                        this.els.score.textContent = "0";

                        this.updatePauseIcon();
            this.resetTimer();

            const timeSetting = this.state.gameMode === 'ranked' ? this.state.savedTimeRanked : this.state.savedTimeSandbox;
            if (timeSetting > 0) {
                this.state.timeLeft = timeSetting;
                this.startTimer(false);
            } else {
                this.state.timeLeft = 0;
                this.startTimer(true);
            }

            this.generateOperation(); 
        },

        async endGame() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';
            clearInterval(this.state.timerId);

                        if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';

            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: this.state.score }, '*');
                return;
            }

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');

                                this.els.rankedScore.textContent = this.state.score;

                                this.saveScoreToDatabase(this.state.score, this.state.savedTimeRanked, this.state.savedDifficultyRanked);

                                const recordKey = `math_best_ranked_${this.state.savedTimeRanked}_${this.state.savedDifficultyRanked}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                                if (best === null || this.state.score > best) {
                    best = this.state.score;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;

                                        this.saveBestScoreToDatabase(best, this.state.savedTimeRanked, this.state.savedDifficultyRanked);
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

                                const chartKey = `math_ranked_${this.state.savedTimeRanked}_${this.state.savedDifficultyRanked}`;
                this.drawDistributionChart(this.state.score, best, chartKey);

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');

                                if(this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                                this.els.sandboxScore.textContent = this.state.score;

                let timePlayed = this.state.savedTimeSandbox > 0 ? this.state.savedTimeSandbox : this.state.timeLeft;
                let opm = 0;
                let avgTime = 0;
                let fastest = 0;
                let slowest = 0;

                if (timePlayed > 0 && this.state.score > 0) {
                    opm = Math.round((this.state.score / timePlayed) * 60);
                    avgTime = (timePlayed / this.state.score).toFixed(2);
                }

                                if (this.state.operationTimes.length > 0) {
                    fastest = Math.min(...this.state.operationTimes);
                    slowest = Math.max(...this.state.operationTimes);

                                        if (this.els.statFastest) this.els.statFastest.textContent = `${fastest.toFixed(2)}s`;
                    if (this.els.statSlowest) this.els.statSlowest.textContent = `${slowest.toFixed(2)}s`;

                    if (this.els.historyChart) {
                        this.els.historyChart.innerHTML = '';
                        const buffer = (slowest - fastest) * 0.2;
                        let chartMin = fastest - buffer;
                        if (chartMin < 0) chartMin = 0;
                        let chartMax = slowest + buffer;
                        if (chartMin === chartMax) { chartMin -= 0.5; chartMax += 0.5; }
                        const chartRange = chartMax - chartMin;

                        this.state.operationTimes.forEach((time, index) => {
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
                    if (this.els.statFastest) this.els.statFastest.textContent = `--s`;
                    if (this.els.statSlowest) this.els.statSlowest.textContent = `--s`;
                    if (this.els.historyChart) this.els.historyChart.innerHTML = '';
                }

                if (this.els.statOpm) this.els.statOpm.textContent = `${opm} /min`;
                if (this.els.statAvgTime) this.els.statAvgTime.textContent = `${avgTime}s`;
            }

            this.toggleOverlay(this.els.overlayOver, true);
            this.els.pauseBtn.style.visibility = 'hidden';
            const chartKey = `math_ranked_${this.state.savedTimeRanked}_${this.state.savedDifficultyRanked}`;
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

        async saveScoreToDatabase(score, time, diff) {

                        if (window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: score }, '*');
            }

            try {
                fetch('/api/scores', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'mental_math', score: score, details: { time: time, difficulty: diff }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, time, diff) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ 
                        game_mode_key: `math_ranked_${time}_${diff}`, 
                        score: score, 
                        details: { time: time, difficulty: diff } 
                    })
                });
            } catch (error) { 
                console.error("❌ Échec de la connexion au serveur :", error); 
            }
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
                    if (pointVal >= val) {
                        areaToRight += densities[i].y;
                    }
                }

                                let percentile = (areaToRight / totalArea) * 100;
                if (percentile < 0.1) percentile = 0.1;
                if (percentile > 99.9) percentile = 99.9;

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
            if (!configKey) configKey = `math_ranked_${this.state.savedTimeRanked}_${this.state.savedDifficultyRanked}`;
            const parts = configKey.split('_');
            const time = parts[2];
            const diff = parts[3];
            try {
                const res = await fetch(`/api/scores/distribution/mental_math?time=${time}&diff=${diff}`, {
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

        generateOperation() {
            let type, min, max;
            const rand = (mn, mx) => Math.floor(Math.random() * (mx - mn + 1)) + mn;

            if (this.state.gameMode === 'ranked') {
                const ops = ['add', 'sub', 'mul']; 
                type = ops[Math.floor(Math.random() * ops.length)];

                                if (this.state.savedDifficultyRanked === '1-99') {
                    min = 1; max = 99;
                } else {
                    min = 1; max = 9;
                }
            } else {
                let available = [];
                if (this.state.savedOpsSandbox.add.active) available.push('add');
                if (this.state.savedOpsSandbox.sub.active) available.push('sub');
                if (this.state.savedOpsSandbox.mul.active) available.push('mul');
                if (this.state.savedOpsSandbox.div.active) available.push('div');

                                if (available.length === 0) available = ['add'];
                type = available[Math.floor(Math.random() * available.length)];

                min = parseInt(this.state.savedOpsSandbox[type].min);
                max = parseInt(this.state.savedOpsSandbox[type].max);
            }

                        let a, b, res, symbol;

            switch (type) {
                case 'add':
                    a = rand(min, max); b = rand(min, max);
                    res = a + b; symbol = '+'; break;
                case 'sub':
                    a = rand(min, max); b = rand(min, max);
                    if (b > a) [a, b] = [b, a]; 
                    res = a - b; symbol = '-'; break;
                case 'mul':
                    a = rand(min, max); b = rand(min, max);
                    res = a * b; symbol = '×'; break;
                case 'div':
                    b = rand(min, max); if (b === 0) b = 1;
                    res = rand(min, max);
                    a = b * res; symbol = '÷'; break;
            }

            this.state.currentResult = res;
            this.state.currentOpParts = { a, symbol, b };

                        if (!this.state.isPaused) this.renderOperation();

                        this.state.currentOpStartTime = performance.now();
        },

        renderOperation() {
            this.els.display.removeAttribute('data-i18n'); 
            this.els.display.classList.remove('single-message', 'blurred');
            this.els.display.innerHTML = `
                <span class="op-part part-a">${this.state.currentOpParts.a}</span>
                <span class="op-part part-symbol">${this.state.currentOpParts.symbol}</span>
                <span class="op-part part-b">${this.state.currentOpParts.b}</span>
            `;

                        this.state.currentInputString = '';
            this.els.inputVal.textContent = '';
        },

        checkInput(val) {
            if (val === '') return;

                        if (parseInt(val) === this.state.currentResult) {

                                if (this.state.currentState === 'PRE_START') {
                    this.startGame(); 

                                        this.state.currentInputString = '';
                    this.els.inputVal.textContent = '';

                                        return; 
                }

                const timeTaken = (performance.now() - this.state.currentOpStartTime) / 1000;
                this.state.operationTimes.push(timeTaken);

                this.state.score++;
                this.els.score.textContent = this.state.score;

                                const shouldFlash = (this.state.gameMode === 'ranked') ? this.state.savedFlashRanked : this.state.savedFlashSandbox;
                if (shouldFlash) {
                    this.els.board.classList.remove('flash-success');
                    void this.els.board.offsetWidth; 
                    this.els.board.classList.add('flash-success');
                }

                this.state.currentInputString = '';
                this.els.inputVal.textContent = '';
                this.generateOperation();
            }
        },

        startTimer(countUp = false) {
            this.updateTimerUI(countUp);
            this.state.timerId = setInterval(() => {
                if(countUp) {
                    this.state.timeLeft += 0.01;
                } else {
                    this.state.timeLeft -= 0.01;
                }

                this.state.timeLeft = Math.round(this.state.timeLeft * 100) / 100;
                this.updateTimerUI(countUp);

                                if (!countUp && this.state.timeLeft <= 0) {
                    this.state.timeLeft = 0;
                    this.updateTimerUI(countUp);
                    this.endGame();
                }
            }, 10);
        },

        resetTimer() {
            clearInterval(this.state.timerId);
        },

        updateTimerUI(countUp = false) {
            const timeSetting = this.state.gameMode === 'ranked' ? this.state.savedTimeRanked : this.state.savedTimeSandbox;

                        if (timeSetting > 0 || countUp) {
                let displayTime;
                const showMs = this.state.gameMode === 'sandbox' ? this.state.savedShowMsSandbox : false;

                                if (showMs) {
                    displayTime = this.state.timeLeft.toFixed(2);
                } else {
                    displayTime = countUp ? Math.floor(this.state.timeLeft) : Math.ceil(this.state.timeLeft);
                }
                this.els.timer.textContent = displayTime;
            } else {
                this.els.timer.textContent = "∞";
            }
        },

        togglePause() {
            if (!this.state.isActive || this.state.gameMode === 'ranked') return; 
            this.state.isPaused = !this.state.isPaused;

            if (this.state.isPaused) {
                clearInterval(this.state.timerId);
                this.state.pauseStartTime = performance.now();
            } else {
                this.startTimer(this.state.savedTimeSandbox === 0);

                const pauseDuration = performance.now() - this.state.pauseStartTime;
                this.state.currentOpStartTime += pauseDuration;
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

                        if(c.timeRanked) c.timeRanked.value = this.state.savedTimeRanked;
            if(c.diffRanked) c.diffRanked.value = this.state.savedDifficultyRanked;
            if(c.flashRanked) c.flashRanked.checked = this.state.savedFlashRanked;

                        if(c.timeSandbox) c.timeSandbox.value = this.state.savedTimeSandbox;
            if(c.showMs) c.showMs.checked = this.state.savedShowMsSandbox;
            if(c.allowPause) c.allowPause.checked = this.state.savedAllowPauseSandbox;
            if(c.flashSandbox) c.flashSandbox.checked = this.state.savedFlashSandbox;

                        ['add', 'sub', 'mul', 'div'].forEach(op => {
                if(this.state.savedOpsSandbox[op] && c.ops[op] && c.ops[op].check) {
                    c.ops[op].check.checked = this.state.savedOpsSandbox[op].active;
                    c.ops[op].min.value = this.state.savedOpsSandbox[op].min;
                    c.ops[op].max.value = this.state.savedOpsSandbox[op].max;
                }
            });

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

                                if (this.state.gameMode === 'sandbox' && this.state.isActive && this.state.isPaused && this.state.savedAllowPauseSandbox) {
                    this.togglePause();
                }
            } else {
                this.restoreSettingsUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');

                                if (this.state.isActive && !this.state.isPaused && this.state.gameMode === 'sandbox' && this.state.savedAllowPauseSandbox) {
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
                        console.warn(`Le navigateur a bloqué le plein écran natif : ${err.message}`);
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

                    if (e.code && e.code.startsWith('Digit')) {
                        inputNum = e.code.replace('Digit', '');
                    } 
                    else if (e.code && e.code.startsWith('Numpad')) {
                        inputNum = e.code.replace('Numpad', '');
                    }
                    else if (/^[0-9]$/.test(e.key)) {
                        inputNum = e.key;
                    }
                    else if (azertyMap[e.key]) {
                        inputNum = azertyMap[e.key];
                    }

                    if (inputNum !== null && inputNum.length === 1 && inputNum >= '0' && inputNum <= '9') {
                        if (this.state.currentInputString.length < 5) {
                            this.state.currentInputString += inputNum;
                            this.els.inputVal.textContent = this.state.currentInputString;
                            this.checkInput(this.state.currentInputString);
                        }
                    } 
                    else if (e.key === 'Backspace') {
                        if (this.state.currentState !== 'FINISHED') {
                            this.state.currentInputString = this.state.currentInputString.slice(0, -1);
                            this.els.inputVal.textContent = this.state.currentInputString;
                        }
                    }
                }

                if (e.code === 'Space' && this.state.isActive && !isMenuOpen && !isOverVisible) {
                    if (this.state.gameMode === 'sandbox' && this.state.savedAllowPauseSandbox) {
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

                        if (els.saveSettings) {
                els.saveSettings.addEventListener('click', () => {
                    const c = this.els.config;
                    const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;

                                        this.state.gameMode = selectedMode;
                    window.history.replaceState(null, '', '?mode=' + selectedMode);

                    if(c.timeRanked) localStorage.setItem('mm_time_ranked', c.timeRanked.value);
                    if(c.diffRanked) localStorage.setItem('mm_diff_ranked', c.diffRanked.value);
                    if(c.flashRanked) localStorage.setItem('mm_flash_ranked', c.flashRanked.checked);
                    this.state.savedTimeRanked = parseInt(c.timeRanked.value);
                    this.state.savedDifficultyRanked = c.diffRanked.value;
                    this.state.savedFlashRanked = c.flashRanked.checked;

                    if(c.timeSandbox) localStorage.setItem('mm_time_sandbox', c.timeSandbox.value);
                    if(c.showMs) localStorage.setItem('mm_show_ms', c.showMs.checked);
                    if(c.allowPause) localStorage.setItem('mm_allow_pause', c.allowPause.checked);
                    if(c.flashSandbox) localStorage.setItem('mm_flash_sandbox', c.flashSandbox.checked);
                    this.state.savedTimeSandbox = parseInt(c.timeSandbox.value) || 0;
                    this.state.savedShowMsSandbox = c.showMs.checked;
                    this.state.savedAllowPauseSandbox = c.allowPause.checked;
                    this.state.savedFlashSandbox = c.flashSandbox.checked;

                    const opsData = {
                        add: { active: c.ops.add.check.checked, min: c.ops.add.min.value, max: c.ops.add.max.value },
                        sub: { active: c.ops.sub.check.checked, min: c.ops.sub.min.value, max: c.ops.sub.max.value },
                        mul: { active: c.ops.mul.check.checked, min: c.ops.mul.min.value, max: c.ops.mul.max.value },
                        div: { active: c.ops.div.check.checked, min: c.ops.div.min.value, max: c.ops.div.max.value }
                    };
                    localStorage.setItem('mm_ops_sandbox', JSON.stringify(opsData));
                    this.state.savedOpsSandbox = opsData;

                                        const configKey = `math_ranked_${this.state.savedTimeRanked}_${this.state.savedDifficultyRanked}`;
                    this.preloadDistributionData(configKey);
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

        MentalMath.init();
});
