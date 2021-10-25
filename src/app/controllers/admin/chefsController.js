const Chef = require("../../model/chef")
const Recipes = require("../../model/recipes")
const File = require('../../model/File')
const fileManager = require('../fileController')
const { date } = require('../../../lib/utils')


module.exports = {
    async chefs(req, res) {
        const results = await Chef.chefs()
        const chefs = results.rows

        const chefsId = chefs.map(chef => chef.file_id)

        const files = await fileManager.getChefsImage(chefsId,req)

        return res.render('admin/chefs/index', {chefs, files})
    },
    async details(req, res) {
        let results = await Chef.find(req.params.index)
        const chef = results.rows[0]
        
        if (!chef) return res.send("Chef not found!")
        
        results = await Recipes.findRecipeByChef(req.params.index)
        const recipes = results.rows
        
        if (!recipes) return res.send("Recipe not found!")


        const filesChef = await fileManager.getChefImage(chef.file_id,req)

        const recipesId = recipes.map(recipe => recipe = recipe.id)
        
        const filesId = await fileManager.getFileAllIds(recipesId)
        const files = await fileManager.getImage(filesId,req)

        return res.render('admin/chefs/details', {chef, recipes, files, filesChef})
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async post(req, res) {
        try {
            /* Validação de dados do formulario */
            const keys = Object.keys(req.body)
            for (key of keys) {
                if (req.body[key].name == "")
                    return res.send('Please, fill all fields.')
            }
        
            /* problema para carregar parametros */
            const file = req.files[0]
            const result = await File.create({...file})
            const file_id = result.rows[0].id

            const { name } = req.body
            const chefId = await Chef.create({
                name,
                created_at: date(Date.now()).iso,
                file_id
            })

            return res.redirect(`/admin/chefs/${chefId}`)
        } catch (error) {
            console.log(error)
        }
    },
    async edit(req, res) {
        let results = await Chef.find(req.params.index)
        const chef = results.rows[0]
        
        if (!chef) return res.send("Chef not found!")

        const files = await fileManager.getChefImage(chef.file_id,req)

        return res.render('admin/chefs/edit', { chef, files })
    },
    async put(req, res) {
        try {
            const keys = Object.keys(req.body)
            for (key of keys) {
                if (req.body[key] == "" && key != "removed_files")
                    return res.send('Please, fill all fields.')
            }

            let file_id
            if ( req.files.length != 0 ) {
                const file = req.files[0]
                file_id = await File.create({...file})
                file_id = file_id.rows[0].id
            }

            const {id, name } = req.body
            await Chef.update(id, {name, file_id})
           

            if ( req.body.removed_files ) {
                let removedFile = req.body.removed_files
                removedFile = removedFile.replace(",","")
                
                await File.delete(removedFile)
            }

            return res.redirect(`/admin/chefs/${id}`)
        } catch (error) {
            console.log(error)
        }
        
    },
    delete(req, res) {
        Chef.delete(req.body.id, function() {
            return res.redirect(`/admin/chefs`)
        })
    }
}

