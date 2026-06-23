/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import ReactToPrint from "react-to-print";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Table,
} from "@themesberg/react-bootstrap";
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
  {
    key: "fbInstaUpdated",
    label: "FB/Instagram Post/Story Updated",
    type: "text",
  },
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
    return l?.name || l?.locationName || `Location ${id}`;
  };

  // Corporate users pick any location; managers are pinned to their own.
  useEffect(() => {
    (async () => {
      try {
        const res = await clientAdapter.getUserLocations(userInfo.employeeId);
        const locs = res?.locations || [];
        setLocations(locs);
        if (!locationId && locs.length) setLocationId(String(locs[0].locationId));
      } catch (e) {
        // non-fatal: keep the current location
      }
    })();
  }, []);

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

  // The three-day comparison window ends on the selected date.
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
    return v === null || v === undefined ? "" : v;
  };

  return (
    <div className="py-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h4 className="mb-0">EOD / Spa Closing Report</h4>
          <small className="text-muted">
            Daily end-of-day checklist. Metrics auto-fill from POS; edit any
            field, then Save.
          </small>
        </Col>
      </Row>

      {/* Controls */}
      <Card className="mb-3">
        <Card.Body>
          <Row className="g-2 align-items-end">
            <Col md={4}>
              <Form.Label>Spa Location</Form.Label>
              <Form.Select
                value={locationId}
                disabled={!isCorporate}
                onChange={(e) => setLocationId(e.target.value)}
              >
                {locations.map((l) => (
                  <option key={l.locationId} value={l.locationId}>
                    {l.name || l.locationName || `Location ${l.locationId}`}
                  </option>
                ))}
                {!locations.length && locationId && (
                  <option value={locationId}>{locName(locationId)}</option>
                )}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={date}
                max={moment().format("YYYY-MM-DD")}
                onChange={(e) => setDate(e.target.value)}
              />
            </Col>
            <Col md={4} className="d-flex gap-2">
              <Button variant="primary" onClick={save} disabled={saving || loading}>
                {saving ? "Saving..." : "Save"}
              </Button>
              <ReactToPrint
                trigger={() => (
                  <Button variant="outline-secondary">Print 3-Day</Button>
                )}
                content={() => printRef.current}
              />
              {savedAt && (
                <span className="text-success align-self-center ms-1">
                  Saved {savedAt}
                </span>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {/* Edit form */}
          <Col lg={6}>
            <Card className="mb-3">
              <Card.Header>
                <strong>Metrics</strong>{" "}
                <small className="text-muted">(auto-filled, editable)</small>
              </Card.Header>
              <Card.Body>
                {METRIC_FIELDS.map((f) => (
                  <Form.Group as={Row} className="mb-2" key={f.key}>
                    <Form.Label column sm={6}>
                      {f.label}
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type="number"
                        value={form[f.key]}
                        onChange={(e) => setField(f.key, e.target.value)}
                      />
                    </Col>
                  </Form.Group>
                ))}
                {MANUAL_FIELDS.map((f) => (
                  <Form.Group as={Row} className="mb-2" key={f.key}>
                    <Form.Label column sm={6}>
                      {f.label}
                    </Form.Label>
                    <Col sm={6}>
                      <Form.Control
                        type={f.type}
                        value={form[f.key]}
                        onChange={(e) => setField(f.key, e.target.value)}
                      />
                    </Col>
                  </Form.Group>
                ))}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="mb-3">
              <Card.Header>
                <strong>Operational Checklist</strong>
              </Card.Header>
              <Card.Body>
                {CHECKLIST_FIELDS.map((f) => (
                  <Form.Group className="mb-2" key={f.key}>
                    <Form.Label className="mb-1">{f.label}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={form[f.key]}
                      onChange={(e) => setField(f.key, e.target.value)}
                    />
                  </Form.Group>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* 3-Day comparison (also the print target) */}
      <Card>
        <Card.Header>
          <strong>3-Day Comparison</strong>
        </Card.Header>
        <Card.Body>
          <div ref={printRef} className="eod-print">
            <h5 className="text-center mb-1">ISA SPA EOD Report</h5>
            <p className="text-center mb-3">
              <strong>Spa Location:</strong> {locName(locationId)}
            </p>
            <Table bordered size="sm" className="mb-0">
              <thead>
                <tr>
                  <th style={{ width: "34%" }}>EOD Report</th>
                  {threeDays.map((d, i) => (
                    <th key={d.date} className="text-center">
                      Day {i + 1}
                      <div className="fw-normal small text-muted">
                        {moment(d.date).format("DD.MM.YY")}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ALL_FIELDS.map((f) => (
                  <tr key={f.key}>
                    <td>{f.label}</td>
                    {threeDays.map((d) => (
                      <td key={d.date + f.key}>{cellValue(d.report, f.key)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EodReport;
