import React, { useState } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import Footer from "../Layouts/footer";
import UserNavBar from "../Layouts/UserNavBar";
import DOMPurify from "dompurify";

export default function AdminRegistration() {
  const [adminName, setadminName] = useState("");
  const [email, setemail] = useState("");
  const [pwd1, setPassowrd1] = useState("");
  const [pwd2, setPassowrd2] = useState("");
  const [NIC, setNIC] = useState("");
  const [phone, setphone] = useState("");
  const [errors, setErrors] = useState({
    adminName: "",
    email: "",
    pwd1: "",
    pwd2: "",
    NIC: "",
    phone: "",
  });

  const sendData = async (e) => {
    e.preventDefault();

    const sanitizedAdminName = DOMPurify.sanitize(adminName);
    const sanitizedEmail = DOMPurify.sanitize(email);
    const sanitizedPwd1 = DOMPurify.sanitize(pwd1);
    const sanitizedPwd2 = DOMPurify.sanitize(pwd2);
    const sanitizedNIC = DOMPurify.sanitize(NIC);
    const sanitizedPhone = DOMPurify.sanitize(phone);

    let newAdmin = {
      adminName: sanitizedAdminName,
      email: sanitizedEmail,
      pwd: sanitizedPwd1,
      NIC: sanitizedNIC,
      phone: sanitizedPhone,
    };

    const validationErrors = {};

    // Admin Name validation
    if (!sanitizedAdminName.trim()) {
      validationErrors.adminName = "Admin Name is required.";
    } else if (sanitizedAdminName.length > 50) {
      validationErrors.adminName = "Admin Name should be less than 50 characters.";
    }

    // Email validation
    if (!sanitizedEmail.trim()) {
      validationErrors.email = "Email Address is required.";
    } else if (!/^.+@.+\..+$/.test(sanitizedEmail)) {
      validationErrors.email = "Invalid Email Address.";
    } else if (sanitizedEmail.length > 100) {
      validationErrors.email = "Email should be less than 100 characters.";
    }

    // Password validation
    if (!sanitizedPwd1.trim()) {
      validationErrors.pwd1 = "Password is required.";
    } else if (sanitizedPwd1.length < 6) {
      validationErrors.pwd1 = "Password should be at least 6 characters.";
    }

    // Confirm Password validation
    if (sanitizedPwd1 !== sanitizedPwd2) {
      validationErrors.pwd2 = "Passwords do not match.";
    }

    // NIC validation
    if (!sanitizedNIC.trim()) {
      validationErrors.NIC = "NIC is required.";
    } else if (sanitizedNIC.length < 6) {
      validationErrors.NIC = "NIC should be at least 6 characters.";
    }

    // Phone Number validation
    if (!sanitizedPhone.trim()) {
      validationErrors.phone = "Phone Number is required.";
    } else if (!/^[0-9]{10}$/.test(sanitizedPhone)) {
      validationErrors.phone = "Invalid Phone Number (must be 10 digits).";
    }

    // If there are validation errors, set them and show an alert message
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert("Please enter valid Inputs.");
      return;
    }

    // If all validations pass, clear any previous errors
    setErrors({});

    if (sanitizedPwd1 === sanitizedPwd2) {
      axios
        .post("http://localhost:8070/admin/adminsignup", newAdmin)
        .then(() => {
          alert("Registration Success");
          window.location = "/adminsignin";
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      alert("Password mismatch");
    }

    setadminName("");
    setemail("");
    setPassowrd1("");
    setPassowrd2("");
    setNIC("");
    setphone("");
  };

  return (
    <div>
      <UserNavBar />
      <br />
      <br />
      <div>
        <div className="row d-flex align-items-center justify-content-center">
          <div
            style={{
              width: 1000,
              background: "#DCEAFB",
              height: 600,
              borderRadius: "20px",
            }}
          >
            <div className="card-body">
              <form action="" method="post" name="form" onSubmit={sendData}>
                <div className="row g-0">
                  <div className="col-xl-7 d-none d-xl-block">
                    <br />
                    <br />
                    <h3>
                      {" "}
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <b>
                        <u>ADMIN&nbsp;&nbsp;REGISTERATION</u>
                      </b>
                    </h3>
                    <br />
                    <br />
                    <img
                      src="https://res.cloudinary.com/nibmsa/image/upload/v1662483007/Amerikada_t%C9%99hsil_uzaq_deyil__-removebg-preview_fdicdn.png"
                      style={{ width: 550 }}
                    />
                  </div>

                  <div className="col-xl-5">
                    {" "}
                    <br />
                    <div className="form-outline mb-2">
                      <br />
                      <span
                        id="passwordHelpInline"
                        className="form-text"
                        style={{ marginBottom: "2px" }}
                      >
                        <i className="fa fa-user"></i>&nbsp;&nbsp;&nbsp;Full
                        Name
                      </span>
                      <div className="col-md-10">
                        <input
                          type="text"
                          className="form-control"
                          value={adminName}
                          onChange={(e) => setadminName(e.target.value)}
                          required
                        />
                        {errors.adminName && (
                          <div className="text-danger">{errors.adminName}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-outline mb-2">
                      <span
                        id="passwordHelpInline"
                        className="form-text"
                        style={{ marginBottom: "2px" }}
                      >
                        <i className="fa fa-envelope"></i>
                        &nbsp;&nbsp;&nbsp;Email Address
                      </span>
                      <div className="col-md-10">
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setemail(e.target.value)}
                          required
                        />
                        {errors.email && (
                          <div className="text-danger">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-outline mb-2">
                      <span
                        id="passwordHelpInline"
                        className="form-text"
                        style={{ marginBottom: "2px" }}
                      >
                        <i className="fa fa-key" aria-hidden="true"></i>
                        &nbsp;&nbsp;&nbsp;Password
                      </span>
                      <div className="col-md-10">
                        <input
                          type="password"
                          className="form-control"
                          value={pwd1}
                          onChange={(e) => setPassowrd1(e.target.value)}
                          data-toggle="tooltip"
                          data-placement="center"
                          title="Your password MUST contain at least 8 characters, including UPPER-lowercase letters and at least one number and a character = 'Sample@523'"
                          required
                        />
                        {errors.pwd1 && (
                          <div className="text-danger">{errors.pwd1}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-outline mb-2">
                      <span
                        id="passwordHelpInline"
                        className="form-text"
                        style={{ marginBottom: "2px" }}
                      >
                        <i className="fa fa-unlock-alt"></i>
                        &nbsp;&nbsp;&nbsp;Confirm Password
                      </span>
                      <div className="col-md-10">
                        <input
                          type="password"
                          className="form-control"
                          value={pwd2}
                          onChange={(e) => setPassowrd2(e.target.value)}
                          title="Your password MUST contain at least 8 characters, including UPPER-lowercase letters and at least one number and a character = 'Sample@523'"
                          required
                        />
                        {errors.pwd2 && (
                          <div className="text-danger">{errors.pwd2}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-outline mb-2">
                      <span
                        id="passwordHelpInline"
                        className="form-text"
                        style={{ marginBottom: "2px" }}
                      >
                        <i className="fa fa-address-card"></i>
                        &nbsp;&nbsp;&nbsp;NIC
                      </span>
                      <div className="col-md-10">
                        <input
                          type="text"
                          className="form-control"
                          value={NIC}
                          onChange={(e) => setNIC(e.target.value)}
                          required
                        />
                        {errors.NIC && (
                          <div className="text-danger">{errors.NIC}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-outline mb-2">
                      <span
                        id="passwordHelpInline"
                        className="form-text"
                        style={{ marginBottom: "2px" }}
                      >
                        <i className="fa fa-phone"></i>&nbsp;&nbsp;&nbsp;Phone
                        Number
                      </span>
                      <div className="col-md-10">
                        <input
                          type="text"
                          className="form-control"
                          value={phone}
                          onChange={(e) => setphone(e.target.value)}
                          pattern="[0-9]{10}"
                          required
                        />
                        {errors.phone && (
                          <div className="text-danger">{errors.phone}</div>
                        )}
                      </div>
                    </div>
                    <div className="d-flex justify-left pt-1">
                      <span
                        id="passwordHelpInline"
                        className="form-text"
                        style={{ marginBottom: "2px" }}
                      >
                        {" "}
                        Already Registered? &nbsp;&nbsp;
                      </span>
                      <a href="/adminsignin">Sign In</a>{" "}
                    </div>
                    <br />
                    <div className="d-flex justify-content-end">
                      <Button
                        type="submit"
                        style={{
                          background: "#8BC0FF",
                          width: 43 + "%",
                          height: 20 + "%",
                          color: "BLACK",
                          borderRadius: 20,
                          marginRight: 150,
                        }}
                      >
                        <i className="fa fa-check-circle" />
                        &nbsp;Submit
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <Footer />
    </div>
  );
}
