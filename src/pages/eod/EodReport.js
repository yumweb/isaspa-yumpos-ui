/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import ReactToPrint from "react-to-print";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import clientAdapter from "../../lib/clientAdapter";

// Auto-filled metrics (editable). Keys match the API entity / prefill metrics.
const METRIC_FIELDS = [
  { key: "clientsVisits", label: "Clients Visits", type: "number" },
  { key: "totalSale", label: "Total Sale", type: "number" },
  { key: "membershipSold", label: "Membership Sold", type: "number" },
  { key: "mtdMembershipSale", label: "MTD Membership Sale", type: "number" },
  { key: "googleReviews", label: "Google Reviews Received", type: "number" },
  {
    key: "whatsappBroadcast",
    label: "WhatsApp Communication (Broadcast)",
    type: "number",
  },
];

// Manual counts / short notes.
const MANUAL_FIELDS = [
  { key: "fbInstaUpdated", label: "FB/Instagram Post/Story Updated", type: "text" },
  { key: "retentionCalls", label: "Retention Calls Done (if any)", type: "number" },
  { key: "feedbackForms", label: "Feedback Forms Collected", type: "number" },
  {
    key: "leadsFollowupCalls",
    label: "Leads Follow-up Calls Done (if any)",
    type: "number",
  },
];

// Manual operational checklist (free text).
const CHECKLIST_FIELDS = [
  { key: "staffAttendance", label: "Staff Attendance & Grooming Check" },
  { key: "spaHygiene", label: "SPA Hygiene & Cleanliness Status" },
  { key: "stockCheck", label: "Stock Check (Low Stock / Required Items)" },
  { key: "teamBriefing", label: "Team Briefing Conducted (Morning)" },
  { key: "localMarketing", label: "Local Marketing Activities (if any)" },
  { key: "customerIssues", label: "Customer Issues/Complaints & Resolution" },
  { key: "appointmentPlanning", label: "Appointment Planning for Next Day" },
  { key: "suggestions", label: "Suggestions for Improvement" },
];

const ALL_FIELDS = [...METRIC_FIELDS, ...MANUAL_FIELDS, ...CHECKLIST_FIELDS];

const emptyForm = () =>
  ALL_FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: "" }), {});

const EodReport = () => {
  const userInfo = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("yumpos_user_info") || "{}");
    } catch {
      return {};
    }
  }, []);
  const isCorporate = !!userInfo.isCorporate;
  const currentLocation = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("yumpos_location") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [locations, setLocations] = useState([]);
  const [locationId, setLocationId] = useState(
    currentLocation?.locationId ? String(currentLocation.locationId) : ""
  );
  const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
  const [form, setForm] = useState(emptyForm());
  const [threeDays, setThreeDays] = useState([]); // [{date, report}] oldest -> newest
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const printRef = useRef();

  const locName = (id) => {
    const l = locations.find((x) => String(x.locationId) === String(id));
    return l?.name || l?.locationName || currentLocation?.name || `Location ${id}`;
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await clientAdapter.getUserLocations(userInfo.employeeId);
        const locs = res?.locations || [];
        setLocations(locs);
        if (!locationId && locs.length) setLocationId(String(locs[0].locationId));
      } catch (e) {
        /* non-fatal: keep current location */
      }
    })();
  }, []);

  const loadThreeDays = async () => {
    const days = [
      moment(date).subtract(2, "days").format("YYYY-MM-DD"),
      moment(date).subtract(1, "days").format("YYYY-MM-DD"),
      date,
    ];
    let byDate = {};
    try {
      const rows = await clientAdapter.getEodReports(locationId, days[0], days[2]);
      (rows || []).forEach((r) => {
        byDate[moment(r.reportDate).format("YYYY-MM-DD")] = r;
      });
    } catch (e) {
      byDate = {};
    }
    setThreeDays(days.map((d) => ({ date: d, report: byDate[d] || null })));
  };

  const loadDay = async () => {
    if (!locationId || !date) return;
    setLoading(true);
    setSavedAt(null);
    try {
      const prefill = await clientAdapter.getEodPrefill(locationId, date);
      const next = emptyForm();
      if (prefill?.report) {
        ALL_FIELDS.forEach((f) => {
          const v = prefill.report[f.key];
          next[f.key] = v === null || v === undefined ? "" : v;
        });
      } else if (prefill?.metrics) {
        METRIC_FIELDS.forEach((f) => {
          const v = prefill.metrics[f.key];
          next[f.key] = v === null || v === undefined ? "" : v;
        });
      }
      setForm(next);
      await loadThreeDays();
    } catch (e) {
      setForm(emptyForm());
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDay();
  }, [locationId, date]);

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const buildPayload = () => {
    const payload = { locationId: Number(locationId), reportDate: date };
    [...METRIC_FIELDS, ...MANUAL_FIELDS].forEach((f) => {
      const v = form[f.key];
      if (v === "" || v === null || v === undefined) return;
      if (f.type === "number") {
        if (!isNaN(Number(v))) payload[f.key] = Number(v);
      } else {
        payload[f.key] = String(v);
      }
    });
    CHECKLIST_FIELDS.forEach((f) => {
      if (form[f.key]) payload[f.key] = String(form[f.key]);
    });
    return payload;
  };

  const save = async () => {
    setSaving(true);
    try {
      await clientAdapter.saveEodReport(buildPayload());
      setSavedAt(moment().format("HH:mm"));
      await loadThreeDays();
    } catch (e) {
      alert("Could not save the EOD report. Please try again.");
    }
    setSaving(false);
  };

  const cellValue = (report, key) => {
    if (!report) return "";
    const v = report[key];
    return v === null || v === undefined ? "" : String(v);
  };

  const fieldRow = (f) => (
    <Box
      key={f.key}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mb: 1.25,
      }}
    >
      <Typography sx={{ fontSize: 14, color: "#333" }}>{f.label}</Typography>
      <TextField
        size="small"
        type={f.type}
        value={form[f.key]}
        onChange={(e) => setField(f.key, e.target.value)}
        sx={{ width: 140 }}
      />
    </Box>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography fontSize={22} fontWeight="bold">
        EOD / Spa Closing Report
      </Typography>
      <Typography fontSize={14} color="text.secondary" mb={2}>
        Daily end-of-day checklist. Metrics auto-fill from POS; edit any field,
        then Save.
      </Typography>

      {/* Controls */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Spa Location"
              value={locationId}
              disabled={!isCorporate}
              onChange={(e) => setLocationId(e.target.value)}
            >
              {locations.length ? (
                locations.map((l) => (
                  <MenuItem key={l.locationId} value={String(l.locationId)}>
                    {l.name || l.locationName || `Location ${l.locationId}`}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value={locationId}>{locName(locationId)}</MenuItem>
              )}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              type="date"
              fullWidth
              size="small"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={date}
              inputProps={{ max: moment().format("YYYY-MM-DD") }}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={6}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                variant="contained"
                onClick={save}
                disabled={saving || loading}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <ReactToPrint
                trigger={() => (
                  <Button variant="outlined">Print 3-Day</Button>
                )}
                content={() => printRef.current}
              />
              {savedAt && (
                <Typography color="success.main" fontSize={14}>
                  Saved {savedAt}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography fontWeight="bold" mb={1.5}>
                Metrics{" "}
                <Typography component="span" fontSize={13} color="text.secondary">
                  (auto-filled, editable)
                </Typography>
              </Typography>
              {METRIC_FIELDS.map(fieldRow)}
              {MANUAL_FIELDS.map(fieldRow)}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography fontWeight="bold" mb={1.5}>
                Operational Checklist
              </Typography>
              {CHECKLIST_FIELDS.map((f) => (
                <Box key={f.key} sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontSize: 14, color: "#333", mb: 0.5 }}>
                    {f.label}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    minRows={2}
                    value={form[f.key]}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                </Box>
              ))}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 3-Day comparison (also the print target) */}
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Typography fontWeight="bold" mb={1.5}>
          3-Day Comparison
        </Typography>
        <Box ref={printRef} sx={{ p: 1 }}>
          <Typography align="center" fontWeight="bold">
            ISA SPA EOD Report
          </Typography>
          <Typography align="center" mb={1.5}>
            <strong>Spa Location:</strong> {locName(locationId)}
          </Typography>
          <Table size="small" sx={{ "& td, & th": { border: "1px solid #ddd" } }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: "34%", fontWeight: "bold" }}>
                  EOD Report
                </TableCell>
                {threeDays.map((d, i) => (
                  <TableCell key={d.date} align="center" sx={{ fontWeight: "bold" }}>
                    Day {i + 1}
                    <div style={{ fontWeight: 400, fontSize: 12, color: "#777" }}>
                      {moment(d.date).format("DD.MM.YY")}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {ALL_FIELDS.map((f) => (
                <TableRow key={f.key}>
                  <TableCell>{f.label}</TableCell>
                  {threeDays.map((d) => (
                    <TableCell key={d.date + f.key}>
                      {cellValue(d.report, f.key)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
};

export default EodReport;
