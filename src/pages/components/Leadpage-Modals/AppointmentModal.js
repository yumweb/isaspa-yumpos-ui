import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import clientAdapter from "../../../lib/clientAdapter";
import { Snackbar, Alert } from "@mui/material";

const Toggles = (props) => {
  const data = props.data;
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [gender, setGender] = React.useState("male");
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [leadSourceItems, setLeadSourceItems] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSnackbarClose = () => setSnackBar({ ...snackBar, open: false });

  const onValidation = () => {
    let isValid = true;
    if (!data.firstName) {
      isValid = false;
      return;
    } else if (!data.firstName.trim().length) {
      isValid = false;
      return;
    }

    if (!data.email) {
      isValid = false;
      return;
    }

    if (!data.mobile) {
      isValid = false;
      return;
    }

    if (!gender) {
      isValid = false;
      return;
    }

    if (!data.leadSource.id) {
      isValid = false;
      return;
    }

    if (isValid) {
      return true;
    }
  };

  const createCustomer = async () => {
    const customerExist = await clientAdapter.checkCustomerExist(data.mobile);
    if (customerExist.exist === true) {
      var confirm = window.confirm(
        "A similar customer already exists.Do you want to continue?"
      );
      if (confirm) {
        window.location.href = `/sales?bookAppointment=${true}&phone=${
          data.mobile
        }`;
      }
    } else {
      const confirm = window.confirm(
        "Customer does not exist. Click on ok to create customer"
      );
      if (confirm) {
        if (onValidation()) {
          const cust = {
            firstName: data.firstName,
            lastName: `${data.lastName}` || "",
            email: data.email,
            phoneNumber: data.mobile,
            gender: gender,
            birthday: null,
            anniversary: null,
            sourceId: data?.leadSource?.id,
          };
          const res = await clientAdapter.createCustomer(cust);
          console.log(res);
          window.location.href = `/sales?bookAppointment=${true}&phone=${
            data.mobile
          }`;
        } else {
          setSnackBar({
            ...snackBar,
            open: true,
            severity: "error",
            message: "All the feilds are required",
          });
        }
      }
    }
  };

  useEffect(() => {
    if (props.page === "viewModal") {
      setShow(props.showBookAppointment);
    }
  }, [props.page, props.showBookAppointment]);

  const getLeadSourceItems = async () => {
    try {
      const res = await clientAdapter.getLeadSource();
      setLeadSourceItems(res);
    } catch (error) {
      setLeadSourceItems([]);
    }
  }

  useEffect(()=>{
    getLeadSourceItems()
  },[])

  return (
    <>
      {props.page === "viewModal" ? null : (
        <a variant="primary" className="toggle-buttons" onClick={handleShow}>
          <FontAwesomeIcon icon={faCalendar} className="lead-calendar" />
        </a>
      )}

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="top"
        className="modal-1"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Customer</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body className="appointment-content">
          <div className="row appointment-top">
            <div className="form-group">
              <label
                htmlFor="cust_first_name"
                className="required col-sm-3 col-md-3 col-lg-2 control-label"
              >
                First Name :
              </label>
              <div className="col-sm-9 col-md-12 col-lg-12">
                <input
                  type="text"
                  name="cust_first_name"
                  id="cust_first_name"
                  className="form-control"
                  size="8"
                  value={data.firstName}
                  required
                />
                <span className="text-danger">{error}</span>
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="cust_last_name"
                className=" col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Last Name :
              </label>
              <div className="col-sm-9 col-md-12 col-lg-12">
                <input
                  type="text"
                  name="cust_last_name"
                  id="cust_last_name"
                  className="form-control"
                  size="8"
                  value={data.lastName}
                  required
                />
                <span className="text-danger">{error}</span>
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="email"
                className=" col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Email :
              </label>
              <div className="col-sm-9 col-md-12 col-lg-12">
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  size="8"
                  value={data.email}
                  required
                />
                <span className="text-danger">{error}</span>
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="phone_number"
                className="required col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Phone Number :
              </label>
              <div className="col-sm-9 col-md-12 col-lg-12">
                <input
                  type="number"
                  name="phone_number"
                  id="phone_number"
                  className="form-control"
                  size="8"
                  value={data.mobile}
                  required
                />
                <span className="text-danger">{error}</span>
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="gender"
                className="required col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Gender :
              </label>
              <div className="col-sm-9 col-md-12 col-lg-12">
                <div className="btn-group" data-toggle="buttons">
                  <label className="btn button-gender active">
                    <input
                      type="radio"
                      name="gender"
                      id="gender"
                      value={gender}
                      autoComplete="off"
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                    />
                    Male
                  </label>
                  <label className="btn button-gender">
                    <input
                      type="radio"
                      name="gender"
                      id="gender"
                      value="female"
                      autoComplete="off"
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                    />
                    Female
                  </label>
                </div>
              </div>
            </div>
            <div className="form-group">
              <label
                htmlFor="lead_from_campaign"
                className="required wide col-sm-3 col-md-3 col-lg-2 control-label"
              >
                Lead Source :
              </label>
              <div className="col-sm-9 col-md-12 col-lg-12">
                <select
                  id="lead_from_cust_campaign"
                  name="lead_from_cust_campaign"
                  className="form-control"
                >
                  <option value="0">
                    {data.leadSource ? data.leadSource.source : "NA"}
                  </option>
                   {leadSourceItems?.length &&
                    leadSourceItems?.map((lead) => (
                      <option key={lead.id} value={lead?.id}>
                        {lead?.source}
                      </option>
                    ))}
                  
                </select>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn button-close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => setShow(false)}
            >
              Close
            </button>
            <button
              type="button"
              className="btn button-close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={createCustomer}
            >
              Book Appointment
            </button>
          </div>
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

export default Toggles;
