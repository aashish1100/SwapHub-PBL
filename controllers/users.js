
const crypto = require('crypto');
const Listing = require("../models/listing.js")
const User = require('../models/user');
const mail=require("../mail.js");
const { any } = require('joi');
const temp = require("./utils/emailWorker.js")

const path = require('path');



const { fork } = require('child_process');

function sendEmailInChildProcess(type, user, token) {
  const child = fork(path.join(__dirname, 'utils', 'emailWorker.js'));

  child.send({ type, user, token });

  child.on('exit', (code) => {
    console.log(`Email child process exited with code ${code}`);
  });

  child.on('error', (err) => {
    console.error('Email process error:', err);
  });
}

module.exports.renderSignupForm=async(req,res)=>
{
    const allListings = await Listing.find().populate('owner', 'username');
    let type = "signup";
    res.render("listings/index",{allListings,type});
};

module.exports.signup = async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        
        // Check if a user with the given email already exists
        let user = await User.findOne({ email });
        if (user) {
            req.flash("error", "A user with this email already exists");
            return res.redirect("/login");
        }

        // Create a new user instance
        const newUser = new User({ email, username });

        // Generate a verification token
        const token = crypto.randomBytes(32).toString('hex');
        newUser.verificationToken = token;

        // Save the new user to the database
        const registeredUser=await User.register(newUser,password);

        // Send the verification email
        // mail.sendVerificationEmail(newUser, token);

 
sendEmailInChildProcess('verification', newUser, token);



        // Flash success message and redirect
        req.flash("success", "Please verify your email");
        return res.redirect("/listings"); // Redirect to login page after signup

    } catch (e) {
        
        // Handle errors
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm=async(req,res)=>
    {
        const allListings = await Listing.find().populate('owner', 'username');
        let type = "login";
        res.render("listings/index",{allListings,type});
    };    
 

    

module.exports.login=async(req,res)=>
    {
       if(!req.user)
       {
        req.flash("error","user Not found");
        return res.redirect("/login");
       }
       try
       {
       
                req.flash("success","welcome to SwapHub");
                res.redirect("/listings");
       }
       catch(err)
       {
        req.flash('error', 'An error occurred while checking verification status.');
        return res.redirect('/login');
       }
    };
    
 
 module.exports.logout =(req,res,next)=>
    {
        req.logout((err)=>
        {
            if(err)
            {
               return  next(err);
            }
            req.flash("success","you are logged out");
            res.redirect("/listings");
        })
    };


    module.exports.verifyemail=async (req, res) => {
        const { token } = req.query;
    
        if (!token) {
             req.flash("error","Token is requires to verify");
            return res.redirect("/listings");
        }
    
        try {
            // Find the user with the matching verification token
            const user = await User.findOne({ verificationToken: token });
            if (!user) 
            {
              req.flash("error","invalid Token");
              return res.redirect("/listings");
            }
    
            // Mark user as verified
            user.isVerified = true;
            user.verificationToken = null; // Clear the token after verification
            await user.save();
            
            req.login(user,(err)=>
             {
                  if(err){
                       return next(err);
                   }
                 req.flash("success","verifed Successfully, welcome to SwapHub");
                 res.redirect("/listings");
             })
        
        } catch (err) {
            res.status(500).send('An error occurred during verification.');
        }
    }


module.exports.renderForgetForm=async(req,res)=>
    {
        const allListings = await Listing.find().populate('owner', 'username');
        let type = "forget";
        res.render("listings/index",{allListings,type});
    };

module.exports.forget=async (req,res)=>
    {
         let {email}=req.body;
         let user = await User.findOne({email});
         if(!user)
         {
              req.flash("error","User not existed with this email create new account");
              return res.redirect("/signup");
         }
    
         const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; 
    
        await user.save();
        // mail.sendResetPasswordEmail(user,token);
        sendEmailInChildProcess('reset', user, token);
        req.flash("success",`An email has been sent to ' ${user.email} ' with further instructions.`)
        res.redirect("/forget");
    };



module.exports.renderResetForm=async(req,res)=>{
    

        let {token}=req.query;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    })

    if(!user)
    {
        req.flash("error","Password reset token is invalid");
        return res.redirect("/forget");
    }
    
    const allListings = await Listing.find().populate('owner', 'username');
    let type = "reset";
    res.render("listings/index",{allListings,type,token});
    
    
}

module.exports.reset=async (req,res)=>
{
    try{
        let {password1}=req.body;
    let {token}=req.params;
    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }  // Check that the token is not expired
      });

     if(!user)
     {
        req.flash("error","Password reset token is invalid or has expierd");
        return redirect("/login");
     }
     await user.setPassword(password1);
        
     user.resetPasswordToken = undefined;
     user.resetPasswordExpires = undefined;
 
     await user.save();
      req.flash("success","password chnanges successfully");
    }
    catch(err)
    {
        console.log(err);
    }
     res.redirect('/login');

} 

