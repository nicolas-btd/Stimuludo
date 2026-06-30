
const commonLanguages = [
    {
        "id": "python",
        "title": "Python",
        "snippets": [
            "def fibonacci(n):\n    if n <= 0:\n        return []\n    elif n == 1:\n        return [0]\n    sequence = [0, 1]\n    while len(sequence) < n:\n        next_val = sequence[-1] + sequence[-2]\n        sequence.append(next_val)\n    return sequence",
            "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\n    def append(self, new_data):\n        new_node = Node(new_data)\n        if self.head is None:\n            self.head = new_node\n            return",
            "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr",
            "def timer_decorator(func):\n    import time\n    def wrapper(*args, **kwargs):\n        start_time = time.time()\n        result = func(*args, **kwargs)\n        end_time = time.time()\n        print(f'Executed in {end_time - start_time:.4f}s')\n        return result\n    return wrapper",
            "def get_active_adults(users):\n    return [\n        user.name.upper() \n        for user in users \n        if user.is_active and user.age >= 18\n    ]",
            "from dataclasses import dataclass\n\n@dataclass\nclass Product:\n    name: str\n    price: float\n    quantity: int = 0\n\n    def total_value(self) -> float:\n        return self.price * self.quantity",
            "def merge_dictionaries(dict1, dict2):\n    merged = dict1.copy()\n    for key, value in dict2.items():\n        if key in merged and isinstance(merged[key], list):\n            merged[key].extend(value)\n        else:\n            merged[key] = value\n    return merged"
        ]
    },
    {
        "id": "javascript",
        "title": "JavaScript",
        "snippets": [
            "const debounce = (func, delay) => {\n  let timeoutId;\n  return (...args) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => {\n      func.apply(null, args);\n    }, delay);\n  };\n};",
            "const processUsers = (users) => {\n  return users\n    .filter(user => user.isActive)\n    .map(user => ({\n      ...user,\n      fullName: `${user.firstName} ${user.lastName}`\n    }))\n    .sort((a, b) => a.age - b.age);\n};",
            "class EventEmitter {\n  constructor() {\n    this.events = {};\n  }\n  on(event, listener) {\n    if (!this.events[event]) {\n      this.events[event] = [];\n    }\n    this.events[event].push(listener);\n  }\n}",
            "const deepClone = (obj) => {\n  if (obj === null || typeof obj !== 'object') {\n    return obj;\n  }\n  if (Array.isArray(obj)) {\n    return obj.map(deepClone);\n  }\n  const clonedObj = {};\n  for (const key in obj) {\n    clonedObj[key] = deepClone(obj[key]);\n  }\n  return clonedObj;\n};",
            "export const useLocalStorage = (key, initialValue) => {\n  const [storedValue, setStoredValue] = useState(() => {\n    try {\n      const item = window.localStorage.getItem(key);\n      return item ? JSON.parse(item) : initialValue;\n    } catch (error) {\n      return initialValue;\n    }\n  });\n  return [storedValue, setStoredValue];\n};",
            "const groupBy = (array, key) => {\n  return array.reduce((result, currentValue) => {\n    (result[currentValue[key]] = result[currentValue[key]] || []).push(\n      currentValue\n    );\n    return result;\n  }, {});\n};"
        ]
    },
    {
        "id": "html",
        "title": "HTML / CSS",
        "snippets": [
            ".card-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1.5rem;\n  padding: 2rem;\n  background-color: #f4f4f4;\n}\n\n.card {\n  border-radius: 8px;\n  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);\n  transition: transform 0.2s ease-in-out;\n}",
            "<nav class=\"main-navigation\">\n  <div class=\"logo-wrapper\">\n    <img src=\"/assets/logo.svg\" alt=\"Company Logo\">\n  </div>\n  <ul class=\"nav-links\">\n    <li class=\"active\"><a href=\"#home\">Dashboard</a></li>\n    <li><a href=\"#settings\">Settings</a></li>\n  </ul>\n</nav>",
            "@keyframes pulse-animation {\n  0% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  50% {\n    transform: scale(1.05);\n    opacity: 0.8;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}",
            "<form class=\"registration-form\">\n  <div class=\"input-group\">\n    <label for=\"username\">Username</label>\n    <input type=\"text\" id=\"username\" required minlength=\"3\">\n  </div>\n  <div class=\"form-actions\">\n    <button type=\"submit\" class=\"btn-primary\">Register</button>\n  </div>\n</form>",
            "@media screen and (max-width: 768px) {\n  .sidebar-layout {\n    flex-direction: column;\n  }\n  .main-content {\n    width: 100%;\n    padding: 1rem;\n  }\n  .desktop-only {\n    display: none !important;\n  }\n}",
            ".custom-button {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.75rem 1.5rem;\n  font-weight: 600;\n  border: 1px solid transparent;\n  border-radius: 0.375rem;\n  cursor: pointer;\n}"
        ]
    },
    {
        "id": "c",
        "title": "C",
        "snippets": [
            "void swap_pointers(int *a, int *b) {\n    int temp = *a;\n    *a = *b;\n    *b = temp;\n}",
            "typedef struct {\n    char name[50];\n    int age;\n    float gpa;\n} Student;\n\nvoid print_student(const Student *s) {\n    printf(\"Name: %s\\n\", s->name);\n    printf(\"Age: %d, GPA: %.2f\\n\", s->age, s->gpa);\n}",
            "int* create_dynamic_array(int size) {\n    int *arr = (int*)malloc(size * sizeof(int));\n    if (arr == NULL) {\n        return NULL;\n    }\n    for(int i = 0; i < size; i++) {\n        arr[i] = i * 2;\n    }\n    return arr;\n}",
            "int binary_search(int arr[], int left, int right, int target) {\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (arr[mid] == target)\n            return mid;\n        if (arr[mid] < target)\n            left = mid + 1;\n        else\n            right = mid - 1;\n    }\n    return -1;\n}",
            "struct Node {\n    int data;\n    struct Node* next;\n};\n\nvoid push_front(struct Node** head_ref, int new_data) {\n    struct Node* new_node = (struct Node*)malloc(sizeof(struct Node));\n    new_node->data = new_data;\n    new_node->next = (*head_ref);\n    (*head_ref) = new_node;\n}",
            "void reverse_string(char* str) {\n    int length = strlen(str);\n    int start = 0;\n    int end = length - 1;\n    char temp;\n    \n    while (start < end) {\n        temp = str[start];\n        str[start] = str[end];\n        str[end] = temp;\n        start++;\n        end--;\n    }\n}"
        ]
    }
];

const coding_speedTranslations = {
    fr: {
        header_title: "DACTYLO-CODE",
        intro: {
            ranked: "CLASSÉ",
            sandbox: "LIBRE"
        },
        settings: {
            title: "Configuration",
            time: "Temps :",
            time_hint: "Durée de la session (0 = infini).",
            lang_title: "Langage :",
            options_title: "Options",
            show_ms: "Afficher les centièmes",
            cancel: "ANNULER",
            save: "APPLIQUER"
        },
        results: {
            new_record: "NOUVEAU RECORD !",
            wpm: "Vitesse (WPM)",
            accuracy: "Précision :",
            errors: "Erreurs :",
            keystrokes: "Frappes",
            best: "Meilleur",
            you: "Vous",
            retry: "REJOUER"
        },
        game: {
            ready: "Prêt ?",
            or: "ou",
            to_start: "pour commencer"
        },
        languages: commonLanguages
    },
    en: {
        header_title: "SPEED CODING",
        intro: {
            ranked: "RANKED",
            sandbox: "SANDBOX"
        },
        settings: {
            title: "Settings",
            time: "Time:",
            time_hint: "Session duration (0 = infinite).",
            lang_title: "Language:",
            options_title: "Options",
            show_ms: "Show milliseconds",
            cancel: "CANCEL",
            save: "APPLY"
        },
        results: {
            new_record: "NEW RECORD!",
            wpm: "Speed (WPM)",
            accuracy: "Accuracy:",
            errors: "Errors:",
            keystrokes: "Keystrokes",
            best: "Best",
            you: "You",
            retry: "PLAY AGAIN"
        },
        game: {
            ready: "Ready?",
            or: "or",
            to_start: "to start"
        },
        languages: commonLanguages
    }
};

if (typeof translations !== 'undefined') {
    translations.fr.coding_speed = coding_speedTranslations.fr;
    translations.en.coding_speed = coding_speedTranslations.en;
}

function getGameText(key) {
    const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
    const cleanKey = key.replace(/^coding_speed\./, '');

    if (!cleanKey) return coding_speedTranslations[lang] || coding_speedTranslations['en'];

    return cleanKey.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, coding_speedTranslations[lang])
        || cleanKey.split('.').reduce((obj, k) => (obj && obj[k]) ? obj[k] : null, coding_speedTranslations['en']);
}

document.addEventListener('DOMContentLoaded', () => {

    const CodingGame = {
        state: {
            gameMode: 'ranked',

            timer: null,
            maxTime: 60,
            timeLeft: 60,
            charIndex: 0,
            chars: [],
            mistakes: 0,
            correctCount: 0,
            isTyping: false,
            isPaused: false,
            totalTyped: 0,
            isComposing: false,
            ignoreNextInput: false,

            savedTimeRanked: 60,
            savedLangRanked: "random",
            savedShowMsRanked: false,

            savedTimeSandbox: 60,
            savedShowMsSandbox: false,
            savedLangSandbox: "javascript",
            distributionDataByConfig: {}
        },

        els: {
            board: document.querySelector('.game-board'),
            statusOverlay: document.getElementById('status-overlay'),
            typingWrapper: document.querySelector('.typing-wrapper'),
            overlayOver: document.getElementById('game-over-overlay'),
            restartBtn: document.getElementById('restart-btn'),
            ingameRestartBtn: document.getElementById('ingame-restart-btn'),

            viewRanked: document.getElementById('results-ranked'),
            viewSandbox: document.getElementById('results-sandbox'),

            settingsToggle: document.getElementById('settings-toggle'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings-btn'),
            settingsPanel: document.getElementById('settings-panel'),

            settingsGroupRanked: document.getElementById('settings-ranked-group'),
            settingsGroupSandbox: document.getElementById('settings-sandbox-group'),
            modeToggleRadios: document.querySelectorAll('input[name="mode-toggle"]'),

            pauseBtn: document.getElementById('pause-btn'),
            fullscreenBtn: document.getElementById('fullscreen-btn'),
            iconExpand: document.getElementById('icon-expand'),
            iconCompress: document.getElementById('icon-compress'),
            icons: { pause: document.getElementById('icon-pause'), play: document.getElementById('icon-play') },

            wrapper: document.querySelector('.typing-wrapper'),
            content: document.getElementById('typing-content'),
            quote: document.getElementById('quote-display'),
            cursor: document.getElementById('smooth-cursor'),
            input: document.getElementById('input-field'),
            bookRef: document.getElementById('book-reference'),
            timer: document.getElementById('timer'),
            currentWpm: document.getElementById('current-wpm'),

            config: {
                timeRanked: document.getElementById('time-ranked-val'),
                langRanked: document.getElementById('lang-ranked-val'),
                showMsRanked: document.getElementById('show-ms-ranked'),

                timeSandbox: document.getElementById('time-sandbox-val'),
                showMsSandbox: document.getElementById('show-ms-sandbox'),
                langSandbox: document.getElementById('lang-sandbox-val'),
            },

            results: {
                rankedWpm: document.getElementById('ranked-wpm'),
                rankedAcc: document.getElementById('ranked-accuracy'),
                rankedErr: document.getElementById('ranked-errors'),

                sandboxWpm: document.getElementById('sandbox-wpm'),
                sandboxAcc: document.getElementById('sandbox-accuracy'),
                sandboxErr: document.getElementById('sandbox-errors'),
                sandboxKeys: document.getElementById('sandbox-keystrokes'),

                newRec: document.getElementById('new-record-msg'),
                markerCurrent: document.getElementById('marker-current'),
                markerBest: document.getElementById('marker-best')
            }
        },

        init() {
            const params = new URLSearchParams(window.location.search);
            if (params.has('mode')) {
                this.state.gameMode = params.get('mode');
            }
            if (params.has('time')) {
                this.state.savedTimeRanked = parseInt(params.get('time'), 10);
            }
            if (params.has('lang')) {
                this.state.savedLangRanked = params.get('lang');
            }

            this.applyMonospaceStyle();
            this.loadUserPreferences();
            this.loadBackgroundPreference();
            this.updateTranslations();
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

            this.resetGame();
            const configKey = `coding_speed_ranked_${this.state.savedLangRanked}_${this.state.savedTimeRanked}`;
            this.preloadDistributionData(configKey);
        },

        updateTranslations() {
            const lang = localStorage.getItem('siteLanguage') || ((navigator.language || navigator.userLanguage).startsWith('fr') ? 'fr' : 'en');
            document.documentElement.setAttribute('lang', lang);

            const translatableElements = document.querySelectorAll('[data-i18n]');
            translatableElements.forEach(el => {
                const key = el.getAttribute('data-i18n');
                const text = getGameText(key);
                if (text) {
                    el.textContent = text;
                }
            });

            this.populateLangDropdowns();

            if (!this.state.isTyping && this.state.charIndex === 0) {
                this.generateText();
            }
        },

        loadUserPreferences() {
            const c = this.els.config;

            const savedTimeR = localStorage.getItem('code_time_ranked');
            if (savedTimeR !== null && c.timeRanked) {
                c.timeRanked.value = savedTimeR;
                this.state.savedTimeRanked = parseInt(savedTimeR);
            }

            const savedLangR = localStorage.getItem('code_lang_ranked');
            if (savedLangR !== null && c.langRanked) {
                c.langRanked.value = savedLangR;
                this.state.savedLangRanked = savedLangR;
            }

            const savedMsR = localStorage.getItem('code_show_ms_ranked');
            if (savedMsR !== null && c.showMsRanked) {
                c.showMsRanked.checked = (savedMsR === 'true');
                this.state.savedShowMsRanked = (savedMsR === 'true');
            }

            const savedTimeS = localStorage.getItem('code_time_sandbox');
            if (savedTimeS !== null && c.timeSandbox) {
                c.timeSandbox.value = savedTimeS;
                this.state.savedTimeSandbox = parseInt(savedTimeS);
            }

            const savedMsS = localStorage.getItem('code_show_ms_sandbox');
            if (savedMsS !== null && c.showMsSandbox) {
                c.showMsSandbox.checked = (savedMsS === 'true');
                this.state.savedShowMsSandbox = (savedMsS === 'true');
            }

            const savedLangS = localStorage.getItem('code_lang_sandbox');
            if (savedLangS && c.langSandbox) {
                c.langSandbox.value = savedLangS;
                this.state.savedLangSandbox = savedLangS;
            }
        },

        applyMonospaceStyle() {
            const styleId = 'coding-game-font-fix';
            if (!document.getElementById(styleId)) {
                const style = document.createElement('style');
                style.id = styleId;
                style.innerHTML = `
                    #quote-display, #quote-display span {
                        font-family: var(--font-typing) !important;
                        letter-spacing: var(--spacing-typing) !important;
                        font-variant-ligatures: none !important;
                    }
                    #smooth-cursor {
                        transition: transform 0.1s cubic-bezier(0.2, 0, 0.2, 1) !important;
                        will-change: transform;
                    }
                `;
                document.head.appendChild(style);
            }
        },

        restoreSettingsUI() {
            const c = this.els.config;

            if (c.timeRanked) c.timeRanked.value = this.state.savedTimeRanked;
            if (c.langRanked) c.langRanked.value = this.state.savedLangRanked;
            if (c.showMsRanked) c.showMsRanked.checked = this.state.savedShowMsRanked;

            if (c.timeSandbox) c.timeSandbox.value = this.state.savedTimeSandbox;
            if (c.showMsSandbox) c.showMsSandbox.checked = this.state.savedShowMsSandbox;
            if (c.langSandbox) c.langSandbox.value = this.state.savedLangSandbox;

            const activeRadio = document.querySelector(`input[name="mode-toggle"][value="${this.state.gameMode}"]`);
            if (activeRadio) activeRadio.checked = true;

            this.updateSettingsView(this.state.gameMode);
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

        loadBackgroundPreference() {
            const savedOpaque = localStorage.getItem('globalOpaque');
            const isOpaque = savedOpaque === 'true' || savedOpaque === null;

            if (isOpaque) document.documentElement.classList.add('global-opaque');
            else document.documentElement.classList.remove('global-opaque');

            this.toggleBackground(isOpaque);
        },

        toggleBackground(isOpaque) {
            if (isOpaque) {
                this.els.board?.classList.add('opaque-mode');
                this.els.settingsPanel?.classList.add('opaque-mode');
            } else {
                this.els.board?.classList.remove('opaque-mode');
                this.els.settingsPanel?.classList.remove('opaque-mode');
            }
        },

        populateLangDropdowns() {
            const data = getGameText('') || coding_speedTranslations.fr;
            const selectRanked = this.els.config.langRanked;
            const selectSandbox = this.els.config.langSandbox;

            if (selectRanked) {
                selectRanked.innerHTML = '';
                const randOpt = document.createElement('option');
                randOpt.value = "random";
                randOpt.textContent = "Aléatoire";
                selectRanked.appendChild(randOpt);
                data.languages.forEach(l => {
                    const opt = document.createElement('option');
                    opt.value = l.id; opt.textContent = l.title;
                    selectRanked.appendChild(opt);
                });
                selectRanked.value = this.state.savedLangRanked;
            }

            if (selectSandbox) {
                selectSandbox.innerHTML = '';
                const randOpt = document.createElement('option');
                randOpt.value = "random";
                randOpt.textContent = "Aléatoire";
                selectSandbox.appendChild(randOpt);
                data.languages.forEach(l => {
                    const opt = document.createElement('option');
                    opt.value = l.id; opt.textContent = l.title;
                    selectSandbox.appendChild(opt);
                });
                selectSandbox.value = this.state.savedLangSandbox;
            }
        },

        startGame() {
            if (this.els.statusOverlay) this.els.statusOverlay.classList.add('hidden');
            if (this.els.typingWrapper) this.els.typingWrapper.classList.remove('blurred');
            this.els.input?.focus();
        },

        setPreStartState() {
            this.state.isTyping = false;
            this.state.isPaused = false;
            this.toggleOverlay(this.els.overlayOver, false);

            if (this.els.statusOverlay) {
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
            }

            if (this.els.typingWrapper) {
                this.els.typingWrapper.classList.add('blurred');
            }

            this.resetGame(false);
        },

        resetGame(shouldStart = true) {
            clearInterval(this.state.timer);
            this.state.isTyping = false;
            this.state.isPaused = false;

            this.toggleOverlay(this.els.overlayOver, false);

            if (shouldStart) {
                if (this.els.statusOverlay) this.els.statusOverlay.classList.add('hidden');
                if (this.els.typingWrapper) this.els.typingWrapper.classList.remove('blurred');
            }

            const val = this.state.gameMode === 'ranked' ? this.state.savedTimeRanked : this.state.savedTimeSandbox;
            this.state.maxTime = (val && val > 0) ? val : 0;
            this.state.timeLeft = this.state.maxTime === 0 ? 0 : this.state.maxTime;

            if (this.els.currentWpm) this.els.currentWpm.innerText = "0";
            this.updateTimerUI();

            this.generateText();

            if (this.els.input) {
                this.els.input.disabled = false;
                this.els.input.value = "";
            }
            if (this.els.cursor) this.els.cursor.style.opacity = 1;

            if (shouldStart) {
                setTimeout(() => this.els.input?.focus(), 50);
            }

            this.updatePosition();

            if (this.els.pauseBtn && this.els.ingameRestartBtn) {
                if (this.state.gameMode === 'ranked') {
                    this.els.pauseBtn.style.display = 'none';
                    this.els.ingameRestartBtn.style.display = 'flex';
                    this.els.ingameRestartBtn.style.visibility = 'visible';
                } else {
                    this.els.ingameRestartBtn.style.display = 'none';
                    this.els.pauseBtn.style.display = 'flex';
                    this.els.pauseBtn.style.visibility = 'visible';
                }
            }
        },

        generateText() {
            const data = getGameText('') || coding_speedTranslations.fr;
            let currentLangId;

            if (this.state.gameMode === 'ranked') {
                currentLangId = this.state.savedLangRanked;
            } else {
                currentLangId = this.state.savedLangSandbox;
            }

            let rawText = "";
            let bookRefText = "";

            let availableLangs = data.languages;
            let selectedLang = availableLangs.find(l => l.id === currentLangId);

            if (!selectedLang || currentLangId === 'random') {
                selectedLang = availableLangs[Math.floor(Math.random() * availableLangs.length)];
            }

            if (selectedLang && selectedLang.snippets.length > 0) {
                let shuffledSnippets = [...selectedLang.snippets].sort(() => Math.random() - 0.5);
                rawText = shuffledSnippets.join("\n\n");
                bookRefText = "Langage : " + selectedLang.title;
            } else {
                rawText = "console.log('Error loading code');";
            }

            if (this.els.quote) {
                let htmlBuffer = "";
                const escapeHTML = (str) => str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

                const len = rawText.length;
                for (let i = 0; i < len; i++) {
                    const char = rawText[i];
                    if (char === '\n') {
                        htmlBuffer += `<span class="newline-char">\n</span>`;
                    } else {
                        htmlBuffer += `<span>${escapeHTML(char)}</span>`;
                    }
                }
                this.els.quote.innerHTML = htmlBuffer;

                this.state.chars = this.els.quote.querySelectorAll("span");
            }

            if (this.els.bookRef) this.els.bookRef.innerText = bookRefText;
            this.state.charIndex = 0;
            this.state.mistakes = 0;
            this.state.correctCount = 0;
            this.state.totalTyped = 0;
            this.state.isComposing = false;
            this.state.ignoreNextInput = false;

            const chars = this.state.chars;
            while (this.state.charIndex < chars.length && chars[this.state.charIndex].textContent === ' ') {
                chars[this.state.charIndex].classList.add("correct", "auto-indented");
                this.state.charIndex++;
            }

            if (this.els.content) this.els.content.style.transform = `translateY(0px)`;
            this.updatePauseIcon();
        },

        handleInput(e) {
            if (this.state.isComposing || this.state.isPaused) return;
            if (this.state.ignoreNextInput) {
                this.state.ignoreNextInput = false;
                if (this.els.input) this.els.input.value = "";
                return;
            }
            if (e.inputType === 'deleteContentBackward') return;

            let char = e.data;
            if (!char && this.els.input?.value) char = this.els.input.value;
            if (char) this.processContentLogic(char);
            if (this.els.input) this.els.input.value = "";
        },

        handleKeydown(e) {
            if (this.state.isPaused) return;

            if (e.key === 'Backspace') {
                if (!this.els.quote) return;
                const chars = this.state.chars; 
                if (this.state.charIndex > 0) {
                    this.state.charIndex--;
                    let currentSpan = chars[this.state.charIndex];

                    if (currentSpan.classList.contains("auto-indented")) {
                        while (this.state.charIndex >= 0 && chars[this.state.charIndex].classList.contains("auto-indented")) {
                            chars[this.state.charIndex].classList.remove("correct", "auto-indented");
                            this.state.charIndex--;
                        }
                        currentSpan = chars[this.state.charIndex];
                    }

                    if (currentSpan.classList.contains("correct")) this.state.correctCount--;
                    if (currentSpan.classList.contains("incorrect")) this.state.mistakes--;
                    currentSpan.classList.remove("correct", "incorrect");

                    this.updatePosition();
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                this.processContentLogic('\n');
            } else if (e.key === 'Tab') {
                e.preventDefault();
            }
        },

        processContentLogic(inputString) {
            if (this.state.isPaused) return;

            for (let i = 0; i < inputString.length; i++) {
                const typed = inputString.charAt(i);
                if (!this.els.quote) return;

                let chars = this.state.chars; 

                if (!this.state.isTyping) {
                    this.startGame();
                    this.startTimer();
                    this.state.isTyping = true;
                }

                if (this.state.charIndex < chars.length && (this.state.maxTime === 0 || this.state.timeLeft > 0)) {
                    const expectedChar = chars[this.state.charIndex].textContent;

                    this.state.totalTyped++;

                    if (expectedChar === typed) {
                        chars[this.state.charIndex].classList.add("correct");
                        this.state.correctCount++;
                    } else {
                        chars[this.state.charIndex].classList.add("incorrect");
                        this.state.mistakes++;
                    }
                    this.state.charIndex++;

                    if (typed === '\n' && expectedChar === '\n') {
                        while (this.state.charIndex < chars.length && chars[this.state.charIndex].textContent === ' ') {
                            chars[this.state.charIndex].classList.add("correct", "auto-indented");
                            this.state.charIndex++;
                        }
                    }

                    this.updatePosition();
                    this.calculateLiveWpm();
                } else if (this.state.charIndex >= chars.length) {
                    this.finishGame();
                }
            }
        },

        updatePosition() {
            if (!this.els.quote || !this.els.cursor || !this.els.content || !this.els.wrapper) return;
            if (!this.state.chars || this.state.chars.length === 0) return;

            if (this.updatePosRAF) cancelAnimationFrame(this.updatePosRAF);

            this.updatePosRAF = requestAnimationFrame(() => {
                const current = this.state.chars[this.state.charIndex] || this.state.chars[this.state.chars.length - 1];
                if (!current) return;

                const currentLeft = current.offsetLeft;
                const currentTop = current.offsetTop;
                const currentHeight = current.offsetHeight;
                const wrapperHeight = this.els.wrapper.offsetHeight;

                this.els.cursor.style.top = '0px';
                this.els.cursor.style.left = '0px';
                this.els.cursor.style.transform = `translate(${currentLeft}px, ${currentTop}px)`;
                this.els.cursor.style.height = currentHeight + 'px';

                const idealOffset = (wrapperHeight - currentHeight) / 2;
                let targetY = idealOffset - currentTop;
                if (targetY > 0) targetY = 0;
                this.els.content.style.transform = `translateY(${targetY}px)`;
            });
        },

        calculateLiveWpm() {
            const timeElapsed = this.state.maxTime === 0 ? this.state.timeLeft : (this.state.maxTime - this.state.timeLeft);
            if (timeElapsed > 0) {
                const minutes = timeElapsed / 60;
                let wpm = Math.round((this.state.correctCount / 5) / minutes);
                if (wpm < 0 || !isFinite(wpm)) wpm = 0;
                if (this.els.currentWpm) this.els.currentWpm.innerText = wpm;
            }
        },

        startTimer() {
            clearInterval(this.state.timer);
            const countUp = this.state.maxTime === 0;
            this.state.timer = setInterval(() => {
                if (countUp) {
                    this.state.timeLeft += 0.01;
                } else {
                    this.state.timeLeft -= 0.01;
                }

                this.state.timeLeft = Math.round(this.state.timeLeft * 100) / 100;
                this.updateTimerUI();

                if (Math.floor(this.state.timeLeft * 100) % 100 === 0) this.calculateLiveWpm();

                if (!countUp && this.state.timeLeft <= 0) {
                    this.state.timeLeft = 0;
                    this.finishGame();
                }
            }, 10);
        },

        updateTimerUI() {
            const el = this.els.timer;
            if (!el) return;
            const countUp = this.state.maxTime === 0;
            const showMs = this.state.gameMode === 'ranked' ? this.state.savedShowMsRanked : this.state.savedShowMsSandbox;

            if (this.state.maxTime === 0 && !this.state.isTyping) {
                el.innerText = "∞";
            } else {
                if (showMs) {
                    el.innerText = this.state.timeLeft.toFixed(2);
                } else {
                    el.innerText = countUp ? Math.floor(this.state.timeLeft) : Math.ceil(this.state.timeLeft);
                }
            }
        },

        togglePause() {
            if (this.state.gameMode === 'ranked') return;
            if (!this.state.isTyping && this.state.charIndex === 0) return;

            this.state.isPaused = !this.state.isPaused;

            if (this.state.isPaused) {
                clearInterval(this.state.timer);
                if (this.els.input) this.els.input.disabled = true;
                if (this.els.cursor) this.els.cursor.style.opacity = 0;
            } else {
                if (this.els.input) {
                    this.els.input.disabled = false;
                    this.els.input.focus();
                }
                if (this.els.cursor) this.els.cursor.style.opacity = 1;

                if (this.state.isTyping) this.startTimer();
            }
            this.updatePauseIcon();
        },

        updatePauseIcon() {
            if (this.state.isPaused) {
                this.els.icons.pause?.classList.add('hidden');
                this.els.icons.play?.classList.remove('hidden');
            } else {
                this.els.icons.play?.classList.add('hidden');
                this.els.icons.pause?.classList.remove('hidden');
            }
        },

        toggleOverlay(el, show) {
            if (!el) return;
            if (show) { el.classList.remove('hidden'); el.classList.add('visible'); }
            else { el.classList.remove('visible'); el.classList.add('hidden'); }
        },

        toggleSettings(forceClose = false) {
            const panel = this.els.settingsPanel;
            if (!panel) return;
            const isHidden = panel.classList.contains('panel-hidden');

            if (forceClose || !isHidden) {
                this.restoreSettingsUI();
                panel.classList.remove('panel-visible');
                panel.classList.add('panel-hidden');
                panel.setAttribute('aria-hidden', 'true');
                panel.inert = true;

                if (this.state.gameMode === 'sandbox' && this.state.isTyping && this.state.isPaused) {
                    this.togglePause();
                }

                if (!this.state.isPaused && !this.els.overlayOver?.classList.contains('visible')) {
                    this.els.input?.focus();
                }
            } else {
                this.restoreSettingsUI();
                panel.classList.remove('panel-hidden');
                panel.classList.add('panel-visible');
                panel.setAttribute('aria-hidden', 'false');
                panel.inert = false;

                if (this.state.isTyping && !this.state.isPaused && this.state.gameMode === 'sandbox') {
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
                this.els.iconExpand?.classList.add('hidden');
                this.els.iconCompress?.classList.remove('hidden');
            } else {
                this.els.iconCompress?.classList.add('hidden');
                this.els.iconExpand?.classList.remove('hidden');
            }
            this.updatePosition();

            if (!this.state.isPaused && !this.els.overlayOver?.classList.contains('visible')) {
                setTimeout(() => this.els.input?.focus(), 100);
            }
        },

        bindEvents() {
            const els = this.els;

            const updateViewport = () => {
                const vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
                document.documentElement.style.setProperty('--app-height', `${vh}px`);

                if (document.body.classList.contains('keyboard-open')) {
                    window.scrollTo(0, 0);
                }

                this.updatePosition();
            };

            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', updateViewport);
                window.visualViewport.addEventListener('scroll', updateViewport);
            } else {
                window.addEventListener('resize', updateViewport);
            }
            updateViewport(); 

            els.input?.addEventListener('focus', () => {
                document.body.classList.add('keyboard-open');
                setTimeout(updateViewport, 100); 
            });
            els.input?.addEventListener('blur', () => {
                document.body.classList.remove('keyboard-open');
                setTimeout(updateViewport, 100);
            });

            els.modeToggleRadios?.forEach(radio => {
                radio.addEventListener('change', (e) => this.updateSettingsView(e.target.value));
            });

            els.restartBtn?.addEventListener('click', () => this.resetGame());

            els.ingameRestartBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.resetGame();
            });

            els.input?.addEventListener('compositionstart', () => { this.state.isComposing = true; });
            els.input?.addEventListener('compositionend', (e) => {
                this.state.isComposing = false;
                if (e.data) {
                    this.processContentLogic(e.data);
                    this.state.ignoreNextInput = true;
                    setTimeout(() => { this.state.ignoreNextInput = false; }, 50);
                }
                if (els.input) els.input.value = "";
            });
            els.input?.addEventListener('input', (e) => this.handleInput(e));
            els.input?.addEventListener('keydown', (e) => this.handleKeydown(e));

            els.board?.addEventListener('click', (e) => {
                const isMenuOpen = els.settingsPanel?.classList.contains('panel-visible');
                const isOver = els.overlayOver?.classList.contains('visible');
                if (!isMenuOpen && !isOver && !this.state.isPaused &&
                    !e.target.closest('button') && !e.target.closest('#settings-panel')) {
                    els.input?.focus();
                }
            });

            window.addEventListener('resize', () => this.updatePosition());
            els.pauseBtn?.addEventListener('click', (e) => { e.stopPropagation(); this.togglePause(); });

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

            els.settingsToggle?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(err => console.error(err));
                    if (els.settingsPanel?.classList.contains('panel-hidden')) {
                        this.toggleSettings();
                    }
                } else {
                    this.toggleSettings();
                }
            });

            els.closeSettings?.addEventListener('click', () => this.toggleSettings(true));

            els.saveSettings?.addEventListener('click', () => {
                const c = this.els.config;
                const selectedMode = document.querySelector('input[name="mode-toggle"]:checked')?.value || 'ranked';

                this.state.gameMode = selectedMode;
                window.history.replaceState(null, '', '?mode=' + selectedMode);

                if (c.timeRanked) localStorage.setItem('code_time_ranked', c.timeRanked.value);
                if (c.langRanked) localStorage.setItem('code_lang_ranked', c.langRanked.value);
                if (c.showMsRanked) localStorage.setItem('code_show_ms_ranked', c.showMsRanked.checked);

                if (c.timeRanked) this.state.savedTimeRanked = parseInt(c.timeRanked.value);
                if (c.langRanked) this.state.savedLangRanked = c.langRanked.value;
                if (c.showMsRanked) this.state.savedShowMsRanked = c.showMsRanked.checked;

                if (c.timeSandbox) localStorage.setItem('code_time_sandbox', c.timeSandbox.value);
                if (c.showMsSandbox) localStorage.setItem('code_show_ms_sandbox', c.showMsSandbox.checked);
                if (c.langSandbox) localStorage.setItem('code_lang_sandbox', c.langSandbox.value);

                if (c.timeSandbox) this.state.savedTimeSandbox = parseInt(c.timeSandbox.value) || 0;
                if (c.showMsSandbox) this.state.savedShowMsSandbox = c.showMsSandbox.checked;
                if (c.langSandbox) this.state.savedLangSandbox = c.langSandbox.value;

                this.preloadDistributionData();
                this.toggleSettings(true);
                this.resetGame();
            });

            document.addEventListener('click', (e) => {
                const isMenuOpen = !els.settingsPanel?.classList.contains('panel-hidden');
                const clickedInside = els.settingsPanel?.contains(e.target) || els.settingsToggle?.contains(e.target);
                if (isMenuOpen && !clickedInside) this.toggleSettings(true);
            });

            document.addEventListener('keydown', (e) => {
                const isMenuOpen = els.settingsPanel?.classList.contains('panel-visible');
                const isGameOver = els.overlayOver?.classList.contains('visible');

                if (e.code === 'Escape') {
                    e.preventDefault();
                    this.toggleSettings();
                }

                if (e.code === 'Enter') {
                    if (isMenuOpen) {
                        e.preventDefault();
                        els.saveSettings?.click();
                    }
                    else if (isGameOver) {
                        e.preventDefault();
                        this.resetGame();
                    }
                }
            });

            window.addEventListener('storage', (e) => {
                if (e.key === 'globalOpaque') {
                    this.loadBackgroundPreference();
                }
                if (e.key === 'siteLanguage') {
                    this.updateTranslations();
                }
            });

            window.addEventListener('languageChanged', () => {
                this.updateTranslations();
            });
        },

        async finishGame() {
            clearInterval(this.state.timer);
            if (this.els.input) {
                this.els.input.disabled = true;
                this.els.input.value = "";
            }
            this.state.isTyping = false;
            this.state.isPaused = false;

            const timeElapsed = this.state.maxTime === 0 ? this.state.timeLeft : (this.state.maxTime - this.state.timeLeft);
            const minutes = (timeElapsed === 0 ? 1 : timeElapsed) / 60;
            let wpm = Math.round((this.state.correctCount / 5) / minutes);
            if (wpm < 0 || !isFinite(wpm)) wpm = 0;

            let acc = 0;
            if (this.state.totalTyped > 0) acc = Math.round(((this.state.totalTyped - this.state.mistakes) / this.state.totalTyped) * 100);
            if (acc < 0) acc = 0;

            if (this.state.gameMode === 'ranked') {
                this.els.viewRanked?.classList.remove('hidden');
                this.els.viewSandbox?.classList.add('hidden');

                if (this.els.results.rankedWpm) this.els.results.rankedWpm.textContent = wpm;
                if (this.els.results.rankedAcc) this.els.results.rankedAcc.textContent = acc + "%";
                if (this.els.results.rankedErr) this.els.results.rankedErr.textContent = this.state.mistakes;

                this.saveScoreToDatabase(wpm, this.state.savedTimeRanked, this.state.savedLangRanked);

                const recordKey = `coding_best_ranked_${this.state.savedTimeRanked}_${this.state.savedLangRanked}`;
                let savedBest = localStorage.getItem(recordKey);
                let best = savedBest !== null ? parseInt(savedBest) : null;
                let isRecord = false;

                if (best === null || wpm > best) {
                    best = wpm;
                    localStorage.setItem(recordKey, best);
                    isRecord = true;
                    this.saveBestScoreToDatabase(best, this.state.savedTimeRanked, this.state.savedLangRanked);
                }

                if (isRecord && savedBest !== null) {
                    if (this.els.results.newRec) {
                        this.els.results.newRec.style.visibility = 'visible';
                        this.els.results.newRec.style.opacity = '1';
                    }
                } else {
                    if (this.els.results.newRec) {
                        this.els.results.newRec.style.visibility = 'hidden';
                        this.els.results.newRec.style.opacity = '0';
                    }
                }

                const configKey = `coding_speed_ranked_${this.state.savedLangRanked}_${this.state.savedTimeRanked}`;
                this.drawDistributionChart(wpm, best, configKey);

            } else {
                this.els.viewRanked?.classList.add('hidden');
                this.els.viewSandbox?.classList.remove('hidden');

                if (this.els.results.newRec) {
                    this.els.results.newRec.style.visibility = 'hidden';
                    this.els.results.newRec.style.opacity = '0';
                }

                if (this.els.results.sandboxWpm) this.els.results.sandboxWpm.textContent = wpm;
                if (this.els.results.sandboxAcc) this.els.results.sandboxAcc.textContent = acc + "%";
                if (this.els.results.sandboxErr) this.els.results.sandboxErr.textContent = this.state.mistakes;
                if (this.els.results.sandboxKeys) this.els.results.sandboxKeys.textContent = this.state.totalTyped;
            }

            this.toggleOverlay(this.els.overlayOver, true);
            if (this.els.pauseBtn) this.els.pauseBtn.style.display = 'none';
            if (this.els.ingameRestartBtn) this.els.ingameRestartBtn.style.visibility = 'hidden';
            const configKey = `coding_speed_ranked_${this.state.savedLangRanked}_${this.state.savedTimeRanked}`;
            this.preloadDistributionData(configKey);
        },
        getGuestId() {
            let guestId = localStorage.getItem('stimuludo_guest_id');
            if (!guestId) {
                guestId = 'guest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
                localStorage.setItem('stimuludo_guest_id', guestId);
            }
            return guestId;
        },


        async saveScoreToDatabase(score, time, mode) {
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
                    body: JSON.stringify({ game_id: 'coding_speed', score: score, details: { time: time, mode: mode }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec sauvegarde DB:", error); }
        },

        async saveBestScoreToDatabase(score, time, mode) {
            try {
                fetch('/api/best', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ game_mode_key: `coding_speed_ranked_${time}_${mode}`, score: score, details: { time: time, mode: mode }, guest_id: this.getGuestId() })
                });
            } catch (error) { console.error("Échec sauvegarde best DB:", error); }
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
            const stdDev = Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n) || 1;

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

            const minLabel = document.getElementById('chart-min-label');
            const maxLabel = document.getElementById('chart-max-label');
            if (minLabel) minLabel.textContent = `${minX}`;
            if (maxLabel) maxLabel.textContent = `${maxX}`;

            const kernel = (x) => (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
            const getDensity = (x) => {
                let sum = 0;
                for (let i = 0; i < n; i++) {
                    sum += kernel((x - scores[i]) / bandwidth);
                }
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

            if (!this.els.viewRanked) return;

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

            const markerCurrent = this.els.results.markerCurrent;
            const markerBest = this.els.results.markerBest;

            if (markerCurrent) {
                if (bestScore !== null && currentScore === bestScore) {
                    markerCurrent.style.display = 'none';
                } else {
                    markerCurrent.style.display = 'block';
                    markerCurrent.style.left = `${currentPercent}%`;
                    markerCurrent.innerHTML = `
                        <div style="width: 2px; height: 100%; border-left: 2px dashed var(--accent-color); margin: 0 auto; opacity: 1;"></div>
                        <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, ${currentOffset}px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--accent-color); z-index: 5; display: flex; align-items: baseline; line-height: 1;">
                            ${currentScore}
                        </div>
                    `;
                }
            }

            if (markerBest) {
                if (bestScore !== null) {
                    markerBest.classList.remove('hidden');
                    markerBest.style.left = `${bestPercent}%`;
                    markerBest.innerHTML = `
                        <div style="position: absolute; top: -28px; left: 50%; transform: translateX(-50%); color: var(--record-color, #FFA914);">
                            <svg fill="currentColor" width="24" height="24" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                                <path d="M241.2793,70.4541a19.88374,19.88374,0,0,0-20.88184-2.874L173.1582,88.57617,145.4834,38.76074a20,20,0,0,0-34.9668-.001L82.8418,88.57617l-47.249-21.001A20.00018,20.00018,0,0,0,8.002,90.42676l25.44434,108.333a20.06608,20.06608,0,0,0,24.86523,14.68261,261.8952,261.8952,0,0,1,139.33008-.01367A20.012,20.012,0,0,0,222.5,198.75488L247.98926,90.43652A19.88333,19.88333,0,0,0,241.2793,70.4541ZM56.81055,193.27246l-.002-.00879.00293.00977Zm143.27539-4.04a286.03693,286.03693,0,0,0-144.22071.0127L33.207,92.7793l43.23145,19.21386a19.90169,19.90169,0,0,0,25.60644-8.5625L128,56.71l25.957,46.72266a19.89748,19.89748,0,0,0,25.60547,8.56054l43.21875-19.209Z"/>
                            </svg>
                        </div>
                        <div style="width: 2px; height: 100%; border-left: 2px dashed var(--record-color, #FFA914); margin: 0 auto; opacity: 1;"></div>
                        <div style="position: absolute; top: 100%; left: 50%; transform: translate(-50%, 5px); font-family: var(--font-heading); font-size: 0.9rem; font-weight: 700; color: var(--record-color, #FFA914); z-index: 4; display: flex; align-items: baseline; line-height: 1;">
                            ${bestScore}
                        </div>
                    `;
                } else {
                    markerBest.classList.add('hidden');
                }
            }

            const tooltip = this.els.viewRanked.querySelector('.chart-tooltip');
            const hoverLine = this.els.viewRanked.querySelector('.hover-line');

            if (tooltip && hoverLine) {
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
            }
        },

        async preloadDistributionData(configKey) {
            const distKey = configKey || `coding_speed_ranked_${this.state.savedLangRanked}_${this.state.savedTimeRanked}`;
            try {
                const res = await fetch(`/api/scores/distribution/coding_speed?time=${this.state.savedTimeRanked}&mode=${this.state.savedLangRanked}`, {
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
        }
    };

    CodingGame.init();
});