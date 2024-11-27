import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, Form, Alert } from "react-bootstrap";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";

function CreateJobForm({ account, onJobCreated }) {
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [deposit, setDeposit] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateJob = async () => {
    const contract = await getFreelanceEscrowContract(account);
    if (!contract) return;

    try {
        const tx = await contract.createJob(freelancerAddress, {
            value: ethers.parseEther(deposit),
        });

        const receipt = await tx.wait();

        const eventFilter = contract.filters.JobCreated();
        const events = await contract.queryFilter(
            eventFilter,
            receipt.blockNumber,
            receipt.blockNumber
        );

        if (events.length > 0) {
            const { jobId, client, freelancer, amount } = events[0].args;

            const jobData = {
                jobId: Number(jobId),
                client,
                freelancer,
                amount: ethers.formatEther(amount),
                blockNumber: events[0].blockNumber,
                transactionHash: events[0].transactionHash,
            };

            // Save the job to the database
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jobData),
            });

            if (response.ok) {
                console.log("Job saved to database.");
                setMessage(`Job created and saved! Job ID: ${jobId}`);
            } else {
                console.error("Error saving job to database.");
                setMessage("Job created but failed to save to database.");
            }

            onJobCreated(jobData);
        } else {
            console.error("No JobCreated event found.");
            setMessage("Job creation succeeded, but no event found.");
        }
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
