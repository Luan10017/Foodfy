const User = require("../../model/User")
const mailer = require('../../../lib/mailer')
const crypto = require('crypto')
const { hash } = require('bcryptjs')

const Recipes = require("../../model/recipes")
const File = require('../../model/File')
const fileManager = require('../fileController')
const { fs } = require("fs")

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
            //Exclusão de receitas / cópia do controler recipes
            const promiseId = recipes.map(recipe => fileManager.getRecipeFileId(recipe.id))
            const filesId =  await Promise.all(promiseId)

            let ids = filesId.reduce(
                ( acumulator, currentValue ) => acumulator.concat(currentValue),
                []
            )

            let files = ids.map(id => File.findFileById(id))
            files = await Promise.all(files)

            files.forEach(({path}) => {
                try {
                    fs.unlinkSync(path)
                } catch (error) {
                    console.error(error)
                }
            })
            //remover as imagens da pasta public
            /* files.map(file => {
                file.rows.map(({path}) => { 
                    try {
                        fs.unlinkSync(path)
                    }catch(err) {
                        console.error(err)
                    }
                })
            }) */
            
            /* Essa parte é inútil - o delete cascade resolveria */
           /*  const removedRecipe_filesPromise = filesId.map(id => {
                id.map( id => File.deleteRecipeFile(id))
            })
            await Promise.all(removedRecipe_filesPromise)
            
            const removedFilesPromise = filesId.map(id =>{
                id.map( id => File.delete(id))
            } )
            await Promise.all(removedFilesPromise) */
            /* ================= */


            // Com constrate também se faz inútil 
            /* recipes.forEach(recipe => {
                Recipes.delete(recipe.id, function(){})
            });  */
    
            // await User.delete(req.body.id)
    
            return res.redirect('/admin/users')
        } catch (error) {
            console.error(error)
        }
    }
}