const Recipes = require("../model/recipes")
const Chef = require("../model/chef")

module.exports = {
    async getRecipeFileId (id) {
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

        files = srcTransformer(files,req)
        return files
    },
    async getChefFileId (id) {
        let results = await Chef.filesId(id) 
        return filesId = results.rows.map(id => id.file_id)
    },
    async getFileAllChefsIds (id) {
        const idsPromise = id.map(id => Chef.filesId(id))
        const idsResults = await Promise.all(idsPromise)
        
        const ids = idsResults.map(id => id.rows[0].file_id)
      
        return ids
    },
    async getChefsImage (filesId, req) {
        const filesPromise = filesId.map(fileId => Chef.files(fileId))
        const fileResults = await Promise.all(filesPromise)

        let files = fileResults.map(data => data.rows[0])

        files = srcTransformer(files,req)
        return files
    },
    async getChefImage (fileId, req) {
        let file = await Chef.files(fileId)
        file = file.rows[0]

        file = srcTransformer([file],req)
        return file
    }
}

function srcTransformer (files, req) {
    return files.map(file => ({
        ...file,
        src: `${req.protocol}://${req.headers.host}${file.path.replace('public','')}`
    }))
}