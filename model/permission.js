const {Sequelize, sequelize} = require('./base')

let Permission =  sequelize.define("permission", {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    path:{
        type: Sequelize.STRING
    },
    method:{
        type: Sequelize.TEXT
    }
})

module.exports = Permission