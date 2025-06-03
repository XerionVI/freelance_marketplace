import React from "react";
import { Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const JobManagementActions = ({ job, account }) => {
  const navigate = useNavigate();

  return (
    <Stack direction="row" spacing={1}>
      <Button
        variant="contained"
        color="success"
        onClick={() => navigate(`/job-details/${job.job_id}`)}
      >
        Show Details
      </Button>
      {job.client?.toLowerCase() === account?.toLowerCase() && (
        <>
          {job.job_details_id ? (
            <Button
              variant="outlined"
              color="warning"
              onClick={() => navigate(`/edit-job-details/${job.job_id}`)}
            >
              Edit Details
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="info"
              onClick={() => navigate(`/add-job-details/${job.job_id}`)}
            >
              Add Details
            </Button>
          )}
        </>
      )}
    </Stack>
  );
};

export default JobManagementActions;