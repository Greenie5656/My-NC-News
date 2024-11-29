const commentsRouter = require("express").Router();
const { deleteComment } = require("../Controllers/api.controller");

commentsRouter
    .route("/:comment_id")
    .delete(deleteComment);

module.exports = commentsRouter;