const express = require('express')
const nunjucks = require('nunjucks')
const routes = require('./routes')
const methodOverride = require('method-override')
const session = require('./config/session')

const server = express()

server.use(session)
server.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

/* Configuração de acesso a pastas plúblicas */
server.use(express.urlencoded({ extended: true }))
server.use(express.static('public'))
server.use(express.static('public/assets'))
server.use(methodOverride('_method'))
server.use(routes)

server.set('view engine', 'njk')

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})



/* HABILITA PORTA PARA SERVIDOR  */
server.listen(5000, function () {
    console.log('Server is running')
})