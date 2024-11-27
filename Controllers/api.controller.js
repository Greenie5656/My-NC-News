const endpointsJson = require("../endpoints.json");
const { selectTopics, selectArticleId, selectArticles, selectArticleComments, insertComment } = require("../Models/api.model")

exports.getApi = (req, res, next) => {
    res.status(200).send({ endpoints : endpointsJson});
};

exports.getTopics = (req, res, next) => {
    selectTopics()
    .then((topics) => {
        res.status(200).send({ topics });
    })
    .catch((err) => {
        next(err);
    });  
};

exports.getArticleId = (req, res, next) => {

    const { article_id } = req.params;
    selectArticleId(article_id)
    .then((article) => {

        res.status(200).send({article})
    })
    .catch((err) => {
        next(err);
    });
};

exports.getArticles = (req, res, next) => {
    selectArticles()
    .then((articles) => {
        res.status(200).send({ articles });
    })
    .catch((err) => {
        next(err);
    })
};

exports.getArticleComments = (req, res, next) => {
    const { article_id } = req.params;
    selectArticleComments(article_id)
    .then((comments) => {
        res.status(200).send({ comments })
    })
    .catch((err) => {
        next(err);
    });
}

exports.postComment = (req, res, next) => {

    const { article_id } = req.params;
    const comment = req.body;
    insertComment(article_id, comment)
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch((err) => {
        next(err);
    });
}