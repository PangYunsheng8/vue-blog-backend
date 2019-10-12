const fs = require('fs')
const router = require('koa-router')()
const User = require('../../model/user')
const Permission = require('../../model/userpermission')

router.prefix('/api')

// router.use(async (ctx, next) => {
//     const {method, url} = ctx.request

//     const userId = ctx.session.userId || 1
//     let user = await User.findByPk(userId)
//     let permissions = await user.getPermissions()
//     let isPermission = permissions.some(i => {
//         let reg = new RegExp(i.path).test(url)
//         return i.method == method && reg
//     })
//     if (isPermission) {
//         await next()
//     } else {
//         ctx.body = {
//             err: 1,
//             info: 'permission denied',
//             data: null
//         }
//     }
// })

fs.readdirSync(__dirname).filter(i => i !='index.js').forEach(i => {
    let module = require(`./${i}`)
    router.use(module.routes(), module.allowedMethods())
})

router.use(async (ctx, next) => {
    ctx.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH"
    })
    await next()
})

// router.use(articleRouter.routes(), articleRouter.allowedMethods())
// router.use(lastestArticleRouter.routes(), lastestArticleRouter.allowedMethods())

module.exports = router