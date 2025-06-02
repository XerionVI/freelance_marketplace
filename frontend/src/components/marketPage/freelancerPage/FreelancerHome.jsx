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
        headers: { Authorization: `Bearer ${token}` }, // <-- Add this line
      })
      .then((res) => {
        setFreelancers(res.data.freelancers);
        setTotalPages(res.data.totalPages);
      });
  }, [filters, sort, page, token, account]);

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <FreelancerFilterSidebar filters={filters} setFilters={setFilters} />
        </Grid>
        <Grid item xs={12} md={9}>
          <FreelancerSortBar sort={sort} setSort={setSort} />
          <FreelancerList freelancers={freelancers} />
          <PaginationBar page={page} setPage={setPage} totalPages={totalPages} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default FreelancerHome;