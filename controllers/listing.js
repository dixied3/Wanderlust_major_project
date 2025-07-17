const Listing = require("../models/listing") ; 
const {listingSchema , reviewSchema} = require("../schema.js") ; 
const ExpressError = require("../utils/ExpressError.js") ; 
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN ; 
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async(req , res) => {
    const allListings = await Listing.find({}) ; 
    res.render("listings/index.ejs" , {allListings}) ; 
} ; 

module.exports.renderNewForm = (req , res) => {
    res.render("listings/new.ejs") ; 
} ; 

module.exports.showListing = async(req , res) => {
    let {id} = req.params ; 
    let listing = await Listing.findById(id).populate({path : "reviews" , populate : {path : "author"}}).populate("owner") ; 

    if(!listing) {
        req.flash("error" , "Listing does not exist") ; 
        res.redirect("/listings") ; 
    }
    else {
        console.log(listing) ; 
        res.render("listings/show.ejs" , {listing}) ; 
    }
} ; 


module.exports.createListing = async(req , res , next) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1 //if we enter a location then we can get 2 guesses of that assocoated coordinated ....max limit is 5  (1 object in res.body.features)
      })
        .send() ; 

    

    let url = req.file.path ; 
    let filename =  req.file.filename ;
    let result = listingSchema.validate(req.body) ; //whatever we define in joi schema is my req.bodysatisfying all thoese conditions ? 
    console.log(`url : ${url} .... filename : `)
    console.log(result) ;
    if(result.error) {
        throw new ExpressError(400 , result.error) ; 
    } 
    let newListing = new Listing(req.body.listing) ; 
    // console.log(req.body.listing) ;
    newListing.owner = req.user._id;
    newListing.image = {url , filename} ; 
    newListing.geometry = response.body.features[0].geometry ; 
    let savedlisting = await newListing.save() ; 
    console.log(savedlisting) ; 
    req.flash("success" , "New listing added successfully..!")
    res.redirect("/listings") ; 
    
} ; 

module.exports.renderEditForm = async(req , res) => {
    let {id} = req.params ; 
    let listingToBeEdited = await Listing.findById(id) ; 
    if(!listingToBeEdited) {
        req.flash("error" , "Listing does not exist") ; 
        res.redirect("/listings") ; 
    } ; 

    let originalImageUrl = listingToBeEdited.image.url ; 
    originalImageUrl = originalImageUrl.replace("/upload" , "/upload/h_300/w_250") ; 


    res.render("listings/edit.ejs" , {listing : listingToBeEdited , originalImageUrl}) ;  
} ; 

module.exports.updateListing = async(req , res) => {
    // let {id} = req.params ;

    // // FIX: Add 'await' here!
    // let listing = await Listing.findById(id) ;


    // let url = req.file.path ; 
    // let filename =  req.file.filename ;
    // listing.image = {url , filename} ;
    // // Optional: Add a check if the listing was found at all
    // if (!listing) {
    //     req.flash("error", "Listing not found.");
    //     return res.redirect("/listings"); // Redirect to listings index if not found
    // }


    // await Listing.findByIdAndUpdate(id , {...req.body.listing}) ;
    // req.flash("success" , "Listing updated") ;
    // res.redirect(`/listings/${id}`) ;
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate (id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save() ; 
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
} ; 

module.exports.deleteListing = async(req , res) => {
    let {id} = req.params ;
    // let deleteListing = await Listing.findByIdAndDelete(id) ; 

    let listing = await Listing.findById(id) ;

    // Optional: Add a check if the listing was found at all
    if (!listing) {
        req.flash("error", "Listing not found.");
        return res.redirect("/listings"); // Redirect to listings index if not found
    }

  

    console.log(listing) ; 
    await Listing.findByIdAndDelete(id) ;
    req.flash("success" , "Listing deleted...!!")
    res.redirect("/listings") ; 
} ; 