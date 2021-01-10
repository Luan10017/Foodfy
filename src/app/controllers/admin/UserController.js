const User = require("../../model/User")
const mailer = require('../../../lib/mailer')

module.exports = {
    list(req, res) {
        return res.render("admin/user/users-list")
    },
    registerForm(req, res) {
        return res.render("admin/user/register")
    },
    edit(req, res) {


        return res.render("admin/user/edit")
    },
    
    async post(req, res) {
        const randomPassword = Math.floor(Math.random() * 10000) + ""
        
        const userId = await User.create(req.body, randomPassword)
       // req.session.userId = userId


       await mailer.sendMail({
            to: req.body.email,
            from: 'no-reply@lanchstore.com.br',
            subject: 'Confirmação de conta.',
            html: `<h2>Parabéns sua conta foodfy foi criada com sucesso.</h2>
            <p>Sua senha temporaria é ${randomPassword}</p>
            <p>
                <a href="http://localhost:3000/users/" target="blank">
                    CRIAR NOVA SENHA
                </a>
            </p>
            `
        })

       return res.redirect('/admin/users/')
    }
}