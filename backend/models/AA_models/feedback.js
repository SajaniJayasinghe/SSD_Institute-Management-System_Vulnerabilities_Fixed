const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "courses"
  },
  course_name: {
    type: String,
    required: false
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
    ref: "student"
  },
  studentPicture: {
    type: String,
    required: false
  },
  studentName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: [true, "rating is required!"],
    enum: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
  },
  comment: {
    type: String,
    required: [true, "Comment is required!"],
    maxlength: [100, "Comment should be less than 100 characters!"],
    trim: true
  },
  date: {
    type: String,
    required: true
  }
});

//module.exports = mongoose.model('Feedbacks', feedbackSchema);

const Feedback = mongoose.model("feedbacks", feedbackSchema);

module.exports = Feedback;
