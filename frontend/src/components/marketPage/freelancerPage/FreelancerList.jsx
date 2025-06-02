import React from "react";
import FreelancerCard from "./FreelancerCard";
import { Box } from "@mui/material";

const FreelancerList = ({ freelancers }) => (
  <Box>
    {freelancers.map(freelancer => (
      <FreelancerCard key={freelancer.id} freelancer={freelancer} />
    ))}
  </Box>
);

export default FreelancerList;