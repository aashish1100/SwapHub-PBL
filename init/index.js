const mongoose = require('mongoose');
const initData = require("./data.js")
const Listing = require("../models/listing.js")

 const mongourl = "mongodb://127.0.0.1:27017/SwapHub";

 async function main()
 {
    await mongoose.connect(mongourl);
 }

 main()
 .then(()=>console.log("db connected"))
 .catch((err)=>console.log(err));

 const inintdDB = async function()
 {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialize");
 }  

 inintdDB();