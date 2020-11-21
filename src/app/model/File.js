const db = require('../../config/db')

module.exports = {
    create({filename, path, recipe_id}) {
        let query = ``,
            recipeQuery = ``,
            fileQuery = `
            INSERT INTO files (
                name,
                path,
            ) VALUES ($1, $2)
            RETURNING id
        `
        
        recipeQuery = `
        INSERT INTO recipe_files (
            recipe_id,
            ) VALUES ($3)
            RETURNING id
            `
            const values = [
                filename,
                path,
                recipe_id
            ]

            query = `${fileQuery} ${recipeQuery}`
            return db.query(query, values)
    }
}