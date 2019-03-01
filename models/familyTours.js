const mongoose = require("mongoose");

 
//SCHEMA SETUP
const tourSchema = new mongoose.Schema({
    title: String,
    image: String,
    imageId: String,
    minimumMembers: Number,
    maximumMembers: Number,
    description: String,
    created: {type: Date, default: Date.now()},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }    
    ]
});

module.exports = mongoose.model("Tour",tourSchema); 
