import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminFeedback from "./Admin_Feedback";
import Button from "@material-ui/core/Button";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import { saveAs } from "file-saver";

const AdminFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8070/admin/getcomments"
      );
      if (response.data && response.data.feedbacks) {
        setFeedbacks(response.data.feedbacks);
      } else {
        console.error("Invalid response from the server");
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error.message);
    }
  };

  const generateReport = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8070/generatefeedbackreport",
        { feedbacks },
        {
          responseType: "arraybuffer",
          headers: { Accept: "application/pdf" }
        }
      );

      if (response.data) {
        alert("Report Generated");
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        saveAs(pdfBlob, "Feedbacks.pdf");
      } else {
        console.error("Invalid response from the server");
      }
    } catch (error) {
      console.error("Error generating report:", error.message);
    }
  };

  return (
    <div>
      <Button
        className="form-group"
        id="bb"
        type="submit"
        style={{ background: "#41AAC8", width: "40%", align: "right" }}
        startIcon={<InsertDriveFileIcon />}
        onClick={generateReport}
      >
        Generate Report
      </Button>
      <br />
      <br />
      {feedbacks.map((feedback) => (
        <div key={feedback.id}>
          {/* Assuming AdminFeedback component needs to be implemented */}
          <AdminFeedback
            studentName={feedback.studentName}
            rating={feedback.rating}
            comment={feedback.comment}
            studentPicture={feedback.studentPicture}
            date={feedback.date}
          />
        </div>
      ))}
    </div>
  );
};

export default AdminFeedbacks;
