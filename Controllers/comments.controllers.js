const { selectCommentsByArticleId, insertComment, selectComments, selectCommentToDelete } = require("../Models/comments.models")
const { selectArticleById } = require("../Models/articles.models")
const fs = require("fs/promises")


exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params
    Promise.all([selectCommentsByArticleId(article_id),
                 selectArticleById(article_id)])
                 .then(([comments]) => {
                     res.send({comments})
                 })
                 .catch((err) => {
                    next(err)
                 })
}

exports.addComment = (req, res, next) => {
    const { username, body } = req.body
    const { article_id } = req.params
    
    insertComment(article_id, username, body).then((comment) => {
        res.status(201).send({comment})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getComments = (req, res, next) => {
    selectComments().then((comments) => {
        res.send({comments})
    })
    .catch((err) => {
        next(err)
    })
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params
    selectCommentToDelete(comment_id)
    .then(() => {
        res.sendStatus(204)
    })
    .catch((err) => {
        next(err)
    })
}

exports.getEndpoints = (req, res, next) => {
    return fs.readFile(`endpoints.json`, "utf-8").then((message) => {
        res.send({msg: message})
    })
}

