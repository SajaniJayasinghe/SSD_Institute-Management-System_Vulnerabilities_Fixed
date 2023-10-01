const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
  course_name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: [50, "Course Name should be less than 50 characters!"],
  },
  course_code: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: [6, "Course Code should be less than 6 characters!"],
  },
  subtitle: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: [50, "Course Subtitle should be less than 50 characters!"],
  },
  lecture_name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: [60, "Lecture Name  should be less than 60 characters!"],
  },
  description: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: [300, "Description should be less than 300 characters!"],
  },
  courseadded_date: {
    type: Date,
    required: true,
  },
  course_thumbnail: {
    type: String,
    required: false,
  },
  course_content: {
    type: String,
    required: false,
  },
});

coursesSchema.index({ course_code: 1 }, { unique: true });

const Courses = mongoose.model("courses", coursesSchema);
module.exports = Courses;
