const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lobby = sequelize.define('Lobby', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    hostId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    state: {
        type: DataTypes.STRING,
        defaultValue: 'waiting' 
    },
    currentGame: {
        type: DataTypes.STRING,
        allowNull: true
    },
    gameSeed: {
        type: DataTypes.STRING,
        allowNull: true
    },
    players: {
        type: DataTypes.JSON,
        defaultValue: []
    }
}, {
    tableName: 'multiplayer_lobbies',
    timestamps: true
});

module.exports = Lobby;
