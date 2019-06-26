var express = require("express");
var router = express.Router();
var Recipe = require("../models/recipe");
var { isLoggedIn, checkRecipeOwnership } = require("../middleware")



//==========================================
//    Recipes Routes
//==========================================

// Index Route
router.get("/", function(req, res) {
    // Get all recipes from DB
    Recipe.find({}, function(err, allRecipes){
        if(err) {
            console.log("error")
        } else {
            res.render("recipes/index", {recipes:allRecipes})
        }
    });
});

// NEW - show form to create new recipe
router.get("/new", isLoggedIn, function(req, res) {
    res.render("recipes/new") 
 });

 // CREATE Route
router.post("/", isLoggedIn, function(req, res) {
    // get data from form and add to recipes array
    //redirect to recipes page
    
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var ingredients = req.body.ingredients;
    var instructions = req.body.instructions;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newRecipe = {
        name: name,
        image: image,
        description: description,
        ingredients: ingredients,
        instructions: instructions,
        author: author
    };
    
    Recipe.create(newRecipe, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/recipes")
        }
    });
    
});



// Show info of one recipe
router.get("/:id", function(req, res){
    // find the recipe with the provided ID
    var id = req.params.id;
    // populate Recipe with its comments from another Mongoose Schema
    Recipe.findById(id).populate("comments").exec(function(err, foundRecipe){
        if(err || !foundRecipe) {
            req.flash("error", "Recipe not found");
            res.redirect("/recipes")
        } else {
            res.render("recipes/show", {recipe: foundRecipe})
        }
    });
});


// EDIT Recipe route
router.get("/:id/edit", checkRecipeOwnership, function(req, res){
    Recipe.findById(req.params.id, function(err, foundRecipe){
        if(err || !foundRecipe) {
            req.flash("error", "Recipe not found");
            res.redirect("/recipes");
        } else {
            res.render("recipes/edit", {recipe: foundRecipe});
        }
        
    });
});

// UPDATE Recipe route
router.put("/:id", checkRecipeOwnership, function(req, res){
    //find and update correct recipe
    Recipe.findOneAndUpdate({_id: req.params.id}, req.body.recipe, function(err, updatedRecipe){
        if(err || !updatedRecipe){
            res.redirect("/recipes");
        } else {
            req.flash("success", "Successfully updated recipe");
            res.redirect(`/recipes/${updatedRecipe._id}`);
        }
    });
});

// DESTROY Recipe route
router.delete("/:id", checkRecipeOwnership, function(req, res) {
    Recipe.findOneAndDelete({_id: req.params.id}, function(err){
        if(err){
            res.redirect("/recipes");
        } else {
            req.flash("success", "Successfully deleted recipe");
            res.redirect("/recipes");
        }
    });
});
module.exports = router;