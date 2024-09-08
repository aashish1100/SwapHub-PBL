
const Listing = require("../models/listing");
module.exports.renderSearch=async (req, res) => {
    try {
        const query = req.query.query;
        if (!query) {
            req.flash("error","Search query is required");
            return res.redirect('/listings');
        }

        // Perform the search using a regex to match the query with fields in the database
        const allListings = await Listing.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },          // Case-insensitive search in title
                { description: { $regex: query, $options: 'i' } },    // Case-insensitive search in description
                { college: { $regex: query, $options: 'i' } },        // Case-insensitive search in college
                { location: { $regex: query, $options: 'i' } }        // Case-insensitive search in location
            ]
        });
        if(!allListings)
        {   
            req.flash("success","No product availabe with searched name");
            return redirect('/listings');
        }

        // Render the search results page
        type='Search'
        res.render('listings/index', { allListings,type});
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

