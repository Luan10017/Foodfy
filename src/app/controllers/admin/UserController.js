module.exports = {
    list(req, res) {
        return res.render("admin/user/users-list")
    },
    async post(req, res) {
        const userId = await User.create(req.body)

        req.session.userId = userId

        return res.redirect('/users')
    }
}