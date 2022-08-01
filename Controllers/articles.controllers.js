const { selectArticleById } = require("../Models/articles.models")

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id).then((article) => {
        res.send({article})
    }).catch((err) => {
        next(err)
    })
}