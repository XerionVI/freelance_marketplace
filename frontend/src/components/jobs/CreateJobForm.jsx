import React, { useState } from "react";
import { ethers } from "ethers";
import { Box, TextField, Button, Alert, Typography, CircularProgress } from "@mui/material";
import { getFreelanceEscrowContract } from "../../utils/getFreelanceEscrow";
import config from "../../config";

function CreateJobForm({ account, onJobCreated }) {
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [deposit, setDeposit] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreateJob = async () => {
  const contract = await getFreelanceEscrowContract(account);
  console.log("Contract address:", contract.target || contract.address);
  if (!contract) return;

  setIsLoading(true);
  setMessage("");
  setError("");

  try {
    // Validate inputs
    if (!ethers.isAddress(freelancerAddress)) {
      setError("Invalid freelancer address.");
      setIsLoading(false);
      return;
    }
    if (isNaN(deposit) || parseFloat(deposit) <= 0) {
      setError("Deposit amount must be a positive number.");
      setIsLoading(false);
      return;
    }

    // 1. Create the job on the blockchain
    const tx = await contract.createJob(freelancerAddress, {
      value: ethers.parseEther(deposit),
    });

    const receipt = await tx.wait();
    console.log("Transaction receipt:", receipt);

    // 2. Fetch the JobCreated event from the transaction receipt
    const eventFilter = contract.filters.JobCreated();
    const events = await contract.queryFilter(eventFilter, receipt.blockNumber, "latest");

    console.log("Events found:", events);

    if (events.length > 0) {
      const { jobId, client, freelancer, amount } = events[0].args;
      const contractJobId = Number(jobId);

      // 3. Double-check: Ensure the jobId exists on the contract
      const allJobIds = await contract.getAllJobIds();
      const jobIdExists = allJobIds.map(id => Number(id)).includes(contractJobId);

      if (!jobIdExists) {
        setError("Job ID from contract does not exist. Aborting save.");
        setIsLoading(false);
        return;
      }

      // 4. Prepare job data for the backend
      const jobData = {
        contractJobId, // on-chain job ID
        client: account,
        freelancer,
        amount: ethers.formatEther(amount),
        blockNumber: events[0].blockNumber,
        transactionHash: events[0].transactionHash,
        status: "Pending",
      };

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setMessage("Failed to save job: User is not authenticated.");
        setIsLoading(false);
        return;
      }

      // 5. Save the job to the database
      const response = await fetch(`${config.API_BASE_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("Job saved to database with jobId:", responseData.jobId);
        setMessage(`Job created and saved! Job ID: ${responseData.jobId}`);
        jobData.jobId = responseData.jobId;
      } else {
        console.error("Error saving job to database.");
        setMessage("Job created but failed to save to database.");
      }

      // Notify parent component if onJobCreated is provided
      if (typeof onJobCreated === "function") {
        console.log("Calling onJobCreated with jobData:", jobData);
        onJobCreated(jobData);
      } else {
        console.warn("onJobCreated is not a function.");
      }
    } else {
      console.error("No JobCreated event found.");
      setMessage("Job creation succeeded, but no event found.");
    }
  } catch (error) {
    console.error("Error creating job:", error);
    setError("Job creation failed. Check console for details.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create New Job
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <TextField
          fullWidth
          label="Freelancer Address"
          variant="outlined"
          margin="normal"
          value={freelancerAddress}
          onChange={(e) => setFreelancerAddress(e.target.value)}
          error={!!error && error.includes("address")}
          helperText={error && error.includes("address") ? error : ""}
        />
        <TextField
          fullWidth
          label="Deposit Amount (ETH)"
          variant="outlined"
          margin="normal"
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          error={!!error && error.includes("Deposit")}
          helperText={error && error.includes("Deposit") ? error : ""}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateJob}
          disabled={isLoading}
          fullWidth
          sx={{ mt: 2 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Create Job"}
        </Button>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mt: 3 }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

export default CreateJobForm;