const Chef = require("../model/chef")
const Recipes = require("../model/recipes")
const File = require('../model/File')
const { filesId } = require("../model/recipes")


module.exports = {
    index(req, res) {
        Recipes.all(function(recipes) {
            return res.render('admin/index', {recipes})
        })
    },
    async create(req, res) {
        results = await Recipes.chefsSelectOptions()
        const chefOptions = results.rows

        return res.render('admin/create', {chefOptions})
    },
    async show(req, res) {
        let results = await Recipes.find(req.params.index)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found!")
        
        results = await Chef.find(recipe.chef_id)
        const chef = results.rows[0]


        //get fileId
        let resultsFiles = await Recipes.filesId(recipe.id) //Retorna tudo e vou acessando rows[0], rows[1] ...
        const filesId = []
        for (i=0 ; i<resultsFiles.rows.length; i++) {
            filesId[i] = resultsFiles.rows[i].file_id
        }

        //get images
        const filesPromise = filesId.map(fileId => Recipes.files(fileId))
        const fileResults = await Promise.all(filesPromise)
        
        let files = []
        for (i=0 ; i<fileResults.length; i++) {
            files[i] = fileResults[i].rows[0]
        }

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        }))
    
        return res.render('admin/show', { recipe, chef, files }) 
    },
    async edit(req, res) {
        let results = await Recipes.find(req.params.index)
        const recipe = results.rows[0]

        if(!recipe) return res.send("Recipe not found!")
        
        results = await Recipes.chefsSelectOptions()
        const chefOptions = results.rows


        //get fileId
        let resultsFiles = await Recipes.filesId(recipe.id) //Retorna tudo e vou acessando rows[0], rows[1] ...
        const filesId = []
        for (i=0 ; i<resultsFiles.rows.length; i++) {
            filesId[i] = resultsFiles.rows[i].file_id
        }

        //get images
        const filesPromise = filesId.map(fileId => Recipes.files(fileId))
        const fileResults = await Promise.all(filesPromise)
        
        let files = []
        for (i=0 ; i<fileResults.length; i++) {
            files[i] = fileResults[i].rows[0]
        }

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        }))

        return res.render('admin/edit', { recipe, chefOptions, files})
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
    put(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && req.body[key]!= req.body.chef && req.body[key]!= req.body.information)
                return res.send('Please, fill all fields.')
        }

        Recipes.update(req.body, function() {
            return res.redirect(`/admin/recipes/${req.body.id}`)
        })
    },
    delete(req, res) {
        Recipes.delete(req.body.id, function() {
            return res.redirect(`/admin/recipes`)
        })
    },
    chefs(req, res) {
        Chef.chefs(function(chefs){
            return res.render('admin/chefs/index', {chefs})
        })
    },
    async details(req, res) {
        const id = req.params.index
        let results = await Chef.find(req.params.index)
        const chef = results.rows[0]
        
        if (!chef) return res.send("Chef not found!")
        
        results = await Recipes.findRecipeByChef(req.params.index)
        const recipes = results.rows
        
        if (!recipes) return res.send("Recipe not found!")


        return res.render('admin/chefs/details', {chef, recipes})
    },
    createChef(req, res) {
        return res.render('admin/chefs/chefs_create')
    },
    postChefs(req, res) {
        /* Validação de dados do formulario */
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "")
                return res.send('Please, fill all fields.')
        }

        Chef.create(req.body, function(chef) {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    editChefs(req, res) {
        Chef.find(req.params.index, function (chef) {
            if(!chef) return res.send("Chef not found!")
                return res.render('admin/chefs/chefs_edit', { chef })
        })
    },
    putChefs(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "")
                return res.send('Please, fill all fields.')
        }
        console.log(`Edit ${req.body}`)

        Chef.update(req.body, function() {
            return res.redirect(`/admin/chefs/${req.body.id}`)
        })
    },
    deleteChefs(req, res) {
        Chef.delete(req.body.id, function() {
            return res.redirect(`/admin/chefs`)
        })
    }
}

