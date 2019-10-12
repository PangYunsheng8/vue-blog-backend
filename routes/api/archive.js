const router = require('koa-router')()
const {sequelize, Article} = require('../../model')

router.prefix('/archive')

router.get('/', async (ctx) => {
    let res = await sequelize.query(`
        SELECT
        date_format(createdAt, '%Y-%m') AS date,
        count(*) AS count
        FROM
        articles
        GROUP BY
        date_format(createdAt, '%Y-%m')
    `, {type: sequelize.QueryTypes.SELECT})
    ctx.body = {
        err: 0,
        info: null,
        data: res.map(i => {
            let arr = i.date.split('-')
            i.year = +arr[0]
            i.month = +arr[1]
            return i
        })
    }
})

module.exports = router