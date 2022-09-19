const router = require('express').Router()
const bcrypt = require('bcrypt')

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
        const user = User.create({username, email, password: hashedPassword})
        delete user.password //Por segurança, pois iremos mandar o usuário para o front
        return res.json({status: true, user})
    }
    catch (err) {
        next(err)
    }

})

module.exports = router