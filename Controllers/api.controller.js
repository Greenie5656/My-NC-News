const endpointsJson = require("../endpoints.json");
const { selectTopics } = require("../Models/api.model")

exports.getApi = (req, res, next) => {
    res.status(200).send({ endpoints : endpointsJson});
};

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch(next);
    
}

