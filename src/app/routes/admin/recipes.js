const express =  require('express')
const routes = express.Router()
const recipesAdminController = require('../../controllers/admin/recipesController')
const multer = require('../../middlewares/multer')

routes.get('/', recipesAdminController.index)
routes.get("/create", recipesAdminController.create)
routes.get("/:index", recipesAdminController.show)
routes.get("/:index/edit", recipesAdminController.edit)
routes.post("/",  multer.array("photos",5), recipesAdminController.post) // Cadastrar nova receita
routes.put("/",  multer.array("photos",5), recipesAdminController.put); // Editar uma receita
routes.delete("/", recipesAdminController.delete); // Deletar uma receita 

module.exports = routes