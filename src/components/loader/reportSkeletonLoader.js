import { Box, Grid, Skeleton } from "@mui/material";

const ReportSkeletonLoader = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        {Array(6)
          .fill(0)
          .map((i, x) => (
            <Grid key={`MedSkele${x}`} item xs={12} sm={6} md={4} lg={3}>
              <Skeleton variant="text" width="100px" height="80px" />
            </Grid>
          ))}
      </Grid>

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

export default ReportSkeletonLoader;
