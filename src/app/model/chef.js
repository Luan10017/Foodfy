const db = require("../../config/db")

module.exports = {
    chefs(callback) {
        db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        `, function(err, results){
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    find(id, callback) {
        db.query (`
            SELECT * 
            FROM chefs 
            WHERE id = $1`, [id], function(err, results){
                if(err) throw `Database Error! ${err}`
                callback(results.rows[0])
        })
    }
    
}