const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type:String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,  // Default to false until the email is verified
    },
    verificationToken: String, 
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);
