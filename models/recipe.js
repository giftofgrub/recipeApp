var mongoose = require("mongoose");


//SCHEMA Set-up
var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    ingredients: String,
    instructions: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ],
    created : {
        type: Date,
        default: Date.now()
    }
});

// export model
module.exports = mongoose.model("Recipe", recipeSchema);