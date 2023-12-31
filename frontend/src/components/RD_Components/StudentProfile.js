import React, { useState, useEffect } from "react";
import axios from "axios";
import UpdateProfile from "./StudentUpdateProfile";
import CircularProgress from "@material-ui/core/CircularProgress";
import NavBar from "../Layouts/Navbar";
import Footer from "../Layouts/footer";

const StudentProfile = () => {
  const [studentData, setStudentData] = useState({});
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data
  useEffect(() => {
    setLoading(true);
    const fetchUserProfile = async () => {
      try {
        const config = {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        };
        const response = await axios.get("http://localhost:8070/student/profile", config);
        setStudentData(response.data.Stu);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // Update user profile handler
  const updateUserProfile = () => {
    setShow(true);
  };

  // Logout user
  const studentLogout = () => {
    if (window.confirm("Are you sure you wish to log out from this Account?")) {
      localStorage.removeItem("role");
      localStorage.removeItem("Authorization");
      window.location = "/";
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    };

    if (window.confirm("Are you sure you wish to delete this Account?")) {
      try {
        await axios.delete("http://localhost:8070/student/delete", config);
        alert("Your account has been deleted successfully");
        localStorage.removeItem("role");
        localStorage.removeItem("Authorization");
        window.location = "/signup";
      } catch (error) {
        console.error("Error deleting user account:", error);
        alert("Failed to delete your account. Please try again later.");
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center" style={{ paddingTop: 400 }}>
        <CircularProgress hidden={false} />
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="container">
        <div className="main-bod">
          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              <div className="cardd">
                <div className="cardd-body">
                  <div className="d-flex flex-column align-items-center text-center">
                    <img
                      src="https://dl.memuplay.com/new_market/img/com.vicman.newprofilepic.icon.2022-06-07-21-33-07.png"
                      className="rounded-circle"
                      width="200"
                      height="200"
                      alt="Profile"
                    />
                    <div className="mt-3">
                      <h2>
                        <b>{studentData.studentName}</b>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="cardd mb-3">
                <div className="cardd-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">
                        <b>Full Name</b>
                      </h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <b>{studentData.studentName}</b>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">
                        <b>Email</b>
                      </h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <b>{studentData.email}</b>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">
                        <b>NIC</b>
                      </h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <b>{studentData.NIC}</b>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <h6 className="mb-0">
                        <b>Phone Number</b>
                      </h6>
                    </div>
                    <div className="col-sm-9 text-secondary">
                      <b>{studentData.phone}</b>
                    </div>
                  </div>
                  <hr />

                  <div className="row">
                    <div className="col-sm-12">
                      <br />
                      <center>
                        <button
                          onClick={updateUserProfile}
                          className="btn btn"
                          style={{ background: "#4863A0", color: "#fff" }}
                        >
                          Edit Profile Details
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button
                          style={{ background: "#4863A0", color: "#fff" }}
                          onClick={studentLogout}
                          className="btn btn"
                        >
                          Log Out
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button
                          style={{ background: "#4863A0", color: "#fff" }}
                          onClick={deleteAccount}
                          className="btn btn"
                        >
                          Delete
                        </button>
                      </center>
                    </div>
                  </div>
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
              </div>
            </div>
          </div>
        </div>
        <UpdateProfile
          show={show}
          onHide={() => setShow(false)}
          upstudentName={studentData.studentName}
          upemail={studentData.email}
          upNIC={studentData.NIC}
          upphone={studentData.phone}
        />
      </div>
      <Footer />
    </div>
  );
};

export default StudentProfile;
