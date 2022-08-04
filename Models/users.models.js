const db = require("../db/connection")

exports.selectUsers = () => {
    return db.query(`SELECT * FROM users`).then(({rows}) => {
        return rows
    })
}

exports.selectUserByUsername = (username) => {
    return db.query(` SELECT * FROM users WHERE username = $1`, [username]).then(({rows}) => {
        if(rows[0] === undefined){
            return Promise.reject({status: 404, msg: "Passed username does not exist"})
        }
        return rows[0]
    })
}