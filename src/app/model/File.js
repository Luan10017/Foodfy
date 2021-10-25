const fs = require('fs')
const db = require('../../config/db')

const Base = require('./Base')
Base.init({ table: 'files' })

module.exports = {
    ...Base,
    /* async findFileById(id) {
        const result = await db.query(`SELECT * FROM files WHERE id = ${id}`)
        return result.rows[0]
    }, */
    create({filename, path}) {
        const query = `
            INSERT INTO files (
                name,
                path
            ) VALUES ($1, $2)
            RETURNING id
        `
        const values = [
            filename,
            path
        ]

        try {
            return db.query(query, values)
        } catch (err) {
            throw new Error(err)
        }
    },
    createRecipeFiles(fileId, recipeId) {
        const query = `
        INSERT INTO recipe_files (
            recipe_id,
            file_id
        ) VALUES ($1, $2)
        `
        const values = [
            recipeId,
            fileId
        ]

        try {
            return db.query(query, values)
        } catch (err) {
            throw new Error(err)
        }
    },
    createChefFiles(fileId, chefId) {
        const query = `
        INSERT INTO chef_files (
            chef_id,
            file_id
        ) VALUES ($1, $2)
        `
        const values = [
            chefId,
            fileId
        ]

        try {
            return db.query(query, values)
        } catch (err) {
            throw new Error(err)
        }
    },
    async delete(id) {
        try {
            const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = result.rows[0]
    
            fs.unlinkSync(file.path)

            return db.query(`
            DELETE FROM files WHERE id = $1
        `, [id])
        }catch(err){
            console.error(err)
        }
    },
    async deleteRecipeFile(id) {
        try {
            return db.query(`
            DELETE FROM recipe_files WHERE file_id = $1
        `, [id])
        }catch(err){
            console.error(err)
        }
    },
    async deleteChefFile(id) {
        try {
            return db.query(`
            DELETE FROM chef_files WHERE file_id = $1
        `, [id])
        }catch(err){
            console.error(err)
        }
    }
} 