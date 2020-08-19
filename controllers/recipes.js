const content = require("../data") //Provavelmente vou adequar o nome da variável para data

exports.home = function (req, res) {
    return res.render('home', { recipes: content })
}

exports.about = function (req, res) {
    return res.render('about')
}

exports.recipes = function (req, res) {
    return res.render('recipes', { recipes: content })
}

exports.details = function (req, res) {
    const index = req.params.index
    const recipe = content[index]
    if (!recipe) {
        return res.render('not-found')
    }
    return res.render('details_recipes', { recipe })
}