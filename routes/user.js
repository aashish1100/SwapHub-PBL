const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirctlUrl } = require('../midleware.js');

const userController = require("../controllers/users.js");
router
     .route("/signup")
     .get(userController.renderSignupForm)
     .post(wrapAsync(userController.signup));

router
     .route("/login")     
     .get(userController.renderLoginForm)
     .post(saveRedirctlUrl,
          passport.authenticate("local",
               {failureRedirect:"/login" ,
                failureFlash:true}),
           userController.login );

router.get("/logout",userController.logout);

router.get('/verify-email', userController.verifyemail);

router.route("/forget")
       .get(userController.renderForgetForm)
       .post(userController.forget);

router.get("/reset",userController.renderResetForm);
router.post("/reset/:token",userController.reset);

module.exports=router;
