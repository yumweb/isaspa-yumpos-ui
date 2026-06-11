import { faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SupplierInfo = ({ handleDetachSupplier, selectedSupplier }) => {
  const name = selectedSupplier?.companyName || "Supplier";

  return (
    <div
      className="mt-3"
      style={{
        border: "1px solid #e9ecef",
        borderRadius: 8,
        padding: "12px 16px",
        background: "#fff",
        display: "inline-block",
        width: "100%",
      }}
    >
      <div className="d-flex align-items-center" style={{ gap: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "#f1f3f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6c757d",
            border: "1px solid #e9ecef",
          }}
        >
          <FontAwesomeIcon icon={faUser} />
        </div>
        <div style={{ fontWeight: 600, color: "#4a4e69", fontSize: 16 }}>{name}</div>
      </div>

      <hr style={{ margin: "12px 0" }} />

      <div className="d-flex justify-content-start">
        <button
          type="button"
          className="btn btn-link text-danger p-0"
          onClick={handleDetachSupplier}
          style={{ fontWeight: 600 }}
        >
          <FontAwesomeIcon icon={faTimes} className="me-2" /> Detach
        </button>
      </div>
    </div>
  );
};

export default SupplierInfo;
