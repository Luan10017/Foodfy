const db = require("../../config/db")
const { date } = require('../../lib/utils')


module.exports = {
    all() {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        `)
    },
    chefsSelectOptions() {
        return db.query (`
            SELECT name, id FROM chefs
        `)
    },
    create(data) {
        const query = `
        INSERT INTO recipes (
            title,
            chef_id,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `
        const values = [
            data.title,
            data.chef,
            data.ingredients,
            data.preparation,
            data.information,
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
        UPDATE recipes SET
            title=($1),
            chef_id=($2),
            ingredients=($3),
            preparation=($4),
            information=($5)
        WHERE id = $6
        `
        const values = [
            data.title,
            data.chef,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback()
        })
    },
    find(id) {
        return db.query (`SELECT * FROM recipes WHERE id = $1`, [id])
    },
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    },
    findBy(filter, callback) {
        db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.title ILIKE '%${filter}%'
        `, function(err, results) {
            if(err) throw `Database Error! ${err}`

            callback(results.rows)
        })
    },
    findRecipeByChef(id) {
        const query =`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1`
        
        const values = [id]
        
        try {
            return db.query(query, values)
        } catch (err) {
            throw new Error(err)
        }
    },/* findRecipeByChef(id, callback) {
        db.query (`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chefs.id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`
            callback(results.rows) 
        })
    }, */
    filesId(id) {
        return db.query(`SELECT * FROM recipe_files WHERE recipe_id = $1`, [id])
    },
    files(id) {
        return db.query(`SELECT * FROM files WHERE id = $1`, [id])
    }
    
}