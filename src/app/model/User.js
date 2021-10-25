const db = require('../../config/db')

const Base = require('./Base')
Base.init({ table: 'users' })

module.exports = {
    ...Base,
    async getRecipesByUser (id) {
        const results = await db.query("SELECT id FROM recipes WHERE user_id = $1", [id])
        return results.rows
    },
 }