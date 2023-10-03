import React, { useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/Send";
import DOMPurify from "dompurify";

const UpdateProfile = ({
  upstudentName,
  upemail,
  upNIC,
  upphone,
  show,
  onHide,
}) => {
  const [studentName, setstudentName] = useState(upstudentName);
  const [email, setEmail] = useState(upemail);
  const [NIC, setNIC] = useState(upNIC);
  const [phone, setphone] = useState(upphone);

  const isVulnerable = () => {
    // Check for vulnerable inputs using DOMPurify
    return (
      DOMPurify.sanitize(studentName) !== upstudentName ||
      DOMPurify.sanitize(email) !== upemail ||
      DOMPurify.sanitize(NIC) !== upNIC ||
      DOMPurify.sanitize(phone) !== upphone
    );
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    if (isVulnerable()) {
      alert("Please enter valid Inputs.");
      return;
    }

    const config = {
      headers: {
        Authorization: localStorage.getItem("Authorization"),
      },
    };

    const updateObject = {
      studentName: studentName,
      email: email,
      NIC: NIC,
      phone: phone,
    };

    await axios
      .put("http://localhost:8070/student/update", updateObject, config)
      .then((res) => {
        //   toast.success('Your Profile updated successfully',{position:toast.POSITION.TOP_CENTER});
        alert("Your Profile updated successfully");
        window.setTimeout(function () {
          window.location = "/profile";
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={onHide}
        animation={true}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <div style={{ background: "#F8F8FF" }}>
          <Modal.Header closeButton>
            <Modal.Title
              style={{ color: "Black" }}
              id="contained-modal-title-vcenter"
              className="text-color"
            >
              Update My Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={updateUserProfile} className="text-color">
              <div className="form-group row mb-3">
                <div className="col-sm-6">
                  <small className="text-muted">Change Your Name</small>
                  <input
                    type="text"
                    className="form-control form-control-user"
                    value={studentName}
                    onChange={(e) => setstudentName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <small className="text-muted">Change Your Email</small>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <small className="text-muted">Change Your NIC</small>
                  <input
                    type="text"
                    className="form-control"
                    value={NIC}
                    onChange={(e) => setNIC(e.target.value)}
                    required
                  />
                </div>

                <div className="col-sm-6">
                  <small className="text-muted">Change Phone Number</small>
                  <input
                    type="text"
                    className="form-control form-control-user"
                    value={phone}
                    onChange={(e) => setphone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <br /> <br />
              <center>
                <Button
                  variant="contained"
                  style={{
                    background: "#728FCE",
                    color: "black",
                    width: 30 + "%",
                  }}
                  className="w-10"
                  startIcon={<SendIcon />}
                  disableElevation
                  type="submit"
                >
                  Update My Profile
                </Button>
              </center>
            </form>
          </Modal.Body>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateProfile;

