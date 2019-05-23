var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var PORT = process.env.PORT || 5000;
var IP = process.env.IP || '127.0.0.1';

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var recipes = [
        {
            name: "Over Easy Eggs", 
            image: "https://images.unsplash.com/photo-1554781026-44b3a8bf6f11?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "Runny yolk, cooked whites, Mmmmm..."
        },
        {
            name: "Soft-Boiled Eggs", 
            image: "https://images.unsplash.com/photo-1529570634977-ec042420117b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "The perfect breakfast meal."
        },
        {
            name: "Sunny-Side Up Eggs", 
            image: "https://images.unsplash.com/photo-1521513919009-be90ad555598?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
            description: "Simple. Showcases the beauty of the egg yolk."
        }
    ];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/recipes", function(req, res) {
    res.render("recipes", {recipes: recipes});
});

app.post("/recipes", function(req, res) {
    // get data from form and add to campgrounds array
    //redirect to campgrounds page
    
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description
    var newRecipe = {
        name: name,
        image: image,
        description: description
    };
    recipes.push(newRecipe);
    res.redirect("/recipes");
});

app.get("/recipes/new", function(req, res) {
   res.render("new") 
});


app.listen(PORT, IP, function() {
    console.log("RecipeApp server has started.");
})