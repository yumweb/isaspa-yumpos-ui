import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Card } from "@themesberg/react-bootstrap";
import {
  Box, Typography, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress, Button, IconButton,
  Tooltip, LinearProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import CampaignIcon from "@mui/icons-material/Campaign";
import clientAdapter from "../../lib/clientAdapter";

const STATUS_COLORS = {
  draft: "default",
  scheduled: "info",
  sending: "warning",
  sent: "success",
  paused: "secondary",
  cancelled: "error",
};

const STATUS_LABELS = {
  draft: "Draft",
  scheduled: "Scheduled",
  sending: "Sending",
  sent: "Completed",
  paused: "Paused",
  cancelled: "Cancelled",
};

export default function WhatsAppCampaigns() {
  const navigate = useNavigate();
  const locationInfo = JSON.parse(localStorage.getItem("yumpos_location") || "{}");
  const userInfo = JSON.parse(localStorage.getItem("yumpos_user_info") || "{}");
  const locationId = locationInfo.locationId;

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientAdapter.getWhatsappCampaigns(locationId);
      if (res?.success) {
        setCampaigns(res.data || []);
      } else {
        setError(res?.error || "Failed to fetch campaigns");
      }
    } catch (e) {
      setError("Error fetching campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (locationId) {
      fetchCampaigns();
    }
  }, [locationId]);

  const handleStart = async (campaignId) => {
    setActionLoading({ ...actionLoading, [campaignId]: "start" });
    try {
      const res = await clientAdapter.startWhatsappCampaign(locationId, campaignId);
      if (res?.success) {
        fetchCampaigns();
      } else {
        setError(res?.error || "Failed to start campaign");
      }
    } catch (e) {
      setError("Error starting campaign");
    } finally {
      setActionLoading({ ...actionLoading, [campaignId]: null });
    }
  };

  const handlePause = async (campaignId) => {
    setActionLoading({ ...actionLoading, [campaignId]: "pause" });
    try {
      const res = await clientAdapter.pauseWhatsappCampaign(locationId, campaignId);
      if (res?.success) {
        fetchCampaigns();
      } else {
        setError(res?.error || "Failed to pause campaign");
      }
    } catch (e) {
      setError("Error pausing campaign");
    } finally {
      setActionLoading({ ...actionLoading, [campaignId]: null });
    }
  };

  const handleCancel = async (campaignId) => {
    if (!window.confirm("Are you sure you want to cancel this campaign?")) return;
    setActionLoading({ ...actionLoading, [campaignId]: "cancel" });
    try {
      const res = await clientAdapter.cancelWhatsappCampaign(locationId, campaignId);
      if (res?.success) {
        fetchCampaigns();
      } else {
        setError(res?.error || "Failed to cancel campaign");
      }
    } catch (e) {
      setError("Error cancelling campaign");
    } finally {
      setActionLoading({ ...actionLoading, [campaignId]: null });
    }
  };

  const handleDelete = async (campaignId) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    setActionLoading({ ...actionLoading, [campaignId]: "delete" });
    try {
      const res = await clientAdapter.deleteWhatsappCampaign(locationId, campaignId);
      if (res?.success) {
        fetchCampaigns();
      } else {
        setError(res?.error || "Failed to delete campaign");
      }
    } catch (e) {
      setError("Error deleting campaign");
    } finally {
      setActionLoading({ ...actionLoading, [campaignId]: null });
    }
  };

  const getProgress = (campaign) => {
    const stats = campaign.stats;
    if (!stats || !stats.totalRecipients) return 0;
    const processed = stats.sentCount + stats.failedCount;
    return Math.round((processed / stats.totalRecipients) * 100);
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if WhatsApp is enabled
  if (!userInfo.isWhatsappEnabled) {
    return (
      <Container className="px-0" fluid>
        <Box p={3}>
          <Alert severity="warning">
            WhatsApp Business is not enabled for this location.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container className="px-0" fluid>
      <Box p={3} pb={10}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CampaignIcon /> WhatsApp Campaigns
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Send bulk marketing messages to your customers
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchCampaigns}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/whatsapp/campaigns/create")}
            >
              Create Campaign
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Card border="light" className="shadow-sm">
          <Card.Body>
            {loading ? (
              <Box display="flex" alignItems="center" justifyContent="center" py={4}>
                <CircularProgress size={24} sx={{ mr: 2 }} />
                <Typography color="text.secondary">Loading campaigns...</Typography>
              </Box>
            ) : campaigns.length === 0 ? (
              <Alert severity="info">
                No campaigns yet. Click "Create Campaign" to send your first marketing message.
              </Alert>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Campaign</strong></TableCell>
                      <TableCell><strong>Template</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Progress</strong></TableCell>
                      <TableCell><strong>Created</strong></TableCell>
                      <TableCell sx={{ width: 150 }}><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {campaigns.map((campaign) => {
                      const progress = getProgress(campaign);
                      const isActionLoading = !!actionLoading[campaign.id];

                      return (
                        <TableRow key={campaign.id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {campaign.name}
                            </Typography>
                            {campaign.description && (
                              <Typography variant="caption" color="text.secondary">
                                {campaign.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
                              {campaign.templateName}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={STATUS_LABELS[campaign.status] || campaign.status}
                              size="small"
                              color={STATUS_COLORS[campaign.status] || "default"}
                            />
                          </TableCell>
                          <TableCell sx={{ minWidth: 150 }}>
                            {campaign.status === "sending" || campaign.status === "sent" ? (
                              <Box>
                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                  <Typography variant="caption" color="text.secondary">
                                    {campaign.stats?.sentCount || 0} / {campaign.stats?.totalRecipients || 0}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {progress}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={progress}
                                  color={progress === 100 ? "success" : "primary"}
                                />
                                {campaign.stats?.failedCount > 0 && (
                                  <Typography variant="caption" color="error">
                                    {campaign.stats.failedCount} failed
                                  </Typography>
                                )}
                              </Box>
                            ) : campaign.status === "draft" ? (
                              <Typography variant="caption" color="text.secondary">
                                Not started
                              </Typography>
                            ) : campaign.status === "scheduled" ? (
                              <Typography variant="caption" color="text.secondary">
                                Scheduled: {formatDate(campaign.scheduledAt)}
                              </Typography>
                            ) : (
                              <Typography variant="caption" color="text.secondary">
                                -
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {formatDate(campaign.createdAt)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" gap={0.5}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/whatsapp/campaigns/view/${campaign.id}`)}
                                >
                                  <VisibilityIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>

                              {campaign.status === "draft" && (
                                <>
                                  <Tooltip title="Edit">
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => navigate(`/whatsapp/campaigns/edit/${campaign.id}`)}
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Start Campaign">
                                    <IconButton
                                      size="small"
                                      color="success"
                                      onClick={() => handleStart(campaign.id)}
                                      disabled={isActionLoading}
                                    >
                                      <PlayArrowIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleDelete(campaign.id)}
                                      disabled={isActionLoading}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}

                              {campaign.status === "sending" && (
                                <>
                                  <Tooltip title="Pause">
                                    <IconButton
                                      size="small"
                                      color="warning"
                                      onClick={() => handlePause(campaign.id)}
                                      disabled={isActionLoading}
                                    >
                                      <PauseIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Cancel">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleCancel(campaign.id)}
                                      disabled={isActionLoading}
                                    >
                                      <CancelIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}

                              {campaign.status === "paused" && (
                                <>
                                  <Tooltip title="Resume">
                                    <IconButton
                                      size="small"
                                      color="success"
                                      onClick={() => handleStart(campaign.id)}
                                      disabled={isActionLoading}
                                    >
                                      <PlayArrowIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Cancel">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => handleCancel(campaign.id)}
                                      disabled={isActionLoading}
                                    >
                                      <CancelIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}

                              {campaign.status === "scheduled" && (
                                <Tooltip title="Cancel">
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleCancel(campaign.id)}
                                    disabled={isActionLoading}
                                  >
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card.Body>
        </Card>

        <Box mt={2}>
          <Link to="/whatsapp" style={{ textDecoration: "none" }}>
            <Button variant="text" size="small">
              Back to WhatsApp Settings
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
