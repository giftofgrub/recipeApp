var mongoose = require("mongoose");


//SCHEMA Set-up
var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    ingredients: String,
    instructions: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

// export model
module.exports = mongoose.model("Recipe", recipeSchema);