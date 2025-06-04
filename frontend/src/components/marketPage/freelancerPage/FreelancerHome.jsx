import React, { useState, useEffect } from "react";
import { Box, Grid, Container } from "@mui/material";
import FreelancerFilterSidebar from "./FreelancerFilterSidebar";
import FreelancerSortBar from "./FreelancerSortBar";
import FreelancerList from "./FreelancerList";
import PaginationBar from "./PaginationBar";
import axios from "axios";
import config from "../../../config";

const FreelancerHome = ({ token, account }) => {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [freelancers, setFreelancers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    axios
      .get(`${config.API_BASE_URL}/api/users/browse`, {
        params: { ...filters, sort, page },
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFreelancers(res.data.freelancers);
        setTotalPages(res.data.totalPages);
      });
  }, [filters, sort, page, token, account]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
        {/* Sidebar with sticky position */}
        <Box
          sx={{
            width: 320,
            flexShrink: 0,
            position: "sticky",
            top: 32,
            alignSelf: "flex-start",
            zIndex: 1,
            height: "fit-content",
          }}
        >
          <FreelancerFilterSidebar filters={filters} setFilters={setFilters} />
        </Box>
        {/* Main content */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <FreelancerSortBar sort={sort} setSort={setSort} />
          <FreelancerList freelancers={freelancers} />
          <PaginationBar page={page} setPage={setPage} totalPages={totalPages} />
        </Box>
      </Box>
    </Container>
  );
};

export default FreelancerHome;