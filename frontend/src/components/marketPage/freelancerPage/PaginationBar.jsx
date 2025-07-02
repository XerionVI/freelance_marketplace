import React from "react";
import { Pagination, Box } from "@mui/material";

const PaginationBar = ({ page, setPage, totalPages }) => (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
    <Pagination
      count={totalPages}
      page={page}
      onChange={(_, value) => setPage(value)}
      color="primary"
      shape="rounded"
    />
  </Box>
);

export default PaginationBar;