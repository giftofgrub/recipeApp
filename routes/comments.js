var express = require("express");
var router = express.Router({ mergeParams:true });
var Recipe = require("../models/recipe");
var Comment = require("../models/comment");
var { isLoggedIn, checkCommentOwnership } = require("../middleware");
//==========================================
//    Comments Routes
//==========================================

// show new comment form
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

// post new comment
router.post("/", isLoggedIn, function(req, res){
    //lookup recipe using ID
    Recipe.findById(req.params.id, function(err, recipe){
        if(err){
            req.flash("error", "Recipe not found");
            res.redirect("/recipes");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and Obj id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //add comment to recipe
                    recipe.comments.push(comment);
                    recipe.save();
                    req.flash("success", "Successfully added comment")
                    res.redirect((`/recipes/${recipe._id}`))
                }
            })
        }
    });
    
});

// show comment edit form
router.get("/:comment_id/edit", isLoggedIn, function(req, res){
    Recipe.findOne({_id: req.params.id}, function(err, foundRecipe){
        if(err || !foundRecipe){
            req.flash("error", "Recipe not found");
            res.redirect("/recipes");
        } else {
            Comment.findOne({_id: req.params.comment_id}, function(err, foundComment){
                if(err || !foundComment){
                    req.flash("error", "Comment not found");
                    res.redirect(`recipes/${req.params.id}`);
                } else {
                    res.render("comments/edit", {recipe_id: req.params.id, comment: foundComment});
                }
            });
        }
    });
});

// comment UPDATE logic
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findOneAndUpdate({_id: req.params.comment_id}, req.body.comment, function(err, updatedComment){
        if(err) {
            res.redirect("/recipes");
        } else {
            req.flash("success", "Successfully updated comment");
            res.redirect(`/recipes/${req.params.id}`);
        }
    });
});

//comment DESTROY route
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findOneAndDelete({_id: req.params.comment_id}, function(err){
        if(err){
            res.redirect("/recipes");
        } else {
            req.flash("success", "Successfully deleted comment");
            res.redirect(`/recipes/${req.params.id}`);
        }
    });
});


module.exports = router;

