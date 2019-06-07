var express = require("express");
var router = express.Router({ mergeParams:true });
var Recipe = require("../models/recipe");
var Comment = require("../models/comment");
//==========================================
//    Comments Routes
//==========================================

router.get("/new", isLoggedIn, function(req, res){
    // find recipe by id
    Recipe.findById(req.params.id, function(err, recipe){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {recipe: recipe});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
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

// middleware
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}

module.exports = router;

