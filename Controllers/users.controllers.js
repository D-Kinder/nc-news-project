const { selectUsers } = require("../Models/users.models")

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.send({users})
    })
}