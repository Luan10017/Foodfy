const Chef = require("../model/chef")
const Recipes = require("../model/recipes")

exports.home = function (req, res) {
    const { filter } = req.query   

    if (filter) {
        Recipes.findBy(filter, function(recipes) {
            return res.render('public/home', { recipes })
        })
    } else {
        Recipes.all(function(recipes) {
            return res.render('public/home', { recipes })
        })
    }

}

exports.about = function (req, res) {
    return res.render('public/about')
}

exports.recipes = function (req, res) {
    Recipes.all(function(recipes) {
        return res.render('public/recipes', { recipes })
    })
}

exports.chefs = function (req, res) {
    Chef.chefs(function(chefs){
        return res.render('public/chefs', {chefs})
    })
}

exports.details = function (req, res) {
    const index = req.params.index
    const recipe = data.recipes[index]
    if (!recipe) {
        return res.render('not-found')
    }
    return res.render('public/details_recipes', { recipe })
}