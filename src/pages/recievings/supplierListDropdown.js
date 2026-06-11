const SupplierListDropdown = ({ handleSelectSupplier, supplier }) => {
  console.log("testing", supplier);
  return (
    <span
      className="data-result"
      onClick={() => handleSelectSupplier(supplier)}
      style={{ cursor: "pointer" }}
    >
      <p className="customer-number te">
        {supplier.companyName}
        <br></br>
        {/* <span className="customer-name">{customer.person.firstName}</span>
        <span className="customer-lname">{customer.person.lastName}</span> */}
      </p>
    </span>
  );
};

export default SupplierListDropdown;
