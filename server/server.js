require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');

const cookieParser = require('cookie-parser');
const cors = require('cors');


const sequelize = require('./config/database'); 
const User = require('./models/User');
const Score = require('./models/Score');
const UserRecord = require('./models/UserRecord');
const Lobby = require('./models/Lobby');

const app = express();
const port = process.env.PORT || 3000;




app.use(express.json());
app.use(cookieParser());


app.use(cors({
    origin: ['http://localhost:3000', 'https://stimuludo.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const rootPath = path.join(__dirname, '..');
const publicPath = path.join(rootPath, 'public');

if (fs.existsSync(publicPath)) {
    app.use(express.static(publicPath, {
        setHeaders: (res, filePath) => {
            if (filePath.endsWith('.webmanifest')) {
                res.setHeader('Content-Type', 'application/manifest+json');
            }
        }
    }));
}


const authRoutes = require('./routes/auth');
const bestRoutes = require('./routes/best');
const scoresRoutes = require('./routes/scores');

app.use('/api/auth', authRoutes);
app.use('/api/best', bestRoutes);
app.use('/api/scores', scoresRoutes);

app.get('/api/health', async (req, res) => {
    const report = {
        db: 'unknown',
        socketio: 'unknown',
        multiplayer: 'unknown',
        node: process.version,
    };
    try {
        await sequelize.authenticate();
        report.db = 'connected';
    } catch (err) {
        report.db = 'error: ' + err.message;
    }
    try {
        require('socket.io');
        report.socketio = 'installed';
    } catch (e) {
        report.socketio = 'NOT INSTALLED: ' + e.message;
    }
    try {
        require('./multiplayer');
        report.multiplayer = 'loaded';
    } catch (e) {
        report.multiplayer = 'error: ' + e.message;
    }
    res.json(report);
});





app.get(/^\/(?!socket\.io).*/, (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send(`<h1>Erreur : index.html introuvable</h1>`);
    }
});


async function runGuestMigration() {
    const qi = sequelize.getQueryInterface();
    const dialect = sequelize.getDialect(); 


        try {
        const scoresCols = await qi.describeTable('Scores');


                if (!scoresCols.guest_id) {
            await qi.addColumn('Scores', 'guest_id', {
                type: require('sequelize').DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            });
            console.log('✅ Migration: colonne guest_id ajoutée à Scores.');
        }


                if (scoresCols.UserId && !scoresCols.UserId.allowNull) {
            await qi.changeColumn('Scores', 'UserId', {
                type: require('sequelize').DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                references: { model: 'Users', key: 'id' },
                onDelete: 'CASCADE'
            });
            console.log('✅ Migration: UserId dans Scores rendu nullable.');
        }
    } catch (e) {
        console.warn('⚠️ Migration Scores (non bloquante):', e.message);
    }


        try {
        const recordCols = await qi.describeTable('user_records');


                if (!recordCols.guest_id) {
            await qi.addColumn('user_records', 'guest_id', {
                type: require('sequelize').DataTypes.STRING,
                allowNull: true,
                defaultValue: null
            });
            console.log('✅ Migration: colonne guest_id ajoutée à user_records.');
        }


                if (recordCols.user_id && !recordCols.user_id.allowNull) {
            await qi.changeColumn('user_records', 'user_id', {
                type: require('sequelize').DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null,
                references: { model: 'Users', key: 'id' },
                onDelete: 'CASCADE'
            });
            console.log('✅ Migration: user_id dans user_records rendu nullable.');
        }
    } catch (e) {
        console.warn('⚠️ Migration user_records (non bloquante):', e.message);
    }
}


const http = require('http');
const server = http.createServer(app);


try {
    const { initMultiplayer } = require('./multiplayer');
    initMultiplayer(server);
    console.log('✅ Multijoueur (Socket.io) initialisé.');
} catch (err) {
    console.error('❌ FATAL: Impossible d\'initialiser le multijoueur:', err.message);
    console.error('   → socket.io installé ?', err.code === 'MODULE_NOT_FOUND' ? 'NON !' : 'Autre erreur');
    console.error(err.stack);
}

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connexion base de données établie.');


                await runGuestMigration();



                        await sequelize.sync({ alter: false });
        console.log('✅ Tables standards vérifiées.');



                        try {
            const Lobby = require('./models/Lobby');
            await Lobby.sync({ force: false }); 
            console.log('✅ Table multiplayer_lobbies vérifiée.');
        } catch (lobbyErr) {
            console.error('⚠️ Table multiplayer_lobbies inaccessible:', lobbyErr.message);
        }

    } catch (error) {
        console.error('❌ Erreur critique de base de données :', error.message);
    }


        if (typeof(PhusionPassenger) !== 'undefined') {
        server.listen('passenger');
        console.log('🚀 Serveur prêt via Phusion Passenger');
    } else {
        server.listen(port, () => {
            console.log(`🚀 Serveur local prêt : http://localhost:${port}`);
        });
    }
}

startServer();