import React from "react";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";

const Confirmation = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <button
        variant="primary"
        className="confirmation-button"
        onClick={handleShow}
      >
        Book Appointment
      </button>

      <Offcanvas
        className="confirmation-off"
        show={show}
        onHide={handleClose}
        placement="top"
      >
        <Offcanvas.Header closeButton></Offcanvas.Header>
        <Offcanvas.Body>
          <p>
            {" "}
            A similar customer name already exists. Do you want to continue?
            <div className=" confirm mt-3">
              <button className="close-button-1" onClick={() => setShow(false)}>
                Cancel
              </button>
              <button className="close-button">OK</button>
            </div>
          </p>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Confirmation;
