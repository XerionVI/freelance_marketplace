import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { ethers } from "ethers";
import { getFreelanceEscrowContract } from "../../utils/getFreelanceEscrow";
import AddressDetails from "../files/AddressDetails";

function JobList({ account, filter }) {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapping for job status
  const statusMapping = {
    0: "Created",
    1: "Completed",
    2: "Approved",
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      if (!account) {
        console.error("Wallet not connected.");
        setLoading(false);
        return;
      }

      const contract = await getFreelanceEscrowContract(account);
      if (!contract) {
        console.error("Contract not initialized.");
        setLoading(false);
        return;
      }

      console.log("Fetching job IDs...");
      const jobIds = await contract.getAllJobIds();
      console.log("Job IDs fetched:", jobIds);

      if (!jobIds || jobIds.length === 0) {
        console.warn("No job IDs found.");
        setJobs([]);
        setLoading(false);
        return;
      }

      const jobs = [];
      for (const jobId of jobIds) {
        console.log(`Fetching details for job ID: ${jobId}`);
        const job = await contract.jobs(jobId);
        jobs.push({
          jobId: jobId.toString(),
          client: job.client,
          freelancer: job.freelancer,
          amount: ethers.formatEther(job.amount),
          status: job.status, // Status as integer from the contract
        });
      }

      setJobs(jobs);
    } catch (error) {
      console.error("Error fetching jobs from smart contract:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      fetchJobs();
    }
  }, [account]);

  useEffect(() => {
    const currentAccountAddress = account?.toLowerCase();
    if (!currentAccountAddress) return;

    const filtered =
      filter === "All Jobs"
        ? jobs
        : jobs.filter(
            (job) =>
              currentAccountAddress === job.client.toLowerCase() ||
              currentAccountAddress === job.freelancer.toLowerCase()
          );
    setFilteredJobs(filtered);
  }, [jobs, filter, account]);

  const handleAddressClick = (address) => {
    setSelectedAddress(address);
  };

  if (!account) {
    return (
      <Alert severity="warning" sx={{ mt: 3 }}>
        Please connect your wallet to view jobs.
      </Alert>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading jobs...
        </Typography>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 3 }}>
        No jobs found on the smart contract. Please create a job to get started.
      </Alert>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
        Job List
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Job ID</TableCell>
            <TableCell>Client</TableCell>
            <TableCell>Freelancer</TableCell>
            <TableCell>Amount (ETH)</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredJobs.map((job) => (
            <TableRow key={job.jobId}>
              <TableCell>{job.jobId}</TableCell>
              <TableCell>
                <Button
                  variant="text"
                  onClick={() => handleAddressClick(job.client)}
                >
                  {job.client}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="text"
                  onClick={() => handleAddressClick(job.freelancer)}
                >
                  {job.freelancer}
                </Button>
              </TableCell>
              <TableCell>{job.amount}</TableCell>
              <TableCell>{statusMapping[job.status] || "Unknown"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedAddress && (
        <AddressDetails
          address={selectedAddress}
          onClose={() => setSelectedAddress(null)}
        />
      )}
    </TableContainer>
  );
}

export default JobList;