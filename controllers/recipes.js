const fs = require('fs')
const data = require('../adminData.json')


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

}

/* DELETE  */