const router = require('koa-router')()
const {Sequelize, Article, Tag, User} = require('../../model')
const createDOMPurify = require('dompurify')
const { JSDOM } = require('jsdom')

const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
const Op = Sequelize.Op;

router.prefix('/article')

router.get('/', async(ctx)=>{
    let {sort = [], offset = 0, pageSize = 10, filter = {}} = ctx.request.query
    if (typeof sort == 'string')
        sort = JSON.parse(sort)
    if (typeof filter == 'string')
        filter = JSON.parse(filter)
    if (JSON.stringify(filter) != "{}") {
        console.log()
        let [key] = Object.keys(filter)
        let [value] = Object.values(filter)
        let {$lt, $gte} = value
        filter = {
            [key]: {
                [Op.lt]: $lt,
                [Op.gte]: $gte
            }
        }
    }
    let articles = await Article.findAll({
        order: sort.length == 0 ? null : [sort],
        offset: +offset,
        limit: +pageSize,
        where: filter,
        include:[{model:Tag}, {model: User, attributes: {exclude: ['password']}}]
    })
    let total = await Article.count()
    let nextOffset = (+offset + +pageSize >= total) ? null: +offset + +pageSize
    ctx.body = {
        err: 0,
        info: null,
        pagination: {
            count: articles.length,
            total,
            offset: +offset,
            nextOffset,
            pageSize: +pageSize
        },
        data: articles.map(i => {
            i.content = DOMPurify.sanitize(i.content)
            return i
        })
    }
})

router.get('/:id', async ctx=>{
    let article = await Article.findOne({where:{id:ctx.params.id}, include:[{model:Tag}]})
    if (article){
        article.clickTimes++
        await article.save()
        article.content = DOMPurify.sanitize(article.content)
        ctx.body = {
            err: 0,
            info: null,
            data: article
        }
    }else{
        ctx.body = {
            err: 10001,
            info: "article is not found",
            data: null
        }
    }
})

router.get('/tag/:id', async (ctx) =>{
    let {id} = ctx.params
    let {offset = 0, pageSize = 10} = ctx.request.query
    let tag = await Tag.findOne({where: {id}})
    if (!tag) {
        ctx.body = {
            err: 10003,
            info: 'tag not exist',
            data: null
        }
    }

    let articles = await tag.getArticles({
        offset: +offset,
        limit: +pageSize,
        include:[{model:Tag}]
    })
    let total = await tag.getArticles()
    let nextOffset = (+offset + +pageSize >= total) ? null: +offset + +pageSize
    ctx.body = {
        err: 0,
        info: null,
        pagination: {
            count: articles.length,
            total,
            offset: +offset,
            nextOffset,
            pageSize: +pageSize
        },
        data: articles.map(i => {
            i.content = DOMPurify.sanitize(i.content)
            return i
        })
    }
})

router.post('/', async (ctx)=>{
    let {title, target, content} = ctx.request.body
    let {userId} = ctx.session
    let article = await Article.create({title, target, content, userId})
    ctx.body = {
        err: 0,
        info: null,
        data: article
    }
})

router.put('/:id', async ctx=>{
    let article = await Article.findOne({where:{id:ctx.params.id}})
    if (article){
        let {title, target, content} = ctx.request.body
        article.title = title
        article.target = target
        article.content = content
        await article.save()

        ctx.body = {
            err: 0,
            info: null,
            data: article
        }
    }else{
        ctx.body = {
            err: 10001,
            info: "article is not found",
            data: null
        }
    }
})

router.delete('/:id', async ctx=>{
    let article = await Article.findOne({where:{id:ctx.params.id}})
    if (article){
        await article.destroy()
        ctx.body = {
            err: 0,
            info: null,
            data: article
        }
    } else {
        ctx.body = {
            err: 10001,
            info: "article is not found",
            data: null
        }
    }
})

module.exports = router