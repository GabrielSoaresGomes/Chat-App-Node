const router = require('express').Router()
const bcrypt = require('bcrypt')
const { Op } = require('sequelize');

const Message = require('../models/messageModel')
const User = require('../models/userModel')

router.post('/addmessage', async (req, res, next) => {
    try {
        const {from, to, message} = req.body
        const data = await Message.create({
            message: message,
            users: [from, to],
            senderId: from
        })
        if (data) return res.json({msg: 'Message added successfully!'})
        return res.json({msg: 'Failed to add message to the database!'})
    }
    catch (e) {
        next(e)
    }
})

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return [[
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/'), [padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes())].join(':')].join(' ')
}

router.post('/getmessages', async (req, res, next) => {
    try {
        const {from, to} = req.body
        const messages = await Message.findAll({
            raw: true,
            where: {
                [Op.or]: [
                    {users: [from, to]},
                    {users: [to, from]}
                ]
            }
        })
        const projectMessages = messages.map(msg => {
            return {
                fromSelf: msg.senderId === from,
                message: msg.message,
                dateSended: formatDate(msg.createdAt),
                id: msg.id
            }
        })
        return res.json(projectMessages)
    }
    catch (e) {
        next(e)
    }
})

module.exports = router