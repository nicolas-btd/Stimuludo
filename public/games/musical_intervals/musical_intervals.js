
const musical_intervalsTranslations = {
    fr: {
        header_title: "INTERVALLES MUSIC...",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            inst_synth: "Synthé",
            inst_piano: "Piano",
            inst_guitar: "Guitare",
            title: "Configuration",
            options_title: "Options",
            lives: "Nombre de vies :",
            lives_hint: "Mettez 0 pour des vies infinies.",
            delay: "Délai notes (sec) :",
            ranked_hint: "Mode classé : 3 vies, délai de 0.8s.",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        game: {
            score_label: "SCORE",
            listen: "", 
            guess: "",  
            correct: "Correct !",
            was: "C'était : ",
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer",
            loading: "CHARGEMENT..."
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            score: "Score Final",
            best: "Meilleur",
            you: "Vous",
            avg_time: "Temps Moyen",
            fastest: "Plus rapide",
            slowest: "Plus lent",
            retry: "Réessayer"
        },
        intervals: [
            "2de Mineure", "2de Majeure", "3ce Mineure", "3ce Majeure", 
            "Quarte Juste", "Triton", "Quinte Juste", "6te Mineure", 
            "6te Majeure", "7ème Mineure", "7ème Majeure", "Octave"
        ]
    },
    en: {
        header_title: "MUSICAL INTERVALS",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            inst_synth: "Synth",
            inst_piano: "Piano",
            inst_guitar: "Guitar",
            title: "Settings",
            options_title: "Options",
            lives: "Lives:",
            lives_hint: "Set to 0 for infinite lives.",
            delay: "Note delay (sec):",
            ranked_hint: "Ranked mode: 3 lives, 0.8s delay.",
            cancel: "CANCEL",
            save: "APPLY"
        },
        game: {
            score_label: "SCORE",
            listen: "",
            guess: "",
            correct: "Correct!",
            was: "It was: ",
            ready: "Ready?",
            or: "or",
            to_start: "to start",
            loading: "LOADING..."
        },
        results: {
            new_record: "NEW RECORD!",
            score: "Final Score",
            best: "Best",
            you: "You",
            avg_time: "Avg Time",
            fastest: "Fastest",
            slowest: "Slowest",
            replay: "Retry"
        },
        intervals: [
            "Minor 2nd", "Major 2nd", "Minor 3rd", "Major 3rd", 
            "Perfect 4th", "Tritone", "Perfect 5th", "Minor 6th", 
            "Major 6th", "Minor 7th", "Major 7th", "Octave"
        ]
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.musical_intervals = musical_intervalsTranslations.fr;
    translations.en.musical_intervals = musical_intervalsTranslations.en;
}

function getGameData() {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    return musical_intervalsTranslations[lang] || musical_intervalsTranslations.fr;
}

const GlobalAudio = {
    getVolume() {
        const saved = localStorage.getItem('siteGlobalVolume');
        let vol = saved !== null ? parseInt(saved) / 100 : 0.5;
        return vol * 0.3;
    }
};

document.addEventListener('DOMContentLoaded', () => {

    const IntervalGame = {
        state: {
            currentState: 'PRE_START',
            gameMode: 'ranked',
            score: 0,
            lives: 3,
            maxLives: 3,
            noteDelay: 0.8,
            currentInterval: null,
            baseFreq: 0,
            targetFreq: 0,
            isPlaying: false,
            canAnswer: false,

                        currentInstrument: 'oscillator',

            savedRankedInstrument: 'oscillator',
            savedSandboxInstrument: 'oscillator',
            savedSandboxLives: 3,
            savedSandboxDelay: 0.8,

            operationTimes: [],
            currentOpStartTime: 0,
            distributionDataByConfig: {}
        },

        audioCtx: null,

        instrumentsConfig: {
            'oscillator': { type: 'synth' },
            'piano': { 
                type: 'sampler',
                baseVolume: 3.5,    
                attackOffset: 0, 
                samples: [
                    { note: 'C3',  url: './sounds/piano/Piano.mf.C3.mp3',  baseFreq: 130.81 },
                    { note: 'Gb3', url: './sounds/piano/Piano.mf.Gb3.mp3', baseFreq: 185.00 },
                    { note: 'C4',  url: './sounds/piano/Piano.mf.C4.mp3',  baseFreq: 261.63 },
                    { note: 'Gb4', url: './sounds/piano/Piano.mf.Gb4.mp3', baseFreq: 369.99 },
                    { note: 'C5',  url: './sounds/piano/Piano.mf.C5.mp3',  baseFreq: 523.25 },
                    { note: 'Gb5', url: './sounds/piano/Piano.mf.Gb5.mp3', baseFreq: 739.99 },
                    { note: 'C6',  url: './sounds/piano/Piano.mf.C6.mp3',  baseFreq: 1046.50 }
                ]
            },
            'guitar': { 
                type: 'sampler', 
                baseVolume: 1.8,    
                attackOffset: 0, 
                samples: [
                    { note: 'C3',  url: './sounds/guitar/Guitar.mf.C3.mp3',  baseFreq: 130.81 },
                    { note: 'Gb3', url: './sounds/guitar/Guitar.mf.Gb3.mp3', baseFreq: 185.00 },
                    { note: 'C4',  url: './sounds/guitar/Guitar.mf.C4.mp3',  baseFreq: 261.63 },
                    { note: 'Gb4', url: './sounds/guitar/Guitar.mf.Gb4.mp3', baseFreq: 369.99 },
                    { note: 'C5',  url: './sounds/guitar/Guitar.mf.C5.mp3',  baseFreq: 523.25 }
                ]
            }
        },

        audioBuffers: {},

        intervalsStructure: [
            { semitones: 1, ratio: "16/15" },
            { semitones: 2, ratio: "9/8" },
            { semitones: 3, ratio: "6/5" },
            { semitones: 4, ratio: "5/4" },
            { semitones: 5, ratio: "4/3" },
            { semitones: 6, ratio: "45/32" },
            { semitones: 7, ratio: "3/2" },
            { semitones: 8, ratio: "8/5" },
            { semitones: 9, ratio: "5/3" },
            { semitones: 10, ratio: "9/5" },
            { semitones: 11, ratio: "15/8" },
            { semitones: 12, ratio: "2/1" }
        ],

                intervals: [],

        els: {
            board: document.querySelector('.game-board'),
            gameCenterWrapper: document.querySelector('.game-center-wrapper'),
            statusOverlay: document.getElementById('status-overlay'),
            overlayOver: document.getElementById('game-over-overlay'),

                        restartBtn: document.getElementById('restart-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'), 

                        settingsToggle: document.getElementById('settings-toggle'),
            settingsPanel: document.getElementById('settings-panel'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),
            settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
            modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),

                        fullscreenBtn: document.getElementById('fullscreen-btn'),
            iconExpand: document.getElementById('icon-expand'),
            iconCompress: document.getElementById('icon-compress'),

                        score: document.getElementById('current-score'),
            livesContainer: document.getElementById('lives-container'),
            replayBtn: document.getElementById('replay-btn'),
            statusText: document.getElementById('status-text'),
            answersGrid: document.getElementById('answers-grid'),

                        viewRanked: document.getElementById('results-ranked'),
            viewSandbox: document.getElementById('results-sandbox'),

            inputs: {
                instrumentRanked: document.getElementById('instrument-ranked-val'),
                instrumentSandbox: document.getElementById('instrument-sandbox-val'),
                lives: document.getElementById('lives-val'),
                delay: document.getElementById('delay-val')
            },

                        results: {
                rankedScore: document.getElementById('ranked-score'),
                sandboxScore: document.getElementById('sandbox-score'),
                newRec: document.getElementById('new-record-msg'),
                markerCurrent: document.getElementById('marker-current'),
                markerBest: document.getElementById('marker-best'),
                statAvgTime: document.getElementById('stat-avg-time'),
                statFastest: document.getElementById('stat-fastest'),
                statSlowest: document.getElementById('stat-slowest'),
                historyChart: document.getElementById('history-chart')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('instrument')) {
                this.state.savedInstrumentRanked = params.get('instrument');
            }

            this.loadUserPreferences();
            this.updateSettingsView(this.state.gameMode);
            this.loadBackgroundPreference();
            this.bindEvents();

            this.els.score.innerText = "0";

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
                this.els.gameCenterWrapper.classList.remove('blurred');
                this.startGame();
            } else {
                this.setPreStartState();
            }
            const initKey = `mi_ranked_${this.state.currentInstrument}`;
            this.preloadDistributionData(initKey);
        },

        loadUserPreferences() {
            const c = this.els.inputs;
            const savedInstR = localStorage.getItem('mi_ranked_inst');
            if (savedInstR) {
                if(c.instrumentRanked) c.instrumentRanked.value = savedInstR;
                this.state.savedRankedInstrument = savedInstR;
            }

            const savedInstS = localStorage.getItem('mi_sandbox_inst');
            if (savedInstS) {
                if(c.instrumentSandbox) c.instrumentSandbox.value = savedInstS;
                this.state.savedSandboxInstrument = savedInstS;
            }

            const savedLives = localStorage.getItem('mi_sandbox_lives');
            if (savedLives !== null) {
                if(c.lives) c.lives.value = savedLives;
                this.state.savedSandboxLives = parseInt(savedLives);
            }

            const savedDelay = localStorage.getItem('mi_sandbox_delay');
            if (savedDelay !== null) {
                if(c.delay) c.delay.value = savedDelay;
                this.state.savedSandboxDelay = parseFloat(savedDelay);
            }

            if(this.state.gameMode === 'ranked') {
                this.state.currentInstrument = this.state.savedRankedInstrument;
            } else {
                this.state.currentInstrument = this.state.savedSandboxInstrument;
            }
        },

        restoreConfigUI() {
            const c = this.els.inputs;
            if(c.instrumentRanked) c.instrumentRanked.value = this.state.savedRankedInstrument;
            if(c.instrumentSandbox) c.instrumentSandbox.value = this.state.savedSandboxInstrument;
            if(c.lives) c.lives.value = this.state.savedSandboxLives;
            if(c.delay) c.delay.value = this.state.savedSandboxDelay;
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

        buildIntervalsList() {
            const data = getGameData();
            const names = data.intervals;
            this.intervals = this.intervalsStructure.map((struct, i) => ({
                ...struct,
                name: names[i] || "Unknown"
            }));
        },

        setPreStartState() {
            if (this.audioCtx) {
                this.audioCtx.close();
                this.audioCtx = null;
            }
            this.state.currentState = 'PRE_START';
            this.state.isPlaying = false;
            this.toggleOverlay(this.els.overlayOver, false);

                        this.buildIntervalsList();
            this.generateGrid();

                        if (this.state.gameMode === 'ranked') {
                this.state.maxLives = 3;
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.state.maxLives = this.state.savedSandboxLives;
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
            }
            this.state.lives = this.state.maxLives;

                        this.els.score.innerText = "0";


                                    window.LivesManager.setup(this.els.livesContainer, this.state.maxLives, this.state.lives);

            this.els.gameCenterWrapper.classList.add('blurred');

                        const data = getGameData();
            const mainText = data.game.ready;
            const orText = data.game.or || 'ou';
            const startText = data.game.to_start || 'pour commencer';

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
        },

        toggleOverlay(el, show) {
            if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
            else { el.classList.remove('visible'); el.classList.add('hidden'); }
        },

        bindEvents() {
            this.els.modeToggleRadios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.updateSettingsView(e.target.value);
                });
            });

            this.els.restartBtn.addEventListener('click', () => {
                this.toggleOverlay(this.els.overlayOver, false);
                if (this.state.gameMode === 'sandbox') this.startGame();
                else this.setPreStartState();
            });

                        if (this.els.ingameRestartBtn) {
                this.els.ingameRestartBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleOverlay(this.els.overlayOver, false);
                    if (this.state.gameMode === 'sandbox') this.startGame();
                    else this.setPreStartState();
                });
            }

            this.els.replayBtn.addEventListener('click', () => this.playSequence(true));

            if (this.els.fullscreenBtn) {
                this.els.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
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

            this.els.settingsToggle.addEventListener('click', (e) => {
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
            this.els.closeSettings.addEventListener('click', () => this.toggleSettings(true));

                        this.els.saveSettings.addEventListener('click', async () => {
                if (!this.audioCtx) this.initAudio();

                                const originalText = this.els.saveSettings.innerText;
                this.els.saveSettings.innerText = "...";

                                const selectedMode = document.querySelector('input[name="mode-toggle"]:checked').value;
                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);

                const c = this.els.inputs;
                if(c.instrumentRanked) {
                    localStorage.setItem('mi_ranked_inst', c.instrumentRanked.value);
                    this.state.savedRankedInstrument = c.instrumentRanked.value;
                }
                if(c.instrumentSandbox) {
                    localStorage.setItem('mi_sandbox_inst', c.instrumentSandbox.value);
                    this.state.savedSandboxInstrument = c.instrumentSandbox.value;
                }
                if(c.lives) {
                    localStorage.setItem('mi_sandbox_lives', c.lives.value);
                    const parsedLives = parseInt(c.lives.value, 10);
                    this.state.savedSandboxLives = isNaN(parsedLives) ? 3 : parsedLives;
                }
                if(c.delay) {
                    localStorage.setItem('mi_sandbox_delay', c.delay.value);
                    this.state.savedSandboxDelay = parseFloat(c.delay.value) || 0.8;
                }

                if (this.state.gameMode === 'ranked') {
                    this.state.currentInstrument = this.state.savedRankedInstrument;
                } else {
                    this.state.currentInstrument = this.state.savedSandboxInstrument;
                }

                                await this.loadInstrumentSound(this.state.currentInstrument);

                this.els.saveSettings.innerText = originalText;

                                const configKey = `mi_ranked_${this.state.currentInstrument}`;
                this.preloadDistributionData(configKey);
                this.toggleSettings(true);

                                if (this.state.gameMode === 'sandbox') {
                    this.startGame();
                } else {
                    this.setPreStartState();
                }
            });

            document.addEventListener('click', (e) => {
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const clickedInside = this.els.settingsPanel.contains(e.target) || this.els.settingsToggle.contains(e.target);
                if(isMenuOpen && !clickedInside) {
                    this.toggleSettings(true);
                }
            });

            this.els.board.addEventListener('click', (e) => {
                if (this.state.currentState === 'PRE_START' && !e.target.closest('button')) {
                    this.startGame();
                }
            });

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = !this.els.settingsPanel.classList.contains('panel-hidden');
                const isOver = this.els.overlayOver.classList.contains('visible');

                if (e.key.toLowerCase() === 'f') this.toggleFullscreen();

                if (e.code === 'Space' && !isMenuOpen && !isOver) {
                    e.preventDefault(); 
                    if (this.state.currentState === 'PRE_START') {
                        this.startGame();
                    } else if (this.state.currentState === 'PLAYING') {
                        this.playSequence(true);
                    }
                }
                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }
                if (e.code === 'Enter') {
                    if (isMenuOpen) {
                        e.preventDefault();
                        this.els.saveSettings.click(); 
                    } else if (isOver) {
                        e.preventDefault();
                        this.els.restartBtn.click();
                    } else if (this.state.currentState === 'PRE_START') {
                        e.preventDefault();
                        this.startGame();
                    }
                }
            });
            window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
            });
        },

        initAudio() {
            if (!this.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext();
            }
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        },

        playUIHit() {
            if (!this.audioCtx) this.initAudio();
            const volMod = GlobalAudio.getVolume();
            if (volMod === 0) return;

            const t = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

                        osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t); 

                        gain.gain.setValueAtTime(0.06 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

                        osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.03);
        },

        playUIError() {
            if (!this.audioCtx) this.initAudio();
            const volMod = GlobalAudio.getVolume();
            if (volMod === 0) return;

            const t = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

                        osc.type = 'sine';
            osc.frequency.setValueAtTime(150, t);

                        gain.gain.setValueAtTime(0.10 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.02);

                        osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.02);
        },

        playUIEnd() {
            if (!this.audioCtx) this.initAudio();
            const volMod = GlobalAudio.getVolume();
            if (volMod === 0) return;

            const t = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

                        osc.type = 'sine';
            osc.frequency.setValueAtTime(300, t);

                        gain.gain.setValueAtTime(0.08 * volMod, t);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);

                        osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(t);
            osc.stop(t + 0.3);
        },

        async loadInstrumentSound(key) {
            const config = this.instrumentsConfig[key];
            if (!config || config.type !== 'sampler') return;

            if (!this.audioCtx) this.initAudio();

            if (!this.audioBuffers[key]) {
                this.audioBuffers[key] = [];
            }

            const promises = config.samples.map(async (sampleConfig) => {
                const alreadyLoaded = this.audioBuffers[key].find(b => b.baseFreq === sampleConfig.baseFreq);
                if (alreadyLoaded) return;

                try {
                    const response = await fetch(sampleConfig.url);
                    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                    const arrayBuffer = await response.arrayBuffer();
                    const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);

                                        this.audioBuffers[key].push({
                        buffer: audioBuffer,
                        baseFreq: sampleConfig.baseFreq
                    });
                } catch (error) {
                    console.warn(`Erreur chargement sample ${key} ${sampleConfig.note}:`, error);
                }
            });

            await Promise.all(promises);
        },

        playTone(freq, startTime, duration = 0.6) {
            if (!this.audioCtx) return;

            const config = this.instrumentsConfig[this.state.currentInstrument];
            const rawVol = GlobalAudio.getVolume(); 
            let finalGain = rawVol; 

            const gainNode = this.audioCtx.createGain();
            gainNode.connect(this.audioCtx.destination);

            if (config && config.type === 'sampler' && 
                this.audioBuffers[this.state.currentInstrument] && 
                this.audioBuffers[this.state.currentInstrument].length > 0) {

                const buffersList = this.audioBuffers[this.state.currentInstrument];
                let bestSample = buffersList[0];
                let minDiff = Math.abs(freq - bestSample.baseFreq);

                for (let i = 1; i < buffersList.length; i++) {
                    const diff = Math.abs(freq - buffersList[i].baseFreq);
                    if (diff < minDiff) {
                        minDiff = diff;
                        bestSample = buffersList[i];
                    }
                }

                const source = this.audioCtx.createBufferSource();
                source.buffer = bestSample.buffer;
                const rate = freq / bestSample.baseFreq;
                source.playbackRate.value = rate;

                const monoMixer = this.audioCtx.createGain();
                monoMixer.channelCount = 1;             
                monoMixer.channelCountMode = 'explicit'; 
                monoMixer.channelInterpretation = 'speakers'; 

                const instruBoost = config.baseVolume !== undefined ? config.baseVolume : 1.0;
                const mp3Volume = finalGain * instruBoost; 

                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(mp3Volume, startTime + 0.005);
                gainNode.gain.setValueAtTime(mp3Volume, startTime + duration);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration + 1.5);

                source.connect(monoMixer);
                monoMixer.connect(gainNode);

                                let startOffset = config.attackOffset !== undefined ? config.attackOffset : 0.02;
                if (rate < 1.0) startOffset += 0.02; 

                source.start(startTime, startOffset);
                source.stop(startTime + duration + 2.0); 
            } else {
                const osc = this.audioCtx.createOscillator();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                const synthVol = finalGain * 0.4;

                                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(synthVol, startTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);     

                                osc.connect(gainNode);
                osc.start(startTime);
                osc.stop(startTime + duration);
            }
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

        async startGame() {
            this.state.currentState = 'PLAYING';
            this.buildIntervalsList();
            this.generateGrid();
            this.initAudio();

            if (this.state.gameMode === 'ranked') {
                this.state.maxLives = 3;
                this.state.noteDelay = 0.8;
                this.state.currentInstrument = this.state.savedRankedInstrument;
                if (this.els.ingameRestartBtn) {
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                }
            } else {
                this.state.maxLives = this.state.savedSandboxLives;
                this.state.noteDelay = this.state.savedSandboxDelay;
                this.state.currentInstrument = this.state.savedSandboxInstrument;
                if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.display = 'none';
            }

            const chosenInstrument = this.state.currentInstrument;

            if (chosenInstrument !== 'oscillator' && 
               (!this.audioBuffers[chosenInstrument] || this.audioBuffers[chosenInstrument].length === 0)) {

                                this.els.statusOverlay.innerHTML = `<div class="status-main-text">${getGameData().game.loading}</div>`;
                this.els.statusOverlay.classList.remove('hidden');
                this.els.gameCenterWrapper.classList.add('blurred');
                document.body.style.cursor = 'wait';

                await this.loadInstrumentSound(chosenInstrument);

                document.body.style.cursor = 'default';
            }

                        this.els.statusOverlay.classList.add('hidden');
            this.els.gameCenterWrapper.classList.remove('blurred');
            this.toggleOverlay(this.els.overlayOver, false);

            this.state.score = 0;
            this.state.lives = this.state.maxLives;
            this.state.operationTimes = [];

                        this.els.score.innerText = "0";


                                    window.LivesManager.setup(this.els.livesContainer, this.state.maxLives, this.state.lives);
            this.nextRound();
        },

        generateGrid() {
            this.els.answersGrid.innerHTML = '';
            this.intervals.forEach(interval => {
                const btn = document.createElement('button');
                btn.className = 'answer-btn';
                btn.innerHTML = `<span class="btn-name">${interval.name}</span><span class="ratio-text">${interval.ratio}</span>`;
                btn.dataset.semitones = interval.semitones;
                btn.addEventListener('click', () => this.checkAnswer(interval.semitones, btn));
                this.els.answersGrid.appendChild(btn);
            });
        },

        nextRound() {
            this.state.canAnswer = false;
            this.els.replayBtn.classList.remove('disabled');
            this.resetButtons();

            const randomIndex = Math.floor(Math.random() * this.intervals.length);
            this.state.currentInterval = this.intervals[randomIndex];

            const minMidi = 48; 
            const maxMidi = 72;
            const baseMidi = Math.floor(Math.random() * (maxMidi - minMidi + 1)) + minMidi;

                        this.state.baseFreq = 440 * Math.pow(2, (baseMidi - 69) / 12);
            this.state.targetFreq = this.state.baseFreq * Math.pow(2, this.state.currentInterval.semitones / 12);

            this.playSequence(false);
        },

        playSequence(isManual = false) {
            if (this.state.isPlaying || !this.audioCtx) return;
            if (isManual && !this.state.canAnswer) return;

            this.state.isPlaying = true;
            this.els.replayBtn.classList.add('playing');

                        this.els.statusText.innerText = ""; 
            this.els.statusText.style.color = "var(--text-secondary)";

            const now = this.audioCtx.currentTime;
            this.playTone(this.state.baseFreq, now, 0.6);
            this.playTone(this.state.targetFreq, now + this.state.noteDelay, 0.8);

            const totalDuration = (this.state.noteDelay * 1000) + 800;
            setTimeout(() => {
                this.state.isPlaying = false;
                this.els.replayBtn.classList.remove('playing');
                if (!isManual || this.state.canAnswer) {
                    this.els.statusText.innerText = "";
                    this.els.statusText.style.color = "var(--accent-color)";
                    this.state.canAnswer = true;
                    this.state.currentOpStartTime = performance.now();
                }
            }, totalDuration);
        },

        checkAnswer(semitones, btn) {
            if (!this.state.canAnswer) return;
            this.state.canAnswer = false;
            this.els.replayBtn.classList.add('disabled');

                        const data = getGameData();
            const timeTaken = (performance.now() - this.state.currentOpStartTime) / 1000;

            if (semitones === this.state.currentInterval.semitones) {
                this.playUIHit(); 
                btn.classList.add('btn-correct');
                this.state.score++;
                this.els.score.innerText = this.state.score;
                this.els.statusText.innerText = data.game.correct;
                this.els.statusText.style.color = "var(--accent-color)";
                this.state.operationTimes.push(timeTaken);

                                setTimeout(() => this.nextRound(), 1000);
            } else {
                this.playUIError(); 
                btn.classList.add('btn-wrong');
                const correctBtn = Array.from(this.els.answersGrid.children)
                    .find(b => parseInt(b.dataset.semitones) === this.state.currentInterval.semitones);
                if (correctBtn) correctBtn.classList.add('btn-correct');

                if (this.state.maxLives > 0) {
                    this.state.lives--;
                    window.LivesManager.update(this.els.livesContainer, this.state.lives, this.state.maxLives);
                }

                this.els.statusText.innerText = `${data.game.was} ${this.state.currentInterval.name}`;
                this.els.statusText.style.color = "var(--accent-color-secondary)";

                if (this.state.maxLives > 0 && this.state.lives <= 0) {
                    setTimeout(() => this.gameOver(), 1500);
                } else {
                    setTimeout(() => this.nextRound(), 1500);
                }
            }
        },

        resetButtons() {
            Array.from(this.els.answersGrid.children).forEach(btn => {
                btn.classList.remove('btn-correct', 'btn-wrong');
            });
        },

        async gameOver() {
            this.playUIEnd(); 
            this.state.isPlaying = false;
            this.state.currentState = 'FINISHED';

                        if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked.classList.remove('hidden');
                this.els.viewSandbox.classList.add('hidden');
                this.els.results.rankedScore.innerText = this.state.score;

                                this.saveScoreToDatabase(this.state.score, this.state.currentInstrument);

                                const recordKey = `intervals_best_ranked_${this.state.currentInstrument}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                                if (best === null || this.state.score > best) {
                    best = this.state.score;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.currentInstrument);
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

                                const chartKey = `mi_ranked_${this.state.currentInstrument}`;
                this.drawDistributionChart(this.state.score, best, chartKey);

                            } else {
                this.els.viewRanked.classList.add('hidden');
                this.els.viewSandbox.classList.remove('hidden');
                if(this.els.results.newRec) {
                    this.els.results.newRec.style.visibility = 'hidden';
                    this.els.results.newRec.style.opacity = '0';
                }
                this.els.results.sandboxScore.innerText = this.state.score;

                if (this.state.operationTimes.length > 0) {
                    const sum = this.state.operationTimes.reduce((a, b) => a + b, 0);
                    const avg = (sum / this.state.operationTimes.length).toFixed(2);
                    const fastest = Math.min(...this.state.operationTimes).toFixed(2);
                    const slowest = Math.max(...this.state.operationTimes).toFixed(2);

                    if (this.els.results.statAvgTime) this.els.results.statAvgTime.textContent = `${avg}s`;
                    if (this.els.results.statFastest) this.els.results.statFastest.textContent = `${fastest}s`;
                    if (this.els.results.statSlowest) this.els.results.statSlowest.textContent = `${slowest}s`;

                    if (this.els.results.historyChart) {
                        this.els.results.historyChart.innerHTML = '';
                        const minTime = Math.min(...this.state.operationTimes);
                        const maxTime = Math.max(...this.state.operationTimes);
                        const buffer = (maxTime - minTime) * 0.2; 
                        let chartMin = minTime - buffer;
                        if (chartMin < 0) chartMin = 0; 
                        let chartMax = maxTime + buffer;

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
                            this.els.results.historyChart.appendChild(barContainer);
                        });
                    }
                } else {
                    if (this.els.results.statAvgTime) this.els.results.statAvgTime.textContent = `--s`;
                    if (this.els.results.statFastest) this.els.results.statFastest.textContent = `--s`;
                    if (this.els.results.statSlowest) this.els.results.statSlowest.textContent = `--s`;
                    if (this.els.results.historyChart) this.els.results.historyChart.innerHTML = '';
                }
            }

            this.toggleOverlay(this.els.overlayOver, true);
            const chartKey = `mi_ranked_${this.state.currentInstrument}`;
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


        async saveScoreToDatabase(score, instrument) {
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
                    body: JSON.stringify({ game_id: 'musical_intervals', score: score, details: { mode: 'ranked', instrument: instrument }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, instrument) {
            try {
                fetch('/api/best', { 
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json' 
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `intervals_ranked_${instrument}`, score: score, details: { mode: 'ranked', instrument: instrument }, guest_id: this.getGuestId()})
                });
            } catch (error) { console.error("Échec sauvegarde Best DB:", error); }
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
                this.els.results.markerCurrent.style.display = 'none';
            } else if (currentScore !== null) {
                this.els.results.markerCurrent.style.display = 'block';
                this.els.results.markerCurrent.style.left = `${currentPercent}%`;
                this.els.results.markerCurrent.innerHTML = `
                    <div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div>
                    <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">
                        ${currentScore}
                    </div>`;
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
                        ${bestScore}
                    </div>`;
            } else {
                this.els.results.markerBest.classList.add('hidden');
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
                    if (pointVal >= val) areaToRight += densities[i].y;
                }
                let percentile = (areaToRight / totalArea) * 100;
                percentile = clamp(percentile, 0.1, 99.9);
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
            if (!configKey) configKey = `mi_ranked_${this.state.currentInstrument}`;
            const parts = configKey.split('_');
            const instrument = parts[2];
            try {
                const res = await fetch(`/api/scores/distribution/musical_intervals?instrument=${instrument}`, {
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
        }
    };

    IntervalGame.init();
});