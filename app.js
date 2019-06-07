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

var PORT = process.env.PORT || 5000;
var IP = process.env.IP || '127.0.0.1';


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

//landing page
app.get("/", function(req, res){
    res.render("landing");
});

//==========================================
//    Recipes Routes
//==========================================

app.get("/recipes", function(req, res) {
    // Get all recipes from DB
    Recipe.find({}, function(err, allRecipes){
        if(err) {
            console.log("error")
        } else {
            res.render("recipes/index", {recipes:allRecipes})
        }
    });
});
app.post("/recipes", function(req, res) {
    // get data from form and add to recipes array
    //redirect to recipes page
    
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var ingredients = req.body.ingredients;
    var instructions = req.body.instructions;
    var newRecipe = {
        name: name,
        image: image,
        description: description,
        ingredients: ingredients,
        instructions: instructions
    };
    
    Recipe.create(newRecipe, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/recipes")
        }
    });
    
});

//NEW - show form to create new recipe

app.get("/recipes/new", function(req, res) {
   res.render("recipes/new") 
});

// Show info of one recipe
app.get("/recipes/:id", function(req, res){
    // find the recipe with the provided ID
    var id = req.params.id;
    // populate Recipe with its comments from another Mongoose Schema
    Recipe.findById(id).populate("comments").exec(function(err, foundRecipe){
        if(err) {
            console.log(err);
        } else {
            res.render("recipes/show", {recipe: foundRecipe})
        }
    });
});

//==========================================
//    Comments Routes
//==========================================

app.get("/recipes/:id/comments/new", isLoggedIn, function(req, res){
    // find recipe by id
    Recipe.findById(req.params.id, function(err, recipe){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {recipe: recipe});
        }
    });
});

app.post("/recipes/:id/comments", isLoggedIn, function(req, res){
    //lookup recipe using ID
    Recipe.findById(req.params.id, function(err, recipe){
        if(err){
            console.log(err);
            res.redirect("/recipes");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    recipe.comments.push(comment);
                    recipe.save();
                    res.redirect((`/recipes/${recipe._id}`))
                }
            })
        }
    });
    //create new comment
    //connect new comment to recipe
    //redirect to recipe show page
});

//============
// AUTH ROUTES
//============

// show register form
app.get("/register", function(req, res){
    res.render("register");
});
// handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/recipes");
        });
    });
});


// show login form
app.get("/login", function(req, res){
    res.render("login");
});

// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/recipes",
        failureRedirect: "/login"
    }), function(req, res){
  
});

// logout route
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/recipes");
});

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}




// Server Configuration

app.listen(PORT, IP, function() {
    console.log("recipeApp server has started");
})