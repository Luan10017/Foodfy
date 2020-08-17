const express =  require('express')
const routes = express.Router()
const content = require("./data")
const adminContent = require("./data.json")
const recipes = require('./controllers/recipes')


routes.get('/', function (req, res) {
    return res.render('home', { recipes: content })
})




routes.get('/about', function (req, res) {
    return res.render('about')
})
routes.get('/recipes', function (req, res) {
    return res.render('recipes', { recipes: content })
})
routes.get('/details_recipes/:index', function (req, res) {
    const index = req.params.index
    const recipe = content[index]
    if (!recipe) {
        return res.render('not-found')
    }
    return res.render('details_recipes', { recipe })
})


routes.get('/admin/recipes', function (req, res) {
    return res.render('admin/index', {recipes: content})
})

routes.get("/admin/recipes/create", function (req, res) {
    return res.render('admin/create')
})

routes.get("/admin/recipes/:index", function (req, res) {
    const index = req.params.index
    const recipe = content[index]
    if (!recipe) {
        return res.render('not-found')
    }
    return res.render('admin/show', { recipe })
    
})

routes.get("/admin/recipes/:index/edit", function (req, res) {
    const index = req.params.index
    const recipe = content[index]
    console.log(index)
    console.log(recipe)
    if (!recipe) {
        return res.render('not-found')
    }
    return res.render('admin/edit', { recipe })
})

/*recipes.edit); // Mostrar formulário de edição de receita*/

/*routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita*/


routes.post("/admin/recipes", recipes.post)


/*
routes.put("/admin/recipes", recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita */


/* PÁGINA DE ERRO */
routes.use(function (req, res) {
    res.status(404).render('not-found')
})




module.exports = routes