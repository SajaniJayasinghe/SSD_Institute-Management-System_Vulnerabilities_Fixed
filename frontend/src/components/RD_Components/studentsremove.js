import React, { Component } from "react";
import axios from "axios";
import SearchSharpIcon from "@material-ui/icons/SearchSharp";
import AdminNavBar from "../Layouts/AdminNavBar";
import DescriptionIcon from "@mui/icons-material/Description";
import IconButton from "@material-ui/core/IconButton";

export default class Studentsremove extends Component {
  constructor(props) {
    super(props);
    this.generateReport = this.generateReport.bind(this);
    this.state = {
      studentsremove: [],
    };
  }

  // Retrieve student members
  componentDidMount() {
    this.retrieveStudentsDetails();
  }

  // Data retrieve
  retrieveStudentsDetails() {
    axios.get("http://localhost:8070/usersremove/getstudent").then((res) => {
      if (res.data.success) {
        this.setState({
          studentsremove: res.data.existingstudent,
        });
      }
    });
  }

  // Delete student
  onDelete = (studentID) => {
    if (window.confirm("Are you sure you wish to delete this student?")) {
      axios
        .delete(`http://localhost:8070/usersremove/studentdelete/${studentID}`)
        .then((res) => {
          alert("Delete Successfully");
          this.retrieveStudentsDetails();
        });
    }
  };

  filterData(studentsremove, searchKey) {
    const result = studentsremove.filter(
      (student) =>
        student.studentName.toLowerCase().includes(searchKey) ||
        student.email.toLowerCase().includes(searchKey)
    );
    this.setState({ studentsremove: result });
  }

  handleSearchArea = (e) => {
    const searchKey = e.currentTarget.value;

    axios.get("http://localhost:8070/usersremove/getstudent").then((res) => {
      if (res.data.success) {
        this.filterData(res.data.existingstudent, searchKey);
      }
    });
  };

  async generateReport() {
    const obj = { studentsremove: this.state.studentsremove };
    if (obj.studentsremove.length === 0) {
      alert("No data to generate a report for.");
      return;
    }

    await axios
      .post("http://localhost:8070/generatestudent", obj, {
        responseType: "arraybuffer",
        headers: { Accept: "application/pdf" },
      })
      .then((res) => {
        alert("Report Generated");
        const pdfBlob = new Blob([res.data], { type: "application/pdf" });
        saveAs(pdfBlob, "Students.pdf");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  render() {
    return (
      <div>
        <AdminNavBar />
        <div className="card-header py-3">
          <h3
            align="center"
            style={{ fontSize: "30px", fontFamily: "Times New Roman" }}
          >
            <b>
              {" "}
              <br />
              <u>All Students Details </u>
            </b>
          </h3>
          <br />
          <div style={{ marginLeft: "1300px" }}>
            <IconButton size="medium" onClick={this.generateReport}>
              <DescriptionIcon fontSize="large" style={{ color: "black" }} />
            </IconButton>
            <div style={{ fontSize: "15px" }}>Report</div>
          </div>
          <div className="card-body">
            <div className="col-lg-2 mt-2 mb-2" style={{ marginLeft: "220px" }}>
              <input
                className="form-control"
                type="search"
                placeholder="Search Here"
                name="searchQuery"
                startIcon={<SearchSharpIcon />}
                onChange={this.handleSearchArea}
              ></input>
            </div>
            <div align="center">
              <form onSubmit={this.handleSearchArea}></form>
              <div className="container">
                <table className="table table-hover">
                  <thead>
                    <tr bgcolor="#79BAEC">
                      <th scope="col">No</th>
                      <th scope="col">Student Name</th>
                      <th scope="col">Student Email</th>
                      <th scope="col">Student NIC</th>
                      <th scope="col">Student Phone Number</th>
                      <th scope="col">Remove Student</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.studentsremove.map((student, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{student.studentName}</td>
                        <td>{student.email}</td>
                        <td>{student.NIC}</td>
                        <td>{student.phone}</td>

                        <td align="center">
                          <a
                            className="btn btn-danger"
                            href="#"
                            onClick={() => this.onDelete(student._id)}
                          >
                            <i className="far fa-trash-alt"></i>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <br />
              <br />
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
