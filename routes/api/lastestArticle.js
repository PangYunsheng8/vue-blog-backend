const router = require('koa-router')()
const {sequelize, Article} = require('../../model')

router.prefix('/lastest-article')

router.get('/', async (ctx) => {
    let articles = await Article.findAll({
        order:[['createdAt', 'desc']], 
        limit: 5
    })
    ctx.body = {
        err: 0,
        info: null,
        data: articles
    }
})

module.exports = router