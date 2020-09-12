const fs = require('fs')
const data = require('../model/data.json')
const Chef = require("../model/chef")
const Recipes = require("../model/recipes")

/* CONTROLES DE EXIBIÇÃO */

exports.index = function (req, res) {
    Recipes.all(function(recipes) {
        return res.render('admin/index', {recipes})
    })
}


exports.create = function (req, res) {
    return res.render('admin/create')
}

exports.show = function (req, res) {
    const index = req.params.index
    const recipe = data.recipes[index]
    if (!recipe) {
        return res.render('not-found')
    }
    return res.render('admin/show', { recipe })   
}

exports.edit = function (req, res) {
    const index = req.params.index
    const Oldrecipe = data.recipes[index]
    if (!Oldrecipe) {
        return res.render('not-found')
    }

    const recipe = {
        ...Oldrecipe,
        ...req.body,
        id: req.params.index
    }

    return res.render('admin/edit', { recipe })
}

/* CREATE - POST */
exports.post = function (req, res) {
    
    /* Validação de dados do formulario */
    const keys = Object.keys(req.body)
    for (key of keys) {
        if (req.body[key] == "" && req.body[key]!= req.body.author && req.body[key]!= req.body.information)
            return res.send('Please, fill all fields.')
    }
    if (req.body.author == "")
        req.body.author = "Anônimo"

    /* Gravação dos dados */
    data.recipes.push(req.body)
    
    fs.writeFile("data.json", JSON.stringify(data,null,2), function(err){
        if (err) return res.send("Write file error!")

        return res.redirect("/admin/recipes")
    })
}

/* UPDATE - PUT */
exports.put = function (req, res) {
    const { id } = req.body

    const foundRecipes = data.recipes.find(function(recipe) {
        if (id == data.recipes.indexOf(recipe)){
            return true
        } 
    })

    if (!foundRecipes) return res.send('Recipe not found')

    const recipe = {
        ...foundRecipes,
        ...req.body,
    }

    delete recipe.id

    data.recipes[id] = recipe

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('write error!')

        return res.redirect(`/admin/recipes/${id}`)
    })
}

/* DELETE  */

exports.delete = function (req, res) {
    const { id } = req.body

    const filteredRecipes = data.recipes.filter(function(recipe) {
        return data.recipes.indexOf(recipe) != id
    })

    data.recipes = filteredRecipes

    fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send('write error!')

        return res.redirect(`/admin/recipes`)
    })
}

/* CHEFS */

exports.chefs = function (req, res) {
    Chef.chefs(function(chefs){
        return res.render('admin/chefs/index', {chefs})
    })
}

exports.details = function (req, res) {
    const id = req.params.index
    Chef.find(id, function(chef){
        if (!chef) return res.send("Chef not found!")
        Recipes.all(function(recipes) {
            return res.render('admin/chefs/details', {chef, recipes})
        })
    })
}

exports.createChef = function (req, res) {
    return res.render('admin/chefs/chefs_create')
}

exports.post = function (req, res) {
    
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