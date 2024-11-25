const express = require('express');
const { getApi, getTopics, getArticleId } = require("../be-nc-news/Controllers/api.controller")


const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleId);

app.use ((err, req, res, next) => {
    if (err.status){
        res.status(err.status).send({ msg: err.msg});
    } else if (err.code === "22P02"){
        res.status(400).send({ msg: "Invalid article id" })
    } else {
        res.status(500).send({ msg: "Internal Server Error" });
    }
})

module.exports = app;
