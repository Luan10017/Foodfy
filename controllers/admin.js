const fs = require('fs')
const data = require('../adminData.json')

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
    const recipe = data.recipes[index]
    if (!recipe) {
        return res.render('not-found')
    }
    return res.render('admin/edit', { recipe })
}

/* CREATE - POST */
exports.post = function (req, res) {
    
    data.recipes.push(req.body)
    
    fs.writeFile("adminData.json", JSON.stringify(data,null,2), function(err){
        if (err) return res.send("Write file error!")

        return res.redirect("/admin/recipes")
    })
}

/* UPDATE - PUT */
exports.put = function (req, res) {

}

/* DELETE  */