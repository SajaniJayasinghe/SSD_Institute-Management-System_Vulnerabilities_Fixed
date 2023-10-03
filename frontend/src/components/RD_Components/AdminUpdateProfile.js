import React, { useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import SendIcon from '@material-ui/icons/Send';
import DOMPurify from "dompurify"; // Import DOMPurify

const AdminUpdateProfile = ({
    upadminName,
    upemail,
    upNIC,
    upphone,
    show,
    onHide
}) => {
    const [adminName, setAdminName] = useState(DOMPurify.sanitize(upadminName));
    const [email, setEmail] = useState(DOMPurify.sanitize(upemail));
    const [NIC, setNIC] = useState(DOMPurify.sanitize(upNIC));
    const [phone, setPhone] = useState(DOMPurify.sanitize(upphone));

    const updateUserProfile = async (e) => {
        e.preventDefault();
        const config = {
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
        };

        const sanitizedAdminName = DOMPurify.sanitize(adminName);
        const sanitizedEmail = DOMPurify.sanitize(email);
        const sanitizedNIC = DOMPurify.sanitize(NIC);
        const sanitizedPhone = DOMPurify.sanitize(phone);

        // Check for vulnerable inputs
        if (
            adminName !== sanitizedAdminName ||
            email !== sanitizedEmail ||
            NIC !== sanitizedNIC ||
            phone !== sanitizedPhone
        ) {
            alert("Please enter valid Inputs");
            return;
        }

        const updateObject = {
            adminName: sanitizedAdminName,
            email: sanitizedEmail,
            NIC: sanitizedNIC,
            phone: sanitizedPhone,
        };

        await axios
            .put("http://localhost:8070/admin/adminupdate", updateObject, config)
            .then((res) => {
                alert("Your Profile updated successfully");
                window.setTimeout(function () {
                    window.location = "/adminprofile";
                }, 2000);
            })
            .catch((err) => {
                console.log(err);
                alert(err.message);
            });
    };

    return (
        <div>
            <Modal show={show} onHide={onHide} animation={true} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <div style={{ background: "#F8F8FF" }}>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: "Black" }} id="contained-modal-title-vcenter" className="text-color">Update My Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={updateUserProfile} className="text-color">
                            <div className="form-group row mb-3">
                                <div className="col-sm-6">
                                    <small className="text-muted">Change Your Name</small>
                                    <input type="text" className="form-control form-control-user" value={adminName} onChange={(e) => setAdminName(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <small className="text-muted">Change Your Email</small>
                                    <input readOnly type="text" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <small className="text-muted">Change Your NIC</small>
                                    <input type="text" className="form-control" value={NIC} onChange={(e) => setNIC(e.target.value)} required />
                                </div>
                                <div className="col-sm-6">
                                    <small className="text-muted">Change Phone Number</small>
                                    <input type="text" className="form-control form-control-user" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                                </div>
                            </div>
                            <br /><br />
                            <center>
                                <Button variant="contained" style={{ background: "#728FCE", color: "black", width: "30%" }} className="w-10" startIcon={<SendIcon />} disableElevation type="submit">Update My Profile</Button>
                            </center>
                        </form>
                    </Modal.Body>
                </div>
            </Modal>
        </div>
    );
}

export default AdminUpdateProfile;
