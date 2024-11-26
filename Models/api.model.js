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

exports.selectArticles = () => {
    return db
    .query("SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INTEGER AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;")
    .then (({ rows }) => rows);
}

exports.selectArticleComments = (article_id) => {
    const text = "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC";
    const values = [article_id];
    return exports.selectArticleId(article_id)
        .then(() => {
            return db.query(text, values)
        })
        .then(({ rows }) => rows);
    };

