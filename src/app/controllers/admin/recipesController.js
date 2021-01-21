const Chef = require("../../model/chef")
const Recipes = require("../../model/recipes")
const File = require('../../model/File')
const fileManager = require('../fileController')


module.exports = {
    async index(req, res) {
        const user_id = req.session.userId
        const results = await Recipes.findRecipesByUser(user_id)
        const recipes = results.rows
        
        const recipesIdPromise = recipes.map(recipe => recipe = recipe.id)
        const recipesId = await Promise.all(recipesIdPromise)        
        
        const filesId = await fileManager.getFileAllIds(recipesId)
        const files = await fileManager.getImage(filesId,req)

        return res.render('admin/recipes/index', { recipes, files })
    },
    async create(req, res) {
        results = await Recipes.chefsSelectOptions()
        const chefOptions = results.rows

        return res.render('admin/recipes/create', {chefOptions})
    },
    async show(req, res) {
        let results = await Recipes.find(req.params.index)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found!")
        
        results = await Chef.find(recipe.chef_id)
        const chef = results.rows[0]

        //get fileId
        results = await Recipes.filesId(recipe.id) //Retorna tudo e vou acessando rows[0], rows[1] ...
        const filesId = results.rows.map(id => id.file_id)

        //get images
        const filesPromise = filesId.map(fileId => Recipes.files(fileId))
        const fileResults = await Promise.all(filesPromise)

        let files = fileResults.map(data => data.rows[0]) // o que acertou o formato foi o [0] no rows[0]

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        }))
    
        return res.render('admin/recipes/show', { recipe, chef, files }) 
    },
    async edit(req, res) {
        let results = await Recipes.find(req.params.index)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found!")
        
        results = await Recipes.chefsSelectOptions()
        const chefOptions = results.rows

        const filesId = await fileManager.getRecipeFileId(recipe.id)
        const files = await fileManager.getImage(filesId,req)

        return res.render('admin/recipes/edit', { recipe, chefOptions, files})
    }, 
    async post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && req.body[key]!= req.body.chef && req.body[key]!= req.body.information)
                return res.send('Please, fill all fields.')
        }

        if (req.files.length == 0)
            return res.send('Please, send at least one image.')

        let results = await Recipes.create(req.body)
        const recipeId = results.rows[0].id

        const filesPromise = req.files.map(file => File.create({...file}))
        const fileResults = await Promise.all(filesPromise)
        
        const recipeFilesPromises = fileResults.map(file => {
            const fileId = file.rows[0].id

            File.createRecipeFiles(fileId, recipeId)
        })

        await Promise.all(recipeFilesPromises)

        return res.redirect(`/admin/recipes/${recipeId}`)
    },
    async put(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files" && req.body[key]!= req.body.chef && req.body[key]!= req.body.information)
                return res.send('Please, fill all fields.')
        }


        if (req.files.length !=0) {
            const filesPromise = req.files.map(file => File.create({...file}))
            const fileResults = await Promise.all(filesPromise)
        
            const recipeFilesPromises = fileResults.map(file => {
            const fileId = file.rows[0].id

            File.createRecipeFiles(fileId, req.body.id)
            })

            await Promise.all(recipeFilesPromises)
        }

        if (req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(",") 
            const lastIndex = removedFiles.length -1
            removedFiles.splice(lastIndex, 1)

            const removedFilesRecipePromise = removedFiles.map(id => File.deleteRecipeFile(id))
            await Promise.all(removedFilesRecipePromise)

            
            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }

        Recipes.update(req.body, function() {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    async delete(req, res) {
        const filesId = await fileManager.getRecipeFileId(req.body.id)

        const removedRecipe_filesPromise = filesId.map(id => File.deleteRecipeFile(id))
        await Promise.all(removedRecipe_filesPromise)
        
        const removedFilesPromise = filesId.map(id => File.delete(id))
        await Promise.all(removedFilesPromise)

        Recipes.delete(req.body.id, function() {
            return res.redirect(`/admin/recipes`)
        })
    }
}

