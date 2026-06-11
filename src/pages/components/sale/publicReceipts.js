import { Box } from "@mui/material";
import Receipt from "./Receipt";

const PublicReceipt = () => {
  return (
    <Box px={3} py={3}>
      <Receipt isPublic={true} />
    </Box>
  );
};

export default PublicReceipt;
