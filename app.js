const express = require("express")
const app = express()
app.use(express.json())
const {getTopics} = require("./Controllers/topics.controllers")

app.get("/api/topics", getTopics)

app.all("/*", (req, res) => {
    res.status(400).send({msg: "Endpoint not found"})
})


module.exports = app