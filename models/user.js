const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
//SCHEMA SETUP
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName : String,
    username : {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    password : String,
    avatar: String,
    streetNo: String,
    city: String,
    country: String,
    isAdmin: {type: Boolean, default: false}
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);