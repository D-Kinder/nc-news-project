const express = require("express")
const app = express()
app.use(express.json())
const {getTopics} = require("./Controllers/topics.controllers")
const { getArticleById} = require("./Controllers/articles.controllers")

app.get("/api/topics", getTopics)

app.get("/api/articles/:article_id", getArticleById)

app.all("/*", (req, res) => {
    res.status(404).send({msg: "Endpoint not found"})
})

///////////////////////////

app.use((err, req, res, next) => {
    if(err.status !== 500){
        if (err.code === "22P02"){
            res.status(400).send({msg:"Invalid ID passed"})
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