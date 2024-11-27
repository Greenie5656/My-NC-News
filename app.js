const express = require('express');
const { getApi, getTopics, getArticleId, getArticles, getArticleComments, postComment, patchArticleVotes } = require("../be-nc-news/Controllers/api.controller")
const { errorHandler } = require("../be-nc-news/error-handlers");

const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.all("*", (reg, res) => {
    res.status(404).send({ msg: "Not Found"});
});

app.use (errorHandler);

module.exports = app;
