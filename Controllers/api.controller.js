const endpointsJson = require("../endpoints.json");
const { selectTopics, selectArticleId, selectArticles, selectArticleComments, insertComment, updateArticleVotes, removeComment, selectUsers, selectUserByUsername,updateCommentVotes } = require("../Models/api.model")

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
  
    const { sort_by, order, topic } = req.query;
    
    selectArticles(sort_by, order, topic)
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

exports.patchArticleVotes = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    updateArticleVotes(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article });
    })
    .catch((err) => {
        next(err);
    })
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;

    removeComment(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {
        next(err);
    });
};

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({ users });
    })
    .catch((err) => {
        next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params;
    selectUserByUsername(username)
    .then((user) => {
        res.status(200).send({ user });
    })
    .catch((err) => {
        next(err);
    })
}

exports.patchCommentVotes = (req, res, next) => {

    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateCommentVotes(comment_id, inc_votes)
    .then((comment) => {
        res.status(200).send({ comment });
    })
    .catch((err) => {
        next(err)
    });
};