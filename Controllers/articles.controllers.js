const { selectArticleById, changeVotesByArticleId, selectArticles, insertArticle } = require("../Models/articles.models")

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
    const { sort_by, order, topic, limit, page } = req.query
    const validQueries = ["sort_by", "order", "topic", "limit", "page"]

    let isQueryInvalid = Object.keys(req.query)
    const queryValidityCheck = isQueryInvalid.filter((query) => !validQueries.includes(query))
    
    if(queryValidityCheck.length > 0){
        isQueryInvalid = true
    } else {
        isQueryInvalid = false
    }
    
    selectArticles(sort_by, order, topic, limit, page, isQueryInvalid).then((articles) => {
        res.send({articles})
    }).catch((err) => {
        next(err)
    })
}

exports.addArticle = (req, res, next) => {
    let { author, title, body, topic } = req.body
    const validProperties = ["author", "title", "body", "topic"]

    let isBodyInvalid = Object.keys(req.body)
    const bodyValidityCheck = isBodyInvalid.filter((body) => !validProperties.includes(body))

    if(bodyValidityCheck.length > 0){
        isBodyInvalid = true
    } else {
        isBodyInvalid = false
    }

    if((title !== undefined && title.length === 0) || (body !== undefined && body.length === 0)){
        title = undefined,
        body = undefined
    }

    insertArticle(author, title, body, topic, isBodyInvalid).then((article) => {
        res.status(201).send({article})
    }).catch((err) => {
        next(err)
    })
}