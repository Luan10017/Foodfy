const db = require("../../config/db")
const { date } = require('../../lib/utils')
const Base = require('./Base')

Base.init({table: 'chefs'})
module.exports = {
    ...Base,
    chefs() {
        return db.query(`
        SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id
        `)
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
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id],function(err, results) {
            if(err) throw `Database Error! ${err}`
            return callback()
        })
    },
    filesId(id) {
        return db.query(`SELECT * FROM chef_files WHERE chef_id = $1`, [id])
    },
    files(id) {
        return db.query(`SELECT * FROM files WHERE id = $1`, [id])
    }
    
}