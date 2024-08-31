

const {getRentText,send,getBuyText}=require("../mail.js");
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
        let listing = await Listing.findById(id);
       res.render("book/rent.ejs",{listing,formattedDate});
    }
 
    module.exports.renderBuyForm=async(req,res)=>
    {
        let {id}=req.params;
        let listing = await Listing.findById(id);
        res.render("book/buy.ejs",{listing});
    }

module.exports.sendEmail=async(req,res)=>
    {
        let {id}=req.params;
        let {fromDate,toDate,name,number,message}=req.body;
        let listing = await Listing.findById(id).populate("owner");
        let {owner,title} = listing;
        let {email ,username}=owner;
        let subject;
        let text ;
        if(listing.type=='rent')
        {
            subject=`SwapHub Booking Request: ${listing.title} from ${fromDate} to ${toDate}`;
          text=getRentText(username,title,name,number,fromDate,toDate,message);
        }
        else
        {
             subject = `SwapHub Purchase Request: ${listing.title}`;
            text=getBuyText(username,title,name,number,message);
        }
        console.log(text);
        try{
            send(email,subject,text);
            req.flash("success","email sent successfully");
        }
        catch(e)
        {
            req.flash('error',`Error sending email:, ${e.message}`)
        }
        res.redirect("/listings");
    }
