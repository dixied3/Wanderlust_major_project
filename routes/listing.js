if(process.env.NODE_ENV != "production"){
    require("dotenv").config() ; 
}

const express = require("express") ; 
const router = express.Router({mergeParams : true}); 


const Listing = require("../models/listing.js") ; 
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js") ; 
const {listingSchema , reviewSchema} = require("../schema.js") ; 
const {isLoggedIn , isOwner , validateListing} = require("../middleware.js") ; 
const listingController = require("../controllers/listing.js") ; 
const {storage} = require("../clodConfig.js") ; 
const multer = require("multer") ; //to parse multipart form data 
const upload = multer({storage}) ; //multer will create a folder called uploads and store images over there

router
    .route("/")
    .get(wrapAsync(listingController.index)) 
    .post(isLoggedIn , upload.single("listing[image]") , validateListing , wrapAsync(listingController.createListing)) ; 

//New listing form
router.get("/new" , isLoggedIn , listingController.renderNewForm) ; 


//Show route
router.get("/:id" , wrapAsync(listingController.showListing)) ; 

// edit listing
router.get("/:id/edit" , isLoggedIn , isOwner , wrapAsync(listingController.renderEditForm)) ; 

router
    .route("/:id")
    .put(isLoggedIn , isOwner , upload.single("listing[image]") , validateListing , wrapAsync(listingController.updateListing))  
    .delete(isLoggedIn , isOwner ,  wrapAsync(listingController.deleteListing))


module.exports = router ; 