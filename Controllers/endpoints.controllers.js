const fs = require("fs/promises")

exports.getEndpoints = (req, res, next) => {
    return fs.readFile(`api-endpoints.json`, "utf-8").then((message) => {
        res.send({endpoints: message})
    })
}