const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const express = require("express");
const { stringify } = require("querystring");
const { log } = require("console");
const { title } = require("process");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//////////////////////////////////////REQUESTING FULL ARTICLES//////////////////////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                console.log(err);
            }
        })
    })

    .post((req, res) => {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save((err) => {
            if (!err) {
                res.send("Sucessfully added")
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany({}, (err) => {
            if (!err) {
                res.send("susses dleted all")
            } else {
                res.send(err);
            }
        });
    });

//////////////////////////////////////REQUESTING SPECIFIC ARTICLES//////////////////////////////////
app.route("/articles/:articleTitle")

    .get((req, res) => {

        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No article Foud woth ur ID")
            }
        });
    })

    .put((req, res) => {

        Article.updateOne(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            // {overwrite:true}, Not working
            (err) => {
                if (!err) {
                    res.send("Suseefully Updated")
                } else {
                    res.send("Cant Put")
                }
            }
        );
    })

    .patch((req, res) => {

        Article.updateOne(
            { title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (!err) {
                    res.send("Patched Succeully");
                } else {
                    res.send(err);
                }

            }
        );
    })

    .delete((req, res) => {

        Article.deleteOne(
            { title: req.params.articleTitle },
            (err) => {
                if (!err) {
                    res.send("deleted")
                } else {
                    res.send(err)
                }
            }
        );
    });










app.listen(3000, () => {
    console.log("App running at 3000Km/Hr");
})