const Chef = require("../model/chef")
const Recipes = require("../model/recipes")
const chef = require("../model/chef")

module.exports = {
    index(req, res) {
        Recipes.all(function(recipes) {
            return res.render('admin/index', {recipes})
        })
    },
    create(req, res) {
        Recipes.chefsSelectOptions(function(options) {
            return res.render('admin/create', {chefOptions: options})
        })
    },
    show(req, res) {
        Recipes.find(req.params.index, function(recipe) {
            if (!recipe) return res.send('Recipe not found')
            
            Chef.find(recipe.chef_id, function(chef) {
                return res.render('admin/show', { recipe, chef }) 
            })
        })  
    },
    edit(req, res) {
        Recipes.find(req.params.index, function (recipe) {
            if(!recipe) return res.send("Recipe not found!")

            Recipes.chefsSelectOptions(function(options) {
                return res.render('admin/edit', { recipe, chefOptions: options })
            })
        })
    },
    post(req, res) {
        const keys = Object.keys(req.body)
        for (key of keys) {
            if (req.body[key] == "" && req.body[key]!= req.body.chef && req.body[key]!= req.body.information)
                return res.send('Please, fill all fields.')
        }

        Recipes.create(req.body, function(recipe) {
            return res.redirect(`/admin/recipes/${recipe.id}`)
        })
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
    details(req, res) {
        const id = req.params.index
        Chef.find(id, function(chef){
            if (!chef) return res.send("Chef not found!")
            Recipes.all(function(recipes) {
                return res.render('admin/chefs/details', {chef, recipes})
            })
        })
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

