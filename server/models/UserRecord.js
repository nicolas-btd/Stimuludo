
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); 

const UserRecord = sequelize.define('UserRecord', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    game_mode_key: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0 
        }
    },
    game_details: {
        type: DataTypes.JSON, 
        allowNull: true
    },
    guest_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'user_records',
    timestamps: true, 
    indexes: [
        {
            name: 'idx_user_game_date', 
            fields: ['user_id', 'game_mode_key', 'createdAt']
        },
        {
            name: 'idx_game_score',     
            fields: ['game_mode_key', 'score']
        }
    ]
});



User.hasMany(UserRecord, { foreignKey: { name: 'user_id', allowNull: true }, onDelete: 'CASCADE' });
UserRecord.belongsTo(User, { foreignKey: { name: 'user_id', allowNull: true } });

module.exports = UserRecord;