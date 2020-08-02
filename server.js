const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')

const server = express()



/* Configuração de acesso a pastas plúblicas */
server.use(express.static('public'))
server.use(express.static('public/assets'))
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