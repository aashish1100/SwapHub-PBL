

const mail=require("../mail.js");
const Listing = require("../models/listing.js")

module.exports.renderBookForm=async(req,res)=>
    {
        let date = new Date(Date.now());
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed, so add 1
        const day = date.getDate().toString().padStart(2, '0');
        // Combine into a formatted date string
        const formattedDate = `${day}-${month}-${year}`;
        let {id}=req.params;
        const allListings = await Listing.find().populate('owner', 'username');
        let type = "rent";
        let listing = await Listing.findById(id);
       res.render("listings/index.ejs",{listing,formattedDate,allListings,type});
    }
 
    module.exports.renderBuyForm=async(req,res)=>
    {
        let {id}=req.params;
        const allListings = await Listing.find().populate('owner', 'username');
        let type = "buy";
        let listing = await Listing.findById(id);
       res.render("listings/index.ejs",{listing,allListings,type});
    }

module.exports.sendEmail=async(req,res)=>
    {
        let {id}=req.params;
        let listing = await Listing.findById(id).populate("owner");
        try{
            if(listing.type=='rent')
            {
                mail.sendRentText(listing,req.body);
            }
            else
            {
            
                mail.sendBuyText(listing,req.body);
        }

            req.flash("success","email sent successfully");
        }
        catch(e)
        {
            req.flash('error',`Error sending email:, ${e.message}`)
        }
        res.redirect("/listings");
    }
