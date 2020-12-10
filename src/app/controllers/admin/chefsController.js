const Chef = require("../../model/chef")
const Recipes = require("../../model/recipes")
const File = require('../../model/File')
const fileManager = require('../fileController')


module.exports = {
    async chefs(req, res) {
        let results = await Chef.chefs()
        const chefs = results.rows

        const chefsIdPromise = chefs.map(chef => chef = chef.id)
        const chefsId = await Promise.all(chefsIdPromise)    

        //Isso aqui tá funcionando, mas manda cada id dentro de um [] array [[],[],[]]
        /* const filesIDPromise = chefsId.map(id => fileManager.getChefFileId(id)) 
        const filesId = await Promise.all(filesIDPromise)
        console.log(filesId) */
       
        const filesId = await fileManager.getFileAllChefsIds(chefsId)
        const files = await fileManager.getChefImage(filesId,req)

        return res.render('admin/chefs/index', {chefs, files})
    },
    async details(req, res) {
        let results = await Chef.find(req.params.index)
        const chef = results.rows[0]
        
        if (!chef) return res.send("Chef not found!")
        
        results = await Recipes.findRecipeByChef(req.params.index)
        const recipes = results.rows
        
        if (!recipes) return res.send("Recipe not found!")


        let filesId = await fileManager.getChefFileId(chef.id)
        const filesChef = await fileManager.getChefImage(filesId,req)

        const recipesIdPromise = recipes.map(recipe => recipe = recipe.id)
        const recipesId = await Promise.all(recipesIdPromise)        
        
        filesId = await fileManager.getFileAllIds(recipesId)
        const files = await fileManager.getImage(filesId,req)

        return res.render('admin/chefs/details', {chef, recipes, files, filesChef})
    },
    create(req, res) {
        return res.render('admin/chefs/chefs_create')
    },
    async post(req, res) {
        /* Validação de dados do formulario */
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key].name == "")
                return res.send('Please, fill all fields.')
        }
        let results = await Chef.create(req.body)
        const chefId = results.rows[0].id

        const filePromise = req.files.map(file => File.create({...file}))
        const fileResults = await Promise.all(filePromise)

        const chefFilesPromises = fileResults.map(file => {
            const fileId = file.rows[0].id
            File.createChefFiles(fileId, chefId)
        })

        await Promise.all(chefFilesPromises)
        
        return res.redirect(`/admin/chefs/${chefId}`)
    },
    async edit(req, res) {
        let results = await Chef.find(req.params.index)
        const chef = results.rows[0]
        
        if (!chef) return res.send("Chef not found!")

        const filesId = await fileManager.getChefFileId(chef.id)
        const files = await fileManager.getChefImage(filesId,req)

        return res.render('admin/chefs/chefs_edit', { chef, files })
    },
    async put(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files")
                return res.send('Please, fill all fields.')
        }


        if (req.files.length !=0) {
            const filesPromise = req.files.map(file => File.create({...file}))
            const fileResults = await Promise.all(filesPromise)
        
            const chefFilesPromises = fileResults.map(file => {
            const fileId = file.rows[0].id

            File.createChefFiles(fileId, req.body.id)
            })

            await Promise.all(chefFilesPromises)
        }

        Chef.update(req.body, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    delete(req, res) {
        Chef.delete(req.body.id, function() {
            return res.redirect(`/admin/chefs`)
        })
    }
}

