import React, { useState, useEffect } from "react";
import useWhatsAppEsu from "../../hooks/useWhatsAppEsu";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Alert, Snackbar,
  Table, TableBody, TableCell, TableRow, CircularProgress, Chip, List, ListItem, ListItemIcon, ListItemText,
  TextField, Collapse, Link, Checkbox, FormControlLabel, Divider
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import BusinessIcon from "@mui/icons-material/Business";
import PaymentIcon from "@mui/icons-material/Payment";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BadgeIcon from "@mui/icons-material/Badge";
import clientAdapter from "../../lib/clientAdapter";

export default function WhatsAppSetup({ locationId }) {
  const { loading, error, launch } = useWhatsAppEsu(locationId);
  const [snackbar, setSnackbar] = useState({ open: false, text: "", severity: "success" });
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusData, setStatusData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [connectedPhone, setConnectedPhone] = useState(null);
  const [deregisterOpen, setDeregisterOpen] = useState(false);
  const [deregisterLoading, setDeregisterLoading] = useState(false);
  const [registrationPin, setRegistrationPin] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [deregisterPassword, setDeregisterPassword] = useState("");
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingChecks, setOnboardingChecks] = useState({
    metaPolicies: false,
    dedicatedNumber: false,
    facebookAccount: false,
  });
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  // Soft-state banner signal — drives the "previous attempt got stuck",
  // "previous attempt was cancelled", and "deregistered" notices. Pure DB
  // lookup on the backend, so safe to call even when Meta credentials are
  // missing/stale.
  const [onboardingHealth, setOnboardingHealth] = useState(null);

  // Check connection status on mount
  useEffect(() => {
    const checkConnectionStatus = async () => {
      try {
        const res = await clientAdapter.getWhatsappPhoneStatus(locationId);
        if (res?.success && res?.data) {
          // Check if phone is pending registration (Meta returns status: "PENDING")
          if (res.data.status === 'PENDING' && res.data.registration_pin) {
            setNeedsRegistration(true);
            setIsConnected(false); // Show as not fully connected
            setRegistrationPin(res.data.registration_pin);
          } else if (res.data.status === 'CONNECTED' || (res.data.verified_name && res.data.status !== 'PENDING')) {
            // Phone is registered and active
            setIsConnected(true);
            setNeedsRegistration(false);
            setConnectedPhone(res.data.display_phone_number || res.data.verified_name);
            if (res.data.registration_pin) {
              setRegistrationPin(res.data.registration_pin);
            }
          } else {
            // Some other state - show as not connected
            setIsConnected(false);
            setNeedsRegistration(false);
          }
        }
      } catch (e) {
        // Not connected or error - show setup buttons
        setIsConnected(false);
        setNeedsRegistration(false);
      } finally {
        setInitialLoading(false);
      }
    };
    const fetchOnboardingHealth = async () => {
      try {
        const res = await clientAdapter.getWhatsappOnboardingHealth(locationId);
        if (res?.success) setOnboardingHealth(res.data || null);
      } catch (e) {
        // Health signal is purely advisory; failure is silent.
      }
    };
    if (locationId) {
      checkConnectionStatus();
      fetchOnboardingHealth();
    }
  }, [locationId]);

  const handleLaunch = () => {
    setOnboardingOpen(true);
  };

  const handleOnboardingProceed = () => {
    setOnboardingOpen(false);
    setOnboardingChecks({ metaPolicies: false, dedicatedNumber: false, facebookAccount: false });
    launch();
  };

  const handleOnboardingClose = () => {
    setOnboardingOpen(false);
    setOnboardingChecks({ metaPolicies: false, dedicatedNumber: false, facebookAccount: false });
  };

  const allOnboardingChecked = onboardingChecks.metaPolicies && onboardingChecks.dedicatedNumber && onboardingChecks.facebookAccount;

  const handleCheckStatus = async () => {
    setStatusOpen(true);
    setStatusLoading(true);
    setStatusData(null);
    try {
      const res = await clientAdapter.getWhatsappPhoneStatus(locationId);
      if (res?.success) {
        setStatusData(res.data);
      } else {
        setSnackbar({ open: true, text: res?.error || "Failed to get status", severity: "error" });
        setStatusOpen(false);
      }
    } catch (e) {
      setSnackbar({ open: true, text: "Error fetching status", severity: "error" });
      setStatusOpen(false);
    } finally {
      setStatusLoading(false);
    }
  };

  const formatLabel = (key) => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleRegister = async () => {
    if (!registrationPin) {
      setSnackbar({ open: true, text: "No registration PIN available", severity: "error" });
      return;
    }
    setRegisterLoading(true);
    try {
      const res = await clientAdapter.registerWhatsappNumber(locationId, registrationPin);
      if (res?.success) {
        setSnackbar({ open: true, text: "Phone number registered successfully!", severity: "success" });
        setIsConnected(true);
        setNeedsRegistration(false);
        // Refresh status to get updated info
        const statusRes = await clientAdapter.getWhatsappPhoneStatus(locationId);
        if (statusRes?.success && statusRes?.data) {
          setConnectedPhone(statusRes.data.display_phone_number || statusRes.data.verified_name);
        }
      } else {
        setSnackbar({ open: true, text: res?.error || "Registration failed", severity: "error" });
      }
    } catch (e) {
      setSnackbar({ open: true, text: "Error registering phone", severity: "error" });
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleDeregister = async () => {
    if (!deregisterPassword) {
      setSnackbar({ open: true, text: "Please enter your password", severity: "error" });
      return;
    }
    setDeregisterLoading(true);
    try {
      const res = await clientAdapter.deregisterWhatsappPhone(locationId, deregisterPassword);
      if (res?.success) {
        setSnackbar({ open: true, text: "WhatsApp number deregistered successfully", severity: "success" });
        setIsConnected(false);
        setConnectedPhone(null);
      } else {
        setSnackbar({ open: true, text: res?.error || "Deregistration failed", severity: "error" });
      }
    } catch (e) {
      setSnackbar({ open: true, text: "Error deregistering phone", severity: "error" });
    } finally {
      setDeregisterLoading(false);
      setDeregisterOpen(false);
      setDeregisterPassword("");
    }
  };

  return (
    <Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.text}
        </Alert>
      </Snackbar>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{String(error)}</Alert>
      )}
      {initialLoading ? (
        <Box display="flex" alignItems="center" gap={2}>
          <CircularProgress size={20} />
          <Typography variant="body2" color="text.secondary">Checking connection status...</Typography>
        </Box>
      ) : needsRegistration ? (
        <>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight="bold" gutterBottom>
              Registration Pending
            </Typography>
            <Typography variant="body2">
              Your WhatsApp Business Account setup is complete, but the phone number needs to be registered.
              Automatic registration should happen within a few minutes. If it doesn't complete automatically,
              you can register manually using the button below.
            </Typography>
          </Alert>

          {registrationPin && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Registration PIN:</strong>{" "}
                <code style={{ fontSize: "1.1em", fontWeight: "bold", letterSpacing: "2px" }}>
                  {registrationPin}
                </code>
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                This PIN is used to verify and activate your WhatsApp Business number.
              </Typography>
            </Alert>
          )}

          <Box display="flex" gap={2} mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRegister}
              disabled={registerLoading || !registrationPin}
            >
              {registerLoading ? (
                <>
                  <CircularProgress size={16} sx={{ mr: 1 }} color="inherit" />
                  Registering...
                </>
              ) : (
                "Register Phone Number Manually"
              )}
            </Button>
            <Button variant="outlined" color="info" onClick={handleCheckStatus}>
              Check Status
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Note: If registration fails repeatedly, please contact support or try re-onboarding.
          </Typography>
        </>
      ) : isConnected ? (
        <>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <CheckCircleIcon color="success" />
            <Typography variant="subtitle1">
              WhatsApp Business is connected
            </Typography>
            {connectedPhone && (
              <Chip label={connectedPhone} size="small" color="success" variant="outlined" />
            )}
          </Box>
          <Box display="flex" gap={2} mb={2}>
            <Button variant="outlined" color="info" onClick={handleCheckStatus}>
              Check Status
            </Button>
          </Box>

          {/* Advanced options - hidden by default */}
          <Box mt={3}>
            <Link
              component="button"
              variant="caption"
              color="text.secondary"
              underline="hover"
              onClick={() => setShowAdvanced(!showAdvanced)}
              sx={{ cursor: "pointer" }}
            >
              {showAdvanced ? "Hide advanced options" : "Show advanced options"}
            </Link>
            <Collapse in={showAdvanced}>
              <Box mt={1} p={2} sx={{ bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Danger zone - proceed with caution
                </Typography>
                <Link
                  component="button"
                  variant="body2"
                  color="error"
                  underline="hover"
                  onClick={() => setDeregisterOpen(true)}
                  sx={{ cursor: "pointer" }}
                >
                  Deregister WhatsApp number...
                </Link>
              </Box>
            </Collapse>
          </Box>
        </>
      ) : (
        <>
          {onboardingHealth?.phoneStatus === "deregistered" && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              WhatsApp is currently disconnected for this location. Click <strong>Connect WhatsApp</strong> below to re-onboard.
            </Alert>
          )}
          {(onboardingHealth?.hasStuckAttempt || onboardingHealth?.hasCancelledAttempt) &&
            onboardingHealth?.phoneStatus !== "deregistered" && (
              <Alert severity="info" sx={{ mb: 2 }}>
                A previous onboarding attempt didn't complete
                {onboardingHealth?.hasCancelledAttempt ? " (cancelled in the WhatsApp popup)" : ""}
                {onboardingHealth?.hasStuckAttempt ? " (the embedded signup popup never returned)" : ""}
                . Try again — keep the popup open until it returns to YumPOS.
              </Alert>
            )}
          <Typography variant="subtitle1" gutterBottom>
            Connect this location to WhatsApp Business via Embedded Signup.
          </Typography>
          <Box display="flex" gap={2}>
            <Button variant="contained" disabled={loading} onClick={handleLaunch}>
              {loading ? "Loading..." : "Connect WhatsApp"}
            </Button>
            <Button variant="outlined" color="info" onClick={handleCheckStatus}>
              Check Status
            </Button>
          </Box>
        </>
      )}
      <Dialog open={statusOpen} onClose={() => setStatusOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>WhatsApp Phone Status</DialogTitle>
        <DialogContent>
          {statusLoading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : statusData ? (
            <>
              <Table size="small">
                <TableBody>
                  {Object.entries(statusData).map(([key, value]) => {
                    // Skip health_status - we'll render it separately below
                    if (key === "health_status") return null;
                    // Skip complex objects
                    if (value && typeof value === "object") return null;
                    return (
                      <TableRow key={key}>
                        <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                          {formatLabel(key)}
                        </TableCell>
                        <TableCell>
                          {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value ?? "-")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {/* Health Status Section */}
              {statusData.health_status && (
                <Box mt={2}>
                  <Typography variant="subtitle2" gutterBottom>
                    Messaging Health Status
                  </Typography>
                  {statusData.health_status.entities?.map((entity, idx) => {
                    // Skip SIP related entities
                    if (entity.entity_type === "SIP") return null;
                    const isHealthy = entity.can_send_message === "AVAILABLE";
                    const isBlocked = entity.can_send_message === "BLOCKED";
                    // Filter out SIP-related errors
                    const relevantErrors = entity.errors?.filter(err =>
                      !err.error_description?.toLowerCase().includes("sip")
                    ) || [];
                    const hasErrors = relevantErrors.length > 0;

                    return (
                      <Box key={idx} mb={1}>
                        <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                          <Typography variant="body2" fontWeight="bold">
                            {entity.entity_type}:
                          </Typography>
                          <Chip
                            label={entity.can_send_message}
                            size="small"
                            color={isHealthy ? "success" : isBlocked ? "error" : "warning"}
                          />
                        </Box>
                        {hasErrors && relevantErrors.map((err, errIdx) => (
                          <Alert key={errIdx} severity="error" sx={{ mt: 1 }}>
                            <Typography variant="body2" fontWeight="bold">
                              {err.error_description}
                            </Typography>
                            {err.possible_solution && (
                              <Typography variant="caption" display="block" mt={0.5}>
                                <strong>Solution:</strong> {err.possible_solution}
                              </Typography>
                            )}
                          </Alert>
                        ))}
                      </Box>
                    );
                  })}
                  {!statusData.health_status.entities?.some(e => e.entity_type !== "SIP") && (
                    <Chip label="Healthy" size="small" color="success" />
                  )}
                </Box>
              )}
            </>
          ) : (
            <Typography color="text.secondary">No data available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Deregister Confirmation Dialog */}
      <Dialog open={deregisterOpen} onClose={() => setDeregisterOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, color: "error.main" }}>
          <WarningAmberIcon color="error" />
          Deregister WhatsApp Number
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            You are about to deregister this phone number from WhatsApp Business API.
          </Alert>

          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: "bold" }}>
            What happens when you deregister:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <WarningAmberIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Messaging will stop immediately"
                secondary="You will no longer be able to send or receive WhatsApp messages via the API"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <WarningAmberIcon color="warning" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Rate limit applies"
                secondary="Maximum 10 register/deregister attempts per phone number in 72 hours"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Number can be re-registered"
                secondary="You can reconnect this number to YumPOS or another provider later"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary="Number stays in your WABA"
                secondary="The phone number remains in your WhatsApp Business Account"
              />
            </ListItem>
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> This is different from <em>deleting</em> a phone number.
              Deletion is permanent and must be done manually in Meta Business Manager.
              Once deleted, the number can never be used with WhatsApp Business API again
              (but can be used with WhatsApp Messenger or WhatsApp Business app).
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              For more details, see{" "}
              <a href="https://faq.whatsapp.com/209248051996804" target="_blank" rel="noopener noreferrer">
                Meta's official documentation
              </a>.
              These policies are subject to change at Meta's discretion. YumPOS is not liable for any changes to WhatsApp Business API policies.
            </Typography>
          </Alert>

          {registrationPin && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Your Registration PIN:</strong>{" "}
                <code style={{ fontSize: "1.1em", fontWeight: "bold", letterSpacing: "2px" }}>
                  {registrationPin}
                </code>
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
                Save this PIN! You'll need it to re-register this number with YumPOS or any other provider.
              </Typography>
            </Alert>
          )}

          <TextField
            fullWidth
            type="password"
            label="Enter your password to confirm"
            value={deregisterPassword}
            onChange={(e) => setDeregisterPassword(e.target.value)}
            sx={{ mt: 3 }}
            size="small"
            required
            autoComplete="current-password"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeregisterOpen(false)} disabled={deregisterLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeregister}
            variant="contained"
            color="error"
            disabled={deregisterLoading}
          >
            {deregisterLoading ? "Deregistering..." : "Yes, Deregister"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Onboarding Confirmation Modal */}
      <Dialog open={onboardingOpen} onClose={handleOnboardingClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="span" fontWeight="bold">
            WhatsApp Business Integration
          </Typography>
        </DialogTitle>
        <DialogContent>
          {/* Disclaimer */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Disclaimer:</strong> YumPOS is a platform that connects your business to Meta's WhatsApp Business API.
              All billing, pricing, and policies are managed directly by Meta (Facebook) and are subject to change at their discretion.
            </Typography>
          </Alert>

          {/* Prerequisites */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Prerequisites Checklist
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Before proceeding, ensure you have the following:
          </Typography>

          <Table size="small" sx={{ mb: 3, "& td, & th": { py: 1.5 } }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: 50 }}>
                  <PhoneAndroidIcon color="primary" />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "30%" }}>Dedicated Phone Number</TableCell>
                <TableCell>
                  A number <strong>NOT</strong> currently registered on any WhatsApp service (personal or business app)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <VerifiedUserIcon color="primary" />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Number Access</TableCell>
                <TableCell>Ability to receive SMS or calls on that number for verification</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <BusinessIcon color="primary" />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Facebook Business Account</TableCell>
                <TableCell>Required for WhatsApp Business API access</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <PaymentIcon color="primary" />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Valid Payment Method</TableCell>
                <TableCell>Credit card or payment method linked to Meta Business Manager</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <BadgeIcon color="primary" />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Business Display Name</TableCell>
                <TableCell>Your business name as it will appear to customers</TableCell>
              </TableRow>
            </TableBody>
          </Table>

          {/* Important Notes */}
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Phone Number Warning
            </Typography>
            <Typography variant="body2">
              Once registered with WhatsApp Business API, this number <strong>cannot</strong> be used with
              WhatsApp Messenger or WhatsApp Business App. It becomes exclusively tied to the API.
            </Typography>
          </Alert>

          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
              Billing Information
            </Typography>
            <Typography variant="body2" component="div">
              Meta charges per message for template messages:
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                <li><strong>Utility</strong> (invoices, confirmations): ~₹0.115/message</li>
                <li><strong>Marketing</strong> (promotions, wishes): ~₹0.7846/message</li>
              </ul>
              <Typography variant="caption" color="text.secondary">
                Prices are set by Meta and subject to change.{" "}
                <a href="https://business.whatsapp.com/products/platform-pricing?country=India" target="_blank" rel="noopener noreferrer">
                  View current pricing
                </a>
              </Typography>
            </Typography>
          </Alert>

          <Divider sx={{ my: 2 }} />

          {/* Confirmation Checkboxes */}
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Confirmation
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={onboardingChecks.metaPolicies}
                  onChange={(e) => setOnboardingChecks({ ...onboardingChecks, metaPolicies: e.target.checked })}
                />
              }
              label="I understand that WhatsApp pricing and policies are controlled by Meta, not YumPOS"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={onboardingChecks.dedicatedNumber}
                  onChange={(e) => setOnboardingChecks({ ...onboardingChecks, dedicatedNumber: e.target.checked })}
                />
              }
              label="I have a dedicated phone number ready for WhatsApp Business API"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={onboardingChecks.facebookAccount}
                  onChange={(e) => setOnboardingChecks({ ...onboardingChecks, facebookAccount: e.target.checked })}
                />
              }
              label="I have access to a Facebook Business account with a valid payment method"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleOnboardingClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleOnboardingProceed}
            variant="contained"
            disabled={!allOnboardingChecked}
          >
            Proceed with Onboarding
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

