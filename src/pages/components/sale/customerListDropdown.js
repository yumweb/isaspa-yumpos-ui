const CustomerListDropdown = ({handleSelectCustomer,customer}) => {
  return (
    <span
      className="data-result"
      onClick={() => handleSelectCustomer(customer)}
      style={{ cursor: "pointer" }}
    >
      <p className="customer-number">
        {customer.person.phoneNumber}
        <br></br>
        <span className="customer-name">{customer.person.firstName}</span>
        <span className="customer-lname">{customer.person.lastName}</span>
      </p>
    </span>
  );
};

export default CustomerListDropdown;
