
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); 

const Score = sequelize.define('Score', {
    gameId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
            min: 0 
        }
    },
    details: {
        type: DataTypes.JSON, 
        allowNull: true
    },
    guest_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
});



User.hasMany(Score, { foreignKey: { name: 'userId', allowNull: true }, onDelete: 'CASCADE' });
Score.belongsTo(User, { foreignKey: { name: 'userId', allowNull: true } });

module.exports = Score;