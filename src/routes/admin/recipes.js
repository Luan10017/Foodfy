const express =  require('express')
const routes = express.Router()
const recipesAdminController = require('../../app/controllers/admin/recipesController')
const multer = require('../../app/middlewares/multer')

const { onlyUsers } = require('../../app/middlewares/session')


routes.get('/', recipesAdminController.index)
routes.get("/create", onlyUsers, recipesAdminController.create)
routes.get("/:index", recipesAdminController.show)
routes.get("/:index/edit", onlyUsers, recipesAdminController.edit)

routes.post("/", onlyUsers, multer.array("photos",5), recipesAdminController.post) // Cadastrar nova receita
routes.put("/", onlyUsers, multer.array("photos",5), recipesAdminController.put); // Editar uma receita
routes.delete("/", onlyUsers, recipesAdminController.delete); // Deletar uma receita 

module.exports = routes