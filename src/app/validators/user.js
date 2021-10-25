const User = require("../model/User")
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for(key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

async function post(req, res, next) {
    try {
        const fillAllFields = checkAllFields(req.body)
        if(fillAllFields){
            return res.render('admin/user/register', fillAllFields)
        }

        //check if user exists [email]
        let {email} = req.body

        const user = await User.findOne({
            where: {email}
        })
        
        if (user) return res.render('admin/user/register', {
            user: req.body,
            error: 'Usuário já cadastrado.'
        })
    } catch (error) {
        console.error(error)
    }
    

    next()
}
async function update (req, res, next) {
        //validar se todos os campos estão preenchidos
        const fillAllFields = checkAllFields(req.body)
        if(fillAllFields){
            return res.render('admin/user/index', fillAllFields)
        }
        //validar se senha bate 
        const { password } = req.body
        const id = req.session.userId

        if (!password) return res.render('admin/user/index', {
            user: req.body,
            error: 'Coloque sua senha para atualizar seu cadastro'
        })

        const user = await User.findOne({ where: {id} })

        const passed = await compare(password, user.password)

        if(!passed) return res.render('admin/user/index', {
            user: req.body,
            error: 'Senha incorreta.'
        })
    next()
}

module.exports = {
    post,
    update
}