import React, { Component } from 'react';
import axios from 'axios';
import Button from "@material-ui/core/Button";
import Footer from '../Layouts/footer';
import UserNavBar from "../Layouts/UserNavBar";
import DOMPurify from 'dompurify'; // Import DOMPurify

class AdminLogin extends Component {
    constructor(props) {
        super(props);
        this.AdminLoginSubmit = this.AdminLoginSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            email: "",
            pwd: "",
            token: "",
            open: false,
        };
    }

    async AdminLoginSubmit(e) {
        e.preventDefault();
        const userData = {
            email: DOMPurify.sanitize(this.state.email), // Sanitize the user inputs
            pwd: DOMPurify.sanitize(this.state.pwd), // Sanitize the user inputs
        };

        // Check if both email and password are not empty
        if (!userData.email || !userData.pwd) {
            alert('Please enter valid inputs');
            return;
        }

        await axios.post("http://localhost:8070/admin/adminsignin", userData)
            .then((res) => {
                this.setState({
                    token: res.data.token
                });
                console.log(this.state.token);
                localStorage.setItem("Authorization", res.data.token);
                window.location = "/admindashboard";
                alert('Login Successful!!');
            })
            .catch((err) => {
                console.log(err);
                this.setState({ open: true });
                alert('Login Failed. Please Try again!!', err);
            });
    }

    handleClose(reason) {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false });
    }

    render() {
        return (
            <div>
                <UserNavBar /><br /><br /><br />
                <div class="row d-flex align-items-center justify-content-center">
                    <div style={{ width: 800, background: "#E8F2FF", height: 500, borderRadius: "20px" }}>
                        <div class="card-body">
                            <div class="container py-5 h-90">
                                <div class="row d-flex align-items-center justify-content-center h-100">
                                    <div class="col-md-8 col-lg-7 col-xl-6">
                                        <img src="https://assets.applyboard.com/assets/session/login-eadf850accc5cb732e5af77f3318cdd89d2de72e00d0a3054b48ab60a11ff7f1.svg" class="img-fluid" alt="Phone image" /><br /><br />
                                        <h2>&nbsp;&nbsp;&nbsp;&nbsp;<u><b>ADMIN&nbsp;&nbsp;LOGIN</b></u></h2>
                                    </div>
                                    <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
                                        <form onSubmit={this.AdminLoginSubmit} name="form">
                                            <div class="form-outline mb-4">
                                                <div className="col-md-9">
                                                    <span id="passwordHelpInline" class="form-text" style={{ marginBottom: '2px' }}> <i className="fa fa-lock"> &nbsp;&nbsp;</i> USER EMAIL ADDRESS </span>
                                                    <input type="text" name="email" placeholder='Enter Your Email' class="form-control "
                                                        onChange={e => this.setState({ email: e.target.value })} required />
                                                </div>
                                            </div>
                                            <div class="form-outline mb-4">
                                                <div className="col-md-9">
                                                    <span id="passwordHelpInline" class="form-text" style={{ marginBottom: '2px' }}> <i className="fa fa-key"> &nbsp;&nbsp;</i> PASSWORD</span>
                                                    <input type="password" name="password" class="form-control " placeholder="Enter Your Password"
                                                        onChange={e => this.setState({ pwd: e.target.value })} required />
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
                                                }}>
                                                <i className="fa fa-check-circle"></i>&nbsp; SIGN IN
                                            </Button>
                                            <div class="divider d-flex align-items-center my-4">
                                                <span id="passwordHelpInline" class="form-text" style={{ marginBottom: '2px' }}>
                                                    <center><label>Don't have an account? &nbsp;&nbsp;</label>
                                                        <a href='/adminsignup'>Sign Up</a></center>
                                                </span>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div><br /><br /><br />
                <Footer />
            </div>
        )
    }
}

export default AdminLogin;
