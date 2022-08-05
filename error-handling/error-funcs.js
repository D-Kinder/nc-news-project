exports.handleInvalidRequest = (err, req, res, next) => {
    if (err.code === "22P02"){
        res.status(400).send({msg: "Invalid request"})
    }
    next(err)
}

exports.handleInvalidDataEntry = (err, req, res, next) => {
    if(err.code === "23502") {
        res.status(400).send({msg: "Invalid data entry, please see relevant section in /api endpoint for correct syntax"})
    }
    next(err)
}

exports.handleReferenceError = (err, req, res, next) => {
    if(err.code === "23503") {
        res.status(400).send({msg: "Value reference error"})
    }
    next(err)
}

exports.handleInputError = (err, req, res, next) => {
    if(err.msg) {
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
}

exports.handleServerError = (err, req, res, next) => {
    res.status(500).send({msg: "Server Error"})
}