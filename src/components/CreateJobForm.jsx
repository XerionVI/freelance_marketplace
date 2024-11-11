import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, Form, Alert } from "react-bootstrap";
import { getFreelanceEscrowContract } from "../utils/getFreelanceEscrow";

function CreateJobForm({ account }) {
  const [freelancerAddress, setFreelancerAddress] = useState("");
  const [deposit, setDeposit] = useState("");
  const [jobId, setJobId] = useState(null);
  const [message, setMessage] = useState("");

  // Function to create a new job
  const handleCreateJob = async () => {
    const contract = await getFreelanceEscrowContract(account); // Await the contract
    if (!contract) return;
  
    try {
      const tx = await contract.createJob(freelancerAddress, {
        value: ethers.parseEther(deposit),
      });
      const receipt = await tx.wait();
  
      // Log the full receipt
      console.log("Transaction receipt:", receipt);
  
      // Check if events array is present and has elements
      if (receipt.events && receipt.events.length > 0) {
        const createdJobId = receipt.events[0].args.jobId.toNumber();
        setJobId(createdJobId);
        setMessage(`Job created successfully with ID: ${createdJobId}`);
      } else {
        console.error("No events found in receipt.");
        setMessage("Job creation failed. No events found in receipt.");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      setMessage("Job creation failed. Check console for details.");
    }
  };
  
  

  // Function to mark a job as completed by the freelancer
  const handleCompleteJob = async () => {
    const contract = await getFreelanceEscrowContract(account); // Await the contract
    if (!contract || jobId === null) return;

    try {
      const tx = await contract.completeJob(jobId);
      await tx.wait();
      setMessage(`Job ${jobId} marked as completed by freelancer.`);
    } catch (error) {
      console.error("Error completing job:", error);
      setMessage("Job completion failed. Check console for details.");
    }
  };

  // Function to approve a job by the client and release funds
  const handleApproveJob = async () => {
    const contract = await getFreelanceEscrowContract(account); // Await the contract
    if (!contract || jobId === null) return;

    try {
      const tx = await contract.approveJob(jobId);
      await tx.wait();
      setMessage(`Job ${jobId} approved and funds released to freelancer.`);
    } catch (error) {
      console.error("Error approving job:", error);
      setMessage("Job approval failed. Check console for details.");
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

      {/* Only show actions if jobId exists */}
      {jobId !== null && (
        <>
          <h5 className="mt-4">Manage Job</h5>
          <p>Current Job ID: {jobId}</p>
          <Button variant="secondary" onClick={handleCompleteJob} className="mt-2">
            Mark Job as Completed
          </Button>
          <Button variant="success" onClick={handleApproveJob} className="mt-2 ml-2">
            Approve Job and Release Funds
          </Button>
        </>
      )}

      {message && <Alert className="mt-3">{message}</Alert>}
    </div>
  );
}

export default CreateJobForm;
