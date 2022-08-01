const res = require("express/lib/response")
const { selectTopics } = require("../Models/topics.models")

exports.getTopics = (req, res, next) => {
    selectTopics().then((topics) => {
        res.send({topics})
    })
    .catch((err) => {
        next(err)
    })
}