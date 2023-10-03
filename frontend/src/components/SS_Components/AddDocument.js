// import React, { useState } from "react";
// import AdminNavBar from "../Layouts/AdminNavBar";
// import Footer from "../Layouts/footer";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import app from "../../FireBase";
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from "firebase/storage";
// import Button from "@material-ui/core/Button";

// export default function AddDocument() {
//   const [course_content, setCourseContent] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const params = useParams();
//   const id = params.id;

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setCourseContent(file);
//   };

//   const sendData = async (e) => {
//     e.preventDefault();

//     if (!course_content) {
//       alert("Please select a file to upload.");
//       return;
//     }

//     const fileName = new Date().getTime().toString() + course_content.name;
//     const storage = getStorage(app);
//     const storageRef = ref(storage, fileName);
//     const uploadTask = uploadBytesResumable(storageRef, course_content);

//     setUploading(true);

//     try {
//       await uploadTask;

//       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

//       const data = {
//         course_content: downloadURL,
//       };

//       await axios.put(`http://localhost:8070/course/document/${id}`, data);

//       alert("Upload Success");
//       window.location = "/courseDetails";
//     } catch (error) {
//       alert("Upload failed. Please try again.");
//       console.error("Error uploading file:", error);
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div>
//       <AdminNavBar /> <br />
//       <div className="row d-flex align-items-center justify-content-center">
//         <div
//           style={{
//             borderStyle: "solid",
//             width: 600,
//             background: "#F8F8FF",
//             height: 600,
//             backgroundSize: "1000px ",
//           }}
//         >
//           <br />
//           <br />
//           <h4 align="center">
//             <b>
//               <u>Upload Course Content</u>
//             </b>
//           </h4>

//           <div className="card-body">
//             <form action="" method="post" name="form" onSubmit={sendData}>
//               <div style={{ display: "flex" }}>
//                 <div style={{ display: "flex", alignItems: "center" }}>
//                   <br />
//                   <br />
//                   <br />
//                   <div style={{ minWidth: "165px", maxWidth: "100px" }}>
//                     <b>Course Content:</b>
//                   </div>
//                   <input
//                     type="file"
//                     className="form-control"
//                     onChange={handleFileChange}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Button
//                   variant="contained"
//                   className="w-10"
//                   style={{
//                     background: "#8BC0FF",
//                     width: 27 + "%",
//                     color: "BLACK",
//                     borderRadius: 20,
//                     marginLeft: "380px",
//                   }}
//                   disableElevation
//                   type="submit"
//                   disabled={uploading}
//                 >
//                   {uploading ? "UPLOADING..." : "UPLOAD"}
//                 </Button>
//               </div>
//               <img
//                 src="https://res.cloudinary.com/nibmsa/image/upload/v1663741657/contact-us-concept-landing-page_52683-18636_kys6a3_9c7882-removebg-preview_crbmoy.png"
//                 className="img-fluid"
//                 alt="Phone image"
//               />
//             </form>
//           </div>
//         </div>
//       </div>
//       <br />
//       <Footer />
//     </div>
//   );
// }
import React, { useState } from "react";
import AdminNavBar from "../Layouts/AdminNavBar";
import Footer from "../Layouts/footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import app from "../../FireBase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Button from "@material-ui/core/Button";

export default function AddDocument() {
  const [course_content, setCourseContent] = useState(null);
  const [uploading, setUploading] = useState(false);

  const params = useParams();
  const id = params.id;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCourseContent(file);
  };

  const sendData = async (e) => {
    e.preventDefault();

    if (!course_content) {
      alert("Please select a file to upload.");
      return;
    }

    // Check if the file type is allowed (PDF or Word)
    if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(course_content.type)
    ) {
      alert("Only PDF or Word (DOCX) files are allowed.");
      return;
    }

    const fileName = new Date().getTime().toString() + course_content.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, course_content);

    setUploading(true);

    try {
      await uploadTask;

      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      const data = {
        course_content: downloadURL,
      };

      // Prevent XSS by escaping user-generated content
      const sanitizedData = {
        course_content: escapeHtml(data.course_content),
      };

      await axios.put(
        `http://localhost:8070/course/document/${id}`,
        sanitizedData
      );

      alert("Upload Success");
      window.location = "/courseDetails";
    } catch (error) {
      alert("Upload failed. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  // Function to escape HTML characters to prevent XSS
  const escapeHtml = (unsafe) => {
    return unsafe.replace(/[&<"']/g, function (m) {
      switch (m) {
        case "&":
          return "&amp;";
        case "<":
          return "&lt;";
        case '"':
          return "&quot;";
        case "'":
          return "&#039;";
        default:
          return m;
      }
    });
  };

  return (
    <div>
      <AdminNavBar /> <br />
      <div className="row d-flex align-items-center justify-content-center">
        <div
          style={{
            borderStyle: "solid",
            width: 600,
            background: "#F8F8FF",
            height: 600,
            backgroundSize: "1000px ",
          }}
        >
          <br />
          <br />
          <h4 align="center">
            <b>
              <u>Upload Course Content</u>
            </b>
          </h4>

          <div className="card-body">
            <form action="" method="post" name="form" onSubmit={sendData}>
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <br />
                  <br />
                  <br />
                  <div style={{ minWidth: "165px", maxWidth: "100px" }}>
                    <b>Course Content:</b>
                  </div>
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                    accept=".pdf,.docx" // Limit accepted file types
                  />
                </div>
              </div>
              <div>
                <Button
                  variant="contained"
                  className="w-10"
                  style={{
                    background: "#8BC0FF",
                    width: 27 + "%",
                    color: "BLACK",
                    borderRadius: 20,
                    marginLeft: "380px",
                  }}
                  disableElevation
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? "UPLOADING..." : "UPLOAD"}
                </Button>
              </div>
              <img
                src="https://res.cloudinary.com/nibmsa/image/upload/v1663741657/contact-us-concept-landing-page_52683-18636_kys6a3_9c7882-removebg-preview_crbmoy.png"
                className="img-fluid"
                alt="Phone image"
              />
            </form>
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
}
