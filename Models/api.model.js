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