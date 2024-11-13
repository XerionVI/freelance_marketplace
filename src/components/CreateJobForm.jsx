import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, Form, Alert } from "react-bootstrap";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";

function CreateJobForm({ account, onJobCreated }) {
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [deposit, setDeposit] = useState("");
  const [message, setMessage] = useState("");

  // Function to create a new job
  const handleCreateJob = async () => {
    const contract = await getFreelanceEscrowContract(account);
    if (!contract) return;

    try {
      console.log("Creating job with contract:", contract);

      // Send the transaction
      const tx = await contract.createJob(freelancerAddress, {
        value: ethers.parseEther(deposit), // Convert ETH amount to Wei
      });
      console.log("Transaction sent:", tx);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      // Emit event and call onJobCreated to refresh job list
      onJobCreated(); // This will trigger the parent component to fetch the jobs list

      // setMessage(`Job created successfully! Job ID: ${receipt.events[0].args.jobId.toNumber()}`);
    } catch (error) {
      console.error("Error creating job:", error);
      setMessage("Job creation failed. Check console for details.");
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
          />
        </Form.Group>
        <Form.Group controlId="depositAmount">
          <Form.Label>Deposit Amount (ETH)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter amount in ETH"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" onClick={handleCreateJob} className="mt-3">
          Create Job
        </Button>
      </Form>

      {message && <Alert className="mt-3">{message}</Alert>}
    </div>
  );
}

export default CreateJobForm;
