var mongoose = require("mongoose");


var commentSchema = mongoose.Schema({
    text: String,
    author: String
});

// export model
module.exports = mongoose.model("Comment", commentSchema);