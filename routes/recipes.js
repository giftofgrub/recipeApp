var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");



//==========================================
//    Recipes Routes
//==========================================

router.get("", function(req, res) {
    // Get all recipes from DB
    Recipe.find({}, function(err, allRecipes){
        if(err) {
            console.log("error")
        } else {
            res.render("recipes/index", {recipes:allRecipes})
        }
    });
});
router.post("", function(req, res) {
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

router.get("/new", function(req, res) {
   res.render("recipes/new") 
});

// Show info of one recipe
router.get("/:id", function(req, res){
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

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;