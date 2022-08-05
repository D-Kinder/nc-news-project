const db = require("../db/connection")

exports.selectArticleById = (article_id) => {
    return db.query(`SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
    FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`, [article_id])
    .then(({ rows }) => {
        if(rows[0] === undefined){
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

exports.selectArticles = (sort_by = "created_at", order = "desc", topic, limit = 10, page=1, isQueryInvalid) => {
    const validSortBy = ["title", "topic", "author", "body", "created_at", "votes", "article_id"]
    const validOrder = ["asc", "desc"]
    const isLimitValid = /\d/g.test(limit)
    const isPageValid = /\d/g.test(page)
    const offset = (page-1) * limit
    
    if (!validSortBy.includes(sort_by) || (!validOrder.includes(order) || !isLimitValid || !isPageValid)){
        return Promise.reject({status: 400, msg: "Invalid query parameter"})
    }

    if(isQueryInvalid){
        return Promise.reject({status: 400, msg: "Invalid query property"})
    }

    let queryString = `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `
    let injectionArray = []
   
    if(topic !== undefined){
        queryString += `WHERE topic = $1 `
        injectionArray.push(topic)
    }
    
    queryString += `GROUP BY articles.article_id `
    
    if(order === "asc"){
        queryString += `ORDER BY ${sort_by} ASC `
    } else {
        queryString += `ORDER BY ${sort_by} DESC `
    }
 
    queryString += `LIMIT ${limit} OFFSET ${offset};`
      
    return db.query(queryString, injectionArray).then(({rows: articles}) => {
        //console.log(articles)
       queryString = `SELECT COUNT(*) FROM articles `
       injectionArray = []

       if(topic !== undefined){
        queryString += `WHERE topic = $1 `
        injectionArray.push(topic)
        }

        return db.query(queryString, injectionArray).then(({rows: allArticles}) => {
          return [articles, allArticles[0].count]
         })
    })
}

exports.insertArticle = (author, title, body, topic, isBodyInvalid) => {
    if(isBodyInvalid) {
        return Promise.reject({status: 400, msg: "Invalid data entry, please see relevant section in /api endpoint for correct syntax"})
    }

    return db.query(`INSERT INTO articles (author, title, body, topic) VALUES ($1, $2, $3, $4) RETURNING *`, [author, title, body, topic]).then(({rows}) => {
        const article_id = rows[0].article_id
        return db.query(`SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
        FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id`, [article_id])
        .then(({rows}) => {
            return rows[0]
        })
        
    })
}