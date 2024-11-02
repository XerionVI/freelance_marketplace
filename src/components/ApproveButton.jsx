import React, { useState } from "react";
import { getFreelanceEscrowContract } from "../utils/FreelanceEscrow.js";
import { Button, Form, Alert } from "react-bootstrap";

function ApproveJob() {
    const [jobId, setJobId] = useState("");
    const [message, setMessage] = useState("");

    const handleApprove = async () => {
        const contract = getFreelanceEscrowContract();
        if (!contract) return;

        try {
            const tx = await contract.approveJob(jobId);
            await tx.wait();
            setMessage(`Job ${jobId} approved successfully!`);
        } catch (error) {
            console.error("Approval failed:", error);
            setMessage("Approval failed. Check console for details.");
        }
    };

    return (
        <div>
            <h5>Approve Job</h5>
            <Form>
                <Form.Group controlId="jobId">
                    <Form.Label>Job ID</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter job ID"
                        value={jobId}
                        onChange={(e) => setJobId(e.target.value)}
                    />
                </Form.Group>
                <Button variant="success" onClick={handleApprove} className="mt-3">
                    Approve Job
                </Button>
            </Form>
            {message && <Alert className="mt-3">{message}</Alert>}
        </div>
    );
}

export default ApproveJob;
