const { Server } = require("socket.io");
const crypto = require("crypto");
const Lobby = require("./models/Lobby");

const MAX_PLAYERS_PER_LOBBY = 100;


const localLobbiesCache = {};

function initMultiplayer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });


        setInterval(async () => {
        for (const lobbyId in localLobbiesCache) {
            try {
                const dbLobby = await Lobby.findByPk(lobbyId);
                if (!dbLobby) continue;

                const localLobby = localLobbiesCache[lobbyId];


                                const dbPlayersStr = JSON.stringify(dbLobby.players || []);
                const localPlayersStr = JSON.stringify(localLobby.players || []);

                if (dbPlayersStr !== localPlayersStr) {
                    localLobby.players = dbLobby.players;

                                        io.to(lobbyId).emit("player_joined", { players: dbLobby.players, hostId: dbLobby.hostId });
                }


                                if (dbLobby.state === 'playing' && localLobby.state !== 'playing') {
                    localLobby.state = 'playing';
                    io.to(lobbyId).emit("game_started", {
                        gameType: dbLobby.currentGame,
                        seed: dbLobby.gameSeed
                    });
                }


                                if (dbLobby.state === 'podium' && localLobby.state !== 'podium') {
                    localLobby.state = 'podium';
                    io.to(lobbyId).emit("game_results", {
                        players: dbLobby.players
                    });
                }


                                if (dbLobby.state === 'waiting' && localLobby.state === 'podium') {
                    localLobby.state = 'waiting';
                }
            } catch (e) {
                console.error("Erreur sync lobby:", e.message);
            }
        }
    }, 1500); 

    io.on("connection", (socket) => {
        let currentLobbyId = null;
        console.log(`Un joueur s'est connecté (Multijoueur) : ${socket.id}`);

        socket.on("join_lobby", async ({ lobbyId, playerName, playerId }, callback) => {
            try {
                let dbLobby = await Lobby.findByPk(lobbyId);

                if (!dbLobby) {
                    dbLobby = await Lobby.create({
                        id: lobbyId,
                        hostId: socket.id,
                        players: []
                    });
                }



                                                const rawPlayers = dbLobby.players;
                const players = Array.isArray(rawPlayers)
                    ? JSON.parse(JSON.stringify(rawPlayers))       
                    : (typeof rawPlayers === 'string' && rawPlayers
                        ? JSON.parse(rawPlayers)                   
                        : []);                                      






                                                                                const PSEUDO_LIST = [
                    "Glutamate", "Aspartate", "Glycine", "Taurine", "Agmatine", "Dopamine", "Noradrénaline", "Adrénaline",
                    "Sérotonine", "Histamine", "Mélatonine", "Tyramine", "Tryptamine", "Phényléthylamine", "Octopamine",
                    "Acétylcholine", "Adénosine", "Guanosine", "Anandamide", "Virodhamine", "Cholestérol", "Sphingomyéline",
                    "Nociceptine", "Oxytocine", "Vasopressine", "Somatostatine", "Prolactine", "Neurotensine", "Cholécystokine",
                    "Galanines", "Bradykinine", "Prégnénolone", "Alloprégnanolone", "Progestérone", "Cortisol", "Corticostérone",
                    "Estradiol", "Estrone", "Testostérone", "Dihydrotestostérone", "Androstènedione", "Glucose", "Lactate",
                    "Pyruvate", "Succinate", "Citrate", "Malate", "Créatine", "Phosphocréatine", "Carnitine", "Choline",
                    "Inositol", "Oléamide", "Endorphine", "Dynorphine", "Leptine", "Ghréline", "Glutathion", "Homocystéine",
                    "Ubiquinone", "Adrénomédulline", "Aminobutyrate", "Orexine", "Enképhaline", "Kisspeptine", "Galanine", "Squalène", "Lanostérol",
                    "Lécithine", "Céramide", "Galactose", "Fructose", "Ribose", "Désoxyribose", "Glycogène", "Acétate", "Butyrate",
                    "Propionate", "Acétoacétate", "Mélanine", "Spermidine", "Spermine", "Putrescine", "Cadavérine", "Histidine",
                    "Tryptophane", "Tyrosine", "Phénylalanine", "Méthionine", "Noladin", "Oline", "Neurostéroïde", "Nerveux",
                    "Arachidonoyldopamine", "Cérébroside", "Psychosine", "Ganglioside", "Astrocyte", "Guanine", "Cytosine"
                ];


                                const existingIdx = playerId
                    ? players.findIndex(p => p.persistentId === playerId)
                    : -1;

                if (existingIdx !== -1) {

                                        players[existingIdx].id = socket.id;
                    players[existingIdx].name = playerName || players[existingIdx].name;
                    console.log(`Joueur ${players[existingIdx].name} reconnecté dans ${lobbyId}.`);
                } else {

                                        if (players.length >= MAX_PLAYERS_PER_LOBBY) {
                        if (callback) callback({ success: false, message: "Lobby plein" });
                        return;
                    }

                    let finalName = playerName;
                    if (!finalName || finalName.trim() === '' || finalName.startsWith('Joueur_') || finalName.startsWith('Player_')) {
                        const usedNames = players.map(p => p.name);
                        const availableNames = PSEUDO_LIST.filter(n => !usedNames.includes(n));
                        if (availableNames.length > 0) {
                            finalName = availableNames[Math.floor(Math.random() * availableNames.length)];
                        } else {
                            finalName = `Joueur ${Math.floor(Math.random() * 10000)}`;
                        }
                    }

                    const newPlayer = {
                        id: socket.id,
                        persistentId: playerId || socket.id,
                        name: finalName,
                        score: 0,
                        ready: false
                    };
                    players.push(newPlayer);
                    console.log(`Joueur ${newPlayer.name} a rejoint le lobby ${lobbyId}.`);
                }


                                if (!dbLobby.hostId || !players.find(p => p.id === dbLobby.hostId)) {
                    dbLobby.hostId = socket.id;
                }


                                dbLobby.players = players;
                dbLobby.changed('players', true); 
                await dbLobby.save();

                socket.join(lobbyId);
                currentLobbyId = lobbyId;


                                if (!localLobbiesCache[lobbyId]) {
                    localLobbiesCache[lobbyId] = { state: dbLobby.state, players: JSON.parse(JSON.stringify(players)) };
                } else {
                    localLobbiesCache[lobbyId].players = JSON.parse(JSON.stringify(players));
                }


                if (callback) callback({ success: true, isHost: dbLobby.hostId === socket.id, hostId: dbLobby.hostId, players });


                                io.to(lobbyId).emit("player_joined", { players, hostId: dbLobby.hostId });

            } catch (e) {
                console.error("Erreur join_lobby:", e);

                                if (callback) callback({ success: false, message: e.message || "Erreur serveur interne" });
            }
        });

        socket.on("sync_playlist", async ({ lobbyId, playlist }) => {
            try {
                const dbLobby = await Lobby.findByPk(lobbyId);
                if (dbLobby && dbLobby.hostId === socket.id) {

                                        socket.to(lobbyId).emit("sync_playlist", { playlist });
                }
            } catch (e) { console.error(e); }
        });

        socket.on("start_game", async ({ lobbyId, gameType }) => {
            try {
                const dbLobby = await Lobby.findByPk(lobbyId);
                if (dbLobby && dbLobby.hostId === socket.id) {
                    const seed = crypto.randomBytes(8).toString('hex');
                    dbLobby.state = 'playing';
                    dbLobby.currentGame = gameType;
                    dbLobby.gameSeed = seed;
                    await dbLobby.save();


                                        if (localLobbiesCache[lobbyId]) {
                        localLobbiesCache[lobbyId].state = 'playing';
                    }


                                        io.to(lobbyId).emit("game_started", { gameType, seed });
                }
            } catch (e) { console.error(e); }
        });

        socket.on("submit_score", async ({ lobbyId, score, playerId }) => {
            try {
                const dbLobby = await Lobby.findByPk(lobbyId);
                if (dbLobby) {

                                        const raw = dbLobby.players;
                    const players = Array.isArray(raw) ? JSON.parse(JSON.stringify(raw))
                        : (typeof raw === 'string' && raw ? JSON.parse(raw) : []);


                                        const player = players.find(p =>
                        (playerId && p.persistentId === playerId) || p.id === socket.id
                    );
                    if (player) {
                        player.score = (player.score || 0) + score;
                        player.ready = true;

                                                player.id = socket.id;
                    } else {
                        console.warn(`submit_score: joueur introuvable (socket=${socket.id}, pid=${playerId})`);
                    }

                    dbLobby.players = players;
                    dbLobby.changed('players', true);

                    const allFinished = players.length > 0 && players.every(p => p.ready);
                    if (allFinished) {
                        players.sort((a, b) => b.score - a.score);
                        players.forEach(p => p.ready = false);
                        dbLobby.state = 'podium';
                        dbLobby.players = players;
                        dbLobby.changed('players', true);
                    }
                    await dbLobby.save();


                                        if (allFinished) {
                        if (localLobbiesCache[lobbyId]) {
                            localLobbiesCache[lobbyId].state = 'podium';
                            localLobbiesCache[lobbyId].players = JSON.parse(JSON.stringify(players));
                        }
                        io.to(lobbyId).emit("game_results", {
                            players,
                            gameName: dbLobby.currentGame
                        });
                    }
                }
            } catch (e) { console.error("Erreur submit_score:", e); }
        });


        socket.on("disconnect", async () => {
            if (currentLobbyId) {
                try {
                    const dbLobby = await Lobby.findByPk(currentLobbyId);
                    if (dbLobby) {
                        let players = dbLobby.players || [];
                        const initialLength = players.length;
                        players = players.filter(p => p.id !== socket.id);

                        if (players.length !== initialLength) {
                            if (players.length === 0) {
                                await dbLobby.destroy(); 
                                delete localLobbiesCache[currentLobbyId];
                            } else {
                                if (dbLobby.hostId === socket.id) {
                                    dbLobby.hostId = players[0].id; 

                                                                        io.to(dbLobby.hostId).emit("host_assigned", { hostId: dbLobby.hostId });
                                }
                                dbLobby.players = players;
                                await dbLobby.save();
                                io.to(currentLobbyId).emit("player_left", { players, hostId: dbLobby.hostId });
                            }
                        }
                    }
                } catch (e) { console.error("Erreur disconnect:", e); }
            }
        });

                socket.on("back_to_lobby", async ({ lobbyId }) => {
            try {
                const dbLobby = await Lobby.findByPk(lobbyId);
                if (dbLobby && dbLobby.hostId === socket.id) {

                                        const players = (dbLobby.players || []).map(p => ({ ...p, score: 0, ready: false }));
                    dbLobby.state = 'waiting';
                    dbLobby.players = players;
                    dbLobby.currentGame = null;
                    dbLobby.gameSeed = null;
                    await dbLobby.save();

                    if (localLobbiesCache[lobbyId]) {
                        localLobbiesCache[lobbyId].state = 'waiting';
                        localLobbiesCache[lobbyId].players = JSON.parse(JSON.stringify(players));
                    }

                    io.to(lobbyId).emit('back_to_lobby');
                }
            } catch (e) { console.error('Erreur back_to_lobby:', e); }
        });
    });
}

module.exports = { initMultiplayer };
