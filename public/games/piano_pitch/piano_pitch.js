

const piano_pitchTranslations = {
    fr: {
        header_title: "OREILLE ABSOLUE PIANO",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            ranked_desc: "Trouvez la note jouée. Chaque erreur réduit votre vie.",
            sandbox_desc: "Entraînez-vous sans limite de vie.",
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
            score: "Notes devinées",
            sandbox_score: "Notes jouées",
            accuracy: "Précision",
            sandbox_time: "Temps total :",
            replay: "REJOUER"
        }
    },
    en: {
        header_title: "PIANO PERFECT PITCH",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            ranked_desc: "Identify the played note. Each error reduces your health.",
            sandbox_desc: "Practice without health limits.",
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
            score: "Guessed Notes",
            sandbox_score: "Played Notes",
            accuracy: "Accuracy",
            sandbox_time: "Total time:",
            replay: "PLAY AGAIN"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.piano_pitch = piano_pitchTranslations.fr;
    translations.en.piano_pitch = piano_pitchTranslations.en;
}

function getGameText(key) {
    const savedLang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, piano_pitchTranslations[savedLang])
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, piano_pitchTranslations['en']);
}


document.addEventListener('DOMContentLoaded', () => {

    const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    const PianoPitch = {
        state: {
            gameMode: 'ranked',
            score: 0,
            health: 3,
            maxHealth: 3,
            currentNoteIndex: 0, 
            currentOctave: 4,

            isActive: false,
            isPlayingAudio: false,
            audioCtx: null,

            timerId: null,
            sessionTime: 0,

            roundErrors: 0,
            roundsPlayed: 0,

            savedFlashRanked: true,
            savedFlashSandbox: true,
            savedFlashSandbox: true,
            distributionDataByConfig: {}
        },

        els: {
            visualizerDisplay: document.getElementById('visualizer-display'),
            audioWave: document.getElementById('audio-wave'),
            replayBtn: document.getElementById('replay-btn'),
            feedbackText: document.getElementById('feedback-text'),
            statusOverlay: document.getElementById('status-overlay'),

            keysContainer: document.querySelector('.keys-container'),
            keyboardWrapper: document.getElementById('keyboard-wrapper'),
            keyBtns: document.querySelectorAll('.key-btn'),

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
            statAccuracy: document.getElementById('stat-accuracy'),
            statAvgTime: document.getElementById('stat-avg-time'),
            sandboxFinalTime: document.getElementById('sandbox-final-time'),

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

                        this.preloadDistributionData('piano_pitch_ranked');
        },

        bindEvents() {
            this.els.statusOverlay.addEventListener('click', () => this.startGame());
            this.els.ingameRestartBtn.addEventListener('click', () => {
                if (confirm("Voulez-vous vraiment recommencer ?")) this.startGame();
            });
            this.els.restartBtn.addEventListener('click', () => {
                this.toggleOverlay(this.els.overlayOver, false);
                this.startGame();
            });

            this.els.replayBtn.addEventListener('click', () => {
                if (this.state.isActive) {
                    this.playCurrentNote();
                }
            });

            this.els.keyBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const note = parseInt(e.target.dataset.note);
                    this.checkInput(note);
                });
            });


                        this.els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(err => console.error(err));
                    if (this.els.settingsPanel.classList.contains('panel-hidden')) this.toggleSettings();
                } else {
                    this.toggleSettings();
                }
            });
            this.els.closeSettings.addEventListener('click', () => this.closeSettings());
            this.els.saveSettings.addEventListener('click', () => this.saveSettings());

            this.els.modeToggleRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    if (e.target.value === 'ranked') {
                        this.els.settingsGroupRanked.style.display = 'block';
                        this.els.settingsGroupSandbox.style.display = 'none';
                    } else {
                        this.els.settingsGroupRanked.style.display = 'none';
                        this.els.settingsGroupSandbox.style.display = 'block';
                    }
                });
            });


                        this.els.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
            document.addEventListener('fullscreenchange', () => this.updateFullscreenIcon());
            document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenIcon());

            const exitOverlayFsBtn = document.getElementById('exit-fullscreen-overlay-btn');
            if (exitOverlayFsBtn) exitOverlayFsBtn.addEventListener('click', () => this.exitFullscreen());

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
                        this.els.saveSettings.click();
                    }
                    else if (isOverVisible) {
                        e.preventDefault();
                        this.els.restartBtn.click();
                    }
                    else if (!this.state.isActive) {
                        e.preventDefault();
                        this.startGame();
                    }
                }
            });

            this.els.board.addEventListener('click', (e) => {
                const isStartScreen = !this.els.statusOverlay.classList.contains('hidden');
                if (isStartScreen && !e.target.closest('button')) {
                    this.startGame();
                }
            });
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

        playCurrentNote() {
            this.initAudio();


                        const midiNote = (this.state.currentOctave + 1) * 12 + this.state.currentNoteIndex;
            const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);

            this.playSynthesizedPiano(frequency);
        },

        playSynthesizedPiano(frequency) {
            const ctx = this.state.audioCtx;
            const now = ctx.currentTime;

            const saved = localStorage.getItem('siteGlobalVolume');
            let volMod = saved !== null ? parseInt(saved, 10) / 100 : 0.5;
            if (volMod < 0.1) volMod = 0.1;


                        volMod = volMod * 0.3;

            const gainNode = ctx.createGain();
            gainNode.connect(ctx.destination);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(volMod, now + 0.02); 
            gainNode.gain.exponentialRampToValueAtTime(volMod * 0.3, now + 0.3); 
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.0); 

            const osc1 = ctx.createOscillator();
            osc1.type = 'triangle';
            osc1.frequency.value = frequency;
            osc1.connect(gainNode);

            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = frequency * 2;
            const gain2 = ctx.createGain();
            gain2.gain.value = 0.2;
            osc2.connect(gain2);
            gain2.connect(gainNode);

            osc1.start(now);
            osc2.start(now);

            osc1.stop(now + 2.1);
            osc2.stop(now + 2.1);

            this.state.isPlayingAudio = true;
            this.els.audioWave.classList.add('playing');

            setTimeout(() => {
                this.state.isPlayingAudio = false;
                this.els.audioWave.classList.remove('playing');
            }, 500); 
        },


                loadUserPreferences() {
            const c = this.els.config;

            const savedFlashR = localStorage.getItem('pianopitch_flash_ranked');
            if (savedFlashR !== null) {
                const isTrue = (savedFlashR === 'true');
                if(c.flashRanked) c.flashRanked.checked = isTrue;
                this.state.savedFlashRanked = isTrue;
            }

            const savedFlashS = localStorage.getItem('pianopitch_flash_sandbox');
            if (savedFlashS !== null) {
                const isTrue = (savedFlashS === 'true');
                if(c.flashSandbox) c.flashSandbox.checked = isTrue;
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
            this.toggleOverlay(this.els.overlayOver, false);

            this.stopTimer();

            this.state.sessionTime = 0;
            this.state.roundErrors = 0;
            this.state.roundsPlayed = 0;
            this.updateTimerUI();

            if (isAutoStart) {
                this.els.statusOverlay.classList.add('hidden');
                this.els.keysContainer.classList.remove('disabled');
                this.els.keyboardWrapper.classList.remove('blurred');
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
                this.els.keysContainer.classList.add('disabled');
                this.els.keyboardWrapper.classList.add('blurred');
            }

            this.els.score.textContent = "0";
            this.state.health = this.state.maxHealth;
            this.updateHealthUI();

            this.els.feedbackText.classList.remove('visible');
            this.els.replayBtn.style.display = 'none';
            this.els.ingameRestartBtn.style.display = 'none';
        },

        startGame() {
            this.initAudio();
            this.state.score = 0;
            this.state.health = this.state.maxHealth;
            this.state.isActive = true;
            this.state.roundErrors = 0;
            this.state.roundsPlayed = 0;

            this.els.statusOverlay.classList.add('hidden');
            this.els.keysContainer.classList.remove('disabled');
            this.els.keyboardWrapper.classList.remove('blurred');

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

            this.state.currentNoteIndex = Math.floor(Math.random() * 12);
            this.state.currentOctave = Math.floor(Math.random() * 2) + 3; 

            this.els.feedbackText.classList.remove('visible');
            this.els.replayBtn.style.display = 'inline-block';
            this.els.keysContainer.classList.remove('disabled');

            setTimeout(() => {
                this.playCurrentNote();
            }, 300);
        },

        checkInput(guessedNoteIndex) {
            if (!this.state.isActive) return;

            this.els.keysContainer.classList.add('disabled');
            this.els.replayBtn.style.display = 'none';

            this.state.roundsPlayed++;

            const isCorrect = (guessedNoteIndex === this.state.currentNoteIndex);

            this.els.feedbackText.classList.remove('visible');
            void this.els.feedbackText.offsetWidth;

            if (isCorrect) {
                this.els.feedbackText.textContent = "Correct !";
                this.els.feedbackText.style.color = "var(--accent-color)";

                if (this.state.gameMode === 'ranked' && this.state.savedFlashRanked) {
                    this.triggerFlash('success');
                } else if (this.state.gameMode === 'sandbox' && this.state.savedFlashSandbox) {
                    this.triggerFlash('success');
                }

                this.state.score++;
                this.els.score.textContent = this.state.score;
            } else {
                const correctNoteName = NOTES[this.state.currentNoteIndex];
                this.els.feedbackText.textContent = `Faux (${correctNoteName})`;
                this.els.feedbackText.style.color = "var(--accent-color-secondary)";

                this.state.roundErrors++;

                if (this.state.gameMode === 'ranked' && this.state.savedFlashRanked) {
                    this.triggerFlash('error');
                } else if (this.state.gameMode === 'sandbox' && this.state.savedFlashSandbox) {
                    this.triggerFlash('error');
                }

                if (this.state.gameMode === 'ranked') {
                    this.state.health--;
                    this.updateHealthUI();

                    if (this.state.health <= 0) {
                        this.els.feedbackText.classList.add('visible');
                        setTimeout(() => this.endGame(), 1000);
                        return;
                    }
                }
            }

            this.els.feedbackText.classList.add('visible');

            setTimeout(() => {
                if (this.state.isActive) {
                    this.generateRound();
                }
            }, 1000);
        },

        triggerFlash(type) {
            this.els.board.classList.remove('flash-overlay', 'flash-success', 'flash-error', 'flash-neutral');
            void this.els.board.offsetWidth;
            this.els.board.classList.add('flash-overlay', `flash-${type}`);
        },

        endGame() {
            this.state.isActive = false;
            this.stopTimer();

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');

                this.els.rankedScore.textContent = this.state.score;

                this.saveScoreToDatabase(this.state.score);

                const recordKey = `pianopitch_best_ranked`;
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

                this.drawDistributionChart(this.state.score, best, 'piano_pitch_ranked');
                this.preloadDistributionData('piano_pitch_ranked');
            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');

                this.els.sandboxScore.textContent = this.state.roundsPlayed;

                const accuracy = this.state.roundsPlayed > 0 ? Math.round(((this.state.roundsPlayed - this.state.roundErrors) / this.state.roundsPlayed) * 100) : 0;
                if(this.els.statAccuracy) this.els.statAccuracy.textContent = `${accuracy}%`;

                const avgTime = this.state.roundsPlayed > 0 ? (this.state.sessionTime / this.state.roundsPlayed).toFixed(1) : 0;
                if (this.els.statAvgTime) this.els.statAvgTime.textContent = `${avgTime}s`;

                const m = Math.floor(this.state.sessionTime / 60);
                const s = this.state.sessionTime % 60;
                if(this.els.sandboxFinalTime) this.els.sandboxFinalTime.textContent = m > 0 ? `${m}m ${s}s` : `${s}s`;
            }

            this.els.keysContainer.classList.add('disabled');
            this.els.keyboardWrapper.classList.add('blurred');
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
                    body: JSON.stringify({ game_id: 'piano_pitch', score: score, details: {}, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score) {
            try {
                fetch('/api/best', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `pianopitch_ranked`, score: score, details: {}, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec DB:", error); }
        },

        async preloadDistributionData(configKey) {
            if (!configKey) configKey = 'piano_pitch_ranked';
            try {
                const res = await fetch(`/api/scores/distribution/piano_pitch`, {
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
                for (let i = 0; i < MAX_POINTS; i++) sampled.push(scores[Math.floor(i * step)]);
                if (sampled[sampled.length - 1] !== scores[scores.length - 1]) sampled.push(scores[scores.length - 1]);
                scores = sampled;
            }

            const n = scores.length;
            const mean = scores.reduce((a, b) => a + b, 0) / n;
            let stdDev = Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n) || 1;
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
            if (bestScore !== null) bestPercent = clamp(((bestScore - minX) / range) * 100, 0, 100);

            let markerBest = distributionContainer.querySelector('.marker-best');
            let markerCurrent = distributionContainer.querySelector('.marker-current');
            if (!markerBest || !markerCurrent) return;

            let currentOffset = 5;
            if (bestPercent !== null && Math.abs(currentPercent - bestPercent) < 8) currentOffset = 30;

            if (bestScore !== null && currentScore === bestScore) {
                markerCurrent.style.display = 'none';
            } else if (currentScore !== null) {
                markerCurrent.style.display = 'block';
                markerCurrent.style.left = `${currentPercent}%`;
                markerCurrent.innerHTML = `
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">
                        ${currentScore}
                    </div>
                `;
            } else {
                markerCurrent.style.display = 'none';
            }

            if (bestScore !== null) {
                markerBest.classList.remove('hidden');
                markerBest.style.left = `${bestPercent}%`;
                markerBest.innerHTML = `
                    <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);">
                        <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/></svg>
                    </div>
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">
                        ${bestScore}
                    </div>
                `;
            } else {
                markerBest.classList.add('hidden');
            }

            const tooltip = distributionContainer.querySelector('.chart-tooltip');
            const hoverLine = distributionContainer.querySelector('.hover-line');

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


                toggleOverlay(overlay, show) {
            if (show) {
                overlay.classList.remove('hidden');
                overlay.style.display = 'flex';
                setTimeout(() => overlay.classList.add('visible'), 10);
            } else {
                overlay.classList.remove('visible');
                setTimeout(() => {
                    overlay.classList.add('hidden');
                    overlay.style.display = '';
                }, 300);
            }
        },

        toggleSettings(forceClose = false) {
            const isHidden = this.els.settingsPanel.classList.contains('panel-hidden');
            if (!isHidden || forceClose) {
                this.closeSettings();
            } else {
                this.openSettings();
            }
        },

        openSettings() {

                        const radio = Array.from(this.els.modeToggleRadios).find(r => r.value === this.state.gameMode);
            if (radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }

            if(this.els.config.flashRanked) this.els.config.flashRanked.checked = this.state.savedFlashRanked;
            if(this.els.config.flashSandbox) this.els.config.flashSandbox.checked = this.state.savedFlashSandbox;

            this.els.settingsPanel.classList.remove('panel-hidden');
            this.els.settingsPanel.setAttribute('aria-hidden', 'false');
        },

        closeSettings() {
            this.els.settingsPanel.classList.add('panel-hidden');
            this.els.settingsPanel.setAttribute('aria-hidden', 'true');
        },

        saveSettings() {
            const newMode = Array.from(this.els.modeToggleRadios).find(r => r.checked).value;
            this.state.gameMode = newMode;

            const url = new URL(window.location);
            url.searchParams.set('mode', newMode);
            window.history.pushState({}, '', url);

            if(this.els.config.flashRanked) {
                this.state.savedFlashRanked = this.els.config.flashRanked.checked;
                localStorage.setItem('pianopitch_flash_ranked', this.state.savedFlashRanked);
            }

            if(this.els.config.flashSandbox) {
                this.state.savedFlashSandbox = this.els.config.flashSandbox.checked;
                localStorage.setItem('pianopitch_flash_sandbox', this.state.savedFlashSandbox);
            }

                        this.preloadDistributionData();
            this.closeSettings();

            if (this.state.gameMode === 'sandbox') {
                this.setPreStartState(true);
                this.startGame();
            } else {
                this.setPreStartState();
            }
        },


                toggleFullscreen() {
            const elem = this.els.board;
            const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || elem.classList.contains('ios-fullscreen');

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
                    } else {
                        this.enableFallbackFullscreen();
                    }
                }
            } else {
                this.exitFullscreen();
            }
        },

        exitFullscreen() {
            if (document.exitFullscreen && document.fullscreenElement) {
                document.exitFullscreen().catch(err => console.error(err));
            } else if (document.webkitExitFullscreen && document.webkitFullscreenElement) {
                document.webkitExitFullscreen();
            }

            this.els.board.classList.remove('ios-fullscreen');
            this.updateFullscreenIcon();
        },

        enableFallbackFullscreen() {
            this.els.board.classList.add('ios-fullscreen');
            this.updateFullscreenIcon();
        },

        updateFullscreenIcon() {
            const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || this.els.board.classList.contains('ios-fullscreen'));

            if (isFs) {
                this.els.iconExpand.classList.add('hidden');
                this.els.iconCompress.classList.remove('hidden');
            } else {
                this.els.iconExpand.classList.remove('hidden');
                this.els.iconCompress.classList.add('hidden');
            }
        }
    };

    PianoPitch.init();
});