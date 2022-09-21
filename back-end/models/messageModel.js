const Sequelize = require('sequelize');

const sequelize = require('../db')

const User = require('./userModel')

const Message = sequelize.define('message', {
    username: {
        type: Sequelize.STRING,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    message: {
        type: Sequelize.TEXT,
        required: true,
    },
    users: Sequelize.ARRAY(Sequelize.TEXT)
},
    {
        timestamps: true
    })

User.hasMany(Message, {foreignKey: 'senderId'})
Message.belongsTo(User)

module.exports = Message