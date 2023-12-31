import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminUpdateProfile from './AdminUpdateProfile';
import CircularProgress from '@material-ui/core/CircularProgress';
import AdminNavBar from '../Layouts/AdminNavBar';
import Footer from "../Layouts/footer";

const AdminProfile = () => {
    const [adminName, setAdminName] = useState("");
    const [email, setEmail] = useState("");
    const [NIC, setNIC] = useState("");
    const [phone, setPhone] = useState("");

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const getUserData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: localStorage.getItem("Authorization")
                    },
                };
                await axios.get("http://localhost:8070/admin/adminprofile", config)
                    .then((res) => {
                        setAdminName(res.data.Adm.adminName);
                        setEmail(res.data.Adm.email);
                        setNIC(res.data.Adm.NIC);
                        setPhone(res.data.Adm.phone);
                        setShow(res.data.Adm.show);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.log(error.message);
                    });
            } catch (error) {
                console.log(error.message);
            }
        };
        getUserData();
    }, []);

    const updateUserProfile = () => {
        setShow(true);
    };

    const adminLogout = () => {
        if (window.confirm('Are you sure you wish to logout from this Account?')) {
            alert("Log out successfuly");
            localStorage.removeItem('role');
            localStorage.removeItem('Authorization');
            window.location = "/";
        }
    };

    const deleteAccount = async () => {
        const config = {
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
        };

        if (window.confirm('Are you sure you wish to delete this Account?')) {
            await axios.delete('http://localhost:8070/admin/admindelete', config)
                .then((res) => {
                    alert("Your account deleted successfully");
                    localStorage.removeItem('role');
                    localStorage.removeItem('Authorization');
                    window.location = "/adminsignup";
                })
                .catch((err) => {
                    console.log(err.message);
                });
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
            <AdminNavBar />
            <br /><br /> <br /><br /> <br /><br />
            <div class="container">
                <div class="main-bod">
                    <div class="row gutters-sm">
                        <div class="col-md-4 mb-3">
                            <div class="cardd">
                                <div class="cardd-body">
                                    <div class="d-flex flex-column align-items-center text-center">
                                        <img src="https://www.citypng.com/public/uploads/small/11640168385jtmh7kpmvna5ddyynoxsjy5leb1nmpvqooaavkrjmt9zs7vtvuqi4lcwofkzsaejalxn7ggpim4hkg0wbwtzsrp1ldijzbdbsj5z.png" class="rounded-circle" width="200" height="200" />
                                        <div class="mt-3">
                                            <h2><b>{adminName}</b></h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="cardd mb-3">
                                <div class="cardd-body">
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0"><b>Full Name</b></h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <b>{adminName}</b>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0"><b>Email</b></h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <b>{email}</b>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0"><b>NIC</b></h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <b>{NIC}</b>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-3">
                                            <h6 class="mb-0"><b>Phone Number</b></h6>
                                        </div>
                                        <div class="col-sm-9 text-secondary">
                                            <b>{phone}</b>
                                        </div>
                                    </div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-sm-12"><br />
                                            <center>
                                                <button style={{ background: "#4863A0", color: "#ffff" }} onClick={updateUserProfile} class="btn btn " target="__blank">Edit Profile Details</button>&nbsp;&nbsp;&nbsp;
                                                <button style={{ background: "#4863A0", color: "#ffff" }} onClick={adminLogout} class="btn btn " target="__blank">Log Out</button>&nbsp;&nbsp;&nbsp;
                                                <button style={{ background: "#4863A0", color: "#ffff" }} onClick={deleteAccount} class="btn btn " target="__blank">Delete</button>
                                            </center>
                                        </div>
                                    </div><br /><br /><br /><br /><br /><br /><br />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <AdminUpdateProfile
                    show={show}
                    onHide={() => setShow(false)}
                    upadminName={adminName}
                    upemail={email}
                    upNIC={NIC}
                    upphone={phone}
                />
            </div>
            <Footer />
        </div>
    );
};

export default AdminProfile;
