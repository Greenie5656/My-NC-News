const articlesRouter = require("express").Router();
const { getArticleId, getArticles, getArticleComments, postComment, patchArticleVotes } = require("../Controllers/api.controller");

articlesRouter
    .route("/")
    .get(getArticles);

articlesRouter
    .route("/:article_id")
    .get(getArticleId)
    .patch(patchArticleVotes);

articlesRouter
    .route("/:article_id/comments")
    .get(getArticleComments)
    .post(postComment);

module.exports = articlesRouter;
