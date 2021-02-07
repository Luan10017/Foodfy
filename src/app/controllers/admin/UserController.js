const User = require("../../model/User")
const mailer = require('../../../lib/mailer')
const crypto = require('crypto')

const Recipes = require("../../model/recipes")
const File = require('../../model/File')
const fileManager = require('../fileController')

module.exports = {
    async list(req, res) {
        const results = await User.getAllUsers()
        const users = results.rows
        return res.render("admin/user/users-list", {users})
    },
    registerForm(req, res) {
        return res.render("admin/user/register")
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
            if(req.session.userAdmin == true && req.session.userId == req.body.id) {
                return res.render("admin/session/login", {
                    error: "Você não pode deletar sua própria conta."
                })
            }
            
            const recipes = await User.getRecipesByUser(req.body.id)
            //Exclusão de receitas / cópia do controler recipes
            const promiseId = recipes.map(recipe => fileManager.getRecipeFileId(recipe.id))
            const filesId =  await Promise.all(promiseId)
            
            
            const removedRecipe_filesPromise = filesId.map(id => {
                id.map( id => File.deleteRecipeFile(id))
            })
            await Promise.all(removedRecipe_filesPromise)

            
            const removedFilesPromise = filesId.map(id => File.delete(id))
            await Promise.all(removedFilesPromise)
    
            recipes.forEach(recipe => {
                Recipes.delete(recipe.id)
            }); 
    
            await User.delete(req.body.id)
    
            return res.redirect('/admin/users')
        } catch (error) {
            console.error(error)
        }
    }
}