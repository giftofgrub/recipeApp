var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"), 
    Recipe = require("./models/recipe"),
    seedDB = require("./seeds");

var PORT = process.env.PORT || 5000;
var IP = process.env.IP || '127.0.0.1';


mongoose.connect("mongodb://localhost/recipeapp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/recipes", function(req, res) {
    // Get all recipes from DB
    Recipe.find({}, function(err, allRecipes){
        if(err) {
            console.log("error")
        } else {
            res.render("index", {recipes:allRecipes})
        }
    });
});
app.post("/recipes", function(req, res) {
    // get data from form and add to campgrounds array
    //redirect to campgrounds page
    
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

app.get("/recipes/new", function(req, res) {
   res.render("new") 
});

// Show info of one recipe
app.get("/recipes/:id", function(req, res){
    // find the recipe with the provided ID
    var id = req.params.id;
    Recipe.findById(id, function(err, foundRecipe){
        if(err) {
            console.log(err);
        } else {
            res.render("show", {recipe: foundRecipe})
        }
    });
});


app.listen(PORT, IP, function() {
    console.log("recipeApp server has started");
})