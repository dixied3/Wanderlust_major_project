const mongoose = require('mongoose') ; 
const initData = require("./data") ; 
const Listing = require("../models/listing.js") ; 

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" ; 

main()
    .then(() => {
        console.log("Connected to Mongodb") ; 
    })
    .catch(err => console.log(err)) ; 

async function main () {
    await mongoose.connect(MONGO_URL) ; 
}


const initDB = async() => {
    await Listing.deleteMany({}) ; 
    initData.data = initData.data.map((obj) => ({...obj , owner : "686ca67d88fe10ad8365c0a8" })) ; 
    await Listing.insertMany(initData.data) ; 
    console.log("Data was initialized") ; 
}

initDB() ; 