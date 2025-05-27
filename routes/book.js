const express = require('express');
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing");
const { isLoggedIn } = require('../midleware');
const bookController = require("../controllers/book");


router.get("/buy",isLoggedIn,bookController.renderBuyForm);
router.get("/rent",isLoggedIn,bookController.renderBookForm);
router.post('/',isLoggedIn,bookController.sendEmail);


module.exports=router;



// routes
