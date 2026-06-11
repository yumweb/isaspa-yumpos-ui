import React from "react";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";

const ClockingOut = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const opens = () => {
    window.open("www.localhost:3001");
  };

  return (
    <>
      <a
        variant="primary"
        href="#"
        className="clockout-button"
        onClick={handleShow}
      >
        Logout without clocking out
      </a>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="top"
        className="clockout-main"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="clockout-heading">
            Are you sure you want to logout WITHOUT clocking out?
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <button type="button" className="ok-button" onClick={opens}>
            Ok
          </button>
          <button
            type="button"
            className="cancelling-button"
            onClick={() => setShow(false)}
          >
            Cancel
          </button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
export default ClockingOut;
