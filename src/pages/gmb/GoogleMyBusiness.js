import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  MenuItem,
  Rating,
  Select,
  Snackbar,
  Alert,
  Tab,
  Tabs,
  TextField,
  Typography,
  Avatar,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Autocomplete,
} from "@mui/material";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import GoogleIcon from "@mui/icons-material/Google";
import RefreshIcon from "@mui/icons-material/Refresh";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import moment from "moment-timezone";
import clientAdapter from "../../lib/clientAdapter";
import { getFeatureAccess, getUserInfo } from "../../lib/featureAccess";

const PERFORMANCE_METRICS = [
  { value: "WEBSITE_CLICKS", label: "Website clicks" },
  { value: "CALL_CLICKS", label: "Calls" },
  { value: "BUSINESS_DIRECTION_REQUESTS", label: "Direction requests" },
  { value: "BUSINESS_IMPRESSIONS_DESKTOP_MAPS", label: "Impressions (Maps, desktop)" },
  { value: "BUSINESS_IMPRESSIONS_MOBILE_MAPS", label: "Impressions (Maps, mobile)" },
];

const fmtDate = (d) => d.toISOString().slice(0, 10);
const fmtDateTime = (d) => (d ? moment(d).format("DD MMM YYYY, h:mm A") : "");

const GoogleMyBusiness = () => {
  const location = useMemo(() => {
    try {
      return JSON.parse(window.localStorage.getItem("yumpos_location") || "{}");
    } catch {
      return {};
    }
  }, []);
  const locationId = location?.locationId;

  // Primary admin (personId 1) — gates the connected-account email + Disconnect.
  const isPrimaryAdmin = useMemo(() => {
    try {
      const u = JSON.parse(
        window.localStorage.getItem("yumpos_user_info") || "{}"
      );
      return Number(u.personId) === 1;
    } catch {
      return false;
    }
  }, []);

  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState(null);
  const [mapping, setMapping] = useState(null);
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState({ open: false, severity: "success", msg: "" });
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const notify = (msg, severity = "success") => {
    // Coerce to a string so an Error/object never renders as "[object Object]".
    const text =
      typeof msg === "string"
        ? msg
        : msg?.message || msg?.error || "Something went wrong, please try again";
    setToast({ open: true, severity, msg: text });
  };

  const loadState = useCallback(async () => {
    if (!locationId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const status = await clientAdapter.getGmbConnectionStatus(locationId);
      setConnected(!!status.connected);
      setConnectedEmail(status.email);
      if (status.connected) {
        const m = await clientAdapter.getGmbMapping(locationId);
        setMapping(m?.mapped ? m : null);
      }
    } catch (e) {
      notify("Failed to load Google My Business status", "error");
    } finally {
      setLoading(false);
    }
  }, [locationId]);

  useEffect(() => {
    loadState();
  }, [loadState]);

  const handleConnect = async () => {
    try {
      const { url } = await clientAdapter.getGmbAuthUrl(locationId);
      window.location.href = url;
    } catch {
      notify("Could not start Google connection", "error");
    }
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      await clientAdapter.disconnectGmbLocation(locationId);
      setMapping(null);
      setTab(0);
      setDisconnectOpen(false);
      notify("Location disconnected from Google");
    } catch {
      notify("Failed to disconnect", "error");
    } finally {
      setDisconnecting(false);
    }
  };

  // Logs the Google account out of this location and clears the stored token,
  // returning the page to the "Connect Google" state for a fresh sign-in.
  const handleLogoutAccount = async () => {
    setLoggingOut(true);
    try {
      await clientAdapter.logoutGmbAccount(locationId);
      setMapping(null);
      setConnected(false);
      setConnectedEmail(null);
      setTab(0);
      setLogoutOpen(false);
      notify("Google account logged out — you can now reconnect");
    } catch {
      notify("Failed to log out the Google account", "error");
    } finally {
      setLoggingOut(false);
    }
  };

  if (!locationId) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Select a location first to manage its Google Business Profile.
        </Alert>
      </Box>
    );
  }

  const gmbAccess = getFeatureAccess(getUserInfo(), "gmb");
  if (!gmbAccess.active) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          {gmbAccess.expired
            ? `Your Google My Business subscription expired${
                gmbAccess.expiry
                  ? " on " + moment(gmbAccess.expiry).format("DD MMM YYYY")
                  : ""
              }. Please contact your administrator to renew.`
            : "Google My Business is a premium feature. Please contact your administrator to enable it."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Google My Business
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {location?.name}
          </Typography>
        </Box>
        {connected && isPrimaryAdmin && (
          <Chip
            icon={<GoogleIcon />}
            label={connectedEmail || "Connected"}
            color="success"
            variant="outlined"
          />
        )}
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : !connected ? (
        <ConnectCard onConnect={handleConnect} />
      ) : !mapping ? (
        <MapLocationCard
          locationId={locationId}
          connectedEmail={connectedEmail}
          canLogout={isPrimaryAdmin}
          onLogout={() => setLogoutOpen(true)}
          onMapped={(m) => {
            setMapping(m);
            notify("Location linked to Google listing");
          }}
          onError={(msg) => notify(msg, "error")}
        />
      ) : (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <BaselineSummary mapping={mapping} />
            {isPrimaryAdmin && (
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<LinkOffIcon />}
                  onClick={() => setDisconnectOpen(true)}
                >
                  Disconnect
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="text"
                  onClick={() => setLogoutOpen(true)}
                >
                  Log out account
                </Button>
              </Stack>
            )}
          </Stack>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{ mt: 2, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Reviews" />
            <Tab label="Performance" />
            <Tab label="Posts & Photos" />
          </Tabs>
          <Box sx={{ pt: 2 }}>
            {tab === 0 && (
              <ReviewsTab locationId={locationId} notify={notify} />
            )}
            {tab === 1 && (
              <PerformanceTab locationId={locationId} notify={notify} />
            )}
            {tab === 2 && (
              <PostsTab locationId={locationId} notify={notify} />
            )}
          </Box>
        </>
      )}

      <Dialog open={disconnectOpen} onClose={() => setDisconnectOpen(false)}>
        <DialogTitle>Disconnect this location from Google?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This unlinks <strong>{location?.name}</strong> from its Google
            listing and removes its synced reviews and metrics from YumPOS. Your
            Google account stays connected, and you can re-link and re-sync any
            time. Replies already posted to Google are not affected.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisconnectOpen(false)} disabled={disconnecting}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDisconnect}
            disabled={disconnecting}
          >
            {disconnecting ? "Disconnecting…" : "Disconnect"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <DialogTitle>Log out the Google account?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This removes <strong>{location?.name}</strong>'s Google connection
            and clears the stored sign-in for{" "}
            <strong>{connectedEmail || "this account"}</strong>, so you can
            connect again with a fresh sign-in (use this if the wrong account
            was linked, or the Business Profile permission wasn't granted). Any
            synced reviews/metrics for this location are removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)} disabled={loggingOut}>
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleLogoutAccount}
            disabled={loggingOut}
          >
            {loggingOut ? "Logging out…" : "Log out & reconnect"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={toast.severity} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// ---- Connect ----------------------------------------------------------------

const ConnectCard = ({ onConnect }) => (
  <Card sx={{ maxWidth: 560 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Connect your Google account
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Connect the Google account that manages your business listings. You only
        need to do this once; each YumPOS location can then be linked to its
        Google listing.
      </Typography>
      <Button variant="contained" startIcon={<GoogleIcon />} onClick={onConnect}>
        Connect Google
      </Button>
    </CardContent>
  </Card>
);

// ---- Mapping ----------------------------------------------------------------

const MapLocationCard = ({
  locationId,
  connectedEmail,
  canLogout,
  onLogout,
  onMapped,
  onError,
}) => {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [gbpLocations, setGbpLocations] = useState([]);
  const [gbpLocationId, setGbpLocationId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const accs = await clientAdapter.getGmbAccounts(locationId);
        setAccounts(Array.isArray(accs) ? accs : []);
      } catch (e) {
        setAccounts([]);
        onError(e?.message || "Failed to load Google accounts");
      } finally {
        setLoading(false);
      }
    })();
    // Run once per location. onError is an inline prop (new each render); the
    // error path calls setState in the parent, so depending on it here would
    // re-fire the effect endlessly on a failing accounts call.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  const onSelectAccount = async (value) => {
    setAccountId(value);
    setGbpLocations([]);
    setGbpLocationId("");
    try {
      const locs = await clientAdapter.getGmbAccountLocations(locationId, value);
      setGbpLocations(Array.isArray(locs) ? locs : []);
    } catch (e) {
      setGbpLocations([]);
      onError(e?.message || "Failed to load locations for this account");
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const selected = gbpLocations.find(
        (l) => (l.name || "").split("/").pop() === gbpLocationId
      );
      const m = await clientAdapter.mapGmbLocation(locationId, {
        gbpAccountId: accountId,
        gbpLocationId,
        gmapsUri: selected?.metadata?.mapsUri,
        placeId: selected?.metadata?.placeId,
      });
      onMapped(m);
    } catch {
      onError("Failed to link this location");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ maxWidth: 640 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Link this location to a Google listing
        </Typography>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Google Business account
            </Typography>
            <Select
              fullWidth
              size="small"
              value={accountId}
              onChange={(e) => onSelectAccount(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Select an account
              </MenuItem>
              {accounts.map((a) => {
                const id = (a.name || "").split("/").pop();
                return (
                  <MenuItem key={id} value={id}>
                    {a.accountName || a.name} ({id})
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
          {accountId && (
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                Google listing
              </Typography>
              <Autocomplete
                size="small"
                options={gbpLocations}
                getOptionLabel={(l) => {
                  const id = (l.name || "").split("/").pop();
                  const addr = l.storefrontAddress?.addressLines?.join(", ");
                  return `${l.title || id}${addr ? " — " + addr : ""}`;
                }}
                isOptionEqualToValue={(a, b) => a.name === b.name}
                value={
                  gbpLocations.find(
                    (l) => (l.name || "").split("/").pop() === gbpLocationId
                  ) || null
                }
                onChange={(_, val) =>
                  setGbpLocationId(val ? (val.name || "").split("/").pop() : "")
                }
                renderInput={(params) => (
                  <TextField {...params} placeholder="Search a listing…" />
                )}
              />
            </Box>
          )}
          <Button
            variant="contained"
            disabled={!accountId || !gbpLocationId || saving}
            onClick={save}
          >
            {saving ? "Linking…" : "Link location"}
          </Button>

          {canLogout && (
            <>
              <Divider />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Connected as {connectedEmail || "this Google account"}.
                </Typography>
                <Button
                  size="small"
                  color="error"
                  startIcon={<LinkOffIcon />}
                  onClick={onLogout}
                  sx={{ display: "block", mt: 0.5 }}
                >
                  Wrong account or no listings? Log out &amp; reconnect
                </Button>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

const BaselineSummary = ({ mapping }) => (
  <Stack direction="row" spacing={3} sx={{ mt: 1 }}>
    <Box>
      <Typography variant="caption" color="text.secondary">
        Rating at connect
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Rating
          value={Number(mapping.averageRatingStart) || 0}
          precision={0.1}
          readOnly
          size="small"
        />
        <Typography variant="body2">
          {Number(mapping.averageRatingStart || 0).toFixed(1)}
        </Typography>
      </Stack>
    </Box>
    <Box>
      <Typography variant="caption" color="text.secondary">
        Reviews at connect
      </Typography>
      <Typography variant="body1">{mapping.totalReviewCountStart}</Typography>
    </Box>
  </Stack>
);

// ---- Reviews ----------------------------------------------------------------

const ReviewsTab = ({ locationId, notify }) => {
  const [reviews, setReviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [busyReview, setBusyReview] = useState(null);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientAdapter.getGmbReviews(locationId, page, limit);
      setReviews(res.reviews || []);
      setTotal(res.total || 0);
      const initial = {};
      (res.reviews || []).forEach((r) => {
        initial[r.reviewId] = r.reviewReplyComment || "";
      });
      setDrafts(initial);
    } catch {
      notify("Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  }, [locationId, page, notify]);

  useEffect(() => {
    load();
  }, [load]);

  // Wait for the background sync to finish by polling the location's
  // refreshInProgress flag (sync is fire-and-forget on the server).
  const waitForSync = async () => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 60; i++) {
      await sleep(3000);
      try {
        const m = await clientAdapter.getGmbMapping(locationId);
        if (!m?.refreshInProgress) return true;
      } catch {
        // keep polling
      }
    }
    return false; // timed out (still running server-side)
  };

  const sync = async () => {
    setSyncing(true);
    try {
      const res = await clientAdapter.syncGmbReviews(locationId);
      if (res.started === false) {
        notify(res.message || "A sync is already running", "info");
      } else {
        notify("Sync started — fetching reviews from Google…", "info");
      }
      const done = await waitForSync();
      await load();
      notify(
        done ? "Reviews updated" : "Still syncing in the background — refresh shortly",
        done ? "success" : "info"
      );
    } catch {
      notify("Sync failed", "error");
    } finally {
      setSyncing(false);
    }
  };

  const bulkAi = async () => {
    setBulkRunning(true);
    try {
      const res = await clientAdapter.bulkAiReplyGmb(locationId);
      notify(
        res.started
          ? `AI is replying to ${res.count} reviews in the background`
          : res.message || "Nothing to reply to",
        res.started ? "success" : "info"
      );
    } catch {
      notify("Some error occurred, please try again", "error");
    } finally {
      setBulkRunning(false);
    }
  };

  const aiSuggest = async (reviewId) => {
    setBusyReview(reviewId);
    try {
      const res = await clientAdapter.aiReplyGmbReview(locationId, reviewId);
      if (!res?.reply) throw new Error("empty AI reply");
      setDrafts((d) => ({ ...d, [reviewId]: res.reply }));
    } catch {
      notify("Some error occurred, please try again", "error");
    } finally {
      setBusyReview(null);
    }
  };

  const postReply = async (reviewId) => {
    setBusyReview(reviewId);
    try {
      await clientAdapter.replyGmbReview(locationId, reviewId, drafts[reviewId]);
      notify("Reply posted");
      await load();
    } catch {
      notify("Failed to post reply", "error");
    } finally {
      setBusyReview(null);
    }
  };

  const deleteReply = async (reviewId) => {
    setBusyReview(reviewId);
    try {
      await clientAdapter.deleteGmbReply(locationId, reviewId);
      notify("Reply deleted");
      await load();
    } catch {
      notify("Failed to delete reply", "error");
    } finally {
      setBusyReview(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={sync}
          disabled={syncing}
        >
          {syncing ? "Syncing…" : "Sync from Google"}
        </Button>
        <Button
          variant="outlined"
          startIcon={<AutoAwesomeIcon />}
          onClick={bulkAi}
          disabled={bulkRunning}
        >
          AI reply to all un-replied
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : reviews.length === 0 ? (
        <Alert severity="info">
          No reviews yet. Click “Sync from Google” to pull the latest.
        </Alert>
      ) : (
        <Stack spacing={2}>
          {reviews.map((r) => (
            <Card key={r.reviewId} variant="outlined">
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <Avatar src={r.reviewerProfilePhotoUrl}>
                    {(r.reviewerDisplayName || "?").charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>
                          {r.reviewerDisplayName || "Anonymous"}
                        </Typography>
                        {r.createTime && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {fmtDateTime(r.createTime)}
                          </Typography>
                        )}
                      </Box>
                      <Rating value={r.starRating || 0} readOnly size="small" />
                    </Stack>
                    {r.comment && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {r.comment}
                      </Typography>
                    )}
                    <Divider sx={{ my: 1.5 }} />
                    {r.reviewReplyComment && r.reviewReplyUpdateTime && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 0.5 }}
                      >
                        Replied {fmtDateTime(r.reviewReplyUpdateTime)}
                      </Typography>
                    )}
                    <TextField
                      fullWidth
                      multiline
                      minRows={2}
                      size="small"
                      placeholder="Write a reply…"
                      value={drafts[r.reviewId] || ""}
                      onChange={(e) =>
                        setDrafts((d) => ({ ...d, [r.reviewId]: e.target.value }))
                      }
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Button
                        size="small"
                        startIcon={<AutoAwesomeIcon />}
                        disabled={busyReview === r.reviewId}
                        onClick={() => aiSuggest(r.reviewId)}
                      >
                        AI suggest
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={
                          busyReview === r.reviewId || !drafts[r.reviewId]
                        }
                        onClick={() => postReply(r.reviewId)}
                      >
                        {r.reviewReplyComment ? "Update reply" : "Post reply"}
                      </Button>
                      {r.reviewReplyComment && (
                        <Button
                          size="small"
                          color="error"
                          disabled={busyReview === r.reviewId}
                          onClick={() => deleteReply(r.reviewId)}
                        >
                          Delete reply
                        </Button>
                      )}
                      {r.repliedByAi && (
                        <Chip size="small" label="AI" color="secondary" />
                      )}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent="center"
          >
            <Button
              size="small"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Typography variant="body2">
              Page {page} of {totalPages}
            </Typography>
            <Button
              size="small"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

// ---- Performance ------------------------------------------------------------

const PerformanceTab = ({ locationId, notify }) => {
  const [metric, setMetric] = useState(PERFORMANCE_METRICS[0].value);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const res = await clientAdapter.getGmbPerformance(
        locationId,
        metric,
        fmtDate(start),
        fmtDate(end)
      );
      setData(Array.isArray(res) ? res : []);
    } catch {
      notify("Failed to load performance metrics", "error");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [locationId, metric, notify]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <Box>
      <Select
        size="small"
        value={metric}
        onChange={(e) => setMetric(e.target.value)}
        sx={{ mb: 2, minWidth: 280 }}
      >
        {PERFORMANCE_METRICS.map((m) => (
          <MenuItem key={m.value} value={m.value}>
            {m.label}
          </MenuItem>
        ))}
      </Select>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Alert severity="info">No data for the last 30 days.</Alert>
      ) : (
        <Box sx={{ height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <RechartTooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4285F4"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

// ---- Posts & Photos ---------------------------------------------------------

const PostsTab = ({ locationId, notify }) => {
  const [posts, setPosts] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, m] = await Promise.all([
        clientAdapter.getGmbPosts(locationId),
        clientAdapter.getGmbMedia(locationId),
      ]);
      setPosts(Array.isArray(p) ? p : []);
      setMedia(Array.isArray(m) ? m : []);
    } catch {
      notify("Failed to load posts/photos", "error");
    } finally {
      setLoading(false);
    }
  }, [locationId, notify]);

  useEffect(() => {
    load();
  }, [load]);

  const createPost = async () => {
    if (!summary.trim()) return;
    setSaving(true);
    try {
      const body = { languageCode: "en", summary, topicType: "STANDARD" };
      if (postImage) {
        // Upload to DO Spaces first; Google fetches the post image from this URL.
        const { url } = await clientAdapter.uploadGmbImage(locationId, postImage);
        body.media = [{ mediaFormat: "PHOTO", sourceUrl: url }];
      }
      await clientAdapter.createGmbPost(locationId, body);
      setSummary("");
      setPostImage(null);
      notify("Post published");
      await load();
    } catch (e) {
      notify(e?.message || "Failed to publish post", "error");
    } finally {
      setSaving(false);
    }
  };

  const addPhoto = async () => {
    if (!photoFile) return;
    setSaving(true);
    try {
      const { url } = await clientAdapter.uploadGmbImage(locationId, photoFile);
      await clientAdapter.createGmbMedia(locationId, {
        mediaFormat: "PHOTO",
        locationAssociation: { category: "ADDITIONAL" },
        sourceUrl: url,
      });
      setPhotoFile(null);
      notify("Photo added");
      await load();
    } catch (e) {
      notify(e?.message || "Failed to add photo", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Create a post
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={2}
            size="small"
            placeholder="What's new?"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Button
              variant="contained"
              onClick={createPost}
              disabled={saving || !summary.trim()}
            >
              {saving ? "Publishing…" : "Publish post"}
            </Button>
            <Button
              component="label"
              variant="outlined"
              startIcon={<ImageIcon />}
              disabled={saving}
            >
              {postImage ? "Change image" : "Add image"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setPostImage(e.target.files?.[0] || null)}
              />
            </Button>
            {postImage && (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ maxWidth: 160 }}
                >
                  {postImage.name}
                </Typography>
                <IconButton size="small" onClick={() => setPostImage(null)}>
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Add a photo
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            <Button
              component="label"
              variant="outlined"
              startIcon={<ImageIcon />}
              disabled={saving}
            >
              {photoFile ? "Change file" : "Choose image"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              />
            </Button>
            {photoFile && (
              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{ maxWidth: 200 }}
              >
                {photoFile.name}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={addPhoto}
              disabled={saving || !photoFile}
            >
              {saving ? "Uploading…" : "Add"}
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Recent posts ({posts.length})
          </Typography>
          <Stack spacing={1} sx={{ mb: 3 }}>
            {posts.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No posts yet.
              </Typography>
            )}
            {posts.map((p) => (
              <Card key={p.name} variant="outlined">
                <CardContent sx={{ py: 1.5 }}>
                  <Typography variant="body2">{p.summary}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {p.state} · {p.createTime}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Photos ({media.length})
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {media.slice(0, 24).map((m) => (
              <Avatar
                key={m.name}
                src={m.thumbnailUrl || m.googleUrl}
                variant="rounded"
                sx={{ width: 80, height: 80 }}
              />
            ))}
          </Box>
        </>
      )}
    </Box>
  );
};

export default GoogleMyBusiness;
