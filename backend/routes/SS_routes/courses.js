const express = require("express");
const { body, validationResult } = require("express-validator");
const Courses = require("../../models/SS_models/courses");
const router = express.Router();
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const dompurify = createDOMPurify(window);

// Middleware for validating course ID
const validateCourseId = (req, res, next) => {
  if (!req.params.courseID.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: "Invalid course ID" });
  }
  next();
};

// Middleware for handling errors
const handleErrors = (err, res) => {
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
};

//Validation and Sanitization Middleware
// Sanitize user inputs
const sanitizeInputs = (req, res, next) => {
  req.body.course_name = dompurify.sanitize(req.body.course_name);
  req.body.course_code = dompurify.sanitize(req.body.course_code);
  req.body.subtitle = dompurify.sanitize(req.body.subtitle);
  req.body.lecture_name = dompurify.sanitize(req.body.lecture_name);
  req.body.description = dompurify.sanitize(req.body.description);
  next();
};

//Validation Using Express Validator
// Add new courses
router.post(
  "/courseadd",
  sanitizeInputs, // Sanitize user inputs
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const newCourses = new Courses(req.body);
      await newCourses.save();
      return res.status(200).json({
        success: "New course added successfully!",
      });
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
);

//get course details
router.get("/getDetails", async (req, res) => {
  try {
    const courses = await Courses.find();
    return res.status(200).json({
      success: true,
      existingCourses: courses,
    });
  } catch (error) {
    return handleErrors(error, res);
  }
});

// Upload document
router.put("/document/:ID", async (req, res) => {
  try {
    const id = req.params.ID;
    const { course_content } = req.body;
    const data = { course_content };
    const result = await Courses.findByIdAndUpdate(id, data);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Course content updated successfully",
      });
    } else {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    return handleErrors(error, res);
  }
});

//Update course details
// router.put("/update/:courseID", validateCourseId, async (req, res) => {
//   try {
//     const updatedCourse = await Courses.findByIdAndUpdate(
//       req.params.courseID,
//       { $set: req.body },
//       { new: true } // Return the updated course
//     );

//     if (updatedCourse) {
//       return res.status(200).json({
//         success: "Course updated successfully",
//         updatedCourse,
//       });
//     } else {
//       return res.status(404).json({ error: "Course not found" });
//     }
//   } catch (error) {
//     // Log the error securely without exposing sensitive information
//     console.error("Database error:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// });
router.put("/update/:courseID", validateCourseId, async (req, res) => {
  try {
    // Sanitize user inputs to prevent XSS attacks
    const sanitizedBody = {
      course_name: dompurify.sanitize(req.body.course_name),
      course_code: dompurify.sanitize(req.body.course_code),
      subtitle: dompurify.sanitize(req.body.subtitle),
      lecture_name: dompurify.sanitize(req.body.lecture_name),
      description: dompurify.sanitize(req.body.description),
      courseadded_date: dompurify.sanitize(req.body.courseadded_date),
      course_thumbnail: dompurify.sanitize(req.body.course_thumbnail),
    };

    const updatedCourse = await Courses.findByIdAndUpdate(
      req.params.courseID,
      { $set: sanitizedBody },
      { new: true } // Return the updated course
    );

    if (updatedCourse) {
      return res.status(200).json({
        success: "Course updated successfully",
        updatedCourse,
      });
    } else {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    // Log the error securely without exposing sensitive information
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

//get specific details
router.route("/:courseID").get((req, res) => {
  let courseID = req.params.courseID;
  Courses.findById(courseID, (err, courses) => {
    if (err) {
      return handleErrors(err, res); // Handle the error securely
    }
    return res.status(200).json({
      success: true,
      existingCourses: courses,
    });
  });
});

// Delete course
//Error handling is crucial in web applications to ensure that errors are properly
//handled and appropriate responses are sent back to the client.
router.delete("/delete/:courseID", validateCourseId, async (req, res) => {
  try {
    const courseID = req.params.courseID;

    // Use Mongoose's query builder to delete the course
    const deletedCourse = await Courses.findByIdAndRemove({ _id: courseID });

    if (deletedCourse) {
      return res.status(200).json({
        success: "Course deleted successfully",
        deletedCourse,
      });
    } else {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    return handleErrors(error, res);
  }
});

module.exports = router;
