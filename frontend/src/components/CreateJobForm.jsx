import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, Form, Alert } from "react-bootstrap";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";
import config from "../config";

function CreateJobForm({ account, onJobCreated }) {
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [deposit, setDeposit] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateJob = async () => {
    const contract = await getFreelanceEscrowContract(account);
    if (!contract) return;

    setIsLoading(true);
    setMessage("");

    try {
      // Create the job on the blockchain
      const tx = await contract.createJob(freelancerAddress, {
        value: ethers.parseEther(deposit),
      });

      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      // Fetch the JobCreated event from the transaction receipt
      const eventFilter = contract.filters.JobCreated();
      const events = await contract.queryFilter(eventFilter, receipt.blockNumber, "latest");

      console.log("Events found:", events);

      if (events.length > 0) {
        const { jobId, client, freelancer, amount } = events[0].args;

        // Prepare job data for the backend
        const jobData = {
          client: account, // Use the currently logged-in wallet address
          freelancer,
          amount: ethers.formatEther(amount),
          blockNumber: events[0].blockNumber,
          transactionHash: events[0].transactionHash,
          status: "Pending", // Default status
        };

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          setMessage("Failed to save job: User is not authenticated.");
          setIsLoading(false);
          return;
        }

        // Save the job to the database
        const response = await fetch(`${config.API_BASE_URL}/api/jobs`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
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
      setMessage("Job creation failed. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h5>Create New Job</h5>
      <Form>
        <Form.Group controlId="freelancerAddress">
          <Form.Label>Freelancer Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter freelancer's address"
            value={freelancerAddress}
            onChange={(e) => setFreelancerAddress(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="depositAmount">
          <Form.Label>Deposit Amount (ETH)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount in ETH"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            required
          />
        </Form.Group>
        <Button
          variant="primary"
          onClick={handleCreateJob}
          className="mt-3"
          disabled={isLoading}
        >
          {isLoading ? "Creating Job..." : "Create Job"}
        </Button>
      </Form>

      {message && <Alert className="mt-3">{message}</Alert>}
    </div>
  );
}

export default CreateJobForm;