const topicsRouter = require("express").Router();
const { getTopics } = require("../Controllers/api.controller");

topicsRouter
    .route("/")
    .get(getTopics);

module.exports = topicsRouter;