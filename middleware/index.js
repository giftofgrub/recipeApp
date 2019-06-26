var Recipe = require("../models/recipe");
var Comment = require("../models/comment");

// all middleware goes here
var middlewareObj = {};

middlewareObj.checkRecipeOwnership = function(req, res, next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Recipe.findById(req.params.id, function(err, foundRecipe){
            if(err || !foundRecipe){
                req.flash("error", "Recipe not found");
                res.redirect("/recipes");
            } else {
                 //does user own the recipe?
                if(foundRecipe.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You do not have permission to do that")
                    res.redirect(`/recipes/${req.params.id}`);
                }
                
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    //is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect(`/recipes/${req.params.id}`);
            } else {
                 //does user own the comment?
                if(foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "You do not have permission to do that");
                    res.redirect(`/recipes/${req.params.id}`);
                }
                
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("/login");
    }
}


module.exports = middlewareObj;