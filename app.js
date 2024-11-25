const express = require('express');
const endpointsJson = require("../be-nc-news/endpoints.json");

const app = express();

app.get("/api", (req, res) => {
    res.status(200).send({ endpoints : endpointsJson});
});
   

module.exports = app;
