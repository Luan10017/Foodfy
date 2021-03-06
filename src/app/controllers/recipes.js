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
            results = await Recipes.all()
            recipes = results.rows
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

        const chefsIdPromise = chefs.map(chef => chef = chef.id)
        const chefsId = await Promise.all(chefsIdPromise)    

        const filesId = await fileManager.getFileAllChefsIds(chefsId)
        const files = await fileManager.getChefImage(filesId,req)

        return res.render('site/chefs', {chefs, files})
    },
    
    async details (req, res) {
        let results = await Recipes.find(req.params.index)
        const recipe = results.rows[0]
      
        if (!recipe) {
            return res.render('not-found')
        }

        const filesId = await fileManager.getRecipeFileId(recipe.id)
        const files = await fileManager.getImage(filesId,req)

        return res.render('site/details_recipes', { recipe, files })
    }
}
