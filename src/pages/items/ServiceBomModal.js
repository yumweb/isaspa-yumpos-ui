import React, { useEffect, useMemo, useState } from "react";
import { Modal, Button, Form, Table, InputGroup } from "react-bootstrap";
import { Button as MuiButton } from "@mui/material";
import clientAdapter from "../../lib/clientAdapter";

const ServiceBomModal = ({ show, onHide, serviceRow }) => {
  const serviceItemId = serviceRow?.itemId;
  const serviceName = serviceRow?.item?.name || serviceRow?.name;

  const [loading, setLoading] = useState(false);
  const [bom, setBom] = useState([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBom = async () => {
      if (!serviceItemId) return;
      setLoading(true);
      try {
        const data = await clientAdapter.getServiceBom(serviceItemId);
        const rows = (data || []).map((r) => ({
          componentItemId: r.componentItemId,
          componentName: r.componentItem?.name || r.componentItemId,
          quantityPerService: Number(r.quantityPerService) || 1,
          active: !!r.active,
        }));
        setBom(rows);
      } catch (e) {
        setError("Failed to load linked products");
      } finally {
        setLoading(false);
      }
    };
    if (show) fetchBom();
  }, [show, serviceItemId]);

  useEffect(() => {
    const controller = new AbortController();
    const run = async () => {
      if (!search || search.length < 2) {
        setResults([]);
        return;
      }
      try {
        const res = await clientAdapter.searchItems(search, controller.signal);
        // search returns location items with nested item
        const items = (res || []).map((li) => ({
          itemId: li.itemId,
          name: li.item?.name,
        }));
        setResults(items);
      } catch (e) {
        // ignore
      }
    };
    run();
    return () => controller.abort();
  }, [search]);

  const addComponent = (comp) => {
    if (bom.find((b) => b.componentItemId === comp.itemId)) return;
    setBom([
      ...bom,
      {
        componentItemId: comp.itemId,
        componentName: comp.name,
        quantityPerService: 1,
        active: true,
      },
    ]);
    setSearch("");
    setResults([]);
  };

  const updateRow = (idx, field, value) => {
    const copy = [...bom];
    copy[idx] = { ...copy[idx], [field]: value };
    setBom(copy);
  };

  const removeRow = (idx) => {
    const copy = [...bom];
    copy.splice(idx, 1);
    setBom(copy);
  };

  const validationError = useMemo(() => {
    for (const row of bom) {
      if (!row.componentItemId) return "Component required";
      if (!(Number(row.quantityPerService) > 0)) return "Quantity must be > 0";
    }
    return "";
  }, [bom]);

  const handleSave = async () => {
    if (validationError) {
      setError(validationError);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        bom: bom.map((b) => ({
          componentItemId: b.componentItemId,
          quantityPerService: Number(b.quantityPerService),
          active: !!b.active,
        })),
      };
      await clientAdapter.upsertServiceBom(serviceItemId, payload);
      onHide(true);
    } catch (e) {
      setError("Failed to save linked products");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onHide={() => onHide(false)} size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          Linked Product for Service: {serviceName} (#{serviceItemId})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search salon products to add"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>
            {results.length > 0 && (
              <div
                className="mb-2"
                style={{
                  maxHeight: 160,
                  overflowY: "auto",
                  border: "1px solid #eee",
                }}
              >
                <Table size="sm" hover>
                  <tbody>
                    {results.map((r) => (
                      <tr
                        key={r.itemId}
                        onClick={() => addComponent(r)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>#{r.itemId}</td>
                        <td>{r.name}</td>
                        <td style={{ color: "#6c757d" }}>Click to add</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Component</th>
                  <th style={{ width: 160 }}>Qty per service</th>
                  <th style={{ width: 100 }}>Active</th>
                  <th style={{ width: 120 }}></th>
                </tr>
              </thead>
              <tbody>
                {bom.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ textAlign: "center", color: "#6c757d" }}
                    >
                      No components yet. Search and add above.
                    </td>
                  </tr>
                ) : (
                  bom.map((row, idx) => (
                    <tr key={`${row.componentItemId}-${idx}`}>
                      <td>
                        #{row.componentItemId} - {row.componentName}
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          min={0}
                          step="0.001"
                          value={row.quantityPerService}
                          onChange={(e) =>
                            updateRow(idx, "quantityPerService", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={!!row.active}
                          onChange={(e) =>
                            updateRow(idx, "active", e.target.checked)
                          }
                        />
                      </td>
                      <td>
                        <MuiButton
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => removeRow(idx)}
                          style={{ textTransform: "none" }}
                        >
                          Remove
                        </MuiButton>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            {error && <div style={{ color: "red" }}>{error}</div>}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => onHide(false)}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Linked Product"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ServiceBomModal;
