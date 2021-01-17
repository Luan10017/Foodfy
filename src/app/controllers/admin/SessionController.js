const User = require('../../model/User')
const mailer = require('../../../lib/mailer')
const crypto = require('crypto')
const { hash } = require('bcryptjs')



module.exports = {
    loginForm(req, res) {
        return res.render("admin/session/login")
    },
    login(req, res){
        req.session.userId = req.user.id
        req.session.userAdmin = req.user.is_admin

        return res.redirect("/admin/profile")
    },
    logout(req, res) {
        req.session.destroy()
        return res.redirect("/admin/login")
    },
    forgotForm(req, res) {
        return res.render("admin/session/forgot-password")
    },
    async forgot(req, res) {
        const user = req.user

        try {
            const token = crypto.randomBytes(20).toString("hex")

            let timeToExpiration = new Date()
            timeToExpiration = timeToExpiration.setHours(timeToExpiration.getHours() + 1)
    
            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: timeToExpiration
            })
    
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@lanchstore.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:3000/admin/users/password-reset?token=${token}" target="blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `
            })
    
            return res.render("admin/session/forgot-password", {
                success: "Verifique seu email para resetar sua senha!"
            })

        }catch(err) {
            console.error(err)
            return res.render("admin/session/forgot-password", {
                error: "Erro inesperado, tente novamente"
            })
        }
    },
    resetForm(req, res) {
        return res.render("admin/session/password-reset", { token: req.query.token })
    },
    async reset(req,res){
        const user = req.user

        const { password, token } = req.body

        try{
            // cria um novo hash de senha
            const newPassword = await hash(password, 8)
            // atualiza o usuário 
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })
            // avisa o usuário que ele tem uma nova senha 
            return res.render("admin/session/login", {
                user: req.body,
                success: "Senha atualizada! Faça o seu login"
            })


        }catch(err) {
            console.error(err)
            return res.render("admin/session/password-reset", {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente"
            })
        }
    }
}

