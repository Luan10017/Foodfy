const express =  require('express')
const routes = express.Router()
const recipesAdmin = require('./app/controllers/admin/recipesController')
const chefsAdmin = require('./app/controllers/admin/chefsController')
const recipes = require('./app/controllers/recipes')
const multer = require('./app/middlewares/multer')


/* ==== PRINCIPAL ==== */

routes.get('/', recipes.home)
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.recipes)
routes.get('/details_recipes/:index', recipes.details)
routes.get('/chefs', recipes.chefs)


/*==== ADMIN =====*/

/* RECIPES */
routes.get('/admin/recipes', recipesAdmin.index)
routes.get("/admin/recipes/create", recipesAdmin.create)
routes.get("/admin/recipes/:index", recipesAdmin.show)
routes.get("/admin/recipes/:index/edit", recipesAdmin.edit)
routes.post("/admin/recipes",  multer.array("photos",5), recipesAdmin.post) // Cadastrar nova receita
routes.put("/admin/recipes",  multer.array("photos",5), recipesAdmin.put); // Editar uma receita
routes.delete("/admin/recipes", recipesAdmin.delete); // Deletar uma receita 

/* CHEFS */
routes.get('/admin/chefs', chefsAdmin.chefs)
routes.get("/admin/chefs/create", chefsAdmin.create)
routes.get('/admin/chefs/:index', chefsAdmin.details) 
routes.post("/admin/chefs", multer.array("photos",1), chefsAdmin.post) 
routes.get('/admin/chefs/:index/edit', chefsAdmin.edit)
routes.put("/admin/chefs", multer.array("photos",1), chefsAdmin.put); 
routes.delete("/admin/chefs", chefsAdmin.delete); 


/* PÁGINA DE ERRO */
routes.use(function (req, res) {
    res.status(404).render('not-found')
})


module.exports = routes