const jwt = require("jsonwebtoken");
const config = require("config");
const student = require("../models/RD_models/student");


const auth = async (req, res, next) => {
    try {
      const token = req.header("Authorization");
      const decode = jwt.verify(token, "jwtSecret");
      const Stu = await student.findOne({ _id: decode._id, "tokens.token": token });
      if (!Stu) {
        throw new Error("Please Authenticated");
      }
  
      req.token = token;
      req.Stu = Stu;
      next();
      
    } catch (error) {
      res.status(401).send({ message: error.message });
      console.log("Error in auth.js middleware ", error.message);
    }
  };


// const helperUtil = require("../utils/helper.util");

// const auth = (req, res, next) => {
//   // const authHeader = req.header("Authorization");
//   const authHeader = req.cookies.institute;

//   // console.log(authHeader);
//   if (!authHeader || !authHeader.startsWith("Bearer")) {
//     return res
//       .status(401)
//       .json({ status: false, message: "Authentication invalid" });
//   }

//   const token = helperUtil.extractToken(authHeader);

//   if (token) {
//     var payload = null;

//     try {
//       payload = helperUtil.verifyToken(token);
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         return res
//           .status(401)
//           .json({ status: false, message: "Your session is expired!" });
//       } else {
//         return res.status(401).json({
//           status: false,
//           message: "You're unauthorized to access this resource!",
//         });
//       }
//     }

//     req.logedUser = payload;

//     return next();
//   } else {
//     return res
//       .status(401)
//       .json({ status: false, message: "Authentication invalid" });
//   }
// };
  
  module.exports = auth;
  