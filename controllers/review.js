const Review = require("../models/review") ; 
const Listing = require("../models/listing") ;
const ExpressError = require("../utils/ExpressError")


module.exports.createReview = async(req ,res) => {
    let {id} = req.params ;
    let listing = await Listing.findById(req.params.id) ; 
    let newReview = new Review(req.body.review) ; 
    newReview.author = req.user._id ; 
    listing.reviews.push(newReview) ; 
    console.log(newReview) ; 
    await newReview.save() ; 
    await listing.save() ; 

    console.log("new review saved") ; 
    req.flash("success" , "New review added")
    res.redirect(`/listings/${id}`) ; 
} ; 

module.exports.destroyReview = async(req , res) => {
    let {id , reviewId} = req.params ; 
    await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}}) ; 
    let deletedReview = await Review.findByIdAndDelete(reviewId) ; 
    req.flash("success" , "Review Deleted")
    res.redirect(`/listings/${id}`) ; 
} ; 