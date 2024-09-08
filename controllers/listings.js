const Listing = require("../models/listing");

module.exports.index=async function(req,res)
{
    let type="All";
    const allListings = await Listing.find().populate('owner', 'username');
    res.render("listings/index.ejs",{allListings,type});
};


module.exports.rent=async function(req,res)
{
    let type="Rent";
    const allListings = await Listing.find({type:"rent"}).populate('owner', 'username');
    res.render("listings/index.ejs",{allListings,type});
};
module.exports.buy=async function(req,res)
{
    let type="Buy";
    const allListings = await Listing.find({type:"buy"}).populate('owner', 'username');
    res.render("listings/index.ejs",{allListings,type});
};
module.exports.renderNewForm=(req,res)=>
    {
        
        res.render("listings/new.ejs");
    };
 

module.exports.showListing=async function(req,res)
{
    let {id}=req.params;
    let listing=await Listing.findById(id).
    populate({
        path:"reviews",
        populate:{
            path:"author"
        }
    })
    .populate("owner");
    if(!listing)
    {
        req.flash("error","Listing you requested for does not exist")
        res.redirect("/listings")
    }
  
  let  currUserId=res.locals.currUser._id
    
    res.render("listings/show.ejs",{listing,currUserId});
};


module.exports.createListing=async function(req,res){
    let url = req.file.path;
    let filename = req.file.filename;


    let listing =req.body.listing;
    let newlisting = new Listing(listing);
    newlisting.image={url,filename};
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success","New Listing Created");
    res.redirect('/listings');

};

module.exports.renderEditForm=async function(req,res)
{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing)
        {
            req.flash("error","Listing you requested for does not exist")
            res.redirect("/listings")
        }
        let originalImageurl=listing.image.url;
     originalImageurl= originalImageurl.replace("/upload","/upload/w_2560");

    res.render("listings/edit.ejs",{listing,originalImageurl});
};

module.exports.updateListing=async function(req,res)
{
    
    let {id}=req.params;
    
   let listing =await Listing.findByIdAndUpdate(id,{...req.body.listing});
 
   if(typeof req.file!="undefined")
   {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image={url,filename};
    await listing.save();
   }
    req.flash("success","Listing updated");
     res.redirect(`/listings/${id}`);
};

module.exports.destroyListing=async function(req,res,next){
      
    let {id}=req.params;
  Listing.findByIdAndDelete(id)
  .then(()=>console.log("deleted succesfully"))
  .catch((err)=>console.log(err));

  req.flash("success","Listing Delete");
  res.redirect("/listings");
  
};

