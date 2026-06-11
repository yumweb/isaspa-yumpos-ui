import React from "react";
import { Button } from "react-bootstrap";
import Salespop from "./sale/SalesModal/Salespop";

const ExistingCustomerModal = (props) => {
	if(!props.displays){
		return null
	}
	return(
		<div className="customer">
			<div className="customer-content">
				<div className="customer-header"></div>
				<div className="customer-body">
					<p>A similar customer name already exists. Do you want to continue?</p>
				</div>
				<div className="modal-footer">
					<Button onClick={props.onClose} className="btn">Cancel</Button>
					<Salespop />
				</div>
			</div>
		</div>
	);
}

export default ExistingCustomerModal;