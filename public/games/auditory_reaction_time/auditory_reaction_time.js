
const auditory_reaction_timeTranslations = {
    fr: {
        header_title: "RÉACTION AUDITIVE",
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
            waiting: "ÉCOUTEZ...", 
            waiting_sub: "Cliquez dès que le son retentit.",
            go: "ÉCOUTEZ...", 
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
        header_title: "AUDITORY REACTION",
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
            waiting: "LISTEN...",
            waiting_sub: "Click as soon as sound plays.",
            go: "LISTEN...", 
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
    translations.fr.auditory_reaction_time = auditory_reaction_timeTranslations.fr;
    translations.en.auditory_reaction_time = auditory_reaction_timeTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, auditory_reaction_timeTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, auditory_reaction_timeTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {

    const AuditoryGame = {
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
            audioCtx: null,
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
            const exitBtn = document.getElementById('exit-fullscreen-overlay-btn');
            if (exitBtn && this.els.overlayOver && exitBtn.parentElement !== this.els.overlayOver) {
                this.els.overlayOver.appendChild(exitBtn);
            }

            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.state.audioCtx = new AudioContext();
            }

            const unlockAudio = () => {
                if (this.state.audioCtx && this.state.audioCtx.state === 'suspended') {
                    this.state.audioCtx.resume();
                }
            };
            document.addEventListener('click', unlockAudio, { once: true });
            document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });

            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }

            this.loadUserPreferences();
            this.state.savedAttemptsRanked = parseInt(this.els.config.attemptsRanked?.value) || 5;
            this.state.savedAttemptsSandbox = parseInt(this.els.config.attemptsSandbox?.value) || 5;
            this.state.savedMaxDelaySandbox = parseInt(this.els.config.delaySandbox?.value) || 3000;

            if (this.els.headerModeDisplay) {
                this.els.headerModeDisplay.textContent = this.state.gameMode === 'ranked' ? '(Classé)' : '(Libre)';
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

                        if(this.els.board) {
                this.els.board.style.cursor = 'default';
                this.els.board.style.userSelect = 'none';
                this.els.board.style.webkitUserSelect = 'none';
            }

            this.startSequence();
            this.preloadDistributionData(`art_ranked_${this.state.maxAttempts}`);
        },

        playTone() {
            if (!this.state.audioCtx) return;

                        if (this.state.audioCtx.state === 'suspended') {
                this.state.audioCtx.resume();
            }

            const saved = localStorage.getItem('siteGlobalVolume');
            let volMod = saved !== null ? parseInt(saved, 10) / 100 : 0.5;
            if (volMod < 0.1) volMod = 0.1;

            const t = this.state.audioCtx.currentTime + 0.015;

            const bodyOsc = this.state.audioCtx.createOscillator();
            const bodyGain = this.state.audioCtx.createGain();

                        bodyOsc.type = 'sine';
            bodyOsc.frequency.setValueAtTime(700, t);

                        bodyGain.gain.setValueAtTime(0, t);
            bodyGain.gain.linearRampToValueAtTime(0.8 * volMod, t + 0.005); 
            bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15); 

                        bodyOsc.connect(bodyGain);
            bodyGain.connect(this.state.audioCtx.destination);
            bodyOsc.start(t);
            bodyOsc.stop(t + 0.16);

            const clickOsc = this.state.audioCtx.createOscillator();
            const clickGain = this.state.audioCtx.createGain();

                        clickOsc.type = 'sine';
            clickOsc.frequency.setValueAtTime(1400, t);

                        clickGain.gain.setValueAtTime(0, t);
            clickGain.gain.linearRampToValueAtTime(0.4 * volMod, t + 0.002);
            clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03); 

                        clickOsc.connect(clickGain);
            clickGain.connect(this.state.audioCtx.destination);
            clickOsc.start(t);
            clickOsc.stop(t + 0.04);
        },

        loadUserPreferences() {
            const savedRanked = localStorage.getItem('art_attempts_ranked');
            if (savedRanked !== null && this.els.config.attemptsRanked) this.els.config.attemptsRanked.value = savedRanked;

            const savedSandbox = localStorage.getItem('art_attempts_sandbox');
            if (savedSandbox !== null && this.els.config.attemptsSandbox) this.els.config.attemptsSandbox.value = savedSandbox;

                        const savedDelay = localStorage.getItem('art_delay_sandbox');
            if (savedDelay !== null && this.els.config.delaySandbox) this.els.config.delaySandbox.value = savedDelay;
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
                if(this.els.settingsPanel) this.els.settingsPanel.classList.add('opaque-mode');
            } else {
                if(this.els.settingsPanel) this.els.settingsPanel.classList.remove('opaque-mode');
            }
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

                        this.toggleIcons('flash'); 

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

                        this.playTone();

                        this.updateBoardUI('state-go', getGameText('game.go'), '');
            this.toggleIcons('flash');
        },

        handleInput() {
            if (!this.state.isActive) return;

            if (this.state.audioCtx && this.state.audioCtx.state === 'suspended') {
                this.state.audioCtx.resume();
            }

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
            this.toggleIcons('none');
        },

        handleSuccess(time) {
            this.state.currentState = 'RESULT';
            this.state.attemptsScores.push(time);

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

                        if (this.state.gameMode === 'ranked') {
                if(this.els.viewRanked) this.els.viewRanked.classList.remove('hidden');
                if(this.els.viewSandbox) this.els.viewSandbox.classList.add('hidden');
                if(this.els.rankedAvgScore) this.els.rankedAvgScore.textContent = avg;

                                this.saveScoreToDatabase(avg, this.state.maxAttempts);

                                const recordKey = `art_best_ranked_${this.state.maxAttempts}`;
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

                                this.drawDistributionChart(avg, best, configKey);

            } else {
                if(this.els.viewRanked) this.els.viewRanked.classList.add('hidden');
                if(this.els.viewSandbox) this.els.viewSandbox.classList.remove('hidden');
                if(this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                                if(this.els.sandboxAvgScore) this.els.sandboxAvgScore.textContent = avg;

                const minScore = Math.min(...this.state.attemptsScores);
                const maxScore = Math.max(...this.state.attemptsScores);
                const variance = this.state.attemptsScores.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / this.state.attemptsScores.length;
                const standardDeviation = Math.round(Math.sqrt(variance));

                                if(this.els.statFastest) this.els.statFastest.textContent = `${minScore}ms`;
                if(this.els.statSlowest) this.els.statSlowest.textContent = `${maxScore}ms`;
                if(this.els.statConsistency) this.els.statConsistency.textContent = `±${standardDeviation}ms`;

                                if (this.els.historyChart) {
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

                                                barContainer.appendChild(label);
                        barContainer.appendChild(bar);
                        barContainer.appendChild(indexLabel);
                        this.els.historyChart.appendChild(barContainer);
                    });
                }
            }
            this.toggleOverlay(this.els.overlayOver, true);
        },

        updateCounterUI() {
            if(this.els.currentScoreBox) this.els.currentScoreBox.textContent = `${getGameText('game.counter')} ${this.state.currentAttempt}/${this.state.maxAttempts}`;
        },

        updateBoardUI(className, mainText, subText) {
            this.resetBoardVisuals();
            if (className && this.els.board) this.els.board.classList.add(className);
            if(this.els.board) this.els.board.style.backgroundColor = ''; 

                        if(this.els.statusText) {
                this.els.statusText.removeAttribute('data-i18n');
                this.els.statusText.textContent = mainText;
            }
            if(this.els.subText) {
                this.els.subText.removeAttribute('data-i18n');
                this.els.subText.textContent = subText;
            }
        },

        resetBoardVisuals() {
            if(this.els.board) this.els.board.classList.remove('state-waiting', 'state-go', 'state-error');
        },

        toggleIcons(type) {
            if(this.els.iconFlash) this.els.iconFlash.style.display = 'none';
            if(this.els.iconWait) this.els.iconWait.style.display = 'none';
            if (type === 'wait' && this.els.iconWait) this.els.iconWait.style.display = 'block';
            if (type === 'flash' && this.els.iconFlash) this.els.iconFlash.style.display = 'block';
        },

        toggleOverlay(el, show) {
            if (!el) return;
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

        restoreSettingsUI() {
            if(this.els.config.attemptsRanked) this.els.config.attemptsRanked.value = this.state.savedAttemptsRanked;
            if(this.els.config.attemptsSandbox) this.els.config.attemptsSandbox.value = this.state.savedAttemptsSandbox;
            if(this.els.config.delaySandbox) this.els.config.delaySandbox.value = this.state.savedMaxDelaySandbox;
            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if(activeRadio) activeRadio.checked = true;
            this.updateSettingsView(this.state.gameMode);
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
            if(!panel) return;
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
            if(!elem) return;
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
            if(this.els.board) this.els.board.classList.add('ios-fullscreen');
            this.updateFullscreenIcon();
        },

        updateFullscreenIcon() {
            if(!this.els.board) return;
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

                        if(els.modeToggleRadios) {
                els.modeToggleRadios.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        this.updateSettingsView(e.target.value);
                    });
                });
            }

            if (els.restartBtn) {
                els.restartBtn.addEventListener('click', () => {
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') {
                        this.startSequence();
                    } else {
                        this.setPreStartState();
                    }
                });
            }

                        if (els.ingameRestartBtn) {
                els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') {
                        this.startSequence();
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

            const handleBoardClick = (e) => {
                const isMenuOpen = els.settingsPanel && !els.settingsPanel.classList.contains('panel-hidden');
                const isOverVisible = els.overlayOver && els.overlayOver.classList.contains('visible');

                                if (this.state.isActive && !isMenuOpen && !isOverVisible) {
                    if (e.target.closest('button')) return;
                    e.preventDefault();
                    this.handleInput();
                }
            };

            if(els.board) {
                els.board.addEventListener('mousedown', handleBoardClick);
                els.board.addEventListener('touchstart', (e) => {
                    if (e.target.closest('button')) return;
                    e.preventDefault();
                    this.handleInput();
                }, {passive: false});
            }

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel?.classList.contains('panel-hidden');
                const isOverVisible = els.overlayOver?.classList.contains('visible');

                                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();
                if (e.code === 'Escape') { e.preventDefault(); this.toggleSettings(); }
                if (e.code === 'Space' && this.state.isActive && !isMenuOpen && !isOverVisible) { e.preventDefault(); this.handleInput(); }
                if (e.code === 'Enter') {
                    if (isMenuOpen) { 
                        e.preventDefault(); 
                        if(els.saveSettings) els.saveSettings.click(); 
                    } 
                    else if (isOverVisible) { 
                        e.preventDefault(); 
                        this.startSequence(); 
                    }
                }
            });

            if(els.settingsToggle) {
                els.settingsToggle.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (document.fullscreenElement) {
                        document.exitFullscreen().catch(err => console.error(err));
                        if (this.els.settingsPanel?.classList.contains('panel-hidden')) this.toggleSettings();
                    } else {
                        this.toggleSettings();
                    }
                });
            }

                        if (els.closeSettings) els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

                        if (els.saveSettings) {
                els.saveSettings.addEventListener('click', () => {
                    const checkedMode = document.querySelector('input[name="mode-toggle"]:checked');
                    const selectedMode = checkedMode ? checkedMode.value : 'ranked';

                                        this.state.gameMode = selectedMode;
                    window.history.replaceState(null, '', `?mode=${selectedMode}`);

                                        if(els.config.attemptsRanked) localStorage.setItem('art_attempts_ranked', els.config.attemptsRanked.value);
                    if(els.config.attemptsSandbox) localStorage.setItem('art_attempts_sandbox', els.config.attemptsSandbox.value);
                    if(els.config.delaySandbox) localStorage.setItem('art_delay_sandbox', els.config.delaySandbox.value);

                                        this.state.savedAttemptsRanked = parseInt(els.config.attemptsRanked?.value) || 5;
                    this.state.savedAttemptsSandbox = parseInt(els.config.attemptsSandbox?.value) || 5;
                    this.state.savedMaxDelaySandbox = parseInt(els.config.delaySandbox?.value) || 3000;

                                        const configKey = `art_ranked_${this.state.savedAttemptsRanked}`;
                    this.preloadDistributionData(configKey);
                    this.toggleSettings(true);

                                        if (this.state.gameMode === 'sandbox') {
                        this.startSequence();
                    } else {
                        this.setPreStartState();
                    }
                });
            }

            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel?.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel?.contains(e.target) || els.settingsToggle?.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });

            window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
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

        async saveScoreToDatabase(score, attempts) {
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
                    body: JSON.stringify({ game_id: 'auditory_reaction_time', score: score, details: { attempts: attempts }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de sauvegarde globale DB:", error); }
        },

        async saveBestScoreToDatabase(score, attempts) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `art_ranked_${attempts}`, score: score, details: { attempts: attempts }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async preloadDistributionData(configKey) {
            const distKey = configKey || `art_ranked_${this.state.maxAttempts}`;
            try {
                const res = await fetch(`/api/scores/distribution/auditory_reaction_time?attempts=${this.state.maxAttempts}`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                if (res.ok) {
                    this.state.distributionDataByConfig[distKey] = await res.json();
                } else {
                    this.state.distributionDataByConfig[distKey] = [];
                }
            } catch(e) { 
                console.error("Erreur preload distribution:", e);
                this.state.distributionDataByConfig[distKey] = [];
            }
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
            if (stdDev < 10) stdDev = 10;

                        let bandwidth = 1.06 * stdDev * Math.pow(n, -0.2);
            if (bandwidth < 15) bandwidth = 15; 

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

                        const curvePath = this.els.viewRanked?.querySelector('.curve-path');
            const curveFill = this.els.viewRanked?.querySelector('.curve-fill');
            if (curvePath) curvePath.setAttribute('d', pathD);
            if (curveFill) curveFill.setAttribute('d', pathD + ` L 100 100 Z`);

                        const distributionContainer = this.els.viewRanked?.querySelector('.distribution-chart-container');
            if (!distributionContainer) return;

                        distributionContainer.querySelectorAll('.dist-html-dot').forEach(el => el.remove()); 

            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            const currentPercent = clamp(((currentScore - minX) / range) * 100, 2, 98);
            let bestPercent = null;
            if (bestScore !== null) bestPercent = clamp(((bestScore - minX) / range) * 100, 2, 98);

                        let currentOffset = 5; 
            if (bestPercent !== null && Math.abs(currentPercent - bestPercent) < 8) currentOffset = 30;

            if (bestScore !== null && currentScore === bestScore) {
                if(this.els.markerCurrent) this.els.markerCurrent.style.display = 'none';
            } else if(this.els.markerCurrent) {
                this.els.markerCurrent.style.display = 'block';
                this.els.markerCurrent.style.left = `${currentPercent}%`;
                this.els.markerCurrent.innerHTML = `
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">
                        ${currentScore}<span style="font-size: 0.65em; margin-left: 1px;">ms</span>
                    </div>
                `;
            }

            if (bestScore !== null) {
                if(this.els.markerBest) {
                    this.els.markerBest.classList.remove('hidden');
                    this.els.markerBest.style.left = `${bestPercent}%`;
                    this.els.markerBest.innerHTML = `
                        <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);">
                            <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/></svg>
                        </div>
                        <div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div>
                        <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">
                            ${bestScore}<span style="font-size: 0.65em; margin-left: 1px;">ms</span>
                        </div>
                    `;
                }
            } else {
                if(this.els.markerBest) this.els.markerBest.classList.add('hidden');
            }

            const tooltip = this.els.viewRanked?.querySelector('.chart-tooltip');
            const hoverLine = this.els.viewRanked?.querySelector('.hover-line');

                        if(distributionContainer && tooltip && hoverLine) {
                distributionContainer.onmousemove = (e) => {
                    const rect = distributionContainer.getBoundingClientRect();
                    const mouseX = e.clientX - rect.left;
                    const percentX = clamp(mouseX / rect.width, 0, 1);
                    const msValue = Math.round(minX + percentX * range);
                    const snappedPercentX = (msValue - minX) / range;

                                        let areaToLeft = 0;
                    for (let i = 0; i <= steps; i++) {
                        let pointVal = minX + (i / steps) * range;
                        if (pointVal <= msValue) areaToLeft += densities[i].y;
                    }

                                        let percentile = (areaToLeft / totalArea) * 100;
                    if (percentile < 0.1) percentile = 0.1;
                    if (percentile > 99.9) percentile = 99.9;
                    percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                                        tooltip.style.left = `${snappedPercentX * 100}%`;
                    tooltip.innerHTML = `<strong>${msValue}ms</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                    tooltip.classList.remove('hidden');

                                        hoverLine.style.left = `${snappedPercentX * 100}%`;
                    hoverLine.classList.remove('hidden');
                };

                distributionContainer.onmouseleave = () => {
                    tooltip.classList.add('hidden');
                    hoverLine.classList.add('hidden');
                };
            }
        }
    };

    AuditoryGame.init();
});