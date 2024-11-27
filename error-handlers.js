exports.errorHandler = (err, req, res, next) => {
    // console.log(err);
    if (err.status){
        res.status(err.status).send({ msg: err.msg});
    } else if (err.code === "22P02"){
        // console.log(req.url);
        if (req.url.startsWith("/api/comments/")) {
            res.status(400).send({ msg: "Invalid comment id"});
         } else {
        res.status(400).send({ msg: "Invalid article id" });
         }
    } else {
        res.status(500).send({ msg: "Internal Server Error" });
    }
}