import React, { Component, useEffect} from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Footer from "../Layouts/footer";
import UserNavBar from "../Layouts/UserNavBar";
import IconButton from "@material-ui/core/IconButton";
import FacebookIcon from "@mui/icons-material/Facebook";
import GoogleIcon from "@mui/icons-material/Google";
import GoogleButton from "react-google-button";

import { isEmail, isLength } from "validator"; // Importing validation functions

export default class StudentLogin extends Component {
  constructor(props) {
    super(props);
    this.StudentLoginSubmit = this.StudentLoginSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      email: "",
      pwd: "",
      token: "",
      open: false,
      errors: {
        email: "",
        pwd: "",
      },
    };
  }

  validateForm = () => {
    const { email, pwd } = this.state;
    const errors = {};

    if (!isEmail(email)) {
      errors.email = "Invalid email address.";
    }

    if (!isLength(pwd, { min: 6 })) {
      errors.pwd = "Password should be at least 6 characters.";
    }

    return errors;
  };

  async StudentLoginSubmit(e) {
    e.preventDefault();
    const errors = this.validateForm();

    if (Object.keys(errors).length > 0) {
      alert("Please enter valid Inputs");
      return;
    }

    // Clear validation errors
    this.setState({ errors: {} });

    const userData = {
      email: this.state.email,
      pwd: this.state.pwd,
    };

    await axios
      .post("http://localhost:8070/student/signin", userData)
      .then((res) => {
        this.setState({
          token: res.data.token,
        });
        localStorage.setItem("Authorization", res.data.token);
        window.location = "/coursesdisplay";
        alert("Login Successful!!");
      })
      .catch((err) => {
        console.log(err);
        this.setState({ open: true });
        alert("Login Failed. Please try again!!");
      });
  }

  handleClose(reason) {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <UserNavBar />
        <br />
        <br />
        <div class="row d-flex align-items-center justify-content-center">
          <div
            style={{
              width: 800,
              background: "#E8F2FF",
              height: 500,
              borderRadius: "20px",
            }}
          >
            <div class="card-body">
              <div class="container py-5 h-90">
                <div class="row d-flex align-items-center justify-content-center h-100">
                  <div class="col-md-8 col-lg-7 col-xl-6">
                    <img
                      src="https://assets.applyboard.com/assets/session/login-eadf850accc5cb732e5af77f3318cdd89d2de72e00d0a3054b48ab60a11ff7f1.svg"
                      class="img-fluid"
                      alt="Phone image"
                    />
                    <br />
                    <br />
                    <h2>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <u>
                        <b>STUDENT&nbsp;&nbsp;LOGIN</b>
                      </u>
                    </h2>
                  </div>

                  <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                    <form onSubmit={this.StudentLoginSubmit} name="form">
                      <div class="form-outline mb-4">
                        <div className="col-md-9">
                          <span
                            id="passwordHelpInline"
                            class="form-text"
                            style={{ marginBottom: "2px" }}
                          >
                            {" "}
                            <i className="fa fa-lock"> &nbsp;&nbsp;</i>
                            USER EMAIL ADDRESS{" "}
                          </span>
                          <input
                            type="text"
                            name="email"
                            placeholder="Enter Your Email"
                            class="form-control "
                            onChange={(e) =>
                              this.setState({ email: e.target.value })
                            }
                            required
                          />
                          {this.state.errors.email && (
                            <div className="text-danger">
                              {this.state.errors.email}
                            </div>
                          )}
                        </div>
                      </div>

                      <div class="form-outline mb-4">
                        <div className="col-md-9">
                          <span
                            id="passwordHelpInline"
                            class="form-text"
                            style={{ marginBottom: "2px" }}
                          >
                            {" "}
                            <i className="fa fa-key"> &nbsp;&nbsp;</i>
                            PASSWORD
                          </span>
                          <input
                            type="password"
                            name="password"
                            class="form-control "
                            placeholder="Enter Your Password"
                            onChange={(e) =>
                              this.setState({ pwd: e.target.value })
                            }
                            required
                          />
                          {this.state.errors.pwd && (
                            <div className="text-danger">
                              {this.state.errors.pwd}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        type="submit"
                        style={{
                          background: "#8BC0FF",
                          width: 53 + "%",
                          height: 20 + "%",
                          color: "BLACK",
                          borderRadius: 20,
                          marginLeft: "10%",
                        }}
                      >
                        <i className="fa fa-check-circle"></i>&nbsp; SIGN IN
                      </Button>
                      <br /><br />

                      {/* <GoogleButton
                        onClick={() => {
                          // Redirect to the Google sign-in URL
                          window.location.href = "http://localhost:8070/auth/google";
                        }}
                      /> */}
                      <Button
                        startIcon={<GoogleIcon />}
                        style={{
                          background: "#FFFFFF",
                          width: "80%",
                          height: "20%",
                          color: "BLACK",
                          borderRadius: 20,
                          border: "1px solid #DDDDDD",
                          marginLeft: "-2%",
                        }}
                        onClick={() => {
                          // Redirect to the Google sign-in URL
                          window.location.href = "http://localhost:8070/auth/google";
                        }}
                      >
                        Sign in with Google
                      </Button>
                      <br />
                      <div class="divider d-flex align-items-center my-4">
                        <span
                          id="passwordHelpInline"
                          class="form-text"
                          style={{ marginBottom: "2px", marginLeft: "10%"}}
                        >
                          <center>
                            <label>New to UCL? &nbsp;&nbsp;</label>
                            <a href="/signup">Sign Up</a>
                          </center>
                        </span>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <Footer />
      </div>
    );
  }
}



