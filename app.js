const express = require('express') ; 
const app = express() ; 
const mongoose = require("mongoose") ; 
const path = require("path") ; 
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate") ; 
const ExpressError = require("./utils/ExpressError.js") ; 
const session = require('express-session') ; 
const flash = require("connect-flash") ; 
const passport = require('passport') ; 
const LocalStrategy = require("passport-local") ; 
const User = require("./models/user.js") ; 
const MongoStore = require("connect-mongo") ; 


const listingRouter = require("./routes/listing.js") ; 
const reviewRouter = require("./routes/review.js") ; 
const userRouter = require("./routes/user.js") ; 

const dbUrl = process.env.MONGO_URL ; 

main()
    .then(() => {
        console.log("Connected to Mongodb") ; 
    })
    .catch(err => console.log(err)) ; 

async function main () {
    await mongoose.connect(dbUrl) ; 
}


app.set("view engine" , "ejs") ; 
app.set("views" , path.join(__dirname , "views")) ; 
app.use(express.urlencoded({extended : true})) ; 
app.use(methodOverride('_method'));
app.engine('ejs' , ejsMate) ; 
app.use(express.static(path.join(__dirname , "/public"))) ; 

const store = MongoStore.create({
    mongoUrl : dbUrl , 
    crypto : {
        secret : process.env.SECRET
    } , 
    touchAfter : 24 * 3600 
}) ; 

store.on("error" , () => {
    console.log("Error in mongostore" , err) ; 
})

const sessionOptions = {
    store , 
    secret : process.env.SECRET , 
    resave : false , 
    saveUninitialized : true , 
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000 , 
        maxAge : 7 * 24 * 60 * 60 * 1000 , 
        httpOnly : true 
    }
}



app.use(session(sessionOptions)) ; 
app.use(flash()) ; 


//initialization
app.use(passport.initialize()) ; //to implement passport in every request 
app.use(passport.session()) ; //identifies users...ki req. is cmin frmo same or diff. users 
passport.use(new LocalStrategy(User.authenticate())) ; 

passport.serializeUser(User.serializeUser()); //to store user info in the session 
passport.deserializeUser(User.deserializeUser()); //to delete user info in the session 


app.use((req , res , next) => {
    res.locals.success = req.flash("success") ; 
    res.locals.error = req.flash("error") ;
    //to make req.user accessible in ejs templates 
    res.locals.currUser = req.user ;  
    next() ; 
}) ; 

app.get("/", (req, res) => {
    res.redirect("/listings");
}) ; 


app.use("/listings" , listingRouter) ; 
app.use("/listings/:id/reviews" , reviewRouter) ; 
app.use("/" , userRouter) ; 


app.use((req , res , next) => {
    next(new ExpressError(404 , "Page Not Found")) ; 
})


// Error-handling middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    console.log(err) ; 
    res.status(statusCode).render("error.ejs" , {err}) ;
    // res.status(statusCode).send(message);
});



app.listen(8080 , () => {
    console.log("Listening to server 8080") ; 
})