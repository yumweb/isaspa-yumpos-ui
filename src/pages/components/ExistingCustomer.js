import { useState } from "react";
import ExistingCustomerModal from "./ExisitingCustomerModal";
import { Button } from "@themesberg/react-bootstrap";

function ExistingCustomer (props)  {
  const [displays, setDisplays] = useState(false)
  return (
      <>
        <Button  className="lead-button"  onClick={() => setDisplays(true)}>Book Appointment</Button>
        <ExistingCustomerModal  onClose={() => setDisplays(false)} displays={displays} firstName={props.firstName} />
      </>
    );
  }

export default ExistingCustomer;