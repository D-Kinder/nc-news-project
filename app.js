const express = require("express")
const app = express()
app.use(express.json())
const {getTopics} = require("./Controllers/topics.controllers")
const { getArticleById, updateVotesByArticleId} = require("./Controllers/articles.controllers")
const { getUsers } = require("./Controllers/users.controllers")

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.patch("/api/articles/:article_id", updateVotesByArticleId)

app.get("/api/users", getUsers)

app.all("/*", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

///////////////////////////

app.use((err, req, res, next) => {
    if(err.status !== 500){
        if (err.code === "22P02"){
            res.status(400).send({msg:"Invalid request"})
        } else if (err.code === "23502") {
            res.status(400).send({msg:"Invalid data entry, please see relevant endpoint section in documentation for correct syntax"})
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