const express =  require('express')
const routes = express.Router()
const SessionController = require('../../app/controllers/admin/SessionController')


// login/logout
routes.get('/login', SessionController.loginForm)
//routes.post('/login', SessionController.login)
//routes.post('/logout', SessionController.logout)

// Rotas de perfil de um usuário logado
//routes.get('/admin/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
//routes.put('/admin/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
//routes.get('/admin/users', UserController.list) //Mostrar a lista de usuários cadastrados
//routes.post('/admin/users', UserController.post) //Cadastrar um usuário
//routes.put('/admin/users', UserController.put) // Editar um usuário
//routes.delete('/admin/users', UserController.delete) // Deletar um usuário

module.exports = routes