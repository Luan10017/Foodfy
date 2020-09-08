const data = require("../model/data.json") 
const Chef = require("../model/chef")

exports.home = function (req, res) {
    return res.render('public/home', { recipes: data.recipes })
}

exports.about = function (req, res) {
    return res.render('public/about')
}

exports.recipes = function (req, res) {
    return res.render('public/recipes', { recipes: data.recipes })
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