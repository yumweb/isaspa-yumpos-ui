import { Button } from "@themesberg/react-bootstrap";
import SalespopModal from "./SalespopModal";
import { useState } from "react";

function Salespop(props) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button  onClick={() => setOpen(true)}>Ok</Button>
        <SalespopModal onClose={() => setOpen(false)} open={open}  name={props.name}/>
      
      </>
    );
  }
  
  export default Salespop;