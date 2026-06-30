
const absolute_pitchTranslations = {
    fr: {
        header_title: "OREILLE ABSOLUE",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            precision_title: "Précision (Hz)",
            prec_0: "1",
            prec_1: "0.1",
            prec_2: "0.01",
            ranked_desc: "Trouvez la fréquence exacte (Hz). L'écart en Hz correspond exactement aux points de vie perdus.",
            sandbox_desc: "Entraînez-vous sans limite de vie sur une plage de fréquences spécifique.",
            range_title: "Plage de Fréquences (Hz)",
            to: "à",
            flash_effect: "Flash visuel sur validation",
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
            score: "Manches Survécues",
            best: "Meilleur",
            you: "Vous",
            top: "TOP",
            sandbox_score: "Manches Jouées",
            avg_error: "Écart Moyen",
            cent_offset: "Offset Cents",
            avg_time: "Temps Rép.",
            sandbox_end: "Entraînement Terminé",
            sandbox_time: "Temps total :",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "ABSOLUTE PITCH",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            precision_title: "Precision (Hz)",
            prec_0: "1",
            prec_1: "0.1",
            prec_2: "0.01",
            ranked_desc: "Find the exact frequency (Hz). The difference in Hz is exactly the amount of HP you lose.",
            sandbox_desc: "Practice without HP limits on a specific frequency range.",
            range_title: "Frequency Range (Hz)",
            to: "to",
            flash_effect: "Visual flash on submit",
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
            score: "Rounds Survived",
            best: "Best",
            you: "You",
            top: "TOP",
            sandbox_score: "Rounds Played",
            avg_error: "Avg Error",
            cent_offset: "Cent Offset",
            avg_time: "Avg Time",
            sandbox_end: "Practice Ended",
            sandbox_time: "Total time:",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.absolute_pitch = absolute_pitchTranslations.fr;
    translations.en.absolute_pitch = absolute_pitchTranslations.en;
}

function getGameText(key) {
    const savedLang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, absolute_pitchTranslations[savedLang])
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, absolute_pitchTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {

    const AbsolutePitch = {
        state: {
            gameMode: 'ranked',
            precision: 0, 
            score: 0,
            health: 100,
            maxHealth: 100,
            currentHz: 0,

            isActive: false,
            isPlayingAudio: false,
            audioCtx: null,
            currentOsc: null,
            currentGain: null,

            previewOsc: null,
            previewGain: null,

            timerId: null,
            sessionTime: 0,
            roundStartTime: 0,

            roundErrors: [],
            roundCents: [],
            roundTimes: [],
            zones: { low: [], mid: [], high: [] },

            savedFlashRanked: true,
            savedFlashSandbox: true,
            savedMinHz: 200,
            savedMaxHz: 2000,

            distributionData: [],

            isShowingSine: false,
            sineAnimId: null,
            currentSineFreq: 0
        },

        els: {
            visualizerDisplay: document.getElementById('visualizer-display'),
            audioWave: document.getElementById('audio-wave'),
            sineCanvas: document.getElementById('sine-canvas'),
            sineCtx: null,
            replayBtn: document.getElementById('replay-btn'),
            feedbackText: document.getElementById('feedback-text'),
            statusOverlay: document.getElementById('status-overlay'),

            sliderWrapper: document.getElementById('input-wrapper'),
            slider: document.getElementById('hz-slider'),
            inputVal: document.getElementById('input-value'),
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

            settingsPanel: document.getElementById('settings-panel'),
            settingsToggle: document.getElementById('settings-toggle'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),

            precisionSelect: document.getElementById('precision-select'),
            settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
            modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),

            markerCurrent: document.getElementById('marker-current'),
            markerBest: document.getElementById('marker-best'),
            newRecordMsg: document.getElementById('new-record-msg'),

            statAvgError: document.getElementById('stat-avg-error'),
            statCentOffset: document.getElementById('stat-cent-offset'),
            statAvgTime: document.getElementById('stat-avg-time'),
            matrixStats: document.getElementById('matrix-stats'),

            config: {
                flashRanked: document.getElementById('show-flash-ranked'),
                minHz: document.getElementById('min-hz'),
                maxHz: document.getElementById('max-hz'),
                flashSandbox: document.getElementById('show-flash-sandbox')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('precision')) {
                this.state.precision = parseInt(params.get('precision'), 10);
            }

            this.els.sineCtx = this.els.sineCanvas ? this.els.sineCanvas.getContext('2d') : null;

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

            const precSuffix = this.state.precision > 0 ? `_p${this.state.precision}` : '';
            const configKey = `abspitch_${this.state.gameMode}${precSuffix}`;
            this.preloadDistributionData(configKey);
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
            if (!this.els.timer) return;
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
            }
            if (this.state.audioCtx.state === 'suspended') {
                this.state.audioCtx.resume();
            }
        },

        stopFrequency() {
            if (this.state.currentOsc && this.state.currentGain) {
                try {
                    const now = this.state.audioCtx.currentTime;
                    this.state.currentGain.gain.cancelScheduledValues(now);
                    this.state.currentGain.gain.setValueAtTime(this.state.currentGain.gain.value, now);
                    this.state.currentGain.gain.linearRampToValueAtTime(0, now + 0.05);
                    this.state.currentOsc.stop(now + 0.05);
                } catch (e) { }
                this.state.currentOsc = null;
                this.state.currentGain = null;
            }
            this.state.isPlayingAudio = false;
            this.els.audioWave.classList.remove('playing');
        },

        playFrequency(hz, duration = null) {
            this.initAudio();
            this.stopFrequency();

            this.state.isShowingSine = false;
            this.els.visualizerDisplay.classList.remove('guess-mode');

            const saved = localStorage.getItem('siteGlobalVolume');
            let volMod = saved !== null ? parseInt(saved, 10) / 100 : 0.5;
            if (volMod < 0.1) volMod = 0.1;

            volMod = volMod * 0.3;

            const osc = this.state.audioCtx.createOscillator();
            const gain = this.state.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.value = hz;

            const now = this.state.audioCtx.currentTime;

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(volMod, now + 0.05);

            osc.connect(gain);
            gain.connect(this.state.audioCtx.destination);

            osc.start(now);
            this.state.currentOsc = osc;
            this.state.currentGain = gain;
            this.state.isPlayingAudio = true;
            this.els.audioWave.classList.add('playing');

            if (duration) {
                gain.gain.setValueAtTime(volMod, now + duration);
                gain.gain.linearRampToValueAtTime(0, now + duration + 0.05);
                osc.stop(now + duration + 0.05);

                setTimeout(() => {
                    if (this.state.currentOsc === osc) {
                        this.state.currentOsc = null;
                        this.state.currentGain = null;
                        this.state.isPlayingAudio = false;
                        this.els.audioWave.classList.remove('playing');
                        if (this.state.isActive) {
                            this.els.slider.disabled = false;
                            this.els.submitBtn.disabled = false;
                            if (this.state.gameMode !== 'ranked') {
                                this.els.replayBtn.style.display = 'inline-block';
                            }

                            if (parseInt(this.els.slider.value, 10) > 0) {
                                this.els.visualizerDisplay.classList.add('guess-mode');
                                this.state.isShowingSine = true;
                                this.startSineAnimation();
                            }
                        }
                    }
                }, (duration + 0.05) * 1000);
            }
        },

        startPreviewSound(hz) {
            if (!this.state.audioCtx) this.initAudio();
            if (this.state.previewOsc) return;

            const saved = localStorage.getItem('siteGlobalVolume');
            let volMod = saved !== null ? parseInt(saved, 10) / 100 : 0.5;
            if (volMod < 0.1) volMod = 0.1;

            volMod = volMod * 0.3;

            const osc = this.state.audioCtx.createOscillator();
            const gain = this.state.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.value = hz;

            const now = this.state.audioCtx.currentTime;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(volMod, now + 0.05);

            osc.connect(gain);
            gain.connect(this.state.audioCtx.destination);

            osc.start(now);
            this.state.previewOsc = osc;
            this.state.previewGain = gain;
        },

        updatePreviewSound(hz) {
            if (this.state.previewOsc) {
                const now = this.state.audioCtx.currentTime;
                this.state.previewOsc.frequency.setTargetAtTime(hz, now, 0.05);
            }
        },

        stopPreviewSound() {
            if (this.state.previewOsc && this.state.previewGain) {
                try {
                    const now = this.state.audioCtx.currentTime;
                    this.state.previewGain.gain.cancelScheduledValues(now);
                    this.state.previewGain.gain.setValueAtTime(this.state.previewGain.gain.value, now);
                    this.state.previewGain.gain.linearRampToValueAtTime(0, now + 0.05);
                    this.state.previewOsc.stop(now + 0.05);
                } catch (e) { }
                this.state.previewOsc = null;
                this.state.previewGain = null;
            }
        },

        getMinMaxHz() {
            if (this.state.gameMode === 'sandbox') {
                return { min: this.state.savedMinHz, max: this.state.savedMaxHz };
            }
            return { min: 200, max: 2000 };
        },

        logSliderToHz(position) {
            if (position == 0) return 0;
            const bounds = this.getMinMaxHz();
            const minV = Math.log(bounds.min);
            const maxV = Math.log(bounds.max);
            const scale = (maxV - minV) / 999999;
            return Math.exp(minV + scale * (position - 1));
        },

        applyPrecision(val, prec) {
            if (prec === 0) return Math.round(val);
            return parseFloat(val.toFixed(prec));
        },

        updateSliderDisplay() {
            const val = parseInt(this.els.slider.value, 10);
            let hz = this.logSliderToHz(val);
            hz = this.applyPrecision(hz, this.state.precision);

            this.els.inputVal.textContent = hz.toFixed(this.state.precision);

            const percent = (val / 1000000) * 100;
            this.els.slider.style.setProperty('--val-percent', `${percent}%`);

            if (this.state.isActive && !this.state.isPlayingAudio && val > 0) {
                this.els.visualizerDisplay.classList.add('guess-mode');

                this.state.currentSineFreq = hz;

                if (!this.state.isShowingSine) {
                    this.state.isShowingSine = true;
                    this.startSineAnimation();
                }
            }
        },

        loadUserPreferences() {
            const c = this.els.config;

            const savedPrec = localStorage.getItem('abspitch_precision');
            if (savedPrec !== null) {
                this.state.precision = parseInt(savedPrec, 10);
                if (this.els.precisionSelect) this.els.precisionSelect.value = this.state.precision;
            }

            const savedFlashR = localStorage.getItem('abspitch_flash_ranked');
            if (savedFlashR !== null) {
                const isTrue = (savedFlashR === 'true');
                if (c.flashRanked) c.flashRanked.checked = isTrue;
                this.state.savedFlashRanked = isTrue;
            }

            const savedMin = localStorage.getItem('abspitch_min_sandbox');
            if (savedMin !== null) {
                if (c.minHz) c.minHz.value = savedMin;
                this.state.savedMinHz = parseInt(savedMin);
            }

            const savedMax = localStorage.getItem('abspitch_max_sandbox');
            if (savedMax !== null) {
                if (c.maxHz) c.maxHz.value = savedMax;
                this.state.savedMaxHz = parseInt(savedMax);
            }

            const savedFlashS = localStorage.getItem('abspitch_flash_sandbox');
            if (savedFlashS !== null) {
                const isTrue = (savedFlashS === 'true');
                if (c.flashSandbox) c.flashSandbox.checked = isTrue;
                this.state.savedFlashSandbox = isTrue;
            }
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

        updateHealthUI() {
            if (this.state.gameMode === 'sandbox') {
                this.els.healthContainer.style.display = 'none';
                this.els.timerDisplay.style.display = 'flex';
                return;
            }
            this.els.healthContainer.style.display = 'flex';
            this.els.timerDisplay.style.display = 'none';

            this.els.healthContainer.style.visibility = 'visible';
            this.els.healthText.textContent = Math.round(this.state.health);

            const pct = Math.max(0, (this.state.health / this.state.maxHealth) * 100);
            this.els.healthFill.style.width = `${pct}%`;

            this.els.healthFill.style.backgroundColor = 'var(--accent-color-secondary)';
        },

        setPreStartState(isAutoStart = false) {
            this.state.isActive = false;
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

            this.stopFrequency();
            this.stopPreviewSound();
            this.stopTimer();

            this.state.isShowingSine = false;
            this.els.visualizerDisplay.classList.remove('guess-mode');

            this.state.sessionTime = 0;
            this.state.roundErrors = [];
            this.state.roundCents = [];
            this.state.roundTimes = [];
            this.state.zones = { low: [], mid: [], high: [] };
            this.updateTimerUI();

            if (isAutoStart) {
                this.els.statusOverlay.classList.add('hidden');
                this.els.visualizerDisplay.classList.remove('blurred');
                this.els.sliderWrapper.classList.remove('blurred');
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

                this.els.visualizerDisplay.classList.add('blurred');
                this.els.sliderWrapper.classList.add('blurred');
            }

            this.els.score.textContent = "0";
            this.state.health = this.state.maxHealth;
            this.updateHealthUI();

            this.els.slider.value = 0;
            this.updateSliderDisplay();
            this.els.feedbackText.classList.remove('visible');
            if (this.els.replayBtn) this.els.replayBtn.style.display = 'none';

            this.els.slider.disabled = true;
            this.els.submitBtn.disabled = true;

            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
        },

        startGame() {
            this.initAudio();
            this.state.currentState = 'PLAYING';
            this.state.score = 0;
            this.state.health = this.state.maxHealth;
            this.state.isActive = true;
            this.state.roundErrors = [];
            this.state.roundCents = [];
            this.state.roundTimes = [];
            this.state.zones = { low: [], mid: [], high: [] };

            this.els.statusOverlay.classList.add('hidden');
            this.els.visualizerDisplay.classList.remove('blurred');
            this.els.sliderWrapper.classList.remove('blurred');

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

            this.state.isShowingSine = false;
            this.els.visualizerDisplay.classList.remove('guess-mode');

            const bounds = this.getMinMaxHz();
            const minLog = Math.log(bounds.min);
            const maxLog = Math.log(bounds.max);
            const targetLog = minLog + Math.random() * (maxLog - minLog);

            let hz = Math.exp(targetLog);
            this.state.currentHz = this.applyPrecision(hz, this.state.precision);

            this.els.slider.value = 0;
            this.updateSliderDisplay();

            this.els.feedbackText.classList.remove('visible');
            if (this.els.replayBtn) this.els.replayBtn.style.display = 'none';
            this.els.slider.disabled = true;
            this.els.submitBtn.disabled = true;

            this.state.roundStartTime = Date.now() + 3000;
            this.triggerAudioForRound();
        },

        triggerAudioForRound() {
            this.playFrequency(this.state.currentHz, 3.0);
        },

        startSineAnimation() {
            if (this.state.sineAnimId) return;

            const canvas = this.els.sineCanvas;
            const ctx = this.els.sineCtx;
            if (!ctx || !canvas) return;

            let offset = 0;

            const animate = () => {
                if (!this.state.isShowingSine) {
                    this.state.sineAnimId = null;
                    return;
                }

                if (canvas.width !== canvas.clientWidth && canvas.clientWidth > 0) {
                    canvas.width = canvas.clientWidth;
                }
                if (canvas.height !== canvas.clientHeight && canvas.clientHeight > 0) {
                    canvas.height = canvas.clientHeight;
                }

                const minFreq = this.getMinMaxHz().min || 20;
                const maxFreq = this.getMinMaxHz().max || 10000;
                const freq = this.state.currentSineFreq || minFreq;

                const minLog = Math.log(minFreq);
                const maxLog = Math.log(maxFreq);
                const currentLog = Math.log(Math.max(freq, 1));
                const normalizedLog = Math.max(0, Math.min(1, (currentLog - minLog) / (maxLog - minLog)));

                const waves = 2 + (normalizedLog * 38);
                const speed = 0.05 + (normalizedLog * 0.35);

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();

                const style = getComputedStyle(document.body);
                ctx.strokeStyle = style.getPropertyValue('--accent-color').trim() || '#4CAF50';
                ctx.lineWidth = 4;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';

                for (let x = 0; x <= canvas.width; x++) {
                    const y = (canvas.height / 2) + Math.sin((x / canvas.width) * Math.PI * 2 * waves + offset) * (canvas.height / 2.5);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }

                ctx.stroke();
                offset -= speed;

                this.state.sineAnimId = requestAnimationFrame(animate);
            };

            animate();
        },

        checkInput() {
            if (!this.state.isActive) return;

            this.stopFrequency();
            this.stopPreviewSound();
            if (this.els.replayBtn) this.els.replayBtn.style.display = 'none';

            let guess = this.logSliderToHz(this.els.slider.value);
            guess = this.applyPrecision(guess, this.state.precision);

            const reelle = this.state.currentHz;

            let distance = guess - reelle;
            if (this.state.precision > 0) distance = parseFloat(distance.toFixed(this.state.precision));

            const diffAbs = Math.abs(distance);
            const errorPct = guess === 0 ? 100 : Math.abs(distance / reelle) * 100;
            const cents = guess === 0 ? -1200 : 1200 * Math.log2(guess / reelle);
            const timeTaken = (Date.now() - this.state.roundStartTime) / 1000;

            this.els.feedbackText.classList.remove('visible');
            void this.els.feedbackText.offsetWidth;

            const sign = distance > 0 ? '+' : '';
            const distanceText = `${sign}${distance.toFixed(this.state.precision)} Hz`;

            const mixRatio = Math.min(diffAbs / 100, 1) * 100;
            const distanceColor = `color-mix(in srgb, var(--accent-color-secondary) ${mixRatio}%, var(--accent-color))`;

            if (this.state.gameMode === 'ranked') {
                this.state.health -= diffAbs;
                this.els.feedbackText.textContent = distanceText;
                this.els.feedbackText.style.color = distanceColor;

                if (this.state.savedFlashRanked) {
                    if (errorPct <= 5) this.triggerFlash('neutral');
                    else this.triggerFlash('error');
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
                this.els.feedbackText.textContent = distanceText;
                this.els.feedbackText.style.color = distanceColor;

                if (this.state.savedFlashSandbox) {
                    if (errorPct <= 5) this.triggerFlash('neutral');
                    else this.triggerFlash('error');
                }

                this.state.roundErrors.push(errorPct);
                this.state.roundCents.push(cents);
                this.state.roundTimes.push(timeTaken);

                if (reelle < 500) this.state.zones.low.push(errorPct);
                else if (reelle < 1000) this.state.zones.mid.push(errorPct);
                else this.state.zones.high.push(errorPct);

                this.state.score++;
                this.els.score.textContent = this.state.score;
            }

            this.els.feedbackText.classList.add('visible');
            this.els.slider.disabled = true;
            this.els.submitBtn.disabled = true;

            setTimeout(() => {
                if (this.state.isActive) {
                    this.generateRound();
                }
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

            this.stopFrequency();
            this.stopPreviewSound();
            this.stopTimer();

            this.state.isShowingSine = false;

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');

                this.els.rankedScore.textContent = this.state.score;

                this.saveScoreToDatabase(this.state.score);

                const precSuffix = this.state.precision > 0 ? `_p${this.state.precision}` : '';
                const recordKey = `abspitch_best_${this.state.gameMode}${precSuffix}`;
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
                } else if (this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }

                const configKey = `abspitch_${this.state.gameMode}${precSuffix}`;
                this.drawDistributionChart(this.state.score, best, configKey);

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');

                if (this.els.sandboxScore) this.els.sandboxScore.textContent = this.state.score;

                if (this.state.roundErrors.length > 0) {
                    const avgE = this.state.roundErrors.reduce((a, b) => a + b, 0) / this.state.roundErrors.length;
                    const avgC = this.state.roundCents.reduce((a, b) => a + b, 0) / this.state.roundCents.length;
                    const avgT = this.state.roundTimes.reduce((a, b) => a + b, 0) / this.state.roundTimes.length;

                    if (this.els.statAvgError) this.els.statAvgError.textContent = `±${avgE.toFixed(1)}%`;
                    if (this.els.statCentOffset) this.els.statCentOffset.textContent = `${avgC > 0 ? '+' : ''}${avgC.toFixed(0)}`;
                    if (this.els.statAvgTime) this.els.statAvgTime.textContent = `${avgT.toFixed(1)}s`;

                    this.renderMatrixStats();
                } else {
                    if (this.els.statAvgError) this.els.statAvgError.textContent = `--`;
                    if (this.els.statCentOffset) this.els.statCentOffset.textContent = `--`;
                    if (this.els.statAvgTime) this.els.statAvgTime.textContent = `--`;
                    if (this.els.matrixStats) this.els.matrixStats.innerHTML = '';
                }

                if (this.els.sandboxFinalTime) {
                    const m = Math.floor(this.state.sessionTime / 60);
                    const s = this.state.sessionTime % 60;
                    this.els.sandboxFinalTime.textContent = m > 0 ? `${m}m ${s}s` : `${s}s`;
                }

                if (this.els.newRecordMsg) {
                    this.els.newRecordMsg.style.visibility = 'hidden';
                    this.els.newRecordMsg.style.opacity = '0';
                }
            }

            this.toggleOverlay(this.els.overlayOver, true);
            this.els.slider.disabled = true;
            this.els.submitBtn.disabled = true;
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';

                        const precSuffix = this.state.precision > 0 ? `_p${this.state.precision}` : '';
            this.preloadDistributionData(`abspitch_${this.state.gameMode}${precSuffix}`);
        },

        renderMatrixStats() {
            if (!this.els.matrixStats) return;

            const getAvg = arr => arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) + '%' : '--';

            this.els.matrixStats.innerHTML = `
                <div class="matrix-item">
                    <span class="matrix-label">Graves (<500Hz)</span>
                    <span class="matrix-val">±${getAvg(this.state.zones.low)}</span>
                </div>
                <div class="matrix-item">
                    <span class="matrix-label">Moyennes</span>
                    <span class="matrix-val">±${getAvg(this.state.zones.mid)}</span>
                </div>
                <div class="matrix-item">
                    <span class="matrix-label">Aigus (>1k)</span>
                    <span class="matrix-val">±${getAvg(this.state.zones.high)}</span>
                </div>
            `;
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
            const precSuffix = this.state.precision > 0 ? `_p${this.state.precision}` : '';
            const gameId = `absolute_pitch${precSuffix}`;
            try {
                fetch('/api/scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_id: gameId, score: score, details: {}, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score) {
            try {
                const precSuffix = this.state.precision > 0 ? `_p${this.state.precision}` : '';
                fetch('/api/best', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `abspitch_${this.state.gameMode}${precSuffix}`, score: score, details: {}, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec DB:", error); }
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
            if (!this.state.distributionDataByConfig) this.state.distributionDataByConfig = {};
            if (!this.state.distributionDataByConfig[configKey]) this.state.distributionDataByConfig[configKey] = [];


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
            if (bestScore !== null) {
                bestPercent = clamp(((bestScore - minX) / range) * 100, 0, 100);
            }

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
                        ${currentScore}<span style="font-size: 0.65em; margin-left: 1px;">rnds</span>
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
            const distKey = configKey || `abspitch_${this.state.gameMode}_p${this.state.precision}`;
            try {
                const res = await fetch(`/api/scores/distribution/${distKey}`, {
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
                this.els.settingsGroupRanked.style.display = 'block';
                this.els.settingsGroupSandbox.style.display = 'none';
            } else {
                this.els.settingsGroupRanked.style.display = 'none';
                this.els.settingsGroupSandbox.style.display = 'block';
            }
        },

        restoreSettingsUI() {
            const c = this.els.config;
            if (this.els.precisionSelect) this.els.precisionSelect.value = this.state.precision;
            c.flashRanked.checked = this.state.savedFlashRanked;
            c.minHz.value = this.state.savedMinHz;
            c.maxHz.value = this.state.savedMaxHz;
            c.flashSandbox.checked = this.state.savedFlashSandbox;

            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if (activeRadio) activeRadio.checked = true;

            this.updateSettingsView(this.state.gameMode);
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
            const isHidden = panel.classList.contains('panel-hidden');

            if (forceClose || !isHidden) {
                this.restoreSettingsUI();
                panel.classList.remove('panel-visible');
                panel.classList.add('panel-hidden');
                panel.setAttribute('aria-hidden', 'true');
                panel.inert = true;
            } else {
                this.restoreSettingsUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');
                panel.setAttribute('aria-hidden', 'false');
                panel.inert = false;
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
                    this.setPreStartState(true);
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

            const startInteraction = () => {
                if (els.slider.disabled || this.state.isPlayingAudio) return;
                const val = parseInt(els.slider.value, 10);
                if (val > 0) {
                    this.startPreviewSound(this.logSliderToHz(val));
                }
            };
            const endInteraction = () => {
                this.stopPreviewSound();
            };

            els.slider.addEventListener('mousedown', startInteraction);
            els.slider.addEventListener('touchstart', startInteraction, { passive: true });
            els.slider.addEventListener('mouseup', endInteraction);
            els.slider.addEventListener('touchend', endInteraction);
            els.slider.addEventListener('touchcancel', endInteraction);

            els.sliderWrapper.addEventListener('click', (e) => {
                if (e.target !== els.submitBtn && !els.slider.disabled) {
                    els.slider.focus();
                }
            });

            els.slider.addEventListener('focus', () => els.sliderWrapper.classList.add('focused'));
            els.slider.addEventListener('blur', () => els.sliderWrapper.classList.remove('focused'));

            els.slider.addEventListener('input', () => {
                this.updateSliderDisplay();
                const val = parseInt(els.slider.value, 10);

                if (val === 0) {
                    this.stopPreviewSound();
                } else if (!els.slider.disabled && !this.state.isPlayingAudio) {
                    const hz = this.logSliderToHz(val);
                    if (!this.state.previewOsc) {
                        this.startPreviewSound(hz);
                    } else {
                        this.updatePreviewSound(hz);
                    }
                }
            });

            els.replayBtn.addEventListener('click', () => {
                this.triggerAudioForRound();
            });

            els.submitBtn.addEventListener('click', () => {
                this.checkInput();
            });

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const isOverVisible = this.els.overlayOver.classList.contains('visible');

                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();

                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }

                if (e.code === 'Enter' || e.code === 'Space') {
                    if (isMenuOpen) {
                        e.preventDefault();
                        els.saveSettings.click();
                    }
                    else if (isOverVisible) {
                        e.preventDefault();
                        els.restartBtn.click();
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

            els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(err => console.error(err));
                    if (this.els.settingsPanel.classList.contains('panel-hidden')) this.toggleSettings();
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

                if (this.els.precisionSelect) {
                    this.state.precision = parseInt(this.els.precisionSelect.value, 10);
                    localStorage.setItem('abspitch_precision', this.state.precision);
                }

                localStorage.setItem('abspitch_flash_ranked', c.flashRanked.checked);
                this.state.savedFlashRanked = c.flashRanked.checked;

                localStorage.setItem('abspitch_min_sandbox', c.minHz.value);
                localStorage.setItem('abspitch_max_sandbox', c.maxHz.value);
                localStorage.setItem('abspitch_flash_sandbox', c.flashSandbox.checked);

                this.state.savedMinHz = parseInt(c.minHz.value) || 200;
                this.state.savedMaxHz = parseInt(c.maxHz.value) || 2000;
                this.state.savedFlashSandbox = c.flashSandbox.checked;

                this.toggleSettings(true);

                if (this.state.gameMode === 'sandbox') {
                    this.setPreStartState(true);
                    this.startGame();
                } else {
                    this.setPreStartState();
                }

                const precSuffix = this.state.precision > 0 ? `_p${this.state.precision}` : '';
                const configKey = `abspitch_${this.state.gameMode}${precSuffix}`;
                this.preloadDistributionData(configKey);
            });

            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel.contains(e.target) || els.settingsToggle.contains(e.target);

                if (isMenuOpen && !clickedInside) {
                    this.toggleSettings(true);
                }

                if (!isMenuOpen && !e.target.closest('button') && !e.target.closest('a')) {
                    if (this.state.currentState === 'PRE_START') {
                        this.startGame();
                    } else if (this.state.isActive && !this.state.isPlayingAudio && e.target !== els.slider) {
                        els.slider.focus();
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

    AbsolutePitch.init();
});