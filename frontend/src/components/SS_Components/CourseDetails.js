import React, { Component } from "react";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButton from "@material-ui/core/IconButton";
import AdminNavBar from "../Layouts/AdminNavBar";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import moment from "moment";

export default class CourseDetails extends Component {
  constructor(props) {
    super(props);
    this.generateReport = this.generateReport.bind(this);
    this.state = {
      courses: [],
      searchKey: "", // Add a state variable for search
    };
  }

  componentDidMount() {
    this.retrieveCourses();
  }
  //Prevent Secure Dependencies
  async retrieveCourses() {
    try {
      const response = await axios.get(
        "http://localhost:8070/course/getDetails"
      );

      if (response.data.success) {
        this.setState({
          courses: response.data.existingCourses,
        });
        console.log(this.state.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  // delete course details
  onDelete = (courseID) => {
    if (window.confirm("Are you sure you wish to delete this course?")) {
      axios
        .delete(`http://localhost:8070/course/delete/${courseID}`)
        .then((res) => {
          this.retrieveCourses();
        });
    }
  };

  // Search
  handleSearchArea = (e) => {
    const searchKey = e.currentTarget.value.toLowerCase();
    this.setState({ searchKey }); // Update the searchKey state
  };

  // Generate report
  async generateReport() {
    const obj = { courses: this.state.courses };

    try {
      const response = await axios.post(
        "http://localhost:8070/generatecoursereport",
        obj,
        {
          responseType: "arraybuffer",
          headers: { Accept: "application/pdf" },
        }
      );

      const contentType = response.headers["content-type"];

      if (contentType === "application/pdf") {
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        saveAs(pdfBlob, "Courses.pdf");
        alert("Report Generated");
      } else {
        console.log("Invalid content type:", contentType);
        alert("Failed to generate the course report. Please try again.");
      }
    } catch (error) {
      console.error("Error generating the course report:", error.message);
      alert("An error occurred while generating the course report.");
    }
  }

  render() {
    const { courses, searchKey } = this.state;
    const filteredCourses = courses.filter((course) =>
      course.course_name.toLowerCase().includes(searchKey)
    );

    return (
      <div>
        <AdminNavBar />
        <div className="container">
          <br />
          <br />
          <div align="center">
            <h3 style={{ fontFamily: "times new roman", fontSize: "40px" }}>
              <u>
                <b>COURSES LIST</b>
              </u>
            </h3>{" "}
            <br />
            <div align="right">
              <Button
                variant="contained"
                style={{
                  background: "#8BC0FF",
                  width: 7 + "%",
                  color: "BLACK",
                  borderRadius: 20,
                }}
                href="/createCourse"
                disableElevation
                type="submit"
              >
                CREATE
              </Button>
              &nbsp;
              <IconButton size="medium" onClick={this.generateReport}>
                <DescriptionIcon fontSize="large" style={{ color: "black" }} />
              </IconButton>
            </div>
            <div className="col-md-3" style={{ marginRight: "970px" }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Course Name"
                onChange={this.handleSearchArea}
              />{" "}
              <br />
            </div>
            <table className="table">
              <thead>
                <tr bgcolor="#083C53">
                  <th>
                    <font color="#fff">No</font>
                  </th>
                  <th>
                    <font color="#fff">Course Name</font>
                  </th>
                  <th>
                    <font color="#fff">Course Code</font>
                  </th>
                  <th>
                    <font color="#fff">Subtitle</font>
                  </th>
                  <th>
                    <font color="#fff">Lecture Name</font>
                  </th>
                  <th>
                    <font color="#fff">Course Added Date</font>
                  </th>
                  <th>
                    <font color="#fff">Add Document</font>
                  </th>
                  <th>
                    <font color="#fff">Action</font>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course, index) => (
                  <tr key={course._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{course.course_name}</td>
                    <td>{course.course_code}</td>
                    <td>{course.subtitle}</td>
                    <td>{course.lecture_name}</td>
                    <td>
                      {moment(course.courseadded_date).format("DD/MM/YYYY")}
                    </td>
                    <td>
                      <IconButton
                        aria-label="add-document"
                        color="primary"
                        size="small"
                        href={`/addDocument/${course._id}`}
                        style={{ color: "black", marginLeft: "50px" }}
                      >
                        <ControlPointIcon
                          fontSize="small"
                          style={{ color: "black" }}
                        />
                      </IconButton>
                    </td>
                    <td>
                      <IconButton
                        aria-label="edit"
                        color="primary"
                        size="small"
                        href={`/update/${course._id}`}
                      >
                        <EditIcon fontSize="small" style={{ color: "black" }} />
                      </IconButton>{" "}
                      &nbsp;&nbsp;
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => this.onDelete(course._id)}
                      >
                        <DeleteForeverIcon
                          fontSize="small"
                          style={{ color: "black" }}
                        />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
