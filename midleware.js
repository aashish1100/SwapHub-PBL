const Listing = require('./models/listing')
const Review = require('./models/review')
const ExpressError = require('./utils/ExpressError.js')
const {listingSchema,reviewSchema}=require("./schema")
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const { func } = require('joi');

// At the top of your file
const loginAttempts = {}; // In-memory tracking object
const MAX_ATTEMPTS = 3;
const BLOCK_TIME = 15 * 60 * 1000; // 15 minutes

passport.use(new LocalStrategy(
  {
    usernameField: 'login',  // Field used for either username or email
    passwordField: 'password'
  },
  async function (login, password, done) {
    try {
      const key = login; // Can use email or username as key

      // Check if user is blocked
      const record = loginAttempts[key];
      const now = Date.now();

      if (record && record.count >= MAX_ATTEMPTS) {
        if (now - record.lastAttempt < BLOCK_TIME) {
          return done(null, false, {
            message: "Too many failed login attempts. Try again later."
          });
        } else {
          // Reset block after block time
          loginAttempts[key] = { count: 0, lastAttempt: now };
        }
      }

      // Check if login is an email or username
      const query = login.includes("@") ? { email: login } : { username: login };
      const user = await User.findOne(query);

      if (!user) {
        updateLoginAttempts(key);
        return done(null, false, { message: "Incorrect username or email." });
      }

      if (!user.isVerified) {
        updateLoginAttempts(key);
        return done(null, false, {
          message: "Please verify your account before logging in."
        });
      }

      // Authenticate the password using passport-local-mongoose method
      user.authenticate(password, (err, authenticatedUser, passwordError) => {
        if (err) return done(err);
        if (passwordError) {
          updateLoginAttempts(key);
          return done(null, false, { message: "Incorrect password." });
        }

        // ✅ Login successful → reset attempts
        if (loginAttempts[key]) {
          delete loginAttempts[key];
        }

        return done(null, authenticatedUser);
      });

    } catch (error) {
      return done(error);
    }
  }
));

// Utility function to update failed login attempts
function updateLoginAttempts(key) {
  const now = Date.now();
  if (!loginAttempts[key]) {
    loginAttempts[key] = { count: 1, lastAttempt: now };
  } else {
    loginAttempts[key].count += 1;
    loginAttempts[key].lastAttempt = now;
  }
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  }); 

module.exports=passport;

module.exports.isLoggedIn = (req,res,next)=>
{
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl=req.originalUrl;
            req.flash("error","You must be logged in");
        return  res.redirect("/login");
        }
        next();
}



module.exports.saveRedirctlUrl =(req,res,next)=>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner=async (req,res,next)=>
{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id))
    {
      req.flash("error","you are not the Owner of this Listing");
     return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next)=>
    {
        let {error} = listingSchema.validate(req.body);
        if(error)
        {
            throw new ExpressError(400,error);
        }
        else
        next();
    }



module.exports.validateReview = (req,res,next)=>
    {
        let {error} = reviewSchema.validate(req.body);
        if(error)
        {
            
            throw new ExpressError(400,error);
        }
        else
        next();
    }


    module.exports.isReviewAuthor=async (req,res,next)=>
        {
            let { id,reviewId}=req.params;
            let review = await Review.findById(reviewId);
            if(!review.author.equals(res.locals.currUser._id))
            {
              req.flash("error","you are not the Author of this Review");
             return  res.redirect(`/listings/${id}`);
            }
            next();
        }
