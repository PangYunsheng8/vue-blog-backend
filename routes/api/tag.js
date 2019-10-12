const router = require('koa-router')()
const {sequelize, Article, Tag} = require('../../model')

router.prefix('/tag')

router.get('/', async (ctx) =>{
    let tags = await Tag.findAll()
    ctx.body = {
        err: 0,
        info: null,
        data: tags
    }
})

router.post('/', async (ctx) =>{
    const {name, desc} = ctx.request.body

    let tag
    try{
        tag = await Tag.create({name, desc})
    } catch (e) {
        ctx.body = {
            err: 10002,
            info: "tag is already exist",
            tag: null
        }
        return
    } 

    ctx.body = {
        err: 0,
        info: null,
        data: tag
    }
})

module.exports = router