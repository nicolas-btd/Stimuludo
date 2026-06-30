
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');


const User = require('../models/User');
const Score = require('../models/Score'); 
const { Op } = require('sequelize'); 




const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true, 
    auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
    }
});





const getLang = (req) => {
    const langHeader = req.headers['accept-language'];
    return (langHeader && langHeader.startsWith('en')) ? 'en' : 'fr';
};




const verifyToken = (req, res, next) => {
    const token = req.cookies ? req.cookies.token : null;
    const lang = getLang(req);

        if (!token) {
        const msg = lang === 'en' ? "Access denied. Please log in." : "Accès refusé. Veuillez vous connecter.";
        return res.status(401).json({ message: msg });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        const msg = lang === 'en' ? "Session expired or invalid token." : "Session expirée ou token invalide.";
        res.status(400).json({ message: msg });
    }
};






router.post('/register', async (req, res) => {
    const lang = getLang(req);
    try {
        const { username, email, password } = req.body;


                        const cleanUsername = username ? username.trim() : '';
        const cleanEmail = email ? email.trim().toLowerCase() : '';

        if (!cleanUsername || !cleanEmail || !password || password.length < 6) {
             const msg = lang === 'en' ? "Invalid data provided. Password must be at least 6 characters." : "Données fournies invalides. Le mot de passe doit faire au moins 6 caractères.";
             return res.status(400).json({ message: msg });
        }

                const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: cleanEmail },
                    { username: cleanUsername }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === cleanEmail) {
                const msg = lang === 'en' ? "This email is already in use." : "Cet email est déjà utilisé.";
                return res.status(400).json({ message: msg });
            }
            if (existingUser.username === cleanUsername) {
                const msg = lang === 'en' ? "This username is already taken." : "Ce pseudo est déjà pris.";
                return res.status(400).json({ message: msg });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword
        });

        if (!process.env.JWT_SECRET) {
            const msg = lang === 'en' ? "Server configuration error." : "Erreur de configuration du serveur.";
            return res.status(500).json({ message: msg });
        }

        const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(201).json({ user: { id: newUser.id, username: newUser.username, email: newUser.email } });

    } catch (err) {
        console.error(err);
        const msg = lang === 'en' ? "Server error during registration." : "Erreur serveur lors de l'inscription.";
        res.status(500).json({ message: msg });
    }
});


router.get('/check-username/:username', async (req, res) => {
    try {
        const username = req.params.username.trim(); 
        const user = await User.findOne({ where: { username: username } });

                if (user) {
            return res.json({ available: false });
        }

                return res.json({ available: true });
    } catch (err) {
        console.error("Erreur check-username:", err);

                res.status(500).json({ error: "Server Error" });
    }
});


router.post('/login', async (req, res) => {
    const lang = getLang(req);
    try {
        const email = req.body.email ? req.body.email.trim().toLowerCase() : '';
        const password = req.body.password;

        const user = await User.findOne({ where: { email } });
        const errMsg = lang === 'en' ? "Incorrect email or password." : "Email ou mot de passe incorrect.";

        if (!user) return res.status(400).json({ message: errMsg });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: errMsg });

        if (!process.env.JWT_SECRET) {
            const msg = lang === 'en' ? "Server configuration error." : "Erreur de configuration du serveur.";
            return res.status(500).json({ message: msg });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, { 
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ user: { id: user.id, username: user.username, email: user.email } });

    } catch (err) {
        console.error(err);
        const msg = lang === 'en' ? "Server error." : "Erreur serveur.";
        res.status(500).json({ message: msg });
    }
});


router.get('/distribution/:gameId', async (req, res) => {
    try {
        const { gameId } = req.params;

        const scores = await Score.findAll({
            where: { gameId: gameId },
            attributes: ['value'], 
        });

        const values = scores.map(s => s.value);
        res.json(values);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error fetching stats" });
    }
});







router.post('/request-password-reset', async (req, res) => {
    const lang = getLang(req);
    try {
        const email = req.body.email ? req.body.email.trim().toLowerCase() : ''; 

                const user = await User.findOne({ where: { email } });

                if (!user) {
            const msg = lang === 'en' ? "No account is associated with this email address." : "Aucun compte n'est associé à cette adresse email.";
            return res.status(400).json({ message: msg });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 1);

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = expireDate;
        await user.save();

        const frontendUrl = process.env.FRONTEND_URL || 'https://stimuludo.com';
        const resetLink = `${frontendUrl}/reset/reset.html?token=${resetToken}&lang=${lang}`; 

        const senderEmail = process.env.SMTP_USER;


                        const emailSubject = lang === 'en' ? "Stimuludo Password Reset" : "Réinitialisation de votre mot de passe Stimuludo";

                const htmlContentFR = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Demande de réinitialisation de mot de passe</h2>
                <p>Bonjour ${user.username},</p>
                <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le lien ci-dessous pour en choisir un nouveau :</p>
                <br>
                <a href="${resetLink}" style="display:inline-block; padding:12px 24px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">Réinitialiser mon mot de passe</a>
                <br><br>
                <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.</p>
                <p>Ce lien expirera dans 1 heure.</p>
            </div>
        `;

                const htmlContentEN = `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>Hello ${user.username},</p>
                <p>You requested a password reset. Click the link below to choose a new one:</p>
                <br>
                <a href="${resetLink}" style="display:inline-block; padding:12px 24px; background-color:#4CAF50; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">Reset my password</a>
                <br><br>
                <p>If you did not make this request, you can safely ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
            </div>
        `;

        const mailOptions = {
            from: `"Stimuludo Support" <${senderEmail}>`,
            to: user.email,
            subject: emailSubject,
            html: lang === 'en' ? htmlContentEN : htmlContentFR
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email de réinitialisation envoyé à ${user.email}`);

        const successMsg = lang === 'en' ? "The reset link has been successfully sent!" : "Le lien de réinitialisation a été envoyé avec succès !";
        res.status(200).json({ message: successMsg });

    } catch (err) {
        console.error("Erreur request-password-reset:", err);
        const msg = lang === 'en' ? "Server error during the request." : "Erreur serveur lors de la demande.";
        res.status(500).json({ message: msg });
    }
});


router.post('/reset-password/:token', async (req, res) => {
    const lang = getLang(req);
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            const msg = lang === 'en' ? "The password must be at least 6 characters long." : "Le mot de passe doit contenir au moins 6 caractères.";
            return res.status(400).json({ message: msg });
        }

        const user = await User.findOne({ 
            where: { 
                resetPasswordToken: token
            } 
        });

        if (!user) {
            const msg = lang === 'en' ? "This reset link is invalid. Token not found." : "Ce lien de réinitialisation est invalide. Token introuvable.";
            return res.status(400).json({ message: msg });
        }

        const now = new Date();
        const expireDate = new Date(user.resetPasswordExpires);

                if (expireDate < now) {
            const msg = lang === 'en' ? "This reset link has expired." : "Ce lien de réinitialisation a expiré.";
            return res.status(400).json({ message: msg });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        console.log(`✅ Mot de passe réinitialisé pour l'utilisateur : ${user.username}`);
        const successMsg = lang === 'en' ? "Your password has been successfully updated." : "Votre mot de passe a été mis à jour avec succès.";
        res.status(200).json({ message: successMsg });

    } catch (err) {
        console.error("🔥 ERREUR CRITIQUE RESET-PASSWORD :", err);
        const msg = lang === 'en' ? "Server error during reset." : "Erreur serveur lors de la réinitialisation.";
        res.status(500).json({ message: msg });
    }
});







router.put('/update-username', verifyToken, async (req, res) => {
    const lang = getLang(req);
    try {
        const newUsername = req.body.newUsername ? req.body.newUsername.trim() : ''; 
        if (!newUsername) {
            const msg = lang === 'en' ? "Username is required." : "Le pseudo est requis.";
            return res.status(400).json({ message: msg });
        }

        const existingUser = await User.findOne({ where: { username: newUsername } });
        if (existingUser) {
            const msg = lang === 'en' ? "This username is already taken." : "Ce pseudo est déjà pris.";
            return res.status(400).json({ message: msg });
        }

        await User.update({ username: newUsername }, { where: { id: req.user.id } });

        const successMsg = lang === 'en' ? "Username successfully updated." : "Pseudo mis à jour avec succès.";
        res.status(200).json({ message: successMsg, username: newUsername });
    } catch (err) {
        console.error("Erreur update-username:", err);
        const msg = lang === 'en' ? "Server error during update." : "Erreur serveur lors de la mise à jour.";
        res.status(500).json({ message: msg });
    }
});


router.put('/update-email', verifyToken, async (req, res) => {
    const lang = getLang(req);
    try {
        const newEmail = req.body.newEmail ? req.body.newEmail.trim().toLowerCase() : ''; 
        const password = req.body.password;

                if (!newEmail || !password) {
            const msg = lang === 'en' ? "Email and password are required." : "Email et mot de passe requis.";
            return res.status(400).json({ message: msg });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            const msg = lang === 'en' ? "User not found." : "Utilisateur introuvable.";
            return res.status(404).json({ message: msg });
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            const msg = lang === 'en' ? "Incorrect current password." : "Mot de passe actuel incorrect.";
            return res.status(400).json({ message: msg });
        }

        const existingEmail = await User.findOne({ where: { email: newEmail } });
        if (existingEmail) {
            const msg = lang === 'en' ? "This email is already used by another account." : "Cet email est déjà utilisé par un autre compte.";
            return res.status(400).json({ message: msg });
        }

        await User.update({ email: newEmail }, { where: { id: req.user.id } });

        const successMsg = lang === 'en' ? "Email successfully updated." : "Email mis à jour avec succès.";
        res.status(200).json({ message: successMsg });
    } catch (err) {
        console.error("Erreur update-email:", err);
        const msg = lang === 'en' ? "Server error during update." : "Erreur serveur lors de la mise à jour.";
        res.status(500).json({ message: msg });
    }
});


router.post('/logout', (req, res) => {
    const lang = getLang(req);
    res.clearCookie('token');
    const msg = lang === 'en' ? "Logged out successfully." : "Déconnexion réussie.";
    res.status(200).json({ message: msg });
});


router.delete('/delete-account', verifyToken, async (req, res) => {
    const lang = getLang(req);
    try {
        const { password } = req.body;
        if (!password) {
            const msg = lang === 'en' ? "Password required for deletion." : "Mot de passe requis pour la suppression.";
            return res.status(400).json({ message: msg });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            const msg = lang === 'en' ? "User not found." : "Utilisateur introuvable.";
            return res.status(404).json({ message: msg });
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            const msg = lang === 'en' ? "Incorrect password." : "Mot de passe incorrect.";
            return res.status(400).json({ message: msg });
        }

        await User.destroy({ where: { id: req.user.id } });
        res.clearCookie('token');

                const successMsg = lang === 'en' ? "Account successfully deleted." : "Compte supprimé avec succès.";
        res.status(200).json({ message: successMsg });
    } catch (err) {
        console.error("Erreur delete-account:", err);
        const msg = lang === 'en' ? "Server error during account deletion." : "Erreur serveur lors de la suppression du compte.";
        res.status(500).json({ message: msg });
    }
});




router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email'] 
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;