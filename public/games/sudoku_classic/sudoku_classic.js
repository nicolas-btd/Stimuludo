
const sudokuTranslations = {
    fr: {
        header_title: "SUDOKU",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            options_title: "Partie",
            size: "Taille :",
            difficulty: "Difficulté :",
            easy: "Facile",
            medium: "Moyen",
            hard: "Difficile",
            mistakes: "Vies :",
            mistakes_hint: "0 = Vies infinies.",
            ranked_hint: "Mode classé : 3 vies.",
            show_hundredths: "Afficher les centièmes",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: { 
            mistakes: "ERR.",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer" 
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            success: "SUCCÈS !",
            fail: "ÉCHEC",
            difficulty: "Difficulté :",
            time: "Temps",
            best: "Meilleur",
            you: "Vous",
            top: "TOP",
            avg_time: "Temps Moyen",
            fastest: "Plus rapide",
            slowest: "Plus lent",
            retry: "Nouvelle Partie"
        }
    },
    en: {
        header_title: "SUDOKU",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            options_title: "Game",
            size: "Size:",
            difficulty: "Difficulty:",
            easy: "Easy",
            medium: "Medium",
            hard: "Hard",
            mistakes: "Lives:",
            mistakes_hint: "0 = Infinite lives.",
            ranked_hint: "Ranked mode: 3 lives.",
            show_hundredths: "Show hundredths",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: { 
            mistakes: "ERR.",
            ready: "Ready?",
            or: "or",
            to_start: "to start" 
        },
        results: {
            new_record: "NEW RECORD!",
            success: "SUCCESS!",
            fail: "GAME OVER",
            difficulty: "Difficulty:",
            time: "Time",
            best: "Best",
            you: "You",
            top: "TOP",
            avg_time: "Avg Time",
            fastest: "Fastest",
            slowest: "Slowest",
            retry: "New Game"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.sudoku = sudokuTranslations.fr;
    translations.en.sudoku = sudokuTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, sudokuTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, sudokuTranslations['en']);
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

                        gain.gain.setValueAtTime(0.08 * volMod, t);
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

                        gain.gain.setValueAtTime(0.5 * volMod, t);
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

                        gain.gain.setValueAtTime(0.08 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

                        osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.3);
        }
    };


        const SudokuGame = {
        state: {
            gameMode: 'ranked',
            currentState: 'PRE_START',
            isGameRunning: false, 
            isPaused: false,

                        size: 9,
            difficulty: 'medium',
            maxMistakes: 3,

                        grid: [],     
            fixed: [],    
            userGrid: [], 

                        mistakes: 0,
            timer: 0,
            timerInterval: null,
            lastTime: 0,

                        selectedCell: null,
            tempBuffer: "", 

                        savedRankedSize: "9",
            savedRankedDiff: "easy",
            savedShowHundredths: false,
            savedSandboxConfig: {},
            distributionDataByConfig: {}
        },

        els: {
            board: document.querySelector('.game-board'),
            overlayOver: document.getElementById('game-over-overlay'),
            statusOverlay: document.getElementById('status-overlay'),

                        restartBtn: document.getElementById('restart-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'),

                        settingsToggle: document.getElementById('settings-toggle'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),
            settingsPanel: document.getElementById('settings-panel'),

                        settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
            modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),

            gridWrapper: document.querySelector('.grid-wrapper'),
            gridContainer: document.getElementById('grid-container'),
            livesContainer: document.getElementById('lives-container'),
            timerDisp: document.getElementById('game-timer'),

                        pauseBtn: document.getElementById('pause-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            icons: {
                pause: document.getElementById('icon-pause'),
                play: document.getElementById('icon-play'),
                expand: document.getElementById('icon-expand'),
                compress: document.getElementById('icon-compress')
            },

                        viewRanked: document.getElementById('results-ranked'),
            viewSandbox: document.getElementById('results-sandbox'),

            results: {
                titleRanked: document.getElementById('result-title-ranked'),
                titleSandbox: document.getElementById('result-title-sandbox'),
                rankedTime: document.getElementById('ranked-time'),
                sandboxTime: document.getElementById('sandbox-time'),
                newRec: document.getElementById('new-record-msg'),
                markerCurrent: document.getElementById('marker-current'),
                markerBest: document.getElementById('marker-best'),
                statDiff: document.getElementById('stat-difficulty'),
                statMistakes: document.getElementById('stat-mistakes')
            },
            inputs: {
                rankedSize: document.getElementById('ranked-size-val'),
                rankedDiff: document.getElementById('ranked-difficulty-val'),
                sandboxSize: document.getElementById('sandbox-size-val'),
                sandboxDiff: document.getElementById('sandbox-difficulty-val'),
                sandboxMistakes: document.getElementById('sandbox-mistakes-val'),
                showHundredths: document.getElementById('show-hundredths-val')
            },
            hiddenInput: null
        },

        init() {
            this.els.hiddenInput = document.createElement('input');
            this.els.hiddenInput.type = 'tel'; 
            this.els.hiddenInput.id = 'hidden-numpad';
            this.els.hiddenInput.style.cssText = 'position: absolute; opacity: 0.01; width: 1px; height: 1px; z-index: -1; font-size: 16px; padding: 0; border: none; pointer-events: none; color: transparent; background: transparent;';
            this.els.board.appendChild(this.els.hiddenInput);

            this.els.hiddenInput.addEventListener('input', (e) => {
                if (this.state.isPaused || !this.state.isGameRunning) return;
                const val = this.els.hiddenInput.value;

                                if (val.length > 1) {
                    const lastChar = val.slice(-1);
                    if (/[0-9]/.test(lastChar)) {
                        this.handleInputDigit(lastChar);
                    }
                } else if (val.length === 0) {
                    this.handleBackspace();
                }

                                this.els.hiddenInput.value = ' ';
            });

            this.els.hiddenInput.addEventListener('keydown', (e) => {
                if (!this.state.isGameRunning || this.state.isPaused) return;

                const azertyMap = { 
                    '&': '1', 'é': '2', '"': '3', "'": '4', '(': '5', 
                    '-': '6', '§': '6', 
                    'è': '7', 
                    '_': '8', '!': '8', 
                    'ç': '9', 
                    'à': '0', '@': '0', '°': '0' 
                };

                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.commitInput();
                } else if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'z', 'q', 's', 'd', 'w', 'a'].includes(e.key.toLowerCase())) {
                    e.preventDefault();
                    const key = e.key.toLowerCase();
                    this.moveSelection(
                        (key === 'arrowdown' || key === 's') ? 1 : (key === 'arrowup' || key === 'w' || key === 'z') ? -1 : 0,
                        (key === 'arrowright' || key === 'd') ? 1 : (key === 'arrowleft' || key === 'q' || key === 'a') ? -1 : 0
                    );
                } else if (azertyMap[e.key]) {
                    e.preventDefault();
                    this.handleInputDigit(azertyMap[e.key]);
                }
            });

            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('config')) {
                this.state.savedConfigRanked = params.get('config');
            }

            this.loadUserPreferences();
            this.loadBackgroundPreference();
            this.bindEvents();

                        if (this.els.results.newRec && this.els.viewRanked) {
                this.els.viewRanked.insertBefore(this.els.results.newRec, this.els.viewRanked.firstChild);
                this.els.results.newRec.style.minHeight = '24px';
                this.els.results.newRec.style.marginTop = '0px';
                this.els.results.newRec.style.marginBottom = '15px';
                this.els.results.newRec.style.width = '100%';
                this.els.results.newRec.style.textAlign = 'center';
                this.els.results.newRec.classList.remove('hidden');
                this.els.results.newRec.style.visibility = 'hidden';
                this.els.results.newRec.style.opacity = '0';
                this.els.results.newRec.style.transition = 'opacity 0.3s ease';
            }

            if (this.state.gameMode === 'sandbox') {
                this.els.statusOverlay.classList.add('hidden');
                this.els.gridWrapper.classList.remove('blurred');
                this.startGame();
            } else {
                this.setPreStartState();
            }
            const initKey = `${this.state.savedRankedSize}_${this.state.savedRankedDiff}`;
            this.preloadDistributionData(initKey);
        },

        loadUserPreferences() {
            const c = this.els.inputs;

                        const savedSizeR = localStorage.getItem('sudoku_ranked_size');
            if (savedSizeR !== null) {
                if(c.rankedSize) c.rankedSize.value = savedSizeR;
                this.state.savedRankedSize = savedSizeR;
            } else {
                this.state.savedRankedSize = "9";
            }

            const savedDiffR = localStorage.getItem('sudoku_ranked_diff');
            if (savedDiffR !== null) {
                if(c.rankedDiff) c.rankedDiff.value = savedDiffR;
                this.state.savedRankedDiff = savedDiffR;
            } else {
                this.state.savedRankedDiff = "easy";
            }

            const sSizeS = localStorage.getItem('sudoku_sandbox_size');
            if (sSizeS !== null && c.sandboxSize) c.sandboxSize.value = sSizeS;

            const sDiffS = localStorage.getItem('sudoku_sandbox_diff');
            if (sDiffS !== null && c.sandboxDiff) c.sandboxDiff.value = sDiffS;

            const sMistakesS = localStorage.getItem('sudoku_sandbox_mistakes');
            if (sMistakesS !== null && c.sandboxMistakes) c.sandboxMistakes.value = sMistakesS;

            const savedHund = localStorage.getItem('sudoku_show_hundredths');
            if (savedHund !== null) {
                this.state.savedShowHundredths = savedHund === 'true';
            } else {
                this.state.savedShowHundredths = false;
            }
            if (c.showHundredths) c.showHundredths.checked = this.state.savedShowHundredths;
            this.saveSandboxConfigSnapshot();
        },

        saveSandboxConfigSnapshot() {
            const c = this.els.inputs;
            this.state.savedSandboxConfig = {
                size: c.sandboxSize ? c.sandboxSize.value : "9",
                difficulty: c.sandboxDiff ? c.sandboxDiff.value : "easy",
                mistakes: c.sandboxMistakes ? c.sandboxMistakes.value : "0"
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
            this.stopTimer(); 
            this.state.isActive = false;
            this.state.isGameRunning = false;
            this.state.currentState = 'PRE_START';
            this.toggleOverlay(this.els.overlayOver, false);

                        this.state.size = parseInt(this.state.savedRankedSize);
            this.generateOptimizedLevel();
            this.renderGrid();

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

            this.state.maxMistakes = 3;
            this.state.mistakes = 0;
            this.state.timer = 0;

            window.LivesManager.setup(this.els.livesContainer, this.state.maxMistakes, this.state.maxMistakes);
            this.updateStatsUI(); 
        },

        toggleOverlay(el, show) {
            if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
            else { el.classList.remove('visible'); el.classList.add('hidden'); }
        },

        bindEvents() {
            const handleSafeClick = (e, callback) => {
                if (e.detail === 0) return; 
                if (e.target) e.target.blur(); 
                callback();
            };

            this.els.modeToggleRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.updateSettingsView(e.target.value);
                });
            });

            this.els.restartBtn.addEventListener('click', (e) => handleSafeClick(e, () => {
                this.toggleOverlay(this.els.overlayOver, false);
                if (this.state.gameMode === 'sandbox') {
                    this.startGame();
                } else {
                    this.setPreStartState();
                }
            }));

            if (this.els.ingameRestartBtn) {
                this.els.ingameRestartBtn.addEventListener('click', (e) => handleSafeClick(e, () => {
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') {
                        this.startGame();
                    } else {
                        this.setPreStartState();
                    }
                }));
            }

            this.els.pauseBtn.addEventListener('click', (e) => handleSafeClick(e, () => this.togglePause()));
            this.els.fullscreenBtn.addEventListener('click', (e) => handleSafeClick(e, () => this.toggleFullscreen()));
            document.addEventListener('fullscreenchange', () => this.updateFullscreenIcon());

            this.els.settingsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.els.settingsToggle.blur();
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(e=>console.error(e));
                    if (this.els.settingsPanel.classList.contains('panel-hidden')) this.toggleSettings();
                } else {
                    this.toggleSettings();
                }
            });

            this.els.closeSettings.addEventListener('click', () => { this.els.closeSettings.blur(); this.toggleSettings(true); });

            this.els.saveSettings.addEventListener('click', (e) => {
                if (this.els.settingsPanel.classList.contains('panel-hidden')) return;

                this.els.saveSettings.blur();
                const c = this.els.inputs;
                const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;
                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);

                if(c.rankedSize) {
                    localStorage.setItem('sudoku_ranked_size', c.rankedSize.value);
                    this.state.savedRankedSize = c.rankedSize.value;
                }
                if(c.rankedDiff) {
                    localStorage.setItem('sudoku_ranked_diff', c.rankedDiff.value);
                    this.state.savedRankedDiff = c.rankedDiff.value;
                }

                if(c.sandboxSize) localStorage.setItem('sudoku_sandbox_size', c.sandboxSize.value);
                if(c.sandboxDiff) localStorage.setItem('sudoku_sandbox_diff', c.sandboxDiff.value);
                if(c.sandboxMistakes) localStorage.setItem('sudoku_sandbox_mistakes', c.sandboxMistakes.value);

                                if(c.showHundredths) {
                    localStorage.setItem('sudoku_show_hundredths', c.showHundredths.checked);
                    this.state.savedShowHundredths = c.showHundredths.checked;
                }

                this.saveSandboxConfigSnapshot();


                                                const chartKey = `${this.state.savedRankedSize}_${this.state.savedRankedDiff}`;
                this.preloadDistributionData(chartKey);

                                this.els.settingsPanel.classList.remove('panel-visible');
                this.els.settingsPanel.classList.add('panel-hidden');

                                if (this.state.gameMode === 'sandbox') {
                    this.startGame();
                } else {
                    this.setPreStartState();
                }
            });

            document.addEventListener('click', (e) => {
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const clickedInside = this.els.settingsPanel.contains(e.target) || this.els.settingsToggle.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });

            this.els.board.addEventListener('click', (e) => {
                if (this.state.currentState === 'PRE_START' && !e.target.closest('button')) {
                    this.startGame();
                }
            });

            document.addEventListener('keydown', (e) => {
                const isSettingsOpen = this.els.settingsPanel.classList.contains('panel-visible');
                const isGameOver = this.els.overlayOver.classList.contains('visible'); 

                if (e.key.toLowerCase() === 'f') { 
                    this.toggleFullscreen(); 
                    return; 
                }

                if (e.code === 'Space') {
                    e.preventDefault(); 
                    if (this.state.currentState === 'PRE_START') {
                        this.startGame();
                        return;
                    }
                    if (this.state.isGameRunning && !isSettingsOpen && this.state.gameMode === 'sandbox') {
                        this.togglePause();
                    }
                    return;
                }

                                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                    return; 
                }

                if (document.activeElement === this.els.hiddenInput) return;

                                if (e.code === 'Enter') {
                    e.preventDefault();
                    e.stopImmediatePropagation(); 

                    if (document.activeElement && document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }

                    if (isSettingsOpen) {
                        this.els.saveSettings.click();
                        return;
                    }

                    if (this.state.isGameRunning && !this.state.isPaused) {
                        this.commitInput(); 
                        return; 
                    }

                    if (isGameOver) { 
                        this.toggleOverlay(this.els.overlayOver, false);
                        if (this.state.gameMode === 'sandbox') {
                            this.startGame();
                        } else {
                            this.setPreStartState(); 
                        }
                        return; 
                    }

                    if (this.state.currentState === 'PRE_START') {
                        this.startGame();
                        return;
                    }
                }

                if (!this.state.isGameRunning || this.state.isPaused) return;

                let inputNum = null;
                const azertyMap = { '&': '1', 'é': '2', '"': '3', "'": '4', '(': '5', '-': '6', 'è': '7', '_': '8', 'ç': '9', 'à': '0' };

                if (e.code.startsWith('Digit')) {
                    inputNum = e.code.replace('Digit', '');
                } 
                else if (e.code.startsWith('Numpad')) {
                    inputNum = e.code.replace('Numpad', '');
                }
                else if (e.key >= '0' && e.key <= '9') {
                    inputNum = e.key;
                }
                else if (azertyMap[e.key]) {
                    inputNum = azertyMap[e.key];
                }

                if (inputNum !== null && inputNum.length === 1 && inputNum >= '0' && inputNum <= '9') {
                    this.handleInputDigit(inputNum);
                }
                else if (e.key === 'Backspace' || e.key === 'Delete') { this.handleBackspace(); } 
                else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w' || e.key.toLowerCase() === 'z') { e.preventDefault(); this.moveSelection(-1, 0); }
                else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') { e.preventDefault(); this.moveSelection(1, 0); }
                else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a' || e.key.toLowerCase() === 'q') { e.preventDefault(); this.moveSelection(0, -1); }
                else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') { e.preventDefault(); this.moveSelection(0, 1); }
            });

            window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
            });
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

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
            const isMenuOpen = !panel.classList.contains('panel-hidden');

            if (forceClose || isMenuOpen) {
                this.restoreConfigUI();
                panel.classList.remove('panel-visible'); 
                panel.classList.add('panel-hidden');

                                if (this.state.gameMode === 'sandbox' && this.state.isGameRunning && this.state.isPaused) {
                    this.togglePause();
                }
            } else {
                this.restoreConfigUI();
                panel.classList.remove('panel-hidden'); 
                panel.classList.add('panel-visible');

                                if (this.state.gameMode === 'sandbox' && this.state.isGameRunning && !this.state.isPaused) {
                    this.togglePause();
                }
            }
        },

        restoreConfigUI() {
            const c = this.els.inputs;
            if(c.rankedSize) c.rankedSize.value = this.state.savedRankedSize;
            if(c.rankedDiff) c.rankedDiff.value = this.state.savedRankedDiff;

                        const s = this.state.savedSandboxConfig;
            if (s && s.size) {
                if(c.sandboxSize) c.sandboxSize.value = s.size;
                if(c.sandboxDiff) c.sandboxDiff.value = s.difficulty;
                if(c.sandboxMistakes) c.sandboxMistakes.value = s.mistakes;
            }
            if (c.showHundredths) c.showHundredths.checked = this.state.savedShowHundredths;

            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if(activeRadio) activeRadio.checked = true;
            this.updateSettingsView(this.state.gameMode);
        },

        startGame() {
            this.state.isActive = true;
            this.state.currentState = 'PLAYING';
            this.state.isGameRunning = true; 

                        if (this.state.gameMode === 'ranked') {
                this.state.size = parseInt(this.state.savedRankedSize);
                this.state.difficulty = this.state.savedRankedDiff;
                this.state.maxMistakes = 3;
                this.els.pauseBtn.style.display = 'none';
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                const s = this.state.savedSandboxConfig;
                this.state.size = parseInt(s.size);
                this.state.difficulty = s.difficulty;
                this.state.maxMistakes = parseInt(s.mistakes);
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
                this.els.pauseBtn.style.display = 'flex';
                this.els.pauseBtn.style.visibility = 'visible';
            }

            this.state.mistakes = 0;
            this.state.timer = 0;
            this.state.selectedCell = null;
            this.state.tempBuffer = ""; 
            this.state.isPaused = false;

                        window.LivesManager.setup(this.els.livesContainer, this.state.maxMistakes, this.state.maxMistakes);

            this.generateOptimizedLevel();

            this.els.statusOverlay.classList.add('hidden');
            this.els.gridWrapper.classList.remove('blurred');

                        this.renderGrid();
            this.updateStatsUI();
            this.updatePauseIcon();
            this.startTimer();
            this.updateGridVisuals();
        },

        generateOptimizedLevel() {
            const size = this.state.size;
            const boxSize = Math.sqrt(size);

                        const baseGrid = [];
            for (let r = 0; r < size; r++) {
                const row = [];
                for (let c = 0; c < size; c++) {
                    const val = (Math.floor(r / boxSize) + (r % boxSize) * boxSize + c) % size + 1;
                    row.push(val);
                }
                baseGrid.push(row);
            }

            this.shuffleSudoku(baseGrid, size, boxSize);

            this.state.grid = baseGrid;
            this.state.userGrid = this.state.grid.map(row => [...row]);
            this.state.fixed = Array.from({length: size}, () => Array(size).fill(true));

                        let attempts = this.getHolesCount();
            while (attempts > 0) {
                let row = Math.floor(Math.random() * size);
                let col = Math.floor(Math.random() * size);
                if (this.state.userGrid[row][col] !== 0) {
                    this.state.userGrid[row][col] = 0;
                    this.state.fixed[row][col] = false;
                    attempts--;
                }
            }
        },

        shuffleSudoku(grid, size, boxSize) {
            const nums = Array.from({length: size}, (_, i) => i + 1);
            this.shuffleArray(nums);
            for(let r=0; r<size; r++) {
                for(let c=0; c<size; c++) {
                    grid[r][c] = nums[grid[r][c] - 1];
                }
            }

            for (let b = 0; b < size; b += boxSize) {
                const start = b;
                const cols = Array.from({length: boxSize}, (_, i) => start + i);
                this.shuffleArray(cols);
                const originalGrid = grid.map(row => [...row]);
                for(let r=0; r<size; r++) {
                    for(let i=0; i<boxSize; i++) {
                        grid[r][start + i] = originalGrid[r][cols[i]];
                    }
                }
            }

            for (let b = 0; b < size; b += boxSize) {
                const rows = Array.from({length: boxSize}, (_, i) => b + i);
                this.shuffleArray(rows);
                const blockRows = rows.map(rIdx => grid[rIdx]);
                for(let i=0; i<boxSize; i++) {
                    grid[b + i] = blockRows[i];
                }
            }

            const bands = Array.from({length: boxSize}, (_, i) => i);
            this.shuffleArray(bands);
            const gridCopy = [...grid];
            for(let i=0; i<boxSize; i++) {
                const bandIdx = bands[i];
                const startRow = bandIdx * boxSize;
                for(let r=0; r<boxSize; r++) {
                    grid[i*boxSize + r] = gridCopy[startRow + r];
                }
            }
        },

        shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        },

        getHolesCount() {
            const s = this.state.size;
            const diff = this.state.difficulty;
            if (s === 16) return (diff === 'easy') ? 90 : (diff === 'medium') ? 120 : 150;
            if (s === 25) return (diff === 'easy') ? 250 : (diff === 'medium') ? 320 : 400;
            if (diff === 'easy') return 30;
            if (diff === 'hard') return 55;
            return 40; 
        },

        renderGrid() {
            this.els.gridContainer.innerHTML = '';
            this.els.gridContainer.dataset.size = this.state.size;

                        const size = this.state.size;
            const boxSize = Math.sqrt(size);

            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    const tile = document.createElement('div');
                    tile.classList.add('sudoku-tile');
                    tile.dataset.r = r;
                    tile.dataset.c = c;

                                        if ((r + 1) % boxSize === 0 && r !== size - 1) {
                        tile.classList.add('tile-border-bottom');
                    }

                    const val = this.state.userGrid[r][c];

                    if (this.state.fixed[r][c]) {
                        tile.classList.add('tile-fixed');
                        tile.textContent = val;
                    } else if (val !== 0) {
                        tile.classList.add('tile-user');
                        tile.textContent = val;
                    }

                    tile.addEventListener('click', () => this.selectCell(r, c));
                    this.els.gridContainer.appendChild(tile);
                }
            }
        },

        selectCell(r, c) {
            if (this.state.isPaused) return;

                        if (this.state.tempBuffer !== "" && this.state.selectedCell) {
                const prevR = this.state.selectedCell.r;
                const prevC = this.state.selectedCell.c;
                const val = parseInt(this.state.tempBuffer);
                this.validateInstantForCell(val, prevR, prevC);
                this.state.tempBuffer = "";
                const idx = prevR * this.state.size + prevC;
                const tile = this.els.gridContainer.children[idx];
                if(tile) tile.classList.remove('tile-temp');
            }

            SoundEngine.init(); 

                        this.state.selectedCell = {r, c};
            this.state.tempBuffer = "";
            this.updateGridVisuals();

                        const tiles = Array.from(this.els.gridContainer.children);
            tiles.forEach(t => {
                if(t.classList.contains('tile-temp') && (t.dataset.r != r || t.dataset.c != c)) {
                    const oldR = t.dataset.r;
                    const oldC = t.dataset.c;
                    const val = this.state.userGrid[oldR][oldC];
                    t.textContent = val === 0 ? '' : val;
                    t.classList.remove('tile-temp');
                }
            });

            if (this.els.hiddenInput) {
                this.els.hiddenInput.value = ' ';
                const idx = r * this.state.size + c;
                const tile = this.els.gridContainer.children[idx];
                if (tile) {
                    this.els.hiddenInput.style.top = `${tile.offsetTop}px`;
                    this.els.hiddenInput.style.left = `${tile.offsetLeft}px`;
                }
                this.els.hiddenInput.focus();
            }
        },

        moveSelection(dr, dc) {
            if (!this.state.selectedCell) {
                this.selectCell(0, 0); return;
            }
            const s = this.state.size;
            let {r, c} = this.state.selectedCell;

            if (dc !== 0) {
                c += dc;
                if (c >= s) { c = 0; r++; } 
                else if (c < 0) { c = s - 1; r--; }
            }

            if (dr !== 0) {
                r += dr;
                if (r < 0) { r = s - 1; c++; } 
                else if (r >= s) { r = 0; c--; }
            }

            if (c >= s) c = 0;       
            if (c < 0) c = s - 1;    
            if (r >= s) r = 0;
            if (r < 0) r = s - 1;

            this.selectCell(r, c);
        },

        updateGridVisuals() {
            const tiles = Array.from(this.els.gridContainer.children);
            const selectedVal = this.state.selectedCell 
                ? this.state.userGrid[this.state.selectedCell.r][this.state.selectedCell.c] 
                : null;

            tiles.forEach(tile => {
                tile.classList.remove('tile-selected', 'tile-highlight');
                const r = parseInt(tile.dataset.r);
                const c = parseInt(tile.dataset.c);
                const val = this.state.userGrid[r][c];

                if (this.state.selectedCell && r === this.state.selectedCell.r && c === this.state.selectedCell.c) {
                    tile.classList.add('tile-selected');
                } else if (selectedVal !== 0 && selectedVal !== null && val === selectedVal) {
                    tile.classList.add('tile-highlight');
                }
            });
        },

        handleInputDigit(digitChar) {
            if (!this.state.selectedCell) return;
            const {r, c} = this.state.selectedCell;
            if (this.state.fixed[r][c]) return;

            if (this.state.size <= 9) {
                this.validateInstantForCell(parseInt(digitChar), r, c);
                this.updateGridVisuals();
                return;
            }

            if (digitChar === '0' && this.state.tempBuffer === "") {
                this.handleBackspace();
                return;
            }

            let potential = this.state.tempBuffer + digitChar;
            if (parseInt(potential) > this.state.size) potential = digitChar;

            this.state.tempBuffer = potential;
            const idx = r * this.state.size + c;
            const tile = this.els.gridContainer.children[idx];
            tile.textContent = potential;
            tile.classList.add('tile-temp');
            tile.classList.remove('tile-user'); 
        },

        handleBackspace() {
            if (!this.state.selectedCell) return;
            const {r, c} = this.state.selectedCell;
            if (this.state.fixed[r][c]) return;

            if (this.state.size <= 9) {
                this.validateInstantForCell(0, r, c);
                this.updateGridVisuals();
                return;
            }

            if (this.state.tempBuffer.length > 0) {
                this.state.tempBuffer = this.state.tempBuffer.slice(0, -1);
            } else {
                this.state.userGrid[r][c] = 0;
            }

                        const idx = r * this.state.size + c;
            const tile = this.els.gridContainer.children[idx];

                        if (this.state.tempBuffer.length > 0) {
                tile.textContent = this.state.tempBuffer;
                tile.classList.add('tile-temp');
            } else {
                const realVal = this.state.userGrid[r][c];
                tile.textContent = realVal === 0 ? '' : realVal;
                tile.classList.remove('tile-temp');
                if(realVal !== 0) tile.classList.add('tile-user');
            }
            this.updateGridVisuals();
        },

        commitInput() {
            if (!this.state.selectedCell) return;
            const {r, c} = this.state.selectedCell;
            if (this.state.fixed[r][c]) return;
            if (this.state.tempBuffer === "") return;

            const val = parseInt(this.state.tempBuffer);
            this.validateInstantForCell(val, r, c); 
            this.updateGridVisuals();

                        this.state.tempBuffer = "";
            const idx = r * this.state.size + c;
            const tile = this.els.gridContainer.children[idx];
            if(tile) tile.classList.remove('tile-temp');
        },

        validateInstantForCell(num, r, c) {
            if (num === 0) {
                this.state.userGrid[r][c] = 0;
                this.updateTileDOM(r, c, '');
            } else {
                if (num === this.state.grid[r][c]) {
                    SoundEngine.playHit(); 
                    this.state.userGrid[r][c] = num;
                    this.updateTileDOM(r, c, num);
                    this.checkWin();
                } else {
                    SoundEngine.playError(); 
                    this.state.mistakes++;
                    this.updateStatsUI();

                                        const idx = r * this.state.size + c;
                    const tile = this.els.gridContainer.children[idx];
                    tile.classList.add('tile-error');
                    tile.textContent = num; 
                    setTimeout(() => { 
                        tile.classList.remove('tile-error'); 
                        const current = this.state.userGrid[r][c];
                        tile.textContent = current === 0 ? '' : current;
                        if(current !== 0) tile.classList.add('tile-user');
                        tile.classList.remove('tile-temp');
                    }, 400);

                    if (this.state.maxMistakes > 0 && this.state.mistakes >= this.state.maxMistakes) {
                        this.gameOver(false); 
                    }
                }
            }
        },

        updateTileDOM(r, c, val) {
            const idx = r * this.state.size + c;
            const tile = this.els.gridContainer.children[idx];
            tile.textContent = val;
            tile.className = 'sudoku-tile'; 
            const boxSize = Math.sqrt(this.state.size);
            if ((r + 1) % boxSize === 0 && r !== this.state.size - 1) tile.classList.add('tile-border-bottom');
            if (val !== '') tile.classList.add('tile-user');
            if (this.state.selectedCell && this.state.selectedCell.r === r && this.state.selectedCell.c === c) tile.classList.add('tile-selected');
        },

        checkWin() {
            for(let row of this.state.userGrid) {
                if(row.includes(0)) return;
            }
            this.gameOver(true);
        },

        async gameOver(success) {
            this.stopTimer();
            SoundEngine.playEnd();
            this.state.isGameRunning = false; 
            this.state.currentState = 'FINISHED';

                        if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
            if (this.els.hiddenInput) this.els.hiddenInput.blur();

            const data = {
                results: getGameText('results'),
                settings: getGameText('settings')
            };

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');

                                if (success) {
                    this.els.results.titleRanked.textContent = data.results.success;
                    this.els.results.titleRanked.style.color = 'var(--accent-color)';
                    this.els.results.rankedTime.textContent = this.formatTime(this.state.timer, true);

                                        const configString = `${this.state.size}_${this.state.difficulty}`;
                    this.saveScoreToDatabase(this.state.timer, configString);

                                        const recordKey = `sudoku_best_ranked_${configString}`;
                    let savedBest = localStorage.getItem(recordKey);
                    let best = savedBest !== null ? parseFloat(savedBest) : null;
                    let isRecord = false;

                                        if (best === null || this.state.timer < best) {
                        best = this.state.timer;
                        localStorage.setItem(recordKey, best);
                        isRecord = true;
                        this.saveBestScoreToDatabase(best, configString);
                    }

                                        if (isRecord && savedBest !== null) {
                        if(this.els.results.newRec) {
                            this.els.results.newRec.style.visibility = 'visible';
                            this.els.results.newRec.style.opacity = '1';
                        }
                    } else {
                        if(this.els.results.newRec) {
                            this.els.results.newRec.style.visibility = 'hidden';
                            this.els.results.newRec.style.opacity = '0';
                        }
                    }
                    const chartKey = `${this.state.size}_${this.state.difficulty}`;
                    await this.drawDistributionChart(this.state.timer, best, chartKey);
                    this.preloadDistributionData(chartKey);
                } else {
                    this.els.results.titleRanked.textContent = data.results.fail;
                    this.els.results.titleRanked.style.color = 'var(--accent-color-secondary)';
                    this.els.results.rankedTime.textContent = "--:--";
                    if(this.els.results.newRec) {
                        this.els.results.newRec.style.visibility = 'hidden';
                        this.els.results.newRec.style.opacity = '0';
                    }
                    const distContainer = this.els.viewRanked.querySelector('.distribution-chart-container');
                    if (distContainer) distContainer.style.display = 'none';
                }

            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');

                                if (success) {
                    this.els.results.titleSandbox.textContent = data.results.success;
                    this.els.results.titleSandbox.style.color = 'var(--accent-color)';
                    this.els.results.sandboxTime.textContent = this.formatTime(this.state.timer, false);
                } else {
                    this.els.results.titleSandbox.textContent = data.results.fail;
                    this.els.results.titleSandbox.style.color = 'var(--accent-color-secondary)';
                    this.els.results.sandboxTime.textContent = "--:--";
                }

                if(this.els.results.newRec) {
                    this.els.results.newRec.style.visibility = 'hidden';
                    this.els.results.newRec.style.opacity = '0';
                }

                                if(this.els.results.statDiff) {
                    this.els.results.statDiff.textContent = data.settings[this.state.difficulty];
                }
                if(this.els.results.statMistakes) {
                    this.els.results.statMistakes.textContent = this.state.mistakes;
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


        async saveScoreToDatabase(score, configString) {
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
                    body: JSON.stringify({ game_id: 'sudoku_classic', score: score, details: { config: configString, format: "time" }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, configString) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `sudoku_ranked_${configString}`, score: score, details: { config: configString, format: "time" }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec de la connexion au serveur :", error); }
        },

        async drawDistributionChart(currentScore, bestScore, configKey) {
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

            const distContainer = this.els.viewRanked.querySelector('.distribution-chart-container');
            if (!distContainer) return;
            distContainer.querySelectorAll('.dist-html-dot').forEach(el => el.remove()); 

            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
            const currentPercent = clamp(((currentScore - minX) / range) * 100, 0, 100);
            let bestPercent = null;
            if (bestScore !== null) bestPercent = clamp(((bestScore - minX) / range) * 100, 0, 100);

            let currentOffset = 5; if (bestPercent !== null && Math.abs(currentPercent - bestPercent) < 8) currentOffset = 30;

            if (bestScore !== null && currentScore === bestScore) {
                this.els.results.markerCurrent.style.display = 'none';
            } else if (currentScore !== null) {
                this.els.results.markerCurrent.style.display = 'block';
                this.els.results.markerCurrent.style.left = `${currentPercent}%`;
                this.els.results.markerCurrent.innerHTML = `
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">
                        ${this.formatTime(currentScore, true)}
                    </div>
                `;
            } else {
                this.els.results.markerCurrent.style.display = 'none';
            }

            if (bestScore !== null) {
                this.els.results.markerBest.classList.remove('hidden');
                this.els.results.markerBest.style.left = `${bestPercent}%`;
                this.els.results.markerBest.innerHTML = `
                    <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);">
                        <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/></svg>
                    </div>
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">
                        ${this.formatTime(bestScore, true)}
                    </div>
                `;
            } else {
                this.els.results.markerBest.classList.add('hidden');
            }

            const tooltip = this.els.viewRanked.querySelector('.chart-tooltip');
            const hoverLine = this.els.viewRanked.querySelector('.hover-line');

            distContainer.onmousemove = (e) => {
                const rect = distContainer.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const percentX = clamp(mouseX / rect.width, 0, 1);
                const val = minX + percentX * range;
                const snappedPercentX = (val - minX) / range;

                let areaToLeft = 0;
                for (let i = 0; i <= steps; i++) {
                    let pointVal = minX + (i / steps) * range;
                    if (pointVal <= val) areaToLeft += densities[i].y;
                }

                                let percentile = clamp((areaToLeft / totalArea) * 100, 0.1, 99.9);
                percentile = percentile < 1 ? percentile.toFixed(1) : Math.round(percentile);

                tooltip.style.left = `${snappedPercentX * 100}%`;
                tooltip.innerHTML = `<strong>${this.formatTime(Math.max(0, val), true)}</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
                tooltip.classList.remove('hidden'); 
                hoverLine.style.left = `${snappedPercentX * 100}%`; 
                hoverLine.classList.remove('hidden');
            };
            distContainer.onmouseleave = () => { tooltip.classList.add('hidden'); hoverLine.classList.add('hidden'); };
        },

        async preloadDistributionData(configKey) {
            if (!configKey) configKey = `${this.state.savedRankedSize}_${this.state.savedRankedDiff}`;
            try {
                const res = await fetch(`/api/scores/distribution/sudoku_classic?config=${configKey}`, {
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

        startTimer() {
            this.stopTimer();
            this.state.lastTime = Date.now();
            this.state.timerInterval = setInterval(() => {
                const now = Date.now();
                if (!this.state.isPaused) {
                    this.state.timer += (now - this.state.lastTime) / 1000;
                }
                this.state.lastTime = now;
                this.updateStatsUI();
            }, 10);
        },

        stopTimer() {
            if (this.state.timerInterval) clearInterval(this.state.timerInterval);
        },

        formatTime(seconds, showHundredths = false) {
            const totalMs = Math.floor(Math.max(0, seconds) * 1000);
            const m = Math.floor(totalMs / 60000).toString().padStart(2, '0');
            const s = Math.floor((totalMs % 60000) / 1000).toString().padStart(2, '0');

                        if (showHundredths) {
                const hs = Math.floor((totalMs % 1000) / 10).toString().padStart(2, '0');
                return `${m}:${s}.${hs}`;
            }
            return `${m}:${s}`;
        },

        updateStatsUI() {
            const showHundredths = this.state.gameMode === 'ranked' && this.state.savedShowHundredths;
            this.els.timerDisp.textContent = this.formatTime(this.state.timer, showHundredths);

                        const livesLeft = Math.max(0, this.state.maxMistakes - this.state.mistakes);
            window.LivesManager.update(this.els.livesContainer, livesLeft, this.state.maxMistakes);
        },

        togglePause() {
            if (this.state.gameMode === 'ranked') return;
            this.state.isPaused = !this.state.isPaused;
            this.updatePauseIcon();

                        if(this.state.isPaused) {
                this.els.pauseBtn.classList.add('btn-paused-active');
            } else {
                this.els.pauseBtn.classList.remove('btn-paused-active');
                if (this.els.hiddenInput) this.els.hiddenInput.focus();
            }
        },

        updatePauseIcon() {
            if (this.state.isPaused) {
                this.els.icons.pause.classList.add('hidden');
                this.els.icons.play.classList.remove('hidden');
            } else {
                this.els.icons.play.classList.add('hidden');
                this.els.icons.pause.classList.remove('hidden');
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
                    document.exitFullscreen().catch(e=>console.error(e));
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
                this.els.icons.expand.classList.add('hidden');
                this.els.icons.compress.classList.remove('hidden');
            } else {
                this.els.icons.compress.classList.add('hidden');
                this.els.icons.expand.classList.remove('hidden');
            }
        }
    };

    SudokuGame.init();
});