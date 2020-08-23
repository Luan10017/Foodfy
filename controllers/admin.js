const fs = require('fs')
const data = require('../data.json')

/* CONTROLES DE EXIBIÇÃO */

exports.index = function (req, res) {
    return res.render('admin/index', {recipes: data.recipes})
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

    console.log(`New recepi is ${recipe.id}`)

    return res.render('admin/edit', { recipe })
}

/* CREATE - POST */
exports.post = function (req, res) {
    
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
        console.log(data.recipes.indexOf(recipe))
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