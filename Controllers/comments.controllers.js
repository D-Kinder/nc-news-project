const { selectCommentsByArticleId, insertComment, selectComments, selectCommentToDelete, changeVotesByCommentId } = require("../Models/comments.models")
const { selectArticleById } = require("../Models/articles.models")
const fs = require("fs/promises")
const { Console } = require("console")


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
    let { username, body } = req.body
    const { article_id } = req.params
    const reqKeys = Object.keys(req.body)
    
    if(reqKeys.length > 2){
        username = undefined,
        body = undefined
    }

    
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

exports.updateVotesByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    changeVotesByCommentId(comment_id, inc_votes).then((comment) => {
        res.send({comment})
    }).catch((err) => {
        next(err)
    })
}

