// const express = require("express");
// const router = express.Router();
// const cors = require("cors");

// router.use(cors());

// const fs = require("fs");
// const PDFDocument = require("./pdfkit-tables");

// router.post("/generatestudent", async function (req, res, next) {
//   //load cuurent time
//   var currentDate = new Date();
//   var date = currentDate.getDate();
//   var month = currentDate.getMonth(); //Be careful! January is 0 not 1
//   var year = currentDate.getFullYear();
//   var datestamp = "DATE:- " + year + "-" + (month + 1) + "-" + date;

//   const StudentList = req.body.studentsremove;
//   console.log(StudentList);

//   // Create The PDF document
//   var myDoc = new PDFDocument({ bufferPages: true });

//   let buffers = [];
//   myDoc.on("data", buffers.push.bind(buffers));
//   myDoc.on("end", () => {
//     let pdfData = Buffer.concat(buffers);

//     res
//       .writeHead(200, {
//         "Content-Length": Buffer.byteLength(pdfData),
//         "Content-Type": "application/pdf",
//         "Content-disposition": `attachment;filename=Student_${datestamp}.pdf`,
//       })
//       .end(pdfData);
//   });

//   myDoc
//     .fillColor("#444444")
//     .fontSize(20)
//     .text("Student Details", 110, 57)
//     .fontSize(10)
//     .text("UML INSTITUTE", 200, 50, { align: "right" })
//     .text("New Kandy Road ,Malabe", 200, 65, { align: "right" })
//     .text("Tel No : +94112342310 ", 200, 80, { align: "right" })
//     .text("Email : ucl.institute@gmail.com", 200, 95, { align: "right" })
//     .text(datestamp, 200, 110, { align: "right" })
//     .moveDown();

//   // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
//   const table = {
//     headers: ["Student Name", "Email", "NIC", "Phone Number"],
//     rows: [],
//   };

//   for (const StudentItem of StudentList) {
//     table.rows.push([
//       StudentItem.studentName,
//       StudentItem.email,
//       StudentItem.NIC,
//       StudentItem.phone,
//     ]);
//   }
//   // Draw the table
//   myDoc.moveDown().table(table, 15, 155, { width: 590 });
//   myDoc.end();
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

const fs = require("fs");
const PDFDocument = require("./pdfkit-tables");

router.post("/generatestudent", async function (req, res, next) {
  // Check if StudentList is empty
  if (!req.body.studentsremove || req.body.studentsremove.length === 0) {
    return res.status(400).json({ message: "No data to generate a report for." });
  }

  // Load current time
  var currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth(); // Be careful! January is 0 not 1
  var year = currentDate.getFullYear();
  var datestamp = "DATE:- " + year + "-" + (month + 1) + "-" + date;

  const StudentList = req.body.studentsremove;
  console.log(StudentList);

  // Create The PDF document
  var myDoc = new PDFDocument({ bufferPages: true });

  let buffers = [];
  myDoc.on("data", buffers.push.bind(buffers));
  myDoc.on("end", () => {
    let pdfData = Buffer.concat(buffers);

    res
      .writeHead(200, {
        "Content-Length": Buffer.byteLength(pdfData),
        "Content-Type": "application/pdf",
        "Content-disposition": `attachment;filename=Student_${datestamp}.pdf`,
      })
      .end(pdfData);
  });

  myDoc
    .fillColor("#444444")
    .fontSize(20)
    .text("Student Details", 110, 57)
    .fontSize(10)
    .text("UML INSTITUTE", 200, 50, { align: "right" })
    .text("New Kandy Road ,Malabe", 200, 65, { align: "right" })
    .text("Tel No : +94112342310 ", 200, 80, { align: "right" })
    .text("Email : ucl.institute@gmail.com", 200, 95, { align: "right" })
    .text(datestamp, 200, 110, { align: "right" })
    .moveDown();

  // Create the table - https://www.andronio.me/2017/09/02/pdfkit-tables/
  const table = {
    headers: ["Student Name", "Email", "NIC", "Phone Number"],
    rows: [],
  };

  for (const StudentItem of StudentList) {
    table.rows.push([
      StudentItem.studentName,
      StudentItem.email,
      StudentItem.NIC,
      StudentItem.phone,
    ]);
  }

  // Draw the table
  myDoc.moveDown().table(table, 15, 155, { width: 590 });
  myDoc.end();
});

module.exports = router;
