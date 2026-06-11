import { useEffect, useState } from "react";
import CustomerForm from "../components/customer/CustomerForm";
import { useLocation, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../routes";
import { Box, Typography } from "@mui/material";

const CustomerView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const custId = new URLSearchParams(location.search).get("id");
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (custId) {
    }
  }, []);

  const onSubmitCustomer = (res) => {
  };

  const onCancelCustomer = () => {
    navigate(AppRoutes.Customers.path);
  };
  
  return (
    <>
      <Box>
        <Typography fontSize={22} fontWeight={"bold"}>
          Create Customer
        </Typography>
      </Box>
      <CustomerForm
        isEditing={custId ? true : false}
        editItem={customer ? customer : null}
        onSubmitCustomer={onSubmitCustomer}
        oCancelCustomer={onCancelCustomer}
      />
    </>
  );
};

export default CustomerView;
