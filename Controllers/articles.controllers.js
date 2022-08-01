const { selectArticleById, changeVotesByArticleId } = require("../Models/articles.models")

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
        console.log(err.code)
        next(err)
    })
}