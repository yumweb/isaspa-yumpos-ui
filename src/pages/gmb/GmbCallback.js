import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert, Button } from "@mui/material";
import clientAdapter from "../../lib/clientAdapter";
import { AppRoutes } from "../../routes";

/**
 * OAuth landing route. Google redirects here with ?code=... after consent.
 * We exchange the code for tokens (server-side stores them), then bounce back
 * to the GMB management page.
 */
const GmbCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const oauthError = params.get("error");
    const locationId = params.get("state"); // round-tripped from getAuthUrl

    if (oauthError) {
      setError(`Google authorization was cancelled or failed (${oauthError}).`);
      return;
    }
    if (!code) {
      setError("No authorization code was returned by Google.");
      return;
    }
    if (!locationId) {
      setError("Missing location context in the Google response.");
      return;
    }

    (async () => {
      try {
        await clientAdapter.connectGmb(locationId, code);
        navigate(AppRoutes.GoogleMyBusiness.path, { replace: true });
      } catch (e) {
        setError("Failed to connect the Google account. Please try again.");
      }
    })();
  }, [navigate]);

  if (error) {
    return (
      <Box sx={{ p: 4, maxWidth: 560 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate(AppRoutes.GoogleMyBusiness.path)}
        >
          Back to Google My Business
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "40vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>Connecting your Google account…</Typography>
    </Box>
  );
};

export default GmbCallback;
