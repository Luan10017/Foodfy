const data = require("../data.json") 

exports.home = function (req, res) {
    return res.render('home', { recipes: data.recipes })
}

exports.about = function (req, res) {
    return res.render('about')
}

exports.recipes = function (req, res) {
    return res.render('recipes', { recipes: data.recipes })
}

exports.details = function (req, res) {
    const index = req.params.index
    const recipe = data.recipes[index]
    if (!recipe) {
        return res.render('not-found')
    }
    return res.render('details_recipes', { recipe })
}