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