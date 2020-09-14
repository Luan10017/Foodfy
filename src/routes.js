const express =  require('express')
const routes = express.Router()
const admin = require('./app/controllers/admin')
const recipes = require('./app/controllers/recipes')


/* ==== PRINCIPAL ==== */

routes.get('/', recipes.home)
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.recipes)
routes.get('/details_recipes/:index', recipes.details)
routes.get('/chefs', recipes.chefs)


/*==== ADMIN =====*/

/* RECIPES */
routes.get('/admin/recipes', admin.index)
routes.get("/admin/recipes/create", admin.create)
routes.get("/admin/recipes/:index", admin.show)
routes.get("/admin/recipes/:index/edit", admin.edit)
routes.post("/admin/recipes", admin.post) // Cadastrar nova receita
routes.put("/admin/recipes", admin.put); // Editar uma receita
routes.delete("/admin/recipes", admin.delete); // Deletar uma receita 

/* CHEFS */
routes.get('/admin/chefs', admin.chefs)
routes.get("/admin/chefs/create", admin.createChef)
routes.get('/admin/chefs/:index', admin.details)
routes.post("/admin/chefs", admin.postChefs) 
routes.get('/admin/chefs/:index/edit', admin.editChefs)
routes.put("/admin/chefs", admin.putChefs); 
routes.delete("/admin/chefs", admin.deleteChefs); 


/* PÁGINA DE ERRO */
routes.use(function (req, res) {
    res.status(404).render('not-found')
})


module.exports = routes