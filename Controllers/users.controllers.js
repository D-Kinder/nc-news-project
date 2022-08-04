const { selectUsers, selectUserByUsername } = require("../Models/users.models")

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.send({users})
    })
}

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params
    selectUserByUsername(username).then((user) => {
        res.send({user})
    })
    .catch((err) => {
        next(err)
    })
}