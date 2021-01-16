const User = require("../model/User")

function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/admin/login')

    next()
}

async function isAdmin (req, res, next) {
    const id = req.session.userId
    const user = await User.findOne({
        where: {id}
    })
    
    if (!user.is_admin)
        return res.render("admin/user/users-list", {
            error: "Você precisa ser administrador para realizar essa ação."
        })
    next()
}

/* function isLoggedRedirectToUsers(req, res, next) {
    if (req.session.userId)
        return res.redirect('/users')
    
    next()
} */

module.exports = {
    onlyUsers,
    isAdmin
   //isLoggedRedirectToUsers
}