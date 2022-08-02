const { selectCommentsByArticleId } = require("../Models/comments.models")
const { selectArticleById } = require("../Models/articles.models")

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