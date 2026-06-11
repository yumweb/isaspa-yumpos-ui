import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card } from "@themesberg/react-bootstrap";
import {
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Button,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SyncIcon from "@mui/icons-material/Sync";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import WhatsAppSetup from "../location/WhatsAppSetup";
import clientAdapter from "../../lib/clientAdapter";

function WhatsAppTemplates({ locationId, onCreateClick }) {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    template: null,
  });
  const [deleting, setDeleting] = useState(false);

  const fetchTemplates = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientAdapter.getWhatsappTemplates(locationId);
      if (res?.success) {
        setTemplates(res.data || []);
      } else {
        setError(res?.error || "Failed to fetch templates");
      }
    } catch (e) {
      setError("Error fetching templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationId) {
      fetchTemplates();
    }
  }, [locationId]);

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  const getCategoryLabel = (category) => {
    switch (category?.toUpperCase()) {
      case "MARKETING":
        return "Marketing";
      case "UTILITY":
        return "Utility";
      case "AUTHENTICATION":
        return "Authentication";
      default:
        return category || "Unknown";
    }
  };

  // Meta returns quality_score as either a string ("GREEN"/"YELLOW"/"RED"/"UNKNOWN")
  // or as { score, date } depending on API version. Normalise + colour.
  const renderQualityChip = (quality) => {
    const raw = (typeof quality === "object" && quality !== null)
      ? quality.score
      : quality;
    const score = (raw || "UNKNOWN").toString().toUpperCase();
    const colorMap = {
      GREEN: "success",
      HIGH: "success",
      YELLOW: "warning",
      MEDIUM: "warning",
      RED: "error",
      LOW: "error",
    };
    const labelMap = {
      GREEN: "High quality",
      HIGH: "High quality",
      YELLOW: "Medium quality",
      MEDIUM: "Medium quality",
      RED: "Low quality",
      LOW: "Low quality",
      UNKNOWN: "Not yet rated",
    };
    return (
      <Chip
        label={labelMap[score] || "Not yet rated"}
        size="small"
        color={colorMap[score] || "default"}
        variant="outlined"
      />
    );
  };

  const toggleExpand = (index) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const formatComponents = (components) => {
    if (!components?.length) return "No components";
    return components
      .map((c, i) => {
        if (c.type === "HEADER") {
          return `Header: ${c.format || "TEXT"} - ${
            c.text || c.example?.header_text?.[0] || ""
          }`;
        }
        if (c.type === "BODY") {
          return `Body: ${c.text || ""}`;
        }
        if (c.type === "FOOTER") {
          return `Footer: ${c.text || ""}`;
        }
        if (c.type === "BUTTONS") {
          return `Buttons: ${c.buttons?.map((b) => b.text).join(", ") || ""}`;
        }
        return `${c.type}: ${JSON.stringify(c)}`;
      })
      .join("\n");
  };

  const handleEdit = (templateName) => {
    navigate(`/whatsapp/templates/edit/${templateName}`);
  };

  const handleDeleteClick = (template) => {
    setDeleteDialog({ open: true, template });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.template) return;
    setDeleting(true);
    try {
      const res = await clientAdapter.deleteWhatsappTemplate(
        locationId,
        deleteDialog.template.name
      );
      if (res?.success) {
        fetchTemplates();
      } else {
        setError(res?.error || "Failed to delete template");
      }
    } catch (e) {
      setError("Error deleting template");
    } finally {
      setDeleting(false);
      setDeleteDialog({ open: false, template: null });
    }
  };

  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={2} py={2}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading templates...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        <Button size="small" onClick={fetchTemplates} sx={{ ml: 2 }}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body2" color="text.secondary">
          {templates.length} template{templates.length !== 1 ? "s" : ""} found
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            size="small"
            startIcon={<RefreshIcon />}
            onClick={fetchTemplates}
            disabled={loading}
          >
            Refresh
          </Button>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateClick}
          >
            Create Template
          </Button>
        </Box>
      </Box>

      {templates.length === 0 ? (
        <Alert severity="info">
          No message templates found. Click "Create Template" to build your
          first template.
        </Alert>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: 40 }} align="left"></TableCell>
                <TableCell align="left">
                  <strong>Name</strong>
                </TableCell>
                <TableCell align="left">
                  <strong>Category</strong>
                </TableCell>
                <TableCell align="left">
                  <strong>Language</strong>
                </TableCell>
                <TableCell align="left">
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="left">
                  <strong>Quality</strong>
                </TableCell>
                <TableCell sx={{ width: 100 }} align="left">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {templates.map((template, index) => (
                <React.Fragment key={template.name + template.language}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleExpand(index)}
                      >
                        {expandedRows[index] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace" }}
                      >
                        {template.name}
                      </Typography>
                    </TableCell>
                    <TableCell>{getCategoryLabel(template.category)}</TableCell>
                    <TableCell>{template.language}</TableCell>
                    <TableCell>
                      <Chip
                        label={template.status}
                        size="small"
                        color={getStatusColor(template.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{renderQualityChip(template.quality_score)}</TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEdit(template.name)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(template)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      sx={{
                        py: 0,
                        borderBottom: expandedRows[index] ? undefined : "none",
                      }}
                    >
                      <Collapse
                        in={expandedRows[index]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box sx={{ py: 2, px: 1, bgcolor: "grey.50" }}>
                          {template.header_media_url && (
                            <Box mb={1.5}>
                              {template.header_media_type === "IMAGE" ? (
                                <a
                                  href={template.header_media_url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src={template.header_media_url}
                                    alt="Header"
                                    style={{
                                      maxWidth: 200,
                                      maxHeight: 120,
                                      objectFit: "contain",
                                      border: "1px solid #e0e0e0",
                                      borderRadius: 4,
                                    }}
                                  />
                                </a>
                              ) : (
                                <a
                                  href={template.header_media_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{ textDecoration: "none" }}
                                >
                                  <Typography variant="caption">
                                    {template.header_media_type === "VIDEO" ? "▶ Video header — open" : "📄 Document header — open"}
                                  </Typography>
                                </a>
                              )}
                            </Box>
                          )}
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            component="pre"
                            sx={{
                              whiteSpace: "pre-wrap",
                              fontFamily: "monospace",
                            }}
                          >
                            {formatComponents(template.components)}
                          </Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, template: null })}
      >
        <DialogTitle>Delete Template?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the template "
            {deleteDialog.template?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, template: null })}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Purpose display names
const PURPOSE_LABELS = {
  APPOINTMENT_CONFIRMATION: "Appointment Confirmation",
  INVOICE_RECEIPT: "Invoice / Receipt",
  BIRTHDAY_WISH: "Birthday Wish",
  ANNIVERSARY_WISH: "Anniversary Wish",
  OTP_VERIFICATION: "OTP Verification",
  ICE_BREAKER: "Ice Breaker (Start Chat)",
  REFERRAL_COUPON: "Referral Coupon",
};

// Format version timestamp to readable date
const formatVersion = (version) => {
  if (!version || version.length !== 14) return version;
  const year = version.slice(0, 4);
  const month = version.slice(4, 6);
  const day = version.slice(6, 8);
  return `${day}/${month}/${year}`;
};

function NotificationTemplates({ locationId }) {
  const [submittedTemplates, setSubmittedTemplates] = useState({});
  const [availableDefinitions, setAvailableDefinitions] = useState({});
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [submitting, setSubmitting] = useState(null); // definitionId being submitted
  const [activating, setActivating] = useState(null); // mappingId being activated
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [submitted, available] = await Promise.all([
        clientAdapter.getWhatsappSubmittedTemplates(locationId),
        clientAdapter.getWhatsappAvailableDefinitions(locationId),
      ]);

      if (submitted?.statusCode || submitted?.success === false) {
        setError(
          submitted?.message || submitted?.error || "Failed to fetch templates"
        );
      } else {
        setSubmittedTemplates(submitted || {});
      }

      if (available && !available?.statusCode) {
        setAvailableDefinitions(available || {});
      }
    } catch (e) {
      setError("Error fetching notification templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationId) {
      fetchData();
    }
  }, [locationId]);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await clientAdapter.syncWhatsappTemplateStatuses(locationId);
      if (res?.success) {
        setSuccessMessage(
          `Synced ${res.updated || 0} template status${
            res.updated !== 1 ? "es" : ""
          }`
        );
        fetchData();
      } else {
        setError(res?.error || "Failed to sync template statuses");
      }
    } catch (e) {
      setError("Error syncing template statuses");
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmitDefinition = async (definitionId) => {
    setSubmitting(definitionId);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await clientAdapter.submitWhatsappDefinition(
        locationId,
        definitionId
      );
      if (res?.success) {
        setSuccessMessage("Template submitted for approval");
        fetchData();
      } else {
        setError(res?.error || "Failed to submit template");
      }
    } catch (e) {
      setError("Error submitting template");
    } finally {
      setSubmitting(null);
    }
  };

  const handleSetActive = async (mappingId) => {
    setActivating(mappingId);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await clientAdapter.setWhatsappActiveTemplate(
        locationId,
        mappingId
      );
      if (res?.success) {
        setSuccessMessage("Active template updated");
        fetchData();
      } else {
        setError(res?.error || "Failed to set active template");
      }
    } catch (e) {
      setError("Error setting active template");
    } finally {
      setActivating(null);
    }
  };

  const handleSubmitDefaults = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const res = await clientAdapter.submitWhatsappDefaultTemplates(
        locationId
      );
      if (res?.success) {
        setSuccessMessage("Default templates submitted for approval");
        fetchData();
      } else {
        setError(res?.error || "Failed to submit default templates");
      }
    } catch (e) {
      setError("Error submitting default templates");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return <CheckCircleIcon fontSize="small" color="success" />;
      case "PENDING":
        return <PendingIcon fontSize="small" color="warning" />;
      case "REJECTED":
        return <CancelIcon fontSize="small" color="error" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECTED":
        return "error";
      default:
        return "default";
    }
  };

  // Get all purposes (from both submitted and available)
  const allPurposes = [
    ...new Set([
      ...Object.keys(submittedTemplates),
      ...Object.keys(availableDefinitions),
    ]),
  ].sort();

  if (loading && Object.keys(submittedTemplates).length === 0) {
    return (
      <Box display="flex" alignItems="center" gap={2} py={2}>
        <CircularProgress size={20} />
        <Typography variant="body2" color="text.secondary">
          Loading notification templates...
        </Typography>
      </Box>
    );
  }

  const hasAnyTemplates = Object.keys(submittedTemplates).length > 0;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccessMessage(null)}
        >
          {successMessage}
        </Alert>
      )}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="body2" color="text.secondary">
          {allPurposes.length} notification type
          {allPurposes.length !== 1 ? "s" : ""} available
        </Typography>
        <Box display="flex" gap={1}>
          <Button
            size="small"
            startIcon={syncing ? <CircularProgress size={16} /> : <SyncIcon />}
            onClick={handleSync}
            disabled={syncing || loading}
          >
            {syncing ? "Syncing..." : "Sync Status"}
          </Button>
          {!hasAnyTemplates && (
            <Button
              size="small"
              variant="contained"
              onClick={handleSubmitDefaults}
              disabled={loading}
            >
              Submit All Default Templates
            </Button>
          )}
        </Box>
      </Box>

      {allPurposes.length === 0 ? (
        <Alert severity="info">
          No notification templates configured. Click "Submit All Default
          Templates" to create default templates for each notification type.
        </Alert>
      ) : (
        <Box>
          {allPurposes.map((purpose) => {
            const submitted = submittedTemplates[purpose] || {
              active: null,
              all: [],
            };
            const available = availableDefinitions[purpose] || {
              submitted: [],
              available: [],
            };
            const approvedTemplates = submitted.all.filter(
              (t) => t.status === "APPROVED"
            );

            return (
              <Paper key={purpose} variant="outlined" sx={{ mb: 2, p: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {PURPOSE_LABELS[purpose] || purpose}
                </Typography>

                {/* Submitted Templates */}
                {submitted.all.length > 0 && (
                  <Box mb={2}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Submitted Templates:
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Version</TableCell>
                            <TableCell>Template Name</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Active</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {submitted.all.map((template) => (
                            <TableRow key={template.id}>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{ fontFamily: "monospace" }}
                                >
                                  {formatVersion(template.definitionVersion) ||
                                    "Legacy"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: "monospace",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {template.templateName || "-"}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Box display="flex" alignItems="center" gap={1}>
                                  {getStatusIcon(template.status)}
                                  <Chip
                                    label={template.status}
                                    size="small"
                                    color={getStatusColor(template.status)}
                                    variant="outlined"
                                  />
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Chip
                                  label={template.isActive ? "Active" : "-"}
                                  size="small"
                                  color={
                                    template.isActive ? "success" : "default"
                                  }
                                  variant={
                                    template.isActive ? "filled" : "outlined"
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                {template.status === "APPROVED" &&
                                  !template.isActive && (
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() =>
                                        handleSetActive(template.id)
                                      }
                                      disabled={activating === template.id}
                                    >
                                      {activating === template.id
                                        ? "..."
                                        : "Set Active"}
                                    </Button>
                                  )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                )}

                {/* Available Definitions to Submit */}
                {available.available.length > 0 && (
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Available Versions to Submit:
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {available.available.map((def) => (
                        <Chip
                          key={def.id}
                          label={`v${formatVersion(def.version)}${
                            def.isCurrent ? " (Latest)" : ""
                          }`}
                          onClick={() => handleSubmitDefinition(def.id)}
                          disabled={submitting === def.id}
                          color={def.isCurrent ? "primary" : "default"}
                          variant="outlined"
                          sx={{ cursor: "pointer" }}
                          icon={
                            submitting === def.id ? (
                              <CircularProgress size={14} />
                            ) : null
                          }
                        />
                      ))}
                    </Box>
                  </Box>
                )}

                {submitted.all.length === 0 &&
                  available.available.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No templates available for this purpose.
                    </Typography>
                  )}
              </Paper>
            );
          })}
        </Box>
      )}
    </Box>
  );
}

export default function WhatsAppPage() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("yumpos_user_info") || "{}");
  const locationInfo = JSON.parse(
    localStorage.getItem("yumpos_location") || "{}"
  );

  const handleCreateTemplate = () => {
    navigate("/whatsapp/templates/create");
  };

  // Check if WhatsApp feature is enabled for this location
  if (!userInfo.isWhatsappEnabled) {
    return (
      <Container className="px-0" fluid>
        <Box p={3}>
          <Alert severity="warning">
            WhatsApp Business is not enabled for this location. Please contact
            your administrator to enable this premium feature.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container className="px-0" fluid>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          WhatsApp Business
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Connect and manage WhatsApp Business for{" "}
          {locationInfo.name || "your location"}
        </Typography>

        <Card
          border="light"
          className="shadow-sm mt-4"
          style={{ overflow: "visible", maxHeight: "none", height: "auto" }}
        >
          <Card.Header>
            <Typography variant="h6">WhatsApp Setup</Typography>
          </Card.Header>
          <Card.Body style={{ overflow: "visible", maxHeight: "none" }}>
            <WhatsAppSetup locationId={locationInfo.locationId} />
          </Card.Body>
        </Card>

        <Card
          border="light"
          className="shadow-sm mt-4"
          style={{ overflow: "visible", maxHeight: "none", height: "auto" }}
        >
          <Card.Header>
            <Typography variant="h6">Notification Templates</Typography>
          </Card.Header>
          <Card.Body style={{ overflow: "visible", maxHeight: "none" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              These templates are used for automated notifications (invoices,
              appointments, birthday wishes). Status is synced from Meta and
              templates must be approved before use.
            </Typography>
            <NotificationTemplates locationId={locationInfo.locationId} />
          </Card.Body>
        </Card>

        <Card
          border="light"
          className="shadow-sm mt-4"
          style={{ overflow: "visible", maxHeight: "none", height: "auto" }}
        >
          <Card.Header>
            <Typography variant="h6">Message Templates</Typography>
          </Card.Header>
          <Card.Body style={{ overflow: "visible", maxHeight: "none" }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Templates are pre-approved message formats for initiating
              conversations outside the 24-hour window.
            </Typography>
            <WhatsAppTemplates
              locationId={locationInfo.locationId}
              onCreateClick={handleCreateTemplate}
            />
          </Card.Body>
        </Card>
      </Box>
    </Container>
  );
}
