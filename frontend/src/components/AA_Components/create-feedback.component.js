import React, { useState, useCallback } from "react";
import Button from "@material-ui/core/Button";
import StarRating from "stars-rating";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import ChatIcon from "@material-ui/icons/Chat";
import DOMPurify from "dompurify";
// import Ratings from "./ratings.component";

const CreateFeedback = (courseID) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState(null);
  const [open, setOpen] = useState(false);
  const [ratings, setRatings] = useState({});

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const OnFormSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      setOpen(true);
      return;
    }

    if (comment.length > 100) {
      alert("Comment cannot exceed 100 characters.");
      return;
    }

    const sanitizedComment = DOMPurify.sanitize(comment); // Sanitize user input

    // Check if sanitized comment is different from original comment
    if (sanitizedComment !== comment) {
      alert("Please enter a valid comment.");
      return;
    }
    const feedback = {
      rating: rating,
      comment: sanitizedComment
    };

    const config = {
      headers: {
        Authorization: localStorage.getItem("Authorization"),
        "content-type": "application/json"
      }
    };
    axios
      .post(
        `http://localhost:8070/feedbacks/add/${courseID.courseID.courseID}`,
        feedback,
        config
      )
      .then((res) => {
        window.location.reload();
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Server error:", error.response.data);
          alert("An error occurred while processing your request.");
        } else if (error.request) {
          // The request was made but no response was received
          console.error("Request error:", error.request);
          alert("No response received from the server.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("General error:", error.message);
          alert("An unexpected error occurred.");
        }
      });
  };

  return (
    <div align="center">
      <div className="col-lg-40 col-sm-12 col-md-8 col-xs-12 product-col">
        <div className="pb-2">
          <br />
          <h3 className="text-color">
            <u>Add Your Feedback</u>
          </h3>
          <StarRating
            count={5}
            size={50}
            onChange={ratingChanged}
            color2={"#eb8a2f"}
            value={rating}
          />
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <div className="alert alert-danger">
              Please give your rating for product
            </div>
          </Snackbar>
          <form autoComplete="off" onSubmit={OnFormSubmit}>
            <textArea
              rows={6}
              className="form-control"
              placeholder="Enter your comment"
              variant="outlined"
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <div className="pt-3">
              <Button
                variant="contained"
                className="w-10"
                style={{
                  background: "rgb(139, 192, 255)",
                  width: 50 + "%",
                  borderRadius: "20px"
                }}
                startIcon={<ChatIcon />}
                disableElevation
                type="submit"
              >
                add my feedback
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFeedback;
