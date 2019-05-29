var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"), 
    PORT = process.env.PORT || 5000,
    IP = process.env.IP || '127.0.0.1';

mongoose.connect("mongodb://localhost/recipeapp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA Set-up
var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    ingredients: String,
    instructions: String
});

var Recipe = mongoose.model("Recipe", recipeSchema);

// var recipes = [
//         {
//             name: "Over Easy Eggs", 
//             image: "https://images.unsplash.com/photo-1554781026-44b3a8bf6f11?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//             description: "Runny yolk, cooked whites, Mmmmm..."
//         },
//         {
//             name: "Soft-Boiled Eggs", 
//             image: "https://images.unsplash.com/photo-1529570634977-ec042420117b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//             description: "The perfect breakfast meal."
//         },
//         {
//             name: "Sunny-Side Up Eggs", 
//             image: "https://images.unsplash.com/photo-1521513919009-be90ad555598?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//             description: "Simple. Showcases the beauty of the egg yolk."
//         }
//     ];

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

// Show info on one recipe
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