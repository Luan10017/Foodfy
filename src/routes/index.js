const express =  require('express')
const routes = express.Router()
const recipes = require('../app/controllers/recipes')

const recipesAdmin = require('./admin/recipes')
const chefsAdmin = require('./admin/chefs')
const userAdmin = require('./admin/users')

/* ==== PRINCIPAL ==== */

routes.get('/', recipes.home)
routes.get('/about', recipes.about)
routes.get('/recipes', recipes.recipes)
routes.get('/details_recipes/:index', recipes.details)
routes.get('/chefs', recipes.chefs)

const { onlyUsers } = require('../app/middlewares/session')


/*==== ADMIN =====*/

/* ADMIN */
routes.use('/admin',userAdmin)

/* RECIPES */
routes.use('/admin/recipes', onlyUsers, recipesAdmin)

/* CHEFS */
routes.use('/admin/chefs', onlyUsers, chefsAdmin)

/* PÁGINA DE ERRO */
routes.use(function (req, res) {
    res.status(404).render('not-found')
})


module.exports = routes