const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const multer = require("multer");
require("dotenv").config();
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./utils/auth.config");


//app middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 8070;

//To accept the JSON Data
app.use(express.json());

const URL = process.env.MONGODB_URL;
process.env.SUPPRESS_NO_CONFIG_WARNING = "y";

mongoose.connect(URL, {
  //useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useFindAndModify: false
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb connection success!!!");
});

// Cookie parser
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// @import routes
const courseRouter = require("./routes/SS_routes/courses");
const studentRouter = require("./routes/RD_routes/student");
const adminRouter = require("./routes/RD_routes/admin");
const usersremoveRoutes = require("./routes/RD_routes/usersremove");
const feedbackRouter = require("./routes/AA_routes/feedbacks");
const postRouter = require("./routes/IS_routes/blogs");
const chartroutes = require("./routes/AA_routes/admin_dashboard.route");
const AuthRouter = require("./routes/RD_routes/authroutes");

//@routes use
app.use("/course", courseRouter);
app.use("/student", studentRouter);
app.use("/admin", adminRouter);
app.use("/usersremove",usersremoveRoutes);
app.use("/feedbacks", feedbackRouter);
app.use("/admin", chartroutes);
app.use("/blog", postRouter);
app.use("/auth", AuthRouter);



//report generate routes
const feedbackPDFRoutes = require("./routes/PDF-generator/feedback_report");
app.use(feedbackPDFRoutes);

const coursePDFRoutes = require("./routes/PDF-generator/course-report");
app.use(coursePDFRoutes);

const blogPDFRoutes = require("./routes/PDF-generator/blog-report");
app.use(blogPDFRoutes);

const studentPDFRoutes = require("./routes/PDF-generator/studentList-report");

app.use(studentPDFRoutes);


app.get("/test-cookie", (req, res) => {
  const instituteCookie = req.cookies.institute;
  res.send(`Value of 'recruitment' cookie: ${instituteCookie}`);
});


app.listen(PORT, () => {
  console.log(`Server is up and running on port number: ${PORT}`);
});
