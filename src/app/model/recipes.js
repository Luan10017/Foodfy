const db = require("../../config/db")
const { date } = require('../../lib/utils')

const Base = require('./Base')
Base.init({ table: 'recipes' })

module.exports = {
    ...Base,
    all() {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        ORDER BY created_at DESC
        `)
    },
    chefsSelectOptions() {
        return db.query (`
            SELECT name, id FROM chefs
        `)
    },
    async create(data) {
        try {
            const query = `
            INSERT INTO recipes (
                title,
                chef_id,
                ingredients,
                preparation,
                information,
                created_at,
                user_id	
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
            `
            const values = [
                data.title,
                data.chef_id,
                data.ingredients,
                data.preparation,
                data.information,
                date(Date.now()).iso,
                data.user_id
            ]
            
            const results = await db.query(query, values)
            return results.rows[0].id
        } catch (err) {
            console.error(error)
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
    /* find(id) {
        return db.query (`SELECT recipes.*, chefs.name AS chef_name 
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id) 
            WHERE recipes.id = $1`, [id])
    }, */
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
            if(err) throw `Database Error! ${err}`

            return callback()
        })
    },
    findBy(filter) {
        const query = `
        SELECT recipes.*, chefs.name AS chef_name 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY updated_at DESC
        `
        try {
            return db.query(query)
        } catch (err) {
            throw new Error(err)
        }
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
    },
    filesId(id) {
        return db.query(`SELECT * FROM recipe_files WHERE recipe_id = $1`, [id])
    },
    files(id) {
        return db.query(`SELECT * FROM files WHERE id = $1`, [id])
    }
}