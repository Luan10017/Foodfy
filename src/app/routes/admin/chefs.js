const express =  require('express')
const routes = express.Router()
const chefsAdminController = require('../../controllers/admin/chefsController')
const multer = require('../../middlewares/multer')

routes.get('/', chefsAdminController.chefs)
routes.get("/create", chefsAdminController.create)
routes.get('/:index', chefsAdminController.details) 
routes.post("/", multer.array("photos",1), chefsAdminController.post) 
routes.get('/:index/edit', chefsAdminController.edit)
routes.put("/", multer.array("photos",1), chefsAdminController.put); 
routes.delete("/", chefsAdminController.delete); 

module.exports = routes