
const bpm_senseTranslations = {
    fr: {
        header_title: "PÉRCEPTION DU BPM",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            ranked_desc: "Trouvez le BPM exact. Plus vous vous trompez, plus vous perdez de vie. Un Perfect (+0 erreur) redonne des PV.",
            sandbox_desc: "Entraînez-vous sans limite de vie sur une plage de BPM spécifique.",
            range_title: "Plage de BPM",
            to: "à",
            flash_effect: "Flash visuel sur validation",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            perfect: "PARFAIT !",
            error: "Erreur : "
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            score: "Manches Survécues",
            best: "Meilleur",
            you: "Vous",
            top: "TOP",
            sandbox_score: "Manches Jouées",
            avg_error: "Écart Moyen",
            best_error: "Meilleure Préc.",
            worst_error: "Pire Préc.",
            sandbox_end: "Entraînement Terminé",
            sandbox_time: "Temps total :",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "BPM SENSE",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            ranked_desc: "Guess the exact BPM. The bigger the error, the more HP you lose. A Perfect (+0 error) restores HP.",
            sandbox_desc: "Practice without HP limits on a specific BPM range.",
            range_title: "BPM Range",
            to: "to",
            flash_effect: "Visual flash on submit",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            perfect: "PERFECT!",
            error: "Error: "
        },
        results: {
            new_record: "NEW RECORD!",
            score: "Rounds Survived",
            best: "Best",
            you: "You",
            top: "TOP",
            sandbox_score: "Rounds Played",
            avg_error: "Avg Error",
            best_error: "Best Prec.",
            worst_error: "Worst Prec.",
            sandbox_end: "Practice Ended",
            sandbox_time: "Total time:",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.bpm_sense = bpm_senseTranslations.fr;
    translations.en.bpm_sense = bpm_senseTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, bpm_senseTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, bpm_senseTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {

    const BpmSense = {
        state: {
            gameMode: 'ranked',
            score: 0,
            health: 50,
            maxHealth: 50,
            currentBpm: 0,

                        isActive: false,
            isPlayingAudio: false,
            audioCtx: null,
            clickBuffer: null, 

            timerId: null,
            sessionTime: 0,
            roundErrors: [],

                        savedFlashRanked: true,
            savedFlashSandbox: true,
            savedMinBpm: 60,
            savedMaxBpm: 180,

            animation: {
                requestId: null,
                startTime: 0,
                duration: 0, 
                maxAngle: 32, 
                isRunning: false
            },
            distributionDataByConfig: {}
        },

        els: {
            metronomeDisplay: document.getElementById('metronome-display'),
            metronomeArm: document.getElementById('metronome-arm'),
            feedbackText: document.getElementById('feedback-text'),
            statusOverlay: document.getElementById('status-overlay'),

                        input: document.getElementById('user-input'),
            inputVal: document.getElementById('input-value'),
            inputWrapper: document.getElementById('input-wrapper'),
            submitBtn: document.getElementById('submit-btn'),

                        score: document.getElementById('score'),
            healthContainer: document.getElementById('health-container'),
            healthFill: document.getElementById('health-fill'),
            healthText: document.getElementById('health-text'),
            board: document.querySelector('.game-board'),

                        timerDisplay: document.getElementById('timer-display'),
            timer: document.getElementById('timer'),
            sandboxFinalTime: document.getElementById('sandbox-final-time'),

            ingameRestartBtn: document.getElementById('ingame-restart-btn'),
            restartBtn: document.getElementById('restart-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            iconExpand: document.getElementById('icon-expand'),
            iconCompress: document.getElementById('icon-compress'),

            overlayOver: document.getElementById('game-over-overlay'),
            viewRanked: document.getElementById('results-ranked'),
            viewSandbox: document.getElementById('results-sandbox'),
            rankedScore: document.getElementById('ranked-score'),
            sandboxScore: document.getElementById('sandbox-score'),

                        statAvgError: document.getElementById('stat-avg-error'),
            statBestError: document.getElementById('stat-best-error'),
            statWorstError: document.getElementById('stat-worst-error'),
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
                flashRanked: document.getElementById('show-flash-ranked'),
                minBpm: document.getElementById('min-bpm'),
                maxBpm: document.getElementById('max-bpm'),
                flashSandbox: document.getElementById('show-flash-sandbox')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
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
                this.setPreStartState(true); 
                this.startGame();
            } else {
                this.setPreStartState();
            }
            this.preloadDistributionData('bpm_ranked');
        },


                startTimer() {
            this.resetTimer();
            this.state.timerId = setInterval(() => {
                this.state.sessionTime++;
                this.updateTimerUI();
            }, 1000);
        },

        stopTimer() {
            if (this.state.timerId) {
                clearInterval(this.state.timerId);
                this.state.timerId = null;
            }
        },

        resetTimer() {
            this.stopTimer();
            this.state.sessionTime = 0;
            this.updateTimerUI();
        },

        updateTimerUI() {
            if(!this.els.timer) return;
            const m = Math.floor(this.state.sessionTime / 60);
            const s = this.state.sessionTime % 60;
            if (m > 0) {
                this.els.timer.textContent = `${m}m ${s.toString().padStart(2, '0')}`;
            } else {
                this.els.timer.textContent = s;
            }
        },


                initAudio() {
            if (!this.state.audioCtx) {
                this.state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                this.createClickBuffer(); 
            }
            if (this.state.audioCtx.state === 'suspended') {
                this.state.audioCtx.resume();
            }
        },

        createClickBuffer() {
            if (this.state.clickBuffer) return;
            const sampleRate = this.state.audioCtx.sampleRate;
            const duration = 0.03; 
            const buffer = this.state.audioCtx.createBuffer(1, sampleRate * duration, sampleRate);
            const data = buffer.getChannelData(0);

                        for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;


                                                let env = 0;
                if (t < 0.001) {
                    env = t / 0.001; 
                } else {
                    env = 1 - ((t - 0.001) / 0.029); 
                }


                                                const osc = Math.sin(2 * Math.PI * 300 * t);

                                data[i] = osc * env;
            }
            this.state.clickBuffer = buffer;
        },

        animateMetronome(timestamp) {
            if (!this.state.animation.isRunning) return;

                        if (!this.state.animation.startTime) {
                this.state.animation.startTime = timestamp;
            }

                        const elapsed = (timestamp - this.state.animation.startTime) / 1000;
            const anim = this.state.animation;

            if (elapsed >= anim.duration) {
                this.stopMetronomeAnimation(true); 
                return;
            }

            const beatsPerSecond = this.state.currentBpm / 60;


                                    const amplitude = 35; 
            const angle = Math.sin(elapsed * Math.PI * beatsPerSecond) * amplitude;

                        this.els.metronomeArm.style.transform = `rotate(${angle}deg)`;

                        this.state.animation.requestId = requestAnimationFrame((t) => this.animateMetronome(t));
        },

        startMetronomeAnimation(bpm, totalBeats) {
            this.els.metronomeArm.classList.remove('damping');
            const beatDuration = 60 / bpm;

                        this.state.animation.startTime = 0;
            this.state.animation.isRunning = true;
            this.state.animation.duration = beatDuration * totalBeats; 

            if (this.state.animation.requestId) {
                cancelAnimationFrame(this.state.animation.requestId);
            }
            this.state.animation.requestId = requestAnimationFrame((t) => this.animateMetronome(t));
        },

        stopMetronomeAnimation(naturalStop = false) {
            this.state.animation.isRunning = false;
            if (this.state.animation.requestId) {
                cancelAnimationFrame(this.state.animation.requestId);
                this.state.animation.requestId = null;
            }

            if (naturalStop) {
                this.els.metronomeArm.classList.add('damping');
            } else {
                this.els.metronomeArm.style.transform = 'rotate(0deg)';
            }
        },

        playClick(time) {
            if (!this.state.audioCtx || !this.state.clickBuffer) return;

            const saved = localStorage.getItem('siteGlobalVolume');
            let volMod = saved !== null ? parseInt(saved, 10) / 100 : 0.5;
            if (volMod < 0.1) volMod = 0.1;

            const source = this.state.audioCtx.createBufferSource();
            source.buffer = this.state.clickBuffer;

                        const gainNode = this.state.audioCtx.createGain();
            gainNode.gain.value = volMod;

                        source.connect(gainNode);
            gainNode.connect(this.state.audioCtx.destination);

                        source.start(time);
        },

        async playMetronomeSequence(bpm) {
            this.initAudio();

                        if (this.state.audioCtx.state === 'suspended') {
                await this.state.audioCtx.resume();
            }

            this.state.isPlayingAudio = true;
            this.els.input.disabled = true;
            this.els.submitBtn.disabled = true;
            this.els.feedbackText.classList.remove('visible');

                        let beats = 8;
            if (this.state.gameMode === 'ranked') {
                if (this.state.score > 5) beats = 6;
                if (this.state.score > 10) beats = 4;
            }

            const beatDuration = 60 / bpm;
            const startTime = this.state.audioCtx.currentTime + 0.15; 

            this.startMetronomeAnimation(bpm, beats);

            for (let i = 0; i < beats; i++) {
                this.playClick(startTime + (i * beatDuration));
            }

            const totalDurationMs = (beats * beatDuration + 0.15) * 1000;

                        return new Promise(resolve => {
                setTimeout(() => {
                    if(!this.state.isActive) return resolve();

                                        this.state.isPlayingAudio = false;
                    this.els.input.disabled = false;
                    this.els.submitBtn.disabled = false;
                    this.els.input.focus();

                                        resolve();
                }, totalDurationMs);
            });
        },


                loadUserPreferences() {
            const c = this.els.config;

            const savedFlashR = localStorage.getItem('bpm_flash_ranked');
            if (savedFlashR !== null) {
                const isTrue = (savedFlashR === 'true');
                if (c.flashRanked) c.flashRanked.checked = isTrue;
                this.state.savedFlashRanked = isTrue;
            }

            const savedMin = localStorage.getItem('bpm_min_sandbox');
            if (savedMin !== null) {
                if (c.minBpm) c.minBpm.value = savedMin;
                this.state.savedMinBpm = parseInt(savedMin);
            }

            const savedMax = localStorage.getItem('bpm_max_sandbox');
            if (savedMax !== null) {
                if (c.maxBpm) c.maxBpm.value = savedMax;
                this.state.savedMaxBpm = parseInt(savedMax);
            }

            const savedFlashS = localStorage.getItem('bpm_flash_sandbox');
            if (savedFlashS !== null) {
                const isTrue = (savedFlashS === 'true');
                if (c.flashSandbox) c.flashSandbox.checked = isTrue;
                this.state.savedFlashSandbox = isTrue;
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

        updateHealthUI() {
            if (this.state.gameMode === 'sandbox') {
                this.els.healthContainer.style.display = 'none';
                this.els.timerDisplay.style.display = 'flex';
                return;
            }
            this.els.healthContainer.style.display = 'flex';
            this.els.timerDisplay.style.display = 'none';

            this.els.healthContainer.style.visibility = 'visible';
            this.els.healthText.textContent = this.state.health;

                        const pct = Math.max(0, (this.state.health / this.state.maxHealth) * 100);
            this.els.healthFill.style.width = `${pct}%`;

                        this.els.healthFill.style.backgroundColor = 'var(--accent-color-secondary)';
        },

        setPreStartState(isAutoStart = false) {
            this.state.isActive = false;
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

                        this.stopMetronomeAnimation();
            this.stopTimer();
            this.state.sessionTime = 0;
            this.state.roundErrors = [];
            this.updateTimerUI();

            if (isAutoStart) {
                this.els.statusOverlay.classList.add('hidden');
                this.els.metronomeDisplay.classList.remove('blurred');
                this.els.inputWrapper.classList.remove('blurred');
            } else {
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

                                this.els.metronomeDisplay.classList.add('blurred');
                this.els.inputWrapper.classList.add('blurred');
            }

                        this.els.score.textContent = "0";
            this.state.health = this.state.maxHealth;
            this.updateHealthUI();

                        this.els.input.value = '';
            this.els.inputVal.textContent = '';
            this.els.feedbackText.classList.remove('visible');

                        if (isAutoStart) {
                this.els.input.disabled = false;
                this.els.submitBtn.disabled = false;
                this.els.input.focus();
            } else {
                this.els.input.disabled = true;
                this.els.submitBtn.disabled = true;
                this.els.input.blur();
            }

                        if (this.els.ingameRestartBtn) {
                this.els.ingameRestartBtn.style.display = 'none';
            }
        },

        startGame() {
            this.initAudio(); 
            this.state.currentState = 'PLAYING';
            this.state.score = 0;
            this.state.health = this.state.maxHealth;
            this.state.isActive = true;
            this.state.roundErrors = [];

                        this.els.statusOverlay.classList.add('hidden');
            this.els.metronomeDisplay.classList.remove('blurred');
            this.els.inputWrapper.classList.remove('blurred');

                        this.els.score.textContent = "0";
            this.updateHealthUI();

            if (this.state.gameMode === 'sandbox') {
                this.startTimer();
            }

                        if (this.els.ingameRestartBtn) {
                this.els.ingameRestartBtn.style.display = '';
                this.els.ingameRestartBtn.style.visibility = 'visible';
            }

                        this.generateRound();
        },

        generateRound() {
            if (!this.state.isActive) return;

            let min = 60;
            let max = 180;
            let allowDecimals = false;

            if (this.state.gameMode === 'sandbox') {
                min = this.state.savedMinBpm;
                max = this.state.savedMaxBpm;
            } else {
                if (this.state.score > 10) { min = 40; max = 220; }
                if (this.state.score > 15) { allowDecimals = true; }
            }

            let target = Math.floor(Math.random() * (max - min + 1)) + min;
            if (allowDecimals) {
                target = target + (Math.round(Math.random() * 10) / 10);
            }

            this.state.currentBpm = target;

                        this.els.input.value = '';
            this.els.inputVal.textContent = '';

                        this.els.feedbackText.classList.remove('visible');

            this.playMetronomeSequence(this.state.currentBpm);
        },

        checkInput() {
            if (this.state.isPlayingAudio || !this.state.isActive) return;

            const guess = parseFloat(this.els.input.value);
            if (isNaN(guess)) return;

            const error = Math.abs(this.state.currentBpm - guess);

            this.els.feedbackText.classList.remove('visible');
            void this.els.feedbackText.offsetWidth; 

            if (this.state.gameMode === 'ranked') {
                if (error === 0) {
                    this.els.feedbackText.textContent = getGameText('game.perfect');
                    this.els.feedbackText.style.color = 'var(--accent-color)';
                    if (this.state.savedFlashRanked) this.triggerFlash('success');
                } else {
                    this.state.health -= error;
                    this.els.feedbackText.textContent = `+${error.toFixed(1)}`;
                    this.els.feedbackText.style.color = 'var(--accent-color-secondary)';
                    if (this.state.savedFlashRanked) {
                        if (error <= 5) this.triggerFlash('neutral');
                        else this.triggerFlash('error');
                    }
                }

                                this.updateHealthUI();

                if (this.state.health <= 0) {
                    this.state.health = 0;
                    this.updateHealthUI();
                    this.endGame();
                    return;
                }

                this.state.score++;
                this.els.score.textContent = this.state.score;
            } else {
                if (error === 0) {
                    this.els.feedbackText.textContent = getGameText('game.perfect');
                } else {
                    this.els.feedbackText.textContent = `${guess} BPM (Cible: ${this.state.currentBpm})`;
                }
                this.els.feedbackText.style.color = 'var(--text-primary)';

                                if (this.state.savedFlashSandbox) {
                    if (error === 0) this.triggerFlash('success');
                    else if (error <= 5) this.triggerFlash('neutral');
                    else this.triggerFlash('error');
                }

                                this.state.roundErrors.push(error);
                this.state.score++;
                this.els.score.textContent = this.state.score;
            }

            this.els.feedbackText.classList.add('visible');

                        setTimeout(() => {
                if(this.state.isActive) this.generateRound();
            }, 1500);
        },

        triggerFlash(type) {
            this.els.board.classList.remove('flash-overlay', 'flash-success', 'flash-error', 'flash-neutral');
            void this.els.board.offsetWidth; 
            this.els.board.classList.add('flash-overlay', `flash-${type}`);
        },

        async endGame() {
            this.state.isActive = false;
            this.state.currentState = 'FINISHED';

                        this.stopMetronomeAnimation();
            this.stopTimer();

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');

                                this.els.rankedScore.textContent = this.state.score;

                                this.saveScoreToDatabase(this.state.score);

                                const recordKey = `bpm_best_ranked`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                                if (best === null || this.state.score > best) {
                    best = this.state.score;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best);
                }

                                if (isRecord && savedBest !== null && this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'visible';
                    this.els.newRecordMsg.style.opacity = '1';
                } else if(this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                                this.drawDistributionChart(this.state.score, best, 'bpm_ranked');

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');

                if (this.els.sandboxScore) this.els.sandboxScore.textContent = this.state.score;

                if (this.state.roundErrors.length > 0) {
                    const sum = this.state.roundErrors.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.state.roundErrors.length).toFixed(1);
                    const best = Math.min(...this.state.roundErrors).toFixed(1);
                    const worst = Math.max(...this.state.roundErrors).toFixed(1);

                                        if (this.els.statAvgError) this.els.statAvgError.textContent = `±${avg}`;
                    if (this.els.statBestError) this.els.statBestError.textContent = `±${best}`;
                    if (this.els.statWorstError) this.els.statWorstError.textContent = `±${worst}`;

                                        this.renderHistoryChart();
                } else {
                    if (this.els.statAvgError) this.els.statAvgError.textContent = `--`;
                    if (this.els.statBestError) this.els.statBestError.textContent = `--`;
                    if (this.els.statWorstError) this.els.statWorstError.textContent = `--`;
                    if (this.els.historyChart) this.els.historyChart.innerHTML = '';
                }

                if (this.els.sandboxFinalTime) {
                    const m = Math.floor(this.state.sessionTime / 60);
                    const s = this.state.sessionTime % 60;
                    this.els.sandboxFinalTime.textContent = m > 0 ? `${m}m ${s}s` : `${s}s`;
                }

                                if(this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }
            }

            this.toggleOverlay(this.els.overlayOver, true);
            this.els.input.disabled = true;
            this.els.submitBtn.disabled = true;
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
        },

        renderHistoryChart() {
            if (!this.els.historyChart) return;
            this.els.historyChart.innerHTML = '';

                        const maxError = Math.max(...this.state.roundErrors, 5); 
            const chartMin = 0; 
            const chartMax = maxError * 1.2;
            const chartRange = chartMax - chartMin;

            this.state.roundErrors.forEach((error, index) => {
                let heightPercent = ((error - chartMin) / chartRange) * 100;
                if(heightPercent < 5) heightPercent = 5; 

                                const barContainer = document.createElement('div');
                barContainer.className = 'history-bar-wrapper';

                                const bar = document.createElement('div');
                bar.className = 'history-bar'; 
                bar.style.height = `${heightPercent}%`;
                if (error === 0) bar.style.backgroundColor = 'var(--success-color, #10b981)';

                                const label = document.createElement('span');
                label.textContent = error.toFixed(1); 
                label.className = 'bar-label';

                                const indexLabel = document.createElement('span');
                indexLabel.textContent = index + 1; 
                indexLabel.className = 'bar-index';

                                barContainer.appendChild(label); 
                barContainer.appendChild(bar); 
                barContainer.appendChild(indexLabel);

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

        async saveScoreToDatabase(score) {
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
                    body: JSON.stringify({ game_id: 'bpm_sense', score: score, details: {}, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `bpm_ranked`, score: score, details: {}, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec DB:", error); }
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
            if (bestScore !== null) bestPercent = clamp(((bestScore - minX) / range) * 100, 0, 100);

            let currentOffset = 5; 
            if (bestPercent !== null && Math.abs(currentPercent - bestPercent) < 8) currentOffset = 30;

            if (bestScore !== null && currentScore === bestScore) {
                this.els.markerCurrent.style.display = 'none';
            } else {
                this.els.markerCurrent.style.display = 'block';
                this.els.markerCurrent.style.left = `${currentPercent}%`;
                this.els.markerCurrent.innerHTML = `
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">
                        ${currentScore}<span style="font-size: 0.65em; margin-left: 1px;">rnds</span>
                    </div>
                `;
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
                        ${bestScore}<span style="font-size: 0.65em; margin-left: 1px;">rnds</span>
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
                tooltip.innerHTML = `<strong>${val} rnds</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
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
            const distKey = configKey || 'bpm_ranked';
            try {
                const res = await fetch(`/api/scores/distribution/bpm_sense`, {
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
            if (!el) return;
            if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
            else { el.classList.remove('visible'); el.classList.add('hidden'); }
        },

        updateSettingsView(mode) {
            if (mode === 'ranked') {
                if (this.els.settingsGroupRanked) this.els.settingsGroupRanked.style.display = 'block';
                if (this.els.settingsGroupSandbox) this.els.settingsGroupSandbox.style.display = 'none';
            } else {
                if (this.els.settingsGroupRanked) this.els.settingsGroupRanked.style.display = 'none';
                if (this.els.settingsGroupSandbox) this.els.settingsGroupSandbox.style.display = 'block';
            }
        },

        restoreSettingsUI() {
            const c = this.els.config;
            if(c.flashRanked) c.flashRanked.checked = this.state.savedFlashRanked;
            if(c.minBpm) c.minBpm.value = this.state.savedMinBpm;
            if(c.maxBpm) c.maxBpm.value = this.state.savedMaxBpm;
            if(c.flashSandbox) c.flashSandbox.checked = this.state.savedFlashSandbox;

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

            if(els.modeToggleRadios) {
                els.modeToggleRadios.forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        this.updateSettingsView(e.target.value);
                    });
                });
            }

            if(els.restartBtn) {
                els.restartBtn.addEventListener('click', () => {
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') {
                        this.setPreStartState(true);
                        this.startGame();
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
                        this.setPreStartState(true);
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

            if(els.inputWrapper && els.input) {
                els.inputWrapper.addEventListener('click', () => { if (!els.input.disabled) els.input.focus(); });
                els.input.addEventListener('focus', () => els.inputWrapper.classList.add('focused'));
                els.input.addEventListener('blur', () => els.inputWrapper.classList.remove('focused'));

                els.input.addEventListener('input', (e) => {
                    const raw = els.input.value;
                    const clean = raw.replace(/[^0-9.]/g, ''); 
                    if (raw !== clean) els.input.value = clean;
                    els.inputVal.textContent = clean;
                });
            }

            if(els.submitBtn) {
                els.submitBtn.addEventListener('click', () => {
                    this.checkInput();
                });
            }

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel?.classList.contains('panel-hidden');
                const isOverVisible = this.els.overlayOver?.classList.contains('visible');

                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();

                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }

                if (e.code === 'Enter' || e.code === 'Space') {
                    if (isMenuOpen) {
                        e.preventDefault();
                        if(els.saveSettings) els.saveSettings.click();
                    } 
                    else if (isOverVisible) {
                        e.preventDefault();
                        if(els.restartBtn) els.restartBtn.click();
                    }
                    else if (this.state.currentState === 'PRE_START') {
                        e.preventDefault();
                        this.startGame();
                    }
                    else if (this.state.isActive && !this.state.isPlayingAudio && e.code === 'Enter') {
                        e.preventDefault();
                        this.checkInput();
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
                    const c = this.els.config;
                    const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;

                                        this.state.gameMode = selectedMode;
                    window.history.replaceState(null, '', '?mode=' + selectedMode);

                    if(c.flashRanked) {
                        localStorage.setItem('bpm_flash_ranked', c.flashRanked.checked);
                        this.state.savedFlashRanked = c.flashRanked.checked;
                    }

                    if(c.minBpm) {
                        localStorage.setItem('bpm_min_sandbox', c.minBpm.value);
                        this.state.savedMinBpm = parseInt(c.minBpm.value) || 60;
                    }
                    if(c.maxBpm) {
                        localStorage.setItem('bpm_max_sandbox', c.maxBpm.value);
                        this.state.savedMaxBpm = parseInt(c.maxBpm.value) || 180;
                    }
                    if(c.flashSandbox) {
                        localStorage.setItem('bpm_flash_sandbox', c.flashSandbox.checked);
                        this.state.savedFlashSandbox = c.flashSandbox.checked;
                    }

                                        this.toggleSettings(true);
                    this.preloadDistributionData('bpm_ranked');

                                        if (this.state.gameMode === 'sandbox') {
                        this.setPreStartState(true);
                        this.startGame();
                    } else {
                        this.setPreStartState();
                    }
                });
            }

            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel?.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel?.contains(e.target) || els.settingsToggle?.contains(e.target);

                                if (isMenuOpen && !clickedInside) {
                    this.toggleSettings(true);
                }

                                if (!isMenuOpen && !e.target.closest('button') && !e.target.closest('a')) {
                    if (this.state.currentState === 'PRE_START') {
                        this.startGame();
                    } else if (this.state.isActive && !this.state.isPlayingAudio) {
                        if(els.input) els.input.focus();
                    }
                }
            });

                        window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
            });
        }
    };

    BpmSense.init();
});