import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CurrencyEthereumIcon from "@mui/icons-material/CurrencyExchange"; // Use any ETH icon you prefer
import axios from "axios";
import config from "../../../config";

const ListingsStats = ({ listingTotal, ethTotal }) => {
  const [freelancerTotal, setFreelancerTotal] = useState(0);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/api/users/freelancers`);
        setFreelancerTotal(Array.isArray(res.data) ? res.data.length : 0);
      } catch {
        setFreelancerTotal(0);
      }
    };
    fetchFreelancers();
  }, []);

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid >
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: "center" }}>
          <ListAltIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
          <Typography variant="h5" color="primary" fontWeight={700}>{listingTotal}</Typography>
          <Typography variant="body2">Total Listings</Typography>
        </Paper>
      </Grid>
      <Grid >
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: "center" }}>
          <PeopleIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
          <Typography variant="h5" color="info.main" fontWeight={700}>{freelancerTotal}</Typography>
          <Typography variant="body2">Freelancers</Typography>
        </Paper>
      </Grid>
      <Grid >
        <Paper elevation={3} sx={{ p: 2, borderRadius: 3, textAlign: "center" }}>
          <CurrencyEthereumIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
          <Typography variant="h5" color="success.main" fontWeight={700}>{ethTotal}</Typography>
          <Typography variant="body2">ETH Total</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ListingsStats;