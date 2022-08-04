const db = require("../db/connection")

exports.selectCommentsByArticleId = (article_id) => {
    return db.query(`SELECT comment_id, votes, created_at, author, body
    FROM comments WHERE article_id = $1`, [article_id]).then(({rows}) => {
        if(rows.length !== 1){
        return rows
        }
        return rows[0]
    })
}

exports.insertComment = (article_id, username, body) => {
    return db.query(`INSERT INTO comments (article_id, author, body)
    VALUES ($1, $2, $3) RETURNING *`, [article_id, username, body])
    .then(({rows}) =>{
        return rows[0]
    })
}

exports.selectComments= () => {
    return db.query(`SELECT * FROM comments`).then(({rows}) => {
        return rows
})
}
exports.selectCommentToDelete = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment_id]).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Passed ID does not exist"})
        }
    })
}

exports.changeVotesByCommentId = (comment_id, inc_votes) => {
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [inc_votes, comment_id]).then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Passed ID does not exist"})
        }
        return rows[0]
    })
}

