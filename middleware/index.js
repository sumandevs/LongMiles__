const Tour          = require("../models/familyTours");
const Trekking      = require("../models/trekkingGrounds");
const Comment       = require("../models/comment");
const middlewareObj = {};

middlewareObj.checkTrekkingOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Trekking.findById(req.params.id, function(err,foundTrekk){
            if(err && !foundTrekk){
                req.flash("error", "Trekking activity not found!");
                res.redirect("back");
            } else{
                if(foundTrekk.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("/login");
    } 
}

middlewareObj.checkTourOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Tour.findById(req.params.id, function(err,foundTour){
            if(err && !foundTour){
                req.flash("error", "Tour activity not found!");
                res.redirect("back");
            } else{
                if(foundTour.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("/login");
    }    
}

middlewareObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if(err && !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You dont have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.")
        res.redirect("/login");
    }    
}

middlewareObj.isLoggedIn = function (req,res,next){
    if(req.isAuthenticated()){
        return next();
    } 
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}


module.exports = middlewareObj;