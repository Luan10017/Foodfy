const Chef = require("../model/chef")
const Recipes = require("../model/recipes")
const fileManager = require('./fileController')


module.exports = {
    async home (req, res) {
        const { filter } = req.query   
        let recipes,
            results
        if (filter) {
            results = await Recipes.findBy(filter)
            recipes = results.rows
        } else {
            recipes = await Recipes.all()
            recipes = await Promise.all(recipes.rows)  
        }
        const recipesIdPromise = recipes.map(recipe => recipe = recipe.id)
        const recipesId = await Promise.all(recipesIdPromise)        
        
        const filesId = await fileManager.getFileAllIds(recipesId)
        const files = await fileManager.getImage(filesId,req)
        
        return res.render('site/home', { recipes, files })
    },
    
    about (req, res) {
        return res.render('site/about')
    },
    
    async recipes (req, res) {
        const { filter } = req.query   
        let recipes,
            results

        if (filter) {
            results = await Recipes.findBy(filter)
            recipes = results.rows
        } else {
            results = await Recipes.all()
            recipes = results.rows
        }
        const recipesIdPromise = recipes.map(recipe => recipe = recipe.id)
        const recipesId = await Promise.all(recipesIdPromise)        
        
        const filesId = await fileManager.getFileAllIds(recipesId)
        const files = await fileManager.getImage(filesId,req)

        return res.render('site/recipes', { recipes, files, filter })
    },
    
    async chefs (req, res) {
        let results = await Chef.chefs()
        const chefs = results.rows

        const chefsId = chefs.map(chef => chef.file_id)

        const files = await fileManager.getChefsImage(chefsId,req)

        return res.render('site/chefs', {chefs, files})
    },
    
    async details (req, res) {
        const recipe = await Recipes.find(req.params.index)
      
        if (!recipe) {
            return res.render('not-found')
        }

        const filesId = await fileManager.getRecipeFileId(recipe.id)
        const files = await fileManager.getImage(filesId,req)

        return res.render('site/details_recipes', { recipe, files })
    }
}
