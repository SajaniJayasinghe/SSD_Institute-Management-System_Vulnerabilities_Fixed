import React, { useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import StarRating from "stars-rating";
import CommentIcon from "@material-ui/icons/Comment";
import Button from "@material-ui/core/Button";
import DOMPurify from "dompurify";

const UpdateFeedback = ({
  comment,
  rating,
  feedbackID,
  courseID,
  show,
  onHide
}) => {
  const [newRating, setNewRating] = useState(rating);
  const [newComment, setNewComment] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const updateRating = (r) => {
    setNewRating(r);
  };

  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input);
  };

  const updateFeedback = async (e) => {
    e.preventDefault();
    const sanitizedComment = sanitizeInput(newComment);

    if (sanitizedComment !== newComment) {
      setAlertMessage("Please enter a valid comment.");
      return;
    }

    const updatedFeedback = {
      rating: newRating,
      comment: sanitizedComment
    };

    const config = {
      headers: {
        Authorization: localStorage.getItem("Authorization"),
        "content-type": "application/json"
      }
    };

    await axios
      .put(
        `http://localhost:8070/feedbacks/update/${courseID}/${feedbackID}`,
        updatedFeedback,
        config
      )
      .then((res) => {
        alert(res.data.status);
        window.location = `/specific/${courseID}`;
      })
      .catch((err) => {
        console.log(err);
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
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            className="text-color"
          >
            Edit Feedback
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="text-color">
            <label className="text-color">Change Your Rating</label>
            <StarRating
              count={5}
              size={40}
              color2={"#eb8a2f"}
              value={newRating}
              onChange={updateRating}
            />
            <br />
            <label className="text-color">Change Your Comment</label>
            <textarea
              rows={5}
              className="form-control"
              variant="outlined"
              onChange={(e) => {
                setNewComment(e.target.value);
              }}
              required
            >
              {comment}
            </textarea>
            <br />
            {alertMessage && (
              <div className="alert alert-danger">{alertMessage}</div>
            )}
            <Button
              variant="contained"
              className="w-10"
              style={{
                background: "rgb(139, 192, 255)",
                width: 100 + "%"
              }}
              startIcon={<CommentIcon />}
              disableElevation
              type="submit"
              onClick={updateFeedback}
            >
              update comment
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UpdateFeedback;
