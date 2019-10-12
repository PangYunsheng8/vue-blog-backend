const Sequelize = require('sequelize');

module.exports = {
    Sequelize,
    sequelize: new Sequelize('blog', 'root', 'pys5660789', {
        host: 'localhost',
        dialect: 'mysql',
        port: 3307,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    })
}