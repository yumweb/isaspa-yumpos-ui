import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  Alert,
  Autocomplete,
  Backdrop,
  Box,
  CircularProgress,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import clientAdapter from "../../../lib/clientAdapter";
import { whatsappTemplates } from "../../../data/promotion";

const Whatsapp = (props) => {
  const data = props.data;
  const [show, setShow] = useState(false);
  const [variable1, setVariable1] = useState("");
  const [variable2, setVariable2] = useState("");
  const [template, setTemplate] = useState("");
  const [message, setMessage] = useState("");
  const [whatsappTemplateId, setWhatsappTemplateId] = useState("");

  const [loading, setLoading] = React.useState(false);
  const [snackBar, setSnackBar] = React.useState({
    open: false,
    severity: "success",
    message: "",
  });
  const handleSnackbarClose = () => {
    setSnackBar({
      ...snackBar,
      open: false,
    });
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const onChangeVariable1 = (e) => {
    setVariable1(e.target.value);
  };
  const onChangeVariable2 = (e) => {
    setVariable2(e.target.value);
  };

  const createPromotion = async () => {
    setLoading(true);
    let sdata;
    sdata = {
      deliverychannel: "whatsapp",
      sendTo: 3,
      message: {
        template: whatsappTemplateId || "",
        parameters: {
          variable1: variable1,
          variable2: variable2,
        },
      },
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
        message:
          error?.message?.response?.description || `Something went wrong`,
      });
    }
  };
  const clearData = () => {
    setTemplate("");
    setMessage("");
  };

  return (
    <>
      <a variant="primary" className="toggle-buttons" onClick={handleShow}>
        <FontAwesomeIcon icon={faWhatsapp} className="lead-whatsapp" />
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
                {"Whatsapp Templates "}:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Autocomplete
                id="country-select-demo"
                fullWidth
                options={whatsappTemplates}
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
                  setWhatsappTemplateId(newValue?.id?.toString());
                }}
              />

              <Typography fontSize={13}>
                Replace variable tags mentioned in <span>$(variable1)</span> and{" "}
                <span>$(variable1)</span>
                with your own text
              </Typography>

              <Box mt={2}>
                <Grid container spacing={2}>
                  {template?.body?.includes("$(variable1)") && (
                    <Grid item xs={6}>
                      <Typography fontSize={14}>variable1</Typography>
                      <TextField
                        fullWidth
                        disableUnderline={true}
                        required
                        size="small"
                        value={variable1}
                        onChange={onChangeVariable1}
                        inputProps={{
                          style: { fontFamily: "Kanit, sans-serif" },
                        }}
                      />
                    </Grid>
                  )}
                  {template?.body?.includes("$(variable1)") && (
                    <Grid item xs={6}>
                      <Typography fontSize={14}>variable2</Typography>
                      <TextField
                        fullWidth
                        disableUnderline={true}
                        required
                        size="small"
                        value={variable2}
                        onChange={onChangeVariable2}
                        inputProps={{
                          style: { fontFamily: "Kanit, sans-serif" },
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </Box>
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

export default Whatsapp;
