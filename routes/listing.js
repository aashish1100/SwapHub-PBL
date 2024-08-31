const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../midleware.js");
const listingController=require("../controllers/listings.js");
const {storage}=require("../cloudConfig.js")

const multer = require('multer');
const upload = multer({storage})

router
    .route("/")
    .get(wrapAsync(listingController.index)) //index route
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing));//Create route
    

// new route 
router.get("/new",isLoggedIn,listingController.renderNewForm);
router.get("/rent",listingController.rent);
router.get("/buy",listingController.buy);

router
     .route("/:id")
     .get(wrapAsync(listingController.showListing))
     .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing))
     .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



    


// edit route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));




module.exports = router;