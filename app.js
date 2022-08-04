const express = require("express")
const app = express()
app.use(express.json())
const {getTopics} = require("./Controllers/topics.controllers")
const { getArticleById, updateVotesByArticleId, getArticles } = require("./Controllers/articles.controllers")
const { getUsers } = require("./Controllers/users.controllers")
const { getCommentsByArticleId, addComment, getComments, deleteCommentById } = require("./Controllers/comments.controllers")
const {getEndpoints} = require("./Controllers/endpoints.controllers")


app.get("/api/topics", getTopics) //

app.get("/api/articles/:article_id", getArticleById) //

app.patch("/api/articles/:article_id", updateVotesByArticleId) //

app.get("/api/users", getUsers) //

app.get("/api/articles", getArticles) //

app.get("/api/articles/:article_id/comments", getCommentsByArticleId) //

app.post("/api/articles/:article_id/comments", addComment) //

app.get("/api/comments", getComments) //

app.delete("/api/comments/:comment_id", deleteCommentById) //

app.get("/api", getEndpoints) //

app.all("/*", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

///////////////////////////

app.use((err, req, res, next) => {
    if(err.status !== 500){
        if (err.code === "22P02"){
            res.status(400).send({msg:"Invalid request"})
        } else if (err.code === "23502") {
            res.status(400).send({msg:"Invalid data entry, please see relevant section in /api endpoint for correct syntax"})
        } else if (err.code === "23503"){
            res.status(404).send({msg: "Passed ID does not exist"})
        }
        res.status(err.status).send({ msg: err.msg} )
        } else {
        next(err)
    }
})

app.use((err, req, res ,next) => {
    res.status(500).send({msg: "There has been a problem with connecting to the server"})
})


module.exports = app