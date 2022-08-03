const { selectArticleById, changeVotesByArticleId, selectArticles } = require("../Models/articles.models")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.updateVotesByArticleId = (req, res, next) => {
    const { inc_votes } = req.body
    const { article_id } = req.params
    changeVotesByArticleId(article_id, inc_votes).then((article) => {
        res.send({article})
    }).catch((err) => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    const { sort_by, order, topic } = req.query
    const validQueries = ["sort_by", "order", "topic"]

    let isQueryInvalid = Object.keys(req.query)
    const queryValidityCheck = isQueryInvalid.filter((query) => !validQueries.includes(query))

    if(queryValidityCheck.length > 0){
        isQueryInvalid = true
    } else {
        isQueryInvalid = false
    }
    
    selectArticles(sort_by, order, topic, isQueryInvalid).then((articles) => {
        res.send({articles})
    }).catch((err) => {
        next(err)
    })
}