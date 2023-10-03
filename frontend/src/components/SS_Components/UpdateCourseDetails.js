import React, { useState, useEffect } from "react";
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
import Footer from "../Layouts/footer";
import AdminNavBar from "../Layouts/AdminNavBar";
import DOMPurify from "dompurify";

export default function UpdateCourseDetails() {
  const [course_name, setCourseName] = useState("");
  const [course_code, setCourseCode] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [lecture_name, setLectureName] = useState("");
  const [description, setDescription] = useState("");
  const [courseadded_date, setCourseAddedDate] = useState("");
  const [course_thumbnail, setCourseThumbnail] = useState("");

  const params = useParams();
  const courseID = params.courseID;

  useEffect(() => {
    axios.get(`http://localhost:8070/course/${courseID}`).then((res) => {
      if (res.data) {
        const courseData = res.data.existingCourses;
        setCourseName(courseData.course_name);
        setCourseCode(courseData.course_code);
        setSubtitle(courseData.subtitle);
        setLectureName(courseData.lecture_name);
        setDescription(courseData.description);
        setCourseAddedDate(courseData.courseadded_date);
      }
    });
  }, [courseID]);

  const onUpdate = (e) => {
    e.preventDefault();

    // Check for null or empty values
    if (
      !course_name ||
      !course_code ||
      !subtitle ||
      !lecture_name ||
      !description ||
      !courseadded_date
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Sanitize user inputs using DOMPurify
    const sanitizedCourseName = DOMPurify.sanitize(course_name);
    const sanitizedCourseCode = DOMPurify.sanitize(course_code);
    const sanitizedSubtitle = DOMPurify.sanitize(subtitle);
    const sanitizedLectureName = DOMPurify.sanitize(lecture_name);
    const sanitizedDescription = DOMPurify.sanitize(description);
    const sanitizedCourseAddedDate = DOMPurify.sanitize(courseadded_date);

    const updateCourse = {
      course_name: sanitizedCourseName,
      course_code: sanitizedCourseCode,
      subtitle: sanitizedSubtitle,
      lecture_name: sanitizedLectureName,
      description: sanitizedDescription,
      courseadded_date: sanitizedCourseAddedDate,
    };

    // Check if any of the sanitized inputs are empty after sanitization
    const isEmptyInput = Object.values(updateCourse).some((value) => !value);

    if (isEmptyInput) {
      alert("Please enter valid data.");
      return;
    }

    if (!course_thumbnail) {
      // If the course thumbnail is not updated, use the existing one
      updateCourse.course_thumbnail = course_thumbnail;
      sendUpdateRequest(updateCourse);
    } else {
      // Upload the new course thumbnail
      try {
        const fileName =
          new Date().getTime().toString() + course_thumbnail.name;
        const storage = getStorage(app);
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, course_thumbnail);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.error("Error uploading file:", error);
            alert("Error uploading file. Please try again later.");
          },
          async () => {
            // Handle successful uploads
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              updateCourse.course_thumbnail = DOMPurify.sanitize(downloadURL);
              sendUpdateRequest(updateCourse);
            } catch (error) {
              console.error("Error getting download URL:", error);
              alert("Error getting download URL. Please try again later.");
            }
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file. Please try again later.");
      }
    }
  };

  const sendUpdateRequest = (data) => {
    axios
      .put(`http://localhost:8070/course/update/${courseID}`, data)
      .then((res) => {
        if (res.data) {
          alert("Course Updated Successfully");
          window.location.href = "/courseDetails";
        } else {
          alert("Update Unsuccessful...!");
        }
      })
      .catch((err) => {
        console.error("Error updating course:", err);
        alert("Error updating course");
      });
  };

  const handleFileChange = (e) => {
    setCourseThumbnail(e.target.files[0]);
  };

  return (
    <div>
      <AdminNavBar />
      <br />
      <br />
      <div className="row d-flex align-items-center justify-content-center">
        <div
          style={{
            width: 1000,
            background: "#F5F5F5",
            height: 620,
            backgroundSize: "1000px ",
          }}
        >
          <div className="card-body">
            <form action="" method="post" name="form" onSubmit={onUpdate}>
              <div style={{ display: "flex" }}>
                <div className="row g-0" style={{ flex: 1 }}>
                  <img
                    src="https://res.cloudinary.com/nibmsa/image/upload/v1661690483/top-banner-with-no-bg-1_vwvnct.webp"
                    style={{ objectFit: "cover" }}
                    alt="Course Thumbnail"
                  />
                  <br />
                  <br />
                </div>

                <div className="col-xl-10" style={{ flex: 1 }}>
                  <br />
                  <div
                    className="form-outline mb-2"
                    style={{ fontFamily: "times new roman" }}
                  >
                    <h3 style={{ fontFamily: "times new roman" }}>
                      &emsp;&emsp;
                      <b>
                        <u>Update Course Details</u>
                      </b>
                    </h3>
                    <br />
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ minWidth: "165px", maxWidth: "100px" }}>
                        1. Course Name
                      </div>
                      <input
                        type="text"
                        className="form-control"
                        value={course_name}
                        name="course_name"
                        placeholder="Enter course name"
                        onChange={(e) => {
                          setCourseName(e.target.value);
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
                        className="form-control"
                        value={course_code}
                        name="course_code"
                        placeholder="Enter course code"
                        onChange={(e) => {
                          setCourseCode(e.target.value);
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
                        className="form-control"
                        value={subtitle}
                        name="subtitle"
                        placeholder="Enter subtitle "
                        onChange={(e) => {
                          setSubtitle(e.target.value);
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
                        className="form-control"
                        value={lecture_name}
                        name="lecture_name"
                        placeholder="Enter lecture name"
                        onChange={(e) => {
                          setLectureName(e.target.value);
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
                        className="form-control"
                        value={description}
                        name="description"
                        placeholder="Enter description"
                        onChange={(e) => {
                          setDescription(e.target.value);
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
                        className="form-control"
                        value={courseadded_date}
                        name="courseadded_date"
                        placeholder="Enter Course added Date"
                        onChange={(e) => {
                          setCourseAddedDate(e.target.value);
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
                        className="form-control"
                        // onChange={(e) => setCourseThumbnail(e.target.files[0])}
                        onChange={handleFileChange}
                      />
                    </div>
                    <br />
                    <br />
                    &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
                    <Button
                      variant="contained"
                      className="w-10"
                      style={{
                        background: "#8BC0FF",
                        width: "23%",
                        color: "BLACK",
                        borderRadius: 20,
                      }}
                      disableElevation
                      type="submit"
                    >
                      UPDATE
                    </Button>
                    &nbsp; &nbsp;
                    <Button
                      variant="contained"
                      href="/courseDetails"
                      className="w-10"
                      style={{
                        background: "#8BC0FF",
                        width: "23%",
                        color: "BLACK",
                        borderRadius: 20,
                      }}
                      disableElevation
                      type="submit"
                    >
                      CANCEL
                    </Button>
                  </div>
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
