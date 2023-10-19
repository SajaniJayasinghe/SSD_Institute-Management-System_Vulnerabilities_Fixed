const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "student",
    },

    studentName: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: [true, "Title is required!"],
      maxlength: [50, "Title should be less than 50 characters!"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Full Name is required!"],
    },
    // photo: {
    //   type: String,
    //   required: false,
    // },
    photo: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => {
          return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(
            value
          );
        },
        message: "Invalid Image URL!",
      },
    },
  },
  { timestamps: true }
);
//hello
const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
