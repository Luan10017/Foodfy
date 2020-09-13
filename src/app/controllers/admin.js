const fs = require('fs')
const data = require('../model/data.json')
const Chef = require("../model/chef")
const Recipes = require("../model/recipes")

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
        
            /* recipe.ingredients = recipe.ingredients.split(",")
            recipe.preparation = recipe.preparation.split(".") */
            return res.render('admin/show', { recipe }) 
        })  
    },
    edit(req, res) {
        Recipes.find(req.params.index, function (recipe) {
            if(!recipe) return res.send("Recipe not found!")

            recipe.ingredients = recipe.ingredients.split(",")
            recipe.preparation = recipe.preparation.split(".")

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
        const { id } = req.body

        const filteredRecipes = data.recipes.filter(function(recipe) {
            return data.recipes.indexOf(recipe) != id
        })
    
        data.recipes = filteredRecipes
    
        fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
            if (err) return res.send('write error!')
    
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
    }
}

