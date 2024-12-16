const commentsRouter = require("express").Router();
const { deleteComment, patchCommentVotes } = require("../Controllers/api.controller");

commentsRouter
    .route("/:comment_id")
    .delete(deleteComment)
    .patch(patchCommentVotes);

module.exports = commentsRouter;