import React, { useState } from "react";
import { getFreelanceEscrowContract } from "../utils/FreelanceEscrow";
import { Button, Form, Alert } from "react-bootstrap";
import { ethers } from "ethers";

function CreateJobForm() {
    const [freelancerAddress, setFreelancerAddress] = useState("");
    const [deposit, setDeposit] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateJob = async () => {
        const contract = getFreelanceEscrowContract();
        if (!contract) return;

        try {
            const tx = await contract.createJob(freelancerAddress, {
                value: ethers.utils.parseEther(deposit),
            });
            await tx.wait();
            setMessage("Job created and funds deposited successfully!");
        } catch (error) {
            console.error("Job creation failed:", error);
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
                    <Form.Label>Deposit Amount in ETH</Form.Label>
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
