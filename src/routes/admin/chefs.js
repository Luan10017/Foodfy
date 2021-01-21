const express =  require('express')
const routes = express.Router()
const chefsAdminController = require('../../app/controllers/admin/chefsController')
const multer = require('../../app/middlewares/multer')

const { isAdmin } = require('../../app/middlewares/session')

routes.get('/', chefsAdminController.chefs)
routes.get("/create", isAdmin, chefsAdminController.create)
routes.get('/:index', chefsAdminController.details) 
routes.post("/", isAdmin, multer.array("photos",1), chefsAdminController.post) 
routes.get('/:index/edit', isAdmin, chefsAdminController.edit)
routes.put("/", isAdmin, multer.array("photos",1), chefsAdminController.put); 
routes.delete("/", isAdmin, chefsAdminController.delete); 

module.exports = routes