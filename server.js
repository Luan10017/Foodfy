const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')

const server = express()



/* Configuração de acesso a pastas plúblicas */
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(express.static('public/assets'))
server.use(methodOverride('_method'))
server.use(routes)

server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
})



/* HABILITA PORTA PARA SERVIDOR  */
server.listen(5000, function () {
    console.log('Server is running')
})