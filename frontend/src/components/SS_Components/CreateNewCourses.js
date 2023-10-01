import React, { useState } from "react";
import axios from "axios";
import app from "../../FireBase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Button from "@material-ui/core/Button";
import AdminNavBar from "../Layouts/AdminNavBar";
import Footer from "../Layouts/footer";
import DOMPurify from "dompurify";

export default function CreateNewCourses() {
  const [course_name, setcourse_name] = useState("");
  const [course_code, setcourse_code] = useState("");
  const [subtitle, setsubtitle] = useState("");
  const [lecture_name, setlecture_name] = useState("");
  const [description, setdescription] = useState("");
  const [courseadded_date, setcourseadded_date] = useState("");
  const [course_thumbnail, setcourse_thumbnail] = useState("");

  const sendData = async (e) => {
    e.preventDefault();

    //input validations
    if (course_name.length < 1 || course_name.length > 50) {
      alert("Course Name should be between 1 and 50 characters!");
      return;
    }
    if (course_code.length < 1 || course_code.length > 6) {
      alert("Course Code should be between 1 and 6 characters!");
      return;
    }
    if (subtitle.length < 1 || subtitle.length > 50) {
      alert("Subtitle should be between 1 and 50 characters!");
      return;
    }
    if (lecture_name.length < 1 || lecture_name.length > 40) {
      alert("Lecture Name should be between 1 and 40 characters!");
      return;
    }
    if (description.length < 1 || description.length > 300) {
      alert("Description should be between 1 and 300 characters!");
      return;
    }

    const fileName = new Date().getTime().toString() + course_thumbnail.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, course_thumbnail);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // ...
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again later.");
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref)
          .then((course_thumbnail) => {
            // Sanitize user inputs using DOMPurifier
            //This is a critical step to prevent any potentially harmful HTML or scripts from being executed.
            const sanitizedData = {
              course_name: DOMPurify.sanitize(course_name),
              course_code: DOMPurify.sanitize(course_code),
              subtitle: DOMPurify.sanitize(subtitle),
              lecture_name: DOMPurify.sanitize(lecture_name),
              description: DOMPurify.sanitize(description),
              courseadded_date: DOMPurify.sanitize(courseadded_date),
              course_thumbnail: DOMPurify.sanitize(course_thumbnail),
            };

            axios
              .post("http://localhost:8070/course/courseadd", sanitizedData)
              .then(() => {
                alert("Course Added Successfully");
                window.location.href = "/courseDetails";
              })
              .catch((err) => {
                console.error("Error adding course:", err);
                alert("Error adding course");
              });
          })
          .catch((err) => {
            console.error("Error getting download URL:", err);
            alert("Error getting download URL");
          });
      }
    );
  };

  return (
    <div>
      <AdminNavBar />
      <br />
      <br />
      <div class="row d-flex align-items-center justify-content-center">
        <div
          style={{
            width: 1000,
            background: "#F5F5F5",
            height: 620,
            backgroundSize: "1000px ",
          }}
        >
          <div class="card-body">
            <form action="" method="post" name="form" onSubmit={sendData}>
              <div style={{ display: "flex" }}>
                <div class="row g-0" style={{ flex: 1 }}>
                  <img
                    src="https:res.cloudinary.com/nibmsa/image/upload/v1661690483/top-banner-with-no-bg-1_vwvnct.webp"
                    style={{ objectFit: "cover" }}
                  ></img>
                  <br />
                  <br />
                </div>

                <div class="col-xl-10" style={{ flex: 1 }}>
                  <br />
                  <div
                    class="form-outline mb-2"
                    style={{ fontFamily: "times new roman" }}
                  >
                    <h3 style={{ fontFamily: "times new roman" }}>
                      &emsp;&emsp;
                      <b>
                        <u>Create&nbsp;New Course</u>
                      </b>
                    </h3>
                    <br />
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ minWidth: "165px", maxWidth: "100px" }}>
                        1. Course Name
                      </div>
                      {/* React Rendering */}
                      {/* React automatically escapes values rendered in JSX, which helps prevent XSS vulnerabilities */}
                      <input
                        type="text"
                        class="form-control"
                        name="course_name"
                        placeholder="Enter course name"
                        onChange={(e) => {
                          setcourse_name(e.target.value);
                        }}
                        required
                      />
                      <br />
                      <br />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ minWidth: "165px", maxWidth: "100px" }}>
                        2. Course Code
                      </div>
                      <input
                        type="text"
                        pattern="^[a-zA-Z0-9]*$"
                        class="form-control"
                        name="course_code"
                        placeholder="Enter course code"
                        onChange={(e) => {
                          setcourse_code(e.target.value);
                        }}
                        required
                      />
                      <br />
                      <br />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ minWidth: "165px", maxWidth: "100px" }}>
                        3. Subtitle
                      </div>
                      <input
                        type="text"
                        class="form-control"
                        name="subtitle"
                        placeholder="Enter subtitle "
                        onChange={(e) => {
                          setsubtitle(e.target.value);
                        }}
                        required
                      />
                      <br />
                      <br />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ minWidth: "165px", maxWidth: "100px" }}>
                        4. Lecture Name
                      </div>
                      <input
                        type="text"
                        class="form-control"
                        name="lecture_name"
                        placeholder="Enter lecture name"
                        onChange={(e) => {
                          setlecture_name(e.target.value);
                        }}
                        required
                      />
                      <br />
                      <br />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ minWidth: "165px", maxWidth: "100px" }}>
                        5. Description
                      </div>
                      <input
                        type="text"
                        class="form-control"
                        name="description"
                        placeholder="Enter description"
                        onChange={(e) => {
                          setdescription(e.target.value);
                        }}
                        required
                      />
                      <br />
                      <br />
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ minWidth: "145px", maxWidth: "100px" }}>
                        6. Course Added Date
                      </div>
                      <input
                        style={{ marginLeft: "20px" }}
                        type="date"
                        class="form-control"
                        name="courseadded_date"
                        placeholder="Enter Course added Date"
                        onChange={(e) => {
                          setcourseadded_date(e.target.value);
                        }}
                        required
                      />
                      <br />
                      <br />
                    </div>
                    <br />
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ minWidth: "165px", maxWidth: "100px" }}>
                        7. Course Thumbnail
                      </div>
                      <input
                        type="file"
                        class="form-control"
                        onChange={(e) => setcourse_thumbnail(e.target.files[0])}
                        required
                      />
                    </div>
                    <br />
                    <br />
                    <Button
                      variant="contained"
                      className="w-10"
                      style={{
                        background: "#8BC0FF",
                        width: 23 + "%",
                        color: "BLACK",
                        borderRadius: 20,
                      }}
                      disableElevation
                      type="submit"
                    >
                      CREATE
                    </Button>
                    &nbsp; &nbsp;
                    <Button
                      variant="contained"
                      href="/courseDetails"
                      className="w-10"
                      style={{
                        background: "#8BC0FF",
                        width: 23 + "%",
                        color: "BLACK",
                        borderRadius: 20,
                      }}
                      disableElevation
                      type="submit"
                    >
                      CANCEL
                    </Button>
                  </div>{" "}
                  <br /> <br />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <br />
      <br />
      <Footer />
    </div>
  );
}
