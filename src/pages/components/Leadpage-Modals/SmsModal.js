import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { faSms } from "@fortawesome/free-solid-svg-icons";
import {
  TextField,
  Autocomplete,
  Box,
  Typography,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Grid,
} from "@mui/material";
import clientAdapter from "../../../lib/clientAdapter";
import ArticleIcon from "@mui/icons-material/Article";

const Sms = (props) => {
  const data = props.data;
  const [show, setShow] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = React.useState(false);
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleSnackbarClose = () => {
    setSnackBar({
      ...snackBar,
      open: false,
    });
  };

  const getTemplates = async () => {
    try {
      const tempRes = await clientAdapter.getSmsTemplates();
      if (tempRes.statusCode) {
        setTemplates([]);
      } else {
        setTemplates(tempRes.templates);
      }
    } catch (error) {
      console.log("error from get templates", error);
    }
  };

  const createPromotion = async () => {
    setLoading(true);
    let sdata;
    sdata = {
      deliverychannel: "sms",
      sendTo: 3,
      template: message,
      numbers: data.mobile.toString(),
    };
    sendPromotion(sdata);
  };

  const sendPromotion = async (sdata) => {

    try {
      const res = await clientAdapter.sendPromotion(sdata);
      setLoading(false);
      if (res.statusCode) {
        throw res;
      } else {
        clearData();
        setTimeout(() => {
          handleClose();
        }, 2000);
        setSnackBar({
          open: true,
          severity: "success",
          message: `Message sent successfully`,
        });
      }
    } catch (error) {
      setLoading(false);
      setSnackBar({
        open: true,
        severity: "error",
        message: error?.message?.errors?.length
          ? error?.message?.errors[0]?.message
          : error?.message?.message?.length
          ? error?.message?.message[0]
          : `Something went wrong`,
      });
    }
  };
  const clearData = () => {
    setTemplate("");
    setMessage("");
  };
  useEffect(() => {
    getTemplates();
  }, []);
  return (
    <>
      <a variant="primary" className="toggle-buttons" onClick={handleShow}>
        <FontAwesomeIcon icon={faSms} className="lead-sms" />
      </a>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="top"
        className="modal-2"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>SMS Message</Offcanvas.Title>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body>
          <Grid container>
            <Grid item xs={3}>
              <Typography
                style={{
                  padding: "5px",
                  color: "red",
                }}
              >
                Phone Number :
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                required
                size="small"
                value={data.mobile}
              />
            </Grid>
          </Grid>

          <Grid container mt={2}>
            <Grid item xs={3}>
              <Typography
                style={{
                  padding: "5px",
                  color: "black",
                }}
              >
                {"SMS Templates "}:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Autocomplete
                id="country-select-demo"
                fullWidth
                options={templates}
                size="small"
                value={template}
                getOptionLabel={(option) => option?.body || ""}
                renderOption={(props, option) => (
                  <Box key={option?.id} {...props}>
                    <Box
                      display={"flex"}
                      alignItems={"flex-start"}
                      sx={{ cursor: "pointer" }}
                    >
                      <ArticleIcon
                        fontSize="large"
                        sx={{ mr: 2, color: "gray", pt: 0.5 }}
                      />
                      <Box>
                        <Typography fontWeight={600}>
                          {option?.title}
                        </Typography>
                        <Typography fontSize={14} fontWeight={300}>
                          {option?.body}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    inputProps={{
                      ...params.inputProps,
                      fontFamily: "Kanit, sans-serif",
                    }}
                    value={template?.body}
                  />
                )}
                onChange={(newValue) => {
                  setTemplate(newValue);
                  setMessage(newValue?.body);
                }}
              />
            </Grid>
          </Grid>

          {/* SMS Message */}
          <Grid container mt={2}>
            <Grid item xs={3}>
              <Typography
                style={{
                  padding: "5px",
                  color: "red",
                }}
              >
                SMS Message:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <TextField
                fullWidth
                disableUnderline={true}
                required
                size="small"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                multiline
                inputProps={{ style: { fontFamily: "Kanit, sans-serif" } }}
              />
              {message ? (
                <Typography fontSize={13}>
                  Replace variable tags mentioned in <span>%%...%%</span>
                  with your own text
                </Typography>
              ) : null}
            </Grid>
          </Grid>

          <Box mt={12} display={"flex"} justifyContent={"flex-end"}>
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
              type="submit"
              className="btn button-book"
              id="send_leads_whas"
              onClick={createPromotion}
            >
              Send
            </button>
          </Box>
        </Offcanvas.Body>
      </Offcanvas>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackBar.open}
        autoHideDuration={5000}
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => setLoading(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default Sms;
