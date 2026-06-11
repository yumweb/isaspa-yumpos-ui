/* eslint-disable import/no-anonymous-default-export */
import { useEffect } from "react";
import moment from "moment-timezone";
import React, { useState } from "react";
import clientAdapter from "../../lib/clientAdapter";
import MyCalendar from "../components/MyCalendar";
import StaffCalender from "../components/StaffCalender";
import { Button, Offcanvas } from "react-bootstrap";
import { format } from "date-fns";
import { Box, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";

export default () => {
  const [appointmentData, setAppointmentData] = useState({});
  const [tabSelected, setTabSelected] = useState(0);
  const [show, setShow] = useState(false);
  const [cancel, setCancel] = useState(false);
  const handleAppointmentCancelShow = () => setCancel(true);
  const handleAppointmentCancelClose = () => setCancel(false);
  const handleClose = () => setShow(false);
  const [eachAppointment, setEachAppointment] = useState();
  const [loading, setLoading] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [selectedAppointmentTime, setSelectedAppointmentTime] = useState(null);

  const getAppointmentData = async () => {
    setLoading(true);
    const startDate = moment()
      .subtract(3, "month")
      .startOf("month")
      .toISOString();
    const endDate = moment()
      .add(3, "month")
      .endOf("month")
      .toISOString();
    const res = await clientAdapter.getAppointmentInformation(
      startDate,
      endDate
    );
    setAppointmentData(res);
    setLoading(false);
  };

  useEffect(() => {
    const token = window.localStorage.getItem("yumpos_token");
    const locationId = window.localStorage.getItem("yumpos_location");
    if (!token || !locationId) {
      window.location.href = "/";
    }
    getAppointmentData();
  }, []);

  const handleBookAppointment = async (show, event) => {
    setShow(show);
    setSelectedAppointmentId(event?.appointmentId);
    setSelectedAppointmentTime(event?.time);
    const response = await clientAdapter.getSaleReceipt(event?.saleId);
    setEachAppointment({ ...response, event });
  };

  const handleConfirmAppointmentCanel = async (id) => {
    try {
      const deleteAppointment = await clientAdapter.deleteAppointment(id);
      if (deleteAppointment === 200) {
        const updatedAppointments = appointmentData.filter(
          (event) => event.id !== id
        );
        setAppointmentData(updatedAppointments);
        handleAppointmentCancelClose();
        handleClose();
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
    }
  };

  return (
    <>
      <hr />
      <section className="mycalendar">
        <div className="side-heading bg-light">
          {" "}
          <h5>Appointment Information</h5>
        </div>
        <section>
          <div className="legend">
            <strong>Legend</strong>
          </div>
          <ul className="color-codes">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <li className="colorcode-one"></li>
              <small>Scheduled</small>
              <li className="colorcode-two"></li>
              <small>In Progress</small>
              <li className="colorcode-three"></li>
              <small>Completed</small>
              <li className="colorcode-four"></li>
              <small>No Show</small>
            </div>
          </ul>
        </section>
        <div className="px-2 py-2">
          <div className="flex gap-1">
            <button
              style={{ backgroundColor: "transparent", border: "none" }}
              onClick={() => setTabSelected(0)}
              className={tabSelected === 0 ? "text-danger" : ""}
            >
              Sales
            </button>
            <button
              style={{ backgroundColor: "transparent", border: "none" }}
              onClick={() => setTabSelected(1)}
              className={tabSelected === 1 ? "text-danger" : ""}
            >
              Staff Schedule
            </button>
          </div>
          <div>
            {tabSelected === 0 && (
              <MyCalendar
                appointmentData={appointmentData}
                handleBookAppointment={handleBookAppointment}
                loading={loading}
              />
            )}
            {tabSelected === 1 && (
              <StaffCalender
                appointmentData={appointmentData}
                handleBookAppointment={handleBookAppointment}
                loading={loading}
              />
            )}
          </div>
        </div>
      </section>

      <Offcanvas
        className="appointment-modal"
        show={show}
        onHide={handleClose}
        placement="top"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Appointment Information</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />

        <Offcanvas.Body>
          {eachAppointment ? (
            <>
              <div className="d-flex align-items-center gap-1">
                <p style={{ fontSize: "1.6rem" }}>
                  {eachAppointment &&
                    eachAppointment?.customer?.firstName +
                      " " +
                      eachAppointment?.customer?.lastName}
                </p>
                <p>({eachAppointment?.customer?.phoneNumber})</p>
              </div>
              <p>
                <em>
                  {format(
                    new Date(eachAppointment?.event?.start),
                    "dddd, MMMM do yyyy"
                  )}
                </em>
              </p>
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Services</th>
                    <th scope="col">Category</th>
                    <th scope="col">Technician</th>
                  </tr>
                </thead>
                <tbody>
                  {(eachAppointment?.saleItems?.length > 0 ||
                    eachAppointment?.saleItemkit?.length > 0) && (
                    <>
                      {eachAppointment?.saleItems?.map((eachSaleItem) => (
                        <tr className="table-active" key={eachSaleItem?.id}>
                          <td>{eachSaleItem?.item?.name}</td>
                          <td>{eachSaleItem?.item?.categoryId}</td>
                          <td>
                            {eachSaleItem?.serviceEmployee?.firstName ||
                              "Not Set"}
                          </td>
                        </tr>
                      ))}
                      {eachAppointment?.saleItemkit?.map((eachSaleItemkit) => (
                        <tr className="table-active" key={eachSaleItemkit?.id}>
                          <td>
                            {eachSaleItemkit?.itemkit?.name || "Not Set"}
                            <br />
                            {eachSaleItemkit?.saleItemkitItems?.map(
                              (itemName) => (
                                <div key={itemName.id}>
                                  {itemName?.item?.name || "Not Set"}
                                </div>
                              )
                            )}
                          </td>
                          <td>{eachSaleItemkit?.itemkit?.categoryId}</td>
                          <td>
                            {""}
                            <br />
                            {eachSaleItemkit?.saleItemkitItems?.map((item) => (
                              <div key={item.id}>
                                {item.kitsServiceEmployeePerson?.firstName ||
                                  "Not Set"}
                              </div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                  {!eachAppointment?.saleItems?.length &&
                    !eachAppointment?.saleItemkit?.length && (
                      <tr className="table-active">
                        <td>Not Set</td>
                        <td>Not Set</td>
                        <td>Not Set</td>
                      </tr>
                    )}
                </tbody>
              </table>
              {eachAppointment.suspended === 0 ? null : (
                <div className="d-flex justify-content-end">
                  <div className="d-flex gap-2">
                    <Button onClick={handleAppointmentCancelShow}>
                      Cancel
                    </Button>
                    <Link
                      to={`/sales?sale=${"changeAppointment"}&saleId=${
                        eachAppointment?.id
                      }&appointmentId=${selectedAppointmentId}&appointmentTime=${selectedAppointmentTime}`}
                    >
                      <Button>Change Appointment</Button>
                    </Link>
                    <Link
                      to={`/sales?sale=${"complete"}&saleId=${
                        eachAppointment?.id
                      }`}
                    >
                      <Button color="#33B4FF">Start Sale</Button>
                    </Link>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Skeleton variant="text" width="250px" height="80px" />
              <Skeleton variant="rounded" width="100%" height="150px" />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <Skeleton variant="text" width="90px" height="80px" />
                <Skeleton variant="text" width="90px" height="80px" />
                <Skeleton variant="text" width="90px" height="80px" />
              </Box>
            </>
          )}
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas
        show={cancel}
        onHide={handleAppointmentCancelClose}
        placement="top"
        className="modal-2"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            Are you sure you want to cancel the Appointment?
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: "15px" }}
          >
            <Button onClick={handleAppointmentCancelClose}>Cancel</Button>
            <Button
              onClick={() =>
                handleConfirmAppointmentCanel(
                  eachAppointment?.event.appointmentId
                )
              }
            >
              Ok
            </Button>
          </Box>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
