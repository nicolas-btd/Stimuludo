const cards_memoryTranslations = {
    fr: {
        header_title: "MEMOIRE DE CARTES",
        intro: {
            title: "MEMOIRE DE CARTES",
            desc: "Observez la séquence de cartes, puis reconstituez-la.",
            best_level: "MEILLEUR NIVEAU",
            start: "JOUER",
            reset: "RESET SCORE",
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            options_title: "Difficulté",
            lives: "Vies :",
            lives_hint: "0 = Infini.",
            start_cards: "Cartes (Niv.1) :",
            start_cards_hint: "Nombre de cartes au démarrage.",
            display_time: "Vitesse (ms) :",
            display_time_hint: "Temps d'affichage par carte.",
            flip_anim: "Animation Flip",
            ranked_hint: "Mode classé : Vies (3) et Cartes au départ (3) fixes.",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: { 
            lvl: "NIV.",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer" 
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            level_reached: "Niveau Atteint",
            record: "Record",
            retry: "RÉESSAYER",
            best: "Meilleur",
            you: "Vous"
        }
    },
    en: {
        header_title: "CARDS MEMORY",
        intro: {
            title: "Cards Memory",
            desc: "Watch the card sequence, then rebuild it.",
            best_level: "BEST LEVEL",
            start: "PLAY",
            reset: "RESET SCORE",
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            options_title: "Difficulty",
            lives: "Lives:",
            lives_hint: "0 = Infinite",
            start_cards: "Cards (start):",
            start_cards_hint: "Number of cards at the start.",
            display_time: "Speed (ms):",
            display_time_hint: "Display time per card.",
            flip_anim: "Flip Animation",
            ranked_hint: "Ranked mode: Lives (3) and Starting Cards (3) are fixed.",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: { 
            lvl: "LVL",
            ready: "Ready?",
            or: "or",
            to_start: "to start" 
        },
        results: {
            new_record: "NEW RECORD!",
            level_reached: "Level Reached",
            record: "Record",
            retry: "RETRY",
            best: "Best",
            you: "You"
        }
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.cards_memory = cards_memoryTranslations.fr;
    translations.en.cards_memory = cards_memoryTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, cards_memoryTranslations[lang]) 
        || key.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, cards_memoryTranslations[savedLang]);
}


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
    playFlip() {
        const volMod = this.getVolumeMultiplier();
        if (volMod === 0) return;

        this.init();
        const t = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();


                        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t); 
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.03);


                        gain.gain.setValueAtTime(0.05 * volMod, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

                osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.03);
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

                gain.gain.setValueAtTime(0.06 * volMod, t);
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

                gain.gain.setValueAtTime(0.10 * volMod, t);
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


const SUITS = ['hearts', 'diamonds', 'clubs', 'spades'];
const SUIT_SYMBOLS = { 'hearts': '♥', 'diamonds': '♦', 'clubs': '♣', 'spades': '♠' };
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

const CardsMemory = {
    state: {
        gameMode: 'ranked',
        currentState: 'PRE_START',
        level: 1,
        lives: 1,
        sequence: [],
        solvedMask: [], 
        selectedCardIndex: null, 
        buildSelection: { val: null, suit: null },
        configLives: 1,
        configStartCards: 3, 
        displayTime: 1500,
        isPaused: false,
        pauseRequested: false,
        isGameRunning: false,
        isAnimating: false,
        currentRunId: 0,
        activeTimers: [], 
        savedTimeRanked: 1500,
        savedFlipRanked: true,
        savedConfig: {},
        distributionDataByConfig: {}
    },

    els: {
        board: document.getElementById('game-board'),
        overlayStart: document.getElementById('start-overlay'),
        overlayOver: document.getElementById('game-over-overlay'),
        statusOverlay: document.getElementById('status-overlay'),
        gameUI: document.getElementById('game-ui'),
        startBtn: document.getElementById('btn-start'),
        restartBtn: document.getElementById('btn-restart'),
        ingameRestartBtn: document.getElementById('ingame-restart-btn'), 
        settingsToggle: document.getElementById('settings-toggle'),
        closeSettings: document.getElementById('close-settings'),
        saveSettings: document.getElementById('save-settings-btn'),
        settingsPanel: document.getElementById('settings-panel'),
        pauseBtn: document.getElementById('pause-btn'),
        fullscreenBtn: document.getElementById('fullscreen-btn'),
        iconExpand: document.getElementById('icon-expand'),
        iconCompress: document.getElementById('icon-compress'),
        icons: { pause: document.getElementById('icon-pause'), play: document.getElementById('icon-play') },
        cardDisplayArea: document.getElementById('card-display-area'),
        inputControls: document.getElementById('input-controls'),
        suitBtns: document.querySelectorAll('.suit-btn'),
        valBtns: document.querySelectorAll('.val-btn'),
        validateBtns: document.querySelectorAll('.validate-btn'), 
        level: document.getElementById('current-level'),
        livesContainer: document.getElementById('lives-container'),

                resultsRanked: document.getElementById('results-ranked'),
        resultsSandbox: document.getElementById('results-sandbox'),
        rankedScore: document.getElementById('ranked-score'),
        sandboxScore: document.getElementById('sandbox-score'),
        sandboxBest: document.getElementById('sandbox-best'),
        markerCurrent: document.getElementById('marker-current'),
        markerBest: document.getElementById('marker-best'),
        settingsGroupRanked: document.getElementById('settings-ranked-group'),
        settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
        modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),

        results: {
            newRec: document.getElementById('new-record-msg'),
            homeBest: document.getElementById('best-score-display')
        },
        inputs: {
            lives: document.getElementById('lives-val'),
            displayTime: document.getElementById('display-time-val'),
            startCards: document.getElementById('start-cards-val'),
            flipAnim: document.getElementById('flip-anim-val'),
            timeRanked: document.getElementById('time-ranked-val'),
            flipRanked: document.getElementById('flip-anim-ranked-val')
        }
    },

    init() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('mode')) {
            this.state.gameMode = params.get('mode');
        } else {
            this.state.gameMode = 'ranked';
        }
        if (params.has('displayTime')) {
            this.state.savedTimeRanked = parseInt(params.get('displayTime'), 10);
            this.state.displayTime = parseInt(params.get('displayTime'), 10);
        }

        const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
        if (activeRadio) activeRadio.checked = true;

        this.updateSettingsView(this.state.gameMode);

        this.els.board = document.getElementById('game-board');
        this.loadUserPreferences();
        this.saveConfigSnapshot();
        this.updateBestScoreDisplay();
        this.loadBackgroundPreference();
        this.bindEvents();

                if (this.els.results.newRec && this.els.resultsRanked) {
            this.els.viewRanked = this.els.resultsRanked; 
            this.els.resultsRanked.insertBefore(this.els.results.newRec, this.els.resultsRanked.firstChild);
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

        this.toggleOverlay(this.els.overlayStart, false);

        if (this.state.gameMode === 'sandbox') {
            this.setPreStartState(true);
            this.startGame();
        } else {
            this.setPreStartState();
        }

        window.addEventListener('resize', () => {
            if (this.state.isGameRunning || this.state.currentState === 'PRE_START') {
                this.calculateOptimalLayout();
            }
        });
        const configKey = `cards_memory_ranked_${this.state.displayTime}`;
        this.preloadDistributionData(configKey);
    },

    loadConfig() {
        if (this.state.gameMode === 'ranked') {
            this.state.configLives = 3;
            this.state.configStartCards = 3;
            this.state.displayTime = this.state.savedTimeRanked;
            this.applyFlipSettings();
        } else {
            this.state.configLives = parseInt(this.els.inputs.lives.value);
            if(isNaN(this.state.configLives)) this.state.configLives = 1;
            this.state.configStartCards = parseInt(this.els.inputs.startCards.value) || 3;
            if (this.state.configStartCards < 1) this.state.configStartCards = 1;
            this.state.displayTime = parseInt(this.els.inputs.displayTime.value) || 1500;
            this.applyFlipSettings();
        }
    },

    setPreStartState(isAutoStart = false) {
        this.clearAllSafeTimers(); 
        this.state.currentRunId++; 

                this.state.isGameRunning = false;
        this.state.currentState = 'PRE_START';
        this.state.isPaused = false;
        this.state.pauseRequested = false;

        this.toggleOverlay(this.els.overlayOver, false);

        this.loadConfig();

        this.state.level = 1;
        this.state.lives = (this.state.configLives === 0) ? 1 : this.state.configLives;


                        this.els.level.textContent = this.state.level;
        window.LivesManager.setup(this.els.livesContainer, this.state.configLives, this.state.lives);

        this.state.sequence = this.generateSequence(this.state.level);
        this.state.solvedMask = new Array(this.state.sequence.length).fill(false);
        this.state.selectedCardIndex = null;
        this.resetBuilder();

                this.els.gameUI.classList.remove('hidden');
        this.calculateOptimalLayout();
        this.renderInitialGrid();

        if (isAutoStart) {
            this.els.statusOverlay.classList.add('hidden');
            this.els.cardDisplayArea.classList.remove('blurred');
            this.els.inputControls.classList.remove('blurred');
            this.els.validateBtns.forEach(btn => btn.classList.remove('blurred'));
        } else {
            const mainText = getGameText('game.ready') || 'Prêt ?';
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
            this.els.cardDisplayArea.classList.add('blurred');
            this.els.inputControls.classList.add('blurred');
            this.els.validateBtns.forEach(btn => btn.classList.add('blurred'));
        }

                if (this.state.gameMode === 'ranked') {
            this.els.pauseBtn.style.display = 'none';
            if (this.els.ingameRestartBtn) {
                this.els.ingameRestartBtn.style.display = 'flex';
                this.els.ingameRestartBtn.style.visibility = 'visible';
            }
        } else {
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
            this.els.pauseBtn.style.display = 'flex';
            this.els.pauseBtn.style.visibility = 'visible';
        }

        this.disableInput(true);
    },

    loadUserPreferences() {
        const savedTimeR = localStorage.getItem('cards_memory_time_ranked');
        if (savedTimeR !== null) {
            this.els.inputs.timeRanked.value = savedTimeR;
            this.state.savedTimeRanked = parseInt(savedTimeR);
        }

        const savedFlipR = localStorage.getItem('cards_memory_flip_ranked');
        if (savedFlipR !== null) {
            const isTrue = (savedFlipR === 'true');
            this.els.inputs.flipRanked.checked = isTrue;
            this.state.savedFlipRanked = isTrue;
        }

        const savedLives = localStorage.getItem('cards_memory_lives');
        if (savedLives !== null) this.els.inputs.lives.value = savedLives;

                const savedTime = localStorage.getItem('cards_memory_displayTime');
        if (savedTime !== null) this.els.inputs.displayTime.value = savedTime;

                const savedStartCards = localStorage.getItem('cards_memory_startCards');
        if (savedStartCards !== null) this.els.inputs.startCards.value = savedStartCards;

                const savedFlip = localStorage.getItem('cards_memory_flipAnim');
        if (savedFlip !== null) { this.els.inputs.flipAnim.checked = (savedFlip === 'true'); }

                this.applyFlipSettings(); 
    },

    saveConfigSnapshot() {
        this.state.savedConfig = {
            lives: this.els.inputs.lives.value,
            displayTime: this.els.inputs.displayTime.value,
            startCards: this.els.inputs.startCards.value,
            flipAnim: this.els.inputs.flipAnim.checked 
        };
    },

    restoreConfigUI() {
        this.els.inputs.timeRanked.value = this.state.savedTimeRanked;
        this.els.inputs.flipRanked.checked = this.state.savedFlipRanked;

        this.els.inputs.lives.value = this.state.savedConfig.lives;
        this.els.inputs.displayTime.value = this.state.savedConfig.displayTime;
        this.els.inputs.startCards.value = this.state.savedConfig.startCards;
        this.els.inputs.flipAnim.checked = this.state.savedConfig.flipAnim; 

        const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
        if(activeRadio) activeRadio.checked = true;
        this.updateSettingsView(this.state.gameMode);
    },

    updateSettingsView(mode) {
        if (mode === 'ranked') {
            this.els.settingsGroupRanked.style.display = 'block';
            this.els.settingsGroupSandbox.style.display = 'none';
        } else {
            this.els.settingsGroupRanked.style.display = 'none';
            this.els.settingsGroupSandbox.style.display = 'block';
        }
        this.updateBestScoreDisplay();
    },

    applyFlipSettings() {
        if (this.state.gameMode === 'ranked') {
            if (this.state.savedFlipRanked) { this.els.board.classList.remove('disable-flip'); } 
            else { this.els.board.classList.add('disable-flip'); }
        } else {
            if (this.els.inputs.flipAnim.checked) { this.els.board.classList.remove('disable-flip'); } 
            else { this.els.board.classList.add('disable-flip'); }
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

    toggleOverlay(el, show) {
        if (!el) return;
        if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
        else { el.classList.remove('visible'); el.classList.add('hidden'); }
    },

    bindEvents() {
        this.els.modeToggleRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.state.gameMode = e.target.value;
                this.updateSettingsView(e.target.value);
            });
        });

        this.els.restartBtn.addEventListener('click', () => {
            this.toggleOverlay(this.els.overlayOver, false);
            if (this.state.gameMode === 'sandbox') {
                this.setPreStartState(true);
                this.startGame();
            } else {
                this.setPreStartState();
            }
        });

        if (this.els.ingameRestartBtn) {
            this.els.ingameRestartBtn.addEventListener('click', (e) => {
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

        this.els.settingsToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(err => console.error(err));
                if (this.els.settingsPanel.classList.contains('panel-hidden')) this.toggleSettings();
            } else {
                this.toggleSettings();
            }
        });

                this.els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

                this.els.saveSettings.addEventListener('click', () => {
            const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;
            this.state.gameMode = selectedMode;
            window.history.replaceState(null, '', '?mode=' + selectedMode);

            localStorage.setItem('cards_memory_time_ranked', this.els.inputs.timeRanked.value);
            localStorage.setItem('cards_memory_flip_ranked', this.els.inputs.flipRanked.checked);
            this.state.savedTimeRanked = parseInt(this.els.inputs.timeRanked.value);
            this.state.savedFlipRanked = this.els.inputs.flipRanked.checked;

            localStorage.setItem('cards_memory_lives', this.els.inputs.lives.value);
            localStorage.setItem('cards_memory_displayTime', this.els.inputs.displayTime.value);
            localStorage.setItem('cards_memory_startCards', this.els.inputs.startCards.value);
            localStorage.setItem('cards_memory_flipAnim', this.els.inputs.flipAnim.checked); 

                        this.saveConfigSnapshot();
            this.applyFlipSettings(); 
            this.updateBestScoreDisplay();

                        this.els.settingsPanel.classList.remove('panel-visible'); 
            this.els.settingsPanel.classList.add('panel-hidden');

            if (this.state.gameMode === 'sandbox') {
                this.setPreStartState(true);
                this.startGame();
            } else {
                this.setPreStartState();
            }
            const configKey = `cards_memory_ranked_${this.state.displayTime}`;
            this.preloadDistributionData(configKey);
        });

        document.addEventListener('click', (e) => {
            const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
            const clickedInside = this.els.settingsPanel.contains(e.target) || this.els.settingsToggle.contains(e.target);
            if (isMenuOpen && !clickedInside) this.toggleSettings(true);

            if (!isMenuOpen && (this.state.isGameRunning || this.state.currentState === 'PRE_START') && !this.state.isPaused && !e.target.closest('button')) {
                if (this.state.currentState === 'PRE_START') {
                    this.startGame();
                }
            }
        });

        this.els.pauseBtn.addEventListener('click', () => this.togglePause());

                this.els.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

                const exitFsBtn = document.querySelector('.exit-fs-btn');
        if (exitFsBtn) {
            exitFsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.toggleFullscreen();
            });
        }

        document.addEventListener('fullscreenchange', () => {
            this.updateFullscreenIcon();
            setTimeout(() => {
                if(this.state.isGameRunning || this.state.currentState === 'PRE_START') this.calculateOptimalLayout();
            }, 100);
        });

        this.els.suitBtns.forEach(btn => btn.addEventListener('click', () => this.selectSuit(btn.dataset.suit)));
        this.els.valBtns.forEach(btn => btn.addEventListener('click', () => this.selectVal(btn.dataset.val)));

                this.els.validateBtns.forEach(btn => {
            btn.addEventListener('click', () => this.validateCardBuild());
        });

        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'f') this.toggleFullscreen();

                        if (e.code === 'Escape') {
                e.preventDefault();
                if (!this.els.settingsPanel.classList.contains('panel-hidden')) {
                    this.toggleSettings(true); 
                } else {
                    this.toggleSettings();
                }
            }

            const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
            const isOverVisible = this.els.overlayOver.classList.contains('visible');

            if ((e.code === 'Space' || e.code === 'Enter') && this.state.currentState === 'PRE_START' && !isMenuOpen) {
                e.preventDefault();
                this.startGame();
            }

            if (e.code === 'Enter') {
                if (isMenuOpen) {
                    e.preventDefault();
                    this.els.saveSettings.click();
                } 
                else if (isOverVisible) {
                    e.preventDefault();
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') {
                        this.setPreStartState(true);
                        this.startGame();
                    } else {
                        this.setPreStartState();
                    }
                }
            }
        });
        window.addEventListener('storage', (e) => {
            if (e.key === 'globalOpaque') {
                this.loadBackgroundPreference();
            }
        });
    },

    toggleSettings(forceClose = false) {
        const panel = this.els.settingsPanel;
        if (forceClose || !panel.classList.contains('panel-hidden')) {
            this.restoreConfigUI();
            panel.classList.remove('panel-visible'); panel.classList.add('panel-hidden');
        } else {
            this.restoreConfigUI();
            panel.classList.remove('panel-hidden'); panel.classList.add('panel-visible');
        }
    },

    setSafeTimeout(fn, delay) {
        const id = setTimeout(() => {
            this.state.activeTimers = this.state.activeTimers.filter(t => t !== id);
            fn();
        }, delay);
        this.state.activeTimers.push(id);
        return id;
    },

    clearAllSafeTimers() {
        this.state.activeTimers.forEach(id => clearTimeout(id));
        this.state.activeTimers = [];
    },

    startGame() {
        this.clearAllSafeTimers(); 
        SoundEngine.init();
        this.state.currentRunId++; 
        this.state.isAnimating = false; 

        this.loadConfig();

        this.toggleOverlay(this.els.overlayOver, false);
        this.els.statusOverlay.classList.add('hidden');
        this.els.cardDisplayArea.classList.remove('blurred');
        this.els.inputControls.classList.remove('blurred');
        this.els.validateBtns.forEach(btn => btn.classList.remove('blurred'));
        this.els.pauseBtn.classList.remove('btn-paused-pending', 'btn-paused-active');

        this.state.level = 1;
        this.state.lives = (this.state.configLives === 0) ? 1 : this.state.configLives;
        this.state.isGameRunning = true;
        this.state.isPaused = false;
        this.state.pauseRequested = false;
        this.state.selectedCardIndex = null;
        this.state.currentState = 'PLAYING';

        if (this.state.gameMode === 'ranked') {
            this.els.pauseBtn.style.display = 'none';
            if (this.els.ingameRestartBtn) {
                this.els.ingameRestartBtn.style.display = 'flex';
                this.els.ingameRestartBtn.style.visibility = 'visible';
            }
        } else {
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
            this.els.pauseBtn.style.display = 'flex';
            this.els.pauseBtn.style.visibility = 'visible';
        }

        this.updatePauseIcon();


                        this.els.level.textContent = this.state.level;
        window.LivesManager.setup(this.els.livesContainer, this.state.configLives, this.state.lives);

                this.startLevel();
    },

    startLevel() {
        this.clearAllSafeTimers(); 

        this.state.sequence = this.generateSequence(this.state.level);
        this.state.solvedMask = new Array(this.state.sequence.length).fill(false);
        this.state.selectedCardIndex = null;

                this.resetBuilder();
        this.disableInput(true);

                this.calculateOptimalLayout();
        this.renderInitialGrid();

                const myRunId = this.state.currentRunId;

                this.setSafeTimeout(() => {
            if (this.state.currentRunId === myRunId && this.state.isGameRunning) {
                this.state.isAnimating = true;
                this.disableInput(true);
                this.runCardAnimationStep(0, myRunId);
            }
        }, 800);
    },

    runCardAnimationStep(index, runId) {
        if (this.state.currentRunId !== runId || !this.state.isGameRunning) return;

        if (this.state.isPaused) {
            this.setSafeTimeout(() => this.runCardAnimationStep(index, runId), 100);
            return;
        }

        if (index >= this.state.sequence.length) {
            this.state.isAnimating = false;
            this.enableInputPhase();
            return;
        }

        const cardElements = Array.from(this.els.cardDisplayArea.children);
        const cardEl = cardElements[index];

        if (!cardEl) {
            this.state.isAnimating = false;
            return;
        }

        cardEl.classList.remove('flipped');
        void cardEl.offsetWidth; 

                SoundEngine.playFlip();

        const waitTime = Math.max(500, this.state.displayTime);

                this.setSafeTimeout(() => {
            if (this.state.currentRunId !== runId || !this.state.isGameRunning) return;

                        cardEl.classList.add('flipped');

            this.setSafeTimeout(() => {
                this.runCardAnimationStep(index + 1, runId);
            }, 300);

        }, waitTime);
    },

    calculateOptimalLayout() {
        const container = this.els.gameUI.querySelector('.game-center-area');
        if (!container) return;

        const rect = container.getBoundingClientRect();


                        const availW = rect.width - 20; 
        const availH = rect.height - 30;

        const cardCount = this.state.sequence.length;
        const gap = 10;
        const aspectRatio = 1.4;

        let bestWidth = 0;

        for (let cols = 1; cols <= cardCount; cols++) {
            const rows = Math.ceil(cardCount / cols);
            const maxW_byWidth = (availW - (cols - 1) * gap) / cols;
            const maxH_byHeight = (availH - (rows - 1) * gap) / rows;
            const maxW_byHeight = maxH_byHeight / aspectRatio;
            const currentWidth = Math.min(maxW_byWidth, maxW_byHeight);

            if (currentWidth > bestWidth) {
                bestWidth = currentWidth;
            }
        }

        const isMobile = window.innerWidth <= 700;
        const minW = isMobile ? 45 : 50; 
        const maxW = isMobile ? 110 : 160; 

                bestWidth = Math.max(minW, Math.min(bestWidth, maxW));
        const bestHeight = bestWidth * aspectRatio;

        document.documentElement.style.setProperty('--dynamic-card-width', `${bestWidth}px`);
        document.documentElement.style.setProperty('--dynamic-card-height', `${bestHeight}px`);
    },

    generateSequence(lvl) {
        const seq = [];
        const count = (lvl - 1) + this.state.configStartCards;
        for (let i = 0; i < count; i++) {
            seq.push({
                val: VALUES[Math.floor(Math.random() * VALUES.length)],
                suit: SUITS[Math.floor(Math.random() * SUITS.length)]
            });
        }
        return seq;
    },

    renderInitialGrid() {
        this.els.cardDisplayArea.innerHTML = '';
        this.state.sequence.forEach((cardData, idx) => {
            const cardEl = this.createCardElement(cardData);
            cardEl.dataset.index = idx; 
            cardEl.classList.add('flipped'); 
            cardEl.style.pointerEvents = 'none';
            this.els.cardDisplayArea.appendChild(cardEl);
        });
    },

    enableInputPhase() {
        this.disableInput(false);
        const cards = Array.from(this.els.cardDisplayArea.children);

                cards.forEach((card, index) => {
            card.style.pointerEvents = 'auto';
            card.classList.add('waiting-input');

                        const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);

                        newCard.addEventListener('click', () => {
                if (this.state.isAnimating || this.state.solvedMask[index]) return;
                SoundEngine.init();
                this.selectCardSlot(index);
            });
        });

        this.autoSelectNextSlot(-1);
    },

    selectCardSlot(index) {
        if (this.state.solvedMask[index]) return;
        this.state.selectedCardIndex = index;
        const cards = Array.from(this.els.cardDisplayArea.children);
        cards.forEach(c => c.classList.remove('active-slot'));
        cards[index].classList.add('active-slot');
        this.resetBuilder();
    },

    createCardElement(cardData) {
        const el = document.createElement('div');
        el.className = 'playing-card';

                const isRed = (cardData.suit === 'hearts' || cardData.suit === 'diamonds');
        const colorClass = isRed ? 'red-suit' : 'black-suit';
        const symbol = SUIT_SYMBOLS[cardData.suit] || '';
        const val = cardData.val || '';
        const questionMarkLayer = `<div class="question-overlay">?</div>`;
        const tenClass = val === '10' ? 'is-ten' : '';
        const displayVal = val === '10' ? '1<span class="narrow-zero">0</span>' : val;

        const p = {
            stroke: "#000000", white: "#ffffff", skin: "#fce4d6",
            gold: "#e8b923", red: "#e33e33", blue: "#1a5ba3",
            blueD: "#13457a", brown: "#6b4226", grey: "#b0b7c6"
        };
        const commonStroke = `stroke="${p.stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`;

            if (['J', 'Q', 'K'].includes(val)) {
            const faceDesigns = {
                'K': { 
                red: `
                    <g>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1696" height="2528"><path d="m855 2520-29-33c-4-7-6-13-6-24l-1-8h-7c-9-1-18-5-24-11-5-4-10-6-26-9l-25-7-33-14-13-6-3 5c-3 4-15 12-17 12l-4 1h-20l-4 4c-6 8-20 20-36 28-19 9-22 5-14-18a1643 1528 0 0 0 38-114l10-34c12-32 12-33 6-40-14-14-19-33-27-82l-7-41c-5-16-15-38-23-49-25-36-30-48-36-69-6-26 2-57 19-79 5-6 5-9 0-9a609 567 0 0 1-182-87l-4 107a4623 4299 0 0 1-2 174 16172 15040 0 0 0-8 241l-3 11a500 465 0 0 1-32 82l-8 7c-7 0-13-14-32-58-16-39-15-27-19-248a21609 20096 0 0 0-7-225l-4-204c0-2-2-6-9-15-16-20-16-17-1-38 6-10 8-13 6-14l-2-5-6-8a584 543 0 0 1-58-106c0-3-3-2-8 1-16 9-18 9-30-33l-5-13c-3-6 2-15 9-15 6 0 6-1 3-9a633 589 0 0 1 4-414c21-57 61-134 89-171l4-5-2-5c-19-29-18-29-10-41a561 522 0 0 1 320-223c4 0 2-2-3-8-23-28-27-79-8-104l13-19 2-3 4-6a289 268 0 0 0 27-54c1-2 4-13 6-37a267 249 0 0 1 34-97c2-3 5-6 4-7l-3-5a1012 941 0 0 0-17-57 1834 1705 0 0 0-41-117c-10-29-5-33 21-18 16 10 22 17 26 24l3 4h11c12 0 21 3 29 10 4 5 5 5 24-4a647 602 0 0 1 110-39c0-14 6-26 22-44l14-15c4-5 8-3 33 23 8 9 14 22 14 31 0 8 1 9 8 9l18 4 23 7c16 4 40 13 61 23l19 8 6-3c6-7 21-10 30-10 6 1 7 1 8-2 2-3 10-11 18-17a140 131 0 0 1 24-16c1-1 8-3 10 0 3 4-1 21-20 75a1369 1273 0 0 0-36 109l-6 17c-2 4-2 4 2 9 16 17 28 53 38 108 2 24 4 27 8 39 6 15 13 23 24 41 25 38 33 61 29 89-3 19-15 42-24 47-3 3-1 5 3 5a676 629 0 0 1 173 81c9 5 10 5 10-2a24310 22608 0 0 1 9-440c3-77 6-92 22-127a596 554 0 0 0 16-36c0-4 6-9 10-8s11 13 18 29l5 14c19 36 21 59 23 148a9299 8648 0 0 0 6 282 23239 21613 0 0 1 7 230v26l11 16c16 22 16 21 8 35l-10 15c-4 2-2 6 10 23l5 8 6 8a1100 1023 0 0 1 42 84c0 5 3 5 10 1 13-8 14-6 24 24 8 31 8 33-3 37-1 1-1 2 1 11a417 388 0 0 1 8 22 692 644 0 0 1 27 131 662 615 0 0 1-48 278 846 787 0 0 1-80 148c-7 10-7 10 11 35 5 7-7 26-37 60l-13 13a565 526 0 0 1-271 168c-6 1-7 3-4 4l16 23c6 14 10 40 8 56-3 15-11 34-19 46l-4 7-1 2a233 216 0 0 0-42 107 267 249 0 0 1-17 68l-3 5-1 2-1 2-2 1-5 6c-5 8-8-1 21 86a5621 5228 0 0 1 31 93c9 28 9 32 1 32s-38-22-45-32l-3-3h-10c-15 0-37-10-37-18h-6c-2 3-11 7-14 7l-2 2-7 2-13 4-10 4-29 9c-8 1-11 2-17 7-7 5-18 10-24 10h-6v9c-1 12-13 33-21 40l-3 3c-8 10-16 15-20 13zm9-24c11-11 12-14 15-19 4-6 5-18 1-24-6-14-2-20 11-15 20 8 40-8 34-26-6-13-24-19-35-12-15 8-18-5-6-26 15-28 55-33 83-11 10 8 10 8 14 0 9-17 28-27 48-24 27 5 49 33 28 37-11 1-21 12-20 22 4 14 24 21 36 12 7-3 8-2 13 9 4 6 16 19 19 19l-12-45a12796 11901 0 0 1-41-123l-8 1a496 461 0 0 1-75 16 612 569 0 0 1-277-11l-24-5c-4-1-4 1-12 30l-13 38c-14 40-31 94-31 99 0 2 16-12 19-18 5-11 5-11 8-11l6 3c11 6 28 1 32-10 4-12-6-28-18-28s-2-22 14-30c26-12 48-5 67 24h3c23-25 68-25 87 1 13 19 12 40-2 33-20-14-46 10-33 28 5 9 21 13 31 8s14 0 10 13c-5 15-2 24 14 41 9 12 8 12 14 4zm-120-168c-11-6-12-12-4-18l6-4c1-4 18 6 18 11 0 1-4 6-10 10l-6 4zm223 0c-13-5-14-11-8-18 8-7 11-7 19 0 9 5 9 6 1 13-6 7-8 7-12 5zm-632 100 3-8c21-43 27-66 27-118l5-204a34790 32355 0 0 0 12-569v-14h-5c-12 3-24 9-32 19l-4 5v344c0 358 0 348-7 351-9 1-8 36-8-348l-1-344-3-5c-7-10-23-20-34-20h-4v41a2430 2260 0 0 0 4 123 4776 4442 0 0 0 3 175 12052 11208 0 0 1 5 219 15635 14541 0 0 1 7 269c1 22 8 40 27 81 3 5 5 6 5 3zm638-13a564 525 0 0 0 48-23c0-7 12-21 20-26 8-4 0-10-15-13-16-4-31 8-35 27-5 20-10 22-20 8-21-27-52-34-70-11-6 6-4 7 2 7 19 0 36 15 39 33v7l11-4zm-197 2c3-18 18-32 36-33l7-1c1 0-1-6-5-9-20-20-50-12-69 15-9 14-16 11-18-5-6-27-28-40-50-27-5 4-5 6 3 12 7 5 11 11 13 20 2 6 8 9 38 20 37 15 44 16 45 8zm99-140a159 148 0 0 1 58-42l56-21c30-10 30-10 30-42 0-70-8-106-33-146l-13-17h-4a94 87 0 0 1-42 37l-24 10c-4 0-6 5-5 8 7 8-5 11-22 3-13-6-18-6-33 0-12 5-16 7-20 3-3-3-4-6-1-8l-3-3-19-8c-25-11-37-20-46-36-4-6-7-9-7-6l-4 5c-12 11-20 25-31 50-9 22-15 58-15 105-1 33-1 31 7 35l32 12c51 18 63 24 82 38l22 20 6 7h14c12 0 14 0 15-4zm-119-75c-17-3-41-13-43-18-2-9 3-10 16-4a99 92 0 0 0 93-2h8c12 12-42 28-74 24zm179 0c-24-3-47-14-45-20 1-5 4-7 12-3 21 9 24 9 44 9 23 0 28-1 48-10 7-3 7-3 9-1 14 12-36 29-68 25zm-55-27c-9-3-10-74-1-79 7-4 11 2 8 12-1 7-1 55 1 62 0 4-2 7-8 5zm-124-8c-16-5-33-16-32-21 3-5 7-4 17 2 13 6 13 6 13-1 0-23 34-24 36-1l1 7 17-10c3-1 10-2 12-1 6 4-1 11-21 21-11 6-28 7-43 4zm181 1c-20-4-42-20-32-25 2-1 4 0 12 4 12 7 12 7 12 0 0-15 14-23 28-14 6 4 8 9 8 15-2 6 0 6 13-1 15-8 16-8 19-1 2 5-24 19-39 22zm-119 106c-22-19-46-31-78-40-29-8-43-15-65-34-19-15-24-25-28-51-4-25-4-30-8-39a412 383 0 0 0-34-63 130 121 0 0 1-11-108c9-16-4-8-14 9-19 32-16 67 12 107 25 37 36 62 43 102 5 41 13 52 44 66l26 10a227 211 0 0 1 69 41c2 2 30 6 46 6h4zm113 3 12-3c6-10 54-38 83-49 20-6 32-14 43-25 11-10 11-11 16-46 4-30 17-69 28-82 4-3 23-35 27-42 16-32 10-70-12-94-11-10-12-7-4 8 13 28 6 82-12 102-4 4-24 41-30 52-4 9-6 23-9 44a182 169 0 0 1-7 31c0 4-10 16-20 25-21 20-28 22-71 36-29 10-54 22-70 37l-11 9h13zm-186-6c0-4-24-16-54-28-18-8-34-15-38-19-8-6-9-4-2 6 12 22 25 30 80 40zm237-1 56-14c15-5 24-15 32-32 2-5-1-5-5-1l-12 6-11 6-8 4c-25 10-63 30-63 32l2 1zm-302-117c-1-30-1-34-4-43-7-20-20-48-28-59l-17-27c-18-30-14-69 9-75 15-5 23 9 7 14-14 4-15 30-3 52l3 6 2 5 4 6 7 12a246 229 0 0 1 28 52l3-13 10-34c10-20 16-31 31-46 12-13 11-12 8-20-5-16-4-24 5-24l7 3 18 6 8 4 1-4c12-30 36-40 60-25 17 12 24 12 41 0 22-14 43-6 57 20l4 7 8-2 13-6c13-8 20 0 16 20l-3 9 6 5c25 27 46 69 46 92 0 7 2 9 4 4l2-4c0-3 17-34 33-60 19-30 20-55 2-68-12-7-6-17 6-11 28 11 30 51 4 88l-4 8-5 7c-24 33-32 60-32 106l-2 30 6-5c12-13 15-22 16-41 1-26 9-51 25-76a93227 86702 0 0 1 24-46c14-26 14-56-1-78-4-8-5-8-31-3l-21 4c-11 0-11 0-3 12 12 20 11 50-2 64-13 11-27 5-15-8 13-13 13-34 0-53l-4-6-2 3-6 22c-4 10-12 12-18 7-1-4-1-4 2-9 6-12 9-23 9-37 0-15 0-15-11-32l-8-11v13c0 25-4 39-12 40-8 2-10-1-6-16 5-31-2-81-10-62-2 5-12 13-16 13-8 0-8-7 2-21 9-11 9-10 1-17-7-8-7-8-16 4-16 18-17 22-13 52 1 21-15 16-18-5-2-20 0-30 12-47 8-13 10-14 6-14l-7 2c-32 5-52 31-52 64v22l-7 6-5-3-4-3v-22c0-29-2-33-20-49-18-13-52-25-40-12 18 18 25 38 18 64-4 14-17 13-16-3 4-31 4-31-12-50-10-12-10-12-17-6-7 7-7 6 0 17 9 13 11 16 7 19-4 5-14 1-20-10-5-6-5-6-10 6-4 15-5 39 0 56 4 12 3 14-5 14-10 0-16-19-15-43 1-11 0-11-4-4a76 71 0 0 0-4 74c4 9-4 16-12 10-3-4-9-19-11-27-1-14-13 5-14 25 0 14 1 19 9 29 12 14 3 21-12 10-16-12-19-42-5-67l4-10-18-2-24-5c-13-3-14-3-18 6a93 93 0 0 0 1 82l23 42c10 18 18 34 22 50l3 24c3 18 3 20 7 28l13 19zm170-106 9-2 11 2c13 5 14 5 18 2l25-13c29-13 40-23 46-46 3-11 3-11-4-8-5 2-8 5-21 17-12 12-15 15-33 19-18 3-25 6-33 13-9 9-13 9-21 1-5-6-16-12-28-14-16-3-21-7-36-20-25-25-33-23-17 6 9 17 18 26 38 32 11 4 23 10 27 14a1270 1181 0 0 0 19-3zm22-37 19-5c34-9 42-20 30-40-10-17-20-20-35-8-16 12-35 11-52 0-18-12-32-7-39 13l-4 9c-1 1 0 4 4 9 9 10 15 13 36 18 12 3 13 4 20 10l7 7 5-5zm-50-20c-4-2-4-7 2-10 7-2 69-1 73 2 2 2 4 7 1 9-4 2-74 2-76-1zm318-59-2-2-1 2 1 1zm-452-9 5-14 4-6v-265l-1-264-35 7-24 6-33 11-26 9a886 824 0 0 0-117 62c31 6 43 10 44 14 0 5-5 27-15 53-2 8-6 8-21 0-27-13-63-22-68-17-4 5-4 19-10 252v47l19 13a555 516 0 0 0 261 98c16 3 14 3 17-6zm-37-37c-14-7-24-29-20-45 2-11 4-13 10-8 16 10 24 28 20 45-2 8-5 10-10 8zm-122-29c-16-10-25-31-20-46 3-5 7-4 17 5 23 19 24 55 3 41zm67-91c-16-8-23-26-19-43 1-8 3-9 11-5 13 7 20 17 21 35 0 16-3 19-13 13zm-159-3c-15-7-24-20-24-35l-2-10 7 1c16 0 32 17 35 35 1 12-3 15-16 9zm200-59a39 39 0 0 1-10-45c8-15 26 7 26 30 0 20-5 25-16 15zm-160-38c-15-7-24-19-26-34 0-9 2-16 4-15s2 0 0 0c-4-11 23 9 29 20 9 19 6 34-7 29zm111-66c-15-9-23-30-16-48 6-17 30 9 29 33-1 13-5 18-13 15zm47-116a38 38 0 0 1-8-43c8-20 28 2 26 28-1 21-8 26-18 15zm423 444a579 538 0 0 0 385-228c8-11 8-10 0-22a662 615 0 0 0-224-204h-7v6l1 8-5 2-24 8a8854 8234 0 0 0-80 21c-16 4-23 2-23-4 0-7-19 6-36 24l-18 18-8 8v170l2 169 4 8 5 13c1 7 3 7 28 3zm0-45c-9-14 3-45 19-51 20-7 11 42-9 52-7 3-7 3-10-1zm115-26c-7-14 7-40 27-50 8-2 11 4 8 19-3 21-28 43-35 31zm-64-92c-7-14 3-37 19-47l5-3 4 3c3 4 4 17 1 26-5 16-25 31-29 21zm155-1c-7-16 23-52 39-46 12 4-8 40-27 46-11 2-11 2-12 0zm-196-56c-11-9-6-37 8-50 18-16 24 24 6 42-6 7-12 10-14 8zm271-35c-8-12-4-36 8-48 9-8 9-8 15 1 10 20-11 63-23 47zm-111-7c-9-12 13-50 29-50 11 0 8 26-2 38-7 8-23 15-27 12zm-108-66c-4-6-6-23-2-33 6-12 19-24 24-21 14 11 3 46-16 54zm84-39c-8-13 1-42 17-52s18 29 2 45c-8 8-16 11-19 7zm-199 296v-25l-11-6a227 211 0 0 0-47-25c-50-26-148-19-206 14l-9 5-4 2-5 4c-10 4-10 2-10 30l2 23 16-20c13-19 27-32 39-36 25-6 66 10 85 35l3 4 5-6c21-26 68-41 91-30 8 6 23 19 32 31 20 30 19 30 19 0zm-284-48a250 232 0 0 1 272-3c13 9 12 10 12-17l-2-23-20-8a285 265 0 0 0-258 3l-12 5v13l-1 23c0 13 0 13 9 7zm0-65c58-30 115-103 127-164 4-19 7-18-21-15l-29 1c-4 0-6 1-6 6-5 35-40 87-73 112l-7 5v29l1 30zm284-25v-30l-16-15c-22-17-52-62-52-73 0-3-4-1-18 6-35 20-53-7-27-40l6-7h-28c-12 2 9 61 33 97a392 364 0 0 0 58 62c10 9 40 29 42 29zm-214 3c35-9 95-8 136 1 20 3 20 3 7-9-28-25-52-57-70-94-6-15-5-15-12 0-14 33-40 69-68 94-13 11-13 14-9 12zm-520-33c0-2-1-4-3-1-2 1 0 5 2 5zm452-27c21-21 39-49 49-77 8-21 8-21 2-25-7-3-8-6-10-15l-1-6h-5c-23-1-33-26-15-42 2-3 5-5 4-7v-15c2-5 7-10 15-14 5-4 6-5 6-9 2-6 6-15 10-18l4-2-2-78v-79h-65c-3 5-3 396 0 394zm282-41c0-51 0-50-8-46l-47 17c-5 4 48 80 53 76zm442 10a1193 1110 0 0 0 84-168 401 401 0 0 0 31-112c4-36 4-37-4-20a317 295 0 0 1-251 168c-16 3-16 1 1 15a731 680 0 0 1 126 124c4 5 5 5 13-7zm-1176-24a11916 11082 0 0 1-4-89c-5-4-44 5-51 10-2 2 50 103 54 103zm635-9 7-4c28-14 40-19 65-27 24-8 35-16 57-39 14-15 22-22 35-28l6-3a560 521 0 0 1-8-23l-7-16-20-40c-10-20-11-21-14-20-4 2-20 3-64 3-42 1-49 1-87 11-62 17-85 26-90 35-3 5 0 5 16 1 54-12 77-16 81-12 5 5 1 10-12 12l-81 17c-18 4-31 13-31 19 0 3 5 5 12 4l13-3 62-8c46-8 44-8 45-2 3 7-3 9-16 12a1087 1011 0 0 0-103 16c-17 2-24 5-24 13 0 10 12 10 72 2a1582 1472 0 0 1 80-9c4 6 0 11-12 12l-29 4c-77 13-80 13-81 16-2 9 13 13 45 10a16962 15775 0 0 1 119-12c25-6 29-6 32 0s0 7-25 12c-27 5-54 28-54 44 0 5 7 7 11 3zm-707-78c49-23 96-23 124-1l8 6 6-5c28-23 105-22 138 4 2 2 4 0 6-5l1-9c8-18 8-22 3-22l-22-4a541 503 0 0 0-288 6l10 34zm914-18 56-15c29-8 28-7 25-17-6-33-29-83-57-130-11-17-13-20-17-15l-23 17-52 38-6 5 8 13c19 30 37 72 45 101 2 7 1 7 21 3zm206-20a360 334 0 0 0 124-48 303 282 0 0 0 116-146c7-15 11-14-36-14h-40v13c-7 85-75 137-234 178-9 3-9 3 2 9l14 9c8 6 15 6 54-1zm-1105-14 18-4-9-11c-43-48-56-117-31-166l4-10c0-3-48-2-48 0-1 10 1 32 7 62 8 57 31 134 37 133zm220-14c7-7 7-10 3-35-8-43-10-45-22-42-5 3-5 4-1 6 11 5 11 22-1 39v4c6 6 2 22-7 30-4 3-4 5 4 5l8 1c4 2 12 0 16-8zm787 4 20-6c56-14 110-34 143-51 52-30 82-71 83-116v-11h-121c-138 0-125-1-138 9a2553 2374 0 0 1-60 46l2 5c19 26 47 87 55 117 3 11 3 11 16 7zm-951 0-3-6-7-18c0-6-2-16-5-21-3-10-4-22-1-30l1-19c0-13 0-17 4-27l5-17c4-14 15-26 27-31l7-1-2-14h-80l-4 6c-31 56-18 126 30 169l10 10h8zm69-6c52-1 59-3 60-14 2-10-2-11-45-11h-35l-3-4c-5-5-5-5-1-8s70-4 78-2c9 3 17-13 10-21-4-5-13-6-52-7h-35l-2-4c-10-10-4-11 44-11 45 1 44 2 44-6 0-15-5-17-53-20-33-2-35-3-35-9 0-7 2-9 40-5 28 2 32 2 35-2 4-10-8-15-54-23-37-6-53-1-56 16l-5 18c-4 11-4 12-4 27v17c-4 4-3 18 1 29l5 21c2 10 3 11 10 15 8 5 13 6 20 6zm150-20 36-17 15-8 1-66v-66H378c-5 4 0 25 5 25 12 0 24 20 20 32-1 4-1 4 3 8 5 4 12 15 12 20 0 1 1 2 4 2 19 2 29 24 32 75v15l8-5zm315-13 14-6 9-2 12-4 11-1v-132h-54v148zm-228-26a879 818 0 0 1 119-34c2 0 2-3 2-43v-42h-69l-71 1-1 123c1 2 2 2 20-5zm312 2 22-5c12-2 11 6 11-59v-57h-55v126l4-2zm115-64c2-53 2-56-1-57l-65 1c-2 3-3 112 0 112h66zm22 51c-2-2-4-4-4-1v2l2 3c3 0 3 0 2-4zm29-27a2521 2344 0 0 0 64-45l10-6 12 11 10-7 11-9-1-25h-68c-82 0-71-6-73 44v42l7 4c8 5 7 5 28-9zm-693-70v-10l-20-1c-25-1-26 0-26 6 0 8-1 7 18 10l18 4c10 2 10 2 10-9zm825-6 5-4h-6c-8 0-9 2-8 7 1 3 1 3 9-3zm-951-36c7-78 59-121 198-164 37-11 38-12 36-14l-14-8c-16-12-21-12-64-3a301 280 0 0 0-238 205l41 1h40zm263 15 4-4c19-11 66-47 66-50l-4-8c-20-31-55-107-55-120 0-5-4-3-46 9-147 44-193 76-211 146-2 8-4 27-1 28 1 3 246 1 247-1zm199-21v-65l-6-2c-11-5-11-5-24 5l-54 38c-24 19-24 18-31 11-6-6-6-6-18 3l-8 6v12l1 14 71 1 69-1zm83 22v-113a895 833 0 0 0-52-1h-13c-2 1-3 112 0 114 0 3 64 1 65 0zm70-64c0-61 0-65-3-64l-44 11-7 2v115l27 1 25-1zm71-10-2-75-14 5-34 10-5 1v66l1 67 27 1 25-1zm82 73V868a209 209 0 0 0-60 97l4 9 6 11 1 6h7c25 4 34 30 14 41l-5 4v10c-1 15-4 18-20 28l-4 8-7 15c-4 0-6 156-2 161 2 3 65 1 66-1zm158-63v-66l-15 7-22 9c-38 13-51 17-76 23l-29 9v82l71 1h71zm178 64c3 0 3-1 3-11v-10l-6-1c-21-5-32-20-27-36 2-3 0-4-4-8-5-5-8-12-8-18 0-4 0-4-6-4-15 0-20-6-23-26-8-47-8-57-3-66 8-10 6-9-22 9-18 11-58 32-65 33-2 1-2 5-1 59 0 83 0 78 4 79zm61 0v-6l-1-6-13-3a235 219 0 0 1-27-3l-1 18zm103-1c31-56 19-126-29-170-16-15-43-21-28-8 5 5 9 14 10 23l3 13c3 6 4 23 3 42v17c0 11 0 13-3 18l-5 15c-2 19-19 36-35 36-3 0-4 13-1 15 1 3 84 1 85-1zm67 1a724 674 0 0 0-35-178c-6-18-5-17-18-14l-19 3c-16 3-16 1-8 10 16 18 21 26 35 52 17 36 16 84-4 126 0 2 46 4 49 1zm-1029-6c0-8-1-6-16 5-1 1 3 1 7 1h9zm881-24c12-5 17-11 17-21 0-5 1-10 5-17 4-11 4-13 3-19l1-30c0-8 0-11-2-18-3-5-4-13-4-18-3-21-15-27-50-25l-42 3c-27 1-38 6-34 17 3 8 4 8 46 8 40 0 41 0 41 6 0 7 0 7-44 9h-42l-4 3c-5 7-5 14 2 19l4 4h40c45 0 47 0 45 7-1 6-1 6-44 6h-40l-3 4c-4 3-5 9-2 14 2 5 20 9 59 10 28 0 32 1 30 7-2 8-1 8-48 6-27-1-32-1-32 5 0 9 16 14 50 19l17 3c11 2 25 1 31-2zm-822-23a1589 1478 0 0 0 61-45c18-12 18-9 3-35a730 679 0 0 1-43-97 2043 1900 0 0 1-103 28l6 16a603 561 0 0 0 62 131c4 8 4 8 14 2zm-428-28c50-77 140-131 237-143 12-1 13-1 5-7l-12-9-7-5a957 890 0 0 1-109-113c-8-10-11-7-26 18l-10 18a1164 1083 0 0 0-44 87c-23 47-53 151-53 180v5l7-12zm862-21a815 758 0 0 0 214-89c3 0 0-3-4-3-38-8-38-10-29-37l8-21c2-15 6-16 26-6 22 10 64 21 68 17l2-48a17844 16595 0 0 1 5-213l1-41-4-4a543 505 0 0 0-199-93l-2-1c-2 1-11 0-20-3-50-10-71-11-71-3 0 5-3 12-6 16a22364 20799 0 0 0 0 533zm40-61c-16-17-12-58 4-48 12 9 19 33 12 48-4 8-9 8-16 0zm58-110c-12-9-19-29-15-43 7-21 32 5 31 30-2 16-7 19-16 13zm123-66c-19-5-34-34-24-49 2-5 2-5 10-1 16 8 26 25 23 42-1 7-4 9-9 8zm-178-39c-14-8-19-34-12-49 11-18 32 16 27 39-4 13-8 15-15 10zm57-61c-16-10-26-34-20-47 3-6 14-2 23 8 15 16 13 49-3 39zm157-7c-30-14-38-51-10-41 15 5 26 20 26 33s-3 14-16 8zm-95-88c-18-9-31-35-23-46 9-14 35 12 35 35 0 14-2 16-12 11zm-123-21c-16-13-23-36-15-51 5-8 16-3 23 12 11 17 4 47-8 39zm228 452c2-1 2-1-1-5-9-11-8-24 1-34 4-3 4-3 2-7-7-10-3-26 9-32 7-3 5-4-8-4h-12l-5 5c-10 9-11 20-6 47l3 16c1 12 9 19 17 14zm-604-4c0-3-2-5-4-2 0 4 2 6 3 6zm40-21c57-1 62-1 117-16 45-12 72-22 76-30 1-2 1-5-1-5a1374 1278 0 0 1-81 16l-13 3-1-3c-7-7-3-11 21-15a1068 993 0 0 0 47-10c44-8 55-13 53-23l-1-5-7 1a429 399 0 0 0-77 11l-23 4c-13 3-20 1-20-6 0-5 8-8 44-13a1299 1208 0 0 0 70-11c24-4 36-11 28-18-6-5-20-5-54 0l-69 10c-24 3-30 2-30-5s6-8 92-19c31-4 34-5 27-14-8-7-93-1-166 10-22 5-24 5-26 1-4-8-2-10 24-14 20-4 24-5 36-17 27-25 27-42-1-26-11 6-34 16-61 26-34 15-40 19-52 33-12 13-29 28-38 33-11 6-11 6-6 20l6 15a720 670 0 0 0 38 68zm687-67a694 645 0 0 0 115-20l-10-32-14 5c-51 23-119 20-129-6-2-3-2-2-10 5-28 23-77 23-128 0l-12-5-4 12a664 618 0 0 1-5 20 501 466 0 0 0 197 21zm-923-5c3-1 3-2 1-7 0-7 2-8 11-12a185066 172113 0 0 1 107-28c8-1 10 0 13 5s16-1 32-20l28-25 4-4V798c0-164 0-170-2-174l-4-11c-3-6-3-7-6-7-8 0-38 3-57 7-32 5-30 5-35 8l-16 3a519 519 0 0 0-231 130c-27 24-79 85-79 92a616 573 0 0 0 218 210c5 5 9 5 16 2zm-18-30c-8-13 4-47 21-52 5-1 10 10 9 22-1 19-22 39-30 30zm90-43c-3-4-4-15-3-23 2-11 7-17 19-27 11-10 17 19 8 35-7 13-19 21-24 15zm-118-67c-8-14 7-45 24-49 18-2 10 39-10 47-8 4-12 4-14 2zm-98-10c-14-15 2-64 17-50 9 11 5 40-7 51-5 5-5 5-10-1zm272-29c-9-14-3-41 12-51 18-11 20 32 4 47-7 7-13 9-16 4zm-56-58c-9-15 5-49 24-54 19-4 5 44-16 54l-5 2zm-162-9c-8-15 11-40 31-42 19-3 8 32-13 41-11 6-15 6-18 1zm98-91c-4-11 9-42 16-38l1-2c2-2 11-7 15-7 4 1 5 7 5 15-2 22-33 47-37 32zm127-17c-8-9-7-31 1-44 14-20 27-15 26 9-2 19-20 42-27 35zm716 308c11-4 19-10 22-16 2-5 2-35 2-346 0-359 0-348 6-344l1-1c-3-3 4-1 5 1 3 3 3 37 3 344l1 345c3 7 28 22 36 22h3v-41a7654 7118 0 0 0-4-129 12716 11826 0 0 0-7-343 8429 7839 0 0 1-5-215c0-66-1-98-4-110a354 329 0 0 0-25-69c-4-8-4-6-12 16l-10 21c-8 19-11 32-12 78a18925 17601 0 0 1-9 382 3345 3111 0 0 0-4 154l-2 50-1 62-1 47-2 61v37l6-1zm126 1c12-2 25-7 25-8 0-5-48-92-55-100l-2-4v40a4806 4470 0 0 1 4 76c2 1 16-1 28-4zm-642-44c15-2 15-3 6-34-7-17-27-55-43-73a339 316 0 0 0-83-71c-4-6-4-1-4 26v29l13 11c22 21 40 44 48 64 6 12 6 12 18 4 24-14 37-12 44 4 3 11-4 32-15 37-2 3-1 5 2 5zm71-4h20v-5l3-8c16-43 36-73 68-100l7-5v-29c0-32 0-31-7-26-36 21-78 62-98 96-17 28-32 62-32 74v4h10zm-183-11c24-8 40-15 40-18 0-6-23-40-36-54-15-17-16-18-15-9a3538 3290 0 0 1 0 84zm140-31c16-38 38-70 71-101 11-11 11-13-1-9-43 11-100 11-147 0-20-5-20-5-8 5 31 28 65 77 76 111 3 7 4 6 9-6zm583-73c4-4 3-6-1-9l-3-3v8c0 9 1 9 4 4zm-548-45a361 336 0 0 0 54-12 211 196 0 0 0 49-23c3-2 4-49 1-49l-5 3c-83 54-196 56-275 3-11-7-11-8-10 18 0 27-2 23 22 35 52 23 115 33 164 25zm-1-56c40-8 79-24 103-45l5-5-1-24c0-21-2-26-3-22l-11 15-4 6-8 10c-20 37-95 32-116-8l-1-3-4 5a86 80 0 0 1-54 31c-33 7-47 1-69-35-20-30-23-30-23 2v25l5 4 4 5 2 1 13 7c19 11 39 19 64 27 27 7 68 9 98 4zm-90-56c32-9 43-24 43-58v-22l4-4c4-2 4-2 7-1l4 1v23c1 36 25 64 54 64 10 0 10 0 2-10-12-17-14-18-14-39s2-25 10-28c7-1 8 4 7 21-2 24 12 53 24 53 10 0 13-10 4-25-8-14-8-15-3-19l4-2 4 2 8 10c5 11 7 10 11-2 5-14 5-31 1-53-4-18 0-24 11-18 4 3 9 28 9 45l1 4 2-1 5-8c12-17 12-39 1-64-5-10-2-16 6-16 6 0 10 10 14 32l3 9 4-7c11-18 12-30 3-54a465 433 0 0 1-15-50c0-2-3-1-7 7-13 26-32 52-38 52-3 0-3 4 1 12 7 20 1 26-13 19l-16-9c-3-4-8 0-8 5-4 36-57 44-71 11-4-10-15-10-22 0-17 31-52 29-68-3l-5-10v-5l1-5 3-5c0-13 21-30 37-30l19-8c11-5 15-6 16-5 3 3 1 8-3 12-2 2-4 3-1 3h21c6 0 6-2 2-2l-3-3v-5c-1-2 1-6 4-6s23 13 23 14l2 1c24 1 30 5 41 21 8 13 9 15 17 20 12 9 12 8 7-11-7-26-24-41-59-52l-16-5-8-4-10 4c-10 4-12 5-17 1-9-4-12-5-19-2-6 1-10 2-37 14a80 80 0 0 0-42 48c-9 27-20 22-13-7l1-7-8-9-12-13-5-9-16-27c-3-7-4-4-8 12-4 19-8 31-11 36-8 14-6 32 3 51l7 10 1-10c4-17 8-27 11-30 5-2 10-1 12 4 0 2 0 5-7 22-3 10-4 14-4 25v13l7 12c5 9 12 16 9 10l4-35c4-17 19-16 16 0-5 28-5 39 1 55 7 15 7 16 12 6 6-11 14-16 19-11 3 4 1 9-7 22-6 9-6 11 0 18 7 6 7 6 15-4 12-14 14-20 14-41 0-20 2-27 9-24 15 5 8 53-9 72-8 8-6 8 14 2zm-211-92c1 0 1-3-1-9-8-19-8-21-8-41 0-29 1-35 25-72 19-29 27-47 35-95 4-21 12-33 27-49 16-14 28-20 77-39 30-10 47-18 62-31 10-7 9-10-7-7l-25 3h-11l-8 8-10 7c-2 2-8 4-9 6l-56 27c-44 22-49 29-56 77a250 232 0 0 1-12 48 279 260 0 0 1-32 56c-24 34-26 71-7 97 5 6 13 15 15 14zm528-2c33-19 33-69 0-119-27-43-35-60-37-93-6-51-12-59-95-95l-16-8-7-4-11-9-10-10-20-1-26-4c-7 0-7 0 0 7 12 12 28 21 64 34l23 8c45 14 73 42 80 82a235 219 0 0 0 31 84c32 50 39 86 23 118-7 12-7 15 1 10zm-491-2 26-4c16-2 15-1 9-10-9-17-10-44-2-61 5-8 5-11 12-43 8-31 8-37 2-24a184 172 0 0 1-24 41l-6 11-4 4-6 11c-9 18-8 36 4 43 15 8 4 18-11 10-10-5-13-12-13-27 0-22 3-28 24-58 27-38 35-62 36-113l3-27c1-4-1-3-7 3-9 12-12 19-20 59-4 20-13 47-20 56a559 520 0 0 0-25 42c-15 21-14 68 4 86 5 5 2 3 18 1zm474-10c17-27 12-57-16-102a239 222 0 0 1-34-87c-4-20-12-41-19-46-4-4-2 56 2 72 6 24 16 44 33 67 22 30 27 48 23 66s-29 28-29 13l5-5c19-10 15-30-11-66l-20-30-7-14v9c2 11 8 37 14 48 9 27 9 27 9 40-1 15-4 25-11 34-4 6-2 6 3 6l12 2 14 3 13 1c8 1 12-1 19-11zm-288-5c12-4 22-20 12-22-8-2-9-8-2-12 2-2 2-2 12 0 12 3 25 3 34 0 10-3 15-2 16 3 0 4-2 9-6 9-8 2 0 13 13 21 11 5 24-6 26-21s-9-30-18-26h-12c-8-3-12-3-20-2h-36l-17 2h-12c-8-4-19 9-18 22 2 16 18 30 28 26zm-67-63c11-15 26-26 53-36l13-4c4-1 4-1 4-8 0-3 0-5 3-6l12 3 12 6 12 5 5-3 11-7c9-6 18-4 18 4-1 5 2 6 23 12 18 5 32 16 44 31 7 9 6 9 16-2 7-10 10-13 22-36 18-36 25-79 20-130l-2-13-13-7-29-12c-48-15-86-37-99-58-2-3-36-3-39 1-16 20-39 37-67 46a551 512 0 0 0-69 30l-3 8-1 9 1 67c3 28 7 40 21 66 19 35 26 42 32 34zm122-79c-7-11-1-75 7-74 6 0 6 2 4 17l-2 35c2 26-2 32-9 22zm-108-32c-6 0-14-9-14-15s-2-6-13-1c-13 7-23 1-12-8 25-19 60-19 84-1 11 9 7 19-5 13-12-9-13-9-16 0-3 8-12 13-24 12zm174 0c-8-2-15-9-15-16 0-5-4-5-12 0s-8 5-12 4c-10-5 6-19 27-25 17-4 46 1 57 11l4 2c4 3 5 8 1 10-2 4-6 3-13-1-8-5-13-6-13-2 0 6-6 12-12 16-6 1-7 2-12 1zm-229-45c-4-3 3-13 12-17l8-4c17-11 63-9 86 3 12 6 13 7 13 11 0 9-4 9-17 4-22-10-53-13-70-7l-15 7c-12 5-14 6-17 3zm274-5a87 81 0 0 0-84 2c-12 6-20 0-11-9 24-21 83-21 111 0 13 11 1 16-16 7zm33 112-1 1v2zm50-156c0-7-16-28-23-30l-64-18c-13-1-1 7 24 16 21 9 33 15 48 24 14 9 15 10 15 8zm-416-2c2-2 46-26 51-26l33-16c8-5 6-5-16 0-26 6-46 11-53 15l-17 27zm34-48a662 615 0 0 1 208-23l27 3c36 2 104 15 119 22 8 4 10-2 20-34a887 825 0 0 1 29-90l15-47c-1-1-15 13-19 20-4 8-6 10-14 7-18-6-35 4-35 19 0 8 10 20 20 20 5 0 9 5 8 10-18 36-68 38-86 3-4-7-4-7-10-1a51 47 0 0 1-63 6c-26-15-40-58-16-46 21 10 45-10 35-29-7-14-18-17-37-9-8 4-12-3-6-13 12-21-16-59-32-42l-8 9c-7 7-11 25-7 32 5 11 1 18-9 13-24-10-46 17-28 36 5 6 25 8 32 3 10-10 16 5 6 23-17 32-63 41-88 17-5-5-7-5-9 1-15 31-60 33-80 3-8-11-7-16 5-16 9 0 19-16 16-26-4-13-21-19-36-13-5 3-11 1-12-4-2-7-4-10-11-17-11-10-11-10-4 11a3765 3501 0 0 1 50 149c2 8 0 8 20 3zm56-36c-7-6-7-11 2-19l4-2 7 2c11 5 11 9 4 19-5 6-9 6-17 0zm218 4c-10-8-10-15 1-22 8-5 9-3 15 4 6 9-7 24-16 18zm-254-50c13-4 18-14 22-37 3-10 12-8 19 3 15 25 42 30 64 13 8-7 8-8 4-8-21-5-29-8-36-21-4-7-4-10-4-20v-11l-12 4a278 259 0 0 0-44 17l-13 5c-8 4-10 5-10 14-1 10-10 26-20 31-9 5 16 15 30 10zm326-1c10-4 13-9 5-13-11-4-17-15-17-26v-11l-20-9c-19-9-46-18-55-21-4 0-4 0-4 4 5 21-9 42-32 46-11 1-11 1-7 6 16 22 54 16 68-11 8-13 15-10 19 7 3 18 7 23 19 28 6 2 17 2 24 0z"/><g fill-rule="evenodd" stroke-opacity="0"><g fill="#ce2a29"><path d="M835 919c-4 1-1 4 1 5 19 19 35 42 48 66 6 9 9 20 13 30 3 3 5-2 6-4 10-23 21-46 37-65 7-10 16-18 24-27 1-3-2-4-4-3a245 245 0 0 1-123-1l-2-1zM791 966c-2 2 0 6-1 9v64c2 2 6-1 9-2 10-4 21-7 30-13 3-3-1-7-2-10a199 199 0 0 0-36-48zM1008 966c-6 3-9 9-13 14-13 16-24 34-30 53l-3 12 8 22c4 1 8 0 11 2 9 3 16 14 11 23-2 4-7 6-10 10-1 8 0 19-7 25-4 3-10 5-11 10-2 8-7 15-7 23-2 36-2 73-1 109 0 4-1 10 2 13 5 2 11 0 16 1 11-1 23 0 34-2 2-3 0-8 1-11V969c0-1 0-3-2-3zM791 1188c-2 9 0 18-1 27l1 65c1 5 7 2 10 3l40-1c2-2 1-6 1-9v-83c-2-2-6-1-9-1-14-1-28-2-42-1zM791 1294c-2 6 0 13-1 19v294c0 2 1 6 4 3 22-20 36-47 45-75 1-4 3-9-1-12-3-2-6-4-7-8-1-3 0-8-4-10-6 0-14-2-17-9-4-8-2-18 5-24 4-3 1-9 2-14 0-7 8-11 12-15 6-5 4-13 9-18 2-3 6-4 5-8l-1-123c-3-2-8 0-12-1h-39zM985 1292l-27 1c-2 3-1 7-2 11v77c-1 6 6 4 9 4h44v-91c0-4-7-1-10-2h-14zM1006 1533c-13 4-25 9-37 15-4 2-1 6 0 9 9 17 20 34 33 49 2 2 3 6 6 5 2-6 1-13 2-19l-1-57-3-2zM899 1561c-4 4-5 10-8 15-12 28-30 53-52 74-1 3-6 5-4 8 5 0 9-3 14-4 22-6 46-4 70-3 14 0 29 4 43 6 4-1 0-5-1-6-15-15-29-31-40-49-8-12-13-26-20-39l-2-2zM1020 2161c-11-1-19 10-21 19-2 5-2 12-7 16-3 0-5-4-7-7-9-11-21-21-35-20-10 1-19 7-23 16 1 3 5 3 8 3 13 2 26 14 26 28-1 2 0 5 3 4 11-4 22-7 32-12l25-14c2-4 4-9 7-12l11-11c2-4-3-7-6-8-4-2-9-2-13-2zM776 2160c-5 0-12 2-15 7-2 4 3 7 6 10 4 5 7 10 9 16 4 7 13 8 20 12 12 4 23 10 35 13 4 2 7-1 8-5 2-10 9-20 20-24 4-1 9 0 12-3 1-4-4-7-6-10-8-7-21-9-30-4-10 4-17 12-23 21-1 1-5 6-7 2-4-6-3-15-8-22-4-7-12-14-21-13zM1272 1292c-33 0-65-1-98 1-5 0-9 2-12 5l-46 38c-2 2 2 5 2 8 15 26 27 53 37 82 2 5 2 11 5 16 4 4 9 0 13 0 27-9 56-17 82-28 23-9 46-20 64-38 21-18 35-43 37-70v-14h-84zM636 1131c-15 2-29 8-43 12-36 12-72 25-103 47-20 13-34 32-41 54-5 12-7 25-5 38 25 2 50 1 75 1 37-1 74 0 110-2 18-13 36-26 53-42 3-4-2-9-4-13-14-27-27-55-37-84-2-3-1-7-3-10l-2-1zM837 349c-14 4-27 10-40 16-6 3-13 5-18 9l-3 15c-3 7-7 13-13 18-2 1-2 4 0 5 7 5 16 6 24 4 8-3 12-10 14-17l4-16c2-3 4-2 6-1 5 4 7 11 11 15 7 8 17 12 27 10 8-2 16-7 22-13 1-3-3-3-4-3-9-3-19-6-24-14-3-5-4-10-4-15v-12l-2-1zM964 349c-3 0-3 4-3 6 0 6 1 12-2 17-4 9-12 15-22 17-2 1-5 0-7 2 0 3 3 5 4 7 7 9 21 11 31 7 9-4 16-11 21-19 1-2 3-6 6-5 4 3 4 8 5 13 1 7 3 15 11 19 6 4 13 4 20 3 4-2 9-3 11-8 0-3-5-5-7-6-7-5-10-14-10-22 0-2 1-6-1-7-18-8-36-18-55-24h-2z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/></g><g fill="#c48d35"><path d="M899 296c-7 2-11 9-15 15-4 8-6 17-2 25 1 3 1 9-3 8-7-2-15-5-21 0-10 6-13 22-5 30 8 7 20 7 28 1 4-2 4 4 4 7-1 16-15 30-30 34-14 4-28 0-38-10-2-1-6-3-7 0-4 10-13 19-24 21-16 2-33-8-38-23-2-4 3-5 6-5 9-2 13-12 13-20-1-12-16-18-27-14-3 1-8 3-9-2-3-7-8-15-14-19-4 1-1 6-1 8 6 23 15 46 22 69 6 21 11 42 18 62 4 4 9 0 13 0a511 511 0 0 1 251-4l19 6c6-2 7-9 9-14 7-28 15-56 24-83 5-14 10-28 13-43-2-2-5 2-6 3-6 5-9 13-14 18-7 0-14-3-21 0-10 2-16 15-9 24 3 6 8 9 14 10 4 1 5 5 2 8-6 14-22 22-36 19-12-1-20-11-26-21-1-3-4-2-6 0-10 9-25 14-38 10-15-5-26-19-30-34 0-3 0-8 4-6 7 3 16 5 23 1 10-5 13-19 6-28-3-7-12-10-20-7-3 0-7 4-11 2-2-5 3-9 3-14 1-8-1-16-5-23-3-5-9-10-16-11zm-81 141c4 1 12 4 9 9-1 4-5 11-10 7-5-2-8-8-4-12 2-2 3-4 5-4zm164 0c7 3 8 12 2 16-4 5-10 0-12-5-1-6 6-10 10-11zM1008 848c-14 8-27 17-42 22-22 9-45 14-68 13-36 1-71-10-101-31-2-1-6-4-7 0-1 12 0 24 1 35 6 7 14 9 22 13a213 213 0 0 0 182-3l14-9c1-13 2-26 0-39l-1-1zM791 902c-3 1-1 6-2 8v39c20 18 37 40 48 65 1 3 4 6 7 3 8-4 17-11 27-10 7 1 11 9 10 15 0 9-4 18-11 24-3 2 0 6 3 5 6-1 13-1 18-4 4-5 1-12-1-18a228 228 0 0 0-96-125c-1 0-1-2-3-2zM1007 903c-9 4-16 11-24 17-27 23-49 51-64 84-6 13-12 27-14 42 4 3 10 0 14 1l32-1c2-2 1-6 3-8 10-32 26-62 51-83 5-3 7-7 6-12-1-13 0-26-2-39l-2-1zM722 1096l-62 17c-5 2-11 2-15 5 0 6 3 13 5 19 11 37 27 72 47 104 4 4 8-2 11-3 18-14 37-28 54-43 3-5-1-10-3-14a598 598 0 0 1-37-85zM579 1110c-12 1-23 4-35 6a227 227 0 0 0-173 164c-1 3 2 2 4 2 19 1 38 2 57 1 2-1 1-4 1-5 1-15 3-30 8-43 7-21 22-38 39-50 25-18 53-30 82-41l45-16c1 0 4-2 2-3-6-5-12-10-19-13-3-2-7-2-11-2zM503 1449c-39 0-77 6-114 16-3 1 0 6 0 9l6 21c6 0 11-3 16-5 16-8 34-13 52-12 15 0 29 7 39 16 2 2 4 2 6 0 10-10 24-14 37-15 18-1 36 0 52 7 6 2 12 7 18 10 4-4 3-11 6-16 1-5 4-10 2-15-4-2-9-2-14-3-35-8-70-14-106-14zM418 1293c-10 17-16 38-15 58-1 22 6 43 17 62 7 11 16 21 26 30l13-1c2-3-1-6-2-9-4-10-5-21-9-32-3-12 1-24 1-36 0-10 2-19 5-28 3-12 9-25 21-31 3 0 6-1 6-4s0-8-2-10h-61zM500 1292c-4-1-8 1-8 5-1 3 0 8 5 8l28 6c4-2 3-8 3-12 1-4-1-7-6-7h-22z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M767 1206c-5 0-8 4-12 7l-51 39c-2 2-6 4-8 2-3-2-5-6-9-5-6 2-10 7-15 10-1 6 0 12 1 18 0 2-1 6 2 5l83 1 21-1c2-2 1-5 1-8v-63l-7-4-6-2zM747 1292l-73 1c-2 1-1 4-1 6l-1 94c1 3 5 1 7 1 17-7 35-14 53-19l46-13c2-2 1-6 2-8v-61c-2-2-5-1-8-1h-25zM897 1660c-35-1-69 9-100 25-3 2-9 2-7 7l-1 34c3 3 6-1 9-2a186 186 0 0 1 205 0c2 2 6 4 7 0 1-11 0-23-1-35-6-4-13-6-19-9a205 205 0 0 0-93-20zM915 1522c-4 0-9-1-10 3-2 10 2 20 5 29a230 230 0 0 0 97 120c3 1 2-4 2-6 1-14 2-28 1-41-13-13-26-26-36-42-6-9-12-19-15-30-3-3-7 1-10 2-8 5-17 11-26 7-8-4-7-14-4-21 2-7 7-13 11-20-1-3-5-1-7-1h-8zM888 1525c-12 1-25 1-37 3-3 2-2 7-3 10a172 172 0 0 1-59 88v37c1 4 0 8 2 12 4-1 8-4 12-7a221 221 0 0 0 89-125c1-5 4-11 2-16-1-2-4-2-6-2zM852 1292v121c7 0 12-5 18-7 7-2 15-5 23-6 3-2 0-7 1-11v-96c-3-2-8 0-11-1h-31zM904 1292v85c0 6-1 12 1 17 2 1 6-1 9-1l30-7c4-3 2-9 3-13v-80c-2-2-8 0-11-1h-32zM945 1161c-14 3-27 8-40 12-2 3 0 8-1 12l1 95c0 4 6 2 9 3l31-1c2-3 1-8 1-12a2437 2437 0 0 0-1-109zM891 1177l-39 10v95h35c2 0 7 1 6-2 1-33 2-66 1-98-1-2 0-5-3-5zM1338 1130c-2 0-5 2-3 4 6 7 10 15 11 24 3 9 4 18 4 27v39c-4 8-6 18-9 26-4 9-12 17-22 18-4 3-4 9-2 13 3 4 10 1 14 2l49-1c5-2 6-9 8-14 13-34 9-75-11-106-9-13-20-26-35-31l-4-1zM1274 1265c-2 2-1 6-2 9 0 4-2 10 4 8l30-1c0-3 1-8-2-11-10-3-20-3-30-5zM1293 1079c-7 5-13 11-21 14-17 7-35 6-52 2-13-3-25-10-37-14-4-1-3 5-4 7l-5 20a372 372 0 0 0 234 1c4-1 0-6 0-8l-7-20-15 6c-22 9-46 13-69 8-9-2-19-6-23-15l-1-1zM1366 1292c0 24-6 48-19 68-21 30-55 49-88 63-23 10-47 17-71 24-3 0-3 4 0 5 7 5 14 10 22 13 14 1 28-3 43-6 35-9 71-24 99-47 34-27 58-64 72-104 1-5 4-9 4-13-4-5-11-2-17-3h-45zM1125 1175c-21 12-43 19-66 27l-40 12v67c2 2 6 1 9 1l98 1c2-3 0-8 1-12v-95l-2-1zM1051 1292c-9 0-19-2-27 3-7 4-4 13-5 20v47c3 3 7 6 12 7 10-5 18-12 27-19l43-31 9 8c6-4 12-8 17-14 0-7 0-14-2-21h-74z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="m1098 1331-47 37c-6 4-13 8-17 14 16 29 30 59 38 90 1 4 3 9 7 8 22-5 43-12 65-18 4-1 11-3 9-8-8-40-27-76-45-111-3-4-5-10-10-12zM1042 2094c-20 5-40 11-60 14a455 455 0 0 1-206-9c-7-1-14-4-21-4-3 2-3 7-4 10-12 41-26 81-37 123-1 2 1 4 3 3 7-6 13-12 16-20 1-2 2-3 4-2 7 4 17 5 23-1 8-6 7-17 1-23-3-4-7-7-12-7-3-3 0-8 1-11 8-12 25-19 39-13 9 4 16 13 22 21 2 1 4-3 6-4 9-7 20-11 32-10 15 0 29 10 33 25 1 4 3 10 0 14-3 2-6-2-9-2-9-3-17 1-22 8-6 9-1 22 9 25 6 3 12 2 17-1 3-1 6 0 6 3 0 8-4 16-2 24 3 9 10 17 16 24 2 2 4 1 6-1 7-8 17-18 16-31 0-6-5-12-4-18 4-3 9 1 12 1 12 4 25-6 24-18 0-13-17-22-28-15-2 1-8 3-8-2 0-8 4-17 9-24 7-9 19-14 31-13 11 0 21 8 30 14 4 3 6-2 8-5 6-11 19-19 32-17 11 2 21 8 27 18 1 2 2 6-1 8-6 2-13 4-17 11-4 5-3 12 2 16 6 7 16 10 24 4 2 0 4-3 5 0 4 6 7 12 12 16 2 2 4 6 7 6 2-2 0-6-1-8-10-43-25-86-38-129h-3zm-226 31c5 1 9 4 11 7 0 4-5 6-7 9-2 1-4 2-5 0-3-2-7-5-6-9 1-3 5-6 7-7zm166 0c4 1 8 4 11 7-1 3-5 5-7 8-4 3-9-1-12-4-3-4 3-11 8-11z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/></g><g fill="#6b4424"><path d="M931 474c-2 0-4 2-2 4 9 10 20 17 32 23 18 8 37 13 54 21 18 9 32 25 38 43 5 13 5 27 9 40 5 20 14 38 24 55 12 21 20 44 16 67-1 9-5 16-8 23-1 2 1 5 3 3 15-7 22-25 22-41 0-23-11-44-22-63s-22-39-24-61c-2-16-2-34-12-48-10-13-26-19-40-27-16-9-34-15-46-28-4-3-6-8-11-7l-33-4zM990 482c-3 0-4 3-2 4 9 7 20 10 30 15 13 6 25 14 37 21 2 2 3-2 2-3-3-8-8-15-14-22l-43-13-10-2z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M1034 551c-2 1-1 5-1 7 0 15-1 31 1 46 3 23 14 43 27 63 7 12 16 24 16 39 1 8-1 17-7 22-3 2-8 5-12 3-2-3 1-6 3-7 4-4 9-8 9-15 0-13-9-25-15-36l-22-37c-1-3-3 0-2 2 1 22 10 42 16 63 1 8 1 17-1 26l-8 17c2 3 6 2 8 3 10 2 20 5 30 4 7-1 10-8 13-14 9-17 5-38-2-55-9-21-23-39-29-60-8-21-8-45-18-65-2-2-3-6-6-6z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M779 650c-3 2-3 7-5 11-2 12-5 24-10 35-5 15 0 31 8 44 2 2 4 0 3-2 2-9 4-18 8-27 2-4 9-2 8 3-3 11-8 22-8 34 0 5-1 10 1 14 3 7 6 14 12 19 2-2 1-7 2-10l3-24c1-3 3-7 6-6 5 3 3 8 2 12-2 11-2 22-1 33 2 6 4 13 8 18 2 3 5-2 6-4 2-4 5-10 10-10 5 1 2 6 1 9l-8 15c0 5 4 9 8 12 3 2 6-3 8-5 5-7 10-14 10-23 2-9 0-19 3-29 1-3 5-1 6 2 4 6 3 13 2 19-1 14-6 27-14 38-2 1 0 3 2 3 11-3 22-6 32-13 9-8 13-20 13-32v-23c2-2 4-6 8-4 3 1 0 6 1 9 0 12 0 24 5 34 5 11 14 22 26 26 5 2 11 3 17 1 2-2-2-4-2-6-5-8-12-16-11-25 0-9-2-18 1-26 1-3 7-6 8-2 1 12-1 25 3 37 3 7 6 15 13 20 5 2 12-3 11-9 0-8-7-15-8-23 0-2 2-4 4-4 6 3 8 10 12 15 2 1 4-2 4-4 4-8 6-17 5-27l-3-29c0-2 0-7 4-7 5 1 5 8 7 12l4 29c2 2 4-2 4-3 5-8 10-16 10-26 1-12-3-23-7-34-2-3 0-9 4-8 6 2 6 9 8 14 1 6 1 12 4 18 3 1 3-3 5-5 3-7 7-14 7-23 0-11-6-22-9-33l-7-29c-2-3-4 0-5 2-8 15-15 30-27 43-2 2-7 2-5 6 1 7 5 14 3 21-1 4-6 2-8 0-2-1-3-1-2-2 0-8-3-15-5-23-6-15-20-24-34-30l-26-10c-5 1-10 5-16 5-6-1-11-5-17-3-13 3-25 9-36 16-14 9-22 24-27 40-2 3-3 7-6 8-2-4-1-9-1-13s3-9 1-12c-7-10-15-19-21-29l-11-20h-1zm130 23c7 3 12 8 18 12 8 1 18 1 24 8s10 18 18 24c-2-3-6-3-8 0-2 7-3 14-8 20-10 11-29 11-39 0-4-4-5-11-11-14-5-1-10 3-13 7-4 7-10 14-18 16-12 3-23-6-28-15-2-5-6-9-6-14s3-9 4-14c5-10 15-17 25-19l25-10c3-1 2 4 1 5-1 2-4 4-4 6 4 2 8 1 12 1 3 0 7 1 10-1 1-3-4-3-4-5s-1-7 2-7z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M769 547c-4 2-7 7-10 11-6 12-8 26-11 40-4 18-8 38-19 54-7 12-15 24-20 38-3 10-2 22-2 33 1 9 4 19 11 26 1 2 3 4 6 3l37-7c2-2-1-5-2-7-6-15-8-31-3-46l7-19 8-42c1-2-2-4-3-2-5 12-10 24-17 35l-11 16c-5 10-11 23-7 35 1 5 6 8 10 12 2 2 1 6-2 5-7 0-13-4-16-10-2-7-2-15-1-23 2-16 13-28 20-41 11-17 19-35 22-55l4-49c-1-2 1-6-1-7z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M867 474c-11 1-22 4-33 4-8 8-17 15-26 19-20 11-41 20-59 33-11 8-16 22-18 35-3 19-5 39-13 57-6 16-15 31-25 45-7 13-12 27-11 42-1 17 7 33 20 44 2 1 4-1 3-3-2-10-7-19-7-29 0-14-1-29 6-42 9-20 24-38 30-60 6-16 7-34 12-50 4-16 15-31 30-40 15-10 32-16 48-22 15-6 30-13 42-24 2-2 7-4 6-7-1-2-3-2-5-2zM811 482c-17 3-33 8-49 12-3 2-7 2-8 6l-11 19c1 3 4 1 5 0 20-13 43-22 64-33 2-1 2-4-1-4zM848 1744c-2-1-4 3-2 4 8 9 15 19 16 31 1 9 1 18-3 26-1 2-6 4-7 0-2-7 1-14 0-22 1-6 0-13-4-18-5-6-9-12-15-16-3-1-5 3-7 5-3 2-3 6-1 9 2 6 7 10 8 16 0 4-5 4-8 2-4-3-5-8-9-11-3 0-4 4-5 6-5 15-5 31-2 46 1 3 3 7 2 11-4 2-8-1-10-4-5-11-3-24-4-35-2-3-4 1-5 3-6 9-11 20-10 32 0 9 2 18 6 26 1 3 3 8-1 10-5 2-7-3-8-6l-6-20c-2-2-5 1-6 3-6 10-8 23-5 35 2 7 9 12 10 19 0 3-5 2-7 1-10-5-14-18-14-29-1-12 5-23 9-34 0-3-4-2-6-3l-33-6c-6-1-8 6-9 10-6 13-7 29-4 43 3 17 12 31 19 46s16 29 20 45c3 14 2 29 7 43 3 6 7 13 12 18 2-2 0-7 1-10 0-16 0-33-2-49-4-16-11-32-18-46-7-13-16-25-21-39-5-13-6-28 1-41 4-5 11-9 17-7 3 2 3 6 0 7-5 3-10 6-11 12-2 9-1 19 3 28 7 20 21 37 29 56l6 15c3 0 2-5 3-6 5-18 9-36 18-52l20-25c3-6-1-11-2-17 0-3-1-9 3-10l21 8c2 1 5 3 6 0 4-10 10-22 22-25 10-4 19 2 27 7 5 4 13 7 19 3 8-5 17-13 27-11 11 2 18 13 23 22 1 4 3 7 6 4 7-2 13-7 20-8 5 1 4 7 4 10 1 5-1 10-2 15 11 11 19 24 26 38 7 13 12 27 13 42 0 1 1 5 3 4 4-5 4-10 7-15 8-18 19-34 27-52 5-12 8-26 1-36-3-5-8-7-10-12-1-3 3-4 6-3 11 4 18 17 17 29 1 16-7 31-15 45-9 14-18 28-23 44-7 24-6 49-7 74 2 3 4-2 6-3 8-8 11-20 12-31 1-16 4-33 11-47 10-22 22-42 30-64 6-17 5-36-4-52-1-3-5-7-9-7-13 1-25 5-37 6-2 0-3 3-2 5 4 8 9 16 10 26 1 11-1 24-9 32-3 2-8 4-11 1 0-5 5-9 7-13 6-10 4-23-1-33l-7-11c-3 1-2 5-3 7-2 6-3 13-7 18-2 3-8 4-8-1 3-8 7-16 8-26 1-9 1-19-4-28l-10-16c-3 0-2 5-2 6-1 12 1 24-5 34-1 3-5 5-8 2-1-6 2-12 2-18 1-14 1-29-3-42 0-3-3-7-5-4-4 5-7 10-12 13-3 1-5-3-4-5 2-7 7-12 10-19 1-3-3-5-5-7s-4-6-6-4c-7 7-12 14-16 21-4 10-1 20-2 29 0 3 2 8-2 9s-6-4-7-8c-2-9-2-19 1-28 2-9 9-16 13-25 0-3-5-2-6-1-10 3-20 6-26 13-8 7-12 16-15 25l-1 33c-2 2-4 5-7 1-4-1-2-7-3-10l-1-29c-3-11-12-19-21-25-8-4-15-9-24-9z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M975 1861c-7 2-11 7-16 11-5 5-10 12-17 15-12 5-26 6-36 15-3 3-7 7-11 4-5-5-11-10-18-13-8-3-17-3-24-9-9-7-16-17-26-22-2-2-5 1-4 3 2 10 7 19 12 27 7 10 19 14 30 19l14 8 21-3c7-1 13 5 20 3 14-8 29-14 41-24 9-8 15-20 16-32l-2-2zM703 1821c-5 2-8 7-11 11a72 72 0 0 0-6 65c7 20 21 36 30 55 9 20 13 42 17 64 2 13 6 26 18 34 14 10 31 14 45 22 15 7 28 17 40 27 10 4 21 4 32 5 2 0 8 2 7-2-12-12-26-22-42-29-19-9-41-11-58-25-9-7-19-15-25-24-7-11-7-24-9-36-2-11-4-21-8-31-7-17-17-32-25-48a97 97 0 0 1-5-80c1-2 3-6 1-8h-1zM741 2054c-3 1 0 5 0 7 5 10 13 20 24 25 14 5 28 8 42 10 3 0 6 2 9 0 0-3-4-5-6-6-21-13-46-21-66-35l-3-1zM1095 1821c-4 0-1 5-1 7 7 14 9 29 8 44-2 16-6 32-15 45l-22 41c-6 19-5 39-11 58-4 10-12 17-20 25-8 9-20 14-31 18-24 9-49 18-69 35l-9 9c2 2 5 1 8 1 10 0 20-1 29-5l10-8c19-15 41-26 63-35 11-5 21-13 28-23 5-9 5-20 7-30 3-21 8-42 18-61l16-27c7-11 13-24 14-38 1-19-5-41-20-55l-3-1zM1057 2054c-4 1-7 4-10 6-16 10-34 16-50 26-5 3-11 5-14 10 0 3 4 2 6 1 16-5 33-8 49-14 11-5 18-16 22-27l-3-2z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/></g><g fill="#a32623"><path d="m1338 993 1 45 2 48c1 4 5 2 8 2 11-2 23-4 33-10 3-2-1-5-2-8-11-24-23-49-37-72-1-1-2-6-5-5zM1399 1124c-10 1-21 3-31 6-3 2 1 5 2 7 14 16 25 35 32 56 4 15 4 31 3 47-1 13-6 26-10 39-1 4 4 3 6 3 10 1 20 2 30 1 4-2 1-7 2-11-3-47-13-95-28-140-1-3-2-8-6-8zM1206 1130c-8 3-15 9-22 14-15 10-31 18-47 26-2 7 0 15-1 22l2 84c0 3 0 7 4 6h118c3-2 2-7 2-10s2-8-1-9c-9-2-20-7-23-16-2-5 0-11 0-16-5-5-9-11-9-18 1-5-4-4-7-4-6 0-11-4-13-10-3-14-5-28-6-43-1-8-1-16 4-23 1-1 2-3-1-3zM1145 1293c-3 0-7 0-8 3-1 2 0 5 2 6l7-5c1-1 4-3 2-4h-3zM1427 1329c-2 1-2 4-3 6a236 236 0 0 1-167 134c-10 3-20 3-29 5-2 0-4 2-2 4 5 6 12 11 18 16 29 26 56 54 79 84 3 4 5 8 9 11 2 2 4-2 6-3l22-40c18-35 34-72 47-110l8-26c8-25 13-51 14-77 0-1 0-4-2-4zM539 1293c-3 5-1 11 0 17 1 3 3 5 7 5 7 3 11 11 12 18v11c5 5 10 11 11 19 2 3 7 2 9 4 8 4 11 12 13 20 4 16 5 33 5 49 2 3 4-1 6-2 19-12 39-22 59-33 2-5 1-10 1-16l1-91c-2-3-6-1-8-1H540zM661 1271c-5 2-8 5-11 8-2 2 0 3 2 3h11c0-3 1-7-1-10l-1-1zM388 1293l-20 1c-2 2-1 5-1 7 0 19 4 38 7 57 5 27 10 54 19 81 2 5 3 10 7 14 2 1 5-1 8-1l23-5c2-2-1-3-2-5-10-13-20-27-26-43-10-22-13-48-9-72 2-11 7-21 11-31 0-3-4-3-6-3h-11zM453 1487c-10 1-21 3-31 7-2 1-5 2-4 5 5 14 12 27 18 40 7 14 13 28 21 41 1 1 3 1 3-1v-35l-2-54c0-2-2-3-5-3zM466 987c-5 1-7 6-9 9a748 748 0 0 0-85 226c0 7-2 13-1 20 3 0 3-5 5-6a247 247 0 0 1 190-134c2-1 6 0 6-3-2-4-6-5-8-8-16-12-31-28-45-42-17-18-32-38-48-57l-5-5z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/></g></g></svg>
                    </g>
                `,
                black: `
                    <g>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1696" height="2528"><path d="m855 2520-29-33c-4-7-6-13-6-24l-1-8h-7c-9-1-18-5-24-11-5-4-10-6-26-9l-25-7-33-14-13-6-3 5c-3 4-15 12-17 12l-4 1h-20l-4 4c-6 8-20 20-36 28-19 9-22 5-14-18a1643 1528 0 0 0 38-114l10-34c12-32 12-33 6-40-14-14-19-33-27-82l-7-41c-5-16-15-38-23-49-25-36-30-48-36-69-6-26 2-57 19-79 5-6 5-9 0-9a609 567 0 0 1-182-87l-4 107a4623 4299 0 0 1-2 174 16172 15040 0 0 0-8 241l-3 11a500 465 0 0 1-32 82l-8 7c-7 0-13-14-32-58-16-39-15-27-19-248a21609 20096 0 0 0-7-225l-4-204c0-2-2-6-9-15-16-20-16-17-1-38 6-10 8-13 6-14l-2-5-6-8a584 543 0 0 1-58-106c0-3-3-2-8 1-16 9-18 9-30-33l-5-13c-3-6 2-15 9-15 6 0 6-1 3-9a633 589 0 0 1 4-414c21-57 61-134 89-171l4-5-2-5c-19-29-18-29-10-41a561 522 0 0 1 320-223c4 0 2-2-3-8-23-28-27-79-8-104l13-19 2-3 4-6a289 268 0 0 0 27-54c1-2 4-13 6-37a267 249 0 0 1 34-97c2-3 5-6 4-7l-3-5a1012 941 0 0 0-17-57 1834 1705 0 0 0-41-117c-10-29-5-33 21-18 16 10 22 17 26 24l3 4h11c12 0 21 3 29 10 4 5 5 5 24-4a647 602 0 0 1 110-39c0-14 6-26 22-44l14-15c4-5 8-3 33 23 8 9 14 22 14 31 0 8 1 9 8 9l18 4 23 7c16 4 40 13 61 23l19 8 6-3c6-7 21-10 30-10 6 1 7 1 8-2 2-3 10-11 18-17a140 131 0 0 1 24-16c1-1 8-3 10 0 3 4-1 21-20 75a1369 1273 0 0 0-36 109l-6 17c-2 4-2 4 2 9 16 17 28 53 38 108 2 24 4 27 8 39 6 15 13 23 24 41 25 38 33 61 29 89-3 19-15 42-24 47-3 3-1 5 3 5a676 629 0 0 1 173 81c9 5 10 5 10-2a24310 22608 0 0 1 9-440c3-77 6-92 22-127a596 554 0 0 0 16-36c0-4 6-9 10-8s11 13 18 29l5 14c19 36 21 59 23 148a9299 8648 0 0 0 6 282 23239 21613 0 0 1 7 230v26l11 16c16 22 16 21 8 35l-10 15c-4 2-2 6 10 23l5 8 6 8a1100 1023 0 0 1 42 84c0 5 3 5 10 1 13-8 14-6 24 24 8 31 8 33-3 37-1 1-1 2 1 11a417 388 0 0 1 8 22 692 644 0 0 1 27 131 662 615 0 0 1-48 278 846 787 0 0 1-80 148c-7 10-7 10 11 35 5 7-7 26-37 60l-13 13a565 526 0 0 1-271 168c-6 1-7 3-4 4l16 23c6 14 10 40 8 56-3 15-11 34-19 46l-4 7-1 2a233 216 0 0 0-42 107 267 249 0 0 1-17 68l-3 5-1 2-1 2-2 1-5 6c-5 8-8-1 21 86a5621 5228 0 0 1 31 93c9 28 9 32 1 32s-38-22-45-32l-3-3h-10c-15 0-37-10-37-18h-6c-2 3-11 7-14 7l-2 2-7 2-13 4-10 4-29 9c-8 1-11 2-17 7-7 5-18 10-24 10h-6v9c-1 12-13 33-21 40l-3 3c-8 10-16 15-20 13zm9-24c11-11 12-14 15-19 4-6 5-18 1-24-6-14-2-20 11-15 20 8 40-8 34-26-6-13-24-19-35-12-15 8-18-5-6-26 15-28 55-33 83-11 10 8 10 8 14 0 9-17 28-27 48-24 27 5 49 33 28 37-11 1-21 12-20 22 4 14 24 21 36 12 7-3 8-2 13 9 4 6 16 19 19 19l-12-45a12796 11901 0 0 1-41-123l-8 1a496 461 0 0 1-75 16 612 569 0 0 1-277-11l-24-5c-4-1-4 1-12 30l-13 38c-14 40-31 94-31 99 0 2 16-12 19-18 5-11 5-11 8-11l6 3c11 6 28 1 32-10 4-12-6-28-18-28s-2-22 14-30c26-12 48-5 67 24h3c23-25 68-25 87 1 13 19 12 40-2 33-20-14-46 10-33 28 5 9 21 13 31 8s14 0 10 13c-5 15-2 24 14 41 9 12 8 12 14 4zm-120-168c-11-6-12-12-4-18l6-4c1-4 18 6 18 11 0 1-4 6-10 10l-6 4zm223 0c-13-5-14-11-8-18 8-7 11-7 19 0 9 5 9 6 1 13-6 7-8 7-12 5zm-632 100 3-8c21-43 27-66 27-118l5-204a34790 32355 0 0 0 12-569v-14h-5c-12 3-24 9-32 19l-4 5v344c0 358 0 348-7 351-9 1-8 36-8-348l-1-344-3-5c-7-10-23-20-34-20h-4v41a2430 2260 0 0 0 4 123 4776 4442 0 0 0 3 175 12052 11208 0 0 1 5 219 15635 14541 0 0 1 7 269c1 22 8 40 27 81 3 5 5 6 5 3zm638-13a564 525 0 0 0 48-23c0-7 12-21 20-26 8-4 0-10-15-13-16-4-31 8-35 27-5 20-10 22-20 8-21-27-52-34-70-11-6 6-4 7 2 7 19 0 36 15 39 33v7l11-4zm-197 2c3-18 18-32 36-33l7-1c1 0-1-6-5-9-20-20-50-12-69 15-9 14-16 11-18-5-6-27-28-40-50-27-5 4-5 6 3 12 7 5 11 11 13 20 2 6 8 9 38 20 37 15 44 16 45 8zm99-140a159 148 0 0 1 58-42l56-21c30-10 30-10 30-42 0-70-8-106-33-146l-13-17h-4a94 87 0 0 1-42 37l-24 10c-4 0-6 5-5 8 7 8-5 11-22 3-13-6-18-6-33 0-12 5-16 7-20 3-3-3-4-6-1-8l-3-3-19-8c-25-11-37-20-46-36-4-6-7-9-7-6l-4 5c-12 11-20 25-31 50-9 22-15 58-15 105-1 33-1 31 7 35l32 12c51 18 63 24 82 38l22 20 6 7h14c12 0 14 0 15-4zm-119-75c-17-3-41-13-43-18-2-9 3-10 16-4a99 92 0 0 0 93-2h8c12 12-42 28-74 24zm179 0c-24-3-47-14-45-20 1-5 4-7 12-3 21 9 24 9 44 9 23 0 28-1 48-10 7-3 7-3 9-1 14 12-36 29-68 25zm-55-27c-9-3-10-74-1-79 7-4 11 2 8 12-1 7-1 55 1 62 0 4-2 7-8 5zm-124-8c-16-5-33-16-32-21 3-5 7-4 17 2 13 6 13 6 13-1 0-23 34-24 36-1l1 7 17-10c3-1 10-2 12-1 6 4-1 11-21 21-11 6-28 7-43 4zm181 1c-20-4-42-20-32-25 2-1 4 0 12 4 12 7 12 7 12 0 0-15 14-23 28-14 6 4 8 9 8 15-2 6 0 6 13-1 15-8 16-8 19-1 2 5-24 19-39 22zm-119 106c-22-19-46-31-78-40-29-8-43-15-65-34-19-15-24-25-28-51-4-25-4-30-8-39a412 383 0 0 0-34-63 130 121 0 0 1-11-108c9-16-4-8-14 9-19 32-16 67 12 107 25 37 36 62 43 102 5 41 13 52 44 66l26 10a227 211 0 0 1 69 41c2 2 30 6 46 6h4zm113 3 12-3c6-10 54-38 83-49 20-6 32-14 43-25 11-10 11-11 16-46 4-30 17-69 28-82 4-3 23-35 27-42 16-32 10-70-12-94-11-10-12-7-4 8 13 28 6 82-12 102-4 4-24 41-30 52-4 9-6 23-9 44a182 169 0 0 1-7 31c0 4-10 16-20 25-21 20-28 22-71 36-29 10-54 22-70 37l-11 9h13zm-186-6c0-4-24-16-54-28-18-8-34-15-38-19-8-6-9-4-2 6 12 22 25 30 80 40zm237-1 56-14c15-5 24-15 32-32 2-5-1-5-5-1l-12 6-11 6-8 4c-25 10-63 30-63 32l2 1zm-302-117c-1-30-1-34-4-43-7-20-20-48-28-59l-17-27c-18-30-14-69 9-75 15-5 23 9 7 14-14 4-15 30-3 52l3 6 2 5 4 6 7 12a246 229 0 0 1 28 52l3-13 10-34c10-20 16-31 31-46 12-13 11-12 8-20-5-16-4-24 5-24l7 3 18 6 8 4 1-4c12-30 36-40 60-25 17 12 24 12 41 0 22-14 43-6 57 20l4 7 8-2 13-6c13-8 20 0 16 20l-3 9 6 5c25 27 46 69 46 92 0 7 2 9 4 4l2-4c0-3 17-34 33-60 19-30 20-55 2-68-12-7-6-17 6-11 28 11 30 51 4 88l-4 8-5 7c-24 33-32 60-32 106l-2 30 6-5c12-13 15-22 16-41 1-26 9-51 25-76a93227 86702 0 0 1 24-46c14-26 14-56-1-78-4-8-5-8-31-3l-21 4c-11 0-11 0-3 12 12 20 11 50-2 64-13 11-27 5-15-8 13-13 13-34 0-53l-4-6-2 3-6 22c-4 10-12 12-18 7-1-4-1-4 2-9 6-12 9-23 9-37 0-15 0-15-11-32l-8-11v13c0 25-4 39-12 40-8 2-10-1-6-16 5-31-2-81-10-62-2 5-12 13-16 13-8 0-8-7 2-21 9-11 9-10 1-17-7-8-7-8-16 4-16 18-17 22-13 52 1 21-15 16-18-5-2-20 0-30 12-47 8-13 10-14 6-14l-7 2c-32 5-52 31-52 64v22l-7 6-5-3-4-3v-22c0-29-2-33-20-49-18-13-52-25-40-12 18 18 25 38 18 64-4 14-17 13-16-3 4-31 4-31-12-50-10-12-10-12-17-6-7 7-7 6 0 17 9 13 11 16 7 19-4 5-14 1-20-10-5-6-5-6-10 6-4 15-5 39 0 56 4 12 3 14-5 14-10 0-16-19-15-43 1-11 0-11-4-4a76 71 0 0 0-4 74c4 9-4 16-12 10-3-4-9-19-11-27-1-14-13 5-14 25 0 14 1 19 9 29 12 14 3 21-12 10-16-12-19-42-5-67l4-10-18-2-24-5c-13-3-14-3-18 6a93 93 0 0 0 1 82l23 42c10 18 18 34 22 50l3 24c3 18 3 20 7 28l13 19zm170-106 9-2 11 2c13 5 14 5 18 2l25-13c29-13 40-23 46-46 3-11 3-11-4-8-5 2-8 5-21 17-12 12-15 15-33 19-18 3-25 6-33 13-9 9-13 9-21 1-5-6-16-12-28-14-16-3-21-7-36-20-25-25-33-23-17 6 9 17 18 26 38 32 11 4 23 10 27 14a1270 1181 0 0 0 19-3zm22-37 19-5c34-9 42-20 30-40-10-17-20-20-35-8-16 12-35 11-52 0-18-12-32-7-39 13l-4 9c-1 1 0 4 4 9 9 10 15 13 36 18 12 3 13 4 20 10l7 7 5-5zm-50-20c-4-2-4-7 2-10 7-2 69-1 73 2 2 2 4 7 1 9-4 2-74 2-76-1zm318-59-2-2-1 2 1 1zm-452-9 5-14 4-6v-265l-1-264-35 7-24 6-33 11-26 9a886 824 0 0 0-117 62c31 6 43 10 44 14 0 5-5 27-15 53-2 8-6 8-21 0-27-13-63-22-68-17-4 5-4 19-10 252v47l19 13a555 516 0 0 0 261 98c16 3 14 3 17-6zm-37-37c-14-7-24-29-20-45 2-11 4-13 10-8 16 10 24 28 20 45-2 8-5 10-10 8zm-122-29c-16-10-25-31-20-46 3-5 7-4 17 5 23 19 24 55 3 41zm67-91c-16-8-23-26-19-43 1-8 3-9 11-5 13 7 20 17 21 35 0 16-3 19-13 13zm-159-3c-15-7-24-20-24-35l-2-10 7 1c16 0 32 17 35 35 1 12-3 15-16 9zm200-59a39 39 0 0 1-10-45c8-15 26 7 26 30 0 20-5 25-16 15zm-160-38c-15-7-24-19-26-34 0-9 2-16 4-15s2 0 0 0c-4-11 23 9 29 20 9 19 6 34-7 29zm111-66c-15-9-23-30-16-48 6-17 30 9 29 33-1 13-5 18-13 15zm47-116a38 38 0 0 1-8-43c8-20 28 2 26 28-1 21-8 26-18 15zm423 444a579 538 0 0 0 385-228c8-11 8-10 0-22a662 615 0 0 0-224-204h-7v6l1 8-5 2-24 8a8854 8234 0 0 0-80 21c-16 4-23 2-23-4 0-7-19 6-36 24l-18 18-8 8v170l2 169 4 8 5 13c1 7 3 7 28 3zm0-45c-9-14 3-45 19-51 20-7 11 42-9 52-7 3-7 3-10-1zm115-26c-7-14 7-40 27-50 8-2 11 4 8 19-3 21-28 43-35 31zm-64-92c-7-14 3-37 19-47l5-3 4 3c3 4 4 17 1 26-5 16-25 31-29 21zm155-1c-7-16 23-52 39-46 12 4-8 40-27 46-11 2-11 2-12 0zm-196-56c-11-9-6-37 8-50 18-16 24 24 6 42-6 7-12 10-14 8zm271-35c-8-12-4-36 8-48 9-8 9-8 15 1 10 20-11 63-23 47zm-111-7c-9-12 13-50 29-50 11 0 8 26-2 38-7 8-23 15-27 12zm-108-66c-4-6-6-23-2-33 6-12 19-24 24-21 14 11 3 46-16 54zm84-39c-8-13 1-42 17-52s18 29 2 45c-8 8-16 11-19 7zm-199 296v-25l-11-6a227 211 0 0 0-47-25c-50-26-148-19-206 14l-9 5-4 2-5 4c-10 4-10 2-10 30l2 23 16-20c13-19 27-32 39-36 25-6 66 10 85 35l3 4 5-6c21-26 68-41 91-30 8 6 23 19 32 31 20 30 19 30 19 0zm-284-48a250 232 0 0 1 272-3c13 9 12 10 12-17l-2-23-20-8a285 265 0 0 0-258 3l-12 5v13l-1 23c0 13 0 13 9 7zm0-65c58-30 115-103 127-164 4-19 7-18-21-15l-29 1c-4 0-6 1-6 6-5 35-40 87-73 112l-7 5v29l1 30zm284-25v-30l-16-15c-22-17-52-62-52-73 0-3-4-1-18 6-35 20-53-7-27-40l6-7h-28c-12 2 9 61 33 97a392 364 0 0 0 58 62c10 9 40 29 42 29zm-214 3c35-9 95-8 136 1 20 3 20 3 7-9-28-25-52-57-70-94-6-15-5-15-12 0-14 33-40 69-68 94-13 11-13 14-9 12zm-520-33c0-2-1-4-3-1-2 1 0 5 2 5zm452-27c21-21 39-49 49-77 8-21 8-21 2-25-7-3-8-6-10-15l-1-6h-5c-23-1-33-26-15-42 2-3 5-5 4-7v-15c2-5 7-10 15-14 5-4 6-5 6-9 2-6 6-15 10-18l4-2-2-78v-79h-65c-3 5-3 396 0 394zm282-41c0-51 0-50-8-46l-47 17c-5 4 48 80 53 76zm442 10a1193 1110 0 0 0 84-168 401 401 0 0 0 31-112c4-36 4-37-4-20a317 295 0 0 1-251 168c-16 3-16 1 1 15a731 680 0 0 1 126 124c4 5 5 5 13-7zm-1176-24a11916 11082 0 0 1-4-89c-5-4-44 5-51 10-2 2 50 103 54 103zm635-9 7-4c28-14 40-19 65-27 24-8 35-16 57-39 14-15 22-22 35-28l6-3a560 521 0 0 1-8-23l-7-16-20-40c-10-20-11-21-14-20-4 2-20 3-64 3-42 1-49 1-87 11-62 17-85 26-90 35-3 5 0 5 16 1 54-12 77-16 81-12 5 5 1 10-12 12l-81 17c-18 4-31 13-31 19 0 3 5 5 12 4l13-3 62-8c46-8 44-8 45-2 3 7-3 9-16 12a1087 1011 0 0 0-103 16c-17 2-24 5-24 13 0 10 12 10 72 2a1582 1472 0 0 1 80-9c4 6 0 11-12 12l-29 4c-77 13-80 13-81 16-2 9 13 13 45 10a16962 15775 0 0 1 119-12c25-6 29-6 32 0s0 7-25 12c-27 5-54 28-54 44 0 5 7 7 11 3zm-707-78c49-23 96-23 124-1l8 6 6-5c28-23 105-22 138 4 2 2 4 0 6-5l1-9c8-18 8-22 3-22l-22-4a541 503 0 0 0-288 6l10 34zm914-18 56-15c29-8 28-7 25-17-6-33-29-83-57-130-11-17-13-20-17-15l-23 17-52 38-6 5 8 13c19 30 37 72 45 101 2 7 1 7 21 3zm206-20a360 334 0 0 0 124-48 303 282 0 0 0 116-146c7-15 11-14-36-14h-40v13c-7 85-75 137-234 178-9 3-9 3 2 9l14 9c8 6 15 6 54-1zm-1105-14 18-4-9-11c-43-48-56-117-31-166l4-10c0-3-48-2-48 0-1 10 1 32 7 62 8 57 31 134 37 133zm220-14c7-7 7-10 3-35-8-43-10-45-22-42-5 3-5 4-1 6 11 5 11 22-1 39v4c6 6 2 22-7 30-4 3-4 5 4 5l8 1c4 2 12 0 16-8zm787 4 20-6c56-14 110-34 143-51 52-30 82-71 83-116v-11h-121c-138 0-125-1-138 9a2553 2374 0 0 1-60 46l2 5c19 26 47 87 55 117 3 11 3 11 16 7zm-951 0-3-6-7-18c0-6-2-16-5-21-3-10-4-22-1-30l1-19c0-13 0-17 4-27l5-17c4-14 15-26 27-31l7-1-2-14h-80l-4 6c-31 56-18 126 30 169l10 10h8zm69-6c52-1 59-3 60-14 2-10-2-11-45-11h-35l-3-4c-5-5-5-5-1-8s70-4 78-2c9 3 17-13 10-21-4-5-13-6-52-7h-35l-2-4c-10-10-4-11 44-11 45 1 44 2 44-6 0-15-5-17-53-20-33-2-35-3-35-9 0-7 2-9 40-5 28 2 32 2 35-2 4-10-8-15-54-23-37-6-53-1-56 16l-5 18c-4 11-4 12-4 27v17c-4 4-3 18 1 29l5 21c2 10 3 11 10 15 8 5 13 6 20 6zm150-20 36-17 15-8 1-66v-66H378c-5 4 0 25 5 25 12 0 24 20 20 32-1 4-1 4 3 8 5 4 12 15 12 20 0 1 1 2 4 2 19 2 29 24 32 75v15l8-5zm315-13 14-6 9-2 12-4 11-1v-132h-54v148zm-228-26a879 818 0 0 1 119-34c2 0 2-3 2-43v-42h-69l-71 1-1 123c1 2 2 2 20-5zm312 2 22-5c12-2 11 6 11-59v-57h-55v126l4-2zm115-64c2-53 2-56-1-57l-65 1c-2 3-3 112 0 112h66zm22 51c-2-2-4-4-4-1v2l2 3c3 0 3 0 2-4zm29-27a2521 2344 0 0 0 64-45l10-6 12 11 10-7 11-9-1-25h-68c-82 0-71-6-73 44v42l7 4c8 5 7 5 28-9zm-693-70v-10l-20-1c-25-1-26 0-26 6 0 8-1 7 18 10l18 4c10 2 10 2 10-9zm825-6 5-4h-6c-8 0-9 2-8 7 1 3 1 3 9-3zm-951-36c7-78 59-121 198-164 37-11 38-12 36-14l-14-8c-16-12-21-12-64-3a301 280 0 0 0-238 205l41 1h40zm263 15 4-4c19-11 66-47 66-50l-4-8c-20-31-55-107-55-120 0-5-4-3-46 9-147 44-193 76-211 146-2 8-4 27-1 28 1 3 246 1 247-1zm199-21v-65l-6-2c-11-5-11-5-24 5l-54 38c-24 19-24 18-31 11-6-6-6-6-18 3l-8 6v12l1 14 71 1 69-1zm83 22v-113a895 833 0 0 0-52-1h-13c-2 1-3 112 0 114 0 3 64 1 65 0zm70-64c0-61 0-65-3-64l-44 11-7 2v115l27 1 25-1zm71-10-2-75-14 5-34 10-5 1v66l1 67 27 1 25-1zm82 73V868a209 209 0 0 0-60 97l4 9 6 11 1 6h7c25 4 34 30 14 41l-5 4v10c-1 15-4 18-20 28l-4 8-7 15c-4 0-6 156-2 161 2 3 65 1 66-1zm158-63v-66l-15 7-22 9c-38 13-51 17-76 23l-29 9v82l71 1h71zm178 64c3 0 3-1 3-11v-10l-6-1c-21-5-32-20-27-36 2-3 0-4-4-8-5-5-8-12-8-18 0-4 0-4-6-4-15 0-20-6-23-26-8-47-8-57-3-66 8-10 6-9-22 9-18 11-58 32-65 33-2 1-2 5-1 59 0 83 0 78 4 79zm61 0v-6l-1-6-13-3a235 219 0 0 1-27-3l-1 18zm103-1c31-56 19-126-29-170-16-15-43-21-28-8 5 5 9 14 10 23l3 13c3 6 4 23 3 42v17c0 11 0 13-3 18l-5 15c-2 19-19 36-35 36-3 0-4 13-1 15 1 3 84 1 85-1zm67 1a724 674 0 0 0-35-178c-6-18-5-17-18-14l-19 3c-16 3-16 1-8 10 16 18 21 26 35 52 17 36 16 84-4 126 0 2 46 4 49 1zm-1029-6c0-8-1-6-16 5-1 1 3 1 7 1h9zm881-24c12-5 17-11 17-21 0-5 1-10 5-17 4-11 4-13 3-19l1-30c0-8 0-11-2-18-3-5-4-13-4-18-3-21-15-27-50-25l-42 3c-27 1-38 6-34 17 3 8 4 8 46 8 40 0 41 0 41 6 0 7 0 7-44 9h-42l-4 3c-5 7-5 14 2 19l4 4h40c45 0 47 0 45 7-1 6-1 6-44 6h-40l-3 4c-4 3-5 9-2 14 2 5 20 9 59 10 28 0 32 1 30 7-2 8-1 8-48 6-27-1-32-1-32 5 0 9 16 14 50 19l17 3c11 2 25 1 31-2zm-822-23a1589 1478 0 0 0 61-45c18-12 18-9 3-35a730 679 0 0 1-43-97 2043 1900 0 0 1-103 28l6 16a603 561 0 0 0 62 131c4 8 4 8 14 2zm-428-28c50-77 140-131 237-143 12-1 13-1 5-7l-12-9-7-5a957 890 0 0 1-109-113c-8-10-11-7-26 18l-10 18a1164 1083 0 0 0-44 87c-23 47-53 151-53 180v5l7-12zm862-21a815 758 0 0 0 214-89c3 0 0-3-4-3-38-8-38-10-29-37l8-21c2-15 6-16 26-6 22 10 64 21 68 17l2-48a17844 16595 0 0 1 5-213l1-41-4-4a543 505 0 0 0-199-93l-2-1c-2 1-11 0-20-3-50-10-71-11-71-3 0 5-3 12-6 16a22364 20799 0 0 0 0 533zm40-61c-16-17-12-58 4-48 12 9 19 33 12 48-4 8-9 8-16 0zm58-110c-12-9-19-29-15-43 7-21 32 5 31 30-2 16-7 19-16 13zm123-66c-19-5-34-34-24-49 2-5 2-5 10-1 16 8 26 25 23 42-1 7-4 9-9 8zm-178-39c-14-8-19-34-12-49 11-18 32 16 27 39-4 13-8 15-15 10zm57-61c-16-10-26-34-20-47 3-6 14-2 23 8 15 16 13 49-3 39zm157-7c-30-14-38-51-10-41 15 5 26 20 26 33s-3 14-16 8zm-95-88c-18-9-31-35-23-46 9-14 35 12 35 35 0 14-2 16-12 11zm-123-21c-16-13-23-36-15-51 5-8 16-3 23 12 11 17 4 47-8 39zm228 452c2-1 2-1-1-5-9-11-8-24 1-34 4-3 4-3 2-7-7-10-3-26 9-32 7-3 5-4-8-4h-12l-5 5c-10 9-11 20-6 47l3 16c1 12 9 19 17 14zm-604-4c0-3-2-5-4-2 0 4 2 6 3 6zm40-21c57-1 62-1 117-16 45-12 72-22 76-30 1-2 1-5-1-5a1374 1278 0 0 1-81 16l-13 3-1-3c-7-7-3-11 21-15a1068 993 0 0 0 47-10c44-8 55-13 53-23l-1-5-7 1a429 399 0 0 0-77 11l-23 4c-13 3-20 1-20-6 0-5 8-8 44-13a1299 1208 0 0 0 70-11c24-4 36-11 28-18-6-5-20-5-54 0l-69 10c-24 3-30 2-30-5s6-8 92-19c31-4 34-5 27-14-8-7-93-1-166 10-22 5-24 5-26 1-4-8-2-10 24-14 20-4 24-5 36-17 27-25 27-42-1-26-11 6-34 16-61 26-34 15-40 19-52 33-12 13-29 28-38 33-11 6-11 6-6 20l6 15a720 670 0 0 0 38 68zm687-67a694 645 0 0 0 115-20l-10-32-14 5c-51 23-119 20-129-6-2-3-2-2-10 5-28 23-77 23-128 0l-12-5-4 12a664 618 0 0 1-5 20 501 466 0 0 0 197 21zm-923-5c3-1 3-2 1-7 0-7 2-8 11-12a185066 172113 0 0 1 107-28c8-1 10 0 13 5s16-1 32-20l28-25 4-4V798c0-164 0-170-2-174l-4-11c-3-6-3-7-6-7-8 0-38 3-57 7-32 5-30 5-35 8l-16 3a519 519 0 0 0-231 130c-27 24-79 85-79 92a616 573 0 0 0 218 210c5 5 9 5 16 2zm-18-30c-8-13 4-47 21-52 5-1 10 10 9 22-1 19-22 39-30 30zm90-43c-3-4-4-15-3-23 2-11 7-17 19-27 11-10 17 19 8 35-7 13-19 21-24 15zm-118-67c-8-14 7-45 24-49 18-2 10 39-10 47-8 4-12 4-14 2zm-98-10c-14-15 2-64 17-50 9 11 5 40-7 51-5 5-5 5-10-1zm272-29c-9-14-3-41 12-51 18-11 20 32 4 47-7 7-13 9-16 4zm-56-58c-9-15 5-49 24-54 19-4 5 44-16 54l-5 2zm-162-9c-8-15 11-40 31-42 19-3 8 32-13 41-11 6-15 6-18 1zm98-91c-4-11 9-42 16-38l1-2c2-2 11-7 15-7 4 1 5 7 5 15-2 22-33 47-37 32zm127-17c-8-9-7-31 1-44 14-20 27-15 26 9-2 19-20 42-27 35zm716 308c11-4 19-10 22-16 2-5 2-35 2-346 0-359 0-348 6-344l1-1c-3-3 4-1 5 1 3 3 3 37 3 344l1 345c3 7 28 22 36 22h3v-41a7654 7118 0 0 0-4-129 12716 11826 0 0 0-7-343 8429 7839 0 0 1-5-215c0-66-1-98-4-110a354 329 0 0 0-25-69c-4-8-4-6-12 16l-10 21c-8 19-11 32-12 78a18925 17601 0 0 1-9 382 3345 3111 0 0 0-4 154l-2 50-1 62-1 47-2 61v37l6-1zm126 1c12-2 25-7 25-8 0-5-48-92-55-100l-2-4v40a4806 4470 0 0 1 4 76c2 1 16-1 28-4zm-642-44c15-2 15-3 6-34-7-17-27-55-43-73a339 316 0 0 0-83-71c-4-6-4-1-4 26v29l13 11c22 21 40 44 48 64 6 12 6 12 18 4 24-14 37-12 44 4 3 11-4 32-15 37-2 3-1 5 2 5zm71-4h20v-5l3-8c16-43 36-73 68-100l7-5v-29c0-32 0-31-7-26-36 21-78 62-98 96-17 28-32 62-32 74v4h10zm-183-11c24-8 40-15 40-18 0-6-23-40-36-54-15-17-16-18-15-9a3538 3290 0 0 1 0 84zm140-31c16-38 38-70 71-101 11-11 11-13-1-9-43 11-100 11-147 0-20-5-20-5-8 5 31 28 65 77 76 111 3 7 4 6 9-6zm583-73c4-4 3-6-1-9l-3-3v8c0 9 1 9 4 4zm-548-45a361 336 0 0 0 54-12 211 196 0 0 0 49-23c3-2 4-49 1-49l-5 3c-83 54-196 56-275 3-11-7-11-8-10 18 0 27-2 23 22 35 52 23 115 33 164 25zm-1-56c40-8 79-24 103-45l5-5-1-24c0-21-2-26-3-22l-11 15-4 6-8 10c-20 37-95 32-116-8l-1-3-4 5a86 80 0 0 1-54 31c-33 7-47 1-69-35-20-30-23-30-23 2v25l5 4 4 5 2 1 13 7c19 11 39 19 64 27 27 7 68 9 98 4zm-90-56c32-9 43-24 43-58v-22l4-4c4-2 4-2 7-1l4 1v23c1 36 25 64 54 64 10 0 10 0 2-10-12-17-14-18-14-39s2-25 10-28c7-1 8 4 7 21-2 24 12 53 24 53 10 0 13-10 4-25-8-14-8-15-3-19l4-2 4 2 8 10c5 11 7 10 11-2 5-14 5-31 1-53-4-18 0-24 11-18 4 3 9 28 9 45l1 4 2-1 5-8c12-17 12-39 1-64-5-10-2-16 6-16 6 0 10 10 14 32l3 9 4-7c11-18 12-30 3-54a465 433 0 0 1-15-50c0-2-3-1-7 7-13 26-32 52-38 52-3 0-3 4 1 12 7 20 1 26-13 19l-16-9c-3-4-8 0-8 5-4 36-57 44-71 11-4-10-15-10-22 0-17 31-52 29-68-3l-5-10v-5l1-5 3-5c0-13 21-30 37-30l19-8c11-5 15-6 16-5 3 3 1 8-3 12-2 2-4 3-1 3h21c6 0 6-2 2-2l-3-3v-5c-1-2 1-6 4-6s23 13 23 14l2 1c24 1 30 5 41 21 8 13 9 15 17 20 12 9 12 8 7-11-7-26-24-41-59-52l-16-5-8-4-10 4c-10 4-12 5-17 1-9-4-12-5-19-2-6 1-10 2-37 14a80 80 0 0 0-42 48c-9 27-20 22-13-7l1-7-8-9-12-13-5-9-16-27c-3-7-4-4-8 12-4 19-8 31-11 36-8 14-6 32 3 51l7 10 1-10c4-17 8-27 11-30 5-2 10-1 12 4 0 2 0 5-7 22-3 10-4 14-4 25v13l7 12c5 9 12 16 9 10l4-35c4-17 19-16 16 0-5 28-5 39 1 55 7 15 7 16 12 6 6-11 14-16 19-11 3 4 1 9-7 22-6 9-6 11 0 18 7 6 7 6 15-4 12-14 14-20 14-41 0-20 2-27 9-24 15 5 8 53-9 72-8 8-6 8 14 2zm-211-92c1 0 1-3-1-9-8-19-8-21-8-41 0-29 1-35 25-72 19-29 27-47 35-95 4-21 12-33 27-49 16-14 28-20 77-39 30-10 47-18 62-31 10-7 9-10-7-7l-25 3h-11l-8 8-10 7c-2 2-8 4-9 6l-56 27c-44 22-49 29-56 77a250 232 0 0 1-12 48 279 260 0 0 1-32 56c-24 34-26 71-7 97 5 6 13 15 15 14zm528-2c33-19 33-69 0-119-27-43-35-60-37-93-6-51-12-59-95-95l-16-8-7-4-11-9-10-10-20-1-26-4c-7 0-7 0 0 7 12 12 28 21 64 34l23 8c45 14 73 42 80 82a235 219 0 0 0 31 84c32 50 39 86 23 118-7 12-7 15 1 10zm-491-2 26-4c16-2 15-1 9-10-9-17-10-44-2-61 5-8 5-11 12-43 8-31 8-37 2-24a184 172 0 0 1-24 41l-6 11-4 4-6 11c-9 18-8 36 4 43 15 8 4 18-11 10-10-5-13-12-13-27 0-22 3-28 24-58 27-38 35-62 36-113l3-27c1-4-1-3-7 3-9 12-12 19-20 59-4 20-13 47-20 56a559 520 0 0 0-25 42c-15 21-14 68 4 86 5 5 2 3 18 1zm474-10c17-27 12-57-16-102a239 222 0 0 1-34-87c-4-20-12-41-19-46-4-4-2 56 2 72 6 24 16 44 33 67 22 30 27 48 23 66s-29 28-29 13l5-5c19-10 15-30-11-66l-20-30-7-14v9c2 11 8 37 14 48 9 27 9 27 9 40-1 15-4 25-11 34-4 6-2 6 3 6l12 2 14 3 13 1c8 1 12-1 19-11zm-288-5c12-4 22-20 12-22-8-2-9-8-2-12 2-2 2-2 12 0 12 3 25 3 34 0 10-3 15-2 16 3 0 4-2 9-6 9-8 2 0 13 13 21 11 5 24-6 26-21s-9-30-18-26h-12c-8-3-12-3-20-2h-36l-17 2h-12c-8-4-19 9-18 22 2 16 18 30 28 26zm-67-63c11-15 26-26 53-36l13-4c4-1 4-1 4-8 0-3 0-5 3-6l12 3 12 6 12 5 5-3 11-7c9-6 18-4 18 4-1 5 2 6 23 12 18 5 32 16 44 31 7 9 6 9 16-2 7-10 10-13 22-36 18-36 25-79 20-130l-2-13-13-7-29-12c-48-15-86-37-99-58-2-3-36-3-39 1-16 20-39 37-67 46a551 512 0 0 0-69 30l-3 8-1 9 1 67c3 28 7 40 21 66 19 35 26 42 32 34zm122-79c-7-11-1-75 7-74 6 0 6 2 4 17l-2 35c2 26-2 32-9 22zm-108-32c-6 0-14-9-14-15s-2-6-13-1c-13 7-23 1-12-8 25-19 60-19 84-1 11 9 7 19-5 13-12-9-13-9-16 0-3 8-12 13-24 12zm174 0c-8-2-15-9-15-16 0-5-4-5-12 0s-8 5-12 4c-10-5 6-19 27-25 17-4 46 1 57 11l4 2c4 3 5 8 1 10-2 4-6 3-13-1-8-5-13-6-13-2 0 6-6 12-12 16-6 1-7 2-12 1zm-229-45c-4-3 3-13 12-17l8-4c17-11 63-9 86 3 12 6 13 7 13 11 0 9-4 9-17 4-22-10-53-13-70-7l-15 7c-12 5-14 6-17 3zm274-5a87 81 0 0 0-84 2c-12 6-20 0-11-9 24-21 83-21 111 0 13 11 1 16-16 7zm33 112-1 1v2zm50-156c0-7-16-28-23-30l-64-18c-13-1-1 7 24 16 21 9 33 15 48 24 14 9 15 10 15 8zm-416-2c2-2 46-26 51-26l33-16c8-5 6-5-16 0-26 6-46 11-53 15l-17 27zm34-48a662 615 0 0 1 208-23l27 3c36 2 104 15 119 22 8 4 10-2 20-34a887 825 0 0 1 29-90l15-47c-1-1-15 13-19 20-4 8-6 10-14 7-18-6-35 4-35 19 0 8 10 20 20 20 5 0 9 5 8 10-18 36-68 38-86 3-4-7-4-7-10-1a51 47 0 0 1-63 6c-26-15-40-58-16-46 21 10 45-10 35-29-7-14-18-17-37-9-8 4-12-3-6-13 12-21-16-59-32-42l-8 9c-7 7-11 25-7 32 5 11 1 18-9 13-24-10-46 17-28 36 5 6 25 8 32 3 10-10 16 5 6 23-17 32-63 41-88 17-5-5-7-5-9 1-15 31-60 33-80 3-8-11-7-16 5-16 9 0 19-16 16-26-4-13-21-19-36-13-5 3-11 1-12-4-2-7-4-10-11-17-11-10-11-10-4 11a3765 3501 0 0 1 50 149c2 8 0 8 20 3zm56-36c-7-6-7-11 2-19l4-2 7 2c11 5 11 9 4 19-5 6-9 6-17 0zm218 4c-10-8-10-15 1-22 8-5 9-3 15 4 6 9-7 24-16 18zm-254-50c13-4 18-14 22-37 3-10 12-8 19 3 15 25 42 30 64 13 8-7 8-8 4-8-21-5-29-8-36-21-4-7-4-10-4-20v-11l-12 4a278 259 0 0 0-44 17l-13 5c-8 4-10 5-10 14-1 10-10 26-20 31-9 5 16 15 30 10zm326-1c10-4 13-9 5-13-11-4-17-15-17-26v-11l-20-9c-19-9-46-18-55-21-4 0-4 0-4 4 5 21-9 42-32 46-11 1-11 1-7 6 16 22 54 16 68-11 8-13 15-10 19 7 3 18 7 23 19 28 6 2 17 2 24 0z"/><g fill-rule="evenodd" stroke-opacity="0"><g fill="#0f1717" fill-opacity=".9"><path d="M835 919c-4 1-1 4 1 5 19 19 35 42 48 66 6 9 9 20 13 30 3 3 5-2 6-4 10-23 21-46 37-65 7-10 16-18 24-27 1-3-2-4-4-3a245 245 0 0 1-123-1l-2-1zM791 966c-2 2 0 6-1 9v64c2 2 6-1 9-2 10-4 21-7 30-13 3-3-1-7-2-10a199 199 0 0 0-36-48zM1008 966c-6 3-9 9-13 14-13 16-24 34-30 53l-3 12 8 22c4 1 8 0 11 2 9 3 16 14 11 23-2 4-7 6-10 10-1 8 0 19-7 25-4 3-10 5-11 10-2 8-7 15-7 23-2 36-2 73-1 109 0 4-1 10 2 13 5 2 11 0 16 1 11-1 23 0 34-2 2-3 0-8 1-11V969c0-1 0-3-2-3zM791 1188c-2 9 0 18-1 27l1 65c1 5 7 2 10 3l40-1c2-2 1-6 1-9v-83c-2-2-6-1-9-1-14-1-28-2-42-1zM791 1294c-2 6 0 13-1 19v294c0 2 1 6 4 3 22-20 36-47 45-75 1-4 3-9-1-12-3-2-6-4-7-8-1-3 0-8-4-10-6 0-14-2-17-9-4-8-2-18 5-24 4-3 1-9 2-14 0-7 8-11 12-15 6-5 4-13 9-18 2-3 6-4 5-8l-1-123c-3-2-8 0-12-1h-39zM985 1292l-27 1c-2 3-1 7-2 11v77c-1 6 6 4 9 4h44v-91c0-4-7-1-10-2h-14zM1006 1533c-13 4-25 9-37 15-4 2-1 6 0 9 9 17 20 34 33 49 2 2 3 6 6 5 2-6 1-13 2-19l-1-57-3-2zM899 1561c-4 4-5 10-8 15-12 28-30 53-52 74-1 3-6 5-4 8 5 0 9-3 14-4 22-6 46-4 70-3 14 0 29 4 43 6 4-1 0-5-1-6-15-15-29-31-40-49-8-12-13-26-20-39l-2-2zM1020 2161c-11-1-19 10-21 19-2 5-2 12-7 16-3 0-5-4-7-7-9-11-21-21-35-20-10 1-19 7-23 16 1 3 5 3 8 3 13 2 26 14 26 28-1 2 0 5 3 4 11-4 22-7 32-12l25-14c2-4 4-9 7-12l11-11c2-4-3-7-6-8-4-2-9-2-13-2zM776 2160c-5 0-12 2-15 7-2 4 3 7 6 10 4 5 7 10 9 16 4 7 13 8 20 12 12 4 23 10 35 13 4 2 7-1 8-5 2-10 9-20 20-24 4-1 9 0 12-3 1-4-4-7-6-10-8-7-21-9-30-4-10 4-17 12-23 21-1 1-5 6-7 2-4-6-3-15-8-22-4-7-12-14-21-13zM1272 1292c-33 0-65-1-98 1-5 0-9 2-12 5l-46 38c-2 2 2 5 2 8 15 26 27 53 37 82 2 5 2 11 5 16 4 4 9 0 13 0 27-9 56-17 82-28 23-9 46-20 64-38 21-18 35-43 37-70v-14h-84zM636 1131c-15 2-29 8-43 12-36 12-72 25-103 47-20 13-34 32-41 54-5 12-7 25-5 38 25 2 50 1 75 1 37-1 74 0 110-2 18-13 36-26 53-42 3-4-2-9-4-13-14-27-27-55-37-84-2-3-1-7-3-10l-2-1zM837 349c-14 4-27 10-40 16-6 3-13 5-18 9l-3 15c-3 7-7 13-13 18-2 1-2 4 0 5 7 5 16 6 24 4 8-3 12-10 14-17l4-16c2-3 4-2 6-1 5 4 7 11 11 15 7 8 17 12 27 10 8-2 16-7 22-13 1-3-3-3-4-3-9-3-19-6-24-14-3-5-4-10-4-15v-12l-2-1zM964 349c-3 0-3 4-3 6 0 6 1 12-2 17-4 9-12 15-22 17-2 1-5 0-7 2 0 3 3 5 4 7 7 9 21 11 31 7 9-4 16-11 21-19 1-2 3-6 6-5 4 3 4 8 5 13 1 7 3 15 11 19 6 4 13 4 20 3 4-2 9-3 11-8 0-3-5-5-7-6-7-5-10-14-10-22 0-2 1-6-1-7-18-8-36-18-55-24h-2z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/></g><g fill="#c48d35"><path d="M899 296c-7 2-11 9-15 15-4 8-6 17-2 25 1 3 1 9-3 8-7-2-15-5-21 0-10 6-13 22-5 30 8 7 20 7 28 1 4-2 4 4 4 7-1 16-15 30-30 34-14 4-28 0-38-10-2-1-6-3-7 0-4 10-13 19-24 21-16 2-33-8-38-23-2-4 3-5 6-5 9-2 13-12 13-20-1-12-16-18-27-14-3 1-8 3-9-2-3-7-8-15-14-19-4 1-1 6-1 8 6 23 15 46 22 69 6 21 11 42 18 62 4 4 9 0 13 0a511 511 0 0 1 251-4l19 6c6-2 7-9 9-14 7-28 15-56 24-83 5-14 10-28 13-43-2-2-5 2-6 3-6 5-9 13-14 18-7 0-14-3-21 0-10 2-16 15-9 24 3 6 8 9 14 10 4 1 5 5 2 8-6 14-22 22-36 19-12-1-20-11-26-21-1-3-4-2-6 0-10 9-25 14-38 10-15-5-26-19-30-34 0-3 0-8 4-6 7 3 16 5 23 1 10-5 13-19 6-28-3-7-12-10-20-7-3 0-7 4-11 2-2-5 3-9 3-14 1-8-1-16-5-23-3-5-9-10-16-11zm-81 141c4 1 12 4 9 9-1 4-5 11-10 7-5-2-8-8-4-12 2-2 3-4 5-4zm164 0c7 3 8 12 2 16-4 5-10 0-12-5-1-6 6-10 10-11zM1008 848c-14 8-27 17-42 22-22 9-45 14-68 13-36 1-71-10-101-31-2-1-6-4-7 0-1 12 0 24 1 35 6 7 14 9 22 13a213 213 0 0 0 182-3l14-9c1-13 2-26 0-39l-1-1zM791 902c-3 1-1 6-2 8v39c20 18 37 40 48 65 1 3 4 6 7 3 8-4 17-11 27-10 7 1 11 9 10 15 0 9-4 18-11 24-3 2 0 6 3 5 6-1 13-1 18-4 4-5 1-12-1-18a228 228 0 0 0-96-125c-1 0-1-2-3-2zM1007 903c-9 4-16 11-24 17-27 23-49 51-64 84-6 13-12 27-14 42 4 3 10 0 14 1l32-1c2-2 1-6 3-8 10-32 26-62 51-83 5-3 7-7 6-12-1-13 0-26-2-39l-2-1zM722 1096l-62 17c-5 2-11 2-15 5 0 6 3 13 5 19 11 37 27 72 47 104 4 4 8-2 11-3 18-14 37-28 54-43 3-5-1-10-3-14a598 598 0 0 1-37-85zM579 1110c-12 1-23 4-35 6a227 227 0 0 0-173 164c-1 3 2 2 4 2 19 1 38 2 57 1 2-1 1-4 1-5 1-15 3-30 8-43 7-21 22-38 39-50 25-18 53-30 82-41l45-16c1 0 4-2 2-3-6-5-12-10-19-13-3-2-7-2-11-2zM503 1449c-39 0-77 6-114 16-3 1 0 6 0 9l6 21c6 0 11-3 16-5 16-8 34-13 52-12 15 0 29 7 39 16 2 2 4 2 6 0 10-10 24-14 37-15 18-1 36 0 52 7 6 2 12 7 18 10 4-4 3-11 6-16 1-5 4-10 2-15-4-2-9-2-14-3-35-8-70-14-106-14zM418 1293c-10 17-16 38-15 58-1 22 6 43 17 62 7 11 16 21 26 30l13-1c2-3-1-6-2-9-4-10-5-21-9-32-3-12 1-24 1-36 0-10 2-19 5-28 3-12 9-25 21-31 3 0 6-1 6-4s0-8-2-10h-61zM500 1292c-4-1-8 1-8 5-1 3 0 8 5 8l28 6c4-2 3-8 3-12 1-4-1-7-6-7h-22z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M767 1206c-5 0-8 4-12 7l-51 39c-2 2-6 4-8 2-3-2-5-6-9-5-6 2-10 7-15 10-1 6 0 12 1 18 0 2-1 6 2 5l83 1 21-1c2-2 1-5 1-8v-63l-7-4-6-2zM747 1292l-73 1c-2 1-1 4-1 6l-1 94c1 3 5 1 7 1 17-7 35-14 53-19l46-13c2-2 1-6 2-8v-61c-2-2-5-1-8-1h-25zM897 1660c-35-1-69 9-100 25-3 2-9 2-7 7l-1 34c3 3 6-1 9-2a186 186 0 0 1 205 0c2 2 6 4 7 0 1-11 0-23-1-35-6-4-13-6-19-9a205 205 0 0 0-93-20zM915 1522c-4 0-9-1-10 3-2 10 2 20 5 29a230 230 0 0 0 97 120c3 1 2-4 2-6 1-14 2-28 1-41-13-13-26-26-36-42-6-9-12-19-15-30-3-3-7 1-10 2-8 5-17 11-26 7-8-4-7-14-4-21 2-7 7-13 11-20-1-3-5-1-7-1h-8zM888 1525c-12 1-25 1-37 3-3 2-2 7-3 10a172 172 0 0 1-59 88v37c1 4 0 8 2 12 4-1 8-4 12-7a221 221 0 0 0 89-125c1-5 4-11 2-16-1-2-4-2-6-2zM852 1292v121c7 0 12-5 18-7 7-2 15-5 23-6 3-2 0-7 1-11v-96c-3-2-8 0-11-1h-31zM904 1292v85c0 6-1 12 1 17 2 1 6-1 9-1l30-7c4-3 2-9 3-13v-80c-2-2-8 0-11-1h-32zM945 1161c-14 3-27 8-40 12-2 3 0 8-1 12l1 95c0 4 6 2 9 3l31-1c2-3 1-8 1-12a2437 2437 0 0 0-1-109zM891 1177l-39 10v95h35c2 0 7 1 6-2 1-33 2-66 1-98-1-2 0-5-3-5zM1338 1130c-2 0-5 2-3 4 6 7 10 15 11 24 3 9 4 18 4 27v39c-4 8-6 18-9 26-4 9-12 17-22 18-4 3-4 9-2 13 3 4 10 1 14 2l49-1c5-2 6-9 8-14 13-34 9-75-11-106-9-13-20-26-35-31l-4-1zM1274 1265c-2 2-1 6-2 9 0 4-2 10 4 8l30-1c0-3 1-8-2-11-10-3-20-3-30-5zM1293 1079c-7 5-13 11-21 14-17 7-35 6-52 2-13-3-25-10-37-14-4-1-3 5-4 7l-5 20a372 372 0 0 0 234 1c4-1 0-6 0-8l-7-20-15 6c-22 9-46 13-69 8-9-2-19-6-23-15l-1-1zM1366 1292c0 24-6 48-19 68-21 30-55 49-88 63-23 10-47 17-71 24-3 0-3 4 0 5 7 5 14 10 22 13 14 1 28-3 43-6 35-9 71-24 99-47 34-27 58-64 72-104 1-5 4-9 4-13-4-5-11-2-17-3h-45zM1125 1175c-21 12-43 19-66 27l-40 12v67c2 2 6 1 9 1l98 1c2-3 0-8 1-12v-95l-2-1zM1051 1292c-9 0-19-2-27 3-7 4-4 13-5 20v47c3 3 7 6 12 7 10-5 18-12 27-19l43-31 9 8c6-4 12-8 17-14 0-7 0-14-2-21h-74z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="m1098 1331-47 37c-6 4-13 8-17 14 16 29 30 59 38 90 1 4 3 9 7 8 22-5 43-12 65-18 4-1 11-3 9-8-8-40-27-76-45-111-3-4-5-10-10-12zM1042 2094c-20 5-40 11-60 14a455 455 0 0 1-206-9c-7-1-14-4-21-4-3 2-3 7-4 10-12 41-26 81-37 123-1 2 1 4 3 3 7-6 13-12 16-20 1-2 2-3 4-2 7 4 17 5 23-1 8-6 7-17 1-23-3-4-7-7-12-7-3-3 0-8 1-11 8-12 25-19 39-13 9 4 16 13 22 21 2 1 4-3 6-4 9-7 20-11 32-10 15 0 29 10 33 25 1 4 3 10 0 14-3 2-6-2-9-2-9-3-17 1-22 8-6 9-1 22 9 25 6 3 12 2 17-1 3-1 6 0 6 3 0 8-4 16-2 24 3 9 10 17 16 24 2 2 4 1 6-1 7-8 17-18 16-31 0-6-5-12-4-18 4-3 9 1 12 1 12 4 25-6 24-18 0-13-17-22-28-15-2 1-8 3-8-2 0-8 4-17 9-24 7-9 19-14 31-13 11 0 21 8 30 14 4 3 6-2 8-5 6-11 19-19 32-17 11 2 21 8 27 18 1 2 2 6-1 8-6 2-13 4-17 11-4 5-3 12 2 16 6 7 16 10 24 4 2 0 4-3 5 0 4 6 7 12 12 16 2 2 4 6 7 6 2-2 0-6-1-8-10-43-25-86-38-129h-3zm-226 31c5 1 9 4 11 7 0 4-5 6-7 9-2 1-4 2-5 0-3-2-7-5-6-9 1-3 5-6 7-7zm166 0c4 1 8 4 11 7-1 3-5 5-7 8-4 3-9-1-12-4-3-4 3-11 8-11z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/></g><g fill="#6b4424"><path d="M931 474c-2 0-4 2-2 4 9 10 20 17 32 23 18 8 37 13 54 21 18 9 32 25 38 43 5 13 5 27 9 40 5 20 14 38 24 55 12 21 20 44 16 67-1 9-5 16-8 23-1 2 1 5 3 3 15-7 22-25 22-41 0-23-11-44-22-63s-22-39-24-61c-2-16-2-34-12-48-10-13-26-19-40-27-16-9-34-15-46-28-4-3-6-8-11-7l-33-4zM990 482c-3 0-4 3-2 4 9 7 20 10 30 15 13 6 25 14 37 21 2 2 3-2 2-3-3-8-8-15-14-22l-43-13-10-2z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M1034 551c-2 1-1 5-1 7 0 15-1 31 1 46 3 23 14 43 27 63 7 12 16 24 16 39 1 8-1 17-7 22-3 2-8 5-12 3-2-3 1-6 3-7 4-4 9-8 9-15 0-13-9-25-15-36l-22-37c-1-3-3 0-2 2 1 22 10 42 16 63 1 8 1 17-1 26l-8 17c2 3 6 2 8 3 10 2 20 5 30 4 7-1 10-8 13-14 9-17 5-38-2-55-9-21-23-39-29-60-8-21-8-45-18-65-2-2-3-6-6-6z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M779 650c-3 2-3 7-5 11-2 12-5 24-10 35-5 15 0 31 8 44 2 2 4 0 3-2 2-9 4-18 8-27 2-4 9-2 8 3-3 11-8 22-8 34 0 5-1 10 1 14 3 7 6 14 12 19 2-2 1-7 2-10l3-24c1-3 3-7 6-6 5 3 3 8 2 12-2 11-2 22-1 33 2 6 4 13 8 18 2 3 5-2 6-4 2-4 5-10 10-10 5 1 2 6 1 9l-8 15c0 5 4 9 8 12 3 2 6-3 8-5 5-7 10-14 10-23 2-9 0-19 3-29 1-3 5-1 6 2 4 6 3 13 2 19-1 14-6 27-14 38-2 1 0 3 2 3 11-3 22-6 32-13 9-8 13-20 13-32v-23c2-2 4-6 8-4 3 1 0 6 1 9 0 12 0 24 5 34 5 11 14 22 26 26 5 2 11 3 17 1 2-2-2-4-2-6-5-8-12-16-11-25 0-9-2-18 1-26 1-3 7-6 8-2 1 12-1 25 3 37 3 7 6 15 13 20 5 2 12-3 11-9 0-8-7-15-8-23 0-2 2-4 4-4 6 3 8 10 12 15 2 1 4-2 4-4 4-8 6-17 5-27l-3-29c0-2 0-7 4-7 5 1 5 8 7 12l4 29c2 2 4-2 4-3 5-8 10-16 10-26 1-12-3-23-7-34-2-3 0-9 4-8 6 2 6 9 8 14 1 6 1 12 4 18 3 1 3-3 5-5 3-7 7-14 7-23 0-11-6-22-9-33l-7-29c-2-3-4 0-5 2-8 15-15 30-27 43-2 2-7 2-5 6 1 7 5 14 3 21-1 4-6 2-8 0-2-1-3-1-2-2 0-8-3-15-5-23-6-15-20-24-34-30l-26-10c-5 1-10 5-16 5-6-1-11-5-17-3-13 3-25 9-36 16-14 9-22 24-27 40-2 3-3 7-6 8-2-4-1-9-1-13s3-9 1-12c-7-10-15-19-21-29l-11-20h-1zm130 23c7 3 12 8 18 12 8 1 18 1 24 8s10 18 18 24c-2-3-6-3-8 0-2 7-3 14-8 20-10 11-29 11-39 0-4-4-5-11-11-14-5-1-10 3-13 7-4 7-10 14-18 16-12 3-23-6-28-15-2-5-6-9-6-14s3-9 4-14c5-10 15-17 25-19l25-10c3-1 2 4 1 5-1 2-4 4-4 6 4 2 8 1 12 1 3 0 7 1 10-1 1-3-4-3-4-5s-1-7 2-7z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M769 547c-4 2-7 7-10 11-6 12-8 26-11 40-4 18-8 38-19 54-7 12-15 24-20 38-3 10-2 22-2 33 1 9 4 19 11 26 1 2 3 4 6 3l37-7c2-2-1-5-2-7-6-15-8-31-3-46l7-19 8-42c1-2-2-4-3-2-5 12-10 24-17 35l-11 16c-5 10-11 23-7 35 1 5 6 8 10 12 2 2 1 6-2 5-7 0-13-4-16-10-2-7-2-15-1-23 2-16 13-28 20-41 11-17 19-35 22-55l4-49c-1-2 1-6-1-7z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M867 474c-11 1-22 4-33 4-8 8-17 15-26 19-20 11-41 20-59 33-11 8-16 22-18 35-3 19-5 39-13 57-6 16-15 31-25 45-7 13-12 27-11 42-1 17 7 33 20 44 2 1 4-1 3-3-2-10-7-19-7-29 0-14-1-29 6-42 9-20 24-38 30-60 6-16 7-34 12-50 4-16 15-31 30-40 15-10 32-16 48-22 15-6 30-13 42-24 2-2 7-4 6-7-1-2-3-2-5-2zM811 482c-17 3-33 8-49 12-3 2-7 2-8 6l-11 19c1 3 4 1 5 0 20-13 43-22 64-33 2-1 2-4-1-4zM848 1744c-2-1-4 3-2 4 8 9 15 19 16 31 1 9 1 18-3 26-1 2-6 4-7 0-2-7 1-14 0-22 1-6 0-13-4-18-5-6-9-12-15-16-3-1-5 3-7 5-3 2-3 6-1 9 2 6 7 10 8 16 0 4-5 4-8 2-4-3-5-8-9-11-3 0-4 4-5 6-5 15-5 31-2 46 1 3 3 7 2 11-4 2-8-1-10-4-5-11-3-24-4-35-2-3-4 1-5 3-6 9-11 20-10 32 0 9 2 18 6 26 1 3 3 8-1 10-5 2-7-3-8-6l-6-20c-2-2-5 1-6 3-6 10-8 23-5 35 2 7 9 12 10 19 0 3-5 2-7 1-10-5-14-18-14-29-1-12 5-23 9-34 0-3-4-2-6-3l-33-6c-6-1-8 6-9 10-6 13-7 29-4 43 3 17 12 31 19 46s16 29 20 45c3 14 2 29 7 43 3 6 7 13 12 18 2-2 0-7 1-10 0-16 0-33-2-49-4-16-11-32-18-46-7-13-16-25-21-39-5-13-6-28 1-41 4-5 11-9 17-7 3 2 3 6 0 7-5 3-10 6-11 12-2 9-1 19 3 28 7 20 21 37 29 56l6 15c3 0 2-5 3-6 5-18 9-36 18-52l20-25c3-6-1-11-2-17 0-3-1-9 3-10l21 8c2 1 5 3 6 0 4-10 10-22 22-25 10-4 19 2 27 7 5 4 13 7 19 3 8-5 17-13 27-11 11 2 18 13 23 22 1 4 3 7 6 4 7-2 13-7 20-8 5 1 4 7 4 10 1 5-1 10-2 15 11 11 19 24 26 38 7 13 12 27 13 42 0 1 1 5 3 4 4-5 4-10 7-15 8-18 19-34 27-52 5-12 8-26 1-36-3-5-8-7-10-12-1-3 3-4 6-3 11 4 18 17 17 29 1 16-7 31-15 45-9 14-18 28-23 44-7 24-6 49-7 74 2 3 4-2 6-3 8-8 11-20 12-31 1-16 4-33 11-47 10-22 22-42 30-64 6-17 5-36-4-52-1-3-5-7-9-7-13 1-25 5-37 6-2 0-3 3-2 5 4 8 9 16 10 26 1 11-1 24-9 32-3 2-8 4-11 1 0-5 5-9 7-13 6-10 4-23-1-33l-7-11c-3 1-2 5-3 7-2 6-3 13-7 18-2 3-8 4-8-1 3-8 7-16 8-26 1-9 1-19-4-28l-10-16c-3 0-2 5-2 6-1 12 1 24-5 34-1 3-5 5-8 2-1-6 2-12 2-18 1-14 1-29-3-42 0-3-3-7-5-4-4 5-7 10-12 13-3 1-5-3-4-5 2-7 7-12 10-19 1-3-3-5-5-7s-4-6-6-4c-7 7-12 14-16 21-4 10-1 20-2 29 0 3 2 8-2 9s-6-4-7-8c-2-9-2-19 1-28 2-9 9-16 13-25 0-3-5-2-6-1-10 3-20 6-26 13-8 7-12 16-15 25l-1 33c-2 2-4 5-7 1-4-1-2-7-3-10l-1-29c-3-11-12-19-21-25-8-4-15-9-24-9z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/><path d="M975 1861c-7 2-11 7-16 11-5 5-10 12-17 15-12 5-26 6-36 15-3 3-7 7-11 4-5-5-11-10-18-13-8-3-17-3-24-9-9-7-16-17-26-22-2-2-5 1-4 3 2 10 7 19 12 27 7 10 19 14 30 19l14 8 21-3c7-1 13 5 20 3 14-8 29-14 41-24 9-8 15-20 16-32l-2-2zM703 1821c-5 2-8 7-11 11a72 72 0 0 0-6 65c7 20 21 36 30 55 9 20 13 42 17 64 2 13 6 26 18 34 14 10 31 14 45 22 15 7 28 17 40 27 10 4 21 4 32 5 2 0 8 2 7-2-12-12-26-22-42-29-19-9-41-11-58-25-9-7-19-15-25-24-7-11-7-24-9-36-2-11-4-21-8-31-7-17-17-32-25-48a97 97 0 0 1-5-80c1-2 3-6 1-8h-1zM741 2054c-3 1 0 5 0 7 5 10 13 20 24 25 14 5 28 8 42 10 3 0 6 2 9 0 0-3-4-5-6-6-21-13-46-21-66-35l-3-1zM1095 1821c-4 0-1 5-1 7 7 14 9 29 8 44-2 16-6 32-15 45l-22 41c-6 19-5 39-11 58-4 10-12 17-20 25-8 9-20 14-31 18-24 9-49 18-69 35l-9 9c2 2 5 1 8 1 10 0 20-1 29-5l10-8c19-15 41-26 63-35 11-5 21-13 28-23 5-9 5-20 7-30 3-21 8-42 18-61l16-27c7-11 13-24 14-38 1-19-5-41-20-55l-3-1zM1057 2054c-4 1-7 4-10 6-16 10-34 16-50 26-5 3-11 5-14 10 0 3 4 2 6 1 16-5 33-8 49-14 11-5 18-16 22-27l-3-2z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/></g><g fill="#0f1717"><path d="m1338 993 1 45 2 48c1 4 5 2 8 2 11-2 23-4 33-10 3-2-1-5-2-8-11-24-23-49-37-72-1-1-2-6-5-5zM1399 1124c-10 1-21 3-31 6-3 2 1 5 2 7 14 16 25 35 32 56 4 15 4 31 3 47-1 13-6 26-10 39-1 4 4 3 6 3 10 1 20 2 30 1 4-2 1-7 2-11-3-47-13-95-28-140-1-3-2-8-6-8zM1206 1130c-8 3-15 9-22 14-15 10-31 18-47 26-2 7 0 15-1 22l2 84c0 3 0 7 4 6h118c3-2 2-7 2-10s2-8-1-9c-9-2-20-7-23-16-2-5 0-11 0-16-5-5-9-11-9-18 1-5-4-4-7-4-6 0-11-4-13-10-3-14-5-28-6-43-1-8-1-16 4-23 1-1 2-3-1-3zM1145 1293c-3 0-7 0-8 3-1 2 0 5 2 6l7-5c1-1 4-3 2-4h-3zM1427 1329c-2 1-2 4-3 6a236 236 0 0 1-167 134c-10 3-20 3-29 5-2 0-4 2-2 4 5 6 12 11 18 16 29 26 56 54 79 84 3 4 5 8 9 11 2 2 4-2 6-3l22-40c18-35 34-72 47-110l8-26c8-25 13-51 14-77 0-1 0-4-2-4zM539 1293c-3 5-1 11 0 17 1 3 3 5 7 5 7 3 11 11 12 18v11c5 5 10 11 11 19 2 3 7 2 9 4 8 4 11 12 13 20 4 16 5 33 5 49 2 3 4-1 6-2 19-12 39-22 59-33 2-5 1-10 1-16l1-91c-2-3-6-1-8-1H540zM661 1271c-5 2-8 5-11 8-2 2 0 3 2 3h11c0-3 1-7-1-10l-1-1zM388 1293l-20 1c-2 2-1 5-1 7 0 19 4 38 7 57 5 27 10 54 19 81 2 5 3 10 7 14 2 1 5-1 8-1l23-5c2-2-1-3-2-5-10-13-20-27-26-43-10-22-13-48-9-72 2-11 7-21 11-31 0-3-4-3-6-3h-11zM453 1487c-10 1-21 3-31 7-2 1-5 2-4 5 5 14 12 27 18 40 7 14 13 28 21 41 1 1 3 1 3-1v-35l-2-54c0-2-2-3-5-3zM466 987c-5 1-7 6-9 9a748 748 0 0 0-85 226c0 7-2 13-1 20 3 0 3-5 5-6a247 247 0 0 1 190-134c2-1 6 0 6-3-2-4-6-5-8-8-16-12-31-28-45-42-17-18-32-38-48-57l-5-5z" style="paint-order:markers fill stroke" transform="matrix(1.3364 0 0 1.2429 -344 -334)"/></g></g></svg>
                    </g>
                `
                },
                'Q': { 
                    red: `
                        <g>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1696" height="2528"><path d="M846 2503c-4-4-22-26-26-33-4-5-7-17-7-23 0-7 0-7-5-7-6 0-12-2-21-8a541 541 0 0 1-101-36c-7 10-17 15-31 17l-9 1-9 8c-10 9-15 14-29 24-10 7-10 7-14 5-7-3-6-5 13-63a1790 1790 0 0 0 24-76 1170 1170 0 0 0 19-68c-3 0-30-35-38-49-20-35-30-87-25-123 5-30-8-53-42-78-43-32-54-52-49-94l-13-9a472 472 0 0 1-90-59 68406 68406 0 0 1-8 137l-2 54c-2 44-2 81 0 81 18 0 26 28 11 42-5 6-5 5 4 19 40 61 40 98-1 124-22 14-23 14-13 24 25 26-9 71-43 56-23-10-31-40-14-56 8-9 7-10-9-22-45-34-47-64-8-121l14-19-7-6c-12-13-9-31 7-39l8-4-1-59a1910 1910 0 0 0-4-165 638 638 0 0 1-3-67l-2-31-1-17-6-6c-28-27-75-105-70-115a227 227 0 0 1 26-32l8-9 3-3-3-10a1590 1590 0 0 0-28-87 1670 1670 0 0 0-39-122l-14-42c-20-63-20-62-13-82a401 401 0 0 0 12-35l7-24 31-89c9-27 10-30 7-68-2-21-2-22 4-22l7 1c14 8-9-23-32-41l-10-8-6 7-7 9-8 9c-14 18-20 22-25 17-4-4 2-15 24-38l10-14-10-13-11-14-2-5c-5-6-1-30 7-37 3-3 3-4 2-7-5-14 2-26 18-34l-1-5c-3-9 3-22 13-28 3-2 3-3 3-10 0-11 9-24 18-24l6-2 7-3 2-1 6-2c10-1 12-6 3-6l-5-1-4-1-8-3-6-2c-19-1-47-39-52-70-4-24-1-29 20-24l15 3c28 6 54 23 63 41a115 115 0 0 1 13 43c0 15 6-1 17-44 5-19 6-18-10-26-28-13-43-33-56-72l-5-13c-12-16-2-32 22-35 6-1 7-3 5-18-3-35 9-47 45-42 12 1 12 1 15-1 26-20 62-13 81 13 3 4 6 7 8 7l15 5 8 6c30 19 35 54 11 76l-5 5 2 9c5 19-7 40-33 56l-8 6c-12 9-46 15-65 11-11-2-11-2-12 5l-3 11a539 539 0 0 0-14 50c-3 5-2 7 2 5s14 0 16 3c1 2 5 3 5 1a411 411 0 0 1 83-73l4-4 4-2 4-3 5-3 6-4 6-4 9-4a449 449 0 0 1 36-21v-20l1-20 6-11c7-15 19-29 32-39l7-5 9-6c19-14 34-35 38-55l1-31a211 211 0 0 1 27-121c0-3 25-36 35-47 7-7 10-13 7-13l-2-2a491 491 0 0 0-17-58 1742 1742 0 0 0-17-51l-20-64c-8-22-4-33 8-24l4 3h2l7 6c9 6 17 13 22 20 4 5 4 5 11 4 11-2 22 3 32 13l5 4 7-3a418 418 0 0 1 88-34c9-4 16-7 21-7 4 0 5-2 5-9 0-14 7-25 28-48l3-4c3-5 10-5 14-1l13 13c16 18 19 23 20 39 1 8 1 9 4 10 10 2 24 8 25 10l5 1c10 0 31 8 70 25 17 7 17 7 20 4 6-7 20-13 32-13 7 0 7-1 11-5 13-16 47-37 48-30v15l-7 23a406 406 0 0 1-18 54 1553 1553 0 0 1-33 106c-4 6-4 6 5 16 47 53 62 92 63 160 0 57 7 71 47 100a204 204 0 0 1 17 13c7 4 18 21 24 34 5 10 5 12 5 29 0 18 1 21 4 22l4 2 11 6a295 295 0 0 1 36 22l12 7c19 13 20 14 22 14l2-32 3-56c2-47 3-167 1-167-16 0-23-28-10-42l5-5-4-5c-48-68-48-102 0-136 15-10 15-11 8-18-34-33 19-80 54-48 13 12 14 38 2 50-6 5-5 8 4 14 52 35 53 67 6 135l-6 9 3 2c2 0 3 2 4 3l3 5c8 9 1 29-11 34l-4 2v51a3347 3347 0 0 0 8 246l1 19 5 6 14 16 13 16 9 12 11 15 6 9 20 34c16 27 16 25-2 48a6539 6539 0 0 0-19 25c-3 3-3 4-2 8a435 435 0 0 0 24 78 13721 13721 0 0 1 70 216c7 16 8 24 3 39a1067 1067 0 0 0-15 50 591 591 0 0 1-18 53 468 468 0 0 1-17 53l-6 19-1 23c0 22-2 24-15 19-4-1-1 3 9 14 12 11 35 31 38 31l19-22c18-24 21-27 26-23 7 6 5 10-26 48l-7 8 9 10c19 21 22 38 10 55-3 4-3 4-1 9 3 10-1 24-9 31-4 4-4 4-5 13 0 10-3 16-12 21-3 2-4 4-4 6 2 7 1 16-1 18l-2 3c0 3-27 19-41 24-5 2-4 2 6 4 39 5 66 27 78 64 8 28 7 33-7 33-55 0-92-24-103-67a1814 1814 0 0 0-5-22l-7 28c-8 39-8 46-4 46 21 0 56 35 66 66l10 18c12 22 6 36-20 40h-5l1 21c1 36-3 41-37 41l-18 1-6 4c-25 18-52 16-76-8-7-7-10-9-14-10-8-1-25-10-33-17-23-20-22-48 1-73l3-3-3-5c-11-17 0-38 33-61 20-15 32-19 62-18h17l1-5a2914 2914 0 0 0 9-72c-5 3-6 4-11 3-6-1-6 0-10 5a733 733 0 0 1-73 70l-21 15c-21 15-38 26-64 39-11 6-12 6-11 10 2 41-10 66-46 90-41 27-48 40-46 90 2 66-19 119-64 163v7l5 17a2417 2417 0 0 0 37 118l9 28c9 29 9 31 5 34-4 4-7 4-11 1l-7-6-29-25c-4-4-5-5-13-5-11-1-20-5-28-13l-5-5-7 3-9 4a502 502 0 0 1-76 29l-8 4-14 5-10 2-1 8c-1 12-3 17-20 37-15 20-19 23-25 16zm15-26c15-18 19-33 13-44-5-10 2-16 12-10 18 10 40-11 30-29-5-9-21-15-32-12-14 5-17-1-10-18 16-35 59-44 87-17 8 8 7 8 11 0 12-23 36-33 58-23s32 36 14 36c-13 0-22 18-13 28 6 7 28 13 31 8 2-4 7-2 9 4 9 20 20 25 14 6a4742 4742 0 0 1-45-146c-2-8 0-8-19-2l-64 12a753 753 0 0 1-275-13c-18-5-16-7-22 16a3083 3083 0 0 1-39 124c-9 28-3 31 10 5 4-7 4-8 12-5 13 4 29-2 32-12 4-11-1-21-13-25s-14-8-7-19c19-29 60-26 76 5 4 9 5 9 12 2 30-28 73-19 89 19 5 14-1 23-12 16-10-6-31 4-33 16-3 16 16 31 30 24 12-5 18 0 13 12-3 6-2 18 3 27 4 7 19 26 20 25l8-10zm-89-76c2-17 15-32 34-34 9-2 9-3 2-9-20-19-45-15-62 9-12 18-18 18-23 0-9-31-30-41-49-24l-4 3 3 2c13 11 18 17 18 25 0 5 1 6 13 12 23 11 44 19 59 23 9 2 9 2 9-7zm173 6a613 613 0 0 0 59-23l9-5 1-6c1-9 3-13 12-21s9-8-1-14c-18-10-45 7-45 29 0 15-11 17-19 4-19-28-43-33-64-14-7 7-7 7 3 9 21 5 33 19 33 37 0 4 1 6 2 6l10-2zm-577-53c9-8 13-33 4-33l-6-5c-11-9-4-24 18-38 38-24 38-48 3-102-16-25-14-23-32-23l-15 1-3 4c-48 59-50 94-6 123 20 13 24 27 10 39-19 17 6 50 27 34zm515-91c31-2 30-2 37-9 6-7 20-16 49-30 33-16 31-13 32-31 4-62-1-107-19-155-30-81-110-128-170-101s-102 96-110 182l-1 68v20l10 6 33 16c25 13 32 17 40 26l5 6h12l26 2c24 2 29 2 56 0zm-140-56c-11-3-15-5-24-11l-6-4v-8c2-2 2-2 14 3 32 15 69 13 93-5 10-7 14 4 5 12-15 14-56 20-82 13zm167 0c-23-6-38-18-31-26l2-2 9 5c31 17 58 18 91 1 10-4 16-1 11 6-11 15-53 24-82 16zm-82-30-1-18-2-31c-8-62-8-60 8-67 16-8 21-8 36 0l6 2 9 7c0 6-10 8-16 4-13-7-25-7-33 2-2 2-2 19 1 44 5 37 0 71-8 57zm-74-3c-18-5-36-18-33-23 2-4 8-3 20 4l9 4v-7c-1-3 3-9 10-14 11-8 26 0 26 14l1 6 16-8c14-7 20-1 9 9a69 69 0 0 1-58 15zm167 0c-19-5-36-18-31-24 3-3 9-1 20 7 6 3 7 2 6-5-1-11 14-21 26-15 8 3 10 7 10 18 1 4 2 4 13-1 15-7 15-7 17-4 4 4-8 17-15 17l-6 2c-9 5-30 8-40 5zm-88-143c-25-7-35-13-32-18s19-4 32 1c5 2 6 2 10 0 6-2 14-2 17 0 4 2 7 2 11 0l12-3 11-2c9-2 12 9 4 12-19 9-34 12-41 9-5-1-6-2-11 0-6 2-7 2-13 1zm-7-36c-3-3 4-10 14-12 16-5 44 3 39 11-1 1-51 3-53 1zm-67 259-29-15c-98-48-128-94-115-181 5-36-2-55-28-75-27-22-37-37-37-57 0-5 1-5-28-15-11-4-11-4-11 10 1 25 9 35 57 70 30 22 40 52 35 109-1 11 3 39 10 60 8 26 41 71 54 76a599 599 0 0 0 92 18zm225-5 34-8 20-5 10-9c37-38 54-86 53-145-2-53 6-71 48-101 28-21 34-27 40-41 3-8 5-33 3-33l-34 13c-3 2-3 3-4 11-2 17-17 37-45 58-20 16-25 37-18 78 9 55-11 101-60 138-20 16-24 18-52 31-39 19-38 22 5 13zm49-67c13-12 20-21 27-33a107 107 0 0 0 15-73c-5-21-6-52-1-62 8-19 18-32 34-46 21-17 28-26 30-38 1-4 0-4-12 0l-14 4c-12 3-13 3-14 9-2 9-14 27-28 41-15 16-21 46-15 79 5 31-9 67-34 83-2 1-4 35-3 47 1 2 3 0 15-11zm-348-9c-1-25 0-24-8-30a74 74 0 0 1-27-63c2-70 1-73-25-105-13-15-15-19-18-29l-2-8-16-5-20-5c-9-3 3 21 16 32 41 34 57 70 46 103-12 37 3 84 37 117 18 17 17 17 17-7zm-305-37c10-3 7-16-4-18-13-2-45 0-47 3-5 5-3 13 4 15h47zm307-22c6-52 17-88 40-122 14-21 13-16 12-46-1-36-5-49-18-61l-7-6v34c-1 41-1 39-15 38-25-2-25-2-17 8 15 20 18 56 5 56-5 0-7-3-8-15 0-12-3-19-13-35l-8-13-4-5a1384 1384 0 0 0-27-5c-6-1 0 10 11 23 27 29 33 50 28 101-2 26 2 42 14 56 5 7 5 7 7-8zm338 6c12-13 15-28 12-58-4-53 0-67 29-98 6-6 14-19 13-21-3-5-36 7-36 13l-4 7c-9 13-14 26-15 37s-3 15-8 15c-9 0-10-30-2-43l2-4 5-9 5-8h-16c-23 0-21 4-21-38v-34c-2 0-10 8-14 15-10 16-11 23-12 52l-1 26 9 13c10 13 17 25 25 45a2322 2322 0 0 0 10 27l4 18c3 9 6 29 6 35 0 15 2 18 9 10zm-659-56a6648 6648 0 0 1 18-318 898 898 0 0 0 7-86l9-99c2-15 0-27-10-55l-8-23c-1-6-2-6-9-5l-18 1c-14 0-13-1-20 17-3 8-6 16-8 18-7 14-8 32-6 69l3 38c3 52 3 51 9 112a2387 2387 0 0 1 11 200l2 55 1 59v54h18zm1017-41c10-5 23-18 23-23-1-6-4-6-12 0-25 19-47 13-70-18-6-8-7 3-2 15 14 27 38 37 61 26zm57-13c6-1 8-15 5-32-1-8-2-8-6-1-1 4-6 12-11 19-11 16-8 19 12 14zm-136-16-2-8c-3-13-3-43 1-59 3-9 1-9-9 1-27 26-27 45 0 63 5 3 10 5 10 3zm74-2c7-3 7-5-1-11l-11-8c-5-5-6-5-15-1-10 3-11 4-6 10 9 12 21 16 33 10zm27-24c-2-22-6-27-17-18l-8 7c-8 0-1 9 11 15 14 7 15 6 14-4zm21-1c11-17 11-71 1-87-13-19-24-26-38-26-29 0-33 26-8 48 29 26 39 43 40 63 1 8 1 8 5 2zm-93-5 14-4c25 0 42-27 26-42-15-13-21-22-23-33-2-9-2-9-7-4-12 12-21 35-27 66-4 23-3 23 17 17zm-571-10 11-9c50-42 117-39 167 8l6 6 1-17c2-39 11-59 37-78l7-5v-12c-1-11-1-11-5-14l-15-10c-72-48-175-46-246 4l-12 9v12l-1 11 5 4c28 20 37 38 38 76l2 19 5-4zm707-5c8-3 8-6 2-15l-9-16-15-30c-2-2-2-2 0 6 4 14 5 33 1 55 0 4 11 4 21 0zm-442-13a878 878 0 0 0 75-14 562 562 0 0 0 110-42c58-30 144-100 161-131 2-4-7-19-33-54-27-36-38-74-30-109 3-12 4-28 3-40-1-10-1-10-9-7-3 1-8-7-12-18-5-14-2-11-34-32a882 882 0 0 0-248-106h-5v277l1 278h3l18-2zm13-47c-5-7-4-27 3-37 15-22 28-19 26 6-2 19-21 40-29 31zm111-23c-12-7 3-40 22-50l7-3 2 3c11 16-16 60-31 50zm-62-93c-8-12 2-39 18-49l7-4 2 4c7 9 3 31-8 42-7 7-17 11-19 7zm147-2c-9-15 18-52 35-48 7 2 2 35-6 33l-1 1c2 3-10 12-19 13l-6 1h-3zm-189-61c-7-16-2-36 11-47 9-8 15-3 16 13 2 23-20 51-27 34zm155-39c-6-17 13-50 29-50 12 0 7 30-7 44-7 7-20 10-22 6zm-105-71c-5-14-1-28 10-39 11-12 16-11 19 4 6 24-23 58-29 35zm87-49c-8-16 0-40 17-50l4-3 3 3c10 12 4 41-11 50-9 5-10 5-13 0zm-134-59c-12-21 7-65 20-47 10 14 3 44-11 51-5 2-5 2-9-4zm-353 168-1-278a909 909 0 0 0-276 125c-11 8-11 9-10 14 5 11 6 29 4 54a2788 2788 0 0 0-11 129 851 851 0 0 1-6 67 1031 1031 0 0 1-2 43 487 487 0 0 0 297 123l5 1zm-41 231c-16-6-26-35-19-51 3-6 2-6 11-1 16 11 23 32 16 48-3 5-4 5-8 4zm-113-26c-15-7-28-30-24-45 2-6 4-7 11-4 25 12 38 60 13 49zm62-92c-19-8-32-52-15-52 16 0 30 29 25 49-2 6-3 7-10 3zm-146-2c-14-4-25-15-29-29-6-22 4-25 24-9 11 8 17 25 14 36-1 3-1 3-9 2zm185-58c-16-11-20-37-9-52 7-10 25 17 24 37-1 15-7 20-15 15zm-156-43c-13-6-22-21-22-36 0-14 5-16 16-9 24 17 29 57 6 45zm105-66c-11-7-16-15-16-31 0-22 5-26 18-14 19 18 18 58-2 45zm-85-52c-15-10-21-29-15-45 6-18 30 8 29 31-2 17-5 20-14 14zm137-56c-14-5-22-34-15-47 6-11 10-12 17-4 14 17 13 57-2 51zm656 407c12-8 14-9 20-20 7-11 17-22 23-25 7-4 2-3-7 0-23 10-48 34-48 46 0 7 1 7 12-1zm220-63c1-2-5-23-10-30-9-17-33-33-55-35l-15-2c-10-2 2 31 17 46 14 15 60 30 63 21zm-804-25c30-26 104-46 151-42 42 4 81 17 112 37 11 8 11 9 10-17v-21l-4-3c-63-46-206-46-269 0l-5 3v22c0 23 1 25 5 21zm11-70a294 294 0 0 1 259 5c3 1 3 1 3-13l-1-12-10-7c-52-36-96-86-120-138-9-19-8-18-14-4-16 41-49 83-90 118-17 14-27 22-33 25-8 6-8 5-9 18-1 16-2 16 15 8zm668-3c8-15-1-47-20-74-5-8-6-14-1-20 20-27 21-52 4-79-7-11-2-22 7-14 22 20 26 54 10 87-7 13-7 12 1 16l7 3 1-10c0-10 5-17 12-18 3-1 3-2 3-8 0-12 6-20 17-23 1 0 2-2 2-5 0-15 20-23 37-16 2 1 9-9 9-12l-15-13c-30-24-39-35-41-46-2-13-44-11-84 6-22 9-21 9-19 19 3 10 3 31 1 39-10 43-1 80 27 115 14 17 23 31 31 46 7 14 7 14 11 7zm53-3c32-15 38-21 25-27l-8-7c-6-5-7-4-7 2s-1 6-8 10c-35 18-36 37-2 22zm-1132-8-2-24a3219 3219 0 0 0-10-111l-1 2-9 11a309 309 0 0 0-25 28c-11 13-8 22 26 71 19 30 22 33 21 23zm1103-28 2-14-7-5-8-5-5-2-4-1 7 14c4 7 8 16 8 19 3 12 3 12 7-6zm17 4c3-2 4-9 2-10h-1l-2 6c-2 6-1 7 1 4zm-708-13c52-36 100-102 112-156 2-9 2-18 2-132v-121h-50l-1 102c0 111 0 109-8 137-11 38-27 65-59 98l-13 13v35c0 19 1 34 2 34l15-10zm261-24 1-34-10-9c-34-37-52-69-65-115-6-25-7-34-7-135v-92h-51l1 125c0 140-1 124 10 152 5 14 7 17 18 37 19 34 50 68 88 96 16 12 15 14 15-25zm503 21c4-4 4-11 1-14-7-6-65-33-69-31-10 5-3 16 17 26l21 13c21 13 23 13 30 6zm13-33c5-6 5-15-1-18l-58-24c-13-5-16 12-4 18l31 15c26 13 28 13 32 9zm8-37c6-7 4-16-6-29-8-11-9-11-12-9s-3 5 2 6c4 0 6 3 5 8 0 6-6 7-17 4l-12-5c-8-3-14-3-18 0-4 4-2 5 22 15 31 14 31 14 36 10zm-524-174v-162h-31l-32 1c-2 1-2 153-1 178 3 54 24 106 56 141 9 9 9 19 8-158zm-265 153c22-23 40-60 49-99 3-13 3-13 3-114v-102h-63v162l1 162 10-9zm-425-21 4-3-1-18c0-22 3-32 14-56 8-19 8-20-1-21-20-2-32-14-36-37-1-5-3-15-6-21-2-6-3-21-1-27l2-23c0-16 0-18 4-26l4-12c1-18 16-34 38-37 4-1 6-8 3-11l-124-1c-1 1 17 59 33 109a3362 3362 0 0 1 39 119 4433 4433 0 0 1 24 68l4-3zm1020-69c38-20 75-26 122-19l4 1v-13c1-7 0-20-1-28l-2-14-10-3c-41-13-92-3-139 26-7 4-7 4-1 21l6 16 9 19 12-6zm-913-12 8-8c9-7 9-8-1-10-5-2-14-1-16 0-1 1 3 13 5 17 1 2 3 2 4 1zm865-31-4-12-12-32a32891 32891 0 0 0-45-125c-3-12-2-12-29-13h-25c-2 1-2 10-2 66v65l20 9c28 13 62 31 76 40 24 16 25 16 21 2zm-824-2c16-9 12-73-5-87-6-5-7-5-10 6-2 7-2 7 0 9 10 8 9 28-1 37-3 3-3 5-1 9 3 4 3 15 0 20-6 8 5 12 17 6zm-76-1c38-2 41-3 45-13 5-12 0-13-45-13h-36l-3-3c-3-4-3-5 1-9l3-3 40 1c49 0 47 1 47-12 0-6 0-8-3-11l-3-3h-83l-3-3c-4-4-2-12 4-13h41l39 1 3-4c3-4 3-4 1-10-3-11-9-12-54-13-32-1-37-3-34-10 4-6 5-6 42-5 38 1 36 1 36-7 0-6-5-10-17-12l-13-3c-59-11-77-7-81 18l-4 13c-5 7-6 20-3 35 2 4 1 6-1 10-3 8-3 23 2 32 2 5 3 9 3 15 0 17 14 25 41 24l35-2zm134-28a766 766 0 0 0 36-18c6 0 6 0 6-66v-64c-1-2-135-4-141-1-1 0-2 4-2 10v10l8 5c11 7 13 10 13 25v11l4 5 7 5c11 0 26 13 30 28a278 278 0 0 1 7 66l32-16zm787 7c49-28 89-36 132-27 13 2 15 2 15-1l-2-17-2-20v-11l-1-15a506 506 0 0 1-4-66h-206v3l3 9a4748 4748 0 0 1 53 150c0 1 3 0 12-5zm170-24 6-19 7-24a5113 5113 0 0 0 28-87v-3h-28c-20 0-29 1-30 2s0 12 1 15l1 10a16407 16407 0 0 0 7 91c2 28 3 30 8 15zm-883-15c31-12 83-29 105-34l11-3v-82H564v62c0 59 0 63 2 62l14-5zm559-57v-62h-133v81l10 3a1587 1587 0 0 1 122 40l1-62zm-749-52c1-11 3-11-25-10l-23 1-1 4c0 6 1 8 7 8l13 2 24 4h4zm89-27a2596 2596 0 0 0-51-153c-11-34-9-31-19-25-39 23-83 31-129 24-22-4-20-11-14 55a2714 2714 0 0 1 6 100c1 2 207 2 207-1zm216 1c1 0 2-14 2-40v-40l-5-1-17-5a1175 1175 0 0 1-110-38c-2 1-2 124 0 125 1 1 128 0 130-1zm294 0c2-4 2-326 0-325-3 1-28 34-35 47-14 24-20 43-25 73l-4 22v183l28 1a7464 7464 0 0 1 36-1zm150-61-1-63-12 5-17 7c-51 17-64 21-89 27l-14 4v82h133zm215 60v-9l-8-1-17-2c-20-4-20-4-21 6l-1 8h21c21 1 26 0 26-2zm-1099-2-1-15-2-27a1154 1154 0 0 0-7-93l-21 59-25 78c0 2 3 2 28 2h28zm293-24c0-80-1-102-3-104l-35-18c-37-18-49-24-63-34-16-10-15-11-5 21a2893 2893 0 0 1 25 76l25 76 3 11h52zm229-71c-1-88-1-101-3-110-9-46-27-82-55-113-7-7-6-24-6 159l1 163h63zm66-23v-123l-3-12a289 289 0 0 0-127-163v36l1 36 6 5c24 21 53 68 64 107 8 30 8 27 8 136l1 100h50zm66 31c0-83 0-92 3-109 7-55 27-96 65-137l13-14 1-35-1-36-3 2-16 12c-24 19-39 34-59 58-23 27-43 66-50 96l-4 13v241h51zm382 82c2-10 2-12-3-13-13-3-21-19-16-32l2-4-6-7c-6-5-7-6-12-7-17-2-25-16-29-47a459 459 0 0 0-3-36c0-11 2-11-29 5l-32 15c-6 2-11 6-9 9v62l1 62c1 2 10 2 67 2l66-1zm213 8-8-25a10744 10744 0 0 1-69-213l-20-56c0-1-4 1-9 7l-9 8-1 13c0 19-3 32-11 52l-4 11-4 10h6c22 0 42 16 43 35 0 6 2 11 4 16 3 7 3 9 3 23v27c0 12-2 24-5 29l-4 16c-5 23-18 36-38 38l-7 1-1 4v5h67l67-1zm-119-27c10-5 14-12 15-24l2-9c5-6 8-25 5-32-1-5-1-5 1-12 3-8 2-26-2-33-1-3-3-9-3-14-2-25-25-31-81-24l-20 2c-16 0-24 5-21 16 1 8 1 8 43 7 46 0 51 2 40 13l-4 3h-81l-2 4-4 4c-2 1 1 10 5 14l4 3 42 1c47 0 48 0 45 9-2 5-2 5-46 6l-42 1-3 4c-2 5-2 6 0 10 3 10 4 10 57 12 25 0 27 1 30 3 7 7 0 13-14 11-53-3-76 1-63 13 5 5 12 6 44 11l14 2c2 2 34 1 39-1zm-123-62 3-7 3-4-3-4c-9-9-8-28 1-38 2-2 2-3 1-5-2-3-3-23-1-25 4-2 1-5-4-5-22 0-26 14-18 64 3 19 18 40 18 24zM697 894l-1-275a366 366 0 0 0-100 16 958 958 0 0 0-63 20 510 510 0 0 0-191 134c0 2 7 15 14 25 34 50 41 69 40 106l-3 37c-5 25-4 40 2 36s11 2 16 20c5 16 11 35 13 36a419 419 0 0 0 57 36 881 881 0 0 0 214 85c1-1 2-93 2-276zm-64 218c-7-7-8-29-1-40 12-23 26-18 24 10 0 19-15 37-23 30zm-140-63c-5-11-2-29 6-39 13-16 23-13 23 7 0 21-23 46-29 32zm86-55c-6-12-2-31 10-43 12-11 18-6 18 14 0 22-21 44-28 29zm-110-65c-12-11 9-49 26-49 6 0 7 21 1 33s-22 21-27 16zm165-36c-12-13 0-55 15-55 8 0 13 27 7 39-5 12-17 20-22 16zm-55-62c-7-19 8-50 24-50 6 0 9 12 7 23-5 20-26 38-31 27zm-152-6c-10-17 21-52 36-42 3 1 2 15-1 21-7 15-31 29-35 21zm93-88c-10-14 16-58 30-49 13 7 0 40-19 49-8 3-9 3-11 0zm120-21c-12-14 1-58 17-56 14 2 10 37-5 52-6 5-10 6-12 4zm386 449 28-8 34-11 22-9a827 827 0 0 0 172-90c1-1 0-5-2-10l-3-12-2-11v-18l3-21 1-19a453 453 0 0 0 3-39l5-51a5954 5954 0 0 1 7-92c3-19 3-46 0-47l-3-2a1139 1139 0 0 0-61-40 638 638 0 0 0-167-60c-18-4-55-8-56-6-1 1-3 549-2 550s11 0 21-4zm29-60c-11-14-13-37-3-47 8-7 23 13 23 31 0 23-9 30-20 16zm147-53c-15-6-25-31-19-47 3-8 10-6 20 4 8 8 10 17 9 31 0 14-2 16-10 12zm-93-58-7-7-2-5c-7-8-6-35 2-36 9-3 25 18 25 33 0 20-7 25-18 15zm118-63c-18-6-36-51-19-51 13 0 29 21 29 39 0 11-2 14-10 12zm-172-43c-11-13-15-33-7-45 8-14 26 7 26 29s-8 29-19 16zm51-62a43 43 0 0 1-12-40c3-17 32 10 33 31 0 19-7 23-21 9zm155-2c-14-8-22-19-23-32-1-20 29-8 38 14 6 18 0 26-15 18zm-86-85c-14-3-29-27-26-43 1-11 8-12 20-3 18 13 23 49 6 46zm-126-30c-19-22-12-61 7-43 10 10 12 16 13 29 0 22-8 28-20 14zm-709 388c20-3 42-11 61-22 14-8 14-7 8-24a360 360 0 0 1-14-38l-18 9a178 178 0 0 1-120 14c-9 7 4 56 16 59 21 5 45 6 67 2zm956-19c0-1-2-6-7-13l-13 9c0 2 18 5 20 4zm54-3 4-5 4-11 10-31c3-9 4-34 2-57a6676 6676 0 0 1-13-147l-2-18-3-42-3-51-2-36c-2-26-5-117-5-176v-45h-20v45a5748 5748 0 0 1-31 498c0 24 2 30 19 68l4 9h17l19-1zm-1035-51c26-2 63-15 62-22-2-10-2-31-1-42 8-47 8-55-2-83-4-13-7-19-24-43a344 344 0 0 1-27-49c0-4-3-2-7 4-8 16-6 26 12 62 7 14 9 22 7 25l-6 8c-19 26-19 63-1 82 3 3 3 4-1 8-13 13-33-32-27-61a92 92 0 0 1 13-32c5-7 5-10 0-10l-6-3c-4-4-6-3-4 1 4 8-3 22-11 25l-3 9c-1 10-7 17-15 19-5 0-6 1-9 10-3 11-16 18-29 14-7-2-7-2-12 5-5 6-5 5 8 16a192 192 0 0 1 44 51c1 5 1 5 14 6l10 1 15-1zm549-60a310 310 0 0 1 80-103l31-24c16-11 16-10 16-24 0-12-1-14-6-10a274 274 0 0 1-271-1v26l5 2c51 31 104 93 128 152l4 9 3-6c1-3 5-13 10-21zm531-5a948 948 0 0 0 38-46l7-11-8-17c-13-26-56-87-61-87v8a1243 1243 0 0 1 7 72l2 29c3 34 6 59 7 59l8-7zM211 941c1-4 2-4-4-7-13-9-4-19 10-12l8 3 7 4c10 7 24 2 18-6-2-3-42-24-49-25-6-2-12 6-12 15 0 11 20 37 22 28zm62-35c4-4-1-14-6-14l-4-2-12-7-10-6-6-3-15-8c-13-8-21-4-21 9 0 10 67 37 74 31zm15-28c5-8 1-12-39-38l-10-7c-12-7-17-7-20 0-6 9-3 12 36 34l11 7c10 8 19 9 22 4zm19-34-10-23c-2-8-5-8-4 0l-1 2c-6 8-4 16 5 21l10 6c2 4 2-1 0-6zm-32-19c2-7 2-7 0-7s-6 8-5 10c1 4 3 2 5-3zm-20-3-1-3c-2-2 6-9 15-14 14-7 19-13 19-22 0-4-5-3-38 8-14 5-19 11-15 20 3 5 20 15 20 11zm636-2c35-6 80-23 97-37 2-3 5-44 2-44-2 0-12 5-15 8a232 232 0 0 1-163 31 232 232 0 0 1-98-39l-1 21v22l7 4a277 277 0 0 0 171 33zm-26-54c44-3 88-19 118-43l8-6v-21l-7-5c-22-14-35-40-36-75-1-18 0-18-10-8-51 48-113 49-169 3-15-12-14-13-14 6-1 35-13 60-35 73l-7 5v10c0 13 0 14 20 27a262 262 0 0 0 113 35l19-1zm-584-13c0-20-16-47-34-57-14-8-21-10-43-13l-6-1 1 4c6 36 26 59 61 67 14 4 21 4 21 0zm103-73c24-5 61-43 51-53a171 171 0 0 0-31 24l-12 13c-5 7-11 13-13 14-5 3-6 4-2 3l7-1zm-37-5c17-9 13-29-11-53-17-16-26-33-31-56v-4l-3 4c-6 8-11 25-13 43-5 39 31 79 58 66zm381-15c9-13 11-24 11-57l1-23-6-8a285 285 0 0 1-49-139c-1-7-1-7-7 1a85 85 0 0 0-11 65l1 18c0 27-3 35-26 64-17 21-22 33-14 30l17-2 14-2 1-5c1-8 5-18 9-23 8-9 10-17 10-35 1-8 12-11 14-4 6 13 0 38-10 50-10 11-9 13 9 13l19 1 3 2v70l4-4c3-2 7-8 10-12zm263-55c2-3 7-4 20-2l14 1c2-1-1-9-11-27-9-16-6-43 5-40 5 1 6 4 6 16s1 15 9 27l7 16 3 10 18 3c23 3 22-2-7-35a85 85 0 0 1-19-58c3-52 1-69-14-87-3-4-3-4-5 12l-2 18-2 9c-6 32-24 76-43 104l-6 9v14c0 39 5 60 18 74l7 7v-34l2-37zm-609 49c28-31 39-84 17-81a106 106 0 0 0-55 25c-5 4-4 8 9 20 12 11 18 22 19 33 1 12 1 12 10 3zm-104-13c-3-6-5-24-4-45 1-19 1-19-7-18-16 3-18 5-12 15 3 4 6 13 8 20 4 13 14 35 16 34 1-1 0-3-1-6zm236 5 5-3 18-6 13-5v-5c0-21 8-33 41-63 25-24 33-47 24-79a139 139 0 0 1 8-81l5-7c13-24 38-46 65-59a447 447 0 0 0 22-9l22-7a319 319 0 0 0 41-14c16-5 56-34 50-36a588 588 0 0 0-152 27c-9 4-25 21-38 40l-6 9c-20 30-28 61-28 114 0 57-9 75-49 105-28 22-41 37-44 54-3 14-1 31 3 25zm678-15c-1-27-5-33-38-60-49-37-53-47-54-115v-36l-4-16c-11-36-28-66-53-94-9-9-13-12-27-15l-13-4-28-7a1043 1043 0 0 0-100-12c0 6 41 35 50 35l7 3 15 6 16 4 20 6c72 22 119 88 107 149-5 28-6 41-4 47l2 6c2 10 10 21 31 41s30 32 32 41l3 20 6 5 32 12v-16zm-319-3c22-5 46-21 73-49a279 279 0 0 0 57-188v-39l-3-2-12-5-9-3-20-7a350 350 0 0 1-60-23c-4 0-28-20-38-33-10-11-12-12-17-3-10 21-46 44-89 56l-15 5-7 2c-3 0-5 1-5 2l-2 1-9 3-11 4c-11 4-7 91 6 139 9 32 21 57 39 81a68 68 0 0 1 8 12l12 11c32 31 67 43 102 36zm-35-53c-12-3-16-7-12-13 1-3 5-3 7-1s38 2 38-1c0-2 5 0 7 2 7 10-17 18-40 13zm-33-29c-4-4-1-10 4-10l10-3c15-7 19-8 27-4l7 4 4-3c6-4 13-4 22 1l10 4c8 0 13 4 12 9l-1 3-21-1-24 1h-8c-7-2-34-1-38 1-1 0-3 0-4-2zm43-43-8-3c-3-2-7-3-10-3-7-1-10-6-8-13 2-4 5-5 9-1 2 2 8 5 13 6l9 4 6-3 8-2 4-4c4-4 7-5 10-2 4 5 0 13-8 15l-8 3c-6 3-11 4-17 3zm18-49c-3-8-1-68 3-74 3-5 12 1 10 7l-2 35-1 34c-2 2-8 1-10-2zm-105-33c-6-4-10-9-9-14 0-6-1-7-13-1-8 4-11 5-12 4-11-6 12-23 39-28 8-2 28 6 39 14 15 11 9 21-6 11-7-4-10-4-11 0-3 14-17 21-27 14zm162-1c-5-4-7-7-7-12 0-6-7-6-15 1-8 5-15 0-10-7a66 66 0 0 1 37-19c14-5 53 13 52 24 0 6-8 5-18-1-8-6-10-6-10-2 0 15-17 24-29 16zm-211-43c-14-14 47-34 78-27 10 3 29 12 33 16 8 9 1 14-12 8-18-9-24-10-41-10-15 0-27 3-42 9-12 6-13 7-16 4zm168-1c-5-5 10-20 20-21l4-2a106 106 0 0 1 78 9c7 3 10 7 10 11-1 5-6 6-15 2-17-8-27-11-44-11-18 0-31 4-43 12-3 2-8 2-10 0zM572 625l9-2 15-5c9-2 9-3 13-14 4-9 11-20 24-37 18-23 23-41 18-71-4-31 3-62 19-80 13-14 13-16 13-26l2-17c2-13-1-13-17 1-32 27-44 63-37 105 9 51 2 69-46 113-11 9-15 17-18 27-2 10-2 10 0 8l5-2zm565-3c-1-11-5-17-27-38-40-40-47-61-37-107 9-39-6-78-42-107-13-10-13-11-12 11l1 20 9 11c22 28 29 57 23 103-2 19 6 38 31 68 8 10 10 13 13 22l3 11 8 2 18 6c14 4 13 4 12-2zm-700-18c23-22 22-41-3-57-12-8-13-7-8 5 3 11 2 31-3 51-5 19-4 19 14 1zm-101-19a449 449 0 0 1 17-13c0-3-33-23-34-21-1 4 5 32 9 37 2 2 1 2 8-3zm44-23c7-3 7-4 3-11-6-9-17-14-28-11-11 1-12 5-3 11l11 9c6 5 8 5 17 2zm-92-7c9-17 15-26 18-30 5-6 5-6-4-6-16 0-19 3-19 21l2 19 3-4zm121-5c-2-36-46-56-74-32-17 14-12 25 5 13 11-7 19-9 31-6 11 4 23 13 28 22 6 12 11 14 10 3zm948-115c12-11 3-16-28-15-28 0-35 5-24 16l4 3h44zm-4-41 24-37c19-37 15-53-22-81-18-13-22-26-12-34 10-9 13-19 7-28-12-20-41-12-41 11 0 7 2 9 13 19 7 5 1 21-11 29l-10 7c-34 22-35 51-4 96l14 20 4 8h31zM689 278l21-6c41-9 52-11 95-14 20-2 94-1 113 1a377 377 0 0 1 71 12 413 413 0 0 1 42 11l12-32a647 647 0 0 1 20-66l6-18a429 429 0 0 1 16-55c-3 0-13 11-16 19-4 8-5 9-10 8-18-3-27-1-33 6-9 10-3 27 11 31 13 4 14 7 5 19-21 28-57 26-75-4l-4-6-8 5c-21 17-45 17-66 0-21-16-26-49-7-40 15 7 30 0 34-15 4-18-13-30-34-24-9 3-12 0-9-9 7-17 3-29-14-47l-7-7-8 9c-16 16-21 29-15 40s2 19-8 14c-16-7-33 3-33 21 0 16 18 25 35 16 19-8 16 19-3 37-23 22-49 24-73 4-5-4-7-4-9 0-11 30-54 34-75 7-10-12-10-16-1-18 13-3 20-11 20-23s-15-21-30-17c-12 3-14 3-15-3s-3-9-10-17c-10-10-11-9-7 5a1496 1496 0 0 1 19 58 2676 2676 0 0 1 30 96c2 8 0 8 20 2zm22-82c9-4 15-15 17-32 1-9 3-12 8-11 4 1 7 3 11 10 15 25 42 30 62 12 7-6 6-7-5-8-17-2-32-20-32-38 0-8 0-8-7-6l-11 4-15 5-9 5-31 14-1 5c1 8-4 17-14 28-11 11 9 20 27 12zm309-1c6-4 7-6 3-9-8-6-10-8-13-13l-4-13c0-4-1-8-3-9a278 278 0 0 0-70-29l-1 8c0 19-13 34-33 37-8 1-9 2-3 8 19 19 47 13 62-13 7-13 15-11 17 3 2 26 24 41 45 30z"/><g fill="#c58c35" fill-rule="evenodd" stroke-opacity="0"><path d="M851 46c-10 11-24 23-25 40-2 8 7 15 4 22-3 4-9 0-13 0-14-5-30 6-30 21-1 10 6 21 17 22 9 2 17-2 25-4 6 0 6 7 5 11-5 19-20 34-38 40-14 4-29 2-41-6-5-2-9-7-15-8-4 3-4 9-8 13-11 16-34 19-51 11-11-5-20-14-24-25 1-5 7-5 11-7 11-4 18-17 14-28-6-12-21-15-33-11-3 0-8 2-10-1-2-6-4-12-9-16-3-3-7-8-11-10-4 0-2 5-1 7l51 163c1 5 6 3 10 2 44-14 90-22 137-23 43-2 88-1 131 5 24 3 47 10 71 16 4 1 9 3 14 3 7-15 11-31 16-47 13-40 24-82 39-122 1-2 0-5-3-4-9 6-14 16-20 25-2 4-7 1-10 1-10 0-21-1-28 7-8 7-7 20 0 27 5 6 14 6 20 11 2 5-3 10-6 14-11 15-34 22-51 14-11-5-18-15-24-24-3-4-6 1-9 2-10 9-24 15-37 13-23-1-44-20-48-43-1-4 2-10 7-8 10 4 23 6 32-2 8-9 11-23 2-32-8-9-21-9-31-6-3 1-9 1-8-3 2-9 6-18 3-27-3-13-14-23-23-33h-2zM990 738c-11 3-20 12-30 16-28 14-58 23-88 26-21 0-42 1-62-3-32-6-63-18-89-36-3 0-6-5-8-2l-1 43c10 9 23 14 35 19 28 14 59 19 89 23 21-1 41-1 62-4 27-6 55-15 79-29 6-3 14-7 14-15l1-37-2-1zM713 847l-1 13 1 60a248 248 0 0 1 76 139c3 40 1 80 2 120l1 89c3 3 9 1 14 1h38v-248c-10-45-35-86-66-120a348 348 0 0 0-65-54zM989 845c-28 21-55 43-77 71-25 31-44 67-54 106v246c3 3 9 1 14 1h38c1-61-1-122 2-183 2-49 19-98 50-136l30-33-1-71-2-1zM818 1282l-25 1c-2 8-1 17-1 25-1 58 0 116-3 174 0 24-8 47-17 70-14 31-37 56-60 80v66c-1 6 3 5 6 3 45-29 82-71 107-119 8-16 15-34 19-53v-246c-3-3-9-1-14-1h-12zM884 1281l-26 1v173c0 27-1 54 2 81 4 21 14 40 24 59 23 41 57 75 95 103 3 2 9 6 11 1 2-12 1-24 2-37v-28c-27-27-51-58-65-94-9-23-15-48-15-74-2-61-1-122-2-184-4-2-10 0-14-1h-12zM849 1731c-42 1-86 7-123 29l-14 10v43c1 4 4 2 6 1 25-19 55-29 85-36 28-6 57-8 85-3 34 5 66 18 94 36 3 1 7 6 9 1 2-14 0-28 0-43-18-15-41-23-64-29-26-6-52-9-78-9zM1005 1281v83c4 3 10 3 16 5 39 12 77 25 116 39 3-1 1-6 2-8l1-117c-4-2-10 0-14-1l-120-1h-1zM1137 1142a1051 1051 0 0 1-130 43c-2 6-1 14-2 21v62c3 3 9 1 14 1h120c2-3 0-9 1-14 0-36 1-73-1-109l-2-4zM565 1143c-3 1-1 6-2 9-2 38-1 76 1 113-1 5 5 4 8 4l124-1c2-2 1-6 1-10l1-71c-5-3-13-4-19-6-35-10-70-22-104-35l-10-3zM563 1282l1 121c-1 3 1 6 4 5 40-16 81-30 123-40 7 0 6-6 6-11v-75c-4-2-10 0-14-1H564l-1 1zM395 1013c-17 7-34 16-52 20-24 7-49 7-73 4-5 0-9-3-14-2-5 7-3 16-2 24 3 12 6 25 15 34 6 5 15 5 23 6 41 5 84-5 118-28 3-2 5-7 3-11l-17-46-1-1zM199 681c-4 1-1 6-1 9 4 19 13 36 28 48 13 11 29 16 45 19 4 0 11 1 11-4-1-16-8-30-18-43a77 77 0 0 0-52-27l-13-2zM1312 1251c-7 3-7 13-5 18 16 0 33 1 48-1 4-12-6-14-16-14l-27-3zM1321 455c-2 114-5 227-15 340-4 66-12 133-16 200-2 22 5 44 15 64 4 7 4 22 16 18 10-1 21 2 31-2 8-17 14-34 19-52 3-59-6-118-10-178a4202 4202 0 0 1-17-390h-23zM1328 419c-9 1-21-2-27 6-3 7 4 12 7 16h45c4-4 14-12 8-18-9-6-23-3-33-4zM1330 202c-19-1-30 28-14 38 6 4 10 12 6 19-8 16-28 20-38 34-16 18-11 44 0 63 9 17 20 33 31 49h31c17-24 37-48 42-77 3-16-6-31-18-41-10-11-25-18-30-32-3-10 9-14 11-22 10-14-6-33-21-31zM1440 1770c-7 1-3 11-2 16 6 18 18 36 36 44 14 6 29 14 45 12 7-3 1-13 0-18-8-30-38-50-68-53l-11-2zM1391 1426c-36 1-71 13-100 33-8 4 0 14 1 20 5 11 7 25 15 35 4 2 9-4 13-4 32-17 68-26 104-22 8 0 17 3 24 2l-3-56c-17-7-36-9-54-9zM366 1282c-8 1-18-1-25 3-2 5-1 13 6 12 14 3 29 7 43 5 0-6 4-14 0-19l-24-1zM376 1477c-11 1-24-1-34 4-8 10-11 24-17 35-10 24-5 51-4 76 6 103 17 206 21 309 3 67 2 134 4 201 6 1 21 6 20-4 4-87 5-174 12-261 6-94 16-188 24-282 0-22-10-44-16-65-3-4-3-15-10-13zM339 2153c-18 25-40 51-40 83-1 21 17 36 33 47 9 6 19 17 14 29-6 8-16 16-12 28 2 14 20 25 33 15 9-7 13-22 9-33-6-4-13-9-14-16 2-16 19-23 29-32 14-10 26-25 23-43-6-26-21-49-36-71-9-12-26-6-38-7zM360 2116c-10 1-22-1-32 5-7 5-1 17 8 17 16 1 32 0 47-2 8-5 3-18-6-19l-17-1zM669 2253c-6 1-6 8-8 12-13 45-28 89-42 134-1 6-5 14-2 21 2 2 5-2 6-3 5-6 8-14 12-20 3-2 7 1 10 1 10 3 24 0 30-10 5-8 3-20-6-25-5-4-13-4-17-10 0-7 5-12 8-17a42 42 0 0 1 71 12c1 2 3 7 6 6 8-5 14-12 22-16 13-6 28-7 41-2 16 6 28 21 32 37 1 3 1 9-3 11-6 1-11-5-17-4-10 0-20 6-25 15-5 11 2 23 12 28 7 4 15 3 22 0 3-1 9-1 10 3 0 6-5 12-4 18 0 13 9 25 17 35 3 3 5 7 9 9l6-7c8-10 17-21 19-33 0-6 0-12-3-17-2-3-2-8 2-9 7-1 13 6 19 4 11 0 21-8 23-19 2-9-3-18-10-22-9-5-21-6-30-2-4 1-8-1-7-6 1-12 8-23 17-31 15-14 38-17 56-8 8 3 14 10 21 16 4 1 5-4 7-6 7-14 21-27 38-27 16 0 33 10 40 24 1 4 2 9-1 12-4 3-10 1-14 4-8 6-12 17-8 26 7 8 17 11 27 12 4 0 7-1 10-4 5 2 6 8 9 12s5 10 11 12c4 0 3-6 2-8-3-16-9-31-13-46l-32-103c-1-3-1-7-4-9-6 0-13 3-19 4a692 692 0 0 1-237 16c-38-5-75-11-112-20h-1z" style="paint-order:markers fill stroke"/></g><g fill="#6b4424" fill-rule="evenodd" stroke-opacity="0"><path d="M879 270c-4-1-6 3-3 5 17 19 40 31 64 40 32 10 67 17 94 39 30 22 54 56 56 95 2 22-6 44-6 67 1 17 12 32 24 44 13 15 29 28 39 45 5 9 3 20 9 29 11 6 23 10 35 14 4-3 2-10 3-15-1-14-3-30-15-41-20-21-48-35-65-60-14-23-11-50-12-75-1-13 1-27-1-40-12-42-32-84-64-114-11-9-26-10-38-15-39-9-79-15-119-18h-1z" style="paint-order:markers fill stroke"/><path d="M1020 362c-4 2-2 9-2 13 0 9-1 18 2 27 16 19 29 41 32 67 3 20-2 40-1 60 5 25 23 44 38 64l10 24c13 3 25 9 38 11 4-4 0-11-1-15-9-16-23-27-35-40-16-18-32-40-30-65-1-20 7-39 5-59-1-33-22-62-47-82-3-2-6-5-9-5z" style="paint-order:markers fill stroke"/><path d="M1020 426c-4 3-3 10-4 14a306 306 0 0 1-53 140c1 28-3 59 13 83 4 5 8 11 13 15 2-7 0-16 1-23 1-16 0-33 3-49 4-4 11-1 17-2 5-1 12 2 17-1 0-5-5-10-7-16-7-13-14-30-7-45 2-6 11-4 10 2 2 11 0 22 6 31 7 10 9 21 15 31 7 5 16 3 24 5 5 1 13-1 11-7-9-19-27-31-35-51-6-13-8-28-7-43 0-19 3-40-2-59-3-9-7-19-14-25h-1zM820 271c-44 3-87 9-129 21-15 3-27 13-37 25-22 26-43 56-47 92-6 33-2 67-9 101-4 18-17 34-31 46-19 17-42 30-53 53-6 12-8 25-4 38 3 3 7-3 11-3 10-4 21-6 30-11 0-14 3-28 12-39 16-20 38-34 50-56 10-19 7-40 3-60-3-23-2-48 7-70 15-30 41-55 71-69 33-16 71-20 103-39 11-8 24-15 32-26 1-5-7-3-9-3z" style="paint-order:markers fill stroke"/><path d="M683 362c-10 4-18 13-26 20-17 19-29 45-29 71-1 28 11 56 0 83-11 29-39 46-57 70-3 7-7 15-7 22 3 3 6-3 10-2 10-3 21-6 31-11 6-10 10-21 17-30 13-20 32-40 32-66-1-22-4-45 0-66 4-18 14-33 25-46 8-9 5-21 7-31-1-4 3-13-3-14z" style="paint-order:markers fill stroke"/><path d="M683 427c-6 4-9 12-12 18-9 19-7 41-4 62 1 19 0 38-12 54-10 15-23 29-31 46-2 3 0 8 4 6 10-2 21-2 31-5 3-8 4-16 8-23 8-10 13-22 13-35 1-5 0-13 7-12 7 0 6 9 7 13 0 16-6 32-17 44-3 3-1 8 3 8 10 3 20 0 30 2 4 5 2 13 3 19v54c6-4 10-10 14-15 10-13 13-29 13-45l1-38c-25-35-43-75-49-117l-7-35-2-1zM714 1879c-2 10-1 21-1 31-1 13 0 26-3 38-5 5-13 0-19 1-5 1-11-1-14 2 1 7 7 12 10 19 5 12 9 27 5 40-2 5-10 4-10-1-2-11-3-23-8-32-6-10-12-21-19-30l-30-6c-4 6 3 12 6 16 13 16 28 33 32 53 4 19 2 39 2 58 1 15-1 32 7 46 4 4 7 11 12 13 5-2 3-9 4-13 5-42 16-84 40-120 5-10 14-19 13-31-1-22 0-44-8-64-4-8-11-15-18-20z" style="paint-order:markers fill stroke"/><path d="M567 1927c-4 2 0 8 1 12 9 17 25 28 38 43 18 19 32 46 26 73-5 19-8 39-3 58 6 29 23 55 46 75 2 2 7 9 10 3 3-13 0-28 0-42-12-11-24-22-29-37-6-17-3-35-4-52-1-18 1-36-4-53-10-24-35-40-41-66-1-8-11-6-17-9l-23-5z" style="paint-order:markers fill stroke"/><path d="M514 1908c-6 2-4 10-4 14 1 15 7 29 18 38 17 18 41 30 57 50s18 46 17 70a187 187 0 0 0 55 150c11 11 28 11 42 16 18 3 36 9 55 9 12 2 3-5-3-7-41-21-86-41-114-79-18-23-25-53-23-82-1-24 8-50-1-73-12-30-48-41-59-72-3-7-1-15-6-22-10-5-21-9-32-12h-2zM1137 1926c-13 3-26 5-38 12-4 3-3 8-6 12-7 18-23 31-33 47-11 23-9 49-6 72 3 29-10 59-33 76-5 9-3 20-4 30 0 6-3 14 2 20 6-2 9-8 13-11 20-19 38-42 43-70 5-16 2-33-1-50v-47c8-17 18-34 34-46 11-12 26-23 31-39 0-2 2-6-2-6z" style="paint-order:markers fill stroke"/><path d="M988 1878c-8 5-12 14-17 21-11 19-8 42-10 64-1 6 1 12 6 17 29 41 45 90 49 140-1 4 4 7 7 3 12-10 17-27 16-43 0-24-4-49 1-72s26-37 37-57c2-3 4-10-1-10-12 0-24 6-33 12-9 15-19 30-21 48-1 4-1 13-7 13-6-5-5-15-5-22 1-15 10-28 17-40-2-4-8-1-12-2-7-1-15 1-22-2-4-10-2-22-3-32 0-13 1-26-1-38h-1z" style="paint-order:markers fill stroke"/><path d="M1191 1907c-12 3-24 7-35 14-4 8-3 19-9 27-12 20-32 33-48 50-15 17-13 41-10 62 4 30 4 63-11 90-18 33-47 57-79 75-16 9-34 15-49 27-2 4 5 3 8 3 27-4 54-11 80-17 27-25 48-56 57-92 10-33 5-67 8-100 2-18 12-35 26-47 18-17 42-29 56-49 7-13 9-27 9-41l-3-2z" style="paint-order:markers fill stroke"/></g><g fill="#cf2b2a" fill-rule="evenodd" stroke-opacity="0"><path d="M988 800a284 284 0 0 1-136 36c-44 1-88-10-128-31l-10-4c-2 4 0 11-1 16-1 6-2 13 6 15 44 28 80 68 107 112 10 15 17 31 24 47 3 2 4-4 5-6 14-32 32-63 56-89 22-25 47-46 74-65 9-6 6-17 6-26 0-2 0-5-3-5zM715 942c-3 2-1 7-2 10v285c0 11-1 22 1 32h63c3-5 1-12 1-17 0-59 1-118-1-178a213 213 0 0 0-62-132zM988 941c-7 5-10 13-16 19-21 28-38 60-43 94-7 32-4 65-5 97v117c5 2 11 0 17 1 16 0 32 2 48-1 3-2 1-8 2-11V973l-1-31-2-1zM958 1282l-31 1c-3 5-1 13-2 19v167c4 50 24 101 60 137 2 3 6 0 5-3 2-56 1-112 1-168v-152c-5-2-12 0-17-1h-16zM713 1283v288l1 35c4 2 7-3 10-5 26-29 42-65 51-103 4-28 2-57 3-86v-129c-5-2-12 0-18-1h-47zM851 1563c-5 2-5 9-8 13-17 40-45 75-77 104-16 15-32 27-49 40-7 5-5 15-6 23-1 4 2 7 6 6 17-7 33-15 51-20 68-21 143-16 208 15 4 1 9 5 14 5 2-6 0-12 1-18 0-11-11-15-18-21-50-35-91-83-116-139-2-2-3-8-6-8zM1308 1282c-28 1-56 0-84 2-1 6 4 13 5 19 18 47 34 95 51 143 9 0 16-7 24-10 37-19 80-30 122-21 4 0 12 4 15-1l-9-129c-3-4-11-1-15-2l-109-1zM416 1083c-10 5-19 11-29 15-30 13-62 17-94 14-9 0-19-4-28-3-6 3-3 11-4 16l8 123c1 6 0 13 2 19 9 3 19 1 28 2 58 0 117 1 175-1 3 0 7 0 5-4l-56-171c-2-3-3-9-7-10zM400 572c-14 2-27 6-39 13-7 5-17 9-21 17 0 6 6 10 10 14 10 11 21 23 21 38 0 3 1 9 5 7 13-11 22-26 29-42 4-12 9-26 5-39-1-5-6-8-10-8zM304 561c-4 4-6 10-9 15-6 19-11 40-4 60 6 18 19 36 38 42 11 3 26-2 29-14 2-16-9-29-18-39-11-12-22-24-27-40-4-7-5-16-8-24h-1zM320 550c-4 2-1 8-1 11 2 10 3 20 9 28 3 3 7-3 10-4 5-4 12-7 16-13-1-5-8-7-11-10-7-4-15-10-23-12zM359 538c-5 1-13 1-14 6 2 7 9 10 14 14 5 5 12 9 19 6 4-1 11-4 8-9-4-11-16-18-27-17z" style="paint-order:markers fill stroke"/><path d="M363 506c-16 0-32 10-39 24-1 4 1 8 5 7 9-1 15-9 23-10 19-6 39 7 48 24 2 3 6 9 9 6 4-21-11-41-30-48-5-2-10-3-16-3zM302 518c-7 0-17 0-19 9v31c1 3 4 3 5 0 7-13 14-26 22-37 2-5-6-3-8-3zM270 577c-6 1-14 1-18 6-2 6 4 12 6 19 6 15 10 32 20 45 2 2 4-2 2-3-6-15-3-31-5-46 0-7 1-14-1-21h-4zM425 541c-5 1-2 7-1 10 5 19 1 39-3 58-1 3-2 10 2 8 12-8 23-19 29-32 5-10 2-22-6-30-6-6-13-12-21-14zM435 627c-8 3-15 9-22 14-14 11-24 27-37 39-3 2-1 4 2 3 22-4 40-19 53-37 4-5 9-13 5-19h-1zM1389 1853c-10 0-21 4-25 14-3 11 4 24 12 31 14 16 32 30 40 49 4 8 3 17 5 25 3 1 5-3 6-5 7-13 8-29 8-44 0-17-1-36-12-49-7-9-17-20-29-21h-6zM1347 1874c-5 3-8 9-12 13-13 21-18 46-22 70 0 3 0 10 5 9 12-1 23-7 35-7 14-3 28-15 27-31 0-9-10-15-15-21-7-7-12-15-14-25-1-2-1-7-4-8zM1396 1945c-7 1-11 9-18 11-4 2-1 7 1 9 7 6 15 11 24 13 4 0 4-6 3-9 0-7 0-16-5-22l-5-2zM1359 1968c-6 1-12 3-17 7-3 3 2 7 4 10 6 7 14 12 23 11 5-1 11-3 15-7 1-4-4-6-6-8-6-4-10-9-16-12l-3-1z" style="paint-order:markers fill stroke"/><path d="M1320 1978c-3 1-2 6-2 9 2 13 11 24 21 32 12 10 29 12 42 6 10-5 19-12 24-21 3-3 1-10-4-9-9 3-16 11-26 13-12 4-26-1-36-11l-17-18-2-1zM1303 1920c-6 2-10 8-14 12-9 10-18 21-16 35 3 12 14 21 25 27 2 2 7 3 7 0-2-10-4-20-4-30 0-14 1-27 4-40 0-2 0-4-2-4zM1347 1852c-15 3-27 12-38 21-9 8-18 16-21 28-1 3 0 8 4 7 9-5 18-10 25-18 8-12 15-25 28-33 1-1 6-4 2-5zM1446 1884c-3 1-1 5 0 7 4 15 3 31 2 47 0 4-2 9 1 12 5 3 11 1 17 0 4-2 11-3 10-9-2-8-8-14-11-22-6-11-10-23-18-34l-1-1zM1443 1971c-4 2-5 7-7 10-5 9-12 17-15 27-1 5 4 6 7 6 6-2 12-1 16-5 5-9 3-20 3-29-1-3-1-8-4-9zM933 121c-4 9-2 20-8 28-6 12-19 16-31 18-7 3 2 10 5 12 15 13 39 9 51-5 7-6 10-15 18-19 8 6 5 19 10 27 7 15 28 24 42 13 5-1 9-6 4-10-9-7-16-15-17-27-3-13-18-15-28-21-15-6-30-13-46-16zM769 121c-24 7-47 17-70 29-5 4-1 13-6 18-3 8-13 14-13 23 5 13 23 10 32 5 15-8 15-27 20-41 8-4 13 8 17 13 10 14 27 23 44 17 8-3 18-7 21-15-4-7-14-3-20-8-15-7-21-24-21-39-1-2-2-3-4-2zM692 2334c-9 0-18 6-23 12 9 8 20 16 21 29 5 11 19 12 29 18 16 7 33 15 51 17 6-4 3-13 6-19 5-14 21-22 35-24 6-2 1-8-2-10a38 38 0 0 0-50-4c-11 6-15 20-26 25-7 1-7-9-10-14-5-14-14-30-31-30zM1013 2334c-19 1-35 18-34 37-1 6-8 10-13 4-11-13-24-31-44-30-12 1-24 7-31 17 1 6 9 5 13 7 16 5 28 20 29 36 1 9 12 2 17 1 22-7 44-14 64-27 2-8 2-16 9-22 3-4 14-10 8-17-5-4-12-6-18-6z" style="paint-order:markers fill stroke"/></g><g fill="#a32623" fill-rule="evenodd" stroke-opacity="0"><path d="M435 1077c-4 2 1 9 1 12 19 60 40 119 58 179 13 2 27 1 40 1 7 0 17 3 15-8 1-40 0-80-1-120-1-8-11-9-16-13-31-16-63-32-93-50l-4-1zM440 1283c-11 0-23-1-34 1-3 6-2 15-2 22 8 5 20 10 20 22 2 8-3 19 5 24 5 6 14 5 20 10 10 6 16 17 18 28 4 20 4 40 7 60 4 1 8-4 13-5 20-10 39-20 60-29 3-6 0-14 2-20 0-37 1-74-1-111-5-2-12-1-18-2h-90zM249 1283c-17 0-33-1-50 1-1 6 3 13 5 20 27 88 56 176 85 263 2 4 3 11 7 13 5-2 11-5 9-11 0-20 0-41 9-59 3-9 9-18 9-28-3-6-11-4-17-6-15-5-23-21-25-36-4-15-11-30-7-46 3-19 0-38 9-56 2-8 2-17 8-24 8-10 20-14 32-18 5-3 4-13-3-13h-71zM245 1129c-5 4-5 13-8 19-13 38-27 77-38 116-1 6 8 4 11 5h46c2-7-1-16-1-24-3-38-4-76-8-114 0-1 0-2-2-2zM403 1476c-4-1-8 2-6 6 2 6 3 13 9 16 5-5 13-10 16-17-3-5-11-4-17-5h-2zM1485 1282l-39 2c-3 9 1 20 1 30l9 111c1 4 5 2 5-1 16-46 29-93 45-139-1-4-7-2-10-3h-11zM1406 972c-7 3-13 10-18 15-1 20-2 40-10 58-3 10-8 20-10 30 7 1 15 0 21 3 14 4 25 15 27 29 1 13 9 24 8 37 0 22 1 45-7 66-4 15-7 31-20 40-8 5-17 7-26 8-2 4-4 14 5 11l127-1c2-5-2-10-2-15l-78-239c-5-14-9-29-16-42h-1zM1222 1104c-22 8-42 20-63 29-6 2-6 8-6 13 0 39 0 78 2 117-1 4 3 6 6 5h128c2-5 4-12 4-19-2-6-11-4-14-10-8-7-8-20-4-29-5-7-13-15-23-16-12-3-18-17-20-28a481 481 0 0 1-10-62zM1289 1064c-5 2-11 5-13 10 2 4 9 4 14 5 2 1 9 1 6-3-2-4-3-10-7-12zM1155 1283c-2 21-1 43-1 64v67l50 25c22 11 44 24 65 37 5 3 7-4 5-7l-44-123c-7-20-13-41-22-60-7-5-17-3-25-4-9 1-19-1-28 1z" style="paint-order:markers fill stroke"/></g></svg>
                        </g>
                    `,
                    black: `
                        <g>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1696" height="2528"><path d="M846 2503c-4-4-22-26-26-33-4-5-7-17-7-23 0-7 0-7-5-7-6 0-12-2-21-8a541 541 0 0 1-101-36c-7 10-17 15-31 17l-9 1-9 8c-10 9-15 14-29 24-10 7-10 7-14 5-7-3-6-5 13-63a1790 1790 0 0 0 24-76 1170 1170 0 0 0 19-68c-3 0-30-35-38-49-20-35-30-87-25-123 5-30-8-53-42-78-43-32-54-52-49-94l-13-9a472 472 0 0 1-90-59 68406 68406 0 0 1-8 137l-2 54c-2 44-2 81 0 81 18 0 26 28 11 42-5 6-5 5 4 19 40 61 40 98-1 124-22 14-23 14-13 24 25 26-9 71-43 56-23-10-31-40-14-56 8-9 7-10-9-22-45-34-47-64-8-121l14-19-7-6c-12-13-9-31 7-39l8-4-1-59a1910 1910 0 0 0-4-165 638 638 0 0 1-3-67l-2-31-1-17-6-6c-28-27-75-105-70-115a227 227 0 0 1 26-32l8-9 3-3-3-10a1590 1590 0 0 0-28-87 1670 1670 0 0 0-39-122l-14-42c-20-63-20-62-13-82a401 401 0 0 0 12-35l7-24 31-89c9-27 10-30 7-68-2-21-2-22 4-22l7 1c14 8-9-23-32-41l-10-8-6 7-7 9-8 9c-14 18-20 22-25 17-4-4 2-15 24-38l10-14-10-13-11-14-2-5c-5-6-1-30 7-37 3-3 3-4 2-7-5-14 2-26 18-34l-1-5c-3-9 3-22 13-28 3-2 3-3 3-10 0-11 9-24 18-24l6-2 7-3 2-1 6-2c10-1 12-6 3-6l-5-1-4-1-8-3-6-2c-19-1-47-39-52-70-4-24-1-29 20-24l15 3c28 6 54 23 63 41a115 115 0 0 1 13 43c0 15 6-1 17-44 5-19 6-18-10-26-28-13-43-33-56-72l-5-13c-12-16-2-32 22-35 6-1 7-3 5-18-3-35 9-47 45-42 12 1 12 1 15-1 26-20 62-13 81 13 3 4 6 7 8 7l15 5 8 6c30 19 35 54 11 76l-5 5 2 9c5 19-7 40-33 56l-8 6c-12 9-46 15-65 11-11-2-11-2-12 5l-3 11a539 539 0 0 0-14 50c-3 5-2 7 2 5s14 0 16 3c1 2 5 3 5 1a411 411 0 0 1 83-73l4-4 4-2 4-3 5-3 6-4 6-4 9-4a449 449 0 0 1 36-21v-20l1-20 6-11c7-15 19-29 32-39l7-5 9-6c19-14 34-35 38-55l1-31a211 211 0 0 1 27-121c0-3 25-36 35-47 7-7 10-13 7-13l-2-2a491 491 0 0 0-17-58 1742 1742 0 0 0-17-51l-20-64c-8-22-4-33 8-24l4 3h2l7 6c9 6 17 13 22 20 4 5 4 5 11 4 11-2 22 3 32 13l5 4 7-3a418 418 0 0 1 88-34c9-4 16-7 21-7 4 0 5-2 5-9 0-14 7-25 28-48l3-4c3-5 10-5 14-1l13 13c16 18 19 23 20 39 1 8 1 9 4 10 10 2 24 8 25 10l5 1c10 0 31 8 70 25 17 7 17 7 20 4 6-7 20-13 32-13 7 0 7-1 11-5 13-16 47-37 48-30v15l-7 23a406 406 0 0 1-18 54 1553 1553 0 0 1-33 106c-4 6-4 6 5 16 47 53 62 92 63 160 0 57 7 71 47 100a204 204 0 0 1 17 13c7 4 18 21 24 34 5 10 5 12 5 29 0 18 1 21 4 22l4 2 11 6a295 295 0 0 1 36 22l12 7c19 13 20 14 22 14l2-32 3-56c2-47 3-167 1-167-16 0-23-28-10-42l5-5-4-5c-48-68-48-102 0-136 15-10 15-11 8-18-34-33 19-80 54-48 13 12 14 38 2 50-6 5-5 8 4 14 52 35 53 67 6 135l-6 9 3 2c2 0 3 2 4 3l3 5c8 9 1 29-11 34l-4 2v51a3347 3347 0 0 0 8 246l1 19 5 6 14 16 13 16 9 12 11 15 6 9 20 34c16 27 16 25-2 48a6539 6539 0 0 0-19 25c-3 3-3 4-2 8a435 435 0 0 0 24 78 13721 13721 0 0 1 70 216c7 16 8 24 3 39a1067 1067 0 0 0-15 50 591 591 0 0 1-18 53 468 468 0 0 1-17 53l-6 19-1 23c0 22-2 24-15 19-4-1-1 3 9 14 12 11 35 31 38 31l19-22c18-24 21-27 26-23 7 6 5 10-26 48l-7 8 9 10c19 21 22 38 10 55-3 4-3 4-1 9 3 10-1 24-9 31-4 4-4 4-5 13 0 10-3 16-12 21-3 2-4 4-4 6 2 7 1 16-1 18l-2 3c0 3-27 19-41 24-5 2-4 2 6 4 39 5 66 27 78 64 8 28 7 33-7 33-55 0-92-24-103-67a1814 1814 0 0 0-5-22l-7 28c-8 39-8 46-4 46 21 0 56 35 66 66l10 18c12 22 6 36-20 40h-5l1 21c1 36-3 41-37 41l-18 1-6 4c-25 18-52 16-76-8-7-7-10-9-14-10-8-1-25-10-33-17-23-20-22-48 1-73l3-3-3-5c-11-17 0-38 33-61 20-15 32-19 62-18h17l1-5a2914 2914 0 0 0 9-72c-5 3-6 4-11 3-6-1-6 0-10 5a733 733 0 0 1-73 70l-21 15c-21 15-38 26-64 39-11 6-12 6-11 10 2 41-10 66-46 90-41 27-48 40-46 90 2 66-19 119-64 163v7l5 17a2417 2417 0 0 0 37 118l9 28c9 29 9 31 5 34-4 4-7 4-11 1l-7-6-29-25c-4-4-5-5-13-5-11-1-20-5-28-13l-5-5-7 3-9 4a502 502 0 0 1-76 29l-8 4-14 5-10 2-1 8c-1 12-3 17-20 37-15 20-19 23-25 16zm15-26c15-18 19-33 13-44-5-10 2-16 12-10 18 10 40-11 30-29-5-9-21-15-32-12-14 5-17-1-10-18 16-35 59-44 87-17 8 8 7 8 11 0 12-23 36-33 58-23s32 36 14 36c-13 0-22 18-13 28 6 7 28 13 31 8 2-4 7-2 9 4 9 20 20 25 14 6a4742 4742 0 0 1-45-146c-2-8 0-8-19-2l-64 12a753 753 0 0 1-275-13c-18-5-16-7-22 16a3083 3083 0 0 1-39 124c-9 28-3 31 10 5 4-7 4-8 12-5 13 4 29-2 32-12 4-11-1-21-13-25s-14-8-7-19c19-29 60-26 76 5 4 9 5 9 12 2 30-28 73-19 89 19 5 14-1 23-12 16-10-6-31 4-33 16-3 16 16 31 30 24 12-5 18 0 13 12-3 6-2 18 3 27 4 7 19 26 20 25l8-10zm-89-76c2-17 15-32 34-34 9-2 9-3 2-9-20-19-45-15-62 9-12 18-18 18-23 0-9-31-30-41-49-24l-4 3 3 2c13 11 18 17 18 25 0 5 1 6 13 12 23 11 44 19 59 23 9 2 9 2 9-7zm173 6a613 613 0 0 0 59-23l9-5 1-6c1-9 3-13 12-21s9-8-1-14c-18-10-45 7-45 29 0 15-11 17-19 4-19-28-43-33-64-14-7 7-7 7 3 9 21 5 33 19 33 37 0 4 1 6 2 6l10-2zm-577-53c9-8 13-33 4-33l-6-5c-11-9-4-24 18-38 38-24 38-48 3-102-16-25-14-23-32-23l-15 1-3 4c-48 59-50 94-6 123 20 13 24 27 10 39-19 17 6 50 27 34zm515-91c31-2 30-2 37-9 6-7 20-16 49-30 33-16 31-13 32-31 4-62-1-107-19-155-30-81-110-128-170-101s-102 96-110 182l-1 68v20l10 6 33 16c25 13 32 17 40 26l5 6h12l26 2c24 2 29 2 56 0zm-140-56c-11-3-15-5-24-11l-6-4v-8c2-2 2-2 14 3 32 15 69 13 93-5 10-7 14 4 5 12-15 14-56 20-82 13zm167 0c-23-6-38-18-31-26l2-2 9 5c31 17 58 18 91 1 10-4 16-1 11 6-11 15-53 24-82 16zm-82-30-1-18-2-31c-8-62-8-60 8-67 16-8 21-8 36 0l6 2 9 7c0 6-10 8-16 4-13-7-25-7-33 2-2 2-2 19 1 44 5 37 0 71-8 57zm-74-3c-18-5-36-18-33-23 2-4 8-3 20 4l9 4v-7c-1-3 3-9 10-14 11-8 26 0 26 14l1 6 16-8c14-7 20-1 9 9a69 69 0 0 1-58 15zm167 0c-19-5-36-18-31-24 3-3 9-1 20 7 6 3 7 2 6-5-1-11 14-21 26-15 8 3 10 7 10 18 1 4 2 4 13-1 15-7 15-7 17-4 4 4-8 17-15 17l-6 2c-9 5-30 8-40 5zm-88-143c-25-7-35-13-32-18s19-4 32 1c5 2 6 2 10 0 6-2 14-2 17 0 4 2 7 2 11 0l12-3 11-2c9-2 12 9 4 12-19 9-34 12-41 9-5-1-6-2-11 0-6 2-7 2-13 1zm-7-36c-3-3 4-10 14-12 16-5 44 3 39 11-1 1-51 3-53 1zm-67 259-29-15c-98-48-128-94-115-181 5-36-2-55-28-75-27-22-37-37-37-57 0-5 1-5-28-15-11-4-11-4-11 10 1 25 9 35 57 70 30 22 40 52 35 109-1 11 3 39 10 60 8 26 41 71 54 76a599 599 0 0 0 92 18zm225-5 34-8 20-5 10-9c37-38 54-86 53-145-2-53 6-71 48-101 28-21 34-27 40-41 3-8 5-33 3-33l-34 13c-3 2-3 3-4 11-2 17-17 37-45 58-20 16-25 37-18 78 9 55-11 101-60 138-20 16-24 18-52 31-39 19-38 22 5 13zm49-67c13-12 20-21 27-33a107 107 0 0 0 15-73c-5-21-6-52-1-62 8-19 18-32 34-46 21-17 28-26 30-38 1-4 0-4-12 0l-14 4c-12 3-13 3-14 9-2 9-14 27-28 41-15 16-21 46-15 79 5 31-9 67-34 83-2 1-4 35-3 47 1 2 3 0 15-11zm-348-9c-1-25 0-24-8-30a74 74 0 0 1-27-63c2-70 1-73-25-105-13-15-15-19-18-29l-2-8-16-5-20-5c-9-3 3 21 16 32 41 34 57 70 46 103-12 37 3 84 37 117 18 17 17 17 17-7zm-305-37c10-3 7-16-4-18-13-2-45 0-47 3-5 5-3 13 4 15h47zm307-22c6-52 17-88 40-122 14-21 13-16 12-46-1-36-5-49-18-61l-7-6v34c-1 41-1 39-15 38-25-2-25-2-17 8 15 20 18 56 5 56-5 0-7-3-8-15 0-12-3-19-13-35l-8-13-4-5a1384 1384 0 0 0-27-5c-6-1 0 10 11 23 27 29 33 50 28 101-2 26 2 42 14 56 5 7 5 7 7-8zm338 6c12-13 15-28 12-58-4-53 0-67 29-98 6-6 14-19 13-21-3-5-36 7-36 13l-4 7c-9 13-14 26-15 37s-3 15-8 15c-9 0-10-30-2-43l2-4 5-9 5-8h-16c-23 0-21 4-21-38v-34c-2 0-10 8-14 15-10 16-11 23-12 52l-1 26 9 13c10 13 17 25 25 45a2322 2322 0 0 0 10 27l4 18c3 9 6 29 6 35 0 15 2 18 9 10zm-659-56a6648 6648 0 0 1 18-318 898 898 0 0 0 7-86l9-99c2-15 0-27-10-55l-8-23c-1-6-2-6-9-5l-18 1c-14 0-13-1-20 17-3 8-6 16-8 18-7 14-8 32-6 69l3 38c3 52 3 51 9 112a2387 2387 0 0 1 11 200l2 55 1 59v54h18zm1017-41c10-5 23-18 23-23-1-6-4-6-12 0-25 19-47 13-70-18-6-8-7 3-2 15 14 27 38 37 61 26zm57-13c6-1 8-15 5-32-1-8-2-8-6-1-1 4-6 12-11 19-11 16-8 19 12 14zm-136-16-2-8c-3-13-3-43 1-59 3-9 1-9-9 1-27 26-27 45 0 63 5 3 10 5 10 3zm74-2c7-3 7-5-1-11l-11-8c-5-5-6-5-15-1-10 3-11 4-6 10 9 12 21 16 33 10zm27-24c-2-22-6-27-17-18l-8 7c-8 0-1 9 11 15 14 7 15 6 14-4zm21-1c11-17 11-71 1-87-13-19-24-26-38-26-29 0-33 26-8 48 29 26 39 43 40 63 1 8 1 8 5 2zm-93-5 14-4c25 0 42-27 26-42-15-13-21-22-23-33-2-9-2-9-7-4-12 12-21 35-27 66-4 23-3 23 17 17zm-571-10 11-9c50-42 117-39 167 8l6 6 1-17c2-39 11-59 37-78l7-5v-12c-1-11-1-11-5-14l-15-10c-72-48-175-46-246 4l-12 9v12l-1 11 5 4c28 20 37 38 38 76l2 19 5-4zm707-5c8-3 8-6 2-15l-9-16-15-30c-2-2-2-2 0 6 4 14 5 33 1 55 0 4 11 4 21 0zm-442-13a878 878 0 0 0 75-14 562 562 0 0 0 110-42c58-30 144-100 161-131 2-4-7-19-33-54-27-36-38-74-30-109 3-12 4-28 3-40-1-10-1-10-9-7-3 1-8-7-12-18-5-14-2-11-34-32a882 882 0 0 0-248-106h-5v277l1 278h3l18-2zm13-47c-5-7-4-27 3-37 15-22 28-19 26 6-2 19-21 40-29 31zm111-23c-12-7 3-40 22-50l7-3 2 3c11 16-16 60-31 50zm-62-93c-8-12 2-39 18-49l7-4 2 4c7 9 3 31-8 42-7 7-17 11-19 7zm147-2c-9-15 18-52 35-48 7 2 2 35-6 33l-1 1c2 3-10 12-19 13l-6 1h-3zm-189-61c-7-16-2-36 11-47 9-8 15-3 16 13 2 23-20 51-27 34zm155-39c-6-17 13-50 29-50 12 0 7 30-7 44-7 7-20 10-22 6zm-105-71c-5-14-1-28 10-39 11-12 16-11 19 4 6 24-23 58-29 35zm87-49c-8-16 0-40 17-50l4-3 3 3c10 12 4 41-11 50-9 5-10 5-13 0zm-134-59c-12-21 7-65 20-47 10 14 3 44-11 51-5 2-5 2-9-4zm-353 168-1-278a909 909 0 0 0-276 125c-11 8-11 9-10 14 5 11 6 29 4 54a2788 2788 0 0 0-11 129 851 851 0 0 1-6 67 1031 1031 0 0 1-2 43 487 487 0 0 0 297 123l5 1zm-41 231c-16-6-26-35-19-51 3-6 2-6 11-1 16 11 23 32 16 48-3 5-4 5-8 4zm-113-26c-15-7-28-30-24-45 2-6 4-7 11-4 25 12 38 60 13 49zm62-92c-19-8-32-52-15-52 16 0 30 29 25 49-2 6-3 7-10 3zm-146-2c-14-4-25-15-29-29-6-22 4-25 24-9 11 8 17 25 14 36-1 3-1 3-9 2zm185-58c-16-11-20-37-9-52 7-10 25 17 24 37-1 15-7 20-15 15zm-156-43c-13-6-22-21-22-36 0-14 5-16 16-9 24 17 29 57 6 45zm105-66c-11-7-16-15-16-31 0-22 5-26 18-14 19 18 18 58-2 45zm-85-52c-15-10-21-29-15-45 6-18 30 8 29 31-2 17-5 20-14 14zm137-56c-14-5-22-34-15-47 6-11 10-12 17-4 14 17 13 57-2 51zm656 407c12-8 14-9 20-20 7-11 17-22 23-25 7-4 2-3-7 0-23 10-48 34-48 46 0 7 1 7 12-1zm220-63c1-2-5-23-10-30-9-17-33-33-55-35l-15-2c-10-2 2 31 17 46 14 15 60 30 63 21zm-804-25c30-26 104-46 151-42 42 4 81 17 112 37 11 8 11 9 10-17v-21l-4-3c-63-46-206-46-269 0l-5 3v22c0 23 1 25 5 21zm11-70a294 294 0 0 1 259 5c3 1 3 1 3-13l-1-12-10-7c-52-36-96-86-120-138-9-19-8-18-14-4-16 41-49 83-90 118-17 14-27 22-33 25-8 6-8 5-9 18-1 16-2 16 15 8zm668-3c8-15-1-47-20-74-5-8-6-14-1-20 20-27 21-52 4-79-7-11-2-22 7-14 22 20 26 54 10 87-7 13-7 12 1 16l7 3 1-10c0-10 5-17 12-18 3-1 3-2 3-8 0-12 6-20 17-23 1 0 2-2 2-5 0-15 20-23 37-16 2 1 9-9 9-12l-15-13c-30-24-39-35-41-46-2-13-44-11-84 6-22 9-21 9-19 19 3 10 3 31 1 39-10 43-1 80 27 115 14 17 23 31 31 46 7 14 7 14 11 7zm53-3c32-15 38-21 25-27l-8-7c-6-5-7-4-7 2s-1 6-8 10c-35 18-36 37-2 22zm-1132-8-2-24a3219 3219 0 0 0-10-111l-1 2-9 11a309 309 0 0 0-25 28c-11 13-8 22 26 71 19 30 22 33 21 23zm1103-28 2-14-7-5-8-5-5-2-4-1 7 14c4 7 8 16 8 19 3 12 3 12 7-6zm17 4c3-2 4-9 2-10h-1l-2 6c-2 6-1 7 1 4zm-708-13c52-36 100-102 112-156 2-9 2-18 2-132v-121h-50l-1 102c0 111 0 109-8 137-11 38-27 65-59 98l-13 13v35c0 19 1 34 2 34l15-10zm261-24 1-34-10-9c-34-37-52-69-65-115-6-25-7-34-7-135v-92h-51l1 125c0 140-1 124 10 152 5 14 7 17 18 37 19 34 50 68 88 96 16 12 15 14 15-25zm503 21c4-4 4-11 1-14-7-6-65-33-69-31-10 5-3 16 17 26l21 13c21 13 23 13 30 6zm13-33c5-6 5-15-1-18l-58-24c-13-5-16 12-4 18l31 15c26 13 28 13 32 9zm8-37c6-7 4-16-6-29-8-11-9-11-12-9s-3 5 2 6c4 0 6 3 5 8 0 6-6 7-17 4l-12-5c-8-3-14-3-18 0-4 4-2 5 22 15 31 14 31 14 36 10zm-524-174v-162h-31l-32 1c-2 1-2 153-1 178 3 54 24 106 56 141 9 9 9 19 8-158zm-265 153c22-23 40-60 49-99 3-13 3-13 3-114v-102h-63v162l1 162 10-9zm-425-21 4-3-1-18c0-22 3-32 14-56 8-19 8-20-1-21-20-2-32-14-36-37-1-5-3-15-6-21-2-6-3-21-1-27l2-23c0-16 0-18 4-26l4-12c1-18 16-34 38-37 4-1 6-8 3-11l-124-1c-1 1 17 59 33 109a3362 3362 0 0 1 39 119 4433 4433 0 0 1 24 68l4-3zm1020-69c38-20 75-26 122-19l4 1v-13c1-7 0-20-1-28l-2-14-10-3c-41-13-92-3-139 26-7 4-7 4-1 21l6 16 9 19 12-6zm-913-12 8-8c9-7 9-8-1-10-5-2-14-1-16 0-1 1 3 13 5 17 1 2 3 2 4 1zm865-31-4-12-12-32a32891 32891 0 0 0-45-125c-3-12-2-12-29-13h-25c-2 1-2 10-2 66v65l20 9c28 13 62 31 76 40 24 16 25 16 21 2zm-824-2c16-9 12-73-5-87-6-5-7-5-10 6-2 7-2 7 0 9 10 8 9 28-1 37-3 3-3 5-1 9 3 4 3 15 0 20-6 8 5 12 17 6zm-76-1c38-2 41-3 45-13 5-12 0-13-45-13h-36l-3-3c-3-4-3-5 1-9l3-3 40 1c49 0 47 1 47-12 0-6 0-8-3-11l-3-3h-83l-3-3c-4-4-2-12 4-13h41l39 1 3-4c3-4 3-4 1-10-3-11-9-12-54-13-32-1-37-3-34-10 4-6 5-6 42-5 38 1 36 1 36-7 0-6-5-10-17-12l-13-3c-59-11-77-7-81 18l-4 13c-5 7-6 20-3 35 2 4 1 6-1 10-3 8-3 23 2 32 2 5 3 9 3 15 0 17 14 25 41 24l35-2zm134-28a766 766 0 0 0 36-18c6 0 6 0 6-66v-64c-1-2-135-4-141-1-1 0-2 4-2 10v10l8 5c11 7 13 10 13 25v11l4 5 7 5c11 0 26 13 30 28a278 278 0 0 1 7 66l32-16zm787 7c49-28 89-36 132-27 13 2 15 2 15-1l-2-17-2-20v-11l-1-15a506 506 0 0 1-4-66h-206v3l3 9a4748 4748 0 0 1 53 150c0 1 3 0 12-5zm170-24 6-19 7-24a5113 5113 0 0 0 28-87v-3h-28c-20 0-29 1-30 2s0 12 1 15l1 10a16407 16407 0 0 0 7 91c2 28 3 30 8 15zm-883-15c31-12 83-29 105-34l11-3v-82H564v62c0 59 0 63 2 62l14-5zm559-57v-62h-133v81l10 3a1587 1587 0 0 1 122 40l1-62zm-749-52c1-11 3-11-25-10l-23 1-1 4c0 6 1 8 7 8l13 2 24 4h4zm89-27a2596 2596 0 0 0-51-153c-11-34-9-31-19-25-39 23-83 31-129 24-22-4-20-11-14 55a2714 2714 0 0 1 6 100c1 2 207 2 207-1zm216 1c1 0 2-14 2-40v-40l-5-1-17-5a1175 1175 0 0 1-110-38c-2 1-2 124 0 125 1 1 128 0 130-1zm294 0c2-4 2-326 0-325-3 1-28 34-35 47-14 24-20 43-25 73l-4 22v183l28 1a7464 7464 0 0 1 36-1zm150-61-1-63-12 5-17 7c-51 17-64 21-89 27l-14 4v82h133zm215 60v-9l-8-1-17-2c-20-4-20-4-21 6l-1 8h21c21 1 26 0 26-2zm-1099-2-1-15-2-27a1154 1154 0 0 0-7-93l-21 59-25 78c0 2 3 2 28 2h28zm293-24c0-80-1-102-3-104l-35-18c-37-18-49-24-63-34-16-10-15-11-5 21a2893 2893 0 0 1 25 76l25 76 3 11h52zm229-71c-1-88-1-101-3-110-9-46-27-82-55-113-7-7-6-24-6 159l1 163h63zm66-23v-123l-3-12a289 289 0 0 0-127-163v36l1 36 6 5c24 21 53 68 64 107 8 30 8 27 8 136l1 100h50zm66 31c0-83 0-92 3-109 7-55 27-96 65-137l13-14 1-35-1-36-3 2-16 12c-24 19-39 34-59 58-23 27-43 66-50 96l-4 13v241h51zm382 82c2-10 2-12-3-13-13-3-21-19-16-32l2-4-6-7c-6-5-7-6-12-7-17-2-25-16-29-47a459 459 0 0 0-3-36c0-11 2-11-29 5l-32 15c-6 2-11 6-9 9v62l1 62c1 2 10 2 67 2l66-1zm213 8-8-25a10744 10744 0 0 1-69-213l-20-56c0-1-4 1-9 7l-9 8-1 13c0 19-3 32-11 52l-4 11-4 10h6c22 0 42 16 43 35 0 6 2 11 4 16 3 7 3 9 3 23v27c0 12-2 24-5 29l-4 16c-5 23-18 36-38 38l-7 1-1 4v5h67l67-1zm-119-27c10-5 14-12 15-24l2-9c5-6 8-25 5-32-1-5-1-5 1-12 3-8 2-26-2-33-1-3-3-9-3-14-2-25-25-31-81-24l-20 2c-16 0-24 5-21 16 1 8 1 8 43 7 46 0 51 2 40 13l-4 3h-81l-2 4-4 4c-2 1 1 10 5 14l4 3 42 1c47 0 48 0 45 9-2 5-2 5-46 6l-42 1-3 4c-2 5-2 6 0 10 3 10 4 10 57 12 25 0 27 1 30 3 7 7 0 13-14 11-53-3-76 1-63 13 5 5 12 6 44 11l14 2c2 2 34 1 39-1zm-123-62 3-7 3-4-3-4c-9-9-8-28 1-38 2-2 2-3 1-5-2-3-3-23-1-25 4-2 1-5-4-5-22 0-26 14-18 64 3 19 18 40 18 24zM697 894l-1-275a366 366 0 0 0-100 16 958 958 0 0 0-63 20 510 510 0 0 0-191 134c0 2 7 15 14 25 34 50 41 69 40 106l-3 37c-5 25-4 40 2 36s11 2 16 20c5 16 11 35 13 36a419 419 0 0 0 57 36 881 881 0 0 0 214 85c1-1 2-93 2-276zm-64 218c-7-7-8-29-1-40 12-23 26-18 24 10 0 19-15 37-23 30zm-140-63c-5-11-2-29 6-39 13-16 23-13 23 7 0 21-23 46-29 32zm86-55c-6-12-2-31 10-43 12-11 18-6 18 14 0 22-21 44-28 29zm-110-65c-12-11 9-49 26-49 6 0 7 21 1 33s-22 21-27 16zm165-36c-12-13 0-55 15-55 8 0 13 27 7 39-5 12-17 20-22 16zm-55-62c-7-19 8-50 24-50 6 0 9 12 7 23-5 20-26 38-31 27zm-152-6c-10-17 21-52 36-42 3 1 2 15-1 21-7 15-31 29-35 21zm93-88c-10-14 16-58 30-49 13 7 0 40-19 49-8 3-9 3-11 0zm120-21c-12-14 1-58 17-56 14 2 10 37-5 52-6 5-10 6-12 4zm386 449 28-8 34-11 22-9a827 827 0 0 0 172-90c1-1 0-5-2-10l-3-12-2-11v-18l3-21 1-19a453 453 0 0 0 3-39l5-51a5954 5954 0 0 1 7-92c3-19 3-46 0-47l-3-2a1139 1139 0 0 0-61-40 638 638 0 0 0-167-60c-18-4-55-8-56-6-1 1-3 549-2 550s11 0 21-4zm29-60c-11-14-13-37-3-47 8-7 23 13 23 31 0 23-9 30-20 16zm147-53c-15-6-25-31-19-47 3-8 10-6 20 4 8 8 10 17 9 31 0 14-2 16-10 12zm-93-58-7-7-2-5c-7-8-6-35 2-36 9-3 25 18 25 33 0 20-7 25-18 15zm118-63c-18-6-36-51-19-51 13 0 29 21 29 39 0 11-2 14-10 12zm-172-43c-11-13-15-33-7-45 8-14 26 7 26 29s-8 29-19 16zm51-62a43 43 0 0 1-12-40c3-17 32 10 33 31 0 19-7 23-21 9zm155-2c-14-8-22-19-23-32-1-20 29-8 38 14 6 18 0 26-15 18zm-86-85c-14-3-29-27-26-43 1-11 8-12 20-3 18 13 23 49 6 46zm-126-30c-19-22-12-61 7-43 10 10 12 16 13 29 0 22-8 28-20 14zm-709 388c20-3 42-11 61-22 14-8 14-7 8-24a360 360 0 0 1-14-38l-18 9a178 178 0 0 1-120 14c-9 7 4 56 16 59 21 5 45 6 67 2zm956-19c0-1-2-6-7-13l-13 9c0 2 18 5 20 4zm54-3 4-5 4-11 10-31c3-9 4-34 2-57a6676 6676 0 0 1-13-147l-2-18-3-42-3-51-2-36c-2-26-5-117-5-176v-45h-20v45a5748 5748 0 0 1-31 498c0 24 2 30 19 68l4 9h17l19-1zm-1035-51c26-2 63-15 62-22-2-10-2-31-1-42 8-47 8-55-2-83-4-13-7-19-24-43a344 344 0 0 1-27-49c0-4-3-2-7 4-8 16-6 26 12 62 7 14 9 22 7 25l-6 8c-19 26-19 63-1 82 3 3 3 4-1 8-13 13-33-32-27-61a92 92 0 0 1 13-32c5-7 5-10 0-10l-6-3c-4-4-6-3-4 1 4 8-3 22-11 25l-3 9c-1 10-7 17-15 19-5 0-6 1-9 10-3 11-16 18-29 14-7-2-7-2-12 5-5 6-5 5 8 16a192 192 0 0 1 44 51c1 5 1 5 14 6l10 1 15-1zm549-60a310 310 0 0 1 80-103l31-24c16-11 16-10 16-24 0-12-1-14-6-10a274 274 0 0 1-271-1v26l5 2c51 31 104 93 128 152l4 9 3-6c1-3 5-13 10-21zm531-5a948 948 0 0 0 38-46l7-11-8-17c-13-26-56-87-61-87v8a1243 1243 0 0 1 7 72l2 29c3 34 6 59 7 59l8-7zM211 941c1-4 2-4-4-7-13-9-4-19 10-12l8 3 7 4c10 7 24 2 18-6-2-3-42-24-49-25-6-2-12 6-12 15 0 11 20 37 22 28zm62-35c4-4-1-14-6-14l-4-2-12-7-10-6-6-3-15-8c-13-8-21-4-21 9 0 10 67 37 74 31zm15-28c5-8 1-12-39-38l-10-7c-12-7-17-7-20 0-6 9-3 12 36 34l11 7c10 8 19 9 22 4zm19-34-10-23c-2-8-5-8-4 0l-1 2c-6 8-4 16 5 21l10 6c2 4 2-1 0-6zm-32-19c2-7 2-7 0-7s-6 8-5 10c1 4 3 2 5-3zm-20-3-1-3c-2-2 6-9 15-14 14-7 19-13 19-22 0-4-5-3-38 8-14 5-19 11-15 20 3 5 20 15 20 11zm636-2c35-6 80-23 97-37 2-3 5-44 2-44-2 0-12 5-15 8a232 232 0 0 1-163 31 232 232 0 0 1-98-39l-1 21v22l7 4a277 277 0 0 0 171 33zm-26-54c44-3 88-19 118-43l8-6v-21l-7-5c-22-14-35-40-36-75-1-18 0-18-10-8-51 48-113 49-169 3-15-12-14-13-14 6-1 35-13 60-35 73l-7 5v10c0 13 0 14 20 27a262 262 0 0 0 113 35l19-1zm-584-13c0-20-16-47-34-57-14-8-21-10-43-13l-6-1 1 4c6 36 26 59 61 67 14 4 21 4 21 0zm103-73c24-5 61-43 51-53a171 171 0 0 0-31 24l-12 13c-5 7-11 13-13 14-5 3-6 4-2 3l7-1zm-37-5c17-9 13-29-11-53-17-16-26-33-31-56v-4l-3 4c-6 8-11 25-13 43-5 39 31 79 58 66zm381-15c9-13 11-24 11-57l1-23-6-8a285 285 0 0 1-49-139c-1-7-1-7-7 1a85 85 0 0 0-11 65l1 18c0 27-3 35-26 64-17 21-22 33-14 30l17-2 14-2 1-5c1-8 5-18 9-23 8-9 10-17 10-35 1-8 12-11 14-4 6 13 0 38-10 50-10 11-9 13 9 13l19 1 3 2v70l4-4c3-2 7-8 10-12zm263-55c2-3 7-4 20-2l14 1c2-1-1-9-11-27-9-16-6-43 5-40 5 1 6 4 6 16s1 15 9 27l7 16 3 10 18 3c23 3 22-2-7-35a85 85 0 0 1-19-58c3-52 1-69-14-87-3-4-3-4-5 12l-2 18-2 9c-6 32-24 76-43 104l-6 9v14c0 39 5 60 18 74l7 7v-34l2-37zm-609 49c28-31 39-84 17-81a106 106 0 0 0-55 25c-5 4-4 8 9 20 12 11 18 22 19 33 1 12 1 12 10 3zm-104-13c-3-6-5-24-4-45 1-19 1-19-7-18-16 3-18 5-12 15 3 4 6 13 8 20 4 13 14 35 16 34 1-1 0-3-1-6zm236 5 5-3 18-6 13-5v-5c0-21 8-33 41-63 25-24 33-47 24-79a139 139 0 0 1 8-81l5-7c13-24 38-46 65-59a447 447 0 0 0 22-9l22-7a319 319 0 0 0 41-14c16-5 56-34 50-36a588 588 0 0 0-152 27c-9 4-25 21-38 40l-6 9c-20 30-28 61-28 114 0 57-9 75-49 105-28 22-41 37-44 54-3 14-1 31 3 25zm678-15c-1-27-5-33-38-60-49-37-53-47-54-115v-36l-4-16c-11-36-28-66-53-94-9-9-13-12-27-15l-13-4-28-7a1043 1043 0 0 0-100-12c0 6 41 35 50 35l7 3 15 6 16 4 20 6c72 22 119 88 107 149-5 28-6 41-4 47l2 6c2 10 10 21 31 41s30 32 32 41l3 20 6 5 32 12v-16zm-319-3c22-5 46-21 73-49a279 279 0 0 0 57-188v-39l-3-2-12-5-9-3-20-7a350 350 0 0 1-60-23c-4 0-28-20-38-33-10-11-12-12-17-3-10 21-46 44-89 56l-15 5-7 2c-3 0-5 1-5 2l-2 1-9 3-11 4c-11 4-7 91 6 139 9 32 21 57 39 81a68 68 0 0 1 8 12l12 11c32 31 67 43 102 36zm-35-53c-12-3-16-7-12-13 1-3 5-3 7-1s38 2 38-1c0-2 5 0 7 2 7 10-17 18-40 13zm-33-29c-4-4-1-10 4-10l10-3c15-7 19-8 27-4l7 4 4-3c6-4 13-4 22 1l10 4c8 0 13 4 12 9l-1 3-21-1-24 1h-8c-7-2-34-1-38 1-1 0-3 0-4-2zm43-43-8-3c-3-2-7-3-10-3-7-1-10-6-8-13 2-4 5-5 9-1 2 2 8 5 13 6l9 4 6-3 8-2 4-4c4-4 7-5 10-2 4 5 0 13-8 15l-8 3c-6 3-11 4-17 3zm18-49c-3-8-1-68 3-74 3-5 12 1 10 7l-2 35-1 34c-2 2-8 1-10-2zm-105-33c-6-4-10-9-9-14 0-6-1-7-13-1-8 4-11 5-12 4-11-6 12-23 39-28 8-2 28 6 39 14 15 11 9 21-6 11-7-4-10-4-11 0-3 14-17 21-27 14zm162-1c-5-4-7-7-7-12 0-6-7-6-15 1-8 5-15 0-10-7a66 66 0 0 1 37-19c14-5 53 13 52 24 0 6-8 5-18-1-8-6-10-6-10-2 0 15-17 24-29 16zm-211-43c-14-14 47-34 78-27 10 3 29 12 33 16 8 9 1 14-12 8-18-9-24-10-41-10-15 0-27 3-42 9-12 6-13 7-16 4zm168-1c-5-5 10-20 20-21l4-2a106 106 0 0 1 78 9c7 3 10 7 10 11-1 5-6 6-15 2-17-8-27-11-44-11-18 0-31 4-43 12-3 2-8 2-10 0zM572 625l9-2 15-5c9-2 9-3 13-14 4-9 11-20 24-37 18-23 23-41 18-71-4-31 3-62 19-80 13-14 13-16 13-26l2-17c2-13-1-13-17 1-32 27-44 63-37 105 9 51 2 69-46 113-11 9-15 17-18 27-2 10-2 10 0 8l5-2zm565-3c-1-11-5-17-27-38-40-40-47-61-37-107 9-39-6-78-42-107-13-10-13-11-12 11l1 20 9 11c22 28 29 57 23 103-2 19 6 38 31 68 8 10 10 13 13 22l3 11 8 2 18 6c14 4 13 4 12-2zm-700-18c23-22 22-41-3-57-12-8-13-7-8 5 3 11 2 31-3 51-5 19-4 19 14 1zm-101-19a449 449 0 0 1 17-13c0-3-33-23-34-21-1 4 5 32 9 37 2 2 1 2 8-3zm44-23c7-3 7-4 3-11-6-9-17-14-28-11-11 1-12 5-3 11l11 9c6 5 8 5 17 2zm-92-7c9-17 15-26 18-30 5-6 5-6-4-6-16 0-19 3-19 21l2 19 3-4zm121-5c-2-36-46-56-74-32-17 14-12 25 5 13 11-7 19-9 31-6 11 4 23 13 28 22 6 12 11 14 10 3zm948-115c12-11 3-16-28-15-28 0-35 5-24 16l4 3h44zm-4-41 24-37c19-37 15-53-22-81-18-13-22-26-12-34 10-9 13-19 7-28-12-20-41-12-41 11 0 7 2 9 13 19 7 5 1 21-11 29l-10 7c-34 22-35 51-4 96l14 20 4 8h31zM689 278l21-6c41-9 52-11 95-14 20-2 94-1 113 1a377 377 0 0 1 71 12 413 413 0 0 1 42 11l12-32a647 647 0 0 1 20-66l6-18a429 429 0 0 1 16-55c-3 0-13 11-16 19-4 8-5 9-10 8-18-3-27-1-33 6-9 10-3 27 11 31 13 4 14 7 5 19-21 28-57 26-75-4l-4-6-8 5c-21 17-45 17-66 0-21-16-26-49-7-40 15 7 30 0 34-15 4-18-13-30-34-24-9 3-12 0-9-9 7-17 3-29-14-47l-7-7-8 9c-16 16-21 29-15 40s2 19-8 14c-16-7-33 3-33 21 0 16 18 25 35 16 19-8 16 19-3 37-23 22-49 24-73 4-5-4-7-4-9 0-11 30-54 34-75 7-10-12-10-16-1-18 13-3 20-11 20-23s-15-21-30-17c-12 3-14 3-15-3s-3-9-10-17c-10-10-11-9-7 5a1496 1496 0 0 1 19 58 2676 2676 0 0 1 30 96c2 8 0 8 20 2zm22-82c9-4 15-15 17-32 1-9 3-12 8-11 4 1 7 3 11 10 15 25 42 30 62 12 7-6 6-7-5-8-17-2-32-20-32-38 0-8 0-8-7-6l-11 4-15 5-9 5-31 14-1 5c1 8-4 17-14 28-11 11 9 20 27 12zm309-1c6-4 7-6 3-9-8-6-10-8-13-13l-4-13c0-4-1-8-3-9a278 278 0 0 0-70-29l-1 8c0 19-13 34-33 37-8 1-9 2-3 8 19 19 47 13 62-13 7-13 15-11 17 3 2 26 24 41 45 30z"/><g fill="#c58c35" fill-rule="evenodd" stroke-opacity="0"><path d="M851 46c-10 11-24 23-25 40-2 8 7 15 4 22-3 4-9 0-13 0-14-5-30 6-30 21-1 10 6 21 17 22 9 2 17-2 25-4 6 0 6 7 5 11-5 19-20 34-38 40-14 4-29 2-41-6-5-2-9-7-15-8-4 3-4 9-8 13-11 16-34 19-51 11-11-5-20-14-24-25 1-5 7-5 11-7 11-4 18-17 14-28-6-12-21-15-33-11-3 0-8 2-10-1-2-6-4-12-9-16-3-3-7-8-11-10-4 0-2 5-1 7l51 163c1 5 6 3 10 2 44-14 90-22 137-23 43-2 88-1 131 5 24 3 47 10 71 16 4 1 9 3 14 3 7-15 11-31 16-47 13-40 24-82 39-122 1-2 0-5-3-4-9 6-14 16-20 25-2 4-7 1-10 1-10 0-21-1-28 7-8 7-7 20 0 27 5 6 14 6 20 11 2 5-3 10-6 14-11 15-34 22-51 14-11-5-18-15-24-24-3-4-6 1-9 2-10 9-24 15-37 13-23-1-44-20-48-43-1-4 2-10 7-8 10 4 23 6 32-2 8-9 11-23 2-32-8-9-21-9-31-6-3 1-9 1-8-3 2-9 6-18 3-27-3-13-14-23-23-33h-2zM990 738c-11 3-20 12-30 16-28 14-58 23-88 26-21 0-42 1-62-3-32-6-63-18-89-36-3 0-6-5-8-2l-1 43c10 9 23 14 35 19 28 14 59 19 89 23 21-1 41-1 62-4 27-6 55-15 79-29 6-3 14-7 14-15l1-37-2-1zM713 847l-1 13 1 60a248 248 0 0 1 76 139c3 40 1 80 2 120l1 89c3 3 9 1 14 1h38v-248c-10-45-35-86-66-120a348 348 0 0 0-65-54zM989 845c-28 21-55 43-77 71-25 31-44 67-54 106v246c3 3 9 1 14 1h38c1-61-1-122 2-183 2-49 19-98 50-136l30-33-1-71-2-1zM818 1282l-25 1c-2 8-1 17-1 25-1 58 0 116-3 174 0 24-8 47-17 70-14 31-37 56-60 80v66c-1 6 3 5 6 3 45-29 82-71 107-119 8-16 15-34 19-53v-246c-3-3-9-1-14-1h-12zM884 1281l-26 1v173c0 27-1 54 2 81 4 21 14 40 24 59 23 41 57 75 95 103 3 2 9 6 11 1 2-12 1-24 2-37v-28c-27-27-51-58-65-94-9-23-15-48-15-74-2-61-1-122-2-184-4-2-10 0-14-1h-12zM849 1731c-42 1-86 7-123 29l-14 10v43c1 4 4 2 6 1 25-19 55-29 85-36 28-6 57-8 85-3 34 5 66 18 94 36 3 1 7 6 9 1 2-14 0-28 0-43-18-15-41-23-64-29-26-6-52-9-78-9zM1005 1281v83c4 3 10 3 16 5 39 12 77 25 116 39 3-1 1-6 2-8l1-117c-4-2-10 0-14-1l-120-1h-1zM1137 1142a1051 1051 0 0 1-130 43c-2 6-1 14-2 21v62c3 3 9 1 14 1h120c2-3 0-9 1-14 0-36 1-73-1-109l-2-4zM565 1143c-3 1-1 6-2 9-2 38-1 76 1 113-1 5 5 4 8 4l124-1c2-2 1-6 1-10l1-71c-5-3-13-4-19-6-35-10-70-22-104-35l-10-3zM563 1282l1 121c-1 3 1 6 4 5 40-16 81-30 123-40 7 0 6-6 6-11v-75c-4-2-10 0-14-1H564l-1 1zM395 1013c-17 7-34 16-52 20-24 7-49 7-73 4-5 0-9-3-14-2-5 7-3 16-2 24 3 12 6 25 15 34 6 5 15 5 23 6 41 5 84-5 118-28 3-2 5-7 3-11l-17-46-1-1zM199 681c-4 1-1 6-1 9 4 19 13 36 28 48 13 11 29 16 45 19 4 0 11 1 11-4-1-16-8-30-18-43a77 77 0 0 0-52-27l-13-2zM1312 1251c-7 3-7 13-5 18 16 0 33 1 48-1 4-12-6-14-16-14l-27-3zM1321 455c-2 114-5 227-15 340-4 66-12 133-16 200-2 22 5 44 15 64 4 7 4 22 16 18 10-1 21 2 31-2 8-17 14-34 19-52 3-59-6-118-10-178a4202 4202 0 0 1-17-390h-23zM1328 419c-9 1-21-2-27 6-3 7 4 12 7 16h45c4-4 14-12 8-18-9-6-23-3-33-4zM1330 202c-19-1-30 28-14 38 6 4 10 12 6 19-8 16-28 20-38 34-16 18-11 44 0 63 9 17 20 33 31 49h31c17-24 37-48 42-77 3-16-6-31-18-41-10-11-25-18-30-32-3-10 9-14 11-22 10-14-6-33-21-31zM1440 1770c-7 1-3 11-2 16 6 18 18 36 36 44 14 6 29 14 45 12 7-3 1-13 0-18-8-30-38-50-68-53l-11-2zM1391 1426c-36 1-71 13-100 33-8 4 0 14 1 20 5 11 7 25 15 35 4 2 9-4 13-4 32-17 68-26 104-22 8 0 17 3 24 2l-3-56c-17-7-36-9-54-9zM366 1282c-8 1-18-1-25 3-2 5-1 13 6 12 14 3 29 7 43 5 0-6 4-14 0-19l-24-1zM376 1477c-11 1-24-1-34 4-8 10-11 24-17 35-10 24-5 51-4 76 6 103 17 206 21 309 3 67 2 134 4 201 6 1 21 6 20-4 4-87 5-174 12-261 6-94 16-188 24-282 0-22-10-44-16-65-3-4-3-15-10-13zM339 2153c-18 25-40 51-40 83-1 21 17 36 33 47 9 6 19 17 14 29-6 8-16 16-12 28 2 14 20 25 33 15 9-7 13-22 9-33-6-4-13-9-14-16 2-16 19-23 29-32 14-10 26-25 23-43-6-26-21-49-36-71-9-12-26-6-38-7zM360 2116c-10 1-22-1-32 5-7 5-1 17 8 17 16 1 32 0 47-2 8-5 3-18-6-19l-17-1zM669 2253c-6 1-6 8-8 12-13 45-28 89-42 134-1 6-5 14-2 21 2 2 5-2 6-3 5-6 8-14 12-20 3-2 7 1 10 1 10 3 24 0 30-10 5-8 3-20-6-25-5-4-13-4-17-10 0-7 5-12 8-17a42 42 0 0 1 71 12c1 2 3 7 6 6 8-5 14-12 22-16 13-6 28-7 41-2 16 6 28 21 32 37 1 3 1 9-3 11-6 1-11-5-17-4-10 0-20 6-25 15-5 11 2 23 12 28 7 4 15 3 22 0 3-1 9-1 10 3 0 6-5 12-4 18 0 13 9 25 17 35 3 3 5 7 9 9l6-7c8-10 17-21 19-33 0-6 0-12-3-17-2-3-2-8 2-9 7-1 13 6 19 4 11 0 21-8 23-19 2-9-3-18-10-22-9-5-21-6-30-2-4 1-8-1-7-6 1-12 8-23 17-31 15-14 38-17 56-8 8 3 14 10 21 16 4 1 5-4 7-6 7-14 21-27 38-27 16 0 33 10 40 24 1 4 2 9-1 12-4 3-10 1-14 4-8 6-12 17-8 26 7 8 17 11 27 12 4 0 7-1 10-4 5 2 6 8 9 12s5 10 11 12c4 0 3-6 2-8-3-16-9-31-13-46l-32-103c-1-3-1-7-4-9-6 0-13 3-19 4a692 692 0 0 1-237 16c-38-5-75-11-112-20h-1z" style="paint-order:markers fill stroke"/></g><g fill="#6b4424" fill-rule="evenodd" stroke-opacity="0"><path d="M879 270c-4-1-6 3-3 5 17 19 40 31 64 40 32 10 67 17 94 39 30 22 54 56 56 95 2 22-6 44-6 67 1 17 12 32 24 44 13 15 29 28 39 45 5 9 3 20 9 29 11 6 23 10 35 14 4-3 2-10 3-15-1-14-3-30-15-41-20-21-48-35-65-60-14-23-11-50-12-75-1-13 1-27-1-40-12-42-32-84-64-114-11-9-26-10-38-15-39-9-79-15-119-18h-1z" style="paint-order:markers fill stroke"/><path d="M1020 362c-4 2-2 9-2 13 0 9-1 18 2 27 16 19 29 41 32 67 3 20-2 40-1 60 5 25 23 44 38 64l10 24c13 3 25 9 38 11 4-4 0-11-1-15-9-16-23-27-35-40-16-18-32-40-30-65-1-20 7-39 5-59-1-33-22-62-47-82-3-2-6-5-9-5z" style="paint-order:markers fill stroke"/><path d="M1020 426c-4 3-3 10-4 14a306 306 0 0 1-53 140c1 28-3 59 13 83 4 5 8 11 13 15 2-7 0-16 1-23 1-16 0-33 3-49 4-4 11-1 17-2 5-1 12 2 17-1 0-5-5-10-7-16-7-13-14-30-7-45 2-6 11-4 10 2 2 11 0 22 6 31 7 10 9 21 15 31 7 5 16 3 24 5 5 1 13-1 11-7-9-19-27-31-35-51-6-13-8-28-7-43 0-19 3-40-2-59-3-9-7-19-14-25h-1zM820 271c-44 3-87 9-129 21-15 3-27 13-37 25-22 26-43 56-47 92-6 33-2 67-9 101-4 18-17 34-31 46-19 17-42 30-53 53-6 12-8 25-4 38 3 3 7-3 11-3 10-4 21-6 30-11 0-14 3-28 12-39 16-20 38-34 50-56 10-19 7-40 3-60-3-23-2-48 7-70 15-30 41-55 71-69 33-16 71-20 103-39 11-8 24-15 32-26 1-5-7-3-9-3z" style="paint-order:markers fill stroke"/><path d="M683 362c-10 4-18 13-26 20-17 19-29 45-29 71-1 28 11 56 0 83-11 29-39 46-57 70-3 7-7 15-7 22 3 3 6-3 10-2 10-3 21-6 31-11 6-10 10-21 17-30 13-20 32-40 32-66-1-22-4-45 0-66 4-18 14-33 25-46 8-9 5-21 7-31-1-4 3-13-3-14z" style="paint-order:markers fill stroke"/><path d="M683 427c-6 4-9 12-12 18-9 19-7 41-4 62 1 19 0 38-12 54-10 15-23 29-31 46-2 3 0 8 4 6 10-2 21-2 31-5 3-8 4-16 8-23 8-10 13-22 13-35 1-5 0-13 7-12 7 0 6 9 7 13 0 16-6 32-17 44-3 3-1 8 3 8 10 3 20 0 30 2 4 5 2 13 3 19v54c6-4 10-10 14-15 10-13 13-29 13-45l1-38c-25-35-43-75-49-117l-7-35-2-1zM714 1879c-2 10-1 21-1 31-1 13 0 26-3 38-5 5-13 0-19 1-5 1-11-1-14 2 1 7 7 12 10 19 5 12 9 27 5 40-2 5-10 4-10-1-2-11-3-23-8-32-6-10-12-21-19-30l-30-6c-4 6 3 12 6 16 13 16 28 33 32 53 4 19 2 39 2 58 1 15-1 32 7 46 4 4 7 11 12 13 5-2 3-9 4-13 5-42 16-84 40-120 5-10 14-19 13-31-1-22 0-44-8-64-4-8-11-15-18-20z" style="paint-order:markers fill stroke"/><path d="M567 1927c-4 2 0 8 1 12 9 17 25 28 38 43 18 19 32 46 26 73-5 19-8 39-3 58 6 29 23 55 46 75 2 2 7 9 10 3 3-13 0-28 0-42-12-11-24-22-29-37-6-17-3-35-4-52-1-18 1-36-4-53-10-24-35-40-41-66-1-8-11-6-17-9l-23-5z" style="paint-order:markers fill stroke"/><path d="M514 1908c-6 2-4 10-4 14 1 15 7 29 18 38 17 18 41 30 57 50s18 46 17 70a187 187 0 0 0 55 150c11 11 28 11 42 16 18 3 36 9 55 9 12 2 3-5-3-7-41-21-86-41-114-79-18-23-25-53-23-82-1-24 8-50-1-73-12-30-48-41-59-72-3-7-1-15-6-22-10-5-21-9-32-12h-2zM1137 1926c-13 3-26 5-38 12-4 3-3 8-6 12-7 18-23 31-33 47-11 23-9 49-6 72 3 29-10 59-33 76-5 9-3 20-4 30 0 6-3 14 2 20 6-2 9-8 13-11 20-19 38-42 43-70 5-16 2-33-1-50v-47c8-17 18-34 34-46 11-12 26-23 31-39 0-2 2-6-2-6z" style="paint-order:markers fill stroke"/><path d="M988 1878c-8 5-12 14-17 21-11 19-8 42-10 64-1 6 1 12 6 17 29 41 45 90 49 140-1 4 4 7 7 3 12-10 17-27 16-43 0-24-4-49 1-72s26-37 37-57c2-3 4-10-1-10-12 0-24 6-33 12-9 15-19 30-21 48-1 4-1 13-7 13-6-5-5-15-5-22 1-15 10-28 17-40-2-4-8-1-12-2-7-1-15 1-22-2-4-10-2-22-3-32 0-13 1-26-1-38h-1z" style="paint-order:markers fill stroke"/><path d="M1191 1907c-12 3-24 7-35 14-4 8-3 19-9 27-12 20-32 33-48 50-15 17-13 41-10 62 4 30 4 63-11 90-18 33-47 57-79 75-16 9-34 15-49 27-2 4 5 3 8 3 27-4 54-11 80-17 27-25 48-56 57-92 10-33 5-67 8-100 2-18 12-35 26-47 18-17 42-29 56-49 7-13 9-27 9-41l-3-2z" style="paint-order:markers fill stroke"/></g><g fill="#272e2e" fill-rule="evenodd" stroke-opacity="0"><path d="M988 800a284 284 0 0 1-136 36c-44 1-88-10-128-31l-10-4c-2 4 0 11-1 16-1 6-2 13 6 15 44 28 80 68 107 112 10 15 17 31 24 47 3 2 4-4 5-6 14-32 32-63 56-89 22-25 47-46 74-65 9-6 6-17 6-26 0-2 0-5-3-5zM715 942c-3 2-1 7-2 10v285c0 11-1 22 1 32h63c3-5 1-12 1-17 0-59 1-118-1-178a213 213 0 0 0-62-132zM988 941c-7 5-10 13-16 19-21 28-38 60-43 94-7 32-4 65-5 97v117c5 2 11 0 17 1 16 0 32 2 48-1 3-2 1-8 2-11V973l-1-31-2-1zM958 1282l-31 1c-3 5-1 13-2 19v167c4 50 24 101 60 137 2 3 6 0 5-3 2-56 1-112 1-168v-152c-5-2-12 0-17-1h-16zM713 1283v288l1 35c4 2 7-3 10-5 26-29 42-65 51-103 4-28 2-57 3-86v-129c-5-2-12 0-18-1h-47zM851 1563c-5 2-5 9-8 13-17 40-45 75-77 104-16 15-32 27-49 40-7 5-5 15-6 23-1 4 2 7 6 6 17-7 33-15 51-20 68-21 143-16 208 15 4 1 9 5 14 5 2-6 0-12 1-18 0-11-11-15-18-21-50-35-91-83-116-139-2-2-3-8-6-8zM1308 1282c-28 1-56 0-84 2-1 6 4 13 5 19 18 47 34 95 51 143 9 0 16-7 24-10 37-19 80-30 122-21 4 0 12 4 15-1l-9-129c-3-4-11-1-15-2l-109-1zM416 1083c-10 5-19 11-29 15-30 13-62 17-94 14-9 0-19-4-28-3-6 3-3 11-4 16l8 123c1 6 0 13 2 19 9 3 19 1 28 2 58 0 117 1 175-1 3 0 7 0 5-4l-56-171c-2-3-3-9-7-10zM400 572c-14 2-27 6-39 13-7 5-17 9-21 17 0 6 6 10 10 14 10 11 21 23 21 38 0 3 1 9 5 7 13-11 22-26 29-42 4-12 9-26 5-39-1-5-6-8-10-8zM304 561c-4 4-6 10-9 15-6 19-11 40-4 60 6 18 19 36 38 42 11 3 26-2 29-14 2-16-9-29-18-39-11-12-22-24-27-40-4-7-5-16-8-24h-1zM320 550c-4 2-1 8-1 11 2 10 3 20 9 28 3 3 7-3 10-4 5-4 12-7 16-13-1-5-8-7-11-10-7-4-15-10-23-12zM359 538c-5 1-13 1-14 6 2 7 9 10 14 14 5 5 12 9 19 6 4-1 11-4 8-9-4-11-16-18-27-17z" style="paint-order:markers fill stroke"/><path d="M363 506c-16 0-32 10-39 24-1 4 1 8 5 7 9-1 15-9 23-10 19-6 39 7 48 24 2 3 6 9 9 6 4-21-11-41-30-48-5-2-10-3-16-3zM302 518c-7 0-17 0-19 9v31c1 3 4 3 5 0 7-13 14-26 22-37 2-5-6-3-8-3zM270 577c-6 1-14 1-18 6-2 6 4 12 6 19 6 15 10 32 20 45 2 2 4-2 2-3-6-15-3-31-5-46 0-7 1-14-1-21h-4zM425 541c-5 1-2 7-1 10 5 19 1 39-3 58-1 3-2 10 2 8 12-8 23-19 29-32 5-10 2-22-6-30-6-6-13-12-21-14zM435 627c-8 3-15 9-22 14-14 11-24 27-37 39-3 2-1 4 2 3 22-4 40-19 53-37 4-5 9-13 5-19h-1zM1389 1853c-10 0-21 4-25 14-3 11 4 24 12 31 14 16 32 30 40 49 4 8 3 17 5 25 3 1 5-3 6-5 7-13 8-29 8-44 0-17-1-36-12-49-7-9-17-20-29-21h-6zM1347 1874c-5 3-8 9-12 13-13 21-18 46-22 70 0 3 0 10 5 9 12-1 23-7 35-7 14-3 28-15 27-31 0-9-10-15-15-21-7-7-12-15-14-25-1-2-1-7-4-8zM1396 1945c-7 1-11 9-18 11-4 2-1 7 1 9 7 6 15 11 24 13 4 0 4-6 3-9 0-7 0-16-5-22l-5-2zM1359 1968c-6 1-12 3-17 7-3 3 2 7 4 10 6 7 14 12 23 11 5-1 11-3 15-7 1-4-4-6-6-8-6-4-10-9-16-12l-3-1z" style="paint-order:markers fill stroke"/><path d="M1320 1978c-3 1-2 6-2 9 2 13 11 24 21 32 12 10 29 12 42 6 10-5 19-12 24-21 3-3 1-10-4-9-9 3-16 11-26 13-12 4-26-1-36-11l-17-18-2-1zM1303 1920c-6 2-10 8-14 12-9 10-18 21-16 35 3 12 14 21 25 27 2 2 7 3 7 0-2-10-4-20-4-30 0-14 1-27 4-40 0-2 0-4-2-4zM1347 1852c-15 3-27 12-38 21-9 8-18 16-21 28-1 3 0 8 4 7 9-5 18-10 25-18 8-12 15-25 28-33 1-1 6-4 2-5zM1446 1884c-3 1-1 5 0 7 4 15 3 31 2 47 0 4-2 9 1 12 5 3 11 1 17 0 4-2 11-3 10-9-2-8-8-14-11-22-6-11-10-23-18-34l-1-1zM1443 1971c-4 2-5 7-7 10-5 9-12 17-15 27-1 5 4 6 7 6 6-2 12-1 16-5 5-9 3-20 3-29-1-3-1-8-4-9zM933 121c-4 9-2 20-8 28-6 12-19 16-31 18-7 3 2 10 5 12 15 13 39 9 51-5 7-6 10-15 18-19 8 6 5 19 10 27 7 15 28 24 42 13 5-1 9-6 4-10-9-7-16-15-17-27-3-13-18-15-28-21-15-6-30-13-46-16zM769 121c-24 7-47 17-70 29-5 4-1 13-6 18-3 8-13 14-13 23 5 13 23 10 32 5 15-8 15-27 20-41 8-4 13 8 17 13 10 14 27 23 44 17 8-3 18-7 21-15-4-7-14-3-20-8-15-7-21-24-21-39-1-2-2-3-4-2zM692 2334c-9 0-18 6-23 12 9 8 20 16 21 29 5 11 19 12 29 18 16 7 33 15 51 17 6-4 3-13 6-19 5-14 21-22 35-24 6-2 1-8-2-10a38 38 0 0 0-50-4c-11 6-15 20-26 25-7 1-7-9-10-14-5-14-14-30-31-30zM1013 2334c-19 1-35 18-34 37-1 6-8 10-13 4-11-13-24-31-44-30-12 1-24 7-31 17 1 6 9 5 13 7 16 5 28 20 29 36 1 9 12 2 17 1 22-7 44-14 64-27 2-8 2-16 9-22 3-4 14-10 8-17-5-4-12-6-18-6z" style="paint-order:markers fill stroke"/></g><g fill-rule="evenodd" stroke-opacity="0"><path d="M435 1077c-4 2 1 9 1 12 19 60 40 119 58 179 13 2 27 1 40 1 7 0 17 3 15-8 1-40 0-80-1-120-1-8-11-9-16-13-31-16-63-32-93-50l-4-1zM440 1283c-11 0-23-1-34 1-3 6-2 15-2 22 8 5 20 10 20 22 2 8-3 19 5 24 5 6 14 5 20 10 10 6 16 17 18 28 4 20 4 40 7 60 4 1 8-4 13-5 20-10 39-20 60-29 3-6 0-14 2-20 0-37 1-74-1-111-5-2-12-1-18-2h-90zM249 1283c-17 0-33-1-50 1-1 6 3 13 5 20 27 88 56 176 85 263 2 4 3 11 7 13 5-2 11-5 9-11 0-20 0-41 9-59 3-9 9-18 9-28-3-6-11-4-17-6-15-5-23-21-25-36-4-15-11-30-7-46 3-19 0-38 9-56 2-8 2-17 8-24 8-10 20-14 32-18 5-3 4-13-3-13h-71zM245 1129c-5 4-5 13-8 19-13 38-27 77-38 116-1 6 8 4 11 5h46c2-7-1-16-1-24-3-38-4-76-8-114 0-1 0-2-2-2zM403 1476c-4-1-8 2-6 6 2 6 3 13 9 16 5-5 13-10 16-17-3-5-11-4-17-5h-2zM1485 1282l-39 2c-3 9 1 20 1 30l9 111c1 4 5 2 5-1 16-46 29-93 45-139-1-4-7-2-10-3h-11zM1406 972c-7 3-13 10-18 15-1 20-2 40-10 58-3 10-8 20-10 30 7 1 15 0 21 3 14 4 25 15 27 29 1 13 9 24 8 37 0 22 1 45-7 66-4 15-7 31-20 40-8 5-17 7-26 8-2 4-4 14 5 11l127-1c2-5-2-10-2-15l-78-239c-5-14-9-29-16-42h-1zM1222 1104c-22 8-42 20-63 29-6 2-6 8-6 13 0 39 0 78 2 117-1 4 3 6 6 5h128c2-5 4-12 4-19-2-6-11-4-14-10-8-7-8-20-4-29-5-7-13-15-23-16-12-3-18-17-20-28a481 481 0 0 1-10-62zM1289 1064c-5 2-11 5-13 10 2 4 9 4 14 5 2 1 9 1 6-3-2-4-3-10-7-12zM1155 1283c-2 21-1 43-1 64v67l50 25c22 11 44 24 65 37 5 3 7-4 5-7l-44-123c-7-20-13-41-22-60-7-5-17-3-25-4-9 1-19-1-28 1z" style="paint-order:markers fill stroke"/></g></svg>
                        </g>
                    `
                },
                'J': { 
                    red: `
                        <g>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1696" height="2528"><path d="m358 2500-2-8-3-13a1332 1332 0 0 1-21-93l-4-16-4-15-3-14-1-5-3-14-9-41c0-2 9-21 12-24l9-17c8-15 9-17 3-17-4 0-7-6-7-15 0-10-1-11-8-8-25 8-47 30-56 56l-3 9c-4 4-5 38-2 50a228 228 0 0 0 18 51c3 9-3 12-13 6l-6-3-2-2-13-10a284 284 0 0 1-72-84l-5-7-1-2c0-3-1-6-7-19l-3-8-1-4-2-6-3-8-3-10-2-14a270 270 0 0 1 2-97l3-12 2-10 2-5a138 138 0 0 1 21-48l4-7 4-6 2-4 8-9 3-4 3-4a316 316 0 0 1 55-49c19-13 33-11 23 3-4 6-6 11-14 33a109 109 0 0 0 5 80 92 92 0 0 0 18 24c7 10 42 29 47 24a196 196 0 0 0-8-72l-4-17c-2-8-1-16 3-23l4-6-3-5c-7-12-2-32 8-34 6-1 5 5 5-98v-94l-10-14a723 723 0 0 1-118-219 139 139 0 0 0-9-25l-1-4-5-15-5-13c-4-4-11-15-18-28-35-69 6-152 86-174l12-3 139-1 2-3a215 215 0 0 0 6-44l1-9 2-14 2-18 3-18 3-21a835 835 0 0 1 12-89c2-14 3-13-15-13a319 319 0 0 1-122-28c-20-9-33-19-46-36-9-12-10-13-14-13l-5-1c0-1-4-3-9-4-33-12-61-31-71-52-12-21-11-39 2-97a565 565 0 0 0 8-27l2-8 2-6 1-3a195 195 0 0 1 24-44l8-11a1022 1022 0 0 0 34-45l5-6 10-11c23-27 76-80 101-101 12-10 12-11 2-20s-10-10-3-15l7-5a948 948 0 0 1 76-55l20-14c3-1 4-1 10 4 4 3 5 3 10-4 10-12 14-21 20-37l3-7 4-13 5-14a302 302 0 0 0 12-28l3-7c5-16 10-22 27-36l41-36c16-15 24-20 36-23a397 397 0 0 0 44-18l11-5c3 0 30-19 38-27l5-4 19-14a271 271 0 0 1 102-51 377 377 0 0 1 83-4l40 1h39l18-6 20-7c3-1 17-5 30-7 33-6 73 9 96 37l9 11 9 17 8 15v16c1 17-1 29-5 34l-19 26-18 15c-4 0-12 12-9 13 3 2-10 23-14 24-1 1-4 3-5 6l-26 31c-3 2-4 5-4 8l2 17c1 16 4 31 7 37l2 6 2 8 3 8 1 4 2 3 1 3 2 4 4 9 3 7 1 1 1 3c0 2 1 2 2 3 12 12 23 60 18 77-6 21-12 32-21 41l-7 6-6 3c-8 5-31 13-45 15-6 1-7 2-1 4a237 237 0 0 1 34 8l9 2c3 2 6 2 7 2s4 0 6 2l8 2 4 2 4 1 7 2 4 2 6 1 7 3 18 6 16 6a403 403 0 0 1 63 27l7 3 17 10a189 189 0 0 1 53 36c1 0 0-139-2-141l-3-1c-10 0-16-21-9-31 3-5 3-5 1-8-5-7-7-15-5-22a220 220 0 0 0 10-42c4-14 5-61 1-65l-6-5c-2-2-4-4-6-4l-8-2c-16-7-52-3-75 8l-10 4-25 16c-15 12-22 4-13-15l2-8 2-4 4-6c1-2 2-7 4-9l3-6c0-5 29-34 42-43a133 133 0 0 1 43-19c5-2 11-3 27-4l13-1 1-8c0-8 0-8 4-10 5-1 5-5 0-15l-3-7-2-4-2-6-2-4-2-1-4-6-5-8-1-4 1-7 3-9 3-13a418 418 0 0 0 14-62 535 535 0 0 1 13-54l3-14 5-21c6-33 9-39 17-33 3 3 4 4 7 24l4 13 1 6 4 19 3 12c1 8 5 20 7 25l2 8c0 2 0 6 2 8l1 5 3 13a1606 1606 0 0 1 13 54c3 4 5 16 6 24 1 6 0 7-5 13-6 7-12 18-17 32-4 11-4 11 1 14 4 1 4 2 4 9 1 9 2 10 8 8l17-8c26-10 52-62 47-94a172 172 0 0 0-16-49c-22-47 57 6 92 61a281 281 0 0 1 32 77 303 303 0 0 1-4 136l-5 15a263 263 0 0 1-37 67 338 338 0 0 1-43 41c-1 2-28 19-32 20-7 1-11-7-7-12l4-7 5-13c5-9 6-11 6-16 2-11 2-16 4-19 3-7 0-37-5-46l-3-8-1-5-3-4c-5-9-24-32-28-32l-8-3c-12-5-17-7-22-6h-5v14a319 319 0 0 0 12 93c3 3 2 15-2 20-3 5-3 6-1 11 7 13 0 33-11 33h-4v208l5 4 19 24a509 509 0 0 1 51 80c2 0 7 10 21 39a174 174 0 0 1 10 22l4 5a3407 3407 0 0 1 43 114 160 160 0 0 1 24 52c8 7 5 48-5 72l-5 14c0 7-32 40-44 46l-10 5-7 3-7 4c-16 7-56 9-145 9-18 0-21 1-21 3a604 604 0 0 0-10 70 317 317 0 0 0-7 47 1322 1322 0 0 0-10 79l-2 16c-1 4 1 4 17 5a291 291 0 0 1 78 12c-1 1-1 1 2 1 6 0 18 4 17 5s1 1 4 1l4 2h2c2 0 8 2 29 13 7 4 25 21 32 31 3 5 6 7 10 9l6 4c0 1 3 3 8 3l9 3 3 1c3 0 18 7 26 12 10 7 12 7 16 11 16 14 29 45 27 65a247 247 0 0 1-11 57 287 287 0 0 1-52 109l-12 15a494 494 0 0 1-41 49 1541 1541 0 0 1-81 80c-22 20-21 18-10 27 10 8 11 10 5 15a2083 2083 0 0 0-51 37l-12 9-21 15c-21 15-22 16-31 12l-6-3a103 103 0 0 0-22 40l-1 4-2 6-3 7c0 3-2 6-3 8l-3 6-1 3-3 9-5 13-3 9-2 4-2 5-2 5-2 6c0 3-23 27-27 27l-3 1-8 9c-5 3-15 13-23 20a332 332 0 0 1-47 38c-23 17-41 30-46 32l-7 3-6-2c-7-4-3-6-36 21a452 452 0 0 1-65 46 173 173 0 0 1-52 20c-3 2-37 7-56 7a274 274 0 0 1-57-7c-10-2-19-4-32-9-11-3-12-3-20 0a303 303 0 0 1-83 22c-30 0-45-5-67-21-43-30-53-93-22-126 4-4 26-25 31-28 4-3 4-4 4-11 0-12 6-20 28-41 10-11 11-12 11-32l-1-19-3-11a126 126 0 0 0-18-44l-8-17c-19-36-24-70-13-90l3-8c0-3 14-18 22-24 9-7 29-16 32-15h4c5-3 19-5 33-6 17-1 16-1-6-5a485 485 0 0 1-76-19 331 331 0 0 1-60-21 594 594 0 0 1-84-40 321 321 0 0 1-58-41l-1 62v62l6 3c11 5 15 25 6 33l-3 4 5 5c6 7 6 15-3 49-7 24-9 57-4 61 11 12 41 16 66 11a133 133 0 0 0 63-32c7-6 14-7 17-3v9l-2 6-3 9a187 187 0 0 1-14 27l-5 9a152 152 0 0 1-107 62l-12 2-1 9c0 9-3 14-9 14-3 0-5 2-3 3l3 6 3 6 2 3 18 35c3 3-1 32-5 42l-4 18a824 824 0 0 1-15 64 4349 4349 0 0 1-19 90c4 8-12 18-17 10zm25-70-1 2 1 1v-3zm-5-24 3-13 1-4 2-10 3-14 3-14c4-11 5-16 7-28l4-17 2-8 2-9 2-4-9-18-9-18-5-11c-13-25-12-32-12 90 0 113 0 109 6 78zm-21-84v-99h-3c-2 0-3 1-5 5l-4 8-3 7-7 16c-7 11-11 21-11 24l2 17 4 14a436 436 0 0 0 16 73 465 465 0 0 0 8 40c3 6 4-8 3-105zm298 105c39-5 81-25 166-80a719 719 0 0 1 59-36l35-20c36-21 94-52 114-60 6-2 7-3 8-7 2-4 7-9 13-11 8-3 18-14 13-14l-27 9a1301 1301 0 0 0-97 52 296 296 0 0 1-31 16l-4 3-2 1-15 8a9507 9507 0 0 1-152 85c-10 5-20 4-20-2 1-2 8-9 10-9l6-2 8-4c7-2 6-5-2-7-31-9-86-39-127-70-11-8-17-5-41 20-18 19-25 49-14 69l4 9a100 100 0 0 0 58 47l24 4 14-1zm201-7a203 203 0 0 0 55-13c16-6 41-20 59-35a1024 1024 0 0 1 39-30l16-13c8-7 15-13 18-19l10-13 4-4-4-1h-33l-5-5c-11-12-1-29 22-36l9-4c5-4-11-5-16-1l-30 15a1210 1210 0 0 0-126 69 1542 1542 0 0 0-89 55c-32 20-32 20-25 23 24 10 64 15 96 12zm-470-11c-1-1-1-1-1 1v1l1-2zm-134-62-2-6-8-27c-1-4-2-6-8-12-18-18-34-45-41-71l-5-13c-4-8-10-51-10-69a252 252 0 0 1 14-77c5-17 30-59 42-71 7-7 7-8 10-22l1-7c2-2 5-15 5-15-1-1-34 29-40 37a220 220 0 0 0-55 113 246 246 0 0 0 12 131c10 29 35 68 60 90 17 16 25 22 25 19zm517-6c10-6 10-11-1-11l-6-2-9-3a267 267 0 0 1-43-17 20922 20922 0 0 1-29-14l-13-8c-10-5-38-26-47-35-12-11-13-11-15-1-2 8-6 4 28 29a338 338 0 0 0 135 62zm288-16 7-6 4-3 4-3 7-4 5-4 24-18-28 1c-2 0-3 1-3 2l-7 10c-13 14-16 18-17 21-3 7-1 8 4 4zm-233-17c32-19 30-17 26-22a88 88 0 0 0-29-24l-13-7a260 260 0 0 1-19-8 301 301 0 0 1-35-10c-34-5-76-19-88-29-8-7-17-8-22-3l-12 13c-16 16 6 39 62 66a13845 13845 0 0 1 60 27l27 8c14 5 17 5 43-11zm-581-40 2-9 2-6c4-25 40-60 68-66 12-3 11-2 13-36 2-35 3-32-10-35a103 103 0 0 1-76-86l-2-9-1-5-3 4a188 188 0 0 0-34 70c-4 10-6 17-6 21l-1 10c-2 6-2 57-1 60l5 25 2 6 2 6a195 195 0 0 0 35 67 2898 2898 0 0 0 5-17zm638 2a167 167 0 0 1 27-22 146 146 0 0 1 33-15l9-3 8-3 3-1 6-2 3-1c3 2 41-16 47-21 5-4 7-54 3-84a465 465 0 0 0-12-66l-5-16-6-14-4-10-4-7-3-5-4-6-4-6c0-4-31-36-47-47a114 114 0 0 0-30-16l-7-2c-4-3-47-3-53 0l-5 2c-18 0-87 62-87 77l-1 2-7 13-1 3c-1 1-3 2-3 4l-7 20a190 190 0 0 0-12 47l-3 17c-2 5-4 78-3 96 1 10 2 11 18 14a660 660 0 0 1 61 16c15 0 63 32 72 47 2 4 3 3 18-11zm-121-68c-17-5-33-14-33-19 0-6 5-7 13-3 22 10 19 10 43 10 21 0 35-2 35-5l2-1 9-3c7-3 7-3 9-1 15 13-48 30-78 22zm173 0c-20-5-33-12-33-19s2-7 12-3a617 617 0 0 0 20 9 130 130 0 0 0 65-8c9-5 17 0 11 7-11 12-49 19-75 14zm-48-27c-2-3-4-47-2-65l1-11 7-7c12-11 11-18-1-21-3-1-7-2-9-4-7-4-17-5-21-1-1 2-5 4-8 5l-8 3h-8c-7-1-7-9 0-11l11-5 11-3 4-2c2-3 19-1 25 3l4 2c20 4 25 25 10 39-6 5-6 8-6 47l-1 32h-4c-2 1-4 0-5-1zm-121-9c-17-5-27-12-27-19 0-5 9-5 16 1 6 5 17 6 14 1-6-11 13-25 25-17 7 4 9 7 8 15l-1 6h5l9-4 5-4 5-2c4-3 9-1 9 3-1 15-44 28-68 20zm174 2-25-12c-11-8-7-16 5-10 16 9 19 9 17 1-1-6-2-6 2-10 14-13 33-8 32 9l-1 7 5-1 7-2c15-12 28-8 14 4l-10 6-7 4c-6 4-30 6-39 4zm-98-122-30-11c-12-5-22-4-32 2l-6 4v-4c0-18 29-23 58-11 4 2 14 4 19 4 7 0 10 2 10 7 0 9-8 12-19 9zm43 0-4-4v-6c0-4 2-5 12-7l18-5c16-8 42-6 50 5 3 4 3 14-1 11-8-8-23-11-32-6a121 121 0 0 1-28 11c-4 1-12 2-15 1zm-38-27c-14-2-27-9-27-13 0-5 8-8 17-4 12 5 47 5 63 1l16-3c5 2 5 6 1 10-8 8-44 12-70 9zm5-34c-12-3-11-12 2-11l32-1c9-1 14 6 7 11-3 2-35 3-41 1zm223 290 39-2c10 0 10 0 19-5 13-9 9-10-8-2-5 3-23 0-31-5-6-3-21-5-29-3l-11 2c-6 1-22 9-26 12-5 6 1 6 47 3zm57-26 7-3 6-2 6-2 5-2 8-3 8-4 3-2c0-1-6-1-11 1l-12 3-17 4c-10 3-20 2-32-5l-14-6-10-4c-9-4-28-1-28 5 0 2 10 8 17 9l9 3 8 3 4 1 8 3 13 4c7 3 8 3 12 0l10-3zm-1-23 23-6c50-13 46-10 54-32l5-13 2-6 7-19 2-5 2-5 2-5c0-3 2-10 5-14l1-6 2-4 7-12 10-17c6-6 6-6-13-20a1038 1038 0 0 1-38-29c-1-1-2 0-5 3-10 9-41 31-46 31-8 0-34 26-48 49a301 301 0 0 1-36 44c-27 27-31 36-10 25l12-5 5-2 4-1c3 0 16-10 24-17 9-9 12-11 19-10 12 3 16 9 16 24 0 11 1 12 9 7 7-4 7-5 6-28-1-32 12-67 25-67 4 0 6 8 3 12-12 13-13 19-14 52-1 35-1 37-13 43a467 467 0 0 0-18 10l-9 4-11-2-17-4c-15-3-25 7-11 12l8 3 4 2 12 5c11 5 14 5 20 3zm-739-18c1-1 0-9-3-43-2-28-1-96 2-112l9-40c3-9 3-10-3-16l-6-6-26 1c-28 1-29 1-33 9-1 4 1 21 4 27l2 8 2 10a742 742 0 0 1 0 163c2 1 51 0 52-1zm307-19c-3-48-5-63-16-83-30-59-38-86-30-105 13-33 62-30 62 4 0 14-11 25-22 22-7-1-9-11-2-12 16-2 12-23-4-23-24 0-29 30-11 65l8 18c2 8 17 35 18 34l3-14c5-30 5-28 12-53 4-13 11-29 18-41l3-7-3-6c-32-45-95-32-104 23-4 18 7 52 27 85l9 21c10 30 11 31 11 57 1 27 1 26 10 30 12 4 12 5 11-15zm339 1v-5c-1-1-1 1-1 5 0 7 1 7 1 0zm85-4c0-8-1-9-8-7-14 4-18 11-6 11l7 2c6 2 7 1 7-6zm-460-31c-3-21-9-36-28-74-13-25-13-27-17-42-4-21-2-39 6-54 5-11 5-11-2-7-31 20-34 63-8 107a381 381 0 0 1 22 47l7 27 2 10 2 12c1 8 1 8 4 8h8l5 2v-12l-1-24zm-239 29c46-9 76-30 98-69 8-13 7-14-3-8-27 17-71 24-102 15-18-5-17-5-16 5l2 32c1 31 0 29 21 25zm696-15c4-1 5-5 0-5-3 0-8 3-8 5l2 1 6-1zm-75-7c3-4 4-8 4-16l3-14 7-17 19-40c19-39 23-58 15-79a53 53 0 0 0-87-21c-11 10-11 11-4 23 8 13 10 15 9 9-2-20 25-36 46-26 26 13 27 47 2 89l-9 17-6 13-4 8v30c-1 32 0 33 5 24zm-337-24v10-10zm372-14 12-19c7-12 17-25 26-33 8-7 8-5 12-33 4-24-7-49-26-62-8-5-8-5-3 3 4 6 10 23 11 34 2 13-5 36-20 66a656 656 0 0 0-29 62c-1 4 9-7 17-18zm-39-47 9-18c10-19 12-26 12-42v-13l-6-6c-10-10-30-6-30 6 0 5 2 7 11 11s7 11-3 13c-5 1-6 1-15-5l-4-2 2 4 4 15 5 14 6 27c2 12 2 12 9-4zm249-5a1792 1792 0 0 0 82-61l-20-17a1159 1159 0 0 1-73-57c-37-32-34-33-61 27a243 243 0 0 1-15 30l-5 12c-3 3 0 6 27 27l32 25c25 19 24 19 33 14zm-145-18 11-6c10-5 21-13 29-21l5-5-4-4c-6-6-6-7 5-29l3-8 6-13 7-14 4-9 2-4c1-2 3-8 7-13l5-11 2-2v-1l3-9 5-10c0-3 7-5 8-1l2 2 8 3c7 5 8 5 10 1l9-20c6-11 7-18 2-15a1316 1316 0 0 1-62 32 1628 1628 0 0 1-106 36l-10 2-42 8c-7 1-10 4-4 4a345 345 0 0 1 47 11c10 3 27 16 33 25 8 11 9 13 9 15l2 6c3 5 4 37 2 45-2 6-1 9 2 5zm232-49c0-2-4-4-6-3v2c2 2 6 3 6 1zm-6-28 27-26a1115 1115 0 0 0 90-94 452 452 0 0 0 62-92c5-9 11-25 15-45l5-20c7-14 7-54 0-68-6-13-24-32-30-32l-5-3c-14-10-68-26-85-26-12 0-30 8-42 18a171 171 0 0 0-37 61l-3 8c-2 3-4 23-3 27 1 1 2 1 7-5 26-27 41-37 46-28 2 3-1 7-9 14-16 13-31 29-41 44a480 480 0 0 0-49 101l-12 25-24 55c-11 24-12 21 10 39a20974 20974 0 0 1 64 50c6 5 8 5 14-3zm-974 0-1-2c-1 0-1-1 2-3 4-3 4-8-1-11-7-3-57-3-61 0-7 8-1 15 15 17 6 1 45 0 46-1zm359-6a205 205 0 0 1 72-57l10-3 7-2a182 182 0 0 1 76 9c3 1 7 2 8 4l13 9c8 6 35 31 40 37 3 5 4 1 4-24l-1-28c-4-4-48-27-58-30-26-7-52-29-56-48-2-5-7-1-7 5l-2 4-5 8c-6 12-16 19-43 30a192 192 0 0 0-26 12 128 128 0 0 0-28 13l-5 4-4 4v28c0 30 0 32 5 25zm-17-25c1-19 0-21-4-15l-8 10c-4 6-6 8-9 8-4 1-6 3-2 5 3 1 13 7 17 11 6 6 6 5 6-19zm274 7c7-3 7-2-3-14-11-13-11-13-11 6 0 17 1 17 5 14l9-6zm-374 4-5 1c-1 1 0 1 4 1 5 0 5 0 1-2zm446 1h-2c-1 0-1 1 1 1 1 0 2 0 1-1zm-705-14 3-119v-193c0-162 0-169-2-170-5-2-27 0-30 2-1 1-2 478-1 480h30zm667-6h-4c-1 1 0 1 2 1s3 0 2-1zm-348-12a371 371 0 0 0 18-55l2-6 1-5a541 541 0 0 0 24-86 436 436 0 0 0 12-48 508 508 0 0 0 11-43 303 303 0 0 0 7-32l2-14a354 354 0 0 1 9-40 17778 17778 0 0 1 9-57 289 289 0 0 0 8-45l2-12 1-12 2-7 1-10 3-15a3251 3251 0 0 1 15-147l2-19-37-1h-37l-1 8-4 26-4 19a153 153 0 0 1-7 27 189 189 0 0 1-5 20 501 501 0 0 1-39 98 445 445 0 0 1-41 80l-5 9-6 11-10 17-4 6-3 7-5 8-6 10a412 412 0 0 0-24 41l-4 4c-2 6-4 8-8 14l-6 8-4 6-5 8-7 11-13 19a980 980 0 0 1-94 112c0 1 10 9 12 9a604 604 0 0 0 137 59 284 284 0 0 0 54 15l15 3 8 2 10 2c10 3 11 3 14-5zm-36-47c-10-8-11-22-4-36l3-8c0-4 13 10 16 17 7 19-3 37-15 27zm-111-22c-10-6-12-17-8-38 1-8 3-8 10-1 18 19 17 50-2 39zm157-71c-9-3-8-20 3-35 9-12 12-15 12-9l2 5c10 13-3 44-17 39zm-90-5c-12-1-16-35-6-44 2-2 15 10 15 14l2 6c5 8 0 26-6 25l-5-1zm59-94c-6-8 1-28 13-39 6-5 6-5 6-2l2 7c3 4 3 24 0 29-5 8-17 11-21 5zm-3-93c-13-3-9-25 7-43l4-4c3 0 7 16 7 26v9l-6 6c-4 4-7 7-8 6h-4zm81-27c-11-5-6-26 9-41 4-4 5-4 6-1 5 10 6 28 3 33-5 7-13 11-18 9zm-15-104c-7-7-4-25 6-35 8-9 9-9 10-5l3 11c4 15 2 26-7 31-6 2-8 2-12-2zm43-112c-8-9-2-31 11-41l3-3 2 4c2 3 4 10 5 19 2 15-13 29-21 21zm272 580 15-4 7-2 9-2a227 227 0 0 1 23-5l11-3a460 460 0 0 0 93-34 188 188 0 0 1 17-8l2-2a495 495 0 0 0 50-26c7-3 7-5 0-12a303 303 0 0 1-34-36 260 260 0 0 1-27-34 179 179 0 0 1-13-16l-3-4-5-7-5-8-4-4-3-5-2-4-3-4-6-9-6-8-2-4-3-4-6-10a331 331 0 0 1-38-60l-1-3-2-4-4-8-4-5-2-3-2-5-10-17-5-8-5-9a167 167 0 0 0-10-18 5810 5810 0 0 0-26-51 245 245 0 0 1-21-47l-3-4-2-4-3-9-3-8-1-3a305 305 0 0 1-17-52l-9-37-3-15c-2-4-5-25-4-27 2-6 0-7-39-7h-36l1 4 2 21a1966 1966 0 0 0 14 137 1113 1113 0 0 1 14 96l2 9a371 371 0 0 1 9 54l2 9 2 8 2 12a284 284 0 0 0 8 41 1075 1075 0 0 0 27 107 276 276 0 0 1 7 30l1 5 4 9a345 345 0 0 0 13 45 831 831 0 0 0 24 74l13-2zm7-54c-8-8-3-30 9-42 5-5 12 10 11 26 0 16-11 25-20 16zm112-21c-8-8-3-26 9-37l7-7 2 5 3 9v18l-1 2c3 8-14 17-20 10zm-160-74c-7-6-6-35 1-43l12 12 4 7c12 16-4 37-17 24zm101-1c-12-2-12-26 0-38 7-6 11-9 12-6 6 18 1 47-8 45l-4-1zm-72-95c-6-6-8-33-3-36l1-3c0-4 2-3 7 2 7 7 11 15 10 20-1 4-1 4 1 3 3-2 4 0 4 7 0 11-12 15-20 7zm10-96c-6-7-8-11-7-19 0-7 5-24 7-24l10 14 2 2 2 2 2 7c8 14-5 30-16 18zm-83-27c-4-4-7-11-7-19 0-7 4-22 6-22s10 7 10 9l2 3c2 1 3 3 3 5l3 5c10 13-4 31-17 19zm14-99c-8-4-10-23-4-41l2-4 5 4c9 6 15 19 15 30 0 10-10 16-18 11zm-36-111c-12-4-14-8-14-23 0-6 0-12 2-15l1-7c0-3 2-2 9 4 16 15 18 46 2 41zm77 576-6-20a2850 2850 0 0 1-28-84l-9-6c-21-15-67-31-97-34-11-1-13 1-12 9l2 11c3 35 22 58 56 69 31 10 50 21 87 53 4 3 7 4 7 2zm-298-10c26-23 42-31 90-50 27-11 51-58 42-81-2-6-56 5-80 17-31 15-35 20-42 43a632 632 0 0 1-19 62l-4 13c-3 9 0 8 13-4zm-287-93c7-6 7-5-23-37l-16-16-5-6v32l10 10c20 20 28 24 34 17zm855-13c7-4 9-7 13-16l6-16c4-7 4-8-1-6-4 2-38 12-46 13-7 2-6 3 7 16s13 13 21 9zm-834-3 5-7c7-9 7-10-27-45-12-12-24-25-29-34-11-16-14-15-14 4v15l7 9c22 28 58 64 58 58zm523-19a632 632 0 0 0-13-47 464 464 0 0 0-12-49l-5-25a1204 1204 0 0 1-29-154 1077 1077 0 0 1-14-104 621 621 0 0 0-7-54 1190 1190 0 0 0-7-73v-13h-11c-6 0-11 1-11 2v497l12 2a246 246 0 0 1 96 30c4 4 4 2 1-12zm-215 3c17-8 29-12 47-16 10-3 17-4 36-6l7-1v-498h-9c-10 0-9-3-11 23a2045 2045 0 0 1-14 125l-1 15-1 14a2594 2594 0 0 0-17 98 1618 1618 0 0 1-32 161l-6 24a1073 1073 0 0 0-15 59c-4 11-3 12 3 8l13-6zm-279-22 27-34 3-4-16-15a587 587 0 0 1-108-132c-2 0 0 96 3 100l7 10c12 18 71 84 75 85l9-10zm776 3c45-11 63-21 66-35 3-20 1-21-29-10l-31 9-22 6-13 4c-7 0-7 2 0 12 14 19 12 18 29 14zm-930-28-3-2 6 6-3-4zm898-11a431 431 0 0 0 81-24l7-2c6-1 6-1 4-15l-2-26-1-15a541 541 0 0 0-122 17c-9 3-14 5-13 8l1 8c2 13 30 53 35 51l10-2zm-899-32v-25l-5-8-13-20-7-12-15-29a366 366 0 0 0-17-36l-1-5a382 382 0 0 1-23-61c0-3-4-5-10-5-5 0-29-12-32-16-4-5 0 11 4 19l2 5c0 1 1 7 4 12a223 223 0 0 1 8 22l5 13a304 304 0 0 0 15 34l2 6a425 425 0 0 1 21 40l2 4 7 12 7 12 2 3 5 7 4 7c0 3 33 46 35 46v-25zm197 12 5-5c2-1 4-6 6-19 1-4 0-5-10-15a459 459 0 0 1-38-40 515 515 0 0 1-79-111l-11-23-7-13-1 5-1 34v28l6 11c16 31 23 40 70 97 18 21 53 57 56 56 1 0 3-2 4-5zm814-2c2-2 3-5 3-16a160 160 0 0 1 28-94c19-33 60-54 89-45 7 2-11-18-21-23-16-8-59 15-78 42-27 39-36 84-26 134 1 4 2 4 5 2zm-776-51 18-30a1317 1317 0 0 1 44-74 1645 1645 0 0 1 32-61 676 676 0 0 0 36-80 351 351 0 0 0 30-95c8-31 11-49 9-49-14-3-136-1-136 2l-1 3-4 11-5 14-14 44a750 750 0 0 0-19 66c-10 31-20 77-19 82l4 8 3 6 4 8c11 21 22 102 15 113-1 1-6 41-5 42 1 2 1 2 8-10zm-22 3c4-17 6-31 6-55v-26l-25-23a347 347 0 0 1-66-77l-8-11c-5-10-6-10-11-6a174 174 0 0 1-32 15 195 195 0 0 0 24 48 646 646 0 0 0 102 131c7 8 9 9 10 4zm624-8c-4-42-2-78 6-103a124 124 0 0 1 16-37c6-8 6-10 1-25l-5-17a478 478 0 0 0-19-79 5323 5323 0 0 1-17-59 749 749 0 0 0-22-63l-2-2h-64c-76-1-72-2-66 20l3 11a610 610 0 0 0 71 195 751 751 0 0 0 35 65 1380 1380 0 0 0 50 85c11 19 14 22 13 9zm30 0a487 487 0 0 1 108-18c18-1 16 1 20-14 4-17 5-17-15-16a539 539 0 0 0-124 21c-7 1-7 2-7 15 0 12 2 16 5 15l13-3zm-867-18 1-17c0-6-1-8-3-13a398 398 0 0 1-38-84c-4-12-7-15-19-17l-7-1 1 5c1 6 6 21 10 29l5 13a621 621 0 0 0 45 89c4 8 5 7 5-4zm873-28c46-11 67-14 102-15l30-1 5-8 19-28c16-9-81-21-126-15-50 6-51 7-53 52-1 22-1 22 7 19l16-4zm-800-19-2-1v1l1 2 1-2zm-73-89-10 2a107 107 0 0 1-21 3l2 8c2 6 3 10 18 41 12 27 11 29 11-15v-39zm215 54-5-19-4-16c0-2-14-19-29-37l-24-29c-15-21-16-22-22-10-4 9-4 13 3 23a637 637 0 0 0 69 82c9 12 13 13 12 6zm836-19c8-5 13-8 24-11 14-4 11-6-11-11l-21-5a294 294 0 0 0-153 3c-16 3-21 7-24 18l-2 6 2-1a333 333 0 0 1 153 1c22 6 24 6 32 0zm-716-33-1-1-1 1 1 2 1-2zm561-6 15-4 3-1v-110c0-95 0-110-2-111-2-2-98-2-99 0-1 1 5 21 9 31a189 189 0 0 1 8 23 583 583 0 0 1 19 64 3101 3101 0 0 0 14 53 16467 16467 0 0 0 13 56c1 4 0 4 20-1zm-920-6c21-3 32-12 15-13l-20-3a107 107 0 0 1-30-201c11-6-25 0-39 7-18 9-42 29-49 41l-4 7a117 117 0 0 0-2 101c3 7 6 11 17 24 29 32 67 45 112 37zm974-3 2-16a2763 2763 0 0 1 15-114 1076 1076 0 0 0 11-86c-1-1-47-2-49 0-2 0-2 208-1 217l22-1zm-756-12 2-10a3585 3585 0 0 0 25-92 1494 1494 0 0 1 25-79c10-29 22-26-90-25h-96v4c-1 12 0 15 10 19 17 7 26 22 20 34-1 3-1 4 4 8l4 5c0 1 4 3 9 4 17 5 26 21 28 52l2 12c1 4 4 8 12 19l13 16 25 31c5 6 7 6 7 2zm-108-16c22-11 28-15 32-19l5-4v-14l-1-18-3-13c-1-11-5-28-6-29-1-2-11-5-12-3-3 3-4 12-1 14 10 10 11 22 3 32l-5 7 2 5c7 17-3 34-22 36-14 2-14 2-14 6 0 6 12 6 22 0zm-90 2-7-2c-22-5-34-17-36-37l-5-16c-3-8-4-32-1-36 1-1 2-3 1-6-3-13-2-23 3-33l4-14c2-14 4-18 12-23 9-7 11-8 22-10 13-3 12-5-5-5-35 0-63 17-79 50-28 54 12 126 75 133 9 1 16 0 16-1zm93-17-2-1-1 2c1 2 3 0 3-1zm-44-1c29-1 39-4 41-12 3-11-6-13-46-13-35-1-36-1-38-6-2-8-2-8 42-7l40 1 3-4c7-8 7-14 2-18l-4-5-41-1c-44-1-42-1-42-6 0-9 0-9 23-9l40 2h19l2-4c4-8 3-12-3-17l-5-4-21-1-37-2-15-1-1-4c-2-9-2-9 33-8l34 1c4 1 7-2 7-7s-5-10-12-12l-6-2-11-2-13-1-11-2-19-2c-14-2-20 0-30 6-5 4-5 3-8 22 0 4-2 8-3 10-4 5-5 19-3 27 2 5 2 7 1 10-5 12-4 29 1 35 2 3 3 5 3 11 0 20 12 28 43 26l35-1zm3-158-1-6c0-8-1-8-15-9-22 0-29 9-9 13s26 5 25 2zm206-31-4-11a573 573 0 0 1-19-58 333 333 0 0 0-11-38l-3-8c-1-7-4-19-6-22l-2-10a617 617 0 0 0-16-67c-5-24-5-25-12-21l-14 3c-7 0-12 2-13 2-1 2-2 228 0 230h100zm150-1 2-2-4-16c-10-59-32-125-62-186a5314 5314 0 0 0-63-118c-15-26-46-73-48-73v5c8 32-1 96-17 132l-9 21a1483 1483 0 0 0 67 238c5 1 133 0 134-1zm89-1a472 472 0 0 1-6-59l-2-15-1-9-2-18-2-19-1-12-2-12-1-13a404 404 0 0 1-9-56 1189 1189 0 0 1-8-53 1123 1123 0 0 1-12-68c-3-9-5-17-7-34l-4-18-2-6c0-4-2-17-5-25l-3-14a968 968 0 0 0-27-108 674 674 0 0 0-21-72l-8-27c-3-12-5-14-11-13a524 524 0 0 0-99 26l-8 2c-5 3-19 8-21 8l-8 3-8 3-10 4-10 3-14 7a355 355 0 0 1-49 21l-9 6c-7 3-7 5 4 16a844 844 0 0 1 145 196l10 18a216 216 0 0 1 13 21l4 6a1244 1244 0 0 0 41 76l5 12a52248 52248 0 0 0 28 60 916 916 0 0 0 18 45l1 7 6 17 5 19a211 211 0 0 1 10 38 267 267 0 0 1 5 38c1 3 75 2 75-1zm-35-36c-13-13-18-30-12-38 11-15 26 5 21 27-3 14-4 16-9 11zm-47-117c-14-18-13-38 2-38 10 0 15 13 10 33-2 14-5 15-12 5zm19-99-10-11-2-6c-2-4-4-13-3-20 0-3 8-7 11-6 12 3 17 25 10 40-3 6-3 6-6 3zm-84-26c-15-19-18-33-10-42 12-11 25 15 19 35-4 11-5 12-9 7zm9-98c-10-10-13-16-12-29 1-9 3-11 9-11 12 0 18 13 13 30l-2 12c-1 4-3 3-8-2zm-79-97c-6-20-3-33 8-37s18 18 9 28l-2 5c0 2-7 10-10 12-2 1-3 0-5-8zm104 1-5-6-3-5c-12-17 0-36 14-24 9 8 9 40 0 40-1 0-4-2-6-5zm-5-24c-1-2-1-1-1 2s0 4 1 3v-5zm-165-49c-1-1-2-7-2-16v-15l5-4c2-3 5-5 7-5l4-1h2l3 3c3 4 5 14 3 17l-2 6c-2 11-15 21-20 15zm118-18c-12-12-11-39 1-44 9-3 17 8 15 21-2 7-9 22-11 22l-2 2c0 1-1 1-3-1zm197 473c2-178 2-400 0-401l-9-2a233 233 0 0 1-85-25c-14-8-14-8-8 12a939 939 0 0 1 16 70 369 369 0 0 1 8 32 1128 1128 0 0 1 15 78l4 19 9 54a2127 2127 0 0 0 14 86l1 14 3 22a3160 3160 0 0 0 13 123c1 11 1 11 10 11l9-1zm37 92 1-13a1169 1169 0 0 1 9-89 4301 4301 0 0 0 15-119 1113 1113 0 0 1 19-116 418 418 0 0 1 11-46 771 771 0 0 1 20-91l10-38c4-15 3-17-4-11a239 239 0 0 1-90 28l-12 3c-1 1-2 490-1 492h22zm87-4a261 261 0 0 0 5-26l4-15a158 158 0 0 1 8-38l1-5 4-13 5-13 1-6 2-5c3-6 5-11 5-14l1-4 5-10a289 289 0 0 1 12-28c5-13 8-19 9-19l1-3 3-6 3-5 3-7a344 344 0 0 0 12-24 185 185 0 0 0 10-22l4-6 4-6 13-24a1157 1157 0 0 1 70-114l2-5a381 381 0 0 0 29-40l13-18a1460 1460 0 0 0 36-45 326 326 0 0 1 37-39c0-2-2-5-5-5l-3-2a308 308 0 0 0-59-28 116 116 0 0 0-21-8l-6-3-11-4-12-5-4-1-10-3-10-4-8-2-8-3-5-1c-3 0-24-5-27-7a215 215 0 0 0-39-10c-14-5-20-4-21 0l-5 18a287 287 0 0 0-14 42 24191 24191 0 0 1-45 169 624 624 0 0 1-13 68c-2 3-4 14-6 27l-2 11-3 17-2 16-3 13a323 323 0 0 1-5 31l-3 15-1 10-1 10a312 312 0 0 0-8 56 1186 1186 0 0 0-7 51c-2 15-8 93-6 96l35 1 35-1zm-48-35c-5-18-2-38 5-40 8-3 9-3 13 0 9 7 2 32-12 43l-4 3zm45-117c-7-22-3-37 10-37h7l2 6c3 11 0 23-9 33-7 7-8 7-10-2zm-14-99c-6-15-3-34 6-39 5-3 12-3 12 1l2 3c2 2 3 10 1 13l-3 5c-6 14-16 23-18 17zm81-29-2-11c-2-10 5-28 11-28l4-1c6-4 12 11 9 21-5 18-22 32-22 19zm-8-94c-8-24 3-50 17-40 2 2 3 26 1 26l-3 4c-1 4-6 9-12 13-1 1-2 1-3-3zm78-94c-5-6-7-8-10-15-4-8-1-22 6-25 14-5 22 19 13 39-3 8-3 8-9 1zm-105-1c-2-5-3-27-2-27l1-3c0-12 21-13 23-1 3 16-19 45-22 31zm172-72c-17-18-19-44-4-43s22 23 12 41c-3 7-3 7-8 2zm-113-18c-2-1-10-13-10-15l-2-5c-2-4-2-15 2-20 12-19 29 6 19 29-6 12-5 12-9 11zm61 563a770 770 0 0 0 47-145 11406 11406 0 0 1 14-66c2-8 2-8 0-10-3-3-9-15-13-24a741 741 0 0 0-6-22l-2-11c-6-20-6-58-2-84 6-36 5-42-4-29a834 834 0 0 0-45 77 1101 1101 0 0 0-121 289c-4 11-5 24-2 25h134zm204-11v-11l-7-2c-17-5-22-11-21-27l-1-10c-2 0-10-8-10-10s-5-4-10-4c-10 0-19-16-22-42-4-25-1-20-41-70l-14-18c-2-4-3-2-4 7a418 418 0 0 1-12 51 292 292 0 0 0-10 38 323 323 0 0 0-10 34l-2 6-3 8-3 7-1 6-2 6-2 6-2 6c0 1-1 5-3 7-3 8-8 22-7 23l94 1 93-1zm42 11c4-1 4-1 4-8v-7l-13-2-16-2c-4 0-4 0-3 10 1 8 1 8 5 9h23zm-906-115v-113h-10c-12 1-12 1-12 13a2649 2649 0 0 0-26 192c-3 10-4 20-2 22h50zm1015 108c28-7 62-42 71-72 23-81-50-157-137-142-26 4-34 15-11 15 31 0 63 16 84 41 18 21 27 64 20 92-5 18-21 45-31 50l-10 8-10 7c-8 4 7 5 24 1zm-41-9c85-30 66-167-24-174-10-1-14 1-6 2 16 4 25 13 28 29l5 19c5 14 5 25 3 34-2 6-2 8-1 12 2 7 0 21-4 30-3 6-4 10-4 16 0 15-18 31-36 32-12 1-11 4 1 4 14 1 28 0 38-4zm-31-15c5-3 14-12 14-16l2-10c0-4 1-10 3-13 3-6 4-18 1-26-1-4-1-6 1-10 3-6 2-22-2-33l-3-11c0-9-8-21-17-25-9-3-84 0-93 4-9 5-12 12-7 18l2 3h37c40 0 44 0 44 8 0 5-3 5-43 6l-39 1-4 4c-5 5-5 13-1 18l3 3h40c44 0 43 0 44 8 0 6 0 6-42 6h-38l-4 4c-5 5-5 8-1 13 5 8 11 9 45 10 32 0 37 1 38 6 2 7-1 8-38 7l-32-1-3 4c-6 7 2 14 17 17l23 3c30 5 45 5 53 2zm-119-58 2-8 2-7-4-4c-7-6-6-20 2-31 4-5 4-6 0-10-3-4-3-9 0-15l2-8c0-6 13-14 26-15 7 0 8-1 8-3 0-12-47 9-56 25-3 5-3 21 0 35a429 429 0 0 1 7 35c4 6 11 10 11 6zm-28-86c5-7 5-7-15-36-20-28-30-40-54-64-16-15-16-16-15-10 6 32 15 51 32 69a509 509 0 0 1 40 47l7 7 1-4c0-3 2-7 4-9zm100-15 13-2c2-1 1-490 0-492l-15-1h-15v248c0 224 0 249 2 248l15-1zm-77-5c7-4 23-11 26-11 7 0 7-2 2-11a5641 5641 0 0 1-33-58 571 571 0 0 0-98-119c-3 1-7 40-7 68v14l18 18a386 386 0 0 1 74 88c10 17 9 17 18 11zm232-21a254 254 0 0 0-17-50c-3-5-5-11-5-13l-3-6-2-4-10-23a843 843 0 0 1-22-44 393 393 0 0 0-34-56l-25-37c-7-7-9-8-9-2l1 24 1 19 13 22a823 823 0 0 1 69 146l3 7 17 8c10 4 18 9 19 10 2 3 5 2 4-1zm-188-33c1-34 1-39-5-50a640 640 0 0 0-122-148c-5 0-14 19-14 29v7l10 11a622 622 0 0 1 78 93 52868 52868 0 0 0 37 61l8 14 4 8 3 7 1-32zm74 17 13-3 8-2c1-2-28-68-32-71-2-1-2 55-1 70 1 8 2 9 12 6zm54-8c0-5-8-24-13-36l-6-15-23-47c-24-46-25-47-24-20l1 17 6 12 11 23a859 859 0 0 0 27 59c4 9 4 10 11 11 12 1 11 1 10-4zm-978-3c38-6 41-7 47-18 5-9 5-11 1-10a390 390 0 0 1-173-11c-2-2-3-2-9 3-7 5-26 15-29 15-4 0-1 4 4 6 37 15 111 22 159 15zm-171-32c18-6 34-17 47-31a133 133 0 0 0 28-47c6-9 12-63 9-82-5-27-11-26-13 3a157 157 0 0 1-11 53c0 35-52 82-93 83l-14 1 18 18c7 5 16 6 29 2zm188-5a313 313 0 0 1 35-5l7-2v-5l3-11c4-11 7-45 4-48l-13 3c-43 11-77 15-123 14-18 0-20 0-21 2-3 8-15 25-20 31-7 8-7 8-4 9a541 541 0 0 0 132 12zm594-12v3-3zm-790-22c8-3 15-8 20-13a121 121 0 0 0 24-33c8-13 11-18 13-26 11-43 11-42-17-16-12 11-21 15-27 10-4-4-2-7 12-17a259 259 0 0 0 75-112 492 492 0 0 1 22-49 366 366 0 0 1 23-52 246 246 0 0 1 14-27c1-2-8-9-54-45a779 779 0 0 1-36-28 864 864 0 0 0-141 143 300 300 0 0 0-67 133c-10 28-9 69 4 85 24 32 105 60 135 47zm1031-7-1-49v-45l-9-11a16017 16017 0 0 1-48-56c-9-12-24-26-26-26s-13 13-33 39l-6 9 15 14a480 480 0 0 1 58 64 674 674 0 0 1 49 66l1-5zm-874-28c54-5 86-13 88-21 2-10-3-22-8-21a6651 6651 0 0 1-47 9c-14 3-34 5-61 5s-26-1-29 13l-3 11-1 5c1 1 46 1 61-1zm7-43a414 414 0 0 0 73-13c12 0-3-35-26-62l-4-4-14 3c-30 6-57 13-77 21-12 4-12 5-10 13l1 25-1 18h3c6 1 37 0 55-1zm866-64c0-23-1-23-42-66-15-16-17-16-23-10-10 11-11 8 14 36a2079 2079 0 0 1 50 55l1-15zm-908-8a653 653 0 0 1 74-21c1 0-9-15-16-22l-4-5-20 5a1091 1091 0 0 0-40 12c-17 4-24 18-18 32 3 6 1 6 24-1zm908-47c0-10-1-14-3-17-3-6-31-30-34-30-2 0-11 9-11 10l17 18 23 24c9 10 9 10 8-5zm-913 1 11-3c11-2 35-10 36-11 1-2-20-24-23-24-10 1-16 5-19 12l-6 17c-6 11-5 13 1 9zm436-10c0-13-3-27-10-41-10-19-14-23-39-33-41-16-57-26-91-57-6-6-6-5 0 13a465 465 0 0 1 12 41 542 542 0 0 0 18 51l10 6c32 20 53 27 92 31 8 1 9 0 8-11zm48 8c9-1 18-4 27-8l14-5c3 0 29-15 35-20 8-6 8-6 12-19l6-22c10-29 19-63 19-66 0-4-1-3-19 14-21 20-28 24-87 51-22 10-36 34-38 64-1 17-2 17 31 11zm-36-48c5-13 27-39 32-39l9-3 8-3 2-1 6-3 12-5 9-3 4-2 3-2 4-2 3-2 6-3c2-3 5-4 6-4 2 0 6-4 8-7 1-3 2-53 0-53l-20 21a162 162 0 0 1-38 29c-11 7-22 11-29 11l-6 1a199 199 0 0 1-51-2c-9-1-19-5-23-8l-4-2a157 157 0 0 1-52-43c-5-6-5-6-6 9-1 33 2 45 10 45l7 4c7 5 21 12 23 12l7 3 8 3 5 2 3 2 8 3 7 3c2 0 12 8 18 15 3 2 8 10 11 17 7 14 7 14 10 7zm-409-28 11-5a267 267 0 0 1 40-17 409 409 0 0 1 67-26l10-4 12-4a500 500 0 0 1 62-16c12-2 16-5 8-5a117 117 0 0 1-46-14l-4-3-9-8c-3-2-7-7-9-11l-6-10a78 78 0 0 1-4-64c2-7 5-14 7-15v-6l-2 1-11 6-10 5-10 7-16 12-6 6 6 5c4 4 5 5 4 7a107 107 0 0 0-8 15 415 415 0 0 0-23 48 314 314 0 0 0-14 28l-6 13c-4 12-6 15-10 15-3 0-13-8-13-11 0-4-5-2-8 3a519 519 0 0 0-23 54l11-6zm428-55 5-2 15-5 4-1 5-2 6-5c4-2 12-8 30-25a157 157 0 0 0 38-53l3-7 1-5 6-13 3-9 9-28c5-18 8-56 8-105 0-37 1-35-14-35a157 157 0 0 1-43-8 209 209 0 0 1-44-15c-20-9-36-22-52-40l-3-4-4 5-11 12c-7 7-21 18-31 23a569 569 0 0 0-21 11l-8 3-15 4-19 4-21 4c-22 2-22 3-23 51v44a310 310 0 0 0 8 44 334 334 0 0 0 23 66 108 108 0 0 0 16 27l26 30c12 12 30 25 34 25l13 5 8 2 5 2c2 2 39 2 43 0zm-36-52c-7-3-13-7-13-10 0-4 9-6 12-3 2 2 26 1 30-1 9-5 15 3 7 8-11 7-25 10-36 6zm54-30a115 115 0 0 0-42 0h-39c-5 1-5 1-7-2-5-6 0-11 10-11 5 0 8-1 9-2 4-2 17-3 19 0s17 3 19 0c0-1 2-2 8-2s9 1 10 2c1 2 4 2 10 2 9 0 12 2 12 8 0 7-1 8-9 5zm-117-17-5-1c-6 0-13-11-10-16 1-2 2-1 5 2 4 5 20 5 30 0a55 55 0 0 1 15-7c9-4 28-5 31-2 5 5-4 14-16 16l-14 3c-3 2-9 3-12 3l-7 2c-1 2-16 2-17 0zm134 0c-10-4-18-6-26-7-20-2-21-3-21-11 0-6 2-8 12-8 7 0 21 3 21 4l1 1c3 0 10 4 11 5l3 1 3 2c1 3 22 2 27-2s6-3 6 2c0 11-21 18-37 13zm-64-31-4-1-10-4c-6-3-10-5-12-8l-4-4 3-3c4-3 6-3 10 0l5 3 9 3c9 4 10 4 21-1 16-7 23-8 23-2 0 7-30 19-41 17zm28-15-1-1-1 1v2l2-2zm-46-32c-2-2-2-4-2-8 3-25 2-51-2-60-3-5-2-7 2-9 10-5 13 8 13 50 0 29-3 36-11 27zm-61-32c-8-1-15-7-15-15 0-7-2-7-13-2-10 5-14 5-16 0s22-19 32-19l6-2a74 74 0 0 1 36 5l3 2c3 1 16 13 16 15 0 4-9 5-14 1l-9-3-6-1v6c-2 9-9 14-20 13zm156-5c-5-4-5-6-5-10 0-6-2-7-12-1-8 4-10 4-14 1-4-5 15-20 28-21 4 0 7-1 7-2h18l6 2 8 1 8 4c5 2 15 11 15 14 0 5-6 5-17 0-9-4-11-4-12 3-1 5-1 6-7 10-7 6-16 5-23-1zm-212-41c-3-4 7-15 15-15l2-1c0-4 32-12 44-11a103 103 0 0 1 32 7c7 0 21 10 21 15s-10 6-15 2l-4-2-7-3c-16-8-48-5-72 6-14 6-13 6-16 2zm274 0-4-2-6-2-6-3-5-1c-14-7-48-5-68 4-10 5-16 4-16-3 0-1 7-8 9-8l6-3c8-6 42-10 58-7 13 2 22 5 23 8l4 2c3 0 13 7 14 11 2 4-6 8-9 4zM498 611l-1-1-1 2 1 1 1-2zm0-13a1846 1846 0 0 0 35-76l3-4c5-5-17-28-45-46l-17-14c-20-17-15-18-47 5l-37 26c-30 22-29 18-1 40a1062 1062 0 0 1 63 51l18 13 14 11c8 7 9 7 14-6zm507 1 6-8c4-4 4-5-1-8l-7-5c-5-6-6-3-6 12 0 18 2 20 8 9zm-264-1-1-23c-1-1-17 11-17 12l3 3 7 7c6 8 7 8 8 1zm-37-19c14-4 24-10 33-22l6-7-11-22c-12-22-23-56-27-79-2-11-3-11-7 1l-14 30c-21 41-18 70 6 70 16 0 25-23 9-24-6 0-11-11-5-13 10-6 27 9 27 23 0 26-36 37-55 16-19-20-16-38 14-96 10-19 13-29 16-47 2-15 2-50 0-51h-1l-6 7c-5 4-5 5-5 14-1 22-14 59-31 87-24 38-24 78-2 101 11 11 37 17 53 12zm350 0c24-2 36-12 44-36 4-12 4-43 0-48-2-1-3-4-3-5l-6-14c-21-39-28-55-33-73-5-21-5-22-4-73v-7h-15v16l1 47 1 30 5 14c5 14 11 25 19 39 26 43 24 82-5 92-23 8-46-9-41-31 3-16 29-27 29-12 0 3-5 8-8 8s-6 5-7 10c-1 11 15 18 26 11 15-10 15-28-3-63a403 403 0 0 1-21-43l-2 10a469 469 0 0 1-27 80c-11 22-12 20 1 32 12 11 26 18 35 17l14-1zm66-26c14-16 17-52 6-78a364 364 0 0 1-9-18c-21-33-33-71-35-110l-1-12-5-4c-9-7-9-7-10 17-1 40 4 63 22 96 31 56 37 84 22 112-5 10-1 8 10-3zm-492 7-3-7c-9-22-3-61 12-87 19-31 32-65 32-79 0-5-7 2-14 14a865 865 0 0 1-32 52l-10 20c-15 32-13 62 7 83 5 5 8 6 8 4zm769-4c3-2 3-8-1-12-3-4-57-4-61-1-2 2-2 10-1 13 3 4 58 4 63 0zm92-16 12-11a228 228 0 0 0 66-103c4-9 5-15 7-24l2-14a249 249 0 0 0-29-154c-16-27-33-47-58-67-7-6-10-7-7-2l2 8c1 13 5 24 8 27a192 192 0 0 1 43 67c24 43 18 144-12 196-11 19-18 29-30 43-3 4-4 7-8 23l-3 7c-5 12-3 13 7 4zm-92-17c3-4 4-12 2-17-2-3-2-6-2-8l-2-8c-8-23-10-114-4-175 2-17 2-19-4-18l-26 1h-21v7l1 21c4 43 6 86 4 111-3 34-4 42-12 71-3 9-3 10 1 15l3 3h58zm-854-39c7-8 26-21 38-26 11-5 38-24 38-28l6-10 13-20c7-10 24-31 40-45 14-13 21-25 13-24l-17 6-11 6c-8 4-12 7-22 17-19 17-24 19-35 10-8-7-10-10-9-22 0-12 0-12-8-6l-5 5-1 26c-1 33-4 44-15 56-10 12-17 5-9-8l4-10 2-3c4-4 5-16 5-40-1-32-2-30 28-49 10-5 17-5 28 0l9 3 6 2c7 4 22 2 20-3a59 59 0 0 0-21-13c-1-2-25-13-28-13l-25 6-11 3-6 2-3 1c-4 0-25 5-28 7-2 1-4 4-6 9l-5 11-4 10-4 10a488 488 0 0 0-15 41 137 137 0 0 1-8 21l-9 17-5 6-4 5 5 5a565 565 0 0 0 41 33c11 10 11 10 18 2zm954-7a232 232 0 0 0 16-27l6-14 2-5c4-7 8-20 10-31l4-14a351 351 0 0 0-3-77c0-5-2-11-3-13l-2-8-2-7-3-7-2-5-2-4c0-3-12-24-17-32-3-3-5-8-6-10-4-8-5-4-9 15l-4 17-3 6-3 7-5 9a97 97 0 0 1-54 40l-12 4-1 13-3 43c-1 10-2 9 12 11 29 2 61 31 71 64 3 10 6 26 5 28s0 5 2 5l6-8zm-481-1c1-6 0-10-2-5-2 4-2 9 0 9l2-4zm204-86 11-5 5-2c5-3 37-10 49-10 14 0 33 6 42 12 4 2 4-57 0-64-3-5-29-3-44 3l-11 5c-25 9-49 32-63 58-5 8-4 13 1 10 1-2 6-4 10-7zm-599-37c1-1 1-2-2-1-5 0-6 0-5 1 1 2 5 2 7 0zm7-11c6-4 8-7 4-7l-9-3c-12-5-14-4-13 8l1 8 5-1c3 0 8-3 12-5zm79 1-1-2-1 2 1 2 1-2zm1-6-2-2-1 2 1 3c1 0 2-1 2-3zm-24-18 19-8a2337 2337 0 0 0 268-143c29-16 42-20 46-16 5 4 0 9-16 16-11 5-14 7-9 8 40 14 93 42 130 71 12 8 32-3 49-27l5-7c18-21 3-68-30-94-46-37-98-27-206 43a1404 1404 0 0 1-102 62 607 607 0 0 1-64 35l-60 29c-12 4-14 6-14 11s-6 12-11 13l-6 3-5 1c-2 0-4 2-2 4 1 1 0 2 8-1zm411-7 11-13 4-5-5-5a350 350 0 0 0-160-82c-9-2-10-2-33 10-24 13-41 23-36 23a635 635 0 0 1 35 8c35 5 105 33 156 62 21 12 19 12 28 2zm-65-5c1-1-4-5-8-6l-37-16a223 223 0 0 0-39-14l-51-13c-3 0-1 2 5 7 21 19 43 29 83 36 42 8 46 8 47 6zm-348-6 5-3c0-3-20-13-33-17l-7-3-3-2-4-1c-5-4-26-6-31-3l-6 2-7 3-5 2-13 4-12 5-4 2c-3 3 0 4 6 2l17-4 20-5c8-2 10-2 19 2l9 4c9 3 27 12 29 14s14 1 20-2zm96-4c21-6 67-33 63-37-1-1-16 6-42 20l-27 14c-10 4-6 6 6 3zm580-106c0-107-1-112-9-68-1 6-2 14-4 17l-3 13-3 14-2 9-2 7-8 37c-2 12-2 15 0 15s11 14 12 18c1 5 12 28 14 30 4 5 4 0 5-92zm21 93 8-16c7-17 11-24 17-31 5-5 5-11 1-22l-3-11-3-12-4-13a285 285 0 0 0-10-44 323 323 0 0 0-9-38c0-6-2-8-3-3v189c1 2 5 3 6 1zm-683-4 19-8a1283 1283 0 0 0 178-97c30-20 39-25 63-38 24-14 26-17 10-18l-24-2a822 822 0 0 0-106 6l-12 3a408 408 0 0 0-105 66c-10 8-11 9-12 16-1 9-4 15-10 19-6 5-5 5 4 6 19 0 26 10 19 24-5 10-21 18-30 17-10-1-8 5 2 8l4-2zm430-1c4-9 4-9-4-15a356 356 0 0 0-77-49 282 282 0 0 0-64-27l-13-4-7 3c-10 5-9 7 6 11a216 216 0 0 1 45 17l5 2 25 11c25 13 46 27 72 49 7 7 9 7 12 2zm-455-13 9-2c18-4 23-6 27-11 7-8 5-9-23-7l-40 2c-25 1-32 2-40 7-10 6-8 7 5 4 10-3 17-3 22 0l14 5 4 2c2 2 15 2 22 0zm-24-29 12-3c10 0 11-1 15-5l9-7c6-2 11-8 9-10l-12 5-13 6-5 2-5 2c-1 0-5 1-7 3l-10 3c-6 1-8 2-7 4h14zm442-148h-3l2 1c2 0 2-1 1-1z"/><g fill="#000007" fill-rule="evenodd" stroke-opacity="0"><path d="M1016 468c-2 0-3 3-3 4-1 3-2 6-1 8s3 1 4 0c1-3 2-7 1-11l-1-1zM888 468c-2 0-4 3-2 4s4-1 4-3l-2-1zM706 334c-2 0-2 3-2 5 0 1 2 3 4 1 1-1 1-6-2-6z" style="paint-order:markers fill stroke"/><path d="M706 340c-2 0-2 3-2 5h3c1-2 2-5-1-5zM619 351l-6 1c-1 1 0 3 2 3 3 1 6 0 8-3 0-2-2-1-4-1zM668 1504l-2 2 1 2h3l-1-3-1-1zM422 1446c-1 0-3 1-3 3l2 2c1 0 3-1 3-3 1-1-1-2-2-2zM405 1591c-1 0-2 2-1 3l3 1c1-2 0-4-2-4zM332 1744c-2 0 0 2 0 3 2 2 3 4 6 5v-3c-2-2-3-4-6-5zM634 1956c-1 0-3 1-3 3l5 1 5-1-1-2-6-1zM706 2136h-1v14h2v-1a62 62 0 0 0 0-12l-1-1s0-1 0 0zM385 2407l-1 2v2l1 1 2-1-1-3-1-1zM383 2429l-2 1v4h2l1-2v-3h-1zM1035 2184l-1 3v8h2l1-9c0-1 0-2-2-3zM1370 2001c-1 0-3 1-2 3s4 4 6 3 2-2 1-3c-1-2-3-3-5-3zM1082 1957l-2 1v2h4v-2l-2-1zM1043 1937l-3 1 1 2h3l3-1-1-2h-3zM1096 965l-1 2v3l3-1-1-4h-1zM708 758l-1 1v7h2l1-2v-5l-1-1h-1zM497 609l-2 2 1 3c1 1 2 1 3-1 1-1 1-3-1-4h-1z" style="paint-order:markers fill stroke"/></g><g fill="#c58c35" fill-rule="evenodd" stroke-opacity="0"><path d="M1088 97c-24 0-46 8-67 18-44 20-84 48-125 73-36 22-71 44-108 62-25 13-50 26-76 37-4 3-10 4-13 9 0 4-2 9-5 12s-9 4-13 7c-2 0-7 0-7 4 1 2 3 4 6 2 21-7 41-17 61-26l76-40 80-44 50-29c18-10 36-20 55-28 4-1 10-4 14-1 2 1 2 4 0 5-8 7-18 9-26 15-2 1-1 4 1 4a467 467 0 0 1 130 70c3 3 8 4 12 3 12 0 21-9 29-17 7-7 12-16 18-24 6-9 5-20 4-31-7-34-33-64-66-76-10-4-20-5-31-5z" style="paint-order:markers fill stroke"/><path d="M968 183c-5 3-11 4-14 8-1 3 3 4 5 5l43 16c11 5 22 8 33 14 28 13 54 32 78 52 3 2 6 6 10 5 3-2 5-7 6-11 1-5-5-7-8-10-21-18-45-32-69-45l-38-19-16-5c-10-5-20-7-29-10h-1zM455 445c-8 1-14 8-22 12-20 15-41 29-61 45-3 3-8 8-4 11 11 12 25 20 37 30l60 49c9 5 16 12 25 18 4 1 5-4 7-7 9-18 17-37 27-55l14-32c-1-8-9-13-14-19-16-16-36-28-53-43-5-3-9-9-16-9zM445 710c-8-1-15 5-18 12-3 9-8 18-10 27 1 4 6 0 9 0 14-5 29-7 43-14 4-2 0-6-2-8-6-6-12-13-19-17h-3zM390 802c-4 3-5 10-5 14-3 21-4 42-11 61-2 9-3 18-8 26-12 22-32 39-54 50-13 6-28 9-43 8-2 0-4 2-2 4 7 7 13 15 22 20 9 4 18 1 27-2 24-8 43-26 57-46 7-9 14-19 17-30 8-21 9-44 9-66 1-13 1-27-7-38l-2-1zM511 786c-32 6-64 13-94 26-5 1-8 5-7 10 3 15 1 30 2 46l21 1c37-1 73-6 109-14 6 0 7-7 6-12-5-19-17-35-29-50-2-3-4-6-8-7zM549 906l-57 12c-30 5-61 5-92 6-3-1-7 1-8 4-7 13-15 24-24 35-2 5 5 5 8 6l66 11c23 0 45 0 68-2 11-2 23-2 34-6 3-7 4-16 6-24 2-13 4-26 3-40l-4-2z" style="paint-order:markers fill stroke"/><path d="M357 974c-11 6-22 14-35 19-3-1-4 3-1 5 11 7 24 9 37 12a359 359 0 0 0 161-1c10-2 15-12 18-20 0-5-7-2-9-2a429 429 0 0 1-171-13zM520 1020c-7 2-13 4-19 4-4 2-9 1-13 3-2 5-1 11-2 16v200l1 15c2 2 6 1 9 1h89c3 1 4-2 3-4-9-27-19-54-27-82l-8-30c-4-16-10-33-13-50l-15-66c-1-2-2-7-6-7zM516 1272H394c-2 3-1 7-1 10-1 5 1 10 6 13 11 5 24 13 26 26 1 5-3 9-2 14 5 7 13 12 22 15 14 6 19 22 22 37 2 11 0 25 8 35 16 20 32 41 50 60 2 2 4-1 4-3 7-32 16-63 25-94 9-34 20-67 32-100 1-3 2-8-2-10-7-4-16-2-23-3h-45zM317 1283c-14-1-27 1-38 7a93 93 0 0 0-49 67c-3 20 1 41 10 59 16 30 48 51 82 51 3 0 7 1 9-1 0-4-5-3-8-4-14-3-28-12-33-26l-7-29c-3-9-2-19-2-28 1-5 3-9 2-14-3-10-1-21 3-30 4-10 4-20 8-28 8-11 20-17 32-19 2-1 8-1 7-4-4-2-9-1-14-2h-2zM755 732c-4 1-3 5-2 8a2062 2062 0 0 1 34 151c6 30 13 61 17 91l16 95 5 40 15 135c0 3 1 8 4 8l15-1 1-12 1-430-1-50c-1-5-7-4-10-5-27-3-53-11-78-22-6-2-11-7-17-8zM982 731c-6 2-9 6-15 8-17 8-35 14-54 19-13 2-26 3-38 6-2 4-1 8-1 12l-1 211v264c1 2-1 6 1 8h22c2-4 1-9 2-14 5-63 13-125 21-188 5-35 10-70 17-104 4-26 9-51 15-76l20-89 13-51c0-2 1-6-2-6zM1397 802c-3 1-1 7-2 10l1 39c25 39 47 80 65 122 7 17 12 34 20 50 4 7 12 7 18 11 7 3 15 7 22 12 4 1 3-5 2-7-5-20-13-39-21-58 0-6-5-11-6-16a819 819 0 0 0-91-156c-2-3-4-7-8-7zM1299 700c-4 1-9 5-11 9 0 5 5 7 7 11l39 40c3 2 4-3 4-6-1-8 0-17-4-25-9-11-20-20-32-28l-3-1zM1252 749c-14 15-26 32-39 48 1 4 5 6 8 9 21 20 42 42 61 64l41 55c4 6 7 13 13 18 3-2 0-7 1-10l-1-91c-16-21-33-41-51-61-9-11-19-23-32-32h-1zM1398 950c-3 2-1 6-2 10-1 22-2 44 1 65 1 5 8 3 11 2l21-4c3-3 0-8-1-11a588 588 0 0 0-30-62zM1188 863c-4 2-3 8-4 11-4 24-5 49-4 73 19 19 40 37 57 58 16 19 31 39 43 61 4 4 9-1 13-2 8-5 18-9 28-11 4-2 1-8-1-11a686 686 0 0 0-129-178l-3-1zM1208 1050c-3 3-3 8-4 11l-11 51-22 77c-3 7-6 14-7 21l-8 24c-3 7-7 15-8 23 2 4 8 2 11 2h177c3-3 1-8 2-13-1-3 2-11-3-12-8-2-19-4-24-12-4-8-1-18-3-26-5-3-8-7-12-11-5-4-14-2-18-9-11-15-11-35-15-53-5-14-16-24-25-36l-29-37h-1zM1416 1066c-2 0-7 1-5 4 8 3 18 5 24 12 9 10 9 25 13 37s5 24 2 36c-2 7 1 13 0 20 0 9-3 16-6 24-3 9-1 19-8 26-7 10-19 15-31 16-3 1-8 0-8 4 5 3 12 2 18 2 13 1 28-1 40-7 29-14 47-46 46-78 1-17-3-34-11-49a84 84 0 0 0-74-47zM1358 540c-8 0-16-1-23 3-3 3-4 10-1 14 5 3 12 2 18 3 15 0 30 1 44-2 7-4 4-16-4-16-11-2-22-2-34-2zM1370 296l-31 1c-1 24 3 49 4 74 2 43 3 87-9 129-1 6-4 12-4 18 1 4 4 8 8 9h58c6-6 6-16 3-24l-5-19c-5-30-5-61-5-91 0-29 2-57 4-85 0-4 1-9-2-12h-21zM1492 219c-4 1-4 7-5 10-2 12-4 25-11 36-6 13-15 25-26 33-13 11-30 17-45 22-2 7-2 15-3 22 0 14-3 28-2 43 1 4 7 3 11 4 26 2 47 20 61 41 11 16 15 34 16 53 0 2 3 5 5 2 12-15 21-32 28-49 6-14 10-29 13-44 4-13 2-27 3-41a180 180 0 0 0-11-70c-3-6-4-13-8-18a329 329 0 0 0-26-44z" style="paint-order:markers fill stroke"/><path d="M1481 161c-3 1 0 5 0 8 3 12 4 27 14 36a228 228 0 0 1 44 73c10 27 10 56 9 84-2 38-11 77-32 110-7 13-17 24-25 36-6 10-6 22-11 32-2 2-3 8 1 7 9-6 16-14 24-21a241 241 0 0 0 68-230 233 233 0 0 0-87-133l-5-2zM1314 318c-20 0-39 7-57 17-22 13-41 33-52 56-1 3-1 8 3 8 12-7 25-15 39-18 23-6 49-9 71 0l10 5c3-4 2-10 2-14 1-16 2-33-2-49-1-7-9-5-14-5zM1355 96c-3 2-2 8-4 12l-15 69c-5 18-10 36-12 54-1 5 4 6 6 10 10 13 13 30 23 44 1 2 4 0 4-3 2-29 1-59 1-88 0-32 1-64-1-97 0 0-1-2-2-1zM1374 90c-3 1-1 7-2 10v182c0 4 7 6 9 1 8-15 13-33 25-46 6-8 1-19-2-28l-19-80a505 505 0 0 1-11-39zM1180 1272c-11 0-23-1-35 1 2 14 8 26 12 39 20 58 36 118 49 178 2 4 1 10 4 14 8 1 15-2 23-3 5-2 12-2 16-6l-1-215c0-3 0-8-4-7-21-2-43-1-64-1zM1300 1504c-22 0-44 1-66 8-10 3-24 3-31 12-3 5-6 10-6 15 4 1 9-2 14-2 44-8 89-8 133 2 11 1 21 6 32 5 9-2 16-9 26-12 5-3 12-3 16-8 0-4-6-4-9-6-29-6-58-15-88-14h-21zM1264 1543c-22 0-44 1-64 8-10 3-15 14-16 23-1 14-2 28-1 41 2 6 9 2 13 1 36-10 74-16 111-17l33-2c7-14 16-26 26-39 0-4-6-4-9-6a330 330 0 0 0-93-9zM1435 1534c-20 1-38 13-53 25-25 23-40 56-45 89-2 22-2 45 3 67 4 3 8-1 8-5 4-29 3-60 18-86 9-16 18-32 32-44 17-14 39-23 61-21 2 0 8 3 9-1-5-9-13-16-21-22l-12-3zM1317 1653c-43 2-85 7-125 20-4 1-7 4-6 8 3 20 16 36 28 51 3 3 6 9 12 7 33-7 65-17 97-29 7-2 3-11 3-16-2-13-1-27-3-40-2-2-5-1-6-1zM1315 1773l-53 16c-4 3 2 7 4 10 6 6 12 14 20 17 8 0 15-5 19-12l12-28c0-1 0-3-2-3zM1245 1914c-8 1-11 10-15 16-13 25-24 52-36 78 4 8 13 13 20 19l61 47c3 3 8 3 11 0l83-61c4-3-3-6-4-8-35-28-71-55-105-84-4-3-9-7-15-7zM1063 2198c-21 5-40 17-60 26-47 23-92 49-137 75-44 25-86 52-132 72-5 2-13 6-17 1 5-10 18-11 27-18 2-4-6-6-9-7-37-13-71-33-104-55-10-5-19-15-30-18-13 1-21 13-29 21a67 67 0 0 0-19 71c13 32 42 58 76 62 44 4 84-16 121-36 48-28 95-60 143-87 45-26 91-51 138-73 8-5 11-14 20-18 5-4 14-8 15-15l-3-1z" style="paint-order:markers fill stroke"/><path d="M609 2242c-4 1-4 7-5 10-2 6 5 9 9 13 31 23 64 47 101 61 16 6 32 13 48 16 6 1 13-2 15-8 1-5-6-6-10-6-19-5-38-13-57-21-20-9-40-20-59-33-13-9-25-20-37-30l-5-2zM354 2222c-6 1-6 8-8 11l-20 40c-6 10-2 22 0 33a1619 1619 0 0 0 31 121c2-27 1-53 2-80l-1-124-4-1zM375 2222c-4 2-3 7-4 10v187c1 2 0 7 3 6 3-5 3-12 5-18l5-22 12-52 8-34c0-5 3-10 4-15-9-15-16-31-24-47-2-5-4-11-9-15zM524 2102c-11 6-22 13-35 16-25 8-52 9-77 2-5-1-9-4-13-2-2 4 0 9 0 13 1 17 0 34 3 51 0 4 5 6 9 5 30-4 60-14 82-36 14-13 25-28 33-46 1-1 0-3-2-3zM370 1991c-12 0-24-1-35 3-7 3-7 13-5 20 2 14 7 26 8 39 4 36 3 72 2 108l-3 46c-1 4 5 3 8 3 15 0 29 1 44-1 4-2 2-7 2-11-4-43-5-87-3-131 2-20 8-40 13-60 1-7-7-11-11-17l-20 1zM362 1958c-9 0-19-1-28 3-5 2-5 10 0 13 12 8 27 5 41 5 7 0 14 1 20-1 2-1 0-3 0-4 4-2 7-8 3-11-6-5-15-4-23-5h-13zM249 1956c-6 3-11 9-17 14-17 16-33 34-46 54-10 15-18 31-23 49-5 13-7 27-10 40a253 253 0 0 0 12 123 260 260 0 0 0 82 111c1 1 5 3 6 0l-11-35c-3-7-9-12-13-18-17-19-29-42-36-67-3-9-7-18-8-28-5-24-8-49-4-73a237 237 0 0 1 40-106c5-9 12-16 18-23 6-8 5-19 9-27 1-5 3-9 2-14h-1z" style="paint-order:markers fill stroke"/><path d="M239 2015c-4 3-6 7-9 11-7 9-12 19-16 30l-7 14c-4 9-6 19-9 28s-4 18-5 27l-1 53c5 15 6 30 11 45 4 11 8 22 14 32 6 11 11 21 19 30 1 1 4 2 4-1 3-9 3-19 7-28 3-10 8-21 15-29 12-16 28-30 48-37 5-3 12-3 16-8 3-7 2-16 3-23 0-12 2-25 1-37-1-4-5-6-9-6-24-5-45-21-60-41-11-14-15-31-19-48l-2-12h-1zM848 1272c-6-1-10 3-10 8l-19 176c-17 109-37 217-65 323-1 8-6 16-5 24 9-1 16-8 25-11 27-12 56-16 85-20 2-21 1-42 1-63v-436c-3-2-9 0-12-1zM886 1272c-4 1-14-2-13 5l-1 484c0 5 0 13 7 12 35 4 71 13 102 31 2 4 8 0 5-4a2674 2674 0 0 1-87-491c-1-12 0-26-3-38l-10 1zM210 1486c-3 1-1 6-1 8 3 9 7 17 9 26 10 27 22 53 33 80a760 760 0 0 0 79 127c1 2 5 4 5 0v-48c-12-18-23-37-33-55l-24-51-13-32c-4-11-9-23-12-35-4-6-12-4-18-7a115 115 0 0 1-25-13zM395 1766c-2 6-1 12-1 18 0 5-2 11 0 16 12 10 21 22 35 29 6 3 12-2 15-7 0-6-6-10-10-15l-38-40-1-1zM395 1587c-3 2-1 7-2 10 0 29 0 58 3 87 4 10 13 19 20 28 19 24 39 48 62 70 4 3 6-3 9-5 11-14 23-28 33-43a779 779 0 0 1-121-144c-1-1-2-3-4-3zM332 1503l-28 5c-3 2 0 7 0 10 7 20 17 39 26 58 0 2 4 4 4 0 2-18 1-37 1-56-1-5 1-11-1-17h-2zM448 1465c-12 4-24 12-36 16-4 2 0 7 1 9 20 47 50 88 81 126 15 18 30 36 47 52 2 3 6 2 7-2 7-26 6-53 6-80-19-20-41-39-60-60l-44-60-2-1z" style="paint-order:markers fill stroke"/></g><g fill="#cf2b2a" fill-rule="evenodd" stroke-opacity="0"><path d="M903 116c-34 0-70 1-100 19-33 17-63 38-91 62-9 8-6 21-15 29-3 2-7 8-1 8 9 0 24 1 25 13-1 17-20 27-36 26-6 2 1 9 4 10 7 2 13-5 19-6 77-34 149-78 220-122 16-11 35-18 49-31 2-6-7-5-10-6-21-2-43-2-64-2zM715 604c-4 3 2 10 2 14l27 89c8 12 23 16 35 23 24 13 52 21 80 19 5-22-4-45-16-64-14-18-37-22-56-32-27-12-48-31-70-49h-2zM1019 604c-14 9-25 23-40 32-23 16-51 25-75 40-21 16-30 43-29 68 0 9 11 7 17 6 34-5 67-18 95-39 11-11 12-29 17-43 6-21 14-41 17-63l-2-1zM374 536c-13 8-24 20-35 30a755 755 0 0 0-148 176c-16 27-23 58-30 88-4 24-4 53 12 73 24 22 55 34 86 42 23 7 51 4 68-14 16-16 28-36 36-57 3-12 8-24 7-36-4-4-9 4-13 6-10 8-19 21-33 23-4 0-7-5-3-8 19-16 37-32 51-52 23-33 35-72 52-108 13-31 27-60 42-90-9-13-24-21-36-31-18-14-35-30-54-42h-2zM459 751c-17 6-36 7-51 18-8 7-10 23-2 31 13 0 25-7 38-9 19-7 39-10 57-17 3-4-4-9-6-14-4-5-8-11-13-15l-23 6zM543 867c-32 3-64 13-96 12-12 2-26-1-38 4-5 7-6 16-8 24 1 7 11 4 15 5 42-1 84-3 125-15 7-2 13-8 11-16 0-5-2-15-9-14zM1277 720c-6 4-12 10-14 17 6 12 18 20 26 30 15 17 29 35 46 50 4-2 1-9 2-13 1-13-2-26-12-35-14-17-29-35-47-48l-1-1zM1206 811c-7 4-9 13-12 20-1 7-5 16 3 21 53 56 102 118 135 188 5 4 3-12 4-17 0-18 3-37-1-55-16-31-38-58-60-86-20-25-41-50-67-71h-2zM1398 882c-5 2-2 11-2 16-1 15 5 30 13 43 12 26 23 52 36 77 4 6 13 7 19 4 1-10-5-19-8-29-16-37-33-74-54-108-1-2-2-4-4-3zM1442 1034c-16 1-33 2-45 11-5 6 6 8 10 8 23 1 45 8 64 21 28 18 43 52 43 85 2 17-3 34-12 49-8 18-24 29-39 41-3 1-4 6 1 5 33 2 62-20 80-46 14-18 20-41 19-63 0-53-45-100-96-109-8-2-17-3-26-2zM563 861c-2 6 1 14 1 21 3 46-8 93-28 135-1 10 4 20 5 30 12 55 26 110 44 164 7 15 8 34 17 48 46-1 92 1 137-1 3-8-2-17-3-25-12-60-31-118-58-172-32-68-68-135-111-196-1-2-2-4-4-4zM1171 860c-8 6-12 18-18 27-56 95-112 191-143 298l-15 66c-2 4 1 9 6 7l132 1c20-46 33-96 46-144 7-25 13-51 17-77-14-18-20-41-24-63-5-35-2-70 3-105-1-3 1-10-4-10zM713 1272c-36 0-73 0-109 2-8 5-7 17-11 25-20 61-40 122-53 185-4 13 6 23 9 35 17 44 21 93 12 139 0 5-3 13 1 17 6-5 9-14 14-21 26-45 54-89 78-136 23-43 43-89 60-135 10-34 20-68 26-104 1-3-1-8-5-7h-22zM1040 1272c-14 1-29-2-43 3-5 5 1 14 1 20 10 48 23 95 43 140 35 80 79 156 126 230 3 5 6-1 5-4-2-44-4-89 15-129 4-11 15-21 10-33-19-76-38-153-65-226-31-2-62-1-92-1zM273 1274c-35 2-69 23-88 53-13 23-18 51-14 77 4 24 16 46 35 62 31 31 81 40 122 25 4-1 9-8 2-10-26-4-53-9-74-26-41-32-51-95-22-138 10-18 27-29 43-41 2-2-2-3-4-3zM269 1507c-5 2 0 9 0 13 15 42 34 83 57 121 2 2 5 11 9 7v-35c-17-31-31-63-44-95-3-8-14-10-22-11zM396 1491c-4 4-1 12-2 18 0 17-1 34 1 51a640 640 0 0 0 131 163c10-7 16-20 17-32-3-10-13-17-20-25-37-38-70-80-97-126-11-16-17-34-28-49h-2zM399 1712c-7 3-4 13-5 19-2 10 1 18 8 24 17 20 35 40 55 56 6-2 11-9 13-15-2-11-13-18-19-26-18-18-34-38-51-58h-1zM1448 1570c-27 1-49 22-63 44-13 21-24 45-23 70 3 5 9-4 12-6 11-9 21-23 36-27 8-1 4 9 0 10-20 17-39 36-51 59-17 27-29 56-42 86-15 33-31 67-44 101-4 9 8 14 13 20 24 19 48 39 74 57 7 2 10-8 15-11 64-62 132-125 173-206 13-25 17-52 25-79 2-19 3-39-4-57-9-16-22-31-39-37-26-12-54-22-82-24zM1318 1608c-44 2-89 9-131 23-8 2-4 13-5 19 0 5 1 14 8 12 40-10 81-19 123-21 6-1 15 0 15-9 1-6 7-14 3-21-3-3-8-2-13-3z" style="paint-order:markers fill stroke"/><path d="M1326 1722c-28 6-54 17-82 24-4 2-12 1-14 6 5 9 11 21 21 26 18 0 36-8 54-14 12-5 28-13 27-29-1-4 2-14-6-13zM851 1785c-36 3-73 14-102 37-13 11-14 31-20 46-6 20-14 40-18 61 3 5 9-5 12-6 25-22 55-38 86-50 28-10 46-37 51-66 1-7 2-15-2-21l-7-1zM880 1784c-6-1-10 5-9 11 1 26 11 55 36 69 23 13 50 18 72 35 15 9 28 24 44 32 4-2-1-8-1-12l-29-93a244 244 0 0 0-113-42zM1041 2242c-19 4-36 16-54 24-79 40-154 87-229 135-4 1-4 6 0 7 28 12 59 14 89 14 49-2 94-24 132-54 21-18 45-33 63-55 5-7 12-13 15-21-12-2-25-1-37-1-7-6-11-16-5-24 7-11 22-13 32-20 2-4-4-5-6-5z" style="paint-order:markers fill stroke"/></g><g fill="#6b4424" fill-rule="evenodd" stroke-opacity="0"><path d="M683 1960c-28 0-51 23-55 49-3 18 4 37 10 54 8 20 21 39 28 60 5 15 9 30 9 45 1 11-1 22 3 32 5 4 11 6 17 8 5-3 2-10 3-15-1-24-1-48-8-70-13-33-33-62-39-96-4-16 1-36 17-44 12-6 30-5 39 7 8 11 5 30-8 36-5 2-15-1-13-8 6-2 14-5 14-13 0-11-14-17-24-12-13 5-16 22-13 35 4 21 15 40 23 59 4 7 7 16 13 22 4 0 2-6 4-8 4-24 8-48 18-70 4-13 12-26 17-38-11-17-28-31-48-33h-7z" style="paint-order:markers fill stroke"/><path d="M625 1975c-19 8-31 28-31 48-2 23 6 45 18 64 12 23 23 46 27 72l6 30c5 2 11 1 16 3 3-1 1-7 2-10 2-26-5-53-17-76-9-23-23-44-28-68-5-19-2-39 6-56 1-2 5-7 1-7zM1040 1959c-18 0-35 10-45 25-2 8 6 15 9 22 1 1 4 8 6 3 1-7 1-14 7-19 13-15 39-14 50 3 9 11 7 27 5 40-6 23-21 43-31 65-3 6-6 12-5 20l1 48c1 3 4 3 5 0 8-11 6-27 12-39 12-32 29-61 40-93 8-25-4-56-28-68-8-5-17-7-26-7z" style="paint-order:markers fill stroke"/><path d="M1039 1992c-9-1-18 6-15 15 2 8 13 7 15 14-3 7-12 7-18 3-2 0-6-4-9-3 6 22 15 44 18 67 0 3 4 3 4 0 9-17 18-34 25-52 2-11 2-22 2-32-6-7-13-13-23-12zM1096 1972c-3 3 2 7 3 10 6 12 11 26 9 41 1 15-7 30-13 44-11 26-26 49-35 75 0 5 5 0 6-2 19-21 30-49 52-68 10-9 9-24 11-36 3-23-7-47-26-60l-7-4zM651 2201c-8 0-12 8-17 13s-11 12-7 20c6 16 21 25 35 34 27 16 54 29 83 41l44 14c14 2 25-9 37-15 9-6 19-10 26-17 2-6-5-10-8-14-26-24-61-33-94-41-31-7-63-15-90-33-3-1-6-3-9-2zM895 257c-5 0 0 5 1 7 21 20 48 30 76 36 18 4 37 9 56 9 4 0 4-5 1-6-10-6-22-9-33-14-32-15-66-25-101-32zM937 205c-12 2-23 10-34 16-9 5-20 10-28 18 0 4 7 3 9 5 34 6 67 14 98 27 35 13 67 30 100 48 3 2 7 1 9-2 8-7 16-15 20-24-32-33-74-55-117-72-18-6-35-12-54-15l-3-1zM840 259c-6 1-11 4-16 6l-55 30c-1 1-5 2-3 4h9c13-4 25-10 37-17 10-5 21-11 29-19 1-1 2-4-1-4zM1036 323l2 93c7 24 20 46 31 68 8 14 11 30 10 46 1 18-17 33-34 32-14 0-28-12-27-27-1-12 11-22 22-23 7 1 5 11-1 13-6 1-9 8-9 14 3 12 19 16 28 8 8-5 12-15 10-25-1-19-12-35-20-52l-13-29c-1-3-4-1-4 2-7 31-15 62-30 90-2 6-7 13-6 19 5 9 13 15 21 21 9 6 19 10 29 8 15 0 32-3 42-15 11-13 15-30 14-46 0-9 2-19-3-28-15-33-36-64-43-100-3-20-1-40-2-60 1-6 1-13-8-10-3 0-7-2-9 1z" style="paint-order:markers fill stroke"/><path d="M1069 326c-4 2-2 9-3 14-1 27-2 56 10 82 14 32 36 61 40 96 2 15-4 29-9 42-1 3 2 4 4 2 14-9 22-26 22-42 3-25-6-48-18-68-19-33-30-70-32-108 0-6-2-12-8-15-2-1-3-3-6-3zM668 384c-5 2-7 7-10 10l-31 48-17 36c-8 18-11 40-4 58 4 10 11 19 19 25 1 2 4 1 4-1-2-8-6-15-6-22-3-26 4-53 17-76 11-19 22-40 28-62 1-5 3-10 1-15l-1-1z" style="paint-order:markers fill stroke"/><path d="M696 357c-3 0-3 4-5 5-4 3-8 6-8 11-1 15-4 30-9 44-6 20-16 38-26 55-11 19-17 41-13 63 2 14 9 28 20 37 12 7 27 10 41 9 10 0 19-4 28-10 8-5 14-13 20-21l-8-16c-13-25-23-52-29-80-1-4-1-9-3-13-2-2-4 1-5 3l-23 50c-5 13-9 28-6 42 2 8 8 14 15 15 9 2 18-3 22-11 2-4 2-11-3-13-3-2-7-1-10-5-2-2-3-7 1-9 7-2 14 3 19 9 4 5 6 12 5 18-1 11-12 20-22 21-11 2-22-1-30-9-7-7-12-16-12-26 0-11 4-22 8-33 8-19 19-38 27-58 9-23 8-48 8-72 0-2 1-6-2-6zM1350 573v493c0 4 4 5 7 4 8-2 17 0 24-3 3-8 1-16 2-24l-1-428v-41c-4-2-10-1-15-2l-17 1zM1352 1239c-5 0-4 7-3 11 0 4 1 9 7 9 8 1 18 1 26-1 2-4 2-10 1-15-7-3-15-3-23-4h-8zM363 1273c-6 1-18 0-19 8 6 9 19 8 28 11 3 0 13 2 11-5-1-5-1-15-9-13l-11-1zM368 1461c-7 0-15-1-21 3 0 156-1 313 1 469 1 5-2 14 5 13 9 0 18 2 25-2 4-27 2-55 3-82v-400c-4-3-9-1-13-1z" style="paint-order:markers fill stroke"/></g><path fill="#cf2b2a" fill-rule="evenodd" d="M1184 969c-3 5 1 11 2 16 5 22 15 43 31 59l44 51c4 3 4-3 5-6 2-6 10-12 4-19-19-30-41-60-68-85-6-5-11-13-18-16zM471 1439c-6 2-7 10-9 15-3 10 7 18 11 26 22 29 46 56 72 82 2 3 7 0 5-4-4-18-8-38-22-53l-52-64c-1-1-3-3-5-2z" style="paint-order:markers fill stroke"/></svg>
                        </g>
                    `,
                    black: `
                        <g>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1696" height="2528"><path d="m358 2500-2-8-3-13a1332 1332 0 0 1-21-93l-4-16-4-15-3-14-1-5-3-14-9-41c0-2 9-21 12-24l9-17c8-15 9-17 3-17-4 0-7-6-7-15 0-10-1-11-8-8-25 8-47 30-56 56l-3 9c-4 4-5 38-2 50a228 228 0 0 0 18 51c3 9-3 12-13 6l-6-3-2-2-13-10a284 284 0 0 1-72-84l-5-7-1-2c0-3-1-6-7-19l-3-8-1-4-2-6-3-8-3-10-2-14a270 270 0 0 1 2-97l3-12 2-10 2-5a138 138 0 0 1 21-48l4-7 4-6 2-4 8-9 3-4 3-4a316 316 0 0 1 55-49c19-13 33-11 23 3-4 6-6 11-14 33a109 109 0 0 0 5 80 92 92 0 0 0 18 24c7 10 42 29 47 24a196 196 0 0 0-8-72l-4-17c-2-8-1-16 3-23l4-6-3-5c-7-12-2-32 8-34 6-1 5 5 5-98v-94l-10-14a723 723 0 0 1-118-219 139 139 0 0 0-9-25l-1-4-5-15-5-13c-4-4-11-15-18-28-35-69 6-152 86-174l12-3 139-1 2-3a215 215 0 0 0 6-44l1-9 2-14 2-18 3-18 3-21a835 835 0 0 1 12-89c2-14 3-13-15-13a319 319 0 0 1-122-28c-20-9-33-19-46-36-9-12-10-13-14-13l-5-1c0-1-4-3-9-4-33-12-61-31-71-52-12-21-11-39 2-97a565 565 0 0 0 8-27l2-8 2-6 1-3a195 195 0 0 1 24-44l8-11a1022 1022 0 0 0 34-45l5-6 10-11c23-27 76-80 101-101 12-10 12-11 2-20s-10-10-3-15l7-5a948 948 0 0 1 76-55l20-14c3-1 4-1 10 4 4 3 5 3 10-4 10-12 14-21 20-37l3-7 4-13 5-14a302 302 0 0 0 12-28l3-7c5-16 10-22 27-36l41-36c16-15 24-20 36-23a397 397 0 0 0 44-18l11-5c3 0 30-19 38-27l5-4 19-14a271 271 0 0 1 102-51 377 377 0 0 1 83-4l40 1h39l18-6 20-7c3-1 17-5 30-7 33-6 73 9 96 37l9 11 9 17 8 15v16c1 17-1 29-5 34l-19 26-18 15c-4 0-12 12-9 13 3 2-10 23-14 24-1 1-4 3-5 6l-26 31c-3 2-4 5-4 8l2 17c1 16 4 31 7 37l2 6 2 8 3 8 1 4 2 3 1 3 2 4 4 9 3 7 1 1 1 3c0 2 1 2 2 3 12 12 23 60 18 77-6 21-12 32-21 41l-7 6-6 3c-8 5-31 13-45 15-6 1-7 2-1 4a237 237 0 0 1 34 8l9 2c3 2 6 2 7 2s4 0 6 2l8 2 4 2 4 1 7 2 4 2 6 1 7 3 18 6 16 6a403 403 0 0 1 63 27l7 3 17 10a189 189 0 0 1 53 36c1 0 0-139-2-141l-3-1c-10 0-16-21-9-31 3-5 3-5 1-8-5-7-7-15-5-22a220 220 0 0 0 10-42c4-14 5-61 1-65l-6-5c-2-2-4-4-6-4l-8-2c-16-7-52-3-75 8l-10 4-25 16c-15 12-22 4-13-15l2-8 2-4 4-6c1-2 2-7 4-9l3-6c0-5 29-34 42-43a133 133 0 0 1 43-19c5-2 11-3 27-4l13-1 1-8c0-8 0-8 4-10 5-1 5-5 0-15l-3-7-2-4-2-6-2-4-2-1-4-6-5-8-1-4 1-7 3-9 3-13a418 418 0 0 0 14-62 535 535 0 0 1 13-54l3-14 5-21c6-33 9-39 17-33 3 3 4 4 7 24l4 13 1 6 4 19 3 12c1 8 5 20 7 25l2 8c0 2 0 6 2 8l1 5 3 13a1606 1606 0 0 1 13 54c3 4 5 16 6 24 1 6 0 7-5 13-6 7-12 18-17 32-4 11-4 11 1 14 4 1 4 2 4 9 1 9 2 10 8 8l17-8c26-10 52-62 47-94a172 172 0 0 0-16-49c-22-47 57 6 92 61a281 281 0 0 1 32 77 303 303 0 0 1-4 136l-5 15a263 263 0 0 1-37 67 338 338 0 0 1-43 41c-1 2-28 19-32 20-7 1-11-7-7-12l4-7 5-13c5-9 6-11 6-16 2-11 2-16 4-19 3-7 0-37-5-46l-3-8-1-5-3-4c-5-9-24-32-28-32l-8-3c-12-5-17-7-22-6h-5v14a319 319 0 0 0 12 93c3 3 2 15-2 20-3 5-3 6-1 11 7 13 0 33-11 33h-4v208l5 4 19 24a509 509 0 0 1 51 80c2 0 7 10 21 39a174 174 0 0 1 10 22l4 5a3407 3407 0 0 1 43 114 160 160 0 0 1 24 52c8 7 5 48-5 72l-5 14c0 7-32 40-44 46l-10 5-7 3-7 4c-16 7-56 9-145 9-18 0-21 1-21 3a604 604 0 0 0-10 70 317 317 0 0 0-7 47 1322 1322 0 0 0-10 79l-2 16c-1 4 1 4 17 5a291 291 0 0 1 78 12c-1 1-1 1 2 1 6 0 18 4 17 5s1 1 4 1l4 2h2c2 0 8 2 29 13 7 4 25 21 32 31 3 5 6 7 10 9l6 4c0 1 3 3 8 3l9 3 3 1c3 0 18 7 26 12 10 7 12 7 16 11 16 14 29 45 27 65a247 247 0 0 1-11 57 287 287 0 0 1-52 109l-12 15a494 494 0 0 1-41 49 1541 1541 0 0 1-81 80c-22 20-21 18-10 27 10 8 11 10 5 15a2083 2083 0 0 0-51 37l-12 9-21 15c-21 15-22 16-31 12l-6-3a103 103 0 0 0-22 40l-1 4-2 6-3 7c0 3-2 6-3 8l-3 6-1 3-3 9-5 13-3 9-2 4-2 5-2 5-2 6c0 3-23 27-27 27l-3 1-8 9c-5 3-15 13-23 20a332 332 0 0 1-47 38c-23 17-41 30-46 32l-7 3-6-2c-7-4-3-6-36 21a452 452 0 0 1-65 46 173 173 0 0 1-52 20c-3 2-37 7-56 7a274 274 0 0 1-57-7c-10-2-19-4-32-9-11-3-12-3-20 0a303 303 0 0 1-83 22c-30 0-45-5-67-21-43-30-53-93-22-126 4-4 26-25 31-28 4-3 4-4 4-11 0-12 6-20 28-41 10-11 11-12 11-32l-1-19-3-11a126 126 0 0 0-18-44l-8-17c-19-36-24-70-13-90l3-8c0-3 14-18 22-24 9-7 29-16 32-15h4c5-3 19-5 33-6 17-1 16-1-6-5a485 485 0 0 1-76-19 331 331 0 0 1-60-21 594 594 0 0 1-84-40 321 321 0 0 1-58-41l-1 62v62l6 3c11 5 15 25 6 33l-3 4 5 5c6 7 6 15-3 49-7 24-9 57-4 61 11 12 41 16 66 11a133 133 0 0 0 63-32c7-6 14-7 17-3v9l-2 6-3 9a187 187 0 0 1-14 27l-5 9a152 152 0 0 1-107 62l-12 2-1 9c0 9-3 14-9 14-3 0-5 2-3 3l3 6 3 6 2 3 18 35c3 3-1 32-5 42l-4 18a824 824 0 0 1-15 64 4349 4349 0 0 1-19 90c4 8-12 18-17 10zm25-70-1 2 1 1v-3zm-5-24 3-13 1-4 2-10 3-14 3-14c4-11 5-16 7-28l4-17 2-8 2-9 2-4-9-18-9-18-5-11c-13-25-12-32-12 90 0 113 0 109 6 78zm-21-84v-99h-3c-2 0-3 1-5 5l-4 8-3 7-7 16c-7 11-11 21-11 24l2 17 4 14a436 436 0 0 0 16 73 465 465 0 0 0 8 40c3 6 4-8 3-105zm298 105c39-5 81-25 166-80a719 719 0 0 1 59-36l35-20c36-21 94-52 114-60 6-2 7-3 8-7 2-4 7-9 13-11 8-3 18-14 13-14l-27 9a1301 1301 0 0 0-97 52 296 296 0 0 1-31 16l-4 3-2 1-15 8a9507 9507 0 0 1-152 85c-10 5-20 4-20-2 1-2 8-9 10-9l6-2 8-4c7-2 6-5-2-7-31-9-86-39-127-70-11-8-17-5-41 20-18 19-25 49-14 69l4 9a100 100 0 0 0 58 47l24 4 14-1zm201-7a203 203 0 0 0 55-13c16-6 41-20 59-35a1024 1024 0 0 1 39-30l16-13c8-7 15-13 18-19l10-13 4-4-4-1h-33l-5-5c-11-12-1-29 22-36l9-4c5-4-11-5-16-1l-30 15a1210 1210 0 0 0-126 69 1542 1542 0 0 0-89 55c-32 20-32 20-25 23 24 10 64 15 96 12zm-470-11c-1-1-1-1-1 1v1l1-2zm-134-62-2-6-8-27c-1-4-2-6-8-12-18-18-34-45-41-71l-5-13c-4-8-10-51-10-69a252 252 0 0 1 14-77c5-17 30-59 42-71 7-7 7-8 10-22l1-7c2-2 5-15 5-15-1-1-34 29-40 37a220 220 0 0 0-55 113 246 246 0 0 0 12 131c10 29 35 68 60 90 17 16 25 22 25 19zm517-6c10-6 10-11-1-11l-6-2-9-3a267 267 0 0 1-43-17 20922 20922 0 0 1-29-14l-13-8c-10-5-38-26-47-35-12-11-13-11-15-1-2 8-6 4 28 29a338 338 0 0 0 135 62zm288-16 7-6 4-3 4-3 7-4 5-4 24-18-28 1c-2 0-3 1-3 2l-7 10c-13 14-16 18-17 21-3 7-1 8 4 4zm-233-17c32-19 30-17 26-22a88 88 0 0 0-29-24l-13-7a260 260 0 0 1-19-8 301 301 0 0 1-35-10c-34-5-76-19-88-29-8-7-17-8-22-3l-12 13c-16 16 6 39 62 66a13845 13845 0 0 1 60 27l27 8c14 5 17 5 43-11zm-581-40 2-9 2-6c4-25 40-60 68-66 12-3 11-2 13-36 2-35 3-32-10-35a103 103 0 0 1-76-86l-2-9-1-5-3 4a188 188 0 0 0-34 70c-4 10-6 17-6 21l-1 10c-2 6-2 57-1 60l5 25 2 6 2 6a195 195 0 0 0 35 67 2898 2898 0 0 0 5-17zm638 2a167 167 0 0 1 27-22 146 146 0 0 1 33-15l9-3 8-3 3-1 6-2 3-1c3 2 41-16 47-21 5-4 7-54 3-84a465 465 0 0 0-12-66l-5-16-6-14-4-10-4-7-3-5-4-6-4-6c0-4-31-36-47-47a114 114 0 0 0-30-16l-7-2c-4-3-47-3-53 0l-5 2c-18 0-87 62-87 77l-1 2-7 13-1 3c-1 1-3 2-3 4l-7 20a190 190 0 0 0-12 47l-3 17c-2 5-4 78-3 96 1 10 2 11 18 14a660 660 0 0 1 61 16c15 0 63 32 72 47 2 4 3 3 18-11zm-121-68c-17-5-33-14-33-19 0-6 5-7 13-3 22 10 19 10 43 10 21 0 35-2 35-5l2-1 9-3c7-3 7-3 9-1 15 13-48 30-78 22zm173 0c-20-5-33-12-33-19s2-7 12-3a617 617 0 0 0 20 9 130 130 0 0 0 65-8c9-5 17 0 11 7-11 12-49 19-75 14zm-48-27c-2-3-4-47-2-65l1-11 7-7c12-11 11-18-1-21-3-1-7-2-9-4-7-4-17-5-21-1-1 2-5 4-8 5l-8 3h-8c-7-1-7-9 0-11l11-5 11-3 4-2c2-3 19-1 25 3l4 2c20 4 25 25 10 39-6 5-6 8-6 47l-1 32h-4c-2 1-4 0-5-1zm-121-9c-17-5-27-12-27-19 0-5 9-5 16 1 6 5 17 6 14 1-6-11 13-25 25-17 7 4 9 7 8 15l-1 6h5l9-4 5-4 5-2c4-3 9-1 9 3-1 15-44 28-68 20zm174 2-25-12c-11-8-7-16 5-10 16 9 19 9 17 1-1-6-2-6 2-10 14-13 33-8 32 9l-1 7 5-1 7-2c15-12 28-8 14 4l-10 6-7 4c-6 4-30 6-39 4zm-98-122-30-11c-12-5-22-4-32 2l-6 4v-4c0-18 29-23 58-11 4 2 14 4 19 4 7 0 10 2 10 7 0 9-8 12-19 9zm43 0-4-4v-6c0-4 2-5 12-7l18-5c16-8 42-6 50 5 3 4 3 14-1 11-8-8-23-11-32-6a121 121 0 0 1-28 11c-4 1-12 2-15 1zm-38-27c-14-2-27-9-27-13 0-5 8-8 17-4 12 5 47 5 63 1l16-3c5 2 5 6 1 10-8 8-44 12-70 9zm5-34c-12-3-11-12 2-11l32-1c9-1 14 6 7 11-3 2-35 3-41 1zm223 290 39-2c10 0 10 0 19-5 13-9 9-10-8-2-5 3-23 0-31-5-6-3-21-5-29-3l-11 2c-6 1-22 9-26 12-5 6 1 6 47 3zm57-26 7-3 6-2 6-2 5-2 8-3 8-4 3-2c0-1-6-1-11 1l-12 3-17 4c-10 3-20 2-32-5l-14-6-10-4c-9-4-28-1-28 5 0 2 10 8 17 9l9 3 8 3 4 1 8 3 13 4c7 3 8 3 12 0l10-3zm-1-23 23-6c50-13 46-10 54-32l5-13 2-6 7-19 2-5 2-5 2-5c0-3 2-10 5-14l1-6 2-4 7-12 10-17c6-6 6-6-13-20a1038 1038 0 0 1-38-29c-1-1-2 0-5 3-10 9-41 31-46 31-8 0-34 26-48 49a301 301 0 0 1-36 44c-27 27-31 36-10 25l12-5 5-2 4-1c3 0 16-10 24-17 9-9 12-11 19-10 12 3 16 9 16 24 0 11 1 12 9 7 7-4 7-5 6-28-1-32 12-67 25-67 4 0 6 8 3 12-12 13-13 19-14 52-1 35-1 37-13 43a467 467 0 0 0-18 10l-9 4-11-2-17-4c-15-3-25 7-11 12l8 3 4 2 12 5c11 5 14 5 20 3zm-739-18c1-1 0-9-3-43-2-28-1-96 2-112l9-40c3-9 3-10-3-16l-6-6-26 1c-28 1-29 1-33 9-1 4 1 21 4 27l2 8 2 10a742 742 0 0 1 0 163c2 1 51 0 52-1zm307-19c-3-48-5-63-16-83-30-59-38-86-30-105 13-33 62-30 62 4 0 14-11 25-22 22-7-1-9-11-2-12 16-2 12-23-4-23-24 0-29 30-11 65l8 18c2 8 17 35 18 34l3-14c5-30 5-28 12-53 4-13 11-29 18-41l3-7-3-6c-32-45-95-32-104 23-4 18 7 52 27 85l9 21c10 30 11 31 11 57 1 27 1 26 10 30 12 4 12 5 11-15zm339 1v-5c-1-1-1 1-1 5 0 7 1 7 1 0zm85-4c0-8-1-9-8-7-14 4-18 11-6 11l7 2c6 2 7 1 7-6zm-460-31c-3-21-9-36-28-74-13-25-13-27-17-42-4-21-2-39 6-54 5-11 5-11-2-7-31 20-34 63-8 107a381 381 0 0 1 22 47l7 27 2 10 2 12c1 8 1 8 4 8h8l5 2v-12l-1-24zm-239 29c46-9 76-30 98-69 8-13 7-14-3-8-27 17-71 24-102 15-18-5-17-5-16 5l2 32c1 31 0 29 21 25zm696-15c4-1 5-5 0-5-3 0-8 3-8 5l2 1 6-1zm-75-7c3-4 4-8 4-16l3-14 7-17 19-40c19-39 23-58 15-79a53 53 0 0 0-87-21c-11 10-11 11-4 23 8 13 10 15 9 9-2-20 25-36 46-26 26 13 27 47 2 89l-9 17-6 13-4 8v30c-1 32 0 33 5 24zm-337-24v10-10zm372-14 12-19c7-12 17-25 26-33 8-7 8-5 12-33 4-24-7-49-26-62-8-5-8-5-3 3 4 6 10 23 11 34 2 13-5 36-20 66a656 656 0 0 0-29 62c-1 4 9-7 17-18zm-39-47 9-18c10-19 12-26 12-42v-13l-6-6c-10-10-30-6-30 6 0 5 2 7 11 11s7 11-3 13c-5 1-6 1-15-5l-4-2 2 4 4 15 5 14 6 27c2 12 2 12 9-4zm249-5a1792 1792 0 0 0 82-61l-20-17a1159 1159 0 0 1-73-57c-37-32-34-33-61 27a243 243 0 0 1-15 30l-5 12c-3 3 0 6 27 27l32 25c25 19 24 19 33 14zm-145-18 11-6c10-5 21-13 29-21l5-5-4-4c-6-6-6-7 5-29l3-8 6-13 7-14 4-9 2-4c1-2 3-8 7-13l5-11 2-2v-1l3-9 5-10c0-3 7-5 8-1l2 2 8 3c7 5 8 5 10 1l9-20c6-11 7-18 2-15a1316 1316 0 0 1-62 32 1628 1628 0 0 1-106 36l-10 2-42 8c-7 1-10 4-4 4a345 345 0 0 1 47 11c10 3 27 16 33 25 8 11 9 13 9 15l2 6c3 5 4 37 2 45-2 6-1 9 2 5zm232-49c0-2-4-4-6-3v2c2 2 6 3 6 1zm-6-28 27-26a1115 1115 0 0 0 90-94 452 452 0 0 0 62-92c5-9 11-25 15-45l5-20c7-14 7-54 0-68-6-13-24-32-30-32l-5-3c-14-10-68-26-85-26-12 0-30 8-42 18a171 171 0 0 0-37 61l-3 8c-2 3-4 23-3 27 1 1 2 1 7-5 26-27 41-37 46-28 2 3-1 7-9 14-16 13-31 29-41 44a480 480 0 0 0-49 101l-12 25-24 55c-11 24-12 21 10 39a20974 20974 0 0 1 64 50c6 5 8 5 14-3zm-974 0-1-2c-1 0-1-1 2-3 4-3 4-8-1-11-7-3-57-3-61 0-7 8-1 15 15 17 6 1 45 0 46-1zm359-6a205 205 0 0 1 72-57l10-3 7-2a182 182 0 0 1 76 9c3 1 7 2 8 4l13 9c8 6 35 31 40 37 3 5 4 1 4-24l-1-28c-4-4-48-27-58-30-26-7-52-29-56-48-2-5-7-1-7 5l-2 4-5 8c-6 12-16 19-43 30a192 192 0 0 0-26 12 128 128 0 0 0-28 13l-5 4-4 4v28c0 30 0 32 5 25zm-17-25c1-19 0-21-4-15l-8 10c-4 6-6 8-9 8-4 1-6 3-2 5 3 1 13 7 17 11 6 6 6 5 6-19zm274 7c7-3 7-2-3-14-11-13-11-13-11 6 0 17 1 17 5 14l9-6zm-374 4-5 1c-1 1 0 1 4 1 5 0 5 0 1-2zm446 1h-2c-1 0-1 1 1 1 1 0 2 0 1-1zm-705-14 3-119v-193c0-162 0-169-2-170-5-2-27 0-30 2-1 1-2 478-1 480h30zm667-6h-4c-1 1 0 1 2 1s3 0 2-1zm-348-12a371 371 0 0 0 18-55l2-6 1-5a541 541 0 0 0 24-86 436 436 0 0 0 12-48 508 508 0 0 0 11-43 303 303 0 0 0 7-32l2-14a354 354 0 0 1 9-40 17778 17778 0 0 1 9-57 289 289 0 0 0 8-45l2-12 1-12 2-7 1-10 3-15a3251 3251 0 0 1 15-147l2-19-37-1h-37l-1 8-4 26-4 19a153 153 0 0 1-7 27 189 189 0 0 1-5 20 501 501 0 0 1-39 98 445 445 0 0 1-41 80l-5 9-6 11-10 17-4 6-3 7-5 8-6 10a412 412 0 0 0-24 41l-4 4c-2 6-4 8-8 14l-6 8-4 6-5 8-7 11-13 19a980 980 0 0 1-94 112c0 1 10 9 12 9a604 604 0 0 0 137 59 284 284 0 0 0 54 15l15 3 8 2 10 2c10 3 11 3 14-5zm-36-47c-10-8-11-22-4-36l3-8c0-4 13 10 16 17 7 19-3 37-15 27zm-111-22c-10-6-12-17-8-38 1-8 3-8 10-1 18 19 17 50-2 39zm157-71c-9-3-8-20 3-35 9-12 12-15 12-9l2 5c10 13-3 44-17 39zm-90-5c-12-1-16-35-6-44 2-2 15 10 15 14l2 6c5 8 0 26-6 25l-5-1zm59-94c-6-8 1-28 13-39 6-5 6-5 6-2l2 7c3 4 3 24 0 29-5 8-17 11-21 5zm-3-93c-13-3-9-25 7-43l4-4c3 0 7 16 7 26v9l-6 6c-4 4-7 7-8 6h-4zm81-27c-11-5-6-26 9-41 4-4 5-4 6-1 5 10 6 28 3 33-5 7-13 11-18 9zm-15-104c-7-7-4-25 6-35 8-9 9-9 10-5l3 11c4 15 2 26-7 31-6 2-8 2-12-2zm43-112c-8-9-2-31 11-41l3-3 2 4c2 3 4 10 5 19 2 15-13 29-21 21zm272 580 15-4 7-2 9-2a227 227 0 0 1 23-5l11-3a460 460 0 0 0 93-34 188 188 0 0 1 17-8l2-2a495 495 0 0 0 50-26c7-3 7-5 0-12a303 303 0 0 1-34-36 260 260 0 0 1-27-34 179 179 0 0 1-13-16l-3-4-5-7-5-8-4-4-3-5-2-4-3-4-6-9-6-8-2-4-3-4-6-10a331 331 0 0 1-38-60l-1-3-2-4-4-8-4-5-2-3-2-5-10-17-5-8-5-9a167 167 0 0 0-10-18 5810 5810 0 0 0-26-51 245 245 0 0 1-21-47l-3-4-2-4-3-9-3-8-1-3a305 305 0 0 1-17-52l-9-37-3-15c-2-4-5-25-4-27 2-6 0-7-39-7h-36l1 4 2 21a1966 1966 0 0 0 14 137 1113 1113 0 0 1 14 96l2 9a371 371 0 0 1 9 54l2 9 2 8 2 12a284 284 0 0 0 8 41 1075 1075 0 0 0 27 107 276 276 0 0 1 7 30l1 5 4 9a345 345 0 0 0 13 45 831 831 0 0 0 24 74l13-2zm7-54c-8-8-3-30 9-42 5-5 12 10 11 26 0 16-11 25-20 16zm112-21c-8-8-3-26 9-37l7-7 2 5 3 9v18l-1 2c3 8-14 17-20 10zm-160-74c-7-6-6-35 1-43l12 12 4 7c12 16-4 37-17 24zm101-1c-12-2-12-26 0-38 7-6 11-9 12-6 6 18 1 47-8 45l-4-1zm-72-95c-6-6-8-33-3-36l1-3c0-4 2-3 7 2 7 7 11 15 10 20-1 4-1 4 1 3 3-2 4 0 4 7 0 11-12 15-20 7zm10-96c-6-7-8-11-7-19 0-7 5-24 7-24l10 14 2 2 2 2 2 7c8 14-5 30-16 18zm-83-27c-4-4-7-11-7-19 0-7 4-22 6-22s10 7 10 9l2 3c2 1 3 3 3 5l3 5c10 13-4 31-17 19zm14-99c-8-4-10-23-4-41l2-4 5 4c9 6 15 19 15 30 0 10-10 16-18 11zm-36-111c-12-4-14-8-14-23 0-6 0-12 2-15l1-7c0-3 2-2 9 4 16 15 18 46 2 41zm77 576-6-20a2850 2850 0 0 1-28-84l-9-6c-21-15-67-31-97-34-11-1-13 1-12 9l2 11c3 35 22 58 56 69 31 10 50 21 87 53 4 3 7 4 7 2zm-298-10c26-23 42-31 90-50 27-11 51-58 42-81-2-6-56 5-80 17-31 15-35 20-42 43a632 632 0 0 1-19 62l-4 13c-3 9 0 8 13-4zm-287-93c7-6 7-5-23-37l-16-16-5-6v32l10 10c20 20 28 24 34 17zm855-13c7-4 9-7 13-16l6-16c4-7 4-8-1-6-4 2-38 12-46 13-7 2-6 3 7 16s13 13 21 9zm-834-3 5-7c7-9 7-10-27-45-12-12-24-25-29-34-11-16-14-15-14 4v15l7 9c22 28 58 64 58 58zm523-19a632 632 0 0 0-13-47 464 464 0 0 0-12-49l-5-25a1204 1204 0 0 1-29-154 1077 1077 0 0 1-14-104 621 621 0 0 0-7-54 1190 1190 0 0 0-7-73v-13h-11c-6 0-11 1-11 2v497l12 2a246 246 0 0 1 96 30c4 4 4 2 1-12zm-215 3c17-8 29-12 47-16 10-3 17-4 36-6l7-1v-498h-9c-10 0-9-3-11 23a2045 2045 0 0 1-14 125l-1 15-1 14a2594 2594 0 0 0-17 98 1618 1618 0 0 1-32 161l-6 24a1073 1073 0 0 0-15 59c-4 11-3 12 3 8l13-6zm-279-22 27-34 3-4-16-15a587 587 0 0 1-108-132c-2 0 0 96 3 100l7 10c12 18 71 84 75 85l9-10zm776 3c45-11 63-21 66-35 3-20 1-21-29-10l-31 9-22 6-13 4c-7 0-7 2 0 12 14 19 12 18 29 14zm-930-28-3-2 6 6-3-4zm898-11a431 431 0 0 0 81-24l7-2c6-1 6-1 4-15l-2-26-1-15a541 541 0 0 0-122 17c-9 3-14 5-13 8l1 8c2 13 30 53 35 51l10-2zm-899-32v-25l-5-8-13-20-7-12-15-29a366 366 0 0 0-17-36l-1-5a382 382 0 0 1-23-61c0-3-4-5-10-5-5 0-29-12-32-16-4-5 0 11 4 19l2 5c0 1 1 7 4 12a223 223 0 0 1 8 22l5 13a304 304 0 0 0 15 34l2 6a425 425 0 0 1 21 40l2 4 7 12 7 12 2 3 5 7 4 7c0 3 33 46 35 46v-25zm197 12 5-5c2-1 4-6 6-19 1-4 0-5-10-15a459 459 0 0 1-38-40 515 515 0 0 1-79-111l-11-23-7-13-1 5-1 34v28l6 11c16 31 23 40 70 97 18 21 53 57 56 56 1 0 3-2 4-5zm814-2c2-2 3-5 3-16a160 160 0 0 1 28-94c19-33 60-54 89-45 7 2-11-18-21-23-16-8-59 15-78 42-27 39-36 84-26 134 1 4 2 4 5 2zm-776-51 18-30a1317 1317 0 0 1 44-74 1645 1645 0 0 1 32-61 676 676 0 0 0 36-80 351 351 0 0 0 30-95c8-31 11-49 9-49-14-3-136-1-136 2l-1 3-4 11-5 14-14 44a750 750 0 0 0-19 66c-10 31-20 77-19 82l4 8 3 6 4 8c11 21 22 102 15 113-1 1-6 41-5 42 1 2 1 2 8-10zm-22 3c4-17 6-31 6-55v-26l-25-23a347 347 0 0 1-66-77l-8-11c-5-10-6-10-11-6a174 174 0 0 1-32 15 195 195 0 0 0 24 48 646 646 0 0 0 102 131c7 8 9 9 10 4zm624-8c-4-42-2-78 6-103a124 124 0 0 1 16-37c6-8 6-10 1-25l-5-17a478 478 0 0 0-19-79 5323 5323 0 0 1-17-59 749 749 0 0 0-22-63l-2-2h-64c-76-1-72-2-66 20l3 11a610 610 0 0 0 71 195 751 751 0 0 0 35 65 1380 1380 0 0 0 50 85c11 19 14 22 13 9zm30 0a487 487 0 0 1 108-18c18-1 16 1 20-14 4-17 5-17-15-16a539 539 0 0 0-124 21c-7 1-7 2-7 15 0 12 2 16 5 15l13-3zm-867-18 1-17c0-6-1-8-3-13a398 398 0 0 1-38-84c-4-12-7-15-19-17l-7-1 1 5c1 6 6 21 10 29l5 13a621 621 0 0 0 45 89c4 8 5 7 5-4zm873-28c46-11 67-14 102-15l30-1 5-8 19-28c16-9-81-21-126-15-50 6-51 7-53 52-1 22-1 22 7 19l16-4zm-800-19-2-1v1l1 2 1-2zm-73-89-10 2a107 107 0 0 1-21 3l2 8c2 6 3 10 18 41 12 27 11 29 11-15v-39zm215 54-5-19-4-16c0-2-14-19-29-37l-24-29c-15-21-16-22-22-10-4 9-4 13 3 23a637 637 0 0 0 69 82c9 12 13 13 12 6zm836-19c8-5 13-8 24-11 14-4 11-6-11-11l-21-5a294 294 0 0 0-153 3c-16 3-21 7-24 18l-2 6 2-1a333 333 0 0 1 153 1c22 6 24 6 32 0zm-716-33-1-1-1 1 1 2 1-2zm561-6 15-4 3-1v-110c0-95 0-110-2-111-2-2-98-2-99 0-1 1 5 21 9 31a189 189 0 0 1 8 23 583 583 0 0 1 19 64 3101 3101 0 0 0 14 53 16467 16467 0 0 0 13 56c1 4 0 4 20-1zm-920-6c21-3 32-12 15-13l-20-3a107 107 0 0 1-30-201c11-6-25 0-39 7-18 9-42 29-49 41l-4 7a117 117 0 0 0-2 101c3 7 6 11 17 24 29 32 67 45 112 37zm974-3 2-16a2763 2763 0 0 1 15-114 1076 1076 0 0 0 11-86c-1-1-47-2-49 0-2 0-2 208-1 217l22-1zm-756-12 2-10a3585 3585 0 0 0 25-92 1494 1494 0 0 1 25-79c10-29 22-26-90-25h-96v4c-1 12 0 15 10 19 17 7 26 22 20 34-1 3-1 4 4 8l4 5c0 1 4 3 9 4 17 5 26 21 28 52l2 12c1 4 4 8 12 19l13 16 25 31c5 6 7 6 7 2zm-108-16c22-11 28-15 32-19l5-4v-14l-1-18-3-13c-1-11-5-28-6-29-1-2-11-5-12-3-3 3-4 12-1 14 10 10 11 22 3 32l-5 7 2 5c7 17-3 34-22 36-14 2-14 2-14 6 0 6 12 6 22 0zm-90 2-7-2c-22-5-34-17-36-37l-5-16c-3-8-4-32-1-36 1-1 2-3 1-6-3-13-2-23 3-33l4-14c2-14 4-18 12-23 9-7 11-8 22-10 13-3 12-5-5-5-35 0-63 17-79 50-28 54 12 126 75 133 9 1 16 0 16-1zm93-17-2-1-1 2c1 2 3 0 3-1zm-44-1c29-1 39-4 41-12 3-11-6-13-46-13-35-1-36-1-38-6-2-8-2-8 42-7l40 1 3-4c7-8 7-14 2-18l-4-5-41-1c-44-1-42-1-42-6 0-9 0-9 23-9l40 2h19l2-4c4-8 3-12-3-17l-5-4-21-1-37-2-15-1-1-4c-2-9-2-9 33-8l34 1c4 1 7-2 7-7s-5-10-12-12l-6-2-11-2-13-1-11-2-19-2c-14-2-20 0-30 6-5 4-5 3-8 22 0 4-2 8-3 10-4 5-5 19-3 27 2 5 2 7 1 10-5 12-4 29 1 35 2 3 3 5 3 11 0 20 12 28 43 26l35-1zm3-158-1-6c0-8-1-8-15-9-22 0-29 9-9 13s26 5 25 2zm206-31-4-11a573 573 0 0 1-19-58 333 333 0 0 0-11-38l-3-8c-1-7-4-19-6-22l-2-10a617 617 0 0 0-16-67c-5-24-5-25-12-21l-14 3c-7 0-12 2-13 2-1 2-2 228 0 230h100zm150-1 2-2-4-16c-10-59-32-125-62-186a5314 5314 0 0 0-63-118c-15-26-46-73-48-73v5c8 32-1 96-17 132l-9 21a1483 1483 0 0 0 67 238c5 1 133 0 134-1zm89-1a472 472 0 0 1-6-59l-2-15-1-9-2-18-2-19-1-12-2-12-1-13a404 404 0 0 1-9-56 1189 1189 0 0 1-8-53 1123 1123 0 0 1-12-68c-3-9-5-17-7-34l-4-18-2-6c0-4-2-17-5-25l-3-14a968 968 0 0 0-27-108 674 674 0 0 0-21-72l-8-27c-3-12-5-14-11-13a524 524 0 0 0-99 26l-8 2c-5 3-19 8-21 8l-8 3-8 3-10 4-10 3-14 7a355 355 0 0 1-49 21l-9 6c-7 3-7 5 4 16a844 844 0 0 1 145 196l10 18a216 216 0 0 1 13 21l4 6a1244 1244 0 0 0 41 76l5 12a52248 52248 0 0 0 28 60 916 916 0 0 0 18 45l1 7 6 17 5 19a211 211 0 0 1 10 38 267 267 0 0 1 5 38c1 3 75 2 75-1zm-35-36c-13-13-18-30-12-38 11-15 26 5 21 27-3 14-4 16-9 11zm-47-117c-14-18-13-38 2-38 10 0 15 13 10 33-2 14-5 15-12 5zm19-99-10-11-2-6c-2-4-4-13-3-20 0-3 8-7 11-6 12 3 17 25 10 40-3 6-3 6-6 3zm-84-26c-15-19-18-33-10-42 12-11 25 15 19 35-4 11-5 12-9 7zm9-98c-10-10-13-16-12-29 1-9 3-11 9-11 12 0 18 13 13 30l-2 12c-1 4-3 3-8-2zm-79-97c-6-20-3-33 8-37s18 18 9 28l-2 5c0 2-7 10-10 12-2 1-3 0-5-8zm104 1-5-6-3-5c-12-17 0-36 14-24 9 8 9 40 0 40-1 0-4-2-6-5zm-5-24c-1-2-1-1-1 2s0 4 1 3v-5zm-165-49c-1-1-2-7-2-16v-15l5-4c2-3 5-5 7-5l4-1h2l3 3c3 4 5 14 3 17l-2 6c-2 11-15 21-20 15zm118-18c-12-12-11-39 1-44 9-3 17 8 15 21-2 7-9 22-11 22l-2 2c0 1-1 1-3-1zm197 473c2-178 2-400 0-401l-9-2a233 233 0 0 1-85-25c-14-8-14-8-8 12a939 939 0 0 1 16 70 369 369 0 0 1 8 32 1128 1128 0 0 1 15 78l4 19 9 54a2127 2127 0 0 0 14 86l1 14 3 22a3160 3160 0 0 0 13 123c1 11 1 11 10 11l9-1zm37 92 1-13a1169 1169 0 0 1 9-89 4301 4301 0 0 0 15-119 1113 1113 0 0 1 19-116 418 418 0 0 1 11-46 771 771 0 0 1 20-91l10-38c4-15 3-17-4-11a239 239 0 0 1-90 28l-12 3c-1 1-2 490-1 492h22zm87-4a261 261 0 0 0 5-26l4-15a158 158 0 0 1 8-38l1-5 4-13 5-13 1-6 2-5c3-6 5-11 5-14l1-4 5-10a289 289 0 0 1 12-28c5-13 8-19 9-19l1-3 3-6 3-5 3-7a344 344 0 0 0 12-24 185 185 0 0 0 10-22l4-6 4-6 13-24a1157 1157 0 0 1 70-114l2-5a381 381 0 0 0 29-40l13-18a1460 1460 0 0 0 36-45 326 326 0 0 1 37-39c0-2-2-5-5-5l-3-2a308 308 0 0 0-59-28 116 116 0 0 0-21-8l-6-3-11-4-12-5-4-1-10-3-10-4-8-2-8-3-5-1c-3 0-24-5-27-7a215 215 0 0 0-39-10c-14-5-20-4-21 0l-5 18a287 287 0 0 0-14 42 24191 24191 0 0 1-45 169 624 624 0 0 1-13 68c-2 3-4 14-6 27l-2 11-3 17-2 16-3 13a323 323 0 0 1-5 31l-3 15-1 10-1 10a312 312 0 0 0-8 56 1186 1186 0 0 0-7 51c-2 15-8 93-6 96l35 1 35-1zm-48-35c-5-18-2-38 5-40 8-3 9-3 13 0 9 7 2 32-12 43l-4 3zm45-117c-7-22-3-37 10-37h7l2 6c3 11 0 23-9 33-7 7-8 7-10-2zm-14-99c-6-15-3-34 6-39 5-3 12-3 12 1l2 3c2 2 3 10 1 13l-3 5c-6 14-16 23-18 17zm81-29-2-11c-2-10 5-28 11-28l4-1c6-4 12 11 9 21-5 18-22 32-22 19zm-8-94c-8-24 3-50 17-40 2 2 3 26 1 26l-3 4c-1 4-6 9-12 13-1 1-2 1-3-3zm78-94c-5-6-7-8-10-15-4-8-1-22 6-25 14-5 22 19 13 39-3 8-3 8-9 1zm-105-1c-2-5-3-27-2-27l1-3c0-12 21-13 23-1 3 16-19 45-22 31zm172-72c-17-18-19-44-4-43s22 23 12 41c-3 7-3 7-8 2zm-113-18c-2-1-10-13-10-15l-2-5c-2-4-2-15 2-20 12-19 29 6 19 29-6 12-5 12-9 11zm61 563a770 770 0 0 0 47-145 11406 11406 0 0 1 14-66c2-8 2-8 0-10-3-3-9-15-13-24a741 741 0 0 0-6-22l-2-11c-6-20-6-58-2-84 6-36 5-42-4-29a834 834 0 0 0-45 77 1101 1101 0 0 0-121 289c-4 11-5 24-2 25h134zm204-11v-11l-7-2c-17-5-22-11-21-27l-1-10c-2 0-10-8-10-10s-5-4-10-4c-10 0-19-16-22-42-4-25-1-20-41-70l-14-18c-2-4-3-2-4 7a418 418 0 0 1-12 51 292 292 0 0 0-10 38 323 323 0 0 0-10 34l-2 6-3 8-3 7-1 6-2 6-2 6-2 6c0 1-1 5-3 7-3 8-8 22-7 23l94 1 93-1zm42 11c4-1 4-1 4-8v-7l-13-2-16-2c-4 0-4 0-3 10 1 8 1 8 5 9h23zm-906-115v-113h-10c-12 1-12 1-12 13a2649 2649 0 0 0-26 192c-3 10-4 20-2 22h50zm1015 108c28-7 62-42 71-72 23-81-50-157-137-142-26 4-34 15-11 15 31 0 63 16 84 41 18 21 27 64 20 92-5 18-21 45-31 50l-10 8-10 7c-8 4 7 5 24 1zm-41-9c85-30 66-167-24-174-10-1-14 1-6 2 16 4 25 13 28 29l5 19c5 14 5 25 3 34-2 6-2 8-1 12 2 7 0 21-4 30-3 6-4 10-4 16 0 15-18 31-36 32-12 1-11 4 1 4 14 1 28 0 38-4zm-31-15c5-3 14-12 14-16l2-10c0-4 1-10 3-13 3-6 4-18 1-26-1-4-1-6 1-10 3-6 2-22-2-33l-3-11c0-9-8-21-17-25-9-3-84 0-93 4-9 5-12 12-7 18l2 3h37c40 0 44 0 44 8 0 5-3 5-43 6l-39 1-4 4c-5 5-5 13-1 18l3 3h40c44 0 43 0 44 8 0 6 0 6-42 6h-38l-4 4c-5 5-5 8-1 13 5 8 11 9 45 10 32 0 37 1 38 6 2 7-1 8-38 7l-32-1-3 4c-6 7 2 14 17 17l23 3c30 5 45 5 53 2zm-119-58 2-8 2-7-4-4c-7-6-6-20 2-31 4-5 4-6 0-10-3-4-3-9 0-15l2-8c0-6 13-14 26-15 7 0 8-1 8-3 0-12-47 9-56 25-3 5-3 21 0 35a429 429 0 0 1 7 35c4 6 11 10 11 6zm-28-86c5-7 5-7-15-36-20-28-30-40-54-64-16-15-16-16-15-10 6 32 15 51 32 69a509 509 0 0 1 40 47l7 7 1-4c0-3 2-7 4-9zm100-15 13-2c2-1 1-490 0-492l-15-1h-15v248c0 224 0 249 2 248l15-1zm-77-5c7-4 23-11 26-11 7 0 7-2 2-11a5641 5641 0 0 1-33-58 571 571 0 0 0-98-119c-3 1-7 40-7 68v14l18 18a386 386 0 0 1 74 88c10 17 9 17 18 11zm232-21a254 254 0 0 0-17-50c-3-5-5-11-5-13l-3-6-2-4-10-23a843 843 0 0 1-22-44 393 393 0 0 0-34-56l-25-37c-7-7-9-8-9-2l1 24 1 19 13 22a823 823 0 0 1 69 146l3 7 17 8c10 4 18 9 19 10 2 3 5 2 4-1zm-188-33c1-34 1-39-5-50a640 640 0 0 0-122-148c-5 0-14 19-14 29v7l10 11a622 622 0 0 1 78 93 52868 52868 0 0 0 37 61l8 14 4 8 3 7 1-32zm74 17 13-3 8-2c1-2-28-68-32-71-2-1-2 55-1 70 1 8 2 9 12 6zm54-8c0-5-8-24-13-36l-6-15-23-47c-24-46-25-47-24-20l1 17 6 12 11 23a859 859 0 0 0 27 59c4 9 4 10 11 11 12 1 11 1 10-4zm-978-3c38-6 41-7 47-18 5-9 5-11 1-10a390 390 0 0 1-173-11c-2-2-3-2-9 3-7 5-26 15-29 15-4 0-1 4 4 6 37 15 111 22 159 15zm-171-32c18-6 34-17 47-31a133 133 0 0 0 28-47c6-9 12-63 9-82-5-27-11-26-13 3a157 157 0 0 1-11 53c0 35-52 82-93 83l-14 1 18 18c7 5 16 6 29 2zm188-5a313 313 0 0 1 35-5l7-2v-5l3-11c4-11 7-45 4-48l-13 3c-43 11-77 15-123 14-18 0-20 0-21 2-3 8-15 25-20 31-7 8-7 8-4 9a541 541 0 0 0 132 12zm594-12v3-3zm-790-22c8-3 15-8 20-13a121 121 0 0 0 24-33c8-13 11-18 13-26 11-43 11-42-17-16-12 11-21 15-27 10-4-4-2-7 12-17a259 259 0 0 0 75-112 492 492 0 0 1 22-49 366 366 0 0 1 23-52 246 246 0 0 1 14-27c1-2-8-9-54-45a779 779 0 0 1-36-28 864 864 0 0 0-141 143 300 300 0 0 0-67 133c-10 28-9 69 4 85 24 32 105 60 135 47zm1031-7-1-49v-45l-9-11a16017 16017 0 0 1-48-56c-9-12-24-26-26-26s-13 13-33 39l-6 9 15 14a480 480 0 0 1 58 64 674 674 0 0 1 49 66l1-5zm-874-28c54-5 86-13 88-21 2-10-3-22-8-21a6651 6651 0 0 1-47 9c-14 3-34 5-61 5s-26-1-29 13l-3 11-1 5c1 1 46 1 61-1zm7-43a414 414 0 0 0 73-13c12 0-3-35-26-62l-4-4-14 3c-30 6-57 13-77 21-12 4-12 5-10 13l1 25-1 18h3c6 1 37 0 55-1zm866-64c0-23-1-23-42-66-15-16-17-16-23-10-10 11-11 8 14 36a2079 2079 0 0 1 50 55l1-15zm-908-8a653 653 0 0 1 74-21c1 0-9-15-16-22l-4-5-20 5a1091 1091 0 0 0-40 12c-17 4-24 18-18 32 3 6 1 6 24-1zm908-47c0-10-1-14-3-17-3-6-31-30-34-30-2 0-11 9-11 10l17 18 23 24c9 10 9 10 8-5zm-913 1 11-3c11-2 35-10 36-11 1-2-20-24-23-24-10 1-16 5-19 12l-6 17c-6 11-5 13 1 9zm436-10c0-13-3-27-10-41-10-19-14-23-39-33-41-16-57-26-91-57-6-6-6-5 0 13a465 465 0 0 1 12 41 542 542 0 0 0 18 51l10 6c32 20 53 27 92 31 8 1 9 0 8-11zm48 8c9-1 18-4 27-8l14-5c3 0 29-15 35-20 8-6 8-6 12-19l6-22c10-29 19-63 19-66 0-4-1-3-19 14-21 20-28 24-87 51-22 10-36 34-38 64-1 17-2 17 31 11zm-36-48c5-13 27-39 32-39l9-3 8-3 2-1 6-3 12-5 9-3 4-2 3-2 4-2 3-2 6-3c2-3 5-4 6-4 2 0 6-4 8-7 1-3 2-53 0-53l-20 21a162 162 0 0 1-38 29c-11 7-22 11-29 11l-6 1a199 199 0 0 1-51-2c-9-1-19-5-23-8l-4-2a157 157 0 0 1-52-43c-5-6-5-6-6 9-1 33 2 45 10 45l7 4c7 5 21 12 23 12l7 3 8 3 5 2 3 2 8 3 7 3c2 0 12 8 18 15 3 2 8 10 11 17 7 14 7 14 10 7zm-409-28 11-5a267 267 0 0 1 40-17 409 409 0 0 1 67-26l10-4 12-4a500 500 0 0 1 62-16c12-2 16-5 8-5a117 117 0 0 1-46-14l-4-3-9-8c-3-2-7-7-9-11l-6-10a78 78 0 0 1-4-64c2-7 5-14 7-15v-6l-2 1-11 6-10 5-10 7-16 12-6 6 6 5c4 4 5 5 4 7a107 107 0 0 0-8 15 415 415 0 0 0-23 48 314 314 0 0 0-14 28l-6 13c-4 12-6 15-10 15-3 0-13-8-13-11 0-4-5-2-8 3a519 519 0 0 0-23 54l11-6zm428-55 5-2 15-5 4-1 5-2 6-5c4-2 12-8 30-25a157 157 0 0 0 38-53l3-7 1-5 6-13 3-9 9-28c5-18 8-56 8-105 0-37 1-35-14-35a157 157 0 0 1-43-8 209 209 0 0 1-44-15c-20-9-36-22-52-40l-3-4-4 5-11 12c-7 7-21 18-31 23a569 569 0 0 0-21 11l-8 3-15 4-19 4-21 4c-22 2-22 3-23 51v44a310 310 0 0 0 8 44 334 334 0 0 0 23 66 108 108 0 0 0 16 27l26 30c12 12 30 25 34 25l13 5 8 2 5 2c2 2 39 2 43 0zm-36-52c-7-3-13-7-13-10 0-4 9-6 12-3 2 2 26 1 30-1 9-5 15 3 7 8-11 7-25 10-36 6zm54-30a115 115 0 0 0-42 0h-39c-5 1-5 1-7-2-5-6 0-11 10-11 5 0 8-1 9-2 4-2 17-3 19 0s17 3 19 0c0-1 2-2 8-2s9 1 10 2c1 2 4 2 10 2 9 0 12 2 12 8 0 7-1 8-9 5zm-117-17-5-1c-6 0-13-11-10-16 1-2 2-1 5 2 4 5 20 5 30 0a55 55 0 0 1 15-7c9-4 28-5 31-2 5 5-4 14-16 16l-14 3c-3 2-9 3-12 3l-7 2c-1 2-16 2-17 0zm134 0c-10-4-18-6-26-7-20-2-21-3-21-11 0-6 2-8 12-8 7 0 21 3 21 4l1 1c3 0 10 4 11 5l3 1 3 2c1 3 22 2 27-2s6-3 6 2c0 11-21 18-37 13zm-64-31-4-1-10-4c-6-3-10-5-12-8l-4-4 3-3c4-3 6-3 10 0l5 3 9 3c9 4 10 4 21-1 16-7 23-8 23-2 0 7-30 19-41 17zm28-15-1-1-1 1v2l2-2zm-46-32c-2-2-2-4-2-8 3-25 2-51-2-60-3-5-2-7 2-9 10-5 13 8 13 50 0 29-3 36-11 27zm-61-32c-8-1-15-7-15-15 0-7-2-7-13-2-10 5-14 5-16 0s22-19 32-19l6-2a74 74 0 0 1 36 5l3 2c3 1 16 13 16 15 0 4-9 5-14 1l-9-3-6-1v6c-2 9-9 14-20 13zm156-5c-5-4-5-6-5-10 0-6-2-7-12-1-8 4-10 4-14 1-4-5 15-20 28-21 4 0 7-1 7-2h18l6 2 8 1 8 4c5 2 15 11 15 14 0 5-6 5-17 0-9-4-11-4-12 3-1 5-1 6-7 10-7 6-16 5-23-1zm-212-41c-3-4 7-15 15-15l2-1c0-4 32-12 44-11a103 103 0 0 1 32 7c7 0 21 10 21 15s-10 6-15 2l-4-2-7-3c-16-8-48-5-72 6-14 6-13 6-16 2zm274 0-4-2-6-2-6-3-5-1c-14-7-48-5-68 4-10 5-16 4-16-3 0-1 7-8 9-8l6-3c8-6 42-10 58-7 13 2 22 5 23 8l4 2c3 0 13 7 14 11 2 4-6 8-9 4zM498 611l-1-1-1 2 1 1 1-2zm0-13a1846 1846 0 0 0 35-76l3-4c5-5-17-28-45-46l-17-14c-20-17-15-18-47 5l-37 26c-30 22-29 18-1 40a1062 1062 0 0 1 63 51l18 13 14 11c8 7 9 7 14-6zm507 1 6-8c4-4 4-5-1-8l-7-5c-5-6-6-3-6 12 0 18 2 20 8 9zm-264-1-1-23c-1-1-17 11-17 12l3 3 7 7c6 8 7 8 8 1zm-37-19c14-4 24-10 33-22l6-7-11-22c-12-22-23-56-27-79-2-11-3-11-7 1l-14 30c-21 41-18 70 6 70 16 0 25-23 9-24-6 0-11-11-5-13 10-6 27 9 27 23 0 26-36 37-55 16-19-20-16-38 14-96 10-19 13-29 16-47 2-15 2-50 0-51h-1l-6 7c-5 4-5 5-5 14-1 22-14 59-31 87-24 38-24 78-2 101 11 11 37 17 53 12zm350 0c24-2 36-12 44-36 4-12 4-43 0-48-2-1-3-4-3-5l-6-14c-21-39-28-55-33-73-5-21-5-22-4-73v-7h-15v16l1 47 1 30 5 14c5 14 11 25 19 39 26 43 24 82-5 92-23 8-46-9-41-31 3-16 29-27 29-12 0 3-5 8-8 8s-6 5-7 10c-1 11 15 18 26 11 15-10 15-28-3-63a403 403 0 0 1-21-43l-2 10a469 469 0 0 1-27 80c-11 22-12 20 1 32 12 11 26 18 35 17l14-1zm66-26c14-16 17-52 6-78a364 364 0 0 1-9-18c-21-33-33-71-35-110l-1-12-5-4c-9-7-9-7-10 17-1 40 4 63 22 96 31 56 37 84 22 112-5 10-1 8 10-3zm-492 7-3-7c-9-22-3-61 12-87 19-31 32-65 32-79 0-5-7 2-14 14a865 865 0 0 1-32 52l-10 20c-15 32-13 62 7 83 5 5 8 6 8 4zm769-4c3-2 3-8-1-12-3-4-57-4-61-1-2 2-2 10-1 13 3 4 58 4 63 0zm92-16 12-11a228 228 0 0 0 66-103c4-9 5-15 7-24l2-14a249 249 0 0 0-29-154c-16-27-33-47-58-67-7-6-10-7-7-2l2 8c1 13 5 24 8 27a192 192 0 0 1 43 67c24 43 18 144-12 196-11 19-18 29-30 43-3 4-4 7-8 23l-3 7c-5 12-3 13 7 4zm-92-17c3-4 4-12 2-17-2-3-2-6-2-8l-2-8c-8-23-10-114-4-175 2-17 2-19-4-18l-26 1h-21v7l1 21c4 43 6 86 4 111-3 34-4 42-12 71-3 9-3 10 1 15l3 3h58zm-854-39c7-8 26-21 38-26 11-5 38-24 38-28l6-10 13-20c7-10 24-31 40-45 14-13 21-25 13-24l-17 6-11 6c-8 4-12 7-22 17-19 17-24 19-35 10-8-7-10-10-9-22 0-12 0-12-8-6l-5 5-1 26c-1 33-4 44-15 56-10 12-17 5-9-8l4-10 2-3c4-4 5-16 5-40-1-32-2-30 28-49 10-5 17-5 28 0l9 3 6 2c7 4 22 2 20-3a59 59 0 0 0-21-13c-1-2-25-13-28-13l-25 6-11 3-6 2-3 1c-4 0-25 5-28 7-2 1-4 4-6 9l-5 11-4 10-4 10a488 488 0 0 0-15 41 137 137 0 0 1-8 21l-9 17-5 6-4 5 5 5a565 565 0 0 0 41 33c11 10 11 10 18 2zm954-7a232 232 0 0 0 16-27l6-14 2-5c4-7 8-20 10-31l4-14a351 351 0 0 0-3-77c0-5-2-11-3-13l-2-8-2-7-3-7-2-5-2-4c0-3-12-24-17-32-3-3-5-8-6-10-4-8-5-4-9 15l-4 17-3 6-3 7-5 9a97 97 0 0 1-54 40l-12 4-1 13-3 43c-1 10-2 9 12 11 29 2 61 31 71 64 3 10 6 26 5 28s0 5 2 5l6-8zm-481-1c1-6 0-10-2-5-2 4-2 9 0 9l2-4zm204-86 11-5 5-2c5-3 37-10 49-10 14 0 33 6 42 12 4 2 4-57 0-64-3-5-29-3-44 3l-11 5c-25 9-49 32-63 58-5 8-4 13 1 10 1-2 6-4 10-7zm-599-37c1-1 1-2-2-1-5 0-6 0-5 1 1 2 5 2 7 0zm7-11c6-4 8-7 4-7l-9-3c-12-5-14-4-13 8l1 8 5-1c3 0 8-3 12-5zm79 1-1-2-1 2 1 2 1-2zm1-6-2-2-1 2 1 3c1 0 2-1 2-3zm-24-18 19-8a2337 2337 0 0 0 268-143c29-16 42-20 46-16 5 4 0 9-16 16-11 5-14 7-9 8 40 14 93 42 130 71 12 8 32-3 49-27l5-7c18-21 3-68-30-94-46-37-98-27-206 43a1404 1404 0 0 1-102 62 607 607 0 0 1-64 35l-60 29c-12 4-14 6-14 11s-6 12-11 13l-6 3-5 1c-2 0-4 2-2 4 1 1 0 2 8-1zm411-7 11-13 4-5-5-5a350 350 0 0 0-160-82c-9-2-10-2-33 10-24 13-41 23-36 23a635 635 0 0 1 35 8c35 5 105 33 156 62 21 12 19 12 28 2zm-65-5c1-1-4-5-8-6l-37-16a223 223 0 0 0-39-14l-51-13c-3 0-1 2 5 7 21 19 43 29 83 36 42 8 46 8 47 6zm-348-6 5-3c0-3-20-13-33-17l-7-3-3-2-4-1c-5-4-26-6-31-3l-6 2-7 3-5 2-13 4-12 5-4 2c-3 3 0 4 6 2l17-4 20-5c8-2 10-2 19 2l9 4c9 3 27 12 29 14s14 1 20-2zm96-4c21-6 67-33 63-37-1-1-16 6-42 20l-27 14c-10 4-6 6 6 3zm580-106c0-107-1-112-9-68-1 6-2 14-4 17l-3 13-3 14-2 9-2 7-8 37c-2 12-2 15 0 15s11 14 12 18c1 5 12 28 14 30 4 5 4 0 5-92zm21 93 8-16c7-17 11-24 17-31 5-5 5-11 1-22l-3-11-3-12-4-13a285 285 0 0 0-10-44 323 323 0 0 0-9-38c0-6-2-8-3-3v189c1 2 5 3 6 1zm-683-4 19-8a1283 1283 0 0 0 178-97c30-20 39-25 63-38 24-14 26-17 10-18l-24-2a822 822 0 0 0-106 6l-12 3a408 408 0 0 0-105 66c-10 8-11 9-12 16-1 9-4 15-10 19-6 5-5 5 4 6 19 0 26 10 19 24-5 10-21 18-30 17-10-1-8 5 2 8l4-2zm430-1c4-9 4-9-4-15a356 356 0 0 0-77-49 282 282 0 0 0-64-27l-13-4-7 3c-10 5-9 7 6 11a216 216 0 0 1 45 17l5 2 25 11c25 13 46 27 72 49 7 7 9 7 12 2zm-455-13 9-2c18-4 23-6 27-11 7-8 5-9-23-7l-40 2c-25 1-32 2-40 7-10 6-8 7 5 4 10-3 17-3 22 0l14 5 4 2c2 2 15 2 22 0zm-24-29 12-3c10 0 11-1 15-5l9-7c6-2 11-8 9-10l-12 5-13 6-5 2-5 2c-1 0-5 1-7 3l-10 3c-6 1-8 2-7 4h14zm442-148h-3l2 1c2 0 2-1 1-1z"/><g fill="#000007" fill-rule="evenodd" stroke-opacity="0"><path d="M1016 468c-2 0-3 3-3 4-1 3-2 6-1 8s3 1 4 0c1-3 2-7 1-11l-1-1zM888 468c-2 0-4 3-2 4s4-1 4-3l-2-1zM706 334c-2 0-2 3-2 5 0 1 2 3 4 1 1-1 1-6-2-6z" style="paint-order:markers fill stroke"/><path d="M706 340c-2 0-2 3-2 5h3c1-2 2-5-1-5zM619 351l-6 1c-1 1 0 3 2 3 3 1 6 0 8-3 0-2-2-1-4-1zM668 1504l-2 2 1 2h3l-1-3-1-1zM422 1446c-1 0-3 1-3 3l2 2c1 0 3-1 3-3 1-1-1-2-2-2zM405 1591c-1 0-2 2-1 3l3 1c1-2 0-4-2-4zM332 1744c-2 0 0 2 0 3 2 2 3 4 6 5v-3c-2-2-3-4-6-5zM634 1956c-1 0-3 1-3 3l5 1 5-1-1-2-6-1zM706 2136h-1v14h2v-1a62 62 0 0 0 0-12l-1-1s0-1 0 0zM385 2407l-1 2v2l1 1 2-1-1-3-1-1zM383 2429l-2 1v4h2l1-2v-3h-1zM1035 2184l-1 3v8h2l1-9c0-1 0-2-2-3zM1370 2001c-1 0-3 1-2 3s4 4 6 3 2-2 1-3c-1-2-3-3-5-3zM1082 1957l-2 1v2h4v-2l-2-1zM1043 1937l-3 1 1 2h3l3-1-1-2h-3zM1096 965l-1 2v3l3-1-1-4h-1zM708 758l-1 1v7h2l1-2v-5l-1-1h-1zM497 609l-2 2 1 3c1 1 2 1 3-1 1-1 1-3-1-4h-1z" style="paint-order:markers fill stroke"/></g><g fill="#c58c35" fill-rule="evenodd" stroke-opacity="0"><path d="M1088 97c-24 0-46 8-67 18-44 20-84 48-125 73-36 22-71 44-108 62-25 13-50 26-76 37-4 3-10 4-13 9 0 4-2 9-5 12s-9 4-13 7c-2 0-7 0-7 4 1 2 3 4 6 2 21-7 41-17 61-26l76-40 80-44 50-29c18-10 36-20 55-28 4-1 10-4 14-1 2 1 2 4 0 5-8 7-18 9-26 15-2 1-1 4 1 4a467 467 0 0 1 130 70c3 3 8 4 12 3 12 0 21-9 29-17 7-7 12-16 18-24 6-9 5-20 4-31-7-34-33-64-66-76-10-4-20-5-31-5z" style="paint-order:markers fill stroke"/><path d="M968 183c-5 3-11 4-14 8-1 3 3 4 5 5l43 16c11 5 22 8 33 14 28 13 54 32 78 52 3 2 6 6 10 5 3-2 5-7 6-11 1-5-5-7-8-10-21-18-45-32-69-45l-38-19-16-5c-10-5-20-7-29-10h-1zM455 445c-8 1-14 8-22 12-20 15-41 29-61 45-3 3-8 8-4 11 11 12 25 20 37 30l60 49c9 5 16 12 25 18 4 1 5-4 7-7 9-18 17-37 27-55l14-32c-1-8-9-13-14-19-16-16-36-28-53-43-5-3-9-9-16-9zM445 710c-8-1-15 5-18 12-3 9-8 18-10 27 1 4 6 0 9 0 14-5 29-7 43-14 4-2 0-6-2-8-6-6-12-13-19-17h-3zM390 802c-4 3-5 10-5 14-3 21-4 42-11 61-2 9-3 18-8 26-12 22-32 39-54 50-13 6-28 9-43 8-2 0-4 2-2 4 7 7 13 15 22 20 9 4 18 1 27-2 24-8 43-26 57-46 7-9 14-19 17-30 8-21 9-44 9-66 1-13 1-27-7-38l-2-1zM511 786c-32 6-64 13-94 26-5 1-8 5-7 10 3 15 1 30 2 46l21 1c37-1 73-6 109-14 6 0 7-7 6-12-5-19-17-35-29-50-2-3-4-6-8-7zM549 906l-57 12c-30 5-61 5-92 6-3-1-7 1-8 4-7 13-15 24-24 35-2 5 5 5 8 6l66 11c23 0 45 0 68-2 11-2 23-2 34-6 3-7 4-16 6-24 2-13 4-26 3-40l-4-2z" style="paint-order:markers fill stroke"/><path d="M357 974c-11 6-22 14-35 19-3-1-4 3-1 5 11 7 24 9 37 12a359 359 0 0 0 161-1c10-2 15-12 18-20 0-5-7-2-9-2a429 429 0 0 1-171-13zM520 1020c-7 2-13 4-19 4-4 2-9 1-13 3-2 5-1 11-2 16v200l1 15c2 2 6 1 9 1h89c3 1 4-2 3-4-9-27-19-54-27-82l-8-30c-4-16-10-33-13-50l-15-66c-1-2-2-7-6-7zM516 1272H394c-2 3-1 7-1 10-1 5 1 10 6 13 11 5 24 13 26 26 1 5-3 9-2 14 5 7 13 12 22 15 14 6 19 22 22 37 2 11 0 25 8 35 16 20 32 41 50 60 2 2 4-1 4-3 7-32 16-63 25-94 9-34 20-67 32-100 1-3 2-8-2-10-7-4-16-2-23-3h-45zM317 1283c-14-1-27 1-38 7a93 93 0 0 0-49 67c-3 20 1 41 10 59 16 30 48 51 82 51 3 0 7 1 9-1 0-4-5-3-8-4-14-3-28-12-33-26l-7-29c-3-9-2-19-2-28 1-5 3-9 2-14-3-10-1-21 3-30 4-10 4-20 8-28 8-11 20-17 32-19 2-1 8-1 7-4-4-2-9-1-14-2h-2zM755 732c-4 1-3 5-2 8a2062 2062 0 0 1 34 151c6 30 13 61 17 91l16 95 5 40 15 135c0 3 1 8 4 8l15-1 1-12 1-430-1-50c-1-5-7-4-10-5-27-3-53-11-78-22-6-2-11-7-17-8zM982 731c-6 2-9 6-15 8-17 8-35 14-54 19-13 2-26 3-38 6-2 4-1 8-1 12l-1 211v264c1 2-1 6 1 8h22c2-4 1-9 2-14 5-63 13-125 21-188 5-35 10-70 17-104 4-26 9-51 15-76l20-89 13-51c0-2 1-6-2-6zM1397 802c-3 1-1 7-2 10l1 39c25 39 47 80 65 122 7 17 12 34 20 50 4 7 12 7 18 11 7 3 15 7 22 12 4 1 3-5 2-7-5-20-13-39-21-58 0-6-5-11-6-16a819 819 0 0 0-91-156c-2-3-4-7-8-7zM1299 700c-4 1-9 5-11 9 0 5 5 7 7 11l39 40c3 2 4-3 4-6-1-8 0-17-4-25-9-11-20-20-32-28l-3-1zM1252 749c-14 15-26 32-39 48 1 4 5 6 8 9 21 20 42 42 61 64l41 55c4 6 7 13 13 18 3-2 0-7 1-10l-1-91c-16-21-33-41-51-61-9-11-19-23-32-32h-1zM1398 950c-3 2-1 6-2 10-1 22-2 44 1 65 1 5 8 3 11 2l21-4c3-3 0-8-1-11a588 588 0 0 0-30-62zM1188 863c-4 2-3 8-4 11-4 24-5 49-4 73 19 19 40 37 57 58 16 19 31 39 43 61 4 4 9-1 13-2 8-5 18-9 28-11 4-2 1-8-1-11a686 686 0 0 0-129-178l-3-1zM1208 1050c-3 3-3 8-4 11l-11 51-22 77c-3 7-6 14-7 21l-8 24c-3 7-7 15-8 23 2 4 8 2 11 2h177c3-3 1-8 2-13-1-3 2-11-3-12-8-2-19-4-24-12-4-8-1-18-3-26-5-3-8-7-12-11-5-4-14-2-18-9-11-15-11-35-15-53-5-14-16-24-25-36l-29-37h-1zM1416 1066c-2 0-7 1-5 4 8 3 18 5 24 12 9 10 9 25 13 37s5 24 2 36c-2 7 1 13 0 20 0 9-3 16-6 24-3 9-1 19-8 26-7 10-19 15-31 16-3 1-8 0-8 4 5 3 12 2 18 2 13 1 28-1 40-7 29-14 47-46 46-78 1-17-3-34-11-49a84 84 0 0 0-74-47zM1358 540c-8 0-16-1-23 3-3 3-4 10-1 14 5 3 12 2 18 3 15 0 30 1 44-2 7-4 4-16-4-16-11-2-22-2-34-2zM1370 296l-31 1c-1 24 3 49 4 74 2 43 3 87-9 129-1 6-4 12-4 18 1 4 4 8 8 9h58c6-6 6-16 3-24l-5-19c-5-30-5-61-5-91 0-29 2-57 4-85 0-4 1-9-2-12h-21zM1492 219c-4 1-4 7-5 10-2 12-4 25-11 36-6 13-15 25-26 33-13 11-30 17-45 22-2 7-2 15-3 22 0 14-3 28-2 43 1 4 7 3 11 4 26 2 47 20 61 41 11 16 15 34 16 53 0 2 3 5 5 2 12-15 21-32 28-49 6-14 10-29 13-44 4-13 2-27 3-41a180 180 0 0 0-11-70c-3-6-4-13-8-18a329 329 0 0 0-26-44z" style="paint-order:markers fill stroke"/><path d="M1481 161c-3 1 0 5 0 8 3 12 4 27 14 36a228 228 0 0 1 44 73c10 27 10 56 9 84-2 38-11 77-32 110-7 13-17 24-25 36-6 10-6 22-11 32-2 2-3 8 1 7 9-6 16-14 24-21a241 241 0 0 0 68-230 233 233 0 0 0-87-133l-5-2zM1314 318c-20 0-39 7-57 17-22 13-41 33-52 56-1 3-1 8 3 8 12-7 25-15 39-18 23-6 49-9 71 0l10 5c3-4 2-10 2-14 1-16 2-33-2-49-1-7-9-5-14-5zM1355 96c-3 2-2 8-4 12l-15 69c-5 18-10 36-12 54-1 5 4 6 6 10 10 13 13 30 23 44 1 2 4 0 4-3 2-29 1-59 1-88 0-32 1-64-1-97 0 0-1-2-2-1zM1374 90c-3 1-1 7-2 10v182c0 4 7 6 9 1 8-15 13-33 25-46 6-8 1-19-2-28l-19-80a505 505 0 0 1-11-39zM1180 1272c-11 0-23-1-35 1 2 14 8 26 12 39 20 58 36 118 49 178 2 4 1 10 4 14 8 1 15-2 23-3 5-2 12-2 16-6l-1-215c0-3 0-8-4-7-21-2-43-1-64-1zM1300 1504c-22 0-44 1-66 8-10 3-24 3-31 12-3 5-6 10-6 15 4 1 9-2 14-2 44-8 89-8 133 2 11 1 21 6 32 5 9-2 16-9 26-12 5-3 12-3 16-8 0-4-6-4-9-6-29-6-58-15-88-14h-21zM1264 1543c-22 0-44 1-64 8-10 3-15 14-16 23-1 14-2 28-1 41 2 6 9 2 13 1 36-10 74-16 111-17l33-2c7-14 16-26 26-39 0-4-6-4-9-6a330 330 0 0 0-93-9zM1435 1534c-20 1-38 13-53 25-25 23-40 56-45 89-2 22-2 45 3 67 4 3 8-1 8-5 4-29 3-60 18-86 9-16 18-32 32-44 17-14 39-23 61-21 2 0 8 3 9-1-5-9-13-16-21-22l-12-3zM1317 1653c-43 2-85 7-125 20-4 1-7 4-6 8 3 20 16 36 28 51 3 3 6 9 12 7 33-7 65-17 97-29 7-2 3-11 3-16-2-13-1-27-3-40-2-2-5-1-6-1zM1315 1773l-53 16c-4 3 2 7 4 10 6 6 12 14 20 17 8 0 15-5 19-12l12-28c0-1 0-3-2-3zM1245 1914c-8 1-11 10-15 16-13 25-24 52-36 78 4 8 13 13 20 19l61 47c3 3 8 3 11 0l83-61c4-3-3-6-4-8-35-28-71-55-105-84-4-3-9-7-15-7zM1063 2198c-21 5-40 17-60 26-47 23-92 49-137 75-44 25-86 52-132 72-5 2-13 6-17 1 5-10 18-11 27-18 2-4-6-6-9-7-37-13-71-33-104-55-10-5-19-15-30-18-13 1-21 13-29 21a67 67 0 0 0-19 71c13 32 42 58 76 62 44 4 84-16 121-36 48-28 95-60 143-87 45-26 91-51 138-73 8-5 11-14 20-18 5-4 14-8 15-15l-3-1z" style="paint-order:markers fill stroke"/><path d="M609 2242c-4 1-4 7-5 10-2 6 5 9 9 13 31 23 64 47 101 61 16 6 32 13 48 16 6 1 13-2 15-8 1-5-6-6-10-6-19-5-38-13-57-21-20-9-40-20-59-33-13-9-25-20-37-30l-5-2zM354 2222c-6 1-6 8-8 11l-20 40c-6 10-2 22 0 33a1619 1619 0 0 0 31 121c2-27 1-53 2-80l-1-124-4-1zM375 2222c-4 2-3 7-4 10v187c1 2 0 7 3 6 3-5 3-12 5-18l5-22 12-52 8-34c0-5 3-10 4-15-9-15-16-31-24-47-2-5-4-11-9-15zM524 2102c-11 6-22 13-35 16-25 8-52 9-77 2-5-1-9-4-13-2-2 4 0 9 0 13 1 17 0 34 3 51 0 4 5 6 9 5 30-4 60-14 82-36 14-13 25-28 33-46 1-1 0-3-2-3zM370 1991c-12 0-24-1-35 3-7 3-7 13-5 20 2 14 7 26 8 39 4 36 3 72 2 108l-3 46c-1 4 5 3 8 3 15 0 29 1 44-1 4-2 2-7 2-11-4-43-5-87-3-131 2-20 8-40 13-60 1-7-7-11-11-17l-20 1zM362 1958c-9 0-19-1-28 3-5 2-5 10 0 13 12 8 27 5 41 5 7 0 14 1 20-1 2-1 0-3 0-4 4-2 7-8 3-11-6-5-15-4-23-5h-13zM249 1956c-6 3-11 9-17 14-17 16-33 34-46 54-10 15-18 31-23 49-5 13-7 27-10 40a253 253 0 0 0 12 123 260 260 0 0 0 82 111c1 1 5 3 6 0l-11-35c-3-7-9-12-13-18-17-19-29-42-36-67-3-9-7-18-8-28-5-24-8-49-4-73a237 237 0 0 1 40-106c5-9 12-16 18-23 6-8 5-19 9-27 1-5 3-9 2-14h-1z" style="paint-order:markers fill stroke"/><path d="M239 2015c-4 3-6 7-9 11-7 9-12 19-16 30l-7 14c-4 9-6 19-9 28s-4 18-5 27l-1 53c5 15 6 30 11 45 4 11 8 22 14 32 6 11 11 21 19 30 1 1 4 2 4-1 3-9 3-19 7-28 3-10 8-21 15-29 12-16 28-30 48-37 5-3 12-3 16-8 3-7 2-16 3-23 0-12 2-25 1-37-1-4-5-6-9-6-24-5-45-21-60-41-11-14-15-31-19-48l-2-12h-1zM848 1272c-6-1-10 3-10 8l-19 176c-17 109-37 217-65 323-1 8-6 16-5 24 9-1 16-8 25-11 27-12 56-16 85-20 2-21 1-42 1-63v-436c-3-2-9 0-12-1zM886 1272c-4 1-14-2-13 5l-1 484c0 5 0 13 7 12 35 4 71 13 102 31 2 4 8 0 5-4a2674 2674 0 0 1-87-491c-1-12 0-26-3-38l-10 1zM210 1486c-3 1-1 6-1 8 3 9 7 17 9 26 10 27 22 53 33 80a760 760 0 0 0 79 127c1 2 5 4 5 0v-48c-12-18-23-37-33-55l-24-51-13-32c-4-11-9-23-12-35-4-6-12-4-18-7a115 115 0 0 1-25-13zM395 1766c-2 6-1 12-1 18 0 5-2 11 0 16 12 10 21 22 35 29 6 3 12-2 15-7 0-6-6-10-10-15l-38-40-1-1zM395 1587c-3 2-1 7-2 10 0 29 0 58 3 87 4 10 13 19 20 28 19 24 39 48 62 70 4 3 6-3 9-5 11-14 23-28 33-43a779 779 0 0 1-121-144c-1-1-2-3-4-3zM332 1503l-28 5c-3 2 0 7 0 10 7 20 17 39 26 58 0 2 4 4 4 0 2-18 1-37 1-56-1-5 1-11-1-17h-2zM448 1465c-12 4-24 12-36 16-4 2 0 7 1 9 20 47 50 88 81 126 15 18 30 36 47 52 2 3 6 2 7-2 7-26 6-53 6-80-19-20-41-39-60-60l-44-60-2-1z" style="paint-order:markers fill stroke"/></g><g fill="#272e2e" fill-rule="evenodd" stroke-opacity="0"><path d="M903 116c-34 0-70 1-100 19-33 17-63 38-91 62-9 8-6 21-15 29-3 2-7 8-1 8 9 0 24 1 25 13-1 17-20 27-36 26-6 2 1 9 4 10 7 2 13-5 19-6 77-34 149-78 220-122 16-11 35-18 49-31 2-6-7-5-10-6-21-2-43-2-64-2zM715 604c-4 3 2 10 2 14l27 89c8 12 23 16 35 23 24 13 52 21 80 19 5-22-4-45-16-64-14-18-37-22-56-32-27-12-48-31-70-49h-2zM1019 604c-14 9-25 23-40 32-23 16-51 25-75 40-21 16-30 43-29 68 0 9 11 7 17 6 34-5 67-18 95-39 11-11 12-29 17-43 6-21 14-41 17-63l-2-1zM374 536c-13 8-24 20-35 30a755 755 0 0 0-148 176c-16 27-23 58-30 88-4 24-4 53 12 73 24 22 55 34 86 42 23 7 51 4 68-14 16-16 28-36 36-57 3-12 8-24 7-36-4-4-9 4-13 6-10 8-19 21-33 23-4 0-7-5-3-8 19-16 37-32 51-52 23-33 35-72 52-108 13-31 27-60 42-90-9-13-24-21-36-31-18-14-35-30-54-42h-2zM459 751c-17 6-36 7-51 18-8 7-10 23-2 31 13 0 25-7 38-9 19-7 39-10 57-17 3-4-4-9-6-14-4-5-8-11-13-15l-23 6zM543 867c-32 3-64 13-96 12-12 2-26-1-38 4-5 7-6 16-8 24 1 7 11 4 15 5 42-1 84-3 125-15 7-2 13-8 11-16 0-5-2-15-9-14zM1277 720c-6 4-12 10-14 17 6 12 18 20 26 30 15 17 29 35 46 50 4-2 1-9 2-13 1-13-2-26-12-35-14-17-29-35-47-48l-1-1zM1206 811c-7 4-9 13-12 20-1 7-5 16 3 21 53 56 102 118 135 188 5 4 3-12 4-17 0-18 3-37-1-55-16-31-38-58-60-86-20-25-41-50-67-71h-2zM1398 882c-5 2-2 11-2 16-1 15 5 30 13 43 12 26 23 52 36 77 4 6 13 7 19 4 1-10-5-19-8-29-16-37-33-74-54-108-1-2-2-4-4-3zM1442 1034c-16 1-33 2-45 11-5 6 6 8 10 8 23 1 45 8 64 21 28 18 43 52 43 85 2 17-3 34-12 49-8 18-24 29-39 41-3 1-4 6 1 5 33 2 62-20 80-46 14-18 20-41 19-63 0-53-45-100-96-109-8-2-17-3-26-2zM563 861c-2 6 1 14 1 21 3 46-8 93-28 135-1 10 4 20 5 30 12 55 26 110 44 164 7 15 8 34 17 48 46-1 92 1 137-1 3-8-2-17-3-25-12-60-31-118-58-172-32-68-68-135-111-196-1-2-2-4-4-4zM1171 860c-8 6-12 18-18 27-56 95-112 191-143 298l-15 66c-2 4 1 9 6 7l132 1c20-46 33-96 46-144 7-25 13-51 17-77-14-18-20-41-24-63-5-35-2-70 3-105-1-3 1-10-4-10zM713 1272c-36 0-73 0-109 2-8 5-7 17-11 25-20 61-40 122-53 185-4 13 6 23 9 35 17 44 21 93 12 139 0 5-3 13 1 17 6-5 9-14 14-21 26-45 54-89 78-136 23-43 43-89 60-135 10-34 20-68 26-104 1-3-1-8-5-7h-22zM1040 1272c-14 1-29-2-43 3-5 5 1 14 1 20 10 48 23 95 43 140 35 80 79 156 126 230 3 5 6-1 5-4-2-44-4-89 15-129 4-11 15-21 10-33-19-76-38-153-65-226-31-2-62-1-92-1zM273 1274c-35 2-69 23-88 53-13 23-18 51-14 77 4 24 16 46 35 62 31 31 81 40 122 25 4-1 9-8 2-10-26-4-53-9-74-26-41-32-51-95-22-138 10-18 27-29 43-41 2-2-2-3-4-3zM269 1507c-5 2 0 9 0 13 15 42 34 83 57 121 2 2 5 11 9 7v-35c-17-31-31-63-44-95-3-8-14-10-22-11zM396 1491c-4 4-1 12-2 18 0 17-1 34 1 51a640 640 0 0 0 131 163c10-7 16-20 17-32-3-10-13-17-20-25-37-38-70-80-97-126-11-16-17-34-28-49h-2zM399 1712c-7 3-4 13-5 19-2 10 1 18 8 24 17 20 35 40 55 56 6-2 11-9 13-15-2-11-13-18-19-26-18-18-34-38-51-58h-1zM1448 1570c-27 1-49 22-63 44-13 21-24 45-23 70 3 5 9-4 12-6 11-9 21-23 36-27 8-1 4 9 0 10-20 17-39 36-51 59-17 27-29 56-42 86-15 33-31 67-44 101-4 9 8 14 13 20 24 19 48 39 74 57 7 2 10-8 15-11 64-62 132-125 173-206 13-25 17-52 25-79 2-19 3-39-4-57-9-16-22-31-39-37-26-12-54-22-82-24zM1318 1608c-44 2-89 9-131 23-8 2-4 13-5 19 0 5 1 14 8 12 40-10 81-19 123-21 6-1 15 0 15-9 1-6 7-14 3-21-3-3-8-2-13-3z" style="paint-order:markers fill stroke"/><path d="M1326 1722c-28 6-54 17-82 24-4 2-12 1-14 6 5 9 11 21 21 26 18 0 36-8 54-14 12-5 28-13 27-29-1-4 2-14-6-13zM851 1785c-36 3-73 14-102 37-13 11-14 31-20 46-6 20-14 40-18 61 3 5 9-5 12-6 25-22 55-38 86-50 28-10 46-37 51-66 1-7 2-15-2-21l-7-1zM880 1784c-6-1-10 5-9 11 1 26 11 55 36 69 23 13 50 18 72 35 15 9 28 24 44 32 4-2-1-8-1-12l-29-93a244 244 0 0 0-113-42zM1041 2242c-19 4-36 16-54 24-79 40-154 87-229 135-4 1-4 6 0 7 28 12 59 14 89 14 49-2 94-24 132-54 21-18 45-33 63-55 5-7 12-13 15-21-12-2-25-1-37-1-7-6-11-16-5-24 7-11 22-13 32-20 2-4-4-5-6-5z" style="paint-order:markers fill stroke"/></g><g fill="#6b4424" fill-rule="evenodd" stroke-opacity="0"><path d="M683 1960c-28 0-51 23-55 49-3 18 4 37 10 54 8 20 21 39 28 60 5 15 9 30 9 45 1 11-1 22 3 32 5 4 11 6 17 8 5-3 2-10 3-15-1-24-1-48-8-70-13-33-33-62-39-96-4-16 1-36 17-44 12-6 30-5 39 7 8 11 5 30-8 36-5 2-15-1-13-8 6-2 14-5 14-13 0-11-14-17-24-12-13 5-16 22-13 35 4 21 15 40 23 59 4 7 7 16 13 22 4 0 2-6 4-8 4-24 8-48 18-70 4-13 12-26 17-38-11-17-28-31-48-33h-7z" style="paint-order:markers fill stroke"/><path d="M625 1975c-19 8-31 28-31 48-2 23 6 45 18 64 12 23 23 46 27 72l6 30c5 2 11 1 16 3 3-1 1-7 2-10 2-26-5-53-17-76-9-23-23-44-28-68-5-19-2-39 6-56 1-2 5-7 1-7zM1040 1959c-18 0-35 10-45 25-2 8 6 15 9 22 1 1 4 8 6 3 1-7 1-14 7-19 13-15 39-14 50 3 9 11 7 27 5 40-6 23-21 43-31 65-3 6-6 12-5 20l1 48c1 3 4 3 5 0 8-11 6-27 12-39 12-32 29-61 40-93 8-25-4-56-28-68-8-5-17-7-26-7z" style="paint-order:markers fill stroke"/><path d="M1039 1992c-9-1-18 6-15 15 2 8 13 7 15 14-3 7-12 7-18 3-2 0-6-4-9-3 6 22 15 44 18 67 0 3 4 3 4 0 9-17 18-34 25-52 2-11 2-22 2-32-6-7-13-13-23-12zM1096 1972c-3 3 2 7 3 10 6 12 11 26 9 41 1 15-7 30-13 44-11 26-26 49-35 75 0 5 5 0 6-2 19-21 30-49 52-68 10-9 9-24 11-36 3-23-7-47-26-60l-7-4zM651 2201c-8 0-12 8-17 13s-11 12-7 20c6 16 21 25 35 34 27 16 54 29 83 41l44 14c14 2 25-9 37-15 9-6 19-10 26-17 2-6-5-10-8-14-26-24-61-33-94-41-31-7-63-15-90-33-3-1-6-3-9-2zM895 257c-5 0 0 5 1 7 21 20 48 30 76 36 18 4 37 9 56 9 4 0 4-5 1-6-10-6-22-9-33-14-32-15-66-25-101-32zM937 205c-12 2-23 10-34 16-9 5-20 10-28 18 0 4 7 3 9 5 34 6 67 14 98 27 35 13 67 30 100 48 3 2 7 1 9-2 8-7 16-15 20-24-32-33-74-55-117-72-18-6-35-12-54-15l-3-1zM840 259c-6 1-11 4-16 6l-55 30c-1 1-5 2-3 4h9c13-4 25-10 37-17 10-5 21-11 29-19 1-1 2-4-1-4zM1036 323l2 93c7 24 20 46 31 68 8 14 11 30 10 46 1 18-17 33-34 32-14 0-28-12-27-27-1-12 11-22 22-23 7 1 5 11-1 13-6 1-9 8-9 14 3 12 19 16 28 8 8-5 12-15 10-25-1-19-12-35-20-52l-13-29c-1-3-4-1-4 2-7 31-15 62-30 90-2 6-7 13-6 19 5 9 13 15 21 21 9 6 19 10 29 8 15 0 32-3 42-15 11-13 15-30 14-46 0-9 2-19-3-28-15-33-36-64-43-100-3-20-1-40-2-60 1-6 1-13-8-10-3 0-7-2-9 1z" style="paint-order:markers fill stroke"/><path d="M1069 326c-4 2-2 9-3 14-1 27-2 56 10 82 14 32 36 61 40 96 2 15-4 29-9 42-1 3 2 4 4 2 14-9 22-26 22-42 3-25-6-48-18-68-19-33-30-70-32-108 0-6-2-12-8-15-2-1-3-3-6-3zM668 384c-5 2-7 7-10 10l-31 48-17 36c-8 18-11 40-4 58 4 10 11 19 19 25 1 2 4 1 4-1-2-8-6-15-6-22-3-26 4-53 17-76 11-19 22-40 28-62 1-5 3-10 1-15l-1-1z" style="paint-order:markers fill stroke"/><path d="M696 357c-3 0-3 4-5 5-4 3-8 6-8 11-1 15-4 30-9 44-6 20-16 38-26 55-11 19-17 41-13 63 2 14 9 28 20 37 12 7 27 10 41 9 10 0 19-4 28-10 8-5 14-13 20-21l-8-16c-13-25-23-52-29-80-1-4-1-9-3-13-2-2-4 1-5 3l-23 50c-5 13-9 28-6 42 2 8 8 14 15 15 9 2 18-3 22-11 2-4 2-11-3-13-3-2-7-1-10-5-2-2-3-7 1-9 7-2 14 3 19 9 4 5 6 12 5 18-1 11-12 20-22 21-11 2-22-1-30-9-7-7-12-16-12-26 0-11 4-22 8-33 8-19 19-38 27-58 9-23 8-48 8-72 0-2 1-6-2-6zM1350 573v493c0 4 4 5 7 4 8-2 17 0 24-3 3-8 1-16 2-24l-1-428v-41c-4-2-10-1-15-2l-17 1zM1352 1239c-5 0-4 7-3 11 0 4 1 9 7 9 8 1 18 1 26-1 2-4 2-10 1-15-7-3-15-3-23-4h-8zM363 1273c-6 1-18 0-19 8 6 9 19 8 28 11 3 0 13 2 11-5-1-5-1-15-9-13l-11-1zM368 1461c-7 0-15-1-21 3 0 156-1 313 1 469 1 5-2 14 5 13 9 0 18 2 25-2 4-27 2-55 3-82v-400c-4-3-9-1-13-1z" style="paint-order:markers fill stroke"/></g><path fill="#272e2e" fill-rule="evenodd" d="M1184 969c-3 5 1 11 2 16 5 22 15 43 31 59l44 51c4 3 4-3 5-6 2-6 10-12 4-19-19-30-41-60-68-85-6-5-11-13-18-16zM471 1439c-6 2-7 10-9 15-3 10 7 18 11 26 22 29 46 56 72 82 2 3 7 0 5-4-4-18-8-38-22-53l-52-64c-1-1-3-3-5-2z" style="paint-order:markers fill stroke"/></svg>
                        </g>
                    `
                }
            };

            const svgContent = isRed ? (faceDesigns[val]?.red || "") : (faceDesigns[val]?.black || "");

            el.innerHTML = `
                <div class="card-back"><div class="pattern-inner"></div></div>
                <div class="card-front face-card-mode">
                    
                    <div class="face-card-wrapper" style="position: absolute; inset: 5%; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                        <svg viewBox="0 0 1696 2528" preserveAspectRatio="xMidYMid meet" style="width: 100%; height: 100%;">
                            ${svgContent} 
                        </svg>
                    </div>

                    <div class="card-corner corner-top-left" style="color:${isRed ? 'var(--red-suit)' : 'var(--black-suit)'}">
                        <span class="corner-val ${tenClass}">${displayVal}</span>
                        <span class="corner-suit">${symbol}</span>
                    </div>
                    <div class="card-corner corner-bottom-right" style="color:${isRed ? 'var(--red-suit)' : 'var(--black-suit)'}">
                        <span class="corner-val ${tenClass}">${displayVal}</span>
                        <span class="corner-suit">${symbol}</span>
                    </div>
                </div>
                ${questionMarkLayer} `;
        } 
        else {
            const innerHTML = this.getCardInnerLayout(val, symbol);
            el.innerHTML = `
                <div class="card-back"><div class="pattern-inner"></div></div>
                <div class="card-front ${colorClass}">
                    <div class="card-corner corner-top-left">
                        <span class="corner-val ${tenClass}">${displayVal}</span>
                        <span class="corner-suit">${symbol}</span>
                    </div>
                    ${innerHTML}
                    <div class="card-corner corner-bottom-right">
                        <span class="corner-val ${tenClass}">${displayVal}</span>
                        <span class="corner-suit">${symbol}</span>
                    </div>
                </div>
                ${questionMarkLayer} `;
        }

                return el;
    },

    getCardInnerLayout(val, symbol) {
        if (val === 'A') return `<div class="card-inner-layout"><div class="layout-ace"><span class="big-ace-symbol">${symbol}</span></div></div>`;
        const n = parseInt(val);
        if (isNaN(n)) return '';
        const pip = `<div class="pip-symbol">${symbol}</div>`;
        const pipRev = `<div class="pip-symbol inverted">${symbol}</div>`;
        let leftCol = '', midCol = '', rightCol = '';

                if (n === 2 || n === 3) {
            leftCol = `<div class="pip-col"></div>`; rightCol = `<div class="pip-col"></div>`;
            midCol = `<div class="pip-col mid-col">${pip}${(n===3) ? pip : ''}${pipRev}</div>`;
        }
        if (n >= 4 && n <= 10) {
            if (n === 4 || n === 5) { leftCol = `<div class="pip-col">${pip}${pipRev}</div>`; rightCol = `<div class="pip-col">${pip}${pipRev}</div>`; } 
            else if (n >= 6 && n <= 8) { leftCol = `<div class="pip-col">${pip}${pip}${pipRev}</div>`; rightCol = `<div class="pip-col">${pip}${pip}${pipRev}</div>`; } 
            else if (n >= 9) { leftCol = `<div class="pip-col">${pip}${pip}${pipRev}${pipRev}</div>`; rightCol = `<div class="pip-col">${pip}${pip}${pipRev}${pipRev}</div>`; }
            if (n === 4 || n === 6) { midCol = `<div class="pip-col mid-col"></div>`; }
            else if (n === 5 || n === 9) { midCol = `<div class="pip-col mid-col">${pip}</div>`; } 
            else if (n === 7) { midCol = `<div class="pip-col mid-col">${pip}<div class="pip-symbol transparent">${symbol}</div></div>`; } 
            else if (n === 8) { midCol = `<div class="pip-col mid-col">${pip}${pipRev}</div>`; } 
            else if (n === 10) { midCol = `<div class="pip-col mid-col" style="justify-content: space-between; padding: 16% 0;">${pip}${pipRev}</div>`; }
        }
        return `<div class="card-inner-layout">${leftCol}${midCol}${rightCol}</div>`;
    },

    disableInput(isDisabled) {
        if (isDisabled) {
            this.els.inputControls.classList.add('disabled');
            this.els.validateBtns.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.3';
            });
        } else {
            this.els.inputControls.classList.remove('disabled');
            this.checkValidationState();
        }
    },

    selectSuit(suit) {
        SoundEngine.init();
        this.state.buildSelection.suit = suit;
        this.els.suitBtns.forEach(btn => btn.classList.remove('selected'));
        document.querySelector(`.suit-btn[data-suit="${suit}"]`).classList.add('selected');
        this.checkValidationState();
    },

    selectVal(val) {
        SoundEngine.init();
        this.state.buildSelection.val = val;
        this.els.valBtns.forEach(btn => btn.classList.remove('selected'));
        document.querySelector(`.val-btn[data-val="${val}"]`).classList.add('selected');
        this.checkValidationState();
    },

    checkValidationState() {
        if (this.state.buildSelection.suit && this.state.buildSelection.val && this.state.selectedCardIndex !== null) {
            this.els.validateBtns.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = '1';
            });
        } else {
            this.els.validateBtns.forEach(btn => {
                btn.disabled = true;
                btn.style.opacity = '0.3';
            });
        }
    },

    resetBuilder() {
        this.state.buildSelection = { val: null, suit: null };
        this.els.suitBtns.forEach(b => b.classList.remove('selected'));
        this.els.valBtns.forEach(b => b.classList.remove('selected'));
        this.checkValidationState();
    },

    validateCardBuild() {
        if (!this.state.buildSelection.val || !this.state.buildSelection.suit || this.state.selectedCardIndex === null) return;
        const idx = this.state.selectedCardIndex;
        const inputCard = { ...this.state.buildSelection };
        const expectedCard = this.state.sequence[idx];
        const physicalCard = this.els.cardDisplayArea.children[idx];

        if (inputCard.val !== expectedCard.val || inputCard.suit !== expectedCard.suit) {
            SoundEngine.playError();
            this.loseLife();
        } else {
            SoundEngine.playHit();
            this.state.solvedMask[idx] = true;
            physicalCard.classList.remove('flipped', 'waiting-input', 'active-slot');
            physicalCard.classList.add('solved');
            this.resetBuilder();

                        const allSolved = this.state.solvedMask.every(v => v === true);
            if (allSolved) {
                this.levelSuccess();
            } else {
                this.autoSelectNextSlot(idx);
            }
        }
    },

    autoSelectNextSlot(currentIdx) {
        let next = -1;
        for (let i = currentIdx + 1; i < this.state.sequence.length; i++) {
            if (!this.state.solvedMask[i]) { next = i; break; }
        }
        if (next === -1) {
            for (let i = 0; i < currentIdx; i++) {
                if (!this.state.solvedMask[i]) { next = i; break; }
            }
        }
        if (next !== -1) { this.selectCardSlot(next); } 
        else { this.state.selectedCardIndex = null; }
    },

    loseLife() {
        if (this.state.configLives !== 0) {
            this.state.lives--;

                        window.LivesManager.update(this.els.livesContainer, this.state.lives, this.state.configLives);
        }
        this.els.inputControls.style.animation = "shake 0.4s ease-in-out";
        setTimeout(() => this.els.inputControls.style.animation = "", 400);

        if (this.state.configLives !== 0 && this.state.lives <= 0) {
            this.gameOver();
        } 
    },

    levelSuccess() {
        this.disableInput(true);
        this.state.selectedCardIndex = null;
        setTimeout(() => {
            this.state.level++;
            this.els.level.textContent = this.state.level;
            this.startLevel();
        }, 1000);
    },

    async gameOver() {
        this.state.isGameRunning = false;
        this.clearAllSafeTimers();
        SoundEngine.playEnd();

                this.els.pauseBtn.style.visibility = 'hidden';
        if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';

        if (this.state.gameMode === 'ranked') {
            this.els.resultsRanked.classList.remove('hidden');
            this.els.resultsSandbox.classList.add('hidden');

                        this.els.rankedScore.textContent = this.state.level;

                        this.saveScoreToDatabase(this.state.level, this.state.configStartCards, this.state.displayTime);

                        const recordKey = `cards_memory_best_ranked_${this.state.displayTime}`;
            let savedBest = localStorage.getItem(recordKey);
            let best = savedBest !== null ? parseInt(savedBest) : null;
            let isRecord = false;

                        if (best === null || this.state.level > best) {
                best = this.state.level;
                localStorage.setItem(recordKey, best);
                isRecord = true;
                const configKey = `cards_memory_ranked_${this.state.displayTime}`;
                this.drawDistributionChart(best, best, configKey);
                this.saveBestScoreToDatabase(best, this.state.configStartCards, this.state.displayTime);
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
            const configKey = `cards_memory_ranked_${this.state.displayTime}`;
            this.drawDistributionChart(this.state.level, best, configKey);

        } else {
            this.els.resultsRanked.classList.add('hidden');
            this.els.resultsSandbox.classList.remove('hidden');

                        if(this.els.results.newRec) {
                this.els.results.newRec.style.visibility = 'hidden';
                this.els.results.newRec.style.opacity = '0';
            }

                        this.els.sandboxScore.textContent = this.state.level;

                        const recordKey = 'cards_memory_best_sandbox';
            let savedBest = localStorage.getItem(recordKey);
            let best = savedBest !== null ? parseInt(savedBest) : 0;

                        if (this.state.level > best) {
                best = this.state.level;
                localStorage.setItem(recordKey, best);
            }
            if (this.els.sandboxBest) this.els.sandboxBest.textContent = best;
        }

        this.updateBestScoreDisplay();
        this.toggleOverlay(this.els.overlayOver, true);
        this.preloadDistributionData();
    },
        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },


    async saveScoreToDatabase(score, startCards, displayTime) {
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
                body: JSON.stringify({ game_id: 'cards_memory', score: score, details: { startCards: startCards, displayTime: displayTime }, guest_id: this.getGuestId()})
            });
        } catch (error) { console.error("Échec sauvegarde DB:", error); }
    },

    async saveBestScoreToDatabase(score, startCards, displayTime) {
        try {
            fetch('/api/best', { 
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    game_mode_key: 'cards_memory_ranked_' + displayTime, 
                    score: score, 
                    details: { startCards: startCards, displayTime: displayTime },
                    guest_id: this.getGuestId()
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

                if (maxX - minX < 10) {
            const center = (maxX + minX) / 2;
            minX = Math.max(0, Math.floor(center - 5));
            maxX = Math.ceil(center + 5);
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
                    ${currentScore}<span style="font-size: 0.65em; margin-left: 1px;">lvl</span>
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
                    ${bestScore}<span style="font-size: 0.65em; margin-left: 1px;">lvl</span>
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
            tooltip.innerHTML = `<strong>${val} lvl</strong><br>${getGameText('results.top') || 'TOP'} ${percentile}%`;
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
        const distKey = configKey || `cards_memory_ranked_${this.state.displayTime}`;
        try {
            const res = await fetch(`/api/scores/distribution/cards_memory?time=${this.state.displayTime}`, {
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

    togglePause() {
        if (!this.state.isGameRunning || this.state.gameMode === 'ranked') return;

                if (this.state.isPaused) {
            this.state.isPaused = false;
            this.state.pauseRequested = false;
            this.updatePauseIcon();
            this.els.pauseBtn.classList.remove('btn-paused-active');
            this.els.cardDisplayArea.classList.remove('paused-blur');
            this.els.inputControls.classList.remove('blurred');
            this.els.validateBtns.forEach(btn => btn.classList.remove('blurred'));
        } else {
            this.state.pauseRequested = !this.state.pauseRequested;
            if (this.state.pauseRequested) {
                this.els.pauseBtn.classList.add('btn-paused-pending');
                this.state.isPaused = true; 
                this.updatePauseIcon();
                this.els.pauseBtn.classList.remove('btn-paused-pending');
                this.els.pauseBtn.classList.add('btn-paused-active');
                this.els.cardDisplayArea.classList.add('paused-blur');
                this.els.inputControls.classList.add('blurred');
                this.els.validateBtns.forEach(btn => btn.classList.add('blurred'));
            } else {
                this.els.pauseBtn.classList.remove('btn-paused-pending');
                this.state.isPaused = false;
                this.updatePauseIcon();
            }
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
                setTimeout(() => this.calculateOptimalLayout(), 100);
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
            setTimeout(() => this.calculateOptimalLayout(), 100);
        }
    },

    enableFallbackFullscreen() {
        this.els.board.classList.add('ios-fullscreen');
        this.updateFullscreenIcon();
        setTimeout(() => this.calculateOptimalLayout(), 100);
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

    updateBestScoreDisplay() {
        const key = this.state.gameMode === 'ranked' ? `cards_memory_best_ranked_${this.state.savedTimeRanked}` : 'cards_memory_best_sandbox';
        const best = localStorage.getItem(key) || 0;
        if(this.els.results.homeBest) this.els.results.homeBest.textContent = best;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CardsMemory.init();
});