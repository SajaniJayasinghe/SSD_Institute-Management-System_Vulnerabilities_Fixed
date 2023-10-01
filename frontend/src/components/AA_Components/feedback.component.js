import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import StarRating from "stars-rating";
import ShowMoreText from "react-show-more-text";
import DeleteIcon from "@material-ui/icons/Delete";
import UpdateIcon from "@material-ui/icons/Edit";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import jwt from "jsonwebtoken";
import axios from "axios";
import UpdateFeedback from "./UpdateFeedback";
// import { JSDOM } from "jsdom";
// import dompurify from "dompurify";

// @ material ui styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
      padding: 5
    },
    color: "#dd2c00"
  }
}));

const useUpdate = makeStyles((theme) => ({
  root: {
    // color: "#f4511e"
  }
}));

const useDelete = makeStyles((theme) => ({
  root: {
    // color: "#dd2c00"
  }
}));

const useForceUpdate = () => useState()[1];

// @ component function
const Feedback = ({
  id,
  courseID,
  studentId,
  studentName,
  studentPicture,
  rating,
  comment
}) => {
  const classes = useStyles();
  const deleteButton = useDelete();
  const update = useUpdate();
  const token = localStorage.getItem("Authorization");
  const [open, setOpen] = useState(false);
  const [onHide, setOnHide] = useState(true);
  const forceUpdate = useForceUpdate();
  // let verify = null;
  // if (token) {
  //   verify = jwt.verify(token, "jwtSecret");
  // } else {
  //   verify = null;
  // }
  // console.log(verify);

  // const sanitizeComment = (unsafeComment) => {
  //   const { window } = new JSDOM("");
  //   const DOMPurify = require("dompurify")(window);

  //   return DOMPurify.sanitize(unsafeComment);
  // };

  // const sanitizedComment = sanitizeComment(comment);

  // const isVulnerableInput = sanitizedComment !== comment;

  // const showVulnerabilityAlert = () => {
  //   alert("Please enter a valid comment.");
  // };

  const updateComment = () => {
    setOpen(true);
    setOnHide(true);
  };

  const deleteComment = async () => {
    const config = {
      headers: {
        Authorization: localStorage.getItem("Authorization"),
        "content-type": "application/json"
      }
    };

    if (window.confirm("Are you sure you wish to delete this Feedback?")) {
      await axios
        .delete(
          `http://localhost:8070/feedbacks/delete/${courseID}/${id}`,
          config
        )
        .then((res) => {
          alert("Your Comment Deleted");
          window.location = `/specific/${courseID}`;
        })
        .catch((error) => {
          console.log(error.message);
          alert("Your Comment Deleted");
          window.location = `/specific/${courseID}`;
        });
    }
  };

  return (
    <div className="pb-2 pr-2" align="center">
      <Paper style={{ padding: 10, borderRadius: 8 }} variant="outlined">
        <ul className="aa" style={{ display: "flex" }}>
          <label>
            <li>
              <Avatar
                alt="Remy Sharp"
                src={studentPicture}
                style={{ width: 50, height: 50 }}
              />
            </li>
            <li>
              <div
                style={{
                  pointerEvents: "none",
                  fontWeight: "bold",
                  paddingLeft: 10
                }}
              >
                {studentName}
              </div>

              <div
                style={{
                  textAlign: "left",
                  pointerEvents: "none",
                  paddingLeft: 10
                }}
              >
                <StarRating
                  count={5}
                  size={23}
                  value={rating}
                  color2={"#eb8a2f"}
                />
              </div>
            </li>
          </label>
        </ul>
        <div style={{ fontSize: 15 }}>
          <div style={{ paddingLeft: 105, display: "flex" }}>{comment}</div>
          {/* <div style={{ fontSize: 15 }}>
          <div style={{ paddingLeft: 105, display: "flex" }}>
            <ShowMoreText
              lines={3}
              more="Show more"
              less="Show less"
              anchorClass=""
            >
              <div
                dangerouslySetInnerHTML={{ __html: sanitizedComment }}
                onClick={() => {
                  if (isVulnerableInput) {
                    showVulnerabilityAlert();
                  }
                }}
              />
            </ShowMoreText>
          </div> */}

          {/* {verify === null || studentId !== verify._id ? (
            <div></div>
          ) : ( */}
          <div className="d-flex justify-content-end">
            <div style={{ paddingTop: 8 }}>
              <IconButton
                aria-label="delete"
                color="inherit"
                onClick={deleteComment}
              >
                <DeleteIcon className={deleteButton.root} fontSize="small" />
              </IconButton>
              <IconButton
                aria-label="update"
                color="inherit"
                onClick={updateComment}
              >
                <UpdateIcon className={update.root} fontSize="small" />
              </IconButton>
            </div>
          </div>
          {/* )} */}
        </div>
      </Paper>

      <UpdateFeedback
        comment={comment}
        rating={rating}
        feedbackID={id}
        courseID={courseID}
        show={open}
        onHide={() => setOpen(false)}
      />
    </div>
  );
};

export default Feedback;
