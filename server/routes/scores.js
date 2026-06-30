
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Score = require('../models/Score');



const optionalAuthenticateToken = (req, res, next) => {

        const token = req.cookies ? req.cookies.token : null;

    if (!token) {

                return next();
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (!err) {
            req.user = decodedUser; 
        }
        next();
    });
};

router.post('/', optionalAuthenticateToken, async (req, res) => {
    try {
        const { game_id, score, details, guest_id } = req.body;


                        const userId = req.user ? req.user.id : null;
        const numericScore = Number(score);

        if (!game_id || isNaN(numericScore)) {
             return res.status(400).json({ message: 'Données invalides.' });
        }

        if (!userId) {
            return res.status(401).json({ message: 'Utilisateur non identifié (connexion requise).' });
        }

        const scoreDetails = details || {};

        const newScore = await Score.create({
            gameId: game_id.trim(),     
            value: numericScore,        
            details: scoreDetails,    
            userId: userId,
            UserId: userId 
        });

        res.status(201).json({ message: 'Score enregistré !', score: newScore });

    } catch (error) {
        console.error("Erreur enregistrement score :", error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

router.get('/counts', async (req, res) => {
    try {
        const counts = await Score.count({ group: ['gameId'] });
        res.json(counts);
    } catch (error) {
        console.error("Erreur lors de la récupération des compteurs de jeux:", error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

router.get('/distribution/:game_id', async (req, res) => {
    try {


                        const scores = await Score.findAll({
            where: { gameId: req.params.game_id },
            attributes: ['value', 'details']
        });


                        const queryParams = req.query; 

        const filteredScores = scores.filter(s => {
            if (!s.details) {

                                return Object.keys(queryParams).length === 0;
            }


                        let details = s.details;
            if (typeof details === 'string') {
                try { details = JSON.parse(details); } catch (e) { return false; }
            }


                        for (const [key, expectedValue] of Object.entries(queryParams)) {
                const detailValue = details[key];

                if (key === 'constraint') {

                                        const expectedBool = expectedValue === 'true';
                    if (Boolean(detailValue) !== expectedBool) return false;
                } else {

                                        if (String(detailValue) !== String(expectedValue)) return false;
                }
            }

            return true;
        });


                const values = filteredScores.map(s => s.value);
        res.json(values);

            } catch (error) {
        console.error("Erreur lors de la récupération de la distribution:", error);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = router;