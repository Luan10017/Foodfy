const express =  require('express')
const routes = express.Router()
const SessionController = require('../../app/controllers/admin/SessionController')
const ProfileController = require('../../app/controllers/admin/ProfileController')
const UserController = require('../../app/controllers/admin/UserController')


const UserValidator = require('../../app/validators/user')
const SessionValidator = require('../../app/validators/session')

const { isAdmin } = require('../../app/middlewares/session')


// login/logout
routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

// reset password / forgot
routes.get('/users/forgot-password', SessionController.forgotForm)
routes.get('/users/password-reset', SessionController.resetForm)
routes.post('/users/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/users/password-reset', SessionValidator.reset, SessionController.reset)

// Rotas de perfil de um usuário logado
routes.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
//routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', UserController.list) //Mostrar a lista de usuários cadastrados
routes.get('/users/register', UserController.registerForm) //Mostrar a lista de usuários cadastrados
routes.post('/users/register', UserValidator.post, UserController.post) //Cadastrar um usuário
routes.get('/users/edit', UserController.edit) //Mostrar a lista de usuários cadastradoslist

//routes.put('/admin/users', UserController.put) // Editar um usuário
routes.delete('/users', isAdmin, UserController.delete) // Deletar um usuário

module.exports = routes