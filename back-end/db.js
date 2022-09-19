const Sequelize = require("sequelize");

require('dotenv').config()

const {PORT, dbDialect, dbUsername, dbPassword} = process.env

const sequelize = new Sequelize.Sequelize(dbDialect,dbUsername ,dbPassword, {dialect: "postgres"})

module.exports = sequelize