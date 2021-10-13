const crypto = require('crypto')
const {unlinkSync} = require('fs')
const { hash } = require('bcryptjs')

const mailer = require('../../../lib/mailer')
const User = require("../../model/User")
const File = require('../../model/File')
const fileManager = require('../fileController')

module.exports = {
    async list(req, res) {
        const users = await User.findAll()
        return res.render("admin/user/users-list", {users})
    },
    registerForm(req, res) {
        return res.render("admin/user/register")
    },  
    async post(req, res) {
        try{
            const randomPassword = Math.floor(Math.random() * 10000) + ""
            const password = await hash(randomPassword, 8 )
            const reset_token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            let { name, email, is_admin } = req.body
            is_admin = is_admin || false

            const userId = await User.create({
                name,
                email,
                password,
                reset_token,
                is_admin
            })
            req.session.userId = userId
            req.session.userAdmin = is_admin


            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@lanchstore.com.br',
                subject: 'Confirmação de conta.',
                html: `<h2>Parabéns sua conta foodfy foi criada com sucesso.</h2>
                <p>Sua senha temporaria é ${randomPassword}</p>
                <p>
                    <a href="http://localhost:3000/admin/users/password-reset?token=${reset_token}" target="blank">
                        CRIAR NOVA SENHA
                    </a>
                </p>
                `
            })
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
    async edit(req, res) {
        try{
            const id = req.params.index

            const user = await User.findOne({
                where: {id}
            })
            return res.render("admin/user/edit", { user })

        }catch(err) {
            console.error(err)
            return res.render("admin/user/edit", {
                error: "Erro inesperado, tente novamente"
            })
        }
    },
    async update(req, res) {
        try{
            const { name, email, is_admin, id } = req.body
            
            await User.update(id, {
                name,
                email,
                is_admin: is_admin || false
            })

            return res.render("admin/user/edit", {
                user: req.body,
                success: 'Conta atualizada com sucesso!'
            })
        }catch(err) {
            console.error(err)
            return res.render('admin/user/edit', {
                user: req.body,
                error: 'Algum erro aconteceu!'
            })
        }
    },
    async delete(req, res) {
        try {
            const isOwner = req.session.userAdmin == true && req.session.userId == req.body.id

            if(isOwner) {
                return res.render("admin/session/login", {
                    error: "Você não pode deletar sua própria conta."
                })
            }
            
            const recipes = await User.getRecipesByUser(req.body.id)
            //Pega os ids dos files das receitas do usuário na tabela recipe_files
            const promiseId = recipes.map(recipe => fileManager.getRecipeFileId(recipe.id))
            const filesId =  await Promise.all(promiseId)

            //Transforma array de arrays em um único array  [[],[][],[]] => [...]
            let ids = filesId.reduce(
                ( acumulator, currentValue ) => acumulator.concat(currentValue),
                []
            )
            
            //Pegas os files da tabela files
            let files = ids.map(id => File.findOne({  where: {id} }))
            files = await Promise.all(files)

           
            files.forEach(({path}) => {
                try {
                    unlinkSync(path)
                } catch (error) {
                    console.error(error)
                }
            })
            
    
            await User.delete(req.body.id)
    
            return res.redirect('/admin/users')
        } catch (error) {
            console.error(error)
        }
    }
}