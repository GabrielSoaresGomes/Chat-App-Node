const Sequelize = require('sequelize');

const sequelize = require('../db')

const User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: Sequelize.STRING,
        required: true,
        max: 50,
        unique: true

    },
    password: {
        type: Sequelize.STRING,
        required: true,
        min: 8
    },
    isAvatarImageSet: {
        type: Sequelize.BOOLEAN,
        default: false
    },
    avatarImage: {
        type: Sequelize.TEXT,
        default: ""
    }
})

module.exports = User