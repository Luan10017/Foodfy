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