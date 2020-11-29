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
    find(id) {
        const query = `
            SELECT chefs.*, count(recipes) AS total_recipes 
            FROM chefs 
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            WHERE chefs.id = $1
            GROUP BY chefs.id
            ` 
            const values = [id]

            try {
                return db.query(query, values)
            } catch (err) {
                throw new Error(err)
            }
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
    create(data) {
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
        
        try {
            return db.query(query, values)
        } catch (err) {
            throw new Error(err)
        }
    },
    update(data, callback) {
        const query = `
        UPDATE chefs SET
            name=($1),
            avatar_url=($2)
        WHERE id = $3
        `
        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    }, 
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id],function(err, results) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    }
    
}