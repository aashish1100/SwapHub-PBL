const Review=require("../models/review");
const Listing = require("../models/listing");
module.exports.createReview=async (req,res)=>
    {
      let listing= await Listing.findById(req.params.id);
      let newreview = new Review(req.body.review);
      newreview.author = req.user._id
      listing.reviews.push(newreview);
      await newreview.save();
      await listing.save();
       req.flash('success',"new Review created");
       res.redirect(`/listings/${req.params.id}`);
    };

module.exports.destroyReview=async(req,res)=>
    {
       let {id ,reviewId}=req.params;
       await Listing.findByIdAndUpdate(id,{$pull:{ reviews:reviewId}})
       await Review.findByIdAndDelete(reviewId);
       req.flash("success","Review Deleted");
       res.redirect(`/listings/${id}`)
    };    