import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Toggles from "./AppointmentModal";
import clientAdapter from "../../../lib/clientAdapter";
import {
  FormGroup,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import moment from "moment-timezone";
import { styles } from "./lead.styles";

const View = (props) => {
  const data = props.data;
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [followUpDate, setFollowUpDate] = useState("");
  const [leadFeedback, setLeadFeedback] = useState("");
  const [leadFeedbackLoading, setLeadFeedbackLoading] = useState(false);
  const [feedbackList, setFeedbackList] = useState([]);
  const [status, setStatus] = useState("");
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showBookAppointment, setShowBookAppointment] = useState(false);
  const [leadStatus, setLeadStatus] = useState([]);

  const getLeadFeedback = async (leadId, page, limit) => {
    setLeadFeedbackLoading(true);
    try {
      const custFeedback = await clientAdapter.getLeadFeedback(
        leadId,
        page,
        limit
      );
      setLeadFeedbackLoading(false);
      setFeedbackList(custFeedback);
    } catch (error) {
      setLeadFeedbackLoading(false);
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

  const handleShow = () => {
    setShow(true);
    getLeadFeedback(data.id, 1, 10);
    getStatus();
    setStatus(data.leadStatus?.id);
    setFollowUpDate(
      moment(data?.followupDate, "Do MMM YYYY").format("YYYY-MM-DD")
    );
  };

  const submitFeedBack = async () => {
    try {
      const res = await clientAdapter.UpdateLeadStatus(data.id, {
        statusId: Number(status),
        followupDate: followUpDate ? moment(followUpDate).format() : null,
        leadFeedback: leadFeedback ? [leadFeedback] : null,
      });
      if (res === 200) {
        setStatus(status);
        setSnackbarText(`Lead information has been updated Successfully`);
        setSnackbarOpen(true);
        setTimeout(() => {
          setShowBookAppointment(false);
          window.location.reload();
        }, 3000);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <a variant="primary" className="toggle-buttons" onClick={handleShow}>
        <FontAwesomeIcon icon={faEye} className="lead-view" />
      </a>
      {showBookAppointment && (
        <Toggles
          data={data}
          showBookAppointment={showBookAppointment}
          page="viewModal"
        />
      )}

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="top"
        className="view-modal"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Leads Information</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body>
          <div className="row lead-details">
            <div className="col-md-12">
              <div className="modal-item-details mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <label className="view-label">Name :</label>
                    <span className="modal-item-name mb-4 mr3">
                      <div
                        href="#"
                        id=""
                        className="xeditable xeditable-price editable editable-click"
                        datatype="text"
                        data-value=""
                        data-pk=""
                        data-name=""
                        data-url=""
                        data-title="Edit Name"
                      >
                        {data.firstName}
                      </div>
                    </span>
                  </div>
                  <Button onClick={() => setShowBookAppointment(true)}>
                    Book Appointment
                  </Button>
                </div>
                <label className="view-label">Mobile :</label>
                <span className="modal-item-category modal-cust-mobile">
                  {data.mobile}
                </span>
                <br />
                <label className="view-label">Email :</label>
                <span className="modal-item-category modal-cust-email">
                  <a href="">{data.email}</a>
                </span>
              </div>
            </div>
          </div>
          <h4 style={{ fontFamily: "Russo One, sans-serif", fontSize: "18px" }}>
            Lead Details
          </h4>
          <table className="table table-bordered table-hover table-printed leads_details app-item-list">
            <thead>
              <tr>
                <th>Source</th>
                <th>Status</th>
                <th>Converted</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data.source}</td>
                <td>{data.status}</td>
                <td>{data.isConverted ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </table>
          <h4 style={{ fontFamily: "Russo One, sans-serif", fontSize: "18px" }}>
            Feedback History
          </h4>
          <div>
            <table className="table table-bordered table-hover table-scripted feedback_details app-item-list">
              <thead>
                <tr>
                  <th>Feedback</th>
                  <th>Created Date</th>
                </tr>
              </thead>
              <tbody>
                {leadFeedbackLoading ? (
                  <tr>
                    <td colSpan={2}>Loading...</td>
                  </tr>
                ) : (
                  <>
                    {feedbackList &&
                      feedbackList?.map((f, i) => {
                        return (
                          <>
                            {f.feedback && (
                              <tr key={i}>
                                <td>{f.feedback}</td>
                                <td>
                                  {moment(f.dateCreated).format(
                                    "DD/MM/YYYY hh:mm"
                                  )}
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <h4 style={{ fontFamily: "Russo One, sans-serif", fontSize: "18px" }}>
            New Feedback
          </h4>
          <FormGroup style={styles.formgroup}>
            <InputLabel style={styles.inputlabel}>Next Followup :</InputLabel>
            <Input
              type="date"
              disableUnderline={true}
              required
              size="small"
              style={styles.inputText}
              value={followUpDate}
              onChange={(e) => {
                setFollowUpDate(e.target.value);
              }}
            />
          </FormGroup>
          <FormGroup style={styles.formgroup}>
            <InputLabel style={styles.inputlabel}>Lead Feedback : </InputLabel>
            <Input
              type="text"
              multiline
              rows={5}
              disableUnderline={true}
              required
              size="small"
              placeholder="Please enter leads feedback"
              style={styles.inputText}
              onChange={(e) => setLeadFeedback(e.target.value)}
            />
          </FormGroup>
          <FormGroup style={styles.formgroup}>
            <InputLabel style={styles.inputlabel}>Lead Status :</InputLabel>
            <Select
              IconComponent={false}
              variant="standard"
              disableUnderline={true}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.inputText}
            >
              {leadStatus?.length
                ? leadStatus?.map((lead) => (
                    <MenuItem key={lead.id} value={lead?.id}>
                      {lead?.status}
                    </MenuItem>
                  ))
                : null}
            </Select>
          </FormGroup>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
          >
            <button
              type="button"
              className="btn button-close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => setShow(false)}
            >
              Close
            </button>
            <div
              className="btn button-book submit_feedback"
              id="submit_feedback"
              onClick={submitFeedBack}
            >
              Submit Feedback
            </div>
          </Box>
        </Offcanvas.Body>
      </Offcanvas>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarText}
        </Alert>
      </Snackbar>
    </>
  );
};

export default View;
