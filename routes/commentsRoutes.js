const express  = require("express");
const router   = express.Router();
const Comment  = require("../models/comment");
const Trekking = require("../models/trekkingGrounds");
const Tour     = require("../models/familyTours");
const middlewareObj = require("../middleware");

//======================================================================
// COMMENT Route -- For TREKKING MODEL
 //new comment - GET
router.get("/trekkings/:id/comments/new", middlewareObj.isLoggedIn, (req,res) => {
    Trekking.findById(req.params.id, function(err,foundTrekk){
        if(err && !foundTrekk){
            req.flash("error","Something went wrong!");
            res.redirect("back");
        } else {
            res.render("comments/newTrekComment",{foundTrekk: foundTrekk});
        }
    });
    
});
 //create comment - POST
router.post("/trekkings/:id/comments", middlewareObj.isLoggedIn, (req,res) => {
    Trekking.findById(req.params.id, function(err,trekk){
        if(err){
            console.log(err);
        } else {
                let newComment = req.body.newComment;
                Comment.create(newComment, function(err,createdComment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to Comment Model
                    createdComment.author.id       = req.user._id;
                    createdComment.author.username = req.user.username;
                    //save comment
                    createdComment.save();
                    // console.log(createdComment);
                    trekk.comments.push(createdComment);
                    trekk.save();
                    req.flash("success", "Comment has been added successfully");
                    res.redirect("/activities/trekkings/" + trekk._id);
                }
            });
        }
    });
});


//======================================================================
 //COMMENT ROUTE -- For TOURS MODEL
  //new comment - GET 
router.get("/tours/:id/comments/new", middlewareObj.isLoggedIn, (req,res) => {
    Tour.findById(req.params.id, function(err, foundTour) {
        if(err && !foundTour){
            req.flash("error","Something went wrong!");
            res.redirect("back");
        } else {
            res.render("comments/newTourComment", {foundTour: foundTour});
        }
    });
});
 //create a comment - POST
router.post("/tours/:id/comments", middlewareObj.isLoggedIn, (req,res) => {
    Tour.findById(req.params.id, function(err,tour){
        if(err){
            console.log(err);
        } else {
            let newComment = req.body.newComment;
            Comment.create(newComment, function(err,createdComment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to Comment Model
                    createdComment.author.id       = req.user._id;
                    createdComment.author.username = req.user.username;
                    //save comment
                    createdComment.save();
                    tour.comments.push(createdComment);
                    tour.save();
                    req.flash("success", "Comment has been added successfully");
                    res.redirect("/activities/tours/" + tour._id);
                }
            });
        }
    });
});

//=============================== EDIT UPDATE & DELETE - TREKKings model========

 //Edit Comment
router.get("/trekkings/:id/comments/:comment_id/edit", middlewareObj.checkCommentOwnership, (req,res) => {
    Trekking.findById(req.params.id, function(err,foundTrekk){
        if(err && !foundTrekk){
            req.flash("error", "Trekking activity not found!");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err,foundComment){
               if(err){
                   res.redirect("back");
               } else {
                   res.render("comments/editTrekkComment", {campground_id: req.params.id, comment: foundComment});
               }
           });
        }
    });
   
});

 //UPDATE Comment
router.put("/trekkings/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.newComment, function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been updated successfully");
            res.redirect("/activities/trekkings/" + req.params.id);
        }
    });
});

//=============================== EDIT UPDATE & DELETE - TOUR model=============

 //Edit Comment
router.get("/tours/:id/comments/:comment_id/edit", middlewareObj.checkCommentOwnership, (req,res) => {
    Tour.findById(req.params.id, function(err,foundTour){
        if(err && !foundTour){
            req.flash("error", "Tour activity not found!");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err,foundComment){
               if(err){
                   res.redirect("back");
               } else {
                   res.render("comments/editTourComment", {campground_id: req.params.id, comment: foundComment});
               }
           });
        }
    });
   
});

 //UPDATE Comment
router.put("/tours/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.newComment, function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been updated successfully");
            res.redirect("/activities/tours/" + req.params.id);
        }
    });
});

//=============================== DELETE COMMENTS ================================
//Trekk comments
router.delete("/trekkings/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been deleted!");
            res.redirect("/activities/trekkings/" + req.params.id);
        } 
    });
});

//Tour comments
router.delete("/tours/:id/comments/:comment_id", middlewareObj.checkCommentOwnership, (req,res) => {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment has been deleted!");
            res.redirect("/activities/tours/" + req.params.id);
        } 
    });
});
//========================== Middleware ===========================================

module.exports = router;