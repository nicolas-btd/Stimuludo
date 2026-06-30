
const visual_reaction_timeTranslations = {
    fr: {
        header_title: "RÉACTION VISUELLE",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            attempts_ranked: "Essais :",
            attempts_sandbox: "Essais :",
            max_delay: "Variation max (ms) :",
            hint: "Le score sera la moyenne de tous les essais.",
            sandbox_hint: "Attente : 2000ms fixes + variation.",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        status: {
            ready: "PRÊT ?",
            hint: "Cliquez pour commencer"
        },
        game: {
            counter: "Essai",
            waiting: "ATTENDEZ...",
            waiting_sub: "Ne cliquez pas avant le changement de couleur.",
            go: "CLIQUEZ !",
            too_early: "TROP TÔT !",
            too_early_sub: "Cliquez pour recommencer.",
            result_unit: "ms",
            next_click: "Cliquez pour continuer",
            see_avg: "Cliquez pour voir la moyenne"
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            avg_title: "MOYENNE",
            best_score: "MEILLEUR TEMPS :",
            replay: "REJOUER",
            you: "Vous",
            best: "Meilleur",
            fastest: "Le plus rapide",
            slowest: "Le plus lent",
            consistency: "Écart-type"
        }
    },
    en: {
        header_title: "VISUAL REACTION",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            attempts_ranked: "Attempts :",
            attempts_sandbox: "Attempts :",
            max_delay: "Max variation (ms):",
            hint: "Score will be the average of all attempts.",
            sandbox_hint: "Wait: fixed 2000ms + variation.",
            cancel: "CANCEL",
            save: "APPLY"
        },
        status: {
            ready: "READY?",
            hint: "Click to start"
        },
        game: {
            counter: "Attempt",
            waiting: "WAIT...",
            waiting_sub: "Wait for the color change.",
            go: "CLICK!",
            too_early: "TOO EARLY!",
            too_early_sub: "Click to try again.",
            result_unit: "ms",
            next_click: "Click to continue",
            see_avg: "Click to see average"
        },
        results: {
            new_record: "NEW RECORD!",
            avg_title: "AVERAGE",
            best_score: "BEST TIME :",
            replay: "PLAY AGAIN",
            you: "You",
            best: "Best",
            fastest: "Fastest",
            slowest: "Slowest",
            consistency: "Std Deviation"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.visual_reaction_time = visual_reaction_timeTranslations.fr;
    translations.en.visual_reaction_time = visual_reaction_timeTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, visual_reaction_timeTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, visual_reaction_timeTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {

    const ReactionGame = {
        state: {
            isActive: false,
            currentState: 'IDLE',
            gameMode: 'ranked',
            timerId: null,
            startTime: 0,
            maxAttempts: 5,
            savedAttemptsRanked: 5,
            savedAttemptsSandbox: 5,
            savedMaxDelaySandbox: 3000,       
            currentAttempt: 0,
            attemptsScores: [],
            distributionDataByConfig: {}
        },

        els: {
            board: document.querySelector('.game-board'),
            clickLayer: document.getElementById('click-layer'),
            statusText: document.getElementById('status-text'),
            subText: document.getElementById('sub-text'),
            iconWait: document.getElementById('icon-wait'),
            iconFlash: document.getElementById('icon-flash'),
            currentScoreBox: document.getElementById('current-score'),
            headerModeDisplay: document.getElementById('header-mode-display'),

                        restartBtn: document.getElementById('restart-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'), 
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            iconExpand: document.getElementById('icon-expand'),
            iconCompress: document.getElementById('icon-compress'),

                        overlayOver: document.getElementById('game-over-overlay'),

                        viewRanked: document.getElementById('results-ranked'),
            viewSandbox: document.getElementById('results-sandbox'),

                        rankedAvgScore: document.getElementById('ranked-avg-score'),
            markerCurrent: document.getElementById('marker-current'),
            markerBest: document.getElementById('marker-best'),
            newRecordMsg: document.getElementById('new-record-msg'),

            sandboxAvgScore: document.getElementById('sandbox-avg-score'),
            statFastest: document.getElementById('stat-fastest'),
            statSlowest: document.getElementById('stat-slowest'),
            statConsistency: document.getElementById('stat-consistency'),
            historyChart: document.getElementById('history-chart'),

            settingsPanel: document.getElementById('settings-panel'),
            settingsToggle: document.getElementById('settings-toggle'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),
            settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),

                        modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),

            config: {
                attemptsRanked: document.getElementById('attempts-ranked-val'),
                attemptsSandbox: document.getElementById('attempts-sandbox-val'),
                delaySandbox: document.getElementById('delay-sandbox-val') 
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }

            this.loadUserPreferences();
            this.state.savedAttemptsRanked = parseInt(this.els.config.attemptsRanked.value) || 5;
            this.state.savedAttemptsSandbox = parseInt(this.els.config.attemptsSandbox.value) || 5;
            this.state.savedMaxDelaySandbox = parseInt(this.els.config.delaySandbox.value) || 3000;

            if (params.has('attempts')) {
                this.state.savedAttemptsRanked = parseInt(params.get('attempts'), 10);
            }

            if (this.els.headerModeDisplay) {
                this.els.headerModeDisplay.textContent = this.state.gameMode === 'ranked' ? '(Classé)' : '(Libre)';
            }

                        this.loadBackgroundPreference();
            this.bindEvents();

            const initKey = `vrt_ranked_${this.state.savedAttemptsRanked}`;
            this.preloadDistributionData(initKey);

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

                        this.els.board.style.cursor = 'default';
            this.els.board.style.userSelect = 'none';
            this.els.board.style.webkitUserSelect = 'none';

            this.startSequence();
        },

        loadUserPreferences() {
            const savedRanked = localStorage.getItem('vrt_attempts_ranked');
            if (savedRanked !== null) this.els.config.attemptsRanked.value = savedRanked;

            const savedSandbox = localStorage.getItem('vrt_attempts_sandbox');
            if (savedSandbox !== null) this.els.config.attemptsSandbox.value = savedSandbox;

                        const savedDelay = localStorage.getItem('vrt_delay_sandbox');
            if (savedDelay !== null) this.els.config.delaySandbox.value = savedDelay;
        },

        loadBackgroundPreference() {
            const savedOpaque = localStorage.getItem('globalOpaque');
            const isOpaque = savedOpaque === 'true' || savedOpaque === null; 
            if(isOpaque) document.documentElement.classList.add('global-opaque');
            else document.documentElement.classList.remove('global-opaque');
            this.toggleBackground(isOpaque);
        },

        toggleBackground(isOpaque) {
            if(isOpaque) this.els.settingsPanel.classList.add('opaque-mode');
            else this.els.settingsPanel.classList.remove('opaque-mode');
        },

        startSequence() {
            if (this.state.timerId) clearTimeout(this.state.timerId);

            if (this.state.gameMode === 'ranked') {
                this.state.maxAttempts = this.state.savedAttemptsRanked;
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = '';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.state.maxAttempts = this.state.savedAttemptsSandbox;
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'none';
                }
            }

            this.toggleOverlay(this.els.overlayOver, false);

                        this.state.isActive = true;
            this.state.currentAttempt = 0;
            this.state.attemptsScores = [];

                        this.updateCounterUI();

                        if (this.state.gameMode === 'sandbox') {
                this.state.currentState = 'WAITING';
                this.prepareNextAttempt(); 
            } else {
                this.setPreStartState();
            }
        },

        setPreStartState() {
            this.state.currentState = 'PRE_START';
            this.updateBoardUI('', getGameText('status.ready'), getGameText('status.hint'));
            this.toggleIcons('none'); 
        },

        prepareNextAttempt() {
            if (this.state.currentAttempt >= this.state.maxAttempts) return;
            this.state.currentAttempt++;
            this.updateCounterUI();
            this.setWaitingState();
        },

        setWaitingState() {
            this.state.currentState = 'WAITING';
            this.updateBoardUI('state-waiting', getGameText('game.waiting'), getGameText('game.waiting_sub'));
            this.toggleIcons('wait');

            let deltaT = 3000; 
            if (this.state.gameMode === 'sandbox') {
                deltaT = this.state.savedMaxDelaySandbox;
            }

                        const delay = Math.floor(Math.random() * deltaT) + 2000;

            if (this.state.timerId) clearTimeout(this.state.timerId);
            this.state.timerId = setTimeout(() => {
                this.setReadyState();
            }, delay);
        },

        setReadyState() {
            if (this.state.currentState !== 'WAITING') return;
            this.state.currentState = 'READY';
            this.state.startTime = performance.now();
            this.updateBoardUI('state-go', getGameText('game.go'), '');
            this.toggleIcons('flash');
        },

        handleInput() {
            if (!this.state.isActive) return;

            switch (this.state.currentState) {
                case 'PRE_START':
                    this.prepareNextAttempt();
                    break;
                case 'WAITING':
                    this.triggerTooEarly();
                    break;
                case 'PENALTY':
                    this.setWaitingState();
                    break;
                case 'READY':
                    const endTime = performance.now();
                    const reactionTime = Math.round(endTime - this.state.startTime);
                    this.handleSuccess(reactionTime);
                    break;
                case 'RESULT':
                    if (this.state.currentAttempt < this.state.maxAttempts) {
                        this.prepareNextAttempt();
                    } else {
                        this.finishSequence();
                    }
                    break;
            }
        },

        triggerTooEarly() {
            if (this.state.timerId) clearTimeout(this.state.timerId);
            this.state.currentState = 'PENALTY';
            this.updateBoardUI('state-error', getGameText('game.too_early'), getGameText('game.too_early_sub'));
        },

        handleSuccess(time) {
            this.state.currentState = 'RESULT';
            this.state.attemptsScores.push(time);

            const flashOverlay = document.createElement('div');
            flashOverlay.style.position = 'absolute';
            flashOverlay.style.inset = '0';
            flashOverlay.style.background = 'rgba(255,255,255,0.3)';
            flashOverlay.style.pointerEvents = 'none';
            flashOverlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
            this.els.board.appendChild(flashOverlay);
            setTimeout(() => flashOverlay.remove(), 200);

            const subText = (this.state.currentAttempt < this.state.maxAttempts) 
                ? getGameText('game.next_click') 
                : getGameText('game.see_avg');

            this.updateBoardUI('', `${time} ${getGameText('game.result_unit')}`, subText);
            this.toggleIcons('none');
        },

        async finishSequence() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';

                        if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';

            const sum = this.state.attemptsScores.reduce((a, b) => a + b, 0);
            const avg = Math.round(sum / this.state.attemptsScores.length);

                        const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('party') === '1' && window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: avg }, '*');
                return;
            }

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.rankedAvgScore.textContent = avg;
                this.saveScoreToDatabase(avg, this.state.maxAttempts);

                                const recordKey = `vrt_best_ranked_${this.state.maxAttempts}`;
                const savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;
                if (best === null || avg < best) {
                    best = avg;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.maxAttempts);
                }
                if (isRecord && savedBest !== null) {
                    this.els.newRecordMsg.style.visibility = 'visible';
                    this.els.newRecordMsg.style.opacity = '1';
                } else {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                                const configKey = `vrt_ranked_${this.state.maxAttempts}`;
                this.drawDistributionChart(avg, best, configKey);
            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                this.els.newRecordMsg.style.visibility = 'hidden';
                this.els.newRecordMsg.style.opacity = '0';
                this.els.sandboxAvgScore.textContent = avg;
                const minScore = Math.min(...this.state.attemptsScores);
                const maxScore = Math.max(...this.state.attemptsScores);
                const variance = this.state.attemptsScores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / this.state.attemptsScores.length;
                const standardDeviation = Math.round(Math.sqrt(variance));
                this.els.statFastest.textContent = `${minScore}ms`;
                this.els.statSlowest.textContent = `${maxScore}ms`;
                this.els.statConsistency.textContent = `±${standardDeviation}ms`;
                this.els.historyChart.innerHTML = '';
                const buffer = (maxScore - minScore) * 0.2; 
                let chartMin = minScore - buffer;
                if (chartMin < 0) chartMin = 0; 
                let chartMax = maxScore + buffer;
                if (chartMin === chartMax) { chartMin -= 20; chartMax += 20; }
                const chartRange = chartMax - chartMin;
                this.state.attemptsScores.forEach((score, index) => {
                    let heightPercent = ((score - chartMin) / chartRange) * 100;
                    if(heightPercent < 5) heightPercent = 5;
                    const barContainer = document.createElement('div');
                    barContainer.className = 'history-bar-wrapper';
                    const bar = document.createElement('div');
                    bar.className = 'history-bar';
                    bar.style.height = `${heightPercent}%`;
                    const label = document.createElement('span');
                    label.textContent = score;
                    label.className = 'bar-label';
                    const indexLabel = document.createElement('span');
                    indexLabel.textContent = index + 1;
                    indexLabel.className = 'bar-index';
                    barContainer.appendChild(label); barContainer.appendChild(bar); barContainer.appendChild(indexLabel);
                    this.els.historyChart.appendChild(barContainer);
                });
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

        async saveScoreToDatabase(score, attempts) {

                        if (window !== window.parent) {
                window.parent.postMessage({ type: 'GAME_FINISHED', score: score }, '*');
            }

            try {
                await fetch('/api/scores', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: 'visual_reaction_time', score: score, details: { attempts: attempts }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec de sauvegarde globale DB:", error); }
        },

        async saveBestScoreToDatabase(score, attempts) {
            try {
                await fetch('/api/best', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `vrt_ranked_${attempts}`, score: score, details: { attempts: attempts }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async preloadDistributionData(configKey) {
            if (!configKey) configKey = `vrt_ranked_${this.state.savedAttemptsRanked}`;
            const attempts = configKey.split('_').pop();
            try {
                const res = await fetch(`/api/scores/distribution/visual_reaction_time?attempts=${attempts}&game_mode_key=${configKey}`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (res.ok) {
                    this.state.distributionDataByConfig[configKey] = await res.json();
                } else {
                    this.state.distributionDataByConfig[configKey] = [];
                }
            } catch(e) { 
                console.error("Erreur preload distribution:", e); 
                this.state.distributionDataByConfig[configKey] = [];
            }
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
            if (!configKey) configKey = `vrt_ranked_${this.state.savedAttemptsRanked}`;
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

                        if (maxX - minX < 50) {
                const center = (maxX + minX) / 2;
                minX = Math.max(0, Math.floor(center - 25));
                maxX = Math.ceil(center + 25);
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

                        if (!this.els.viewRanked) return;
            const curvePath = this.els.viewRanked.querySelector('.curve-path');
            const curveFill = this.els.viewRanked.querySelector('.curve-fill');
            if (curvePath) curvePath.setAttribute('d', pathD);
            if (curveFill) curveFill.setAttribute('d', pathD + ` L 100 100 Z`);

                        const distContainer = this.els.viewRanked.querySelector('.distribution-chart-container');
            if (!distContainer) return;
            distContainer.querySelectorAll('.dist-html-dot').forEach(el => el.remove()); 

            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            const currentPercent = clamp(((currentScore - minX) / range) * 100, 2, 98);
            let bestPercent = null;
            if (bestScore !== null) bestPercent = clamp(((bestScore - minX) / range) * 100, 2, 98);
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
            if (tooltip && hoverLine) {
                distContainer.onmousemove = (e) => {
                    const rect = distContainer.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const percentX = clamp(mouseX / rect.width, 0, 1);
                    const msValue = Math.round(minX + percentX * range);
                    let areaToLeft = 0;
                    for (let i = 0; i <= steps; i++) {
                        let pointVal = minX + (i / steps) * range;
                        if (pointVal <= msValue) areaToLeft += densities[i].y;
                    }
                    let percentile = (areaToLeft / totalArea) * 100;
                    percentile = clamp(percentile, 0.1, 99.9);
                    percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);
                    tooltip.style.left = `${percentX * 100}%`;
                    tooltip.innerHTML = `<strong>${msValue}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                    tooltip.classList.remove('hidden');
                    hoverLine.style.left = `${percentX * 100}%`;
                    hoverLine.classList.remove('hidden');
                };
                distContainer.onmouseleave = () => { tooltip.classList.add('hidden'); hoverLine.classList.add('hidden'); };
            }
        },

        updateCounterUI() {
            this.els.currentScoreBox.textContent = `${getGameText('game.counter')} ${this.state.currentAttempt}/${this.state.maxAttempts}`;
        },

        updateBoardUI(className, mainText, subText) {
            this.resetBoardVisuals();
            if (className) this.els.board.classList.add(className);
            this.els.board.style.backgroundColor = ''; 

                        this.els.statusText.removeAttribute('data-i18n');
            this.els.subText.removeAttribute('data-i18n');

                        this.els.statusText.textContent = mainText;
            this.els.subText.textContent = subText;
        },

        resetBoardVisuals() {
            this.els.board.classList.remove('state-waiting', 'state-go', 'state-error');
        },

        toggleIcons(type) {
            this.els.iconFlash.style.display = 'none';
            this.els.iconWait.style.display = 'none';
            if (type === 'wait') this.els.iconWait.style.display = 'block';
            if (type === 'flash') this.els.iconFlash.style.display = 'block';
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
            this.els.config.attemptsRanked.value = this.state.savedAttemptsRanked;
            this.els.config.attemptsSandbox.value = this.state.savedAttemptsSandbox;
            this.els.config.delaySandbox.value = this.state.savedMaxDelaySandbox;
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
                radio.addEventListener('change', (e) => this.updateSettingsView(e.target.value));
            });

            if (els.restartBtn) els.restartBtn.addEventListener('click', () => this.startSequence());

            if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.startSequence();
                });
            }

            const handleBoardClick = (e) => {
                const isMenuOpen = !els.settingsPanel.classList.contains('panel-hidden');
                const isOverVisible = els.overlayOver.classList.contains('visible');

                                if (this.state.isActive && !isMenuOpen && !isOverVisible) {
                    if (e.target.closest('button')) return;
                    e.preventDefault();
                    this.handleInput();
                }
            };

            els.board.addEventListener('mousedown', handleBoardClick);
            els.board.addEventListener('touchstart', (e) => {
                if (e.target.closest('button')) return;
                e.preventDefault();
                this.handleInput();
            }, {passive: false});

            if (els.fullscreenBtn) {
                els.fullscreenBtn.addEventListener('click', (e) => { e.stopPropagation(); this.toggleFullscreen(); });
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

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const isOverVisible = this.els.overlayOver.classList.contains('visible');
                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();
                if (e.code === 'Escape') { e.preventDefault(); this.toggleSettings(); }
                if (e.code === 'Space' && this.state.isActive && !isMenuOpen && !isOverVisible) { e.preventDefault(); this.handleInput(); }
                if (e.code === 'Enter') {
                    if (isMenuOpen) { e.preventDefault(); els.saveSettings.click(); } 
                    else if (isOverVisible) { e.preventDefault(); this.startSequence(); }
                }
            });

            els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(err => console.error(err));
                    if (this.els.settingsPanel.classList.contains('panel-hidden')) this.toggleSettings();
                } else { this.toggleSettings(); }
            });

            if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

                        if (els.saveSettings) els.saveSettings.addEventListener('click', () => {
                const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;
                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);
                if (this.els.headerModeDisplay) this.els.headerModeDisplay.textContent = this.state.gameMode === 'ranked' ? '(Classé)' : '(Libre)';
                localStorage.setItem('vrt_attempts_ranked', this.els.config.attemptsRanked.value);
                localStorage.setItem('vrt_attempts_sandbox', this.els.config.attemptsSandbox.value);
                localStorage.setItem('vrt_delay_sandbox', this.els.config.delaySandbox.value);
                this.state.savedAttemptsRanked = parseInt(this.els.config.attemptsRanked.value) || 5;
                this.state.savedAttemptsSandbox = parseInt(this.els.config.attemptsSandbox.value) || 5;
                this.state.savedMaxDelaySandbox = parseInt(this.els.config.delaySandbox.value) || 3000;

                                const configKey = `vrt_ranked_${this.state.savedAttemptsRanked}`;
                this.preloadDistributionData(configKey);

                                this.toggleSettings(true);
                this.startSequence(); 
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

    ReactionGame.init();
});