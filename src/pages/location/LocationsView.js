import { Snackbar, Alert } from "@mui/material";
import React, { useEffect, useState } from "react";
import clientAdapter from "../../lib/clientAdapter";
import LocationCreate from "./LocationCreate";
import LocationEdit from "./LocationEdit";
import { useLocation } from "react-router-dom";

const LocationsView = (props) => {
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [locationData, setLocationData] = useState(null);
  const location = useLocation();
  const locId = new URLSearchParams(location.search).get("id");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const onSubmit = async (data) => {
    if (data) {
      const createLocation = await clientAdapter.createLocation(data);
      console.log(createLocation);
      setSnackbarText("Location Created Successfully");
      setSnackbarOpen(!snackbarOpen);
      setTimeout(() => {
        window.location.href = "/locations";
      }, 3000);
    } else {
      alert("Kindly Fill all the fields");
    }
  };

  const onEdit = async (stateData) => {
    const updateLocation = await clientAdapter.updateLocationById(
      locId,
      stateData
    );
    console.log(updateLocation);
    setSnackbarText("Location Updated Successfully");
    setSnackbarOpen(!snackbarOpen);
    setTimeout(() => {
      window.location.href = "/locations";
    }, 3000);
  };

  useEffect(() => {
    if (locId) {
      const getLoc = async () => {
        const locations = await clientAdapter.getLocationById(locId);
        setLocationData(locations);
      };
      getLoc();
    }
  }, []);

  return (
    <>
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
      
      {locationData ? (
        <LocationEdit locationData={locationData} onEdit={onEdit} />
      ) : (
        <LocationCreate onSubmit={onSubmit} />
      )}
    </>
  );
};

export default LocationsView;
