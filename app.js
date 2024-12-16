const express = require('express');
const cors = require('cors');
const apiRouter = require("./routes/api.router");
const { errorHandler } = require("./error-handlers");



const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("*", (reg, res) => {
    res.status(404).send({ msg: "Not Found"});
});

app.use (errorHandler);

module.exports = app;
