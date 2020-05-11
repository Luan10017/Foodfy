const express = require('express')
const nunjucks = require('nunjucks')

const server = express()
const content = require("./data")


/* Configuração de acesso a pastas plúblicas */
server.use(express.static('public'))
server.use(express.static('public/assets'))

server.set('view engine', 'njk')

nunjucks.configure('views', {
    express: server,
    autoescape: false,
    noCache: true
})


/* ROTAS */

server.get('/', function (req, res) {
    return res.render('home', { recipes: content })
})

server.get('/about', function (req, res) {
    return res.render('about')
})

server.get('/recipes', function (req, res) {
    return res.render('recipes', { recipes: content })
})

server.get('/details_recipes/:index', function (req, res) {
    const index = req.params.index
    const recipe = content[index]
    
    
    
    /* const recipe = content.find(function (recipe) {
        return id == recipe.id
    }) */
    if (!recipe) {
        return res.render('not-found')
    }

    return res.render('details_recipes', { recipes: recipe })
})


/* PÁGINA DE ERRO */
server.use(function (req, res) {
    res.status(404).render('not-found')
})

/* HABILITA PORTA PARA SERVIDOR  */
server.listen(5000, function () {
    console.log('Server is running')
})