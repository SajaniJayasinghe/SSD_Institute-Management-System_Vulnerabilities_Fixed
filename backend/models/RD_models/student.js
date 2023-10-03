const mongoose = require ('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const studentSchema = new mongoose.Schema({

    googleId: { type: String },

    studentName :{
        type : String,
        required: [true, "Student Name is required!"],
        maxlength: [50, "Student Name should be less than 50 characters!"],
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
    minlength: [6, "NIC should be more than 6 characters!"],
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
studentSchema.pre('save', async function(next){
    if(!this.isModified("pwd")){
        next();
    }
    const salt = await bcrypt.genSalt(8);
    this.pwd = await bcrypt.hash(this.pwd, salt);
  });

  // @Action - Get auth token
studentSchema.methods.generateAuthToken = async function () {
    const student = this;
    const token = jwt.sign({ _id: student._id }, "jwtSecret");
    student.tokens = student.tokens.concat({ token });
    await student.save();
    return token;
};

// @Action - Find student by credentials
studentSchema.statics.findByCredentials = async (email, pwd) => {
    const student1 = await student.findOne({ email });
    if (!student1) {
      throw new Error("Please enter authorized student Email");
    }
    const isMatch = await bcrypt.compare(pwd, student1.pwd);
    if (!isMatch) {
      throw new Error("Password is not matched");
    }
    return student1;
    };

 const student = mongoose.model("student", studentSchema);
 module.exports = student; 