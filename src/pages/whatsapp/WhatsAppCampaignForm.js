import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card } from "@themesberg/react-bootstrap";
import {
  Box, Typography, Alert, TextField, Button, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, FormHelperText,
  Radio, RadioGroup, FormControlLabel, FormLabel, Chip, Divider
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import SendIcon from "@mui/icons-material/Send";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PeopleIcon from "@mui/icons-material/People";
import clientAdapter from "../../lib/clientAdapter";

const AUDIENCE_TYPES = [
  { value: "all_customers", label: "All Customers", description: "Send to all customers with phone numbers" },
  { value: "segment", label: "Customer Segment", description: "Filter customers by criteria" },
  { value: "retention", label: "Lost Customers (60+ days)", description: "Mirrors the Customer Retention Report — customers inactive for 60+ days" },
  { value: "manual", label: "Manual List", description: "Enter phone numbers manually" },
];

// Mirror the dropdown used in /customer/report/retention
const RETENTION_STATUS_OPTIONS = [
  { value: "", label: "Any" },
  { value: "not-connected", label: "Not Connected" },
  { value: "prospective", label: "Prospective" },
  { value: "appointment-booked", label: "Appointment Booked" },
  { value: "lost", label: "Lost" },
];

const RETENTION_YEAR_OPTIONS = (() => {
  const current = new Date().getFullYear();
  const years = [{ value: "", label: "All years" }];
  for (let y = current; y >= 2020; y--) years.push({ value: y, label: String(y) });
  return years;
})();

export default function WhatsAppCampaignForm() {
  const navigate = useNavigate();
  const { campaignId } = useParams();
  const isEdit = !!campaignId;

  const locationInfo = JSON.parse(localStorage.getItem("yumpos_location") || "{}");
  const locationId = locationInfo.locationId;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [audienceCount, setAudienceCount] = useState(null);
  const [audienceLoading, setAudienceLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    templateName: "",
    templateLanguage: "en",
    templateVariables: { body: [] },
    audienceType: "all_customers",
    audienceFilter: {
      lastVisitDays: "",
      minSpend: "",
      gender: "",
      retentionStatus: "",
      year: "",
    },
    manualPhones: "",
    scheduledAt: "",
  });

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Fetch templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setTemplatesLoading(true);
      try {
        const res = await clientAdapter.getWhatsappTemplates(locationId);
        if (res?.success) {
          // Filter to only show APPROVED MARKETING templates
          const marketingTemplates = (res.data || []).filter(
            (t) => t.status === "APPROVED" && t.category === "MARKETING"
          );
          setTemplates(marketingTemplates);
        }
      } catch (e) {
        console.error("Error fetching templates:", e);
      } finally {
        setTemplatesLoading(false);
      }
    };
    fetchTemplates();
  }, [locationId]);

  // Fetch campaign data if editing
  useEffect(() => {
    if (isEdit && campaignId) {
      setLoading(true);
      clientAdapter.getWhatsappCampaign(locationId, campaignId)
        .then((res) => {
          if (res?.success && res.data) {
            const campaign = res.data;
            setFormData({
              name: campaign.name || "",
              description: campaign.description || "",
              templateName: campaign.templateName || "",
              templateLanguage: campaign.templateLanguage || "en",
              templateVariables: campaign.templateVariables || { body: [] },
              audienceType: campaign.audienceType || "all_customers",
              audienceFilter: campaign.audienceFilter || {},
              manualPhones: "",
              scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : "",
            });
          } else {
            setError("Failed to load campaign");
          }
        })
        .catch(() => setError("Error loading campaign"))
        .finally(() => setLoading(false));
    }
  }, [isEdit, campaignId, locationId]);

  // Update selected template when templateName changes
  useEffect(() => {
    if (formData.templateName && templates.length > 0) {
      const template = templates.find((t) => t.name === formData.templateName);
      setSelectedTemplate(template || null);

      // Initialize body variables based on template
      if (template) {
        const bodyComponent = template.components?.find((c) => c.type === "BODY");
        if (bodyComponent?.text) {
          const varMatches = bodyComponent.text.match(/\{\{\d+\}\}/g) || [];
          const numVars = varMatches.length;
          // Initialize with empty strings for each variable
          const initialVars = Array(numVars).fill("");
          setFormData((prev) => ({
            ...prev,
            templateVariables: { ...prev.templateVariables, body: initialVars },
          }));
        }
      }
    } else {
      setSelectedTemplate(null);
    }
  }, [formData.templateName, templates]);

  // Build the audience filter slice that the backend should see for the
  // current audience type. Non-relevant fields are dropped so we don't send
  // stale segment filters when the user is on retention, and vice-versa.
  const buildAudienceFilterPayload = () => {
    if (formData.audienceType === "segment") {
      return {
        lastVisitDays: formData.audienceFilter.lastVisitDays,
        minSpend: formData.audienceFilter.minSpend,
        gender: formData.audienceFilter.gender,
      };
    }
    if (formData.audienceType === "retention") {
      const f = {};
      if (formData.audienceFilter.retentionStatus) f.retentionStatus = formData.audienceFilter.retentionStatus;
      if (formData.audienceFilter.year) f.year = Number(formData.audienceFilter.year);
      return f;
    }
    return undefined;
  };

  // Preview audience count
  const previewAudience = async () => {
    setAudienceLoading(true);
    try {
      const res = await clientAdapter.previewWhatsappCampaignAudience(
        locationId,
        formData.audienceType,
        buildAudienceFilterPayload()
      );
      if (res?.success) {
        setAudienceCount(res.data?.count || 0);
      }
    } catch (e) {
      console.error("Error previewing audience:", e);
    } finally {
      setAudienceLoading(false);
    }
  };

  useEffect(() => {
    if (formData.audienceType !== "manual") {
      previewAudience();
    }
  }, [
    formData.audienceType,
    formData.audienceFilter.lastVisitDays,
    formData.audienceFilter.minSpend,
    formData.audienceFilter.gender,
    formData.audienceFilter.retentionStatus,
    formData.audienceFilter.year,
  ]);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleFilterChange = (field) => (e) => {
    setFormData({
      ...formData,
      audienceFilter: { ...formData.audienceFilter, [field]: e.target.value },
    });
  };

  const handleVariableChange = (index) => (e) => {
    const newVars = [...(formData.templateVariables.body || [])];
    newVars[index] = e.target.value;
    setFormData({
      ...formData,
      templateVariables: { ...formData.templateVariables, body: newVars },
    });
  };

  const handleSave = async (startImmediately = false) => {
    if (!formData.name.trim()) {
      setError("Campaign name is required");
      return;
    }
    if (!formData.templateName) {
      setError("Please select a template");
      return;
    }
    // Every body variable must have a value. Meta rejects `text: ""` payloads
    // with error 131008 ("Required parameter is missing"). Use a static string
    // or a placeholder like {{customer_name}} / {{first_name}}.
    const emptyVarIdx = (formData.templateVariables.body || [])
      .findIndex((v) => !v || !String(v).trim());
    if (emptyVarIdx !== -1) {
      setError(
        `Variable {{${emptyVarIdx + 1}}} is empty — fill it with a static value ` +
        `or a placeholder like {{customer_name}} before saving`,
      );
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        templateName: formData.templateName,
        templateLanguage: formData.templateLanguage,
        templateVariables: formData.templateVariables,
        audienceType: formData.audienceType,
        audienceFilter: buildAudienceFilterPayload(),
        scheduledAt: formData.scheduledAt || undefined,
      };

      let res;
      if (isEdit) {
        res = await clientAdapter.updateWhatsappCampaign(locationId, campaignId, payload);
      } else {
        res = await clientAdapter.createWhatsappCampaign(locationId, payload);
      }

      if (res?.success) {
        const newCampaignId = res.data?.id || campaignId;

        // If manual phones, add them
        if (formData.audienceType === "manual" && formData.manualPhones.trim()) {
          const phones = formData.manualPhones.split(/[\n,;]+/).map((p) => p.trim()).filter(Boolean);
          if (phones.length > 0) {
            await clientAdapter.addWhatsappCampaignRecipients(locationId, newCampaignId, phones);
          }
        }

        if (startImmediately) {
          await clientAdapter.startWhatsappCampaign(locationId, newCampaignId);
        }

        navigate("/whatsapp/campaigns");
      } else {
        setError(res?.error || "Failed to save campaign");
      }
    } catch (e) {
      setError("Error saving campaign");
    } finally {
      setSaving(false);
    }
  };

  const getTemplatePreview = () => {
    if (!selectedTemplate) return null;
    const bodyComponent = selectedTemplate.components?.find((c) => c.type === "BODY");
    if (!bodyComponent?.text) return null;

    let preview = bodyComponent.text;
    (formData.templateVariables.body || []).forEach((val, idx) => {
      const placeholder = `{{${idx + 1}}}`;
      const displayVal = val || `[Variable ${idx + 1}]`;
      preview = preview.replace(placeholder, displayVal);
    });
    return preview;
  };

  // The templates API enriches each template with `header_media_url` and
  // `header_media_type` when there's a stored asset (set by the backend in
  // whatsapp.service.ts getMessageTemplates). Fall back to the HEADER
  // component's format so the preview still flags a media slot even when the
  // asset row hasn't been hydrated yet.
  const renderTemplateHeaderMedia = () => {
    if (!selectedTemplate) return null;
    const headerComp = selectedTemplate.components?.find((c) => c.type === "HEADER");
    const format = selectedTemplate.header_media_type || headerComp?.format;
    if (!format || format === "TEXT") return null;

    const url = selectedTemplate.header_media_url;

    if (format === "IMAGE") {
      return url ? (
        <Box
          component="img"
          src={url}
          alt=""
          sx={{
            display: "block",
            width: "100%",
            maxHeight: 180,
            objectFit: "cover",
            borderRadius: 1,
            mb: 0.75,
            bgcolor: "#cfd8dc",
          }}
        />
      ) : (
        <Box
          sx={{
            height: 120,
            borderRadius: 1,
            mb: 0.75,
            bgcolor: "#cfd8dc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#546e7a",
            fontSize: "0.75rem",
          }}
        >
          Image header
        </Box>
      );
    }
    if (format === "VIDEO") {
      return url ? (
        <Box
          component="video"
          src={url}
          controls
          sx={{
            display: "block",
            width: "100%",
            maxHeight: 180,
            borderRadius: 1,
            mb: 0.75,
            bgcolor: "#000",
          }}
        />
      ) : (
        <Box
          sx={{
            height: 120,
            borderRadius: 1,
            mb: 0.75,
            bgcolor: "#263238",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
          }}
        >
          ▶ Video header
        </Box>
      );
    }
    if (format === "DOCUMENT") {
      return (
        <Box
          sx={{
            borderRadius: 1,
            mb: 0.75,
            p: 1,
            bgcolor: "#ffffff",
            border: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box sx={{ fontSize: 24 }}>📄</Box>
          {url ? (
            <Box
              component="a"
              href={url}
              target="_blank"
              rel="noreferrer"
              sx={{ fontSize: "0.8rem", color: "#075e54", textDecoration: "none" }}
            >
              Open document
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary">
              Document header
            </Typography>
          )}
        </Box>
      );
    }
    return null;
  };

  const estimatedCost = audienceCount ? (audienceCount * 0.80).toFixed(2) : null;

  if (loading) {
    return (
      <Container className="px-0" fluid>
        <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container className="px-0" fluid>
      <Box p={3} pb={10}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/whatsapp/campaigns")}
          >
            Back
          </Button>
          <Typography variant="h4">
            {isEdit ? "Edit Campaign" : "Create Campaign"}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box display="flex" gap={3} flexWrap="wrap" alignItems="flex-start">
          {/* Left column - Form */}
          <Box flex={1} minWidth={400}>
            <Card border="light" className="shadow-sm" style={{ height: 'auto' }}>
              <Card.Header>
                <Typography variant="h6">Campaign Details</Typography>
              </Card.Header>
              <Card.Body style={{ height: 'auto', overflow: 'visible' }}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Campaign Name"
                    value={formData.name}
                    onChange={handleChange("name")}
                    required
                    fullWidth
                    size="small"
                    placeholder="e.g., Summer Sale Promo"
                  />

                  <TextField
                    label="Description"
                    value={formData.description}
                    onChange={handleChange("description")}
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    placeholder="Optional description for internal reference"
                  />

                  <Divider sx={{ my: 1 }} />

                  <FormControl fullWidth size="small" required>
                    <InputLabel>Message Template</InputLabel>
                    <Select
                      value={formData.templateName}
                      onChange={handleChange("templateName")}
                      label="Message Template"
                      disabled={templatesLoading}
                    >
                      {templates.map((t) => (
                        <MenuItem key={t.name} value={t.name}>
                          {t.name} ({t.language})
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {templatesLoading ? "Loading templates..." :
                        templates.length === 0 ? "No approved MARKETING templates found" :
                        "Select an approved marketing template"}
                    </FormHelperText>
                  </FormControl>

                  {selectedTemplate && (
                    <Box bgcolor="grey.50" p={2} borderRadius={1}>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        Template Variables
                      </Typography>
                      {(formData.templateVariables.body || []).map((val, idx) => (
                        <TextField
                          key={idx}
                          label={`Variable {{${idx + 1}}}`}
                          value={val}
                          onChange={handleVariableChange(idx)}
                          fullWidth
                          size="small"
                          sx={{ mb: 1 }}
                          placeholder={`e.g., ${idx === 0 ? "{{customer_name}} or custom text" : "Value"}`}
                          helperText={idx === 0 ? "Use {{customer_name}} or {{first_name}} to personalize" : ""}
                        />
                      ))}
                    </Box>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <FormControl component="fieldset">
                    <FormLabel>Audience</FormLabel>
                    <RadioGroup
                      value={formData.audienceType}
                      onChange={handleChange("audienceType")}
                    >
                      {AUDIENCE_TYPES.map((type) => (
                        <FormControlLabel
                          key={type.value}
                          value={type.value}
                          control={<Radio size="small" />}
                          label={
                            <Box>
                              <Typography variant="body2">{type.label}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {type.description}
                              </Typography>
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>

                  {formData.audienceType === "segment" && (
                    <Box bgcolor="grey.50" p={2} borderRadius={1}>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        Filter Criteria (optional)
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <TextField
                          label="Last Visit (days)"
                          type="number"
                          value={formData.audienceFilter.lastVisitDays}
                          onChange={handleFilterChange("lastVisitDays")}
                          size="small"
                          sx={{ width: 150 }}
                          placeholder="e.g., 30"
                        />
                        <TextField
                          label="Min Spend"
                          type="number"
                          value={formData.audienceFilter.minSpend}
                          onChange={handleFilterChange("minSpend")}
                          size="small"
                          sx={{ width: 150 }}
                          placeholder="e.g., 1000"
                        />
                        <FormControl size="small" sx={{ width: 150 }}>
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={formData.audienceFilter.gender}
                            onChange={handleFilterChange("gender")}
                            label="Gender"
                          >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  )}

                  {formData.audienceType === "retention" && (
                    <Box bgcolor="grey.50" p={2} borderRadius={1}>
                      <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                        Mirrors the Customer Retention Report. Inactivity threshold fixed at 60 days.
                      </Typography>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        <FormControl size="small" sx={{ minWidth: 200 }}>
                          <InputLabel>Retention Status</InputLabel>
                          <Select
                            value={formData.audienceFilter.retentionStatus}
                            onChange={handleFilterChange("retentionStatus")}
                            label="Retention Status"
                          >
                            {RETENTION_STATUS_OPTIONS.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <InputLabel>Year of Last Sale</InputLabel>
                          <Select
                            value={formData.audienceFilter.year}
                            onChange={handleFilterChange("year")}
                            label="Year of Last Sale"
                          >
                            {RETENTION_YEAR_OPTIONS.map((opt) => (
                              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  )}

                  {formData.audienceType === "manual" && (
                    <TextField
                      label="Phone Numbers"
                      value={formData.manualPhones}
                      onChange={handleChange("manualPhones")}
                      fullWidth
                      size="small"
                      multiline
                      rows={4}
                      placeholder="Enter phone numbers, one per line or comma-separated"
                      helperText="Include country code (e.g., 919876543210)"
                    />
                  )}

                  <Divider sx={{ my: 1 }} />

                  <TextField
                    label="Schedule (optional)"
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={handleChange("scheduledAt")}
                    fullWidth
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    helperText="Leave empty to send immediately when started"
                  />
                </Box>
              </Card.Body>
            </Card>
          </Box>

          {/* Right column - Preview */}
          <Box width={350}>
            <Card border="light" className="shadow-sm" style={{ height: 'auto' }}>
              <Card.Header>
                <Typography variant="h6">Preview</Typography>
              </Card.Header>
              <Card.Body style={{ height: 'auto', overflow: 'visible' }}>
                {selectedTemplate ? (
                  <Box
                    sx={{
                      bgcolor: "#e5ddd5",
                      p: 2,
                      borderRadius: 2,
                      minHeight: 200,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#dcf8c6",
                        p: 1.5,
                        borderRadius: 1,
                        maxWidth: "90%",
                        ml: "auto",
                      }}
                    >
                      {renderTemplateHeaderMedia()}
                      <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                        {getTemplatePreview()}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    Select a template to see preview
                  </Typography>
                )}
              </Card.Body>
            </Card>

            {formData.audienceType !== "manual" && (
              <Card border="light" className="shadow-sm mt-3" style={{ height: 'auto' }}>
                <Card.Header>
                  <Box display="flex" alignItems="center" gap={1}>
                    <PeopleIcon fontSize="small" />
                    <Typography variant="h6">Audience</Typography>
                  </Box>
                </Card.Header>
                <Card.Body style={{ height: 'auto', overflow: 'visible' }}>
                  {audienceLoading ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress size={16} />
                      <Typography variant="body2" color="text.secondary">
                        Calculating...
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h4" color="primary">
                        {audienceCount?.toLocaleString() || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        customers will receive this message
                      </Typography>
                      {estimatedCost && audienceCount > 0 && (
                        <Box mt={2}>
                          <Typography variant="caption" color="text.secondary">
                            Estimated cost
                          </Typography>
                          <Typography variant="h6" color="warning.main">
                            ~₹{estimatedCost}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Based on ₹0.80/message (marketing)
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Card.Body>
              </Card>
            )}

            <Box mt={3} display="flex" flexDirection="column" gap={1}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={() => handleSave(false)}
                disabled={saving}
                fullWidth
              >
                {saving ? "Saving..." : isEdit ? "Save Changes" : "Save as Draft"}
              </Button>
              {!isEdit && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SendIcon />}
                  onClick={() => handleSave(true)}
                  disabled={saving || audienceCount === 0}
                  fullWidth
                >
                  {saving ? "Saving..." : "Create & Start"}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
