/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Toggles = () => {
  const [show, setShow] = useState(false);
  const [saleId, setSaleId] = useState(0);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = async () => {
    if(!saleId) return;
    navigate(`/sales/receipt?saleId=${saleId}`);

  };

  return (
    <>
      <a
        variant="primary"
        className="toggle-button"
        onClick={handleShow}
      >
        Lookup Receipt
      </a>

      <Offcanvas show={show} onHide={handleClose} placement="top">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Lookup Receipt</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body>
          <form
            action=""
            className="look-up-receipt-form"
            autoComplete="off"
            method="post"
            acceptCharset="utf-8"
          >
            <span className="text-danger text-center has-error look-up-receipt-error"></span>
            <input
              type="number"
              className="form-control text-center"
              style={{ width: "100%" }}
              name="sale_id"
              placeholder="Sale ID"
              onChange={(e) => setSaleId(e.target.value)}
            ></input>
            <input
              type="submit"
              name="submit_look_up_receipt_form"
              value="Lookup Receipt"
              className="btn btn-block btn-primary mt-3"
              onClick={handleSubmit}
            ></input>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Toggles;
