const router = require('koa-router')()
const {sequelize, User} = require('../../model')

router.prefix('/user')

router.get('/:id', async (ctx) =>{
})

router.post('/', async (ctx) =>{
    const {username, password, email} = ctx.request.body
    let user
    try{
        user = await User.create({username, password, email})
    } catch (e) {
        ctx.body = {
            err: 10005,
            info: 'username is already used',
            data: null
        }
        return
    }

    user = JSON.parse(JSON.stringify(user))
    delete user.password
    ctx.body = {
        err: 0,
        info: null,
        data: user
    }
})

module.exports = router