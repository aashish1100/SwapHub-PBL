const Listing = require("../models/listing");

const cache = require("../cache"); // node-cache instance
const lruCache=require("../lruCache")

module.exports.index = async function(req, res) {
  let type = "All";

  // Try to get data from cache
  let allListings = cache.get('allListings');

  if (!allListings) {  // Cache miss
    console.log('⏳ Cache Miss: index');
    
    // Fetch data and convert to plain JS object with lean()
    allListings = await Listing.find().populate('owner', 'username').lean();

    // Set cache with TTL of 100 seconds (100000 ms)
    cache.put('allListings', allListings, 100000);
  } else {
    console.log('✅ Cache Hit: index');
  }

  res.render('listings/index.ejs', { allListings, type });
};



module.exports.rent = async function(req, res) {
  let type = "Rent";

  // Try to get cached rent listings
  let allListings = cache.get('rentListings');

  if (!allListings) {  // Cache miss
    console.log('⏳ Cache Miss: rent');

    allListings = await Listing.find({ type: "rent" })
      .populate('owner', 'username')
      .lean();

    // Set cache with TTL of 100 seconds
    cache.put('rentListings', allListings, 100000);
  } else {
    console.log('✅ Cache Hit: rent');
  }

  res.render("listings/index.ejs", { allListings, type });
};


module.exports.buy = async function(req, res) {
  let type = "Buy";

  // Try to get cached buy listings
  let allListings = cache.get('buyListings');

  if (!allListings) {  // Cache miss
    console.log('⏳ Cache Miss: buy');

    allListings = await Listing.find({ type: "buy" })
      .populate('owner', 'username')
      .lean();

    // Set cache with TTL of 100 seconds (100000 ms)
    cache.put('buyListings', allListings, 100000);
  } else {
    console.log('✅ Cache Hit: buy');
  }

  res.render("listings/index.ejs", { allListings, type });
};

module.exports.renderNewForm=(req,res)=>
    {
        
        res.render("listings/new.ejs");
    };
 

module.exports.showListing = async function(req, res) {
  const { id } = req.params;

  // 🧠 Check LRU cache first
  let listing = lruCache.get(id);

  if (!listing) {
    console.log("⏳ Cache Miss: listing", id);

    listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author"
        }
      })
      .populate("owner")
      .lean(); // lean makes it lighter for caching

    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      return res.redirect("/listings");
    }

    lruCache.set(id, listing); // ✅ Cache this listing
  } else {
    console.log("✅ Cache Hit: listing", id);
  }

  const currUserId = res.locals.currUser?._id || null;

  res.render("listings/show.ejs", { listing, currUserId });
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

