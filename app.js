var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"), 
    Recipe = require("./models/recipe"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local")

//require server info
var PORT = process.env.PORT || 5000;
var IP = process.env.IP || '127.0.0.1';

//require routes
var commentRoutes = require("./routes/comments"),
    recipeRoutes = require("./routes/recipes"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/recipeapp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//seed DB with 3 recipes
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret phrase",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// pass in user to all views 
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// Routes
app.use("/", indexRoutes);
app.use("/recipes", recipeRoutes);
app.use("/recipes/:id/comments", commentRoutes);

// Server Configuration

app.listen(PORT, IP, function() {
    console.log("recipeApp server has started");
})