const i18nLobby = {
    fr: {
        header: "MULTIJOUEUR",
        title: "Multijoueur",
        subtitle: "Invitez vos amis et affrontez-vous en temps réel !",
        copyLink: "Copier",
        players: "Joueurs connectés",
        hostControls: "Contrôles de l'Hôte",
        selectGame: "Sélectionnez le jeu à lancer pour tout le monde :",
        start: "Lancer la partie",
        startPlaylist: "Démarrer la playlist",
        addGame: "Ajouter un jeu",
        nextGame: "Jeu suivant",
        leaderboard: "Classement Final",
        gameLeaderboard: "Classement de la manche",
        waiting: "En attente des résultats...",
        replay: "Rejouer",
        backLobby: "Retour au menu",
        homeBtn: "Accueil",
        hostBadge: "HÔTE",
        viewGames: "Voir les jeux",
        playlistTitle: "Playlist de la partie",
        playlistSubtitle: "Jeux choisis par l'hôte :",
        game_vrt: "Temps de Réaction Visuel",
        game_math: "Calcul Mental",
        game_2048: "Fusion 2048",
        game_schulte: "Grille de Schulte",
        promptName: "Entrez votre pseudo :",
        player: "Joueur",
        connecting: "Connexion au serveur en cours...",
        errServer: "Impossible de joindre le serveur. Le multijoueur nécessite Node.js actif.",
        connected: "Connecté",
        err: "Erreur serveur",
        errConn: "Erreur de connexion :",
        disconnected: "Déconnecté :",
        reconnecting: "Reconnexion...",
        reconnected: "Reconnecté !",
        youHost: "Tu es maintenant l'hôte du lobby !",
        waitingOthers: "En attente des autres joueurs...",
        pts: "pts",
        score: "Score:"
    },
    en: {
        header: "MULTIPLAYER",
        title: "Multiplayer",
        subtitle: "Invite your friends and compete in real-time!",
        copyLink: "Copy",
        players: "Connected players",
        hostControls: "Host Controls",
        selectGame: "Select the game to launch for everyone:",
        start: "Start game",
        startPlaylist: "Start playlist",
        addGame: "Add a game",
        nextGame: "Next game",
        leaderboard: "Final Leaderboard",
        gameLeaderboard: "Game Leaderboard",
        waiting: "Waiting for results...",
        replay: "Play again",
        backLobby: "Back to menu",
        homeBtn: "Home",
        hostBadge: "HOST",
        viewGames: "View Games",
        playlistTitle: "Party Playlist",
        playlistSubtitle: "Games chosen by host:",
        game_vrt: "Visual Reaction Time",
        game_math: "Mental Math",
        game_2048: "Fusion 2048",
        game_schulte: "Schulte Grid",
        promptName: "Enter your nickname:",
        player: "Player",
        connecting: "Connecting to server...",
        errServer: "Unable to reach server. Multiplayer requires an active Node.js backend.",
        connected: "Connected",
        err: "Server error",
        errConn: "Connection error:",
        disconnected: "Disconnected:",
        reconnecting: "Reconnecting...",
        reconnected: "Reconnected!",
        youHost: "You are now the lobby host!",
        waitingOthers: "Waiting for other players...",
        pts: "pts",
        score: "Score:"
    }
};

const savedLang = document.documentElement.lang || 'en';
const t = i18nLobby[savedLang] || i18nLobby['en'];


document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
        if (el.tagName === 'TITLE') document.title = t[key];
        else el.textContent = t[key];
    }
});




const socket = io(window.location.origin, {
    transports: ["polling"],
    upgrade: false,
    timeout: 10000,
    autoConnect: false
});

const ui = {
    lobby: document.getElementById('lobby-ui'),
    podium: document.getElementById('podium-ui'),
    frame: document.getElementById('game-frame'),
    shareLink: document.getElementById('share-link'),
    playersList: document.getElementById('players-list'),
    playerCount: document.getElementById('player-count'),
    hostControls: document.getElementById('playlist-section'),
    gameSelect: document.getElementById('game-select'),
    podiumList: document.getElementById('podium-list')
};


const urlParams = new URLSearchParams(window.location.search);
let lobbyId = urlParams.get('id');

if (!lobbyId) {

        lobbyId = Math.random().toString(36).substring(2, 8).toUpperCase();
    window.history.replaceState(null, '', `?id=${lobbyId}`);
}

ui.shareLink.value = window.location.href;

let isHost = false;
let currentHostId = null; 
let playlist = JSON.parse(sessionStorage.getItem('lobby_playlist_' + lobbyId) || '[]');

let myPlayerName = sessionStorage.getItem('stimuludo_player_name_' + lobbyId);


let myPlayerId = localStorage.getItem('stimuludo_player_id');
if (!myPlayerId) {
    myPlayerId = 'p_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    localStorage.setItem('stimuludo_player_id', myPlayerId);
}

if (!myPlayerName) {
    showNicknameModal();
} else {
    socket.connect();
}

function showNicknameModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'nickname-modal';

        const titleText = t.promptName || "Entrez votre pseudo :";

        modal.innerHTML = `
        <div class="modal-content" style="max-width: 400px; text-align: center; padding: 2rem;">
            <h2 style="font-family: var(--font-heading); color: var(--text-primary); margin-bottom: 1.5rem;">${titleText}</h2>
            <input type="text" id="nickname-input" class="modern-input" placeholder="${t.player || 'Joueur'}..." style="width: 100%; margin-bottom: 1.5rem; text-align: center; font-size: 1.2rem; padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-primary);">
            <button id="btn-submit-nickname" class="btn-launch" style="width: 100%;">Valider</button>
        </div>
    `;

        document.body.appendChild(modal);

        const input = document.getElementById('nickname-input');
    const btn = document.getElementById('btn-submit-nickname');

        setTimeout(() => input.focus(), 100);

        function submitName() {
        let val = input.value.trim();
        myPlayerName = val !== '' ? val : '';
        if (myPlayerName !== '') {
            sessionStorage.setItem('stimuludo_player_name_' + lobbyId, myPlayerName);
        }
        modal.remove();
        socket.connect();
    }

        btn.addEventListener('click', submitName);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitName();
    });
}

socket.on('connect', () => {
    console.log(`${t.connected} via :`, socket.io.engine.transport.name, '| ID:', socket.id);


        socket.emit('join_lobby', { lobbyId, playerName: myPlayerName, playerId: myPlayerId }, (response) => {
        if (!response || !response.success) {
            return;
        }
        isHost = response.isHost;
        currentHostId = response.hostId;


                        if (response.players) {
            const me = response.players.find(p => p.persistentId === myPlayerId || p.id === socket.id);
            if (me) {
                myPlayerName = me.name;
                sessionStorage.setItem('stimuludo_player_name_' + lobbyId, myPlayerName);
            }
        }

                if (isHost) {
            document.getElementById('playlist-title').textContent = t.hostControls || "Contrôles de l'Hôte";
            document.getElementById('playlist-subtitle').textContent = t.selectGame || "Sélectionnez les jeux de votre partie :";
            document.getElementById('btn-add-game').style.display = 'inline-block';
            document.getElementById('btn-view-games').style.display = 'none';
            window.renderPlaylist();
        } else {
            setupNonHost();
        }
        updatePlayersList(response.players, response.hostId);
    });
});

socket.on('connect_error', (err) => {
    console.error('Erreur Socket.io :', err.message);
});

socket.on('disconnect', (reason) => {
    console.warn('Déconnecté:', reason);
});

socket.on('reconnect', () => {
    console.log('Reconnecté');
});


socket.on('player_joined', (data) => {

        const players = Array.isArray(data) ? data : data.players;
    const hostId = Array.isArray(data) ? currentHostId : (data.hostId || currentHostId);
    currentHostId = hostId;
    updatePlayersList(players, hostId);

        if (isHost && typeof socket !== 'undefined') {
        socket.emit('sync_playlist', { lobbyId, playlist });
    }
});

socket.on('player_left', (data) => {
    const players = Array.isArray(data) ? data : data.players;
    const hostId = Array.isArray(data) ? currentHostId : (data.hostId || currentHostId);
    currentHostId = hostId;
    updatePlayersList(players, hostId);
});

socket.on('host_assigned', ({ hostId } = {}) => {
    isHost = true;
    currentHostId = hostId || socket.id;
    document.getElementById('playlist-title').textContent = t.hostControls || "Contrôles de l'Hôte";
    document.getElementById('playlist-subtitle').textContent = t.selectGame || "Sélectionnez les jeux de votre partie :";
    document.getElementById('btn-add-game').style.display = 'inline-block';
    document.getElementById('btn-view-games').style.display = 'none';
    window.renderPlaylist();
    console.log(t.youHost);
});


function setupNonHost() {
    document.getElementById('playlist-title').textContent = t.playlistTitle || "Playlist de la partie";
    document.getElementById('playlist-subtitle').textContent = t.playlistSubtitle || "Jeux choisis par l'hôte :";
    document.getElementById('btn-add-game').style.display = 'none';
    document.getElementById('btn-view-games').style.display = 'inline-block';
    document.getElementById('btn-start-playlist').style.display = 'none';
    window.renderPlaylist();
}


function updatePlayersList(players, hostId) {
    if (!players || !Array.isArray(players)) return;

        ui.playerCount.textContent = players.length;
    ui.playersList.innerHTML = '';

        players.forEach((player) => {
        const isHostPlayer = hostId ? player.id === hostId : false;
        const isMePlayer = player.persistentId === myPlayerId || player.name === myPlayerName;

                const card = document.createElement('div');
        let cardClasses = ['player-card'];
        if (isHostPlayer) cardClasses.push('host');
        if (isMePlayer) cardClasses.push('me');
        card.className = cardClasses.join(' ');

                let badgesHtml = '';
        if (isHostPlayer) {
            badgesHtml += `<div class="player-badge host-badge">${t.hostBadge || 'HÔTE'}</div>`;
        }

                card.innerHTML = `
            ${badgesHtml}
            <div class="player-name">${player.name}</div>
        `;
        ui.playersList.appendChild(card);
    });
}

window.renderPlaylist = function() {
    const container = document.getElementById('playlist-container');
    const startBtn = document.getElementById('btn-start-playlist');
    if (!container) return;
    container.innerHTML = '';
    playlist.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'playlist-item';

                if (isHost) {
            div.draggable = true;
            div.dataset.index = index;
            div.innerHTML = `
                <div>
                    <span>${item.title}</span>
                    <span class="mode-badge">(${item.mode})</span>
                </div>
                <div class="playlist-item-remove" onclick="removeGameFromPlaylist(${index})">&times;</div>
            `;

                        div.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                setTimeout(() => div.classList.add('dragging'), 0);
            });

                        div.addEventListener('dragend', (e) => {
                div.classList.remove('dragging');
            });

                        div.addEventListener('dragover', (e) => {
                e.preventDefault();
                div.classList.add('drag-over');
            });

                        div.addEventListener('dragleave', (e) => {
                div.classList.remove('drag-over');
            });

                        div.addEventListener('drop', (e) => {
                e.preventDefault();
                div.classList.remove('drag-over');
                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const toIndex = index;
                if (fromIndex !== toIndex && !isNaN(fromIndex)) {
                    const movedItem = playlist.splice(fromIndex, 1)[0];
                    playlist.splice(toIndex, 0, movedItem);
                    sessionStorage.setItem('lobby_playlist_' + lobbyId, JSON.stringify(playlist));
                    window.renderPlaylist();
                    if (isHost && typeof socket !== 'undefined') {
                        socket.emit('sync_playlist', { lobbyId, playlist });
                    }
                }
            });
        } else {
            div.innerHTML = `
                <div>
                    <span>${item.title}</span>
                    <span class="mode-badge">(${item.mode})</span>
                </div>
            `;
        }

                container.appendChild(div);
    });
    if (startBtn && isHost) startBtn.style.display = playlist.length > 0 ? 'block' : 'none';
};

if (typeof socket !== 'undefined') {
    socket.on('sync_playlist', (data) => {
        if (!isHost) {
            playlist = data.playlist || [];
            sessionStorage.setItem('lobby_playlist_' + lobbyId, JSON.stringify(playlist));
            setupNonHost();
        }
    });
}


window.removeGameFromPlaylist = function(index) {
    playlist.splice(index, 1);
    sessionStorage.setItem('lobby_playlist_' + lobbyId, JSON.stringify(playlist));
    window.renderPlaylist();
    if (isHost && typeof socket !== 'undefined') {
        socket.emit('sync_playlist', { lobbyId, playlist });
    }
};

window.addGameToPlaylist = function(url, title, mode) {
    playlist.push({ url, title, mode });
    sessionStorage.setItem('lobby_playlist_' + lobbyId, JSON.stringify(playlist));
    window.renderPlaylist();
    if (isHost && typeof socket !== 'undefined') {
        socket.emit('sync_playlist', { lobbyId, playlist });
    }
};

const GAME_CONFIGS = {
  "mental_math": [
    { "id": "time", "label": "Durée", "options": [ { "val": "30", "text": "30s" }, { "val": "60", "text": "60s" } ] },
    { "id": "difficulty", "label": "Difficulté", "options": [ { "val": "1-9", "text": "1-9" }, { "val": "1-99", "text": "1-99" } ] }
  ],
  "sequence_memory": [
    { "id": "lives", "label": "Vies", "options": [ { "val": "1", "text": "1 vie" } ] },
    { "id": "time", "label": "Temps (ms)", "options": [ { "val": "1000", "text": "1000ms" }, { "val": "100", "text": "100ms" } ] }
  ],
  "typing_game": [
    { "id": "time", "label": "Durée", "options": [ { "val": "10", "text": "10s" }, { "val": "30", "text": "30s" }, { "val": "60", "text": "60s" } ] },
    { "id": "text_mode", "label": "Texte", "options": [ { "val": "random", "text": "Mots Aléatoires" }, { "val": "quote", "text": "Citations" } ] }
  ],
  "number_memory": [
    { "id": "lives", "label": "Vies", "options": [ { "val": "1", "text": "1 vie" } ] },
    { "id": "time", "label": "Temps (ms)", "options": [ { "val": "1000", "text": "1000ms" }, { "val": "500", "text": "500ms (Extrême)" } ] }
  ],
  "visual_memory": [
    { "id": "lives", "label": "Vies", "options": [ { "val": "1", "text": "1 vie" }, { "val": "3", "text": "3 vies" } ] },
    { "id": "time", "label": "Temps d'affichage", "options": [ { "val": "1000", "text": "1000ms" }, { "val": "100", "text": "100ms" } ] }
  ],
  "chess_position": [
    { "id": "lives", "label": "Vies", "options": [ { "val": "1", "text": "1 vie" }, { "val": "3", "text": "3 vies" } ] },
    { "id": "time", "label": "Temps d'affichage", "options": [ { "val": "2000", "text": "2000ms" }, { "val": "4000", "text": "4000ms" } ] }
  ],
  "chess_coordinates": [
    { "id": "orientation", "label": "Orientation", "options": [ { "val": "white", "text": "Blancs" }, { "val": "black", "text": "Noirs" } ] }
  ],
  "visual_reaction_time": [
    { "id": "attempts", "label": "Essais", "options": [ { "val": "5", "text": "5 essais" }, { "val": "20", "text": "20 essais" } ] }
  ],
  "auditory_reaction_time": [
    { "id": "attempts", "label": "Essais", "options": [ { "val": "5", "text": "5 essais" }, { "val": "20", "text": "20 essais" } ] }
  ],
  "matrix_product": [
    { "id": "config", "label": "Mode", "options": [ { "val": "2_0_5_60", "text": "2x2, [0,5], 60s" }, { "val": "2_0_5_180", "text": "2x2, [0,5], 180s" }, { "val": "2_-10_10_60", "text": "2x2, [-10,10], 60s" }, { "val": "2_-10_10_180", "text": "2x2, [-10,10], 180s" }, { "val": "3_0_5_60", "text": "3x3, [0,5], 60s" }, { "val": "3_0_5_180", "text": "3x3, [0,5], 180s" }, { "val": "3_-10_10_60", "text": "3x3, [-10,10], 60s" }, { "val": "3_-10_10_180", "text": "3x3, [-10,10], 180s" } ] }
  ],
  "sudoku_classic": [
    { "id": "config", "label": "Grille", "options": [ { "val": "9_easy", "text": "9x9, Facile" }, { "val": "9_hard", "text": "9x9, Difficile" }, { "val": "16_easy", "text": "16x16, Facile" }, { "val": "16_hard", "text": "16x16, Difficile" }, { "val": "25_easy", "text": "25x25, Facile" }, { "val": "25_hard", "text": "25x25, Difficile" } ] }
  ],
  "target_aiming": [
    { "id": "time", "label": "Durée", "options": [ { "val": "30", "text": "30s" } ] },
    { "id": "size", "label": "Taille", "options": [ { "val": "10", "text": "10px" }, { "val": "30", "text": "30px" }, { "val": "50", "text": "50px" }, { "val": "70", "text": "70px" } ] },
    { "id": "display_mode", "label": "Fenêtrage", "options": [ { "val": "windowed", "text": "Fenêtré" }, { "val": "fullscreen", "text": "Plein Écran" } ] }
  ],
  "cards_memory": [
    { "id": "displayTime", "label": "Temps (ms)", "options": [ { "val": "500", "text": "Vitesse: 500ms" }, { "val": "1500", "text": "Vitesse: 1500ms" } ] }
  ],
  "card_counting": [
    { "id": "strategy", "label": "Stratégie", "options": [ { "val": "Hi-Lo", "text": "Hi-Lo" }, { "val": "Hi-Opt I", "text": "Hi-Opt I" }, { "val": "Hi-Opt II", "text": "Hi-Opt II" }, { "val": "KO", "text": "KO" }, { "val": "Omega II", "text": "Omega II" }, { "val": "Red 7", "text": "Red 7" }, { "val": "Halves", "text": "Halves" }, { "val": "Zen Count", "text": "Zen Count" }, { "val": "10 Count", "text": "10 Count" } ] },
    { "id": "displayTime", "label": "Vitesse", "options": [ { "val": "500", "text": "500ms" }, { "val": "1500", "text": "1500ms" } ] }
  ],
  "musical_intervals": [
    { "id": "instrument", "label": "Instrument", "options": [ { "val": "piano", "text": "Piano" }, { "val": "oscillator", "text": "Synth" }, { "val": "guitar", "text": "Guitare" } ] }
  ],
  "absolute_pitch": [
    { "id": "precision", "label": "Précision", "options": [ { "val": "0", "text": "0Hz" }, { "val": "1", "text": "0.1Hz" }, { "val": "2", "text": "0.01Hz" } ] }
  ],
  "chimp_test": [
    { "id": "lives", "label": "Vies", "options": [ { "val": "1", "text": "1 vie" }, { "val": "3", "text": "3 vies" } ] }
  ],
  "schulte_grid": [
    { "id": "size", "label": "Taille", "options": [ { "val": "3", "text": "3x3" }, { "val": "5", "text": "5x5" } ] },
    { "id": "type", "label": "Type", "options": [ { "val": "normal", "text": "Normal" }, { "val": "360", "text": "360" } ] }
  ],
  "color_match": [
    { "id": "mode", "label": "Mode", "options": [ { "val": "cm_ranked", "text": "Classé" } ] }
  ],
  "spatial_reasoning": [
    { "id": "time", "label": "Temps", "options": [ { "val": "60", "text": "60s" } ] }
  ],
  "fusion_2048": [
    { "id": "target", "label": "Cible", "options": [ { "val": "512", "text": "Speedrun 512" }, { "val": "2048", "text": "Speedrun 2048" }, { "val": "4096", "text": "Speedrun 4096" } ] }
  ],
  "chromatic_memory": [
    { "id": "difficulty", "label": "Difficulté", "options": [ { "val": "normal", "text": "200pv" }, { "val": "hardcore", "text": "50pv" } ] }
  ],
  "point_cloud": [
    { "id": "attempts", "label": "Essais", "options": [ { "val": "10", "text": "10 essais" } ] },
    { "id": "points", "label": "Points", "options": [ { "val": "20", "text": "20 pts" }, { "val": "50", "text": "50 pts" }, { "val": "100", "text": "100 pts" } ] },
    { "id": "display_mode", "label": "Fenêtrage", "options": [ { "val": "windowed", "text": "Fenêtré" }, { "val": "fullscreen", "text": "Plein Écran" } ] }
  ],
  "coding_speed": [
    { "id": "time", "label": "Temps", "options": [ { "val": "10", "text": "10s" }, { "val": "30", "text": "30s" }, { "val": "60", "text": "60s" } ] },
    { "id": "lang", "label": "Langage", "options": [ { "val": "random", "text": "Aléatoire" }, { "val": "python", "text": "Python" }, { "val": "javascript", "text": "Javascript" }, { "val": "html", "text": "Html" }, { "val": "c", "text": "C" } ] }
  ],
  "binary_counting": [
    { "id": "time", "label": "Temps", "options": [ { "val": "30", "text": "30s" }, { "val": "60", "text": "60s" } ] },
    { "id": "diff", "label": "Système", "options": [ { "val": "binary_4", "text": "Bin, 4 bits" }, { "val": "binary_8", "text": "Bin, 8 bits" }, { "val": "binary_16", "text": "Bin, 16 bits" }, { "val": "hex_4", "text": "Hex, 4 bits" }, { "val": "hex_8", "text": "Hex, 8 bits" }, { "val": "hex_16", "text": "Hex, 16 bits" } ] }
  ],
  "items_counting": [
    { "id": "time", "label": "Temps", "options": [ { "val": "30", "text": "30s" }, { "val": "60", "text": "60s" } ] },
    { "id": "points", "label": "Points max", "options": [ { "val": "15", "text": "15 pts" }, { "val": "30", "text": "30 pts" }, { "val": "50", "text": "50 pts" } ] }
  ],
  "path_trace": [
    { "id": "size", "label": "Taille", "options": [ { "val": "20", "text": "20 cases" }, { "val": "40", "text": "40 cases" }, { "val": "60", "text": "60 cases" }, { "val": "100", "text": "100 cases" } ] }
  ],
  "circles_recall": [
    { "id": "lives", "label": "Vies", "options": [ { "val": "1", "text": "1 vie" }, { "val": "3", "text": "3 vies" } ] },
    { "id": "speed", "label": "Temps", "options": [ { "val": "1500", "text": "1500ms" }, { "val": "800", "text": "800ms" } ] }
  ],
  "bpm_sense": [],
  "piano_pitch": [],
  "knight_walk": [
    { "id": "time", "label": "Temps", "options": [ { "val": "30", "text": "30s" }, { "val": "60", "text": "60s" } ] },
    { "id": "constraint", "label": "Mode contrainte (Dame)", "options": [ { "val": "false", "text": "Non" }, { "val": "true", "text": "Oui" } ] }
  ],
  "minesweeper": [
    { "id": "difficulty", "label": "Difficulté", "options": [ { "val": "easy", "text": "9x9, 10 mines" }, { "val": "medium", "text": "16x16, 40 mines" } ] }
  ],
  "plate_memory": [
    { "id": "mode", "label": "Mode", "options": [ { "val": "pm_ranked", "text": "Classé" } ] }
  ],
  "numbers_round": [
    { "id": "time", "label": "Temps", "options": [ { "val": "60", "text": "60s" }, { "val": "90", "text": "90s" }, { "val": "120", "text": "120s" } ] }
  ],
  "time_sense": [
    { "id": "difficulty", "label": "Marge d'erreur", "options": [ { "val": "3000", "text": "3000ms" }, { "val": "2000", "text": "2000ms" }, { "val": "1000", "text": "1000ms" } ] }
  ]
};

window.openGameSelector = function() {
    document.getElementById('game-selector-modal').classList.remove('hidden');
    const modalContent = document.querySelector('#game-selector-modal .modal-content');
    if (modalContent) modalContent.classList.remove('config-mode');

        const searchInput = document.getElementById('lobby-game-search');
    if (searchInput) {
        searchInput.value = '';
    }

    if (!document.getElementById('game-selector-body').querySelector('.games-grid')) {
        Promise.all([
            fetch('/').then(res => res.text()),
            fetch('/api/scores/counts').then(res => res.ok ? res.json() : []).catch(() => [])
        ]).then(([html, counts]) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const grid = doc.querySelector('.games-grid');
            const svgs = doc.querySelector('svg.hidden') || doc.querySelector('svg[aria-hidden="true"]');

                        if (grid) {
                const countMap = {};
                counts.forEach(c => {
                    countMap[c.gameId] = c.count || c.playCount || 0;
                });

                const cards = Array.from(grid.querySelectorAll('.game-card'));
                const currentLang = localStorage.getItem('siteLanguage') || (navigator.language.startsWith('fr') ? 'fr' : 'en');
                const trans = typeof translations !== 'undefined' ? translations[currentLang] : null;

                                cards.forEach(card => {
                    const left = card.querySelector('.left-link');
                    const single = card.querySelector('.single-link');
                    let url = '';
                    if (left) url = left.getAttribute('href').split('?')[0];
                    else if (single) url = single.getAttribute('href').split('?')[0];

                                        const gameId = url ? url.split('/')[2] : '';
                    card.dataset.gameId = gameId;

                                        if (trans && trans.games) {
                        const titleEl = card.querySelector('h2');
                        const descEl = card.querySelector('p');

                                                if (titleEl && titleEl.getAttribute('data-i18n')) {
                            const keys = titleEl.getAttribute('data-i18n').split('.');
                            let val = trans;
                            for (const k of keys) {
                                if (val) val = val[k];
                            }
                            if (val && typeof val === 'string') titleEl.textContent = val;
                        }

                                                if (descEl && descEl.getAttribute('data-i18n')) {
                            const keys = descEl.getAttribute('data-i18n').split('.');
                            let val = trans;
                            for (const k of keys) {
                                if (val) val = val[k];
                            }
                            if (val && typeof val === 'string') descEl.textContent = val;
                        }
                    }

                                        const overlays = card.querySelectorAll('.hover-overlay, .card-modes, .split-link, .single-link');
                    overlays.forEach(el => el.remove());

                                        card.style.cursor = 'pointer';
                    card.onclick = (e) => {
                        e.preventDefault();
                        const currentTitle = card.querySelector('h2') ? card.querySelector('h2').textContent : 'Jeu';
                        showGameConfig(url, currentTitle);
                    };
                });

                                cards.sort((a, b) => {
                    const aId = a.dataset.gameId || '';
                    const bId = b.dataset.gameId || '';
                    return (countMap[bId] || 0) - (countMap[aId] || 0);
                });

                                cards.forEach(card => grid.appendChild(card));

                const body = document.getElementById('game-selector-body');
                body.innerHTML = '';
                if (svgs) body.appendChild(svgs);
                body.appendChild(grid);

                                if (searchInput) {
                    searchInput.addEventListener('input', (e) => {
                        const term = e.target.value.toLowerCase().trim();
                        cards.forEach(card => {
                            const title = card.querySelector('h2') ? card.querySelector('h2').textContent.toLowerCase() : '';
                            const tags = card.getAttribute('data-tags') ? card.getAttribute('data-tags').toLowerCase() : '';
                            if (!term || title.includes(term) || tags.includes(term)) {
                                card.style.display = '';
                            } else {
                                card.style.display = 'none';
                            }
                        });
                    });
                }
            }
        });
    } else {
        const cards = document.getElementById('game-selector-body').querySelectorAll('.game-card');
        cards.forEach(c => c.style.display = '');
        if (searchInput) {
            searchInput.dispatchEvent(new Event('input'));
        }
    }
};

window.showGameConfig = function(url, title) {
    const body = document.getElementById('game-selector-body');
    const modalContent = document.querySelector('#game-selector-modal .modal-content');
    if (modalContent) modalContent.classList.add('config-mode');

        const gameKey = url.split('/').filter(p => p).pop().replace('.html', '');
    const configs = GAME_CONFIGS[gameKey];

        let html = `<h3>Configurer : ${title}</h3>`;

        if (configs) {
        configs.forEach(conf => {
            html += `<div style="margin-bottom: 1rem;">
                <label style="display:block; margin-bottom:0.5rem; color:var(--text-primary); font-weight:bold;">${conf.label}</label>
                <select id="config_${conf.id}" class="game-select" style="margin-bottom: 0;">
                    ${conf.options.map(opt => `<option value="${opt.val}">${opt.text}</option>`).join('')}
                </select>
            </div>`;
        });
    } else {
        html += `<p style="color:var(--text-secondary);">Ce jeu n'a pas de paramètres configurables.</p>`;
    }

        html += `
        <div style="display:flex; gap:1rem; margin-top:2rem; justify-content: center;">
            <button class="btn-secondary" onclick="openGameSelector()">Retour</button>
            ${isHost ? `<button class="btn-launch" onclick="confirmGameConfig('${url}', '${title}', '${gameKey}')">Valider</button>` : ''}
        </div>
    `;

        body.innerHTML = html;
};

window.confirmGameConfig = function(url, title, gameKey) {
    const configs = GAME_CONFIGS[gameKey];
    let params = '?mode=ranked';
    let modeText = 'Classé';

        if (configs) {
        let details = [];
        configs.forEach(conf => {
            const el = document.getElementById(`config_${conf.id}`);
            const val = el.value;
            const text = el.options[el.selectedIndex].text;
            params += `&${conf.id}=${val}`;
            details.push(text);
        });
        modeText = details.join(', ');
    }

        addGameToPlaylist(url + params, title, modeText);


            document.getElementById('game-selector-body').innerHTML = '';
    closeGameSelector();
};

window.closeGameSelector = function() {
    document.getElementById('game-selector-modal').classList.add('hidden');
    const modalContent = document.querySelector('#game-selector-modal .modal-content');
    if (modalContent) modalContent.classList.remove('config-mode');
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const nicknameModal = document.getElementById('nickname-modal');
        if (nicknameModal) {
            const btn = document.getElementById('btn-submit-nickname');
            if (btn) btn.click();
            return;
        }

        const gameSelector = document.getElementById('game-selector-modal');
        if (gameSelector && !gameSelector.classList.contains('hidden')) {
            const body = document.getElementById('game-selector-body');
            if (body && body.innerHTML.includes('onclick="openGameSelector()"')) {
                openGameSelector();
            } else {
                closeGameSelector();
            }
        }
    }
});

window.startPlaylist = function() {
    if (!isHost || playlist.length === 0) return;
    const game = playlist[0];
    socket.emit('start_game', { lobbyId, gameType: game.url });
};


socket.on('game_started', (data) => {
    ui.lobby.style.display = 'none';
    ui.podium.style.display = 'none';

        document.body.classList.add('game-active');
    ui.frame.style.display = 'block';


            const separator = data.gameType.includes('?') ? '&' : '?';
    ui.frame.src = `${data.gameType}${separator}seed=${data.seed}&party=1`;
});


window.addEventListener('message', (event) => {



                if (event.data && event.data.type === 'GAME_FINISHED') {
        document.body.classList.remove('game-active');
        ui.frame.style.display = 'none';

                ui.podium.style.display = 'block';
        ui.podiumList.innerHTML = `<p style="color:var(--text-secondary);">${t.waitingOthers}</p>`;

                socket.emit('submit_score', { lobbyId, score: event.data.score, playerId: myPlayerId });
    }
});


socket.on('game_results', (data) => {
    document.body.classList.remove('game-active');
    ui.frame.style.display = 'none';
    ui.lobby.style.display = 'none';
    ui.podium.style.display = 'block';


        const gameNameEl = document.getElementById('podium-game-name');
    if (gameNameEl && data.gameName) {
        const parts = data.gameName.split('/');
        gameNameEl.textContent = parts[parts.length - 2]?.replace(/_/g, ' ') || '';
    }

    const isFinal = playlist.length <= 1;
    const titleEl = document.querySelector('.podium-title');
    if (titleEl) {
        titleEl.textContent = isFinal ? t.leaderboard : (t.gameLeaderboard || "Classement de la manche");
    }

    if (isFinal) {
        ui.podium.classList.add('final-leaderboard');
    } else {
        ui.podium.classList.remove('final-leaderboard');
    }

    ui.podiumList.innerHTML = (data.players || []).map((p, i) => {
        const medal = `<span style="color:var(--text-secondary)">${i + 1}</span>`;
        const isMe = p.persistentId === myPlayerId || p.name === myPlayerName;
        return `
            <div class="podium-entry">
                <div class="podium-rank">${medal}</div>
                <div class="podium-info" style="min-width: 0; overflow: hidden;">
                    <div class="podium-name ${isMe ? 'is-me' : ''}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${p.name}">${p.name}</div>
                </div>
                <div style="text-align:right; white-space: nowrap; flex-shrink: 0; margin-left: 10px;">
                    <span class="podium-score">${p.score.toLocaleString()}</span>
                    <span class="podium-score-label">${t.pts}</span>
                </div>
            </div>`;
    }).join('');

    const replayBtn = document.getElementById('btn-back-lobby');
    if (replayBtn) {
        replayBtn.style.display = isHost ? 'inline-block' : 'none';
        replayBtn.textContent = isFinal ? (t.backLobby || "Retour au menu") : (t.nextGame || "Jeu suivant");
    }
});


window.nextGame = function() {
    if (!isHost) return;
    playlist.shift();
    sessionStorage.setItem('lobby_playlist_' + lobbyId, JSON.stringify(playlist));
    if (typeof socket !== 'undefined') {
        socket.emit('sync_playlist', { lobbyId, playlist });
    }
    if (playlist.length > 0) {
        startPlaylist();
    } else {
        socket.emit('back_to_lobby', { lobbyId });
    }
};

window.backToLobby = function() {
    if (!isHost) return;
    socket.emit('back_to_lobby', { lobbyId });
};

socket.on('back_to_lobby', () => {
    ui.podium.style.display = 'none';
    ui.frame.style.display = 'none';
    ui.lobby.style.display = 'flex';
});
