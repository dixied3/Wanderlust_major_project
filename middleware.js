const Listing = require("./models/listing") ; 
const Review = require("./models/review") ; 
const {listingSchema , reviewSchema} = require("./schema") ; 
const ExpressError = require("./utils/ExpressError") ; 

module.exports.isLoggedIn = (req , res , next) => {
    console.log(req.user) ; 
    if(!req.isAuthenticated()) {

        // y we storing info in session? ...because ye info to user related hai na ...ki VO USER KIDH JANA CHA RA THA 
        req.session.redirectUrl = req.originalUrl ; 
        req.flash("error" , "User not logged in") ; 
        res.redirect("/login") ; 
        return ; 
    }
    next() ; 
}

module.exports.saveRedirectUrl = (req , res , next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next() ; 
} ; 

module.exports.isOwner = async(req , res , next) => {
    let {id} = req.params ;

    // FIX: Add 'await' here!
    let listing = await Listing.findById(id) ;
    // Now, listing is the actual document, so you can safely access listing.owner._id
    if(res.locals.currUser && !listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You don't have the permission to edit this listing.") ;
        return res.redirect(`/listings/${id}`) ; // Use return to stop execution
    } 
    next() ; 
}

module.exports.validateListing = (req , res , next) => {
    let {error} = listingSchema.validate(req.body) ; 
     
    if(error) {
        // Collect all error messages into an array of strings
        let errMsg = error.details.map((el) => el.message);

        // Join the array of messages into a single string for your ExpressError
        let joinedErrMsg = errMsg.join(", "); // Join with a comma and space

        throw new ExpressError(400, joinedErrMsg)
    }
    else {
        next() ; 
    }
} ; 

module.exports.validateReview = (req , res , next) => {
    let {error} = reviewSchema.validate(req.body) ; 
    if (error) {
        // Collect all error messages into an array of strings
        let errMsg = error.details.map((el) => el.message);

        // Join the array of messages into a single string for your ExpressError
        let joinedErrMsg = errMsg.join(", "); // Join with a comma and space

        throw new ExpressError(400, joinedErrMsg)}
    else {
        next() ; 
    }
} ; 

module.exports.isReviewAuthor = async(req , res , next) => {
    let {id , reviewId} = req.params ; 
    let review = await Review.findById(reviewId) ; 
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this review") ;
        return res.redirect(`/listings/${id}`) ; // Use return to stop execution
    } 
    next() ; 
}