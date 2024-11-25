const express = require('express');
const { getApi, getTopics } = require("../be-nc-news/Controllers/api.controller")


const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.use ((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: "Error"})
})

module.exports = app;
