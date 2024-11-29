const usersRouter = require("express").Router();
const { getUsers } = require("../Controllers/api.controller");

usersRouter
    .route("/")
    .get(getUsers);

module.exports =usersRouter;