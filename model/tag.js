const {Sequelize, sequelize} = require('./base')

let Tag = sequelize.define("tag", {
    name: {
        type: Sequelize.STRING,
        unique: true
    },
    desc: {
        type: Sequelize.STRING
    }
})

module.exports = Tag