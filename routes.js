const express =  require('express')
const routes = express.Router()
const admin = require('./controllers/admin')
const recipes = require('./controllers/recipes')


/* ==== PRINCIPAL ==== */

routes.get('/', recipes.home)
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.recipes)
routes.get('/details_recipes/:index', recipes.details)

/*==== ADMIN =====*/

routes.get('/admin/recipes', admin.index)
routes.get("/admin/recipes/create", admin.create)
routes.get("/admin/recipes/:index", admin.show)
routes.get("/admin/recipes/:index/edit", admin.edit)
routes.post("/admin/recipes", admin.post) // Cadastrar nova receita
routes.put("/admin/recipes", admin.put); // Editar uma receita
routes.delete("/admin/recipes", admin.delete); // Deletar uma receita 


/* PÁGINA DE ERRO */
routes.use(function (req, res) {
    res.status(404).render('not-found')
})


module.exports = routes