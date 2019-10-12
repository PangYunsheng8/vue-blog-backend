const {Sequelize, sequelize} = require('./base')

let Article =  sequelize.define("article", {
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    clickTimes:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    content:{
        type: Sequelize.TEXT,
        defaultValue: ""
    }
})

module.exports = Article