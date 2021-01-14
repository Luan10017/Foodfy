const User = require("../../model/User")
const mailer = require('../../../lib/mailer')
const crypto = require('crypto')

module.exports = {
    async list(req, res) {
        const results = await User.getAllUsers()
        const users = results.rows
        
        return res.render("admin/user/users-list", {users})
    },
    registerForm(req, res) {
        return res.render("admin/user/register")
    },
    edit(req, res) {


        return res.render("admin/user/edit")
    },  
    async post(req, res) {
        try{
            const randomPassword = Math.floor(Math.random() * 10000) + ""
            const token = crypto.randomBytes(20).toString("hex")

            const userId = await User.create(req.body, randomPassword, token)
            req.session.userId = userId


            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@lanchstore.com.br',
                subject: 'Confirmação de conta.',
                html: `<h2>Parabéns sua conta foodfy foi criada com sucesso.</h2>
                <p>Sua senha temporaria é ${randomPassword}</p>
                <p>
                    <a href="http://localhost:3000/admin/users/password-reset?token=${token}" target="blank">
                        CRIAR NOVA SENHA
                    </a>
                </p>
                `
            })
            //success não funciona com redirect?
            return res.render('admin/user/users-list', {
                success: "Cadastro realizado com sucesso!"
            })

        }catch(err) {
            console.error(err)
            return res.render("admin/user/register", {
                error: "Erro inesperado, tente novamente"
            })
        }
        
    },
    async delete(req, res) {
        await User.delete(req.body.id)

        return res.redirect('/admin/users')
    }
}