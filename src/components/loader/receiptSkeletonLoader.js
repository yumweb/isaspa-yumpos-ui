import { Box, Skeleton } from "@mui/material";

const ReceiptSkeletonLoader = () => {
  return (
    <Box>
      <Skeleton variant="rectangular" width="10%" height={118} />
      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
      >
        <Skeleton variant="text" width="90px" height="80px" />
        <Skeleton variant="text" width="90px" height="80px" />
        <Skeleton variant="text" width="90px" height="80px" />
      </Box>
      {/* table structure loader */}
      <Box
        sx={{ display: "flex", justifyContent: "space-between", gap: "10px" }}
      >
        <table className="table">
          <thead>
            <tr>
              <th scope="col">
                <Skeleton variant="text" width="50px" height="20px" />
              </th>
              <th scope="col">
                <Skeleton variant="text" width="50px" height="20px" />
              </th>
              <th scope="col">
                <Skeleton variant="text" width="50px" height="20px" />
              </th>
              <th scope="col">
                <Skeleton variant="text" width="50px" height="20px" />
              </th>
              <th scope="col">
                <Skeleton variant="text" width="50px" height="20px" />
              </th>
              <th scope="col">
                <Skeleton variant="text" width="50px" height="20px" />
              </th>
            </tr>
          </thead>
          <tbody>
            {Array(6)
              .fill(0)
              .map((i, x) => (
                <tr className="table-active" key={x}>
                  <td>
                    <Skeleton variant="text" width="50px" height="20px" />
                  </td>
                  <td>
                    <Skeleton variant="text" width="50px" height="20px" />
                  </td>
                  <td>
                    <Skeleton variant="text" width="50px" height="20px" />
                  </td>
                  <td>
                    <Skeleton variant="text" width="50px" height="20px" />
                  </td>
                  <td>
                    <Skeleton variant="text" width="50px" height="20px" />
                  </td>
                  <td>
                    <Skeleton variant="text" width="50px" height="20px" />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default ReceiptSkeletonLoader;
