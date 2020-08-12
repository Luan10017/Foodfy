const fs = require('fs')
const data = require('../data.json')


/* CREATE - POST */
exports.post = function (req, res) {
    fs.writeFile("data.json", JSON.stringify(req.body,null,2), function(err){
        if (err) return res.send("Write file error!")

        return res.redirect("/admin/recipes")
    })
}

/* UPDATE - PUT */


/* DELETE  */