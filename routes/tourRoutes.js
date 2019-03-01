const express  = require("express");
const router   = express.Router();
const Tour     = require("../models/familyTours");
const middlewareObj = require("../middleware");
//===========================
 //For Image Upload
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'sumandeveloping', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
//============================================================================


//familyTour routes
  //New Tours -GET
router.get("/new", (req,res) => {
    res.render("activities/newFamilyTour");
});

 //Create routes -POST -- add new tour to DB
router.post("/",  upload.single('image'), (req,res) => {
    cloudinary.v2.uploader.upload(req.file.path, function(err,result){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        }
        // add cloudinary url for the image to the campground object under image property
        req.body.tour.image   = result.secure_url;
        // add image's public_id to tour object
        req.body.tour.imageId = result.public_id;
        // add author to tour
        req.body.tour.author = {
            id: req.user._id,
            username: req.user.username
        };
        //creating family tours
        Tour.create(req.body.tour, function(err,newtour){
            if(err){
                req.flash("error",err.message);
                res.redirect("back");
            }
            else {
                req.flash("success", "A new tour activity has been added");
                res.redirect("/activities");
            }
        });
    });
});
//=================================================================


//SHOW Route -- showing a particular grounds.. 
 //TOURS...
router.get("/:id", (req,res) => {
    Tour.findById(req.params.id).populate("comments").exec(function(err,foundTour){
        if(err && !foundTour){
            req.flash("error", "Tour activity not found");
            res.redirect("back"); 
        } else{
            res.render("activities/showTour", {tour: foundTour});
        }
    });
});

// ============================== EDIT & UPDATE =========================================

 //EDIT TOURs..
router.get("/:id/edit", middlewareObj.checkTourOwnership, (req,res) => {
    Tour.findById(req.params.id, function(err,foundTour){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            res.render("activities/editTour", {tour: foundTour});
        }
    });
});
 //UPDATE TOURs..
router.put("/:id", upload.single('image'), middlewareObj.checkTourOwnership, (req,res) => {
    Tour.findById(req.params.id, async function(err,updatedTour){
        if(err && !updatedTour){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if(req.file){
                try{
                    await cloudinary.v2.uploader.destroy(updatedTour.imageId);
                    let result = await cloudinary.v2.uploader.upload(req.file.path);
                    updatedTour.imageId = result.public_id;
                    updatedTour.image   = result.secure_url;
                } catch(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
            }
            updatedTour.title = req.body.title;
            updatedTour.minimumMembers = req.body.minimumMembers;
            updatedTour.maximumMembers = req.body.maximumMembers;
            updatedTour.description = req.body.description;
            updatedTour.save();
            req.flash("success", "Tour activity successfully updated.");
            res.redirect("/activities/tours/" + req.params.id);
        }
    });
});

//=============================== DELETE TOUR ================================
router.delete("/:id", middlewareObj.checkTourOwnership, (req,res) =>{
    Tour.findByIdAndRemove(req.params.id, function(err){
        if(err){
             req.flash("error", err.message);
             res.redirect("back");
        } else {
            req.flash("success", "Tour activity has been deleted!");
            res.redirect("/activities");
        }
    });
});


module.exports = router;