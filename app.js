// Dependencies
var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    mehtodOverride = require("method-override");
    expressSanitizer = require("express-sanitizer");

app.set("view engine", "ejs");

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(mehtodOverride("_method"));
app.use(expressSanitizer());

// Database Establishment
mongoose.connect("mongodb://localhost/blog_app", {useNewUrlParser: true});

var PostSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    date: {type: Date, default: Date.now()}
});

var blog = mongoose.model("post", PostSchema);


// RESTFUL Routes

// HomePage
app.get("/blogs", function (req, res) {
    blog.find({}, function (err, allBlogs) {
        res.render("index", {blogs: allBlogs});
    })
});
app.get("/", function (req, res) {
    res.redirect("/blogs");
});

// New Post
app.get("/blogs/new", function (req, res) {
    res.render("new")
});

app.post("/blogs", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.create(req.body.blog, function (err, blog) {
        res.redirect("/blogs")
    });
});

// Show a Specific Page
app.get("/blogs/:id", function (req, res) {
    blog.findById(req.params.id, function (err, foundBlog) {
        res.render("show", {foundBlog: foundBlog});
    });
});

// Update a Post
app.get("/blogs/:id/edit", function (req, res) {
    blog.findById(req.params.id, function (err, foundBlog) {
        res.render("edit", {foundBlog: foundBlog});
    });
});

app.put("/blogs/:id", function (req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedBlog) {
        res.redirect("/blogs/" + req.params.id)
    });

});

// Delete Page
app.delete("/blogs/:id", function (req, res) {
    blog.findByIdAndRemove(req.params.id, function (err, deletedOne) {
        res.redirect("/blogs");
    });
});

// Server Establishment
app.listen(3000, function () {
    console.log("Blog Server Is Running");
});