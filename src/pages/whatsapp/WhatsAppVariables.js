import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import clientAdapter from "../../lib/clientAdapter";

// Resolution sources — each maps to a resolver in the campaign processor.
const SOURCES = [
  { value: "CUSTOMER_FIRST_NAME", label: "Customer first name" },
  { value: "CUSTOMER_FULL_NAME", label: "Customer full name" },
  { value: "CUSTOMER_PHONE", label: "Customer phone" },
  { value: "LOCATION_NAME", label: "Location / salon name" },
];
const sourceLabel = (v) => SOURCES.find((s) => s.value === v)?.label || v;

const EMPTY = {
  varKey: "",
  label: "",
  sample: "",
  source: "CUSTOMER_FIRST_NAME",
  isActive: true,
  sortOrder: 0,
};

const WhatsAppVariables = () => {
  const userInfo = (() => {
    try {
      return JSON.parse(localStorage.getItem("yumpos_user_info") || "{}");
    } catch {
      return {};
    }
  })();
  const isCorporate = !!userInfo.isCorporate;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // {id?, ...fields} or null
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [toast, setToast] = useState({ open: false, severity: "success", msg: "" });

  const notify = (msg, severity = "success") =>
    setToast({ open: true, severity, msg: typeof msg === "string" ? msg : "Something went wrong" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await clientAdapter.getWhatsappVariables(false);
      setRows(Array.isArray(data) ? data : []);
    } catch {
      notify("Failed to load variables", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!editing.varKey.trim() || !editing.label.trim()) {
      notify("Key and label are required", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        varKey: editing.varKey.trim(),
        label: editing.label.trim(),
        sample: editing.sample?.trim() || undefined,
        source: editing.source,
        isActive: editing.isActive,
        sortOrder: Number(editing.sortOrder) || 0,
      };
      const res = editing.id
        ? await clientAdapter.updateWhatsappVariable(editing.id, payload)
        : await clientAdapter.createWhatsappVariable(payload);
      if (res?.message && !res?.id) throw new Error(res.message);
      setEditing(null);
      notify("Variable saved");
      await load();
    } catch (e) {
      notify(e?.message || "Failed to save variable", "error");
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    try {
      await clientAdapter.deleteWhatsappVariable(toDelete.id);
      setToDelete(null);
      notify("Variable deleted");
      await load();
    } catch {
      notify("Failed to delete", "error");
    }
  };

  if (!isCorporate) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          Managing WhatsApp variables is restricted to corporate users.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            WhatsApp Variables
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Predefined merge fields used in template building and campaign mapping.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setEditing({ ...EMPTY })}>
          Add variable
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Label</TableCell>
                <TableCell>Token</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Sample</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="text.secondary">
                      No variables yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>{r.label}</TableCell>
                  <TableCell>
                    <code>{`{{${r.varKey}}}`}</code>
                  </TableCell>
                  <TableCell>{sourceLabel(r.source)}</TableCell>
                  <TableCell>{r.sample}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={r.isActive ? "Active" : "Inactive"}
                      color={r.isActive ? "success" : "default"}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => setEditing({ ...r })}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => setToDelete(r)}>
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / edit dialog */}
      <Dialog open={!!editing} onClose={() => !saving && setEditing(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{editing?.id ? "Edit variable" : "Add variable"}</DialogTitle>
        <DialogContent>
          {editing && (
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Label"
                size="small"
                value={editing.label}
                onChange={(e) => setEditing({ ...editing, label: e.target.value })}
                placeholder="Customer First Name"
              />
              <TextField
                label="Token key"
                size="small"
                value={editing.varKey}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    varKey: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                  })
                }
                helperText={`Used as {{${editing.varKey || "key"}}} — lowercase, digits, underscore`}
              />
              <FormControl size="small">
                <InputLabel>Source</InputLabel>
                <Select
                  label="Source"
                  value={editing.source}
                  onChange={(e) => setEditing({ ...editing, source: e.target.value })}
                >
                  {SOURCES.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Sample value (for previews)"
                size="small"
                value={editing.sample}
                onChange={(e) => setEditing({ ...editing, sample: e.target.value })}
                placeholder="John"
              />
              <TextField
                label="Sort order"
                size="small"
                type="number"
                value={editing.sortOrder}
                onChange={(e) => setEditing({ ...editing, sortOrder: e.target.value })}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editing.isActive}
                    onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!toDelete} onClose={() => setToDelete(null)}>
        <DialogTitle>Delete variable?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Remove <strong>{toDelete?.label}</strong> (<code>{`{{${toDelete?.varKey}}}`}</code>)?
            Templates/campaigns already using this token keep their text but it
            will no longer resolve dynamically.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={doDelete}>
            Delete
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

export default WhatsAppVariables;
