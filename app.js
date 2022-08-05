const express = require("express")
const app = express()
app.use(express.json())
const {getTopics} = require("./Controllers/topics.controllers")
const { getArticleById, updateVotesByArticleId, getArticles, addArticle } = require("./Controllers/articles.controllers")
const { getUsers, getUserByUsername } = require("./Controllers/users.controllers")
const { getCommentsByArticleId, addComment, getComments, deleteCommentById, updateVotesByCommentId } = require("./Controllers/comments.controllers")
const {getEndpoints} = require("./Controllers/endpoints.controllers")
const { handleInvalidRequest, handleInvalidDataEntry, handleReferenceError, handleInputError, handleServerError} = require("./error-handling/error-funcs")


app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", updateVotesByArticleId)

app.get("/api/users", getUsers)

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)

app.post("/api/articles/:article_id/comments", addComment)

app.get("/api/comments", getComments)

app.delete("/api/comments/:comment_id", deleteCommentById)

app.get("/api", getEndpoints)

app.get("/api/users/:username", getUserByUsername)

app.patch("/api/comments/:comment_id", updateVotesByCommentId)

app.post("/api/articles", addArticle)

app.all("/*", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

app.use(handleInvalidRequest)
app.use(handleInvalidDataEntry)
app.use(handleReferenceError)
app.use(handleInputError)
app.use(handleServerError)

module.exports = app