var mongoose = require("mongoose");
var Recipe = require("./models/recipe");
var Comment = require("./models/comment")



var data = [
        {
            name: "Over Easy Eggs", 
            image: "https://images.unsplash.com/photo-1554781026-44b3a8bf6f11?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "Runny yolk, cooked whites, Mmmmm...",
            ingredients: "Eggs, Butter",
            instructions: "Heat Pan\nPut Butter and spread it on the pan\nCook first side of egg\nFlip!\nCook other side of egg"
        },
        {
            name: "Soft-Boiled Eggs", 
            image: "https://images.unsplash.com/photo-1529570634977-ec042420117b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "The perfect breakfast meal.",
            ingredients: "Eggs\nWater\n more water",
            instructions: "Just Cook It!"
        },
        {
            name: "Sunny-Side Up Eggs", 
            image: "https://images.unsplash.com/photo-1521513919009-be90ad555598?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "Simple. Showcases the beauty of the egg yolk.",
            ingredients: "Eggs\nOil",
            instructions: "Just Cook It!"
        }
    ];


function seedDB(){
    // remove all recipes
    Recipe.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed recipes");
            // add a few recipes
            data.forEach(function(seed){
                Recipe.create(seed, function(err, recipe){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a recipe");
                        // create a comment
                        Comment.create(
                            {
                                text:"This recipe is great but I am hungry now.",
                                author: "Bob"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    recipe.comments.push(comment);
                                    recipe.save();
                                    console.log("created new comment");
                                }
                                
                            }
                        );
                    }
                });
            });
        }
    });
    
}

module.exports = seedDB;