const Recipes = require("../model/recipes")

module.exports = {
    async getFileId (id) {
        let results = await Recipes.filesId(id) 
        return filesId = results.rows.map(id => id.file_id)
    },
    async getFileAllIds (id) {
        const idsPromise = id.map(id => Recipes.filesId(id))
        const idsResults = await Promise.all(idsPromise)
        
        const ids = idsResults.map(id => id.rows[0].file_id)
      
        return ids
    },
    async getImage (filesId, req) {
        const filesPromise = filesId.map(fileId => Recipes.files(fileId))
        const fileResults = await Promise.all(filesPromise)

        let files = fileResults.map(data => data.rows[0])

        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
        }))
        return files
    }
}