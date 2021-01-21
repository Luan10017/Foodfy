const User = require("../model/User")

function onlyUsers(req, res, next) {
    if (!req.session.userId)
        return res.redirect('/admin/login')

    next()
}

function isAdmin (req, res, next) {
    if (!req.session.userAdmin)
        return res.render("admin/session/login", {
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