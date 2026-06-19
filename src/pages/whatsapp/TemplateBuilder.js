import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card } from "@themesberg/react-bootstrap";
import {
  Box, Typography, Alert, TextField, Button, FormControl, InputLabel,
  Select, MenuItem, IconButton, Collapse, Divider, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, FormHelperText,
  Grid, Paper, Tooltip, Menu
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SaveIcon from "@mui/icons-material/Save";
import clientAdapter from "../../lib/clientAdapter";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "en_US", label: "English (US)" },
  { code: "hi", label: "Hindi" },
  { code: "ta", label: "Tamil" },
  { code: "te", label: "Telugu" },
  { code: "mr", label: "Marathi" },
  { code: "gu", label: "Gujarati" },
  { code: "kn", label: "Kannada" },
  { code: "ml", label: "Malayalam" },
  { code: "bn", label: "Bengali" },
  { code: "pa", label: "Punjabi" },
];

const CATEGORIES = [
  { value: "MARKETING", label: "Marketing", description: "Promotional content and updates" },
  { value: "UTILITY", label: "Utility", description: "Transactional messages like confirmations" },
  { value: "AUTHENTICATION", label: "Authentication", description: "OTP and verification codes" },
];

const BUTTON_TYPES = [
  { value: "QUICK_REPLY", label: "Quick Reply", max: 10 },
  { value: "URL", label: "Website Link", max: 2 },
  { value: "PHONE_NUMBER", label: "Call Button", max: 1 },
];

function TemplatePreview({
  name,
  category,
  headerFormat,
  headerText,
  headerMediaUrl,
  headerMediaFile,
  bodyText,
  footerText,
  buttons,
}) {
  const renderTextWithVariables = (text) => {
    if (!text) return null;
    return text.replace(/\{\{(\d+)\}\}/g, (match, num) => `[Variable ${num}]`);
  };

  // Source URL for media preview: prefer the newly-picked file (object URL),
  // fall back to whatever the server already has for an existing template.
  const mediaSrc = React.useMemo(() => {
    if (headerMediaFile) return URL.createObjectURL(headerMediaFile);
    return headerMediaUrl || null;
  }, [headerMediaFile, headerMediaUrl]);

  // Release the object URL when the file changes / component unmounts so we
  // don't leak blob handles in the preview.
  React.useEffect(() => {
    return () => {
      if (mediaSrc && headerMediaFile) URL.revokeObjectURL(mediaSrc);
    };
  }, [mediaSrc, headerMediaFile]);

  const renderMediaHeader = () => {
    if (!headerFormat || headerFormat === "TEXT") return null;
    if (headerFormat === "IMAGE") {
      return mediaSrc ? (
        <Box
          component="img"
          src={mediaSrc}
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
    if (headerFormat === "VIDEO") {
      return mediaSrc ? (
        <Box
          component="video"
          src={mediaSrc}
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
    if (headerFormat === "DOCUMENT") {
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
          {mediaSrc ? (
            <Box
              component="a"
              href={mediaSrc}
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

  return (
    <Paper
      elevation={3}
      sx={{
        bgcolor: "#075e54",
        borderRadius: 3,
        p: 1,
        maxWidth: 320,
        mx: "auto",
      }}
    >
      <Box
        sx={{
          bgcolor: "#e5ddd5",
          borderRadius: 2,
          p: 1,
          minHeight: 200,
        }}
      >
        <Box
          sx={{
            bgcolor: "#dcf8c6",
            borderRadius: 2,
            p: 1.5,
            maxWidth: "90%",
            ml: "auto",
            boxShadow: 1,
          }}
        >
          {renderMediaHeader()}

          {(!headerFormat || headerFormat === "TEXT") && headerText && (
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", mb: 0.5, wordBreak: "break-word" }}
            >
              {renderTextWithVariables(headerText)}
            </Typography>
          )}

          {bodyText ? (
            <Typography
              variant="body2"
              sx={{ mb: 0.5, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {renderTextWithVariables(bodyText)}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              Message body will appear here...
            </Typography>
          )}

          {footerText && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              {footerText}
            </Typography>
          )}

          {buttons && buttons.length > 0 && (
            <Box sx={{ mt: 1, pt: 1, borderTop: "1px solid rgba(0,0,0,0.1)" }}>
              {buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  fullWidth
                  size="small"
                  variant="text"
                  sx={{
                    textTransform: "none",
                    color: "#00a884",
                    justifyContent: "center",
                    py: 0.5,
                    fontSize: "0.8rem",
                  }}
                >
                  {btn.text || `Button ${idx + 1}`}
                </Button>
              ))}
            </Box>
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 1,
            color: "text.secondary",
            fontSize: "0.7rem",
          }}
        >
          {name || "template_name"} • {category || "CATEGORY"}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function TemplateBuilder() {
  const navigate = useNavigate();
  const { templateName: editTemplateName } = useParams();
  const isEditMode = !!editTemplateName;

  const locationInfo = JSON.parse(localStorage.getItem("yumpos_location") || "{}");
  const locationId = locationInfo.locationId;

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("MARKETING");
  const [language, setLanguage] = useState("en");

  // Header
  const [headerEnabled, setHeaderEnabled] = useState(false);
  // 'TEXT' | 'IMAGE' | 'VIDEO' | 'DOCUMENT'
  const [headerFormat, setHeaderFormat] = useState("TEXT");
  const [headerText, setHeaderText] = useState("");
  const [headerExample, setHeaderExample] = useState("");
  const [headerMediaFile, setHeaderMediaFile] = useState(null);
  // For edit mode: existing header media URL fetched from server. Replacement on edit is out of scope this round.
  const [existingHeaderMediaUrl, setExistingHeaderMediaUrl] = useState(null);
  const [existingHeaderMediaType, setExistingHeaderMediaType] = useState(null);

  // Body
  const [bodyText, setBodyText] = useState("");
  const [bodyExamples, setBodyExamples] = useState([]);
  const [variableCatalog, setVariableCatalog] = useState([]);
  const [varMenuAnchor, setVarMenuAnchor] = useState(null);

  // Footer
  const [footerEnabled, setFooterEnabled] = useState(false);
  const [footerText, setFooterText] = useState("");

  // Buttons
  const [buttons, setButtons] = useState([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateId, setTemplateId] = useState(null);

  // Sections collapse state
  const [headerExpanded, setHeaderExpanded] = useState(true);
  const [bodyExpanded, setBodyExpanded] = useState(true);
  const [footerExpanded, setFooterExpanded] = useState(true);
  const [buttonsExpanded, setButtonsExpanded] = useState(true);

  // Validation
  const [errors, setErrors] = useState({});

  // Extract variables from text
  const extractVariables = (text) => {
    const matches = text?.match(/\{\{(\d+)\}\}/g) || [];
    return [...new Set(matches)].sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });
  };

  const bodyVariables = useMemo(() => extractVariables(bodyText), [bodyText]);
  const headerVariables = useMemo(() => extractVariables(headerText), [headerText]);

  // Update body examples when variables change
  useEffect(() => {
    const varCount = bodyVariables.length;
    if (bodyExamples.length < varCount) {
      setBodyExamples([...bodyExamples, ...Array(varCount - bodyExamples.length).fill("")]);
    } else if (bodyExamples.length > varCount) {
      setBodyExamples(bodyExamples.slice(0, varCount));
    }
  }, [bodyVariables.length]);

  // Load template in edit mode
  useEffect(() => {
    if (isEditMode && locationId) {
      loadTemplate();
    }
  }, [isEditMode, locationId, editTemplateName]);

  const loadTemplate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await clientAdapter.getWhatsappTemplateByName(locationId, editTemplateName);
      if (res?.success && res.data?.length > 0) {
        const template = res.data[0];
        setTemplateId(template.id);
        setName(template.name);
        setCategory(template.category);
        setLanguage(template.language);

        // Capture any existing header media URL the API returned alongside the template
        if (template.header_media_url) {
          setExistingHeaderMediaUrl(template.header_media_url);
          setExistingHeaderMediaType(template.header_media_type);
        }

        // Parse components
        template.components?.forEach((comp) => {
          if (comp.type === "HEADER" && comp.format === "TEXT") {
            setHeaderEnabled(true);
            setHeaderFormat("TEXT");
            setHeaderText(comp.text || "");
            setHeaderExample(comp.example?.header_text?.[0] || "");
          } else if (
            comp.type === "HEADER" &&
            (comp.format === "IMAGE" || comp.format === "VIDEO" || comp.format === "DOCUMENT")
          ) {
            setHeaderEnabled(true);
            setHeaderFormat(comp.format);
          } else if (comp.type === "BODY") {
            setBodyText(comp.text || "");
            if (comp.example?.body_text?.[0]) {
              setBodyExamples(comp.example.body_text[0]);
            }
          } else if (comp.type === "FOOTER") {
            setFooterEnabled(true);
            setFooterText(comp.text || "");
          } else if (comp.type === "BUTTONS") {
            setButtons(
              comp.buttons?.map((b) => ({
                type: b.type,
                text: b.text,
                url: b.url,
                phone_number: b.phone_number,
                url_example: b.example?.[0] || "",
              })) || []
            );
          }
        });
      } else {
        setError(res?.error || "Template not found");
      }
    } catch (e) {
      setError("Error loading template");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!name.trim()) {
      newErrors.name = "Template name is required";
    } else if (!/^[a-z][a-z0-9_]*$/.test(name)) {
      newErrors.name = "Name must be lowercase, start with a letter, and contain only letters, numbers, and underscores";
    }

    // Body validation
    if (!bodyText.trim()) {
      newErrors.bodyText = "Message body is required";
    } else if (bodyText.length > 1024) {
      newErrors.bodyText = `Body exceeds 1024 characters (${bodyText.length})`;
    }

    // Check body variables have examples
    if (bodyVariables.length > 0) {
      const missingExamples = bodyVariables.filter((v, i) => !bodyExamples[i]?.trim());
      if (missingExamples.length > 0) {
        newErrors.bodyExamples = "All variables must have sample values";
      }
    }

    // Header validation
    if (headerEnabled && headerFormat === "TEXT") {
      if (headerText && headerVariables.length > 0 && !headerExample.trim()) {
        newErrors.headerExample = "Header variable requires a sample value";
      }
    }
    if (headerEnabled && headerFormat !== "TEXT" && !isEditMode && !headerMediaFile) {
      newErrors.headerMedia = "Please choose a file for the media header";
    }
    if (headerEnabled && headerFormat !== "TEXT" && headerMediaFile) {
      const mimeRules = {
        IMAGE: { types: ["image/jpeg", "image/png"], maxMb: 5 },
        VIDEO: { types: ["video/mp4", "video/3gpp"], maxMb: 16 },
        DOCUMENT: { types: ["application/pdf"], maxMb: 100 },
      };
      const rule = mimeRules[headerFormat];
      if (!rule.types.includes(headerMediaFile.type)) {
        newErrors.headerMedia = `Allowed for ${headerFormat}: ${rule.types.join(", ")}`;
      } else if (headerMediaFile.size > rule.maxMb * 1024 * 1024) {
        newErrors.headerMedia = `${headerFormat} must be ≤${rule.maxMb}MB`;
      }
    }

    // Footer validation
    if (footerEnabled && footerText.length > 60) {
      newErrors.footerText = `Footer exceeds 60 characters (${footerText.length})`;
    }

    // Button validation
    buttons.forEach((btn, i) => {
      if (!btn.text?.trim()) {
        newErrors[`button_${i}_text`] = "Button text is required";
      }
      if (btn.type === "URL") {
        if (!btn.url?.trim()) {
          newErrors[`button_${i}_url`] = "URL is required";
        } else if (btn.url.includes("{{1}}") && !btn.url_example?.trim()) {
          newErrors[`button_${i}_url_example`] = "Sample value is required for dynamic URL";
        }
      }
      if (btn.type === "PHONE_NUMBER" && !btn.phone_number?.trim()) {
        newErrors[`button_${i}_phone`] = "Phone number is required";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildComponents = () => {
    const components = [];

    // Header — TEXT vs media (IMAGE/VIDEO/DOCUMENT)
    if (headerEnabled) {
      if (headerFormat === "TEXT" && headerText.trim()) {
        const headerComp = {
          type: "HEADER",
          format: "TEXT",
          text: headerText,
        };
        if (headerVariables.length > 0 && headerExample) {
          headerComp.example = { header_text: [headerExample] };
        }
        components.push(headerComp);
      } else if (headerFormat === "IMAGE" || headerFormat === "VIDEO" || headerFormat === "DOCUMENT") {
        // Media header — backend injects example.header_handle after Resumable Upload.
        components.push({
          type: "HEADER",
          format: headerFormat,
        });
      }
    }

    // Body (required)
    const bodyComp = {
      type: "BODY",
      text: bodyText,
    };
    if (bodyVariables.length > 0 && bodyExamples.some((e) => e?.trim())) {
      bodyComp.example = { body_text: [bodyExamples] };
    }
    components.push(bodyComp);

    // Footer
    if (footerEnabled && footerText.trim()) {
      components.push({
        type: "FOOTER",
        text: footerText,
      });
    }

    // Buttons
    if (buttons.length > 0) {
      components.push({
        type: "BUTTONS",
        buttons: buttons.map((btn) => {
          const buttonObj = {
            type: btn.type,
            text: btn.text,
          };
          if (btn.type === "URL" && btn.url) {
            buttonObj.url = btn.url;
            // Add example if URL has dynamic variable
            if (hasUrlVariable(btn.url) && btn.url_example) {
              buttonObj.example = [btn.url_example];
            }
          }
          if (btn.type === "PHONE_NUMBER" && btn.phone_number) {
            buttonObj.phone_number = btn.phone_number;
          }
          return buttonObj;
        }),
      });
    }

    return components;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const templateData = {
        name,
        language,
        category,
        components: buildComponents(),
      };

      let res;
      const isMediaHeader =
        headerEnabled && headerFormat !== "TEXT";

      if (isEditMode && templateId) {
        // Edit mode: media replacement is out of scope here; component edits only.
        res = await clientAdapter.updateWhatsappTemplate(locationId, templateId, {
          components: templateData.components,
        });
      } else if (isMediaHeader) {
        res = await clientAdapter.createWhatsappTemplateWithMedia(
          locationId,
          templateData,
          headerMediaFile,
        );
      } else {
        res = await clientAdapter.createWhatsappTemplate(locationId, templateData);
      }

      if (res?.success) {
        setSuccess(
          isEditMode
            ? "Template updated successfully!"
            : "Template submitted for approval!"
        );
        setTimeout(() => navigate("/whatsapp"), 2000);
      } else {
        setError(res?.error || "Failed to save template");
      }
    } catch (e) {
      setError("Error saving template");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      const res = await clientAdapter.deleteWhatsappTemplate(locationId, name);
      if (res?.success) {
        setSuccess("Template deleted successfully!");
        setTimeout(() => navigate("/whatsapp"), 1500);
      } else {
        setError(res?.error || "Failed to delete template");
      }
    } catch (e) {
      setError("Error deleting template");
    } finally {
      setSaving(false);
      setDeleteDialogOpen(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const vars = await clientAdapter.getWhatsappVariables(true);
        setVariableCatalog(Array.isArray(vars) ? vars : []);
      } catch {
        setVariableCatalog([]);
      }
    })();
  }, []);

  const insertVariable = (setter, currentValue, textFieldId) => {
    const textField = document.getElementById(textFieldId);
    if (!textField) return;

    // Find next variable number
    const existingVars = currentValue.match(/\{\{(\d+)\}\}/g) || [];
    const nums = existingVars.map((v) => parseInt(v.match(/\d+/)[0]));
    const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;

    const cursorPos = textField.selectionStart || currentValue.length;
    const newValue =
      currentValue.slice(0, cursorPos) +
      `{{${nextNum}}}` +
      currentValue.slice(cursorPos);
    setter(newValue);
  };

  // Insert the next {{N}} into the body. If a catalog variable is chosen, also
  // pre-fill that variable's sample as the Meta example for the new position.
  const insertBodyVariable = (catalogVar) => {
    setVarMenuAnchor(null);
    const textField = document.getElementById("body-text");
    const existingVars = bodyText.match(/\{\{(\d+)\}\}/g) || [];
    const nums = existingVars.map((v) => parseInt(v.match(/\d+/)[0]));
    const nextNum = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    const cursorPos = textField?.selectionStart ?? bodyText.length;
    setBodyText(
      bodyText.slice(0, cursorPos) + `{{${nextNum}}}` + bodyText.slice(cursorPos)
    );
    if (catalogVar) {
      setBodyExamples((prev) => {
        const updated = [...prev];
        while (updated.length < nextNum) updated.push("");
        updated[nextNum - 1] = catalogVar.sample || catalogVar.label;
        return updated;
      });
    }
  };

  const addButton = (type) => {
    const typeCount = buttons.filter((b) => b.type === type).length;
    const buttonDef = BUTTON_TYPES.find((bt) => bt.value === type);
    if (buttonDef && typeCount >= buttonDef.max) {
      setError(`Maximum ${buttonDef.max} ${buttonDef.label} button(s) allowed`);
      return;
    }
    setButtons([...buttons, { type, text: "", url: "", phone_number: "", url_example: "" }]);
  };

  const hasUrlVariable = (url) => {
    return url?.includes("{{1}}");
  };

  const removeButton = (index) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const updateButton = (index, field, value) => {
    const updated = [...buttons];
    updated[index] = { ...updated[index], [field]: value };
    setButtons(updated);
  };

  if (loading) {
    return (
      <Container className="px-0" fluid>
        <Box p={3} display="flex" justifyContent="center" alignItems="center" minHeight={300}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container className="px-0" fluid>
      <Box p={3}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <IconButton onClick={() => navigate("/whatsapp")}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4">
              {isEditMode ? "Edit Template" : "Create Template"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isEditMode
                ? "Update your WhatsApp message template"
                : "Build and submit a new message template for Meta approval"}
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Form Column */}
          <Grid item xs={12} md={8}>
            {/* Basic Info */}
            <Card border="light" className="shadow-sm mb-3">
              <Card.Header>
                <Typography variant="h6">Basic Information</Typography>
              </Card.Header>
              <Card.Body>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Template Name"
                      value={name}
                      onChange={(e) => setName(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "_"))}
                      disabled={isEditMode}
                      error={!!errors.name}
                      helperText={errors.name || "Lowercase letters, numbers, and underscores only"}
                      placeholder="e.g., appointment_reminder"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        label="Category"
                        disabled={isEditMode}
                      >
                        {CATEGORIES.map((cat) => (
                          <MenuItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        {CATEGORIES.find((c) => c.value === category)?.description}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        label="Language"
                        disabled={isEditMode}
                      >
                        {LANGUAGES.map((lang) => (
                          <MenuItem key={lang.code} value={lang.code}>
                            {lang.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Card.Body>
            </Card>

            {/* Header Section */}
            <Card border="light" className="shadow-sm mb-3">
              <Card.Header
                onClick={() => setHeaderExpanded(!headerExpanded)}
                style={{ cursor: "pointer" }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">Header</Typography>
                    <Chip label="Optional" size="small" variant="outlined" />
                  </Box>
                  {headerExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Card.Header>
              <Collapse in={headerExpanded}>
                <Card.Body>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Button
                      variant={headerEnabled ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setHeaderEnabled(!headerEnabled)}
                    >
                      {headerEnabled ? "Header Enabled" : "Add Header"}
                    </Button>
                    {headerEnabled && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          setHeaderEnabled(false);
                          setHeaderFormat("TEXT");
                          setHeaderText("");
                          setHeaderExample("");
                          setHeaderMediaFile(null);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>

                  {headerEnabled && (
                    <>
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Header Format</InputLabel>
                        <Select
                          value={headerFormat}
                          label="Header Format"
                          // Format change isn't allowed in edit mode — Meta treats this as a different template shape.
                          disabled={isEditMode}
                          onChange={(e) => {
                            setHeaderFormat(e.target.value);
                            // Clear cross-format leftovers
                            if (e.target.value === "TEXT") {
                              setHeaderMediaFile(null);
                            } else {
                              setHeaderText("");
                              setHeaderExample("");
                            }
                          }}
                        >
                          <MenuItem value="TEXT">Text</MenuItem>
                          <MenuItem value="IMAGE">Image (JPG/PNG, ≤5MB)</MenuItem>
                          <MenuItem value="VIDEO">Video (MP4/3GPP, ≤16MB)</MenuItem>
                          <MenuItem value="DOCUMENT">Document (PDF, ≤100MB)</MenuItem>
                        </Select>
                      </FormControl>

                      {headerFormat === "TEXT" && (
                        <>
                          <Box display="flex" gap={1} mb={1}>
                            <TextField
                              id="header-text"
                              fullWidth
                              label="Header Text"
                              value={headerText}
                              onChange={(e) => setHeaderText(e.target.value)}
                              placeholder="e.g., Appointment Confirmation"
                            />
                            <Tooltip title="Insert Variable {{1}}">
                              <Button
                                variant="outlined"
                                onClick={() => insertVariable(setHeaderText, headerText, "header-text")}
                              >
                                {"{{}}"}
                              </Button>
                            </Tooltip>
                          </Box>

                          {headerVariables.length > 0 && (
                            <TextField
                              fullWidth
                              label="Sample value for header variable"
                              value={headerExample}
                              onChange={(e) => setHeaderExample(e.target.value)}
                              error={!!errors.headerExample}
                              helperText={errors.headerExample || "Provide a sample value for approval"}
                              placeholder="e.g., John"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </>
                      )}

                      {(headerFormat === "IMAGE" || headerFormat === "VIDEO" || headerFormat === "DOCUMENT") && (
                        <Box>
                          {isEditMode && existingHeaderMediaUrl && (
                            <Box mb={2} p={1} sx={{ border: "1px solid #e0e0e0", borderRadius: 1 }}>
                              <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                Current header media (replacement on edit not supported in this version):
                              </Typography>
                              {existingHeaderMediaType === "IMAGE" ? (
                                <img
                                  src={existingHeaderMediaUrl}
                                  alt="Header"
                                  style={{ maxWidth: 200, maxHeight: 120, objectFit: "contain" }}
                                />
                              ) : (
                                <a href={existingHeaderMediaUrl} target="_blank" rel="noreferrer">
                                  Open {existingHeaderMediaType?.toLowerCase() || "media"}
                                </a>
                              )}
                            </Box>
                          )}

                          {!isEditMode && (
                            <>
                              <Button variant="outlined" component="label" size="small">
                                {headerMediaFile ? "Replace File" : "Choose File"}
                                <input
                                  type="file"
                                  hidden
                                  accept={
                                    headerFormat === "IMAGE"
                                      ? "image/jpeg,image/png"
                                      : headerFormat === "VIDEO"
                                      ? "video/mp4,video/3gpp"
                                      : "application/pdf"
                                  }
                                  onChange={(e) => setHeaderMediaFile(e.target.files?.[0] || null)}
                                />
                              </Button>
                              {headerMediaFile && (
                                <Typography variant="caption" sx={{ ml: 2 }}>
                                  {headerMediaFile.name} ({Math.round(headerMediaFile.size / 1024)} KB)
                                </Typography>
                              )}
                              {errors.headerMedia && (
                                <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                                  {errors.headerMedia}
                                </Typography>
                              )}
                              {headerMediaFile && headerFormat === "IMAGE" && (
                                <Box mt={2}>
                                  <img
                                    src={URL.createObjectURL(headerMediaFile)}
                                    alt="Preview"
                                    style={{ maxWidth: 200, maxHeight: 120, objectFit: "contain", border: "1px solid #e0e0e0", borderRadius: 4 }}
                                  />
                                </Box>
                              )}
                            </>
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </Card.Body>
              </Collapse>
            </Card>

            {/* Body Section */}
            <Card border="light" className="shadow-sm mb-3">
              <Card.Header
                onClick={() => setBodyExpanded(!bodyExpanded)}
                style={{ cursor: "pointer" }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">Body</Typography>
                    <Chip label="Required" size="small" color="primary" />
                  </Box>
                  {bodyExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Card.Header>
              <Collapse in={bodyExpanded}>
                <Card.Body>
                  <Box display="flex" gap={1} mb={1}>
                    <TextField
                      id="body-text"
                      fullWidth
                      multiline
                      rows={4}
                      label="Message Body"
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      error={!!errors.bodyText}
                      helperText={
                        errors.bodyText ||
                        `${bodyText.length}/1024 characters • Use {{1}}, {{2}} for variables`
                      }
                      placeholder="Hello {{1}}, your appointment is confirmed for {{2}}."
                    />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => setVarMenuAnchor(e.currentTarget)}
                    sx={{ mb: 2 }}
                  >
                    Insert Variable {"{{}}"}
                  </Button>
                  <Menu
                    anchorEl={varMenuAnchor}
                    open={Boolean(varMenuAnchor)}
                    onClose={() => setVarMenuAnchor(null)}
                  >
                    {variableCatalog.map((v) => (
                      <MenuItem key={v.varKey} onClick={() => insertBodyVariable(v)}>
                        {v.label}
                        {v.sample ? ` — e.g. ${v.sample}` : ""}
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem onClick={() => insertBodyVariable(null)}>
                      Generic variable (fill later)
                    </MenuItem>
                  </Menu>

                  {bodyVariables.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" gutterBottom>
                        Sample Values for Variables
                      </Typography>
                      {errors.bodyExamples && (
                        <Typography variant="caption" color="error">
                          {errors.bodyExamples}
                        </Typography>
                      )}
                      <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        {bodyVariables.map((variable, idx) => (
                          <Grid item xs={12} sm={6} key={variable}>
                            <TextField
                              fullWidth
                              size="small"
                              label={`Sample for ${variable}`}
                              value={bodyExamples[idx] || ""}
                              onChange={(e) => {
                                const updated = [...bodyExamples];
                                updated[idx] = e.target.value;
                                setBodyExamples(updated);
                              }}
                              placeholder={`e.g., ${idx === 0 ? "John" : "Tomorrow 3PM"}`}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </>
                  )}
                </Card.Body>
              </Collapse>
            </Card>

            {/* Footer Section */}
            <Card border="light" className="shadow-sm mb-3">
              <Card.Header
                onClick={() => setFooterExpanded(!footerExpanded)}
                style={{ cursor: "pointer" }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">Footer</Typography>
                    <Chip label="Optional" size="small" variant="outlined" />
                  </Box>
                  {footerExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Card.Header>
              <Collapse in={footerExpanded}>
                <Card.Body>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Button
                      variant={footerEnabled ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setFooterEnabled(!footerEnabled)}
                    >
                      {footerEnabled ? "Footer Enabled" : "Add Footer"}
                    </Button>
                    {footerEnabled && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => {
                          setFooterEnabled(false);
                          setFooterText("");
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </Box>

                  {footerEnabled && (
                    <TextField
                      fullWidth
                      label="Footer Text"
                      value={footerText}
                      onChange={(e) => setFooterText(e.target.value)}
                      error={!!errors.footerText}
                      helperText={errors.footerText || `${footerText.length}/60 characters • No variables allowed`}
                      placeholder="e.g., Reply STOP to unsubscribe"
                    />
                  )}
                </Card.Body>
              </Collapse>
            </Card>

            {/* Buttons Section */}
            <Card border="light" className="shadow-sm mb-3">
              <Card.Header
                onClick={() => setButtonsExpanded(!buttonsExpanded)}
                style={{ cursor: "pointer" }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6">Buttons</Typography>
                    <Chip label="Optional" size="small" variant="outlined" />
                  </Box>
                  {buttonsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Card.Header>
              <Collapse in={buttonsExpanded}>
                <Card.Body>
                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    {BUTTON_TYPES.map((bt) => (
                      <Button
                        key={bt.value}
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => addButton(bt.value)}
                      >
                        {bt.label}
                      </Button>
                    ))}
                  </Box>

                  {buttons.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No buttons added. Click above to add buttons.
                    </Typography>
                  ) : (
                    <Box>
                      {buttons.map((btn, idx) => (
                        <Paper key={idx} variant="outlined" sx={{ p: 2, mb: 2 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Chip
                              label={BUTTON_TYPES.find((bt) => bt.value === btn.type)?.label || btn.type}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <IconButton size="small" color="error" onClick={() => removeButton(idx)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={btn.type === "QUICK_REPLY" ? 12 : 6}>
                              <TextField
                                fullWidth
                                size="small"
                                label="Button Text"
                                value={btn.text}
                                onChange={(e) => updateButton(idx, "text", e.target.value)}
                                error={!!errors[`button_${idx}_text`]}
                                helperText={errors[`button_${idx}_text`]}
                              />
                            </Grid>

                            {btn.type === "URL" && (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <Box display="flex" gap={1}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="URL"
                                      value={btn.url}
                                      onChange={(e) => updateButton(idx, "url", e.target.value)}
                                      error={!!errors[`button_${idx}_url`]}
                                      helperText={
                                        errors[`button_${idx}_url`] ||
                                        (hasUrlVariable(btn.url)
                                          ? "Dynamic URL with variable"
                                          : "Add {{1}} for dynamic URL")
                                      }
                                      placeholder="https://example.com/order/{{1}}"
                                    />
                                    <Tooltip title="Add dynamic variable {{1}}">
                                      <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => {
                                          const newUrl = btn.url?.endsWith("/")
                                            ? btn.url + "{{1}}"
                                            : btn.url + "/{{1}}";
                                          updateButton(idx, "url", newUrl);
                                        }}
                                        disabled={hasUrlVariable(btn.url)}
                                        sx={{ minWidth: 50 }}
                                      >
                                        {"{{}}"}
                                      </Button>
                                    </Tooltip>
                                  </Box>
                                </Grid>
                                {hasUrlVariable(btn.url) && (
                                  <Grid item xs={12}>
                                    <TextField
                                      fullWidth
                                      size="small"
                                      label="Sample value for URL variable"
                                      value={btn.url_example || ""}
                                      onChange={(e) => updateButton(idx, "url_example", e.target.value)}
                                      error={!!errors[`button_${idx}_url_example`]}
                                      helperText={
                                        errors[`button_${idx}_url_example`] ||
                                        "Provide a sample value for the {{1}} variable (required for approval)"
                                      }
                                      placeholder="e.g., 12345"
                                    />
                                  </Grid>
                                )}
                              </>
                            )}

                            {btn.type === "PHONE_NUMBER" && (
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  size="small"
                                  label="Phone Number"
                                  value={btn.phone_number}
                                  onChange={(e) => updateButton(idx, "phone_number", e.target.value)}
                                  error={!!errors[`button_${idx}_phone`]}
                                  helperText={errors[`button_${idx}_phone`] || "Include country code"}
                                  placeholder="+919876543210"
                                />
                              </Grid>
                            )}
                          </Grid>
                        </Paper>
                      ))}
                    </Box>
                  )}
                </Card.Body>
              </Collapse>
            </Card>

            {/* Action Buttons */}
            <Box display="flex" gap={2} justifyContent="space-between">
              <Box>
                {isEditMode && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={saving}
                  >
                    Delete Template
                  </Button>
                )}
              </Box>
              <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={() => navigate("/whatsapp")} disabled={saving}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? "Saving..." : isEditMode ? "Update Template" : "Submit for Approval"}
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Preview Column */}
          <Grid item xs={12} md={4}>
            <Card border="light" className="shadow-sm" style={{ position: "sticky", top: 20, height: 'auto' }}>
              <Card.Header>
                <Typography variant="h6">Preview</Typography>
              </Card.Header>
              <Card.Body style={{ height: 'auto', overflow: 'visible' }}>
                <TemplatePreview
                  name={name}
                  category={category}
                  headerFormat={headerEnabled ? headerFormat : "TEXT"}
                  headerText={headerEnabled ? headerText : ""}
                  headerMediaFile={headerEnabled && headerFormat !== "TEXT" ? headerMediaFile : null}
                  headerMediaUrl={headerEnabled && headerFormat !== "TEXT" ? existingHeaderMediaUrl : null}
                  bodyText={bodyText}
                  footerText={footerEnabled ? footerText : ""}
                  buttons={buttons}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2, textAlign: "center" }}>
                  This is an approximate preview. Actual appearance may vary.
                </Typography>
              </Card.Body>
            </Card>
          </Grid>
        </Grid>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Template?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the template "{name}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button color="error" onClick={handleDelete} disabled={saving}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
