const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id])
    .then(({ rows }) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Passed ID does not exist"})
        }
        return rows[0]
    })
}

exports.changeVotesByArticleId = (article_id, inc_votes) => {
    return db.query(`UPDATE articles SET votes = votes + $2 WHERE article_id =$1 RETURNING *`, [article_id, inc_votes])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Passed ID does not exist"})
        }
        return rows[0]
    })
}

exports.selectArticles = () => {
    return db.query(`SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`).then(({rows}) => {
        return rows
    })
}