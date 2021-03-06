const db = require('../../config/db')
const { hash } = require('bcryptjs')
const fs = require('fs')

module.exports = {
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
    async create(data, randomPassword, token) {
        try{
            const query = `
            INSERT INTO users (
                name,
                email,
                password,
                reset_token,
                reset_token_expires,
                is_admin
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
            `
            
            const passwordHash = await hash(randomPassword, 8 )

            let now = new Date()
            now = now.setHours(now.getHours() + 1)


            const values = [
                data.name,
                data.email,
                passwordHash,
                token,
                now,
                data.admin
            ]

            const results = await db.query(query, values)
            return results.rows[0].id
        }
        catch(err) {
            console.error(err)
        }
        
    },
    async update(id, fields) {
        let query = "UPDATE users SET"

        Object.keys(fields).map((key, index, array) => {
            if ((index + 1) < array.length) {
                query = `${query}
                    ${key} = '${fields[key]}',
                `
            }else {
                //last iteration
                query = `${query}
                    ${key} = '${fields[key]}'
                    WHERE id = ${id}
                `
            }

        })

        await db.query(query)
        return
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
       
        //remover as imagens da pasta public
        /* promiseResults.map(results => {
            results.rows.map(file => { 
                try {
                    fs.unlinkSync(file.path)
                }catch(err) {
                    console.error(err)
                }
            })
        }) */
        
    }
 }