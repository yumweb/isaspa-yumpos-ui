import { Backdrop, Box, Button, CircularProgress } from "@mui/material";
import React from "react";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import clientAdapter from "../../../lib/clientAdapter";
import { Snackbar, Alert } from "@mui/material";
import { styles } from "./lead.styles";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const LeadGenerator = () => {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [statusId, setStatusId] = useState("");
  const [fromCampaign, setFromCampaign] = useState("");
  const [leadFeedback, setLeadFeedBack] = useState("");
  const [followupDate, setFollowUpDate] = useState("");
  const [leadSourceItems, setLeadSourceItems] = useState([]);
  const [leadStatus, setLeadStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = React.useState({
    firstName: "",
    mobile: "",
    email: "",
    status: "",
    fromCampaign: "",
    followupDate: "",
  });
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });
  const handleClose = () => {
    clearData();
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
    getLeadSourceItems();
    getStatus();
  };

  const handleSnackbarClose = () => {
    setSnackBar({ ...snackBar, open: false });
  };

  const handleCampaign = (e) => {
    setFromCampaign(e.target.value);
  };
  const getLeadSourceItems = async () => {
    try {
      const res = await clientAdapter.getLeadSource();
      setLeadSourceItems(res);
    } catch (error) {
      setLeadSourceItems([]);
    }
  };
  const getStatus = async () => {
    try {
      const response = await clientAdapter.getLeadStatus();
      if (response) {
        setLeadStatus(response);
      }
    } catch (error) {
      console.log("error from get lead status", error);
    }
  };
  const clearData = () => {
    setFirstName(" ");
    setLastName("");
    setEmail("");
    setMobile("");
    setStatusId("");
    setFromCampaign("");
    setFollowUpDate("");
    setLeadFeedBack("");
    setErrors({
      firstName: "",
      mobile: "",
      email: "",
      status: "",
      fromCampaign: "",
      followupDate: "",
    });
  };
  const focusInputById = (id) => {
    const inputElement = document.getElementById(id);
    if (inputElement) {
      inputElement.focus();
    }
  };
  const onValidation = () => {
    let isValid = true;
    if (!firstName) {
      handleError("First Name is Required", "firstName");
      isValid = false;
      return;
    } else if (!firstName.trim().length) {
      handleError("First Name is Required", "firstName");
      isValid = false;
      return;
    }

    if (!email) {
      handleError("Email is Required", "email");
      isValid = false;
      return;
    }
    if (!mobile) {
      handleError("Phone Number is required", "mobile");
      isValid = false;
      return;
    }

    if (!statusId) {
      handleError("Lead status is required", "status");
      isValid = false;
      return;
    }

    if (!fromCampaign) {
      handleError("Lead From Campaign is required", "fromCampaign");
      isValid = false;
      return;
    }
    if (!followupDate) {
      handleError("Folowup date is required", "followupDate");
      isValid = false;
      return;
    }

    if (isValid) {
      return true;
    }
  };
  const handleError = (error, input) => {
    setErrors({ [input]: error });

    focusInputById(input);
  };

  const createLead = async () => {
    if (onValidation()) {
      setLoading(true);
      const data = {
        firstName,
        lastName,
        email,
        mobile,
        statusId: Number(statusId),
        fromCampaign: Number(fromCampaign),
        leadFeedback: leadFeedback ? [leadFeedback] : null,
        followupDate: followupDate,
      };
      try {
        const res = await clientAdapter.createLead(data);
        if (res) {
          setSnackBar({
            ...snackBar,
            open: true,
            severity: "success",
            message: "Lead Generated Successfully",
          });
          clearData();
          setShow(false);
          window.location.reload()
        }
      } catch (error) {
        setSnackBar({
          ...snackBar,
          open: true,
          severity: "error",
          message: error || "Something went wrong",
        });
      }
      setLoading(false);
    }
  };

  return (
    <>
      <div
        variant="primary"
        className="toggle-button"
        onClick={handleShow}
      >
        New Lead
      </div>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="top"
        className="modal-4"
      >
        <Offcanvas.Header closeButton>
          <div>
            <Offcanvas.Title>Leads Generator</Offcanvas.Title>
          </div>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body>
          <div className="row new-lead">
            <div className="form-group">
              <label
                for="cust_first_name"
                className="required col-sm-3 col-md-3 col-lg-2 control-label"
              >
                First Name :
              </label>
              <div className="col-sm-9 col-md-9 col-lg-10">
                <input
                  type="text"
                  name="cust_first_name"
                  id="firstName"
                  className="form-control-lead"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <div style={styles.errorText}>{errors.firstName}</div>
              </div>
            </div>
            <div className="form-group">
              <label
                for="cust_last_name"
                className="col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Last Name :
              </label>
              <div className="col-sm-9 col-md-9 col-lg-10">
                <input
                  type="text"
                  name="cust_last_name"
                  id="cust_last_name"
                  className="form-control-lead"
                  onChange={(e) => setLastName(e.target.value)}
                ></input>
              </div>
            </div>
            <div className="form-group">
              <label
                for="email"
                className="required col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Email :
              </label>
              <div className="col-sm-9 col-md-9 col-lg-10">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control-lead"
                  size="8"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div style={styles.errorText}>{errors.email}</div>
              </div>
            </div>
            <div className="form-group">
              <label
                for="phone_number"
                className="required col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Phone Number :
              </label>
              <div className="col-sm-9 col-md-9 col-lg-10">
                <input
                  type="text"
                  name="phone_number"
                  id="mobile"
                  className="form-control-lead"
                  size="10"
                  value={mobile}
                  onChange={(e) => {
                    const input = e.target.value;
                    if (/^[0-9]*$/.test(input) && input.length <= 10) {
                      setMobile(input);
                    }
                  }}
                  pattern="[0-9]*"
                />
                <div style={styles.errorText}>{errors.mobile}</div>
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="lead_from_campaign"
                className="required wide col-sm-3 col-md-3 col-lg-2 control-label no-wrap"
              >
                Lead Status :
              </label>
              <div className="col-sm-9 col-md-9 col-lg-10">
                <select
                  id="status"
                  name="lead_from_cust_campaign"
                  className="form-control-lead"
                  onChange={(e) => setStatusId(e.target.value)}
                  value={statusId}
                >
                  <option value={""} disabled>
                    Select Lead Status
                  </option>
                  {leadStatus?.length &&
                    leadStatus?.map((lead) => (
                      <option key={lead.id} value={lead?.id}>
                        {lead?.status}
                      </option>
                    ))}
                </select>
                <div style={styles.errorText}>{errors.status}</div>
              </div>
            </div>

            <div className="form-group">
              <label
                for="lead_from_campaign"
                className="required wide col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Lead from Campaign :
              </label>
              <div className="col-sm-9 col-md-9 col-lg-10">
                <select
                  id="fromCampaign"
                  name="lead_from_cust_campaign"
                  className="form-control-lead"
                  onChange={handleCampaign}
                  value={fromCampaign}
                >
                  <option value={""} disabled>
                    Select Lead Source
                  </option>
                  {leadSourceItems?.length &&
                    leadSourceItems?.map((lead) => (
                      <option key={lead.id} value={lead.id}>
                        {lead.source}
                      </option>
                    ))}
                </select>
                <div style={styles.errorText}>{errors.fromCampaign}</div>
              </div>
            </div>
            <div className="form-group">
              <label
                id="follow_up_feedback"
                for="follow_up_feedback"
                className=" required col-sm-3 col-md-3 col-lg-2 control-label "
              >
                Next Follow-Up:
              </label>
              <div className="col-sm-9 col-md-9 col-lg-10">
                <ReactDatePicker
                  showIcon
                  id="followupDate"
                  className="form-control-lead-date"
                  selected={followupDate}
                  onChange={(date) => setFollowUpDate(date)}
                  minDate={new Date()}
                />
                <div style={styles.errorText}>{errors.followupDate}</div>
              </div>
            </div>
            <div className="form-group">
              <label
                id="lead_feedback"
                for="lead_feedback"
                className="col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Lead Feedback :
              </label>
              <div className="col-sm-9 col-md-9 col-lg-10">
                <textarea
                  name="lead_feedback"
                  cols={60}
                  rows={4}
                  id="lead_feedback"
                  className="form-control text-area lead_feedback"
                  onChange={(e) => setLeadFeedBack(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>

          <Box display={"flex"} justifyContent={"flex-end"}>
            <Button
              type="button"
              className="btn button-close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => setShow(false)}
            >
              Close
            </Button>
            <Button
              type="submit"
              className="btn button-book"
              id="leads_book_appointment"
              onClick={() => createLead()}
            >
              Generate Lead
            </Button>
            <Backdrop open={loading}>
              <CircularProgress color="inherit" />
            </Backdrop>
          </Box>
        </Offcanvas.Body>
      </Offcanvas>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackBar.severity}
          sx={{ width: "100%" }}
        >
          {snackBar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LeadGenerator;
