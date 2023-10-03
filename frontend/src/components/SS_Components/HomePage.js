import React, { Component } from "react";
import UserNavBar from "../Layouts/UserNavBar";
import Footer from "../Layouts/footer";

export default class HomePage extends Component {
  render() {
    return (
      <div>
        <UserNavBar />
        <br />
        <div style={{ backgroundColor: "black", height: "500px" }}>
          <div
            id="carouselExampleControls"
            class="carousel slide"
            data-bs-ride="carousel"
          >
            <div class="carousel-inner">
              <div class="carousel-item">
                <img
                  src="https://res.cloudinary.com/nibmsa/image/upload/v1661880729/banner_1_lp7l6z.jpg"
                  class="d-block w-100"
                  alt="..."
                ></img>
              </div>

              <div class="carousel-item">
                <img
                  src="https://www.sfu.ca/content/sfu/gls/current/degree-requirements/jcr:content/main_content/textimage/image.img.640.medium.jpg/1623172422265.jpg"
                  class="d-block w-100"
                  alt="..."
                ></img>
              </div>

              <div class="carousel-item">
                <img
                  src="https://3.files.edl.io/5063/21/10/05/015625-580aac0c-331c-43ac-a960-cead53f4bb4e.jpg"
                  class="d-block w-100"
                  alt="..."
                ></img>
              </div>

              <div class="carousel-item active">
                <img
                  src="https://assets-global.website-files.com/5b6df8bb681f89c158b48f6b/5d5a63bd3cb150951ed2df29_future-for-information-technology-technicians.jpg"
                  class="d-block w-100"
                  alt="..."
                ></img>
              </div>

              <div class="carousel-item">
                <img
                  src="https://tripurauniv.ac.in/UploadFile/AdminPanel/DepartmentImages/636385880219844359.jpg"
                  class="d-block w-100"
                  alt="..."
                ></img>
              </div>

              <div class="carousel-item">
                <img
                  src="https://iim.cmb.ac.lk/wp-content/uploads/2019/05/information-technology-header.jpg"
                  class="d-block w-100"
                  alt="..."
                ></img>
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span
                class="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Previous</span>
            </button>

            <button
              class="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>{" "}
          <br />
        </div>
        <div className="container">
          <br />
          <br /> <br /> <br /> <br /> <br /> <br /> <br />
        </div>
        <br />
        <Footer />
      </div>
    );
  }
}
