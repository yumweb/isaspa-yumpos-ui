import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Card } from "@themesberg/react-bootstrap";
import {
  Box, Typography, Alert, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, CircularProgress, Button, IconButton,
  Tooltip, LinearProgress, Grid, Divider, TablePagination, TextField,
  InputAdornment
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import ErrorIcon from "@mui/icons-material/Error";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PeopleIcon from "@mui/icons-material/People";
import CampaignIcon from "@mui/icons-material/Campaign";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from "recharts";
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

const RECIPIENT_STATUS_COLORS = {
  pending: "default",
  sent: "info",
  delivered: "primary",
  read: "success",
  failed: "error",
};

const RECIPIENT_STATUS_LABELS = {
  pending: "Pending",
  sent: "Sent",
  delivered: "Delivered",
  read: "Read",
  failed: "Failed",
};

const CHART_COLORS = {
  sent: "#2196f3",
  delivered: "#1976d2",
  read: "#4caf50",
  failed: "#f44336",
  pending: "#9e9e9e",
};

export default function WhatsAppCampaignView() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const locationInfo = JSON.parse(localStorage.getItem("yumpos_location") || "{}");
  const userInfo = JSON.parse(localStorage.getItem("yumpos_user_info") || "{}");
  const locationId = locationInfo.locationId;

  const [campaign, setCampaign] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalRecipients, setTotalRecipients] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Auto-refresh for sending campaigns
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await clientAdapter.getWhatsappCampaign(locationId, campaignId);
      if (res?.success) {
        setCampaign(res.data);
        setStats(res.data.stats);
        // Auto-refresh if campaign is sending
        setAutoRefresh(res.data.status === "sending");
      } else {
        setError(res?.error || "Failed to fetch campaign");
      }
    } catch (e) {
      setError("Error fetching campaign");
    }
  }, [locationId, campaignId]);

  const fetchRecipients = useCallback(async () => {
    setRecipientsLoading(true);
    try {
      const res = await clientAdapter.getWhatsappCampaignRecipients(
        locationId,
        campaignId,
        {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          status: statusFilter,
        }
      );
      if (res?.success) {
        setRecipients(res.data.recipients || []);
        setTotalRecipients(res.data.total || 0);
      } else {
        setError(res?.error || "Failed to fetch recipients");
      }
    } catch (e) {
      setError("Error fetching recipients");
    } finally {
      setRecipientsLoading(false);
    }
  }, [locationId, campaignId, page, rowsPerPage, searchTerm, statusFilter]);

  useEffect(() => {
    if (locationId && campaignId) {
      setLoading(true);
      Promise.all([fetchCampaign(), fetchRecipients()]).finally(() => {
        setLoading(false);
      });
    }
  }, [locationId, campaignId]);

  useEffect(() => {
    if (!loading) {
      fetchRecipients();
    }
  }, [page, rowsPerPage, searchTerm, statusFilter]);

  // Auto-refresh every 10 seconds when campaign is sending
  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchCampaign();
        fetchRecipients();
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchCampaign, fetchRecipients]);

  const handleStart = async () => {
    setActionLoading(true);
    try {
      const res = await clientAdapter.startWhatsappCampaign(locationId, campaignId);
      if (res?.success) {
        fetchCampaign();
        fetchRecipients();
      } else {
        setError(res?.error || "Failed to start campaign");
      }
    } catch (e) {
      setError("Error starting campaign");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePause = async () => {
    setActionLoading(true);
    try {
      const res = await clientAdapter.pauseWhatsappCampaign(locationId, campaignId);
      if (res?.success) {
        fetchCampaign();
      } else {
        setError(res?.error || "Failed to pause campaign");
      }
    } catch (e) {
      setError("Error pausing campaign");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this campaign? This cannot be undone.")) return;
    setActionLoading(true);
    try {
      const res = await clientAdapter.cancelWhatsappCampaign(locationId, campaignId);
      if (res?.success) {
        fetchCampaign();
      } else {
        setError(res?.error || "Failed to cancel campaign");
      }
    } catch (e) {
      setError("Error cancelling campaign");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchCampaign();
    fetchRecipients();
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

  const getProgress = () => {
    if (!stats || !stats.totalRecipients) return 0;
    const processed = stats.sentCount + stats.failedCount;
    return Math.round((processed / stats.totalRecipients) * 100);
  };

  const getChartData = () => {
    if (!stats) return [];
    return [
      { name: "Read", value: stats.readCount || 0, color: CHART_COLORS.read },
      { name: "Delivered", value: (stats.deliveredCount || 0) - (stats.readCount || 0), color: CHART_COLORS.delivered },
      { name: "Sent", value: (stats.sentCount || 0) - (stats.deliveredCount || 0), color: CHART_COLORS.sent },
      { name: "Failed", value: stats.failedCount || 0, color: CHART_COLORS.failed },
      { name: "Pending", value: (stats.totalRecipients || 0) - (stats.sentCount || 0) - (stats.failedCount || 0), color: CHART_COLORS.pending },
    ].filter(d => d.value > 0);
  };

  const getRecipientStatusIcon = (status) => {
    switch (status) {
      case "pending": return <ScheduleIcon fontSize="small" />;
      case "sent": return <DoneIcon fontSize="small" />;
      case "delivered": return <DoneAllIcon fontSize="small" />;
      case "read": return <DoneAllIcon fontSize="small" color="success" />;
      case "failed": return <ErrorIcon fontSize="small" color="error" />;
      default: return null;
    }
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

  if (loading) {
    return (
      <Container className="px-0" fluid>
        <Box p={3} display="flex" alignItems="center" justifyContent="center" minHeight={300}>
          <CircularProgress size={32} sx={{ mr: 2 }} />
          <Typography color="text.secondary">Loading campaign...</Typography>
        </Box>
      </Container>
    );
  }

  if (!campaign) {
    return (
      <Container className="px-0" fluid>
        <Box p={3}>
          <Alert severity="error">Campaign not found</Alert>
          <Box mt={2}>
            <Link to="/whatsapp/campaigns" style={{ textDecoration: "none" }}>
              <Button startIcon={<ArrowBackIcon />}>Back to Campaigns</Button>
            </Link>
          </Box>
        </Box>
      </Container>
    );
  }

  const progress = getProgress();
  const chartData = getChartData();

  return (
    <Container className="px-0" fluid>
      <Box p={3} pb={10}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Link to="/whatsapp/campaigns" style={{ textDecoration: "none" }}>
                <IconButton size="small">
                  <ArrowBackIcon />
                </IconButton>
              </Link>
              <Typography variant="h4" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CampaignIcon /> {campaign.name}
              </Typography>
              <Chip
                label={STATUS_LABELS[campaign.status] || campaign.status}
                color={STATUS_COLORS[campaign.status] || "default"}
                size="small"
              />
            </Box>
            {campaign.description && (
              <Typography variant="body2" color="text.secondary" ml={5}>
                {campaign.description}
              </Typography>
            )}
          </Box>
          <Box display="flex" gap={1}>
            <Tooltip title={autoRefresh ? "Auto-refreshing every 10s" : "Refresh"}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={recipientsLoading}
              >
                {autoRefresh ? "Auto" : "Refresh"}
              </Button>
            </Tooltip>

            {campaign.status === "draft" && (
              <>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/whatsapp/campaigns/edit/${campaignId}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleStart}
                  disabled={actionLoading}
                >
                  Start Campaign
                </Button>
              </>
            )}

            {campaign.status === "sending" && (
              <>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<PauseIcon />}
                  onClick={handlePause}
                  disabled={actionLoading}
                >
                  Pause
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
              </>
            )}

            {campaign.status === "paused" && (
              <>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleStart}
                  disabled={actionLoading}
                >
                  Resume
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Campaign Info & Stats */}
        <Grid container spacing={3} mb={3}>
          {/* Campaign Details */}
          <Grid item xs={12} md={4}>
            <Card border="light" className="shadow-sm h-100">
              <Card.Body>
                <Typography variant="h6" gutterBottom>Campaign Details</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">Template</Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                    {campaign.templateName}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">Audience Type</Typography>
                  <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
                    {campaign.audienceType?.replace("_", " ")}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="caption" color="text.secondary">Created</Typography>
                  <Typography variant="body2">{formatDate(campaign.createdAt)}</Typography>
                </Box>

                {campaign.scheduledAt && (
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">Scheduled For</Typography>
                    <Typography variant="body2">{formatDate(campaign.scheduledAt)}</Typography>
                  </Box>
                )}

                {campaign.startedAt && (
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">Started</Typography>
                    <Typography variant="body2">{formatDate(campaign.startedAt)}</Typography>
                  </Box>
                )}

                {campaign.completedAt && (
                  <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">Completed</Typography>
                    <Typography variant="body2">{formatDate(campaign.completedAt)}</Typography>
                  </Box>
                )}
              </Card.Body>
            </Card>
          </Grid>

          {/* Progress */}
          <Grid item xs={12} md={4}>
            <Card border="light" className="shadow-sm h-100">
              <Card.Body>
                <Typography variant="h6" gutterBottom>Progress</Typography>
                <Divider sx={{ mb: 2 }} />

                <Box mb={3}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" color="text.secondary">
                      {stats?.sentCount || 0} of {stats?.totalRecipients || 0} sent
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    color={progress === 100 ? "success" : "primary"}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1} bgcolor="info.lighter" borderRadius={1}>
                      <Typography variant="h5" color="info.main">
                        {stats?.sentCount || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Sent</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1} bgcolor="primary.lighter" borderRadius={1}>
                      <Typography variant="h5" color="primary.main">
                        {stats?.deliveredCount || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Delivered</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1} bgcolor="success.lighter" borderRadius={1}>
                      <Typography variant="h5" color="success.main">
                        {stats?.readCount || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Read</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" p={1} bgcolor="error.lighter" borderRadius={1}>
                      <Typography variant="h5" color="error.main">
                        {stats?.failedCount || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Failed</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Card.Body>
            </Card>
          </Grid>

          {/* Chart */}
          <Grid item xs={12} md={4}>
            <Card border="light" className="shadow-sm h-100">
              <Card.Body>
                <Typography variant="h6" gutterBottom>Delivery Status</Typography>
                <Divider sx={{ mb: 2 }} />

                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="center" height={200}>
                    <Typography color="text.secondary">No data yet</Typography>
                  </Box>
                )}
              </Card.Body>
            </Card>
          </Grid>
        </Grid>

        {/* Recipients Table */}
        <Card border="light" className="shadow-sm">
          <Card.Body>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <PeopleIcon /> Recipients
              </Typography>
              <Box display="flex" gap={2}>
                <TextField
                  size="small"
                  placeholder="Search phone or name..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(0);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 250 }}
                />
                <TextField
                  select
                  size="small"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  SelectProps={{ native: true }}
                  sx={{ width: 150 }}
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="read">Read</option>
                  <option value="failed">Failed</option>
                </TextField>
              </Box>
            </Box>

            {recipientsLoading && <LinearProgress sx={{ mb: 1 }} />}

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Phone Number</strong></TableCell>
                    <TableCell><strong>Customer</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Sent At</strong></TableCell>
                    <TableCell><strong>Delivered At</strong></TableCell>
                    <TableCell><strong>Read At</strong></TableCell>
                    <TableCell><strong>Error</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recipients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography color="text.secondary" py={2}>
                          {campaign.status === "draft"
                            ? "Recipients will be populated when the campaign starts"
                            : "No recipients found"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recipients.map((recipient) => (
                      <TableRow key={recipient.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                            {recipient.phoneNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {recipient.customerName || "-"}
                          </Typography>
                          {recipient.customerId && (
                            <Typography variant="caption" color="text.secondary">
                              ID: {recipient.customerId}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getRecipientStatusIcon(recipient.status)}
                            label={RECIPIENT_STATUS_LABELS[recipient.status] || recipient.status}
                            size="small"
                            color={RECIPIENT_STATUS_COLORS[recipient.status] || "default"}
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {formatDate(recipient.sentAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {formatDate(recipient.deliveredAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {formatDate(recipient.readAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {recipient.errorMessage && (
                            <Tooltip title={recipient.errorMessage}>
                              <Typography
                                variant="caption"
                                color="error"
                                sx={{
                                  maxWidth: 150,
                                  display: "block",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap"
                                }}
                              >
                                {recipient.errorCode}: {recipient.errorMessage}
                              </Typography>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={totalRecipients}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </Card.Body>
        </Card>

        <Box mt={2}>
          <Link to="/whatsapp/campaigns" style={{ textDecoration: "none" }}>
            <Button variant="text" size="small" startIcon={<ArrowBackIcon />}>
              Back to Campaigns
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
