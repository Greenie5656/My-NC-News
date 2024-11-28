const db = require("../db/connection")

exports.selectTopics = () => {
    return db
    .query("SELECT * FROM topics;")
    .then (({ rows }) => rows);
}

exports.selectArticleId = (article_id) => {
const text = "SELECT * FROM articles WHERE article_id = $1";
const values = [article_id];
    return db.query(text, values)
    .then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article not found"});
        }
        return rows[0];
    })
}

exports.selectArticles = (sort_by = "created_at", order = "desc") => {

    const validColumns = [
        'author',
        'title',
        'article_id',
        'topic',
        'created_at',
        'votes',
        'comment_count'
    ]

    const validOrders = ["asc", "desc"];

    if (!validColumns.includes(sort_by)){
        return Promise.reject({ status: 400, msg: "Invalid sort_by query"});
    }
    if (!validOrders.includes(order.toLowerCase())){
        return Promise.reject({ status: 400, msg: "Invalid order query"});
    }

    const queryStr = `SELECT articles.author, articles.title, articles.article_id, 
    articles.topic, articles.created_at, articles.votes, articles.article_img_url,COUNT(comments.comment_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY ${sort_by} ${order};`

    return db
    .query(queryStr)
    .then (({ rows }) => rows);
}

exports.selectArticleComments = (article_id) => {
    if (!article_id) {
        return Promise.reject({status: 400, msg: "Invalid article id"})
    }
    const text = "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC";
    const values = [article_id];
    return exports.selectArticleId(article_id)
        .then(() => {
            return db.query(text, values)
        })
        .then(({ rows }) => rows);
    };

exports.insertComment = (article_id, comment) => {
    const { username, body } = comment;
    const text = "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, 0, NOW()) RETURNING *"
    const values =[body, username, article_id];
    // console.log(values)
    if (!username || !body){
        return Promise.reject({ status: 400, msg: "Missing required fields"})
    }


    return exports.selectArticleId(article_id)
        .then(() => {
            return db.query(text, values)
        })
        .then(({ rows }) => rows[0]);
    };

exports.updateArticleVotes = (article_id, inc_votes) => {
    if (!inc_votes){
        return Promise.reject({ status: 400, msg: "Missing inc_votes in request body"})
    }
    if (typeof inc_votes !== "number"){
        return Promise.reject({ status: 400, msg: "Invalid inc_votes value"});
    }
    const text = "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;";
    const values = [inc_votes, article_id];

    return db.query(text, values)
    .then (({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Article not found"});
        }
        return rows[0];
    });
};

exports.removeComment = (comment_id) => {

    const text = "DELETE FROM comments WHERE comment_id = $1 RETURNING*;";
    const values = [comment_id];

    return db.query(text, values)
    .then(({rows}) =>{
        if (rows.length === 0){
            return Promise.reject({ status: 404, msg: "Comment not found" });
        }
   
    });
};

exports.selectUsers = () => {
    return db
    .query("SELECT * FROM users;")
    .then(({ rows }) => rows );
};

