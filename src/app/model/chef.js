const db = require("../../config/db")
const { date } = require('../../lib/utils')


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
    },
    chefsDetails(id, callback) {
        db.query (`
            SELECT * 
            FROM chefs 
            WHERE id = $1`, [id], function(err, results){
                if(err) throw `Database Error! ${err}`
                callback(results.rows[0])
        })
    }, 
    create(data, callback) {
        const query = `
        INSERT INTO chefs (
            name,
            avatar_url,
            created_at
        ) VALUES ($1, $2, $3)
        RETURNING id
        `
        const values = [
            data.name,
            data.avatar_url,
            date(Date.now()).iso
        ]
        
        db.query(query, values, function(err, results) {
            if(err) throw `Databese Error! ${err}`

            callback(results.rows[0])
        })
    }
    
}