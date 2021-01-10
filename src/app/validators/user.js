const User = require("../model/User")

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

    next()
}

module.exports = {
    post
}