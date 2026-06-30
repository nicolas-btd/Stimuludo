
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const UserRecord = require('../models/UserRecord');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Accès refusé. Token manquant.' });
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) return res.status(403).json({ message: 'Token invalide ou expiré.' });
        req.user = decodedUser; 
        next();
    });
};

const optionalAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        req.user = null;
        return next();
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        req.user = err ? null : decodedUser;
        next();
    });
};

router.post('/', optionalAuth, async (req, res) => {
    try {
        const { game_mode_key, score, details, guest_id } = req.body;


                if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Identification requise pour enregistrer un record.' });
        }


                const numericScore = Number(score);
        if (!game_mode_key || isNaN(numericScore) || numericScore < 0 || numericScore > 999999) {
            const identifier = `utilisateur ${req.user.id}`;
            console.warn(`⚠️ Tentative de triche détectée par ${identifier} sur ${game_mode_key} avec score: ${score}`);
            return res.status(400).json({ error: "Score invalide ou corrompu." });
        }

        const recordData = {
            game_mode_key: game_mode_key.trim(),
            score: numericScore,
            game_details: details || {},
            user_id: req.user.id
        };

        const newRecord = await UserRecord.create(recordData);

        res.status(201).json({ message: "Record sauvegardé !", record: newRecord });
    } catch (error) {
        console.error("Erreur sauvegarde record :", error);
        res.status(500).json({ error: "Erreur serveur lors de la sauvegarde du record." });
    }
});

router.get('/history/:gameModeKey', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; 
        const gameModeKey = req.params.gameModeKey;

        const history = await UserRecord.findAll({
            where: {
                user_id: userId,
                game_mode_key: gameModeKey
            },
            attributes: ['score', 'createdAt'],
            order: [['createdAt', 'ASC']] 
        });

        res.status(200).json(history);
    } catch (error) {
        console.error("Erreur récupération historique :", error);
        res.status(500).json({ error: "Erreur serveur lors de la récupération de l'historique." });
    }
});

router.get('/leaderboard/:gameModeKey', async (req, res) => {
    try {
        const gameModeKey = req.params.gameModeKey;


                        const isTimeBased = gameModeKey.startsWith('vrt_') || gameModeKey.startsWith('art_');
        const aggregateFunction = isTimeBased ? 'MIN' : 'MAX';
        const sortOrder = isTimeBased ? 'ASC' : 'DESC';

        const leaderboard = await UserRecord.findAll({
            where: { 
                game_mode_key: gameModeKey,

                                guest_id: null
            },
            attributes: [
                'user_id',
                [sequelize.fn(aggregateFunction, sequelize.col('score')), 'best_score']
            ],
            include: [{
                model: User,
                attributes: ['username'] 
            }],
            group: ['user_id', 'User.id'], 
            order: [[sequelize.literal('best_score'), sortOrder]],
            limit: 10 
        });


                const formattedLeaderboard = leaderboard.map(entry => ({
            username: entry.User.username,
            score: entry.getDataValue('best_score')
        }));

        res.status(200).json(formattedLeaderboard);
    } catch (error) {
        console.error("Erreur récupération leaderboard :", error);
        res.status(500).json({ error: "Erreur serveur lors du classement." });
    }
});

module.exports = router;