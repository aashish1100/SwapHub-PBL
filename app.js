if(process.env.NODE_ENV!='production')
{
    require("dotenv").config();
}

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require("mongoose");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const session = require("express-session");
const MongoStore=require("connect-mongo");
const flash = require("connect-flash");
const passport=require("passport");

const LocalStrategy=require("passport-local");
const User = require("./models/user.js");

const listingRouter= require("./routes/listing.js")
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")
const bookRouter = require("./routes/book.js")
const searchRouter=require("./routes/search.js");
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);
//ejs path setiing
const path = require('path');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({extended:true}));//very img 
app.use(express.static(path.join(__dirname,'/public')));

//database connection
// const mongourl="mongodb://127.0.0.1:27017"

const dbUrl = process.env.ATLASDB_URL;
async function main()
{
    await mongoose.connect(dbUrl);
}

main()
.then(()=> console.log("connected to db"))
 .catch((err)=>console.log(err));


 const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",(err)=>
{
    console.log("error in monog session store",err);
})
const sessionOptions = {
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:
    {
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}


// update old data
// async function addIsVerifiedField() {
//     try {
//       // Update all users, setting `isVerified` to true
//       await User.updateMany({}, { $set: { isVerified: true } });
  
//       console.log("Updated all users with isVerified: true");
//       mongoose.connection.close();
//     } catch (error) {
//       console.error("Error updating users: ", error);
//       mongoose.connection.close();
//     }

//     console.log("success");
//   }
  
//   addIsVerifiedField();



// app.get("/",(req,res)=>
// {
//     res.send("hi i am root");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
require('./midleware.js');
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>
{
    res.locals.success=req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser=req.user;
    next();
})



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use('/listings/:id/book',bookRouter);
app.use("/",userRouter) ;
app.use("/",searchRouter);

app.all("*",(req,res,next)=>
{

    next(new ExpressError(404,"page not Found"));
})

app.use((err,req,res,next)=>
{
    let {statusCode=505,message="Unknown Error"}=err;
    res.status(statusCode).render('error.ejs',{err});
    // res.status(statuscode).send(message);
})

app.listen(port,()=>{
    console.log("server is listening to port 8080");
})

