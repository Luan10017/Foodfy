const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')

const Base = require('./Base')
Base.init({ table: 'users' })

module.exports = {
    ...Base,
    getAllUsers() {
        return db.query(`SELECT * FROM users`)
    },
    async findOne(filters) {
       let query = "SELECT * FROM users"

       Object.keys(filters).map(key => {
           query = `${query}
           ${key}
           `
           Object.keys(filters[key]).map(field => {
                query = `${query}${field} = '${filters[key][field]}'`
           })
       })

       const results = await db.query(query)
       return results.rows[0]
    },
    async getRecipesByUser (id) {
        //pegar todas as receitas
        const results = await db.query("SELECT id FROM recipes WHERE user_id = $1", [id])
        return results.rows
    },
    async delete(id) {
        
        // pegar todas as imagens das receitas
        /* const allFilesPromise = products.map(product => 
            Product.files(product.id))

        let promiseResults = await Promise.all(allFilesPromise) */
       
        // rodar a remoção do usuário
        await db.query('DELETE FROM users WHERE id = $1', [id])
       
        
        
    }
 }