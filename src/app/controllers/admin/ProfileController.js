const { update } = require("../../model/chef")
const User = require("../../model/User")

module.exports = {
    async index(req, res) {
        const id = req.session.userId
        const user = await User.findOne({ where: {id} })
        
        return res.render("admin/user/index", {user})
    },
    async update(req, res) {
        const {name, email} = req.body
        const id = req.session.userId
        
        try {
            await User.update(id, {
                name,
                email
            })
            return res.render("admin/user/index", {
                user: req.body,
                success: "Dados atualizados com sucesso!"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/user/index", {
                user: req.body,
                error: "Erro inesperado, tente novamente"
            })
        }
    }
}