// const express = require("express");
// const router = require("express").Router();
// let student = require("../../models/RD_models/student");
// const validator= require("validator");
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken');
// const auth = require("../../middleware/auth");

// //student signup
// router.post("/signup",async (req, res) => {
//     try {
//       const {
//         studentName,
//         email,
//         pwd,
//         NIC,
//         phone

//       } = req.body;

//       let student1 = await student.findOne({ email });
//       if (student1) {
//         throw new Error("student already exists");
//       }

//       student1 = {
//         studentName : studentName,
//         email: email,
//         pwd: pwd,
//         NIC: NIC,
//         phone : phone
// };
    
//       const newstudent = new student(student1);
//       await newstudent.save();
//       const token = await newstudent.generateAuthToken()
//       res.status(201).send({ status: "student Member Created", student: newstudent, token: token });
     
//       console.log(student1);
    
//       } catch (error) {
//          console.log(error.message);
//          res.status(500).send({error: error.message});
//         //  console.log(error)
//     }
//   });

//    //student login
//    router.post('/signin', async (req, res) => {
//     try {
//       const {email, pwd} = req.body
//       const Stu = await student.findByCredentials(email, pwd)
//       const token = await Stu.generateAuthToken()
//       res.status(200).send({token: token, Stu: Stu})
  
//     } catch (error) {
//       res.status(500).send({ error: error.message });
//       console.log(error);
//     }
//   });


// //get student profile
// router.get("/profile", auth, async (req, res) => {
//     try {
//       res.status(201)
//       res.send({ success: "Student Logged In", Stu: req.Stu });
//     } 
//       catch (error) {
//       res.status(500)
//       res.send({ status: "Error with profile", error: error.message });
//     }
//   });

  
//   //log out profile
//   router.post("/logout", auth, async (req, res) => {
//     try {
//       req.Stu.tokens = req.Stu.tokens.filter((token) => {
//         return token.token !== req.token;
//       });
//       await req.Stu.save();
//       res.status(200).send("Logout successfully");
//     } catch (error) {
//       res.status(500).send(error.message);
//       console.log(error.message);
//     }   
//  });

// // update student profile
// router.put('/update', auth, async (req, res) => {
//     try {
//       const {
//           studentName,
//           email,
//           phone,
//           NIC,
          
//         } = req.body;
  
//       let Stu = await student.findOne({email})
        
//       if (!Stu) {
//           throw new Error('There is no student account')
//         }
  
//         const studentUpdate = await student.findByIdAndUpdate(req.Stu.id, 
//           {
//             studentName:studentName,
//             email:email,
//             phone:phone,
//             NIC: NIC
            
//           })
  
//           res.status(200).send({status: 'Student Profile Updated', Stu: studentUpdate})
  
//         } catch (error) {
//           res.status(500).send({error: error.message})
//           console.log(error)
//         }
//       });
  
//       //delete student account
//     router.delete("/delete", auth, async (req, res) => {
//         try {
//           const Stu = await student.findById(req.Stu.id);
//           if (!Stu) {
//             throw new Error("There is no student to delete");
//           }
//           const deleteProfile = await student.findByIdAndDelete(req.Stu.id);
//           res.status(200).send({ status: "Student deleted", Stu: deleteProfile });
//         } catch (error) {
//           res
//             .status(500)
//             .send({ status: "error with /delete/:id", error: error.message });
//         }
//       });


//   module.exports = router;

const express = require("express");
const router = require("express").Router();
const student = require("../../models/RD_models/student");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../middleware/auth");
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Student signup
router.post("/signup", async (req, res) => {
  try {
    const { studentName, email, pwd, NIC, phone } = req.body;

    let student1 = await student.findOne({ email });
    if (student1) {
       return res.status(400).send({ error: "Student already exists" }); // Return a 400 Bad Request with the error message
    }

    const studentData = {
      studentName: DOMPurify.sanitize(studentName),
      email: DOMPurify.sanitize(email),
      pwd: pwd,
      NIC: DOMPurify.sanitize(NIC),
      phone: DOMPurify.sanitize(phone)
    };

    const newStudent = new student(studentData);
    await newStudent.save();
    const token = await newStudent.generateAuthToken();

    // Sanitize user data before sending it to the client
    const sanitizedStudent = {
      studentName: DOMPurify.sanitize(newStudent.studentName),
      email: DOMPurify.sanitize(newStudent.email),
      NIC: DOMPurify.sanitize(newStudent.NIC),
      phone: DOMPurify.sanitize(newStudent.phone)
    };

    res.status(201).send({ status: "Student Member Created", student: sanitizedStudent, token: token });

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});


  // Student login
router.post('/signin', async (req, res) => {
  try {
    const { email, pwd } = req.body;
    const foundStudent = await student.findByCredentials(email, pwd);
    const token = await foundStudent.generateAuthToken();

    // Sanitize user data before sending it to the client
    const sanitizedStudent = {
      studentName: DOMPurify.sanitize(foundStudent.studentName),
      email: DOMPurify.sanitize(foundStudent.email),
      NIC: DOMPurify.sanitize(foundStudent.NIC),
      phone: DOMPurify.sanitize(foundStudent.phone)
    };

    res.status(200).send({ token: token, Stu: sanitizedStudent });

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});


// Get student profile
router.get("/profile", auth, async (req, res) => {
  try {
    // Sanitize user data before sending it to the client
    const sanitizedStudent = {
      studentName: DOMPurify.sanitize(req.Stu.studentName),
      email: DOMPurify.sanitize(req.Stu.email),
      NIC: DOMPurify.sanitize(req.Stu.NIC),
      phone: DOMPurify.sanitize(req.Stu.phone)
    };

    res.status(201).send({ success: "Student Logged In", Stu: sanitizedStudent });

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Logout student
router.post("/logout", auth, async (req, res) => {
  try {
    req.Stu.tokens = req.Stu.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.Stu.save();
    res.status(200).send("Logout successfully");
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Update student profile
router.put('/update', auth, async (req, res) => {
  try {
    const { studentName, email, phone, NIC } = req.body;

    let Stu = await student.findOne({ email });
    if (!Stu) {
      throw new Error('There is no student account');
    }

    const studentUpdate = await student.findByIdAndUpdate(req.Stu.id,
      {
        studentName: DOMPurify.sanitize(studentName),
        email: DOMPurify.sanitize(email),
        phone: DOMPurify.sanitize(phone),
        NIC: DOMPurify.sanitize(NIC)
      });

    res.status(200).send({ status: 'Student Profile Updated', Stu: studentUpdate });

  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Delete student account
router.delete("/delete", auth, async (req, res) => {
  try {
    const Stu = await student.findById(req.Stu.id);
    if (!Stu) {
      throw new Error("There is no student to delete");
    }
    const deleteProfile = await student.findByIdAndDelete(req.Stu.id);
    res.status(200).send({ status: "Student deleted", Stu: deleteProfile });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
  }
});


module.exports = router;
