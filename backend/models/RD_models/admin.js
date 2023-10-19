const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const adminSchema = new mongoose.Schema({

    adminName: {
        type : String,
        required: [true, "Admin Name is required!"],
        maxlength: [50, "Admin Name should be less than 50 characters!"],
        trim: true,
        
    },
    
    email: {
        type: String,
        trim: true,
        maxlength: [100, "Email should be less than 100 characters!"],
        validate: {
          validator: (value) => {
            return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              value
            );
          },
          message: "Invalid email address!",
        },
    },

    pwd: {
      type: String,
      trim: true,
      minlength: [6, "Password should be more than 6 characters!"],
  },

  
    NIC: {
    type: String,
    trim: true,
    minlength: [6, "NIC should be more than 20 characters!"],
  },

    phone: {
        type: String,
        trim: true,
        maxlength: [10, "Phone Number should be less than 10 characters!"],
        validate: {
          validator: (value) => {
            return /^[0-9]{10}$/.test(value);
          },
          message: "Invalid phone number!",
        },
      },
      tokens: [
        {
        token: {
            type: String,
            required: true,
        },
        },
    ],   
},  {timestamps:true});

// @Action - encrypt the password
adminSchema.pre('save', async function(next){
    if(!this.isModified("pwd")){
        next();
    }
    const salt = await bcrypt.genSalt(8);
    this.pwd = await bcrypt.hash(this.pwd, salt);
});
 
// @Action - Get auth token
adminSchema.methods.generateAuthToken = async function () {
    const admin = this;
    const token = jwt.sign({ _id: admin._id }, "jwtSecret");
    admin.tokens = admin.tokens.concat({ token });
    await admin.save();
    return token;
  };
 
  // @Action - Find admin by credentials
  adminSchema.statics.findByCredentials = async (email, pwd) => {
    const admin1 = await admin.findOne({ email });
    if (!admin1) {
      throw new Error("Please enter authorized admin Email");
    }
    const isMatch = await bcrypt.compare(pwd,admin1.pwd);
    if (!isMatch) {
      throw new Error("Password is not matched");
    }
    return admin1;
  };

const admin = mongoose.model("admin",adminSchema);
module.exports = admin;