const router = require('express').Router()
const bcrypt = require('bcrypt')
const { Op } = require("sequelize");

const User = require('../models/userModel')
// Passar os métodos para dentro de um controller, deixando apenas as rotas aqui, puxando os métodos ex:
// const {register} = require('../controllers/userControllers
// router.post("/register", register)
// e no controller ter o module.exports.register = register

router.post("/register", async (req, res, next) => {
    try {
        const {username, email, password} = req.body
        const usernameCheck = await User.findOne({raw: true, where: {username} })
        if (usernameCheck) {
            return res.json({msg: "Username already used!"})
        }
        const emailCheck = await User.findOne({raw: true, where: {email} })
        if (emailCheck) {
            return res.json({msg: "Email already used!"})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({username, email, password: hashedPassword})
        delete user.password //Por segurança, pois iremos mandar o usuário para o front
        const userData = user.get({plain: true})
        return res.json({status: true, user: userData})
    }
    catch (err) {
        next(err)
    }

})

router.post("/login", async (req, res, next) => {
    try{
        const {username, password} = req.body
        const user = await User.findOne({raw: true, where: {username} })
        if (!user) {
            return res.json({msg: 'Incorrect username or password!', status: false})
        }
        const passwordIsValid = await bcrypt.compare(password, user.password)
        if (!passwordIsValid) {
            return res.json({msg: "Incorrect username or password!", status: false})
        }
        delete user.password
        return res.json({status: true, user})
    }
    catch (err) {
        next(err)
    }
})

router.post('/setAvatar/:id', async (req, res, next) => {
    try {
        const userId = req.params.id
        const avatarImage = req.body.image
        const user = await User.findByPk(userId)
        await user.update({isAvatarImageSet: true, avatarImage})
        const userData = user.get({plain: true})
        return res.json({isSet: userData.isAvatarImageSet, image:userData.avatarImage})
    }
    catch (error) {
        next(error)
    }
})

//Estamos pegando o id, pois iremos pegar todos usuários menos o atual
router.get('/allusers/:id', async (req, res, next) => {
    try {
        const userId = req.params.id
        // Linha de baixo: Pega todos usuários menos os que tem id ne(not-equal / não igual) ao id da url
        const users = await User.findAll({attributes: ['username', 'email', 'avatarImage','id'],
            where: { id: {[Op.ne] : userId} } })
        return res.json(users)
    }
    catch (error) {
        next(error)
    }
})

module.exports = router